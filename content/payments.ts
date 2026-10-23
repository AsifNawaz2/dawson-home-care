// content/payments.ts — /paying-for-care: Payment Explorer (07 §6), "Narrow it down"
// helper, free local help, and the "Questions to ask any agency" checklist.
// Copy is final (COPY_COST_FAQ.md). Public-program facts were checked on the date
// in each `checked` field — re-check them before launch.

import { type Block, type Link, pending } from "./blocks";

export type PaymentId =
  "private-pay" | "ltc-insurance" | "va-benefits" | "medicaid-waivers" | "medicare";

export type DawsonStance = {
  /** true = Dawson accepts / works with it · false = no · null = unknown */
  accepts: boolean | null;
  confirmed: boolean;
  /** Chip on the tab and in the panel. Words + icon, never color alone. */
  chip: string;
  text: Block[];
};

export type PaymentRoute = { title: string; body: Block[]; link?: Link };

export type PaymentOption = {
  id: PaymentId;
  /** Panel anchor: /paying-for-care#{anchor} opens this tab. */
  anchor: string;
  /** Tab / accordion label. */
  tab: string;
  /** Panel heading (H3). */
  title: string;
  /** One line under the title. */
  summary: string;
  whatItIs: Block[];
  howItWorks: Block[];
  /** VA only: two side-by-side cards. */
  routes?: PaymentRoute[];
  /** Medicare only: home care vs home health table. */
  comparison?: {
    caption: string;
    columns: [string, string];
    rows: { label: string; values: [string, string] }[];
  };
  goodToKnow: Block[];
  dawson: DawsonStance;
  learnMore: Link[];
  cta: Link;
  /** False while any Pending block or unconfirmed Dawson stance remains. */
  confirmed: boolean;
};

const CHECKED = "2026-10-19";

export const paymentOptions: PaymentOption[] = [
  {
    id: "private-pay",
    anchor: "pay-private",
    tab: "Private pay",
    title: "Private pay",
    summary: "Paying for care yourself. Simple, flexible and no waiting lists.",
    whatItIs: [
      "You pay for care yourself — from savings, income or retirement money, or with help from family.",
    ],
    howItWorks: [
      {
        list: [
          "You choose the help, the hours and the schedule. There are no approvals or waiting lists.",
          "You pay for the hours of care your loved one gets.",
          "You can add or cut hours as needs change.",
          "Some families share the cost between brothers and sisters.",
        ],
      },
      pending("[[TO CONFIRM: how often Dawson bills — e.g. weekly or every two weeks]]"),
    ],
    goodToKnow: [
      "Some families can count part of the cost of care as a medical expense on their taxes. The rules are strict, so ask a tax professional.",
      "Private pay can also fill the gaps: many families use it alongside insurance or benefits that cover only some hours.",
    ],
    dawson: {
      accepts: null,
      confirmed: false,
      chip: "Ask us",
      text: [
        "Ask us. We'll explain your rate and how billing works at your free visit, before care begins.",
        pending("[[TO CONFIRM: payment methods Dawson accepts — e.g. check, card, bank transfer]]"),
      ],
    },
    learnMore: [],
    cta: {
      label: "Talk it through at your free assessment",
      href: "/free-assessment?pay=private-pay",
    },
    confirmed: false,
  },

  {
    id: "ltc-insurance",
    anchor: "pay-ltc",
    tab: "Long-term care insurance",
    title: "Long-term care insurance",
    summary: "A private policy that may pay toward care at home.",
    whatItIs: [
      "A private insurance policy, usually bought years earlier, that helps pay for care when someone needs help with daily life. Many policies cover care at home.",
    ],
    howItWorks: [
      {
        list: [
          "The policy starts paying once your loved one needs help with everyday tasks — often two or more, like bathing and dressing — or has serious memory problems.",
          'There\'s usually a waiting period first, often 30, 60 or 90 days. You pay for care during that time. (Insurers call this the "elimination period.")',
          "After that, the policy pays up to a daily or monthly limit.",
          "Some policies pay you back after you've paid for care. Others pay the agency directly.",
          "The insurer usually asks for a care plan and records of the care given.",
        ],
      },
    ],
    goodToKnow: [
      "Find the policy and call the insurer early — before care starts if you can. Ask four things: what starts the benefits, how long the waiting period is, what the daily or monthly limit is, and whether care from a home care agency is covered.",
    ],
    dawson: {
      accepts: null,
      confirmed: false,
      chip: "Ask us",
      text: [
        "Ask us. Bring the policy, or the insurer's phone number, to your free visit and we'll go through it with you.",
        pending(
          "[[TO CONFIRM: does Dawson work with long-term care insurance — e.g. provide care notes and invoices for claims, or bill the insurer directly?]]",
        ),
      ],
    },
    learnMore: [],
    cta: {
      label: "Talk it through at your free assessment",
      href: "/free-assessment?pay=ltc-insurance",
    },
    confirmed: false,
  },

  {
    id: "va-benefits",
    anchor: "pay-va",
    tab: "VA benefits",
    title: "VA benefits",
    summary: "Help for Veterans, and some surviving spouses, who need care at home.",
    whatItIs: [
      "Veterans — and in some cases their surviving spouses — may get help paying for care at home. There are two main routes.",
    ],
    routes: [
      {
        title: "Aid and Attendance (or Housebound)",
        body: [
          "Extra money added to a monthly VA pension. It's for Veterans and survivors who need another person's help with daily activities like bathing, eating and dressing, or who spend most of their time at home because of a permanent disability.",
          "You must qualify for a VA pension first. The money is paid to the Veteran or survivor, who can use it toward care.",
        ],
        link: {
          label: "Aid and Attendance on VA.gov",
          href: "https://www.va.gov/pension/aid-attendance-housebound/",
          site: "va.gov",
          checked: CHECKED,
        },
      },
      {
        title: "Homemaker and Home Health Aide care",
        body: [
          "For Veterans enrolled in VA health care who need help with daily activities. The VA approves the help and the hours, and the care comes from an agency that has an agreement with the VA.",
          "To start, talk to your VA care team or a VA social worker.",
        ],
        link: {
          label: "Homemaker and Home Health Aide care on VA.gov",
          href: "https://www.va.gov/GERIATRICS/pages/Homemaker_and_Home_Health_Aide_Care.asp",
          site: "va.gov",
          checked: CHECKED,
        },
      },
    ],
    howItWorks: [
      {
        list: [
          "Aid and Attendance: you apply to the VA, and a doctor fills in part of the form. Decisions can take time, so apply early.",
          "Homemaker and Home Health Aide care: the VA decides how many hours it will cover and which agency provides the care.",
        ],
      },
    ],
    goodToKnow: [
      "Your county Veterans Affairs office can help you apply. You shouldn't have to pay anyone to help you file for VA benefits.",
    ],
    dawson: {
      accepts: null,
      confirmed: false,
      chip: "Ask us",
      text: [
        "Ask us. We'll talk through which VA route might fit your family.",
        pending(
          "[[TO CONFIRM: is Dawson a VA community care provider for Homemaker and Home Health Aide care? Do families use Aid and Attendance to pay Dawson?]]",
        ),
      ],
    },
    learnMore: [], // route cards carry the VA.gov links
    cta: {
      label: "Talk it through at your free assessment",
      href: "/free-assessment?pay=va-benefits",
    },
    confirmed: false,
  },

  {
    id: "medicaid-waivers",
    anchor: "pay-medicaid",
    tab: "Medicaid waivers",
    title: "Medicaid waivers",
    summary: "South Carolina Medicaid programs that pay for help at home.",
    whatItIs: [
      "Medicaid is health coverage for people with limited income and savings. In South Carolina, a Medicaid program called the Community Choices waiver can pay for help at home for people who would otherwise need a nursing home.",
    ],
    howItWorks: [
      {
        list: [
          "It's run by the South Carolina Department of Health and Human Services (SCDHHS).",
          "Your loved one must qualify for Medicaid and need the level of care a nursing home gives.",
          "A case manager looks at their needs and sets up services — like personal care, companion care and respite.",
          "There can be a waiting list, so start early and ask about it when you call.",
          "To start, call SCDHHS at (888) 971-1637 or make a referral online.",
        ],
      },
    ],
    goodToKnow: [
      "Waiver care comes from agencies approved as Medicaid providers. Ask any agency whether it is one.",
      '"Waiver" just means the state can pay for care at home instead of in a nursing home. It isn\'t something you sign away.',
    ],
    dawson: {
      accepts: null,
      confirmed: false,
      chip: "Ask us",
      text: [
        "Ask us. We'll help you understand whether Medicaid might fit your situation.",
        pending(
          "[[TO CONFIRM: is Dawson an approved SC Medicaid waiver provider (Community Choices)? If yes, which services?]]",
        ),
      ],
    },
    learnMore: [
      {
        label: "SC Medicaid waiver programs (SCDHHS)",
        href: "https://scdhhs.sc.gov/resources/waivers",
        site: "scdhhs.sc.gov",
        checked: CHECKED,
      },
      {
        label: "Make a referral online (SCDHHS)",
        href: "https://phoenix.scdhhs.gov/cltc_referrals/new",
        site: "scdhhs.gov",
        checked: CHECKED,
      },
      { label: "Call SCDHHS: (888) 971-1637", href: "tel:+18889711637", checked: CHECKED },
    ],
    cta: {
      label: "Talk it through at your free assessment",
      href: "/free-assessment?pay=medicaid-waivers",
    },
    confirmed: false,
  },

  {
    id: "medicare",
    anchor: "pay-medicare",
    tab: "Medicare",
    title: "Medicare usually doesn't pay for non-medical home care",
    summary: "Here's what Medicare does cover at home — and what it doesn't.",
    whatItIs: [
      "Medicare is health insurance for people 65 and older, and some younger people with disabilities. It pays for medical care — including some short-term care at home, called home health.",
    ],
    howItWorks: [
      "Medicare does pay for home health. That's part-time nursing or therapy at home for someone who has trouble leaving home, after a doctor or other provider confirms it's needed. A home health aide may help with bathing too — but only while nursing or therapy is also happening.",
      "Medicare doesn't pay for:",
      {
        list: [
          "Care 24 hours a day",
          "Help with bathing, dressing or using the bathroom, when that's the only help needed",
          "Shopping, cleaning and other homemaker help that isn't part of a home health plan",
        ],
      },
      "That's the kind of help we give, so most families pay for home care another way.",
    ],
    comparison: {
      caption: "Home care and home health, side by side",
      columns: ["Home care (what we do)", "Home health"],
      rows: [
        { label: "Who provides it", values: ["Caregivers", "Nurses and therapists"] },
        {
          label: "What it covers",
          values: [
            "Bathing, dressing, meals, housekeeping, company, medication reminders",
            "Wound care, injections, therapy, medical treatment",
          ],
        },
        { label: "How it starts", values: ["You call us", "Usually a doctor's order"] },
        { label: "Paid by Medicare?", values: ["Usually not", "Often, for people who qualify"] },
      ],
    },
    goodToKnow: [
      "A small number of Medicare Advantage plans include a limited in-home support benefit. Check your plan's benefits or call the number on the member card.",
      "Many families use both: Medicare-covered home health for the medical side, and home care for everyday help. We're happy to work alongside your home health team.",
    ],
    dawson: {
      accepts: false,
      confirmed: true,
      chip: "Usually not covered",
      text: [
        "Our care is non-medical, so Medicare generally won't pay for it. Ask us about the other ways families pay.",
      ],
    },
    learnMore: [
      {
        label: "Home health services on Medicare.gov",
        href: "https://www.medicare.gov/coverage/home-health-services",
        site: "medicare.gov",
        checked: CHECKED,
      },
    ],
    cta: { label: "Ask us about other ways to pay", href: "/free-assessment?pay=medicare" },
    confirmed: true,
  },
];

// ── "Not sure where to start?" helper (sits above the tabs) ────────────────────
// Ticks stay in the browser. Never saved or sent (09 §2 — collect the minimum).

export type NarrowDownOption = { id: string; label: string; points: PaymentId };

export const narrowDown = {
  heading: "Not sure where to start?",
  instruction: "Tick any that are true. We'll point you to the options worth a look.",
  options: [
    { id: "nd-ltc", label: "They have a long-term care insurance policy", points: "ltc-insurance" },
    {
      id: "nd-va",
      label: "They served in the military, or are the surviving spouse of a Veteran",
      points: "va-benefits",
    },
    {
      id: "nd-medicaid",
      label: "They have Medicaid, or very limited income and savings",
      points: "medicaid-waivers",
    },
    { id: "nd-medicare", label: "They have Medicare", points: "medicare" },
  ] satisfies NarrowDownOption[],
  /** Chip added to matching tabs. */
  matchChip: "Worth a look",
  /** {options} = matching tab names joined with commas and "and". */
  result:
    "Worth a look: {options}. Many families also pay privately for some or all of their care.",
  privacy: "Your answers stay on this page. We don't save or send them.",
};

// ── Free help nearby (below the explorer) ──────────────────────────────────────

export type FreeHelp = {
  name: string;
  body: string;
  phone?: { label: string; href: string };
  link?: Link;
  checked: string;
};

export const freeHelp: FreeHelp[] = [
  {
    name: "Lowcountry Area Agency on Aging",
    body: "Free information and help with services for people 60 and older in Beaufort, Colleton, Hampton and Jasper counties.",
    phone: { label: "(843) 473-3991", href: "tel:+18434733991" },
    link: {
      label: "Lowcountry Area Agency on Aging",
      href: "https://lowcountrycog.org/aging_and_disability_resources/",
      site: "lowcountrycog.org",
      checked: CHECKED,
    },
    checked: CHECKED,
  },
  {
    name: "Your county Veterans Affairs office",
    body: "Free help applying for VA benefits, including Aid and Attendance.",
    checked: CHECKED,
  },
];

// ── "Questions to ask any agency" checklist ───────────────────────────────────

export type AgencyQuestionGroup = "license" | "caregivers" | "care" | "cost";

export type AgencyQuestion = {
  id: string;
  group: AgencyQuestionGroup;
  question: string;
  why: string;
  /** Shown under "Our answer" when "Show Dawson's answers" is on. */
  ourAnswer: Block[];
  confirmed: boolean;
};

export const agencyQuestionGroups: Record<AgencyQuestionGroup, string> = {
  license: "License and insurance",
  caregivers: "Caregivers",
  care: "Care and communication",
  cost: "Cost and paperwork",
};

/** Shown when "Show Dawson's answers" is on and no production-visible answer block exists. */
export const ourAnswerFallback = "Ask us — we'll answer this on the phone or at your free visit.";

export const agencyQuestions: AgencyQuestion[] = [
  {
    id: "aq-licensed",
    group: "license",
    question: "Are you licensed and insured? Can I see proof?",
    why: "You can check a license number yourself, and an insurance certificate shows what's covered if someone gets hurt.",
    ourAnswer: [
      "Yes. We're licensed in South Carolina and insured.",
      pending(
        "License number: [[TO CONFIRM: SC license number]]. Insurance: [[TO CONFIRM: coverage types]].",
      ),
      pending(
        '[[TO CONFIRM — draft: "Ask to see our license and insurance certificate at your free visit."]]',
      ),
    ],
    confirmed: false,
  },
  {
    id: "aq-employees",
    group: "license",
    question: "Are your caregivers employees, or independent contractors?",
    why: "With employees, the agency handles pay, taxes, insurance and supervision. With contractors or a registry, some of that may fall to your family.",
    ourAnswer: [pending("[[TO CONFIRM: employees (W-2) or contractors?]]")],
    confirmed: false,
  },
  {
    id: "aq-screening",
    group: "caregivers",
    question: "How do you screen caregivers — background checks, references?",
    why: "You're letting someone into your family's home. You should know exactly how they were checked.",
    ourAnswer: [
      pending("[[TO CONFIRM: screening every caregiver goes through. List only what's real.]]"),
    ],
    confirmed: false,
  },
  {
    id: "aq-training",
    group: "caregivers",
    question: "What training and experience do your caregivers have?",
    why: "Experience matters most for hands-on help like bathing and moving safely.",
    ourAnswer: [
      "Our caregivers have years of experience, and our team includes Certified Nursing Assistants.",
      pending("[[TO CONFIRM: training every caregiver receives]]"),
    ],
    confirmed: false,
  },
  {
    id: "aq-match",
    group: "caregivers",
    question: "Can we meet the caregiver first? Can we ask for someone different?",
    why: "The right personality fit makes care easier for everyone — especially for a parent who's unsure about help.",
    ourAnswer: [
      "We match caregivers on needs, schedule and personality.",
      pending('[[TO CONFIRM — draft: "You can meet your caregiver before care begins."]]'),
      pending(
        "[[TO CONFIRM — draft: \"If the fit isn't right, tell us and we'll find someone who is.\"]]",
      ),
    ],
    confirmed: false,
  },
  {
    id: "aq-backup",
    group: "caregivers",
    question: "What happens if our caregiver is sick or on vacation?",
    why: "A missed visit can mean a missed meal or medication reminder. Ask how the agency covers it.",
    ourAnswer: [pending("[[TO CONFIRM: backup cover when a caregiver is sick or away]]")],
    confirmed: false,
  },
  {
    id: "aq-who-plans",
    group: "care",
    question: "Who visits to plan care — and who stays involved after that?",
    why: "You want to know who's actually responsible for the care — not just who answers the first call.",
    ourAnswer: [
      "Our owner. The owner visits every family personally, builds the care plan with you and keeps working with you to make sure care is done right.",
    ],
    confirmed: true,
  },
  {
    id: "aq-plan",
    group: "care",
    question: "Will we get a written care plan?",
    why: "A written plan means everyone — family and caregivers — knows exactly what help is expected.",
    ourAnswer: [pending("[[TO CONFIRM: families receive a written copy of the care plan]]")],
    confirmed: false,
  },
  {
    id: "aq-updates",
    group: "care",
    question: "How will you keep our family updated — especially if we live far away?",
    why: "Clear updates are what let you stop worrying from a distance.",
    ourAnswer: [
      "We follow up and check in regularly, and we change the plan as needs change.",
      pending("[[TO CONFIRM: how often and how — e.g. a call every few weeks]]"),
    ],
    confirmed: false,
  },
  {
    id: "aq-after-hours",
    group: "care",
    question: "Who do we call at night or on weekends?",
    why: "Care needs don't keep office hours. Ask how you reach someone when the office is closed.",
    ourAnswer: [
      "Care is available 24 hours a day, 7 days a week. Our office is open Monday–Friday, 8 AM–5 PM.",
      pending("[[TO CONFIRM: after-hours line for existing clients]]"),
    ],
    confirmed: false,
  },
  {
    id: "aq-limits",
    group: "care",
    question: "What won't your caregivers do?",
    why: "Every agency has limits. Knowing them up front avoids surprises later.",
    ourAnswer: [
      "Our care is non-medical. We don't give injections, change wound dressings or provide nursing. We give medication reminders and work alongside your home health or hospice team.",
    ],
    confirmed: true,
  },
  {
    id: "aq-rate",
    group: "cost",
    question: "What's your hourly rate? Is it different for nights, weekends or holidays?",
    why: "Two agencies with the same hourly rate can cost very different amounts once nights and holidays are added.",
    ourAnswer: [
      "We'll explain your rate clearly at your free visit, before care begins.",
      pending("[[TO CONFIRM: rate differences for nights, weekends or holidays]]"),
    ],
    confirmed: false,
  },
  {
    id: "aq-minimum",
    group: "cost",
    question: "Is there a minimum visit length, or a minimum number of hours a week?",
    why: "Minimums decide what a few hours of help really costs each week.",
    ourAnswer: [pending("Visits start at [[TO CONFIRM: minimum hours]] hours.")],
    confirmed: false,
  },
  {
    id: "aq-billing",
    group: "cost",
    question: "How does billing work, and what forms of payment do you take?",
    why: "Knowing when and how you'll be billed makes it easier to plan — and to share costs with family.",
    ourAnswer: [pending("[[TO CONFIRM: billing frequency and payment methods]]")],
    confirmed: false,
  },
  {
    id: "aq-contract",
    group: "cost",
    question: "Is there a contract? How much notice do you need to change or stop care?",
    why: "Needs can change fast — after a hospital stay, or a move. Flexible terms protect your family.",
    ourAnswer: [
      pending(
        "[[TO CONFIRM: service agreement, minimum commitment, notice to change or stop care]]",
      ),
    ],
    confirmed: false,
  },
];
