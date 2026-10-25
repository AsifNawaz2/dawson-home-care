/**
 * /how-it-works copy — COPY_TRUST "HOW IT WORKS", verbatim. Unconfirmed sentences are Tbc items:
 * they render as chips only while placeholders are on, and the copy reads correctly without them.
 */
import type { Tbc } from "@/content/services";

export type Step = {
  n: number;
  short: string;
  title: string;
  lead: string;
  listLabel: string;
  list: { text: string; tbc?: Tbc }[];
  youDo: string;
  note?: { text?: string; tbc?: Tbc };
};

export const howHero = {
  eyebrow: "How it works",
  title: ["From first call to first visit — here's", "exactly", "what happens."] as [
    string,
    string,
    string,
  ],
  lead: "Five simple steps, no surprises. The first visit is free, at home, and there's no obligation.",
  micro: "Not ready to talk? Read on. Everything is on this page.",
};

export const steps: Step[] = [
  {
    n: 1,
    short: "Call",
    title: "Call or text us",
    lead: "Tell us what's going on. There's no wrong place to start.",
    listLabel: "What happens",
    list: [
      { text: "We listen first: what's changed, who needs help and what worries you most." },
      { text: "We answer your questions — about care, cost and how it all works." },
      { text: "If home care sounds right, we set a time for your free visit." },
    ],
    youDo: "Just call. You don't need to have anything figured out.",
  },
  {
    n: 2,
    short: "Free visit",
    title: "Our owner visits — free",
    lead: "Our owner comes to your loved one's home, meets the family and learns how they like to live.",
    listLabel: "What happens",
    list: [
      { text: "We meet your loved one — and you, in person or by phone." },
      {
        text: "We talk about their days: their routine, what's getting harder and what they still love doing.",
      },
      {
        text: "We look at how the home is set up: the bathroom, the stairs, the path to bed at night.",
      },
      { text: "We answer every question, including what care will cost." },
    ],
    youDo: "Be there if you can. Your loved one's voice matters most.",
  },
  {
    n: 3,
    short: "Your plan",
    title: "We build your care plan",
    lead: "Together, we plan the days, the hours and the help — around their routine.",
    listLabel: "Your plan covers",
    list: [
      { text: "The help they need — like bathing, meals or company" },
      { text: "Which days and which hours" },
      { text: "Their routines and preferences, down to how they take their coffee" },
      { text: "Who we call, and how you'd like to hear from us" },
      { text: "Your rate, explained clearly before care begins" },
    ],
    youDo: "Tell us what matters. Nothing is too small.",
    note: {
      tbc: {
        lead: "You'll get a copy of the plan to keep.",
        chip: "[families receive a written copy of the care plan]",
      },
    },
  },
  {
    n: 4,
    short: "Your caregiver",
    title: "We match your caregiver",
    lead: "We choose an experienced caregiver who fits your loved one's needs and schedule.",
    listLabel: "What happens",
    list: [
      { text: "We match on needs, schedule and personality." },
      { text: "Your caregiver learns the plan before the first visit." },
      { text: "", tbc: { chip: '[draft: "You can meet your caregiver before care begins."]' } },
      {
        text: "",
        tbc: {
          chip: "[draft: \"If the fit isn't right, tell us and we'll find someone who is.\"]",
        },
      },
    ],
    youDo: "Tell us about their personality — what they enjoy, and what gets on their nerves.",
    note: { text: "Our team includes Certified Nursing Assistants. All our care is non-medical." },
  },
  {
    n: 5,
    short: "Check-ins",
    title: "We keep checking in",
    lead: "We follow up regularly and adjust the plan as needs change.",
    listLabel: "What happens",
    list: [
      { text: "Our owner stays involved in your loved one's care." },
      {
        text: "We check in with you",
        tbc: { chip: "[how often and how — e.g. a call every few weeks]", after: "." },
      },
      { text: "Need more hours, fewer hours or a different kind of help? We change the plan." },
      { text: "Family far away? We keep you in the loop the way you prefer." },
    ],
    youDo: "Tell us when something changes — good or bad.",
    note: {
      tbc: {
        lead: "Existing clients can reach us after hours at",
        chip: "[after-hours line for existing clients]",
        after: ".",
      },
    },
  },
];

export const coverList = [
  "Their daily routine, from morning to bedtime",
  "What's getting harder — and what they still do well",
  "How the home is set up for moving around safely",
  "Their likes, dislikes and what makes a good day",
  "The help, hours and schedule that would fit",
  "What care will cost, and ways families pay",
  "Your questions — all of them",
  "Next steps, with no pressure to decide that day",
];

export const haveReady = [
  {
    id: "hr-medicines",
    label: "A list of their medicines and when they take them, so we can plan reminders",
  },
  {
    id: "hr-doctors",
    label: "Their doctors' names and phone numbers, and any home health or hospice team",
  },
  { id: "hr-family", label: "Family contacts: who we call, and who helps make decisions" },
  { id: "hr-schedule", label: "A rough idea of the days and hours you have in mind" },
  {
    id: "hr-paperwork",
    label: "Any long-term care insurance or VA paperwork, if you have it",
    note: "We'll talk about whether it applies to your loved one's care.",
  },
  { id: "hr-questions", label: "Your questions, written down" },
];
