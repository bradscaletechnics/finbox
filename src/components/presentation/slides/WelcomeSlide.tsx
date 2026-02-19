import { getAdvisorProfile } from "@/lib/advisor";
import type { PresentationContext } from "@/lib/presentation-decks";

interface Props {
  context?: PresentationContext;
}

export function WelcomeSlide({ context }: Props) {
  const profile = getAdvisorProfile();
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const title = context?.clientName
    ? `Financial Review for ${context.clientName}`
    : "Your Financial Review";

  return (
    <div className="flex flex-col items-center justify-center text-center space-y-8">
      <p className="text-sm font-medium tracking-widest uppercase" style={{ color: "#8A9BB5" }}>
        Prepared by
      </p>
      <div className="space-y-2">
        <h2 className="text-xl font-semibold" style={{ color: "#0A1628" }}>
          {context?.advisorName || profile.fullName}
        </h2>
        <p className="text-sm" style={{ color: "#8A9BB5" }}>
          {context?.advisorAgency || profile.agency}
        </p>
      </div>
      <div className="w-16 h-px" style={{ background: "#00D47E" }} />
      <h1 className="text-5xl font-bold leading-tight" style={{ color: "#0A1628" }}>
        {title}
      </h1>
      <p className="text-lg" style={{ color: "#8A9BB5" }}>
        {dateStr}
      </p>
    </div>
  );
}
