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

function Flag({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  const isYes = value === "Yes";
  return (
    <div className="flex justify-between border-b border-border/30 py-1.5 text-sm last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className={`font-medium ${isYes ? "text-warning" : "text-foreground"}`}>{value}</span>
    </div>
  );
}

const fmt = (v: string) => v ? `$${Number(v).toLocaleString("en-CA")}` : "";

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

      {/* Personal Information */}
      <Section title="Personal Information" onEdit={() => setCurrentStep(1)}>
        <Row label="Full Name" value={fullName} />
        <Row label="Date of Birth" value={data.dateOfBirth} />
        <Row label="Gender" value={data.gender} />
        <Row label="Smoker Status" value={data.smokerStatus} />
        <Row label="Canadian Status" value={data.canadianStatus} />
        <Row label="Phone" value={data.phone} />
        <Row label="Email" value={data.email} />
        <Row label="Address" value={[data.street, data.city, data.province, data.postalCode].filter(Boolean).join(", ")} />
        <Row label="Marital Status" value={data.maritalStatus} />
        <Row label="Occupation" value={data.occupation} />
        <Row label="Employer" value={data.employerName} />
        <Row label="Annual Earned Income" value={fmt(data.annualIncome)} />
        {data.beneficiaries.filter((b) => b.name).length > 0 && (
          <div className="mt-2 pt-2 border-t border-border/30">
            <p className="text-xs font-medium text-muted-foreground mb-1">Beneficiaries</p>
            {data.beneficiaries.filter((b) => b.name).map((b, i) => (
              <p key={i} className="text-sm text-foreground">{b.name} ({b.relationship}) — {b.percentage}%</p>
            ))}
          </div>
        )}
        {data.ownerType && (
          <div className="mt-2 pt-2 border-t border-border/30">
            <p className="text-xs font-medium text-muted-foreground mb-1">Policy Owner</p>
            <p className="text-sm text-foreground">{data.ownerType}{data.corporateName ? ` — ${data.corporateName}` : ""}</p>
            {data.corporateBusinessNumber && <p className="text-sm text-muted-foreground">BN: {data.corporateBusinessNumber}</p>}
            {data.corporateIncorporationNumber && <p className="text-sm text-muted-foreground">Inc. #: {data.corporateIncorporationNumber}</p>}
          </div>
        )}
      </Section>

      {/* Financial Profile */}
      <Section title="Financial Profile" onEdit={() => setCurrentStep(2)}>
        <Row label="Total Assets" value={fmt(data.totalLiquidAssets)} />
        <Row label="Total Liabilities" value={fmt(data.totalLiabilities)} />
        <Row label="Total Net Worth (Canadian)" value={fmt(data.totalNetWorth)} />
        <Row label="Total Foreign Net Worth" value={fmt(data.foreignNetWorth)} />
        <Row label="Annual Earned Income" value={fmt(data.annualIncome)} />
        <Row label="Other Income" value={fmt(data.otherIncome)} />
        <Row label="Marginal Tax Rate" value={data.taxBracket} />
        <Row label="Tax Province" value={data.filingStatus} />
        <Row label="Face Amount Requested" value={fmt(data.faceAmountRequested)} />
        <Row label="Reason for Purchase" value={data.reasonForPurchase} />
        <Row label="Source of Funds" value={data.sourceOfFunds} />
        {data.ownerType === "Corporate" && data.corporateNatureOfBusiness && (
          <div className="mt-2 pt-2 border-t border-border/30">
            <p className="text-xs font-medium text-muted-foreground mb-1">Corporate Details</p>
            <Row label="Nature of Business" value={data.corporateNatureOfBusiness} />
            <Row label="Business Assets" value={fmt(data.corporateBusinessAssets)} />
            <Row label="Business Liabilities" value={fmt(data.corporateBusinessLiabilities)} />
            <Row label="Net Profit (Last Year)" value={fmt(data.corporateNetProfitLastYear)} />
            <Row label="Net Profit (Previous Year)" value={fmt(data.corporateNetProfitPrevYear)} />
          </div>
        )}
        {data.productCategory === "IFA" && (
          <div className="mt-2 pt-2 border-t border-border/30">
            <p className="text-xs font-medium text-muted-foreground mb-1">IFA — Collateral & Lending</p>
            <Row label="Collateral Assignment Intent" value={data.collateralAssignmentIntent} />
            <Row label="Lender" value={data.lenderName} />
            <Row label="Estimated Loan Amount" value={fmt(data.estimatedLoanAmount)} />
            <Row label="Loan Purpose" value={data.loanPurpose} />
            <Row label="Key Person Value Method" value={data.keyPersonValueMethod} />
            <Row label="Key Person Value Amount" value={fmt(data.keyPersonValueAmount)} />
            <Row label="Shareholder Agreement on File" value={data.shareholderAgreementOnFile} />
            <Row label="Tax Counsel" value={data.taxCounselName} />
            <Row label="Legal Counsel" value={data.legalCounselName} />
            <Row label="NCPI Deductibility" value={data.ncpiDeductibilityConfirmed} />
            <Row label="IFA Risk Acknowledged" value={data.ifaRiskAcknowledged ? "Yes" : "No"} />
          </div>
        )}
      </Section>

      {/* Current Coverage */}
      <Section title="Current Coverage" onEdit={() => setCurrentStep(3)}>
        <Row label="Existing Policies" value={data.existingPolicies.length > 0 ? `${data.existingPolicies.length} policy(ies) on file` : "None"} />
        <Row label="Replacing Coverage" value={data.willReplaceCoverage ? "Yes" : "No"} />
        <Flag label="Application Ever Declined/Rated" value={data.applicationEverDeclined} />
        <Flag label="Pending Application Elsewhere" value={data.pendingApplicationElsewhere} />
      </Section>

      {/* Goals & Objectives */}
      <Section title="Goals & Objectives" onEdit={() => setCurrentStep(4)}>
        <Row label="Product Category" value={data.productCategory} />
        <Row label="Primary Goals" value={data.primaryGoals.join(", ")} />
        <Row label="Time Horizon" value={data.investmentTimeHorizon ? `${data.investmentTimeHorizon} years` : ""} />
        <Row label="Liquidity Needs" value={data.liquidityNeeds} />
      </Section>

      {/* Lifestyle & Underwriting */}
      <Section title="Lifestyle & Underwriting" onEdit={() => setCurrentStep(5)}>
        <Flag label="Travel Outside North America" value={data.travelOutsideNA} />
        <Flag label="Aviation Activity" value={data.aviationActivity} />
        <Flag label="Hazardous Sports" value={data.hazardousSports} />
        <Flag label="DUI Conviction (last 10 yrs)" value={data.duiConviction} />
        <Flag label="Driving Offences (last 3 yrs)" value={data.drivingOffences} />
        <Flag label="Criminal / Regulatory Offence" value={data.criminalOffence} />
        <Flag label="Tobacco / Nicotine Use (last 12 mo)" value={data.tobaccoUse} />
        <Flag label="Cannabis Use (last 5 yrs)" value={data.cannabisUse} />
        <Flag label="Unprescribed Drug Use" value={data.drugUse} />
        <Flag label="Alcohol Use" value={data.alcoholUse} />
        <Flag label="Alcohol Counselling" value={data.alcoholCounselling} />
      </Section>

      {/* Risk Assessment */}
      <Section title="Risk Assessment" onEdit={() => setCurrentStep(6)}>
        <Row label="Questions Answered" value={`${Object.keys(data.riskAnswers).length}/5`} />
      </Section>

      {/* Product Recommendation */}
      <Section title="Product Recommendation" onEdit={() => setCurrentStep(8)}>
        <Row label="Carrier" value={data.selectedCarrier} />
        <Row label="Product" value={data.selectedProduct} />
        {(data.productCategory === "Participating Whole Life" || data.productCategory === "IFA") && (
          <>
            <Row label="Plan Design" value={data.planDesign} />
            <Row label="Dividend Option" value={data.dividendOption} />
            {data.dividendOption === "EDO" && <Row label="EDO Annual Deposit" value={fmt(data.edoAmount)} />}
            <Row label="Premium Offset Intent" value={data.premiumOffsetIntent} />
            <Row label="Illustration Acknowledged" value={data.illustrationAcknowledged ? "Yes" : "No"} />
          </>
        )}
        {data.productCategory === "Universal Life" && (
          <>
            <Row label="Death Benefit Design" value={data.deathBenefitDesign} />
            <Row label="COI Structure" value={data.coiStructure} />
            <Row label="Planned Annual Premium" value={fmt(data.plannedPremium)} />
            <Row label="Exempt Test Acknowledged" value={data.exemptTestAcknowledged ? "Yes" : "No"} />
          </>
        )}
        {data.productCategory === "Term Life" && (
          <>
            <Row label="Term Period" value={data.termPeriod ? `${data.termPeriod} years` : ""} />
            <Row label="Conversion Privilege" value={data.conversionPrivilege ? "Yes" : "No"} />
            <Row label="Return of Premium (ROP)" value={data.ropOption ? "Yes" : "No"} />
          </>
        )}
        {data.selectedCarrier === "Manulife" && data.vitalityEnrollment && (
          <Row label="Vitality Enrollment" value={data.vitalityEnrollment} />
        )}
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
