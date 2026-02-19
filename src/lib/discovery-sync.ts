/**
 * Syncs discovery wizard data back to the active case record.
 * Called on step completion and final finish to keep case status,
 * compliance, timeline, and activity log in sync.
 */
import { getActiveCaseId, updateCase, addCaseActivity, getCaseById } from "./case-store";
import { getRiskLabel } from "./risk";
import type { DiscoveryData } from "@/components/discovery/DiscoveryContext";
import type { CaseStatus } from "./mock-cases";

/** Map of discovery step → timeline event label */
const TIMELINE_LABELS: Record<number, string> = {
  1: "Discovery started",
  5: "Risk assessment completed",
  6: "Suitability approved",
  8: "Handoff package generated",
};

/** Derive compliance missing items from completed steps */
function getComplianceMissing(completedSteps: Set<number>): string[] {
  const missing: string[] = [];
  if (!completedSteps.has(1)) missing.push("Personal information incomplete");
  if (!completedSteps.has(2)) missing.push("Financial profile incomplete");
  if (!completedSteps.has(3)) missing.push("Coverage review incomplete");
  if (!completedSteps.has(4)) missing.push("Goals & objectives incomplete");
  if (!completedSteps.has(5)) missing.push("Risk assessment incomplete");
  if (!completedSteps.has(6)) missing.push("Suitability not confirmed");
  if (!completedSteps.has(7)) missing.push("Product recommendation missing");
  return missing;
}

/** Derive case status from discovery progress */
function deriveStatus(completedSteps: Set<number>): CaseStatus {
  const allDone = [1, 2, 3, 4, 5, 6, 7, 8].every((s) => completedSteps.has(s));
  if (allDone) return "Ready for Handoff";
  if (completedSteps.has(5)) return "In Progress"; // risk done = past discovery phase
  if (completedSteps.size > 0) return "Discovery";
  return "Discovery";
}

/**
 * Sync a single step's completion to the case record.
 * Called from DiscoveryBottomBar.handleContinue().
 */
export function syncStepToCase(
  stepNumber: number,
  data: DiscoveryData,
  completedSteps: Set<number>,
) {
  const caseId = getActiveCaseId();
  if (!caseId) return;
  const existing = getCaseById(caseId);
  if (!existing) return;

  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

  // Build updates
  const updates: Record<string, any> = {};

  // Always update status & compliance
  const newCompleted = new Set(completedSteps);
  newCompleted.add(stepNumber);
  const complianceMissing = getComplianceMissing(newCompleted);
  updates.status = deriveStatus(newCompleted);
  updates.complianceComplete = complianceMissing.length === 0;
  updates.complianceMissing = complianceMissing;

  // Step-specific data pushes
  if (stepNumber === 1) {
    const fullName = [data.firstName, data.middleName, data.lastName].filter(Boolean).join(" ");
    updates.client = fullName || existing.client;
    updates.email = data.email || existing.email;
    updates.phone = data.phone || existing.phone;
    updates.dob = data.dateOfBirth || existing.dob;
    updates.occupation = data.occupation || existing.occupation;
    updates.income = data.annualIncome ? `$${Number(data.annualIncome).toLocaleString()}` : existing.income;
    // Derive age from DOB
    if (data.dateOfBirth) {
      const birth = new Date(data.dateOfBirth);
      if (!isNaN(birth.getTime())) {
        updates.age = Math.floor((now.getTime() - birth.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
      }
    }
  }

  if (stepNumber === 4) {
    updates.goals = data.primaryGoals;
  }

  if (stepNumber === 5) {
    updates.riskProfile = getRiskLabel(data.riskAnswers);
  }

  if (stepNumber === 6) {
    updates.suitabilityNarrative = data.advisorNotes || existing.suitabilityNarrative;
  }

  if (stepNumber === 7) {
    updates.carrier = data.selectedCarrier || existing.carrier;
  }

  // Update timeline events
  const timelineLabel = TIMELINE_LABELS[stepNumber];
  if (timelineLabel) {
    const timeline = [...existing.timeline];
    const idx = timeline.findIndex((t) => t.label === timelineLabel);
    if (idx !== -1 && !timeline[idx].completed) {
      timeline[idx] = { ...timeline[idx], date: dateStr, completed: true };
      updates.timeline = timeline;
    }
  }

  updateCase(caseId, updates);

  // Add activity log
  const stepNames: Record<number, string> = {
    1: "Personal Info",
    2: "Financial Profile",
    3: "Current Coverage",
    4: "Goals & Objectives",
    5: "Risk Assessment",
    6: "Suitability Determination",
    7: "Product Recommendation",
    8: "Review & Summary",
  };
  addCaseActivity(caseId, `Discovery Step ${stepNumber} (${stepNames[stepNumber]}) completed`);
}

/**
 * Final sync when discovery is fully complete (step 8 finished).
 */
export function syncDiscoveryComplete(data: DiscoveryData) {
  const caseId = getActiveCaseId();
  if (!caseId) return;

  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

  updateCase(caseId, {
    status: "Ready for Handoff",
    complianceComplete: true,
    complianceMissing: [],
    notes: data.additionalNotes || "",
  });

  // Mark handoff timeline event
  const existing = getCaseById(caseId);
  if (existing) {
    const timeline = [...existing.timeline];
    const idx = timeline.findIndex((t) => t.label === "Handoff package generated");
    if (idx !== -1 && !timeline[idx].completed) {
      timeline[idx] = { ...timeline[idx], date: dateStr, completed: true };
      updateCase(caseId, { timeline });
    }
  }

  addCaseActivity(caseId, "Full discovery completed — case ready for handoff");
}
