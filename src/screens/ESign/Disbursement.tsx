import React, { useState } from "react";
import { type LoanApplication } from "../../lib/supabase";
import { Button } from "../../components/ui/button";

interface DisbursementProps {
  application: LoanApplication;
  onUpdate: (updates: Partial<LoanApplication>) => Promise<any>;
  onBack: () => void;
}

export const Disbursement: React.FC<DisbursementProps> = ({
  application,
  onUpdate,
  onBack,
}) => {
  const [bankDetails, setBankDetails] = useState({
    account_number: application.account_number || '',
    ifsc_code: application.ifsc_code || '',
    bank_name: application.bank_name || '',
  });
  const [processing, setProcessing] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBankDetails({ ...bankDetails, [e.target.name]: e.target.value });
  };

  const handlePrefill = () => {
    setBankDetails({
      account_number: '1234567890123456',
      ifsc_code: 'SBIN0001234',
      bank_name: 'State Bank of India',
    });
  };

  const runPennyDrop = async () => {
    setProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));

    await onUpdate({
      ...bankDetails,
      penny_drop_status: 'verified',
      penny_drop_verified_at: new Date().toISOString(),
    });

    setProcessing(false);
  };

  const signAgreement = async () => {
    setProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

    await onUpdate({
      loan_agreement_signed: true,
      loan_agreement_signed_at: new Date().toISOString(),
    });

    setProcessing(false);
  };

  const disburse = async () => {
    setProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));

    const reference = `TXN${Date.now()}`;

    await onUpdate({
      disbursed_amount: application.recommended_amount,
      disbursed_at: new Date().toISOString(),
      disbursement_reference: reference,
      status: 'disbursed',
    });

    setProcessing(false);
  };

  const isAccountVerified = application.penny_drop_status === 'verified';
  const isAgreementSigned = application.loan_agreement_signed;
  const isDisbursed = application.status === 'disbursed';

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Disbursement</h2>
        <p className="text-sm text-gray-600 mt-1">Final verification and loan disbursement</p>
      </div>

      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Loan Summary</h3>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Loan Amount</p>
              <p className="text-2xl font-bold text-[#11287c]">
                ₹{application.recommended_amount?.toLocaleString('en-IN')}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Term</p>
              <p className="text-2xl font-bold text-gray-900">{application.recommended_term} months</p>
            </div>
            <div>
              <p className="text-gray-600">APR</p>
              <p className="text-2xl font-bold text-gray-900">{application.recommended_apr}%</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Applicant</span>
              <span className="font-medium text-gray-900">{application.applicant_name}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Bank Account Details</h3>
            {!isAccountVerified && (
              <Button
                type="button"
                variant="outline"
                onClick={handlePrefill}
                className="text-sm"
              >
                Prefill Demo
              </Button>
            )}
          </div>

          {isAccountVerified ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white text-xl">
                  ✓
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">Account Verified</p>
                  <p className="text-sm text-gray-600">Penny drop test completed successfully</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Account Number</p>
                  <p className="font-medium text-gray-900">{application.account_number}</p>
                </div>
                <div>
                  <p className="text-gray-600">IFSC Code</p>
                  <p className="font-medium text-gray-900">{application.ifsc_code}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-gray-600">Bank Name</p>
                  <p className="font-medium text-gray-900">{application.bank_name}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Account Number *
                </label>
                <input
                  type="text"
                  name="account_number"
                  value={bankDetails.account_number}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#11287c] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  IFSC Code *
                </label>
                <input
                  type="text"
                  name="ifsc_code"
                  value={bankDetails.ifsc_code}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#11287c] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bank Name *
                </label>
                <input
                  type="text"
                  name="bank_name"
                  value={bankDetails.bank_name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#11287c] focus:border-transparent"
                />
              </div>
              <Button
                onClick={runPennyDrop}
                disabled={processing || !bankDetails.account_number || !bankDetails.ifsc_code || !bankDetails.bank_name}
                className="bg-[#11287c] hover:bg-[#1e3a8a] text-white w-full"
              >
                {processing ? 'Verifying...' : 'Run Penny Drop Test'}
              </Button>
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Loan Agreement</h3>
            {isAgreementSigned && (
              <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded">
                Signed
              </span>
            )}
          </div>

          {isAgreementSigned ? (
            <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white text-xl">
                ✓
              </div>
              <div>
                <p className="font-semibold text-gray-900">Agreement Signed</p>
                <p className="text-sm text-gray-600">
                  Signed on {new Date(application.loan_agreement_signed_at!).toLocaleString('en-IN')}
                </p>
              </div>
            </div>
          ) : (
            <div>
              <div className="p-4 bg-gray-50 border border-gray-200 rounded mb-4">
                <p className="text-sm text-gray-700 mb-2">
                  By signing this agreement, the borrower agrees to:
                </p>
                <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">
                  <li>Repay the loan amount of ₹{application.recommended_amount?.toLocaleString('en-IN')} over {application.recommended_term} months</li>
                  <li>Pay interest at {application.recommended_apr}% APR</li>
                  <li>Comply with all terms and conditions</li>
                  <li>Provide accurate information</li>
                </ul>
              </div>
              <Button
                onClick={signAgreement}
                disabled={processing || !isAccountVerified}
                className="bg-[#11287c] hover:bg-[#1e3a8a] text-white w-full"
              >
                {processing ? 'Signing...' : 'Sign Loan Agreement'}
              </Button>
              {!isAccountVerified && (
                <p className="text-xs text-yellow-600 mt-2">Please verify account first</p>
              )}
            </div>
          )}
        </div>

        {isDisbursed ? (
          <div className="bg-gradient-to-r from-green-50 to-green-100 p-8 rounded-lg shadow-lg border-2 border-green-300">
            <div className="text-center">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-4xl">✓</span>
              </div>
              <h3 className="text-2xl font-bold text-green-900 mb-2">Loan Disbursed Successfully!</h3>
              <p className="text-green-800 mb-4">
                ₹{application.disbursed_amount?.toLocaleString('en-IN')} has been credited to the beneficiary account
              </p>
              <div className="bg-white p-4 rounded-lg inline-block">
                <p className="text-sm text-gray-600">Transaction Reference</p>
                <p className="text-lg font-mono font-bold text-gray-900">{application.disbursement_reference}</p>
              </div>
              <p className="text-sm text-gray-600 mt-4">
                Disbursed on {new Date(application.disbursed_at!).toLocaleString('en-IN')}
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Final Disbursement</h3>
            <p className="text-sm text-gray-600 mb-4">
              All verifications complete. Click below to disburse the loan amount to the beneficiary account.
            </p>
            <Button
              onClick={disburse}
              disabled={processing || !isAccountVerified || !isAgreementSigned}
              className="bg-green-600 hover:bg-green-700 text-white w-full py-3 text-lg font-semibold"
            >
              {processing ? 'Processing Disbursement...' : `Disburse ₹${application.recommended_amount?.toLocaleString('en-IN')}`}
            </Button>
            {(!isAccountVerified || !isAgreementSigned) && (
              <p className="text-xs text-yellow-600 mt-2">
                Please complete account verification and sign agreement first
              </p>
            )}
          </div>
        )}
      </div>

      <div className="flex justify-start mt-6">
        <Button onClick={onBack} variant="outline" disabled={isDisbursed}>
          Back
        </Button>
      </div>
    </div>
  );
};
