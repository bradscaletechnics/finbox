import { useState } from "react";
import { Progress } from "@/components/ui/progress";
import { FinBoxLogo } from "@/components/ui/FinBoxLogo";
import { WelcomeStep } from "./steps/WelcomeStep";
import { AdvisorProfileStep } from "./steps/AdvisorProfileStep";
import { PreferencesStep } from "./steps/PreferencesStep";
import { ReadyStep } from "./steps/ReadyStep";

export interface AdvisorProfile {
  fullName: string;
  agency: string;
  phone: string;
  email: string;
  state: string;
  licenseNumber: string;
  npn: string;
}

export interface AdvisorPreferences {
  productFocus: "fia" | "life" | "both" | "";
  carriers: string[];
  pin: string;
}

interface OnboardingFlowProps {
  onComplete: (profile: AdvisorProfile, preferences: AdvisorPreferences) => void;
}

const TOTAL_STEPS = 4;

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<AdvisorProfile>({
    fullName: "",
    agency: "",
    phone: "",
    email: "",
    state: "",
    licenseNumber: "",
    npn: "",
  });
  const [preferences, setPreferences] = useState<AdvisorPreferences>({
    productFocus: "",
    carriers: [],
    pin: "",
  });

  const progress = (step / TOTAL_STEPS) * 100;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background">
      {/* Logo */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2">
        <FinBoxLogo size="md" />
      </div>

      {/* Card */}
      <div className="w-full max-w-[640px] mx-4 rounded-modal overflow-hidden bg-card border border-border/60" style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.4)" }}>
        {/* Progress bar & step indicator — hidden on welcome screen */}
        {step > 1 && (
          <>
            <div className="h-1 w-full bg-border/40">
              <div
                className="h-full transition-all duration-500 ease-out bg-gradient-to-r from-gold/80 to-gold"
                style={{ width: `${((step - 1) / (TOTAL_STEPS - 1)) * 100}%` }}
              />
            </div>
            <div className="px-8 pt-6">
              <p className="text-xs font-mono text-muted-foreground/60 tracking-wider uppercase">
                Step {step - 1} of {TOTAL_STEPS - 1}
              </p>
            </div>
          </>
        )}

        {/* Content with slide transition */}
        <div className="relative overflow-hidden">
          <div
            className="transition-all duration-300 ease-out"
            key={step}
            style={{ animation: "fadeSlideIn 0.3s ease-out" }}
          >
            {step === 1 && <WelcomeStep onNext={() => setStep(2)} />}
            {step === 2 && (
              <AdvisorProfileStep
                profile={profile}
                onChange={setProfile}
                onBack={() => setStep(1)}
                onNext={() => setStep(3)}
              />
            )}
            {step === 3 && (
              <PreferencesStep
                preferences={preferences}
                onChange={setPreferences}
                onBack={() => setStep(2)}
                onNext={() => setStep(4)}
              />
            )}
            {step === 4 && (
              <ReadyStep
                profile={profile}
                preferences={preferences}
                onComplete={() => onComplete(profile, preferences)}
              />
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
