export type CaseStatus = "Discovery" | "In Progress" | "Review" | "Ready for Handoff" | "Issued";
export type ProductType = "IFA" | "Participating Whole Life" | "Universal Life" | "Term Life";

export interface TimelineEvent {
  label: string;
  date: string;
  completed: boolean;
}

export interface ActivityLogEntry {
  action: string;
  timestamp: string;
}

export interface AIHistoryEntry {
  question: string;
  response: string;
  timestamp: string;
}

export interface Case {
  id: string;
  client: string;
  age: number;
  product: ProductType;
  status: CaseStatus;
  premium: string;
  carrier: string;
  advisor: string;
  created: string;
  updated: string;
  email: string;
  phone: string;
  dob: string;
  occupation: string;
  income: string;
  riskProfile: string;
  goals: string[];
  notes: string;
  complianceComplete: boolean;
  complianceMissing?: string[];
  suitabilityNarrative: string;
  timeline: TimelineEvent[];
  activityLog: ActivityLogEntry[];
  aiHistory: AIHistoryEntry[];
}

// Production-ready - no mock data
export const MOCK_CASES: Case[] = [];

export const ALL_STATUSES: CaseStatus[] = ["Discovery", "In Progress", "Review", "Ready for Handoff", "Issued"];
export const ALL_PRODUCTS: ProductType[] = ["IFA", "Participating Whole Life", "Universal Life", "Term Life"];
