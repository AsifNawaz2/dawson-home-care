"use client";

/**
 * Page transitions (07 §19, SPEC §9): a cream curtain with a heartbeat sweep between routes.
 * Navigation starts at the beginning of the cover, so the curtain never adds waiting time.
 * Best case ≈ 480 ms. Slow routes hold with the stacked logo. Focus lands on the new H1.
 * Reduced motion: no curtain at all — instant navigation, H1 still focused.
 */
import { usePathname, useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { isReducedMotion } from "@/lib/motionMode";

type Phase = "idle" | "covering" | "holding" | "revealing";
const NavCtx = createContext<{ navigate: (href: string) => void }>({ navigate: () => {} });
export const usePageTransition = () => useContext(NavCtx);

const COVER_MS = 380; // curtain 220 ms + heartbeat sweep finishing at 380 ms
const REVEAL_MS = 260;
const HOLD_AFTER_MS = 600;
const FAILSAFE_MS = 8000;

function emit(detail: "start" | "end") {
  window.dispatchEvent(new CustomEvent("dd:transition", { detail }));
}

/** Focus the visible H1 of the new page (or the hash target). */
function focusNewPage() {
  const hash = window.location.hash.slice(1);
  let target: HTMLElement | null = hash ? document.getElementById(decodeURIComponent(hash)) : null;
  if (!target) {
    target =
      Array.from(document.querySelectorAll<HTMLElement>("#main h1")).find(
        (h) => h.offsetParent !== null,
      ) ?? null;
  }
  if (!target) return;
  if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
  target.focus({ preventScroll: true });
}

export function PageTransitionProvider({
  children,
  holdLogo,
}: {
  children: React.ReactNode;
  holdLogo: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [phase, setPhase] = useState<Phase>("idle");
  const pending = useRef<{ path: string; coverDone: boolean; ready: boolean } | null>(null);
  const timers = useRef<number[]>([]);

  const clearTimers = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  };
  const later = (fn: () => void, ms: number) => timers.current.push(window.setTimeout(fn, ms));

  const finish = useCallback(() => {
    clearTimers();
    pending.current = null;
    setPhase("revealing");
    later(() => {
      setPhase("idle");
      focusNewPage();
      emit("end");
    }, REVEAL_MS);
  }, []);

  const maybeReveal = useCallback(() => {
    const p = pending.current;
    if (p && p.coverDone && p.ready) finish();
  }, [finish]);

  const navigate = useCallback(
    (href: string) => {
      const url = new URL(href, window.location.href);
      if (isReducedMotion() || url.pathname === window.location.pathname) {
        router.push(href);
        return;
      }
      clearTimers();
      pending.current = { path: url.pathname, coverDone: false, ready: false };
      setPhase("covering");
      emit("start");
      router.push(href, { scroll: false });
      later(() => {
        if (!pending.current) return;
        pending.current.coverDone = true;
        maybeReveal();
        later(() => pending.current && setPhase("holding"), HOLD_AFTER_MS);
      }, COVER_MS);
      later(finish, FAILSAFE_MS);
    },
    [router, maybeReveal, finish],
  );

  // Route ready: the new pathname has rendered under the curtain.
  useEffect(() => {
    const p = pending.current;
    if (!p) {
      // Navigation without the curtain (reduced motion, back/forward): keep focus rules.
      return;
    }
    if (pathname === p.path) {
      const hash = window.location.hash.slice(1);
      const el = hash ? document.getElementById(decodeURIComponent(hash)) : null;
      if (el) el.scrollIntoView();
      else window.scrollTo(0, 0);
      p.ready = true;
      maybeReveal();
    }
  }, [pathname, maybeReveal]);

  // Intercept same-origin link clicks (capture phase, before next/link handles them).
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)
        return;
      const a = (e.target as Element | null)?.closest?.("a");
      if (!a || !(a instanceof HTMLAnchorElement) || !a.href) return;
      if (a.target && a.target !== "_self") return;
      if (a.hasAttribute("download") || a.dataset.transition === "none") return;
      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname) return; // hash/query changes: no curtain
      if (isReducedMotion()) return; // let next/link navigate instantly
      if (pending.current) {
        e.preventDefault();
        return; // ignore double clicks while covering
      }
      e.preventDefault();
      navigate(url.pathname + url.search + url.hash);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [navigate]);

  // Reduced-motion navigations still move focus to the new H1.
  const lastPath = useRef(pathname);
  useEffect(() => {
    if (lastPath.current === pathname) return;
    lastPath.current = pathname;
    if (!pending.current && isReducedMotion()) requestAnimationFrame(focusNewPage);
  }, [pathname]);

  useEffect(() => () => clearTimers(), []);

  // The page is busy while the curtain is up.
  useEffect(() => {
    const main = document.getElementById("main");
    if (!main) return;
    if (phase === "idle") main.removeAttribute("aria-busy");
    else main.setAttribute("aria-busy", "true");
  }, [phase]);

  return (
    <NavCtx.Provider value={{ navigate }}>
      {children}
      <div className="dd-curtain" data-phase={phase} aria-hidden="true">
        <svg className="dd-curtain__beat" viewBox="0 0 600 80" preserveAspectRatio="none">
          <path
            d="M0 40 H250 L262 30 L272 40 H284 L302 6 L322 74 L338 24 L348 40 H600"
            pathLength={1}
            fill="none"
            strokeWidth={3}
            strokeLinejoin="round"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        <div className="dd-curtain__logo">{holdLogo}</div>
      </div>
    </NavCtx.Provider>
  );
}
