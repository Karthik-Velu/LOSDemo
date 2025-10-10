import React, { useState, useEffect } from "react";
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
  
  // Check if a scenario was selected before reload
  useEffect(() => {
    const selectedScenario = sessionStorage.getItem('selected_scenario');
    if (selectedScenario) {
      const scenario = JSON.parse(selectedScenario);
      console.log('Auto-loading scenario after reload:', scenario.id);
      setFormData({ ...scenario.data, demo_scenario_id: scenario.id } as any);
      sessionStorage.removeItem('selected_scenario'); // Clear it so it doesn't happen again
    }
  }, []);

  const [showHighRiskQuestionnaire, setShowHighRiskQuestionnaire] = useState(false);
  const [highRiskAnswers, setHighRiskAnswers] = useState({
    employment_type: '',
    monthly_income: '',
    existing_loans: '',
    purpose_of_loan: '',
    relationship_with_coapplicant: '',
  });

  const [saving, setSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const demoScenarios = [
    {
      id: 'high_risk',
      title: 'High Fraud Risk Case',
      description: 'Requires additional verification',
      color: 'red',
      data: {
        applicant_name: 'Amit Kumar',
        applicant_phone: '+91 98765 43210',
        applicant_email: 'amit.kumar@email.com',
        applicant_address: 'Village Rampur, Post Office Rampur, Tehsil Bijnor, District Bijnor, Uttar Pradesh - 246701',
        applicant_pan: 'XYZAB1234C',
        applicant_aadhaar: '5678 9012 3456',
        coapplicant_name: 'Sunita Kumar',
        coapplicant_phone: '+91 98765 43211',
        coapplicant_email: 'sunita.kumar@email.com',
        coapplicant_address: 'Village Rampur, Post Office Rampur, Tehsil Bijnor, District Bijnor, Uttar Pradesh - 246701',
        coapplicant_pan: 'PQRST5678D',
        coapplicant_aadhaar: '4321 0987 6543',
        requested_amount: '75000',
      }
    },
    {
      id: 'low_risk_traditional',
      title: 'Low Risk - Traditional Data',
      description: 'Strong bureau & bank data',
      color: 'green',
      data: {
        applicant_name: 'Rajesh Kumar Sharma',
        applicant_phone: '+91 98765 43210',
        applicant_email: 'rajesh.sharma@email.com',
        applicant_address: 'Village Devgaon, Post Office Devgaon, Tehsil Sadar, District Azamgarh, Uttar Pradesh - 276001',
        applicant_pan: 'ABCDE1234F',
        applicant_aadhaar: '1234 5678 9012',
        coapplicant_name: 'Priya Sharma',
        coapplicant_phone: '+91 98765 43211',
        coapplicant_email: 'priya.sharma@email.com',
        coapplicant_address: 'Village Devgaon, Post Office Devgaon, Tehsil Sadar, District Azamgarh, Uttar Pradesh - 276001',
        coapplicant_pan: 'BCDEF5678G',
        coapplicant_aadhaar: '9876 5432 1098',
        requested_amount: '50000',
      }
    },
    {
      id: 'thin_file',
      title: 'Thin File - Alternate Data',
      description: 'Limited traditional data',
      color: 'blue',
      data: {
        applicant_name: 'Vikram Singh',
        applicant_phone: '+91 98765 43212',
        applicant_email: 'vikram.singh@email.com',
        applicant_address: 'Village Madhupur, Post Office Madhupur, Tehsil Ghazipur, District Ghazipur, Uttar Pradesh - 233001',
        applicant_pan: 'GHIJK5678H',
        applicant_aadhaar: '3456 7890 1234',
        coapplicant_name: 'Anjali Singh',
        coapplicant_phone: '+91 98765 43213',
        coapplicant_email: 'anjali.singh@email.com',
        coapplicant_address: 'Village Madhupur, Post Office Madhupur, Tehsil Ghazipur, District Ghazipur, Uttar Pradesh - 233001',
        coapplicant_pan: 'MNOPQ9012I',
        coapplicant_aadhaar: '2109 8765 4321',
        requested_amount: '35000',
      }
    },
    {
      id: 'fraud_rejection',
      title: 'Fraud Review Case',
      description: 'High fraud risk - requires manual review',
      color: 'red',
      data: {
        applicant_name: 'Ravi Patel',
        applicant_phone: '+91 98765 43214',
        applicant_email: 'ravi.patel@email.com',
        applicant_address: 'Village Chandpur, Post Office Chandpur, Tehsil Chandpur, District Bijnor, Uttar Pradesh - 246725',
        applicant_pan: 'RSTUV1234J',
        applicant_aadhaar: '4567 8901 2345',
        coapplicant_name: 'Kavita Patel',
        coapplicant_phone: '+91 98765 43215',
        coapplicant_email: 'kavita.patel@email.com',
        coapplicant_address: 'Village Chandpur, Post Office Chandpur, Tehsil Chandpur, District Bijnor, Uttar Pradesh - 246725',
        coapplicant_pan: 'WXYZAB5678K',
        coapplicant_aadhaar: '5432 1098 7654',
        requested_amount: '100000',
      }
    },
    {
      id: 'bank_rejection',
      title: 'Poor Bank Statement Case',
      description: 'Irregular transactions',
      color: 'orange',
      data: {
        applicant_name: 'Suresh Reddy',
        applicant_phone: '+91 98765 43216',
        applicant_email: 'suresh.reddy@email.com',
        applicant_address: 'Village Khanpur, Post Office Khanpur, Tehsil Ghazipur, District Ghazipur, Uttar Pradesh - 233002',
        applicant_pan: 'LMNOP9012L',
        applicant_aadhaar: '6789 0123 4567',
        coapplicant_name: 'Lakshmi Reddy',
        coapplicant_phone: '+91 98765 43217',
        coapplicant_email: 'lakshmi.reddy@email.com',
        coapplicant_address: 'Village Khanpur, Post Office Khanpur, Tehsil Ghazipur, District Ghazipur, Uttar Pradesh - 233002',
        coapplicant_pan: 'QRSTU3456M',
        coapplicant_aadhaar: '7654 3210 9876',
        requested_amount: '60000',
      }
    },
    {
      id: 'prime_customer',
      title: 'Prime Customer',
      description: 'Excellent profile',
      color: 'green',
      data: {
        applicant_name: 'Arun Kumar',
        applicant_phone: '+91 98765 43218',
        applicant_email: 'arun.kumar@email.com',
        applicant_address: 'Village Rasulpur, Post Office Rasulpur, Tehsil Bijnor, District Bijnor, Uttar Pradesh - 246701',
        applicant_pan: 'VWXYZ7890N',
        applicant_aadhaar: '8901 2345 6789',
        coapplicant_name: 'Meera Kumar',
        coapplicant_phone: '+91 98765 43219',
        coapplicant_email: 'meera.kumar@email.com',
        coapplicant_address: 'Village Rasulpur, Post Office Rasulpur, Tehsil Bijnor, District Bijnor, Uttar Pradesh - 246701',
        coapplicant_pan: 'ABCDE1234O',
        coapplicant_aadhaar: '8765 4321 0987',
        requested_amount: '80000',
      }
    },
    {
      id: 'young_professional',
      title: 'Young Professional',
      description: 'New to credit',
      color: 'blue',
      data: {
        applicant_name: 'Kiran Desai',
        applicant_phone: '+91 98765 43220',
        applicant_email: 'kiran.desai@email.com',
        applicant_address: 'Village Shivpur, Post Office Shivpur, Tehsil Azamgarh, District Azamgarh, Uttar Pradesh - 276001',
        applicant_pan: 'FGHIJ4567P',
        applicant_aadhaar: '9012 3456 7890',
        coapplicant_name: 'Ritu Desai',
        coapplicant_phone: '+91 98765 43221',
        coapplicant_email: 'ritu.desai@email.com',
        coapplicant_address: 'Village Shivpur, Post Office Shivpur, Tehsil Azamgarh, District Azamgarh, Uttar Pradesh - 276001',
        coapplicant_pan: 'KLMNO8901Q',
        coapplicant_aadhaar: '9876 5432 1098',
        requested_amount: '45000',
      }
    }
  ];

  const handleScenarioSelect = (scenario: typeof demoScenarios[0]) => {
    console.log('Scenario selected:', scenario.id);
    // Clear localStorage and reload to start fresh with new scenario
    localStorage.removeItem('mock_loan_applications');
    // Set the scenario in sessionStorage so we can pick it up after reload
    sessionStorage.setItem('selected_scenario', JSON.stringify(scenario));
    window.location.reload();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updateData = {
        ...formData,
        requested_amount: formData.requested_amount ? parseFloat(formData.requested_amount as string) : undefined,
        status: 'in_progress',
        demo_scenario_id: (formData as any).demo_scenario_id,
      };
      console.log('Lead Registration - Saving with demo_scenario_id:', updateData.demo_scenario_id);
      await onUpdate(updateData);
      onNext();
    } catch (error) {
      console.error('Error saving lead registration:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Lead Registration</h2>
            <p className="text-sm text-gray-600">Use Prefill Demo to quickly populate realistic scenarios</p>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() => (document.getElementById('scenario-modal') as HTMLDialogElement)?.showModal()}
          >
            Prefill Demo
          </Button>
        </div>
        <dialog id="scenario-modal" className="rounded-lg w-full max-w-xl p-0">
          <div className="p-4 border-b">
            <h3 className="text-lg font-semibold text-gray-900">Select a Demo Scenario</h3>
          </div>
          <div className="max-h-[60vh] overflow-auto p-4 space-y-2">
            {demoScenarios.map((scenario) => (
              <button
                key={scenario.id}
                onClick={() => {
                  handleScenarioSelect(scenario);
                  (document.getElementById('scenario-modal') as HTMLDialogElement)?.close();
                }}
                className={`w-full text-left p-3 rounded border transition ${
                  scenario.color === 'red' ? 'border-red-200 hover:bg-red-50' :
                  scenario.color === 'green' ? 'border-green-200 hover:bg-green-50' :
                  scenario.color === 'blue' ? 'border-blue-200 hover:bg-blue-50' :
                  'border-orange-200 hover:bg-orange-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{scenario.title}</p>
                    <p className="text-xs text-gray-600">{scenario.description}</p>
                  </div>
                  <span className="text-xs text-gray-500">₹{scenario.data.requested_amount}</span>
                </div>
              </button>
            ))}
          </div>
          <div className="p-4 border-t flex justify-end">
            <Button variant="outline" onClick={() => (document.getElementById('scenario-modal') as HTMLDialogElement)?.close()}>Close</Button>
          </div>
        </dialog>
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            className="bg-[#11287c] hover:bg-[#1e3a8a] text-white px-8 py-2 w-full sm:w-auto"
          >
            {saving ? 'Saving...' : 'Save & Continue to KYC'}
          </Button>
        </div>
      </form>

      {showHighRiskQuestionnaire && (
        <div className="mt-8 bg-red-50 p-6 rounded-lg border border-red-200">
          <h3 className="text-lg font-semibold text-red-900 mb-4">Additional Risk Assessment Required</h3>
          <p className="text-sm text-red-700 mb-4">
            This application has been flagged for additional verification due to potential risk indicators.
          </p>

          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Employment Type *
                </label>
                <select
                  value={highRiskAnswers.employment_type}
                  onChange={(e) => setHighRiskAnswers({...highRiskAnswers, employment_type: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  required
                >
                  <option value="">Select employment type</option>
                  <option value="salaried">Salaried</option>
                  <option value="self_employed">Self Employed</option>
                  <option value="business">Business Owner</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Monthly Income (₹) *
                </label>
                <input
                  type="number"
                  value={highRiskAnswers.monthly_income}
                  onChange={(e) => setHighRiskAnswers({...highRiskAnswers, monthly_income: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="50000"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Existing Loans (₹) *
                </label>
                <input
                  type="number"
                  value={highRiskAnswers.existing_loans}
                  onChange={(e) => setHighRiskAnswers({...highRiskAnswers, existing_loans: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="25000"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Purpose of Loan *
                </label>
                <select
                  value={highRiskAnswers.purpose_of_loan}
                  onChange={(e) => setHighRiskAnswers({...highRiskAnswers, purpose_of_loan: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  required
                >
                  <option value="">Select purpose</option>
                  <option value="home_purchase">Home Purchase</option>
                  <option value="business_expansion">Business Expansion</option>
                  <option value="debt_consolidation">Debt Consolidation</option>
                  <option value="personal">Personal Use</option>
                  <option value="education">Education</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Relationship with Co-applicant *
              </label>
              <select
                value={highRiskAnswers.relationship_with_coapplicant}
                onChange={(e) => setHighRiskAnswers({...highRiskAnswers, relationship_with_coapplicant: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                required
              >
                <option value="">Select relationship</option>
                <option value="spouse">Spouse</option>
                <option value="parent">Parent</option>
                <option value="sibling">Sibling</option>
                <option value="business_partner">Business Partner</option>
                <option value="friend">Friend</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="bg-yellow-50 p-3 rounded border border-yellow-200">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> This additional information will be used for enhanced risk assessment.
                All data is encrypted and secure.
              </p>
            </div>

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowHighRiskQuestionnaire(false)}
                className="px-6"
              >
                Cancel
              </Button>
              <Button
                type="button"
                className="bg-red-600 hover:bg-red-700 text-white px-6"
                onClick={() => {
                  // Process high risk questionnaire
                  alert('Additional verification data submitted. Enhanced risk assessment will be performed.');
                  setShowHighRiskQuestionnaire(false);
                }}
              >
                Submit for Enhanced Review
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
