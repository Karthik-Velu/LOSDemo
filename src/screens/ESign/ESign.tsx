import React, { useState, useEffect, useMemo } from "react";
import kiOriginateLogo from "../../assets/ki-originate-logo.svg";
import { supabase, type LoanApplication } from "../../lib/supabase";
import { RegionSelector } from "./RegionSelector";
import { IntroScreen } from "./IntroScreen";
import { LeadRegistration } from "./LeadRegistration";
import { FarmDetails } from "./FarmDetails";
import { OTPVerification } from "./OTPVerification";
import { KYCVerification } from "./KYCVerification";
import { CreditCheck } from "./CreditCheck";
import { Disbursement } from "./Disbursement";
import { VendorProfile } from "./VendorProfile";
import { MandateSetup } from "./MandateSetup";
import { CollectionsDashboard } from "./CollectionsDashboard";
import { VENDOR_SCENARIO_ID } from "../../lib/vendorDemo";

type StepKey = 'region_selector' | 'intro' | 'lead_registration' | 'farm_details' | 'vendor_profile' | 'otp_verification' | 'kyc' | 'credit_check' | 'mandate_setup' | 'disbursement' | 'collections';

interface WorkflowStep {
  id: number;
  key: StepKey;
  title: string;
  description: string;
}

const standardSteps: WorkflowStep[] = [
  { id: 0, key: 'region_selector', title: "Region", description: "Select region" },
  { id: 1, key: 'intro', title: "Welcome", description: "Demo introduction" },
  { id: 2, key: 'lead_registration', title: "Lead Registration", description: "Basic applicant details" },
  { id: 3, key: 'otp_verification', title: "Data Consent", description: "Bureau & bank data access" },
  { id: 4, key: 'kyc', title: "KYC & Fraud Check", description: "Document upload & verification" },
  { id: 5, key: 'credit_check', title: "Credit Assessment", description: "Credit scoring & decision" },
  { id: 6, key: 'disbursement', title: "Disbursement", description: "Agreement & payment" },
];

const altDataOnlySteps: WorkflowStep[] = [
  { id: 0, key: 'region_selector', title: "Region", description: "Select region" },
  { id: 1, key: 'intro', title: "Welcome", description: "Demo introduction" },
  { id: 2, key: 'lead_registration', title: "Lead Registration", description: "Farmer & loan details" },
  { id: 3, key: 'farm_details', title: "Farm & Crop Profile", description: "Farm-level data inputs" },
  { id: 4, key: 'credit_check', title: "Credit Assessment", description: "Alt data scoring & decision" },
  { id: 5, key: 'disbursement', title: "Disbursement", description: "Agreement & payment" },
];

const vendorDailySteps: WorkflowStep[] = [
  { id: 0, key: 'region_selector', title: "Region", description: "Select region" },
  { id: 1, key: 'intro', title: "Welcome", description: "Demo introduction" },
  { id: 2, key: 'lead_registration', title: "Application", description: "Vendor & loan details" },
  { id: 3, key: 'vendor_profile', title: "Business Profile", description: "Trade & daily sales" },
  { id: 4, key: 'otp_verification', title: "Consent & Income", description: "Consent, bank link, income read" },
  { id: 5, key: 'credit_check', title: "Credit Assessment", description: "ki score & daily instalment" },
  { id: 6, key: 'mandate_setup', title: "Mandate Setup", description: "UPI Autopay & NACH" },
  { id: 7, key: 'disbursement', title: "Disbursement", description: "Agreement & payment" },
  { id: 8, key: 'collections', title: "Collections", description: "Daily mandate tracking" },
];

function getWorkflowSteps(scenarioId?: string): WorkflowStep[] {
  if (scenarioId === 'africa_agri_alt_only') return altDataOnlySteps;
  if (scenarioId === VENDOR_SCENARIO_ID) return vendorDailySteps;
  return standardSteps;
}

function getJourneySteps(steps: WorkflowStep[]): WorkflowStep[] {
  return steps.filter(s => s.key !== 'region_selector' && s.key !== 'intro');
}

export const ESign = (): JSX.Element => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [application, setApplication] = useState<LoanApplication | null>(null);
  const [loading, setLoading] = useState(false);

  const getScenarioLabel = (scenarioId?: string) => {
    const labels: Record<string, string> = {
      young_professional: 'Young Professional',
      climate_adaptive: 'Climate Adaptive',
      sri_lanka_climate_farmer: 'Sri Lanka Farmer',
      prime_customer: 'Low Risk Customer',
      fraud_rejection: 'Fraud Rejection',
      bank_rejection: 'Credit Rejection',
      africa_agri_alt_only: 'Kenya Farmer (Alt Data)',
      africa_agri_enhanced: 'Kenya Farmer (alternate data + Bureau)',
      vendor_daily_edi: 'Street Vendor (Daily EDI)',
    };
    return scenarioId ? (labels[scenarioId] || scenarioId) : '';
  };

  const workflowSteps = useMemo(() => {
    return getWorkflowSteps((application as any)?.demo_scenario_id);
  }, [(application as any)?.demo_scenario_id]);

  const journeySteps = useMemo(() => getJourneySteps(workflowSteps), [workflowSteps]);

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
        const appWithDefaults = {
          ...existingApps,
          bureau_otp_verified: existingApps.bureau_otp_verified ?? false,
          bank_otp_verified: existingApps.bank_otp_verified ?? false,
        };
        setApplication(appWithDefaults);
        setCurrentStepIndex(0);
      } else {
        const { data: newApp, error: createError } = await supabase
          .from('loan_applications')
          .insert([{
            current_stage: 'lead_registration',
            status: 'draft',
            loan_officer: 'Operations Officer',
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
      console.error('ESign - Update error:', error);
      throw error;
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentStepIndex]);

  const moveToNextStep = async () => {
    if (currentStepIndex < workflowSteps.length - 1) {
      const nextStep = workflowSteps[currentStepIndex + 1];
      await updateApplication({ current_stage: nextStep.key } as any);
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const moveToPreviousStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const currentStep = workflowSteps[currentStepIndex];

  const isPreJourney = currentStep?.key === 'region_selector' || currentStep?.key === 'intro';

  const hasCollectionsStep = workflowSteps.some(s => s.key === 'collections');

  const currentJourneyIndex = isPreJourney ? -1 : journeySteps.findIndex(s => s.key === currentStep?.key);

  if (loading || !application) {
    return (
      <div className="bg-white w-full min-w-[360px] min-h-screen flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="bg-white w-full min-w-[360px] min-h-screen">
      {!isPreJourney && (
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
                      Scenario: {getScenarioLabel((application as any).demo_scenario_id)}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  localStorage.removeItem('mock_loan_applications');
                  setApplication(null);
                  setCurrentStepIndex(0);
                  window.location.reload();
                }}
                className="text-sm bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded transition"
              >
                Restart Demo
              </button>
              <div className="text-right">
                <p className="text-sm">Loan Officer</p>
                <p className="text-sm font-medium">{application.loan_officer}</p>
              </div>
            </div>
          </div>
        </header>
      )}

      <div className="px-6 py-6 max-w-7xl mx-auto">
        {!isPreJourney && (
          <div className="mb-8 overflow-x-auto">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 min-w-[600px]">
              <div className="flex items-start justify-between gap-2">
                {journeySteps.map((step, i) => {
                  const isActive = i === currentJourneyIndex;
                  const isCompleted = i < currentJourneyIndex;
                  return (
                    <React.Fragment key={step.key}>
                      <div className="flex flex-col items-center flex-1 min-w-0">
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
                              i + 1
                            )}
                          </div>
                          {isActive && (
                            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
                              <div className="w-2 h-2 rounded-full bg-[#11287c] animate-pulse"></div>
                            </div>
                          )}
                        </div>
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
                      {i < journeySteps.length - 1 && (
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
                  );
                })}
              </div>
            </div>
          </div>
        )}

        <div className={`${isPreJourney ? '' : 'bg-gray-50 rounded-lg p-6'} min-h-[400px]`}>
          {currentStep.key === 'region_selector' && (
            <RegionSelector onSelect={async (region: string) => {
              await updateApplication({ demo_region: region } as any);
              setCurrentStepIndex(currentStepIndex + 1);
            }} />
          )}
          {currentStep.key === 'intro' && (
            <IntroScreen
              region={(application as any).demo_region || 'africa'}
              onNext={async (scenarioId?: string) => {
                if (scenarioId) {
                  await updateApplication({ demo_scenario_id: scenarioId } as any);
                }
                moveToNextStep();
              }}
            />
          )}
          {currentStep.key === 'lead_registration' && (
            <LeadRegistration
              application={application}
              onUpdate={updateApplication}
              onNext={moveToNextStep}
            />
          )}
          {currentStep.key === 'farm_details' && (
            <FarmDetails
              application={application}
              onUpdate={updateApplication}
              onNext={moveToNextStep}
              onBack={moveToPreviousStep}
            />
          )}
          {currentStep.key === 'vendor_profile' && (
            <VendorProfile
              application={application}
              onUpdate={updateApplication}
              onNext={moveToNextStep}
              onBack={moveToPreviousStep}
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
          {currentStep.key === 'mandate_setup' && (
            <MandateSetup
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
              onNext={hasCollectionsStep ? moveToNextStep : undefined}
              onRestart={() => {
                localStorage.removeItem('mock_loan_applications');
                window.location.reload();
              }}
            />
          )}
          {currentStep.key === 'collections' && (
            <CollectionsDashboard
              application={application}
              onBack={moveToPreviousStep}
              onRestart={() => {
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
