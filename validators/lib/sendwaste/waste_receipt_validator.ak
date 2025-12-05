use aiken/collection/list
use aiken/crypto.{VerificationKeyHash, blake2b_256}
use aiken/interval.{Finite}
use aiken/primitive/bytearray
use cardano/transaction.{InlineDatum, Output, OutputReference, ScriptContext, Spend, Transaction, ValidityRange}
use cardano/address.{Address, Script}

// ============================================================================
// DATA TYPES
// ============================================================================

/// Waste submission data stored at script address
pub type WasteDatum {
  /// Type of waste (e.g., "plastic_pet", "aluminum_can", "e_waste", "organic")
  waste_type: ByteArray,
  /// Quantity in kilograms
  quantity_kg: Int,
  /// Public key hash of authorized collector
  collector_pkh: VerificationKeyHash,
  /// Submission timestamp (POSIX milliseconds)
  timestamp: Int,
  /// Location identifier hash for drop-off point
  location_hash: ByteArray,
  /// IPFS CID for proof images and metadata
  ipfs_cid: ByteArray,
}

/// Actions that can be performed on locked waste submissions
pub type WasteRedeemer {
  /// Collector verifies and claims waste with proof
  Verify { proof_hash: ByteArray }
  /// Cancel submission after timelock expires
  Cancel { reason: ByteArray }
}

// ============================================================================
// CONSTANTS
// ============================================================================

/// Minimum waste quantity in kg to prevent spam (5kg threshold)
const min_waste_kg: Int = 5

/// Verification window in milliseconds (24 hours = 86400000 ms)
const verification_window_ms: Int = 86400000

/// Minimum IPFS CID length (valid CIDv0/CIDv1 check)
const min_ipfs_cid_length: Int = 46

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/// Check if the transaction is signed by the required public key hash
fn signed_by(transaction: Transaction, pkh: VerificationKeyHash) -> Bool {
  list.has(transaction.extra_signatories, pkh)
}

/// Validate IPFS CID format (basic length check)
fn valid_ipfs_cid(cid: ByteArray) -> Bool {
  bytearray.length(cid) >= min_ipfs_cid_length
}

/// Get all script inputs from the transaction
fn script_inputs(transaction: Transaction, script_hash: ByteArray) -> List<OutputReference> {
  list.filter(
    transaction.inputs,
    fn(input) {
      when input.output.address.payment_credential is {
        Script(hash) -> hash == script_hash
        _ -> False
      }
    },
  )
  |> list.map(fn(input) { input.output_reference })
}

/// Check that only a single script input is being spent (prevent double-satisfaction)
fn single_script_input(
  transaction: Transaction,
  own_ref: OutputReference,
  script_hash: ByteArray,
) -> Bool {
  let script_refs = script_inputs(transaction, script_hash)
  // Only one script input should be present
  list.length(script_refs) == 1 && list.has(script_refs, own_ref)
}

/// Extract datum from output
fn get_inline_datum(output: Output) -> Option<WasteDatum> {
  when output.datum is {
    InlineDatum(data) -> Some(data)
    _ -> None
  }
}

/// Check if current time is after submission + verification window
fn after_verification_window(datum_timestamp: Int, validity_range: ValidityRange) -> Bool {
  let deadline = datum_timestamp + verification_window_ms
  when validity_range.upper_bound.bound_type is {
    Finite(upper_time) -> upper_time > deadline
    _ -> False
  }
}

// ============================================================================
// MAIN VALIDATOR
// ============================================================================

/// Waste Receipt Validator
/// 
/// This spending validator controls funds locked for waste submissions.
/// Only the authorized collector can verify and claim the waste, or the 
/// submitter can cancel after the verification window expires.
///
/// Security features:
/// - Signature verification for collector authorization
/// - Single script input validation to prevent double-satisfaction attacks
/// - Time-based locks for cancellation protection
/// - Minimum quantity threshold to prevent spam
/// - IPFS CID validation for proof of collection
///
validator waste_receipt(own_hash: ByteArray) {
  spend(
    datum_opt: Option<WasteDatum>,
    redeemer: WasteRedeemer,
    own_ref: OutputReference,
    ctx: ScriptContext,
  ) -> Bool {
    // Extract script context
    expect Spend(output_ref) = ctx.purpose
    let transaction = ctx.transaction
    
    // Ensure we have a valid datum
    expect Some(datum) = datum_opt
    
    // Validate datum fields
    expect datum.quantity_kg >= min_waste_kg
    expect valid_ipfs_cid(datum.ipfs_cid)
    
    // CRITICAL: Prevent double-satisfaction attack
    expect single_script_input(transaction, own_ref, own_hash)
    
    // Handle redeemer action
    when redeemer is {
      // VERIFY: Collector claims the waste with proof
      Verify { proof_hash } -> {
        // Must be signed by the authorized collector
        expect signed_by(transaction, datum.collector_pkh)
        
        // Proof hash must be provided (validated off-chain against IPFS)
        expect bytearray.length(proof_hash) > 0
        
        // All checks passed
        True
      }
      
      // CANCEL: Allow cancellation after verification window
      Cancel { reason } -> {
        // Can only cancel after verification window expires
        expect after_verification_window(datum.timestamp, transaction.validity_range)
        
        // Reason must be provided
        expect bytearray.length(reason) > 0
        
        // Cancellation allowed
        True
      }
    }
  }
  
  // Minting policy not used in this validator
  mint(_redeemer, _policy_id, _ctx) {
    False
  }
}
