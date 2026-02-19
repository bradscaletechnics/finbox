export function getRiskLabel(answers: Record<string, string>): string {
  const values: Record<string, number> = { A: 0, B: 1, C: 2, D: 3 };
  const answered = Object.values(answers);
  if (answered.length === 0) return "Not assessed";
  const score = answered.reduce((s, a) => s + (values[a] ?? 0), 0) / answered.length;
  if (score < 1) return "Conservative";
  if (score < 2) return "Moderately Conservative";
  if (score < 3) return "Moderate";
  return score < 4 ? "Moderately Aggressive" : "Aggressive";
}
