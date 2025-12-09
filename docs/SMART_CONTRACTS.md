# Smart Contract Documentation

## Overview

SendWaste uses Aiken smart contracts deployed on Cardano Preprod testnet to verify waste collection submissions and mint rewards.

## Contract Architecture

### Waste Verification Validator

**Purpose:** Validates waste submission data before accepting it on-chain.

**Validation Logic:**

1. GPS Coordinate Verification
   - Checks that GPS location data exists in submission
   - Validates coordinates fall within service area boundaries
   - Prevents submissions from outside operational zones

2. Photo Hash Verification
   - Generates blake2b_256 cryptographic hash of submitted photo
   - Compares hash against registry to detect duplicate submissions
   - Ensures photo has not been tampered with after capture

3. Duplicate Prevention
   - Maintains on-chain registry of submission hashes
   - Rejects submissions matching existing records
   - Prevents users from submitting same waste multiple times

4. Token Calculation
   - Calculates reward based on formula: tokens = weight_kg * 10
   - Validates weight is within acceptable range (0.1 to 100 kg)
   - Ensures calculated amount matches user expectation

### Token Minting Policy

**Purpose:** Controls creation and distribution of WASTE tokens.

**Minting Rules:**
- Tokens minted only after successful validation by waste verification validator
- Amount minted matches exact calculation from validator
- Tokens sent directly to submitter's wallet address
- Transaction includes NFT receipt metadata

### NFT Receipt Policy

**Purpose:** Creates permanent proof of waste collection contribution.

**NFT Metadata:**
- Transaction timestamp
- Waste type (PET, HDPE, PVC, etc.)
- Weight in kilograms
- GPS coordinates (hashed for privacy)
- Photo hash
- Tokens awarded
- Unique transaction identifier

**Standards Compliance:**
- Follows Cardano CIP-25 NFT metadata standard
- Ensures compatibility with Cardano wallet displays
- Enables verification by third parties

## Deployment Details

**Network:** Cardano Preprod Testnet  
**Language:** Aiken smart contract language  
**Compiler Version:** Aiken 1.1.0+  

**Contract Addresses:**
(Testnet deployment addresses will be added here after mainnet migration documented)

## Security Measures

**Anti-Double-Spend:**
Single script input validation ensures each UTxO can only be spent once, preventing double-counting of waste submissions.

**Signature Verification:**
Only authorized collector wallets can mark submissions as verified, preventing unauthorized claiming of rewards.

**Time Locks:**
24-hour verification window after submission. After expiration, submission can be canceled and returned to user.

**Geofencing:**
GPS validation restricts submissions to defined service areas (currently Abuja metropolitan region), preventing fraud from outside operational zones.

## Testing

**Test Coverage:**
- Valid submission with correct GPS and photo hash
- Valid cancellation after timelock expiration
- Rejection of submissions without GPS data
- Rejection of duplicate photo hashes
- Rejection of submissions from unauthorized zones
- Prevention of token minting without validation
- Correct token calculation across weight ranges

**Running Tests:**

```bash
cd validators
aiken check
```

Expected output: All tests passing with green checkmarks.

## Future Enhancements

**Mainnet Deployment:**
Planned for Q1 2025 after completion of security audit and pilot program validation.

**Optimizations:**
- Batch verification for multiple submissions
- Reduced transaction fees through UTxO consolidation
- Enhanced photo verification using zero-knowledge proofs

**Additional Features:**
- Multi-signature collector verification
- Weight estimation validation
- Reputation scoring for collectors
- Automated payout scheduling
