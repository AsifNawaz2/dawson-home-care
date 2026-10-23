import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CircleAlert, Clock, MessageSquare, Moon, Phone } from "lucide-react";
import { Logo, type LogoTone, type LogoVariant } from "@/components/brand/Logo";
import { CtaLabel, OfficeStatusChip } from "@/components/layout/OfficeStatus";
import { flags, hours } from "@/content/site.config";
import { colorTokens } from "@/content/tokens";
import { contrast } from "@/lib/contrast";
import { AnswerDemo, FigureToggle, ReplayIntro, SliderDemo, SwitchDemo } from "./_demos";
import "./styleguide.css";

export const metadata: Metadata = {
  title: "Styleguide | Dawson & Dawson Home Care",
  robots: { index: false, follow: false },
};

const CREAM = "#FBF8F3";
const WHITE = "#FFFFFF";
const PLUM950 = "#1C0F3D";

function Section({
  id,
  title,
  intro,
  children,
}: {
  id: string;
  title: string;
  intro?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className="border-t border-line py-16 xl:py-20">
      <div className="mb-10 flex max-w-[48rem] flex-col gap-3">
        <h2 id={`${id}-h`} className="h2">
          {title}
        </h2>
        {intro && <p className="lead">{intro}</p>}
      </div>
      {children}
    </section>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <p className="sg-label">{children}</p>;
}

const ratio = (a: string, b: string) => contrast(a, b).toFixed(2);

export default function StyleguidePage() {
  // /styleguide returns 404 in production (SEO_PLAN §0 rule 8).
  if (flags.indexable) notFound();

  return (
    <div className="wrap pt-16 pb-24 xl:pt-20">
      <header className="flex max-w-[52rem] flex-col gap-5 pb-14">
        <p className="eyebrow">Design system · preview only</p>
        <h1 className="h1-hero">
          The Dawson <span className="accent">styleguide</span>.
        </h1>
        <p className="lead">
          Every color, type size, button, field, chip, card, logo version and cursor state used on
          the site — side by side. Built from the approved design and BRAND_FINAL.md.
        </p>
        <nav aria-label="Styleguide sections" className="flex flex-wrap gap-x-6 gap-y-1">
          {[
            ["colors", "Colors"],
            ["type", "Type"],
            ["buttons", "Buttons"],
            ["inputs", "Inputs"],
            ["chips", "Chips"],
            ["cards", "Cards"],
            ["logo", "Logo"],
            ["cursor", "Cursor"],
          ].map(([id, l]) => (
            <a key={id} href={`#${id}`} className="link">
              {l}
            </a>
          ))}
        </nav>
      </header>

      {/* ---------------- Colors ---------------- */}
      <Section
        id="colors"
        title="Colors"
        intro="The 16 locked tokens. No other colors exist in the build — Tailwind's default palette is switched off."
      >
        <ul role="list" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {colorTokens.map((c) => (
            <li
              key={c.token}
              className="overflow-hidden rounded-[16px] border border-line bg-white"
            >
              <div className="h-24 border-b border-line" style={{ background: c.hex }} />
              <div className="flex flex-col gap-1 p-4">
                <p className="font-semibold text-plum-800">
                  {c.token} <span className="sm muted font-normal">{c.hex}</span>
                </p>
                <p className="sm">{c.use}</p>
                <p className="sm muted">
                  On cream {ratio(c.hex, CREAM)} · on white {ratio(c.hex, WHITE)} · on plum-950{" "}
                  {ratio(c.hex, PLUM950)}
                </p>
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-8 grid gap-4 md:grid-cols-[2fr_1fr]">
          <div
            className="flex min-h-40 flex-col justify-end rounded-[20px] bg-dusk p-8"
            data-surface="dusk"
          >
            <p className="ff text-[2rem] text-white">Dusk — the only gradient</p>
            <p className="sm text-cream">Small text and buttons stay in the plum half (0–55%).</p>
          </div>
          <div
            className="flex flex-col justify-end rounded-[20px] bg-plum-950 p-8"
            data-surface="dark"
          >
            <p className="ff text-[2rem] text-white">Plum-950</p>
            <p className="sm text-plum-100">Footer, pros band, estimator output.</p>
          </div>
        </div>
      </Section>

      {/* ---------------- Type ---------------- */}
      <Section
        id="type"
        title="Type"
        intro="Anton for display, Poppins for everything else. Body text never goes below 18px or weight 400."
      >
        <div className="flex flex-col gap-8">
          {[
            [
              "Display · service H1 · Anton 52 → 96",
              <p key="d" className="h1-display">
                Personal care, done with <span className="accent">dignity</span>.
              </p>,
            ],
            [
              "Hero · Home H1 · Anton 48 → 72",
              <p key="h" className="h1-hero">
                Care that feels like <span className="accent">family</span>.
              </p>,
            ],
            [
              "Display-L · Anton 42 → 72",
              <p key="dl" className="dl text-plum-800">
                You don&apos;t have to figure this out alone.
              </p>,
            ],
            [
              "H2 · Anton 36 → 52",
              <p key="h2" className="h2">
                Every kind of help, under one roof.
              </p>,
            ],
            [
              "H3 · Anton 24 → 28",
              <p key="h3" className="h3">
                Personal Care
              </p>,
            ],
            [
              "FAQ question · Anton 21 → 24",
              <p key="fq" className="ff text-faq text-plum-800">
                What happens at the free assessment?
              </p>,
            ],
            [
              "Lead · Poppins 19 → 22",
              <p key="l" className="lead">
                Help at home for a few hours or around the clock, 7 days a week.
              </p>,
            ],
            [
              "Body · Poppins 18 / 1.65",
              <p key="b" className="max-w-[65ch]">
                Home care is non-medical help at home: bathing, dressing, meals, housekeeping,
                company and medication reminders. That&apos;s what we do.
              </p>,
            ],
            [
              "Small · Poppins 16 — helpers, captions, labels only",
              <p key="s" className="sm muted">
                Free visit at home. No obligation.
              </p>,
            ],
            [
              "Eyebrow · Poppins 14, 600, tracked — the only size under 16",
              <p key="e" className="eyebrow">
                01 — The moment
              </p>,
            ],
            [
              "Quote · Poppins italic 500",
              <p key="q" className="q text-[1.75rem] leading-[1.4] text-plum-800">
                &ldquo;This is a sample card. A real caregiver&apos;s words will go here.&rdquo;
              </p>,
            ],
            [
              "Link in running text — always underlined",
              <p key="a">
                Read the <a href="#type">privacy policy</a> before you send.
              </p>,
            ],
          ].map(([label, node]) => (
            <div
              key={label as string}
              className="grid gap-2 border-b border-line pb-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-8"
            >
              <Label>{label}</Label>
              {node}
            </div>
          ))}
        </div>
      </Section>

      {/* ---------------- Buttons ---------------- */}
      <Section
        id="buttons"
        title="Buttons"
        intro="Default, hover (lift), keyboard focus (3px leaf ring + plum inner ring) and disabled. Hover the live row to try them."
      >
        <div
          role="region"
          aria-label="Button states"
          tabIndex={0}
          className="grid items-center gap-x-6 gap-y-6 overflow-x-auto pb-2 lg:grid-cols-[160px_repeat(4,max-content)]"
        >
          <span />
          <Label>Default</Label>
          <Label>Hover</Label>
          <Label>Focus</Label>
          <Label>Disabled</Label>
          {[
            ["Primary", "btn-primary", "Get a Free Care Assessment"],
            ["Primary · after hours", "btn-primary", "Request a Callback"],
            ["Secondary (Call)", "btn-secondary", "Call (843) 379-3321"],
            ["Ghost", "btn-ghost", "See all care services"],
          ].map(([label, cls, text]) => (
            <div key={label} className="contents">
              <Label>{label}</Label>
              <span className={`btn ${cls} justify-self-start`}>{text}</span>
              <span className={`btn ${cls} sg-hover justify-self-start`}>{text}</span>
              <span className={`btn ${cls} sg-focus justify-self-start`}>{text}</span>
              <span className={`btn ${cls} justify-self-start`} aria-disabled="true">
                {text}
              </span>
            </div>
          ))}
        </div>
        <div
          className="mt-10 grid items-center gap-x-8 gap-y-6 rounded-[20px] bg-dusk p-8 lg:grid-cols-[160px_repeat(3,max-content)]"
          data-surface="dusk"
          data-cursor-theme="dark"
        >
          <Label>Ghost · cream on Dusk</Label>
          <span className="btn btn-cream justify-self-start">Text us (866) 632-9766</span>
          <span className="btn btn-cream sg-hover justify-self-start">Text us (866) 632-9766</span>
          <span className="btn btn-cream sg-focus-dusk justify-self-start">
            Text us (866) 632-9766
          </span>
        </div>
        <div className="mt-10 flex flex-col gap-4">
          <Label>Live — hover, Tab to focus, click</Label>
          <div className="flex flex-wrap items-center gap-4">
            <a className="btn btn-primary" href="#buttons">
              <CtaLabel />
            </a>
            <a className="btn btn-secondary" href="tel:+18433793321" data-cursor-label="Call">
              <Phone aria-hidden size={20} strokeWidth={1.75} className="ring-icon" />
              Call (843) 379-3321
            </a>
            <a className="btn btn-ghost" href="#buttons" data-cursor-label="View">
              See all care services
            </a>
            <button type="button" className="iconbtn" aria-label="Previous caregiver">
              ‹
            </button>
            <button
              type="button"
              className="iconbtn"
              aria-label="Next caregiver"
              aria-disabled="true"
            >
              ›
            </button>
            <a className="link" href="#buttons">
              See how we help →
            </a>
          </div>
        </div>
      </Section>

      {/* ---------------- Inputs ---------------- */}
      <Section
        id="inputs"
        title="Inputs"
        intro="Labels are always visible. Borders are 1.5px muted, 2px plum-800 on focus, 2px alert-700 with an icon and words on error."
      >
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="flex flex-col gap-6">
            <div className="fld">
              <label className="lbl" htmlFor="sg-1">
                Your first name (required)
              </label>
              <input id="sg-1" className="field" type="text" autoComplete="given-name" />
            </div>
            <div className="fld">
              <Label>Hover</Label>
              <input
                aria-label="Hover example"
                className="field sg-field-hover"
                type="text"
                defaultValue="Hover state"
              />
            </div>
            <div className="fld">
              <Label>Focus</Label>
              <input
                aria-label="Focus example"
                className="field sg-field-focus"
                type="text"
                defaultValue="Focus state"
              />
            </div>
            <div className="fld">
              <label className="lbl" htmlFor="sg-err">
                Phone (required)
              </label>
              <p id="sg-err-help" className="help">
                We&apos;ll call you on this number.
              </p>
              <input
                id="sg-err"
                className="field"
                type="tel"
                defaultValue="843 555"
                aria-invalid="true"
                aria-describedby="sg-err-help sg-err-msg"
              />
              <p id="sg-err-msg" className="emsg">
                <CircleAlert aria-hidden size={20} strokeWidth={1.75} className="flex-none" />
                Please enter a 10-digit phone number, like (843) 555-0123.
              </p>
            </div>
            <div className="fld">
              <label className="lbl" htmlFor="sg-dis">
                Disabled
              </label>
              <input
                id="sg-dis"
                className="field"
                type="text"
                disabled
                defaultValue="Not editable"
              />
            </div>
            <div className="fld">
              <label className="lbl" htmlFor="sg-sel">
                Where do they live? (required)
              </label>
              <select id="sg-sel" className="field" defaultValue="">
                <option value="">Choose a town</option>
                <optgroup label="Near our office">
                  <option value="beaufort">Beaufort</option>
                </optgroup>
                <option value="other">Somewhere else</option>
                <option value="not-sure">Not sure</option>
              </select>
            </div>
            <div className="fld">
              <label className="lbl" htmlFor="sg-ta">
                Anything else we should know?
              </label>
              <p id="sg-ta-help" className="help">
                Please don&apos;t include medical details — we&apos;ll talk about care needs by
                phone.
              </p>
              <textarea id="sg-ta" className="field" rows={4} aria-describedby="sg-ta-help" />
            </div>
          </div>

          <div className="flex flex-col gap-8">
            <fieldset className="flex flex-col gap-3 border-0 p-0">
              <legend className="lbl mb-3">Who is the care for? (required) — radio cards</legend>
              {["My parent", "My spouse or partner"].map((l, i) => (
                <label key={l} className="opt opt-sm">
                  <input type="radio" name="sg-radio" defaultChecked={i === 0} />
                  <span className="rdot" aria-hidden />
                  <span className="otl">{l}</span>
                </label>
              ))}
            </fieldset>
            <fieldset className="flex flex-col gap-3 border-0 p-0">
              <legend className="lbl mb-3">Choose all that might help. — checkbox cards</legend>
              {[
                ["Personal Care", "Bathing, dressing and getting around", true],
                ["Home Help", "Meals, laundry, errands and medication reminders", false],
              ].map(([t, s, on]) => (
                <label key={t as string} className="opt">
                  <input type="checkbox" defaultChecked={on as boolean} />
                  <span>
                    <span className="otl">{t}</span>
                    <span className="osub">{s}</span>
                  </span>
                  <span className="ock" aria-hidden>
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  </span>
                </label>
              ))}
            </fieldset>
            <fieldset className="flex flex-col gap-3 border-0 p-0">
              <legend className="lbl mb-1">Text messages (optional) — consent checkbox</legend>
              <p className="help mb-2">
                Both boxes are optional. You can send this form without ticking either one.
              </p>
              <label className="opt opt-sm items-start">
                <input type="checkbox" />
                <span className="sbox mt-0.5" aria-hidden>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </span>
                <span className="sm">
                  Example consent label — final wording comes from COPY_LEGAL §1.
                </span>
              </label>
            </fieldset>
            <div className="flex flex-col gap-3">
              <Label>Switch</Label>
              <div className="flex flex-wrap gap-8">
                <SwitchDemo label="Overnight or 24-hour care (off)" />
                <SwitchDemo label="Overnight or 24-hour care (on)" initial />
              </div>
            </div>
            <SliderDemo />
            <div className="flex flex-col gap-3">
              <Label>Quiz answer cards (tap to select)</Label>
              <AnswerDemo />
            </div>
            <div className="rounded-[12px] border-l-2 border-alert-700 bg-plum-100 p-5" role="note">
              <p className="font-semibold text-plum-800">
                Please check 2 answers before you continue.
              </p>
              <ul className="mt-2 flex flex-col gap-1">
                <li>
                  <a href="#sg-err" className="text-alert-700 underline">
                    Please enter a 10-digit phone number, like (843) 555-0123.
                  </a>
                </li>
                <li>
                  <a href="#sg-sel" className="text-alert-700 underline">
                    Please choose a town — or &quot;Not sure.&quot;
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Section>

      {/* ---------------- Chips ---------------- */}
      <Section
        id="chips"
        title="Chips & badges"
        intro="State is never color alone: every chip pairs an icon or dot with words."
      >
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="flex flex-col gap-4">
            <Label>Office status — light (hero, menus)</Label>
            <p className="chip chip-neutral self-start">
              <Clock aria-hidden size={18} strokeWidth={1.75} className="text-orchid-700" />
              Office hours: {hours.officeLabelShort}
            </p>
            <p className="chip chip-open self-start">
              <span aria-hidden className="dot-open" />
              Office open now
            </p>
            <p className="chip chip-open self-start">
              <span aria-hidden className="dot-open" />
              Office open until 5 PM
            </p>
            <p className="chip chip-closed self-start">
              <Moon aria-hidden size={18} strokeWidth={1.75} />
              Office closed · Opens Monday at 8 AM
            </p>
            <Label>Live (computed now, America/New_York)</Label>
            <OfficeStatusChip className="self-start" />
          </div>
          <div
            className="flex flex-col gap-4 rounded-[20px] bg-plum-950 p-8"
            data-surface="dark"
            data-cursor-theme="dark"
          >
            <Label>Office status — dark (footer)</Label>
            <p className="sm inline-flex items-center gap-2.5 font-semibold text-cream">
              <span aria-hidden className="dot-open" />
              Office open now · Call (843) 379-3321
            </p>
            <p className="sm inline-flex items-start gap-2.5 font-semibold text-cream">
              <Moon
                aria-hidden
                size={18}
                strokeWidth={1.75}
                className="mt-[3px] flex-none text-plum-100"
              />
              Office closed · Opens Monday at 8 AM. Request a callback and we&apos;ll reach you
              first thing.
            </p>
            <Label>Live</Label>
            <OfficeStatusChip size="expanded" surface="dark" />
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <span className="chip chip-orchid">Illustrative estimate</span>
            <span className="badge-leaf">The Dawson difference</span>
            <span className="chip chip-orchid !font-semibold">Women-owned</span>
            <span className="chip chip-closed">Sample</span>
            <span>
              Placeholder: <span className="tbc">[SC license number]</span>
            </span>
          </div>
        </div>
      </Section>

      {/* ---------------- Cards ---------------- */}
      <Section id="cards" title="Cards & surfaces">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="card flex flex-col gap-3">
            <h3 className="h3">Personal Care</h3>
            <p>Help with bathing, dressing and getting around — with dignity.</p>
            <p className="sm muted">Also called: help with daily living (ADLs)</p>
            <a className="link" href="#cards" data-cursor-label="Open">
              See how we help →
            </a>
          </div>
          <div
            className="flex flex-col gap-3 rounded-[20px] bg-plum-800 p-10"
            data-surface="dark"
            data-cursor-theme="dark"
          >
            <span className="badge-leaf self-start">The Dawson difference</span>
            <p className="eyebrow mt-2">Step 2</p>
            <h3 className="h3 !text-[2.25rem]">Our owner visits — free</h3>
            <p className="text-cream">
              Our owner comes to your loved one&apos;s home, meets the family and learns how they
              like to live.
            </p>
            <p className="sm text-plum-100">Free · No obligation · At home</p>
          </div>
          <div className="flex flex-col gap-3 rounded-[20px] bg-orchid-100 p-8">
            <p className="eyebrow">Our suggestion</p>
            <h3 className="h3">Companionship</h3>
            <p className="font-semibold text-plum-800">
              Company, conversation and getting out of the house.
            </p>
            <p className="sm">Light panels: plum-100, orchid-100 and leaf-100 surfaces.</p>
          </div>
        </div>
        <div
          className="mt-6 flex min-h-[260px] flex-col justify-end gap-4 rounded-[20px] bg-dusk p-10"
          data-surface="dusk"
          data-cursor-theme="dark"
        >
          <p className="dl max-w-[34rem] text-white">
            Let&apos;s talk about your <span className="accent">family</span>.
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="#cards" className="btn btn-primary">
              <CtaLabel />
            </a>
            <a href="tel:+18433793321" className="btn btn-cream" data-cursor-label="Call">
              <Phone aria-hidden size={20} strokeWidth={1.75} className="ring-icon" />
              Call (843) 379-3321
            </a>
            <a href="sms:+18666329766" className="btn btn-cream">
              <MessageSquare aria-hidden size={20} strokeWidth={1.75} />
              Text us (866) 632-9766
            </a>
          </div>
        </div>
      </Section>

      {/* ---------------- Logo ---------------- */}
      <Section
        id="logo"
        title="Logo"
        intro="A faithful SVG rebuild of the client's logo in the new colors (BRAND_FINAL §3). Hover any linked logo for the roof lift, window flicker and heartbeat pulse."
      >
        <div className="mb-8">
          <ReplayIntro />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {(
            [
              ["Stacked · default — header", "stacked", "default", "bg-cream border border-line"],
              ["Stacked · reversed — footer (plum-950 only)", "stacked", "reversed", "bg-plum-950"],
              [
                "Horizontal · default — email, PDFs",
                "horizontal",
                "default",
                "bg-white border border-line",
              ],
              ["Mark — compact uses", "mark", "default", "bg-white border border-line"],
              [
                "Mark · small cut (≤32px) — favicon, app icons",
                "mark-small",
                "default",
                "bg-cream border border-line",
              ],
              ["Mono plum — fax, print", "stacked", "mono-plum", "bg-white border border-line"],
              ["Mono cream — on plum-800", "stacked", "mono-cream", "bg-plum-800"],
              ["Mono cream — on Dusk", "stacked", "mono-cream", "bg-dusk"],
            ] as [string, LogoVariant, LogoTone, string][]
          ).map(([label, variant, tone, bg], i) => (
            <figure key={label} className="flex flex-col gap-3">
              <div
                className={`flex min-h-[220px] items-center justify-center rounded-[20px] p-8 ${bg}`}
              >
                <a
                  href="#logo"
                  className="logo-link block w-full max-w-[360px]"
                  aria-label={`${label} (example link)`}
                >
                  <Logo
                    variant={variant}
                    tone={tone}
                    uid={`sg-${i}`}
                    className={variant === "mark-small" ? "mx-auto h-auto w-24" : "h-auto w-full"}
                  />
                </a>
              </div>
              <figcaption className="sm muted">{label}</figcaption>
            </figure>
          ))}
        </div>
        <div className="mt-10 flex flex-col gap-4">
          <h3 className="h3">Figure: Option A (live) and Option B (one click away)</h3>
          <p className="max-w-[65ch]">
            Option B swaps only the figure — two people under the roof. Switch the whole site with{" "}
            <code className="sm">NEXT_PUBLIC_LOGO_FIGURE=b</code>. Currently live: Option{" "}
            {flags.logoFigure.toUpperCase()}.
          </p>
          <FigureToggle
            a={
              <Logo
                variant="stacked"
                figure="a"
                uid="sg-fa"
                className="mx-auto h-auto w-full max-w-[420px]"
              />
            }
            b={
              <Logo
                variant="stacked"
                figure="b"
                uid="sg-fb"
                className="mx-auto h-auto w-full max-w-[420px]"
              />
            }
          />
          <div className="flex flex-wrap items-end gap-8 pt-4">
            {[16, 24, 32, 48].map((s) => (
              <figure key={s} className="flex flex-col items-center gap-2">
                <Logo variant="mark-small" uid={`sg-ico-${s}`} style={{ width: s, height: s }} />
                <figcaption className="sm muted">{s}px</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </Section>

      {/* ---------------- Cursor ---------------- */}
      <Section
        id="cursor"
        title="Cursor ring"
        intro="Desktop with a mouse only. The native cursor always stays visible; the ring trails it. Off on touch, with reduced motion and in high contrast."
      >
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-9" aria-hidden="true">
          {[
            ["Idle · 36", { width: 36, height: 36, border: "1.5px solid #C25BD9" }, ""],
            [
              "Clickable · 64",
              {
                width: 64,
                height: 64,
                border: "1.5px solid color-mix(in srgb,#C25BD9 60%,transparent)",
                background: "color-mix(in srgb,#C25BD9 14%,transparent)",
              },
              "",
            ],
            ["Call · 84", { width: 84, height: 84, background: "#2A1856" }, "Call"],
            ["Open · 84", { width: 84, height: 84, background: "#2A1856" }, "Open"],
            ["Play · 84", { width: 84, height: 84, background: "#2A1856" }, "Play"],
            ["Drag · 84", { width: 84, height: 84, background: "#2A1856" }, "Drag"],
            [
              "Text field · 12",
              { width: 12, height: 12, border: "1.5px solid #C25BD9", opacity: 0.4 },
              "",
            ],
          ].map(([label, style, text]) => (
            <div key={label as string} className="flex flex-col items-center gap-3">
              <div className="grid h-[120px] place-items-center">
                <div className="sg-ring" style={style as React.CSSProperties}>
                  {text && (
                    <span className="text-[14px] font-semibold tracking-[0.02em] text-white">
                      {text as string}
                    </span>
                  )}
                </div>
              </div>
              <Label>{label as string}</Label>
            </div>
          ))}
          <div className="flex flex-col items-center gap-3">
            <div className="grid h-[120px] w-full place-items-center rounded-[16px] bg-plum-950">
              <div
                className="sg-ring"
                style={{
                  width: 64,
                  height: 64,
                  border: "1.5px solid color-mix(in srgb,#94C723 60%,transparent)",
                  background: "color-mix(in srgb,#94C723 18%,transparent)",
                }}
              />
            </div>
            <Label>Dark · clickable</Label>
          </div>
          <div className="flex flex-col items-center gap-3">
            <div className="grid h-[120px] w-full place-items-center rounded-[16px] bg-plum-950">
              <div className="sg-ring" style={{ width: 84, height: 84, background: "#94C723" }}>
                <span className="text-[14px] font-semibold tracking-[0.02em] text-plum-950">
                  Call
                </span>
              </div>
            </div>
            <Label>Dark · labelled</Label>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4">
          <Label>Live — move your mouse over each target</Label>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex min-h-32 items-center justify-center rounded-[16px] border border-line bg-white p-6 text-center">
              Plain area → idle ring
            </div>
            <a
              href="#cursor"
              className="flex min-h-32 items-center justify-center rounded-[16px] border border-line bg-white p-6 text-center"
            >
              Ordinary link → clickable
            </a>
            <a
              href="tel:+18433793321"
              data-cursor-label="Call"
              className="flex min-h-32 items-center justify-center rounded-[16px] border border-line bg-white p-6 text-center"
            >
              Phone link → “Call”
            </a>
            <a
              href="#cursor"
              data-cursor-label="Open"
              className="flex min-h-32 items-center justify-center rounded-[16px] border border-line bg-white p-6 text-center"
            >
              Service card → “Open”
            </a>
            <button
              type="button"
              data-cursor-label="Play"
              className="flex min-h-32 items-center justify-center rounded-[16px] border border-line bg-white p-6 text-center"
            >
              Video → “Play”
            </button>
            <div
              data-cursor=""
              data-cursor-label="Drag"
              className="flex min-h-32 items-center justify-center rounded-[16px] border border-line bg-white p-6 text-center"
            >
              Carousel → “Drag”
            </div>
            <a
              href="#cursor"
              data-cursor-label="View"
              className="flex min-h-32 items-center justify-center rounded-[16px] border border-line bg-white p-6 text-center"
            >
              Review / map town → “View”
            </a>
            <label className="flex min-h-32 flex-col justify-center gap-2 rounded-[16px] border border-line bg-white p-6">
              <span className="lbl">Text field → small ring</span>
              <input className="field" type="text" />
            </label>
            <div className="flex min-h-32 items-center justify-center rounded-[16px] border border-line bg-white p-6">
              <button type="button" className="btn btn-primary" aria-disabled="true">
                Disabled → idle
              </button>
            </div>
            <div
              className="flex min-h-32 flex-wrap items-center justify-center gap-4 rounded-[16px] bg-plum-950 p-6"
              data-surface="dark"
              data-cursor-theme="dark"
            >
              <a href="#cursor" className="link">
                Dark link
              </a>
              <a href="tel:+18433793321" data-cursor-label="Call" className="link">
                Dark “Call”
              </a>
            </div>
            <div
              data-cursor="none"
              className="flex min-h-32 items-center justify-center rounded-[16px] border border-dashed border-muted bg-white p-6 text-center"
            >
              Video controls / iframes → ring hides
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}
