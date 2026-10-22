# 06 — SITEMAP & PAGE SPECS

## Sitemap
```
/                                   Home (scroll story)
/care                               Care Services hub
  /care/personal-care
  /care/home-help
  /care/companionship
  /care/respite-care
  /care/24-hour-care
/find-care                          Care Quiz (full page)
/how-it-works                       How It Works
/paying-for-care                    Paying for Care + Cost Estimator
/areas-we-serve                     Service-area map hub
  /areas-we-serve/[town]            One page per town (beaufort, port-royal, ladys-island, st-helena-island, bluffton, hilton-head-island, …)
/about                              About + Meet the Owner + Our Caregivers
/reviews                            Reviews
/for-professionals                  Healthcare Professionals (referral portal)
/careers                            Careers (links/embeds Hireology)
/faq                                FAQ
/resources                          Resources/blog (structure now, posts later)
/free-assessment                    Free Care Assessment (main conversion page)
/contact                            Contact
/privacy-policy                     Privacy Policy
/sms-terms                          SMS Terms
/accessibility                      Accessibility Statement
/sitemap                            HTML sitemap
/thank-you                          Post-submission page (noindex)
404                                 Custom not-found page
```

## Global elements (every page)
- **Header:** logo (morphs to mark on scroll) · nav: Care ▾ (mega-menu with the 5 services + "Not sure? Take the quiz") · How It Works · Paying for Care · Areas · About ▾ (About, Reviews, Careers) · For Professionals · office-status chip · **Call** (plum) · **Free Assessment** (leaf)
- **Mobile header:** logo mark + menu button; full-screen menu with big tap rows
- **Sticky mobile action bar** (bottom, always visible on mobile): Call · Text · Free Assessment
- **Comfort controls** button (bottom-left): text size, contrast, reduce motion
- **Interactive cursor** (desktop)
- **Footer:** stacked reversed logo with idle heartbeat · short promise · Care links · Company links · Contact block (address, phone, toll-free/text, fax, email) · Office hours + "Care 24/7" · Instagram · Directions · Privacy · SMS Terms · Accessibility · Sitemap · dynamic ©
- **Breadcrumbs** on all inner pages
- **Page transitions:** soft cream curtain with heartbeat line sweep (≤ 500ms; none for reduced motion)

## HOME — the scroll story (14 chapters)
| # | Chapter | Purpose | Visual / interaction |
|---|---|---|---|
| 1 | **Hero — "Care that feels like family"** | Instant clarity + CTAs | Logo draw on first visit; editorial headline with italic "family"; layered photo collage (placeholder) with gentle parallax; Dusk glow blob; "Since 2002 · Owner-run · Care 24/7" trust row; Free Assessment + Call; office-status chip |
| 2 | **"It usually starts with a moment."** | Empathy — name the family's worry | Pinned scene: short lines appear one by one ("Mom missed her pills again." / "Dad fell in the shower." / "You live three hours away.") then fade into *"You don't have to figure this out alone."* Line illustrations morph between moments |
| 3 | **The Dawson House** (signature) | Show all services visually | Illustrated house; as you scroll, rooms light up one by one with a label card: Bathroom → Personal Care · Kitchen → Home Help · Porch → Companionship · Bedroom with moon → 24-Hour & Overnight · Living room with a resting family member → Respite. Click/tap any room → service page. Keyboard: rooms are buttons. Mobile: swipeable room cards under the house |
| 4 | **"Not sure what you need?"** | Route the undecided | Inline mini-quiz (first question live) → continues on /find-care |
| 5 | **How it works** | Remove fear of the unknown | Heartbeat line draws downward as you scroll through 5 steps: Call us → Owner visits your home (free) → Your care plan → Caregiver match → Ongoing check-ins. Step 2 highlighted as the differentiator |
| 6 | **Since 2002** | Longevity proof | Big animated counter "24 years" (computed), timeline ticks 2002 → today; caption about being Beaufort-based |
| 7 | **Meet the owner** | Human trust | Split layout: portrait (placeholder), short story, handwritten-style signature (SVG), 60s video with "Play" cursor label and captions |
| 8 | **Our caregivers** | Real people | Horizontal drag carousel ("Drag" cursor label); cards flip on click to show "Why I do this" quote |
| 9 | **What families say** | Social proof | Two-row slow marquee of review cards (pauses on hover/focus, pause button for a11y) + Google rating badge slot |
| 10 | **What will care cost?** | Price anxiety | Compact cost estimator (hours/week slider) → full on /paying-for-care |
| 11 | **Where we care** | Local proof | Interactive Lowcountry map: Beaufort pin pulses, towns light up on hover; list fallback |
| 12 | **For healthcare professionals** | Referral sources | Slim band: "Refer a patient in 2 minutes" + fax number + response promise `[[TO CONFIRM]]` |
| 13 | **Questions families ask** | Objection handling | 6 top FAQs accordion → /faq |
| 14 | **Final CTA** | Convert | Dusk gradient band: "Let's talk about your family." Free Assessment + Call + Text; Care 24/7 / Office hours line |

## CARE HUB — /care
Intro line · 5 service cards (illustration, promise, 4 bullets, link) · "Most families combine services" visual (Venn-style overlap) · quiz CTA · what we don't do · CTA band

## SERVICE PAGE TEMPLATE — /care/[service]
1. Hero: service name, promise, illustration/photo, CTAs, breadcrumb
2. "Is this right for you?" — 4–5 "This helps if…" checklist items (tickable, playful)
3. What's included — icon grid
4. A day with Dawson — mini scroll timeline of a typical visit (morning → evening)
5. How we keep it safe & dignified — 3 points
6. Pairs well with — related services
7. What it costs — estimator link
8. Service FAQ (3–5)
9. Review (placeholder) + CTA band

## HOW IT WORKS — /how-it-works
Full-length version of the 5-step timeline with detail per step, "What to expect at your free assessment" checklist, what to have ready, how fast care can start `[[TO CONFIRM]]`, CTA.

## PAYING FOR CARE — /paying-for-care
1. Full **Cost Estimator** (07)
2. **Payment Explorer** — tabs: Private pay · Long-term care insurance · VA benefits · Medicaid waivers · Medicare (honest: generally does not cover non-medical home care) — each with "what it is / how it works / ask us" (`confirmed:false` flags)
3. "Questions to ask any agency" checklist (positions Dawson as the honest guide)
4. CTA

## AREAS WE SERVE — /areas-we-serve + /areas-we-serve/[town]
Hub: interactive map + town list + "Not on the list? Call us."
Town page template: H1 "In-Home Care in {Town}, SC", local intro, distance/drive from Beaufort office, services list, local landmarks reference (light touch), FAQ, CTA. Unique copy per town (no thin duplicates).

## ABOUT — /about
Story since 2002 · Meet the owner (full) · Our values (4 pillars) · Our caregivers (grid) · Licensed & insured panel · Community (Lowcountry photos) · CTA

## REVIEWS — /reviews
Rating summary · filter chips by service · review grid · "Leave a review" link (Google) · video testimonial slots

## FOR PROFESSIONALS — /for-professionals
Who we help · what we do / don't do · fast referral form (07) · fax (866) 502-3509 + phone · response-time promise `[[TO CONFIRM]]` · downloadable one-page referral sheet (PDF later) · coordination with hospice/palliative/home health teams

## CAREERS — /careers
Why work at Dawson (owner-run, respect, flexible shifts `[[TO CONFIRM]]`) · caregiver quotes · roles · **Apply on Hireology** (external link, opens in same tab with clear label) · CTA

## FAQ — /faq
Grouped: Getting started · Services · Cost & payment · Caregivers · Safety & trust · Hospice & medical questions. `FAQPage` schema. Search box filters questions live.

## FREE ASSESSMENT — /free-assessment
Multi-step form (07), reassurance side panel (what happens next, owner photo, "No obligation"), office status, call alternative.

## CONTACT — /contact
Contact cards (call, text, email, fax, visit) · map with directions · office hours + Care 24/7 · one short contact form

## LEGAL — /privacy-policy, /sms-terms, /accessibility
Plain-language, readable layout, table of contents, last-updated date (see 09).

## THANK YOU — /thank-you
"Thank you, {first name}." What happens next timeline · office-status-aware message (open: "we'll call within [[TO CONFIRM]] hours" / closed: "first thing next business day") · while you wait: How It Works, FAQ.

## 404
Friendly illustration (the house with a lit porch light): "This page wandered off." Links: Home, Care, Contact, Call.
