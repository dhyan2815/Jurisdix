import { AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ComplianceFlag } from '@/types/legal';
import { cn } from '@/lib/utils';

interface ComplianceFlagsProps {
  flags: ComplianceFlag[];
}

const getSeverityIcon = (severity: ComplianceFlag['severity']) => {
  switch (severity) {
    case 'critical':
      return <AlertCircle className="h-5 w-5 text-destructive" />;
    case 'warning':
      return <AlertTriangle className="h-5 w-5 text-chart-4" />;
    case 'info':
      return <Info className="h-5 w-5 text-primary" />;
  }
};

const getSeverityBg = (severity: ComplianceFlag['severity']) => {
  switch (severity) {
    case 'critical':
      return 'border-l-destructive bg-destructive/5';
    case 'warning':
      return 'border-l-chart-4 bg-chart-4/5';
    case 'info':
      return 'border-l-primary bg-primary/5';
  }
};

const ComplianceFlags = ({ flags }: ComplianceFlagsProps) => {
  if (flags.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Compliance Flags</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No compliance issues detected.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Compliance Flags
          <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
            {flags.length}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {flags.map((flag) => (
          <div
            key={flag.id}
            className={cn(
              "rounded-lg border-l-4 p-4",
              getSeverityBg(flag.severity)
            )}
          >
            <div className="flex items-start gap-3">
              {getSeverityIcon(flag.severity)}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground">{flag.category}</span>
                  <span className={cn(
                    "rounded-full px-2 py-0.5 text-xs font-medium capitalize",
                    flag.severity === 'critical' && "bg-destructive/10 text-destructive",
                    flag.severity === 'warning' && "bg-chart-4/10 text-chart-4",
                    flag.severity === 'info' && "bg-primary/10 text-primary"
                  )}>
                    {flag.severity}
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{flag.description}</p>
                <p className="mt-2 text-sm text-foreground">
                  <span className="font-medium">Recommendation:</span> {flag.recommendation}
                </p>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default ComplianceFlags;
