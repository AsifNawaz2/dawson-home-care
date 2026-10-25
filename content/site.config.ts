/**
 * site.config.ts — every business fact the site shows, in one place.
 *
 * Sources: docs/04_CONTENT_INVENTORY.md (VERIFIED = from the current site) and
 * docs/BUILD_DECISIONS.md §H (owner's answers, 22 Oct 2026).
 *
 * RULES
 * - Never invent a fact. Anything not verified is `confirmed: false` (or `null`) and renders
 *   as a [[TO CONFIRM]] placeholder only when NEXT_PUBLIC_SHOW_PLACEHOLDERS=true.
 * - `npm run prelaunch` lists every `confirmed: false`, `null` fact and `[[TO CONFIRM` string.
 * - Phone numbers: display format + E.164 `tel:` value, always both.
 */

export type Pending<T> = { value: T; confirmed: false; note: string };
export type Confirmed<T> = { value: T; confirmed: true; source: string };
export type Fact<T> = Pending<T> | Confirmed<T>;

const verified = <T>(
  value: T,
  source = "04_CONTENT_INVENTORY.md (current site)",
): Confirmed<T> => ({
  value,
  confirmed: true,
  source,
});
const toConfirm = <T>(value: T, note: string): Pending<T> => ({ value, confirmed: false, note });

export const FOUNDED_YEAR = 2002;

export const business = {
  legalName: verified("Dawson and Dawson Home Care LLC"),
  brandName: verified("Dawson & Dawson Home Care"),
  shortBrand: verified("Dawson & Dawson"),
  founded: verified(FOUNDED_YEAR),
  ownership: verified("Owner run & operated"),
  ownerVisitsEveryClient: verified(true),
  licensedAndInsured: verified(true),
  certifiedNursingAssistants: verified(true),
  nonMedical: verified(true),
  region: verified("The greater Lowcountry and surrounding areas"),
  womenOwned: verified(
    true,
    "Google Business Profile — confirmed by owner, BUILD_DECISIONS §H answer 1",
  ),
  /** Independent, not a franchise — COPY_TRUST marks this [[TO CONFIRM]]. */
  independent: toConfirm(true, "independent, not part of a franchise"),
  familyRun: toConfirm(null as boolean | null, "is the agency family-run? (hero headline swap)"),
} as const;

export const address = {
  street: verified("69 Robert Smalls Parkway"),
  suite: verified("Suite 3F"),
  city: verified("Beaufort"),
  region: verified("SC"),
  postalCode: verified("29906"),
  country: "US",
  /** One line, for footers and contact blocks. */
  oneLine: "69 Robert Smalls Parkway, Suite 3F, Beaufort, SC 29906",
  short: "69 Robert Smalls Pkwy, Beaufort",
  geo: toConfirm(
    null as { lat: number; lng: number } | null,
    "office latitude/longitude for JSON-LD",
  ),
} as const;

export const contact = {
  phone: verified({ display: "(843) 379-3321", tel: "+18433793321" }),
  tollFree: verified({ display: "(866) 632-9766", tel: "+18666329766", textCapable: true }),
  fax: verified({ display: "(866) 502-3509", tel: "+18665023509" }),
  email: verified("info@dawsonhomecare.com"),
  /** Existing-client after-hours line — slot built, hidden until confirmed. */
  afterHoursClientLine: toConfirm(null as string | null, "after-hours line for existing clients"),
  /** Does the office call families back from the main number? (thank-you "Save our number"). */
  callbackNumberIsMain: toConfirm(
    null as boolean | null,
    "which number the office calls back from",
  ),
  voicemailAfterHours: toConfirm(
    null as boolean | null,
    "is there voicemail on the main line after hours?",
  ),
} as const;

/** Office hours (America/New_York). Care itself is 24/7. Never mix the two. */
export const hours = {
  timeZone: "America/New_York",
  office: verified({ days: [1, 2, 3, 4, 5], open: "08:00", close: "17:00" }),
  officeLabel: "Monday–Friday, 8 AM–5 PM",
  officeLabelShort: "Mon–Fri, 8 AM–5 PM",
  care: verified("24/7"),
  careLabel: "24 hours a day, 7 days a week",
  /** Optional US federal holidays the office is closed (ISO dates + names). Empty until confirmed. */
  holidays: toConfirm([] as { date: string; name: string }[], "office holiday closures"),
} as const;

export const links = {
  instagram: verified("https://www.instagram.com/dawsonhomecare/"),
  /** Owner pasted this from Google Maps on 22 Oct 2026 (BUILD_DECISIONS §H answer 5). */
  googleMaps: verified("https://maps.app.goo.gl/efdxQNbog5ZGfmrM7", "Owner, 22 Oct 2026"),
  hireology: verified("https://careers.hireology.com/dawsondawsonhomecarellc"),
  googleReviews: toConfirm(null as string | null, "Google Business Profile reviews URL"),
  googleWriteReview: toConfirm(null as string | null, "Google 'leave a review' link"),
  licenseLookup: toConfirm(null as string | null, "public SC license lookup URL"),
} as const;

export const owner = {
  firstName: verified(
    "Monique",
    "Google reviews — confirmed by owner, BUILD_DECISIONS §H answer 1",
  ),
  lastName: toConfirm(null as string | null, "owner last name (a review says 'Monique Dawson')"),
  title: toConfirm("Owner", "owner's title wording"),
  inHomeCareSince: toConfirm(null as number | null, "year the owner started in home care"),
  credentials: toConfirm(null as string | null, "owner's real credentials only"),
  twoOwners: toConfirm(null as boolean | null, "one owner or two? (who is 'Jay'?)"),
} as const;

export const reputation = {
  google: verified(
    { rating: 4.8, count: 33, asOf: "2026-10-22" },
    "Google Business Profile — confirmed by owner, BUILD_DECISIONS §H answer 1",
  ),
} as const;

export const credentials = {
  scLicenseNumber: toConfirm(null as string | null, "SC DPH In-Home Care Provider license #"),
  licenseIssuer: toConfirm(
    null as string | null,
    "issuing agency (likely SC Department of Public Health)",
  ),
  insuranceTypes: toConfirm([] as string[], "coverage types — list only what's real"),
  backgroundChecks: toConfirm(null as string | null, "caregiver screening steps"),
} as const;

/** Cost estimator. All null → hours-only mode; no price is ever invented (SPEC §5.2). */
export const rates = {
  rateMin: null as number | null,
  rateMax: null as number | null,
  overnightRateMin: null as number | null,
  overnightRateMax: null as number | null,
  minimumVisitHours: null as number | null,
  rateConfirmed: false,
  showPrices: true,
  rateSource: null as string | null,
} as const;

export const service = {
  hospiceSupport: toConfirm(false, "non-medical support alongside hospice/palliative teams"),
  dementiaSupport: toConfirm(
    false,
    "dementia/Alzheimer's support — never a service until confirmed",
  ),
  liveInCare: toConfirm(false, "live-in care — do not mention until confirmed"),
  transport: toConfirm(null as boolean | null, "do caregivers drive clients?"),
  fillPillOrganizers: toConfirm(
    null as boolean | null,
    "can caregivers fill weekly pill organizers?",
  ),
  overnightAwake: toConfirm(null as boolean | null, "awake vs sleep-over overnight shifts"),
  responseTimeOffice: toConfirm(null as string | null, "response time during office hours"),
  referralResponseTime: toConfirm(null as string | null, "referral response time"),
  typicalStartTime: toConfirm(null as string | null, "typical time from first call to first shift"),
  paymentOptions: toConfirm(
    ["Private pay", "Long-term care insurance", "VA benefits", "Medicaid waiver programs"],
    "which payment options Dawson accepts",
  ),
  languages: toConfirm([] as string[], "languages spoken"),
} as const;

export const integrations = {
  /** LeadConnector (GoHighLevel) form seen on the current site. */
  ghlFormId: verified("tkgwDE5LF5f9rgsw3R2x"),
  currentMetaDescription: verified("Personalized Attention for All Your Health-Related Needs"),
  /** Cloudflare Turnstile on the forms. Not wired yet, so its Privacy §2/§5 lines stay hidden. */
  turnstile: false as boolean,
} as const;

/** SMS + legal settings (COPY_LEGAL). */
export const sms = {
  consentVersion: "sms-v1-2026-10",
  emailPlanConsentVersion: "email-plan-v1-2026-10",
  marketingEnabled: true,
} as const;

export const legal = {
  /** Set by hand on the day each page goes live (COPY_LEGAL §0). */
  updated: {
    privacy: null as string | null,
    sms: null as string | null,
    accessibility: null as string | null,
  },
  analytics: "none" as "none" | "ga4" | "ga4-ads",
  /** Date of the last full accessibility review (ISO). Accessibility §5 renders only once set. */
  a11yAuditDate: null as string | null,
} as const;

/** Runtime flags from the environment (.env.example documents them). */
export const flags = {
  showPlaceholders: process.env.NEXT_PUBLIC_SHOW_PLACEHOLDERS !== "false",
  logoFigure: (process.env.NEXT_PUBLIC_LOGO_FIGURE === "b" ? "b" : "a") as "a" | "b",
  smoothScroll: process.env.NEXT_PUBLIC_SMOOTH_SCROLL === "true",
  indexable: process.env.NEXT_PUBLIC_INDEXABLE === "true",
} as const;

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
