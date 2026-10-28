"use client";

/**
 * 05 — Since 2002 (design 01/02-home "6. SINCE 2002", COPY_HOME §6, BUILD_DECISIONS rows 22–23).
 * The number is worked out from 2002 in the browser (Cache Components forbids reading the clock
 * while prerendering) — no count-up (row 22). "Licensed & insured" is an inline panel, open by
 * default (row 23).
 */
import { useId, useState, useSyncExternalStore } from "react";
import { MapPin, ShieldCheck } from "lucide-react";
import { FOUNDED_YEAR, address, credentials } from "@/content/site.config";
import { Tbc } from "@/components/ui/Tbc";

const noop = () => () => {};

function useYear() {
  return useSyncExternalStore(
    noop,
    () => new Date().getFullYear(),
    () => null,
  );
}

export function Since2002() {
  const year = useYear();
  const years = year === null ? null : year - FOUNDED_YEAR;
  const [lic, setLic] = useState(true);
  const panel = useId();
  // Before the browser fills the number in, keep the space so nothing jumps.
  const n = years === null ? <span className="invisible">00</span> : years;

  return (
    <section aria-labelledby="since-title" className="bg-plum-100 py-20 lg:py-section">
      <div className="wrap grid items-center gap-0 lg:grid-cols-2 lg:gap-18">
        <div className="flex flex-col gap-3 lg:gap-4">
          <p className="eyebrow">05 — Since 2002</p>
          <h2 id="since-title" className="flex flex-col gap-1.5 text-plum-800 lg:gap-2">
            <span className="ff text-numeral">{n}</span>
            <span className="ff text-[2.25rem] leading-[1.08] lg:text-[2.625rem]">
              years caring for Lowcountry families
            </span>
          </h2>
        </div>
        <div className="mt-5 flex flex-col gap-7 lg:mt-0 lg:gap-8">
          <p className="max-w-[58ch]">
            Dawson and Dawson Home Care has helped families stay at home since 2002. Today
            we&apos;re owner-run, licensed and insured, with our office right here in Beaufort.
          </p>
          <div>
            <div aria-hidden="true" className="relative h-12 lg:h-[52px]">
              <div className="absolute top-[21px] right-4 left-3 h-1.5 rounded-full bg-plum-800 shadow-[0_0_16px_2px_rgb(194_91_217/0.45)] lg:top-[23px] lg:right-[18px] lg:left-3.5 lg:shadow-[0_0_18px_2px_rgb(194_91_217/0.45)]" />
              <div className="absolute top-[11px] left-0 size-[26px] rounded-full bg-plum-800 shadow-[0_0_0_5px_var(--color-white)] lg:top-3 lg:size-7 lg:shadow-[0_0_0_6px_var(--color-white)]" />
              <div className="absolute top-3 left-1/3 h-6 w-1 rounded-sm bg-plum-800 lg:h-7" />
              <div className="absolute top-3 left-3/4 h-6 w-1 rounded-sm bg-plum-800 lg:h-7" />
              <div className="absolute top-[7px] right-0 size-[34px] rounded-full border-4 border-plum-800 bg-leaf-500 shadow-[0_0_0_5px_var(--color-orchid-100),0_0_24px_6px_rgb(148_199_35/0.55)] lg:top-2 lg:size-9 lg:shadow-[0_0_0_6px_var(--color-orchid-100),0_0_28px_8px_rgb(148_199_35/0.55)]" />
            </div>
            <ol className="mt-4 grid list-none grid-cols-2 gap-4 p-0 lg:mt-5 lg:gap-6">
              <li className="flex flex-col gap-1.5 lg:gap-2">
                <span className="ff text-stat text-plum-800">2002</span>
                <span className="text-ink lg:text-[1.25rem] lg:leading-[1.45]">
                  — We begin caring for Lowcountry families.
                </span>
              </li>
              <li className="flex flex-col items-end gap-1.5 text-right lg:gap-2">
                <span className="ff text-stat text-plum-800">
                  {year ?? <span className="invisible">0000</span>}
                </span>
                <span className="text-ink lg:text-[1.25rem] lg:leading-[1.45]">
                  — {n} years later, still here.
                </span>
              </li>
            </ol>
          </div>
          <div className="flex flex-col gap-1.5 border-t border-muted pt-5 lg:gap-2 lg:pt-6">
            <p className="sm flex items-start gap-2.5 text-plum-800">
              <MapPin
                aria-hidden
                size={20}
                strokeWidth={1.75}
                className="mt-0.5 flex-none text-orchid-700"
              />
              Our office: {address.oneLine}
            </p>
            <button
              type="button"
              className="link sm inline-flex items-center gap-2 self-start"
              aria-expanded={lic}
              aria-controls={panel}
              onClick={() => setLic((v) => !v)}
            >
              <ShieldCheck aria-hidden size={20} strokeWidth={1.75} />
              Licensed &amp; insured →
            </button>
            <p
              id={panel}
              hidden={!lic}
              className="sm rounded-xl bg-white px-4 py-3.5 text-ink lg:px-5 lg:py-4"
            >
              South Carolina in-home care license{" "}
              {credentials.scLicenseNumber.confirmed ? (
                credentials.scLicenseNumber.value
              ) : (
                <Tbc tbc={{ chip: "[SC license number]" }} />
              )}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
