import { useState } from "react";
import { useDiscovery, InvestmentAllocation } from "../DiscoveryContext";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

const inputClass = "w-full rounded-button border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary transition-colors";
const selectClass = "w-full rounded-button border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary";

function FieldGroup({ label, helper, children, className = "" }: { label: string; helper?: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</label>
      {children}
      {helper && <p className="mt-1 text-xs text-muted-foreground/60">{helper}</p>}
    </div>
  );
}

function CurrencyInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  const fmt = (v: string) => {
    const num = v.replace(/[^0-9]/g, "");
    if (!num) return "";
    return Number(num).toLocaleString("en-CA");
  };
  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
      <input
        className={`${inputClass} pl-7 font-mono`}
        placeholder={placeholder ?? "0"}
        value={fmt(value)}
        onChange={(e) => onChange(e.target.value.replace(/[^0-9]/g, ""))}
      />
    </div>
  );
}

const CARRIERS: Record<string, { name: string; products: string[] }[]> = {
  IFA: [
    { name: "Equitable Life Canada", products: ["Equimax Wealth Accumulator (IFA)", "Equimax Estate Builder (IFA)"] },
    { name: "Manulife", products: ["Manulife Par — IFA Structure"] },
    { name: "Sun Life", products: ["Sun Par Protector II (IFA)", "Sun Par Accumulator II (IFA)"] },
    { name: "Canada Life", products: ["Canada Life Par — IFA Structure"] },
  ],
  "Participating Whole Life": [
    { name: "Equitable Life Canada", products: ["Equimax Wealth Accumulator", "Equimax Estate Builder"] },
    { name: "Manulife", products: ["Manulife Par (Individual)", "Manulife Par (Corporate)"] },
    { name: "Sun Life", products: ["Sun Par Protector II", "Sun Par Accumulator II"] },
    { name: "Canada Life", products: ["Canada Life Participating Life"] },
  ],
  "Universal Life": [
    { name: "Equitable Life Canada", products: ["EquiUniversal — Level COI", "EquiUniversal — YRT COI"] },
    { name: "Manulife", products: ["InnoVision UL — Level COI", "InnoVision UL — YRT COI"] },
    { name: "Sun Life", products: ["Sun Life UL", "Brighthouse UL"] },
    { name: "Canada Life", products: ["Freedom 65 UL", "Canada Life UL"] },
  ],
  "Term Life": [
    { name: "Equitable Life Canada", products: ["EquiTerm 10", "EquiTerm 20", "EquiTerm 30"] },
    { name: "Manulife", products: ["Manulife Term 10", "Manulife Term 20", "Manulife Term 30"] },
    { name: "Sun Life", products: ["Sun Life Term 10", "Sun Life Term 20"] },
    { name: "Canada Life", products: ["Canada Life Term 10", "Canada Life Term 20"] },
  ],
};

const ALL_CARRIERS = [
  { name: "Equitable Life Canada", products: ["Equimax Wealth Accumulator", "Equimax Estate Builder", "EquiUniversal", "EquiTerm 20"] },
  { name: "Manulife", products: ["Manulife Par (Individual)", "InnoVision UL", "Manulife Term 20"] },
  { name: "Sun Life", products: ["Sun Par Protector II", "Sun Life UL", "Sun Life Term 20"] },
  { name: "Canada Life", products: ["Canada Life Par", "Canada Life UL", "Canada Life Term 20"] },
];

function getDefaultNarrative(data: ReturnType<typeof useDiscovery>["data"]): string {
  const clientName = [data.firstName, data.lastName].filter(Boolean).join(" ") || "[Client Name]";
  const goal = data.primaryGoals[0] || "wealth management";
  const income = data.annualIncome ? `$${Number(data.annualIncome).toLocaleString("en-CA")}` : "[income]";
  const horizon = data.investmentTimeHorizon || "10";

  return `After a comprehensive review of ${clientName}'s financial situation, including an annual income of ${income}, a ${horizon}-year strategy horizon, and a primary objective of ${goal.toLowerCase()}, I am recommending ${data.selectedProduct || "[product]"} from ${data.selectedCarrier || "[carrier]"}.

This recommendation aligns with the client's stated goals, financial profile, existing coverage, and liquidity requirements. The client has been provided with an illustration and informed of all relevant policy features, fees, and limitations. This recommendation has been reviewed for LLQP suitability compliance.`;
}

export function ProductRecommendation() {
  const { data, updateData } = useDiscovery();
  const [editingNarrative, setEditingNarrative] = useState(false);

  const category = data.productCategory;
  const carrierList = category && CARRIERS[category] ? CARRIERS[category] : ALL_CARRIERS;
  const selectedCarrierData = carrierList.find((c) => c.name === data.selectedCarrier);

  const isPar = category === "Participating Whole Life" || category === "IFA";
  const isUL = category === "Universal Life";
  const isTerm = category === "Term Life";
  const isManulife = data.selectedCarrier === "Manulife";

  const handleCarrierChange = (carrier: string) => {
    updateData({ selectedCarrier: carrier, selectedProduct: "" });
  };

  const handleProductChange = (product: string) => {
    updateData({ selectedProduct: product });
    if (!data.recommendationNarrative) {
      updateData({ recommendationNarrative: getDefaultNarrative({ ...data, selectedProduct: product }) });
    }
  };

  const updateAllocation = (index: number, updates: Partial<InvestmentAllocation>) => {
    const updated = data.investmentAllocations.map((a, i) => (i === index ? { ...a, ...updates } : a));
    updateData({ investmentAllocations: updated });
  };
  const addAllocation = () => {
    updateData({ investmentAllocations: [...data.investmentAllocations, { accountName: "", percentage: "" }] });
  };
  const removeAllocation = (index: number) => {
    updateData({ investmentAllocations: data.investmentAllocations.filter((_, i) => i !== index) });
  };

  const totalAllocPct = data.investmentAllocations.reduce((sum, a) => sum + (parseFloat(a.percentage) || 0), 0);

  const narrative = data.recommendationNarrative || getDefaultNarrative(data);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Product Recommendation</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Select the recommended carrier and product
          {category ? ` for ${category}` : ""}.
        </p>
      </div>

      {/* Carrier & Product Selection */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Carrier</label>
          <select className={selectClass} value={data.selectedCarrier} onChange={(e) => handleCarrierChange(e.target.value)}>
            <option value="">Select carrier</option>
            {carrierList.map((c) => (
              <option key={c.name} value={c.name}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Product</label>
          <select
            className={selectClass}
            value={data.selectedProduct}
            onChange={(e) => handleProductChange(e.target.value)}
            disabled={!data.selectedCarrier}
          >
            <option value="">Select product</option>
            {selectedCarrierData?.products.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Par / IFA — Plan Design & Dividend Options */}
      {isPar && data.selectedProduct && (
        <div className="rounded-card border border-border bg-secondary/10 p-5 space-y-5">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Participating Whole Life — Policy Design</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Configure the plan structure and dividend election.</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FieldGroup label="Plan Design">
              <select className={selectClass} value={data.planDesign} onChange={(e) => updateData({ planDesign: e.target.value })}>
                <option value="">Select</option>
                <option value="20 Pay Life">20 Pay Life</option>
                <option value="Life Pay">Life Pay</option>
                <option value="10 Pay Life">10 Pay Life</option>
                <option value="65 Pay Life">65 Pay Life</option>
              </select>
            </FieldGroup>
            <FieldGroup label="Dividend Option">
              <select className={selectClass} value={data.dividendOption} onChange={(e) => updateData({ dividendOption: e.target.value })}>
                <option value="">Select</option>
                <option value="PUA">Paid-Up Additions (PUA)</option>
                <option value="EDO">Excelerator Deposit Option (EDO)</option>
                <option value="Dividend Deposit">Dividend Deposit (Savings Account)</option>
                <option value="Premium Reduction">Premium Reduction</option>
                <option value="Paid-Up Insurance">Paid-Up Insurance</option>
                <option value="Cash">Cash</option>
              </select>
            </FieldGroup>
          </div>

          {data.dividendOption === "EDO" && (
            <FieldGroup label="EDO Annual Deposit Amount" helper="Excelerator Deposit Option — additional deposit beyond base premium">
              <CurrencyInput value={data.edoAmount} onChange={(v) => updateData({ edoAmount: v })} placeholder="50,000" />
            </FieldGroup>
          )}

          <FieldGroup label="Premium Offset Intent">
            <div className="flex gap-2">
              {["Yes — at earliest opportunity", "No — pay premiums for full term", "To be determined"].map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => updateData({ premiumOffsetIntent: opt })}
                  className={cn(
                    "rounded-button px-3 py-2 text-xs font-medium transition-colors border",
                    data.premiumOffsetIntent === opt
                      ? "border-primary bg-primary/15 text-primary"
                      : "border-border text-muted-foreground hover:border-primary/50"
                  )}
                >
                  {opt}
                </button>
              ))}
            </div>
          </FieldGroup>

          <div className="rounded-card border border-warning/40 bg-warning/5 p-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="mt-0.5 h-4 w-4 rounded border-border accent-primary"
                checked={data.illustrationAcknowledged}
                onChange={(e) => updateData({ illustrationAcknowledged: e.target.checked })}
              />
              <span className="text-xs text-foreground leading-relaxed">
                <span className="font-semibold text-warning">Illustration Acknowledgment: </span>
                I confirm that I have reviewed the policy illustration with the client, explained that dividends are not guaranteed, and that the illustrated values are based on the current dividend scale which may change.
              </span>
            </label>
          </div>
        </div>
      )}

      {/* UL — Death Benefit, COI, Investment Allocation */}
      {isUL && data.selectedProduct && (
        <div className="rounded-card border border-border bg-secondary/10 p-5 space-y-5">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Universal Life — Policy Configuration</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Define the death benefit design, cost of insurance, and investment allocation.</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FieldGroup label="Death Benefit Design">
              <select className={selectClass} value={data.deathBenefitDesign} onChange={(e) => updateData({ deathBenefitDesign: e.target.value })}>
                <option value="">Select</option>
                <option value="Level">Level (Face Amount only)</option>
                <option value="Increasing — Face + CSV">Increasing (Face Amount + CSV)</option>
                <option value="Increasing — Face + Deposits">Increasing (Face Amount + Fund Value)</option>
              </select>
            </FieldGroup>
            <FieldGroup label="Cost of Insurance (COI) Structure">
              <select className={selectClass} value={data.coiStructure} onChange={(e) => updateData({ coiStructure: e.target.value })}>
                <option value="">Select</option>
                <option value="Level">Level (guaranteed never to increase)</option>
                <option value="YRT">YRT — Yearly Renewable Term (lower initial, increases with age)</option>
              </select>
            </FieldGroup>
          </div>

          <FieldGroup label="Planned Annual Premium" helper="Total planned deposit including base + excess premium">
            <CurrencyInput value={data.plannedPremium} onChange={(v) => updateData({ plannedPremium: v })} placeholder="25,000" />
          </FieldGroup>

          {/* Investment Allocation */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-semibold text-foreground">Investment Fund Allocation</h4>
                <p className="text-xs text-muted-foreground">Allocations must total 100%.</p>
              </div>
              <button onClick={addAllocation} className="flex items-center gap-1.5 rounded-button border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-secondary transition-colors">
                <Plus className="h-3.5 w-3.5" /> Add Fund
              </button>
            </div>

            <div className="overflow-x-auto rounded-card border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="px-3 py-2 text-xs font-medium uppercase text-muted-foreground">Fund / Account Name</th>
                    <th className="px-3 py-2 w-32 text-xs font-medium uppercase text-muted-foreground">% Allocation</th>
                    <th className="px-3 py-2 w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {data.investmentAllocations.map((a, i) => (
                    <tr key={i} className="border-b border-border/50 last:border-0">
                      <td className="px-2 py-2">
                        <input className={inputClass} placeholder="e.g. Guaranteed Interest Account, Equity Index Fund" value={a.accountName} onChange={(e) => updateAllocation(i, { accountName: e.target.value })} />
                      </td>
                      <td className="px-2 py-2">
                        <input className={`${inputClass} font-mono text-center`} placeholder="100" value={a.percentage} onChange={(e) => updateAllocation(i, { percentage: e.target.value })} />
                      </td>
                      <td className="px-2 py-2">
                        <button onClick={() => removeAllocation(i)} className="text-muted-foreground hover:text-destructive transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {data.investmentAllocations.length > 0 && (
                    <tr className="bg-secondary/20">
                      <td className="px-3 py-2 text-xs font-semibold text-foreground">Total</td>
                      <td className={cn("px-3 py-2 text-center text-xs font-mono font-bold", totalAllocPct === 100 ? "text-primary" : "text-warning")}>
                        {totalAllocPct}%
                      </td>
                      <td />
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {totalAllocPct !== 100 && totalAllocPct > 0 && (
              <p className="mt-1.5 text-xs text-warning">Allocations must total exactly 100% — currently {totalAllocPct}%.</p>
            )}
          </div>

          <div className="rounded-card border border-warning/40 bg-warning/5 p-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="mt-0.5 h-4 w-4 rounded border-border accent-primary"
                checked={data.exemptTestAcknowledged}
                onChange={(e) => updateData({ exemptTestAcknowledged: e.target.checked })}
              />
              <span className="text-xs text-foreground leading-relaxed">
                <span className="font-semibold text-warning">Exempt Test Acknowledgment: </span>
                I confirm that the planned premium deposits have been reviewed against the ITA exempt test limits and that over-funding scenarios have been discussed with the client to ensure the policy maintains its exempt status under the Income Tax Act.
              </span>
            </label>
          </div>
        </div>
      )}

      {/* Term — Period, Conversion, ROP */}
      {isTerm && data.selectedProduct && (
        <div className="rounded-card border border-border bg-secondary/10 p-5 space-y-5">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Term Life — Policy Options</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Select the term period and optional riders.</p>
          </div>

          <FieldGroup label="Term Period">
            <div className="flex gap-2">
              {["10", "15", "20", "25", "30"].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => updateData({ termPeriod: t })}
                  className={cn(
                    "rounded-button px-5 py-2 text-sm font-mono font-medium transition-colors border",
                    data.termPeriod === t
                      ? "border-primary bg-primary/15 text-primary"
                      : "border-border text-muted-foreground hover:border-primary/50"
                  )}
                >
                  {t} yr
                </button>
              ))}
            </div>
          </FieldGroup>

          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-foreground">Policy Options / Riders</h4>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-border accent-primary"
                checked={data.conversionPrivilege}
                onChange={(e) => updateData({ conversionPrivilege: e.target.checked })}
              />
              <span className="text-sm text-foreground">Conversion Privilege</span>
              <span className="text-xs text-muted-foreground">(Right to convert to permanent coverage without evidence of insurability)</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-border accent-primary"
                checked={data.ropOption}
                onChange={(e) => updateData({ ropOption: e.target.checked })}
              />
              <span className="text-sm text-foreground">Return of Premium (ROP) Option</span>
              <span className="text-xs text-muted-foreground">(Premiums returned if no claim made at term end — increases base premium)</span>
            </label>
          </div>
        </div>
      )}

      {/* Manulife Vitality */}
      {isManulife && data.selectedProduct && (
        <div className="rounded-card border border-border bg-secondary/10 p-5 space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Manulife Vitality Program</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Wellness rewards program available with Manulife products.</p>
          </div>

          <FieldGroup label="Vitality Enrollment">
            <div className="flex gap-2">
              {["Enrolling", "Declined", "Pending Decision"].map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => updateData({ vitalityEnrollment: opt })}
                  className={cn(
                    "rounded-button px-4 py-2 text-sm font-medium transition-colors border",
                    data.vitalityEnrollment === opt
                      ? "border-primary bg-primary/15 text-primary"
                      : "border-border text-muted-foreground hover:border-primary/50"
                  )}
                >
                  {opt}
                </button>
              ))}
            </div>
          </FieldGroup>

          {data.vitalityEnrollment === "Enrolling" && (
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-border accent-primary"
                checked={data.vitalityConsent}
                onChange={(e) => updateData({ vitalityConsent: e.target.checked })}
              />
              <span className="text-xs text-foreground leading-relaxed">
                Client has provided consent to share health and activity data with Manulife Vitality and understands the program terms.
              </span>
            </label>
          )}
        </div>
      )}

      {/* Recommendation Narrative */}
      {data.selectedProduct && (
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className="text-xs font-medium text-muted-foreground">Recommendation Narrative</label>
            <button
              onClick={() => setEditingNarrative(!editingNarrative)}
              className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
            >
              <Pencil className="h-3 w-3" /> {editingNarrative ? "Preview" : "Edit Narrative"}
            </button>
          </div>
          {editingNarrative ? (
            <textarea
              className={`${inputClass} min-h-[180px]`}
              value={narrative}
              onChange={(e) => updateData({ recommendationNarrative: e.target.value })}
            />
          ) : (
            <div className="rounded-card border border-border bg-secondary/20 p-4 text-sm leading-relaxed text-foreground whitespace-pre-line">
              {narrative}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
