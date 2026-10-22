# 05 — SERVICES, MESSAGING & THE 7 FIXES

## A. New service structure (organised by what a family actually needs)

Families don't search for "ADLs". They think: *"Mom needs help showering"*, *"Dad can't keep up with the house"*, *"She's lonely"*, *"I'm exhausted"*, *"He can't be alone at night."* So every service is named by the need, with the industry term as a small secondary label.

| # | Service (page title) | Plain-language promise | Industry label | What's included |
|---|---|---|---|---|
| 1 | **Personal Care** | Help with bathing, dressing and getting around — with dignity | Activities of Daily Living (ADLs) | Bathing & showering · grooming (shaving, oral care, hair) · dressing (buttons, zippers) · toileting & continence care · help with eating · moving safely: bed ↔ chair ↔ wheelchair, room to room |
| 2 | **Home Help** | Help keeping the house running | Homemaker / IADLs | Light housekeeping · laundry & linens · meal planning & preparation · grocery shopping & errands · medication reminders · escort to appointments |
| 3 | **Companionship** | Company, conversation and getting out | Companion care | Conversation · games & puzzles · daily walks · trips to the park · hobbies & music · outings · simply being there |
| 4 | **Respite Care** | A break for family caregivers | Respite | We step in for a few hours, a weekend or longer so you can rest, work, travel or recharge — your loved one keeps their routine |
| 5 | **24-Hour & Overnight Care** | Someone there, day and night | Round-the-clock care | Overnight supervision · safe nighttime bathroom trips · peace of mind after a fall or hospital stay · shifts covered around the clock, 7 days a week |

**Supporting line (not a 6th service):** *"Already working with a hospice or palliative team? We can provide non-medical comfort and companionship alongside them."* `[[TO CONFIRM]]`

**What we don't do (shown honestly on each service page and in FAQ):** Dawson provides non-medical care. We don't give injections, change wound dressings or provide nursing — we coordinate happily with your home health or hospice providers.

**"Not sure which you need?"** → every service page and the hub link to the Care Quiz. Most families need a mix; care plans combine services.

### Old → new mapping (for redirects and content migration)
| Old page | New page |
|---|---|
| `/adl-care/` | `/care/personal-care` |
| `/personal-care/` | `/care/personal-care` (keyword intent) — its old errands/laundry content moves to `/care/home-help` |
| `/companionship-care/` | `/care/companionship` |
| `/respite-care/` | `/care/respite-care` |
| *(new)* | `/care/home-help`, `/care/24-hour-care` |

## B. Voice & messaging

**Voice:** Warm · calm · plain · confident · local.
- Write to "you" and "your mom/dad/loved one". Use "clients", never "patients".
- Short sentences. One idea per sentence. Reading level ≈ grade 6–8.
- Lead with feelings, follow with facts.
- Be specific and honest. If we don't know, we don't claim.
- Southern warmth without clichés. No "y'all", no exclamation-mark overload.

**Hero options (pick in Chat 2):**
1. *Care that feels like family — because it's run by one.*
2. *Help at home, from people who treat you like family.*
3. *Stay home. Stay you. We'll help with the rest.*

**Message hierarchy (every page should ladder to this):**
1. You're not alone — we've helped Lowcountry families since 2002.
2. The owner meets you personally and builds your plan.
3. Care whenever you need it — a few hours or around the clock, 7 days a week.
4. Starting is simple: one call, one free home visit.

**CTA language (consistent everywhere):**
- Primary: **Get a Free Care Assessment**
- Secondary: **Call (843) 379-3321**
- Tertiary: **Text us** (toll-free (866) 632-9766) · **Find the right care** (quiz) · **Estimate your cost**

## C. The 7 fixes (approved)

### Fix 1 — Broken trust signals
- Real **/privacy-policy**, **/sms-terms**, **/accessibility** pages; real **/sitemap** (HTML) + `sitemap.xml` + `robots.txt`
- Footer links point to real pages; Google Maps only on the address/"Directions" link
- Copyright year rendered dynamically: `© {currentYear} Dawson and Dawson Home Care LLC`
- Proper page titles: e.g. *"In-Home Care in Beaufort, SC | Dawson & Dawson Home Care"* — never "Landing Page"
- Custom Open Graph image per page, favicon set, `theme-color`
- "Licensed & Insured" badge links to a short verification panel (license # placeholder `[[TO CONFIRM]]`)
- Structured data: plain **`LocalBusiness`** (not a medical type — Dawson is non-medical) with name, address, geo, phone, office `openingHoursSpecification`, `areaServed`, `sameAs` (Instagram, Google Maps); plus `Service` items per care page, `FAQPage`, and `BreadcrumbList`

### Fix 2 — 24/7 care vs office hours (no more contradiction)
Approved framing, used site-wide:
> **Care: 24 hours a day, 7 days a week.**
> **Office: Monday–Friday, 8 AM–5 PM.**

- **Live office-status chip** (header on desktop, contact page, footer) computed in `America/New_York`:
  - Open: 🟢 *"Office open now · Call (843) 379-3321"* (leaf-100 chip, leaf-700 dot)
  - Closed: 🌙 *"Office closed · Opens Monday 8 AM. Request a callback and we'll reach you first thing."* (plum-100 chip)
- After hours, the primary CTA becomes **"Request a Callback"** (same form, pre-tagged `after_hours=true` for GHL)
- Every place that says "24/7" clarifies it means **care**, and every place that shows office hours labels them **Office hours**
- Existing-client after-hours line: `[[TO CONFIRM]]` — slot built, hidden until confirmed

### Fix 3 — Accessibility for their exact audience
- New palette (03) — every text/background pair passes AA; the white-on-lime and white-on-orchid buttons are gone
- 18px body minimum, 48px+ touch targets, generous line height, 65ch line length
- **Comfort controls** (floating, bottom-left, keyboard reachable): Text size A / A+ / A++ (100/112/125%), High-contrast mode, Reduce motion — saved in localStorage
- Visible focus rings, skip link, landmark regions, one H1 per page, logical heading order
- All interactive features (house, map, quiz, estimator, carousels) fully keyboard and screen-reader operable, with text alternatives
- Forms: visible labels (never placeholder-only), clear errors in words, `autocomplete` attributes, large inputs
- Video: captions + transcript; no autoplay with sound
- Full detail in 09

### Fix 4 — Muddled services
Solved by section A above: need-based names, clean scopes, "what we don't do", quiz for the undecided, and the referral form options updated to match (Personal Care, Home Help, Companionship, Respite, 24-Hour/Overnight, Support alongside hospice/palliative `[[TO CONFIRM]]`, Not sure).

### Fix 5 — No proof
Built now with placeholders, real assets dropped in later:
- Reviews: data-driven component (`reviews.json`, every item `placeholder: true`) + Google rating badge slot
- Meet the Owner: portrait, story, signature, 60s video slot
- Caregiver spotlights: photo, name, years, "why I do this" quote
- Real-photo slots everywhere (see 11) — no stock-looking imagery in final
- Payment info: Paying for Care page + explorer
- FAQ: grouped accordion + `FAQPage` schema
- Service area: interactive map + town pages

### Fix 6 — Small bugs (all eliminated)
- Every "Learn More" and header CTA links to a real destination (currently some are `#`)
- Typo "sippers" → "zippers"; full spellcheck pass
- One form per page, no duplicates; "Point of Contact" field fixed (single, clear label: "Your name (if you're contacting us for someone else)")
- No duplicated desktop/mobile markup (Elementor issue) — one responsive nav
- Years of experience computed, not hard-coded
- Junk/stray SVG markup in the footer removed
- Inner-page service cards link to their pages
- Consistent phone formatting and `tel:` links everywhere

### Fix 7 — SMS compliance
- Consent checkbox(es) **unchecked by default**, **optional** (form submits without them)
- Two separate consents: (1) care-related/transactional texts, (2) optional marketing texts — mirrors current wording, adds the missing marketing separation
- Disclosure next to the checkbox: program description, "Message frequency varies", "Msg & data rates may apply", "Reply HELP for help, STOP to opt out", links to /privacy-policy and /sms-terms
- Privacy policy includes: *mobile information will not be shared with third parties or affiliates for marketing or promotional purposes*, and text-messaging opt-in data is excluded from any sharing
- Consent proof sent to GoHighLevel with each submission: checkbox state, exact consent text version, timestamp (ISO), page URL
- Keep `/privacy-policy` and `/sms-terms` URLs stable (carrier registrations reference them)
- Full requirements in 09. (Not legal advice — have the final wording checked against GoHighLevel's A2P/toll-free verification checklist before launch.)
