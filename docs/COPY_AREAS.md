# COPY_AREAS — Areas We Serve hub + 8 town pages + areas.ts

**Status:** Final copy for design + build. Use verbatim.
**Sources:** 04 (assumed towns), 05, 06 (Areas template), 07 §5 (map), 09 §6 (no doorway pages), COPY_HOME.md ch.11 (map strings), 11 (`town-{slug}.jpg`).
**Reading level:** grade 6–8. **Voice:** warm, calm, plain, local. "Clients", never "patients".

---

## 0. Conventions (read first)

**Every town is unconfirmed.** All 14 towns come from 04's assumption list. Every town carries `confirmed: false` and every drive time carries `driveConfirmed: false` in `areas.ts`. The service area itself is a `[[TO CONFIRM]]` item at the reveal.

**Dynamic tokens** (from `content/areas.ts`, never hard-coded in components):

| Token | Source | Example |
|---|---|---|
| `{town}` | `area.name` | Lady's Island |
| `{in}` | `area.preposition` | on |
| `{drive}` | `formatDrive(area.driveMinutes)` | "15" or "35–40" |
| `{years}` | `lib/years.ts` | 24 |
| `{nextOpen}` | `lib/officeHours.ts` | Monday at 8 AM |

In this file, drive times are written as the estimate followed by `[[TO CONFIRM: drive time]]`. In code, the number comes from `areas.ts`; the marker is driven by `driveConfirmed: false`.

**"in" vs "on":** islands take "on" (Lady's Island, St. Helena Island, Hilton Head Island). Everything else takes "in". Stored as `preposition` in `areas.ts`.

**Headings:** one H1 per page. Section titles are H2. Cards, FAQ questions and list group titles are H3.

**After-hours rule (site-wide):** when the office is closed, every **Get a Free Care Assessment** button becomes **Request a Callback** (same destination, `after_hours=true`).

**Town context in leads:** every assessment and quiz link on a town page carries the town: `/free-assessment?town={slug}` and `/find-care?town={slug}`. The form prefills Step 1 → Town. GHL gets `town` + `landing_page`.

**Images:** one `town-{slug}.jpg` per town page (16:9, per 11). Placeholder label: "{Town} scenery · 16:9". Alt text below describes the brief. **When a real photo lands, check the alt text still matches what it shows.** No text on top of photos.

**What's real vs light touch:** local landmarks below were checked against public sources (bridges, Penn Center, Sea Pines gates, Sun City in Okatie, county lines, ZIPs). They're used as light context only — never to imply a partnership with any place, hospital or community.

---

## 1. Build rules for town pages (SEO — 09 §6: no doorway pages)

1. **Only towns with `hasPage: true` get a page.** That's the 8 below. The other 6 towns (Shell Point, Seabrook, Sheldon, Ridgeland, Hardeeville, Yemassee) appear on the map and in the hub list, but have no page until there's something genuinely useful to say.
2. **While a town is `confirmed: false`:** its page renders on localhost and in the reveal, but ships `robots: { index: false }` and is left out of `sitemap.xml`. `npm run prelaunch` lists it. Flip to indexed only when the client confirms the town.
3. **Unique per page (never templated text):** title, meta description, eyebrow, hero lead, local intro, "Who we help" cards, service lines, FAQ, image, nearby links.
4. **Shared per page (kept short, under a third of the page):** drive card frame, services list frame, CTA band, hours line, non-medical line.
5. **Schema per town page:** `Service` (serviceType "Non-medical home care", `provider` → the single site `LocalBusiness` `@id`, `areaServed` → `{ "@type": "City", "name": "{town}" }`) + `FAQPage` (the 3 local FAQs) + `BreadcrumbList`. **Never** a separate `LocalBusiness` per town — there's one office. The site-wide `LocalBusiness.areaServed` lists confirmed towns only.
6. **Meta titles** use the short brand "Dawson & Dawson" to stay ≤ 60 characters. Drafts — SEO_PLAN.md overrides if it exists.

---

## 2. AREAS WE SERVE HUB — `/areas-we-serve`

### Page meta
- **Title:** Areas We Serve in the Lowcountry | Dawson & Dawson
- **Meta description:** Non-medical home care from our Beaufort office to Port Royal, the Sea Islands, Burton, Bluffton, Okatie and Hilton Head. Free in-home assessment.

**Breadcrumb:** Home › Areas we serve

### 2.1 Hero

**Eyebrow:** Areas we serve

**H1:**
> Home care across the Lowcountry — from our office in Beaufort.

**Lead:**
> Our caregivers come to you: in town, out on the islands and across the Broad River. Find your town below.

**Buttons:**
- Primary: **Get a Free Care Assessment** → `/free-assessment` (after hours: **Request a Callback**)
- Secondary: **Call (843) 379-3321** → `tel:+18433793321` · cursor label `Call`

**Microcopy:**
> Free visit at home. No obligation.

### 2.2 Map — "Find your town"

**H2:**
> Find your town.

**Subline:**
> Select a town to see what care looks like there. Our office is the pin in Beaufort.

**Map** — reuse every string from COPY_HOME.md ch.11 verbatim (accessible name, office pin label, town hover label, town link `aria-label`, cursor label `View`, town search label/helper/match/no-match/empty). Additions for this page:

**Legend (below the map, icon + words, never color alone):**
- ● **Near our office**
- ○ **Extended service area** — call to check scheduling
- 📍 **Our office**

**Town without a page (hover/focus label):**
> **{town}** · About {drive} min from our office `[[TO CONFIRM: drive time]]`
> Call to check

Clicking or pressing Enter on a town without a page moves focus to that town's row in "Towns we serve" below (never dials the phone from the map).

**Search — extra result states:**
- **ZIP shared by several towns** (e.g. 29906):
  > **Yes — we care for families in {zip}.** That includes {Town A}, {Town B} and {Town C}.
  (Each town with a page is a link: "See care in {town} →".)
- **Town with no page:**
  > **Yes — {town} is in our service area.** Call (843) 379-3321 and we'll talk about care.
- **Extended-area town:** add one line under the match:
  > {town} is in our extended service area. Call us to check scheduling for your hours.

**Map disclaimer (small, under legend):**
> Map is approximate. Drive times are estimates from our office.

### 2.3 Towns we serve (list — also the map's accessible fallback)

**H2:**
> Towns we serve

**Group 1 — H3:** Near our office
> About 5 to 25 minutes from our office. `[[TO CONFIRM: drive times]]`

| Town | Row content |
|---|---|
| Beaufort | **Beaufort** · About 10 min · See care in Beaufort → |
| Port Royal | **Port Royal** · About 15 min · See care in Port Royal → |
| Lady's Island | **Lady's Island** · About 15 min · See care on Lady's Island → |
| St. Helena Island | **St. Helena Island** · About 25 min · See care on St. Helena Island → |
| Burton | **Burton** · About 5 min · See care in Burton → |
| Shell Point | **Shell Point** · About 12 min · Call to check: (843) 379-3321 |
| Seabrook | **Seabrook** · About 20 min · Call to check: (843) 379-3321 |
| Sheldon | **Sheldon** · About 25 min · Call to check: (843) 379-3321 |

**Group 2 — H3:** Extended service area
> About 25 to 55 minutes from our office. Call us to check scheduling for the hours you need. `[[TO CONFIRM: drive times + extended-area scheduling]]`

| Town | Row content |
|---|---|
| Okatie | **Okatie** · About 25–30 min · See care in Okatie → |
| Bluffton | **Bluffton** · About 35–40 min · See care in Bluffton → |
| Hilton Head Island | **Hilton Head Island** · About 45–55 min · See care on Hilton Head Island → |
| Ridgeland | **Ridgeland** · About 30 min · Call to check: (843) 379-3321 |
| Hardeeville | **Hardeeville** · About 40–45 min · Call to check: (843) 379-3321 |
| Yemassee | **Yemassee** · About 30 min · Call to check: (843) 379-3321 |

Each row is one link or one `tel:` link (whole row is the 48px target). Rows render from `areas.ts`, sorted by drive time within each group. Screen-reader text for the drive time: "About {drive} minutes from our office."

### 2.4 Not on the list? Call us.

**H2:**
> Don't see your town?

**Body:**
> We may still be able to help. Call us and tell us where your loved one lives.

**Buttons:**
- Ghost: **Call (843) 379-3321** → `tel:+18433793321`
- Ghost: **Text us (866) 632-9766** → `sms:+18666329766`

### 2.5 The same Dawson, wherever you live

**H2:**
> Wherever you live, it's the same Dawson.

Three points (icon + H3 + one line):

**The owner comes to you.**
> Your free assessment happens at home, in every town we serve.

**Care whenever you need it.**
> **Care:** 24 hours a day, 7 days a week. **Office:** Monday–Friday, 8 AM–5 PM.

**We keep checking in.**
> We follow up regularly and adjust the plan as needs change.

### 2.6 Questions about where we care

**H2:**
> Questions about where we care

**How far do you travel?** `#how-far`
> Our office is in Beaufort. We care for families across Beaufort County and in nearby towns in Jasper and Hampton counties — from about 5 to 55 minutes away. `[[TO CONFIRM: service radius]]` If your town isn't listed, call us anyway.

**Is there an extra charge for towns farther away?** `#travel-fees`
> Your rate is set at your free assessment, based on the care you need. Ask us about your town and we'll tell you up front. `[[TO CONFIRM: travel or distance fees]]`

**How soon can care start in my town?** `#start-time`
> It depends on the hours you need and where you live. Call us and we'll give you a straight answer. `[[TO CONFIRM: typical start time]]`

### 2.7 CTA band

**H2:**
> Let's talk about care where your family lives.

**Subline:**
> One call. One free visit at home. No pressure.

**Buttons:** Primary **Get a Free Care Assessment** (after hours **Request a Callback**) · Ghost **Call (843) 379-3321** · Ghost **Text us (866) 632-9766**

**Hours line:**
> **Care:** 24 hours a day, 7 days a week
> **Office:** Monday–Friday, 8 AM–5 PM

---

## 3. TOWN PAGE — shared frame (`/areas-we-serve/[town]`)

Section order on every town page (matches 06):

1. **Hero** — breadcrumb, eyebrow, H1, lead, buttons, microcopy, photo
2. **Local intro** — H2 + 2 short paragraphs (unique)
3. **Getting to you** — drive card + mini map (shared frame, unique values)
4. **Who we help in {town}** — 3 cards (unique)
5. **Care {in} {town}** — 5 services, one unique line each
6. **Questions from {town} families** — 3 local FAQs (unique)
7. **Also nearby** — links to neighboring town pages
8. **CTA band** — unique headline, shared rest

### Shared strings

**Breadcrumb:** Home › Areas we serve › {town}

**H1 pattern:** In-Home Care {in} {town}, SC

**Hero buttons:**
- Primary: **Get a Free Care Assessment** → `/free-assessment?town={slug}` (after hours: **Request a Callback**)
- Secondary: **Call (843) 379-3321** → `tel:+18433793321` · cursor label `Call`

**Hero microcopy:**
> Free visit at home. No obligation.

**3 — Getting to you (drive card):**
- H2: **Getting to you**
- Big line: **About {drive} minutes** `[[TO CONFIRM: drive time]]`
- Label under it: from our office at 69 Robert Smalls Parkway, Beaufort
- Route line: *(unique per town, below)*
- Small: Map is approximate.

**Mini map interaction (07 §5, cropped):** the same SVG map, zoomed to the office and this town. When the card is 40% in view, a heartbeat-style line draws from the office pin to the town pin (≤ 900ms, once). It's a straight "as the heron flies" line, not a road route — the route line text carries the real route. Reduced motion: line already drawn. The SVG is `aria-hidden`; the card text is the accessible version.

**5 — Services list frame:**
- H2: **Care {in} {town}**
- Subline: **Most families combine two or three. Your plan is built around your loved one.**
- Each row: service name (H3, link) + the town line below. Links: `/care/personal-care`, `/care/home-help`, `/care/companionship`, `/care/respite-care`, `/care/24-hour-care`.
- Under the list (small): **All our care is non-medical. We work alongside your home health team.**
- Text link: **Not sure what you need? Find the right care →** `/find-care?town={slug}`

**6 — FAQ frame:**
- H2: **Questions from {town} families**
- Accordion (question = H3 button). Under the list: **See all questions →** `/faq`

**7 — Also nearby:**
- H2: **Also nearby**
- Chips: **{nearby town}** → its page (only towns with pages). Plus: **See all areas →** `/areas-we-serve`

**8 — CTA band:**
- H2: *(unique per town)*
- Subline: **One call. One free visit at home. No pressure.**
- Buttons: Primary **Get a Free Care Assessment** → `/free-assessment?town={slug}` (after hours **Request a Callback**) · Ghost **Call (843) 379-3321** · Ghost **Text us (866) 632-9766**
- Hours line: **Care:** 24 hours a day, 7 days a week · **Office:** Monday–Friday, 8 AM–5 PM

---

## 4. BEAUFORT — `/areas-we-serve/beaufort`

### Page meta
- **Title:** Senior Home Care in Beaufort, SC | Dawson & Dawson
- **Meta description:** Home care from our Beaufort office: bathing, meals, companionship, respite and 24-hour care. Owner-run since 2002. Free in-home assessment.

(Title deliberately differs from the Home page title, which already targets "In-Home Care in Beaufort, SC".)

### Hero
**Eyebrow:** Beaufort · Home base

**H1:** In-Home Care in Beaufort, SC

**Lead:**
> Beaufort is home base. Our office is on Robert Smalls Parkway, and our owner meets every family in person. Help at home for a few hours or around the clock.

**Photo:** `town-beaufort.jpg`
- Alt: Live oaks and older homes along a quiet street in Beaufort's historic district.

### Local intro
**H2:**
> Care from right down the road.

> When you call us, you're calling our office here in Beaufort. The person who visits your home is the person who runs the company.

> Beaufort is full of people who've lived in the same house for decades — and people who moved here to retire and never want to leave. Either way, the goal is usually the same: stay home, keep the routine, and keep the good parts of the week. Coffee on the porch. A walk along the waterfront. Lunch downtown with a friend.

### Getting to you
- **About 10 minutes** `[[TO CONFIRM: drive time]]`
- Route: Robert Smalls Parkway to Boundary Street and into town.

### Who we help in Beaufort
**H3: People who love their older homes**
> Historic houses are beautiful. They can also mean steep stairs and small bathrooms. We plan care around the house your parent loves.

**H3: Families coming home from the hospital**
> The first weeks home can be the hardest. We help with bathing, meals and getting around safely — alongside your home health team.

**H3: Neighbors who want to stay part of town life**
> Errands, the library, lunch with friends. A caregiver's company can keep the week full.

### Care in Beaufort
- **Personal Care** — Safe showers and dressing, even in an older bathroom.
- **Home Help** — Meals, laundry, errands around town and medication reminders.
- **Companionship** — A walk by the water, a trip downtown, a good talk on the porch.
- **Respite Care** — A few hours off for the family member who's been doing it all.
- **24-Hour & Overnight Care** — Someone there at night, especially after a fall or a hospital stay.

### Questions from Beaufort families
**Can I visit your office?** `#visit-office`
> Yes. We're at 69 Robert Smalls Parkway, Suite 3F, Beaufort, SC 29906. The office is open Monday–Friday, 8 AM–5 PM. Call ahead so the right person is there to meet you. Care itself is available 24 hours a day, 7 days a week.
> Link: **Get directions →** (Google Maps link from `site.config.ts`)

**Mom is coming home from the hospital. Can you help right away?** `#hospital-discharge`
> We help with the non-medical side: bathing, meals, getting around safely and company. If you can, call us before she's discharged so we can plan the first days together. `[[TO CONFIRM: typical start time]]` If she also needs nursing or therapy, that's home health — and we're happy to work alongside them.

**Her house has steep stairs. Is that a problem?** `#stairs`
> No. At the free assessment, our owner walks through the home with you — stairs, bathroom, bedroom, the way she moves around. We plan care around what we see, and we'll point out simple changes that could make the house safer.

### Also nearby
Port Royal · Lady's Island · Burton

### CTA band
**H2:**
> Let's talk about care in Beaufort.

---

## 5. PORT ROYAL — `/areas-we-serve/port-royal`

### Page meta
- **Title:** In-Home Care in Port Royal, SC | Dawson & Dawson
- **Meta description:** Help at home in Port Royal: bathing, meals, walks, respite and overnight care. Local and owner-run since 2002. Free in-home assessment.

### Hero
**Eyebrow:** Port Royal · Just down Ribaut Road

**H1:** In-Home Care in Port Royal, SC

**Lead:**
> Port Royal is a small town where people know each other. We help neighbors here stay at home — with a few hours of help or care around the clock.

**Photo:** `town-port-royal.jpg`
- Alt: The boardwalk and observation tower at The Sands in Port Royal, at sunset.

### Local intro
**H2:**
> Small town. Close by.

> Port Royal's Old Village is made for slow walks — down Paris Avenue, out to the boardwalk at The Sands. Many people here want to keep doing exactly that. Sometimes they just need a steady arm.

> The town sits beside Parris Island, and many military families and veterans live in the area. Some retired here after years of service. Some are caring for a parent who moved closer. We help with the everyday, so home stays home.

### Getting to you
- **About 15 minutes** `[[TO CONFIRM: drive time]]`
- Route: Down Ribaut Road.

### Who we help in Port Royal
**H3: Veterans and their spouses**
> People who served — and the spouses who held everything together. We help with daily routines at home, with respect. Ask us whether VA benefits could help pay for care.

**H3: Walkers who need a steady arm**
> If balance is getting shaky, a caregiver can walk alongside — to the boardwalk, the post office or just around the block.

**H3: Brothers and sisters sharing the load**
> When siblings split care between them, we fill the gaps — the shifts nobody can cover.

### Care in Port Royal
- **Personal Care** — Help bathing and dressing, so mornings start right.
- **Home Help** — Groceries, laundry, light housekeeping and medication reminders.
- **Companionship** — A walk out to The Sands, cards at the kitchen table, good conversation.
- **Respite Care** — A weekend off for the family caregiver.
- **24-Hour & Overnight Care** — Someone awake and nearby through the night.

### Questions from Port Royal families
**Is Port Royal close enough for short visits?** `#short-visits`
> Yes. We're about 15 minutes away `[[TO CONFIRM: drive time]]`. Visits can be a few hours or much longer. Visits start at `[[TO CONFIRM: minimum hours]]` hours.

**My dad is a veteran. Can VA benefits help pay?** `#va-benefits`
> Sometimes. Some VA programs help veterans and surviving spouses pay for help at home. The rules vary, so ask us and we'll talk through what might apply. `[[TO CONFIRM: does Dawson accept VA benefits?]]`
> Link: **See ways families pay →** `/paying-for-care#ways-to-pay`

**Can a caregiver go out with Mom, not just stay at home?** `#outings`
> Yes. Walks, errands and outings are part of companionship and home help. `[[TO CONFIRM: do caregivers drive clients in their own cars?]]`

### Also nearby
Beaufort · Lady's Island · Burton

### CTA band
**H2:**
> Let's talk about care in Port Royal.

---

## 6. LADY'S ISLAND — `/areas-we-serve/ladys-island`

### Page meta
- **Title:** In-Home Care on Lady's Island, SC | Dawson & Dawson
- **Meta description:** Home care on Lady's Island, just over the bridge from Beaufort: personal care, home help, companionship, respite and overnight care. Free assessment.

### Hero
**Eyebrow:** Lady's Island · Across the bridge

**H1:** In-Home Care on Lady's Island, SC

**Lead:**
> Just over the bridge from downtown Beaufort. We help Lady's Island families with care at home — a few hours a week or around the clock.

**Photo:** `town-ladys-island.jpg`
- Alt: Marsh grass and a tidal creek at golden hour on Lady's Island.

### Local intro
**H2:**
> Island life, close to town.

> Lady's Island feels like its own world — marsh views, quiet roads, long driveways. But downtown Beaufort is only a bridge away.

> We know those bridges. The Woods Memorial Bridge swings open for boats, and traffic can back up near Sea Island Parkway at busy times. We plan visit times with that in mind, so your loved one isn't left waiting.

### Getting to you
- **About 15 minutes** `[[TO CONFIRM: drive time]]`
- Route: Over the Woods Memorial Bridge or the McTeer Bridge.

### Who we help on Lady's Island
**H3: Retirees who chose the water**
> You moved here for the view. We help you keep it — with help around the house and a hand when you need it.

**H3: Parents with appointments in town**
> Doctor visits often mean a trip across the bridge. A caregiver can go with your mom and help her in and out safely.

**H3: Families who want someone there at night**
> Island nights are quiet. If a parent shouldn't be alone, overnight care means someone is right there.

### Care on Lady's Island
- **Personal Care** — Bathing, dressing and moving safely around the house.
- **Home Help** — Meals, laundry, grocery runs and medication reminders.
- **Companionship** — Conversation, games and a slow walk outside to see the marsh.
- **Respite Care** — A real break for the person who's been on call all week.
- **24-Hour & Overnight Care** — Overnight care, so no one is alone after dark.

### Questions from Lady's Island families
**What if the bridge is open or traffic is backed up?** `#bridge-traffic`
> We plan for it. We know the busy times and leave room in the schedule. If a caregiver is ever running late, we'll call you. `[[TO CONFIRM: late-arrival process]]`

**Can a caregiver take Dad to his appointments in Beaufort?** `#appointments`
> A caregiver can go with him to appointments and help him in and out of the car and the office. `[[TO CONFIRM: do caregivers drive clients in their own cars?]]`

**Do you only do short visits out here?** `#visit-length`
> No. Care on Lady's Island is the same as everywhere we serve: a few hours, full days, overnight or around the clock — 7 days a week.

### Also nearby
Beaufort · St. Helena Island · Port Royal

### CTA band
**H2:**
> Let's talk about care on Lady's Island.

---

## 7. ST. HELENA ISLAND — `/areas-we-serve/st-helena-island`

### Page meta
- **Title:** In-Home Care on St. Helena Island, SC | Dawson & Dawson
- **Meta description:** Non-medical home care on St. Helena Island: respite for family caregivers, personal care, home help and overnight care. Free visit at home.

### Hero
**Eyebrow:** St. Helena Island · Out Sea Island Parkway

**H1:** In-Home Care on St. Helena Island, SC

**Lead:**
> Many St. Helena families care for their elders at home. When you need an extra pair of hands, we're here — on your family's terms.

**Photo:** `town-st-helena-island.jpg`
- Alt: A shaded country road under live oaks on St. Helena Island.

### Local intro
**H2:**
> Respect for how families here do things.

> St. Helena is farmland, tidal creeks and family land passed down through generations. Penn Center, founded in 1862, still anchors the island's Gullah Geechee heritage.

> Here, caring for an elder is often shared — a daughter, a grandson, a neighbor down the road. We don't replace that. We support it: a few hours so the family caregiver can work or rest, or help with the harder parts, like bathing.

### Getting to you
- **About 25 minutes** `[[TO CONFIRM: drive time]]`
- Route: Over the bridges and out Sea Island Parkway (US 21).

### Who we help on St. Helena Island
**H3: Family caregivers who need a break**
> If you've been caring for your grandmother by yourself, respite care gives you time back — to work, rest or just breathe.

**H3: Elders who want to stay on family land**
> Home is more than a house here. We help make staying there safe, day and night.

**H3: Neighbors who live farther out**
> Homes on the island can be far apart. We come to you, wherever the driveway leads.

### Care on St. Helena Island
- **Personal Care** — Gentle help with bathing, dressing and getting around.
- **Home Help** — Cooking, laundry, tidying up and medication reminders.
- **Companionship** — Company on the porch, a walk in the yard, stories and conversation.
- **Respite Care** — Time off for the family member who's always there.
- **24-Hour & Overnight Care** — Someone there through the night, so no one has to sit up alone.

### Questions from St. Helena Island families
**Will a caregiver really come all the way out on the island?** `#island-visits`
> Yes. St. Helena is part of the area we serve, about 25 minutes from our office `[[TO CONFIRM: drive time]]`. Tell us where the house is when you call, and we'll plan the visit.

**We take care of Mama ourselves. Can you just give us a break?** `#respite`
> Yes. That's what respite care is for. We can step in for a few hours, a day or longer, and keep her routine the same while you're away.
> Link: **About respite care →** `/care/respite-care`

**What happens with care during a hurricane?** `#hurricanes`
> Storms are part of life on the islands. At your free assessment, we'll talk through your family's storm plan and how care fits into it. `[[TO CONFIRM: Dawson's emergency and evacuation plan]]`

### Also nearby
Lady's Island · Beaufort

### CTA band
**H2:**
> Let's talk about care on St. Helena.

---

## 8. BURTON — `/areas-we-serve/burton`

### Page meta
- **Title:** In-Home Care in Burton, SC | Dawson & Dawson
- **Meta description:** Our office is on Robert Smalls Parkway, minutes from Burton. Personal care, home help, respite and overnight care. Owner-run since 2002.

### Hero
**Eyebrow:** Burton · Our neighborhood

**H1:** In-Home Care in Burton, SC

**Lead:**
> Our office is on Robert Smalls Parkway — a road many Burton families drive every day. When you need help, we're close.

**Photo:** `town-burton.jpg`
- Alt: A quiet Burton road lined with pines and live oaks.

### Local intro
**H2:**
> Close enough to be neighbors.

> Burton is where Beaufort spreads out — quiet roads, big yards, neighborhoods off Robert Smalls Parkway and Parris Island Gateway. It's near the Air Station and Laurel Bay, so many families here have a military connection.

> Some parents moved to Burton to be near a son or daughter in the service. Others have lived here all their lives. Either way, help is right around the corner.

### Getting to you
- **About 5 minutes** `[[TO CONFIRM: drive time]]`
- Route: Robert Smalls Parkway — our office is on it.

### Who we help in Burton
**H3: Military families**
> Long shifts, deployments, moves. If your parent lives near you while you serve, we can cover the days you can't.

**H3: People who want just a little help**
> Not everyone needs much. A few hours a week for housekeeping, errands or a shower can make a big difference.

**H3: Families whose needs are changing**
> After a fall, a new diagnosis or a hard few months, needs change. We adjust the plan as you go.

### Care in Burton
- **Personal Care** — Bathing, dressing and safe moves from bed to chair.
- **Home Help** — Light housekeeping, laundry, meals and errands.
- **Companionship** — Good company and a reason to get out of the house.
- **Respite Care** — A few hours for the family member juggling work and care.
- **24-Hour & Overnight Care** — Overnight care when someone shouldn't be alone.

### Questions from Burton families
**How close is your office to Burton?** `#office-distance`
> Very close. We're at 69 Robert Smalls Parkway, Suite 3F — about 5 minutes from much of Burton `[[TO CONFIRM: drive time]]`. The office is open Monday–Friday, 8 AM–5 PM. Care is available 24 hours a day, 7 days a week.

**I'm active duty and may deploy. Can you keep an eye on my mom?** `#deployment`
> Yes. We can set up regular visits, and our owner keeps checking in as her needs change. Tell us how you'd like to get updates while you're away. `[[TO CONFIRM: how families receive updates]]`

**Can I start with just a few hours a week?** `#start-small`
> Yes. You can start small and add more help later. Visits start at `[[TO CONFIRM: minimum hours]]` hours.
> Link: **Estimate your cost →** `/paying-for-care`

### Also nearby
Beaufort · Port Royal · Okatie

### CTA band
**H2:**
> Let's talk about care in Burton.

---

## 9. BLUFFTON — `/areas-we-serve/bluffton`

### Page meta
- **Title:** In-Home Care in Bluffton, SC | Dawson & Dawson
- **Meta description:** Home care in Bluffton for parents who retired here and families who live far away. Personal care, companionship, respite and 24-hour care.

### Hero
**Eyebrow:** Bluffton · Across the Broad River

**H1:** In-Home Care in Bluffton, SC

**Lead:**
> Bluffton has grown fast. Lots of families here are new to the area — and far from the people who'd usually help. We can be that help.

**Photo:** `town-bluffton.jpg`
- Alt: The May River at sunrise, seen from Old Town Bluffton.

### Local intro
**H2:**
> New to Bluffton? You're not on your own.

> Old Town and the May River still set the pace, but new neighborhoods keep coming. Many people here moved in from somewhere else — to retire, or to be near grandchildren. That can mean the closest family is a plane ride away.

> Bluffton is part of our extended service area. Our office is in Beaufort, across the Broad River Bridge. Call us and we'll talk through scheduling for your part of town. `[[TO CONFIRM: Bluffton in service area]]`

### Getting to you
- **About 35–40 minutes** `[[TO CONFIRM: drive time]]`
- Route: SC 170 over the Broad River Bridge.

### Who we help in Bluffton
**H3: Parents who retired here**
> You chose Bluffton for this stage of life. A little help at home lets you keep enjoying it.

**H3: Adult children who live out of state**
> When you're hours away, it helps to know someone local is checking in — and that our owner has met your mom in person.

**H3: Couples who want to stay together at home**
> When one partner needs more help, care at home means you can stay together, in the home you chose.

### Care in Bluffton
- **Personal Care** — Help with showers, dressing and getting around, with dignity.
- **Home Help** — Meals, laundry, errands and medication reminders.
- **Companionship** — A stroll in Old Town, lunch out or a good conversation at home.
- **Respite Care** — A break for the spouse who's been caring around the clock.
- **24-Hour & Overnight Care** — Overnight and round-the-clock care, 7 days a week.

### Questions from Bluffton families
**Your office is in Beaufort. Do you really come to Bluffton?** `#bluffton-coverage`
> Yes. Bluffton is part of our extended service area, about 35–40 minutes from our office `[[TO CONFIRM: drive time]]`. Call us with the address and the hours you need, and we'll tell you straight away what we can do.

**I live out of state. How will I know how Mom is doing?** `#family-updates`
> Our owner stays involved after care starts, with regular follow-ups and check-ins. Tell us who should hear from us, and how. `[[TO CONFIRM: how families receive updates]]`

**Can the free assessment happen if I'm not there?** `#remote-family`
> Yes. Our owner can meet your parent at home, and you can join by phone. `[[TO CONFIRM: phone or video join]]`

### Also nearby
Okatie · Hilton Head Island

### CTA band
**H2:**
> Let's talk about care in Bluffton.

---

## 10. HILTON HEAD ISLAND — `/areas-we-serve/hilton-head-island`

### Page meta
- **Title:** In-Home Care on Hilton Head Island, SC | Dawson & Dawson
- **Meta description:** Non-medical home care on Hilton Head Island, including gated communities and part-year residents. Owner-run since 2002. Call to check scheduling.

### Hero
**Eyebrow:** Hilton Head Island · Extended area

**H1:** In-Home Care on Hilton Head Island, SC

**Lead:**
> Beaches, bike paths and gated neighborhoods. We help island residents stay home and keep the life they came here for.

**Photo:** `town-hilton-head-island.jpg`
- Alt: A bike path under pines and live oaks on Hilton Head Island.

### Local intro
**H2:**
> Island living, with help close at hand.

> Hilton Head draws people who planned this chapter carefully. Then life changes — a fall, a surgery, a spouse who needs more help.

> Many homes here sit inside gated communities with their own visitor rules. Some people live on the island only part of the year. We plan care around both. Hilton Head is the farthest part of our extended service area, so call us first — we'll be honest about what we can schedule. `[[TO CONFIRM: Hilton Head in service area]]`

### Getting to you
- **About 45–55 minutes** `[[TO CONFIRM: drive time]]`
- Route: SC 170 and US 278 onto the island.

### Who we help on Hilton Head Island
**H3: Residents of gated communities**
> We'll sort out gate access with you before the first visit, so care starts on time.

**H3: Part-year residents**
> Here for the winter, or spending more time on the island than you planned? Talk to us about care that fits your season.

**H3: Family who notice changes on a visit**
> Holiday visits are often when families see Dad isn't coping like he used to. If that's you, call us before you fly home.

### Care on Hilton Head Island
- **Personal Care** — Help with bathing, dressing and moving safely.
- **Home Help** — Meals, laundry, groceries and medication reminders.
- **Companionship** — A walk to the beach access, cards, conversation and outings.
- **Respite Care** — Time off for a spouse who's been caring alone.
- **24-Hour & Overnight Care** — Someone there day and night, 7 days a week.

### Questions from Hilton Head Island families
**My parents live in a gated community. Can your caregiver get in?** `#gate-access`
> Yes. Each community has its own visitor and pass rules. At your free assessment, we'll go over how yours works and set up access before the first visit. `[[TO CONFIRM: gate-pass process and who covers any pass fees]]`

**We only live here part of the year. Can care be seasonal?** `#seasonal-care`
> Talk to us. Care plans are built around your schedule. `[[TO CONFIRM: seasonal start/stop policy]]`

**Hilton Head is a long way from Beaufort. Will that affect care?** `#distance`
> It's the farthest town we serve, about 45–55 minutes away `[[TO CONFIRM: drive time]]`. That's why we ask you to call first. We'll tell you honestly which hours we can cover and how soon. `[[TO CONFIRM: Hilton Head scheduling limits]]`

### Also nearby
Bluffton · Okatie

### CTA band
**H2:**
> Let's talk about care on Hilton Head.

---

## 11. OKATIE — `/areas-we-serve/okatie`

### Page meta
- **Title:** In-Home Care in Okatie & Sun City, SC | Dawson & Dawson
- **Meta description:** Home care in Okatie and Sun City Hilton Head: respite for caregiving spouses, personal care, home help and overnight care. Free in-home assessment.

### Hero
**Eyebrow:** Okatie · Between Beaufort and Bluffton

**H1:** In-Home Care in Okatie, SC

**Lead:**
> From Sun City to the homes along the Okatie Highway, we help residents stay independent at home — with as much or as little help as they need.

**Photo:** `town-okatie.jpg`
- Alt: A lagoon and walking path in an Okatie neighborhood.

### Local intro
**H2:**
> Independence is the point.

> Okatie sits between Beaufort and Bluffton and reaches into both Beaufort and Jasper counties. It includes Sun City Hilton Head and neighborhoods like Riverbend and Oldfield.

> A lot of people here are retired and busy — clubs, golf, volunteering, grandkids. Nobody wants to give that up. Often, one spouse quietly starts caring for the other. Our job is to help you both keep your life, and to give the caregiving spouse a real break.

### Getting to you
- **About 25–30 minutes** `[[TO CONFIRM: drive time]]`
- Route: SC 170 over the Broad River Bridge.

### Who we help in Okatie
**H3: Spouses caring for spouses**
> If you've become your husband's or wife's caregiver, you need rest too. Respite care gives you time back.

**H3: Active adults who need a hand**
> A little help with housekeeping, meals or a shower can keep the calendar full.

**H3: Residents of 55+ communities**
> Many communities offer activities, but not hands-on help at home. That's the part we fill.

### Care in Okatie
- **Personal Care** — Discreet help with bathing and dressing.
- **Home Help** — Meals, laundry, errands and medication reminders.
- **Companionship** — Company for clubs and events, walks around the lagoon, and outings.
- **Respite Care** — Hours off for the spouse who does it all.
- **24-Hour & Overnight Care** — Overnight care, so both of you can sleep.

### Questions from Okatie families
**Do you serve Sun City Hilton Head?** `#sun-city`
> Yes. Sun City is part of the Okatie area we serve. `[[TO CONFIRM: Sun City in service area]]` Call us with your address and the help you need.

**Okatie is partly in Jasper County. Does that matter?** `#jasper-county`
> No. What matters is your address and the hours you need. Call us and we'll check.

**I'm caring for my husband. Can you help both of us?** `#caregiving-spouse`
> Yes. We can help him with daily routines and give you regular time off. Most families combine two or three services, and we'll build your plan together at the free assessment.

### Also nearby
Bluffton · Burton · Hilton Head Island

### CTA band
**H2:**
> Let's talk about care in Okatie.

---

## 12. `content/areas.ts`

All 14 towns from 04. Every town `confirmed: false`; every drive time `driveConfirmed: false`. Coordinates are approximate community centers (WGS84, 4 dp) for positioning dots on the custom SVG map only — not for navigation.

```ts
// content/areas.ts
// Source: 04_CONTENT_INVENTORY.md → "Service area (towns)" (assumptions, TO CONFIRM at reveal).
// Copy: COPY_AREAS.md. Map spec: 07 §5.
//
// RULES
// - Every town is confirmed:false until the client confirms it. `npm run prelaunch` lists them.
// - Town pages exist only for hasPage:true. While confirmed:false they are noindex + out of sitemap.xml.
// - driveMinutes are rough estimates from the office (driveConfirmed:false). Shown as "About {n} min".
// - coords = approximate community center for the SVG map. Not a route, not for navigation.
// - ZIPs can be shared by several towns (e.g. 29902/29906). matchAreas() returns all matches.

export type AreaTier = "primary" | "extended";

export interface Area {
  slug: string;
  name: string;
  /** "in Port Royal" vs "on Lady's Island" */
  preposition: "in" | "on";
  /** Primary county */
  county: string;
  /** Other counties the community or its ZIP reaches into */
  alsoInCounties?: string[];
  zipCodes: string[];
  coords: { lat: number; lng: number };
  tier: AreaTier;
  hasPage: boolean;
  /** Approximate drive from the office, in minutes. min === max for a single figure. */
  driveMinutes: { min: number; max: number };
  driveConfirmed: boolean;
  /** Extra names people type into "Do you serve my town?" */
  searchAliases: string[];
  /** Slugs of nearby towns WITH pages, for the "Also nearby" chips */
  nearby: string[];
  confirmed: boolean;
}

export const OFFICE = {
  name: "Dawson and Dawson Home Care LLC",
  street: "69 Robert Smalls Parkway, Suite 3F",
  city: "Beaufort",
  state: "SC",
  zip: "29906",
  // Approximate. Replace with the geocoded point that matches the Google Business Profile.
  coords: { lat: 32.44, lng: -80.7 },
  coordsConfirmed: false,
} as const;

export const areas: Area[] = [
  // ── Primary (near our office) ──────────────────────────────────────────────
  {
    slug: "beaufort",
    name: "Beaufort",
    preposition: "in",
    county: "Beaufort",
    // 29902 + 29906 = residential; 29901, 29903 = PO boxes; 29904 = MCAS Beaufort; 29905 = Parris Island
    zipCodes: ["29901", "29902", "29903", "29904", "29905", "29906"],
    coords: { lat: 32.4316, lng: -80.6698 },
    tier: "primary",
    hasPage: true,
    driveMinutes: { min: 10, max: 10 },
    driveConfirmed: false,
    searchAliases: ["Downtown Beaufort", "Historic District", "Mossy Oaks", "Pigeon Point"],
    nearby: ["port-royal", "ladys-island", "burton"],
    confirmed: false,
  },
  {
    slug: "port-royal",
    name: "Port Royal",
    preposition: "in",
    county: "Beaufort",
    zipCodes: ["29935"],
    coords: { lat: 32.3791, lng: -80.6926 },
    tier: "primary",
    hasPage: true,
    driveMinutes: { min: 15, max: 15 },
    driveConfirmed: false,
    searchAliases: ["Old Village"],
    nearby: ["beaufort", "ladys-island", "burton"],
    confirmed: false,
  },
  {
    slug: "ladys-island",
    name: "Lady's Island",
    preposition: "on",
    county: "Beaufort",
    zipCodes: ["29907"],
    coords: { lat: 32.425, lng: -80.64 },
    tier: "primary",
    hasPage: true,
    driveMinutes: { min: 15, max: 15 },
    driveConfirmed: false,
    searchAliases: ["Ladys Island", "Ladies Island", "Lady Island"],
    nearby: ["beaufort", "st-helena-island", "port-royal"],
    confirmed: false,
  },
  {
    slug: "st-helena-island",
    name: "St. Helena Island",
    preposition: "on",
    county: "Beaufort",
    zipCodes: ["29920"],
    coords: { lat: 32.392, lng: -80.573 },
    tier: "primary",
    hasPage: true,
    driveMinutes: { min: 25, max: 25 },
    driveConfirmed: false,
    searchAliases: ["Saint Helena", "Saint Helena Island", "St Helena", "Frogmore"],
    nearby: ["ladys-island", "beaufort"],
    confirmed: false,
  },
  {
    slug: "burton",
    name: "Burton",
    preposition: "in",
    county: "Beaufort",
    zipCodes: ["29902", "29906"],
    coords: { lat: 32.4206, lng: -80.755 },
    tier: "primary",
    hasPage: true,
    driveMinutes: { min: 5, max: 5 },
    driveConfirmed: false,
    searchAliases: ["Laurel Bay"],
    nearby: ["beaufort", "port-royal", "okatie"],
    confirmed: false,
  },
  {
    slug: "shell-point",
    name: "Shell Point",
    preposition: "in",
    county: "Beaufort",
    zipCodes: ["29902", "29906"],
    coords: { lat: 32.3833, lng: -80.7424 },
    tier: "primary",
    hasPage: false,
    driveMinutes: { min: 12, max: 12 },
    driveConfirmed: false,
    searchAliases: [],
    nearby: ["port-royal", "burton"],
    confirmed: false,
  },
  {
    slug: "seabrook",
    name: "Seabrook",
    preposition: "in",
    county: "Beaufort",
    zipCodes: ["29940"],
    coords: { lat: 32.5527, lng: -80.74 },
    tier: "primary",
    hasPage: false,
    driveMinutes: { min: 20, max: 20 },
    driveConfirmed: false,
    searchAliases: [],
    nearby: ["burton", "beaufort"],
    confirmed: false,
  },
  {
    slug: "sheldon",
    name: "Sheldon",
    preposition: "in",
    county: "Beaufort",
    zipCodes: ["29941"],
    coords: { lat: 32.5348, lng: -80.8197 },
    tier: "primary",
    hasPage: false,
    driveMinutes: { min: 25, max: 25 },
    driveConfirmed: false,
    searchAliases: [],
    nearby: ["burton"],
    confirmed: false,
  },

  // ── Extended service area ──────────────────────────────────────────────────
  {
    slug: "okatie",
    name: "Okatie",
    preposition: "in",
    county: "Beaufort",
    alsoInCounties: ["Jasper"],
    // 29909 is also used by parts of Bluffton (USPS alias); it resolves to Okatie here.
    zipCodes: ["29909"],
    coords: { lat: 32.3277, lng: -80.8933 },
    tier: "extended",
    hasPage: true,
    driveMinutes: { min: 25, max: 30 },
    driveConfirmed: false,
    searchAliases: [
      "Sun City",
      "Sun City Hilton Head",
      "Riverbend",
      "Oldfield",
      "Callawassie Island",
      "Spring Island",
    ],
    nearby: ["bluffton", "burton", "hilton-head-island"],
    confirmed: false,
  },
  {
    slug: "bluffton",
    name: "Bluffton",
    preposition: "in",
    county: "Beaufort",
    zipCodes: ["29910"],
    coords: { lat: 32.2371, lng: -80.8604 },
    tier: "extended",
    hasPage: true,
    driveMinutes: { min: 35, max: 40 },
    driveConfirmed: false,
    searchAliases: ["Old Town Bluffton"],
    nearby: ["okatie", "hilton-head-island"],
    confirmed: false,
  },
  {
    slug: "hilton-head-island",
    name: "Hilton Head Island",
    preposition: "on",
    county: "Beaufort",
    // 29926 (north) + 29928 (south) = residential; 29925, 29938 = PO boxes
    zipCodes: ["29925", "29926", "29928", "29938"],
    coords: { lat: 32.2163, lng: -80.7526 },
    tier: "extended",
    hasPage: true,
    driveMinutes: { min: 45, max: 55 },
    driveConfirmed: false,
    searchAliases: ["Hilton Head", "HHI", "Sea Pines"],
    nearby: ["bluffton", "okatie"],
    confirmed: false,
  },
  {
    slug: "ridgeland",
    name: "Ridgeland",
    preposition: "in",
    county: "Jasper",
    zipCodes: ["29936"],
    coords: { lat: 32.4802, lng: -80.9801 },
    tier: "extended",
    hasPage: false,
    driveMinutes: { min: 30, max: 30 },
    driveConfirmed: false,
    searchAliases: [],
    nearby: ["okatie"],
    confirmed: false,
  },
  {
    slug: "hardeeville",
    name: "Hardeeville",
    preposition: "in",
    county: "Jasper",
    zipCodes: ["29927"],
    coords: { lat: 32.2871, lng: -81.079 },
    tier: "extended",
    hasPage: false,
    driveMinutes: { min: 40, max: 45 },
    driveConfirmed: false,
    searchAliases: [],
    nearby: ["bluffton"],
    confirmed: false,
  },
  {
    slug: "yemassee",
    name: "Yemassee",
    preposition: "in",
    county: "Hampton",
    alsoInCounties: ["Beaufort"],
    zipCodes: ["29945"],
    coords: { lat: 32.6918, lng: -80.8509 },
    tier: "extended",
    hasPage: false,
    driveMinutes: { min: 30, max: 30 },
    driveConfirmed: false,
    searchAliases: ["Pocotaligo"],
    nearby: ["burton"],
    confirmed: false,
  },
];

// ── Helpers (pure, no side effects) ──────────────────────────────────────────

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

export const getArea = (slug: string) => areas.find((a) => a.slug === slug);

export const areasWithPages = () => areas.filter((a) => a.hasPage);

export const areasByTier = (tier: AreaTier) =>
  areas
    .filter((a) => a.tier === tier)
    .sort((a, b) => a.driveMinutes.min - b.driveMinutes.min);

/** "15" or "35–40" (en dash) */
export const formatDrive = ({ min, max }: Area["driveMinutes"]) =>
  min === max ? `${min}` : `${min}–${max}`;

/**
 * "Do you serve my town?" search.
 * - 5-digit input → every town using that ZIP (can be several).
 * - Text (3+ chars) → exact or prefix match on name or alias.
 * Returns [] for no match (UI shows the "We may still be able to help" state).
 */
export function matchAreas(query: string): Area[] {
  const q = query.trim();
  if (/^\d{5}$/.test(q)) return areas.filter((a) => a.zipCodes.includes(q));
  const n = norm(q);
  if (n.length < 3) return [];
  const names = (a: Area) => [a.name, ...a.searchAliases].map(norm);
  const exact = areas.filter((a) => names(a).includes(n));
  if (exact.length) return exact;
  return areas.filter((a) => names(a).some((x) => x.startsWith(n)));
}
```

---

## Placeholder summary (for `npm run prelaunch`)

- All 14 towns (`confirmed: false`) — the service area itself
- All 14 drive times (`driveConfirmed: false`)
- Office map coordinates (`coordsConfirmed: false`)
- Service radius (hub FAQ)
- Travel or distance fees
- Typical start time (hub FAQ, Beaufort FAQ)
- Minimum visit hours (Port Royal, Burton)
- VA benefits accepted? (Port Royal)
- Client transportation — do caregivers drive clients? (Port Royal, Lady's Island)
- Late-arrival process (Lady's Island)
- Emergency / hurricane plan (St. Helena Island)
- How families receive updates (Burton, Bluffton)
- Phone or video join for the assessment (Bluffton)
- Gate-pass process and fees (Hilton Head Island)
- Seasonal start/stop policy (Hilton Head Island)
- Hilton Head scheduling limits
- Bluffton, Hilton Head, Sun City in service area
- 8 town photos `town-{slug}.jpg` + check alt text against real photos
