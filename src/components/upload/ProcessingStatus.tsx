import { CheckCircle2, Circle, Loader2, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProcessingStatus as Status } from '@/types/legal';
import { cn } from '@/lib/utils';

interface ProcessingStatusProps {
  status: Status;
  documentId: string;
}

const steps: { status: Status; label: string }[] = [
  { status: 'queued', label: 'Queued' },
  { status: 'extracting_text', label: 'Extracting Text' },
  { status: 'analyzing', label: 'Analyzing Document' },
  { status: 'completed', label: 'Completed' },
];

const getStepIndex = (status: Status) => {
  if (status === 'failed') return -1;
  return steps.findIndex(s => s.status === status);
};

const ProcessingStatus = ({ status, documentId }: ProcessingStatusProps) => {
  const currentIndex = getStepIndex(status);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {status === 'failed' ? (
            <XCircle className="h-5 w-5 text-destructive" />
          ) : status === 'completed' ? (
            <CheckCircle2 className="h-5 w-5 text-primary" />
          ) : (
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
          )}
          Processing: {documentId}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const isComplete = currentIndex > index || status === 'completed';
            const isCurrent = currentIndex === index && status !== 'completed';
            const isFailed = status === 'failed' && currentIndex === index;

            return (
              <div key={step.status} className="flex flex-1 items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors",
                      isComplete && "border-primary bg-primary",
                      isCurrent && "border-primary",
                      isFailed && "border-destructive bg-destructive",
                      !isComplete && !isCurrent && !isFailed && "border-border"
                    )}
                  >
                    {isComplete ? (
                      <CheckCircle2 className="h-5 w-5 text-primary-foreground" />
                    ) : isCurrent ? (
                      <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    ) : isFailed ? (
                      <XCircle className="h-5 w-5 text-destructive-foreground" />
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  <span
                    className={cn(
                      "mt-2 text-xs font-medium",
                      isComplete || isCurrent ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {step.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      "mx-2 h-0.5 flex-1",
                      isComplete ? "bg-primary" : "bg-border"
                    )}
                  />
                )}
              </div>
            );
          })}
        </div>
        {status === 'failed' && (
          <p className="mt-4 text-sm text-destructive">
            An error occurred while processing your document. Please try again.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default ProcessingStatus;
