import { useEffect, useRef, useState } from "react";

const COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--gold))",
  "hsl(var(--accent))",
  "hsl(var(--primary))",
  "hsl(var(--gold))",
];

interface Particle {
  id: number;
  x: number;
  y: number;
  angle: number;
  speed: number;
  size: number;
  color: string;
}

export function ConfettiBurst({ onDone }: { onDone?: () => void }) {
  const [particles] = useState<Particle[]>(() =>
    Array.from({ length: 14 }, (_, i) => ({
      id: i,
      x: 0,
      y: 0,
      angle: (i / 14) * 360 + (Math.random() - 0.5) * 20,
      speed: 60 + Math.random() * 40,
      size: 4 + Math.random() * 4,
      color: COLORS[i % COLORS.length],
    }))
  );
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => onDone?.(), 800);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div
      ref={ref}
      className="fixed inset-0 z-[70] pointer-events-none flex items-center justify-center"
    >
      {particles.map((p) => {
        const rad = (p.angle * Math.PI) / 180;
        const tx = Math.cos(rad) * p.speed;
        const ty = Math.sin(rad) * p.speed;
        return (
          <span
            key={p.id}
            className="absolute rounded-full confetti-particle"
            style={{
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              "--tx": `${tx}px`,
              "--ty": `${ty}px`,
            } as React.CSSProperties}
          />
        );
      })}
    </div>
  );
}
