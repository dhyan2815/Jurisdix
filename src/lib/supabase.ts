import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
        'Missing Supabase environment variables. Please check your .env file.'
    );
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Table names
export const TABLES = {
    CONTRACT_ANALYSIS: 'contract_analysis',
    LEGAL_RESEARCH: 'legal_research',
} as const;

// Type definitions for database tables
export interface ContractAnalysisRow {
    id: string;
    client_name: string | null;
    client_email: string | null;
    document_type: string | null;
    jurisdiction: string | null;
    comparable_firm_cases: string | null;
    confidence_score: string | null;
    recommendations: string | null;
    risk_level: string | null;
    precedent_cases: string | null;
    analysis_summary: string | null;
    compliance_flags: string | null;
    extracted_clauses: string | null;
    created_at: string | null;
}

export interface LegalResearchRow {
    id: number;
    client_name: string | null;
    client_email: string | null;
    document_type: string | null;
    jurisdiction: string | null;
    created_at: string;
    research_summary: string | null;
    recommendations: string | null;
    applicability_score: number | null;
}

// Helper type for unified document view
export type DatabaseRow = ContractAnalysisRow | LegalResearchRow;
