import { useLocation, Link, useNavigate } from "react-router-dom";
import { Plus, Settings, LogOut, LayoutGrid, Briefcase, PlayCircle, BookOpen, Flame } from "lucide-react";
import { FinBoxLogo } from "@/components/ui/FinBoxLogo";
import { getAdvisorProfile, getAdvisorInitials } from "@/lib/advisor";
import { useXP } from "@/lib/xp";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const navItems = [
  { title: "Dashboard", icon: LayoutGrid, path: "/" },
  { title: "Cases", icon: Briefcase, path: "/active-cases" },
  { title: "Presentations", icon: PlayCircle, path: "/presentations" },
  { title: "Training", icon: BookOpen, path: "/training" },
];

function XPBar() {
  const xp = useXP();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex items-center gap-2 px-2">
          {/* Level badge */}
          <span className={cn(
            "text-[10px] font-bold font-mono uppercase tracking-wider",
            xp.level >= 5 ? "text-gold" : "text-primary"
          )}>
            Lv{xp.level}
          </span>
          {/* XP bar */}
          <div className="relative h-1.5 w-20 rounded-full bg-white/[0.06] overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-700",
                xp.justLeveledUp ? "xp-level-up" : "",
                xp.level >= 5
                  ? "bg-gradient-to-r from-gold/80 to-gold"
                  : "bg-gradient-to-r from-primary/80 to-primary"
              )}
              style={{ width: `${xp.levelProgress}%` }}
            />
          </div>
          <span className="text-[9px] font-mono text-muted-foreground/40">
            {xp.totalXP}
          </span>
        </div>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="bg-popover border border-border">
        <p className="text-xs font-medium">{xp.title}</p>
        <p className="text-[10px] text-muted-foreground">{xp.xpInLevel}/{xp.xpToNext} XP to next level</p>
      </TooltipContent>
    </Tooltip>
  );
}

function StreakBadge() {
  const xp = useXP();
  if (xp.streak < 1) return null;

  const intensity = xp.streak >= 30 ? "text-gold" : xp.streak >= 7 ? "text-warning" : "text-warning/60";
  const scale = xp.streak >= 14 ? "scale-110" : xp.streak >= 7 ? "scale-105" : "";

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className={cn("flex items-center gap-1 px-1.5", scale)}>
          <Flame className={cn("h-3.5 w-3.5 flame-pulse", intensity)} />
          <span className={cn("text-[10px] font-bold font-mono", intensity)}>
            {xp.streak}
          </span>
        </div>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="bg-popover border border-border">
        <p className="text-xs font-medium">{xp.streak}-day streak 🔥</p>
        <p className="text-[10px] text-muted-foreground">Keep opening FinBox daily!</p>
      </TooltipContent>
    </Tooltip>
  );
}

export function TopBar({ onSignOut }: { onSignOut?: () => void }) {
  const location = useLocation();
  const profile = getAdvisorProfile();
  const initials = getAdvisorInitials();

  const isActive = (path: string) =>
    path === "/"
      ? location.pathname === "/"
      : location.pathname.startsWith(path);

  return (
    <header className="z-30 flex h-12 shrink-0 items-center gap-8 bg-background px-6 border-b border-white/[0.04]">
      {/* Logo */}
      <Link to="/" className="shrink-0">
        <FinBoxLogo size="sm" />
      </Link>

      {/* Nav links */}
      <nav className="flex items-center gap-1">
        {navItems.map((item) => {
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "nav-item relative px-3 py-4 text-[11px] uppercase tracking-[0.15em] font-medium transition-colors duration-200",
                active
                  ? "text-primary"
                  : "text-muted-foreground/50 hover:text-foreground/80"
              )}
            >
              {item.title}
              <span
                className={cn(
                  "absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent transition-all duration-300",
                  active ? "w-full opacity-100 shadow-[0_0_8px_hsl(var(--primary)/0.4)]" : "w-0 opacity-0"
                )}
              />
            </Link>
          );
        })}
      </nav>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right actions */}
      <div className="flex items-center gap-2">
        {/* XP + Streak */}
        <XPBar />
        <StreakBadge />

        {/* Divider */}
        <div className="h-4 w-px bg-white/[0.06] mx-1" />

        {/* New Case pill */}
        <Link
          to="/new-case"
          className="flex items-center gap-1.5 rounded-full bg-primary/15 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/25 transition-colors duration-200"
        >
          <Plus className="h-3.5 w-3.5" />
          New Case
        </Link>

        {/* Avatar dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2.5 rounded-full p-0.5 hover:bg-white/[0.04] transition-colors duration-200 focus:outline-none">
              <div className="h-7 w-7 rounded-full bg-primary/20 ring-1 ring-white/10 flex items-center justify-center">
                <span className="text-[10px] font-semibold text-primary">{initials}</span>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-popover border-border">
            <div className="px-3 py-2.5">
              <p className="text-sm font-medium text-foreground">{profile.fullName}</p>
              <p className="text-xs text-muted-foreground">{profile.title}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/settings" className="flex items-center gap-2 cursor-pointer">
                <Settings className="h-4 w-4" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive"
              onClick={onSignOut}
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
