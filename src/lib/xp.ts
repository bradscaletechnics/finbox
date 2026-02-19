import { useSyncExternalStore } from "react";

// ─── Level System ───────────────────────────────────────────────
const LEVELS = [
  { level: 1, title: "Trainee", xpRequired: 0 },
  { level: 2, title: "Associate", xpRequired: 500 },
  { level: 3, title: "Advisor", xpRequired: 1500 },
  { level: 4, title: "Senior Advisor", xpRequired: 3500 },
  { level: 5, title: "Gold Closer", xpRequired: 7000 },
  { level: 6, title: "Platinum Elite", xpRequired: 12000 },
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
  levelProgress: number; // 0-100
  streak: number;
  lastActiveDate: string; // YYYY-MM-DD
  justLeveledUp: boolean;
}

function getToday(): string {
  return new Date().toISOString().slice(0, 10);
}

function loadPersisted(): { totalXP: number; streak: number; lastActiveDate: string } {
  try {
    const raw = localStorage.getItem("finbox_xp");
    if (raw) return JSON.parse(raw);
  } catch {}
  return { totalXP: 0, streak: 0, lastActiveDate: "" };
}

function persist(data: { totalXP: number; streak: number; lastActiveDate: string }) {
  try {
    localStorage.setItem("finbox_xp", JSON.stringify(data));
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
  const xpToNext = nextLevel ? nextLevel.xpRequired - current.xpRequired : 1;
  const levelProgress = Math.min(100, Math.round((xpInLevel / xpToNext) * 100));
  return { level: current.level, title: current.title, xpInLevel, xpToNext, levelProgress };
}

// ─── Streak logic (run on import) ───────────────────────────────
const persisted = loadPersisted();
const today = getToday();
let streakData = { streak: persisted.streak, lastActiveDate: persisted.lastActiveDate };

if (persisted.lastActiveDate !== today) {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().slice(0, 10);
  
  if (persisted.lastActiveDate === yesterdayStr) {
    streakData = { streak: persisted.streak + 1, lastActiveDate: today };
  } else if (persisted.lastActiveDate === "") {
    streakData = { streak: 1, lastActiveDate: today };
  } else {
    streakData = { streak: 1, lastActiveDate: today }; // streak broken
  }
  persist({ totalXP: persisted.totalXP, ...streakData });
}

// ─── Reactive store ─────────────────────────────────────────────
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
  
  // Fire level-up achievement (deferred to avoid circular import issues)
  if (justLeveledUp) {
    setTimeout(() => {
      import("@/components/ui/AchievementToast").then(({ triggerAchievement }) => {
        triggerAchievement(
          `Level ${newLevelData.level} — ${newLevelData.title}`,
          `You've earned ${newTotal} XP total`
        );
      });
    }, 500);
    
    setTimeout(() => {
      state = { ...state, justLeveledUp: false };
      emit();
    }, 3000);
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
