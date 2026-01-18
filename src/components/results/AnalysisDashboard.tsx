import { Clock, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LegalDocument } from '@/types/legal';
import RiskScoreCard from './RiskScoreCard';
import ComplianceFlags from './ComplianceFlags';
import ExtractedClauses from './ExtractedClauses';
import PrecedentCases from './PrecedentCases';
import RecommendedActions from './RecommendedActions';

interface AnalysisDashboardProps {
  document: LegalDocument;
}

const AnalysisDashboard = ({ document }: AnalysisDashboardProps) => {
  const { results } = document;

  if (!results) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">No results available for this document.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {document.document_id}
              </CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                {document.client_name} • {document.client_email} • {document.document_type === 'contract' ? 'Contract' : 'Case Law'}
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              Processed in {results.processing_time_seconds.toFixed(1)}s
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Executive Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Executive Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed text-foreground">{results.executive_summary}</p>
        </CardContent>
      </Card>

      {/* Scores */}
      <RiskScoreCard riskScore={results.risk_score} confidenceScore={results.confidence_score} />

      {/* Compliance Flags */}
      <ComplianceFlags flags={results.compliance_flags} />

      {/* Extracted Clauses */}
      <ExtractedClauses clauses={results.extracted_clauses} />

      {/* Precedent Cases */}
      <PrecedentCases cases={results.precedent_cases} />

      {/* Recommended Actions */}
      <RecommendedActions actions={results.recommended_actions} />
    </div>
  );
};

export default AnalysisDashboard;
