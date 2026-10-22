# BUILD_DECISIONS — Dawson & Dawson Home Care website

**Status:** Phase 1 (read-only review). No code written yet. Waiting on the answers to §F before building.
**Date:** 22 Oct 2026
**Read for this file:** every file in `/docs` (02–11, BRAND_FINAL, COPY_HOME, COPY_SERVICES, COPY_TRUST, COPY_COST_FAQ, COPY_AREAS, COPY_CONVERSION, COPY_LEGAL, SPEC_FEATURES, SEO_PLAN, brand-palette-preview.html, both PNGs) and all 6 design HTML files in `/docs/design` with their CSS and JS (plus the `dc-lite.js` prototype engine, which isn't part of the build).

**Priority rule applied throughout:** design (visuals) > BRAND_FINAL.md > COPY_* / SPEC_FEATURES / SEO_PLAN > 02–11.
**How I read that rule:** the design decides how things *look and move*. The docs decide *what is said*, *what is true* and *how things work* (logic, data, forms, GHL, SEO, legal). If the design shows a fact the docs don't confirm, the fact rule wins and it stays a `[[TO CONFIRM]]` placeholder.

---

## A. What we're building (one paragraph)

A new Next.js website for Dawson and Dawson Home Care LLC, a non-medical, owner-run home care agency at 69 Robert Smalls Parkway in Beaufort, SC, caring for Lowcountry families since 2002. It's a surprise rebuild that stays private (preview only, nothing goes live). The site has to feel premium and calm, be easy for worried adult children and seniors to use on a phone (big text, high contrast, WCAG 2.2 AA, a reduced-motion version of every animation), and turn visits into calls and free-assessment requests. It's built from the approved design (Anton + Poppins, the 16 locked colors, the scroll-driven Home story with the intro logo video, the video collages, the glowing How-It-Works line, the cursor ring) and fills in the approved copy word for word: Home, 5 service pages and a hub, a 5-question care quiz, a cost estimator (hours-only until real rates exist), a payment explorer, areas-we-serve plus 8 town pages, About/owner/caregivers/reviews, a professionals referral portal, careers (Hireology), FAQ with live search, a 5-step free-assessment form, contact, thank-you, 404 and the three legal pages. Every form posts to our own `/api/lead` or `/api/referral`, which runs in mock mode (saves JSON files locally) until GoHighLevel keys are added. Every unknown fact (owner name, license number, rates, towns, drive times, response times, reviews…) stays a visible `[[TO CONFIRM]]` placeholder that `npm run prelaunch` lists. From Phase 2 the repo gets a `.devcontainer` so your GitHub Codespace installs everything, starts the site on port 3000 and opens the preview by itself.

---

## B. Design screens → which pages they set the style for

The design folder has **6 HTML screens**. One of them (`01-interaction-states`) is a states sheet rather than a page.

| # | Design file | What it shows | Pages it sets the style for |
|---|---|---|---|
| 1 | `01-home-desktop.html` (+ `css/01-home-desktop.css`, `js/01-home-desktop.js`) | Full Home at desktop: intro logo video → logo flies into header, hero, "The moment" typing scene, "How we help" video collages, inline quiz, How it works with glowing heartbeat and 3D icons, Since 2002, Meet the owner, caregiver flip carousel, reviews marquee, cost estimator, Google map + town search, pros band, FAQ accordion, Dusk final CTA, footer, cursor ring | **Home (desktop)**, plus the global system for every page: desktop header, footer, section rhythm (eyebrow → Anton H2 → lead), buttons, links, cards, accordion, dark plum bands, Dusk CTA band, estimator, quiz cards, cursor ring, focus rings |
| 2 | `01-interaction-states.html` | Office-status chip (open/closed × light/dark + the neutral "before we know the time" state), buttons in default/hover/focus (incl. cream-on-Dusk), all cursor-ring states, owner-video "coming soon" card, town-search "match" result | **Global components on every page** (chip, buttons, cursor, coming-soon video, town search result) |
| 3 | `02-home-mobile.html` (+ css/js) | Full Home at 390px: same chapters adapted, phone header (logo + call circle + menu), full-screen menu, sticky bottom action bar | **Home (mobile)** and the mobile pattern for every page: phone header, menu, sticky Call/Text/Free Assessment bar, full-width stacked buttons, mobile type sizes |
| 4 | `03-personal-care-desktop.html` (+ css/js) | Personal Care service page: breadcrumb, hero with video collage, "This helps if…" tick list with result bar, "What we help with" 3D icon grid, "A day with Dawson" timeline with sun/moon sky card, dark "Safe and dignified" band, "Pairs well with" photo cards + cost card with week bars, FAQ, single review, Dusk CTA | **All 5 service pages** (Personal Care, Home Help, Companionship, Respite, 24-Hour) and the inner-page section kit reused on other pages (breadcrumbs, check-lists, icon grids, time-line, dark numbered band, related cards, FAQ, review block) |
| 5 | `04-free-assessment-desktop.html` (+ css/js) | Free-assessment page: hero, prefill/resume banners, 5-step form with progress, error summary and field errors, review step with "Change" links, SMS consents, sending state, success state, sticky "What happens next" side panel, "Prefer to talk it through?" band | **/free-assessment**, and the form system for **/for-professionals** (referral form), **/contact** (message form), **/find-care** (quiz page) and the quiz "Email me this plan" block; the success state is the visual source for **/thank-you** |
| 6 | `04-free-assessment-mobile.html` (+ css/js) | Same form at 390px, compact strip above the form, 2-button action bar (Call + Text) | Mobile layout of all forms |

**No mobile design exists for the service page**, so the service-page template gets its phone layout from the Home-mobile patterns.

---

## C. Asset table

All files are in `/docs/design`. They're placeholders until real photos/videos arrive. **Filenames stay exactly as they are** so real files can be dropped in later without code changes. Sizes are file sizes on disk.

### C1. Images (`/docs/design/images`, 22 files, 2.9 MB)

| File | Pixels | Size | Where it's used |
|---|---|---|---|
| `intro-end-frame.jpg` | 1920×1080 | 102 KB | Home intro: poster of the intro video, and the still frame shown in reduced motion. It's the last frame of the video (the old-color logo) |
| `logo.png` | 1837×1002 (transparent) | 574 KB | In the design: header, footer, the logo that flies from the intro into the header, and inside the owner/caregiver placeholders. **In the build it's replaced by the new SVG logo** everywhere except the intro flight (see §D, row 8) |
| `hero-caregivers.jpg` | 2000×1116 | 204 KB | Home hero photo (desktop + mobile) — "two caregivers in lavender uniforms" |
| `moment-1.jpg` … `moment-4.jpg` | 1200×1200 each | 184–237 KB | Home "01 — The moment": one photo per worry line (desktop pinned scene, mobile scene, reduced-motion grid) |
| `owner-visit.jpg` | 1200×1124 | 158 KB | Home "How it works" step 2 card (the owner visit). Docs call this slot `owner-with-client.jpg`; I keep the design filename |
| `poster-personal-care-1/2/3.jpg` | 540×960 | 55–64 KB | Posters for the Personal Care videos: Home "How we help" collage 1, Personal Care hero collage, reduced-motion stills |
| `poster-home-help-1/2/3.jpg` | 540×960 | 57–67 KB | Home collage 2; `-1` also on the Personal Care "Pairs well with" card |
| `poster-companionship-1/2/3.jpg` | 540×960 | 53–84 KB | Home collage 3 |
| `poster-24-hour-care-1/2.jpg` | 540×960 | 50–63 KB | Home collage 4; `-1` also on the Personal Care "Pairs well with" card |
| `poster-respite-care-1/2.jpg` | 540×960 | 62–68 KB | Home collage 5 |
| `google-map.jpg` | 1600×973 | 235 KB | Home "10 — Where we care": a Google Maps screenshot of the office area, linked to Google Maps (see conflict D-17 and question 5) |

Also in `/docs` (reference only, not shipped): `current-logo.png` (2000×2000, 1.5 MB — the client's current logo, the tracing source for the SVG), `palette-preview.png` (2390×5882, 2.9 MB) and `brand-palette-preview.html` (old palette preview using the retired fonts).

### C2. Videos (`/docs/design/videos`, 14 files, 7.0 MB — all silent, no audio track)

| File | Format | Size | Where it's used |
|---|---|---|---|
| `intro-animation.mp4` | 1920×1080, 30 fps, 8.1 s | 558 KB | Home intro (logo animation). Plays once, then the logo flies into the header |
| `personal-care-1/2/3.mp4` | 540×960 portrait, 24 fps, 8 s loop | 465–611 KB | Home "How we help" collage 1 + Personal Care page hero collage |
| `home-help-1/2/3.mp4` | 540×960, 8 s loop | 384–613 KB | Home collage 2 (and future Home Help hero) |
| `companionship-1/2/3.mp4` | 540×960, 8 s loop | 267–994 KB | Home collage 3 (and future Companionship hero) |
| `24-hour-care-1/2.mp4` | 540×960, 8 s loop | 417–543 KB | Home collage 4 (and future 24-Hour hero) |
| `respite-care-1/2.mp4` | 540×960, 8 s loop | 430–511 KB | Home collage 5 (and future Respite hero) |

Collage videos only play while their collage is on screen, muted, looped, `playsinline`; in reduced motion the posters show instead. They're decorative (`aria-hidden`), so they don't need captions. The owner video and testimonial videos from doc 11 don't exist yet; their slots show the designed "Video coming soon" card.

### C3. Fonts (`/docs/design/fonts`, 192 KB, SIL Open Font License — licence files included)

| File(s) | Size | Where it's used |
|---|---|---|
| `anton-latin-400-normal.woff2` + `anton-latin-ext-400-normal.woff2` | 18 KB + 31 KB | **Anton** — every display heading: H1, H2, H3, big numbers, FAQ questions, quiz/step headings, mobile menu links |
| `poppins-latin(-ext)-400-normal` | 8 + 6 KB | **Poppins** body text, 18px |
| `poppins-latin(-ext)-500-normal` | 8 + 5 KB | Nav links, trust row, inactive "moment" lines |
| `poppins-latin(-ext)-600-normal` | 8 + 5 KB | Buttons (17px), labels, eyebrows, links |
| `poppins-latin(-ext)-700-normal` | 8 + 5 KB | Badges, strong values |
| `poppins-latin(-ext)-400-italic`, `-500-italic` | 8 + 6 KB, 8 + 6 KB | Quotes (owner quote, caregiver card backs, service-page review) |
| `poppins-latin(-ext)-300-normal` | 8 + 5 KB | Only used by the Home "It usually starts with" line. **Not shipped** if we drop weight 300 (your rule; see question 7) |

Fonts are self-hosted with `next/font/local` (no Google request), `display: swap`, latin preloaded and latin-ext loaded only when needed.

### C4. Assets we create (no client input needed)

SVG logo set per BRAND_FINAL §3 (horizontal, stacked, mark, reversed, mono; Option A live, Option B behind `NEXT_PUBLIC_LOGO_FIGURE`), favicon/app icons, the line icons and 3D-style step icons already drawn in the design's inline SVGs, quiz answer icons, OG image template (Anton + Poppins), the heartbeat dividers, and `.vtt`/transcript slots for future videos.

---

## D. Every conflict between the design and /docs — and what I'll follow

"Design" = follow the design. "Docs" = follow the named doc. "You" = your Phase-1 instructions. Rows marked **(Q n)** depend on your answer to question n in §F; the default shown is what I'll do if you say "go with your defaults".

### D1. Brand, type and color

| # | Conflict | Design says | Docs say | I'll follow |
|---|---|---|---|---|
| 1 | Fonts | Anton (display) + Poppins (body) | Fraunces + Plus Jakarta Sans (03, BRAND_FINAL, SPEC, SEO OG image) | **Design / you** — Anton + Poppins everywhere, including the OG image template and the logo wordmark tracing notes |
| 2 | Italic accent words (*family*, *dignity*, *owner*…) | Accent word set in **color** (orchid-500 on light, orchid-100 on Dusk/dark), not italic — Anton has no italic | Italic, and "italic cream" on Dusk | **Design** — color accent, no italic. Orchid-500 is only allowed at ≥40px, and every H1/H2 accent is ≥40px, so it passes BRAND_FINAL rule 4 |
| 3 | Type scale | Fixed sizes per screen: H1 72/96px desktop, 48px mobile; H2 52px; H3 28px; lead 22px; eyebrow 14px **600, tracking 0.14em** | Fluid clamp scale (Fraunces sizes), eyebrow 700 / 0.12em | **Design** sizes and eyebrow style. I'll make them fluid between the mobile and desktop design values so in-between widths don't jump |
| 4 | Body text under 18px | Mobile Home uses 17px for card text, step text, review text; form step names are 13px (mobile) / 15px (desktop) | BRAND_FINAL: 18px body, 16px minimum, 14px only for eyebrows + cursor label | **You + BRAND_FINAL** — running text goes up to 18px; step names go up to 16px. Buttons stay at the designed 17px semibold (that's the BRAND_FINAL button spec, not body text) |
| 5 | Poppins weight 300 | Home "It usually starts with" line is Poppins 300 (64px desktop / 32px mobile) | — | **You** — never 300. I'll use 400, the closest look (Q7) |
| 6 | Small text at 16px | Helpers, captions, labels, footer lines are 16px | BRAND_FINAL allows 16px for captions/helpers/legal | **Design + BRAND_FINAL** — I'm reading your "body text never below 18px" as running paragraph text, so 16px stays for helpers/captions/labels (Q7) |
| 7 | Shadows and glows | Uses soft shadows and glows made from the locked colors at partial opacity (card shadows, video shadows, orchid glows on the How-It-Works line and nodes, lime glow on the timeline end) | BRAND_FINAL rule 8 allows alpha only for cursor fills, room glow and button hover; SPEC puts "soft shadow" on hold | **Design** — every shadow/glow is kept. They're all alpha versions of the 16 locked colors, so no new hex values. (Color check: the design uses exactly the 16 BRAND_FINAL tokens, nothing else) |

### D2. Logo, intro and header/footer

| # | Conflict | Design says | Docs say | I'll follow |
|---|---|---|---|---|
| 8 | Header/footer logo | Raster `logo.png` (old colors); footer logo sits on a cream rounded pad | BRAND_FINAL §3: rebuilt SVG, new colors, 5 versions; footer = stacked **reversed** on plum-950 | **You + BRAND_FINAL** — SVG everywhere; footer uses the stacked reversed SVG directly on plum-950 (no cream pad). Option A live, Option B behind `NEXT_PUBLIC_LOGO_FIGURE` with the `/reveal-notes` A/B toggle |
| 9 | Logo wordmark | The client's real logo (`current-logo.png`) says **"DAWSON AND DAWSON"** in uppercase serif with "HOME CARE LLC" below, has **two caring hands** under the roof, a dark-gray inner roof and a four-pane window | BRAND_FINAL §3 describes "Dawson & Dawson" in Fraunces with an ampersand, and doesn't mention the hands; its own rule says "the PNG's geometry wins" | **BRAND_FINAL's fidelity rule** — trace the PNG: uppercase serif wordmark, "AND", the hands, the window, "HOME CARE" + small "LLC", then recolor per BRAND_FINAL (no gray — inner roof becomes plum). The Fraunces/ampersand note is dropped because Fraunces is retired (Q8) |
| 10 | First-visit logo intro | Home has its own intro: the logo **video** plays full screen, scrolling is locked until it ends (≤14 s, scrolling fast-forwards it 8×), then the logo **flies** into the header | BRAND_FINAL §3.3A: 1.4 s SVG draw-in in the header, once per session, never blocks anything | **Design on Home** (video + flight, exactly as designed). The flight uses the raster end-frame logo and cross-fades into the SVG header logo as it lands, so it matches the video's last frame. **BRAND_FINAL draw-in** only plays when the first page someone lands on isn't Home. I'll add a keyboard way to skip (Esc/Space/Enter/arrows + a visually hidden "Skip intro" button) because the design only skips on wheel/touch (Q9) |
| 11 | Desktop header contents | Logo · 5 links (Care services, How it works, Paying for care, Areas we serve, Our story) · **Call** button. No dropdowns, no office chip, no Free Assessment button, no For Professionals | 06: Care ▾ mega-menu (5 services + quiz) · How It Works · Paying for Care · Areas · About ▾ (About, Reviews, Careers) · For Professionals · office chip · Call · Free Assessment | **Design** layout and look (Q6). The office chip already sits in the Home hero and footer in the design |
| 12 | Header logo size + compact-on-scroll | 169px-wide logo, 112px-tall header; no compact animation shown; on Home the header fades in after the intro | BRAND_FINAL: 44px-tall logo that clip-morphs to the mark on scroll | **Design** sizes. I'll add BRAND_FINAL's scroll-compact morph (logo → mark) since the design has no conflicting behavior and it's specified animation for the logo itself |
| 13 | Mobile action bar | White bar: plum **Call**, outlined **Text**, leaf **Free Assessment** (moon icon + "Callback" after hours); 2 buttons on the assessment page | SPEC §14: plum-950 bar, cream labels | **Design** look; docs behavior (hides when a form is on screen or the keyboard is open, safe-area inset, slot 3 removed on /free-assessment and /thank-you) |
| 14 | Footer contents | 4 columns: logo + office status + Care 24/7 · Contact us · Care services · "Find the right care" links; bottom row: ©, Privacy, SMS Terms, Instagram | 06 + COPY_LEGAL + SEO_PLAN: also **Accessibility**, **Sitemap**, Directions, and a data-driven **Areas we serve** column | **Design** layout, plus the missing links added in the same style (legal/compliance requirement): Accessibility and Sitemap in the bottom row, Directions in Contact, an Areas column |

### D3. Home page

| # | Conflict | Design says | Docs say | I'll follow |
|---|---|---|---|---|
| 15 | Hero visual | One photo (`hero-caregivers.jpg`), buttons centered under the two-column hero, trust row with icons | 3-photo collage (`hero-1/2/3.jpg`) with parallax, Dusk glow blob | **Design** visual. Trust-row text: approved copy ("Since 2002 · Owner-run · Care 24/7") with the approved screen-reader sentence (Docs, content). Image alt: describes what the placeholder actually shows (COPY rule: alt must match the photo) |
| 16 | "The moment" scene | **4** worry lines with **photos** (`moment-1..4`), typed out letter by letter with a blinking caret, "1 of 4", headline revealed word by word; pinned on desktop **and** mobile, for ~6.4 screen-heights | **5** lines (adds "And you haven't had a real day off in months."), line **illustrations** that draw in, "1 of 5", pin ≤150vh, no pin on mobile | **Design** animation, photos and pin lengths. Line count = Q3 (default: keep the design's 4) |
| 17 | "How we help" (Dawson House) | The illustrated house is **gone**: five portrait **video collages** slide in from the right while a card shows each service | 06/07/SPEC/COPY: illustrated Lowcountry house, rooms light up, rooms are links, mobile room carousel | **Design** (Q4). The service order, names, promises, small labels and links stay from COPY_HOME |
| 18 | "How we help" subline | "Keep scrolling to see each way we help." | "Scroll through the house. Each room is one way we help." / "Tap a room to see how we help." | **Design** wording, because the copy describes a house that the design removed (part of Q4) |
| 19 | Quiz on Home | The **whole 5-question quiz** runs inline on Home, with the result shown right there | Home shows **question 1 only**; answering opens `/find-care` at question 2 | **Q2** (default: design — full quiz inline on Home, and the same quiz component on `/find-care`). Result content follows COPY_CONVERSION §9, so I add the two pieces the design result lacks: the mini cost estimator and "Email me this plan" |
| 20 | Quiz answer types | Q2 (multi-select) uses toggle buttons | SPEC: native checkboxes for Q2 | **Design** look, **docs** semantics (real checkboxes under the designed cards) |
| 21 | How it works | Sticky left column + single column of steps; 3D-style icons; glowing orchid line with a heartbeat pulse that travels down; step 2 is a dark plum card with a lime "The Dawson difference" badge | Alternating left/right steps on an SVG heartbeat path; step 2 is an orchid-100 card with a plum badge | **Design** |
| 22 | Since 2002 | Big static number; no count-up | Count-up animation 0 → {years} | **Design** (no count-up). The number is computed from 2002, never hard-coded |
| 23 | "Licensed & insured" | Inline toggle panel, open by default, shows the license placeholder | Link to `/about#licensed` | **Design** behavior on Home; the About page keeps the full panel |
| 24 | Owner video | Shows a big play circle and "Watch a short hello" even though no video exists; the states sheet shows a "Video coming soon" card | 07/SPEC: coming-soon state, no dead play button | **Design's coming-soon card** (from the states sheet) until the video exists, then the designed play button |
| 25 | Caregiver cards | Flip on mouse hover (desktop); tap button on mobile; one row, 3 steps of sliding | Flip on click/Enter via the "Why I do this" button, focus moves between faces | **Design** look and hover flip, plus the docs' button/keyboard/focus behavior, and quotes shown under the photo in reduced motion |
| 26 | Reviews marquee | One row, 90 s per loop, 10 cards duplicated | Two rows moving in opposite directions at 30 px/s | **Design** |
| 27 | Reviews content | **10 real-looking Google reviews with full names** (e.g. "Linda Pienik", "Penny Barrett"); they name "Monique", "Monique Dawson", "Jay", "Yulaunda", "Molly"; one calls the agency "Home Health Care" and one mentions medications | Placeholders only (`placeholder: true`), first name + last initial only, hide the chapter if fewer than 3 real reviews, never invent | **Docs** for now (Q1). If you confirm they're real Google reviews we're allowed to use, I'll load them as real reviews shown as "Linda P." etc. |
| 28 | Google rating | "4.8 on Google · 33 reviews" shown as fact, linked to Google Maps | Hidden until confirmed | **Docs** — hidden until you confirm (Q1) |
| 29 | Estimator default + prices | Starts at 4 hours × **5** days = 20; always shows the "Illustrative estimate" badge and `$[…]` price placeholders | Starts at 4 × **3** = 12; all rates `null` → hours-only mode; badge only when prices show; Fewer/More **hours** buttons beside the slider | **Docs** for the numbers and logic (12 hours; hours-only line until real rates exist; no invented price). **Design** for the look; the Fewer/More hours buttons are added in the design's round-button style |
| 30 | Where we care | **Google Maps screenshot** linked to Google, a "Dawson and Dawson Home Care — On Google Maps" card with rating, address, website, hours and a **"Women-owned"** chip, town search, town chips | Custom interactive SVG map of Beaufort County (no Google, no API), pulsing office pin, town dots with drive times, list fallback | **Q5** (default: design layout, but the screenshot is swapped for our own SVG map drawn in the same frame, since a Google screenshot can't be used without Google's terms and goes out of date). The "Women-owned" chip and rating are hidden until confirmed (Q1) |
| 31 | Google Maps link | `https://maps.app.goo.gl/HEKXeuuT747yN3y96` | `http://goo.gl/maps/SVvYGS3TipaMpbgQ9` (04, COPY_CONVERSION) | **Docs** link for now; I'll check with you which one is current (Q5) |
| 32 | Final CTA accent | "family" in orchid-100, not italic | Italic cream | **Design** (see row 2) |
| 33 | Home chapter progress line (top of screen) and Lenis smooth scrolling | Neither exists; the design runs on normal browser scrolling | 07 §18 / SPEC §0.5 / §20.3 | **Design** on Home: no progress line, normal scrolling, so the designed scroll scenes behave exactly as approved. I'll still install Lenis behind a switch (`NEXT_PUBLIC_SMOOTH_SCROLL`, default off) so you can compare |
| 34 | Pin lengths | Home scenes pin far longer than 150vh and pin on phones too | ≤150vh per pin, no pins on phones | **Design**. The docs' safety rules still apply: a skip link before every pinned scene, Space/Page Down work normally, nothing is hidden from screen readers |
| 35 | Hero headline | Owner version default; "because it's run by one" behind a switch | Same, `[[TO CONFIRM: family-run]]` | Same in both — kept as a switch, default "from an owner who meets yours" |

### D4. Service pages

| # | Conflict | Design says | Docs say | I'll follow |
|---|---|---|---|---|
| 36 | Hero visual | Video collage (`personal-care-1/2/3`) | Photo `service-personal-care.jpg` (3:2) | **Design** — each service page gets its own collage from the matching videos. The alt text in COPY becomes the collage's hidden caption, worded to match what the placeholder videos show |
| 37 | Hero second button | Ghost "Call" | "Secondary" (plum) "Call" | **Design** |
| 38 | Review block | A real-looking Google review (Penny Barrett, mentions medications and "Monique") | One `reviews.json` item for that service with `placeholder: false`; section hidden if none | **Docs** (Q1) |
| 39 | Placeholder lines | The design shows `[To confirm]` chips inline (e.g. Hoyer lift, typical start time) | Pending lines render only when `NEXT_PUBLIC_SHOW_PLACEHOLDERS=true` | Same idea — the design's `.tbc` chip is how placeholders look when the flag is on (on by default in the preview) |

### D5. Forms, free assessment, thank-you

| # | Conflict | Design says | Docs say | I'll follow |
|---|---|---|---|---|
| 40 | After sending | Thank-you message replaces the form on the same page | Redirect to `/thank-you?form=assessment|callback` (variants decided at send time) | **Docs** — redirect. The `/thank-you` page reuses the design's success visual |
| 41 | SMS consent wording | Older template wording from 09 | COPY_LEGAL §1 final wording `sms-v1-2026-10`, helper line, links outside the label | **Docs (COPY_LEGAL)** |
| 42 | Success animation | Check mark appears | Heartbeat-to-check, 600 ms | **Design** check mark |

### D6. Things the docs want that the design doesn't show (built per docs, in the design's style)

These don't contradict the design — the design just doesn't cover them: Comfort Controls button and panel; page-transition curtain with heartbeat sweep; error summary/field states on every form (the assessment design shows the pattern); prefill/resume banners on quiz and estimator; FAQ live search; payment explorer; referral form; town pages; legal page layout; 404; `/reveal-notes`; GoHighLevel `/api/lead` + `/api/referral` (mock mode first); JSON-LD, sitemap, robots, redirects and the `NEXT_PUBLIC_INDEXABLE` gate (everything `noindex` in preview); `npm run prelaunch`.

### D7. Docs vs docs (no design involved — resolved by the priority order)

- BRAND_FINAL overrides 03 (focus ring 2px inner, 16 colors with `alert-700`, 14px eyebrow exception, footer pulse once per entry, Option A logo).
- SEO_PLAN overrides every COPY "page meta (draft)". COPY_LEGAL overrides consent wording in 09 and COPY_CONVERSION.
- SEO_PLAN's open calls D1–D5 (hero eyebrow, `/thank-you` robots, WordPress endpoints, legacy `/wp-content/` files, `/personal-care` redirect target): I'll use each recommended option unless you say otherwise (Q10).

---

## E. Pages in 06_SITEMAP_AND_PAGES.md with no design — confirmed: built in the same design language

Yes — every page below is built with the design's fonts, colors, spacing, header/footer, eyebrow → Anton H2 → lead rhythm, buttons, cards, dark bands, Dusk CTA band, cursor ring and reduced-motion rules, reusing the closest designed sections. No new visual styles, no new colors.

| Page | Built from (closest designed parts) |
|---|---|
| `/care` (hub) | Personal Care hero frame + video collage, service cards in the "Pairs well with" style, Venn visual in the 3D-icon style, quiz CTA band (Home ch. 3/4), Dusk CTA |
| `/care/home-help`, `/care/companionship`, `/care/respite-care`, `/care/24-hour-care` | Personal Care template exactly (they're the same template with their own copy and videos) |
| `/find-care` (quiz page) | Home quiz card + free-assessment page frame |
| `/how-it-works` | Home How-It-Works (heartbeat + 3D steps) at full length, checklists in the service-page tick style, accordion |
| `/paying-for-care` | Home estimator (full version) + Payment Explorer tabs in the quiz-card/ chip style, agency checklist in the tick-list style |
| `/areas-we-serve` + 8 town pages | Home "Where we care" (map, town search, chips), service-page sections (intro, cards, FAQ, nearby chips), drive card in the cost-card style |
| `/about` | Home "Meet the owner", "Since 2002", caregivers, the dark numbered band for values, licensed panel |
| `/reviews` | Home review cards in a grid with filter chips (quiz-answer chip style) |
| `/for-professionals` | Home pros band (dark) for the hero, scope table, referral form from the assessment form system |
| `/careers` | Service-page sections + Home caregiver cards |
| `/faq` | Home/service FAQ accordion + search field in the town-search style |
| `/resources` | Structure only (no copy exists yet), noindex until 3 posts |
| `/contact` | Contact cards in the "On Google Maps" card style, map, hours cards, message form from the form system |
| `/privacy-policy`, `/sms-terms`, `/accessibility` | COPY_LEGAL layout (no hero image, no CTA band) in the design's type and colors |
| `/sitemap` (HTML) | Footer link-list style |
| `/thank-you` | The design's form success state + How-It-Works timeline (static) |
| 404 | Hero frame + 4 buttons; the porch-light house illustration depends on Q4 |
| Also: `/reveal-notes` (BRAND_FINAL logo A/B), `/styleguide` (SEO_PLAN, preview only) | Plain design-system pages |

Every page has a reduced-motion version and a phone layout based on the Home-mobile patterns.

---

## F. Questions (plain language — please answer these before I start building)

1. **Real Google facts in the design.** The design shows 10 Google reviews with full names, a "4.8 stars from 33 reviews" badge, a "Women-owned" label, and reviews that name "Monique Dawson" and "Jay". None of this is in the approved docs. Are these real (copied from their Google page), and may we show them? If yes, I'll show reviewers as first name + last initial (e.g. "Linda P."), and I'll use "Monique" as the owner's first name if you confirm she's the owner. If not, I'll keep the sample placeholders.

2. **The quiz on the Home page.** The design runs the whole 5-question quiz right on the Home page. The docs say Home should only show question 1, then jump to the separate quiz page. Which do you want? *(My default: the design — whole quiz on Home, plus the separate quiz page.)*

3. **"The moment" lines.** The design has 4 worry lines (with 4 photos). The approved copy has a 5th: "And you haven't had a real day off in months." Keep 4, or add the 5th (it would need a 5th photo; I'd reuse one for now)? *(Default: keep 4.)*

4. **The illustrated "Dawson House."** The design replaced the drawn house (rooms that light up) with video collages. OK to drop the house everywhere — including the Care hub and the 404 page (which I'd build with a video collage and the logo instead)? *(Default: yes, drop it.)*

5. **The map.** The design uses a screenshot of Google Maps. The docs ask for our own drawn map with all the towns. Can I keep the design's layout but draw our own map in that spot (no Google screenshot)? And which Google Maps link is correct for "Get directions" — the one in the design (`maps.app.goo.gl/HEKX…`) or the one on today's website (`goo.gl/maps/SVvY…`)? *(Default: our own map; today's website link.)*

6. **The top menu.** The design's menu is short: 5 links + a Call button. The docs also wanted drop-downs for Care and About, a "For Professionals" link, the office-open badge and a green "Free Assessment" button. Keep the short design menu (those pages stay reachable from the footer and the page itself), or add the extra items? *(Default: keep the design's short menu.)*

7. **Text size and weight rules.** I'm reading "body text never below 18px and never weight 300" as: all paragraphs at 18px or bigger; small helper lines, captions and labels can stay at 16px (as the brand rules allow); and the thin "It usually starts with" heading switches from weight 300 to 400. Is that right?

8. **The logo's wording and hands.** Their real logo says "DAWSON AND DAWSON" in capital letters, has two caring hands under the roof, and "HOME CARE LLC". The brand doc describes "Dawson & Dawson" without the hands. Should the new logo copy the real one faithfully (capitals, "AND", hands, "LLC") in the new colors? *(Default: yes, faithful copy.)*

9. **The intro video on the Home page.** It locks scrolling until the logo animation finishes (up to about 8 seconds). Should it play every time someone opens the Home page, or only on their first visit in a browser session (later visits jump straight to the hero)? *(Default: once per session, with a keyboard skip.)*

10. **SEO choices.** The SEO plan leaves 5 small decisions open (an "In-home care · Beaufort, SC" label above the Home headline; how the thank-you page is hidden from Google; what happens to old WordPress admin links; old WordPress image links; and where the old "/personal-care" link points). OK to go with the plan's recommended option for all five? *(Default: yes.)*

---

## G. What happens next (after your answers)

- **Phase 2:** Next.js (App Router, TypeScript, Tailwind v4 with the 16 locked tokens), the `.devcontainer` (installs dependencies, starts `npm run dev` on port 3000, opens the preview automatically in your Codespace), design assets copied to `/public` with the same filenames, global layout (header, footer, mobile bar, cursor, Comfort Controls, office status), SVG logo, then Home.
- All placeholder facts stay visible as `[[TO CONFIRM]]` chips in the preview (`NEXT_PUBLIC_SHOW_PLACEHOLDERS=true`) and are listed by `npm run prelaunch`.
- Forms run in `LEAD_MODE=mock` (saved to `.leads/*.json`, git-ignored). Nothing is sent anywhere, and every page is `noindex`.
