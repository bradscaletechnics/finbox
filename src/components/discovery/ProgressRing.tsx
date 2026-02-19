import { useEffect, useRef, useState } from "react";

interface Props {
  percentage: number;
  size?: number;
}

const THRESHOLDS = [25, 50, 75, 100];

export function ProgressRing({ percentage, size: sizeProp }: Props) {
  const size = sizeProp || 48;
  const strokeWidth = 3.5;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  const prevPercentage = useRef(percentage);
  const [flashing, setFlashing] = useState(false);

  useEffect(() => {
    const prev = prevPercentage.current;
    prevPercentage.current = percentage;

    // Check if we crossed a threshold
    const crossed = THRESHOLDS.some((t) => prev < t && percentage >= t);
    if (crossed) {
      setFlashing(true);
      const timer = setTimeout(() => setFlashing(false), 600);
      return () => clearTimeout(timer);
    }
  }, [percentage]);

  return (
    <div className={`relative ${flashing ? "ring-flash" : ""}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={flashing ? "hsl(var(--gold))" : "hsl(var(--primary))"}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-semibold text-foreground font-mono">
          {percentage}%
        </span>
      </div>
    </div>
  );
}
