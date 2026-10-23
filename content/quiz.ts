// content/quiz.ts — Care Quiz "Find the right care" (07 §1): /find-care + Home ch. 4 teaser.
// Copy is final (COPY_CONVERSION.md §9). Edit copy here, not in components.
//
// RULES
// - Pure data + pure helpers. No DOM, no storage, no fetch. Components own sessionStorage
//   (QUIZ_STORAGE_KEY), the GHL post and the office-status tokens.
// - Templates use {tokens}. fill() resolves subject tokens ({lovedOne}, {they}, {their}…) and any
//   vars you pass. Unknown tokens are left as-is for the component ({nextOpen}, {town}, {in}).
// - Values (ids) match the assessment form, the estimator presets (COPY_COST_FAQ) and GHL fields
//   (08 §2). Never rename an id without updating all three.
// - Hospice support is confirmed:false. Until confirmed it is never recommended in production
//   (visible only when NEXT_PUBLIC_SHOW_PLACEHOLDERS=true). The Q2 hospice option itself always
//   shows — it describes the family's situation, not a Dawson claim.
// - Nothing sensitive ever goes in a URL (09 §2). Answers travel to /free-assessment via
//   sessionStorage only; the estimator link carries hours/days/overnight only.

import { areas, getArea, type Area } from "./areas";
import { SHOW_PLACEHOLDERS } from "./blocks";

// ── IDs ──────────────────────────────────────────────────────────────────────

export type CareFor = "parent" | "spouse" | "self" | "someone-else";

export type NeedId =
  | "bathing-dressing"
  | "house"
  | "lonely"
  | "hospital"
  | "night"
  | "caregiver-break"
  | "hospice"
  | "something-else";

/** Same ids as the estimator presets (COPY_COST_FAQ `estimator_preset`) + "not-sure". */
export type HoursId =
  "few-hours-week" | "few-hours-most-days" | "full-days" | "around-the-clock" | "not-sure";

export type UrgencyId = "asap" | "two-weeks" | "month" | "exploring";

export type ServiceSlug =
  "personal-care" | "home-help" | "companionship" | "respite-care" | "24-hour-care";

export type RecommendationId = ServiceSlug | "hospice-support";

/** Q5 value: an areas.ts slug, "other" or "not-sure". */
export type TownValue = string;

export interface QuizAnswers {
  careFor: CareFor | null;
  needs: NeedId[];
  hours: HoursId | null;
  urgency: UrgencyId | null;
  town: TownValue | null;
  /** Free text when town === "other". Optional, max 60 chars. */
  townOther: string;
}

export const emptyAnswers: QuizAnswers = {
  careFor: null,
  needs: [],
  hours: null,
  urgency: null,
  town: null,
  townOther: "",
};

export const QUIZ_STORAGE_KEY = "dawson.quiz.v1";
export const TOWN_OTHER_MAX = 60;

// ── Subject (pronouns from Q1) ───────────────────────────────────────────────

export interface Subject {
  lovedOne: string;
  LovedOne: string;
  they: string;
  They: string;
  their: string;
  Their: string;
  theyre: string;
  Theyre: string;
  them: string;
  themselves: string;
}

const third = (lovedOne: string): Subject => ({
  lovedOne,
  LovedOne: lovedOne.charAt(0).toUpperCase() + lovedOne.slice(1),
  they: "they",
  They: "They",
  their: "their",
  Their: "Their",
  theyre: "they're",
  Theyre: "They're",
  them: "them",
  themselves: "themselves",
});

export const subjects: Record<CareFor, Subject> = {
  parent: third("your parent"),
  spouse: third("your spouse or partner"),
  self: {
    lovedOne: "you",
    LovedOne: "You",
    they: "you",
    They: "You",
    their: "your",
    Their: "Your",
    theyre: "you're",
    Theyre: "You're",
    them: "you",
    themselves: "yourself",
  },
  "someone-else": third("your loved one"),
};

/** Used before Q1 is answered (e.g. a deep link straight into Q2). */
export const defaultSubject: Subject = third("your loved one");

export const subjectFor = (careFor: CareFor | null): Subject =>
  careFor ? subjects[careFor] : defaultSubject;

/** Resolve {tokens}. Subject tokens first, then vars. Unknown tokens are left untouched. */
export function fill(
  template: string,
  subject: Subject,
  vars: Record<string, string> = {},
): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => {
    if (key in subject) return subject[key as keyof Subject];
    const v = vars[key];
    return v !== undefined ? v : match;
  });
}

// ── Page + shared UI copy ────────────────────────────────────────────────────

export const quizUi = {
  eyebrow: "Find the right care",
  h1: "Find the right care.",
  lead: "Most families aren't sure what they need. Answer five quick questions and we'll suggest a plan.",
  microcopy: "About 1 minute · No email needed",
  progress: "Question {n} of 5",
  /** Shown only when a question has no auto-advance (multi + select). */
  continueLabel: "Continue",
  finalLabel: "See my suggestion",
  backLabel: "Back",
  /** Visually hidden live-region text after a single-select answer. */
  selectedAnnouncement: "{answer} selected. Next question.",
  /** No-JS / script failure fallback. */
  noScript:
    "The quiz needs JavaScript to run. You can still get help: call (843) 379-3321, or see our care services.",
  noScriptLinks: [
    { label: "See our care services", href: "/care" },
    { label: "Get a Free Care Assessment", href: "/free-assessment" },
  ],
  /** Shown when sessionStorage has an unfinished quiz. */
  resume: {
    text: "Welcome back. We kept your answers.",
    continueLabel: "Pick up where I left off",
    restartLabel: "Start over",
  },
  restartAnnouncement: "Quiz restarted. Question 1 of 5.",
} as const;

// ── Questions ────────────────────────────────────────────────────────────────

export interface QuizOption<V extends string> {
  value: V;
  label: string;
  /** Small second line under the label. */
  helper?: string;
  /** Line-illustration file in /public/illustrations/quiz/ — always aria-hidden. */
  illustration: string;
}

interface QuestionBase {
  step: 1 | 2 | 3 | 4 | 5;
  /** Rendered as H2. May contain subject tokens. */
  title: string;
  helper: string;
  /** Error text when Continue is pressed with no valid answer. Single-select auto-advances, so "". */
  error: string;
}

export interface CareForQuestion extends QuestionBase {
  id: "careFor";
  kind: "single";
  options: QuizOption<CareFor>[];
}
export interface NeedsQuestion extends QuestionBase {
  id: "needs";
  kind: "multi";
  options: QuizOption<NeedId>[];
}
export interface HoursQuestion extends QuestionBase {
  id: "hours";
  kind: "single";
  options: QuizOption<HoursId>[];
}
export interface UrgencyQuestion extends QuestionBase {
  id: "urgency";
  kind: "single";
  options: QuizOption<UrgencyId>[];
}
export interface TownQuestion extends QuestionBase {
  id: "town";
  kind: "select";
  /** Visible <label> for the <select>. */
  label: string;
  /** First, empty <option>. */
  emptyOption: string;
  groups: { label: string; options: { value: string; label: string }[] }[];
  extraOptions: { value: "other" | "not-sure"; label: string }[];
  otherLabel: string;
  otherHelper: string;
}

export type QuizQuestion =
  CareForQuestion | NeedsQuestion | HoursQuestion | UrgencyQuestion | TownQuestion;

const byName = (a: Area, b: Area) => a.name.localeCompare(b.name);
const townGroup = (tier: Area["tier"]) =>
  areas
    .filter((a) => a.tier === tier)
    .sort(byName)
    .map((a) => ({ value: a.slug, label: a.name }));

export const questions: QuizQuestion[] = [
  {
    id: "careFor",
    kind: "single",
    step: 1,
    title: "Who is the care for?",
    helper: "Tap an answer to keep going.",
    error: "",
    // Labels match COPY_HOME ch. 4 verbatim (the inline teaser).
    options: [
      { value: "parent", label: "My parent", illustration: "q1-parent.svg" },
      { value: "spouse", label: "My spouse or partner", illustration: "q1-spouse.svg" },
      { value: "self", label: "Myself", illustration: "q1-self.svg" },
      { value: "someone-else", label: "Someone else", illustration: "q1-someone-else.svg" },
    ],
  },
  {
    id: "needs",
    kind: "multi",
    step: 2,
    title: "What's happening right now?",
    helper: "Choose all that apply.",
    error: 'Please choose at least one — or choose "Something else."',
    options: [
      {
        value: "bathing-dressing",
        label: "Bathing or dressing is getting hard",
        illustration: "q2-bathing.svg",
      },
      {
        value: "house",
        label: "The house is getting hard to keep up",
        illustration: "q2-house.svg",
      },
      { value: "lonely", label: "Feeling lonely or cut off", illustration: "q2-lonely.svg" },
      {
        value: "hospital",
        label: "Just home from the hospital or rehab",
        helper: "Or coming home soon",
        illustration: "q2-hospital.svg",
      },
      { value: "night", label: "Not safe alone at night", illustration: "q2-night.svg" },
      {
        value: "caregiver-break",
        label: "A family caregiver needs a break",
        illustration: "q2-break.svg",
      },
      { value: "hospice", label: "On hospice or palliative care", illustration: "q2-hospice.svg" },
      {
        value: "something-else",
        label: "Something else",
        helper: "Or I'm not sure",
        illustration: "q2-something-else.svg",
      },
    ],
  },
  {
    id: "hours",
    kind: "single",
    step: 3,
    title: "How much help do you think is needed?",
    helper: "A rough idea is fine. You can change it later.",
    error: "",
    // First four labels match the estimator quick-start buttons (COPY_COST_FAQ) exactly.
    options: [
      {
        value: "few-hours-week",
        label: "A few hours a week",
        helper: "Like 3 hours, twice a week",
        illustration: "q3-few-week.svg",
      },
      {
        value: "few-hours-most-days",
        label: "A few hours most days",
        helper: "Like 4 hours, 5 days a week",
        illustration: "q3-most-days.svg",
      },
      {
        value: "full-days",
        label: "Full days",
        helper: "Like 8 hours, 5 days a week",
        illustration: "q3-full-days.svg",
      },
      {
        value: "around-the-clock",
        label: "Around the clock",
        helper: "Day and night, 7 days a week",
        illustration: "q3-around-clock.svg",
      },
      {
        value: "not-sure",
        label: "Not sure yet",
        helper: "We'll work it out together",
        illustration: "q3-not-sure.svg",
      },
    ],
  },
  {
    id: "urgency",
    kind: "single",
    step: 4,
    title: "When would you like care to start?",
    helper: "Tap an answer to keep going.",
    error: "",
    options: [
      { value: "asap", label: "As soon as possible", illustration: "q4-asap.svg" },
      { value: "two-weeks", label: "Within 2 weeks", illustration: "q4-two-weeks.svg" },
      { value: "month", label: "Within a month", illustration: "q4-month.svg" },
      { value: "exploring", label: "Just exploring", illustration: "q4-exploring.svg" },
    ],
  },
  {
    id: "town",
    kind: "select",
    step: 5,
    title: "Where do {they} live?",
    helper: "So we can check we reach {their} town.",
    error: 'Please choose a town — or choose "Not sure."',
    label: "Town",
    emptyOption: "Choose a town",
    groups: [
      { label: "Near our office", options: townGroup("primary") },
      { label: "Extended service area", options: townGroup("extended") },
    ],
    extraOptions: [
      { value: "other", label: "Somewhere else" },
      { value: "not-sure", label: "Not sure" },
    ],
    otherLabel: "Which town? (optional)",
    otherHelper: "Type the town name. We'll check when we talk.",
  },
];

/** Can the person move on from this question? */
export function canContinue(q: QuizQuestion, a: QuizAnswers): boolean {
  switch (q.id) {
    case "careFor":
      return a.careFor !== null;
    case "needs":
      return a.needs.length > 0;
    case "hours":
      return a.hours !== null;
    case "urgency":
      return a.urgency !== null;
    case "town":
      return a.town !== null && a.town !== "";
  }
}

export const isComplete = (a: QuizAnswers): boolean => questions.every((q) => canContinue(q, a));

// ── Hours presets (match COPY_COST_FAQ estimator quick start exactly) ────────

export interface HoursPreset {
  hoursPerVisit: number;
  daysPerWeek: number;
  overnight: boolean;
  weeklyHours: number;
}

export const hoursPresets: Record<Exclude<HoursId, "not-sure">, HoursPreset> = {
  "few-hours-week": { hoursPerVisit: 3, daysPerWeek: 2, overnight: false, weeklyHours: 6 },
  "few-hours-most-days": { hoursPerVisit: 4, daysPerWeek: 5, overnight: false, weeklyHours: 20 },
  "full-days": { hoursPerVisit: 8, daysPerWeek: 5, overnight: false, weeklyHours: 40 },
  "around-the-clock": { hoursPerVisit: 24, daysPerWeek: 7, overnight: true, weeklyHours: 168 },
};

export const hoursCopy: Record<HoursId, { label: string; text: string }> = {
  "few-hours-week": {
    label: "A few hours a week",
    text: "About 6 hours a week to start — like 3 hours, twice a week.",
  },
  "few-hours-most-days": {
    label: "A few hours most days",
    text: "About 20 hours a week to start — like 4 hours, 5 days a week.",
  },
  "full-days": {
    label: "Full days",
    text: "About 40 hours a week to start — like 8 hours, 5 days a week.",
  },
  "around-the-clock": {
    label: "Around the clock",
    text: "Care around the clock — 168 hours a week, covered in shifts so a rested caregiver is always there.",
  },
  "not-sure": {
    label: "Not sure yet",
    text: "Not sure about hours yet? That's normal. We'll work it out together at your free visit.",
  },
};

// ── Recommendations (result cards) ───────────────────────────────────────────

export interface PairLine {
  id: RecommendationId;
  /** Why it pairs with the primary. Service-page lines (COPY_SERVICES "Pairs well with"). */
  reason: string;
}

export interface Recommendation {
  id: RecommendationId;
  name: string;
  href: string;
  /** Same promise as COPY_HOME ch. 3 / COPY_SERVICES hub. */
  promise: string;
  /** One sentence under "Our suggestion". Subject tokens allowed. */
  intro: string;
  /** Exactly three. Subject tokens allowed. */
  bullets: [string, string, string];
  /** Fallback "also helpful" when only one service scored. In order. */
  pairs: PairLine[];
  /** Link text on the card. */
  linkLabel: string;
  confirmed: boolean;
}

export const recommendations: Record<RecommendationId, Recommendation> = {
  "personal-care": {
    id: "personal-care",
    name: "Personal Care",
    href: "/care/personal-care",
    promise: "Help with bathing, dressing and getting around — with dignity.",
    intro:
      "Gentle, hands-on help with the daily things that have gotten harder — so {they} can stay home and stay {themselves}.",
    bullets: [
      "Bathing and showering, safely",
      "Dressing and grooming",
      "Using the bathroom and moving around the house",
    ],
    pairs: [
      { id: "home-help", reason: "Meals, laundry and medication reminders on the same visit." },
      { id: "24-hour-care", reason: "When help is needed at night too." },
    ],
    linkLabel: "See Personal Care",
    confirmed: true,
  },
  "home-help": {
    id: "home-help",
    name: "Home Help",
    href: "/care/home-help",
    promise: "Meals, laundry, errands and medication reminders, so the house keeps running.",
    intro: "Help with the everyday things that keep a home safe, comfortable and {their} own.",
    bullets: [
      "Meals planned and cooked",
      "Laundry and light housekeeping",
      "Groceries, errands and medication reminders",
    ],
    pairs: [
      { id: "companionship", reason: "Someone to talk to while the chores get done." },
      { id: "personal-care", reason: "Help with bathing and dressing on the same visit." },
    ],
    linkLabel: "See Home Help",
    confirmed: true,
  },
  companionship: {
    id: "companionship",
    name: "Companionship",
    href: "/care/companionship",
    promise: "Company, conversation and getting out of the house.",
    intro:
      "Regular, friendly visits that give {them} good company and something to look forward to.",
    bullets: [
      "Conversation and good company",
      "Games, puzzles, music and hobbies",
      "Daily walks and trips to the park",
    ],
    pairs: [
      { id: "home-help", reason: "Lunch cooked, laundry done and a good chat, all in one visit." },
      {
        id: "respite-care",
        reason: "Company at home while the family caregiver takes a well-earned break.",
      },
    ],
    linkLabel: "See Companionship",
    confirmed: true,
  },
  "respite-care": {
    id: "respite-care",
    name: "Respite Care",
    href: "/care/respite-care",
    promise: "A break for you. Your loved one keeps their routine.",
    intro:
      "We step in for a few hours, a weekend or longer, so the family caregiver can rest — and the routine at home stays the same.",
    bullets: [
      "A few hours, a weekend or longer",
      "Regular breaks or one-time cover",
      "Any of our care while the family caregiver is away",
    ],
    pairs: [
      {
        id: "personal-care",
        reason: "Hands-on help with bathing and dressing while the family caregiver is away.",
      },
      {
        id: "24-hour-care",
        reason: "For trips and weekends when someone needs to be there at night.",
      },
    ],
    linkLabel: "See Respite Care",
    confirmed: true,
  },
  "24-hour-care": {
    id: "24-hour-care",
    name: "24-Hour & Overnight Care",
    href: "/care/24-hour-care",
    promise: "Someone there, day and night.",
    intro:
      "A caregiver through the night, or around the clock in shifts — so {theyre} never alone when it matters most.",
    bullets: [
      "Overnight care, bedtime to morning",
      "Safe nighttime bathroom trips",
      "Shifts covered 7 days a week",
    ],
    pairs: [
      { id: "personal-care", reason: "Help with bathing and dressing, morning and night." },
      {
        id: "respite-care",
        reason: "Overnight cover so the family caregiver can sleep or travel.",
      },
    ],
    linkLabel: "See 24-Hour & Overnight Care",
    confirmed: true,
  },
  "hospice-support": {
    id: "hospice-support",
    name: "Support alongside your hospice team",
    href: "/faq#hm-hospice",
    promise:
      "[[TO CONFIRM: hospice/palliative support]] Non-medical comfort and companionship alongside your hospice or palliative team.",
    intro:
      '[[TO CONFIRM — draft: "Non-medical comfort and companionship alongside {their} hospice or palliative team, for the hours in between their visits."]]',
    bullets: [
      '[[TO CONFIRM — draft: "Sitting with {them} so the family can rest"]]',
      '[[TO CONFIRM — draft: "Help with meals and personal care"]]',
      '[[TO CONFIRM — draft: "Company in the hours between hospice visits"]]',
    ],
    pairs: [
      { id: "companionship", reason: "Company and comfort, so the family can rest." },
      { id: "respite-care", reason: "A break for the family during a hard time." },
    ],
    linkLabel: "Read about hospice and home care",
    confirmed: false,
  },
};

/** Not-sure result lists these, in this order. */
export const serviceOrder: ServiceSlug[] = [
  "personal-care",
  "home-help",
  "companionship",
  "respite-care",
  "24-hour-care",
];

export const isAvailable = (id: RecommendationId): boolean =>
  recommendations[id].confirmed || SHOW_PLACEHOLDERS;

// ── Scoring (07 §1 mapping) ──────────────────────────────────────────────────
// Points per answer. Highest score = primary. Ties broken by PRIORITY (safety first).
// Next highest scorers (score > 0) = "also helpful", max 2. If nothing else scored,
// the primary's first available pair fills one "also helpful" slot.

type Points = Partial<Record<RecommendationId, number>>;

const NEED_POINTS: Record<NeedId, Points> = {
  "bathing-dressing": { "personal-care": 3 },
  house: { "home-help": 3 },
  lonely: { companionship: 3 },
  // Transition support: Personal Care + Home Help.
  hospital: { "personal-care": 3, "home-help": 2 },
  night: { "24-hour-care": 3 },
  "caregiver-break": { "respite-care": 3 },
  // Hospice support (TO CONFIRM) + Companionship; Respite as a light "also" for the family.
  hospice: { "hospice-support": 4, companionship: 3, "respite-care": 1 },
  "something-else": {},
};

const HOURS_POINTS: Partial<Record<HoursId, Points>> = {
  "around-the-clock": { "24-hour-care": 3 },
};

export const PRIORITY: RecommendationId[] = [
  "24-hour-care",
  "hospice-support",
  "respite-care",
  "personal-care",
  "home-help",
  "companionship",
];

export type ReasonId = Exclude<NeedId, "something-else"> | "around-the-clock";

/** "Why we suggest this" lines. Subject tokens allowed. */
export const reasonText: Record<ReasonId, string> = {
  "bathing-dressing": "You said bathing or dressing is getting hard.",
  house: "You said the house is getting hard to keep up.",
  lonely: "You said {theyre} feeling lonely or cut off.",
  hospital: "You said {theyre} just home from the hospital or rehab, or coming home soon.",
  night: "You said {theyre} not safe alone at night.",
  "caregiver-break": "You said a family caregiver needs a break.",
  hospice: "You said {theyre} on hospice or palliative care.",
  "around-the-clock": "You said {they} may need help around the clock.",
};

/**
 * When one answer adds points to two services, the second card gets its own line
 * instead of repeating the primary's reason. Subject tokens allowed.
 */
export const alsoReasonText: Partial<Record<ReasonId, Partial<Record<RecommendationId, string>>>> =
  {
    hospital: {
      "home-help": "Coming home is easier when meals, laundry and errands are taken care of.",
    },
    hospice: {
      companionship: "Company and comfort — for {them} and for the family.",
      "respite-care": "A break for the family during a hard time.",
    },
  };

export interface Score {
  id: RecommendationId;
  points: number;
  reasons: ReasonId[];
}

export function scoreQuiz(a: QuizAnswers): Score[] {
  const map = new Map<RecommendationId, Score>();
  const add = (points: Points, reason: ReasonId) => {
    for (const [id, p] of Object.entries(points) as [RecommendationId, number][]) {
      if (!isAvailable(id)) continue;
      const s = map.get(id) ?? { id, points: 0, reasons: [] };
      s.points += p;
      if (!s.reasons.includes(reason)) s.reasons.push(reason);
      map.set(id, s);
    }
  };
  for (const need of a.needs) {
    if (need !== "something-else") add(NEED_POINTS[need], need);
  }
  if (a.hours) {
    const hp = HOURS_POINTS[a.hours];
    if (hp && a.hours === "around-the-clock") add(hp, "around-the-clock");
  }
  return [...map.values()].sort(
    (x, y) => y.points - x.points || PRIORITY.indexOf(x.id) - PRIORITY.indexOf(y.id),
  );
}

// ── Result notes (situational, shown under the cards) ────────────────────────

export interface ResultNote {
  id: string;
  when: (a: QuizAnswers) => boolean;
  /** Subject tokens allowed. */
  text: string;
}

export const resultNotes: ResultNote[] = [
  {
    id: "night-few-hours",
    when: (a) =>
      a.needs.includes("night") &&
      (a.hours === "few-hours-week" || a.hours === "few-hours-most-days"),
    text: "Nights usually need more than a few hours of help. We'll work out a schedule that keeps {them} safe after dark.",
  },
  {
    id: "hospital",
    when: (a) => a.needs.includes("hospital"),
    text: "Still in the hospital or rehab? Call us before discharge if you can, so we can plan the first days home.",
  },
  {
    id: "hospice",
    when: (a) => a.needs.includes("hospice"),
    text: "All our care is non-medical. We don't replace the hospice team. Tell us who's on it, and we'll talk honestly about whether and how we can help.",
  },
  {
    id: "something-else",
    when: (a) => a.needs.includes("something-else") && a.needs.length > 1,
    text: "You also said something else is going on. Tell us about it when we talk — we'll build it into the plan.",
  },
];

// ── Urgency block (Q4) ───────────────────────────────────────────────────────
// `closed` replaces `text` when the office is closed. {nextOpen} and {ET} are filled by the component (lib/officeHours.ts).

export const urgencyCopy: Record<
  UrgencyId,
  { heading: string; text: string; closed?: string; safety?: string }
> = {
  asap: {
    heading: "Need care soon?",
    text: "The quickest way to start is a phone call. Our office is open now: (843) 379-3321.",
    closed:
      "Our office is closed right now. Request a callback and we'll reach you first thing {nextOpen}{ET}.",
    safety: "If someone is hurt or in danger, call 911.",
  },
  "two-weeks": {
    heading: "Starting in the next couple of weeks?",
    text: "The free visit is the first step. Book it now, and we'll plan the rest together.",
  },
  month: {
    heading: "Planning ahead?",
    text: "Good thinking. Book your free visit now, and start care when you're ready.",
  },
  exploring: {
    heading: "Just looking for now?",
    text: "That's fine — no pressure. Email yourself this plan, and come back when you're ready.",
  },
};

// ── Town block (Q5) ──────────────────────────────────────────────────────────

export const townCopy = {
  primary: "We care for families {in} {town}.",
  primaryLink: "See care {in} {town}",
  extended:
    "{town} is in our extended service area. We'll check scheduling for your hours when we talk.",
  otherNamed: "We'll check whether we can reach {townOther} when we talk.",
  otherBlank: "We'll check whether we can reach {their} town when we talk.",
  noPageCall: "Call (843) 379-3321 and we'll talk about care {in} {town}.",
} as const;

// ── Result screen copy ───────────────────────────────────────────────────────

export const resultUi = {
  headline: "Here's what we'd suggest for {lovedOne}.",
  intro:
    "Based on your answers. It's a starting point, not a package — every plan is built around {lovedOne} at a free visit.",
  primaryLabel: "Our suggestion",
  whyLabel: "Why we suggest this",
  alsoHeading: "Also helpful",
  hoursHeading: "Hours to start",
  hoursNote: "These are example schedules. We'll set the real one together.",
  costHeading: "What it might cost",
  costLink: "Adjust it in the full estimator",
  nonMedical: "All our care is non-medical. We work alongside home health and hospice teams.",
  cta: {
    heading: "Next step: a free visit at home",
    text: "Our owner comes to {their} home, meets the family and builds the plan with you. Free, with no obligation.",
    primary: "Get a Free Care Assessment",
    primaryAfterHours: "Request a Callback",
    helper: "We've filled in your answers, so it only takes a minute.",
    secondary: "Call (843) 379-3321",
  },
  changeAnswers: "Change my answers",
  startOver: "Start over",
  notSure: {
    headline: "Let's figure it out together.",
    intro:
      "Your answers don't point to one kind of help — and that's completely normal. Most families combine two or three. At a free visit, our owner will help you work out exactly what fits.",
    listHeading: "The ways we help",
  },
  emailPlan: {
    heading: "Want a copy?",
    text: "We'll email this plan to you — handy for sharing with family.",
    emailLabel: "Your email (required)",
    nameLabel: "Your first name",
    consent:
      "Yes, email me this plan. Dawson and Dawson Home Care LLC may follow up by email about it. I can unsubscribe at any time.",
    button: "Email me this plan",
    sending: "Sending…",
    success: "Sent. Check your inbox — and your spam folder, just in case.",
    privacy: "We'll only use your email to send this plan and follow up about it.",
  },
} as const;

// ── Result builder ───────────────────────────────────────────────────────────

export interface ResultCard {
  id: RecommendationId;
  name: string;
  href: string;
  linkLabel: string;
  promise: string;
  intro: string;
  bullets: string[];
  /** Resolved "why" lines (primary) or the single reason line (also helpful). */
  reasons: string[];
  confirmed: boolean;
}

export interface QuizResult {
  kind: "recommendation" | "not-sure";
  subject: Subject;
  headline: string;
  intro: string;
  primary: ResultCard | null;
  also: ResultCard[];
  hours: { id: HoursId | null; label: string; text: string; preset: HoursPreset | null };
  notes: string[];
  urgency: { heading: string; text: string; closed: string | null; safety: string | null } | null;
  town: { text: string; link: { label: string; href: string } | null } | null;
  /** Primary first. Sent as quiz_services. */
  services: RecommendationId[];
}

const toCard = (id: RecommendationId, s: Subject, reasons: string[]): ResultCard => {
  const r = recommendations[id];
  return {
    id,
    name: r.name,
    href: r.href,
    linkLabel: r.linkLabel,
    promise: r.promise,
    intro: fill(r.intro, s),
    bullets: r.bullets.map((b) => fill(b, s)),
    reasons: reasons.map((t) => fill(t, s)),
    confirmed: r.confirmed,
  };
};

function buildTown(a: QuizAnswers, s: Subject): QuizResult["town"] {
  if (!a.town || a.town === "not-sure") return null;
  if (a.town === "other") {
    const named = a.townOther.trim().slice(0, TOWN_OTHER_MAX);
    return {
      text: named
        ? fill(townCopy.otherNamed, s, { townOther: named })
        : fill(townCopy.otherBlank, s),
      link: null,
    };
  }
  const area = getArea(a.town);
  if (!area) return null;
  const vars = { in: area.preposition, town: area.name };
  if (area.tier === "extended") return { text: fill(townCopy.extended, s, vars), link: null };
  return {
    text: fill(townCopy.primary, s, vars),
    link: area.hasPage
      ? { label: fill(townCopy.primaryLink, s, vars), href: `/areas-we-serve/${area.slug}` }
      : null,
  };
}

export function buildResult(a: QuizAnswers): QuizResult {
  const s = subjectFor(a.careFor);
  const scores = scoreQuiz(a);
  const top = scores[0];

  const hoursId = a.hours;
  const hours: QuizResult["hours"] = {
    id: hoursId,
    label: hoursId ? hoursCopy[hoursId].label : hoursCopy["not-sure"].label,
    text: hoursId ? hoursCopy[hoursId].text : hoursCopy["not-sure"].text,
    preset: hoursId && hoursId !== "not-sure" ? hoursPresets[hoursId] : null,
  };

  const u = a.urgency ? urgencyCopy[a.urgency] : null;
  const urgency: QuizResult["urgency"] = u
    ? {
        heading: u.heading,
        text: fill(u.text, s),
        closed: u.closed ? fill(u.closed, s) : null,
        safety: u.safety ?? null,
      }
    : null;

  const notes = resultNotes.filter((n) => n.when(a)).map((n) => fill(n.text, s));
  const town = buildTown(a, s);

  if (!top) {
    return {
      kind: "not-sure",
      subject: s,
      headline: resultUi.notSure.headline,
      intro: resultUi.notSure.intro,
      primary: null,
      also: [],
      hours,
      notes,
      urgency,
      town,
      services: [],
    };
  }

  const primary = toCard(
    top.id,
    s,
    top.reasons.map((r) => reasonText[r]),
  );

  const also: ResultCard[] = scores
    .slice(1)
    .filter((x) => x.points > 0)
    .slice(0, 2)
    .map((x) => {
      // Prefer a reason the primary doesn't already show. Use the card-specific line if one exists.
      const reason = x.reasons.find((r) => !top.reasons.includes(r)) ?? x.reasons[0];
      const line = reason ? (alsoReasonText[reason]?.[x.id] ?? reasonText[reason]) : null;
      return toCard(x.id, s, line ? [line] : []);
    });

  if (also.length === 0) {
    const pair = recommendations[top.id].pairs.find((p) => isAvailable(p.id));
    if (pair) also.push(toCard(pair.id, s, [pair.reason]));
  }

  return {
    kind: "recommendation",
    subject: s,
    headline: fill(resultUi.headline, s),
    intro: fill(resultUi.intro, s),
    primary,
    also,
    hours,
    notes,
    urgency,
    town,
    services: [primary.id, ...also.map((c) => c.id)],
  };
}

// ── Hand-offs ────────────────────────────────────────────────────────────────

/** GHL custom fields (07 §1 + 08 §2). quiz_needs and quiz_primary are additions. */
export function toGhlFields(a: QuizAnswers, r: QuizResult): Record<string, string> {
  const other = a.townOther.trim().slice(0, TOWN_OTHER_MAX);
  return {
    quiz_for: a.careFor ?? "",
    quiz_needs: a.needs.join(","),
    quiz_services: r.services.join(","),
    quiz_primary: r.primary?.id ?? "not-sure",
    quiz_hours: a.hours ?? "",
    quiz_urgency: a.urgency ?? "",
    quiz_town: a.town === "other" ? (other ? `other:${other}` : "other") : (a.town ?? ""),
  };
}

/** GHL tag added to every lead that finished the quiz. */
export const QUIZ_TAG = "quiz-completed";

export interface AssessmentPrefill {
  care_for: CareFor | null;
  /** Pre-ticked in Step 2. "not-sure" ticks "Not sure yet — help me decide". */
  services: (RecommendationId | "not-sure")[];
  hours: HoursId | null;
  start_timing: UrgencyId | null;
  town: string | null;
  town_other: string;
  coming_from_hospital: boolean;
  prefill_source: "quiz";
}

/** Written to sessionStorage ("dawson.assessment.prefill.v1") before navigating to /free-assessment?from=quiz. */
export function toAssessmentPrefill(a: QuizAnswers, r: QuizResult): AssessmentPrefill {
  return {
    care_for: a.careFor,
    services: r.services.length ? r.services : ["not-sure"],
    hours: a.hours,
    start_timing: a.urgency,
    town: a.town,
    town_other: a.townOther.trim().slice(0, TOWN_OTHER_MAX),
    coming_from_hospital: a.needs.includes("hospital"),
    prefill_source: "quiz",
  };
}

export const ASSESSMENT_PREFILL_KEY = "dawson.assessment.prefill.v1";
export const assessmentHref = "/free-assessment?from=quiz";

/** Full estimator link — hours only, nothing sensitive. */
export function estimatorHref(hours: HoursId | null): string {
  if (!hours || hours === "not-sure") return "/paying-for-care?from=quiz#estimator";
  const p = hoursPresets[hours];
  return `/paying-for-care?from=quiz&preset=${hours}&hours=${p.hoursPerVisit}&days=${p.daysPerWeek}&overnight=${p.overnight ? 1 : 0}#estimator`;
}
