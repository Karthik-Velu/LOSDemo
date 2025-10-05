import React, { useState } from "react";
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

  const runCreditCheck = async () => {
    setProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 2500));

    const kiScore = Math.floor(Math.random() * 40) + 25;
    const requestedAmount = application.requested_amount || 50000;
    const eligibleAmount = requestedAmount * (kiScore > 50 ? 1.2 : 0.8);
    const recommendedAmount = requestedAmount;

    const decisionData = {
      ki_score: kiScore,
      eligible_amount: eligibleAmount,
      recommended_amount: recommendedAmount,
      recommended_term: 12,
      recommended_apr: 28,
      credit_decision: kiScore > 40 ? 'approved' : 'review' as const,
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
          monthly_debt_repayments: 8500,
          drinking_water_access: 'Yes',
          toilet_access: 'Yes',
          lpg_cooking: 'Yes',
          scooter_ownership: 'Yes',
          computer_ownership: 'No',
          refrigerator_ownership: 'No',
        },
      },
      bank_statement_data: {
        status: 'V Good',
      },
      decision_reasons: {
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
    setProcessing(false);
  };

  const handleApprove = async () => {
    await onUpdate({ status: 'approved' });
    onNext();
  };

  const getScoreColor = (score: number) => {
    if (score >= 60) return '#22c55e';
    if (score >= 40) return '#eab308';
    if (score >= 20) return '#f97316';
    return '#ef4444';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Poor';
  };

  if (!application.credit_checked_at) {
    return (
      <div>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Credit Check</h2>
          <p className="text-sm text-gray-600 mt-1">Run comprehensive credit assessment</p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-sm text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-5xl">📊</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Ready for Credit Assessment</h3>
          <p className="text-gray-600 mb-6">
            This will pull credit bureau data, analyze bank statements, and utilize Kaleidofin's alternate data to make a lending decision.
          </p>
          <Button
            onClick={runCreditCheck}
            disabled={processing}
            className="bg-[#11287c] hover:bg-[#1e3a8a] text-white px-8 py-3"
          >
            {processing ? 'Running Credit Check...' : 'Run Credit Check'}
          </Button>
        </div>

        <div className="flex justify-start mt-6">
          <Button onClick={onBack} variant="outline">Back</Button>
        </div>
      </div>
    );
  }

  const kiScore = application.ki_score || 0;
  const decision = application.decision_reasons as any;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Credit Check Results</h2>
          <p className="text-sm text-gray-600 mt-1">Loan ID: {application.loan_id}</p>
        </div>
        <div className={`px-4 py-2 rounded-lg font-semibold ${
          application.credit_decision === 'approved' ? 'bg-green-100 text-green-800' :
          application.credit_decision === 'rejected' ? 'bg-red-100 text-red-800' :
          'bg-yellow-100 text-yellow-800'
        }`}>
          {application.credit_decision?.toUpperCase()}
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Ki Decision Summary</h3>
          <div className="grid grid-cols-2 gap-6">
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

            <div className="space-y-3">
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
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Model Explainability</h3>
          <div className="grid grid-cols-3 gap-4">
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
          <div className="grid grid-cols-4 gap-4 text-sm">
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
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Alternate Data Analysis</h3>
            <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">Good</span>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Socioeconomic Infrastructure</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Number of schools nearby</span>
                  <span className="font-medium">{application.alternate_data?.socioeconomic?.schools_nearby}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Number of hospitals nearby</span>
                  <span className="font-medium">{application.alternate_data?.socioeconomic?.hospitals_nearby}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">% households with RCC roofs</span>
                  <span className="font-medium">{application.alternate_data?.socioeconomic?.households_with_rcc_roofs}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Car ownership % in area</span>
                  <span className="font-medium">{application.alternate_data?.socioeconomic?.car_ownership}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Bank branches per 1000 people</span>
                  <span className="font-medium">{application.alternate_data?.socioeconomic?.bank_branches_per_1000}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Local Crime Rate</span>
                  <span className="font-medium text-green-600">{application.alternate_data?.socioeconomic?.local_crime_rate}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Climate Risk Factor</h4>
              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Rainfall patterns</span>
                  <span className="font-medium">{application.alternate_data?.climate_risk?.rainfall_patterns}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Drought risk indicators</span>
                  <span className="font-medium text-green-600">{application.alternate_data?.climate_risk?.drought_risk}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Flood risk assessment</span>
                  <span className="font-medium text-yellow-600">{application.alternate_data?.climate_risk?.flood_risk}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Climate vulnerability score</span>
                  <span className="font-medium">{application.alternate_data?.climate_risk?.climate_vulnerability}</span>
                </div>
              </div>

              <h4 className="text-sm font-semibold text-gray-900 mb-3">Digital Footprint</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Mobile phone tenure</span>
                  <span className="font-medium text-green-600">{application.alternate_data?.digital_footprint?.mobile_tenure}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email tenure</span>
                  <span className="font-medium">{application.alternate_data?.digital_footprint?.email_tenure}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Income Estimates</h4>
            <div className="grid grid-cols-4 gap-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Monthly debt repayments</span>
                <span className="font-medium">₹{application.alternate_data?.income_estimates?.monthly_debt_repayments?.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Drinking water access</span>
                <span className="font-medium text-green-600">{application.alternate_data?.income_estimates?.drinking_water_access}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Toilet access</span>
                <span className="font-medium text-green-600">{application.alternate_data?.income_estimates?.toilet_access}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">LPG cooking</span>
                <span className="font-medium text-green-600">{application.alternate_data?.income_estimates?.lpg_cooking}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Scooter ownership</span>
                <span className="font-medium text-green-600">{application.alternate_data?.income_estimates?.scooter_ownership}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Computer ownership</span>
                <span className="font-medium">{application.alternate_data?.income_estimates?.computer_ownership}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Refrigerator ownership</span>
                <span className="font-medium">{application.alternate_data?.income_estimates?.refrigerator_ownership}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Bank Statement Analysis</h3>
            <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
              {application.bank_statement_data?.status}
            </span>
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-6">
        <Button onClick={onBack} variant="outline">Back</Button>
        {application.credit_decision === 'approved' && (
          <Button
            onClick={handleApprove}
            className="bg-green-600 hover:bg-green-700 text-white px-8"
          >
            Approve & Continue to Disbursement
          </Button>
        )}
        {application.credit_decision === 'review' && (
          <Button
            onClick={handleApprove}
            className="bg-yellow-600 hover:bg-yellow-700 text-white px-8"
          >
            Manual Approval Required
          </Button>
        )}
      </div>
    </div>
  );
};
