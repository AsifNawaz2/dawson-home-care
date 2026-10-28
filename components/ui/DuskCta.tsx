/**
 * Dusk CTA band (design 03-personal-care "CTA BAND", COPY_SERVICES CTA band): accent headline,
 * after-hours line, three buttons and both hours lines, always labelled.
 */
import { MessageSquare, Moon, Phone } from "lucide-react";
import { contact, hours } from "@/content/site.config";
import { NextOpen, WhenClosed } from "@/components/layout/OfficeStatus";
import { AssessmentButton } from "./AssessmentButton";

const phone = contact.phone.value;
const text = contact.tollFree.value;

export function DuskCta({
  title,
  lead = "One call. One free visit at home. No pressure.",
  href = "/free-assessment",
  id = "cta-title",
  actions,
  afterHours = true,
}: {
  title: [string, string, string];
  lead?: string;
  href?: string;
  id?: string;
  /** Replaces the standard three buttons (e.g. Careers: Apply on Hireology + Call). */
  actions?: React.ReactNode;
  /** The after-hours line (family CTAs only). */
  afterHours?: boolean;
}) {
  return (
    <section
      aria-labelledby={id}
      data-surface="dusk"
      data-cursor-theme="dark"
      className="relative overflow-hidden bg-dusk"
    >
      <svg
        aria-hidden="true"
        focusable="false"
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        className="absolute bottom-20 left-0 h-20 w-full"
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
      <div className="relative wrap pt-[88px] pb-[152px] lg:pt-section-sm">
        <div className="flex max-w-[780px] flex-col gap-6">
          <h2 id={id} className="dl max-w-[600px] text-white">
            {title[0]}
            {title[1] && (
              <>
                {" "}
                <span className="accent">{title[1]}</span>
              </>
            )}
            {title[2] && !/^[.,!?]/.test(title[2]) ? " " : ""}
            {title[2]}
          </h2>
          <p className="lead text-cream">{lead}</p>
          {afterHours && (
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
          )}
          <div className="mt-2 flex flex-col gap-3 md:flex-row md:flex-wrap md:gap-4">
            {actions ?? (
              <>
                <AssessmentButton href={href} className="max-md:w-full" />
                <a
                  className="btn btn-cream max-md:w-full"
                  href={`tel:${phone.tel}`}
                  data-cursor-label="Call"
                >
                  <Phone aria-hidden size={20} strokeWidth={1.75} className="ring-icon" />
                  Call {phone.display}
                </a>
                <a className="btn btn-cream max-md:w-full" href={`sms:${text.tel}`}>
                  <MessageSquare aria-hidden size={20} strokeWidth={1.75} />
                  Text us {text.display}
                </a>
              </>
            )}
          </div>
          <div className="mt-3 flex flex-col gap-1 text-cream">
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
