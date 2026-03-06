import React, { useState, useEffect } from "react";
import kiOriginateLogo from "../../assets/ki-originate-logo.svg";
import { supabase, type LoanApplication } from "../../lib/supabase";
import { IntroScreen } from "./IntroScreen";
import { LeadRegistration } from "./LeadRegistration";
import { OTPVerification } from "./OTPVerification";
import { DocumentUpload } from "./DocumentUpload";
import { KYCVerification } from "./KYCVerification";
import { CreditCheck } from "./CreditCheck";
import { Disbursement } from "./Disbursement";

const workflowSteps = [
  {
    id: 0,
    key: 'intro' as const,
    title: "Welcome",
    description: "Demo introduction",
  },
  {
    id: 1,
    key: 'lead_registration' as const,
    title: "Lead Registration",
    description: "Basic applicant details",
  },
  {
    id: 2,
    key: 'otp_verification' as const,
    title: "Data Consent",
    description: "Bureau & bank data access",
  },
  {
    id: 3,
    key: 'kyc' as const,
    title: "KYC & Fraud Check",
    description: "Document upload & verification",
  },
  {
    id: 4,
    key: 'credit_check' as const,
    title: "Credit Assessment",
    description: "Credit scoring & decision",
  },
  {
    id: 5,
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
        // Ensure OTP verification fields are initialized
        const appWithDefaults = {
          ...existingApps,
          bureau_otp_verified: existingApps.bureau_otp_verified ?? false,
          bank_otp_verified: existingApps.bank_otp_verified ?? false,
        };
        setApplication(appWithDefaults);
        // Always start at step 0 for new sessions, regardless of current_stage
        setCurrentStepIndex(0);
      } else {
        const { data: newApp, error: createError } = await supabase
          .from('loan_applications')
          .insert([{
            current_stage: 'lead_registration',
            status: 'draft',
            loan_officer: 'Rajesh Verma',
            bureau_otp_verified: false,
            bank_otp_verified: false,
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
      console.log('ESign - Updating application with:', updates);
      const { data, error } = await supabase
        .from('loan_applications')
        .update(updates)
        .eq('id', application.id)
        .select()
        .single();

      if (error) throw error;
      console.log('ESign - Application updated. New state:', data);
      setApplication(data);
      return data;
    } catch (error) {
      console.error('ESign - Update error:', error);
      throw error;
    }
  };

  // Scroll to top on every step transition (fixes landing at bottom of new page)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentStepIndex]);

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
          <div className="flex items-center gap-3 min-w-0">
            <img src={kiOriginateLogo} alt="Ki Originate" className="h-8 w-auto" />
            <div className="truncate">
              <h1 className="text-xl font-semibold truncate">Loan Application</h1>
              <div className="flex items-center gap-2">
                <p className="text-sm text-blue-200 truncate">ID: {application.loan_id}</p>
                {(application as any).demo_scenario_id && (
                  <span className="text-xs bg-white/20 px-2 py-0.5 rounded">
                    Scenario: {(application as any).demo_scenario_id}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                if (confirm('Clear all data and start fresh demo?')) {
                  localStorage.removeItem('mock_loan_applications');
                  window.location.reload();
                }
              }}
              className="text-sm bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded transition"
            >
              🔄 Restart Demo
            </button>
            <div className="text-right">
              <p className="text-sm">Loan Officer</p>
              <p className="text-sm font-medium">{application.loan_officer}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="px-6 py-6 max-w-7xl mx-auto">
        {/* Modern Stepper — hidden on intro; only 5 application stages (Welcome not a journey step) */}
        {currentStepIndex > 0 && (
          <div className="mb-8 overflow-x-auto">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 min-w-[700px]">
              <div className="flex items-start justify-between gap-2">
                {workflowSteps.slice(1).map((step, i) => {
                  const stepIndex = i + 1; // 1–5 (Lead Registration through Disbursement)
                  const isActive = stepIndex === currentStepIndex;
                  const isCompleted = stepIndex < currentStepIndex;
                  return (
                  <React.Fragment key={step.id}>
                    <div className="flex flex-col items-center flex-1 min-w-0">
                      {/* Step Circle */}
                      <div className="relative">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center text-base font-bold transition-all shadow-md ${
                            isActive
                              ? 'bg-gradient-to-br from-[#11287c] to-[#1e3a8a] text-white ring-4 ring-blue-200 scale-110'
                              : isCompleted
                              ? 'bg-gradient-to-br from-green-500 to-green-600 text-white'
                              : 'bg-gray-200 text-gray-500'
                          }`}
                        >
                          {isCompleted ? (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            stepIndex
                          )}
                        </div>
                        {isActive && (
                          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
                            <div className="w-2 h-2 rounded-full bg-[#11287c] animate-pulse"></div>
                          </div>
                        )}
                      </div>

                      {/* Step Info */}
                      <div className="mt-3 text-center px-1">
                        <p className={`text-sm font-semibold leading-tight ${
                          isActive ? 'text-[#11287c]' : isCompleted ? 'text-green-700' : 'text-gray-600'
                        }`}>
                          {step.title}
                        </p>
                        <p className={`text-xs mt-1 leading-tight ${
                          isActive ? 'text-gray-700' : 'text-gray-500'
                        }`}>
                          {step.description}
                        </p>
                      </div>
                    </div>

                    {i < 4 && (
                      <div className="flex items-center" style={{ marginTop: '24px' }}>
                        <div className="relative h-1 w-8 lg:w-12">
                          <div className="absolute inset-0 bg-gray-200 rounded-full"></div>
                          <div
                            className={`absolute inset-0 rounded-full transition-all duration-500 ${
                              isCompleted ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-gray-200'
                            }`}
                            style={{ width: isCompleted ? '100%' : '0%' }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </React.Fragment>
                );})}
              </div>
            </div>
          </div>
        )}

        <div className="bg-gray-50 rounded-lg p-6 min-h-[400px]">
          {currentStep.key === 'intro' && (
            <IntroScreen onNext={moveToNextStep} />
          )}
          {currentStep.key === 'lead_registration' && (
            <LeadRegistration
              application={application}
              onUpdate={updateApplication}
              onNext={moveToNextStep}
            />
          )}
          {currentStep.key === 'otp_verification' && (
            <OTPVerification
              application={application}
              onUpdate={updateApplication}
              onNext={moveToNextStep}
              onBack={moveToPreviousStep}
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
              onRestart={() => {
                // Clear localStorage and reload
                localStorage.removeItem('mock_loan_applications');
                window.location.reload();
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};
