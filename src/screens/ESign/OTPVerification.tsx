import React, { useState, useEffect } from "react";
import kiLogo from "../../assets/ki-logo.svg";
import { type LoanApplication } from "../../lib/supabase";
import { Button } from "../../components/ui/button";

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
  const [currentOTPStep, setCurrentOTPStep] = useState<'bureau' | 'bank' | 'complete'>('bureau');
  const [bureauOTP, setBureauOTP] = useState('');
  const [bankOTP, setBankOTP] = useState('');
  const [processing, setProcessing] = useState(false);

  // Auto-start with bureau OTP
  useEffect(() => {
    if (currentOTPStep === 'bureau' && !application.bureau_otp_verified) {
      // Simulate sending OTP
      console.log('Sending bureau OTP to:', application.applicant_phone);
    }
  }, [currentOTPStep, application.bureau_otp_verified, application.applicant_phone]);

  // Complete state - should auto-advance
  useEffect(() => {
    if (currentOTPStep === 'complete') {
      const timer = setTimeout(() => {
        // Ensure both OTP verifications are complete before advancing
        if (application.bureau_otp_verified && application.bank_otp_verified) {
          onNext();
        } else {
          console.warn('OTP verifications not complete, not advancing');
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [currentOTPStep, onNext, application.bureau_otp_verified, application.bank_otp_verified]);

  const verifyBureauOTP = async () => {
    if (bureauOTP.length !== 6) return;

    setProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

    await onUpdate({
      bureau_otp_verified: true,
      bureau_otp_verified_at: new Date().toISOString(),
    });

    setCurrentOTPStep('bank');
    setProcessing(false);
  };

  const verifyBankOTP = async () => {
    if (bankOTP.length !== 6) return;

    setProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

    await onUpdate({
      bank_otp_verified: true,
      bank_otp_verified_at: new Date().toISOString(),
    });

    setCurrentOTPStep('complete');
    setProcessing(false);
  };

  if (currentOTPStep === 'bureau') {
    return (
      <div>
        <div className="mb-6">
          <div className="flex items-center gap-2">
            <img src={kiLogo} alt="Ki Score" className="h-5 w-auto" />
            <h2 className="text-2xl font-bold text-gray-900">Bureau Data Verification</h2>
          </div>
          <p className="text-sm text-gray-600 mt-1">Enter OTP sent to applicant's mobile number</p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-sm">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">📱</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">OTP Verification Required</h3>
            <p className="text-gray-600">
              We've sent an OTP to <strong>{application.applicant_phone}</strong> for credit bureau data access consent.
            </p>
          </div>

          <div className="max-w-md mx-auto">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter 6-digit OTP
            </label>
            <input
              type="text"
              value={bureauOTP}
              onChange={(e) => setBureauOTP(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="w-full px-3 py-3 text-2xl text-center tracking-widest border-2 border-gray-600 rounded-md focus:ring-2 focus:ring-[#11287c] focus:border-[#11287c]"
              placeholder="000000"
              maxLength={6}
            />
            <p className="text-xs text-gray-500 mt-2">OTP sent to registered mobile number</p>
          </div>

          <div className="flex justify-center mt-6">
            <Button
              onClick={verifyBureauOTP}
              disabled={bureauOTP.length !== 6 || processing}
              className="bg-[#11287c] hover:bg-[#1e3a8a] text-white px-8 py-3"
            >
              {processing ? 'Verifying...' : 'Verify & Continue'}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (currentOTPStep === 'bank') {
    return (
      <div>
        <div className="mb-6">
          <div className="flex items-center gap-2">
            <img src={kiLogo} alt="Ki Score" className="h-5 w-auto" />
            <h2 className="text-2xl font-bold text-gray-900">Bank Statement Verification</h2>
          </div>
          <p className="text-sm text-gray-600 mt-1">Enter OTP sent to applicant's mobile number</p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-sm">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">🏦</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Account Aggregator Consent</h3>
            <p className="text-gray-600">
              We've sent an OTP to <strong>{application.applicant_phone}</strong> for bank statement access consent.
            </p>
          </div>

          <div className="max-w-md mx-auto">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter 6-digit OTP
            </label>
            <input
              type="text"
              value={bankOTP}
              onChange={(e) => setBankOTP(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="w-full px-3 py-3 text-2xl text-center tracking-widest border-2 border-gray-600 rounded-md focus:ring-2 focus:ring-[#11287c] focus:border-[#11287c]"
              placeholder="000000"
              maxLength={6}
            />
            <p className="text-xs text-gray-500 mt-2">OTP sent to registered mobile number</p>
          </div>

          <div className="flex justify-center mt-6">
            <Button
              onClick={verifyBankOTP}
              disabled={bankOTP.length !== 6 || processing}
              className="bg-[#11287c] hover:bg-[#1e3a8a] text-white px-8 py-3"
            >
              {processing ? 'Verifying...' : 'Verify & Continue to KYC'}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center py-8">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <span className="text-4xl">✅</span>
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">Verification Complete</h3>
      <p className="text-gray-600">All OTP verifications completed successfully. Proceeding to KYC...</p>
    </div>
  );
};
