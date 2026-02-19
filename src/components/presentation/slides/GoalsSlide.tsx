import { Target, Clock, Shield, TrendingUp, Heart, Landmark, Wallet } from "lucide-react";
import type { PresentationContext } from "@/lib/presentation-decks";

const GOAL_ICONS: Record<string, React.FC<{ className?: string; style?: React.CSSProperties }>> = {
  "Retirement Income": Landmark,
  "Wealth Transfer": Wallet,
  "Tax-Deferred Growth": TrendingUp,
  "Principal Protection": Shield,
  "Legacy Planning": Heart,
  "Income Replacement": Target,
};

const DEFAULT_GOALS = ["Retirement Income", "Tax-Deferred Growth", "Principal Protection"];

interface Props {
  context?: PresentationContext;
}

export function GoalsSlide({ context }: Props) {
  const goals = context?.goals ?? DEFAULT_GOALS;
  const timeHorizon = context?.timeHorizon ?? "15";
  const subtitle = context?.clientName
    ? `Based on our conversation with ${context.clientName}`
    : "Key objectives for your financial plan";

  return (
    <div className="space-y-10">
      <div className="text-center space-y-2">
        <p className="text-sm font-medium tracking-widest uppercase" style={{ color: "#8A9BB5" }}>
          Understanding
        </p>
        <h1 className="text-4xl font-bold" style={{ color: "#0A1628" }}>
          Your Financial Goals
        </h1>
        <p className="text-base" style={{ color: "#8A9BB5" }}>
          {subtitle}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-6 max-w-3xl mx-auto">
        {goals.map((goal) => {
          const Icon = GOAL_ICONS[goal] || Target;
          return (
            <div
              key={goal}
              className="flex flex-col items-center gap-3 rounded-xl p-6 text-center"
              style={{ background: "#f0fdf4", border: "1px solid #bbf7d0" }}
            >
              <div
                className="flex h-12 w-12 items-center justify-center rounded-full"
                style={{ background: "#00D47E" }}
              >
                <Icon className="h-6 w-6" style={{ color: "#0A1628" }} />
              </div>
              <span className="text-sm font-semibold" style={{ color: "#0A1628" }}>
                {goal}
              </span>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-center gap-3">
        <Clock className="h-5 w-5" style={{ color: "#00D47E" }} />
        <span className="text-lg font-medium" style={{ color: "#0A1628" }}>
          Investment Time Horizon:{" "}
          <span className="font-bold" style={{ color: "#00D47E" }}>
            {timeHorizon} years
          </span>
        </span>
      </div>
    </div>
  );
}
