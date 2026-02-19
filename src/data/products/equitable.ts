import type { CanadianInsuranceProduct } from "./types";

/**
 * Equitable Life Canada Product Catalog
 *
 * NOTE: This is a PLACEHOLDER structure. Actual product details must be obtained
 * from current Equitable Life producer materials.
 *
 * TODO: Update with real data from Equitable Life Canada product guides
 */

export const EQUITABLE_PRODUCTS: CanadianInsuranceProduct[] = [
  // =====================================================
  // IMMEDIATE FINANCING ARRANGEMENTS (IFAs) - PRIMARY FOCUS
  // =====================================================
  {
    id: "equitable-ifa-par-2026",
    productName: "Equitable EquiPar - IFA Structure",
    carrier: "Equitable Life Canada",
    productType: "IFA",
    ifaStructure: "Immediate Financing",
    corporateOwned: true,

    description:
      "Equitable Life's participating whole life insurance designed for corporate-owned Immediate Financing Arrangements. Provides tax-efficient wealth accumulation with CDA credits and NCPI deductions.",

    targetMarket: [
      "Business owners with CCPCs",
      "Professional corporations (medical, dental, legal)",
      "Holding company structures",
      "Corporate surplus investment strategy",
      "Ages 35-65 (optimal for IFA)",
    ],

    keyFeatures: [
      "Participating dividends with historical dividend scale",
      "CDA credit on death (tax-free distribution to shareholders)",
      "NCPI tax deduction for corporation",
      "Cash value for corporate liquidity",
      "Bank financing coordination available",
      "Estate equalization for business families",
      "Flexible premium payment options",
    ],

    minAge: 18,
    maxAge: 70,
    minPremium: 100000, // $100,000 CAD minimum for IFA structures
    maxPremium: undefined,

    participatingDividends: true,
    guaranteedValues: true,
    cashValueAccess: true,

    taxTreatment: {
      cda: "Death benefit proceeds (minus ACB) credited to Capital Dividend Account, enabling tax-free shareholder distributions",
      ncpi:
        "Net Cost of Pure Insurance is a deductible corporate expense under ITA 20(1)(e.2), reducing corporate taxable income",
      acb: "Adjusted Cost Basis increases with premiums paid, decreases with NCPI and fees. Cash value growth is tax-deferred within the policy.",
      itaReferences: [
        "ITA 148(1) - Life insurance policy defined",
        "ITA 148(9) - ACB calculation rules",
        "ITA 89(1) - Capital Dividend Account provisions",
        "ITA 20(1)(e.2) - NCPI deduction for corporations",
        "ITA 12(1)(e.1) - Policy loan interest treatment",
      ],
    },

    provincialApproval: ["BC", "AB", "ON", "QC", "All provinces"],

    requiredForms: [
      "Equitable Life Application - Corporate Owner",
      "Personal Information and Medical Questionnaire (insured individual)",
      "Corporate Resolution and Authorization",
      "Ownership Declaration (corporation as owner and beneficiary)",
      "IFA Structure Suitability Assessment",
      "Financial Underwriting Form (large face amounts)",
      "Banking Coordination Form (if third-party financing)",
    ],

    suitableFor: [
      "Business owners with retained earnings seeking tax-efficient investment",
      "Estate planning with goal to minimize probate and taxes",
      "Business succession and buy-sell funding",
      "Creating corporate liquidity while building tax-advantaged wealth",
      "Professionals with corporations looking to supplement RRSP/TFSA",
    ],

    notSuitableFor: [
      "Personal life insurance needs (non-corporate)",
      "Clients without corporations or minimal corporate surplus",
      "Short-term financial goals (IFAs are long-term commitments)",
      "Clients unable to sustain premium payments long-term",
      "Situations where personal ownership provides better tax efficiency",
    ],

    updated: "2026-02-18",
    notes:
      "IFA structures must be reviewed with client's tax advisor and accountant. Equitable Life provides IFA-specific illustrations and case design support. Ensure financing terms are disclosed if using third-party lenders. Provincial regulations may vary.",
  },

  // =====================================================
  // PARTICIPATING WHOLE LIFE (Individual Ownership)
  // =====================================================
  {
    id: "equitable-equipar-individual-2026",
    productName: "Equitable EquiPar (Individual)",
    carrier: "Equitable Life Canada",
    productType: "Participating Whole Life",
    corporateOwned: false,

    description:
      "Equitable Life's flagship participating whole life insurance for individual ownership. Traditional permanent life insurance with guaranteed death benefit and dividend potential.",

    targetMarket: [
      "Individuals seeking permanent life insurance",
      "Estate planning and wealth transfer",
      "Conservative long-term savings",
      "Multi-generational wealth building",
      "Ages 0-75",
    ],

    keyFeatures: [
      "Guaranteed death benefit for life",
      "Participating dividends (historically competitive dividend scale)",
      "Guaranteed and non-guaranteed cash values",
      "Policy loans available at competitive rates",
      "Paid-up additions option",
      "Waiver of premium and other riders available",
      "Convertible from term products",
    ],

    minAge: 0,
    maxAge: 75,
    minPremium: 25000, // $25,000 CAD annual
    maxPremium: undefined,

    participatingDividends: true,
    guaranteedValues: true,
    cashValueAccess: true,

    taxTreatment: {
      cda: "Not applicable for individual ownership",
      ncpi: "Not applicable for individual ownership",
      acb: "Premiums paid increase ACB. Withdrawals or policy loans exceeding ACB create taxable gain under ITA 148(1)",
      itaReferences: [
        "ITA 148(1) - Policy gain taxation",
        "ITA 148(9) - ACB definitions",
        "ITA 56(1)(j) - Taxable policy benefits",
      ],
    },

    provincialApproval: ["BC", "AB", "ON", "QC", "All provinces"],

    requiredForms: [
      "Equitable Life Individual Application",
      "Personal Information Form",
      "Beneficiary Designation",
      "Medical Exam or Questionnaire (age/amount dependent)",
    ],

    suitableFor: [
      "Permanent life insurance need",
      "Estate planning and wealth transfer to heirs",
      "Conservative long-term savings with guarantees",
      "Supplemental retirement income via policy loans",
      "Generational wealth transfer",
    ],

    notSuitableFor: [
      "Temporary coverage needs (use term)",
      "Clients seeking maximum flexibility (consider UL)",
      "Short-term savings goals",
      "Clients uncomfortable with long-term commitments",
    ],

    updated: "2026-02-18",
    notes:
      "Equitable Life has a strong dividend history. Dividends are not guaranteed but have been paid consistently. Review current dividend scale with clients.",
  },

  // =====================================================
  // UNIVERSAL LIFE
  // =====================================================
  {
    id: "equitable-ul-2026",
    productName: "Equitable Universal Life",
    carrier: "Equitable Life Canada",
    productType: "Universal Life",
    corporateOwned: false,

    description:
      "Flexible premium universal life insurance with multiple investment options. Provides permanent death benefit with cash value accumulation flexibility.",

    targetMarket: [
      "Clients wanting premium flexibility",
      "Business owners with variable income",
      "Long-term wealth accumulation",
      "Ages 18-70",
    ],

    keyFeatures: [
      "Flexible premium payments",
      "Multiple investment fund options (guaranteed, equity, balanced)",
      "Adjustable death benefit",
      "Cash value growth based on fund performance or guaranteed interest",
      "Policy loans and partial withdrawals available",
      "Optional guaranteed insurance option (GIO)",
    ],

    minAge: 18,
    maxAge: 70,
    minPremium: 10000, // $10,000 CAD annual target
    maxPremium: undefined,

    participatingDividends: false,
    guaranteedValues: false,
    cashValueAccess: true,

    taxTreatment: {
      cda: "If corporate-owned, death benefit minus ACB credited to CDA",
      ncpi: "NCPI deductible if corporate-owned under ITA 20(1)(e.2)",
      acb: "Premiums increase ACB; cost of insurance and fees reduce ACB",
      itaReferences: ["ITA 148", "ITA 89(1)", "ITA 20(1)(e.2)"],
    },

    provincialApproval: ["BC", "AB", "ON", "QC", "All provinces"],

    requiredForms: [
      "Equitable UL Application",
      "Investment Fund Selection Form",
      "Personal Information Form",
      "Medical Underwriting as required",
    ],

    suitableFor: [
      "Premium payment flexibility needed",
      "Long-term cash value growth",
      "Business owners with fluctuating cash flow",
      "Clients comfortable with investment-linked growth",
    ],

    notSuitableFor: [
      "Clients seeking guaranteed cash values",
      "Very conservative investors",
      "Clients unable to monitor policy performance",
    ],

    updated: "2026-02-18",
    notes:
      "Universal life policies require monitoring to ensure adequate funding. Investment performance affects policy sustainability.",
  },

  // TERM LIFE - Basic placeholder
  {
    id: "equitable-term-2026",
    productName: "Equitable Term Life",
    carrier: "Equitable Life Canada",
    productType: "Term Life",
    corporateOwned: false,

    description:
      "Affordable temporary life insurance coverage for 10, 20, or 30 year terms with renewal and conversion options.",

    targetMarket: ["Income replacement", "Mortgage protection", "Temporary needs", "Budget-conscious clients"],

    keyFeatures: [
      "Level premiums during term period",
      "Renewable to age 80 (rates increase)",
      "Convertible to permanent products without medical underwriting",
      "Competitive pricing",
    ],

    minAge: 18,
    maxAge: 65,
    minPremium: 500,
    maxPremium: undefined,

    participatingDividends: false,
    guaranteedValues: false,
    cashValueAccess: false,

    taxTreatment: {
      cda: "Not applicable (term insurance has no cash value)",
      ncpi: "Not applicable",
      acb: "Not applicable",
      itaReferences: [],
    },

    provincialApproval: ["BC", "AB", "ON", "QC", "All provinces"],

    requiredForms: ["Equitable Term Application", "Medical Underwriting as required"],

    suitableFor: ["Temporary insurance needs (10-30 years)", "Budget-conscious clients", "Income replacement during working years"],

    notSuitableFor: ["Permanent coverage needs", "Cash value accumulation", "Long-term estate planning"],

    updated: "2026-02-18",
    notes:
      "Term insurance is cost-effective for temporary needs. Clients should review conversion options before term expiry.",
  },
];

/**
 * Get all Equitable Life IFA products
 */
export function getEquitableIFAProducts(): CanadianInsuranceProduct[] {
  return EQUITABLE_PRODUCTS.filter((p) => p.productType === "IFA");
}

/**
 * Get all Equitable products by type
 */
export function getEquitableProductsByType(type: string): CanadianInsuranceProduct[] {
  return EQUITABLE_PRODUCTS.filter((p) => p.productType === type);
}
