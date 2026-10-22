# 03 — BRAND SYSTEM (LOCKED)

These are the upgraded versions of Dawson's existing colors (plum, orchid/pink, lime green). Once approved they are **locked** — no new colors, no ad-hoc tints.

## 1. Color palette

### Old → New
| Role | Old (current site) | New (locked) | What changed |
|---|---|---|---|
| Brand purple | `#3B2772` | **Plum 800 `#2A1856`** | Deeper, richer, more premium; white text now 15:1 |
| Pink / orchid | `#BB70CD` (dusty) | **Orchid 500 `#C25BD9`** | Brighter, cleaner, more "alive" |
| Green | `#8CBC1C` (flat lime) | **Leaf 500 `#94C723`** | Fresher, slightly warmer lime |
| Text gray | `#333333` / `#69727D` | **Ink `#1E1A2B`** / **Muted `#5B5670`** | Warm, plum-tinted neutrals instead of cold gray |
| Background | white | **Cream `#FBF8F3`** + white surfaces | Warmer, luxury feel |

### Full token set
| Token | Hex | Use |
|---|---|---|
| `plum-950` | `#1C0F3D` | Darkest sections, footer, text on Leaf/Orchid buttons |
| `plum-800` | `#2A1856` | **Primary brand**: headings, primary buttons, header text, logo |
| `plum-600` | `#4B2E91` | Hover states, gradient mid-point, secondary emphasis |
| `plum-100` | `#EEE9F8` | Soft lavender panels, selected states |
| `orchid-500` | `#C25BD9` | **Signature accent**: glows, illustrations, cursor ring, large display text, decorative only |
| `orchid-700` | `#8E3BA8` | Accessible orchid: links, small labels, icons on light |
| `orchid-100` | `#F6EAFB` | Blush panels, quiz/answer backgrounds |
| `leaf-500` | `#94C723` | **Action green**: "Free Assessment" button (with plum-950 text), success, highlights on dark |
| `leaf-700` | `#4A7309` | Accessible green for text/icons on light |
| `leaf-100` | `#EEF6DC` | Success panels, "office open" chip background |
| `cream` | `#FBF8F3` | Page background |
| `white` | `#FFFFFF` | Cards, surfaces |
| `ink` | `#1E1A2B` | Body text |
| `muted` | `#5B5670` | Secondary text, captions |
| `line` | `#E7E1EE` | Borders, dividers |

### Signature gradient (the only gradient allowed)
**Dusk:** `linear-gradient(135deg, #2A1856 0%, #4B2E91 55%, #C25BD9 100%)`
Use for hero accents, the final CTA band, the logo glow. Small white text must sit on the plum half; large display text can cross into the orchid end.

### Verified contrast (WCAG)
| Pair | Ratio | Allowed for |
|---|---|---|
| White on plum-800 | 15.4:1 | Everything |
| White on plum-950 | 17.7:1 | Everything |
| White on plum-600 | 10.0:1 | Everything |
| plum-950 on leaf-500 | 8.8:1 | Everything — **this is the green button** |
| leaf-500 on plum-950 | 8.8:1 | Everything (green on dark) |
| leaf-500 on plum-800 | 7.7:1 | Everything |
| Ink on cream | 16.0:1 | Everything |
| Muted on cream | 6.6:1 | Everything |
| orchid-700 on white | 6.3:1 | Everything |
| leaf-700 on white | 5.6:1 | Everything |
| plum-950 on orchid-500 | 4.9:1 | Everything |
| White on orchid-500 | 3.6:1 | **Large text (24px+, or 19px bold) and icons only** |
| White on leaf-500 | 2.0:1 | **Never** (this is the bug on today's site) |

### Button system
- **Primary — "Get a Free Care Assessment":** bg `leaf-500`, text `plum-950`, hover bg lightens via a white 12% overlay + lift 2px
- **Secondary — "Call (843) 379-3321":** bg `plum-800`, text white, hover `plum-600`
- **Ghost:** transparent, 2px `plum-800` border, text `plum-800`; on dark: cream border/text
- Radius: `999px` (pill) for CTAs, `20px` for cards, `12px` for inputs
- Min height 52px, horizontal padding 28px, font 17px semibold
- Focus ring (everywhere): 3px `leaf-500` outline, 3px offset; on light backgrounds add 1px `plum-950` inner ring

## 2. Typography (two families only)
| Role | Font | Notes |
|---|---|---|
| Display / headings | **Fraunces** (variable, Google) | Warm editorial serif — upgrade of their Playfair. Use `opsz` axis auto, `SOFT 50`, weight 500–600. Italic for emotional words ("*family*", "*home*"). |
| Body / UI | **Plus Jakarta Sans** (variable, Google) | Friendly, highly legible. Weights 400 / 500 / 600 / 700. |

Loaded with `next/font` (self-hosted, no layout shift).

### Type scale (fluid, clamp)
| Token | Size (mobile → desktop) | Use |
|---|---|---|
| `display-xl` | 48 → 96px, Fraunces 500, lh 1.02, tracking −2% | Hero line |
| `display-l` | 40 → 72px | Chapter titles |
| `h1` | 36 → 56px | Page titles |
| `h2` | 30 → 44px | Section titles |
| `h3` | 22 → 28px, Plus Jakarta 600 | Card titles |
| `lead` | 20 → 24px, lh 1.55 | Intro paragraphs |
| `body` | **18px**, lh 1.65, max 65ch | Default text — never smaller |
| `small` | 16px | Captions, legal (minimum anywhere) |
| `eyebrow` | 14px, 700, uppercase, tracking 12%, `orchid-700` | Section labels |

## 3. Logo (interactive)

### Rebuild
Source file: `https://dawsonhomecare.com/wp-content/uploads/2025/12/DawsonandDawsonHomeCareLLC-80466-HeaderBarLogo-12dawsondawsonhomecarelogo2copy.png`
Rebuild the existing mark faithfully as clean SVG (separate, animatable `<g>` groups), keeping its recognizable elements:
- **House** outline with roof and window
- **Figure** (current logo uses a wheelchair figure)
- **Heartbeat line** (EKG line) running under the name
- **Wordmark:** "Dawson & Dawson" + "HOME CARE" small caps

> Open decision for Chat 1: keep the wheelchair figure, or soften it into two figures/caring hands under the roof. Recommendation: keep the structure for the reveal (client must recognize their logo), but test a softened figure as Option B.

### New colors
- House + wordmark "Dawson & Dawson": `plum-800`
- Figure: `leaf-500` (with `plum-800` outline where needed)
- "HOME CARE": `orchid-700`
- Heartbeat line: `orchid-500` → animates to `leaf-500` pulse
- Reversed version (on plum-950): wordmark `cream`, house `cream`, figure `leaf-500`, line `orchid-500`

### Versions
1. Horizontal (header) 2. Stacked (footer, loader) 3. Mark only (compact header on scroll, favicon) 4. Reversed (dark sections) 5. Mono plum and mono cream

### Interactions
| Moment | Behavior |
|---|---|
| First visit load | House strokes draw in (≈900ms) → window glows warm (orchid-100 → white) → heartbeat line pulses left→right once → wordmark fades up. Total ≤ 1.4s. Only on first visit per session; skippable. |
| Hover / focus | Heartbeat pulses once; roof lifts 2px; window light flickers on |
| Scroll down | Header logo morphs from horizontal → mark only (smooth width transition) |
| Scroll up | Morphs back |
| Idle in footer | Heartbeat pulses slowly every ~6s (subtle) |
| Reduced motion | Static logo, no draw, no pulse |
| Favicon | Mark only, plum-800 on transparent + 180px Apple touch icon on cream |

## 4. Interactive cursor (follower ring)
- **Desktop + fine pointer only** (`@media (pointer: fine)`). Disabled on touch and when `prefers-reduced-motion: reduce`.
- **Native cursor stays visible** (seniors must never lose their pointer). The effect is a circle **behind/around** the cursor.
- **Ring:** 36px circle, 1.5px border `orchid-500`, transparent fill, follows the pointer with smooth lag (lerp ≈ 0.15 per frame, `requestAnimationFrame`, transform only).
- **Hover on anything clickable** (`a, button, [role=button], input[type=submit], [data-cursor]`): ring grows to 64px, fill `orchid-500` at 14% opacity, border fades to `orchid-500` 60%. Spring easing ≈ 250ms.
- **Labelled hover** (`data-cursor-label="Call"`, "View", "Drag", "Play", "Open"): ring grows to 84px, fill `plum-800`, white 13px semibold label centered.
- **Text inputs:** ring shrinks to 12px and fades to 40% (stays out of the way).
- **Dark sections** (`data-cursor-theme="dark"`): ring border `leaf-500`, hover fill `leaf-500` 18%.
- **Mouse down:** ring scales to 0.85 briefly (press feel).
- **Leaves window:** ring fades out.
- `pointer-events: none`, `z-index` above content, `mix-blend-mode: normal` (no difference blend — keeps colors on-brand).

## 5. Motion principles
- **Feel:** calm, confident, unhurried. Like a slow breath. Nothing bouncy or flashy.
- **Easing:** `cubic-bezier(0.22, 1, 0.36, 1)` (out-expo-ish) for entrances; `cubic-bezier(0.65, 0, 0.35, 1)` for transitions
- **Durations:** micro 180–250ms · UI 300–450ms · reveals 600–900ms · scroll scenes tied to scroll position
- **Text reveals:** lines rise 24px + fade, staggered 80ms (split by line, not letters — readability)
- **Images:** soft clip-path reveal (inset 8% → 0) + 1.06 → 1 scale
- **Parallax:** max 8–12% depth, never on text
- **Smooth scroll:** Lenis, light (lerp 0.1), disabled for reduced motion and for keyboard scrolling
- **Pinning:** allowed for story chapters, max ~150vh of scroll per pin, always with a visible progress indicator; never trap the user
- **Reduced motion:** all scenes become simple fades or static layouts; content order identical
- **Performance:** animate `transform` and `opacity` only; 60fps on a mid-range Android

## 6. Visual language
- **Photography (later):** real, warm, natural light, Lowcountry context (porches, oaks, marsh light). Real owner, real caregivers. Placeholders until then (see 11).
- **Illustration:** single-weight line illustrations (2px stroke, `plum-800`) with orchid/leaf fills at 20–100%. Used for the Dawson House, timeline steps, quiz, empty states.
- **Icons:** Lucide icon set, 1.75px stroke, rounded caps — never mixed with other sets.
- **Shapes:** soft organic blobs in `orchid-100` / `plum-100` behind images; a subtle grain texture (3% noise) on cream backgrounds for warmth.
- **Signature details:** the heartbeat line from the logo reappears as section dividers and as the progress line in the How-It-Works timeline.

## 7. Voice (summary — full in 05)
Warm, calm, plain, confident. Talk *to* families, not *about* "patients". Say "your mom", "your loved one", "you". Never clinical, never salesy, never pity.
