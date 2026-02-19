import { Case } from "./mock-cases";
import { getAdvisorProfile } from "./advisor";
import { getAllCases } from "./case-store";

// ---------- Context ----------

export interface PresentationContext {
  clientName?: string;
  goals?: string[];
  timeHorizon?: string;
  premium?: string;
  product?: string;
  carrier?: string;
  riskProfile?: string;
  advisorName: string;
  advisorAgency: string;
}

export function buildContextFromCase(c: Case): PresentationContext {
  const profile = getAdvisorProfile();
  return {
    clientName: c.client,
    goals: c.goals,
    timeHorizon: String(Math.max(5, 67 - c.age)),
    premium: c.premium,
    product: c.product,
    carrier: c.carrier,
    riskProfile: c.riskProfile,
    advisorName: profile.fullName,
    advisorAgency: profile.agency,
  };
}

export function buildGenericContext(): PresentationContext {
  const profile = getAdvisorProfile();
  return {
    advisorName: profile.fullName,
    advisorAgency: profile.agency,
  };
}

// ---------- Deck definitions ----------

export type DeckId = "client" | "annuities-101" | "tax-deferral" | "retirement-income" | "risk";

export interface DeckDefinition {
  id: DeckId;
  title: string;
  description: string;
  slideCount: number;
  /** Which slide keys to use — mapped in PresentationMode */
  slides: string[];
}

export const GENERAL_DECKS: DeckDefinition[] = [
  {
    id: "annuities-101",
    title: "How Annuities Work",
    description: "General IFA/FIA education deck",
    slideCount: 4,
    slides: ["welcome", "how-ifa-works", "principal-protection", "income-for-life"],
  },
  {
    id: "tax-deferral",
    title: "Power of Tax Deferral",
    description: "Tax-advantaged growth concepts",
    slideCount: 4,
    slides: ["welcome", "goals", "how-ifa-works", "income-for-life"],
  },
  {
    id: "retirement-income",
    title: "Retirement Income Planning",
    description: "Income planning overview",
    slideCount: 4,
    slides: ["welcome", "goals", "income-for-life", "next-steps"],
  },
  {
    id: "risk",
    title: "Understanding Risk",
    description: "Risk tolerance and protection concepts",
    slideCount: 4,
    slides: ["welcome", "principal-protection", "how-ifa-works", "next-steps"],
  },
];

/** The full 7-slide client deck */
export const CLIENT_DECK_SLIDES = [
  "welcome",
  "goals",
  "how-ifa-works",
  "principal-protection",
  "income-for-life",
  "recommendation",
  "next-steps",
];

// ---------- Helpers ----------

const PRESENTABLE_STATUSES = new Set(["In Progress", "Review", "Ready for Handoff"]);

export function getPresentableCases(): Case[] {
  return getAllCases().filter((c) => PRESENTABLE_STATUSES.has(c.status));
}
