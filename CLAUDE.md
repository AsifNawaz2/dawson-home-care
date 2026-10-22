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
- **Colors:** only the **16 locked tokens** in `styles/globals.css` `@theme` (BRAND_FINAL §2). Tailwind's default palette and sizes are wiped (`--color-*: initial`), so `bg-blue-500`/`text-xs` don't exist. Shadows/glows from the design are alpha versions of these tokens.
- **Logo:** faithful SVG rebuild of `docs/current-logo.png` ("DAWSON AND DAWSON", caring hands, "HOME CARE LLC") in the new colors — `components/brand/Logo.tsx` (variants: stacked · horizontal · mark · mark-small; tones: default · reversed · mono-plum · mono-cream). **Option A** (wheelchair) is live; **Option B** (two people) via `NEXT_PUBLIC_LOGO_FIGURE=b`. Motion in `LogoMotion.tsx` + CSS. Static files: `npm run logos` → `public/logo/*`, favicon, app icons. The Home **intro video + end frame stay as designed** (Phase 3) and fly into this SVG header logo; the SVG draw-in intro plays once per session on other landing pages.
- **Header:** the design's short menu (logo · Care services · How it works · Paying for care · Areas we serve · Our story · Call). "Care services" opens the Care mega-menu (5 services + quiz). No extra items in the bar.
- **Home (Phase 3):** whole quiz inline on Home; "The moment" keeps 4 lines; the illustrated Dawson House is dropped everywhere (video collages instead); intro video once per session.
- **Real facts confirmed by the owner:** Google reviews (show first name + last initial), 4.8 ★ / 33 reviews, "Women-owned", owner first name **Monique**, Google Maps link `https://maps.app.goo.gl/efdxQNbog5ZGfmrM7`. Everything else unknown stays a placeholder.
- **Placeholders:** every unconfirmed fact lives in `content/site.config.ts` as `toConfirm(...)` / `confirmed: false` / `null`, and renders as a `.tbc` chip only when `NEXT_PUBLIC_SHOW_PLACEHOLDERS=true`. Never invent facts. Images/videos in `public/` are placeholders — **keep their filenames stable**. `npm run prelaunch` lists everything left.
- **Non-medical only.** Never imply nursing, medical care, dementia/memory care or live-in care. "Clients", never "patients".
- **Accessibility: WCAG 2.2 AA.** Touch targets ≥ **48px**. Visible focus ring everywhere (3px leaf + 2px plum-950 inner; cream on Dusk). State is never color alone. Body links underlined. Accessible names include the visible label (2.5.3).
- **Reduced motion:** every animation has a reduced version. Reduced = OS setting **or** Comfort Controls (`html[data-motion="reduce"]`). Use `useMotionMode()` / `isReducedMotion()` (`lib/motionMode.ts`) and the `reduce-motion:` Tailwind variant. Server render = static/reduced layout.
- **Office hours vs care:** Office Mon–Fri 8 AM–5 PM (America/New_York, `lib/officeHours.ts`); Care 24/7. After hours every "Get a Free Care Assessment" becomes "Request a Callback" (`<CtaLabel />`).
- **Smooth scrolling (Lenis)** is off by default (`NEXT_PUBLIC_SMOOTH_SCROLL`) — the design runs on normal scrolling.
- **Indexing:** everything is `noindex` unless `NEXT_PUBLIC_INDEXABLE=true` (production domain only). `/styleguide` 404s in production.

## Leads: `LEAD_MODE`

Forms post to our own API routes (`/api/lead`, `/api/referral` — built in a later phase), never embedded GHL forms.

- `LEAD_MODE=mock` (default everywhere until launch): validate with the same zod schema, write to `./.leads/*.json` (git-ignored), log. Nothing leaves the machine.
- `LEAD_MODE=live`: send to GoHighLevel via `GHL_WEBHOOK_URL` or the API v2 (`GHL_API_TOKEN`, `GHL_LOCATION_ID`). No code change needed to switch.
  Field names, consent proof and tags: `docs/08` §2, `docs/COPY_CONVERSION.md` §3/§5, `docs/COPY_LEGAL.md` §1. See `.env.example`.

## Folder structure (08 §5)

```
app/
  layout.tsx            html/body, fonts, pre-paint <head> script (comfort + logo-intro flags)
  (site)/layout.tsx     site chrome (SiteChrome)
  (site)/page.tsx       Home (temporary preview until Phase 3)
  (site)/styleguide/    design system page (404 in production)
  not-found.tsx         designed 404 inside the chrome
  icon.svg apple-icon.png favicon.ico manifest.ts   generated by `npm run logos`
  fonts/                Anton + Poppins woff2 (OFL)
  api/                  lead/referral routes (later)
components/
  brand/   Logo.tsx  LogoMotion.tsx  logo-paths.ts (generated — scripts/logo-trace)
  cursor/  CursorRing.tsx
  layout/  SiteChrome Header HeaderBar Footer MobileActionBar OfficeStatus ComfortControls NotFoundContent
  motion/  PageTransition.tsx  SmoothScroll.tsx
  home/ features/ ui/   (later phases)
content/   site.config.ts (facts + flags) · navigation.ts · tokens.ts · copy/ (later)
lib/       officeHours · years · motionMode · storage · contrast · headScript · cn
styles/    globals.css (tokens + design component classes, ported from docs/design/css)
public/    images/ videos/ (design placeholders, same filenames) · logo/ · icons/
scripts/   optimize-images.mjs · export-logos.tsx · prelaunch.mjs · logo-trace/
tests/e2e/ Playwright + axe smoke tests
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

| Command                       | What it does                                                       |
| ----------------------------- | ------------------------------------------------------------------ |
| `npm run dev`                 | Dev server on port 3000 (the Codespace starts it automatically)    |
| `npm run build` / `npm start` | Production build / serve                                           |
| `npm run check`               | ESLint + TypeScript + Prettier check                               |
| `npm run test:e2e`            | Playwright + axe (build first)                                     |
| `npm run logos`               | Regenerate static logo files and icons                             |
| `npm run images`              | Re-optimise images from `docs/design/images` into `public/images`  |
| `npm run prelaunch`           | List every unconfirmed fact/placeholder (exits 1 while any remain) |
