/**
 * Canadian Insurance Product Types for BC Advisors
 * Focus: Immediate Financing Arrangements (IFAs) and Permanent Life Insurance
 */

// Product categories for Canadian market
export type CanadianProductType =
  | "IFA" // Immediate Financing Arrangement (PRIMARY FOCUS - corporate-owned life insurance strategy)
  | "Participating Whole Life" // Traditional par whole life
  | "Universal Life" // Flexible premium permanent life
  | "Term Life" // Temporary coverage
  | "Segregated Funds"; // Canadian version of variable annuities

// Canadian insurance carriers
export type CanadianCarrier =
  | "Manulife"
  | "Equitable Life Canada"
  | "Sun Life"
  | "Canada Life"
  | "IA Financial Group"
  | "RBC Insurance"
  | "Desjardins";

// IFA-specific structure types
export type IFAStructureType =
  | "Immediate Financing" // Classic IFA with bank financing
  | "Premium Offset" // Dividends pay premiums
  | "10/8 Arrangement" // Premium borrowed, dividends repay
  | "Collateral Lending"; // Policy as collateral

// Canadian tax concepts
export interface CanadianTaxConcepts {
  cda: string; // Capital Dividend Account impact
  ncpi: string; // Net Cost of Pure Insurance
  acb: string; // Adjusted Cost Basis
  itaReferences: string[]; // Relevant Income Tax Act sections
}

// Product interface for Canadian insurance products
export interface CanadianInsuranceProduct {
  id: string;
  productName: string;
  carrier: CanadianCarrier;
  productType: CanadianProductType;

  // IFA-specific fields (null for non-IFA products)
  ifaStructure?: IFAStructureType;
  corporateOwned?: boolean;

  // Core product details
  description: string;
  targetMarket: string[];
  keyFeatures: string[];

  // Eligibility
  minAge: number;
  maxAge: number;
  minPremium: number; // CAD
  maxPremium?: number; // CAD

  // Product specifications
  participatingDividends?: boolean;
  guaranteedValues?: boolean;
  cashValueAccess?: boolean;

  // Canadian tax treatment
  taxTreatment: CanadianTaxConcepts;

  // Regulatory
  provincialApproval: string[]; // Which provinces
  requiredForms: string[];

  // Suitability factors
  suitableFor: string[];
  notSuitableFor: string[];

  // Additional metadata
  updated: string; // Last update date
  notes?: string;
}

// Case/Application type for Canadian products
export interface CanadianCase {
  id: string;
  client: string;
  product: CanadianProductType;
  carrier: CanadianCarrier;

  // IFA-specific case data
  isIFA: boolean;
  corporationName?: string;
  corporateStructure?: "CCPC" | "Public Corp" | "Holding Company" | "Operating Company";

  // Standard case data
  premium: number; // CAD
  province: string; // BC, ON, etc.
  advisor: string;
  status: "Discovery" | "In Progress" | "Underwriting" | "Issued" | "Declined";

  // Canadian tax planning
  taxObjectives: string[];
  cdaProjection?: number;
  ncpiCalculation?: number;

  // Compliance
  suitabilityComplete: boolean;
  disclosuresProvided: string[];

  created: string;
  updated: string;
}
