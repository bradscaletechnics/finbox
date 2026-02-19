import { cn } from "@/lib/utils";

interface FinBoxLogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

export function FinBoxLogo({ size = "md", showText = true, className }: FinBoxLogoProps) {
  const dimensions = {
    sm: { mark: 28, svg: 18 },
    md: { mark: 32, svg: 20 },
    lg: { mark: 48, svg: 30 },
  }[size];

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      {/* Premium geometric mark */}
      <div
        className="relative flex items-center justify-center rounded-lg overflow-hidden"
        style={{
          width: dimensions.mark,
          height: dimensions.mark,
          background: "linear-gradient(135deg, hsl(43 70% 52%) 0%, hsl(38 80% 42%) 100%)",
          boxShadow: "0 2px 12px hsla(43, 70%, 50%, 0.25), inset 0 1px 0 hsla(0, 0%, 100%, 0.2)",
        }}
      >
        <svg
          width={dimensions.svg}
          height={dimensions.svg}
          viewBox="0 0 30 30"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Stylized F monogram with diagonal growth stroke */}
          <path
            d="M8 6h14v3.5H12.5v4.5H20v3.5h-7.5V24H8V6z"
            fill="hsl(216 55% 8%)"
            opacity="0.9"
          />
          {/* Diagonal accent stroke — growth/progress motif */}
          <path
            d="M20 18l4 -12"
            stroke="hsl(216 55% 8%)"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.35"
          />
        </svg>
      </div>

      {showText && (
        <span
          className={cn(
            "tracking-tight",
            size === "sm" && "text-base",
            size === "md" && "text-lg",
            size === "lg" && "text-2xl",
          )}
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          <span className="font-medium text-foreground">Fin</span>
          <span className="font-bold text-gold">Box</span>
        </span>
      )}
    </div>
  );
}
