import type { Metadata } from "next";
import { CalendarCheck, House, MessageSquare, Phone, RefreshCw } from "lucide-react";
import { contact, hours } from "@/content/site.config";
import { pageMetadata } from "@/lib/seo";
import { PageHero, SectionHead } from "@/components/ui/PageHero";
import { AssessmentButton } from "@/components/ui/AssessmentButton";
import { DuskCta } from "@/components/ui/DuskCta";
import { Accordion } from "@/components/ui/Accordion";
import { Segs } from "@/components/ui/Segs";
import { HubMap } from "@/components/areas/HubMap";
import { TownList } from "@/components/areas/TownList";
import type { Segs as SegsData } from "@/content/towns";

export const metadata: Metadata = pageMetadata("/areas-we-serve");

const phone = contact.phone.value;
const text = contact.tollFree.value;

const FAQS: { id: string; q: string; a: SegsData }[] = [
  {
    id: "how-far",
    q: "How far do you travel?",
    a: [
      "Our office is in Beaufort. We care for families across Beaufort County and in nearby towns in Jasper and Hampton counties — from about 5 to 55 minutes away.",
      { chip: "[service radius]" },
      " If your town isn't listed, call us anyway.",
    ],
  },
  {
    id: "travel-fees",
    q: "Is there an extra charge for towns farther away?",
    a: [
      "Your rate is set at your free assessment, based on the care you need. Ask us about your town and we'll tell you up front.",
      { chip: "[travel or distance fees]" },
    ],
  },
  {
    id: "start-time",
    q: "How soon can care start in my town?",
    a: [
      "It depends on the hours you need and where you live. Call us and we'll give you a straight answer.",
      { chip: "[typical start time]" },
    ],
  },
];

const SAME = [
  {
    Icon: House,
    title: "The owner comes to you.",
    text: "Your free assessment happens at home, in every town we serve.",
  },
  {
    Icon: CalendarCheck,
    title: "Care whenever you need it.",
    text: (
      <>
        <strong>Care:</strong> {hours.careLabel}. <strong>Office:</strong> {hours.officeLabel}.
      </>
    ),
  },
  {
    Icon: RefreshCw,
    title: "We keep checking in.",
    text: "We follow up regularly and adjust the plan as needs change.",
  },
];

/** Areas we serve hub (COPY_AREAS §2; built from Home "Where we care" — BUILD_DECISIONS §E). */
export default function AreasPage() {
  return (
    <>
      <PageHero
        path="/areas-we-serve"
        eyebrow="Areas we serve"
        title={["Home care across the", "Lowcountry", "— from our office in Beaufort."]}
        lead="Our caregivers come to you: in town, out on the islands and across the Broad River. Find your town below."
        micro="Free visit at home. No obligation."
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

      <section
        id="find-your-town"
        aria-labelledby="find-title"
        className="bg-white py-[72px] lg:py-section"
      >
        <div className="wrap flex flex-col gap-8 lg:gap-12">
          <SectionHead
            id="find-title"
            title="Find your town."
            lead="Select a town to see what care looks like there. Our office is the pin in Beaufort."
          />
          <HubMap />
        </div>
      </section>

      <section id="towns" aria-labelledby="towns-title" className="py-[72px] lg:py-section">
        <div className="wrap flex flex-col gap-8 lg:gap-12">
          <SectionHead id="towns-title" title="Towns we serve" />
          <TownList />
          <div className="flex flex-col gap-4 rounded-[20px] border border-line bg-white p-6 lg:flex-row lg:items-center lg:justify-between lg:p-8">
            <div className="flex flex-col gap-2">
              <h2 className="h3">Don&apos;t see your town?</h2>
              <p>We may still be able to help. Call us and tell us where your loved one lives.</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                className="btn btn-ghost max-sm:w-full"
                href={`tel:${phone.tel}`}
                data-cursor-label="Call"
              >
                <Phone aria-hidden size={20} strokeWidth={1.75} />
                Call {phone.display}
              </a>
              <a className="btn btn-ghost max-sm:w-full" href={`sms:${text.tel}`}>
                <MessageSquare aria-hidden size={20} strokeWidth={1.75} />
                Text us {text.display}
              </a>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="same-title" className="bg-plum-100 py-[72px] lg:py-section-sm">
        <div className="wrap flex flex-col gap-8 lg:gap-12">
          <SectionHead id="same-title" title="Wherever you live, it's the same Dawson." />
          <ul className="grid gap-4 md:grid-cols-3">
            {SAME.map(({ Icon, title, text: t }) => (
              <li key={title} className="flex flex-col gap-3 rounded-[20px] bg-white p-6">
                <span
                  aria-hidden="true"
                  className="flex size-12 items-center justify-center rounded-2xl bg-orchid-100 text-plum-800"
                >
                  <Icon size={24} strokeWidth={1.75} />
                </span>
                <h3 className="h3 !text-h4">{title}</h3>
                <p>{t}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="where-faq-title" className="py-[72px] lg:py-section">
        <div className="wrap grid items-start gap-8 lg:grid-cols-[380px_minmax(0,1fr)] lg:gap-16">
          <SectionHead id="where-faq-title" title="Questions about where we care" />
          <Accordion
            items={FAQS.map((f) => ({
              id: f.id,
              q: f.q,
              a: (
                <p>
                  <Segs segs={f.a} />
                </p>
              ),
            }))}
          />
        </div>
      </section>

      <DuskCta title={["Let's talk about care where your family lives.", "", ""]} />
    </>
  );
}
