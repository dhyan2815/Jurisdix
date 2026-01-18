import {
    AnalysisResults,
    ComplianceFlag,
    ExtractedClause,
    PrecedentCase,
} from '@/types/legal';

/**
 * Transforms n8n Contract Analysis output to UI AnalysisResults format
 */
function transformContractOutput(output: any): AnalysisResults {
    // Transform compliance flags from string array to structured objects
    const compliance_flags: ComplianceFlag[] = (output['Compliance Flags'] || output.compliance_flags || []).map((flag: string, index: number) => {
        const parts = flag.split(' - ');
        const category = parts[0] || 'Compliance';
        const rest = parts.slice(1).join(' - ');

        let severity: 'info' | 'warning' | 'critical' = 'warning';
        if (flag.toUpperCase().includes('CRITICAL') || flag.toUpperCase().includes('NON-COMPLIANT')) {
            severity = 'critical';
        } else if (flag.toUpperCase().includes('INCOMPLETE') || flag.toUpperCase().includes('MISSING')) {
            severity = 'warning';
        } else if (flag.toUpperCase().includes('COMPLIANT')) {
            severity = 'info';
        }

        return {
            id: `compliance-${index}`,
            category,
            description: rest || flag,
            severity,
            recommendation: 'Review and address this compliance issue',
        };
    });

    // Transform extracted clauses
    const extracted_clauses: ExtractedClause[] = (output['Extracted Clauses'] || output.extracted_clauses || []).map((clause: any, index: number) => ({
        id: `clause-${index}`,
        clause_type: clause.clause_type || clause['Clause Type'] || 'Unknown',
        content: clause.clause_text || clause['Clause Text'] || clause.content || '',
        page_number: parseInt(clause.section?.replace(/\D/g, '') || '0') || 1,
        risk_level: clause.risk_level || clause['Risk Level'] || 'medium',
    }));

    // Transform precedent cases
    const precedent_cases: PrecedentCase[] = (output['Precedent Cases'] || output.precedent_cases || []).map((caseStr: string, index: number) => {
        const citationMatch = caseStr.match(/\(([^)]+)\)/);
        const citation = citationMatch ? citationMatch[1] : caseStr;
        const caseName = caseStr.replace(/\([^)]+\)/, '').trim();

        return {
            id: `case-${index}`,
            case_name: caseName || caseStr,
            citation: citation,
            relevance_score: 0.8,
            summary: `Relevant precedent: ${caseStr}`,
            jurisdiction: 'Unknown',
            year: new Date().getFullYear(),
        };
    });

    const executive_summary =
        output['Analysis Summary'] ||
        output.analysis_summary ||
        output['Executive Summary'] ||
        output.executive_summary ||
        'Analysis completed successfully.';

    const recommended_actions = output['Recommended Action'] || output.recommended_action || output.Recommendations
        ? [output['Recommended Action'] || output.recommended_action || output.Recommendations]
        : ['Review the analysis and take appropriate action'];

    return {
        executive_summary,
        risk_score: output['Risk Score'] || output.risk_score || 0,
        confidence_score: output['Confidence Score'] || output.confidence_score || 0.8,
        compliance_flags,
        extracted_clauses,
        precedent_cases,
        recommended_actions,
        processing_time_seconds: output['Processing Time'] || output.processing_time || 0,
    };
}

/**
 * Transforms n8n Legal Research output to UI AnalysisResults format
 */
function transformLegalResearchOutput(output: any): AnalysisResults {
    // Transform case analysis to precedent cases
    const caseAnalysisData = output['Case Analysis'] || output.case_analysis || [];

    const precedent_cases: PrecedentCase[] = caseAnalysisData.map((caseAnalysis: any, index: number) => ({
        id: `case-${index}`,
        case_name: caseAnalysis.citation?.split(',')[0] || caseAnalysis.Citation?.split(',')[0] || caseAnalysis.citation || 'Unknown Case',
        citation: caseAnalysis.citation || caseAnalysis.Citation || 'No citation',
        relevance_score: ((caseAnalysis['Applicability Score'] || caseAnalysis.applicability_score || 5) / 10),
        summary: caseAnalysis.holding || caseAnalysis.Holding || caseAnalysis['Applicability to Our Case'] || caseAnalysis.applicability_to_our_case || 'No summary available',
        jurisdiction: caseAnalysis['Authority Level'] || caseAnalysis.authority_level || 'Unknown',
        year: new Date().getFullYear(),
    }));

    // Create compliance flag for legislative alert if present
    const compliance_flags: ComplianceFlag[] = [];
    const legislativeAlert = output['Legislative Alert'] || output.legislative_alert;

    if (legislativeAlert && legislativeAlert.statute !== 'UNKNOWN' && legislativeAlert.Statute !== 'UNKNOWN') {
        compliance_flags.push({
            id: 'legislative-alert',
            category: 'Legislative Update',
            description: `${legislativeAlert.statute || legislativeAlert.Statute}: ${legislativeAlert.impact || legislativeAlert.Impact}`,
            severity: 'warning',
            recommendation: 'Review recent legislative changes',
        });
    }

    const executive_summary =
        output['Research Summary'] ||
        output.research_summary ||
        'Legal research completed successfully.';

    const recommended_actions = output.Recommendations || output.recommendation || output.Recommendation
        ? [output.Recommendations || output.recommendation || output.Recommendation]
        : ['Review the research findings and proceed accordingly'];

    // Use Applicability Score as risk_score (1-10 scale)
    const risk_score = output['Applicability Score'] || output.applicability_score || 5;

    return {
        executive_summary,
        risk_score, // This is the applicability score (1-10 scale)
        confidence_score: 0.85,
        compliance_flags,
        extracted_clauses: [],
        precedent_cases,
        recommended_actions,
        processing_time_seconds: 0,
    };
}

/**
 * Main transformer function that detects output type and transforms accordingly
 */
export function transformN8NOutput(n8nResponse: any): AnalysisResults {
    console.log('Raw n8n response:', n8nResponse);

    // Handle different response structures
    let output = n8nResponse;

    // If response is array, get first item
    if (Array.isArray(n8nResponse)) {
        output = n8nResponse[0];
    }

    // If nested in json property
    if (output.json) {
        output = output.json;
    }

    // If nested in data property
    if (output.data) {
        output = output.data;
    }

    // If nested in output property
    if (output.output) {
        output = output.output;
    }

    console.log('Processing output:', output);

    // Check for Legal Research (has Research Summary or Case Analysis or Applicability Score)
    if (output['Research Summary'] || output.research_summary ||
        output['Case Analysis'] || output.case_analysis ||
        output['Applicability Score'] || output.applicability_score ||
        output.Recommendations) {
        console.log('Detected: Legal Research output');
        return transformLegalResearchOutput(output);
    }

    // Check for Contract Analysis (has Analysis Summary or Extracted Clauses)
    if (output['Analysis Summary'] || output.analysis_summary ||
        output['Extracted Clauses'] || output.extracted_clauses ||
        output['Risk Score'] || output.risk_score) {
        console.log('Detected: Contract Analysis output');
        return transformContractOutput(output);
    }

    // Fallback: Try to extract whatever data is available
    console.warn('Unknown n8n output format, attempting generic transformation');

    return {
        executive_summary: output['Research Summary'] || output['Analysis Summary'] || output.research_summary || output.analysis_summary || 'Analysis completed but results format is unexpected.',
        risk_score: output['Risk Score'] || output['Applicability Score'] || output.risk_score || output.applicability_score || 0,
        confidence_score: output['Confidence Score'] || output.confidence_score || 0,
        compliance_flags: [],
        extracted_clauses: [],
        precedent_cases: [],
        recommended_actions: output.Recommendations || output.recommendation ? [output.Recommendations || output.recommendation] : ['Please review the analysis'],
        processing_time_seconds: 0,
    };
}

/**
 * Transforms document type from UI format to n8n Title Case format
 */
export function transformDocumentTypeForN8N(docType: 'contract' | 'case_law'): string {
    const mapping: Record<string, string> = {
        'contract': 'Contract',
        'case_law': 'Case Law',
    };
    return mapping[docType] || docType;
}
