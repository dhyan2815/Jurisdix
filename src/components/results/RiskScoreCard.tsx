import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface RiskScoreCardProps {
  riskScore: number;
  confidenceScore: number;
}

const getRiskColor = (score: number) => {
  if (score <= 3) return 'text-blue-600';
  if (score <= 6) return 'text-yellow-600';
  return 'text-red-600';
};

const getRiskLabel = (score: number) => {
  if (score <= 3) return 'Low Risk';
  if (score <= 6) return 'Medium Risk';
  return 'High Risk';
};

const getRiskBgColor = (score: number) => {
  if (score <= 3) return 'bg-blue-100';
  if (score <= 6) return 'bg-yellow-100';
  return 'bg-red-100';
};

const RiskScoreCard = ({ riskScore, confidenceScore }: RiskScoreCardProps) => {
  // Debug logging
  console.log('🎨 RiskScoreCard - riskScore:', riskScore, 'type:', typeof riskScore);
  console.log('🎨 Progress bar width:', `${(riskScore / 10) * 100}%`);

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
            <div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
              <div
                className={cn("h-full rounded-full transition-all",
                  riskScore <= 3 ? "bg-blue-500" : riskScore <= 6 ? "bg-yellow-500" : "bg-red-500"
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
            <div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
              <div
                className="h-full rounded-full bg-blue-500 transition-all"
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
