import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Shield, TrendingUp, Heart, Layers } from "lucide-react";
import { useState } from "react";
import type { AdvisorPreferences } from "../OnboardingFlow";

const CARRIERS = [
  "Allianz", "Athene", "American Equity", "Corebridge", "F&G", "Global Atlantic",
  "Midland National", "Nationwide", "North American", "Pacific Life", "Sammons", "Securian", "Other",
];

const FOCUS_OPTIONS = [
  { value: "fia" as const, icon: TrendingUp, label: "Fixed Indexed Annuities", sub: "FIA, MYGA, SPIA" },
  { value: "life" as const, icon: Heart, label: "Life Insurance", sub: "IUL, VUL, UL, Term" },
  { value: "both" as const, icon: Layers, label: "Both", sub: "Full product suite" },
];

interface Props {
  preferences: AdvisorPreferences;
  onChange: (p: AdvisorPreferences) => void;
  onBack: () => void;
  onNext: () => void;
}

export function PreferencesStep({ preferences, onChange, onBack, onNext }: Props) {
  const [confirmPin, setConfirmPin] = useState("");
  const [pinError, setPinError] = useState("");

  const toggleCarrier = (carrier: string) => {
    const next = preferences.carriers.includes(carrier)
      ? preferences.carriers.filter((c) => c !== carrier)
      : [...preferences.carriers, carrier];
    onChange({ ...preferences, carriers: next });
  };

  const handleContinue = () => {
    if (preferences.pin.length < 6) {
      setPinError("Please enter a 6-digit PIN.");
      return;
    }
    if (preferences.pin !== confirmPin) {
      setPinError("PINs do not match.");
      return;
    }
    setPinError("");
    onNext();
  };

  const canContinue = preferences.productFocus && preferences.pin.length === 6 && confirmPin.length === 6;

  return (
    <div className="px-8 py-8 max-h-[70vh] overflow-y-auto">
      <h2 className="text-2xl font-bold text-foreground mb-1">Your Practice</h2>
      <p className="text-muted-foreground text-sm mb-6">Help FinBox tailor your experience.</p>

      {/* Product Focus */}
      <div className="mb-6">
        <Label className="text-sm font-medium mb-3 block">Primary Product Focus</Label>
        <div className="grid grid-cols-3 gap-3">
          {FOCUS_OPTIONS.map(({ value, icon: Icon, label, sub }) => {
            const active = preferences.productFocus === value;
            return (
              <button
                key={value}
                onClick={() => onChange({ ...preferences, productFocus: value })}
                className={`flex flex-col items-center gap-2 rounded-lg border p-4 text-center transition-all ${
                  active
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-muted-foreground/40"
                }`}
              >
                <Icon className={`h-5 w-5 ${active ? "text-primary" : "text-muted-foreground"}`} />
                <span className="text-xs font-medium text-foreground">{label}</span>
                <span className="text-[10px] text-muted-foreground">{sub}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Carrier Appointments */}
      <div className="mb-6">
        <Label className="text-sm font-medium mb-3 block">Carrier Appointments</Label>
        <div className="max-h-[200px] overflow-y-auto rounded-lg border border-border p-3 space-y-2">
          {CARRIERS.map((carrier) => (
            <label key={carrier} className="flex items-center gap-3 cursor-pointer py-1">
              <Checkbox
                checked={preferences.carriers.includes(carrier)}
                onCheckedChange={() => toggleCarrier(carrier)}
              />
              <span className="text-sm text-foreground">{carrier}</span>
            </label>
          ))}
        </div>
      </div>

      {/* PIN Setup */}
      <div className="mb-2">
        <Label className="text-sm font-medium mb-3 block flex items-center gap-2">
          <Shield className="h-4 w-4 text-primary" />
          Set Your Security PIN
        </Label>
        <div className="space-y-4">
          <div>
            <p className="text-xs text-muted-foreground mb-2">Enter a 6-digit PIN</p>
            <InputOTP
              maxLength={6}
              value={preferences.pin}
              onChange={(v) => { onChange({ ...preferences, pin: v }); setPinError(""); }}
            >
              <InputOTPGroup>
                {Array.from({ length: 6 }).map((_, i) => (
                  <InputOTPSlot key={i} index={i} className="h-11 w-11" />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-2">Confirm PIN</p>
            <InputOTP
              maxLength={6}
              value={confirmPin}
              onChange={(v) => { setConfirmPin(v); setPinError(""); }}
            >
              <InputOTPGroup>
                {Array.from({ length: 6 }).map((_, i) => (
                  <InputOTPSlot key={i} index={i} className="h-11 w-11" />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </div>
          {pinError && <p className="text-xs text-destructive">{pinError}</p>}
          <p className="text-xs text-muted-foreground">
            This PIN encrypts and protects all client data on this device. You'll enter it each time you open FinBox.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between mt-8">
        <button onClick={onBack} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          Back
        </button>
        <Button onClick={handleContinue} disabled={!canContinue}>Continue</Button>
      </div>
    </div>
  );
}
