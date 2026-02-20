import { useState, useEffect } from "react";
import { useXP } from "@/lib/xp";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { getAdvisorProfile, saveAdvisorProfile, type AdvisorProfile } from "@/lib/advisor";
import { THEMES, getActiveThemeId, applyTheme, saveThemeId } from "@/lib/theme";
import { ALL_UNLOCKS } from "@/lib/unlocks";
import {
  Save, Shield, Cpu, User, Database, Package, Info, Camera,
  HardDrive, Download, Trash2, AlertTriangle, Wifi, Clock,
  CheckCircle2, ChevronDown, ChevronRight, Usb, FileText, Search,
  RotateCcw, Monitor, Mail, Phone, Eye, EyeOff,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AIConnectionStatusWithRefresh } from "@/components/ai-assistant/AIConnectionStatus";

const CA_PROVINCES = [
  "Alberta","British Columbia","Manitoba","New Brunswick","Newfoundland and Labrador",
  "Northwest Territories","Nova Scotia","Nunavut","Ontario","Prince Edward Island",
  "Quebec","Saskatchewan","Yukon",
];

const CARRIERS = [
  "Allianz","Athene","American Equity","Corebridge","F&G","Global Atlantic",
  "Midland National","Nationwide","North American","Pacific Life","Sammons","Securian",
];

const SECTIONS = [
  { id: "profile", label: "Advisor Profile", icon: User },
  { id: "security", label: "Security", icon: Shield },
  { id: "data", label: "Data Management", icon: Database },
  { id: "carriers", label: "Carriers & Products", icon: Package },
  { id: "ai", label: "AI Assistant", icon: Cpu },
  { id: "sound", label: "Sound Effects", icon: Monitor },
  { id: "themes", label: "Themes", icon: Monitor },
  { id: "about", label: "About", icon: Info },
] as const;

type SectionId = (typeof SECTIONS)[number]["id"];

const MOCK_BACKUPS = [
  { date: "Feb 10, 2026 — 2:00 AM", size: "18.2 MB", status: "Success" },
  { date: "Feb 9, 2026 — 2:00 AM", size: "18.1 MB", status: "Success" },
  { date: "Feb 8, 2026 — 2:00 AM", size: "17.9 MB", status: "Success" },
  { date: "Feb 7, 2026 — 2:00 AM", size: "17.8 MB", status: "Success" },
  { date: "Feb 6, 2026 — 2:00 AM", size: "17.6 MB", status: "Success" },
  { date: "Feb 5, 2026 — 2:00 AM", size: "17.5 MB", status: "Failed" },
  { date: "Feb 4, 2026 — 2:00 AM", size: "17.3 MB", status: "Success" },
  { date: "Feb 3, 2026 — 2:00 AM", size: "17.1 MB", status: "Success" },
  { date: "Feb 2, 2026 — 2:00 AM", size: "16.9 MB", status: "Success" },
  { date: "Feb 1, 2026 — 2:00 AM", size: "16.8 MB", status: "Success" },
];

// ─── Section Components ────────────────────────────────────────────

function ProfileSection() {
  const { toast } = useToast();
  const [profile, setProfile] = useState<AdvisorProfile>(getAdvisorProfile());
  const update = (f: keyof AdvisorProfile, v: string) => setProfile((p) => ({ ...p, [f]: v }));
  const initials = profile.fullName.trim().split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase() || "A";

  const handleSave = () => {
    saveAdvisorProfile(profile);
    toast({ title: "Profile saved", description: "Your advisor profile has been updated." });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold tracking-tight text-foreground">Advisor Profile</h2>
        <p className="text-sm text-muted-foreground/70 mt-1">This information appears on presentations and handoff packages.</p>
      </div>

      {/* Avatar */}
      <div className="flex items-center gap-4">
        <div className="relative group">
          <div className="h-20 w-20 rounded-full bg-primary/20 ring-1 ring-white/10 flex items-center justify-center text-2xl font-bold text-primary">
            {initials}
          </div>
          <div className="absolute inset-0 rounded-full bg-background/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
            <Camera className="h-5 w-5 text-foreground" />
          </div>
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">{profile.fullName || "Advisor"}</p>
          <p className="text-xs text-muted-foreground/70">{profile.agency || "Agency"}</p>
        </div>
      </div>

      <Separator className="border-white/[0.04]" />

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Full Name</Label>
          <Input value={profile.fullName} onChange={(e) => update("fullName", e.target.value)} placeholder="Jane Smith" />
        </div>
        <div className="space-y-2">
          <Label>Agency / IMO</Label>
          <Input value={profile.agency} onChange={(e) => update("agency", e.target.value)} placeholder="Premier Financial Group" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Phone</Label>
          <Input value={profile.phone} onChange={(e) => update("phone", e.target.value)} placeholder="(555) 123-4567" />
        </div>
        <div className="space-y-2">
          <Label>Email</Label>
          <Input value={profile.email} onChange={(e) => update("email", e.target.value)} placeholder="jane@example.com" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Province</Label>
          <Select value={profile.state} onValueChange={(v) => update("state", v)}>
            <SelectTrigger><SelectValue placeholder="Select province" /></SelectTrigger>
            <SelectContent>
              {CA_PROVINCES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>License #</Label>
          <Input value={profile.licenseNumber} onChange={(e) => update("licenseNumber", e.target.value)} placeholder="L-123456" />
        </div>
        <div className="space-y-2">
          <Label>NPN</Label>
          <Input value={profile.npn} onChange={(e) => update("npn", e.target.value)} placeholder="12345678" />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Title</Label>
        <Input value={profile.title} onChange={(e) => update("title", e.target.value)} placeholder="Senior Advisor" />
      </div>
      <Button onClick={handleSave} className="gap-2"><Save className="h-4 w-4" /> Save Changes</Button>
    </div>
  );
}

function SecuritySection() {
  const { toast } = useToast();
  const [currentPin, setCurrentPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [pinError, setPinError] = useState("");
  const [autoLock, setAutoLock] = useState(() => localStorage.getItem("finbox_autolock_minutes") || "15");

  const handleAutoLockChange = (value: string) => {
    setAutoLock(value);
    if (value === "never") {
      localStorage.setItem("finbox_autolock_minutes", "0");
    } else {
      localStorage.setItem("finbox_autolock_minutes", value);
    }
    toast({ title: "Auto-lock updated", description: value === "never" ? "Auto-lock disabled." : `FinBox will lock after ${value} minutes of inactivity.` });
  };

  const handleChangePin = () => {
    setPinError("");
    const stored = localStorage.getItem("finbox_pin");
    if (currentPin !== stored) { setPinError("Current PIN is incorrect."); return; }
    if (newPin.length < 6) { setPinError("New PIN must be 6 digits."); return; }
    if (newPin !== confirmPin) { setPinError("PINs do not match."); return; }
    localStorage.setItem("finbox_pin", newPin);
    setCurrentPin(""); setNewPin(""); setConfirmPin("");
    toast({ title: "PIN updated", description: "Your security PIN has been changed." });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold tracking-tight text-foreground">Security</h2>
        <p className="text-sm text-muted-foreground/70 mt-1">Manage device security and data protection.</p>
      </div>

      <Card className="border-white/[0.04] bg-card shadow-card">
        <CardHeader><CardTitle className="text-base">Change PIN</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground/70">Current PIN</Label>
            <InputOTP maxLength={6} value={currentPin} onChange={(v) => { setCurrentPin(v); setPinError(""); }}>
              <InputOTPGroup>{Array.from({ length: 6 }).map((_, i) => <InputOTPSlot key={i} index={i} className="h-10 w-10" />)}</InputOTPGroup>
            </InputOTP>
          </div>
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground/70">New PIN</Label>
            <InputOTP maxLength={6} value={newPin} onChange={(v) => { setNewPin(v); setPinError(""); }}>
              <InputOTPGroup>{Array.from({ length: 6 }).map((_, i) => <InputOTPSlot key={i} index={i} className="h-10 w-10" />)}</InputOTPGroup>
            </InputOTP>
          </div>
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground/70">Confirm New PIN</Label>
            <InputOTP maxLength={6} value={confirmPin} onChange={(v) => { setConfirmPin(v); setPinError(""); }}>
              <InputOTPGroup>{Array.from({ length: 6 }).map((_, i) => <InputOTPSlot key={i} index={i} className="h-10 w-10" />)}</InputOTPGroup>
            </InputOTP>
          </div>
          {pinError && <p className="text-sm text-destructive">{pinError}</p>}
          <Button onClick={handleChangePin} variant="secondary" className="gap-2" disabled={currentPin.length < 6 || newPin.length < 6 || confirmPin.length < 6}>
            <Shield className="h-4 w-4" /> Change PIN
          </Button>
        </CardContent>
      </Card>

      <Card className="border-white/[0.04] bg-card shadow-card">
        <CardHeader><CardTitle className="text-base">Auto-Lock Timer</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          <Select value={autoLock} onValueChange={handleAutoLockChange}>
            <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5 minutes</SelectItem>
              <SelectItem value="15">15 minutes</SelectItem>
              <SelectItem value="30">30 minutes</SelectItem>
              <SelectItem value="60">1 hour</SelectItem>
              <SelectItem value="never">Never</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground/70">FinBox locks automatically after this period of inactivity.</p>
        </CardContent>
      </Card>

      <Card className="border-white/[0.04] bg-card shadow-card">
        <CardHeader><CardTitle className="text-base">Encryption Status</CardTitle></CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-card bg-primary/10 icon-breathe">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">AES-256 encryption: Active</p>
              <p className="text-xs text-muted-foreground/70">All client data stored on this device is encrypted at rest.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function DataManagementSection() {
  const { toast } = useToast();
  const [backupFreq, setBackupFreq] = useState("daily");
  const [showBackupHistory, setShowBackupHistory] = useState(false);
  const [showRestoreDialog, setShowRestoreDialog] = useState(false);
  const [showFactoryDialog, setShowFactoryDialog] = useState(false);
  const [factoryPin, setFactoryPin] = useState("");
  const [factoryConfirm, setFactoryConfirm] = useState("");
  const [deleteSearch, setDeleteSearch] = useState("");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold tracking-tight text-foreground">Data Management</h2>
        <p className="text-sm text-muted-foreground/70 mt-1">Storage, backups, exports, and data control.</p>
      </div>

      <Card className="border-white/[0.04] bg-card shadow-card">
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><HardDrive className="h-4 w-4" /> Storage Usage</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div>
            <div className="flex items-center justify-between text-xs text-muted-foreground/70 mb-1">
              <span>Database: 24 MB of ~10 GB capacity</span>
              <span>0.2%</span>
            </div>
            <Progress value={0.24} className="h-2" />
          </div>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <span>Total clients: <span className="text-foreground font-medium">47</span></span>
            <span>Total cases: <span className="text-foreground font-medium">83</span></span>
            <span>Total exports: <span className="text-foreground font-medium">61</span></span>
          </div>
        </CardContent>
      </Card>

      <Card className="border-white/[0.04] bg-card shadow-card">
        <CardHeader><CardTitle className="text-base">Backups</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3 rounded-md bg-primary/8 p-3">
            <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
            <div>
              <p className="text-sm font-medium text-foreground">Last automatic backup: Today, 2:00 AM</p>
              <p className="text-xs text-muted-foreground/70">18.2 MB • All data included</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground/70">Backup Frequency</Label>
            <Select value={backupFreq} onValueChange={setBackupFreq}>
              <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="12h">Every 12 hours</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="manual">Manual only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" className="gap-2 press-scale" onClick={() => toast({ title: "Backup started", description: "Creating a new backup…" })}>
              <Download className="h-4 w-4" /> Backup Now
            </Button>
            <Button variant="outline" className="gap-2 press-scale">
              <Usb className="h-4 w-4" /> Backup to External Drive
            </Button>
          </div>
          <p className="text-xs text-muted-foreground/70">Connect a USB drive and create an encrypted backup.</p>

          <button
            onClick={() => setShowBackupHistory(!showBackupHistory)}
            className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            {showBackupHistory ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            Backup History
          </button>
          {showBackupHistory && (
            <div className="rounded-md border border-white/[0.04] overflow-hidden">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-white/[0.03] bg-secondary/30"><th className="px-3 py-2 text-left text-xs text-muted-foreground/50 font-medium">Date</th><th className="px-3 py-2 text-left text-xs text-muted-foreground/50 font-medium">Size</th><th className="px-3 py-2 text-left text-xs text-muted-foreground/50 font-medium">Status</th></tr></thead>
                <tbody>
                  {MOCK_BACKUPS.map((b, i) => (
                    <tr key={i} className="border-b border-white/[0.03] last:border-0 hover:bg-white/[0.02] transition-colors">
                      <td className="px-3 py-2 text-foreground">{b.date}</td>
                      <td className="px-3 py-2 text-muted-foreground">{b.size}</td>
                      <td className="px-3 py-2">
                        <span className={cn("text-xs font-medium", b.status === "Success" ? "text-primary" : "text-destructive")}>{b.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-white/[0.04] bg-card shadow-card">
        <CardHeader><CardTitle className="text-base">Restore</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          <Button variant="outline" className="gap-2 border-warning/30 text-warning hover:bg-warning/10 hover:text-warning press-scale" onClick={() => setShowRestoreDialog(true)}>
            <RotateCcw className="h-4 w-4" /> Restore from Backup
          </Button>
          <p className="text-xs text-muted-foreground/70">Restore your data from a previous backup. Current data will be replaced.</p>
        </CardContent>
      </Card>

      <AlertDialog open={showRestoreDialog} onOpenChange={setShowRestoreDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Restore from Backup</AlertDialogTitle>
            <AlertDialogDescription>Select a backup to restore. This will replace all current data.</AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-1 max-h-48 overflow-y-auto">
            {MOCK_BACKUPS.filter((b) => b.status === "Success").map((b, i) => (
              <button key={i} className="w-full flex items-center justify-between rounded-md px-3 py-2 text-sm hover:bg-white/[0.02] transition-colors text-left">
                <span className="text-foreground">{b.date}</span>
                <span className="text-xs text-muted-foreground">{b.size}</span>
              </button>
            ))}
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Card className="border-white/[0.04] bg-card shadow-card">
        <CardHeader><CardTitle className="text-base">Export</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-col gap-2">
            <Button variant="outline" className="gap-2 justify-start press-scale" onClick={() => toast({ title: "Export started", description: "Generating CSV export…" })}>
              <Download className="h-4 w-4" /> Export All Client Data
            </Button>
            <p className="text-xs text-muted-foreground/70 -mt-1 ml-8">Download a complete CSV export of all client records and case data.</p>
            <Button variant="outline" className="gap-2 justify-start press-scale">
              <FileText className="h-4 w-4" /> Export Specific Case
            </Button>
            <p className="text-xs text-muted-foreground/70 -mt-1 ml-8">Select a case to export as a standalone package.</p>
            <Button variant="outline" className="gap-2 justify-start press-scale">
              <FileText className="h-4 w-4" /> Export Audit Log
            </Button>
            <p className="text-xs text-muted-foreground/70 -mt-1 ml-8">Download a log of all actions taken in FinBox for compliance review.</p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-destructive/20 bg-card shadow-card">
        <CardHeader><CardTitle className="text-base text-destructive">Data Deletion</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground/70">Delete Individual Client</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
              <Input value={deleteSearch} onChange={(e) => setDeleteSearch(e.target.value)} placeholder="Search by client name…" className="pl-10" />
            </div>
          </div>

          <Separator className="border-white/[0.04]" />

          <div className="pt-4">
            <Button variant="destructive" className="gap-2 press-scale" onClick={() => setShowFactoryDialog(true)}>
              <Trash2 className="h-4 w-4" /> Factory Reset
            </Button>
            <p className="text-xs text-muted-foreground/70 mt-2">Erase all data and reset FinBox to initial setup. This action cannot be undone.</p>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showFactoryDialog} onOpenChange={setShowFactoryDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive"><AlertTriangle className="h-5 w-5" /> Factory Reset</AlertDialogTitle>
            <AlertDialogDescription>This will permanently erase all data and reset FinBox. Enter your PIN and type <span className="font-mono font-bold text-foreground">DELETE ALL DATA</span> to confirm.</AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground/70">Enter PIN</Label>
              <InputOTP maxLength={6} value={factoryPin} onChange={setFactoryPin}>
                <InputOTPGroup>{Array.from({ length: 6 }).map((_, i) => <InputOTPSlot key={i} index={i} className="h-10 w-10" />)}</InputOTPGroup>
              </InputOTP>
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground/70">Type "DELETE ALL DATA"</Label>
              <Input value={factoryConfirm} onChange={(e) => setFactoryConfirm(e.target.value)} placeholder="DELETE ALL DATA" />
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => { setFactoryPin(""); setFactoryConfirm(""); }}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={factoryPin.length < 6 || factoryConfirm !== "DELETE ALL DATA"}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => { setFactoryPin(""); setFactoryConfirm(""); }}
            >
              Erase Everything
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function CarriersSection() {
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<Record<string, boolean>>(() => {
    try {
      const prefs = JSON.parse(localStorage.getItem("finbox_preferences") || "{}");
      const carriers: string[] = prefs.carriers || [];
      const map: Record<string, boolean> = {};
      CARRIERS.forEach((c) => { map[c] = carriers.includes(c); });
      return map;
    } catch { return {}; }
  });
  const [expanded, setExpanded] = useState<string | null>(null);

  const toggleCarrier = (c: string) => setAppointments((prev) => ({ ...prev, [c]: !prev[c] }));

  const handleSave = () => {
    const selected = Object.entries(appointments).filter(([, v]) => v).map(([k]) => k);
    try {
      const prefs = JSON.parse(localStorage.getItem("finbox_preferences") || "{}");
      prefs.carriers = selected;
      localStorage.setItem("finbox_preferences", JSON.stringify(prefs));
    } catch {}
    toast({ title: "Carriers updated", description: `${selected.length} carrier appointments saved.` });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold tracking-tight text-foreground">Carriers & Products</h2>
        <p className="text-sm text-muted-foreground/70 mt-1">Manage your carrier appointments and product data.</p>
      </div>

      <Card className="border-white/[0.04] bg-card shadow-card">
        <CardContent className="pt-6 space-y-1">
          {CARRIERS.map((c) => (
            <div key={c}>
              <div className="flex items-center justify-between py-2.5 px-1 hover:bg-white/[0.02] rounded transition-colors">
                <div className="flex items-center gap-3">
                  <Checkbox checked={appointments[c] || false} onCheckedChange={() => toggleCarrier(c)} />
                  <span className="text-sm font-medium text-foreground">{c}</span>
                </div>
                <Button variant="ghost" size="sm" className="text-xs text-muted-foreground" onClick={() => setExpanded(expanded === c ? null : c)}>
                  Products {expanded === c ? <ChevronDown className="h-3 w-3 ml-1" /> : <ChevronRight className="h-3 w-3 ml-1" />}
                </Button>
              </div>
              {expanded === c && (
                <div className="ml-10 mb-2 rounded-md bg-secondary/30 p-3 text-xs text-muted-foreground">
                  FIA, MYGA, SPIA, RILA products available. Connect to the internet to sync latest product details.
                </div>
              )}
              <Separator className="border-white/[0.04]" />
            </div>
          ))}
        </CardContent>
      </Card>

      <Button onClick={handleSave} className="gap-2 press-scale"><Save className="h-4 w-4" /> Save Carriers</Button>

      <div className="flex items-center gap-3 text-xs text-muted-foreground/70">
        <Clock className="h-4 w-4" />
        <span>Product data last updated: January 15, 2026. Connect to the internet and click Update to get the latest product information.</span>
      </div>
      <Button variant="outline" size="sm" className="gap-2 press-scale"><Wifi className="h-4 w-4" /> Check for Updates</Button>
    </div>
  );
}

function AISection() {
  const { toast } = useToast();
  const [aiUrl, setAiUrl] = useState(() => localStorage.getItem("finbox_ai_url") || "http://localhost:3001");
  const [aiKey, setAiKey] = useState(() => localStorage.getItem("finbox_ai_key") || "");
  const [aiWorkspace, setAiWorkspace] = useState(() => localStorage.getItem("finbox_ai_workspace") || "finbox");
  const [responseStyle, setResponseStyle] = useState(() => localStorage.getItem("finbox_ai_style") || "concise");
  const [citations, setCitations] = useState(() => localStorage.getItem("finbox_ai_citations") !== "false");
  const [saveHistory, setSaveHistory] = useState(true);
  const [testStatus, setTestStatus] = useState<"idle" | "testing" | "success" | "error">("idle");
  const [testMessage, setTestMessage] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);
  const [saveConfirmed, setSaveConfirmed] = useState(false);

  // Auto-persist connection settings on every change — no Save button required
  useEffect(() => {
    localStorage.setItem("finbox_ai_url", aiUrl);
    localStorage.setItem("finbox_ai_key", aiKey);
    localStorage.setItem("finbox_ai_workspace", aiWorkspace);
  }, [aiUrl, aiKey, aiWorkspace]);

  const persistConnection = () => {
    localStorage.setItem("finbox_ai_url", aiUrl);
    localStorage.setItem("finbox_ai_key", aiKey);
    localStorage.setItem("finbox_ai_workspace", aiWorkspace);
  };

  const handleSaveConnection = () => {
    persistConnection();
    setSaveConfirmed(true);
    setTimeout(() => setSaveConfirmed(false), 2000);
    toast({ title: "✓ Connection saved", description: `API key and workspace saved to local storage.` });
  };

  const handleSavePreferences = () => {
    localStorage.setItem("finbox_ai_style", responseStyle);
    localStorage.setItem("finbox_ai_citations", String(citations));
    toast({ title: "Preferences saved", description: "AI response preferences updated." });
  };

  const handleTestConnection = async () => {
    // Always persist current form values before testing
    persistConnection();
    setTestStatus("testing");
    setTestMessage("");
    try {
      const { testConnection } = await import("@/lib/ai-client");
      const result = await testConnection();
      setTestStatus(result.ok ? "success" : "error");
      setTestMessage(result.message);
    } catch {
      setTestStatus("error");
      setTestMessage("Failed to test connection.");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold tracking-tight text-foreground">AI Assistant</h2>
        <p className="text-sm text-muted-foreground/70 mt-1">Configure the local AnythingLLM + Ollama connection for FinBox AI.</p>
      </div>

      <AIConnectionStatusWithRefresh />

      <Card className="border-white/[0.04] bg-card shadow-card">
        <CardHeader><CardTitle className="text-base">Connection</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-2.5 rounded-lg border border-warning/20 bg-warning/5 px-3 py-2.5">
            <AlertTriangle className="h-4 w-4 text-warning shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground">
              <span className="font-medium text-foreground">Localhost only.</span>{" "}
              AnythingLLM runs on your local machine. This connection will only work when FinBox is running locally (not from the Lovable preview).
            </p>
          </div>
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground/70">AnythingLLM URL</Label>
            <Input value={aiUrl} onChange={(e) => setAiUrl(e.target.value)} placeholder="http://localhost:3001" />
          </div>
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground/70">API Key</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  type={showApiKey ? "text" : "password"}
                  value={aiKey}
                  onChange={(e) => setAiKey(e.target.value)}
                  placeholder="Enter your AnythingLLM API key"
                />
                {aiKey && (
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-foreground transition-colors"
                  >
                    {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                )}
              </div>
              {aiKey && (
                <Button
                  variant="outline"
                  size="icon"
                  className="shrink-0 text-destructive border-destructive/20 hover:bg-destructive/10 hover:text-destructive"
                  onClick={() => {
                    setAiKey("");
                    localStorage.removeItem("finbox_ai_key");
                    setTestStatus("idle");
                    setTestMessage("");
                    toast({ title: "API key removed", description: "AnythingLLM API key has been cleared." });
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
            <p className="text-[11px] text-muted-foreground/50">Found in AnythingLLM → Settings → Developer → API Key</p>
          </div>
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground/70">Workspace Slug</Label>
            <Input value={aiWorkspace} onChange={(e) => setAiWorkspace(e.target.value)} placeholder="finbox" />
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={handleSaveConnection} className={cn("gap-2 press-scale", saveConfirmed && "bg-primary/80")}>{saveConfirmed ? <CheckCircle2 className="h-4 w-4" /> : <Save className="h-4 w-4" />} {saveConfirmed ? "Saved!" : "Save Connection"}</Button>
            <Button variant="outline" onClick={handleTestConnection} disabled={testStatus === "testing"} className="gap-2 press-scale">
              <Wifi className="h-4 w-4" />
              {testStatus === "testing" ? "Testing…" : "Test Connection"}
            </Button>
          </div>
          {testMessage && (
            <div className={cn(
              "flex items-center gap-2 rounded-md px-3 py-2 text-sm",
              testStatus === "success" ? "bg-primary/8 text-primary" : "bg-destructive/8 text-destructive"
            )}>
              {testStatus === "success" ? <CheckCircle2 className="h-4 w-4 shrink-0" /> : <AlertTriangle className="h-4 w-4 shrink-0" />}
              {testMessage}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-white/[0.04] bg-card shadow-card">
        <CardHeader><CardTitle className="text-base">AI Model</CardTitle></CardHeader>
        <CardContent className="space-y-1">
          <p className="text-sm font-medium text-foreground">AnythingLLM + Ollama</p>
          <p className="text-xs text-muted-foreground/70">Running locally on this device. Model determined by AnythingLLM workspace configuration.</p>
        </CardContent>
      </Card>

      <Card className="border-white/[0.04] bg-card shadow-card">
        <CardHeader><CardTitle className="text-base">Preferences</CardTitle></CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground/70">Response Style</Label>
            <Select value={responseStyle} onValueChange={setResponseStyle}>
              <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="concise">Concise</SelectItem>
                <SelectItem value="detailed">Detailed</SelectItem>
                <SelectItem value="step-by-step">Step-by-step</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Include compliance citations</p>
              <p className="text-xs text-muted-foreground/70">Append regulatory references to AI responses.</p>
            </div>
            <Switch checked={citations} onCheckedChange={setCitations} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Save conversation history</p>
              <p className="text-xs text-muted-foreground/70">Persist AI conversations per case.</p>
            </div>
            <Switch checked={saveHistory} onCheckedChange={setSaveHistory} />
          </div>
          <Button onClick={handleSavePreferences} variant="secondary" className="gap-2 press-scale"><Save className="h-4 w-4" /> Save Preferences</Button>
        </CardContent>
      </Card>

      <Button variant="outline" className="gap-2 text-destructive border-destructive/20 hover:bg-destructive/10 hover:text-destructive press-scale" onClick={() => toast({ title: "AI history cleared", description: "All conversation history has been removed." })}>
        <Trash2 className="h-4 w-4" /> Clear AI History
      </Button>
    </div>
  );
}

function SoundSection() {
  const [stepSound, setStepSound] = useState(() => localStorage.getItem("finbox_sound_step") === "true");
  const [caseSound, setCaseSound] = useState(() => localStorage.getItem("finbox_sound_case") === "true");
  const [achieveSound, setAchieveSound] = useState(() => localStorage.getItem("finbox_sound_achieve") === "true");

  const toggle = (key: string, val: boolean, setter: (v: boolean) => void) => {
    setter(val);
    localStorage.setItem(key, String(val));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold tracking-tight text-foreground">Sound Effects</h2>
        <p className="text-sm text-muted-foreground/70 mt-1">Optional audio feedback. All sounds are off by default.</p>
      </div>
      <Card className="border-white/[0.04] bg-card shadow-card">
        <CardContent className="pt-6 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Step completion</p>
              <p className="text-xs text-muted-foreground/70">Short ding when a discovery step is completed.</p>
            </div>
            <Switch checked={stepSound} onCheckedChange={(v) => toggle("finbox_sound_step", v, setStepSound)} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Case completion</p>
              <p className="text-xs text-muted-foreground/70">Two-tone chime when a handoff package is generated.</p>
            </div>
            <Switch checked={caseSound} onCheckedChange={(v) => toggle("finbox_sound_case", v, setCaseSound)} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Achievements</p>
              <p className="text-xs text-muted-foreground/70">Brief chord when a milestone is unlocked.</p>
            </div>
            <Switch checked={achieveSound} onCheckedChange={(v) => toggle("finbox_sound_achieve", v, setAchieveSound)} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ThemesSection() {
  const xp = useXP();
  const { toast } = useToast();
  const [activeThemeId, setActiveThemeId] = useState(() => getActiveThemeId());

  const handleApply = (themeId: string) => {
    applyTheme(themeId);
    saveThemeId(themeId);
    setActiveThemeId(themeId);
    const t = THEMES.find((t) => t.id === themeId);
    toast({ title: `Theme applied`, description: `${t?.name} is now active.` });
  };

  const themeUnlocks = ALL_UNLOCKS.filter((u) => u.type === "theme");
  const featureUnlocks = ALL_UNLOCKS.filter((u) => u.type === "feature");
  const badgeUnlocks = ALL_UNLOCKS.filter((u) => u.type === "badge");

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold tracking-tight text-foreground">Themes & Unlocks</h2>
        <p className="text-sm text-muted-foreground/70 mt-1">
          Themes, badges, and features unlock as you level up. You're Level {xp.level} — {xp.title}.
        </p>
      </div>

      {/* XP Progress card */}
      <Card className="border-white/[0.04] bg-card shadow-card">
        <CardContent className="pt-5 pb-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm font-semibold text-foreground">Level {xp.level} — {xp.title}</p>
              <p className="text-xs text-muted-foreground">{xp.totalXP.toLocaleString()} total XP</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">
                {xp.level < 8 ? `${xp.xpInLevel} / ${xp.xpToNext} XP to Level ${xp.level + 1}` : "Max Level"}
              </p>
              <p className="text-xs text-primary font-mono">{xp.levelProgress}%</p>
            </div>
          </div>
          <Progress value={xp.levelProgress} className="h-1.5" />
        </CardContent>
      </Card>

      {/* Themes */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">Colour Themes</h3>
        <div className="grid grid-cols-1 gap-3">
          {THEMES.map((theme) => {
            const unlockItem = themeUnlocks.find((u) => u.id === `theme-${theme.id}`);
            const isLocked = xp.level < theme.requiredLevel;
            const isActive = activeThemeId === theme.id;

            return (
              <div
                key={theme.id}
                className={cn(
                  "flex items-center justify-between rounded-lg border p-4 transition-all",
                  isActive
                    ? "border-primary/40 bg-primary/5 ring-1 ring-primary/20"
                    : isLocked
                    ? "border-border/40 opacity-50"
                    : "border-border hover:border-border/80"
                )}
              >
                <div className="flex items-center gap-3">
                  {/* Swatch */}
                  <div
                    className="h-10 w-10 shrink-0 rounded-lg ring-1 ring-white/10 overflow-hidden relative"
                    style={{ background: `linear-gradient(135deg, ${theme.swatchA}, ${theme.swatchB})` }}
                  >
                    <div
                      className="absolute bottom-1.5 right-1.5 h-3 w-3 rounded-full ring-1 ring-white/20"
                      style={{ backgroundColor: theme.primaryColor }}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{theme.name}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {isLocked
                        ? `Unlock at Level ${theme.requiredLevel} (${unlockItem?.name ?? ""})`
                        : theme.description}
                    </p>
                  </div>
                </div>

                {isActive ? (
                  <span className="flex items-center gap-1 text-xs font-medium text-primary">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Active
                  </span>
                ) : isLocked ? (
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground/60">
                    <Shield className="h-3.5 w-3.5" />
                    Lvl {theme.requiredLevel}
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs h-7"
                    onClick={() => handleApply(theme.id)}
                  >
                    Apply
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Features */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">Feature Unlocks</h3>
        <div className="grid grid-cols-1 gap-2">
          {featureUnlocks.map((item) => {
            const isLocked = xp.level < item.requiredLevel;
            return (
              <div
                key={item.id}
                className={cn(
                  "flex items-center justify-between rounded-lg border p-3 transition-all",
                  !isLocked ? "border-primary/20 bg-primary/5" : "border-border/40 opacity-55"
                )}
              >
                <div>
                  <p className={cn("text-sm font-medium", isLocked ? "text-muted-foreground" : "text-foreground")}>
                    {item.name}
                  </p>
                  <p className="text-[10px] text-muted-foreground/70">{item.description}</p>
                </div>
                {isLocked ? (
                  <span className="flex items-center gap-1 text-[10px] text-muted-foreground/50">
                    <Shield className="h-3 w-3" /> Lvl {item.requiredLevel}
                  </span>
                ) : (
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Badges */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">Advisor Badges</h3>
        <div className="grid grid-cols-2 gap-2">
          {badgeUnlocks.map((item) => {
            const isLocked = xp.level < item.requiredLevel;
            return (
              <div
                key={item.id}
                className={cn(
                  "rounded-lg border p-3 text-center transition-all",
                  !isLocked ? "border-primary/20 bg-primary/5" : "border-border/40 opacity-55"
                )}
              >
                <p className={cn("text-xs font-semibold mb-0.5", isLocked ? "text-muted-foreground" : "text-foreground")}>
                  {item.name}
                </p>
                <p className="text-[10px] text-muted-foreground/60">
                  {isLocked ? `Level ${item.requiredLevel}` : "Earned ✓"}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function AboutSection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold tracking-tight text-foreground">About FinBox</h2>
      </div>

      <Card className="border-white/[0.04] bg-card shadow-card">
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-card bg-primary flex items-center justify-center icon-breathe">
              <span className="text-lg font-bold text-primary-foreground">F</span>
            </div>
            <div>
              <p className="text-lg font-bold text-foreground">FinBox <span className="text-sm font-normal text-muted-foreground/70">v1.0.0</span></p>
              <p className="text-xs text-muted-foreground/70">Advisory Workstation</p>
            </div>
          </div>

          <Separator className="border-white/[0.04]" />

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Monitor className="h-4 w-4 text-muted-foreground/50" />
              <span className="text-muted-foreground">Running on:</span>
              <span className="text-foreground font-medium">Mac Mini M4 | 32GB RAM</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground/50" />
              <span className="text-muted-foreground">Software last updated:</span>
              <span className="text-foreground font-medium">February 1, 2026</span>
            </div>
          </div>

          <Button variant="outline" size="sm" className="gap-2 press-scale"><Wifi className="h-4 w-4" /> Check for Software Updates</Button>

          <Separator className="border-white/[0.04]" />

          <div className="space-y-2 text-sm">
            <p className="text-[13px] font-medium uppercase tracking-widest text-muted-foreground/50">Support</p>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="h-4 w-4" /> <span>support@finbox.com</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone className="h-4 w-4" /> <span>(800) 555-FBOX</span>
            </div>
          </div>

          <Separator className="border-white/[0.04]" />

          <div className="flex gap-4 text-xs text-muted-foreground/70">
            <button className="hover:text-foreground transition-colors">Terms of Service</button>
            <button className="hover:text-foreground transition-colors">Privacy Policy</button>
            <button className="hover:text-foreground transition-colors">Licenses</button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Main Settings Page ────────────────────────────────────────────

export default function Settings() {
  const [active, setActive] = useState<SectionId>("profile");

  return (
    <div className="flex gap-6 min-h-[calc(100vh-8rem)]">
      {/* Sub-navigation */}
      <nav className="w-48 shrink-0 space-y-1 pt-1">
        {SECTIONS.map((s) => (
          <button
            key={s.id}
            onClick={() => setActive(s.id)}
            className={cn(
              "flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200 text-left",
              active === s.id
                ? "bg-gradient-to-r from-secondary to-secondary/60 text-primary border-l-2 border-primary"
                : "text-muted-foreground/60 hover:bg-white/[0.02] hover:text-foreground"
            )}
          >
            <s.icon className="h-4 w-4 shrink-0" />
            {s.label}
          </button>
        ))}
      </nav>

      {/* Content */}
      <div className="flex-1 max-w-2xl pb-12">
        {active === "profile" && <ProfileSection />}
        {active === "security" && <SecuritySection />}
        {active === "data" && <DataManagementSection />}
        {active === "carriers" && <CarriersSection />}
        {active === "ai" && <AISection />}
        {active === "sound" && <SoundSection />}
        {active === "themes" && <ThemesSection />}
        {active === "about" && <AboutSection />}
      </div>
    </div>
  );
}
