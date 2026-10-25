import type { Metadata } from "next";
import Link from "next/link";
import {
  Clock,
  ExternalLink,
  Mail,
  MapPin,
  MessageSquare,
  Moon,
  Phone,
  Printer,
} from "lucide-react";
import { address, contact, flags, hours, links } from "@/content/site.config";
import { textLineNote } from "@/content/legal/consent";
import { pageMetadata } from "@/lib/seo";
import { PageHero, SectionHead } from "@/components/ui/PageHero";
import { DuskCta } from "@/components/ui/DuskCta";
import { NextOpen, OfficeStatusChip } from "@/components/layout/OfficeStatus";
import { OfficeMap } from "@/components/areas/OfficeMap";
import { ContactForm } from "@/components/forms/ContactForm";
import "@/components/forms/forms.css";

export const metadata: Metadata = pageMetadata("/contact");

const phone = contact.phone.value;
const text = contact.tollFree.value;
const fax = contact.fax.value;
const email = contact.email.value;
const ph = flags.showPlaceholders;
const afterHoursLine = contact.afterHoursClientLine;
const maps = links.googleMaps.value;

const card =
  "flex flex-col gap-2 rounded-[20px] border border-line bg-white p-6 transition-colors lg:p-7";
const cardIcon = "flex size-12 items-center justify-center rounded-2xl bg-plum-100 text-plum-800";

function Directions({ className }: { className?: string }) {
  return (
    <p className={className}>
      <a href={maps} className="inline-flex min-h-12 items-center gap-1.5 font-semibold">
        Get directions
        <ExternalLink aria-hidden size={16} strokeWidth={2} />
      </a>{" "}
      <span className="sm muted">goes to Google Maps</span>
    </p>
  );
}

/** Contact (COPY_CONVERSION §7; inner-page language — BUILD_DECISIONS §E). JSON-LD: breadcrumbs. */
export default function ContactPage() {
  return (
    <>
      <PageHero
        path="/contact"
        eyebrow="Contact us"
        title={["We're here when you're", "ready", "."]}
        lead="Call, text, email or stop by. However you reach us, you'll talk to a local team in Beaufort."
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-5">
          <OfficeStatusChip
            size="expanded"
            className="!h-auto !min-h-10 self-start !rounded-2xl !py-2"
          />
          <p className="font-semibold text-plum-800">
            <strong>Care:</strong> {hours.careLabel}
          </p>
        </div>
      </PageHero>

      {/* 01 — Contact cards */}
      <section
        id="ways-to-reach-us"
        aria-labelledby="ways-title"
        className="scroll-mt-[calc(var(--header-h)+24px)] bg-white py-[72px] lg:py-28"
      >
        <div className="wrap flex flex-col gap-8 lg:gap-12">
          <SectionHead id="ways-title" eyebrow="01 — Ways to reach us" title="Ways to reach us." />
          <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <li className={`${card} relative hover:border-orchid-500 hover:bg-orchid-100`}>
              <span aria-hidden="true" className={cardIcon}>
                <Phone size={24} strokeWidth={1.75} />
              </span>
              <h3 className="h3 !text-[1.5rem]">Call</h3>
              <a
                href={`tel:${phone.tel}`}
                data-cursor-label="Call"
                className="ff text-[1.75rem] leading-tight text-plum-800 no-underline after:absolute after:inset-0 after:rounded-[20px]"
              >
                {phone.display}
              </a>
              <p>Our main office line. {hours.officeLabel}.</p>
            </li>
            <li className={`${card} relative hover:border-orchid-500 hover:bg-orchid-100`}>
              <span aria-hidden="true" className={cardIcon}>
                <MessageSquare size={24} strokeWidth={1.75} />
              </span>
              <h3 className="h3 !text-[1.5rem]">Text</h3>
              <a
                href={`sms:${text.tel}`}
                className="ff text-[1.75rem] leading-tight text-plum-800 no-underline after:absolute after:inset-0 after:rounded-[20px]"
              >
                {text.display}
              </a>
              <p>Toll-free. You can call this number too.</p>
              <p className="sm muted relative z-[1]">
                {textLineNote} <Link href="/sms-terms">SMS Terms</Link>
              </p>
            </li>
            <li className={`${card} relative hover:border-orchid-500 hover:bg-orchid-100`}>
              <span aria-hidden="true" className={cardIcon}>
                <Mail size={24} strokeWidth={1.75} />
              </span>
              <h3 className="h3 !text-[1.5rem]">Email</h3>
              <a
                href={`mailto:${email}`}
                className="text-[1.125rem] font-semibold [overflow-wrap:anywhere] text-plum-800 no-underline after:absolute after:inset-0 after:rounded-[20px] sm:text-[1.25rem]"
              >
                {email}
              </a>
              <p>We read email during office hours. Please don&apos;t email medical details.</p>
            </li>
            <li className={card}>
              <span aria-hidden="true" className={cardIcon}>
                <Printer size={24} strokeWidth={1.75} />
              </span>
              <h3 className="h3 !text-[1.5rem]">Fax</h3>
              <p className="ff text-[1.75rem] leading-tight text-plum-800">{fax.display}</p>
              <p>For healthcare referrals and paperwork.</p>
              <p>
                <strong className="text-plum-800">Referring a client?</strong>{" "}
                <Link href="/for-professionals#refer">Use our referral form</Link>
              </p>
            </li>
            <li className={`${card} md:col-span-2`}>
              <span aria-hidden="true" className={cardIcon}>
                <MapPin size={24} strokeWidth={1.75} />
              </span>
              <h3 className="h3 !text-[1.5rem]">Visit</h3>
              <address className="text-[1.25rem] font-semibold text-plum-800 not-italic">
                {address.street.value}, {address.suite.value}, {address.city.value},{" "}
                {address.region.value} {address.postalCode.value}
              </address>
              <p>Call ahead so the right person is there to meet you.</p>
              <Directions />
            </li>
          </ul>
        </div>
      </section>

      {/* 02 — Map */}
      <section
        id="map"
        aria-labelledby="map-title"
        className="scroll-mt-[calc(var(--header-h)+24px)] py-[72px] lg:py-28"
      >
        <div className="wrap grid items-start gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
          <div className="flex flex-col gap-4">
            <SectionHead id="map-title" eyebrow="02 — Find us" title="Find our office." />
            <address className="text-plum-800 not-italic">
              <strong>Our office</strong>
              <br />
              {address.oneLine}
            </address>
            <Directions />
            <p className="sm muted">Map is approximate.</p>
            {ph && (
              <p>
                <span className="tbc">
                  [TO CONFIRM: parking, which entrance, Suite 3F floor, step-free access]
                </span>
              </p>
            )}
          </div>
          <OfficeMap />
        </div>
      </section>

      {/* 03 — Hours */}
      <section
        id="hours"
        aria-labelledby="hours-title"
        className="scroll-mt-[calc(var(--header-h)+24px)] bg-white py-[72px] lg:py-28"
      >
        <div className="wrap flex flex-col gap-8 lg:gap-12">
          <SectionHead id="hours-title" eyebrow="03 — Hours" title="Two kinds of hours." />
          <div className="grid gap-4 md:grid-cols-2">
            <div
              className="flex flex-col gap-3 rounded-[20px] bg-plum-950 p-6 text-white lg:p-8"
              data-surface="dark"
            >
              <h3 className="h3 flex items-center gap-3 !text-white">
                <Moon aria-hidden size={26} strokeWidth={1.75} className="text-orchid-100" />
                Care
              </h3>
              <p className="text-[1.375rem] font-semibold text-cream">{hours.careLabel}</p>
              <p className="text-plum-100">
                Our caregivers are there whenever your plan needs them — nights, weekends and
                holidays.
              </p>
            </div>
            <div className="flex flex-col gap-3 rounded-[20px] bg-cream p-6 lg:p-8">
              <h3 className="h3 flex items-center gap-3">
                <Clock aria-hidden size={26} strokeWidth={1.75} className="text-orchid-700" />
                Office
              </h3>
              <p className="text-[1.375rem] font-semibold text-plum-800">
                {hours.officeLabel} (Eastern)
              </p>
              <p>When we answer calls, plan care and set up free visits.</p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <p>
              Calling after hours? Request a callback and we&apos;ll reach you first thing{" "}
              <NextOpen />.
            </p>
            {afterHoursLine.confirmed && afterHoursLine.value ? (
              <p>Already a client? Reach us after hours at {afterHoursLine.value}.</p>
            ) : (
              ph && (
                <p>
                  Already a client? Reach us after hours at{" "}
                  <span className="tbc">[TO CONFIRM: after-hours line for existing clients]</span>.
                </p>
              )
            )}
            <p className="sm muted">If someone is hurt or in danger, call 911.</p>
          </div>
        </div>
      </section>

      {/* 04 — Contact form */}
      <section
        id="message"
        aria-labelledby="message-title"
        className="scroll-mt-[calc(var(--header-h)+24px)] py-[72px] lg:py-28"
      >
        <div className="wrap grid items-start gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
          <SectionHead
            id="message-title"
            eyebrow="04 — Send a message"
            title="Send us a message."
            lead={
              <>
                For a short question. Looking for care? The{" "}
                <Link href="/free-assessment">free assessment form</Link> is the quickest way to
                start.
              </>
            }
            className="lg:sticky lg:top-[calc(var(--header-h)+24px)]"
          />
          <ContactForm />
        </div>
      </section>

      {/* 05 — More */}
      <section id="more" aria-labelledby="more-title" className="bg-white py-14 lg:py-20">
        <div className="wrap flex flex-col gap-6">
          <h2 id="more-title" className="sr-only">
            More ways we can help
          </h2>
          <ul className="grid gap-4 md:grid-cols-3">
            {[
              {
                lead: "Referring a client?",
                label: "Our referral form takes about 2 minutes",
                href: "/for-professionals#refer",
              },
              { lead: "Looking for a caregiver job?", label: "See careers", href: "/careers" },
              {
                lead: "Have a question first?",
                label: "Read questions families ask",
                href: "/faq",
              },
            ].map((l) => (
              <li key={l.href} className="flex flex-col gap-1 border-t-2 border-plum-800 pt-4">
                <strong className="text-plum-800">{l.lead}</strong>
                <Link href={l.href} className="self-start">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <p className="sm">
            <a href={links.instagram.value}>Follow us on Instagram</a>{" "}
            <span className="muted">goes to Instagram</span>
          </p>
        </div>
      </section>

      <DuskCta title={["Let's talk about your", "family", "."]} />
    </>
  );
}
