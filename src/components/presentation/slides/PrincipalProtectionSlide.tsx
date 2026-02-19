import type { PresentationContext } from "@/lib/presentation-decks";

interface Props {
  context?: PresentationContext;
}

export function PrincipalProtectionSlide({ context: _context }: Props) {
  const marketPath = "M 0,120 Q 40,80 80,100 T 160,60 T 240,110 T 320,40 T 400,90 T 480,30 T 560,70 T 640,50";
  const ifaPath = "M 0,150 L 80,150 L 80,130 L 160,130 L 160,120 L 240,120 L 240,100 L 320,100 L 320,80 L 400,80 L 400,65 L 480,65 L 480,50 L 560,50 L 560,40 L 640,40";

  return (
    <div className="space-y-10">
      <div className="text-center space-y-2">
        <p className="text-sm font-medium tracking-widest uppercase" style={{ color: "#8A9BB5" }}>
          The Difference
        </p>
        <h1 className="text-4xl font-bold" style={{ color: "#0A1628" }}>
          The Power of Principal Protection
        </h1>
      </div>

      <div className="grid grid-cols-2 gap-8 max-w-4xl mx-auto">
        <div className="rounded-xl p-6 space-y-4" style={{ background: "#fef2f2", border: "1px solid #fecaca" }}>
          <div className="text-center">
            <h3 className="text-lg font-bold" style={{ color: "#ef4444" }}>Market Investment</h3>
            <p className="text-xs mt-1" style={{ color: "#8A9BB5" }}>Volatile — gains and losses</p>
          </div>
          <svg viewBox="0 0 640 180" className="w-full h-32">
            <path d={marketPath} fill="none" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
            <line x1="0" y1="120" x2="640" y2="120" stroke="#d1d5db" strokeWidth="1" strokeDasharray="6 4" />
          </svg>
          <p className="text-center text-sm font-semibold" style={{ color: "#ef4444" }}>Market risk</p>
        </div>

        <div className="rounded-xl p-6 space-y-4" style={{ background: "#f0fdf4", border: "1px solid #bbf7d0" }}>
          <div className="text-center">
            <h3 className="text-lg font-bold" style={{ color: "#00D47E" }}>IFA — Protected Growth</h3>
            <p className="text-xs mt-1" style={{ color: "#8A9BB5" }}>Gains lock in, losses don't reduce your value</p>
          </div>
          <svg viewBox="0 0 640 180" className="w-full h-32">
            <path d={ifaPath} fill="none" stroke="#00D47E" strokeWidth="3" strokeLinecap="round" />
            <line x1="0" y1="150" x2="640" y2="150" stroke="#d1d5db" strokeWidth="1" strokeDasharray="6 4" />
          </svg>
          <p className="text-center text-sm font-semibold" style={{ color: "#00D47E" }}>Protected growth</p>
        </div>
      </div>

      <p className="text-center text-sm max-w-xl mx-auto" style={{ color: "#8A9BB5" }}>
        With an IFA, when the index goes up, your account value increases. When the index goes down,
        your account value stays the same — it never decreases due to market losses.
      </p>
    </div>
  );
}
