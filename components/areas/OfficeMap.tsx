"use client";

/**
 * /contact "Find our office" map (COPY_CONVERSION §7 "02"): the site's schematic Lowcountry map
 * (same projection as AreaMap), cropped to Beaufort, with the office pin. The pin ripples 3 times
 * (leaf-500) when the map is 40% in view; no ripple in reduced motion. No third-party embed.
 */
import { useEffect, useRef, useState } from "react";
import { OFFICE, areas } from "@/content/areas";
import { address } from "@/content/site.config";
import { project } from "@/lib/projection";
import { isReducedMotion } from "@/lib/motionMode";

const NEAR = ["beaufort", "port-royal", "ladys-island", "burton", "shell-point"];
const RATIO = 16 / 10;
/** Beaufort and Lady's Island sit close together: their labels lean away from each other. */
const LABEL_ALIGN: Record<string, string> = {
  beaufort: "-translate-x-[calc(100%-10px)]",
  "ladys-island": "-translate-x-[10px]",
};
const r1 = (n: number) => Math.round(n * 10) / 10;

const [ox, oy] = project(OFFICE.coords.lng, OFFICE.coords.lat);
const towns = areas
  .filter((a) => NEAR.includes(a.slug))
  .map((a) => {
    const [x, y] = project(a.coords.lng, a.coords.lat);
    return { slug: a.slug, name: a.name, x, y };
  });
const xs = [ox, ...towns.map((t) => t.x)];
const ys = [oy, ...towns.map((t) => t.y)];
const W = Math.max(
  (Math.max(...xs) - Math.min(...xs)) * 1.5,
  (Math.max(...ys) - Math.min(...ys)) * 1.6 * RATIO,
);
const H = W / RATIO;
const cx = (Math.min(...xs) + Math.max(...xs)) / 2;
const cy = (Math.min(...ys) + Math.max(...ys)) / 2;
const vb = { x: cx - W / 2, y: cy - H / 2 };
const pct = (x: number, y: number) => ({
  left: `${r1(((x - vb.x) / W) * 100)}%`,
  top: `${r1(((y - vb.y) / H) * 100)}%`,
});

export function OfficeMap() {
  const [ripple, setRipple] = useState(false);
  const box = useRef<HTMLDivElement>(null);

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

  return (
    <div
      ref={box}
      role="img"
      aria-label={`Map showing our office at ${address.street.value} in ${address.city.value}.`}
      style={{ aspectRatio: RATIO }}
      className="relative w-full overflow-hidden rounded-[28px] border border-line bg-plum-100"
    >
      {towns.map((t) => (
        <span key={t.slug} aria-hidden="true" className="absolute size-0" style={pct(t.x, t.y)}>
          <span className="absolute -top-[7px] -left-[7px] size-3.5 rounded-full border-2 border-plum-800 bg-white" />
          <span className={`map-pill top-2.5 ${LABEL_ALIGN[t.slug] ?? "-translate-x-1/2"}`}>
            {t.name}
          </span>
        </span>
      ))}
      <div
        aria-hidden="true"
        className="map-office absolute"
        style={pct(ox, oy)}
        data-ripple={ripple}
      >
        <span className="pin-ring" />
        <span className="pin-ring pin-ring-2" />
        <svg viewBox="0 0 24 24" className="pin-icon">
          <path
            d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"
            fill="var(--color-plum-800)"
          />
          <circle cx="12" cy="10" r="3.2" fill="var(--color-leaf-500)" />
        </svg>
        <p className="map-pill bottom-[38px] left-0 -translate-x-1/2 border border-line !bg-white text-center max-sm:!text-[0.875rem]">
          <strong className="text-plum-800">Our office</strong>
          <span className="max-sm:hidden"> · {address.short}</span>
        </p>
      </div>
    </div>
  );
}
