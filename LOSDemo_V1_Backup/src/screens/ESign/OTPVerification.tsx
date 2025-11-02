import React, { useState, useEffect } from "react";
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
  const [otp, setOtp] = useState('');
  const [processing, setProcessing] = useState(false);
  const [verified, setVerified] = useState(false);

  // Auto-verify after a delay (simulated)
  useEffect(() => {
    if (!application.bureau_otp_verified && !application.bank_otp_verified) {
      // Auto-fill OTP after 1 second
      const timer = setTimeout(() => {
        setOtp('123456');
        // Auto-verify after another second
        setTimeout(() => {
          verifyOTP();
        }, 1000);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

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

    // Auto-advance after showing success
    setTimeout(() => {
      onNext();
    }, 1500);
  };

  if (verified) {
    return (
      <div className="text-center py-8">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-4xl">✅</span>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Verification Complete</h3>
        <p className="text-gray-600">Data access consent verified successfully. Proceeding to document upload...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Data Access Consent</h2>
        <p className="text-sm text-gray-600 mt-1">Verify consent to pull credit bureau and bank statement data</p>
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
              <li className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                <span><strong>Credit Bureau Data:</strong> Credit history, active loans, payment records</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                <span><strong>Bank Statement Data:</strong> Account transactions, cash flow analysis via Account Aggregator</span>
              </li>
            </ul>
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
