/**
 * "Towns we serve" (COPY_AREAS 2.3) — the map's accessible list. Two groups by tier, sorted by
 * drive time; each row is one 48px+ link (town page) or one tel: link (no page yet). Row ids are
 * the map markers' targets for towns without a page.
 */
import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { areasByTier, formatDrive, townRowId } from "@/content/areas";
import { contact, flags } from "@/content/site.config";

const phone = contact.phone.value;

const GROUPS = [
  {
    tier: "primary" as const,
    title: "Near our office",
    intro: "About 5 to 25 minutes from our office.",
    chip: "[drive times]",
  },
  {
    tier: "extended" as const,
    title: "Extended service area",
    intro:
      "About 25 to 55 minutes from our office. Call us to check scheduling for the hours you need.",
    chip: "[drive times + extended-area scheduling]",
  },
];

export function TownList() {
  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:gap-12">
      {GROUPS.map((g) => (
        <div key={g.tier} className="flex flex-col gap-4">
          <h3 className="h3 flex items-center gap-3">
            <span
              aria-hidden="true"
              className={
                g.tier === "primary"
                  ? "size-3.5 flex-none rounded-full bg-plum-800"
                  : "size-3.5 flex-none rounded-full border-[3px] border-plum-800 bg-white"
              }
            />
            {g.title}
          </h3>
          <p>
            {g.intro}
            {flags.showPlaceholders && (
              <>
                {" "}
                <span className="tbc">{g.chip}</span>
              </>
            )}
          </p>
          <ul className="flex flex-col border-t border-line">
            {areasByTier(g.tier).map((a) => {
              const drive = formatDrive(a.driveMinutes);
              const body = (
                <>
                  <span className="font-bold text-plum-800">{a.name}</span>
                  <span className="muted">
                    <span aria-hidden="true">About {drive} min</span>
                    <span className="sr-only">About {drive} minutes from our office.</span>
                  </span>
                  <span className="ml-auto flex items-center gap-1.5 font-semibold text-orchid-700">
                    {a.hasPage ? (
                      <>
                        See care {a.preposition} {a.name}
                        <ArrowRight aria-hidden size={18} strokeWidth={2} />
                      </>
                    ) : (
                      <>
                        <Phone aria-hidden size={18} strokeWidth={2} />
                        Call to check: {phone.display}
                      </>
                    )}
                  </span>
                </>
              );
              const cls =
                "flex min-h-14 flex-wrap items-center gap-x-4 gap-y-1 border-b border-line px-2 py-3 no-underline transition-colors hover:bg-orchid-100 scroll-mt-[calc(var(--header-h)+24px)]";
              return (
                <li key={a.slug}>
                  {a.hasPage ? (
                    <Link id={townRowId(a.slug)} href={`/areas-we-serve/${a.slug}`} className={cls} data-cursor-label="View">
                      {body}
                    </Link>
                  ) : (
                    <a id={townRowId(a.slug)} href={`tel:${phone.tel}`} className={cls} data-cursor-label="Call">
                      {body}
                    </a>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}
