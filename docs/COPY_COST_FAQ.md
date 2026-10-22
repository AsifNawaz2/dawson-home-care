# COPY_COST_FAQ — Paying for Care + FAQ

**Status:** Final copy for design + build. Use verbatim.
**Pages:** `/paying-for-care` (Cost Estimator · Payment Explorer · Questions to ask any agency) · `/faq` (35 questions, 6 groups, live search)
**Data files (end of this doc):** `content/blocks.ts` (shared helper) · `content/payments.ts` · `content/faq.ts`
**Sources:** 04, 06, 07 (§2, §6, §14), 08, 09 (§2, §3), COPY_HOME.md (ch. 10 + ch. 13), COPY_SERVICES.md, COPY_TRUST.md. Public-program facts (Medicare, VA, SC Medicaid, Lowcountry AAA) checked against official sources on **19 Oct 2026** — re-check before launch (`checked` field on every external link).
**Reading level:** grade 6–8. **Voice:** warm, calm, plain, local. "Clients", never "patients".

---

## 0. Conventions (read first)

Everything in **COPY_HOME.md §0** applies: `{years}`, `{currentYear}`, `{officeStatus}`, `{nextOpen}`, `[[TO CONFIRM: …]]`, cursor labels, alt-text rule, after-hours CTA switch (**Get a Free Care Assessment** → **Request a Callback**, same destination, `after_hours=true`). The **Standard CTA band** is COPY_TRUST §0.

**Single source.** The Payment Explorer panels, "Not sure where to start?", "Free help nearby", the agency checklist and every FAQ answer below are rendered *from* `payments.ts` and `faq.ts`. The prose here is generated from those files, so they match word for word. Edit the data, not the page.

**Pending blocks.** Data uses three block types (see `blocks.ts`): a string (verified or approved copy — always renders), a list, and a **Pending** block `{ text, confirmed: false }` that holds a `[[TO CONFIRM …]]` token.
- `NEXT_PUBLIC_SHOW_PLACEHOLDERS=true` (localhost + the reveal): Pending blocks render as visible placeholders, so the client sees exactly what to fill in.
- Production (flag unset): Pending blocks never render. Every answer is written so it still reads correctly without them.
- An FAQ item with `hideUntilConfirmed: true` has no safe verified answer; the **whole question** is hidden in production until confirmed.
- `npm run prelaunch` lists every Pending block and every `confirmed: false` item.

In this file, Pending blocks are shown as *(hidden until confirmed)* followed by the token.

**Headings:** one H1 per page (the Hero). Section titles are H2. Payment panels, FAQ questions, checklist group titles and card titles are H3. Sub-labels inside a payment panel are H4.

**Eyebrow numbering:** Hero and CTA band are bookends. Sections in between are **01, 02, 03**.

**Phone numbers outside Dawson's own** (SCDHHS, Lowcountry AAA) are formatted the same way — `(888) 971-1637` → `tel:+18889711637` — and are never styled as Dawson CTAs (text links only, no `Call` cursor label).

**External links** open in the same tab and carry small text after the link: "goes to {site}" (COPY_TRUST pattern).

---
---

# PAYING FOR CARE — /paying-for-care

## Page meta

- **Title:** Paying for Home Care in Beaufort, SC | Dawson & Dawson
- **Meta description:** Estimate the cost of home care and see how families pay: private pay, long-term care insurance, VA benefits, Medicaid waivers — and what Medicare covers.

**Breadcrumb:** Home › Paying for Care

---

## 1. Hero

**Eyebrow:** Paying for care

**Headline (H1):**
> What care costs — and how families *pay* for it.

**Subline (lead):**
> Straight answers, no sales pitch. Estimate the hours, see the ways families pay, and ask us anything.

**Buttons:**
- Primary: **Get a Free Care Assessment** → `/free-assessment` (after hours: **Request a Callback**)
- Ghost: **Estimate your cost ↓** → `#estimator`

**Microcopy under buttons:**
> Free visit at home. No obligation.

**Jump bar** (`nav`, `aria-label="On this page"`; sticky under the header on desktop, a horizontal row on mobile; current section gets `aria-current="true"`):
> 1 Estimate your cost · 2 Ways to pay · 3 Questions to ask

---

## 01 — Cost Estimator

**Section ID:** `estimator` (deep link from Home ch. 10 and every service page)
**Eyebrow:** 01 — Estimate your cost

**Headline (H2):**
> Estimate your cost.

**Subline:**
> Move the controls to match the help you have in mind. You'll see the hours and a rough cost range. No email, no sign-up.

### Badge (while `rateConfirmed: false`)

> Illustrative estimate

Next to the badge, a small text button **What does this mean?** (`aria-expanded`) opens:
> These numbers are an example to help you plan. They're not a quote, and they're not Dawson's set prices. Your exact rate is set at your free assessment.
>
> Monthly figures use 4.33 weeks — the average number of weeks in a month.

### Prefill banner

Shown only when the page loads with `hours`/`days` params (from a service page, the quiz or Home). Polite, dismissible, above the controls.

| Source | Banner |
|---|---|
| Service page (`service={slug}`) | We've started this at an example for **{Service}**: {hours} hours a visit, {days} days a week{, with overnight care}. Change anything to match your plans. |
| Quiz (`from=quiz`) | We've started this from your quiz answer: **{quiz_hours label}**. Change anything to match your plans. |
| Home (`from=home`) | We've kept the numbers you chose on our home page. |

Button in the banner: **Start over** (resets to the default below).

**Default (no params):** 4 hours a visit × 3 days a week, overnight off → 12 hours a week. Home ch. 10's compact estimator uses the same default.

### Quick start

**Label:** Start from an example:

Toggle buttons (`aria-pressed`). Pressing one sets all three controls; any manual change un-presses it. Labels match quiz Q3 answers exactly, so `quiz_hours` maps 1:1.

| Button | Sets |
|---|---|
| **A few hours a week** | 3 hours × 2 days, overnight off |
| **A few hours most days** | 4 hours × 5 days, overnight off |
| **Full days** | 8 hours × 5 days, overnight off |
| **Around the clock** | 24 hours × 7 days, overnight on |

### Controls

| Control | Label | Helper (always visible) | Value / buttons |
|---|---|---|---|
| Slider 2–24, step 1 | **Hours per visit** | How long each visit lasts. Pick 24 for care around the clock. | Value: "{n} hours" · `aria-valuetext`: "{n} hours per visit" · buttons either side: **Fewer hours** / **More hours** (48px) · tick labels: 2 · 12 · 24 |
| Stepper 1–7 | **Days per week** | How many days a week someone comes. | Value: "{n} days" · buttons: **Fewer days** / **More days** |
| Toggle (`role="switch"`) | **Overnight or 24-hour care** | Turn on if someone needs to be there overnight or around the clock. | — |

Slider minimum becomes `minimumVisitHours` once confirmed. Helper under the slider (hidden until confirmed):
> Visits start at [[TO CONFIRM: minimum hours]] hours.

**Note when the toggle is on** (small, under the toggle):
> Overnight and 24-hour care can be priced differently from daytime visits. We'll confirm your rate at your free visit.

While `overnightRateMin/Max` are `null`, the math uses the standard range. When confirmed and different, the overnight range is used whenever the toggle is on.

**Hints** (one at a time, polite live region under the controls):

| When | Hint |
|---|---|
| Hours ≥ 12 and overnight off | Planning nights or long shifts? Turn on overnight or 24-hour care. |
| 24 hours × 7 days | That's care around the clock — 168 hours a week. It's covered in shifts, so a rested caregiver is always there. |

### Output

- Big number (count-up ≤ 400ms; reduced motion = final number): **{weeklyHours}** hours a week
- Range lines:
  - About **${weeklyMin}–${weeklyMax}** a week
  - About **${monthlyMin}–${monthlyMax}** a month
- Rounding: weekly to the nearest $10, monthly to the nearest $50. Thousands with commas ($2,150).
- Scale bar (0 → 168 hours, `aria-hidden`; the numbers carry the meaning): **A few hours** ↔ **Around the clock**
- Live region (polite, announced 500ms after input settles): "{weeklyHours} hours a week. About ${weeklyMin} to ${weeklyMax} a week."

**Disclaimer (always visible under the numbers):**
> Your exact rate is set at your free assessment.

**Hours-only mode** (if prices are hidden at the reveal) — replace the range lines with:
> Your rate is set at your free assessment — every plan is different.

### Buttons

- Primary: **Get your exact plan — free assessment** → `/free-assessment?hours={h}&days={d}&overnight={0|1}` (+ `&service={slug}` if present; after hours: **Request a Callback**)
- Text link: **Not sure how many hours? Take the 1-minute quiz** → `/find-care`
- Text link: **See ways families pay ↓** → `#ways-to-pay`

### What changes the cost — at any agency

**Heading (H3):**
> What changes the cost — at any agency

Three small cards (icon `aria-hidden` + bold title + one line):

**Hours and days**
> The biggest factor. More hours a week means a higher total — the estimator shows how much.

**Nights, weekends and holidays**
> Some agencies charge more at these times. Ask before care starts.

**Minimum visit length**
> Many agencies have a minimum number of hours per visit. A short visit may cost the same as a longer one.

**Text link:** **Questions to ask any agency ↓** → `#questions-to-ask`

### Not built

Home care vs assisted living comparison (07 §2): **not rendered** until confirmed data exists.

### Data sent with a lead (GHL)

`estimator_hours_per_visit` · `estimator_days_per_week` · `estimator_overnight` · `estimator_weekly_hours` · `estimator_preset` (`few-hours-week` | `few-hours-most-days` | `full-days` | `around-the-clock` | `custom`) · `estimator_source` (`paying-for-care` | `home` | `service:{slug}` | `quiz`)

---

## 02 — Payment Explorer

**Section ID:** `ways-to-pay` (deep link from Home ch. 10 and every service page)
**Eyebrow:** 02 — Ways to pay

**Headline (H2):**
> How families pay for home care.

**Subline:**
> Most families use one of these, or a mix. Pick one to see how it works — and what to ask.

### "Not sure where to start?" (above the tabs)

**Heading (H3):**
> Not sure where to start?

**Instruction:**
> Tick any that are true. We'll point you to the options worth a look.

**Checkboxes** (id → label → highlights tab):
- `nd-ltc` — They have a long-term care insurance policy → **Long-term care insurance**
- `nd-va` — They served in the military, or are the surviving spouse of a Veteran → **VA benefits**
- `nd-medicaid` — They have Medicaid, or very limited income and savings → **Medicaid waivers**
- `nd-medicare` — They have Medicare → **Medicare**

**Matching tabs get a chip:** Worth a look

**Result line** (polite live region, hidden at 0 ticks; `{options}` = matching tab names, joined "A, B and C"):
> Worth a look: {options}. Many families also pay privately for some or all of their care.

**Privacy line (small):**
> Your answers stay on this page. We don't save or send them.

### Explorer behavior

- **Desktop (≥ 900px):** WAI-ARIA Tabs, automatic activation, arrow keys + Home/End. Each tab shows its name and its chip (**Ask us** / **Usually not covered**, plus **Worth a look** when matched). Icon + words, never color alone. Panel change: 200ms crossfade; none in reduced motion.
- **Mobile:** the same five panels as an accordion — 56px header buttons with `aria-expanded`; several can be open at once.
- **Default open:** Private pay. If "Not sure where to start?" has matches, the first matching tab opens.
- **Deep links:** `#pay-private` · `#pay-ltc` · `#pay-va` · `#pay-medicaid` · `#pay-medicare` open that panel and move focus to its H3. `#ways-to-pay` scrolls to the section.
- **No JS:** all five panels render stacked, each with its H3.
- **Tracking:** each panel opened is added to sessionStorage `payment_explored`, sent with the lead as GHL field `payment_explored` (comma-separated ids). Panel CTAs add `?pay={id}` → assessment form hidden field `payment_interest`.

### The five panels

Panel order inside each: heading (H3) · summary · What it is · (VA: two route cards) · How it usually works · (Medicare: table) · Good to know · Does Dawson accept it? · Learn more · buttons.

### Private pay — `#pay-private`

**Tab label:** Private pay · **Tab chip:** Ask us

**Panel heading (H3):**
> Private pay

**Summary (under the heading):**
> Paying for care yourself. Simple, flexible and no waiting lists.

**What it is (H4)**
> You pay for care yourself — from savings, income or retirement money, or with help from family.

**How it usually works (H4)**

- You choose the help, the hours and the schedule. There are no approvals or waiting lists.
- You pay for the hours of care your loved one gets.
- You can add or cut hours as needs change.
- Some families share the cost between brothers and sisters.

- *(hidden until confirmed)* `[[TO CONFIRM: how often Dawson bills — e.g. weekly or every two weeks]]`

**Good to know (H4)**
> Some families can count part of the cost of care as a medical expense on their taxes. The rules are strict, so ask a tax professional.
>
> Private pay can also fill the gaps: many families use it alongside insurance or benefits that cover only some hours.

**Does Dawson accept it? (H4)** — chip: **Ask us** (switches to the confirmed answer at the reveal)
> Ask us. We'll explain your rate and how billing works at your free visit, before care begins.
>
> *(hidden until confirmed)* `[[TO CONFIRM: payment methods Dawson accepts — e.g. check, card, bank transfer]]`

**Buttons:**
- Primary: **Talk it through at your free assessment** → `/free-assessment?pay=private-pay` (after hours: **Request a Callback**)
- Ghost: **Call (843) 379-3321** → `tel:+18433793321` · cursor label `Call`

---

### Long-term care insurance — `#pay-ltc`

**Tab label:** Long-term care insurance · **Tab chip:** Ask us

**Panel heading (H3):**
> Long-term care insurance

**Summary (under the heading):**
> A private policy that may pay toward care at home.

**What it is (H4)**
> A private insurance policy, usually bought years earlier, that helps pay for care when someone needs help with daily life. Many policies cover care at home.

**How it usually works (H4)**

- The policy starts paying once your loved one needs help with everyday tasks — often two or more, like bathing and dressing — or has serious memory problems.
- There's usually a waiting period first, often 30, 60 or 90 days. You pay for care during that time. (Insurers call this the "elimination period.")
- After that, the policy pays up to a daily or monthly limit.
- Some policies pay you back after you've paid for care. Others pay the agency directly.
- The insurer usually asks for a care plan and records of the care given.

**Good to know (H4)**
> Find the policy and call the insurer early — before care starts if you can. Ask four things: what starts the benefits, how long the waiting period is, what the daily or monthly limit is, and whether care from a home care agency is covered.

**Does Dawson accept it? (H4)** — chip: **Ask us** (switches to the confirmed answer at the reveal)
> Ask us. Bring the policy, or the insurer's phone number, to your free visit and we'll go through it with you.
>
> *(hidden until confirmed)* `[[TO CONFIRM: does Dawson work with long-term care insurance — e.g. provide care notes and invoices for claims, or bill the insurer directly?]]`

**Buttons:**
- Primary: **Talk it through at your free assessment** → `/free-assessment?pay=ltc-insurance` (after hours: **Request a Callback**)
- Ghost: **Call (843) 379-3321** → `tel:+18433793321` · cursor label `Call`

---

### VA benefits — `#pay-va`

**Tab label:** VA benefits · **Tab chip:** Ask us

**Panel heading (H3):**
> VA benefits

**Summary (under the heading):**
> Help for Veterans, and some surviving spouses, who need care at home.

**What it is (H4)**
> Veterans — and in some cases their surviving spouses — may get help paying for care at home. There are two main routes.

**Two routes (two cards, H4 each)**

*Aid and Attendance (or Housebound)*
> Extra money added to a monthly VA pension. It's for Veterans and survivors who need another person's help with daily activities like bathing, eating and dressing, or who spend most of their time at home because of a permanent disability.
>
> You must qualify for a VA pension first. The money is paid to the Veteran or survivor, who can use it toward care.

Card link: **Aid and Attendance on VA.gov** → `https://www.va.gov/pension/aid-attendance-housebound/` · small text after the link: "goes to va.gov"

*Homemaker and Home Health Aide care*
> For Veterans enrolled in VA health care who need help with daily activities. The VA approves the help and the hours, and the care comes from an agency that has an agreement with the VA.
>
> To start, talk to your VA care team or a VA social worker.

Card link: **Homemaker and Home Health Aide care on VA.gov** → `https://www.va.gov/GERIATRICS/pages/Homemaker_and_Home_Health_Aide_Care.asp` · small text after the link: "goes to va.gov"

**How it usually works (H4)**

- Aid and Attendance: you apply to the VA, and a doctor fills in part of the form. Decisions can take time, so apply early.
- Homemaker and Home Health Aide care: the VA decides how many hours it will cover and which agency provides the care.

**Good to know (H4)**
> Your county Veterans Affairs office can help you apply. You shouldn't have to pay anyone to help you file for VA benefits.

**Does Dawson accept it? (H4)** — chip: **Ask us** (switches to the confirmed answer at the reveal)
> Ask us. We'll talk through which VA route might fit your family.
>
> *(hidden until confirmed)* `[[TO CONFIRM: is Dawson a VA community care provider for Homemaker and Home Health Aide care? Do families use Aid and Attendance to pay Dawson?]]`

**Buttons:**
- Primary: **Talk it through at your free assessment** → `/free-assessment?pay=va-benefits` (after hours: **Request a Callback**)
- Ghost: **Call (843) 379-3321** → `tel:+18433793321` · cursor label `Call`

---

### Medicaid waivers — `#pay-medicaid`

**Tab label:** Medicaid waivers · **Tab chip:** Ask us

**Panel heading (H3):**
> Medicaid waivers

**Summary (under the heading):**
> South Carolina Medicaid programs that pay for help at home.

**What it is (H4)**
> Medicaid is health coverage for people with limited income and savings. In South Carolina, a Medicaid program called the Community Choices waiver can pay for help at home for people who would otherwise need a nursing home.

**How it usually works (H4)**

- It's run by the South Carolina Department of Health and Human Services (SCDHHS).
- Your loved one must qualify for Medicaid and need the level of care a nursing home gives.
- A case manager looks at their needs and sets up services — like personal care, companion care and respite.
- There can be a waiting list, so start early and ask about it when you call.
- To start, call SCDHHS at (888) 971-1637 or make a referral online.

**Good to know (H4)**
> Waiver care comes from agencies approved as Medicaid providers. Ask any agency whether it is one.
>
> "Waiver" just means the state can pay for care at home instead of in a nursing home. It isn't something you sign away.

**Does Dawson accept it? (H4)** — chip: **Ask us** (switches to the confirmed answer at the reveal)
> Ask us. We'll help you understand whether Medicaid might fit your situation.
>
> *(hidden until confirmed)* `[[TO CONFIRM: is Dawson an approved SC Medicaid waiver provider (Community Choices)? If yes, which services?]]`

**Learn more (H4)**
- **SC Medicaid waiver programs (SCDHHS)** → `https://scdhhs.sc.gov/resources/waivers` · small text after the link: "goes to scdhhs.sc.gov"
- **Make a referral online (SCDHHS)** → `https://phoenix.scdhhs.gov/cltc_referrals/new` · small text after the link: "goes to scdhhs.gov"
- **Call SCDHHS: (888) 971-1637** → `tel:+18889711637`

**Buttons:**
- Primary: **Talk it through at your free assessment** → `/free-assessment?pay=medicaid-waivers` (after hours: **Request a Callback**)
- Ghost: **Call (843) 379-3321** → `tel:+18433793321` · cursor label `Call`

---

### Medicare — `#pay-medicare`

**Tab label:** Medicare · **Tab chip:** Usually not covered

**Panel heading (H3):**
> Medicare usually doesn't pay for non-medical home care

**Summary (under the heading):**
> Here's what Medicare does cover at home — and what it doesn't.

**What it is (H4)**
> Medicare is health insurance for people 65 and older, and some younger people with disabilities. It pays for medical care — including some short-term care at home, called home health.

**How it usually works (H4)**

Medicare does pay for home health. That's part-time nursing or therapy at home for someone who has trouble leaving home, after a doctor or other provider confirms it's needed. A home health aide may help with bathing too — but only while nursing or therapy is also happening.

Medicare doesn't pay for:

- Care 24 hours a day
- Help with bathing, dressing or using the bathroom, when that's the only help needed
- Shopping, cleaning and other homemaker help that isn't part of a home health plan

That's the kind of help we give, so most families pay for home care another way.

**Table** (`<table>` with caption "Home care and home health, side by side")

| | **Home care (what we do)** | **Home health** |
|---|---|---|
| Who provides it | Caregivers | Nurses and therapists |
| What it covers | Bathing, dressing, meals, housekeeping, company, medication reminders | Wound care, injections, therapy, medical treatment |
| How it starts | You call us | Usually a doctor's order |
| Paid by Medicare? | Usually not | Often, for people who qualify |

**Good to know (H4)**
> A small number of Medicare Advantage plans include a limited in-home support benefit. Check your plan's benefits or call the number on the member card.
>
> Many families use both: Medicare-covered home health for the medical side, and home care for everyday help. We're happy to work alongside your home health team.

**Does Dawson accept it? (H4)** — chip: **Usually not covered**
> Our care is non-medical, so Medicare generally won't pay for it. Ask us about the other ways families pay.

**Learn more (H4)**
- **Home health services on Medicare.gov** → `https://www.medicare.gov/coverage/home-health-services` · small text after the link: "goes to medicare.gov"

**Buttons:**
- Primary: **Ask us about other ways to pay** → `/free-assessment?pay=medicare` (after hours: **Request a Callback**)
- Ghost: **Call (843) 379-3321** → `tel:+18433793321` · cursor label `Call`

---

### Free help nearby (below the explorer)

**Heading (H3):**
> Free help nearby

**Lowcountry Area Agency on Aging** (H4)
> Free information and help with services for people 60 and older in Beaufort, Colleton, Hampton and Jasper counties.

- Phone: **(843) 473-3991** → `tel:+18434733991`
- **Lowcountry Area Agency on Aging** → `https://lowcountrycog.org/aging_and_disability_resources/` · small text after the link: "goes to lowcountrycog.org"

**Your county Veterans Affairs office** (H4)
> Free help applying for VA benefits, including Aid and Attendance.

**Closing line (lead, under the cards):**
> Not sure which applies? That's what the free visit is for. We'll talk through your options with you.

**Button:** Ghost — **Get a Free Care Assessment** → `/free-assessment` (after hours: **Request a Callback**)

---

## 03 — Questions to ask any agency

**Section ID:** `questions-to-ask`
**Eyebrow:** 03 — Questions to ask

**Headline (H2):**
> Questions to ask any home care agency.

**Subline:**
> Whoever you choose — us or someone else — these help you compare honestly. Tick them off as you ask, or print them for your calls.

**Controls row:**
- Switch (`role="switch"`, off by default, visible label): **Show Dawson's answers**
- Ghost button: **Print as a comparison sheet**

**Progress line** (polite live region, hidden at 0):
> {n} of 15 asked.

At all ticked:
> All asked. You'll know exactly who you're dealing with.

**Item format:** native checkbox, label = the question · "Why it matters" line (small, always visible, never behind hover) · when the switch is on, an **Our answer** block (Pending blocks only in placeholder mode; if no production-visible block exists, the fallback line shows). Group titles are H3. Ticks saved to sessionStorage (`agency_questions_ticked`), never sent. Tick animation per 07 §20; none in reduced motion.

#### License and insurance

1. `aq-licensed` — **Are you licensed and insured? Can I see proof?**
   - *Why it matters:* You can check a license number yourself, and an insurance certificate shows what's covered if someone gets hurt.
   - *Our answer:* Yes. We're licensed in South Carolina and insured. *(hidden until confirmed)* `License number: [[TO CONFIRM: SC license number]]. Insurance: [[TO CONFIRM: coverage types]].` *(hidden until confirmed)* `[[TO CONFIRM — draft: "Ask to see our license and insurance certificate at your free visit."]]`
2. `aq-employees` — **Are your caregivers employees, or independent contractors?**
   - *Why it matters:* With employees, the agency handles pay, taxes, insurance and supervision. With contractors or a registry, some of that may fall to your family.
   - *Our answer:* *(hidden until confirmed)* `[[TO CONFIRM: employees (W-2) or contractors?]]`
     → at launch, shows the fallback: "Ask us — we'll answer this on the phone or at your free visit."

#### Caregivers

3. `aq-screening` — **How do you screen caregivers — background checks, references?**
   - *Why it matters:* You're letting someone into your family's home. You should know exactly how they were checked.
   - *Our answer:* *(hidden until confirmed)* `[[TO CONFIRM: screening every caregiver goes through. List only what's real.]]`
     → at launch, shows the fallback: "Ask us — we'll answer this on the phone or at your free visit."
4. `aq-training` — **What training and experience do your caregivers have?**
   - *Why it matters:* Experience matters most for hands-on help like bathing and moving safely.
   - *Our answer:* Our caregivers have years of experience, and our team includes Certified Nursing Assistants. *(hidden until confirmed)* `[[TO CONFIRM: training every caregiver receives]]`
5. `aq-match` — **Can we meet the caregiver first? Can we ask for someone different?**
   - *Why it matters:* The right personality fit makes care easier for everyone — especially for a parent who's unsure about help.
   - *Our answer:* We match caregivers on needs, schedule and personality. *(hidden until confirmed)* `[[TO CONFIRM — draft: "You can meet your caregiver before care begins."]]` *(hidden until confirmed)* `[[TO CONFIRM — draft: "If the fit isn't right, tell us and we'll find someone who is."]]`
6. `aq-backup` — **What happens if our caregiver is sick or on vacation?**
   - *Why it matters:* A missed visit can mean a missed meal or medication reminder. Ask how the agency covers it.
   - *Our answer:* *(hidden until confirmed)* `[[TO CONFIRM: backup cover when a caregiver is sick or away]]`
     → at launch, shows the fallback: "Ask us — we'll answer this on the phone or at your free visit."

#### Care and communication

7. `aq-who-plans` — **Who visits to plan care — and who stays involved after that?**
   - *Why it matters:* You want to know who's actually responsible for the care — not just who answers the first call.
   - *Our answer:* Our owner. The owner visits every family personally, builds the care plan with you and keeps working with you to make sure care is done right.
8. `aq-plan` — **Will we get a written care plan?**
   - *Why it matters:* A written plan means everyone — family and caregivers — knows exactly what help is expected.
   - *Our answer:* *(hidden until confirmed)* `[[TO CONFIRM: families receive a written copy of the care plan]]`
     → at launch, shows the fallback: "Ask us — we'll answer this on the phone or at your free visit."
9. `aq-updates` — **How will you keep our family updated — especially if we live far away?**
   - *Why it matters:* Clear updates are what let you stop worrying from a distance.
   - *Our answer:* We follow up and check in regularly, and we change the plan as needs change. *(hidden until confirmed)* `[[TO CONFIRM: how often and how — e.g. a call every few weeks]]`
10. `aq-after-hours` — **Who do we call at night or on weekends?**
   - *Why it matters:* Care needs don't keep office hours. Ask how you reach someone when the office is closed.
   - *Our answer:* Care is available 24 hours a day, 7 days a week. Our office is open Monday–Friday, 8 AM–5 PM. *(hidden until confirmed)* `[[TO CONFIRM: after-hours line for existing clients]]`
11. `aq-limits` — **What won't your caregivers do?**
   - *Why it matters:* Every agency has limits. Knowing them up front avoids surprises later.
   - *Our answer:* Our care is non-medical. We don't give injections, change wound dressings or provide nursing. We give medication reminders and work alongside your home health or hospice team.

#### Cost and paperwork

12. `aq-rate` — **What's your hourly rate? Is it different for nights, weekends or holidays?**
   - *Why it matters:* Two agencies with the same hourly rate can cost very different amounts once nights and holidays are added.
   - *Our answer:* We'll explain your rate clearly at your free visit, before care begins. *(hidden until confirmed)* `[[TO CONFIRM: rate differences for nights, weekends or holidays]]`
13. `aq-minimum` — **Is there a minimum visit length, or a minimum number of hours a week?**
   - *Why it matters:* Minimums decide what a few hours of help really costs each week.
   - *Our answer:* *(hidden until confirmed)* `Visits start at [[TO CONFIRM: minimum hours]] hours.`
     → at launch, shows the fallback: "Ask us — we'll answer this on the phone or at your free visit."
14. `aq-billing` — **How does billing work, and what forms of payment do you take?**
   - *Why it matters:* Knowing when and how you'll be billed makes it easier to plan — and to share costs with family.
   - *Our answer:* *(hidden until confirmed)* `[[TO CONFIRM: billing frequency and payment methods]]`
     → at launch, shows the fallback: "Ask us — we'll answer this on the phone or at your free visit."
15. `aq-contract` — **Is there a contract? How much notice do you need to change or stop care?**
   - *Why it matters:* Needs can change fast — after a hospital stay, or a move. Flexible terms protect your family.
   - *Our answer:* *(hidden until confirmed)* `[[TO CONFIRM: service agreement, minimum commitment, notice to change or stop care]]`
     → at launch, shows the fallback: "Ask us — we'll answer this on the phone or at your free visit."

**Print sheet** (print stylesheet, this section only): title "Questions to ask any home care agency", groups + questions, three blank columns headed **Agency 1 · Agency 2 · Agency 3** with writing lines. "Why it matters" prints in small text. Dawson's answers never print — the sheet stays neutral. Footer: "From dawsonhomecare.com · (843) 379-3321".

---

## CTA band

Standard CTA band (COPY_TRUST §0) with this headline:

**Headline (H2, display-l):**
> Questions about cost? Let's *talk*.

---
---

# FAQ — /faq

## Page meta

- **Title:** Home Care Questions & Answers | Dawson & Dawson, Beaufort SC
- **Meta description:** Plain answers about non-medical home care in Beaufort, SC: getting started, services, cost and payment, caregivers, safety, hospice and medical questions.

**Breadcrumb:** Home › FAQ

---

## 1. Hero

**Eyebrow:** Questions & answers

**Headline (H1):**
> Your questions, *answered*.

**Subline (lead):**
> Plain answers about home care, cost and how we work. Can't find yours? Call (843) 379-3321 — we're happy to help.

**Buttons:**
- Primary: **Get a Free Care Assessment** → `/free-assessment` (after hours: **Request a Callback**)
- Secondary: **Call (843) 379-3321** → `tel:+18433793321` · cursor label `Call`

---

## 2. Search + navigation

**Search** (07 §14):
- Label (visible): **Search questions**
- Helper: Try "cost", "nights" or "Medicare".
- Clear button: **Clear search**
- Matching: case- and accent-insensitive, across the question, the production-visible answer text (`blocksToText`) and `keywords`. Debounce 150ms.
- Highlight: `<mark>` on matched words in questions and answers (styled with existing tokens only — no new color).
- Groups with no matches hide. With 5 or fewer matches, matching items open automatically.
- Results (polite live region):
  - "1 question matches "{query}"." / "{n} questions match "{query}"."
- No results:
  > No questions match "{query}". Try another word, or call (843) 379-3321 — we'll answer it.

**Group jump links** (row of chips → `#topic-{group id}`):
> Getting started · Services · Cost & payment · Caregivers · Safety & trust · Hospice & medical

**Buttons (text):** **Open all** / **Close all**

**Accordion:** question = H3 button (`aria-expanded`); several can be open. Smooth height animation; none in reduced motion. Each answer ends with its link (if any) and a small text button **Copy link** → copies `https://dawsonhomecare.com/faq#{id}` → label changes to **Link copied** for 2 seconds (polite live region). For families sharing an answer with a brother or sister.

**Deep links:** `/faq#{question id}` opens that item, scrolls it below the sticky header and moves focus to its button. `/faq#topic-{group id}` scrolls to the group (group anchors are prefixed so they never collide with question IDs like `#caregivers`). Home ch. 13 IDs match.

---

## 3. Questions (6 groups, 35 questions)

29 questions show in production today. 6 are hidden until confirmed: `sv-memory`, `cp-contract`, `cg-consistency`, `cg-employees`, `st-background`, `hm-hospice`.

### Getting started — `#topic-getting-started`

**Group heading (H2):** Getting started
**Intro (small):** First call, first visit, first days.

**How do we get started?** `#gs-how-start`
> Call (843) 379-3321, text (866) 632-9766 or request a call online. Tell us what's going on — you don't need to have anything figured out.
>
> Next, our owner visits your loved one at home for a free assessment. Together we build a care plan, then we match a caregiver. Our office is open Monday–Friday, 8 AM–5 PM. Care is available 24 hours a day, 7 days a week.

Link: **See how it works** → `/how-it-works`

**What happens at the free assessment?** `#free-assessment`  
*Home ch. 13 #6 — Home shows the first paragraph only*
> Our owner visits your loved one at home, at no cost. We talk about daily routines, the help they need and what matters most to them. Then we build a care plan together. There's no obligation.
>
> It's a friendly conversation, not an interview — and never a sales pitch. You or another family member are welcome to join, in person or by phone.

Link: **What to expect at the visit** → `/how-it-works#free-assessment`

**How soon can care start?** `#gs-how-fast`
> It depends on the help you need and when you need it. Tell us your timing on the first call. If it's urgent, say so — we'll move as quickly as we can.
>
> *(hidden until confirmed)* `Many families start care within [[TO CONFIRM: typical time from first call to first shift]] of their first call.`

Link: **How fast care can start** → `/how-it-works#start-time`

**Mom is in the hospital. When should we call?** `#gs-hospital`
> Before she's discharged, if you can. Coming home is when many families call us. We'll plan the first days home so there's no gap in care.
>
> *(hidden until confirmed)* `[[TO CONFIRM: can the free assessment happen at the hospital or rehab center? If yes: "Our owner can often meet you at the hospital or rehab center before discharge."]]`

**What if my parent doesn't want help?** `#gs-reluctant`
> That's very common, and it's OK. At the free visit, we talk with your loved one, not about them, and keep it relaxed.
>
> Many people find it easiest to start with companionship — a friendly visitor a few times a week. It doesn't feel like "help." It feels like company. Our owner can suggest gentle ways to bring up the idea.

Link: **See Companionship** → `/care/companionship`

**I live out of town. Can I still set up care?** `#gs-far-away`
> Yes. Many families we help don't live nearby. You can join the free assessment by phone, and we'll agree how you'd like to hear from us.
>
> We follow up and check in regularly, so you know how things are going — even from hours away.

**Which areas do you serve?** `#gs-areas`
> Our office is in Beaufort, and we care for families across the greater Lowcountry and surrounding areas.
>
> *(hidden until confirmed)* `[[TO CONFIRM: towns served — list from content/areas.ts once confirmed]]`
>
> Not sure if we reach you? Call (843) 379-3321 and we'll let you know.

Link: **See areas we serve** → `/areas-we-serve`

### Services — `#topic-services`

**Group heading (H2):** Services
**Intro (small):** What we help with — and what we don't.

**What's the difference between home care and home health?** `#home-care-vs-home-health`  
*Home ch. 13 #1 — Home shows the first paragraph only*
> Home care is non-medical help at home: bathing, dressing, meals, housekeeping, company and medication reminders. That's what we do. Home health is medical care from nurses or therapists, usually ordered by a doctor. Many families use both, and we're happy to work alongside your home health team.

Link: **See all care services** → `/care`

**What kind of help do you provide?** `#sv-what-help`
> Five kinds of non-medical help at home. Most families combine two or three:
>
> - Personal Care — bathing, dressing and getting around
> - Home Help — meals, laundry, errands and medication reminders
> - Companionship — company, conversation and getting out
> - Respite Care — a break for family caregivers
> - 24-Hour & Overnight Care — someone there, day and night
>
> Not sure which you need? Our 1-minute quiz can suggest a plan.

Link: **Find the right care** → `/find-care`

**Can you help at night or on weekends?** `#nights-weekends`  
*Home ch. 13 #4 — Home shows the first paragraph only*
> Yes. Care is available 24 hours a day, 7 days a week — a few hours or around the clock. Our office is open Monday to Friday, 8 AM to 5 PM.

Link: **See 24-Hour & Overnight Care** → `/care/24-hour-care`

**Can we start with just a few hours — and change later?** `#sv-start-small`
> Yes. Many families start small, with a visit or two a week, and add more as needs change. Need more hours, fewer hours or a different kind of help? We change the plan.
>
> *(hidden until confirmed)* `Visits start at [[TO CONFIRM: minimum hours]] hours.`

**Can a caregiver give Dad his medication?** `#sv-medication`
> We give medication reminders — a friendly nudge at the right time so he takes his own medicine. We don't give medication or manage prescriptions.
>
> If he needs someone to give his medicine, ask his doctor or home health team. We're happy to work alongside them.

Link: **See Home Help** → `/care/home-help`

**Can a caregiver take Mom to appointments or errands?** `#sv-transport`
> Yes, a caregiver can go with her, so she isn't on her own.
>
> *(hidden until confirmed)* `[[TO CONFIRM: do caregivers drive clients in their own car or the client's car? Replace this line with the confirmed answer.]]`

**Do you help people with memory loss or dementia?** `#sv-memory`  
***whole question hidden until confirmed***
> *(hidden until confirmed)* `[[TO CONFIRM: dementia/Alzheimer's support — do not publish this question until confirmed. Do not add as a service.]]`

### Cost & payment — `#topic-cost-payment`

**Group heading (H2):** Cost & payment
**Intro (small):** What care costs and how families pay.

**How much does home care cost?** `#cost`  
*Home ch. 13 #2 — Home shows the first paragraph only*
> It depends on how many hours of help you need. Use our cost estimator for a rough range. Your exact rate is set at your free assessment.
>
> We'll explain your rate clearly at your free visit, before care begins.

Link: **Estimate your cost** → `/paying-for-care#estimator`

**Does Medicare pay for home care?** `#medicare`  
*Home ch. 13 #3 — Home shows the first paragraph only*
> Usually not. Medicare generally doesn't cover non-medical home care. Some families use long-term care insurance, VA benefits or Medicaid waiver programs. Ask us which might apply to you.
>
> Medicare does pay for home health — part-time nursing or therapy at home, after a doctor or other provider confirms it's needed, for someone who has trouble leaving home. It doesn't pay for 24-hour care, or for help with bathing, dressing or housekeeping when that's the only help needed.

Link: **How Medicare fits with home care** → `/paying-for-care#pay-medicare`

**Does Medicaid pay for home care in South Carolina?** `#cp-medicaid`
> It can. South Carolina's Community Choices waiver is a Medicaid program that pays for help at home — like personal care and companion care — for people who qualify for Medicaid and need the level of care a nursing home gives.
>
> To start, call SCDHHS at (888) 971-1637. There may be a waiting list, so start early.
>
> *(hidden until confirmed)* `[[TO CONFIRM: is Dawson an approved Community Choices provider? If yes: "We're an approved provider — ask us how it works."]]`

Link: **Learn about Medicaid waivers** → `/paying-for-care#pay-medicaid`

**Will long-term care insurance pay for home care?** `#cp-ltc`
> Many policies do. Most start paying once your loved one needs help with everyday tasks — often two or more, like bathing and dressing — or has serious memory problems.
>
> There's usually a waiting period first, often 30 to 90 days. Find the policy and call the insurer early to ask what's covered at home.
>
> *(hidden until confirmed)* `[[TO CONFIRM: does Dawson work with long-term care insurance — care notes, invoices for claims, direct billing?]]`

Link: **How long-term care insurance works** → `/paying-for-care#pay-ltc`

**Are there VA benefits that help pay for care at home?** `#cp-va`
> Yes, for many Veterans and some surviving spouses. Aid and Attendance adds money to a VA pension for people who need help with daily activities. Separately, Veterans enrolled in VA health care may qualify for Homemaker and Home Health Aide care, which the VA approves and arranges.
>
> Your county Veterans Affairs office can help you apply.
>
> *(hidden until confirmed)* `[[TO CONFIRM: does Dawson accept VA-authorized Homemaker/Home Health Aide care? Do families use Aid and Attendance to pay Dawson?]]`

Link: **How VA benefits work** → `/paying-for-care#pay-va`

**How does billing work? What payment do you take?** `#cp-billing`
> We'll go through your rate and billing at your free visit, before care begins.
>
> *(hidden until confirmed)* `[[TO CONFIRM: billing frequency (e.g. weekly or every two weeks), payment methods accepted, and whether nights, weekends or holidays cost more]]`

**Is there a contract or a long-term commitment?** `#cp-contract`  
***whole question hidden until confirmed***
> The free assessment comes with no obligation.
>
> *(hidden until confirmed)* `[[TO CONFIRM: service agreement? minimum commitment? notice needed to change or stop care?]]`

### Caregivers — `#topic-caregivers`

**Group heading (H2):** Caregivers
**Intro (small):** The people who come to your loved one's home.

**Who will come to my loved one's home?** `#caregivers`  
*Home ch. 13 #5 — Home shows the first paragraph only*
> An experienced Dawson caregiver chosen for your loved one's needs and schedule. Our team includes Certified Nursing Assistants, and our owner stays involved in every client's care.
>
> We match on needs, schedule and personality, and your caregiver learns the plan before the first visit.

Link: **Meet our caregivers** → `/about#caregivers`

**What experience and training do your caregivers have?** `#cg-training`
> Our caregivers have years of experience and a genuine love for caregiving. Our team includes Certified Nursing Assistants.
>
> *(hidden until confirmed)* `[[TO CONFIRM: training every caregiver receives — e.g. orientation, CPR, ongoing training]]`

**Can we meet our caregiver first — or ask for someone different?** `#cg-meet-change`
> We choose a caregiver who fits your loved one's needs, schedule and personality, and your caregiver learns the plan before the first visit.
>
> *(hidden until confirmed)* `[[TO CONFIRM — draft: "You can meet your caregiver before care begins."]]`
>
> *(hidden until confirmed)* `[[TO CONFIRM — draft: "If the fit isn't right, tell us and we'll find someone who is."]]`

**Will it be the same caregiver each time? What if they're sick?** `#cg-consistency`  
***whole question hidden until confirmed***
> *(hidden until confirmed)* `[[TO CONFIRM: consistent-caregiver policy, and backup cover when a caregiver is sick or away]]`

**Are caregivers Dawson employees?** `#cg-employees`  
***whole question hidden until confirmed***
> *(hidden until confirmed)* `[[TO CONFIRM: employees (W-2) or contractors? If employees, draft: "Yes. Our caregivers are Dawson employees. We handle their pay, taxes and insurance, so your family doesn't have to."]]`

### Safety & trust — `#topic-safety-trust`

**Group heading (H2):** Safety & trust
**Intro (small):** Who's responsible, and how we keep things right.

**Are you licensed and insured?** `#st-licensed`
> Yes. Dawson and Dawson Home Care LLC is licensed in South Carolina and insured.
>
> *(hidden until confirmed)* `[[TO CONFIRM: SC license number and issuing agency]]`

Link: **Licensed & insured — the details** → `/about#licensed`

**Do you do background checks on caregivers?** `#st-background`  
***whole question hidden until confirmed***
> *(hidden until confirmed)* `[[TO CONFIRM: screening every caregiver goes through — background checks, references, drug tests. List only what's real.]]`

**Who's responsible for my mom's care?** `#st-owner`
> Our owner. At Dawson, the person who visits your home for the free assessment is the person who runs the company — and they stay involved in your loved one's care.
>
> We follow up and check in regularly, and we adjust the plan as needs change.
>
> *(hidden until confirmed)* `[[TO CONFIRM: how often and how we check in — e.g. a call every few weeks]]`

Link: **Meet our owner** → `/about#owner`

**What if something isn't right?** `#st-concern`
> Tell us right away. Call (843) 379-3321 or email info@dawsonhomecare.com. We'd much rather hear about a small problem early than a big one later.
>
> *(hidden until confirmed)* `Existing clients can reach us after hours at [[TO CONFIRM: after-hours line for existing clients]].`

**Why don't your forms ask about medical details?** `#st-privacy`
> To protect your family's privacy. Our online forms ask only what we need to call you back. We talk about care needs by phone or in person.
>
> We never sell or share phone numbers or text-message opt-in information with other companies for their marketing.

Link: **Read our Privacy Policy** → `/privacy-policy`

### Hospice & medical questions — `#topic-hospice-medical`

**Group heading (H2):** Hospice & medical questions
**Intro (small):** How we fit alongside medical care.

**Do you provide nursing or medical care?** `#hm-nursing`
> No. All our care is non-medical. We don't give injections, change wound dressings or provide nursing.
>
> Our team includes Certified Nursing Assistants, and we give medication reminders. If your loved one needs medical care at home, we're happy to work alongside their home health team.

**Can we have home care and home health at the same time?** `#hm-together`
> Yes, and many families do. Home health visits are usually part-time. We can be there for the hours in between — help with bathing, meals, the house and good company.
>
> Tell us who's on your loved one's care team, and we'll work alongside them.

Link: **Home care and home health, side by side** → `/paying-for-care#pay-medicare`

**Can you help if my loved one is on hospice?** `#hm-hospice`  
***whole question hidden until confirmed***
> *(hidden until confirmed)* `[[TO CONFIRM — draft: "Yes. We can provide non-medical comfort and companionship alongside your hospice or palliative team — sitting with your loved one, helping with meals and personal care, and giving the family a chance to rest."]]`
>
> *(hidden until confirmed)* `[[TO CONFIRM — draft: "Hospice teams usually visit at set times and don't stay around the clock. Many families add home care for the hours in between. We don't provide medical or nursing care."]]`

**I'm a discharge planner or case manager. How do I refer someone?** `#hm-referral`
> Send a referral online in about 2 minutes, or fax it to (866) 502-3509. You can also call (843) 379-3321.
>
> Please share only the minimum online — the client's first name, last initial and town. We'll talk through care needs by phone.
>
> *(hidden until confirmed)* `We'll respond within [[TO CONFIRM: referral response time]].`

Link: **Make a referral** → `/for-professionals#refer`

---

## 4. Still have a question?

**Heading (H2):**
> Still have a question?

**Body:**
> Call (843) 379-3321, text (866) 632-9766 or email info@dawsonhomecare.com.

**Hours (always both, always labelled):**
> **Care:** 24 hours a day, 7 days a week
> **Office:** Monday–Friday, 8 AM–5 PM

**After-hours line (when closed):**
> Our office is closed right now. Request a callback and we'll reach you first thing {nextOpen}.

**Links:**
- **Call (843) 379-3321** → `tel:+18433793321` · cursor label `Call`
- **Text (866) 632-9766** → `sms:+18666329766`
- **Email us** → `mailto:info@dawsonhomecare.com`
- Text link: **Comparing agencies? Questions to ask any agency** → `/paying-for-care#questions-to-ask`

---

## CTA band

Standard CTA band (COPY_TRUST §0) with this headline:

**Headline (H2, display-l):**
> Ask us *anything*.

---

## Structured data

- `/faq`: `FAQPage` with **production-visible items only**; each answer = `blocksToText(answer)` + link label. Plus `BreadcrumbList`.
- Home ch. 13: **no** `FAQPage` markup (the same questions live on `/faq`; mark them up once).
- Service pages keep their own `FAQPage` (COPY_SERVICES); their questions are different.
- `/paying-for-care`: `BreadcrumbList` only.

---
---

# DATA FILES

Paths per 08 §5. `blocks.ts` is a small shared helper both files import (types + render gates). All three type-check under `tsc --strict`.

**New env var** (add to 08 §6):
```
NEXT_PUBLIC_SHOW_PLACEHOLDERS=true   # localhost + reveal only. Unset in production.
```

## `content/blocks.ts`

```ts
// content/blocks.ts — shared by payments.ts and faq.ts
// A Block is one paragraph (string), one bullet list, or one unverified sentence.
// Strings and lists are verified or approved copy and always render.
// Pending blocks contain a [[TO CONFIRM …]] token: they render only when
// NEXT_PUBLIC_SHOW_PLACEHOLDERS=true (localhost + reveal) and never in production.
// `npm run prelaunch` lists every Pending block that is left.

export type Pending = { text: string; confirmed: false };
export type List = { list: string[] };
export type Block = string | List | Pending;

export type Link = {
  label: string;
  href: string;
  /** Shown as small text after external links, e.g. "goes to medicare.gov". */
  site?: string;
  /** Date an external link and the facts it backs were last checked. Re-check before launch. */
  checked?: string;
};

export const pending = (text: string): Pending => ({ text, confirmed: false });

export const SHOW_PLACEHOLDERS = process.env.NEXT_PUBLIC_SHOW_PLACEHOLDERS === "true";

export const isPending = (b: Block): b is Pending =>
  typeof b === "object" && "confirmed" in b;

export const isList = (b: Block): b is List => typeof b === "object" && "list" in b;

/** Blocks to render right now. */
export const visibleBlocks = (blocks: Block[]): Block[] =>
  blocks.filter((b) => !isPending(b) || SHOW_PLACEHOLDERS);

/** Item-level gate used by FAQ items and agency questions. */
export const isVisible = (item: { confirmed: boolean; hideUntilConfirmed: boolean }): boolean =>
  item.confirmed || !item.hideUntilConfirmed || SHOW_PLACEHOLDERS;

/** Plain text for search indexes and FAQPage schema (production-visible blocks only). */
export const blocksToText = (blocks: Block[]): string =>
  visibleBlocks(blocks)
    .map((b) => (typeof b === "string" ? b : isList(b) ? b.list.join(". ") : b.text))
    .join(" ");
```

## `content/payments.ts`

```ts
// content/payments.ts — /paying-for-care: Payment Explorer (07 §6), "Narrow it down"
// helper, free local help, and the "Questions to ask any agency" checklist.
// Copy is final (COPY_COST_FAQ.md). Public-program facts were checked on the date
// in each `checked` field — re-check them before launch.

import { type Block, type Link, pending } from "./blocks";

export type PaymentId =
  | "private-pay"
  | "ltc-insurance"
  | "va-benefits"
  | "medicaid-waivers"
  | "medicare";

export type DawsonStance = {
  /** true = Dawson accepts / works with it · false = no · null = unknown */
  accepts: boolean | null;
  confirmed: boolean;
  /** Chip on the tab and in the panel. Words + icon, never color alone. */
  chip: string;
  text: Block[];
};

export type PaymentRoute = { title: string; body: Block[]; link?: Link };

export type PaymentOption = {
  id: PaymentId;
  /** Panel anchor: /paying-for-care#{anchor} opens this tab. */
  anchor: string;
  /** Tab / accordion label. */
  tab: string;
  /** Panel heading (H3). */
  title: string;
  /** One line under the title. */
  summary: string;
  whatItIs: Block[];
  howItWorks: Block[];
  /** VA only: two side-by-side cards. */
  routes?: PaymentRoute[];
  /** Medicare only: home care vs home health table. */
  comparison?: { caption: string; columns: [string, string]; rows: { label: string; values: [string, string] }[] };
  goodToKnow: Block[];
  dawson: DawsonStance;
  learnMore: Link[];
  cta: Link;
  /** False while any Pending block or unconfirmed Dawson stance remains. */
  confirmed: boolean;
};

const CHECKED = "2026-10-19";

export const paymentOptions: PaymentOption[] = [
  {
    id: "private-pay",
    anchor: "pay-private",
    tab: "Private pay",
    title: "Private pay",
    summary: "Paying for care yourself. Simple, flexible and no waiting lists.",
    whatItIs: [
      "You pay for care yourself — from savings, income or retirement money, or with help from family.",
    ],
    howItWorks: [
      {
        list: [
          "You choose the help, the hours and the schedule. There are no approvals or waiting lists.",
          "You pay for the hours of care your loved one gets.",
          "You can add or cut hours as needs change.",
          "Some families share the cost between brothers and sisters.",
        ],
      },
      pending("[[TO CONFIRM: how often Dawson bills — e.g. weekly or every two weeks]]"),
    ],
    goodToKnow: [
      "Some families can count part of the cost of care as a medical expense on their taxes. The rules are strict, so ask a tax professional.",
      "Private pay can also fill the gaps: many families use it alongside insurance or benefits that cover only some hours.",
    ],
    dawson: {
      accepts: null,
      confirmed: false,
      chip: "Ask us",
      text: [
        "Ask us. We'll explain your rate and how billing works at your free visit, before care begins.",
        pending("[[TO CONFIRM: payment methods Dawson accepts — e.g. check, card, bank transfer]]"),
      ],
    },
    learnMore: [],
    cta: { label: "Talk it through at your free assessment", href: "/free-assessment?pay=private-pay" },
    confirmed: false,
  },

  {
    id: "ltc-insurance",
    anchor: "pay-ltc",
    tab: "Long-term care insurance",
    title: "Long-term care insurance",
    summary: "A private policy that may pay toward care at home.",
    whatItIs: [
      "A private insurance policy, usually bought years earlier, that helps pay for care when someone needs help with daily life. Many policies cover care at home.",
    ],
    howItWorks: [
      {
        list: [
          "The policy starts paying once your loved one needs help with everyday tasks — often two or more, like bathing and dressing — or has serious memory problems.",
          "There's usually a waiting period first, often 30, 60 or 90 days. You pay for care during that time. (Insurers call this the \"elimination period.\")",
          "After that, the policy pays up to a daily or monthly limit.",
          "Some policies pay you back after you've paid for care. Others pay the agency directly.",
          "The insurer usually asks for a care plan and records of the care given.",
        ],
      },
    ],
    goodToKnow: [
      "Find the policy and call the insurer early — before care starts if you can. Ask four things: what starts the benefits, how long the waiting period is, what the daily or monthly limit is, and whether care from a home care agency is covered.",
    ],
    dawson: {
      accepts: null,
      confirmed: false,
      chip: "Ask us",
      text: [
        "Ask us. Bring the policy, or the insurer's phone number, to your free visit and we'll go through it with you.",
        pending("[[TO CONFIRM: does Dawson work with long-term care insurance — e.g. provide care notes and invoices for claims, or bill the insurer directly?]]"),
      ],
    },
    learnMore: [],
    cta: { label: "Talk it through at your free assessment", href: "/free-assessment?pay=ltc-insurance" },
    confirmed: false,
  },

  {
    id: "va-benefits",
    anchor: "pay-va",
    tab: "VA benefits",
    title: "VA benefits",
    summary: "Help for Veterans, and some surviving spouses, who need care at home.",
    whatItIs: [
      "Veterans — and in some cases their surviving spouses — may get help paying for care at home. There are two main routes.",
    ],
    routes: [
      {
        title: "Aid and Attendance (or Housebound)",
        body: [
          "Extra money added to a monthly VA pension. It's for Veterans and survivors who need another person's help with daily activities like bathing, eating and dressing, or who spend most of their time at home because of a permanent disability.",
          "You must qualify for a VA pension first. The money is paid to the Veteran or survivor, who can use it toward care.",
        ],
        link: {
          label: "Aid and Attendance on VA.gov",
          href: "https://www.va.gov/pension/aid-attendance-housebound/",
          site: "va.gov",
          checked: CHECKED,
        },
      },
      {
        title: "Homemaker and Home Health Aide care",
        body: [
          "For Veterans enrolled in VA health care who need help with daily activities. The VA approves the help and the hours, and the care comes from an agency that has an agreement with the VA.",
          "To start, talk to your VA care team or a VA social worker.",
        ],
        link: {
          label: "Homemaker and Home Health Aide care on VA.gov",
          href: "https://www.va.gov/GERIATRICS/pages/Homemaker_and_Home_Health_Aide_Care.asp",
          site: "va.gov",
          checked: CHECKED,
        },
      },
    ],
    howItWorks: [
      {
        list: [
          "Aid and Attendance: you apply to the VA, and a doctor fills in part of the form. Decisions can take time, so apply early.",
          "Homemaker and Home Health Aide care: the VA decides how many hours it will cover and which agency provides the care.",
        ],
      },
    ],
    goodToKnow: [
      "Your county Veterans Affairs office can help you apply. You shouldn't have to pay anyone to help you file for VA benefits.",
    ],
    dawson: {
      accepts: null,
      confirmed: false,
      chip: "Ask us",
      text: [
        "Ask us. We'll talk through which VA route might fit your family.",
        pending("[[TO CONFIRM: is Dawson a VA community care provider for Homemaker and Home Health Aide care? Do families use Aid and Attendance to pay Dawson?]]"),
      ],
    },
    learnMore: [], // route cards carry the VA.gov links
    cta: { label: "Talk it through at your free assessment", href: "/free-assessment?pay=va-benefits" },
    confirmed: false,
  },

  {
    id: "medicaid-waivers",
    anchor: "pay-medicaid",
    tab: "Medicaid waivers",
    title: "Medicaid waivers",
    summary: "South Carolina Medicaid programs that pay for help at home.",
    whatItIs: [
      "Medicaid is health coverage for people with limited income and savings. In South Carolina, a Medicaid program called the Community Choices waiver can pay for help at home for people who would otherwise need a nursing home.",
    ],
    howItWorks: [
      {
        list: [
          "It's run by the South Carolina Department of Health and Human Services (SCDHHS).",
          "Your loved one must qualify for Medicaid and need the level of care a nursing home gives.",
          "A case manager looks at their needs and sets up services — like personal care, companion care and respite.",
          "There can be a waiting list, so start early and ask about it when you call.",
          "To start, call SCDHHS at (888) 971-1637 or make a referral online.",
        ],
      },
    ],
    goodToKnow: [
      "Waiver care comes from agencies approved as Medicaid providers. Ask any agency whether it is one.",
      "\"Waiver\" just means the state can pay for care at home instead of in a nursing home. It isn't something you sign away.",
    ],
    dawson: {
      accepts: null,
      confirmed: false,
      chip: "Ask us",
      text: [
        "Ask us. We'll help you understand whether Medicaid might fit your situation.",
        pending("[[TO CONFIRM: is Dawson an approved SC Medicaid waiver provider (Community Choices)? If yes, which services?]]"),
      ],
    },
    learnMore: [
      {
        label: "SC Medicaid waiver programs (SCDHHS)",
        href: "https://scdhhs.sc.gov/resources/waivers",
        site: "scdhhs.sc.gov",
        checked: CHECKED,
      },
      {
        label: "Make a referral online (SCDHHS)",
        href: "https://phoenix.scdhhs.gov/cltc_referrals/new",
        site: "scdhhs.gov",
        checked: CHECKED,
      },
      { label: "Call SCDHHS: (888) 971-1637", href: "tel:+18889711637", checked: CHECKED },
    ],
    cta: { label: "Talk it through at your free assessment", href: "/free-assessment?pay=medicaid-waivers" },
    confirmed: false,
  },

  {
    id: "medicare",
    anchor: "pay-medicare",
    tab: "Medicare",
    title: "Medicare usually doesn't pay for non-medical home care",
    summary: "Here's what Medicare does cover at home — and what it doesn't.",
    whatItIs: [
      "Medicare is health insurance for people 65 and older, and some younger people with disabilities. It pays for medical care — including some short-term care at home, called home health.",
    ],
    howItWorks: [
      "Medicare does pay for home health. That's part-time nursing or therapy at home for someone who has trouble leaving home, after a doctor or other provider confirms it's needed. A home health aide may help with bathing too — but only while nursing or therapy is also happening.",
      "Medicare doesn't pay for:",
      {
        list: [
          "Care 24 hours a day",
          "Help with bathing, dressing or using the bathroom, when that's the only help needed",
          "Shopping, cleaning and other homemaker help that isn't part of a home health plan",
        ],
      },
      "That's the kind of help we give, so most families pay for home care another way.",
    ],
    comparison: {
      caption: "Home care and home health, side by side",
      columns: ["Home care (what we do)", "Home health"],
      rows: [
        { label: "Who provides it", values: ["Caregivers", "Nurses and therapists"] },
        {
          label: "What it covers",
          values: [
            "Bathing, dressing, meals, housekeeping, company, medication reminders",
            "Wound care, injections, therapy, medical treatment",
          ],
        },
        { label: "How it starts", values: ["You call us", "Usually a doctor's order"] },
        { label: "Paid by Medicare?", values: ["Usually not", "Often, for people who qualify"] },
      ],
    },
    goodToKnow: [
      "A small number of Medicare Advantage plans include a limited in-home support benefit. Check your plan's benefits or call the number on the member card.",
      "Many families use both: Medicare-covered home health for the medical side, and home care for everyday help. We're happy to work alongside your home health team.",
    ],
    dawson: {
      accepts: false,
      confirmed: true,
      chip: "Usually not covered",
      text: [
        "Our care is non-medical, so Medicare generally won't pay for it. Ask us about the other ways families pay.",
      ],
    },
    learnMore: [
      {
        label: "Home health services on Medicare.gov",
        href: "https://www.medicare.gov/coverage/home-health-services",
        site: "medicare.gov",
        checked: CHECKED,
      },
    ],
    cta: { label: "Ask us about other ways to pay", href: "/free-assessment?pay=medicare" },
    confirmed: true,
  },
];

// ── "Not sure where to start?" helper (sits above the tabs) ────────────────────
// Ticks stay in the browser. Never saved or sent (09 §2 — collect the minimum).

export type NarrowDownOption = { id: string; label: string; points: PaymentId };

export const narrowDown = {
  heading: "Not sure where to start?",
  instruction: "Tick any that are true. We'll point you to the options worth a look.",
  options: [
    { id: "nd-ltc", label: "They have a long-term care insurance policy", points: "ltc-insurance" },
    { id: "nd-va", label: "They served in the military, or are the surviving spouse of a Veteran", points: "va-benefits" },
    { id: "nd-medicaid", label: "They have Medicaid, or very limited income and savings", points: "medicaid-waivers" },
    { id: "nd-medicare", label: "They have Medicare", points: "medicare" },
  ] satisfies NarrowDownOption[],
  /** Chip added to matching tabs. */
  matchChip: "Worth a look",
  /** {options} = matching tab names joined with commas and "and". */
  result: "Worth a look: {options}. Many families also pay privately for some or all of their care.",
  privacy: "Your answers stay on this page. We don't save or send them.",
};

// ── Free help nearby (below the explorer) ──────────────────────────────────────

export type FreeHelp = { name: string; body: string; phone?: { label: string; href: string }; link?: Link; checked: string };

export const freeHelp: FreeHelp[] = [
  {
    name: "Lowcountry Area Agency on Aging",
    body: "Free information and help with services for people 60 and older in Beaufort, Colleton, Hampton and Jasper counties.",
    phone: { label: "(843) 473-3991", href: "tel:+18434733991" },
    link: {
      label: "Lowcountry Area Agency on Aging",
      href: "https://lowcountrycog.org/aging_and_disability_resources/",
      site: "lowcountrycog.org",
      checked: CHECKED,
    },
    checked: CHECKED,
  },
  {
    name: "Your county Veterans Affairs office",
    body: "Free help applying for VA benefits, including Aid and Attendance.",
    checked: CHECKED,
  },
];

// ── "Questions to ask any agency" checklist ───────────────────────────────────

export type AgencyQuestionGroup = "license" | "caregivers" | "care" | "cost";

export type AgencyQuestion = {
  id: string;
  group: AgencyQuestionGroup;
  question: string;
  why: string;
  /** Shown under "Our answer" when "Show Dawson's answers" is on. */
  ourAnswer: Block[];
  confirmed: boolean;
};

export const agencyQuestionGroups: Record<AgencyQuestionGroup, string> = {
  license: "License and insurance",
  caregivers: "Caregivers",
  care: "Care and communication",
  cost: "Cost and paperwork",
};

/** Shown when "Show Dawson's answers" is on and no production-visible answer block exists. */
export const ourAnswerFallback = "Ask us — we'll answer this on the phone or at your free visit.";

export const agencyQuestions: AgencyQuestion[] = [
  {
    id: "aq-licensed",
    group: "license",
    question: "Are you licensed and insured? Can I see proof?",
    why: "You can check a license number yourself, and an insurance certificate shows what's covered if someone gets hurt.",
    ourAnswer: [
      "Yes. We're licensed in South Carolina and insured.",
      pending("License number: [[TO CONFIRM: SC license number]]. Insurance: [[TO CONFIRM: coverage types]]."),
      pending('[[TO CONFIRM — draft: "Ask to see our license and insurance certificate at your free visit."]]'),
    ],
    confirmed: false,
  },
  {
    id: "aq-employees",
    group: "license",
    question: "Are your caregivers employees, or independent contractors?",
    why: "With employees, the agency handles pay, taxes, insurance and supervision. With contractors or a registry, some of that may fall to your family.",
    ourAnswer: [pending("[[TO CONFIRM: employees (W-2) or contractors?]]")],
    confirmed: false,
  },
  {
    id: "aq-screening",
    group: "caregivers",
    question: "How do you screen caregivers — background checks, references?",
    why: "You're letting someone into your family's home. You should know exactly how they were checked.",
    ourAnswer: [pending("[[TO CONFIRM: screening every caregiver goes through. List only what's real.]]")],
    confirmed: false,
  },
  {
    id: "aq-training",
    group: "caregivers",
    question: "What training and experience do your caregivers have?",
    why: "Experience matters most for hands-on help like bathing and moving safely.",
    ourAnswer: [
      "Our caregivers have years of experience, and our team includes Certified Nursing Assistants.",
      pending("[[TO CONFIRM: training every caregiver receives]]"),
    ],
    confirmed: false,
  },
  {
    id: "aq-match",
    group: "caregivers",
    question: "Can we meet the caregiver first? Can we ask for someone different?",
    why: "The right personality fit makes care easier for everyone — especially for a parent who's unsure about help.",
    ourAnswer: [
      "We match caregivers on needs, schedule and personality.",
      pending('[[TO CONFIRM — draft: "You can meet your caregiver before care begins."]]'),
      pending('[[TO CONFIRM — draft: "If the fit isn\'t right, tell us and we\'ll find someone who is."]]'),
    ],
    confirmed: false,
  },
  {
    id: "aq-backup",
    group: "caregivers",
    question: "What happens if our caregiver is sick or on vacation?",
    why: "A missed visit can mean a missed meal or medication reminder. Ask how the agency covers it.",
    ourAnswer: [pending("[[TO CONFIRM: backup cover when a caregiver is sick or away]]")],
    confirmed: false,
  },
  {
    id: "aq-who-plans",
    group: "care",
    question: "Who visits to plan care — and who stays involved after that?",
    why: "You want to know who's actually responsible for the care — not just who answers the first call.",
    ourAnswer: [
      "Our owner. The owner visits every family personally, builds the care plan with you and keeps working with you to make sure care is done right.",
    ],
    confirmed: true,
  },
  {
    id: "aq-plan",
    group: "care",
    question: "Will we get a written care plan?",
    why: "A written plan means everyone — family and caregivers — knows exactly what help is expected.",
    ourAnswer: [pending("[[TO CONFIRM: families receive a written copy of the care plan]]")],
    confirmed: false,
  },
  {
    id: "aq-updates",
    group: "care",
    question: "How will you keep our family updated — especially if we live far away?",
    why: "Clear updates are what let you stop worrying from a distance.",
    ourAnswer: [
      "We follow up and check in regularly, and we change the plan as needs change.",
      pending("[[TO CONFIRM: how often and how — e.g. a call every few weeks]]"),
    ],
    confirmed: false,
  },
  {
    id: "aq-after-hours",
    group: "care",
    question: "Who do we call at night or on weekends?",
    why: "Care needs don't keep office hours. Ask how you reach someone when the office is closed.",
    ourAnswer: [
      "Care is available 24 hours a day, 7 days a week. Our office is open Monday–Friday, 8 AM–5 PM.",
      pending("[[TO CONFIRM: after-hours line for existing clients]]"),
    ],
    confirmed: false,
  },
  {
    id: "aq-limits",
    group: "care",
    question: "What won't your caregivers do?",
    why: "Every agency has limits. Knowing them up front avoids surprises later.",
    ourAnswer: [
      "Our care is non-medical. We don't give injections, change wound dressings or provide nursing. We give medication reminders and work alongside your home health or hospice team.",
    ],
    confirmed: true,
  },
  {
    id: "aq-rate",
    group: "cost",
    question: "What's your hourly rate? Is it different for nights, weekends or holidays?",
    why: "Two agencies with the same hourly rate can cost very different amounts once nights and holidays are added.",
    ourAnswer: [
      "We'll explain your rate clearly at your free visit, before care begins.",
      pending("[[TO CONFIRM: rate differences for nights, weekends or holidays]]"),
    ],
    confirmed: false,
  },
  {
    id: "aq-minimum",
    group: "cost",
    question: "Is there a minimum visit length, or a minimum number of hours a week?",
    why: "Minimums decide what a few hours of help really costs each week.",
    ourAnswer: [pending("Visits start at [[TO CONFIRM: minimum hours]] hours.")],
    confirmed: false,
  },
  {
    id: "aq-billing",
    group: "cost",
    question: "How does billing work, and what forms of payment do you take?",
    why: "Knowing when and how you'll be billed makes it easier to plan — and to share costs with family.",
    ourAnswer: [pending("[[TO CONFIRM: billing frequency and payment methods]]")],
    confirmed: false,
  },
  {
    id: "aq-contract",
    group: "cost",
    question: "Is there a contract? How much notice do you need to change or stop care?",
    why: "Needs can change fast — after a hospital stay, or a move. Flexible terms protect your family.",
    ourAnswer: [pending("[[TO CONFIRM: service agreement, minimum commitment, notice to change or stop care]]")],
    confirmed: false,
  },
];
```

## `content/faq.ts`

```ts
// content/faq.ts — /faq (grouped accordion + live search, 07 §14) and Home ch. 13 preview.
// Copy is final (COPY_COST_FAQ.md). The six `featured` items are COPY_HOME ch. 13:
// Home renders answer[0] only, and answer[0] matches COPY_HOME word for word.
// Deep links: /faq#{id} opens that item. Group sections use id="topic-{group id}"
// (prefixed so the group "caregivers" never collides with the question #caregivers).

import { type Block, type Link, pending } from "./blocks";

export type FaqGroupId =
  | "getting-started"
  | "services"
  | "cost-payment"
  | "caregivers"
  | "safety-trust"
  | "hospice-medical";

export type FaqGroup = { id: FaqGroupId; title: string; intro: string };

export type FaqItem = {
  id: string;
  group: FaqGroupId;
  question: string;
  /** Paragraphs in order. answer[0] stands alone as the short answer. */
  answer: Block[];
  link?: Link;
  /** Search synonyms. Never displayed. */
  keywords: string[];
  /** Home ch. 13 position (1–6). */
  featured?: number;
  /** false while any Pending block remains. */
  confirmed: boolean;
  /** true = hide the whole item until confirmed (it has no safe verified answer). */
  hideUntilConfirmed: boolean;
};

export const faqGroups: FaqGroup[] = [
  { id: "getting-started", title: "Getting started", intro: "First call, first visit, first days." },
  { id: "services", title: "Services", intro: "What we help with — and what we don't." },
  { id: "cost-payment", title: "Cost & payment", intro: "What care costs and how families pay." },
  { id: "caregivers", title: "Caregivers", intro: "The people who come to your loved one's home." },
  { id: "safety-trust", title: "Safety & trust", intro: "Who's responsible, and how we keep things right." },
  { id: "hospice-medical", title: "Hospice & medical questions", intro: "How we fit alongside medical care." },
];

export const faqItems: FaqItem[] = [
  // ── Getting started ─────────────────────────────────────────────────────────
  {
    id: "gs-how-start",
    group: "getting-started",
    question: "How do we get started?",
    answer: [
      "Call (843) 379-3321, text (866) 632-9766 or request a call online. Tell us what's going on — you don't need to have anything figured out.",
      "Next, our owner visits your loved one at home for a free assessment. Together we build a care plan, then we match a caregiver. Our office is open Monday–Friday, 8 AM–5 PM. Care is available 24 hours a day, 7 days a week.",
    ],
    link: { label: "See how it works", href: "/how-it-works" },
    keywords: ["start", "begin", "first step", "sign up", "call", "how it works", "process", "get help"],
    confirmed: true,
    hideUntilConfirmed: false,
  },
  {
    id: "free-assessment",
    group: "getting-started",
    question: "What happens at the free assessment?",
    answer: [
      "Our owner visits your loved one at home, at no cost. We talk about daily routines, the help they need and what matters most to them. Then we build a care plan together. There's no obligation.",
      "It's a friendly conversation, not an interview — and never a sales pitch. You or another family member are welcome to join, in person or by phone.",
    ],
    link: { label: "What to expect at the visit", href: "/how-it-works#free-assessment" },
    keywords: ["assessment", "visit", "consultation", "evaluation", "free", "home visit", "obligation", "meeting"],
    featured: 6,
    confirmed: true,
    hideUntilConfirmed: false,
  },
  {
    id: "gs-how-fast",
    group: "getting-started",
    question: "How soon can care start?",
    answer: [
      "It depends on the help you need and when you need it. Tell us your timing on the first call. If it's urgent, say so — we'll move as quickly as we can.",
      pending("Many families start care within [[TO CONFIRM: typical time from first call to first shift]] of their first call."),
    ],
    link: { label: "How fast care can start", href: "/how-it-works#start-time" },
    keywords: ["soon", "quickly", "fast", "urgent", "start date", "today", "tomorrow", "this week", "emergency"],
    confirmed: false,
    hideUntilConfirmed: false,
  },
  {
    id: "gs-hospital",
    group: "getting-started",
    question: "Mom is in the hospital. When should we call?",
    answer: [
      "Before she's discharged, if you can. Coming home is when many families call us. We'll plan the first days home so there's no gap in care.",
      pending('[[TO CONFIRM: can the free assessment happen at the hospital or rehab center? If yes: "Our owner can often meet you at the hospital or rehab center before discharge."]]'),
    ],
    keywords: ["hospital", "discharge", "rehab", "rehabilitation", "surgery", "coming home", "fall", "after hospital"],
    confirmed: false,
    hideUntilConfirmed: false,
  },
  {
    id: "gs-reluctant",
    group: "getting-started",
    question: "What if my parent doesn't want help?",
    answer: [
      "That's very common, and it's OK. At the free visit, we talk with your loved one, not about them, and keep it relaxed.",
      "Many people find it easiest to start with companionship — a friendly visitor a few times a week. It doesn't feel like \"help.\" It feels like company. Our owner can suggest gentle ways to bring up the idea.",
    ],
    link: { label: "See Companionship", href: "/care/companionship" },
    keywords: ["refuses", "resistant", "stubborn", "doesn't want", "won't accept", "independent", "pride", "convince"],
    confirmed: true,
    hideUntilConfirmed: false,
  },
  {
    id: "gs-far-away",
    group: "getting-started",
    question: "I live out of town. Can I still set up care?",
    answer: [
      "Yes. Many families we help don't live nearby. You can join the free assessment by phone, and we'll agree how you'd like to hear from us.",
      "We follow up and check in regularly, so you know how things are going — even from hours away.",
    ],
    keywords: ["long distance", "out of state", "out of town", "far away", "live away", "remote", "updates", "sibling"],
    confirmed: true,
    hideUntilConfirmed: false,
  },
  {
    id: "gs-areas",
    group: "getting-started",
    question: "Which areas do you serve?",
    answer: [
      "Our office is in Beaufort, and we care for families across the greater Lowcountry and surrounding areas.",
      pending("[[TO CONFIRM: towns served — list from content/areas.ts once confirmed]]"),
      "Not sure if we reach you? Call (843) 379-3321 and we'll let you know.",
    ],
    link: { label: "See areas we serve", href: "/areas-we-serve" },
    keywords: ["area", "areas", "town", "where", "location", "Beaufort", "Lowcountry", "zip", "near me", "county"],
    confirmed: false,
    hideUntilConfirmed: false,
  },

  // ── Services ────────────────────────────────────────────────────────────────
  {
    id: "home-care-vs-home-health",
    group: "services",
    question: "What's the difference between home care and home health?",
    answer: [
      "Home care is non-medical help at home: bathing, dressing, meals, housekeeping, company and medication reminders. That's what we do. Home health is medical care from nurses or therapists, usually ordered by a doctor. Many families use both, and we're happy to work alongside your home health team.",
    ],
    link: { label: "See all care services", href: "/care" },
    keywords: ["home health", "difference", "nursing", "medical", "non-medical", "skilled", "custodial", "what is home care"],
    featured: 1,
    confirmed: true,
    hideUntilConfirmed: false,
  },
  {
    id: "sv-what-help",
    group: "services",
    question: "What kind of help do you provide?",
    answer: [
      "Five kinds of non-medical help at home. Most families combine two or three:",
      {
        list: [
          "Personal Care — bathing, dressing and getting around",
          "Home Help — meals, laundry, errands and medication reminders",
          "Companionship — company, conversation and getting out",
          "Respite Care — a break for family caregivers",
          "24-Hour & Overnight Care — someone there, day and night",
        ],
      },
      "Not sure which you need? Our 1-minute quiz can suggest a plan.",
    ],
    link: { label: "Find the right care", href: "/find-care" },
    keywords: ["services", "help", "what do you do", "personal care", "bathing", "housekeeping", "cooking", "companion", "respite", "ADLs"],
    confirmed: true,
    hideUntilConfirmed: false,
  },
  {
    id: "nights-weekends",
    group: "services",
    question: "Can you help at night or on weekends?",
    answer: [
      "Yes. Care is available 24 hours a day, 7 days a week — a few hours or around the clock. Our office is open Monday to Friday, 8 AM to 5 PM.",
    ],
    link: { label: "See 24-Hour & Overnight Care", href: "/care/24-hour-care" },
    keywords: ["night", "overnight", "weekend", "holiday", "24/7", "24 hours", "around the clock", "office hours", "Sunday", "Saturday"],
    featured: 4,
    confirmed: true,
    hideUntilConfirmed: false,
  },
  {
    id: "sv-start-small",
    group: "services",
    question: "Can we start with just a few hours — and change later?",
    answer: [
      "Yes. Many families start small, with a visit or two a week, and add more as needs change. Need more hours, fewer hours or a different kind of help? We change the plan.",
      pending("Visits start at [[TO CONFIRM: minimum hours]] hours."),
    ],
    keywords: ["minimum", "few hours", "part-time", "change", "more hours", "fewer hours", "flexible", "once a week"],
    confirmed: false,
    hideUntilConfirmed: false,
  },
  {
    id: "sv-medication",
    group: "services",
    question: "Can a caregiver give Dad his medication?",
    answer: [
      "We give medication reminders — a friendly nudge at the right time so he takes his own medicine. We don't give medication or manage prescriptions.",
      "If he needs someone to give his medicine, ask his doctor or home health team. We're happy to work alongside them.",
    ],
    link: { label: "See Home Help", href: "/care/home-help" },
    keywords: ["medication", "medicine", "pills", "meds", "reminders", "prescriptions", "insulin", "injections", "pill box"],
    confirmed: true,
    hideUntilConfirmed: false,
  },
  {
    id: "sv-transport",
    group: "services",
    question: "Can a caregiver take Mom to appointments or errands?",
    answer: [
      "Yes, a caregiver can go with her, so she isn't on her own.",
      pending("[[TO CONFIRM: do caregivers drive clients in their own car or the client's car? Replace this line with the confirmed answer.]]"),
    ],
    keywords: ["drive", "driving", "car", "ride", "transport", "transportation", "doctor", "appointments", "errands", "shopping", "church"],
    confirmed: false,
    hideUntilConfirmed: false,
  },
  {
    id: "sv-memory",
    group: "services",
    question: "Do you help people with memory loss or dementia?",
    answer: [
      pending("[[TO CONFIRM: dementia/Alzheimer's support — do not publish this question until confirmed. Do not add as a service.]]"),
    ],
    keywords: ["dementia", "Alzheimer's", "memory", "memory loss", "confused", "forgetful", "wandering"],
    confirmed: false,
    hideUntilConfirmed: true,
  },

  // ── Cost & payment ──────────────────────────────────────────────────────────
  {
    id: "cost",
    group: "cost-payment",
    question: "How much does home care cost?",
    answer: [
      "It depends on how many hours of help you need. Use our cost estimator for a rough range. Your exact rate is set at your free assessment.",
      "We'll explain your rate clearly at your free visit, before care begins.",
    ],
    link: { label: "Estimate your cost", href: "/paying-for-care#estimator" },
    keywords: ["cost", "price", "rate", "how much", "afford", "expensive", "hourly", "per hour", "per month", "fees"],
    featured: 2,
    confirmed: true,
    hideUntilConfirmed: false,
  },
  {
    id: "medicare",
    group: "cost-payment",
    question: "Does Medicare pay for home care?",
    answer: [
      "Usually not. Medicare generally doesn't cover non-medical home care. Some families use long-term care insurance, VA benefits or Medicaid waiver programs. Ask us which might apply to you.",
      "Medicare does pay for home health — part-time nursing or therapy at home, after a doctor or other provider confirms it's needed, for someone who has trouble leaving home. It doesn't pay for 24-hour care, or for help with bathing, dressing or housekeeping when that's the only help needed.",
    ],
    link: { label: "How Medicare fits with home care", href: "/paying-for-care#pay-medicare" },
    keywords: ["Medicare", "covered", "coverage", "insurance", "Part A", "Part B", "Medicare Advantage", "pay for"],
    featured: 3,
    confirmed: true,
    hideUntilConfirmed: false,
  },
  {
    id: "cp-medicaid",
    group: "cost-payment",
    question: "Does Medicaid pay for home care in South Carolina?",
    answer: [
      "It can. South Carolina's Community Choices waiver is a Medicaid program that pays for help at home — like personal care and companion care — for people who qualify for Medicaid and need the level of care a nursing home gives.",
      "To start, call SCDHHS at (888) 971-1637. There may be a waiting list, so start early.",
      pending('[[TO CONFIRM: is Dawson an approved Community Choices provider? If yes: "We\'re an approved provider — ask us how it works."]]'),
    ],
    link: { label: "Learn about Medicaid waivers", href: "/paying-for-care#pay-medicaid" },
    keywords: ["Medicaid", "waiver", "Community Choices", "SCDHHS", "Healthy Connections", "low income", "state help"],
    confirmed: false,
    hideUntilConfirmed: false,
  },
  {
    id: "cp-ltc",
    group: "cost-payment",
    question: "Will long-term care insurance pay for home care?",
    answer: [
      "Many policies do. Most start paying once your loved one needs help with everyday tasks — often two or more, like bathing and dressing — or has serious memory problems.",
      "There's usually a waiting period first, often 30 to 90 days. Find the policy and call the insurer early to ask what's covered at home.",
      pending("[[TO CONFIRM: does Dawson work with long-term care insurance — care notes, invoices for claims, direct billing?]]"),
    ],
    link: { label: "How long-term care insurance works", href: "/paying-for-care#pay-ltc" },
    keywords: ["long-term care insurance", "LTC", "LTCI", "policy", "claim", "elimination period", "waiting period", "insurance"],
    confirmed: false,
    hideUntilConfirmed: false,
  },
  {
    id: "cp-va",
    group: "cost-payment",
    question: "Are there VA benefits that help pay for care at home?",
    answer: [
      "Yes, for many Veterans and some surviving spouses. Aid and Attendance adds money to a VA pension for people who need help with daily activities. Separately, Veterans enrolled in VA health care may qualify for Homemaker and Home Health Aide care, which the VA approves and arranges.",
      "Your county Veterans Affairs office can help you apply.",
      pending("[[TO CONFIRM: does Dawson accept VA-authorized Homemaker/Home Health Aide care? Do families use Aid and Attendance to pay Dawson?]]"),
    ],
    link: { label: "How VA benefits work", href: "/paying-for-care#pay-va" },
    keywords: ["VA", "veteran", "veterans", "military", "Aid and Attendance", "pension", "widow", "surviving spouse", "housebound"],
    confirmed: false,
    hideUntilConfirmed: false,
  },
  {
    id: "cp-billing",
    group: "cost-payment",
    question: "How does billing work? What payment do you take?",
    answer: [
      "We'll go through your rate and billing at your free visit, before care begins.",
      pending("[[TO CONFIRM: billing frequency (e.g. weekly or every two weeks), payment methods accepted, and whether nights, weekends or holidays cost more]]"),
    ],
    keywords: ["bill", "billing", "invoice", "payment", "credit card", "check", "weekly", "holiday rate", "weekend rate", "deposit"],
    confirmed: false,
    hideUntilConfirmed: false,
  },
  {
    id: "cp-contract",
    group: "cost-payment",
    question: "Is there a contract or a long-term commitment?",
    answer: [
      "The free assessment comes with no obligation.",
      pending("[[TO CONFIRM: service agreement? minimum commitment? notice needed to change or stop care?]]"),
    ],
    keywords: ["contract", "commitment", "cancel", "stop", "notice", "agreement", "sign", "lock in"],
    confirmed: false,
    hideUntilConfirmed: true,
  },

  // ── Caregivers ──────────────────────────────────────────────────────────────
  {
    id: "caregivers",
    group: "caregivers",
    question: "Who will come to my loved one's home?",
    answer: [
      "An experienced Dawson caregiver chosen for your loved one's needs and schedule. Our team includes Certified Nursing Assistants, and our owner stays involved in every client's care.",
      "We match on needs, schedule and personality, and your caregiver learns the plan before the first visit.",
    ],
    link: { label: "Meet our caregivers", href: "/about#caregivers" },
    keywords: ["caregiver", "aide", "who comes", "CNA", "staff", "worker", "helper", "stranger"],
    featured: 5,
    confirmed: true,
    hideUntilConfirmed: false,
  },
  {
    id: "cg-training",
    group: "caregivers",
    question: "What experience and training do your caregivers have?",
    answer: [
      "Our caregivers have years of experience and a genuine love for caregiving. Our team includes Certified Nursing Assistants.",
      pending("[[TO CONFIRM: training every caregiver receives — e.g. orientation, CPR, ongoing training]]"),
    ],
    keywords: ["training", "experience", "certified", "CNA", "qualified", "skills", "trained"],
    confirmed: false,
    hideUntilConfirmed: false,
  },
  {
    id: "cg-meet-change",
    group: "caregivers",
    question: "Can we meet our caregiver first — or ask for someone different?",
    answer: [
      "We choose a caregiver who fits your loved one's needs, schedule and personality, and your caregiver learns the plan before the first visit.",
      pending('[[TO CONFIRM — draft: "You can meet your caregiver before care begins."]]'),
      pending('[[TO CONFIRM — draft: "If the fit isn\'t right, tell us and we\'ll find someone who is."]]'),
    ],
    keywords: ["meet", "choose", "change caregiver", "new caregiver", "different caregiver", "personality", "fit", "match"],
    confirmed: false,
    hideUntilConfirmed: false,
  },
  {
    id: "cg-consistency",
    group: "caregivers",
    question: "Will it be the same caregiver each time? What if they're sick?",
    answer: [pending("[[TO CONFIRM: consistent-caregiver policy, and backup cover when a caregiver is sick or away]]")],
    keywords: ["same caregiver", "consistency", "sick", "vacation", "backup", "no-show", "replacement", "different people"],
    confirmed: false,
    hideUntilConfirmed: true,
  },
  {
    id: "cg-employees",
    group: "caregivers",
    question: "Are caregivers Dawson employees?",
    answer: [
      pending('[[TO CONFIRM: employees (W-2) or contractors? If employees, draft: "Yes. Our caregivers are Dawson employees. We handle their pay, taxes and insurance, so your family doesn\'t have to."]]'),
    ],
    keywords: ["employee", "employees", "contractor", "W-2", "1099", "registry", "taxes", "insurance"],
    confirmed: false,
    hideUntilConfirmed: true,
  },

  // ── Safety & trust ──────────────────────────────────────────────────────────
  {
    id: "st-licensed",
    group: "safety-trust",
    question: "Are you licensed and insured?",
    answer: [
      "Yes. Dawson and Dawson Home Care LLC is licensed in South Carolina and insured.",
      pending("[[TO CONFIRM: SC license number and issuing agency]]"),
    ],
    link: { label: "Licensed & insured — the details", href: "/about#licensed" },
    keywords: ["license", "licensed", "insured", "insurance", "bonded", "legitimate", "state", "certified agency"],
    confirmed: false,
    hideUntilConfirmed: false,
  },
  {
    id: "st-background",
    group: "safety-trust",
    question: "Do you do background checks on caregivers?",
    answer: [pending("[[TO CONFIRM: screening every caregiver goes through — background checks, references, drug tests. List only what's real.]]")],
    keywords: ["background check", "screening", "criminal record", "references", "drug test", "safe", "trust", "vetted"],
    confirmed: false,
    hideUntilConfirmed: true,
  },
  {
    id: "st-owner",
    group: "safety-trust",
    question: "Who's responsible for my mom's care?",
    answer: [
      "Our owner. At Dawson, the person who visits your home for the free assessment is the person who runs the company — and they stay involved in your loved one's care.",
      "We follow up and check in regularly, and we adjust the plan as needs change.",
      pending("[[TO CONFIRM: how often and how we check in — e.g. a call every few weeks]]"),
    ],
    link: { label: "Meet our owner", href: "/about#owner" },
    keywords: ["owner", "manager", "supervisor", "responsible", "in charge", "who to call", "check in", "updates", "supervision"],
    confirmed: false,
    hideUntilConfirmed: false,
  },
  {
    id: "st-concern",
    group: "safety-trust",
    question: "What if something isn't right?",
    answer: [
      "Tell us right away. Call (843) 379-3321 or email info@dawsonhomecare.com. We'd much rather hear about a small problem early than a big one later.",
      pending("Existing clients can reach us after hours at [[TO CONFIRM: after-hours line for existing clients]]."),
    ],
    keywords: ["complaint", "problem", "concern", "unhappy", "issue", "wrong", "feedback", "not working"],
    confirmed: false,
    hideUntilConfirmed: false,
  },
  {
    id: "st-privacy",
    group: "safety-trust",
    question: "Why don't your forms ask about medical details?",
    answer: [
      "To protect your family's privacy. Our online forms ask only what we need to call you back. We talk about care needs by phone or in person.",
      "We never sell or share phone numbers or text-message opt-in information with other companies for their marketing.",
    ],
    link: { label: "Read our Privacy Policy", href: "/privacy-policy" },
    keywords: ["privacy", "private", "data", "information", "secure", "HIPAA", "medical records", "texts", "spam", "sell"],
    confirmed: true,
    hideUntilConfirmed: false,
  },

  // ── Hospice & medical questions ─────────────────────────────────────────────
  {
    id: "hm-nursing",
    group: "hospice-medical",
    question: "Do you provide nursing or medical care?",
    answer: [
      "No. All our care is non-medical. We don't give injections, change wound dressings or provide nursing.",
      "Our team includes Certified Nursing Assistants, and we give medication reminders. If your loved one needs medical care at home, we're happy to work alongside their home health team.",
    ],
    keywords: ["nurse", "nursing", "medical", "wound care", "injections", "skilled", "RN", "LPN", "clinical", "insulin"],
    confirmed: true,
    hideUntilConfirmed: false,
  },
  {
    id: "hm-together",
    group: "hospice-medical",
    question: "Can we have home care and home health at the same time?",
    answer: [
      "Yes, and many families do. Home health visits are usually part-time. We can be there for the hours in between — help with bathing, meals, the house and good company.",
      "Tell us who's on your loved one's care team, and we'll work alongside them.",
    ],
    link: { label: "Home care and home health, side by side", href: "/paying-for-care#pay-medicare" },
    keywords: ["home health", "both", "together", "same time", "therapist", "physical therapy", "nurse visits", "coordinate"],
    confirmed: true,
    hideUntilConfirmed: false,
  },
  {
    id: "hm-hospice",
    group: "hospice-medical",
    question: "Can you help if my loved one is on hospice?",
    answer: [
      pending('[[TO CONFIRM — draft: "Yes. We can provide non-medical comfort and companionship alongside your hospice or palliative team — sitting with your loved one, helping with meals and personal care, and giving the family a chance to rest."]]'),
      pending('[[TO CONFIRM — draft: "Hospice teams usually visit at set times and don\'t stay around the clock. Many families add home care for the hours in between. We don\'t provide medical or nursing care."]]'),
    ],
    keywords: ["hospice", "palliative", "end of life", "comfort care", "terminal", "dying", "last days"],
    confirmed: false,
    hideUntilConfirmed: true,
  },
  {
    id: "hm-referral",
    group: "hospice-medical",
    question: "I'm a discharge planner or case manager. How do I refer someone?",
    answer: [
      "Send a referral online in about 2 minutes, or fax it to (866) 502-3509. You can also call (843) 379-3321.",
      "Please share only the minimum online — the client's first name, last initial and town. We'll talk through care needs by phone.",
      pending("We'll respond within [[TO CONFIRM: referral response time]]."),
    ],
    link: { label: "Make a referral", href: "/for-professionals#refer" },
    keywords: ["referral", "refer", "discharge planner", "case manager", "social worker", "hospital", "fax", "professional", "physician"],
    confirmed: false,
    hideUntilConfirmed: false,
  },
];

/** Home ch. 13: the six featured items in order. Render answer[0] only. */
export const featuredFaqs = faqItems
  .filter((f) => f.featured !== undefined)
  .sort((a, b) => (a.featured ?? 0) - (b.featured ?? 0));
```

---

## Placeholder summary (for `npm run prelaunch`)

**Paying for care**
- Rates (`rateConfirmed: false`) · overnight rate range (`overnightRateMin/Max`) · minimum visit hours
- Billing frequency · payment methods accepted
- Dawson's stance on: long-term care insurance (care notes / invoices / direct billing) · VA Homemaker & Home Health Aide provider status and Aid and Attendance · SC Medicaid waiver (Community Choices) provider status
- Agency checklist answers: license number + issuing agency · insurance coverage types · "ask to see our license" line · employees vs contractors · caregiver screening · training · meet caregiver first · re-match on request · sick/vacation backup · written care plan · check-in frequency · after-hours line for existing clients · night/weekend/holiday rates · minimum hours · billing · contract and notice terms

**FAQ**
- Typical start time · assessment at hospital or rehab · towns served · minimum hours · transport/driving · dementia support (hidden) · Medicaid / LTC / VA stance · billing + payment methods · contract (hidden) · training · meet / re-match drafts · same caregiver + backup (hidden) · employees (hidden) · license number + agency · background checks (hidden) · check-in frequency · after-hours line · hospice support (hidden) · referral response time

**Re-check before launch (public facts, last checked 19 Oct 2026)**
- Medicare home health coverage rules (medicare.gov) · VA Aid and Attendance + Homemaker/Home Health Aide pages (va.gov) · SCDHHS waiver page, referral URL and (888) 971-1637 · Lowcountry AAA URL and (843) 473-3991 · Medicare Advantage in-home support wording
