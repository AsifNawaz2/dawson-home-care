"use client";

/**
 * "On this page" jump bar (COPY_COST_FAQ hero): sticky under the header on desktop, a sideways
 * row on phones. The section in view gets aria-current="true".
 */
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

export function JumpBar({
  items,
  label = "On this page",
  currentValue = "true",
}: {
  items: { id: string; label: string }[];
  label?: string;
  /** aria-current value for the item in view ("step" for a list of steps). */
  currentValue?: "true" | "step";
}) {
  const [current, setCurrent] = useState<string | null>(null);
  useEffect(() => {
    const els = items.map((i) => document.getElementById(i.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting);
        if (vis.length)
          setCurrent(
            vis.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]!.target.id,
          );
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, [items]);
  return (
    <nav
      aria-label={label}
      className="z-20 border-y border-line bg-cream/95 backdrop-blur lg:sticky lg:top-[var(--header-h)]"
    >
      <ol className="wrap flex gap-2 overflow-x-auto py-2.5">
        {items.map((it, i) => (
          <li key={it.id} className="flex-none">
            <a
              href={`#${it.id}`}
              aria-current={current === it.id ? currentValue : undefined}
              className={cn(
                "inline-flex min-h-12 items-center gap-2 rounded-full border-[1.5px] px-4 font-semibold no-underline transition-colors",
                current === it.id
                  ? "border-plum-800 bg-plum-800 text-white hover:text-white"
                  : "border-muted bg-white text-plum-800 hover:border-orchid-500 hover:bg-orchid-100",
              )}
            >
              <span aria-hidden="true" className="ff text-[1.125rem]">
                {i + 1}
              </span>
              {it.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
