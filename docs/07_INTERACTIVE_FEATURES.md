# 07 — INTERACTIVE FEATURES (all approved — skip nothing)

Every feature must: work on mobile, work by keyboard, have a reduced-motion version, have a no-JS/text fallback where sensible, and push useful context into the lead form (so GoHighLevel knows what the family explored).

---

## 1. Care Quiz — "Find the right care" (`/find-care` + inline teaser on Home)
**Goal:** turn a confused visitor into a qualified lead with a recommended care plan.
**UX:** one question per screen, big tappable answer cards with line illustrations, progress bar (heartbeat line filling), Back button, ~60 seconds total.

| # | Question | Answers (multi-select where noted) |
|---|---|---|
| 1 | Who is the care for? | My parent · My spouse/partner · Myself · Someone else |
| 2 | What's happening right now? (multi) | Needs help bathing or dressing · Struggling to keep up with the house · Feeling lonely or isolated · Recently home from hospital · Can't safely be alone at night · Family caregiver needs a break · Receiving hospice/palliative care |
| 3 | How much help do you think is needed? | A few hours a week · A few hours most days · Full days · Around the clock |
| 4 | When do you need care to start? | As soon as possible · Within 2 weeks · Within a month · Just exploring |
| 5 | Where do they live? | Town dropdown (service-area list) + "Other" |

**Scoring → recommendation**
- Bathing/dressing → Personal Care
- House → Home Help
- Lonely → Companionship
- Caregiver break → Respite Care
- Alone at night OR "around the clock" → 24-Hour & Overnight Care
- Hospital → Personal Care + Home Help (transition support)
- Hospice → "Support alongside your hospice team" `[[TO CONFIRM]]` + Companionship
Result screen: "Here's what we'd suggest for your mom" (pronoun from Q1) — primary service card + 1–2 "also helpful", estimated weekly hours from Q3, a mini estimator, and CTA **"Book your free assessment"** with all answers **prefilled** into the assessment form. Option: "Email me this plan" (requires email + consent).
Data: `quiz.ts` (questions, mapping); answers saved to sessionStorage; sent as GHL tags/custom fields (`quiz_services`, `quiz_hours`, `quiz_urgency`, `quiz_town`, `quiz_for`).

## 2. Cost Estimator (`/paying-for-care` + compact on Home & service pages)
- Inputs: **hours per visit** slider (2–24) · **days per week** stepper (1–7) · optional **overnight/24-hour** toggle
- Output: weekly hours (big animated number), illustrative weekly and monthly cost range, a small bar showing "a few hours ↔ round the clock"
- Formula: `weeklyHours = hoursPerVisit × days`; `cost = weeklyHours × rate` (range = rate.min–rate.max); monthly = weekly × 4.33
- Rates live in `site.config.ts`: `{ rateMin, rateMax, minimumVisitHours, rateConfirmed: false }`
- While `rateConfirmed:false`: show **"Illustrative estimate"** badge + text *"Your exact rate is set at your free assessment."* (switch off before launch, or hide prices and show hours only — decide at reveal)
- Comparison toggle (optional, only with confirmed sources): home care vs assisted living — leave off until data confirmed
- CTA: "Get your exact plan — free assessment" (prefills hours)

## 3. The Dawson House (Home chapter 3 — signature)
- Inline SVG line illustration of a Lowcountry-style house (porch, tin roof, live oak beside it)
- Scroll-driven (GSAP ScrollTrigger, pinned ≤150vh): rooms light up sequentially; each lit room shows a label card (service name + one-line promise + "See how we help →")
- Rooms: Bathroom = Personal Care · Kitchen = Home Help · Porch with rocking chairs = Companionship · Bedroom (moon in window) = 24-Hour & Overnight · Living room (family member resting on sofa) = Respite
- Hover/focus on a room = glow (orchid-500 at 30%) + cursor label "Open"; click = navigate
- Keyboard: each room is a `<a>` inside the SVG with `aria-label`; Tab cycles rooms
- Mobile: house static at top, rooms as swipe cards below, tapping a card highlights its room
- Reduced motion: all rooms lit, no pinning, simple grid of 5 cards

## 4. How-It-Works scroll timeline
- 5 steps on a vertical heartbeat line that draws as you scroll (SVG stroke-dashoffset tied to scroll)
- Each step: number, title, icon, 2-line description, small illustration; step 2 ("The owner visits your home — free") gets a highlighted card with owner photo placeholder
- Desktop: steps alternate left/right; mobile: single column
- Reduced motion: line fully drawn, steps visible

## 5. Service-Area Map (`/areas-we-serve` + Home chapter 11)
- Custom SVG map of Beaufort County + edges of Jasper (no API key, fast, on-brand): coastline, waterways in `plum-100`, land in cream, towns as dots
- Beaufort office pin pulses (leaf-500 ripple)
- Hover/focus a town → dot grows, label + "~X min from our office" (drive times `[[TO CONFIRM]]`, placeholders), click → town page
- "Do you serve me?" search input: type a town/ZIP → highlights it or shows "Call us — we may still be able to help"
- Accessible fallback: the same towns as a list of links
- Data: `areas.ts` `{ slug, name, county, zipCodes[], coords, confirmed:false }`

## 6. Payment Explorer (`/paying-for-care`)
- Tabs or segmented control: Private pay · Long-term care insurance · VA benefits · Medicaid waivers · Medicare
- Each panel: "What it is" · "How it usually works" · "Does Dawson accept it?" (shows *"Ask us"* while `confirmed:false`) · CTA
- Medicare panel is honest: generally doesn't pay for non-medical home care; explain the difference between home care and home health
- Data: `payments.ts`

## 7. Reviews
- Data-driven from `reviews.json`: `{ id, name, relation, town, service, rating, text, date, source, placeholder: true }`
- Home: two-row marquee (pause on hover/focus + visible pause button); /reviews: grid with filter chips by service
- Google rating badge component (value from config, hidden until confirmed)
- Later: replace with live Google reviews (Places API or GHL reputation widget) — keep the component interface the same

## 8. Meet-the-Owner video
- Poster image + big play button (cursor label "Play"); opens an accessible modal player (or inline), captions file (`.vtt`) required, transcript expander below
- Placeholder: poster + "Video coming soon" state that still looks intentional

## 9. Caregiver carousel
- Horizontal drag/swipe (Embla Carousel), arrow buttons + keyboard arrows, cursor label "Drag"
- Card front: photo, first name, years with Dawson, specialty; click/Enter flips to quote ("Why I do this"); flip disabled for reduced motion (shows quote below instead)

## 10. Sticky mobile action bar
- Fixed bottom on mobile: **Call** (tel:+18433793321) · **Text** (sms:+18666329766) · **Free Assessment**
- Hides when the on-screen keyboard is open or when a form is in view; respects safe-area inset

## 11. Office-status chip & after-hours mode
- Client-side, `Intl.DateTimeFormat` with `America/New_York`; Mon–Fri 08:00–17:00 = open
- Open → "Office open now"; closed → "Office closed · opens {next open}"; US federal holidays list in config (optional)
- After hours: primary CTA label switches to "Request a Callback"; form adds `after_hours=true`

## 12. Free Care Assessment form (multi-step) — `/free-assessment`
Step 1 — Who needs care (for whom, their first name, town)
Step 2 — What help (services, multi-select; prefilled from quiz/estimator)
Step 3 — When & how much (start timing, hours)
Step 4 — Your details (your name, phone, email, best time to call, preferred contact: call/text/email, notes)
Step 5 — Consents (SMS transactional, SMS marketing — both optional, unchecked) + Submit
- Progress indicator, save progress in sessionStorage, inline validation (react-hook-form + zod), honeypot + Cloudflare Turnstile (invisible)
- Submit → `/api/lead` → GoHighLevel (see 08) → `/thank-you`
- Also captures: UTM params, landing page, referrer, quiz answers, estimator values, after-hours flag

## 13. Professional referral portal — `/for-professionals`
Fields: Referrer name · organisation · role (discharge planner, case manager, social worker, hospice, physician office, other) · referrer phone/email · client first name + last initial · client town · services needed (new list) · start date · hours/schedule · notes · "Best way to reach you" · consent checkbox (I have the client's/family's permission to share this information)
- Prominent: Fax (866) 502-3509 · Phone · response promise `[[TO CONFIRM]]`
- Privacy: collect the minimum client information — no diagnoses, no DOB, no insurance IDs via the web form (see 09)
- Submit → `/api/referral` → GoHighLevel with tag `referral`

## 14. FAQ live search
- Search box filters questions instantly (client-side), highlights matches; accordion with smooth height animation; deep links (`/faq#cost`) open the right item

## 15. Interactive logo
Spec in 03 §3.

## 16. Interactive cursor
Spec in 03 §4.

## 17. Comfort controls (accessibility widget — also a differentiator)
- Floating button bottom-left (above mobile bar): Text size (100/112/125%), High contrast (darker borders, no glows, underlined links), Reduce motion (forces reduced-motion mode)
- Implemented with CSS variables on `<html>`; saved to localStorage (wrapped in try/catch)

## 18. Scroll storytelling system (site-wide)
- Line-by-line text reveals, image clip reveals, chapter progress indicator (thin heartbeat line at the top of the viewport on Home)
- Section number + eyebrow labels ("01 — The moment") for an editorial feel
- Number counters animate when visible (only real, confirmed numbers — currently just years)

## 19. Page transitions
- Cream curtain + heartbeat sweep between routes (≤500ms), focus moved to H1 after navigation, disabled for reduced motion

## 20. Micro-interactions
- Buttons: lift + soft shadow; phone CTA icon "rings" once on hover
- Cards: subtle tilt (max 3°) on desktop hover — off for reduced motion
- Checklist items on service pages tick with a small leaf-green check animation
- Form success: heartbeat line turns into a checkmark
