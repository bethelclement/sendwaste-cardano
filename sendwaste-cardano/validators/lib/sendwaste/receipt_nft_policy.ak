use aiken/crypto.{VerificationKeyHash, blake2b_256}
use aiken/primitive/bytearray
use aiken/collection/list
use cardano/transaction.{Mint, OutputReference, ScriptContext, Transaction}
use cardano/assets.{PolicyId, AssetName}

// ============================================================================
// DATA TYPES
// ============================================================================

/// NFT Receipt Metadata following CIP-25 standard
pub type ReceiptMetadata {
  /// Name of the NFT receipt
  name: ByteArray,
  /// IPFS URI for receipt image/proof
  image: ByteArray,
  /// Waste type for this receipt
  waste_type: ByteArray,
  /// Quantity in kg
  quantity_kg: Int,
  /// Collection location
  location: ByteArray,
  /// Timestamp of verification
  verified_at: Int,
  /// Collector public key hash
  collector: VerificationKeyHash,
}

/// Minting policy redeemer
pub type ReceiptRedeemer {
  /// Mint a new waste receipt NFT
  MintReceipt { 
    /// Reference to the waste submission UTxO being verified
    waste_utxo_ref: OutputReference,
    /// Receipt metadata
    metadata: ReceiptMetadata,
  }
  /// Burn an existing receipt (for corrections/disputes)
  BurnReceipt {
    /// Original collector authorization
    collector_pkh: VerificationKeyHash,
  }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/// Check if transaction is signed by required PKH
fn signed_by(transaction: Transaction, pkh: VerificationKeyHash) -> Bool {
  list.has(transaction.extra_signatories, pkh)
}

/// Validate that metadata fields are non-empty
fn valid_metadata(metadata: ReceiptMetadata) -> Bool {
  bytearray.length(metadata.name) > 0 &&
  bytearray.length(metadata.image) > 0 &&
  bytearray.length(metadata.waste_type) > 0 &&
  metadata.quantity_kg > 0 &&
  bytearray.length(metadata.location) > 0
}

/// Check that exactly one token is being minted/burned
fn single_token_mint(transaction: Transaction, policy_id: PolicyId) -> Bool {
  when list.filter(
    transaction.mint |> assets.flatten(),
    fn(asset) {
      let (pid, _name, quantity) = asset
      pid == policy_id
    },
  ) is {
    [(_, _, qty)] -> abs(qty) == 1  // Exactly one token (mint or burn)
    _ -> False
  }
}

/// Verify that the waste UTxO reference exists in transaction inputs
fn waste_utxo_consumed(transaction: Transaction, waste_ref: OutputReference) -> Bool {
  list.any(
    transaction.inputs,
    fn(input) { input.output_reference == waste_ref },
  )
}

/// Generate deterministic asset name from waste UTxO reference
fn generate_asset_name(waste_ref: OutputReference) -> AssetName {
  // Create unique asset name: "WASTE_" + blake2b_256(tx_hash + output_index)
  let ref_bytes = bytearray.concat(
    waste_ref.transaction_id,
    bytearray.from_int(waste_ref.output_index),
  )
  let hash = blake2b_256(ref_bytes)
  bytearray.concat("WASTE_", bytearray.take(hash, 28))  // 32 byte limit for asset name
}

/// Absolute value helper
fn abs(x: Int) -> Int {
  if x < 0 {
    -x
  } else {
    x
  }
}

// ============================================================================
// MAIN POLICY
// ============================================================================

/// Receipt NFT Minting Policy
/// 
/// This policy controls the minting of waste recovery receipt NFTs following
/// the CIP-25 metadata standard. Each NFT represents a verified waste collection
/// event and serves as an immutable proof of recovery.
///
/// Rules:
/// - Exactly one NFT per waste submission
/// - Asset name derived from waste UTxO reference (deterministic)
/// - Metadata must follow CIP-25 structure
/// - Minting requires consuming the original waste submission UTxO
/// - Burning requires collector authorization
///
validator receipt_nft_policy {
  mint(redeemer: ReceiptRedeemer, policy_id: PolicyId, ctx: ScriptContext) -> Bool {
    expect Mint(own_policy_id) = ctx.purpose
    let transaction = ctx.transaction
    
    // Ensure only one token is minted/burned
    expect single_token_mint(transaction, own_policy_id)
    
    when redeemer is {
      // MINT: Create new waste receipt NFT
      MintReceipt { waste_utxo_ref, metadata } -> {
        // Validate metadata completeness
        expect valid_metadata(metadata)
        
        // Verify the waste submission UTxO is being consumed
        expect waste_utxo_consumed(transaction, waste_utxo_ref)
        
        // Generate deterministic asset name
        let expected_asset_name = generate_asset_name(waste_utxo_ref)
        
        // Verify transaction is signed by the collector
        expect signed_by(transaction, metadata.collector)
        
        // Verify the correct asset name is being minted
        expect list.any(
          transaction.mint |> assets.flatten(),
          fn(asset) {
            let (_pid, name, qty) = asset
            name == expected_asset_name && qty == 1
          },
        )
        
        True
      }
      
      // BURN: Destroy receipt (for disputes/corrections)
      BurnReceipt { collector_pkh } -> {
        // Must be signed by the original collector
        expect signed_by(transaction, collector_pkh)
        
        // Verify we're burning (negative quantity)
        expect list.any(
          transaction.mint |> assets.flatten(),
          fn(asset) {
            let (_pid, _name, qty) = asset
            qty == -1
          },
        )
        
        True
      }
    }
  }
  
  // Spending not used in minting policy
  spend(_datum, _redeemer, _ref, _ctx) {
    False
  }
}
