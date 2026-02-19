import { Shield, TrendingUp, DollarSign, Clock } from "lucide-react";
import type { PresentationContext } from "@/lib/presentation-decks";

interface Props {
  context?: PresentationContext;
}

export function RecommendationSlide({ context }: Props) {
  const carrier = context?.carrier ?? "Manulife";
  const product = context?.product ?? "IFA";
  const riskProfile = context?.riskProfile ?? "moderate";
  const premium = context?.premium;
  const goals = context?.goals ?? ["tax-efficient wealth accumulation", "estate planning"];
  const timeHorizon = context?.timeHorizon ?? "20";

  const productTitle = product === "IFA"
    ? `${carrier} Par - IFA Structure`
    : `${carrier} ${product}`;
  const goalsText = goals.map((g) => g.toLowerCase()).join(" and ");

  const isIFA = product === "IFA";

  const features = isIFA ? [
    { icon: Shield, label: "CDA Credits", desc: "Tax-free capital dividend distributions to shareholders on death" },
    { icon: TrendingUp, label: "NCPI Deduction", desc: "Annual corporate tax deduction reduces taxable income" },
    { icon: DollarSign, label: "Tax-Deferred Growth", desc: "Cash value grows tax-deferred within policy (ACB)" },
    { icon: Clock, label: "Corporate Asset", desc: "Strengthens balance sheet, provides estate liquidity" },
  ] : [
    { icon: Shield, label: "Death Benefit Protection", desc: "Guaranteed permanent life insurance coverage" },
    { icon: TrendingUp, label: "Cash Value Growth", desc: "Tax-deferred accumulation with policy loan access" },
    { icon: DollarSign, label: "Participating Dividends", desc: "Potential dividend growth based on carrier performance" },
    { icon: Clock, label: "Estate Planning", desc: "Tax-free death benefit for wealth transfer" },
  ];

  return (
    <div className="space-y-10">
      <div className="text-center space-y-2">
        <p className="text-sm font-medium tracking-widest uppercase" style={{ color: "#8A9BB5" }}>
          Our Recommendation
        </p>
        <h1 className="text-4xl font-bold" style={{ color: "#0A1628" }}>
          {productTitle}
        </h1>
        <p className="text-base" style={{ color: "#8A9BB5" }}>{carrier} Life Insurance Company</p>
      </div>

      <div className="grid grid-cols-2 gap-4 max-w-3xl mx-auto">
        {features.map((f) => (
          <div
            key={f.label}
            className="flex items-start gap-4 rounded-xl p-5"
            style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg" style={{ background: "#00D47E" }}>
              <f.icon className="h-5 w-5" style={{ color: "#0A1628" }} />
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: "#0A1628" }}>{f.label}</p>
              <p className="text-xs mt-0.5" style={{ color: "#8A9BB5" }}>{f.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="max-w-2xl mx-auto rounded-xl p-6" style={{ background: "#f0fdf4", border: "1px solid #bbf7d0" }}>
        <h3 className="text-sm font-bold mb-2" style={{ color: "#0A1628" }}>Why This Is Right for You</h3>
        <p className="text-sm leading-relaxed" style={{ color: "#374151" }}>
          {isIFA
            ? `Based on your corporate financial profile and goals of ${goalsText}, combined with your ${timeHorizon}-year time horizon and ${riskProfile} risk tolerance, the ${productTitle} provides superior tax efficiency compared to traditional corporate investments. The IFA structure creates CDA credits for tax-free shareholder distributions, provides annual NCPI deductions, and builds tax-deferred wealth within your corporation.${premium ? ` Your ${premium} CAD annual premium represents prudent deployment of corporate retained earnings.` : ''}`
            : `Based on your goals of ${goalsText}, combined with your ${timeHorizon}-year time horizon and ${riskProfile} risk tolerance, the ${productTitle} provides permanent life insurance protection with tax-deferred cash value growth.${premium ? ` Your ${premium} CAD premium provides comprehensive coverage and wealth accumulation.` : ''} The policy offers financial flexibility through policy loans and supports your long-term estate planning objectives.`
          }
        </p>
      </div>
    </div>
  );
}
