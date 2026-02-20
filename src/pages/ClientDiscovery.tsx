import { useState, useCallback } from "react";
import { useDiscovery } from "@/components/discovery/DiscoveryContext";
import { DiscoverySidebar } from "@/components/discovery/DiscoverySidebar";
import { DiscoveryBottomBar } from "@/components/discovery/DiscoveryBottomBar";
import { StepGuidanceBanner } from "@/components/discovery/StepGuidanceBanner";
import { ConversationCoach } from "@/components/discovery/ConversationCoach";
import { TransitionBanner } from "@/components/discovery/TransitionBanner";
import { ProgressRing } from "@/components/discovery/ProgressRing";
import { StepTransition } from "@/components/discovery/StepTransition";
import { PersonalInfo } from "@/components/discovery/steps/PersonalInfo";
import { FinancialProfile } from "@/components/discovery/steps/FinancialProfile";
import { CurrentCoverage } from "@/components/discovery/steps/CurrentCoverage";
import { GoalsObjectives } from "@/components/discovery/steps/GoalsObjectives";
import { LifestyleQuestions } from "@/components/discovery/steps/LifestyleQuestions";
import { RiskAssessment } from "@/components/discovery/steps/RiskAssessment";
import { SuitabilityDetermination } from "@/components/discovery/steps/SuitabilityDetermination";
import { ProductRecommendation } from "@/components/discovery/steps/ProductRecommendation";
import { ReviewSummary } from "@/components/discovery/steps/ReviewSummary";
import { STEPS } from "@/components/discovery/DiscoveryContext";
import { getStepConfig } from "@/components/discovery/discovery-config";

const STEP_COMPONENTS: Record<number, React.FC> = {
  1: PersonalInfo,
  2: FinancialProfile,
  3: CurrentCoverage,
  4: GoalsObjectives,
  5: LifestyleQuestions,
  6: RiskAssessment,
  7: SuitabilityDetermination,
  8: ProductRecommendation,
  9: ReviewSummary,
};

function DiscoveryContent() {
  const { currentStep, setCurrentStep, completedSteps, getStepCompletion } = useDiscovery();
  const [transition, setTransition] = useState<{ message: string; nextStep: number } | null>(null);
  const totalSteps = STEPS.length;

  const StepComponent = STEP_COMPONENTS[currentStep];

  const overallCompletion = Math.round(
    STEPS.reduce((sum, s) => sum + getStepCompletion(s.id), 0) / STEPS.length
  );

  const handleTransitionComplete = useCallback(() => {
    if (transition) {
      setCurrentStep(transition.nextStep);
      setTransition(null);
    }
  }, [transition, setCurrentStep]);

  const handleStepTransition = useCallback((message: string, nextStep: number) => {
    setTransition({ message, nextStep });
  }, []);

  return (
    <div className="flex h-[calc(100vh-56px)] flex-col">
      {transition && (
        <TransitionBanner
          message={transition.message}
          stepNumber={transition.nextStep - 1}
          totalSteps={totalSteps}
          onComplete={handleTransitionComplete}
        />
      )}

      <div className="flex flex-1 overflow-hidden">
        <DiscoverySidebar />

        <div className="flex-1 overflow-y-auto p-8 relative">
          <div className="absolute top-4 right-4 z-10">
            <ProgressRing percentage={overallCompletion} />
          </div>

          <div className="mx-auto max-w-3xl">
            <StepGuidanceBanner stepId={currentStep} />
            <StepTransition stepKey={currentStep}>
              <StepComponent />
            </StepTransition>
          </div>
        </div>

        <ConversationCoach stepId={currentStep} />
      </div>

      <DiscoveryBottomBar onTransition={handleStepTransition} />
    </div>
  );
}

export default function ClientDiscovery() {
  return <DiscoveryContent />;
}
