"use client";

/**
 * Reassurance panel (COPY_CONVERSION §3.3, design 04 "What happens next"): sticky beside the form
 * on desktop; after the form on phones (a compact strip sits above the form there).
 */
import Link from "next/link";
import { Phone } from "lucide-react";
import { contact, flags, hours, owner } from "@/content/site.config";
import { NextOpen, OfficeStatusChip, useOfficeStatus } from "@/components/layout/OfficeStatus";
import { Logo } from "@/components/brand/Logo";

const phone = contact.phone.value;
const text = contact.tollFree.value;

export function AssessmentAside() {
  const { isClosed } = useOfficeStatus();
  const ownerName = owner.firstName.confirmed ? owner.firstName.value : null;
  return (
    <aside aria-labelledby="next-title" className="fa-aside">
      <h2
        id="next-title"
        className="ff text-[1.875rem] leading-[1.1] text-plum-800 lg:text-[2.125rem]"
      >
        What happens next
      </h2>
      <ol className="relative flex flex-col gap-[18px]">
        <span
          aria-hidden="true"
          className="absolute top-5 bottom-6 left-[17px] w-0.5 bg-orchid-500/45"
        />
        <li className="nx">
          <span className="nxn" aria-hidden="true">
            1
          </span>
          <div>
            <p className="font-bold text-plum-800">We call you.</p>
            {isClosed ? (
              <p className="sm">
                First thing <NextOpen />.
              </p>
            ) : (
              <p className="sm">
                As soon as we can.
                {flags.showPlaceholders && (
                  <>
                    {" "}
                    Within <span className="tbc">[Response time during office hours]</span>.
                  </>
                )}
              </p>
            )}
          </div>
        </li>
        <li className="nx">
          <span className="nxn" aria-hidden="true">
            2
          </span>
          <div>
            <p className="font-bold text-plum-800">Our owner visits — free.</p>
            <p className="sm">
              At your loved one&apos;s home. We talk about their days and the help they need.
            </p>
          </div>
        </li>
        <li className="nx">
          <span className="nxn" aria-hidden="true">
            3
          </span>
          <div>
            <p className="font-bold text-plum-800">You decide.</p>
            <p className="sm">No obligation, and no pressure to decide that day.</p>
          </div>
        </li>
      </ol>

      <figure className="flex items-center gap-4 rounded-[20px] bg-white p-4">
        {/* Owner portrait pending (owner-portrait.jpg) — the logo holds the 1:1 slot until then. */}
        <div
          aria-hidden="true"
          className="flex size-24 flex-none items-center justify-center rounded-2xl bg-plum-100"
        >
          <Logo variant="mark" uid="fa-owner" className="h-auto w-[70px]" />
        </div>
        <figcaption className="flex flex-col gap-0.5">
          <p className="sm">
            <strong className="text-plum-800">
              {ownerName ? `${ownerName}, Owner` : "Our owner"}
            </strong>{" "}
            — the person who&apos;ll visit.
          </p>
          {flags.showPlaceholders && (
            <p className="sm muted">
              <span className="tbc">[Owner portrait · 1:1]</span>
            </p>
          )}
        </figcaption>
      </figure>

      <div className="flex flex-col gap-1.5">
        <OfficeStatusChip
          size="expanded"
          className="!h-auto !min-h-10 self-start !rounded-2xl !py-2"
        />
        <p className="sm">
          <strong className="text-plum-800">Care:</strong> {hours.careLabel}
        </p>
        {isClosed && flags.showPlaceholders && (
          <p className="sm muted">
            Already a client? Reach us after hours at{" "}
            <span className="tbc">[After-hours line for existing clients]</span>.
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2.5 border-t border-line pt-5">
        <h3 className="h3 !text-[1.375rem]">Rather talk?</h3>
        {isClosed ? (
          <p className="sm">
            Our office opens <NextOpen />. Text us at {text.display}, or send this form and
            we&apos;ll call you first thing.
            {flags.showPlaceholders && (
              <>
                {" "}
                <span className="tbc">[Is there voicemail on the main line after hours?]</span>
              </>
            )}
          </p>
        ) : (
          <a
            className="btn btn-secondary self-start"
            href={`tel:${phone.tel}`}
            data-cursor-label="Call"
          >
            <Phone aria-hidden size={20} strokeWidth={1.75} className="ring-icon" />
            Call {phone.display}
          </a>
        )}
      </div>

      <div className="flex flex-col gap-1.5 border-t border-line pt-5">
        <h3 className="h3 !text-[1.25rem]">Your information</h3>
        <p className="sm">
          We ask only what we need to call you back. Please don&apos;t send medical details online.
        </p>
        <Link className="link sm !min-h-10" href="/privacy-policy">
          Privacy Policy
        </Link>
      </div>
      <Link className="link sm -mt-2" href="/how-it-works#free-assessment" data-cursor-label="Open">
        What happens at the free visit
      </Link>
    </aside>
  );
}
