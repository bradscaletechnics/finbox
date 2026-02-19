import { Phone, Mail, MapPin } from "lucide-react";
import { getAdvisorProfile } from "@/lib/advisor";
import type { PresentationContext } from "@/lib/presentation-decks";

const steps = [
  { num: "1", text: "Complete your application today", sub: "We'll walk through the paperwork together" },
  { num: "2", text: "Underwriting review", sub: "Typically 5–7 business days" },
  { num: "3", text: "Policy issued — your money starts working", sub: "Funds transfer and coverage begins" },
];

interface Props {
  context?: PresentationContext;
}

export function NextStepsSlide({ context }: Props) {
  const profile = getAdvisorProfile();

  return (
    <div className="space-y-10">
      <div className="text-center space-y-2">
        <p className="text-sm font-medium tracking-widest uppercase" style={{ color: "#8A9BB5" }}>
          Moving Forward
        </p>
        <h1 className="text-4xl font-bold" style={{ color: "#0A1628" }}>
          Next Steps
        </h1>
      </div>

      <div className="max-w-2xl mx-auto space-y-4">
        {steps.map((step) => (
          <div
            key={step.num}
            className="flex items-start gap-4 rounded-xl p-5"
            style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-bold text-lg" style={{ background: "#00D47E", color: "#0A1628" }}>
              {step.num}
            </div>
            <div>
              <p className="text-base font-semibold" style={{ color: "#0A1628" }}>{step.text}</p>
              <p className="text-sm mt-0.5" style={{ color: "#8A9BB5" }}>{step.sub}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center space-y-6">
        <h2 className="text-3xl font-bold" style={{ color: "#0A1628" }}>
          Questions?
        </h2>
        <div className="flex items-center justify-center gap-8 text-sm" style={{ color: "#8A9BB5" }}>
          {profile.phone && (
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4" style={{ color: "#00D47E" }} />
              <span>{profile.phone}</span>
            </div>
          )}
          {profile.email && (
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" style={{ color: "#00D47E" }} />
              <span>{profile.email}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" style={{ color: "#00D47E" }} />
            <span>{profile.state || "United States"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
