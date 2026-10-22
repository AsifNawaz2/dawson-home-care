/**
 * Office status, computed in America/New_York (07 §11, SPEC §15, COPY_CONVERSION §1).
 * Pure functions — never use the device's local time zone for business logic.
 * Open = Mon–Fri 08:00–16:59. "Closing soon" = 16:30–16:59.
 */
import { hours } from "@/content/site.config";

export type OfficeState = "open" | "closing-soon" | "closed" | "holiday";
export type Holiday = { date: string; name: string };
export type OfficeStatus = {
  state: OfficeState;
  /** "today at 8 AM" | "tomorrow at 8 AM" | "Monday at 8 AM" */
  nextOpenLabel: string;
  holidayName?: string;
};

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const TZ = hours.timeZone;

type NyParts = { year: number; month: number; day: number; weekday: number; minutes: number };

function nyParts(date: Date): NyParts {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  const weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"));
  return {
    year: Number(get("year")),
    month: Number(get("month")),
    day: Number(get("day")),
    weekday,
    minutes: Number(get("hour")) * 60 + Number(get("minute")),
  };
}

const iso = (y: number, m: number, d: number) =>
  `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

/** Calendar date `offset` days after (y, m, d) — pure date math, no time zones involved. */
function addDays(y: number, m: number, d: number, offset: number) {
  const t = new Date(Date.UTC(y, m - 1, d + offset));
  return {
    y: t.getUTCFullYear(),
    m: t.getUTCMonth() + 1,
    d: t.getUTCDate(),
    weekday: t.getUTCDay(),
  };
}

const OPEN = 8 * 60;
const CLOSE = 17 * 60;
const CLOSING_SOON = 16 * 60 + 30;

export function getOfficeStatus(now: Date, holidays: Holiday[] = []): OfficeStatus {
  const p = nyParts(now);
  const isHoliday = (y: number, m: number, d: number) =>
    holidays.find((h) => h.date === iso(y, m, d));
  const isWorkday = (weekday: number, y: number, m: number, d: number) =>
    weekday >= 1 && weekday <= 5 && !isHoliday(y, m, d);

  const todayHoliday = isHoliday(p.year, p.month, p.day);
  const todayWorkday = isWorkday(p.weekday, p.year, p.month, p.day);

  if (todayWorkday && p.minutes >= OPEN && p.minutes < CLOSE) {
    return {
      state: p.minutes >= CLOSING_SOON ? "closing-soon" : "open",
      nextOpenLabel: "today at 8 AM",
    };
  }

  // Find the next opening.
  let label = "";
  if (todayWorkday && p.minutes < OPEN) {
    label = "today at 8 AM";
  } else {
    for (let i = 1; i <= 14; i++) {
      const n = addDays(p.year, p.month, p.day, i);
      if (isWorkday(n.weekday, n.y, n.m, n.d)) {
        label = i === 1 ? "tomorrow at 8 AM" : `${WEEKDAYS[n.weekday]} at 8 AM`;
        break;
      }
    }
  }
  // COPY_HOME §0: after 5 PM Friday / weekend → "Monday at 8 AM" (never "tomorrow" on Sunday).
  if (label === "tomorrow at 8 AM" && p.weekday === 0) label = "Monday at 8 AM";

  return {
    state: todayHoliday ? "holiday" : "closed",
    nextOpenLabel: label,
    holidayName: todayHoliday?.name,
  };
}

/** " ET" when the visitor's device isn't in Eastern time, else "" (COPY_CONVERSION {ET}). */
export function etSuffix(): " ET" | "" {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return tz === TZ ? "" : " ET";
  } catch {
    return "";
  }
}
