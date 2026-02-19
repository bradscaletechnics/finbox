import { useParams, useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { ArrowLeft, Download, Pencil, MoreHorizontal, Mail, Phone, Calendar, Briefcase, DollarSign, CheckCircle2, Circle, FileText, Clock, MessageSquare, Bot } from "lucide-react";
import { cn } from "@/lib/utils";
import { type CaseStatus, type ProductType } from "@/lib/mock-cases";
import { getCaseById } from "@/lib/case-store";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const statusStyles: Record<CaseStatus, string> = {
  Discovery: "border border-border text-muted-foreground bg-transparent",
  "In Progress": "bg-warning/15 text-warning",
  Review: "bg-info/15 text-info",
  "Ready for Handoff": "bg-primary/15 text-primary",
  Exported: "bg-muted text-muted-foreground",
};

const productStyles: Record<ProductType, string> = {
  IFA: "bg-info/15 text-info",
  IUL: "bg-primary/15 text-primary",
  VUL: "bg-[hsl(270,60%,65%)]/15 text-[hsl(270,60%,65%)]",
  UL: "bg-[hsl(175,60%,50%)]/15 text-[hsl(175,60%,50%)]",
  "Term Life": "bg-muted text-muted-foreground",
};

export default function CaseDetail() {
  const { caseId } = useParams<{ caseId: string }>();
  const navigate = useNavigate();
  const caseData = useMemo(() => getCaseById(caseId || ""), [caseId]);

  if (!caseData) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="empty-float mb-4">
          <span className="text-5xl">📋</span>
        </div>
        <p className="text-lg font-medium text-foreground">Case not found</p>
        <p className="text-sm text-muted-foreground/70 mt-1">The case "{caseId}" doesn't exist.</p>
        <Button variant="outline" className="mt-4 press-scale" onClick={() => navigate("/active-cases")}>Back to Cases</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground/70">
        <button onClick={() => navigate("/active-cases")} className="hover:text-foreground transition-colors flex items-center gap-1">
          <ArrowLeft className="h-3.5 w-3.5" />
          Cases
        </button>
        <span>/</span>
        <span className="text-foreground">{caseData.client}</span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-[28px] font-semibold tracking-tight text-foreground">{caseData.client}</h1>
          <span className={cn("rounded-full px-2.5 py-1 text-xs font-medium", productStyles[caseData.product])}>{caseData.product}</span>
          <span className={cn("rounded-full px-3 py-1 text-sm font-medium", statusStyles[caseData.status])}>{caseData.status}</span>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => navigate("/handoff-package")} className="gap-2 press-scale">
            <Download className="h-4 w-4" />
            Export Handoff
          </Button>
          <Button variant="outline" onClick={() => navigate("/client-discovery")} className="gap-2 press-scale">
            <Pencil className="h-4 w-4" />
            Edit Discovery
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-popover border border-border z-[100]">
              <DropdownMenuItem>Duplicate</DropdownMenuItem>
              <DropdownMenuItem>Archive</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive focus:text-destructive">Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="bg-secondary/30 border border-white/[0.04]">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="discovery">Discovery Data</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="ai-history">AI History</TabsTrigger>
          <TabsTrigger value="activity">Activity Log</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Client Summary */}
            <div className="glass-edge rounded-card border border-white/[0.04] bg-card p-5 space-y-4 shadow-card">
              <h3 className="text-[13px] font-medium uppercase tracking-widest text-muted-foreground/50">Client Summary</h3>
              <div className="space-y-3">
                <InfoRow icon={<Briefcase className="h-4 w-4" />} label="Name" value={caseData.client} />
                <InfoRow icon={<Calendar className="h-4 w-4" />} label="Age / DOB" value={`${caseData.age} · ${caseData.dob}`} />
                <InfoRow icon={<Mail className="h-4 w-4" />} label="Email" value={caseData.email} />
                <InfoRow icon={<Phone className="h-4 w-4" />} label="Phone" value={caseData.phone} />
                <InfoRow icon={<Briefcase className="h-4 w-4" />} label="Occupation" value={caseData.occupation} />
                <InfoRow icon={<DollarSign className="h-4 w-4" />} label="Income" value={caseData.income} />
              </div>
            </div>

            {/* Timeline */}
            <div className="glass-edge rounded-card border border-white/[0.04] bg-card p-5 space-y-4 shadow-card">
              <h3 className="text-[13px] font-medium uppercase tracking-widest text-muted-foreground/50">Case Timeline</h3>
              <div className="space-y-0">
                {caseData.timeline.map((event, i) => (
                  <div key={i} className="flex items-start gap-3 relative">
                    {i < caseData.timeline.length - 1 && (
                      <div className="absolute left-[9px] top-6 w-px h-[calc(100%-4px)] bg-white/[0.06]" />
                    )}
                    {event.completed ? (
                      <CheckCircle2 className="h-[18px] w-[18px] text-primary shrink-0 mt-0.5" />
                    ) : (
                      <Circle className="h-[18px] w-[18px] text-muted-foreground/30 shrink-0 mt-0.5" />
                    )}
                    <div className="pb-5">
                      <p className={cn("text-sm font-medium", event.completed ? "text-foreground" : "text-muted-foreground/60")}>{event.label}</p>
                      <p className="text-xs text-muted-foreground/50">{event.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Suitability */}
          <div className="glass-edge rounded-card border border-white/[0.04] bg-card p-5 space-y-3 shadow-card">
            <h3 className="text-[13px] font-medium uppercase tracking-widest text-muted-foreground/50">Suitability Summary</h3>
            <p className="text-sm text-foreground leading-relaxed">{caseData.suitabilityNarrative}</p>
            <div className="flex items-center gap-4 pt-2">
              <span className="text-xs text-muted-foreground/70">Risk Profile: <span className="text-foreground font-medium">{caseData.riskProfile}</span></span>
              <span className="text-xs text-muted-foreground/70">Goals: <span className="text-foreground font-medium">{caseData.goals.join(", ")}</span></span>
            </div>
          </div>
        </TabsContent>

        {/* Discovery Data Tab */}
        <TabsContent value="discovery" className="mt-6 space-y-4">
          {[
            { title: "Personal Information", fields: [["Name", caseData.client], ["Age", String(caseData.age)], ["DOB", caseData.dob], ["Email", caseData.email], ["Phone", caseData.phone]] },
            { title: "Financial Profile", fields: [["Occupation", caseData.occupation], ["Income", caseData.income], ["Premium", caseData.premium]] },
            { title: "Current Coverage", fields: [["Carrier", caseData.carrier], ["Product", caseData.product]] },
            { title: "Goals & Objectives", fields: [["Goals", caseData.goals.join(", ")]] },
            { title: "Risk Assessment", fields: [["Risk Profile", caseData.riskProfile]] },
            { title: "Suitability", fields: [["Narrative", caseData.suitabilityNarrative]] },
          ].map((section) => (
            <div key={section.title} className="rounded-card border border-white/[0.04] bg-card p-5 shadow-card">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[13px] font-medium uppercase tracking-widest text-muted-foreground/50">{section.title}</h3>
                <Button variant="ghost" size="sm" className="text-xs h-7" onClick={() => navigate("/client-discovery")}>
                  <Pencil className="h-3 w-3 mr-1" /> Edit
                </Button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6">
                {section.fields.map(([label, value]) => (
                  <div key={label}>
                    <p className="text-xs text-muted-foreground/50">{label}</p>
                    <p className="text-sm text-foreground">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents" className="mt-6 space-y-4">
          <div className="rounded-card border border-white/[0.04] bg-card p-5 space-y-4 shadow-card">
            <h3 className="text-[13px] font-medium uppercase tracking-widest text-muted-foreground/50">Generated Documents</h3>
            {caseData.timeline.some((t) => t.label.includes("Handoff") && t.completed) ? (
              <div className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.02] p-4 hover-lift">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-card bg-primary/10 icon-breathe">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Handoff Package — {caseData.client}</p>
                    <p className="text-xs text-muted-foreground/50">Generated {caseData.timeline.find((t) => t.label.includes("Handoff"))?.date}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="gap-1.5 press-scale" onClick={() => navigate("/handoff-package")}>
                  <Download className="h-3.5 w-3.5" /> Download
                </Button>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground/70">No documents generated yet.</p>
            )}
          </div>
          <Button variant="outline" onClick={() => navigate("/handoff-package")} className="gap-2 press-scale">
            <FileText className="h-4 w-4" /> Generate New Export
          </Button>
        </TabsContent>

        {/* AI History Tab */}
        <TabsContent value="ai-history" className="mt-6 space-y-4">
          {caseData.aiHistory.length === 0 ? (
            <div className="rounded-card border border-white/[0.04] bg-card p-10 text-center shadow-card">
              <div className="empty-float mb-2">
                <Bot className="h-8 w-8 text-muted-foreground/40 mx-auto" />
              </div>
              <p className="text-sm text-muted-foreground/70">No AI interactions recorded for this case yet.</p>
            </div>
          ) : (
            caseData.aiHistory.map((entry, i) => (
              <div key={i} className="rounded-card border border-white/[0.04] bg-card p-5 space-y-3 shadow-card hover-lift">
                <div className="flex items-center gap-2 text-xs text-muted-foreground/50">
                  <Clock className="h-3.5 w-3.5" />
                  {entry.timestamp}
                </div>
                <div className="flex items-start gap-3">
                  <MessageSquare className="h-4 w-4 text-info shrink-0 mt-0.5" />
                  <p className="text-sm font-medium text-foreground">{entry.question}</p>
                </div>
                <div className="flex items-start gap-3 ml-7">
                  <Bot className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground leading-relaxed">{entry.response}</p>
                </div>
              </div>
            ))
          )}
        </TabsContent>

        {/* Activity Log Tab */}
        <TabsContent value="activity" className="mt-6">
          <div className="rounded-card border border-white/[0.04] bg-card p-5 shadow-card">
            <h3 className="text-[13px] font-medium uppercase tracking-widest text-muted-foreground/50 mb-4">Audit Trail</h3>
            <div className="space-y-0">
              {caseData.activityLog.map((entry, i) => (
                <div key={i} className="flex items-start gap-3 relative">
                  {i < caseData.activityLog.length - 1 && (
                    <div className="absolute left-[5px] top-4 w-px h-[calc(100%-4px)] bg-white/[0.06]" />
                  )}
                  <div className="h-[10px] w-[10px] rounded-full bg-primary/60 shrink-0 mt-1.5" />
                  <div className="pb-4">
                    <p className="text-sm text-foreground">{entry.action}</p>
                    <p className="text-xs text-muted-foreground/50">{entry.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="text-muted-foreground/50">{icon}</span>
      <span className="text-muted-foreground/70 w-20 shrink-0">{label}</span>
      <span className="text-foreground">{value}</span>
    </div>
  );
}
