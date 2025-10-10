import React, { useState, useEffect } from "react";
import kiLogo from "../../assets/ki-logo.svg";
import { type LoanApplication } from "../../lib/supabase";
import { Button } from "../../components/ui/button";

interface CreditCheckProps {
  application: LoanApplication;
  onUpdate: (updates: Partial<LoanApplication>) => Promise<any>;
  onNext: () => void;
  onBack: () => void;
}

export const CreditCheck: React.FC<CreditCheckProps> = ({
  application,
  onUpdate,
  onNext,
  onBack,
}) => {
  const [processing, setProcessing] = useState(false);
  const [newDecision, setNewDecision] = useState<'approved' | 'rejected' | null>(null);
  const [reviewerComments, setReviewerComments] = useState(application.reviewer_comments || '');
  const [hasRunCreditCheck, setHasRunCreditCheck] = useState(!!application.credit_decision);

  // Check if application is already rejected for poor bank statements
  const isBankRejected = application.status === 'rejected' && application.rejection_reason?.includes('bank statement');

  // Check if application is in review status
  const isUnderReview = application.credit_decision === 'review';

  // Auto-run credit check on mount if not already done
  useEffect(() => {
    if (!hasRunCreditCheck && !processing) {
      runCreditCheck();
    }
  }, []);

  const handleManualDecisionUpdate = async (decision: 'approved' | 'rejected') => {
    setProcessing(true);
    try {
      await onUpdate({
        reviewer_comments: reviewerComments,
        credit_decision: decision,
        status: decision === 'approved' ? 'approved' : 'rejected',
        credit_checked_at: new Date().toISOString(),
      });
      setNewDecision(decision);
    } catch (error) {
      console.error('Error updating decision:', error);
    } finally {
      setProcessing(false);
    }
  };

  const runCreditCheck = async () => {
    setProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 2500));

    // Deterministic outcomes based on selected demo scenario
    // Ki Score: Lower is better (like golf score)
    // 1-25 = Excellent (auto-approve)
    // 26-45 = Good (auto-approve) 
    // 46-60 = Fair (manual review)
    // 61-80 = Poor (likely reject)
    // 81-100 = Very Poor (auto-reject)
    const scenario = (application as any).demo_scenario_id as string | undefined;
    console.log('Credit Check - Scenario:', scenario);
    let kiScore: number;
    if (scenario === 'prime_customer') {
      kiScore = 18; // Excellent - approved
    } else if (scenario === 'low_risk_traditional') {
      kiScore = 32; // Good - approved
    } else if (scenario === 'thin_file') {
      kiScore = 52; // Fair - review
    } else if (scenario === 'young_professional') {
      kiScore = 38; // Good - approved
    } else if (scenario === 'bank_rejection') {
      kiScore = 78; // Poor - rejected
    } else if (scenario === 'fraud_rejection') {
      kiScore = 88; // Very Poor - rejected
    } else if (scenario === 'high_risk') {
      kiScore = 42; // Good - should be approved
    } else if (scenario === 'climate_adaptive') {
      kiScore = 44; // Good - approved with adaptive tenure
    } else {
      kiScore = Math.floor(Math.random() * 40) + 25;
    }
    
    console.log('Ki Score for scenario:', scenario, '=', kiScore);
    const requestedAmount = application.requested_amount || 50000;
    const eligibleAmount = requestedAmount * (kiScore > 50 ? 1.2 : 0.8);
    const recommendedAmount = requestedAmount;

    let creditDecision: 'approved' | 'rejected' | 'review' = 'review';
    if (kiScore <= 45) {
      creditDecision = 'approved'; // Excellent to Good
    } else if (kiScore >= 75) {
      creditDecision = 'rejected'; // Poor to Very Poor
    } else {
      creditDecision = 'review'; // Fair - needs manual review
    }

    // Adaptive tenure for climate scenario (longer tenure due to lower rainfall)
    const isClimateScenario = scenario === 'climate_adaptive';
    const adaptiveTerm = isClimateScenario ? 18 : 12; // 18 months for climate stress vs 12 normal

    const decisionData = {
      ki_score: kiScore,
      eligible_amount: eligibleAmount,
      recommended_amount: recommendedAmount,
      recommended_term: adaptiveTerm,
      recommended_apr: isClimateScenario ? 24 : 28, // Lower APR for climate scenario as gesture of support
      credit_decision: creditDecision,
      credit_checked_at: new Date().toISOString(),
      bureau_data: {
        credit_history_length: '1.5 years',
        active_accounts: 4,
        inquiries_180d: 6,
        worst_dpd_12m: '1-30 DPD',
        credit_utilization: '75%',
        on_time_payment_rate: '92%',
        secured_loans: 0,
        unsecured_loans: 1,
        total_balance: 125000,
        oldest_account: '18 months',
      },
      alternate_data: {
        socioeconomic: {
          schools_nearby: 8,
          hospitals_nearby: 3,
          households_with_rcc_roofs: '65%',
          car_ownership: '12%',
          bank_branches_per_1000: 2.1,
          local_crime_rate: 'Low',
        },
        climate_risk: {
          rainfall_patterns: 'Normal',
          drought_risk: 'Low',
          flood_risk: 'Moderate',
          climate_vulnerability: '3.2/10',
        },
        digital_footprint: {
          mobile_tenure: '6 years',
          email_tenure: '4 years',
        },
        income_estimates: {
          monthly_household_income: 36000,
          monthly_debt_repayments: 4200,
          drinking_water_access: 'Yes',
          toilet_access: 'Yes',
          lpg_cooking: 'No',
          scooter_ownership: 'No',
          computer_ownership: 'No',
          refrigerator_ownership: 'Yes',
        },
      },
      bank_statement_data: scenario === 'bank_rejection'
        ? {
            status: 'Poor',
            inflows: { agri: 12000, dairy: 2000 },
            outflows: { emi: 9500, utilities: 8200, other: 15000 },
            insights: { avg_balance: 1500, dti: '68%', stability: 'Very Low' },
          }
        : {
            status: 'V Good',
            inflows: { agri: 28000, dairy: 8000 },
            outflows: { emi: 4200, utilities: 6200, other: 8300 },
            insights: { avg_balance: 12000, dti: '11.7%', stability: 'High' },
          },
      available_bank_accounts: [
        {
          id: 'acc_1',
          bank_name: 'State Bank of India',
          account_number: '1234567890123456',
          ifsc_code: 'SBIN0001234',
          account_type: 'Savings',
          balance: 24500,
        },
        {
          id: 'acc_2',
          bank_name: 'HDFC Bank',
          account_number: '9876543210987654',
          ifsc_code: 'HDFC0005678',
          account_type: 'Current',
          balance: 15600,
        }
      ],
      decision_reasons: scenario === 'bank_rejection'
        ? {
            whats_good: [
              'Valid identity documents',
              'Stable residential address',
            ],
            needs_improvement: [
              'Low agricultural income (₹12,000/month)',
              'High debt-to-income ratio (68%)',
            ],
            whats_bad: [
              'Very low average bank balance (₹1,500)',
              'Excessive monthly outflows (₹32,700 vs ₹14,000 income)',
              'Multiple bounced EMI payments',
              'Irregular income patterns',
              'Account stability very low',
            ],
          }
        : scenario === 'fraud_rejection'
        ? {
            whats_good: [],
            needs_improvement: [
              'Recent SIM card (2 months)',
              'New email address (1 month)',
            ],
            whats_bad: [
              'Multiple identity mismatches across sources',
              '15 anomalous bank transactions detected',
              'Address verification failed',
              'Suspicious transaction patterns',
              'High fraud Ki score (85/100)',
            ],
          }
        : {
            whats_good: [
              'Good credit history length (1.5 years)',
              'Available credit utilization (75%)',
              'High on-time payment rate (92%)',
              'Strong alternate data signals',
              'Consistent business inflows',
            ],
            needs_improvement: [
              'Multiple recent credit inquiries',
              'Increasing indebtedness (15% rise over last year)',
            ],
            whats_bad: [
              'One instance of 30 DPD (12m ago)',
            ],
          },
    };

    await onUpdate(decisionData);
    setHasRunCreditCheck(true);
    setProcessing(false);
  };

  const handleApprove = async () => {
    // Only proceed to disbursement if approved
    if (application.credit_decision === 'approved') {
      await onUpdate({ status: 'approved' });
      onNext();
    }
  };

  const getScoreColor = (score: number) => {
    if (score <= 25) return '#22c55e'; // Excellent - green
    if (score <= 45) return '#10b981'; // Good - green
    if (score <= 60) return '#eab308'; // Fair - yellow
    if (score <= 80) return '#f97316'; // Poor - orange
    return '#ef4444'; // Very Poor - red
  };

  const getScoreLabel = (score: number) => {
    if (score <= 25) return 'Excellent';
    if (score <= 45) return 'Good';
    if (score <= 60) return 'Fair';
    if (score <= 80) return 'Poor';
    return 'Very Poor';
  };


  // Show bank statement rejection if applicable
  if (isBankRejected) {
    return (
      <div>
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-red-900 mb-2">Application Rejected</h2>
          <p className="text-base text-gray-600 mt-1">Credit assessment completed - Loan ID: {application.loan_id}</p>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-300 p-8 rounded-2xl shadow-lg">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center text-white text-3xl shadow-lg">
              ✗
            </div>
            <div>
              <h3 className="text-2xl font-bold text-red-900">Poor Bank Statement Analysis</h3>
              <p className="text-base text-red-700">Application rejected due to financial instability</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border-2 border-red-200 mb-6 shadow-md">
            <h4 className="font-bold text-red-900 mb-3 text-lg">Rejection Reasons</h4>
            <ul className="space-y-2 text-sm text-red-800">
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-0.5">•</span>
                <span>Very low average bank balance (₹1,500)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-0.5">•</span>
                <span>Excessive debt-to-income ratio (68%)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-0.5">•</span>
                <span>Monthly outflows (₹32,700) far exceed income (₹14,000)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-0.5">•</span>
                <span>Multiple bounced EMI payments detected</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-0.5">•</span>
                <span>Irregular income patterns and very low account stability</span>
              </li>
            </ul>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-700 mb-6">This application has been rejected and cannot proceed further.</p>
            <Button
              onClick={() => {
                localStorage.removeItem('mock_loan_applications');
                window.location.reload();
              }}
              className="px-8 py-3 text-base font-semibold"
            >
              🏠 Start New Application
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!application.credit_checked_at) {
    return (
      <div>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Credit Check</h2>
          <p className="text-sm text-gray-600 mt-1">Run comprehensive credit assessment</p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-sm text-center">
          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-5xl">📊</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Running Credit Assessment...</h3>
          <p className="text-gray-600">
            Pulling credit bureau data, analyzing bank statements, and evaluating alternate data.
          </p>
        </div>

        <div className="flex justify-start mt-6">
          <Button onClick={onBack} variant="outline" className="w-full sm:w-auto">Back</Button>
        </div>
      </div>
    );
  }

  const kiScore = application.ki_score || 0;
  const decision = application.decision_reasons as any;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Credit Assessment</h2>
          <p className="text-base text-gray-600">Loan ID: {application.loan_id}</p>
        </div>
        <div className={`px-6 py-3 rounded-xl font-bold text-lg shadow-md ${
          application.credit_decision === 'approved' ? 'bg-green-100 text-green-800 border-2 border-green-300' :
          application.credit_decision === 'rejected' ? 'bg-red-100 text-red-800 border-2 border-red-300' :
          'bg-yellow-100 text-yellow-800 border-2 border-yellow-300'
        }`}>
          {application.credit_decision?.toUpperCase()}
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <img src={kiLogo} alt="Ki Score" className="h-5 w-auto" />
            <h3 className="text-lg font-semibold text-gray-900">Ki Decision Summary</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col items-center">
              <div className="relative w-32 h-32">
                <svg className="transform -rotate-90 w-32 h-32">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="#e5e7eb"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke={getScoreColor(kiScore)}
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${(kiScore / 100) * 351.86} 351.86`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-3xl font-bold" style={{ color: getScoreColor(kiScore) }}>
                      {kiScore}
                    </div>
                    <div className="text-xs text-gray-600 font-medium">{getScoreLabel(kiScore)}</div>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-2 font-medium">Ki Score (1-100, lower is better)</p>
            </div>

            <div className="space-y-3 w-full">
              <div>
                <p className="text-sm text-gray-600">Requested Amount:</p>
                <p className="text-lg font-semibold text-gray-900">₹{application.requested_amount?.toLocaleString('en-IN')}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Eligible Amount:</p>
                <p className="text-lg font-semibold text-gray-900">₹{application.eligible_amount?.toLocaleString('en-IN')}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Recommended Amount:</p>
                <p className="text-lg font-semibold text-[#11287c]">₹{application.recommended_amount?.toLocaleString('en-IN')}</p>
              </div>
              <div className="flex gap-4">
                <div>
                  <p className="text-sm text-gray-600">Term:</p>
                  <p className="text-base font-semibold text-gray-900">{application.recommended_term} Months</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">APR:</p>
                  <p className="text-base font-semibold text-gray-900">{application.recommended_apr}%</p>
                </div>
              </div>
            </div>
          </div>

          {(application as any).demo_scenario_id === 'climate_adaptive' && (
            <div className="mt-4 p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg border border-orange-200">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-xl">🌾</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-orange-900 mb-2">Climate-Adaptive Repayment Terms</h4>
                  <p className="text-sm text-orange-800 mb-2">
                    Based on climate risk analysis showing below-average rainfall (680mm vs 950mm historical average) and 
                    moderate drought risk, this loan features:
                  </p>
                  <ul className="text-sm text-orange-800 space-y-1 ml-4">
                    <li>• <strong>Extended tenure to 18 months</strong> (vs standard 12 months) to accommodate reduced crop yields</li>
                    <li>• <strong>Reduced APR to 24%</strong> (vs standard 28%) to support farmer during climate stress</li>
                    <li>• <strong>Flexible repayment schedule</strong> aligned with harvest seasons considering rainfall patterns</li>
                  </ul>
                  <p className="text-xs text-orange-700 mt-2 italic">
                    Impact on borrower: Lower monthly payments (₹{Math.round((application.recommended_amount || 60000) / 18).toLocaleString('en-IN')} vs 
                    ₹{Math.round((application.recommended_amount || 60000) / 12).toLocaleString('en-IN')}) to manage cash flow during challenging agricultural conditions.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Model Explainability</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-green-900 mb-2">What's Good</h4>
              <ul className="text-xs space-y-1">
                {decision?.whats_good?.map((item: string, i: number) => (
                  <li key={i} className="text-green-800">• {item}</li>
                ))}
              </ul>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-yellow-900 mb-2">Needs Improvement</h4>
              <ul className="text-xs space-y-1">
                {decision?.needs_improvement?.map((item: string, i: number) => (
                  <li key={i} className="text-yellow-800">• {item}</li>
                ))}
              </ul>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-red-900 mb-2">What's Bad</h4>
              <ul className="text-xs space-y-1">
                {decision?.whats_bad?.map((item: string, i: number) => (
                  <li key={i} className="text-red-800">• {item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Bureau Details</h3>
          <div className="flex items-center justify-between mb-4">
            <div></div>
            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded">Average</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-gray-600 text-xs">Credit History</p>
              <p className="font-semibold text-gray-900">{application.bureau_data?.credit_history_length}</p>
            </div>
            <div>
              <p className="text-gray-600 text-xs">Active Accounts</p>
              <p className="font-semibold text-gray-900">{application.bureau_data?.active_accounts}</p>
            </div>
            <div>
              <p className="text-gray-600 text-xs">Inquiries (180d)</p>
              <p className="font-semibold text-gray-900">{application.bureau_data?.inquiries_180d}</p>
            </div>
            <div>
              <p className="text-gray-600 text-xs">Worst DPD (12m)</p>
              <p className="font-semibold text-gray-900">{application.bureau_data?.worst_dpd_12m}</p>
            </div>
            <div>
              <p className="text-gray-600 text-xs">Credit Utilization</p>
              <p className="font-semibold text-gray-900">{application.bureau_data?.credit_utilization}</p>
            </div>
            <div>
              <p className="text-gray-600 text-xs">On-Time Payments</p>
              <p className="font-semibold text-gray-900">{application.bureau_data?.on_time_payment_rate}</p>
            </div>
            <div>
              <p className="text-gray-600 text-xs">Total Balance</p>
              <p className="font-semibold text-gray-900">₹{application.bureau_data?.total_balance?.toLocaleString('en-IN')}</p>
            </div>
            <div>
              <p className="text-gray-600 text-xs">Oldest Account</p>
              <p className="font-semibold text-gray-900">{application.bureau_data?.oldest_account}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Alternate Data Analysis</h3>
            <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
              Application-Specific Data
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white text-sm font-bold">
                  {(application as any).demo_scenario_id === 'climate_adaptive' ? '🌦️' : '📊'}
                </div>
                <h4 className="font-semibold text-blue-900">
                  {(application as any).demo_scenario_id === 'climate_adaptive' ? 'Climate Risk Indicators' : 'Market Stress Indicators'}
                </h4>
              </div>
              <div className="space-y-2 text-sm">
                {(application as any).demo_scenario_id === 'climate_adaptive' ? (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Annual Rainfall (2024):</span>
                      <span className="font-medium text-red-600">680mm (Below Avg)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Historical Average:</span>
                      <span className="font-medium text-gray-700">950mm/year</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Drought Risk (Next 6m):</span>
                      <span className="font-medium text-orange-600">Moderate (45%)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Flood Risk:</span>
                      <span className="font-medium text-green-600">Low (12%)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Crop Yield Impact:</span>
                      <span className="font-medium text-orange-600">-18% (Rice/Wheat)</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Portfolio at Risk (PAR):</span>
                      <span className="font-medium text-green-600">2.3% (Low)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Geographic Saturation:</span>
                      <span className="font-medium text-yellow-600">68% (Moderate)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Asset Class Performance:</span>
                      <span className="font-medium text-green-600">+12% (Strong)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Demographic Risk:</span>
                      <span className="font-medium text-green-600">Low Concentration</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-green-600 rounded flex items-center justify-center text-white text-sm font-bold">🏭</div>
                <h4 className="font-semibold text-green-900">Economic Activity & Affluence</h4>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Commercial Density:</span>
                  <span className="font-medium text-green-600">8 establishments/km²</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Consumer Spending:</span>
                  <span className="font-medium text-green-600">₹45K/month avg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Transport Hub Proximity:</span>
                  <span className="font-medium text-green-600">15km to nearest town</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Agricultural Land Value:</span>
                  <span className="font-medium text-green-600">₹2.5L/acre</span>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-purple-600 rounded flex items-center justify-center text-white text-sm font-bold">🏘️</div>
                <h4 className="font-semibold text-purple-900">Hyperlocal Infrastructure</h4>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Road Quality Index:</span>
                  <span className="font-medium text-green-600">8.2/10</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Financial Access:</span>
                  <span className="font-medium text-green-600">4 branches/1000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Livelihood Options:</span>
                  <span className="font-medium text-green-600">High Diversity</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Social Safety Index:</span>
                  <span className="font-medium text-green-600">7.8/10</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
                <h4 className="font-semibold text-green-900">Default Risk Assessment</h4>
              </div>
              <p className="text-sm text-green-800">
                <strong>Low default probability</strong> based on market stress indicators and local economic factors.
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">💰</span>
                </div>
                <h4 className="font-semibold text-blue-900">Household Income Estimation</h4>
              </div>
              <p className="text-sm text-blue-800">
                Estimated <strong>₹35,000 - ₹45,000 monthly household income</strong> based on agricultural output, local market activity, and rural spending patterns.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Bank Statement Analysis</h3>
            <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
              {application.bank_statement_data?.status || 'V Good'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-900 mb-3">Monthly Household Inflows</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Agricultural Income</span>
                  <span className="font-medium text-green-600">₹{(application.bank_statement_data?.inflows?.agri ?? 28000).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Livestock/Dairy</span>
                  <span className="font-medium text-green-600">₹{(application.bank_statement_data?.inflows?.dairy ?? 8000).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between font-semibold border-t pt-2">
                  <span className="text-gray-900">Total Household Income</span>
                  <span className="text-green-600">₹{(((application.bank_statement_data?.inflows?.agri ?? 28000) + (application.bank_statement_data?.inflows?.dairy ?? 8000))).toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            <div className="bg-red-50 p-4 rounded-lg">
              <h4 className="font-semibold text-red-900 mb-3">Monthly Outflows</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">EMI/Loan Payments</span>
                  <span className="font-medium text-red-600">₹{(application.bank_statement_data?.outflows?.emi ?? 4200).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Utilities & Bills</span>
                  <span className="font-medium text-red-600">₹{(application.bank_statement_data?.outflows?.utilities ?? 6200).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Other Debits</span>
                  <span className="font-medium text-red-600">₹{(application.bank_statement_data?.outflows?.other ?? 18300).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between font-semibold border-t pt-2">
                  <span className="text-gray-900">Total Outflows</span>
                  <span className="text-red-600">₹{(((application.bank_statement_data?.outflows?.emi ?? 4200) + (application.bank_statement_data?.outflows?.utilities ?? 6200) + (application.bank_statement_data?.outflows?.other ?? 18300))).toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-3">Account Insights</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Avg Monthly Balance</span>
                  <span className="font-medium text-blue-600">₹{(application.bank_statement_data?.insights?.avg_balance ?? 12000).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Disposable Income</span>
                  <span className="font-medium text-blue-600">₹{((((application.bank_statement_data?.inflows?.agri ?? 28000) + (application.bank_statement_data?.inflows?.dairy ?? 8000)) - ((application.bank_statement_data?.outflows?.emi ?? 4200) + (application.bank_statement_data?.outflows?.utilities ?? 6200) + (application.bank_statement_data?.outflows?.other ?? 18300)))).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Debt-to-Income Ratio</span>
                  <span className="font-medium text-blue-600">{application.bank_statement_data?.insights?.dti ?? '11.7%'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Account Stability</span>
                  <span className="font-medium text-green-600">{application.bank_statement_data?.insights?.stability ?? 'High'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">Transaction Patterns</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">94%</div>
                <div className="text-gray-600">Regular Deposits</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">₹1.2L</div>
                <div className="text-gray-600">6-Month Volume</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">3</div>
                <div className="text-gray-600">Bank Accounts</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">0</div>
                <div className="text-gray-600">Irregular Transactions</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {application.credit_decision === 'review' && (
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-300 p-8 rounded-xl shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center text-2xl">
              ⚠️
            </div>
            <div>
              <h3 className="text-2xl font-bold text-yellow-900">Manual Review Required</h3>
              <p className="text-sm text-yellow-700">Application requires human decision</p>
            </div>
          </div>
          <p className="text-base text-yellow-800 mb-6">
            This application has been flagged for manual review. Please provide your decision and comments below.
          </p>
          <div className="bg-white p-4 rounded-lg mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Reviewer Comments *
            </label>
            <textarea
              value={reviewerComments}
              onChange={(e) => setReviewerComments(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#11287c] focus:border-[#11287c] text-base"
              placeholder="Add detailed reviewer comments explaining your decision..."
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={() => handleManualDecisionUpdate('approved')}
              disabled={processing}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg font-semibold shadow-md"
            >
              {processing ? 'Saving...' : '✓ Approve Application'}
            </Button>
            <Button
              onClick={() => handleManualDecisionUpdate('rejected')}
              disabled={processing}
              variant="destructive"
              className="px-8 py-3 text-lg font-semibold shadow-md"
            >
              {processing ? 'Saving...' : '✗ Reject Application'}
            </Button>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between gap-3 mt-6">
        <Button onClick={onBack} variant="outline" className="w-full sm:w-auto">Back</Button>
        {application.credit_decision === 'approved' && (
          <Button
            onClick={handleApprove}
            className="bg-[#11287c] hover:bg-[#1e3a8a] text-white px-8 w-full sm:w-auto"
          >
            Approve & Continue to Disbursement
          </Button>
        )}
      </div>
    </div>
  );
};
