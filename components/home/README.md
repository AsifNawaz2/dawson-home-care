# Home chapters

One component per chapter of `docs/design/01-home-desktop.html` / `02-home-mobile.html`, in page order:

| File            | Chapter                                                              |
| --------------- | -------------------------------------------------------------------- |
| `HomeIntro.tsx` | Intro video → logo flies into the header (first landing per session) |
| `Hero.tsx`      | 1. Hero                                                              |
| `TheMoment.tsx` | 01 — The moment (word-by-word title, typed lines)                    |
| `HowWeHelp.tsx` | 02 — How we help (video collages)                                    |

`home.css` holds the ported design styles; `scroll.ts` the shared scroll-scene maths.
Copy lives in `content/copy/home.ts`.
