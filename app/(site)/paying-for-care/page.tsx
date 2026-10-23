import type { Metadata } from "next";
import Link from "next/link";
import { CalendarClock, Clock3, MoonStar } from "lucide-react";
import { freeHelp } from "@/content/payments";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { AssessmentButton } from "@/components/ui/AssessmentButton";
import { DuskCta } from "@/components/ui/DuskCta";
import { ExtLink } from "@/components/ui/Blocks";
import { JumpBar } from "@/components/ui/JumpBar";
import { CostEstimator } from "@/components/features/CostEstimator";
import { PaymentExplorer } from "@/components/features/PaymentExplorer";
import { AgencyChecklist } from "@/components/features/AgencyChecklist";
import "@/components/forms/forms.css";

export const metadata: Metadata = {
  title: "Paying for Home Care in Beaufort, SC | Dawson & Dawson",
  description:
    "Estimate the cost of home care and see how families pay: private pay, long-term care insurance, VA benefits, Medicaid waivers — and what Medicare covers.",
};

const SECTION = "scroll-mt-[calc(var(--header-h)+24px)] lg:scroll-mt-[calc(var(--header-h)+92px)]";

const COST_FACTORS = [
  {
    Icon: Clock3,
    title: "Hours and days",
    text: "The biggest factor. More hours a week means a higher total — the estimator shows how much.",
  },
  {
    Icon: MoonStar,
    title: "Nights, weekends and holidays",
    text: "Some agencies charge more at these times. Ask before care starts.",
  },
  {
    Icon: CalendarClock,
    title: "Minimum visit length",
    text: "Many agencies have a minimum number of hours per visit. A short visit may cost the same as a longer one.",
  },
];

/** Paying for care (COPY_COST_FAQ; built from the Home estimator, quiz cards and tick lists). */
export default function PayingForCarePage() {
  return (
    <>
      <div className="wrap">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Paying for Care" }]} />
        <section
          aria-labelledby="pfc-title"
          className="flex max-w-[900px] flex-col items-start gap-3.5 pt-6 pb-12 lg:gap-4 lg:pt-10 lg:pb-16"
        >
          <p className="eyebrow">Paying for care</p>
          <h1
            id="pfc-title"
            className="ff text-[2.875rem] leading-[1.03] text-plum-800 lg:text-[5.25rem] lg:leading-none"
          >
            What care costs — and how families <span className="accent">pay</span> for it.
          </h1>
          <p className="lead max-w-[700px]">
            Straight answers, no sales pitch. Estimate the hours, see the ways families pay, and ask
            us anything.
          </p>
          <div className="mt-2 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:gap-4">
            <AssessmentButton href="/free-assessment" className="max-sm:w-full" />
            <a className="btn btn-ghost max-sm:w-full" href="#estimator">
              Estimate your cost ↓
            </a>
          </div>
          <p className="sm muted">Free visit at home. No obligation.</p>
        </section>
      </div>

      <JumpBar
        items={[
          { id: "estimator", label: "Estimate your cost" },
          { id: "ways-to-pay", label: "Ways to pay" },
          { id: "questions-to-ask", label: "Questions to ask" },
        ]}
      />

      <section
        id="estimator"
        aria-labelledby="est-title"
        className={`bg-white py-[72px] lg:py-28 ${SECTION}`}
      >
        <div className="wrap flex flex-col gap-8 lg:gap-12">
          <div className="flex max-w-[760px] flex-col gap-3 lg:gap-4">
            <p className="eyebrow">01 — Estimate your cost</p>
            <h2 id="est-title" className="h2">
              Estimate your cost.
            </h2>
            <p className="lead">
              Move the controls to match the help you have in mind. You&apos;ll see the hours and a
              rough cost range. No email, no sign-up.
            </p>
          </div>
          <CostEstimator
            variant="full"
            source="paying-for-care"
            readParams
            links={[
              { label: "Not sure how many hours? Take the 1-minute quiz", href: "/find-care" },
              { label: "See ways families pay ↓", href: "#ways-to-pay" },
            ]}
          />
          <div className="flex flex-col gap-5">
            <h3 className="h3">What changes the cost — at any agency</h3>
            <ul className="grid gap-4 md:grid-cols-3">
              {COST_FACTORS.map(({ Icon, title, text }) => (
                <li
                  key={title}
                  className="flex flex-col gap-2 rounded-[20px] border border-line bg-cream p-5 lg:p-6"
                >
                  <span
                    aria-hidden="true"
                    className="flex size-12 items-center justify-center rounded-2xl bg-plum-100 text-plum-800"
                  >
                    <Icon size={24} strokeWidth={1.75} />
                  </span>
                  <p className="font-bold text-plum-800">{title}</p>
                  <p>{text}</p>
                </li>
              ))}
            </ul>
            <Link className="link self-start" href="#questions-to-ask">
              Questions to ask any agency ↓
            </Link>
          </div>
        </div>
      </section>

      <section
        id="ways-to-pay"
        aria-labelledby="pay-title"
        className={`py-[72px] lg:py-28 ${SECTION}`}
      >
        <div className="wrap flex flex-col gap-8 lg:gap-12">
          <div className="flex max-w-[760px] flex-col gap-3 lg:gap-4">
            <p className="eyebrow">02 — Ways to pay</p>
            <h2 id="pay-title" className="h2">
              How families pay for home care.
            </h2>
            <p className="lead">
              Most families use one of these, or a mix. Pick one to see how it works — and what to
              ask.
            </p>
          </div>
          <PaymentExplorer />
          <div className="flex flex-col gap-5">
            <h3 className="h3">Free help nearby</h3>
            <div className="grid gap-4 md:grid-cols-2">
              {freeHelp.map((f) => (
                <div
                  key={f.name}
                  className="flex flex-col gap-2 rounded-[20px] border border-line bg-white p-5 lg:p-6"
                >
                  <h4 className="text-[1.25rem] font-bold text-plum-800">{f.name}</h4>
                  <p>{f.body}</p>
                  {f.phone && (
                    <p>
                      Phone:{" "}
                      <a
                        href={f.phone.href}
                        className="font-semibold underline underline-offset-[3px]"
                      >
                        {f.phone.label}
                      </a>
                    </p>
                  )}
                  {f.link && <ExtLink {...f.link} />}
                </div>
              ))}
            </div>
            <p className="lead">
              Not sure which applies? That&apos;s what the free visit is for. We&apos;ll talk
              through your options with you.
            </p>
            <AssessmentButton
              href="/free-assessment"
              variant="ghost"
              className="self-start max-sm:w-full"
            />
          </div>
        </div>
      </section>

      <section
        id="questions-to-ask"
        aria-labelledby="ask-title"
        className={`bg-white py-[72px] lg:py-28 ${SECTION}`}
      >
        <div className="wrap flex flex-col gap-8 lg:gap-10">
          <div className="flex max-w-[760px] flex-col gap-3 lg:gap-4">
            <p className="eyebrow">03 — Questions to ask</p>
            <h2 id="ask-title" className="h2">
              Questions to ask any home care agency.
            </h2>
            <p className="lead">
              Whoever you choose — us or someone else — these help you compare honestly. Tick them
              off as you ask, or print them for your calls.
            </p>
          </div>
          <AgencyChecklist />
        </div>
      </section>

      <DuskCta title={["Questions about cost? Let's", "talk", "."]} />
    </>
  );
}
