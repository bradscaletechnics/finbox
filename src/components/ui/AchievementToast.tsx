import { useState, useEffect } from "react";
import { Trophy, X } from "lucide-react";
import { playAchievementChord } from "@/lib/sounds";

interface AchievementData {
  title: string;
  detail: string;
}

let showAchievementFn: ((data: AchievementData) => void) | null = null;

export function triggerAchievement(title: string, detail: string) {
  showAchievementFn?.({ title, detail });
}

export function AchievementToast() {
  const [achievement, setAchievement] = useState<AchievementData | null>(null);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    showAchievementFn = (data) => {
      setExiting(false);
      setAchievement(data);
      playAchievementChord();
    };
    return () => { showAchievementFn = null; };
  }, []);

  useEffect(() => {
    if (!achievement) return;
    const t = setTimeout(() => {
      setExiting(true);
      setTimeout(() => setAchievement(null), 300);
    }, 5000);
    return () => clearTimeout(t);
  }, [achievement]);

  if (!achievement) return null;

  const dismiss = () => {
    setExiting(true);
    setTimeout(() => setAchievement(null), 300);
  };

  return (
    <div
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-[60] w-full max-w-md ${
        exiting ? "achievement-slide-out" : "achievement-slide-in"
      }`}
    >
      <div className="mx-4 flex items-center gap-4 rounded-lg border-l-4 border-gold bg-[hsl(216,35%,13%)] px-5 py-4 shadow-elevated cursor-pointer"
        onClick={dismiss}
        style={{ background: "linear-gradient(135deg, hsl(216 35% 13%) 0%, hsla(43, 56%, 54%, 0.05) 100%)" }}
      >
        <div className={exiting ? "" : "trophy-bounce"}>
          <Trophy className="h-6 w-6 shrink-0 text-gold" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-foreground">{achievement.title}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{achievement.detail}</p>
        </div>
        <X className="h-4 w-4 shrink-0 text-muted-foreground" />
      </div>
    </div>
  );
}
