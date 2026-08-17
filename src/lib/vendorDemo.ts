/*
 * Daily-EDI street vendor scenario — single source of truth.
 *
 * Every screen in the vendor journey (profile, credit, mandate, disbursement,
 * collections) reads its numbers from here so the demo cannot contradict itself
 * on stage. All values are synthetic.
 *
 * Repayment construct:
 *   - Small-ticket every-day-instalment (EDI) term loan, KES/LKR not applicable — INR only.
 *   - Tenor is a calendar window (120 days). Instalments are collected only on
 *     "collection days": the weekly declared no-due day and public holidays are skipped.
 *   - Daily instalment = total repayable / paying days, so the no-due days are
 *     priced into the instalment rather than extending the loan.
 */

export const VENDOR_SCENARIO_ID = 'vendor_daily_edi';

export const vendorPersona = {
  name: 'Meena R',
  phone: '+91 98400 00000',
  otp: '0000',
  address: 'Stall 27, Pondy Bazaar Market, T. Nagar, Chennai, Tamil Nadu - 600017',
  identityReference: 'DL-DEMO-4417',
  sells: 'Vegetables',
  shopType: 'Street pitch',
  marketName: 'Pondy Bazaar Market, T. Nagar',
  city: 'Chennai',
  yearsInBusiness: 6,
  dailySales: 2200,
  estimatedDailyIncome: 640,
  incomeConfidence: 'High — 6 months of settlement history read from the linked account',
};

export const vendorLoanConfig = {
  requestedAmount: 30000,
  minAmount: 10000,
  maxAmount: 200000,
  tenorDays: 120,
  /** 1 = Monday. The borrower's declared weekly no-due day. */
  noDueWeekday: 1,
  /** Calendar-day offsets (1-based) treated as declared public holidays. */
  publicHolidayOffsets: [12, 45, 88],
  /** Ki Score will not size an instalment above this share of typical daily sales. */
  instalmentCapPctOfSales: 18,
  /** Day of the loan the demo dashboard sits on. */
  dayOnBook: 23,
};

export type DayKind = 'collection' | 'no_due_weekly' | 'holiday';

export interface ScheduleDay {
  /** 1-based calendar day of the loan. */
  index: number;
  date: Date;
  kind: DayKind;
  /** Only set on collection days. */
  instalmentNo?: number;
  amount: number;
}

export interface Offer {
  amount: number;
  apr: number;
  tenorDays: number;
  payingDays: number;
  dailyInstalment: number;
  totalRepayable: number;
  instalmentPctOfSales: number;
  withinCapacity: boolean;
}

const MS_PER_DAY = 24 * 60 * 60 * 1000;

export function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * MS_PER_DAY);
}

export function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

/** Disbursal date used across the demo: places "today" on day 23 of the loan. */
export function getDisbursalDate(today: Date = new Date()): Date {
  return startOfDay(addDays(today, -(vendorLoanConfig.dayOnBook - 1)));
}

function classifyDay(index: number, date: Date): DayKind {
  if (vendorLoanConfig.publicHolidayOffsets.includes(index)) return 'holiday';
  if (date.getDay() === vendorLoanConfig.noDueWeekday) return 'no_due_weekly';
  return 'collection';
}

/** Calendar shape of the loan — independent of the amount. */
export function buildCalendar(disbursalDate: Date, tenorDays = vendorLoanConfig.tenorDays): Array<{ index: number; date: Date; kind: DayKind }> {
  const days: Array<{ index: number; date: Date; kind: DayKind }> = [];
  for (let i = 1; i <= tenorDays; i++) {
    // Day 1 is the first day after disbursal.
    const date = startOfDay(addDays(disbursalDate, i));
    days.push({ index: i, date, kind: classifyDay(i, date) });
  }
  return days;
}

export function countPayingDays(disbursalDate: Date, tenorDays = vendorLoanConfig.tenorDays): number {
  return buildCalendar(disbursalDate, tenorDays).filter(d => d.kind === 'collection').length;
}

/**
 * Pricing. APR is a reducing-balance rate; the 0.55 factor approximates average
 * outstanding under level daily amortisation, so the instalment stays honest
 * rather than quietly implying a flat rate.
 */
export function aprForAmount(amount: number): number {
  if (amount <= 50000) return 30;
  if (amount <= 100000) return 28;
  return 26;
}

export function computeOffer(
  amount: number,
  payingDays: number,
  tenorDays = vendorLoanConfig.tenorDays,
  dailySales = vendorPersona.dailySales,
): Offer {
  const apr = aprForAmount(amount);
  const interest = amount * (apr / 100) * (tenorDays / 365) * 0.55;
  const totalRepayable = Math.round(amount + interest);
  const dailyInstalment = Math.ceil(totalRepayable / payingDays);
  const instalmentPctOfSales = (dailyInstalment / dailySales) * 100;
  return {
    amount,
    apr,
    tenorDays,
    payingDays,
    dailyInstalment,
    totalRepayable,
    instalmentPctOfSales,
    withinCapacity: instalmentPctOfSales <= vendorLoanConfig.instalmentCapPctOfSales,
  };
}

/** Largest ticket whose daily instalment still sits inside the capacity cap. */
export function maxAmountWithinCapacity(payingDays: number, dailySales = vendorPersona.dailySales): number {
  const capInstalment = (dailySales * vendorLoanConfig.instalmentCapPctOfSales) / 100;
  let best = vendorLoanConfig.minAmount;
  for (let amount = vendorLoanConfig.minAmount; amount <= vendorLoanConfig.maxAmount; amount += 500) {
    if (computeOffer(amount, payingDays, vendorLoanConfig.tenorDays, dailySales).dailyInstalment <= capInstalment) {
      best = amount;
    } else {
      break;
    }
  }
  return best;
}

export function buildSchedule(disbursalDate: Date, dailyInstalment: number): ScheduleDay[] {
  let instalmentNo = 0;
  return buildCalendar(disbursalDate).map(day => {
    if (day.kind !== 'collection') return { ...day, amount: 0 };
    instalmentNo += 1;
    return { ...day, instalmentNo, amount: dailyInstalment };
  });
}

export type MandateRail = 'UPI Autopay' | 'NACH';

export type CollectionStatus =
  | 'success'
  | 'retry_success'
  | 'failed'
  | 'nach_sweep'
  | 'no_due_weekly'
  | 'holiday'
  | 'scheduled';

export interface CollectionRow {
  index: number;
  date: Date;
  instalmentNo?: number;
  due: number;
  collected: number;
  rail?: MandateRail;
  attempts: number;
  status: CollectionStatus;
  reference?: string;
  time?: string;
  note?: string;
}

/**
 * Deterministic collection history — the same story every time the demo is run.
 *   day 9  : insufficient balance, recovered on retry in the next execution window
 *   day 17 : two UPI attempts failed, swept the next day on the NACH fallback
 *   day 21 : still open — one instalment in arrears, drives the exception queue
 */
const FAILED_DAYS = [9, 17];
const OPEN_ARREARS_DAYS = [21];

export function buildCollectionHistory(schedule: ScheduleDay[], dayOnBook: number): CollectionRow[] {
  return schedule.map(day => {
    const base: CollectionRow = {
      index: day.index,
      date: day.date,
      instalmentNo: day.instalmentNo,
      due: day.amount,
      collected: 0,
      attempts: 0,
      status: 'scheduled',
    };

    if (day.kind === 'no_due_weekly') return { ...base, status: 'no_due_weekly', note: 'Declared weekly no-due day' };
    if (day.kind === 'holiday') return { ...base, status: 'holiday', note: 'Public holiday — no instalment due' };
    if (day.index >= dayOnBook) return base;

    const ref = `UPI/AP/${String(880000 + day.index * 7)}`;
    if (OPEN_ARREARS_DAYS.includes(day.index)) {
      return {
        ...base,
        rail: 'UPI Autopay',
        attempts: 4,
        status: 'failed',
        time: '21:35',
        note: 'Insufficient balance — 1 execution + 3 retries exhausted, moved to arrears',
      };
    }
    if (day.index === 17) {
      return {
        ...base,
        collected: day.amount,
        rail: 'NACH',
        attempts: 3,
        status: 'nach_sweep',
        reference: `NACH/DR/${String(44000 + day.index)}`,
        time: 'Next day 11:20',
        note: 'UPI attempts failed — recovered on the NACH fallback sweep',
      };
    }
    if (FAILED_DAYS.includes(day.index)) {
      return {
        ...base,
        collected: day.amount,
        rail: 'UPI Autopay',
        attempts: 2,
        status: 'retry_success',
        reference: ref,
        time: '09:12 (retry)',
        note: 'First attempt failed on low balance — recovered in the next execution window',
      };
    }
    return {
      ...base,
      collected: day.amount,
      rail: 'UPI Autopay',
      attempts: 1,
      status: 'success',
      reference: ref,
      time: '21:35',
    };
  });
}

export interface CollectionSummary {
  dayOnBook: number;
  instalmentsDue: number;
  instalmentsCollected: number;
  amountDue: number;
  amountCollected: number;
  arrearsAmount: number;
  arrearsInstalments: number;
  collectionEfficiency: number;
  outstanding: number;
  firstAttemptSuccessRate: number;
}

export function summariseCollections(rows: CollectionRow[], totalRepayable: number, dayOnBook: number): CollectionSummary {
  const settled = rows.filter(r => r.index < dayOnBook && r.due > 0);
  const amountDue = settled.reduce((sum, r) => sum + r.due, 0);
  const amountCollected = settled.reduce((sum, r) => sum + r.collected, 0);
  const arrears = settled.filter(r => r.status === 'failed');
  const firstAttempt = settled.filter(r => r.attempts === 1).length;
  return {
    dayOnBook,
    instalmentsDue: settled.length,
    instalmentsCollected: settled.filter(r => r.collected > 0).length,
    amountDue,
    amountCollected,
    arrearsAmount: arrears.reduce((sum, r) => sum + r.due, 0),
    arrearsInstalments: arrears.length,
    collectionEfficiency: amountDue ? (amountCollected / amountDue) * 100 : 0,
    outstanding: totalRepayable - amountCollected,
    firstAttemptSuccessRate: settled.length ? (firstAttempt / settled.length) * 100 : 0,
  };
}

export const mandateDetails = {
  upi: {
    rail: 'UPI Autopay' as MandateRail,
    handle: 'meena.demo@upidemo',
    umn: 'MNDT/DEMO/8842/UPIAP',
    frequency: 'As presented (max one debit per day)',
    maxDebit: 1000,
    executionWindow: '21:30 – 23:00 IST (post-peak window)',
    preDebitNotification: 'Sent 24h ahead of every collection day',
    validity: '135 days',
    app: 'UPI app (mock hand-off)',
  },
  nach: {
    rail: 'NACH' as MandateRail,
    umrn: 'DEMO0000000148842',
    frequency: 'As and when presented',
    debitType: 'Maximum amount',
    maxDebit: 2000,
    sponsorBank: 'Sponsor bank (demo)',
    presentation: 'Arrears sweep only — presented when UPI attempts are exhausted',
    settlement: 'T+1 return cycle',
  },
};

export function formatINR(value: number): string {
  return `₹${Math.round(value).toLocaleString('en-IN')}`;
}

export function formatShortDate(date: Date): string {
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
}
