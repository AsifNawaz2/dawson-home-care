// content/seo.ts — page metadata + breadcrumbs (SEO_PLAN.md §1, §3.8).
// Source of truth for generateMetadata(), sitemap.ts, BreadcrumbList and the HTML /sitemap.
// RULES
// - Titles ≤ 60, descriptions 120–155, OG titles ≤ 65 characters. Counted 2026-10-19.
// - No computed years and no [[TO CONFIRM tokens. Paths have no trailing slash.
// - og:description = description. og:image = the route's opengraph-image (§2.5).
// - `index` rules resolve at build: town pages from areas.ts, /reviews from reviews.json,
//   /resources from published posts. Non-production environments are noindex regardless.

export type IndexRule =
  "index" | "noindex" | "town-confirmed" | "reviews-3-real" | "resources-3-posts";

export interface Crumb {
  name: string;
  path: string;
}

export interface PageSeo {
  path: string;
  title: string;
  description: string;
  ogTitle: string;
  index: IndexRule;
  /** Trail after "Home". Last crumb = this page. [] = no breadcrumb. */
  breadcrumb: Crumb[];
  primaryKeyword: string | null;
  secondaryKeywords: string[];
  /** Date the page's content last changed (YYYY-MM-DD). null = launch date. */
  updated: string | null;
}

const home: Crumb[] = [];
const care: Crumb = { name: "Care", path: "/care" };
const areas: Crumb = { name: "Areas we serve", path: "/areas-we-serve" };
const about: Crumb = { name: "About", path: "/about" };

const service = (
  slug: string,
  name: string,
  title: string,
  description: string,
  ogTitle: string,
  primaryKeyword: string,
  secondaryKeywords: string[],
): PageSeo => ({
  path: `/care/${slug}`,
  title,
  description,
  ogTitle,
  index: "index",
  breadcrumb: [care, { name, path: `/care/${slug}` }],
  primaryKeyword,
  secondaryKeywords,
  updated: null,
});

const town = (
  slug: string,
  name: string,
  title: string,
  description: string,
  ogTitle: string,
  primaryKeyword: string,
  secondaryKeywords: string[],
): PageSeo => ({
  path: `/areas-we-serve/${slug}`,
  title,
  description,
  ogTitle,
  index: "town-confirmed",
  breadcrumb: [areas, { name, path: `/areas-we-serve/${slug}` }],
  primaryKeyword,
  secondaryKeywords,
  updated: null,
});

const simple = (
  path: string,
  crumbName: string | null,
  title: string,
  description: string,
  ogTitle: string,
  index: IndexRule,
  primaryKeyword: string | null,
  secondaryKeywords: string[] = [],
  parent: Crumb | null = null,
): PageSeo => ({
  path,
  title,
  description,
  ogTitle,
  index,
  breadcrumb: crumbName ? [...(parent ? [parent] : []), { name: crumbName, path }] : home,
  primaryKeyword,
  secondaryKeywords,
  updated: null,
});

export const pages: PageSeo[] = [
  simple(
    "/",
    null,
    "In-Home Care in Beaufort, SC | Dawson & Dawson Home Care",
    "Owner-run, non-medical home care in Beaufort, SC since 2002. Personal care, home help, companionship, respite and 24-hour care. Free in-home assessment.",
    "Care that feels like family, from an owner who meets yours",
    "index",
    "home care Beaufort SC",
    [
      "in-home care Beaufort SC",
      "home care agency Beaufort",
      "senior home care Lowcountry",
      "non-medical home care",
      "caregivers Beaufort SC",
    ],
  ),
  simple(
    "/care",
    "Care",
    "Home Care Services in Beaufort, SC | Dawson & Dawson",
    "Non-medical home care in Beaufort, SC: personal care, home help, companionship, respite and 24-hour care. Owner-run since 2002. Free home visit.",
    "Home care built around your family: five ways we help",
    "index",
    "home care services Beaufort SC",
    ["types of home care", "in-home senior care services", "non-medical home care services"],
  ),
  service(
    "personal-care",
    "Personal Care",
    "Personal Care at Home in Beaufort, SC | Dawson & Dawson",
    "Gentle, non-medical help with bathing, dressing, the bathroom and moving safely at home. Owner-run in Beaufort, SC since 2002. Free home visit.",
    "Personal care at home, done with dignity",
    "personal care at home Beaufort SC",
    [
      "help bathing elderly parent",
      "bathing and dressing help for seniors",
      "personal care for seniors",
      "ADL care",
    ],
  ),
  service(
    "home-help",
    "Home Help",
    "Home Help & Homemaker Care in Beaufort, SC | Dawson & Dawson",
    "Meals, laundry, light housekeeping, errands and medication reminders at home in Beaufort, SC. Owner-run since 2002. Book a free home visit.",
    "Home help that keeps the house running",
    "homemaker services Beaufort SC",
    [
      "help at home for elderly",
      "meal preparation for seniors",
      "light housekeeping for seniors",
      "medication reminders",
    ],
  ),
  service(
    "companionship",
    "Companionship",
    "Companion Care for Seniors in Beaufort, SC | Dawson & Dawson",
    "Friendly company, conversation, walks, games and outings for older adults at home in Beaufort, SC. Owner-run since 2002. Free home visit.",
    "Companionship that brightens the week",
    "companion care Beaufort SC",
    [
      "companionship for seniors",
      "elderly companion services",
      "sitter for elderly",
      "senior loneliness help",
    ],
  ),
  service(
    "respite-care",
    "Respite Care",
    "Respite Care in Beaufort, SC | Dawson & Dawson",
    "Respite care in Beaufort, SC: a real break for family caregivers. We step in for a few hours, a weekend or longer, and your loved one keeps their routine.",
    "Respite care that gives you a real break",
    "respite care Beaufort SC",
    ["in-home respite care", "respite for family caregivers", "caregiver break"],
  ),
  service(
    "24-hour-care",
    "24-Hour & Overnight Care",
    "24-Hour & Overnight Care in Beaufort, SC | Dawson & Dawson",
    "Non-medical care day and night at home in Beaufort, SC. Overnight help, safe bathroom trips and support after a hospital stay. Owner-run since 2002.",
    "24-hour care, so someone's always there",
    "24-hour home care Beaufort SC",
    [
      "overnight care for elderly",
      "overnight caregiver",
      "round-the-clock care at home",
      "night sitter for elderly",
    ],
  ),
  simple(
    "/find-care",
    "Find the Right Care",
    "Find the Right Home Care: 1-Minute Quiz | Dawson & Dawson",
    "Not sure what kind of home care you need? Answer five quick questions and get a suggested plan for your family. No email needed.",
    "Not sure what care Mom or Dad needs? Take the 1-minute quiz",
    "index",
    "what kind of home care do I need",
    ["home care quiz", "choosing home care for a parent"],
  ),
  simple(
    "/how-it-works",
    "How It Works",
    "How Home Care Works | Dawson & Dawson, Beaufort SC",
    "Getting started with home care in Beaufort, SC: one call, a free home visit from our owner, a care plan built with you, and regular check-ins.",
    "From first call to first visit: how home care starts",
    "index",
    "how does home care work",
    ["starting home care for a parent", "in-home care assessment", "what to expect from home care"],
  ),
  simple(
    "/paying-for-care",
    "Paying for Care",
    "Home Care Costs & Ways to Pay, Beaufort SC | Dawson & Dawson",
    "Estimate the cost of home care and see how families pay: private pay, long-term care insurance, VA benefits, Medicaid waivers — and what Medicare covers.",
    "What home care costs, and how families pay for it",
    "index",
    "home care cost Beaufort SC",
    [
      "how to pay for home care in SC",
      "does Medicare pay for home care",
      "VA Aid and Attendance home care",
      "SC Community Choices waiver",
      "long-term care insurance home care",
    ],
  ),
  simple(
    "/areas-we-serve",
    "Areas we serve",
    "Home Care Across the Lowcountry | Dawson & Dawson",
    "Non-medical home care from our office in Beaufort, SC, across the Lowcountry. Find your town, see drive times and book a free in-home assessment.",
    "Home care across the Lowcountry, from our office in Beaufort",
    "index",
    "home care Lowcountry SC",
    ["home care Beaufort County", "in-home care near Beaufort"],
  ),
  town(
    "beaufort",
    "Beaufort",
    "Senior Home Care in Beaufort, SC | Dawson & Dawson",
    "Home care from our Beaufort office: bathing, meals, companionship, respite and 24-hour care. Owner-run since 2002. Free in-home assessment.",
    "Senior home care in Beaufort, from right down the road",
    "senior care Beaufort SC",
    [
      "elderly care Beaufort SC",
      "in-home senior care Beaufort historic district",
      "home care 29902",
      "home care 29906",
    ],
  ),
  town(
    "port-royal",
    "Port Royal",
    "In-Home Care in Port Royal, SC | Dawson & Dawson",
    "Help at home in Port Royal: bathing, meals, walks, respite and overnight care. Local and owner-run since 2002. Free in-home assessment.",
    "In-home care in Port Royal: small town, close by",
    "home care Port Royal SC",
    ["senior care Port Royal SC", "elderly care Port Royal", "veteran home care Port Royal"],
  ),
  town(
    "ladys-island",
    "Lady's Island",
    "In-Home Care on Lady's Island, SC | Dawson & Dawson",
    "Home care on Lady's Island, just over the bridge from Beaufort: personal care, home help, companionship, respite and overnight care. Free assessment.",
    "In-home care on Lady's Island: island life, close to town",
    "home care Lady's Island SC",
    ["senior care Lady's Island", "in-home care Ladys Island"],
  ),
  town(
    "st-helena-island",
    "St. Helena Island",
    "In-Home Care on St. Helena Island, SC | Dawson & Dawson",
    "Non-medical home care on St. Helena Island: respite for family caregivers, personal care, home help and overnight care. Free visit at home.",
    "In-home care on St. Helena Island, on your family's terms",
    "home care St. Helena Island SC",
    ["senior care St. Helena Island", "respite care St. Helena", "elder care Frogmore"],
  ),
  town(
    "burton",
    "Burton",
    "In-Home Care in Burton, SC | Dawson & Dawson",
    "Our office is on Robert Smalls Parkway, minutes from Burton. Personal care, home help, respite and overnight care. Owner-run since 2002.",
    "In-home care in Burton: close enough to be neighbors",
    "home care Burton SC",
    ["senior care Burton SC", "home care near Laurel Bay"],
  ),
  town(
    "okatie",
    "Okatie",
    "In-Home Care in Okatie & Sun City, SC | Dawson & Dawson",
    "Home care in Okatie and Sun City Hilton Head: respite for caregiving spouses, personal care, home help and overnight care. Free in-home assessment.",
    "In-home care in Okatie and Sun City: independence is the point",
    "home care Okatie SC",
    ["home care Sun City Hilton Head", "respite care Sun City", "senior care Okatie"],
  ),
  town(
    "bluffton",
    "Bluffton",
    "In-Home Care in Bluffton, SC | Dawson & Dawson",
    "Home care in Bluffton for parents who retired here and families who live far away. Personal care, companionship, respite and 24-hour care.",
    "In-home care in Bluffton: new to town, not on your own",
    "home care Bluffton SC",
    ["senior care Bluffton SC", "in-home care Bluffton", "elderly care Bluffton"],
  ),
  town(
    "hilton-head-island",
    "Hilton Head Island",
    "In-Home Care on Hilton Head Island, SC | Dawson & Dawson",
    "Non-medical home care on Hilton Head Island, including gated communities and part-year residents. Owner-run since 2002. Call to check scheduling.",
    "In-home care on Hilton Head Island, with help close at hand",
    "home care Hilton Head Island",
    [
      "senior care Hilton Head",
      "in-home care Sea Pines",
      "home care for part-time residents Hilton Head",
    ],
  ),
  simple(
    "/about",
    "About",
    "About Dawson & Dawson Home Care | Beaufort, SC Since 2002",
    "Dawson and Dawson Home Care has cared for Lowcountry families since 2002. Owner-run, licensed and insured, with an office in Beaufort, SC.",
    "Here since 2002. Still personal.",
    "index",
    "Dawson and Dawson Home Care",
    ["locally owned home care Beaufort", "owner-run home care agency", "home care since 2002"],
  ),
  simple(
    "/reviews",
    "Reviews",
    "Reviews | Dawson & Dawson Home Care, Beaufort SC",
    "Read what Lowcountry families say about Dawson and Dawson Home Care — owner-run, non-medical home care in Beaufort, SC since 2002.",
    "In their words: families on Dawson & Dawson Home Care",
    "reviews-3-real",
    "Dawson and Dawson Home Care reviews",
    ["home care reviews Beaufort SC"],
    about,
  ),
  simple(
    "/careers",
    "Careers",
    "Caregiver Jobs in Beaufort, SC | Dawson & Dawson Home Care",
    "Join an owner-run home care team in Beaufort, SC, caring for Lowcountry families since 2002. See open caregiver roles and apply online.",
    "Caregiver jobs in Beaufort: do work that matters, close to home",
    "index",
    "caregiver jobs Beaufort SC",
    ["in-home caregiver jobs", "home care jobs Lowcountry"], // add "CNA jobs Beaufort SC" only once the CNA role is confirmed
    about,
  ),
  simple(
    "/for-professionals",
    "For Professionals",
    "Refer a Client for Home Care | Dawson & Dawson, Beaufort SC",
    "For discharge planners, case managers and care teams: refer a client for non-medical home care in Beaufort, SC in about 2 minutes, or fax (866) 502-3509.",
    "Refer a client for home care in about 2 minutes",
    "index",
    "home care referral Beaufort SC",
    ["discharge planning home care", "non-medical home care referral"],
  ),
  simple(
    "/faq",
    "FAQ",
    "Home Care Questions & Answers | Dawson & Dawson, Beaufort SC",
    "Plain answers about non-medical home care in Beaufort, SC: getting started, services, cost and payment, caregivers, safety and medical questions.",
    "Home care questions, answered plainly",
    "index",
    "home care questions",
    ["home care vs home health", "is home care covered by Medicare"],
  ),
  simple(
    "/resources",
    "Resources",
    "Home Care Guides for Lowcountry Families | Dawson & Dawson",
    "Plain-language guides for families caring for an older parent in Beaufort and the Lowcountry: getting started, paying for care and caregiver support.",
    "Guides for Lowcountry families caring for someone they love",
    "resources-3-posts",
    "caregiving guides Beaufort SC",
    ["aging parent help Lowcountry", "caring for elderly parent tips"],
  ),
  simple(
    "/free-assessment",
    "Free Assessment",
    "Free In-Home Care Assessment | Dawson & Dawson, Beaufort SC",
    "Request a free, no-obligation home visit from our owner. Tell us a little about your family in 2 minutes and we'll call you to set it up.",
    "A free visit at home, with our owner",
    "index",
    "free in-home care assessment Beaufort",
    ["home care consultation", "free home visit home care"],
  ),
  simple(
    "/contact",
    "Contact",
    "Contact Dawson & Dawson Home Care | Beaufort, SC",
    "Call (843) 379-3321, text (866) 632-9766 or visit us at 69 Robert Smalls Parkway, Beaufort, SC. Care 24/7. Office Monday–Friday, 8 AM–5 PM.",
    "Contact Dawson & Dawson Home Care in Beaufort",
    "index",
    "Dawson and Dawson Home Care phone",
    ["home care Robert Smalls Parkway", "home care agency Beaufort contact"],
  ),
  simple(
    "/privacy-policy",
    "Privacy Policy",
    "Privacy Policy | Dawson & Dawson Home Care",
    "How Dawson and Dawson Home Care LLC collects, uses and protects your information, including text messages. Plain language, no fine print.",
    "Privacy Policy: Dawson & Dawson Home Care",
    "index",
    null,
  ),
  simple(
    "/sms-terms",
    "SMS Terms",
    "SMS Terms | Dawson & Dawson Home Care",
    "How texts from Dawson and Dawson Home Care LLC work: what we send, how often, what it costs, and how to get help or stop. Reply STOP any time.",
    "SMS Terms: Dawson & Dawson Home Care",
    "index",
    null,
  ),
  simple(
    "/accessibility",
    "Accessibility",
    "Accessibility | Dawson & Dawson Home Care",
    "Our commitment to a website everyone can use: Comfort Controls, full keyboard access and captions — and how to tell us if something gets in your way.",
    "Accessibility at Dawson & Dawson Home Care",
    "index",
    null,
  ),
  simple(
    "/sitemap",
    "Site Map",
    "Site Map | Dawson & Dawson Home Care",
    "Every page on dawsonhomecare.com in one list: care services, areas we serve, paying for care, help for families, and how to reach us.",
    "Site map: Dawson & Dawson Home Care",
    "index",
    null,
  ),
  {
    path: "/thank-you",
    title: "Thank You | Dawson & Dawson Home Care",
    description: "",
    ogTitle: "",
    index: "noindex", // rendered as noindex, nofollow
    breadcrumb: [],
    primaryKeyword: null,
    secondaryKeywords: [],
    updated: null,
  },
];

/** not-found.tsx metadata (status 404, noindex). */
export const notFoundTitle = "Page Not Found | Dawson & Dawson Home Care";

export const getPageSeo = (path: string): PageSeo | undefined => pages.find((p) => p.path === path);
