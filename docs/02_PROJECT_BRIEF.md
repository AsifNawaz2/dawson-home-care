# 02 — PROJECT BRIEF: Dawson and Dawson Home Care website rebuild

## The client
- **Legal name:** Dawson and Dawson Home Care LLC
- **Brand name on site:** Dawson & Dawson Home Care
- **What they do:** Non-medical in-home care — personal care, home help, companionship, respite, 24-hour care
- **Where:** 69 Robert Smalls Parkway, Suite 3F, Beaufort, SC 29906 — serving Beaufort and the greater Lowcountry
- **Since:** 2002 (current site also says "over 22 years in the health and homecare field")
- **Model:** Owner-run and operated; the owner personally visits and works with every client
- **Current site:** WordPress + Elementor, forms via LeadConnector (GoHighLevel), careers via Hireology

## Why we're rebuilding
The current site is a generic template: stock photos, broken footer links, a contradiction between "24/7" and "Mon–Fri 8–5", failing color contrast for an older audience, muddled service names, zero proof (no reviews, no owner, no real people). It looks like every other home care site — and worse than the national franchises it competes with.

## The goal
Make dawsonhomecare.com **the best home care website in the Lowcountry** — and one of the best in the US home care industry:
1. **Luxury, story-driven experience** — scroll storytelling, meaningful animation, visuals that explain themselves, an interactive logo and cursor. It should feel premium and calm, like a boutique hotel for care.
2. **Effortless to use** — a worried family member can understand the options, see the cost, trust the people and call in under 60 seconds, on a phone, with big readable text.
3. **Lead generation** — more free-assessment requests, more calls, more referrals from hospitals/discharge planners, more caregiver applicants.

## Audiences (in priority order)
1. **Adult children (45–65)** arranging care for a parent — often remote, stressed, researching at night on mobile. Need: clarity, trust, cost, speed.
2. **Seniors themselves (65+)** — need: large text, high contrast, simple navigation, dignity (never talk down).
3. **Referral sources** — hospital discharge planners, case managers, social workers, hospice/palliative teams, physicians' offices. Need: fast referral form, fax, response time, what Dawson does and doesn't do.
4. **Caregiver job seekers** — need: why work here, open roles (Hireology), easy apply.

## Positioning
**"Local. Owner-run. Here since 2002."**
The national franchises (Home Instead, Right at Home, FirstLight, ComForCare, Home Helpers…) out-spend Dawson. Dawson wins on being *human and local*: the owner personally meets every family, the office is in Beaufort (most franchises serve Beaufort from Bluffton/Hilton Head), and the same family-run agency has been here for over two decades.

**Brand promise (working):** *Care that feels like family — because it is run by one.*
**Proof pillars:**
1. The owner visits every client personally
2. Since 2002 in the Lowcountry
3. Care around the clock, 7 days a week
4. Experienced, passionate caregivers (incl. Certified Nursing Assistants — per their current About page)
5. Regular follow-ups and check-ins

## Creative vision
- **Story first:** the homepage is a scroll story — from a family's worry → to understanding → to trust → to a phone call.
- **Signature moment:** "The Dawson House" — an illustrated house where each room lights up as you scroll, each room = a service (see 07).
- **Luxury cues:** generous whitespace, warm cream background, deep plum, editorial serif headlines, soft orchid glow, slow confident motion, real photography (later).
- **Meaningful visuals over paragraphs:** icons, illustrations, timelines, maps, counters, before/after moments — words only where they earn it.

## Success criteria
- Lighthouse: Performance ≥ 90 mobile, Accessibility 100, Best Practices ≥ 95, SEO 100
- WCAG 2.2 AA, verified
- Primary CTA (Free Care Assessment) and Call visible at all times on mobile
- Every form lands in GoHighLevel with consent data
- All old URLs 301-redirected — no lost Google rankings
- Client reaction at reveal: "This is us — but finally done right."

## Build approach
- Built on **localhost** with **placeholders** for all photos, video, reviews and unconfirmed facts
- **Next.js** (App Router) + TypeScript + Tailwind + GSAP/Motion + Lenis
- Strategy & copy in the Claude Project → mockups in Claude Design → build in Claude Code → hosting decided later (Vercel recommended)
- WordPress/CMS question is parked until after design + build
