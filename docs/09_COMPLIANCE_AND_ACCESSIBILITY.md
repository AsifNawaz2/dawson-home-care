# 09 — COMPLIANCE, ACCESSIBILITY & CLAIMS RULES

> Not legal advice. This is a build checklist based on common US requirements. Before launch, check final wording against GoHighLevel's A2P 10DLC / toll-free verification checklist and have the client approve all legal pages.

## 1. SMS / text messaging (fixes issue 7)
**Opt-in on forms**
- Checkboxes **unchecked by default** and **not required** to submit the form
- Separate consent for (a) care-related/transactional texts and (b) marketing texts — never bundled
- Consent text sits directly next to the checkbox, readable size (16px+), not hidden in a tooltip

**Transactional consent text (template):**
> ☐ Yes, Dawson and Dawson Home Care LLC may text me about my care inquiry and services I request (for example appointment reminders and scheduling updates). Message frequency varies. Msg & data rates may apply. Reply HELP for help, STOP to opt out. See our [Privacy Policy] and [SMS Terms].

**Marketing consent text (template):**
> ☐ Yes, I'd also like occasional texts with news and tips from Dawson and Dawson Home Care LLC. Message frequency varies. Msg & data rates may apply. Reply STOP to opt out. Consent is not a condition of service.

**Proof of consent** sent with every lead: checkbox values, consent text version ID (e.g. `sms-v1-2026-10`), ISO timestamp, page URL.

**/sms-terms page must include:** program name & description · who sends (Dawson and Dawson Home Care LLC) · message types · frequency ("varies") · "Msg & data rates may apply" · HELP and STOP instructions · support contact (phone + email) · that carriers aren't liable for delayed messages · link to privacy policy · toll-free texting note (current site: "By calling or texting (866) 632-9766 clients agree to receive text messages…" — keep, reword clearly).

**/privacy-policy must include:** what we collect (forms, cookies/analytics), why, how we use it, who we share with (service providers like our CRM) — and the explicit line: *"We do not sell, rent or share mobile phone numbers or text-messaging opt-in data with third parties or affiliates for marketing or promotional purposes."* · data retention · security · children (not directed at under-13s) · your choices (opt out, contact us) · how to contact · last updated date.

## 2. Health information on forms (privacy minimisation)
Non-medical home care agencies may not be HIPAA "covered entities" — but families and referral sources will share sensitive info, so collect the minimum:
- **No** diagnoses, medications, DOB, SSN, Medicare/Medicaid/insurance numbers via web forms
- Free-text notes field: helper text "Please don't include medical details — we'll talk about care needs by phone."
- Referral form asks for client first name + last initial and town only, plus a checkbox: "I have the client's or family's permission to share this information."
- HTTPS everywhere; leads stored only in GHL (mock JSON files on localhost are git-ignored)

## 3. Claims rules (truth in advertising)
| Allowed (verified on current site) | Not allowed until confirmed |
|---|---|
| Since 2002 · Owner run & operated · Owner visits every client · Care available 24/7 · Licensed & insured · Certified Nursing Assistants on the team · Medication reminders · Non-medical care | Any license number · number of clients/caregivers · awards · "best"/"#1" claims · background-check/training specifics · dementia specialisation · hospice support · payment methods accepted · prices · start-within-X-hours promises · response times |
- "Most reliable and trustworthy agency" (current About copy) → remove superlatives; show proof instead
- Reviews: only real reviews at launch; placeholders are marked `placeholder: true` and the build fails a pre-launch check if any remain (`npm run prelaunch`)
- Pricing shown only with clear "estimate" language

## 4. Accessibility — WCAG 2.2 AA checklist
**Perceivable**
- Contrast: all pairs from 03 table only; never white on leaf-500; white on orchid-500 only ≥24px
- Text resizes to 200% without loss; layout reflows at 320px width
- Alt text for every meaningful image; decorative images `alt=""`; SVG illustrations have `<title>`/`aria-label` or `aria-hidden`
- Video captions + transcript; no autoplaying audio
- Don't convey meaning by color alone (office status uses icon + words)

**Operable**
- Everything works by keyboard; visible focus (3px leaf ring); logical tab order; skip-to-content link
- No keyboard traps (modals trap focus intentionally and release on Esc)
- Motion: honour `prefers-reduced-motion` + Comfort Controls toggle; pause buttons on marquees/carousels; nothing flashes >3×/sec
- Pinned scroll scenes never block scrolling; keyboard Page Down/Space works normally
- Touch targets ≥ 48×48px (WCAG 2.2 min is 24px — we go bigger for seniors)
- Custom cursor never hides the native cursor

**Understandable**
- Plain language; one H1; consistent navigation; labels on every input; errors described in text with how to fix; `autocomplete` on name/email/tel/address fields
- Multi-step forms show step X of Y and allow going back without losing data

**Robust**
- Semantic HTML first, ARIA only when needed; tested with VoiceOver (iOS/macOS) and NVDA
- Automated: axe in Playwright on every page; manual keyboard pass before reveal

**/accessibility page:** commitment, standard (WCAG 2.2 AA), features (comfort controls, keyboard, captions), known limitations, how to report a problem (phone/email), date.

## 5. Cookies & tracking
- On localhost: no tracking
- At launch: if GA4 only with IP anonymisation → simple notice; if Meta pixel/ads remarketing → consent banner with "Accept / Decline" equal prominence (decline = no marketing scripts)

## 6. SEO compliance basics
- Unique title + meta description per page; canonical URLs; `sitemap.xml`; `robots.txt` (block `/thank-you`, `/api`)
- LocalBusiness schema matching the Google Business Profile exactly (name, address, phone)
- No doorway pages: each town page has genuinely unique, useful content
