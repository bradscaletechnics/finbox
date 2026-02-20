import { useSyncExternalStore } from "react";
import { getAdvisorKey } from "./advisor";
import { getNewlyUnlocked } from "./unlocks";

// ─── Level System ───────────────────────────────────────────────────────────
export const LEVELS = [
  { level: 1, title: "Trainee",        xpRequired: 0     },
  { level: 2, title: "Associate",      xpRequired: 300   },
  { level: 3, title: "Advisor",        xpRequired: 900   },
  { level: 4, title: "Senior Advisor", xpRequired: 2200  },
  { level: 5, title: "Gold Closer",    xpRequired: 5000  },
  { level: 6, title: "Platinum Elite", xpRequired: 10000 },
  { level: 7, title: "Diamond Pro",    xpRequired: 20000 },
  { level: 8, title: "Principal",      xpRequired: 35000 },
];

export const XP_REWARDS = {
  fieldCompleted: 5,
  stepCompleted: 50,
  caseCreated: 100,
  caseHandedOff: 250,
} as const;

export interface XPState {
  totalXP: number;
  level: number;
  title: string;
  xpInLevel: number;
  xpToNext: number;
  levelProgress: number; // 0–100 %
  streak: number;
  lastActiveDate: string; // YYYY-MM-DD
  justLeveledUp: boolean;
}

function getToday(): string {
  return new Date().toISOString().slice(0, 10);
}

function xpKey(): string {
  return `finbox_xp_${getAdvisorKey()}`;
}

function loadPersisted(): { totalXP: number; streak: number; lastActiveDate: string } {
  try {
    const raw = localStorage.getItem(xpKey());
    if (raw) return JSON.parse(raw);
  } catch {}
  return { totalXP: 0, streak: 0, lastActiveDate: "" };
}

function persist(data: { totalXP: number; streak: number; lastActiveDate: string }) {
  try {
    localStorage.setItem(xpKey(), JSON.stringify(data));
  } catch {}
}

function computeLevel(totalXP: number) {
  let current = LEVELS[0];
  for (const l of LEVELS) {
    if (totalXP >= l.xpRequired) current = l;
    else break;
  }
  const nextLevel = LEVELS.find((l) => l.xpRequired > totalXP);
  const xpInLevel = totalXP - current.xpRequired;
  const xpToNext = nextLevel
    ? nextLevel.xpRequired - current.xpRequired
    : current.xpRequired; // at max level show full bar
  const levelProgress = Math.min(100, Math.round((xpInLevel / xpToNext) * 100));
  return { level: current.level, title: current.title, xpInLevel, xpToNext, levelProgress };
}

// ─── Streak logic (run on module init) ─────────────────────────────────────
const persisted = loadPersisted();
const today = getToday();
let streakData = { streak: persisted.streak, lastActiveDate: persisted.lastActiveDate };

if (persisted.lastActiveDate !== today) {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().slice(0, 10);

  if (persisted.lastActiveDate === yesterdayStr) {
    streakData = { streak: persisted.streak + 1, lastActiveDate: today };
  } else {
    streakData = { streak: persisted.lastActiveDate === "" ? 1 : 1, lastActiveDate: today };
  }
  persist({ totalXP: persisted.totalXP, ...streakData });
}

// ─── Reactive store ─────────────────────────────────────────────────────────
let state: XPState = buildState(persisted.totalXP, false);
const listeners = new Set<() => void>();

function buildState(totalXP: number, justLeveledUp: boolean): XPState {
  const lev = computeLevel(totalXP);
  return {
    totalXP,
    ...lev,
    streak: streakData.streak,
    lastActiveDate: streakData.lastActiveDate,
    justLeveledUp,
  };
}

function emit() {
  listeners.forEach((l) => l());
}

export function addXP(amount: number) {
  const oldLevel = state.level;
  const newTotal = state.totalXP + amount;
  persist({ totalXP: newTotal, streak: streakData.streak, lastActiveDate: streakData.lastActiveDate });
  const newLevelData = computeLevel(newTotal);
  const justLeveledUp = newLevelData.level > oldLevel;
  state = buildState(newTotal, justLeveledUp);
  emit();

  if (justLeveledUp) {
    // Announce level-up + newly unlocked items
    const newlyUnlocked = getNewlyUnlocked(oldLevel, newLevelData.level);
    const unlockNames = newlyUnlocked.map((u) => u.name).join(", ");
    const subtitle = unlockNames
      ? `Unlocked: ${unlockNames}`
      : `${newTotal.toLocaleString()} XP total`;

    setTimeout(() => {
      import("@/components/ui/AchievementToast").then(({ triggerAchievement }) => {
        triggerAchievement(
          `Level ${newLevelData.level} — ${newLevelData.title}`,
          subtitle
        );
      });
    }, 500);

    // Also play the chest-open sound on level up
    setTimeout(() => {
      import("@/lib/sounds").then(({ playChestOpen }) => playChestOpen());
    }, 200);

    setTimeout(() => {
      state = { ...state, justLeveledUp: false };
      emit();
    }, 4000);
  }
}

export function getXPState(): XPState {
  return state;
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function useXP(): XPState {
  return useSyncExternalStore(subscribe, getXPState);
}
