import { Clock, AlertCircle, CheckCircle2 } from "lucide-react";

const tasks = [
  {
    title: "Follow up with Chen family — IFA illustrations",
    due: "Today, 3:00 PM",
    case: "Chen IFA-2024-089",
    priority: "high" as const,
  },
  {
    title: "Submit Whitfield IUL application to carrier",
    due: "Tomorrow",
    case: "Whitfield IUL-2024-102",
    priority: "medium" as const,
  },
  {
    title: "Compliance review — Morales Term Life",
    due: "Feb 12, 2026",
    case: "Morales TRM-2024-115",
    priority: "low" as const,
  },
  {
    title: "Schedule suitability meeting — Wright IFA",
    due: "Feb 13, 2026",
    case: "Wright IFA-2024-118",
    priority: "medium" as const,
  },
];

const priorityIcon = {
  high: <AlertCircle className="h-4 w-4 text-warning" />,
  medium: <Clock className="h-4 w-4 text-info" />,
  low: <CheckCircle2 className="h-4 w-4 text-muted-foreground" />,
};

export function UpcomingTasks() {
  return (
    <div className="rounded-card border border-white/[0.04] bg-card shadow-card">
      <div className="px-5 py-4">
        <h2 className="text-[13px] font-medium uppercase tracking-widest text-muted-foreground/60">Upcoming Tasks</h2>
      </div>
      <div className="divide-y divide-white/[0.03]">
        {tasks.map((task, i) => (
          <div key={i} className="flex items-start gap-3 px-5 py-4 hover:bg-white/[0.02] transition-all duration-200 cursor-pointer">
            <div className="mt-0.5">{priorityIcon[task.priority]}</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">{task.title}</p>
              <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                <span>{task.due}</span>
                <span className="font-mono">{task.case}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
