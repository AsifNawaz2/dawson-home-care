"use client";

/**
 * Years since 2002 and the current year, read in the browser (Cache Components forbids reading
 * the clock while prerendering). The space is held before hydration so nothing jumps.
 */
import { useSyncExternalStore } from "react";
import { FOUNDED_YEAR } from "@/content/site.config";

const noop = () => () => {};
const useYear = () =>
  useSyncExternalStore(
    noop,
    () => new Date().getFullYear(),
    () => null,
  );

export function YearsSince() {
  const y = useYear();
  return y === null ? <span className="invisible">00</span> : <>{y - FOUNDED_YEAR}</>;
}

export function ThisYear() {
  const y = useYear();
  return y === null ? <span className="invisible">0000</span> : <>{y}</>;
}
