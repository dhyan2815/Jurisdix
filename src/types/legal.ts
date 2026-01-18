export type DocumentType = 'contract' | 'case_law';
export type AnalysisType = 'risk_assessment' | 'clause_extraction' | 'precedent_search' | 'legislative_update';
export type ProcessingStatus = 'queued' | 'extracting_text' | 'analyzing' | 'completed' | 'failed';

export interface LegalDocument {
  id: string;
  document_id: string;
  document_type: DocumentType;
  client_name: string;
  client_email: string;
  case_id?: string;
  jurisdiction?: string;
  analysis_types: AnalysisType[];
  file_name?: string;
  file_url?: string;
  status: ProcessingStatus;
  created_at: string;
  completed_at?: string;
  results?: AnalysisResults;
}

export interface ExtractedClause {
  id: string;
  clause_type: string;
  content: string;
  page_number: number;
  risk_level: 'low' | 'medium' | 'high' | 'critical';
}

export interface PrecedentCase {
  id: string;
  case_name: string;
  citation: string;
  relevance_score: number;
  summary: string;
  jurisdiction: string;
  year: number;
}

export interface ComplianceFlag {
  id: string;
  category: string;
  description: string;
  severity: 'info' | 'warning' | 'critical';
  recommendation: string;
}

export interface AnalysisResults {
  executive_summary: string;
  risk_score: number;
  confidence_score: number;
  compliance_flags: ComplianceFlag[];
  extracted_clauses: ExtractedClause[];
  precedent_cases: PrecedentCase[];
  recommended_actions: string[];
  processing_time_seconds: number;
}

export interface UploadFormData {
  document_id: string;
  document_type: DocumentType;
  client_name: string;
  client_email: string;
  case_id: string;
  jurisdiction: string;
  analysis_types: AnalysisType[];
  file?: File;
  file_url?: string;
}

// ============================================
// N8N Workflow Output Types
// ============================================

// Contract Analysis Output from n8n
export interface N8NContractClause {
  clause_type: string;
  section: string;
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  clause_text: string;
  risk_score: number;
  key_concerns: string;
  suggested_language: string;
}

export interface N8NContractOutput {
  output: {
    analysis_summary: string;
    risk_score: number;
    precedent_cases: string[];
    extracted_clauses: N8NContractClause[];
    compliance_flags: string[];
    processing_time?: number;
    confidence_score: number;
    recommended_action: string;
    comparable_firm_cases: string[];
  };
}

// Legal Research Output from n8n
export interface N8NCaseAnalysis {
  citation: string;
  authority_level: 'BINDING' | 'PERSUASIVE' | 'SECONDARY';
  applicability_score: number;
  holding: string;
  applicability_to_our_case: string;
}

export interface N8NLegislativeAlert {
  statute: string;
  impact: string;
}

export interface N8NLegalResearchOutput {
  output: {
    research_summary: string;
    case_analysis: N8NCaseAnalysis[];
    legislative_alert: N8NLegislativeAlert;
    recommendation: string;
  };
}

// Union type for n8n responses
export type N8NWorkflowOutput = N8NContractOutput | N8NLegalResearchOutput;
