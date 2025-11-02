# LOSDemo V2 - Quick Start Guide

## Running the Demo

### Development Mode
```bash
cd /Users/karthikvelu/LOSDemo
npm run dev
```

The application will start at `http://localhost:5173` (or next available port)

### Production Build
```bash
npm run build
# Files will be in the dist/ folder
```

## Using the Demo

### Step 1: Welcome Screen
- You'll see the new introductory screen
- Title: "Kaleidofin Credit Demo"
- Explanation of the demo's purpose
- Click "Start Demo →" to proceed

### Step 2: Select a Scenario
- Click "Prefill Demo" button on the Lead Registration page
- Choose one of 8 scenarios:
  - **Prime Customer** (Excellent - 16% APR)
  - **Low Risk Traditional** (Good - 17% APR)
  - **Young Professional** (Good - 17% APR)
  - **High Risk** (Good - 17% APR)
  - **Climate Risk - Adaptive** (Good - 17% APR, 18-month term)
  - **Thin File - Alternate Data** (Fair - 19% APR, manual review)
  - **Fraud Rejection Case** (Rejected at KYC)
  - **Poor Bank Statement Case** (Rejected - 21% APR)

### Step 3: Progress Through Workflow
1. **Lead Registration** - Auto-filled data, click "Save & Continue"
2. **Data Consent (OTP)** - Click verify buttons
3. **KYC & Fraud Check** - Upload and verify documents
4. **Credit Assessment** - See the new features!
5. **Disbursement** - Complete the process

## New V2 Features to Test

### On Credit Assessment Page

#### 1. Interactive Loan Amount Slider
- **Location**: Middle of the page, in blue box
- **Action**: Move the slider left and right
- **Expected**: 
  - Loan amount updates in real-time
  - APR changes (16-21% range)
  - Term adjusts slightly
  - All updates are immediate

#### 2. Improved Wording
- Look for "Reasons for this Decision" (not "Model Explainability")
- Sections renamed:
  - "Positive Factors" (green)
  - "Areas to Watch" (yellow)
  - "Risk Factors" (red)

#### 3. Explanatory Notes
- Below "Eligible Amount": See gray italic text explaining the factors
- Above slider: See hint about how slider affects APR

#### 4. Outcome Summaries
- **Alternate Data**: Green box with "✓ Outcome: This customer's profile is safe and reliable"
- **Bank Statement**: Green box with "✓ Outcome: This customer has stable cash flow"

#### 5. Correct APR Range
- All scenarios show 16-21% APR (not 28%)
- Better Ki Scores = lower APR

#### 6. Correct Approved Amount
- Final disbursement amount = Eligible Amount (not Requested Amount)
- Example: Requested ₹80,000 → Eligible ₹64,000 → Approved ₹64,000

## Recommended Test Flow

### Test 1: Best Case (Prime Customer)
```
Scenario: Prime Customer
Expected APR: 16%
Expected Decision: Approved
Slider Test: Move to max → 16%, move to min → ~21%
```

### Test 2: Review Case (Thin File)
```
Scenario: Thin File - Alternate Data
Expected APR: 19%
Expected Decision: Manual Review
Action: Approve manually after reviewing
```

### Test 3: Rejection Case (Bank Statement)
```
Scenario: Poor Bank Statement Case
Expected APR: 21% (shown before rejection)
Expected Decision: Rejected at Credit Check
Note: Cannot proceed to disbursement
```

### Test 4: Climate Adaptive
```
Scenario: Climate Risk - Adaptive Repayment
Expected APR: 17%
Expected Term: 18 months (not 12)
Expected Decision: Approved
Special: See climate-specific explanation box
```

## Comparing V1 vs V2

### What Changed
| Feature | V1 | V2 |
|---------|----|----|
| First screen | Lead Registration | Intro Screen |
| APR | Fixed 28% | Dynamic 16-21% |
| Loan amount | Static display | Interactive slider |
| Terminology | Technical jargon | Simplified language |
| Approved amount | Sometimes requested | Always eligible |
| Explanations | Limited | Rich with context |

### What Stayed the Same
- 8 demo scenarios
- Workflow steps
- Data structure
- Core business logic
- Ki Score calculations
- Scenario outcomes

## Troubleshooting

### If something doesn't look right:
1. Clear browser cache and localStorage
2. Click "🔄 Restart Demo" in the top right
3. Try a fresh browser session

### If you need to revert to V1:
```bash
cd /Users/karthikvelu/LOSDemo
rm -rf src
cp -r LOSDemo_V1_Backup/src .
npm run build
npm run dev
```

### To switch back to V2:
```bash
# V2 is the current version, just rebuild
npm run build
npm run dev
```

## Key Differences to Highlight During Demo

### For Technical Audience
- Alternative data sources (socioeconomic, climate, digital footprint)
- Dynamic APR based on risk score
- Interactive loan amount adjustment
- Real-time calculations

### For Non-Technical Audience
- Easy-to-understand reasons for decisions
- Clear outcome summaries
- Fair pricing (16-21% APR vs traditional 28%)
- Transparency in decision-making

### For Both
- "This is why you got this loan" (not "Model Explainability")
- See how loan amount affects your rate
- Understand what factors helped or hurt the application

## Support

For questions or issues:
- Review `V2_CHANGES.md` for detailed technical changes
- Check `SCENARIO_FLOW.md` for scenario details
- Review source code in `src/screens/ESign/`

---

**Version**: 2.0  
**Last Updated**: November 2, 2025  
**Status**: ✅ Ready for Demo

