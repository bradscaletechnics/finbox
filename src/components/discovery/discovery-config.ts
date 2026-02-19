export interface StepCoachTip {
  type: "tip" | "warning";
  text: string;
}

export interface StepConfig {
  id: number;
  name: string;
  why: string;
  estimatedMinutes: number;
  coachIntro: string;
  coachTips: StepCoachTip[];
  requiredFields: { key: string; label: string; fieldId?: string }[];
  transitionMessage: string;
  achievementTitle: string;
}

export const STEP_CONFIGS: StepConfig[] = [
  {
    id: 1,
    name: "Personal Information",
    why: "Accurate personal details ensure the application is processed without delays and the policy is legally valid.",
    estimatedMinutes: 4,
    coachIntro: "Start by building rapport. Let the client know this information is confidential and required for their application.",
    coachTips: [
      { type: "tip", text: "\"Let's start with some basic information. Everything you share is kept strictly confidential and is only used for your application.\"" },
      { type: "tip", text: "\"For the beneficiary section — who would you want to receive the benefits if something were to happen to you?\"" },
      { type: "warning", text: "Don't rush through the SSN — explain it's required by the carrier and is encrypted in the system." },
      { type: "tip", text: "\"Is your mailing address the same as your residential address? I want to make sure we have the right one on file.\"" },
    ],
    requiredFields: [
      { key: "firstName", label: "First Name" },
      { key: "lastName", label: "Last Name" },
      { key: "dateOfBirth", label: "Date of Birth" },
      { key: "phone", label: "Phone Number" },
      { key: "email", label: "Email Address" },
      { key: "maritalStatus", label: "Marital Status" },
      { key: "annualIncome", label: "Annual Income" },
    ],
    transitionMessage: "Personal details captured — great start!",
    achievementTitle: "Personal Info Locked In",
  },
  {
    id: 2,
    name: "Financial Profile",
    why: "Understanding the client's finances helps determine which products are suitable and ensures compliance with suitability regulations.",
    estimatedMinutes: 3,
    coachIntro: "This section establishes whether the product is financially appropriate. Frame it as helping them see the full picture.",
    coachTips: [
      { type: "tip", text: "\"Now I'd like to understand your overall financial picture. This helps me recommend something that truly fits your situation.\"" },
      { type: "tip", text: "\"For liquid assets, think of anything you could convert to cash within 30 days — savings, brokerage accounts, CDs...\"" },
      { type: "warning", text: "If the client seems uncomfortable discussing finances, reassure them: this is standard for all applications and helps protect them." },
      { type: "tip", text: "\"Do you have an existing annuity or life insurance policy you might be looking to move funds from?\"" },
    ],
    requiredFields: [
      { key: "totalLiquidAssets", label: "Total Liquid Assets" },
      { key: "totalNetWorth", label: "Total Net Worth" },
      { key: "taxBracket", label: "Tax Bracket" },
      { key: "filingStatus", label: "Filing Status" },
      { key: "sourceOfFunds", label: "Source of Funds" },
    ],
    transitionMessage: "Financial profile captured — you're making great progress.",
    achievementTitle: "Financial Profile Captured",
  },
  {
    id: 3,
    name: "Current Coverage",
    why: "Documenting existing coverage is required for compliance and helps identify gaps or replacement situations that need disclosure.",
    estimatedMinutes: 3,
    coachIntro: "Ask about existing policies carefully. This is where replacement disclosure requirements can be triggered.",
    coachTips: [
      { type: "tip", text: "\"Do you currently have any life insurance policies or annuities in place? Even older ones you may have forgotten about?\"" },
      { type: "warning", text: "If the client has existing coverage that will be replaced, you MUST complete the replacement disclosure. This is a compliance requirement." },
      { type: "tip", text: "\"If you have your existing policy statements handy, I can help capture the details accurately.\"" },
    ],
    requiredFields: [],
    transitionMessage: "Coverage review complete — compliance on track.",
    achievementTitle: "Coverage Review Complete",
  },
  {
    id: 4,
    name: "Goals & Objectives",
    why: "Clearly defined goals create the foundation for a suitable recommendation and protect both you and the client.",
    estimatedMinutes: 3,
    coachIntro: "This is where you connect emotionally. Help the client articulate what they're trying to achieve — not just financially, but for their family.",
    coachTips: [
      { type: "tip", text: "\"What's the #1 thing you want this money to do for you? Is it about income in retirement, protecting what you have, or leaving something for your family?\"" },
      { type: "tip", text: "\"When do you picture yourself retiring — or are you already there? This helps me find the right time horizon.\"" },
      { type: "warning", text: "If the client selects a short time horizon but the product has a long surrender period, flag this now — it affects suitability." },
      { type: "tip", text: "\"Will you need to access any of these funds in the next 5-10 years? It's important we plan for that.\"" },
    ],
    requiredFields: [
      { key: "primaryGoals", label: "Primary Goals (at least one)" },
      { key: "liquidityNeeds", label: "Liquidity Needs" },
      { key: "targetRetirementAge", label: "Target Retirement Age" },
    ],
    transitionMessage: "Goals documented — the picture is coming together.",
    achievementTitle: "Goals & Objectives Set",
  },
  {
    id: 5,
    name: "Risk Assessment",
    why: "Risk tolerance determines which products are suitable. Mismatched risk profiles are the #1 cause of compliance issues.",
    estimatedMinutes: 3,
    coachIntro: "Read each question aloud and let the client answer naturally. Don't lead them toward any particular answer.",
    coachTips: [
      { type: "tip", text: "\"I'm going to ask you a few questions about how you feel about investment risk. There are no right or wrong answers — just what's true for you.\"" },
      { type: "warning", text: "Never suggest or influence the client's answers. Their responses must be genuine for compliance purposes." },
      { type: "tip", text: "\"Take your time with each question. These help me understand your comfort level so I can recommend something you'll feel good about.\"" },
    ],
    requiredFields: [
      { key: "riskQ1", label: "Question 1" },
      { key: "riskQ2", label: "Question 2" },
      { key: "riskQ3", label: "Question 3" },
      { key: "riskQ4", label: "Question 4" },
      { key: "riskQ5", label: "Question 5" },
    ],
    transitionMessage: "Risk profile complete — suitability analysis ready.",
    achievementTitle: "Risk Profile Assessed",
  },
  {
    id: 6,
    name: "Suitability Determination",
    why: "This auto-generated analysis confirms the recommendation is appropriate and creates a compliance record for the file.",
    estimatedMinutes: 2,
    coachIntro: "Review the auto-generated suitability analysis with the client. Explain which products are suitable and why.",
    coachTips: [
      { type: "tip", text: "\"Based on everything we've discussed, the system has analyzed which products are a good fit for your situation. Let me walk you through what it found.\"" },
      { type: "tip", text: "\"You can see that some products are marked as suitable and others aren't — this is based on your risk tolerance, time horizon, and goals.\"" },
      { type: "warning", text: "Review the compliance checklist carefully. Any unchecked items need to be resolved before proceeding." },
    ],
    requiredFields: [],
    transitionMessage: "Suitability confirmed — almost there!",
    achievementTitle: "Suitability Confirmed",
  },
  {
    id: 7,
    name: "Product Recommendation",
    why: "Selecting the specific carrier and product locks in the recommendation and generates the suitability narrative for the file.",
    estimatedMinutes: 3,
    coachIntro: "Present your recommendation with confidence. Explain why this specific product is the best fit given everything you've learned.",
    coachTips: [
      { type: "tip", text: "\"Based on your goals and risk profile, I'd like to recommend [Product] from [Carrier]. Here's why I think it's the best fit...\"" },
      { type: "tip", text: "\"Let me walk you through the key features — the cap rate, the floor protection, and the surrender period.\"" },
      { type: "warning", text: "Make sure the recommendation narrative accurately reflects the client's situation. This becomes part of the compliance file." },
      { type: "tip", text: "\"Do you have any questions about how this product works before we finalize the recommendation?\"" },
    ],
    requiredFields: [
      { key: "selectedCarrier", label: "Carrier Selection" },
      { key: "selectedProduct", label: "Product Selection" },
    ],
    transitionMessage: "Recommendation locked in — time for final review.",
    achievementTitle: "Recommendation Locked In",
  },
  {
    id: 8,
    name: "Review & Summary",
    why: "A final review catches errors before the handoff package is generated. This is your last chance to verify everything is accurate.",
    estimatedMinutes: 2,
    coachIntro: "Walk through the summary with the client. Confirm all details are accurate before generating the handoff package.",
    coachTips: [
      { type: "tip", text: "\"Let's do a quick review of everything we've captured today to make sure it's all accurate before I prepare your paperwork.\"" },
      { type: "tip", text: "\"If anything looks incorrect, we can easily go back and update it right now.\"" },
      { type: "warning", text: "Double-check the beneficiary designations and financial figures — these are the most common sources of errors." },
    ],
    requiredFields: [],
    transitionMessage: "Discovery complete — ready to generate handoff!",
    achievementTitle: "Full Discovery Complete",
  },
];

export function getStepConfig(stepId: number): StepConfig {
  return STEP_CONFIGS.find((s) => s.id === stepId) ?? STEP_CONFIGS[0];
}

export function getTotalEstimatedMinutes(): number {
  return STEP_CONFIGS.reduce((sum, s) => sum + s.estimatedMinutes, 0);
}

export function getRemainingMinutes(completedSteps: Set<number>, currentStep: number): number {
  return STEP_CONFIGS
    .filter((s) => s.id >= currentStep && !completedSteps.has(s.id))
    .reduce((sum, s) => sum + s.estimatedMinutes, 0);
}
