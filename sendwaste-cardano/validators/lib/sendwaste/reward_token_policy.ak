use aiken/crypto.{VerificationKeyHash}
use aiken/collection/list
use aiken/primitive/bytearray
use cardano/transaction.{Mint, ScriptContext, Transaction}
use cardano/assets.{PolicyId}

// ============================================================================
// DATA TYPES
// ============================================================================

/// Reward token configuration (fungible tokens)
pub type RewardConfig {
  /// Admin public key hash for token management
  admin_pkh: VerificationKeyHash,
  /// Maximum tokens that can be minted per transaction
  max_mint_per_tx: Int,
}

/// Token reward rates by waste type (tokens per kg)
pub type WasteRewardRate {
  waste_type: ByteArray,
  tokens_per_kg: Int,
}

/// Minting redeemer for reward tokens
pub type RewardRedeemer {
  /// Mint tokens based on waste verification
  MintReward {
    waste_type: ByteArray,
    quantity_kg: Int,
  }
  /// Burn tokens for redemption at recycler hubs
  BurnReward {
    amount: Int,
  }
}

// ============================================================================
// CONSTANTS
// ============================================================================

/// Asset name for the WASTE reward token
const waste_token_name: ByteArray = "WASTE"

/// Reward rates (tokens per kg by waste type)
const plastic_rate: Int = 10      // PET bottles, nylon
const aluminum_rate: Int = 15      // Cans
const ewaste_rate: Int = 50        // Electronics
const organic_rate: Int = 5        // Compostable waste
const default_rate: Int = 8        // Other recyclables

/// Maximum tokens per single transaction
const max_tokens_per_tx: Int = 1000

// ============================================================================
// HELPER FUNCTIONS
// ==================================================================
=========

/// Check if transaction is signed by admin
fn signed_by(transaction: Transaction, pkh: VerificationKeyHash) -> Bool {
  list.has(transaction.extra_signatories, pkh)
}

/// Get reward rate for waste type
fn get_reward_rate(waste_type: ByteArray) -> Int {
  if waste_type == "plastic_pet" || waste_type == "plastic_nylon" {
    plastic_rate
  } else if waste_type == "aluminum_can" {
    aluminum_rate
  } else if waste_type == "e_waste" || waste_type == "electronics" {
    ewaste_rate
  } else if waste_type == "organic" || waste_type == "compost" {
    organic_rate
  } else {
    default_rate
  }
}

/// Calculate tokens to mint based on waste quantity and type
fn calculate_tokens(waste_type: ByteArray, quantity_kg: Int) -> Int {
  let rate = get_reward_rate(waste_type)
  rate * quantity_kg
}

/// Verify minted amount matches expected calculation
fn verify_mint_amount(
  transaction: Transaction,
  policy_id: PolicyId,
  expected_amount: Int,
) -> Bool {
  when list.filter(
    transaction.mint |> assets.flatten(),
    fn(asset) {
      let (pid, name, _qty) = asset
      pid == policy_id && name == waste_token_name
    },
  ) is {
    [(_, _, actual_qty)] -> actual_qty == expected_amount
    _ -> False
  }
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

/// Reward Token Minting Policy
/// 
/// This policy controls the $WASTE fungible reward token that incentivizes
/// proper waste disposal and recovery. Tokens are minted when collectors
/// verify waste and can be burned for redemption at recycler hubs.
///
/// Token Economics:
/// - Plastic (PET): 10 tokens/kg
/// - Aluminum: 15 tokens/kg
/// - E-waste: 50 tokens/kg
/// - Organic: 5 tokens/kg
/// - Other: 8 tokens/kg
///
/// Rules:
/// - Maximum 1000 tokens per transaction
/// - Minting requires admin signature (collector verification service)
/// - Burning allowed by any token holder
///
validator reward_token_policy(config: RewardConfig) {
  mint(redeemer: RewardRedeemer, policy_id: PolicyId, ctx: ScriptContext) -> Bool {
    expect Mint(own_policy_id) = ctx.purpose
    let transaction = ctx.transaction
    
    when redeemer is {
      // MINT: Issue reward tokens for verified waste
      MintReward { waste_type, quantity_kg } -> {
        // Calculate expected token amount
        let token_amount = calculate_tokens(waste_type, quantity_kg)
        
        // Enforce maximum per transaction
        expect token_amount <= config.max_mint_per_tx
        expect token_amount > 0
        
        // Must be signed by admin (collector verification service)
        expect signed_by(transaction, config.admin_pkh)
        
        // Verify correct amount is being minted
        expect verify_mint_amount(transaction, own_policy_id, token_amount)
        
        True
      }
      
      // BURN: Redeem tokens at recycler hubs
      BurnReward { amount } -> {
        expect amount > 0
        
        // Verify we're burning (negative quantity)
        expect verify_mint_amount(transaction, own_policy_id, -amount)
        
        // No signature required for burning (holder can burn their tokens)
        True
      }
    }
  }
  
  // Spending not used in minting policy
  spend(_datum, _redeemer, _ref, _ctx) {
    False
  }
}
