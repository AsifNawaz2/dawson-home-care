"use client";

/**
 * Home intro (design 01/02-home "INTRO ANIMATION", BUILD_DECISIONS row 10 + answer 9).
 *
 * First Home landing in a browser session (decided pre-paint in lib/headScript.ts):
 *  1. The logo video plays full screen; scrolling is locked until it ends (14 s cap).
 *     Wheel/touch — and Space, Page Down, ↓, End — fast-forward it 8×. Esc or "Skip intro" ends it.
 *  2. Then a "Scroll" hint appears. Scrolling flies the video's last-frame logo into the header
 *     (first 70% of a screen, 60% on phones) while the header, phone bar and comfort button fade
 *     in. Near the end the raster logo cross-fades into the SVG header logo.
 * Reduced motion: html[data-home-intro="still"] shows the end frame as a still image, no lock.
 * Later Home visits that session: no intro (the section stays display: none).
 */
import Image from "next/image";
import { useEffect, useRef } from "react";
import { useMotionMode, isReducedMotion } from "@/lib/motionMode";
import { clamp, ease, isDesktop, lerp } from "./scroll";

const FAST_KEYS = new Set([" ", "Spacebar", "PageDown", "ArrowDown", "End"]);
let pendingCleanup = 0;

export function HomeIntro() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const flyRef = useRef<HTMLImageElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const endedRef = useRef(false);
  const forcedRef = useRef(false);
  const skipRef = useRef<() => void>(() => {});
  const motion = useMotionMode();

  useEffect(() => {
    const html = document.documentElement;
    // StrictMode / motion changes re-run this effect: cancel the "left Home" cleanup.
    window.clearTimeout(pendingCleanup);
    const section = sectionRef.current;
    const video = videoRef.current;
    const fly = flyRef.current;
    const hint = hintRef.current;
    if (html.dataset.homeIntro !== "play" || !section || !video || !fly || !hint) return;

    const vars = ["--hi-header", "--hi-logo", "--hi-bar"] as const;
    const resetChrome = () => {
      vars.forEach((v) => html.style.removeProperty(v));
      delete html.dataset.hiChrome;
      delete html.dataset.hiLock;
      html.style.overflow = "";
      document.body.style.overflow = "";
    };

    if (isReducedMotion()) {
      endedRef.current = true;
      video.pause();
      resetChrome();
      html.dataset.homeIntro = "still";
      return;
    }

    const headerLogo = document.querySelector<HTMLElement>('[data-logo-motion="header"]');
    let fast = false;
    let raf = 0;
    let endTimer = 0;

    const lock = (on: boolean) => {
      html.style.overflow = on ? "hidden" : "";
      document.body.style.overflow = on ? "hidden" : "";
      if (on) html.dataset.hiLock = "";
      else delete html.dataset.hiLock;
    };

    const update = () => {
      const y = window.scrollY;
      const vh = window.innerHeight;
      const ended = endedRef.current;
      const p = ended ? clamp(y / (vh * (isDesktop() ? 0.7 : 0.6))) : 0;
      const e = ease(p);

      // Start: where the logo sits in the video's last frame (1920 × 1080, object-fit: contain).
      const vr = video.getBoundingClientRect();
      const s = Math.min(vr.width / 1920, vr.height / 1080);
      const sL = vr.left + (vr.width - 1920 * s) / 2 + 42 * s;
      const sT = vr.top + (vr.height - 1080 * s) / 2 + 36 * s;
      const sW = 1837 * s;
      // End: the SVG logo in the header.
      const r = headerLogo?.getBoundingClientRect();
      const eL = r?.left ?? 20;
      const eT = r?.top ?? 8;
      const eW = r?.width || 169;
      fly.style.width = `${lerp(sW, eW, e)}px`;
      fly.style.transform = `translate3d(${lerp(sL, eL, e)}px,${lerp(sT, eT, e)}px,0)`;

      const forced = forcedRef.current;
      const swap = clamp((p - 0.85) / 0.15);
      const flying = ended && p > 0.001 && p < 0.999 && !forced;
      fly.style.opacity = flying ? String(1 - swap) : "0";
      video.style.opacity = ended && p > 0.001 ? "0" : "1";

      const ho = forced ? 1 : clamp((p - 0.55) / 0.45);
      const bo = forced ? 1 : clamp((p - 0.7) / 0.3);
      const lo = forced ? 1 : ended ? swap : 0;
      html.style.setProperty("--hi-header", String(ho));
      html.style.setProperty("--hi-logo", String(lo));
      html.style.setProperty("--hi-bar", String(bo));
      html.dataset.hiChrome = ho > 0.6 ? "on" : "off";
      hint.style.opacity = ended ? String(1 - clamp(p / 0.08)) : "0";
    };
    const schedule = () => {
      if (!raf) {
        raf = requestAnimationFrame(() => {
          raf = 0;
          update();
        });
      }
    };

    const toEnd = () => {
      try {
        video.pause();
        if (video.duration) video.currentTime = video.duration;
      } catch {}
    };
    const finish = () => {
      if (endedRef.current) return;
      endedRef.current = true;
      window.clearTimeout(endTimer);
      if (!video.ended) toEnd();
      lock(false);
      update();
    };
    const fastForward = () => {
      if (endedRef.current || fast) return;
      fast = true;
      video.playbackRate = 8;
      if (video.paused) video.play().catch(finish);
    };
    skipRef.current = () => {
      finish();
      window.scrollTo({ top: section.offsetHeight, behavior: "instant" });
      document.getElementById("hero-title")?.focus({ preventScroll: true });
    };

    const onKey = (ev: KeyboardEvent) => {
      if (endedRef.current || ev.altKey || ev.ctrlKey || ev.metaKey) return;
      if (FAST_KEYS.has(ev.key)) fastForward();
      else if (ev.key === "Escape") finish();
    };
    // Keyboard users who Tab into the (still invisible) header see it straight away.
    const revealIfFocused = (t: Element | null) => {
      if (html.dataset.hiChrome === "on" || forcedRef.current) return;
      if (t?.closest?.("[data-site-header],[data-mobile-bar],[data-comfort]")) {
        forcedRef.current = true;
        update();
      }
    };
    const onFocus = (ev: FocusEvent) => revealIfFocused(ev.target as Element | null);

    video.muted = true;
    video.addEventListener("ended", finish);
    video.addEventListener("error", finish);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    window.addEventListener("wheel", fastForward, { passive: true });
    window.addEventListener("touchmove", fastForward, { passive: true });
    window.addEventListener("keydown", onKey);
    document.addEventListener("focusin", onFocus);

    if (endedRef.current || video.ended || window.scrollY > 10) {
      // Already over (or the browser restored a scroll position): show the end state.
      endedRef.current = true;
      if (video.readyState >= 1) toEnd();
      else video.addEventListener("loadedmetadata", toEnd, { once: true });
      lock(false);
    } else {
      lock(true);
      endTimer = window.setTimeout(finish, 14000);
      // The head script usually started it already; if autoplay is blocked, end at once.
      if (video.paused) video.play().catch(finish);
    }
    update();
    revealIfFocused(document.activeElement); // Tab may have reached the header before hydration

    return () => {
      video.removeEventListener("ended", finish);
      video.removeEventListener("error", finish);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("wheel", fastForward);
      window.removeEventListener("touchmove", fastForward);
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("focusin", onFocus);
      cancelAnimationFrame(raf);
      window.clearTimeout(endTimer);
      lock(false);
      // Leaving Home: drop the intro mode so other pages get the normal sticky header.
      pendingCleanup = window.setTimeout(() => {
        resetChrome();
        delete html.dataset.homeIntro;
      }, 0);
    };
  }, [motion]);

  return (
    <>
      <section
        ref={sectionRef}
        aria-label="Dawson & Dawson Home Care"
        className="home-intro relative overflow-hidden bg-white"
      >
        <div className="absolute top-4 left-4 z-10">
          <button type="button" className="skip" onClick={() => skipRef.current()}>
            Skip intro
          </button>
        </div>
        <video
          ref={videoRef}
          id="home-intro-video"
          src="/videos/intro-animation.mp4"
          poster="/images/intro-end-frame.jpg"
          muted
          playsInline
          preload="none"
          aria-hidden="true"
          tabIndex={-1}
          className="absolute inset-0 size-full bg-white object-contain"
        />
        <Image
          src="/images/intro-end-frame.jpg"
          alt=""
          fill
          sizes="100vw"
          className="intro-still bg-white object-contain"
        />
        <div
          ref={hintRef}
          aria-hidden="true"
          className="intro-hint absolute inset-x-0 bottom-14 flex flex-col items-center gap-1.5 text-eyebrow font-semibold tracking-[0.14em] text-plum-800 uppercase lg:bottom-8 lg:gap-2"
        >
          <span className="mouse hidden lg:block" />
          <span>Scroll</span>
          <svg
            className="hint-arrow hidden text-orchid-700 lg:block"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
          <svg
            className="chev text-orchid-700 lg:hidden"
            width="24"
            height="36"
            viewBox="0 0 24 36"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m6 6 6 6 6-6" />
            <path d="m6 18 6 6 6-6" />
          </svg>
        </div>
      </section>
      {/* The video's last-frame logo, flown into the header (design data-el="fly-logo"). */}
      <Image
        ref={flyRef}
        src="/images/logo.png"
        alt=""
        aria-hidden="true"
        width={1837}
        height={1002}
        sizes="100vw"
        className="fly-logo pointer-events-none fixed top-0 left-0 z-[110] h-auto w-[400px] max-w-none opacity-0 will-change-[transform,width,opacity]"
      />
    </>
  );
}
