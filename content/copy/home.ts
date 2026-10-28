/**
 * Home page copy — docs/COPY_HOME.md, verbatim, with the design-vs-copy calls recorded in
 * docs/BUILD_DECISIONS.md (§D3 + §H). Service names/promises/labels live in content/navigation.ts.
 */
import type { ServiceSlug } from "@/content/navigation";
import { FOUNDED_YEAR } from "@/content/site.config";

export const hero = {
  /** SEO_PLAN D1 (answer 10): eyebrow added above the H1. */
  eyebrow: "In-home care · Beaufort, SC",
  /** H1 — owner version is live; the family-run swap waits on business.familyRun. */
  headline: {
    before: "Care that feels like",
    accent: "family",
    owner: "— from an owner who meets yours.",
    familyRun: "— because it's run by one.",
  },
  lead: "Help at home for a few hours or around the clock, 7 days a week. Local. Owner-run. Here since 2002.",
  primary: {
    open: "Get a Free Care Assessment",
    closed: "Request a Callback",
    href: "/free-assessment",
  },
  microcopy: "Free visit at home. No obligation.",
  /** BUILD_DECISIONS D3 row 15: approved trust-row words + the approved screen-reader sentence. */
  trust: [`Since ${FOUNDED_YEAR}`, "Owner-run", "Care 24/7"] as const,
  trustSr: `Caring for families since ${FOUNDED_YEAR}. Owner-run. Care available 24 hours a day, 7 days a week.`,
  image: {
    src: "/images/hero-caregivers.jpg",
    // Alt describes what the placeholder photo actually shows (COPY_HOME conventions).
    alt: "Two smiling Dawson caregivers in lavender uniforms, standing in a family's living room.",
    width: 2000,
    height: 1116,
  },
} as const;

export const moment = {
  eyebrow: "01 — The moment",
  /** Design splits the H2 into a light line and a big Anton line (weight 400, never 300). */
  titleLead: ["It", "usually", "starts", "with"],
  titleBig: { before: "a", accent: "moment." },
  /** 4 lines — BUILD_DECISIONS answer 3 (the copy's 5th line isn't used). */
  lines: [
    { text: "Mom missed her pills again.", image: "/images/moment-1.jpg" },
    { text: "Dad fell getting out of the shower.", image: "/images/moment-2.jpg" },
    { text: "She hasn't left the house in a week.", image: "/images/moment-3.jpg" },
    { text: "You live three hours away.", image: "/images/moment-4.jpg" },
  ],
  resolution: "You don't have to figure this out alone.",
  followUp: "We've helped Lowcountry families through moments like these since 2002.",
  link: "See how we can help ↓",
  skip: "Skip to how we help",
} as const;

export const howWeHelp = {
  eyebrow: "02 — How we help",
  title: "Every kind of help, under one roof.",
  /** Design wording — the copy's subline describes the dropped house (BUILD_DECISIONS row 18). */
  subline: "Keep scrolling to see each way we help.",
  skip: "Skip to the next section",
  cardLink: "See how we help",
  after: "Most families combine two or three. Your plan is built around your loved one.",
  nonMedical: "All our care is non-medical. We work alongside your home health team.",
  hospice:
    "Already working with a hospice or palliative team? We can provide non-medical comfort and companionship alongside them.",
  hospicePlaceholder: "[Hospice/palliative support — to confirm]",
  allServices: { label: "See all care services", href: "/care" },
} as const;

/**
 * Video collages (design 01-home-desktop "How we help"). Coordinates are the design's, on its
 * 700 × 620 collage canvas: a lavender panel plus 2–3 portrait videos (240 × 420), stacked by z.
 */
export type CollageClip = { name: string; left: number; top: number };
export type Collage = {
  panel: { left: number; top: number; width: number; height: number };
  clips: CollageClip[];
};

export const collages: Record<ServiceSlug, Collage> = {
  "personal-care": {
    panel: { left: 202, top: 38, width: 343, height: 564 },
    clips: [
      { name: "personal-care-1", left: 413, top: 110 },
      { name: "personal-care-2", left: 252, top: 183 },
      { name: "personal-care-3", left: 92, top: 38 },
    ],
  },
  "home-help": {
    panel: { left: 217, top: 33, width: 343, height: 562 },
    clips: [
      { name: "home-help-1", left: 268, top: 32 },
      { name: "home-help-3", left: 106, top: 92 },
      { name: "home-help-2", left: 432, top: 177 },
    ],
  },
  companionship: {
    panel: { left: 193, top: 46, width: 343, height: 562 },
    clips: [
      { name: "companionship-1", left: 245, top: 122 },
      { name: "companionship-3", left: 81, top: 48 },
      { name: "companionship-2", left: 410, top: 192 },
    ],
  },
  // Two-clip collages: moved right of the design (+44 / +40) so they rest centred like the
  // three-clip ones above (owner, Oct 2026).
  "24-hour-care": {
    panel: { left: 212, top: 50, width: 343, height: 563 },
    clips: [
      { name: "24-hour-care-1", left: 143, top: 50 },
      { name: "24-hour-care-2", left: 384, top: 195 },
    ],
  },
  "respite-care": {
    panel: { left: 213, top: 39, width: 343, height: 563 },
    clips: [
      { name: "respite-care-1", left: 385, top: 39 },
      { name: "respite-care-2", left: 143, top: 182 },
    ],
  },
};
