import { useState, useCallback, useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useCountUp } from "@/hooks/use-count-up";
import { ProgressRing } from "@/components/discovery/ProgressRing";

interface Props {
  open: boolean;
  onClose: () => void;
}

function Dots({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-2 justify-center">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-2 w-2 rounded-full transition-all duration-300 ${
            i === current ? "bg-primary scale-125" : "bg-muted"
          }`}
        />
      ))}
    </div>
  );
}

function CardWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full max-w-[500px] mx-auto rounded-xl border border-border bg-card p-10 shadow-elevated text-center space-y-6">
      {children}
    </div>
  );
}

function Card1() {
  return (
    <CardWrapper>
      <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-lg bg-primary">
        <span className="text-lg font-bold text-primary-foreground">F</span>
      </div>
      <p className="text-sm uppercase tracking-widest text-muted-foreground">Your</p>
      <h2 className="text-4xl font-bold text-foreground">February</h2>
      <p className="text-sm text-muted-foreground">Monthly Performance Report</p>
    </CardWrapper>
  );
}

function Card2() {
  const { value: v } = useCountUp(12, 1200);
  return (
    <CardWrapper>
      <p className="text-sm uppercase tracking-widest text-muted-foreground">Cases Completed</p>
      <p className="text-6xl font-bold font-mono text-foreground text-glow-primary">{v}</p>
      <p className="text-sm text-muted-foreground">Across 3 product types</p>
    </CardWrapper>
  );
}

function Card3() {
  const { value: v } = useCountUp(2847500, 1500);
  return (
    <CardWrapper>
      <p className="text-sm uppercase tracking-widest text-muted-foreground">Premium Submitted</p>
      <p className="text-5xl font-bold font-mono text-gold text-glow-gold">${v.toLocaleString("en-US")}</p>
      <p className="text-sm text-primary">Your highest month yet!</p>
    </CardWrapper>
  );
}

function Card4() {
  return (
    <CardWrapper>
      <p className="text-sm uppercase tracking-widest text-muted-foreground">Fastest Case</p>
      <p className="text-5xl font-bold font-mono text-foreground">2.3 <span className="text-2xl">days</span></p>
      <p className="text-sm text-muted-foreground">Discovery to handoff — Robert Chen</p>
    </CardWrapper>
  );
}

function Card5() {
  const { value: v } = useCountUp(98, 1200);
  return (
    <CardWrapper>
      <p className="text-sm uppercase tracking-widest text-muted-foreground">Compliance Score</p>
      <div className="flex justify-center">
        <ProgressRing percentage={v} size={80} />
      </div>
      <p className="text-sm text-muted-foreground">Strong compliance builds trust</p>
    </CardWrapper>
  );
}

function Card6() {
  const days = Array.from({ length: 28 }, (_, i) => i < 24);
  return (
    <CardWrapper>
      <p className="text-sm uppercase tracking-widest text-muted-foreground">Activity</p>
      <p className="text-3xl font-bold font-mono text-foreground">24 <span className="text-lg font-normal text-muted-foreground">of 28 days</span></p>
      <div className="grid grid-cols-7 gap-1.5 max-w-[200px] mx-auto">
        {days.map((active, i) => (
          <div
            key={i}
            className={`h-5 w-5 rounded-sm ${active ? "bg-primary/70" : "bg-muted"}`}
          />
        ))}
      </div>
    </CardWrapper>
  );
}

function Card7({ onClose }: { onClose: () => void }) {
  return (
    <CardWrapper>
      <p className="text-sm uppercase tracking-widest text-muted-foreground">February Summary</p>
      <div className="space-y-3 text-left">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Cases</span>
          <span className="font-mono font-bold text-foreground">12</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Premium</span>
          <span className="font-mono font-bold text-gold">$2,847,500</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Compliance</span>
          <span className="font-mono font-bold text-primary">98%</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Active Days</span>
          <span className="font-mono font-bold text-foreground">24/28</span>
        </div>
      </div>
      <p className="text-sm text-primary font-medium">Keep the momentum going in March</p>
      <button
        onClick={onClose}
        className="btn-press w-full rounded-button bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
      >
        Close
      </button>
    </CardWrapper>
  );
}

const CARDS = [Card1, Card2, Card3, Card4, Card5, Card6];

export function MonthlyScorecard({ open, onClose }: Props) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (open) setCurrent(0);
  }, [open]);

  const next = useCallback(() => setCurrent((c) => Math.min(c + 1, CARDS.length)), []);
  const prev = useCallback(() => setCurrent((c) => Math.max(c - 1, 0)), []);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, next, prev, onClose]);

  if (!open) return null;

  const CardComponent = current < CARDS.length ? CARDS[current] : null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/95 backdrop-blur-sm">
      <button onClick={onClose} className="absolute top-6 right-6 text-muted-foreground hover:text-foreground transition-colors">
        <X className="h-6 w-6" />
      </button>

      <div className="flex-1 flex items-center justify-center w-full px-6">
        <button onClick={prev} disabled={current === 0} className="shrink-0 p-2 text-muted-foreground hover:text-foreground disabled:opacity-20 transition-colors">
          <ChevronLeft className="h-8 w-8" />
        </button>

        <div className="flex-1 flex justify-center animate-fade-in" key={current}>
          {CardComponent ? <CardComponent /> : <Card7 onClose={onClose} />}
        </div>

        <button onClick={next} disabled={current === CARDS.length} className="shrink-0 p-2 text-muted-foreground hover:text-foreground disabled:opacity-20 transition-colors">
          <ChevronRight className="h-8 w-8" />
        </button>
      </div>

      <div className="pb-8">
        <Dots current={current} total={CARDS.length + 1} />
      </div>
    </div>
  );
}
