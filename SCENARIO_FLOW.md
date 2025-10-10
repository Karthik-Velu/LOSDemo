# Demo Scenario Flow Reference

## Scenario Outcomes (7 Total)

### ✅ APPROVED Scenarios (4)

1. **Prime Customer** 
   - KYC: Pass (Fraud Score: 10-40)
   - Credit: Ki Score = 18 (Excellent) → ✅ APPROVED
   - Proceeds to: Disbursement

2. **Low Risk Traditional**
   - KYC: Pass (Fraud Score: 10-40)
   - Credit: Ki Score = 32 (Good) → ✅ APPROVED
   - Proceeds to: Disbursement

3. **Young Professional**
   - KYC: Pass (Fraud Score: 10-40)
   - Credit: Ki Score = 38 (Good) → ✅ APPROVED
   - Proceeds to: Disbursement

4. **High Risk**
   - KYC: Pass (Fraud Score: 10-40)
   - Credit: Ki Score = 42 (Good) → ✅ APPROVED
   - Proceeds to: Disbursement

### ⚠️ REVIEW Scenario (1)

5. **Thin File - Alternate Data**
   - KYC: Pass (Fraud Score: 10-40)
   - Credit: Ki Score = 52 (Fair) → ⚠️ REVIEW
   - Shows: Manual review interface with approve/reject options

### ❌ REJECTED Scenarios (2)

6. **Fraud Rejection Case**
   - KYC: ❌ REJECTED (Fraud Score: 85)
   - Reason: Multiple identity mismatches, suspicious SIM/email tenure, anomalous transactions
   - Stops at: KYC page (does NOT proceed to Credit Check)

7. **Poor Bank Statement Case**
   - KYC: Pass (Fraud Score: 10-40)
   - Credit: Ki Score = 78 (Poor) → ❌ REJECTED
   - Reason: Very low balance (₹1,500), high DTI (68%), excessive outflows
   - Stops at: Credit Check page (does NOT proceed to Disbursement)

## Ki Score Ranges

- **1-25**: Excellent → Auto-Approve
- **26-45**: Good → Auto-Approve
- **46-60**: Fair → Manual Review
- **61-80**: Poor → Likely Reject
- **81-100**: Very Poor → Auto-Reject

## Implementation Notes

- `demo_scenario_id` is saved in Lead Registration
- KYC checks scenario and only rejects if `scenario === 'fraud_rejection'`
- Credit Check evaluates Ki Score thresholds:
  - `kiScore <= 45` → Approved
  - `kiScore >= 75` → Rejected
  - Otherwise → Review

