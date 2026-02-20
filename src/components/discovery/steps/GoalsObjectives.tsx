import { cn } from "@/lib/utils";
import { useDiscovery } from "../DiscoveryContext";
import { playSelect, playDeselect, playToggle } from "@/lib/sounds";

const PRODUCT_CATEGORIES = [
  { id: "IFA", label: "IFA", sub: "Immediate Financing Arrangement — Corporate Par" },
  { id: "Participating Whole Life", label: "Participating Whole Life", sub: "Equimax / Manulife Par — Personal" },
  { id: "Universal Life", label: "Universal Life", sub: "EquiUniversal / InnoVision UL" },
  { id: "Term Life", label: "Term Life", sub: "EquiTerm / Manulife Term" },
];

const GOALS_BY_CATEGORY: Record<string, string[]> = {
  IFA: [
    "Access to capital via collateral lending",
    "Tax-deductible interest expense",
    "Tax-sheltered policy growth",
    "Capital Dividend Account (CDA) credit",
    "Estate wealth transfer",
    "Balance sheet strengthening",
    "Other",
  ],
  "Participating Whole Life": [
    "Wealth Transfer",
    "Legacy Planning",
    "Tax-Deferred Growth",
    "Estate Transfer",
    "Income / Family Protection",
    "Corporate / Preferred Retirement Solution",
    "Other",
  ],
  "Universal Life": [
    "Tax-Deferred Investment Growth",
    "Flexible Premium Deposits",
    "Estate Transfer",
    "Income / Family Protection",
    "Business Insurance (Key Person / Buy-Sell)",
    "Other",
  ],
  "Term Life": [
    "Income / Family Protection",
    "Mortgage Protection",
    "Key Person Coverage",
    "Buy-Sell Agreement Funding",
    "Business Loan Coverage",
    "Other",
  ],
};

const DEFAULT_GOALS = [
  "IFA — Immediate Financing Arrangement",
  "Wealth Transfer",
  "Tax-Deferred Growth",
  "Legacy Planning",
  "Income / Family Protection",
  "Estate Transfer",
  "Corporate / Preferred Retirement Solution",
  "Other",
];

const TIME_OPTIONS = ["5", "7", "10", "15", "20+"];

const inputClass = "w-full rounded-button border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary transition-colors";

export function GoalsObjectives() {
  const { data, updateData, highlightMissing } = useDiscovery();

  const goals = data.productCategory ? (GOALS_BY_CATEGORY[data.productCategory] ?? DEFAULT_GOALS) : DEFAULT_GOALS;

  const toggleGoal = (goal: string) => {
    const removing = data.primaryGoals.includes(goal);
    removing ? playDeselect() : playSelect();
    const updated = removing
      ? data.primaryGoals.filter((g) => g !== goal)
      : [...data.primaryGoals, goal];
    updateData({ primaryGoals: updated });
  };

  const handleCategoryChange = (cat: string) => {
    playSelect();
    updateData({ productCategory: cat, primaryGoals: [] });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Goals & Objectives</h2>
        <p className="mt-1 text-sm text-muted-foreground">Identify the product type and understand the client's financial goals.</p>
      </div>

      {/* Product Category — must be selected first */}
      <div>
        <label className="mb-2 block text-xs font-medium text-muted-foreground">Product Category</label>
        <p className="mb-3 text-xs text-muted-foreground/70">Select the product type being recommended. This determines which fields are collected throughout the case.</p>
        <div className="grid grid-cols-2 gap-3">
          {PRODUCT_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => handleCategoryChange(cat.id)}
              className={cn(
                "rounded-card border p-4 text-left transition-all",
                data.productCategory === cat.id
                  ? "border-primary bg-primary/10 shadow-sm"
                  : "border-border hover:border-primary/40 hover:bg-secondary/30"
              )}
            >
              <p className={cn("text-sm font-semibold", data.productCategory === cat.id ? "text-primary" : "text-foreground")}>{cat.label}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{cat.sub}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Primary Goals — conditional on product category */}
      {data.productCategory && (
        <div id="field-primaryGoals">
          <label className={cn("mb-2 block text-xs font-medium", highlightMissing && data.primaryGoals.length === 0 ? "text-destructive" : "text-muted-foreground")}>
            Primary Goals (select all that apply)
            {highlightMissing && data.primaryGoals.length === 0 && <span className="ml-1 font-normal text-destructive/70">— required</span>}
          </label>
          <div className={cn("flex flex-wrap gap-2 rounded-lg p-2 -mx-2 transition-colors", highlightMissing && data.primaryGoals.length === 0 && "ring-1 ring-destructive/40 bg-destructive/5")}>
            {goals.map((goal) => (
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
      )}

      {/* Time Horizon */}
      <div>
        <label className="mb-2 block text-xs font-medium text-muted-foreground">
          Investment / Strategy Time Horizon (years)
        </label>
        <div className="flex items-center gap-2">
          {TIME_OPTIONS.map((t) => (
            <button
              key={t}
              onClick={() => { playToggle(); updateData({ investmentTimeHorizon: t }); }}
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
        {data.productCategory === "IFA" && (
          <p className="mt-1.5 text-xs text-muted-foreground/70">For IFA: typically 10–20 years or until expected business exit.</p>
        )}
      </div>

      {/* Liquidity */}
      <div id="field-liquidityNeeds" className={cn("space-y-3 rounded-lg p-3 -mx-3 transition-colors", highlightMissing && !data.liquidityNeeds && "ring-1 ring-destructive/40 bg-destructive/5")}>
        <label className={cn("block text-xs font-medium", highlightMissing && !data.liquidityNeeds ? "text-destructive" : "text-muted-foreground")}>
          Does the client anticipate needing access to these funds within the strategy period?
          {highlightMissing && !data.liquidityNeeds && <span className="ml-1 font-normal text-destructive/70">— required</span>}
        </label>
        <div className="flex gap-3">
          {["Yes", "No"].map((opt) => (
            <button
              key={opt}
              onClick={() => { playToggle(); updateData({ liquidityNeeds: opt }); }}
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
            placeholder="Explain the anticipated liquidity needs and how they will be addressed..."
            value={data.liquidityExplanation}
            onChange={(e) => updateData({ liquidityExplanation: e.target.value })}
          />
        )}
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
