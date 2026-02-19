import { Button } from "@/components/ui/button";
import { TreasureChest3D } from "@/components/ui/TreasureChest3D";
import { playChestOpen } from "@/lib/sounds";

interface WelcomeStepProps {
  onNext: () => void;
}

export function WelcomeStep({ onNext }: WelcomeStepProps) {
  return (
    <div className="px-10 py-12 flex flex-col items-center text-center">
      {/* 3D Treasure chest */}
      <div className="mb-6">
        <TreasureChest3D onOpen={playChestOpen} />
      </div>

      {/* Wordmark */}
      <h1 className="text-4xl tracking-tight mb-2">
        <span className="font-light text-foreground">Fin</span>
        <span className="font-bold text-gold">Box</span>
      </h1>

      {/* Tagline */}
      <div className="flex items-center gap-3 mb-4">
        <span className="h-px w-8 bg-gradient-to-r from-transparent to-gold/40" />
        <span className="text-xs uppercase tracking-[0.25em] text-gold/70 font-medium">
          Advisory Workstation
        </span>
        <span className="h-px w-8 bg-gradient-to-l from-transparent to-gold/40" />
      </div>

      <p className="text-muted-foreground text-sm mb-10 max-w-sm leading-relaxed">
        Your complete toolkit for client discovery, presentations, and case management.
        Let's get you set up — this takes about 2 minutes.
      </p>

      <Button
        onClick={onNext}
        size="lg"
        className="px-12 bg-gradient-to-r from-gold to-accent hover:from-gold/90 hover:to-accent/90 text-accent-foreground font-semibold shadow-lg transition-all duration-300 hover:shadow-[0_4px_20px_hsla(43,70%,52%,0.3)]"
      >
        Set Up My Workstation
      </Button>

      <p className="mt-6 text-[11px] text-muted-foreground/40 tracking-wide">
        Secure · Offline-First · Built for Advisors
      </p>

      {/* Admin skip */}
      <button
        onClick={() => {
          localStorage.setItem("finbox_onboarded", "true");
          localStorage.setItem("finbox_pin", "000000");
          localStorage.setItem("finbox_profile", JSON.stringify({
            fullName: "Admin",
            agency: "Demo Agency",
            phone: "",
            email: "admin@demo.com",
            state: "Ontario",
            licenseNumber: "",
            npn: "",
          }));
          localStorage.setItem("finbox_preferences", JSON.stringify({
            productFocus: "both",
            carriers: [],
            pin: "000000",
          }));
          window.location.reload();
        }}
        className="mt-4 text-[10px] text-muted-foreground/30 hover:text-muted-foreground/60 transition-colors underline"
      >
        Skip (Admin)
      </button>
    </div>
  );
}
