import { Button } from "@/components/ui/button";
import { ShieldCheck, CheckCircle2, Crown } from "lucide-react";
import type { AdvisorProfile, AdvisorPreferences } from "../OnboardingFlow";

const FOCUS_LABELS: Record<string, string> = {
  fia: "Fixed Indexed Annuities",
  life: "Life Insurance",
  both: "Full Product Suite",
};

interface Props {
  profile: AdvisorProfile;
  preferences: AdvisorPreferences;
  onComplete: () => void;
}

export function ReadyStep({ profile, preferences, onComplete }: Props) {
  const isFirstAdvisor = !localStorage.getItem("finbox_admin");

  return (
    <div className="px-8 py-10 flex flex-col items-center text-center">
      {/* Animated checkmark */}
      <div className="relative mb-6">
        <div className="h-20 w-20 rounded-full bg-primary/15 flex items-center justify-center">
          <CheckCircle2
            className="h-10 w-10 text-primary"
            style={{ animation: "checkDraw 0.6s ease-out" }}
          />
        </div>
      </div>

      <h2 className="text-2xl font-bold text-foreground mb-1">You're All Set</h2>
      <p className="text-muted-foreground text-sm mb-2">
        {profile.fullName || "Advisor"}, your FinBox is configured and ready.
      </p>

      {isFirstAdvisor && (
        <div className="flex items-center gap-1.5 mb-6 px-3 py-1.5 rounded-full bg-gold/10 border border-gold/30">
          <Crown className="h-3.5 w-3.5 text-gold" />
          <span className="text-xs font-semibold text-gold">Admin · First Advisor</span>
        </div>
      )}

      {/* Summary card */}
      <div className="w-full rounded-lg border border-border p-5 text-left space-y-3 mb-8" style={{ background: "rgba(42,58,78,0.3)" }}>
        <Row label="Name" value={profile.fullName} />
        <Row label="Agency" value={profile.agency || "—"} />
        <Row label="Province" value={profile.state || "—"} />
        <Row label="Product Focus" value={FOCUS_LABELS[preferences.productFocus] || "—"} />
        <Row label="Carriers" value={`${preferences.carriers.length} selected`} />
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Data encryption</span>
          <span className="flex items-center gap-1.5 text-xs font-medium text-primary">
            <ShieldCheck className="h-3.5 w-3.5" /> Active
          </span>
        </div>
      </div>

      <Button onClick={onComplete} size="lg" className="px-12">
        Open Dashboard
      </Button>

      <style>{`
        @keyframes checkDraw {
          from { opacity: 0; transform: scale(0.5); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-xs font-medium text-foreground">{value}</span>
    </div>
  );
}
