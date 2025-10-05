import React, { useState } from "react";
import { type LoanApplication } from "../../lib/supabase";
import { Button } from "../../components/ui/button";

interface KYCVerificationProps {
  application: LoanApplication;
  onUpdate: (updates: Partial<LoanApplication>) => Promise<any>;
  onNext: () => void;
  onBack: () => void;
}

export const KYCVerification: React.FC<KYCVerificationProps> = ({
  application,
  onUpdate,
  onNext,
  onBack,
}) => {
  const [fraudScore, setFraudScore] = useState<number>(application.fraud_score || 0);
  const [kycNotes, setKycNotes] = useState(application.kyc_notes || '');
  const [processing, setProcessing] = useState(false);

  const simulateKYCCheck = async () => {
    setProcessing(true);

    await new Promise(resolve => setTimeout(resolve, 2000));

    const simulatedScore = Math.floor(Math.random() * 40) + 10;
    setFraudScore(simulatedScore);

    let riskLevel: 'low' | 'medium' | 'high' = 'low';
    if (simulatedScore > 30) riskLevel = 'medium';
    if (simulatedScore > 50) riskLevel = 'high';

    await onUpdate({
      kyc_status: 'verified',
      kyc_verified_at: new Date().toISOString(),
      fraud_score: simulatedScore,
      fraud_risk_level: riskLevel,
      kyc_notes,
    });

    setProcessing(false);
  };

  const handleContinue = () => {
    if (application.kyc_status === 'verified') {
      onNext();
    }
  };

  const getRiskColor = (score: number) => {
    if (score <= 30) return 'text-green-600';
    if (score <= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getRiskBadge = (level?: string) => {
    const colors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-red-100 text-red-800',
    };
    return colors[level as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">KYC Verification</h2>
        <p className="text-sm text-gray-600 mt-1">Verify identity and assess fraud risk</p>
      </div>

      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Applicant Information</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Name</p>
              <p className="font-medium text-gray-900">{application.applicant_name}</p>
            </div>
            <div>
              <p className="text-gray-600">Phone</p>
              <p className="font-medium text-gray-900">{application.applicant_phone}</p>
            </div>
            <div>
              <p className="text-gray-600">PAN</p>
              <p className="font-medium text-gray-900">{application.applicant_pan || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-gray-600">Aadhaar</p>
              <p className="font-medium text-gray-900">{application.applicant_aadhaar || 'Not provided'}</p>
            </div>
          </div>
        </div>

        {application.coapplicant_name && (
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Co-Applicant Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Name</p>
                <p className="font-medium text-gray-900">{application.coapplicant_name}</p>
              </div>
              <div>
                <p className="text-gray-600">Phone</p>
                <p className="font-medium text-gray-900">{application.coapplicant_phone}</p>
              </div>
              <div>
                <p className="text-gray-600">PAN</p>
                <p className="font-medium text-gray-900">{application.coapplicant_pan || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-gray-600">Aadhaar</p>
                <p className="font-medium text-gray-900">{application.coapplicant_aadhaar || 'Not provided'}</p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">KYC Documents</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded flex items-center justify-center">
                  <span className="text-blue-600 text-xl">📄</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Aadhaar Card</p>
                  <p className="text-xs text-gray-500">Identity Proof</p>
                </div>
              </div>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Verified</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded flex items-center justify-center">
                  <span className="text-blue-600 text-xl">📄</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">PAN Card</p>
                  <p className="text-xs text-gray-500">Tax ID Proof</p>
                </div>
              </div>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Verified</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Fraud Risk Assessment</h3>

          {application.kyc_status === 'verified' ? (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-600">Fraud Score</p>
                  <p className={`text-4xl font-bold ${getRiskColor(fraudScore)}`}>
                    {fraudScore}
                  </p>
                  <p className="text-xs text-gray-500">(0-100, lower is better)</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">Risk Level</p>
                  <span className={`px-4 py-2 rounded-full text-sm font-medium ${getRiskBadge(application.fraud_risk_level)}`}>
                    {application.fraud_risk_level?.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="mt-4 p-4 bg-blue-50 rounded border border-blue-200">
                <p className="text-sm text-blue-900">
                  <strong>Assessment Complete:</strong> KYC verification completed successfully.
                  {fraudScore <= 30 && ' Low fraud risk detected. Safe to proceed.'}
                  {fraudScore > 30 && fraudScore <= 50 && ' Medium fraud risk. Additional verification recommended.'}
                  {fraudScore > 50 && ' High fraud risk detected. Manual review required.'}
                </p>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Verification Notes
                </label>
                <textarea
                  value={kycNotes}
                  onChange={(e) => setKycNotes(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#11287c] focus:border-transparent"
                  placeholder="Add any additional notes about the verification..."
                />
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">🔍</span>
              </div>
              <p className="text-gray-600 mb-4">Click the button below to run KYC verification and fraud check</p>
              <Button
                onClick={simulateKYCCheck}
                disabled={processing}
                className="bg-[#11287c] hover:bg-[#1e3a8a] text-white"
              >
                {processing ? 'Processing...' : 'Run KYC Verification'}
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between mt-6">
        <Button
          onClick={onBack}
          variant="outline"
          className="px-6"
        >
          Back
        </Button>
        <Button
          onClick={handleContinue}
          disabled={application.kyc_status !== 'verified'}
          className="bg-[#11287c] hover:bg-[#1e3a8a] text-white px-6"
        >
          Continue to Credit Check
        </Button>
      </div>
    </div>
  );
};
