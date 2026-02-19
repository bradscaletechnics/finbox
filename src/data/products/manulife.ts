import type { CanadianInsuranceProduct } from "./types";

/**
 * Manulife Product Catalog for Canadian Advisors
 *
 * NOTE: This is a PLACEHOLDER structure. Actual product details, rates, and features
 * must be obtained from current Manulife product guides and updated regularly.
 *
 * TODO: Update with real data from Manulife producer materials
 */

export const MANULIFE_PRODUCTS: CanadianInsuranceProduct[] = [
  // =====================================================
  // IMMEDIATE FINANCING ARRANGEMENTS (IFAs) - PRIMARY FOCUS
  // =====================================================
  {
    id: "manulife-ifa-par-2026",
    productName: "Manulife Par - IFA Structure",
    carrier: "Manulife",
    productType: "IFA",
    ifaStructure: "Immediate Financing",
    corporateOwned: true,

    description:
      "Participating whole life insurance designed for Immediate Financing Arrangements. Corporate-owned permanent life insurance with tax-efficient wealth accumulation through CDA credits and cash value growth.",

    targetMarket: [
      "Business owners with corporations (CCPC preferred)",
      "High-income professionals with holding companies",
      "Estate planning for business succession",
      "Corporate surplus accumulation",
      "Ages 35-65 (optimal IFA age range)",
    ],

    keyFeatures: [
      "Participating dividends (not guaranteed but historically stable)",
      "CDA credits on death benefit (tax-free distribution to shareholders)",
      "NCPI deductible for corporation",
      "Cash value accessible via corporate policy loans",
      "Coordinates with bank financing for premium funding",
      "Estate equalization for family businesses",
    ],

    minAge: 18,
    maxAge: 70,
    minPremium: 100000, // $100,000 CAD typical minimum for IFA structures
    maxPremium: undefined, // No maximum, subject to underwriting

    participatingDividends: true,
    guaranteedValues: true,
    cashValueAccess: true,

    taxTreatment: {
      cda: "Death benefit minus ACB credited to CDA, allowing tax-free dividend distribution to shareholders",
      ncpi: "Net Cost of Pure Insurance is tax-deductible expense for corporation (reduces corporate tax)",
      acb: "Premiums paid increase ACB; NCPI and policy fees reduce ACB; cash value growth is tax-deferred",
      itaReferences: [
        "ITA 148(1) - Life insurance policy definitions",
        "ITA 148(9) - Adjusted cost basis rules",
        "ITA 89(1) - Capital dividend account",
        "ITA 20(1)(e.2) - NCPI deduction",
      ],
    },

    provincialApproval: ["BC", "AB", "ON", "QC", "All provinces"],

    requiredForms: [
      "Manulife Application for Insurance (corporate owner)",
      "Personal Information Form (insured individual)",
      "Corporate Resolution authorizing purchase",
      "Ownership and beneficiary designation (corporation as owner and beneficiary)",
      "Financial underwriting questionnaire (for large face amounts)",
      "IFA Structure Disclosure and Suitability Assessment",
    ],

    suitableFor: [
      "Business owners with retained earnings in corporation",
      "Professionals seeking tax-efficient retirement savings beyond RRSP/TFSA",
      "Estate planning with desire to minimize taxes on death",
      "Business succession planning",
      "Creating liquidity for estate taxes or buy-sell agreements",
    ],

    notSuitableFor: [
      "Personal insurance needs (use personal-owned policies)",
      "Clients without corporations or significant corporate surplus",
      "Short-term needs (IFA strategies are long-term commitments)",
      "Clients who cannot commit to sustained premium payments",
      "Situations where personal ownership is more tax-efficient",
    ],

    updated: "2026-02-18",
    notes:
      "IFA structures require coordination with client's tax advisor and corporate accountant. Financing arrangements typically involve third-party lenders. Product illustrations must show guaranteed and non-guaranteed values. Ensure corporate tax treatment is confirmed with qualified tax professional.",
  },

  // =====================================================
  // PARTICIPATING WHOLE LIFE (Non-IFA)
  // =====================================================
  {
    id: "manulife-par-individual-2026",
    productName: "Manulife Par (Individual)",
    carrier: "Manulife",
    productType: "Participating Whole Life",
    corporateOwned: false,

    description:
      "Traditional participating whole life insurance for individual ownership. Provides guaranteed death benefit with potential dividend growth.",

    targetMarket: [
      "Individuals seeking permanent life insurance",
      "Estate planning and wealth transfer",
      "Conservative long-term savings",
      "Ages 18-75",
    ],

    keyFeatures: [
      "Guaranteed death benefit",
      "Participating dividends (based on Manulife dividend scale)",
      "Cash value accumulation (guaranteed + dividend-enhanced)",
      "Policy loans available",
      "Paid-up additions option",
      "Waiver of premium rider available",
    ],

    minAge: 18,
    maxAge: 75,
    minPremium: 25000, // $25,000 CAD annual premium typical minimum
    maxPremium: undefined,

    participatingDividends: true,
    guaranteedValues: true,
    cashValueAccess: true,

    taxTreatment: {
      cda: "Not applicable (individual ownership)",
      ncpi: "Not applicable (individual ownership, not corporate)",
      acb: "Premiums increase ACB; policy loans and withdrawals may trigger taxable gain if exceed ACB",
      itaReferences: ["ITA 148(1)", "ITA 148(9)", "ITA 56(1)(j) - Taxable policy gains"],
    },

    provincialApproval: ["BC", "AB", "ON", "QC", "All provinces"],

    requiredForms: [
      "Manulife Application for Insurance",
      "Personal Information Form",
      "Beneficiary designation",
      "Medical questionnaire or exam (based on age/amount)",
    ],

    suitableFor: [
      "Long-term permanent life insurance need",
      "Conservative investors seeking guaranteed values",
      "Estate planning and wealth transfer",
      "Supplemental retirement savings",
    ],

    notSuitableFor: [
      "Temporary coverage needs (use term life)",
      "Clients seeking maximum flexibility (consider universal life)",
      "Short-term savings goals",
    ],

    updated: "2026-02-18",
    notes: "Dividends are not guaranteed. Historical Manulife dividend performance should be reviewed with clients.",
  },

  // =====================================================
  // UNIVERSAL LIFE
  // =====================================================
  {
    id: "manulife-ul-2026",
    productName: "Manulife Vitality Universal Life",
    carrier: "Manulife",
    productType: "Universal Life",
    corporateOwned: false,

    description:
      "Flexible premium universal life insurance with investment account options. Provides permanent death benefit protection with cash value growth potential.",

    targetMarket: [
      "Clients seeking premium flexibility",
      "Younger clients building cash value over time",
      "Business owners with variable income",
      "Ages 18-70",
    ],

    keyFeatures: [
      "Flexible premium payments (within limits)",
      "Multiple investment account options",
      "Adjustable death benefit",
      "Cash value growth based on declared interest rates or investment performance",
      "Policy loan and withdrawal options",
      "Optional no-lapse guarantee riders",
    ],

    minAge: 18,
    maxAge: 70,
    minPremium: 10000, // $10,000 CAD minimum annual target premium
    maxPremium: undefined,

    participatingDividends: false,
    guaranteedValues: false, // Unless no-lapse guarantee selected
    cashValueAccess: true,

    taxTreatment: {
      cda: "Can be corporate-owned; death benefit minus ACB credited to CDA if corporately owned",
      ncpi: "NCPI deductible if corporate-owned",
      acb: "Premium payments increase ACB; cost of insurance and policy fees reduce ACB",
      itaReferences: ["ITA 148", "ITA 89(1)", "ITA 20(1)(e.2)"],
    },

    provincialApproval: ["BC", "AB", "ON", "QC", "All provinces"],

    requiredForms: [
      "Manulife UL Application",
      "Investment account selection form",
      "Personal Information Form",
      "Medical underwriting as required",
    ],

    suitableFor: [
      "Clients wanting premium flexibility",
      "Long-term cash value accumulation",
      "Business owners with fluctuating income",
      "Supplemental retirement income via policy loans",
    ],

    notSuitableFor: [
      "Clients seeking guaranteed cash values (use par whole life)",
      "Conservative clients uncomfortable with market-linked returns",
      "Clients unable to maintain minimum premiums",
    ],

    updated: "2026-02-18",
    notes:
      "Universal life requires ongoing monitoring to ensure policy stays in force. Investment account performance affects long-term sustainability.",
  },

  // TERM LIFE - Basic placeholder
  {
    id: "manulife-term-2026",
    productName: "Manulife Term Life",
    carrier: "Manulife",
    productType: "Term Life",
    corporateOwned: false,

    description: "Temporary life insurance coverage for 10, 20, or 30 year terms.",

    targetMarket: ["Income replacement", "Mortgage protection", "Temporary needs", "Ages 18-65"],

    keyFeatures: ["Level premiums during term", "Renewable and convertible", "Affordable coverage"],

    minAge: 18,
    maxAge: 65,
    minPremium: 500,
    maxPremium: undefined,

    participatingDividends: false,
    guaranteedValues: false,
    cashValueAccess: false,

    taxTreatment: {
      cda: "Not applicable (no cash value, no CDA credit)",
      ncpi: "Not applicable",
      acb: "Not applicable (no cash value)",
      itaReferences: [],
    },

    provincialApproval: ["BC", "AB", "ON", "QC", "All provinces"],

    requiredForms: ["Manulife Term Application", "Medical underwriting as required"],

    suitableFor: ["Temporary insurance needs", "Budget-conscious clients", "Income replacement"],

    notSuitableFor: ["Permanent coverage needs", "Cash value accumulation", "Estate planning"],

    updated: "2026-02-18",
    notes: "Term insurance is temporary. Clients needing lifetime coverage should consider permanent policies.",
  },
];

/**
 * Get all Manulife IFA products
 */
export function getManulifeIFAProducts(): CanadianInsuranceProduct[] {
  return MANULIFE_PRODUCTS.filter((p) => p.productType === "IFA");
}

/**
 * Get all Manulife products by type
 */
export function getManulifeProductsByType(type: string): CanadianInsuranceProduct[] {
  return MANULIFE_PRODUCTS.filter((p) => p.productType === type);
}
