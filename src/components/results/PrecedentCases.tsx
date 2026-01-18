import { BookOpen, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PrecedentCase } from '@/types/legal';

interface PrecedentCasesProps {
  cases: PrecedentCase[];
}

const PrecedentCases = ({ cases }: PrecedentCasesProps) => {
  if (cases.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Precedent Cases</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No relevant precedent cases found.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Precedent Cases
          <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
            {cases.length}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {cases.map((precedent) => (
          <div
            key={precedent.id}
            className="rounded-lg border border-border p-4 transition-colors hover:bg-accent/50"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h4 className="font-medium text-foreground">{precedent.case_name}</h4>
                <p className="mt-1 text-sm text-muted-foreground">{precedent.citation}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                  {(precedent.relevance_score * 100).toFixed(0)}% match
                </span>
              </div>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">{precedent.summary}</p>
            <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
              <span>{precedent.jurisdiction}</span>
              <span>•</span>
              <span>{precedent.year}</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default PrecedentCases;
