import { cn } from "@/lib/utils";
import { useDiscovery } from "../DiscoveryContext";

const GOALS = [
  "Retirement Income",
  "Wealth Transfer",
  "Tax-Deferred Growth",
  "Principal Protection",
  "Legacy Planning",
  "Income Replacement",
  "Other",
];

const TIME_OPTIONS = ["5", "7", "10", "15", "20+"];

const inputClass = "w-full rounded-button border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary transition-colors";

export function GoalsObjectives() {
  const { data, updateData } = useDiscovery();

  const toggleGoal = (goal: string) => {
    const goals = data.primaryGoals.includes(goal)
      ? data.primaryGoals.filter((g) => g !== goal)
      : [...data.primaryGoals, goal];
    updateData({ primaryGoals: goals });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Goals & Objectives</h2>
        <p className="mt-1 text-sm text-muted-foreground">Understand the client's financial goals and time horizon.</p>
      </div>

      {/* Primary Goals */}
      <div>
        <label className="mb-2 block text-xs font-medium text-muted-foreground">Primary Goals (select all that apply)</label>
        <div className="flex flex-wrap gap-2">
          {GOALS.map((goal) => (
            <button
              key={goal}
              onClick={() => toggleGoal(goal)}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition-colors border",
                data.primaryGoals.includes(goal)
                  ? "border-primary bg-primary/15 text-primary"
                  : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
              )}
            >
              {goal}
            </button>
          ))}
        </div>
      </div>

      {/* Time Horizon */}
      <div>
        <label className="mb-2 block text-xs font-medium text-muted-foreground">Investment Time Horizon (years)</label>
        <div className="flex items-center gap-2">
          {TIME_OPTIONS.map((t) => (
            <button
              key={t}
              onClick={() => updateData({ investmentTimeHorizon: t })}
              className={cn(
                "rounded-button px-4 py-2 text-sm font-mono font-medium transition-colors border",
                data.investmentTimeHorizon === t
                  ? "border-primary bg-primary/15 text-primary"
                  : "border-border text-muted-foreground hover:border-primary/50"
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Liquidity */}
      <div className="space-y-3">
        <label className="block text-xs font-medium text-muted-foreground">
          Do you anticipate needing access to these funds within the surrender period?
        </label>
        <div className="flex gap-3">
          {["Yes", "No"].map((opt) => (
            <button
              key={opt}
              onClick={() => updateData({ liquidityNeeds: opt })}
              className={cn(
                "rounded-button px-5 py-2 text-sm font-medium transition-colors border",
                data.liquidityNeeds === opt
                  ? "border-primary bg-primary/15 text-primary"
                  : "border-border text-muted-foreground hover:border-primary/50"
              )}
            >
              {opt}
            </button>
          ))}
        </div>
        {data.liquidityNeeds === "Yes" && (
          <textarea
            className={`${inputClass} min-h-[80px]`}
            placeholder="Please explain the anticipated liquidity needs..."
            value={data.liquidityExplanation}
            onChange={(e) => updateData({ liquidityExplanation: e.target.value })}
          />
        )}
      </div>

      {/* Retirement Age */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Target Retirement Age</label>
          <input
            className={`${inputClass} font-mono`}
            placeholder="65"
            value={data.targetRetirementAge}
            onChange={(e) => updateData({ targetRetirementAge: e.target.value.replace(/[^0-9]/g, "") })}
          />
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Additional Notes</label>
        <textarea
          className={`${inputClass} min-h-[100px]`}
          placeholder="Any additional goals, concerns, or context..."
          value={data.additionalNotes}
          onChange={(e) => updateData({ additionalNotes: e.target.value })}
        />
      </div>
    </div>
  );
}
