import { useEffect, useState } from "react";
import { Check } from "lucide-react";

const STEPS = [
  "Compiling client profile...",
  "Building suitability narrative...",
  "Formatting compliance documentation...",
  "Finalizing export...",
];

interface Props {
  onComplete: () => void;
}

export function HandoffLoader({ onComplete }: Props) {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const timers = STEPS.map((_, i) =>
      setTimeout(() => setActiveStep(i + 1), (i + 1) * 800)
    );
    const done = setTimeout(onComplete, STEPS.length * 800 + 200);
    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(done);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-background/90 backdrop-blur-sm">
      <div className="w-full max-w-sm space-y-6 text-center">
        {/* Pulsing dots */}
        <div className="flex justify-center gap-2">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="h-2.5 w-2.5 rounded-full bg-primary animate-bounce"
              style={{ animationDelay: `${i * 150}ms` }}
            />
          ))}
        </div>
        <p className="text-lg font-semibold text-foreground">Generating your handoff package...</p>

        {/* Progress steps */}
        <div className="space-y-3 text-left mx-auto max-w-xs">
          {STEPS.map((label, i) => {
            const done = activeStep > i;
            const active = activeStep === i;
            const pending = activeStep < i;
            return (
              <div
                key={i}
                className="flex items-center gap-3 transition-opacity duration-300"
                style={{ opacity: pending ? 0 : 1, transform: pending ? "translateY(4px)" : "translateY(0)", transition: "opacity 300ms ease-out, transform 300ms ease-out" }}
              >
                {done ? (
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary">
                    <Check className="h-3 w-3 text-primary-foreground" />
                  </div>
                ) : (
                  <div className="h-5 w-5 rounded-full border-2 border-primary/40 animate-pulse" />
                )}
                <span className={`text-sm ${done ? "text-muted-foreground" : "text-foreground font-medium"}`}>
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
