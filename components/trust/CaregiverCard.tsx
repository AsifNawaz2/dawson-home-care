"use client";

/**
 * Caregiver spotlight card parts (COPY_TRUST "CAREGIVER SPOTLIGHT CARDS"): portrait slot, facts
 * (first name, computed years line, specialty, optional CNA chip), "Sample" chip, and the still
 * card used by About's grid and by Home's carousel in reduced motion.
 */
import { useSyncExternalStore } from "react";
import type { Caregiver } from "@/content/caregivers";
import { Tbc } from "@/components/ui/Tbc";

const noop = () => () => {};

export function Portrait({ c }: { c: Caregiver }) {
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

/** "Sample" chip on placeholder cards (announced as "Sample card"). */
export function SampleChip({ c }: { c: Caregiver }) {
  if (!c.placeholder) return null;
  return (
    <span className="chip absolute top-3 left-3 z-10 bg-white">
      <span aria-hidden="true">Sample</span>
      <span className="sr-only">Sample card</span>
    </span>
  );
}

/** COPY_TRUST §2 years line, computed in the browser from startYear. */
function YearsLine({ c }: { c: Caregiver }) {
  const year = useSyncExternalStore(
    noop,
    () => new Date().getFullYear(),
    () => null,
  );
  if (c.startYear === null)
    return (
      <>
        <Tbc tbc={{ chip: "[Years]" }} /> years with Dawson
      </>
    );
  if (year === null) return null;
  const n = year - c.startYear;
  return (
    <>
      {n <= 0
        ? "New to Dawson this year"
        : n === 1
          ? "1 year with Dawson"
          : `${n} years with Dawson`}
    </>
  );
}

export function Facts({ c }: { c: Caregiver }) {
  return (
    <>
      {c.placeholder && <p className="sm muted">Caregiver portrait · 4:5</p>}
      <h3 className="h3 mt-1.5 lg:mt-2">{c.firstName}</h3>
      <p className="sm">
        <YearsLine c={c} />
      </p>
      <p className="sm">{c.specialty ?? <Tbc tbc={{ chip: "[Specialty]" }} />}</p>
      {c.credential && <span className="chip self-start">{c.credential}</span>}
    </>
  );
}

export function QuoteMark() {
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

export function StillCard({
  c,
  onFocusCard,
  className = "cg-still",
}: {
  c: Caregiver;
  onFocusCard?: () => void;
  className?: string;
}) {
  return (
    <article
      className={`${className} relative overflow-hidden rounded-[20px] border border-line bg-white`}
      onFocus={onFocusCard}
    >
      <SampleChip c={c} />
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
