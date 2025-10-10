import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey && supabaseUrl !== 'undefined' && supabaseAnonKey !== 'undefined');

type Row<T> = T & { id: string; created_at: string; updated_at: string };

function getStore(): Row<LoanApplication>[] {
  try {
    const raw = localStorage.getItem('mock_loan_applications');
    return raw ? (JSON.parse(raw) as Row<LoanApplication>[]) : [];
  } catch {
    return [];
  }
}

function setStore(rows: Row<LoanApplication>[]) {
  try {
    localStorage.setItem('mock_loan_applications', JSON.stringify(rows));
  } catch {}
}

function createMockClient() {
  return {
    from(table: string) {
      if (table !== 'loan_applications') {
        return {
          select: () => ({ maybeSingle: async () => ({ data: null, error: null }) }),
        } as any;
      }
      return {
        select(_fields?: string) {
          let rows = getStore();
          const api = {
            order(_col: string, opts?: { ascending?: boolean }) {
              rows = rows.sort((a, b) =>
                (opts?.ascending ? 1 : -1) * (a.created_at.localeCompare(b.created_at))
              );
              return api;
            },
            limit(_n: number) {
              return api;
            },
            async maybeSingle() {
              const latest = rows[0] ?? null;
              if (latest) {
                // Ensure OTP verification fields are initialized
                latest.bureau_otp_verified = latest.bureau_otp_verified ?? false;
                latest.bank_otp_verified = latest.bank_otp_verified ?? false;
              }
              return { data: latest, error: null } as const;
            },
            async single() {
              const latest = rows[0] ?? null;
              if (latest) {
                // Ensure OTP verification fields are initialized
                latest.bureau_otp_verified = latest.bureau_otp_verified ?? false;
                latest.bank_otp_verified = latest.bank_otp_verified ?? false;
              }
              return { data: latest, error: null } as const;
            },
          };
          return api;
        },
        insert(values: Partial<LoanApplication>[]) {
          const api = {
            select() {
              return {
                async single() {
                  const now = new Date().toISOString();
                  const rows = getStore();
                  const base = values[0] || {};
                  const id = `${Date.now()}`;
                  const loan_id = (base as any).loan_id || `LA-${id.slice(-6)}`;
                  const row = {
                    id,
                    loan_id,
                    created_at: now,
                    updated_at: now,
                    current_stage: 'lead_registration',
                    status: 'draft',
                    loan_officer: 'Rajesh Verma',
                    bureau_otp_verified: false,
                    bank_otp_verified: false,
                    ...base,
                  } as Row<LoanApplication>;
                  rows.unshift(row);
                  setStore(rows);
                  return { data: row, error: null } as const;
                },
              };
            },
          };
          return api as any;
        },
        update(updates: Partial<LoanApplication>) {
          const step1 = {
            eq(_col: string, id: string) {
              const api = {
                select() {
                  return {
                    async single() {
                      const rows = getStore();
                      const idx = rows.findIndex(r => r.id === id);
                      if (idx >= 0) {
                        const next: Row<LoanApplication> = {
                          ...rows[idx],
                          ...updates,
                          updated_at: new Date().toISOString(),
                        };
                        rows[idx] = next;
                        setStore(rows);
                        return { data: next, error: null } as const;
                      }
                      return { data: null, error: { message: 'Not found' } as any } as const;
                    },
                  };
                },
              };
              return api;
            },
          };
          return step1 as any;
        },
      };
    },
  } as const;
}

// Force mock client for demo purposes
export const supabase = createMockClient();

export type LoanApplication = {
  id: string;
  loan_id: string;
  created_at: string;
  updated_at: string;
  current_stage: 'lead_registration' | 'kyc' | 'credit_check' | 'disbursement';
  status: 'draft' | 'in_progress' | 'approved' | 'rejected' | 'disbursed';
  loan_officer?: string;
  applicant_name?: string;
  applicant_phone?: string;
  applicant_email?: string;
  applicant_address?: string;
  applicant_pan?: string;
  applicant_aadhaar?: string;
  demo_scenario_id?: string;
  coapplicant_name?: string;
  coapplicant_phone?: string;
  coapplicant_email?: string;
  coapplicant_address?: string;
  coapplicant_pan?: string;
  coapplicant_aadhaar?: string;
  kyc_status?: string;
  kyc_verified_at?: string;
  fraud_score?: number;
  fraud_risk_level?: 'low' | 'medium' | 'high';
  kyc_documents?: any;
  kyc_notes?: string;
  bureau_otp_verified?: boolean;
  bureau_otp_verified_at?: string;
  bank_otp_verified?: boolean;
  bank_otp_verified_at?: string;
  pan_uploaded?: boolean;
  aadhaar_uploaded?: boolean;
  documents_uploaded_at?: string;
  requested_amount?: number;
  eligible_amount?: number;
  recommended_amount?: number;
  recommended_term?: number;
  recommended_apr?: number;
  ki_score?: number;
  credit_decision?: 'approved' | 'rejected' | 'review';
  decision_reasons?: any;
  bureau_data?: any;
  alternate_data?: any;
  bank_statement_data?: any;
  credit_checked_at?: string;
  account_number?: string;
  ifsc_code?: string;
  bank_name?: string;
  penny_drop_status?: string;
  penny_drop_verified_at?: string;
  loan_agreement_signed?: boolean;
  loan_agreement_signed_at?: string;
  disbursed_amount?: number;
  disbursed_at?: string;
  disbursement_reference?: string;
  rejection_reason?: string;
  reviewer_comments?: string;
  available_bank_accounts?: Array<{
    id: string;
    bank_name: string;
    account_number: string;
    ifsc_code: string;
    account_type: string;
    balance: number;
  }>;
};
