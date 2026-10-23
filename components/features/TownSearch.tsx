"use client";

/**
 * "Do you serve my town?" (SPEC_FEATURES §6.4, COPY_HOME ch. 11, COPY_AREAS 2.2; design 01-home
 * "WHERE WE CARE" form + the interaction-states "Town search · match" card).
 * Matches come from matchAreas() in content/areas.ts. Editing the input clears the result and the
 * map highlights.
 */
import Link from "next/link";
import { useId, useState } from "react";
import { Check, CircleAlert, Search } from "lucide-react";
import { matchAreas, type Area } from "@/content/areas";
import { contact } from "@/content/site.config";
import { joinAnd } from "@/components/forms/FormBits";

const phone = contact.phone.value;
type Result =
  { kind: "empty" } | { kind: "none" } | { kind: "match"; query: string; towns: Area[] };

const seeLink = (a: Area) => (
  <Link key={a.slug} className="font-semibold text-plum-800" href={`/areas-we-serve/${a.slug}`}>
    See care {a.preposition} {a.name} →
  </Link>
);

export function TownSearch({ onMatch }: { onMatch: (slugs: string[]) => void }) {
  const uid = useId();
  const [q, setQ] = useState("");
  const [res, setRes] = useState<Result | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = q.trim();
    if (!query) {
      setRes({ kind: "empty" });
      onMatch([]);
      document.getElementById(`${uid}-q`)?.focus();
      return;
    }
    const towns = matchAreas(query);
    setRes(towns.length ? { kind: "match", query, towns } : { kind: "none" });
    onMatch(towns.map((t) => t.slug));
  };

  return (
    <form
      role="search"
      aria-labelledby={`${uid}-l`}
      noValidate
      onSubmit={submit}
      className="flex flex-col gap-2.5 rounded-[20px] border border-line bg-white p-[22px] lg:gap-3 lg:p-8"
    >
      <label
        id={`${uid}-l`}
        htmlFor={`${uid}-q`}
        className="ff text-[1.5rem] text-plum-800 lg:text-[1.625rem]"
      >
        Do you serve my town?
      </label>
      <p id={`${uid}-help`} className="sm muted">
        Type your town or ZIP code.
      </p>
      <div className="flex gap-2.5 lg:gap-3">
        <input
          id={`${uid}-q`}
          className="field min-w-0 flex-1"
          type="text"
          autoComplete="off"
          enterKeyHint="search"
          value={q}
          aria-invalid={res?.kind === "empty" || undefined}
          aria-describedby={`${uid}-help ${uid}-res`}
          onChange={(e) => {
            setQ(e.target.value);
            if (res) {
              setRes(null);
              onMatch([]);
            }
          }}
        />
        <button
          type="submit"
          className="btn btn-secondary !min-h-14 flex-none !px-[18px] lg:!px-5"
          aria-label="Search"
        >
          <Search aria-hidden size={22} strokeWidth={1.75} />
        </button>
      </div>
      <div id={`${uid}-res`} role="status">
        {res?.kind === "empty" && (
          <p className="emsg">
            <CircleAlert aria-hidden size={20} strokeWidth={1.75} className="flex-none" />
            Please type a town or ZIP code.
          </p>
        )}
        {res?.kind === "none" && (
          <div className="mt-1 rounded-xl bg-plum-100 px-4 py-3.5 lg:px-5 lg:py-4">
            <p className="font-bold text-plum-800">We may still be able to help.</p>
            <p className="sm">
              Call{" "}
              <a href={`tel:${phone.tel}`} data-cursor-label="Call" className="font-semibold">
                {phone.display}
              </a>{" "}
              and we&apos;ll let you know.
            </p>
          </div>
        )}
        {res?.kind === "match" && <Match query={res.query} towns={res.towns} />}
      </div>
    </form>
  );
}

function Match({ query, towns }: { query: string; towns: Area[] }) {
  const zip = /^\d{5}$/.test(query);
  const one = towns.length === 1 ? towns[0]! : null;
  const extended = towns.filter((t) => t.tier === "extended");
  return (
    <div className="mt-1 flex flex-col gap-1 rounded-xl bg-leaf-100 px-4 py-3.5 lg:px-5 lg:py-4">
      <p className="flex items-start gap-2.5 font-bold text-leaf-700">
        <Check aria-hidden size={22} strokeWidth={2} className="mt-0.5 flex-none" />
        <span>
          {one && !zip
            ? one.hasPage
              ? `Yes — we care for families ${one.preposition} ${one.name}.`
              : `Yes — ${one.name} is in our service area.`
            : `Yes — we care for families in ${zip ? query : joinAnd(towns.map((t) => t.name))}.`}
        </span>
      </p>
      {zip && towns.length > 1 && (
        <p className="sm">That includes {joinAnd(towns.map((t) => t.name))}.</p>
      )}
      {one && !one.hasPage && (
        <p className="sm">
          Call{" "}
          <a href={`tel:${phone.tel}`} className="font-semibold">
            {phone.display}
          </a>{" "}
          and we&apos;ll talk about care.
        </p>
      )}
      {extended.map((t) => (
        <p key={t.slug} className="sm">
          {t.name} is in our extended service area. Call us to check scheduling for your hours.
        </p>
      ))}
      <div className="flex flex-col gap-1">{towns.filter((t) => t.hasPage).map(seeLink)}</div>
    </div>
  );
}
