"use client";

/** Small shared form parts (design 04-free-assessment): progress line, errors, check marks. */
import { forwardRef, useId } from "react";
import { CircleAlert } from "lucide-react";

const BEAT =
  "M0 20 H36 L42 14 L47 20 H52 L58 4 L64 36 L69 12 L73 20 H136 L142 14 L147 20 H152 L158 4 L164 36 L169 12 L173 20 H236 L242 14 L247 20 H252 L258 4 L264 36 L269 12 L273 20 H336 L342 14 L347 20 H352 L358 4 L364 36 L369 12 L373 20 H436 L442 14 L447 20 H452 L458 4 L464 36 L469 12 L473 20 H500";

/** Heartbeat progress line (BRAND_FINAL §1.4 #16): plum-800 fills as steps complete. */
export function HeartbeatProgress({
  fraction,
  labels,
  current,
}: {
  fraction: number;
  labels?: readonly string[];
  current?: number;
}) {
  const id = useId().replace(/:/g, "");
  return (
    <div aria-hidden="true" className="relative">
      <svg
        viewBox="0 0 500 40"
        width="100%"
        height="36"
        preserveAspectRatio="none"
        className="block overflow-visible"
      >
        <defs>
          <clipPath id={`pc-${id}`}>
            <rect
              className="pfill"
              x="0"
              y="-10"
              width="500"
              height="60"
              style={{ transform: `scaleX(${fraction})` }}
            />
          </clipPath>
        </defs>
        <path
          d={BEAT}
          fill="none"
          strokeWidth="3"
          strokeLinejoin="round"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          className="stroke-line"
        />
        <path
          clipPath={`url(#pc-${id})`}
          d={BEAT}
          fill="none"
          strokeWidth="3.5"
          strokeLinejoin="round"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          className="stroke-plum-800 drop-shadow-[0_0_4px_rgb(194_91_217/0.7)]"
        />
      </svg>
      {labels && (
        <div
          className="mt-1.5 grid"
          style={{ gridTemplateColumns: `repeat(${labels.length}, minmax(0, 1fr))` }}
        >
          {labels.map((n, i) => (
            <span
              key={n}
              className={
                i === current
                  ? "text-sm font-bold tracking-[0.02em] text-plum-800"
                  : i < (current ?? 0)
                    ? "text-sm font-semibold tracking-[0.02em] text-plum-800"
                    : "text-sm font-medium tracking-[0.02em] text-muted"
              }
            >
              {n}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="emsg">
      <CircleAlert aria-hidden size={20} strokeWidth={1.75} className="flex-none" />
      {message}
    </p>
  );
}

export type SummaryItem = { target: string; message: string };

/** Error summary (COPY_CONVERSION §8.1): focus lands on it; each item links to its field. */
export const ErrorSummary = forwardRef<HTMLDivElement, { title: string; items: SummaryItem[] }>(
  function ErrorSummary({ title, items }, ref) {
    return (
      <div ref={ref} role="alert" tabIndex={-1} className="esum">
        <p className="font-bold text-plum-800">{title}</p>
        <ul className="flex list-disc flex-col gap-1 pl-5">
          {items.map((e) => (
            <li key={e.target}>
              <a
                href={`#${e.target}`}
                onClick={(ev) => {
                  ev.preventDefault();
                  const el = document.getElementById(e.target);
                  el?.focus();
                  el?.scrollIntoView({ block: "center" });
                }}
              >
                {e.message}
              </a>
            </li>
          ))}
        </ul>
      </div>
    );
  },
);

export function CheckIcon({ size = 20, className }: { size?: number; className?: string }) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M5 12.5 10 17.5 19.5 7" />
    </svg>
  );
}

/** "A, B and C" */
export const joinAnd = (xs: string[]) =>
  xs.length <= 1 ? (xs[0] ?? "") : `${xs.slice(0, -1).join(", ")} and ${xs[xs.length - 1]}`;
