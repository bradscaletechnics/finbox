// localStorage-backed case store, merged with mock data for demo
import { MOCK_CASES, type Case, type CaseStatus } from "./mock-cases";

const STORAGE_KEY = "finbox_user_cases";
const ACTIVE_CASE_KEY = "finbox_active_case_id";

function loadUserCases(): Case[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveUserCases(cases: Case[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cases));
}

/** Get all cases: mock + user-created */
export function getAllCases(): Case[] {
  return [...MOCK_CASES, ...loadUserCases()];
}

/** Get a single case by ID */
export function getCaseById(id: string): Case | undefined {
  return getAllCases().find((c) => c.id === id);
}

/** Create a new case, returns the new case */
export function createCase(clientName: string, productType: string): Case {
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  const prefix = productType === "Term" ? "TRM" : productType;
  const id = `${prefix}-${now.getFullYear()}-${String(Math.floor(Math.random() * 900 + 100))}`;

  const newCase: Case = {
    id,
    client: clientName,
    age: 0,
    product: productType as Case["product"],
    status: "Discovery",
    premium: "$0",
    carrier: "TBD",
    advisor: getAdvisorName(),
    created: dateStr,
    updated: "Just now",
    email: "",
    phone: "",
    dob: "",
    occupation: "",
    income: "",
    riskProfile: "Not assessed",
    goals: [],
    notes: "",
    complianceComplete: false,
    complianceMissing: ["Discovery incomplete"],
    suitabilityNarrative: "",
    timeline: [
      { label: "Case created", date: dateStr, completed: true },
      { label: "Discovery started", date: "Pending", completed: false },
      { label: "Risk assessment completed", date: "Pending", completed: false },
      { label: "Suitability approved", date: "Pending", completed: false },
      { label: "Handoff package generated", date: "Pending", completed: false },
    ],
    activityLog: [
      { action: `Case created by ${getAdvisorName()}`, timestamp: `${dateStr} — ${now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}` },
    ],
    aiHistory: [],
  };

  const userCases = loadUserCases();
  userCases.push(newCase);
  saveUserCases(userCases);

  return newCase;
}

/** Update a user-created case (mock cases are read-only) */
export function updateCase(id: string, updates: Partial<Case>): Case | undefined {
  const userCases = loadUserCases();
  const idx = userCases.findIndex((c) => c.id === id);
  if (idx === -1) return undefined; // can't update mock cases
  userCases[idx] = { ...userCases[idx], ...updates, updated: "Just now" };
  saveUserCases(userCases);
  return userCases[idx];
}

/** Update case status */
export function updateCaseStatus(id: string, status: CaseStatus): Case | undefined {
  return updateCase(id, { status });
}

/** Add activity log entry */
export function addCaseActivity(id: string, action: string) {
  const userCases = loadUserCases();
  const idx = userCases.findIndex((c) => c.id === id);
  if (idx === -1) return;
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  const timeStr = now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  userCases[idx].activityLog.push({ action, timestamp: `${dateStr} — ${timeStr}` });
  userCases[idx].updated = "Just now";
  saveUserCases(userCases);
}

/** Set/get the active case ID for discovery */
export function setActiveCaseId(id: string | null) {
  if (id) {
    localStorage.setItem(ACTIVE_CASE_KEY, id);
  } else {
    localStorage.removeItem(ACTIVE_CASE_KEY);
  }
}

export function getActiveCaseId(): string | null {
  return localStorage.getItem(ACTIVE_CASE_KEY);
}

/** Delete a user-created case */
export function deleteCase(id: string): boolean {
  const userCases = loadUserCases();
  const filtered = userCases.filter((c) => c.id !== id);
  if (filtered.length === userCases.length) return false;
  saveUserCases(filtered);
  return true;
}

function getAdvisorName(): string {
  try {
    const raw = localStorage.getItem("finbox_profile");
    if (raw) {
      const p = JSON.parse(raw);
      return [p.firstName, p.lastName].filter(Boolean).join(" ") || "Advisor";
    }
  } catch {}
  return "Advisor";
}
