// content/faq.ts — /faq (grouped accordion + live search, 07 §14) and Home ch. 13 preview.
// Copy is final (COPY_COST_FAQ.md). The six `featured` items are COPY_HOME ch. 13:
// Home renders answer[0] only, and answer[0] matches COPY_HOME word for word.
// Deep links: /faq#{id} opens that item. Group sections use id="topic-{group id}"
// (prefixed so the group "caregivers" never collides with the question #caregivers).

import { type Block, type Link, pending } from "./blocks";

export type FaqGroupId =
  | "getting-started"
  | "services"
  | "cost-payment"
  | "caregivers"
  | "safety-trust"
  | "hospice-medical";

export type FaqGroup = { id: FaqGroupId; title: string; intro: string };

export type FaqItem = {
  id: string;
  group: FaqGroupId;
  question: string;
  /** Paragraphs in order. answer[0] stands alone as the short answer. */
  answer: Block[];
  link?: Link;
  /** Search synonyms. Never displayed. */
  keywords: string[];
  /** Home ch. 13 position (1–6). */
  featured?: number;
  /** false while any Pending block remains. */
  confirmed: boolean;
  /** true = hide the whole item until confirmed (it has no safe verified answer). */
  hideUntilConfirmed: boolean;
};

export const faqGroups: FaqGroup[] = [
  {
    id: "getting-started",
    title: "Getting started",
    intro: "First call, first visit, first days.",
  },
  { id: "services", title: "Services", intro: "What we help with — and what we don't." },
  { id: "cost-payment", title: "Cost & payment", intro: "What care costs and how families pay." },
  { id: "caregivers", title: "Caregivers", intro: "The people who come to your loved one's home." },
  {
    id: "safety-trust",
    title: "Safety & trust",
    intro: "Who's responsible, and how we keep things right.",
  },
  {
    id: "hospice-medical",
    title: "Hospice & medical questions",
    intro: "How we fit alongside medical care.",
  },
];

export const faqItems: FaqItem[] = [
  // ── Getting started ─────────────────────────────────────────────────────────
  {
    id: "gs-how-start",
    group: "getting-started",
    question: "How do we get started?",
    answer: [
      "Call (843) 379-3321, text (866) 632-9766 or request a call online. Tell us what's going on — you don't need to have anything figured out.",
      "Next, our owner visits your loved one at home for a free assessment. Together we build a care plan, then we match a caregiver. Our office is open Monday–Friday, 8 AM–5 PM. Care is available 24 hours a day, 7 days a week.",
    ],
    link: { label: "See how it works", href: "/how-it-works" },
    keywords: [
      "start",
      "begin",
      "first step",
      "sign up",
      "call",
      "how it works",
      "process",
      "get help",
    ],
    confirmed: true,
    hideUntilConfirmed: false,
  },
  {
    id: "free-assessment",
    group: "getting-started",
    question: "What happens at the free assessment?",
    answer: [
      "Our owner visits your loved one at home, at no cost. We talk about daily routines, the help they need and what matters most to them. Then we build a care plan together. There's no obligation.",
      "It's a friendly conversation, not an interview — and never a sales pitch. You or another family member are welcome to join, in person or by phone.",
    ],
    link: { label: "What to expect at the visit", href: "/how-it-works#free-assessment" },
    keywords: [
      "assessment",
      "visit",
      "consultation",
      "evaluation",
      "free",
      "home visit",
      "obligation",
      "meeting",
    ],
    featured: 6,
    confirmed: true,
    hideUntilConfirmed: false,
  },
  {
    id: "gs-how-fast",
    group: "getting-started",
    question: "How soon can care start?",
    answer: [
      "It depends on the help you need and when you need it. Tell us your timing on the first call. If it's urgent, say so — we'll move as quickly as we can.",
      pending(
        "Many families start care within [[TO CONFIRM: typical time from first call to first shift]] of their first call.",
      ),
    ],
    link: { label: "How fast care can start", href: "/how-it-works#start-time" },
    keywords: [
      "soon",
      "quickly",
      "fast",
      "urgent",
      "start date",
      "today",
      "tomorrow",
      "this week",
      "emergency",
    ],
    confirmed: false,
    hideUntilConfirmed: false,
  },
  {
    id: "gs-hospital",
    group: "getting-started",
    question: "Mom is in the hospital. When should we call?",
    answer: [
      "Before she's discharged, if you can. Coming home is when many families call us. We'll plan the first days home so there's no gap in care.",
      pending(
        '[[TO CONFIRM: can the free assessment happen at the hospital or rehab center? If yes: "Our owner can often meet you at the hospital or rehab center before discharge."]]',
      ),
    ],
    keywords: [
      "hospital",
      "discharge",
      "rehab",
      "rehabilitation",
      "surgery",
      "coming home",
      "fall",
      "after hospital",
    ],
    confirmed: false,
    hideUntilConfirmed: false,
  },
  {
    id: "gs-reluctant",
    group: "getting-started",
    question: "What if my parent doesn't want help?",
    answer: [
      "That's very common, and it's OK. At the free visit, we talk with your loved one, not about them, and keep it relaxed.",
      'Many people find it easiest to start with companionship — a friendly visitor a few times a week. It doesn\'t feel like "help." It feels like company. Our owner can suggest gentle ways to bring up the idea.',
    ],
    link: { label: "See Companionship", href: "/care/companionship" },
    keywords: [
      "refuses",
      "resistant",
      "stubborn",
      "doesn't want",
      "won't accept",
      "independent",
      "pride",
      "convince",
    ],
    confirmed: true,
    hideUntilConfirmed: false,
  },
  {
    id: "gs-far-away",
    group: "getting-started",
    question: "I live out of town. Can I still set up care?",
    answer: [
      "Yes. Many families we help don't live nearby. You can join the free assessment by phone, and we'll agree how you'd like to hear from us.",
      "We follow up and check in regularly, so you know how things are going — even from hours away.",
    ],
    keywords: [
      "long distance",
      "out of state",
      "out of town",
      "far away",
      "live away",
      "remote",
      "updates",
      "sibling",
    ],
    confirmed: true,
    hideUntilConfirmed: false,
  },
  {
    id: "gs-areas",
    group: "getting-started",
    question: "Which areas do you serve?",
    answer: [
      "Our office is in Beaufort, and we care for families across the greater Lowcountry and surrounding areas.",
      pending("[[TO CONFIRM: towns served — list from content/areas.ts once confirmed]]"),
      "Not sure if we reach you? Call (843) 379-3321 and we'll let you know.",
    ],
    link: { label: "See areas we serve", href: "/areas-we-serve" },
    keywords: [
      "area",
      "areas",
      "town",
      "where",
      "location",
      "Beaufort",
      "Lowcountry",
      "zip",
      "near me",
      "county",
    ],
    confirmed: false,
    hideUntilConfirmed: false,
  },

  // ── Services ────────────────────────────────────────────────────────────────
  {
    id: "home-care-vs-home-health",
    group: "services",
    question: "What's the difference between home care and home health?",
    answer: [
      "Home care is non-medical help at home: bathing, dressing, meals, housekeeping, company and medication reminders. That's what we do. Home health is medical care from nurses or therapists, usually ordered by a doctor. Many families use both, and we're happy to work alongside your home health team.",
    ],
    link: { label: "See all care services", href: "/care" },
    keywords: [
      "home health",
      "difference",
      "nursing",
      "medical",
      "non-medical",
      "skilled",
      "custodial",
      "what is home care",
    ],
    featured: 1,
    confirmed: true,
    hideUntilConfirmed: false,
  },
  {
    id: "sv-what-help",
    group: "services",
    question: "What kind of help do you provide?",
    answer: [
      "Five kinds of non-medical help at home. Most families combine two or three:",
      {
        list: [
          "Personal Care — bathing, dressing and getting around",
          "Home Help — meals, laundry, errands and medication reminders",
          "Companionship — company, conversation and getting out",
          "Respite Care — a break for family caregivers",
          "24-Hour & Overnight Care — someone there, day and night",
        ],
      },
      "Not sure which you need? Our 1-minute quiz can suggest a plan.",
    ],
    link: { label: "Find the right care", href: "/find-care" },
    keywords: [
      "services",
      "help",
      "what do you do",
      "personal care",
      "bathing",
      "housekeeping",
      "cooking",
      "companion",
      "respite",
      "ADLs",
    ],
    confirmed: true,
    hideUntilConfirmed: false,
  },
  {
    id: "nights-weekends",
    group: "services",
    question: "Can you help at night or on weekends?",
    answer: [
      "Yes. Care is available 24 hours a day, 7 days a week — a few hours or around the clock. Our office is open Monday to Friday, 8 AM to 5 PM.",
    ],
    link: { label: "See 24-Hour & Overnight Care", href: "/care/24-hour-care" },
    keywords: [
      "night",
      "overnight",
      "weekend",
      "holiday",
      "24/7",
      "24 hours",
      "around the clock",
      "office hours",
      "Sunday",
      "Saturday",
    ],
    featured: 4,
    confirmed: true,
    hideUntilConfirmed: false,
  },
  {
    id: "sv-start-small",
    group: "services",
    question: "Can we start with just a few hours — and change later?",
    answer: [
      "Yes. Many families start small, with a visit or two a week, and add more as needs change. Need more hours, fewer hours or a different kind of help? We change the plan.",
      pending("Visits start at [[TO CONFIRM: minimum hours]] hours."),
    ],
    keywords: [
      "minimum",
      "few hours",
      "part-time",
      "change",
      "more hours",
      "fewer hours",
      "flexible",
      "once a week",
    ],
    confirmed: false,
    hideUntilConfirmed: false,
  },
  {
    id: "sv-medication",
    group: "services",
    question: "Can a caregiver give Dad his medication?",
    answer: [
      "We give medication reminders — a friendly nudge at the right time so he takes his own medicine. We don't give medication or manage prescriptions.",
      "If he needs someone to give his medicine, ask his doctor or home health team. We're happy to work alongside them.",
    ],
    link: { label: "See Home Help", href: "/care/home-help" },
    keywords: [
      "medication",
      "medicine",
      "pills",
      "meds",
      "reminders",
      "prescriptions",
      "insulin",
      "injections",
      "pill box",
    ],
    confirmed: true,
    hideUntilConfirmed: false,
  },
  {
    id: "sv-transport",
    group: "services",
    question: "Can a caregiver take Mom to appointments or errands?",
    answer: [
      "Yes, a caregiver can go with her, so she isn't on her own.",
      pending(
        "[[TO CONFIRM: do caregivers drive clients in their own car or the client's car? Replace this line with the confirmed answer.]]",
      ),
    ],
    keywords: [
      "drive",
      "driving",
      "car",
      "ride",
      "transport",
      "transportation",
      "doctor",
      "appointments",
      "errands",
      "shopping",
      "church",
    ],
    confirmed: false,
    hideUntilConfirmed: false,
  },
  {
    id: "sv-memory",
    group: "services",
    question: "Do you help people with memory loss or dementia?",
    answer: [
      pending(
        "[[TO CONFIRM: dementia/Alzheimer's support — do not publish this question until confirmed. Do not add as a service.]]",
      ),
    ],
    keywords: [
      "dementia",
      "Alzheimer's",
      "memory",
      "memory loss",
      "confused",
      "forgetful",
      "wandering",
    ],
    confirmed: false,
    hideUntilConfirmed: true,
  },

  // ── Cost & payment ──────────────────────────────────────────────────────────
  {
    id: "cost",
    group: "cost-payment",
    question: "How much does home care cost?",
    answer: [
      "It depends on how many hours of help you need. Use our cost estimator for a rough range. Your exact rate is set at your free assessment.",
      "We'll explain your rate clearly at your free visit, before care begins.",
    ],
    link: { label: "Estimate your cost", href: "/paying-for-care#estimator" },
    keywords: [
      "cost",
      "price",
      "rate",
      "how much",
      "afford",
      "expensive",
      "hourly",
      "per hour",
      "per month",
      "fees",
    ],
    featured: 2,
    confirmed: true,
    hideUntilConfirmed: false,
  },
  {
    id: "medicare",
    group: "cost-payment",
    question: "Does Medicare pay for home care?",
    answer: [
      "Usually not. Medicare generally doesn't cover non-medical home care. Some families use long-term care insurance, VA benefits or Medicaid waiver programs. Ask us which might apply to you.",
      "Medicare does pay for home health — part-time nursing or therapy at home, after a doctor or other provider confirms it's needed, for someone who has trouble leaving home. It doesn't pay for 24-hour care, or for help with bathing, dressing or housekeeping when that's the only help needed.",
    ],
    link: { label: "How Medicare fits with home care", href: "/paying-for-care#pay-medicare" },
    keywords: [
      "Medicare",
      "covered",
      "coverage",
      "insurance",
      "Part A",
      "Part B",
      "Medicare Advantage",
      "pay for",
    ],
    featured: 3,
    confirmed: true,
    hideUntilConfirmed: false,
  },
  {
    id: "cp-medicaid",
    group: "cost-payment",
    question: "Does Medicaid pay for home care in South Carolina?",
    answer: [
      "It can. South Carolina's Community Choices waiver is a Medicaid program that pays for help at home — like personal care and companion care — for people who qualify for Medicaid and need the level of care a nursing home gives.",
      "To start, call SCDHHS at (888) 971-1637. There may be a waiting list, so start early.",
      pending(
        '[[TO CONFIRM: is Dawson an approved Community Choices provider? If yes: "We\'re an approved provider — ask us how it works."]]',
      ),
    ],
    link: { label: "Learn about Medicaid waivers", href: "/paying-for-care#pay-medicaid" },
    keywords: [
      "Medicaid",
      "waiver",
      "Community Choices",
      "SCDHHS",
      "Healthy Connections",
      "low income",
      "state help",
    ],
    confirmed: false,
    hideUntilConfirmed: false,
  },
  {
    id: "cp-ltc",
    group: "cost-payment",
    question: "Will long-term care insurance pay for home care?",
    answer: [
      "Many policies do. Most start paying once your loved one needs help with everyday tasks — often two or more, like bathing and dressing — or has serious memory problems.",
      "There's usually a waiting period first, often 30 to 90 days. Find the policy and call the insurer early to ask what's covered at home.",
      pending(
        "[[TO CONFIRM: does Dawson work with long-term care insurance — care notes, invoices for claims, direct billing?]]",
      ),
    ],
    link: { label: "How long-term care insurance works", href: "/paying-for-care#pay-ltc" },
    keywords: [
      "long-term care insurance",
      "LTC",
      "LTCI",
      "policy",
      "claim",
      "elimination period",
      "waiting period",
      "insurance",
    ],
    confirmed: false,
    hideUntilConfirmed: false,
  },
  {
    id: "cp-va",
    group: "cost-payment",
    question: "Are there VA benefits that help pay for care at home?",
    answer: [
      "Yes, for many Veterans and some surviving spouses. Aid and Attendance adds money to a VA pension for people who need help with daily activities. Separately, Veterans enrolled in VA health care may qualify for Homemaker and Home Health Aide care, which the VA approves and arranges.",
      "Your county Veterans Affairs office can help you apply.",
      pending(
        "[[TO CONFIRM: does Dawson accept VA-authorized Homemaker/Home Health Aide care? Do families use Aid and Attendance to pay Dawson?]]",
      ),
    ],
    link: { label: "How VA benefits work", href: "/paying-for-care#pay-va" },
    keywords: [
      "VA",
      "veteran",
      "veterans",
      "military",
      "Aid and Attendance",
      "pension",
      "widow",
      "surviving spouse",
      "housebound",
    ],
    confirmed: false,
    hideUntilConfirmed: false,
  },
  {
    id: "cp-billing",
    group: "cost-payment",
    question: "How does billing work? What payment do you take?",
    answer: [
      "We'll go through your rate and billing at your free visit, before care begins.",
      pending(
        "[[TO CONFIRM: billing frequency (e.g. weekly or every two weeks), payment methods accepted, and whether nights, weekends or holidays cost more]]",
      ),
    ],
    keywords: [
      "bill",
      "billing",
      "invoice",
      "payment",
      "credit card",
      "check",
      "weekly",
      "holiday rate",
      "weekend rate",
      "deposit",
    ],
    confirmed: false,
    hideUntilConfirmed: false,
  },
  {
    id: "cp-contract",
    group: "cost-payment",
    question: "Is there a contract or a long-term commitment?",
    answer: [
      "The free assessment comes with no obligation.",
      pending(
        "[[TO CONFIRM: service agreement? minimum commitment? notice needed to change or stop care?]]",
      ),
    ],
    keywords: [
      "contract",
      "commitment",
      "cancel",
      "stop",
      "notice",
      "agreement",
      "sign",
      "lock in",
    ],
    confirmed: false,
    hideUntilConfirmed: true,
  },

  // ── Caregivers ──────────────────────────────────────────────────────────────
  {
    id: "caregivers",
    group: "caregivers",
    question: "Who will come to my loved one's home?",
    answer: [
      "An experienced Dawson caregiver chosen for your loved one's needs and schedule. Our team includes Certified Nursing Assistants, and our owner stays involved in every client's care.",
      "We match on needs, schedule and personality, and your caregiver learns the plan before the first visit.",
    ],
    link: { label: "Meet our caregivers", href: "/about#caregivers" },
    keywords: ["caregiver", "aide", "who comes", "CNA", "staff", "worker", "helper", "stranger"],
    featured: 5,
    confirmed: true,
    hideUntilConfirmed: false,
  },
  {
    id: "cg-training",
    group: "caregivers",
    question: "What experience and training do your caregivers have?",
    answer: [
      "Our caregivers have years of experience and a genuine love for caregiving. Our team includes Certified Nursing Assistants.",
      pending(
        "[[TO CONFIRM: training every caregiver receives — e.g. orientation, CPR, ongoing training]]",
      ),
    ],
    keywords: ["training", "experience", "certified", "CNA", "qualified", "skills", "trained"],
    confirmed: false,
    hideUntilConfirmed: false,
  },
  {
    id: "cg-meet-change",
    group: "caregivers",
    question: "Can we meet our caregiver first — or ask for someone different?",
    answer: [
      "We choose a caregiver who fits your loved one's needs, schedule and personality, and your caregiver learns the plan before the first visit.",
      pending('[[TO CONFIRM — draft: "You can meet your caregiver before care begins."]]'),
      pending(
        "[[TO CONFIRM — draft: \"If the fit isn't right, tell us and we'll find someone who is.\"]]",
      ),
    ],
    keywords: [
      "meet",
      "choose",
      "change caregiver",
      "new caregiver",
      "different caregiver",
      "personality",
      "fit",
      "match",
    ],
    confirmed: false,
    hideUntilConfirmed: false,
  },
  {
    id: "cg-consistency",
    group: "caregivers",
    question: "Will it be the same caregiver each time? What if they're sick?",
    answer: [
      pending(
        "[[TO CONFIRM: consistent-caregiver policy, and backup cover when a caregiver is sick or away]]",
      ),
    ],
    keywords: [
      "same caregiver",
      "consistency",
      "sick",
      "vacation",
      "backup",
      "no-show",
      "replacement",
      "different people",
    ],
    confirmed: false,
    hideUntilConfirmed: true,
  },
  {
    id: "cg-employees",
    group: "caregivers",
    question: "Are caregivers Dawson employees?",
    answer: [
      pending(
        '[[TO CONFIRM: employees (W-2) or contractors? If employees, draft: "Yes. Our caregivers are Dawson employees. We handle their pay, taxes and insurance, so your family doesn\'t have to."]]',
      ),
    ],
    keywords: [
      "employee",
      "employees",
      "contractor",
      "W-2",
      "1099",
      "registry",
      "taxes",
      "insurance",
    ],
    confirmed: false,
    hideUntilConfirmed: true,
  },

  // ── Safety & trust ──────────────────────────────────────────────────────────
  {
    id: "st-licensed",
    group: "safety-trust",
    question: "Are you licensed and insured?",
    answer: [
      "Yes. Dawson and Dawson Home Care LLC is licensed in South Carolina and insured.",
      pending("[[TO CONFIRM: SC license number and issuing agency]]"),
    ],
    link: { label: "Licensed & insured — the details", href: "/about#licensed" },
    keywords: [
      "license",
      "licensed",
      "insured",
      "insurance",
      "bonded",
      "legitimate",
      "state",
      "certified agency",
    ],
    confirmed: false,
    hideUntilConfirmed: false,
  },
  {
    id: "st-background",
    group: "safety-trust",
    question: "Do you do background checks on caregivers?",
    answer: [
      pending(
        "[[TO CONFIRM: screening every caregiver goes through — background checks, references, drug tests. List only what's real.]]",
      ),
    ],
    keywords: [
      "background check",
      "screening",
      "criminal record",
      "references",
      "drug test",
      "safe",
      "trust",
      "vetted",
    ],
    confirmed: false,
    hideUntilConfirmed: true,
  },
  {
    id: "st-owner",
    group: "safety-trust",
    question: "Who's responsible for my mom's care?",
    answer: [
      "Our owner. At Dawson, the person who visits your home for the free assessment is the person who runs the company — and they stay involved in your loved one's care.",
      "We follow up and check in regularly, and we adjust the plan as needs change.",
      pending("[[TO CONFIRM: how often and how we check in — e.g. a call every few weeks]]"),
    ],
    link: { label: "Meet our owner", href: "/about#owner" },
    keywords: [
      "owner",
      "manager",
      "supervisor",
      "responsible",
      "in charge",
      "who to call",
      "check in",
      "updates",
      "supervision",
    ],
    confirmed: false,
    hideUntilConfirmed: false,
  },
  {
    id: "st-concern",
    group: "safety-trust",
    question: "What if something isn't right?",
    answer: [
      "Tell us right away. Call (843) 379-3321 or email info@dawsonhomecare.com. We'd much rather hear about a small problem early than a big one later.",
      pending(
        "Existing clients can reach us after hours at [[TO CONFIRM: after-hours line for existing clients]].",
      ),
    ],
    keywords: [
      "complaint",
      "problem",
      "concern",
      "unhappy",
      "issue",
      "wrong",
      "feedback",
      "not working",
    ],
    confirmed: false,
    hideUntilConfirmed: false,
  },
  {
    id: "st-privacy",
    group: "safety-trust",
    question: "Why don't your forms ask about medical details?",
    answer: [
      "To protect your family's privacy. Our online forms ask only what we need to call you back. We talk about care needs by phone or in person.",
      "We never sell or share phone numbers or text-message opt-in information with other companies for their marketing.",
    ],
    link: { label: "Read our Privacy Policy", href: "/privacy-policy" },
    keywords: [
      "privacy",
      "private",
      "data",
      "information",
      "secure",
      "HIPAA",
      "medical records",
      "texts",
      "spam",
      "sell",
    ],
    confirmed: true,
    hideUntilConfirmed: false,
  },

  // ── Hospice & medical questions ─────────────────────────────────────────────
  {
    id: "hm-nursing",
    group: "hospice-medical",
    question: "Do you provide nursing or medical care?",
    answer: [
      "No. All our care is non-medical. We don't give injections, change wound dressings or provide nursing.",
      "Our team includes Certified Nursing Assistants, and we give medication reminders. If your loved one needs medical care at home, we're happy to work alongside their home health team.",
    ],
    keywords: [
      "nurse",
      "nursing",
      "medical",
      "wound care",
      "injections",
      "skilled",
      "RN",
      "LPN",
      "clinical",
      "insulin",
    ],
    confirmed: true,
    hideUntilConfirmed: false,
  },
  {
    id: "hm-together",
    group: "hospice-medical",
    question: "Can we have home care and home health at the same time?",
    answer: [
      "Yes, and many families do. Home health visits are usually part-time. We can be there for the hours in between — help with bathing, meals, the house and good company.",
      "Tell us who's on your loved one's care team, and we'll work alongside them.",
    ],
    link: {
      label: "Home care and home health, side by side",
      href: "/paying-for-care#pay-medicare",
    },
    keywords: [
      "home health",
      "both",
      "together",
      "same time",
      "therapist",
      "physical therapy",
      "nurse visits",
      "coordinate",
    ],
    confirmed: true,
    hideUntilConfirmed: false,
  },
  {
    id: "hm-hospice",
    group: "hospice-medical",
    question: "Can you help if my loved one is on hospice?",
    answer: [
      pending(
        '[[TO CONFIRM — draft: "Yes. We can provide non-medical comfort and companionship alongside your hospice or palliative team — sitting with your loved one, helping with meals and personal care, and giving the family a chance to rest."]]',
      ),
      pending(
        "[[TO CONFIRM — draft: \"Hospice teams usually visit at set times and don't stay around the clock. Many families add home care for the hours in between. We don't provide medical or nursing care.\"]]",
      ),
    ],
    keywords: [
      "hospice",
      "palliative",
      "end of life",
      "comfort care",
      "terminal",
      "dying",
      "last days",
    ],
    confirmed: false,
    hideUntilConfirmed: true,
  },
  {
    id: "hm-referral",
    group: "hospice-medical",
    question: "I'm a discharge planner or case manager. How do I refer someone?",
    answer: [
      "Send a referral online in about 2 minutes, or fax it to (866) 502-3509. You can also call (843) 379-3321.",
      "Please share only the minimum online — the client's first name, last initial and town. We'll talk through care needs by phone.",
      pending("We'll respond within [[TO CONFIRM: referral response time]]."),
    ],
    link: { label: "Make a referral", href: "/for-professionals#refer" },
    keywords: [
      "referral",
      "refer",
      "discharge planner",
      "case manager",
      "social worker",
      "hospital",
      "fax",
      "professional",
      "physician",
    ],
    confirmed: false,
    hideUntilConfirmed: false,
  },
];

/** Home ch. 13: the six featured items in order. Render answer[0] only. */
export const featuredFaqs = faqItems
  .filter((f) => f.featured !== undefined)
  .sort((a, b) => (a.featured ?? 0) - (b.featured ?? 0));
