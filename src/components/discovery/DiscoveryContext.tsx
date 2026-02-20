import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

export interface Beneficiary {
  name: string;
  relationship: string;
  percentage: number;
}

export interface SigningAuthority {
  name: string;
  email: string;
}

export interface UBODeclaration {
  name: string;
  dateOfBirth: string;
  sin: string;
  address: string;
  citizenship: string;
  ownershipPercent: string;
  isPEP: string;
}

export interface ExistingPolicy {
  carrier: string;
  productType: string;
  faceAmount: string;
  annualPremium: string;
  yearIssued: string;
}

export interface CorporateOwner {
  name: string;
  title: string;
  ownershipPercent: string;
  insuranceInForce: string;
  insuranceAppliedFor: string;
}

export interface AlcoholDetail {
  product: string;
  amount: string;
  frequency: string;
}

export interface InvestmentAllocation {
  accountName: string;
  percentage: string;
}

export interface DiscoveryData {
  // Step 1 - Personal Information
  firstName: string;
  middleName: string;
  lastName: string;
  dateOfBirth: string;
  sin: string;
  gender: string;
  smokerStatus: string;
  canadianStatus: string;
  height: string;
  weight: string;
  street: string;
  city: string;
  province: string;
  postalCode: string;
  phone: string;
  email: string;
  maritalStatus: string;
  employmentStatus: string;
  occupation: string;
  employerName: string;
  annualIncome: string;
  beneficiaries: Beneficiary[];
  // Owner
  ownerType: string;
  corporateName: string;
  corporateIsOperatingName: boolean;
  corporateType: string;
  corporateProvince: string;
  corporateIncorporationNumber: string;
  corporateDateOfIncorporation: string;
  corporateFiscalYearEnd: string;
  corporateBusinessNumber: string;
  signingAuthorities: SigningAuthority[];
  uboDeclarations: UBODeclaration[];
  pepHioDeclaration: string;
  thirdPartyPayorDeclaration: string;
  thirdPartyPayorName: string;

  // Step 2 - Financial Profile
  totalLiquidAssets: string;
  totalNetWorth: string;
  totalLiabilities: string;
  otherIncome: string;
  foreignNetWorth: string;
  taxBracket: string;
  filingStatus: string;
  sourceOfFunds: string;
  existingPolicyDetails: string;
  existingAccountNumber: string;
  reasonForPurchase: string;
  faceAmountRequested: string;
  // Corporate financials
  corporateNatureOfBusiness: string;
  corporateBusinessAssets: string;
  corporateBusinessLiabilities: string;
  corporateNetProfitLastYear: string;
  corporateNetProfitPrevYear: string;
  corporateOwners: CorporateOwner[];
  // IFA-specific
  collateralAssignmentIntent: string;
  lenderName: string;
  estimatedLoanAmount: string;
  loanPurpose: string;
  keyPersonValueMethod: string;
  keyPersonValueAmount: string;
  shareholderAgreementOnFile: string;
  taxCounselName: string;
  legalCounselName: string;
  ifaRiskAcknowledged: boolean;
  ncpiDeductibilityConfirmed: string;

  // Step 3 - Current Coverage
  existingPolicies: ExistingPolicy[];
  willReplaceCoverage: boolean;
  replacementDisclosureAcknowledged: boolean;
  applicationEverDeclined: string;
  pendingApplicationElsewhere: string;

  // Step 4 - Goals & Objectives
  productCategory: string;
  primaryGoals: string[];
  investmentTimeHorizon: string;
  liquidityNeeds: string;
  liquidityExplanation: string;
  additionalNotes: string;

  // Step 5 - Lifestyle & Underwriting
  travelOutsideNA: string;
  aviationActivity: string;
  hazardousSports: string;
  duiConviction: string;
  drivingOffences: string;
  criminalOffence: string;
  tobaccoUse: string;
  cannabisUse: string;
  drugUse: string;
  alcoholUse: string;
  alcoholDetails: AlcoholDetail[];
  alcoholCounselling: string;

  // Step 6 - Risk Assessment
  riskAnswers: Record<string, string>;

  // Step 7 - Suitability
  advisorNotes: string;

  // Step 8 - Product Recommendation
  selectedCarrier: string;
  selectedProduct: string;
  recommendationNarrative: string;
  // Par-specific
  planDesign: string;
  dividendOption: string;
  edoAmount: string;
  premiumOffsetIntent: string;
  illustrationAcknowledged: boolean;
  // UL-specific
  deathBenefitDesign: string;
  coiStructure: string;
  investmentAllocations: InvestmentAllocation[];
  plannedPremium: string;
  exemptTestAcknowledged: boolean;
  // Term-specific
  termPeriod: string;
  conversionPrivilege: boolean;
  ropOption: boolean;
  // Manulife-specific
  vitalityEnrollment: string;
  vitalityConsent: boolean;
}

const defaultData: DiscoveryData = {
  firstName: "",
  middleName: "",
  lastName: "",
  dateOfBirth: "",
  sin: "",
  gender: "",
  smokerStatus: "",
  canadianStatus: "",
  height: "",
  weight: "",
  street: "",
  city: "",
  province: "",
  postalCode: "",
  phone: "",
  email: "",
  maritalStatus: "",
  employmentStatus: "",
  occupation: "",
  employerName: "",
  annualIncome: "",
  beneficiaries: [{ name: "", relationship: "", percentage: 100 }],
  ownerType: "",
  corporateName: "",
  corporateIsOperatingName: true,
  corporateType: "",
  corporateProvince: "",
  corporateIncorporationNumber: "",
  corporateDateOfIncorporation: "",
  corporateFiscalYearEnd: "",
  corporateBusinessNumber: "",
  signingAuthorities: [{ name: "", email: "" }],
  uboDeclarations: [],
  pepHioDeclaration: "",
  thirdPartyPayorDeclaration: "",
  thirdPartyPayorName: "",
  totalLiquidAssets: "",
  totalNetWorth: "",
  totalLiabilities: "",
  otherIncome: "",
  foreignNetWorth: "",
  taxBracket: "",
  filingStatus: "",
  sourceOfFunds: "",
  existingPolicyDetails: "",
  existingAccountNumber: "",
  reasonForPurchase: "",
  faceAmountRequested: "",
  corporateNatureOfBusiness: "",
  corporateBusinessAssets: "",
  corporateBusinessLiabilities: "",
  corporateNetProfitLastYear: "",
  corporateNetProfitPrevYear: "",
  corporateOwners: [],
  collateralAssignmentIntent: "",
  lenderName: "",
  estimatedLoanAmount: "",
  loanPurpose: "",
  keyPersonValueMethod: "",
  keyPersonValueAmount: "",
  shareholderAgreementOnFile: "",
  taxCounselName: "",
  legalCounselName: "",
  ifaRiskAcknowledged: false,
  ncpiDeductibilityConfirmed: "",
  existingPolicies: [],
  willReplaceCoverage: false,
  replacementDisclosureAcknowledged: false,
  applicationEverDeclined: "",
  pendingApplicationElsewhere: "",
  productCategory: "",
  primaryGoals: [],
  investmentTimeHorizon: "10",
  liquidityNeeds: "",
  liquidityExplanation: "",
  additionalNotes: "",
  travelOutsideNA: "",
  aviationActivity: "",
  hazardousSports: "",
  duiConviction: "",
  drivingOffences: "",
  criminalOffence: "",
  tobaccoUse: "",
  cannabisUse: "",
  drugUse: "",
  alcoholUse: "",
  alcoholDetails: [{ product: "", amount: "", frequency: "" }],
  alcoholCounselling: "",
  riskAnswers: {},
  advisorNotes: "",
  selectedCarrier: "",
  selectedProduct: "",
  recommendationNarrative: "",
  planDesign: "",
  dividendOption: "",
  edoAmount: "",
  premiumOffsetIntent: "",
  illustrationAcknowledged: false,
  deathBenefitDesign: "",
  coiStructure: "",
  investmentAllocations: [{ accountName: "", percentage: "" }],
  plannedPremium: "",
  exemptTestAcknowledged: false,
  termPeriod: "",
  conversionPrivilege: false,
  ropOption: false,
  vitalityEnrollment: "",
  vitalityConsent: false,
};

export const STEPS = [
  { id: 1, name: "Personal Information", short: "Personal" },
  { id: 2, name: "Financial Profile", short: "Financial" },
  { id: 3, name: "Current Coverage", short: "Coverage" },
  { id: 4, name: "Goals & Objectives", short: "Goals" },
  { id: 5, name: "Lifestyle & Underwriting", short: "Lifestyle" },
  { id: 6, name: "Risk Assessment", short: "Risk" },
  { id: 7, name: "Suitability Determination", short: "Suitability" },
  { id: 8, name: "Product Recommendation", short: "Product" },
  { id: 9, name: "Review & Summary", short: "Review" },
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
  highlightMissing: boolean;
  setHighlightMissing: (v: boolean) => void;
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
  const [highlightMissing, setHighlightMissing] = useState(false);

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }, [data]);
  useEffect(() => { localStorage.setItem(STEP_KEY, String(currentStep)); }, [currentStep]);
  useEffect(() => { localStorage.setItem(COMPLETED_KEY, JSON.stringify([...completedSteps])); }, [completedSteps]);

  const updateData = useCallback((updates: Partial<DiscoveryData>) => {
    setData((prev) => ({ ...prev, ...updates }));
  }, []);

  // Clear error highlight whenever the user navigates to a different step
  const setCurrentStep = useCallback((step: number) => {
    setCurrentStepState(step);
    setHighlightMissing(false);
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
        const fields = [data.firstName, data.lastName, data.dateOfBirth, data.gender, data.smokerStatus, data.phone, data.email, data.maritalStatus, data.annualIncome, data.ownerType, data.height, data.weight];
        return Math.round((fields.filter(Boolean).length / fields.length) * 100);
      }
      case 2: {
        const fields = [data.totalLiquidAssets, data.totalNetWorth, data.totalLiabilities, data.taxBracket, data.filingStatus, data.sourceOfFunds, data.reasonForPurchase, data.faceAmountRequested];
        return Math.round((fields.filter(Boolean).length / fields.length) * 100);
      }
      case 3:
        return data.applicationEverDeclined && data.pendingApplicationElsewhere ? 50 : 0;
      case 4: {
        const fields = [data.productCategory, data.primaryGoals.length > 0, data.investmentTimeHorizon, data.liquidityNeeds];
        return Math.round((fields.filter(Boolean).length / fields.length) * 100);
      }
      case 5: {
        const fields = [data.travelOutsideNA, data.aviationActivity, data.hazardousSports, data.duiConviction, data.drivingOffences, data.criminalOffence, data.tobaccoUse, data.cannabisUse, data.drugUse, data.alcoholUse];
        return Math.round((fields.filter(Boolean).length / fields.length) * 100);
      }
      case 6:
        return Math.round((Object.keys(data.riskAnswers).length / 5) * 100);
      case 7:
        return data.advisorNotes ? 50 : 0;
      case 8:
        return data.selectedCarrier && data.selectedProduct ? 100 : 0;
      case 9:
        return 0;
      default:
        return 0;
    }
  };

  return (
    <DiscoveryContext.Provider value={{ data, updateData, currentStep, setCurrentStep, completedSteps, markStepComplete, getStepCompletion, resetDiscovery, highlightMissing, setHighlightMissing }}>
      {children}
    </DiscoveryContext.Provider>
  );
}
