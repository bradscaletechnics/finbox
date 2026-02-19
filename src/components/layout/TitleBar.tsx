import { useEffect, useState } from "react";
import { WifiOff } from "lucide-react";

export function TitleBar() {
  const [time, setTime] = useState(() => formatTime(new Date()));

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(formatTime(new Date()));
    }, 60_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex h-8 shrink-0 items-center justify-between bg-[hsl(var(--bar-background))] px-4 select-none border-b border-white/[0.03]">
      {/* Left: App version */}
      <span className="font-mono text-[10px] text-muted-foreground/40 tracking-wider">
        FinBox v1.0
      </span>

      {/* Right: Status indicators */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          <span className="font-mono text-[10px] text-muted-foreground/50">Local Mode</span>
        </div>
        <WifiOff className="h-3 w-3 text-muted-foreground/30" />
        <span className="font-mono text-[10px] text-muted-foreground/40">{time}</span>
      </div>
    </div>
  );
}

function formatTime(date: Date) {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}
