# Ki Originate Demo — Presenter Script (APAC + Africa)

**Use case:** Smallholder paddy farmer. Dry-zone cultivation. Kekirawa, Anuradhapura District, Sri Lanka. Climate-stressed cashflows, moderate bureau history, seasonal income.

**Three messages to leave the room with:**
1. The kind of experience we are showing — quick decisioning, straight-through processing, e-sign, direct disbursement — has historically been concentrated in better-served formal segments. With Ki Originate and Ki Score, we bring the same experience to underserved borrowers, including rural agricultural households.
2. For this Sri Lanka case, Ki Score combines bureau data, bank-statement evidence, the application, and climate-layer alternate data. The alternate data here is climate-led — climate, geography, and crop-cycle signals.
3. Fraud and credit are assessed in one unified flow, giving one well-rounded decision — and the product can be structured around climate risk rather than simply rejecting the borrower for it.

---

## TIMING

| Section | Screen | Time |
|---------|--------|------|
| 1. Opening | Landing page | 0:00 – 1:00 |
| 2. Lead registration & consent | Steps 1 → 2 | 1:00 – 4:00 |
| 3. KYC & fraud | Step 3 | 4:00 – 7:00 |
| 4. Credit & alternate data | Step 4 | 7:00 – 12:00 |
| 5. Disbursement | Step 5 | 12:00 – 15:00 |

---

## SECTION 1 — LANDING (0:00 – 1:00)

**On screen:** First screen — "Loan Origination / Demo Platform"

---

> "Let me jump straight into the demo. This is Ki Originate — Kaleidofin's loan origination system — integrated with Ki Score, our credit and fraud scoring engine. One flow, one seamless experience.
>
> Today's use case is from Sri Lanka: Nimal Bandara, a smallholder paddy farmer in Kekirawa, in the Anuradhapura dry zone. Seasonal farm cashflows, some bureau history, but clear climate risk. What we want to show is not simply agricultural lending. We want to show climate-aware decisioning for a Sri Lankan borrower, using the rails and market structure that institutions here will recognize.
>
> So as we go through the journey, I will call out not only what the system is doing, but also how this maps to the Sri Lankan ecosystem — bureau, KYC, account data, e-sign, and payout rails. Let me start."

**[Action: Click "Start Demo Experience →"]**

---

## SECTION 2 — LEAD REGISTRATION & DATA CONSENT (1:00 – 4:00)

**On screen:** Step 1 — "Lead Registration"

---

> "Step one is lead registration. I'm selecting the Sri Lanka farmer profile — dry-zone paddy farmer, climate-adaptive terms, Anuradhapura. Applicant: Nimal Bandara. We capture the applicant and co-applicant details and the requested amount — LKR 200,000.
>
> At this point, what matters operationally is that the LOS captures enough structured data to route the case correctly: livelihood, geography, crop cycle context, requested purpose, and the borrower relationship data. For Sri Lanka, that geography matters because climate stress, irrigation dependence, and seasonal repayment behavior can vary materially by region. So even before scoring starts, the LOS is setting up the right context for decisioning."

**[Action: Save & Continue to Data Consent.]**

**On screen:** Step 2 — "Data Consent"

---

> "Before we run any checks, we collect two things. First, the borrower's consent to pull their CRIB bureau data — that is the Credit Information Bureau of Sri Lanka, the core market reference point for formal credit exposure. The OTP you see on screen authorizes that bureau pull.
>
> Second, the borrower's bank statement. In the demo, the borrower uploads a bank statement PDF. The system parses the transactions and extracts the cash-flow data it needs — inflows, outflows, balance patterns, seasonality. This is the same evidence set the credit engine will use alongside bureau data and alternate data.
>
> Once both are in — bureau consent verified, bank statement uploaded — the system has the full financial evidence set. Let's proceed to KYC."

**[Action: Complete OTP verification, observe bank statement upload, and advance to KYC.]**

---

## SECTION 3 — KYC & FRAUD CHECK (4:00 – 7:00)

**On screen:** Step 3 — "KYC & Fraud Check"

---

> "This is the first major decision point: KYC and fraud assessment. The primary identity anchor is the NIC — the National Identity Card. The foundational check here would be against the Department for Registration of Persons NIC verification service.
>
> Looking ahead, the national digital identity initiative — SLUDI — will strengthen the quality and portability of identity verification across workflows. Today, the practical market architecture is NIC-led verification at the core, with private eKYC layers on top where needed.
>
> That private layer is where institutions may use partners such as Epic Digiface, PayMedia, Faceki, or equivalent onboarding and identity-verification providers for OCR, face match, liveness, assisted onboarding, and workflow orchestration.
>
> For this borrower, the positives are clear: identity matches across sources, no adverse media, and a stable digital footprint. Areas to watch are exactly what a Sri Lankan rural lender would expect: cash-heavy transactions and a first application to this lender. That is normal for an agricultural borrower and not, by itself, a reason to reject.
>
> The conclusion is straightforward: from a fraud perspective, this is a genuine borrower. So the system lets us proceed to credit assessment."

**[Action: Advance to Credit Assessment.]**

---

## SECTION 4 — CREDIT ASSESSMENT & ALTERNATE DATA (7:00 – 12:00)

**On screen:** Step 4 — "Credit Assessment" — scroll through: Ki Score → Bureau → Bank Statement → Alternate Data → Decision

---

> "One point to hold in mind: the experience we're showing — quick decisioning, straight-through processing, e-sign, direct disbursement — has historically been concentrated in better-served formal segments. With Ki Originate and Ki Score, we bring the same experience to underserved rural borrowers as well.
>
> Bureau consent was already taken, so credit assessment starts immediately. The engine draws on bureau data, bank statement, the application, and alternate data.
>
> The bureau here is CRIB, which is strong for formal credit exposure from regulated lenders. But CRIB alone will not fully explain a borrower like this, because seasonal agricultural cashflows do not become visible just from bureau repayment records. That is exactly why bank-statement evidence and alternate data matter.
>
> Here is the Ki Score summary. Nimal's Ki Score is 41 — in the Good band. He requested LKR 200,000; we're recommending LKR 180,000, with an 18-month term at 14% APR. These numbers come from the engine, not from a manual estimate. And you get full explainability on the same page: why approved, what is positive, what to watch, and what the risk factors are. No black box.
>
> What the model sees in the core financial data is about two and a half years of bureau history, 91% on-time repayment, moderate credit utilization, and no major stress indicators beyond one lean-season delinquency. We are looking at a borrower whose formal record is decent, but incomplete on its own.
>
> In the bank statement, you can see paddy-sale inflows plus secondary farm income, a healthy average balance, and a low current debt-service ratio. The main thing to watch is not over-indebtedness — it is seasonality. Income is not linear month to month; it is tied to crop-cycle realization.
>
> Now the alternate data. This is where the climate layer becomes important. We can see rainfall running below the long-term average in the dry zone, elevated drought risk, irrigation dependence, and likely pressure on one crop cycle. The alternate data here is climate-led — climate, geography, and crop-cycle signals.
>
> But climate stress is only one side of the picture. The model also sees that this borrower has harvest-linked cashflows, access to collection and trading points, and a repayment structure that can be aligned to Maha and Yala realizations. So the decision is not to reject the borrower because climate risk exists. The decision is to structure the loan around that risk.
>
> That is why the product comes with climate-adaptive terms: longer tenure, harvest-aligned repayment windows, and lower pressure during planting months. In other words, the analytics layer and the product-structure layer are working together.
>
> Put all of that together, and the outcome is a confident approval: LKR 180,000, 18 months, 14% APR."

**[Action: Click through to Disbursement.]**

---

## SECTION 5 — DISBURSEMENT (12:00 – 15:00)

**On screen:** Step 5 — "Disbursement"

---

> "We approve the loan. At this point Ki Originate completes two more things. First, the beneficiary account is confirmed. The borrower selects their disbursement account and the system records it. The payout rail here is LankaPay and CEFTS — real-time interbank transfer.
>
> Second: e-sign. The market reference point is LankaSign, which operates under the Electronic Transactions Act and provides digital-signature infrastructure for document signing and API integration. The borrower signs the loan agreement digitally, and the agreement is captured.
>
> And then disbursement. LKR 180,000, transferred directly via CEFTS. The entire journey — application, consent, bureau pull, bank statement upload, fraud check, credit decision, e-sign, payout — completed in minutes. Ki Score handles the decision; the human handles the exception.
>
> Nimal Bandara gets a climate-aware loan decision, not a generic agricultural one. Climate risk is not ignored, but it is not treated as an automatic rejection either. It is absorbed into the credit decision and into the structure of the product. That is the Ki Originate story. I'll hand over for questions. Thank you."

**[Action: Show disbursement confirmation on screen.]**

---

## QUICK REFERENCE — KEY PHRASES

| Theme | Say exactly |
|-------|-------------|
| Platform | "Ki Originate — Kaleidofin's loan origination system — integrates natively with Ki Score" |
| Sri Lanka bureau | "The bureau pull is through CRIB — the Credit Information Bureau of Sri Lanka" |
| Bank statements | "The borrower uploads a bank statement PDF; the system parses the transactions and extracts cash-flow data" |
| KYC rails | "The primary identity anchor is the NIC, checked through DRP; private eKYC layers can be added for OCR, liveness, and face match" |
| Market providers | "Epic Digiface, PayMedia, and Faceki are examples of the kind of onboarding providers that can sit in this layer" |
| Climate-led alternate data | "The alternate data here is climate-led — climate, geography, and crop-cycle signals" |
| Decisioning logic | "The decision is not to reject the borrower because climate risk exists. The decision is to structure the loan around that risk." |
| Climate-adaptive terms | "Longer tenure, harvest-aligned repayment windows, and lower pressure during planting months" |
| E-sign | "LankaSign under the Electronic Transactions Act" |
| Payout rails | "The payout rail is LankaPay and CEFTS for real-time interbank transfer" |
| Explainability | "Full model explainability — why approved, positive factors, areas to watch, risk factors — on the same page. No black box." |
| Ki Score handles decision | "Ki Score handles the decision; the human handles the exception" |

---

## PAGE-TO-SCRIPT MAP

| Screen | Script section |
|--------|---------------|
| Landing page | Section 1 |
| Step 1 — Lead Registration | Section 2, first block |
| Step 2 — Data Consent (OTP + PDF upload) | Section 2, second block |
| Step 3 — KYC & Fraud Check | Section 3 |
| Step 4 — Credit Assessment (scroll through) | Section 4 |
| Step 5 — Disbursement | Section 5 |

---

# AFRICA MODE — East Africa (Kenya) Presenter Script

**Region:** Select "Africa" on the landing page.

**Two use cases to demo in sequence:**
1. **Kenya Farmer (Alt Data Only)** — James Mwangi, maize farmer in Machakos County. Decisioning from farmer profile, farm/crop data, climate signals, and socioeconomic context alone. No bureau or transaction history.
2. **Kenya Farmer (Enhanced)** — Peter Kamau, coffee farmer in Nyeri County. Same alternate data foundation, plus credit bureau history and M-Pesa transaction data for stronger risk separation.

**Key message:** Ki Score can generate a robust credit decision using alternate data alone — no bureau record, no M-Pesa history, no bank account required. Bureau and transaction data enhance the score further but are not prerequisites.

---

## AFRICA — USE CASE 1: ALT DATA ONLY (James Mwangi, KES 100,000)

**Flow for this use case:** Lead Registration → Farm & Crop Profile → Credit Assessment → Disbursement (no consent or KYC steps — there is no bureau or bank data to authorize)

### Landing & Lead Registration

> "On the landing page, I select Africa, then start the demo. I select the Kenya Farmer Alt Data Only scenario. This is James Mwangi, a maize farmer in Machakos County. He's requesting KES 100,000.
>
> The critical thing about this borrower: he has no bureau record, no M-Pesa transaction history significant enough to score, and no bank account. By every existing measure, he is invisible to the financial system. But he has a farm, a crop, a location, and a climate context. Ki Score is designed to work with exactly this data."

### Farm & Crop Profile

> "After lead registration, the next screen captures the farm-level inputs. Crop type, acreage, irrigation practice, and farm GPS coordinates. Notice there is no consent or KYC step in this flow — there is simply no bureau or bank data to consent to. Instead, the system uses these farm inputs combined with climate signals, soil characteristics, and socioeconomic context automatically extracted at the farm's GPS location."

### Credit Assessment

> "This is the most important screen. Ki Score produces a risk assessment using only alternate data. No bureau, no transactions — just the data that exists about this farmer's land, climate, and context.
>
> The alternate data panels show three dimensions: climate and soil profile (rainfall deficit, drought severity, soil water retention), farm profile (maize on 1.5 acres with supplemental irrigation), and socioeconomic context (GRDI index indicating moderate rural development).
>
> Ki Score is 44 — Good band. The system recommends KES 85,000 at 18% APR for 12 months, structured around the seasonal input cycle. The positive factors highlight irrigation access, viable acreage, and productive-use loan purpose. The risk factors are transparently stated: single crop dependency and elevated drought exposure.
>
> The point is this: a decision was made. A creditworthy farmer who would have been invisible to every other system now has a score, a recommendation, and a loan at 18% — compared to the 40–80%+ rates they would face from informal lenders. That is the impact."

### Disbursement

> "Loan approved, agreement signed, KES 85,000 disbursed. The entire journey completed in minutes — for a borrower who had zero financial history."

---

## AFRICA — USE CASE 2: ENHANCED (Peter Kamau, KES 180,000)

> "Now the second use case. Same platform, same flow — but this time the borrower has some financial history. Peter Kamau, a coffee farmer in Nyeri County, has a 2-year credit bureau record and regular M-Pesa activity."

### Consent

> "This time, OTP consent authorizes two additional data sources: credit bureau records from Kenya CRBs and M-Pesa transaction history. These layer on top of the same alternate data foundation."

### Credit Assessment

> "With bureau and M-Pesa data added, watch what happens to the score. Ki Score drops to 35 — deeper into the Good band. The system recommends KES 150,000 at 14% APR for 18 months. That is a materially better outcome than the alt-data-only case — lower rate, higher amount, longer term accommodating coffee harvest cycles.
>
> The bureau data shows 88% on-time repayment over 2 years. The M-Pesa data shows consistent cash-flow patterns across seasons. The climate signals show a highland coffee zone with stable rainfall — low climate stress. All of these signals reinforce each other.
>
> This is the key insight: bureau and transaction data are not required, but when they are available, they produce meaningfully better separation. The farmer gets a better deal because the model has more evidence to work with."

---

## AFRICA — QUICK REFERENCE

| Theme | Say exactly |
|-------|-------------|
| Alt data sufficiency | "Ki Score can generate a robust risk assessment using alternate data alone — no bureau, no M-Pesa, no bank account required" |
| Data sources | "Climate (CHIRPS, ERA5, SPEI), soil (SoilGrids at 250m), socioeconomic context (CIAT/GRDI), and individual farm profile" |
| Enhancement | "Bureau and transaction data enhance the score further — but they are not prerequisites" |
| Risk separation | "Climate signals alone produce statistically meaningful risk separation in our Kenya portfolio data" |
| Inclusion | "Thin-file and no-file farmers become visible to the financial system for the first time" |
| Product structuring | "Ki Score informs not just the lending decision, but the specific product structure — tenor, pricing — appropriate for each farmer's climate context" |
| Explainability | "Every output is a recommendation for how to serve a farmer, not whether to serve them" |
