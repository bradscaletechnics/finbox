import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Download, Send } from "lucide-react";
import { useDiscovery } from "@/components/discovery/DiscoveryContext";
import { getRiskLabel } from "@/lib/risk";
import { getAdvisorProfile } from "@/lib/advisor";
import { HandoffLoader } from "@/components/ui/HandoffLoader";

const fmt = (v: string) => (v ? `$${Number(v).toLocaleString("en-US")}` : "—");
const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
const caseId = "IFA-2024-" + String(Math.floor(Math.random() * 900 + 100));

function SectionTitle({ number, title }: { number: number; title: string }) {
  return (
    <div className="mb-4 flex items-center gap-3 border-b-2 border-[hsl(215,20%,90%)] pb-2">
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[hsl(157,100%,42%)] text-xs font-bold text-[hsl(216,55%,10%)]">
        {number}
      </span>
      <h2 className="text-base font-semibold tracking-tight text-[hsl(216,55%,10%)]">{title}</h2>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  if (!value || value === "—") return null;
  return (
    <div className="py-1">
      <span className="text-xs font-medium text-[hsl(218,18%,45%)]">{label}</span>
      <p className="text-sm font-medium text-[hsl(216,55%,10%)]">{value}</p>
    </div>
  );
}

function CheckItem({ label, checked = true }: { label: string; checked?: boolean }) {
  return (
    <div className="flex items-center gap-2 py-0.5">
      <div className={`flex h-4 w-4 items-center justify-center rounded-sm ${checked ? "bg-[hsl(157,100%,42%)]" : "border border-[hsl(215,20%,80%)]"}`}>
        {checked && (
          <svg className="h-3 w-3 text-[hsl(216,55%,10%)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
      <span className={`text-sm ${checked ? "text-[hsl(216,55%,10%)]" : "text-[hsl(218,18%,62%)]"}`}>{label}</span>
    </div>
  );
}

export default function HandoffPackage() {
  const advisor = getAdvisorProfile();
  const navigate = useNavigate();
  const { data } = useDiscovery();
  const [loading, setLoading] = useState(true);
  const fullName = [data.firstName, data.middleName, data.lastName].filter(Boolean).join(" ") || "Client Name";
  const risk = getRiskLabel(data.riskAnswers);
  const age = data.dateOfBirth ? Math.floor((Date.now() - new Date(data.dateOfBirth).getTime()) / 31557600000) : "—";

  const handleLoaderComplete = useCallback(() => setLoading(false), []);

  if (loading) {
    return <HandoffLoader onComplete={handleLoaderComplete} />;
  }

  return (
    <div className="min-h-screen bg-[hsl(210,20%,96%)]" style={{ opacity: 1, animation: "fade-in 0.4s ease-out" }}>
      {/* Action Bar */}
      <div data-print-hide className="sticky top-0 z-30 flex items-center justify-between border-b border-[hsl(215,20%,88%)] bg-[hsl(0,0%,100%)] px-6 py-3">
        <button onClick={() => navigate("/client-discovery")} className="flex items-center gap-2 text-sm font-medium text-[hsl(218,18%,45%)] hover:text-[hsl(216,55%,10%)] transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Discovery
        </button>
        <div className="flex gap-2">
          <button onClick={() => window.print()} className="flex items-center gap-2 rounded-md border border-[hsl(215,20%,85%)] bg-[hsl(0,0%,100%)] px-4 py-2 text-sm font-medium text-[hsl(216,55%,10%)] hover:bg-[hsl(210,20%,96%)] transition-colors">
            <Download className="h-4 w-4" /> Download PDF
          </button>
          <button className="flex items-center gap-2 rounded-md bg-[hsl(157,100%,42%)] px-4 py-2 text-sm font-medium text-[hsl(216,55%,10%)] hover:opacity-90 transition-colors">
            <Send className="h-4 w-4" /> Send to Closer
          </button>
        </div>
      </div>

      {/* Document */}
      <div className="print-document mx-auto my-8 max-w-[816px] rounded-lg bg-[hsl(0,0%,100%)] shadow-[0_2px_16px_rgba(0,0,0,0.08)]">
        <div className="px-12 py-10">
          {/* Header */}
          <div className="mb-8 flex items-start justify-between border-b-2 border-[hsl(157,100%,42%)] pb-6">
            <div>
              <div className="mb-1 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[hsl(157,100%,42%)]">
                  <span className="text-sm font-bold text-[hsl(216,55%,10%)]">F</span>
                </div>
                <span className="text-lg font-bold text-[hsl(216,55%,10%)]">FinBox</span>
              </div>
              <h1 className="mt-3 text-2xl font-bold tracking-tight text-[hsl(216,55%,10%)]">Case Handoff Package</h1>
            </div>
            <div className="text-right text-xs text-[hsl(218,18%,45%)]">
              <p><span className="font-semibold">Case ID:</span> {caseId}</p>
              <p><span className="font-semibold">Generated:</span> {today}</p>
              <p><span className="font-semibold">Advisor:</span> {advisor.fullName}</p>
              <p><span className="font-semibold">Agency:</span> {advisor.agency}</p>
            </div>
          </div>

          {/* Section 1 — Client Summary */}
          <div className="mb-8">
            <SectionTitle number={1} title="Client Summary" />
            <div className="grid grid-cols-2 gap-x-10 gap-y-1">
              <div>
                <Field label="Full Name" value={fullName} />
                <Field label="Date of Birth" value={data.dateOfBirth || "—"} />
                <Field label="Age" value={String(age)} />
                <Field label="Phone" value={data.phone || "—"} />
                <Field label="Email" value={data.email || "—"} />
                <Field label="Address" value={[data.street, data.city, data.state, data.zip].filter(Boolean).join(", ") || "—"} />
                <Field label="Marital Status" value={data.maritalStatus || "—"} />
                <Field label="Occupation" value={data.occupation || "—"} />
              </div>
              <div className="rounded-lg bg-[hsl(210,20%,97%)] p-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[hsl(218,18%,45%)]">Financial Snapshot</p>
                <Field label="Annual Income" value={fmt(data.annualIncome)} />
                <Field label="Total Net Worth" value={fmt(data.totalNetWorth)} />
                <Field label="Total Liquid Assets" value={fmt(data.totalLiquidAssets)} />
                <Field label="Tax Bracket" value={data.taxBracket || "—"} />
                <Field label="Monthly Expenses" value={fmt(data.monthlyExpenses)} />
              </div>
            </div>
          </div>

          {/* Section 2 — Discovery Summary */}
          <div className="mb-8">
            <SectionTitle number={2} title="Discovery Summary" />
            <div className="grid grid-cols-2 gap-x-10 gap-y-1">
              <div>
                <Field label="Primary Goals" value={data.primaryGoals.length > 0 ? data.primaryGoals.join(", ") : "—"} />
                <Field label="Investment Time Horizon" value={data.investmentTimeHorizon ? `${data.investmentTimeHorizon} years` : "—"} />
                <Field label="Target Retirement Age" value={data.targetRetirementAge || "—"} />
                <Field label="Liquidity Needs" value={data.liquidityNeeds || "—"} />
              </div>
              <div>
                <Field label="Risk Assessment" value={risk} />
                <Field label="Questions Answered" value={`${Object.keys(data.riskAnswers).length}/5`} />
                <Field label="Existing Policies" value={`${data.existingPolicies.length} policy(ies)`} />
                <Field label="Existing Annuities" value={`${data.existingAnnuities.length} annuity(ies)`} />
                <Field label="Replacing Coverage" value={data.willReplaceCoverage ? "Yes" : "No"} />
              </div>
            </div>
          </div>

          {/* Section 3 — Suitability Determination */}
          <div className="mb-8">
            <SectionTitle number={3} title="Suitability Determination" />
            <div className="mb-4 rounded-lg border border-[hsl(215,20%,90%)] bg-[hsl(210,20%,97%)] p-4 text-sm leading-relaxed text-[hsl(216,55%,10%)]">
              {data.recommendationNarrative ||
                `Based on ${fullName}'s financial profile, ${data.investmentTimeHorizon || "10"}-year time horizon, ${risk} risk tolerance, and primary goal of ${data.primaryGoals[0] || "wealth management"}, an Immediate Financial Arrangement (IFA) product has been determined suitable. The client's liquid assets of ${fmt(data.totalLiquidAssets)} and net worth of ${fmt(data.totalNetWorth)} indicate sufficient financial resources for the recommended product. The client's ${risk.toLowerCase()} risk profile aligns with the principal protection features of the recommended product.`}
            </div>
            <div className="mb-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[hsl(218,18%,45%)]">Compliance Checklist</p>
              <CheckItem label="Client age appropriate for surrender period" />
              <CheckItem label="Liquidity needs addressed" checked={data.liquidityNeeds === "No" || (data.liquidityNeeds === "Yes" && !!data.liquidityExplanation)} />
              <CheckItem label="Replacement disclosure completed if applicable" checked={!data.willReplaceCoverage || data.replacementDisclosureAcknowledged} />
              <CheckItem label="Source of funds documented" checked={!!data.sourceOfFunds} />
              <CheckItem label="Risk tolerance assessment complete" checked={Object.keys(data.riskAnswers).length === 5} />
            </div>
            {data.advisorNotes && (
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-[hsl(218,18%,45%)]">Advisor Notes</p>
                <p className="text-sm text-[hsl(216,55%,10%)]">{data.advisorNotes}</p>
              </div>
            )}
          </div>

          {/* Section 4 — Product Recommendation */}
          <div className="mb-8">
            <SectionTitle number={4} title="Product Recommendation" />
            <div className="grid grid-cols-2 gap-x-10 gap-y-1">
              <div>
                <Field label="Carrier" value={data.selectedCarrier || "—"} />
                <Field label="Product" value={data.selectedProduct || "—"} />
              </div>
              <div className="rounded-lg bg-[hsl(210,20%,97%)] p-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[hsl(218,18%,45%)]">Key Features</p>
                <ul className="space-y-1 text-sm text-[hsl(216,55%,10%)]">
                  <li>• Principal protection with 0% floor</li>
                  <li>• Tax-deferred growth potential</li>
                  <li>• Guaranteed lifetime income rider</li>
                  <li>• Flexible premium options</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Section 5 — Application Data */}
          <div className="mb-8">
            <SectionTitle number={5} title="Application Data" />
            <div className="grid grid-cols-2 gap-x-10 gap-y-1">
              <div>
                <Field label="Full Name" value={fullName} />
                <Field label="SSN" value={data.ssn ? `***-**-${data.ssn.slice(-4)}` : "—"} />
                <Field label="Date of Birth" value={data.dateOfBirth || "—"} />
                <Field label="Employment Status" value={data.employmentStatus || "—"} />
                <Field label="Employer" value={data.employerName || "—"} />
                <Field label="Filing Status" value={data.filingStatus || "—"} />
                <Field label="Source of Funds" value={data.sourceOfFunds || "—"} />
              </div>
              <div>
                {data.beneficiaries.filter((b) => b.name).length > 0 ? (
                  <div>
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-[hsl(218,18%,45%)]">Beneficiaries</p>
                    {data.beneficiaries.filter((b) => b.name).map((b, i) => (
                      <p key={i} className="text-sm text-[hsl(216,55%,10%)]">{b.name} ({b.relationship}) — {b.percentage}%</p>
                    ))}
                  </div>
                ) : (
                  <Field label="Beneficiaries" value="None specified" />
                )}
                {data.willReplaceCoverage && (
                  <div className="mt-3">
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-[hsl(218,18%,45%)]">Replacement Details</p>
                    <Field label="Replacing Existing Coverage" value="Yes" />
                    <Field label="Disclosure Acknowledged" value={data.replacementDisclosureAcknowledged ? "Yes" : "No"} />
                  </div>
                )}
                {(data.sourceOfFunds === "1035 Exchange" || data.sourceOfFunds === "401k Rollover") && (
                  <div className="mt-3">
                    <Field label="Existing Policy Details" value={data.existingPolicyDetails || "—"} />
                    <Field label="Existing Account Number" value={data.existingAccountNumber || "—"} />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section 6 — Advisor Notes & Follow-ups */}
          <div className="mb-8">
            <SectionTitle number={6} title="Advisor Notes & Follow-ups" />
            <div className="rounded-lg border border-[hsl(215,20%,90%)] bg-[hsl(210,20%,97%)] p-4">
              <p className="text-sm text-[hsl(216,55%,10%)]">
                {data.additionalNotes || "No additional notes recorded during discovery session."}
              </p>
            </div>
            <div className="mt-3">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[hsl(218,18%,45%)]">Outstanding Items</p>
              <ul className="space-y-1 text-sm text-[hsl(216,55%,10%)]">
                {Object.keys(data.riskAnswers).length < 5 && <li>• Complete risk assessment questionnaire</li>}
                {!data.selectedCarrier && <li>• Finalize carrier and product selection</li>}
                {data.beneficiaries.filter((b) => b.name).length === 0 && <li>• Add beneficiary information</li>}
                {!data.sourceOfFunds && <li>• Document source of funds</li>}
                {Object.keys(data.riskAnswers).length === 5 && data.selectedCarrier && data.beneficiaries.filter((b) => b.name).length > 0 && data.sourceOfFunds && (
                  <li>• All documentation complete — ready for submission</li>
                )}
              </ul>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-12 border-t border-[hsl(215,20%,90%)] pt-4 flex items-center justify-between text-[10px] text-[hsl(218,18%,62%)]">
            <span>Generated by FinBox | {today} | Confidential</span>
            <span>Page 1 of 1</span>
          </div>
        </div>
      </div>
    </div>
  );
}
