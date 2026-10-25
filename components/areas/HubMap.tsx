"use client";

/** /areas-we-serve "Find your town" (COPY_AREAS 2.2): map + legend + disclaimer + town search. */
import { useState } from "react";
import { AreaMap } from "@/components/features/AreaMap";
import { TownSearch } from "@/components/features/TownSearch";

export function HubMap() {
  const [hits, setHits] = useState<string[]>([]);
  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,720px)_minmax(0,1fr)] lg:gap-16">
      <figure className="flex flex-col gap-3">
        <AreaMap highlight={hits} />
        <figcaption className="flex flex-col gap-2">
          <ul className="flex flex-wrap gap-x-6 gap-y-2" aria-label="Map key">
            <li className="flex items-center gap-2">
              <span aria-hidden="true" className="size-3.5 rounded-full bg-plum-800" />
              <strong className="text-plum-800">Near our office</strong>
            </li>
            <li className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className="size-3.5 rounded-full border-[3px] border-plum-800 bg-white"
              />
              <span>
                <strong className="text-plum-800">Extended service area</strong> — call to check
                scheduling
              </span>
            </li>
            <li className="flex items-center gap-2">
              <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5">
                <path
                  d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"
                  fill="var(--color-plum-800)"
                />
                <circle cx="12" cy="10" r="3.2" fill="var(--color-leaf-500)" />
              </svg>
              <strong className="text-plum-800">Our office</strong>
            </li>
          </ul>
          <p className="sm muted">Map is approximate. Drive times are estimates from our office.</p>
        </figcaption>
      </figure>
      <TownSearch onMatch={setHits} />
    </div>
  );
}
