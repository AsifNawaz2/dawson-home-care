/**
 * 06 — Meet the owner (design 01/02-home "7. MEET THE OWNER", COPY_HOME §7).
 * Portrait, video, quote and signature are placeholders until the owner sends them. The video
 * slot shows the design's "Video coming soon" card (interaction-states sheet, BUILD_DECISIONS
 * row 24) — never a play button with nothing behind it. The transcript toggle appears with the
 * real video. Desktop: portrait + video on the left, words on the right; phones follow the
 * design's single column (words, portrait, quote, video).
 */
import Image from "next/image";
import Link from "next/link";
import { Clock } from "lucide-react";
import { flags, owner } from "@/content/site.config";
import { Tbc } from "@/components/ui/Tbc";

const QUOTE_MARK = (
  <svg
    aria-hidden="true"
    focusable="false"
    viewBox="0 0 48 40"
    className="h-[34px] w-10 lg:h-10 lg:w-12"
  >
    <path
      d="M4 38 V24 C4 12 10 5 20 2 L22 7 C15 10 12 15 12 20 H20 V38 Z M28 38 V24 C28 12 34 5 44 2 L46 7 C39 10 36 15 36 20 H44 V38 Z"
      fill="var(--color-orchid-500)"
    />
  </svg>
);

/** "Monique" is confirmed (answer 1); the last name isn't. */
const ownerName = owner.firstName.value;

export function MeetOwner() {
  const ph = flags.showPlaceholders;
  return (
    <section aria-labelledby="owner-title" className="py-[88px] lg:py-32">
      <div className="wrap flex flex-col lg:grid lg:grid-cols-[520px_minmax(0,1fr)] lg:items-start lg:gap-24">
        {/* Left on desktop: portrait + video. On phones these slot between the words. */}
        <div className="contents lg:flex lg:flex-col lg:gap-12">
          <figure className="order-2 mt-7 lg:mt-0">
            <div
              role="img"
              aria-label={`${ownerName}, owner of Dawson and Dawson Home Care, at the Beaufort office.`}
              className="flex aspect-[4/5] w-full items-center justify-center overflow-hidden rounded-[20px] bg-plum-100 max-lg:aspect-auto max-lg:h-[438px]"
            >
              <Image
                src="/images/logo.png"
                alt=""
                width={600}
                height={600}
                className="block h-auto w-[220px] lg:w-[300px]"
              />
            </div>
            {ph && (
              <figcaption className="sm muted mt-2.5 lg:mt-3">Owner portrait · 4:5</figcaption>
            )}
          </figure>
          <div className="order-5 mt-7 flex flex-col gap-2.5 lg:mt-0 lg:gap-3">
            <div className="flex items-center gap-5 rounded-[20px] bg-orchid-100 p-6 lg:gap-6 lg:p-10">
              <span
                aria-hidden="true"
                className="grid size-16 flex-none place-items-center rounded-full bg-white text-orchid-700"
              >
                <Clock size={28} strokeWidth={1.75} />
              </span>
              <div>
                <p className="font-bold text-plum-800">Video coming soon</p>
                <p className="sm">A short hello from our owner is on its way.</p>
              </div>
            </div>
            {ph && <p className="sm muted">Owner video · 16:9</p>}
          </div>
        </div>

        {/* Right on desktop: the words. */}
        <div className="contents lg:flex lg:flex-col lg:gap-6 lg:pt-6">
          <div className="order-1 flex flex-col gap-3 lg:contents">
            <p className="eyebrow">06 — Meet the owner</p>
            <h2 id="owner-title" className="dl text-plum-800">
              The person at your kitchen table runs the company.
            </h2>
            <p className="lead mt-1 lg:mt-0">
              At Dawson, the owner meets every family personally — and keeps working with you to
              make sure care is done right.
            </p>
          </div>
          {ph && (
            <p className="order-3 mt-6 max-w-[60ch] lg:mt-0">
              <Tbc tbc={{ chip: "[Owner first and last name]" }} /> leads Dawson and Dawson Home
              Care.{" "}
              <Tbc tbc={{ chip: "[One sentence on their background in health and home care]" }} />.{" "}
              <Tbc tbc={{ chip: "[One sentence on why they started or run the company]" }} />.
            </p>
          )}
          {ph && (
            <blockquote className="order-4 mt-7 flex flex-col gap-4 border-t border-line pt-6 lg:mt-6 lg:gap-6 lg:pt-8">
              {QUOTE_MARK}
              <p className="q text-[1.375rem] leading-[1.4] text-plum-800 lg:text-[1.75rem]">
                &ldquo;
                <Tbc tbc={{ chip: "[Owner quote — one sentence about why they do this work]" }} />
                &rdquo;
              </p>
              <footer className="flex flex-col gap-1.5 lg:gap-2">
                <div
                  aria-hidden="true"
                  className="flex h-16 w-[220px] items-end rounded-xl bg-orchid-100 px-[18px] pb-4 lg:h-[72px] lg:w-60 lg:px-5 lg:pb-[18px]"
                >
                  <span className="block h-0.5 w-full bg-plum-800" />
                </div>
                <p className="sm muted">Owner signature · SVG</p>
                <p className="font-semibold text-plum-800">{ownerName}, Owner</p>
              </footer>
            </blockquote>
          )}
          <Link
            className="btn btn-ghost order-6 mt-5 self-start max-lg:w-full lg:mt-4"
            href="/about"
          >
            Read our story
          </Link>
        </div>
      </div>
    </section>
  );
}
