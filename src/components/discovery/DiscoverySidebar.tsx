import { cn } from "@/lib/utils";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { STEPS, useDiscovery } from "./DiscoveryContext";
import { getMissingCount } from "./discovery-utils";
import { getStepConfig } from "./discovery-config";
import { playNavigate } from "@/lib/sounds";

export function DiscoverySidebar() {
  const { currentStep, setCurrentStep, completedSteps, getStepCompletion, data } = useDiscovery();

  return (
    <aside className="w-64 shrink-0 border-r border-border bg-card/50 flex flex-col">
      <div className="p-4 border-b border-border/50">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Discovery Progress
        </h3>
      </div>

      <nav className="flex-1 overflow-y-auto p-2 space-y-0.5">
        {STEPS.map((step) => {
          const isComplete = completedSteps.has(step.id);
          const isCurrent = currentStep === step.id;
          const completion = getStepCompletion(step.id);
          const stepConfig = getStepConfig(step.id);
          const hasRequired = stepConfig.requiredFields.length > 0;
          const missing = hasRequired ? getMissingCount(data, step.id) : 0;
          const total = stepConfig.requiredFields.length;
          // "in progress" = has some data but not complete
          const hasPartialData = completion > 0 && !isComplete;
          // show warning only if this step has been visited (at or before current) and has missing fields
          const showWarning = hasRequired && missing > 0 && !isComplete && step.id <= currentStep;
          const showGood = hasRequired && missing === 0 && !isComplete && step.id < currentStep;

          return (
            <button
              key={step.id}
              onClick={() => { if (step.id !== currentStep) playNavigate(); setCurrentStep(step.id); }}
              className={cn(
                "group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-all",
                isCurrent
                  ? "bg-primary/10 text-primary ring-1 ring-primary/20"
                  : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
              )}
            >
              {/* Step indicator circle */}
              <div
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-all",
                  isComplete && "bg-primary text-primary-foreground",
                  isCurrent && !isComplete && "border-2 border-primary text-primary",
                  !isCurrent && !isComplete && "border border-border text-muted-foreground group-hover:border-foreground/40"
                )}
              >
                {isComplete ? (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="3"
                      strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : step.id}
              </div>

              {/* Step name + status */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span className={cn(
                    "block truncate text-sm font-medium",
                    isCurrent && "text-primary",
                    isComplete && "text-foreground"
                  )}>
                    {step.name}
                  </span>

                  {/* Status badge */}
                  {showWarning && (
                    <span className="flex shrink-0 items-center gap-0.5 text-[10px] font-semibold text-warning">
                      <AlertTriangle className="h-3 w-3" />
                      {missing}
                    </span>
                  )}
                  {showGood && (
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-primary/60" />
                  )}
                </div>

                {/* Progress bar for in-progress steps */}
                {hasPartialData && (
                  <div className="mt-1.5 h-1 w-full rounded-full bg-border overflow-hidden">
                    <div
                      className={cn(
                        "h-1 rounded-full transition-all duration-500",
                        showWarning ? "bg-warning" : "bg-primary"
                      )}
                      style={{ width: `${completion}%` }}
                    />
                  </div>
                )}

                {/* "X of Y fields" for current step */}
                {isCurrent && hasRequired && (
                  <p className={cn(
                    "mt-0.5 text-[10px]",
                    missing > 0 ? "text-warning/80" : "text-primary/70"
                  )}>
                    {total - missing}/{total} fields complete
                  </p>
                )}
              </div>
            </button>
          );
        })}
      </nav>

      {/* Bottom: overall stats */}
      <div className="border-t border-border/50 p-4">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{completedSteps.size} of {STEPS.length} steps done</span>
          <span className="font-mono text-primary">
            {Math.round((completedSteps.size / STEPS.length) * 100)}%
          </span>
        </div>
        <div className="mt-2 h-1 w-full rounded-full bg-border overflow-hidden">
          <div
            className="h-1 rounded-full bg-primary transition-all duration-700"
            style={{ width: `${(completedSteps.size / STEPS.length) * 100}%` }}
          />
        </div>
      </div>
    </aside>
  );
}
