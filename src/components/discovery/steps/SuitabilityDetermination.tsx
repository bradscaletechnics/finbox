import { Check, X, AlertTriangle } from "lucide-react";
import { useDiscovery } from "../DiscoveryContext";
import { getRiskLabel } from "@/lib/risk";

const inputClass = "w-full rounded-button border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary transition-colors";

interface ComplianceCheck {
  label: string;
  pass: boolean;
  warn?: boolean;
  note?: string;
}

function getSuitabilityAnalysis(data: ReturnType<typeof useDiscovery>["data"]) {
  const risk = getRiskLabel(data.riskAnswers);
  const age = data.dateOfBirth ? new Date().getFullYear() - new Date(data.dateOfBirth).getFullYear() : 0;
  const horizon = parseInt(data.investmentTimeHorizon) || 10;
  const category = data.productCategory;

  const items: { name: string; suitable: boolean; reason?: string }[] = [];

  if (category === "IFA") {
    items.push({ name: "IFA — Immediate Financing Arrangement", suitable: data.ownerType === "Corporate" && horizon >= 10 && !!data.faceAmountRequested, reason: data.ownerType !== "Corporate" ? "IFA requires corporate ownership" : horizon < 10 ? "Minimum 10-year horizon recommended" : !data.faceAmountRequested ? "Face amount not yet specified" : undefined });
    items.push({ name: "Alternative: Participating Whole Life (No IFA)", suitable: true, reason: "Corporate-owned Par WL without collateral lending — simpler structure" });
  } else if (category === "Participating Whole Life") {
    items.push({ name: "Participating Whole Life", suitable: horizon >= 10, reason: horizon < 10 ? "Par WL requires minimum 10-year horizon to be effective" : undefined });
    items.push({ name: "Universal Life (alternative)", suitable: horizon >= 10 && (risk === "Moderate" || risk === "Moderately Aggressive" || risk === "Aggressive"), reason: risk === "Conservative" ? "Risk profile may prefer guaranteed Par WL growth" : undefined });
  } else if (category === "Universal Life") {
    items.push({ name: "Universal Life — Level COI", suitable: horizon >= 15, reason: horizon < 15 ? "Level COI is cost-effective over long horizon" : undefined });
    items.push({ name: "Universal Life — YRT COI", suitable: horizon >= 5 && age < 55, reason: age >= 55 ? "YRT costs rise significantly with age" : undefined });
    items.push({ name: "Participating Whole Life (alternative)", suitable: risk !== "Aggressive", reason: risk === "Aggressive" ? "Client may prefer investment flexibility of UL" : "Guaranteed growth — consider if client prefers certainty" });
  } else if (category === "Term Life") {
    items.push({ name: `Term Life — ${data.termPeriod || "Selected"} Year`, suitable: age < 70, reason: age >= 70 ? "Age may exceed term eligibility" : undefined });
    items.push({ name: "Conversion to Permanent Coverage", suitable: age < 65 && data.conversionPrivilege, reason: !data.conversionPrivilege ? "Conversion privilege not selected — client forgoes future permanent coverage option" : age >= 65 ? "Conversion window limited" : undefined });
  } else {
    // No category selected yet
    items.push({ name: "Product category not yet selected", suitable: false, reason: "Select a product category in Step 4 — Goals & Objectives" });
  }

  return items;
}

function getComplianceChecks(data: ReturnType<typeof useDiscovery>["data"]): ComplianceCheck[] {
  const category = data.productCategory;
  const checks: ComplianceCheck[] = [
    // Universal checks
    { label: "Client identity verified (Personal Information complete)", pass: !!(data.firstName && data.lastName && data.dateOfBirth && data.sin) },
    { label: "Source of funds documented", pass: !!data.sourceOfFunds },
    { label: "Face amount requested documented", pass: !!data.faceAmountRequested },
    { label: "Reason for purchase documented", pass: !!data.reasonForPurchase },
    { label: "Risk assessment complete (5/5 questions)", pass: Object.keys(data.riskAnswers).length === 5 },
    { label: "Liquidity needs addressed", pass: data.liquidityNeeds === "No" || (data.liquidityNeeds === "Yes" && !!data.liquidityExplanation) },
    { label: "Replacement disclosure completed (if applicable)", pass: !data.willReplaceCoverage || data.replacementDisclosureAcknowledged },
    { label: "Application history disclosed (ever declined / pending applications)", pass: !!(data.applicationEverDeclined && data.pendingApplicationElsewhere) },
  ];

  // Corporate / FINTRAC checks
  if (data.ownerType === "Corporate") {
    checks.push({ label: "FINTRAC: UBO declarations completed (25%+ owners)", pass: data.uboDeclarations.length > 0, note: "Required for all corporate-owned policies" });
    checks.push({ label: "FINTRAC: PEP/HIO declaration obtained", pass: !!data.pepHioDeclaration });
    checks.push({ label: "FINTRAC: Third-party payor declaration obtained", pass: !!data.thirdPartyPayorDeclaration });
    checks.push({ label: "Corporate ownership structure documented", pass: data.corporateOwners.length > 0 });
  }

  // IFA-specific checks
  if (category === "IFA") {
    checks.push({ label: "IFA: Corporate owner confirmed", pass: data.ownerType === "Corporate", note: "IFA requires corporate policyholder" });
    checks.push({ label: "IFA: Collateral assignment intent documented", pass: !!data.collateralAssignmentIntent });
    checks.push({ label: "IFA: Lender identified (if collateral assigned)", pass: data.collateralAssignmentIntent !== "Yes" || !!data.lenderName });
    checks.push({ label: "IFA: Tax counsel identified and NCPI deductibility addressed", pass: !!data.taxCounselName && !!data.ncpiDeductibilityConfirmed, note: "NCPI deductibility must be confirmed before policy issue" });
    checks.push({ label: "IFA: Legal counsel identified", pass: !!data.legalCounselName });
    checks.push({ label: "IFA: Risk acknowledgment obtained from advisor", pass: data.ifaRiskAcknowledged, warn: !data.ifaRiskAcknowledged });
  }

  // Par-specific checks
  if (category === "Participating Whole Life" || category === "IFA") {
    checks.push({ label: "Par: Dividend option selected", pass: !!data.dividendOption });
    checks.push({ label: "Par: Plan design selected (20 Pay / Life Pay / etc.)", pass: !!data.planDesign });
    checks.push({ label: "Par: Illustration reviewed and acknowledged by advisor", pass: data.illustrationAcknowledged, warn: !data.illustrationAcknowledged });
  }

  // UL-specific checks
  if (category === "Universal Life") {
    checks.push({ label: "UL: Death benefit design selected", pass: !!data.deathBenefitDesign });
    checks.push({ label: "UL: COI structure selected (Level vs. YRT)", pass: !!data.coiStructure });
    checks.push({ label: "UL: Investment allocations total 100%", pass: data.investmentAllocations.reduce((s, a) => s + (parseFloat(a.percentage) || 0), 0) === 100, note: "All fund allocations must sum to 100%" });
    checks.push({ label: "UL: Exempt test acknowledged by advisor", pass: data.exemptTestAcknowledged, warn: !data.exemptTestAcknowledged });
  }

  // Term-specific checks
  if (category === "Term Life") {
    checks.push({ label: "Term: Term period selected", pass: !!data.termPeriod });
    checks.push({ label: "Term: Conversion privilege decision documented", pass: data.conversionPrivilege !== undefined });
  }

  return checks;
}

export function SuitabilityDetermination() {
  const { data, updateData } = useDiscovery();
  const risk = getRiskLabel(data.riskAnswers);
  const clientName = [data.firstName, data.lastName].filter(Boolean).join(" ") || "the client";
  const primaryGoal = data.primaryGoals[0] || "wealth management";
  const suitabilityItems = getSuitabilityAnalysis(data);
  const complianceChecks = getComplianceChecks(data);
  const passCount = complianceChecks.filter((c) => c.pass).length;
  const warnChecks = complianceChecks.filter((c) => !c.pass && c.warn);
  const failChecks = complianceChecks.filter((c) => !c.pass && !c.warn);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Suitability Determination</h2>
        <p className="mt-1 text-sm text-muted-foreground">Auto-generated suitability analysis and compliance checklist based on collected client data.</p>
      </div>

      {/* Summary Card */}
      <div className="rounded-card border border-primary/30 bg-primary/5 p-5">
        <p className="text-sm leading-relaxed text-foreground">
          Based on <span className="font-semibold">{clientName}'s</span> financial profile,{" "}
          <span className="font-mono text-primary">{data.investmentTimeHorizon}-year</span> strategy horizon,{" "}
          <span className="font-semibold text-primary">{risk}</span> risk tolerance
          {data.productCategory && (
            <>, and selected product category of <span className="font-semibold">{data.productCategory}</span></>
          )}, the following assessment applies:
        </p>
        {data.primaryGoals.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {data.primaryGoals.map((g) => (
              <span key={g} className="rounded-full border border-primary/30 bg-primary/10 px-3 py-0.5 text-xs font-medium text-primary">{g}</span>
            ))}
          </div>
        )}
      </div>

      {/* Suitability Analysis */}
      <div className="space-y-2">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Product Suitability</h3>
        {suitabilityItems.map((p) => (
          <div
            key={p.name}
            className={`flex items-start gap-3 rounded-card border px-4 py-3 ${
              p.suitable ? "border-primary/30 bg-primary/5" : "border-border bg-secondary/20 opacity-60"
            }`}
          >
            {p.suitable ? (
              <Check className="h-5 w-5 shrink-0 text-primary mt-0.5" />
            ) : (
              <X className="h-5 w-5 shrink-0 text-muted-foreground mt-0.5" />
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

      {/* Compliance Checklist */}
      <div className="rounded-card border border-border bg-card p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">Compliance Checklist</h3>
          <span className={`text-xs font-mono font-semibold ${passCount === complianceChecks.length ? "text-primary" : "text-warning"}`}>
            {passCount}/{complianceChecks.length} passed
          </span>
        </div>

        {/* Warnings */}
        {warnChecks.length > 0 && (
          <div className="rounded-card border border-warning/40 bg-warning/5 p-3 space-y-1.5">
            <p className="text-xs font-semibold text-warning flex items-center gap-1.5"><AlertTriangle className="h-3.5 w-3.5" /> Action required before submission:</p>
            {warnChecks.map((c, i) => (
              <p key={i} className="text-xs text-warning/90 pl-5">• {c.label}</p>
            ))}
          </div>
        )}

        <div className="space-y-2">
          {complianceChecks.map((check, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <div className={`mt-0.5 h-4 w-4 shrink-0 rounded-sm flex items-center justify-center ${check.pass ? "bg-primary" : check.warn ? "bg-warning/20 border border-warning" : "border border-border"}`}>
                {check.pass && <Check className="h-3 w-3 text-primary-foreground" />}
                {!check.pass && check.warn && <AlertTriangle className="h-2.5 w-2.5 text-warning" />}
              </div>
              <div className="flex-1 min-w-0">
                <span className={`text-sm ${check.pass ? "text-foreground" : check.warn ? "text-warning" : "text-muted-foreground"}`}>{check.label}</span>
                {!check.pass && check.note && <p className="text-xs text-muted-foreground/70 mt-0.5">{check.note}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Advisor Notes */}
      <div>
        <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Advisor Suitability Notes</label>
        <textarea
          className={`${inputClass} min-h-[100px]`}
          placeholder="Additional suitability justification, override rationale, or advisor commentary..."
          value={data.advisorNotes}
          onChange={(e) => updateData({ advisorNotes: e.target.value })}
        />
      </div>
    </div>
  );
}
