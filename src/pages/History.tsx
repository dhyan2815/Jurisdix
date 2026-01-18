import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import HistoryFilters from '@/components/history/HistoryFilters';
import HistoryTable from '@/components/history/HistoryTable';
import AnalysisDashboard from '@/components/results/AnalysisDashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ArrowLeft, RefreshCw, Info } from 'lucide-react';
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
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<{ id: string; name: string } | null>(null);

  const handleDelete = (id: string) => {
    const doc = documents.find(d => d.id === id);
    if (!doc) return;

    // Open confirmation dialog
    setDocumentToDelete({ id, name: doc.document_id });
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!documentToDelete) return;

    try {
      await deleteDocument(documentToDelete.id, documents.find(d => d.id === documentToDelete.id)?.document_type || 'contract');
      toast.success(`Deleted ${documentToDelete.name} successfully`);

      // If currently viewing the deleted document, go back to list
      if (selectedDocument?.id === documentToDelete.id) {
        setSelectedDocument(null);
      }
    } catch (error) {
      toast.error('Failed to delete document');
    } finally {
      setDeleteDialogOpen(false);
      setDocumentToDelete(null);
    }
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

          {/* Info Banner */}
          {filteredDocuments.length === 0 && !loading && (
            <Card className="border-blue-500/20 bg-blue-500/5">
              <CardContent className="flex items-start gap-3 pt-6">
                <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-blue-900 dark:text-blue-100">
                    Document analysis in progress
                  </p>
                  <p className="mt-1 text-sm text-blue-800 dark:text-blue-200">
                    Submitted documents typically take 1-2 minutes to analyze. Your document will appear here automatically when the analysis is complete. You can refresh the page or wait for the real-time update.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Document?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{documentToDelete?.name}</strong>?
              <br />
              This action cannot be undone and will permanently remove the document from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default History;
