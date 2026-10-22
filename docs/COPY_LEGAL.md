# COPY_LEGAL — Privacy Policy, SMS Terms, Accessibility Statement + consent text

**Status:** Final copy for design + build. Use verbatim. Client approval and a pre-launch compliance check are still required (§7).
**Pages:** `/privacy-policy` · `/sms-terms` · `/accessibility`
**Also final here:** SMS consent checkboxes (version `sms-v1-2026-10`) · quiz email-plan consent ID · /contact texting line · GHL auto-reply texts
**Data file (end of §1):** `content/legal/consent.ts` (type-checks under `tsc --strict --noUncheckedIndexedAccess`)
**Sources:** 04, 06 (Legal), 07 (§10–12, §17), 08 (§2–3), 09 (§1, §2, §4, §5), BRAND_FINAL (§1.5–1.7, §4), COPY_HOME §0, COPY_CONVERSION (§1, §3, §7, §9).
**Reading level:** grade 6–8. **Voice:** warm, calm, plain. Legal pages still sound like Dawson.

> Not legal advice. These pages are written to meet the items in 09 and current carrier expectations, in plain language. A South Carolina attorney should review them before launch (§7).

**Overrides:** this file replaces the consent wording and `[[TO CONFIRM: final wording + version from COPY_LEGAL.md]]` placeholders in COPY_CONVERSION §3 (Step 5) and §7 (Text card).

---

## 0. Conventions (read first)

Everything in **COPY_HOME.md §0** applies (`[[TO CONFIRM: …]]`, prelaunch gate). Pending blocks work as in **COPY_COST_FAQ §0**: a line marked *(hidden until confirmed)* renders only when `NEXT_PUBLIC_SHOW_PLACEHOLDERS=true`, and the text around it reads correctly without it.

**New tokens:**

| Token | Source | Rule |
|---|---|---|
| `{updated.privacy}` · `{updated.sms}` · `{updated.accessibility}` | `site.config.ts` → `legal.updated` | **Fixed dates, set by hand** on the day the page goes live and again whenever its wording changes. Never computed, never the build date. Rendered "October 27, 2026" inside `<time datetime="2026-10-27">`. |
| `{analytics}` | `site.config.ts` → `analytics: "none" \| "ga4" \| "ga4-ads"` | Picks the cookies variant in Privacy §6. Must match the scripts that actually load. |
| `{turnstile}` | `TURNSTILE_SITE_KEY` set | Shows the spam-protection line in Privacy §2. |

**Conditional blocks** are written `{if analytics = "ga4"} … {/if}`. Exactly one variant renders.

**Names:** the full legal name, **Dawson and Dawson Home Care LLC**, appears in the first paragraph of each page and in the contact block. After that: "Dawson" or "we".

### Shared legal-page layout (all three pages)

- Breadcrumb · H1 · lead · **Last updated** line · **The short version** panel · **On this page** · sections · contact block. No hero image, no Dusk band, no CTA band, no scroll reveals. These pages are for reading.
- **The short version:** plum-100 panel, H2 "The short version", bulleted list. Body text ink.
- **On this page:** desktop = sticky left column (ordered list of links to each H2). Mobile = native `<details>` closed by default, `<summary>` "On this page". Every H2 has the `id` shown in its heading line below.
- One H1. Sections are H2. Sub-points are H3. Body 18px, max 65ch, links underlined (BRAND_FINAL §1.1 #6).
- External links say where they go in small text after the link ("goes to Google"), same as the rest of the site.
- **Print:** hide header nav, cursor ring, comfort button, mobile action bar and `<details>` chrome (open it). Print link URLs after link text.
- **"Back to top"** text link after the last section.
- Pages are public and indexable, work without JavaScript, and load no marketing scripts regardless of cookie choice. Carriers review them — they must load fast and never sit behind a cookie wall.
- The office-status chip in the header still shows. No other live elements.

### Shared contact block (end of every legal page)

**H2:** Contact us · `#contact`

> **Dawson and Dawson Home Care LLC**
> 69 Robert Smalls Parkway, Suite 3F
> Beaufort, SC 29906
>
> **Phone:** (843) 379-3321 → `tel:+18433793321`
> **Call or text (toll-free):** (866) 632-9766 → `tel:+18666329766` · **Text** → `sms:+18666329766`
> **Email:** info@dawsonhomecare.com → `mailto:info@dawsonhomecare.com`
>
> **Office:** Monday–Friday, 8 AM–5 PM (Eastern)
> **Care:** 24 hours a day, 7 days a week

---
---

# 1. CONSENT CHECKBOXES — final (`sms-v1-2026-10`)

**Used on:** `/free-assessment` Step 5 and `/contact` form. Nowhere else.
**Not used on:** the referral form (referrers choose phone or email only) and the quiz "Email me this plan" block (email consent, below).

## 1.1 The group

**Fieldset legend:**
> Text messages (optional)

**Helper (under the legend):**
> Both boxes are optional. You can send this form without ticking either one.

## 1.2 Checkbox 1 — care-related texts

`name="sms_transactional_consent"` · unchecked · not required

> ☐ Yes, Dawson and Dawson Home Care LLC may text me at the phone number I entered about my care inquiry and the services I request, such as appointment reminders and scheduling updates. Message frequency varies. Msg & data rates may apply. Reply HELP for help, STOP to opt out. Consent is not a condition of service. See our [Privacy Policy](/privacy-policy) and [SMS Terms](/sms-terms).

## 1.3 Checkbox 2 — news and tips

`name="sms_marketing_consent"` · unchecked · not required

> ☐ Yes, I'd also like occasional texts with news and tips from Dawson and Dawson Home Care LLC. Message frequency varies. Msg & data rates may apply. Reply HELP for help, STOP to opt out. Consent is not a condition of service. See our [Privacy Policy](/privacy-policy) and [SMS Terms](/sms-terms).

**Feature flag:** `site.config.ts` → `sms.marketingEnabled` (default `true`). If the client won't send marketing texts, set `false`: checkbox 2 disappears, and the SMS Terms "News and tips" section and its short-version bullet go with it (§3). Nothing else changes.

## 1.4 Build rules (both boxes)

- **Separate, unchecked, optional.** Never pre-ticked, never required, never one box for both. Ticking one never ticks the other.
- **Readable:** label text 16px minimum (BRAND_FINAL allows 16px body-small), ink on cream/white. Checkbox 24px visual, 48px tap area. Never in a tooltip, accordion or "terms" popup.
- **Label vs links:** the `<label>` holds the checkbox and the text up to "…not a condition of service." The sentence "See our Privacy Policy and SMS Terms." renders **directly after it, on the same line flow, outside the `<label>`**, and the checkbox gets `aria-describedby` pointing to it. A link inside a label fights the checkbox on tap. Links open in the same tab — form answers are saved in the tab.
- **Proof of consent** (sent with every lead from a form that shows the boxes; built by `buildConsentProof()` below):
  `sms_transactional_consent` · `sms_marketing_consent` · `consent_text_version` · `consent_text_transactional` · `consent_text_marketing` (full text of each ticked box, "" if unticked) · `consent_timestamp` (ISO 8601, **server time at receipt**) · `page_url` · `consent_ip` · `consent_user_agent` (both server-side, only when at least one box is ticked).
- **Changing the wording later** = a new version (`sms-v2-YYYY-MM`) added next to v1, never an edit of v1. Old leads must keep pointing at the exact words they saw. Update `{updated.sms}` and `{updated.privacy}` the same day if the change touches them.
- **Text-preference reminder** (COPY_CONVERSION §3 Step 5) stays as written.

## 1.5 Texting line on /contact — final

Replaces the small line on the **Text** card in COPY_CONVERSION §7 (01 — Contact cards):

> When you text this number, we'll text you back about your message. Msg & data rates may apply. Reply STOP to opt out. [SMS Terms](/sms-terms)

## 1.6 Quiz "Email me this plan" consent — version ID only

Wording stays exactly as COPY_CONVERSION §9. It now carries a version: **`email-plan-v1-2026-10`**, sent as `email_consent_version` with the email consent timestamp.

## 1.7 Data file — `content/legal/consent.ts`

```ts
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
```

New GHL custom fields vs 08 §2: `consent_text_transactional`, `consent_text_marketing`, `consent_ip`, `consent_user_agent`, `email_consent_version`.

---
---

# 2. PRIVACY POLICY — /privacy-policy

## Page meta

- **Title:** Privacy Policy | Dawson & Dawson Home Care
- **Meta description:** How Dawson and Dawson Home Care LLC collects, uses and protects your information, including text messages. Plain language, no fine print.
- **Robots:** index, follow.

**Breadcrumb:** Home › Privacy Policy

---

## Hero

**Headline (H1):**
> Privacy Policy

**Lead:**
> This page explains what information Dawson and Dawson Home Care LLC collects through our website and text messages, why we collect it, and the choices you have. We've kept it in plain language.

**Last updated:** {updated.privacy}

---

## The short version

- We collect only what we need to help your family: usually your name, your phone number and a little about the care you're looking for.
- We use it to get back to you and plan care. We don't sell it.
- We never sell or share your phone number or text-message consent with anyone for their marketing.
- Texts from us are optional. Reply STOP at any time.
- Please don't send medical details through our website. We'll talk about care needs by phone.
- Questions? Call (843) 379-3321 or email info@dawsonhomecare.com.

---

## On this page

1. Who we are and what this covers
2. What we collect
3. How we use it
4. Text messages
5. Who we share it with
6. Cookies and browser storage
7. How long we keep it
8. How we protect it
9. Information about someone else
10. Children
11. Your choices
12. Links to other websites
13. Changes to this policy
14. Contact us

---

## 1. Who we are and what this covers · `#who-we-are`

> Dawson and Dawson Home Care LLC ("Dawson," "we," "us") is a non-medical home care agency based at 69 Robert Smalls Parkway, Suite 3F, Beaufort, SC 29906.
>
> This policy covers our website, dawsonhomecare.com, and the texts and emails we send to people who contact us through it, call us or text us.
>
> It doesn't cover the records we keep while caring for a client. Those are handled as part of providing care. It also doesn't cover other websites we link to, like our hiring site.

*(hidden until confirmed)* `[[TO CONFIRM: does Dawson give clients a separate privacy notice or service agreement that covers care records? If yes, add: "Clients receive a separate notice about care records when care starts."]]`

---

## 2. What we collect · `#what-we-collect`

### What you tell us

**When you ask for a free care assessment:**
> Your name, phone number and email (if you give one), how and when you'd like us to reach you, who the care is for and their first name, their town, the kind of help you're looking for, how many hours and when you'd like to start, anything you write in the notes, and your text-message choices.

**When you send a message from our contact page:**
> What your message is about, your name, your phone number or email, your message, and your text-message choices.

**When a healthcare professional refers a client:**
> The professional's name, organization, role, phone number and email. About the client, we ask only for their first name, the first letter of their last name, their town, the help they need and when. We also ask the professional to confirm they have permission to share this.

**When you ask us to email your quiz plan:**
> Your email address, your first name if you give it, and your quiz answers.

**When you call, text or email us:**
> Your phone number or email address and whatever you choose to tell us.

*(hidden until confirmed)* `[[TO CONFIRM: are calls recorded? If yes, add: "Calls to our office may be recorded so we can get details right and train our team."]]`

### Our care quiz and cost estimator

> The care quiz and cost estimator work inside your browser. We don't receive your answers unless you send us a form or ask us to email your plan. When you do, your answers come with it, so we don't have to ask you the same questions twice.

### What we ask you not to send

> Please don't send diagnoses, medications, dates of birth, Social Security numbers, or Medicare, Medicaid or insurance numbers through our website. We don't need them online. Our forms check for some of these and will ask you to take them out. We'll talk about care needs by phone.

### What's collected automatically

**Basic technical information**
> Like every website, ours receives technical information when you visit: your IP address, the type of browser and device you use, the pages you visit, and the date and time. Our website host keeps this in its logs. We use it to keep the site working and secure.

**Spam protection** `{if turnstile}`
> To stop spam, our forms use Cloudflare Turnstile. It checks, in the background, that a person and not a robot is sending the form. To do that, it looks at information about your browser and device. There's no puzzle to solve.
`{/if}`

**Proof of your text-message choices**
> When you tick a text-message box, we record which boxes you ticked, the exact wording you agreed to, the date and time, the page you were on, and your IP address and browser type. This is our record that you asked to get texts.

**Where you came from**
> If you reached our site from an ad or a link with tracking codes in the web address, we save those codes with your form. It tells us which ads and links help families find us.

**Analytics**
> See "Cookies and browser storage" below.

---

## 3. How we use it · `#how-we-use-it`

> We use your information to:
>
> - Reply to you and set up your free care assessment
> - Plan and provide care, if you or your loved one becomes a client
> - Send the texts you agreed to, and the emails you asked for
> - Respond to referrals from healthcare professionals
> - Keep a record of your text-message choices, including when you opt out
> - Keep our website working, secure and free of spam
> - Understand, in total, how people use our website, so we can improve it `{if analytics ≠ "none"}`
> - Meet our legal obligations
>
> We won't use your information for something unrelated to these without asking you first.

---

## 4. Text messages · `#text-messages`

> Texts from us are optional. There are two kinds, and you choose each one separately:
>
> - **Care-related texts** about your inquiry and the services you request, such as appointment reminders and scheduling updates.
> - **News and tips** — occasional texts with news from Dawson and tips for families. `{if sms.marketingEnabled}`
>
> **We do not sell, rent or share mobile phone numbers or text-messaging opt-in data with third parties or affiliates for marketing or promotional purposes.**
>
> Your text-messaging opt-in and consent are never shared with any third party. The only companies that handle them are the service providers that send and store our texts for us, and they may use them only to do that job.
>
> Reply **STOP** to any text to stop getting texts. Reply **HELP** for help. For everything about how our texts work, see our [SMS Terms](/sms-terms).

---

## 5. Who we share it with · `#sharing`

`{if analytics ≠ "ga4-ads"}`
> **We don't sell your personal information, and we don't share it for advertising.**
`{/if}`
`{if analytics = "ga4-ads"}`
> **We don't sell your personal information.** If you choose "Accept" in our cookie banner, our advertising tools get limited information about your visit (see section 6). If you choose "Decline," they don't.
`{/if}`

> We share information only in these cases:
>
> **With companies that work for us.** They help us run our business, and they may use your information only to provide their service to us:
> - Our customer system, GoHighLevel (also called LeadConnector). It stores contact details and sends our texts and emails.
> - Our website host, which runs the site and keeps the basic technical logs described above.
> - Cloudflare Turnstile, our spam protection. `{if turnstile}`
> - Google Analytics, which counts visits. `{if analytics ≠ "none"}`
> - [[TO CONFIRM: advertising tools used at launch, e.g. Meta Pixel, Google Ads]] `{if analytics = "ga4-ads"}`
>
> **With our team.** Only the people at Dawson who need it to help you, such as our owner and office staff. If care starts, the caregivers who care for your loved one see what they need to do that well.
>
> **With people you ask us to talk to.** For example, another family member, or a hospice or home health team you ask us to work with.
>
> **When the law requires it.** For example, to answer a valid legal request, or if someone's safety is at risk.
>
> **If our business changes hands.** If Dawson were ever sold or merged, your information would move with the business and stay protected by this policy.

---

## 6. Cookies and browser storage · `#cookies`

### What our site saves in your browser (every visitor)

> Our website saves a few small things in your own browser so it works the way you'd expect. None of this is sent to us.
>
> - **Your Comfort Controls choices** — text size, contrast and motion — saved on this device so they're there next time.
> - **Your form progress** — saved only in this browser tab, so you can go back a step or take a break. It's cleared when you close the tab.
> - **Small reminders for this visit** — for example, so our logo animation plays only once.
>
> Our map is drawn by us and our fonts are stored on our own website, so simply viewing a page doesn't send information to Google. If you click "Get directions," you go to Google Maps, and Google's own privacy policy applies there.

### Analytics and advertising — variant `{analytics}`

**`{if analytics = "none"}`**
> We don't use analytics or advertising cookies.

**`{if analytics = "ga4"}`**
> We use Google Analytics to understand, in total, how people use our site, such as which pages are visited most. It uses cookies. We never send it what you type into our forms or your quiz answers. We don't use it for advertising.
>
> To opt out, you can block cookies in your browser settings, or use Google's [opt-out browser add-on](https://tools.google.com/dlpage/gaoptout) · small: "goes to Google"

**`{if analytics = "ga4-ads"}`**
> We use Google Analytics to understand, in total, how people use our site. With your permission, we also use advertising tools that help us show our ads to families who may need care. We never send any of these tools what you type into our forms or your quiz answers.
>
> These tools load only if you choose **Accept** in our cookie banner. If you choose **Decline**, they don't load, and the site works exactly the same. You can change your choice at any time with **Cookie settings** at the bottom of every page.
>
> If your browser sends a Global Privacy Control signal, we treat it as Decline.

---

## 7. How long we keep it · `#retention`

> We keep information only as long as we need it:
>
> - **Questions and inquiries:** long enough to help you, plus a reasonable time afterward so we have a record of our conversations.
> - **If someone becomes a client:** as part of their care records, for as long as the law requires.
> - **Your text-message choices and opt-outs:** for as long as we text you, and for some time after, so we can show we followed the rules. If you opt out, we keep a note of it so we don't text you again by mistake.
>
> When we no longer need information, we delete it or remove the details that identify you.

*(hidden until confirmed)* `[[TO CONFIRM: retention periods to publish, e.g. "Inquiries that don't become clients: deleted after 3 years." Recommendation for consent records in §7 of this file.]]`

---

## 8. How we protect it · `#security`

> - Our website uses a secure connection (HTTPS — the padlock in your browser).
> - Information you send through our forms goes straight into our customer system. It isn't stored on our website.
> - Only the people at Dawson who need your information can see it.
> - We use well-known service providers with their own security safeguards.
>
> No website or system is perfectly secure. If a security problem ever affects your information, we'll tell you as the law requires.

---

## 9. Information about someone else · `#about-others`

> Most families contact us about someone they love. Please share only what we need to call you back, and check with your loved one if you can.
>
> Healthcare professionals who refer a client must confirm they have the client's or family's permission to share their information.
>
> If someone has contacted us about you and you'd like to know what we have, or ask us to delete it, contact us. We're glad to help.

---

## 10. Children · `#children`

> Our website is for adults looking for care for themselves or someone they love. It isn't directed to children under 13, and we don't knowingly collect information from them. If you think a child has sent us information, contact us and we'll delete it.

---

## 11. Your choices · `#your-choices`

> **Stop texts.** Reply STOP to any text from us. You can also call or email us and ask.
>
> **Stop emails.** Use the unsubscribe link at the bottom of any email from us, or ask us.
>
> **See, correct or delete your information.** Call or email us. We'll confirm who you are first, to protect your privacy. We may need to keep some records — for example, a note that you opted out of texts, or care records the law requires us to keep — and we'll tell you if so.
>
> **Cookies.** Your browser settings let you block or delete cookies. `{if analytics = "ga4-ads"}` Use **Cookie settings** at the bottom of any page to change your choice. `{/if}`

---

## 12. Links to other websites · `#other-websites`

> Our site links to other websites, such as Hireology (where you apply for jobs with us), Google Maps and Instagram. We don't control those sites. Their own privacy policies apply when you use them.

---

## 13. Changes to this policy · `#changes`

> If we change this policy, we'll post the new version here and update the date at the top. If we ever change how we use phone numbers or texts in a way that matters, we'll ask for your consent again before texting you under the new terms.

---

## 14. Contact us · `#contact`

> Questions about your privacy? We're happy to talk.

Then the **Shared contact block** (§0).

**Back to top**

---
---

# 3. SMS TERMS — /sms-terms

## Page meta

- **Title:** SMS Terms | Dawson & Dawson Home Care
- **Meta description:** How texts from Dawson and Dawson Home Care LLC work: what we send, how often, what it costs, and how to get help or stop. Reply STOP any time.
- **Robots:** index, follow.

**Breadcrumb:** Home › SMS Terms

---

## Hero

**Headline (H1):**
> SMS Terms

**Lead:**
> How text messages from Dawson and Dawson Home Care LLC work: what we send, how often, and how to get help or stop.

**Last updated:** {updated.sms}

---

## The short version

- Texts from us are optional. You choose them separately on our forms.
- Reply **STOP** to stop. Reply **HELP** for help.
- Message frequency varies. Msg & data rates may apply.
- Our texts aren't for emergencies. If someone is hurt or in danger, call 911.

---

## On this page

1. About our texts
2. What we send
3. How you sign up
4. How often we text
5. What it costs
6. How to stop
7. How to get help
8. Texting our toll-free number
9. Please don't text us
10. Delivery
11. If you change your phone number
12. Your privacy
13. Changes to these terms
14. Contact us

---

## 1. About our texts · `#about`

> **Program:** Dawson and Dawson Home Care Text Messages
> **Sent by:** Dawson and Dawson Home Care LLC, 69 Robert Smalls Parkway, Suite 3F, Beaufort, SC 29906
> **Texts come from:** (866) 632-9766 `[[TO CONFIRM: any other number Dawson texts from, e.g. (843) 379-3321 — list every sending number]]`
>
> We use texts to make it easier for families to reach us and to keep care running smoothly.

---

## 2. What we send · `#what-we-send`

### Care-related texts

> If you tick the first text box on our forms, or text us first, we may text you about:
>
> - Your question or care inquiry
> - Setting up your free care assessment
> - Appointment reminders and scheduling updates
> - The services you've asked us about

*(hidden until confirmed)* `[[TO CONFIRM: other care texts sent to clients' families, e.g. caregiver arrival or shift updates — add as a bullet only if real]]`

### News and tips `{if sms.marketingEnabled}`

> Only if you tick the second text box, we'll also send occasional texts with news from Dawson and tips for families caring for someone at home.
>
> Texting us, or ticking only the first box, never signs you up for news and tips.
`{/if}`

---

## 3. How you sign up · `#sign-up`

> You can sign up for texts in two ways:
>
> - **On our forms.** Tick one or both text boxes on our [free care assessment](/free-assessment) or [contact](/contact) form. Both boxes start unticked and are optional.
> - **By texting us first.** When you text (866) 632-9766, you're asking us to text you back about your message. See section 8.
>
> **Texts are never required.** You don't have to agree to texts to get care or a free assessment. We're always happy to call or email instead.
>
> After you sign up on a form, we'll send one text to confirm. It tells you how to get help or stop.

---

## 4. How often we text · `#frequency`

> Message frequency varies. Care-related texts depend on your inquiry and your care schedule. News and tips are occasional. `{if sms.marketingEnabled}`

*(hidden until confirmed)* `[[TO CONFIRM: a cap for news and tips, e.g. "no more than 4 a month"]]`

---

## 5. What it costs · `#cost`

> Msg & data rates may apply, depending on your mobile phone plan. Dawson never charges you for texts.

---

## 6. How to stop · `#stop`

> Reply **STOP** to any text from us. These words work too: **QUIT, END, REVOKE, OPT OUT, CANCEL** or **UNSUBSCRIBE**.
>
> We'll send one text to confirm, and then we'll stop.
>
> **Replying STOP stops all texts from us** — care-related texts and news and tips. We'll still call or email you about your care if we need to.
>
> **Prefer another way?** You can also call us at (843) 379-3321, email info@dawsonhomecare.com, or tell any of our team. We'll stop as soon as we can, and always within 10 business days.
>
> **Only want news and tips to stop?** Call or email us, and we'll keep sending care-related texts. `{if sms.marketingEnabled}`
>
> **Changed your mind?** Reply **START** to sign up again, or tick the box on one of our forms.

---

## 7. How to get help · `#help`

> Reply **HELP** to any text from us, and we'll text back with how to reach us. Or:
>
> - **Call:** (843) 379-3321
> - **Call or text (toll-free):** (866) 632-9766
> - **Email:** info@dawsonhomecare.com
>
> **Office:** Monday–Friday, 8 AM–5 PM (Eastern)
> **Care:** 24 hours a day, 7 days a week

---

## 8. Texting our toll-free number · `#toll-free`

> Our toll-free number, (866) 632-9766, takes calls and texts.
>
> When you text it, you're asking us to text you back about your message, so we'll reply by text. We'll only text you about what you asked. We won't send you news and tips unless you sign up for them separately.
>
> We read and answer texts during office hours, Monday–Friday, 8 AM–5 PM (Eastern). Reply STOP at any time to stop.

---

## 9. Please don't text us · `#please-dont`

> - **In an emergency.** If someone is hurt or in danger, call 911.
> - **Medical details.** Please don't text diagnoses, medications, dates of birth, Social Security numbers, or Medicare, Medicaid or insurance numbers. Text messages aren't a secure way to send private information. We'll talk about care needs by phone.

---

## 10. Delivery · `#delivery`

> Texts may be delayed or not arrive if your phone is off or out of range, or if your mobile carrier doesn't support them. **Mobile carriers are not liable for delayed or undelivered messages.**

---

## 11. If you change your phone number · `#new-number`

> If you change or give up your phone number, please reply STOP from that number first, or let us know. That way, the next person who gets that number won't get your texts.

---

## 12. Your privacy · `#privacy`

> **We do not sell, rent or share mobile phone numbers or text-messaging opt-in data with third parties or affiliates for marketing or promotional purposes.**
>
> To learn how we handle your information, read our [Privacy Policy](/privacy-policy).

---

## 13. Changes to these terms · `#changes`

> If we change these terms, we'll post the new version here and update the date at the top. If we change the kinds of texts we send in a way that matters, we'll ask for your consent again first.

---

## 14. Contact us · `#contact`

> Questions about our texts? Reply HELP, or reach us here.

Then the **Shared contact block** (§0).

**Back to top**

---
---

# 4. ACCESSIBILITY STATEMENT — /accessibility

## Page meta

- **Title:** Accessibility | Dawson & Dawson Home Care
- **Meta description:** Our commitment to a website everyone can use: Comfort Controls, full keyboard access and captions — and how to tell us if something gets in your way.
- **Robots:** index, follow.

**Breadcrumb:** Home › Accessibility

---

## Hero

**Headline (H1):**
> Accessibility

**Lead:**
> Dawson and Dawson Home Care LLC wants everyone to be able to use this website — including people who use a screen reader, a keyboard, bigger text or a magnifier. If anything gets in your way, please tell us.

**Last updated:** {updated.accessibility}

---

## The short version

- We aim to meet WCAG 2.2 Level AA, the widely used standard for accessible websites.
- Make text bigger, raise contrast or turn off motion with the **Comfort Controls** button at the bottom left of every page.
- Everything on this site works with a keyboard.
- Something not working for you? Call (843) 379-3321 or email info@dawsonhomecare.com.

---

## On this page

1. Our commitment
2. The standard we aim for
3. Comfort Controls
4. Other ways the site helps
5. How we test
6. Known limitations
7. Other ways to get information
8. Tell us about a problem

---

## 1. Our commitment · `#commitment`

> The families who visit this site include older adults and their grown children — often reading on a phone, late at night, at a stressful time. We built it to be easy for everyone: large text, strong contrast, big buttons and plain words.
>
> Accessibility isn't finished at launch. We keep checking and improving the site.

---

## 2. The standard we aim for · `#standard`

> We aim to meet the **Web Content Accessibility Guidelines (WCAG) 2.2, Level AA**, published by the World Wide Web Consortium (W3C).
>
> In some places we go further than the standard, because many of our visitors are older adults:
>
> - Body text is at least 18 pixels.
> - Buttons and other tap targets are at least 48 by 48 pixels — twice the standard's minimum of 24.
> - We use only color combinations that pass the standard's contrast checks.
>
> We don't claim the site is perfect. Section 6 lists what we know still needs work.

---

## 3. Comfort Controls · `#comfort-controls`

> Every page has a **Comfort Controls** button at the bottom left. It lets you:
>
> - **Change text size:** A, A+ or A++ (normal, about 12% bigger, or 25% bigger).
> - **Turn on high contrast:** darker borders, underlined links and no soft glows.
> - **Reduce motion:** stops animations and moving effects.
>
> Your choices are saved on this device, so they're there next time you visit.
>
> The site also follows your device's own settings. If your phone or computer is set to reduce motion, or to high contrast, the site does the same. You can zoom in to 200% without losing anything, and pages fit a narrow screen without sideways scrolling.

---

## 4. Other ways the site helps · `#features`

### Keyboard

> Everything works with a keyboard. Press Tab to move, and you'll always see a clear outline around where you are. A "Skip to content" link lets you jump past the menu. Pop-up windows close with the Esc key.

### Screen readers

> Pages use clear headings, labeled regions and descriptions for meaningful images. Our interactive features have text versions: the illustrated house is also a list of our services, and the area map is also a list of towns.

### Moving content

> Nothing on the site flashes. Scrolling is never locked. The moving row of reviews stops when you point at it or reach it with the keyboard, and it has a Pause button. With Reduce motion on, nothing moves at all.

### Video

> Our videos have captions and a written transcript. Nothing plays sound on its own.

### Forms

> Every field has a visible label, and required fields say "(required)" in words. If something needs fixing, we tell you what and how — in words, not just color. There's no time limit, and longer forms show which step you're on and keep your answers if you go back.

### Color is never the only signal

> Where color carries meaning, words or an icon do too. For example, our office-status sign says "Office open now" or "Office closed" next to its icon.

### The pointer

> On computers, a soft ring follows your mouse to show what a click will do. It's decoration only: your normal pointer always stays visible, and the ring turns off with Reduce motion or high contrast.

---

## 5. How we test · `#testing`

**Renders only when `legal.a11yAuditDate` is set in `site.config.ts`** (prelaunch gate flags it while empty).

> We check every page with automated accessibility tests, test by keyboard alone, and test with screen readers: VoiceOver on iPhone and Mac, and NVDA on Windows. We also check pages at 200% zoom and on small screens.
>
> Our most recent full review was on {legal.a11yAuditDate}.

---

## 6. Known limitations · `#limitations`

> Here's what we know isn't as good as it should be yet, and what to do in the meantime.

**Draft list — keep only the items still true at launch, and add anything the pre-launch audit finds** `[[TO CONFIRM: final list after the pre-launch audit]]`:

> - **Other websites we link to.** Job applications happen on Hireology, and directions on Google Maps. We don't control those sites. If you have trouble with them, call us at (843) 379-3321.
> - **Our area map is a drawing.** It shows roughly where we care, not exact boundaries. The list of towns under the map has the same information.
> - **Our referral sheet for healthcare professionals is coming soon.** Everything on it is already on our For Professionals page. When we add the PDF, it will be an accessible one.
> - **Very old browsers.** The site works best in a current version of Chrome, Safari, Edge or Firefox. In very old browsers some effects may not appear, but all the information is still there.

---

## 7. Other ways to get information · `#other-ways`

> If any part of this website doesn't work for you, call us at (843) 379-3321, Monday–Friday, 8 AM–5 PM (Eastern). We can talk you through anything on the site and take your details by phone.
>
> If you're deaf or hard of hearing, or have difficulty speaking, you can reach us through your relay service by dialing **711**.
>
> You can also visit our office at 69 Robert Smalls Parkway, Suite 3F, in Beaufort. Please call ahead so the right person is there to meet you.

*(hidden until confirmed)* `[[TO CONFIRM: step-free access to Suite 3F — add one line on entrance, elevator or ramp only if true]]`

---

## 8. Tell us about a problem · `#feedback`

> If something on this site is hard to use, we want to know — and we'll help you get what you need in the meantime.
>
> **Call:** (843) 379-3321
> **Email:** info@dawsonhomecare.com, with "Website accessibility" in the subject line
> **Text:** (866) 632-9766
> **Mail:** 69 Robert Smalls Parkway, Suite 3F, Beaufort, SC 29906
>
> It helps if you tell us:
> - Which page you were on
> - What you were trying to do
> - Your device and browser, and any assistive technology you use, such as a screen reader or magnifier
>
> We'll get back to you during office hours, as soon as we can.

*(hidden until confirmed)* `[[TO CONFIRM: a reply-time promise, e.g. "within 2 business days"]]`

**Office:** Monday–Friday, 8 AM–5 PM (Eastern) · **Care:** 24 hours a day, 7 days a week

**Back to top**

(No separate contact block on this page — section 8 is the contact block.)

---
---

# 5. GHL AUTO-REPLY TEXTS (setup copy — not shown on the site)

Set these in GoHighLevel for **every** sending number. Plain ASCII (no curly quotes or dashes) so each stays one 160-character segment. Character counts checked.

| Trigger | Text | Chars |
|---|---|---|
| Form lead with `sms_transactional_consent = true` (send once) | Dawson and Dawson Home Care: You're signed up for care-related texts. Msg freq varies. Msg&data rates may apply. Reply HELP for help, STOP to opt out. | 150 |
| Form lead with `sms_marketing_consent = true` (send once; if both boxes are ticked, send both confirmations) | Dawson and Dawson Home Care: You're signed up for news & tips by text. Msg freq varies. Msg&data rates may apply. Reply HELP for help, STOP to opt out. | 151 |
| Inbound **HELP** (also INFO) | Dawson and Dawson Home Care: For help, call (843) 379-3321 (Mon-Fri 8AM-5PM ET) or email info@dawsonhomecare.com. Reply STOP to opt out. | 136 |
| Inbound **STOP** and the six other opt-out words | Dawson and Dawson Home Care: You're unsubscribed and won't get more texts from us. Reply START to sign up again, or call (843) 379-3321. | 136 |
| First inbound text from a new number, office open | Dawson and Dawson Home Care: Thanks for your text. We'll reply soon. Msg&data rates may apply. Reply STOP to opt out. | 117 |
| First inbound text from a new number, office closed | Dawson and Dawson Home Care: Thanks for your text. Our office is closed; we'll reply Mon-Fri 8AM-5PM ET. Emergency? Call 911. Reply STOP to opt out. | 148 |

**Rule for every other text:** starts with "Dawson and Dawson Home Care:" (or the exact registered brand name — §7 A2), and the first text in any new conversation ends with "Reply STOP to opt out."

---
---

# 6. FOOTER + FORM LINKS (build checks)

- Footer on every page: **Privacy** → `/privacy-policy` · **SMS Terms** → `/sms-terms` · **Accessibility** → `/accessibility` (06 global footer — unchanged). `{if analytics = "ga4-ads"}` add **Cookie settings** (opens the banner). `{/if}`
- Every form with a phone field shows links to both `/privacy-policy` and `/sms-terms` near the consent boxes (§1). The referral form (no SMS boxes) links the Privacy Policy under the submit button: "How we handle this information: [Privacy Policy](/privacy-policy)."
- `/sitemap` (HTML) and `sitemap.xml` include all three legal pages.

---
---

# 7. TO VERIFY BEFORE LAUNCH

Work through this after the reveal, before DNS switches. Nothing here blocks the localhost build.

### A. GoHighLevel, carriers and texting rules

1. **List every number that sends texts.** (866) 632-9766 is toll-free → **toll-free verification**. Any local number (for example a 843 number in GHL) → **A2P 10DLC** brand + campaign. Check each one's status in GHL's Trust Center, and add every sending number to SMS Terms §1.
2. **Brand name match.** The consent text says "Dawson and Dawson Home Care LLC." It must match the registered brand (legal name or DBA) exactly — same for the auto-reply prefix (§5). The business name, address, phone, email and website on the Privacy Policy must match the brand registration exactly; mismatches are a common rejection reason.
3. **Update the existing registrations.** The current toll-free verification and any A2P campaign describe the **old WordPress opt-in** (the contact-form checkbox and "By calling or texting (866) 632-9766…"). Update the opt-in description, opt-in URLs (`/free-assessment`, `/contact`), screenshots, privacy and terms URLs (`/privacy-policy`, `/sms-terms`) and sample messages to match the new site. Check whether an edit triggers resubmission, so texting is never blocked during the switch.
4. **Opt-in must be public.** Reviewers need to load the live opt-in page. That can't happen on localhost — submit only after launch (or with screenshots of the live pages).
5. **Use case matches the boxes.** If checkbox 2 stays, the campaign must cover marketing as well as customer care (mixed use case, or two campaigns). If the client won't send marketing texts, set `sms.marketingEnabled = false` and register care texts only.
6. **Opt-out and help replies.** Set the §5 texts. HELP replies are checked during review and must meet requirements. From a real phone, test on every sending number: opt-in confirmation, HELP, STOP, START, and each of QUIT, END, REVOKE, OPT OUT, CANCEL, UNSUBSCRIBE.
7. **STOP behavior in GHL.** Confirm STOP sets SMS Do-Not-Disturb for that contact (all texts — SMS Terms §6 promises this) and START removes it. For opt-outs by phone, email or in person, staff set DND in GHL the same day (10 business days is the legal maximum, not the target).
8. **Workflows respect consent.** Map the consent fields (§1.7) as GHL custom fields. Care workflows text only when `sms_transactional_consent = true` (or the person texted first). Marketing workflows filter on `sms_marketing_consent = true` **and** no DND.
9. **Marketing send window.** Set GHL quiet hours so marketing texts go out only between 8 AM and 8 PM in the recipient's time zone (federal rules allow 8 AM–9 PM; some states are stricter). Have counsel check South Carolina's telephone solicitation rules for marketing texts.
10. **Revocation rules are moving.** Consumers can revoke consent by any reasonable means; that rule is in force. The FCC's "revoke-all" rule was delayed to January 31, 2027, and on September 30, 2026 the FCC adopted an order that lets senders designate one exclusive opt-out method and narrows revoke-all for informational texts — effective 30 days after Federal Register publication. **Our pages don't rely on either change:** we honor STOP, the six other words and any other reasonable request, and STOP ends all texts. Re-check the status with counsel at launch.
11. **Calling ≠ texting consent.** The old disclosure said calling the toll-free number meant agreeing to texts. The new pages drop that. If staff want to text someone who only called, they ask the person to text the number first (or fill in the form).
12. **Consent records retention.** Recommendation: keep consent and opt-out records for at least 5 years after the last text (the federal limit for TCPA claims is 4 years). Confirm with counsel, then publish periods in Privacy §7.

### B. Privacy and data

13. **Analytics decision.** Set `site.config.ts` → `analytics` to what actually loads at launch. `"ga4-ads"` requires the consent banner with equal-weight Accept/Decline, the footer **Cookie settings** link and Global Privacy Control handling (09 §5).
14. **Turnstile.** If no site key at launch, the Turnstile lines must not render (`{turnstile}`).
15. **No form data in logs.** `/api/lead` and `/api/referral` never log request bodies in production. Mock `.leads/*.json` stays git-ignored and `LEAD_MODE=live` at launch — this is what makes Privacy §8 ("isn't stored on our website") true.
16. **Analytics never receives answers.** No form values, quiz answers, estimator values or names in analytics events — event names only (e.g. `quiz_completed`).
17. **HIPAA status.** The pages make no HIPAA claims. Ask the client whether Dawson bills any payer electronically (for example a Medicaid waiver program). If it does, it may be a HIPAA covered entity — then have counsel review the forms and this policy before launch.
18. **South Carolina law check.** As of 2026, South Carolina has no comprehensive consumer privacy law. Its Age-Appropriate Design Code (signed February 2026) targets online services likely to be used by minors and has business thresholds; it very likely doesn't apply to an adult-focused home care site, but confirm with counsel. Also confirm current South Carolina data-breach notice duties (Privacy §8 promises notice "as the law requires").
19. **Open placeholders:** care-records notice (Privacy §1) · call recording (Privacy §2) · advertising tools (Privacy §5, ga4-ads only) · retention periods (Privacy §7) · other sending numbers (SMS §1) · other client care texts (SMS §2) · news-and-tips cap (SMS §4).

### C. Accessibility statement

20. Run the pre-launch audit (axe on every page, keyboard pass, VoiceOver, NVDA, 200% zoom, 320px reflow). Set `legal.a11yAuditDate` — section 5 appears only then.
21. Finalize **Known limitations**: delete items that aren't true at launch, add anything the audit finds with a fix date.
22. If the owner video ships, it has captions and a transcript — or the "Video" paragraph in section 4 is removed until it does.
23. Open placeholders: step-free access (§7), reply-time promise (§8).

### D. Client approval

24. The owner reads and approves all three pages, the consent text and the auto-reply texts. Note who approved and the date. In particular they approve: "We don't sell your personal information," the business-transfer line (Privacy §5), "STOP stops all texts," the 10-business-day promise, and "We can talk you through anything on the site."
25. Recommended: a South Carolina attorney reviews the three pages and §1 before launch.
26. Set `legal.updated.privacy`, `.sms` and `.accessibility` to the launch date.
27. `npm run prelaunch` shows no `[[TO CONFIRM` strings left on the three legal pages (or each remaining one is consciously hidden).

### E. Final build checks

28. All three pages: public, indexable, no login, no cookie wall, readable with JavaScript off, load in under 2 seconds.
29. Footer links on every page; consent-box links on both forms (§6).
30. A test lead with both boxes ticked arrives in GHL with every proof field filled, and the exact text matches `fullText()` for `sms-v1-2026-10`.
