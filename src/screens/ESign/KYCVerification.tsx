import React, { useState, useEffect } from "react";
import kiLogo from "../../assets/ki-logo.svg";
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
  const [hasRunKYC, setHasRunKYC] = useState(!!application.kyc_status);
  const [uploading, setUploading] = useState(false);
  const [panUploaded, setPanUploaded] = useState(!!application.pan_uploaded);
  const [aadhaarUploaded, setAadhaarUploaded] = useState(!!application.aadhaar_uploaded);

  // Check if application is already rejected for fraud
  const isFraudRejected = application.status === 'rejected' && application.rejection_reason?.includes('fraud');

  // Check if application is already rejected for poor bank statements
  const isBankRejected = application.status === 'rejected' && application.rejection_reason?.includes('bank statement');

  // Auto-upload documents first, then run KYC
  useEffect(() => {
    if (!panUploaded && !aadhaarUploaded && !uploading) {
      simulateDocumentUpload();
    } else if (panUploaded && aadhaarUploaded && !hasRunKYC && !processing) {
      simulateKYCCheck();
    }
  }, [panUploaded, aadhaarUploaded]);

  const simulateDocumentUpload = async () => {
    setUploading(true);
    try {
      // Simulate PAN upload
      await new Promise(resolve => setTimeout(resolve, 1000));
      setPanUploaded(true);

      // Simulate Aadhaar upload
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAadhaarUploaded(true);

      // Update application
      await onUpdate({
        pan_uploaded: true,
        aadhaar_uploaded: true,
        documents_uploaded_at: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error during document upload simulation:', error);
    } finally {
      setUploading(false);
    }
  };

  // Update local state when application changes
  useEffect(() => {
    setFraudScore(application.fraud_score || 0);
    setKycNotes(application.kyc_notes || '');
  }, [application.fraud_score, application.kyc_notes]);

  const simulateKYCCheck = async () => {
    setProcessing(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Check scenario for fraud rejection - ONLY reject fraud_rejection scenario
      const scenario = (application as any).demo_scenario_id as string | undefined;
      console.log('KYC Check - Scenario:', scenario);
      let simulatedScore: number;
      let shouldReject = false;
      let rejectionReason = '';

      if (scenario === 'fraud_rejection') {
        // ONLY this scenario gets rejected at KYC
        console.log('Fraud rejection scenario - will reject');
        simulatedScore = 85; // Very high fraud score
        shouldReject = true;
        rejectionReason = JSON.stringify({
          title: 'High Fraud Risk Detected',
          reasons: [
            'Multiple identity mismatches detected across verification sources',
            'Suspicious SIM tenure - only 2 months old',
            'Email created recently - only 1 month ago',
            '15 anomalous bank transactions identified in last 3 months',
            'Address verification failed across multiple data sources',
            'Overall identity match score: 43% (threshold: 85%)'
          ]
        });
      } else {
        // All other scenarios pass KYC with low fraud scores
        console.log('Normal scenario - will pass KYC');
        simulatedScore = Math.floor(Math.random() * 30) + 10; // 10-40 range (low to medium)
      }

      let riskLevel: 'low' | 'medium' | 'high' = 'low';
      if (simulatedScore > 30) riskLevel = 'medium';
      if (simulatedScore > 50) riskLevel = 'high';

      // Update local state first for immediate UI feedback
      setFraudScore(simulatedScore);

      // Then update the application - ONLY set rejected status for fraud_rejection
      await onUpdate({
        kyc_status: 'verified',
        kyc_verified_at: new Date().toISOString(),
        fraud_score: simulatedScore,
        fraud_risk_level: riskLevel,
        kyc_notes: kycNotes,
        ...(shouldReject && {
          status: 'rejected',
          rejection_reason: rejectionReason,
        }),
      });
      setHasRunKYC(true);
    } catch (error) {
      // Reset the fraud score if there was an error
      setFraudScore(0);
    } finally {
      setProcessing(false);
    }
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
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">KYC Verification</h2>
        <p className="text-base text-gray-600">Verify identity and assess fraud risk</p>
      </div>

      <div className="space-y-6">
        {/* Document Upload Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm border-2 border-blue-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span className="text-xl">📄</span>
            Document Verification
          </h3>
          
          {uploading ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">
                    {!panUploaded ? 'Uploading PAN Card...' : 'Uploading Aadhaar Card...'}
                  </p>
                  <p className="text-sm text-gray-600">Please wait while we verify your documents</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={`p-4 rounded-lg border-2 ${panUploaded ? 'bg-green-50 border-green-300' : 'bg-gray-50 border-gray-300'}`}>
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${panUploaded ? 'bg-green-500' : 'bg-gray-300'}`}>
                    {panUploaded ? (
                      <span className="text-white text-xl font-bold">✓</span>
                    ) : (
                      <span className="text-gray-600 text-xl">📄</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">PAN Card</h4>
                    <p className="text-xs text-gray-600">Tax Identification Document</p>
                  </div>
                </div>
                {panUploaded && (
                  <div className="mt-2 text-sm">
                    <p className="text-gray-700"><strong>Number:</strong> {application.applicant_pan}</p>
                    <p className="text-gray-700"><strong>Name:</strong> {application.applicant_name}</p>
                    <p className="text-green-600 font-medium text-xs mt-1">✓ Verified</p>
                  </div>
                )}
              </div>

              <div className={`p-4 rounded-lg border-2 ${aadhaarUploaded ? 'bg-green-50 border-green-300' : 'bg-gray-50 border-gray-300'}`}>
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${aadhaarUploaded ? 'bg-green-500' : 'bg-gray-300'}`}>
                    {aadhaarUploaded ? (
                      <span className="text-white text-xl font-bold">✓</span>
                    ) : (
                      <span className="text-gray-600 text-xl">📄</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">Aadhaar Card</h4>
                    <p className="text-xs text-gray-600">Unique ID Document</p>
                  </div>
                </div>
                {aadhaarUploaded && (
                  <div className="mt-2 text-sm">
                    <p className="text-gray-700"><strong>Number:</strong> {application.applicant_aadhaar}</p>
                    <p className="text-gray-700"><strong>Name:</strong> {application.applicant_name}</p>
                    <p className="text-green-600 font-medium text-xs mt-1">✓ Verified</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Fraud Risk Assessment Section - Moved to Top */}
        <div className="bg-white p-6 rounded-lg shadow-sm border-2 border-orange-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span className="text-xl">🛡️</span>
            Fraud Risk Assessment
          </h3>

          {processing ? (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <span className="text-4xl">🔍</span>
              </div>
              <p className="text-gray-600 mb-2 font-medium">Running KYC Verification...</p>
              <p className="text-sm text-gray-500">Checking identity documents and fraud risk</p>
            </div>
          ) : application.kyc_status === 'verified' ? (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <img src={kiLogo} alt="Ki Score" className="h-6 w-auto" />
                    <p className="text-sm text-gray-600">Fraud Ki Score</p>
                  </div>
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

              {/* Show rejection banner if fraud rejected */}
              {isFraudRejected && (
                <div className="mt-4 p-6 bg-red-50 border-2 border-red-300 rounded-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white text-xl flex-shrink-0">
                      ⚠️
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-red-900">Application Rejected</h3>
                      <p className="text-sm text-red-700">High fraud risk detected</p>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-lg border border-red-200 mb-4">
                    {(() => {
                      try {
                        const parsed = JSON.parse(application.rejection_reason || '{}');
                        return (
                          <>
                            <h4 className="font-bold text-red-900 mb-3 text-base">{parsed.title || 'Rejection Reasons'}</h4>
                            <ul className="space-y-2">
                              {(parsed.reasons || [application.rejection_reason]).map((reason: string, idx: number) => (
                                <li key={idx} className="flex items-start gap-3">
                                  <span className="flex-shrink-0 w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mt-0.5">
                                    <span className="text-red-600 text-xs font-bold">✕</span>
                                  </span>
                                  <span className="text-sm text-red-800 leading-relaxed">{reason}</span>
                                </li>
                              ))}
                            </ul>
                          </>
                        );
                      } catch {
                        return (
                          <>
                            <h4 className="font-semibold text-red-900 mb-2">Rejection Reason</h4>
                            <p className="text-sm text-red-800">{application.rejection_reason}</p>
                          </>
                        );
                      }
                    })()}
                  </div>

                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-4">This application has been rejected and cannot proceed further.</p>
                    <Button
                      onClick={() => {
                        localStorage.removeItem('mock_loan_applications');
                        window.location.reload();
                      }}
                      className="px-8 py-3 text-base"
                    >
                      🏠 Start New Application
                    </Button>
                  </div>
                </div>
              )}

              {/* Show success message if not rejected */}
              {!isFraudRejected && (
                <div className="mt-4 p-4 bg-blue-50 rounded border border-blue-200">
                  <p className="text-sm text-blue-900">
                    <strong>Assessment Complete:</strong> KYC verification completed successfully.
                    {fraudScore <= 30 && ' Low fraud risk detected. Safe to proceed.'}
                    {fraudScore > 30 && fraudScore <= 50 && ' Medium fraud risk. Additional verification recommended.'}
                    {fraudScore > 50 && ' High fraud risk detected. Manual review required.'}
                  </p>
                </div>
              )}

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
          ) : null}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Applicant Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
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

        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <div className="flex items-center gap-2 mb-6">
            <img src={kiLogo} alt="Ki Score" className="h-6 w-auto" />
            <h3 className="text-xl font-semibold text-gray-900">KYC Check</h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6 mb-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-green-600 text-xl">✓</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Aadhaar Card</p>
                    <p className="text-xs text-gray-600">Identity Proof</p>
                  </div>
                </div>
                <span className="text-xs bg-green-600 text-white px-2 py-1 rounded font-medium">Verified</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-green-600 text-xl">✓</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">PAN Card</p>
                    <p className="text-xs text-gray-600">Tax ID Proof</p>
                  </div>
                </div>
                <span className="text-xs bg-green-600 text-white px-2 py-1 rounded font-medium">Verified</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-xl border border-blue-200">
              <h4 className="font-bold text-blue-900 mb-4 text-base">Identity Verification Details</h4>
              <div className="space-y-2.5">
                {/* For fraud_rejection scenario, show mismatches. For all others, show perfect matches */}
                <div className="p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-900 text-sm">Aadhaar Card</span>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                      isFraudRejected ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {isFraudRejected ? '45% Match' : '100% Match'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-gray-500">Name:</span>
                      <span className="ml-1 font-semibold text-gray-900">
                        {isFraudRejected ? 'Rajendra K Verma' : application.applicant_name}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Address:</span>
                      <span className="ml-1 font-semibold text-gray-900">
                        {isFraudRejected ? 'Village Sultanpur, Lucknow' : application.applicant_address}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-900 text-sm">PAN Card</span>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                      isFraudRejected ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {isFraudRejected ? '52% Match' : '100% Match'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-gray-500">Name:</span>
                      <span className="ml-1 font-semibold text-gray-900">
                        {isFraudRejected ? 'R Kumar Sharma' : application.applicant_name}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">DOB:</span>
                      <span className="ml-1 font-semibold text-gray-900">15/05/1985</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-900 text-sm">Application Form</span>
                    <span className="text-xs bg-green-100 text-green-800 px-2.5 py-1 rounded-full font-semibold">100% Match</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-gray-500">Name:</span>
                      <span className="ml-1 font-semibold text-gray-900">{application.applicant_name}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Phone:</span>
                      <span className="ml-1 font-semibold text-gray-900">{application.applicant_phone}</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-900 text-sm">Mobile Records</span>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                      isFraudRejected ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {isFraudRejected ? '38% Match' : '100% Match'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-gray-500">Name:</span>
                      <span className="ml-1 font-semibold text-gray-900">
                        {isFraudRejected ? 'Raj Kumar' : application.applicant_name}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Location:</span>
                      <span className="ml-1 font-semibold text-gray-900">
                        {isFraudRejected ? 'Gorakhpur, UP' : application.applicant_address?.split(',').slice(-2).join(',').trim()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-900 text-sm">Credit Bureau</span>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                      isFraudRejected ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {isFraudRejected ? '41% Match' : '100% Match'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-gray-500">Name:</span>
                      <span className="ml-1 font-semibold text-gray-900">
                        {isFraudRejected ? 'R K Verma' : application.applicant_name}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Address:</span>
                      <span className="ml-1 font-semibold text-gray-900">
                        {isFraudRejected ? 'Village Barabanki, Sitapur' : application.applicant_address}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="bg-white border-2 border-green-200 p-3 rounded-lg text-center">
                  <div className={`text-2xl font-bold ${isFraudRejected ? 'text-red-600' : 'text-green-600'}`}>
                    {isFraudRejected ? '7' : '0'}
                  </div>
                  <div className="text-xs text-gray-700 font-medium">Address Changes</div>
                  <div className="text-xs text-gray-500 mt-0.5">(Last 3 years)</div>
                </div>
                <div className="bg-white border-2 border-blue-200 p-3 rounded-lg text-center">
                  <div className={`text-2xl font-bold ${isFraudRejected ? 'text-red-600' : 'text-green-600'}`}>
                    {isFraudRejected ? '43%' : '100%'}
                  </div>
                  <div className="text-xs text-gray-700 font-medium">Overall Match</div>
                  <div className={`text-xs mt-0.5 ${isFraudRejected ? 'text-red-600' : 'text-gray-500'}`}>
                    {isFraudRejected ? 'Low confidence' : 'High confidence'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-6">
            <div className={`bg-gradient-to-br p-4 rounded-xl text-center border ${
              isFraudRejected 
                ? 'from-red-50 to-orange-50 border-red-200' 
                : 'from-green-50 to-emerald-50 border-green-200'
            }`}>
              <div className={`text-3xl font-bold mb-1 ${isFraudRejected ? 'text-red-600' : 'text-green-600'}`}>
                {isFraudRejected ? '2 mo' : '6 yrs'}
              </div>
              <div className={`text-sm font-semibold ${isFraudRejected ? 'text-red-900' : 'text-green-900'}`}>SIM Tenure</div>
              <div className={`text-xs mt-1 ${isFraudRejected ? 'text-red-700' : 'text-green-700'}`}>
                {isFraudRejected ? 'Very Suspicious' : 'High Stability'}
              </div>
            </div>
            <div className={`bg-gradient-to-br p-4 rounded-xl text-center border ${
              isFraudRejected 
                ? 'from-red-50 to-orange-50 border-red-200' 
                : 'from-blue-50 to-cyan-50 border-blue-200'
            }`}>
              <div className={`text-3xl font-bold mb-1 ${isFraudRejected ? 'text-red-600' : 'text-blue-600'}`}>
                {isFraudRejected ? '1 mo' : '4 yrs'}
              </div>
              <div className={`text-sm font-semibold ${isFraudRejected ? 'text-red-900' : 'text-blue-900'}`}>Email Tenure</div>
              <div className={`text-xs mt-1 ${isFraudRejected ? 'text-red-700' : 'text-blue-700'}`}>
                {isFraudRejected ? 'Very Suspicious' : 'Good Stability'}
              </div>
            </div>
            <div className={`bg-gradient-to-br p-4 rounded-xl text-center border ${
              isFraudRejected 
                ? 'from-red-50 to-orange-50 border-red-200' 
                : 'from-orange-50 to-amber-50 border-orange-200'
            }`}>
              <div className={`text-3xl font-bold mb-1 ${isFraudRejected ? 'text-red-600' : 'text-orange-600'}`}>
                {isFraudRejected ? '15' : '0'}
              </div>
              <div className={`text-sm font-semibold ${isFraudRejected ? 'text-red-900' : 'text-orange-900'}`}>Anomalies</div>
              <div className={`text-xs mt-1 ${isFraudRejected ? 'text-red-700' : 'text-orange-700'}`}>
                {isFraudRejected ? 'High Risk' : 'Clean'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {!isFraudRejected && (
        <div className="flex flex-col sm:flex-row justify-between gap-3 mt-6">
          <Button
            onClick={onBack}
            variant="outline"
            className="px-6 w-full sm:w-auto"
          >
            Back
          </Button>
          <Button
            onClick={handleContinue}
            disabled={application.kyc_status !== 'verified' || processing}
            className="bg-[#11287c] hover:bg-[#1e3a8a] text-white px-6 w-full sm:w-auto"
          >
            Continue to Credit Check
          </Button>
        </div>
      )}
    </div>
  );
};
