import type { Metadata } from "next";
import Link from "next/link";
import {
  BadgeCheck,
  CalendarClock,
  Check,
  Clock,
  FileText,
  HandHeart,
  HeartHandshake,
  Home,
  Minus,
  Phone,
  Printer,
  ShieldCheck,
  UserRound,
  Users,
} from "lucide-react";
import { contact, flags, hours, service } from "@/content/site.config";
import { pageMetadata } from "@/lib/seo";
import { PageHero, SectionHead } from "@/components/ui/PageHero";
import { DuskCta } from "@/components/ui/DuskCta";
import { Accordion, type AccordionItem } from "@/components/ui/Accordion";
import { ReferralForm } from "@/components/forms/ReferralForm";
import "@/components/forms/forms.css";

export const metadata: Metadata = pageMetadata("/for-professionals");

const phone = contact.phone.value;
const fax = contact.fax.value;
const email = contact.email.value;
const ph = flags.showPlaceholders;
const hospice = service.hospiceSupport.confirmed && service.hospiceSupport.value;
const response = service.referralResponseTime;
const firstShift = service.typicalStartTime;
const tbc = (chip: string) => <span className="tbc">{chip}</span>;

const AUDIENCE = [
  "Discharge planners",
  "Case managers",
  "Social workers",
  "Home health teams",
  "Physician offices",
  ...(hospice || ph ? ["Hospice and palliative teams"] : []),
];

const CLIENTS = [
  {
    Icon: Home,
    title: "Going home from the hospital or rehab",
    text: "Help with bathing, meals and moving safely in the first days and weeks home.",
  },
  {
    Icon: CalendarClock,
    title: "Between home health visits",
    text: "Home health visits are usually short. We can be there for the hours in between.",
  },
  {
    Icon: UserRound,
    title: "Living alone and finding it harder",
    text: "Meals, housework, medication reminders and someone checking in.",
  },
  {
    Icon: Users,
    title: "Family caregivers near burnout",
    text: "Respite for a few hours, a weekend or longer — so the family can keep going.",
  },
  ...(hospice || ph
    ? [
        {
          Icon: HeartHandshake,
          title: "On hospice or palliative care",
          text: "Non-medical comfort and companionship alongside the hospice or palliative team.",
          chip: hospice ? undefined : "[TO CONFIRM: hospice/palliative support]",
        },
      ]
    : []),
] as { Icon: typeof Home; title: string; text: string; chip?: string }[];

type ScopeItem = { text: string; chip?: string };
const WE_DO: ScopeItem[] = [
  { text: "Bathing, showering and grooming" },
  { text: "Dressing" },
  { text: "Toileting and continence care" },
  { text: "Help with eating" },
  { text: "Safe transfers: bed, chair, wheelchair, room to room" },
  { text: "Meal planning and cooking" },
  { text: "Light housekeeping, laundry and linens" },
  { text: "Groceries and errands" },
  { text: "Medication reminders" },
  {
    text: "Going along to appointments",
    chip: service.transport.confirmed ? undefined : "[TO CONFIRM: do caregivers drive clients?]",
  },
  { text: "Companionship, walks and outings" },
  { text: "Respite for family caregivers" },
  { text: "Overnight and 24-hour shifts, 7 days a week" },
];
const WE_DONT: ScopeItem[] = [
  { text: "Nursing or skilled care" },
  { text: "Injections" },
  { text: "Wound care or dressing changes" },
  { text: "Giving medication (we give reminders only)" },
  ...(service.fillPillOrganizers.confirmed && service.fillPillOrganizers.value
    ? []
    : [
        {
          text: "Filling pill organizers",
          chip: service.fillPillOrganizers.confirmed
            ? undefined
            : "[TO CONFIRM: can caregivers fill weekly pill organizers? If yes, remove this line.]",
        },
      ]),
  { text: "Medical assessments or therapy" },
];

function ScopeText({ item }: { item: ScopeItem }) {
  return (
    <>
      {item.text}
      {item.chip && ph && <> {tbc(item.chip)}</>}
    </>
  );
}

const DoMark = ({ dont }: { dont?: boolean }) =>
  dont ? (
    <span className="flex size-7 flex-none items-center justify-center rounded-full bg-plum-100 text-plum-800">
      <Minus aria-hidden size={18} strokeWidth={2.5} />
    </span>
  ) : (
    <span className="flex size-7 flex-none items-center justify-center rounded-full bg-leaf-100 text-leaf-700">
      <Check aria-hidden size={18} strokeWidth={2.5} />
    </span>
  );

const COORDINATION = [
  {
    title: "Clear lanes",
    text: "Your team handles the medical side. We handle bathing, meals, the house, company and medication reminders. We never step into nursing.",
  },
  {
    title: "The hours in between",
    text: "Home health and hospice visits are usually short. We can be there for the rest of the day, overnight or around the clock.",
  },
  {
    title: "One person responsible",
    text: "Our owner meets every family and stays involved. You'll know who to call.",
  },
  {
    title: "Families kept in the loop",
    text: "We follow up and check in regularly, and we let the family know when something changes.",
    chip: "[TO CONFIRM: how Dawson shares updates with the care team — e.g. a call to the case manager when needs change]",
  },
];

const FAQ: AccordionItem[] = [
  ...(ph
    ? [
        {
          id: "pro-order",
          q: "Do you need a physician's order to start care?",
          a: (
            <p>
              {tbc(
                '[TO CONFIRM — draft: "No. Our care is non-medical, so families can start it without a doctor\'s order. If your client also needs skilled care, that comes from home health."]',
              )}
            </p>
          ),
        },
      ]
    : []),
  {
    id: "pro-payment",
    q: "How is care paid for?",
    a: (
      <div className="flex flex-col gap-3">
        <p>
          Most families pay privately. Some use long-term care insurance, VA benefits or Medicaid
          waiver programs. Medicare generally doesn&apos;t cover non-medical home care.
        </p>
        <Link className="link self-start" href="/paying-for-care#ways-to-pay">
          How families pay
        </Link>
      </div>
    ),
  },
  {
    id: "pro-discharge",
    q: "Can care start on the day of discharge?",
    a: (
      <p>
        Refer as early as you can and we&apos;ll do our best to have care ready for the first day
        home.
        {firstShift.confirmed && firstShift.value ? (
          <> {firstShift.value}</>
        ) : (
          ph && <> {tbc("[TO CONFIRM: typical time from referral to first shift]")}</>
        )}
      </p>
    ),
  },
  {
    id: "pro-info",
    q: "What information do you need?",
    a: (
      <p>
        Online: your contact details, the client&apos;s first name, last initial and town, the
        services needed and the timing. We&apos;ll get the rest by phone. By fax, include your
        callback number.
      </p>
    ),
  },
  ...(ph
    ? [
        {
          id: "pro-hospice",
          q: "Do you take clients on hospice?",
          a: (
            <p>
              {tbc(
                '[TO CONFIRM — draft: "Yes. We provide non-medical comfort, companionship and personal care alongside the hospice team, and respite for the family."]',
              )}
            </p>
          ),
        },
      ]
    : []),
];

const STEPS = [
  {
    t: "We call you",
    d: "to talk through needs, timing and who to contact.",
    extra: response.confirmed && response.value ? `Within ${response.value}.` : undefined,
    chip: response.confirmed ? undefined : "[Within — TO CONFIRM: referral response time]",
  },
  { t: "We reach the family", d: "and our owner sets up a free visit at home." },
  {
    t: "Care starts",
    d: "— a few hours or around the clock.",
    extra: firstShift.confirmed && firstShift.value ? firstShift.value : undefined,
    chip: firstShift.confirmed
      ? undefined
      : "[TO CONFIRM: typical time from referral to first shift]",
  },
  { t: "We keep checking in", d: "and adjust the plan as needs change." },
];

/**
 * For professionals (COPY_CONVERSION §5; inner-page language — BUILD_DECISIONS §E). JSON-LD:
 * BreadcrumbList only (no FAQPage here — SEO_PLAN §3.1).
 */
export default function ForProfessionalsPage() {
  return (
    <>
      <PageHero
        path="/for-professionals"
        eyebrow="For healthcare professionals"
        title={["Refer a client in about", "2 minutes", "."]}
        lead="For discharge planners, case managers, social workers and care teams. Non-medical home care across the Lowcountry since 2002 — from a few hours a week to around the clock."
        micro={
          <span className="flex flex-col gap-1">
            <span>Fax: {fax.display}</span>
            {response.confirmed && response.value ? (
              <span>We respond to referrals within {response.value}.</span>
            ) : (
              <span>
                Office hours: {hours.officeLabel}. Care: {hours.careLabel}.
                {ph && <> {tbc("[We respond to referrals within — referral response time]")}</>}
              </span>
            )}
          </span>
        }
      >
        <a className="btn btn-primary max-sm:w-full" href="#refer">
          Make a referral
        </a>
        <a
          className="btn btn-ghost max-sm:w-full"
          href={`tel:${phone.tel}`}
          data-cursor-label="Call"
        >
          <Phone aria-hidden size={20} strokeWidth={1.75} />
          Call {phone.display}
        </a>
      </PageHero>

      <div className="wrap -mt-4 pb-12 lg:-mt-8 lg:pb-16">
        <ul className="flex flex-wrap gap-x-6 gap-y-3 border-t border-line pt-6 font-semibold text-plum-800">
          {[
            { Icon: CalendarClock, t: "Since 2002" },
            { Icon: UserRound, t: "Owner-run" },
            { Icon: ShieldCheck, t: "Licensed & insured" },
            { Icon: HandHeart, t: "Non-medical" },
            { Icon: Clock, t: "Care 24/7" },
          ].map(({ Icon, t }) => (
            <li key={t} className="flex items-center gap-2">
              <Icon aria-hidden size={22} strokeWidth={1.75} className="text-orchid-700" />
              {t}
            </li>
          ))}
        </ul>
      </div>

      {/* 01 — Who we help */}
      <section
        id="who-we-help"
        aria-labelledby="who-title"
        className="scroll-mt-[calc(var(--header-h)+24px)] bg-white py-[72px] lg:py-28"
      >
        <div className="wrap flex flex-col gap-8 lg:gap-12">
          <SectionHead id="who-title" eyebrow="01 — Who we help" title="Who we help." />
          <div className="flex flex-col gap-3">
            <h3 className="h3 !text-[1.375rem]">This page is for</h3>
            <ul className="flex flex-wrap gap-2.5">
              {AUDIENCE.map((a) => (
                <li key={a} className="chip !min-h-11 bg-plum-100 !px-4 text-plum-800">
                  {a}
                  {a === "Hospice and palliative teams" && !hospice && (
                    <span className="sr-only"> (to confirm)</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
          <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {CLIENTS.map(({ Icon, title, text, chip }) => (
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
                <h3 className="h3 !text-[1.5rem]">{title}</h3>
                <p>
                  {chip && ph && <>{tbc(chip)} </>}
                  {text}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 02 — Scope of care */}
      <section
        id="scope"
        aria-labelledby="scope-title"
        className="scroll-mt-[calc(var(--header-h)+24px)] py-[72px] lg:py-28"
      >
        <div className="wrap flex flex-col gap-8 lg:gap-12">
          <SectionHead
            id="scope-title"
            eyebrow="02 — Scope of care"
            title="What we do — and what we don't."
            lead="All our care is non-medical. Here's exactly where the line is."
          />
          {/* Desktop: one table */}
          <table className="hidden w-full border-collapse overflow-hidden rounded-[20px] bg-white md:table">
            <caption className="sr-only">What Dawson does and doesn&apos;t do</caption>
            <thead>
              <tr className="border-b border-line">
                <th scope="col" className="w-1/2 p-6 text-left">
                  <span className="h3 flex items-center gap-3">
                    <DoMark /> We do
                  </span>
                </th>
                <th scope="col" className="w-1/2 border-l border-line p-6 text-left">
                  <span className="h3 flex items-center gap-3">
                    <DoMark dont /> We don&apos;t
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {WE_DO.map((d, i) => {
                const n = WE_DONT[i];
                return (
                  <tr key={d.text} className="align-top">
                    <td className="px-6 py-2.5">
                      <span className="flex items-start gap-3">
                        <Check
                          aria-hidden
                          size={22}
                          strokeWidth={2.25}
                          className="mt-0.5 flex-none text-leaf-700"
                        />
                        <span>
                          <span className="sr-only">We do: </span>
                          <ScopeText item={d} />
                        </span>
                      </span>
                    </td>
                    <td className="border-l border-line px-6 py-2.5">
                      {n && (
                        <span className="flex items-start gap-3">
                          <Minus
                            aria-hidden
                            size={22}
                            strokeWidth={2.25}
                            className="mt-0.5 flex-none text-plum-800"
                          />
                          <span>
                            <span className="sr-only">We don&apos;t: </span>
                            <ScopeText item={n} />
                          </span>
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
              <tr aria-hidden="true">
                <td className="pb-4" />
                <td className="border-l border-line pb-4" />
              </tr>
            </tbody>
          </table>
          {/* Mobile: two stacked lists */}
          <div className="flex flex-col gap-4 md:hidden">
            {[
              { title: "We do", items: WE_DO, dont: false },
              { title: "We don't", items: WE_DONT, dont: true },
            ].map((col) => (
              <div key={col.title} className="flex flex-col gap-4 rounded-[20px] bg-white p-6">
                <h3 className="h3 flex items-center gap-3">
                  <DoMark dont={col.dont} /> {col.title}
                </h3>
                <ul className="flex flex-col gap-2.5">
                  {col.items.map((it) => (
                    <li key={it.text} className="flex items-start gap-3">
                      {col.dont ? (
                        <Minus
                          aria-hidden
                          size={22}
                          strokeWidth={2.25}
                          className="mt-0.5 flex-none text-plum-800"
                        />
                      ) : (
                        <Check
                          aria-hidden
                          size={22}
                          strokeWidth={2.25}
                          className="mt-0.5 flex-none text-leaf-700"
                        />
                      )}
                      <span>
                        <ScopeText item={it} />
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="sm muted max-w-[760px]">
            Our team includes Certified Nursing Assistants. That doesn&apos;t change our scope: our
            care is non-medical.
          </p>
        </div>
      </section>

      {/* 03 — Referral form */}
      <section
        id="refer"
        aria-labelledby="refer-title"
        className="scroll-mt-[calc(var(--header-h)+24px)] bg-white py-[72px] lg:py-28"
      >
        <div className="wrap grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,380px)] lg:gap-16">
          <div className="flex min-w-0 flex-col gap-8">
            <SectionHead
              id="refer-title"
              eyebrow="03 — Make a referral"
              title="Make a referral."
              lead="About 2 minutes. Share only the minimum — we'll get the rest by phone."
            />
            <div className="flex gap-4 rounded-[20px] bg-plum-100 p-6">
              <ShieldCheck
                aria-hidden
                size={28}
                strokeWidth={1.75}
                className="mt-0.5 flex-none text-plum-800"
              />
              <div className="flex flex-col gap-1.5">
                <h3 className="h3 !text-[1.375rem]">Please don&apos;t send medical details here</h3>
                <p>
                  No diagnoses, dates of birth, Social Security, Medicare, Medicaid or insurance
                  numbers. Client first name, last initial and town are all we need online.
                </p>
              </div>
            </div>
            <ReferralForm />
          </div>

          {/* 04 — Fax and phone (beside the form on desktop) */}
          <aside
            id="fax-phone"
            aria-labelledby="fax-title"
            className="flex scroll-mt-[calc(var(--header-h)+24px)] flex-col gap-5 lg:sticky lg:top-[calc(var(--header-h)+24px)]"
          >
            <p className="eyebrow">04 — Fax or call</p>
            <h2 id="fax-title" className="h3">
              Prefer fax or phone?
            </h2>
            <div className="flex flex-col gap-2 rounded-[20px] border border-line bg-cream p-6">
              <h3 className="flex items-center gap-2.5 text-[1.25rem] font-semibold text-plum-800">
                <Printer aria-hidden size={22} strokeWidth={1.75} className="text-orchid-700" />
                Fax a referral
              </h3>
              <p className="ff text-[2rem] leading-none text-plum-800">{fax.display}</p>
              <p>
                Please include your name, organization and a callback number; the client&apos;s name
                and town; the services needed; and when care should start.
              </p>
            </div>
            <div className="flex flex-col gap-2 rounded-[20px] border border-line bg-cream p-6">
              <h3 className="flex items-center gap-2.5 text-[1.25rem] font-semibold text-plum-800">
                <Phone aria-hidden size={22} strokeWidth={1.75} className="text-orchid-700" />
                Call us
              </h3>
              <a
                href={`tel:${phone.tel}`}
                data-cursor-label="Call"
                className="ff inline-flex min-h-12 items-center self-start text-[2rem] leading-none text-plum-800"
              >
                {phone.display}
              </a>
              <p>
                Office: {hours.officeLabel}. Care: {hours.careLabel}.
              </p>
            </div>
            <p className="sm">
              General questions: <a href={`mailto:${email}`}>{email}</a>. Please don&apos;t email
              client details.
            </p>
          </aside>
        </div>
      </section>

      {/* 05 — Response time */}
      <section
        id="response"
        aria-labelledby="response-title"
        className="scroll-mt-[calc(var(--header-h)+24px)] py-[72px] lg:py-28"
      >
        <div className="wrap grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-20">
          <div className="flex flex-col gap-6">
            <SectionHead
              id="response-title"
              eyebrow="05 — What to expect"
              title="What happens after you refer."
            />
            <p className="lead">
              Discharge coming up? Refer as early as you can. It gives us time to plan the first
              days home.
            </p>
          </div>
          <ol className="flex flex-col gap-5">
            {STEPS.map((s, i) => (
              <li key={s.t} className="flex gap-4">
                <span aria-hidden="true" className="nxn flex-none">
                  {i + 1}
                </span>
                <p className="pt-1">
                  <strong className="text-plum-800">{s.t}</strong> {s.d}
                  {s.extra && <> {s.extra}</>}
                  {s.chip && ph && <> {tbc(s.chip)}</>}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 06 — Referral sheet */}
      <section
        id="referral-sheet"
        aria-labelledby="sheet-title"
        className="scroll-mt-[calc(var(--header-h)+24px)] bg-white py-[72px] lg:py-24"
      >
        <div className="wrap">
          <div className="flex flex-col gap-5 rounded-[28px] bg-orchid-100 p-6 sm:flex-row sm:items-center sm:gap-8 lg:p-10">
            <span
              aria-hidden="true"
              className="flex size-16 flex-none items-center justify-center rounded-2xl bg-white text-plum-800"
            >
              <FileText size={30} strokeWidth={1.75} />
            </span>
            <div className="flex flex-1 flex-col gap-2">
              <p className="eyebrow">06 — For your files</p>
              <h2 id="sheet-title" className="h2">
                A one-page sheet for your office.
              </h2>
              <p>
                Everything on one page: what we do and don&apos;t do, how to refer, and our phone
                and fax numbers.
              </p>
            </div>
            <div className="flex flex-col items-start gap-2 sm:max-w-[300px]">
              <button
                type="button"
                aria-disabled="true"
                className="btn !cursor-not-allowed !border-line !bg-line !text-muted !shadow-none max-sm:w-full"
              >
                Referral sheet — coming soon
              </button>
              <p className="sm muted">
                In the meantime, save this page or note our fax: {fax.display}.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 07 — Coordination */}
      <section
        id="coordination"
        aria-labelledby="coord-title"
        data-surface="dark"
        data-cursor-theme="dark"
        className="relative scroll-mt-[calc(var(--header-h)+24px)] overflow-hidden bg-plum-950 pt-[88px] pb-[72px] lg:pt-[104px] lg:pb-24"
      >
        <svg
          aria-hidden="true"
          focusable="false"
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
          className="absolute top-10 left-0 h-20 w-full"
        >
          <path
            d="M0 40 H1000 L1014 30 L1026 40 H1038 L1058 6 L1080 74 L1098 24 L1110 40 H1440"
            fill="none"
            className="stroke-orchid-500"
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        <div className="relative wrap">
          <SectionHead
            dark
            id="coord-title"
            eyebrow="07 — Working together"
            title="We work alongside your team."
            lead="Home care fills the hours your team isn't there — and stays in its lane."
          />
          <ol className="mt-10 grid gap-8 md:grid-cols-2 lg:mt-12 lg:grid-cols-4">
            {COORDINATION.map((p, i) => (
              <li key={p.title} className="flex flex-col gap-3.5 border-t-2 border-plum-600 pt-7">
                <span
                  aria-hidden="true"
                  className="ff text-[3rem] leading-none text-orchid-500 lg:text-[4rem]"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="h3 !text-white">{p.title}</h3>
                <p className="text-plum-100">
                  {p.text}
                  {p.chip && ph && <> {tbc(p.chip)}</>}
                </p>
              </li>
            ))}
          </ol>
          {(hospice || ph) && (
            <p className="mt-10 flex max-w-[760px] items-start gap-3 text-cream">
              <BadgeCheck
                aria-hidden
                size={22}
                strokeWidth={1.75}
                className="mt-1 flex-none text-plum-100"
              />
              <span>
                Already working with a hospice or palliative team? We can provide non-medical
                comfort and companionship alongside them.
                {!hospice && <> {tbc("[TO CONFIRM: hospice/palliative support]")}</>}
              </span>
            </p>
          )}
        </div>
      </section>

      {/* 08 — Questions */}
      <section
        id="pro-faq"
        aria-labelledby="pfaq-title"
        className="scroll-mt-[calc(var(--header-h)+24px)] bg-white py-[72px] lg:py-28"
      >
        <div className="wrap grid items-start gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
          <SectionHead
            id="pfaq-title"
            eyebrow="08 — Questions"
            title="Questions from professionals."
          />
          <Accordion items={FAQ} />
        </div>
      </section>

      <DuskCta
        title={["Let's get your client home with", "support", "."]}
        lead="One call. One free visit at home. No pressure."
        afterHours={false}
        actions={
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-3 md:flex-row md:flex-wrap md:gap-4">
              <a className="btn btn-primary max-md:w-full" href="#refer">
                Make a referral
              </a>
              <a
                className="btn btn-cream max-md:w-full"
                href={`tel:${phone.tel}`}
                data-cursor-label="Call"
              >
                <Phone aria-hidden size={20} strokeWidth={1.75} />
                Call {phone.display}
              </a>
            </div>
            <p className="sm text-plum-100">Fax {fax.display}</p>
          </div>
        }
      />
    </>
  );
}
