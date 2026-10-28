"use client";

/**
 * 01 — The moment (design 01/02-home "2. THE MOMENT", COPY_HOME §2, BUILD_DECISIONS row 16).
 *
 * Full motion: two pinned scenes.
 *  1. The title rises in word by word (track 2 screens tall; 1.8 on phones).
 *  2. Four worry lines type themselves out, one per photo, with a blinking caret, ticks and
 *     "1 of 4" (track 4.4 screens tall).
 * Reduced motion: the title, then the four photos with their lines as a static grid.
 * Screen readers always get the lines as a plain list; the animated scene is aria-hidden.
 */
import Image from "next/image";
import { useRef } from "react";
import { useMotionMode } from "@/lib/motionMode";
import { moment } from "@/content/copy/home";
import { clamp, isDesktop, trackProgress, useScrollScene } from "./scroll";

const N = moment.lines.length;

export function TheMoment() {
  const live = useMotionMode() === "full";
  const titleTrack = useRef<HTMLDivElement>(null);
  const titlePin = useRef<HTMLDivElement>(null);
  const linesTrack = useRef<HTMLDivElement>(null);
  const linesPin = useRef<HTMLDivElement>(null);

  useScrollScene(() => {
    const tt = titleTrack.current;
    const tp = titlePin.current;
    if (tt && tp) {
      const p = trackProgress(tt, tp);
      const rise = isDesktop() ? 36 : 28;
      tp.querySelectorAll<HTMLElement>("[data-w]").forEach((w) => {
        const k = Number(w.dataset.w);
        const t = clamp((p - 0.06 - k * 0.09) / 0.14);
        w.style.opacity = String(t);
        w.style.transform =
          `translateY(${(1 - t) * rise}px)` + (k === 5 ? ` scale(${0.82 + 0.18 * t})` : "");
      });
    }

    const lt = linesTrack.current;
    const lp = linesPin.current;
    if (lt && lp) {
      const p = trackProgress(lt, lp);
      const u = p * N;
      let idx = Math.min(N - 1, Math.floor(u));
      let local = u - idx;
      if (p >= 1) {
        idx = N - 1;
        local = 1;
      }
      lp.querySelectorAll<HTMLElement>("[data-img]").forEach((el, i) => {
        el.dataset.active = String(i === idx);
      });
      lp.querySelectorAll<HTMLElement>("[data-line]").forEach((el, i) => {
        const state = i < idx ? "past" : i === idx ? "current" : "future";
        if (el.dataset.state !== state) el.dataset.state = state;
        const span = el.firstElementChild as HTMLElement;
        const full = moment.lines[i].text;
        const n =
          state === "past"
            ? full.length
            : state === "current"
              ? Math.round(full.length * clamp(local / 0.55))
              : 0;
        const text = full.slice(0, n);
        if (span.textContent !== text) span.textContent = text;
      });
      lp.querySelectorAll<HTMLElement>("[data-tick]").forEach((el, i) => {
        el.dataset.on = String(i <= idx);
      });
      const count = lp.querySelector<HTMLElement>("[data-count]");
      if (count) count.textContent = `${idx + 1} of ${N}`;
    }
  }, live);

  return (
    <section id="the-moment" aria-labelledby="moment-title" className="bg-white">
      <div className="wrap">
        <a className="skip" href="#how-we-help">
          {moment.skip}
        </a>
      </div>
      <ol className="sr-only">
        {moment.lines.map((l) => (
          <li key={l.text}>{l.text}</li>
        ))}
      </ol>

      {/* Title — pinned and revealed word by word (live), or a plain heading (reduced) */}
      <div ref={titleTrack} className="relative live:h-[180svh] lg:live:h-[200svh]">
        <div
          ref={titlePin}
          className="wrap flex flex-col items-center gap-5 pt-[88px] text-center lg:gap-7 lg:pt-section-lg live:sticky live:top-0 live:h-svh live:justify-center live:pt-[72px] live:pb-[72px] lg:live:pt-[var(--header-h)] lg:live:pb-0"
        >
          <p className="eyebrow mw" data-w="0">
            {moment.eyebrow}
          </p>
          <h2 id="moment-title" className="flex flex-col items-center gap-1 text-plum-800 lg:gap-2">
            <span className="moment-lead">
              {moment.titleLead.map((word, i) => (
                <span key={word}>
                  <span className="mw" data-w={i + 1}>
                    {word}
                  </span>
                  {i < moment.titleLead.length - 1 ? " " : ""}
                </span>
              ))}
            </span>{" "}
            <span className="mw ff moment-big" data-w="5">
              {moment.titleBig.before} <span className="accent">{moment.titleBig.accent}</span>
            </span>
          </h2>
        </div>
      </div>

      {/* Live: the lines type themselves out beside their photo */}
      <div ref={linesTrack} aria-hidden="true" className="relative hidden h-[441svh] live:block">
        <div
          ref={linesPin}
          className="sticky top-0 flex h-svh flex-col justify-center lg:flex-row lg:items-center"
        >
          <div className="wrap flex flex-col gap-6 pt-[88px] pb-24 lg:grid lg:grid-cols-[auto_minmax(0,1fr)] lg:items-center lg:gap-14 lg:pt-[var(--header-h)] lg:pb-0">
            <div className="moment-img relative aspect-square flex-none overflow-hidden rounded-3xl bg-plum-100">
              {moment.lines.map((l, i) => (
                <Image
                  key={l.image}
                  src={l.image}
                  alt=""
                  width={1200}
                  height={1200}
                  sizes="(min-width: 64rem) 480px, 350px"
                  className="st-img"
                  data-img=""
                  data-active={i === 0 ? "true" : "false"}
                />
              ))}
            </div>
            <div className="flex flex-col gap-6 lg:gap-0">
              <div className="flex min-h-[150px] flex-col gap-3 lg:min-h-0 lg:gap-5">
                {moment.lines.map((l, i) => (
                  <p
                    key={l.text}
                    className="st-line"
                    data-line=""
                    data-state={i === 0 ? "current" : "future"}
                  >
                    <span />
                    <span className="caret" />
                  </p>
                ))}
              </div>
              <div className="flex items-center gap-2.5 lg:mt-6 lg:gap-4">
                {moment.lines.map((l, i) => (
                  <span
                    key={l.text}
                    className="tick"
                    data-tick=""
                    data-on={i === 0 ? "true" : "false"}
                  />
                ))}
                <span data-count="" className="sm ml-1.5 font-semibold text-muted lg:ml-2">
                  1 of {N}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reduced motion: the four photos and lines, still */}
      <div
        aria-hidden="true"
        className="wrap mt-14 grid gap-10 lg:mt-16 lg:grid-cols-2 lg:gap-12 live:hidden"
      >
        {moment.lines.map((l) => (
          <figure key={l.text} className="flex flex-col gap-5">
            <Image
              src={l.image}
              alt=""
              width={1200}
              height={1200}
              sizes="(min-width: 64rem) 640px, 100vw"
              className="aspect-[4/3] w-full rounded-3xl object-cover"
            />
            <p className="ff text-[2rem] leading-[1.1] text-plum-800">{l.text}</p>
          </figure>
        ))}
      </div>

      <div className="wrap pb-[88px] lg:pb-section-lg">
        <div className="mt-16 flex flex-col items-start gap-4 border-t border-line pt-12 lg:mt-18 lg:grid lg:grid-cols-[minmax(0,1fr)_400px] lg:items-end lg:gap-16 lg:pt-12 max-lg:live:mt-0">
          <p className="dl text-plum-800">{moment.resolution}</p>
          <div className="flex flex-col items-start gap-4">
            <p className="lead">{moment.followUp}</p>
            <a className="link" href="#how-we-help">
              {moment.link}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
