import { useState, useEffect, useRef } from "react";
import { useCountUp } from "@/hooks/use-count-up";
import { playCaseComplete } from "@/lib/sounds";

interface Props {
  open: boolean;
  premium: number;
  clientName: string;
  onClose: () => void;
  onViewPackage: () => void;
}

function DollarParticles() {
  const particles = useRef(
    Array.from({ length: 18 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 1.2,
      drift: (Math.random() - 0.5) * 60,
      color: Math.random() > 0.5 ? "text-primary" : "text-gold",
      size: 12 + Math.random() * 8,
    }))
  ).current;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((p) => (
        <span
          key={p.id}
          className={`absolute particle-float font-mono font-bold ${p.color}`}
          style={{
            left: `${p.left}%`,
            bottom: 0,
            fontSize: p.size,
            animationDelay: `${p.delay}s`,
            "--drift": `${p.drift}px`,
          } as React.CSSProperties}
        >
          $
        </span>
      ))}
    </div>
  );
}

function GoldRain() {
  const drops = useRef(
    Array.from({ length: 24 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 2 + Math.random() * 1.5,
      size: 2 + Math.random() * 2,
      opacity: 0.2 + Math.random() * 0.4,
    }))
  ).current;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {drops.map((d) => (
        <span
          key={d.id}
          className="absolute rounded-full gold-rain-drop"
          style={{
            left: `${d.left}%`,
            top: -10,
            width: d.size,
            height: d.size,
            backgroundColor: `hsla(43, 56%, 54%, ${d.opacity})`,
            animationDelay: `${d.delay}s`,
            animationDuration: `${d.duration}s`,
          }}
        />
      ))}
    </div>
  );
}

export function CaseCompletionOverlay({ open, premium, clientName, onClose, onViewPackage }: Props) {
  const [phase, setPhase] = useState(0);
  const { value: premiumValue } = useCountUp(premium, 1200, phase >= 3);

  useEffect(() => {
    if (!open) {
      setPhase(0);
      return;
    }
    // Phase progression: 0=backdrop, 1=checkmark, 2=text, 3=premium+particles, 4=buttons
    playCaseComplete();
    const timers = [
      setTimeout(() => setPhase(1), 200),
      setTimeout(() => setPhase(2), 700),
      setTimeout(() => setPhase(3), 1200),
      setTimeout(() => setPhase(4), 2000),
    ];
    return () => timers.forEach(clearTimeout);
  }, [open]);

  if (!open) return null;

  return (
    <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center transition-opacity duration-200 ${phase >= 0 ? "opacity-100" : "opacity-0"}`}>
      <div className="absolute inset-0 bg-background/90 backdrop-blur-sm" />

      {/* Gold shimmer top edge */}
      <div className="absolute top-0 left-0 right-0 gold-shimmer h-1" />

      {/* Dollar particles + Gold rain */}
      {phase >= 3 && <><DollarParticles /><GoldRain /></>}

      <div className="relative z-10 flex flex-col items-center gap-6">
        {/* Checkmark */}
        {phase >= 1 && (
          <div className="animate-scale-in">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary shadow-[0_0_40px_hsla(157,100%,42%,0.3)]">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className="text-primary-foreground">
                <path
                  d="M5 13l4 4L19 7"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="checkmark-draw"
                />
              </svg>
            </div>
          </div>
        )}

        {/* Title */}
        {phase >= 2 && (
          <h2 className="text-2xl font-bold text-foreground animate-fade-in">
            Handoff Package Ready
          </h2>
        )}

        {/* Premium amount */}
        {phase >= 3 && (
          <p className="text-4xl font-bold font-mono text-gold text-glow-gold animate-fade-in">
            ${premiumValue.toLocaleString("en-US")}
          </p>
        )}

        {/* Buttons */}
        {phase >= 4 && (
          <div className="flex items-center gap-3 animate-fade-in">
            <button
              onClick={onViewPackage}
              className="btn-press rounded-button bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              View Package
            </button>
            <button
              onClick={onClose}
              className="btn-press rounded-button border border-border px-6 py-3 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
