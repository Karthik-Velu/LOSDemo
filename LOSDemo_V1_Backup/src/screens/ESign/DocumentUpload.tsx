import React, { useState, useEffect } from "react";
import { type LoanApplication } from "../../lib/supabase";
import { Button } from "../../components/ui/button";

interface DocumentUploadProps {
  application: LoanApplication;
  onUpdate: (updates: Partial<LoanApplication>) => Promise<any>;
  onNext: () => void;
  onBack: () => void;
}

export const DocumentUpload: React.FC<DocumentUploadProps> = ({
  application,
  onUpdate,
  onNext,
  onBack,
}) => {
  const [uploading, setUploading] = useState(false);
  const [panUploaded, setPanUploaded] = useState(!!application.pan_uploaded);
  const [aadhaarUploaded, setAadhaarUploaded] = useState(!!application.aadhaar_uploaded);

  // Auto-simulate upload on mount if not already done
  useEffect(() => {
    if (!panUploaded && !aadhaarUploaded && !uploading) {
      simulateUpload();
    }
  }, []);

  const simulateUpload = async () => {
    setUploading(true);

    try {
      // Simulate PAN upload
      await new Promise(resolve => setTimeout(resolve, 1500));
      setPanUploaded(true);

      // Simulate Aadhaar upload
      await new Promise(resolve => setTimeout(resolve, 1500));
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

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Document Upload</h2>
        <p className="text-base text-gray-600">Upload PAN Card and Aadhaar Card for verification</p>
      </div>

      <div className="space-y-6">
        {/* PAN Card Upload */}
        <div className="bg-white p-6 rounded-lg shadow-sm border-2 border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                panUploaded ? 'bg-green-100' : 'bg-blue-100'
              }`}>
                <span className="text-2xl">{panUploaded ? '✓' : '📄'}</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">PAN Card</h3>
                <p className="text-sm text-gray-600">Permanent Account Number</p>
              </div>
            </div>
            {panUploaded && (
              <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                ✓ Uploaded
              </span>
            )}
          </div>

          {uploading && !panUploaded && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <div>
                  <p className="text-sm font-medium text-blue-900">Uploading PAN Card...</p>
                  <p className="text-xs text-blue-700">Verifying document authenticity</p>
                </div>
              </div>
            </div>
          )}

          {panUploaded && (
            <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">PAN Number:</span>
                  <span className="ml-2 font-semibold text-gray-900">{application.applicant_pan}</span>
                </div>
                <div>
                  <span className="text-gray-600">Name on PAN:</span>
                  <span className="ml-2 font-semibold text-gray-900">{application.applicant_name}</span>
                </div>
                <div>
                  <span className="text-gray-600">Status:</span>
                  <span className="ml-2 font-semibold text-green-700">Valid & Active</span>
                </div>
                <div>
                  <span className="text-gray-600">Verification:</span>
                  <span className="ml-2 font-semibold text-green-700">Passed</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Aadhaar Card Upload */}
        <div className="bg-white p-6 rounded-lg shadow-sm border-2 border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                aadhaarUploaded ? 'bg-green-100' : 'bg-blue-100'
              }`}>
                <span className="text-2xl">{aadhaarUploaded ? '✓' : '📄'}</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Aadhaar Card</h3>
                <p className="text-sm text-gray-600">Unique Identification Number</p>
              </div>
            </div>
            {aadhaarUploaded && (
              <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                ✓ Uploaded
              </span>
            )}
          </div>

          {uploading && panUploaded && !aadhaarUploaded && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <div>
                  <p className="text-sm font-medium text-blue-900">Uploading Aadhaar Card...</p>
                  <p className="text-xs text-blue-700">Verifying document authenticity</p>
                </div>
              </div>
            </div>
          )}

          {aadhaarUploaded && (
            <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Aadhaar Number:</span>
                  <span className="ml-2 font-semibold text-gray-900">{application.applicant_aadhaar}</span>
                </div>
                <div>
                  <span className="text-gray-600">Name on Aadhaar:</span>
                  <span className="ml-2 font-semibold text-gray-900">{application.applicant_name}</span>
                </div>
                <div>
                  <span className="text-gray-600">Address:</span>
                  <span className="ml-2 font-semibold text-gray-900">{application.applicant_address}</span>
                </div>
                <div>
                  <span className="text-gray-600">Verification:</span>
                  <span className="ml-2 font-semibold text-green-700">Passed</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Success Message */}
        {panUploaded && aadhaarUploaded && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 p-6 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xl">✓</span>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-green-900">Documents Verified Successfully</h4>
                <p className="text-sm text-green-700">All documents have been uploaded and verified</p>
              </div>
            </div>
            <p className="text-sm text-green-800 bg-white p-3 rounded border border-green-200">
              <strong>Next Step:</strong> Your documents will now be cross-verified during KYC and fraud risk assessment.
            </p>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-3 mt-6">
        <Button
          onClick={onBack}
          variant="outline"
          className="px-6 w-full sm:w-auto"
        >
          Back
        </Button>
        <Button
          onClick={onNext}
          disabled={!panUploaded || !aadhaarUploaded}
          className="bg-[#11287c] hover:bg-[#1e3a8a] text-white px-6 w-full sm:w-auto"
        >
          Continue to KYC Verification
        </Button>
      </div>
    </div>
  );
};

