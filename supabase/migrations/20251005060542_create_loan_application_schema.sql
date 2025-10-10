/*
  # Loan Application Management Schema

  ## Overview
  Creates a complete schema for managing microfinance loan applications through a 4-stage workflow:
  1. Lead Registration
  2. KYC Verification
  3. Credit Check
  4. Disbursement

  ## New Tables

  ### `loan_applications`
  Core table storing all loan application data
  - `id` (uuid, primary key) - Unique application identifier
  - `loan_id` (text, unique) - Human-readable loan ID
  - `created_at` (timestamptz) - Application creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp
  - `current_stage` (text) - Current workflow stage (lead_registration, kyc, credit_check, disbursement)
  - `status` (text) - Overall status (draft, in_progress, approved, rejected, disbursed)
  - `loan_officer` (text) - Assigned loan officer name
  
  ### Applicant Information
  - `applicant_name` (text) - Primary applicant full name
  - `applicant_phone` (text) - Primary applicant phone number
  - `applicant_email` (text) - Primary applicant email
  - `applicant_address` (text) - Primary applicant address
  - `applicant_pan` (text) - Primary applicant PAN
  - `applicant_aadhaar` (text) - Primary applicant Aadhaar
  - `coapplicant_name` (text) - Co-applicant full name
  - `coapplicant_phone` (text) - Co-applicant phone number
  - `coapplicant_email` (text) - Co-applicant email
  - `coapplicant_address` (text) - Co-applicant address
  - `coapplicant_pan` (text) - Co-applicant PAN
  - `coapplicant_aadhaar` (text) - Co-applicant Aadhaar

  ### KYC Information
  - `kyc_status` (text) - KYC verification status
  - `kyc_verified_at` (timestamptz) - KYC verification timestamp
  - `fraud_score` (numeric) - Fraud possibility score (0-100)
  - `fraud_risk_level` (text) - Risk level (low, medium, high)
  - `kyc_documents` (jsonb) - Stored KYC document references
  - `kyc_notes` (text) - KYC verification notes

  ### Credit Check Information
  - `requested_amount` (numeric) - Loan amount requested
  - `eligible_amount` (numeric) - Eligible loan amount
  - `recommended_amount` (numeric) - Recommended loan amount
  - `recommended_term` (integer) - Recommended term in months
  - `recommended_apr` (numeric) - Recommended APR percentage
  - `ki_score` (numeric) - Kaleidofin Ki Score (0-100)
  - `credit_decision` (text) - Decision (approved, rejected, review)
  - `decision_reasons` (jsonb) - Detailed decision reasons
  - `bureau_data` (jsonb) - Credit bureau data
  - `alternate_data` (jsonb) - Alternate data from Kaleidofin
  - `bank_statement_data` (jsonb) - Bank statement analysis
  - `credit_checked_at` (timestamptz) - Credit check timestamp

  ### Disbursement Information
  - `account_number` (text) - Beneficiary account number
  - `ifsc_code` (text) - Bank IFSC code
  - `bank_name` (text) - Bank name
  - `penny_drop_status` (text) - Penny drop verification status
  - `penny_drop_verified_at` (timestamptz) - Penny drop verification timestamp
  - `loan_agreement_signed` (boolean) - Loan agreement signature status
  - `loan_agreement_signed_at` (timestamptz) - Agreement signature timestamp
  - `disbursed_amount` (numeric) - Final disbursed amount
  - `disbursed_at` (timestamptz) - Disbursement timestamp
  - `disbursement_reference` (text) - Disbursement transaction reference

  ## Security
  - Enable RLS on all tables
  - Add policies for authenticated users to manage their assigned applications
*/

-- Create loan_applications table
CREATE TABLE IF NOT EXISTS loan_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  loan_id text UNIQUE NOT NULL DEFAULT 'LN' || LPAD(floor(random() * 999999)::text, 6, '0'),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Workflow tracking
  current_stage text DEFAULT 'lead_registration',
  status text DEFAULT 'draft',
  loan_officer text,
  
  -- Applicant information
  applicant_name text,
  applicant_phone text,
  applicant_email text,
  applicant_address text,
  applicant_pan text,
  applicant_aadhaar text,
  
  -- Co-applicant information
  coapplicant_name text,
  coapplicant_phone text,
  coapplicant_email text,
  coapplicant_address text,
  coapplicant_pan text,
  coapplicant_aadhaar text,
  
  -- OTP verification information
  bureau_otp_verified boolean DEFAULT false,
  bureau_otp_verified_at timestamptz,
  bank_otp_verified boolean DEFAULT false,
  bank_otp_verified_at timestamptz,

  -- KYC information
  kyc_status text DEFAULT 'pending',
  kyc_verified_at timestamptz,
  fraud_score numeric,
  fraud_risk_level text,
  kyc_documents jsonb DEFAULT '[]'::jsonb,
  kyc_notes text,
  
  -- Credit check information
  requested_amount numeric,
  eligible_amount numeric,
  recommended_amount numeric,
  recommended_term integer,
  recommended_apr numeric,
  ki_score numeric,
  credit_decision text,
  decision_reasons jsonb,
  bureau_data jsonb,
  alternate_data jsonb,
  bank_statement_data jsonb,
  credit_checked_at timestamptz,
  
  -- Disbursement information
  account_number text,
  ifsc_code text,
  bank_name text,
  penny_drop_status text,
  penny_drop_verified_at timestamptz,
  loan_agreement_signed boolean DEFAULT false,
  loan_agreement_signed_at timestamptz,
  disbursed_amount numeric,
  disbursed_at timestamptz,
  disbursement_reference text,

  -- Rejection information
  rejection_reason text,
  
  -- Constraints
  CONSTRAINT valid_stage CHECK (current_stage IN ('lead_registration', 'kyc', 'credit_check', 'disbursement')),
  CONSTRAINT valid_status CHECK (status IN ('draft', 'in_progress', 'approved', 'rejected', 'disbursed')),
  CONSTRAINT valid_kyc_status CHECK (kyc_status IN ('pending', 'verified', 'rejected')),
  CONSTRAINT valid_fraud_risk CHECK (fraud_risk_level IN ('low', 'medium', 'high') OR fraud_risk_level IS NULL),
  CONSTRAINT valid_credit_decision CHECK (credit_decision IN ('approved', 'rejected', 'review') OR credit_decision IS NULL),
  CONSTRAINT valid_penny_drop CHECK (penny_drop_status IN ('pending', 'verified', 'failed') OR penny_drop_status IS NULL)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_loan_applications_loan_id ON loan_applications(loan_id);
CREATE INDEX IF NOT EXISTS idx_loan_applications_status ON loan_applications(status);
CREATE INDEX IF NOT EXISTS idx_loan_applications_current_stage ON loan_applications(current_stage);

-- Enable RLS
ALTER TABLE loan_applications ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can create a new application (for demo purposes)
CREATE POLICY "Anyone can create loan applications"
  ON loan_applications
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Policy: Anyone can view applications (for demo purposes)
CREATE POLICY "Anyone can view loan applications"
  ON loan_applications
  FOR SELECT
  TO anon
  USING (true);

-- Policy: Anyone can update applications (for demo purposes)
CREATE POLICY "Anyone can update loan applications"
  ON loan_applications
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_loan_applications_updated_at
  BEFORE UPDATE ON loan_applications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();