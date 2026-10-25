"use client";

import { useSyncExternalStore } from "react";
import { LOGO_FIGURE_KEY } from "@/lib/headScript";
import { writeStorage } from "@/lib/storage";
import { cn } from "@/lib/cn";

type Figure = "a" | "b";

const read = (): Figure => (document.documentElement.dataset.logoFigure === "b" ? "b" : "a");
/** Outside the component: the html attribute is shared page state, not React state. */
function setFigure(f: Figure, initial: Figure) {
  document.documentElement.setAttribute("data-logo-figure", f);
  writeStorage("session", LOGO_FIGURE_KEY, f === initial ? null : f);
}
const subscribe = (cb: () => void) => {
  const o = new MutationObserver(cb);
  o.observe(document.documentElement, { attributes: true, attributeFilter: ["data-logo-figure"] });
  return () => o.disconnect();
};

/**
 * BRAND_FINAL §3.5: A/B toggle that swaps the live header and footer logo for this tab
 * (html[data-logo-figure], kept in sessionStorage by the head script). The site-wide default
 * stays NEXT_PUBLIC_LOGO_FIGURE.
 */
export function FigureSwitch({
  initial,
  a,
  b,
}: {
  initial: Figure;
  a: React.ReactNode;
  b: React.ReactNode;
}) {
  const fig = useSyncExternalStore(subscribe, read, () => initial);
  const options: { f: Figure; label: string; note: string; logo: React.ReactNode }[] = [
    {
      f: "a",
      label: "Option A",
      note: "Your logo, rebuilt faithfully (wheelchair figure)",
      logo: a,
    },
    { f: "b", label: "Option B", note: "Softened figure: two people under the roof", logo: b },
  ];
  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-6 md:grid-cols-2">
        {options.map((o) => (
          <figure
            key={o.f}
            className={cn(
              "flex flex-col gap-4 rounded-[20px] border-2 bg-white p-6 lg:p-8",
              fig === o.f ? "border-plum-800" : "border-line",
            )}
          >
            <div className="flex min-h-[200px] items-center justify-center">{o.logo}</div>
            <figcaption className="flex flex-col gap-1">
              <span className="font-semibold text-plum-800">
                {o.label}
                {o.f === initial ? " · live today" : ""}
              </span>
              <span className="sm muted">{o.note}</span>
            </figcaption>
          </figure>
        ))}
      </div>
      <div role="group" aria-label="Logo in the header and footer" className="flex flex-wrap gap-3">
        {options.map((o) => (
          <button
            key={o.f}
            type="button"
            aria-pressed={fig === o.f}
            onClick={() => setFigure(o.f, initial)}
            className={fig === o.f ? "btn btn-secondary" : "btn btn-ghost"}
          >
            Show {o.label} in the header
          </button>
        ))}
      </div>
      <p role="status" className="sm muted">
        The header and footer now show {fig === "a" ? "Option A" : "Option B"}. This tab only —
        everyone else still sees Option {initial.toUpperCase()}.
      </p>
    </div>
  );
}
