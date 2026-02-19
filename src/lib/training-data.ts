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
    title: "Immediate Financing Arrangement (IFA)",
    subtitle: "Corporate-owned life insurance for tax-efficient wealth accumulation",
    facts: [
      "Corporate-owned permanent life insurance strategy for CCPCs",
      "Creates Capital Dividend Account (CDA) credits for tax-free shareholder distributions",
      "Net Cost of Pure Insurance (NCPI) provides annual corporate tax deduction",
      "Cash value grows tax-deferred within policy (Adjusted Cost Basis)",
      "Strengthens corporate balance sheet while providing estate liquidity",
      "Primary carriers: Manulife Par, Equitable EquiPar",
    ],
  },
  {
    id: "ref-par-life",
    category: "product",
    title: "Participating Whole Life Insurance",
    subtitle: "Permanent coverage with guaranteed cash values and dividends",
    facts: [
      "Level premiums for life with guaranteed death benefit",
      "Cash value grows with guaranteed minimum plus annual dividends",
      "Dividends based on carrier's investment performance (not guaranteed)",
      "Tax-deferred cash value accumulation within policy",
      "Policy loans available against cash value (typically 6-8% interest)",
      "Ideal for estate planning, wealth transfer, and IFA structures",
    ],
  },
  {
    id: "ref-universal-life",
    category: "product",
    title: "Universal Life Insurance",
    subtitle: "Flexible permanent insurance with investment component",
    facts: [
      "Flexible premiums within minimum/maximum ranges",
      "Cash value grows based on declared interest rates or investment returns",
      "Lower cost than Par Life for same death benefit (initially)",
      "Cost of insurance increases as insured ages",
      "Can be structured for IFAs but less common than Par Life",
      "Requires ongoing monitoring to prevent lapse",
    ],
  },
  {
    id: "ref-cda",
    category: "compliance",
    title: "Capital Dividend Account (CDA)",
    subtitle: "Tax-free dividend distribution mechanism",
    facts: [
      "CDA = Death Benefit - Adjusted Cost Basis (ACB) of policy",
      "CDA balance can be distributed to shareholders tax-free",
      "Corporate death benefit flows tax-free to shareholders via CDA",
      "Key advantage of corporate-owned life insurance",
      "Must file Form T2054 (Election for Capital Dividend) with CRA",
      "CDA planning essential for maximizing IFA benefits",
    ],
  },
  {
    id: "ref-ncpi",
    category: "compliance",
    title: "Net Cost of Pure Insurance (NCPI)",
    subtitle: "Annual tax-deductible corporate expense",
    facts: [
      "NCPI = Cost of term insurance equivalent for death benefit coverage",
      "Deductible as corporate expense under Income Tax Act (ITA)",
      "Reduces corporate taxable income annually",
      "Calculated by carrier, shown on annual policy statements",
      "Increases as insured ages (mortality cost increases)",
      "Key tax benefit of IFA structures for corporations",
    ],
  },
  {
    id: "ref-acb",
    category: "compliance",
    title: "Adjusted Cost Basis (ACB)",
    subtitle: "Tax basis calculation for life insurance policies",
    facts: [
      "ACB = Premiums Paid - Net Cost of Pure Insurance - Policy Gains Withdrawn",
      "Determines taxable portion of policy surrenders or withdrawals",
      "Critical for CDA calculation: CDA = Death Benefit - ACB",
      "Grows as premiums are paid, decreases with NCPI and withdrawals",
      "Shown on annual policy statements from carrier",
      "Essential concept for IFA tax planning",
    ],
  },
  {
    id: "ref-bcfsa",
    category: "compliance",
    title: "BC Financial Services Authority (BCFSA)",
    subtitle: "Provincial insurance regulator for British Columbia",
    facts: [
      "Regulates insurance agents and advisors in BC",
      "Requires suitability documentation for all recommendations",
      "Mandates Errors & Omissions (E&O) insurance",
      "Enforces continuing education requirements (30 hours/2 years)",
      "Handles consumer complaints and licensing discipline",
      "Website: bcfsa.ca for licensing and compliance resources",
    ],
  },
  {
    id: "ref-suitability",
    category: "compliance",
    title: "Suitability Requirements (BC)",
    subtitle: "BCFSA and CLHIA suitability standards",
    facts: [
      "Document client's financial situation, needs, and objectives BEFORE recommendation",
      "Assess risk tolerance with standardized tools",
      "Ensure product features align with client's goals and time horizon",
      "Premium must fit within client's cash flow and budget",
      "Compare existing coverage before replacement recommendations",
      "Maintain complete records of discovery and recommendation rationale",
    ],
  },
  {
    id: "ref-objections",
    category: "sales",
    title: "Common Objections & Responses (IFA)",
    subtitle: "Quick-reference objection handlers for Canadian advisors",
    facts: [
      '"Too expensive" → Reframe as corporate asset vs. expense, show ROI via CDA',
      '"Can\'t access the money" → Explain policy loans and CSV availability',
      '"Dividends aren\'t guaranteed" → Show historical dividend scales, focus on guarantees',
      '"I\'ll just invest in the market" → Compare after-tax returns + death benefit value',
      '"My accountant says no" → Invite accountant to meeting, show tax advantages',
      '"What if I need the money?" → Explain collateral lending and policy loan features',
    ],
  },
  {
    id: "ref-carriers",
    category: "product",
    title: "Major Canadian Carriers",
    subtitle: "Top carriers for IFA and Par Life in Canada",
    facts: [
      "Manulife: Largest carrier, strong dividend history, Par IFA products",
      "Equitable Life: Mutual company, competitive Par rates, EquiPar IFA",
      "Sun Life: Large carrier, comprehensive Par portfolio",
      "Canada Life: Merged with Great-West Life, strong Par presence",
      "All carriers regulated by OSFI (Office of Superintendent of Financial Institutions)",
      "Compare dividend scales, fees, and underwriting when selecting carrier",
    ],
  },
];

// ─── Quizzes ────────────────────────────────────────────────────

export const QUIZZES: Quiz[] = [
  {
    id: "quiz-ifa-basics",
    category: "product",
    title: "IFA Fundamentals",
    description: "Test your knowledge of Immediate Financing Arrangement mechanics",
    xpReward: 75,
    questions: [
      {
        question: "What is the primary tax advantage of an IFA structure for a corporation?",
        options: [
          "Premiums are fully tax-deductible",
          "Creates CDA credits for tax-free shareholder distributions",
          "Cash value grows tax-free (not just tax-deferred)",
          "Death benefit is taxable to the corporation",
        ],
        correctIndex: 1,
        explanation: "The primary advantage is the Capital Dividend Account (CDA) credit created upon death, allowing tax-free distributions to shareholders. The death benefit minus the ACB flows to the CDA.",
      },
      {
        question: "What does NCPI stand for and how does it benefit the corporation?",
        options: [
          "Net Corporate Premium Income - reduces premiums paid",
          "Net Cost of Pure Insurance - provides annual tax deduction",
          "National Canadian Policy Index - benchmarks performance",
          "Non-Convertible Premium Investment - locks in rates",
        ],
        correctIndex: 1,
        explanation: "NCPI is the Net Cost of Pure Insurance - the term insurance equivalent cost. It's deductible as a corporate expense annually, reducing taxable income.",
      },
      {
        question: "How is the CDA credit calculated when the insured dies?",
        options: [
          "Total premiums paid",
          "Cash surrender value at death",
          "Death Benefit minus Adjusted Cost Basis (ACB)",
          "Death Benefit plus all premiums paid",
        ],
        correctIndex: 2,
        explanation: "CDA = Death Benefit - ACB. This represents the insurance portion that can be distributed tax-free to shareholders.",
      },
      {
        question: "Which type of corporation benefits most from an IFA structure?",
        options: [
          "Public corporations",
          "Canadian Controlled Private Corporations (CCPCs)",
          "Non-profit organizations",
          "Foreign corporations",
        ],
        correctIndex: 1,
        explanation: "CCPCs benefit most from IFAs due to their corporate tax structure, retained earnings, and the ability to use CDA for tax-efficient shareholder distributions.",
      },
      {
        question: "What happens to the Adjusted Cost Basis (ACB) as premiums are paid?",
        options: [
          "ACB decreases with each premium",
          "ACB stays constant",
          "ACB increases by premiums paid minus NCPI deducted",
          "ACB is not affected by premiums",
        ],
        correctIndex: 2,
        explanation: "ACB increases with premiums paid but decreases by the NCPI amount deducted annually. This tracks the tax basis of the policy.",
      },
    ],
  },
  {
    id: "quiz-compliance",
    category: "compliance",
    title: "BC Compliance & Suitability",
    description: "Test your knowledge of British Columbia regulatory requirements",
    xpReward: 75,
    questions: [
      {
        question: "What is the continuing education requirement for licensed advisors in BC?",
        options: [
          "15 hours per year",
          "30 hours every 2 years",
          "40 hours every 3 years",
          "No continuing education required",
        ],
        correctIndex: 1,
        explanation: "BCFSA requires 30 hours of approved continuing education every 2 years to maintain an active insurance license in British Columbia.",
      },
      {
        question: "What document must be filed with CRA when distributing a capital dividend?",
        options: [
          "Form T2054 - Election for Capital Dividend",
          "Form T4 - Statement of Remuneration",
          "Form T5 - Statement of Investment Income",
          "Form T3 - Statement of Trust Income",
        ],
        correctIndex: 0,
        explanation: "Form T2054 must be filed with CRA within specific timelines when a corporation elects to pay a capital dividend from its CDA balance.",
      },
      {
        question: "Under BCFSA requirements, when must suitability be documented?",
        options: [
          "Only for high-value cases over $500,000",
          "Only if the client requests it",
          "BEFORE making any product recommendation",
          "After the client signs the application",
        ],
        correctIndex: 2,
        explanation: "Suitability must be assessed and documented BEFORE making any recommendation. This includes financial situation, needs, objectives, and risk tolerance.",
      },
      {
        question: "Which federal body regulates Canadian insurance companies?",
        options: [
          "BCFSA",
          "OSFI (Office of Superintendent of Financial Institutions)",
          "CLHIA",
          "CRA (Canada Revenue Agency)",
        ],
        correctIndex: 1,
        explanation: "OSFI regulates federally incorporated insurance companies in Canada, ensuring financial stability and consumer protection.",
      },
    ],
  },
  {
    id: "quiz-sales",
    category: "sales",
    title: "Discovery & Closing Skills",
    description: "Sharpen your client-facing techniques for Canadian market",
    xpReward: 75,
    questions: [
      {
        question: "When discovering needs for a corporate client, what is the most important first question?",
        options: [
          "How much retained earnings do you have?",
          "What keeps you up at night about your business succession?",
          "Do you want to maximize CDA credits?",
          "What's your current corporate tax rate?",
        ],
        correctIndex: 1,
        explanation: "Open-ended questions about concerns and goals build rapport and reveal true motivations before diving into financial details.",
      },
      {
        question: "A business owner says 'My accountant thinks insurance is too expensive.' What should you do?",
        options: [
          "Tell them their accountant is wrong",
          "Invite the accountant to the next meeting and show the numbers",
          "Skip the IFA and recommend a different product",
          "Lower your commission to reduce the cost",
        ],
        correctIndex: 1,
        explanation: "Accountants are trusted advisors. Collaborate, not compete. Show the accountant the tax benefits (NCPI deduction, CDA credits) and the numbers usually speak for themselves.",
      },
      {
        question: "What is the 'feel, felt, found' technique?",
        options: [
          "A medical examination process",
          "An empathy-based objection handling framework",
          "A financial planning methodology",
          "A tax calculation formula",
        ],
        correctIndex: 1,
        explanation: "'I understand how you feel. Other business owners felt the same way. What they found was...' — this validates concerns while introducing new perspectives.",
      },
      {
        question: "When presenting IFA benefits, which should you emphasize first?",
        options: [
          "The commission structure",
          "The insurance company's history",
          "How it solves the client's specific pain points",
          "The product features and riders",
        ],
        correctIndex: 2,
        explanation: "Always lead with benefits that solve the client's stated needs. Features and company details support the solution but aren't the hook.",
      },
    ],
  },
  {
    id: "quiz-par-life",
    category: "product",
    title: "Participating Whole Life Mechanics",
    description: "Test your understanding of Par Life insurance products",
    xpReward: 75,
    questions: [
      {
        question: "What are participating dividends in Par Life insurance?",
        options: [
          "Guaranteed annual payments to policyholders",
          "Distributions of insurer's surplus based on performance (not guaranteed)",
          "Interest payments on cash value",
          "Tax refunds from CRA",
        ],
        correctIndex: 1,
        explanation: "Participating dividends are distributions of the insurer's surplus to policyholders. They're based on mortality, investment, and expense experience but are NOT guaranteed.",
      },
      {
        question: "How can policyholders use Par Life dividends?",
        options: [
          "Only cash withdrawal",
          "Only premium reduction",
          "Cash, reduce premiums, buy paid-up additions, or accumulate with interest",
          "Dividends must stay in the policy",
        ],
        correctIndex: 2,
        explanation: "Policyholders have flexibility: take cash, reduce premiums, purchase paid-up additional insurance, or leave to accumulate with interest.",
      },
      {
        question: "What is a policy loan in the context of Par Life?",
        options: [
          "A loan from a bank using the policy as collateral",
          "A loan from the insurance company against the policy's cash value",
          "A government-backed loan program",
          "A premium financing arrangement",
        ],
        correctIndex: 1,
        explanation: "A policy loan is borrowed directly from the insurance company, secured by the policy's cash value. Interest rates are typically 6-8% and the loan reduces the death benefit if not repaid.",
      },
      {
        question: "Why is Par Life preferred over Universal Life for IFA structures?",
        options: [
          "Par Life has lower premiums",
          "Par Life has more guaranteed cash value growth and stability",
          "Universal Life is not allowed for corporations",
          "Par Life has higher death benefits",
        ],
        correctIndex: 1,
        explanation: "Par Life's guaranteed cash values and stable dividend history make it more predictable for long-term IFA planning. Universal Life's variable costs can be harder to manage.",
      },
      {
        question: "What happens to cash value in a Par Life policy when the insured dies?",
        options: [
          "Cash value is paid to beneficiaries in addition to death benefit",
          "Cash value is forfeited to the insurance company",
          "Cash value is included in the death benefit paid out",
          "Cash value is taxable to the estate",
        ],
        correctIndex: 2,
        explanation: "The death benefit includes the cash value - you don't get both separately. For corporations, the death benefit creates the CDA credit for tax-free distribution.",
      },
    ],
  },
  {
    id: "quiz-tax-planning",
    category: "compliance",
    title: "Canadian Tax Planning for IFAs",
    description: "Master the tax concepts critical to IFA recommendations",
    xpReward: 100,
    questions: [
      {
        question: "Under the Income Tax Act, which portion of life insurance premiums is deductible for corporations?",
        options: [
          "All premiums are fully deductible",
          "Only the NCPI (Net Cost of Pure Insurance) portion",
          "No portion of premiums is deductible",
          "Only premiums for term insurance, not permanent",
        ],
        correctIndex: 1,
        explanation: "Only the NCPI portion is deductible - this represents the term insurance cost. The cash value accumulation portion (CSV premium) is not deductible.",
      },
      {
        question: "How are policy loans taxed when taken from corporate-owned life insurance?",
        options: [
          "Taxed as ordinary income to the corporation",
          "Not taxable - loans are not considered income",
          "Taxed at capital gains rates",
          "Only the interest is taxable",
        ],
        correctIndex: 1,
        explanation: "Policy loans are not taxable events. They're borrowings secured by the cash value, not income. Interest paid on the loan may be deductible if used for business purposes.",
      },
      {
        question: "What is the corporate tax rate advantage of using an IFA in BC for CCPCs?",
        options: [
          "NCPI deduction reduces active business income subject to lower rate",
          "IFAs eliminate all corporate taxes",
          "Insurance companies pay the taxes instead",
          "There is no tax advantage, only estate benefits",
        ],
        correctIndex: 0,
        explanation: "The NCPI deduction reduces the corporation's active business income, which may be taxed at the lower CCPC small business rate (around 11% federally + provincial).",
      },
      {
        question: "A corporation has $2M death benefit and $500K ACB. What is the CDA credit?",
        options: [
          "$2,000,000",
          "$500,000",
          "$1,500,000",
          "$2,500,000",
        ],
        correctIndex: 2,
        explanation: "CDA = Death Benefit - ACB = $2,000,000 - $500,000 = $1,500,000. This amount can be distributed tax-free to shareholders.",
      },
      {
        question: "When is the best time to distribute a capital dividend to shareholders?",
        options: [
          "Immediately after receiving the death benefit",
          "Within the corporation's fiscal year after death",
          "Anytime - there's no time limit",
          "Before the death benefit is received",
        ],
        correctIndex: 1,
        explanation: "While the CDA balance doesn't expire, strategic timing within the fiscal year can optimize tax planning. Form T2054 must be filed before or when the dividend is paid. Consult with the client's accountant for optimal timing.",
      },
    ],
  },
  {
    id: "quiz-advanced-ifa",
    category: "product",
    title: "Advanced IFA Strategies",
    description: "Master complex IFA structures and planning scenarios",
    xpReward: 100,
    questions: [
      {
        question: "What is a '10/8 arrangement' in IFA planning?",
        options: [
          "10-year premium payment with 8% guaranteed return",
          "Borrow at 10% to fund premiums, earn 8% in policy (arbitrage strategy)",
          "10 years of NCPI deductions, 8 years of CDA accumulation",
          "Premium financing: borrow at ~3-4% while policy earns ~5-6% (positive spread)",
        ],
        correctIndex: 3,
        explanation: "A 10/8 (or similar) arrangement involves borrowing to pay premiums at a lower rate than the policy's expected return, creating leverage. The name varies by interest rate environment.",
      },
      {
        question: "For a 55-year-old business owner, what IFA structure is most common?",
        options: [
          "Term to age 65 only",
          "Immediate Financing with 10-pay Par Life",
          "Pay-to-age-65 Par or 20-year pay Par",
          "Universal Life with minimum funding",
        ],
        correctIndex: 2,
        explanation: "At age 55, a pay-to-65 or 20-pay structure balances premium affordability with cash value accumulation before typical retirement/succession age.",
      },
      {
        question: "How does an IFA strengthen a corporation's balance sheet?",
        options: [
          "By reducing liabilities through debt paydown",
          "By creating a liquid asset (CSV) that shows on financial statements",
          "By eliminating accounts receivable",
          "IFAs don't affect the balance sheet",
        ],
        correctIndex: 1,
        explanation: "The cash surrender value (CSV) is a corporate asset that appears on the balance sheet, improving financial ratios and potentially helping with credit applications.",
      },
      {
        question: "What is 'collateral lending' in the context of IFAs?",
        options: [
          "Using the CSV as security for a bank loan to access funds",
          "Lending money to other policyholders",
          "Using real estate as collateral for premium financing",
          "A type of reinsurance arrangement",
        ],
        correctIndex: 0,
        explanation: "Collateral lending involves using the policy's CSV as security for a bank loan, often at rates lower than policy loan rates, providing flexible access to capital.",
      },
      {
        question: "In a shareholder/spouse scenario, who should be the insured in an IFA?",
        options: [
          "Always the majority shareholder",
          "Always the oldest person",
          "The person whose death creates the greatest financial impact/need",
          "Both on a joint-first-to-die policy always",
        ],
        correctIndex: 2,
        explanation: "Insure the person whose death creates the greatest need - this could be the key shareholder, rainmaker, or technical expert. Sometimes joint policies or separate policies on each make sense.",
      },
    ],
  },
];

// ─── Guided Modules ─────────────────────────────────────────────

export const TRAINING_MODULES: TrainingModule[] = [
  {
    id: "mod-ifa-101",
    category: "product",
    title: "IFA Foundations",
    description: "A complete primer on Immediate Financing Arrangements for Canadian corporations",
    duration: "15 min",
    xpReward: 150,
    sections: [
      { title: "What Is an IFA?", content: "An Immediate Financing Arrangement is a strategy where a Canadian Controlled Private Corporation (CCPC) purchases permanent life insurance on a key person (typically the owner or key executive). The structure creates three distinct tax advantages: annual NCPI deductions, tax-deferred cash value growth, and Capital Dividend Account (CDA) credits upon death for tax-free distributions to shareholders." },
      { title: "The Three Pillars of IFA Benefits", content: "1) NCPI Deduction: The Net Cost of Pure Insurance is deductible annually, reducing corporate taxable income. 2) Tax-Deferred Growth: Cash value accumulates within the policy without annual taxation. 3) CDA Credits: Upon death, the death benefit minus ACB creates a CDA credit, allowing tax-free capital dividend payments to shareholders — the ultimate estate planning benefit." },
      { title: "Who Should Consider an IFA?", content: "Ideal clients include: CCPCs with retained earnings seeking tax-efficient deployment of capital, business owners age 40-65 planning for succession/estate, corporations wanting to strengthen their balance sheet with liquid assets, and shareholders seeking to maximize after-tax estate value for beneficiaries." },
      { title: "Key Terminology", content: "NCPI = Net Cost of Pure Insurance (tax-deductible portion). ACB = Adjusted Cost Basis (premiums paid minus NCPI deducted). CDA = Capital Dividend Account (death benefit minus ACB). CSV = Cash Surrender Value (living benefit/corporate asset). ITA = Income Tax Act (federal tax legislation)." },
    ],
  },
  {
    id: "mod-discovery-mastery",
    category: "sales",
    title: "Corporate Client Discovery",
    description: "Run an effective discovery meeting with business owners",
    duration: "15 min",
    xpReward: 150,
    sections: [
      { title: "Setting the Stage", content: "Corporate discovery differs from personal insurance discovery. Start by understanding the business: industry, revenue, profitability, number of shareholders. Then pivot to personal: succession plans, estate goals, family involvement in business, retirement timeline. Position yourself as a strategic advisor, not just an insurance salesperson." },
      { title: "The Power Questions for IFAs", content: "1) 'What happens to the business if you're not here tomorrow?' 2) 'How much are you currently paying in corporate taxes on retained earnings?' 3) 'Have you thought about how to get money out of the corporation tax-efficiently?' 4) 'What does your exit strategy look like in 10-15 years?' These questions uncover pain points IFAs solve." },
      { title: "Involving the Accountant", content: "Never compete with the accountant — collaborate. Ask: 'Who does your corporate tax planning?' Request permission to loop them in. Most accountants appreciate advisors who understand CDA, NCPI, and ACB. Send a one-page summary before the meeting showing the tax mechanics. An accountant's endorsement accelerates the sale." },
      { title: "Building the IFA Recommendation", content: "Summarize findings: 'You mentioned succession planning, reducing corporate tax, and maximizing what your family receives. Based on your $X retained earnings, age XX, and goals, I recommend a $X Par Life policy structured as an IFA. Here's how it works...' Tie every feature to a stated need." },
      { title: "The Corporate Close", content: "Corporate decisions take longer — there are multiple stakeholders. Secure agreement in principle, then schedule a follow-up with shareholders/accountant/lawyer. Provide a one-page executive summary they can review. Set a specific next meeting date before you leave. Persistence with professionalism wins corporate business." },
    ],
  },
  {
    id: "mod-compliance-bc",
    category: "compliance",
    title: "BC Compliance Essentials",
    description: "Navigate British Columbia insurance regulations and BCFSA requirements",
    duration: "12 min",
    xpReward: 150,
    sections: [
      { title: "BCFSA Licensing Requirements", content: "All insurance advisors in BC must be licensed through BCFSA. Requirements include: passing the LLQP exam, 30 hours continuing education every 2 years, maintaining Errors & Omissions insurance, and completing annual compliance audits if required. BCFSA has authority to suspend licenses for violations." },
      { title: "Suitability Standards", content: "BC follows the Canadian Council of Insurance Regulators (CCIR) suitability framework. You must document: financial situation, insurance needs, risk tolerance, time horizon, and product understanding BEFORE recommending. For IFAs, also document corporate structure, retained earnings, and business succession plans. Keep detailed notes in FinBox." },
      { title: "Privacy and Confidentiality", content: "PIPEDA (Personal Information Protection and Electronic Documents Act) governs client data. Obtain consent before collecting information, store data securely, only share with authorized parties (e.g., underwriters), and never discuss client details publicly. FinBox encrypts all client data — but physical documents must also be secured." },
      { title: "Anti-Money Laundering (AML)", content: "Life insurance can be used for money laundering. Red flags include: large premiums paid in cash, frequent policy changes, lack of concern about fees/surrender charges, reluctance to provide information. Follow your company's AML policy and report suspicious transactions to FINTRAC." },
      { title: "Replacement Disclosures", content: "When replacing existing coverage, disclose: surrender charges on old policy, loss of benefits/riders, new contestability period, comparison of premiums and death benefits. Provide written disclosure and obtain client signature acknowledging the comparison. Poor replacement documentation is a top cause of complaints." },
    ],
  },
  {
    id: "mod-par-life-mastery",
    category: "product",
    title: "Participating Whole Life Mastery",
    description: "Deep dive into Par Life — the foundation of most IFA structures",
    duration: "14 min",
    xpReward: 175,
    sections: [
      { title: "Par Life vs. Universal Life", content: "Par Life offers guaranteed cash values and death benefits with level premiums for life. Universal Life has flexible premiums but variable costs and less predictability. For IFAs, Par Life is preferred because: 1) Predictable long-term cash value growth for balance sheet planning, 2) Stable dividend history from mutual carriers, 3) Less risk of policy lapse due to rising COI charges." },
      { title: "Understanding Dividend Scales", content: "Participating dividends are NOT guaranteed but have strong historical track records. Manulife and Equitable have paid dividends for 100+ years. Dividends reflect three factors: mortality experience (death claims), investment returns, and operating expenses. Compare carriers' 20-year dividend history, not just current rates. Illustrations show 'current' and 'guaranteed' columns — always review both." },
      { title: "Policy Loan Mechanics", content: "Policy loans from Canadian carriers typically charge 6-8% interest. The loan reduces the death benefit if not repaid. For IFAs, policy loans provide corporate access to CSV without triggering taxation. Interest may be tax-deductible if used for business purposes. Collateral lending (bank loan using CSV as security) often provides lower rates than direct policy loans." },
      { title: "Paid-Up Additions (PUAs)", content: "Dividends can purchase Paid-Up Additions — small chunks of additional insurance that require no further premiums. PUAs increase both death benefit and cash value. For IFAs, reinvesting dividends in PUAs accelerates cash value growth and maximizes eventual CDA credits. This is the most common dividend option for corporate-owned policies." },
      { title: "Premium Structures: 10-Pay, 20-Pay, Pay-to-65", content: "Shorter pay periods build cash value faster but require higher annual premiums. 10-pay: Premium paid for 10 years, policy is fully paid up. 20-pay: Balanced approach, common for ages 45-55. Pay-to-65: Spreads cost over working years, ideal for younger business owners. Match premium structure to client's cash flow and retirement timeline." },
    ],
  },
  {
    id: "mod-tax-strategies",
    category: "compliance",
    title: "Advanced Tax Strategies for IFAs",
    description: "Master CDA planning, NCPI optimization, and integration with accountants",
    duration: "16 min",
    xpReward: 200,
    sections: [
      { title: "Maximizing NCPI Deductions", content: "NCPI increases with age and death benefit amount. To maximize deductions: 1) Structure IFAs when client is younger (lower NCPI initially, grows over time), 2) Consider increasing death benefit through term insurance riders in early years, 3) Coordinate with accountant to optimize timing of deductions against corporate income. NCPI is shown on annual policy statements from the carrier." },
      { title: "CDA Planning at Death", content: "When the insured dies: 1) Corporation receives death benefit tax-free, 2) Death benefit minus ACB is added to CDA, 3) Corporation files Form T2054 to elect capital dividend, 4) CDA dividend is paid to shareholders tax-free. Timing matters: work with estate accountant to coordinate with final tax returns and estate settlement. CDA dividends must be declared before payment." },
      { title: "Integrating with Corporate Tax Planning", content: "IFAs complement other corporate tax strategies: 1) Income splitting: CDA dividends can be paid to family member shareholders tax-free, 2) Estate equalization: Life insurance can equalize estates when one child gets the business, 3) Shareholder agreement funding: Death benefit can fund buy-sell agreements. Present IFAs as part of holistic corporate tax plan, not standalone product." },
      { title: "Policy Loans and Tax Deductibility", content: "Policy loan interest may be tax-deductible if: 1) Loan proceeds used for income-earning purposes (business operations, investments), 2) Proper documentation of use maintained, 3) Reasonable expectation of income from use of borrowed funds. NOT deductible if used for personal purposes. Always advise clients to consult their accountant before taking policy loans." },
      { title: "Succession Planning with IFAs", content: "IFAs are powerful succession tools: 1) Provides estate liquidity to pay taxes on deemed disposition of shares, 2) Funds buy-sell agreements between shareholders, 3) Equalizes estates when passing business to one child, 4) Creates cash for surviving spouse/beneficiaries without forcing sale of business. Position IFAs as business continuity planning, not just insurance." },
    ],
  },
  {
    id: "mod-advanced-closing",
    category: "sales",
    title: "Advanced Closing Techniques for IFAs",
    description: "Master sophisticated closing methods for high-value corporate clients",
    duration: "14 min",
    xpReward: 175,
    sections: [
      { title: "Reading Corporate Buying Signals", content: "Watch for: CFO/accountant asking detailed tax questions, questions about premium financing options, discussion of shareholder approval process, requests for proposal to share with board/partners. When you see these, stop presenting and start confirming next steps. Corporate sales have longer cycles — buying signals appear weeks before closing." },
      { title: "The Three-Meeting Close", content: "Meeting 1: Discovery + education on IFA concepts. Meeting 2: Present recommendation with accountant present, address tax questions. Meeting 3: Application and underwriting. Don't rush to close in Meeting 1 — corporate decisions require consensus. Your goal in Meeting 1 is securing Meeting 2 with the accountant." },
      { title: "Handling Accountant Objections", content: "Common accountant objections: 1) 'Premiums are too high' → Show after-tax cost after NCPI deduction. 2) 'Return on CSV is too low' → Compare to GICs/corporate investments AFTER tax, plus death benefit value. 3) 'Too complex' → Offer to present to their other business clients (get referrals). Most accountant objections stem from lack of understanding — educate, don't argue." },
      { title: "The Premium Financing Close", content: "For clients concerned about cash flow: 'What if the bank funded the premiums and the policy paid for itself through NCPI deductions and dividend growth?' Premium financing can make large IFAs feasible. Partner with lenders who understand IFA structures. This transforms objection ('can't afford $200K/year') into solution ('bank pays initially, policy self-funds')." },
      { title: "Post-Close Reinforcement", content: "After application: 1) Send thank-you note to client AND accountant, 2) Provide timeline for underwriting and policy delivery, 3) Schedule annual policy review in calendar, 4) Add to client newsletter list. IFA clients are relationship clients — they'll refer other business owners if you stay top-of-mind. Annual reviews are your best prospecting tool." },
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
  product: { label: "Product Knowledge", color: "primary", description: "Master Canadian IFA and Par Life products" },
  sales: { label: "Sales Skills", color: "accent", description: "Sharpen your corporate client techniques" },
  compliance: { label: "Compliance & Tax", color: "warning", description: "Navigate BC regulations and CRA tax rules" },
};
