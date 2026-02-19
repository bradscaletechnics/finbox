import { useNavigate } from "react-router-dom";
import {
  PlayCircle,
  Users,
  BookOpen,
  Video,
  Lock,
  Landmark,
  TrendingUp,
  Shield,
  BarChart3,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  getPresentableCases,
  GENERAL_DECKS,
  CLIENT_DECK_SLIDES,
  buildContextFromCase,
  buildGenericContext,
  type DeckDefinition,
} from "@/lib/presentation-decks";

const DECK_ICONS: Record<string, React.FC<{ className?: string }>> = {
  "annuities-101": Landmark,
  "tax-deferral": TrendingUp,
  "retirement-income": BarChart3,
  risk: Shield,
};

export default function Presentations() {
  const navigate = useNavigate();
  const cases = getPresentableCases();

  const launchClient = (caseId: string) => {
    const c = cases.find((x) => x.id === caseId);
    if (!c) return;
    navigate("/presentations/play", {
      state: {
        slides: CLIENT_DECK_SLIDES,
        context: buildContextFromCase(c),
      },
    });
  };

  const launchGeneral = (deck: DeckDefinition) => {
    navigate("/presentations/play", {
      state: {
        slides: deck.slides,
        context: buildGenericContext(),
      },
    });
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-lg font-semibold text-foreground">Presentations</h1>
        <p className="text-xs text-muted-foreground mt-1">
          Launch client-specific or educational decks in full-screen presentation mode.
        </p>
      </div>

      {/* Section A: Client Presentations */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">
            Client Presentations
          </h2>
        </div>

        {cases.length === 0 ? (
          <p className="text-xs text-muted-foreground">
            No cases are ready for presentation yet. Cases must be In Progress, Review, or Ready for
            Handoff.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cases.map((c) => (
              <Card
                key={c.id}
                className="group glow-border-hover cursor-pointer transition-colors hover:border-primary/30"
                onClick={() => launchClient(c.id)}
              >
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-foreground">{c.client}</p>
                      <p className="text-[10px] text-muted-foreground font-mono">{c.id}</p>
                    </div>
                    <Badge
                      variant="outline"
                      className="text-[10px] shrink-0"
                    >
                      {c.status}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{c.product}</span>
                    <span>·</span>
                    <span>{c.carrier}</span>
                    <span>·</span>
                    <span>{c.premium}</span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-muted-foreground">
                      {CLIENT_DECK_SLIDES.length} slides
                    </span>
                    <span className="flex items-center gap-1 text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      <PlayCircle className="h-3.5 w-3.5" />
                      Present
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Section B: General / Educational */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">
            Educational Decks
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {GENERAL_DECKS.map((deck) => {
            const Icon = DECK_ICONS[deck.id] || BookOpen;
            return (
              <Card
                key={deck.id}
                className="group glow-border-hover cursor-pointer transition-colors hover:border-primary/30"
                onClick={() => launchGeneral(deck)}
              >
                <CardContent className="p-5 space-y-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-foreground">{deck.title}</p>
                    <p className="text-xs text-muted-foreground">{deck.description}</p>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-muted-foreground">
                      {deck.slideCount} slides
                    </span>
                    <span className="flex items-center gap-1 text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      <PlayCircle className="h-3.5 w-3.5" />
                      Present
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Section C: Video Teasers */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Video className="h-4 w-4 text-muted-foreground/50" />
          <h2 className="text-sm font-semibold text-muted-foreground/50 uppercase tracking-wider">
            Video Presentations
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {["Personalized Client Walkthrough", "Product Overview Reel"].map((title) => (
            <Card
              key={title}
              className="border-dashed opacity-50 cursor-not-allowed"
            >
              <CardContent className="p-5 space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted/50">
                  <Lock className="h-4 w-4 text-muted-foreground/40" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-muted-foreground/60">{title}</p>
                  <p className="text-xs text-muted-foreground/40">Coming Soon</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
