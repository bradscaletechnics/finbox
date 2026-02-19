import { useNavigate } from "react-router-dom";
import { useDiscovery } from "../DiscoveryContext";
import { Pencil, FileDown, Save, Package } from "lucide-react";

function Section({ title, onEdit, children }: { title: string; onEdit: () => void; children: React.ReactNode }) {
  return (
    <div className="rounded-card border border-border bg-card p-5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <button
          onClick={onEdit}
          className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
        >
          <Pencil className="h-3 w-3" /> Edit
        </button>
      </div>
      {children}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="flex justify-between border-b border-border/30 py-1.5 text-sm last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-foreground font-medium">{value}</span>
    </div>
  );
}

const fmt = (v: string) => v ? `$${Number(v).toLocaleString("en-US")}` : "";

export function ReviewSummary() {
  const { data, setCurrentStep } = useDiscovery();
  const navigate = useNavigate();
  const fullName = [data.firstName, data.middleName, data.lastName].filter(Boolean).join(" ");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Review & Summary</h2>
        <p className="mt-1 text-sm text-muted-foreground">Review all collected information before generating the handoff package.</p>
      </div>

      <Section title="Personal Information" onEdit={() => setCurrentStep(1)}>
        <Row label="Full Name" value={fullName} />
        <Row label="Date of Birth" value={data.dateOfBirth} />
        <Row label="Phone" value={data.phone} />
        <Row label="Email" value={data.email} />
        <Row label="Address" value={[data.street, data.city, data.state, data.zip].filter(Boolean).join(", ")} />
        <Row label="Marital Status" value={data.maritalStatus} />
        <Row label="Occupation" value={data.occupation} />
        <Row label="Employer" value={data.employerName} />
        <Row label="Annual Income" value={fmt(data.annualIncome)} />
        {data.beneficiaries.filter((b) => b.name).length > 0 && (
          <div className="mt-2 pt-2 border-t border-border/30">
            <p className="text-xs font-medium text-muted-foreground mb-1">Beneficiaries</p>
            {data.beneficiaries.filter((b) => b.name).map((b, i) => (
              <p key={i} className="text-sm text-foreground">{b.name} ({b.relationship}) — {b.percentage}%</p>
            ))}
          </div>
        )}
      </Section>

      <Section title="Financial Profile" onEdit={() => setCurrentStep(2)}>
        <Row label="Total Liquid Assets" value={fmt(data.totalLiquidAssets)} />
        <Row label="Total Net Worth" value={fmt(data.totalNetWorth)} />
        <Row label="Monthly Expenses" value={fmt(data.monthlyExpenses)} />
        <Row label="Tax Bracket" value={data.taxBracket} />
        <Row label="Filing Status" value={data.filingStatus} />
        <Row label="Source of Funds" value={data.sourceOfFunds} />
      </Section>

      <Section title="Current Coverage" onEdit={() => setCurrentStep(3)}>
        <Row label="Existing Policies" value={`${data.existingPolicies.length} policy(ies)`} />
        <Row label="Existing Annuities" value={`${data.existingAnnuities.length} annuity(ies)`} />
        <Row label="Replacing Coverage" value={data.willReplaceCoverage ? "Yes" : "No"} />
      </Section>

      <Section title="Goals & Objectives" onEdit={() => setCurrentStep(4)}>
        <Row label="Primary Goals" value={data.primaryGoals.join(", ")} />
        <Row label="Time Horizon" value={`${data.investmentTimeHorizon} years`} />
        <Row label="Liquidity Needs" value={data.liquidityNeeds} />
        <Row label="Target Retirement Age" value={data.targetRetirementAge} />
      </Section>

      <Section title="Risk Assessment" onEdit={() => setCurrentStep(5)}>
        <Row label="Questions Answered" value={`${Object.keys(data.riskAnswers).length}/5`} />
      </Section>

      <Section title="Product Recommendation" onEdit={() => setCurrentStep(7)}>
        <Row label="Carrier" value={data.selectedCarrier} />
        <Row label="Product" value={data.selectedProduct} />
      </Section>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 pt-4">
        <button onClick={() => navigate("/handoff-package")} className="flex items-center gap-2 rounded-button bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
          <Package className="h-4 w-4" /> Generate Handoff Package
        </button>
        <button className="flex items-center gap-2 rounded-button border border-border px-5 py-2.5 text-sm font-medium text-foreground hover:bg-secondary transition-colors">
          <Save className="h-4 w-4" /> Save as Draft
        </button>
        <button onClick={() => navigate("/handoff-package")} className="flex items-center gap-2 rounded-button border border-border px-5 py-2.5 text-sm font-medium text-foreground hover:bg-secondary transition-colors">
          <FileDown className="h-4 w-4" /> Export to PDF
        </button>
      </div>
    </div>
  );
}
