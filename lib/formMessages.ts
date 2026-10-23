/**
 * Every form message, word for word (COPY_CONVERSION §8.2 / §8.4). Import these into each zod
 * schema so the wording stays identical across forms.
 */
export const msg = {
  firstNameRequired: "Please enter your first name.",
  lastNameRequired: "Please enter your last name.",
  clientFirstNameRequired: "Please enter the client's first name.",
  nameTooLong: "Please keep this to 40 characters or fewer.",
  nameIsUrl: "Please enter a name, not a web address.",
  lastInitialRequired: "Please enter the first letter of the client's last name.",
  lastInitialOneLetter: "Please enter just one letter — for example, R.",
  phoneRequired: "Please enter your phone number so we can call you back.",
  phoneInvalid: "Please enter a 10-digit phone number, like (843) 555-0123.",
  phoneNonUs:
    "Please enter a US phone number with an area code. If you're outside the US, email us at info@dawsonhomecare.com.",
  emailRequired: "Please enter your email address.",
  emailInvalid: "Please enter an email address like name@example.com.",
  phoneOrEmail: "Please enter a phone number or an email address so we can reply.",
  careForRequired: "Please choose who the care is for.",
  townRequired: 'Please choose a town — or "Not sure."',
  townOtherRequired: "Please type the client's town.",
  servicesRequired: 'Please choose at least one — or "Not sure yet."',
  servicesRequiredReferral: 'Please choose at least one service — or "Not sure — let\'s discuss."',
  startRequired: "Please choose when you'd like care to start.",
  hoursRequired: 'Please choose how much help you think is needed — or "Not sure yet."',
  contactRequired: "Please choose how you'd like us to reach you.",
  roleRequired: "Please choose your role.",
  roleOtherRequired: "Please tell us your role.",
  organizationRequired: "Please enter your organization's name.",
  topicRequired: "Please choose what your message is about.",
  messageRequired: "Please write a short message.",
  permissionRequired: "Please confirm you have permission to share this information.",
  planConsentRequired: "Please tick the box so we can email your plan.",
  dateRequired: "Please enter the start or discharge date.",
  dateInvalid: "Please enter a date like 10/24/2026.",
  datePast: "Please choose today or a later date.",
  dateTooFar: "Please choose a date within the next 12 months.",
  tooLong: (max: number) =>
    `Please keep this to ${max.toLocaleString("en-US")} characters or fewer. You can tell us the rest on the phone.`,
  ssnFound: "Please remove the ID number. We never need it online.",
  mbiFound: "Please remove the Medicare number. We never need it online.",
} as const;

/** Error summary heading (§8.1). */
export const summaryTitle = (n: number, final = false) =>
  `Please check ${n} answer${n === 1 ? "" : "s"} before you ${final ? "send" : "continue"}.`;

/** Send / system messages (§8.3). */
export const sendMsg = {
  failedOpen:
    "We couldn't send this. Your answers are still here. Please try again, or call (843) 379-3321.",
  failedClosed:
    "We couldn't send this. Your answers are still here. Please try again in a moment, or text us at (866) 632-9766.",
  offline:
    "You seem to be offline. Your answers are saved in this tab — try again when you're connected.",
  duplicate:
    "We already have your request. We'll be in touch soon. Need to add something? Call (843) 379-3321.",
} as const;

const URL_RE = /(https?:\/\/|www\.|\.[a-z]{2,}\/)/i;
export const looksLikeUrl = (s: string) => URL_RE.test(s);
/** ###-##-#### or 9 digits in a row. */
export const looksLikeSsn = (s: string) => /\b\d{3}-\d{2}-\d{4}\b|(?<!\d)\d{9}(?!\d)/.test(s);
/** Medicare Beneficiary Identifier: 11 characters, e.g. 1EG4-TE5-MK73. */
export const looksLikeMbi = (s: string) =>
  /\b[1-9][AC-HJKMNP-RT-Y][AC-HJKMNP-RT-Y0-9]\d-?[AC-HJKMNP-RT-Y][AC-HJKMNP-RT-Y0-9]\d-?[AC-HJKMNP-RT-Y]{2}\d{2}\b/i.test(
    s,
  );
/** Soft check only (plum-100 note): 3/14/1941, 03-14-41, 1941-03-14. */
export const looksLikeDob = (s: string) =>
  /\b(0?[1-9]|1[0-2])[/.-](0?[1-9]|[12]\d|3[01])[/.-](19|20)?\d{2}\b|\b(19|20)\d{2}-\d{2}-\d{2}\b/.test(
    s,
  );

/** Soft "Did you mean…?" for common email domain typos. */
const DOMAIN_FIX: Record<string, string> = {
  "gmial.com": "gmail.com",
  "gmal.com": "gmail.com",
  "gmail.co": "gmail.com",
  "gamil.com": "gmail.com",
  "yaho.com": "yahoo.com",
  "yahooo.com": "yahoo.com",
  "hotmial.com": "hotmail.com",
  "outlok.com": "outlook.com",
  "aol.co": "aol.com",
};
export function emailSuggestion(email: string): string | null {
  const m = /^([^@\s]+)@([^@\s]+)$/.exec(email.trim());
  if (!m) return null;
  const [, user, domain] = m;
  const d = domain!.toLowerCase();
  if (DOMAIN_FIX[d]) return `${user}@${DOMAIN_FIX[d]}`;
  if (d.endsWith(".con")) return `${user}@${d.slice(0, -4)}.com`;
  return null;
}
