import { useDiscovery, ExistingPolicy, ExistingAnnuity } from "../DiscoveryContext";
import { Plus, Trash2 } from "lucide-react";

const inputClass = "w-full rounded-button border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary transition-colors";

export function CurrentCoverage() {
  const { data, updateData } = useDiscovery();

  const addPolicy = () => {
    updateData({ existingPolicies: [...data.existingPolicies, { carrier: "", productType: "", faceAmount: "", annualPremium: "", yearIssued: "" }] });
  };
  const removePolicy = (i: number) => {
    updateData({ existingPolicies: data.existingPolicies.filter((_, idx) => idx !== i) });
  };
  const updatePolicy = (i: number, updates: Partial<ExistingPolicy>) => {
    updateData({ existingPolicies: data.existingPolicies.map((p, idx) => (idx === i ? { ...p, ...updates } : p)) });
  };

  const addAnnuity = () => {
    updateData({ existingAnnuities: [...data.existingAnnuities, { carrier: "", productType: "", currentValue: "", surrenderDate: "" }] });
  };
  const removeAnnuity = (i: number) => {
    updateData({ existingAnnuities: data.existingAnnuities.filter((_, idx) => idx !== i) });
  };
  const updateAnnuity = (i: number, updates: Partial<ExistingAnnuity>) => {
    updateData({ existingAnnuities: data.existingAnnuities.map((a, idx) => (idx === i ? { ...a, ...updates } : a)) });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Current Coverage</h2>
        <p className="mt-1 text-sm text-muted-foreground">Document existing life insurance and annuity coverage.</p>
      </div>

      {/* Existing Life Insurance */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">Existing Life Insurance Policies</h3>
          <button onClick={addPolicy} className="flex items-center gap-1.5 rounded-button border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-secondary transition-colors">
            <Plus className="h-3.5 w-3.5" /> Add Policy
          </button>
        </div>
        {data.existingPolicies.length === 0 ? (
          <p className="rounded-card border border-dashed border-border px-4 py-6 text-center text-sm text-muted-foreground">No existing policies. Click "Add Policy" to add one.</p>
        ) : (
          <div className="overflow-x-auto rounded-card border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="px-3 py-2 text-xs font-medium uppercase text-muted-foreground">Carrier</th>
                  <th className="px-3 py-2 text-xs font-medium uppercase text-muted-foreground">Product Type</th>
                  <th className="px-3 py-2 text-xs font-medium uppercase text-muted-foreground">Face Amount</th>
                  <th className="px-3 py-2 text-xs font-medium uppercase text-muted-foreground">Annual Premium</th>
                  <th className="px-3 py-2 text-xs font-medium uppercase text-muted-foreground">Year Issued</th>
                  <th className="px-3 py-2 w-10"></th>
                </tr>
              </thead>
              <tbody>
                {data.existingPolicies.map((p, i) => (
                  <tr key={i} className="border-b border-border/50 last:border-0">
                    <td className="px-2 py-2"><input className={inputClass} placeholder="Carrier" value={p.carrier} onChange={(e) => updatePolicy(i, { carrier: e.target.value })} /></td>
                    <td className="px-2 py-2"><input className={inputClass} placeholder="IUL, Term, etc." value={p.productType} onChange={(e) => updatePolicy(i, { productType: e.target.value })} /></td>
                    <td className="px-2 py-2"><input className={`${inputClass} font-mono`} placeholder="$500,000" value={p.faceAmount} onChange={(e) => updatePolicy(i, { faceAmount: e.target.value })} /></td>
                    <td className="px-2 py-2"><input className={`${inputClass} font-mono`} placeholder="$3,600" value={p.annualPremium} onChange={(e) => updatePolicy(i, { annualPremium: e.target.value })} /></td>
                    <td className="px-2 py-2"><input className={inputClass} placeholder="2018" value={p.yearIssued} onChange={(e) => updatePolicy(i, { yearIssued: e.target.value })} /></td>
                    <td className="px-2 py-2">
                      <button onClick={() => removePolicy(i)} className="text-muted-foreground hover:text-destructive transition-colors"><Trash2 className="h-4 w-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Existing Annuities */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">Existing Annuities</h3>
          <button onClick={addAnnuity} className="flex items-center gap-1.5 rounded-button border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-secondary transition-colors">
            <Plus className="h-3.5 w-3.5" /> Add Annuity
          </button>
        </div>
        {data.existingAnnuities.length === 0 ? (
          <p className="rounded-card border border-dashed border-border px-4 py-6 text-center text-sm text-muted-foreground">No existing annuities. Click "Add Annuity" to add one.</p>
        ) : (
          <div className="overflow-x-auto rounded-card border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="px-3 py-2 text-xs font-medium uppercase text-muted-foreground">Carrier</th>
                  <th className="px-3 py-2 text-xs font-medium uppercase text-muted-foreground">Product Type</th>
                  <th className="px-3 py-2 text-xs font-medium uppercase text-muted-foreground">Current Value</th>
                  <th className="px-3 py-2 text-xs font-medium uppercase text-muted-foreground">Surrender Date</th>
                  <th className="px-3 py-2 w-10"></th>
                </tr>
              </thead>
              <tbody>
                {data.existingAnnuities.map((a, i) => (
                  <tr key={i} className="border-b border-border/50 last:border-0">
                    <td className="px-2 py-2"><input className={inputClass} placeholder="Carrier" value={a.carrier} onChange={(e) => updateAnnuity(i, { carrier: e.target.value })} /></td>
                    <td className="px-2 py-2"><input className={inputClass} placeholder="IFA, VA, etc." value={a.productType} onChange={(e) => updateAnnuity(i, { productType: e.target.value })} /></td>
                    <td className="px-2 py-2"><input className={`${inputClass} font-mono`} placeholder="$250,000" value={a.currentValue} onChange={(e) => updateAnnuity(i, { currentValue: e.target.value })} /></td>
                    <td className="px-2 py-2"><input className={inputClass} placeholder="2028-06-15" value={a.surrenderDate} onChange={(e) => updateAnnuity(i, { surrenderDate: e.target.value })} /></td>
                    <td className="px-2 py-2">
                      <button onClick={() => removeAnnuity(i)} className="text-muted-foreground hover:text-destructive transition-colors"><Trash2 className="h-4 w-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Replacement */}
      <div className="rounded-card border border-border bg-secondary/20 p-4 space-y-3">
        <label className="flex items-center gap-3 cursor-pointer">
          <div
            onClick={() => updateData({ willReplaceCoverage: !data.willReplaceCoverage })}
            className={`h-5 w-9 rounded-full transition-colors cursor-pointer ${data.willReplaceCoverage ? "bg-primary" : "bg-border"}`}
          >
            <div className={`h-5 w-5 rounded-full bg-foreground shadow transition-transform ${data.willReplaceCoverage ? "translate-x-4" : "translate-x-0"}`} />
          </div>
          <span className="text-sm font-medium text-foreground">Will this product replace existing coverage?</span>
        </label>
        {data.willReplaceCoverage && (
          <label className="flex items-center gap-2 ml-12 cursor-pointer">
            <input
              type="checkbox"
              checked={data.replacementDisclosureAcknowledged}
              onChange={(e) => updateData({ replacementDisclosureAcknowledged: e.target.checked })}
              className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
            />
            <span className="text-sm text-muted-foreground">Client acknowledges replacement disclosure</span>
          </label>
        )}
      </div>
    </div>
  );
}
