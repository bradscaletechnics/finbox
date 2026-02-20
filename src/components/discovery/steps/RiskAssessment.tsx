import { cn } from "@/lib/utils";
import { useDiscovery } from "../DiscoveryContext";
import { playSelect } from "@/lib/sounds";

const QUESTIONS = [
  {
    id: "q1",
    question: "If your account lost 15% of its value in one year, you would:",
    options: [
      { key: "A", label: "Move everything to safe, guaranteed investments" },
      { key: "B", label: "Wait and see how things develop over the next few months" },
      { key: "C", label: "Stay the course — losses are part of long-term investing" },
      { key: "D", label: "Invest more at the lower prices to take advantage of the dip" },
    ],
  },
  {
    id: "q2",
    question: "When it comes to investing, your primary concern is:",
    options: [
      { key: "A", label: "Preserving my principal — I can't afford to lose money" },
      { key: "B", label: "Generating steady income with minimal risk" },
      { key: "C", label: "Balanced growth with some protection against losses" },
      { key: "D", label: "Maximizing long-term growth, even if it means short-term volatility" },
    ],
  },
  {
    id: "q3",
    question: "How would you describe your investment experience?",
    options: [
      { key: "A", label: "Very limited — mostly savings accounts and CDs" },
      { key: "B", label: "Some experience with mutual funds or bonds" },
      { key: "C", label: "Experienced with a diversified portfolio including stocks" },
      { key: "D", label: "Very experienced — comfortable with complex investment strategies" },
    ],
  },
  {
    id: "q4",
    question: "What portion of your total assets would this investment represent?",
    options: [
      { key: "A", label: "More than 50% — this is a significant portion of my wealth" },
      { key: "B", label: "25–50% — a meaningful but not majority portion" },
      { key: "C", label: "10–25% — one piece of a larger portfolio" },
      { key: "D", label: "Less than 10% — a small allocation" },
    ],
  },
  {
    id: "q5",
    question: "If you could choose one investment outcome, it would be:",
    options: [
      { key: "A", label: "Never lose money, even if growth is minimal" },
      { key: "B", label: "Small, predictable returns with very low risk" },
      { key: "C", label: "Moderate growth with moderate risk" },
      { key: "D", label: "High growth potential, accepting significant risk" },
    ],
  },
];

const RISK_LEVELS = [
  { label: "Conservative", range: [0, 1] },
  { label: "Moderately Conservative", range: [1, 2] },
  { label: "Moderate", range: [2, 3] },
  { label: "Moderately Aggressive", range: [3, 4] },
  { label: "Aggressive", range: [4, 5] },
];

function getRiskScore(answers: Record<string, string>): number {
  const values: Record<string, number> = { A: 0, B: 1, C: 2, D: 3 };
  const answered = Object.values(answers);
  if (answered.length === 0) return -1;
  const total = answered.reduce((sum, a) => sum + (values[a] ?? 0), 0);
  return total / answered.length;
}

function getRiskLabel(score: number): string {
  if (score < 0) return "";
  for (const level of RISK_LEVELS) {
    if (score >= level.range[0] && score < level.range[1]) return level.label;
  }
  return "Aggressive";
}

export function RiskAssessment() {
  const { data, updateData, highlightMissing } = useDiscovery();
  const score = getRiskScore(data.riskAnswers);
  const riskLabel = getRiskLabel(score);

  const selectAnswer = (questionId: string, key: string) => {
    playSelect();
    updateData({ riskAnswers: { ...data.riskAnswers, [questionId]: key } });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Risk Assessment</h2>
        <p className="mt-1 text-sm text-muted-foreground">Evaluate the client's risk tolerance through scenario-based questions.</p>
      </div>

      {QUESTIONS.map((q, qi) => {
        const unanswered = highlightMissing && !data.riskAnswers[q.id];
        return (
          <div key={q.id} id={`field-riskQ${qi + 1}`} className={cn("space-y-3 rounded-lg p-3 -mx-3 transition-colors", unanswered && "ring-1 ring-destructive/40 bg-destructive/5")}>
            <p className={cn("text-sm font-medium", unanswered ? "text-destructive" : "text-foreground")}>
              <span className="font-mono text-muted-foreground mr-2">{qi + 1}.</span>
              {q.question}
              {unanswered && <span className="ml-2 text-xs font-normal text-destructive/70">— required</span>}
            </p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {q.options.map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => selectAnswer(q.id, opt.key)}
                  className={cn(
                    "flex items-start gap-3 rounded-card border px-4 py-3 text-left text-sm transition-colors",
                    data.riskAnswers[q.id] === opt.key
                      ? "border-primary bg-primary/10 text-foreground"
                      : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                  )}
                >
                  <span className={cn(
                    "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                    data.riskAnswers[q.id] === opt.key
                      ? "bg-primary text-primary-foreground"
                      : "border border-border text-muted-foreground"
                  )}>
                    {opt.key}
                  </span>
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>
          </div>
        );
      })}

      {/* Risk Scale */}
      {Object.keys(data.riskAnswers).length > 0 && (
        <div className="rounded-card border border-border bg-card p-5 space-y-3">
          <h3 className="text-sm font-semibold text-foreground">Risk Profile Result</h3>
          <div className="flex items-center gap-1">
            {RISK_LEVELS.map((level) => (
              <div
                key={level.label}
                className={cn(
                  "flex-1 rounded-sm py-2 text-center text-xs font-medium transition-colors",
                  riskLabel === level.label
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary/50 text-muted-foreground"
                )}
              >
                {level.label}
              </div>
            ))}
          </div>
          {riskLabel && (
            <p className="text-sm text-foreground">
              Based on responses, this client's risk tolerance is: <span className="font-semibold text-primary">{riskLabel}</span>
            </p>
          )}
        </div>
      )}
    </div>
  );
}
