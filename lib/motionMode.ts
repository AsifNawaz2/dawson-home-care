"use client";

import { useSyncExternalStore } from "react";

/**
 * One source of truth for motion (SPEC §0.3):
 * reduced = OS prefers-reduced-motion OR Comfort Controls html[data-motion="reduce"].
 * Server and first paint are always "reduced" so static layouts render without JS.
 */
export type MotionMode = "full" | "reduced";

function read(): MotionMode {
  const html = document.documentElement;
  if (html.dataset.motion === "reduce") return "reduced";
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "reduced" : "full";
}

function subscribe(cb: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", cb);
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-motion", "data-contrast"],
  });
  return () => {
    mq.removeEventListener("change", cb);
    mo.disconnect();
  };
}

export function useMotionMode(): MotionMode {
  return useSyncExternalStore(subscribe, read, () => "reduced");
}

export function isReducedMotion(): boolean {
  if (typeof window === "undefined") return true;
  return read() === "reduced";
}

function readContrast(): boolean {
  return (
    document.documentElement.dataset.contrast === "high" ||
    window.matchMedia("(forced-colors: active)").matches
  );
}

export function useHighContrast(): boolean {
  return useSyncExternalStore(subscribe, readContrast, () => false);
}
