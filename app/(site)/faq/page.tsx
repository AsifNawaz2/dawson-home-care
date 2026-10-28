import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { faqPageForFaq } from "@/lib/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import Link from "next/link";
import { Mail, MessageSquare, Moon, Phone } from "lucide-react";
import { contact, hours } from "@/content/site.config";
import { PageCrumbs } from "@/components/seo/PageCrumbs";
import { AssessmentButton } from "@/components/ui/AssessmentButton";
import { DuskCta } from "@/components/ui/DuskCta";
import { NextOpen, WhenClosed } from "@/components/layout/OfficeStatus";
import { FaqSearch } from "@/components/features/FaqSearch";

export const metadata: Metadata = pageMetadata("/faq");

const phone = contact.phone.value;
const text = contact.tollFree.value;
const email = contact.email.value;

/** FAQ (COPY_COST_FAQ "FAQ — /faq"; data: content/faq.ts). */
export default function FaqPage() {
  return (
    <>
      <div className="wrap">
        <PageCrumbs path="/faq" />
        <section
          aria-labelledby="faq-h1"
          className="flex max-w-[900px] flex-col items-start gap-3.5 pt-6 pb-10 lg:gap-4 lg:pt-10 lg:pb-14"
        >
          <p className="eyebrow">Questions &amp; answers</p>
          <h1 id="faq-h1" className="h1-page">
            Your questions, <span className="accent">answered</span>.
          </h1>
          <p className="lead max-w-[720px]">
            Plain answers about home care, cost and how we work. Can&apos;t find yours? Call{" "}
            <a href={`tel:${phone.tel}`} data-cursor-label="Call">
              {phone.display}
            </a>{" "}
            — we&apos;re happy to help.
          </p>
          <div className="mt-2 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:gap-4">
            <AssessmentButton href="/free-assessment" className="max-sm:w-full" />
            <a
              className="btn btn-secondary max-sm:w-full"
              href={`tel:${phone.tel}`}
              data-cursor-label="Call"
            >
              <Phone aria-hidden size={20} strokeWidth={1.75} />
              Call {phone.display}
            </a>
          </div>
        </section>
      </div>

      <div className="wrap pb-20 lg:pb-section">
        <FaqSearch />
      </div>

      <section aria-labelledby="still-title" className="bg-white py-[72px] lg:py-section-sm">
        <div className="wrap grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-12">
          <div className="flex flex-col gap-4">
            <h2 id="still-title" className="h2">
              Still have a question?
            </h2>
            <p className="lead">
              Call {phone.display}, text {text.display} or email {email}.
            </p>
            <div className="flex flex-col gap-1">
              <p>
                <strong className="text-plum-800">Care:</strong> {hours.careLabel}
              </p>
              <p>
                <strong className="text-plum-800">Office:</strong> {hours.officeLabel}
              </p>
            </div>
            <WhenClosed>
              <p className="flex items-start gap-2.5 text-plum-800">
                <Moon aria-hidden size={20} strokeWidth={1.75} className="mt-1 flex-none" />
                <span>
                  Our office is closed right now. Request a callback and we&apos;ll reach you first
                  thing <NextOpen />.
                </span>
              </p>
            </WhenClosed>
          </div>
          <div className="flex flex-col items-start gap-3">
            <a
              className="btn btn-secondary max-sm:w-full"
              href={`tel:${phone.tel}`}
              data-cursor-label="Call"
            >
              <Phone aria-hidden size={20} strokeWidth={1.75} />
              Call {phone.display}
            </a>
            <a className="btn btn-ghost max-sm:w-full" href={`sms:${text.tel}`}>
              <MessageSquare aria-hidden size={20} strokeWidth={1.75} />
              Text {text.display}
            </a>
            <a className="btn btn-ghost max-sm:w-full" href={`mailto:${email}`}>
              <Mail aria-hidden size={20} strokeWidth={1.75} />
              Email us
            </a>
            <Link className="link mt-2" href="/paying-for-care#questions-to-ask">
              Comparing agencies? Questions to ask any agency
            </Link>
          </div>
        </div>
      </section>

      <DuskCta title={["Ask us", "anything", "."]} />
      <JsonLd data={[faqPageForFaq()]} />
    </>
  );
}
