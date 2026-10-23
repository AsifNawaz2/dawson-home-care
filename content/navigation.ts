/**
 * Navigation — header (design: short menu, BUILD_DECISIONS answer 6), Care mega-menu (06 + 07),
 * mobile menu and footer. Service strings are verbatim from COPY_HOME ch. 3 / COPY_SERVICES.
 */
export type ServiceSlug =
  "personal-care" | "home-help" | "companionship" | "respite-care" | "24-hour-care";

export const services: {
  slug: ServiceSlug;
  name: string;
  promise: string;
  smallLabel: string;
  href: `/care/${ServiceSlug}`;
}[] = [
  {
    slug: "personal-care",
    name: "Personal Care",
    promise: "Help with bathing, dressing and getting around — with dignity.",
    smallLabel: "Also called: help with daily living (ADLs)",
    href: "/care/personal-care",
  },
  {
    slug: "home-help",
    name: "Home Help",
    promise: "Meals, laundry, errands and medication reminders, so the house keeps running.",
    smallLabel: "Also called: homemaker care",
    href: "/care/home-help",
  },
  {
    slug: "companionship",
    name: "Companionship",
    promise: "Company, conversation and getting out of the house.",
    smallLabel: "Also called: companion care",
    href: "/care/companionship",
  },
  {
    slug: "24-hour-care",
    name: "24-Hour & Overnight Care",
    promise: "Someone there, day and night.",
    smallLabel: "Also called: round-the-clock care",
    href: "/care/24-hour-care",
  },
  {
    slug: "respite-care",
    name: "Respite Care",
    promise: "A break for you. Your loved one keeps their routine.",
    smallLabel: "Also called: respite",
    href: "/care/respite-care",
  },
];

/** Footer order (design): Personal, Home Help, Companionship, Respite, 24-Hour. */
export const footerServices: ServiceSlug[] = [
  "personal-care",
  "home-help",
  "companionship",
  "respite-care",
  "24-hour-care",
];

/** Header links exactly as designed. "Care services" opens the mega-menu. */
export const mainNav = [
  { label: "Care services", href: "/care", mega: true },
  { label: "How it works", href: "/how-it-works" },
  { label: "Paying for care", href: "/paying-for-care" },
  { label: "Areas we serve", href: "/areas-we-serve" },
  { label: "Our story", href: "/about" },
] as const;

export const megaMenu = {
  eyebrow: "Care services",
  heading: "Five ways we help at home.",
  linkText: "See how we help →",
  quiz: {
    label: "Not sure? Take the quiz",
    href: "/find-care",
    line: "About 1 minute · No email needed",
  },
  all: { label: "See all care services", href: "/care" },
};

/** Footer "Find the right care" column (design). */
export const footerMore = [
  { label: "See how it works", href: "/how-it-works" },
  { label: "See ways families pay for care", href: "/paying-for-care#ways-to-pay" },
  { label: "See all questions", href: "/faq" },
  { label: "See all areas we serve", href: "/areas-we-serve" },
  { label: "Read our story", href: "/about" },
  { label: "See caregiver jobs", href: "/careers" },
  { label: "Make a referral", href: "/for-professionals#refer" },
];

/**
 * Footer "Areas we serve" column (SEO_PLAN A1): towns with pages. All confirmed:false until the
 * reveal — they show on localhost/preview and only ship indexed once confirmed (COPY_AREAS §1).
 */
export const footerTowns = [
  { name: "Beaufort", href: "/areas-we-serve/beaufort" },
  { name: "Port Royal", href: "/areas-we-serve/port-royal" },
  { name: "Lady's Island", href: "/areas-we-serve/ladys-island" },
  { name: "St. Helena Island", href: "/areas-we-serve/st-helena-island" },
  { name: "Burton", href: "/areas-we-serve/burton" },
  { name: "Okatie", href: "/areas-we-serve/okatie" },
  { name: "Bluffton", href: "/areas-we-serve/bluffton" },
  { name: "Hilton Head Island", href: "/areas-we-serve/hilton-head-island" },
];

export const footerLegal = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "SMS Terms", href: "/sms-terms" },
  { label: "Accessibility", href: "/accessibility" },
  { label: "Sitemap", href: "/sitemap" },
];
