# SEO_PLAN — dawsonhomecare.com

**Status:** Final for build. Claude Code reads §1–§5 and §8 in Code chat 6 (metadata + JSON-LD) and Code chat 8 (redirects, sitemap, robots).
**Sources:** 06, 08 §3–§4, 09 §3 + §6, COPY_HOME, COPY_SERVICES, COPY_TRUST, COPY_COST_FAQ, COPY_AREAS, COPY_CONVERSION, COPY_LEGAL, 04, 10. Search-feature facts checked 19 Oct 2026 (§9).
**Overrides:** this file replaces every "Page meta (draft)" block in the COPY_* files. Where a COPY draft was already right, it's kept word for word.

---

## 0. Ground rules (read first)

1. **Limits.** Titles ≤ 60 characters. Meta descriptions 120–155. OG titles ≤ 65. Every value in §1 was counted.
2. **Always "Beaufort, SC" in titles, never bare "Beaufort".** Beaufort, North Carolina competes for the same words.
3. **Brand in titles:** short form "Dawson & Dawson" (or "Dawson & Dawson Home Care" when there's room). Legal name **Dawson and Dawson Home Care LLC** lives in JSON-LD and legal pages.
4. **No computed years in metadata or JSON-LD.** Static metadata goes stale on January 1. Use "since 2002" and `foundingDate: "2002"` only. `{years}` stays in page copy, where it's computed at render.
5. **No placeholders in production metadata or JSON-LD.** The schema builder drops any field whose value is unconfirmed. `npm run prelaunch` fails if any rendered JSON-LD or `<meta>` contains `[[`.
6. **Non-medical vocabulary.** No page targets "home health", "nursing", "skilled care", "live-in care", "dementia care" or "memory care". "Home health" appears only as the comparison topic ("home care vs home health"). Live-in and dementia stay out until confirmed (COPY_SERVICES, 04).
7. **Office hours vs care hours stay machine-readable and separate:** `LocalBusiness.openingHoursSpecification` = office, Mon–Fri 08:00–17:00. `Service.hoursAvailable` = 24 hours, 7 days. Never put 24/7 on the business node; it would contradict the Google Business Profile.
8. **Indexing gate.** `NEXT_PUBLIC_INDEXABLE=true` only on the production domain. Localhost, Vercel previews and the reveal build ship `noindex, nofollow` on every page and `Disallow: /` in robots.txt. `/styleguide` and `/reveal-notes` return 404 in production.
9. **Keyword volumes are not verified.** No keyword tool is connected. Choices below follow how families search for local home care. Validate against Google Search Console queries at day 30 (§7) and adjust titles only where the data says so.

---

## 1. Page metadata

Two tables, keyed by path, so they stay readable. `og:description` = meta description on every page. The same data, typed, is `content/seo.ts` (§8).

### 1.1 Title, description, OG title, indexing

| Path | SEO title | Meta description | OG title | Index |
|---|---|---|---|---|
| `/` | In-Home Care in Beaufort, SC \| Dawson & Dawson Home Care | Owner-run, non-medical home care in Beaufort, SC since 2002. Personal care, home help, companionship, respite and 24-hour care. Free in-home assessment. | Care that feels like family, from an owner who meets yours | index |
| `/care` | Home Care Services in Beaufort, SC \| Dawson & Dawson | Non-medical home care in Beaufort, SC: personal care, home help, companionship, respite and 24-hour care. Owner-run since 2002. Free home visit. | Home care built around your family: five ways we help | index |
| `/care/personal-care` | Personal Care at Home in Beaufort, SC \| Dawson & Dawson | Gentle, non-medical help with bathing, dressing, the bathroom and moving safely at home. Owner-run in Beaufort, SC since 2002. Free home visit. | Personal care at home, done with dignity | index |
| `/care/home-help` | Home Help & Homemaker Care in Beaufort, SC \| Dawson & Dawson | Meals, laundry, light housekeeping, errands and medication reminders at home in Beaufort, SC. Owner-run since 2002. Book a free home visit. | Home help that keeps the house running | index |
| `/care/companionship` | Companion Care for Seniors in Beaufort, SC \| Dawson & Dawson | Friendly company, conversation, walks, games and outings for older adults at home in Beaufort, SC. Owner-run since 2002. Free home visit. | Companionship that brightens the week | index |
| `/care/respite-care` | Respite Care in Beaufort, SC \| Dawson & Dawson | Respite care in Beaufort, SC: a real break for family caregivers. We step in for a few hours, a weekend or longer, and your loved one keeps their routine. | Respite care that gives you a real break | index |
| `/care/24-hour-care` | 24-Hour & Overnight Care in Beaufort, SC \| Dawson & Dawson | Non-medical care day and night at home in Beaufort, SC. Overnight help, safe bathroom trips and support after a hospital stay. Owner-run since 2002. | 24-hour care, so someone's always there | index |
| `/find-care` | Find the Right Home Care: 1-Minute Quiz \| Dawson & Dawson | Not sure what kind of home care you need? Answer five quick questions and get a suggested plan for your family. No email needed. | Not sure what care Mom or Dad needs? Take the 1-minute quiz | index |
| `/how-it-works` | How Home Care Works \| Dawson & Dawson, Beaufort SC | Getting started with home care in Beaufort, SC: one call, a free home visit from our owner, a care plan built with you, and regular check-ins. | From first call to first visit: how home care starts | index |
| `/paying-for-care` | Home Care Costs & Ways to Pay, Beaufort SC \| Dawson & Dawson | Estimate the cost of home care and see how families pay: private pay, long-term care insurance, VA benefits, Medicaid waivers — and what Medicare covers. | What home care costs, and how families pay for it | index |
| `/areas-we-serve` | Home Care Across the Lowcountry \| Dawson & Dawson | Non-medical home care from our office in Beaufort, SC, across the Lowcountry. Find your town, see drive times and book a free in-home assessment. | Home care across the Lowcountry, from our office in Beaufort | index |
| `/areas-we-serve/beaufort` | Senior Home Care in Beaufort, SC \| Dawson & Dawson | Home care from our Beaufort office: bathing, meals, companionship, respite and 24-hour care. Owner-run since 2002. Free in-home assessment. | Senior home care in Beaufort, from right down the road | town-confirmed |
| `/areas-we-serve/port-royal` | In-Home Care in Port Royal, SC \| Dawson & Dawson | Help at home in Port Royal: bathing, meals, walks, respite and overnight care. Local and owner-run since 2002. Free in-home assessment. | In-home care in Port Royal: small town, close by | town-confirmed |
| `/areas-we-serve/ladys-island` | In-Home Care on Lady's Island, SC \| Dawson & Dawson | Home care on Lady's Island, just over the bridge from Beaufort: personal care, home help, companionship, respite and overnight care. Free assessment. | In-home care on Lady's Island: island life, close to town | town-confirmed |
| `/areas-we-serve/st-helena-island` | In-Home Care on St. Helena Island, SC \| Dawson & Dawson | Non-medical home care on St. Helena Island: respite for family caregivers, personal care, home help and overnight care. Free visit at home. | In-home care on St. Helena Island, on your family's terms | town-confirmed |
| `/areas-we-serve/burton` | In-Home Care in Burton, SC \| Dawson & Dawson | Our office is on Robert Smalls Parkway, minutes from Burton. Personal care, home help, respite and overnight care. Owner-run since 2002. | In-home care in Burton: close enough to be neighbors | town-confirmed |
| `/areas-we-serve/okatie` | In-Home Care in Okatie & Sun City, SC \| Dawson & Dawson | Home care in Okatie and Sun City Hilton Head: respite for caregiving spouses, personal care, home help and overnight care. Free in-home assessment. | In-home care in Okatie and Sun City: independence is the point | town-confirmed |
| `/areas-we-serve/bluffton` | In-Home Care in Bluffton, SC \| Dawson & Dawson | Home care in Bluffton for parents who retired here and families who live far away. Personal care, companionship, respite and 24-hour care. | In-home care in Bluffton: new to town, not on your own | town-confirmed |
| `/areas-we-serve/hilton-head-island` | In-Home Care on Hilton Head Island, SC \| Dawson & Dawson | Non-medical home care on Hilton Head Island, including gated communities and part-year residents. Owner-run since 2002. Call to check scheduling. | In-home care on Hilton Head Island, with help close at hand | town-confirmed |
| `/about` | About Dawson & Dawson Home Care \| Beaufort, SC Since 2002 | Dawson and Dawson Home Care has cared for Lowcountry families since 2002. Owner-run, licensed and insured, with an office in Beaufort, SC. | Here since 2002. Still personal. | index |
| `/reviews` | Reviews \| Dawson & Dawson Home Care, Beaufort SC | Read what Lowcountry families say about Dawson and Dawson Home Care — owner-run, non-medical home care in Beaufort, SC since 2002. | In their words: families on Dawson & Dawson Home Care | reviews-3-real |
| `/for-professionals` | Refer a Client for Home Care \| Dawson & Dawson, Beaufort SC | For discharge planners, case managers and care teams: refer a client for non-medical home care in Beaufort, SC in about 2 minutes, or fax (866) 502-3509. | Refer a client for home care in about 2 minutes | index |
| `/careers` | Caregiver Jobs in Beaufort, SC \| Dawson & Dawson Home Care | Join an owner-run home care team in Beaufort, SC, caring for Lowcountry families since 2002. See open caregiver roles and apply online. | Caregiver jobs in Beaufort: do work that matters, close to home | index |
| `/faq` | Home Care Questions & Answers \| Dawson & Dawson, Beaufort SC | Plain answers about non-medical home care in Beaufort, SC: getting started, services, cost and payment, caregivers, safety and medical questions. | Home care questions, answered plainly | index |
| `/resources` | Home Care Guides for Lowcountry Families \| Dawson & Dawson | Plain-language guides for families caring for an older parent in Beaufort and the Lowcountry: getting started, paying for care and caregiver support. | Guides for Lowcountry families caring for someone they love | resources-3-posts |
| `/free-assessment` | Free In-Home Care Assessment \| Dawson & Dawson, Beaufort SC | Request a free, no-obligation home visit from our owner. Tell us a little about your family in 2 minutes and we'll call you to set it up. | A free visit at home, with our owner | index |
| `/contact` | Contact Dawson & Dawson Home Care \| Beaufort, SC | Call (843) 379-3321, text (866) 632-9766 or visit us at 69 Robert Smalls Parkway, Beaufort, SC. Care 24/7. Office Monday–Friday, 8 AM–5 PM. | Contact Dawson & Dawson Home Care in Beaufort | index |
| `/privacy-policy` | Privacy Policy \| Dawson & Dawson Home Care | How Dawson and Dawson Home Care LLC collects, uses and protects your information, including text messages. Plain language, no fine print. | Privacy Policy: Dawson & Dawson Home Care | index |
| `/sms-terms` | SMS Terms \| Dawson & Dawson Home Care | How texts from Dawson and Dawson Home Care LLC work: what we send, how often, what it costs, and how to get help or stop. Reply STOP any time. | SMS Terms: Dawson & Dawson Home Care | index |
| `/accessibility` | Accessibility \| Dawson & Dawson Home Care | Our commitment to a website everyone can use: Comfort Controls, full keyboard access and captions — and how to tell us if something gets in your way. | Accessibility at Dawson & Dawson Home Care | index |
| `/sitemap` | Site Map \| Dawson & Dawson Home Care | Every page on dawsonhomecare.com in one list: care services, areas we serve, paying for care, help for families, and how to reach us. | Site map: Dawson & Dawson Home Care | index |
| `/thank-you` | Thank You \| Dawson & Dawson Home Care | — | — | noindex, nofollow |
| 404 | Page Not Found \| Dawson & Dawson Home Care | — | — | noindex (status 404) |

**Index rules:**
- `town-confirmed` — index + sitemap only when `areas.ts → confirmed: true` (COPY_AREAS §1 rule 2). Until then `noindex, follow`.
- `reviews-3-real` — index only with ≥ 3 reviews where `placeholder: false` (COPY_TRUST launch rules). Until then `noindex, follow`, out of menus and sitemap.
- `resources-3-posts` — index once 3 posts are published. Until then `noindex, follow`, out of the sitemap, linked only from the footer.

**Changed vs the COPY drafts (and why):**
- `/care/personal-care` description — "toileting" → "the bathroom" (plain-language rule).
- `/care/respite-care` description — now leads with "Respite care in Beaufort, SC". The draft never said "respite".
- `/paying-for-care` title — "Paying for Home Care…" → "Home Care Costs & Ways to Pay…". Families search the cost first.
- `/areas-we-serve` title + description — "Home care" in the title; the draft description named six towns that are all `confirmed: false`. It's the hub, indexed from day one, so it can't name unconfirmed towns. Switch back to the town list once towns are confirmed.
- `/faq` description — dropped "hospice" while hospice support is unconfirmed and the hospice question is hidden.
- `/resources` and `/sitemap` — new (no COPY file existed).

### 1.2 H1 and keywords

H1s are the approved copy, verbatim (italics removed here). Primary keyword = the query this page should own. Secondary = supporting terms to use naturally in body, alt text and anchors — never stuffed.

| Path | H1 (from COPY) | Primary keyword | Secondary keywords |
|---|---|---|---|
| `/` | Care that feels like family — from an owner who meets yours. | home care Beaufort SC | in-home care Beaufort SC · home care agency Beaufort · senior home care Lowcountry · non-medical home care · caregivers Beaufort SC |
| `/care` | Home care, built around your family. | home care services Beaufort SC | types of home care · in-home senior care services · non-medical home care services |
| `/care/personal-care` | Personal care, done with dignity. | personal care at home Beaufort SC | help bathing elderly parent · bathing and dressing help for seniors · personal care for seniors · ADL care |
| `/care/home-help` | Home help that keeps the house running. | homemaker services Beaufort SC | help at home for elderly · meal preparation for seniors · light housekeeping for seniors · medication reminders |
| `/care/companionship` | Companionship that brightens the week. | companion care Beaufort SC | companionship for seniors · elderly companion services · sitter for elderly · senior loneliness help |
| `/care/respite-care` | Respite care that gives you a real break. | respite care Beaufort SC | in-home respite care · respite for family caregivers · caregiver break |
| `/care/24-hour-care` | 24-hour care, so someone's always there. | 24-hour home care Beaufort SC | overnight care for elderly · overnight caregiver · round-the-clock care at home · night sitter for elderly |
| `/find-care` | Find the right care. | what kind of home care do I need | home care quiz · choosing home care for a parent |
| `/how-it-works` | From first call to first visit — here's exactly what happens. | how does home care work | starting home care for a parent · in-home care assessment · what to expect from home care |
| `/paying-for-care` | What care costs — and how families pay for it. | home care cost Beaufort SC | how to pay for home care in SC · does Medicare pay for home care · VA Aid and Attendance home care · SC Community Choices waiver · long-term care insurance home care |
| `/areas-we-serve` | Home care across the Lowcountry — from our office in Beaufort. | home care Lowcountry SC | home care Beaufort County · in-home care near Beaufort · {confirmed town names} |
| `/areas-we-serve/beaufort` | In-Home Care in Beaufort, SC | senior care Beaufort SC | elderly care Beaufort SC · in-home senior care Beaufort historic district · home care 29902 · home care 29906 |
| `/areas-we-serve/port-royal` | In-Home Care in Port Royal, SC | home care Port Royal SC | senior care Port Royal SC · elderly care Port Royal · veteran home care Port Royal |
| `/areas-we-serve/ladys-island` | In-Home Care on Lady's Island, SC | home care Lady's Island SC | senior care Lady's Island · in-home care Ladys Island |
| `/areas-we-serve/st-helena-island` | In-Home Care on St. Helena Island, SC | home care St. Helena Island SC | senior care St. Helena Island · respite care St. Helena · elder care Frogmore |
| `/areas-we-serve/burton` | In-Home Care in Burton, SC | home care Burton SC | senior care Burton SC · home care near Laurel Bay |
| `/areas-we-serve/okatie` | In-Home Care in Okatie, SC | home care Okatie SC | home care Sun City Hilton Head · respite care Sun City · senior care Okatie |
| `/areas-we-serve/bluffton` | In-Home Care in Bluffton, SC | home care Bluffton SC | senior care Bluffton SC · in-home care Bluffton · elderly care Bluffton |
| `/areas-we-serve/hilton-head-island` | In-Home Care on Hilton Head Island, SC | home care Hilton Head Island | senior care Hilton Head · in-home care Sea Pines · home care for part-time residents Hilton Head |
| `/about` | Here since 2002. Still personal. | Dawson and Dawson Home Care | locally owned home care Beaufort · owner-run home care agency · home care since 2002 |
| `/reviews` | In their words. | Dawson and Dawson Home Care reviews | home care reviews Beaufort SC |
| `/for-professionals` | Refer a client in about 2 minutes. | home care referral Beaufort SC | discharge planning home care · non-medical home care referral · home care for discharged patients Beaufort |
| `/careers` | Do work that matters, close to home. | caregiver jobs Beaufort SC | in-home caregiver jobs · home care jobs Lowcountry · CNA jobs Beaufort SC *(only once the CNA role is confirmed)* |
| `/faq` | Your questions, answered. | home care questions | home care vs home health · is home care covered by Medicare · how home care works |
| `/resources` | Guides for families. *(proposed — no COPY file yet)* | caregiving guides Beaufort SC | aging parent help Lowcountry · caring for elderly parent tips |
| `/free-assessment` | A free visit at home, with our owner. | free in-home care assessment Beaufort | home care consultation · free home visit home care |
| `/contact` | We're here when you're ready. | Dawson and Dawson Home Care phone | home care Robert Smalls Parkway · home care agency Beaufort contact |
| `/privacy-policy` · `/sms-terms` · `/accessibility` | Privacy Policy · SMS Terms · Accessibility | — (navigational only) | — |
| `/sitemap` | Site map *(proposed)* | — | — |
| `/thank-you` · 404 | Thank you, {firstName}. · This page wandered off. | — | — |

**One gap worth fixing (copy change — needs your OK, see Decisions):** the Home hero has no visible "home care" or "Beaufort" in its H1, subline or eyebrow. The title carries the keyword, but the hero is the first thing Google and a skimming daughter read. Proposal: add the eyebrow **In-home care · Beaufort, SC** above the H1 (COPY_HOME ch. 1 currently says "Eyebrow: none"). H1 stays as approved.

---

## 2. Global metadata spec (for `lib/seo.ts`)

### 2.1 Base
- `metadataBase = new URL(process.env.NEXT_PUBLIC_SITE_URL)` → production `https://dawsonhomecare.com`.
- Titles are **absolute** (no `title.template`) — every title in §1 is already complete.
- `alternates.canonical` = absolute URL of the path, **no trailing slash, no query string, no hash**.
- `openGraph`: `type: "website"` (posts: `"article"`), `siteName: "Dawson & Dawson Home Care"`, `locale: "en_US"`, `url` = canonical, `title` = OG title, `description` = meta description.
- `twitter`: `card: "summary_large_image"`, same title/description. No handle (none known).
- `robots` from the index rule. Production non-index pages: `noindex, follow` (except `/thank-you`: `noindex, nofollow`).
- `formatDetection: { telephone: false }` — phone links are already explicit `tel:` links; stops iOS double-linking.
- `icons` from BRAND_FINAL (favicon set + Apple touch icon).

### 2.2 Canonical URL rules
- **Host:** one canonical host, `https://dawsonhomecare.com` `[[TO CONFIRM: does the current site use www or the bare domain? Keep whichever Google already indexes; redirect the other in one hop]]`.
- **Trailing slash:** `trailingSlash: false`. Old WordPress URLs end in `/`; §5 covers them.
- **Query parameters never create a new page.** These links exist by design and all canonicalize to the clean path: `/free-assessment?service=&needs=&town=&pay=&hours=&days=&overnight=&from=` · `/paying-for-care?service=&hours=&days=&overnight=&from=&preset=` · `/find-care?town=` · `/reviews?service=` · any `utm_*`. Don't block them in robots.txt — Google must be able to crawl them to see the canonical.
- **Anchors** (`#estimator`, `#pay-medicare`, `/faq#cost`) are not separate URLs. Never put a `#` URL in sitemap.xml or a canonical.

### 2.3 robots.txt
Production:
```
User-agent: *
Allow: /
Disallow: /api/

Sitemap: https://dawsonhomecare.com/sitemap.xml
```
Every other environment:
```
User-agent: *
Disallow: /
```
`/thank-you` is **not** disallowed — see Decisions D2. It carries `noindex, nofollow`; a robots block would stop Google from ever seeing that tag.

### 2.4 sitemap.xml (`app/sitemap.ts`)
- Generated from `content/seo.ts` + `areas.ts` + `reviews.json` + resources. Includes only pages whose index rule resolves to `index`.
- `lastModified` = the date the page's content last changed (store `updated` per entry; fall back to launch date). Never `new Date()` at build — that tells Google everything changed on every deploy.
- No `priority` or `changefreq` (Google ignores both).
- Excludes: `/thank-you`, 404, unconfirmed towns, `/reviews` and `/resources` until their rules pass, `/styleguide`, `/reveal-notes`, `/api/*`.

### 2.5 OG images (`opengraph-image.tsx`)
- 1200×630. One brand template, generated per route from the OG title. No photos until real ones exist (11 → `og-default.jpg` for the root).
- Layout: cream background, OG title in Fraunces in plum-950 (left, max 3 lines), stacked logo bottom-left, leaf-500 heartbeat line as the accent, "dawsonhomecare.com · (843) 379-3321" in Plus Jakarta Sans, muted. **Tokens only** (BRAND_FINAL) — no gradients, no new colors.
- Fonts loaded as files inside the route (no network fetch at build).
- `alt` = OG title.

### 2.6 Images and headings (SEO side of the a11y rules)
- File names are descriptive and already set in 11 (`service-personal-care.jpg`, `town-beaufort.jpg`). Keep them.
- Alt text comes from the COPY files. Decorative images `alt=""`. Don't add keywords to alt text that the image doesn't show.
- One H1 per page. Headings follow the COPY structure (H2 sections, H3 cards/FAQs).

---

## 3. Structured data (JSON-LD)

### 3.1 Where each type goes

| Page | JSON-LD |
|---|---|
| Every page (root layout) | `LocalBusiness` (§3.2) |
| `/` | + `WebSite` (§3.3) |
| `/care` | + `ItemList` of the 5 services (§3.5) + `BreadcrumbList` |
| `/care/[slug]` | + `Service` (§3.4) + `FAQPage` (§3.7) + `BreadcrumbList` |
| `/areas-we-serve/[town]` | + `Service` for the town (§3.6) + `FAQPage` (3 local FAQs) + `BreadcrumbList` |
| `/faq` | + `FAQPage` (production-visible items only) + `BreadcrumbList` |
| `/resources/[slug]` | + `BlogPosting` (§3.9) + `BreadcrumbList` |
| Every other inner page | + `BreadcrumbList` |

**Not used, on purpose:**
- `AggregateRating` / `Review` on our own business — self-serving reviews are ignored or penalized (COPY_TRUST). The Google rating shows as text only.
- `MedicalBusiness` or any medical subtype — wrong signal for a non-medical agency.
- `HowTo` (retired), `SearchAction` / sitelinks search box (retired), `JobPosting` (jobs live on Hireology; postings would go stale here).
- `FAQPage` on Home, the areas hub, `/for-professionals` or `/careers` — see §3.7.

**Implementation:** `lib/schema.ts` builds every node from the data files (`site.config.ts`, `services.ts`, `areas.ts`, `faq.ts`, `seo.ts`). Render with `<script type="application/ld+json">` from server components. All nodes reference the business by `@id`, so one source of truth. The builder **omits** any property whose source is unconfirmed — the `[[TO CONFIRM]]` values below show what's missing, they never ship.

### 3.2 `LocalBusiness` — site-wide

```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://dawsonhomecare.com/#business",
  "name": "Dawson and Dawson Home Care LLC",
  "legalName": "Dawson and Dawson Home Care LLC",
  "alternateName": ["Dawson & Dawson Home Care", "Dawson and Dawson Home Care"],
  "description": "Owner-run, non-medical home care in Beaufort, South Carolina, since 2002: personal care, home help, companionship, respite care, and 24-hour and overnight care.",
  "url": "https://dawsonhomecare.com/",
  "logo": {
    "@type": "ImageObject",
    "url": "https://dawsonhomecare.com/logo/dawson-mark-512.png",
    "width": 512,
    "height": 512
  },
  "image": "https://dawsonhomecare.com/og/og-default.jpg",
  "telephone": "+1-843-379-3321",
  "faxNumber": "+1-866-502-3509",
  "email": "info@dawsonhomecare.com",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "69 Robert Smalls Parkway, Suite 3F",
    "addressLocality": "Beaufort",
    "addressRegion": "SC",
    "postalCode": "29906",
    "addressCountry": "US"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "[[TO CONFIRM: office latitude — the Google Business Profile pin]]",
    "longitude": "[[TO CONFIRM: office longitude]]"
  },
  "hasMap": "[[TO CONFIRM: Google Business Profile map URL]]",
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "08:00",
      "closes": "17:00"
    }
  ],
  "contactPoint": [
    {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "telephone": "+1-843-379-3321",
      "email": "info@dawsonhomecare.com",
      "areaServed": "US",
      "hoursAvailable": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "08:00",
        "closes": "17:00"
      }
    },
    {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "telephone": "+1-866-632-9766",
      "contactOption": "TollFree",
      "areaServed": "US"
    },
    {
      "@type": "ContactPoint",
      "contactType": "referrals",
      "telephone": "+1-843-379-3321",
      "faxNumber": "+1-866-502-3509",
      "url": "https://dawsonhomecare.com/for-professionals"
    }
  ],
  "foundingDate": "2002",
  "identifier": {
    "@type": "PropertyValue",
    "name": "South Carolina in-home care provider license",
    "value": "[[TO CONFIRM: SC license number]]"
  },
  "areaServed": [
    {
      "@type": "City",
      "name": "Beaufort",
      "containedInPlace": { "@type": "State", "name": "South Carolina" }
    },
    "[[TO CONFIRM: every other town with confirmed: true in areas.ts — see §3.6 for City vs Place]]"
  ],
  "knowsAbout": [
    "Non-medical home care",
    "Personal care",
    "Homemaker services",
    "Companion care",
    "Respite care",
    "Overnight care"
  ],
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Home care services",
    "itemListElement": [
      { "@type": "Offer", "itemOffered": { "@type": "Service", "@id": "https://dawsonhomecare.com/care/personal-care#service", "name": "Personal Care", "url": "https://dawsonhomecare.com/care/personal-care" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "@id": "https://dawsonhomecare.com/care/home-help#service", "name": "Home Help", "url": "https://dawsonhomecare.com/care/home-help" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "@id": "https://dawsonhomecare.com/care/companionship#service", "name": "Companionship", "url": "https://dawsonhomecare.com/care/companionship" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "@id": "https://dawsonhomecare.com/care/respite-care#service", "name": "Respite Care", "url": "https://dawsonhomecare.com/care/respite-care" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "@id": "https://dawsonhomecare.com/care/24-hour-care#service", "name": "24-Hour & Overnight Care", "url": "https://dawsonhomecare.com/care/24-hour-care" } }
    ]
  },
  "sameAs": [
    "https://www.instagram.com/dawsonhomecare/",
    "[[TO CONFIRM: Google Business Profile URL]]",
    "[[TO CONFIRM: any other official profiles, e.g. Facebook — only real ones]]"
  ]
}
```

**Field notes**

| Field | Rule |
|---|---|
| `name` | Must match the Google Business Profile name **exactly** (09 §6). Default is the legal name. `[[TO CONFIRM: GBP name — if it's "Dawson & Dawson Home Care", use that here and keep the legal name in legalName]]` |
| `address` | Site format: "69 Robert Smalls Parkway, Suite 3F". Directories show "69 Robert Smalls Pkwy #3F" — same place; keep the site format everywhere we control. |
| `geo` | Omitted until `OFFICE.coordsConfirmed` (areas.ts). Never use the approximate map coordinate. |
| `hasMap` | Omitted until confirmed. The site currently links `http://goo.gl/maps/SVvYGS3TipaMpbgQ9` — at the reveal, check it still resolves and swap in the GBP share link on /contact and /about too. |
| `openingHoursSpecification` | Office hours only. Care hours live on each `Service`. Holidays from `site.config.ts` can be added as `specialOpeningHoursSpecification` once the list is confirmed. |
| `identifier` (license) | Omitted until the license number is confirmed. |
| `areaServed` | Confirmed towns only. Fallback while none are confirmed: Beaufort alone (the office city). |
| `priceRange`, `paymentAccepted`, `currenciesAccepted`, `knowsLanguage`, `founder`/`employee` | **Not included.** Prices, payment methods, languages and owner details are unconfirmed (04). Add only when confirmed. |
| `image` | og-default until a real office or team photo lands (`office-exterior.jpg`). |
| `logo` | Square PNG export of the logo mark, ≥ 112×112, on a plain background. Not SVG. |

### 3.3 `WebSite` — Home only

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://dawsonhomecare.com/#website",
  "name": "Dawson & Dawson Home Care",
  "alternateName": ["Dawson and Dawson Home Care", "dawsonhomecare.com"],
  "url": "https://dawsonhomecare.com/",
  "publisher": { "@id": "https://dawsonhomecare.com/#business" },
  "inLanguage": "en-US"
}
```
This is what Google uses for the site name shown above each result. It matches `og:site_name` and the title suffix. No `potentialAction`.

### 3.4 `Service` — the 5 service pages

```json
{
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": "https://dawsonhomecare.com/care/{slug}#service",
  "name": "{name}",
  "alternateName": "{alternateName}",
  "serviceType": "{serviceType}",
  "category": "Non-medical home care",
  "description": "{description}",
  "url": "https://dawsonhomecare.com/care/{slug}",
  "provider": { "@id": "https://dawsonhomecare.com/#business" },
  "areaServed": "{same array as LocalBusiness.areaServed}",
  "hoursAvailable": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    "opens": "00:00",
    "closes": "23:59"
  },
  "audience": { "@type": "PeopleAudience", "audienceType": "{audienceType}" },
  "isRelatedTo": [
    { "@id": "https://dawsonhomecare.com/care/{pair1}#service" },
    { "@id": "https://dawsonhomecare.com/care/{pair2}#service" }
  ]
}
```

| Slug | name | alternateName | serviceType | description | audienceType | isRelatedTo (COPY "Pairs well with") |
|---|---|---|---|---|---|---|
| `personal-care` | Personal Care | Help with daily living (ADLs) | Non-medical personal care at home | Gentle, non-medical help at home with bathing, dressing, using the bathroom and moving around safely. | Older adults who need hands-on help with daily living, and their families | home-help, 24-hour-care |
| `home-help` | Home Help | Homemaker care | Homemaker services | Meals, laundry, light housekeeping, groceries, errands and medication reminders at home. Non-medical. | Older adults who want help keeping their home running | companionship, personal-care |
| `companionship` | Companionship | Companion care | Companion care for older adults | Friendly company, conversation, games, walks and outings for older adults at home. Non-medical. | Older adults who spend a lot of time alone, and their families | home-help, respite-care |
| `respite-care` | Respite Care | Respite | In-home respite care | Care at home so a family caregiver can rest, work or travel — a few hours, a weekend or longer. Non-medical. | Family caregivers and the people they care for | personal-care, 24-hour-care |
| `24-hour-care` | 24-Hour & Overnight Care | Round-the-clock care | Overnight and 24-hour non-medical home care | A caregiver through the night, or care around the clock in shifts, 7 days a week. Non-medical. | Older adults who shouldn't be alone at night, and their families | personal-care, respite-care |

No `offers` or prices (unconfirmed). No hospice service node until hospice support is confirmed.

### 3.5 `ItemList` — `/care`

```json
{
  "@context": "https://schema.org",
  "@type": "ItemList",
  "@id": "https://dawsonhomecare.com/care#services",
  "name": "Home care services from Dawson & Dawson Home Care",
  "itemListOrder": "https://schema.org/ItemListOrderAscending",
  "numberOfItems": 5,
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "url": "https://dawsonhomecare.com/care/personal-care", "name": "Personal Care" },
    { "@type": "ListItem", "position": 2, "url": "https://dawsonhomecare.com/care/home-help", "name": "Home Help" },
    { "@type": "ListItem", "position": 3, "url": "https://dawsonhomecare.com/care/companionship", "name": "Companionship" },
    { "@type": "ListItem", "position": 4, "url": "https://dawsonhomecare.com/care/respite-care", "name": "Respite Care" },
    { "@type": "ListItem", "position": 5, "url": "https://dawsonhomecare.com/care/24-hour-care", "name": "24-Hour & Overnight Care" }
  ]
}
```

### 3.6 `Service` — town pages

One office, so **never** a second `LocalBusiness` per town (COPY_AREAS §1 rule 5).

```json
{
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": "https://dawsonhomecare.com/areas-we-serve/{slug}#service",
  "name": "In-home care {in} {town}, SC",
  "serviceType": "Non-medical home care",
  "category": "Non-medical home care",
  "url": "https://dawsonhomecare.com/areas-we-serve/{slug}",
  "provider": { "@id": "https://dawsonhomecare.com/#business" },
  "areaServed": {
    "@type": "{City | Place}",
    "name": "{town}",
    "containedInPlace": { "@type": "AdministrativeArea", "name": "{county} County, South Carolina" }
  },
  "hoursAvailable": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    "opens": "00:00",
    "closes": "23:59"
  },
  "isRelatedTo": [
    { "@id": "https://dawsonhomecare.com/care/personal-care#service" },
    { "@id": "https://dawsonhomecare.com/care/home-help#service" },
    { "@id": "https://dawsonhomecare.com/care/companionship#service" },
    { "@id": "https://dawsonhomecare.com/care/respite-care#service" },
    { "@id": "https://dawsonhomecare.com/care/24-hour-care#service" }
  ]
}
```

`City` for incorporated places, `Place` for unincorporated communities (more accurate than COPY_AREAS' blanket `City`). Add `schemaType` to each `areas.ts` entry:

| `City` | `Place` |
|---|---|
| Beaufort · Port Royal · Bluffton · Hilton Head Island · Ridgeland · Hardeeville · Yemassee | Burton · Lady's Island · St. Helena Island · Okatie · Shell Point · Seabrook · Sheldon |

Rendered on the page while the town is unconfirmed (the page is `noindex` anyway), so the reveal shows the full build. The town enters `LocalBusiness.areaServed` only when `confirmed: true`.

### 3.7 `FAQPage` — `/faq`, service pages, town pages

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": "https://dawsonhomecare.com{path}#faq",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "{question}",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "{blocksToText(answer)} {link label, if any}"
      }
    }
  ]
}
```

**Important — honest expectations.** Google stopped showing FAQ rich results for every site on May 7, 2026, and is removing FAQ support from Search Console and the Rich Results Test. The markup does no harm and still helps machines (including AI answers) read the page clearly, so we keep it **only where the COPY files already specify it** and don't add it anywhere new. Nobody should report FAQ markup as an SEO win.

Rules:
- Production-visible items only. Items with `hideUntilConfirmed: true` are excluded. Pending blocks are excluded (`blocksToText` already does this).
- COPY_SERVICES answers with an inline `[[TO CONFIRM` (e.g. `#pc-mobility`, `#pc-hospital`, `#tf-awake`): the sentence containing the token is dropped from page and schema in production; an answer that is *only* a token (`#tf-awake`, `#co-memory`) drops the whole question.
- Text in schema = text on the page, word for word. No extra keywords.
- Home ch. 13: no `FAQPage` (COPY_COST_FAQ). `/paying-for-care`: none.

### 3.8 `BreadcrumbList` — every inner page

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://dawsonhomecare.com/" },
    { "@type": "ListItem", "position": 2, "name": "Care", "item": "https://dawsonhomecare.com/care" },
    { "@type": "ListItem", "position": 3, "name": "Personal Care" }
  ]
}
```
Last item has no `item` (it's the current page). Labels match the visible breadcrumb exactly.

| Page | Visible trail (from COPY) |
|---|---|
| `/care` | Home › Care |
| `/care/[slug]` | Home › Care › {Service name} |
| `/find-care` | Home › Find the Right Care |
| `/how-it-works` | Home › How It Works |
| `/paying-for-care` | Home › Paying for Care |
| `/areas-we-serve` | Home › Areas we serve |
| `/areas-we-serve/[town]` | Home › Areas we serve › {Town} |
| `/about` | Home › About |
| `/reviews` | Home › About › Reviews |
| `/careers` | Home › About › Careers |
| `/for-professionals` | Home › For Professionals |
| `/faq` | Home › FAQ |
| `/resources` | Home › Resources |
| `/resources/[slug]` | Home › Resources › {Post title} |
| `/free-assessment` | Home › Free Assessment |
| `/contact` | Home › Contact |
| `/privacy-policy` · `/sms-terms` · `/accessibility` | Home › Privacy Policy · Home › SMS Terms · Home › Accessibility |
| `/sitemap` | Home › Site Map |
| `/thank-you`, 404 | none |

Note: since January 2025 Google shows only the domain in mobile results; breadcrumbs still appear on desktop. Keep the markup — it's cheap, and it documents the hierarchy.

### 3.9 `BlogPosting` — `/resources/[slug]`

```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "@id": "https://dawsonhomecare.com/resources/{slug}#article",
  "headline": "{H1, ≤ 110 characters}",
  "description": "{meta description}",
  "url": "https://dawsonhomecare.com/resources/{slug}",
  "mainEntityOfPage": "https://dawsonhomecare.com/resources/{slug}",
  "datePublished": "{YYYY-MM-DD}",
  "dateModified": "{YYYY-MM-DD — the last real content change}",
  "image": "https://dawsonhomecare.com/resources/{slug}/opengraph-image",
  "inLanguage": "en-US",
  "isPartOf": { "@id": "https://dawsonhomecare.com/#website" },
  "publisher": { "@id": "https://dawsonhomecare.com/#business" },
  "author": {
    "@type": "Person",
    "name": "[[TO CONFIRM: owner full name]]",
    "jobTitle": "Owner",
    "worksFor": { "@id": "https://dawsonhomecare.com/#business" }
  }
}
```
Until the owner is confirmed, `author` = `{ "@id": "https://dawsonhomecare.com/#business" }` and the visible byline reads "The Dawson & Dawson team".

### 3.10 Validation (Code chat 8)
- Every page through the Schema Markup Validator (validator.schema.org): zero errors.
- Rich Results Test on `/care/personal-care` (Breadcrumb) and `/` (Local business).
- `npm run prelaunch` fails on: `[[` inside any JSON-LD; a `Review`/`AggregateRating` node; any `Service` named for hospice or dementia; `areaServed` containing an unconfirmed town; `name` ≠ `site.config.ts → gbpName` once that's set.

---

## 4. Internal linking plan

### 4.1 Structure (max 3 clicks from Home to anything)

```
/  (owns the head term)
├── /care ─────────────── 5 service pages (siblings link via "Pairs well with")
├── /find-care ────────── result screen → service pages → /free-assessment
├── /how-it-works
├── /paying-for-care ──── #estimator · #ways-to-pay · #pay-* · #questions-to-ask
├── /areas-we-serve ───── 8 town pages (siblings link via "Also nearby")
├── /about ────────────── /reviews · /careers
├── /for-professionals
├── /faq ──────────────── answers link to the page that owns each topic
├── /resources ────────── posts → 1 service + 1 money page + 1 owner page + 1 related post
└── /free-assessment ──── (every page links here) · /contact
```
Money pages: `/free-assessment` and `tel:+18433793321`. Every page links to both (header, mobile bar, CTA band) — already in the build.

### 4.2 Global links (every page, from 06)
Header: Care ▾ (5 services + quiz) · How It Works · Paying for Care · Areas · About ▾ (About, Reviews, Careers) · For Professionals · Call · Free Assessment.
Footer: Care links · Company links · contact block · Privacy · SMS Terms · Accessibility · Sitemap.
Breadcrumbs on all inner pages.

**Addition A1 — footer "Areas" column.** "Areas we serve" + one link per town where `hasPage && confirmed` (localhost/reveal: all 8). Data-driven from `areas.ts`, no new copy beyond the column heading **Areas we serve**. This gives every town page a sitewide crawl path; today they're reachable only from Home's map, the hub and each other.
`/reviews` appears in the About menu and footer only while it's indexable (COPY_TRUST launch rule). `/resources` sits in the footer from launch; it joins the main nav after 6 posts.

### 4.3 Query ownership (one page per query — no cannibalization)

| Query cluster | Owner | Others link *to* the owner, never compete |
|---|---|---|
| home care / in-home care Beaufort SC | `/` | Logo link on every page |
| home care services, types of home care | `/care` | Home ch. 3 button, footer, FAQ `#sv-what-help` |
| {service} Beaufort SC | `/care/{slug}` | Home Dawson House, /care cards, quiz results, town pages, FAQ answers, posts |
| senior care / elderly care Beaufort SC | `/areas-we-serve/beaufort` | Hub list, map, footer A1, "Also nearby" |
| home care {town} | `/areas-we-serve/{town}` | Same as above |
| what care do I need | `/find-care` | Every service page fallback link, Home ch. 4, /care §03 |
| how does home care work · what happens at the assessment | `/how-it-works` (`#free-assessment`) | FAQ `#free-assessment`, thank-you, Home ch. 5 |
| free in-home care assessment (the action) | `/free-assessment` | Every CTA |
| home care cost · how to pay · Medicare / Medicaid waiver / VA / LTC insurance | `/paying-for-care` (+ section anchors) | Service cost sections, FAQ cost answers, quiz result |
| home care vs home health | `/faq#home-care-vs-home-health` → **post P1 takes over once published** | Then change `faq.ts` item `home-care-vs-home-health` `link` to P1, and /care §04's text link too |
| referrals | `/for-professionals` | Home ch. 12, FAQ `#hm-referral`, contact topic hint |
| caregiver jobs | `/careers` | Home ch. 8, About §04, contact topic hint |
| brand + reviews | `/`, `/reviews`, `/about` | — |

### 4.4 Contextual links by template

All ✓ links already exist in the COPY files — build them exactly as written. ➕ = addition from this plan.

| Template | Links out (anchor → target) | Status |
|---|---|---|
| Home | 5 rooms → service pages · "See all care services" → /care · quiz → /find-care · "See how it works" → /how-it-works · "Read our story" → /about · "Meet the team" → /about#caregivers · "Read all reviews" → /reviews · estimator → /paying-for-care · map towns → town pages · "See all areas we serve" → /areas-we-serve · "Make a referral" → /for-professionals#refer · "See all questions" → /faq | ✓ |
| /care | Dawson House + cards → 5 services · combos → service pairs · "Find the right care" → /find-care · "Read more questions families ask" → /faq#home-care-vs-home-health | ✓ (swap last link to P1 when live) |
| Service page | 2 "Pairs well with" siblings · "Take the 1-minute quiz" → /find-care · "Estimate your cost" → /paying-for-care · "See ways families pay" → /paying-for-care#ways-to-pay · CTA → /free-assessment?service= | ✓ |
| Service page | **"Related guides"** slot after the FAQ: up to 2 posts whose `services` include this slug; hidden when none | ➕ A2 (post-launch, data-driven) |
| /how-it-works | "Use our referral form" → /for-professionals#refer · CTA → /free-assessment | ✓ |
| /paying-for-care | quiz → /find-care · external official sources (va.gov, scdhhs, medicare.gov) | ✓ |
| /areas-we-serve | 8 town pages · CTA | ✓ |
| Town page | 5 services · "Find the right care" → /find-care?town= · "See all questions" → /faq · "Also nearby" siblings · "See all areas" → hub · Beaufort/Port Royal/Burton specifics (directions, VA → /paying-for-care, respite → /care/respite-care, cost → /paying-for-care) | ✓ |
| Town page | **"Related guides"** slot (posts whose `areas` include this slug) | ➕ A3 (post-launch) |
| /about | "Meet our owner" → #owner · "See caregiver jobs" → /careers · directions · Instagram | ✓ |
| /faq | each answer's `link` → its owner page | ✓ (A4: update links as posts take over topics) |
| /for-professionals | "How families pay" → /paying-for-care#ways-to-pay | ✓ |
| /contact | referral form · careers · FAQ · free assessment | ✓ |
| Thank-you | /how-it-works#free-assessment · #have-ready · /faq · /paying-for-care | ✓ |
| 404 | / · /care · /contact · /faq · /sitemap | ✓ |
| Post | 1 service page · 1 money link (/free-assessment or tel) · the cluster owner from §4.3 · 1 related post · Standard CTA band | ➕ A5 (editorial rule) |
| /sitemap (HTML) | every indexable page, grouped like §4.1, built from `seo.ts` | ➕ A6 |

### 4.5 Anchor text rules
1. Descriptive, visible words. Never "click here", "read more" or "learn more" on their own. (The COPY files already follow this.)
2. Service links use the service name: "Personal Care", "Home Help", "Companionship", "Respite Care", "24-Hour & Overnight Care" — or "See {Service}".
3. Town links use the pattern "care {in} {Town}" ("See care on Lady's Island").
4. Don't force exact-match keywords ("home care Beaufort SC") into anchors. Natural phrasing wins.
5. One link per target per section. No sitewide keyword-anchor blocks.
6. No `nofollow` on internal links. External official sources (va.gov etc.) are normal links too.
7. Links with prefill params are fine — canonicals clean them (§2.2).
8. A post links to the owner page of any cluster it touches (§4.3). It never targets that cluster's primary keyword itself.

### 4.6 Checks
Code chat 8 crawl (Screaming Frog or `linkinator` on the production build): no orphan pages (every indexable URL has ≥ 1 contextual link plus nav/footer), no internal link to a redirect, no internal 404, no internal link to `/thank-you`.

---

## 5. Redirects — final list

### 5.1 Host and protocol (Vercel domain settings, one hop)
- `http://` → `https://`
- the non-canonical host → the canonical host `[[TO CONFIRM: www or apex — keep what Google indexes today]]`

### 5.2 Legacy WordPress URLs → new pages (permanent)

| # | Old URL (with and without trailing slash) | New URL | From |
|---|---|---|---|
| 1 | `/adl-care` | `/care/personal-care` | 08 §4 |
| 2 | `/personal-care` | `/care/personal-care` | 08 §4 |
| 3 | `/respite-care` | `/care/respite-care` | 08 §4 |
| 4 | `/companionship-care` | `/care/companionship` | 08 §4 |
| 5 | `/medical-referrals` | `/for-professionals` | 08 §4 |
| 6 | `/about-us` | `/about` | 08 §4 |
| 7 | `/contact-us` | `/contact` | 08 §4 |
| 8 | `/feed`, `/comments/feed` | `/` | 08 §4 |
| 9 | `/home` | `/` | new — common Elementor slug; harmless if it never existed |
| 10 | `/wp-sitemap.xml`, `/sitemap_index.xml`, `/page-sitemap.xml`, `/post-sitemap.xml` | `/sitemap.xml` | new — WordPress core / SEO-plugin sitemaps Google may have stored |

Note on "/personal-care": the old *Personal Care* page described laundry, errands and medication reminders — today that's **Home Help**. Google ranked it for that intent. Recommendation: keep 08's mapping to `/care/personal-care` (the name match is what families and old links expect); the Personal Care page's "Pairs well with" card already links Home Help. Alternative: map `/personal-care` → `/care/home-help` to match the old content. Your call — Decision D5.

Next.js `permanent: true` sends **308**, which Google treats the same as 301.

### 5.3 Gone (410, via middleware — 08 allows "/ or 410")

| Path prefix | Response |
|---|---|
| `/wp-admin`, `/wp-login.php`, `/xmlrpc.php`, `/wp-json`, `/wp-includes` | 410 Gone |
| `/wp-content/*` | 410 Gone — **except** the files in §5.5 step 4, which get copied to `/public/legacy/` and redirected |

Recommendation: 410. It tells bots the WordPress endpoints are gone for good and keeps junk out of analytics. Alternative (08's other option): redirect them to `/`.

### 5.4 `content/redirects.ts`

```ts
// content/redirects.ts — imported by next.config.ts → redirects(). SEO_PLAN.md §5.
// Each source is emitted with and without a trailing slash. Verify hop counts after
// launch (§5.6): if "/x/" takes two hops (trailing-slash normalization first), that's
// acceptable; for a single hop set skipTrailingSlashRedirect and normalize in middleware.

export interface LegacyRedirect {
  source: string;
  destination: string;
}

const legacy: LegacyRedirect[] = [
  { source: "/adl-care", destination: "/care/personal-care" },
  { source: "/personal-care", destination: "/care/personal-care" }, // Decision D5
  { source: "/respite-care", destination: "/care/respite-care" },
  { source: "/companionship-care", destination: "/care/companionship" },
  { source: "/medical-referrals", destination: "/for-professionals" },
  { source: "/about-us", destination: "/about" },
  { source: "/contact-us", destination: "/contact" },
  { source: "/feed", destination: "/" },
  { source: "/comments/feed", destination: "/" },
  { source: "/home", destination: "/" },
  { source: "/wp-sitemap.xml", destination: "/sitemap.xml" },
  { source: "/sitemap_index.xml", destination: "/sitemap.xml" },
  { source: "/page-sitemap.xml", destination: "/sitemap.xml" },
  { source: "/post-sitemap.xml", destination: "/sitemap.xml" },
  // Add rows from the pre-switch crawl (§5.5) here. Never blanket-redirect unknown URLs to "/".
];

export const redirects = legacy.flatMap(({ source, destination }) => [
  { source, destination, permanent: true },
  { source: `${source}/`, destination, permanent: true },
]);

/** 410 Gone — matched in middleware.ts. */
export const gonePrefixes = [
  "/wp-admin",
  "/wp-login.php",
  "/xmlrpc.php",
  "/wp-json",
  "/wp-includes",
  "/wp-content",
] as const;

/** /wp-content files still referenced elsewhere (§5.5 step 4). Copied to /public/legacy/ and redirected, not 410. */
export const legacyAssets: LegacyRedirect[] = [
  // { source: "/wp-content/uploads/2023/05/logo.png", destination: "/legacy/logo.png" },
];
```
Middleware checks `legacyAssets` before `gonePrefixes`.

### 5.5 Before the DNS switch (after the reveal — needs access)
1. **Google Search Console** → export Pages (indexed) and Performance → Pages (16 months). Every URL with impressions or clicks needs a row in §5.2 or must already exist.
2. **Crawl the live WordPress site** (Screaming Frog free covers it) including its XML sitemaps, attachment pages and PDFs.
3. **Links in:** GSC → Links → top linked pages. Each one must resolve in ≤ 2 hops.
4. **GoHighLevel:** search email templates, workflows, funnels and SMS templates for `dawsonhomecare.com/` links — especially `/wp-content/uploads/…` images (08 §3). Copy those files to `/public/legacy/`, add them to `legacyAssets`.
5. **Ads, GBP posts, directory listings** — note any deep links.
6. Any URL not covered → map to the closest new page. If there's no close page, let it 404 (the custom 404 helps the person).
Known third-party mentions today: a caregivers.com directory listing (links to an AgingCare profile, not to the site) and a 2022 Beaufort Lifestyle feature on the business (mentions the email as text, no link). Neither needs a redirect; the second is a link to reclaim (§6).

### 5.6 After the switch
- Script: request every old URL (both slash variants) → final status 200, ≤ 2 hops, correct destination. Every `gonePrefixes` sample → 410.
- GSC URL Inspection on Home, the 5 services, /for-professionals, /about, /contact.
- GSC "Not found (404)" report weekly for 4 weeks; add rows for anything real.
- Keep the WordPress hosting alive 30 days (08 §3).

---

## 6. Local SEO outside the site (after launch)

The map pack is driven by the Google Business Profile, not by site markup — this is where most local calls come from.
- **Google Business Profile:** website field → `https://dawsonhomecare.com/?utm_source=google&utm_medium=organic&utm_campaign=gbp` (the canonical strips the parameters; analytics sees GBP traffic). Hours = office hours, Mon–Fri 8 AM–5 PM — the same as the site's JSON-LD. Services list = the 5 service names, word for word. Description: non-medical, owner-run, Beaufort, since 2002 — no "best", no claims beyond 09 §3. Review the primary category at the reveal `[[TO CONFIRM: current GBP categories]]`.
- **NAP consistency:** name, address, phone identical to the site (after D-confirmation of `name`) on Bing Places, Apple Business Connect, Yelp, BBB, Caring.com, caregivers.com/AgingCare, Home Care Atlas, Facebook `[[if it exists]]`.
- **Reviews:** ask every client the same way through a GHL workflow — no gating, no incentives (COPY_TRUST). Reply to every review. Once there are 3 real ones, `/reviews` flips to indexable.
- **Link reclamation:** the 2022 Beaufort Lifestyle feature names the business but doesn't link — ask the publication to add a link to `/about`. Local organizations on the resource-guide post (P5) are natural link partners.
- **Competitor note (10):** ComForCare runs Beaufort and Seabrook city pages from a Beaufort address. Our town pages win on unique, useful local content — keep them that way (09 §6); never add a town page without something real to say.

---

## 7. 90-day post-launch plan

Week numbers count from launch day. Launch date isn't set; seasonal swaps are noted.

### 7.1 Launch day (SEO checklist)
- [ ] `NEXT_PUBLIC_INDEXABLE=true`, `NEXT_PUBLIC_SITE_URL=https://dawsonhomecare.com`; robots.txt production version live
- [ ] sitemap.xml lists only indexable URLs; `lastModified` = real dates
- [ ] Every indexable page: one H1, unique title + description from §1, absolute canonical, OG image renders
- [ ] JSON-LD validates; no `[[` in any output
- [ ] §5.6 redirect script passes
- [ ] GA4 events firing (names only, no form values — COPY_LEGAL §7 B16): `tel_click`, `sms_click`, `assessment_submit`, `callback_submit`, `contact_submit`, `referral_submit`, `quiz_completed`, `quiz_plan_emailed`, `estimator_used`
- [ ] Search Console: domain property (DNS TXT record only — **never touch MX, SPF, DKIM, DMARC**, 08 §3); submit sitemap. Bing Webmaster Tools: import from GSC
- [ ] GBP website link checked (§6)

### 7.2 Week by week

| Weeks | Site | Content | Off-site / measurement |
|---|---|---|---|
| 1 | Watch GSC Pages + 404s every 2–3 days; fix redirects; request indexing for Home, /care, 5 services, /paying-for-care, /how-it-works | — | GBP updated (§6); start review-request workflow |
| 2 | Confirmed towns → `confirmed: true` → those pages index and join `areaServed` + sitemap | **P1** | NAP cleanup: Bing, Apple, Yelp, BBB |
| 3–4 | `/reviews` indexable once 3 real reviews; swap FAQ/`/care` links to P1 (§4.3) | **P2**, **P3** | Directory cleanup: Caring.com, caregivers.com/AgingCare, Home Care Atlas |
| 5–6 | `/resources` indexable (3 posts); A2/A3 "Related guides" slots on | **P4** | **Day 30 report:** baseline for every metric in §7.5; set day-90 targets from it |
| 7–8 | — | **P5**, **P6** | Outreach for P5 to the local organizations it lists; Beaufort Lifestyle link request |
| 9–10 | Title/description tests: only pages with ≥ 100 impressions and below-average CTR in GSC | **P7** | **Day 60 report** |
| 11–13 | Update P1–P3 with links to newer posts (each post gets ≥ 2 internal links in) | **P8** | **Day 90 report**; plan the next quarter from the backlog |

### 7.3 Posts (90 days)

URL pattern `/resources/{slug}` — no dates in URLs. Each post is written in this Project as `COPY_POST_{slug}.md` (same voice, grade 6–8, claims rules), then built as MDX.

| # | Week | Working title (H1) | Slug | Primary query | Links to (§4.3 owners) | Needs before publishing |
|---|---|---|---|---|---|---|
| P1 | 2 | Home care or home health? What South Carolina families should know | `home-care-vs-home-health` | home care vs home health | /care · /paying-for-care#pay-medicare · /care/personal-care · /free-assessment | Nothing new — every fact is already approved (COPY_COST_FAQ). Re-check medicare.gov wording |
| P2 | 3 | 10 signs Mom or Dad may need help at home | `signs-parent-needs-help` | signs elderly parent needs help at home | /find-care · /care/home-help · /care/personal-care | Nothing new. **Seasonal swap:** if launch falls Nov–Jan, title it "Home for the holidays? 10 signs Mom or Dad may need help at home" and publish in week 2 instead of P1 |
| P3 | 4 | Coming home from the hospital: a first-week checklist for Beaufort families | `coming-home-from-the-hospital` | elderly parent coming home from hospital checklist | /care/personal-care · /care/24-hour-care · /how-it-works#start-time · /for-professionals | Write around `[[TO CONFIRM: typical start time]]`. No hospital names (no implied partnerships) |
| P4 | 6 | Caring for a parent in the Lowcountry when you live out of state | `long-distance-caregiving` | long-distance caregiving tips | /how-it-works · /faq#gs-far-away · /areas-we-serve · /free-assessment | Write around `[[TO CONFIRM: how families receive updates]]` |
| P5 | 7 | Free help for older adults in Beaufort County: a local resource guide | `beaufort-county-senior-resources` | senior resources Beaufort County SC | /paying-for-care#ways-to-pay · /care/respite-care · P6 | Verify every listing (name, phone, URL) the week it publishes; add `checked` dates. Starts with Lowcountry Area Agency on Aging and SCDHHS (both already in payments.ts) |
| P6 | 8 | Caregiver burnout: the signs you need a break — and how respite care works | `caregiver-burnout-respite` | caregiver burnout signs | /care/respite-care · /paying-for-care · P5 | Supportive, non-clinical. Point anyone in real distress to their doctor; no mental-health advice |
| P7 | 10 | When a parent says "I don't need help": how to start the conversation | `parent-refuses-help` | how to talk to elderly parent about getting help | /care/companionship · /faq#gs-reluctant · /find-care | Nothing new |
| P8 | 12 | A room-by-room home safety walk-through for older adults | `home-safety-walk-through` | home safety checklist for seniors | each room → its service (the Dawson House mapping) · /how-it-works#free-assessment | Printable checklist (same print pattern as "What to have ready"). For falls or home changes: "talk to their doctor or a home-modification pro" — no clinical advice |

**Post briefs (outline H2s, in order):**
- **P1** — The one-line difference · Side by side (reuse the approved table) · What Medicare pays for at home · Using both at once · Questions to ask either one · Next step.
- **P2** — Ten signs grouped: the kitchen · the house · the calendar and the mail · getting around · their mood and routine · What to do next (talk first; health changes → their doctor) · Quiz link.
- **P3** — Before discharge · Day one · The first week, day by day · Who does what (family, home health, home care) · When to call us.
- **P4** — Get the picture from far away · Build a local team · Set up updates that work · Visits home: what to look for · How Dawson works with families who live away.
- **P5** — Help with benefits · Help with care at home · Help for family caregivers · Help for veterans · Free local help — one card per organization, phone + link + `checked` date.
- **P6** — What burnout looks like · Why it isn't selfish to rest · What respite care is · How to set up a regular break · Paying for respite.
- **P7** — Why parents say no · Words that help, words that don't · Start small (companionship) · Bring in a neutral voice · When safety can't wait.
- **P8** — Bathroom · Kitchen · Porch and steps · Bedroom at night · Living room · Print the checklist · What our owner looks at during the free visit.

### 7.4 Backlog (next quarter, or when the fact is confirmed)

| Topic | Trigger |
|---|---|
| Hurricane season with an older parent: a Lowcountry plan | Publish by mid-May (season starts June 1). Needs `[[TO CONFIRM: Dawson's emergency and evacuation plan]]` (COPY_AREAS) |
| Aid and Attendance and other VA help for Lowcountry veterans | After Dawson's VA stance is confirmed. Supports Port Royal and Burton pages |
| South Carolina's Community Choices waiver, step by step | Any time as a neutral guide; owns "community choices waiver SC" — /paying-for-care#pay-medicaid links to it. CTA changes once provider status is confirmed |
| Part-year residents: arranging care on Hilton Head and in Bluffton | Only after Hilton Head and Bluffton are confirmed |
| What does an in-home caregiver do? A day on the job | Supports /careers |
| Memory changes in a parent: first steps | **Only** if dementia support is confirmed (04, COPY_SERVICES) |

### 7.5 Editorial and measurement rules
- **Facts:** every public-program fact links an official source and carries a `checked` date; re-check every 6 months. No invented statistics, no "expert" quotes, no AI-written testimonials.
- **Byline:** the owner once confirmed (Person in `BlogPosting`); until then "The Dawson & Dawson team". Visible "Last reviewed {date}".
- **Shape:** as long as the topic needs (typically 800–1,400 words), scannable H2s, one table or checklist, the Standard CTA band at the end. Same 18px / plain-language rules as the site.
- **Never:** medical advice, nursing claims, prices, payment methods or towns that aren't confirmed.
- **Measure (no targets until the day-30 baseline):** GSC clicks, impressions and average position per §4.3 cluster · GBP calls, website clicks and direction requests · GA4 events (§7.1) by landing page · GHL leads by `page_url` / `landing_page` and `utm_*`. Report on days 30, 60 and 90 in one short table.

---

## 8. `content/seo.ts`

```ts
// content/seo.ts — page metadata + breadcrumbs (SEO_PLAN.md §1, §3.8).
// Source of truth for generateMetadata(), sitemap.ts, BreadcrumbList and the HTML /sitemap.
// RULES
// - Titles ≤ 60, descriptions 120–155, OG titles ≤ 65 characters. Counted 2026-10-19.
// - No computed years and no [[TO CONFIRM tokens. Paths have no trailing slash.
// - og:description = description. og:image = the route's opengraph-image (§2.5).
// - `index` rules resolve at build: town pages from areas.ts, /reviews from reviews.json,
//   /resources from published posts. Non-production environments are noindex regardless.

export type IndexRule =
  | "index"
  | "noindex"
  | "town-confirmed"
  | "reviews-3-real"
  | "resources-3-posts";

export interface Crumb {
  name: string;
  path: string;
}

export interface PageSeo {
  path: string;
  title: string;
  description: string;
  ogTitle: string;
  index: IndexRule;
  /** Trail after "Home". Last crumb = this page. [] = no breadcrumb. */
  breadcrumb: Crumb[];
  primaryKeyword: string | null;
  secondaryKeywords: string[];
  /** Date the page's content last changed (YYYY-MM-DD). null = launch date. */
  updated: string | null;
}

const home: Crumb[] = [];
const care: Crumb = { name: "Care", path: "/care" };
const areas: Crumb = { name: "Areas we serve", path: "/areas-we-serve" };
const about: Crumb = { name: "About", path: "/about" };

const service = (
  slug: string,
  name: string,
  title: string,
  description: string,
  ogTitle: string,
  primaryKeyword: string,
  secondaryKeywords: string[],
): PageSeo => ({
  path: `/care/${slug}`,
  title,
  description,
  ogTitle,
  index: "index",
  breadcrumb: [care, { name, path: `/care/${slug}` }],
  primaryKeyword,
  secondaryKeywords,
  updated: null,
});

const town = (
  slug: string,
  name: string,
  title: string,
  description: string,
  ogTitle: string,
  primaryKeyword: string,
  secondaryKeywords: string[],
): PageSeo => ({
  path: `/areas-we-serve/${slug}`,
  title,
  description,
  ogTitle,
  index: "town-confirmed",
  breadcrumb: [areas, { name, path: `/areas-we-serve/${slug}` }],
  primaryKeyword,
  secondaryKeywords,
  updated: null,
});

const simple = (
  path: string,
  crumbName: string | null,
  title: string,
  description: string,
  ogTitle: string,
  index: IndexRule,
  primaryKeyword: string | null,
  secondaryKeywords: string[] = [],
  parent: Crumb | null = null,
): PageSeo => ({
  path,
  title,
  description,
  ogTitle,
  index,
  breadcrumb: crumbName
    ? [...(parent ? [parent] : []), { name: crumbName, path }]
    : home,
  primaryKeyword,
  secondaryKeywords,
  updated: null,
});

export const pages: PageSeo[] = [
  simple(
    "/",
    null,
    "In-Home Care in Beaufort, SC | Dawson & Dawson Home Care",
    "Owner-run, non-medical home care in Beaufort, SC since 2002. Personal care, home help, companionship, respite and 24-hour care. Free in-home assessment.",
    "Care that feels like family, from an owner who meets yours",
    "index",
    "home care Beaufort SC",
    ["in-home care Beaufort SC", "home care agency Beaufort", "senior home care Lowcountry", "non-medical home care", "caregivers Beaufort SC"],
  ),
  simple(
    "/care",
    "Care",
    "Home Care Services in Beaufort, SC | Dawson & Dawson",
    "Non-medical home care in Beaufort, SC: personal care, home help, companionship, respite and 24-hour care. Owner-run since 2002. Free home visit.",
    "Home care built around your family: five ways we help",
    "index",
    "home care services Beaufort SC",
    ["types of home care", "in-home senior care services", "non-medical home care services"],
  ),
  service(
    "personal-care",
    "Personal Care",
    "Personal Care at Home in Beaufort, SC | Dawson & Dawson",
    "Gentle, non-medical help with bathing, dressing, the bathroom and moving safely at home. Owner-run in Beaufort, SC since 2002. Free home visit.",
    "Personal care at home, done with dignity",
    "personal care at home Beaufort SC",
    ["help bathing elderly parent", "bathing and dressing help for seniors", "personal care for seniors", "ADL care"],
  ),
  service(
    "home-help",
    "Home Help",
    "Home Help & Homemaker Care in Beaufort, SC | Dawson & Dawson",
    "Meals, laundry, light housekeeping, errands and medication reminders at home in Beaufort, SC. Owner-run since 2002. Book a free home visit.",
    "Home help that keeps the house running",
    "homemaker services Beaufort SC",
    ["help at home for elderly", "meal preparation for seniors", "light housekeeping for seniors", "medication reminders"],
  ),
  service(
    "companionship",
    "Companionship",
    "Companion Care for Seniors in Beaufort, SC | Dawson & Dawson",
    "Friendly company, conversation, walks, games and outings for older adults at home in Beaufort, SC. Owner-run since 2002. Free home visit.",
    "Companionship that brightens the week",
    "companion care Beaufort SC",
    ["companionship for seniors", "elderly companion services", "sitter for elderly", "senior loneliness help"],
  ),
  service(
    "respite-care",
    "Respite Care",
    "Respite Care in Beaufort, SC | Dawson & Dawson",
    "Respite care in Beaufort, SC: a real break for family caregivers. We step in for a few hours, a weekend or longer, and your loved one keeps their routine.",
    "Respite care that gives you a real break",
    "respite care Beaufort SC",
    ["in-home respite care", "respite for family caregivers", "caregiver break"],
  ),
  service(
    "24-hour-care",
    "24-Hour & Overnight Care",
    "24-Hour & Overnight Care in Beaufort, SC | Dawson & Dawson",
    "Non-medical care day and night at home in Beaufort, SC. Overnight help, safe bathroom trips and support after a hospital stay. Owner-run since 2002.",
    "24-hour care, so someone's always there",
    "24-hour home care Beaufort SC",
    ["overnight care for elderly", "overnight caregiver", "round-the-clock care at home", "night sitter for elderly"],
  ),
  simple(
    "/find-care",
    "Find the Right Care",
    "Find the Right Home Care: 1-Minute Quiz | Dawson & Dawson",
    "Not sure what kind of home care you need? Answer five quick questions and get a suggested plan for your family. No email needed.",
    "Not sure what care Mom or Dad needs? Take the 1-minute quiz",
    "index",
    "what kind of home care do I need",
    ["home care quiz", "choosing home care for a parent"],
  ),
  simple(
    "/how-it-works",
    "How It Works",
    "How Home Care Works | Dawson & Dawson, Beaufort SC",
    "Getting started with home care in Beaufort, SC: one call, a free home visit from our owner, a care plan built with you, and regular check-ins.",
    "From first call to first visit: how home care starts",
    "index",
    "how does home care work",
    ["starting home care for a parent", "in-home care assessment", "what to expect from home care"],
  ),
  simple(
    "/paying-for-care",
    "Paying for Care",
    "Home Care Costs & Ways to Pay, Beaufort SC | Dawson & Dawson",
    "Estimate the cost of home care and see how families pay: private pay, long-term care insurance, VA benefits, Medicaid waivers — and what Medicare covers.",
    "What home care costs, and how families pay for it",
    "index",
    "home care cost Beaufort SC",
    ["how to pay for home care in SC", "does Medicare pay for home care", "VA Aid and Attendance home care", "SC Community Choices waiver", "long-term care insurance home care"],
  ),
  simple(
    "/areas-we-serve",
    "Areas we serve",
    "Home Care Across the Lowcountry | Dawson & Dawson",
    "Non-medical home care from our office in Beaufort, SC, across the Lowcountry. Find your town, see drive times and book a free in-home assessment.",
    "Home care across the Lowcountry, from our office in Beaufort",
    "index",
    "home care Lowcountry SC",
    ["home care Beaufort County", "in-home care near Beaufort"],
  ),
  town(
    "beaufort",
    "Beaufort",
    "Senior Home Care in Beaufort, SC | Dawson & Dawson",
    "Home care from our Beaufort office: bathing, meals, companionship, respite and 24-hour care. Owner-run since 2002. Free in-home assessment.",
    "Senior home care in Beaufort, from right down the road",
    "senior care Beaufort SC",
    ["elderly care Beaufort SC", "in-home senior care Beaufort historic district", "home care 29902", "home care 29906"],
  ),
  town(
    "port-royal",
    "Port Royal",
    "In-Home Care in Port Royal, SC | Dawson & Dawson",
    "Help at home in Port Royal: bathing, meals, walks, respite and overnight care. Local and owner-run since 2002. Free in-home assessment.",
    "In-home care in Port Royal: small town, close by",
    "home care Port Royal SC",
    ["senior care Port Royal SC", "elderly care Port Royal", "veteran home care Port Royal"],
  ),
  town(
    "ladys-island",
    "Lady's Island",
    "In-Home Care on Lady's Island, SC | Dawson & Dawson",
    "Home care on Lady's Island, just over the bridge from Beaufort: personal care, home help, companionship, respite and overnight care. Free assessment.",
    "In-home care on Lady's Island: island life, close to town",
    "home care Lady's Island SC",
    ["senior care Lady's Island", "in-home care Ladys Island"],
  ),
  town(
    "st-helena-island",
    "St. Helena Island",
    "In-Home Care on St. Helena Island, SC | Dawson & Dawson",
    "Non-medical home care on St. Helena Island: respite for family caregivers, personal care, home help and overnight care. Free visit at home.",
    "In-home care on St. Helena Island, on your family's terms",
    "home care St. Helena Island SC",
    ["senior care St. Helena Island", "respite care St. Helena", "elder care Frogmore"],
  ),
  town(
    "burton",
    "Burton",
    "In-Home Care in Burton, SC | Dawson & Dawson",
    "Our office is on Robert Smalls Parkway, minutes from Burton. Personal care, home help, respite and overnight care. Owner-run since 2002.",
    "In-home care in Burton: close enough to be neighbors",
    "home care Burton SC",
    ["senior care Burton SC", "home care near Laurel Bay"],
  ),
  town(
    "okatie",
    "Okatie",
    "In-Home Care in Okatie & Sun City, SC | Dawson & Dawson",
    "Home care in Okatie and Sun City Hilton Head: respite for caregiving spouses, personal care, home help and overnight care. Free in-home assessment.",
    "In-home care in Okatie and Sun City: independence is the point",
    "home care Okatie SC",
    ["home care Sun City Hilton Head", "respite care Sun City", "senior care Okatie"],
  ),
  town(
    "bluffton",
    "Bluffton",
    "In-Home Care in Bluffton, SC | Dawson & Dawson",
    "Home care in Bluffton for parents who retired here and families who live far away. Personal care, companionship, respite and 24-hour care.",
    "In-home care in Bluffton: new to town, not on your own",
    "home care Bluffton SC",
    ["senior care Bluffton SC", "in-home care Bluffton", "elderly care Bluffton"],
  ),
  town(
    "hilton-head-island",
    "Hilton Head Island",
    "In-Home Care on Hilton Head Island, SC | Dawson & Dawson",
    "Non-medical home care on Hilton Head Island, including gated communities and part-year residents. Owner-run since 2002. Call to check scheduling.",
    "In-home care on Hilton Head Island, with help close at hand",
    "home care Hilton Head Island",
    ["senior care Hilton Head", "in-home care Sea Pines", "home care for part-time residents Hilton Head"],
  ),
  simple(
    "/about",
    "About",
    "About Dawson & Dawson Home Care | Beaufort, SC Since 2002",
    "Dawson and Dawson Home Care has cared for Lowcountry families since 2002. Owner-run, licensed and insured, with an office in Beaufort, SC.",
    "Here since 2002. Still personal.",
    "index",
    "Dawson and Dawson Home Care",
    ["locally owned home care Beaufort", "owner-run home care agency", "home care since 2002"],
  ),
  simple(
    "/reviews",
    "Reviews",
    "Reviews | Dawson & Dawson Home Care, Beaufort SC",
    "Read what Lowcountry families say about Dawson and Dawson Home Care — owner-run, non-medical home care in Beaufort, SC since 2002.",
    "In their words: families on Dawson & Dawson Home Care",
    "reviews-3-real",
    "Dawson and Dawson Home Care reviews",
    ["home care reviews Beaufort SC"],
    about,
  ),
  simple(
    "/careers",
    "Careers",
    "Caregiver Jobs in Beaufort, SC | Dawson & Dawson Home Care",
    "Join an owner-run home care team in Beaufort, SC, caring for Lowcountry families since 2002. See open caregiver roles and apply online.",
    "Caregiver jobs in Beaufort: do work that matters, close to home",
    "index",
    "caregiver jobs Beaufort SC",
    ["in-home caregiver jobs", "home care jobs Lowcountry"], // add "CNA jobs Beaufort SC" only once the CNA role is confirmed
    about,
  ),
  simple(
    "/for-professionals",
    "For Professionals",
    "Refer a Client for Home Care | Dawson & Dawson, Beaufort SC",
    "For discharge planners, case managers and care teams: refer a client for non-medical home care in Beaufort, SC in about 2 minutes, or fax (866) 502-3509.",
    "Refer a client for home care in about 2 minutes",
    "index",
    "home care referral Beaufort SC",
    ["discharge planning home care", "non-medical home care referral"],
  ),
  simple(
    "/faq",
    "FAQ",
    "Home Care Questions & Answers | Dawson & Dawson, Beaufort SC",
    "Plain answers about non-medical home care in Beaufort, SC: getting started, services, cost and payment, caregivers, safety and medical questions.",
    "Home care questions, answered plainly",
    "index",
    "home care questions",
    ["home care vs home health", "is home care covered by Medicare"],
  ),
  simple(
    "/resources",
    "Resources",
    "Home Care Guides for Lowcountry Families | Dawson & Dawson",
    "Plain-language guides for families caring for an older parent in Beaufort and the Lowcountry: getting started, paying for care and caregiver support.",
    "Guides for Lowcountry families caring for someone they love",
    "resources-3-posts",
    "caregiving guides Beaufort SC",
    ["aging parent help Lowcountry", "caring for elderly parent tips"],
  ),
  simple(
    "/free-assessment",
    "Free Assessment",
    "Free In-Home Care Assessment | Dawson & Dawson, Beaufort SC",
    "Request a free, no-obligation home visit from our owner. Tell us a little about your family in 2 minutes and we'll call you to set it up.",
    "A free visit at home, with our owner",
    "index",
    "free in-home care assessment Beaufort",
    ["home care consultation", "free home visit home care"],
  ),
  simple(
    "/contact",
    "Contact",
    "Contact Dawson & Dawson Home Care | Beaufort, SC",
    "Call (843) 379-3321, text (866) 632-9766 or visit us at 69 Robert Smalls Parkway, Beaufort, SC. Care 24/7. Office Monday–Friday, 8 AM–5 PM.",
    "Contact Dawson & Dawson Home Care in Beaufort",
    "index",
    "Dawson and Dawson Home Care phone",
    ["home care Robert Smalls Parkway", "home care agency Beaufort contact"],
  ),
  simple(
    "/privacy-policy",
    "Privacy Policy",
    "Privacy Policy | Dawson & Dawson Home Care",
    "How Dawson and Dawson Home Care LLC collects, uses and protects your information, including text messages. Plain language, no fine print.",
    "Privacy Policy: Dawson & Dawson Home Care",
    "index",
    null,
  ),
  simple(
    "/sms-terms",
    "SMS Terms",
    "SMS Terms | Dawson & Dawson Home Care",
    "How texts from Dawson and Dawson Home Care LLC work: what we send, how often, what it costs, and how to get help or stop. Reply STOP any time.",
    "SMS Terms: Dawson & Dawson Home Care",
    "index",
    null,
  ),
  simple(
    "/accessibility",
    "Accessibility",
    "Accessibility | Dawson & Dawson Home Care",
    "Our commitment to a website everyone can use: Comfort Controls, full keyboard access and captions — and how to tell us if something gets in your way.",
    "Accessibility at Dawson & Dawson Home Care",
    "index",
    null,
  ),
  simple(
    "/sitemap",
    "Site Map",
    "Site Map | Dawson & Dawson Home Care",
    "Every page on dawsonhomecare.com in one list: care services, areas we serve, paying for care, help for families, and how to reach us.",
    "Site map: Dawson & Dawson Home Care",
    "index",
    null,
  ),
  {
    path: "/thank-you",
    title: "Thank You | Dawson & Dawson Home Care",
    description: "",
    ogTitle: "",
    index: "noindex", // rendered as noindex, nofollow
    breadcrumb: [],
    primaryKeyword: null,
    secondaryKeywords: [],
    updated: null,
  },
];

/** not-found.tsx metadata (status 404, noindex). */
export const notFoundTitle = "Page Not Found | Dawson & Dawson Home Care";

export const getPageSeo = (path: string): PageSeo | undefined =>
  pages.find((p) => p.path === path);
```

Build check (add to `npm run prelaunch`): every `title` ≤ 60, every non-empty `description` 120–155, every `ogTitle` ≤ 65, no duplicate titles or descriptions, no `[[` anywhere in this file.

---

## 9. Sources (search features, checked 19 Oct 2026)
- Google FAQ rich results retired May 7, 2026 — [Search Engine Journal](https://www.searchenginejournal.com/google-drops-faq-rich-results/574429/)
- Mobile results show the domain only since January 2025; desktop breadcrumbs unchanged — [Relevant Audience](https://www.relevantaudience.com/seo/breadcrumb-navigation-seo/)
- LocalBusiness structured data (required: name, address; hours format) — [Google Search Central](https://developers.google.com/search/docs/appearance/structured-data/local-business)

---

## Decisions made

**Made in this file (update the knowledge files):**
1. SEO_PLAN.md §1 replaces every COPY_* "Page meta (draft)". Six changes vs the drafts are listed under §1.1.
2. JSON-LD: plain `LocalBusiness` (no medical subtype), one site-wide node referenced by `@id`; office hours on the business, 24/7 on each `Service` (`hoursAvailable`).
3. FAQPage markup kept only where COPY files already specify it (/faq, service pages, town pages); not added anywhere else. Not counted as an SEO win.
4. Town `areaServed` uses `City` for incorporated places and `Place` for unincorporated communities → add `schemaType` to `areas.ts` (refines COPY_AREAS §1 rule 5).
5. New pages metadata: `/resources` (noindex until 3 posts) and `/sitemap`.
6. Redirect list extended: `/home` and four WordPress sitemap URLs → `/sitemap.xml`; `content/redirects.ts` replaces the table in 08 §4.
7. Indexing gate `NEXT_PUBLIC_INDEXABLE` (new env var — add to 08 §6). Non-production = noindex + `Disallow: /`.
8. Footer "Areas we serve" column (A1) and post-launch "Related guides" slots (A2/A3).
9. Query-ownership map (§4.3) governs all future posts.

**Need your call (recommendation first):**
- **D1 — Home hero eyebrow.** Add **In-home care · Beaufort, SC** above the H1 (edit COPY_HOME ch. 1). Alternative: leave the hero as approved and rely on the title and body copy.
- **D2 — /thank-you robots.** `noindex, nofollow` meta only, no robots.txt block (so Google can read the noindex) — this changes 09 §6 and COPY_CONVERSION §4. Alternative: keep both as written; harmless in practice since nothing links there.
- **D3 — WordPress endpoints.** 410 Gone via middleware. Alternative: redirect to `/` (08's other option).
- **D4 — Legacy `/wp-content/` files.** Copy only the ones still referenced (GHL emails, GBP, directories) to `/public/legacy/` and redirect; 410 the rest. Alternative: proxy `/wp-content/*` to the old host for 30 days (needs the old host on a temporary hostname).
- **D5 — `/personal-care` destination.** Keep 08's `/care/personal-care` (name match). Alternative: `/care/home-help`, which matches what the old page actually described.
