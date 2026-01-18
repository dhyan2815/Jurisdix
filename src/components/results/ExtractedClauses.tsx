import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ExtractedClause } from '@/types/legal';
import { cn } from '@/lib/utils';

interface ExtractedClausesProps {
  clauses: ExtractedClause[];
}

const getRiskBadgeVariant = (level: ExtractedClause['risk_level']) => {
  switch (level) {
    case 'high':
      return 'destructive';
    case 'medium':
      return 'secondary';
    case 'low':
      return 'outline';
  }
};

const ExtractedClauses = ({ clauses }: ExtractedClausesProps) => {
  if (clauses.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Extracted Clauses</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No clauses extracted from this document.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Extracted Clauses
          <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
            {clauses.length}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[140px]">Type</TableHead>
                <TableHead>Content</TableHead>
                <TableHead className="w-[80px]">Page</TableHead>
                <TableHead className="w-[100px]">Risk</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clauses.map((clause) => (
                <TableRow key={clause.id}>
                  <TableCell className="font-medium">{clause.clause_type}</TableCell>
                  <TableCell className="max-w-md">
                    <p className="line-clamp-2 text-sm text-muted-foreground">
                      {clause.content}
                    </p>
                  </TableCell>
                  <TableCell>{clause.page_number}</TableCell>
                  <TableCell>
                    <Badge variant={getRiskBadgeVariant(clause.risk_level)} className="capitalize">
                      {clause.risk_level}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExtractedClauses;
