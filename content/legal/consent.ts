// content/legal/consent.ts — consent wording, versioned (COPY_LEGAL.md §1).
// RULES
// - Wording here is final and legally meaningful. Change it ONLY by adding a new version
//   (e.g. "sms-v2-2027-03") and pointing CURRENT_SMS_CONSENT at it. Never edit or delete an
//   old version: every stored lead points at the exact text the person saw.
// - `label` is what sits inside <label> with the checkbox. `links` renders right after it,
//   outside the <label>, tied by aria-describedby (a link inside a label fights the checkbox).
// - `fullText()` is what goes to GHL as proof: the label + the links sentence, plain text.
// - Both boxes: unchecked by default, never required (09 §1).

export type SmsConsentVersion = "sms-v1-2026-10";
export type EmailConsentVersion = "email-plan-v1-2026-10";

export interface ConsentLink {
  label: string;
  href: string;
}

export interface ConsentBox {
  /** Form field name + GHL field. */
  field: "sms_transactional_consent" | "sms_marketing_consent";
  label: string;
  /** Rendered as: "See our {Privacy Policy} and {SMS Terms}." */
  linksLead: string;
  links: [ConsentLink, ConsentLink];
  linksTail: string;
}

export interface SmsConsentSet {
  version: SmsConsentVersion;
  /** <legend> of the fieldset. */
  legend: string;
  /** Helper under the legend. */
  helper: string;
  transactional: ConsentBox;
  marketing: ConsentBox;
}

const policyLinks: [ConsentLink, ConsentLink] = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "SMS Terms", href: "/sms-terms" },
];

export const smsConsent: Record<SmsConsentVersion, SmsConsentSet> = {
  "sms-v1-2026-10": {
    version: "sms-v1-2026-10",
    legend: "Text messages (optional)",
    helper: "Both boxes are optional. You can send this form without ticking either one.",
    transactional: {
      field: "sms_transactional_consent",
      label:
        "Yes, Dawson and Dawson Home Care LLC may text me at the phone number I entered about my care inquiry and the services I request, such as appointment reminders and scheduling updates. Message frequency varies. Msg & data rates may apply. Reply HELP for help, STOP to opt out. Consent is not a condition of service.",
      linksLead: "See our ",
      links: policyLinks,
      linksTail: ".",
    },
    marketing: {
      field: "sms_marketing_consent",
      label:
        "Yes, I'd also like occasional texts with news and tips from Dawson and Dawson Home Care LLC. Message frequency varies. Msg & data rates may apply. Reply HELP for help, STOP to opt out. Consent is not a condition of service.",
      linksLead: "See our ",
      links: policyLinks,
      linksTail: ".",
    },
  },
};

export const CURRENT_SMS_CONSENT: SmsConsentVersion = "sms-v1-2026-10";

/** Exact text the person saw, for the GHL proof field. */
export function fullText(box: ConsentBox): string {
  const [a, b] = box.links;
  return `${box.label} ${box.linksLead}${a.label} and ${b.label}${box.linksTail}`;
}

/** Quiz "Email me this plan" consent (COPY_CONVERSION §9). Required box. */
export const emailPlanConsent: Record<EmailConsentVersion, string> = {
  "email-plan-v1-2026-10":
    "Yes, email me this plan. Dawson and Dawson Home Care LLC may follow up by email about it. I can unsubscribe at any time.",
};

export const CURRENT_EMAIL_PLAN_CONSENT: EmailConsentVersion = "email-plan-v1-2026-10";

/** Proof sent with every lead that shows the SMS boxes (09 §1 + COPY_LEGAL decisions). */
export interface ConsentProof {
  sms_transactional_consent: boolean;
  sms_marketing_consent: boolean;
  consent_text_version: SmsConsentVersion;
  /** Full text of each box that was ticked; "" when unticked. */
  consent_text_transactional: string;
  consent_text_marketing: string;
  /** ISO 8601, set on the SERVER at receipt (never trust the browser clock). */
  consent_timestamp: string;
  page_url: string;
  /** Server-side only, and only when at least one box is ticked. */
  consent_ip: string;
  consent_user_agent: string;
}

export function buildConsentProof(input: {
  transactional: boolean;
  marketing: boolean;
  pageUrl: string;
  ip: string;
  userAgent: string;
  now?: Date;
}): ConsentProof {
  const set = smsConsent[CURRENT_SMS_CONSENT];
  const anyTicked = input.transactional || input.marketing;
  return {
    sms_transactional_consent: input.transactional,
    sms_marketing_consent: input.marketing,
    consent_text_version: set.version,
    consent_text_transactional: input.transactional ? fullText(set.transactional) : "",
    consent_text_marketing: input.marketing ? fullText(set.marketing) : "",
    consent_timestamp: (input.now ?? new Date()).toISOString(),
    page_url: input.pageUrl,
    consent_ip: anyTicked ? input.ip : "",
    consent_user_agent: anyTicked ? input.userAgent.slice(0, 300) : "",
  };
}
