import type { DiscoveryData } from "./DiscoveryContext";
import { STEP_CONFIGS } from "./discovery-config";

/** Returns true if the field identified by `key` has a non-empty value in `data`. */
export function getRequiredFieldValue(data: Partial<DiscoveryData>, key: string): boolean {
  if (key.startsWith("riskQ")) {
    const qNum = key.replace("riskQ", "");
    return !!(data as any).riskAnswers?.[`q${qNum}`];
  }
  if (key === "primaryGoals") return ((data as any).primaryGoals?.length ?? 0) > 0;
  const val = (data as any)[key];
  if (typeof val === "string") return val.trim().length > 0;
  if (typeof val === "number") return val > 0;
  return !!val;
}

/** Returns the list of missing required field configs for a given step. */
export function getMissingFields(data: Partial<DiscoveryData>, stepId: number) {
  const config = STEP_CONFIGS.find((s) => s.id === stepId);
  if (!config) return [];
  return config.requiredFields.filter((f) => !getRequiredFieldValue(data, f.key));
}

/** Returns count of missing required fields for a step. */
export function getMissingCount(data: Partial<DiscoveryData>, stepId: number): number {
  return getMissingFields(data, stepId).length;
}
