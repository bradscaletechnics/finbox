import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

export interface Beneficiary {
  name: string;
  relationship: string;
  percentage: number;
}

export interface ExistingPolicy {
  carrier: string;
  productType: string;
  faceAmount: string;
  annualPremium: string;
  yearIssued: string;
}

export interface ExistingAnnuity {
  carrier: string;
  productType: string;
  currentValue: string;
  surrenderDate: string;
}

export interface DiscoveryData {
  // Step 1 - Personal Information
  firstName: string;
  middleName: string;
  lastName: string;
  dateOfBirth: string;
  ssn: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  email: string;
  maritalStatus: string;
  employmentStatus: string;
  occupation: string;
  employerName: string;
  annualIncome: string;
  beneficiaries: Beneficiary[];

  // Step 2 - Financial Profile
  totalLiquidAssets: string;
  totalNetWorth: string;
  monthlyExpenses: string;
  taxBracket: string;
  filingStatus: string;
  sourceOfFunds: string;
  existingPolicyDetails: string;
  existingAccountNumber: string;

  // Step 3 - Current Coverage
  existingPolicies: ExistingPolicy[];
  existingAnnuities: ExistingAnnuity[];
  willReplaceCoverage: boolean;
  replacementDisclosureAcknowledged: boolean;

  // Step 4 - Goals & Objectives
  primaryGoals: string[];
  investmentTimeHorizon: string;
  liquidityNeeds: string;
  liquidityExplanation: string;
  targetRetirementAge: string;
  additionalNotes: string;

  // Step 5 - Risk Assessment
  riskAnswers: Record<string, string>;

  // Step 6 - Suitability
  advisorNotes: string;

  // Step 7 - Product Recommendation
  selectedCarrier: string;
  selectedProduct: string;
  recommendationNarrative: string;
}

const defaultData: DiscoveryData = {
  firstName: "",
  middleName: "",
  lastName: "",
  dateOfBirth: "",
  ssn: "",
  street: "",
  city: "",
  state: "",
  zip: "",
  phone: "",
  email: "",
  maritalStatus: "",
  employmentStatus: "",
  occupation: "",
  employerName: "",
  annualIncome: "",
  beneficiaries: [{ name: "", relationship: "", percentage: 100 }],
  totalLiquidAssets: "",
  totalNetWorth: "",
  monthlyExpenses: "",
  taxBracket: "",
  filingStatus: "",
  sourceOfFunds: "",
  existingPolicyDetails: "",
  existingAccountNumber: "",
  existingPolicies: [],
  existingAnnuities: [],
  willReplaceCoverage: false,
  replacementDisclosureAcknowledged: false,
  primaryGoals: [],
  investmentTimeHorizon: "10",
  liquidityNeeds: "",
  liquidityExplanation: "",
  targetRetirementAge: "",
  additionalNotes: "",
  riskAnswers: {},
  advisorNotes: "",
  selectedCarrier: "",
  selectedProduct: "",
  recommendationNarrative: "",
};

export const STEPS = [
  { id: 1, name: "Personal Information", short: "Personal" },
  { id: 2, name: "Financial Profile", short: "Financial" },
  { id: 3, name: "Current Coverage", short: "Coverage" },
  { id: 4, name: "Goals & Objectives", short: "Goals" },
  { id: 5, name: "Risk Assessment", short: "Risk" },
  { id: 6, name: "Suitability Determination", short: "Suitability" },
  { id: 7, name: "Product Recommendation", short: "Product" },
  { id: 8, name: "Review & Summary", short: "Review" },
] as const;

const STORAGE_KEY = "finbox_discovery_data";
const STEP_KEY = "finbox_discovery_step";
const COMPLETED_KEY = "finbox_discovery_completed";

function loadPersistedData(): DiscoveryData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...defaultData, ...JSON.parse(raw) };
  } catch {}
  return defaultData;
}

function loadPersistedStep(): number {
  try {
    const raw = localStorage.getItem(STEP_KEY);
    if (raw) return parseInt(raw, 10) || 1;
  } catch {}
  return 1;
}

function loadPersistedCompleted(): Set<number> {
  try {
    const raw = localStorage.getItem(COMPLETED_KEY);
    if (raw) return new Set(JSON.parse(raw));
  } catch {}
  return new Set();
}

interface DiscoveryContextType {
  data: DiscoveryData;
  updateData: (updates: Partial<DiscoveryData>) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  completedSteps: Set<number>;
  markStepComplete: (step: number) => void;
  getStepCompletion: (step: number) => number;
  resetDiscovery: () => void;
}

const DiscoveryContext = createContext<DiscoveryContextType | null>(null);

export function useDiscovery() {
  const ctx = useContext(DiscoveryContext);
  if (!ctx) throw new Error("useDiscovery must be used within DiscoveryProvider");
  return ctx;
}

export function DiscoveryProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<DiscoveryData>(loadPersistedData);
  const [currentStep, setCurrentStepState] = useState(loadPersistedStep);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(loadPersistedCompleted);

  // Persist data on change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  useEffect(() => {
    localStorage.setItem(STEP_KEY, String(currentStep));
  }, [currentStep]);

  useEffect(() => {
    localStorage.setItem(COMPLETED_KEY, JSON.stringify([...completedSteps]));
  }, [completedSteps]);

  const updateData = useCallback((updates: Partial<DiscoveryData>) => {
    setData((prev) => ({ ...prev, ...updates }));
  }, []);

  const setCurrentStep = useCallback((step: number) => {
    setCurrentStepState(step);
  }, []);

  const markStepComplete = useCallback((step: number) => {
    setCompletedSteps((prev) => new Set(prev).add(step));
  }, []);

  const resetDiscovery = useCallback(() => {
    setData(defaultData);
    setCurrentStepState(1);
    setCompletedSteps(new Set());
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STEP_KEY);
    localStorage.removeItem(COMPLETED_KEY);
  }, []);

  const getStepCompletion = (step: number): number => {
    if (completedSteps.has(step)) return 100;
    switch (step) {
      case 1: {
        const fields = [data.firstName, data.lastName, data.dateOfBirth, data.phone, data.email, data.maritalStatus, data.annualIncome];
        return Math.round((fields.filter(Boolean).length / fields.length) * 100);
      }
      case 2: {
        const fields = [data.totalLiquidAssets, data.totalNetWorth, data.monthlyExpenses, data.taxBracket, data.filingStatus, data.sourceOfFunds];
        return Math.round((fields.filter(Boolean).length / fields.length) * 100);
      }
      case 3:
        return data.existingPolicies.length > 0 || data.existingAnnuities.length > 0 ? 50 : 0;
      case 4: {
        const fields = [data.primaryGoals.length > 0, data.investmentTimeHorizon, data.liquidityNeeds, data.targetRetirementAge];
        return Math.round((fields.filter(Boolean).length / fields.length) * 100);
      }
      case 5:
        return Math.round((Object.keys(data.riskAnswers).length / 5) * 100);
      case 6:
        return data.advisorNotes ? 50 : 0;
      case 7:
        return data.selectedCarrier && data.selectedProduct ? 100 : 0;
      case 8:
        return 0;
      default:
        return 0;
    }
  };

  return (
    <DiscoveryContext.Provider
      value={{ data, updateData, currentStep, setCurrentStep, completedSteps, markStepComplete, getStepCompletion, resetDiscovery }}
    >
      {children}
    </DiscoveryContext.Provider>
  );
}
