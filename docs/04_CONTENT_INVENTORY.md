# 04 — CONTENT INVENTORY (everything we know from the current site)

Extracted from dawsonhomecare.com on 16 Oct 2026. Items marked **VERIFIED** come straight from their site. Items marked **TO CONFIRM** are reasonable assumptions to be validated at the reveal — they must appear as placeholders in code (`confirmed: false`).

## Business facts — VERIFIED
| Field | Value |
|---|---|
| Legal name | Dawson and Dawson Home Care LLC |
| Address | 69 Robert Smalls Parkway, Suite 3F, Beaufort, SC 29906 |
| Main phone | (843) 379-3321 → `tel:+18433793321` |
| Toll-free (also text) | (866) 632-9766 → `tel:+18666329766` |
| Fax | (866) 502-3509 |
| Email | info@dawsonhomecare.com |
| Office hours | Monday–Friday, 8 AM–5 PM (Eastern) |
| Care availability | 24/7 ("Available 24/7 — whether you need us for a handful of hours or all day") |
| Founded | 2002 ("Providing Loving In-Home Care Since 2002") |
| Experience claim | "Over 22 years of experience in the health and homecare field" → replace with computed years since 2002 |
| Ownership | Owner run & operated — "Owner personally visits and works with all patients to ensure quality" |
| Credentials claimed | "Licensed & Insured"; "certified Nursing Assistants" (About page) |
| Region claimed | "The greater Lowcountry and surrounding areas" |
| Instagram | https://www.instagram.com/dawsonhomecare/ |
| Google Maps | http://goo.gl/maps/SVvYGS3TipaMpbgQ9 |
| Careers | https://careers.hireology.com/dawsondawsonhomecarellc |
| CRM / forms | LeadConnector (GoHighLevel) form ID seen: `tkgwDE5LF5f9rgsw3R2x` |
| Current meta description | "Personalized Attention for All Your Health-Related Needs" |

## Existing messaging — VERIFIED (raw material, will be rewritten)
- Hero: "Dawson and Dawson Home Care LLC" / "Providing Loving In-Home Care Since 2002" / "Helping Your Loved Ones Thrive At Home"
- Hero strip: Licensed & Insured · 24/7 Services Available · Passionate Caregiving
- "Home Care Done Right — Personalized Attention for All Your Health-Related Needs"
- "Whether you're looking for assistance with ADL's or companionship services, our team of professional homecare specialists are readily available to attend all of your non-medical requests."
- Why Choose Us: Available 24/7 · Owner Run & Operated · Passionate Caregiving ("All employees have years of experience and a genuine love for caregiving") · Follow Up & Check-Ins ("Treating every patient as if they were a part of our family")
- "You're In Safe Hands — … One of our home care coordinators will be happy to discuss a plan that's most suitable for you from the comfort of your home."
- About: "most reliable and trustworthy Home Care Agency service in the greater Lowcountry… providing excellent home care solutions to patients who are dealing with injury or illness." "From 24-Hour Care to Medication Reminders — our certified Nursing Assistants work tirelessly…"

## Services listed today — VERIFIED (old structure, being reorganised in 05)
| Old name | Old description |
|---|---|
| ADL Care | Bathing, toileting, grooming & companionship. Page lists: Bathing (incl. shaving, brushing teeth), Dressing (buttons, zippers), Eating (feeding from start to finish), Transferring (room to room, bed to wheelchair), Toileting |
| Personal Care | Laundry, errands, medication reminders/assistance & more |
| Respite Care | Aiding a caregiver by temporarily taking over responsibilities |
| Companionship | Trips to the park, games, conversations, daily walks & more |

## Current forms — VERIFIED
- **Home contact form:** Client's First Name, Client's Last Name, Point of Contact (×2, duplicated), Phone, Email, Anything Else We Should Know, SMS consent checkbox (transactional messages: reminders, confirmations, account notifications; HELP/STOP text)
- **Medical Referrals form:** First & Last Name, Age, Contact Number, Length of Time Needed, Type of Care (Hospice Care / Palliative Care / In-Home Services / Personal Care), Additional Info. Phone + Fax shown.
- **Contact page:** GHL embedded form + Name / Email / Message form (duplicate)
- **Toll-free SMS disclosure (verbatim intent):** By calling or texting (866) 632-9766 clients agree to receive text messages; opt out with STOP; no unsolicited marketing.

## Current URLs (must all redirect — see 08)
`/` · `/adl-care/` · `/personal-care/` · `/respite-care/` · `/companionship-care/` · `/medical-referrals/` · `/about-us/` · `/contact-us/`

## Assumptions — TO CONFIRM at reveal
| Topic | Placeholder assumption |
|---|---|
| Owner name(s) & story | `[[TO CONFIRM: owner name]]` — "Dawson and Dawson" suggests a family partnership |
| Owner background | Health/homecare since ~2000 (from "22 years experience" claim) — placeholder |
| SC license number | `[[TO CONFIRM: SC DPH In-Home Care Provider license #]]` |
| Service area (towns) | Primary: Beaufort, Port Royal, Lady's Island, St. Helena Island, Burton, Shell Point, Seabrook, Sheldon. Extended: Bluffton, Okatie, Hilton Head Island, Ridgeland, Hardeeville, Yemassee — all `confirmed: false` |
| Payment options | Private pay, long-term care insurance, VA benefits, Medicaid waiver programs — all `confirmed: false`; show as "Ways families pay — ask us which apply" |
| Hourly rate / minimums | Unknown → estimator shows "Illustrative" badge while `rateConfirmed: false` |
| After-hours line for existing clients | Unknown → `[[TO CONFIRM]]` |
| Hospice/palliative support | Non-medical support alongside hospice teams — `[[TO CONFIRM]]` |
| Dementia/Alzheimer's support | Not mentioned on current site — do NOT add as a service until confirmed; can appear as an FAQ answer placeholder |
| Number of caregivers / families served | Unknown — never display a number until confirmed |
| Reviews | Placeholders only, clearly fake-marked in data (`placeholder: true`), replaced with real Google reviews later |
| Languages spoken | Unknown |
| Background checks / training | Common in industry but not stated → `[[TO CONFIRM]]` before claiming |
