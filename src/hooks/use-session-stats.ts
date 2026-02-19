import { useSyncExternalStore } from "react";

interface SessionStats {
  fieldsCompleted: number;
  stepsCompleted: number;
  casesTouched: number;
}

interface PersonalBests {
  fieldsCompleted: boolean;
  stepsCompleted: boolean;
  casesTouched: boolean;
}

let stats: SessionStats = { fieldsCompleted: 0, stepsCompleted: 0, casesTouched: 0 };
let personalBests: PersonalBests = { fieldsCompleted: false, stepsCompleted: false, casesTouched: false };
const listeners = new Set<() => void>();

function loadBests(): SessionStats {
  try {
    const raw = localStorage.getItem("finbox_personal_bests");
    if (raw) return JSON.parse(raw);
  } catch {}
  return { fieldsCompleted: 0, stepsCompleted: 0, casesTouched: 0 };
}

function saveBests(bests: SessionStats) {
  try {
    localStorage.setItem("finbox_personal_bests", JSON.stringify(bests));
  } catch {}
}

function emitChange() {
  listeners.forEach((l) => l());
}

export function incrementSessionStat(key: keyof SessionStats, amount = 1) {
  stats = { ...stats, [key]: stats[key] + amount };

  // Check personal best
  const bests = loadBests();
  if (stats[key] > bests[key]) {
    bests[key] = stats[key];
    saveBests(bests);
    personalBests = { ...personalBests, [key]: true };
  }

  emitChange();
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

let snapshot = { stats, personalBests };

function getSnapshot() {
  // Create new snapshot only if stats changed
  if (snapshot.stats !== stats || snapshot.personalBests !== personalBests) {
    snapshot = { stats, personalBests };
  }
  return snapshot;
}

export function useSessionStats() {
  const snap = useSyncExternalStore(subscribe, getSnapshot);
  return snap.stats;
}

export function useSessionStatsWithPB() {
  return useSyncExternalStore(subscribe, getSnapshot);
}
