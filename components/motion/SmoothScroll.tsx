"use client";

/**
 * Lenis smooth scrolling (SPEC §0.5) — OFF by default (BUILD_DECISIONS D-33: the approved design
 * runs on normal scrolling). Turn on with NEXT_PUBLIC_SMOOTH_SCROLL=true to compare.
 * Never runs in reduced motion; touch and keyboard scrolling stay native.
 */
import { useEffect } from "react";
import { flags } from "@/content/site.config";
import { useMotionMode } from "@/lib/motionMode";

export function SmoothScroll() {
  const motion = useMotionMode();
  useEffect(() => {
    if (!flags.smoothScroll || motion !== "full") return;
    let destroy: (() => void) | undefined;
    let cancelled = false;
    import("lenis").then(({ default: Lenis }) => {
      if (cancelled) return;
      const lenis = new Lenis({ lerp: 0.1, smoothWheel: true, syncTouch: false });
      let raf = requestAnimationFrame(function loop(t) {
        lenis.raf(t);
        raf = requestAnimationFrame(loop);
      });
      destroy = () => {
        cancelAnimationFrame(raf);
        lenis.destroy();
      };
    });
    return () => {
      cancelled = true;
      destroy?.();
    };
  }, [motion]);
  return null;
}
