import React, { useState } from "react";
import { type LoanApplication } from "../../lib/supabase";
import { Button } from "../../components/ui/button";

interface LeadRegistrationProps {
  application: LoanApplication;
  onUpdate: (updates: Partial<LoanApplication>) => Promise<any>;
  onNext: () => void;
}

export const LeadRegistration: React.FC<LeadRegistrationProps> = ({
  application,
  onUpdate,
  onNext,
}) => {
  const [formData, setFormData] = useState({
    applicant_name: application.applicant_name || '',
    applicant_phone: application.applicant_phone || '',
    applicant_email: application.applicant_email || '',
    applicant_address: application.applicant_address || '',
    applicant_pan: application.applicant_pan || '',
    applicant_aadhaar: application.applicant_aadhaar || '',
    coapplicant_name: application.coapplicant_name || '',
    coapplicant_phone: application.coapplicant_phone || '',
    coapplicant_email: application.coapplicant_email || '',
    coapplicant_address: application.coapplicant_address || '',
    coapplicant_pan: application.coapplicant_pan || '',
    coapplicant_aadhaar: application.coapplicant_aadhaar || '',
    requested_amount: application.requested_amount || '',
  });

  const [saving, setSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePrefill = () => {
    setFormData({
      applicant_name: 'Rajesh Kumar Sharma',
      applicant_phone: '+91 98765 43210',
      applicant_email: 'rajesh.sharma@email.com',
      applicant_address: '123 MG Road, Bangalore, Karnataka - 560001',
      applicant_pan: 'ABCDE1234F',
      applicant_aadhaar: '1234 5678 9012',
      coapplicant_name: 'Priya Sharma',
      coapplicant_phone: '+91 98765 43211',
      coapplicant_email: 'priya.sharma@email.com',
      coapplicant_address: '123 MG Road, Bangalore, Karnataka - 560001',
      coapplicant_pan: 'BCDEF5678G',
      coapplicant_aadhaar: '9876 5432 1098',
      requested_amount: '50000',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onUpdate({
        ...formData,
        requested_amount: formData.requested_amount ? parseFloat(formData.requested_amount as string) : undefined,
        status: 'in_progress',
      });
      onNext();
    } catch (error) {
      console.error('Error saving lead registration:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Lead Registration</h2>
        <Button
          type="button"
          variant="outline"
          onClick={handlePrefill}
          className="text-sm"
        >
          Prefill Demo Data
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Applicant Details</h3>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                name="applicant_name"
                value={formData.applicant_name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#11287c] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                name="applicant_phone"
                value={formData.applicant_phone}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#11287c] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="applicant_email"
                value={formData.applicant_email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#11287c] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address *
              </label>
              <textarea
                name="applicant_address"
                value={formData.applicant_address}
                onChange={handleChange}
                required
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#11287c] focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  PAN Number
                </label>
                <input
                  type="text"
                  name="applicant_pan"
                  value={formData.applicant_pan}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#11287c] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Aadhaar Number
                </label>
                <input
                  type="text"
                  name="applicant_aadhaar"
                  value={formData.applicant_aadhaar}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#11287c] focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Co-Applicant Details</h3>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="coapplicant_name"
                value={formData.coapplicant_name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#11287c] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                name="coapplicant_phone"
                value={formData.coapplicant_phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#11287c] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="coapplicant_email"
                value={formData.coapplicant_email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#11287c] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <textarea
                name="coapplicant_address"
                value={formData.coapplicant_address}
                onChange={handleChange}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#11287c] focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  PAN Number
                </label>
                <input
                  type="text"
                  name="coapplicant_pan"
                  value={formData.coapplicant_pan}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#11287c] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Aadhaar Number
                </label>
                <input
                  type="text"
                  name="coapplicant_aadhaar"
                  value={formData.coapplicant_aadhaar}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#11287c] focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Loan Details</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Requested Loan Amount (₹) *
            </label>
            <input
              type="number"
              name="requested_amount"
              value={formData.requested_amount}
              onChange={handleChange}
              required
              min="0"
              step="1000"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#11287c] focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={saving}
            className="bg-[#11287c] hover:bg-[#1e3a8a] text-white px-8 py-2"
          >
            {saving ? 'Saving...' : 'Save & Continue to KYC'}
          </Button>
        </div>
      </form>
    </div>
  );
};
