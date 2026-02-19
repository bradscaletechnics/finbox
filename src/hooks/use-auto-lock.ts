import { useEffect, useRef, useCallback } from "react";
import { toast } from "sonner";

const EVENTS: (keyof WindowEventMap)[] = ["mousedown", "mousemove", "keydown", "scroll", "touchstart"];
const STORAGE_KEY = "finbox_autolock_minutes";
const WARNING_BEFORE_MS = 30_000;

function getTimeoutMs(): number | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  const minutes = raw ? Number(raw) : 15;
  if (!minutes || isNaN(minutes) || minutes <= 0) return null;
  return minutes * 60 * 1000;
}

export function useAutoLock(onLock: () => void) {
  const lockTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const warnTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toastIdRef = useRef<string | number | undefined>(undefined);

  const clearTimers = useCallback(() => {
    if (lockTimerRef.current) clearTimeout(lockTimerRef.current);
    if (warnTimerRef.current) clearTimeout(warnTimerRef.current);
    if (toastIdRef.current) {
      toast.dismiss(toastIdRef.current);
      toastIdRef.current = undefined;
    }
  }, []);

  const resetTimer = useCallback(() => {
    clearTimers();
    const ms = getTimeoutMs();
    if (!ms) return;

    // Warning toast fires 30s before lock (skip if total timeout ≤ 30s)
    if (ms > WARNING_BEFORE_MS) {
      warnTimerRef.current = setTimeout(() => {
        toastIdRef.current = toast.warning("Locking soon", {
          description: "FinBox will lock in 30 seconds due to inactivity. Move your mouse or press a key to stay unlocked.",
          duration: WARNING_BEFORE_MS,
        });
      }, ms - WARNING_BEFORE_MS);
    }

    lockTimerRef.current = setTimeout(onLock, ms);
  }, [onLock, clearTimers]);

  useEffect(() => {
    resetTimer();

    const handler = () => resetTimer();
    EVENTS.forEach((e) => window.addEventListener(e, handler, { passive: true }));

    const storageHandler = (ev: StorageEvent) => {
      if (ev.key === STORAGE_KEY) resetTimer();
    };
    window.addEventListener("storage", storageHandler);

    return () => {
      clearTimers();
      EVENTS.forEach((e) => window.removeEventListener(e, handler));
      window.removeEventListener("storage", storageHandler);
    };
  }, [resetTimer, clearTimers]);
}
