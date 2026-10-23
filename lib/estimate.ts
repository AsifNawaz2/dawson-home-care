/**
 * Cost estimator maths (SPEC_FEATURES §5.3). Pure, unit-testable. No price is ever invented:
 * with the rates in content/site.config.ts all null, `prices` is null → hours-only mode.
 */
import { rates as siteRates } from "@/content/site.config";
import { hoursPresets } from "@/content/quiz";

export type PresetId = "few-hours-week" | "few-hours-most-days" | "full-days" | "around-the-clock";
export type EstimatorValues = {
  hoursPerVisit: number;
  daysPerWeek: number;
  overnight: boolean;
  preset: PresetId | "custom";
};

export const WEEKS_PER_MONTH = 4.33;
const roundTo = (n: number, step: number) => Math.round(n / step) * step;
export const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export const MIN_HOURS = siteRates.minimumVisitHours ?? 2;
export const MAX_HOURS = 24;

export function estimate(v: EstimatorValues, r: typeof siteRates = siteRates) {
  const weeklyHours = v.hoursPerVisit * v.daysPerWeek;
  const overnight = v.overnight && r.overnightRateMin !== null && r.overnightRateMax !== null;
  const min = overnight ? r.overnightRateMin : r.rateMin;
  const max = overnight ? r.overnightRateMax : r.rateMax;
  if (!r.showPrices || min === null || max === null) return { weeklyHours, prices: null };
  const wMin = weeklyHours * min;
  const wMax = weeklyHours * max;
  return {
    weeklyHours,
    prices: {
      weeklyMin: roundTo(wMin, 10),
      weeklyMax: roundTo(wMax, 10),
      monthlyMin: roundTo(wMin * WEEKS_PER_MONTH, 50),
      monthlyMax: roundTo(wMax * WEEKS_PER_MONTH, 50),
    },
  };
}

/** Must equal quiz.ts `hoursPresets` (same ids, same numbers). */
export const PRESETS: Record<PresetId, Omit<EstimatorValues, "preset">> = Object.fromEntries(
  Object.entries(hoursPresets).map(([id, p]) => [
    id,
    { hoursPerVisit: p.hoursPerVisit, daysPerWeek: p.daysPerWeek, overnight: p.overnight },
  ]),
) as Record<PresetId, Omit<EstimatorValues, "preset">>;

export const PRESET_LABELS: Record<PresetId, string> = {
  "few-hours-week": "A few hours a week",
  "few-hours-most-days": "A few hours most days",
  "full-days": "Full days",
  "around-the-clock": "Around the clock",
};

export const DEFAULT_VALUES: EstimatorValues = {
  hoursPerVisit: 4,
  daysPerWeek: 3,
  overnight: false,
  preset: "custom",
};

const intIn = (s: string | null, lo: number, hi: number) => {
  if (s === null || !/^\d+$/.test(s)) return null;
  const n = Number(s);
  return n >= lo && n <= hi ? n : null;
};

/** Reads ?hours&days&overnight&preset. Anything out of range → defaults (never throws). */
export function valuesFromParams(q: URLSearchParams): EstimatorValues | null {
  const hours = intIn(q.get("hours"), MIN_HOURS, MAX_HOURS);
  const days = intIn(q.get("days"), 1, 7);
  if (hours === null || days === null) return null;
  const preset = q.get("preset");
  return {
    hoursPerVisit: hours,
    daysPerWeek: days,
    overnight: q.get("overnight") === "1",
    preset: preset && preset in PRESETS ? (preset as PresetId) : "custom",
  };
}

export const ESTIMATOR_STORAGE_KEY = "dawson.estimator.v1";
