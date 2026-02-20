import { Clock, Info, AlertTriangle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { getStepConfig } from "./discovery-config";
import { getMissingCount } from "./discovery-utils";
import { useDiscovery } from "./DiscoveryContext";

interface Props {
  stepId: number;
}

export function StepGuidanceBanner({ stepId }: Props) {
  const config = getStepConfig(stepId);
  const { data, completedSteps } = useDiscovery();
  const hasRequired = config.requiredFields.length > 0;
  const missing = hasRequired ? getMissingCount(data, stepId) : 0;
  const total = config.requiredFields.length;
  const isComplete = completedSteps.has(stepId);
  const allFilled = missing === 0 && hasRequired;

  return (
    <div className={cn(
      "mb-6 rounded-card border px-5 py-4 transition-colors",
      isComplete
        ? "border-primary/30 bg-primary/5"
        : allFilled
        ? "border-primary/20 bg-primary/5"
        : "border-border bg-card/60"
    )}>
      <div className="flex items-start gap-3">
        <div className={cn(
          "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full",
          isComplete || allFilled ? "bg-primary/20" : "bg-primary/10"
        )}>
          <Info className="h-3.5 w-3.5 text-primary" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center flex-wrap gap-x-3 gap-y-1 mb-1">
            <h3 className="text-sm font-semibold text-foreground">
              Step {config.id}: {config.name}
            </h3>

            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                ~{config.estimatedMinutes} min
              </span>

              {hasRequired && !isComplete && (
                <span className={cn(
                  "flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
                  missing === 0
                    ? "bg-primary/15 text-primary"
                    : missing === total
                    ? "bg-border text-muted-foreground"
                    : "bg-warning/15 text-warning"
                )}>
                  {missing === 0 ? (
                    <><CheckCircle2 className="h-3 w-3" /> All fields complete</>
                  ) : (
                    <><AlertTriangle className="h-3 w-3" /> {missing} of {total} needed</>
                  )}
                </span>
              )}

              {isComplete && (
                <span className="flex items-center gap-1 rounded-full bg-primary/15 px-2 py-0.5 text-xs font-medium text-primary">
                  <CheckCircle2 className="h-3 w-3" /> Complete
                </span>
              )}
            </div>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed">{config.why}</p>
        </div>
      </div>
    </div>
  );
}
