"use client";

/**
 * Cost Estimator (SPEC_FEATURES §5, COPY_HOME ch. 10, COPY_COST_FAQ 01; design 01-home "COST").
 *
 * variant "home"    — the design's two-panel card: controls (white) | output (plum-950).
 * variant "full"    — /paying-for-care#estimator: + quick start, prefill banner, hints, "What
 *                     does this mean?".
 * variant "compact" — quiz result: same controls and output, stacked, smaller.
 *
 * Hours first; a price range only from real rates (content/site.config.ts → rates). While the
 * rates are unconfirmed the "Illustrative estimate" badge shows; with no rates at all the range
 * renders as [to confirm] placeholders in the preview and as the hours-only line in production.
 */
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { Minus, Plus } from "lucide-react";
import { flags, rates } from "@/content/site.config";
import {
  DEFAULT_VALUES,
  ESTIMATOR_STORAGE_KEY,
  MAX_HOURS,
  MIN_HOURS,
  PRESETS,
  PRESET_LABELS,
  estimate,
  usd,
  valuesFromParams,
  type EstimatorValues,
  type PresetId,
} from "@/lib/estimate";
import { isReducedMotion } from "@/lib/motionMode";
import { writeStorage } from "@/lib/storage";
import { cn } from "@/lib/cn";
import { AssessmentButton } from "@/components/ui/AssessmentButton";

type Variant = "home" | "full" | "compact";

export function CostEstimator({
  variant,
  source,
  initial,
  serviceSlug,
  readParams = false,
  links,
}: {
  variant: Variant;
  source: string;
  initial?: Partial<EstimatorValues>;
  serviceSlug?: string;
  /** Full variant: start from ?hours&days&overnight (service pages, quiz, Home). */
  readParams?: boolean;
  links?: { label: string; href: string }[];
}) {
  const [v, setV] = useState<EstimatorValues>({ ...DEFAULT_VALUES, ...initial });
  const [banner, setBanner] = useState<string | null>(null);
  const [explain, setExplain] = useState(false);
  const [live, setLive] = useState("");
  const uid = useId();
  const numRef = useRef<HTMLSpanElement>(null);
  const shown = useRef(v.hoursPerVisit * v.daysPerWeek);
  const est = estimate(v);
  const full = variant === "full";
  const compact = variant === "compact";

  // Full variant: prefill from the URL once.
  useEffect(() => {
    if (!readParams) return;
    const q = new URLSearchParams(window.location.search);
    const fromUrl = valuesFromParams(q);
    if (!fromUrl) return;
    /* eslint-disable react-hooks/set-state-in-effect -- one-time prefill */
    setV(fromUrl);
    const from = q.get("from");
    const svc = q.get("service");
    if (from === "quiz" && fromUrl.preset !== "custom") {
      setBanner(`quiz:${PRESET_LABELS[fromUrl.preset]}`);
    } else if (from === "home") setBanner("home");
    else if (svc) setBanner(`service:${svc}`);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [readParams]);

  // Count-up for the big number (≤ 400ms; reduced motion = final number).
  useEffect(() => {
    const el = numRef.current;
    const to = est.weeklyHours;
    if (!el) return;
    const from = shown.current;
    shown.current = to;
    if (from === to || isReducedMotion()) {
      el.textContent = String(to);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - t0) / 400);
      el.textContent = String(Math.round(from + (to - from) * (1 - Math.pow(1 - t, 3))));
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [est.weeklyHours]);

  // Live region 500ms after input settles; save for the assessment form.
  useEffect(() => {
    const id = window.setTimeout(() => {
      setLive(
        est.prices
          ? `${est.weeklyHours} hours a week. About ${usd.format(est.prices.weeklyMin)} to ${usd.format(est.prices.weeklyMax)} a week.`
          : `${est.weeklyHours} hours a week.`,
      );
      writeStorage(
        "session",
        ESTIMATOR_STORAGE_KEY,
        JSON.stringify({ values: v, source, updatedAt: new Date().toISOString() }),
      );
    }, 500);
    return () => window.clearTimeout(id);
  }, [v, est.weeklyHours, est.prices, source]);

  const set = (patch: Partial<EstimatorValues>) =>
    setV((cur) => ({ ...cur, ...patch, preset: "custom" }));
  const pick = (id: PresetId) => setV({ ...PRESETS[id], preset: id });
  const hoursPct = ((v.hoursPerVisit - MIN_HOURS) / (MAX_HOURS - MIN_HOURS)) * 100;
  const scalePct = Math.min(100, (est.weeklyHours / 168) * 100);

  const ctaQuery = new URLSearchParams({
    hours: String(v.hoursPerVisit),
    days: String(v.daysPerWeek),
    overnight: v.overnight ? "1" : "0",
    ...(serviceSlug ? { service: serviceSlug } : {}),
  });
  const hint =
    v.hoursPerVisit === 24 && v.daysPerWeek === 7
      ? "That's care around the clock — 168 hours a week. It's covered in shifts, so a rested caregiver is always there."
      : v.hoursPerVisit >= 12 && !v.overnight
        ? "Planning nights or long shifts? Turn on overnight or 24-hour care."
        : "";

  const showBadge = !rates.rateConfirmed;
  const priceTbc = !est.prices && flags.showPlaceholders;

  return (
    <div className="flex flex-col gap-6">
      {(showBadge || full) && (
        <div className={cn("flex flex-wrap items-center gap-3", variant === "home" && "hidden")}>
          {showBadge && <Badge />}
          {full && showBadge && (
            <button
              type="button"
              className="link sm !min-h-10"
              aria-expanded={explain}
              aria-controls={`${uid}-explain`}
              onClick={() => setExplain((x) => !x)}
            >
              What does this mean?
            </button>
          )}
        </div>
      )}
      {full && (
        <div
          id={`${uid}-explain`}
          hidden={!explain}
          className="notice -mt-3 flex flex-col gap-2 !text-ink"
        >
          <p>
            These numbers are an example to help you plan. They&apos;re not a quote, and
            they&apos;re not Dawson&apos;s set prices. Your exact rate is set at your free
            assessment.
          </p>
          <p>Monthly figures use 4.33 weeks — the average number of weeks in a month.</p>
        </div>
      )}
      {full && banner && (
        <div className="banner flex-wrap" aria-live="polite">
          <p>
            {banner.startsWith("quiz:") && (
              <>
                We&apos;ve started this from your quiz answer: <strong>{banner.slice(5)}</strong>.
                Change anything to match your plans.
              </>
            )}
            {banner === "home" && "We've kept the numbers you chose on our home page."}
            {banner.startsWith("service:") && (
              <>
                We&apos;ve started this at an example for{" "}
                <strong>{serviceName(banner.slice(8))}</strong>: {v.hoursPerVisit} hours a visit,{" "}
                {v.daysPerWeek} days a week{v.overnight ? ", with overnight care" : ""}. Change
                anything to match your plans.
              </>
            )}
          </p>
          <button
            type="button"
            className="link sm !min-h-11 flex-none"
            onClick={() => {
              setV(DEFAULT_VALUES);
              setBanner(null);
            }}
          >
            Start over
          </button>
        </div>
      )}

      {full && (
        <div className="flex flex-col gap-3">
          <p id={`${uid}-qs`} className="font-semibold text-plum-800">
            Start from an example:
          </p>
          <div role="group" aria-labelledby={`${uid}-qs`} className="flex flex-wrap gap-2.5">
            {(Object.keys(PRESETS) as PresetId[]).map((id) => (
              <button
                key={id}
                type="button"
                aria-pressed={v.preset === id}
                onClick={() => pick(id)}
                className="inline-flex min-h-12 items-center rounded-full border-[1.5px] border-muted bg-white px-5 font-semibold text-plum-800 transition-colors hover:border-orchid-500 hover:bg-orchid-100 aria-pressed:border-2 aria-pressed:border-plum-800 aria-pressed:bg-plum-100"
              >
                {PRESET_LABELS[id]}
              </button>
            ))}
          </div>
        </div>
      )}

      <div
        className={cn(
          "overflow-hidden rounded-[20px] border border-line",
          !compact && "lg:grid lg:grid-cols-2",
        )}
      >
        {/* Controls */}
        <div
          className={cn(
            "flex flex-col gap-8 bg-white",
            compact ? "p-5" : "p-6 md:p-10 lg:gap-10 lg:p-14",
          )}
        >
          <div className="flex flex-col gap-2">
            <div className="flex items-baseline justify-between gap-4">
              <label htmlFor={`${uid}-hours`} className="font-semibold text-plum-800">
                Hours per visit
              </label>
              <output htmlFor={`${uid}-hours`} className="font-bold text-plum-800">
                {v.hoursPerVisit} hours
              </output>
            </div>
            {full && (
              <p id={`${uid}-hours-help`} className="help">
                How long each visit lasts. Pick 24 for care around the clock.
              </p>
            )}
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="iconbtn flex-none"
                aria-label="Fewer hours"
                aria-disabled={v.hoursPerVisit <= MIN_HOURS || undefined}
                onClick={() =>
                  v.hoursPerVisit > MIN_HOURS && set({ hoursPerVisit: v.hoursPerVisit - 1 })
                }
              >
                <Minus aria-hidden size={20} strokeWidth={2} />
              </button>
              <div className="relative flex-1">
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 top-5 h-2 overflow-hidden rounded-full border-[1.5px] border-muted"
                >
                  <div className="h-full bg-plum-800" style={{ width: `${hoursPct}%` }} />
                </div>
                <input
                  id={`${uid}-hours`}
                  className="dd-range"
                  type="range"
                  min={MIN_HOURS}
                  max={MAX_HOURS}
                  step={1}
                  value={v.hoursPerVisit}
                  aria-valuetext={`${v.hoursPerVisit} hours per visit`}
                  aria-describedby={full ? `${uid}-hours-help` : undefined}
                  onChange={(e) => set({ hoursPerVisit: Number(e.target.value) })}
                />
              </div>
              <button
                type="button"
                className="iconbtn flex-none"
                aria-label="More hours"
                aria-disabled={v.hoursPerVisit >= MAX_HOURS || undefined}
                onClick={() =>
                  v.hoursPerVisit < MAX_HOURS && set({ hoursPerVisit: v.hoursPerVisit + 1 })
                }
              >
                <Plus aria-hidden size={20} strokeWidth={2} />
              </button>
            </div>
            <div aria-hidden="true" className="sm muted flex justify-between px-[60px]">
              <span>{MIN_HOURS}</span>
              {full && <span>12</span>}
              <span>24</span>
            </div>
            {flags.showPlaceholders && rates.minimumVisitHours === null && (
              <p className="sm muted">
                Visits start at <span className="tbc">[Minimum hours]</span> hours.
              </p>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <p id={`${uid}-days`} className="font-semibold text-plum-800">
              Days per week
            </p>
            {full && <p className="help -mt-2">How many days a week someone comes.</p>}
            <div role="group" aria-labelledby={`${uid}-days`} className="flex items-center gap-6">
              <button
                type="button"
                className="iconbtn"
                aria-label="Fewer days"
                aria-disabled={v.daysPerWeek <= 1 || undefined}
                onClick={() => v.daysPerWeek > 1 && set({ daysPerWeek: v.daysPerWeek - 1 })}
              >
                <Minus aria-hidden size={20} strokeWidth={2} />
              </button>
              <output
                aria-live="polite"
                className="min-w-24 text-center text-[1.375rem] font-bold text-plum-800"
              >
                {v.daysPerWeek} {v.daysPerWeek === 1 ? "day" : "days"}
              </output>
              <button
                type="button"
                className="iconbtn"
                aria-label="More days"
                aria-disabled={v.daysPerWeek >= 7 || undefined}
                onClick={() => v.daysPerWeek < 7 && set({ daysPerWeek: v.daysPerWeek + 1 })}
              >
                <Plus aria-hidden size={20} strokeWidth={2} />
              </button>
            </div>
          </div>

          <div className="flex items-start gap-5 border-t border-line pt-8">
            <button
              type="button"
              role="switch"
              className="switch"
              aria-checked={v.overnight}
              aria-labelledby={`${uid}-on`}
              aria-describedby={`${uid}-on-help`}
              onClick={() => set({ overnight: !v.overnight })}
            />
            <div className="flex flex-col gap-1">
              <p id={`${uid}-on`} className="font-semibold text-plum-800">
                Overnight or 24-hour care
              </p>
              <p id={`${uid}-on-help`} className="sm muted">
                Turn on if someone needs to be there overnight or around the clock.
              </p>
              {v.overnight && (
                <p className="sm mt-1 text-plum-800">
                  Overnight and 24-hour care can be priced differently from daytime visits.
                  We&apos;ll confirm your rate at your free visit.
                </p>
              )}
            </div>
          </div>
          {full && (
            <p className="notice sm empty:hidden" aria-live="polite">
              {hint}
            </p>
          )}
        </div>

        {/* Output */}
        <div
          data-surface="dark"
          data-cursor-theme="dark"
          className={cn("flex flex-col gap-6 bg-plum-950", compact ? "p-5" : "p-6 md:p-10 lg:p-14")}
        >
          <p className="ff leading-none text-white">
            <span
              ref={numRef}
              aria-hidden="true"
              className={compact ? "text-[3.5rem]" : "text-[4rem] lg:text-[5.5rem]"}
            >
              {est.weeklyHours}
            </span>
            <span
              aria-hidden="true"
              className="font-sans text-[1.25rem] font-medium text-plum-100 lg:text-[1.75rem]"
            >
              {" "}
              hours a week
            </span>
            <span className="sr-only">{est.weeklyHours} hours a week</span>
          </p>
          {est.prices ? (
            <div className="flex flex-col gap-1.5 text-cream">
              <p>
                About{" "}
                <strong>
                  {usd.format(est.prices.weeklyMin)}–{usd.format(est.prices.weeklyMax)}
                </strong>{" "}
                a week
              </p>
              <p>
                About{" "}
                <strong>
                  {usd.format(est.prices.monthlyMin)}–{usd.format(est.prices.monthlyMax)}
                </strong>{" "}
                a month
              </p>
            </div>
          ) : priceTbc ? (
            <div className="flex flex-col gap-1.5 text-cream">
              <p>
                About{" "}
                <strong>
                  <span className="tbc">$[weekly min]</span>–
                  <span className="tbc">$[weekly max]</span>
                </strong>{" "}
                a week
              </p>
              <p>
                About{" "}
                <strong>
                  <span className="tbc">$[monthly min]</span>–
                  <span className="tbc">$[monthly max]</span>
                </strong>{" "}
                a month
              </p>
            </div>
          ) : (
            <p className="font-semibold text-cream">
              Your rate is set at your free assessment — every plan is different.
            </p>
          )}
          <p className="sr-only" aria-live="polite">
            {live}
          </p>
          <div aria-hidden="true" className="mt-2 flex flex-col gap-2.5">
            <div className="h-3 overflow-hidden rounded-full border-[1.5px] border-plum-100">
              <div
                className="h-full origin-left bg-leaf-500 transition-transform duration-[360ms] ease-[cubic-bezier(0.22,1,0.36,1)] reduce-motion:transition-none"
                style={{ transform: `scaleX(${scalePct / 100})` }}
              />
            </div>
            <div className="sm flex justify-between text-plum-100">
              <span>A few hours</span>
              <span>Around the clock</span>
            </div>
          </div>
          <p className="sm text-plum-100">Your exact rate is set at your free assessment.</p>
          <div className="mt-auto flex flex-col items-start gap-1 pt-4">
            {/* The quiz result has its own assessment CTA (with the quiz hand-off) right below. */}
            {!compact && (
              <AssessmentButton
                href={`/free-assessment?${ctaQuery.toString()}`}
                open="Get your exact plan — free assessment"
                className="max-md:w-full max-md:whitespace-normal"
              />
            )}
            {(links ?? []).map((l) => (
              <Link key={l.href} className="link sm" href={l.href}>
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function Badge() {
  return (
    <p className="inline-flex min-h-9 items-center rounded-full bg-orchid-100 px-4 text-sm font-bold text-orchid-700">
      Illustrative estimate
    </p>
  );
}

const NAMES: Record<string, string> = {
  "personal-care": "Personal Care",
  "home-help": "Home Help",
  companionship: "Companionship",
  "respite-care": "Respite Care",
  "24-hour-care": "24-Hour & Overnight Care",
};
const serviceName = (slug: string) => NAMES[slug] ?? "this service";
