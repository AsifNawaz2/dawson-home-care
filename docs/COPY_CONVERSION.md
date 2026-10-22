# COPY_CONVERSION — Conversion pages, forms, quiz

**Status:** Final copy for design + build. Use verbatim.
**Pages:** `/free-assessment` · `/find-care` (Care Quiz) · `/for-professionals` · `/contact` · `/careers` · `/thank-you` · 404
**Global pieces:** office-status chip · sticky mobile action bar · after-hours mode · every form validation and error message
**Data file (end of this doc):** `content/quiz.ts` (type-checks under `tsc --strict` with `noUncheckedIndexedAccess`)
**Sources:** 04, 05, 06, 07 (§1, §10, §11, §12, §13), 08 §2, 09 (§1, §2, §3, §4), BRAND_FINAL §1.4–1.6, COPY_HOME, COPY_SERVICES, COPY_TRUST, COPY_COST_FAQ, COPY_AREAS.
**Reading level:** grade 6–8. **Voice:** warm, calm, plain, local. "Clients", never "patients" — on the professionals page too.

---

## 0. Conventions (read first)

Everything in **COPY_HOME.md §0** applies: `{years}`, `{currentYear}`, `{officeStatus}`, `{nextOpen}`, `[[TO CONFIRM: …]]`, cursor labels, no text on photos, alt-text rule. **Pending blocks** work as in COPY_COST_FAQ §0: a line marked *(hidden until confirmed)* renders only when `NEXT_PUBLIC_SHOW_PLACEHOLDERS=true`, and every sentence around it reads correctly without it. The **Standard CTA band** is COPY_TRUST §0.

**New tokens in this file:**

| Token | Source | Fallback |
|---|---|---|
| `{firstName}` | the person's own first name, from the form just sent (sessionStorage, read once on `/thank-you`, then cleared) | omitted — "Thank you." |
| `{lovedOneName}` | assessment Step 1 "Their first name" | "your loved one" |
| `{ET}` | `lib/officeHours.ts`: `" ET"` when the visitor's time zone isn't `America/New_York`, else `""` | `""` |
| `{reachVerb}` | preferred contact: `call` / `text` / `email`. **Text only if the transactional SMS box was ticked** — otherwise `call` | `call` |
| `{holiday}` | holiday name from `site.config.ts` (optional list) | — |

`{nextOpen}` gains `{ET}` everywhere in this file: "Monday at 8 AM ET" for a daughter in Ohio, "Monday at 8 AM" for someone in Beaufort.

**After-hours rule (site-wide, unchanged):** when `{officeStatus}` = closed, every **Get a Free Care Assessment** button becomes **Request a Callback**. Same destination, `after_hours=true`.

**Shared field values** (one vocabulary across quiz, assessment form, estimator and GHL — never rename one without the others):

| Field (GHL, 08 §2) | Values |
|---|---|
| `care_for` | `parent` · `spouse` · `self` · `someone-else` |
| `services[]` | `personal-care` · `home-help` · `companionship` · `respite-care` · `24-hour-care` · `hospice-support` *(hidden until confirmed)* · `not-sure` |
| `hours_preset` | `few-hours-week` · `few-hours-most-days` · `full-days` · `around-the-clock` · `not-sure` · `estimate` |
| `hours_per_week` | number, from the preset (6 · 20 · 40 · 168) or the estimator; empty for `not-sure` |
| `start_timing` | `asap` · `two-weeks` · `month` · `exploring` |
| `town` | `areas.ts` slug · `other` · `not-sure` (+ `town_other` free text) |
| `best_time` | `morning` · `midday` · `afternoon` · `any` |
| `preferred_contact` | `call` · `text` · `email` |
| `form_type` | `assessment` · `contact` · `referral` · `quiz_plan` |

**Forms — the rules every form here follows**
- One column. Labels above fields, always visible. Never placeholder-only.
- Required fields carry the word **(required)** in the label (BRAND_FINAL §1.4 #19). No red asterisks.
- `autocomplete` on every name, email, tel and address-like field.
- Errors appear on blur or on submit — never while someone is still typing. Pattern: 2px alert-700 border + `CircleAlert` icon + message in words (BRAND_FINAL §1.6). Full message list in §8.
- Multi-step forms say "Step X of Y", keep answers when going back, and move focus to the step heading on every step change.
- Progress saves to sessionStorage (this browser tab only). Nothing sensitive in URLs — ever (09 §2). Prefill travels by sessionStorage; URLs carry only `from=`, `service=`, `town=`, `pay=` and estimator hours/days.
- Honeypot field: label "Leave this field empty", visually hidden, `tabindex="-1"`, `autocomplete="off"`. If filled, the server returns success and drops the lead silently.
- Turnstile is invisible. No CAPTCHA puzzles.

**Headings:** one H1 per page. Section titles are H2. Form steps are H2 inside the form section; cards, FAQ questions and groups are H3.

**Eyebrow numbering:** Hero and CTA band are bookends. Sections in between are **01, 02, …**

**Page meta** is draft — SEO_PLAN.md overrides when it exists.

---
---

# 1. GLOBAL — Office-status chip

Computed client-side in `America/New_York` (07 §11). Mon–Fri 08:00–17:00 = open. Icon + words, never color alone (BRAND_FINAL §1.5: open = leaf-100 chip, leaf-700 dot + text; closed = plum-100 chip, plum-800 moon + text).

**Server render / no JS / before hydration** (prevents a wrong "open" flash and hydration mismatch):
> Office hours: Mon–Fri, 8 AM–5 PM

| State | When | Compact (header, mobile menu, quiz result) | Expanded (contact page, free-assessment panel, footer, thank-you) |
|---|---|---|---|
| Open | Mon–Fri 8:00 AM–4:29 PM | **Office open now** | **Office open now** · Call (843) 379-3321 |
| Closing soon | Mon–Fri 4:30–4:59 PM | **Office open until 5 PM{ET}** | **Office open until 5 PM{ET}** · Call (843) 379-3321 now, or request a callback. |
| Closed | Evenings, weekends | **Office closed · Opens {nextOpen}{ET}** | **Office closed · Opens {nextOpen}{ET}.** Request a callback and we'll reach you first thing. |
| Holiday | Date in `site.config.ts` holidays | **Office closed for {holiday} · Opens {nextOpen}{ET}** | **Office closed today for {holiday} · Opens {nextOpen}{ET}.** Request a callback and we'll reach you first thing. |

**Always paired with care hours.** Wherever the expanded chip appears, the next line is:
> **Care:** 24 hours a day, 7 days a week

**Screen readers:** the dot and moon are `aria-hidden`; the words carry the state. The chip is not a live region (it would interrupt). It re-checks every 60 seconds and on tab focus.

**Existing-client line** *(hidden until confirmed)* — shown under the expanded chip when closed:
> Already a client? Reach us after hours at [[TO CONFIRM: after-hours line for existing clients]].

---

# 2. GLOBAL — Sticky mobile action bar

Fixed bottom on mobile (07 §10). Three equal buttons, 56px tall, icon above label, safe-area inset respected.

| Slot | Label (visible) | Accessible name | Action |
|---|---|---|---|
| 1 | **Call** | Call Dawson at (843) 379-3321 | `tel:+18433793321` |
| 2 | **Text** | Text Dawson at (866) 632-9766 | `sms:+18666329766` |
| 3 | **Free Assessment** | Get a free care assessment | `/free-assessment` |
| 3 (after hours) | **Callback** | Request a callback | `/free-assessment` (`after_hours=true`) |

- Landmark: `nav` with `aria-label="Quick contact"`.
- Hides while the on-screen keyboard is open, and while any form field is in view (07 §10).
- On `/free-assessment` and `/thank-you`: slot 3 is removed and Call + Text share the width (no button that points at the page you're on).
- Comfort controls button sits above the bar, never behind it.

---

# 3. FREE ASSESSMENT — /free-assessment

## Page meta

- **Title:** Free In-Home Care Assessment | Dawson & Dawson, Beaufort SC
- **Meta description:** Request a free, no-obligation home visit from our owner. Tell us a little about your family in 2 minutes and we'll call you to set it up.

**Breadcrumb:** Home › Free Assessment

---

## 1. Hero

**Eyebrow:** Free care assessment

**Headline (H1):**
> A free visit at home, with our *owner*.

**Subline (lead):**
> Tell us a little about your family. We'll call you, then our owner comes to your loved one's home to plan care with you. Free, with no obligation.

**Microcopy:**
> About 2 minutes · 5 short steps

**After-hours line** (replaces nothing; sits under the microcopy when closed):
> Our office is closed right now. Send this and we'll call you first thing {nextOpen}{ET}.

**Prefill banner** (polite, dismissible with **Dismiss**, above Step 1 — one line, whichever source applies):

| Source (`from=` / params) | Banner |
|---|---|
| Quiz (`from=quiz`) | We've filled in your quiz answers. Check them as you go. |
| Service page (`service={slug}`) | We've ticked **{Service}** for you. Add anything else that might help. |
| Service checklist (`needs=` present) | We've noted what you ticked on the {Service} page. |
| Estimator (`hours`/`days` present) | We've added your estimate: about {weeklyHours} hours a week. |
| Town page (`town={slug}`) | We've filled in {town}. |
| Payment Explorer (`pay={id}`) | No banner. Hidden field `payment_interest` only. |

**Resume banner** (sessionStorage has an unfinished form):
> Welcome back. We kept your answers.
- Buttons: **Pick up where I left off** · **Start over**

---

## 2. Multi-step form

**Section ID:** `form` · `aria-labelledby` the current step heading.

**Progress** (visual: plum-800 heartbeat line filling, BRAND_FINAL §1.4 #16; text always visible):
> Step {n} of 5 · {step name}

Step names: **Who** · **Help** · **Timing** · **You** · **Send**

Screen-reader announcement on step change (polite): "Step {n} of 5: {step heading}." Focus moves to the step heading.

**Buttons (every step):**
- Primary: **Continue** (Step 5: see below)
- Text button: **Back** (Steps 2–5)

**Save note** (small, under the buttons on Steps 1–4):
> Your answers are saved in this browser tab, so you can go back or take a break.

---

### Step 1 — Who needs care?

**Heading (H2):**
> Who needs care?

**Field: Who is the care for? (required)** — radio cards, `name="care_for"`
- My parent
- My spouse or partner
- Myself
- Someone else

**Field: Their first name** — text, `autocomplete="off"`, max 40
- Helper: So we know who we're talking about. First name is plenty.
- Hidden when "Myself" is chosen.

**Field: Where do they live? (required)** — native `<select>`, `name="town"`
- Label when "Myself": **Where do you live? (required)**
- First option: Choose a town
- `<optgroup label="Near our office">` and `<optgroup label="Extended service area">` from `areas.ts`, A–Z
- Then: **Somewhere else** · **Not sure**
- Helper: So we can check we reach their town. *(Myself: "your town")*

**Field (appears for "Somewhere else"): Which town?** — text, max 60
- Helper: Type the town name. We'll check when we talk.
- Optional.

**Extended-area note** (polite live region, appears when an extended-tier town is chosen):
> {town} is in our extended service area. We'll check scheduling for your hours when we call.

---

### Step 2 — What kind of help?

**Heading (H2):**
> What kind of help might {lovedOneName} need?
- "Myself": **What kind of help might you need?**

**Field: Choose all that might help. (required)** — checkbox cards, `name="services"`. Selected = fill + 2px plum-800 border + check icon (BRAND_FINAL §1.4 #13).

| Value | Card title | Card line |
|---|---|---|
| `personal-care` | **Personal Care** | Bathing, dressing and getting around |
| `home-help` | **Home Help** | Meals, laundry, errands and medication reminders |
| `companionship` | **Companionship** | Company, conversation and getting out |
| `respite-care` | **Respite Care** | A break for the family caregiver |
| `24-hour-care` | **24-Hour & Overnight Care** | Someone there, day and night |
| `hospice-support` *(hidden until confirmed)* | **Support alongside a hospice team** | [[TO CONFIRM: hospice/palliative support]] Non-medical comfort and company |
| `not-sure` | **Not sure yet** | Help me decide |

- **Not sure yet** is exclusive: ticking it clears the others; ticking any other clears it.
- Helper (under the group label): You can change your mind later. Most families combine two or three.
- Link under the cards: **Not sure? Take the 1-minute quiz** → `/find-care` (small: "Your answers here are saved.")
- Non-medical line (small): All our care is non-medical. We work alongside home health and hospice teams.

---

### Step 3 — When, and how much?

**Heading (H2):**
> When, and how much help?

**Field: When would you like care to start? (required)** — radio, `name="start_timing"`
- As soon as possible
- Within 2 weeks
- Within a month
- Just exploring

**Field: How much help do you think is needed? (required)** — radio, `name="hours_preset"`
| Value | Label | Helper |
|---|---|---|
| `estimate` *(only when the estimator sent hours)* | **My estimate** | About {weeklyHours} hours a week |
| `few-hours-week` | **A few hours a week** | Like 3 hours, twice a week |
| `few-hours-most-days` | **A few hours most days** | Like 4 hours, 5 days a week |
| `full-days` | **Full days** | Like 8 hours, 5 days a week |
| `around-the-clock` | **Around the clock** | Day and night, 7 days a week |
| `not-sure` | **Not sure yet** | We'll work it out together |

**Field: Coming home from the hospital?** — single checkbox, `name="coming_from_hospital"`
- Label: {They're} in the hospital or rehab now, or just came home. *(Myself: "I'm in the hospital or rehab now, or just came home.")*
- Helper (shows when ticked): Thank you. If you can, call us before discharge: (843) 379-3321.

**ASAP note** (polite, appears when "As soon as possible" is chosen):
- Open: **The quickest way to start is a phone call: (843) 379-3321.** Or keep going — we'll call you.
- Closed: **Our office is closed right now.** Keep going and we'll call you first thing {nextOpen}{ET}.
- Always (small): If someone is hurt or in danger, call 911.

---

### Step 4 — How can we reach you?

**Heading (H2):**
> How can we reach you?

**Intro (small):**
> We'll call to talk things through and set up the visit.

| Field | Label | Type / autocomplete | Helper |
|---|---|---|---|
| `first_name` | **Your first name (required)** | text · `given-name` | — |
| `last_name` | **Your last name** | text · `family-name` | — |
| `phone` | **Phone (required)** | `tel` · `tel-national` · `inputmode="tel"` | We'll call you on this number. |
| `email` | **Email** | `email` · `email` | Only if you'd like us to email you. |
| `preferred_contact` | **Best way to reach you (required)** | radio | — |
| `best_time` | **Best time to call** | radio | Eastern time. Our office is open Monday–Friday, 8 AM–5 PM. |
| `notes` | **Anything else we should know?** | textarea, 4 rows, max 1,000 | Please don't include medical details — we'll talk about care needs by phone. |

`preferred_contact` options: **Phone call** · **Text message** · **Email**
- Email chosen → the Email label becomes **Email (required)**.
- Text chosen → small note under the radios: We'll text you only if you tick the first box on the next step. Otherwise we'll call.

`best_time` options: **Morning (8–11 AM)** · **Midday (11 AM–2 PM)** · **Afternoon (2–5 PM)** · **Any time**

Phone formats as typed: `(843) 379-3321`. Accepts +1, spaces, dots and dashes.

Notes counter (visible from 800 characters, polite): "{n} characters left"

**Notes privacy check** (soft note, not an error; plum-100 panel, shown on blur):
- If it looks like a date of birth (e.g. 3/14/1941): **It looks like this might include a date of birth. You don't need to share it here — we'll ask for anything we need by phone.**

---

### Step 5 — Check and send

**Heading (H2):**
> Check and send.

**Summary** (definition list; each row has a **Change** text button that returns to that step and moves focus to the field):

| Row label | Shows |
|---|---|
| Care is for | {care_for label}{, {lovedOneName}} |
| Town | {town} |
| Help with | {services, joined "A, B and C"} |
| Start | {start_timing label} |
| Hours | {hours label} |
| Your name | {first_name} {last_name} |
| Reach you by | {preferred_contact label} at {phone or email} |
| Best time | {best_time label} |
| Notes | {notes, first 120 characters…} |

Change buttons' accessible names: "Change who the care is for", "Change town", "Change help", "Change start", "Change hours", "Change your name", "Change how we reach you", "Change best time", "Change notes".

**Text messages (group label, H3):**
> Text messages (optional)

**Checkbox 1 — care-related texts** (unchecked, optional; text from 09 §1 template — COPY_LEGAL.md overrides when it exists):
> ☐ Yes, Dawson and Dawson Home Care LLC may text me about my care inquiry and services I request (for example appointment reminders and scheduling updates). Message frequency varies. Msg & data rates may apply. Reply HELP for help, STOP to opt out. See our [Privacy Policy](/privacy-policy) and [SMS Terms](/sms-terms).

**Checkbox 2 — marketing texts** (unchecked, optional):
> ☐ Yes, I'd also like occasional texts with news and tips from Dawson and Dawson Home Care LLC. Message frequency varies. Msg & data rates may apply. Reply STOP to opt out. Consent is not a condition of service.

Consent version: `sms-v1-2026-10` `[[TO CONFIRM: final wording + version from COPY_LEGAL.md]]`. Sent with checkbox values, ISO timestamp and page URL (09 §1).

**Text-preference reminder** (shows when `preferred_contact` = text and checkbox 1 is unticked; polite; not an error):
> You chose text as the best way to reach you. To get texts, tick the first box. Otherwise, we'll call.

**Submit button:**
- Open: **Send my request**
- Closed: **Request my callback**
- While sending: **Sending…** (button `aria-disabled`, spinner `aria-hidden`, live region "Sending your request.")

**Under the button (small):**
> Free, with no obligation. We never sell or share your phone number for marketing.

**Success** (≤ 600ms heartbeat-to-check animation per 07 §20, none in reduced motion) → redirect to `/thank-you?form=assessment` (closed: `/thank-you?form=callback`).

---

## 3. Reassurance side panel

Desktop: sticky right column beside the form. Mobile: a compact strip above the form, the full panel after the form. `aside` with `aria-labelledby` its heading.

**Compact strip (mobile, above the form):**
> Free · No obligation · Our owner visits

**Heading (H2):**
> What happens next

**Three steps** (ordered list, small numbered dots):
1. **We call you.**
   - Open: As soon as we can. *(hidden until confirmed)* `Within [[TO CONFIRM: response time during office hours]].`
   - Closed: First thing {nextOpen}{ET}.
2. **Our owner visits — free.**
   At your loved one's home. We talk about their days and the help they need.
3. **You decide.**
   No obligation, and no pressure to decide that day.

**Owner card:**
- Photo: `owner-portrait.jpg` (1:1 crop of the 4:5 portrait)
- Alt: {ownerFullName}, owner of Dawson and Dawson Home Care.
- Caption: **{ownerFirstName}, Owner** *(fallback: "Our owner")* — the person who'll visit.
- Placeholder label: "Owner portrait · 1:1"

**Office status:** expanded chip (§1) + **Care:** 24 hours a day, 7 days a week

**Rather talk?** (H3)
- Open: **Call (843) 379-3321** → `tel:+18433793321` · cursor label `Call`
- Closed: Our office opens {nextOpen}{ET}. You can still call (843) 379-3321 and leave a message, or text (866) 632-9766. `[[TO CONFIRM: is there voicemail on the main line after hours?]]` *(Production fallback while unconfirmed: "Our office opens {nextOpen}{ET}. Text us at (866) 632-9766, or send this form and we'll call you first thing.")*

**Your information** (H3, small):
> We ask only what we need to call you back. Please don't send medical details online.
> Link: **Privacy Policy** → `/privacy-policy`

**Link (small):** **What happens at the free visit** → `/how-it-works#free-assessment`

---

## 4. Call alternative (below the form on all sizes)

**Heading (H2):**
> Prefer to talk it through?

**Body:**
> Some families would rather just call. That's fine — we'll ask the same few questions.

**Buttons:**
- Ghost: **Call (843) 379-3321** → `tel:+18433793321` · cursor label `Call`
- Ghost: **Text us (866) 632-9766** → `sms:+18666329766`

**Hours (always both, always labelled):**
> **Care:** 24 hours a day, 7 days a week
> **Office:** Monday–Friday, 8 AM–5 PM

---

## 5. Data sent with an assessment lead (GHL, 08 §2)

`form_type=assessment` · `first_name` · `last_name` · `phone` · `email` · `care_for` · `client_first_name` · `town` · `town_other` · `services` · `hours_preset` · `hours_per_week` · `start_timing` · `coming_from_hospital` · `best_time` · `preferred_contact` · `notes` · `sms_transactional_consent` · `sms_marketing_consent` · `consent_text_version` · `consent_timestamp` · `page_url` · `utm_*` · `quiz_*` · `estimator_*` · `service_page_needs` · `payment_interest` · `payment_explored` · `prefill_source` · `after_hours`

New vs 08 §2: `town_other`, `hours_preset`, `coming_from_hospital`, `prefill_source` (see Decisions).

---
---

# 4. THANK YOU — /thank-you

## Page meta

- **Title:** Thank You | Dawson & Dawson Home Care
- **Robots:** `noindex, nofollow`. Excluded from `sitemap.xml`; `/thank-you` blocked in `robots.txt` (09 §6).

No breadcrumb.

**Variants** by `form=` param. Unknown or missing param → the **assessment** variant without a name. Focus lands on the H1 (page transition rule).

---

## 1. Thank you, {first name}

### Assessment — office open (`form=assessment`, open)

**H1:**
> Thank you, {firstName}.

**Lead:**
> We've got your request. Our office is open now, so we'll {reachVerb} you as soon as we can.
> *(hidden until confirmed)* `Most families hear from us within [[TO CONFIRM: response time during office hours]].`

### Assessment — office closed (`form=callback`, i.e. sent with `after_hours=true`)

The open/closed variant is decided by `after_hours` **at the moment of sending** (stored with the first name), never by the time the page is viewed.

**H1:**
> Thank you, {firstName}.

**Lead:**
> We've got your request. Our office is closed right now, so we'll {reachVerb} you first thing {nextOpen}{ET}.

**Small line (closed only):**
> If someone is hurt or in danger, call 911.
> *(hidden until confirmed)* `Already a client? Reach us after hours at [[TO CONFIRM: after-hours line for existing clients]].`

### Referral (`form=referral`)

**H1:**
> Thank you, {firstName}. Referral received.

**Lead:**
- Open: We'll call you as soon as we can to talk through the details.
- Closed: Our office is closed right now. We'll call you first thing {nextOpen}{ET}.
- *(hidden until confirmed)* `We respond to referrals within [[TO CONFIRM: referral response time]].`

**Small line:**
> Have paperwork to send? Fax it to (866) 502-3509.

### Contact (`form=contact`)

**H1:**
> Thanks, {firstName}. Message received.

**Lead:**
- Open: We'll {reachVerb} you as soon as we can.
- Closed: Our office is closed right now. We'll {reachVerb} you after we open {nextOpen}{ET}.

### "Save our number" (all family variants — assessment, callback, contact) *(hidden until confirmed)*

**Card (H3):**
> **Save our number**
> Add (843) 379-3321 to your phone as "Dawson Home Care" — so you know it's us when we call.

`[[TO CONFIRM: does the office call families back from (843) 379-3321? If calls come from another number, use that one — or drop the card.]]`

---

## 2. What happens next (timeline)

Vertical heartbeat line; step 1 is done (leaf check icon + "Done" in words). Reduced motion: static list.

**Assessment / callback / contact variants:**

**H2:** What happens next

1. **Request sent** · Done
   We have everything we need for now.
2. **We {reachVerb} you**
   Open: As soon as we can. Closed: First thing {nextOpen}{ET}. We'll answer your questions and set up the visit.
3. **Our owner visits — free**
   At your loved one's home. We talk about their days and the help they need.
4. **We build the plan together**
   No obligation. You decide if and when to start.

**Referral variant:**

**H2:** What happens next

1. **Referral sent** · Done
2. **We call you** — to talk through the client's needs, timing and who to contact.
3. **We reach the family** — and our owner sets up a free visit at home.
4. **Care starts** — and we keep you and the family in the loop. `[[TO CONFIRM: how Dawson updates referral sources after care starts]]` *(hidden until confirmed)*

---

## 3. While you wait

**H2:**
> While you wait

**Cards** (H3 + line + link; cursor label `Open`):
- **What happens at the free visit** — A friendly conversation at home, not an interview. → `/how-it-works#free-assessment`
- **What to have ready** — A short list to make the visit easier. Nothing is required. → `/how-it-works#have-ready`
- **Questions families ask** — Plain answers about care, cost and caregivers. → `/faq`
- **Paying for care** — Estimate costs and see how families pay. → `/paying-for-care`

**Referral variant cards:**
- **What we do and don't do** → `/for-professionals#scope`
- **Home care and home health, side by side** → `/paying-for-care#pay-medicare`

**Hours (always both, always labelled):**
> **Care:** 24 hours a day, 7 days a week
> **Office:** Monday–Friday, 8 AM–5 PM

**Link:** **Back to the home page** → `/`

---
---

# 5. FOR PROFESSIONALS — /for-professionals

## Page meta

- **Title:** Refer a Client for Home Care | Dawson & Dawson, Beaufort SC
- **Meta description:** For discharge planners, case managers and care teams: refer a client for non-medical home care in Beaufort, SC in about 2 minutes, or fax (866) 502-3509.

**Breadcrumb:** Home › For Professionals

---

## 1. Hero

**Eyebrow:** For healthcare professionals

**Headline (H1):**
> Refer a client in about *2 minutes*.

**Subline (lead):**
> For discharge planners, case managers, social workers and care teams. Non-medical home care across the Lowcountry since 2002 — from a few hours a week to around the clock.

**Buttons:**
- Primary: **Make a referral** → `#refer`
- Ghost: **Call (843) 379-3321** → `tel:+18433793321` · cursor label `Call`

**Small line:**
> Fax: (866) 502-3509

**Response line:**
> *(hidden until confirmed)* `We respond to referrals within [[TO CONFIRM: referral response time]].`
> Production fallback while unconfirmed: **Office hours: Monday–Friday, 8 AM–5 PM. Care: 24 hours a day, 7 days a week.**

**Fact row (icon + words):**
> Since 2002 · Owner-run · Licensed & insured · Non-medical · Care 24/7

---

## 01 — Who we help

**Section ID:** `who-we-help`
**Eyebrow:** 01 — Who we help

**Headline (H2):**
> Who we help.

**Who this page is for (H3: "This page is for")** — chips, not links:
> Discharge planners · Case managers · Social workers · Home health teams · Physician offices · Hospice and palliative teams *(hidden until confirmed)*

These name the audience, not existing referral partners — never label them "who refers to us" unless the client confirms it.

**Clients we often help (H3 cards):**

**Going home from the hospital or rehab**
> Help with bathing, meals and moving safely in the first days and weeks home.

**Between home health visits**
> Home health visits are usually short. We can be there for the hours in between.

**Living alone and finding it harder**
> Meals, housework, medication reminders and someone checking in.

**Family caregivers near burnout**
> Respite for a few hours, a weekend or longer — so the family can keep going.

**On hospice or palliative care** *(hidden until confirmed)*
> [[TO CONFIRM: hospice/palliative support]] Non-medical comfort and companionship alongside the hospice or palliative team.

---

## 02 — What we do / don't do

**Section ID:** `scope`
**Eyebrow:** 02 — Scope of care

**Headline (H2):**
> What we do — and what we don't.

**Subline:**
> All our care is non-medical. Here's exactly where the line is.

**Two columns** (`<table>` on desktop with caption "What Dawson does and doesn't do"; two stacked lists on mobile, each with an H3). Icon + words: leaf check = **We do**, plum minus = **We don't**. Never color alone.

**We do (H3)**
- Bathing, showering and grooming
- Dressing
- Toileting and continence care
- Help with eating
- Safe transfers: bed, chair, wheelchair, room to room
- Meal planning and cooking
- Light housekeeping, laundry and linens
- Groceries and errands
- Medication reminders
- Going along to appointments `[[TO CONFIRM: do caregivers drive clients?]]`
- Companionship, walks and outings
- Respite for family caregivers
- Overnight and 24-hour shifts, 7 days a week

**We don't (H3)**
- Nursing or skilled care
- Injections
- Wound care or dressing changes
- Giving medication (we give reminders only)
- Filling pill organizers `[[TO CONFIRM: can caregivers fill weekly pill organizers? If yes, remove this line.]]`
- Medical assessments or therapy

**Note under the table (small):**
> Our team includes Certified Nursing Assistants. That doesn't change our scope: our care is non-medical.

---

## 03 — Fast referral form

**Section ID:** `refer`
**Eyebrow:** 03 — Make a referral

**Headline (H2):**
> Make a referral.

**Subline:**
> About 2 minutes. Share only the minimum — we'll get the rest by phone.

**Privacy panel** (plum-100, above the form; icon + H3):
> **Please don't send medical details here**
> No diagnoses, dates of birth, Social Security, Medicare, Medicaid or insurance numbers. Client first name, last initial and town are all we need online.

**Form** — single page, three groups (`fieldset` + `legend` each).

### Group 1 — About you (legend: "About you")

| Field | Label | Type / autocomplete | Options / helper |
|---|---|---|---|
| `referrer_first_name` | **Your first name (required)** | text · `given-name` | — |
| `referrer_last_name` | **Your last name (required)** | text · `family-name` | — |
| `organization` | **Organization (required)** | text · `organization` | Helper: Hospital, agency or practice. |
| `role` | **Your role (required)** | radio | Discharge planner · Case manager · Social worker · Hospice team · Physician's office · Other |
| `role_other` | **Your role** | text, shows for "Other" | Required when shown. |
| `referrer_phone` | **Your phone (required)** | `tel` · `tel-national` | Helper: Direct line or extension, if you have one. |
| `referrer_email` | **Your email (required)** | `email` · `email` | — |
| `reach_by` | **Best way to reach you (required)** | radio | Phone · Email |

### Group 2 — About the client (legend: "About the client")

| Field | Label | Type | Helper |
|---|---|---|---|
| `client_first_name` | **Client's first name (required)** | text, max 40, `autocomplete="off"` | — |
| `client_last_initial` | **First letter of client's last name (required)** | text, 1 character, `autocomplete="off"`, width 4ch | Just one letter. |
| `town` | **Client's town (required)** | `<select>`, same list as the assessment form | Where care will happen. |
| `town_other` | **Which town?** | text, shows for "Somewhere else" | Optional. |

### Group 3 — Care needed (legend: "Care needed")

**Field: Services needed (required)** — checkboxes, `name="services"`
- Personal Care — bathing, dressing, toileting, transfers
- Home Help — meals, housekeeping, errands, medication reminders
- Companionship
- Respite Care
- 24-Hour & Overnight Care
- Support alongside hospice or palliative care *(hidden until confirmed)* `[[TO CONFIRM]]`
- Not sure — let's discuss

**Field: When should care start? (required)** — radio, `name="start_timing"`
- As soon as possible
- On a specific date
- Within 2 weeks
- Not sure yet

**Field (shows for "On a specific date"): Start or discharge date (required)** — `type="date"`
- Helper: Today or later.

**Field: Hours or schedule (required)** — radio, `name="hours_preset"`
- A few hours a week · A few hours most days · Full days · Around the clock · Not sure yet

**Field: Schedule details** — text, max 200
- Helper: For example, "Mornings, Mon–Fri" or "Nights for the first two weeks."

**Field: Anything else we should know?** — textarea, max 1,000
- Helper: Please don't include diagnoses or other medical details. We'll talk through care needs by phone.

**Field: Permission (required)** — single checkbox, `name="permission_confirmed"`
> ☐ I have the client's or family's permission to share this information with Dawson and Dawson Home Care LLC.

**Submit:** **Send referral** · while sending: **Sending…**

**Under the button (small):**
> Prefer fax? Send it to (866) 502-3509.

**After-hours line** (above the submit button when closed):
> Our office is closed right now. Send this and we'll pick it up first thing {nextOpen}{ET}.

No SMS consent checkboxes on this form: referrers choose phone or email only. Success → `/thank-you?form=referral`. GHL tag `referral` (07 §13); `form_type=referral`.

---

## 04 — Fax and phone

**Section ID:** `fax-phone`
**Eyebrow:** 04 — Fax or call

**Headline (H2):**
> Prefer fax or phone?

**Two cards (H3):**

**Fax a referral**
> **(866) 502-3509**
> Please include your name, organization and a callback number; the client's name and town; the services needed; and when care should start.

**Call us**
> **(843) 379-3321** → `tel:+18433793321` · cursor label `Call`
> Office: Monday–Friday, 8 AM–5 PM. Care: 24 hours a day, 7 days a week.

**Email (small, under the cards):**
> General questions: info@dawsonhomecare.com → `mailto:info@dawsonhomecare.com`. Please don't email client details.

---

## 05 — Response time

**Section ID:** `response`
**Eyebrow:** 05 — What to expect

**Headline (H2):**
> What happens after you refer.

**Steps (ordered list):**
1. **We call you** to talk through needs, timing and who to contact.
   *(hidden until confirmed)* `Within [[TO CONFIRM: referral response time]].`
2. **We reach the family** and our owner sets up a free visit at home.
3. **Care starts** — a few hours or around the clock.
   *(hidden until confirmed)* `[[TO CONFIRM: typical time from referral to first shift]]`
4. **We keep checking in** and adjust the plan as needs change.

**Discharge line (lead):**
> Discharge coming up? Refer as early as you can. It gives us time to plan the first days home.

---

## 06 — Referral sheet (PDF later)

**Section ID:** `referral-sheet`
**Eyebrow:** 06 — For your files

**Headline (H2):**
> A one-page sheet for your office.

**Body:**
> Everything on one page: what we do and don't do, how to refer, and our phone and fax numbers.

**Button (coming-soon state, until the PDF exists):**
- Disabled-style (BRAND_FINAL §1.4 #20: bg `line`, text `muted`, `aria-disabled="true"`): **Referral sheet — coming soon**
- Small: In the meantime, save this page or note our fax: (866) 502-3509.

**Button (when `referral-sheet.pdf` exists):**
- Ghost: **Download the referral sheet (PDF, 1 page)** → `/downloads/dawson-referral-sheet.pdf`

**Sheet content (for the PDF build, later):** logo · "Non-medical home care in Beaufort and the Lowcountry since 2002" · We do / We don't (from §02) · How to refer: online at dawsonhomecare.com/for-professionals, fax (866) 502-3509, call (843) 379-3321 · Office: Mon–Fri, 8 AM–5 PM · Care: 24/7 · address · license line `[[TO CONFIRM: SC license number]]` (omit until confirmed).

---

## 07 — Coordination with hospice, palliative and home health teams

**Section ID:** `coordination`
**Eyebrow:** 07 — Working together

**Headline (H2):**
> We work alongside your team.

**Subline:**
> Home care fills the hours your team isn't there — and stays in its lane.

**Four points (H3 + line):**

**Clear lanes**
> Your team handles the medical side. We handle bathing, meals, the house, company and medication reminders. We never step into nursing.

**The hours in between**
> Home health and hospice visits are usually short. We can be there for the rest of the day, overnight or around the clock.

**One person responsible**
> Our owner meets every family and stays involved. You'll know who to call.

**Families kept in the loop**
> We follow up and check in regularly, and we let the family know when something changes.
> *(hidden until confirmed)* `[[TO CONFIRM: how Dawson shares updates with the care team — e.g. a call to the case manager when needs change]]`

**Hospice line** *(hidden until confirmed)*:
> Already working with a hospice or palliative team? We can provide non-medical comfort and companionship alongside them. `[[TO CONFIRM: hospice/palliative support]]`

---

## 08 — Questions from professionals

**Section ID:** `pro-faq`
**Eyebrow:** 08 — Questions

**Headline (H2):**
> Questions from professionals.

**Accordion** (question = H3 button):

**Do you need a physician's order to start care?** `#pro-order`
> *(hidden until confirmed — whole question)* `[[TO CONFIRM — draft: "No. Our care is non-medical, so families can start it without a doctor's order. If your client also needs skilled care, that comes from home health."]]`

**How is care paid for?** `#pro-payment`
> Most families pay privately. Some use long-term care insurance, VA benefits or Medicaid waiver programs. Medicare generally doesn't cover non-medical home care.
> Link: **How families pay** → `/paying-for-care#ways-to-pay`

**Can care start on the day of discharge?** `#pro-discharge`
> Refer as early as you can and we'll do our best to have care ready for the first day home.
> *(hidden until confirmed)* `[[TO CONFIRM: typical time from referral to first shift]]`

**What information do you need?** `#pro-info`
> Online: your contact details, the client's first name, last initial and town, the services needed and the timing. We'll get the rest by phone. By fax, include your callback number.

**Do you take clients on hospice?** `#pro-hospice` *(hidden until confirmed — whole question)*
> `[[TO CONFIRM — draft: "Yes. We provide non-medical comfort, companionship and personal care alongside the hospice team, and respite for the family."]]`

---

## CTA band

Surface: Dusk band. Standard band (COPY_TRUST §0) with these changes:

**Headline (H2, display-l):**
> Let's get your client home with *support*.

**Buttons:**
- Primary: **Make a referral** → `#refer`
- Ghost (cream): **Call (843) 379-3321** → `tel:+18433793321` · cursor label `Call`
- Small line: Fax (866) 502-3509

**Hours line:**
> **Care:** 24 hours a day, 7 days a week · **Office:** Monday–Friday, 8 AM–5 PM

---
---

# 6. CAREERS — /careers

## Page meta

- **Title:** Caregiver Jobs in Beaufort, SC | Dawson & Dawson Home Care
- **Meta description:** Join an owner-run home care team in Beaufort, SC, caring for Lowcountry families since 2002. See open caregiver roles and apply online.

**Breadcrumb:** Home › About › Careers

---

## 1. Hero

**Eyebrow:** Careers

**Headline (H1):**
> Do work that *matters*, close to home.

**Subline (lead):**
> Dawson has cared for Lowcountry families since 2002. If you're kind, patient and reliable, we'd like to meet you.

**Buttons:**
- Primary: **Apply on Hireology** → `https://careers.hireology.com/dawsondawsonhomecarellc` · small text after the button: "goes to careers.hireology.com, our hiring site"
- Ghost: **See what the work is like ↓** → `#the-work`

**Image:** `careers-hero.jpg` (3:2)
- Alt: A Dawson caregiver walking arm in arm with an older woman on a porch.
- Placeholder label: "Caregiver at work · 3:2"

---

## 01 — Why work at Dawson

**Section ID:** `why-dawson`
**Eyebrow:** 01 — Why Dawson

**Headline (H2):**
> Why work at Dawson.

**Four cards** (icon `aria-hidden` · H3 · line):

**You'll know who you work for**
> Dawson is owner-run. The owner meets every family we care for, so you're never just a name on a schedule.

**Local and steady**
> We've been part of Beaufort since 2002. Our office is on Robert Smalls Parkway.

**Work you can be proud of**
> You help people stay in the homes they love — with dignity, and on their terms.

**Shifts at every hour**
> Care runs 24 hours a day, 7 days a week, so there are day, evening, overnight and weekend shifts.
> *(hidden until confirmed)* `[[TO CONFIRM: flexible scheduling — e.g. "Tell us the hours that work for you."]]`

**Pending row** *(hidden until confirmed — each line renders only when real)*:
- `[[TO CONFIRM: pay range or "competitive pay" — only if the client approves publishing it]]`
- `[[TO CONFIRM: benefits — list only what's real]]`
- `[[TO CONFIRM: training or orientation provided]]`

---

## 02 — The work

**Section ID:** `the-work`
**Eyebrow:** 02 — The work

**Headline (H2):**
> What a caregiver does.

**Subline:**
> All our care is non-medical. Every client has a plan our owner builds with the family.

**Five lines (icon + H3 + line) — the same five services:**
- **Personal care** — Helping with bathing, dressing and moving safely.
- **Home help** — Cooking, laundry, light housekeeping, errands and medication reminders.
- **Companionship** — Conversation, games, walks and outings.
- **Respite** — Stepping in so a family caregiver can rest.
- **Overnight and 24-hour care** — Being there through the night, in shifts.

**You might be a good fit if… (H3)** — list:
- You're patient, and you like helping people with everyday things.
- You show up when you say you will.
- You respect people's homes, privacy and routines.
- You'd treat a client the way you'd want your own family treated.

---

## 03 — Roles

**Section ID:** `roles`
**Eyebrow:** 03 — Roles

**Headline (H2):**
> Roles we hire for.

**Role cards** (H3 + line). `[[TO CONFIRM: current role types — check the Hireology listings at the reveal]]` *(cards render as placeholders until confirmed)*

**Caregiver**
> Non-medical care at home: personal care, home help and companionship. `[[TO CONFIRM: requirements — e.g. experience, driver's license, reliable car]]`

**Certified Nursing Assistant (CNA)**
> Our team includes CNAs. `[[TO CONFIRM: is this a separate role at Dawson? Requirements: active SC CNA certification?]]` In every role, our care is non-medical.

**Line under the cards:**
> Open positions are listed on Hireology, our hiring site. If you don't see a role that fits, you can still apply.
`[[TO CONFIRM: does Hireology accept general applications?]]` *(hide the second sentence until confirmed)*

---

## 04 — Caregiver quotes

**Section ID:** `team`
**Eyebrow:** 04 — Our team

**Headline (H2):**
> Hear it from our caregivers.

**Grid:** caregiver spotlight cards, **grid variant** (COPY_TRUST "Caregiver spotlight cards" §1), quote always visible. Same data (`content/caregivers.ts`).
**Launch rule:** if fewer than 3 real cards (`placeholder: false` + `consentOnFile: true`), hide this section.

---

## 05 — Apply on Hireology

**Section ID:** `apply`
**Eyebrow:** 05 — Apply

**Headline (H2):**
> Ready to apply?

**Steps (ordered list):**
1. **Apply online.** It takes place on Hireology, our hiring site.
2. **We review your application.** *(hidden until confirmed)* `[[TO CONFIRM: how and when applicants hear back]]`
3. **We meet.** *(hidden until confirmed)* `[[TO CONFIRM: interview and hiring steps — e.g. interview, background check, orientation. List only what's real.]]`

**Button:** Primary — **Apply on Hireology** → `https://careers.hireology.com/dawsondawsonhomecarellc` (same tab)
- Small text after: goes to careers.hireology.com, our hiring site

**Questions first? (small):**
> Call (843) 379-3321, Monday–Friday, 8 AM–5 PM.

**Equal opportunity line (small)** *(hidden until confirmed)*:
> `[[TO CONFIRM: equal opportunity employer statement — use the client's exact wording]]`

---

## 06 — Careers FAQ

**Section ID:** `careers-faq`
**Eyebrow:** 06 — Questions

**Headline (H2):**
> Questions about working here.

**Do I need to be a CNA?** `#job-cna` *(hidden until confirmed — whole question)*
> `[[TO CONFIRM: is CNA certification required for any role?]]`

**What shifts are there?** `#job-shifts`
> Care runs 24 hours a day, 7 days a week, so shifts can be days, evenings, overnights and weekends.
> *(hidden until confirmed)* `[[TO CONFIRM: how shifts are scheduled and how much choice caregivers have]]`

**Do I need a car?** `#job-car` *(hidden until confirmed — whole question)*
> `[[TO CONFIRM: car and license requirements; mileage policy]]`

**Where do I apply?** `#job-apply`
> Online, on Hireology, our hiring site. It's the fastest way to reach us.
> Link: **Apply on Hireology** → `https://careers.hireology.com/dawsondawsonhomecarellc`

---

## Family redirect (small band above the CTA)

> Looking for care for someone you love, not a job? **Get a Free Care Assessment** → `/free-assessment` (after hours: **Request a Callback**)

## CTA band

Surface: Dusk.

**Headline (H2, display-l):**
> Join a team that cares like *family*.

**Subline:**
> Owner-run in Beaufort since 2002.

**Buttons:**
- Primary: **Apply on Hireology** → `https://careers.hireology.com/dawsondawsonhomecarellc` · small: goes to careers.hireology.com
- Ghost (cream): **Call (843) 379-3321** → `tel:+18433793321` · cursor label `Call`

**Hours line (always both, always labelled):**
> **Care:** 24 hours a day, 7 days a week · **Office:** Monday–Friday, 8 AM–5 PM

---
---

# 7. CONTACT — /contact

## Page meta

- **Title:** Contact Dawson & Dawson Home Care | Beaufort, SC
- **Meta description:** Call (843) 379-3321, text (866) 632-9766 or visit us at 69 Robert Smalls Parkway, Beaufort, SC. Care 24/7. Office Monday–Friday, 8 AM–5 PM.

**Breadcrumb:** Home › Contact

---

## 1. Hero

**Eyebrow:** Contact us

**Headline (H1):**
> We're here when you're *ready*.

**Subline (lead):**
> Call, text, email or stop by. However you reach us, you'll talk to a local team in Beaufort.

**Office status:** expanded chip (§1) + **Care:** 24 hours a day, 7 days a week

---

## 01 — Contact cards

**Section ID:** `ways-to-reach-us`
**Eyebrow:** 01 — Ways to reach us

**Headline (H2):**
> Ways to reach us.

**Five cards** (icon + H3 + value + line; the whole card is the 48px+ target; cursor label as noted):

**Call**
> **(843) 379-3321** → `tel:+18433793321` · cursor label `Call`
> Our main office line. Monday–Friday, 8 AM–5 PM.

**Text**
> **(866) 632-9766** → `sms:+18666329766`
> Toll-free. You can call this number too.
> Small: By texting this number, you agree to get text replies from us. Msg & data rates may apply. Reply STOP to opt out. `[[TO CONFIRM: final wording from COPY_LEGAL.md]]`

**Email**
> **info@dawsonhomecare.com** → `mailto:info@dawsonhomecare.com`
> We read email during office hours. Please don't email medical details.

**Fax**
> **(866) 502-3509**
> For healthcare referrals and paperwork. **Referring a client? Use our referral form** → `/for-professionals#refer`

**Visit**
> **69 Robert Smalls Parkway, Suite 3F, Beaufort, SC 29906**
> Call ahead so the right person is there to meet you.
> Link: **Get directions** → `http://goo.gl/maps/SVvYGS3TipaMpbgQ9` · small: "goes to Google Maps"

---

## 02 — Map with directions

**Section ID:** `map`
**Eyebrow:** 02 — Find us

**Headline (H2):**
> Find our office.

**Map:** the site's SVG Lowcountry map (07 §5), cropped to Beaufort, office pin pulsing (leaf-500 ripple; none in reduced motion). No third-party map embed, no API key.
- Accessible name: Map showing our office at 69 Robert Smalls Parkway in Beaufort.
- Office pin label: **Our office** · 69 Robert Smalls Pkwy, Beaufort
- Under the map: **Get directions** → Google Maps link (as above) · small: "goes to Google Maps"
- Small: Map is approximate.

**Parking and access** *(hidden until confirmed)*:
> `[[TO CONFIRM: parking, which entrance, Suite 3F floor, step-free access]]`

---

## 03 — Office hours + Care 24/7

**Section ID:** `hours`
**Eyebrow:** 03 — Hours

**Headline (H2):**
> Two kinds of hours.

**Two side-by-side cards (H3):**

**Care**
> **24 hours a day, 7 days a week**
> Our caregivers are there whenever your plan needs them — nights, weekends and holidays.

**Office**
> **Monday–Friday, 8 AM–5 PM (Eastern)**
> When we answer calls, plan care and set up free visits.

**Line under the cards:**
> Calling after hours? Request a callback and we'll reach you first thing {nextOpen}{ET}.
> *(hidden until confirmed)* `Already a client? Reach us after hours at [[TO CONFIRM: after-hours line for existing clients]].`

**Safety line (small):**
> If someone is hurt or in danger, call 911.

---

## 04 — Contact form

**Section ID:** `message`
**Eyebrow:** 04 — Send a message

**Headline (H2):**
> Send us a message.

**Subline:**
> For a short question. Looking for care? The **free assessment form** → `/free-assessment` is the quickest way to start.

**Fields:**

| Field | Label | Type / autocomplete | Notes |
|---|---|---|---|
| `topic` | **What's this about? (required)** | `<select>` | options below |
| `first_name` | **Your first name (required)** | text · `given-name` | — |
| `last_name` | **Your last name** | text · `family-name` | — |
| `phone` | **Phone** | `tel` · `tel-national` | Helper: A phone number or an email is required. |
| `email` | **Email** | `email` · `email` | — |
| `preferred_contact` | **Best way to reach you (required)** | radio | Phone call · Text message · Email |
| `message` | **Your message (required)** | textarea, 5 rows, max 1,000 | Helper: Please don't include medical details. |

**`topic` options** (first option: "Choose one"):
- I'm looking for care for someone
- I'm looking for care for myself
- I have a question
- I'm a current client or family member
- I'm a healthcare professional
- I'm looking for a job

**Topic hints** (polite, appear under the select):
- Looking for care (either): **The quickest way to start is our free assessment form.** → `/free-assessment` — or send this message and we'll call you.
- Healthcare professional: **Referring a client? Our referral form takes about 2 minutes.** → `/for-professionals#refer`
- Job: **You can apply on Hireology, our hiring site.** → `https://careers.hireology.com/dawsondawsonhomecarellc` — or ask your question here.

**SMS consents:** the same two checkboxes as the assessment form (§3 Step 5), unchecked and optional, plus the same text-preference reminder.

**Submit:** **Send message** · while sending: **Sending…**

**After-hours line** (above the button when closed):
> Our office is closed right now. We'll reply after we open {nextOpen}{ET}.

Success → `/thank-you?form=contact`. `form_type=contact`; `topic` sent as a GHL field.

---

## 05 — Other ways we can help

**Section ID:** `more`

Three text links (H2 hidden visually: "More ways we can help"):
- **Referring a client?** Our referral form takes about 2 minutes → `/for-professionals#refer`
- **Looking for a caregiver job?** See careers → `/careers`
- **Have a question first?** Read questions families ask → `/faq`
- Small: **Follow us on Instagram** → `https://www.instagram.com/dawsonhomecare/` · "goes to Instagram"

---

## CTA band

Standard CTA band (COPY_TRUST §0) with this headline:

**Headline (H2, display-l):**
> Let's talk about your *family*.

---
---

# 8. FORM VALIDATION & ERROR MESSAGES (every form)

Pattern (BRAND_FINAL §1.6): 2px alert-700 border · `CircleAlert` icon (alert-700, 20px, `aria-hidden`) · message in alert-700, 16px, weight 500 · `aria-invalid="true"` · `aria-describedby` → message. Errors show on blur or submit, never mid-typing. A fixed error clears on the next valid input.

Messages say **what's wrong and how to fix it**. No "invalid", no "error", no blame.

## 8.1 Error summary (top of the step or form, on submit with errors)

plum-100 panel, 2px alert-700 left border, heading in plum-800, links in alert-700 underlined. Focus moves to the heading.

- 1 error: **Please check 1 answer before you continue.**
- 2+ errors: **Please check {n} answers before you continue.**
- Final step of a form: replace "continue" with "send": **Please check {n} answers before you send.**
- Each list item is a link to the field, with the field's message as its text.

## 8.2 Field messages

**Names**
| Rule | Message |
|---|---|
| Your first name empty | Please enter your first name. |
| Referrer last name empty | Please enter your last name. |
| Client's first name empty | Please enter the client's first name. |
| Too long (name fields, max 40) | Please keep this to 40 characters or fewer. |
| Contains a web link | Please enter a name, not a web address. |
| Last initial empty | Please enter the first letter of the client's last name. |
| Last initial not one letter | Please enter just one letter — for example, R. |

**Phone**
| Rule | Message |
|---|---|
| Empty (required) | Please enter your phone number so we can call you back. |
| Too few / too many digits, or letters | Please enter a 10-digit phone number, like (843) 555-0123. |
| Non-US country code | Please enter a US phone number with an area code. If you're outside the US, email us at info@dawsonhomecare.com. |

**Email**
| Rule | Message |
|---|---|
| Empty when required (preferred contact = email, referral, quiz plan) | Please enter your email address. |
| Not an email | Please enter an email address like name@example.com. |
| Common typo (`gmial.com`, `yaho.com`, `.con`) — soft, not blocking | Did you mean **{suggestion}**? **Use this** (button) |

**Phone or email (contact form)**
| Rule | Message (shown on both fields) |
|---|---|
| Both empty | Please enter a phone number or an email address so we can reply. |

**Choices**
| Field | Message |
|---|---|
| Who is the care for? | Please choose who the care is for. |
| Town | Please choose a town — or "Not sure." |
| Town "Somewhere else" (referral only — required there) | Please type the client's town. |
| Services (assessment) | Please choose at least one — or "Not sure yet." |
| Services (referral) | Please choose at least one service — or "Not sure — let's discuss." |
| When to start | Please choose when you'd like care to start. |
| Hours | Please choose how much help you think is needed — or "Not sure yet." |
| Best way to reach you | Please choose how you'd like us to reach you. |
| Your role (referral) | Please choose your role. |
| Your role — Other (text) | Please tell us your role. |
| Organization | Please enter your organization's name. |
| What's this about? (contact) | Please choose what your message is about. |
| Message (contact) empty | Please write a short message. |
| Permission checkbox (referral) | Please confirm you have permission to share this information. |
| Quiz plan consent | Please tick the box so we can email your plan. |

**Dates (referral)**
| Rule | Message |
|---|---|
| Empty when "On a specific date" | Please enter the start or discharge date. |
| Not a date | Please enter a date like 10/24/2026. |
| In the past | Please choose today or a later date. |
| More than 12 months away | Please choose a date within the next 12 months. |

**Long text**
| Rule | Message |
|---|---|
| Over limit | Please keep this to {max} characters or fewer. You can tell us the rest on the phone. |
| Looks like an SSN (`###-##-####` or 9 digits in a row) — blocking | Please remove the ID number. We never need it online. |
| Looks like a Medicare number (11 characters, MBI pattern) — blocking | Please remove the Medicare number. We never need it online. |
| Looks like a date of birth — soft, not blocking (plum-100 note, not alert) | It looks like this might include a date of birth. You don't need to share it here — we'll ask for anything we need by phone. |

**Quiz**
| Question | Message |
|---|---|
| Q2 nothing chosen + Continue | Please choose at least one — or choose "Something else." |
| Q5 nothing chosen + See my suggestion | Please choose a town — or choose "Not sure." |

## 8.3 Send / system messages

Shown in a panel above the submit button (plum-100, 2px alert-700 left border for failures). Live region `assertive` for failures, `polite` for the rest. Answers are never cleared on a failure.

| Situation | Message |
|---|---|
| Network / server failure | **We couldn't send this.** Your answers are still here. Please try again, or call (843) 379-3321. |
| Failure, office closed | **We couldn't send this.** Your answers are still here. Please try again in a moment, or text us at (866) 632-9766. |
| Offline (detected before send) | **You seem to be offline.** Your answers are saved in this tab — try again when you're connected. |
| Turnstile failed | **We couldn't confirm this request.** Please try again. If it keeps happening, call (843) 379-3321. |
| Duplicate (same phone, same form, within 10 minutes) | **We already have your request.** We'll be in touch soon. Need to add something? Call (843) 379-3321. |
| Server-side validation failed | Shows the error summary (§8.1) with the server's field messages, same wording as above. |
| Honeypot filled | No message. Normal success screen. |
| sessionStorage unavailable | No message. The form works; it just doesn't save progress. |
| Quiz plan email failed | **We couldn't send your plan.** Please check your email address and try again. |

## 8.4 zod messages map

Implement once in `lib/formMessages.ts` and import into every schema, so wording stays identical across forms. Keys: `firstNameRequired`, `lastNameRequired`, `clientFirstNameRequired`, `nameTooLong`, `nameIsUrl`, `lastInitialRequired`, `lastInitialOneLetter`, `phoneRequired`, `phoneInvalid`, `phoneNonUs`, `emailRequired`, `emailInvalid`, `phoneOrEmail`, `careForRequired`, `townRequired`, `townOtherRequired`, `servicesRequired`, `servicesRequiredReferral`, `startRequired`, `hoursRequired`, `contactRequired`, `roleRequired`, `roleOtherRequired`, `organizationRequired`, `topicRequired`, `messageRequired`, `permissionRequired`, `planConsentRequired`, `dateRequired`, `dateInvalid`, `datePast`, `dateTooFar`, `tooLong`, `ssnFound`, `mbiFound`. Strings exactly as §8.2.

---
---

# 9. CARE QUIZ — /find-care

All quiz copy lives in `content/quiz.ts` (end of this doc). The prose below is generated from it — **edit the data, not the page.**

## Page meta

- **Title:** Find the Right Home Care: 1-Minute Quiz | Dawson & Dawson
- **Meta description:** Not sure what kind of home care you need? Answer five quick questions and get a suggested plan for your family. No email needed.

**Breadcrumb:** Home › Find the Right Care

---

## 1. Hero

**Eyebrow:** Find the right care

**Headline (H1):**
> Find the right care.

**Subline (lead):**
> Most families aren't sure what they need. Answer five quick questions and we'll suggest a plan.

**Microcopy:**
> About 1 minute · No email needed

The first question renders directly under the hero — no "Start" button.

**No-JS fallback:**
> The quiz needs JavaScript to run. You can still get help: call (843) 379-3321, or see our care services.
> Links: **See our care services** → `/care` · **Get a Free Care Assessment** → `/free-assessment`

**Resume banner** (unfinished quiz in sessionStorage):
> Welcome back. We kept your answers.
> Buttons: **Pick up where I left off** · **Start over**

---

## 2. Questions

**Card frame (every question):**
- Progress (visual: plum-800 heartbeat line filling; text always visible): **Question {n} of 5**
- Question = H2. Answers = big cards, line illustration `aria-hidden`, answer text = accessible name.
- Selected = fill + 2px plum-800 border + check icon.
- **Single-select** (Q1, Q3, Q4): choosing advances after 300ms; live region "{answer} selected. Next question." Focus moves to the next H2. Reduced motion: no slide, instant swap.
- **Multi-select** (Q2) and **select** (Q5): **Continue** / **See my suggestion** button, `aria-disabled` until valid (BRAND_FINAL §1.4 #20); pressing it while disabled shows the error.
- **Back** on Q2–Q5 keeps every answer.
- Arriving from Home ch. 4 → opens at Q2 with Q1 saved. Arriving from a town page (`?town={slug}`) → Q5 preselected, still asked.

### Q1 — Who is the care for?
Helper: Tap an answer to keep going.
- My parent
- My spouse or partner
- Myself
- Someone else

### Q2 — What's happening right now?
Helper: Choose all that apply.
- Bathing or dressing is getting hard
- The house is getting hard to keep up
- Feeling lonely or cut off
- Just home from the hospital or rehab · *Or coming home soon*
- Not safe alone at night
- A family caregiver needs a break
- On hospice or palliative care
- Something else · *Or I'm not sure*

Button: **Continue** · Error: Please choose at least one — or choose "Something else."

### Q3 — How much help do you think is needed?
Helper: A rough idea is fine. You can change it later.
- A few hours a week · *Like 3 hours, twice a week*
- A few hours most days · *Like 4 hours, 5 days a week*
- Full days · *Like 8 hours, 5 days a week*
- Around the clock · *Day and night, 7 days a week*
- Not sure yet · *We'll work it out together*

### Q4 — When would you like care to start?
Helper: Tap an answer to keep going.
- As soon as possible
- Within 2 weeks
- Within a month
- Just exploring

### Q5 — Where do they live?
*(Myself: "Where do you live?")*
Helper: So we can check we reach their town. *(Myself: "your town")*
- Label: **Town** · first option: Choose a town
- Groups: **Near our office** · **Extended service area** (from `areas.ts`, A–Z)
- Then: **Somewhere else** · **Not sure**
- "Somewhere else" reveals: **Which town? (optional)** — helper: Type the town name. We'll check when we talk.

Button: **See my suggestion** · Error: Please choose a town — or choose "Not sure."

---

## 3. Scoring (from 07 §1)

| Answer | Points |
|---|---|
| Bathing or dressing | Personal Care +3 |
| The house | Home Help +3 |
| Lonely | Companionship +3 |
| Hospital or rehab | Personal Care +3, Home Help +2 *(transition support)* |
| Not safe at night | 24-Hour & Overnight +3 |
| Caregiver break | Respite +3 |
| Hospice or palliative | Hospice support +4 *(only when confirmed)*, Companionship +3, Respite +1 |
| Something else | — |
| Q3 Around the clock | 24-Hour & Overnight +3 |

- **Primary** = highest score. Ties go to: 24-Hour → Hospice support → Respite → Personal Care → Home Help → Companionship (safety first).
- **Also helpful** = next highest scorers, max 2. If none scored, the primary's first "pairs well with" service fills one slot (COPY_SERVICES lines).
- **Nothing scored** → the **"Let's figure it out together"** result.
- Hospice support is `confirmed: false`: in production it is never recommended; Companionship takes its place and the hospice note shows.

---

## 4. Result screen

**Order:** headline + intro → primary card → also helpful → notes → hours → mini estimator → town line → urgency block → next-step CTA → email plan → change/start over. Focus moves to the result H2. The heartbeat progress line completes and turns into a check (reduced motion: static check).

### Frame strings

**Headline (H2):** Here's what we'd suggest for {lovedOne}.
- {lovedOne} = your parent · your spouse or partner · you · your loved one

**Intro:** Based on your answers. It's a starting point, not a package — every plan is built around {lovedOne} at a free visit.

**Primary card:** label **Our suggestion** · H3 = service name · promise · intro line · 3 bullets · **Why we suggest this** + reason lines · link **See {Service}**

**Also helpful (H3 heading)** — compact cards: name · one reason line · link

**Non-medical line (small, under the cards):** All our care is non-medical. We work alongside home health and hospice teams.

**Hours (H3: "Hours to start"):** {hours text} · small: These are example schedules. We'll set the real one together.

**What it might cost (H3):** compact estimator (COPY_HOME ch. 10 strings, Illustrative badge while `rateConfirmed: false`), prefilled from the Q3 preset. Hidden for "Not sure yet". Link: **Adjust it in the full estimator** → `estimatorHref()`

**Next step (H3: "Next step: a free visit at home"):**
> Our owner comes to {their} home, meets the family and builds the plan with you. Free, with no obligation.
- Primary: **Get a Free Care Assessment** → `/free-assessment?from=quiz` (after hours: **Request a Callback**) · helper: We've filled in your answers, so it only takes a minute.
- Ghost: **Call (843) 379-3321** → `tel:+18433793321` · cursor label `Call`

**Footer links:** **Change my answers** (back to Q1, answers kept) · **Start over** (clears; live region "Quiz restarted. Question 1 of 5.")

### Templates per recommendation

**Personal Care** — promise: Help with bathing, dressing and getting around — with dignity.
- Intro: Gentle, hands-on help with the daily things that have gotten harder — so {they} can stay home and stay {themselves}.
- Bullets: Bathing and showering, safely · Dressing and grooming · Using the bathroom and moving around the house
- Pairs: Home Help — "Meals, laundry and medication reminders on the same visit." · 24-Hour — "When help is needed at night too."

**Home Help** — promise: Meals, laundry, errands and medication reminders, so the house keeps running.
- Intro: Help with the everyday things that keep a home safe, comfortable and {their} own.
- Bullets: Meals planned and cooked · Laundry and light housekeeping · Groceries, errands and medication reminders
- Pairs: Companionship — "Someone to talk to while the chores get done." · Personal Care — "Help with bathing and dressing on the same visit."

**Companionship** — promise: Company, conversation and getting out of the house.
- Intro: Regular, friendly visits that give {them} good company and something to look forward to.
- Bullets: Conversation and good company · Games, puzzles, music and hobbies · Daily walks and trips to the park
- Pairs: Home Help — "Lunch cooked, laundry done and a good chat, all in one visit." · Respite — "Company at home while the family caregiver takes a well-earned break."

**Respite Care** — promise: A break for you. Your loved one keeps their routine.
- Intro: We step in for a few hours, a weekend or longer, so the family caregiver can rest — and the routine at home stays the same.
- Bullets: A few hours, a weekend or longer · Regular breaks or one-time cover · Any of our care while the family caregiver is away
- Pairs: Personal Care — "Hands-on help with bathing and dressing while the family caregiver is away." · 24-Hour — "For trips and weekends when someone needs to be there at night."

**24-Hour & Overnight Care** — promise: Someone there, day and night.
- Intro: A caregiver through the night, or around the clock in shifts — so {theyre} never alone when it matters most.
- Bullets: Overnight care, bedtime to morning · Safe nighttime bathroom trips · Shifts covered 7 days a week
- Pairs: Personal Care — "Help with bathing and dressing, morning and night." · Respite — "Overnight cover so the family caregiver can sleep or travel."

**Support alongside your hospice team** *(confirmed: false — placeholder mode only)*
- Promise: `[[TO CONFIRM: hospice/palliative support]]` Non-medical comfort and companionship alongside your hospice or palliative team.
- Intro: `[[TO CONFIRM — draft: "Non-medical comfort and companionship alongside {their} hospice or palliative team, for the hours in between their visits."]]`
- Bullets: `[[TO CONFIRM — draft]]` Sitting with {them} so the family can rest · Help with meals and personal care · Company in the hours between hospice visits
- Link: **Read about hospice and home care** → `/faq#hm-hospice`

**"Let's figure it out together"** (nothing scored)
- H2: Let's figure it out together.
- Intro: Your answers don't point to one kind of help — and that's completely normal. Most families combine two or three. At a free visit, our owner will help you work out exactly what fits.
- H3: **The ways we help** — the five services as compact cards (name + promise + link), in site order.
- Then hours, urgency, town, CTA and email plan as normal.

### Reason lines ("Why we suggest this" / also-helpful line)

| Answer | Line |
|---|---|
| Bathing or dressing | You said bathing or dressing is getting hard. |
| The house | You said the house is getting hard to keep up. |
| Lonely | You said {theyre} feeling lonely or cut off. |
| Hospital or rehab | You said {theyre} just home from the hospital or rehab, or coming home soon. |
| Not safe at night | You said {theyre} not safe alone at night. |
| Caregiver break | You said a family caregiver needs a break. |
| Hospice or palliative | You said {theyre} on hospice or palliative care. |
| Around the clock (Q3) | You said {they} may need help around the clock. |

**Card-specific lines** (when one answer feeds two cards, the second card doesn't repeat the first's reason):
- Hospital → Home Help: Coming home is easier when meals, laundry and errands are taken care of.
- Hospice → Companionship: Company and comfort — for {them} and for the family.
- Hospice → Respite: A break for the family during a hard time.

### Hours lines (Q3)

| Answer | Line |
|---|---|
| A few hours a week | About 6 hours a week to start — like 3 hours, twice a week. |
| A few hours most days | About 20 hours a week to start — like 4 hours, 5 days a week. |
| Full days | About 40 hours a week to start — like 8 hours, 5 days a week. |
| Around the clock | Care around the clock — 168 hours a week, covered in shifts so a rested caregiver is always there. |
| Not sure yet | Not sure about hours yet? That's normal. We'll work it out together at your free visit. |

### Situational notes

| When | Note |
|---|---|
| Not safe at night + "a few hours" (week or most days) | Nights usually need more than a few hours of help. We'll work out a schedule that keeps {them} safe after dark. |
| Hospital or rehab | Still in the hospital or rehab? Call us before discharge if you can, so we can plan the first days home. |
| Hospice or palliative | All our care is non-medical. We don't replace the hospice team. Tell us who's on it, and we'll talk honestly about whether and how we can help. |
| "Something else" + other answers | You also said something else is going on. Tell us about it when we talk — we'll build it into the plan. |

### Town line (Q5)

| Answer | Line |
|---|---|
| Near-office town | We care for families {in} {town}. + link **See care {in} {town}** (towns with pages) |
| Extended-area town | {town} is in our extended service area. We'll check scheduling for your hours when we talk. |
| Somewhere else, named | We'll check whether we can reach {townOther} when we talk. |
| Somewhere else, blank | We'll check whether we can reach {their} town when we talk. |
| Not sure | (no line) |

### Urgency block (Q4)

| Answer | H3 | Text |
|---|---|---|
| As soon as possible | Need care soon? | Open: The quickest way to start is a phone call. Our office is open now: (843) 379-3321. · Closed: Our office is closed right now. Request a callback and we'll reach you first thing {nextOpen}{ET}. · Always: If someone is hurt or in danger, call 911. |
| Within 2 weeks | Starting in the next couple of weeks? | The free visit is the first step. Book it now, and we'll plan the rest together. |
| Within a month | Planning ahead? | Good thinking. Book your free visit now, and start care when you're ready. |
| Just exploring | Just looking for now? | That's fine — no pressure. Email yourself this plan, and come back when you're ready. |

For "Just exploring", the email-plan block moves above the CTA.

### Email me this plan

**H3:** Want a copy?
**Text:** We'll email this plan to you — handy for sharing with family.
- **Your email (required)** — `email` · `autocomplete="email"`
- **Your first name** — `given-name`
- ☐ (required) Yes, email me this plan. Dawson and Dawson Home Care LLC may follow up by email about it. I can unsubscribe at any time.
- Button: **Email me this plan** · sending: **Sending…**
- Success (polite): Sent. Check your inbox — and your spam folder, just in case.
- Small: We'll only use your email to send this plan and follow up about it.

Sends `form_type=quiz_plan`, `email`, `first_name`, all `quiz_*` fields, email consent text + timestamp. GHL tag `quiz-completed` on every quiz lead.

**Plan email (GHL workflow template):**
- **Subject:** Your care plan suggestion from Dawson and Dawson Home Care
- **Preheader:** A starting point for {lovedOne} — and what to do next.
- **Body:**
  > Hi {firstName},
  >
  > Here's the plan you asked for. It's a starting point, not a package.
  >
  > **Our suggestion:** {primary name} — {primary promise}
  > **Also helpful:** {also names}
  > **Hours to start:** {hours line}
  >
  > **Next step:** a free visit at home. Our owner meets {lovedOne}, learns how {they} like to live and builds the plan with you. No obligation.
  >
  > [Get a Free Care Assessment] → `https://dawsonhomecare.com/free-assessment`
  > Or call (843) 379-3321.
  >
  > **Care:** 24 hours a day, 7 days a week · **Office:** Monday–Friday, 8 AM–5 PM
  >
  > Dawson and Dawson Home Care LLC · 69 Robert Smalls Parkway, Suite 3F, Beaufort, SC 29906
  > [Unsubscribe]

### Hand-offs (quiz.ts helpers)

- **To the assessment form:** `toAssessmentPrefill()` → sessionStorage `dawson.assessment.prefill.v1` → `/free-assessment?from=quiz`. Pre-ticks the recommended services (or "Not sure yet"), care-for, start timing, hours, town and the hospital box.
- **To GHL:** `toGhlFields()` → `quiz_for`, `quiz_needs`, `quiz_services`, `quiz_primary`, `quiz_hours`, `quiz_urgency`, `quiz_town`.
- **To the estimator:** `estimatorHref()` → hours/days/overnight only.
- Nothing from Q2 ever goes into a URL.

---
---

# 10. 404 — Not found

## Page meta

- **Title:** Page Not Found | Dawson & Dawson Home Care
- **Robots:** `noindex`. Status 404.

---

**Illustration:** the Dawson House at dusk with the porch light on (line art, static; the light glows softly once on load — none in reduced motion). `aria-hidden="true"` — the words carry the meaning.

**Eyebrow:** 404

**Headline (H1):**
> This page *wandered* off.

**Body:**
> Our website is new, and some pages have moved. Let's get you where you need to go.

**Links (four large buttons, 2×2 on desktop, stacked on mobile):**
- Primary: **Go to the home page** → `/`
- Ghost: **See care services** → `/care`
- Ghost: **Contact us** → `/contact`
- Ghost: **Call (843) 379-3321** → `tel:+18433793321` · cursor label `Call`

**Small line:**
> Looking for something specific? Try **questions families ask** → `/faq` or the **site map** → `/sitemap`.

**Hours (always both):**
> **Care:** 24 hours a day, 7 days a week · **Office:** Monday–Friday, 8 AM–5 PM

---
---

## Placeholder summary (for `npm run prelaunch`)

**Global**
- After-hours line for existing clients (chip, thank-you, contact)
- Voicemail on the main line after hours (assessment panel)
- Holiday list in `site.config.ts` (optional)
- SMS consent wording + version (`sms-v1-2026-10` until COPY_LEGAL.md)
- Toll-free texting disclosure on /contact (COPY_LEGAL.md)

**Free assessment / thank-you**
- Response time during office hours
- Which number the office calls back from ("Save our number" card, hidden)
- Owner portrait 1:1 crop for the reassurance panel
- Hospice support service option (hidden)

**For professionals**
- Referral response time · time from referral to first shift
- Which referral sources are real · hospice chip, card, line and FAQ (hidden)
- Transport (do caregivers drive clients?) · filling pill organizers
- How Dawson updates referral sources and care teams
- Physician's order FAQ (hidden)
- Referral sheet PDF · license number on the sheet

**Careers**
- Flexible scheduling · pay · benefits · training
- Role types and requirements (Caregiver, CNA) · general applications on Hireology
- Hiring steps · how applicants hear back · EEO statement
- CNA required? · car requirement (both hidden FAQs) · shift scheduling detail
- `careers-hero.jpg` · caregiver cards (hidden until 3 real)

**Contact**
- Parking and access

**Quiz**
- Hospice support recommendation (`confirmed: false` in `quiz.ts`)
- Quiz illustrations (`/public/illustrations/quiz/*.svg`, 25 files)

---
---

# DATA FILE — `content/quiz.ts`

Imports `areas.ts` (COPY_AREAS) and `blocks.ts` (COPY_COST_FAQ). Checked with `tsc --strict --noUncheckedIndexedAccess` and run against test answer sets (parent + bathing → Personal Care + Home Help; caregiver break + bathing → Respite + Personal Care; night + few hours → 24-Hour + night note; hospice in production → Companionship + Respite + non-medical note; nothing scored → "Let's figure it out together").

```ts
// content/quiz.ts — Care Quiz "Find the right care" (07 §1): /find-care + Home ch. 4 teaser.
// Copy is final (COPY_CONVERSION.md §9). Edit copy here, not in components.
//
// RULES
// - Pure data + pure helpers. No DOM, no storage, no fetch. Components own sessionStorage
//   (QUIZ_STORAGE_KEY), the GHL post and the office-status tokens.
// - Templates use {tokens}. fill() resolves subject tokens ({lovedOne}, {they}, {their}…) and any
//   vars you pass. Unknown tokens are left as-is for the component ({nextOpen}, {town}, {in}).
// - Values (ids) match the assessment form, the estimator presets (COPY_COST_FAQ) and GHL fields
//   (08 §2). Never rename an id without updating all three.
// - Hospice support is confirmed:false. Until confirmed it is never recommended in production
//   (visible only when NEXT_PUBLIC_SHOW_PLACEHOLDERS=true). The Q2 hospice option itself always
//   shows — it describes the family's situation, not a Dawson claim.
// - Nothing sensitive ever goes in a URL (09 §2). Answers travel to /free-assessment via
//   sessionStorage only; the estimator link carries hours/days/overnight only.

import { areas, getArea, type Area } from "./areas";
import { SHOW_PLACEHOLDERS } from "./blocks";

// ── IDs ──────────────────────────────────────────────────────────────────────

export type CareFor = "parent" | "spouse" | "self" | "someone-else";

export type NeedId =
  | "bathing-dressing"
  | "house"
  | "lonely"
  | "hospital"
  | "night"
  | "caregiver-break"
  | "hospice"
  | "something-else";

/** Same ids as the estimator presets (COPY_COST_FAQ `estimator_preset`) + "not-sure". */
export type HoursId =
  | "few-hours-week"
  | "few-hours-most-days"
  | "full-days"
  | "around-the-clock"
  | "not-sure";

export type UrgencyId = "asap" | "two-weeks" | "month" | "exploring";

export type ServiceSlug =
  | "personal-care"
  | "home-help"
  | "companionship"
  | "respite-care"
  | "24-hour-care";

export type RecommendationId = ServiceSlug | "hospice-support";

/** Q5 value: an areas.ts slug, "other" or "not-sure". */
export type TownValue = string;

export interface QuizAnswers {
  careFor: CareFor | null;
  needs: NeedId[];
  hours: HoursId | null;
  urgency: UrgencyId | null;
  town: TownValue | null;
  /** Free text when town === "other". Optional, max 60 chars. */
  townOther: string;
}

export const emptyAnswers: QuizAnswers = {
  careFor: null,
  needs: [],
  hours: null,
  urgency: null,
  town: null,
  townOther: "",
};

export const QUIZ_STORAGE_KEY = "dawson.quiz.v1";
export const TOWN_OTHER_MAX = 60;

// ── Subject (pronouns from Q1) ───────────────────────────────────────────────

export interface Subject {
  lovedOne: string;
  LovedOne: string;
  they: string;
  They: string;
  their: string;
  Their: string;
  theyre: string;
  Theyre: string;
  them: string;
  themselves: string;
}

const third = (lovedOne: string): Subject => ({
  lovedOne,
  LovedOne: lovedOne.charAt(0).toUpperCase() + lovedOne.slice(1),
  they: "they",
  They: "They",
  their: "their",
  Their: "Their",
  theyre: "they're",
  Theyre: "They're",
  them: "them",
  themselves: "themselves",
});

export const subjects: Record<CareFor, Subject> = {
  parent: third("your parent"),
  spouse: third("your spouse or partner"),
  self: {
    lovedOne: "you",
    LovedOne: "You",
    they: "you",
    They: "You",
    their: "your",
    Their: "Your",
    theyre: "you're",
    Theyre: "You're",
    them: "you",
    themselves: "yourself",
  },
  "someone-else": third("your loved one"),
};

/** Used before Q1 is answered (e.g. a deep link straight into Q2). */
export const defaultSubject: Subject = third("your loved one");

export const subjectFor = (careFor: CareFor | null): Subject =>
  careFor ? subjects[careFor] : defaultSubject;

/** Resolve {tokens}. Subject tokens first, then vars. Unknown tokens are left untouched. */
export function fill(template: string, subject: Subject, vars: Record<string, string> = {}): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => {
    if (key in subject) return subject[key as keyof Subject];
    const v = vars[key];
    return v !== undefined ? v : match;
  });
}

// ── Page + shared UI copy ────────────────────────────────────────────────────

export const quizUi = {
  eyebrow: "Find the right care",
  h1: "Find the right care.",
  lead: "Most families aren't sure what they need. Answer five quick questions and we'll suggest a plan.",
  microcopy: "About 1 minute · No email needed",
  progress: "Question {n} of 5",
  /** Shown only when a question has no auto-advance (multi + select). */
  continueLabel: "Continue",
  finalLabel: "See my suggestion",
  backLabel: "Back",
  /** Visually hidden live-region text after a single-select answer. */
  selectedAnnouncement: "{answer} selected. Next question.",
  /** No-JS / script failure fallback. */
  noScript:
    "The quiz needs JavaScript to run. You can still get help: call (843) 379-3321, or see our care services.",
  noScriptLinks: [
    { label: "See our care services", href: "/care" },
    { label: "Get a Free Care Assessment", href: "/free-assessment" },
  ],
  /** Shown when sessionStorage has an unfinished quiz. */
  resume: {
    text: "Welcome back. We kept your answers.",
    continueLabel: "Pick up where I left off",
    restartLabel: "Start over",
  },
  restartAnnouncement: "Quiz restarted. Question 1 of 5.",
} as const;

// ── Questions ────────────────────────────────────────────────────────────────

export interface QuizOption<V extends string> {
  value: V;
  label: string;
  /** Small second line under the label. */
  helper?: string;
  /** Line-illustration file in /public/illustrations/quiz/ — always aria-hidden. */
  illustration: string;
}

interface QuestionBase {
  step: 1 | 2 | 3 | 4 | 5;
  /** Rendered as H2. May contain subject tokens. */
  title: string;
  helper: string;
  /** Error text when Continue is pressed with no valid answer. Single-select auto-advances, so "". */
  error: string;
}

export interface CareForQuestion extends QuestionBase {
  id: "careFor";
  kind: "single";
  options: QuizOption<CareFor>[];
}
export interface NeedsQuestion extends QuestionBase {
  id: "needs";
  kind: "multi";
  options: QuizOption<NeedId>[];
}
export interface HoursQuestion extends QuestionBase {
  id: "hours";
  kind: "single";
  options: QuizOption<HoursId>[];
}
export interface UrgencyQuestion extends QuestionBase {
  id: "urgency";
  kind: "single";
  options: QuizOption<UrgencyId>[];
}
export interface TownQuestion extends QuestionBase {
  id: "town";
  kind: "select";
  /** Visible <label> for the <select>. */
  label: string;
  /** First, empty <option>. */
  emptyOption: string;
  groups: { label: string; options: { value: string; label: string }[] }[];
  extraOptions: { value: "other" | "not-sure"; label: string }[];
  otherLabel: string;
  otherHelper: string;
}

export type QuizQuestion =
  | CareForQuestion
  | NeedsQuestion
  | HoursQuestion
  | UrgencyQuestion
  | TownQuestion;

const byName = (a: Area, b: Area) => a.name.localeCompare(b.name);
const townGroup = (tier: Area["tier"]) =>
  areas
    .filter((a) => a.tier === tier)
    .sort(byName)
    .map((a) => ({ value: a.slug, label: a.name }));

export const questions: QuizQuestion[] = [
  {
    id: "careFor",
    kind: "single",
    step: 1,
    title: "Who is the care for?",
    helper: "Tap an answer to keep going.",
    error: "",
    // Labels match COPY_HOME ch. 4 verbatim (the inline teaser).
    options: [
      { value: "parent", label: "My parent", illustration: "q1-parent.svg" },
      { value: "spouse", label: "My spouse or partner", illustration: "q1-spouse.svg" },
      { value: "self", label: "Myself", illustration: "q1-self.svg" },
      { value: "someone-else", label: "Someone else", illustration: "q1-someone-else.svg" },
    ],
  },
  {
    id: "needs",
    kind: "multi",
    step: 2,
    title: "What's happening right now?",
    helper: "Choose all that apply.",
    error: 'Please choose at least one — or choose "Something else."',
    options: [
      { value: "bathing-dressing", label: "Bathing or dressing is getting hard", illustration: "q2-bathing.svg" },
      { value: "house", label: "The house is getting hard to keep up", illustration: "q2-house.svg" },
      { value: "lonely", label: "Feeling lonely or cut off", illustration: "q2-lonely.svg" },
      {
        value: "hospital",
        label: "Just home from the hospital or rehab",
        helper: "Or coming home soon",
        illustration: "q2-hospital.svg",
      },
      { value: "night", label: "Not safe alone at night", illustration: "q2-night.svg" },
      { value: "caregiver-break", label: "A family caregiver needs a break", illustration: "q2-break.svg" },
      { value: "hospice", label: "On hospice or palliative care", illustration: "q2-hospice.svg" },
      {
        value: "something-else",
        label: "Something else",
        helper: "Or I'm not sure",
        illustration: "q2-something-else.svg",
      },
    ],
  },
  {
    id: "hours",
    kind: "single",
    step: 3,
    title: "How much help do you think is needed?",
    helper: "A rough idea is fine. You can change it later.",
    error: "",
    // First four labels match the estimator quick-start buttons (COPY_COST_FAQ) exactly.
    options: [
      { value: "few-hours-week", label: "A few hours a week", helper: "Like 3 hours, twice a week", illustration: "q3-few-week.svg" },
      { value: "few-hours-most-days", label: "A few hours most days", helper: "Like 4 hours, 5 days a week", illustration: "q3-most-days.svg" },
      { value: "full-days", label: "Full days", helper: "Like 8 hours, 5 days a week", illustration: "q3-full-days.svg" },
      { value: "around-the-clock", label: "Around the clock", helper: "Day and night, 7 days a week", illustration: "q3-around-clock.svg" },
      { value: "not-sure", label: "Not sure yet", helper: "We'll work it out together", illustration: "q3-not-sure.svg" },
    ],
  },
  {
    id: "urgency",
    kind: "single",
    step: 4,
    title: "When would you like care to start?",
    helper: "Tap an answer to keep going.",
    error: "",
    options: [
      { value: "asap", label: "As soon as possible", illustration: "q4-asap.svg" },
      { value: "two-weeks", label: "Within 2 weeks", illustration: "q4-two-weeks.svg" },
      { value: "month", label: "Within a month", illustration: "q4-month.svg" },
      { value: "exploring", label: "Just exploring", illustration: "q4-exploring.svg" },
    ],
  },
  {
    id: "town",
    kind: "select",
    step: 5,
    title: "Where do {they} live?",
    helper: "So we can check we reach {their} town.",
    error: 'Please choose a town — or choose "Not sure."',
    label: "Town",
    emptyOption: "Choose a town",
    groups: [
      { label: "Near our office", options: townGroup("primary") },
      { label: "Extended service area", options: townGroup("extended") },
    ],
    extraOptions: [
      { value: "other", label: "Somewhere else" },
      { value: "not-sure", label: "Not sure" },
    ],
    otherLabel: "Which town? (optional)",
    otherHelper: "Type the town name. We'll check when we talk.",
  },
];

/** Can the person move on from this question? */
export function canContinue(q: QuizQuestion, a: QuizAnswers): boolean {
  switch (q.id) {
    case "careFor":
      return a.careFor !== null;
    case "needs":
      return a.needs.length > 0;
    case "hours":
      return a.hours !== null;
    case "urgency":
      return a.urgency !== null;
    case "town":
      return a.town !== null && a.town !== "";
  }
}

export const isComplete = (a: QuizAnswers): boolean => questions.every((q) => canContinue(q, a));

// ── Hours presets (match COPY_COST_FAQ estimator quick start exactly) ────────

export interface HoursPreset {
  hoursPerVisit: number;
  daysPerWeek: number;
  overnight: boolean;
  weeklyHours: number;
}

export const hoursPresets: Record<Exclude<HoursId, "not-sure">, HoursPreset> = {
  "few-hours-week": { hoursPerVisit: 3, daysPerWeek: 2, overnight: false, weeklyHours: 6 },
  "few-hours-most-days": { hoursPerVisit: 4, daysPerWeek: 5, overnight: false, weeklyHours: 20 },
  "full-days": { hoursPerVisit: 8, daysPerWeek: 5, overnight: false, weeklyHours: 40 },
  "around-the-clock": { hoursPerVisit: 24, daysPerWeek: 7, overnight: true, weeklyHours: 168 },
};

export const hoursCopy: Record<HoursId, { label: string; text: string }> = {
  "few-hours-week": {
    label: "A few hours a week",
    text: "About 6 hours a week to start — like 3 hours, twice a week.",
  },
  "few-hours-most-days": {
    label: "A few hours most days",
    text: "About 20 hours a week to start — like 4 hours, 5 days a week.",
  },
  "full-days": {
    label: "Full days",
    text: "About 40 hours a week to start — like 8 hours, 5 days a week.",
  },
  "around-the-clock": {
    label: "Around the clock",
    text: "Care around the clock — 168 hours a week, covered in shifts so a rested caregiver is always there.",
  },
  "not-sure": {
    label: "Not sure yet",
    text: "Not sure about hours yet? That's normal. We'll work it out together at your free visit.",
  },
};

// ── Recommendations (result cards) ───────────────────────────────────────────

export interface PairLine {
  id: RecommendationId;
  /** Why it pairs with the primary. Service-page lines (COPY_SERVICES "Pairs well with"). */
  reason: string;
}

export interface Recommendation {
  id: RecommendationId;
  name: string;
  href: string;
  /** Same promise as COPY_HOME ch. 3 / COPY_SERVICES hub. */
  promise: string;
  /** One sentence under "Our suggestion". Subject tokens allowed. */
  intro: string;
  /** Exactly three. Subject tokens allowed. */
  bullets: [string, string, string];
  /** Fallback "also helpful" when only one service scored. In order. */
  pairs: PairLine[];
  /** Link text on the card. */
  linkLabel: string;
  confirmed: boolean;
}

export const recommendations: Record<RecommendationId, Recommendation> = {
  "personal-care": {
    id: "personal-care",
    name: "Personal Care",
    href: "/care/personal-care",
    promise: "Help with bathing, dressing and getting around — with dignity.",
    intro: "Gentle, hands-on help with the daily things that have gotten harder — so {they} can stay home and stay {themselves}.",
    bullets: [
      "Bathing and showering, safely",
      "Dressing and grooming",
      "Using the bathroom and moving around the house",
    ],
    pairs: [
      { id: "home-help", reason: "Meals, laundry and medication reminders on the same visit." },
      { id: "24-hour-care", reason: "When help is needed at night too." },
    ],
    linkLabel: "See Personal Care",
    confirmed: true,
  },
  "home-help": {
    id: "home-help",
    name: "Home Help",
    href: "/care/home-help",
    promise: "Meals, laundry, errands and medication reminders, so the house keeps running.",
    intro: "Help with the everyday things that keep a home safe, comfortable and {their} own.",
    bullets: [
      "Meals planned and cooked",
      "Laundry and light housekeeping",
      "Groceries, errands and medication reminders",
    ],
    pairs: [
      { id: "companionship", reason: "Someone to talk to while the chores get done." },
      { id: "personal-care", reason: "Help with bathing and dressing on the same visit." },
    ],
    linkLabel: "See Home Help",
    confirmed: true,
  },
  companionship: {
    id: "companionship",
    name: "Companionship",
    href: "/care/companionship",
    promise: "Company, conversation and getting out of the house.",
    intro: "Regular, friendly visits that give {them} good company and something to look forward to.",
    bullets: [
      "Conversation and good company",
      "Games, puzzles, music and hobbies",
      "Daily walks and trips to the park",
    ],
    pairs: [
      { id: "home-help", reason: "Lunch cooked, laundry done and a good chat, all in one visit." },
      { id: "respite-care", reason: "Company at home while the family caregiver takes a well-earned break." },
    ],
    linkLabel: "See Companionship",
    confirmed: true,
  },
  "respite-care": {
    id: "respite-care",
    name: "Respite Care",
    href: "/care/respite-care",
    promise: "A break for you. Your loved one keeps their routine.",
    intro: "We step in for a few hours, a weekend or longer, so the family caregiver can rest — and the routine at home stays the same.",
    bullets: [
      "A few hours, a weekend or longer",
      "Regular breaks or one-time cover",
      "Any of our care while the family caregiver is away",
    ],
    pairs: [
      { id: "personal-care", reason: "Hands-on help with bathing and dressing while the family caregiver is away." },
      { id: "24-hour-care", reason: "For trips and weekends when someone needs to be there at night." },
    ],
    linkLabel: "See Respite Care",
    confirmed: true,
  },
  "24-hour-care": {
    id: "24-hour-care",
    name: "24-Hour & Overnight Care",
    href: "/care/24-hour-care",
    promise: "Someone there, day and night.",
    intro: "A caregiver through the night, or around the clock in shifts — so {theyre} never alone when it matters most.",
    bullets: [
      "Overnight care, bedtime to morning",
      "Safe nighttime bathroom trips",
      "Shifts covered 7 days a week",
    ],
    pairs: [
      { id: "personal-care", reason: "Help with bathing and dressing, morning and night." },
      { id: "respite-care", reason: "Overnight cover so the family caregiver can sleep or travel." },
    ],
    linkLabel: "See 24-Hour & Overnight Care",
    confirmed: true,
  },
  "hospice-support": {
    id: "hospice-support",
    name: "Support alongside your hospice team",
    href: "/faq#hm-hospice",
    promise:
      "[[TO CONFIRM: hospice/palliative support]] Non-medical comfort and companionship alongside your hospice or palliative team.",
    intro:
      "[[TO CONFIRM — draft: \"Non-medical comfort and companionship alongside {their} hospice or palliative team, for the hours in between their visits.\"]]",
    bullets: [
      "[[TO CONFIRM — draft: \"Sitting with {them} so the family can rest\"]]",
      "[[TO CONFIRM — draft: \"Help with meals and personal care\"]]",
      "[[TO CONFIRM — draft: \"Company in the hours between hospice visits\"]]",
    ],
    pairs: [
      { id: "companionship", reason: "Company and comfort, so the family can rest." },
      { id: "respite-care", reason: "A break for the family during a hard time." },
    ],
    linkLabel: "Read about hospice and home care",
    confirmed: false,
  },
};

/** Not-sure result lists these, in this order. */
export const serviceOrder: ServiceSlug[] = [
  "personal-care",
  "home-help",
  "companionship",
  "respite-care",
  "24-hour-care",
];

export const isAvailable = (id: RecommendationId): boolean =>
  recommendations[id].confirmed || SHOW_PLACEHOLDERS;

// ── Scoring (07 §1 mapping) ──────────────────────────────────────────────────
// Points per answer. Highest score = primary. Ties broken by PRIORITY (safety first).
// Next highest scorers (score > 0) = "also helpful", max 2. If nothing else scored,
// the primary's first available pair fills one "also helpful" slot.

type Points = Partial<Record<RecommendationId, number>>;

const NEED_POINTS: Record<NeedId, Points> = {
  "bathing-dressing": { "personal-care": 3 },
  house: { "home-help": 3 },
  lonely: { companionship: 3 },
  // Transition support: Personal Care + Home Help.
  hospital: { "personal-care": 3, "home-help": 2 },
  night: { "24-hour-care": 3 },
  "caregiver-break": { "respite-care": 3 },
  // Hospice support (TO CONFIRM) + Companionship; Respite as a light "also" for the family.
  hospice: { "hospice-support": 4, companionship: 3, "respite-care": 1 },
  "something-else": {},
};

const HOURS_POINTS: Partial<Record<HoursId, Points>> = {
  "around-the-clock": { "24-hour-care": 3 },
};

export const PRIORITY: RecommendationId[] = [
  "24-hour-care",
  "hospice-support",
  "respite-care",
  "personal-care",
  "home-help",
  "companionship",
];

export type ReasonId = Exclude<NeedId, "something-else"> | "around-the-clock";

/** "Why we suggest this" lines. Subject tokens allowed. */
export const reasonText: Record<ReasonId, string> = {
  "bathing-dressing": "You said bathing or dressing is getting hard.",
  house: "You said the house is getting hard to keep up.",
  lonely: "You said {theyre} feeling lonely or cut off.",
  hospital: "You said {theyre} just home from the hospital or rehab, or coming home soon.",
  night: "You said {theyre} not safe alone at night.",
  "caregiver-break": "You said a family caregiver needs a break.",
  hospice: "You said {theyre} on hospice or palliative care.",
  "around-the-clock": "You said {they} may need help around the clock.",
};

/**
 * When one answer adds points to two services, the second card gets its own line
 * instead of repeating the primary's reason. Subject tokens allowed.
 */
export const alsoReasonText: Partial<Record<ReasonId, Partial<Record<RecommendationId, string>>>> = {
  hospital: {
    "home-help": "Coming home is easier when meals, laundry and errands are taken care of.",
  },
  hospice: {
    companionship: "Company and comfort — for {them} and for the family.",
    "respite-care": "A break for the family during a hard time.",
  },
};

export interface Score {
  id: RecommendationId;
  points: number;
  reasons: ReasonId[];
}

export function scoreQuiz(a: QuizAnswers): Score[] {
  const map = new Map<RecommendationId, Score>();
  const add = (points: Points, reason: ReasonId) => {
    for (const [id, p] of Object.entries(points) as [RecommendationId, number][]) {
      if (!isAvailable(id)) continue;
      const s = map.get(id) ?? { id, points: 0, reasons: [] };
      s.points += p;
      if (!s.reasons.includes(reason)) s.reasons.push(reason);
      map.set(id, s);
    }
  };
  for (const need of a.needs) {
    if (need !== "something-else") add(NEED_POINTS[need], need);
  }
  if (a.hours) {
    const hp = HOURS_POINTS[a.hours];
    if (hp && a.hours === "around-the-clock") add(hp, "around-the-clock");
  }
  return [...map.values()].sort(
    (x, y) => y.points - x.points || PRIORITY.indexOf(x.id) - PRIORITY.indexOf(y.id),
  );
}

// ── Result notes (situational, shown under the cards) ────────────────────────

export interface ResultNote {
  id: string;
  when: (a: QuizAnswers) => boolean;
  /** Subject tokens allowed. */
  text: string;
}

export const resultNotes: ResultNote[] = [
  {
    id: "night-few-hours",
    when: (a) =>
      a.needs.includes("night") &&
      (a.hours === "few-hours-week" || a.hours === "few-hours-most-days"),
    text: "Nights usually need more than a few hours of help. We'll work out a schedule that keeps {them} safe after dark.",
  },
  {
    id: "hospital",
    when: (a) => a.needs.includes("hospital"),
    text: "Still in the hospital or rehab? Call us before discharge if you can, so we can plan the first days home.",
  },
  {
    id: "hospice",
    when: (a) => a.needs.includes("hospice"),
    text: "All our care is non-medical. We don't replace the hospice team. Tell us who's on it, and we'll talk honestly about whether and how we can help.",
  },
  {
    id: "something-else",
    when: (a) => a.needs.includes("something-else") && a.needs.length > 1,
    text: "You also said something else is going on. Tell us about it when we talk — we'll build it into the plan.",
  },
];

// ── Urgency block (Q4) ───────────────────────────────────────────────────────
// `closed` replaces `text` when the office is closed. {nextOpen} and {ET} are filled by the component (lib/officeHours.ts).

export const urgencyCopy: Record<UrgencyId, { heading: string; text: string; closed?: string; safety?: string }> = {
  asap: {
    heading: "Need care soon?",
    text: "The quickest way to start is a phone call. Our office is open now: (843) 379-3321.",
    closed: "Our office is closed right now. Request a callback and we'll reach you first thing {nextOpen}{ET}.",
    safety: "If someone is hurt or in danger, call 911.",
  },
  "two-weeks": {
    heading: "Starting in the next couple of weeks?",
    text: "The free visit is the first step. Book it now, and we'll plan the rest together.",
  },
  month: {
    heading: "Planning ahead?",
    text: "Good thinking. Book your free visit now, and start care when you're ready.",
  },
  exploring: {
    heading: "Just looking for now?",
    text: "That's fine — no pressure. Email yourself this plan, and come back when you're ready.",
  },
};

// ── Town block (Q5) ──────────────────────────────────────────────────────────

export const townCopy = {
  primary: "We care for families {in} {town}.",
  primaryLink: "See care {in} {town}",
  extended: "{town} is in our extended service area. We'll check scheduling for your hours when we talk.",
  otherNamed: "We'll check whether we can reach {townOther} when we talk.",
  otherBlank: "We'll check whether we can reach {their} town when we talk.",
  noPageCall: "Call (843) 379-3321 and we'll talk about care {in} {town}.",
} as const;

// ── Result screen copy ───────────────────────────────────────────────────────

export const resultUi = {
  headline: "Here's what we'd suggest for {lovedOne}.",
  intro: "Based on your answers. It's a starting point, not a package — every plan is built around {lovedOne} at a free visit.",
  primaryLabel: "Our suggestion",
  whyLabel: "Why we suggest this",
  alsoHeading: "Also helpful",
  hoursHeading: "Hours to start",
  hoursNote: "These are example schedules. We'll set the real one together.",
  costHeading: "What it might cost",
  costLink: "Adjust it in the full estimator",
  nonMedical: "All our care is non-medical. We work alongside home health and hospice teams.",
  cta: {
    heading: "Next step: a free visit at home",
    text: "Our owner comes to {their} home, meets the family and builds the plan with you. Free, with no obligation.",
    primary: "Get a Free Care Assessment",
    primaryAfterHours: "Request a Callback",
    helper: "We've filled in your answers, so it only takes a minute.",
    secondary: "Call (843) 379-3321",
  },
  changeAnswers: "Change my answers",
  startOver: "Start over",
  notSure: {
    headline: "Let's figure it out together.",
    intro:
      "Your answers don't point to one kind of help — and that's completely normal. Most families combine two or three. At a free visit, our owner will help you work out exactly what fits.",
    listHeading: "The ways we help",
  },
  emailPlan: {
    heading: "Want a copy?",
    text: "We'll email this plan to you — handy for sharing with family.",
    emailLabel: "Your email (required)",
    nameLabel: "Your first name",
    consent:
      "Yes, email me this plan. Dawson and Dawson Home Care LLC may follow up by email about it. I can unsubscribe at any time.",
    button: "Email me this plan",
    sending: "Sending…",
    success: "Sent. Check your inbox — and your spam folder, just in case.",
    privacy: "We'll only use your email to send this plan and follow up about it.",
  },
} as const;

// ── Result builder ───────────────────────────────────────────────────────────

export interface ResultCard {
  id: RecommendationId;
  name: string;
  href: string;
  linkLabel: string;
  promise: string;
  intro: string;
  bullets: string[];
  /** Resolved "why" lines (primary) or the single reason line (also helpful). */
  reasons: string[];
  confirmed: boolean;
}

export interface QuizResult {
  kind: "recommendation" | "not-sure";
  subject: Subject;
  headline: string;
  intro: string;
  primary: ResultCard | null;
  also: ResultCard[];
  hours: { id: HoursId | null; label: string; text: string; preset: HoursPreset | null };
  notes: string[];
  urgency: { heading: string; text: string; closed: string | null; safety: string | null } | null;
  town: { text: string; link: { label: string; href: string } | null } | null;
  /** Primary first. Sent as quiz_services. */
  services: RecommendationId[];
}

const toCard = (id: RecommendationId, s: Subject, reasons: string[]): ResultCard => {
  const r = recommendations[id];
  return {
    id,
    name: r.name,
    href: r.href,
    linkLabel: r.linkLabel,
    promise: r.promise,
    intro: fill(r.intro, s),
    bullets: r.bullets.map((b) => fill(b, s)),
    reasons: reasons.map((t) => fill(t, s)),
    confirmed: r.confirmed,
  };
};

function buildTown(a: QuizAnswers, s: Subject): QuizResult["town"] {
  if (!a.town || a.town === "not-sure") return null;
  if (a.town === "other") {
    const named = a.townOther.trim().slice(0, TOWN_OTHER_MAX);
    return {
      text: named ? fill(townCopy.otherNamed, s, { townOther: named }) : fill(townCopy.otherBlank, s),
      link: null,
    };
  }
  const area = getArea(a.town);
  if (!area) return null;
  const vars = { in: area.preposition, town: area.name };
  if (area.tier === "extended") return { text: fill(townCopy.extended, s, vars), link: null };
  return {
    text: fill(townCopy.primary, s, vars),
    link: area.hasPage
      ? { label: fill(townCopy.primaryLink, s, vars), href: `/areas-we-serve/${area.slug}` }
      : null,
  };
}

export function buildResult(a: QuizAnswers): QuizResult {
  const s = subjectFor(a.careFor);
  const scores = scoreQuiz(a);
  const top = scores[0];

  const hoursId = a.hours;
  const hours: QuizResult["hours"] = {
    id: hoursId,
    label: hoursId ? hoursCopy[hoursId].label : hoursCopy["not-sure"].label,
    text: hoursId ? hoursCopy[hoursId].text : hoursCopy["not-sure"].text,
    preset: hoursId && hoursId !== "not-sure" ? hoursPresets[hoursId] : null,
  };

  const u = a.urgency ? urgencyCopy[a.urgency] : null;
  const urgency: QuizResult["urgency"] = u
    ? {
        heading: u.heading,
        text: fill(u.text, s),
        closed: u.closed ? fill(u.closed, s) : null,
        safety: u.safety ?? null,
      }
    : null;

  const notes = resultNotes.filter((n) => n.when(a)).map((n) => fill(n.text, s));
  const town = buildTown(a, s);

  if (!top) {
    return {
      kind: "not-sure",
      subject: s,
      headline: resultUi.notSure.headline,
      intro: resultUi.notSure.intro,
      primary: null,
      also: [],
      hours,
      notes,
      urgency,
      town,
      services: [],
    };
  }

  const primary = toCard(
    top.id,
    s,
    top.reasons.map((r) => reasonText[r]),
  );

  const also: ResultCard[] = scores
    .slice(1)
    .filter((x) => x.points > 0)
    .slice(0, 2)
    .map((x) => {
      // Prefer a reason the primary doesn't already show. Use the card-specific line if one exists.
      const reason = x.reasons.find((r) => !top.reasons.includes(r)) ?? x.reasons[0];
      const line = reason ? (alsoReasonText[reason]?.[x.id] ?? reasonText[reason]) : null;
      return toCard(x.id, s, line ? [line] : []);
    });

  if (also.length === 0) {
    const pair = recommendations[top.id].pairs.find((p) => isAvailable(p.id));
    if (pair) also.push(toCard(pair.id, s, [pair.reason]));
  }

  return {
    kind: "recommendation",
    subject: s,
    headline: fill(resultUi.headline, s),
    intro: fill(resultUi.intro, s),
    primary,
    also,
    hours,
    notes,
    urgency,
    town,
    services: [primary.id, ...also.map((c) => c.id)],
  };
}

// ── Hand-offs ────────────────────────────────────────────────────────────────

/** GHL custom fields (07 §1 + 08 §2). quiz_needs and quiz_primary are additions. */
export function toGhlFields(a: QuizAnswers, r: QuizResult): Record<string, string> {
  const other = a.townOther.trim().slice(0, TOWN_OTHER_MAX);
  return {
    quiz_for: a.careFor ?? "",
    quiz_needs: a.needs.join(","),
    quiz_services: r.services.join(","),
    quiz_primary: r.primary?.id ?? "not-sure",
    quiz_hours: a.hours ?? "",
    quiz_urgency: a.urgency ?? "",
    quiz_town: a.town === "other" ? (other ? `other:${other}` : "other") : (a.town ?? ""),
  };
}

/** GHL tag added to every lead that finished the quiz. */
export const QUIZ_TAG = "quiz-completed";

export interface AssessmentPrefill {
  care_for: CareFor | null;
  /** Pre-ticked in Step 2. "not-sure" ticks "Not sure yet — help me decide". */
  services: (RecommendationId | "not-sure")[];
  hours: HoursId | null;
  start_timing: UrgencyId | null;
  town: string | null;
  town_other: string;
  coming_from_hospital: boolean;
  prefill_source: "quiz";
}

/** Written to sessionStorage ("dawson.assessment.prefill.v1") before navigating to /free-assessment?from=quiz. */
export function toAssessmentPrefill(a: QuizAnswers, r: QuizResult): AssessmentPrefill {
  return {
    care_for: a.careFor,
    services: r.services.length ? r.services : ["not-sure"],
    hours: a.hours,
    start_timing: a.urgency,
    town: a.town,
    town_other: a.townOther.trim().slice(0, TOWN_OTHER_MAX),
    coming_from_hospital: a.needs.includes("hospital"),
    prefill_source: "quiz",
  };
}

export const ASSESSMENT_PREFILL_KEY = "dawson.assessment.prefill.v1";
export const assessmentHref = "/free-assessment?from=quiz";

/** Full estimator link — hours only, nothing sensitive. */
export function estimatorHref(hours: HoursId | null): string {
  if (!hours || hours === "not-sure") return "/paying-for-care?from=quiz#estimator";
  const p = hoursPresets[hours];
  return `/paying-for-care?from=quiz&preset=${hours}&hours=${p.hoursPerVisit}&days=${p.daysPerWeek}&overnight=${p.overnight ? 1 : 0}#estimator`;
}
```
