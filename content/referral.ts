/**
 * Referral form options (COPY_CONVERSION §5 "03 — Fast referral form"). Town list = the
 * assessment form's (content/assessment.ts townGroups).
 */
export const roleOptions = [
  { value: "discharge-planner", label: "Discharge planner" },
  { value: "case-manager", label: "Case manager" },
  { value: "social-worker", label: "Social worker" },
  { value: "hospice-team", label: "Hospice team" },
  { value: "physician-office", label: "Physician's office" },
  { value: "other", label: "Other" },
] as const;

export const reachByOptions = [
  { value: "phone", label: "Phone" },
  { value: "email", label: "Email" },
] as const;

export const referralServiceOptions = [
  { value: "personal-care", label: "Personal Care — bathing, dressing, toileting, transfers" },
  {
    value: "home-help",
    label: "Home Help — meals, housekeeping, errands, medication reminders",
  },
  { value: "companionship", label: "Companionship" },
  { value: "respite-care", label: "Respite Care" },
  { value: "24-hour-care", label: "24-Hour & Overnight Care" },
  {
    value: "hospice-support",
    label: "Support alongside hospice or palliative care",
    tbc: "[Hospice/palliative support — to confirm]",
  },
  { value: "not-sure", label: "Not sure — let's discuss" },
] as const;
export type ReferralService = (typeof referralServiceOptions)[number]["value"];

export const referralStartOptions = [
  { value: "asap", label: "As soon as possible" },
  { value: "date", label: "On a specific date" },
  { value: "two-weeks", label: "Within 2 weeks" },
  { value: "not-sure", label: "Not sure yet" },
] as const;

export const referralHoursOptions = [
  { value: "few-hours-week", label: "A few hours a week" },
  { value: "few-hours-most-days", label: "A few hours most days" },
  { value: "full-days", label: "Full days" },
  { value: "around-the-clock", label: "Around the clock" },
  { value: "not-sure", label: "Not sure yet" },
] as const;

export const REFERRAL_PERMISSION =
  "I have the client's or family's permission to share this information with Dawson and Dawson Home Care LLC.";
