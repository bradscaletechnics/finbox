import { useState } from "react";
import { MessageSquare, ChevronRight, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { getStepConfig, StepCoachTip } from "./discovery-config";

interface Props {
  stepId: number;
}

function TipCard({ tip }: { tip: StepCoachTip }) {
  return (
    <div
      className={cn(
        "rounded-card border-l-[3px] bg-card/60 px-3.5 py-3 text-sm leading-relaxed",
        tip.type === "tip"
          ? "border-l-primary text-foreground"
          : "border-l-warning text-foreground"
      )}
    >
      {tip.text}
    </div>
  );
}

export function ConversationCoach({ stepId }: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const config = getStepConfig(stepId);

  if (collapsed) {
    return (
      <button
        onClick={() => setCollapsed(false)}
        className="shrink-0 flex flex-col items-center gap-2 py-4 px-1.5 border-l border-border bg-card/30 hover:bg-card/60 transition-colors"
        title="Open Conversation Coach"
      >
        <ChevronLeft className="h-4 w-4 text-muted-foreground" />
        <MessageSquare className="h-4 w-4 text-primary" />
        <span className="text-[10px] font-medium text-muted-foreground [writing-mode:vertical-lr] rotate-180">
          Coach
        </span>
      </button>
    );
  }

  return (
    <aside className="w-[280px] shrink-0 border-l border-border bg-card/30 overflow-y-auto">
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-primary" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Conversation Coach
            </h3>
          </div>
          <button
            onClick={() => setCollapsed(true)}
            className="text-muted-foreground hover:text-foreground transition-colors"
            title="Collapse"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Intro */}
        <p className="text-xs text-muted-foreground leading-relaxed">
          {config.coachIntro}
        </p>

        {/* Tips */}
        <div className="space-y-2.5">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">
            Suggested talking points
          </p>
          {config.coachTips.map((tip, i) => (
            <TipCard key={i} tip={tip} />
          ))}
        </div>
      </div>
    </aside>
  );
}
