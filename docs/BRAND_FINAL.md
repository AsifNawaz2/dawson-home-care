# BRAND_FINAL — Dawson & Dawson Home Care

**Status:** Final for build — all decisions resolved (19 Oct 2026). **Where this file differs from `03_BRAND_SYSTEM.md`, this file wins** (per the project instructions); §5 "Changes vs 03" lists every difference. The palette has **16 tokens**: the 15 from 03 plus the approved error token `alert-700 #B42318`.
**Scope:** contrast stress test · design tokens (CSS + Tailwind v4) · rebuilt logo (5 versions + motion) · interactive cursor handoff.
**Method:** every ratio below is computed from the locked hex values with the WCAG 2.x relative-luminance formula. Thresholds: **4.5:1** normal text · **3:1** large text (≥24px regular, or ≥18.66px bold) · **3:1** non-text (icons, input borders, focus indicators, meaningful graphics). All 13 ratios listed in 03 were re-checked and are correct.

---

## 1. Contrast stress test

### 1.1 The rules in one screen (give this to every designer)

1. **Light surfaces** (cream, white, plum-100, orchid-100, leaf-100): text is **ink, plum-950, plum-800, plum-600, muted, orchid-700 or leaf-700**. Nothing else.
2. **Dark surfaces** (plum-950, plum-800, plum-600): text is **white, cream, plum-100, orchid-100, leaf-100 or leaf-500**. Never muted, orchid-700 or leaf-700.
3. **leaf-500 is a fill, not a text color on light.** Text on it is always plum-950 (or ink / plum-800).
4. **orchid-500 is decoration.** Text in orchid-500 only at display-l and larger (≥40px). Icons/lines in orchid-500 are fine (≥3:1 on every light surface).
5. **Dusk:** small text and buttons live in the plum half (first 55%). Only display text crosses into orchid.
6. **Links in body copy are always underlined.** orchid-700 vs surrounding ink is 2.70:1 — color alone doesn't identify a link.
7. **`line` is never a meaningful border.** Inputs, checkboxes, radios and selected states use muted or plum-800.
8. **No opacity on text.** Every alpha value creates an untested color. Alpha is allowed only for the decorative uses named in 03 (cursor fills, room glow, button hover overlay).
9. **No text on photos or placeholders.** Captions sit below the image. (No scrim color exists in the palette.)
10. **State is never color-only.** Selected / error / open / closed always add an icon, a border change or words.
11. **alert-700 is for errors only** — error text, error icon, 2px error border. Never a fill, never decorative, never on dark surfaces.
12. **14px is the only size below 16px**, and only for eyebrows (uppercase, 700, tracked) and the cursor label.

### 1.2 Approved pairings (the full matrix, by surface)

**Text on light surfaces**

| Text ↓ / Surface → | cream | white | plum-100 | orchid-100 | leaf-100 | Verdict |
|---|---|---|---|---|---|---|
| ink | 16.01 | 16.96 | 14.26 | 14.61 | 15.23 | All text |
| plum-950 | 16.73 | 17.72 | 14.89 | 15.26 | 15.91 | All text |
| plum-800 | 14.54 | 15.40 | 12.94 | 13.26 | 13.83 | All text |
| plum-600 | 9.44 | 10.01 | 8.41 | 8.61 | 8.98 | All text |
| muted | 6.59 | 6.98 | 5.86 | 6.01 | 6.26 | All text |
| orchid-700 | 5.93 | 6.29 | 5.28 | 5.41 | 5.64 | All text |
| leaf-700 | 5.29 | 5.60 | 4.71 | 4.82 | 5.03 | All text (thinnest margin on plum-100 — keep weight ≥500 there) |
| alert-700 | 6.21 | 6.57 | 5.52 | 5.66 | 5.90 | Error messages only (never on leaf-100 — success and error never share a surface) |
| orchid-500 | 3.42 | 3.63 | 3.05 | 3.12 | 3.25 | Large text + icons only |
| leaf-500 | 1.90 | 2.01 | 1.69 | 1.73 | 1.80 | **Never** (not even icons) |
| line | 1.21 | 1.28 | 1.08 | 1.10 | 1.15 | **Never** for text or meaningful borders |

**Text on dark surfaces**

| Text ↓ / Surface → | plum-950 | plum-800 | plum-600 | Verdict |
|---|---|---|---|---|
| white | 17.72 | 15.40 | 10.01 | All text |
| cream | 16.73 | 14.54 | 9.44 | All text |
| leaf-100 | 15.91 | 13.83 | 8.98 | All text |
| orchid-100 | 15.26 | 13.26 | 8.61 | All text |
| plum-100 | 14.89 | 12.94 | 8.41 | All text |
| leaf-500 | 8.82 | 7.67 | 4.98 | All text |
| orchid-500 | 4.89 | 4.25 | 2.76 | plum-950: passes, but keep it decorative (rule 4). plum-800: large only. plum-600: **fail** |
| leaf-700 | 3.16 | 2.75 | 1.79 | **Never** |
| orchid-700 | 2.82 | 2.45 | 1.59 | **Never** |
| muted | 2.54 | 2.21 | 1.43 | **Never** |

**Text on saturated fills**

| Fill | Passing text | Failing text |
|---|---|---|
| leaf-500 (green button, success fills) | plum-950 8.82 · ink 8.44 · plum-800 7.67 · plum-600 4.98 | white 2.01 · cream 1.90 |
| leaf-500 + 12% white hover overlay (`#A1CE3D`) | plum-950 9.63 | — |
| orchid-500 | plum-950 4.89 · ink 4.68 | plum-800 4.25 (large only) · white 3.63 (large only) · cream 3.42 (large only) |
| orchid-700 | white 6.29 · cream 5.93 | plum-950 2.82 |
| leaf-700 | white 5.60 · cream 5.29 | plum-950 3.16 |

> orchid-700 and leaf-700 fills pass with white text, but they are **not** in the button system. Don't let a designer invent a "dark green button" or "orchid button" from them — the button system in 03 stays as is.

### 1.3 The Dusk gradient, measured

`linear-gradient(135deg, #2A1856 0%, #4B2E91 55%, #C25BD9 100%)`, sampled along the gradient line:

| Position | Color | white | cream | leaf-500 | plum-950 |
|---|---|---|---|---|---|
| 0% | #2A1856 | 15.40 | 14.54 | 7.67 | — |
| 55% | #4B2E91 | 10.01 | 9.44 | **4.98** | — |
| 60% | #583399 | 8.94 | 8.44 | 4.45 ✗ | — |
| 75% | #8042B1 | 6.30 | 5.95 | 3.14 (large only) | — |
| 85% | #9A4CC1 | 5.03 | 4.74 | 2.50 ✗ | — |
| 90% | #A851C9 | **4.48 ✗** | 4.23 ✗ | 2.23 ✗ | — |
| 100% | #C25BD9 | 3.63 | 3.42 | 1.80 ✗ | 4.89 |

**Rules on Dusk**
- Small white/cream text and the ghost button: within 0–55% (the plum half). Technically white holds AA to 85%, but 55% is the rule because the gradient position of any given word changes with viewport width.
- leaf-500 text (e.g. an italic accent word): **0–55% only**. leaf-500 display text (≥24px) may run to 75%.
- The green button (leaf-500 fill, plum-950 text) is fine anywhere — its contrast is internal to the button.
- Display headlines (display-l and up) in white may cross the whole gradient.
- Verify with axe at 320 / 390 / 768 / 1280 / 1440 widths; gradient-text positions shift per breakpoint.

### 1.4 Pairings a designer will be tempted to use — and fail

Ordered by how likely they are to show up in a mockup.

| # | Tempting pairing | Ratio | Where it'll happen | Use instead |
|---|---|---|---|---|
| 1 | White text on leaf-500 | 2.01 | The green CTA (today's bug), "Office open" pill, success toast | **plum-950 on leaf-500** (8.82) |
| 2 | leaf-500 text, ticks or icons on cream/white | 1.90 / 2.01 | Service-page "This helps if…" ticks, success checkmarks, "open" dot, highlighted words, progress fills | **leaf-700** (5.29 / 5.60). For a bright check, put a leaf-500 tick inside a plum-800 circle (7.67) |
| 3 | orchid-500 for eyebrows, small labels, links, captions on light | 3.42 | Section eyebrows ("01 — The moment"), "HOME CARE"-style labels, card links | **orchid-700** (5.93) — already the eyebrow token |
| 4 | orchid-700 eyebrow on dark sections | 2.82 on plum-950 | Footer headings, final CTA band, Pros band | **orchid-100** (15.26) or **plum-100** (14.89); **leaf-500** (8.82) for emphasis |
| 5 | muted for secondary text on dark | 2.54 / 2.21 | Footer captions, legal line, "Office hours" label in footer | **plum-100** (14.89 / 12.94) |
| 6 | leaf-700 on dark | 3.16 | "Care 24/7" line in footer, success state on dark | **leaf-500** (8.82) |
| 7 | leaf-500 accent word on Dusk past the plum half | 1.80 at orchid end | Hero/Final CTA italic "*family*" (the palette preview does this) | Keep the accent word in the 0–55% zone, or set it in italic **cream** |
| 8 | Cream ghost button or small white text toward the orchid end of Dusk | 3.42–4.48 | Final CTA band "Call" ghost button on wide screens, Dusk cards | Keep inside 0–55%; left-align band content on mobile |
| 9 | White small text on orchid-500 | 3.63 | "Illustrative estimate" badge, "New" tags, quiz chips | **orchid-700 text on orchid-100** (5.41) or **plum-950 on orchid-500** (4.89) |
| 10 | plum-800 text on orchid-500 | 4.25 | Orchid tag with brand-plum text | **plum-950** (4.89) or **ink** (4.68) |
| 11 | orchid-700 links in body text without underline | 2.70 vs ink | Inline links in FAQs, legal pages, service copy | Always underline (1px, offset 3px). Nav and button links are exempt |
| 12 | `line` as input / checkbox / radio border | 1.28 on white · 1.21 on cream | Assessment form, quiz, referral form, consent checkboxes | **1.5px muted** border (6.98 / 6.59); focus/selected → 2px plum-800 |
| 13 | Selected state by fill only (white → plum-100 / orchid-100) | 1.19 / 1.16 | Quiz answer cards, Payment Explorer tabs, filter chips, service multi-select | Fill change **plus** 2px plum-800 border **plus** a check icon (plum-800) |
| 14 | leaf-500 focus ring alone on light | 1.90 on cream | Every focusable element | 3px leaf-500 outline + **2px plum-950 inner ring** (16.73) — see §2 `--ring` |
| 15 | leaf-500 focus ring on Dusk's orchid end | 1.80 | Buttons in the final CTA band | On Dusk use a **3px cream** ring (≥3.42 everywhere on the gradient) |
| 16 | leaf-500 slider fill / progress bar on light | 1.90 | Cost estimator slider, quiz progress, form step bar | **plum-800** fill and thumb (14.54); unfilled track 1.5px muted |
| 17 | orchid-500 heartbeat/progress line over Dusk | 1.00 at orchid end | Top-of-page chapter progress line passing over the final band | Switch the line to **cream** inside `[data-surface="dusk"]` |
| 18 | orchid-500 text at h3 size | 3.42 at 22px (not "large") | Card titles in orchid for flair | plum-800 or orchid-700. orchid-500 text only at ≥40px |
| 19 | alert-700 error text with no icon, or alert-700 used as a fill/badge | 2.58 vs ink | Form validation, "required" markers | See §1.6 — error = alert-700 icon + words + 2px alert-700 border; required fields marked with the word "(required)", not a red asterisk |
| 20 | Disabled button styled as a pale green with plum text | — | "Next" button before a quiz answer is picked | bg `line`, text `muted` (5.45), no lift, no cursor grow, `aria-disabled="true"` |

### 1.5 Non-text contrast (WCAG 1.4.11) — component rules

| Component | Light surface | Dark surface |
|---|---|---|
| Focus indicator | 3px leaf-500 outline, 3px offset, + 2px plum-950 inner ring (box-shadow) | 3px leaf-500 outline, 3px offset (8.82 on plum-950) |
| Focus indicator on Dusk | — | 3px cream outline, 3px offset |
| Text input / textarea / select border | 1.5px muted; hover 1.5px plum-600; focus 2px plum-800 + ring | — (no forms on dark) |
| Checkbox / radio | 1.5px muted box; checked = plum-800 fill + white tick (15.40) | — |
| Toggle (estimator "Overnight") | Off: muted track outline + muted knob; On: plum-800 track + white knob | — |
| Slider | Filled track + thumb plum-800; unfilled track muted 1.5px | — |
| Office status — open | leaf-100 chip, leaf-700 dot + leaf-700 text (5.03) + "Office open now" | leaf-500 dot + cream text |
| Office status — closed | plum-100 chip, plum-800 moon icon + text (12.94) | plum-100 moon + text |
| Meaningful icons | plum-800, orchid-700, leaf-700, or orchid-500 (3.42 — passes 3:1) | white, cream, leaf-500, plum-100 |
| Decorative icons/illustration | Any token (they are `aria-hidden`) | Any token |
| Card borders | `line` is fine — cards are identified by content and spacing, not by the border | — |
| Map town dots (Area Map) | plum-800 dots; hovered/focused = orchid-500 dot + plum-800 2px outline + text label | — |
| Dawson House room glow | Decorative (orchid-500 @ 30%); the label card carries the meaning | — |

### 1.6 Error state — `alert-700 #B42318` (approved)

The 15 tokens in 03 had no error color; forms (assessment, referral, quiz, contact, consent) need one. **Approved addition: `alert-700 #B42318`** — the same value the palette preview already used for its "Fail" label, now tokenized. It is the 16th and final token.

| Pair | Ratio | Allowed |
|---|---|---|
| alert-700 on white | 6.57 | Error text, icon, border |
| alert-700 on cream | 6.21 | Error text, icon, border |
| alert-700 on orchid-100 | 5.66 | Error text inside quiz cards |
| alert-700 on plum-100 | 5.52 | Error text inside lavender panels |
| alert-700 vs ink | 2.58 | Too close to body text to signal an error on its own → always add the icon |

**Error pattern (every form, every field):**
- Field border → 2px alert-700 (replaces the 1.5px muted border).
- Below the field: lucide `CircleAlert` (alert-700, 20px) + message in alert-700, 16px, weight 500, saying what's wrong and how to fix it — "Please enter a 10-digit phone number, like (843) 555-0123."
- `aria-invalid="true"` on the field, `aria-describedby` pointing to the message.
- On submit with errors: an error summary at the top of the step (plum-100 panel, 2px alert-700 left border, heading in plum-800, list of links to each field in alert-700, underlined); focus moves to the summary heading.
- Errors appear on blur or on submit — never while the person is still typing.

**Never:** alert-700 as a background fill, a button color, a badge, decoration, or on plum-950 / plum-800 / plum-600 (2.70 / 2.34 / 1.52 — there are no forms on dark surfaces anyway).

### 1.7 High-contrast mode (Comfort Controls)

`html[data-contrast="high"]` remaps tokens to other locked tokens — no new colors:

| Token | Normal | High contrast |
|---|---|---|
| `--color-muted` | #5B5670 | → ink |
| `--color-line` | #E7E1EE | → plum-800 |
| orchid-500 decorative glows, blobs, grain, cursor ring | on | off |
| Dusk gradient surfaces | gradient | solid plum-950 |
| Links (all, incl. nav) | underline in body only | underline everywhere |
| Card borders | 1px line | 2px plum-800 |

---

## 2. Design tokens

Only locked hex values: the 15 tokens from 03 plus the approved `alert-700` (§1.6).

### 2a. CSS `:root` block (`styles/globals.css`, for GSAP, inline SVG, the cursor and anything outside Tailwind)

```css
:root {
  /* ---------- Color (locked) ---------- */
  --plum-950: #1C0F3D;
  --plum-800: #2A1856;
  --plum-600: #4B2E91;
  --plum-100: #EEE9F8;
  --orchid-500: #C25BD9;
  --orchid-700: #8E3BA8;
  --orchid-100: #F6EAFB;
  --leaf-500: #94C723;
  --leaf-700: #4A7309;
  --leaf-100: #EEF6DC;
  --cream: #FBF8F3;
  --white: #FFFFFF;
  --ink: #1E1A2B;
  --muted: #5B5670;
  --line: #E7E1EE;
  --alert-700: #B42318;  /* errors only — text, icon, 2px border */

  /* ---------- Signature gradient (the only one) ---------- */
  --dusk: linear-gradient(135deg, #2A1856 0%, #4B2E91 55%, #C25BD9 100%);

  /* ---------- Type ---------- */
  --font-display: var(--font-fraunces), Georgia, "Times New Roman", serif;
  --font-body: var(--font-jakarta), system-ui, -apple-system, "Segoe UI", sans-serif;
  --text-scale: 1;                 /* Comfort Controls: 1 | 1.12 | 1.25 */

  --fs-display-xl: clamp(3rem, 1.944rem + 4.507vw, 6rem);      /* 48 → 96 */
  --fs-display-l:  clamp(2.5rem, 1.796rem + 3.005vw, 4.5rem);  /* 40 → 72 */
  --fs-h1:         clamp(2.25rem, 1.81rem + 1.878vw, 3.5rem);  /* 36 → 56 */
  --fs-h2:         clamp(1.875rem, 1.567rem + 1.315vw, 2.75rem); /* 30 → 44 */
  --fs-h3:         clamp(1.375rem, 1.243rem + 0.5634vw, 1.75rem); /* 22 → 28 */
  --fs-lead:       clamp(1.25rem, 1.162rem + 0.3756vw, 1.5rem); /* 20 → 24 */
  --fs-body: 1.125rem;   /* 18 */
  --fs-small: 1rem;      /* 16 — minimum for running text */
  --fs-eyebrow: 0.875rem;/* 14 — the only sub-16 size: eyebrows (uppercase 700, tracked) + cursor label */

  /* ---------- Shape ---------- */
  --radius-pill: 999px;
  --radius-card: 20px;
  --radius-input: 12px;
  --tap-min: 48px;
  --btn-height: 52px;
  --btn-pad-x: 28px;

  /* ---------- Motion ---------- */
  --ease-out-expo: cubic-bezier(0.22, 1, 0.36, 1);
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
  --dur-micro: 200ms;    /* 180–250 */
  --dur-ui: 360ms;       /* 300–450 */
  --dur-reveal: 750ms;   /* 600–900 */

  /* ---------- Focus ---------- */
  --ring-light: 0 0 0 2px var(--plum-950);  /* inner ring, pairs with outline below */
}

html { font-size: calc(100% * var(--text-scale)); background: var(--cream); color: var(--ink); }

:where(a, button, input, select, textarea, summary, [tabindex]):focus-visible {
  outline: 3px solid var(--leaf-500);
  outline-offset: 3px;
  box-shadow: var(--ring-light);
}
[data-surface="dark"] :focus-visible { box-shadow: none; }
[data-surface="dusk"] :focus-visible { outline-color: var(--cream); box-shadow: none; }

/* High-contrast mode — remaps to other locked tokens only */
html[data-contrast="high"] {
  --muted: var(--ink);
  --line: var(--plum-800);
  --dusk: linear-gradient(var(--plum-950), var(--plum-950)); /* solid plum-950, still a valid image */
}
```

### 2b. Tailwind v4 `@theme` block (`styles/globals.css`, top of file)

`--color-*: initial` and `--text-*: initial` wipe Tailwind's default palette and sizes, so `bg-blue-500` or `text-xs` simply don't exist — stray colors and sub-16px text become impossible to type.

```css
@import "tailwindcss";

@theme {
  /* Wipe defaults: only locked tokens exist */
  --color-*: initial;
  --text-*: initial;
  --font-*: initial;

  /* ---------- Color (locked) ---------- */
  --color-plum-950: #1C0F3D;
  --color-plum-800: #2A1856;
  --color-plum-600: #4B2E91;
  --color-plum-100: #EEE9F8;
  --color-orchid-500: #C25BD9;
  --color-orchid-700: #8E3BA8;
  --color-orchid-100: #F6EAFB;
  --color-leaf-500: #94C723;
  --color-leaf-700: #4A7309;
  --color-leaf-100: #EEF6DC;
  --color-cream: #FBF8F3;
  --color-white: #FFFFFF;
  --color-ink: #1E1A2B;
  --color-muted: #5B5670;
  --color-line: #E7E1EE;
  --color-alert-700: #B42318; /* errors only */

  /* ---------- Type scale ---------- */
  /* Fluid sizes interpolate between 375px and 1440px viewports */
  --text-display-xl: clamp(3rem, 1.944rem + 4.507vw, 6rem);
  --text-display-xl--line-height: 1.02;
  --text-display-xl--letter-spacing: -0.02em;
  --text-display-xl--font-weight: 500;

  --text-display-l: clamp(2.5rem, 1.796rem + 3.005vw, 4.5rem);
  --text-display-l--line-height: 1.05;
  --text-display-l--letter-spacing: -0.02em;
  --text-display-l--font-weight: 500;

  --text-h1: clamp(2.25rem, 1.81rem + 1.878vw, 3.5rem);
  --text-h1--line-height: 1.1;
  --text-h1--letter-spacing: -0.015em;
  --text-h1--font-weight: 500;

  --text-h2: clamp(1.875rem, 1.567rem + 1.315vw, 2.75rem);
  --text-h2--line-height: 1.15;
  --text-h2--letter-spacing: -0.01em;
  --text-h2--font-weight: 500;

  --text-h3: clamp(1.375rem, 1.243rem + 0.5634vw, 1.75rem);
  --text-h3--line-height: 1.3;
  --text-h3--font-weight: 600;

  --text-lead: clamp(1.25rem, 1.162rem + 0.3756vw, 1.5rem);
  --text-lead--line-height: 1.55;

  --text-base: 1.125rem;
  --text-base--line-height: 1.65;

  --text-sm: 1rem;
  --text-sm--line-height: 1.55;

  /* 14px: approved single exception to the 16px minimum — eyebrows only */
  --text-eyebrow: 0.875rem;
  --text-eyebrow--line-height: 1.4;
  --text-eyebrow--letter-spacing: 0.12em;
  --text-eyebrow--font-weight: 700;

  /* ---------- Shape ---------- */
  --radius-pill: 999px;
  --radius-card: 20px;
  --radius-input: 12px;

  /* ---------- Motion ---------- */
  --ease-out-expo: cubic-bezier(0.22, 1, 0.36, 1);
  --ease-in-out-soft: cubic-bezier(0.65, 0, 0.35, 1);
}

/* next/font CSS variables → font utilities (font-display, font-sans) */
@theme inline {
  --font-display: var(--font-fraunces), Georgia, "Times New Roman", serif;
  --font-sans: var(--font-jakarta), system-ui, -apple-system, "Segoe UI", sans-serif;
}

/* The one gradient */
@utility bg-dusk {
  background-image: var(--dusk); /* defined in :root (2a); high-contrast mode swaps it to solid plum-950 */
}

/* Reduced motion = OS setting OR Comfort Controls toggle */
@custom-variant reduce-motion {
  @media (prefers-reduced-motion: reduce) { @slot; }
  &:where(html[data-motion="reduce"] *) { @slot; }
}
@custom-variant high-contrast {
  &:where(html[data-contrast="high"] *) { @slot; }
}

@layer base {
  html { font-size: calc(100% * var(--text-scale, 1)); }
  body {
    @apply bg-cream text-ink font-sans text-base antialiased;
  }
  h1, h2, .font-display {
    font-family: var(--font-display);
    font-optical-sizing: auto;
    font-variation-settings: "SOFT" 50;
  }
  p { max-width: 65ch; }
}
```

`next/font` setup (in `app/layout.tsx`):

```ts
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
export const fraunces = Fraunces({
  subsets: ["latin"], variable: "--font-fraunces", display: "swap",
  style: ["normal", "italic"], axes: ["SOFT", "opsz"],
});
export const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"], variable: "--font-jakarta", display: "swap",
});
// <html className={`${fraunces.variable} ${jakarta.variable}`}>
```

Usage examples: `bg-leaf-500 text-plum-950` (primary CTA) · `bg-plum-800 text-white hover:bg-plum-600` (call CTA) · `text-eyebrow uppercase text-orchid-700` · `bg-dusk` · `reduce-motion:transition-none`.

---

## 3. Logo

### 3.0 Source note — read before tracing

`current-logo.png` is **not** in project knowledge (only the text docs and the palette preview are uploaded), and the source URL in 03 isn't reachable from this workspace. So this section specifies the rebuild from the elements documented in 03 — house with roof and window, figure, heartbeat line under the name, "Dawson & Dawson" + "HOME CARE" — plus everything that doesn't depend on exact geometry: group structure, colors, stroke ratios, versions, sizes and motion.

**Fidelity rule for Claude Code:** the PNG's geometry wins. Trace proportions, roof pitch, figure pose, line shape and letter spacing from the PNG (`docs/current-logo.png`); apply the colors, group IDs, stroke rules and motion hooks from this file. If you upload the PNG here, I'll replace §3.1–3.2 with exact element-by-element geometry.

**Trace check (confirm against the PNG while tracing):** chimney yes/no · door yes/no · window shape (square / four-pane / arched) · figure inside or beside the house · which way the figure faces · whether the heartbeat starts from the house or under the name only · whether "HOME CARE" sits above or below the heartbeat.

### 3.1 Construction — element by element (Option A: faithful)

All stroked elements: `stroke-linecap="round"`, `stroke-linejoin="round"`, `fill="none"` unless stated. Every stroke path gets `pathLength="1"` so the draw animation is `stroke-dasharray: 1; stroke-dashoffset: 1 → 0` without measuring.

Stroke weights are relative to the **mark height H** (house roof apex to ground line): house strokes **H/24**, heartbeat **H/32**, figure outline **H/48**. At the 44px header size that's ≈1.8px / 1.4px / 0.9px.

| Group ID | Element | Construction | Color (default) | Color (reversed, on plum-950) |
|---|---|---|---|---|
| `#house` | Container | Holds the three parts below; `transform-origin: 50% 100%` | — | — |
| `#house-roof` | Roof (+ chimney if present in PNG) | One open stroke path, apex to eaves. Separate path so it can lift on hover | plum-800 stroke | cream stroke |
| `#house-walls` | Walls, ground line, door if present | One stroke path | plum-800 stroke | cream stroke |
| `#window` | Window frame | Stroke path (panes as in PNG) | plum-800 stroke | cream stroke |
| `#window-light` | Glass | Filled shape inside the frame, no stroke | white fill (end state) | orchid-100 fill |
| `#window-glow` | Soft halo behind the window | Circle ≈1.6× window width, `filter: blur(H/16)`, **animation only, not in static exports** | orchid-500 @ 15% | orchid-500 @ 20% |
| `#figure` | Wheelchair figure (as in PNG) | Filled shapes: head (circle), torso/arm, chair, wheel. Wheel may be a stroke ring | leaf-500 fill + plum-800 outline at H/48 | leaf-500 fill, no outline |
| `#heartbeat` | EKG line | One open stroke path: flat → small bump → sharp peak → dip → flat, running under the name (shape traced from PNG) | orchid-500 stroke | orchid-500 stroke |
| `#heartbeat-pulse` | Travelling highlight | Duplicate of `#heartbeat` path, `stroke-dasharray: 0.12 1`, hidden at rest (`opacity: 0`) | leaf-500 stroke | leaf-500 stroke |
| `#wordmark-name` | "Dawson & Dawson" | **Outlined paths** (no live text). Fraunces 600, SOFT 50, opsz ≈72; ampersand in Fraunces Italic for warmth. Optical kerning hand-tuned on "Da" and "n &" | plum-800 fill | cream fill |
| `#wordmark-descriptor` | "HOME CARE" | Outlined paths. Plus Jakarta Sans 700, uppercase, tracking +0.24em, cap height ≈ 38% of the name's cap height | orchid-700 fill | orchid-500 fill (4.89 on plum-950) |

**Why the figure gets a plum-800 outline on light:** leaf-500 on cream is 1.90:1. Logos are exempt from WCAG contrast, but a lime figure on cream disappears at header size and on low-quality phone screens. The thin plum outline keeps the silhouette readable; on plum-950 the lime alone is 8.82:1, so no outline.

**Accessibility:** the header logo is `<a href="/" aria-label="Dawson & Dawson Home Care — home">` wrapping `<svg aria-hidden="true" focusable="false">`. Standalone/static exports carry `<title>Dawson &amp; Dawson Home Care</title>` and `role="img"`.

### 3.2 The five versions

| # | Version | Layout | Min size | Used in | File |
|---|---|---|---|---|---|
| 1 | **Horizontal** | Mark left, name right, heartbeat under name, "HOME CARE" placed as in PNG | 180px wide | Header (desktop 44px tall, mobile 36px), email signature, PDFs | `/public/logo/dd-horizontal.svg` |
| 2 | **Stacked** | Mark centered on top; name centered below; heartbeat under name, full name width; "HOME CARE" centered beneath | 140px wide | Footer, page-transition curtain, 404, OG template | `/public/logo/dd-stacked.svg` |
| 3 | **Mark** | House + window + figure + a short heartbeat stub running out of the ground line (stub = 0.6H long). **≤32px:** drop the stub and window frame detail; stroke thickens to H/12 | 24px (≤32px uses the simplified cut) | Compact header on scroll, favicon set, app icons, social avatar | `/public/logo/dd-mark.svg`, `dd-mark-small.svg` |
| 4 | **Reversed** | Horizontal and stacked variants with the reversed colors in §3.1 | Same as 1 / 2 | **plum-950 surfaces only** (footer). On plum-800 or Dusk use version 5 (cream) — orchid-500 "HOME CARE" drops to 4.25 on plum-800 and vanishes on the orchid end of Dusk | `dd-horizontal-reversed.svg`, `dd-stacked-reversed.svg` |
| 5 | **Mono** | Every element one color; window light becomes a knockout (transparent), figure filled, no outline, no glow | Same as 1–3 | **Mono plum-800:** fax cover, printed referral sheet, one-color print, stamps. **Mono cream:** photos (later), plum-800 and Dusk surfaces | `dd-*-mono-plum.svg`, `dd-*-mono-cream.svg` |

**Clear space:** on all sides, at least the height of the house window (call it *w*). Mark-only: 25% of mark width.
**Don'ts:** no recoloring outside these five, no outlines/shadows/glows in static use, no stretching, no placing the default version on Dusk or photos, never live text for the wordmark.

**Favicon & app icons**
- `app/icon.svg` — mark (simplified), plum-800 strokes, leaf-500 figure, transparent background, with an internal `@media (prefers-color-scheme: dark)` rule switching plum-800 → cream (figure stays leaf-500).
- `app/favicon.ico` — 16 / 32 / 48 from the simplified mark.
- `app/apple-icon.png` — 180×180, cream background, mark at 70% of canvas, centered.
- Manifest icons 192 / 512 — cream background, mark inside the 80% maskable safe zone.
- `theme-color`: `#FBF8F3` (cream).

### 3.3 Motion — exact timelines

**Component API (for Claude Code):**
`<Logo variant="horizontal | stacked | mark" tone="default | reversed | mono-plum | mono-cream" intro={boolean} compact={boolean} idle="none | footer" />`
Implementation: one inline SVG per variant, GSAP for the intro and compact timelines, CSS keyframes for hover and footer pulse. Animate only `transform`, `opacity`, `stroke-dashoffset`, `fill-opacity` / `fill` on small shapes.

#### A. First-visit load (header, total 1,400ms)

Plays once per browser session, on whichever page the visitor lands. Header is fully interactive from 0ms — the intro never blocks clicks.

| Start → End (ms) | Element | Property: from → to | Ease |
|---|---|---|---|
| 0 → 450 | `#house-roof` | dashoffset 1 → 0 | in-out `(0.65,0,0.35,1)` |
| 150 → 900 | `#house-walls`, `#window` | dashoffset 1 → 0 | in-out |
| 600 → 900 | `#figure` | opacity 0 → 1, scale 0.94 → 1 (origin bottom center) | out-expo `(0.22,1,0.36,1)` |
| 700 → 1050 | `#window-light` | fill orchid-100 → white, fill-opacity 0 → 1 | out-expo |
| 700 → 1150 | `#window-glow` | opacity 0 → 1 → 0 (peak at 900) | in-out |
| 900 → 1250 | `#heartbeat` | dashoffset 1 → 0 (draws left → right) | in-out |
| 950 → 1350 | `#heartbeat-pulse` | opacity 0 → 1 at 950, dashoffset 0.12 → −1, opacity → 0 at 1350 | in-out |
| 1000 → 1350 | `#wordmark-name` | opacity 0 → 1, translateY 6px → 0 | out-expo |
| 1080 → 1400 | `#wordmark-descriptor` | opacity 0 → 1, translateY 6px → 0 | out-expo |

Rules:
- **No flash of the finished logo:** a tiny inline `<script>` in `<head>` sets `document.documentElement.dataset.logoIntro = "play"` only if (a) `sessionStorage['dd:logo-intro']` is unset, (b) motion isn't reduced. CSS under `html[data-logo-intro="play"]` holds the start state; GSAP removes the attribute when done. Without JS, the full static logo renders.
- **Skippable:** any `pointerdown`, `keydown`, `wheel` or `touchstart` during the intro → `tl.progress(1)`.
- **Session flag** is written at intro start inside `try/catch`. If storage throws, skip the intro (never replay on every load).
- Reduced motion (OS or Comfort Controls): no intro, static logo.

#### B. Hover / focus (logo link)

Triggered by `:hover` and `:focus-visible` on the logo link. CSS keyframes; each new hover restarts it.

| Start → End (ms) | Element | Property | Ease |
|---|---|---|---|
| 0 → 250 | `#house-roof` | translateY 0 → −2px (returns in 300ms on leave) | out-expo |
| 0 → 240 | `#window-light` | fill-opacity 1 → 0.65 → 1 (one soft dip — "light flicks on") | in-out |
| 60 → 660 | `#heartbeat-pulse` | opacity 0 → 1 → 0, dashoffset 0.12 → −1 | in-out |

One dip only — well under the 3-flashes-per-second limit, and the window is a tiny area. Reduced motion: nothing (the link still gets its focus ring).

#### C. Scroll-compact (header: horizontal → mark)

- **Trigger:** compact when `scrollY > 80` and the last scroll delta is downward by >8px; expand when the delta is upward by >8px or `scrollY ≤ 80`. Read scroll from Lenis' `scroll` event (window `scroll` when Lenis is off).
- **No layout shift:** the logo box keeps its full reserved width; the nav never moves. The collapse is a `clip-path` + transform effect, not a width change.
- One GSAP timeline (`compactTl`, paused): `play()` to compact, `reverse()` to expand — expanding mirrors compacting exactly.

| Start → End (ms) | Element | Property | Ease |
|---|---|---|---|
| 0 → 200 | `#heartbeat` | dashoffset 0 → 1 (retracts right → left) | in-out |
| 0 → 200 | `#wordmark-name`, `#wordmark-descriptor` | opacity 1 → 0, translateX 0 → −8px | out-expo |
| 100 → 350 | Wordmark wrapper | `clip-path: inset(0 0 0 0)` → `inset(0 100% 0 0)` | in-out |
| 100 → 350 | `#house` + `#figure` (mark) | scale 1 → 0.9, origin left center | in-out |

- The `aria-label` stays "Dawson & Dawson Home Care — home" in both states.
- Reduced motion: instant swap (timeline `progress(0|1)`, no tween).

#### D. Footer idle (stacked reversed)

| Trigger | Element | Property | Duration / ease |
|---|---|---|---|
| Footer becomes ≥50% visible (IntersectionObserver, once per entry) | `#heartbeat-pulse` | opacity 0 → 1 → 0, dashoffset 0.12 → −1 | 900ms, in-out |
| Hover / focus on the footer logo link | same | same | 900ms, in-out |

**Changed from 03 (was "every ~6s"):** a pulse that repeats indefinitely is auto-moving content lasting over 5 seconds alongside other content — WCAG 2.2.2 then requires a pause control. One pulse per entry plus hover keeps the "alive" moment without needing one. Paused when `document.hidden`. Reduced motion: no pulse.

### 3.4 Option B — softened figure

**What changes:** only `#figure`. Everything else — house, window, heartbeat, wordmark, colors, groups, motion — stays identical, so A and B are a one-group swap.

**The figure:** two people under the roof instead of a wheelchair user. A taller standing figure (the caregiver) leans in with one arm curving around the shoulders of a shorter seated or standing figure (the loved one). Heads are two circles at different heights; bodies are single soft filled shapes, no limbs detail. The arm and the inner contours of the two bodies leave a small **heart-shaped negative space** between them — the "family" idea, visible at header size, invisible at favicon size (where it just reads as two people).
- Color: both figures leaf-500 fill, plum-800 outline at H/48 on light; leaf-500 alone on plum-950. (Not orchid — adding a second fill color to the mark would break its single-accent balance.)
- ≤32px simplified cut: two heads + one merged body silhouette; no heart.
- Motion: in the intro the two figures fade in 60ms apart (caregiver first); on hover the taller figure's arm path does nothing extra — the house still does the moving.

**Why it's worth testing:**
- The wheelchair silhouette reads as the International Symbol of Access — "disability" or "medical equipment" — at a glance. That pulls against "non-medical", "stay home, stay you", and services like companionship and home help, where most clients aren't wheelchair users.
- At 16–32px (favicon, compact header) it is hard to distinguish from a parking-sign icon.
- Two people = care *relationship*, which is the actual positioning ("care that feels like family").

**The case for A:** it's their logo, the client has used it for years, and recognition is the point of the reveal.

### 3.5 Reveal plan (decided)

**Option A is the live logo at the reveal; Option B is built and one click away.**
- A keeps the reveal reaction where we want it — "this is us, finally done right" — instead of opening with "you changed our logo".
- Build B in the same SVG structure behind `NEXT_PUBLIC_LOGO_FIGURE=a|b` (default `a`), and show A/B side by side on `/reveal-notes` with a toggle that swaps the live header logo. The client decides with both in front of them, on their own site.
- If they pick B, it's one env value — no redesign, no code change.

---

## 4. Interactive cursor — developer handoff

**Component:** `components/cursor/CursorRing.tsx` (client component, mounted once in `app/(site)/layout.tsx`).
**Purpose:** a soft orchid ring that trails the pointer and tells people what a click will do ("Call", "Open", "Play", "Drag"). It sits **behind/around** the native cursor — the native cursor is never hidden.

### 4.1 When it exists (mount conditions)

Mount **only if all** are true; re-evaluate live via `matchMedia(...).addEventListener('change')` and Comfort Controls changes:

| Condition | Check |
|---|---|
| Fine pointer that can hover | `matchMedia('(pointer: fine) and (hover: hover)')` |
| Motion allowed | `!matchMedia('(prefers-reduced-motion: reduce)')` **and** `html[data-motion]` ≠ `"reduce"` |
| Not high contrast | `html[data-contrast]` ≠ `"high"` **and** `!matchMedia('(forced-colors: active)')` |
| Screen media | hidden under `@media print` |

If any condition flips to false while mounted: fade out 150ms, remove listeners, cancel the rAF loop, unmount.
Hybrid devices: on any `pointerdown` with `pointerType === "touch"` hide the ring until the next mouse `pointermove`.
**Never** set `cursor: none` anywhere in the codebase. Links keep `cursor: pointer`.

### 4.2 DOM & base CSS

```html
<div class="cursor-ring" aria-hidden="true" data-state="idle" data-theme="light" data-visible="false" data-pressed="false">
  <div class="cursor-ring__circle"><span class="cursor-ring__label"></span></div>
</div>
```

```css
.cursor-ring {
  position: fixed; left: 0; top: 0;
  z-index: 9999;                 /* above everything; it can't block clicks */
  pointer-events: none;
  mix-blend-mode: normal;        /* never difference/exclusion */
  opacity: 0;
  transition: opacity 200ms var(--ease-out-expo);
  will-change: transform;        /* translate set per frame by JS */
  contain: layout style;
}
.cursor-ring[data-visible="true"] { opacity: 1; }

.cursor-ring__circle {
  position: absolute; left: 0; top: 0;
  translate: -50% -50%;
  width: 36px; height: 36px;
  border-radius: 50%;
  border: 1.5px solid var(--orchid-500);
  background-color: transparent;
  display: grid; place-items: center;
  transition:
    width 250ms var(--ease-out-expo),
    height 250ms var(--ease-out-expo),
    background-color 250ms var(--ease-out-expo),
    border-color 250ms var(--ease-out-expo),
    opacity 200ms var(--ease-out-expo),
    scale 180ms var(--ease-out-expo);
}
.cursor-ring__label {
  font: 600 14px/1 var(--font-body);
  letter-spacing: 0.02em;
  color: var(--white);
  opacity: 0;
  transition: opacity 120ms var(--ease-out-expo);
  white-space: nowrap;
}
@media print { .cursor-ring { display: none; } }
```

Size animates `width/height` on a fixed, contained, isolated element — it can't reflow the page, and it keeps the 1.5px border crisp (scaling would thicken the border). Position is transform-only.

### 4.3 States

Resolve the state from the element under the pointer, in this **precedence order** (first match wins):

| # | State | Selector / trigger | Diameter | Border | Fill | Label | Other |
|---|---|---|---|---|---|---|---|
| 1 | `none` | target inside `[data-cursor="none"]` | — | — | — | — | Ring fades out (video controls, Turnstile, iframes, map zoom controls) |
| 2 | `disabled` | interactive element that is `:disabled` or `[aria-disabled="true"]` | 36px | orchid-500 | transparent | — | Same as idle — never promise a click that won't work |
| 3 | `text` | `TEXT` selector (below) | 12px | orchid-500 | transparent | — | circle opacity 0.4 |
| 4 | `label` | nearest `[data-cursor-label]` ancestor (value = label text) | 84px | plum-800 | plum-800 | white, 14px 600 (15.40:1), fades in after 80ms | — |
| 5 | `interactive` | `INTERACTIVE` selector (below) | 64px | orchid-500 @ 60% | orchid-500 @ 14% | — | — |
| 6 | `idle` | anything else | 36px | orchid-500 1.5px | transparent | — | — |

**Theme modifier** — nearest `[data-cursor-theme]` ancestor; `"dark"` applies:

| State | Light (default) | Dark (`data-theme="dark"`) |
|---|---|---|
| idle | border orchid-500 | border leaf-500 |
| interactive | border orchid-500 @ 60%, fill orchid-500 @ 14% | border leaf-500 @ 60%, fill leaf-500 @ 18% |
| label | fill + border plum-800, label white | fill + border leaf-500, label **plum-950** (8.82) — plum-800 would be invisible on dark (1.15 on plum-950) |
| text | orchid-500, opacity 0.4 | leaf-500, opacity 0.4 |

Alpha colors are written with `color-mix()` from locked tokens — no new hex:

```css
[data-state="interactive"] .cursor-ring__circle {
  width: 64px; height: 64px;
  border-color: color-mix(in srgb, var(--orchid-500) 60%, transparent);
  background-color: color-mix(in srgb, var(--orchid-500) 14%, transparent);
}
[data-theme="dark"][data-state="interactive"] .cursor-ring__circle {
  border-color: color-mix(in srgb, var(--leaf-500) 60%, transparent);
  background-color: color-mix(in srgb, var(--leaf-500) 18%, transparent);
}
[data-state="label"] .cursor-ring__circle { width: 84px; height: 84px; border-color: var(--plum-800); background-color: var(--plum-800); }
[data-state="label"] .cursor-ring__label { opacity: 1; transition-delay: 80ms; }
[data-theme="dark"][data-state="label"] .cursor-ring__circle { border-color: var(--leaf-500); background-color: var(--leaf-500); }
[data-theme="dark"][data-state="label"] .cursor-ring__label { color: var(--plum-950); }
[data-state="text"] .cursor-ring__circle { width: 12px; height: 12px; opacity: 0.4; }
[data-theme="dark"] .cursor-ring__circle { border-color: var(--leaf-500); }
[data-state="none"] .cursor-ring__circle { opacity: 0; }
[data-pressed="true"] .cursor-ring__circle { scale: 0.85; transition-duration: 250ms, 250ms, 250ms, 250ms, 200ms, 120ms; }
```

**Pressed:** `pointerdown` (button 0) → `scale: 0.85` in 120ms; `pointerup` / `pointercancel` → back to 1 in 180ms. Applies in every visible state.

### 4.4 Selectors (exact)

```ts
export const INTERACTIVE = [
  'a[href]', 'button', 'summary', 'select', 'label[for]',
  '[role="button"]', '[role="link"]', '[role="tab"]', '[role="option"]',
  '[role="menuitem"]', '[role="switch"]', '[role="checkbox"]', '[role="radio"]',
  'input[type="submit"]', 'input[type="button"]', 'input[type="reset"]',
  'input[type="checkbox"]', 'input[type="radio"]', 'input[type="range"]',
  '[data-cursor]:not([data-cursor="none"])',
].join(',');

export const TEXT = [
  'input:not([type])', 'input[type="text"]', 'input[type="email"]', 'input[type="tel"]',
  'input[type="search"]', 'input[type="number"]', 'input[type="url"]', 'input[type="password"]',
  'textarea', '[contenteditable=""]', '[contenteditable="true"]',
].join(',');

export const DISABLED = ':disabled, [aria-disabled="true"]';
```

SVG links (Dawson House rooms, Area Map towns) must use `href`, not `xlink:href`, so `a[href]` matches them.

### 4.5 Where to put the labels and dark themes (site map)

| Element | Attribute |
|---|---|
| Every phone CTA (`tel:` links, header Call, mobile bar excluded — touch) | `data-cursor-label="Call"` |
| Dawson House rooms (each `<a>` in the SVG) | `data-cursor-label="Open"` |
| Owner video poster / play button | `data-cursor-label="Play"` |
| Caregiver carousel viewport (Embla container) | `data-cursor data-cursor-label="Drag"` |
| Review cards that open, area-map towns, service cards | `data-cursor-label="View"` |
| Footer, Final CTA band (Dusk), Pros band, any plum-950 / plum-800 / Dusk section | `data-cursor-theme="dark"` |
| Video player controls, Turnstile widget, map zoom buttons, any iframe wrapper | `data-cursor="none"` |

Labels are visual only (`aria-hidden`); every labelled element must already have its own accessible name. Labels are one word, ≤5 characters, so they fit 84px at 14px.

### 4.6 Behavior

**Position (lerp):**
```ts
// per rAF tick
const k = 1 - Math.pow(1 - 0.15, dt / 16.667); // 0.15 per 60fps frame, frame-rate independent
rx += (x - rx) * k;
ry += (y - ry) * k;
el.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
// stop the loop when |x-rx| < 0.1 && |y-ry| < 0.1; restart on next pointermove
```

**Events (all `passive: true`):**

| Event | Action |
|---|---|
| `pointermove` (mouse/pen) | Update target x/y; on first move snap `rx,ry = x,y` (no fly-in from 0,0); set visible; start loop |
| `pointerover` | Resolve state + theme from `e.target` (cache last target; skip if unchanged) |
| `pointerdown` / `pointerup` / `pointercancel` | Pressed on/off; touch pointer → hide |
| `pointerleave` on `document.documentElement`, or `pointerout` with `relatedTarget === null` | Fade out (also covers moving into iframes) |
| Scroll (Lenis `scroll` or window `scroll`), rAF-throttled | Re-resolve state from `document.elementFromPoint(x, y)` — content moves under a still pointer |
| `keydown` Tab / arrows | Fade out until the next `pointermove` (the ring never follows keyboard focus) |
| `visibilitychange` hidden | Cancel the loop |
| Route change (page transition) | Re-resolve state after the transition ends |

**Never:** hide the native cursor, intercept clicks, use `mix-blend-mode`, animate anything but transform/opacity/size-on-the-ring, run the loop while the pointer is still.

### 4.7 Acceptance criteria

1. Native cursor is visible at all times on every page (grep: no `cursor: none` / `cursor-none` in the codebase).
2. On touch devices and with reduced motion (OS or Comfort Controls), high contrast or forced colors, the ring element is not in the DOM and no listeners are attached.
3. Toggling Comfort Controls "Reduce motion" or "High contrast" removes the ring within 200ms without reload; toggling back restores it.
4. Ring follows with visible lag at 60Hz and 120Hz identically (frame-rate independent lerp).
5. Idle 36px · interactive 64px · label 84px · text 12px — measured in DevTools; transitions 250ms out-expo; press scale 0.85.
6. Every label renders centered, 14px 600, white on plum-800 (light) / plum-950 on leaf-500 (dark); no label overflows the circle.
7. Precedence holds: a disabled button shows idle, a text input inside a dark section shows the 12px leaf ring, a labelled link shows the label not the 64px state.
8. Scrolling with the mouse still updates the state when a link scrolls under the pointer.
9. Pressing Tab hides the ring; moving the mouse brings it back.
10. No layout shift (CLS contribution 0) and no long tasks attributable to the cursor in a 30s Performance recording on a mid-range Android-class CPU throttle (4×).
11. Ring disappears when the pointer leaves the window or enters an iframe/Turnstile.
12. Clicks always land on the element under the native cursor (`pointer-events: none` verified on ring and children).

---

## 5. Changes vs 03_BRAND_SYSTEM.md (these override 03)

1. **Focus ring:** inner ring is **2px** plum-950 (03 said 1px) on light; on Dusk the ring is **3px cream** instead of leaf-500.
2. **Input, checkbox, radio, toggle and slider borders:** **1.5px muted** — `line` fails non-text contrast (1.28:1).
3. **Body-copy links are always underlined** (orchid-700 vs ink is 2.70:1).
4. **Eyebrows/labels on dark:** orchid-100, plum-100 or leaf-500 — never orchid-700.
5. **Dusk text zones:** small text, buttons and leaf-500 accent text stay in the 0–55% plum half; leaf-500 display text to 75%.
6. **No text on photos or placeholders;** no opacity on text.
7. **Reversed logo:** "HOME CARE" = orchid-500; reversed version only on plum-950 (mono cream elsewhere on dark/Dusk).
8. **Logo figure** gets a plum-800 outline (H/48) on light versions.
9. **Scroll-compact** uses clip-path + transform with a fixed reserved width (no layout shift) instead of a width transition.
10. **Footer logo idle:** one heartbeat pulse per footer entry + on hover/focus — not every 6s (WCAG 2.2.2).
11. **Cursor label:** **14px** 600 (03 said 13px), the same smallest size as eyebrows; dark-theme label state = leaf-500 fill with plum-950 text.
12. **Cursor** is also disabled in high-contrast mode and `forced-colors`.
13. **Tailwind** wipes default colors, text sizes and fonts (`--color-*: initial` etc.) so only locked tokens exist.
14. **New token `alert-700 #B42318`** — errors only (§1.6). Palette is now 16 tokens.
15. **Type minimum:** 16px everywhere, with one exception — **14px** for eyebrows (uppercase, 700, tracked) and the cursor label. This overrides 03's `small` row ("minimum anywhere").
16. **Logo at reveal:** Option A (faithful) live; Option B (softened figure) built behind `NEXT_PUBLIC_LOGO_FIGURE=a|b` (default `a`) with an A/B toggle on `/reveal-notes`.

### Resolved decisions (19 Oct 2026)

| Decision | Outcome |
|---|---|
| Error color | **Approved:** `alert-700 #B42318` |
| Logo at reveal | **Option A live**, Option B behind `NEXT_PUBLIC_LOGO_FIGURE`, shown on `/reveal-notes` |
| Eyebrow size | **14px kept** as the single exception to the 16px minimum |

### Fix in `brand-palette-preview.html`

- `.hero h3 em { color: var(--leaf-500) }` puts the leaf accent word on Dusk where it can drift past 55% → keep it, but constrain the hero copy width so the word stays in the plum half (or switch to italic cream).
- Add `alert-700 #B42318` to the "Full token set" grid so the preview shows all 16 tokens.
