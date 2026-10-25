/**
 * Caregiver spotlight cards (COPY_TRUST "CAREGIVER SPOTLIGHT CARDS" §5). Used by Home ch. 07
 * (carousel, flip) and About §04 (grid, no flip).
 * Rules: never realistic fake names — samples are "Caregiver Name". A real caregiver ships only
 * with written permission for name, photo and quote (consentOnFile). Placeholder cards show only
 * while NEXT_PUBLIC_SHOW_PLACEHOLDERS is on; `npm run prelaunch` lists them.
 */
export type Caregiver = {
  id: string;
  firstName: string;
  /** years with Dawson are computed from this in the browser */
  startYear: number | null;
  /** ≤ 32 characters */
  specialty: string | null;
  /** only if confirmed for this person */
  credential: "CNA" | null;
  /** ≤ 160 characters, their own words */
  quote: string;
  photo: string;
  consentOnFile: boolean;
  placeholder: boolean;
};

const ph = (n: number, quote: string): Caregiver => ({
  id: `sample-${n}`,
  firstName: "Caregiver Name",
  startYear: null,
  specialty: null,
  credential: null,
  quote,
  photo: `/images/placeholders/caregiver-0${n}.jpg`,
  consentOnFile: false,
  placeholder: true,
});

export const caregivers: Caregiver[] = [
  ph(1, "This is a sample card. A real caregiver's words will go here."),
  ph(2, "Sample quote. A caregiver shares why they love this work."),
  ph(
    3,
    "Sample quote. This longer sample tests the card at full length, so the layout holds when a caregiver has more to say about their work.",
  ),
  ph(4, "Sample quote. Real words, coming soon."),
  ph(
    5,
    "This is a sample card. Each caregiver will tell families, in their own words, why they do this work.",
  ),
  ph(6, "Sample quote. This card will feature a real Dawson caregiver after the reveal."),
];

/** Cards that may render now: real ones with consent, plus samples while placeholders are on. */
export const visibleCaregivers = (showPlaceholders: boolean) =>
  caregivers.filter((c) => (c.placeholder ? showPlaceholders : c.consentOnFile));
