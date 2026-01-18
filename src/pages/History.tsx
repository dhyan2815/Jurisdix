import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import HistoryFilters from '@/components/history/HistoryFilters';
import HistoryTable from '@/components/history/HistoryTable';
import AnalysisDashboard from '@/components/results/AnalysisDashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { LegalDocument } from '@/types/legal';
import { useDocuments } from '@/contexts/DocumentContext';
import { toast } from 'sonner';

const History = () => {
  const navigate = useNavigate();
  const { documents, loading, error, refreshDocuments, deleteDocument } = useDocuments();
  const [searchQuery, setSearchQuery] = useState('');
  const [documentType, setDocumentType] = useState('all');
  const [riskLevel, setRiskLevel] = useState('all');
  const [selectedDocument, setSelectedDocument] = useState<LegalDocument | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleDelete = (id: string) => {
    const doc = documents.find(d => d.id === id);
    if (!doc) return;

    // Show confirmation toast with action buttons
    toast(`Delete ${doc.document_id}? This action cannot be undone.`, {
      duration: 5000,
      action: {
        label: 'Delete',
        onClick: async () => {
          try {
            await deleteDocument(id, doc.document_type);
            toast.success(`Deleted ${doc.document_id || 'document'} successfully`);

            // If currently viewing the deleted document, go back to list
            if (selectedDocument?.id === id) {
              setSelectedDocument(null);
            }
          } catch (error) {
            toast.error('Failed to delete document');
          }
        },
      },
      cancel: {
        label: 'Cancel',
        onClick: () => { },
      },
    });
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshDocuments();
      toast.success('Documents refreshed');
    } catch (error) {
      toast.error('Failed to refresh documents');
    } finally {
      setIsRefreshing(false);
    }
  };

  const filteredDocuments = useMemo(() => {
    return documents.filter(doc => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          doc.document_id.toLowerCase().includes(query) ||
          doc.client_name.toLowerCase().includes(query) ||
          (doc.client_email && doc.client_email.toLowerCase().includes(query));
        if (!matchesSearch) return false;
      }

      // Document type filter
      if (documentType !== 'all') {
        if (doc.document_type !== documentType) return false;
      }

      // Risk level filter
      if (riskLevel !== 'all' && doc.results) {
        const score = doc.results.risk_score;
        if (riskLevel === 'low' && score > 3) return false;
        if (riskLevel === 'medium' && (score <= 3 || score > 6)) return false;
        if (riskLevel === 'high' && score <= 6) return false;
      }

      return true;
    });
  }, [documents, searchQuery, documentType, riskLevel]);

  if (selectedDocument) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-8">
          <div className="mx-auto max-w-6xl">
            <Button
              variant="ghost"
              onClick={() => setSelectedDocument(null)}
              className="mb-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to History
            </Button>
            <AnalysisDashboard document={selectedDocument} />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8">
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Document History</h1>
              <p className="mt-1 text-muted-foreground">
                View and manage your analyzed documents
              </p>
            </div>
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>

          {error && (
            <Card className="border-destructive">
              <CardContent className="pt-6">
                <p className="text-destructive">{error}</p>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <HistoryFilters
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                documentType={documentType}
                onDocumentTypeChange={setDocumentType}
                riskLevel={riskLevel}
                onRiskLevelChange={setRiskLevel}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Documents
                <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
                  {filteredDocuments.length}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
                  <p className="ml-4 text-muted-foreground">Loading documents...</p>
                </div>
              ) : (
                <HistoryTable
                  documents={filteredDocuments}
                  onViewDocument={setSelectedDocument}
                  onDeleteDocument={handleDelete}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default History;
