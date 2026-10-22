"use client";

/**
 * Interactive cursor ring (BRAND_FINAL §4, design 01-interaction-states).
 * The native cursor always stays visible; this ring trails it and labels what a click will do.
 * Mounted only for a fine, hovering pointer with motion allowed and normal contrast.
 */
import { useEffect, useRef, useSyncExternalStore } from "react";
import { useHighContrast, useMotionMode } from "@/lib/motionMode";

export const INTERACTIVE = [
  "a[href]",
  "button",
  "summary",
  "select",
  "label[for]",
  '[role="button"]',
  '[role="link"]',
  '[role="tab"]',
  '[role="option"]',
  '[role="menuitem"]',
  '[role="switch"]',
  '[role="checkbox"]',
  '[role="radio"]',
  'input[type="submit"]',
  'input[type="button"]',
  'input[type="reset"]',
  'input[type="checkbox"]',
  'input[type="radio"]',
  'input[type="range"]',
  '[data-cursor]:not([data-cursor="none"])',
].join(",");

export const TEXT = [
  "input:not([type])",
  'input[type="text"]',
  'input[type="email"]',
  'input[type="tel"]',
  'input[type="search"]',
  'input[type="number"]',
  'input[type="url"]',
  'input[type="password"]',
  "textarea",
  '[contenteditable=""]',
  '[contenteditable="true"]',
].join(",");

export const DISABLED = ':disabled, [aria-disabled="true"]';

export type CursorState = "none" | "disabled" | "text" | "label" | "interactive" | "idle";

/** Precedence from BRAND_FINAL §4.3 — first match wins. */
export function resolveCursorState(t: Element | null) {
  if (!t || !t.closest) return { state: "idle" as CursorState, theme: "light", label: "" };
  const theme = t.closest('[data-cursor-theme="dark"]') ? "dark" : "light";
  if (t.closest('[data-cursor="none"]')) return { state: "none" as CursorState, theme, label: "" };
  const interactive = t.closest(INTERACTIVE);
  if (interactive?.matches(DISABLED)) return { state: "disabled" as CursorState, theme, label: "" };
  if (t.closest(TEXT)) return { state: "text" as CursorState, theme, label: "" };
  const labelled = t.closest("[data-cursor-label]");
  if (labelled) {
    return {
      state: "label" as CursorState,
      theme,
      label: labelled.getAttribute("data-cursor-label") ?? "",
    };
  }
  if (interactive) return { state: "interactive" as CursorState, theme, label: "" };
  return { state: "idle" as CursorState, theme, label: "" };
}

function subscribePointer(cb: () => void) {
  const mq = window.matchMedia("(pointer: fine) and (hover: hover)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}
const finePointer = () => window.matchMedia("(pointer: fine) and (hover: hover)").matches;

export function CursorRing() {
  const motion = useMotionMode();
  const highContrast = useHighContrast();
  const fine = useSyncExternalStore(subscribePointer, finePointer, () => false);
  if (!fine || motion !== "full" || highContrast) return null;
  return <Ring />;
}

function Ring() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const label = el.querySelector<HTMLSpanElement>(".cursor-ring__label")!;
    let x = 0,
      y = 0,
      rx = 0,
      ry = 0,
      seen = false,
      raf = 0,
      last = 0,
      lastT: Element | null = null;

    const set = (k: string, v: string) => el.getAttribute(k) !== v && el.setAttribute(k, v);
    const apply = (t: Element | null) => {
      const r = resolveCursorState(t);
      set("data-state", r.state === "disabled" ? "idle" : r.state);
      set("data-theme", r.theme);
      if (label.textContent !== r.label) label.textContent = r.label;
    };
    const tick = (now: number) => {
      const dt = last ? Math.min(64, now - last) : 16.667;
      last = now;
      const k = 1 - Math.pow(1 - 0.15, dt / 16.667); // frame-rate independent lerp
      rx += (x - rx) * k;
      ry += (y - ry) * k;
      el.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      if (Math.abs(x - rx) < 0.1 && Math.abs(y - ry) < 0.1) {
        raf = 0;
        last = 0;
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    const start = () => {
      if (!raf) {
        last = 0;
        raf = requestAnimationFrame(tick);
      }
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      x = e.clientX;
      y = e.clientY;
      if (!seen) {
        rx = x;
        ry = y;
        seen = true;
      }
      set("data-visible", "true");
      start();
    };
    const onOver = (e: PointerEvent) => {
      if (e.target !== lastT) {
        lastT = e.target as Element;
        apply(lastT);
      }
    };
    const onDown = (e: PointerEvent) => {
      if (e.pointerType === "touch") return set("data-visible", "false");
      if (e.button === 0) set("data-pressed", "true");
    };
    const onUp = () => set("data-pressed", "false");
    const onOut = (e: PointerEvent) => {
      if (!e.relatedTarget) set("data-visible", "false");
    };
    const onLeave = () => set("data-visible", "false");
    const reresolve = () => {
      if (!seen) return;
      lastT = document.elementFromPoint(x, y);
      apply(lastT);
    };
    let scrollRaf = 0;
    const onScroll = () => {
      if (scrollRaf) return;
      scrollRaf = requestAnimationFrame(() => {
        scrollRaf = 0;
        reresolve();
      });
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Tab" || e.key.startsWith("Arrow")) set("data-visible", "false");
    };
    const onVis = () => {
      if (document.hidden && raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };
    const onTransition = (e: Event) => {
      const phase = (e as CustomEvent<string>).detail;
      if (phase === "start") set("data-visible", "false");
      else reresolve();
    };

    const opt = { passive: true } as const;
    document.addEventListener("pointermove", onMove, opt);
    document.addEventListener("pointerover", onOver, opt);
    document.addEventListener("pointerdown", onDown, opt);
    document.addEventListener("pointerup", onUp, opt);
    document.addEventListener("pointercancel", onUp, opt);
    document.addEventListener("pointerout", onOut, opt);
    document.documentElement.addEventListener("pointerleave", onLeave, opt);
    document.addEventListener("keydown", onKey, opt);
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("scroll", onScroll, { passive: true, capture: true });
    window.addEventListener("dd:transition", onTransition);
    return () => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointercancel", onUp);
      document.removeEventListener("pointerout", onOut);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("scroll", onScroll, { capture: true });
      window.removeEventListener("dd:transition", onTransition);
      cancelAnimationFrame(raf);
      cancelAnimationFrame(scrollRaf);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="cursor-ring"
      aria-hidden="true"
      data-state="idle"
      data-theme="light"
      data-visible="false"
      data-pressed="false"
    >
      <div className="cursor-ring__circle">
        <span className="cursor-ring__label" />
      </div>
    </div>
  );
}
