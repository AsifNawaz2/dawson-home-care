"use client";

/**
 * Service-area map (SPEC_FEATURES §6, COPY_HOME ch. 11, COPY_AREAS 2.2).
 *
 * Schematic for now: every town from content/areas.ts placed with the spec's projection
 * (lib/projection.ts), the office pin, and straight-line distance rings — no coastline. The
 * detailed Census coastline couldn't be fetched from the build container, and the generalised
 * shapes put Hilton Head inland, so they aren't drawn (see BUILD_DECISIONS). No tiles, no API,
 * no external requests.
 *
 * Markers are real links laid over the SVG (crisp, standard focus rings). Hover/focus shows the
 * town card; Escape hides it (WCAG 1.4.13). Town without a page → focus moves to its row in the
 * list below. Under 768px the map is a picture: markers aren't focusable, search + list are the
 * interactive layer. The office pin ripples 3 times when the map comes into view, then stops.
 */
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { areas, areasByTier, OFFICE, formatDrive, type Area } from "@/content/areas";
import { flags } from "@/content/site.config";
import { project } from "@/lib/projection";
import { lowcountry } from "@/content/map/lowcountry";
import { isReducedMotion } from "@/lib/motionMode";
import { cn } from "@/lib/cn";

/** Labels that always show (SPEC §6.3 — content/map/labels.ts in the spec). */
/** Labels drawn left of their dot (SPEC §6.3 label anchors), so neighbours don't collide. */
const LABEL_LEFT = new Set(["bluffton", "ridgeland"]);
const ALWAYS = new Set([
  "beaufort",
  "st-helena-island",
  "bluffton",
  "hilton-head-island",
  "ridgeland",
  "yemassee",
]);
/** Tab order = list order: primary by drive time, then extended. */
const ORDERED = [...areasByTier("primary"), ...areasByTier("extended")];

/** Rounded so the server and the browser print identical numbers (no hydration mismatch). */
const r1 = (n: number) => Math.round(n * 10) / 10;
/** 1 mile in projected units (the projection keeps x and y to the same scale). */
const MILE = 1184 / 0.64 / 69;
const RINGS = [10, 20, 30];
const [ox, oy] = project(OFFICE.coords.lng, OFFICE.coords.lat).map(r1) as [number, number];

// Crop around the towns, padded: the design frame's 720 × 520 on wider screens, taller on phones.
const pts = [...areas.map((a) => project(a.coords.lng, a.coords.lat)), [ox, oy]];
const xs = pts.map((p) => p[0]!);
const ys = pts.map((p) => p[1]!);
const cx = (Math.min(...xs) + Math.max(...xs)) / 2;
const cy = (Math.min(...ys) + Math.max(...ys)) / 2;

function frame(ratio: number, padX = 1.3, padY = 1.22) {
  const W = Math.max(
    (Math.max(...xs) - Math.min(...xs)) * padX,
    (Math.max(...ys) - Math.min(...ys)) * padY * ratio,
  );
  const H = W / ratio;
  const VB = { x: r1(cx - W / 2), y: r1(cy - H / 2), w: r1(W), h: r1(H) };
  const pos = (lng: number, lat: number) => {
    const [x, y] = project(lng, lat);
    return { left: r1(((x - VB.x) / VB.w) * 1000) / 10, top: r1(((y - VB.y) / VB.h) * 1000) / 10 };
  };
  /** Each ring's label sits at the first angle where the ring is inside the frame. */
  const ringLabel = (mi: number) => {
    const r = mi * MILE;
    const m = VB.w * 0.04;
    for (const deg of [-55, -125, 215, -15, 195, 150, 35]) {
      const a = (deg * Math.PI) / 180;
      const x = ox + r * Math.cos(a);
      const y = oy + r * Math.sin(a);
      if (x > VB.x + m && x < VB.x + VB.w - m * 2 && y > VB.y + m && y < VB.y + VB.h - m)
        return { x: r1(x), y: r1(y) };
    }
    return null;
  };
  return { ratio, VB, pos, ringLabel, office: pos(OFFICE.coords.lng, OFFICE.coords.lat) };
}
/** Tight enough that Beaufort and Lady's Island sit ≥ 24px apart (WCAG 2.5.8 target spacing). */
const WIDE = frame(720 / 520, 1.3, 1.08);
const PHONE = frame(350 / 330, 1.14);

const SMALL = "(width < 48rem)";
const subscribeSmall = (cb: () => void) => {
  const m = window.matchMedia(SMALL);
  m.addEventListener("change", cb);
  return () => m.removeEventListener("change", cb);
};
/** Under 768px the markers are decoration (SPEC §6.6). Server render: interactive. */
const useSmall = () =>
  useSyncExternalStore(
    subscribeSmall,
    () => window.matchMedia(SMALL).matches,
    () => false,
  );

export const townRowId = (slug: string) => `town-row-${slug}`;

export function AreaMap({
  highlight,
  label = "Map of Beaufort County and nearby towns. Our office is in Beaufort. Every town on the map is also listed below.",
}: {
  highlight: string[];
  label?: string;
}) {
  const [hot, setHot] = useState<string | null>(null);
  const [ripple, setRipple] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const small = useSmall();
  const { VB, pos, ringLabel, office, ratio } = small ? PHONE : WIDE;

  // Office pin ripple: once per page view, when 40% of the map is on screen.
  useEffect(() => {
    const el = box.current;
    if (!el || isReducedMotion()) return;
    let timer = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) {
          io.disconnect();
          setRipple(true);
          timer = window.setTimeout(() => setRipple(false), 5400);
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (!hot) return;
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setHot(null);
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [hot]);

  const goRow = (e: React.MouseEvent, a: Area) => {
    e.preventDefault();
    const row = document.getElementById(townRowId(a.slug));
    if (!row) return;
    row.scrollIntoView({ block: "center", behavior: isReducedMotion() ? "auto" : "smooth" });
    row.focus({ preventScroll: true });
  };

  return (
    <div
      ref={box}
      role="group"
      aria-label={label}
      style={{ aspectRatio: ratio }}
      className="area-map relative w-full overflow-hidden rounded-[20px] border border-line bg-plum-100"
    >
      <svg
        aria-hidden="true"
        focusable="false"
        viewBox={`${VB.x} ${VB.y} ${VB.w} ${VB.h}`}
        preserveAspectRatio="none"
        className="absolute inset-0 size-full"
      >
        {RINGS.slice()
          .reverse()
          .map((mi, i) => (
            <circle
              key={mi}
              cx={ox}
              cy={oy}
              r={r1(mi * MILE)}
              fill={i % 2 ? "var(--color-plum-100)" : "var(--color-cream)"}
              stroke="var(--color-muted)"
              strokeWidth="1.5"
              strokeDasharray="4 6"
              vectorEffect="non-scaling-stroke"
            />
          ))}
        {lowcountry.detailed && (
          <>
            <path
              d={lowcountry.land}
              fill="var(--color-cream)"
              stroke="var(--color-plum-800)"
              strokeWidth="1.5"
              vectorEffect="non-scaling-stroke"
            />
            <path
              d={lowcountry.counties}
              fill="none"
              stroke="var(--color-muted)"
              strokeDasharray="4 6"
              vectorEffect="non-scaling-stroke"
            />
          </>
        )}
        {RINGS.map((mi) => {
          const at = ringLabel(mi);
          return (
            at && (
              <text
                key={mi}
                x={at.x}
                y={at.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="var(--color-muted)"
                stroke="var(--color-plum-100)"
                strokeWidth="10"
                paintOrder="stroke"
                fontSize={small ? 40 : 30}
                fontWeight="600"
              >
                {mi} mi
              </text>
            )
          );
        })}
      </svg>

      {/* North arrow */}
      <span
        aria-hidden="true"
        className="absolute top-4 right-4 flex flex-col items-center text-sm font-bold text-plum-800"
      >
        <svg viewBox="0 0 20 24" className="h-6 w-5">
          <path d="M10 1 L17 22 L10 17 L3 22 Z" fill="var(--color-plum-800)" />
        </svg>
        N
      </span>

      {/* Office pin */}
      <div
        className="map-office absolute"
        style={{ left: `${office.left}%`, top: `${office.top}%` }}
        data-ripple={ripple}
      >
        <span aria-hidden="true" className="pin-ring" />
        <span aria-hidden="true" className="pin-ring pin-ring-2" />
        <svg aria-hidden="true" viewBox="0 0 24 24" className="pin-icon">
          <path
            d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"
            fill="var(--color-plum-800)"
          />
          <circle cx="12" cy="10" r="3.2" fill="var(--color-leaf-500)" />
        </svg>
        <p className="map-pill map-office-label">
          {/* Short on the map; the address is in the caption right under it. */}
          <strong>Our office</strong>
        </p>
      </div>

      {/* Towns */}
      {ORDERED.map((a) => {
        const p = pos(a.coords.lng, a.coords.lat);
        const on = hot === a.slug;
        const match = highlight.includes(a.slug);
        const flipX = p.left > 62;
        const below = p.top < 22;
        const drive = formatDrive(a.driveMinutes);
        return (
          <div
            key={a.slug}
            className="map-town absolute"
            style={{ left: `${p.left}%`, top: `${p.top}%` }}
            data-match={match}
            data-hot={on}
            data-tier={a.tier}
          >
            <a
              href={a.hasPage ? `/areas-we-serve/${a.slug}` : `#${townRowId(a.slug)}`}
              aria-label={
                a.hasPage
                  ? `In-home care ${a.preposition} ${a.name}. Opens the ${a.name} page.`
                  : `${a.name}: about ${drive} minutes from our office. Call to check. Goes to ${a.name} in the town list.`
              }
              data-cursor-label="View"
              aria-hidden={small || undefined}
              tabIndex={small ? -1 : undefined}
              className="map-dot"
              onClick={a.hasPage ? undefined : (e) => goRow(e, a)}
              onPointerEnter={() => setHot(a.slug)}
              onPointerLeave={() => setHot((h) => (h === a.slug ? null : h))}
              onFocus={() => setHot(a.slug)}
              onBlur={() => setHot((h) => (h === a.slug ? null : h))}
            >
              <span aria-hidden="true" className="map-dot-in" />
            </a>
            {ALWAYS.has(a.slug) && !on && (
              <span
                aria-hidden="true"
                className={cn(
                  "map-pill map-label",
                  (LABEL_LEFT.has(a.slug) || p.left > (small ? 55 : 88)) && "map-label-left",
                )}
              >
                {a.name}
              </span>
            )}
            {on && (
              <div
                aria-hidden="true"
                className={cn("map-tip", flipX && "map-tip-left", below && "map-tip-below")}
                onPointerEnter={() => setHot(a.slug)}
                onPointerLeave={() => setHot(null)}
              >
                <p className="font-bold text-plum-800">{a.name}</p>
                <p>
                  About {drive} min from our office
                  {!a.driveConfirmed && flags.showPlaceholders && (
                    <span className="tbc ml-1.5">To confirm</span>
                  )}
                </p>
                {!a.hasPage && <p className="font-semibold text-plum-800">Call to check</p>}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
