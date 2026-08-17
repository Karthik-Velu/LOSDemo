# Demo Scenario Flow Reference

> Note: the outcome table below describes the original India scenario set. The Africa (Kenya) scenarios and the
> Street Vendor (Daily EDI) scenario were added later and have their own flows — see below and `docs/`.

## Street Vendor — Daily EDI (`vendor_daily_edi`)

Region: **APAC** → select the *Street Vendor (Daily EDI)* card on the intro screen.

Flow (7 journey steps, no separate KYC step — identity is verified digitally inside lead registration):

1. **Application** — Meena R, Pondy Bazaar Chennai, ₹30,000. ID fields hidden; masked verification chip instead.
2. **Business Profile** — trade, shop type, market, years, daily sales slider (₹500–₹10,000, default ₹2,200), weekly no-due day.
3. **Consent & Income Read** — plain-language consent → OTP → account link → income estimation (₹640/day).
4. **Credit Assessment** — ki score 34, ₹30,000 approved, 120-day tenor, ~99 collection days, daily instalment ≈ ₹320, 30% APR.
   The amount slider (₹10,000–₹2,00,000) recalculates the instalment live and flips the decision to **Refer** above the
   capacity ceiling (~₹37,500 — instalment > 18% of daily sales).
5. **Mandate Setup** — UPI Autopay primary (as-presented, ₹1,000 cap, 21:30–23:00 window) + NACH fallback (as-and-when-presented,
   maximum amount ₹2,000, arrears sweep). Either rail can be chosen as primary.
6. **Disbursement** — daily-EDI loan summary, agreement worded for the daily construct, then hand-off to collections.
7. **Collections Dashboard** — *This Loan* tab: today's mandate run (runnable, with a simulate-failure toggle showing the
   retry ladder), mandate health, 120-day repayment calendar, 14-day mandate ledger, open exceptions.
   *Collections Ops* tab: portfolio aggregates, rail success rates, failure reasons, execution-window split, exception queue.

All numbers derive from `src/lib/vendorDemo.ts` — change the pricing or the no-due-day rules there and every screen follows.
Feasibility constraints behind the construct: `docs/VENDOR_DAILY_MANDATE_FEASIBILITY.md`. Presenter script:
`docs/DEMO_SCRIPT_VENDOR_DAILY.md`.

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

