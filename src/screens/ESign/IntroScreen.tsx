import React, { useState } from "react";
import { Button } from "../../components/ui/button";

interface IntroScreenProps {
  onNext: () => void;
}

export const IntroScreen: React.FC<IntroScreenProps> = ({ onNext }) => {
  const [showFlowModal, setShowFlowModal] = useState(false);
  const [showScenariosModal, setShowScenariosModal] = useState(false);

  const scenarios = [
    { 
      name: "Young Professional", 
      color: "blue", 
      icon: "👤", 
      description: "New to credit, limited history but stable income",
      outcome: "Auto-Approved • 17% APR • ₹45,000 requested"
    },
    { 
      name: "Climate Adaptive", 
      color: "orange", 
      icon: "🌾", 
      description: "Farmer with climate risk, adaptive repayment terms",
      outcome: "Auto-Approved • 17% APR • 18-month flexible term"
    },
    { 
      name: "Low Risk Customer", 
      color: "emerald", 
      icon: "⭐", 
      description: "Excellent credit profile with strong financial history",
      outcome: "Auto-Approved • 16% APR • ₹80,000 requested"
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

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-gradient-to-br from-white via-blue-50 to-indigo-50 rounded-3xl shadow-2xl p-8 md:p-12 border border-blue-100">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-6">
            <svg width="339" height="80" viewBox="0 0 339 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-20 w-auto drop-shadow-lg">
              <path d="M0 33.4877L34.7483 16.4542V30.081L0 47.1145V33.4877Z" fill="#0F547E"/>
              <path d="M0 47.4552L34.7483 64.4887V50.8619L0 33.8284V47.4552Z" fill="#28B2B6"/>
              <path d="M79.4627 31.5409L66.8663 44.7768L79.7185 63.0001H69.2961L60.9837 50.9791L57.4669 54.6877V63.0001H48.9627V16.7065H57.4669V43.2422L68.3369 31.5409H79.4627ZM89.3477 63.0001H80.8435V31.5409H89.3477V63.0001ZM79.8204 21.2463C79.8204 18.305 82.1862 15.9392 85.0636 15.9392C88.0049 15.9392 90.3068 18.305 90.3068 21.2463C90.3068 24.0598 88.0049 26.4256 85.0636 26.4256C82.1862 26.4256 79.8204 24.0598 79.8204 21.2463Z" fill="#0F547E"/>
              <path d="M120.708 56.2223C124.865 56.2223 128.701 53.217 128.701 47.2705C128.701 41.3239 124.865 38.3187 120.708 38.3187C116.552 38.3187 112.716 41.3239 112.716 47.2705C112.716 53.1531 116.552 56.2223 120.708 56.2223ZM120.708 30.5818C130.108 30.5818 137.205 37.5514 137.205 47.2705C137.205 56.9256 130.108 63.9592 120.708 63.9592C111.309 63.9592 104.212 56.9256 104.212 47.2705C104.212 37.5514 111.309 30.5818 120.708 30.5818ZM159.264 31.413V39.9812C158.305 39.7894 157.474 39.7254 156.706 39.7254C152.358 39.7254 148.586 41.8355 148.586 48.6133V63.0001H140.082V31.5409H148.33V36.2086C150.248 32.0524 154.596 31.2851 157.282 31.2851C157.985 31.2851 158.625 31.3491 159.264 31.413ZM169.914 63.0001H161.41V31.5409H169.914V63.0001ZM160.387 21.2463C160.387 18.305 162.752 15.9392 165.63 15.9392C168.571 15.9392 170.873 18.305 170.873 21.2463C170.873 24.0598 168.571 26.4256 165.63 26.4256C162.752 26.4256 160.387 24.0598 160.387 21.2463ZM172.944 64.7265L180.617 62.6804C181.192 66.1332 183.942 68.6269 187.97 68.6269C193.341 68.6269 196.347 65.9414 196.347 59.8669V57.5651C195.068 59.6112 192.126 61.5934 187.587 61.5934C179.21 61.5934 172.944 55.1353 172.944 46.3114C172.944 37.999 178.955 30.9654 187.587 30.9654C192.574 30.9654 195.451 33.1394 196.538 35.2495V31.5409H204.723V59.6112C204.723 68.2433 200.055 76.1081 188.226 76.1081C179.594 76.1081 173.839 70.737 172.944 64.7265ZM189.057 54.304C193.405 54.304 196.474 51.1709 196.474 46.3114C196.474 41.4518 193.15 38.3826 189.057 38.3826C184.837 38.3826 181.512 41.4518 181.512 46.3114C181.512 51.2349 184.645 54.304 189.057 54.304ZM218.002 63.0001H209.498V31.5409H218.002V63.0001ZM208.475 21.2463C208.475 18.305 210.841 15.9392 213.718 15.9392C216.659 15.9392 218.961 18.305 218.961 21.2463C218.961 24.0598 216.659 26.4256 213.718 26.4256C210.841 26.4256 208.475 24.0598 208.475 21.2463ZM231.775 44.9047V63.0001H223.27V31.5409H231.519V35.4413C233.437 32.1803 237.21 30.7097 240.599 30.7097C248.399 30.7097 251.98 36.2726 251.98 43.1782V63.0001H243.476V44.6489C243.476 41.1321 241.749 38.3826 237.657 38.3826C233.949 38.3826 231.775 41.26 231.775 44.9047ZM254.856 54.4319C254.856 48.8051 259.013 45.672 264.256 44.9047L271.993 43.7537C273.783 43.498 274.359 42.6028 274.359 41.5158C274.359 39.2778 272.632 37.4235 269.051 37.4235C265.343 37.4235 263.297 39.7894 263.041 42.5388L255.496 40.9403C256.007 36.0168 260.547 30.5818 268.987 30.5818C278.962 30.5818 282.671 36.2086 282.671 42.5388V58.0126C282.671 59.6751 282.863 61.9131 283.055 63.0001H275.254C275.062 62.1688 274.934 60.4424 274.934 59.2275C273.336 61.7212 270.33 63.8953 265.663 63.8953C258.949 63.8953 254.856 59.3554 254.856 54.4319ZM267.453 57.5651C271.034 57.5651 274.359 55.8386 274.359 50.2757V48.869L267.261 49.956C265.087 50.2757 263.361 51.4906 263.361 53.9204C263.361 55.7747 264.703 57.5651 267.453 57.5651ZM297.706 22.1415V31.5409H304.036V39.086H297.706V52.2579C297.706 55.0074 298.984 55.9026 301.414 55.9026C302.437 55.9026 303.588 55.7747 304.036 55.6468V62.6804C303.269 63.0001 301.734 63.4477 299.24 63.4477C293.102 63.4477 289.265 59.803 289.265 53.7286V39.086H283.575V31.5409H285.173C288.498 31.5409 290.033 29.3669 290.033 26.5535V22.1415H297.706ZM313.313 43.6898H327.38C327.253 40.5567 325.206 37.4875 320.347 37.4875C315.935 37.4875 313.505 40.8124 313.313 43.6898ZM328.212 51.8743L335.309 53.9843C333.711 59.4194 328.723 63.9592 320.986 63.9592C312.354 63.9592 304.745 57.7569 304.745 47.1426C304.745 37.1038 312.162 30.5818 320.219 30.5818C329.938 30.5818 335.757 36.7841 335.757 46.8868C335.757 48.1017 335.629 49.3806 335.629 49.5084H313.122C313.313 53.6646 316.83 56.6699 321.05 56.6699C325.015 56.6699 327.189 54.6877 328.212 51.8743Z" fill="#28B2B6"/>
            </svg>
          </div>
          
          <h1 className="text-5xl font-bold bg-gradient-to-r from-[#11287c] to-[#1e3a8a] bg-clip-text text-transparent mb-4">
            Ki Originate Demo
          </h1>
          
          <p className="text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto">
            Experience how <span className="font-semibold text-[#11287c]">Ki Originate</span> uses Kaleidofin's <span className="font-semibold text-[#11287c]">alternative data</span> technology to provide 
            fair credit to underserved and low-income customers who might otherwise be rejected.
          </p>
        </div>

        {/* Value Proposition */}
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

        {/* Demo Scenarios Preview */}
        <div className="bg-white rounded-2xl p-8 shadow-xl mb-8 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Demo Scenarios</h2>
            <button
              onClick={() => setShowScenariosModal(true)}
              className="text-[#11287c] hover:text-[#1e3a8a] font-semibold text-sm flex items-center gap-2 transition-all"
            >
              View All Details →
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {scenarios.map((scenario, idx) => (
              <div
                key={idx}
                className={`${getColorClasses(scenario.color)} border-2 rounded-xl p-4 text-center transition-all hover:shadow-lg cursor-pointer`}
              >
                <div className="text-3xl mb-2">{scenario.icon}</div>
                <p className="text-xs font-semibold text-gray-900">{scenario.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Process Flow Preview */}
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
            {["Application", "Consent", "KYC & Fraud", "Credit Assessment", "Disbursement"].map((step, idx) => (
              <React.Fragment key={idx}>
                <div className="flex-shrink-0 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#11287c] to-[#1e3a8a] rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg mb-2">
                    {idx + 1}
                  </div>
                  <p className="text-xs font-medium text-gray-700 max-w-[80px]">{step}</p>
                </div>
                {idx < 4 && (
                  <div className="flex-shrink-0 h-1 w-8 bg-gradient-to-r from-[#11287c] to-[#1e3a8a] rounded"></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <Button
            onClick={onNext}
            className="bg-gradient-to-r from-[#11287c] to-[#1e3a8a] hover:from-[#1e3a8a] hover:to-[#11287c] text-white px-16 py-7 text-2xl font-bold rounded-2xl shadow-2xl transition-all transform hover:scale-105 hover:shadow-blue-500/50"
          >
            Start Demo Experience →
          </Button>
          <p className="text-sm text-gray-500 mt-4">Click to begin your journey through our credit assessment process</p>
        </div>
      </div>

      {/* Scenarios Modal */}
      {showScenariosModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowScenariosModal(false)}>
          <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-gradient-to-r from-[#11287c] to-[#1e3a8a] text-white p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">All Demo Scenarios</h2>
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

      {/* Flow Modal */}
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
                {[
                  {
                    step: 1,
                    title: "Loan Application Entry",
                    description: "Loan officer fills in the loan application details through the loan origination system of the financial institution.",
                    icon: "📝",
                    color: "blue"
                  },
                  {
                    step: 2,
                    title: "Borrower Consent",
                    description: "Borrower provides consent to pull their bank statement data and credit bureau data through OTP received at their registered number.",
                    icon: "🔐",
                    color: "green"
                  },
                  {
                    step: 3,
                    title: "KYC & Fraud Assessment",
                    description: "Kaleidofin performs thorough KYC and fraud assessment to establish the borrower is genuine and there is no fraud risk.",
                    icon: "🛡️",
                    color: "purple"
                  },
                  {
                    step: 4,
                    title: "Credit Assessment",
                    description: "Once borrower is verified as genuine, Kaleidofin conducts comprehensive credit assessment to establish borrower's capacity. Decision is made using credit bureau data, bank statements, loan application, and our internal alternative data database.",
                    icon: "📊",
                    color: "indigo"
                  },
                  {
                    step: 5,
                    title: "Loan Disbursement",
                    description: "After Kaleidofin returns the decision, the loan operations officer disburses the loan in a few simple steps.",
                    icon: "💰",
                    color: "emerald"
                  }
                ].map((item) => (
                  <div key={item.step} className="flex gap-6">
                    <div className="flex-shrink-0">
                      <div className={`w-16 h-16 bg-gradient-to-br from-${item.color}-500 to-${item.color}-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg`}>
                        {item.step}
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
                  Automation of fraud assessment and credit assessment ensures borrower needs are met within <strong>minutes</strong> compared to <strong>weeks</strong> before. 
                  Additionally, recommendation of best terms ensures genuine borrowers are not subjected to high interest loans or unreasonable payback structures, 
                  preventing hardship for borrowers and NPAs for the financial institution.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

