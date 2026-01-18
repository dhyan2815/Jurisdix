import { format } from 'date-fns';
import { Eye, FileText, Clock, CheckCircle2, Loader2, AlertCircle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { LegalDocument, ProcessingStatus } from '@/types/legal';
import { cn } from '@/lib/utils';

interface HistoryTableProps {
  documents: LegalDocument[];
  onViewDocument: (document: LegalDocument) => void;
  onDeleteDocument: (id: string) => void;
}

const getStatusBadge = (status: ProcessingStatus) => {
  switch (status) {
    case 'completed':
      return (
        <Badge variant="outline" className="gap-1 border-primary/20 bg-primary/10 text-primary">
          <CheckCircle2 className="h-3 w-3" />
          Completed
        </Badge>
      );
    case 'failed':
      return (
        <Badge variant="destructive" className="gap-1">
          <AlertCircle className="h-3 w-3" />
          Failed
        </Badge>
      );
    default:
      return (
        <Badge variant="secondary" className="gap-1">
          <Loader2 className="h-3 w-3 animate-spin" />
          {status.replace('_', ' ')}
        </Badge>
      );
  }
};

const getRiskBadge = (score: number | undefined) => {
  if (score === undefined) return null;

  if (score <= 3) {
    return <Badge variant="outline" className="bg-primary/10 text-primary">Low ({score.toFixed(1)})</Badge>;
  }
  if (score <= 6) {
    return <Badge variant="secondary">Medium ({score.toFixed(1)})</Badge>;
  }
  return <Badge variant="destructive">High ({score.toFixed(1)})</Badge>;
};

const HistoryTable = ({ documents, onViewDocument, onDeleteDocument }: HistoryTableProps) => {
  if (documents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <FileText className="h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-medium text-foreground">No documents found</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Try adjusting your filters or upload a new document.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Document</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Risk</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="w-[120px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents.map((doc) => (
            <TableRow key={doc.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-foreground">{doc.document_id}</p>
                    {doc.file_name && (
                      <p className="text-xs text-muted-foreground">{doc.file_name}</p>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell>{doc.client_name}</TableCell>
              <TableCell className="capitalize">
                {doc.document_type.replace('_', ' ')}
              </TableCell>
              <TableCell>{getStatusBadge(doc.status)}</TableCell>
              <TableCell>{getRiskBadge(doc.results?.risk_score)}</TableCell>
              <TableCell className="text-muted-foreground">
                {format(new Date(doc.created_at), 'MMM d, yyyy')}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onViewDocument(doc)}
                    disabled={doc.status !== 'completed'}
                    title="View Results"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDeleteDocument(doc.id)}
                    title="Delete Document"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default HistoryTable;
