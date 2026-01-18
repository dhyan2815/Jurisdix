import { supabase, TABLES, ContractAnalysisRow, LegalResearchRow } from './supabase';
import { LegalDocument, AnalysisResults } from '@/types/legal';

/**
 * Fetch all documents from both tables and merge them
 */
export async function fetchAllDocuments(): Promise<LegalDocument[]> {
    try {
        console.log('🔍 Fetching documents from Supabase...');

        // Fetch contract analysis documents
        const { data: contractDocs, error: contractError } = await supabase
            .from(TABLES.CONTRACT_ANALYSIS)
            .select('*')
            .order('created_at', { ascending: false });

        if (contractError) {
            console.error('❌ Error fetching contract analysis:', contractError);
        } else {
            console.log('✅ Contract documents fetched:', contractDocs?.length || 0, contractDocs);
        }

        // Fetch legal research documents
        const { data: researchDocs, error: researchError } = await supabase
            .from(TABLES.LEGAL_RESEARCH)
            .select('*')
            .order('created_at', { ascending: false });

        if (researchError) {
            console.error('❌ Error fetching legal research:', researchError);
        } else {
            console.log('✅ Legal research documents fetched:', researchDocs?.length || 0, researchDocs);
        }

        // Transform and merge both types
        const contractDocuments = (contractDocs || []).map(transformContractRow);
        const researchDocuments = (researchDocs || []).map(transformResearchRow);

        console.log('📊 Transformed contract documents:', contractDocuments.length);
        console.log('📊 Transformed research documents:', researchDocuments.length);

        // Combine and sort by created_at
        const allDocuments = [...contractDocuments, ...researchDocuments].sort(
            (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );

        console.log('✅ Total documents returned:', allDocuments.length, allDocuments);

        return allDocuments;
    } catch (error) {
        console.error('Error in fetchAllDocuments:', error);
        return [];
    }
}

/**
 * Transform contract analysis row to LegalDocument
 */
function transformContractRow(row: ContractAnalysisRow): LegalDocument {
    console.log('📄 Transforming contract row:', row);

    // Parse JSON strings if needed
    const parseIfString = (value: string | null) => {
        if (!value) return [];
        try {
            return typeof value === 'string' ? JSON.parse(value) : value;
        } catch {
            // If not JSON, try splitting by comma
            if (typeof value === 'string') {
                return value.split(',').map(s => s.trim()).filter(s => s);
            }
            return [];
        }
    };

    // Handle risk_summary OR analysis_summary
    const executive_summary = row.analysis_summary || (row as any).risk_summary || 'No summary available';

    // Handle risk_level as number OR text ("High", "Medium", "Low")
    let risk_score = 0;
    if (row.risk_level) {
        const parsed = parseFloat(row.risk_level);
        if (!isNaN(parsed)) {
            risk_score = parsed;
        } else {
            // Convert text to number: High=8, Medium=5, Low=2
            const riskMap: Record<string, number> = {
                'high': 8,
                'medium': 5,
                'low': 2,
                'critical': 10
            };
            risk_score = riskMap[row.risk_level.toLowerCase()] || 5;
        }
    }

    const results: AnalysisResults = {
        executive_summary,
        risk_score,
        confidence_score: parseFloat(row.confidence_score || '0.85'),
        compliance_flags: parseIfString(row.compliance_flags || (row as any).compliance_summary).map((flag: string, index: number) => ({
            id: `flag-${index}`,
            category: 'Compliance',
            description: flag,
            severity: 'warning' as const,
            recommendation: 'Review this compliance issue',
        })),
        extracted_clauses: (() => {
            const clausesData = parseIfString(row.extracted_clauses);

            console.log('🔍 Parsing extracted_clauses:', clausesData);

            // If it's an empty array, return empty
            if (!clausesData || clausesData.length === 0) return [];

            // If it's an array of properly structured clause objects from n8n
            if (Array.isArray(clausesData) && clausesData.length > 0 && typeof clausesData[0] === 'object' && clausesData[0].clause_text) {
                console.log('✅ Found structured clause objects:', clausesData.length);
                return clausesData.map((clause: any, index: number) => ({
                    id: `clause-${index}`,
                    clause_type: clause.clause_type || `Clause ${index + 1}`,
                    content: clause.clause_text || clause.content || '',
                    page_number: parseInt(clause.section) || clause.page_number || 1,
                    risk_level: clause.risk_level || 'medium',
                    // Store additional metadata if available
                    ...(clause.risk_score && { risk_score: clause.risk_score }),
                    ...(clause.key_concerns && { key_concerns: clause.key_concerns }),
                    ...(clause.suggested_language && { suggested_language: clause.suggested_language }),
                }));
            }

            // If it's an array of simple objects with different field names
            if (Array.isArray(clausesData) && clausesData.length > 0 && typeof clausesData[0] === 'object') {
                console.log('✅ Found clause objects with alternate structure');
                return clausesData.map((clause: any, index: number) => ({
                    id: `clause-${index}`,
                    clause_type: clause.clause_type || clause.type || clause.name || clause.title || `Clause ${index + 1}`,
                    content: clause.clause_text || clause.content || clause.text || clause.description || '',
                    page_number: clause.page_number || clause.page || parseInt(clause.section) || 1,
                    risk_level: clause.risk_level || clause.risk || 'medium',
                }));
            }

            // If it's a single string (fallback for old data)
            if (typeof clausesData === 'string' || (Array.isArray(clausesData) && clausesData.length === 1 && typeof clausesData[0] === 'string')) {
                const clauseText = typeof clausesData === 'string' ? clausesData : clausesData[0];
                console.log('⚠️ Found single clause text string');
                return [{
                    id: 'clause-0',
                    clause_type: 'Extracted Clause',
                    content: clauseText,
                    page_number: 1,
                    risk_level: 'medium',
                }];
            }

            // If it's an array of strings
            if (Array.isArray(clausesData) && clausesData.every((item: any) => typeof item === 'string')) {
                console.log('⚠️ Found array of clause text strings');
                return clausesData.map((clauseText: string, index: number) => ({
                    id: `clause-${index}`,
                    clause_type: `Clause ${index + 1}`,
                    content: clauseText,
                    page_number: 1,
                    risk_level: 'medium',
                }));
            }

            console.warn('❌ Unknown clause format:', clausesData);
            return [];
        })(),
        precedent_cases: parseIfString(row.precedent_cases).map((caseStr: string, index: number) => ({
            id: `case-${index}`,
            case_name: caseStr,
            citation: caseStr,
            relevance_score: 0.8,
            summary: caseStr,
            jurisdiction: row.jurisdiction || 'Unknown',
            year: new Date().getFullYear(),
        })),
        recommended_actions: row.recommendations ? [row.recommendations] : [],
        processing_time_seconds: 0,
    };

    console.log('✅ Transformed contract results:', results);

    return {
        id: row.id,
        document_id: row.id,
        document_type: 'contract',
        client_name: row.client_name || 'Unknown',
        client_email: row.client_email || '',
        jurisdiction: row.jurisdiction,
        analysis_types: ['risk_assessment', 'clause_extraction'],
        status: 'completed',
        created_at: row.created_at || new Date().toISOString(),
        completed_at: row.created_at || new Date().toISOString(),
        results,
    };
}

/**
 * Transform legal research row to LegalDocument
 */
function transformResearchRow(row: LegalResearchRow): LegalDocument {
    const results: AnalysisResults = {
        executive_summary: row.research_summary || 'No summary available',
        risk_score: row.applicability_score || 0,
        confidence_score: 0.85,
        compliance_flags: [],
        extracted_clauses: [],
        precedent_cases: [],
        recommended_actions: row.recommendations ? [row.recommendations] : [],
        processing_time_seconds: 0,
    };

    return {
        id: row.id.toString(),
        document_id: row.id.toString(),
        document_type: 'case_law',
        client_name: row.client_name || 'Unknown',
        client_email: row.client_email || '',
        jurisdiction: row.jurisdiction,
        analysis_types: ['precedent_search'],
        status: 'completed',
        created_at: row.created_at,
        completed_at: row.created_at,
        results,
    };
}

/**
 * Subscribe to real-time changes
 */
export function subscribeToDocuments(callback: () => void) {
    const contractChannel = supabase
        .channel('contract_analysis_changes')
        .on(
            'postgres_changes',
            {
                event: '*',
                schema: 'public',
                table: TABLES.CONTRACT_ANALYSIS,
            },
            callback
        )
        .subscribe();

    const researchChannel = supabase
        .channel('legal_research_changes')
        .on(
            'postgres_changes',
            {
                event: '*',
                schema: 'public',
                table: TABLES.LEGAL_RESEARCH,
            },
            callback
        )
        .subscribe();

    // Return unsubscribe function
    return () => {
        contractChannel.unsubscribe();
        researchChannel.unsubscribe();
    };
}

/**
 * Delete a document by ID and type
 */
export async function deleteDocument(id: string, documentType: 'contract' | 'case_law') {
    const table = documentType === 'contract' ? TABLES.CONTRACT_ANALYSIS : TABLES.LEGAL_RESEARCH;

    const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting document:', error);
        throw error;
    }
}
