import type { Metadata } from "next";
import {
  Check,
  Clock3,
  Hourglass,
  Handshake,
  House,
  Users,
  UserRound,
  BadgeDollarSign,
} from "lucide-react";
import { contact, flags, owner } from "@/content/site.config";
import { coverList, haveReady, howHero } from "@/content/copy/howItWorks";
import { pageMetadata } from "@/lib/seo";
import { PageHero, SectionHead } from "@/components/ui/PageHero";
import { AssessmentButton } from "@/components/ui/AssessmentButton";
import { DuskCta } from "@/components/ui/DuskCta";
import { JumpBar } from "@/components/ui/JumpBar";
import { TickList } from "@/components/ui/TickList";
import { Tbc } from "@/components/ui/Tbc";
import { HowSteps } from "@/components/trust/HowSteps";
import { Phone } from "lucide-react";
import "@/components/home/home.css";

export const metadata: Metadata = pageMetadata("/how-it-works");

const phone = contact.phone.value;
const SECTION = "scroll-mt-[calc(var(--header-h)+24px)] lg:scroll-mt-[calc(var(--header-h)+92px)]";

const ownerName = owner.firstName.confirmed ? `Our owner, ${owner.firstName.value}` : "Our owner";
const FACTS: { Icon: typeof Clock3; label: string; value: React.ReactNode; show: boolean }[] = [
  { Icon: UserRound, label: "Who comes", value: ownerName, show: true },
  {
    Icon: House,
    label: "Where",
    value: (
      <>
        Your loved one&apos;s home{" "}
        <Tbc
          tbc={{ chip: "[can the visit happen at a hospital or rehab center before discharge?]" }}
        />
      </>
    ),
    show: true,
  },
  {
    Icon: Hourglass,
    label: "How long",
    value: <Tbc tbc={{ chip: "[typical length, e.g. about an hour]" }} />,
    show: flags.showPlaceholders,
  },
  { Icon: BadgeDollarSign, label: "Cost", value: "Free", show: true },
  {
    Icon: Handshake,
    label: "Commitment",
    value: "None. You decide if and when to start.",
    show: true,
  },
  {
    Icon: Users,
    label: "Who should be there",
    value: "Your loved one, and you or another family member if you can — in person or by phone.",
    show: true,
  },
];

/** How it works (COPY_TRUST; Home How-It-Works at full length — BUILD_DECISIONS §E). */
export default function HowItWorksPage() {
  return (
    <>
      <PageHero
        path="/how-it-works"
        eyebrow={howHero.eyebrow}
        title={howHero.title}
        lead={howHero.lead}
        micro={howHero.micro}
      >
        <AssessmentButton href="/free-assessment" className="max-sm:w-full" />
        <a
          className="btn btn-secondary max-sm:w-full"
          href={`tel:${phone.tel}`}
          data-cursor-label="Call"
        >
          <Phone aria-hidden size={20} strokeWidth={1.75} />
          Call {phone.display}
        </a>
      </PageHero>

      {/* The steps bar stays pinned only while the timeline is on screen. */}
      <div>
        <JumpBar
          label="Steps"
          currentValue="step"
          items={[
            { id: "step-1", label: "Call" },
            { id: "step-2", label: "Free visit" },
            { id: "step-3", label: "Your plan" },
            { id: "step-4", label: "Your caregiver" },
            { id: "step-5", label: "Check-ins" },
          ]}
        />

        <section
          id="steps"
          aria-labelledby="steps-title"
          className={`py-[72px] lg:py-28 ${SECTION}`}
        >
          <div className="wrap grid items-start gap-10 lg:grid-cols-[420px_minmax(0,1fr)] lg:gap-24">
            <div className="lg:sticky lg:top-[calc(var(--header-h)+112px)]">
              <SectionHead
                id="steps-title"
                eyebrow="01 — The 5 steps"
                title="Getting started is simple."
                lead="One call. One free visit. Then care that fits."
              />
            </div>
            <HowSteps />
          </div>
        </section>
      </div>

      <section
        id="free-assessment"
        aria-labelledby="visit-title"
        className={`bg-white py-[72px] lg:py-28 ${SECTION}`}
      >
        <div className="wrap flex flex-col gap-10 lg:gap-14">
          <SectionHead
            id="visit-title"
            eyebrow="02 — Your free visit"
            title="What to expect at your free assessment."
            lead="A friendly conversation at home — not an interview, and never a sales pitch."
          />
          <dl className="grid gap-4 md:grid-cols-2">
            {FACTS.filter((f) => f.show).map(({ Icon, label, value }) => (
              <div
                key={label}
                className="relative flex min-h-[88px] flex-col gap-0.5 rounded-[20px] border border-line bg-cream py-5 pr-5 pl-[84px]"
              >
                {/* The icon sits inside the <dt> so the <dl> holds only dt/dd groups. */}
                <dt className="font-bold text-plum-800">
                  <span
                    aria-hidden="true"
                    className="absolute top-5 left-5 flex size-12 items-center justify-center rounded-2xl bg-plum-100 text-plum-800"
                  >
                    <Icon size={24} strokeWidth={1.75} />
                  </span>
                  {label}
                </dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
            <div className="flex flex-col gap-4">
              <h3 className="h3">What we&apos;ll cover together</h3>
              <ul className="flex flex-col gap-3">
                {coverList.map((c) => (
                  <li key={c} className="flex items-start gap-3">
                    <Check
                      aria-hidden
                      size={22}
                      strokeWidth={2.25}
                      className="mt-0.5 flex-none text-leaf-700"
                    />
                    {c}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2 rounded-[20px] bg-orchid-100 p-6">
                <h3 className="h3">What we won&apos;t do</h3>
                <p>
                  We won&apos;t ask you to sign anything on the spot. We won&apos;t do a medical
                  exam — our care is non-medical.
                </p>
              </div>
              <div className="flex flex-col gap-2 rounded-[20px] bg-plum-100 p-6">
                <h3 className="h3">If your loved one is unsure</h3>
                <p>
                  That&apos;s normal. We keep it relaxed and talk <em>with</em> them, not about
                  them. Many people warm up once they see it&apos;s just a conversation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="have-ready"
        aria-labelledby="ready-title"
        className={`py-[72px] lg:py-28 ${SECTION}`}
      >
        <div className="wrap flex flex-col gap-8 lg:gap-10">
          <SectionHead
            id="ready-title"
            eyebrow="03 — Before the visit"
            title="What to have ready."
            lead="Helpful, not required. Tick them off as you go, or print the list."
          />
          <TickList
            items={haveReady}
            storageKey="have_ready_ticked"
            progress="{n} of {total} ready."
            done="All set. We'll take it from here."
            printLabel="Print this list"
            printTitle="What to have ready"
          />
          <p className="lead">
            Don&apos;t have everything? Come as you are. We&apos;ll fill in the gaps together.
          </p>
          <p className="sm muted">
            Please don&apos;t send medical details through our website. We&apos;ll go through
            everything in person.
          </p>
        </div>
      </section>

      <section
        id="start-time"
        aria-labelledby="start-title"
        className={`bg-white py-[72px] lg:py-28 ${SECTION}`}
      >
        <div className="wrap grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,480px)] lg:gap-16">
          <div className="flex flex-col gap-4">
            <SectionHead id="start-title" eyebrow="04 — Timing" title="How fast can care start?" />
            <p className="max-w-[60ch]">
              It depends on the help you need and when you need it. Tell us your timing on the first
              call. If it&apos;s urgent, say so — we&apos;ll move as quickly as we can.
            </p>
            {flags.showPlaceholders && (
              <p>
                <Tbc
                  tbc={{
                    lead: "Many families start care within",
                    chip: "[typical time from first call to first shift]",
                    after: " of their first call.",
                  }}
                />
              </p>
            )}
          </div>
          <div className="flex flex-col gap-3 rounded-[20px] border-2 border-plum-800 bg-orchid-100 p-6 lg:p-8">
            <h3 className="h3">Coming home from the hospital?</h3>
            <p>
              Call us before discharge if you can. We&apos;ll plan the first days home so
              there&apos;s no gap in care.
            </p>
            <a
              className="btn btn-ghost mt-2 self-start max-sm:w-full"
              href={`tel:${phone.tel}`}
              data-cursor-label="Call"
            >
              <Phone aria-hidden size={20} strokeWidth={1.75} />
              Call {phone.display}
            </a>
          </div>
        </div>
      </section>

      <DuskCta title={["Step one is a", "phone call", "."]} />
    </>
  );
}
