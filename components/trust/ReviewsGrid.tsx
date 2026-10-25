"use client";

/**
 * /reviews grid (COPY_TRUST "02 — Review grid"): single-select service chips (aria-pressed; chips
 * with no reviews aren't shown; reviews without a service only under All), ?service= preselects,
 * a polite count announcement, long reviews clamp at 600 characters, 12 at a time.
 * Data: content/reviews.ts. Placeholder items only while placeholders are on.
 */
import { useEffect, useId, useState } from "react";
import { services, type ServiceSlug } from "@/content/navigation";
import { AVATAR_BG, reviews, type Review } from "@/content/reviews";
import { flags } from "@/content/site.config";
import { cn } from "@/lib/cn";
import { Stars } from "@/components/services/ServiceReview";

const list = reviews.filter((r) => !r.placeholder || flags.showPlaceholders);
const PAGE = 12;
const CLAMP = 600;

const nameOf = (slug: ServiceSlug) => services.find((s) => s.slug === slug)?.name ?? slug;
const monthYear = (iso: string) =>
  new Date(`${iso}T12:00:00`).toLocaleDateString("en-US", { month: "long", year: "numeric" });

function Card({ r, i }: { r: Review; i: number }) {
  const [full, setFull] = useState(false);
  const uid = useId();
  const long = r.text.length > CLAMP;
  const text = long && !full ? `${r.text.slice(0, CLAMP).replace(/\s+\S*$/, "")}…` : r.text;
  return (
    <figure className="relative flex h-full flex-col gap-4 rounded-[20px] border border-line bg-white p-6 lg:p-7">
      {r.placeholder && <span className="chip absolute top-4 right-4">Sample</span>}
      <div className="flex items-center gap-3.5">
        <span
          aria-hidden="true"
          className={cn(
            "flex size-12 flex-none items-center justify-center rounded-full text-[1.25rem] font-semibold text-white",
            AVATAR_BG[i % AVATAR_BG.length],
          )}
        >
          {r.name.charAt(0)}
        </span>
        <figcaption>
          <p className="font-semibold text-plum-800">
            — {r.placeholder ? "Sample Review" : r.name}
            {!r.placeholder && r.relation ? `, ${r.relation}` : ""}
            {!r.placeholder && r.town ? ` · ${r.town}` : ""}
          </p>
          <p className="sm muted">
            {r.date ? `${monthYear(r.date)} · ` : ""}
            {r.source ? <>From {r.url ? <a href={r.url}>{r.source}</a> : r.source}</> : null}
          </p>
        </figcaption>
      </div>
      <Stars rating={r.rating} size={20} />
      <blockquote id={`${uid}-q`} className="text-ink">
        &ldquo;{text}&rdquo;
      </blockquote>
      {long && (
        <button
          type="button"
          className="link sm self-start"
          aria-expanded={full}
          aria-controls={`${uid}-q`}
          onClick={() => setFull((f) => !f)}
        >
          {full ? "Show less" : "Read the full review"}
        </button>
      )}
      {r.service && (
        <span className="chip mt-auto self-start bg-orchid-100">{nameOf(r.service)}</span>
      )}
    </figure>
  );
}

export function ReviewsGrid() {
  const uid = useId();
  const [service, setService] = useState<ServiceSlug | "all">("all");
  const [shown, setShown] = useState(PAGE);
  const [announce, setAnnounce] = useState("");

  useEffect(() => {
    const s = new URLSearchParams(window.location.search).get("service") as ServiceSlug | null;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- ?service= preselects once
    if (s && list.some((r) => r.service === s)) setService(s);
  }, []);

  const counts = services
    .map((s) => ({
      slug: s.slug,
      name: s.name,
      n: list.filter((r) => r.service === s.slug).length,
    }))
    .filter((c) => c.n > 0);
  const filtered = service === "all" ? list : list.filter((r) => r.service === service);

  const pick = (s: ServiceSlug | "all") => {
    setService(s);
    setShown(PAGE);
    const n = s === "all" ? list.length : list.filter((r) => r.service === s).length;
    setAnnounce(
      s === "all" ? `Showing all ${n} reviews.` : `Showing ${n} reviews about ${nameOf(s)}.`,
    );
  };

  const chip = (active: boolean) =>
    cn(
      "inline-flex min-h-12 items-center rounded-full border-[1.5px] px-5 font-semibold transition-colors",
      active
        ? "border-2 border-plum-800 bg-plum-100 text-plum-800"
        : "border-muted bg-white text-plum-800 hover:border-orchid-500 hover:bg-orchid-100",
    );

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <p id={`${uid}-label`} className="font-semibold text-plum-800">
          Show reviews about:
        </p>
        <div role="group" aria-labelledby={`${uid}-label`} className="flex flex-wrap gap-2.5">
          <button
            type="button"
            aria-pressed={service === "all"}
            className={chip(service === "all")}
            onClick={() => pick("all")}
          >
            All ({list.length})
          </button>
          {counts.map((c) => (
            <button
              key={c.slug}
              type="button"
              aria-pressed={service === c.slug}
              className={chip(service === c.slug)}
              onClick={() => pick(c.slug)}
            >
              {c.name} ({c.n})
            </button>
          ))}
        </div>
        <p className="sr-only" aria-live="polite">
          {announce}
        </p>
      </div>
      <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {filtered.slice(0, shown).map((r) => (
          <li key={r.id}>
            <Card r={r} i={list.indexOf(r)} />
          </li>
        ))}
      </ul>
      {filtered.length > shown && (
        <button
          type="button"
          className="btn btn-ghost self-center"
          onClick={() => {
            const more = Math.min(PAGE, filtered.length - shown);
            setShown(shown + PAGE);
            setAnnounce(`${more} more reviews shown.`);
          }}
        >
          Show more reviews
        </button>
      )}
    </div>
  );
}
