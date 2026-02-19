import { useState } from "react";
import { useDiscovery } from "../DiscoveryContext";
import { Pencil } from "lucide-react";

const inputClass = "w-full rounded-button border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary transition-colors";
const selectClass = "w-full rounded-button border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary";

const CARRIERS = [
  { name: "Manulife", products: ["Manulife Par - IFA Structure", "Manulife Par (Individual)", "Manulife Vitality UL", "Manulife Term Life"] },
  { name: "Equitable Life Canada", products: ["Equitable EquiPar - IFA Structure", "Equitable EquiPar (Individual)", "Equitable UL", "Equitable Term Life"] },
  { name: "Sun Life", products: ["Sun Par Protector", "Sun Permanent Life Solutions"] },
  { name: "Canada Life", products: ["Canada Life Par", "Canada Life UL"] },
];

function getDefaultNarrative(data: ReturnType<typeof useDiscovery>["data"]): string {
  const clientName = [data.firstName, data.lastName].filter(Boolean).join(" ") || "[Client Name]";
  const goal = data.primaryGoals[0] || "wealth management";
  const income = data.annualIncome ? `$${Number(data.annualIncome).toLocaleString("en-US")}` : "[income]";
  const horizon = data.investmentTimeHorizon || "10";

  return `After a comprehensive review of ${clientName}'s financial situation, including an annual household income of ${income}, a ${horizon}-year investment time horizon, and a primary objective of ${goal.toLowerCase()}, I am recommending ${data.selectedProduct || "[product]"} from ${data.selectedCarrier || "[carrier]"}.

This recommendation is based on the client's moderate risk tolerance, need for tax-deferred growth, and desire for principal protection. The selected product aligns with the client's stated goals and is appropriate given their current financial profile, existing coverage, and liquidity requirements.

The client has been informed of all surrender charges, fees, and product limitations. This recommendation has been reviewed for suitability compliance.`;
}

export function ProductRecommendation() {
  const { data, updateData } = useDiscovery();
  const [editingNarrative, setEditingNarrative] = useState(false);

  const selectedCarrierData = CARRIERS.find((c) => c.name === data.selectedCarrier);

  const handleCarrierChange = (carrier: string) => {
    updateData({ selectedCarrier: carrier, selectedProduct: "" });
  };

  const handleProductChange = (product: string) => {
    updateData({ selectedProduct: product });
    if (!data.recommendationNarrative) {
      updateData({ recommendationNarrative: getDefaultNarrative({ ...data, selectedProduct: product }) });
    }
  };

  const narrative = data.recommendationNarrative || getDefaultNarrative(data);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Product Recommendation</h2>
        <p className="mt-1 text-sm text-muted-foreground">Select the recommended carrier and product.</p>
      </div>

      {/* Carrier & Product Selection */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Carrier</label>
          <select className={selectClass} value={data.selectedCarrier} onChange={(e) => handleCarrierChange(e.target.value)}>
            <option value="">Select carrier</option>
            {CARRIERS.map((c) => (
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

      {/* Product Features */}
      {data.selectedProduct && (
        <div className="rounded-card border border-border bg-card p-5 space-y-3">
          <h3 className="text-sm font-semibold text-foreground">Key Product Features</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex justify-between border-b border-border/50 pb-2">
              <span className="text-muted-foreground">Product Type</span>
              <span className="font-mono text-foreground">{data.selectedProduct.includes('IFA') ? 'IFA Structure' : data.selectedProduct.includes('Par') ? 'Participating WL' : data.selectedProduct.includes('UL') ? 'Universal Life' : 'Term Life'}</span>
            </div>
            <div className="flex justify-between border-b border-border/50 pb-2">
              <span className="text-muted-foreground">Minimum Premium</span>
              <span className="font-mono text-foreground">${data.selectedProduct.includes('IFA') ? '100,000' : data.selectedProduct.includes('Term') ? '500' : '25,000'} CAD</span>
            </div>
            <div className="flex justify-between border-b border-border/50 pb-2">
              <span className="text-muted-foreground">Ownership</span>
              <span className="font-mono text-foreground">{data.selectedProduct.includes('IFA') ? 'Corporate' : 'Individual/Corporate'}</span>
            </div>
            <div className="flex justify-between border-b border-border/50 pb-2">
              <span className="text-muted-foreground">Tax Treatment</span>
              <span className="font-mono text-foreground">{data.selectedProduct.includes('IFA') ? 'CDA + NCPI' : 'Tax-deferred growth'}</span>
            </div>
            <div className="flex justify-between border-b border-border/50 pb-2">
              <span className="text-muted-foreground">Dividends</span>
              <span className="font-mono text-foreground">{data.selectedProduct.includes('Par') ? 'Participating' : 'N/A'}</span>
            </div>
            <div className="flex justify-between border-b border-border/50 pb-2">
              <span className="text-muted-foreground">Cash Value</span>
              <span className="font-mono text-foreground">{data.selectedProduct.includes('Term') ? 'None' : 'Yes'}</span>
            </div>
          </div>
        </div>
      )}

      {/* Recommendation Narrative */}
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
    </div>
  );
}
