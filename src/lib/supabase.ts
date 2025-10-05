import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
};
