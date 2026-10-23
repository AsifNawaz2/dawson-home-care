"use client";

/**
 * 01 — "This helps if…" (design 03 "IS THIS RIGHT FOR YOU", COPY_SERVICES §0): native
 * checkboxes; at 1+ ticks a result line (polite live region) and an assessment button carrying
 * the ticked ids. Ticks are kept in sessionStorage (also read by the assessment form as
 * service_page_needs).
 */
import Link from "next/link";
import { useEffect, useState } from "react";
import { assessmentHref, type ServicePage } from "@/content/services";
import { readStorage, writeStorage } from "@/lib/storage";
import { AssessmentButton } from "@/components/ui/AssessmentButton";

export const NEEDS_KEY = "dawson.service-needs.v1";

export function readNeeds(): Record<string, string[]> {
  try {
    return JSON.parse(readStorage("session", NEEDS_KEY) ?? "{}") as Record<string, string[]>;
  } catch {
    return {};
  }
}

export function FitChecklist({ page }: { page: ServicePage }) {
  const [ticked, setTicked] = useState<string[]>([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- restore this tab's ticks
    setTicked(readNeeds()[page.slug] ?? []);
  }, [page.slug]);

  const toggle = (id: string) => {
    const next = ticked.includes(id) ? ticked.filter((t) => t !== id) : [...ticked, id];
    const ordered = page.fit.checks.map((c) => c.id).filter((c) => next.includes(c));
    setTicked(ordered);
    writeStorage("session", NEEDS_KEY, JSON.stringify({ ...readNeeds(), [page.slug]: ordered }));
  };

  const n = ticked.length;
  const result =
    n >= 3
      ? `${page.fit.resultName} sounds like a good fit. Let's talk it through at your free visit.`
      : "That's worth a conversation. We'll talk it through at your free visit.";

  return (
    <section
      id="right-for-you"
      aria-labelledby="fit-title"
      className="bg-orchid-100 py-[72px] lg:py-24"
    >
      <div className="wrap grid items-start gap-8 lg:grid-cols-[420px_minmax(0,1fr)] lg:gap-20">
        <div className="flex flex-col gap-4 lg:sticky lg:top-[152px]">
          <p className="eyebrow">01 — Is this right for you?</p>
          <h2 id="fit-title" className="dl text-plum-800">
            This helps if…
          </h2>
          <p className="lead">Tick any that sound familiar.</p>
          <p className="mt-4 max-lg:hidden">
            Not sure this is the one?{" "}
            <Link className="link !inline !min-h-0" href="/find-care" data-cursor-label="Open">
              Take the 1-minute quiz
            </Link>
          </p>
        </div>
        <div className="flex flex-col gap-3.5">
          <fieldset className="m-0 flex flex-col gap-3.5 border-0 p-0">
            <legend className="sr-only">This helps if… Tick any that sound familiar.</legend>
            {page.fit.checks.map((c) => (
              <label key={c.id} className="chk">
                <input
                  type="checkbox"
                  id={c.id}
                  checked={ticked.includes(c.id)}
                  onChange={() => toggle(c.id)}
                />
                <span className="box" aria-hidden="true">
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="stroke-plum-950"
                  >
                    <path d="M5 12.5 10 17.5 19.5 7" />
                  </svg>
                </span>
                <span>{c.label}</span>
              </label>
            ))}
          </fieldset>
          <div aria-live="polite" className="min-h-2">
            {n > 0 && (
              <div
                data-surface="dark"
                className="fit-result mt-3 flex flex-col gap-5 rounded-[20px] bg-plum-800 p-6 md:flex-row md:items-center md:justify-between md:gap-6 lg:px-8 lg:py-7"
              >
                <p className="max-w-[520px] text-[1.25rem] font-semibold text-white">{result}</p>
                <AssessmentButton
                  href={assessmentHref(page.slug, ticked)}
                  className="flex-none max-md:w-full"
                />
              </div>
            )}
          </div>
          <p className="mt-2 lg:hidden">
            Not sure this is the one?{" "}
            <Link className="link !inline !min-h-0" href="/find-care" data-cursor-label="Open">
              Take the 1-minute quiz
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
