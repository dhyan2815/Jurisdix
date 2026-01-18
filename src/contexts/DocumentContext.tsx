import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { LegalDocument } from '@/types/legal';
import { fetchAllDocuments, subscribeToDocuments, deleteDocument as deleteDocumentFromDB } from '@/lib/supabase-service';

interface DocumentContextType {
    documents: LegalDocument[];
    loading: boolean;
    error: string | null;
    refreshDocuments: () => Promise<void>;
    deleteDocument: (id: string, documentType: 'contract' | 'case_law') => Promise<void>;
}

const DocumentContext = createContext<DocumentContextType | undefined>(undefined);

export const useDocuments = () => {
    const context = useContext(DocumentContext);
    if (!context) {
        throw new Error('useDocuments must be used within DocumentProvider');
    }
    return context;
};

interface DocumentProviderProps {
    children: ReactNode;
}

export const DocumentProvider = ({ children }: DocumentProviderProps) => {
    const [documents, setDocuments] = useState<LegalDocument[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch documents from Supabase
    const refreshDocuments = async () => {
        try {
            setLoading(true);
            setError(null);
            const docs = await fetchAllDocuments();
            setDocuments(docs);
        } catch (err) {
            console.error('Error fetching documents:', err);
            setError('Failed to load documents');
        } finally {
            setLoading(false);
        }
    };

    // Initial fetch
    useEffect(() => {
        refreshDocuments();
    }, []);

    // Subscribe to real-time changes
    useEffect(() => {
        const unsubscribe = subscribeToDocuments(() => {
            console.log('Real-time update detected, refreshing documents...');
            refreshDocuments();
        });

        return unsubscribe;
    }, []);

    // Delete document
    const deleteDocument = async (id: string, documentType: 'contract' | 'case_law') => {
        try {
            await deleteDocumentFromDB(id, documentType);
            // Refresh documents after deletion
            await refreshDocuments();
        } catch (err) {
            console.error('Error deleting document:', err);
            throw err;
        }
    };

    return (
        <DocumentContext.Provider value={{ documents, loading, error, refreshDocuments, deleteDocument }}>
            {children}
        </DocumentContext.Provider>
    );
};
