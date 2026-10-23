"use client";

/**
 * 03 — A day with Dawson (design 03 "A DAY WITH DAWSON", COPY_SERVICES §0).
 * Full motion: as the list scrolls past 55% of the screen, the glowing line fills, each step
 * lights up, and the sticky sky card moves the sun (or moon) along its arc to that step's time.
 * Reduced motion: every step shown, line full, sky resting on the first step. The list is always
 * a plain ordered list for screen readers; the sky card is decorative.
 */
import { useRef, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { flags } from "@/content/site.config";
import type { ServicePage } from "@/content/services";
import { useMotionMode } from "@/lib/motionMode";
import { useScrollScene } from "@/components/home/scroll";
import { Tbc } from "@/components/ui/Tbc";
import { cn } from "@/lib/cn";

export function DayTimeline({ page }: { page: ServicePage }) {
  const { day } = page;
  const live = useMotionMode() === "full";
  const [cur, setCur] = useState(0);
  const list = useRef<HTMLOListElement>(null);
  const fill = useRef<HTMLSpanElement>(null);

  useScrollScene(
    () => {
      const l = list.current;
      const f = fill.current;
      if (!l || !f) return;
      const steps = Array.from(l.querySelectorAll<HTMLElement>("[data-step]"));
      const lr = l.getBoundingClientRect();
      const last = steps[steps.length - 1];
      const span = last ? last.getBoundingClientRect().top - lr.top : lr.height;
      const line = window.innerHeight * 0.55;
      let idx = -1;
      steps.forEach((s, i) => {
        if (s.getBoundingClientRect().top + 36 <= line) idx = i;
      });
      f.style.height = `${Math.max(0, Math.min(span, line - lr.top - 44))}px`;
      setCur(idx);
    },
    live,
    () => {
      if (fill.current) fill.current.style.height = "";
      setCur(0);
    },
  );

  const shown = live ? cur : 0;
  const step = day.steps[Math.max(0, shown)]!;
  const night = !!step.night;
  const ang = Math.PI * (1 - step.arc);
  const x = Math.round(280 + 240 * Math.cos(ang));
  const y = Math.round(360 - 240 * Math.sin(ang));

  return (
    <section aria-labelledby="day-title" className="bg-white py-[72px] lg:py-24">
      <div className="wrap grid items-start gap-10 lg:grid-cols-2 lg:gap-24">
        <div className="flex flex-col gap-4 lg:sticky lg:top-[152px]">
          <p className="eyebrow">{day.eyebrow}</p>
          <h2 id="day-title" className="h2">
            {day.title}
          </h2>
          <p className="lead">{day.subline}</p>
          {day.tbc && flags.showPlaceholders && (
            <p className="sm muted">
              <Tbc tbc={day.tbc} />
            </p>
          )}
          <div aria-hidden="true" data-night={night} className="sky mt-6 hidden lg:block">
            <svg
              viewBox="0 0 560 420"
              width="100%"
              height="100%"
              preserveAspectRatio="xMidYMax meet"
              className="absolute inset-0"
            >
              <path
                d="M40 360 A240 240 0 0 1 520 360"
                fill="none"
                strokeWidth="3"
                strokeDasharray="4 10"
                strokeLinecap="round"
                className={night ? "stroke-orchid-700" : "stroke-leaf-700"}
              />
              <line
                x1="24"
                y1="360"
                x2="536"
                y2="360"
                strokeWidth="2"
                className={night ? "stroke-orchid-700" : "stroke-leaf-700"}
              />
              <g className="sky-body" style={{ transform: `translate(${x}px, ${y}px)` }}>
                <g className="sun" style={{ opacity: night ? 0 : 1 }}>
                  <circle r="34" className="fill-leaf-500" />
                  <circle
                    r="52"
                    fill="none"
                    strokeWidth="2"
                    strokeDasharray="3 9"
                    strokeLinecap="round"
                    className="stroke-leaf-500"
                  />
                </g>
                <g className="moon" style={{ opacity: night ? 1 : 0 }}>
                  <circle r="34" className="fill-orchid-100" />
                  <circle cx="14" cy="-10" r="30" className="fill-plum-800" />
                </g>
              </g>
            </svg>
            <div className="absolute top-6 left-8 flex flex-col gap-0.5">
              <p
                className={cn(
                  "ff text-[3.75rem] leading-none",
                  night ? "text-white" : "text-plum-800",
                )}
              >
                {step.time}
              </p>
              <p
                className={cn(
                  "text-[1.25rem] font-semibold",
                  night ? "text-white" : "text-plum-800",
                )}
              >
                {step.title}
              </p>
            </div>
          </div>
        </div>

        <ol ref={list} className="relative pt-2">
          <span
            aria-hidden="true"
            className="day-line absolute top-11 bottom-[100px] w-[3px] rounded-full bg-plum-100"
          />
          <span
            ref={fill}
            aria-hidden="true"
            className="day-line absolute top-11 bottom-[100px] w-[3px] rounded-full bg-orchid-500 shadow-[0_0_12px_2px_rgb(194_91_217/0.55)] live:bottom-auto live:h-0"
          />
          {day.steps.map((s, i) => (
            <li
              key={s.time + s.title}
              data-step=""
              data-on={!live || i <= cur}
              data-cur={i === shown}
              className="day-step"
            >
              <span className="day-dot" aria-hidden="true">
                {s.night ? (
                  <Moon size={28} strokeWidth={1.75} />
                ) : (
                  <Sun size={28} strokeWidth={1.75} />
                )}
              </span>
              <div className="flex flex-col gap-1 pt-0.5">
                <time
                  dateTime={s.dt}
                  className="text-[1.0625rem] font-bold tracking-[0.04em] text-orchid-700"
                >
                  {s.time}
                </time>
                <h3 className="h3">{s.title}</h3>
                {s.lines.map((l) => (
                  <p key={l.text}>
                    {l.label && <strong className="text-plum-800">{l.label}</strong>} {l.text}
                  </p>
                ))}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
