import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { MessageSquare, Moon, Phone } from "lucide-react";
import { contact, hours } from "@/content/site.config";
import { assessmentHero, assessmentMeta } from "@/content/assessment";
import { PageCrumbs } from "@/components/seo/PageCrumbs";
import { AssessmentForm, ClockLine } from "@/components/forms/AssessmentForm";
import { AssessmentAside } from "@/components/forms/AssessmentAside";
import { NextOpen, WhenClosed } from "@/components/layout/OfficeStatus";
import "@/components/forms/forms.css";

export const metadata: Metadata = pageMetadata("/free-assessment");

const phone = contact.phone.value;
const text = contact.tollFree.value;

/** Free assessment (design 04-free-assessment desktop + mobile, COPY_CONVERSION §3). */
export default function FreeAssessmentPage() {
  const h = assessmentHero;
  return (
    <div className="wrap">
      <PageCrumbs path="/free-assessment" />
      <div className="grid items-start gap-6 pt-4 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-16 lg:pt-6">
        <div className="flex min-w-0 flex-col gap-6">
          <section
            aria-labelledby="fa-title"
            className="flex flex-col items-start gap-3.5 lg:gap-4"
          >
            <p className="eyebrow">{h.eyebrow}</p>
            <h1
              id="fa-title"
              tabIndex={-1}
              className="ff text-[2.875rem] leading-[1.03] text-plum-800 lg:text-[5.25rem] lg:leading-none"
            >
              {h.title[0]} <span className="accent">{h.title[1]}</span>
              {h.title[2]}
            </h1>
            <p className="lead max-w-[700px]">{h.lead}</p>
            <ClockLine>{h.microcopy}</ClockLine>
            <WhenClosed>
              <p className="flex items-start gap-2.5 text-plum-800">
                <Moon aria-hidden size={20} strokeWidth={1.75} className="mt-1 flex-none" />
                <span>
                  Our office is closed right now. Send this and we&apos;ll call you first thing{" "}
                  <NextOpen />.
                </span>
              </p>
            </WhenClosed>
            <p className="flex w-full justify-center gap-2.5 rounded-[14px] bg-plum-100 px-3.5 py-3 text-sm font-semibold text-plum-800 lg:hidden">
              {h.strip.map((s, i) => (
                <span key={s} className="flex gap-2.5">
                  {i > 0 && (
                    <span aria-hidden="true" className="text-orchid-500">
                      ·
                    </span>
                  )}
                  {s}
                </span>
              ))}
            </p>
          </section>
          <AssessmentForm />
        </div>
        <div className="lg:sticky lg:top-[136px]">
          <AssessmentAside />
        </div>
      </div>

      <section
        aria-labelledby="talk-title"
        className="mt-16 flex flex-col gap-6 border-t border-line pt-14 pb-16 lg:mt-24 lg:grid lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-12 lg:pt-[72px] lg:pb-24"
      >
        <div className="flex max-w-[620px] flex-col gap-3">
          <h2 id="talk-title" className="h2 lg:!text-[3rem]">
            Prefer to talk it through?
          </h2>
          <p className="lead">
            Some families would rather just call. That&apos;s fine — we&apos;ll ask the same few
            questions.
          </p>
        </div>
        <div className="flex flex-col gap-[18px] lg:items-end">
          <div className="flex flex-col gap-3 md:flex-row md:flex-wrap">
            <a className="btn btn-ghost" href={`tel:${phone.tel}`} data-cursor-label="Call">
              <Phone aria-hidden size={20} strokeWidth={1.75} className="ring-icon" />
              Call {phone.display}
            </a>
            <a className="btn btn-ghost" href={`sms:${text.tel}`}>
              <MessageSquare aria-hidden size={20} strokeWidth={1.75} />
              Text us {text.display}
            </a>
          </div>
          <div className="flex flex-col gap-0.5">
            <p>
              <strong className="text-plum-800">Care:</strong> {hours.careLabel}
            </p>
            <p>
              <strong className="text-plum-800">Office:</strong> {hours.officeLabel}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
