import { useDiscovery, CorporateOwner } from "../DiscoveryContext";
import { Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

const inputClass = "w-full rounded-button border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary transition-colors";
const selectClass = "w-full rounded-button border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary";

function FieldGroup({ label, helper, children, className = "", error = false, id }: { label: string; helper?: string; children: React.ReactNode; className?: string; error?: boolean; id?: string }) {
  return (
    <div className={cn(className, error && "rounded-lg ring-1 ring-destructive/40 bg-destructive/5 px-3 pt-3 pb-2 -mx-3")} id={id}>
      <label className={cn("mb-1.5 block text-xs font-medium", error ? "text-destructive" : "text-muted-foreground")}>
        {label}{error && <span className="ml-1 font-normal text-destructive/70">— required</span>}
      </label>
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

function YesNoToggle({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex gap-2">
      {["Yes", "No"].map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={cn(
            "rounded-button px-5 py-2 text-sm font-medium transition-colors border",
            value === opt
              ? "border-primary bg-primary/15 text-primary"
              : "border-border text-muted-foreground hover:border-primary/50"
          )}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

export function FinancialProfile() {
  const { data, updateData, highlightMissing } = useDiscovery();
  const err = (val: string | undefined | null) => highlightMissing && (!val || !val.trim());

  const isCorporate = data.ownerType === "Corporate";
  const isIFA = data.productCategory === "IFA";

  const showExchangeFields =
    data.sourceOfFunds === "Policy Transfer/Exchange" ||
    data.sourceOfFunds === "RRSP Withdrawal" ||
    data.sourceOfFunds === "TFSA Withdrawal";

  const updateCorporateOwner = (index: number, updates: Partial<CorporateOwner>) => {
    const updated = data.corporateOwners.map((o, i) => (i === index ? { ...o, ...updates } : o));
    updateData({ corporateOwners: updated });
  };
  const addCorporateOwner = () => {
    updateData({
      corporateOwners: [
        ...data.corporateOwners,
        { name: "", title: "", ownershipPercent: "", insuranceInForce: "", insuranceAppliedFor: "" },
      ],
    });
  };
  const removeCorporateOwner = (index: number) => {
    updateData({ corporateOwners: data.corporateOwners.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Financial Profile</h2>
        <p className="mt-1 text-sm text-muted-foreground">Client's financial standing and funding source.</p>
      </div>

      {/* Personal net worth */}
      <div className="grid grid-cols-2 gap-4">
        <FieldGroup id="field-totalLiquidAssets" label="Total Assets (cash, real estate, stocks, bonds)" error={err(data.totalLiquidAssets)}>
          <CurrencyInput value={data.totalLiquidAssets} onChange={(v) => updateData({ totalLiquidAssets: v })} placeholder="500,000" />
        </FieldGroup>
        <FieldGroup id="field-totalLiabilities" label="Total Liabilities (mortgages, loans)" error={err(data.totalLiabilities)}>
          <CurrencyInput value={data.totalLiabilities} onChange={(v) => updateData({ totalLiabilities: v })} placeholder="200,000" />
        </FieldGroup>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FieldGroup id="field-totalNetWorth" label="Total Net Worth (Canadian)" helper="Assets minus liabilities" error={err(data.totalNetWorth)}>
          <CurrencyInput value={data.totalNetWorth} onChange={(v) => updateData({ totalNetWorth: v })} placeholder="1,200,000" />
        </FieldGroup>
        <FieldGroup label="Total Foreign Net Worth">
          <CurrencyInput value={data.foreignNetWorth} onChange={(v) => updateData({ foreignNetWorth: v })} placeholder="0" />
        </FieldGroup>
      </div>

      {/* Income */}
      <div className="grid grid-cols-2 gap-4">
        <FieldGroup label="Annual Earned Income" helper="Pre-filled from Personal Information">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
            <input className={`${inputClass} pl-7 font-mono bg-secondary/30`} value={Number(data.annualIncome || 0).toLocaleString("en-CA")} readOnly />
          </div>
        </FieldGroup>
        <FieldGroup label="Other Income" helper="Pensions, dividends, rental, bonuses, government benefits">
          <CurrencyInput value={data.otherIncome} onChange={(v) => updateData({ otherIncome: v })} placeholder="0" />
        </FieldGroup>
      </div>

      {/* Tax */}
      <div className="grid grid-cols-2 gap-4">
        <FieldGroup id="field-taxBracket" label="Marginal Tax Rate" error={err(data.taxBracket)}>
          <select className={selectClass} value={data.taxBracket} onChange={(e) => updateData({ taxBracket: e.target.value })}>
            <option value="">Select</option>
            <optgroup label="British Columbia">
              <option value="BC 20.06%">20.06% (Under $47,937)</option>
              <option value="BC 22.70%">22.70% ($47,937–$53,359)</option>
              <option value="BC 28.20%">28.20% ($53,359–$95,875)</option>
              <option value="BC 31.00%">31.00% ($95,875–$106,717)</option>
              <option value="BC 38.29%">38.29% ($106,717–$165,430)</option>
              <option value="BC 40.70%">40.70% ($165,430–$235,675)</option>
              <option value="BC 45.80%">45.80% ($235,675+)</option>
              <option value="BC 49.80%">49.80% (BC Top Rate)</option>
            </optgroup>
            <optgroup label="Ontario">
              <option value="ON 20.05%">20.05% (Under $51,446)</option>
              <option value="ON 24.15%">24.15% ($51,446–$102,894)</option>
              <option value="ON 31.48%">31.48% ($102,894–$150,000)</option>
              <option value="ON 43.41%">43.41% ($150,000–$220,000)</option>
              <option value="ON 46.41%">46.41% ($220,000+)</option>
              <option value="ON 53.53%">53.53% (ON Top Rate)</option>
            </optgroup>
            <optgroup label="Alberta">
              <option value="AB 25.00%">25.00% (Under $148,269)</option>
              <option value="AB 30.50%">30.50% ($148,269–$177,922)</option>
              <option value="AB 36.00%">36.00% ($177,922–$237,230)</option>
              <option value="AB 38.00%">38.00% ($237,230–$355,845)</option>
              <option value="AB 48.00%">48.00% (AB Top Rate)</option>
            </optgroup>
            <optgroup label="Quebec">
              <option value="QC 27.53%">27.53% (Under $51,780)</option>
              <option value="QC 32.53%">32.53% ($51,780–$103,545)</option>
              <option value="QC 45.71%">45.71% ($103,545–$112,655)</option>
              <option value="QC 53.31%">53.31% (QC Top Rate)</option>
            </optgroup>
          </select>
        </FieldGroup>
        <FieldGroup id="field-filingStatus" label="Province of Residence for Tax" error={err(data.filingStatus)}>
          <select className={selectClass} value={data.filingStatus} onChange={(e) => updateData({ filingStatus: e.target.value })}>
            <option value="">Select</option>
            <option value="British Columbia">British Columbia</option>
            <option value="Alberta">Alberta</option>
            <option value="Ontario">Ontario</option>
            <option value="Quebec">Quebec</option>
            <option value="Saskatchewan">Saskatchewan</option>
            <option value="Manitoba">Manitoba</option>
            <option value="Nova Scotia">Nova Scotia</option>
            <option value="New Brunswick">New Brunswick</option>
            <option value="PEI">Prince Edward Island</option>
            <option value="Newfoundland">Newfoundland and Labrador</option>
            <option value="Other Province">Other Province/Territory</option>
          </select>
        </FieldGroup>
      </div>

      {/* Face Amount & Reason for Purchase */}
      <div className="grid grid-cols-2 gap-4">
        <FieldGroup label="Face Amount Requested" helper="Total death benefit applied for">
          <CurrencyInput value={data.faceAmountRequested} onChange={(v) => updateData({ faceAmountRequested: v })} placeholder="1,000,000" />
        </FieldGroup>
        <FieldGroup id="field-reasonForPurchase" label="Reason for Purchasing this Policy" error={err(data.reasonForPurchase)}>
          <select className={selectClass} value={data.reasonForPurchase} onChange={(e) => updateData({ reasonForPurchase: e.target.value })}>
            <option value="">Select</option>
            <option value="IFA">IFA (Immediate Financing Arrangement)</option>
            <option value="Income / Family Protection">Income / Family Protection</option>
            <option value="Business">Business</option>
            <option value="Corporate / Preferred Retirement Solution">Corporate / Preferred Retirement Solution</option>
            <option value="Estate Transfer">Estate Transfer</option>
            <option value="Other">Other</option>
          </select>
        </FieldGroup>
      </div>

      {/* Source of Funds */}
      <FieldGroup id="field-sourceOfFunds" label="Source of Funds for This Product" error={err(data.sourceOfFunds)}>
        <select className={selectClass} value={data.sourceOfFunds} onChange={(e) => updateData({ sourceOfFunds: e.target.value })}>
          <option value="">Select</option>
          <option value="Corporate Retained Earnings">Corporate Retained Earnings</option>
          <option value="Business Income">Business Income</option>
          <option value="Personal Savings">Personal Savings</option>
          <option value="Salary or Earned Income">Salary or Earned Income</option>
          <option value="RRSP Withdrawal">RRSP Withdrawal</option>
          <option value="TFSA Withdrawal">TFSA Withdrawal</option>
          <option value="Policy Transfer/Exchange">Policy Transfer/Exchange</option>
          <option value="Inheritance">Inheritance</option>
          <option value="Investment Liquidation">Investment Liquidation</option>
          <option value="Other">Other</option>
        </select>
      </FieldGroup>

      {showExchangeFields && (
        <div className="rounded-card border border-border bg-secondary/20 p-4 space-y-4">
          <p className="text-xs font-medium text-warning">Additional details required for {data.sourceOfFunds}</p>
          <div className="grid grid-cols-2 gap-4">
            <FieldGroup label="Existing Policy/Account Details">
              <input className={inputClass} placeholder="Carrier name, policy type, account type" value={data.existingPolicyDetails} onChange={(e) => updateData({ existingPolicyDetails: e.target.value })} />
            </FieldGroup>
            <FieldGroup label="Account/Policy Number">
              <input className={inputClass} placeholder="Account or policy number" value={data.existingAccountNumber} onChange={(e) => updateData({ existingAccountNumber: e.target.value })} />
            </FieldGroup>
          </div>
        </div>
      )}

      {/* IFA-Specific Financial Details */}
      {isIFA && (
        <div className="rounded-card border border-primary/30 bg-primary/5 p-5 space-y-5">
          <div>
            <h3 className="text-sm font-semibold text-foreground">IFA — Collateral Lending Details</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Required for Immediate Financing Arrangement cases.</p>
          </div>

          <FieldGroup label="Is collateral assignment to a lender intended?">
            <YesNoToggle value={data.collateralAssignmentIntent} onChange={(v) => updateData({ collateralAssignmentIntent: v })} />
          </FieldGroup>

          {data.collateralAssignmentIntent === "Yes" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FieldGroup label="Lender Name / Financial Institution">
                  <input className={inputClass} placeholder="e.g. National Bank of Canada" value={data.lenderName} onChange={(e) => updateData({ lenderName: e.target.value })} />
                </FieldGroup>
                <FieldGroup label="Estimated Loan Amount">
                  <CurrencyInput value={data.estimatedLoanAmount} onChange={(v) => updateData({ estimatedLoanAmount: v })} placeholder="500,000" />
                </FieldGroup>
              </div>

              <FieldGroup label="Loan Purpose">
                <select className={selectClass} value={data.loanPurpose} onChange={(e) => updateData({ loanPurpose: e.target.value })}>
                  <option value="">Select</option>
                  <option value="Premium Financing">Premium Financing (fund insurance premiums)</option>
                  <option value="Business Capital">Business Capital / Operating Loan</option>
                  <option value="Investment Loan">Investment Loan</option>
                  <option value="Real Estate Acquisition">Real Estate Acquisition</option>
                  <option value="Business Acquisition">Business Acquisition</option>
                  <option value="Other">Other</option>
                </select>
              </FieldGroup>
            </div>
          )}

          {/* Key Person Value */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-foreground">Key Person Insurance Value</h4>
            <div className="grid grid-cols-2 gap-4">
              <FieldGroup label="Calculation Method">
                <select className={selectClass} value={data.keyPersonValueMethod} onChange={(e) => updateData({ keyPersonValueMethod: e.target.value })}>
                  <option value="">Select</option>
                  <option value="Income Multiple">Income Multiple (5–10×)</option>
                  <option value="Contribution Method">Contribution Method (% of business profit)</option>
                  <option value="Book Value">Book Value / Replacement Cost</option>
                  <option value="Business Valuation">Formal Business Valuation</option>
                  <option value="Not Applicable">Not Applicable</option>
                </select>
              </FieldGroup>
              <FieldGroup label="Key Person Value Amount">
                <CurrencyInput value={data.keyPersonValueAmount} onChange={(v) => updateData({ keyPersonValueAmount: v })} placeholder="2,000,000" />
              </FieldGroup>
            </div>
          </div>

          {/* Legal & Tax Structure */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold text-foreground">Professional Advisors</h4>
            <div className="grid grid-cols-2 gap-4">
              <FieldGroup label="Tax Counsel / Accountant Name">
                <input className={inputClass} placeholder="Name of CPA or tax counsel" value={data.taxCounselName} onChange={(e) => updateData({ taxCounselName: e.target.value })} />
              </FieldGroup>
              <FieldGroup label="Legal Counsel / Lawyer Name">
                <input className={inputClass} placeholder="Name of corporate lawyer" value={data.legalCounselName} onChange={(e) => updateData({ legalCounselName: e.target.value })} />
              </FieldGroup>
            </div>

            <FieldGroup label="Is a shareholder agreement on file with the corporation?">
              <YesNoToggle value={data.shareholderAgreementOnFile} onChange={(v) => updateData({ shareholderAgreementOnFile: v })} />
            </FieldGroup>
          </div>

          {/* NCPI Deductibility */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-foreground">NCPI Deductibility</h4>
            <FieldGroup
              label="Has tax counsel confirmed the Net Cost of Pure Insurance (NCPI) is deductible as a business expense?"
              helper="IFA strategies rely on NCPI deductibility — tax counsel confirmation is required before policy issue."
            >
              <div className="flex gap-2 mt-2">
                {["Yes — confirmed by tax counsel", "No — pending confirmation", "Not Applicable"].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => updateData({ ncpiDeductibilityConfirmed: opt })}
                    className={cn(
                      "rounded-button px-4 py-2 text-xs font-medium transition-colors border",
                      data.ncpiDeductibilityConfirmed === opt
                        ? "border-primary bg-primary/15 text-primary"
                        : "border-border text-muted-foreground hover:border-primary/50"
                    )}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </FieldGroup>
          </div>

          {/* IFA Risk Acknowledgment */}
          <div className="rounded-card border border-warning/40 bg-warning/5 p-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="mt-0.5 h-4 w-4 rounded border-border accent-primary"
                checked={data.ifaRiskAcknowledged}
                onChange={(e) => updateData({ ifaRiskAcknowledged: e.target.checked })}
              />
              <span className="text-xs text-foreground leading-relaxed">
                <span className="font-semibold text-warning">IFA Risk Acknowledgment: </span>
                I confirm that the client understands the risks associated with an IFA strategy, including: (1) the policy CSV may not equal the outstanding loan balance; (2) lender approval and terms are not guaranteed; (3) the strategy requires ongoing lender participation; (4) tax deductibility is subject to CRA review; and (5) the advisor has disclosed all material risks and conflicts of interest.
              </span>
            </label>
          </div>
        </div>
      )}

      {/* Corporate Financials */}
      {isCorporate && (
        <div className="rounded-card border border-border bg-secondary/10 p-5 space-y-5">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Corporate Financial Details</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Required when the policyholder is a corporation.</p>
          </div>

          <FieldGroup label="Nature of Business">
            <input className={inputClass} placeholder="e.g. Operating business, Traffic Control – Construction" value={data.corporateNatureOfBusiness} onChange={(e) => updateData({ corporateNatureOfBusiness: e.target.value })} />
          </FieldGroup>

          <div className="grid grid-cols-2 gap-4">
            <FieldGroup label="Business Assets (current + fixed)">
              <CurrencyInput value={data.corporateBusinessAssets} onChange={(v) => updateData({ corporateBusinessAssets: v })} />
            </FieldGroup>
            <FieldGroup label="Business Liabilities (current + long-term)">
              <CurrencyInput value={data.corporateBusinessLiabilities} onChange={(v) => updateData({ corporateBusinessLiabilities: v })} />
            </FieldGroup>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FieldGroup label="Net Profit — Last Year">
              <CurrencyInput value={data.corporateNetProfitLastYear} onChange={(v) => updateData({ corporateNetProfitLastYear: v })} />
            </FieldGroup>
            <FieldGroup label="Net Profit — Previous Year">
              <CurrencyInput value={data.corporateNetProfitPrevYear} onChange={(v) => updateData({ corporateNetProfitPrevYear: v })} />
            </FieldGroup>
          </div>

          {/* Business Owners */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-semibold text-foreground">Business Ownership Structure</h4>
                <p className="text-xs text-muted-foreground">All owners, their percentage, and existing/applied coverage.</p>
              </div>
              <button onClick={addCorporateOwner} className="flex items-center gap-1.5 rounded-button border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-secondary transition-colors">
                <Plus className="h-3.5 w-3.5" /> Add Owner
              </button>
            </div>

            {data.corporateOwners.length === 0 ? (
              <p className="rounded-card border border-dashed border-border px-4 py-5 text-center text-sm text-muted-foreground">Click "Add Owner" to document the ownership structure.</p>
            ) : (
              <div className="overflow-x-auto rounded-card border border-border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left">
                      <th className="px-3 py-2 text-xs font-medium uppercase text-muted-foreground">Name & Title</th>
                      <th className="px-3 py-2 text-xs font-medium uppercase text-muted-foreground">% Ownership</th>
                      <th className="px-3 py-2 text-xs font-medium uppercase text-muted-foreground">Insurance In Force</th>
                      <th className="px-3 py-2 text-xs font-medium uppercase text-muted-foreground">Insurance Applied For</th>
                      <th className="px-3 py-2 w-10"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.corporateOwners.map((o, i) => (
                      <tr key={i} className="border-b border-border/50 last:border-0">
                        <td className="px-2 py-2 space-y-1">
                          <input className={inputClass} placeholder="Full name" value={o.name} onChange={(e) => updateCorporateOwner(i, { name: e.target.value })} />
                          <input className={inputClass} placeholder="Title / Role" value={o.title} onChange={(e) => updateCorporateOwner(i, { title: e.target.value })} />
                        </td>
                        <td className="px-2 py-2">
                          <input className={`${inputClass} font-mono`} placeholder="50%" value={o.ownershipPercent} onChange={(e) => updateCorporateOwner(i, { ownershipPercent: e.target.value })} />
                        </td>
                        <td className="px-2 py-2">
                          <input className={`${inputClass} font-mono`} placeholder="$0" value={o.insuranceInForce} onChange={(e) => updateCorporateOwner(i, { insuranceInForce: e.target.value })} />
                        </td>
                        <td className="px-2 py-2">
                          <input className={`${inputClass} font-mono`} placeholder="$0" value={o.insuranceAppliedFor} onChange={(e) => updateCorporateOwner(i, { insuranceAppliedFor: e.target.value })} />
                        </td>
                        <td className="px-2 py-2">
                          <button onClick={() => removeCorporateOwner(i)} className="text-muted-foreground hover:text-destructive transition-colors">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
