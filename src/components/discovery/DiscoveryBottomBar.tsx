import { useState } from "react";
import { cn } from "@/lib/utils";
import { Clock, AlertCircle } from "lucide-react";
import { STEPS, useDiscovery } from "./DiscoveryContext";
import { getStepConfig, getRemainingMinutes } from "./discovery-config";
import { triggerAchievement } from "@/components/ui/AchievementToast";
import { incrementSessionStat } from "@/hooks/use-session-stats";
import { playStepDing, playCaseComplete } from "@/lib/sounds";
import { ConfettiBurst } from "@/components/ui/ConfettiBurst";
import { addXP, XP_REWARDS } from "@/lib/xp";
import { syncStepToCase, syncDiscoveryComplete } from "@/lib/discovery-sync";
import { getRiskLabel } from "@/lib/risk";

interface Props {
  onTransition: (message: string, nextStep: number) => void;
}

function getRequiredFieldValue(data: any, key: string): boolean {
  if (key.startsWith("riskQ")) {
    const qNum = key.replace("riskQ", "");
    return !!data.riskAnswers?.[`q${qNum}`];
  }
  if (key === "primaryGoals") return data.primaryGoals?.length > 0;
  const val = data[key];
  if (typeof val === "string") return val.trim().length > 0;
  if (typeof val === "number") return val > 0;
  return !!val;
}

export function DiscoveryBottomBar({ onTransition }: Props) {
  const { currentStep, setCurrentStep, markStepComplete, completedSteps, data } = useDiscovery();
  const [showMissing, setShowMissing] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const config = getStepConfig(currentStep);
  const remainingMin = getRemainingMinutes(completedSteps, currentStep);

  // Check required fields
  const missingFields = config.requiredFields.filter(
    (f) => !getRequiredFieldValue(data, f.key)
  );
  const canContinue = missingFields.length === 0;

  // Check if all previous steps are consecutively completed (streak)
  const hasStreak = (() => {
    for (let i = 1; i < currentStep; i++) {
      if (!completedSteps.has(i)) return false;
    }
    return currentStep > 1;
  })();

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
    setShowMissing(false);
  };

  const handleContinue = () => {
    if (!canContinue) {
      setShowMissing(true);
      return;
    }
    setShowMissing(false);
    markStepComplete(currentStep);
    incrementSessionStat("stepsCompleted");
    playStepDing();
    addXP(XP_REWARDS.stepCompleted);

    // Sync discovery data → case record
    syncStepToCase(currentStep, data, completedSteps);

    // Confetti at 50% (step 4) and 100% (step 8)
    if (currentStep === Math.floor(STEPS.length / 2) || currentStep === STEPS.length) {
      setShowConfetti(true);
    }

    // Fire achievement toast
    if (currentStep === STEPS.length) {
      // Final step — full completion
      syncDiscoveryComplete(data);
      playCaseComplete();
      addXP(XP_REWARDS.caseHandedOff);
      triggerAchievement("Discovery Complete", "Full client profile built — case is Ready for Handoff!");
      incrementSessionStat("casesTouched");
    } else if (currentStep === 6) {
      // Risk assessment milestone
      const riskLabel = getRiskLabel(data.riskAnswers);
      triggerAchievement(config.achievementTitle, `Risk profile: ${riskLabel}`);
    } else {
      triggerAchievement(config.achievementTitle, `Step ${currentStep} of ${STEPS.length} complete`);
    }

    if (currentStep < STEPS.length) {
      onTransition(config.transitionMessage, currentStep + 1);
    }
  };

  return (
    <div className="border-t border-border bg-card/80 backdrop-blur">
      {showConfetti && <ConfettiBurst onDone={() => setShowConfetti(false)} />}

      {/* Missing fields warning */}
      {showMissing && missingFields.length > 0 && (
        <div className="border-b border-border bg-warning/5 px-6 py-2.5">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 text-warning mt-0.5" />
            <div className="flex-1">
              <p className="text-xs font-medium text-warning mb-1">Required fields missing:</p>
              <div className="flex flex-wrap gap-1.5">
                {missingFields.map((f) => (
                  <button
                    key={f.key}
                    className="text-xs text-warning/80 hover:text-warning underline underline-offset-2 transition-colors"
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Left: Save */}
          <button
            onClick={() => {
              // Data is auto-persisted via DiscoveryContext, this is a user-facing confirmation
              const el = document.activeElement as HTMLElement;
              el?.blur();
              import("@/hooks/use-toast").then(({ toast }) => {
                toast({ title: "✓ Progress saved", description: "Discovery data saved to local storage." });
              });
            }}
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Save Progress
          </button>

          {/* Center: Step dots + time remaining */}
          <div className="flex flex-col items-center gap-1.5">
            <div className="flex items-center gap-2">
              {STEPS.map((step, idx) => {
                const isCompleted = completedSteps.has(step.id);
                const isCurrent = step.id === currentStep;
                return (
                  <div
                    key={step.id}
                    className={cn(
                      "h-2 w-2 rounded-full transition-all",
                      isCurrent
                        ? "bg-primary dot-breathe"
                        : isCompleted
                        ? "bg-primary/50 dot-pulse"
                        : "bg-border"
                    )}
                    style={isCompleted ? { animationDelay: `${idx * 60}ms` } : undefined}
                  />
                );
              })}
            </div>
            {hasStreak && (
              <div className="h-0.5 w-12 rounded-full bg-primary/30 streak-glow" />
            )}
            <span className="flex items-center gap-1 text-[10px] text-muted-foreground/70">
              <Clock className="h-2.5 w-2.5" />
              ~{remainingMin} min remaining
            </span>
          </div>

          {/* Right: Back / Continue */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className="rounded-button border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary transition-colors disabled:opacity-40 disabled:cursor-not-allowed press-scale"
            >
              Back
            </button>
            <button
              onClick={handleContinue}
              className={cn(
                "rounded-button px-5 py-2 text-sm font-medium transition-all press-scale",
                canContinue
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "bg-primary/40 text-primary-foreground/60 cursor-not-allowed"
              )}
            >
              {currentStep === STEPS.length ? "Finish" : "Continue"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
