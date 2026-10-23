"use client";

/**
 * 04 — How it works (design 01/02-home "5. HOW IT WORKS", COPY_HOME §5, BUILD_DECISIONS row 21).
 *
 * Full motion: a glowing orchid line fills down the steps and a heartbeat pulse travels with the
 * scroll (the pulse sits at 55% of the screen height); each 3D icon lights up as the pulse
 * reaches it. Same maths as the design's `update()`.
 * Reduced motion: still — the line and pulse rest at step 2, as in the design's static frame.
 */
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { useMotionMode } from "@/lib/motionMode";
import { contact, hours } from "@/content/site.config";
import { AssessmentButton } from "@/components/ui/AssessmentButton";
import { clamp, isDesktop, useScrollScene } from "./scroll";
import { STEP_ICONS } from "./stepIcons";

const phone = contact.phone.value;

const STEPS = [
  {
    title: "Call or text us",
    text: "Tell us what's going on. We'll listen, answer your questions and set up a visit.",
    small: `${phone.display} · Office hours ${hours.officeLabel}`,
  },
  {
    title: "Our owner visits — free",
    text: "Our owner comes to your loved one's home, meets the family and learns how they like to live.",
    small: "Free · No obligation · At home",
  },
  {
    title: "We build your care plan",
    text: "Together, we plan the days, the hours and the help — around their routine.",
  },
  {
    title: "We match your caregiver",
    text: "We choose an experienced caregiver who fits your loved one's needs and schedule.",
  },
  {
    title: "We keep checking in",
    text: "We follow up regularly and adjust the plan as needs change.",
  },
];

export function HowItWorks() {
  const live = useMotionMode() === "full";
  const list = useRef<HTMLOListElement>(null);
  const pulse = useRef<SVGSVGElement>(null);
  const fill = useRef<HTMLSpanElement>(null);

  const place = (animate: boolean) => {
    const l = list.current;
    if (!l || !pulse.current || !fill.current) return;
    const desk = isDesktop();
    const lr = l.getBoundingClientRect();
    const nodes = l.querySelectorAll<HTMLElement>("[data-hiw-node]");
    let py: number;
    if (animate) py = clamp(window.innerHeight * 0.55 - lr.top, 0, lr.height);
    else {
      const n2 = nodes[1]!.getBoundingClientRect();
      py = n2.top + n2.height / 2 - lr.top + 48;
    }
    pulse.current.style.transform = `translate(-50%,${py - (desk ? 76 : 56)}px)`;
    fill.current.style.height = `${Math.max(0, py - (desk ? 60 : 38))}px`;
    nodes.forEach((n) => {
      const r = n.getBoundingClientRect();
      n.dataset.lit = String(py >= r.top + r.height / 2 - lr.top - 10);
    });
  };

  useScrollScene(() => place(true), live);
  // Reduced motion: one still frame (re-measured if the layout changes size).
  useScrollScene(() => place(false), !live);

  const buttons = (
    <>
      <AssessmentButton href="/free-assessment" className="max-lg:w-full" />
      <Link className="btn btn-ghost max-lg:w-full" href="/how-it-works">
        See how it works
      </Link>
    </>
  );

  return (
    <section aria-labelledby="how-title" className="py-[88px] lg:py-32">
      <div className="wrap grid items-start lg:grid-cols-[420px_minmax(0,1fr)] lg:gap-24">
        <div className="flex flex-col items-start gap-3 lg:sticky lg:top-[calc(var(--header-h)+24px)] lg:gap-4">
          <p className="eyebrow">04 — How it works</p>
          <h2 id="how-title" className="h2">
            Getting started is simple.
          </h2>
          <p className="lead">One call. One free visit. Then care that fits.</p>
          <div className="mt-6 hidden flex-col items-start gap-4 lg:flex">{buttons}</div>
        </div>
        <ol ref={list} data-el="hiw" className="relative mt-10 list-none p-0 lg:mt-0">
          <span
            aria-hidden="true"
            className="absolute top-[38px] bottom-[38px] left-9 w-1 rounded-full bg-plum-100 lg:top-[60px] lg:bottom-[60px] lg:left-[58px]"
          />
          <span
            ref={fill}
            aria-hidden="true"
            className="absolute top-[38px] left-9 h-0 w-1 rounded-full bg-orchid-500 shadow-[0_0_12px_2px_rgb(194_91_217/0.6)] lg:top-[60px] lg:left-[58px]"
          />
          <svg
            ref={pulse}
            aria-hidden="true"
            focusable="false"
            className="hiw-pulse"
            viewBox="0 0 40 140"
            style={{ transform: "translate(-50%,0)" }}
          >
            <path
              d="M20 0 V52 L11 60 L20 66 L5 77 L35 88 L17 96 L20 100 V140"
              fill="none"
              stroke="var(--color-orchid-500)"
              strokeWidth="3.5"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          </svg>
          {STEPS.map((s, i) => {
            const last = i === STEPS.length - 1;
            return (
              <li
                key={s.title}
                className="relative grid grid-cols-[76px_minmax(0,1fr)] gap-x-[18px] lg:grid-cols-[120px_minmax(0,1fr)] lg:gap-x-10"
              >
                <span className="node3d" data-hiw-node={i} aria-hidden="true">
                  <svg viewBox="0 0 96 96" className="size-14 lg:size-[88px]">
                    {STEP_ICONS[i]}
                  </svg>
                </span>
                {i === 1 ? (
                  <div className="pb-12 lg:pb-[72px]">
                    <div
                      data-surface="dark"
                      className="flex flex-col gap-2.5 rounded-[20px] bg-plum-800 p-[22px] lg:gap-3 lg:p-10"
                    >
                      <p className="inline-flex min-h-8 items-center self-start rounded-full bg-leaf-500 px-3 font-bold text-plum-950 lg:px-3.5">
                        The Dawson difference
                      </p>
                      <p className="eyebrow mt-2 !text-orchid-100">Step 2</p>
                      <h3 className="h3 text-white lg:!text-[2.25rem]">{s.title}</h3>
                      <p className="max-w-[56ch] text-cream">{s.text}</p>
                      <p className="sm text-plum-100">{s.small}</p>
                      <figure className="mt-3 lg:mt-5">
                        <Image
                          src="/images/owner-visit.jpg"
                          alt="Two women talking, seated in armchairs in a bright room lined with bookshelves."
                          width={1200}
                          height={1124}
                          sizes="(min-width: 1024px) 640px, 90vw"
                          className="block aspect-[3/2] w-full rounded-2xl object-cover object-[50%_38%]"
                        />
                      </figure>
                    </div>
                  </div>
                ) : (
                  <div
                    className={
                      "flex flex-col gap-1.5 pt-1.5 lg:gap-2 lg:pt-4 " +
                      (last ? "pb-0" : "pb-12 lg:pb-[72px]")
                    }
                  >
                    <p className="eyebrow">Step {i + 1}</p>
                    <h3 className="h3">{s.title}</h3>
                    <p className="max-w-[56ch]">{s.text}</p>
                    {s.small && <p className="sm muted">{s.small}</p>}
                  </div>
                )}
              </li>
            );
          })}
        </ol>
        <div className="mt-10 flex flex-col gap-3 lg:hidden">{buttons}</div>
      </div>
    </section>
  );
}
