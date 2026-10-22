# SPEC_FEATURES — Interactive features, developer spec

**Status:** Final for build (19 Oct 2026). Hand this to Claude Code.
**Covers:** every feature in `07_INTERACTIVE_FEATURES.md` (§1–§20), plus the Home scenes that 06 describes but 07 doesn't number (The Moment, Since 2002 counter, hero, 404 porch light).
**Sources:** 03, 06, 07, 08, 09, BRAND_FINAL.md, COPY_HOME.md, COPY_CONVERSION.md, COPY_COST_FAQ.md, COPY_AREAS.md, COPY_TRUST.md.

**Precedence:** BRAND_FINAL.md › 03 for every color, size, contrast, logo and cursor rule. COPY_*.md for every user-facing string (verbatim). **This file for behavior** — components, props, states, timelines, keyboard, screen reader, reduced motion and acceptance. Where this file restates a BRAND_FINAL number, BRAND_FINAL wins if they ever differ. Strings that no COPY file provides are listed in **Appendix B** as *proposed* — they need approval before they're final.

**Template per feature:** Component · Props · Data · States · Layout · Animation timeline · Mobile · Keyboard & screen reader · Reduced motion · Acceptance criteria.

---

## Contents

0. Global motion & interaction system
1. The Moment scene (Home ch. 2)
2. The Dawson House (07 §3)
3. How-It-Works heartbeat line (07 §4)
4. Care Quiz (07 §1)
5. Cost Estimator (07 §2)
6. Service-Area Map (07 §5)
7. Interactive logo (07 §15)
8. Interactive cursor (07 §16)
9. Page transitions (07 §19)
10. Payment Explorer (07 §6)
11. Reviews marquee & grid (07 §7)
12. Meet-the-Owner video (07 §8)
13. Caregiver carousel (07 §9)
14. Sticky mobile action bar (07 §10)
15. Office-status chip & after-hours mode (07 §11)
16. Free Care Assessment form (07 §12)
17. Referral & contact forms (07 §13)
18. FAQ live search (07 §14)
19. Comfort controls (07 §17)
20. Scroll storytelling system (07 §18) — reveals, hero, chapter progress, Since 2002 counter
21. Micro-interactions (07 §20) — buttons, cards, checklists, form success, 404
- Appendix A — 07 → spec map
- Appendix B — Strings not in approved copy (proposed)
- Appendix C — Test matrix
- Spec decisions (deviations from 06/07, with reasons)

---
---

# 0. Global motion & interaction system

Everything below is shared. Build it first; every feature depends on it.

## 0.1 Who animates what

| Job | Tool | Why |
|---|---|---|
| Scroll-scrubbed scenes, pinning, SVG stroke drawing tied to scroll | **GSAP + ScrollTrigger** | Precise scrub, pin spacing, refresh on resize |
| One-off timelines (logo intro, compact header, map ripple, success check) | **GSAP** | Exact ms timelines from BRAND_FINAL |
| Component enter/exit (quiz steps, form steps, card swaps, accordion height, tab panels) | **Motion** (`motion/react`) | `AnimatePresence`, layout animation, React-state driven |
| Page transitions (curtain) | **Motion** | Lives in React state with the router |
| Hover/focus micro-states, logo hover, footer pulse, marquee | **CSS** (transitions/keyframes) | No JS cost; restart on each hover for free |
| Smooth wheel scroll | **Lenis** | Light (`lerp: 0.1`); off in reduced motion |
| Carousels | **Embla** | Accessible, light |
| Line splitting | **GSAP SplitText** (`type: "lines"`, `mask: "lines"`) | Free with GSAP; line-level only |

**Animate only** `transform`, `opacity`, `clip-path`, `stroke-dashoffset`, and `fill`/`fill-opacity` on small SVG shapes. Never `width`/`height`/`top`/`left` on page content (the cursor ring is the one documented exception, BRAND_FINAL §4.2).

**Loading:** GSAP, ScrollTrigger and SplitText load per chapter via `await import("@/lib/gsap")` inside `useEffect`. `lib/gsap.ts` registers plugins once. Home first-load JS budget ≤ 200KB gzipped (08 §7).

```ts
// lib/gsap.ts
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
gsap.registerPlugin(ScrollTrigger, SplitText);
gsap.defaults({ ease: "dd.outExpo" });
// Custom eases matching BRAND_FINAL tokens
import { CustomEase } from "gsap/CustomEase";
gsap.registerPlugin(CustomEase);
CustomEase.create("dd.outExpo", "0.22,1,0.36,1");
CustomEase.create("dd.inOut", "0.65,0,0.35,1");
export { gsap, ScrollTrigger, SplitText };
```

## 0.2 Motion tokens (from BRAND_FINAL §2a — do not add new ones)

| Token | Value | Use |
|---|---|---|
| `--ease-out-expo` / `dd.outExpo` | `cubic-bezier(0.22, 1, 0.36, 1)` | Entrances, reveals, state changes |
| `--ease-in-out` / `dd.inOut` | `cubic-bezier(0.65, 0, 0.35, 1)` | Transitions, exits, stroke draws |
| `--dur-micro` | 200ms | Hover, press, toggles, checks |
| `--dur-ui` | 360ms | Card swaps, step enters, panel changes |
| `--dur-reveal` | 750ms | Scroll reveals |
| Exit duration | 200ms | Everything that leaves (always shorter than its entrance) |
| Text line stagger | 80ms | SplitLines (03 §5) |
| Line rise | 24px | Text and card reveals (03 §5) |

Motion's `transition` objects use `ease: [0.22, 1, 0.36, 1]` or `[0.65, 0, 0.35, 1]` — define them once in `lib/motion.ts` as `EASE_OUT` and `EASE_IN_OUT`.

## 0.3 Motion mode — one source of truth

Reduced motion = OS `prefers-reduced-motion: reduce` **or** Comfort Controls `html[data-motion="reduce"]`.

```ts
// lib/motionMode.ts
export type MotionMode = "full" | "reduced";
// useMotionMode(): useSyncExternalStore over
//   - matchMedia("(prefers-reduced-motion: reduce)") change events
//   - MutationObserver on <html> attributes ["data-motion"]
// getServerSnapshot() → "reduced"   (server + no-JS render the static layouts)
```

- **Server and first paint are always the reduced/static layout.** The client upgrades after hydration. Scenes sit below the fold, so the upgrade never shifts visible content.
- Every GSAP scene is created inside `gsap.context()` in a component **keyed by `mode`**. When the mode flips (Comfort Controls toggle), the component remounts and `ctx.revert()` removes every inline style, pin spacer and ScrollTrigger. No reload.
- Lenis is created only in `full` mode and destroyed on flip (`lenis.destroy()`, native scroll returns).
- CSS uses the `reduce-motion:` Tailwind variant from BRAND_FINAL §2b for transitions.

## 0.4 Layout mode for scroll scenes

```ts
// lib/sceneMode.ts
export type SceneMode = "scene" | "mobile" | "static";
// static  → motion is "reduced" (any width), or JS not yet hydrated
// scene   → motion "full" AND matchMedia("(min-width: 1024px) and (min-height: 640px)")
//           AND NOT (textScale >= 1.25 AND innerHeight < 760)
// mobile  → everything else (motion "full", narrow or short viewport)
```

Re-evaluated on `resize` (debounced 200ms), on Comfort Controls changes, and on orientation change. A change remounts the scene (same keying as 0.3).

## 0.5 Lenis + ScrollTrigger wiring (`components/motion/SmoothScroll.tsx`)

```ts
const lenis = new Lenis({ lerp: 0.1, smoothWheel: true, syncTouch: false });
lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((t) => lenis.raf(t * 1000));
gsap.ticker.lagSmoothing(0);
// Expose via context: useLenis() → lenis | null (null in reduced mode)
```

- Touch scrolling stays native (`syncTouch: false`). Keyboard scrolling (Space, Page Down, arrows) stays native — Lenis doesn't intercept it.
- `scrollTo` helper: `scrollToTarget(el | y, { offset: -headerHeight })` uses Lenis when present, `window.scrollTo` otherwise; `immediate: true` in reduced mode.
- After fonts load (`document.fonts.ready`), after Comfort text-size changes and after route changes: `ScrollTrigger.refresh()`.

## 0.6 Rules for pinned scenes (The Moment, The Dawson House)

1. **≤ 150vh of scroll per pin** (03 §5). `end: "+=150%"`.
2. **Start below the sticky header:** `start: () => \`top top+=${headerHeight()}\``; the pinned element's height is `calc(100svh - var(--header-h))`.
3. **No snapping, no scroll velocity tricks, no wheel capture.** Space and Page Down work natively and leave the scene normally.
4. **Visible progress inside the scene** ("1 of 5", "Room 1 of 5") — `aria-hidden`, the DOM order carries the meaning.
5. **A skip link at the top of every pinned scene** (strings in COPY_HOME).
6. **`scrub: 0.5`** (half-second smoothing). Text swaps are discrete (triggered by progress thresholds, not scrubbed opacity) wherever a half-faded sentence would be hard to read.
7. **No `visibility: hidden` / `display: none` on scene text.** Only `opacity`, so screen readers always get the full content in DOM order.
8. `anticipatePin: 1`, `invalidateOnRefresh: true`.

## 0.7 Z-index scale (`styles/globals.css`)

| Layer | z-index |
|---|---|
| Page content | 0–10 |
| Jump bar (paying-for-care) | 80 |
| Sticky header | 100 |
| Mobile action bar | 200 |
| Comfort Controls button + panel | 210 |
| Modals / dialogs | 500 |
| Page-transition curtain | 9000 |
| Cursor ring | 9999 |
| Skip links (when focused) | 10000 |

## 0.8 Shared primitives (`components/motion/*`, `components/ui/*`, `lib/*`)

| Primitive | Contract |
|---|---|
| `HeartbeatPath` | `buildHeartbeatPath(nodes, opts) → { d, nodeFractions }`. Builds the signature EKG path (flat → small bump → sharp peak → dip → flat) through given points; returns each node's fraction along the path length so progress can light nodes exactly. All drawn paths use `pathLength="1"`. |
| `HeartbeatProgress` | Horizontal heartbeat progress line (quiz, assessment form, success check). Props `{ value: 0..1; complete?: boolean }`. Track: 1.5px `muted`. Fill: 2.5px `plum-800` (BRAND_FINAL §1.4 #16). `complete` → heartbeat-to-check morph (§21.4). |
| `Reveal` | IntersectionObserver reveal wrapper (§20.1). |
| `SplitLines` | Line-by-line heading/paragraph reveal (§20.1). |
| `LiveRegion` | `useAnnounce()` → `announce(text, "polite" | "assertive")`. One polite and one assertive region mounted in the site layout. Clears after 1s so repeated messages re-announce. |
| `SkipLink` | Visually hidden until focused; `href="#id"`; on activation moves focus to the target (`tabindex="-1"` added if needed) and scrolls with header offset. |
| `useSessionState(key, initial)` | sessionStorage-backed state; every read/write in `try/catch`; on failure behaves as plain state (COPY_CONVERSION §8.3: "sessionStorage unavailable — no message"). |
| `useLocalPref(key)` | Same, localStorage (Comfort Controls only). |
| `useOfficeStatus()` | §15. |
| `usePageTransition()` | §9 — `navigate(href)` for programmatic navigation (form success, quiz CTA). |

## 0.9 Pre-paint head script (`app/layout.tsx`, inline, before any CSS-dependent paint)

Sets Comfort preferences and the logo-intro flag so nothing flashes.

```html
<script>
(function () {
  var d = document.documentElement;
  try {
    var c = JSON.parse(localStorage.getItem("dawson.comfort.v1") || "{}");
    if (c.textScale) d.style.setProperty("--text-scale", String(c.textScale));
    if (c.contrast === "high") d.dataset.contrast = "high";
    if (c.motion === "reduce") d.dataset.motion = "reduce";
  } catch (e) {}
  var reduce = d.dataset.motion === "reduce" ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  try {
    if (!reduce && !sessionStorage.getItem("dd:logo-intro")) {
      sessionStorage.setItem("dd:logo-intro", "1");
      d.dataset.logoIntro = "play";
      // Failsafe: never leave the logo invisible if JS fails to boot
      setTimeout(function () { delete d.dataset.logoIntro; }, 3000);
    }
  } catch (e) { /* storage blocked → no intro, ever (BRAND_FINAL §3.3A) */ }
})();
</script>
```

## 0.10 Global acceptance criteria (apply to every feature)

1. Every interactive element reachable and operable by keyboard alone; visible focus ring per BRAND_FINAL §1.5.
2. With `page.emulateMedia({ reducedMotion: "reduce" })` **and** separately with Comfort "Reduce motion" on: no pinned elements (`.pin-spacer` count = 0), no GSAP tweens running after load (`gsap.globalTimeline.getChildren(true, true, false).filter(t => t.isActive()).length === 0`, exposed as `window.__ddGsap` in dev/test only), no CSS animations with `animation-iteration-count: infinite`.
3. axe: zero violations on every page at 320 / 390 / 768 / 1280 / 1440 widths, in full and reduced mode.
4. Touch targets ≥ 48×48px (exceptions documented per feature, always with an equivalent control).
5. Nothing flashes more than 3 times per second; no auto-moving content longer than 5s without a pause control.
6. Text at 200% browser zoom and at Comfort 125%: no clipped or overlapping text; scenes fall back to `static`/`mobile` if they don't fit (0.4).
7. CLS < 0.05 on every page (08 §7); INP < 200ms during every interaction in this file.

---
---

# 1. The Moment scene — Home ch. 2

**Purpose:** name the family's worry, then release it: "You don't have to figure this out alone." Empathy before selling.

## 1.1 Component

`components/home/TheMoment.tsx` (client) · illustrations `components/home/moment/MomentIllo1–5.tsx` (inline SVG components).

```ts
type TheMomentProps = {
  id: "the-moment";
  eyebrow: string;                       // "01 — The moment"
  heading: string;                       // "It usually starts with a moment."
  lines: [string, string, string, string, string];
  resolution: string;                    // "You don't have to figure this out alone."
  followUp: string;                      // "We've helped Lowcountry families through moments like these since 2002."
  link: { label: string; href: "#how-we-help" }; // "See how we can help ↓"
  skipLabel: string;                     // "Skip to how we help"
  progressLabel: (n: number) => string;  // n => `${n} of 5`
};
```

**Data:** `content/copy/home.ts` → `moment` (COPY_HOME ch. 2, verbatim).

## 1.2 DOM (same in every mode — only CSS/JS changes)

```html
<section id="the-moment" aria-labelledby="moment-h2" data-chapter="01">
  <a class="skip-link" href="#how-we-help">Skip to how we help</a>
  <div class="moment-pin">                       <!-- pinned in scene mode -->
    <p class="eyebrow">01 — The moment</p>
    <h2 id="moment-h2">It usually starts with a moment.</h2>
    <div class="moment-stage">
      <div class="moment-illos" aria-hidden="true">  <!-- 5 SVGs stacked in one grid cell -->
      <ol class="moment-lines">                     <!-- 5 <li>, stacked in one grid cell in scene mode -->
      <p class="moment-progress" aria-hidden="true">1 of 5</p>
      <p class="moment-resolution">You don't have to figure this out alone.</p>
    </div>
  </div>
  <p class="lead">We've helped Lowcountry families …</p>
  <a href="#how-we-help">See how we can help ↓</a>
</section>
```

- Lines and illustrations stack with CSS grid (`grid-area: 1/1`), never absolute positioning — the stage height is the tallest line, so nothing clips at 125% text size.
- Type: lines `text-h1` Fraunces 500, `ink`; resolution `text-display-l` Fraunces 500, `plum-800`. Surface: cream.
- Desktop layout: lines left (6/12 columns), illustration right (5/12), progress under the lines, resolution centered across the stage when it arrives.

## 1.3 Illustrations

Five line drawings per COPY_HOME (pill organizer · bath mat and grab bar · armchair by a half-curtained window · phone with a long road behind · mug and clock at 11 PM).
- 2px `plum-800` strokes, `stroke-linecap/join: round`, every path `pathLength="1"`. Fills: solid `orchid-100`, `plum-100`, `leaf-100` or `cream` only (no alpha).
- ≤ 6KB each, viewBox `0 0 480 400`, `aria-hidden="true"`, `focusable="false"`.
- 06 asks for illustrations that "morph between moments": implemented as a **draw hand-off** — the outgoing drawing un-draws forward while the incoming one draws in. Reads as a morph without fragile path-morphing (see Spec decisions).

## 1.4 Animation timeline — `scene` mode

**ScrollTrigger:** `trigger: .moment-pin` · `start: top top+=header` · `end: +=150%` · `pin: true` · `scrub: 0.5` · `anticipatePin: 1`.

Timeline length = **10 units** (1 unit = 15vh of scroll). Slot starts `a = [0, 1.7, 3.4, 5.1, 6.8]`, resolution at 8.5.

| Units | Element | Property | Ease |
|---|---|---|---|
| (on enter, not scrubbed) | Line 1 + Illo 1 | Line 1: opacity 0→1, y 24→0, 750ms. Illo 1 paths: dashoffset 1→0, 900ms, stagger 40ms. Fires once when the section top reaches 70% of the viewport | outExpo / inOut |
| 1.4 → 1.8 | Line 1 | opacity 1→0, y 0→−16 | inOut |
| 1.4 → 1.8 | Illo 1 | dashoffset 0→−1 (un-draws forward), opacity 1→0 | inOut |
| 1.6 → 2.1 | Line 2 | opacity 0→1, y 24→0 | outExpo |
| 1.6 → 2.2 | Illo 2 | dashoffset 1→0, stagger 0.04 units | inOut |
| 3.1 → 3.5 / 3.3 → 3.8 | Line 2 out / Line 3 in (+ illos, same pattern) | as above | |
| 4.8 → 5.2 / 5.0 → 5.5 | Line 3 out / Line 4 in | as above | |
| 6.5 → 6.9 / 6.7 → 7.2 | Line 4 out / Line 5 in | as above | |
| 8.2 → 8.6 | Line 5 + Illo 5 + progress | opacity → 0 | inOut |
| 8.4 → 9.2 | Resolution | opacity 0→1, y 24→0 | outExpo |
| 8.8 → 9.6 | Heartbeat divider under the resolution | dashoffset 1→0 (orchid-500, 3px) | inOut |
| 9.6 → 10 | — | hold | |

- **Progress text** ("n of 5") is set in `onUpdate` from the slot index — text swap, not tween.
- Overlap of 0.2 units between outgoing and incoming lines = "each fades as the next arrives" (COPY_HOME).
- After the pin releases, the lead line and link reveal with `Reveal` (§20.1).

## 1.5 Mobile mode (< 1024px or short viewport, motion full)

No pin. The `<ol>` renders as a normal vertical list: each `<li>` = small illustration (96px, left) + line (`text-h2`).
- Each item reveals once at 30% visibility: opacity 0→1, y 24→0, 750ms outExpo; its illustration draws 900ms (stagger 40ms). Items reveal independently as they scroll in.
- Resolution reveals the same way, then its heartbeat divider draws (800ms).
- Progress text hidden (`display: none` is fine here — it's `aria-hidden` decoration).

## 1.6 Keyboard & screen reader

- No focusable elements inside the pinned stage, so focus can never be "inside" a pin.
- Skip link is the first focusable in the section → `#how-we-help` (focus moves to that section's H2).
- Screen readers read: eyebrow, H2, the list of 5 lines (an `<ol>`, "list, 5 items"), resolution, follow-up, link. Same in every mode.
- Space / Page Down move through the pin natively (~2 presses).

## 1.7 Reduced motion (`static`)

COPY_HOME: "all five lines render as a plain list, then the resolution and follow-up line. Same order, no pinning." Illustrations show fully drawn at 96px beside each line. No reveals, no divider draw (divider static).

## 1.8 Acceptance criteria

1. Desktop 1280×800: pin lasts exactly 150vh (measure `.pin-spacer` padding = 1.5 × viewport height); five lines appear in order, one visible at a time apart from the 0.2-unit cross-over; resolution stays on screen at the end of the pin.
2. Scroll back up: the scene reverses exactly (scrubbed).
3. Line 1 is visible the moment the pin starts — never an empty stage.
4. All 5 lines + resolution are in the accessibility tree at all scroll positions (axe tree snapshot; no `visibility:hidden`/`display:none` on them).
5. Pressing Tab from the previous chapter lands on "Skip to how we help"; Enter moves focus to the Dawson House H2.
6. 390×844: no pin, list items reveal one by one; reduced mode: plain list, everything visible on load.
7. Comfort text size 125% at 1280×720: scene falls back to `mobile` mode (rule 0.4) and nothing clips.
8. No line is ever shown at between 10% and 90% opacity for longer than 0.4 units of scroll (no lingering half-faded text).

---
---

# 2. The Dawson House — Home ch. 3 (07 §3, signature)

**Purpose:** show every kind of help "under one roof" in one picture, and make each room a door to its service page.

## 2.1 Components

```
components/home/DawsonHouse/
  DawsonHouse.tsx     client; picks scene | mobile | static
  HouseSvg.tsx        inline SVG; rooms as <a> groups (scene/static) or <g> (mobile)
  RoomCard.tsx        label card (service name, promise, small label, link text)
  RoomCarousel.tsx    mobile Embla carousel of RoomCards
  rooms.ts            room → service mapping + geometry anchors
```

```ts
type RoomId = "bathroom" | "kitchen" | "porch" | "bedroom" | "living";
type Room = {
  id: RoomId;
  order: 1 | 2 | 3 | 4 | 5;             // scroll order: bathroom, kitchen, porch, bedroom, living
  service: ServiceSlug;                  // personal-care | home-help | companionship | 24-hour-care | respite-care
  name: string;                          // "Personal Care" (H3)
  promise: string;                       // COPY_HOME ch. 3 table, verbatim
  smallLabel: string;                    // "Also called: help with daily living (ADLs)"
  linkText: "See how we help";
  href: `/care/${ServiceSlug}`;
  ariaLabel: string;                     // COPY_HOME "Room link aria-labels", verbatim
  camera: { x: number; y: number };      // room center in viewBox units (for camera drift)
};

type DawsonHouseProps = {
  id: "how-we-help";
  eyebrow: string;                       // "02 — How we help"
  heading: string;                       // "Every kind of help, under one roof."
  sublineScene: string;                  // "Scroll through the house. Each room is one way we help."
  sublineTap: string;                    // "Tap a room to see how we help."
  skipLabel: string;                     // "Skip to the next section"
  svgTitle: string;                      // COPY_HOME <title>
  rooms: Room[];
  footnote: string;                      // "Most families combine two or three. …"
  nonMedicalLine: string;
  hospiceLine: Pending;                  // renders only with NEXT_PUBLIC_SHOW_PLACEHOLDERS=true
  cta: { label: "See all care services"; href: "/care" };
};
```

**Data:** `content/copy/home.ts` → `dawsonHouse` (COPY_HOME ch. 3) + `content/services.ts` (slugs, hrefs). `hospiceLine` uses the `pending()` block from `content/blocks.ts`.

## 2.2 The illustration (`HouseSvg.tsx`)

viewBox `0 0 1200 760`. Single-weight line art: 2px `plum-800` strokes, round caps/joins, solid token fills only (`cream`, `white`, `plum-100`, `orchid-100`, `leaf-100`). `aria-hidden` on all decoration.

**Composition (left → right):**
- **Live oak** (x 20–330): broad low limbs reaching toward the house, Spanish moss as 1.5px `plum-800` strands, canopy fill `leaf-100`.
- **Raised Lowcountry cottage** on short piers (x 300–1000), **tin roof** with standing-seam lines (fill `plum-100`), cut-away front wall so four rooms show side by side: **Bedroom** (x 320–480; bed, lamp, window with crescent moon) · **Bathroom** (x 480–600; walk-in shower, grab bar, towel, bath mat) · **Living room** (x 600–820; sofa with a family member resting, side lamp, framed photo) · **Kitchen** (x 820–980; counter, stove, kettle, small weekly pill organizer).
- **Porch** (x 980–1150): roof extension, railing, **two rocking chairs**, a small table with two glasses, ceiling fan.
- Ground line y 700 with marsh-grass tufts.

**Each room = one group:**

```html
<a href="/care/personal-care" class="room" data-room="bathroom"
   aria-label="Personal Care: help with bathing, dressing and getting around. Opens the Personal Care page."
   data-cursor-label="Open">
  <ellipse class="room-glow" />        <!-- orchid-500, fill-opacity .3, pre-blurred (feGaussianBlur 18) -->
  <rect class="room-bg" />             <!-- the room's interior fill (state) -->
  <g class="room-details">…</g>        <!-- furniture, strokes -->
  <g class="room-light">…</g>          <!-- lamp light / moon glow / window light, opacity 0 at rest -->
  <rect class="room-focus" />          <!-- focus ring drawn in SVG, see 2.7 -->
</a>
```

**Room states** (state is never color-only — the label card and progress text carry meaning; color here is decorative):

| State | `room-bg` fill | `room-light` | `room-glow` | Outline |
|---|---|---|---|---|
| `unlit` (not reached yet) | `plum-100` | opacity 0 | opacity 0 | 2px |
| `active` (current room) | `white` | opacity 1 | opacity 1 (= orchid-500 at 30%) | 3px |
| `visited` (already passed) | `cream` | opacity 1 | opacity 0 | 2px |
| `hover` / `focus` (scene + static) | `white` | opacity 1 | opacity 1 | 3px |
| `all-lit` (end of scene, static mode) | `white` | opacity 1 | opacity 0 | 2px |

Glow is BRAND_FINAL's approved decorative alpha ("room glow"). Animate glow **opacity only** — never the blur.

## 2.3 Layout — scene mode (≥ 1024 × 640, motion full)

Pinned element `.house-pin` (height `calc(100svh - var(--header-h))`):
- **Left column (5/12):** eyebrow · H2 · subline (scene) · **RoomCard** (the active room) · progress "Room n of 5" + 5 small dots (`aria-hidden`).
- **Right column (7/12):** `HouseSvg` inside a `.camera` group.
- After the pin: footnote, non-medical line, hospice line (placeholder mode only), ghost button **See all care services** (`data-cursor-label="View"`).

**RoomCard (scene):** white card, `--radius-card`, 1px `line` border. Contents: H3-styled service name (`text-h3`, `plum-800`), promise (body, `ink`), small label (16px, `muted`), "See how we help →" (`orchid-700`, underlined, styled text — not a link in scene mode).
The card is `aria-hidden="true"` and contains **no focusable elements** — the room links carry the same content (2.7). The whole card is pointer-clickable (`onClick → navigate(activeRoom.href)`), with `data-cursor data-cursor-label="Open"`.

## 2.4 Animation timeline — scene mode

**Entrance (not scrubbed, once):** when the section top reaches 75% of the viewport — house strokes draw (dashoffset 1→0, 1200ms inOut, stagger 30ms by group: oak → roof → walls → rooms → porch); eyebrow/H2/subline `SplitLines` reveal.

**ScrollTrigger:** `trigger: .house-pin` · `start: top top+=header` · `end: +=150%` · `pin: true` · `scrub: 0.5`.

Timeline = **10 units** (1 unit = 15vh). Room windows `a = [0.6, 2.4, 4.2, 6.0, 7.8]`, each 1.8 units.

| Units | What happens | Property | Ease |
|---|---|---|---|
| 0 → 0.6 | Everything `unlit`; card shows Room 1 (so the card is never empty) | — | |
| a_i → a_i + 0.4 | Room i → `active` | `room-bg` fill (plum-100→white) via fill crossfade of two stacked rects; `room-light` opacity 0→1; `room-glow` opacity 0→1 | inOut |
| a_i + 1.8 → a_i + 2.1 | Room i → `visited` (as room i+1 lights) | glow 1→0; `room-bg` white→cream | inOut |
| 9.4 → 9.8 | All rooms → `all-lit` together; footnote is next on scroll | every `room-bg` → white; every `room-light` 1 | inOut |
| 9.8 → 10 | hold | | |

**Discrete updates (in `onUpdate`, with 0.1-unit hysteresis so tiny scroll jitter doesn't flip back and forth):**
- `activeRoom = rooms[i]` where `a_i ≤ progress < a_{i+1}`.
- RoomCard swap: Motion `AnimatePresence mode="wait"` — exit opacity 1→0, y 0→−8, 200ms inOut; enter opacity 0→1, y 12→0, 360ms outExpo.
- Progress text "Room i of 5" + dot i filled (`plum-800`; unfilled dots 1.5px `muted` ring).

**Camera drift (focus, not spectacle):** on `activeRoom` change, `gsap.to(".camera", { x, y, scale: 1.06, duration: 0.9, ease: "dd.inOut", overwrite: true })` centering the active room by ≤ 6% of the viewBox. At `all-lit` the camera returns to `scale: 1, x: 0, y: 0` (900ms). Max scale 1.06 — never crops a room out of view.

## 2.5 Hover and focus on rooms (scene + static modes)

- Hover / `:focus-visible` → room state `hover` (CSS transitions: fill 200ms, glow opacity 360ms, outExpo). Cursor label **Open**.
- **Hover preview (scene):** pointer over room j shows room j's card (same swap animation) for as long as the pointer is there; on leave, the card returns to the scroll-active room after 200ms. Purpose: the card always describes what a click will open.
- **Focus sync (scene):** when room j's link receives keyboard focus, scroll so room j is the active room:
  `scrollToTarget(st.start + ((a_j + 0.9) / 10) * (st.end - st.start), { duration: 0.6 })` (`immediate` if reduced). Card, camera and progress follow automatically.
- Click / Enter → normal link navigation (page transition §9).

## 2.6 Mobile mode (< 1024px or short viewport, motion full)

07: "house static at top, rooms as swipe cards below, tapping a card highlights its room." COPY_HOME subline: "Tap a room to see how we help."
- House renders static, full width, all rooms `unlit` except the **selected** room (`active` state, glow on). SVG is `aria-hidden="true"`; rooms are `<g>` (not links) with pointer handlers only.
- Below: **RoomCarousel** (Embla: `align: "start"`, `containScroll: "trimSnaps"`, `loop: false`, slide width 86%). Each slide = RoomCard with a **real link** "See how we help →" (`href`, `orchid-700`, underlined) and its H3.
- Embla `select` event → selected room lights (fill/glow transitions 360ms).
- Tapping a room in the SVG → `embla.scrollTo(index)` (and the room lights). Tapping a card body selects its room; tapping its link navigates.
- Arrow buttons (48px, icon) **Previous room / Next room** *(proposed, Appendix B)* + position text "Room n of 5" (COPY_HOME) — visible and announced politely on settle.
- Carousel semantics: container `role="region" aria-roledescription="carousel" aria-label="Rooms in the Dawson House"` *(proposed)*; slides `role="group" aria-roledescription="slide" aria-label="Room n of 5"`.

## 2.7 Keyboard & screen reader

**Scene mode**
- SVG: `<svg role="group" aria-labelledby="house-title">` with `<title id="house-title">` = COPY_HOME title. Decoration groups `aria-hidden`.
- The 5 room `<a>` elements are the only tab stops in the scene, **in scroll order** (bathroom, kitchen, porch, bedroom, living) — DOM order follows scroll order, not visual left-to-right.
- Accessible name = COPY_HOME room aria-label (verbatim). `href` (not `xlink:href`) so the cursor selector `a[href]` matches.
- **Focus ring in SVG:** SVG outlines render inconsistently (Safari), so each room draws its own: `.room-focus` is a rect around the room, `stroke: var(--leaf-500)` 3px with an inner 2px `plum-950` stroke (two rects), `opacity: 0` → `1` on `a:focus-visible`. Matches BRAND_FINAL §1.5 on light.
- Tab order: skip link → room 1…5 → next focusable after the pin (ghost button). Shift+Tab reverses.
- **Skip link** "Skip to the next section" → `#find-the-right-care` (ch. 4 section id).
- The RoomCard is `aria-hidden` (its content is in the room links). Known trade-off: in scene mode the five service names are links, not H3s — see Spec decisions.

**Mobile mode** — SVG hidden from AT; the carousel's H3s and links are the accessible path. Left/Right arrow keys move slides when focus is inside the carousel region.

**Static mode** — see 2.8; the card grid is the accessible path.

## 2.8 Reduced motion / no JS (`static`)

07: "all rooms lit, no pinning, simple grid of 5 cards."
- House static, every room `all-lit`, no camera, no entrance draw. Subline: **Tap a room to see how we help.**
- Below the house: a 5-card grid (3 + 2 on desktop, 1 column < 640px). Each card: H3, promise, small label, **real link** "See how we help →".
- SVG rooms stay `<a>` for pointer users (hover state is instant, no glow fade) but carry `tabindex="-1"`, and the SVG is `aria-hidden="true"` — the grid is the single keyboard/AT path, so there are no duplicate tab stops.
- This is also the server-rendered markup (0.3).

## 2.9 Acceptance criteria

1. 1280×800, full motion: pin lasts 150vh; rooms light in the order Bathroom → Kitchen → Porch → Bedroom → Living; card text always matches the lit room; at the end every room is lit.
2. The card is never empty and never shows two rooms at once; swaps complete in ≤ 560ms (200 out + 360 in).
3. Scrolling back reverses lighting exactly; the card follows.
4. Tab from the skip link visits five room links in scroll order; each focus moves the scene to that room within 600ms and shows the SVG focus ring (leaf + plum-950) clearly around the room.
5. VoiceOver (macOS Safari) and NVDA (Firefox/Chrome) read each room link with the full COPY_HOME aria-label and "link".
6. Hovering a room shows that room's card; leaving restores the scroll-active card; clicking navigates to the right service page.
7. 390×844: no pin; tapping a room scrolls the carousel to its card; swiping the carousel lights the matching room; arrow buttons work by keyboard; position text updates.
8. Reduced mode (OS and Comfort): no pin, all rooms lit, 5-card grid, only the grid links are tab stops (room links have `tabindex="-1"`).
9. No text inside the SVG (all text lives in HTML at ≥ 16px).
10. Glow animates opacity only (Performance panel: no paint storms from filter changes during scrub).

---
---

# 3. How-It-Works heartbeat line — Home ch. 5 (07 §4)

**Purpose:** remove fear of the unknown — five calm steps on the brand's heartbeat line, with step 2 (the owner's free visit) singled out as the Dawson difference.

## 3.1 Component (one component, four uses)

`components/motion/HeartbeatTimeline.tsx`

```ts
type TimelineStep = {
  id: string;
  label: string;                 // "Step 1"
  title: string;                 // H3, e.g. "Call or text us"
  body: string[];                // 1–2 lines (COPY_HOME ch. 5)
  small?: string;                // "(843) 379-3321 · Office hours Monday–Friday, 8 AM–5 PM"
  icon: LucideIconName;          // aria-hidden
  illustration?: string;         // /public/illustrations/steps/*.svg, aria-hidden
  highlight?: {                  // step 2 only
    badge: string;               // "The Dawson difference"
    photo: { src: string; alt: string; placeholderLabel: string; ratio: "3:2" };
  };
  done?: boolean;                // thank-you timeline
  time?: string;                 // service-page "A day with Dawson" (e.g. "Morning")
};

type HeartbeatTimelineProps = {
  steps: TimelineStep[];
  variant: "home" | "full" | "day" | "status";
  // home   → Home ch. 5 (5 steps, alternating on desktop)
  // full   → /how-it-works (same, more body per step)
  // day    → service pages "A day with Dawson" (time labels instead of "Step n")
  // status → /thank-you "What happens next" (static, step 1 done)
};
```

**Data:** `content/timeline.ts` (how-it-works steps, verbatim from COPY_HOME ch. 5 / COPY_TRUST); service days from `content/services.ts`; thank-you from `content/copy/conversion.ts`.

## 3.2 Layout

- Semantics: `<ol class="timeline">` of `<li>`; inside each: "Step n" label (`text-eyebrow`, `orchid-700`, uppercase) → `<h3>` → body → small line. `list-style: none` (the visible label carries the number).
- **Desktop ≥ 1024:** the line runs down the center; odd steps sit left, even steps right, each card's node aligned with its H3's first line.
- **< 1024:** the line runs at `x = 28px`; every card sits to its right.
- **Step 2 card:** `orchid-100` surface, 2px `orchid-500` decorative border, badge **The Dawson difference** (`plum-800` pill, white text 16px 600 — 15.40:1), owner photo placeholder (3:2) under the text, caption below the photo (no text on the photo).
- **Nodes:** 20px circles on the line. Unreached: `white` fill + 2px `muted` ring. Reached: `plum-800` fill + 8px `leaf-500` inner dot (7.67:1 — BRAND_FINAL approved pairing).

## 3.3 The line (SVG overlay)

- `<svg class="timeline-line" aria-hidden="true">` absolutely positioned behind the `<ol>`, sized to it. Two paths sharing one `d`:
  - **Track:** 2px `line`.
  - **Progress:** 3px `orchid-500`, `pathLength="1"`, `stroke-dasharray: 1`, `stroke-dashoffset` scrubbed 1→0.
- `d` is built by `buildHeartbeatPath(nodes)` from measured node centers (ResizeObserver on the `<ol>` and each node; rebuild on resize and font load, then `ScrollTrigger.refresh()`):
  - Straight vertical segments between nodes.
  - At each node a vertical EKG blip, points relative to the node center (dx, dy): (0, −28) → (8, −18) → (−10, −4) → (14, 10) → (−4, 20) → (0, 28). Mirror dx on right-side steps so the blip "leans" toward its card.
  - Returns `nodeFractions[]` — each node's position as a fraction of the total path length (computed from the segment lengths it built), so node lighting is exact.

## 3.4 Animation timeline (full motion)

**Line draw (scrubbed):** ScrollTrigger `trigger: .timeline` · `start: "top 65%"` · `end: "bottom 65%"` · `scrub: 0.4`. Tween: progress path dashoffset 1→0, `ease: "none"` (linear with scroll — the line tip stays near 65% of the viewport height).

**Node lighting (discrete):** in `onUpdate`, node i gets `data-reached="true"` when `progress ≥ nodeFractions[i]`. CSS: fill transition 200ms; scale pop 1 → 1.15 → 1, 300ms outExpo (one time per reach; reversing removes it without a pop).

**Step cards (once each, not scrubbed):** ScrollTrigger per `<li>`, `start: "top 80%"`, `once: true`:

| ms | Element | Property | Ease |
|---|---|---|---|
| 0 → 750 | Card | opacity 0→1; x −24→0 (left cards) / +24→0 (right cards); mobile: y 24→0 | outExpo |
| 150 → 1050 | Step illustration | path dashoffset 1→0, stagger 30ms | inOut |
| 0 → 750 | Step 2 photo placeholder | `clip-path: inset(8%)` → `inset(0)`, scale 1.06→1 (03 §5) | outExpo |

**Variants:**
- `day`: identical behavior; labels show `time` instead of "Step n".
- `status` (/thank-you): **no scroll link.** Line drawn to node 2 on mount (600ms inOut, once), node 1 reached with a leaf-on-plum check icon + the word "Done" (COPY_CONVERSION). Reduced: drawn, no animation.

## 3.5 Mobile

Single column, line at the left, same scrub (start/end percentages unchanged). Cards reveal with y instead of x.

## 3.6 Keyboard & screen reader

- Ordered list read as "list, 5 items"; each item: "Step 1, heading level 3, Call or text us, …".
- SVG, icons, illustrations, nodes: `aria-hidden`. The photo has its alt text (COPY_HOME).
- Links inside steps (phone) are ordinary links; nothing in the timeline is pinned.

## 3.7 Reduced motion

Line fully drawn, every node reached, all cards visible, photo unclipped. No scroll triggers created.

## 3.8 Acceptance criteria

1. Scrolling down draws the line continuously; its tip stays within ±10% of 65% viewport height across the list.
2. Each node turns plum + leaf exactly as the line tip passes it (within 2px), on both desktop and mobile, after resizing the window and after Comfort 125%.
3. Steps alternate left/right on desktop and stack on mobile; step 2 shows the badge, the photo placeholder and its caption below.
4. Scrolling back up un-draws the line and un-lights nodes; cards stay visible (they reveal once).
5. Reduced mode: full line, all nodes lit, no ScrollTriggers (`ScrollTrigger.getAll().length` unaffected by this component).
6. axe: list semantics intact; no focusable SVG.

---
---

# 4. Care Quiz — /find-care + Home ch. 4 teaser (07 §1)

**Purpose:** turn "I don't know what we need" into a suggested plan, then a prefilled free-assessment request. Copy and logic are final in COPY_CONVERSION §9 and `content/quiz.ts` — **this section specifies the UI around that data. Edit copy in `quiz.ts`, never in components.**

## 4.1 Components

```
components/features/CareQuiz/
  CareQuiz.tsx          page component, owns the reducer + storage
  QuizTeaser.tsx        Home ch. 4 (question 1 only)
  QuestionView.tsx      renders one QuizQuestion by kind
  AnswerCard.tsx        single-select button card / multi-select checkbox card
  ResumeBanner.tsx
  ResultScreen.tsx      result layout (primary, also, notes, hours, cost, town, urgency, CTA, email)
  EmailPlanForm.tsx
  useQuizMachine.ts     reducer + persistence
```

```ts
type CareQuizProps = {
  initialTown?: string;          // from ?town={slug}, validated with getArea()
  from?: "home" | "town" | "service" | null;
};
type QuizTeaserProps = { question: CareForQuestion }; // questions[0] from quiz.ts
```

**Data:** `content/quiz.ts` (questions, scoring, `buildResult`, `toGhlFields`, `toAssessmentPrefill`, `estimatorHref`, all UI strings), `content/areas.ts`, `useOfficeStatus()` (§15), `CostEstimator` (§5).

## 4.2 State machine (`useQuizMachine`)

```ts
type Phase =
  | { phase: "boot" }                                     // reading storage (1 frame)
  | { phase: "resume"; saved: SavedQuiz }                 // unfinished quiz found
  | { phase: "question"; step: 1|2|3|4|5; direction: 1|-1 }
  | { phase: "result"; result: QuizResult };

type SavedQuiz = { v: 1; answers: QuizAnswers; step: 1|2|3|4|5; phase: "question" | "result"; savedAt: string };

type Event =
  | { type: "ANSWER_SINGLE"; id: "careFor" | "hours" | "urgency"; value: string }
  | { type: "TOGGLE_NEED"; value: NeedId }
  | { type: "SET_TOWN"; value: string } | { type: "SET_TOWN_OTHER"; value: string }
  | { type: "NEXT" } | { type: "BACK" } | { type: "SHOW_RESULT" }
  | { type: "CHANGE_ANSWERS" }       // → question 1, answers kept
  | { type: "RESTART" }              // → clear storage, question 1, announce restartAnnouncement
  | { type: "RESUME" } | { type: "START_OVER" };
```

- **Storage:** `QUIZ_STORAGE_KEY` (`dawson.quiz.v1`) — written on every state change, debounced 150ms, via `useSessionState`.
- **Boot rules:**
  - `?from=home` and storage holds `careFor` with `step: 2` → go straight to Q2 (no resume banner).
  - Saved `phase: "result"` → open the result directly (with **Change my answers** / **Start over**).
  - Saved `phase: "question"` with any answer → `resume` banner (COPY_CONVERSION §9.1).
  - `?town={slug}` valid → `answers.town` preset (Q5 still asked).
- **Never** put Q2 answers in a URL (09 §2).

## 4.3 Question rendering

Card frame per question: progress (`HeartbeatProgress` + text **Question {n} of 5**) · H2 (question, subject tokens filled) · helper · answers · buttons.

| Kind | Markup | Selection | Advance |
|---|---|---|---|
| `single` (Q1, Q3, Q4) | `<div role="group" aria-labelledby={h2}>` of `<button type="button" aria-pressed>` cards | Click / Enter / Space sets the answer; pressed state = fill `orchid-100` + 2px `plum-800` border + `plum-800` check icon (BRAND_FINAL §1.4 #13) | After **300ms** (copy). Clicks during those 300ms are ignored. Re-entering a question via Back shows the pressed card; activating any card (including the pressed one) advances |
| `multi` (Q2) | `<fieldset><legend><h2>…</h2></legend>` + native `<input type="checkbox">` styled as cards via `<label>` | Native checkbox; same selected styling | **Continue** — `aria-disabled="true"` until ≥ 1 checked (BRAND_FINAL §1.4 #20). Pressing it disabled shows the error (alert pattern) and moves focus to the first checkbox |
| `select` (Q5) | Native `<select>` with `<optgroup>`s from `quiz.ts`; "Somewhere else" reveals **Which town? (optional)** text input (max 60) | Native | **See my suggestion** — same disabled/error behavior |

- Answer cards: min height 72px, full-width on mobile, 2 columns ≥ 640px; line illustration 56px left (`aria-hidden`), label 18px 600, helper 16px `muted`.
- **No arrow-key selection** on single-select groups — buttons, not radios, because auto-advance on arrow keys would skip questions. Tab moves between cards.
- **Back** (text button, Q2–Q5) keeps every answer.

## 4.4 Transitions

| Moment | Animation | Ease | Reduced |
|---|---|---|---|
| Card pressed | check icon scale 0.6→1 + opacity, 200ms; border 200ms | outExpo | instant |
| Question change | `AnimatePresence mode="wait" custom={direction}` — exit: opacity 1→0, x 0→−24·dir, 200ms; enter: opacity 0→1, x 24·dir→0, 360ms | inOut / outExpo | instant swap (no x, no fade) |
| Container height | Motion `layout="size"` on the wrapper, 360ms — no jump between short and tall questions | outExpo | instant |
| Progress line | dashoffset → `1 − n/5` (Q1 = 20%), CSS transition 450ms | inOut | instant |
| "Somewhere else" input | height auto 0→auto 300ms + opacity | inOut | instant |
| Result entry | progress line completes (300ms) → heartbeat-to-check morph (§21.4, 600ms) → result sections stagger 80ms: opacity 0→1, y 24→0, 600ms | outExpo | static check, everything visible |

## 4.5 Focus & announcements

- After every question change: focus the new H2 (`tabindex="-1"`, `preventScroll: true`), then, if the quiz top is above the viewport, scroll it into view with header offset (smooth in full mode).
- Single-select: polite announcement `{answer} selected. Next question.` before the swap.
- Restart: polite `Quiz restarted. Question 1 of 5.`
- Result: focus the result H2.
- Errors: message element `id` referenced by the group's `aria-describedby`; announced via the assertive region once.

## 4.6 Result screen

Order and strings: COPY_CONVERSION §9.4 (verbatim). Build from `buildResult(answers)`.
- **Primary card:** white, 2px `plum-800` border, `--radius-card`; label **Our suggestion** (eyebrow, `orchid-700`) · H3 name · promise · intro · 3 bullets (leaf-on-plum ticks, §21.3) · **Why we suggest this** + reasons · link **See {Service}**.
- **Also helpful:** compact cards (name · one reason · link).
- **Hours to start** + note.
- **What it might cost:** `<CostEstimator variant="compact" source="quiz" preset={answers.hours} />`; hidden for "Not sure yet". Link **Adjust it in the full estimator** → `estimatorHref(answers.hours)`.
- **Town line**, **Urgency block** (closed variant from `useOfficeStatus`), **Next step** CTA — Primary **Get a Free Care Assessment** / after hours **Request a Callback** (§15.4). On click: `sessionStorage[ASSESSMENT_PREFILL_KEY] = toAssessmentPrefill(answers, result)` → `navigate("/free-assessment?from=quiz")`.
- **Email me this plan** (`EmailPlanForm`): react-hook-form + zod (`lib/formMessages.ts`), POST `/api/lead` with `form_type=quiz_plan`, email, first name, all `quiz_*` (`toGhlFields`), consent text + ISO timestamp. For "Just exploring", this block moves above the CTA.
- Footer: **Change my answers** · **Start over**.
- The finished quiz writes `phase: "result"` to storage so the assessment form can add `quiz_*` fields and tag `quiz-completed`.

## 4.7 Home teaser (`QuizTeaser`, ch. 4)

- Renders Q1 only (progress **Question 1 of 5**, H3 per COPY_HOME heading rule — the chapter title is the H2), 4 answer buttons, helper, fallback link **Find the right care → /find-care**.
- On answer: pressed state (200ms) → write `{ v: 1, answers: { ...emptyAnswers, careFor }, step: 2, phase: "question" }` → after 300ms `navigate("/find-care?from=home")` through the page transition.
- No JS: answer buttons are inert; the fallback link works (COPY_HOME).

## 4.8 Mobile

Single column cards, sticky bottom area for **Back / Continue** (above the mobile action bar — the action bar hides while the quiz is in view, §14). Selected state uses border + check, so it's visible without color.

## 4.9 Keyboard & screen reader summary

Tab → answer cards (buttons/checkboxes) → Continue → Back. Enter/Space activate. Q5 select is native. No focus traps. Everything announced as specified in 4.5. Illustrations `aria-hidden`.

## 4.10 Reduced motion

Instant swaps, static progress (still updates), static check on result, result visible at once. Behavior otherwise identical.

## 4.11 Acceptance criteria

1. The five test answer sets in COPY_CONVERSION's `quiz.ts` header produce the documented results (unit tests on `buildResult`; component tests on the rendered result).
2. Single-select: click → pressed state visible → advance after 300ms; double-clicking doesn't skip a question.
3. Q2 Continue is `aria-disabled` until a box is ticked; pressing it disabled shows "Please choose at least one — or choose "Something else."" and focuses the first checkbox.
4. Back from any question keeps all answers; Change my answers returns to Q1 with answers intact; Start over clears storage and announces the restart.
5. Reload mid-quiz → resume banner; reload on the result → result. Storage blocked (Safari private mode simulation) → quiz works, no errors.
6. From Home: tap "My parent" → lands on /find-care at Q2, subject tokens read "your parent".
7. `?town=port-royal` → Q5 preselects Port Royal.
8. Result CTA → /free-assessment?from=quiz with Step 1–3 prefilled and the quiz banner shown.
9. Focus lands on each new H2; VoiceOver announces "{answer} selected. Next question."
10. No URL ever contains a Q2 value (Playwright: collect all navigations, assert no `needs`, `hospital`, `hospice`, etc.).
11. Hospice support never appears as a recommendation unless `NEXT_PUBLIC_SHOW_PLACEHOLDERS=true`.

---
---

# 5. Cost Estimator — /paying-for-care + compact on Home, service pages, quiz (07 §2)

**Purpose:** answer "what will this cost?" honestly — hours first, a price range only when a real rate exists — and hand the numbers to the assessment form.

## 5.1 Components

```
components/features/CostEstimator/
  CostEstimator.tsx     variant: full | compact
  QuickStart.tsx        full only — 4 aria-pressed preset buttons
  HoursControl.tsx      native range + Fewer/More buttons
  DaysStepper.tsx
  OvernightSwitch.tsx
  EstimateOutput.tsx    big number, range lines, disclaimer, live region
  ScaleBar.tsx
  PrefillBanner.tsx     full only
lib/estimate.ts         pure math + formatting (unit-tested)
```

```ts
type PresetId = "few-hours-week" | "few-hours-most-days" | "full-days" | "around-the-clock";
type EstimatorValues = { hoursPerVisit: number; daysPerWeek: number; overnight: boolean; preset: PresetId | "custom" };
type EstimatorSource = "paying-for-care" | "home" | `service:${ServiceSlug}` | "quiz";

type CostEstimatorProps = {
  variant: "full" | "compact";
  source: EstimatorSource;
  initial?: Partial<EstimatorValues>;   // from URL params (full) or service example (compact)
  preset?: HoursId;                      // from quiz Q3; "not-sure" → component not rendered by parent
  serviceSlug?: ServiceSlug;             // carried into the CTA URL
  headingLevel?: 2 | 3;
};
```

## 5.2 Data — `site.config.ts`

```ts
export const rates = {
  rateMin: null as number | null,           // $/hour, illustrative or confirmed
  rateMax: null as number | null,
  overnightRateMin: null as number | null,
  overnightRateMax: null as number | null,
  minimumVisitHours: null as number | null, // slider minimum once confirmed (else 2)
  rateConfirmed: false,                     // false → "Illustrative estimate" badge when prices show
  showPrices: true,                         // false → hours-only mode even with rates set
  rateSource: null as string | null,        // where an illustrative rate came from (shown in "What does this mean?" if set)
};
```

**Price display rule:** prices render only when `showPrices && rateMin !== null && rateMax !== null`. Otherwise **hours-only mode** (COPY_COST_FAQ): range lines replaced by "Your rate is set at your free assessment — every plan is different." Badge **Illustrative estimate** shows whenever prices render and `rateConfirmed === false`.
**Default at build = all `null` → hours-only.** No price is invented (rule 3). See Spec decisions for the options at the reveal.

## 5.3 Math (`lib/estimate.ts`)

```ts
export const WEEKS_PER_MONTH = 4.33;
const roundTo = (n: number, step: number) => Math.round(n / step) * step;
export const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export function estimate(v: EstimatorValues, r: typeof rates) {
  const weeklyHours = v.hoursPerVisit * v.daysPerWeek;               // 2..168
  const overnight = v.overnight && r.overnightRateMin !== null && r.overnightRateMax !== null;
  const min = overnight ? r.overnightRateMin : r.rateMin;
  const max = overnight ? r.overnightRateMax : r.rateMax;
  if (!r.showPrices || min === null || max === null) return { weeklyHours, prices: null };
  const wMin = weeklyHours * min, wMax = weeklyHours * max;
  return {
    weeklyHours,
    prices: {
      weeklyMin: roundTo(wMin, 10), weeklyMax: roundTo(wMax, 10),                       // nearest $10
      monthlyMin: roundTo(wMin * WEEKS_PER_MONTH, 50), monthlyMax: roundTo(wMax * WEEKS_PER_MONTH, 50), // nearest $50, from unrounded weekly
    },
  };
}
export const PRESETS: Record<PresetId, Omit<EstimatorValues, "preset">> = {
  "few-hours-week":      { hoursPerVisit: 3,  daysPerWeek: 2, overnight: false },
  "few-hours-most-days": { hoursPerVisit: 4,  daysPerWeek: 5, overnight: false },
  "full-days":           { hoursPerVisit: 8,  daysPerWeek: 5, overnight: false },
  "around-the-clock":    { hoursPerVisit: 24, daysPerWeek: 7, overnight: true  },
};
export const DEFAULT_VALUES: EstimatorValues = { hoursPerVisit: 4, daysPerWeek: 3, overnight: false, preset: "custom" };
```

`PRESETS` must equal `hoursPresets` in `quiz.ts` (test asserts it).

## 5.4 Controls

| Control | Markup | Behavior |
|---|---|---|
| **Hours per visit** | Native `<input type="range" min={minimumVisitHours ?? 2} max=24 step=1>` + visible `<output>` "{n} hours" + **Fewer hours / More hours** buttons (48px) either side; tick labels 2 · 12 · 24 | `aria-valuetext="{n} hours per visit"`; helper via `aria-describedby`. Native keys: ←/→ ±1, Home/End, PageUp/PageDown. Styling: input height 48px (hit area), transparent native track; a sibling div draws the track (1.5px `muted`) and a fill bar (`plum-800`, `transform: scaleX(fraction)`) — no gradient. Thumb 28px `plum-800` with 2px `white` ring |
| **Days per week** | `role="group"` labelled by the visible label; **Fewer days / More days** buttons + `<output>` "{n} days" | Buttons `aria-disabled` at 1 and 7 |
| **Overnight or 24-hour care** | `<button role="switch" aria-checked>` labelled + described | Off: `muted` track outline + `muted` knob; On: `plum-800` track + `white` knob (BRAND_FINAL §1.5). Knob translateX 200ms outExpo. When on, the note under it appears (COPY_COST_FAQ) |
| **Quick start** (full) | 4 `<button aria-pressed>` with the preset labels | Sets all three controls; any manual change sets `preset: "custom"` and un-presses |

Any change → `preset` updated → output recomputed synchronously (INP < 200ms).

## 5.5 Output

- **Big number** `{weeklyHours}` + "hours a week": Fraunces `text-display-l`, `plum-800`. Count-up from the previous value: Motion `animate(prev, next, { duration: 0.4, ease: EASE_OUT })` writing `textContent`. The animated element is `aria-hidden`; a visually hidden sibling holds the final text "{weeklyHours} hours a week" (instant).
- **Range lines** (prices mode) or **hours-only line**.
- **Scale bar** (`aria-hidden`): track `line` 6px, fill `plum-800`, `scaleX(weeklyHours / 168)` with `transform-origin: left`, transition 360ms outExpo. Labels **A few hours** ↔ **Around the clock** (16px `muted`).
- **Disclaimer** always visible: "Your exact rate is set at your free assessment."
- **Badge** (prices mode, unconfirmed): `orchid-700` on `orchid-100` pill (5.41:1, BRAND_FINAL §1.4 #9) + **What does this mean?** disclosure (full).
- **Live region (polite):** "{weeklyHours} hours a week. About ${weeklyMin} to ${weeklyMax} a week." — or "{weeklyHours} hours a week." in hours-only mode — announced **500ms after the last input**.
- **Hints** (full only, one at a time, polite) per COPY_COST_FAQ.

## 5.6 Variants

| | Full (`/paying-for-care#estimator`) | Compact (Home ch. 10, service pages, quiz result) |
|---|---|---|
| Quick start | Yes | No |
| Prefill banner | Yes (URL params) | No |
| Hints | Yes | No |
| "What does this mean?" | Yes | No (badge only) |
| Controls | Slider, stepper, switch | Same |
| Layout | Controls left, output right (≥ 1024); stacked below | Stacked; output beside controls ≥ 1024 on Home |
| CTA | **Get your exact plan — free assessment** + quiz/ways-to-pay links | Same primary + "Estimate your cost in detail" (Home) / "Adjust it in the full estimator" (quiz) |

## 5.7 State, URLs and hand-offs

- **Full variant reads** `hours` (2–24 int), `days` (1–7 int), `overnight` (0|1), `preset`, `service`, `from`. Out-of-range or malformed → `DEFAULT_VALUES` (clamp, never throw). It does not rewrite the URL while the user edits.
- **sessionStorage** `dawson.estimator.v1`: `{ values, source, updatedAt }`, written debounced 300ms — the assessment form reads it for `estimator_*` fields.
- **CTA URL:** `/free-assessment?hours={h}&days={d}&overnight={0|1}` (+ `&service={slug}`); after hours label **Request a Callback** (§15.4). Home link: `/paying-for-care?from=home&hours=…&days=…&overnight=…#estimator`.
- **GHL fields:** `estimator_hours_per_visit`, `estimator_days_per_week`, `estimator_overnight`, `estimator_weekly_hours`, `estimator_preset`, `estimator_source`.

## 5.8 Mobile

Stacked; slider full width with Fewer/More buttons on the same row; output card directly after the controls (the live region announces changes, so the number doesn't need to stay on screen). All buttons 48px.

## 5.9 Keyboard & screen reader

Native range and buttons; switch announces "on/off"; visible labels on every control; live region debounced so a held arrow key announces once. The big number never announces mid-count.

## 5.10 Reduced motion

No count-up (final value instantly), scale bar and knob change instantly. Everything else identical.

## 5.11 Acceptance criteria

1. Default shows **12** hours a week (4 × 3).
2. **Around the clock** → 24 × 7, overnight on, **168**, hint about shifts shown (full).
3. Unit tests with fixture rates (test-only values, never shipped): weekly rounds to $10, monthly to $50 from the unrounded weekly; 4.33 multiplier; overnight range used only when both overnight rates are set.
4. All rates `null` → hours-only line, no badge, no "$" anywhere in the component.
5. Prices mode + `rateConfirmed: false` → badge visible; `rateConfirmed: true` → badge gone.
6. Slider: arrows change by 1; Fewer/More buttons work and disable at limits; `aria-valuetext` correct.
7. `?hours=99&days=0` → defaults, no console errors.
8. Live region announces once, 500ms after input stops (holding an arrow key for 2s → one announcement).
9. CTA URL carries hours/days/overnight; assessment Step 3 shows **My estimate · About {weeklyHours} hours a week**.
10. Quiz preset "Full days" → compact shows 8 × 5 = 40.

---
---

# 6. Service-Area Map — /areas-we-serve, Home ch. 11, town pages, /contact (07 §5)

**Purpose:** local proof — "Rooted in Beaufort" — and an instant answer to "Do you serve my town?"

## 6.1 Components & data

```
components/features/AreaMap/
  AreaMap.tsx         variant: home | hub | town | contact
  MapBase.tsx         static SVG (land, water, county lines) — aria-hidden
  TownMarkers.tsx     HTML overlay of town links positioned by %
  OfficePin.tsx       HTML overlay + ripple
  TownTooltip.tsx     hover/focus label card
  TownSearch.tsx      "Do you serve my town?"
  TownList.tsx        list fallback (Home) / "Towns we serve" (hub)
  DriveLine.tsx       town-page mini map line
content/map/lowcountry.ts   generated SVG path data (do not hand-edit)
content/map/labels.ts       per-town label anchor + persistent label tier
lib/projection.ts
scripts/build-map.ts
```

```ts
type AreaMapProps = {
  variant: "home" | "hub" | "town" | "contact";
  townSlug?: string;              // town variant
  showSearch?: boolean;           // home, hub
  ariaLabel: string;              // COPY_HOME ch. 11 accessible name (or contact/town variants)
};
```

**Data:** `content/areas.ts` (`areas`, `OFFICE`, `matchAreas`, `formatDrive`, `areasByTier`) — every town `confirmed: false`, `driveConfirmed: false`.

## 6.2 Map pipeline (build time, no API key, no runtime fetch)

1. **Sources (public domain):** US Census Bureau cartographic boundary files (counties, 1:500k) for Beaufort, Jasper, Hampton and Colleton edges; TIGER/Line `AREAWATER` for Beaufort and Jasper (rivers, sounds, creeks).
2. `scripts/build-map.ts` (mapshaper + d3-geo-free custom projection): clip to bbox, simplify (Visvalingam, keep ~8%), drop water polygons < 0.4 km², project, round coordinates to 1 decimal, emit `content/map/lowcountry.ts` with `{ viewBox, land: string, water: string, counties: string }`.
3. Commit the output. Re-run only if the bbox changes.

**Projection (`lib/projection.ts`):** equirectangular with latitude correction.
- bbox: lng −81.12 → −80.48, lat 32.10 → 32.74 (covers Hardeeville, Yemassee, Sea Pines).
- `kx = cos(32.42°) ≈ 0.8443`; viewBox width 1000, height `1000 × 0.64 / (0.64 × kx) ≈ 1184` → **`viewBox="0 0 1000 1184"`**.
- `x = (lng + 81.12) / 0.64 × 1000`, `y = (32.74 − lat) / 0.64 × 1184`.
- Marker positions as % of the container: `left = x / 1000`, `top = y / 1184`.
- `town` and `contact` variants crop with a computed viewBox (bbox of the points, padded 25%); markers use the same crop math.

## 6.3 Layers & visuals

| Layer | Spec |
|---|---|
| Water (background) | `plum-100` rect (07: waterways in plum-100) |
| Land | `cream` fill, 1.5px `plum-800` coastline stroke |
| Inland water | `plum-100` fill over land |
| County lines | 1px `muted`, dash 4 6, decorative |
| Town marker — primary tier | 14px circle, `plum-800` fill (●) |
| Town marker — extended tier | 14px circle, 3px `plum-800` ring, `white` center (○) |
| Marker hover/focus/match | 22px `orchid-500` fill + 2px `plum-800` outline + tooltip (BRAND_FINAL §1.5 map dots) |
| Office pin | lucide `MapPin` 32px, `plum-800` stroke, `leaf-500` inner dot (7.67:1 on plum-800), always-visible label "**Our office** · 69 Robert Smalls Pkwy, Beaufort" |
| Persistent labels | 16px 600 `ink` text on a `cream` pill (no halo/opacity). Tier `always`: Beaufort, St. Helena Island, Bluffton, Hilton Head Island, Ridgeland, Yemassee (set in `labels.ts`; designers may adjust). Other towns: label on hover/focus only |
| Tooltip | `white` card, 1px `line` border, `--radius-input`, 16px: **{town}** · About {drive} min from our office; plus a **To confirm** chip when `driveConfirmed: false` and placeholders are shown. Town without page adds "Call to check" (COPY_AREAS). Placement from `labels.ts` anchor; flips if it would overflow the container |

**Markers are HTML, not SVG** (see Spec decisions): real `<a>` elements absolutely positioned over the SVG base — crisp at any size, standard focus rings, text that respects Comfort text size.

## 6.4 Interactions

**Town with a page:** `<a href="/areas-we-serve/{slug}" aria-label="In-home care in {town}. Opens the {town} page." data-cursor-label="View">` (COPY_HOME aria-label). Hover/focus → tooltip + marker grow (200ms outExpo). Click → town page (page transition).

**Town without a page:** `<a href="#town-row-{slug}" aria-label="{proposed, Appendix B}">`. Activation moves focus to that town's row link in the list (COPY_AREAS) — `preventDefault`, `scrollToTarget(row)`, `row.focus()`. Never dials from the map.

**Hit areas:** visible dot 14px; hit area `::before` circle of `min(48px, nearest-neighbor distance)` diameter (recomputed on resize). Where the Beaufort cluster forces < 48px, WCAG 2.5.8's "equivalent control" exception applies — the list (below) has full-size targets.

**Office pin ripple** (07: "pulses (leaf-500 ripple)"):
| Trigger | Animation | Ease |
|---|---|---|
| Map ≥ 40% in view (IntersectionObserver), once per page view | Two 2px `leaf-500` rings: scale 1→2.6, opacity 0.6→0, 1600ms each, second ring starts at 400ms; **3 cycles, then stops** (~5.2s total) | outExpo |
| Hover/focus on the office label | One cycle | outExpo |
| `document.hidden` | Paused | |

Stops after 3 cycles so it never needs a pause control (same reasoning as BRAND_FINAL §3.3D).

**Town search (`TownSearch`)** — COPY_HOME ch. 11 / COPY_AREAS 2.2 strings:
- `<form role="search" aria-labelledby>`; label **Do you serve my town?**, helper **Type your town or ZIP code.**, text input (`autocomplete="off"`, `enterkeyhint="search"`), submit button **Check** *(proposed)*.
- On submit: `matchAreas(query)` → state:
  | Result | Message (polite `role="status"` under the input) | Map |
  |---|---|---|
  | Empty input | "Please type a town or ZIP code." (alert pattern, field error) | — |
  | 1 town with page | "**Yes — we care for families in {town}.** See care in {town} →" | Marker → match state + one 600ms `orchid-500` ring pulse |
  | 1 town, no page | Hub: "**Yes — {town} is in our service area.** Call (843) 379-3321 …" | Same |
  | Extended tier | + the extended line (hub) | Same |
  | ZIP → several towns | "**Yes — we care for families in {zip}.** That includes {A}, {B} and {C}." (links for towns with pages) | All matches highlighted |
  | No match | "**We may still be able to help.** Call (843) 379-3321 and we'll let you know." | Nothing highlighted |
- Editing the input clears highlights and the message.

**Town-page drive line (`variant="town"`):** cropped map (office + town). When the drive card is 40% in view, once: a straight line from office to town with one small heartbeat blip at its midpoint draws (dashoffset 1→0, **900ms inOut**, `orchid-500` 3px) — "as the heron flies" (COPY_AREAS). SVG `aria-hidden`; the card text is the accessible version.

**Contact variant:** cropped to Beaufort, office pin + ripple only, no town markers, "Get directions" below (COPY_CONVERSION).

## 6.5 Layout by variant

- **Home ch. 11:** map (7/12) + search and H3 **Towns we serve** list (5/12) on desktop; stacked on mobile (search, map, list).
- **Hub:** map + legend (icon + words, COPY_AREAS) + disclaimer; the full two-group list is its own section (2.3), sorted by drive time (`areasByTier`).
- A skip link **Skip the map to the town list** *(proposed)* precedes the markers when ≥ 8 markers are tab stops.

## 6.6 Mobile (< 768px)

The map is a **visual**: markers render but are `aria-hidden`, `tabindex="-1"` and `pointer-events: none`; only `always` labels show. Search and list are the interactive layer (accessible name already says "Every town on the map is also listed below"). Search matches still highlight markers.

## 6.7 Keyboard & screen reader

- Container: `<div role="group" aria-label={COPY accessible name}>`; base SVG `aria-hidden`.
- Tab order of markers = list order (primary tier by drive time, then extended) — not geographic.
- Escape while a tooltip is open (hover) hides it (WCAG 1.4.13); tooltips are hoverable and persistent while hovered/focused.
- Search result is a polite status; field errors use the BRAND_FINAL §1.6 pattern.

## 6.8 Reduced motion

No ripple, no match pulse, drive line already drawn, marker grow/tooltip instant.

## 6.9 Acceptance criteria

1. All 14 towns render at positions from `areas.ts` coordinates through `project()`; Beaufort office pin present with its label.
2. Hover and keyboard focus each show the tooltip with the right drive text ("15" or "35–40" with an en dash) and a visible focus ring.
3. Town with page → navigates; town without page → focus lands on its list row.
4. Search: "Lady's", "ladys island", "29907" → Lady's Island; "29906" → Beaufort, Burton, Shell Point; "Sun City" → Okatie; "Atlanta" → no-match message; empty → error.
5. Ripple: 3 cycles then stops; `getAnimations()` on the pin returns nothing after 6s.
6. 390px: markers not focusable; search + list fully usable; matches still highlight.
7. Town page: drive line draws once in ≤ 900ms; reduced mode shows it drawn.
8. No external map requests in the network log (no tiles, no API).

---
---

# 7. Interactive logo (07 §15)

**Normative spec:** BRAND_FINAL §3 (construction, versions, colors, timelines A–D, Option B, reveal plan). This section adds the component contract, implementation rules and tests. **Timeline numbers below are copied from BRAND_FINAL §3.3 — if they ever differ, BRAND_FINAL wins.**

## 7.1 Component

```ts
// components/brand/Logo.tsx
type LogoProps = {
  variant: "horizontal" | "stacked" | "mark";
  tone: "default" | "reversed" | "mono-plum" | "mono-cream";
  intro?: boolean;        // header only
  compact?: boolean;      // header only — subscribes to scroll
  idle?: "none" | "footer";
  size?: "header" | "header-mobile" | number; // 44px / 36px tall, or px
  asLink?: boolean;       // default true → <a href="/" aria-label="Dawson & Dawson Home Care — home">
};
```

- One inline SVG component per variant (`LogoHorizontal.tsx`, `LogoStacked.tsx`, `LogoMark.tsx`); colors via CSS custom properties set by `tone` (`--logo-house`, `--logo-word`, `--logo-desc`, `--logo-figure`, `--logo-figure-outline`, `--logo-line`, `--logo-window`).
- **Targeting uses `data-part`, not `id`.** The header and footer logos are on the same page; duplicate `id`s are invalid HTML and break axe. React SVGs use `data-part="house-roof"` etc.; exported static files in `/public/logo/` keep BRAND_FINAL's `id`s.
- Figure: `NEXT_PUBLIC_LOGO_FIGURE=a|b` (default `a`) swaps only the `figure` part (BRAND_FINAL §3.4–3.5). `/reveal-notes` toggle overrides it client-side for the demo.
- Link: `<a href="/" aria-label="Dawson & Dawson Home Care — home">` wrapping `<svg aria-hidden="true" focusable="false">`.

## 7.2 A — First-visit intro (header, 1,400ms)

Starts from the pre-paint flag (§0.9): CSS under `html[data-logo-intro="play"] .logo--intro` holds the start state (strokes at dashoffset 1, figure/wordmark opacity 0, window-light fill-opacity 0).

| Start → End (ms) | Part | Property | Ease |
|---|---|---|---|
| 0 → 450 | `house-roof` | dashoffset 1 → 0 | inOut |
| 150 → 900 | `house-walls`, `window` | dashoffset 1 → 0 | inOut |
| 600 → 900 | `figure` | opacity 0 → 1, scale 0.94 → 1 (origin bottom center) | outExpo |
| 700 → 1050 | `window-light` | fill orchid-100 → white, fill-opacity 0 → 1 | outExpo |
| 700 → 1150 | `window-glow` | opacity 0 → 1 → 0 (peak 900) | inOut |
| 900 → 1250 | `heartbeat` | dashoffset 1 → 0 | inOut |
| 950 → 1350 | `heartbeat-pulse` | opacity 0 → 1 at 950; dashoffset 0.12 → −1; opacity → 0 at 1350 | inOut |
| 1000 → 1350 | `wordmark-name` | opacity 0 → 1, y 6 → 0 | outExpo |
| 1080 → 1400 | `wordmark-descriptor` | opacity 0 → 1, y 6 → 0 | outExpo |

- GSAP timeline built in `useLogoIntro()` on the header instance only, after hydration. On complete: `delete document.documentElement.dataset.logoIntro`.
- **Skip:** any `pointerdown`, `keydown`, `wheel`, `touchstart` during the intro → `tl.progress(1)`.
- The header is interactive from 0ms (the intro never blocks clicks).
- Failsafe (§0.9): if JS hasn't booted in 3s the attribute is removed and the static logo shows.
- Option B: the two figures fade in 60ms apart (caregiver first) inside the 600 → 900 window.

## 7.3 B — Hover / focus (CSS keyframes)

| Start → End (ms) | Part | Property | Ease |
|---|---|---|---|
| 0 → 250 | `house-roof` | translateY 0 → −2px (returns in 300ms on leave) | outExpo |
| 0 → 240 | `window-light` | fill-opacity 1 → 0.65 → 1 | inOut |
| 60 → 660 | `heartbeat-pulse` | opacity 0 → 1 → 0, dashoffset 0.12 → −1 | inOut |

Triggered by `a:hover` and `a:focus-visible`; each new hover restarts (keyframes re-apply). Reduced motion: none (focus ring still shows).

## 7.4 C — Scroll-compact (header)

- Subscribe to Lenis `scroll` (window `scroll` when Lenis is off), rAF-throttled. Compact when `scrollY > 80` and the last delta is down by > 8px; expand when the delta is up by > 8px or `scrollY ≤ 80`.
- The logo box keeps its full reserved width (no layout shift); collapse is `clip-path` + transform.
- One paused GSAP timeline `compactTl`: `play()` to compact, `reverse()` to expand.

| Start → End (ms) | Part | Property | Ease |
|---|---|---|---|
| 0 → 200 | `heartbeat` | dashoffset 0 → 1 (retracts right → left) | inOut |
| 0 → 200 | `wordmark-name`, `wordmark-descriptor` | opacity 1 → 0, x 0 → −8px | outExpo |
| 100 → 350 | wordmark wrapper | `clip-path: inset(0 0 0 0)` → `inset(0 100% 0 0)` | inOut |
| 100 → 350 | `house` + `figure` | scale 1 → 0.9 (origin left center) | inOut |

Reduced motion: `compactTl.progress(0 | 1)` instantly. `aria-label` unchanged in both states. If the intro is still running when compaction triggers, finish the intro first (`progress(1)`).

## 7.5 D — Footer idle (stacked reversed)

IntersectionObserver ≥ 50% visible → one pulse (`heartbeat-pulse` opacity 0→1→0, dashoffset 0.12 → −1, 900ms inOut), once per entry. Same pulse on hover/focus. Paused when `document.hidden`. Reduced: none. (BRAND_FINAL replaces 03's "every ~6s" for WCAG 2.2.2.)

## 7.6 Mobile

Header mobile size 36px tall; compact behavior identical. Hover keyframes don't fire on touch (no `:hover` sticky issue: wrap hover rules in `@media (hover: hover)`).

## 7.7 Acceptance criteria

1. First visit in a session: intro plays once, ~1,400ms (±50ms measured via timeline duration); reload in the same tab → no intro; new tab → intro.
2. No flash of the finished logo before the intro (filmstrip at 16ms frames).
3. Pressing any key or clicking during the intro jumps to the end state immediately.
4. sessionStorage blocked → no intro, static logo, no errors.
5. JS disabled → static logo visible (failsafe attribute removed after 3s or never set if script blocked).
6. Scroll down 200px → compact; scroll up 10px → expand; CLS from header = 0.
7. Hover/focus → roof lift + window flicker + heartbeat pulse; repeated hovers restart it.
8. Footer pulse fires once each time the footer enters view; never loops.
9. axe: no duplicate ids with header + footer logos on the same page.
10. Reduced motion (OS or Comfort): no intro, no hover motion, instant compact swap, no footer pulse.
11. `NEXT_PUBLIC_LOGO_FIGURE=b` swaps only the figure; all other parts and motion identical.

---
---

# 8. Interactive cursor (07 §16)

**Normative spec:** BRAND_FINAL §4 (mount conditions, DOM/CSS, states, precedence, selectors, label map, lerp, events, 12 acceptance criteria). This section adds the React architecture and the cross-feature integration.

## 8.1 Architecture

```
components/cursor/
  CursorRing.tsx          client; dynamic(() => import(...), { ssr: false }) in (site)/layout
  useCursorEligibility.ts mount conditions (BRAND_FINAL §4.1) as a live boolean
  resolveCursorState.ts   pure: (target: Element) → { state, theme, label }
  selectors.ts            INTERACTIVE, TEXT, DISABLED (BRAND_FINAL §4.4, verbatim)
```

```ts
// resolveCursorState.ts — precedence from BRAND_FINAL §4.3
export function resolveCursorState(t: Element) {
  const theme = t.closest('[data-cursor-theme="dark"]') ? "dark" : "light";
  if (t.closest('[data-cursor="none"]')) return { state: "none", theme, label: "" };
  const interactive = t.closest(INTERACTIVE);
  if (interactive?.matches(DISABLED)) return { state: "disabled", theme, label: "" };
  if (t.closest(TEXT)) return { state: "text", theme, label: "" };
  const labelled = t.closest("[data-cursor-label]");
  if (labelled) return { state: "label", theme, label: labelled.getAttribute("data-cursor-label")! };
  if (interactive) return { state: "interactive", theme, label: "" };
  return { state: "idle", theme, label: "" };
}
```

- `useCursorEligibility()` combines `matchMedia('(pointer: fine) and (hover: hover)')`, `useMotionMode() === "full"`, `html[data-contrast] !== "high"`, `!matchMedia('(forced-colors: active)')` — all live. False → fade out 150ms → unmount → listeners and rAF removed.
- The ring writes `data-state`, `data-theme`, `data-visible`, `data-pressed` on its root; CSS from BRAND_FINAL §4.2–4.3 does the rest.

## 8.2 Integration map (who sets what)

| Feature | Attribute | Notes |
|---|---|---|
| Every `tel:` link (not the mobile bar — touch) | `data-cursor-label="Call"` | Built into `<PhoneLink>` |
| Dawson House rooms (SVG `<a>`) + scene RoomCard | `data-cursor-label="Open"` (card also `data-cursor`) | §2 |
| Owner video poster/play, testimonial posters | `data-cursor-label="Play"` | §12 |
| Caregiver carousel viewport | `data-cursor data-cursor-label="Drag"` | §13 |
| Map town markers, service cards, review cards that open, "See all care services" | `data-cursor-label="View"` | §6, §11 |
| Footer, Pros band, Final CTA (Dusk), any plum/Dusk section | `data-cursor-theme="dark"` | Set by `<Section surface="dark|dusk">` |
| `<video>` controls, Turnstile wrapper, any iframe wrapper | `data-cursor="none"` | §12, §16 |

## 8.3 Cross-feature behavior

- **Page transitions (§9):** hide the ring (`data-visible="false"`) when the curtain starts; re-resolve with `elementFromPoint` after the reveal ends.
- **Pinned scenes:** scroll re-resolution (BRAND_FINAL §4.6) keeps the label correct as rooms move under a still pointer.
- **Hover preview in the Dawson House** uses its own pointer events — the cursor never drives application state.
- **Comfort Controls:** toggling Reduce motion / High contrast unmounts within 200ms (BRAND_FINAL §4.7 #3).

## 8.4 Acceptance criteria

BRAND_FINAL §4.7 (1–12), plus:
13. After a page transition, the ring shows the correct state for the element under the pointer without moving the mouse.
14. Hovering a Dawson House room during the pin shows **Open**; scrolling so another room passes under the still pointer keeps **Open** and the hover preview follows.
15. No cursor code ships in the mobile bundle path (dynamic import never requested on a touch-only device — check network log in the mobile Playwright project).

---
---

# 9. Page transitions (07 §19)

**Purpose:** a calm, branded hand-off between pages — a cream curtain with the heartbeat sweep — that never slows navigation and always lands focus on the new page's H1.

## 9.1 Components

```
components/motion/PageTransition.tsx   provider + curtain (mounted in app/(site)/layout.tsx)
app/(site)/template.tsx                re-mounts per route → signals "route ready"
lib/navigation.ts                      shouldTransition(event, anchor), navigate()
```

```ts
type TransitionPhase = "idle" | "covering" | "holding" | "revealing";
// usePageTransition(): { phase, navigate(href: string): void }
```

## 9.2 Which navigations get the curtain

Global `click` listener (capture phase) on `document` for `<a>` elements. Transition **only if all** are true:
- Motion mode `full`; event not `defaultPrevented`; primary button; no Ctrl/Meta/Shift/Alt.
- `href` is same-origin, not `tel:`/`sms:`/`mailto:`, no `target`, no `download`, no `data-transition="none"`.
- The **pathname differs** from the current one (same-page hash or query changes never use the curtain).

Otherwise the browser/Next.js handles it normally. Programmatic navigations (form success → /thank-you, quiz CTA, Home teaser) call `navigate(href)`.

## 9.3 Sequence

1. **Cover starts** — `preventDefault()`; phase `covering`; cursor ring hidden; **`router.push(href, { scroll: false })` fires immediately** (navigation runs in parallel with the cover — the curtain never adds waiting time).
2. **Route ready** — `template.tsx` `useLayoutEffect` on the new route sets `routeReady`. Under the curtain: `scrollToTarget(0, { immediate: true })` (or the URL hash target), `ScrollTrigger.refresh()`.
3. **Reveal** — when cover has finished **and** the route is ready.
4. **Focus** — after reveal: `document.querySelector("#main h1")` gets `tabindex="-1"` and `focus({ preventScroll: true })`. (If the URL has a hash, focus the hash target instead.) Next.js's route announcer also announces the title.
5. Cursor re-resolves (§8.3).

## 9.4 Timeline (full motion)

| Phase | ms | Element | Property | Ease |
|---|---|---|---|---|
| Cover | 0 → 220 | Curtain (`cream`, fixed, full viewport, z 9000) | `clip-path: inset(100% 0 0 0)` → `inset(0 0 0 0)` (rises from the bottom) | inOut |
| Cover | 80 → 380 | Heartbeat sweep (center, 60vw wide, 3px `orchid-500`, `pathLength=1`) | dashoffset 1 → 0 (draws left → right) | inOut |
| Reveal | +0 → +260 | Curtain | `inset(0 0 0 0)` → `inset(0 0 100% 0)` (lifts off the top) | outExpo |
| Reveal | +0 → +120 | Heartbeat | opacity 1 → 0 | inOut |

**Best case = 220 + 260 = 480ms** (≤ 500ms, 07). The new page's own entrance reveals (hero SplitLines etc.) start at reveal +120ms.

**Slow route** (not ready 600ms after cover ends) → phase `holding`: the stacked logo (mono plum, 96px) fades in under the heartbeat (200ms), the heartbeat redraws once every 1500ms (600ms draw — well under 3 flashes/s), `<main aria-busy="true">`. Hard failsafe: reveal after 8s regardless. (BRAND_FINAL lists the stacked logo for the curtain; showing it only on slow routes keeps fast navigations clean — see Spec decisions.)

The curtain is `aria-hidden="true"` and blocks pointer input while visible (prevents double navigation).

## 9.5 Other navigation types

| Type | Behavior |
|---|---|
| Back / Forward (`popstate`) | No curtain. Next.js restores scroll. Focus is not moved (keeps the user's place); route announcer announces the title |
| Same-page hash link | No curtain. `scrollToTarget(target)` (smooth in full mode), focus the target (`tabindex="-1"` if needed) |
| External, tel, sms, mailto, downloads | Native |
| Reduced motion (OS or Comfort) | No curtain, instant navigation, scroll to top, **still focus the H1** |

## 9.6 Acceptance criteria

1. Internal link click (prefetched page): curtain visible ≤ 500ms total; network request starts before the cover finishes.
2. After every curtain navigation, `document.activeElement` is the new page's H1 (or the hash target).
3. Back button: no curtain, scroll restored.
4. Ctrl/Cmd-click opens a new tab with no curtain in the current tab.
5. Same-path query change (`/find-care` → `/find-care?town=…`) and hash links: no curtain.
6. Throttled "Slow 3G" navigation: curtain holds with the stacked logo and a slow heartbeat; reveals when ready; never stuck longer than 8s.
7. Reduced mode: no curtain element ever rendered; H1 still focused.
8. Old page's ScrollTriggers and pins are gone after navigation (`ScrollTrigger.getAll()` only contains the new page's triggers).
9. Rapid double-click on a link triggers one navigation.

---
---

# 10. Payment Explorer — /paying-for-care (07 §6)

**Copy and data:** COPY_COST_FAQ (`payments.ts`, verbatim). Behavior specified there (tabs ≥ 900px, accordion below, deep links, narrow-down helper, tracking); this section fixes the component contract and motion.

```ts
// components/features/PaymentExplorer/PaymentExplorer.tsx
type PaymentExplorerProps = { options: PaymentOption[]; narrowDown: typeof narrowDown; initialId?: PaymentId };
```

- **≥ 900px:** WAI-ARIA Tabs, automatic activation, ←/→ + Home/End, roving tabindex. Panel change: Motion crossfade 200ms (exit) / 200ms (enter), no movement. Tab chips: **Ask us** / **Usually not covered** / **Worth a look** — icon + words, chip style `orchid-700` on `orchid-100` (Worth a look) and `plum-800` on `plum-100` (status chips).
- **< 900px:** accordion — 56px `<button aria-expanded>` headers, several open at once, height animation 300ms inOut (Motion `height: auto`).
- **Breakpoint change** keeps the current open panel.
- **Narrow-down:** native checkboxes; matches add the **Worth a look** chip (fade 200ms) and update the polite result line; first match opens if nothing was opened by the user yet. Ticks stay in memory only (never stored or sent).
- **Deep links** `#pay-*` → open panel, focus its H3, scroll with header offset. `#ways-to-pay` scrolls only.
- **Tracking:** each opened panel id appended to sessionStorage `payment_explored`; panel CTAs carry `?pay={id}`.
- **No JS:** all five panels stacked with H3s.
- **Reduced:** no crossfade/height animation.

**Acceptance:** keyboard tabs per APG; deep links open the right panel in both layouts; narrowing with VA + Medicare shows "Worth a look: VA benefits and Medicare. …"; `payment_explored` reaches the assessment lead; Medicare chip reads "Usually not covered" with an icon.

---

# 11. Reviews — Home marquee + /reviews grid (07 §7)

**Data:** `content/reviews.json` (`placeholder: true` samples). **Launch rule:** fewer than 3 real reviews → Home ch. 9 hidden, /reviews in "gathering reviews" state (COPY_TRUST). Never ship samples.

## 11.1 Home marquee — `ReviewsMarquee.tsx`

```ts
type ReviewsMarqueeProps = { reviews: Review[]; rating?: { value: number; count: number; confirmed: boolean } };
```

- Two rows; row 1 moves left, row 2 right; reviews split alternately between rows.
- Each row = original set + one **duplicate set** (`aria-hidden="true"` + `inert`) for the seamless loop. CSS `@keyframes marquee { to { transform: translateX(-50%) } }`; duration = `rowWidth / 30` seconds (**30px/s** — slow enough to read a card's first line as it passes).
- **Pauses** on: hover over the marquee, `:focus-within`, the **Pause reviews / Play reviews** button (visible, 48px, above the rows, label swaps — COPY_HOME), `document.hidden`. Implemented with `animation-play-state`.
- Cards: stars (`aria-hidden`) + "Rated {rating} out of 5" (visually hidden), quote, attribution, service chip; `data-cursor-label="View"` only if the card links to `/reviews#{id}`.
- Region: `<section aria-labelledby>`; rows are lists (`<ul>`) of the original set.
- Google rating badge: rendered only when `confirmed`.
- **Reduced motion:** no animation — one row of 4 cards in a horizontally scrollable list (`overflow-x: auto`, scroll-snap), the Pause button hidden.

## 11.2 /reviews grid

Filter chips by service (`aria-pressed` buttons; "All" default); grid reflows with Motion `layout` 360ms (reduced: instant); live region "{n} reviews shown"; **Show more reviews** appends 12 (COPY_TRUST).

**Acceptance:** marquee pauses on hover, on keyboard focus of any card or the button, and via the button; duplicates never receive focus or SR reading; reduced shows a static row; < 3 real reviews hides ch. 9 in production builds.

---

# 12. Meet-the-Owner video (07 §8)

**Recommendation: inline player, not a modal** (fewer focus traps, better on phones). Alternative: modal with focus trap — only if the layout can't fit 16:9 inline.

```ts
// components/home/OwnerVideo.tsx (also used on /about)
type OwnerVideoProps = {
  video: { src: string; captions: string; poster: string; posterAlt: string; transcript: string } | null;
  playLabel: string;      // "Watch a short hello"
  accessibleName: string; // "Play video: a short hello from …, with captions"
  comingSoon: { title: string; body: string }; // "Video coming soon" …
};
```

- **States:** `coming-soon` (`video === null`: poster placeholder + "Video coming soon" card styled as intentional, no play button) · `poster` · `playing` · `ended`.
- `poster` → big play button over the poster's center (icon only visually, text **Watch a short hello** below the poster — no text on the image), `data-cursor-label="Play"`, accessible name from copy.
- Activate → replace poster with `<video controls playsinline preload="none">` + `<track kind="captions" srclang="en" label="English" default>`; call `play()` in the same user gesture; focus moves to the video element. Wrapper `data-cursor="none"`.
- **No autoplay, no sound before a click.** Ends → stays on the last frame with controls.
- Under the player: **Captions on** (state text) · **Read the transcript** / **Hide the transcript** (`aria-expanded`, transcript region height 300ms; reduced: instant).
- Poster transition to video: crossfade 200ms (reduced: instant).

**Acceptance:** keyboard-only playback works; captions on by default; transcript toggles and is read by SR; coming-soon state has no dead play button.

---

# 13. Caregiver carousel — Home ch. 8 (07 §9)

**Data:** `content/caregivers.ts` (6 placeholders). Launch rule: < 3 real cards with consent → hide ch. 8.

```ts
// components/home/Caregivers.tsx
type CaregiversProps = { caregivers: Caregiver[]; currentYear: number }; // years = currentYear − startYear
```

- **Embla:** `align: "start"`, `loop: false`, `dragFree: false`, `containScroll: "trimSnaps"`, slides 82% (mobile) / 33% (≥ 1024). Viewport `data-cursor data-cursor-label="Drag"`.
- **Semantics:** `role="region" aria-roledescription="carousel" aria-label="Our caregivers"`; slides `role="group" aria-roledescription="slide" aria-label="{n} of {total}"`; position text "{n} of {total}" visible + polite on settle.
- **Arrows:** **Previous caregiver / Next caregiver** (icon buttons, 48px), `aria-disabled` at the ends. ←/→ keys move slides when focus is inside the region.
- **Flip:** **Why I do this** button flips the card (rotateY 0 → 180°, 600ms inOut, `perspective: 1000px`, `backface-visibility: hidden`). Back face: label, quote, **Back to photo**. The hidden face is `inert`. Focus moves to **Back to photo** after flipping and back to **Why I do this** after unflipping. Only one card flipped at a time (flipping another unflips the first).
- Placeholder cards show a **Sample** chip.
- **Reduced motion:** no flip — quote rendered below the photo on every card, flip buttons not rendered; Embla `duration: 0`-like instant scroll (`skipSnaps`, `duration: 10`).

**Acceptance:** drag, swipe, arrows and keys all move slides; flip is keyboard-operable and focus-managed; reduced shows quotes inline; years computed from `startYear`.

---

# 14. Sticky mobile action bar (07 §10)

Strings: COPY_CONVERSION §2.

```ts
// components/layout/MobileActionBar.tsx
type MobileActionBarProps = { pathname: string }; // removes slot 3 on /free-assessment and /thank-you
```

- `<nav aria-label="Quick contact">`, fixed bottom, `md:hidden` (< 768px), three equal 56px buttons (icon above label), `padding-bottom: env(safe-area-inset-bottom)`, `plum-950` surface (`data-surface="dark"`), labels cream; slot 3 = leaf-500 button with plum-950 text.
- Slot 3 label **Free Assessment** / after hours **Callback** (§15.4).
- **Hide when:** (a) the on-screen keyboard is open — `visualViewport.height < window.innerHeight − 150` (also on `focusin` of a text field); (b) any element marked `data-hides-mobile-bar` (forms, quiz, estimator controls) intersects the viewport (IntersectionObserver, threshold 0).
- Hide/show: translateY 0 ↔ 100%, 250ms outExpo; after hiding, `visibility: hidden` + `inert` so it can't take focus. Reduced: instant.
- `body` keeps `padding-bottom: calc(56px + env(safe-area-inset-bottom))` permanently on mobile (no layout shift when it hides).
- Comfort Controls button sits above it (`bottom: calc(56px + 16px + safe-area)`).

**Acceptance:** visible on every mobile page except while a form/quiz is in view or the keyboard is up; never covers the last line of content; correct slot set on /free-assessment and /thank-you; after-hours label swaps.

---

# 15. Office-status chip & after-hours mode (07 §11)

Strings: COPY_CONVERSION §1 (four states, compact and expanded), COPY_HOME §0 (`{nextOpen}` rules).

## 15.1 Logic — `lib/officeHours.ts` (pure, unit-tested)

```ts
type OfficeState = "open" | "closing-soon" | "closed" | "holiday";
export function getOfficeStatus(now: Date, holidays: Holiday[]): {
  state: OfficeState;
  nextOpen: Date;          // America/New_York
  nextOpenLabel: string;   // "today at 8 AM" | "tomorrow at 8 AM" | "Monday at 8 AM" | "{weekday} at 8 AM"
  holidayName?: string;
};
export function etSuffix(): " ET" | "";  // " ET" when Intl…resolvedOptions().timeZone !== "America/New_York"
```

All time math through `Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", … }).formatToParts` — never the device's local time. Open = Mon–Fri 08:00–16:59; closing soon = 16:30–16:59.

## 15.2 Provider & chip

- `OfficeStatusProvider` (site layout) computes after mount, re-checks every 60s and on `visibilitychange` → visible.
- **Server / no-JS / pre-hydration text:** "Office hours: Mon–Fri, 8 AM–5 PM" (no wrong "open" flash, no hydration mismatch).
- `OfficeStatusChip` props `{ size: "compact" | "expanded" }`. Open: `leaf-100` chip, `leaf-700` dot + text. Closed/holiday: `plum-100` chip, `plum-800` moon icon + text. Icon `aria-hidden`; words carry state. **Not a live region.**
- Expanded chip is always followed by **Care:** 24 hours a day, 7 days a week.
- State change while the page is open (e.g. 5:00 PM): chip text crossfades 200ms (reduced: instant).

## 15.3 After-hours mode

`useOfficeStatus().isClosed` (closed or holiday) drives:
- Every **Get a Free Care Assessment** CTA → **Request a Callback**, same href + `after_hours=true` on the eventual form submit.
- Mobile bar slot 3 → **Callback**.
- Closed-only lines (COPY_HOME / COPY_CONVERSION after-hours lines).
- Assessment submit label **Request my callback**; `after_hours` recorded at send time (thank-you variant uses the send-time value).

## 15.4 Zero-shift label swap (`<CtaLabel>`)

Both labels render in the same grid cell; the inactive one is `visibility: hidden` + `aria-hidden="true"`, so the button is always as wide as the longer label and never shifts when hydration or the clock flips the state.

```html
<span class="grid">
  <span class="[grid-area:1/1]">Get a Free Care Assessment</span>
  <span class="[grid-area:1/1] invisible" aria-hidden="true">Request a Callback</span>
</span>
```

**Acceptance (unit, with fixed `now`):** Mon 07:59 ET → closed, "today at 8 AM"; Mon 16:45 → closing soon; Fri 17:00 → closed, "Monday at 8 AM"; Sat → "Monday at 8 AM"; holiday Monday → "Tuesday at 8 AM" + holiday name; device in Ohio (ET) → no suffix, device in California → " ET". **E2E:** server HTML contains the neutral text; CLS 0 when CTAs swap.

---

# 16. Free Care Assessment form — /free-assessment (07 §12)

Copy, fields, steps, validation messages, prefill banners, consents and GHL fields: **COPY_CONVERSION §3 and §8 (verbatim).** This section is the build contract.

## 16.1 Components

```
components/features/AssessmentForm/
  AssessmentForm.tsx      one react-hook-form instance across 5 steps
  steps/Step1Who.tsx … Step5Send.tsx
  ErrorSummary.tsx        BRAND_FINAL §1.6
  PrefillBanner.tsx  ResumeBanner.tsx  ReassurancePanel.tsx
lib/schemas/assessment.ts  zod: stepSchemas[1..5] + full schema (shared with /api/lead)
lib/formMessages.ts        COPY_CONVERSION §8.4 keys
```

## 16.2 Behavior

- **Steps:** Continue → `trigger(stepFields[n])`; errors → error summary at the top of the step (focus to its heading); valid → next step. Back keeps everything.
- **Step transition:** identical to the quiz (§4.4): exit 200ms, enter 360ms, height `layout` 360ms; focus the step H2; polite "Step {n} of 5: {heading}."
- **Progress:** `HeartbeatProgress value={n/5}` + text "Step {n} of 5 · {step name}".
- **Storage:** `dawson.assessment.v1` (all fields except honeypot and Turnstile token), debounced 300ms; resume banner per copy; cleared on success.
- **Prefill:** read once on mount — `dawson.assessment.prefill.v1` (quiz), URL params (`service`, `needs`, `hours`, `days`, `overnight`, `town`, `pay`, `from`), `dawson.estimator.v1`. One banner (copy table), dismissible. `prefill_source` recorded.
- **Field behaviors** per copy: "Not sure yet" exclusivity, extended-area note, ASAP note (office-status aware), notes counter from 800 chars, DOB soft note, SSN/MBI blocking errors, phone formatting as typed, email typo suggestion with **Use this**.
- **Submit:** label **Send my request** / closed **Request my callback** / sending **Sending…** (`aria-disabled`, polite "Sending your request."). POST `/api/lead` (JSON, same zod schema server-side, honeypot, Turnstile when keys exist, duplicate check 10 min by phone + form type, `LEAD_MODE=mock` writes `./.leads/*.json`).
- **Success:** progress heartbeat → check (§21.4, 600ms; reduced: none) → store `{ firstName, afterHours, reachVerb }` in `dawson.thankyou.v1` → `navigate("/thank-you?form=assessment|callback")`.
- **Failures:** COPY_CONVERSION §8.3 panel above the button, assertive; answers never cleared.
- Form region has `data-hides-mobile-bar`; Turnstile wrapper `data-cursor="none"`.

**Acceptance:** every message in COPY_CONVERSION §8.2 reachable and worded exactly; errors only on blur/submit; focus to error summary on failed Continue; quiz prefill ticks the right services; after-hours submit lands on the callback thank-you variant even if viewed after 8 AM; storage blocked → form works, no errors; axe clean on every step.

---

# 17. Referral & contact forms (07 §13)

Same pipeline as §16 (`react-hook-form` + zod + `lib/formMessages.ts`, error summary, honeypot, Turnstile, `LEAD_MODE`).

- **Referral** (`/for-professionals#refer`, `ReferralForm.tsx`): single page, three `<fieldset>`s with legends (COPY_CONVERSION §5.03). Conditional fields (role Other, specific date, town other) reveal with height 300ms (reduced: instant) and become required only when shown. Privacy panel above. No SMS consents. Submit **Send referral** → `/api/referral` → GHL tag `referral`, `form_type=referral` → `/thank-you?form=referral`. Date field: native `type="date"`, min today, max +12 months.
- **Contact** (`/contact#message`, `ContactForm.tsx`): topic select with polite topic hints; phone-or-email rule shown on both fields; same two SMS consents as the assessment; → `/thank-you?form=contact`.
- Both regions `data-hides-mobile-bar`.

**Acceptance:** client last initial accepts exactly one letter; no medical identifiers accepted (SSN/MBI patterns blocked); fax number visible near the form; success routes to the correct thank-you variant.

---

# 18. FAQ live search — /faq (07 §14)

Data/copy: COPY_COST_FAQ (`faq.ts`, `blocks.ts`).

```ts
// components/features/FaqSearch/FaqSearch.tsx
type FaqSearchProps = { groups: FaqGroup[]; items: FaqItem[] }; // items pre-filtered with isVisible()
```

- **Search:** visible label **Search questions**, helper, **Clear search** button. Debounce 150ms. Normalize: lowercase + `normalize("NFD").replace(/\p{Diacritic}/gu, "")`. Index = question + `blocksToText(answer)` + `keywords` (built once with `useMemo`).
- **Highlight:** `<mark>` around matched words in questions and visible answers — `orchid-100` background, `ink` text, weight 600 (not color alone). Never inside link text.
- Groups with no matches hide; ≤ 5 matches → those items open. Results count and no-results message in a polite live region (exact strings in copy).
- **Accordion:** question = H3 containing `<button aria-expanded aria-controls>`; panel `role="region"`. Height animation: Motion `height: 0 ↔ auto` 300ms inOut + opacity 200ms (reduced: instant). Several may be open. **Open all / Close all**.
- **Deep links:** `/faq#{id}` → open, scroll below header, focus the button. `/faq#topic-{group}` → scroll to group. Hash changes after load handled too.
- **Copy link:** `navigator.clipboard.writeText(\`https://dawsonhomecare.com/faq#${id}\`)` → label **Link copied** for 2s + polite announcement; clipboard failure → select-able text fallback.
- **No JS:** every answer renders expanded (static), search and Open all / Close all hidden.

**Acceptance:** "medicare" finds both Medicare items; "Alzheimer" finds nothing in production (hidden item); accents ignored; deep link `#cost` opens and focuses; highlights never break links; FAQPage schema lists only production-visible items.

---

# 19. Comfort controls (07 §17)

**Purpose:** an accessibility control panel that also says "we built this for your mom".

```ts
// components/layout/ComfortControls.tsx
type ComfortPrefs = { textScale: 1 | 1.12 | 1.25; contrast: "normal" | "high"; motion: "system" | "reduce" };
// storage: localStorage "dawson.comfort.v1" via useLocalPref (try/catch)
```

- **Trigger:** floating button bottom-left, 56px, `plum-800` with white icon (lucide `Accessibility`) + visible text label (proposed **Comfort settings**, Appendix B) on ≥ 768px; icon-only with the same accessible name on mobile. On mobile it sits above the action bar.
- **Panel:** non-modal dialog (`role="dialog" aria-labelledby`), anchored above the button, `white` card, 1px `line` border. Opens with opacity + y 8→0 200ms (reduced: instant). Escape or the close button closes and returns focus to the trigger; click outside closes.
- **Controls** (all native, 48px rows):
  - **Text size:** radio group, three options (proposed labels: Standard · Larger · Largest = 100 / 112 / 125%) → `--text-scale` on `<html>` (BRAND_FINAL §2a).
  - **High contrast:** switch → `html[data-contrast="high"]` (BRAND_FINAL §1.7 token remaps; cursor unmounts, glows off).
  - **Reduce motion:** switch → `html[data-motion="reduce"]` (forces reduced mode site-wide: scenes rebuild static, Lenis off, cursor off, marquee static, curtain off).
  - **Reset to default** (proposed).
- Changes apply instantly, persist, and are read pre-paint by the head script (§0.9). After a text-size change: `ScrollTrigger.refresh()` and scene-mode re-evaluation (§0.4).
- The panel never animates layout of the page itself; text-size changes reflow instantly.

**Acceptance:** each setting applies without reload and survives reload; no flash of default settings on reload (filmstrip); with storage blocked, settings work for the session view only and nothing errors; keyboard: Tab into panel, operate, Escape returns focus; all three settings combined pass axe at 320px.

---

# 20. Scroll storytelling system (07 §18)

## 20.1 `Reveal` and `SplitLines`

```ts
type RevealProps = { as?: ElementType; delay?: number; y?: number /* default 24 */; once?: boolean /* default true */; threshold?: number /* 0.2 */ };
type SplitLinesProps = { as: "h1" | "h2" | "p"; children: string; stagger?: number /* 80 */ };
```

- `Reveal`: IntersectionObserver (`rootMargin: "0px 0px -10% 0px"`), opacity 0→1 + y 24→0, 750ms outExpo, once. Initial hidden state applied **only after hydration in full mode** (class added by JS), so no-JS and reduced users see content immediately.
- `SplitLines`: GSAP SplitText `{ type: "lines", mask: "lines", autoSplit: true, aria: "none" }`; lines rise 24px (yPercent 100 → 0 inside the mask) + fade, stagger 80ms, 750ms outExpo; **`split.revert()` on complete** (restores the original DOM — screen readers and text selection unaffected). Lines only, never words or characters (03 §5). Re-split happens automatically on resize via `autoSplit`.
- Images: `ImageReveal` — `clip-path: inset(8%)` → `inset(0)` + scale 1.06 → 1, 900ms outExpo, once (03 §5). Placeholders get the same treatment.

## 20.2 Hero (Home ch. 1)

- On load (not scroll): logo intro (§7), office chip fades in at 200ms, H1 `SplitLines` at 300ms, subline `Reveal` at 600ms, buttons at 700ms, trust row at 800ms; collage images `ImageReveal` staggered 120ms starting at 400ms.
- **Parallax** on the collage only (never text, 03 §5): `hero-2` moves −8% and `hero-3` −12% of their own height across the hero's scroll range (`scrub: true`, start "top top", end "bottom top"). Dusk glow blob is static.
- Reduced: everything visible at once, no parallax.

## 20.3 Chapter eyebrows & progress line (Home)

- Eyebrows "01 — The moment" etc. are static text (`text-eyebrow`, `orchid-700` on light; `orchid-100`/`plum-100` on dark, BRAND_FINAL §1.4 #4).
- **Chapter progress line** (`ChapterProgress.tsx`, Home only): fixed 3px line directly under the sticky header, `aria-hidden`. `transform: scaleX(progress)` (origin left) where progress = Home scroll position from ch. 2 start to ch. 14 end, updated from Lenis/window scroll. A 24×12 heartbeat blip glyph rides at the tip. Color `orchid-500`; inside `[data-surface="dusk"]` (when the final band is under it) it switches to `cream` (BRAND_FINAL §1.4 #17). Reduced: still updates with scroll (user-driven), no smoothing, no blip motion.

## 20.4 Since 2002 counter (Home ch. 6)

- The visible counter (Fraunces `display-xl`, `plum-800`) is `aria-hidden`; the H2 "{years} years caring for Lowcountry families" carries the number (COPY_HOME).
- At 50% visibility, once: count 0 → `{years}` (from `lib/years.ts`), 1200ms outExpo, integers only. Timeline ticks: the 2002 → `{currentYear}` line draws (dashoffset 1→0, 900ms inOut), the two labelled ticks fade in at the ends (decade ticks unlabelled, `aria-hidden`).
- Only real, computed numbers ever count (07 §18). Reduced: final number, drawn line.

## 20.5 Owner signature (Home ch. 7)

When `owner-signature.svg` is real: stroke draws once at 50% visibility, 1400ms inOut (`pathLength=1`). Placeholder state: static placeholder, no animation. Reduced: static.

**Acceptance:** no content is hidden for no-JS or reduced users; SplitLines leaves the original DOM after completion (no `div.line` wrappers remain); parallax never applies to text; counter shows the computed year count (2026 → 24) and never a hard-coded number.

---

# 21. Micro-interactions (07 §20)

## 21.1 Buttons

- Hover (fine pointer): translateY 0 → −2px, 200ms outExpo; primary adds BRAND_FINAL's 12% white hover overlay; Call button `plum-800 → plum-600`. Press: translateY 0, scale 0.98, 120ms.
- **"Soft shadow" is on hold:** BRAND_FINAL rule 8 doesn't list shadows among allowed alpha uses. `--shadow-soft: none` until approved (see Spec decisions). Lift only.
- **Phone icon ring:** on hover start of any Call button, the lucide `Phone` icon rotates −12° → 10° → −6° → 0°, 500ms inOut, **once per hover**. Not on focus (keeps keyboard calm). Reduced: none.
- Disabled: BRAND_FINAL §1.4 #20 (bg `line`, text `muted`, no lift, `aria-disabled`).

## 21.2 Cards — tilt

- Desktop fine pointer only, motion full, contrast normal: on `pointermove`, `rotateX/rotateY` up to **3°** toward the pointer via `gsap.quickTo` (300ms), `perspective: 900px`; on leave back to 0 in 360ms outExpo. Applies to service cards, room cards (static grid), town cards. Never to cards with forms or text inputs.
- Reduced / touch / high contrast: off.

## 21.3 Checklist ticks

- **Service pages "This helps if…" and the agency questions checklist:** native checkbox, custom visual = 28px `plum-800` circle with a `leaf-500` tick (7.67:1, BRAND_FINAL §1.4 #2 pattern) — the "leaf-green check" without failing contrast. Tick path draws 0→1 in 250ms outExpo, circle scales 0.8→1 200ms. Unchecked: 1.5px `muted` ring.
- **Form checkboxes** (consents, services) keep BRAND_FINAL §1.5: `plum-800` fill + white tick, no flourish beyond a 200ms fade.
- Reduced: instant.

## 21.4 Form success / quiz result — heartbeat → check

Shared `HeartbeatProgress complete` animation, 600ms total:

| ms | Element | Property | Ease |
|---|---|---|---|
| 0 → 300 | Heartbeat fill | dashoffset → 0 (completes if not full) | inOut |
| 200 → 500 | Heartbeat path | dashoffset 0 → −1 (un-draws forward) | inOut |
| 250 → 600 | Check path (`leaf-700` on light, 3px) inside a 40px `leaf-100` circle | dashoffset 1 → 0 | outExpo |

Then the caller navigates (form) or reveals the result (quiz). Reduced: static check, immediate continue.

## 21.5 404 porch light

404 illustration = the Dawson House at dusk, porch light on (static line art, `aria-hidden`). On load, once: porch-light glow (`orchid-500` ellipse, the same decorative alpha as the room glow) opacity 0 → 0.3 → 0.18, 1200ms inOut. Reduced: static at 0.18.

**Acceptance:** micro-interactions never move layout (transforms only); every one is off in reduced mode; phone icon rings once per hover, not repeatedly while hovering.

---
---

# Appendix A — 07 → spec map

| 07 § | Feature | Spec § |
|---|---|---|
| 1 | Care Quiz | 4 |
| 2 | Cost Estimator | 5 |
| 3 | The Dawson House | 2 |
| 4 | How-It-Works timeline | 3 |
| 5 | Service-Area Map | 6 |
| 6 | Payment Explorer | 10 |
| 7 | Reviews | 11 |
| 8 | Meet-the-Owner video | 12 |
| 9 | Caregiver carousel | 13 |
| 10 | Sticky mobile action bar | 14 |
| 11 | Office-status chip & after-hours | 15 |
| 12 | Free Care Assessment form | 16 |
| 13 | Professional referral portal | 17 |
| 14 | FAQ live search | 18 |
| 15 | Interactive logo | 7 (+ BRAND_FINAL §3) |
| 16 | Interactive cursor | 8 (+ BRAND_FINAL §4) |
| 17 | Comfort controls | 19 |
| 18 | Scroll storytelling system | 20 (+ The Moment §1) |
| 19 | Page transitions | 9 |
| 20 | Micro-interactions | 21 |

---

# Appendix B — Strings not in approved copy (proposed — approve before final)

None of these exist in a COPY_*.md file. Add them to the relevant COPY file (or replace) before launch.

| Where | String | Role |
|---|---|---|
| Dawson House, mobile carousel | **Previous room** · **Next room** | Arrow button accessible names |
| Dawson House, mobile carousel | Rooms in the Dawson House | Carousel region `aria-label` |
| Area Map | **Check** | Town search submit button |
| Area Map | Skip the map to the town list | Skip link before markers |
| Area Map, town without page | {town}: about {drive} minutes from our office. Call to check. Moves to {town} in the town list. | Marker `aria-label` |
| Comfort controls | **Comfort settings** | Trigger button + panel heading |
| Comfort controls | **Text size** · Standard · Larger · Largest | Radio group + options (100/112/125%) |
| Comfort controls | **High contrast** — Darker borders and underlined links. | Switch + helper |
| Comfort controls | **Reduce motion** — Turns off animation and moving content. | Switch + helper |
| Comfort controls | **Reset to default** · **Close** | Buttons |
| Site layout | Skip to main content | Global skip link |

---

# Appendix C — Test matrix (Playwright + axe)

| Project | Device | Motion | Extras |
|---|---|---|---|
| `desktop-full` | 1280×800 Chrome | full | Lenis on, cursor on |
| `desktop-reduced` | 1280×800 Chrome | `emulateMedia({ reducedMotion: "reduce" })` | asserts no pins / no running tweens |
| `desktop-comfort` | 1280×720 Chrome | Comfort reduce + 125% text + high contrast | scene fallback, cursor absent |
| `mobile` | iPhone 13 (WebKit) | full | mobile bar, carousels, no cursor bundle |
| `mobile-android` | Pixel 7 (Chromium), CPU 4× throttle | full | INP/long tasks during scenes |
| `nojs` | 1280×800, `javaScriptEnabled: false` | — | static House grid, list Moment, quiz fallback link, FAQ answers visible |

Every project runs axe on every route and the feature checks listed in each section's acceptance criteria. Unit tests (Vitest): `estimate.ts`, `officeHours.ts`, `quiz.ts` (`buildResult`, presets parity), `areas.ts` (`matchAreas`), `projection.ts`, `buildHeartbeatPath`.

---
---

# Spec decisions (deviations from 06/07, with reasons)

1. **Dawson House rooms are links, not buttons.** 06 says "rooms are buttons"; 07 and COPY_HOME say `<a>` with aria-labels. They navigate, so they're links.
2. **Dawson House scene-mode card is `aria-hidden` and not focusable**; the five room links are the keyboard/AT path. In scene mode the service names are therefore links rather than H3s (the H3s exist in mobile and static modes). Avoids duplicate tab stops for the same five destinations.
3. **Dawson House mobile: SVG hidden from assistive tech**; the carousel cards (with real links) are the accessible path. Tapping rooms still works for touch.
4. **Pinned scenes need ≥ 1024×640** (and ≥ 760px tall at 125% text). Below that: an un-pinned mobile version. Pinning on phones fights the browser chrome and Comfort text sizes.
5. **The Moment's "morphing" illustrations are a draw hand-off** (outgoing un-draws forward while the incoming draws) instead of path morphing — robust across five unrelated drawings.
6. **Quiz single-select answers are buttons with `aria-pressed`, not radios** — arrow-key selection plus auto-advance would skip questions.
7. **Cost Estimator ships with all rates `null` → hours-only mode.** No price is invented. Recommendation: keep hours-only at the reveal and ask the client for their real range. Alternative: enter an illustrative range from a named public cost-of-care survey for South Carolina, with `rateSource` filled and the "Illustrative estimate" badge on.
8. **Map markers are HTML links over an SVG base**, not SVG `<a>` dots — crisp sizing, standard focus rings, Comfort text-size support, simpler hit areas.
9. **Map is visual-only below 768px**; search + list are the interactive layer (markers too dense to tap reliably; the list is the equivalent control).
10. **Office-pin ripple runs 3 cycles, then stops** (replays on hover/focus) — avoids a pause control under WCAG 2.2.2, matching BRAND_FINAL's footer-logo reasoning.
11. **Logo parts are targeted by `data-part`, not `id`, in React** — header + footer logos would otherwise create duplicate ids. Static exported files keep BRAND_FINAL ids.
12. **Page-transition curtain shows the stacked logo only on slow routes** (> 600ms); fast navigations show the heartbeat sweep only. Navigation starts at the beginning of the cover, so the curtain adds no wait.
13. **Back/forward navigation has no curtain and doesn't move focus.**
14. **Button "soft shadow" (07 §20) is on hold** until a shadow alpha is approved: BRAND_FINAL rule 8 doesn't list shadows as an allowed alpha use. Proposal to add: `--shadow-soft: 0 8px 24px color-mix(in srgb, var(--plum-950) 10%, transparent)` (a locked token at 10% — no new hex).
15. **Service-page checklist ticks use a `leaf-500` tick inside a `plum-800` circle** (the BRAND_FINAL-approved way to get "leaf green" on light); form checkboxes keep the white tick.
16. **Owner video plays inline, not in a modal.**
17. **Reviews marquee speed 30px/s; reduced motion shows a static scrollable row.**
