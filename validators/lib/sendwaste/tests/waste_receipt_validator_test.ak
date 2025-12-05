use aiken/collection/list
use sendwaste/waste_receipt_validator.{
  WasteDatum, WasteRedeemer, Verify, Cancel, waste_receipt,
}
use cardano/transaction.{OutputReference, InlineDatum, NoDatum, placeholder}
use vodka/vodka.{complete, mocktail_tx, required_signer_hash, tx_in, tx_out, valid_between}
use vodka/address.{mock_pub_key_address, mock_pub_key_hash, mock_script_address, mock_script_hash}
use vodka/assets.{mock_policy_id}
use vodka/reference.{mock_utxo_ref, mock_tx_hash}

// ============================================================================
// TEST CONSTANTS
// ============================================================================

const collector_pkh = mock_pub_key_hash(1)
const household_pkh = mock_pub_key_hash(2)
const script_hash = mock_script_hash(0)
const script_address = mock_script_address(0)
const collector_address = mock_pub_key_address(1, None)
const household_address = mock_pub_key_address(2, None)

// Sample valid datum
const valid_datum = WasteDatum {
  waste_type: "plastic_pet",
  quantity_kg: 15,
  collector_pkh: collector_pkh,
  timestamp: 1735689600000,  // 2025-01-01 00:00:00 UTC
  location_hash: "abuja_zone_3_garki",
  ipfs_cid: "QmXyZ123456789abcdefghijklmnopqrstuvwxyz12345",
}

const valid_proof = "proof_hash_from_ipfs_verification_service_xyz"
const cancellation_reason = "collector_unavailable_timeout_expired"

// ============================================================================
// HELPER constructors
// ============================================================================

fn make_waste_datum(quantity: Int, timestamp: Int, cid: ByteArray) -> WasteDatum {
  WasteDatum {
    waste_type: "plastic_pet",
    quantity_kg: quantity,
    collector_pkh: collector_pkh,
    timestamp: timestamp,
    location_hash: "abuja_zone_1",
    ipfs_cid: cid,
  }
}

// ============================================================================
// ✅ PASSING TESTS
// ============================================================================

/// Test 1: Valid verification with collector signature
test test_valid_verification() {
  let datum = valid_datum
  let redeemer = Verify { proof_hash: valid_proof }
  let own_ref = mock_utxo_ref(0)
  
  let tx = mocktail_tx()
    |> tx_in(own_ref, script_address, 10_000_000, InlineDatum(datum))
    |> tx_out(collector_address, 12_000_000, [], NoDatum)  // Include reward tokens
    |> required_signer_hash(collector_pkh)
    |> complete()
  
  let ctx = tx.script_context(Spend(own_ref))
  
  waste_receipt(script_hash, Some(datum), redeemer, own_ref, ctx)
}

/// Test 2: Valid cancellation after timelock expires (24+ hours)
test test_valid_cancellation_after_timelock() {
  let datum = valid_datum
  let redeemer = Cancel { reason: cancellation_reason }
  let own_ref = mock_utxo_ref(0)
  
  // 25 hours after submission (exceeds 24-hour window)
  let cancel_time = datum.timestamp + 90_000_000  // 25 hours in ms
  
  let tx = mocktail_tx()
    |> tx_in(own_ref, script_address, 10_000_000, InlineDatum(datum))
    |> tx_out(household_address, 10_000_000, [], NoDatum)  // Return to household
    |> valid_between(cancel_time, cancel_time + 1_800_000)  // 30 min window
    |> complete()
  
  let ctx = tx.script_context(Spend(own_ref))
  
  waste_receipt(script_hash, Some(datum), redeemer, own_ref, ctx)
}

/// Test 3: Valid verification with minimum quantity threshold (5kg)
test test_minimum_quantity_threshold() {
  let datum = make_waste_datum(5, 1735689600000, "QmValidCID46CharactersLongForIPFSContentIdentifier")
  let redeemer = Verify { proof_hash: valid_proof }
  let own_ref = mock_utxo_ref(0)
  
  let tx = mocktail_tx()
    |> tx_in(own_ref, script_address, 5_000_000, InlineDatum(datum))
    |> tx_out(collector_address, 5_500_000, [], NoDatum)
    |> required_signer_hash(collector_pkh)
    |> complete()
  
  let ctx = tx.script_context(Spend(own_ref))
  
  waste_receipt(script_hash, Some(datum), redeemer, own_ref, ctx)
}

/// Test 4: Batch verification - multiple separate transactions
test test_batch_verification_single_input_each() {
  // Each transaction should have only ONE script input
  let datum = valid_datum
  let redeemer = Verify { proof_hash: valid_proof }
  let own_ref = mock_utxo_ref(0)
  
  let tx = mocktail_tx()
    |> tx_in(own_ref, script_address, 10_000_000, InlineDatum(datum))
    |> tx_in(mock_utxo_ref(1), collector_address, 20_000_000, NoDatum)  // Collector's wallet input
    |> tx_out(collector_address, 30_000_000, [], NoDatum)
    |> required_signer_hash(collector_pkh)
    |> complete()
  
  let ctx = tx.script_context(Spend(own_ref))
  
  waste_receipt(script_hash, Some(datum), redeemer, own_ref, ctx)
}

// ============================================================================
// ❌ FAILING TESTS (Should return False)
// ============================================================================

/// Test 5: Reject verification without collector signature
test test_reject_verification_without_signature() fail {
  let datum = valid_datum
  let redeemer = Verify { proof_hash: valid_proof }
  let own_ref = mock_utxo_ref(0)
  
  let tx = mocktail_tx()
    |> tx_in(own_ref, script_address, 10_000_000, InlineDatum(datum))
    |> tx_out(household_address, 10_000_000, [], NoDatum)
    // Missing required_signer_hash(collector_pkh)
    |> complete()
  
  let ctx = tx.script_context(Spend(own_ref))
  
  waste_receipt(script_hash, Some(datum), redeemer, own_ref, ctx)
}

/// Test 6: Reject below minimum quantity threshold
test test_reject_below_minimum_quantity() fail {
  let datum = make_waste_datum(4, 1735689600000, "QmValidCID46CharactersLongForIPFSContentIdentifier")
  let redeemer = Verify { proof_hash: valid_proof }
  let own_ref = mock_utxo_ref(0)
  
  let tx = mocktail_tx()
    |> tx_in(own_ref, script_address, 5_000_000, InlineDatum(datum))
    |> tx_out(collector_address, 5_000_000, [], NoDatum)
    |> required_signer_hash(collector_pkh)
    |> complete()
  
  let ctx = tx.script_context(Spend(own_ref))
  
  waste_receipt(script_hash, Some(datum), redeemer, own_ref, ctx)
}

/// Test 7: Reject invalid IPFS CID (too short)
test test_reject_invalid_ipfs_cid() fail {
  let datum = make_waste_datum(10, 1735689600000, "short_cid")  // Invalid CID
  let redeemer = Verify { proof_hash: valid_proof }
  let own_ref = mock_utxo_ref(0)
  
  let tx = mocktail_tx()
    |> tx_in(own_ref, script_address, 10_000_000, InlineDatum(datum))
    |> tx_out(collector_address, 10_000_000, [], NoDatum)
    |> required_signer_hash(collector_pkh)
    |> complete()
  
  let ctx = tx.script_context(Spend(own_ref))
  
  waste_receipt(script_hash, Some(datum), redeemer, own_ref, ctx)
}

/// Test 8: Reject cancellation before timelock expires
test test_reject_early_cancellation() fail {
  let datum = valid_datum
  let redeemer = Cancel { reason: cancellation_reason }
  let own_ref = mock_utxo_ref(0)
  
  // Only 12 hours after submission (less than 24-hour window)
  let early_time = datum.timestamp + 43_200_000  // 12 hours
  
  let tx = mocktail_tx()
    |> tx_in(own_ref, script_address, 10_000_000, InlineDatum(datum))
    |> tx_out(household_address, 10_000_000, [], NoDatum)
    |> valid_between(early_time, early_time + 1_800_000)
    |> complete()
  
  let ctx = tx.script_context(Spend(own_ref))
  
  waste_receipt(script_hash, Some(datum), redeemer, own_ref, ctx)
}

/// Test 9: CRITICAL - Reject double-satisfaction attack (multiple script inputs)
test test_reject_double_satisfaction_attack() fail {
  let datum = valid_datum
  let redeemer = Verify { proof_hash: valid_proof }
  let own_ref = mock_utxo_ref(0)
  let other_script_ref = mock_utxo_ref(1)
  
  // Attacker tries to spend two script UTxOs in same transaction
  let tx = mocktail_tx()
    |> tx_in(own_ref, script_address, 10_000_000, InlineDatum(datum))
    |> tx_in(other_script_ref, script_address, 10_000_000, InlineDatum(datum))  // DOUBLE SPEND!
    |> tx_out(collector_address, 20_000_000, [], NoDatum)
    |> required_signer_hash(collector_pkh)
    |> complete()
  
  let ctx = tx.script_context(Spend(own_ref))
  
  // Should FAIL due to single_script_input check
  waste_receipt(script_hash, Some(datum), redeemer, own_ref, ctx)
}

/// Test 10: Reject verification with empty proof hash
test test_reject_empty_proof() fail {
  let datum = valid_datum
  let redeemer = Verify { proof_hash: "" }  // Empty proof
  let own_ref = mock_utxo_ref(0)
  
  let tx = mocktail_tx()
    |> tx_in(own_ref, script_address, 10_000_000, InlineDatum(datum))
    |> tx_out(collector_address, 10_000_000, [], NoDatum)
    |> required_signer_hash(collector_pkh)
    |> complete()
  
  let ctx = tx.script_context(Spend(own_ref))
  
  waste_receipt(script_hash, Some(datum), redeemer, own_ref, ctx)
}

/// Test 11: Reject cancellation with empty reason
test test_reject_empty_cancellation_reason() fail {
  let datum = valid_datum
  let redeemer = Cancel { reason: "" }  // Empty reason
  let own_ref = mock_utxo_ref(0)
  
  let cancel_time = datum.timestamp + 90_000_000
  
  let tx = mocktail_tx()
    |> tx_in(own_ref, script_address, 10_000_000, InlineDatum(datum))
    |> tx_out(household_address, 10_000_000, [], NoDatum)
    |> valid_between(cancel_time, cancel_time + 1_800_000)
    |> complete()
  
  let ctx = tx.script_context(Spend(own_ref))
  
  waste_receipt(script_hash, Some(datum), redeemer, own_ref, ctx)
}
