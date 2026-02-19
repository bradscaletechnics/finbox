import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Briefcase, Shield, TrendingUp, Heart, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { triggerAchievement } from "@/components/ui/AchievementToast";
import { incrementSessionStat } from "@/hooks/use-session-stats";
import { addXP, XP_REWARDS } from "@/lib/xp";
import { createCase, setActiveCaseId } from "@/lib/case-store";
import { useDiscovery } from "@/components/discovery/DiscoveryContext";

const productTypes = [
  { id: "IFA", label: "IFA", subtitle: "Immediate Financial Arrangement", icon: Shield, description: "Principal protection with index-linked growth potential. Ideal for conservative to moderate clients." },
  { id: "IUL", label: "IUL", subtitle: "Indexed Universal Life", icon: TrendingUp, description: "Permanent life insurance with cash value growth tied to market indices." },
  { id: "VUL", label: "VUL", subtitle: "Variable Universal Life", icon: TrendingUp, description: "Permanent life insurance with investment sub-accounts for growth-oriented clients." },
  { id: "UL", label: "UL", subtitle: "Universal Life", icon: Heart, description: "Flexible permanent life insurance with adjustable premiums and death benefit." },
  { id: "Term", label: "Term Life", subtitle: "Term Life Insurance", icon: Clock, description: "Affordable coverage for a specific period. Best for income replacement needs." },
] as const;

export default function NewCase() {
  const navigate = useNavigate();
  const { resetDiscovery, updateData } = useDiscovery();
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [clientName, setClientName] = useState("");

  const handleStart = () => {
    if (!selectedProduct || !clientName.trim()) return;

    // Create a real case in localStorage
    const newCase = createCase(clientName.trim(), selectedProduct);
    setActiveCaseId(newCase.id);

    // Reset discovery and pre-fill client name
    resetDiscovery();
    const nameParts = clientName.trim().split(/\s+/);
    updateData({
      firstName: nameParts[0] || "",
      lastName: nameParts.slice(1).join(" ") || "",
    });

    triggerAchievement("New Case Started", `${clientName.trim()} — ${selectedProduct} discovery begins`);
    incrementSessionStat("casesTouched");
    addXP(XP_REWARDS.caseCreated);
    navigate("/client-discovery");
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[28px] font-semibold tracking-tight text-foreground">Start New Case</h1>
        <p className="mt-1 text-sm text-muted-foreground/70">Select a product type and enter client information to begin the discovery process.</p>
      </div>

      {/* Client Name */}
      <div className="glass-edge rounded-card border border-white/[0.04] bg-card p-6 shadow-card">
        <label className="mb-2 block text-[13px] font-medium uppercase tracking-widest text-muted-foreground/50">Client Name</label>
        <input
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          placeholder="e.g. Robert & Sarah Chen"
          className="h-10 w-full max-w-md rounded-button border-0 bg-white/[0.04] px-3 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:bg-white/[0.06] focus:ring-1 focus:ring-primary/30 transition-colors"
        />
      </div>

      {/* Product Selection */}
      <div>
        <h2 className="mb-4 text-[13px] font-medium uppercase tracking-widest text-muted-foreground/50">Select Product Type</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {productTypes.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedProduct(p.id)}
              className={cn(
                "flex flex-col items-start gap-3 rounded-card border p-5 text-left transition-all duration-200 hover-lift",
                selectedProduct === p.id
                  ? "border-primary bg-primary/5 ring-1 ring-primary"
                  : "border-white/[0.04] bg-card hover:border-white/[0.08]"
              )}
            >
              <div className={cn(
                "flex h-10 w-10 items-center justify-center rounded-card icon-breathe",
                selectedProduct === p.id ? "bg-primary/20 text-primary" : "bg-secondary/50 text-muted-foreground"
              )}>
                <p.icon className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-foreground">{p.label}</span>
                  <span className="text-xs text-muted-foreground/50">·</span>
                  <span className="text-xs text-muted-foreground/70">{p.subtitle}</span>
                </div>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground/70">{p.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Start Button */}
      <div className="flex justify-end pt-2">
        <button
          onClick={handleStart}
          disabled={!selectedProduct || !clientName.trim()}
          className="flex items-center gap-2 rounded-button bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 press-scale"
        >
          <Briefcase className="h-4 w-4" />
          Begin Discovery
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
