import { ArrowRight } from "lucide-react";
import type { PresentationContext } from "@/lib/presentation-decks";

interface Props {
  context?: PresentationContext;
}

export function IncomeForLifeSlide({ context }: Props) {
  const premium = context?.premium ?? "$200,000";
  const hasClient = !!context?.clientName;

  return (
    <div className="space-y-10">
      <div className="text-center space-y-2">
        <p className="text-sm font-medium tracking-widest uppercase" style={{ color: "#8A9BB5" }}>
          Lifetime Security
        </p>
        <h1 className="text-4xl font-bold" style={{ color: "#0A1628" }}>
          Tax-Free Wealth Transfer & Estate Planning
        </h1>
      </div>

      {/* Phase diagram */}
      <div className="flex items-center justify-center gap-6 max-w-3xl mx-auto">
        <div className="flex-1 rounded-xl p-6 text-center" style={{ background: "#eff6ff", border: "1px solid #bfdbfe" }}>
          <div className="mb-3">
            <svg viewBox="0 0 200 80" className="w-full h-16">
              <path d="M 10,70 Q 50,60 100,40 T 190,10" fill="none" stroke="#4DA6FF" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </div>
          <h3 className="text-lg font-bold" style={{ color: "#0A1628" }}>Accumulation Phase</h3>
          <p className="text-xs mt-1" style={{ color: "#8A9BB5" }}>Your money grows tax-deferred</p>
        </div>

        <ArrowRight className="h-8 w-8 shrink-0" style={{ color: "#00D47E" }} />

        <div className="flex-1 rounded-xl p-6 text-center" style={{ background: "#f0fdf4", border: "1px solid #bbf7d0" }}>
          <div className="mb-3">
            <svg viewBox="0 0 200 80" className="w-full h-16">
              {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                <rect key={i} x={10 + i * 24} y={15} width={16} height={55} rx={3} fill="#00D47E" opacity={0.7 + i * 0.03} />
              ))}
            </svg>
          </div>
          <h3 className="text-lg font-bold" style={{ color: "#0A1628" }}>Income Phase</h3>
          <p className="text-xs mt-1" style={{ color: "#8A9BB5" }}>Reliable monthly payments for life</p>
        </div>
      </div>

      {/* Example CDA Benefit */}
      <div className="text-center space-y-2">
        <p className="text-sm" style={{ color: "#8A9BB5" }}>Estimated CDA Credit (Tax-Free Distribution)</p>
        <p className="text-6xl font-bold font-mono" style={{ color: "#00D47E" }}>
          $2.8M CAD
        </p>
        <p className="text-sm" style={{ color: "#8A9BB5" }}>
          {hasClient
            ? `Based on ${premium} CAD annual premium, 20-year projection`
            : "Based on $200,000 CAD annual premium, 20-year projection, age 50 start"}
        </p>
        <p className="text-xs mt-2" style={{ color: "#8A9BB5" }}>
          * Projections based on current dividend scales (not guaranteed)
        </p>
      </div>
    </div>
  );
}
