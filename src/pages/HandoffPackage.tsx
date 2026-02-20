import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Download, Send } from "lucide-react";
import { useDiscovery } from "@/components/discovery/DiscoveryContext";
import { getRiskLabel } from "@/lib/risk";
import { getAdvisorProfile } from "@/lib/advisor";
import { HandoffLoader } from "@/components/ui/HandoffLoader";

const fmt = (v: string) => (v ? `$${Number(v).toLocaleString("en-CA")}` : "—");
const today = new Date().toLocaleDateString("en-CA", { year: "numeric", month: "long", day: "numeric" });
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
                <Field label="Address" value={[data.street, data.city, data.province, data.postalCode].filter(Boolean).join(", ") || "—"} />
                <Field label="Marital Status" value={data.maritalStatus || "—"} />
                <Field label="Occupation" value={data.occupation || "—"} />
              </div>
              <div className="rounded-lg bg-[hsl(210,20%,97%)] p-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[hsl(218,18%,45%)]">Financial Snapshot</p>
                <Field label="Annual Earned Income" value={fmt(data.annualIncome)} />
                <Field label="Other Income" value={fmt(data.otherIncome)} />
                <Field label="Total Assets" value={fmt(data.totalLiquidAssets)} />
                <Field label="Total Liabilities" value={fmt(data.totalLiabilities)} />
                <Field label="Total Net Worth (Canadian)" value={fmt(data.totalNetWorth)} />
                <Field label="Total Foreign Net Worth" value={fmt(data.foreignNetWorth)} />
                <Field label="Marginal Tax Rate" value={data.taxBracket || "—"} />
                <Field label="Reason for Purchase" value={data.reasonForPurchase || "—"} />
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
                <Field label="Liquidity Needs" value={data.liquidityNeeds || "—"} />
                <Field label="Application Ever Declined/Rated" value={data.applicationEverDeclined || "—"} />
                <Field label="Pending Application Elsewhere" value={data.pendingApplicationElsewhere || "—"} />
              </div>
              <div>
                <Field label="Risk Assessment" value={risk} />
                <Field label="Questions Answered" value={`${Object.keys(data.riskAnswers).length}/5`} />
                <Field label="Existing Policies" value={`${data.existingPolicies.length} policy(ies)`} />
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
              <CheckItem label="Client identity verified (name, DOB, SIN)" checked={!!(data.firstName && data.lastName && data.dateOfBirth && data.sin)} />
              <CheckItem label="Source of funds documented" checked={!!data.sourceOfFunds} />
              <CheckItem label="Face amount and reason for purchase documented" checked={!!(data.faceAmountRequested && data.reasonForPurchase)} />
              <CheckItem label="Risk tolerance assessment complete (5/5)" checked={Object.keys(data.riskAnswers).length === 5} />
              <CheckItem label="Liquidity needs addressed" checked={data.liquidityNeeds === "No" || (data.liquidityNeeds === "Yes" && !!data.liquidityExplanation)} />
              <CheckItem label="Replacement disclosure completed (if applicable)" checked={!data.willReplaceCoverage || data.replacementDisclosureAcknowledged} />
              {data.ownerType === "Corporate" && (
                <>
                  <CheckItem label="FINTRAC: UBO declarations obtained (25%+ owners)" checked={data.uboDeclarations.length > 0} />
                  <CheckItem label="FINTRAC: PEP/HIO declaration obtained" checked={!!data.pepHioDeclaration} />
                  <CheckItem label="FINTRAC: Third-party payor declaration obtained" checked={!!data.thirdPartyPayorDeclaration} />
                </>
              )}
              {data.productCategory === "IFA" && (
                <>
                  <CheckItem label="IFA: Collateral assignment intent documented" checked={!!data.collateralAssignmentIntent} />
                  <CheckItem label="IFA: Tax counsel named and NCPI addressed" checked={!!(data.taxCounselName && data.ncpiDeductibilityConfirmed)} />
                  <CheckItem label="IFA: Legal counsel named" checked={!!data.legalCounselName} />
                  <CheckItem label="IFA: Risk acknowledgment obtained" checked={data.ifaRiskAcknowledged} />
                </>
              )}
              {(data.productCategory === "Participating Whole Life" || data.productCategory === "IFA") && (
                <CheckItem label="Par: Policy illustration reviewed and acknowledged" checked={data.illustrationAcknowledged} />
              )}
              {data.productCategory === "Universal Life" && (
                <CheckItem label="UL: Exempt test acknowledged" checked={data.exemptTestAcknowledged} />
              )}
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
            <div className="grid grid-cols-2 gap-x-10 gap-y-1 mb-4">
              <div>
                <Field label="Product Category" value={data.productCategory || "—"} />
                <Field label="Carrier" value={data.selectedCarrier || "—"} />
                <Field label="Product" value={data.selectedProduct || "—"} />
                <Field label="Face Amount" value={fmt(data.faceAmountRequested)} />
                <Field label="Reason for Purchase" value={data.reasonForPurchase || "—"} />
              </div>
              {/* Par / IFA */}
              {(data.productCategory === "Participating Whole Life" || data.productCategory === "IFA") && (
                <div className="rounded-lg bg-[hsl(210,20%,97%)] p-4">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[hsl(218,18%,45%)]">Par Policy Design</p>
                  <Field label="Plan Design" value={data.planDesign || "—"} />
                  <Field label="Dividend Option" value={data.dividendOption || "—"} />
                  {data.dividendOption === "EDO" && <Field label="EDO Annual Deposit" value={fmt(data.edoAmount)} />}
                  <Field label="Premium Offset" value={data.premiumOffsetIntent || "—"} />
                  <Field label="Illustration Acknowledged" value={data.illustrationAcknowledged ? "Yes ✓" : "No — required"} />
                </div>
              )}
              {/* UL */}
              {data.productCategory === "Universal Life" && (
                <div className="rounded-lg bg-[hsl(210,20%,97%)] p-4">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[hsl(218,18%,45%)]">UL Policy Configuration</p>
                  <Field label="Death Benefit Design" value={data.deathBenefitDesign || "—"} />
                  <Field label="COI Structure" value={data.coiStructure || "—"} />
                  <Field label="Planned Annual Premium" value={fmt(data.plannedPremium)} />
                  <Field label="Exempt Test Acknowledged" value={data.exemptTestAcknowledged ? "Yes ✓" : "No — required"} />
                  {data.investmentAllocations.filter((a) => a.accountName).length > 0 && (
                    <div className="mt-2">
                      <p className="text-xs font-semibold text-[hsl(218,18%,45%)] mb-1">Fund Allocations</p>
                      {data.investmentAllocations.filter((a) => a.accountName).map((a, i) => (
                        <p key={i} className="text-sm text-[hsl(216,55%,10%)]">{a.accountName}: {a.percentage}%</p>
                      ))}
                    </div>
                  )}
                </div>
              )}
              {/* Term */}
              {data.productCategory === "Term Life" && (
                <div className="rounded-lg bg-[hsl(210,20%,97%)] p-4">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[hsl(218,18%,45%)]">Term Policy Options</p>
                  <Field label="Term Period" value={data.termPeriod ? `${data.termPeriod} years` : "—"} />
                  <Field label="Conversion Privilege" value={data.conversionPrivilege ? "Yes" : "No"} />
                  <Field label="Return of Premium (ROP)" value={data.ropOption ? "Yes" : "No"} />
                </div>
              )}
            </div>

            {/* IFA Lending Details */}
            {data.productCategory === "IFA" && (
              <div className="rounded-lg border border-[hsl(215,20%,90%)] bg-[hsl(210,20%,97%)] p-4 mb-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[hsl(218,18%,45%)]">IFA — Collateral Lending Details</p>
                <div className="grid grid-cols-2 gap-x-10 gap-y-1">
                  <div>
                    <Field label="Collateral Assignment Intent" value={data.collateralAssignmentIntent || "—"} />
                    <Field label="Lender" value={data.lenderName || "—"} />
                    <Field label="Estimated Loan Amount" value={fmt(data.estimatedLoanAmount)} />
                    <Field label="Loan Purpose" value={data.loanPurpose || "—"} />
                  </div>
                  <div>
                    <Field label="Key Person Value Method" value={data.keyPersonValueMethod || "—"} />
                    <Field label="Key Person Value Amount" value={fmt(data.keyPersonValueAmount)} />
                    <Field label="Shareholder Agreement on File" value={data.shareholderAgreementOnFile || "—"} />
                    <Field label="Tax Counsel" value={data.taxCounselName || "—"} />
                    <Field label="Legal Counsel" value={data.legalCounselName || "—"} />
                    <Field label="NCPI Deductibility" value={data.ncpiDeductibilityConfirmed || "—"} />
                    <Field label="IFA Risk Acknowledged" value={data.ifaRiskAcknowledged ? "Yes ✓" : "No — required"} />
                  </div>
                </div>
              </div>
            )}

            {/* Manulife Vitality */}
            {data.selectedCarrier === "Manulife" && data.vitalityEnrollment && (
              <div className="rounded-lg border border-[hsl(215,20%,90%)] bg-[hsl(210,20%,97%)] p-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[hsl(218,18%,45%)]">Manulife Vitality</p>
                <Field label="Vitality Enrollment" value={data.vitalityEnrollment} />
                {data.vitalityEnrollment === "Enrolling" && (
                  <Field label="Vitality Consent" value={data.vitalityConsent ? "Obtained ✓" : "Pending"} />
                )}
              </div>
            )}
          </div>

          {/* Section 5 — Application Data */}
          <div className="mb-8">
            <SectionTitle number={5} title="Application Data" />
            <div className="grid grid-cols-2 gap-x-10 gap-y-1">
              <div>
                <Field label="Full Name" value={fullName} />
                <Field label="SIN" value={data.sin ? `***-***-${data.sin.slice(-3)}` : "—"} />
                <Field label="Date of Birth" value={data.dateOfBirth || "—"} />
                <Field label="Gender" value={data.gender || "—"} />
                <Field label="Smoker Status" value={data.smokerStatus || "—"} />
                <Field label="Canadian Status" value={data.canadianStatus || "—"} />
                <Field label="Employment Status" value={data.employmentStatus || "—"} />
                <Field label="Employer" value={data.employerName || "—"} />
                <Field label="Province" value={data.province || "—"} />
                <Field label="Source of Funds" value={data.sourceOfFunds || "—"} />
                {data.ownerType === "Corporate" && (
                  <>
                    <Field label="Policy Owner" value={data.corporateName || "—"} />
                    <Field label="Business Number" value={data.corporateBusinessNumber || "—"} />
                    <Field label="Incorporation #" value={data.corporateIncorporationNumber || "—"} />
                  </>
                )}
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
                {(data.sourceOfFunds === "Policy Transfer/Exchange" || data.sourceOfFunds === "RRSP Withdrawal" || data.sourceOfFunds === "TFSA Withdrawal") && (
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
                {Object.keys(data.riskAnswers).length < 5 && <li>• Complete risk assessment questionnaire ({Object.keys(data.riskAnswers).length}/5 answered)</li>}
                {!data.selectedCarrier && <li>• Finalize carrier and product selection</li>}
                {!data.faceAmountRequested && <li>• Specify face amount requested</li>}
                {data.beneficiaries.filter((b) => b.name).length === 0 && <li>• Add beneficiary information</li>}
                {!data.sourceOfFunds && <li>• Document source of funds</li>}
                {data.productCategory === "IFA" && !data.taxCounselName && <li>• Name tax counsel and confirm NCPI deductibility</li>}
                {data.productCategory === "IFA" && !data.ifaRiskAcknowledged && <li>• Obtain IFA risk acknowledgment</li>}
                {data.productCategory === "IFA" && data.ownerType === "Corporate" && data.uboDeclarations.length === 0 && <li>• Complete FINTRAC UBO declarations</li>}
                {(data.productCategory === "Participating Whole Life" || data.productCategory === "IFA") && !data.illustrationAcknowledged && <li>• Review illustration with client and obtain acknowledgment</li>}
                {data.productCategory === "Universal Life" && !data.exemptTestAcknowledged && <li>• Review UL exempt test with client and obtain acknowledgment</li>}
                {Object.keys(data.riskAnswers).length === 5 && data.selectedCarrier && data.beneficiaries.filter((b) => b.name).length > 0 && data.sourceOfFunds && data.faceAmountRequested && (
                  <li>• Core documentation complete — verify product-specific items above</li>
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
