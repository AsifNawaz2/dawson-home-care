"use client";

/**
 * 08 — What families say (design 01/02-home "9. WHAT FAMILIES SAY", COPY_HOME §9,
 * BUILD_DECISIONS rows 26–28).
 *
 * Full motion: one row, 90 s per loop; the set is drawn twice for a seamless loop (the copy is
 * aria-hidden and inert). Pauses on hover, on keyboard focus and with "Pause reviews"
 * (WCAG 2.2.2). Reduced motion: nothing moves — one row you can scroll sideways (keyboard
 * focusable).
 * Data: content/reviews.ts. Placeholder items (`placeholder: true`) only show while placeholders
 * are on; with fewer than 3 real reviews the chapter hides (COPY_HOME launch rule).
 */
import Link from "next/link";
import { useState } from "react";
import { Pause, Play } from "lucide-react";
import { AVATAR_BG, realReviews, reviews, type Review } from "@/content/reviews";
import { flags, links, reputation } from "@/content/site.config";
import { useMotionMode } from "@/lib/motionMode";
import { cn } from "@/lib/cn";
import { Stars } from "@/components/services/ServiceReview";

const list = reviews.filter((r) => !r.placeholder || flags.showPlaceholders);
const rating = reputation.google.value;

function Card({ r, i }: { r: Review; i: number }) {
  return (
    <figure className="mr-4 flex w-[300px] flex-none flex-col gap-3 rounded-[20px] border border-line bg-white p-[22px] lg:mr-8 lg:w-[420px] lg:gap-4 lg:px-8 lg:py-7">
      <div className="flex items-center gap-3 lg:gap-3.5">
        <span
          aria-hidden="true"
          className={cn(
            "flex size-11 flex-none items-center justify-center rounded-full text-[1.125rem] font-semibold text-white lg:size-12 lg:text-[1.25rem]",
            AVATAR_BG[i % AVATAR_BG.length],
          )}
        >
          {r.name.charAt(0)}
        </span>
        <figcaption>
          <p className="leading-[1.3] font-semibold text-plum-800">
            {r.name}
            {r.placeholder && <span className="tbc ml-2">[Sample]</span>}
          </p>
          <p className="sm muted">{r.source === "Google" ? "Google review" : "Review"}</p>
        </figcaption>
      </div>
      <Stars rating={r.rating} size={20} />
      <blockquote className="text-ink lg:leading-[1.6]">&ldquo;{r.text}&rdquo;</blockquote>
    </figure>
  );
}

export function Reviews() {
  const live = useMotionMode() === "full";
  const [paused, setPaused] = useState(false);
  if (realReviews().length < 3 && !flags.showPlaceholders) return null;

  const pause = (
    <button
      type="button"
      className="btn btn-ghost max-lg:w-full"
      aria-pressed={paused}
      onClick={() => setPaused((p) => !p)}
    >
      {paused ? (
        <Play aria-hidden size={18} fill="currentColor" strokeWidth={0} />
      ) : (
        <Pause aria-hidden size={18} fill="currentColor" strokeWidth={0} />
      )}
      {paused ? "Play reviews" : "Pause reviews"}
    </button>
  );

  return (
    <section id="reviews" aria-labelledby="reviews-title" className="py-[88px] lg:py-32">
      <div className="wrap grid items-end gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-16">
        <div className="flex flex-col items-start gap-3 lg:gap-4">
          <p className="eyebrow">08 — What families say</p>
          <h2 id="reviews-title" className="h2">
            In their words.
          </h2>
          <p className="lead">Reviews from families in Beaufort and across the Lowcountry.</p>
        </div>
        <div className="flex flex-col items-start gap-4 lg:items-end">
          {reputation.google.confirmed && (
            <a
              href={links.googleMaps.value}
              data-cursor-label="View"
              className="inline-flex min-h-12 items-center gap-2 rounded-full border border-line bg-white px-4 font-semibold text-plum-800 no-underline lg:gap-2.5 lg:px-5"
            >
              <span aria-hidden="true" className="inline-flex gap-0.5">
                {Array.from({ length: 5 }, (_, i) => (
                  <svg key={i} viewBox="0 0 24 24" className="size-4 fill-orchid-500 lg:size-5">
                    <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
                  </svg>
                ))}
              </span>
              <span>
                {rating.rating} on Google · {rating.count} reviews
              </span>
            </a>
          )}
          {live && <div className="hidden lg:block">{pause}</div>}
        </div>
      </div>

      {live ? (
        <div className="marquee mt-7 lg:mt-14" data-paused={paused}>
          <div className="marquee-track">
            {list.map((r, i) => (
              <Card key={r.id} r={r} i={i} />
            ))}
            <div aria-hidden="true" inert className="flex">
              {list.map((r, i) => (
                <Card key={r.id} r={r} i={i} />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div
          role="region"
          aria-label="Reviews"
          tabIndex={0}
          className="mt-7 overflow-x-auto px-[var(--gutter)] pb-2 lg:mt-14"
        >
          <div className="flex w-max">
            {list.map((r, i) => (
              <Card key={r.id} r={r} i={i} />
            ))}
          </div>
        </div>
      )}

      <div className="wrap mt-6 flex flex-col gap-3 lg:mt-14 lg:items-center">
        {live && <div className="lg:hidden">{pause}</div>}
        <Link className="btn btn-ghost max-lg:w-full" href="/reviews">
          Read all reviews
        </Link>
      </div>
    </section>
  );
}
