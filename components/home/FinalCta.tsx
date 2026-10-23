/**
 * 13 — Final CTA (design 01/02-home "14. FINAL CTA (Dusk)", COPY_HOME §14, BUILD_DECISIONS
 * row 32). Stacked buttons kept in the plum half of the Dusk band; on phones the gradient is
 * stretched so the copy sits on plum. The texting line is COPY_LEGAL §1.5.
 */
import Link from "next/link";
import { MessageSquare, Moon, Phone } from "lucide-react";
import { contact, hours } from "@/content/site.config";
import { textLineNote } from "@/content/legal/consent";
import { NextOpen, WhenClosed } from "@/components/layout/OfficeStatus";
import { AssessmentButton } from "@/components/ui/AssessmentButton";

const phone = contact.phone.value;
const text = contact.tollFree.value;

export function FinalCta() {
  return (
    <section
      id="final-cta"
      aria-labelledby="final-title"
      data-surface="dusk"
      data-cursor-theme="dark"
      className="relative overflow-hidden bg-dusk max-lg:bg-[length:100%_220%] max-lg:bg-top lg:min-h-[860px]"
    >
      <svg
        aria-hidden="true"
        focusable="false"
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        className="absolute bottom-6 left-0 h-[60px] w-full lg:bottom-24 lg:h-20"
      >
        <path
          d="M0 40 H1000 L1014 30 L1026 40 H1038 L1058 6 L1080 74 L1098 24 L1110 40 H1440"
          fill="none"
          stroke="var(--color-cream)"
          strokeWidth="1.5"
          strokeLinejoin="round"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <div className="relative wrap pt-[88px] pb-[112px] lg:pt-[120px] lg:pb-[208px]">
        <div className="flex max-w-[560px] flex-col gap-[18px] lg:gap-6">
          <h2 id="final-title" className="dl text-white max-lg:!text-[3rem]">
            Let&apos;s talk about your <span className="accent">family</span>.
          </h2>
          <p className="lead text-cream">One call. One free visit at home. No pressure.</p>
          <WhenClosed>
            <p className="flex max-w-[480px] items-start gap-2.5 text-cream">
              <Moon
                aria-hidden
                size={22}
                strokeWidth={1.75}
                className="mt-1 flex-none text-plum-100"
              />
              <span>
                Our office is closed right now. Request a callback and we&apos;ll reach you first
                thing <NextOpen />.
              </span>
            </p>
          </WhenClosed>
          <div className="flex flex-col items-start gap-[18px] lg:mt-2 lg:gap-4">
            <AssessmentButton href="/free-assessment" className="max-lg:w-full" />
            <a
              className="btn btn-cream max-lg:w-full"
              href={`tel:${phone.tel}`}
              data-cursor-label="Call"
            >
              <Phone aria-hidden size={20} strokeWidth={1.75} className="ring-icon" />
              Call {phone.display}
            </a>
            <div className="flex w-full flex-col items-start gap-2">
              <a className="btn btn-cream max-lg:w-full" href={`sms:${text.tel}`}>
                <MessageSquare aria-hidden size={20} strokeWidth={1.75} />
                Text us {text.display}
              </a>
              <p className="sm max-w-[400px] text-plum-100">
                {textLineNote} <Link href="/sms-terms">SMS Terms</Link>
              </p>
            </div>
          </div>
          <div className="mt-2 flex flex-col gap-1 text-cream lg:mt-4">
            <p>
              <strong>Care:</strong> {hours.careLabel}
            </p>
            <p>
              <strong>Office:</strong> {hours.officeLabel}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
