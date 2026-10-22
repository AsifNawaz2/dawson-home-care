"use client";

/**
 * Shared helpers for the Home scroll scenes — the same maths as the design's page logic
 * (docs/design/js/01-home-desktop.js `update()`): progress through a tall "track" while its
 * child is pinned with position: sticky, eased with an in-out cubic.
 */
import { useEffect, useEffectEvent } from "react";

export const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
export const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** 0 → 1 while `track` scrolls past with `pinned` stuck to the top of the screen. */
export function trackProgress(track: HTMLElement, pinned: HTMLElement) {
  const r = track.getBoundingClientRect();
  return clamp(-r.top / Math.max(1, r.height - pinned.offsetHeight));
}

export const isDesktop = () => window.matchMedia("(min-width: 64rem)").matches;

/** Runs `update` on mount, then once per frame while the page scrolls or resizes. */
export function useScrollScene(update: () => void, enabled: boolean, onStop?: () => void) {
  const run = useEffectEvent(update);
  const stop = useEffectEvent(() => onStop?.());
  useEffect(() => {
    if (!enabled) return;
    let raf = 0;
    const frame = () => {
      raf = 0;
      run();
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    run();
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(raf);
      stop();
    };
  }, [enabled]);
}
