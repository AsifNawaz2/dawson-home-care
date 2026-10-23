/**
 * Care hub — /care (docs/COPY_SERVICES.md "CARE HUB"), verbatim. The illustrated Dawson House
 * is dropped (BUILD_DECISIONS answer 4): the hero uses a video collage of clips from three
 * services instead.
 */
import type { Collage } from "./copy/home";
import type { ServiceSlug } from "./navigation";

export const careHub = {
  meta: {
    title: "Home Care Services in Beaufort, SC | Dawson & Dawson",
    description:
      "Non-medical home care in Beaufort, SC: personal care, home help, companionship, respite and 24-hour care. Owner-run since 2002. Free home visit.",
  },
  hero: {
    eyebrow: "Care services",
    title: ["Home care, built around your", "family", "."] as [string, string, string],
    lead: "Five kinds of non-medical help at home — for a few hours a week or around the clock, 7 days a week. Most families combine two or three.",
    secondary: { label: "Find the right care", href: "/find-care" },
    microcopy: "Free visit at home. No obligation.",
    collageCaption:
      "Short animated clips of Dawson caregivers at home with older adults: walking with a walker, bringing in the groceries and playing checkers.",
  },
  cards: {
    eyebrow: "01 — Our services",
    title: "Five ways we help at home.",
    bullets: {
      "personal-care": [
        "Bathing and showering",
        "Dressing and grooming",
        "Help using the bathroom",
        "Moving safely around the house",
      ],
      "home-help": [
        "Meals planned and cooked",
        "Laundry and light housekeeping",
        "Groceries and errands",
        "Medication reminders",
      ],
      companionship: [
        "Conversation and good company",
        "Games, puzzles and music",
        "Walks and time outdoors",
        "Hobbies they love",
      ],
      "respite-care": [
        "A few hours, a weekend or longer",
        "Time to rest, work or travel",
        "Their routine stays the same",
        "Regular or one-time breaks",
      ],
      "24-hour-care": [
        "Overnight care",
        "Safe nighttime bathroom trips",
        "Support after a fall or hospital stay",
        "Shifts covered 7 days a week",
      ],
    } satisfies Record<ServiceSlug, string[]>,
  },
  plan: {
    eyebrow: "02 — Your care plan",
    title: "Most families combine services.",
    subline: "Your plan mixes the help your loved one needs. You don't have to pick just one.",
    vennLabel:
      "A diagram of three overlapping circles: Personal Care, Home Help and Companionship. Where they overlap is your care plan.",
    center: "Your care plan",
    caption: {
      before: "Respite Care and 24-Hour Care are about",
      when: "when",
      and: "and",
      how: "how long",
      after: ". Each one can include any of the help above.",
    },
    examplesTitle: "A few examples",
    examples: [
      { label: "Home from the hospital", services: ["personal-care", "home-help"] },
      { label: "Living alone and a little lonely", services: ["companionship", "home-help"] },
      {
        label: "You're the main caregiver and running on empty",
        services: ["respite-care", "personal-care"],
      },
      { label: "Not safe alone at night", services: ["24-hour-care", "personal-care"] },
    ] satisfies { label: string; services: [ServiceSlug, ServiceSlug] }[],
    small: "These are examples, not packages. We build your plan together at the free visit.",
  },
  quiz: {
    eyebrow: "03 — Find the right care",
    title: "Not sure what you need?",
    subline: "Most families aren't. Answer five quick questions and we'll suggest a plan.",
    microcopy: "About 1 minute · No email needed",
    button: { label: "Find the right care", href: "/find-care" },
  },
  dont: {
    eyebrow: "04 — Honest answers",
    title: "What we don't do.",
    body: [
      "All our care is non-medical. We don't give injections, change wound dressings or provide nursing.",
      "That kind of care is called home health, and it usually comes from nurses or therapists ordered by a doctor. Many families use both. We're happy to work alongside your home health or hospice team.",
    ],
    table: {
      caption: "Home care and home health, side by side",
      cols: ["Home care (what we do)", "Home health"],
      rows: [
        ["Who provides it", "Caregivers", "Nurses and therapists"],
        [
          "What it covers",
          "Bathing, dressing, meals, housekeeping, company, medication reminders",
          "Wound care, injections, therapy, medical treatment",
        ],
        ["How it starts", "You call us", "Usually a doctor's order"],
      ],
    },
    hospice:
      "Already working with a hospice or palliative team? We can provide non-medical comfort and companionship alongside them.",
    link: { label: "Read more questions families ask", href: "/faq#home-care-vs-home-health" },
  },
  cta: { title: ["Let's talk about your", "family", "."] as [string, string, string] },
};

/** Hero collage: one clip from three services on the personal-care canvas. */
export const hubCollage: Collage = {
  panel: { left: 202, top: 38, width: 343, height: 564 },
  clips: [
    { name: "home-help-2", left: 413, top: 110 },
    { name: "companionship-3", left: 252, top: 183 },
    { name: "personal-care-1", left: 92, top: 38 },
  ],
};
