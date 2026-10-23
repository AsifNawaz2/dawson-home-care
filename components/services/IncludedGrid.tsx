/** 02 — What we help with (design 03 "WHAT'S INCLUDED"): 3D-icon cards + the "doesn't include" note. */
import { Info } from "lucide-react";
import { flags } from "@/content/site.config";
import type { ServicePage } from "@/content/services";
import { Tbc } from "@/components/ui/Tbc";
import { ServiceIcon } from "./ServiceIcons";

export function IncludedGrid({ page }: { page: ServicePage }) {
  const inc = page.included;
  return (
    <section aria-labelledby="inc-title" className="py-[72px] lg:py-24">
      <div className="wrap">
        <div className="flex max-w-[760px] flex-col gap-4">
          <p className="eyebrow">02 — What&apos;s included</p>
          <h2 id="inc-title" className="h2">
            {inc.title}
          </h2>
          {inc.intro && <p className="lead">{inc.intro}</p>}
        </div>

        {inc.options && (
          <ul className="mt-10 grid gap-5 md:grid-cols-2">
            {inc.options.map((o) => (
              <li
                key={o.title}
                className="flex flex-col gap-2 rounded-3xl border-2 border-plum-800 bg-plum-100 p-6 lg:p-8"
              >
                <h3 className="h3">{o.title}</h3>
                <p>{o.text}</p>
              </li>
            ))}
          </ul>
        )}

        <ul className="mt-10 grid gap-4 md:grid-cols-2 lg:mt-12 lg:grid-cols-3 lg:gap-5">
          {inc.items.map((it) => (
            <li key={it.title} className="inc">
              <span className="ic3d" aria-hidden="true">
                <ServiceIcon id={it.icon} />
              </span>
              <h3 className="h3">{it.title}</h3>
              <p>
                {it.text}
                {it.tbc && flags.showPlaceholders && (
                  <>
                    {" "}
                    <Tbc tbc={it.tbc} />
                  </>
                )}
              </p>
            </li>
          ))}
        </ul>

        <aside
          aria-labelledby="not-inc"
          className="mt-8 grid max-w-[960px] grid-cols-[48px_minmax(0,1fr)] items-start gap-4 rounded-[20px] border-[1.5px] border-muted p-6 md:grid-cols-[56px_minmax(0,1fr)] md:gap-5 lg:px-8 lg:py-7"
        >
          <span
            aria-hidden="true"
            className="flex size-12 items-center justify-center rounded-2xl bg-plum-100 text-plum-800 md:size-14"
          >
            <Info size={28} strokeWidth={1.75} />
          </span>
          <div className="flex flex-col gap-1.5">
            <h3 id="not-inc" className="h3 !text-[1.5rem]">
              {inc.notIncluded.title}
            </h3>
            <p>{inc.notIncluded.text}</p>
            {inc.notIncluded.tbc && flags.showPlaceholders && (
              <p className="sm muted">
                <Tbc tbc={inc.notIncluded.tbc} />
              </p>
            )}
          </div>
        </aside>

        {inc.hospice && flags.showPlaceholders && (
          <p className="sm muted mt-6 max-w-[760px]">
            {inc.hospice.text} <span className="tbc">{inc.hospice.chip}</span>
          </p>
        )}
      </div>
    </section>
  );
}
