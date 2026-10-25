/**
 * The owner (COPY_TRUST "MEET THE OWNER" §2 + About §02 letter, verbatim). First name "Monique"
 * is confirmed (BUILD_DECISIONS §H answer 1); everything else is a placeholder until the reveal.
 * Letter paragraphs are text segments (content/towns.ts `Segs`): { pending } sentences and
 * { chip } markers only show while placeholders are on, so the letter reads correctly without.
 */
import { owner as ownerFacts } from "./site.config";
import type { Segs } from "./towns";

const first = ownerFacts.firstName.value;
const lastNameChip = { chip: "[owner last name]" };

export const owner = {
  firstName: first,
  /** null until confirmed — render the chip / "our owner" fallback. */
  fullName: null as string | null,
  title: "Owner",
  inHomeCareSince: null as number | null,
  credentials: null as string | null,
  roots: null as string | null,
  quote: null as string | null,
  portrait: "/images/placeholders/owner-portrait.jpg",
  signature: "/images/placeholders/owner-signature.svg",
  video: null as null | { src: string; captions: string; poster: string; transcript: string },
  confirmed: false,
};

export const ownerLetter: Segs[] = [
  // Full name unconfirmed: the confirmed first name stands in, the last name shows as a chip.
  [`Hello. I'm ${first}`, lastNameChip, ", and I run Dawson and Dawson Home Care."],
  [
    {
      pending: [
        {
          chip: '[draft: "I\'ve worked in health and home care since [year]. Before that, I [one line on background]."]',
        },
      ],
    },
  ],
  [
    {
      pending: [
        {
          chip: '[draft: "In 2002, I started Dawson and Dawson because I saw how much families here needed care they could trust — and how hard it was to find."]',
        },
      ],
    },
  ],
  [
    "Here's how I run this company: I meet every family myself. I come to your loved one's home, sit down with you and learn how they like their days to go — when they wake up, how they take their coffee, what they're proud of and what's gotten hard. Then we build the plan together.",
  ],
  [
    "I don't disappear after that first visit. I stay involved. We check in, we listen, and when something needs to change, we change it.",
  ],
  [
    "Our caregivers have years of experience and a real love for this work, and our team includes Certified Nursing Assistants.",
    {
      pending: [
        {
          chip: '[draft: "I look for people who are patient, kind and reliable — the kind of person I\'d trust with my own mother."]',
        },
      ],
    },
  ],
  [
    {
      pending: [
        {
          chip: "[one personal sentence — family, faith, life in Beaufort, what they love about the Lowcountry]",
        },
      ],
    },
  ],
  [
    "If you're reading this late at night, worried about someone you love: you don't have to figure this out alone. Call us at (843) 379-3321.",
    { pending: [{ chip: '[draft: "During office hours, you\'ll often get me on the phone."]' }] },
    " We'll work it out together.",
  ],
];
