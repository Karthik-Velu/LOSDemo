# Street Vendor Daily-EDI Demo — Presenter Script

**Use case:** Small-ticket, every-day-instalment (EDI) working-capital loan for a street vendor. Collected on a UPI Autopay
mandate with NACH as the fallback rail. The collections view after disbursal is as much the demo as the onboarding is.

**Persona (synthetic):** Meena R, vegetable vendor, Pondy Bazaar market, Chennai. 6 years at the same pitch. Typical daily
sales ₹2,200. Requests ₹30,000.

**Scripted outcome:** approved ₹30,000 · 120-day tenor · ~99 collection days · daily instalment ≈ ₹320 · 30% APR ·
weekly no-due day Monday · UPI Autopay primary, NACH fallback.

**How to open it:** Region → **APAC** → click the **Street Vendor (Daily EDI)** card → *Start Demo Experience*.
Every screen is pre-filled; the whole path is clickable without typing.

**Three things to leave the room with:**
1. Daily repayment only works if collection works. The instalment is matched to what the vendor earns in a day, the
   predictable slow days are designed out, and collection runs on standing mandates rather than on a field agent's route.
2. ki score is scored for the loan, not just the borrower — move the amount on screen and the decision moves with it.
3. The collections dashboard is the product. Mandates, retries, sweeps and exceptions are where a daily product is won or lost.

---

## TIMING

| Section | Screen | Time |
|---|---|---|
| 1. Framing | Landing / scenario card | 0:00 – 0:45 |
| 2. Application & business profile | Steps 1 → 2 | 0:45 – 2:00 |
| 3. Consent & income read | Step 3 | 2:00 – 3:00 |
| 4. The decision | Step 4 | 3:00 – 4:30 |
| 5. Mandate setup | Step 5 | 4:30 – 6:00 |
| 6. Disbursement | Step 6 | 6:00 – 6:30 |
| 7. Collections dashboard | Step 7 | 6:30 – 10:00 |

---

## SECTION 1 — FRAMING (0:00 – 0:45)

> "This is a small-ticket working-capital loan for a street vendor, repaid in daily instalments. Ten thousand to two lakh
> rupees, ninety to a hundred and eighty days, an instalment every trading day.
>
> Daily repayment is not a new idea — it is how the informal market has always lent to vendors, because it matches how they
> earn. What has been missing is a way to do it at a formal cost of collection. That is the whole demo: a decision sized to a
> day's earnings, and collection that runs on mandates rather than on someone walking the market with a receipt book."

**[Action: select Street Vendor (Daily EDI), Start Demo Experience.]**

---

## SECTION 2 — APPLICATION & BUSINESS PROFILE (0:45 – 2:00)

> "Application first. Meena R, Pondy Bazaar, requesting ₹30,000. Two things to notice. Identity is verified digitally and
> comes back as a masked token — no identity number is typed into the system, displayed, or stored here. And there is no
> co-applicant: this is an individual liability loan, not a group product."

**[Action: Save & Continue to Business Profile.]**

> "The business profile is four friendly questions. What she sells, where she trades from, how long she's been there, and
> what a typical day's sales look like. That daily sales figure is doing two jobs: it is the qualifying revenue band for the
> product, and it is the anchor for instalment sizing — we never let the daily instalment past a fixed share of it.
>
> The last field is the borrower's own choice: which day of the week carries no instalment. Meena picks Monday, her slow day."

**[Action: Save & Continue to Consent.]**

---

## SECTION 3 — CONSENT & INCOME READ (2:00 – 3:00)

> "Consent is a screen of its own, in plain language — what we read, why, how long we keep it, and how she withdraws it. This
> is a first-time formal borrower; consent buried in a checkbox is not consent.
>
> Then the income read. We link the account and estimate what she actually earns in a day: separating trade receipts from
> personal transfers, modelling the weekly pattern, and landing on an estimated daily income of ₹640 against ₹2,200 of sales.
> That is the number the instalment is sized against — not the sales figure, and not a self-declared income."

**[Action: Continue to Credit Assessment.]**

---

## SECTION 4 — THE DECISION (3:00 – 4:30)

> "ki score returns in seconds. Score of 34, in the Good band. Approved ₹30,000 over 120 days, with a daily instalment of
> ₹320 — and note the second line: ninety-nine paying days, not a hundred and twenty. The no-due days are priced into the
> instalment rather than added to the end of the loan, so skipping a day never extends the tenor.
>
> The factors are in plain language: steady daily sales, a stable pitch, enterprise activity in the surrounding market. And
> the instalment sits at 14.5% of a typical day's sales, inside the 18% cap.
>
> Now the part worth pausing on."

**[Action: drag the amount slider up to ~₹1,20,000.]**

> "The score is for the loan, not just the borrower. As I move the amount, the daily instalment moves with it — and at this
> point the instalment is past what a normal trading day can carry, so the same borrower is referred rather than approved.
> The ceiling for this borrower is a little under ₹40,000. Above that, this is a different conversation — longer tenor, or a
> credit-ops override. That is what we mean by a decision that is specific to the loan applied for."

**[Action: reset to the approved amount, then Accept & Set Up Mandate.]**

---

## SECTION 5 — MANDATE SETUP (4:30 – 6:00)

> "This is the step that makes a daily product possible. Two rails, registered at onboarding.
>
> UPI Autopay is the primary. Instant authorisation in her own UPI app, and it can be presented every collection day. NACH is
> registered alongside it as the fallback — it activates on T+1, and we use it to sweep arrears rather than to carry the daily
> instalment. I'll come back to why in a moment.
>
> Three design choices worth calling out. First, both mandates are registered as *as presented*, not as a fixed daily
> frequency — that is what lets us simply not present on the weekly no-due day or on a public holiday, and what lets us sweep
> a missed day together with the current one. Second, the cap per debit is set above the instalment, at ₹1,000, so a catch-up
> is possible; she is notified of the exact amount before every debit and never pays more than that notification says. Third,
> the execution window: recurring debits are presented after 21:30, once the day's trade is done and the account is at its
> fullest."

**[Action: Authorise UPI Autopay Mandate → Register NACH Fallback → Continue to Disbursement.]**

> "And registering both at onboarding is deliberate. The alternative is going back to the borrower for a second mandate when
> she is already in arrears — which is exactly when she is hardest to reach."

---

## SECTION 6 — DISBURSEMENT (6:00 – 6:30)

> "Account confirmed, agreement captured, ₹30,000 disbursed. The agreement states the daily construct explicitly: the
> instalment, the number of collection days, and the fact that nothing is due on the weekly no-due day or on public holidays.
> First instalment tomorrow, in the 21:30 window."

**[Action: Open Collections Dashboard.]**

---

## SECTION 7 — COLLECTIONS DASHBOARD (6:30 – 10:00)

> "This is where a lender actually lives for the next 120 days.
>
> Day 23 of the loan. Collected ₹5,120 across sixteen of seventeen instalments due. Collection efficiency 94.1% by value,
> and a first-attempt rate of 82% — that gap between the two is the whole operational story of a daily product: most of what
> fails on the first attempt comes back on a retry or a sweep.
>
> Today's mandate run, top to bottom: the pre-debit notification went out yesterday evening with tomorrow's exact amount;
> the debit is presented in the post-peak window; the rail responds; the ledger posts. Let me run it."

**[Action: Run today's collection.]**

> "Collected, first attempt. Now let me show you the case that matters more."

**[Action: tick Simulate insufficient balance, then Re-run.]**

> "Insufficient balance. Notice what does *not* happen: the day is not immediately an arrear, and there is no bounce charge.
> We have one execution plus three retries, and the retry is queued for the next morning window when the day's float lands.
> It recovers on attempt two.
>
> If the retries are exhausted, the instalment moves to the NACH fallback and is swept — that is the teal row in the ledger,
> the 12th, recovered the next day at 11:20. One instalment is still open, from the 16th, and it sits in the exception queue.
>
> The calendar is the borrower-facing view of the same thing. Green is collected, amber is collected on retry, teal is a NACH
> sweep, red is the open arrear, grey is her weekly no-due day, purple is a public holiday. Slow day? The no-due day is built
> in — and because the instalment was sized on ninety-nine paying days, skipping it never extends the loan."

**[Action: switch to the Collections Ops tab.]**

> "And the programme view. Twelve hundred active loans, mandates split between UPI and NACH, collection efficiency 96.2%
> over thirty days, PAR over seven days at 2.1%.
>
> Two panels I would draw your attention to. Failure reasons: insufficient balance is the bulk of it, but mandate revocation
> is the one that actually kills a daily loan, and we surface it the moment it happens. And presentations by execution
> window: 71% of the book is presented after 21:30, because recurring debits cannot be presented during UPI peak hours and
> because that is when a vendor's account is fullest.
>
> Last point. Delinquency here is counted in missed instalments, not in days past due on a monthly cycle. Bureau reporting
> stays monthly; the daily signal is what we use internally for early action, and for growing her limit on the next cycle."

---

## QUICK REFERENCE — KEY PHRASES

| Theme | Say exactly |
|---|---|
| Product | "Small-ticket every-day-instalment loan — ₹10,000 to ₹2,00,000, 90 to 180 days" |
| Sizing | "The instalment is sized on estimated daily income, capped at a fixed share of a typical day's sales" |
| Loan-specific score | "ki score is scored for the loan, not just the borrower — move the amount and the decision moves" |
| No-due days | "Priced into the instalment, not added to the end of the loan" |
| Rails | "UPI Autopay carries the daily instalment; NACH is registered at onboarding as the arrears-sweep fallback" |
| Mandate type | "Registered as 'as presented', not fixed daily — that is what lets us skip a day and sweep a catch-up" |
| Execution window | "Presented after 21:30, once the day's trade is done" |
| Failure handling | "One execution plus three retries before a day is called missed — and no penal charge on a single missed instalment" |
| Delinquency | "Counted in missed instalments internally; bureau reporting stays monthly" |
| The point | "Daily repayment at a formal cost of collection" |

---

## LIKELY QUESTIONS — SHORT ANSWERS

**"Can UPI Autopay really debit daily?"** Yes — daily and as-presented mandates are both supported. The constraints are
operational, not conceptual: a pre-debit notification 24 hours ahead of every debit, execution only outside UPI peak hours,
and a cap of one execution plus three retries per cycle. The demo is built around all three.

**"Why is NACH not the daily rail?"** It clears in files with a T+1 return cycle, so you learn about a failure a day late,
and per-presentation plus return charges are disproportionate to a ₹320 instalment. It is the right rail for a weekly sweep,
not for a daily debit.

**"What if her account is empty?"** That is the single largest failure mode, and it is why the retry ladder and the sweep
exist rather than a bounce charge. Collecting at the point of sale — a split at UPI QR settlement — is the stronger long-term
answer and is worth piloting alongside.

**"What does this cost to collect?"** UPI Autopay executions are a few rupees at most per debit; roughly a hundred debits on a
₹30,000 ticket keeps collection cost inside a fraction of a percent. A field-collected daily loan cannot get near that.

> See `VENDOR_DAILY_MANDATE_FEASIBILITY.md` for the underlying constraints, the sources, and the open questions to close
> before a pilot.
