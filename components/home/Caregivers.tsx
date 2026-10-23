"use client";

/**
 * 07 — Our caregivers (design 01/02-home "8. OUR CAREGIVERS", COPY_HOME §8, BUILD_DECISIONS
 * row 25).
 *
 * The design's own carousel logic: drag/swipe with a rubber-band edge (a third of the overshoot),
 * snap to the nearest card on release (a 40px fling moves one card), arrows step one card,
 * "n of 6" announces politely. Tabbing into a card brings it into view.
 * Cards flip on hover (pointer devices) and with the "Why I do this" button; focus moves to
 * "Back to photo" and back again. Reduced motion: no flip and no slide animation — the quote
 * sits under the photo on every card.
 */
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { caregivers, type Caregiver } from "@/content/caregivers";
import { flags } from "@/content/site.config";
import { useMotionMode } from "@/lib/motionMode";
import { Tbc } from "@/components/ui/Tbc";

const TR = "transform 450ms cubic-bezier(0.22,1,0.36,1)";

const shown = caregivers.filter((c) => !c.placeholder || flags.showPlaceholders);

function Portrait({ c }: { c: Caregiver }) {
  return (
    <div
      role="img"
      aria-label={`${c.firstName}, a Dawson caregiver.`}
      className="flex h-[350px] flex-none items-center justify-center bg-plum-100 lg:h-[370px]"
    >
      <svg
        aria-hidden="true"
        focusable="false"
        viewBox="0 0 200 220"
        className="h-[200px] w-[180px] lg:h-[220px] lg:w-[200px]"
      >
        <g
          fill="none"
          stroke="var(--color-plum-800)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M40 104 L100 52 L160 104 V180 H40 Z" fill="var(--color-white)" />
          <path
            d="M100 160 C84 148 72 138 72 126 C72 116 80 110 88 110 C94 110 98 114 100 118 C102 114 106 110 112 110 C120 110 128 116 128 126 C128 138 116 148 100 160 Z"
            fill="var(--color-orchid-100)"
          />
          <path d="M20 180 H180" />
        </g>
      </svg>
    </div>
  );
}

function Facts({ c }: { c: Caregiver }) {
  return (
    <>
      {c.placeholder && <p className="sm muted">Caregiver portrait · 4:5</p>}
      <h3 className="h3 mt-1.5 lg:mt-2">{c.firstName}</h3>
      <p className="sm">
        {c.yearsWithDawson ?? <Tbc tbc={{ chip: "[Years]" }} />} years with Dawson
      </p>
      <p className="sm">{c.specialty ?? <Tbc tbc={{ chip: "[Specialty]" }} />}</p>
    </>
  );
}

function QuoteMark() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 48 40"
      className="h-[30px] w-9 lg:h-[34px] lg:w-10"
    >
      <path
        d="M4 38 V24 C4 12 10 5 20 2 L22 7 C15 10 12 15 12 20 H20 V38 Z M28 38 V24 C28 12 34 5 44 2 L46 7 C39 10 36 15 36 20 H44 V38 Z"
        fill="var(--color-orchid-500)"
      />
    </svg>
  );
}

function FlipCard({ c, onFocusCard }: { c: Caregiver; onFocusCard: () => void }) {
  const [flipped, setFlipped] = useState(false);
  const front = useRef<HTMLButtonElement>(null);
  const back = useRef<HTMLButtonElement>(null);
  const moved = useRef(false);
  useEffect(() => {
    if (!moved.current) return;
    (flipped ? back : front).current?.focus({ preventScroll: true });
  }, [flipped]);
  const flip = () => {
    moved.current = true;
    setFlipped((f) => !f);
  };
  return (
    <article className="cg" data-flipped={flipped} onFocus={onFocusCard}>
      <div className="cg-in">
        <div className="cg-face" inert={flipped}>
          <Portrait c={c} />
          <div className="flex flex-1 flex-col gap-1 px-5 pt-3.5 pb-5 lg:gap-1.5 lg:px-6 lg:pt-4 lg:pb-6">
            <Facts c={c} />
            <button
              ref={front}
              type="button"
              className="link sm mt-auto self-start"
              aria-pressed={flipped}
              onClick={flip}
            >
              Why I do this →
            </button>
          </div>
        </div>
        <div className="cg-face cg-back" inert={!flipped}>
          <div className="flex flex-1 flex-col gap-4 px-[22px] pt-8 pb-[22px] lg:gap-5 lg:px-7 lg:pt-10 lg:pb-7">
            <p className="eyebrow">Why I do this</p>
            <QuoteMark />
            <p className="q text-[1.25rem] leading-[1.45] text-plum-800 lg:text-[1.375rem]">
              &ldquo;{c.quote}&rdquo;
            </p>
            <p className="ff mt-auto text-[1.375rem] text-plum-800 lg:text-[1.5rem]">
              {c.firstName}
            </p>
            <button ref={back} type="button" className="btn btn-ghost self-start" onClick={flip}>
              Back to photo
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

function StillCard({ c, onFocusCard }: { c: Caregiver; onFocusCard: () => void }) {
  return (
    <article
      className="cg-still overflow-hidden rounded-[20px] border border-line bg-white"
      onFocus={onFocusCard}
    >
      <Portrait c={c} />
      <div className="flex flex-col gap-1 px-5 pt-3.5 pb-5 lg:gap-1.5 lg:px-6 lg:pt-4 lg:pb-6">
        <Facts c={c} />
        <div className="mt-3 flex flex-col gap-3 rounded-2xl bg-orchid-100 p-4">
          <p className="eyebrow">Why I do this</p>
          <p className="q text-plum-800">&ldquo;{c.quote}&rdquo;</p>
        </div>
      </div>
    </article>
  );
}

export function Caregivers() {
  const live = useMotionMode() === "full";
  const [slide, setSlide] = useState(0);
  const [max, setMax] = useState(shown.length - 1);
  const view = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const step = useRef(328);
  const maxOff = useRef(0);
  const moved = useRef(false);

  const measure = useCallback(() => {
    const v = view.current;
    const t = track.current;
    if (!v || !t || !t.children.length) return;
    const first = t.children[0] as HTMLElement;
    const gap = parseFloat(getComputedStyle(t).columnGap) || 0;
    step.current = first.offsetWidth + gap;
    const cs = getComputedStyle(v);
    const inner = v.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    maxOff.current = Math.max(0, t.scrollWidth - inner);
    setMax(Math.max(0, Math.ceil(maxOff.current / step.current - 0.01)));
  }, []);

  useEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (view.current) ro.observe(view.current);
    return () => ro.disconnect();
  }, [measure, live]);

  const offsetFor = (s: number) => Math.min(s * step.current, maxOff.current);
  const current = Math.min(slide, max);

  // Position the track whenever the slide (or layout) changes.
  useEffect(() => {
    const t = track.current;
    if (!t) return;
    t.style.transition = live ? TR : "none";
    t.style.transform = `translateX(${-offsetFor(current)}px)`;
  });

  // Latest values for the drag listeners below.
  const slideRef = useRef(current);
  const maxRef = useRef(max);
  const liveRef = useRef(live);
  useEffect(() => {
    slideRef.current = current;
    maxRef.current = max;
    liveRef.current = live;
  });

  // Drag / swipe — the design's bindDrag().
  useEffect(() => {
    const v = view.current;
    const t = track.current;
    if (!v || !t) return;
    let st: { x: number; y: number; base: number; id: number; active: boolean } | null = null;
    const down = (e: PointerEvent) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      st = {
        x: e.clientX,
        y: e.clientY,
        base: offsetFor(slideRef.current),
        id: e.pointerId,
        active: false,
      };
      moved.current = false;
    };
    const move = (e: PointerEvent) => {
      if (!st) return;
      const dx = e.clientX - st.x;
      const dy = e.clientY - st.y;
      if (!st.active) {
        if (Math.abs(dx) < 6) return;
        if (Math.abs(dy) > Math.abs(dx)) {
          st = null;
          return;
        }
        st.active = true;
        moved.current = true;
        try {
          v.setPointerCapture(st.id);
        } catch {}
        v.classList.add("dragging");
        t.style.transition = "none";
      }
      let off = st.base - dx;
      if (off < 0) off = off / 3;
      else if (off > maxOff.current) off = maxOff.current + (off - maxOff.current) / 3;
      t.style.transform = `translateX(${-off}px)`;
    };
    const end = (e: PointerEvent) => {
      if (!st) return;
      if (st.active) {
        const dx = e.clientX - st.x;
        const cur = Math.round(st.base / step.current);
        let target = Math.round((st.base - dx) / step.current);
        if (Math.abs(dx) > 40 && target === cur) target += dx < 0 ? 1 : -1;
        target = Math.max(0, Math.min(maxRef.current, target));
        v.classList.remove("dragging");
        try {
          v.releasePointerCapture(st.id);
        } catch {}
        t.style.transition = liveRef.current ? TR : "none";
        t.style.transform = `translateX(${-offsetFor(target)}px)`;
        setSlide(target);
      }
      st = null;
    };
    const click = (e: MouseEvent) => {
      if (moved.current) {
        e.preventDefault();
        e.stopPropagation();
        moved.current = false;
      }
    };
    const nodrag = (e: DragEvent) => e.preventDefault();
    v.addEventListener("pointerdown", down);
    v.addEventListener("pointermove", move);
    v.addEventListener("pointerup", end);
    v.addEventListener("pointercancel", end);
    v.addEventListener("click", click, true);
    v.addEventListener("dragstart", nodrag);
    return () => {
      v.removeEventListener("pointerdown", down);
      v.removeEventListener("pointermove", move);
      v.removeEventListener("pointerup", end);
      v.removeEventListener("pointercancel", end);
      v.removeEventListener("click", click, true);
      v.removeEventListener("dragstart", nodrag);
    };
  }, []);

  /** Keyboard: a card that receives focus is brought into view. */
  const focusCard = (i: number) => {
    const t = track.current;
    const v = view.current;
    if (!t || !v) return;
    v.scrollLeft = 0; // the browser may scroll the overflow box itself — undo it
    const card = t.children[i] as HTMLElement | undefined;
    if (!card) return;
    const off = offsetFor(current);
    const left = card.offsetLeft - off;
    const cs = getComputedStyle(v);
    const inner = v.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    if (left < 0 || left + card.offsetWidth > inner) setSlide(Math.min(i, max));
  };

  const pos = `${current + 1} of ${shown.length}`;
  const arrows = (
    <>
      <button
        type="button"
        className="iconbtn"
        aria-label="Previous caregiver"
        aria-disabled={current === 0}
        onClick={() => current > 0 && setSlide(current - 1)}
      >
        <ChevronLeft aria-hidden size={22} strokeWidth={1.75} />
      </button>
      <p className="sm min-w-14 text-center font-semibold text-plum-800" aria-live="polite">
        {pos}
      </p>
      <button
        type="button"
        className="iconbtn"
        aria-label="Next caregiver"
        aria-disabled={current >= max}
        onClick={() => current < max && setSlide(current + 1)}
      >
        <ChevronRight aria-hidden size={22} strokeWidth={1.75} />
      </button>
    </>
  );

  return (
    <section aria-labelledby="caregivers-title" className="bg-white py-[88px] lg:py-32">
      <div className="wrap">
        <div className="grid items-end gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-16">
          <div className="flex flex-col gap-3 lg:gap-4">
            <p className="eyebrow">07 — Our caregivers</p>
            <h2 id="caregivers-title" className="h2">
              Meet the people who do the caring.
            </h2>
            <p className="lead max-w-[640px]">
              Experienced caregivers — including Certified Nursing Assistants — with a real love for
              this work.
            </p>
          </div>
          {shown.length > 0 && (
            <div className="flex flex-col gap-3 lg:items-end">
              <p className="sm muted">Drag, swipe or use the arrows to see more.</p>
              <div className="hidden items-center gap-4 lg:flex">{arrows}</div>
            </div>
          )}
        </div>
      </div>
      {shown.length > 0 && (
        <>
          <div className="wrap max-lg:!px-0">
            <div
              ref={view}
              role="region"
              aria-label="Our caregivers"
              className="cg-view mt-6 overflow-hidden px-[var(--gutter)] py-2 lg:mt-12 lg:px-0"
              data-cursor=""
              data-cursor-label="Drag"
            >
              <div ref={track} className="flex gap-4 lg:gap-8">
                {shown.map((c, i) =>
                  live ? (
                    <FlipCard key={c.id} c={c} onFocusCard={() => focusCard(i)} />
                  ) : (
                    <StillCard key={c.id} c={c} onFocusCard={() => focusCard(i)} />
                  ),
                )}
              </div>
            </div>
          </div>
          <div className="wrap mt-5 flex items-center justify-between lg:hidden">{arrows}</div>
        </>
      )}
      <div className="wrap mt-6 flex flex-col gap-1 lg:mt-12 lg:flex-row lg:items-center lg:gap-8">
        <Link className="btn btn-ghost max-lg:w-full" href="/about#caregivers">
          Meet the team
        </Link>
        <Link className="link sm max-lg:self-center" href="/careers">
          Want to join them? See caregiver jobs
        </Link>
      </div>
    </section>
  );
}
