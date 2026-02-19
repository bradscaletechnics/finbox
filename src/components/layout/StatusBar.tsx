import { useLocation } from "react-router-dom";
import { HardDrive } from "lucide-react";
import { useSessionStatsWithPB } from "@/hooks/use-session-stats";
import { AIConnectionDot } from "@/components/ai-assistant/AIConnectionStatus";
import { cn } from "@/lib/utils";

const routeNames: Record<string, string> = {
  "/": "Dashboard",
  "/active-cases": "Cases",
  "/new-case": "New Case",
  "/settings": "Settings",
  "/presentations": "Presentations",
  "/training": "Training",
};

export function StatusBar() {
  const location = useLocation();
  const { stats: session, personalBests } = useSessionStatsWithPB();

  const currentRoute =
    routeNames[location.pathname] ??
    (location.pathname.startsWith("/case/") ? "Case Detail" : "FinBox");

  const hasActivity = session.fieldsCompleted + session.stepsCompleted + session.casesTouched > 0;

  return (
    <div className="flex h-7 shrink-0 items-center justify-between bg-[hsl(var(--bar-background))] px-4 select-none border-t border-white/[0.03]">
      {/* Left: Ready status */}
      <div className="flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
        <span className="font-mono text-[10px] text-muted-foreground/50">
          Ready — {currentRoute}
        </span>
      </div>

      {/* Center: Session stats */}
      <span className="font-mono text-[10px] text-muted-foreground/50">
        {hasActivity
          ? <>
              Session:{" "}
              <span className={cn(personalBests.fieldsCompleted && "text-gold pb-badge")}>
                {session.fieldsCompleted} fields{personalBests.fieldsCompleted && " PB"}
              </span>
              {" · "}
              <span className={cn(personalBests.stepsCompleted && "text-gold pb-badge")}>
                {session.stepsCompleted} steps{personalBests.stepsCompleted && " PB"}
              </span>
              {" · "}
              <span className={cn(personalBests.casesTouched && "text-gold pb-badge")}>
                {session.casesTouched} cases{personalBests.casesTouched && " PB"}
              </span>
            </>
          : "Session: Ready"}
      </span>

      {/* Right: Storage & AI status */}
      <div className="flex items-center gap-3">
        <AIConnectionDot />
        <div className="flex items-center gap-2">
          <HardDrive className="h-3 w-3 text-muted-foreground/30" />
          <span className="font-mono text-[10px] text-muted-foreground/40">
            Local · v2.4
          </span>
        </div>
      </div>
    </div>
  );
}
