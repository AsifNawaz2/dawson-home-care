# COPY_TRUST — How It Works, About, Meet the Owner, Caregivers, Reviews, Owner video

**Status:** Final copy for design + build. Use verbatim.
**Pages / blocks:** `/how-it-works` · `/about` (incl. full Meet the Owner) · caregiver spotlight cards · `/reviews` · owner intro video script
**Sources:** 02, 04, 06, 07, 09 (§3 claims), 11, COPY_HOME.md (conventions + approved short versions), COPY_SERVICES.md (tone).
**Reading level:** grade 6–8. **Voice:** warm, calm, plain, local. "Clients", never "patients".

---

## 0. Conventions (read first)

Everything in **COPY_HOME.md §0** applies: `{years}`, `{currentYear}`, `{officeStatus}`, `{nextOpen}`, `[[TO CONFIRM: …]]`, cursor labels, no text on photos, alt-text rule, after-hours CTA switch (**Get a Free Care Assessment** → **Request a Callback**, same destination, `after_hours=true`).

**New tokens used in this file:**

| Token | Source | Fallback while `confirmed: false` |
|---|---|---|
| `{ownerFirstName}` | `content/owner.ts` | "our owner" (lowercase mid-sentence) / "Our owner" (sentence start) |
| `{ownerFullName}` | `content/owner.ts` | `[[TO CONFIRM: owner first and last name]]` |
| `{caregiverYears}` | `currentYear − caregiver.startYear` (see Caregiver cards §2) | `[[TO CONFIRM]]` |

**Draft sentences:** where a whole sentence is a suggestion the owner must confirm or replace, it is wrapped as `[[TO CONFIRM — draft: "…"]]`. It still starts with `[[TO CONFIRM` so `npm run prelaunch` catches it. At the reveal, these render as visible placeholders so the client sees exactly what to fill in.

**Headings:** one H1 per page (the Hero). Section titles are H2. Steps, values, cards, checklist group titles and panel rows are H3.

**Eyebrow numbering:** Hero and CTA band are bookends with no number. Sections in between are numbered **01, 02, …** (format `01 — Our story`).

**Standard CTA band** (used at the bottom of all three pages unless a page overrides the headline). Surface: Dusk band, `data-surface="dusk"` + `data-cursor-theme="dark"`.
- Subline: One call. One free visit at home. No pressure.
- Buttons: Primary **Get a Free Care Assessment** → `/free-assessment` (after hours: **Request a Callback**) · Ghost (cream) **Call (843) 379-3321** → `tel:+18433793321`, cursor label `Call` · Ghost (cream) **Text us (866) 632-9766** → `sms:+18666329766`
- Hours line (always both, always labelled): **Care:** 24 hours a day, 7 days a week · **Office:** Monday–Friday, 8 AM–5 PM
- After-hours line (above the buttons when closed): Our office is closed right now. Request a callback and we'll reach you first thing {nextOpen}.

---
---

# HOW IT WORKS — /how-it-works

## Page meta

- **Title:** How Home Care Works | Dawson & Dawson, Beaufort SC
- **Meta description:** Getting started with home care in Beaufort, SC: one call, a free home visit from our owner, a care plan built with you, and regular check-ins.

**Breadcrumb:** Home › How It Works

---

## 1. Hero

**Eyebrow:** How it works

**Headline (H1):**
> From first call to first visit — here's *exactly* what happens.

**Subline (lead):**
> Five simple steps, no surprises. The first visit is free, at home, and there's no obligation.

**Buttons:**
- Primary: **Get a Free Care Assessment** → `/free-assessment` (after hours: **Request a Callback**)
- Secondary: **Call (843) 379-3321** → `tel:+18433793321` · cursor label `Call`

**Microcopy under buttons:**
> Not ready to talk? Read on. Everything is on this page.

**Jump-to-step bar** (sticky under the header on desktop while the timeline is in view; a horizontal scroll row on mobile). `nav` with `aria-label="Steps"`. Each item is a link to its step anchor; the current step gets `aria-current="step"`.
> 1 Call · 2 Free visit · 3 Your plan · 4 Your caregiver · 5 Check-ins

---

## 01 — The 5 steps

**Section ID:** `steps`
**Eyebrow:** 01 — The 5 steps

**Headline (H2):**
> Getting started is simple.

**Subline:**
> One call. One free visit. Then care that fits.

**Timeline behavior** (07 §4, full-length version): the heartbeat line draws down the page as you scroll; each step's number dot fills when its card reaches the middle of the screen. Desktop: steps alternate left/right. Mobile: single column. Reduced motion: line fully drawn, all steps visible. Steps are an ordered list (`<ol>`). Step illustrations are `aria-hidden`.

**Step card format:** "Step X" label · H3 · lead line (bold) · **What happens** list · **What you do** line · optional note.

---

### Step 1 — Call or text us

**Anchor:** `#step-1`

**Lead:**
> Tell us what's going on. There's no wrong place to start.

**What happens**
- We listen first: what's changed, who needs help and what worries you most.
- We answer your questions — about care, cost and how it all works.
- If home care sounds right, we set a time for your free visit.

**What you do**
> Just call. You don't need to have anything figured out.

**Ways to reach us** (three buttons, 48px+ tall, stacked on mobile):
- **Call (843) 379-3321** → `tel:+18433793321`
- **Text (866) 632-9766** → `sms:+18666329766`
- **Request a call online** → `/free-assessment`

**Note (small, always both lines):**
> **Office:** Monday–Friday, 8 AM–5 PM. **Care:** 24 hours a day, 7 days a week.

**After-hours note (shown only when `{officeStatus}` = closed):**
> Calling after hours? Request a callback and we'll reach you first thing {nextOpen}.

**Referral note (small):**
> Calling from a hospital or care team? **Use our referral form** → `/for-professionals#refer`

---

### Step 2 — Our owner visits — free

**Anchor:** `#step-2` · *(highlighted card)*
**Badge:** The Dawson difference

**Lead:**
> Our owner comes to your loved one's home, meets the family and learns how they like to live.

**What happens**
- We meet your loved one — and you, in person or by phone.
- We talk about their days: their routine, what's getting harder and what they still love doing.
- We look at how the home is set up: the bathroom, the stairs, the path to bed at night.
- We answer every question, including what care will cost.

**What you do**
> Be there if you can. Your loved one's voice matters most.

**Chips:** Free · No obligation · At home

**Why it matters (small, under the chips):**
> At Dawson, the person who visits is the person who runs the company. If anything isn't right later, you already know who to call.

**Photo:** `owner-with-client.jpg` (3:2)
- Alt: Dawson's owner sitting with a family at their kitchen table.
- Placeholder label: "Owner with a family · 3:2"

**Link:** **See what to expect at the visit ↓** → `#free-assessment`

---

### Step 3 — We build your care plan

**Anchor:** `#step-3`

**Lead:**
> Together, we plan the days, the hours and the help — around their routine.

**Your plan covers**
- The help they need — like bathing, meals or company
- Which days and which hours
- Their routines and preferences, down to how they take their coffee
- Who we call, and how you'd like to hear from us
- Your rate, explained clearly before care begins

**What you do**
> Tell us what matters. Nothing is too small.

**Note (hidden until confirmed):**
> You'll get a copy of the plan to keep. `[[TO CONFIRM: families receive a written copy of the care plan]]`

---

### Step 4 — We match your caregiver

**Anchor:** `#step-4`

**Lead:**
> We choose an experienced caregiver who fits your loved one's needs and schedule.

**What happens**
- We match on needs, schedule and personality.
- Your caregiver learns the plan before the first visit.
- `[[TO CONFIRM — draft: "You can meet your caregiver before care begins."]]` *(hidden until confirmed)*
- `[[TO CONFIRM — draft: "If the fit isn't right, tell us and we'll find someone who is."]]` *(hidden until confirmed)*

**What you do**
> Tell us about their personality — what they enjoy, and what gets on their nerves.

**Note (small):**
> Our team includes Certified Nursing Assistants. All our care is non-medical.

---

### Step 5 — We keep checking in

**Anchor:** `#step-5`

**Lead:**
> We follow up regularly and adjust the plan as needs change.

**What happens**
- Our owner stays involved in your loved one's care.
- We check in with you `[[TO CONFIRM: how often and how — e.g. a call every few weeks]]`.
- Need more hours, fewer hours or a different kind of help? We change the plan.
- Family far away? We keep you in the loop the way you prefer.

**What you do**
> Tell us when something changes — good or bad.

**Note (hidden until confirmed):**
> Existing clients can reach us after hours at `[[TO CONFIRM: after-hours line for existing clients]]`.

---

## 02 — What to expect at your free assessment

**Section ID:** `free-assessment` (deep link target from Home FAQ and the assessment form panel)
**Eyebrow:** 02 — Your free visit

**Headline (H2):**
> What to expect at your free assessment.

**Subline:**
> A friendly conversation at home — not an interview, and never a sales pitch.

**Visit facts** (definition list, icon + label + value, two columns on desktop):

| Label | Value |
|---|---|
| **Who comes** | Our owner, {ownerFirstName} *(fallback: "Our owner")* |
| **Where** | Your loved one's home `[[TO CONFIRM: can the visit happen at a hospital or rehab center before discharge?]]` |
| **How long** | `[[TO CONFIRM: typical length, e.g. about an hour]]` |
| **Cost** | Free |
| **Commitment** | None. You decide if and when to start. |
| **Who should be there** | Your loved one, and you or another family member if you can — in person or by phone. |

**Checklist (H3): What we'll cover together** — static list with leaf check icons (`aria-hidden`); items are plain text.
- Their daily routine, from morning to bedtime
- What's getting harder — and what they still do well
- How the home is set up for moving around safely
- Their likes, dislikes and what makes a good day
- The help, hours and schedule that would fit
- What care will cost, and ways families pay
- Your questions — all of them
- Next steps, with no pressure to decide that day

**Two honest notes (H3 each, side by side):**

**What we won't do**
> We won't ask you to sign anything on the spot. We won't do a medical exam — our care is non-medical.

**If your loved one is unsure**
> That's normal. We keep it relaxed and talk *with* them, not about them. Many people warm up once they see it's just a conversation.

---

## 03 — What to have ready

**Section ID:** `have-ready`
**Eyebrow:** 03 — Before the visit

**Headline (H2):**
> What to have ready.

**Subline:**
> Helpful, not required. Tick them off as you go, or print the list.

**Tickable checklist** (native checkboxes; ticks saved in sessionStorage; leaf check animation per 07 §20, none in reduced motion):
- `hr-medicines` — A list of their medicines and when they take them, so we can plan reminders
- `hr-doctors` — Their doctors' names and phone numbers, and any home health or hospice team
- `hr-family` — Family contacts: who we call, and who helps make decisions
- `hr-schedule` — A rough idea of the days and hours you have in mind
- `hr-paperwork` — Any long-term care insurance or VA paperwork, if you have it
- `hr-questions` — Your questions, written down

**Progress line** (polite live region, hidden at 0): **{n} of 6 ready.** At 6: **All set. We'll take it from here.**

**Reassurance line:**
> Don't have everything? Come as you are. We'll fill in the gaps together.

**Paperwork note (small, under `hr-paperwork`):**
> We'll talk about whether it applies to your loved one's care.

**Button:** Ghost — **Print this list** (calls `window.print()`; print stylesheet prints only this section, with empty boxes and the Dawson phone number in the footer)

**Privacy note (small):**
> Please don't send medical details through our website. We'll go through everything in person.

---

## 04 — How fast can care start?

**Section ID:** `start-time`
**Eyebrow:** 04 — Timing

**Headline (H2):**
> How fast can care start?

**Body (shown now):**
> It depends on the help you need and when you need it. Tell us your timing on the first call. If it's urgent, say so — we'll move as quickly as we can.

**Line (hidden until confirmed):**
> Many families start care within `[[TO CONFIRM: typical time from first call to first shift]]` of their first call.

**Callout card (H3):**
> **Coming home from the hospital?**
> Call us before discharge if you can. We'll plan the first days home so there's no gap in care.

**Button:** Ghost — **Call (843) 379-3321** → `tel:+18433793321` · cursor label `Call`

---

## CTA band

Standard CTA band (§0) with this headline:

**Headline (H2, display-l):**
> Step one is a *phone call*.

---
---

# ABOUT — /about

## Page meta

- **Title:** About Dawson & Dawson Home Care | Beaufort, SC Since 2002
- **Meta description:** Dawson and Dawson Home Care has cared for Lowcountry families since 2002. Owner-run, licensed and insured, with an office in Beaufort, SC.

**Breadcrumb:** Home › About

---

## 1. Hero

**Eyebrow:** About us

**Headline (H1):**
> Here since 2002. Still *personal*.

**Subline (lead):**
> Dawson and Dawson Home Care is owner-run, licensed and insured, with an office right here in Beaufort. For {years} years, we've helped Lowcountry families stay at home.

**Buttons:**
- Primary: **Get a Free Care Assessment** → `/free-assessment` (after hours: **Request a Callback**)
- Ghost: **Meet our owner** → `#owner`

**Trust row:**
> Since 2002 · Owner-run · Licensed & insured · Care 24/7

**Image:** `team-group.jpg` (16:9)
- Alt: The Dawson and Dawson Home Care team together.
- Placeholder label: "Our team · 16:9"

---

## 01 — Story since 2002

**Section ID:** `story`
**Eyebrow:** 01 — Our story

**Headline (H2):**
> {years} years of caring for Lowcountry families.

**Counter:** same component as Home ch. 6 (`aria-hidden`, H2 carries the number; reduced motion shows the final number).

**Body:**
> Dawson and Dawson Home Care began in 2002. `[[TO CONFIRM — draft: "It started with a simple idea: older people deserve to stay in the homes they love, with help from people who treat them like family."]]`
>
> `[[TO CONFIRM: why the name "Dawson and Dawson" — e.g. who the two Dawsons are]]`
>
> A lot has changed in home care since then. Some things haven't. Our owner still meets every family personally and keeps working with each client to make sure care is done right. Our caregivers bring years of experience and a real love for this work. And care is there when families need it — 24 hours a day, 7 days a week.
>
> Our office is on Robert Smalls Parkway in Beaufort. The families we care for are our neighbors.

**Line (hidden until confirmed):**
> We're independent and locally owned — not a franchise. `[[TO CONFIRM: independent, not part of a franchise]]`

**Timeline** (horizontal on desktop, vertical on mobile; only confirmed milestones render):
- **2002** — We begin caring for Lowcountry families.
- `[[TO CONFIRM: optional milestones — e.g. office move, new services. Data: { year, text, confirmed:false }. Not rendered until confirmed. Never invent.]]`
- **{currentYear}** — {years} years later, still here.

---

## 02 — Meet the owner (full)

**Section ID:** `owner` (deep link from Home ch. 7 "Read our story" and the About hero)
**Eyebrow:** 02 — Meet the owner

**Headline (H2):**
> Meet {ownerFirstName}. *(fallback until confirmed: "Meet our owner.")*

**Subline:**
> The person who runs Dawson is the person who comes to your home.

**Layout:** split. Left: portrait + "At a glance" card + video. Right: the letter, set as an editorial letter (Fraunces for the greeting and sign-off, Plus Jakarta Sans for the body), ending with the SVG signature.

### The letter

> Hello. I'm {ownerFullName}, and I run Dawson and Dawson Home Care.
>
> `[[TO CONFIRM — draft: "I've worked in health and home care since [[year]]. Before that, I [[one line on background]]."]]`
>
> `[[TO CONFIRM — draft: "In 2002, I started Dawson and Dawson because I saw how much families here needed care they could trust — and how hard it was to find."]]`
>
> Here's how I run this company: I meet every family myself. I come to your loved one's home, sit down with you and learn how they like their days to go — when they wake up, how they take their coffee, what they're proud of and what's gotten hard. Then we build the plan together.
>
> I don't disappear after that first visit. I stay involved. We check in, we listen, and when something needs to change, we change it.
>
> Our caregivers have years of experience and a real love for this work, and our team includes Certified Nursing Assistants. `[[TO CONFIRM — draft: "I look for people who are patient, kind and reliable — the kind of person I'd trust with my own mother."]]`
>
> `[[TO CONFIRM: one personal sentence — family, faith, life in Beaufort, what they love about the Lowcountry]]`
>
> If you're reading this late at night, worried about someone you love: you don't have to figure this out alone. Call us at (843) 379-3321. `[[TO CONFIRM — draft: "During office hours, you'll often get me on the phone."]]` We'll work it out together.

**Sign-off:**
> {ownerFirstName}

**Signature:** `owner-signature.svg`, `aria-hidden`. Visible name line below: **{ownerFullName}, Owner**

**Pull quote** (sits between paragraphs 4 and 5 on desktop, after the letter on mobile; same quote as Home ch. 7):
> "[[TO CONFIRM: owner quote — one sentence about why they do this work]]"

### At a glance (card beside the portrait)

H3: **At a glance** — definition list. Each row renders only when its value is confirmed (`confirmed:false` rows are hidden at launch, visible as placeholders at the reveal).

| Label | Value |
|---|---|
| **Role** | Owner, Dawson and Dawson Home Care |
| **In home care since** | `[[TO CONFIRM: year]]` |
| **Credentials** | `[[TO CONFIRM: real credentials only — e.g. CNA. An owner's personal credential never makes the agency's care medical.]]` |
| **Lowcountry roots** | `[[TO CONFIRM: hometown or years in Beaufort]]` |

### Portrait

- File: `owner-portrait.jpg` (4:5)
- Alt: {ownerFullName}, owner of Dawson and Dawson Home Care, at the Beaufort office.
- Placeholder label: "Owner portrait · 4:5"

### Video (under the portrait)

Same player and labels as COPY_HOME ch. 7:
- Play button text: **Watch a short hello**
- Accessible name: Play video: a short hello from {ownerFullName}, with captions
- Cursor label: `Play`
- Under the player: **Captions on** · **Read the transcript** (toggle → **Hide the transcript**)
- Coming-soon state: **Video coming soon** — A short hello from our owner is on its way.
- Script: see **OWNER INTRO VIDEO** below.

### Two-owner variant (if "Dawson and Dawson" is two people)

Switch at the reveal if confirmed. Same structure, "we" voice, two portraits side by side, two signatures.
- Headline: **Meet {owner1FirstName} and {owner2FirstName}.**
- Subline: **The people who run Dawson are the people who come to your home.**
- Letter opening: "Hello. We're {owner1FullName} and {owner2FullName}, and together we run Dawson and Dawson Home Care."
- Paragraph 3 opening: "Here's how we run this company: one of us meets every family personally."
- Sign-off: both first names; name line **{owner1FullName} & {owner2FullName}, Owners**
- `[[TO CONFIRM: one owner or two? Relationship between them, if two.]]`

---

## 03 — Our values (4 pillars)

**Section ID:** `values`
**Eyebrow:** 03 — What we stand for

**Headline (H2):**
> What we stand for.

**Subline:**
> Four things you can count on — and what each one means for your family.

**Cards** (line icon `aria-hidden` · H3 · what it is · "What it means for you" line in bold label). Hover tilt per 07 §20; nothing is hidden behind hover.

**The owner stays involved**
> Our owner meets every family and keeps working with each client to make sure care is done right.
> **What it means for you:** You always know who's responsible.

**Care when you need it**
> Care is available 24 hours a day, 7 days a week — a few hours or around the clock.
> **What it means for you:** Nights, weekends and holidays are covered. Our office is open Monday–Friday, 8 AM–5 PM.

**Caregivers who love this work**
> Our caregivers have years of experience and a genuine love for caregiving. Our team includes Certified Nursing Assistants.
> **What it means for you:** Your loved one is cared for by people who chose this work.

**Family, not a file number**
> We follow up, check in and treat every client like part of our family.
> **What it means for you:** When something changes, we notice — and we change the plan with you.

---

## 04 — Our caregivers (grid)

**Section ID:** `caregivers` (deep link from Home ch. 8 "Meet the team")
**Eyebrow:** 04 — Our caregivers

**Headline (H2):**
> Meet the people who do the caring.

**Subline:**
> Experienced caregivers — including Certified Nursing Assistants — with a real love for this work.

**Grid:** caregiver spotlight cards in **grid variant** (see CAREGIVER SPOTLIGHT CARDS §1): 3 columns desktop, 2 tablet, 1 mobile. Quote always visible under the photo — no flip on this page.

**Below the grid:**
> `[[TO CONFIRM — draft: "Every Dawson caregiver goes through [[background check / screening steps]] before they meet a client."]]` *(hidden until confirmed — never claim screening specifics before then)*

**Links:**
- Ghost: **Want to join them? See caregiver jobs** → `/careers`

---

## 05 — Licensed & insured panel

**Section ID:** `licensed` (deep link from Home ch. 6 "Licensed & insured →"; when the page loads with `#licensed`, scroll to the panel and move focus to its H2)
**Eyebrow:** 05 — Licensed & insured

**Headline (H2):**
> Licensed & insured. Here's what that means.

**Subline:**
> You're letting someone into your family's home. You should know exactly who we are.

**Panel rows** (bordered panel, icon + H3 + text; rows marked "hidden until confirmed" don't render at launch while `confirmed:false`):

**State license**
> Dawson and Dawson Home Care LLC is licensed in South Carolina.
> License number: `[[TO CONFIRM: SC license number]]`
> Issued by: `[[TO CONFIRM: issuing agency — likely the SC Department of Public Health]]`

**Insured**
> We carry insurance. `[[TO CONFIRM: coverage types — e.g. general liability, workers' compensation, bonding. List only what's real.]]`

**Our caregivers**
> Our team includes Certified Nursing Assistants.
> `[[TO CONFIRM: screening every caregiver goes through — background checks, references, training]]` *(hidden until confirmed)*

**Non-medical care**
> All our care is non-medical. We don't give injections, change wound dressings or provide nursing. We're happy to work alongside your home health or hospice team.

**Check it yourself** *(hidden until confirmed)*
> Look up our license on the state's website → `[[TO CONFIRM: public license lookup URL]]`
> `[[TO CONFIRM — draft: "Ask to see our license and insurance certificate at your free visit."]]`

---

## 06 — Community (Lowcountry photos)

**Section ID:** `community`
**Eyebrow:** 06 — Our community

**Headline (H2):**
> Part of the Lowcountry.

**Body:**
> Our office is on Robert Smalls Parkway in Beaufort. We've cared for families here since 2002 — in Beaufort and across the Lowcountry.

**Line (hidden until confirmed):**
> `[[TO CONFIRM: community involvement — churches, organizations, local events. Show only if real.]]`

**Photos** (3-up row, license-safe local scenery; all decorative unless they show something specific):

| File | Alt | Placeholder label |
|---|---|---|
| `office-exterior.jpg` (3:2) | The Dawson and Dawson Home Care office on Robert Smalls Parkway in Beaufort. | "Our office · 3:2" |
| `community-01.jpg` (3:2) | `alt=""` (decorative: Lowcountry marsh and live oaks) | "Lowcountry scene · 3:2" |
| `community-02.jpg` (3:2) | `alt=""` (decorative: Beaufort street or waterfront) | "Beaufort scene · 3:2" |

**Links:**
- Text link: **Get directions to our office** → `http://goo.gl/maps/SVvYGS3TipaMpbgQ9`
- Text link: **Follow us on Instagram** → `https://www.instagram.com/dawsonhomecare/`

---

## CTA band

Standard CTA band (§0) with this headline:

**Headline (H2, display-l):**
> Let's talk about your *family*.

---
---

# MEET THE OWNER — fill-in guide & data

The copy lives in About §02 (full) and COPY_HOME ch. 7 (short). This section is for the reveal: what to ask the owner, and the data file that feeds both.

## 1. Fill-in questions (ask at the reveal, ~15 minutes)

| Slot | Ask |
|---|---|
| Name(s) | What name should families call you? Is "Dawson and Dawson" one owner or two? |
| Background | When did you start in health or home care, and what did you do before Dawson? |
| Founding | What made you start the agency in 2002? |
| The name | Who are the two Dawsons? |
| Team | What do you look for when you hire a caregiver? How are caregivers screened? |
| Personal | What do you love about Beaufort and the Lowcountry? Family, faith, hobbies you're happy to share? |
| Phone | During office hours, do families often reach you directly? |
| Quote | Finish this sentence: "I do this work because…" |
| At a glance | Year you started in home care · any credentials · hometown or years in Beaufort |
| Assets | Portrait (4:5) · signature on white paper (to trace) · 60–90s video |

Rule: use the owner's own words where possible. Edit for length and reading level, never for meaning.

## 2. `content/owner.ts`

```ts
export type Owner = {
  firstName: string;
  fullName: string;
  title: string;
  inHomeCareSince: number | null;
  credentials: string | null;   // real credentials only
  roots: string | null;
  quote: string;
  letter: string[];             // paragraphs, in order (About §02)
  homeSummary: string;          // COPY_HOME ch. 7 short body
  portrait: string;
  signature: string;
  video: { src: string; captions: string; poster: string; transcript: string } | null;
  confirmed: boolean;
};

export const owners: Owner[] = [
  {
    firstName: "[[TO CONFIRM: owner first name]]",
    fullName: "[[TO CONFIRM: owner first and last name]]",
    title: "Owner",
    inHomeCareSince: null,
    credentials: null,
    roots: null,
    quote: "[[TO CONFIRM: owner quote — one sentence about why they do this work]]",
    letter: [], // paste About §02 letter paragraphs verbatim
    homeSummary: "", // paste COPY_HOME ch. 7 body verbatim
    portrait: "/images/placeholders/owner-portrait.jpg",
    signature: "/images/placeholders/owner-signature.svg",
    video: null,
    confirmed: false,
  },
];
// One owner → owners.length === 1 → singular copy. Two → plural variant (About §02).
```

---
---

# CAREGIVER SPOTLIGHT CARDS

Used in: Home ch. 8 (carousel, flip) · About §04 (grid, no flip) · Careers (grid, later).

## 1. Card format

**Front**
- Photo: `caregiver-0X.jpg` (4:5). Alt: **{firstName}, a Dawson caregiver.**
- Name (H3): **{firstName}** — first name only, always
- Line 1: **{caregiverYears}** (see §2)
- Line 2: **{specialty}** — ≤ 32 characters, plain words (e.g. a service name or "Mornings and mealtimes")
- Credential chip (optional): **CNA** — only if confirmed for *this* person
- Sample chip (placeholders only): **Sample** — top-left, uses the standard chip component; announced as "Sample card" to screen readers
- Carousel variant: flip button **Why I do this**

**Back** (carousel variant)
- Label: **Why I do this**
- Quote: "{quote}" — ≤ 160 characters, the caregiver's own words
- Button: **Back to photo**

**Grid variant (About):** no flip. Quote sits under Line 2 with the label **Why I do this**.
**Reduced motion (both):** no flip; grid layout of the quote below the photo.

**Rules**
- Never realistic fake names. Placeholders are always **Caregiver Name**.
- Publish a caregiver only with written permission for their name, photo and quote (`consentOnFile: true`).
- No last names, ages, neighborhoods or anything that identifies a caregiver's home.
- Quotes: edit for length and spelling only.

## 2. Years line (computed, never hard-coded)

`caregiverYears = currentYear − startYear`

| Value | Shows |
|---|---|
| `startYear` is `null` | `[[TO CONFIRM]] years with Dawson` |
| 0 | New to Dawson this year |
| 1 | 1 year with Dawson |
| 2+ | {n} years with Dawson |

## 3. Six sample cards (clearly marked — `placeholder: true`)

Varying quote lengths so the design and build are tested at short, medium and full length.

| # | Photo slot | Name | Line 1 | Line 2 | Quote |
|---|---|---|---|---|---|
| 1 | `caregiver-01.jpg` | Caregiver Name | [[TO CONFIRM]] years with Dawson | [[TO CONFIRM: specialty]] | "This is a sample card. A real caregiver's words will go here." |
| 2 | `caregiver-02.jpg` | Caregiver Name | [[TO CONFIRM]] years with Dawson | [[TO CONFIRM: specialty]] | "Sample quote. A caregiver shares why they love this work." |
| 3 | `caregiver-03.jpg` | Caregiver Name | [[TO CONFIRM]] years with Dawson | [[TO CONFIRM: specialty]] | "Sample quote. This longer sample tests the card at full length, so the layout holds when a caregiver has more to say about their work." |
| 4 | `caregiver-04.jpg` | Caregiver Name | [[TO CONFIRM]] years with Dawson | [[TO CONFIRM: specialty]] | "Sample quote. Real words, coming soon." |
| 5 | `caregiver-05.jpg` | Caregiver Name | [[TO CONFIRM]] years with Dawson | [[TO CONFIRM: specialty]] | "This is a sample card. Each caregiver will tell families, in their own words, why they do this work." |
| 6 | `caregiver-06.jpg` | Caregiver Name | [[TO CONFIRM]] years with Dawson | [[TO CONFIRM: specialty]] | "Sample quote. This card will feature a real Dawson caregiver after the reveal." |

Photo placeholder label (all): "Caregiver portrait · 4:5"

## 4. Questions to collect real cards (after the reveal)

Ask each caregiver, then pick the best answer for the quote:
1. What made you choose caregiving?
2. What's the best part of your day with a client?
3. What would you want a worried family to know about you?
4. What do you enjoy doing with clients — cooking, cards, walks, music?
5. What year did you start with Dawson?

## 5. `content/caregivers.ts`

```ts
export type Caregiver = {
  id: string;
  firstName: string;
  startYear: number | null;      // years computed in code
  specialty: string | null;      // ≤ 32 chars
  credential: "CNA" | null;      // only if confirmed for this person
  quote: string;                 // ≤ 160 chars, their own words
  photo: string;
  consentOnFile: boolean;        // written OK for name, photo, quote
  placeholder: boolean;
};

const ph = (n: number, quote: string): Caregiver => ({
  id: `sample-${n}`,
  firstName: "Caregiver Name",
  startYear: null,
  specialty: null,
  credential: null,
  quote,
  photo: `/images/placeholders/caregiver-0${n}.jpg`,
  consentOnFile: false,
  placeholder: true,
});

export const caregivers: Caregiver[] = [
  ph(1, "This is a sample card. A real caregiver's words will go here."),
  ph(2, "Sample quote. A caregiver shares why they love this work."),
  ph(3, "Sample quote. This longer sample tests the card at full length, so the layout holds when a caregiver has more to say about their work."),
  ph(4, "Sample quote. Real words, coming soon."),
  ph(5, "This is a sample card. Each caregiver will tell families, in their own words, why they do this work."),
  ph(6, "Sample quote. This card will feature a real Dawson caregiver after the reveal."),
];
// Render rule: placeholder → show "Sample" chip. Launch rule: no placeholder or consentOnFile:false cards ship.
// If fewer than 3 real cards at launch: hide Home ch. 8 and About §04 grid; keep the careers link.
```

---
---

# REVIEWS — /reviews

## Page meta

- **Title:** Reviews | Dawson & Dawson Home Care, Beaufort SC
- **Meta description:** Read what Lowcountry families say about Dawson and Dawson Home Care — owner-run, non-medical home care in Beaufort, SC since 2002.

**Breadcrumb:** Home › About › Reviews

**Schema note:** no `AggregateRating` or `Review` markup on our own `LocalBusiness` (Google treats self-hosted reviews of your own business as self-serving and ignores or penalizes them). The Google rating is shown as text only.

---

## 1. Hero

**Eyebrow:** Reviews

**Headline (H1):**
> In their *words*.

**Subline (lead):**
> What Lowcountry families say about the care we give the people they love.

**Buttons:**
- Primary: **Get a Free Care Assessment** → `/free-assessment` (after hours: **Request a Callback**)
- Ghost: **Leave a review** → `#leave-a-review`

---

## 01 — Rating summary

**Section ID:** `rating` · *hidden until confirmed*
**Eyebrow:** 01 — On Google

**Display:** large number + stars + count, one line on mobile.
> **[[TO CONFIRM: rating]]** out of 5 on Google
> Based on [[TO CONFIRM: count]] Google reviews

Stars are `aria-hidden`; screen-reader text: "Rated [[rating]] out of 5 on Google, from [[count]] reviews."

**Text link:** **Read them on Google** → `[[TO CONFIRM: Google Business Profile reviews URL]]` (small text after the link: "goes to Google")

---

## 02 — Review grid (with filter chips by service)

**Section ID:** `reviews`
**Eyebrow:** 02 — Reviews from families

**Headline (H2):**
> Reviews from families.

**Filter** (single-select toggle buttons, `aria-pressed`; group label visible):
- Label: **Show reviews about:**
- Chips: **All ({n})** · **Personal Care ({n})** · **Home Help ({n})** · **Companionship ({n})** · **Respite Care ({n})** · **24-Hour & Overnight Care ({n})**
- Chips with 0 reviews are not rendered. Reviews with no service appear under **All** only.
- Deep link: `/reviews?service={slug}` preselects a chip (service pages may link here).
- Live region (polite) after a change: "Showing {n} reviews about {service}." / "Showing all {n} reviews."
- Reduced motion: no reflow animation; the grid swaps instantly.

**Review card** (same as COPY_HOME ch. 9, plus date and source):
- Stars (visual) + screen-reader text: "Rated {rating} out of 5"
- Quote: "{text}" — reviews over 600 characters are clamped with **Read the full review** / **Show less** (button, `aria-expanded`)
- Attribution: — {name}, {relation} · {town}
- Service chip: {service}
- Meta (small): {Month YYYY} · From {source} — "Google" links to the review when `url` exists
- Placeholder cards: **Sample** chip; attribution shows "— Sample Review" only.

**Load more** (when more than 12): **Show more reviews** → appends 12; live region: "{n} more reviews shown."

**Privacy line (small, under the grid):**
> To protect privacy, we show first names and last initials only.

**Honesty line (small):**
> Every review on this page comes from a real Dawson client or family member. `[[TO CONFIRM — draft: "We share the good and the not-so-good — we never hide a review because we didn't like it."]]`

---

## 03 — Video testimonial slots

**Section ID:** `video-stories` · *hidden until at least one real video exists*
**Eyebrow:** 03 — Family stories

**Headline (H2):**
> Hear it from families.

**Slots** (`testimonial-01…03.mp4` + `.vtt` + poster, 16:9; 1-up mobile, 3-up desktop):
- Play button text: **Watch {name}'s story**
- Accessible name: Play video: {name}'s story, with captions
- Cursor label: `Play`
- Under each player: **Captions on** · **Read the transcript** (toggle → **Hide the transcript**)
- Placeholder label: "Family story video · 16:9"
- Poster alt: {name}, {relation}, talking about Dawson.

Rule: written permission from everyone on camera. No client shown without their (or their legal representative's) written OK.

---

## 04 — "Leave a review"

**Section ID:** `leave-a-review`
**Eyebrow:** 04 — Share your experience

**Headline (H2):**
> Is Dawson caring for your family?

**Body:**
> We'd be grateful if you'd share your experience. Your words help other Lowcountry families decide with confidence.

**Button:** Primary — **Leave a review on Google** → `[[TO CONFIRM: Google review link]]`
**Small under button:** Goes to Google. You'll need a Google account.

**Second card (H3): Something we could do better?**
> Tell us directly. Call (843) 379-3321 or email info@dawsonhomecare.com. `[[TO CONFIRM — draft: "{ownerFirstName} reads every message."]]`

**Links:**
- **Call (843) 379-3321** → `tel:+18433793321` · cursor label `Call`
- **Email us** → `mailto:info@dawsonhomecare.com`

---

## CTA band

Standard CTA band (§0) with this headline:

**Headline (H2, display-l):**
> Let's talk about your *family*.

---

## Launch rules

- **Reviews:** real only. `placeholder: true` items fail `npm run prelaunch`.
- **Fewer than 3 real reviews at launch:** keep `/reviews` live but `noindex`, remove it from the About menu and footer, hide §01–§03, and show this state above §04:
  > **We're gathering reviews.** Families have trusted us since 2002 — and we're now collecting their stories here. Is Dawson caring for your family? We'd love to hear from you.
- **Never** offer gifts or discounts for reviews, and never ask only happy clients (review gating). Ask every client the same way. Follow the FTC rules on reviews and testimonials.

## `content/reviews.json` (8 samples)

```json
[
  { "id": "sample-1", "name": "Sample Review", "relation": null, "town": null, "service": "personal-care", "rating": 5, "text": "This is a sample review. Real reviews from Dawson families will replace it before launch.", "date": null, "source": null, "url": null, "placeholder": true },
  { "id": "sample-2", "name": "Sample Review", "relation": null, "town": null, "service": "home-help", "rating": 5, "text": "Sample review. A family will share how care helped at home.", "date": null, "source": null, "url": null, "placeholder": true },
  { "id": "sample-3", "name": "Sample Review", "relation": null, "town": null, "service": "companionship", "rating": 5, "text": "This is a longer sample review. It tests how the card looks when a family writes a few sentences about their experience. Real reviews will vary in length, so the grid needs to handle short and long ones side by side without looking uneven. This text will be replaced with a real review before launch.", "date": null, "source": null, "url": null, "placeholder": true },
  { "id": "sample-4", "name": "Sample Review", "relation": null, "town": null, "service": "respite-care", "rating": 5, "text": "Sample review. Coming soon.", "date": null, "source": null, "url": null, "placeholder": true },
  { "id": "sample-5", "name": "Sample Review", "relation": null, "town": null, "service": "24-hour-care", "rating": 5, "text": "This is a sample review about 24-hour care. A real family's words will go here.", "date": null, "source": null, "url": null, "placeholder": true },
  { "id": "sample-6", "name": "Sample Review", "relation": null, "town": null, "service": "personal-care", "rating": 5, "text": "Sample review. A real Dawson family will be quoted here after the reveal.", "date": null, "source": null, "url": null, "placeholder": true },
  { "id": "sample-7", "name": "Sample Review", "relation": null, "town": null, "service": "home-help", "rating": 5, "text": "This is a sample review. It will be replaced with a real Google review.", "date": null, "source": null, "url": null, "placeholder": true },
  { "id": "sample-8", "name": "Sample Review", "relation": null, "town": null, "service": null, "rating": 5, "text": "Sample review with no service tag. It appears under All only.", "date": null, "source": null, "url": null, "placeholder": true }
]
```

---
---

# OWNER INTRO VIDEO — 60–90 second script

**File:** `owner-intro.mp4` + `owner-intro.vtt` + poster · **Used in:** Home ch. 7, About §02
**Length:** about 195 words → **about 80 seconds** at a calm pace (140–150 words a minute).
**Tone:** like talking to one worried daughter across a kitchen table. Not a commercial.
**Note to the owner:** this is a guide, not a script to memorize. Say it in your own words. The transcript on the site must match what you actually say.

| Time | Spoken | On screen |
|---|---|---|
| 0:00–0:08 | Hi. I'm {ownerFullName}, and I own Dawson and Dawson Home Care, right here in Beaufort. | Lower third: **{ownerFullName}** · Owner, Dawson and Dawson Home Care |
| 0:08–0:20 | We've been caring for families across the Lowcountry since 2002. `[[TO CONFIRM: one sentence in the owner's words — why they started, or why they still do this work]]` | — |
| 0:20–0:42 | Here's what makes us different. When you call, I come to your loved one's home myself. I meet your mom or dad, I see how they like to live, and we build a care plan together. That visit is free, and there's no obligation. | Optional b-roll: owner at a kitchen table with a family (`owner-with-client` shoot) |
| 0:42–0:58 | We help with the everyday things — bathing and dressing, meals and housework, medication reminders, good company, and care through the night. A few hours a week, or around the clock. All of it is non-medical, and we're happy to work alongside your home health team. | Optional b-roll: caregiver and client cooking, walking, playing cards |
| 0:58–1:05 | Once care starts, I stay involved, and we keep checking in. | — |
| 1:05–1:20 | If you're worried about someone you love, you don't have to figure this out alone. Call us at eight-four-three, three-seven-nine, thirty-three twenty-one. Our office is open Monday through Friday, eight to five — and our care is there twenty-four hours a day, seven days a week. | Text: **(843) 379-3321** |
| 1:20–1:25 | I'd love to meet your family. | End card: **(843) 379-3321** · dawsonhomecare.com · **Care:** 24/7 · **Office:** Mon–Fri, 8 AM–5 PM |

**Transcript (default, until the real one replaces it):**
> Hi. I'm {ownerFullName}, and I own Dawson and Dawson Home Care, right here in Beaufort. We've been caring for families across the Lowcountry since 2002. [[TO CONFIRM: owner's sentence]] Here's what makes us different. When you call, I come to your loved one's home myself. I meet your mom or dad, I see how they like to live, and we build a care plan together. That visit is free, and there's no obligation. We help with the everyday things — bathing and dressing, meals and housework, medication reminders, good company, and care through the night. A few hours a week, or around the clock. All of it is non-medical, and we're happy to work alongside your home health team. Once care starts, I stay involved, and we keep checking in. If you're worried about someone you love, you don't have to figure this out alone. Call us at (843) 379-3321. Our office is open Monday through Friday, 8 to 5 — and our care is there 24 hours a day, 7 days a week. I'd love to meet your family.

**Two-owner version:** each owner says their own name in the opening (0:00–0:08); "I come" → "one of us comes"; "I stay involved" → "we stay involved". Same length.

**Filming notes (hand to whoever films):**
- Landscape (16:9), phone on a tripod at eye level, about 4 feet away.
- Face a window for soft light. No bright window behind.
- Quiet room. A clip-on mic plugged into the phone makes the biggest difference.
- Solid colors, no fine stripes.
- Look at the lens, not the screen. Record 3 takes; pick the warmest, not the most polished.
- Location: the Beaufort office, or a porch with permission. No clients on camera without written permission.
- Captions: `.vtt` from the final edit, checked by a person. No burned-in captions (they can't be resized).
- No music under the voice, or very quiet music only. No autoplay with sound.

---
---

## Placeholder summary (for `npm run prelaunch`)

**Owner**
- Name(s), one owner or two, relationship · background · founding story · name origin · team-hiring sentence · personal sentence · "you'll often get me on the phone" · quote · at-a-glance rows (since, credentials, roots)
- Portrait, signature, intro video + captions + transcript (+ owner's sentence in the script)

**How It Works**
- Written copy of the care plan · meet caregiver before care begins · re-match on request · check-in frequency and method · after-hours line for existing clients
- Assessment: hospital/rehab visits · typical visit length
- Typical start time

**About**
- Founding idea draft · independent/not a franchise · optional timeline milestones · caregiver screening sentence
- License number, issuing agency, insurance types, screening specifics, public lookup URL, "ask to see our license" line
- Community involvement · `team-group.jpg`, `office-exterior.jpg`, `community-01/02.jpg`

**Caregivers**
- All 6 cards (`placeholder: true`), photos, start years, specialties, credentials, written consent

**Reviews**
- All 8 reviews (`placeholder: true`) · Google rating + count · Google reviews URL · Google review link · "we never hide a review" policy · "{ownerFirstName} reads every message" · video testimonials (optional)
