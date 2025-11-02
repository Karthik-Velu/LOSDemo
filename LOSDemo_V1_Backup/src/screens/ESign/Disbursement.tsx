import React, { useState } from "react";
import { type LoanApplication } from "../../lib/supabase";
import { Button } from "../../components/ui/button";

interface DisbursementProps {
  application: LoanApplication;
  onUpdate: (updates: Partial<LoanApplication>) => Promise<any>;
  onBack: () => void;
  onRestart: () => void;
}

export const Disbursement: React.FC<DisbursementProps> = ({
  application,
  onUpdate,
  onBack,
  onRestart,
}) => {
  const [selectedAccountId, setSelectedAccountId] = useState<string>('');
  const [processing, setProcessing] = useState(false);

  const availableAccounts = application.available_bank_accounts || [];
  const selectedAccount = availableAccounts.find(acc => acc.id === selectedAccountId);

  // Reset penny drop and agreement status when first entering this page
  React.useEffect(() => {
    if (application.penny_drop_status === 'verified' && !selectedAccountId) {
      // Clear pre-completed statuses for fresh demo
      onUpdate({
        penny_drop_status: undefined,
        penny_drop_verified_at: undefined,
        loan_agreement_signed: false,
        loan_agreement_signed_at: undefined,
      });
    }
  }, []);

  const handleAccountSelection = (accountId: string) => {
    setSelectedAccountId(accountId);
  };

  const runPennyDrop = async () => {
    if (!selectedAccount) return;

    setProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));

    await onUpdate({
      account_number: selectedAccount.account_number,
      ifsc_code: selectedAccount.ifsc_code,
      bank_name: selectedAccount.bank_name,
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
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Disbursement</h2>
        <p className="text-base text-gray-600">Final verification and loan disbursement</p>
      </div>

      <div className="space-y-6">
        <div className="bg-gradient-to-br from-[#11287c] to-[#1e3a8a] p-8 rounded-xl shadow-lg text-white">
          <h3 className="text-xl font-semibold mb-6 opacity-90">Loan Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
              <p className="text-sm text-white/70 mb-1">Loan Amount</p>
              <p className="text-3xl font-bold">
                ₹{application.recommended_amount?.toLocaleString('en-IN')}
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
              <p className="text-sm text-white/70 mb-1">Term</p>
              <p className="text-3xl font-bold">{application.recommended_term} months</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
              <p className="text-sm text-white/70 mb-1">APR</p>
              <p className="text-3xl font-bold">{application.recommended_apr}%</p>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-white/20">
            <div className="flex justify-between items-center">
              <span className="text-white/80">Applicant</span>
              <span className="font-semibold text-lg">{application.applicant_name}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Bank Account Selection</h3>
            {availableAccounts.length > 0 && (
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                {availableAccounts.length} accounts available
              </span>
            )}
          </div>

          {availableAccounts.length > 0 ? (
            <>
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Account Number</p>
                      <p className="font-medium text-gray-900">{selectedAccount?.account_number}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">IFSC Code</p>
                      <p className="font-medium text-gray-900">{selectedAccount?.ifsc_code}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-gray-600">Bank Name</p>
                      <p className="font-medium text-gray-900">{selectedAccount?.bank_name}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Select Bank Account for Disbursement *
                    </label>
                    <div className="space-y-2">
                      {availableAccounts.map((account) => (
                        <div
                          key={account.id}
                          onClick={() => handleAccountSelection(account.id)}
                          className={`p-4 border rounded-lg cursor-pointer transition-all ${
                            selectedAccountId === account.id
                              ? 'border-[#11287c] bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-gray-900">{account.bank_name}</span>
                                <span className={`px-2 py-1 text-xs rounded ${
                                  account.account_type === 'Savings' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                                }`}>
                                  {account.account_type}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 mt-1">{account.account_number}</p>
                              <p className="text-xs text-gray-500">IFSC: {account.ifsc_code}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium text-gray-900">₹{account.balance.toLocaleString('en-IN')}</p>
                              <p className="text-xs text-gray-500">Available Balance</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Button
                    onClick={runPennyDrop}
                    disabled={processing || !selectedAccountId}
                    className="bg-[#11287c] hover:bg-[#1e3a8a] text-white w-full"
                  >
                    {processing ? 'Verifying...' : 'Penny Drop for Bank Account Verification'}
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">🏦</span>
              </div>
              <p className="text-gray-600 mb-4">No bank accounts available</p>
              <p className="text-sm text-gray-500">Complete credit check first to fetch bank accounts</p>
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
          <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 p-10 rounded-2xl shadow-2xl border-2 border-green-400">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-white text-5xl">✓</span>
              </div>
              <h3 className="text-3xl font-bold text-green-900 mb-3">Loan Disbursed Successfully!</h3>
              <p className="text-lg text-green-800 mb-6">
                ₹{application.disbursed_amount?.toLocaleString('en-IN')} has been credited to the beneficiary account
              </p>
              <div className="bg-white p-6 rounded-xl inline-block shadow-md border border-green-200 mb-6">
                <p className="text-sm text-gray-600 mb-1">Transaction Reference</p>
                <p className="text-xl font-mono font-bold text-gray-900">{application.disbursement_reference}</p>
                <p className="text-sm text-gray-500 mt-3">
                  Disbursed on {new Date(application.disbursed_at!).toLocaleString('en-IN')}
                </p>
              </div>
              <div className="mt-8">
                <Button
                  onClick={onRestart}
                  className="bg-[#11287c] hover:bg-[#1e3a8a] text-white px-10 py-4 text-lg font-semibold shadow-lg"
                >
                  ← Start New Application
                </Button>
              </div>
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
              className="bg-[#11287c] hover:bg-[#1e3a8a] text-white w-full py-3 text-lg font-semibold"
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
        <Button onClick={onBack} variant="outline" disabled={isDisbursed} className="w-full sm:w-auto">
          Back
        </Button>
      </div>
    </div>
  );
};
