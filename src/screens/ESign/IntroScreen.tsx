import React, { useState } from "react";
import { Button } from "../../components/ui/button";

interface IntroScreenProps {
  region: string;
  onNext: (scenarioId?: string) => void;
}

const apacScenarios = [
  {
    name: "Sri Lanka Farmer",
    color: "amber",
    icon: "🌦️",
    description: "Featured flow: dry-zone paddy farmer, climate-adaptive terms, Anuradhapura",
    outcome: "Auto-Approved • 14% APR • LKR 180,000 eligible"
  },
  {
    name: "Young Professional",
    color: "blue",
    icon: "👤",
    description: "Manufacturing worker with attendance-linked monthly pay",
    outcome: "Auto-Approved • Competitive APR • Moderate eligibility"
  },
  {
    name: "Climate Adaptive",
    color: "orange",
    icon: "🌾",
    description: "Farmer with climate risk and adaptive repayment terms",
    outcome: "Auto-Approved • Adaptive tenure • Climate-aware structuring"
  },
  {
    name: "Low Risk Customer",
    color: "emerald",
    icon: "⭐",
    description: "Excellent credit profile with strong financial history",
    outcome: "Auto-Approved • Lower risk • Strong eligibility"
  },
  {
    name: "Fraud Rejection",
    color: "red",
    icon: "⚠️",
    description: "Multiple identity mismatches and suspicious activity",
    outcome: "Rejected at KYC • High fraud score • Failed verification"
  },
  {
    name: "Credit Rejection",
    color: "red",
    icon: "💳",
    description: "Poor cash flow and high debt-to-income ratio",
    outcome: "Rejected • Irregular transactions • Low balance"
  }
];

const africaScenarios = [
  {
    id: 'africa_agri_alt_only',
    name: "Kenya Farmer (Alt Data Only)",
    color: "amber",
    icon: "🌍",
    description: "Maize farmer in Machakos County — decisioning from farmer profile, farm/crop data, climate signals, and socioeconomic context alone. No bureau or transaction history.",
    outcome: "Auto-Approved • 18% APR • KES 85,000 eligible"
  },
  {
    id: 'africa_agri_enhanced',
    name: "Kenya Farmer (Enhanced)",
    color: "emerald",
    icon: "🏦",
    description: "Coffee farmer in Nyeri County — same alternate data foundation, enhanced with credit bureau history and M-Pesa transaction data for stronger risk separation.",
    outcome: "Auto-Approved • 14% APR • KES 150,000 eligible"
  }
];

export const IntroScreen: React.FC<IntroScreenProps> = ({ region, onNext }) => {
  const [showFlowModal, setShowFlowModal] = useState(false);
  const [showScenariosModal, setShowScenariosModal] = useState(false);
  const [selectedScenarioId, setSelectedScenarioId] = useState<string | undefined>(undefined);

  const isAfrica = region === 'africa';
  const scenarios = isAfrica ? africaScenarios : apacScenarios;

  const getColorClasses = (color: string) => {
    const colors: Record<string, string> = {
      emerald: "border-emerald-300 bg-gradient-to-br from-emerald-50 to-green-50 hover:shadow-emerald-200",
      green: "border-green-300 bg-gradient-to-br from-green-50 to-emerald-50 hover:shadow-green-200",
      blue: "border-blue-300 bg-gradient-to-br from-blue-50 to-indigo-50 hover:shadow-blue-200",
      yellow: "border-yellow-300 bg-gradient-to-br from-yellow-50 to-amber-50 hover:shadow-yellow-200",
      orange: "border-orange-300 bg-gradient-to-br from-orange-50 to-yellow-50 hover:shadow-orange-200",
      amber: "border-amber-300 bg-gradient-to-br from-amber-50 to-orange-50 hover:shadow-amber-200",
      red: "border-red-300 bg-gradient-to-br from-red-50 to-pink-50 hover:shadow-red-200"
    };
    return colors[color] || colors.blue;
  };

  const regionSubtitle = isAfrica
    ? 'AI-powered credit decisioning for smallholder farmers using climate, soil, crop, and socioeconomic data.'
    : '';

  const flowSteps = isAfrica
    ? ["Application", "Farm Profile", "Credit Assessment", "Disbursement"]
    : ["Application", "Consent", "KYC & Fraud", "Credit Assessment", "Disbursement"];

  const flowDescriptions = isAfrica
    ? [
        { title: "Loan Application Entry", description: "Loan officer captures the farmer profile, demographics, geography, and loan request for the Kenya borrower.", icon: "📝", color: "blue" },
        { title: "Farm & Crop Profile", description: "Farm-level inputs — crop type, acreage, irrigation, GPS coordinates — are captured. Climate, soil, and socioeconomic data are automatically extracted at the farm location.", icon: "🌱", color: "green" },
        { title: "Credit Assessment", description: "Ki Score assesses the farmer using climate, soil, crop, farm profile, and socioeconomic signals. Bureau and transaction data are layered in when available.", icon: "📊", color: "indigo" },
        { title: "Loan Disbursement", description: "After Ki Score returns the decision, the loan officer confirms the beneficiary account, captures the agreement, and disburses the loan.", icon: "💰", color: "emerald" },
      ]
    : [
        { title: "Loan Application Entry", description: "Loan officer captures the applicant, co-applicant, geography, and loan request details.", icon: "📝", color: "blue" },
        { title: "Borrower Consent", description: "Borrower provides consent to pull bureau and bank-statement evidence through OTP.", icon: "🔐", color: "green" },
        { title: "KYC & Fraud Assessment", description: "Kaleidofin performs thorough KYC and fraud assessment to establish the borrower is genuine.", icon: "🛡️", color: "purple" },
        { title: "Credit Assessment", description: "Comprehensive credit assessment using bureau data, bank statements, application, and alternative data.", icon: "📊", color: "indigo" },
        { title: "Loan Disbursement", description: "Validates the beneficiary account, captures the agreement, and disburses the loan.", icon: "💰", color: "emerald" },
      ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-gradient-to-br from-white via-blue-50 to-indigo-50 rounded-3xl shadow-2xl p-8 md:p-12 border border-blue-100">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#11287c] to-[#1e3a8a] bg-clip-text text-transparent mb-4">
            Loan Origination<br />Demo Platform
          </h1>
          <p className="text-base text-gray-600 leading-relaxed max-w-2xl mx-auto">
            Experience how Kaleidofin's <span className="font-semibold text-[#11287c]">alternative data</span> technology provides
            fair credit to underserved and low-income customers who might otherwise be rejected.
          </p>
          {regionSubtitle && (
            <p className="text-sm text-[#11287c] font-medium mt-4 max-w-2xl mx-auto">
              {regionSubtitle}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-blue-100 hover:border-blue-300 transition-all">
            <div className="text-4xl mb-3">🎯</div>
            <h3 className="font-bold text-lg text-gray-900 mb-2">Fair & Accurate</h3>
            <p className="text-sm text-gray-600">Decisions based on comprehensive data, not just credit history</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-green-100 hover:border-green-300 transition-all">
            <div className="text-4xl mb-3">⚡</div>
            <h3 className="font-bold text-lg text-gray-900 mb-2">Fast Decisioning</h3>
            <p className="text-sm text-gray-600">Automated assessment delivers results in minutes, not weeks</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-purple-100 hover:border-purple-300 transition-all">
            <div className="text-4xl mb-3">🤝</div>
            <h3 className="font-bold text-lg text-gray-900 mb-2">Transparent Process</h3>
            <p className="text-sm text-gray-600">Clear explanations for every credit decision</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-xl mb-8 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Demo Scenarios</h2>
              <p className="text-sm text-gray-500 mt-1">
                {isAfrica
                  ? 'Select a use case below, then click Start Demo Experience.'
                  : 'Sri Lanka Farmer is the primary flow for today\'s presentation.'}
              </p>
            </div>
            <button
              onClick={() => setShowScenariosModal(true)}
              className="text-[#11287c] hover:text-[#1e3a8a] font-semibold text-sm flex items-center gap-2 transition-all"
            >
              View All Details →
            </button>
          </div>
          <div className={`grid gap-4 ${isAfrica ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6'}`}>
            {scenarios.map((scenario, idx) => {
              const sid = (scenario as any).id as string | undefined;
              const isSelected = isAfrica && sid && selectedScenarioId === sid;
              return (
                <div
                  key={idx}
                  onClick={() => isAfrica && sid && setSelectedScenarioId(sid)}
                  className={`border-2 rounded-xl p-4 text-center transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[#11287c] bg-blue-50 shadow-lg ring-2 ring-[#11287c] ring-offset-2'
                      : `${getColorClasses(scenario.color)} hover:shadow-lg`
                  }`}
                >
                  <div className="text-3xl mb-2">{scenario.icon}</div>
                  <p className="text-xs font-semibold text-gray-900">{scenario.name}</p>
                  {isSelected && <p className="text-xs text-[#11287c] font-bold mt-1">Selected</p>}
                  {isAfrica && !isSelected && (
                    <p className="text-xs text-gray-400 mt-1">Click to select</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-xl mb-8 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">End-to-End Process</h2>
            <button
              onClick={() => setShowFlowModal(true)}
              className="text-[#11287c] hover:text-[#1e3a8a] font-semibold text-sm flex items-center gap-2 transition-all"
            >
              <span className="inline-block w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center text-xs">ℹ️</span>
              View Detailed Flow
            </button>
          </div>
          <div className="flex items-center justify-between gap-2 overflow-x-auto pb-4">
            {flowSteps.map((step, idx) => (
              <React.Fragment key={idx}>
                <div className="flex-shrink-0 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#11287c] to-[#1e3a8a] rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg mb-2">
                    {idx + 1}
                  </div>
                  <p className="text-xs font-medium text-gray-700 max-w-[80px]">{step}</p>
                </div>
                {idx < flowSteps.length - 1 && (
                  <div className="flex-shrink-0 h-1 w-8 bg-gradient-to-r from-[#11287c] to-[#1e3a8a] rounded"></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="text-center">
          <Button
            onClick={() => onNext(isAfrica ? selectedScenarioId : undefined)}
            disabled={isAfrica && !selectedScenarioId}
            className="bg-gradient-to-r from-[#11287c] to-[#1e3a8a] hover:from-[#1e3a8a] hover:to-[#11287c] text-white px-10 py-4 text-lg font-semibold rounded-xl shadow-lg transition-all transform hover:scale-105 hover:shadow-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            Start Demo Experience →
          </Button>
          <p className="text-sm text-gray-500 mt-4">
            {isAfrica && !selectedScenarioId
              ? 'Select a use case above to continue'
              : 'Click to begin your journey through our credit assessment process'}
          </p>
        </div>
      </div>

      {showScenariosModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowScenariosModal(false)}>
          <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-gradient-to-r from-[#11287c] to-[#1e3a8a] text-white p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">
                  {isAfrica ? 'Africa Demo Scenarios' : 'All Demo Scenarios'}
                </h2>
                <button onClick={() => setShowScenariosModal(false)} className="text-white hover:bg-white/20 rounded-full w-8 h-8 flex items-center justify-center transition-all">
                  ✕
                </button>
              </div>
            </div>
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {scenarios.map((scenario, idx) => (
                  <div key={idx} className={`${getColorClasses(scenario.color)} border-2 rounded-xl p-6 shadow-md`}>
                    <div className="flex items-start gap-4">
                      <div className="text-4xl flex-shrink-0">{scenario.icon}</div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-gray-900 mb-2">{scenario.name}</h3>
                        <p className="text-sm text-gray-700 mb-3">{scenario.description}</p>
                        <div className="bg-white/70 rounded-lg p-3 border border-gray-200">
                          <p className="text-xs font-semibold text-gray-600 mb-1">Expected Outcome:</p>
                          <p className="text-sm font-medium text-gray-900">{scenario.outcome}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {showFlowModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowFlowModal(false)}>
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-gradient-to-r from-[#11287c] to-[#1e3a8a] text-white p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Complete Assessment Flow</h2>
                <button onClick={() => setShowFlowModal(false)} className="text-white hover:bg-white/20 rounded-full w-8 h-8 flex items-center justify-center transition-all">
                  ✕
                </button>
              </div>
            </div>
            <div className="p-8">
              <div className="space-y-6">
                {flowDescriptions.map((item, idx) => (
                  <div key={idx} className="flex gap-6">
                    <div className="flex-shrink-0">
                      <div className={`w-16 h-16 bg-gradient-to-br from-${item.color}-500 to-${item.color}-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg`}>
                        {idx + 1}
                      </div>
                    </div>
                    <div className="flex-1 bg-gradient-to-br from-gray-50 to-white rounded-xl p-5 border-2 border-gray-200 shadow-sm">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-3xl">{item.icon}</span>
                        <h3 className="font-bold text-lg text-gray-900">{item.title}</h3>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200">
                <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="text-2xl">⚡</span>
                  Why This Matters
                </h4>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {isAfrica
                    ? 'Ki Score can generate a robust risk assessment using publicly available alternate data alone — no bureau record, no M-Pesa history, no bank statement required. Bureau and transaction data enhance the score further, but they are not prerequisites. This makes thin-file and no-file farmers visible to the financial system for the first time.'
                    : 'Automation of fraud assessment and credit assessment ensures borrower needs are met within minutes compared to weeks before. Additionally, recommendation of best terms ensures genuine borrowers are not subjected to high interest loans or unreasonable payback structures, preventing hardship for borrowers and NPAs for the financial institution.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
