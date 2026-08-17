# Daily-EDI collection on UPI Autopay and NACH — what actually constrains this

Research note supporting the Street Vendor (Daily EDI) demo. Written for the product conversation behind the demo, not for
the screen. Everything below is desk research against public NPCI/RBI-derived sources plus arithmetic on the demo's own
numbers; nothing here is drawn from Kaleidofin production data. Where a constraint is dated or evolving it is flagged as
something to confirm with the sponsor bank / PSP before a pilot.

**Bottom line:** a daily-instalment loan collected on a UPI Autopay mandate is workable, and the demo reflects how it has to
be built. But three things in the naive version of this product do not survive contact with the rails: presenting a debit at
the natural end-of-trading moment, using NACH as the daily rail, and treating a missed day as a delinquency event. A fourth
problem is arithmetic rather than plumbing — see §3.1.

---

## 1. UPI Autopay — the primary rail

### 1.1 Daily frequency is supported; the friction is elsewhere
UPI Autopay mandates support daily, weekly, monthly and "as presented" frequencies, with fixed or variable amounts. Nothing
about a daily instalment is exotic at the rail level.

**Design implication (built into the demo):** register the mandate as **as presented with a maximum amount**, not as a fixed
daily frequency. Fixed-daily implies a debit every day, which then has to be reconciled against no-due days and holidays, and
leaves no room to sweep a missed day together with the current one. As-presented makes the no-due day a non-event: it is
simply a day on which nothing is presented.

### 1.2 The 24-hour pre-debit notification is the real operational tax
RBI's e-mandate framework requires a pre-debit notification (PDN) at least 24 hours before every debit, carrying the exact
amount and an option to cancel. NPCI enforces this in the Autopay operating guidelines, and industry practice runs the
notification 24–48 hours ahead.

On a monthly product that is one notification per loan per month. On this product it is **roughly 100 notifications per
loan** over a 120-day tenor. Consequences:

- PDN delivery becomes a dependency of collection, not a courtesy. If the notification fails, the debit cannot be presented.
  The demo therefore carries "pre-debit notification not delivered" as a first-class failure reason in the ops view, not as a
  technical footnote.
- There is an SMS/notification cost per collection day, small individually and not trivial at book scale.
- There is a borrower-experience cost: ~100 pre-debit notices plus ~100 debit confirmations over four months is a lot of
  messages for someone who may be new to formal credit. Worth testing a consolidated daily notice and keeping per-debit
  receipts in-app.
- Category exemptions from the 24-hour PDN exist (FASTag, NCMC, RuPay credit card recurring). **A small-ticket EDI loan is not
  in an exempt category** — do not plan around an exemption without written confirmation.

### 1.3 Execution windows: you cannot debit when you would most want to
Under NPCI's guidelines on UPI and API usage (notified 21 May 2025, enforced from 1 August 2025), recurring Autopay
executions are restricted to non-peak windows — **before 10:00, 13:00–17:00, and after 21:30** — with 10:00–13:00 and
17:00–21:30 held as peak bands.

This directly hits the intuitive design for a vendor loan, which is to collect in the early evening as trade winds down.
That sits inside the blocked 17:00–21:30 band. The workable pattern, and the one the demo shows:

- **primary presentation after 21:30**, once the day's trade is done and the account is at its fullest;
- **retries in the pre-10:00 window** the next morning, after any overnight float or morning sales land;
- the 13:00–17:00 window as a third bite.

### 1.4 Retries are capped
NPCI allows **one execution plus up to three retries** per mandate cycle. Combined with a daily cycle this is generous per
day but unforgiving across days: a borrower having a bad week cannot be retried indefinitely, and each day's arrear has to be
carried forward deliberately rather than accumulating silently in a retry queue. The demo models exactly this — one execution
plus three retries, then the instalment moves to the arrears sweep.

### 1.5 Amount caps are not a constraint here, but set the mandate cap with intent
The e-mandate AFA waiver runs to ₹15,000 per debit for general categories (the ₹1 lakh limit applies to specified categories
— mutual fund SIPs, insurance premiums, credit card bills — and a loan EDI is not one of them). At ₹320 a day this is
irrelevant to the instalment itself. It matters for the **mandate cap**: set it high enough to sweep a missed day alongside
the current one (the demo uses ₹1,000), low enough to be defensible to the borrower, and comfortably under ₹15,000 so no
debit ever needs re-authentication.

### 1.6 Mandate revocation is the structural failure mode, not insufficient balance
Publicly reported industry data puts UPI Autopay revocations in the tens of millions per month, driven substantially by
customers with low balances cancelling mandates rather than facing repeated failed debits. On a daily product, every day is
another opportunity to revoke.

This is why the demo surfaces mandate status as its own panel rather than burying it in a failure code: a revoked mandate is
not a collection failure to be retried, it is a borrower-contact event that needs a re-mandate. Plan for a re-mandate journey
and measure time-to-re-mandate.

### 1.7 To confirm before pilot
RBI's Authentication Mechanisms for Digital Payment Transactions Directions, 2025 move domestic digital payments to two
factors from different categories from 1 April 2026. Recurring mandate executions have historically been carved out of
per-transaction AFA, but the carve-out and its conditions should be confirmed in writing with the sponsor bank and PSP rather
than assumed.

---

## 2. NACH — the fallback rail, not the daily rail

NACH has been available on all days of the week since 1 August 2021, so weekends and holidays are not the blocker they once
were. Three things still are:

1. **It clears in files with a T+1 return cycle.** You do not know a debit failed until the next day. On a monthly product
   that is a rounding error; on a daily product your arrears position is permanently one day stale, and a same-day retry
   ladder is impossible.
2. **The economics are wrong at this ticket size.** Per-presentation sponsor-bank fees plus destination-bank return charges
   (commonly ₹100–₹500 per bounce, before any lender-side penal charge) are grossly disproportionate to a ₹320 instalment. A
   single bounce can cost more than the instalment it failed to collect. Presenting daily NACH debits on a small EDI loan is
   a reliable way to convert a performing loan into an expensive one.
3. **Registration friction and T+1 activation.** e-NACH authorisation via net banking or debit card is heavier than a UPI PIN
   approval, and activation completes on T+1 — so it cannot be relied on for a day-1 debit against a same-day disbursal.

**Therefore:** register NACH at onboarding, with frequency **"as and when presented"** and debit type **maximum amount**, and
use it as a **weekly or on-demand arrears sweep** — one presentation recovering several missed instalments inside the cap.
That is one presentation per week rather than seven, which fixes the economics, and it gives a second claim on the account
that survives a UPI mandate revocation. This is exactly the construct in the demo.

---

## 3. Product-level impracticalities

### 3.1 The scripted instalment does not reconcile — fix the number before it reaches a slide
The originating brief scripts ₹30,000 over 120 days at a daily instalment of ~₹289. With a weekly no-due day and three
public holidays, a 120-day tenor contains **about 100 collection days**, so ₹289 × 100 = **₹28,900 — less than the principal
disbursed**. The number cannot be right as stated. There are two coherent readings, and they are very different products:

| Reading | Construct | Implied pricing |
|---|---|---|
| 120 *collection days* | ~140 calendar days once no-due days are added; total collected ₹34,680 | Because a level daily instalment amortises fast, average outstanding is roughly half the principal — this works out near **80% effective APR**. Defensible against informal-market rates of 40–80%+, but not a number to present as the product price. |
| 120 *calendar days* (the brief's tenor) | ~100 collection days | At ~30% APR reducing, total ≈ ₹31,600, giving a daily instalment of **≈ ₹316–320** |

The demo implements the second reading and shows its arithmetic on screen: ₹30,000 · 120 days · 99 collection days · ₹320 a
day · 30% APR · ₹31,627 total. The pricing constant lives in one place (`src/lib/vendorDemo.ts`) so the product team can set
the real rate and every screen follows.

The general trap, worth stating to anyone designing this product: **a daily-amortising loan is much shorter in duration than
its tenor suggests.** Quoting a flat-looking daily instalment without converting to a reducing-balance rate will overstate
affordability and understate price.

### 3.2 A vendor's bank balance is a weak claim on a vendor's income
The product debits an account. The borrower earns in a market, substantially in cash, and any digital receipts may be swept
out to other uses within hours. That mismatch — not credit risk — is what produces most failed debits, and it is why
insufficient balance dominates the failure-reason mix in the demo's ops view.

Stronger constructs, worth piloting alongside rather than instead of:

- **Split at UPI QR settlement.** Deduct the instalment from the vendor's merchant receivables at settlement, before the
  money reaches the account. This collects at the point of sale and self-scales with a good day. It requires the vendor to
  accept payments through the lender's or a partner PSP's QR, which is a sourcing constraint, not a rail constraint.
- **Borrower-initiated daily push** with a reminder, as a dignity-preserving alternative for borrowers who dislike autopay.
- **Prepayment tolerance**: let a good day cover the next slow day, and reflect it in the schedule rather than as an
  unallocated credit.

### 3.3 Delinquency, penal charges and reporting do not map to a daily cycle
- **Charges.** A bounce charge on a single missed daily instalment would frequently exceed the instalment. Under RBI's penal
  charges directions, charges must be reasonable and proportionate and cannot be capitalised. The demo states explicitly that
  no penal charge applies to a single missed daily instalment; charge, if at all, on sustained arrears.
- **Delinquency definition.** Missing one of six collection days in a week is not a 1-DPD event in any meaningful sense.
  Define delinquency internally in **consecutive missed instalments** and map it to a DPD equivalent for classification and
  reporting, rather than letting a daily schedule drive daily DPD.
- **Bureau reporting stays monthly.** The rich daily signal is an internal early-warning and limit-growth asset, not
  something the bureau can consume at that granularity.

### 3.4 Operational load is real, and only survivable if it is exception-driven
Roughly 100 collection events per loan means a 1,000-loan book generates on the order of 100,000 events a quarter, each with
a notification, a presentation, a response and a ledger posting. This is only viable if nobody looks at the successes. The
dashboard in the demo is built on that principle: a portfolio view, a failure-reason breakdown, and an exception queue of
loans needing a human today — which is the honest answer to "how do you collect daily without a field force".

---

## 4. What the demo deliberately does and does not claim

**Shows:** mandate registration on both rails with real constraints (as-presented frequency, caps, execution window, PDN,
retry ladder); no-due days priced into the instalment; a live collection run including the failure and recovery path; the
NACH arrears sweep; a daily ledger; a repayment calendar; and a programme-level ops view.

**Does not show, and should not be claimed:** bureau reporting mechanics, account-aggregator plumbing, the collections agent
app, restructuring/settlement journeys, or any real portfolio performance. Every figure in the Collections Ops tab is
synthetic and labelled as such on screen.

---

## 5. Open questions to close before a pilot

1. Written confirmation from the sponsor bank / PSP on: per-execution pricing for UPI Autopay at daily frequency; PDN
   delivery SLA and who bears delivery failure; retry semantics across execution windows.
2. Confirmation that recurring mandate executions remain outside per-transaction AFA under the 2025 Authentication
   Directions from 1 April 2026.
3. NACH sponsor-bank commercials for an as-presented, maximum-amount mandate used weekly — presentation fee and return fee.
4. Product decision on the tenor reading in §3.1, and the resulting headline APR.
5. Policy decision on penal charges for sustained arrears, and the arrears threshold at which a human is dispatched.
6. Whether a QR-settlement split is available through an intended sourcing partner, which would change the collection model
   materially.

---

## Sources

- [UPI Mandate: meaning, types and benefits — Razorpay](https://razorpay.com/blog/what-is-upi-mandate/) — supported frequencies, fixed vs variable amounts, ₹15,000 / ₹1 lakh AFA thresholds
- [UPI Autopay pre-debit notification — Decentro API reference](https://docs.decentro.tech/reference/payments_api-upi-autopay-pre-debit-notification) — mandate → PDN → presentation sequence, 24-hour requirement
- [UPI AutoPay design guide — productgrowth.in](https://productgrowth.in/insights/fintech/upi-autopay-guide/) — PDN practice (36–48h), retry ladder, execution behaviour
- [Your guide to UPI changes starting August 1, 2025 — SCC Online](https://www.scconline.com/blog/post/2025/07/30/upi-changes-starting-august-1-ncpi-guidelines-upi-api-usage-2025/) — NPCI guidelines on UPI/API usage, autopay execution windows, peak bands
- [NPCI guidelines on UPI and API usage — Mondaq](https://www.mondaq.com/india/fin-tech/1664786/npci-guidelines-on-upi-and-api-usage) — circular dated 21 May 2025, enforcement from 1 August 2025
- [UPI AutoPay execution windows and attempt caps — Republic World](https://www.republicworld.com/business/upi-autopay-failure-morning-peak-hours-npci-new-rules-2026) — one execution plus three retries; window enforcement
- [UPI AutoPay limits and rules — Paytm](https://paytm.com/blog/bill-payments/upi-autopay/upi-autopay-maximum-limit-complete-guide-2025/) — per-debit limits and AFA treatment
- [RBI raises e-mandate limit to ₹1 lakh — Business Standard](https://www.business-standard.com/amp/economy/interviews/rbi-raises-limit-of-e-mandates-for-recurring-online-transactions-to-1-lakh-123120801110_1.html) — category scope of the higher limit
- [UPI autopay revocations hit 20 mn per month on low customer balance — Business Standard](https://www.business-standard.com/amp/finance/news/upi-autopay-revocations-hit-20-mn-monthly-over-low-customer-balances-125090700500_1.html) — revocation volumes and their driver
- [New UPI Autopay rule: no 24-hour pre-debit alert for FASTag, RuPay, NCMC — Business Standard](https://www.business-standard.com/finance/personal-finance/new-upi-autopay-rule-no-24-hour-pre-debit-alert-for-fastag-rupay-ncmc-124092600876_1.html) — scope of PDN exemptions
- [NACH to be available on all days from August 1 — Business Standard](https://www.business-standard.com/article/finance/nach-to-be-available-on-all-days-of-week-from-august-1-says-rbi-121060400527_1.html) — RBI change effective 1 August 2021
- [What is NACH? Mandate, charges and refund rules — Arthzo](https://arthzo.com/what-is-nach-mandate-guide/) — UMRN tracking, T+1 return cycle
- [NACH return charges — IDFC FIRST Bank](https://www.idfcfirst.bank.in/finfirst-blogs/savings-account/demystifying-nach-return-charges-to-protect-your-finances) — return charge practice and range
- [Offline recurring payments — NACH, ECS (Auth-n-Capture)](https://medium.com/authncapture/offline-recurring-payments-nach-ecs-4249311de5a9) — mandate frequency options including "as and when presented", fixed vs maximum debit type
- [How fintech is solving for debt collections — d91 Labs](https://d91labs.substack.com/p/how-fintech-is-solving-for-debt-collections) — collection overheads rise with repayment frequency
