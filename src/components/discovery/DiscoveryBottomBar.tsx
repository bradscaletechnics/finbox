import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Clock, AlertTriangle, ChevronLeft, ChevronRight, CheckCircle2, Volume2, VolumeX } from "lucide-react";
import { STEPS, useDiscovery } from "./DiscoveryContext";
import { getStepConfig, getRemainingMinutes } from "./discovery-config";
import { getMissingFields } from "./discovery-utils";
import { triggerAchievement } from "@/components/ui/AchievementToast";
import { incrementSessionStat } from "@/hooks/use-session-stats";
import { playStepDing, playCaseComplete, playBlockError, playBack, playNavigate } from "@/lib/sounds";
import { ConfettiBurst } from "@/components/ui/ConfettiBurst";
import { addXP, XP_REWARDS } from "@/lib/xp";
import { syncStepToCase, syncDiscoveryComplete } from "@/lib/discovery-sync";
import { getRiskLabel } from "@/lib/risk";

interface Props {
  onTransition: (message: string, nextStep: number) => void;
}

export function DiscoveryBottomBar({ onTransition }: Props) {
  const {
    currentStep, setCurrentStep, markStepComplete,
    completedSteps, data, highlightMissing, setHighlightMissing,
  } = useDiscovery();

  const [showConfetti, setShowConfetti] = useState(false);
  const [shake, setShake] = useState(false);
  const [muted, setMuted] = useState(() => {
    try { return localStorage.getItem("finbox_sound_step") === "false"; } catch { return false; }
  });

  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    try { localStorage.setItem("finbox_sound_step", next ? "false" : "true"); } catch { /* ignore */ }
  };

  const config = getStepConfig(currentStep);
  const remainingMin = getRemainingMinutes(completedSteps, currentStep);
  const missingFields = getMissingFields(data, currentStep);
  const canContinue = missingFields.length === 0;
  const isFinalStep = currentStep === STEPS.length;

  // Shake animation reset
  useEffect(() => {
    if (!shake) return;
    const t = setTimeout(() => setShake(false), 500);
    return () => clearTimeout(t);
  }, [shake]);

  // Clear highlight once the step has no more missing fields
  useEffect(() => {
    if (highlightMissing && canContinue) setHighlightMissing(false);
  }, [highlightMissing, canContinue, setHighlightMissing]);

  const handleBack = () => {
    if (currentStep > 1) {
      playBack();
      setCurrentStep(currentStep - 1);
    }
  };

  const handleDotClick = (stepId: number) => {
    if (stepId !== currentStep) playNavigate();
    setCurrentStep(stepId);
  };

  const handleContinue = () => {
    if (!canContinue) {
      playBlockError();
      setHighlightMissing(true);
      setShake(true);
      // Scroll to the first missing field
      const firstKey = missingFields[0]?.key;
      if (firstKey) {
        const el = document.getElementById(`field-${firstKey}`);
        el?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    setHighlightMissing(false);
    markStepComplete(currentStep);
    incrementSessionStat("stepsCompleted");
    playStepDing();
    addXP(XP_REWARDS.stepCompleted);
    syncStepToCase(currentStep, data, completedSteps);

    if (currentStep === Math.floor(STEPS.length / 2) || currentStep === STEPS.length) {
      setShowConfetti(true);
    }

    if (isFinalStep) {
      syncDiscoveryComplete(data);
      playCaseComplete();
      addXP(XP_REWARDS.caseHandedOff);
      triggerAchievement("Discovery Complete", "Full client profile built — case is Ready for Handoff!");
      incrementSessionStat("casesTouched");
    } else if (currentStep === 6) {
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
    <div className="border-t border-border bg-card/90 backdrop-blur">
      {showConfetti && <ConfettiBurst onDone={() => setShowConfetti(false)} />}

      {/* Missing fields banner — visible after first Continue attempt */}
      {highlightMissing && missingFields.length > 0 && (
        <div className="border-b border-destructive/20 bg-destructive/5 px-6 py-3">
          <div className="flex items-start gap-2">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
            <div className="flex-1">
              <p className="text-xs font-semibold text-destructive mb-1.5">
                {missingFields.length} required {missingFields.length === 1 ? "field" : "fields"} missing on this step:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {missingFields.map((f) => (
                  <button
                    key={f.key}
                    onClick={() => {
                      const el = document.getElementById(`field-${f.key}`);
                      el?.scrollIntoView({ behavior: "smooth", block: "center" });
                    }}
                    className="rounded-full border border-destructive/40 bg-destructive/10 px-2.5 py-0.5 text-xs font-medium text-destructive transition-colors hover:bg-destructive/20"
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between px-6 py-3 gap-4">
        {/* Left: step info */}
        <div className="flex items-center gap-3 min-w-0">
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground/70 shrink-0">
            <Clock className="h-3 w-3" />
            ~{remainingMin}m left
          </span>
          <button
            onClick={toggleMute}
            title={muted ? "Unmute sounds" : "Mute sounds"}
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-muted-foreground/50 hover:text-muted-foreground transition-colors"
          >
            {muted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
          </button>
          {!canContinue && (
            <span className="hidden sm:flex items-center gap-1 rounded-full bg-warning/10 border border-warning/30 px-2.5 py-0.5 text-xs font-medium text-warning">
              <AlertTriangle className="h-3 w-3" />
              {missingFields.length} field{missingFields.length !== 1 ? "s" : ""} needed
            </span>
          )}
          {canContinue && currentStep > 1 && (
            <span className="hidden sm:flex items-center gap-1 rounded-full bg-primary/10 border border-primary/20 px-2.5 py-0.5 text-xs font-medium text-primary">
              <CheckCircle2 className="h-3 w-3" />
              Step ready
            </span>
          )}
        </div>

        {/* Center: clickable step dots */}
        <div className="flex flex-col items-center gap-1.5 shrink-0">
          <div className="flex items-center gap-1.5">
            {STEPS.map((step) => {
              const isCompleted = completedSteps.has(step.id);
              const isCurrent = step.id === currentStep;
              const stepMissing = getMissingFields(data, step.id).length;
              const hasData = getStepConfig(step.id).requiredFields.length > 0;

              return (
                <button
                  key={step.id}
                  onClick={() => handleDotClick(step.id)}
                  title={`${step.name}${stepMissing > 0 && !isCompleted ? ` — ${stepMissing} field${stepMissing !== 1 ? "s" : ""} needed` : ""}`}
                  className={cn(
                    "relative h-2.5 w-2.5 rounded-full transition-all hover:scale-125",
                    isCurrent ? "bg-primary scale-125 shadow-[0_0_0_2px_hsl(var(--primary)/0.25)]"
                      : isCompleted ? "bg-primary/60"
                      : "bg-border hover:bg-border/80"
                  )}
                >
                  {/* warning dot for steps with data but missing required fields */}
                  {!isCompleted && !isCurrent && hasData && stepMissing > 0 && stepMissing < getStepConfig(step.id).requiredFields.length && (
                    <span className="absolute -top-0.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-warning" />
                  )}
                </button>
              );
            })}
          </div>
          <span className="text-[10px] text-muted-foreground/50">
            Step {currentStep} of {STEPS.length}
          </span>
        </div>

        {/* Right: Back / Continue */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleBack}
            disabled={currentStep === 1}
            className="flex items-center gap-1 rounded-button border border-border px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </button>
          <button
            onClick={handleContinue}
            className={cn(
              "flex items-center gap-1.5 rounded-button px-5 py-2 text-sm font-semibold transition-all press-scale",
              canContinue
                ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
                : "bg-primary text-primary-foreground hover:bg-primary/90",
              shake && "animate-[wiggle_0.4s_ease-in-out]"
            )}
            style={shake ? { animation: "wiggle 0.4s ease-in-out" } : undefined}
          >
            {isFinalStep ? "Finish" : "Continue"}
            {!isFinalStep && <ChevronRight className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes wiggle {
          0%, 100% { transform: translateX(0); }
          15%       { transform: translateX(-5px); }
          35%       { transform: translateX(5px); }
          55%       { transform: translateX(-4px); }
          75%       { transform: translateX(4px); }
          90%       { transform: translateX(-2px); }
        }
      `}</style>
    </div>
  );
}
