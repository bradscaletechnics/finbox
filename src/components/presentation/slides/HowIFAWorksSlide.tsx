import { ArrowRight, Building2, Shield, TrendingUp, Banknote } from "lucide-react";
import type { PresentationContext } from "@/lib/presentation-decks";

interface Props {
  context?: PresentationContext;
}

export function HowIFAWorksSlide({ context }: Props) {
  const productLabel = context?.product === "IFA" || !context?.product
    ? "Immediate Financing Arrangement"
    : `How ${context.product} Works`;

  const isIFA = context?.product === "IFA" || !context?.product;

  return (
    <div className="space-y-10">
      <div className="text-center space-y-2">
        <p className="text-sm font-medium tracking-widest uppercase" style={{ color: "#8A9BB5" }}>
          How It Works
        </p>
        <h1 className="text-4xl font-bold" style={{ color: "#0A1628" }}>
          {productLabel}
        </h1>
        {isIFA && (
          <p className="text-sm" style={{ color: "#8A9BB5" }}>
            Corporate-Owned Life Insurance for Tax-Efficient Wealth Building
          </p>
        )}
      </div>

      {/* Flow diagram */}
      <div className="flex items-center justify-center gap-4 flex-wrap">
        <div className="flex flex-col items-center gap-2 rounded-xl p-6 min-w-[180px]" style={{ background: "#f1f5f9", border: "1px solid #e2e8f0" }}>
          <div className="flex h-10 w-10 items-center justify-center rounded-full" style={{ background: "#0A1628" }}>
            <Building2 className="h-5 w-5" style={{ color: "#F8FAFB" }} />
          </div>
          <span className="text-sm font-semibold" style={{ color: "#0A1628" }}>Your Corporation</span>
          <span className="text-xs" style={{ color: "#8A9BB5" }}>Pays Premium</span>
        </div>

        <ArrowRight className="h-6 w-6 shrink-0" style={{ color: "#8A9BB5" }} />

        <div className="flex flex-col items-center gap-2 rounded-xl p-6 min-w-[180px]" style={{ background: "#f1f5f9", border: "1px solid #e2e8f0" }}>
          <div className="flex h-10 w-10 items-center justify-center rounded-full" style={{ background: "#4DA6FF" }}>
            <Shield className="h-5 w-5" style={{ color: "#fff" }} />
          </div>
          <span className="text-sm font-semibold" style={{ color: "#0A1628" }}>Permanent Life Insurance</span>
          <span className="text-xs" style={{ color: "#8A9BB5" }}>Manulife | Equitable</span>
        </div>

        <ArrowRight className="h-6 w-6 shrink-0" style={{ color: "#8A9BB5" }} />

        <div className="flex flex-col items-center gap-2 rounded-xl p-6 min-w-[180px]" style={{ background: "#f0fdf4", border: "1px solid #bbf7d0" }}>
          <div className="flex h-10 w-10 items-center justify-center rounded-full" style={{ background: "#00D47E" }}>
            <TrendingUp className="h-5 w-5" style={{ color: "#0A1628" }} />
          </div>
          <span className="text-sm font-semibold" style={{ color: "#0A1628" }}>Tax-Deferred Growth</span>
          <span className="text-xs" style={{ color: "#8A9BB5" }}>Cash value builds</span>
        </div>

        <ArrowRight className="h-6 w-6 shrink-0" style={{ color: "#8A9BB5" }} />

        <div className="flex flex-col items-center gap-2 rounded-xl p-6 min-w-[180px]" style={{ background: "#fef3f2", border: "1px solid #fecaca" }}>
          <div className="flex h-10 w-10 items-center justify-center rounded-full" style={{ background: "#ef4444" }}>
            <Banknote className="h-5 w-5" style={{ color: "#fff" }} />
          </div>
          <span className="text-sm font-semibold" style={{ color: "#0A1628" }}>CDA Credits</span>
          <span className="text-xs" style={{ color: "#8A9BB5" }}>Tax-free distributions</span>
        </div>
      </div>

      {/* Key Benefits */}
      <div className="grid grid-cols-3 gap-4 max-w-3xl mx-auto">
        <div className="rounded-xl p-5 text-center" style={{ background: "#f0fdf4", border: "1px solid #bbf7d0" }}>
          <p className="text-2xl font-bold font-mono" style={{ color: "#00D47E" }}>NCPI</p>
          <p className="text-sm font-semibold mt-1" style={{ color: "#0A1628" }}>Tax Deduction</p>
          <p className="text-xs mt-1" style={{ color: "#8A9BB5" }}>Corporate expense</p>
        </div>
        <div className="rounded-xl p-5 text-center" style={{ background: "#eff6ff", border: "1px solid #bfdbfe" }}>
          <p className="text-2xl font-bold font-mono" style={{ color: "#4DA6FF" }}>CDA</p>
          <p className="text-sm font-semibold mt-1" style={{ color: "#0A1628" }}>Capital Dividend Account</p>
          <p className="text-xs mt-1" style={{ color: "#8A9BB5" }}>Tax-free to shareholders</p>
        </div>
        <div className="rounded-xl p-5 text-center" style={{ background: "#fef3f2", border: "1px solid #fecaca" }}>
          <p className="text-2xl font-bold font-mono" style={{ color: "#ef4444" }}>ACB</p>
          <p className="text-sm font-semibold mt-1" style={{ color: "#0A1628" }}>Adjusted Cost Basis</p>
          <p className="text-xs mt-1" style={{ color: "#8A9BB5" }}>Tax-deferred growth</p>
        </div>
      </div>
    </div>
  );
}
