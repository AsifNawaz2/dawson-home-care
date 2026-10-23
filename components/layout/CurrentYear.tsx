"use client";

import { useSyncExternalStore } from "react";

const noop = () => () => {};

/**
 * © year, computed in the browser (never hard-coded — 05 Fix 1). Cache Components forbids reading
 * the clock during prerender, so the server renders nothing and the browser fills the year in.
 */
export function CurrentYear() {
  const year = useSyncExternalStore(
    noop,
    () => new Date().getFullYear(),
    () => null,
  );
  return <span>{year}</span>;
}
