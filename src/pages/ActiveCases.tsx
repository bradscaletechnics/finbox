import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus, MoreHorizontal, CheckCircle2, AlertTriangle, ArrowUpDown, LayoutGrid, List, GripVertical, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { ALL_STATUSES, ALL_PRODUCTS, type Case, type CaseStatus, type ProductType } from "@/lib/mock-cases";
import { getAllCases, setActiveCaseId } from "@/lib/case-store";
import { useCountUp } from "@/hooks/use-count-up";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

// ─── Shared styles ──────────────────────────────────────────────
const productStyles: Record<ProductType, string> = {
  IFA: "bg-info/15 text-info",
  IUL: "bg-primary/15 text-primary",
  VUL: "bg-[hsl(270,60%,65%)]/15 text-[hsl(270,60%,65%)]",
  UL: "bg-[hsl(175,60%,50%)]/15 text-[hsl(175,60%,50%)]",
  "Term Life": "bg-muted text-muted-foreground",
};

const statusStyles: Record<CaseStatus, string> = {
  Discovery: "border border-border text-muted-foreground bg-transparent",
  "In Progress": "bg-warning/15 text-warning",
  Review: "bg-info/15 text-info",
  "Ready for Handoff": "bg-primary/15 text-primary",
  Exported: "bg-muted text-muted-foreground",
};

// ─── Helpers ────────────────────────────────────────────────────
function parsePremium(s: string): number {
  return parseInt(s.replace(/[$,]/g, ""), 10) || 0;
}

function formatCompact(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n}`;
}

function getInitials(name: string): string {
  return name.split(/\s+/).filter(w => !w.startsWith("&")).map(w => w[0]).join("").slice(0, 2).toUpperCase();
}

function getCompletion(c: Case): number {
  const total = c.timeline.length;
  const done = c.timeline.filter(t => t.completed).length;
  return Math.round((done / total) * 100);
}

// Pipeline column statuses mapping — "In Progress" maps to Review column in pipeline
const PIPELINE_COLUMNS: { key: string; label: string; statuses: CaseStatus[]; bg: string }[] = [
  { key: "discovery", label: "Discovery", statuses: ["Discovery"], bg: "bg-[hsl(212,35%,10%)]" },
  { key: "review", label: "In Review", statuses: ["In Progress", "Review"], bg: "bg-[hsl(212,30%,11%)]" },
  { key: "ready", label: "Ready for Handoff", statuses: ["Ready for Handoff"], bg: "bg-[hsl(164,20%,10%)]" },
  { key: "exported", label: "Exported", statuses: ["Exported"], bg: "bg-[hsl(0,0%,8%)]" },
];

// ─── Animated Value ─────────────────────────────────────────────
function AnimatedValue({ value, prefix = "$" }: { value: number; prefix?: string }) {
  const { value: v } = useCountUp(value, 1200);
  return <span>{prefix}{v >= 1_000_000 ? `${(v / 1_000_000).toFixed(1)}M` : v.toLocaleString("en-US")}</span>;
}

// ─── Pipeline Card ──────────────────────────────────────────────
function PipelineCard({ c, onClick }: { c: Case; onClick: () => void }) {
  const completion = getCompletion(c);
  const isHot = c.updated.includes("hour") || c.updated.includes("minute") || c.updated === "Just now";
  return (
    <div
      onClick={onClick}
      className="group card-hover rounded-xl border border-white/[0.04] bg-card p-4 cursor-grab active:cursor-grabbing hover:border-white/[0.08] transition-all duration-200 glow-border-hover"
    >
      <div className="flex items-start gap-3">
        <div className="relative">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-bold text-foreground">
            {getInitials(c.client)}
          </div>
          {isHot && (
            <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3 items-center justify-center">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-warning/60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-warning" />
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="text-[15px] font-semibold text-foreground leading-tight truncate">{c.client}</p>
            {isHot && (
              <span className="text-[9px] font-bold uppercase tracking-wider text-warning/80">Hot</span>
            )}
          </div>
          <div className="mt-1.5 flex items-center gap-2">
            <span className={cn("inline-block rounded-full px-2 py-0.5 text-[10px] font-medium", productStyles[c.product])}>
              {c.product}
            </span>
            <span className="text-sm font-mono font-bold text-gold">{c.premium}</span>
          </div>
          <p className="mt-2 text-[10px] text-muted-foreground/60">{c.updated}</p>
        </div>
        <GripVertical className="h-4 w-4 shrink-0 text-muted-foreground/30 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      {/* Progress bar with mini ring */}
      <div className="mt-3 flex items-center gap-2">
        <div className="flex-1 h-1 rounded-full bg-white/[0.06] overflow-hidden">
          <div className="h-1 rounded-full bg-primary/80 transition-all duration-500 shimmer" style={{ width: `${completion}%` }} />
        </div>
        <span className={cn(
          "text-[9px] font-mono font-bold",
          completion >= 100 ? "text-gold" : completion >= 50 ? "text-primary" : "text-muted-foreground/50"
        )}>
          {completion}%
        </span>
      </div>
    </div>
  );
}

// ─── Pipeline View ──────────────────────────────────────────────
function PipelineView({ cases, onOpenCase }: { cases: Case[]; onOpenCase: (id: string) => void }) {
  const columns = useMemo(() =>
    PIPELINE_COLUMNS.map((col) => ({
      ...col,
      cases: cases.filter((c) => col.statuses.includes(c.status)),
      value: cases.filter((c) => col.statuses.includes(c.status)).reduce((s, c) => s + parsePremium(c.premium), 0),
    })),
    [cases]
  );

  const totalValue = columns.reduce((s, col) => s + col.value, 0);

  return (
    <div className="space-y-5">
      {/* Pipeline Value Summary */}
      <div className="flex flex-wrap items-baseline justify-between gap-4 rounded-lg border border-white/[0.04] bg-card p-5 shadow-card">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Pipeline Value</p>
          <p className="text-3xl font-bold font-mono text-gold text-glow-gold">
            <AnimatedValue value={totalValue} />
          </p>
        </div>
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          {columns.map((col) => (
            <span key={col.key} className="font-mono">
              <span className="text-foreground/60">{col.label.split(" ")[0]}:</span>{" "}
              <span className="text-foreground font-medium">{formatCompact(col.value)}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Kanban Columns */}
      <div className="grid grid-cols-4 gap-4 min-h-[60vh]">
        {columns.map((col) => (
          <div key={col.key} className={cn("rounded-lg p-3 flex flex-col ring-1 ring-white/[0.03]", col.bg)}>
            <div className="flex items-center justify-between mb-3 px-1">
              <h3 className="text-[13px] font-semibold text-foreground">{col.label}</h3>
              <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-secondary px-1.5 text-[10px] font-bold text-muted-foreground">
                {col.cases.length}
              </span>
            </div>
            <div className="flex-1 space-y-3 overflow-y-auto">
              {col.cases.map((c) => (
                <PipelineCard key={c.id} c={c} onClick={() => onOpenCase(c.id)} />
              ))}
              {col.cases.length === 0 && (
                <div className="flex flex-col items-center justify-center h-24 rounded-lg border border-dashed border-white/[0.06]">
                  <span className="empty-float text-xl mb-1">📂</span>
                  <p className="text-xs text-muted-foreground/40">No cases</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── List View (original table) ─────────────────────────────────
type SortKey = "updated" | "client" | "created" | "status";
const SORT_OPTIONS: { label: string; value: SortKey }[] = [
  { label: "Last Updated", value: "updated" },
  { label: "Client Name", value: "client" },
  { label: "Date Created", value: "created" },
  { label: "Status", value: "status" },
];

function sortCases(cases: Case[], key: SortKey): Case[] {
  return [...cases].sort((a, b) => {
    if (key === "client") return a.client.localeCompare(b.client);
    if (key === "status") return ALL_STATUSES.indexOf(a.status) - ALL_STATUSES.indexOf(b.status);
    return 0;
  });
}

function ListView({ cases, sortBy, setSortBy, navigate }: {
  cases: Case[];
  sortBy: SortKey;
  setSortBy: (k: SortKey) => void;
  navigate: (path: string) => void;
}) {
  const sorted = useMemo(() => sortCases(cases, sortBy), [cases, sortBy]);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-1.5">
        <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortKey)}
          className="h-9 rounded-button border border-border bg-card px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
        >
          {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      <div className="rounded-card border border-white/[0.04] bg-card shadow-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/[0.03] text-left">
              <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground/50">Client</th>
              <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground/50">Product</th>
              <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground/50">Status</th>
              <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground/50">Premium</th>
              <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground/50">Compliance</th>
              <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground/50">Updated</th>
              <th className="px-5 py-3 w-10"></th>
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 ? (
              <tr><td colSpan={7} className="px-5 py-10 text-center text-sm text-muted-foreground">No cases match your filters.</td></tr>
            ) : (
              sorted.map((c) => (
                 <tr
                  key={c.id}
                  onClick={() => navigate(`/active-cases/${c.id}`)}
                  className="border-b border-white/[0.03] last:border-0 hover:bg-white/[0.02] transition-all duration-200 cursor-pointer"
                >
                  <td className="px-5 py-3.5">
                    <p className="text-sm font-medium text-foreground">{c.client}</p>
                    <p className="text-xs text-muted-foreground">Age {c.age}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={cn("inline-block rounded-full px-2.5 py-1 text-xs font-medium", productStyles[c.product])}>{c.product}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={cn("inline-block rounded-full px-2.5 py-1 text-xs font-medium", statusStyles[c.status])}>{c.status}</span>
                  </td>
                  <td className="px-5 py-3.5 text-sm font-mono font-bold text-gold">{c.premium}</td>
                  <td className="px-5 py-3.5">
                    {c.complianceComplete ? (
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                    ) : (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <AlertTriangle className="h-4 w-4 text-warning cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent side="top" className="bg-popover border border-border text-popover-foreground z-[100]">
                          <p className="text-xs font-medium mb-1">Missing items:</p>
                          <ul className="text-xs space-y-0.5">
                            {c.complianceMissing?.map((m) => <li key={m}>• {m}</li>)}
                          </ul>
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-sm text-muted-foreground">{c.updated}</td>
                  <td className="px-5 py-3.5" onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="flex h-7 w-7 items-center justify-center rounded text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors">
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-popover border border-border z-[100]">
                        <DropdownMenuItem onClick={() => navigate(`/active-cases/${c.id}`)}>Open Case</DropdownMenuItem>
                        {(c.status === "Discovery" || c.status === "In Progress") && (
                          <DropdownMenuItem onClick={() => { setActiveCaseId(c.id); navigate("/client-discovery"); }}>
                            <Play className="h-3.5 w-3.5 mr-1.5" /> Resume Discovery
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => navigate("/handoff-package")}>Export Handoff</DropdownMenuItem>
                        <DropdownMenuItem>Duplicate</DropdownMenuItem>
                        <DropdownMenuItem>Archive</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive focus:text-destructive">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────
export default function ActiveCases() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [productFilter, setProductFilter] = useState<ProductType | "All">("All");
  const [view, setView] = useState<"pipeline" | "list">("pipeline");
  const [sortBy, setSortBy] = useState<SortKey>("updated");

  const allCases = useMemo(() => getAllCases(), []);

  const filtered = useMemo(() => {
    return allCases.filter((c) => {
      if (productFilter !== "All" && c.product !== productFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return c.client.toLowerCase().includes(q) || c.id.toLowerCase().includes(q) || c.carrier.toLowerCase().includes(q);
      }
      return true;
    });
  }, [search, productFilter, allCases]);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Cases</h1>
          <p className="mt-1 text-sm text-muted-foreground">{filtered.length} cases</p>
        </div>
        <div className="flex items-center gap-3">
          {/* View toggle */}
          <div className="flex items-center rounded-button border border-border bg-card overflow-hidden">
            <button
              onClick={() => setView("pipeline")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-2 text-xs font-medium transition-colors",
                view === "pipeline" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <LayoutGrid className="h-3.5 w-3.5" /> Pipeline
            </button>
            <button
              onClick={() => setView("list")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-2 text-xs font-medium transition-colors border-l border-border",
                view === "list" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <List className="h-3.5 w-3.5" /> List
            </button>
          </div>
          <Button onClick={() => navigate("/new-case")} className="gap-2">
            <Plus className="h-4 w-4" /> New Case
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search clients, case IDs..."
            className="h-9 w-full rounded-button border border-border bg-card pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <select
          value={productFilter}
          onChange={(e) => setProductFilter(e.target.value as ProductType | "All")}
          className="h-9 rounded-button border border-border bg-card px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="All">All Products</option>
          {ALL_PRODUCTS.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>

      {/* View */}
      {view === "pipeline" ? (
        <PipelineView cases={filtered} onOpenCase={(id) => {
          const c = filtered.find(fc => fc.id === id);
          if (c && (c.status === "Discovery" || c.status === "In Progress")) {
            setActiveCaseId(id);
            navigate("/client-discovery");
          } else {
            navigate(`/active-cases/${id}`);
          }
        }} />
      ) : (
        <ListView cases={filtered} sortBy={sortBy} setSortBy={setSortBy} navigate={navigate} />
      )}
    </div>
  );
}
