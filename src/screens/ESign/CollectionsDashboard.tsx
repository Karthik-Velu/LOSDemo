import React, { useMemo, useState } from "react";
import { type LoanApplication } from "../../lib/supabase";
import { Button } from "../../components/ui/button";
import { StepNarration } from "../../components/StepNarration";
import {
  buildCollectionHistory,
  buildSchedule,
  computeOffer,
  countPayingDays,
  formatINR,
  formatShortDate,
  getDisbursalDate,
  mandateDetails,
  summariseCollections,
  vendorLoanConfig,
  vendorPersona,
  type CollectionRow,
  type CollectionStatus,
} from "../../lib/vendorDemo";

interface CollectionsDashboardProps {
  application: LoanApplication;
  onBack: () => void;
  onRestart: () => void;
}

type Tab = 'loan' | 'portfolio';
type RunPhase = 'idle' | 'notifying' | 'presenting' | 'success' | 'failed' | 'retrying' | 'recovered' | 'swept';

const statusStyles: Record<CollectionStatus, { label: string; chip: string; cell: string }> = {
  success: { label: 'Collected', chip: 'bg-green-100 text-green-800 border-green-200', cell: 'bg-green-500 text-white' },
  retry_success: { label: 'Collected on retry', chip: 'bg-amber-100 text-amber-900 border-amber-200', cell: 'bg-amber-400 text-white' },
  nach_sweep: { label: 'NACH sweep', chip: 'bg-teal-100 text-teal-900 border-teal-200', cell: 'bg-[#28B2B6] text-white' },
  failed: { label: 'Missed — in arrears', chip: 'bg-red-100 text-red-800 border-red-200', cell: 'bg-red-500 text-white' },
  no_due_weekly: { label: 'No-due day', chip: 'bg-gray-100 text-gray-600 border-gray-200', cell: 'bg-gray-200 text-gray-500' },
  holiday: { label: 'Public holiday', chip: 'bg-purple-100 text-purple-800 border-purple-200', cell: 'bg-purple-200 text-purple-700' },
  scheduled: { label: 'Scheduled', chip: 'bg-white text-gray-500 border-gray-200', cell: 'bg-white text-gray-400 border border-gray-200' },
};

export const CollectionsDashboard: React.FC<CollectionsDashboardProps> = ({
  application,
  onBack,
  onRestart,
}) => {
  const [tab, setTab] = useState<Tab>('loan');
  const [runPhase, setRunPhase] = useState<RunPhase>('idle');
  const [forceFailure, setForceFailure] = useState(false);
  const [calendarExpanded, setCalendarExpanded] = useState(false);

  const disbursalDate = useMemo(() => getDisbursalDate(), []);
  const payingDays = useMemo(() => countPayingDays(disbursalDate), [disbursalDate]);

  const amount = application.recommended_amount || vendorLoanConfig.requestedAmount;
  const fallbackOffer = useMemo(() => computeOffer(amount, payingDays), [amount, payingDays]);
  const dailyInstalment = (application as any).daily_instalment || fallbackOffer.dailyInstalment;
  const totalRepayable = (application as any).total_repayable || fallbackOffer.totalRepayable;

  const schedule = useMemo(() => buildSchedule(disbursalDate, dailyInstalment), [disbursalDate, dailyInstalment]);
  const history = useMemo(
    () => buildCollectionHistory(schedule, vendorLoanConfig.dayOnBook),
    [schedule]
  );
  const summary = useMemo(
    () => summariseCollections(history, totalRepayable, vendorLoanConfig.dayOnBook),
    [history, totalRepayable]
  );

  const todayRow = history.find(r => r.index === vendorLoanConfig.dayOnBook);
  const recentRows = history.filter(r => r.index < vendorLoanConfig.dayOnBook).slice(-14).reverse();
  const arrearsRows = history.filter(r => r.status === 'failed');

  const runTodaysCollection = async () => {
    setRunPhase('notifying');
    await new Promise(r => setTimeout(r, 900));
    setRunPhase('presenting');
    await new Promise(r => setTimeout(r, 1200));
    if (forceFailure) {
      setRunPhase('failed');
      await new Promise(r => setTimeout(r, 1200));
      setRunPhase('retrying');
      await new Promise(r => setTimeout(r, 1400));
      setRunPhase('recovered');
    } else {
      setRunPhase('success');
    }
  };

  const sweepArrears = async () => {
    setRunPhase('presenting');
    await new Promise(r => setTimeout(r, 1200));
    setRunPhase('swept');
  };

  const runNarrative: Record<RunPhase, { title: string; detail: string; tone: string }> = {
    idle: {
      title: 'Ready to present today\'s instalment',
      detail: `Pre-debit notification for ${formatINR(dailyInstalment)} was delivered yesterday evening. Presentation opens at 21:30.`,
      tone: 'bg-gray-50 border-gray-200 text-gray-700',
    },
    notifying: {
      title: 'Pre-debit notification confirmed',
      detail: 'Borrower notified 24h ahead with the exact amount and a cancel option — a precondition for presenting the debit.',
      tone: 'bg-blue-50 border-blue-200 text-blue-900',
    },
    presenting: {
      title: 'Presenting debit on UPI Autopay...',
      detail: `${formatINR(dailyInstalment)} requested against mandate ${mandateDetails.upi.umn} inside the 21:30–23:00 window.`,
      tone: 'bg-blue-50 border-blue-200 text-blue-900',
    },
    success: {
      title: `Collected ${formatINR(dailyInstalment)}`,
      detail: 'First attempt, settled instantly. Ledger posted and the borrower has the receipt in their UPI app.',
      tone: 'bg-green-50 border-green-300 text-green-900',
    },
    failed: {
      title: 'Attempt 1 failed — insufficient balance',
      detail: 'Account balance below the instalment. The day is not marked missed yet; three retries remain across the next windows.',
      tone: 'bg-red-50 border-red-300 text-red-900',
    },
    retrying: {
      title: 'Retry queued for the next execution window',
      detail: 'Retry scheduled for 09:00–10:00 tomorrow, after the morning trade float lands in the account.',
      tone: 'bg-amber-50 border-amber-300 text-amber-900',
    },
    recovered: {
      title: `Recovered ${formatINR(dailyInstalment)} on attempt 2`,
      detail: 'Collected in the morning window. Day closes as collected-on-retry; no arrears, no penal charge.',
      tone: 'bg-green-50 border-green-300 text-green-900',
    },
    swept: {
      title: `Swept ${formatINR(summary.arrearsAmount)} on the NACH fallback`,
      detail: `Arrears presented as a single debit within the ${formatINR(mandateDetails.nach.maxDebit)} cap. Returns confirm on T+1.`,
      tone: 'bg-teal-50 border-teal-300 text-teal-900',
    },
  };

  const tile = (label: string, value: string, sub?: string, accent = 'text-[#11287c]') => (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className={`text-2xl font-bold ${accent}`}>{value}</p>
      {sub && <p className="text-xs text-gray-500 mt-1">{sub}</p>}
    </div>
  );

  const calendarDays = calendarExpanded ? history : history.slice(0, 60);

  return (
    <div>
      <StepNarration
        step={7}
        title="Collections & Mandate Tracking"
        description="Disbursal is the start of the work, not the end of it. This is the collections view the lender lives in for the next 120 days: what was presented today, on which rail, what failed and why, what the retry and sweep queue looks like, and how the loan is tracking against its daily schedule. Everything shown here is driven by the mandates registered at onboarding."
        icon="📊"
        color="indigo"
        totalSteps={7}
      />

      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Collections Dashboard</h2>
          <p className="text-sm text-gray-600 mt-1">
            {vendorPersona.name} · Loan {application.loan_id} · Day {vendorLoanConfig.dayOnBook} of {vendorLoanConfig.tenorDays}
          </p>
        </div>
        <div className="flex rounded-lg border border-gray-200 overflow-hidden">
          <button
            onClick={() => setTab('loan')}
            className={`px-5 py-2 text-sm font-semibold transition ${tab === 'loan' ? 'bg-[#11287c] text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
          >
            This Loan
          </button>
          <button
            onClick={() => setTab('portfolio')}
            className={`px-5 py-2 text-sm font-semibold transition ${tab === 'portfolio' ? 'bg-[#11287c] text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
          >
            Collections Ops
          </button>
        </div>
      </div>

      {tab === 'loan' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {tile('Daily instalment', formatINR(dailyInstalment), `${payingDays} paying days`)}
            {tile('Collected to date', formatINR(summary.amountCollected), `${summary.instalmentsCollected} of ${summary.instalmentsDue} instalments`, 'text-green-700')}
            {tile('Outstanding', formatINR(summary.outstanding), `of ${formatINR(totalRepayable)} repayable`)}
            {tile('Collection efficiency', `${summary.collectionEfficiency.toFixed(1)}%`, 'value collected / value due', summary.collectionEfficiency >= 95 ? 'text-green-700' : 'text-amber-600')}
            {tile('First-attempt rate', `${summary.firstAttemptSuccessRate.toFixed(0)}%`, 'collected without retry', 'text-[#28B2B6]')}
            {tile('Arrears', formatINR(summary.arrearsAmount), `${summary.arrearsInstalments} instalment(s) open`, summary.arrearsAmount > 0 ? 'text-red-600' : 'text-green-700')}
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Today's mandate run</h3>
                <p className="text-sm text-gray-600">
                  {todayRow ? formatShortDate(todayRow.date) : ''} · instalment #{todayRow?.instalmentNo ?? '—'} · {formatINR(dailyInstalment)} due
                </p>
              </div>
              <label className="flex items-center gap-2 text-xs text-gray-600 bg-gray-50 px-3 py-2 rounded border border-gray-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={forceFailure}
                  onChange={e => { setForceFailure(e.target.checked); setRunPhase('idle'); }}
                  className="accent-[#11287c]"
                />
                Simulate insufficient balance
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-4">
              {[
                { key: 'notify', label: 'Pre-debit notice', done: runPhase !== 'idle', sub: 'T-1, 24h ahead' },
                { key: 'present', label: 'Debit presented', done: ['presenting', 'success', 'failed', 'retrying', 'recovered', 'swept'].includes(runPhase), sub: '21:30–23:00 window' },
                { key: 'response', label: 'Rail response', done: ['success', 'failed', 'retrying', 'recovered', 'swept'].includes(runPhase), sub: forceFailure ? 'Insufficient balance' : 'Approved' },
                { key: 'post', label: 'Ledger posted', done: ['success', 'recovered', 'swept'].includes(runPhase), sub: 'Instalment closed' },
              ].map(step => (
                <div key={step.key} className={`p-3 rounded-lg border-2 transition-all ${step.done ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
                  <div className="flex items-center gap-2">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] text-white ${step.done ? 'bg-green-500' : 'bg-gray-300'}`}>
                      {step.done ? '✓' : '•'}
                    </div>
                    <p className="text-sm font-semibold text-gray-900">{step.label}</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 ml-7">{step.sub}</p>
                </div>
              ))}
            </div>

            <div className={`p-4 rounded-lg border-2 ${runNarrative[runPhase].tone}`}>
              <p className="font-semibold">{runNarrative[runPhase].title}</p>
              <p className="text-sm mt-1">{runNarrative[runPhase].detail}</p>
            </div>

            <div className="flex flex-wrap gap-3 mt-4">
              <Button
                onClick={runTodaysCollection}
                disabled={['notifying', 'presenting', 'retrying'].includes(runPhase)}
                className="bg-[#11287c] hover:bg-[#1e3a8a] text-white px-6 py-2"
              >
                {runPhase === 'idle' ? "Run today's collection" : 'Re-run'}
              </Button>
              <Button
                onClick={sweepArrears}
                disabled={summary.arrearsAmount === 0 || ['notifying', 'presenting', 'retrying'].includes(runPhase)}
                className="bg-[#28B2B6] hover:bg-[#1f9296] text-white px-6 py-2"
              >
                Sweep arrears on NACH ({formatINR(summary.arrearsAmount)})
              </Button>
              <Button variant="outline" onClick={() => setRunPhase('idle')} className="px-6">Reset</Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Mandate health</h3>
              <div className="space-y-4">
                <div className="p-4 border-l-4 border-[#11287c] bg-gray-50 rounded">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-gray-900">📲 UPI Autopay — primary</p>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-semibold">ACTIVE</span>
                  </div>
                  <dl className="text-xs space-y-1 text-gray-700">
                    <div className="flex justify-between"><dt className="text-gray-500">UMN</dt><dd className="font-medium">{mandateDetails.upi.umn}</dd></div>
                    <div className="flex justify-between"><dt className="text-gray-500">Cap per debit</dt><dd className="font-medium">{formatINR(mandateDetails.upi.maxDebit)}</dd></div>
                    <div className="flex justify-between"><dt className="text-gray-500">Next presentation</dt><dd className="font-medium">Tomorrow 21:30</dd></div>
                    <div className="flex justify-between"><dt className="text-gray-500">Attempts used today</dt><dd className="font-medium">{forceFailure ? '2 of 4' : '1 of 4'}</dd></div>
                  </dl>
                </div>
                <div className="p-4 border-l-4 border-[#28B2B6] bg-gray-50 rounded">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-gray-900">🏦 NACH — fallback</p>
                    <span className="text-xs bg-teal-100 text-teal-800 px-2 py-1 rounded-full font-semibold">ACTIVE</span>
                  </div>
                  <dl className="text-xs space-y-1 text-gray-700">
                    <div className="flex justify-between"><dt className="text-gray-500">UMRN</dt><dd className="font-medium">{mandateDetails.nach.umrn}</dd></div>
                    <div className="flex justify-between"><dt className="text-gray-500">Debit type</dt><dd className="font-medium">{mandateDetails.nach.debitType} · {formatINR(mandateDetails.nach.maxDebit)}</dd></div>
                    <div className="flex justify-between"><dt className="text-gray-500">Used for</dt><dd className="font-medium">Weekly arrears sweep</dd></div>
                    <div className="flex justify-between"><dt className="text-gray-500">Sweeps this loan</dt><dd className="font-medium">1</dd></div>
                  </dl>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-4">
                Mandate revocation by the borrower is visible here the moment it happens — the single highest-frequency reason daily
                collection breaks in production, ahead of insufficient balance.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Repayment calendar</h3>
              <p className="text-xs text-gray-500 mb-4">
                {vendorLoanConfig.tenorDays} calendar days · {payingDays} collection days · weekly no-due day and public holidays skipped
              </p>
              <div className="grid gap-1 mb-4" style={{ gridTemplateColumns: 'repeat(10, minmax(0, 1fr))' }}>
                {calendarDays.map(day => {
                  const isToday = day.index === vendorLoanConfig.dayOnBook;
                  const style = statusStyles[day.status];
                  return (
                    <div
                      key={day.index}
                      title={`${formatShortDate(day.date)} · ${style.label}${day.due ? ` · ${formatINR(day.due)}` : ''}`}
                      className={`aspect-square rounded flex items-center justify-center text-[10px] font-semibold ${style.cell} ${isToday ? 'ring-2 ring-[#11287c] ring-offset-1' : ''}`}
                    >
                      {day.index}
                    </div>
                  );
                })}
              </div>
              <button
                onClick={() => setCalendarExpanded(!calendarExpanded)}
                className="text-xs text-[#11287c] font-semibold hover:underline mb-4"
              >
                {calendarExpanded ? 'Show first 60 days' : `Show all ${vendorLoanConfig.tenorDays} days`}
              </button>
              <div className="flex flex-wrap gap-2 text-[10px]">
                {(['success', 'retry_success', 'nach_sweep', 'failed', 'no_due_weekly', 'holiday', 'scheduled'] as CollectionStatus[]).map(status => (
                  <span key={status} className={`px-2 py-1 rounded border ${statusStyles[status].chip}`}>
                    {statusStyles[status].label}
                  </span>
                ))}
              </div>
              <p className="text-xs text-gray-600 mt-4 italic">
                Slow day? The weekly no-due day is built into the schedule — the instalment is sized on {payingDays} paying days, so
                skipping it never extends the loan.
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily mandate ledger — last 14 days</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[760px]">
                <thead>
                  <tr className="text-left text-xs text-gray-500 border-b border-gray-200">
                    <th className="py-2 pr-4">Date</th>
                    <th className="py-2 pr-4">Instalment</th>
                    <th className="py-2 pr-4">Due</th>
                    <th className="py-2 pr-4">Rail</th>
                    <th className="py-2 pr-4">Attempts</th>
                    <th className="py-2 pr-4">Status</th>
                    <th className="py-2 pr-4">Reference</th>
                    <th className="py-2">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {recentRows.map((row: CollectionRow) => (
                    <tr key={row.index} className="border-b border-gray-100 last:border-b-0">
                      <td className="py-2.5 pr-4 font-medium text-gray-900">{formatShortDate(row.date)}</td>
                      <td className="py-2.5 pr-4 text-gray-600">{row.instalmentNo ? `#${row.instalmentNo}` : '—'}</td>
                      <td className="py-2.5 pr-4 text-gray-900">{row.due ? formatINR(row.due) : '—'}</td>
                      <td className="py-2.5 pr-4 text-gray-600">{row.rail || '—'}</td>
                      <td className="py-2.5 pr-4 text-gray-600">{row.attempts || '—'}</td>
                      <td className="py-2.5 pr-4">
                        <span className={`text-xs px-2 py-1 rounded border ${statusStyles[row.status].chip}`}>
                          {statusStyles[row.status].label}
                        </span>
                      </td>
                      <td className="py-2.5 pr-4 text-xs text-gray-500 font-mono">{row.reference || '—'}</td>
                      <td className="py-2.5 text-xs text-gray-500">{row.time || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {arrearsRows.length > 0 && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm font-semibold text-red-900 mb-1">Open exception</p>
                <p className="text-xs text-red-800">
                  {formatShortDate(arrearsRows[0].date)} · instalment #{arrearsRows[0].instalmentNo} · {formatINR(arrearsRows[0].due)} unrecovered after
                  1 execution and 3 retries. Queued for the NACH sweep; no penal charge is applied on a single missed daily instalment.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {tab === 'portfolio' && (
        <div className="space-y-6">
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900">
            Programme-level view across the daily-EDI book. All figures on this tab are synthetic demo data.
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {tile('Active loans', '1,284', 'daily-EDI book')}
            {tile('Active mandates', '1,301', 'UPI 1,142 · NACH 159', 'text-[#28B2B6]')}
            {tile('Presented today', '1,096', 'after no-due days')}
            {tile('Collected today', '₹3.42L', '1,039 instalments', 'text-green-700')}
            {tile('Collection efficiency', '96.2%', 'rolling 30 days', 'text-green-700')}
            {tile('PAR > 7 days', '2.1%', '27 loans', 'text-amber-600')}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Rail performance</h3>
              <div className="space-y-4">
                {[
                  { rail: 'UPI Autopay', attempted: '1,096', success: 94.8, colour: 'bg-[#11287c]' },
                  { rail: 'UPI Autopay (incl. retries)', attempted: '1,187', success: 97.9, colour: 'bg-[#28B2B6]' },
                  { rail: 'NACH sweep', attempted: '84', success: 88.1, colour: 'bg-purple-500' },
                ].map(row => (
                  <div key={row.rail}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-700">{row.rail}</span>
                      <span className="font-semibold text-gray-900">{row.success}% · {row.attempted} presented</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className={`h-full ${row.colour} rounded-full`} style={{ width: `${row.success}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-5 pt-4 border-t border-gray-100">
                <p className="text-sm font-semibold text-gray-900 mb-2">Failure reasons today</p>
                <ul className="text-xs space-y-1 text-gray-700">
                  <li className="flex justify-between"><span>Insufficient balance</span><span className="font-medium">71%</span></li>
                  <li className="flex justify-between"><span>Mandate revoked by borrower</span><span className="font-medium">9%</span></li>
                  <li className="flex justify-between"><span>Pre-debit notification not delivered</span><span className="font-medium">6%</span></li>
                  <li className="flex justify-between"><span>Technical / bank decline</span><span className="font-medium">14%</span></li>
                </ul>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Presentations by execution window</h3>
              <p className="text-xs text-gray-500 mb-4">Recurring debits can only be presented outside UPI peak hours</p>
              <div className="space-y-3">
                {[
                  { window: 'Before 10:00', count: 214, pct: 20, note: 'morning retries' },
                  { window: '13:00 – 17:00', count: 96, pct: 9, note: 'mid-day catch-up' },
                  { window: 'After 21:30', count: 786, pct: 71, note: 'primary run, post-trade' },
                ].map(w => (
                  <div key={w.window}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-700">{w.window} <span className="text-xs text-gray-400">— {w.note}</span></span>
                      <span className="font-semibold text-gray-900">{w.count}</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-[#11287c] rounded-full" style={{ width: `${w.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-5 p-3 bg-blue-50 border border-blue-200 rounded text-xs text-blue-900">
                The primary run sits after 21:30 deliberately: the vendor's account is at its fullest after the day's trade, and the
                10:00–13:00 and 17:00–21:30 peak bands are closed to recurring debits.
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Exception queue — action required today</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[720px]">
                <thead>
                  <tr className="text-left text-xs text-gray-500 border-b border-gray-200">
                    <th className="py-2 pr-4">Loan</th>
                    <th className="py-2 pr-4">Borrower</th>
                    <th className="py-2 pr-4">Consecutive misses</th>
                    <th className="py-2 pr-4">Arrears</th>
                    <th className="py-2 pr-4">Reason</th>
                    <th className="py-2">Next action</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { id: 'LA-4471', name: 'Vendor A', misses: 1, arrears: 317, reason: 'Insufficient balance', action: 'NACH sweep tonight', tone: 'text-amber-700' },
                    { id: 'LA-4402', name: 'Vendor B', misses: 3, arrears: 951, reason: 'Insufficient balance', action: 'Field call + sweep', tone: 'text-amber-700' },
                    { id: 'LA-4388', name: 'Vendor C', misses: 5, arrears: 1585, reason: 'Mandate revoked', action: 'Re-mandate visit', tone: 'text-red-700' },
                    { id: 'LA-4310', name: 'Vendor D', misses: 2, arrears: 634, reason: 'PDN undelivered', action: 'Re-send notice, re-present', tone: 'text-blue-700' },
                  ].map(row => (
                    <tr key={row.id} className="border-b border-gray-100 last:border-b-0">
                      <td className="py-2.5 pr-4 font-medium text-gray-900">{row.id}</td>
                      <td className="py-2.5 pr-4 text-gray-600">{row.name}</td>
                      <td className="py-2.5 pr-4 text-gray-900">{row.misses}</td>
                      <td className="py-2.5 pr-4 text-gray-900">{formatINR(row.arrears)}</td>
                      <td className="py-2.5 pr-4 text-gray-600">{row.reason}</td>
                      <td className={`py-2.5 font-medium ${row.tone}`}>{row.action}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-500 mt-4">
              Delinquency on a daily product is counted in missed instalments, not in days past due on a monthly cycle. Bureau reporting
              stays monthly; the daily signal is used internally for early action and for limit growth on the next cycle.
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-wrap justify-between gap-3 mt-8">
        <Button variant="outline" onClick={onBack} className="px-6">Back to Disbursement</Button>
        <Button onClick={onRestart} className="bg-[#11287c] hover:bg-[#1e3a8a] text-white px-6">Restart Demo</Button>
      </div>
    </div>
  );
};
