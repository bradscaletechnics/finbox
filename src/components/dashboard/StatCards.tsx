import { Briefcase, DollarSign, ArrowRightLeft, ShieldCheck, TrendingUp, TrendingDown } from "lucide-react";
import { useCountUp } from "@/hooks/use-count-up";
import { cn } from "@/lib/utils";

const stats = [
  {
    label: "Active Cases",
    value: 12,
    prefix: "",
    suffix: "",
    subtitle: "3 need attention",
    subtitleColor: "text-warning",
    icon: Briefcase,
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
    glow: "text-glow-primary",
    delta: 3,
    deltaLabel: "+3 this week",
    deltaType: "positive" as const,
  },
  {
    label: "This Month",
    value: 2400000,
    prefix: "$",
    suffix: "",
    subtitle: "Total submitted premium",
    subtitleColor: "text-muted-foreground",
    icon: DollarSign,
    iconBg: "bg-gold/10",
    iconColor: "text-gold",
    glow: "text-glow-gold",
    isGold: true,
    delta: 340000,
    deltaLabel: "+$340K",
    deltaType: "gold" as const,
  },
  {
    label: "Pending Handoffs",
    value: 5,
    prefix: "",
    suffix: "",
    subtitle: "Ready for closer review",
    subtitleColor: "text-muted-foreground",
    icon: ArrowRightLeft,
    iconBg: "bg-info/10",
    iconColor: "text-info",
    glow: "text-glow-primary",
    delta: -1,
    deltaLabel: "-1 this week",
    deltaType: "negative" as const,
  },
  {
    label: "Compliance Score",
    value: 98,
    prefix: "",
    suffix: "%",
    subtitle: "All cases compliant",
    subtitleColor: "text-primary",
    icon: ShieldCheck,
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
    glow: "text-glow-primary",
    delta: 2,
    deltaLabel: "+2%",
    deltaType: "positive" as const,
  },
];

function SlotDigits({ text, completed }: { text: string; completed: boolean }) {
  return (
    <span className={cn("inline-flex", completed && "value-landed")}>
      {text.split("").map((char, i) => (
        <span
          key={i}
          className={completed ? "digit-land" : ""}
          style={completed ? { animationDelay: `${i * 50}ms` } : undefined}
        >
          {char}
        </span>
      ))}
    </span>
  );
}

function AnimatedStatValue({ stat }: { stat: typeof stats[0] }) {
  const { value: animated, completed } = useCountUp(stat.value, 1200);
  
  const formattedValue = stat.isGold
    ? (animated >= 1000000 
        ? `$${(animated / 1000000).toFixed(1)}M` 
        : `$${animated.toLocaleString("en-US")}`)
    : `${stat.prefix}${animated.toLocaleString("en-US")}${stat.suffix}`;

  return (
    <span className={cn(
      stat.isGold ? "text-gold" : "text-foreground",
      stat.glow,
    )}>
      <SlotDigits text={formattedValue} completed={completed} />
    </span>
  );
}

function DeltaIndicator({ stat }: { stat: typeof stats[0] }) {
  const { value: deltaAnimated } = useCountUp(Math.abs(stat.delta), 600);
  const isNeg = stat.delta < 0;
  const Icon = isNeg ? TrendingDown : TrendingUp;

  const colorClass = stat.deltaType === "gold"
    ? "text-gold"
    : stat.deltaType === "negative"
    ? "text-destructive"
    : "text-primary";

  return (
    <div className={cn("flex items-center gap-1 mt-1", colorClass)}>
      <Icon className="h-3 w-3" />
      <span className="text-xs font-medium font-mono">
        {isNeg ? "-" : "+"}{stat.deltaType === "gold" ? `$${Math.round(deltaAnimated / 1000)}K` : deltaAnimated}{stat.suffix && !stat.isGold ? stat.suffix : ""}
      </span>
      <span className="text-[10px] text-muted-foreground/50 ml-0.5">this week</span>
    </div>
  );
}

export function StatCards() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={cn(
            "glass-edge card-hover rounded-card border bg-card p-6 shadow-elevated group glow-border-hover relative overflow-hidden",
            stat.isGold ? "border-gold/15" : "border-white/[0.04]"
          )}
        >
          {/* Gold accent top line for financial card */}
          {stat.isGold && (
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
          )}
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground/60">{stat.label}</p>
            <div className={cn(
              "flex h-9 w-9 items-center justify-center rounded-card backdrop-blur-sm icon-breathe",
              stat.isGold ? "bg-gold/10" : stat.iconBg
            )}>
              <stat.icon className={cn("h-5 w-5", stat.isGold ? "text-gold" : stat.iconColor)} />
            </div>
          </div>
          <p className="mt-3 text-[40px] font-bold font-mono leading-none tracking-tight">
            <AnimatedStatValue stat={stat} />
          </p>
          <p className={cn("mt-2 text-sm", stat.subtitleColor)}>{stat.subtitle}</p>
          <DeltaIndicator stat={stat} />
        </div>
      ))}
    </div>
  );
}
