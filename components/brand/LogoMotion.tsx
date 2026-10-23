"use client";

/**
 * Logo motion (BRAND_FINAL §3.3, SPEC §7):
 *  A. first-visit intro (header, 1.4 s, once per session, skippable)
 *  C. scroll-compact (header: full lockup → mark, no layout shift)
 *  D. footer idle pulse (once per entry into view)
 * Hover/focus (B) is pure CSS in styles/globals.css.
 */
import { useEffect, useRef } from "react";
import { isReducedMotion } from "@/lib/motionMode";

type Props = { kind: "header" | "footer"; children: React.ReactNode; className?: string };

export function LogoMotion({ kind, children, className }: Props) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    return kind === "header" ? runHeader(root) : runFooter(root);
  }, [kind]);

  return (
    <span ref={ref} className={className} data-logo-motion={kind}>
      {children}
    </span>
  );
}

function q<T extends Element = SVGElement>(root: Element, part: string) {
  return Array.from(root.querySelectorAll<T & Element>(`[data-part="${part}"]`));
}

function runHeader(root: HTMLElement) {
  let disposed = false;
  let cleanup: (() => void) | undefined;

  import("gsap").then(({ gsap }) => {
    if (disposed) return;
    const html = document.documentElement;
    const svg = root.querySelector("svg");
    if (!svg) return;

    // ---------- A. Intro ----------
    let introTl: gsap.core.Timeline | null = null;
    const endIntro = () => {
      delete html.dataset.logoIntro;
    };
    if (html.dataset.logoIntro === "play" && !isReducedMotion()) {
      const reveal = (sel: string) => root.querySelectorAll(`mask[id$="${sel}"] [data-reveal]`);
      const heart = root.querySelectorAll('[data-part="heartbeat"] path');
      const pulse = q(root, "heartbeat-pulse");
      introTl = gsap.timeline({ onComplete: endIntro, defaults: { ease: "power2.inOut" } });
      introTl
        .fromTo(
          reveal("rv-roof"),
          { strokeDashoffset: 1 },
          { strokeDashoffset: 0, duration: 0.45 },
          0,
        )
        .fromTo(
          reveal("rv-inner"),
          { strokeDashoffset: 1 },
          { strokeDashoffset: 0, duration: 0.75 },
          0.15,
        )
        .fromTo(
          reveal("rv-window"),
          { strokeDashoffset: 1 },
          { strokeDashoffset: 0, duration: 0.75 },
          0.15,
        )
        .fromTo(
          q(root, "figure"),
          { opacity: 0, scale: 0.94 },
          { opacity: 1, scale: 1, duration: 0.3, ease: "expo.out" },
          0.6,
        )
        .fromTo(
          q(root, "hands"),
          { opacity: 0 },
          { opacity: 1, duration: 0.36, ease: "expo.out" },
          0.66,
        )
        .fromTo(
          q(root, "window-light"),
          { fillOpacity: 0, fill: "#F6EAFB" },
          { fillOpacity: 1, fill: "#FFFFFF", duration: 0.35, ease: "expo.out" },
          0.7,
        )
        .fromTo(q(root, "window-glow"), { opacity: 0 }, { opacity: 1, duration: 0.2 }, 0.7)
        .to(q(root, "window-glow"), { opacity: 0, duration: 0.25 }, 0.9)
        .fromTo(heart, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.35 }, 0.9)
        .fromTo(
          pulse,
          { opacity: 0, strokeDashoffset: 0.12 },
          { opacity: 1, strokeDashoffset: -1, duration: 0.4 },
          0.95,
        )
        .to(pulse, { opacity: 0, duration: 0.12 }, 1.23)
        .fromTo(
          q(root, "wordmark-name"),
          { opacity: 0, y: 68 },
          { opacity: 1, y: 0, duration: 0.35, ease: "expo.out" },
          1.0,
        )
        .fromTo(
          q(root, "wordmark-descriptor"),
          { opacity: 0, y: 68 },
          { opacity: 1, y: 0, duration: 0.32, ease: "expo.out" },
          1.08,
        );
      gsap.set(pulse, { clearProps: "opacity,strokeDashoffset", delay: 1.41 });
      const skip = () => introTl?.progress(1);
      const evts = ["pointerdown", "keydown", "wheel", "touchstart"] as const;
      evts.forEach((e) => window.addEventListener(e, skip, { once: true, passive: true }));
      introTl.eventCallback("onComplete", () => {
        evts.forEach((e) => window.removeEventListener(e, skip));
        endIntro();
      });
    } else {
      endIntro();
    }

    // ---------- C. Scroll-compact ----------
    const heartPaths = root.querySelectorAll('[data-part="heartbeat"] path');
    if (!introTl) gsap.set(heartPaths, { strokeDasharray: "1 1", strokeDashoffset: 0 });
    const compactTl = gsap
      .timeline({ paused: true, defaults: { ease: "power2.inOut" } })
      .to(heartPaths, { strokeDashoffset: 1, duration: 0.2 }, 0)
      .to(q(root, "wordmark-name"), { opacity: 0, y: 40, duration: 0.2, ease: "expo.out" }, 0)
      .to(q(root, "wordmark-descriptor"), { opacity: 0, y: 40, duration: 0.2, ease: "expo.out" }, 0)
      .to(
        q(root, "mark"),
        { scale: 1.14, y: 120, transformOrigin: "50% 50%", duration: 0.25 },
        0.1,
      );

    let compact = false;
    let lastY = window.scrollY;
    let raf = 0;
    const apply = (next: boolean) => {
      if (next === compact) return;
      compact = next;
      if (introTl?.isActive()) introTl.progress(1);
      if (isReducedMotion()) compactTl.progress(next ? 1 : 0).pause();
      else if (next) compactTl.play();
      else compactTl.reverse();
      root.dataset.compact = String(next);
    };
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const y = window.scrollY;
        const d = y - lastY;
        // Home intro: the logo flies into the header over the first 70% of a screen — stay full size.
        const floor = html.dataset.homeIntro === "play" ? window.innerHeight * 0.75 : 80;
        if (y <= floor) apply(false);
        else if (d > 8) apply(true);
        else if (d < -8) apply(false);
        if (Math.abs(d) > 8 || y <= floor) lastY = y;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    cleanup = () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
      introTl?.progress(1).kill();
      compactTl.kill();
    };
  });

  return () => {
    disposed = true;
    cleanup?.();
  };
}

function runFooter(root: HTMLElement) {
  const svg = root.querySelector("svg");
  if (!svg) return;
  let timer = 0;
  const pulse = () => {
    if (isReducedMotion() || document.hidden) return;
    svg.removeAttribute("data-pulse");
    // restart the CSS animation
    void (svg as unknown as HTMLElement).getBoundingClientRect();
    svg.setAttribute("data-pulse", "true");
    window.clearTimeout(timer);
    timer = window.setTimeout(() => svg.removeAttribute("data-pulse"), 950);
  };
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => e.isIntersecting && pulse()),
    { threshold: 0.5 },
  );
  io.observe(root);
  return () => {
    io.disconnect();
    window.clearTimeout(timer);
  };
}
