# 08 — TECH STACK, INTEGRATIONS & MIGRATION

## 1. Stack (locked)
| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js (latest stable), App Router, TypeScript** | Full control of interactivity, static pages = very fast, great SEO |
| Styling | **Tailwind CSS v4** with brand tokens as CSS variables | Tokens from 03, no stray colors |
| Scroll animation | **GSAP + ScrollTrigger** | Pinned story scenes, SVG drawing (GSAP is free incl. plugins) |
| UI animation | **Motion** (formerly Framer Motion) | Component transitions, page transitions, layout animation |
| Smooth scroll | **Lenis** | Premium feel; disabled for reduced motion |
| Carousels | **Embla Carousel** | Light, accessible |
| Forms | **react-hook-form + zod** | Multi-step, validation |
| Icons | **lucide-react** | One icon set |
| Fonts | `next/font/google` — Fraunces + Plus Jakarta Sans | Self-hosted, no layout shift |
| Images | `next/image` (AVIF/WebP) | Performance |
| Spam protection | Honeypot + **Cloudflare Turnstile** (later, needs site key) | No annoying CAPTCHAs |
| Content | Typed data files in `/content` (TS/JSON) + MDX for long pages | Easy to move into a CMS later |
| Lint/format | ESLint + Prettier | Clean code |
| Testing | Playwright smoke tests + axe accessibility checks | QA gate |
| Hosting (later) | **Vercel** recommended | Built for Next.js, free SSL, fast global hosting |

Build runs on **localhost** until the reveal. No paid services required to develop.

## 2. Will Next.js disturb their GoHighLevel CRM?
**No — GoHighLevel is a separate cloud system. Changing the website doesn't touch their contacts, pipelines, workflows, automations or SMS history.** What changes is *how the website hands leads to GHL*. Two ways:

| Option | How | Pros | Cons |
|---|---|---|---|
| A. Embed GHL forms | Put their existing LeadConnector form in an iframe | Zero setup, identical behavior | Looks foreign, not animated, can't do multi-step/quiz prefill, slower |
| **B. Custom forms → GHL (recommended)** | Our Next.js forms post to `/api/lead` → server sends to a **GHL Inbound Webhook** (workflow trigger) or the **GHL API v2** (create/upsert contact with a Private Integration token) | Fully on-brand and interactive, quiz/estimator data become tags & custom fields, consent proof attached | Needs one-time mapping in GHL (≈1 hour once we have access) |

**Localhost plan:** build Option B with a `LEAD_MODE=mock` switch — submissions are validated and written to `./.leads/*.json` and logged. At go-live we add the webhook URL / token as environment variables (`GHL_WEBHOOK_URL`, `GHL_API_TOKEN`, `GHL_LOCATION_ID`) and flip to `LEAD_MODE=live`. No code change needed.

**Field mapping (to replicate in GHL):** first_name, last_name, phone, email, care_for, client_first_name, town, services[], hours_per_week, start_timing, best_time, preferred_contact, notes, sms_transactional_consent, sms_marketing_consent, consent_text_version, consent_timestamp, page_url, utm_*, quiz_* , estimator_*, after_hours, form_type (assessment | contact | referral | quiz_plan).

## 3. Everything else that could be "disturbed" by leaving WordPress — and the fix
| Thing | Risk | What we do |
|---|---|---|
| **Business email (info@)** | Email breaks if MX records are touched during DNS change | Change only the website records (A/CNAME) at launch. **Never touch MX, SPF, DKIM, DMARC.** Screenshot all DNS records before any change |
| **SMS / A2P or toll-free verification** | Carrier registration references their website, privacy policy and opt-in form | Keep the same domain; `/privacy-policy` and `/sms-terms` live at launch; opt-in wording at least as complete as today |
| **GHL tracking script / chat widget** | If the old site had GHL's external tracking or chat widget, it disappears | Check the old site's scripts before launch; re-add via `next/script` if used |
| **GHL calendar/booking widget** | Not seen on current site | If they use one, embed or link it |
| **Google rankings** | Old URLs 404 → rankings drop | 301 redirects for every old URL (§4); submit new sitemap in Search Console |
| **Google Business Profile** | Website link points to the domain | Domain stays the same → nothing to change (update link to `/` if it points to an old page) |
| **Analytics / Meta pixel / Google Ads** | Old tracking codes are inside WordPress | Re-install GA4 / GTM / pixels in Next.js (get IDs at reveal); add cookie notice if marketing pixels used |
| **Hireology careers** | Just an outbound link | Keep linking to `careers.hireology.com/dawsondawsonhomecarellc` |
| **Instagram, Maps links** | None | Kept |
| **Medical Referrals form destination** | Unknown where current Elementor form sends (email?) | Route to GHL with `referral` tag + email notification to info@ (confirm at reveal) |
| **Old WordPress images in emails/ads** | Links to `/wp-content/uploads/...` may be used in GHL emails | Keep WordPress hosting alive 30 days after launch; optionally redirect key image URLs |
| **Ads landing pages / GHL email links** | May point to `/contact-us/` etc. | Covered by redirects |
| **Editing content** | Client loses Elementor editing | **Parked** — decide later: headless CMS (e.g. Sanity) for reviews/blog/FAQ, or a maintenance retainer |
| **SSL / hosting / backups** | Moves to new host | Vercel provides SSL automatically; keep a full WordPress backup |
| **Speed / plugins** | WordPress plugins (SEO, forms, cache) go away | Replaced by built-in Next.js features (metadata API, sitemap, image optimisation) |

## 4. Redirect map (301, permanent)
| Old | New |
|---|---|
| `/adl-care/` | `/care/personal-care` |
| `/personal-care/` | `/care/personal-care` |
| `/respite-care/` | `/care/respite-care` |
| `/companionship-care/` | `/care/companionship` |
| `/medical-referrals/` | `/for-professionals` |
| `/about-us/` and `/about-us` | `/about` |
| `/contact-us/` | `/contact` |
| `/wp-admin`, `/wp-login.php` | `/` (or 410) |
| `/feed/`, `/comments/feed/` | `/` |
Implemented in `next.config` `redirects()`; trailing-slash handled.

## 5. Project structure (for Claude Code)
```
dawson-home-care/
  app/
    (site)/layout.tsx            header, footer, cursor, comfort controls, mobile bar
    page.tsx                     Home (chapters as components)
    care/page.tsx
    care/[slug]/page.tsx
    find-care/page.tsx
    how-it-works/page.tsx
    paying-for-care/page.tsx
    areas-we-serve/page.tsx
    areas-we-serve/[town]/page.tsx
    about/ reviews/ for-professionals/ careers/ faq/ resources/
    free-assessment/ contact/ thank-you/
    privacy-policy/ sms-terms/ accessibility/ sitemap/
    api/lead/route.ts  api/referral/route.ts
    sitemap.ts robots.ts not-found.tsx opengraph-image.tsx
  components/
    brand/   Logo.tsx  LogoMark.tsx  HeartbeatLine.tsx
    cursor/  CursorRing.tsx
    layout/  Header.tsx  MegaMenu.tsx  Footer.tsx  MobileActionBar.tsx  OfficeStatus.tsx  ComfortControls.tsx
    motion/  Reveal.tsx  SplitLines.tsx  Parallax.tsx  SmoothScroll.tsx  PageTransition.tsx
    home/    Hero.tsx  TheMoment.tsx  DawsonHouse.tsx  QuizTeaser.tsx  HowItWorks.tsx  Since2002.tsx  MeetOwner.tsx  Caregivers.tsx  ReviewsMarquee.tsx  EstimatorCompact.tsx  AreaMap.tsx  ProsBand.tsx  FaqPreview.tsx  FinalCta.tsx
    features/ CareQuiz/  CostEstimator/  PaymentExplorer/  AssessmentForm/  ReferralForm/  FaqSearch/
    ui/       Button.tsx  Card.tsx  Chip.tsx  Accordion.tsx  Tabs.tsx  Input.tsx  Checkbox.tsx  Placeholder.tsx
  content/
    site.config.ts   (business facts, hours, phones, rates, flags)
    services.ts  areas.ts  payments.ts  quiz.ts  faq.ts  reviews.json  caregivers.ts  owner.ts  timeline.ts
    copy/  (approved COPY_*.md converted to MDX/TS)
  lib/  ghl.ts  consent.ts  officeHours.ts  years.ts  schema.ts  analytics.ts
  public/  images/placeholders/  logo/  og/
  styles/ globals.css (tokens)
  CLAUDE.md
```

## 6. Environment variables
```
LEAD_MODE=mock            # mock | live
GHL_WEBHOOK_URL=          # inbound webhook (option 1)
GHL_API_TOKEN=            # private integration token (option 2)
GHL_LOCATION_ID=
TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=
NEXT_PUBLIC_GA_ID=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## 7. Performance budget
- LCP < 2.0s on 4G mid-range mobile; CLS < 0.05; INP < 200ms
- JS for first load ≤ 200KB gzipped on Home; GSAP scenes lazy-loaded per chapter
- All images sized, AVIF/WebP, lazy below the fold; hero image preloaded
- Fonts: 2 variable files, `display: swap`
