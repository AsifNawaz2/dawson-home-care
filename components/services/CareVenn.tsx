/**
 * "Most families combine services" Venn (COPY_SERVICES hub 02), drawn in the 3D-icon palette.
 * The diagram is one image with a full text alternative; the three service links sit under it and
 * light up their circle on hover or focus (no brightening in reduced motion).
 */
import Link from "next/link";
import { careHub } from "@/content/careHub";

const CIRCLES = [
  { key: "pc", slug: "personal-care", name: "Personal Care", cx: 150, cy: 120, lx: 150, ly: 70 },
  { key: "hh", slug: "home-help", name: "Home Help", cx: 250, cy: 120, lx: 250, ly: 70 },
  { key: "co", slug: "companionship", name: "Companionship", cx: 200, cy: 205, lx: 200, ly: 262 },
] as const;

export function CareVenn() {
  return (
    <div className="venn mt-4 flex flex-col gap-4">
      <svg
        role="img"
        aria-label={careHub.plan.vennLabel}
        viewBox="0 0 400 320"
        className="w-full max-w-[480px]"
      >
        {CIRCLES.map((c) => (
          <circle
            key={c.key}
            data-s={c.key}
            cx={c.cx}
            cy={c.cy}
            r="95"
            className="fill-orchid-500/20 stroke-plum-800 transition-[fill] duration-300 reduce-motion:transition-none"
            strokeWidth="2"
          />
        ))}
        {CIRCLES.map((c) => (
          <text
            key={c.key}
            x={c.lx}
            y={c.ly}
            textAnchor="middle"
            className="fill-plum-800 font-sans text-[15px] font-semibold"
          >
            {c.name}
          </text>
        ))}
        <circle cx="200" cy="150" r="30" className="fill-leaf-500" />
        <text
          x="200"
          y="146"
          textAnchor="middle"
          className="fill-plum-950 font-sans text-[11px] font-bold"
        >
          Your care
        </text>
        <text
          x="200"
          y="161"
          textAnchor="middle"
          className="fill-plum-950 font-sans text-[11px] font-bold"
        >
          plan
        </text>
      </svg>
      <ul className="flex flex-wrap gap-x-6 gap-y-1">
        {CIRCLES.map((c) => (
          <li key={c.key}>
            <Link className="link" href={`/care/${c.slug}`} data-s={c.key} data-cursor-label="Open">
              See {c.name}
              <span aria-hidden="true"> →</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
