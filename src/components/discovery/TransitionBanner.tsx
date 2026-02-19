import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { playStepDing } from "@/lib/sounds";

interface Props {
  message: string;
  stepNumber: number;
  totalSteps: number;
  onComplete: () => void;
}

export function TransitionBanner({ message, stepNumber, totalSteps, onComplete }: Props) {
  const [visible, setVisible] = useState(true);
  const percentage = Math.round((stepNumber / totalSteps) * 100);

  useEffect(() => {
    playStepDing();
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onComplete, 300);
    }, 1800);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm transition-opacity duration-300 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="flex flex-col items-center gap-4 rounded-card border border-primary/30 bg-card px-10 py-6 shadow-elevated gold-shimmer">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
            <Check className="h-5 w-5 text-primary-foreground" />
          </div>
          <p className="text-base font-medium text-foreground">{message}</p>
        </div>
        <div className="w-full space-y-1.5">
          <div className="flex justify-between text-[11px] font-mono text-muted-foreground">
            <span>Step {stepNumber} of {totalSteps}</span>
            <span className="text-primary">{percentage}%</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-border overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
