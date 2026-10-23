"use client";

/**
 * Town-page mini map (SPEC_FEATURES §6.4 "drive line", COPY_AREAS §3): the office and this town,
 * cropped from the same projection as the main map. When the card is 40% in view, a straight
 * "as the heron flies" line with one heartbeat blip draws from office to town (900ms, once).
 * Reduced motion: drawn already. Decorative — the card text says the same thing.
 */
import { useEffect, useRef, useState } from "react";
import { OFFICE, type Area } from "@/content/areas";
import { project } from "@/lib/projection";
import { isReducedMotion } from "@/lib/motionMode";

const RATIO = 4 / 3;
const r1 = (n: number) => Math.round(n * 10) / 10;

export function DriveMap({ area }: { area: Area }) {
  const [drawn, setDrawn] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  const [ox, oy] = project(OFFICE.coords.lng, OFFICE.coords.lat);
  const [tx, ty] = project(area.coords.lng, area.coords.lat);
  const span = Math.max(Math.abs(tx - ox) * 1.8, Math.abs(ty - oy) * 1.8 * RATIO, 120);
  const W = span;
  const H = W / RATIO;
  const cx = (ox + tx) / 2;
  const cy = (oy + ty) / 2;
  const vb = { x: r1(cx - W / 2), y: r1(cy - H / 2), w: r1(W), h: r1(H) };
  const pct = (x: number, y: number) => ({
    left: `${r1(((x - vb.x) / vb.w) * 100)}%`,
    top: `${r1(((y - vb.y) / vb.h) * 100)}%`,
  });

  // Office → town with a small heartbeat blip at the midpoint.
  const dx = tx - ox;
  const dy = ty - oy;
  const len = Math.sqrt(dx * dx + dy * dy) || 1; // sqrt is exact in every engine (no hydration drift)
  const ux = dx / len;
  const uy = dy / len;
  const nx = -uy;
  const ny = ux;
  const at = (t: number, off = 0) => `${r1(ox + ux * len * t + nx * off)} ${r1(oy + uy * len * t + ny * off)}`;
  const s = Math.min(len * 0.06, W * 0.05);
  const d = `M${at(0)} L${at(0.42)} L${at(0.46, -s)} L${at(0.5, s * 1.4)} L${at(0.54, -s * 0.8)} L${at(0.58)} L${at(1)}`;

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    if (isReducedMotion()) {
      setDrawn(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) {
          setDrawn(true);
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={box}
      aria-hidden="true"
      style={{ aspectRatio: RATIO }}
      className="relative w-full overflow-hidden rounded-[20px] border border-line bg-plum-100"
    >
      <svg viewBox={`${vb.x} ${vb.y} ${vb.w} ${vb.h}`} className="absolute inset-0 size-full">
        <path
          d={d}
          pathLength={1}
          fill="none"
          stroke="var(--color-orchid-500)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          className="drive-line"
          data-drawn={drawn}
        />
      </svg>
      <span className="absolute size-0" style={pct(ox, oy)}>
        <svg viewBox="0 0 24 24" className="absolute -top-[30px] -left-4 size-8 max-w-none drop-shadow-[0_4px_6px_rgb(42_24_86/0.25)]">
          <path
            d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"
            fill="var(--color-plum-800)"
          />
          <circle cx="12" cy="10" r="3.2" fill="var(--color-leaf-500)" />
        </svg>
        <span className="map-pill top-1.5 -translate-x-1/2">
          <strong className="text-plum-800">Our office</strong>
        </span>
      </span>
      <span className="absolute size-0" style={pct(tx, ty)}>
        <span className="absolute -top-[11px] -left-[11px] size-[22px] rounded-full border-2 border-plum-800 bg-orchid-500" />
        <span className="map-pill top-3 -translate-x-1/2">{area.name}</span>
      </span>
    </div>
  );
}
