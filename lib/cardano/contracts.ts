"use client";

import { Lucid, Data, toUnit, fromText } from '@lucid-evolution/lucid';

// ============================================================================
// TYPESCRIPT TYPES (matching Aiken validators)
// ============================================================================

export type WasteType =
    | 'PET'
    | 'Nylon'
    | 'Aluminum'
    | 'EWaste'
    | 'Organic'
    | 'Other';

export interface WasteSubmissionDatum {
    wasteType: WasteType;
    quantity: bigint; // in grams (5,000 = 5kg)
    collectorPkh: string; // Authorized collector's pubkey hash
    timestamp: bigint;
    locationHash: string; // GPS hash for privacy
    ipfsCid: string; // Photo proof
}

export interface VerifyRedeemer {
    collector: string; // Collector's pubkey hash
    proofHash: string; // Verification proof hash
}

export interface CancelRedeemer {
    reason: string;
}

// Token reward rates (matching Aiken logic)
export const TOKEN_RATES: Record<WasteType, number> = {
    PET: 10,
    Nylon: 10,
    Aluminum: 15,
    EWaste: 50,
    Organic: 5,
    Other: 8,
};

// ============================================================================
// SMART CONTRACT ADDRESSES (to be deployed)
// ============================================================================

export const CONTRACT_ADDRESSES = {
    wasteValidator: 'addr_test1wpx...', // waste_receipt_validator
    nftPolicy: '8f3e2d1c...', // receipt_nft_policy
    tokenPolicy: '5a7b9e4f...', // reward_token_policy
};

// ============================================================================
// DATUM & REDEEMER SCHEMAS
// ============================================================================

const WasteSubmissionDatumSchema = Data.Object({
    wasteType: Data.Enum([
        Data.Literal('PET'),
        Data.Literal('Nylon'),
        Data.Literal('Aluminum'),
        Data.Literal('EWaste'),
        Data.Literal('Organic'),
        Data.Literal('Other'),
    ]),
    quantity: Data.Integer(),
    collectorPkh: Data.Bytes(),
    timestamp: Data.Integer(),
    locationHash: Data.Bytes(),
    ipfsCid: Data.Bytes(),
});

const VerifyRedeemerSchema = Data.Object({
    collector: Data.Bytes(),
    proofHash: Data.Bytes(),
});

const CancelRedeemerSchema = Data.Object({
    reason: Data.Bytes(),
});

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Submit waste for collection
 * Locks ADA at waste validator script address with datum
 */
export async function submitWasteSubmission(
    lucid: Lucid,
    wasteType: WasteType,
    quantityKg: number,
    collectorAddress: string,
    locationHash: string,
    ipfsCid: string
): Promise<string> {
    try {
        // Get collector's pubkey hash
        const collectorDetails = lucid.utils.getAddressDetails(collectorAddress);
        const collectorPkh = collectorDetails.paymentCredential?.hash;

        if (!collectorPkh) {
            throw new Error('Invalid collector address');
        }

        // Create datum
        const datum: WasteSubmissionDatum = {
            wasteType,
            quantity: BigInt(quantityKg * 1000), // Convert kg to grams
            collectorPkh,
            timestamp: BigInt(Date.now()),
            locationHash,
            ipfsCid,
        };

        const datumCbor = Data.to(datum, WasteSubmissionDatumSchema);

        // Build transaction
        const tx = await lucid
            .newTx()
            .pay.ToAddressWithData(
                CONTRACT_ADDRESSES.wasteValidator,
                { kind: 'inline', value: datumCbor },
                { lovelace: 2_000_000n } // 2 ADA locked
            )
            .complete();

        const signedTx = await tx.sign().complete();
        const txHash = await signedTx.submit();

        console.log('✅ Waste submission TX:', txHash);
        return txHash;
    } catch (error) {
        console.error('❌ Submit waste failed:', error);
        throw error;
    }
}

/**
 * Collector verifies and mints NFT receipt
 * Spends waste validator UTxO and mints NFT + tokens
 */
export async function verifyAndMintReceipt(
    lucid: Lucid,
    submissionTxHash: string,
    submissionOutputIndex: number,
    householdAddress: string,
    proofHash: string
): Promise<string> {
    try {
        const walletAddress = await lucid.wallet.address();
        const walletDetails = lucid.utils.getAddressDetails(walletAddress);
        const collectorPkh = walletDetails.paymentCredential?.hash;

        if (!collectorPkh) {
            throw new Error('Wallet not connected');
        }

        // Create verify redeemer
        const redeemer: VerifyRedeemer = {
            collector: collectorPkh,
            proofHash,
        };

        const redeemerCbor = Data.to(redeemer, VerifyRedeemerSchema);

        // Get the submission UTxO
        const utxo = {
            txHash: submissionTxHash,
            outputIndex: submissionOutputIndex,
        };

        // Build transaction
        const tx = await lucid
            .newTx()
            .collectFrom([utxo as any], redeemerCbor)
            .attach.SpendingValidator({
                type: 'PlutusV2',
                script: '...', // Will be loaded from compiled Aiken
            })
            .pay.ToAddress(householdAddress, { lovelace: 2_000_000n })
            .complete();

        const signedTx = await tx.sign().complete();
        const txHash = await signedTx.submit();

        console.log('✅ Verification + Mint TX:', txHash);
        return txHash;
    } catch (error) {
        console.error('❌ Verify and mint failed:', error);
        throw error;
    }
}

/**
 * Calculate expected token reward
 */
export function calculateTokenReward(wasteType: WasteType, quantityKg: number): number {
    return Math.floor(quantityKg * TOKEN_RATES[wasteType]);
}

/**
 * Check if wallet has required Cardano wallet extension
 */
export function isWalletInstalled(walletName: 'nami' | 'eternl' | 'lace'): boolean {
    if (typeof window === 'undefined') return false;

    const windowCardano = (window as any).cardano;
    if (!windowCardano) return false;

    switch (walletName) {
        case 'nami':
            return !!windowCardano.nami;
        case 'eternl':
            return !!windowCardano.eternl;
        case 'lace':
            return !!windowCardano.lace;
        default:
            return false;
    }
}

/**
 * Generate IPFS CID placeholder (for demo)
 * In production, this would upload to IPFS (NFT.Storage, Pinata, etc.)
 */
export async function uploadToIPFS(file: File): Promise<string> {
    // TODO: Implement actual IPFS upload
    // For now, return a mock CID
    const mockCid = `Qm${Math.random().toString(36).substring(2, 44)}`;
    console.log('📦 Mock IPFS CID:', mockCid);
    return mockCid;
}

/**
 * Hash GPS coordinates for privacy
 */
export function hashLocation(lat: number, lng: number): string {
    const locationString = `${lat.toFixed(6)},${lng.toFixed(6)}`;
    // Simple hash (in production, use blake2b)
    let hash = 0;
    for (let i = 0; i < locationString.length; i++) {
        hash = ((hash << 5) - hash) + locationString.charCodeAt(i);
        hash |= 0;
    }
    return hash.toString(16).padStart(16, '0');
}

export default {
    submitWasteSubmission,
    verifyAndMintReceipt,
    calculateTokenReward,
    isWalletInstalled,
    uploadToIPFS,
    hashLocation,
    TOKEN_RATES,
    CONTRACT_ADDRESSES,
};
