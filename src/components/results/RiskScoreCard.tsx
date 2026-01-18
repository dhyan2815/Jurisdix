import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface RiskScoreCardProps {
  riskScore: number;
  confidenceScore: number;
}

const getRiskColor = (score: number) => {
  if (score <= 3) return 'text-primary';
  if (score <= 6) return 'text-chart-4';
  return 'text-destructive';
};

const getRiskLabel = (score: number) => {
  if (score <= 3) return 'Low Risk';
  if (score <= 6) return 'Medium Risk';
  return 'High Risk';
};

const getRiskBgColor = (score: number) => {
  if (score <= 3) return 'bg-primary/10';
  if (score <= 6) return 'bg-chart-4/10';
  return 'bg-destructive/10';
};

const RiskScoreCard = ({ riskScore, confidenceScore }: RiskScoreCardProps) => {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Risk Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-2">
            <span className={cn("text-4xl font-bold", getRiskColor(riskScore))}>
              {riskScore.toFixed(1)}
            </span>
            <span className="text-lg text-muted-foreground">/ 10</span>
          </div>
          <div className={cn("mt-2 inline-flex rounded-full px-3 py-1 text-xs font-medium", getRiskBgColor(riskScore), getRiskColor(riskScore))}>
            {getRiskLabel(riskScore)}
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Low</span>
              <span>High</span>
            </div>
            <div className="h-2 w-full rounded-full bg-border overflow-hidden">
              <div
                className={cn("h-full rounded-full transition-all", 
                  riskScore <= 3 ? "bg-primary" : riskScore <= 6 ? "bg-chart-4" : "bg-destructive"
                )}
                style={{ width: `${(riskScore / 10) * 100}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Confidence Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-foreground">
              {(confidenceScore * 100).toFixed(0)}%
            </span>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Analysis reliability based on document quality and completeness
          </p>
          <div className="mt-4">
            <div className="h-2 w-full rounded-full bg-border overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${confidenceScore * 100}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RiskScoreCard;
