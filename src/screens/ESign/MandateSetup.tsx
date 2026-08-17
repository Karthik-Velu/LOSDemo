import React, { useState } from "react";
import { type LoanApplication } from "../../lib/supabase";
import { Button } from "../../components/ui/button";
import { StepNarration } from "../../components/StepNarration";
import { mandateDetails, formatINR, type MandateRail } from "../../lib/vendorDemo";

interface MandateSetupProps {
  application: LoanApplication;
  onUpdate: (updates: Partial<LoanApplication>) => Promise<any>;
  onNext: () => void;
  onBack: () => void;
}

type Phase = 'choose' | 'authorising' | 'primary_done' | 'fallback_authorising' | 'done';

export const MandateSetup: React.FC<MandateSetupProps> = ({
  application,
  onUpdate,
  onNext,
  onBack,
}) => {
  const dailyInstalment = (application as any).daily_instalment || 0;
  const [primaryRail, setPrimaryRail] = useState<MandateRail>('UPI Autopay');
  const [phase, setPhase] = useState<Phase>(
    (application as any).mandate_primary_rail ? 'done' : 'choose'
  );
  const [authStep, setAuthStep] = useState(0);

  const fallbackRail: MandateRail = primaryRail === 'UPI Autopay' ? 'NACH' : 'UPI Autopay';
  const upiCap = mandateDetails.upi.maxDebit;
  const nachCap = mandateDetails.nach.maxDebit;

  const runAuthorisation = async (rail: MandateRail, isFallback: boolean) => {
    setPhase(isFallback ? 'fallback_authorising' : 'authorising');
    const steps = rail === 'UPI Autopay'
      ? ['Opening UPI app...', 'Reviewing mandate details...', 'Authorising with UPI PIN...', 'Mandate registered']
      : ['Opening bank authorisation page...', 'Verifying account details...', 'Authenticating with net banking...', 'Mandate submitted for registration'];

    for (let i = 0; i < steps.length; i++) {
      setAuthStep(i);
      await new Promise(resolve => setTimeout(resolve, 700));
    }

    if (isFallback) {
      await onUpdate({
        mandate_fallback_rail: rail,
        mandate_fallback_reference: rail === 'NACH' ? mandateDetails.nach.umrn : mandateDetails.upi.umn,
        mandate_fallback_status: rail === 'NACH' ? 'pending_activation' : 'active',
      } as any);
      setPhase('done');
    } else {
      await onUpdate({
        mandate_primary_rail: rail,
        mandate_primary_reference: rail === 'UPI Autopay' ? mandateDetails.upi.umn : mandateDetails.nach.umrn,
        mandate_primary_status: rail === 'UPI Autopay' ? 'active' : 'pending_activation',
        mandate_max_debit: rail === 'UPI Autopay' ? upiCap : nachCap,
      } as any);
      setPhase('primary_done');
    }
    setAuthStep(0);
  };

  const railCard = (rail: MandateRail) => {
    const isUpi = rail === 'UPI Autopay';
    const selected = primaryRail === rail;
    return (
      <button
        key={rail}
        type="button"
        onClick={() => setPrimaryRail(rail)}
        className={`text-left border-2 rounded-xl p-5 transition-all ${
          selected
            ? 'border-[#11287c] bg-blue-50 ring-2 ring-[#11287c] ring-offset-2 shadow-lg'
            : 'border-gray-200 bg-white hover:border-[#28B2B6] hover:shadow'
        }`}
      >
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{isUpi ? '📲' : '🏦'}</span>
            <h4 className="font-bold text-gray-900">{rail}</h4>
          </div>
          {isUpi && <span className="text-[10px] bg-[#28B2B6] text-white px-2 py-0.5 rounded-full font-semibold">RECOMMENDED</span>}
        </div>
        <p className="text-xs text-gray-600 mb-3">
          {isUpi
            ? 'Same-day authorisation in the borrower\'s UPI app. Debits presented daily in the post-peak execution window.'
            : 'e-NACH authorisation through net banking or debit card. Activation completes on T+1; presented as an arrears sweep.'}
        </p>
        <ul className="text-xs space-y-1 text-gray-700">
          <li>• Frequency: {isUpi ? mandateDetails.upi.frequency : mandateDetails.nach.frequency}</li>
          <li>• Cap per debit: {formatINR(isUpi ? upiCap : nachCap)}</li>
          <li>• Activation: {isUpi ? 'Instant' : 'T+1 banking day'}</li>
          <li>• Debit type: {isUpi ? 'Variable, within cap' : mandateDetails.nach.debitType}</li>
        </ul>
      </button>
    );
  };

  const authSteps = primaryRail === 'UPI Autopay'
    ? ['Opening UPI app...', 'Reviewing mandate details...', 'Authorising with UPI PIN...', 'Mandate registered']
    : ['Opening bank authorisation page...', 'Verifying account details...', 'Authenticating with net banking...', 'Mandate submitted'];

  return (
    <div>
      <StepNarration
        step={5}
        title="Repayment Mandate"
        description="The daily instalment is collected on a standing mandate, not by a field agent. The borrower authorises a UPI Autopay mandate as the primary rail, and a NACH mandate is registered alongside it as the fallback used to sweep arrears. Both are registered as variable-amount, as-presented mandates so that no-due days can be skipped and missed instalments can be caught up without re-papering the mandate."
        icon="🔐"
        color="purple"
        totalSteps={7}
      />

      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Mandate Setup</h2>
        <p className="text-sm text-gray-600 mt-1">
          Daily instalment {formatINR(dailyInstalment)} · collected on every collection day
        </p>
      </div>

      {phase === 'choose' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Choose the primary collection rail</h3>
            <p className="text-sm text-gray-600 mb-4">The other rail is registered as the fallback in the next step.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {railCard('UPI Autopay')}
              {railCard('NACH')}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Mandate the borrower is authorising</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="p-3 bg-gray-50 rounded border border-gray-200">
                <p className="text-xs text-gray-500">Payee</p>
                <p className="font-medium text-gray-900">Kaleidofin Capital (KCPL)</p>
              </div>
              <div className="p-3 bg-gray-50 rounded border border-gray-200">
                <p className="text-xs text-gray-500">Purpose</p>
                <p className="font-medium text-gray-900">Daily instalment — vendor term loan</p>
              </div>
              <div className="p-3 bg-gray-50 rounded border border-gray-200">
                <p className="text-xs text-gray-500">Amount per debit</p>
                <p className="font-medium text-gray-900">
                  {formatINR(dailyInstalment)} <span className="text-xs text-gray-500">(variable, capped at {formatINR(primaryRail === 'UPI Autopay' ? upiCap : nachCap)})</span>
                </p>
              </div>
              <div className="p-3 bg-gray-50 rounded border border-gray-200">
                <p className="text-xs text-gray-500">Frequency</p>
                <p className="font-medium text-gray-900">As presented — max one debit per day</p>
              </div>
              <div className="p-3 bg-gray-50 rounded border border-gray-200">
                <p className="text-xs text-gray-500">Validity</p>
                <p className="font-medium text-gray-900">{mandateDetails.upi.validity} (tenor + buffer)</p>
              </div>
              <div className="p-3 bg-gray-50 rounded border border-gray-200">
                <p className="text-xs text-gray-500">Execution window</p>
                <p className="font-medium text-gray-900">{mandateDetails.upi.executionWindow}</p>
              </div>
            </div>
            <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-xs text-amber-900">
                <strong>Why a cap above the instalment:</strong> the mandate is registered at {formatINR(primaryRail === 'UPI Autopay' ? upiCap : nachCap)} per debit so a
                missed day can be swept together with the current day's instalment. The borrower is notified before every debit and never
                pays more than the amount shown in that notification.
              </p>
            </div>
          </div>

          <div className="flex justify-between">
            <Button variant="outline" onClick={onBack} className="px-6">Back</Button>
            <Button
              onClick={() => runAuthorisation(primaryRail, false)}
              className="bg-[#11287c] hover:bg-[#1e3a8a] text-white px-8 py-2"
            >
              Authorise {primaryRail} Mandate
            </Button>
          </div>
        </div>
      )}

      {(phase === 'authorising' || phase === 'fallback_authorising') && (
        <div className="bg-white p-10 rounded-lg shadow-sm text-center">
          <div className="max-w-sm mx-auto">
            <div className="animate-spin rounded-full h-14 w-14 border-b-2 border-[#11287c] mx-auto mb-6"></div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              {phase === 'fallback_authorising' ? `Registering ${fallbackRail} fallback...` : `Authorising ${primaryRail}...`}
            </h3>
            <div className="space-y-2 text-left">
              {authSteps.map((step, i) => (
                <div key={i} className={`flex items-center gap-3 p-2 rounded ${i <= authStep ? 'bg-teal-50' : 'opacity-40'}`}>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] text-white ${i < authStep ? 'bg-green-500' : i === authStep ? 'bg-[#28B2B6]' : 'bg-gray-300'}`}>
                    {i < authStep ? '✓' : i + 1}
                  </div>
                  <span className="text-sm text-gray-700">{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {(phase === 'primary_done' || phase === 'done') && (
        <div className="space-y-6">
          <div className="bg-green-50 border-2 border-green-300 p-6 rounded-xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white text-2xl">✓</div>
              <div>
                <h3 className="text-xl font-bold text-green-900">{primaryRail} mandate active</h3>
                <p className="text-sm text-green-800">
                  {primaryRail === 'UPI Autopay'
                    ? `UMN ${mandateDetails.upi.umn} · ${mandateDetails.upi.handle}`
                    : `UMRN ${mandateDetails.nach.umrn}`}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-lg shadow-sm border-l-4 border-[#11287c]">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-900">📲 UPI Autopay</h4>
                <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                  primaryRail === 'UPI Autopay' ? 'bg-green-100 text-green-800' : phase === 'done' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                }`}>
                  {primaryRail === 'UPI Autopay' ? 'PRIMARY · ACTIVE' : phase === 'done' ? 'FALLBACK · ACTIVE' : 'NOT REGISTERED'}
                </span>
              </div>
              <dl className="text-xs space-y-1.5 text-gray-700">
                <div className="flex justify-between"><dt className="text-gray-500">UMN</dt><dd className="font-medium">{mandateDetails.upi.umn}</dd></div>
                <div className="flex justify-between"><dt className="text-gray-500">Cap per debit</dt><dd className="font-medium">{formatINR(upiCap)}</dd></div>
                <div className="flex justify-between"><dt className="text-gray-500">Execution window</dt><dd className="font-medium">{mandateDetails.upi.executionWindow}</dd></div>
                <div className="flex justify-between"><dt className="text-gray-500">Pre-debit notice</dt><dd className="font-medium">{mandateDetails.upi.preDebitNotification}</dd></div>
                <div className="flex justify-between"><dt className="text-gray-500">Retry policy</dt><dd className="font-medium">1 execution + up to 3 retries</dd></div>
              </dl>
            </div>

            <div className="bg-white p-5 rounded-lg shadow-sm border-l-4 border-[#28B2B6]">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-900">🏦 NACH</h4>
                <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                  primaryRail === 'NACH' ? 'bg-green-100 text-green-800' : phase === 'done' ? 'bg-teal-100 text-teal-800' : 'bg-gray-100 text-gray-600'
                }`}>
                  {primaryRail === 'NACH' ? 'PRIMARY · ACTIVE' : phase === 'done' ? 'FALLBACK · T+1 ACTIVATION' : 'NOT REGISTERED'}
                </span>
              </div>
              <dl className="text-xs space-y-1.5 text-gray-700">
                <div className="flex justify-between"><dt className="text-gray-500">UMRN</dt><dd className="font-medium">{mandateDetails.nach.umrn}</dd></div>
                <div className="flex justify-between"><dt className="text-gray-500">Debit type</dt><dd className="font-medium">{mandateDetails.nach.debitType} · {formatINR(nachCap)}</dd></div>
                <div className="flex justify-between"><dt className="text-gray-500">Frequency</dt><dd className="font-medium">{mandateDetails.nach.frequency}</dd></div>
                <div className="flex justify-between"><dt className="text-gray-500">Used for</dt><dd className="font-medium text-right">Arrears sweep</dd></div>
                <div className="flex justify-between"><dt className="text-gray-500">Return cycle</dt><dd className="font-medium">{mandateDetails.nach.settlement}</dd></div>
              </dl>
            </div>
          </div>

          {phase === 'primary_done' && (
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Register the fallback rail</h3>
              <p className="text-sm text-gray-600 mb-4">
                Two rails on one loan: {primaryRail} carries the daily instalment, {fallbackRail} carries the catch-up sweep when a day's
                attempts are exhausted. Registering both at onboarding avoids a second borrower touchpoint later, when the borrower is
                already in arrears and hardest to reach.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={() => runAuthorisation(fallbackRail, true)}
                  className="bg-[#28B2B6] hover:bg-[#1f9296] text-white px-6 py-2"
                >
                  Register {fallbackRail} Fallback
                </Button>
                <Button variant="outline" onClick={() => setPhase('done')} className="px-6">
                  Skip fallback for now
                </Button>
              </div>
            </div>
          )}

          {phase === 'done' && (
            <>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">How the daily run will work</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
                  {[
                    { t: 'T-1, evening', d: 'Pre-debit notification with tomorrow\'s exact amount, and a link to pause or cancel.' },
                    { t: 'Collection day, 21:30+', d: 'Debit presented after the day\'s trade, inside the permitted post-peak window.' },
                    { t: 'On failure', d: 'Up to 3 retries across the next windows before the day is marked missed.' },
                    { t: 'Weekly', d: 'Unrecovered instalments swept together on the NACH fallback, within the cap.' },
                  ].map((item, i) => (
                    <div key={i} className="p-3 bg-gray-50 rounded border border-gray-200">
                      <p className="font-semibold text-[#11287c] mb-1">{item.t}</p>
                      <p className="text-gray-700">{item.d}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded text-xs text-blue-900">
                  <strong>No-due days are a product feature, not a rail feature.</strong> Both mandates are registered as
                  "as presented" rather than a fixed daily frequency, so the weekly no-due day and public holidays are simply days on
                  which nothing is presented.
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={onBack} className="px-6">Back</Button>
                <Button onClick={onNext} className="bg-[#11287c] hover:bg-[#1e3a8a] text-white px-8 py-2">
                  Continue to Disbursement
                </Button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
