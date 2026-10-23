/**
 * Free assessment — /free-assessment (docs/COPY_CONVERSION.md §3), verbatim. Field values are the
 * shared vocabulary (§0) used by the quiz, estimator and GoHighLevel — never rename one alone.
 */
import { areas } from "./areas";

export const assessmentMeta = {
  title: "Free In-Home Care Assessment | Dawson & Dawson, Beaufort SC",
  description:
    "Request a free, no-obligation home visit from our owner. Tell us a little about your family in 2 minutes and we'll call you to set it up.",
};

export const assessmentHero = {
  eyebrow: "Free care assessment",
  title: ["A free visit at home, with our", "owner", "."] as [string, string, string],
  lead: "Tell us a little about your family. We'll call you, then our owner comes to your loved one's home to plan care with you. Free, with no obligation.",
  microcopy: "About 2 minutes · 5 short steps",
  strip: ["Free", "No obligation", "Our owner visits"],
};

export const STEP_NAMES = ["Who", "Help", "Timing", "You", "Send"] as const;

export const careForOptions = [
  { value: "parent", label: "My parent" },
  { value: "spouse", label: "My spouse or partner" },
  { value: "self", label: "Myself" },
  { value: "someone-else", label: "Someone else" },
] as const;
export type CareFor = (typeof careForOptions)[number]["value"];

export const serviceOptions = [
  { value: "personal-care", title: "Personal Care", line: "Bathing, dressing and getting around" },
  {
    value: "home-help",
    title: "Home Help",
    line: "Meals, laundry, errands and medication reminders",
  },
  { value: "companionship", title: "Companionship", line: "Company, conversation and getting out" },
  { value: "respite-care", title: "Respite Care", line: "A break for the family caregiver" },
  {
    value: "24-hour-care",
    title: "24-Hour & Overnight Care",
    line: "Someone there, day and night",
  },
  {
    value: "hospice-support",
    title: "Support alongside a hospice team",
    line: "Non-medical comfort and company",
    tbc: "[Hospice/palliative support — to confirm]",
  },
  { value: "not-sure", title: "Not sure yet", line: "Help me decide" },
] as const;
export type ServiceValue = (typeof serviceOptions)[number]["value"];

export const startOptions = [
  { value: "asap", label: "As soon as possible" },
  { value: "two-weeks", label: "Within 2 weeks" },
  { value: "month", label: "Within a month" },
  { value: "exploring", label: "Just exploring" },
] as const;

export const hoursOptions = [
  {
    value: "few-hours-week",
    label: "A few hours a week",
    help: "Like 3 hours, twice a week",
    weekly: 6,
  },
  {
    value: "few-hours-most-days",
    label: "A few hours most days",
    help: "Like 4 hours, 5 days a week",
    weekly: 20,
  },
  { value: "full-days", label: "Full days", help: "Like 8 hours, 5 days a week", weekly: 40 },
  {
    value: "around-the-clock",
    label: "Around the clock",
    help: "Day and night, 7 days a week",
    weekly: 168,
  },
  { value: "not-sure", label: "Not sure yet", help: "We'll work it out together", weekly: null },
] as const;

export const contactOptions = [
  { value: "call", label: "Phone call" },
  { value: "text", label: "Text message" },
  { value: "email", label: "Email" },
] as const;

export const bestTimeOptions = [
  { value: "morning", label: "Morning (8–11 AM)" },
  { value: "midday", label: "Midday (11 AM–2 PM)" },
  { value: "afternoon", label: "Afternoon (2–5 PM)" },
  { value: "any", label: "Any time" },
] as const;

const byName = (a: { name: string }, b: { name: string }) => a.name.localeCompare(b.name);
export const townGroups = [
  {
    label: "Near our office",
    options: areas
      .filter((a) => a.tier === "primary")
      .sort(byName)
      .map((a) => ({ value: a.slug, label: a.name })),
  },
  {
    label: "Extended service area",
    options: areas
      .filter((a) => a.tier === "extended")
      .sort(byName)
      .map((a) => ({ value: a.slug, label: a.name })),
  },
];
export const townLabel = (v: string, other = "") =>
  v === "other"
    ? other.trim() || "Somewhere else"
    : v === "not-sure"
      ? "Not sure"
      : (areas.find((a) => a.slug === v)?.name ?? v);
export const isExtendedTown = (v: string) => areas.find((a) => a.slug === v)?.tier === "extended";

export const ASSESSMENT_STORAGE_KEY = "dawson.assessment.v1";
export const THANKYOU_KEY = "dawson.thankyou.v1";
