# CLAUDE.md — Dawson & Dawson Home Care website

New website for **Dawson and Dawson Home Care LLC** (Beaufort, SC — non-medical, owner-run home care since 2002). A surprise rebuild: **nothing goes live**. Next.js 16 (App Router) + TypeScript + Tailwind v4. The owner previews it in a GitHub Codespace.

@AGENTS.md

Read `docs/BUILD_DECISIONS.md` before any work: it records every design-vs-docs conflict and the owner's answers (§H).

## Sources of truth (priority order when files conflict)

1. **Visuals → the approved design** in `docs/design/` (6 HTML screens + css/js/images/videos/fonts): layout, spacing, styling, fonts, images, videos and **every animation exactly as designed**. Don't simplify or "improve" animations.
2. **`docs/BRAND_FINAL.md`** — tokens, contrast rules, logo, cursor.
3. **`docs/COPY_*.md`** (copy, verbatim) · **`docs/SPEC_FEATURES.md`** (behavior) · **`docs/SEO_PLAN.md`** (metadata, schema, redirects).
4. **`docs/02`–`11`** (brief, sitemap, features, stack, compliance, placeholders).

How to read it: the design decides how things **look and move**; the docs decide **what is said, what is true and how things work** (logic, data, forms, GoHighLevel, SEO, legal). A fact shown in the design but not confirmed in the docs stays a `[[TO CONFIRM]]` placeholder.

## Known decisions (don't re-open)

- **Fonts:** Anton (display) + Poppins (body), self-hosted from `docs/design/fonts` via `next/font/local` (`app/fonts.ts`). This replaces Fraunces + Plus Jakarta Sans everywhere in `/docs`. Heading accent words are **colored** (`.accent`: orchid-500 on light, orchid-100 on dark) — Anton has no italic.
- **Type rules:** paragraph text ≥ **18px**; helpers/captions/labels may be 16px; 14px only for eyebrows + cursor label; **never weight 300**.
- **Laptop scale (BUILD_DECISIONS §I.1):** desktop is the design × ~0.78 so every section fits a 1280×720 / 1440×800 screen. Follow these for any new page:
  - Sizes come from tokens in `styles/globals.css` — `--text-display/page/hero/dl/h2/sh/h3/h4/numeral/stat` (classes `.h1-display`, `.h1-page`, `.h1-hero`, `.dl`, `.h2`, `.h3`, utilities `text-h4`, `text-numeral`, `text-stat`). Don't hard-code big `lg:text-[…rem]` values; if you need a new size, add a token.
  - Never shrink reading text: body 18px, lead 19–20px, helpers 16px. Never use CSS `zoom`, `transform: scale` or a smaller root font-size, and never size text in `vw`/`vh` alone (it breaks Comfort text size and browser zoom).
  - Section padding from `lg`: `lg:py-section` (80) · `lg:py-section-sm` (72) · `lg:py-section-lg` (96); phones keep `py-[72px]`/`py-[88px]`. Big column gaps max `lg:gap-18`.
  - Page width: `wrap` (max `--wrap-max` 1280); only the header uses `wrap-wide` (1440). Left text columns ~360–400px.
  - Pinned scenes and hero pictures fit under the header: cap heights with `--fit-h` (`100svh − header − 96px`) and offset pinned content with `lg:pt-[var(--header-h)]`. Header is 80px from `xl`, 72px below.
  - Buttons are 48px tall from `lg` (52 on phones); touch targets never under 48px.
  - Check new pages at 1280×720, 1440×900, 1920×1080 and 390×844.
- **Colors:** only the **16 locked tokens** in `styles/globals.css` `@theme` (BRAND_FINAL §2). Tailwind's default palette and sizes are wiped (`--color-*: initial`), so `bg-blue-500`/`text-xs` don't exist. Shadows/glows from the design are alpha versions of these tokens.
- **Logo:** faithful SVG rebuild of `docs/current-logo.png` ("DAWSON AND DAWSON", caring hands, "HOME CARE LLC") in the new colors — `components/brand/Logo.tsx` (variants: stacked · horizontal · mark · mark-small; tones: default · reversed · mono-plum · mono-cream). **Option A** (wheelchair) is live; **Option B** (two people) via `NEXT_PUBLIC_LOGO_FIGURE=b`. Motion in `LogoMotion.tsx` + CSS. Static files: `npm run logos` → `public/logo/*`, favicon, app icons. The Home **intro video** is the owner's new logo animation (`docs/new_intro_logo_animation.mp4`, replaces the design's; `npm run intro` → web video, end frame and the cut-out logo that flies into this SVG header logo); the SVG draw-in intro plays once per session on other landing pages.
- **Header:** logo · Care services · How it works · Paying for care · Areas we serve · Our story · **Get a Free Assessment** (leaf) · **Call** (owner, BUILD_DECISIONS §I.3). "Care services" opens the Care mega-menu (5 services + quiz). The bar uses `wrap-wide` (1440); below 1440px Call shows "Call" only (number in its accessible name); with larger Comfort text (`html[data-text-scale]`) the Assessment button is hidden so the bar fits. No other items in the bar.
- **Home header buttons (owner, BUILD_DECISIONS §I.4, desktop ≥ 1280 only):** one pair, never two. At the top the bar has no buttons and the links spread out; the pair sits under the hero image (the header's pair, ×1.14). Over 300px of scroll, ending when that spot reaches the header, the pair travels into the bar and the links slide back (`components/home/CtaTravel.tsx`, GSAP ScrollTrigger `scrub: true`, transforms only); scrolling up reverses it. Two copies (`components/layout/HeaderCtas.tsx`, hero + header) hand over on the same pixels — only one is visible/focusable (`data-cta-docked` / `data-cta-away`). Reduced motion: switch at halfway. Larger Comfort text: the green button fades out on the way (bar keeps Call). The logo compacts as the journey starts (`html[data-cta-start]`). Phones, tablets and other pages unchanged.
- **Home (Phase 3):** whole quiz inline on Home; "The moment" keeps 4 lines; the illustrated Dawson House is dropped everywhere (video collages instead); intro video once per session.
- **Home intro:** plays when Home is the page a visitor **lands on**, once per tab session (`sessionStorage` `dd:home-intro`, decided pre-paint in `lib/headScript.ts` → `html[data-home-intro="play"|"still"]`). Client-side navigation back to Home never replays it. While it plays, the header/phone bar/comfort button are fixed and faded by `--hi-*` vars (`components/home/HomeIntro.tsx`). Open a new tab to see it again.
- **How we help collages:** the stage is centred in its column; services 4–5 (two clips) are shifted right in `content/copy/home.ts` so they rest centred like 1–3 (§I.2).
- **Home scroll scenes** port the design's own maths (`components/home/scroll.ts`): sticky "tracks" in `svh`, progress from `getBoundingClientRect`, direct DOM writes per frame (no React state). The live and still layouts are both in the DOM and switched by CSS with the `live:` / `reduce-motion:` variants, so there's no flash before hydration.
- **Real facts confirmed by the owner:** Google reviews (show first name + last initial), 4.8 ★ / 33 reviews, "Women-owned", owner first name **Monique**, Google Maps link `https://maps.app.goo.gl/efdxQNbog5ZGfmrM7`. Everything else unknown stays a placeholder.
- **Placeholders:** every unconfirmed fact lives in `content/site.config.ts` as `toConfirm(...)` / `confirmed: false` / `null`, and renders as a `.tbc` chip only when `NEXT_PUBLIC_SHOW_PLACEHOLDERS=true`. Never invent facts. Images/videos in `public/` are placeholders — **keep their filenames stable**. `npm run prelaunch` lists everything left.
- **Non-medical only.** Never imply nursing, medical care, dementia/memory care or live-in care. "Clients", never "patients".
- **Accessibility: WCAG 2.2 AA.** Touch targets ≥ **48px**. Visible focus ring everywhere (3px leaf + 2px plum-950 inner; cream on Dusk). State is never color alone. Body links underlined. Accessible names include the visible label (2.5.3).
- **Reduced motion:** every animation has a reduced version. Reduced = OS setting **or** Comfort Controls (`html[data-motion="reduce"]`). Use `useMotionMode()` / `isReducedMotion()` (`lib/motionMode.ts`) and the `reduce-motion:` / `live:` (full motion) Tailwind variants. Server render = static/reduced layout.
- **Office hours vs care:** Office Mon–Fri 8 AM–5 PM (America/New_York, `lib/officeHours.ts`); Care 24/7. After hours every "Get a Free Care Assessment" becomes "Request a Callback" (`<CtaLabel />`).
- **Smooth scrolling (Lenis)** is off by default (`NEXT_PUBLIC_SMOOTH_SCROLL`) — the design runs on normal scrolling.
- **Phase 4 (see BUILD_DECISIONS §D8):** service area map is **schematic** (towns, office pin, mile rings — no coastline) until `npm run map` runs on 1:500k Census data. Reviews stay real (`placeholder: false`). Caregiver cards are placeholders shown only with placeholders on. Owner video = "Video coming soon". Content blocks (`content/blocks.ts`) render via `components/ui/Blocks.tsx`; Pending blocks only with placeholders on.
- **Session storage keys:** `dawson.quiz.v1`, `dawson.assessment.prefill.v1` (quiz → form hand-off, never in a URL), `dawson.assessment.v1`, `dawson.thankyou.v1`, `dawson.estimator.v1`, `dawson.utm.v1` (first-touch `utm_*`, `lib/attribution.ts`), `payment_explored`, `agency_questions_ticked`, `dd:logo-figure` (the `/reveal-notes` logo A/B toggle, this tab only).
- **Logo sprite:** the traced logo shapes are drawn once per page by `<LogoSprite />` (root layout) and every `<Logo>` `<use>`s them — never inline `LOGO_FILLS` in a page component (it tripled the HTML). Static files pass `paths={LOGO_FILLS}`.
- **Office status pre-paint:** `lib/headScript.ts` sets `html[data-office="open|closed"]` so `<WhenClosed>` lines are laid out before first paint (no layout shift). Same rule as `lib/officeHours.ts` — change both together.
- **Home performance:** chapters after "How it works" are wrapped in `<Later>` (`content-visibility: auto`); the intro poster is the responsive end-frame `<Image>` under the video (no `poster` attribute); How-we-help collage posters load when the scene is near (`lazyPoster`). The quiz's "Email me this plan" form is its own dynamic chunk (`EmailPlanForm.tsx`) so zod stays off Home's first load.
- **Indexing:** everything is `noindex` unless `NEXT_PUBLIC_INDEXABLE=true` (production domain only). `/styleguide` and `/reveal-notes` 404 in production (`proxy.ts`).
- **Redirects (Phase 6):** `content/redirects.ts` (SEO_PLAN §5) → `next.config.ts` `redirects()` as **301**, both slash variants; WordPress endpoints (`/wp-admin`, `/wp-content`…) answer **410** from `proxy.ts`, after `legacyAssets`. Add rows from the pre-switch crawl there, never a blanket redirect to `/`.
- **`/reveal-notes`** (not linked, noindex): what's new, the 7 fixes, the live logo A/B toggle and "What we need from you" — the same list as `npm run prelaunch` (`lib/prelaunch.ts`).
- **SEO (Phase 5):** every page uses `pageMetadata(path)` (`lib/seo.ts`) with its entry in `content/seo.ts`, and `<PageHero path>` / `<PageCrumbs>` for the breadcrumb + BreadcrumbList. JSON-LD builders live in `lib/schema.ts` and omit unconfirmed fields. A new page needs a `content/seo.ts` entry first.
- **Legal pages:** `components/legal/LegalPage.tsx`; variants follow `legal.analytics`, `integrations.turnstile` and `sms.marketingEnabled`. "Last updated" dates are set by hand in `legal.updated` at launch.
- **Forms:** send buttons use `useHydrated()` (plain button until React is ready — no native GET with personal data in the URL).

## Leads: `LEAD_MODE`

Forms post to our own API routes, never embedded GHL forms: `/api/lead` (assessment, `quiz_plan`, `contact`) and `/api/referral`. Shared plumbing (duplicate guard, mock/live delivery) is in `lib/leads.ts`; shared zod field rules in `lib/schemas/fields.ts` (cross-field checks pass `always` so every error shows in the first summary).

- `LEAD_MODE=mock` (default everywhere until launch): validate with the same zod schema, write to `./.leads/*.json` (git-ignored), log. Nothing leaves the machine.
- `LEAD_MODE=live`: send to GoHighLevel (`lib/ghl.ts`) via `GHL_WEBHOOK_URL` (wins when set: the flat lead + tags) or the API v2 (`GHL_API_TOKEN`, `GHL_LOCATION_ID`: contact upsert with standard + custom fields + tags, then a note with the whole lead). No code change needed to switch. A failed delivery answers 502 and frees the duplicate key.
- Tags on every lead: `website-lead`, `form-<type>`, `referral`, `quiz-completed` (any `quiz_*` field), `after-hours`. Mock files carry the same tags, so a mock file is exactly the webhook body.
- Spam: honeypot (`website`, silent success) + duplicate guard (10 min) + Cloudflare Turnstile (invisible, `components/forms/Turnstile.tsx`) that is off until `TURNSTILE_SITE_KEY` / `TURNSTILE_SECRET_KEY` are set; `integrations.turnstile` follows the site key so the Privacy lines are only shown when true.
  Field names, consent proof and tags: `docs/08` §2, `docs/COPY_CONVERSION.md` §3/§5, `docs/COPY_LEGAL.md` §1. See `.env.example`.

## Folder structure (08 §5)

```
app/
  layout.tsx            html/body, fonts, pre-paint <head> script (comfort + logo-intro flags)
  (site)/layout.tsx     site chrome (SiteChrome)
  (site)/page.tsx       Home (all chapters)
  (site)/care/          /care hub + [slug] service template (generateStaticParams)
  (site)/free-assessment  find-care  paying-for-care  faq  thank-you  how-it-works
  (site)/areas-we-serve/ hub + [town] (generateStaticParams)   about reviews careers resources
  (site)/for-professionals  contact  privacy-policy  sms-terms  accessibility  sitemap (HTML)
  (site)/styleguide/    design system page (404 in production)
  (site)/reveal-notes/  for the owner at the reveal (404 in production, never linked)
  not-found.tsx         designed 404 inside the chrome
  icon.svg apple-icon.png favicon.ico manifest.ts   generated by `npm run logos`
  fonts/                Anton + Poppins woff2 (OFL)
  api/lead/             POST — assessment, quiz_plan and contact leads (LEAD_MODE mock|live, lib/ghl.ts)
  api/referral/         POST — /for-professionals referrals (form_type=referral, tag referral)
  og/[key]/             generated Open Graph images (one per page, prerendered; fonts in og/fonts)
  robots.ts sitemap.ts  robots.txt + sitemap.xml from content/seo.ts (Disallow all unless indexable)
proxy.ts                unknown /care/* and /areas-we-serve/* → real 404; WordPress paths → 410; preview-only pages 404 in production
components/
  brand/   Logo.tsx  LogoMotion.tsx  logo-paths.ts (generated — scripts/logo-trace)
  cursor/  CursorRing.tsx
  layout/  SiteChrome Header HeaderBar Footer MobileActionBar OfficeStatus ComfortControls NotFoundContent
  motion/  PageTransition.tsx  SmoothScroll.tsx
  home/    one component per Home chapter + home.css + scroll.ts (scene helpers) + stepIcons
  services/ service-page sections (ServiceHero, FitChecklist, DayTimeline…) + services.css
  forms/   AssessmentForm, AssessmentAside, ReferralForm, ContactForm, ThankYou, FormBits + forms.css
  seo/     JsonLd, PageCrumbs (visible breadcrumb + BreadcrumbList from content/seo.ts)
  trust/   HowSteps, CaregiverCard, ReviewsGrid
  areas/   TownList, DriveMap, HubMap, OfficeMap
  legal/   LegalPage (shared legal layout, ContactBlock, Pending)
  features/ CareQuiz, CostEstimator, PaymentExplorer, AgencyChecklist, FaqSearch, AreaMap, TownSearch
  ui/      Accordion, AssessmentButton, Blocks, Breadcrumbs, Collage, DuskCta, JumpBar, Tbc,
           PageHero (+ SectionHead), TickList, Segs, PhotoSlot, Years, HashFocus
content/   site.config.ts (facts + flags) · navigation.ts · tokens.ts · copy/ (page copy, e.g. home.ts)
           services.ts careHub.ts assessment.ts quiz.ts payments.ts faq.ts blocks.ts areas.ts
           reviews.ts caregivers.ts legal/consent.ts map/lowcountry.ts (generated: npm run map)
           seo.ts (SEO_PLAN §8: titles, descriptions, index rules, breadcrumbs) towns.ts (COPY_AREAS
           town pages as Segs) owner.ts resources.ts referral.ts copy/howItWorks.ts
           redirects.ts (SEO_PLAN §5: 301 map, 410 prefixes, legacy assets)
lib/       officeHours · years · motionMode · storage · contrast · headScript · cn
           estimate · phone · formMessages · projection · seo (pageMetadata) · schema (JSON-LD)
           leads · ghl (GoHighLevel webhook + API v2) · attribution (utm) · prelaunch (the gate list)
           useHydrated · schemas/ (zod: fields, assessment, quizPlan, referral, contact)
styles/    globals.css (tokens + design component classes, ported from docs/design/css)
public/    images/ videos/ (design placeholders, same filenames) · logo/ · icons/
scripts/   optimize-images.mjs · export-logos.tsx · prelaunch.ts · build-map.ts · logo-trace/
tests/e2e/ Playwright + axe: shell, home, features, pages, leads (every form + GHL mapping +
           redirects), qa (every page: axe, comfort controls, 320px/200% reflow, keyboard, color pairs)
docs/      specs, copy and the approved design — read-only, never edited by the build
```

## Styling conventions

- Reuse the design's component classes from `styles/globals.css` (`.btn .btn-primary/-secondary/-ghost/-cream`, `.link`, `.navlink`, `.eyebrow`, `.h2`, `.h3`, `.dl`, `.h1-hero`, `.lead`, `.sm`, `.muted`, `.field`, `.lbl`, `.help`, `.emsg`, `.opt`, `.ans`, `.faq-q`, `.chip`, `.tbc`, `.card`, `.wrap`…) and Tailwind utilities for layout.
- Dark sections: `data-surface="dark"` (+ `data-cursor-theme="dark"`); Dusk band: `data-surface="dusk"` + `bg-dusk`.
- Cursor labels: `data-cursor-label="Call|Open|Play|Drag|View"`; `data-cursor="none"` on video controls/iframes.
- Forms/quiz regions: add `data-hides-mobile-bar`.

## Next.js 16 notes (this is not the Next.js in your training data)

- Read `node_modules/next/dist/docs/` before using an API (see AGENTS.md).
- `cacheComponents` + `partialPrefetching` are on. **No `new Date()`/`Math.random()` during prerender** (server components or client render paths) — read the clock in effects or `useSyncExternalStore` (see `CurrentYear.tsx`, `OfficeStatus.tsx`).
- `usePathname()` in the chrome is fine for static routes. **Dynamic routes** (e.g. `/areas-we-serve/[town]`) must use `generateStaticParams` so the shell still prerenders.
- Unknown URLs go to `app/not-found.tsx` (no catch-all route).

## Commands

| Command                       | What it does                                                                                                  |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `npm run dev`                 | Dev server on port 3000 (the Codespace starts it automatically)                                               |
| `npm run build` / `npm start` | Production build / serve                                                                                      |
| `npm run check`               | ESLint + TypeScript + Prettier check                                                                          |
| `npm run test:e2e`            | Playwright + axe (build first): every form, redirects, QA sweep                                               |
| `npm run logos`               | Regenerate static logo files and icons                                                                        |
| `npm run map`                 | Rebuild `content/map/lowcountry.ts` (pass a 1:500k TopoJSON)                                                  |
| `npm run images`              | Re-optimise images from `docs/design/images` into `public/images`                                             |
| `npm run intro`               | Rebuild the Home intro video, end frame and flying logo from `docs/new_intro_logo_animation.mp4` (ffmpeg)     |
| `npm run prelaunch`           | What's left to confirm, grouped + every occurrence (exits 1 while any remain); `-- --short` for the list only |

If a CSS change doesn't show up in `npm run build`, delete `.next` and build again (Turbopack can reuse a stale stylesheet).
