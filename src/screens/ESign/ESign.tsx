import React, { useState, useEffect } from "react";
import { supabase, type LoanApplication } from "../../lib/supabase";
import { LeadRegistration } from "./LeadRegistration";
import { KYCVerification } from "./KYCVerification";
import { CreditCheck } from "./CreditCheck";
import { Disbursement } from "./Disbursement";

const workflowSteps = [
  {
    id: 1,
    key: 'lead_registration' as const,
    title: "Lead Registration",
    description: "Basic applicant details",
  },
  {
    id: 2,
    key: 'kyc' as const,
    title: "KYC Verification",
    description: "KYC capture & fraud check",
  },
  {
    id: 3,
    key: 'credit_check' as const,
    title: "Credit Check",
    description: "Credit bureau & decision",
  },
  {
    id: 4,
    key: 'disbursement' as const,
    title: "Disbursement",
    description: "Agreement & payment",
  },
];

export const ESign = (): JSX.Element => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [application, setApplication] = useState<LoanApplication | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadOrCreateApplication();
  }, []);

  const loadOrCreateApplication = async () => {
    setLoading(true);
    try {
      const { data: existingApps, error: fetchError } = await supabase
        .from('loan_applications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (existingApps) {
        setApplication(existingApps);
        const stageIndex = workflowSteps.findIndex(s => s.key === existingApps.current_stage);
        setCurrentStepIndex(stageIndex >= 0 ? stageIndex : 0);
      } else {
        const { data: newApp, error: createError } = await supabase
          .from('loan_applications')
          .insert([{
            current_stage: 'lead_registration',
            status: 'draft',
            loan_officer: 'Rajesh Verma',
          }])
          .select()
          .single();

        if (createError) throw createError;
        setApplication(newApp);
      }
    } catch (error) {
      console.error('Error loading application:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateApplication = async (updates: Partial<LoanApplication>) => {
    if (!application) return;

    try {
      const { data, error } = await supabase
        .from('loan_applications')
        .update(updates)
        .eq('id', application.id)
        .select()
        .single();

      if (error) throw error;
      setApplication(data);
      return data;
    } catch (error) {
      console.error('Error updating application:', error);
      throw error;
    }
  };

  const moveToNextStep = async () => {
    if (currentStepIndex < workflowSteps.length - 1) {
      const nextStep = workflowSteps[currentStepIndex + 1];
      await updateApplication({ current_stage: nextStep.key });
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const moveToPreviousStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const currentStep = workflowSteps[currentStepIndex];

  if (loading || !application) {
    return (
      <div className="bg-white w-full min-w-[360px] min-h-screen flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="bg-white w-full min-w-[360px] min-h-screen">
      <header className="bg-[#11287c] text-white px-6 py-4 shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">Loan Application</h1>
            <p className="text-sm text-blue-200">ID: {application.loan_id}</p>
          </div>
          <div className="text-right">
            <p className="text-sm">Loan Officer</p>
            <p className="text-sm font-medium">{application.loan_officer}</p>
          </div>
        </div>
      </header>

      <div className="px-6 py-4">
        <div className="flex items-center justify-between mb-6">
          {workflowSteps.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center flex-1">
              <div className="flex items-center w-full">
                {index > 0 && (
                  <div className={`flex-1 h-1 ${index <= currentStepIndex ? 'bg-[#11287c]' : 'bg-gray-300'}`} />
                )}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                    index === currentStepIndex
                      ? 'bg-[#11287c] text-white ring-4 ring-blue-200'
                      : index < currentStepIndex
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  {index < currentStepIndex ? '✓' : step.id}
                </div>
                {index < workflowSteps.length - 1 && (
                  <div className={`flex-1 h-1 ${index < currentStepIndex ? 'bg-[#11287c]' : 'bg-gray-300'}`} />
                )}
              </div>
              <div className="mt-2 text-center">
                <p className="text-xs font-medium text-gray-900">{step.title}</p>
                <p className="text-xs text-gray-500">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gray-50 rounded-lg p-6 min-h-[400px]">
          {currentStep.key === 'lead_registration' && (
            <LeadRegistration
              application={application}
              onUpdate={updateApplication}
              onNext={moveToNextStep}
            />
          )}
          {currentStep.key === 'kyc' && (
            <KYCVerification
              application={application}
              onUpdate={updateApplication}
              onNext={moveToNextStep}
              onBack={moveToPreviousStep}
            />
          )}
          {currentStep.key === 'credit_check' && (
            <CreditCheck
              application={application}
              onUpdate={updateApplication}
              onNext={moveToNextStep}
              onBack={moveToPreviousStep}
            />
          )}
          {currentStep.key === 'disbursement' && (
            <Disbursement
              application={application}
              onUpdate={updateApplication}
              onBack={moveToPreviousStep}
            />
          )}
        </div>
      </div>
    </div>
  );
};
