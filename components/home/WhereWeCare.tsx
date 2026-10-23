"use client";

/**
 * 10 — Where we care (design 01/02-home "11. WHERE WE CARE", COPY_HOME §11, BUILD_DECISIONS
 * rows 30–31): our own map in the design's frame, the "On Google Maps" card (real rating,
 * "Women-owned", owner's Maps link), town search and every town as a chip — the map's list
 * fallback. Search matches light up on the map.
 */
import Link from "next/link";
import { useState } from "react";
import { Clock, Globe, MapPin, Phone } from "lucide-react";
import { areasByTier } from "@/content/areas";
import { business, contact, links, reputation } from "@/content/site.config";
import { AreaMap, townRowId } from "@/components/features/AreaMap";
import { TownSearch } from "@/components/features/TownSearch";

const phone = contact.phone.value;
const rating = reputation.google.value;
const towns = [...areasByTier("primary"), ...areasByTier("extended")];

function GoogleCard() {
  return (
    <div className="flex flex-col gap-3.5 rounded-[20px] border border-line bg-white p-[22px] lg:gap-4 lg:p-8">
      <p className="eyebrow">On Google Maps</p>
      <h3 className="h3">Dawson and Dawson Home Care</h3>
      <p className="flex flex-wrap items-center gap-2 font-semibold text-plum-800 lg:gap-2.5">
        <span className="ff text-[1.875rem] leading-none lg:text-[2rem]" aria-hidden="true">
          {rating.rating}
        </span>
        <span aria-hidden="true" className="inline-flex gap-0.5">
          {Array.from({ length: 5 }, (_, i) => (
            <svg key={i} viewBox="0 0 24 24" className="size-[18px] fill-orchid-500 lg:size-5">
              <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
            </svg>
          ))}
        </span>
        <span className="sr-only">Rated {rating.rating} out of 5</span>
        <span className="muted font-medium">{rating.count} Google reviews</span>
      </p>
      <ul className="flex list-none flex-col gap-2.5 p-0 text-base">
        <li className="flex gap-2.5">
          <MapPin
            aria-hidden
            size={20}
            strokeWidth={1.75}
            className="mt-[3px] flex-none text-orchid-700"
          />
          69 Robert Smalls Pkwy #3F, Beaufort, SC 29906
        </li>
        <li className="flex gap-2.5">
          <Phone
            aria-hidden
            size={20}
            strokeWidth={1.75}
            className="mt-[3px] flex-none text-orchid-700"
          />
          <a href={`tel:${phone.tel}`} data-cursor-label="Call" className="font-semibold">
            {phone.display}
          </a>
        </li>
        <li className="flex gap-2.5">
          <Globe
            aria-hidden
            size={20}
            strokeWidth={1.75}
            className="mt-[3px] flex-none text-orchid-700"
          />
          <Link href="/" className="font-semibold">
            dawsonhomecare.com
          </Link>
        </li>
        <li className="flex gap-2.5">
          <Clock
            aria-hidden
            size={20}
            strokeWidth={1.75}
            className="mt-[3px] flex-none text-orchid-700"
          />
          <span>
            <strong className="text-plum-800">Office:</strong> Monday–Friday, 8 AM–5 PM ·{" "}
            <strong className="text-plum-800">Care:</strong> 24/7
          </span>
        </li>
      </ul>
      {business.womenOwned.confirmed && (
        <p className="inline-flex min-h-8 items-center self-start rounded-full bg-orchid-100 px-3.5 font-semibold text-orchid-700">
          Women-owned
        </p>
      )}
      <div className="flex flex-col items-center gap-3 lg:flex-row lg:flex-wrap">
        <a
          className="btn btn-secondary max-lg:w-full"
          href={links.googleMaps.value}
          data-cursor-label="Open"
        >
          Get directions
        </a>
        <span className="sm muted">goes to Google Maps</span>
      </div>
    </div>
  );
}

export function WhereWeCare() {
  const [hits, setHits] = useState<string[]>([]);
  return (
    <section id="where-we-care" aria-labelledby="where-title" className="py-[88px] lg:py-32">
      <div className="wrap">
        <div className="flex max-w-[880px] flex-col gap-3 lg:gap-4">
          <p className="eyebrow">10 — Where we care</p>
          <h2 id="where-title" className="h2">
            Rooted in Beaufort. Caring across the Lowcountry.
          </h2>
          <p className="lead">
            Our office is in Beaufort, and we care for families in towns nearby.
          </p>
        </div>
        <div className="mt-6 grid items-start gap-5 lg:mt-14 lg:grid-cols-[minmax(0,720px)_minmax(0,1fr)] lg:gap-16">
          <figure className="flex flex-col gap-2 lg:gap-2.5">
            <AreaMap highlight={hits} />
            <figcaption className="sm muted">
              Our office: 69 Robert Smalls Pkwy #3F, Beaufort · Rings show straight-line miles. Town
              spots are approximate.
            </figcaption>
          </figure>
          <div className="flex flex-col gap-5 lg:gap-10">
            <GoogleCard />
            <TownSearch onMatch={setHits} />
            <div className="flex flex-col gap-3 lg:gap-4">
              <h3 className="h3 lg:!text-[1.625rem]">Towns we serve</h3>
              <ul className="flex list-none flex-wrap gap-2.5 p-0 lg:gap-3">
                {towns.map((t) => (
                  <li key={t.slug}>
                    <Link
                      id={townRowId(t.slug)}
                      href={
                        t.hasPage
                          ? `/areas-we-serve/${t.slug}`
                          : `/areas-we-serve#${townRowId(t.slug)}`
                      }
                      data-cursor-label="View"
                      data-match={hits.includes(t.slug) || undefined}
                      className="inline-flex min-h-12 items-center rounded-full border-[1.5px] border-muted bg-white px-[18px] font-semibold text-plum-800 no-underline transition-colors hover:border-orchid-500 hover:bg-orchid-100 data-match:border-2 data-match:border-plum-800 data-match:bg-orchid-100 lg:px-5"
                    >
                      {t.name}
                    </Link>
                  </li>
                ))}
              </ul>
              <Link className="btn btn-ghost mt-2 self-start max-lg:w-full" href="/areas-we-serve">
                See all areas we serve
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
