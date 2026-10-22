# COPY_SERVICES — Care hub + 5 service pages

**Status:** Final copy for design + build. Use verbatim.
**Pages:** `/care` · `/care/personal-care` · `/care/home-help` · `/care/companionship` · `/care/respite-care` · `/care/24-hour-care`
**Sources:** 04, 05 (§A service structure), 06 (Care hub + Service page template), 07, 09 (§3 claims), COPY_HOME.md (tone + conventions), 11 (image slots).
**Reading level:** grade 6–8. **Voice:** warm, calm, plain, local. "Clients", never "patients".

---

## 0. Conventions (read first)

Everything in **COPY_HOME.md §0** applies here: `{years}`, `{currentYear}`, `{officeStatus}`, `{nextOpen}`, `[[TO CONFIRM: …]]`, cursor labels, no text on photos, alt-text rule.

**Headings:** one H1 per page (the Hero). Every section title is an H2. Checklist items are checkbox labels (not headings). Included items, timeline steps, safety points, related-service cards and FAQ questions are H3.

**Eyebrow numbering:** Hero and the Review + CTA band are bookends with no number. Template sections 2–8 are numbered **01–07** (format `01 — Is this right for you?`).

**After-hours rule:** when `{officeStatus}` = closed, every **Get a Free Care Assessment** button becomes **Request a Callback** (same destination, `after_hours=true`).

**Service slugs** (used for prefill params, review filters, schema, GHL tags):

| Service | Slug | Industry label (small, secondary) |
|---|---|---|
| Personal Care | `personal-care` | Also called: help with daily living (ADLs) |
| Home Help | `home-help` | Also called: homemaker care |
| Companionship | `companionship` | Also called: companion care |
| Respite Care | `respite-care` | Also called: respite |
| 24-Hour & Overnight Care | `24-hour-care` | Also called: round-the-clock care |

**Prefill params** (consumed by the assessment form and estimator, see 07 §2 and §12):
- Assessment: `/free-assessment?service={slug}&needs={checklist ids, comma-separated}`
- Estimator: `/paying-for-care?service={slug}&hours={n}&days={n}&overnight={0|1}#estimator`

**"This helps if…" checklist behavior** (same on every page):
- Native checkboxes, label = full sentence. Tick animation per 07 §20 (leaf-green check; none in reduced motion).
- Result line is a polite live region. Hidden at 0 ticks.
  - 1–2 ticked: **That's worth a conversation. We'll talk it through at your free visit.**
  - 3 or more ticked: **{Service} sounds like a good fit. Let's talk it through at your free visit.**
- Button under the result line (visible from 1 tick): **Get a Free Care Assessment** → assessment URL with `needs=` filled from the ticked IDs.
- Ticks are saved to sessionStorage and sent to GHL as `service_page_needs`.

**"A day with Dawson" timeline** (same on every page): ordered list; each step = time (`<time>`), H3 title, one line. Scroll reveals step by step on desktop; reduced motion = the full list, no reveal. The subline always says it is an example.

**Review section** (same on every page): shows one review from `reviews.json` where `service = {slug}` and `placeholder = false`. If none exist, the section is not rendered. Sample reviews never ship (COPY_HOME ch. 9 launch rule).

**Structured data per service page:** `Service` (`name`, `serviceType`, `provider` → the site `LocalBusiness`, `areaServed` → confirmed towns only), `FAQPage` (the page's FAQs), `BreadcrumbList`. Hub: `BreadcrumbList` + an `ItemList` of the 5 services.

**Page meta** is draft — SEO_PLAN.md overrides when it exists (same rule as COPY_HOME).

---
---

# CARE HUB — /care

## Page meta

- **Title:** Home Care Services in Beaufort, SC | Dawson & Dawson
- **Meta description:** Non-medical home care in Beaufort, SC: personal care, home help, companionship, respite and 24-hour care. Owner-run since 2002. Free home visit.

**Breadcrumb:** Home › Care

---

## Intro (Hero)

**Eyebrow:** Care services

**Headline (H1):**
> Home care, built around your *family*.

**Subline (lead):**
> Five kinds of non-medical help at home — for a few hours a week or around the clock, 7 days a week. Most families combine two or three.

**Buttons:**
- Primary: **Get a Free Care Assessment** → `/free-assessment` (after hours: **Request a Callback**)
- Ghost: **Find the right care** → `/find-care`

**Microcopy under buttons:**
> Free visit at home. No obligation.

**Illustration:** the Dawson House, static, all five rooms lit (reuse from Home ch. 3). Each room links to its service page with the same `aria-label`s as COPY_HOME ch. 3.
- `<title>`: The Dawson House: an illustrated Lowcountry house. Each room links to one of our five care services.

---

## 01 — Service cards

**Eyebrow:** 01 — Our services

**Headline (H2):**
> Five ways we help at home.

**Cards** (illustration = that service's room from the Dawson House, `aria-hidden`). Card format: name (H3) · small industry label · promise · 4 bullets · link. Whole card is clickable; the link text is the accessible name. Cursor label `Open`.

**Personal Care**
- Small label: Also called: help with daily living (ADLs)
- Promise: Help with bathing, dressing and getting around — with dignity.
- Bullets:
  - Bathing and showering
  - Dressing and grooming
  - Help using the bathroom
  - Moving safely around the house
- Link: **See Personal Care →** `/care/personal-care`

**Home Help**
- Small label: Also called: homemaker care
- Promise: Meals, laundry, errands and medication reminders, so the house keeps running.
- Bullets:
  - Meals planned and cooked
  - Laundry and light housekeeping
  - Groceries and errands
  - Medication reminders
- Link: **See Home Help →** `/care/home-help`

**Companionship**
- Small label: Also called: companion care
- Promise: Company, conversation and getting out of the house.
- Bullets:
  - Conversation and good company
  - Games, puzzles and music
  - Walks and time outdoors
  - Hobbies they love
- Link: **See Companionship →** `/care/companionship`

**Respite Care**
- Small label: Also called: respite
- Promise: A break for you. Your loved one keeps their routine.
- Bullets:
  - A few hours, a weekend or longer
  - Time to rest, work or travel
  - Their routine stays the same
  - Regular or one-time breaks
- Link: **See Respite Care →** `/care/respite-care`

**24-Hour & Overnight Care**
- Small label: Also called: round-the-clock care
- Promise: Someone there, day and night.
- Bullets:
  - Overnight care
  - Safe nighttime bathroom trips
  - Support after a fall or hospital stay
  - Shifts covered 7 days a week
- Link: **See 24-Hour & Overnight Care →** `/care/24-hour-care`

---

## 02 — "Most families combine services"

**Eyebrow:** 02 — Your care plan

**Headline (H2):**
> Most families combine services.

**Subline:**
> Your plan mixes the help your loved one needs. You don't have to pick just one.

**Venn visual** (three overlapping circles, `role="img"`):
- Circles: **Personal Care** · **Home Help** · **Companionship**
- Center overlap label: **Your care plan**
- Accessible name: A diagram of three overlapping circles: Personal Care, Home Help and Companionship. Where they overlap is your care plan.
- On hover/focus of a circle: that circle brightens and its service link shows (cursor label `Open`). Reduced motion: no brightening, links always visible below.

**Caption under the visual:**
> Respite Care and 24-Hour Care are about *when* and *how long*. Each one can include any of the help above.

**Examples (H3 heading: "A few examples")** — list, each item links to both services:
- **Home from the hospital:** Personal Care + Home Help
- **Living alone and a little lonely:** Companionship + Home Help
- **You're the main caregiver and running on empty:** Respite Care + Personal Care
- **Not safe alone at night:** 24-Hour & Overnight Care + Personal Care

**Small line:**
> These are examples, not packages. We build your plan together at the free visit.

---

## 03 — Quiz CTA

**Eyebrow:** 03 — Find the right care

**Headline (H2):**
> Not sure what you need?

**Subline:**
> Most families aren't. Answer five quick questions and we'll suggest a plan.

**Microcopy:**
> About 1 minute · No email needed

**Button:** Primary — **Find the right care** → `/find-care`

---

## 04 — What we don't do

**Eyebrow:** 04 — Honest answers

**Headline (H2):**
> What we don't do.

**Body:**
> All our care is non-medical. We don't give injections, change wound dressings or provide nursing.
>
> That kind of care is called home health, and it usually comes from nurses or therapists ordered by a doctor. Many families use both. We're happy to work alongside your home health or hospice team.

**Small comparison (two columns, `<table>` with caption "Home care and home health, side by side"):**

| | **Home care (what we do)** | **Home health** |
|---|---|---|
| Who provides it | Caregivers | Nurses and therapists |
| What it covers | Bathing, dressing, meals, housekeeping, company, medication reminders | Wound care, injections, therapy, medical treatment |
| How it starts | You call us | Usually a doctor's order |

**Hospice line (hidden until confirmed):**
> Already working with a hospice or palliative team? We can provide non-medical comfort and companionship alongside them. `[[TO CONFIRM: hospice/palliative support]]`

**Text link:** **Read more questions families ask** → `/faq#home-care-vs-home-health`

---

## CTA band

Surface: Dusk band (same as Home ch. 14).

**Headline (H2, display-l):**
> Let's talk about your *family*.

**Subline:**
> One call. One free visit at home. No pressure.

**Buttons:**
- Primary: **Get a Free Care Assessment** → `/free-assessment` (after hours: **Request a Callback**)
- Ghost (cream): **Call (843) 379-3321** → `tel:+18433793321` · cursor label `Call`
- Ghost (cream): **Text us (866) 632-9766** → `sms:+18666329766`

**Hours line (always both, always labelled):**
> **Care:** 24 hours a day, 7 days a week
> **Office:** Monday–Friday, 8 AM–5 PM

**After-hours line (above the buttons when closed):**
> Our office is closed right now. Request a callback and we'll reach you first thing {nextOpen}.

---
---

# PERSONAL CARE — /care/personal-care

## Page meta

- **Title:** Personal Care at Home in Beaufort, SC | Dawson & Dawson
- **Meta description:** Gentle, non-medical help with bathing, dressing, toileting and moving safely at home. Owner-run in Beaufort, SC since 2002. Free home visit.

**Breadcrumb:** Home › Care › Personal Care

---

## 1. Hero

**Eyebrow:** Care services
**Small label (under eyebrow):** Also called: help with daily living (ADLs)

**Headline (H1):**
> Personal care, done with *dignity*.

**Subline (lead):**
> Gentle help with bathing, dressing, the bathroom and moving around the house — so your loved one can stay home and stay themselves.

**Buttons:**
- Primary: **Get a Free Care Assessment** → `/free-assessment?service=personal-care` (after hours: **Request a Callback**)
- Secondary: **Call (843) 379-3321** → `tel:+18433793321` · cursor label `Call`

**Microcopy under buttons:**
> Free visit at home. No obligation.

**Trust row:**
> Since 2002 · Owner-run · Care 24/7

**Image:** `service-personal-care.jpg` (3:2)
- Alt: A Dawson caregiver helping an older woman button her cardigan.
- Placeholder label: "Help with dressing · 3:2"

---

## 2. Is this right for you?

**Eyebrow:** 01 — Is this right for you?

**Headline (H2):**
> This helps if…

**Instruction:**
> Tick any that sound familiar.

**Checklist** (id → label):
- `pc-bathing` — Showering or bathing has started to feel risky.
- `pc-dressing` — Getting dressed takes ages, or buttons and zippers are hard.
- `pc-transfers` — Getting out of bed or up from a chair is a struggle.
- `pc-toileting` — A little help in the bathroom would make life easier.
- `pc-hospital` — They're coming home from the hospital and need a hand for a while.

Result line + button: see §0.

**Fallback link:**
> Not sure this is the one? **Take the 1-minute quiz** → `/find-care`

---

## 3. What's included

**Eyebrow:** 02 — What's included

**Headline (H2):**
> What we help with.

**Icon grid** (icon `aria-hidden`; H3 + one line):

| Icon brief | H3 | Line |
|---|---|---|
| Folded towel | **Bathing & showering** | Washing, drying and getting in and out of the tub or shower safely. |
| Comb and razor | **Grooming** | Shaving, brushing teeth, hair care — ready for the day. |
| Cardigan with buttons | **Dressing** | Buttons, zippers, shoes and socks. They choose the outfit. |
| Bathroom door | **Using the bathroom** | Toileting and continence care, handled calmly and privately. |
| Plate and spoon | **Mealtimes** | Help eating, from the first bite to the last, at their own pace. |
| Walker and chair | **Moving safely** | Bed to chair, chair to wheelchair, room to room — a steady hand every step. |

**What this doesn't include (small bordered note, H3):**
> **What Personal Care doesn't include**
> All our care is non-medical. We don't give injections, change wound dressings or provide nursing. If your loved one needs that, we're happy to work alongside your home health or hospice team.

---

## 4. A day with Dawson

**Eyebrow:** 03 — A day with Dawson

**Headline (H2):**
> What a day of personal care can look like.

**Subline:**
> An example with a morning and an evening visit. Every plan is built around your loved one.

**Timeline:**
1. **8:00 AM — Good morning**
   The caregiver arrives, puts the coffee on and asks Mom how she slept.
2. **8:30 AM — A warm shower**
   Towels ready, water just right. She does what she can. We help with the rest.
3. **9:15 AM — Dressed for the day**
   She picks the outfit. We help with buttons, shoes and hair.
4. **9:45 AM — Breakfast together**
   A good breakfast, eaten at her pace, with someone to talk to.
5. **10:30 AM — Settled in**
   A steady arm to her favorite chair, everything she needs within reach.
6. **7:00 PM — Evening visit**
   Washing up, into pajamas and safely into bed. Lights low, phone by the bed.

---

## 5. How we keep it safe & dignified

**Eyebrow:** 04 — Safe and dignified

**Headline (H2):**
> Help that never feels like a takeover.

**Three points** (H3 + body):

**Their way, at their pace**
> We ask before we help, and let your loved one do what they can. Doors closed, towels ready, privacy first.

**Planned at home, by the owner**
> Our owner visits first, sees how the home is set up and builds the plan with you — down to how they like their mornings.

**Experienced hands, always checked on**
> Our caregivers are experienced, and our team includes Certified Nursing Assistants. We follow up regularly and adjust the plan as needs change.

---

## 6. Pairs well with

**Eyebrow:** 05 — Pairs well with

**Headline (H2):**
> Pairs well with.

**Cards** (H3 + line + link, cursor label `Open`):
- **Home Help** — Meals, laundry and medication reminders on the same visit. → **See Home Help** `/care/home-help`
- **24-Hour & Overnight Care** — When help is needed at night too. → **See 24-Hour & Overnight Care** `/care/24-hour-care`

---

## 7. What it costs

**Eyebrow:** 06 — Cost

**Headline (H2):**
> What does personal care cost?

**Body:**
> It depends on how many hours of help you need. Try our estimator — we've started it at an example schedule of 3 hours a day, 5 days a week. Change it to match yours.

**Button:** Ghost — **Estimate your cost** → `/paying-for-care?service=personal-care&hours=3&days=5&overnight=0#estimator`

**Small lines:**
> Your exact rate is set at your free assessment.
> Visits start at [[TO CONFIRM: minimum hours]] hours. *(hidden until confirmed)*

**Text link:** **See ways families pay for care** → `/paying-for-care#ways-to-pay`

---

## 8. Service FAQ

**Eyebrow:** 07 — Questions

**Headline (H2):**
> Questions about personal care.

**Accordion** (question = H3 button; IDs are deep links):

**Mom is very private. Will this embarrass her?** `#pc-privacy`
> We understand — it's the most common worry we hear. Your caregiver asks before helping, keeps her covered and lets her do whatever she can on her own. Many clients find it easier to accept help from a kind professional than from their own children.

**Can you help if Dad uses a walker or wheelchair?** `#pc-mobility`
> Yes. We help with moving from bed to chair, chair to wheelchair and room to room. At the free visit, our owner looks at how the home is set up so we can plan safe moves. `[[TO CONFIRM: experience with mechanical lifts (e.g. Hoyer) — add one sentence if yes]]`

**Is personal care the same as nursing?** `#pc-not-nursing`
> No. Personal care is non-medical help with everyday things like bathing, dressing and using the bathroom. We don't give injections, change wound dressings or provide nursing. If your loved one needs medical care, we work alongside your home health team.

**Can you start when Mom comes home from the hospital?** `#pc-hospital`
> Yes — the first days home are when many families call us. If you can, call before discharge so we can plan the visit. How soon care can start: `[[TO CONFIRM: typical start time]]`.

**How long is a personal care visit?** `#pc-visit-length`
> As long as you need. Some families want a morning visit for bathing and dressing. Others add an evening visit or longer days. Visits start at `[[TO CONFIRM: minimum hours]]` hours.

---

## 9. Review + CTA band

**Review:** see §0 (filter `service = personal-care`).

**CTA band** (Dusk):

**Headline (H2, display-l):**
> Let's make mornings *easier*.

**Subline:**
> One call. One free visit at home. No pressure.

**Buttons:**
- Primary: **Get a Free Care Assessment** → `/free-assessment?service=personal-care` (after hours: **Request a Callback**)
- Ghost (cream): **Call (843) 379-3321** → `tel:+18433793321` · cursor label `Call`
- Ghost (cream): **Text us (866) 632-9766** → `sms:+18666329766`

**Hours line:**
> **Care:** 24 hours a day, 7 days a week
> **Office:** Monday–Friday, 8 AM–5 PM

**After-hours line (when closed):**
> Our office is closed right now. Request a callback and we'll reach you first thing {nextOpen}.

---
---

# HOME HELP — /care/home-help

## Page meta

- **Title:** Home Help & Homemaker Care in Beaufort, SC | Dawson & Dawson
- **Meta description:** Meals, laundry, light housekeeping, errands and medication reminders at home in Beaufort, SC. Owner-run since 2002. Book a free home visit.

**Breadcrumb:** Home › Care › Home Help

---

## 1. Hero

**Eyebrow:** Care services
**Small label:** Also called: homemaker care

**Headline (H1):**
> Home help that keeps the house *running*.

**Subline (lead):**
> Meals, laundry, errands and medication reminders — the everyday things that keep a home safe, comfortable and theirs.

**Buttons:**
- Primary: **Get a Free Care Assessment** → `/free-assessment?service=home-help` (after hours: **Request a Callback**)
- Secondary: **Call (843) 379-3321** → `tel:+18433793321` · cursor label `Call`

**Microcopy under buttons:**
> Free visit at home. No obligation.

**Trust row:**
> Since 2002 · Owner-run · Care 24/7

**Image:** `service-home-help.jpg` (3:2)
- Alt: A Dawson caregiver and an older man cooking together in his kitchen.
- Placeholder label: "Cooking together · 3:2"

---

## 2. Is this right for you?

**Eyebrow:** 01 — Is this right for you?

**Headline (H2):**
> This helps if…

**Instruction:**
> Tick any that sound familiar.

**Checklist:**
- `hh-meals` — The fridge is nearly empty, or meals are mostly snacks.
- `hh-house` — Laundry and dishes are piling up.
- `hh-meds` — Pills get missed or taken twice.
- `hh-errands` — Grocery runs and errands have become hard.
- `hh-appointments` — Getting to appointments is a worry.

Result line + button: see §0.

**Fallback link:**
> Not sure this is the one? **Take the 1-minute quiz** → `/find-care`

---

## 3. What's included

**Eyebrow:** 02 — What's included

**Headline (H2):**
> What we help with.

**Icon grid:**

| Icon brief | H3 | Line |
|---|---|---|
| Pot on a stove | **Meals** | Planning, cooking and cleaning up — food they actually enjoy. |
| Laundry basket | **Laundry & linens** | Washing, folding, putting away and fresh sheets on the bed. |
| Broom and dustpan | **Light housekeeping** | Dishes, tidying, wiping down — a safe, clutter-free home. |
| Grocery bag | **Groceries & errands** | Shopping, prescriptions to pick up and the little jobs in town. |
| Weekly pill organizer | **Medication reminders** | A friendly reminder at the right time. They take their own medicine. |
| Calendar with a check | **Appointments** | Going along to appointments so they're not on their own. `[[TO CONFIRM: do caregivers drive clients? If yes: "Rides to appointments and back."]]` |

**What this doesn't include (small bordered note, H3):**
> **What Home Help doesn't include**
> We remind — we don't give medication, fill pill organizers or manage prescriptions. Our housekeeping is light, everyday help, not deep cleaning or heavy jobs. All our care is non-medical.

`[[TO CONFIRM: can caregivers fill weekly pill organizers? If yes, remove "fill pill organizers" from this note.]]`

---

## 4. A day with Dawson

**Eyebrow:** 03 — A day with Dawson

**Headline (H2):**
> What a home help visit can look like.

**Subline:**
> An example of a four-hour midday visit. Every plan is built around your loved one.

**Timeline:**
1. **10:00 AM — Catching up**
   The caregiver checks in with Dad and looks at what the week needs.
2. **10:15 AM — Laundry on**
   Sheets in the wash. A grocery list made together at the kitchen table.
3. **11:00 AM — Out for groceries**
   The things on his list — plus the pecans he forgot to write down.
4. **12:00 PM — Lunch and a reminder**
   A hot lunch. A reminder for his noon pills, which he takes himself.
5. **1:00 PM — The house, sorted**
   Dishes done, sheets folded, fresh bed made, floors clear.
6. **1:45 PM — Dinner ready to go**
   A plate in the fridge, labeled, so supper is easy tonight.

---

## 5. How we keep it safe & dignified

**Eyebrow:** 04 — Safe and dignified

**Headline (H2):**
> Their home, their way.

**Three points:**

**We follow their routines**
> Where the mugs go, how they like their eggs, which towels are "for guests." We learn it and keep it that way.

**A safer home, quietly**
> A clear floor, a stocked fridge and pills taken on time make a real difference. We keep an eye out and let you know if something changes.

**The owner stays involved**
> Our owner builds the plan at your free visit and keeps checking in. If needs change, the plan changes too.

---

## 6. Pairs well with

**Eyebrow:** 05 — Pairs well with

**Headline (H2):**
> Pairs well with.

**Cards:**
- **Companionship** — Someone to talk to while the chores get done. → **See Companionship** `/care/companionship`
- **Personal Care** — Help with bathing and dressing on the same visit. → **See Personal Care** `/care/personal-care`

---

## 7. What it costs

**Eyebrow:** 06 — Cost

**Headline (H2):**
> What does home help cost?

**Body:**
> It depends on how many hours of help you need. Try our estimator — we've started it at an example schedule of 4 hours a day, 3 days a week. Change it to match yours.

**Button:** Ghost — **Estimate your cost** → `/paying-for-care?service=home-help&hours=4&days=3&overnight=0#estimator`

**Small lines:**
> Your exact rate is set at your free assessment.
> Visits start at [[TO CONFIRM: minimum hours]] hours. *(hidden until confirmed)*

**Text link:** **See ways families pay for care** → `/paying-for-care#ways-to-pay`

---

## 8. Service FAQ

**Eyebrow:** 07 — Questions

**Headline (H2):**
> Questions about home help.

**Can your caregiver give Dad his medication?** `#hh-medication`
> We give medication reminders — a friendly nudge at the right time so he takes his own medicine. We don't give medication or manage prescriptions. If he needs someone to give medicine, ask his doctor or home health team, and we'll happily work alongside them.

**Do you do deep cleaning?** `#hh-cleaning`
> Our housekeeping is light, everyday help: dishes, laundry, tidying and keeping floors clear. For deep cleaning or big jobs, a cleaning service is a better fit.

**Can you take Mom to her doctor's appointments?** `#hh-appointments`
> Yes, a caregiver can go with her so she isn't on her own. `[[TO CONFIRM: do caregivers drive clients in their own car or the client's car? Replace this sentence with the confirmed answer.]]`

**Can you cook for her diet?** `#hh-meals`
> Yes. We cook what she likes and follow any eating guidance from her doctor or family. Tell us at the free visit and we'll build it into the plan.

**Do I need to be there during visits?** `#hh-family-away`
> No. Many families we help don't live nearby. At the free visit, we'll agree how the caregiver gets in and how we keep you updated.

---

## 9. Review + CTA band

**Review:** see §0 (filter `service = home-help`).

**CTA band** (Dusk):

**Headline (H2, display-l):**
> Let's take a few things off *your* list.

**Subline:**
> One call. One free visit at home. No pressure.

**Buttons:**
- Primary: **Get a Free Care Assessment** → `/free-assessment?service=home-help` (after hours: **Request a Callback**)
- Ghost (cream): **Call (843) 379-3321** → `tel:+18433793321` · cursor label `Call`
- Ghost (cream): **Text us (866) 632-9766** → `sms:+18666329766`

**Hours line:**
> **Care:** 24 hours a day, 7 days a week
> **Office:** Monday–Friday, 8 AM–5 PM

**After-hours line (when closed):**
> Our office is closed right now. Request a callback and we'll reach you first thing {nextOpen}.

---
---

# COMPANIONSHIP — /care/companionship

## Page meta

- **Title:** Companion Care for Seniors in Beaufort, SC | Dawson & Dawson
- **Meta description:** Friendly company, conversation, walks, games and outings for older adults at home in Beaufort, SC. Owner-run since 2002. Free home visit.

**Breadcrumb:** Home › Care › Companionship

---

## 1. Hero

**Eyebrow:** Care services
**Small label:** Also called: companion care

**Headline (H1):**
> Companionship that brightens the *week*.

**Subline (lead):**
> Good conversation, a game of cards, a walk outside. Company that gives your loved one something to look forward to.

**Buttons:**
- Primary: **Get a Free Care Assessment** → `/free-assessment?service=companionship` (after hours: **Request a Callback**)
- Secondary: **Call (843) 379-3321** → `tel:+18433793321` · cursor label `Call`

**Microcopy under buttons:**
> Free visit at home. No obligation.

**Trust row:**
> Since 2002 · Owner-run · Care 24/7

**Image:** `service-companionship.jpg` (3:2)
- Alt: A Dawson caregiver and an older woman playing cards at a kitchen table.
- Placeholder label: "Playing cards · 3:2"

---

## 2. Is this right for you?

**Eyebrow:** 01 — Is this right for you?

**Headline (H2):**
> This helps if…

**Instruction:**
> Tick any that sound familiar.

**Checklist:**
- `co-lonely` — They spend most days alone.
- `co-quiet` — They've stopped going out or seeing friends.
- `co-calls` — Your phone calls are the main conversation of their day.
- `co-hobbies` — They've let go of hobbies they used to love.
- `co-worry` — You'd feel better knowing someone stops by.

Result line + button: see §0.

**Fallback link:**
> Not sure this is the one? **Take the 1-minute quiz** → `/find-care`

---

## 3. What's included

**Eyebrow:** 02 — What's included

**Headline (H2):**
> What we do together.

**Icon grid:**

| Icon brief | H3 | Line |
|---|---|---|
| Two coffee cups | **Conversation** | Real talk, good listening and stories worth hearing twice. |
| Playing cards | **Games & puzzles** | Cards, board games, crosswords — a little friendly competition. |
| Walking path | **Walks** | A daily walk around the neighborhood or out to the porch. |
| Tree and bench | **Time outdoors** | Fresh air, trips to the park and a change of scenery. `[[TO CONFIRM: transport — see Q3 below]]` |
| Record player | **Hobbies & music** | Gardening, baking, old records, photo albums — whatever they love. |
| Rocking chair | **Simply being there** | Sometimes the best help is a friendly face in the next chair. |

**What this doesn't include (small bordered note, H3):**
> **What Companionship doesn't include**
> Companionship doesn't include hands-on help like bathing or dressing — that's Personal Care, and it's easy to add. All our care is non-medical.

---

## 4. A day with Dawson

**Eyebrow:** 03 — A day with Dawson

**Headline (H2):**
> What a companionship visit can look like.

**Subline:**
> An example of an afternoon visit. Every plan is built around your loved one.

**Timeline:**
1. **1:00 PM — Lunch for two**
   Sandwiches on the porch and the latest news from the family.
2. **1:45 PM — A walk around the block**
   Slow and steady, stopping to say hello to the neighbors.
3. **2:30 PM — The card table**
   Rummy, best of three. She's winning, as usual.
4. **3:30 PM — The photo albums**
   Stories about the old house, the wedding, the grandkids.
5. **4:15 PM — A call to the family**
   A video call with the grandkids, set up and ready to go.
6. **4:45 PM — See you Thursday**
   Tea made, TV on, and something to look forward to.

---

## 5. How we keep it safe & dignified

**Eyebrow:** 04 — Safe and dignified

**Headline (H2):**
> A friend, not a babysitter.

**Three points:**

**Built around who they are**
> At the free visit, our owner gets to know your loved one — their stories, interests and favorite things — so visits feel natural from day one.

**The right match**
> We choose a caregiver who fits your loved one's personality and schedule. If it's not the right fit, tell us and we'll make it right.

**An extra set of eyes**
> Regular visits mean someone notices if something changes. We follow up with you and adjust the plan when needs grow.

`[[TO CONFIRM: "If it's not the right fit, tell us and we'll make it right" — confirm the agency will re-match caregivers on request.]]`

---

## 6. Pairs well with

**Eyebrow:** 05 — Pairs well with

**Headline (H2):**
> Pairs well with.

**Cards:**
- **Home Help** — Lunch cooked, laundry done and a good chat, all in one visit. → **See Home Help** `/care/home-help`
- **Respite Care** — Company for Mom while you take a well-earned break. → **See Respite Care** `/care/respite-care`

---

## 7. What it costs

**Eyebrow:** 06 — Cost

**Headline (H2):**
> What does companionship cost?

**Body:**
> It depends on how many hours you'd like. Try our estimator — we've started it at an example schedule of 3 hours a day, 2 days a week. Change it to match yours.

**Button:** Ghost — **Estimate your cost** → `/paying-for-care?service=companionship&hours=3&days=2&overnight=0#estimator`

**Small lines:**
> Your exact rate is set at your free assessment.
> Visits start at [[TO CONFIRM: minimum hours]] hours. *(hidden until confirmed)*

**Text link:** **See ways families pay for care** → `/paying-for-care#ways-to-pay`

---

## 8. Service FAQ

**Eyebrow:** 07 — Questions

**Headline (H2):**
> Questions about companionship.

**Is companionship "real" care?** `#co-real-care`
> Yes. Loneliness is hard on anyone, and a regular friendly visit can lift a whole week. Companionship also means someone is checking in — and noticing if something changes.

**Can we start with just a few hours a week?** `#co-few-hours`
> Yes. Many families start small, with a visit or two a week, and add more later if needed. Visits start at `[[TO CONFIRM: minimum hours]]` hours.

**Can you take Mom out — to the park, church or lunch?** `#co-outings`
> Yes, getting out is a big part of companionship. `[[TO CONFIRM: do caregivers drive clients? Replace this sentence with how outings and transport work.]]`

**What if Dad doesn't want "help"?** `#co-reluctant`
> That's very common. Companionship is often the easiest way to start, because it doesn't feel like help — it feels like a new friend. Our owner can suggest gentle ways to introduce the idea at the free visit.

**Do you help people with memory loss?** `#co-memory` *(hidden until confirmed)*
> `[[TO CONFIRM: dementia/Alzheimer's support — do not publish this question until confirmed. Do not add as a service.]]`

---

## 9. Review + CTA band

**Review:** see §0 (filter `service = companionship`).

**CTA band** (Dusk):

**Headline (H2, display-l):**
> Let's bring some *company* back into the week.

**Subline:**
> One call. One free visit at home. No pressure.

**Buttons:**
- Primary: **Get a Free Care Assessment** → `/free-assessment?service=companionship` (after hours: **Request a Callback**)
- Ghost (cream): **Call (843) 379-3321** → `tel:+18433793321` · cursor label `Call`
- Ghost (cream): **Text us (866) 632-9766** → `sms:+18666329766`

**Hours line:**
> **Care:** 24 hours a day, 7 days a week
> **Office:** Monday–Friday, 8 AM–5 PM

**After-hours line (when closed):**
> Our office is closed right now. Request a callback and we'll reach you first thing {nextOpen}.

---
---

# RESPITE CARE — /care/respite-care

## Page meta

- **Title:** Respite Care in Beaufort, SC | Dawson & Dawson
- **Meta description:** Take a break from caregiving. Dawson steps in for a few hours, a weekend or longer while your loved one keeps their routine. Beaufort, SC since 2002.

**Breadcrumb:** Home › Care › Respite Care

---

## 1. Hero

**Eyebrow:** Care services
**Small label:** Also called: respite

**Headline (H1):**
> Respite care that gives you a real *break*.

**Subline (lead):**
> Caring for someone you love is hard work. We step in for a few hours, a weekend or longer — so you can rest, and your loved one keeps their routine.

**Buttons:**
- Primary: **Get a Free Care Assessment** → `/free-assessment?service=respite-care` (after hours: **Request a Callback**)
- Secondary: **Call (843) 379-3321** → `tel:+18433793321` · cursor label `Call`

**Microcopy under buttons:**
> Free visit at home. No obligation.

**Trust row:**
> Since 2002 · Owner-run · Care 24/7

**Image:** `service-respite.jpg` (3:2)
- Alt: A woman relaxing with a book on the porch while a Dawson caregiver sits with her father inside.
- Placeholder label: "A break for the family · 3:2"

---

## 2. Is this right for you?

**Eyebrow:** 01 — Is this right for you?

**Headline (H2):**
> This helps if…

**Instruction:**
> Tick any that sound familiar.

**Checklist:**
- `re-tired` — You're the main caregiver and you're running on empty.
- `re-dayoff` — You can't remember your last full day off.
- `re-work` — Work, kids or your own health need more of you.
- `re-travel` — There's a trip, wedding or event you don't want to miss.
- `re-backup` — You need someone you trust on call for the days you can't be there.

Result line + button: see §0.

**Fallback link:**
> Not sure this is the one? **Take the 1-minute quiz** → `/find-care`

---

## 3. What's included

**Eyebrow:** 02 — What's included

**Headline (H2):**
> What respite care covers.

**Intro line:**
> While you're away, we do what you'd do. That can include any of our care.

**Icon grid:**

| Icon brief | H3 | Line |
|---|---|---|
| Clock | **A few hours** | Time for an appointment, a nap or coffee with a friend. |
| Calendar weekend | **A weekend or longer** | Care around the clock while you travel or recharge. |
| Repeating arrows | **Regular breaks** | A standing afternoon off every week — something to count on. |
| Daily planner | **Their routine, kept** | Meals, pills on time, their shows, their bedtime — just how you do it. |
| Hand on shoulder | **Personal care** | Bathing, dressing and the bathroom, if they need it. |
| Two coffee cups | **Company** | Conversation, games and walks, so the time flies for them too. |

**What this doesn't include (small bordered note, H3):**
> **What Respite Care doesn't include**
> All our care is non-medical. We don't give injections, change wound dressings or provide nursing. If your loved one has a home health or hospice team, we work alongside them.

---

## 4. A day with Dawson

**Eyebrow:** 03 — A day with Dawson

**Headline (H2):**
> A Saturday off — for both of you.

**Subline:**
> An example of a full-day respite visit. Every plan is built around your family.

**Timeline** (two labelled lines per step — **Dad:** and **You:** — both read in order by screen readers):
1. **9:00 AM — The handoff**
   Dad: Coffee with a caregiver he already met at the free visit.
   You: Out the door, with nothing to remember. It's all in the plan.
2. **10:30 AM — Morning**
   Dad: A walk around the block and his crossword.
   You: A long, slow breakfast somewhere you haven't been in years.
3. **12:30 PM — Lunch**
   Dad: His usual — and a reminder for his midday pills.
   You: Lunch with an old friend. Phone face down on the table.
4. **2:00 PM — Afternoon**
   Dad: A nap, then the ballgame on TV.
   You: Whatever you want. That's the point.
5. **5:00 PM — Welcome home**
   Dad: Settled, fed and in a good mood.
   You: A quick update on his day, and a little more of yourself back.

`[[TO CONFIRM: "a caregiver he already met at the free visit" — confirm whether the caregiver can attend the assessment or a meet-and-greet. If not, use: "Coffee with his caregiver, who already knows his routine from the plan."]]`

---

## 5. How we keep it safe & dignified

**Eyebrow:** 04 — Safe and dignified

**Headline (H2):**
> Leave with peace of mind.

**Three points:**

**Nothing changes for them**
> We follow the routine you've built — meals, medication reminders, bedtime, the little things that keep them calm.

**Planned before you go**
> Our owner visits first and writes down what matters: how they like their coffee, what helps on a hard day, who to call.

**You're never out of reach**
> We keep you updated in the way you prefer, and we'll call you right away if anything comes up.

---

## 6. Pairs well with

**Eyebrow:** 05 — Pairs well with

**Headline (H2):**
> Pairs well with.

**Cards:**
- **Personal Care** — Hands-on help with bathing and dressing while you're away. → **See Personal Care** `/care/personal-care`
- **24-Hour & Overnight Care** — For trips and weekends when someone needs to be there at night. → **See 24-Hour & Overnight Care** `/care/24-hour-care`

---

## 7. What it costs

**Eyebrow:** 06 — Cost

**Headline (H2):**
> What does respite care cost?

**Body:**
> It depends on how long your break is. Try our estimator — we've started it at an example of one 8-hour day a week. Change it to match yours, or turn on overnight care for a weekend away.

**Button:** Ghost — **Estimate your cost** → `/paying-for-care?service=respite-care&hours=8&days=1&overnight=0#estimator`

**Small lines:**
> Your exact rate is set at your free assessment.
> Visits start at [[TO CONFIRM: minimum hours]] hours. *(hidden until confirmed)*

**Text link:** **See ways families pay for care** → `/paying-for-care#ways-to-pay`

---

## 8. Service FAQ

**Eyebrow:** 07 — Questions

**Headline (H2):**
> Questions about respite care.

**How long can respite care last?** `#re-length`
> As long as you need — a few hours, a full day, a weekend or longer. Care is available 24 hours a day, 7 days a week, so we can cover nights too.

**Can I book a regular break, not just emergencies?** `#re-regular`
> Yes. Many caregivers set up a standing afternoon or day off each week. It's easier to keep going when you know a break is coming.

**Will Dad be OK with someone new?** `#re-new-person`
> It's normal to worry. Our owner meets him first at the free visit, and we choose a caregiver who fits his personality and routine. You're welcome to stay for the first visit until everyone's comfortable.

**How far ahead should I book?** `#re-booking`
> As early as you can, especially for holidays and trips. Call (843) 379-3321 and we'll do our best to help — even at short notice. `[[TO CONFIRM: typical notice needed]]`

**I feel guilty taking a break. Is that normal?** `#re-guilt`
> Very. But rest isn't selfish — it's how you keep caring for the people you love. A rested caregiver is a better caregiver.

---

## 9. Review + CTA band

**Review:** see §0 (filter `service = respite-care`).

**CTA band** (Dusk):

**Headline (H2, display-l):**
> You've earned a *break*.

**Subline:**
> One call. One free visit at home. No pressure.

**Buttons:**
- Primary: **Get a Free Care Assessment** → `/free-assessment?service=respite-care` (after hours: **Request a Callback**)
- Ghost (cream): **Call (843) 379-3321** → `tel:+18433793321` · cursor label `Call`
- Ghost (cream): **Text us (866) 632-9766** → `sms:+18666329766`

**Hours line:**
> **Care:** 24 hours a day, 7 days a week
> **Office:** Monday–Friday, 8 AM–5 PM

**After-hours line (when closed):**
> Our office is closed right now. Request a callback and we'll reach you first thing {nextOpen}.

---
---

# 24-HOUR & OVERNIGHT CARE — /care/24-hour-care

## Page meta

- **Title:** 24-Hour & Overnight Care in Beaufort, SC | Dawson & Dawson
- **Meta description:** Non-medical care day and night at home in Beaufort, SC. Overnight help, safe bathroom trips and support after a hospital stay. Owner-run since 2002.

**Breadcrumb:** Home › Care › 24-Hour & Overnight Care

---

## 1. Hero

**Eyebrow:** Care services
**Small label:** Also called: round-the-clock care

**Headline (H1):**
> 24-hour care, so someone's always *there*.

**Subline (lead):**
> Overnight help or care around the clock, 7 days a week. Your loved one stays safe at home — and you can finally sleep.

**Buttons:**
- Primary: **Get a Free Care Assessment** → `/free-assessment?service=24-hour-care` (after hours: **Request a Callback**)
- Secondary: **Call (843) 379-3321** → `tel:+18433793321` · cursor label `Call`

**Microcopy under buttons:**
> Free visit at home. No obligation.

**Hours clarifier (small, directly under the microcopy — this page must never blur the two):**
> **Care:** 24 hours a day, 7 days a week · **Office:** Monday–Friday, 8 AM–5 PM

**Trust row:**
> Since 2002 · Owner-run · Care 24/7

**Image:** `service-24-hour.jpg` (3:2)
- Alt: A calm, lamp-lit bedroom in the evening, with a caregiver reading in a chair near the bed.
- Placeholder label: "Evening, lamp-lit · 3:2"

---

## 2. Is this right for you?

**Eyebrow:** 01 — Is this right for you?

**Headline (H2):**
> This helps if…

**Instruction:**
> Tick any that sound familiar.

**Checklist:**
- `tf-night` — They get up at night and you worry about a fall.
- `tf-fall` — They've had a fall, or a close call, recently.
- `tf-hospital` — They're coming home from the hospital or rehab.
- `tf-alone` — They can't safely be alone for long.
- `tf-sleep` — You haven't slept through the night in weeks.

Result line + button: see §0. (Result line uses the service name "24-Hour & Overnight Care".)

**Fallback link:**
> Not sure this is the one? **Take the 1-minute quiz** → `/find-care`

---

## 3. What's included

**Eyebrow:** 02 — What's included

**Headline (H2):**
> What we help with.

**Two options first (two side-by-side cards, H3):**

**Overnight care**
> A caregiver through the night — help to bed, help to the bathroom and someone there until morning.

**24-hour care**
> Care around the clock, in shifts, so a rested caregiver is always there, day and night.

**Icon grid:**

| Icon brief | H3 | Line |
|---|---|---|
| Moon in a window | **Overnight support** | Someone in the home through the night, every night you need. |
| Night light by a door | **Safe bathroom trips** | A steady arm in the dark, then back to bed. |
| Pajamas on a hanger | **Bedtime & mornings** | Help getting ready for bed and getting up the next day. |
| House with a heart | **After a fall or hospital stay** | Extra support for the first days and weeks home. |
| Clock with arrows | **Shifts covered** | Day and night shifts, 7 days a week, weekends and holidays. |
| Everything icon (house) | **All our care** | Personal care, home help and company, any hour. |

**What this doesn't include (small bordered note, H3):**
> **What 24-Hour Care doesn't include**
> Our caregivers aren't nurses, and all our care is non-medical. We don't give injections, change wound dressings or provide nursing — day or night. If your loved one has a home health or hospice team, we work alongside them.

**Hospice line (hidden until confirmed):**
> Already working with a hospice or palliative team? We can provide non-medical comfort and companionship alongside them, day or night. `[[TO CONFIRM: hospice/palliative support]]`

---

## 4. A day with Dawson

**Eyebrow:** 03 — A night with Dawson

**Headline (H2):**
> What a night of care can look like.

**Subline:**
> An example of a night shift in 24-hour care. Every plan is built around your loved one.

**Timeline (evening → morning):**
1. **7:00 PM — Shift change**
   The day caregiver tells the night caregiver how Mom's day went.
2. **8:30 PM — Getting ready for bed**
   Washing up, into her nightgown, a cup of decaf and her favorite show.
3. **10:00 PM — Lights low**
   Tucked in, night light on, the walker right where she reaches for it.
4. **2:15 AM — A bathroom trip**
   She's up. A steady arm there and back, and she's asleep again in minutes.
5. **6:30 AM — Good morning**
   Up and dressed, coffee on, a slow start to the day.
6. **7:00 AM — Shift change**
   The night caregiver passes on how she slept. The day begins.

`[[TO CONFIRM: are overnight caregivers awake all night? This timeline assumes awake shifts (standard for 24-hour care). If Dawson also offers sleep-over overnight care, keep this timeline for 24-hour care and add one line under the subline: "With overnight care, your caregiver rests nearby and helps whenever needed."]]`

---

## 5. How we keep it safe & dignified

**Eyebrow:** 04 — Safe and dignified

**Headline (H2):**
> Calm nights, safer mornings.

**Three points:**

**A plan for the night**
> Our owner visits first and looks at the bedroom, the path to the bathroom and the night routine — then builds the plan around it.

**Rested caregivers, clear handoffs**
> 24-hour care is covered in shifts, so the person caring for your loved one is alert. Each caregiver passes on what the next one needs to know.

**You're kept in the loop**
> We follow up with you regularly and adjust the plan as needs change. If anything comes up overnight, we'll reach you the way you've asked us to.

`[[TO CONFIRM: after-hours line for existing clients — when confirmed, add: "Existing clients can reach us after hours at {afterHoursLine}."]]`

---

## 6. Pairs well with

**Eyebrow:** 05 — Pairs well with

**Headline (H2):**
> Pairs well with.

**Cards:**
- **Personal Care** — Help with bathing and dressing, morning and night. → **See Personal Care** `/care/personal-care`
- **Respite Care** — Overnight cover so the family caregiver can sleep or travel. → **See Respite Care** `/care/respite-care`

---

## 7. What it costs

**Eyebrow:** 06 — Cost

**Headline (H2):**
> What does 24-hour care cost?

**Body:**
> It depends on how many hours and nights you need. Try our estimator — we've started it at 24 hours a day, 7 days a week. Change it to match yours, like nights only.

**Button:** Ghost — **Estimate your cost** → `/paying-for-care?service=24-hour-care&hours=24&days=7&overnight=1#estimator`

**Small lines:**
> Your exact rate is set at your free assessment.

**Text link:** **See ways families pay for care** → `/paying-for-care#ways-to-pay`

---

## 8. Service FAQ

**Eyebrow:** 07 — Questions

**Headline (H2):**
> Questions about 24-hour and overnight care.

**What's the difference between overnight care and 24-hour care?** `#tf-difference`
> Overnight care covers the night — from bedtime to morning. 24-hour care covers the whole day and night, in shifts, so someone is always there. Many families start with nights and add days later.

**Does the caregiver stay awake all night?** `#tf-awake`
> `[[TO CONFIRM: awake vs sleep-over overnight shifts. Draft if awake: "Yes. Our overnight caregivers stay awake and alert, so help is there the moment it's needed."]]`

**Is a nurse there at night?** `#tf-nurse`
> No. Our care is non-medical, day and night. Our team includes Certified Nursing Assistants, but we don't provide nursing, injections or wound care. If your loved one needs medical care at home, we work alongside their home health team.

**Can you start right after a hospital stay?** `#tf-hospital`
> Yes. Coming home is when round-the-clock help matters most. If you can, call us before discharge so we can plan the first nights. How soon care can start: `[[TO CONFIRM: typical start time]]`.

**Can care cover weekends and holidays?** `#tf-weekends`
> Yes. Care is available 24 hours a day, 7 days a week, including weekends and holidays. Our office is open Monday to Friday, 8 AM to 5 PM.

`[[TO CONFIRM: live-in care — do not mention until confirmed.]]`

---

## 9. Review + CTA band

**Review:** see §0 (filter `service = 24-hour-care`).

**CTA band** (Dusk):

**Headline (H2, display-l):**
> Let's make nights feel *calm* again.

**Subline:**
> One call. One free visit at home. No pressure.

**Buttons:**
- Primary: **Get a Free Care Assessment** → `/free-assessment?service=24-hour-care` (after hours: **Request a Callback**)
- Ghost (cream): **Call (843) 379-3321** → `tel:+18433793321` · cursor label `Call`
- Ghost (cream): **Text us (866) 632-9766** → `sms:+18666329766`

**Hours line:**
> **Care:** 24 hours a day, 7 days a week
> **Office:** Monday–Friday, 8 AM–5 PM

**After-hours line (when closed):**
> Our office is closed right now. Request a callback and we'll reach you first thing {nextOpen}.

---
---

## Placeholder summary (for `npm run prelaunch`)

- Minimum visit hours (all service pages, cost sections and FAQs)
- Typical start time after first call / hospital discharge (Personal Care, 24-Hour FAQs)
- Typical booking notice for respite (Respite FAQ)
- Transport: do caregivers drive clients? (Home Help grid + FAQ, Companionship grid + FAQ)
- Can caregivers fill pill organizers? (Home Help "doesn't include" note)
- Mechanical lift experience (Personal Care FAQ)
- Caregiver re-match on request (Companionship safety point)
- Caregiver at the assessment / meet-and-greet (Respite timeline)
- Awake vs sleep-over overnight shifts (24-Hour timeline note + FAQ)
- Live-in care (24-Hour — not mentioned until confirmed)
- After-hours line for existing clients (24-Hour safety section)
- Hospice/palliative support line (Hub, 24-Hour)
- Memory loss / dementia FAQ (Companionship — hidden)
- Reviews per service (hidden until real)
