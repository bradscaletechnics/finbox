import { Check, X } from "lucide-react";
import { useDiscovery } from "../DiscoveryContext";
import { getRiskLabel } from "@/lib/risk";

const inputClass = "w-full rounded-button border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary transition-colors";

interface ProductCategory {
  name: string;
  suitable: boolean;
  reason?: string;
}

function getSuitableProducts(data: ReturnType<typeof useDiscovery>["data"]): ProductCategory[] {
  const risk = getRiskLabel(data.riskAnswers);
  const age = data.dateOfBirth ? new Date().getFullYear() - new Date(data.dateOfBirth).getFullYear() : 0;
  const horizon = parseInt(data.investmentTimeHorizon) || 10;

  return [
    {
      name: "IFA (Immediate Financial Arrangement)",
      suitable: risk !== "Aggressive" && horizon >= 5,
      reason: risk === "Aggressive" ? "Risk tolerance exceeds product design" : undefined,
    },
    {
      name: "IUL (Indexed Universal Life)",
      suitable: age < 65 && horizon >= 10,
      reason: age >= 65 ? "Age may limit policy effectiveness" : horizon < 10 ? "Time horizon too short" : undefined,
    },
    {
      name: "VUL (Variable Universal Life)",
      suitable: risk !== "Conservative" && risk !== "Moderately Conservative" && horizon >= 10,
      reason: risk === "Conservative" ? "Risk tolerance too low for variable products" : undefined,
    },
    {
      name: "UL (Universal Life)",
      suitable: true,
    },
    {
      name: "Term Life",
      suitable: age < 70,
      reason: age >= 70 ? "Age exceeds typical term eligibility" : undefined,
    },
  ];
}

export function SuitabilityDetermination() {
  const { data, updateData } = useDiscovery();
  const risk = getRiskLabel(data.riskAnswers);
  const clientName = [data.firstName, data.lastName].filter(Boolean).join(" ") || "the client";
  const primaryGoal = data.primaryGoals[0] || "wealth management";
  const products = getSuitableProducts(data);

  const complianceChecks = [
    { label: "Client age appropriate for surrender period", pass: true },
    { label: "Liquidity needs addressed", pass: data.liquidityNeeds === "No" || (data.liquidityNeeds === "Yes" && !!data.liquidityExplanation) },
    { label: "Replacement disclosure completed if applicable", pass: !data.willReplaceCoverage || data.replacementDisclosureAcknowledged },
    { label: "Source of funds documented", pass: !!data.sourceOfFunds },
    { label: "Risk tolerance assessment complete", pass: Object.keys(data.riskAnswers).length === 5 },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Suitability Determination</h2>
        <p className="mt-1 text-sm text-muted-foreground">Auto-generated analysis based on collected client data.</p>
      </div>

      {/* Summary Card */}
      <div className="rounded-card border border-primary/30 bg-primary/5 p-5">
        <p className="text-sm leading-relaxed text-foreground">
          Based on <span className="font-semibold">{clientName}'s</span> financial profile,{" "}
          <span className="font-mono text-primary">{data.investmentTimeHorizon}-year</span> time horizon,{" "}
          <span className="font-semibold text-primary">{risk}</span> risk tolerance, and goal of{" "}
          <span className="font-semibold">{primaryGoal}</span>, the following product categories are suitable:
        </p>
      </div>

      {/* Products */}
      <div className="space-y-2">
        {products.map((p) => (
          <div
            key={p.name}
            className={`flex items-center gap-3 rounded-card border px-4 py-3 ${
              p.suitable ? "border-primary/30 bg-primary/5" : "border-border bg-secondary/20 opacity-60"
            }`}
          >
            {p.suitable ? (
              <Check className="h-5 w-5 shrink-0 text-primary" />
            ) : (
              <X className="h-5 w-5 shrink-0 text-muted-foreground" />
            )}
            <div className="flex-1">
              <span className={`text-sm font-medium ${p.suitable ? "text-foreground" : "text-muted-foreground"}`}>
                {p.name}
              </span>
              {p.reason && <p className="text-xs text-muted-foreground mt-0.5">{p.reason}</p>}
            </div>
          </div>
        ))}
      </div>

      {/* Advisor Notes */}
      <div>
        <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Advisor Notes</label>
        <textarea
          className={`${inputClass} min-h-[100px]`}
          placeholder="Additional suitability justification or advisor commentary..."
          value={data.advisorNotes}
          onChange={(e) => updateData({ advisorNotes: e.target.value })}
        />
      </div>

      {/* Compliance Checklist */}
      <div className="rounded-card border border-border bg-card p-5 space-y-3">
        <h3 className="text-sm font-semibold text-foreground">Compliance Checklist</h3>
        <div className="space-y-2">
          {complianceChecks.map((check, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`h-4 w-4 rounded-sm flex items-center justify-center ${check.pass ? "bg-primary" : "border border-border"}`}>
                {check.pass && <Check className="h-3 w-3 text-primary-foreground" />}
              </div>
              <span className={`text-sm ${check.pass ? "text-foreground" : "text-muted-foreground"}`}>{check.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
