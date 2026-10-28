"use client";

/**
 * /how-it-works "01 — The 5 steps" (COPY_TRUST; built from Home "How it works" — BUILD_DECISIONS
 * §E): the same glowing heartbeat line, pulse and 3D icons, at full length with each step's
 * detail. Full motion: the line fills and each icon lights as the pulse (55% of the screen)
 * reaches it. Reduced motion: line fully drawn, every icon lit.
 */
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { Check, MessageSquare, Moon, Phone } from "lucide-react";
import { contact, hours } from "@/content/site.config";
import { steps, type Step } from "@/content/copy/howItWorks";
import { useMotionMode } from "@/lib/motionMode";
import { clamp, isDesktop, useScrollScene } from "@/components/home/scroll";
import { STEP_ICONS } from "@/components/home/stepIcons";
import { NextOpen, WhenClosed } from "@/components/layout/OfficeStatus";
import { Tbc } from "@/components/ui/Tbc";
import { flags } from "@/content/site.config";

const phone = contact.phone.value;
const text = contact.tollFree.value;

function Detail({ s, dark }: { s: Step; dark: boolean }) {
  const items = s.list.filter((li) => li.text || (li.tbc && flags.showPlaceholders));
  return (
    <>
      <p className="font-semibold">{s.lead}</p>
      <h4 className="mt-2 font-bold">{s.listLabel}</h4>
      <ul className="flex flex-col gap-2">
        {items.map((li, i) => (
          <li key={i} className="flex items-start gap-2.5">
            <Check
              aria-hidden
              size={20}
              strokeWidth={2.25}
              className={dark ? "mt-1 flex-none text-leaf-500" : "mt-1 flex-none text-leaf-700"}
            />
            <span>
              {li.text}
              {li.tbc && (
                <>
                  {li.text ? " " : ""}
                  <Tbc tbc={li.tbc} />
                </>
              )}
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-2">
        <strong>What you do:</strong> {s.youDo}
      </p>
      {s.note && (s.note.text || flags.showPlaceholders) && (
        <p className={dark ? "sm text-plum-100" : "sm muted"}>
          {s.note.text}
          {s.note.tbc && <Tbc tbc={s.note.tbc} />}
        </p>
      )}
    </>
  );
}

export function HowSteps() {
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
    const py = animate ? clamp(window.innerHeight * 0.55 - lr.top, 0, lr.height) : lr.height;
    pulse.current.style.transform = `translate(-50%,${py - (desk ? 76 : 56)}px)`;
    pulse.current.style.opacity = animate ? "1" : "0";
    fill.current.style.height = `${Math.max(0, Math.min(lr.height - (desk ? 96 : 76), py - (desk ? 48 : 38)))}px`;
    nodes.forEach((n) => {
      const r = n.getBoundingClientRect();
      n.dataset.lit = String(!animate || py >= r.top + r.height / 2 - lr.top - 10);
    });
  };
  useScrollScene(() => place(true), live);
  useScrollScene(() => place(false), !live);

  return (
    <ol ref={list} className="relative list-none p-0">
      <span
        aria-hidden="true"
        className="absolute top-[38px] bottom-[38px] left-9 w-1 rounded-full bg-plum-100 lg:top-[48px] lg:bottom-[48px] lg:left-[46px]"
      />
      <span
        ref={fill}
        aria-hidden="true"
        className="absolute top-[38px] left-9 h-0 w-1 rounded-full bg-orchid-500 shadow-[0_0_12px_2px_rgb(194_91_217/0.6)] lg:top-[48px] lg:left-[46px]"
      />
      <svg
        ref={pulse}
        aria-hidden="true"
        focusable="false"
        className="hiw-pulse"
        viewBox="0 0 40 140"
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
      {steps.map((s, i) => {
        const last = i === steps.length - 1;
        const dark = s.n === 2;
        return (
          <li
            key={s.n}
            id={`step-${s.n}`}
            className="relative grid scroll-mt-[calc(var(--header-h)+92px)] grid-cols-[76px_minmax(0,1fr)] gap-x-[18px] lg:grid-cols-[96px_minmax(0,1fr)] lg:gap-x-8"
          >
            <span className="node3d" data-hiw-node={i} aria-hidden="true">
              <svg viewBox="0 0 96 96" className="size-14 lg:size-[70px]">
                {STEP_ICONS[i]}
              </svg>
            </span>
            <div className={last ? "pb-0" : "pb-12 lg:pb-[72px]"}>
              <div
                data-surface={dark ? "dark" : undefined}
                className={
                  dark
                    ? "flex flex-col gap-2.5 rounded-[20px] bg-plum-800 p-[22px] text-cream lg:gap-3 lg:p-10"
                    : "flex flex-col gap-2 rounded-[20px] border border-line bg-white p-[22px] lg:gap-2.5 lg:p-8"
                }
              >
                {dark && (
                  <p className="inline-flex min-h-8 items-center self-start rounded-full bg-leaf-500 px-3 font-bold text-plum-950 lg:px-3.5">
                    The Dawson difference
                  </p>
                )}
                <p className={dark ? "eyebrow mt-2 !text-orchid-100" : "eyebrow"}>Step {s.n}</p>
                <h3 className={dark ? "h3 text-white lg:!text-[1.875rem]" : "h3"}>{s.title}</h3>
                <Detail s={s} dark={dark} />

                {s.n === 1 && (
                  <>
                    <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                      <a
                        className="btn btn-secondary max-sm:w-full"
                        href={`tel:${phone.tel}`}
                        data-cursor-label="Call"
                      >
                        <Phone aria-hidden size={20} strokeWidth={1.75} />
                        Call {phone.display}
                      </a>
                      <a className="btn btn-ghost max-sm:w-full" href={`sms:${text.tel}`}>
                        <MessageSquare aria-hidden size={20} strokeWidth={1.75} />
                        Text {text.display}
                      </a>
                      <Link className="btn btn-ghost max-sm:w-full" href="/free-assessment">
                        Request a call online
                      </Link>
                    </div>
                    <p className="sm muted">
                      <strong>Office:</strong> {hours.officeLabel}. <strong>Care:</strong>{" "}
                      {hours.careLabel}.
                    </p>
                    <WhenClosed>
                      <p className="sm flex items-start gap-2 text-plum-800">
                        <Moon aria-hidden size={18} strokeWidth={1.75} className="mt-1 flex-none" />
                        <span>
                          Calling after hours? Request a callback and we&apos;ll reach you first
                          thing <NextOpen />.
                        </span>
                      </p>
                    </WhenClosed>
                    <p className="sm">
                      Calling from a hospital or care team?{" "}
                      <Link href="/for-professionals#refer" className="font-semibold">
                        Use our referral form
                      </Link>
                    </p>
                  </>
                )}

                {dark && (
                  <>
                    <ul className="mt-2 flex flex-wrap gap-2" aria-label="The visit">
                      {["Free", "No obligation", "At home"].map((c) => (
                        <li
                          key={c}
                          className="inline-flex min-h-8 items-center rounded-full bg-plum-600 px-3.5 font-semibold text-white"
                        >
                          {c}
                        </li>
                      ))}
                    </ul>
                    <p className="sm text-plum-100">
                      At Dawson, the person who visits is the person who runs the company. If
                      anything isn&apos;t right later, you already know who to call.
                    </p>
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
                    <a className="link self-start" href="#free-assessment">
                      See what to expect at the visit ↓
                    </a>
                  </>
                )}
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
