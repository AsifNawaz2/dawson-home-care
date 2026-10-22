# COPY_HOME — Homepage (14 chapters)

**Status:** Final copy for design + build. Use verbatim.
**Sources:** 02, 05, 06 (Home), 07, 09, BRAND_FINAL.md.
**Reading level:** grade 6–8. **Voice:** warm, calm, plain, local. "Clients", never "patients".

---

## 0. Conventions (read first)

**Dynamic tokens** (computed in code, never hard-coded):

| Token | Source | Example (Oct 2026) |
|---|---|---|
| `{years}` | `lib/years.ts` → `currentYear − 2002` | 24 |
| `{currentYear}` | `new Date().getFullYear()` | 2026 |
| `{officeStatus}` | `lib/officeHours.ts` (America/New_York, Mon–Fri 08:00–17:00) | open / closed |
| `{nextOpen}` | same | "today at 8 AM" · "tomorrow at 8 AM" · "Monday at 8 AM" |
| `{town}` | `content/areas.ts` | Port Royal |

`{nextOpen}` rules: before 8 AM on a weekday → "today at 8 AM". After 5 PM Mon–Thu → "tomorrow at 8 AM". After 5 PM Friday, Saturday, Sunday → "Monday at 8 AM". Holiday in config → "{weekday} at 8 AM".

**Placeholders:** `[[TO CONFIRM: …]]` = unverified. Must show in `npm run prelaunch`.

**Numbering:** the Hero and Final CTA are bookends with no number. Chapters 2–13 are numbered **01–12** in the eyebrow (format: `01 — The moment`).

**Headings:** one H1 (Hero). Every chapter title is an H2. Room cards, steps, FAQ questions and caregiver names are H3.

**After-hours rule (site-wide):** when `{officeStatus}` = closed, every **"Get a Free Care Assessment"** button on this page becomes **"Request a Callback"** (same destination, `after_hours=true`).

**Images:** all photos are placeholders now. Alt text below follows the brief in 11. **When a real photo lands, check its alt text still matches what it shows.** No text is ever placed on top of a photo or placeholder. Captions go below.

**Cursor labels** (visual only, ≤5 characters): Call · Open · Play · Drag · View. Every labelled element also has its own accessible name.

---

## Page meta (draft — SEO_PLAN.md overrides)

- **Title:** In-Home Care in Beaufort, SC | Dawson & Dawson Home Care
- **Meta description:** Owner-run, non-medical home care in Beaufort, SC since 2002. Personal care, home help, companionship, respite and 24-hour care. Free in-home assessment.

---

## 1. Hero — "Care that feels like family"

**Eyebrow:** none (the trust row does this job)

**Office-status chip** (above the headline):
- Open: **Office open now**
- Closed: **Office closed · Opens {nextOpen}**
- Icon + words always (open = leaf dot, closed = moon). Never color alone.

**Headline (H1, display-xl):**
> Care that feels like *family* — from an owner who meets yours.

(Italic on "family" only.)

**Subline (lead):**
> Help at home for a few hours or around the clock, 7 days a week. Local. Owner-run. Here since 2002.

**Buttons:**
- Primary: **Get a Free Care Assessment** → `/free-assessment` (after hours: **Request a Callback**)
- Secondary: **Call (843) 379-3321** → `tel:+18433793321` · cursor label `Call`

**Microcopy under buttons:**
> Free visit at home. No obligation.

**Trust row (small, icon + words):**
> Since 2002 · Owner-run · Care 24/7

Screen-reader version of the row (one sentence): "Caring for families since 2002. Owner-run. Care available 24 hours a day, 7 days a week."

**Images (collage):**

| File | Alt text |
|---|---|
| `hero-1.jpg` (main, 4:5) | A Dawson caregiver and an older woman laughing together on the sofa at home. |
| `hero-2.jpg` (layer, 1:1) | A caregiver's hand resting on an older man's hand beside a cup of tea. |
| `hero-3.jpg` (layer, 3:4) | `alt=""` (decorative: porch and live oak light) |

**Placeholder labels:** "Caregiver and client at home · 4:5" · "Hands and tea · 1:1" · "Lowcountry porch · 3:4"

**Swap at reveal (if confirmed family-run):**
> Care that feels like *family* — because it's run by one.

`[[TO CONFIRM: is the agency family-run? If yes, use this headline]]`

---

## 2. "It usually starts with a moment."

**Eyebrow:** 01 — The moment

**Headline (H2):**
> It usually starts with a moment.

**The lines** (appear one at a time while the scene is pinned; each fades as the next arrives):

1. Mom missed her pills again.
2. Dad fell getting out of the shower.
3. She hasn't left the house in a week.
4. You live three hours away.
5. And you haven't had a real day off in months.

**Resolution** (larger, stays on screen):
> You don't have to figure this out alone.

**Follow-up line (lead):**
> We've helped Lowcountry families through moments like these since 2002.

**Text link:** See how we can help ↓ → scrolls to chapter 3 (`#how-we-help`)

**Skip link** (visually hidden until focused, top of the scene):
> Skip to how we help

**Scene progress** (visual, small, under the lines): "1 of 5" … "5 of 5". `aria-hidden`; the full list is in the DOM.

**Screen readers / reduced motion:** all five lines render as a plain list, then the resolution and follow-up line. Same order, no pinning.

**Illustrations** (line art, all `aria-hidden="true"`; the words carry the meaning):

| Line | Illustration brief |
|---|---|
| 1 | Weekly pill organizer with one day still full |
| 2 | Bath mat and a grab bar by the shower (no person) |
| 3 | Armchair by a window with the curtains half-closed |
| 4 | Phone showing a call, with a long road on a map behind it |
| 5 | Coffee mug on a kitchen table, clock reading 11 PM |

---

## 3. The Dawson House

**Section ID:** `how-we-help`
**Eyebrow:** 02 — How we help

**Headline (H2):**
> Every kind of help, under one roof.

**Subline:**
- Desktop: **Scroll through the house. Each room is one way we help.**
- Mobile / reduced motion: **Tap a room to see how we help.**

**Skip link** (visually hidden until focused):
> Skip to the next section

**House SVG** — `<title>`:
> The Dawson House: an illustrated Lowcountry house with a tin roof, a porch and a live oak. Each room links to one of our five care services.

**Room label cards** (in scroll order). Each card: service name (H3) · promise · small industry label · link.

| # | Room | Service (H3) | Promise | Small label | Link text |
|---|---|---|---|---|---|
| 1 | Bathroom | **Personal Care** | Help with bathing, dressing and getting around — with dignity. | Also called: help with daily living (ADLs) | See how we help → `/care/personal-care` |
| 2 | Kitchen | **Home Help** | Meals, laundry, errands and medication reminders, so the house keeps running. | Also called: homemaker care | See how we help → `/care/home-help` |
| 3 | Porch | **Companionship** | Company, conversation and getting out of the house. | Also called: companion care | See how we help → `/care/companionship` |
| 4 | Bedroom | **24-Hour & Overnight Care** | Someone there, day and night. | Also called: round-the-clock care | See how we help → `/care/24-hour-care` |
| 5 | Living room | **Respite Care** | A break for you. Your loved one keeps their routine. | Also called: respite | See how we help → `/care/respite-care` |

**Room link `aria-label`s** (SVG `<a>` elements, cursor label `Open`):
1. Personal Care: help with bathing, dressing and getting around. Opens the Personal Care page.
2. Home Help: meals, laundry, errands and medication reminders. Opens the Home Help page.
3. Companionship: company, conversation and getting out. Opens the Companionship page.
4. 24-Hour and Overnight Care: someone there, day and night. Opens the 24-Hour and Overnight Care page.
5. Respite Care: a break for family caregivers. Opens the Respite Care page.

**Scene progress** (visual): "Room 1 of 5" … "Room 5 of 5"

**Below the house (after the last room):**
> Most families combine two or three. Your plan is built around your loved one.

**Non-medical line (small):**
> All our care is non-medical. We work alongside your home health team.

**Hospice line (small, hidden until confirmed):**
> Already working with a hospice or palliative team? We can provide non-medical comfort and companionship alongside them. `[[TO CONFIRM: hospice/palliative support]]`

**Button:** Ghost — **See all care services** → `/care` · cursor label `View`

---

## 4. "Not sure what you need?"

**Eyebrow:** 03 — Find the right care

**Headline (H2):**
> Not sure what you need?

**Subline:**
> Most families aren't. Answer five quick questions and we'll suggest a plan.

**Microcopy (above the question):**
> About 1 minute · No email needed

**Live question** (inline; tapping an answer opens `/find-care` at question 2 with this answer saved):

- **Progress:** Question 1 of 5
- **Question (H3):** Who is the care for?
- **Answers:**
  - My parent
  - My spouse or partner
  - Myself
  - Someone else
- **Helper:** Tap an answer to keep going.

Answer illustrations are `aria-hidden`. Answers are buttons with the answer text as their name.

**Fallback link** (no-JS, and for anyone who'd rather start fresh):
> Find the right care → `/find-care`

---

## 5. How it works

**Eyebrow:** 04 — How it works

**Headline (H2):**
> Getting started is simple.

**Subline:**
> One call. One free visit. Then care that fits.

**Steps** (on the heartbeat line; "Step X" label + H3 + two lines):

**Step 1 — Call or text us**
> Tell us what's going on. We'll listen, answer your questions and set up a visit.
> Small: (843) 379-3321 · Office hours Monday–Friday, 8 AM–5 PM

**Step 2 — Our owner visits — free** *(highlighted card)*
- Badge: **The Dawson difference**
> Our owner comes to your loved one's home, meets the family and learns how they like to live.
> Small: Free · No obligation · At home
- Photo: `owner-with-client.jpg`
- Alt: Dawson's owner sitting with a family at their kitchen table.
- Placeholder label: "Owner with a family · 3:2"

**Step 3 — We build your care plan**
> Together, we plan the days, the hours and the help — around their routine.

**Step 4 — We match your caregiver**
> We choose an experienced caregiver who fits your loved one's needs and schedule.

**Step 5 — We keep checking in**
> We follow up regularly and adjust the plan as needs change.

Step illustrations are `aria-hidden`. Steps are an ordered list (`<ol>`).

**Buttons:**
- Primary: **Get a Free Care Assessment** → `/free-assessment`
- Ghost: **See how it works** → `/how-it-works`

---

## 6. Since 2002

**Eyebrow:** 05 — Since 2002

**Counter (display, animates from 0 to `{years}` when visible):**
> **{years}**
> years caring for Lowcountry families

**Headline (H2, visually merged with the counter; screen-reader text):**
> {years} years caring for Lowcountry families

The counter element is `aria-hidden`; the H2 above carries the final number. Reduced motion: the final number shows with no count.

**Body:**
> Dawson and Dawson Home Care has helped families stay at home since 2002. Today we're owner-run, licensed and insured, with our office right here in Beaufort.

**Timeline ticks** (2002 → today, only two labels — no invented milestones):
- **2002** — We begin caring for Lowcountry families.
- **{currentYear}** — {years} years later, still here.

Decade ticks between them are unlabelled and `aria-hidden`.

**Office caption (small, with pin icon):**
> Our office: 69 Robert Smalls Parkway, Suite 3F, Beaufort, SC 29906

**Trust link (small):**
> Licensed & insured → opens the verification panel (`/about#licensed`)
> Panel line: South Carolina in-home care license `[[TO CONFIRM: SC license number]]`

---

## 7. Meet the owner

**Eyebrow:** 06 — Meet the owner

**Headline (H2):**
> The person at your kitchen table runs the company.

**Subline:**
> At Dawson, the owner meets every family personally — and keeps working with you to make sure care is done right.

**Body (short draft — full story in COPY_TRUST.md):**
> [[TO CONFIRM: owner first and last name]] leads Dawson and Dawson Home Care. [[TO CONFIRM: one sentence on their background in health and home care]]. [[TO CONFIRM: one sentence on why they started or run the company]].

**Pull quote:**
> "[[TO CONFIRM: owner quote — one sentence about why they do this work]]"

**Signature (SVG, `owner-signature.svg`):**
- Visible name line below: **[[TO CONFIRM: owner name]], Owner**
- Signature image: `aria-hidden` (the name line carries it)

**Portrait (`owner-portrait.jpg`):**
- Alt: [[TO CONFIRM: owner name]], owner of Dawson and Dawson Home Care, at the Beaufort office.
- Placeholder label: "Owner portrait · 4:5"

**Video (`owner-intro.mp4`):**
- Play button text: **Watch a short hello**
- Accessible name: Play video: a short hello from [[TO CONFIRM: owner name]], with captions
- Cursor label: `Play`
- Poster alt: [[TO CONFIRM: owner name]] smiling at the camera in the Dawson office.
- Under the player: **Captions on** · **Read the transcript** (toggle → **Hide the transcript**)
- Coming-soon state (no video yet): **Video coming soon** — A short hello from our owner is on its way.

**Button:** Ghost — **Read our story** → `/about`

---

## 8. Our caregivers

**Eyebrow:** 07 — Our caregivers

**Headline (H2):**
> Meet the people who do the caring.

**Subline:**
> Experienced caregivers — including Certified Nursing Assistants — with a real love for this work.

**Carousel instruction (small, above):**
> Drag, swipe or use the arrows to see more.

**Carousel:**
- Region name: Our caregivers
- Viewport cursor: `data-cursor-label="Drag"`
- Arrow buttons: **Previous caregiver** · **Next caregiver** (icon buttons, these are their accessible names)
- Slide position (visual + screen reader): "2 of 6"

**Card front:**
- Name (H3): **{First name}**
- Line 1: {years with Dawson} years with Dawson
- Line 2: {specialty}
- Flip button: **Why I do this**
- Photo alt: {First name}, a Dawson caregiver.

**Card back:**
- Label: **Why I do this**
- Quote: "{quote}"
- Button: **Back to photo**

**Placeholder card** (until real caregivers are added — never realistic fake names):
- Name: **Caregiver Name**
- Line 1: [[TO CONFIRM]] years with Dawson
- Line 2: [[TO CONFIRM: specialty]]
- Quote: "This is a sample card. A real caregiver's words will go here."
- Photo placeholder label: "Caregiver portrait · 4:5"

**Reduced motion:** no flip; the quote shows below the photo on every card.

**Links:**
- Ghost: **Meet the team** → `/about#caregivers`
- Text link (small): **Want to join them? See caregiver jobs** → `/careers`

---

## 9. What families say

**Eyebrow:** 08 — What families say

**Headline (H2):**
> In their words.

**Subline:**
> Reviews from families in Beaufort and across the Lowcountry.

**Google rating badge** (hidden until confirmed):
> [[TO CONFIRM: rating]] on Google · [[TO CONFIRM: count]] reviews

**Marquee controls:**
- Button: **Pause reviews** / **Play reviews** (also pauses on hover and keyboard focus)

**Review card format:**
- Stars (visual) + screen-reader text: "Rated {rating} out of 5"
- Quote: "{text}"
- Attribution: — {name}, {relation} · {town}
- Service chip: {service}
- Cursor label `View` if the card opens

**Placeholder card** (`placeholder: true`, `name: "Sample Review"`):
> "This is a sample review. Real reviews from Dawson families will replace it before launch."
> — Sample Review

**Button:** Ghost — **Read all reviews** → `/reviews`

**Launch rule:** if fewer than 3 real reviews exist at launch, hide this chapter. Never ship sample reviews.

---

## 10. What will care cost?

**Eyebrow:** 09 — Cost

**Headline (H2):**
> What will care cost?

**Subline:**
> Move the sliders for a rough weekly and monthly range. No email, no sign-up.

**Badge (while `rateConfirmed: false`):**
> Illustrative estimate

**Inputs:**

| Control | Label | Helper / value text |
|---|---|---|
| Slider (2–24) | **Hours per visit** | Value: "{n} hours" · `aria-valuetext`: "{n} hours per visit" |
| Stepper (1–7) | **Days per week** | Value: "{n} days" · buttons: **Fewer days** / **More days** |
| Toggle | **Overnight or 24-hour care** | Turn on if someone needs to be there overnight or around the clock. |

Minimum visit helper (hidden until confirmed):
> Visits start at [[TO CONFIRM: minimum hours]] hours.

**Output:**
- Big number: **{weeklyHours} hours a week**
- Range lines:
  - About **${weeklyMin}–${weeklyMax}** a week
  - About **${monthlyMin}–${monthlyMax}** a month
- Scale bar labels: **A few hours** ↔ **Around the clock**
- Live region (polite, announced after input settles): "{weeklyHours} hours a week. About ${weeklyMin} to ${weeklyMax} a week."

**Disclaimer (always visible under the numbers):**
> Your exact rate is set at your free assessment.

**Hours-only mode** (if prices are hidden at the reveal):
- Replace the range lines with: **Your rate is set at your free assessment — every plan is different.**

**Buttons:**
- Primary: **Get your exact plan — free assessment** → `/free-assessment` (prefills hours)
- Text link: **Estimate your cost in detail** → `/paying-for-care`
- Text link: **See ways families pay for care** → `/paying-for-care#ways-to-pay`

---

## 11. Where we care

**Eyebrow:** 10 — Where we care

**Headline (H2):**
> Rooted in Beaufort. Caring across the Lowcountry.

**Subline:**
> Our office is in Beaufort, and we care for families in towns nearby.

**Map:**
- Accessible name: Map of Beaufort County and nearby towns. Our office is in Beaufort. Every town on the map is also listed below.
- Office pin label: **Our office** · 69 Robert Smalls Pkwy, Beaufort
- Town hover/focus label: **{town}** · About [[TO CONFIRM: drive time]] min from our office
- Town link `aria-label`: In-home care in {town}. Opens the {town} page.
- Cursor label on towns: `View`

**Town search:**
- Label: **Do you serve my town?**
- Helper: Type your town or ZIP code.
- Match: **Yes — we care for families in {town}.** See care in {town} →
- No match: **We may still be able to help.** Call (843) 379-3321 and we'll let you know.
- Empty submit: Please type a town or ZIP code.

**List fallback heading (H3):**
> Towns we serve

(Towns from `content/areas.ts`, all `confirmed: false` until the reveal.)

**Button:** Ghost — **See all areas we serve** → `/areas-we-serve`

---

## 12. For healthcare professionals

**Eyebrow:** 11 — For professionals

**Headline (H2):**
> Referring someone? It takes about 2 minutes.

**Subline:**
> For discharge planners, case managers, social workers and care teams.

**Body:**
> Send a referral online or fax it to (866) 502-3509. We'll respond within [[TO CONFIRM: response time]].

**Buttons:**
- Primary: **Make a referral** → `/for-professionals#refer`
- Ghost (cream on dark): **Call (843) 379-3321** → `tel:+18433793321` · cursor label `Call`

**Small line:**
> Fax: (866) 502-3509

Section: `data-surface="dark"` + `data-cursor-theme="dark"`.

---

## 13. Questions families ask

**Eyebrow:** 12 — Questions

**Headline (H2):**
> Questions families ask us.

**Accordion** (question = H3 button; deep-link IDs match `/faq`):

**What's the difference between home care and home health?** `#home-care-vs-home-health`
> Home care is non-medical help at home: bathing, dressing, meals, housekeeping, company and medication reminders. That's what we do. Home health is medical care from nurses or therapists, usually ordered by a doctor. Many families use both, and we're happy to work alongside your home health team.

**How much does home care cost?** `#cost`
> It depends on how many hours of help you need. Use our cost estimator for a rough range. Your exact rate is set at your free assessment.

**Does Medicare pay for home care?** `#medicare`
> Usually not. Medicare generally doesn't cover non-medical home care. Some families use long-term care insurance, VA benefits or Medicaid waiver programs. Ask us which might apply to you.

**Can you help at night or on weekends?** `#nights-weekends`
> Yes. Care is available 24 hours a day, 7 days a week — a few hours or around the clock. Our office is open Monday to Friday, 8 AM to 5 PM.

**Who will come to my loved one's home?** `#caregivers`
> An experienced Dawson caregiver chosen for your loved one's needs and schedule. Our team includes Certified Nursing Assistants, and our owner stays involved in every client's care.

**What happens at the free assessment?** `#free-assessment`
> Our owner visits your loved one at home, at no cost. We talk about daily routines, the help they need and what matters most to them. Then we build a care plan together. There's no obligation.

**Button:** Ghost — **See all questions** → `/faq`

---

## 14. Final CTA

**Eyebrow:** none (bookend)

Surface: Dusk band. `data-surface="dusk"` + `data-cursor-theme="dark"`. Copy and buttons left-aligned, kept in the plum half.

**Headline (H2, display-l):**
> Let's talk about your *family*.

(Italic "family" in cream — not leaf-500, per BRAND_FINAL §1.4 #7.)

**Subline:**
> One call. One free visit at home. No pressure.

**Buttons:**
- Primary: **Get a Free Care Assessment** → `/free-assessment` (after hours: **Request a Callback**)
- Ghost (cream): **Call (843) 379-3321** → `tel:+18433793321` · cursor label `Call`
- Ghost (cream): **Text us (866) 632-9766** → `sms:+18666329766`

**Hours line (always both, always labelled):**
> **Care:** 24 hours a day, 7 days a week
> **Office:** Monday–Friday, 8 AM–5 PM

**After-hours line (replaces nothing; appears above the buttons when closed):**
> Our office is closed right now. Request a callback and we'll reach you first thing {nextOpen}.

**Text note (small, under the Text button):**
> Msg & data rates may apply. Reply STOP to opt out. `[[TO CONFIRM: final wording from COPY_LEGAL.md]]`

---

## Placeholder summary (for `npm run prelaunch`)

- Hero swap headline — family-run
- Owner name, background, reason, quote, portrait, signature, video, transcript
- SC license number
- Caregiver cards (all)
- Reviews (all) + Google rating and count
- Rates (`rateConfirmed: false`) + minimum visit hours
- Service-area towns + drive times
- Referral response time
- Hospice/palliative support line
- SMS note wording under "Text us"
