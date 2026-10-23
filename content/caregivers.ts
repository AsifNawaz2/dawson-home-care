/**
 * Caregiver cards (Home ch. 07, About). COPY_HOME §8: placeholder cards until real caregivers
 * are added — never realistic fake names. `placeholder: true` cards show only while
 * NEXT_PUBLIC_SHOW_PLACEHOLDERS is on, and `npm run prelaunch` lists them.
 */
export type Caregiver = {
  id: string;
  firstName: string;
  /** null until confirmed */
  yearsWithDawson: number | null;
  specialty: string | null;
  quote: string;
  /** /public path; null → the designed illustration placeholder */
  photo: string | null;
  placeholder: boolean;
};

const sample = (n: number): Caregiver => ({
  id: `sample-${n}`,
  firstName: "Caregiver Name",
  yearsWithDawson: null,
  specialty: null,
  quote: "This is a sample card. A real caregiver's words will go here.",
  photo: null,
  placeholder: true,
});

export const caregivers: Caregiver[] = [1, 2, 3, 4, 5, 6].map(sample);
