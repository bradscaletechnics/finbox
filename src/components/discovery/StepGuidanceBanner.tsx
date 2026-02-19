import { Clock, Info } from "lucide-react";
import { getStepConfig } from "./discovery-config";

interface Props {
  stepId: number;
}

export function StepGuidanceBanner({ stepId }: Props) {
  const config = getStepConfig(stepId);

  return (
    <div className="mb-6 rounded-card border border-border bg-card/60 px-5 py-4">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/15">
          <Info className="h-3.5 w-3.5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <h3 className="text-sm font-semibold text-foreground">
              Step {config.id}: {config.name}
            </h3>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              ~{config.estimatedMinutes} min
            </span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">{config.why}</p>
        </div>
      </div>
    </div>
  );
}
