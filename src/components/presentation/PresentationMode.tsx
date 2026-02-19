import { useState, useCallback, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PresentationContext } from "@/lib/presentation-decks";
import { CLIENT_DECK_SLIDES, buildGenericContext } from "@/lib/presentation-decks";

import { WelcomeSlide } from "./slides/WelcomeSlide";
import { GoalsSlide } from "./slides/GoalsSlide";
import { HowIFAWorksSlide } from "./slides/HowIFAWorksSlide";
import { PrincipalProtectionSlide } from "./slides/PrincipalProtectionSlide";
import { IncomeForLifeSlide } from "./slides/IncomeForLifeSlide";
import { RecommendationSlide } from "./slides/RecommendationSlide";
import { NextStepsSlide } from "./slides/NextStepsSlide";

type SlideComponent = React.FC<{ context?: PresentationContext }>;

const SLIDE_MAP: Record<string, SlideComponent> = {
  "welcome": WelcomeSlide,
  "goals": GoalsSlide,
  "how-ifa-works": HowIFAWorksSlide,
  "principal-protection": PrincipalProtectionSlide,
  "income-for-life": IncomeForLifeSlide,
  "recommendation": RecommendationSlide,
  "next-steps": NextStepsSlide,
};

export default function PresentationMode() {
  const location = useLocation();
  const state = location.state as { slides?: string[]; context?: PresentationContext } | null;

  const slideKeys = state?.slides ?? CLIENT_DECK_SLIDES;
  const context = state?.context ?? buildGenericContext();
  const SLIDES = slideKeys.map((k) => SLIDE_MAP[k]).filter(Boolean);

  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState<"left" | "right">("right");
  const navigate = useNavigate();

  const goTo = useCallback(
    (index: number) => {
      if (index < 0 || index >= SLIDES.length || index === current) return;
      setDirection(index > current ? "right" : "left");
      setCurrent(index);
    },
    [current, SLIDES.length]
  );

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") next();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "Escape") navigate("/presentations");
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [next, prev, navigate]);

  const SlideComponent = SLIDES[current];
  if (!SlideComponent) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col overflow-hidden"
      style={{ background: "#F8FAFB", color: "#0A1628" }}
    >
      <button
        onClick={() => navigate("/presentations")}
        className="absolute right-6 top-5 z-50 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium opacity-40 hover:opacity-100 transition-opacity"
        style={{ color: "#0A1628", border: "1px solid #d1d5db" }}
      >
        <X className="h-3.5 w-3.5" /> Exit Presentation
      </button>

      <div className="flex-1 flex items-center justify-center px-16 py-12 overflow-hidden">
        <div
          key={current}
          className={cn(
            "w-full max-w-5xl animate-in fade-in duration-500",
            direction === "right" ? "slide-in-from-right-4" : "slide-in-from-left-4"
          )}
        >
          <SlideComponent context={context} />
        </div>
      </div>

      {/* Click zones */}
      <div className="absolute inset-0 flex pointer-events-none">
        <div className="w-1/4 h-full pointer-events-auto cursor-pointer" onClick={prev} />
        <div className="flex-1" />
        <div className="w-1/4 h-full pointer-events-auto cursor-pointer" onClick={next} />
      </div>

      {current > 0 && (
        <button
          onClick={prev}
          className="absolute left-6 top-1/2 -translate-y-1/2 z-50 flex h-10 w-10 items-center justify-center rounded-full opacity-30 hover:opacity-80 transition-opacity"
          style={{ background: "#e5e7eb" }}
        >
          <ChevronLeft className="h-5 w-5" style={{ color: "#0A1628" }} />
        </button>
      )}
      {current < SLIDES.length - 1 && (
        <button
          onClick={next}
          className="absolute right-6 top-1/2 -translate-y-1/2 z-50 flex h-10 w-10 items-center justify-center rounded-full opacity-30 hover:opacity-80 transition-opacity"
          style={{ background: "#e5e7eb" }}
        >
          <ChevronRight className="h-5 w-5" style={{ color: "#0A1628" }} />
        </button>
      )}

      <div className="flex items-center justify-center gap-2 pb-6">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={cn(
              "h-2.5 rounded-full transition-all duration-300",
              i === current ? "w-8" : "w-2.5"
            )}
            style={{
              background: i === current ? "#00D47E" : "#d1d5db",
            }}
          />
        ))}
      </div>

      <div className="absolute bottom-4 right-6 text-xs font-semibold opacity-10 select-none" style={{ color: "#0A1628" }}>
        Fin<span className="font-extrabold">Box</span>
      </div>
    </div>
  );
}
