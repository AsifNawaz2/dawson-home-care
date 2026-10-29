"use client";

/**
 * Home header buttons travel (BUILD_DECISIONS §I.4, desktop from 1280px).
 *
 * Top of Home: the "Get a Free Assessment" + Call pair sits under the hero image and the header
 * links sit as one compact group centred in the bar. Over the last 300px of scroll before the
 * pair would reach the header, the same pair travels up and right into the header's dock,
 * shrinking to header size, while the link group slides left as one block to its docked place
 * beside the logo (§I.5); both finish together. Scrolling up plays it back. GSAP ScrollTrigger
 * with `scrub: true`, so the journey follows the scrollbar exactly.
 *
 * Two copies of the pair exist (hero + header, components/layout/HeaderCtas.tsx) but only one is
 * visible or focusable at a time: the hero copy until the journey starts, then the header copy,
 * placed on the very same pixels at the hand-over. Focus follows the hand-over.
 * Reduced motion: no journey — the pair switches place at the halfway point.
 * Larger Comfort text: the header keeps Call only (§I.3), so the green button fades on the way.
 * Server render, phones, tablets, other pages: no change (the CSS keeps the static layout).
 */
import { useEffect } from "react";
import { useMotionMode } from "@/lib/motionMode";
import { clamp, ease, lerp } from "./scroll";

/** Scroll distance of the journey (px). It ends when the pair's hero spot reaches the header. */
const TRAVEL = 300;
/** The pair finishes moving right before it rises into the bar; the links slide all the way. */
const X_END = 0.6;

type Metrics = {
  start: number;
  end: number;
  scale: number;
  slotCx: number;
  slotCyDoc: number;
  dockCx: number;
  dockCy: number;
  shift: number;
};

export function CtaTravel() {
  const motion = useMotionMode();

  useEffect(() => {
    const html = document.documentElement;
    const header = document.querySelector<HTMLElement>("[data-site-header][data-home-cta]");
    const slot = document.querySelector<HTMLElement>("[data-cta-slot]");
    const bar = header?.querySelector<HTMLElement>("[data-cta-bar]");
    const nav = header?.querySelector<HTMLElement>("[data-cta-nav]");
    const dock = header?.querySelector<HTMLElement>("[data-cta-dock]");
    const pair = dock?.querySelector<HTMLElement>('[data-cta-pair="header"]');
    const heroPair = slot?.querySelector<HTMLElement>('[data-cta-pair="hero"]');
    const assess = pair?.querySelector<HTMLElement>("[data-cta-assess] a");
    if (!header || !slot || !bar || !nav || !dock || !pair || !heroPair || !assess) return;
    const reduced = motion === "reduced";

    let disposed = false;
    let cleanup: (() => void) | undefined;

    Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(
      ([{ gsap }, { ScrollTrigger }]) => {
        if (disposed) return;
        gsap.registerPlugin(ScrollTrigger);
        const mm = gsap.matchMedia();

        mm.add("(min-width: 80rem)", () => {
          const m: Metrics = {
            start: 0,
            end: 1,
            scale: 1,
            slotCx: 0,
            slotCyDoc: 0,
            dockCx: 0,
            dockCy: 0,
            shift: 0,
          };
          let sig = "";

          // Layout positions only (offset*, untransformed rects), so transforms never feed back.
          const measure = () => {
            const y = window.scrollY;
            const hero = heroPair.getBoundingClientRect(); // scaled about its centre
            const headTop = header.getBoundingClientRect().top;
            m.scale = new DOMMatrix(getComputedStyle(heroPair).transform).a || 1;
            m.slotCx = hero.left + hero.width / 2;
            m.slotCyDoc = hero.top + hero.height / 2 + y;
            const dockBox = dock.getBoundingClientRect(); // the dock itself never moves
            m.dockCx = dockBox.left + dockBox.width / 2;
            // Docked = the header stuck at the top of the screen.
            m.dockCy = dockBox.top - headTop + pair.offsetTop + pair.offsetHeight / 2;
            m.end = Math.max(1, hero.top + y - header.offsetHeight);
            m.start = Math.max(0, m.end - TRAVEL);
            const centred = nav.offsetLeft;
            header.setAttribute("data-cta-measure", "");
            m.shift = nav.offsetLeft - centred;
            header.removeAttribute("data-cta-measure");
            // The logo compacts as the journey starts (LogoMotion reads this floor).
            html.dataset.ctaStart = String(Math.round(m.start));
            sig = signature();
          };
          const signature = () => {
            const r = heroPair.getBoundingClientRect();
            return [
              r.top + window.scrollY,
              r.left,
              r.width,
              bar.offsetWidth,
              nav.offsetWidth,
            ].join();
          };

          const setPair = gsap.quickSetter(pair, "css");
          const setNav = gsap.quickSetter(nav, "x", "px");
          let docked: boolean | null = null;
          let assessAlpha = -1;

          const handOver = (next: boolean) => {
            const from = next ? heroPair : pair;
            const to = next ? pair : heroPair;
            const active = document.activeElement;
            const idx = active
              ? Array.from(from.querySelectorAll("a")).indexOf(active as never)
              : -1;
            header.toggleAttribute("data-cta-docked", next);
            slot.toggleAttribute("data-cta-away", next);
            if (idx >= 0) to.querySelectorAll("a")[idx]?.focus({ preventScroll: true });
          };

          const render = (p: number) => {
            const q = reduced ? (p >= 0.5 ? 1 : 0) : p;
            const eY = ease(q);
            const eX = ease(clamp(q / X_END));
            // From the hero spot (which keeps scrolling with the page) to the dock.
            const cx = lerp(m.slotCx, m.dockCx, eX);
            const cy = lerp(m.slotCyDoc - window.scrollY, m.dockCy, eY);
            setPair({ x: cx - m.dockCx, y: cy - m.dockCy, scale: lerp(m.scale, 1, eY) });
            // Centred → beside the logo, landing with the pair; eased out so the links are
            // already clear of the dock when the pair rises into the bar.
            setNav(m.shift * (1 - Math.pow(1 - q, 3)));
            const a = html.dataset.textScale ? 1 - clamp(q / 0.5) : 1;
            if (a !== assessAlpha) {
              assessAlpha = a;
              gsap.set(assess, { autoAlpha: a });
            }
            if (q > 0 !== docked) {
              docked = q > 0;
              handOver(docked);
            }
          };

          const proxy = { p: 0 };
          const journey = gsap.to(proxy, {
            p: 1,
            ease: "none",
            paused: true,
            onUpdate: () => render(proxy.p),
          });
          const st = ScrollTrigger.create({
            start: () => {
              measure();
              return m.start;
            },
            end: () => m.end,
            scrub: true,
            animation: journey,
            onRefresh: (self) => render(self.progress),
          });
          render(st.progress);

          // Re-measure when anything above or in the bar changes size (fonts, Comfort text,
          // the intro, page transitions). Cheap check first: refresh only if the spots moved.
          let raf = 0;
          const check = () => {
            raf = 0;
            if (signature() !== sig) ScrollTrigger.refresh();
          };
          const schedule = () => {
            if (!raf) raf = requestAnimationFrame(check);
          };
          const ro = new ResizeObserver(schedule);
          ro.observe(document.body);
          ro.observe(bar);
          window.addEventListener("dd:transition", schedule);
          document.fonts?.ready.then(schedule);

          return () => {
            ro.disconnect();
            cancelAnimationFrame(raf);
            window.removeEventListener("dd:transition", schedule);
            st.kill();
            journey.kill();
            gsap.set([pair, nav], { clearProps: "transform" });
            gsap.set(assess, { clearProps: "opacity,visibility" });
            header.removeAttribute("data-cta-docked");
            slot.removeAttribute("data-cta-away");
            delete html.dataset.ctaStart;
          };
        });

        cleanup = () => mm.revert();
      },
    );

    return () => {
      disposed = true;
      cleanup?.();
    };
  }, [motion]);

  return null;
}
