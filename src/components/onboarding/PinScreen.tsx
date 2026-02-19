import { useState } from "react";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { FinBoxLogo } from "@/components/ui/FinBoxLogo";
import { TreasureChest3D } from "@/components/ui/TreasureChest3D";
import { unlockAudio, playChestOpen, playPinDigit, playPinSuccess, playPinError } from "@/lib/sounds";
import { getAdvisorProfile, isAdmin } from "@/lib/advisor";

interface PinScreenProps {
  onUnlock: () => void;
  onCreateNew?: () => void;
}

export function PinScreen({ onUnlock, onCreateNew }: PinScreenProps) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);
  const [success, setSuccess] = useState(false);
  const userIsAdmin = isAdmin();

  const handleUnlock = () => {
    const storedPin = localStorage.getItem("finbox_pin");
    if (pin === storedPin) {
      playPinSuccess();
      setSuccess(true);
      setTimeout(onUnlock, 500);
    } else {
      playPinError();
      setError("Incorrect PIN. Please try again.");
      setShake(true);
      setTimeout(() => { setShake(false); setPin(""); }, 400);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background transition-opacity duration-500"
      style={{ opacity: success ? 0 : 1 }}
    >
      {/* Ambient gold glow */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, hsla(43, 70%, 52%, 0.08) 0%, transparent 70%)" }}
      />

      {/* Logo */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2" style={{ animation: "logo-breathe 3s ease-in-out infinite" }}>
        <FinBoxLogo size="md" />
      </div>

      {/* Chest — opens with sound every launch */}
      <div className="mb-2 mt-16">
        <TreasureChest3D size="sm" onOpen={playChestOpen} />
      </div>

      <div className="w-full max-w-sm mx-4 rounded-modal p-8 flex flex-col items-center bg-card border border-border/60" style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.4)" }}>
        <h2 className="text-xl font-bold text-foreground mb-1">Enter Your PIN</h2>

        <div className="flex items-center gap-3 mb-6">
          <span className="h-px w-6 bg-gradient-to-r from-transparent to-gold/30" />
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground/60">Unlock Workstation</p>
          <span className="h-px w-6 bg-gradient-to-l from-transparent to-gold/30" />
        </div>

        <div className={shake ? "pin-shake" : ""}>
          <InputOTP
            maxLength={6}
            value={pin}
            onChange={(v) => {
              // First digit unlocks AudioContext and flushes the queued chest sound
              if (pin.length === 0 && v.length === 1) unlockAudio();
              // Play a tap for each new digit added
              if (v.length > pin.length) playPinDigit();
              setPin(v);
              setError("");
            }}
          >
            <InputOTPGroup>
              {Array.from({ length: 6 }).map((_, i) => (
                <InputOTPSlot
                  key={i}
                  index={i}
                  className={`h-12 w-12 transition-colors duration-200 ${
                    success ? "border-gold bg-gold/10" : error && shake ? "border-destructive" : ""
                  }`}
                />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </div>

        {error && !shake && <p className="text-xs text-destructive mt-3">{error}</p>}

        <Button
          onClick={() => { unlockAudio(); handleUnlock(); }}
          disabled={pin.length < 6}
          className="mt-6 w-full bg-gradient-to-r from-gold to-accent hover:from-gold/90 hover:to-accent/90 text-accent-foreground font-semibold shadow-lg transition-all duration-300 hover:shadow-[0_4px_20px_hsla(43,70%,52%,0.3)]"
          size="lg"
        >
          Unlock
        </Button>

        <p className="mt-5 text-[11px] text-muted-foreground/35 tracking-wide">
          Secure · Offline-First
        </p>

        <div className="mt-4 flex flex-col items-center gap-2">
          {userIsAdmin && (
            <button
              onClick={() => { setSuccess(true); setTimeout(onUnlock, 500); }}
              className="text-[10px] text-gold/40 hover:text-gold/70 transition-colors underline"
              title="Admin bypass"
            >
              Admin Bypass
            </button>
          )}

          {onCreateNew && (
            <button
              onClick={onCreateNew}
              className="text-[10px] text-muted-foreground/40 hover:text-muted-foreground/70 transition-colors underline"
            >
              Create New Advisor Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
