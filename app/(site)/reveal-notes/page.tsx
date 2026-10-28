import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { PageHero, SectionHead } from "@/components/ui/PageHero";
import { flags } from "@/content/site.config";
import { PRELAUNCH_GROUPS, collectPrelaunch, type PrelaunchGroup } from "@/lib/prelaunch";
import { FigureSwitch } from "./FigureSwitch";

/**
 * /reveal-notes — for the owner at the reveal (BRAND_FINAL §3.5, SEO_PLAN ground rule 8):
 * what's new, the 7 fixes (05 §C), the logo A/B toggle and "What we need from you" (the same
 * list as `npm run prelaunch`). Never linked, never indexed, 404 in production (proxy.ts).
 */
export const metadata: Metadata = {
  title: { absolute: "Reveal notes | Dawson & Dawson Home Care" },
  robots: { index: false, follow: false },
};

const NEW: { was: string; now: React.ReactNode }[] = [
  {
    was: "A generic template with stock photos — it looked like every other home care site.",
    now: (
      <>
        A Home page that tells your story as you scroll: the logo film, &ldquo;The moment&rdquo;, a
        short film for each kind of care, and the glowing{" "}
        <Link href="/how-it-works">How it works</Link> line.
      </>
    ),
  },
  {
    was: '"ADL Care" and "Personal Care" meant different things than families expect.',
    now: (
      <>
        Five clear services named by need, each with its own page, plus a 5-question{" "}
        <Link href="/find-care">Find the right care</Link> quiz for families who aren&apos;t sure.
      </>
    ),
  },
  {
    was: "No word on cost or how to pay.",
    now: (
      <>
        A cost estimator (hours now, prices once you confirm rates) and a{" "}
        <Link href="/paying-for-care">Paying for care</Link> guide with the questions to ask any
        agency.
      </>
    ),
  },
  {
    was: "No proof: no reviews, no owner, no real people.",
    now: (
      <>
        Your real Google reviews (4.8 stars, 33 reviews), Meet the owner, caregiver spotlights ready
        for photos, and a <Link href="/reviews">reviews page</Link>.
      </>
    ),
  },
  {
    was: '"Available 24/7" next to "Mon–Fri 8–5", with no explanation.',
    now: "Care 24/7, office Monday–Friday 8–5 — said the same way everywhere, with a live “Office open now / closed” sign. After hours, the buttons turn into “Request a Callback”.",
  },
  {
    was: 'Two forms on one page and a "Point of Contact" field asked twice.',
    now: (
      <>
        One 5-step <Link href="/free-assessment">Free Care Assessment</Link> that remembers the quiz
        and estimator answers, a referral form for professionals and a contact form — all ready to
        land in GoHighLevel with proof of text-message consent.
      </>
    ),
  },
  {
    was: "Small, low-contrast text — hard to read for the people you care for.",
    now: "Big text (18px and up), strong contrast, large buttons, full keyboard use, and Comfort settings (bottom left) for bigger text, high contrast and less motion.",
  },
  {
    was: "No sign of where you care.",
    now: (
      <>
        A <Link href="/areas-we-serve">service-area map</Link>, a &ldquo;Do you serve my
        town?&rdquo; search and eight town pages.
      </>
    ),
  },
  {
    was: "A basic medical-referrals form.",
    now: (
      <>
        A <Link href="/for-professionals">page for discharge planners and case managers</Link>: what
        we do and don&apos;t do, a fast referral form, phone and fax.
      </>
    ),
  },
  {
    was: "Footer links that went nowhere; no privacy or texting terms.",
    now: (
      <>
        Real <Link href="/privacy-policy">Privacy Policy</Link>,{" "}
        <Link href="/sms-terms">SMS Terms</Link>, <Link href="/accessibility">Accessibility</Link>{" "}
        and <Link href="/sitemap">site map</Link> pages.
      </>
    ),
  },
  {
    was: "Old page addresses Google already knows.",
    now: "Every old address forwards to its new page, so you keep your place in Google. Each page has its own title, share image and business details for search.",
  },
  {
    was: "A logo image in the old colors.",
    now: "Your logo, redrawn crisp at any size in the new colors, with a gentle draw-in the first time someone visits.",
  },
];

const FIXES: { title: string; done: string[] }[] = [
  {
    title: "Broken trust signals",
    done: [
      "Privacy Policy, SMS Terms, Accessibility statement and a site map — linked from every footer.",
      "The © year updates itself. Every page has a proper title and its own share image.",
      "“Licensed & insured” opens a short panel, ready for your license number.",
      "Search engines get your business details as a non-medical local business (address, phone, office hours, areas, Instagram and Google Maps).",
    ],
  },
  {
    title: "24/7 care vs office hours",
    done: [
      "“Care: 24 hours a day, 7 days a week. Office: Monday–Friday, 8 AM–5 PM” everywhere.",
      "A live office sign (Beaufort time) in the Home hero, footer and contact page.",
      "After hours, “Get a Free Care Assessment” becomes “Request a Callback”, and the lead is marked after-hours.",
    ],
  },
  {
    title: "Accessibility for your audience",
    done: [
      "Every color pair passes WCAG AA. No white text on lime or orchid.",
      "Body text 18px or larger, buttons and links at least 48px tall, clear focus outlines, a skip link.",
      "Comfort settings: text size, high contrast, reduce motion — remembered on that device.",
      "Every animation has a calm version, and every feature (quiz, map, estimator, carousels) works by keyboard and screen reader.",
    ],
  },
  {
    title: "Muddled services",
    done: [
      "Personal Care, Home Help, Companionship, Respite Care and 24-Hour Care — each with “this helps if”, what we help with, what we don't do, and a day with us.",
      "The quiz, the assessment form and the referral form use the same five names.",
    ],
  },
  {
    title: "No proof",
    done: [
      "Real Google reviews, shown as first name and last initial.",
      "Meet the owner, caregiver spotlights, an FAQ with search, the payment guide, the map and town pages — all ready for your real photos and answers.",
    ],
  },
  {
    title: "Small bugs",
    done: [
      "No “#” links: every button goes somewhere real.",
      "“sippers” is now “zippers”. One form per page. One menu for phone and computer.",
      "Years in business are worked out from 2002, never typed in. Every phone number is a tap-to-call link.",
    ],
  },
  {
    title: "SMS compliance",
    done: [
      "Two separate text-message boxes — care texts and optional news — both unticked and optional.",
      "The full disclosure (frequency, rates, HELP/STOP) next to each box, with links to the Privacy Policy and SMS Terms.",
      "Each lead carries proof: which boxes were ticked, the exact wording version, the time and the page.",
    ],
  },
];

const TRY = [
  "Open the Home page in a new tab to see the logo film again (it plays once per visit).",
  "Open Comfort (bottom left) and try bigger text, high contrast and reduce motion.",
  "Take the quiz on the Home page, then press “Get your plan” — the assessment form is already filled in.",
  "Fill in the Free Care Assessment. In this preview nothing is sent: each request is saved on this computer only.",
];

export default function RevealNotesPage() {
  const { items } = collectPrelaunch();
  const groups = (Object.keys(PRELAUNCH_GROUPS) as PrelaunchGroup[])
    .map((g) => ({ id: g, ...PRELAUNCH_GROUPS[g], list: items.filter((i) => i.group === g) }))
    .filter((g) => g.list.length);

  return (
    <>
      <PageHero
        path="/reveal-notes"
        eyebrow="Reveal notes · preview only"
        title={["Your new website,", "finally", "done right."]}
        lead={
          <>
            What&apos;s new, the seven fixes, the logo choice, and the {items.length} things we need
            from you before it goes live. This page is private: it isn&apos;t linked anywhere and
            won&apos;t exist on the live site.
          </>
        }
      >
        <a href="#need" className="btn btn-primary">
          What we need from you
        </a>
        <a href="#logo" className="btn btn-ghost">
          Choose the logo
        </a>
      </PageHero>

      <section aria-labelledby="new-h" className="bg-white py-[72px] lg:py-section-sm">
        <div className="wrap flex flex-col gap-10">
          <SectionHead
            id="new-h"
            eyebrow="01 — What's new"
            title={
              <>
                Then and <span className="accent">now</span>.
              </>
            }
          />
          <ul className="grid gap-5 lg:grid-cols-2">
            {NEW.map((n) => (
              <li key={n.was} className="card flex flex-col gap-3 p-6 lg:p-7">
                <p className="sm muted">
                  <span className="font-semibold">Before:</span> {n.was}
                </p>
                <p>
                  <span className="font-semibold text-plum-800">Now:</span> {n.now}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section
        aria-labelledby="fixes-h"
        data-surface="dark"
        data-cursor-theme="dark"
        className="bg-plum-950 py-[72px] text-white lg:py-section-sm"
      >
        <div className="wrap flex flex-col gap-10">
          <SectionHead
            id="fixes-h"
            eyebrow="02 — The seven fixes"
            title={
              <>
                Every fix we <span className="accent">promised</span>.
              </>
            }
            lead="The seven problems we found on the old site, and what the new one does instead."
            dark
          />
          <ol className="grid gap-8 lg:grid-cols-2">
            {FIXES.map((f, i) => (
              <li key={f.title} className="flex gap-5">
                <span aria-hidden="true" className="ff text-[2.5rem] leading-none text-orchid-100">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex flex-col gap-3">
                  <h3 className="h3 text-white">
                    <span className="sr-only">Fix {i + 1}: </span>
                    {f.title}
                  </h3>
                  <ul className="flex list-disc flex-col gap-2 pl-5 text-plum-100">
                    {f.done.map((d) => (
                      <li key={d}>{d}</li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="logo" aria-labelledby="logo-h" className="py-[72px] lg:py-section-sm">
        <div className="wrap flex flex-col gap-10">
          <SectionHead
            id="logo-h"
            eyebrow="03 — Your logo"
            title={
              <>
                Two figures, <span className="accent">one</span> choice.
              </>
            }
            lead="Option A is your logo as it is today, redrawn in the new colors. Option B changes only the figure: two people instead of a wheelchair, so it reads as care and family rather than disability or medical equipment. Try each one in the header above."
          />
          <FigureSwitch
            initial={flags.logoFigure}
            a={
              <Logo
                variant="stacked"
                figure="a"
                uid="rn-a"
                title="Option A: the logo with the wheelchair figure"
                className="h-auto w-full max-w-[360px]"
              />
            }
            b={
              <Logo
                variant="stacked"
                figure="b"
                uid="rn-b"
                title="Option B: the logo with two people"
                className="h-auto w-full max-w-[360px]"
              />
            }
          />
          <p className="max-w-[65ch]">
            Whichever you choose, switching the whole site is one setting (
            <code className="sm">NEXT_PUBLIC_LOGO_FIGURE</code>) — no redesign.
          </p>
        </div>
      </section>

      <section aria-labelledby="try-h" className="bg-white py-[72px] lg:py-section-sm">
        <div className="wrap flex flex-col gap-8">
          <SectionHead
            id="try-h"
            eyebrow="04 — Try it"
            title={
              <>
                Four things to <span className="accent">try</span>.
              </>
            }
          />
          <ol className="flex max-w-[65ch] list-decimal flex-col gap-3 pl-6">
            {TRY.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ol>
        </div>
      </section>

      <section id="need" aria-labelledby="need-h" className="py-[72px] lg:py-section-sm">
        <div className="wrap flex flex-col gap-10">
          <SectionHead
            id="need-h"
            eyebrow="05 — What we need from you"
            title={
              <>
                {items.length} answers, then we <span className="accent">launch</span>.
              </>
            }
            lead="Until each one is confirmed, this preview shows a small “to confirm” tag and the live site leaves that line out. Nothing is made up. The quickest way through: we go down this list together."
          />
          <div className="grid gap-6 lg:grid-cols-2">
            {groups.map((g) => (
              <section key={g.id} aria-labelledby={`need-${g.id}`} className="card p-6 lg:p-8">
                <h3 id={`need-${g.id}`} className="h3">
                  {g.title} ({g.list.length})
                </h3>
                <p className="sm muted mt-1">{g.intro}</p>
                <ul className="mt-5 flex flex-col gap-3">
                  {g.list.map((i) => (
                    <li key={i.text} className="flex gap-3">
                      <span
                        aria-hidden="true"
                        className="mt-[0.6em] size-2 shrink-0 rounded-full bg-plum-800"
                      />
                      <span className="min-w-0 [overflow-wrap:anywhere]">{i.text}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
