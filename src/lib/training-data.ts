// ─── Training Module Types ──────────────────────────────────────

export type TrainingCategory = "product" | "sales" | "compliance";

export interface ReferenceCard {
  id: string;
  category: TrainingCategory;
  title: string;
  subtitle: string;
  facts: string[];
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  category: TrainingCategory;
  title: string;
  description: string;
  xpReward: number;
  questions: QuizQuestion[];
}

export interface TrainingModule {
  id: string;
  category: TrainingCategory;
  title: string;
  description: string;
  duration: string;
  xpReward: number;
  sections: { title: string; content: string }[];
}

// ─── Reference Cards ────────────────────────────────────────────

export const REFERENCE_CARDS: ReferenceCard[] = [
  {
    id: "ref-ifa",
    category: "product",
    title: "Fixed Indexed Annuity (FIA/IFA)",
    subtitle: "Index-linked growth with principal protection",
    facts: [
      "Earns interest based on index performance (e.g., S&P 500)",
      "0% floor protects against market losses",
      "Participation rates typically 40–100%",
      "Surrender periods usually 5–10 years",
      "Income riders available for guaranteed lifetime income",
      "Tax-deferred growth — no taxes until withdrawal",
    ],
  },
  {
    id: "ref-iul",
    category: "product",
    title: "Indexed Universal Life (IUL)",
    subtitle: "Flexible life insurance with index-linked cash value",
    facts: [
      "Permanent death benefit with flexible premiums",
      "Cash value grows based on index performance",
      "Floor protection (typically 0–1%)",
      "Cap rates limit maximum credited interest",
      "Tax-free policy loans against cash value",
      "Cost of insurance increases with age",
    ],
  },
  {
    id: "ref-vul",
    category: "product",
    title: "Variable Universal Life (VUL)",
    subtitle: "Investment-based life insurance with market exposure",
    facts: [
      "Cash value invested in sub-accounts (mutual fund–like)",
      "Higher growth potential but no downside protection",
      "Requires securities license (Series 6 or 7)",
      "Prospectus must be delivered to client",
      "Most flexible premium structure",
      "Best for aggressive, high-income clients",
    ],
  },
  {
    id: "ref-1035",
    category: "compliance",
    title: "1035 Exchange Rules",
    subtitle: "Tax-free contract replacement",
    facts: [
      "Annuity → Annuity: tax-free",
      "Life → Annuity: tax-free",
      "Annuity → Life: NOT allowed tax-free",
      "Must be same owner and same insured",
      "Check for surrender charges on existing contract",
      "Document suitability for the replacement",
    ],
  },
  {
    id: "ref-suit",
    category: "compliance",
    title: "Suitability Requirements",
    subtitle: "NAIC Model Regulation standards",
    facts: [
      "Gather complete financial profile before recommendation",
      "Document risk tolerance with standardized assessment",
      "Compare existing coverage before replacement",
      "Ensure product aligns with stated objectives",
      "Surrender period must not exceed client's time horizon",
      "Premium must be within appropriate allocation guidelines",
    ],
  },
  {
    id: "ref-objections",
    category: "sales",
    title: "Common Objections & Responses",
    subtitle: "Quick-reference objection handlers",
    facts: [
      '"I need to think about it" → Isolate the concern, restate urgency',
      '"Rates seem low" → Compare to CD/bond alternatives, highlight floor',
      '"Surrender charges are too long" → Match to retirement timeline',
      '"I don\'t trust insurance companies" → Cite state guaranty fund protections',
      '"My advisor says annuities are bad" → Clarify suitability context',
      '"Can I get my money back?" → Explain free withdrawal provisions',
    ],
  },
  {
    id: "ref-iul-detail",
    category: "product",
    title: "IUL Deep Dive",
    subtitle: "Key mechanics and positioning for Indexed Universal Life",
    facts: [
      "Premium flexibility: adjust payments up or down as income changes",
      "Cash value tracks indices (S&P 500, Nasdaq-100) with 0–1% floor",
      "Cap rates typically 9–12% limit upside in exchange for downside protection",
      "Tax-free policy loans: access cash value without triggering income tax",
      "Over-funding risk: Modified Endowment Contract (MEC) limits apply",
      "Ideal for high-income clients wanting tax-advantaged supplemental retirement income",
    ],
  },
  {
    id: "ref-vul-detail",
    category: "product",
    title: "VUL Deep Dive",
    subtitle: "Key mechanics and positioning for Variable Universal Life",
    facts: [
      "Cash value invested in sub-accounts (equity, bond, money market funds)",
      "No floor protection — full market exposure means potential losses",
      "Requires Series 6 or 7 license plus state insurance license",
      "Prospectus delivery is mandatory before or at point of sale",
      "Highest growth potential among permanent life products",
      "Best suited for aggressive investors with long time horizons and high risk tolerance",
    ],
  },
  {
    id: "ref-closing",
    category: "sales",
    title: "Closing Techniques",
    subtitle: "Proven methods for moving to commitment",
    facts: [
      "Assumptive Close: proceed as if decision is made — 'Shall we set the start date for the 1st?'",
      "Alternative Close: offer two positive choices — 'Would you prefer the 7-year or 10-year option?'",
      "Summary Close: recap all agreed benefits before asking for commitment",
      "Urgency Close: highlight rate-lock deadlines or birthday-based pricing changes",
      "Trial Close: gauge readiness — 'How does this sound so far?'",
      "Silent Close: present the recommendation, then wait — let the client speak first",
    ],
  },
  {
    id: "ref-replacement",
    category: "compliance",
    title: "Replacement & Churning Rules",
    subtitle: "Regulatory guardrails for policy replacements",
    facts: [
      "Replacement: substituting one annuity/life policy for another",
      "Churning: excessive replacements to generate commissions — strictly prohibited",
      "Most states require a signed replacement disclosure form",
      "Compare surrender charges, benefits, and riders side by side",
      "Document clear client benefit — 'better' must be provable",
      "Carrier notification required within prescribed timeframe (varies by state)",
    ],
  },
];

// ─── Quizzes ────────────────────────────────────────────────────

export const QUIZZES: Quiz[] = [
  {
    id: "quiz-ifa-basics",
    category: "product",
    title: "FIA Fundamentals",
    description: "Test your knowledge of Fixed Indexed Annuity mechanics",
    xpReward: 75,
    questions: [
      {
        question: "What does the 0% floor in an FIA guarantee?",
        options: [
          "The client will always earn at least 0% interest",
          "The premium will never decrease below initial amount",
          "Both A and B are correct",
          "Neither — there is no guarantee",
        ],
        correctIndex: 2,
        explanation: "The 0% floor means the client's credited interest will never be negative, effectively protecting the premium from market losses.",
      },
      {
        question: "What is a participation rate?",
        options: [
          "The percentage of the index gain credited to the annuity",
          "The percentage of clients who participate in the product",
          "The minimum guaranteed interest rate",
          "The annual fee charged by the carrier",
        ],
        correctIndex: 0,
        explanation: "The participation rate determines what percentage of the index's gain is credited to the annuity. A 60% participation rate means if the index gains 10%, the annuity is credited 6%.",
      },
      {
        question: "When are taxes owed on FIA gains?",
        options: [
          "Annually on credited interest",
          "Upon withdrawal or distribution",
          "Never — FIAs are tax-free",
          "Only if the annuity is surrendered",
        ],
        correctIndex: 1,
        explanation: "FIAs grow tax-deferred. Taxes are owed only when money is withdrawn, and gains are taxed as ordinary income (LIFO basis).",
      },
      {
        question: "What is an income rider?",
        options: [
          "A clause that requires minimum premium payments",
          "An optional benefit that provides guaranteed lifetime income",
          "A requirement for the client to ride out the surrender period",
          "A fee reduction for high-premium contracts",
        ],
        correctIndex: 1,
        explanation: "An income rider is an optional benefit (usually with an additional fee) that guarantees a lifetime income stream regardless of account value.",
      },
      {
        question: "Which crediting strategy uses the index value at two specific points?",
        options: [
          "Monthly averaging",
          "Annual point-to-point",
          "Daily ratchet",
          "Performance trigger",
        ],
        correctIndex: 1,
        explanation: "Annual point-to-point compares the index value at the start and end of the crediting period to determine the gain.",
      },
    ],
  },
  {
    id: "quiz-compliance",
    category: "compliance",
    title: "Suitability & Compliance",
    description: "Test your knowledge of regulatory requirements",
    xpReward: 75,
    questions: [
      {
        question: "Under NAIC Model Regulation, what must be documented before making an annuity recommendation?",
        options: [
          "Only the client's age and income",
          "A reasonable basis for the recommendation based on consumer's profile",
          "Just the client's signature on the application",
          "Only the agent's production requirements",
        ],
        correctIndex: 1,
        explanation: "The NAIC model requires a reasonable basis for the recommendation based on the consumer's suitability information including financial situation, needs, and objectives.",
      },
      {
        question: "In a 1035 exchange, which transfer is NOT tax-free?",
        options: [
          "Annuity to annuity",
          "Life insurance to annuity",
          "Annuity to life insurance",
          "Life insurance to life insurance",
        ],
        correctIndex: 2,
        explanation: "An annuity cannot be exchanged tax-free into a life insurance policy. The exchange must go 'down' the chain: Life → Annuity is okay, but Annuity → Life is not.",
      },
      {
        question: "What is the typical free withdrawal provision in most FIAs?",
        options: [
          "5% per year",
          "10% per year",
          "15% per year",
          "No free withdrawals allowed",
        ],
        correctIndex: 1,
        explanation: "Most FIAs allow 10% annual free withdrawals without surrender charges, though some may vary.",
      },
      {
        question: "When replacing an existing annuity, what additional form is typically required?",
        options: [
          "A replacement disclosure form",
          "A medical exam",
          "A securities license application",
          "A court order",
        ],
        correctIndex: 0,
        explanation: "When replacing an existing annuity or life insurance policy, most states require a replacement disclosure form that compares the old and new products.",
      },
    ],
  },
  {
    id: "quiz-sales",
    category: "sales",
    title: "Discovery & Closing Skills",
    description: "Sharpen your client-facing techniques",
    xpReward: 75,
    questions: [
      {
        question: "What is the most effective opening question in a discovery meeting?",
        options: [
          "How much money do you have to invest?",
          "What keeps you up at night about your financial future?",
          "Do you want an annuity?",
          "What's your risk tolerance on a scale of 1-10?",
        ],
        correctIndex: 1,
        explanation: "Open-ended questions about concerns and goals build rapport and reveal true motivations before diving into financial details.",
      },
      {
        question: "When a client says 'I need to think about it,' what should you do first?",
        options: [
          "Give them a brochure and follow up next week",
          "Isolate the specific concern and address it",
          "Offer a discount or bonus",
          "Tell them the offer expires soon",
        ],
        correctIndex: 1,
        explanation: "The best response is to gently isolate what specifically they need to think about. Often it's an unspoken concern that can be addressed in the meeting.",
      },
      {
        question: "What is the 'feel, felt, found' technique?",
        options: [
          "A medical examination process",
          "An empathy-based objection handling framework",
          "A compliance documentation method",
          "A risk assessment tool",
        ],
        correctIndex: 1,
        explanation: "'I understand how you feel. Others have felt the same way. What they found was...' — this technique validates the concern while introducing a new perspective.",
      },
      {
        question: "What percentage of communication is non-verbal in face-to-face meetings?",
        options: [
          "About 25%",
          "About 55%",
          "About 75%",
          "About 93%",
        ],
        correctIndex: 1,
        explanation: "Research suggests approximately 55% of communication is body language, 38% is tone of voice, and only 7% is the actual words spoken.",
      },
    ],
  },
  {
    id: "quiz-iul",
    category: "product",
    title: "IUL Mechanics",
    description: "Test your understanding of Indexed Universal Life policies",
    xpReward: 75,
    questions: [
      {
        question: "What is the primary tax advantage of IUL policy loans?",
        options: [
          "Loans are tax-deductible",
          "Loans are tax-free if the policy stays in force",
          "Loans reduce estate taxes",
          "Loans are taxed at capital gains rates",
        ],
        correctIndex: 1,
        explanation: "IUL policy loans are not considered taxable income as long as the policy remains in force and is not a Modified Endowment Contract (MEC).",
      },
      {
        question: "What happens if an IUL is classified as a Modified Endowment Contract (MEC)?",
        options: [
          "The death benefit is voided",
          "Withdrawals and loans become taxable and may incur a 10% penalty",
          "The policy is automatically surrendered",
          "Premium payments are refunded",
        ],
        correctIndex: 1,
        explanation: "A MEC loses its tax-advantaged loan and withdrawal treatment. Distributions are taxed LIFO (gains first) and may be subject to a 10% penalty if taken before age 59½.",
      },
      {
        question: "What does the 'cap rate' in an IUL determine?",
        options: [
          "The minimum guaranteed interest rate",
          "The maximum interest that can be credited in a given period",
          "The annual policy fee percentage",
          "The maximum premium allowed per year",
        ],
        correctIndex: 1,
        explanation: "The cap rate sets the ceiling on index-linked gains. If the cap is 10% and the index gains 15%, only 10% is credited to the cash value.",
      },
      {
        question: "Which client profile is MOST suitable for an IUL?",
        options: [
          "A retiree needing immediate income",
          "A high-income earner seeking tax-advantaged supplemental retirement income",
          "A young family needing maximum death benefit per dollar",
          "A conservative investor who wants guaranteed fixed returns",
        ],
        correctIndex: 1,
        explanation: "IUL is ideal for high earners who have maxed out 401(k)/IRA contributions and want additional tax-advantaged growth with downside protection.",
      },
      {
        question: "How does cost of insurance (COI) in an IUL change over time?",
        options: [
          "It stays level for the life of the policy",
          "It decreases as cash value grows",
          "It increases as the insured ages",
          "It is only charged in the first 10 years",
        ],
        correctIndex: 2,
        explanation: "COI charges in IUL increase annually as the insured ages, which is why adequate funding is critical to keep the policy in force long-term.",
      },
    ],
  },
  {
    id: "quiz-vul",
    category: "product",
    title: "VUL Essentials",
    description: "Test your knowledge of Variable Universal Life policies",
    xpReward: 75,
    questions: [
      {
        question: "What license is required to sell Variable Universal Life insurance?",
        options: [
          "State insurance license only",
          "Series 6 or Series 7 plus state insurance license",
          "Series 63 only",
          "No special license beyond life insurance",
        ],
        correctIndex: 1,
        explanation: "VUL is a securities product, so agents must hold a FINRA securities license (Series 6 or 7) in addition to their state life insurance license.",
      },
      {
        question: "What document must be provided to the client before or at the point of VUL sale?",
        options: [
          "A suitability questionnaire",
          "A prospectus",
          "A replacement disclosure form",
          "A financial plan",
        ],
        correctIndex: 1,
        explanation: "Because VUL contains securities (sub-accounts), a prospectus must be delivered to the client, detailing fees, risks, and investment options.",
      },
      {
        question: "How does VUL differ from IUL in terms of downside risk?",
        options: [
          "VUL has a 0% floor like IUL",
          "VUL cash value can lose money due to direct market exposure",
          "VUL guarantees principal protection",
          "There is no difference — both have the same risk profile",
        ],
        correctIndex: 1,
        explanation: "Unlike IUL which has a floor protecting against losses, VUL sub-accounts are directly invested in the market and can lose value.",
      },
      {
        question: "Which type of investor is VUL best suited for?",
        options: [
          "Conservative pre-retirees seeking safety",
          "Risk-averse clients who want guarantees",
          "Aggressive, high-income clients with long time horizons",
          "Clients who need immediate income",
        ],
        correctIndex: 2,
        explanation: "VUL's market exposure and higher growth potential make it most appropriate for aggressive investors who can tolerate volatility and have decades before needing the funds.",
      },
      {
        question: "What are VUL sub-accounts most similar to?",
        options: [
          "Savings accounts",
          "Certificates of deposit",
          "Mutual funds",
          "Fixed annuities",
        ],
        correctIndex: 2,
        explanation: "VUL sub-accounts function like mutual funds, offering diversified investment options across equities, bonds, and money market instruments.",
      },
    ],
  },
  {
    id: "quiz-advanced-sales",
    category: "sales",
    title: "Advanced Closing & Objection Handling",
    description: "Master high-level sales techniques for complex situations",
    xpReward: 100,
    questions: [
      {
        question: "A client says 'My CPA told me annuities are a bad investment.' What is the best response?",
        options: [
          "Tell them their CPA is wrong",
          "Acknowledge the CPA's perspective and reframe annuities as insurance, not investments",
          "Suggest they find a new CPA",
          "Skip the objection and move to the next product",
        ],
        correctIndex: 1,
        explanation: "Respect the trusted advisor relationship. Reframe: 'Your CPA is thinking about this as an investment — and they're right that there are better pure investment vehicles. But we're solving a different problem: guaranteed income you can't outlive.'",
      },
      {
        question: "What is the 'Columbo Close' technique?",
        options: [
          "Presenting the product dramatically like a TV show",
          "Asking one more seemingly casual but powerful question as you're wrapping up",
          "Closing the meeting abruptly to create urgency",
          "Bringing a colleague for a second opinion",
        ],
        correctIndex: 1,
        explanation: "Named after the TV detective, this technique involves casually asking a pivotal question ('Just one more thing...') as the meeting winds down, when the client's guard is lowered.",
      },
      {
        question: "When presenting to a couple where one spouse is skeptical, what should you do?",
        options: [
          "Focus only on the interested spouse",
          "Address the skeptic's concerns directly and make them feel heard",
          "Ask the interested spouse to convince the other privately",
          "Ignore the skepticism and push forward",
        ],
        correctIndex: 1,
        explanation: "Both spouses must be comfortable. Address the skeptic's concerns with empathy and evidence. They often become your strongest advocate once their concerns are resolved.",
      },
      {
        question: "What is the 'takeaway close'?",
        options: [
          "Taking the product brochure away from the client",
          "Suggesting the product might not be right for them, triggering loss aversion",
          "Offering a discount if they commit today",
          "Removing a feature to lower the price",
        ],
        correctIndex: 1,
        explanation: "The takeaway leverages loss aversion: 'Based on your concerns, this might not be the right fit for you.' This often prompts the client to re-engage and articulate why they actually do want it.",
      },
      {
        question: "A client wants to 'shop around' before deciding. What is the best approach?",
        options: [
          "Tell them no other product compares",
          "Encourage comparison but set a specific follow-up date and highlight what to compare",
          "Lower your commission to offer a better deal",
          "Give them a deadline to decide",
        ],
        correctIndex: 1,
        explanation: "Empower the comparison: 'That's smart. When you compare, look at these 3 things: floor protection, income rider roll-up rate, and surrender schedule. Let's reconnect Thursday to discuss what you find.'",
      },
    ],
  },
];

// ─── Guided Modules ─────────────────────────────────────────────

export const TRAINING_MODULES: TrainingModule[] = [
  {
    id: "mod-annuity-101",
    category: "product",
    title: "Annuity Foundations",
    description: "A complete primer on annuity types, mechanics, and use cases",
    duration: "12 min",
    xpReward: 150,
    sections: [
      { title: "What Is an Annuity?", content: "An annuity is a contract between a consumer and an insurance company. The consumer pays a premium (lump sum or over time) in exchange for guaranteed income payments, tax-deferred growth, or both." },
      { title: "Types of Annuities", content: "Fixed Annuities offer guaranteed rates. Fixed Indexed Annuities link growth to market indices with floor protection. Variable Annuities invest in sub-accounts with market risk. Immediate Annuities begin income payments right away." },
      { title: "Who Should Consider an Annuity?", content: "Pre-retirees seeking income guarantees, conservative investors wanting principal protection, high-income earners maximizing tax-deferred savings, and those with longevity concerns." },
      { title: "Key Terms to Know", content: "Surrender Period: the time frame during which early withdrawals incur charges. Free Withdrawal: typically 10% annually. Crediting Strategy: how index gains are calculated. Income Rider: an optional guaranteed income benefit." },
    ],
  },
  {
    id: "mod-discovery-mastery",
    category: "sales",
    title: "Discovery Meeting Mastery",
    description: "Run an effective discovery meeting from opening to close",
    duration: "15 min",
    xpReward: 150,
    sections: [
      { title: "Setting the Stage", content: "The first 90 seconds set the tone. Establish rapport, explain the meeting agenda, and set expectations. Always start with the client's story, not your pitch." },
      { title: "The Art of Questioning", content: "Use open-ended questions to uncover goals: 'What does retirement look like for you?' Follow up with specifics: 'When do you plan to stop working?' Layer emotional questions: 'What would it mean to never worry about outliving your money?'" },
      { title: "Active Listening", content: "Repeat back key concerns. Take notes visibly. Use silence strategically — after asking a question, wait. The client will fill the gap with valuable information." },
      { title: "Building the Recommendation", content: "Summarize what you've learned before presenting. 'Based on what you've told me — your goal of retiring at 65 with $4,000/month in guaranteed income — here's what I'd recommend...' This shows you listened." },
      { title: "The Close", content: "Closing isn't pushing — it's confirming. 'Does this solution address the concerns you shared with me today?' If yes, move to paperwork. If no, revisit the objection." },
    ],
  },
  {
    id: "mod-compliance-essentials",
    category: "compliance",
    title: "Compliance Essentials",
    description: "Stay on the right side of regulations with this compliance guide",
    duration: "10 min",
    xpReward: 150,
    sections: [
      { title: "Why Compliance Matters", content: "Compliance protects you, your clients, and your career. Regulatory violations can result in fines, license suspension, and legal liability. Building compliant habits from day one is non-negotiable." },
      { title: "Suitability Standards", content: "NAIC Model Regulation requires that every recommendation has a reasonable basis. Document the client's financial situation, insurance needs, objectives, risk tolerance, and time horizon BEFORE making any recommendation." },
      { title: "Replacement Rules", content: "When replacing an existing policy or annuity, additional disclosure is required. Compare the old and new products side by side. Document why the new product better serves the client's needs. Check for surrender charges on the existing contract." },
      { title: "Record Keeping", content: "Maintain complete records of all client interactions, recommendations, and disclosures. FinBox automates much of this, but always verify your case files are complete before handoff." },
    ],
  },
  {
    id: "mod-iul-mastery",
    category: "product",
    title: "IUL Product Mastery",
    description: "Deep dive into Indexed Universal Life — mechanics, positioning, and pitfalls",
    duration: "14 min",
    xpReward: 175,
    sections: [
      { title: "IUL vs. Other Permanent Life Products", content: "IUL sits between Whole Life (guaranteed but low growth) and VUL (high growth but market risk). IUL offers index-linked growth with a floor, making it ideal for clients who want upside participation without full market exposure." },
      { title: "How Crediting Works", content: "IUL cash value is credited based on index performance, subject to a cap and floor. If the S&P 500 gains 12% and the cap is 10%, you earn 10%. If the market drops 20%, you earn 0% (the floor). You never directly own the index." },
      { title: "The MEC Trap", content: "Over-funding an IUL can trigger Modified Endowment Contract (MEC) status under IRC §7702A. Once a MEC, policy loans and withdrawals lose their tax-free treatment. Always run a MEC test before recommending high-premium designs." },
      { title: "Policy Loan Strategies", content: "Tax-free policy loans are the crown jewel of IUL. Clients can borrow against cash value in retirement for supplemental income. Fixed loans charge a set rate while the cash value continues earning index credits, potentially creating positive arbitrage." },
      { title: "Common IUL Pitfalls", content: "Illustrated rates ≠ guaranteed rates. Always show clients the guaranteed column. Rising cost of insurance can erode cash value if underfunded. Lapse risk increases significantly if premiums stop too early. Set realistic expectations from day one." },
    ],
  },
  {
    id: "mod-vul-mastery",
    category: "product",
    title: "VUL Product Mastery",
    description: "Understand Variable Universal Life — sub-accounts, licensing, and client suitability",
    duration: "14 min",
    xpReward: 175,
    sections: [
      { title: "What Makes VUL Different", content: "VUL is the only life insurance product that offers direct market exposure through sub-accounts. This means both higher potential returns and real downside risk. It requires securities licensing and prospectus delivery — a higher regulatory bar than other life products." },
      { title: "Sub-Account Selection", content: "VUL sub-accounts are similar to mutual funds, offering equity, bond, international, and money market options. Help clients build a diversified allocation based on their risk tolerance and time horizon. Most carriers offer 30–60 sub-account choices." },
      { title: "Fees and Cost Structure", content: "VUL has multiple fee layers: cost of insurance, administrative charges, sub-account management fees, and optional rider charges. Total annual costs can run 2–4% of cash value. Transparency about fees builds trust and manages expectations." },
      { title: "Suitability and Licensing", content: "VUL requires FINRA Series 6 or Series 7 registration plus a state variable products license. It is only suitable for clients with high risk tolerance, long time horizons, and the financial capacity to absorb potential losses." },
      { title: "When to Recommend VUL vs. IUL", content: "Choose VUL for aggressive accumulators who want full market participation and understand the risks. Choose IUL for moderate-growth clients who prioritize downside protection. If the client can't articulate their comfort with market loss, default to IUL." },
    ],
  },
  {
    id: "mod-advanced-closing",
    category: "sales",
    title: "Advanced Closing Techniques",
    description: "Master sophisticated closing methods for high-value clients",
    duration: "12 min",
    xpReward: 175,
    sections: [
      { title: "Reading Buying Signals", content: "Watch for signals: leaning forward, asking 'what happens next' questions, involving a spouse, calculating mentally. When you see these, stop presenting and start confirming. Over-presenting past the buying signal is the #1 closer mistake." },
      { title: "The Assumptive Close", content: "Proceed as if the decision is made: 'Let's get your application started — do you prefer the 7-year or 10-year option?' This works best when rapport is strong and the client has verbally agreed to the concept." },
      { title: "Handling Spouse Dynamics", content: "In couple meetings, identify the decision-maker and the influencer early. Address both perspectives. Use phrases like 'You both raised great points' to validate. Never let one spouse feel excluded — it guarantees a 'we need to talk about it' stall." },
      { title: "The Takeaway and Scarcity", content: "If a client is waffling, gently suggest the product may not be right: 'Based on what you've shared, this might not be the best fit.' This triggers loss aversion. Alternatively, mention rate-lock deadlines or birthday-based cost increases — but only if genuinely true." },
      { title: "Post-Close Reinforcement", content: "After the signature, reinforce the decision: 'You made a great choice — here's exactly what happens next.' Send a same-day thank-you note. Schedule a 30-day check-in. Buyer's remorse kills deals; proactive reassurance prevents it." },
    ],
  },
];

// ─── Progress helpers ───────────────────────────────────────────

export function getTrainingProgress(): Record<string, { completed: boolean; score?: number; completedAt?: string }> {
  try {
    const raw = localStorage.getItem("finbox_training_progress");
    if (raw) return JSON.parse(raw);
  } catch {}
  return {};
}

export function markTrainingComplete(id: string, score?: number) {
  const progress = getTrainingProgress();
  progress[id] = { completed: true, score, completedAt: new Date().toISOString() };
  localStorage.setItem("finbox_training_progress", JSON.stringify(progress));
}

export const CATEGORY_META: Record<TrainingCategory, { label: string; color: string; description: string }> = {
  product: { label: "Product Knowledge", color: "primary", description: "Master the products you sell" },
  sales: { label: "Sales Skills", color: "accent", description: "Sharpen your client-facing techniques" },
  compliance: { label: "Compliance & Licensing", color: "warning", description: "Stay compliant and informed" },
};
