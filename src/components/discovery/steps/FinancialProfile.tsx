import { useDiscovery } from "../DiscoveryContext";

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

const formatCurrency = (value: string) => {
  const num = value.replace(/[^0-9]/g, "");
  if (!num) return "";
  return Number(num).toLocaleString("en-CA");
};

export function FinancialProfile() {
  const { data, updateData } = useDiscovery();

  const showExchangeFields = data.sourceOfFunds === "Policy Transfer/Exchange" || data.sourceOfFunds === "RRSP Withdrawal" || data.sourceOfFunds === "TFSA Withdrawal";

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Financial Profile</h2>
        <p className="mt-1 text-sm text-muted-foreground">Client's financial standing and funding source.</p>
      </div>

      {/* Assets */}
      <div className="grid grid-cols-2 gap-4">
        <FieldGroup label="Total Liquid Assets">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
            <input className={`${inputClass} pl-7 font-mono`} placeholder="500,000" value={formatCurrency(data.totalLiquidAssets)} onChange={(e) => updateData({ totalLiquidAssets: e.target.value.replace(/[^0-9]/g, "") })} />
          </div>
        </FieldGroup>
        <FieldGroup label="Total Net Worth">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
            <input className={`${inputClass} pl-7 font-mono`} placeholder="1,200,000" value={formatCurrency(data.totalNetWorth)} onChange={(e) => updateData({ totalNetWorth: e.target.value.replace(/[^0-9]/g, "") })} />
          </div>
        </FieldGroup>
      </div>

      {/* Income & Expenses */}
      <div className="grid grid-cols-2 gap-4">
        <FieldGroup label="Annual Income" helper="Pre-filled from Personal Information">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
            <input className={`${inputClass} pl-7 font-mono bg-secondary/30`} value={formatCurrency(data.annualIncome)} readOnly />
          </div>
        </FieldGroup>
        <FieldGroup label="Monthly Expenses Estimate">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
            <input className={`${inputClass} pl-7 font-mono`} placeholder="5,000" value={formatCurrency(data.monthlyExpenses)} onChange={(e) => updateData({ monthlyExpenses: e.target.value.replace(/[^0-9]/g, "") })} />
          </div>
        </FieldGroup>
      </div>

      {/* Tax */}
      <div className="grid grid-cols-2 gap-4">
        <FieldGroup label="Marginal Tax Rate (Federal + BC)">
          <select className={selectClass} value={data.taxBracket} onChange={(e) => updateData({ taxBracket: e.target.value })}>
            <option value="">Select</option>
            <option value="20.06%">20.06% (Under $47,937)</option>
            <option value="22.70%">22.70% ($47,937 - $53,359)</option>
            <option value="28.20%">28.20% ($53,359 - $95,875)</option>
            <option value="31.00%">31.00% ($95,875 - $106,717)</option>
            <option value="38.29%">38.29% ($106,717 - $165,430)</option>
            <option value="40.70%">40.70% ($165,430 - $235,675)</option>
            <option value="45.80%">45.80% ($235,675+)</option>
            <option value="49.80%">49.80% (BC Top Rate)</option>
          </select>
        </FieldGroup>
        <FieldGroup label="Province">
          <select className={selectClass} value={data.filingStatus} onChange={(e) => updateData({ filingStatus: e.target.value })}>
            <option value="">Select</option>
            <option value="British Columbia">British Columbia</option>
            <option value="Alberta">Alberta</option>
            <option value="Ontario">Ontario</option>
            <option value="Quebec">Quebec</option>
            <option value="Other Province">Other Province</option>
          </select>
        </FieldGroup>
      </div>

      {/* Source of Funds */}
      <FieldGroup label="Source of Funds for This Product">
        <select className={selectClass} value={data.sourceOfFunds} onChange={(e) => updateData({ sourceOfFunds: e.target.value })}>
          <option value="">Select</option>
          <option value="Corporate Retained Earnings">Corporate Retained Earnings</option>
          <option value="Personal Savings">Personal Savings</option>
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
    </div>
  );
}
