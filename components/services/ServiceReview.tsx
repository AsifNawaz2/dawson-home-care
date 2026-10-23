/** Review (design 03 "REVIEW"): one real Google review tagged with this service, or nothing. */
import { links } from "@/content/site.config";
import { AVATAR_BG, reviewForService } from "@/content/reviews";
import type { ServiceSlug } from "@/content/navigation";

export function ServiceReview({ slug }: { slug: ServiceSlug }) {
  const r = reviewForService(slug);
  if (!r) return null;
  return (
    <section aria-label="What a family says" className="py-[72px] lg:py-24">
      <div className="wrap">
        <figure className="mx-auto flex max-w-[1040px] flex-col items-center gap-5 text-center lg:gap-[22px]">
          <svg
            aria-hidden="true"
            focusable="false"
            width="64"
            height="54"
            viewBox="0 0 48 40"
            className="fill-orchid-500"
          >
            <path d="M4 38 V24 C4 12 10 5 20 2 L22 7 C15 10 12 15 12 20 H20 V38 Z M28 38 V24 C28 12 34 5 44 2 L46 7 C39 10 36 15 36 20 H44 V38 Z" />
          </svg>
          <Stars rating={r.rating} />
          <blockquote className="q text-[1.25rem] leading-normal text-plum-800 lg:text-[1.625rem]">
            &ldquo;{r.text}&rdquo;
          </blockquote>
          <figcaption className="flex items-center gap-3.5">
            <span
              aria-hidden="true"
              className={`flex size-[52px] items-center justify-center rounded-full text-[1.25rem] font-semibold text-white ${AVATAR_BG[1]}`}
            >
              {r.name.charAt(0)}
            </span>
            <span className="text-left">
              <span className="block font-semibold text-plum-800">{r.name}</span>
              <span className="sm muted">Google review</span>
            </span>
          </figcaption>
          <a className="link sm" href={links.googleMaps.value} data-cursor-label="View">
            Read our Google reviews
          </a>
        </figure>
      </div>
    </section>
  );
}

export function Stars({ rating, size = 26 }: { rating: number; size?: number }) {
  return (
    <p role="img" aria-label={`Rated ${rating} out of 5`} className="flex gap-1.5">
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          aria-hidden="true"
          focusable="false"
          width={size}
          height={size}
          viewBox="0 0 24 24"
          className={i < rating ? "fill-orchid-500" : "fill-line"}
        >
          <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
        </svg>
      ))}
    </p>
  );
}
