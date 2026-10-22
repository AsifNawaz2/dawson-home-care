# 11 — ASSET & PLACEHOLDER LIST

All placeholders live in `/public/images/placeholders/` and are rendered by a `<Placeholder>` component that looks intentional (soft plum-100/orchid-100 gradient + line illustration + small label like "Owner portrait · 4:5"). At the reveal, real files replace them using the **same filenames** — no code changes.

## Photography (to shoot or collect after reveal)
| ID / filename | Where used | Ratio / min size | Brief |
|---|---|---|---|
| `hero-1.jpg` | Home hero (main) | 4:5, 1600×2000 | Caregiver and client laughing together at home, warm natural light |
| `hero-2.jpg` | Home hero (layer) | 1:1, 1200 | Hands: caregiver holding client's hand / cup of tea |
| `hero-3.jpg` | Home hero (layer) | 3:4, 1200×1600 | Porch / live oak / Lowcountry light |
| `owner-portrait.jpg` | Home ch.7, About, Assessment panel | 4:5, 1600×2000 | Owner, approachable, at the Beaufort office or a client's porch |
| `owner-with-client.jpg` | How It Works step 2 | 3:2, 1800×1200 | Owner sitting with a family at a kitchen table (assessment) |
| `owner-signature.svg` | Meet the owner | vector | Owner's real signature (scan → trace) |
| `caregiver-01…08.jpg` | Caregiver carousel, About | 4:5, 1200×1500 | Each caregiver, consistent background/light |
| `service-personal-care.jpg` | Service page hero | 3:2, 2000×1333 | Dignified help — e.g. helping with a cardigan (no bathroom shots) |
| `service-home-help.jpg` | Service page hero | 3:2 | Cooking together / folding laundry |
| `service-companionship.jpg` | Service page hero | 3:2 | Walk in the park / playing cards |
| `service-respite.jpg` | Service page hero | 3:2 | Family caregiver relaxing while caregiver is with parent |
| `service-24-hour.jpg` | Service page hero | 3:2 | Evening lamp-lit room, calm |
| `office-exterior.jpg` | Contact, About | 3:2 | 69 Robert Smalls Pkwy building |
| `team-group.jpg` | About, Careers | 16:9, 2400×1350 | Whole team together |
| `town-{slug}.jpg` | Town pages | 16:9 | Recognisable local scenery per town (license-safe) |
| `og-default.jpg` | Social sharing | 1200×630 | Generated from brand template |

## Video
| ID | Where | Spec |
|---|---|---|
| `owner-intro.mp4` + `owner-intro.vtt` + poster | Home ch.7, About | 60–90s, phone is fine, landscape 16:9, captions required |
| `testimonial-01…03.mp4` (optional) | Reviews | 30–60s each, captions |

## Data placeholders (in `/content`, all flagged)
| File | Placeholder content | Flag |
|---|---|---|
| `owner.ts` | name "[[Owner Name]]", title, story paragraphs (draft), quote | `confirmed:false` |
| `caregivers.ts` | 6 cards: first name, years, specialty, quote — generic placeholder names like "Caregiver Name" (never realistic fake names) | `placeholder:true` |
| `reviews.json` | 8 reviews written as obvious samples, attributed "Sample Review" | `placeholder:true` |
| `areas.ts` | towns list from 04 | `confirmed:false` per town |
| `payments.ts` | 5 payment types | `confirmed:false` |
| `site.config.ts` | license #, rates, Google rating, after-hours line, response time | `confirmed:false` / null |

## Brand assets we create (no client input needed)
- Logo SVG set (horizontal, stacked, mark, reversed, mono) + favicon set + Apple touch icon
- Dawson House illustration (SVG)
- Moment illustrations (5), How-It-Works step illustrations (5), quiz answer illustrations (~12), 404 illustration
- Lowcountry service-area SVG map
- Heartbeat divider + section ornaments
- OG image template

## Pre-launch gate
`npm run prelaunch` must list every remaining `placeholder:true`, `confirmed:false`, `[[TO CONFIRM` string and placeholder image. Launch only when the list is empty or every remaining item is consciously accepted.
