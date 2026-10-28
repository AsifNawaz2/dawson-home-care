import type { Metadata } from "next";
import {
  BadgeCheck,
  Clock,
  ExternalLink,
  HandHeart,
  MapPin,
  Moon,
  Phone,
  ShowerHead,
  Users,
  UtensilsCrossed,
  Coffee,
} from "lucide-react";
import { contact, flags, links } from "@/content/site.config";
import { visibleCaregivers } from "@/content/caregivers";
import { pageMetadata } from "@/lib/seo";
import { PageHero, SectionHead } from "@/components/ui/PageHero";
import { AssessmentButton } from "@/components/ui/AssessmentButton";
import { DuskCta } from "@/components/ui/DuskCta";
import { Accordion } from "@/components/ui/Accordion";
import { PhotoSlot } from "@/components/ui/PhotoSlot";
import { StillCard } from "@/components/trust/CaregiverCard";
import "@/components/forms/forms.css";

export const metadata: Metadata = pageMetadata("/careers");

const phone = contact.phone.value;
const ph = flags.showPlaceholders;
const hireology = links.hireology.value;
const cards = visibleCaregivers(ph);
const realCards = cards.filter((c) => !c.placeholder).length;

const tbc = (chip: string) => <span className="tbc">{chip}</span>;

function ApplyButton({ cream = false }: { cream?: boolean }) {
  return (
    <span className="flex flex-col items-start gap-1.5">
      <a className="btn btn-primary max-sm:w-full" href={hireology}>
        Apply on Hireology
        <ExternalLink aria-hidden size={18} strokeWidth={2} />
      </a>
      <span className={cream ? "sm text-plum-100" : "sm muted"}>
        goes to careers.hireology.com, our hiring site
      </span>
    </span>
  );
}

const WHY = [
  {
    Icon: Users,
    title: "You'll know who you work for",
    text: "Dawson is owner-run. The owner meets every family we care for, so you're never just a name on a schedule.",
  },
  {
    Icon: MapPin,
    title: "Local and steady",
    text: "We've been part of Beaufort since 2002. Our office is on Robert Smalls Parkway.",
  },
  {
    Icon: HandHeart,
    title: "Work you can be proud of",
    text: "You help people stay in the homes they love — with dignity, and on their terms.",
  },
  {
    Icon: Clock,
    title: "Shifts at every hour",
    text: "Care runs 24 hours a day, 7 days a week, so there are day, evening, overnight and weekend shifts.",
    tbc: '[flexible scheduling — e.g. "Tell us the hours that work for you."]',
  },
];

const WORK = [
  {
    Icon: ShowerHead,
    title: "Personal care",
    text: "Helping with bathing, dressing and moving safely.",
  },
  {
    Icon: UtensilsCrossed,
    title: "Home help",
    text: "Cooking, laundry, light housekeeping, errands and medication reminders.",
  },
  { Icon: Coffee, title: "Companionship", text: "Conversation, games, walks and outings." },
  { Icon: HandHeart, title: "Respite", text: "Stepping in so a family caregiver can rest." },
  {
    Icon: Moon,
    title: "Overnight and 24-hour care",
    text: "Being there through the night, in shifts.",
  },
];

const FAQ = [
  ...(ph
    ? [
        {
          id: "job-cna",
          q: "Do I need to be a CNA?",
          a: <p>{tbc("[is CNA certification required for any role?]")}</p>,
        },
      ]
    : []),
  {
    id: "job-shifts",
    q: "What shifts are there?",
    a: (
      <p>
        Care runs 24 hours a day, 7 days a week, so shifts can be days, evenings, overnights and
        weekends.
        {ph && <> {tbc("[how shifts are scheduled and how much choice caregivers have]")}</>}
      </p>
    ),
  },
  ...(ph
    ? [
        {
          id: "job-car",
          q: "Do I need a car?",
          a: <p>{tbc("[car and license requirements; mileage policy]")}</p>,
        },
      ]
    : []),
  {
    id: "job-apply",
    q: "Where do I apply?",
    a: (
      <div className="flex flex-col gap-3">
        <p>Online, on Hireology, our hiring site. It&apos;s the fastest way to reach us.</p>
        <a className="link self-start" href={hireology}>
          Apply on Hireology
        </a>
      </div>
    ),
  },
];

/** Careers (COPY_CONVERSION §6; service-page sections + Home caregiver cards — BUILD_DECISIONS §E). */
export default function CareersPage() {
  return (
    <>
      <PageHero
        path="/careers"
        eyebrow="Careers"
        title={["Do work that", "matters", ", close to home."]}
        lead="Dawson has cared for Lowcountry families since 2002. If you're kind, patient and reliable, we'd like to meet you."
        aside={<PhotoSlot label="Caregiver at work · 3:2" ratio="3/2" />}
      >
        <ApplyButton />
        <a className="btn btn-ghost self-start max-sm:w-full" href="#the-work">
          See what the work is like ↓
        </a>
      </PageHero>

      <section
        id="why-dawson"
        aria-labelledby="why-title"
        className="bg-white py-[72px] lg:py-section"
      >
        <div className="wrap flex flex-col gap-8 lg:gap-12">
          <SectionHead id="why-title" eyebrow="01 — Why Dawson" title="Why work at Dawson." />
          <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {WHY.map(({ Icon, title, text, tbc: chip }) => (
              <li
                key={title}
                className="flex flex-col gap-3 rounded-[20px] border border-line bg-cream p-6"
              >
                <span
                  aria-hidden="true"
                  className="flex size-12 items-center justify-center rounded-2xl bg-plum-100 text-plum-800"
                >
                  <Icon size={24} strokeWidth={1.75} />
                </span>
                <h3 className="h3 !text-h4">{title}</h3>
                <p>{text}</p>
                {chip && ph && <p>{tbc(chip)}</p>}
              </li>
            ))}
          </ul>
          {ph && (
            <ul className="flex flex-col gap-2">
              <li>
                {tbc(
                  '[pay range or "competitive pay" — only if the client approves publishing it]',
                )}
              </li>
              <li>{tbc("[benefits — list only what's real]")}</li>
              <li>{tbc("[training or orientation provided]")}</li>
            </ul>
          )}
        </div>
      </section>

      <section
        id="the-work"
        aria-labelledby="work-title"
        className="scroll-mt-[calc(var(--header-h)+24px)] py-[72px] lg:py-section"
      >
        <div className="wrap grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
          <div className="flex flex-col gap-8">
            <SectionHead
              id="work-title"
              eyebrow="02 — The work"
              title="What a caregiver does."
              lead="All our care is non-medical. Every client has a plan our owner builds with the family."
            />
            <ul className="flex flex-col border-t border-line">
              {WORK.map(({ Icon, title, text }) => (
                <li key={title} className="flex gap-4 border-b border-line py-4">
                  <Icon
                    aria-hidden
                    size={26}
                    strokeWidth={1.75}
                    className="mt-1 flex-none text-orchid-700"
                  />
                  <div>
                    <h3 className="h3 !text-[1.375rem]">{title}</h3>
                    <p>{text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-4 rounded-[20px] bg-orchid-100 p-6 lg:p-8">
            <h3 className="h3">You might be a good fit if…</h3>
            <ul className="flex flex-col gap-3">
              {[
                "You're patient, and you like helping people with everyday things.",
                "You show up when you say you will.",
                "You respect people's homes, privacy and routines.",
                "You'd treat a client the way you'd want your own family treated.",
              ].map((x) => (
                <li key={x} className="flex items-start gap-3">
                  <BadgeCheck
                    aria-hidden
                    size={22}
                    strokeWidth={1.75}
                    className="mt-0.5 flex-none text-leaf-700"
                  />
                  {x}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section
        id="roles"
        aria-labelledby="roles-title"
        className="bg-white py-[72px] lg:py-section"
      >
        <div className="wrap flex flex-col gap-8">
          <SectionHead id="roles-title" eyebrow="03 — Roles" title="Roles we hire for." />
          {ph && (
            <>
              <p>{tbc("[current role types — check the Hireology listings at the reveal]")}</p>
              <ul className="grid gap-4 md:grid-cols-2">
                <li className="flex flex-col gap-2 rounded-[20px] border border-line bg-cream p-6">
                  <h3 className="h3 !text-h4">Caregiver</h3>
                  <p>
                    Non-medical care at home: personal care, home help and companionship.{" "}
                    {tbc("[requirements — e.g. experience, driver's license, reliable car]")}
                  </p>
                </li>
                <li className="flex flex-col gap-2 rounded-[20px] border border-line bg-cream p-6">
                  <h3 className="h3 !text-h4">Certified Nursing Assistant (CNA)</h3>
                  <p>
                    Our team includes CNAs.{" "}
                    {tbc(
                      "[is this a separate role at Dawson? Requirements: active SC CNA certification?]",
                    )}{" "}
                    In every role, our care is non-medical.
                  </p>
                </li>
              </ul>
            </>
          )}
          <p>
            Open positions are listed on Hireology, our hiring site.
            {ph && (
              <>
                {" "}
                <span className="tbc">
                  [If you don&apos;t see a role that fits, you can still apply. — does Hireology
                  accept general applications?]
                </span>
              </>
            )}
          </p>
        </div>
      </section>

      {cards.length > 0 && (realCards >= 3 || ph) && (
        <section id="team" aria-labelledby="team-title" className="py-[72px] lg:py-section">
          <div className="wrap flex flex-col gap-8 lg:gap-12">
            <SectionHead
              id="team-title"
              eyebrow="04 — Our team"
              title="Hear it from our caregivers."
            />
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {cards.map((c) => (
                <li key={c.id}>
                  <StillCard c={c} className="h-full" />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section
        id="apply"
        aria-labelledby="apply-title"
        className="bg-white py-[72px] lg:py-section"
      >
        <div className="wrap grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
          <div className="flex flex-col gap-6">
            <SectionHead id="apply-title" eyebrow="05 — Apply" title="Ready to apply?" />
            <ol className="flex flex-col gap-4">
              {[
                { t: "Apply online.", d: "It takes place on Hireology, our hiring site." },
                { t: "We review your application.", chip: "[how and when applicants hear back]" },
                {
                  t: "We meet.",
                  chip: "[interview and hiring steps — e.g. interview, background check, orientation. List only what's real.]",
                },
              ].map((s, i) => (
                <li key={s.t} className="flex gap-4">
                  <span aria-hidden="true" className="nxn flex-none">
                    {i + 1}
                  </span>
                  <p className="pt-1">
                    <strong className="text-plum-800">{s.t}</strong>
                    {s.d && <> {s.d}</>}
                    {s.chip && ph && <> {tbc(s.chip)}</>}
                  </p>
                </li>
              ))}
            </ol>
            <ApplyButton />
            <p className="sm muted">
              Questions first? Call{" "}
              <a href={`tel:${phone.tel}`} data-cursor-label="Call">
                {phone.display}
              </a>
              , Monday–Friday, 8 AM–5 PM.
            </p>
            {ph && (
              <p className="sm">
                {tbc("[equal opportunity employer statement — use the client's exact wording]")}
              </p>
            )}
          </div>
          <div id="careers-faq" className="flex flex-col gap-6">
            <SectionHead
              id="cfaq-title"
              eyebrow="06 — Questions"
              title="Questions about working here."
            />
            <Accordion items={FAQ} />
          </div>
        </div>
      </section>

      <div className="wrap py-10">
        <p className="flex flex-col items-start gap-3 rounded-[20px] bg-plum-100 p-6 sm:flex-row sm:items-center sm:justify-between">
          <span>Looking for care for someone you love, not a job?</span>
          <AssessmentButton href="/free-assessment" className="max-sm:w-full" />
        </p>
      </div>

      <DuskCta
        title={["Join a team that cares like", "family", "."]}
        lead="Owner-run in Beaufort since 2002."
        afterHours={false}
        actions={
          <>
            <ApplyButton cream />
            <a
              className="btn btn-cream self-start max-md:w-full"
              href={`tel:${phone.tel}`}
              data-cursor-label="Call"
            >
              <Phone aria-hidden size={20} strokeWidth={1.75} />
              Call {phone.display}
            </a>
          </>
        }
      />
    </>
  );
}
