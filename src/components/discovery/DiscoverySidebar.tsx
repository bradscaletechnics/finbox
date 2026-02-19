import { cn } from "@/lib/utils";
import { STEPS, useDiscovery } from "./DiscoveryContext";

export function DiscoverySidebar() {
  const { currentStep, setCurrentStep, completedSteps, getStepCompletion } = useDiscovery();

  return (
    <aside className="w-64 shrink-0 border-r border-border bg-card/50 p-4">
      <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Discovery Progress
      </h3>
      <nav className="space-y-1">
        {STEPS.map((step) => {
          const isComplete = completedSteps.has(step.id);
          const isCurrent = currentStep === step.id;
          const completion = getStepCompletion(step.id);
          const canNavigate = isComplete || step.id <= currentStep;

          return (
            <button
              key={step.id}
              onClick={() => canNavigate && setCurrentStep(step.id)}
              disabled={!canNavigate}
              className={cn(
                "flex w-full items-center gap-3 rounded-button px-3 py-2.5 text-left text-sm transition-colors",
                isCurrent && "bg-primary/10 text-primary",
                !isCurrent && canNavigate && "text-muted-foreground hover:bg-secondary/50 hover:text-foreground",
                !canNavigate && "cursor-not-allowed text-muted-foreground/40"
              )}
            >
              {/* Step indicator */}
              <div
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-medium transition-all duration-400",
                  isComplete && "bg-primary text-primary-foreground",
                  isCurrent && !isComplete && "border-2 border-primary text-primary",
                  !isCurrent && !isComplete && "border border-border text-muted-foreground"
                )}
              >
                {isComplete ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="checkmark-draw" />
                  </svg>
                ) : step.id}
              </div>

              {/* Step name + completion */}
              <div className="flex-1 min-w-0">
                <span className="block truncate font-medium">{step.name}</span>
                {completion > 0 && !isComplete && (
                  <div className="mt-1 h-1 w-full rounded-full bg-border overflow-hidden">
                    <div
                      className="h-1 rounded-full bg-primary transition-all duration-800 ease-out shimmer"
                      style={{ width: `${completion}%` }}
                    />
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
