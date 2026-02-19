import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MOCK_CASES } from "@/lib/mock-cases";

type CaseStatus = "Discovery" | "In Progress" | "Ready for Handoff" | "Submitted" | "Closed";

const statusStyles: Record<CaseStatus, string> = {
  Discovery: "bg-info/15 text-info",
  "In Progress": "bg-warning/15 text-warning",
  "Ready for Handoff": "bg-primary/15 text-primary",
  Submitted: "bg-muted text-muted-foreground",
  Closed: "bg-secondary text-muted-foreground",
};

const recentCases = MOCK_CASES.slice(0, 6);

export function RecentCases() {
  const navigate = useNavigate();
  return (
    <div className="rounded-card border border-white/[0.04] bg-card shadow-card">
      <div className="flex items-center justify-between px-5 py-4">
        <h2 className="text-[13px] font-medium uppercase tracking-widest text-muted-foreground/60">Recent Cases</h2>
        <button onClick={() => navigate("/active-cases")} className="group flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors">
          View all <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
             <tr className="border-b border-white/[0.03] text-left">
              <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground/50">Client Name</th>
              <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground/50">Product</th>
              <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground/50">Status</th>
              <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground/50">Updated</th>
              <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground/50"></th>
            </tr>
          </thead>
          <tbody>
            {recentCases.map((c) => (
              <tr key={c.id} className="border-b border-white/[0.03] last:border-0 hover:bg-white/[0.02] transition-all duration-200 cursor-pointer">
                <td className="px-5 py-4 text-sm font-medium text-foreground">{c.client}</td>
                <td className="px-5 py-4 text-sm font-mono text-muted-foreground">{c.product}</td>
                <td className="px-5 py-4">
                  <span className={cn("inline-block rounded-full px-2.5 py-1 text-xs font-medium", statusStyles[c.status])}>
                    {c.status}
                  </span>
                </td>
                <td className="px-5 py-4 text-sm text-muted-foreground">{c.updated}</td>
                <td className="px-5 py-4">
                  <button onClick={() => navigate("/active-cases")} className="rounded-button border border-white/[0.06] px-3 py-1.5 text-xs font-medium text-foreground hover:bg-white/[0.04] transition-all duration-200">
                    Open
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
