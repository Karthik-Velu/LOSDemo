import React, { useState, useEffect } from "react";
import { type LoanApplication } from "../../lib/supabase";
import { Button } from "../../components/ui/button";
import { StepNarration } from "../../components/StepNarration";

interface OTPVerificationProps {
  application: LoanApplication;
  onUpdate: (updates: Partial<LoanApplication>) => Promise<any>;
  onNext: () => void;
  onBack: () => void;
}

export const OTPVerification: React.FC<OTPVerificationProps> = ({
  application,
  onUpdate,
  onNext,
  onBack,
}) => {
  const [otp, setOtp] = useState('');
  const [processing, setProcessing] = useState(false);
  const [verified, setVerified] = useState(false);
  const scenario = (application as any).demo_scenario_id as string | undefined;
  const isSriLankaScenario = scenario === 'sri_lanka_climate_farmer';
  const isAfricaAltOnly = scenario === 'africa_agri_alt_only';
  const isAfricaEnhanced = scenario === 'africa_agri_enhanced';
  const isAfricaScenario = isAfricaAltOnly || isAfricaEnhanced;

  const [pdfUploading, setPdfUploading] = useState(false);
  const [pdfUploaded, setPdfUploaded] = useState(false);
  const pdfUploadStarted = React.useRef(false);

  const [consentConfirming, setConsentConfirming] = useState(false);
  const [consentConfirmed, setConsentConfirmed] = useState(false);
  const consentStarted = React.useRef(false);

  // Auto-verify OTP for non-Africa-alt-only scenarios
  useEffect(() => {
    if (isAfricaAltOnly) return;
    if (!application.bureau_otp_verified && !application.bank_otp_verified) {
      const timer = setTimeout(() => {
        setOtp('123456');
        setTimeout(() => {
          verifyOTP();
        }, 1000);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  // Auto-confirm consent for Africa alt-data-only
  useEffect(() => {
    if (isAfricaAltOnly && !consentStarted.current) {
      consentStarted.current = true;
      setConsentConfirming(true);
      const timer = setTimeout(async () => {
        await onUpdate({
          bureau_otp_verified: true,
          bureau_otp_verified_at: new Date().toISOString(),
          bank_otp_verified: true,
          bank_otp_verified_at: new Date().toISOString(),
        });
        setConsentConfirmed(true);
        setConsentConfirming(false);
        setTimeout(() => { onNext(); }, 1500);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [isAfricaAltOnly]);

  // PDF upload for Sri Lanka after OTP
  useEffect(() => {
    if (isSriLankaScenario && verified && !pdfUploadStarted.current) {
      pdfUploadStarted.current = true;
      setPdfUploading(true);
      const timer = setTimeout(() => {
        setPdfUploaded(true);
        setPdfUploading(false);
        setTimeout(() => { onNext(); }, 1500);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [verified, isSriLankaScenario]);

  const verifyOTP = async () => {
    if (otp.length !== 6) return;

    setProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

    await onUpdate({
      bureau_otp_verified: true,
      bureau_otp_verified_at: new Date().toISOString(),
      bank_otp_verified: true,
      bank_otp_verified_at: new Date().toISOString(),
    });

    setVerified(true);
    setProcessing(false);

    if (!isSriLankaScenario) {
      setTimeout(() => { onNext(); }, 1500);
    }
  };

  // --- AFRICA ALT-DATA-ONLY: simple consent confirmation ---
  if (isAfricaAltOnly) {
    return (
      <div>
        <StepNarration
          step={2}
          title="Borrower Consent"
          description="The borrower provides consent for Ki Score to assess their application using alternate data — farmer profile, farm and crop data, climate signals, and socioeconomic context. No bureau or transaction data is required."
          icon="🔐"
          color="green"
        />
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Data Consent</h2>
          <p className="text-sm text-gray-600 mt-1">Confirm consent for alternate data assessment</p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-sm max-w-lg mx-auto">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">🌍</span>
            </div>
            {consentConfirmed ? (
              <>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-3xl">✅</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Consent Confirmed</h3>
                <p className="text-sm text-gray-600">Proceeding to KYC and fraud assessment...</p>
              </>
            ) : consentConfirming ? (
              <>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Confirming Consent...</h3>
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  <p className="text-gray-600">Collecting consent and preparing alternate data assessment</p>
                </div>
              </>
            ) : (
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Consent Required</h3>
            )}
          </div>

          {!consentConfirmed && !consentConfirming && (
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg text-sm text-left">
              <p className="font-semibold text-amber-900 mb-2">This consent authorizes assessment using:</p>
              <ul className="space-y-1 text-amber-800">
                <li className="flex items-start gap-2"><span>•</span><span><strong>Farmer Profile:</strong> Demographics, household, and livelihood data</span></li>
                <li className="flex items-start gap-2"><span>•</span><span><strong>Farm & Crop Data:</strong> Crop type, acreage, irrigation practice</span></li>
                <li className="flex items-start gap-2"><span>•</span><span><strong>Climate Signals:</strong> Rainfall, temperature, drought severity at farm location</span></li>
                <li className="flex items-start gap-2"><span>•</span><span><strong>Socioeconomic Context:</strong> Rural deprivation index, infrastructure access</span></li>
              </ul>
              <p className="mt-3 text-xs text-amber-700">No credit bureau or bank transaction data is used in this assessment path.</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // --- AFRICA ENHANCED: OTP for bureau + M-Pesa ---
  if (isAfricaEnhanced && verified) {
    return (
      <div className="text-center py-8">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-4xl">✅</span>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Verification Complete</h3>
        <p className="text-gray-600">Bureau and M-Pesa transaction data access authorized. Proceeding to KYC and fraud assessment...</p>
      </div>
    );
  }

  // --- SRI LANKA: OTP + PDF upload ---
  if (isSriLankaScenario && verified) {
    return (
      <div className="max-w-lg mx-auto py-8 space-y-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-3xl">✅</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">CRIB Bureau Consent Verified</h3>
          <p className="text-sm text-gray-600">OTP verified. Bureau data pull authorized.</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border-2 border-blue-100">
          <h4 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <span className="text-xl">📄</span>
            Bank Statement Upload
          </h4>

          {pdfUploading ? (
            <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">Uploading bank statement PDF...</p>
                <p className="text-sm text-gray-600">Parsing transactions and cash-flow data</p>
              </div>
            </div>
          ) : pdfUploaded ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white text-lg font-bold">✓</div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">Bank statement uploaded</p>
                  <p className="text-sm text-gray-600">6 months of transaction data extracted</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-gray-500 text-xs">File</p>
                  <p className="font-medium text-gray-900">BOC_Statement_6M.pdf</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-gray-500 text-xs">Period</p>
                  <p className="font-medium text-gray-900">Sep 2025 – Feb 2026</p>
                </div>
              </div>
              <p className="text-sm text-gray-600">Proceeding to KYC and fraud assessment...</p>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <span className="text-4xl block mb-2">📁</span>
              <p className="text-gray-600 text-sm">Drop bank statement PDF here</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // --- DEFAULT (APAC + Africa Enhanced): OTP flow ---
  if (verified) {
    return (
      <div className="text-center py-8">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-4xl">✅</span>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Verification Complete</h3>
        <p className="text-gray-600">Data access consent verified successfully. Proceeding to KYC and fraud assessment...</p>
      </div>
    );
  }

  const stepDescription = isAfricaEnhanced
    ? "The borrower provides OTP consent for credit bureau data and M-Pesa transaction history, in addition to the alternate data foundation (farmer profile, farm/crop, climate, socioeconomic)."
    : isSriLankaScenario
    ? "The borrower provides OTP consent for CRIB bureau data. Bank statement evidence is collected separately via PDF upload."
    : "The borrower provides consent to pull their bank statement data and credit bureau data through OTP received at their registered phone number. This ensures data privacy and compliance with regulations.";

  const subHeading = isAfricaEnhanced
    ? 'Verify consent to access credit bureau and M-Pesa transaction data'
    : isSriLankaScenario
    ? 'Verify consent to pull CRIB bureau data and upload bank statement'
    : 'Verify consent to pull credit bureau and bank statement data';

  return (
    <div>
      <StepNarration
        step={2}
        title="Borrower Consent"
        description={stepDescription}
        icon="🔐"
        color="green"
      />
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Data Access Consent</h2>
        <p className="text-sm text-gray-600 mt-1">{subHeading}</p>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-sm">
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">📱</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">OTP Verification Required</h3>
          <p className="text-gray-600 mb-4">
            We've sent an OTP to <strong>{application.applicant_phone}</strong> for data access consent.
          </p>
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg text-sm text-left max-w-md mx-auto">
            <p className="font-semibold text-blue-900 mb-2">This OTP authorizes access to:</p>
            <ul className="space-y-1 text-blue-800">
              {isAfricaEnhanced ? (
                <>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span><strong>Credit Bureau Data:</strong> Loan history and repayment records from Kenya credit reference bureaus</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span><strong>M-Pesa Transaction Data:</strong> Mobile money transaction history and cash-flow patterns</span>
                  </li>
                </>
              ) : (
                <>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span>
                      <strong>Credit Bureau Data:</strong>{' '}
                      {isSriLankaScenario ? 'CRIB credit history, active loans, and payment records' : 'Credit history, active loans, payment records'}
                    </span>
                  </li>
                  {!isSriLankaScenario && (
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600">•</span>
                      <span>
                        <strong>Bank Statement Data:</strong> Account transactions, cash flow analysis via Account Aggregator
                      </span>
                    </li>
                  )}
                </>
              )}
            </ul>
            {isSriLankaScenario && (
              <p className="mt-3 text-xs text-blue-700">
                Bank statement evidence will be collected via PDF upload after OTP verification.
              </p>
            )}
            {isAfricaEnhanced && (
              <p className="mt-3 text-xs text-blue-700">
                Alternate data (climate, soil, crop, socioeconomic) is always included as the foundation layer.
              </p>
            )}
          </div>
        </div>

        <div className="max-w-md mx-auto">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Enter 6-digit OTP
          </label>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
            className="w-full px-3 py-3 text-2xl text-center tracking-widest border-2 border-gray-600 rounded-md focus:ring-2 focus:ring-[#11287c] focus:border-[#11287c]"
            placeholder="000000"
            maxLength={6}
          />
          <p className="text-xs text-gray-500 mt-2">OTP sent to registered mobile number</p>
        </div>

        <div className="flex justify-center mt-6">
          <Button
            onClick={verifyOTP}
            disabled={otp.length !== 6 || processing}
            className="bg-[#11287c] hover:bg-[#1e3a8a] text-white px-8 py-3"
          >
            {processing ? 'Verifying...' : 'Verify & Continue'}
          </Button>
        </div>
      </div>
    </div>
  );
};
