"use client";

/**
 * Tickable checklist (COPY_TRUST "What to have ready"; service-page tick style): native
 * checkboxes, ticks kept in this tab (sessionStorage, never sent), a polite progress line and an
 * optional "Print this list" that prints only this list with empty boxes.
 */
import { useEffect, useId, useRef, useState } from "react";
import { Check, Printer } from "lucide-react";
import { contact } from "@/content/site.config";
import { readStorage, writeStorage } from "@/lib/storage";

export type TickItem = { id: string; label: string; note?: string };

export function TickList({
  items,
  storageKey,
  progress,
  done,
  printLabel,
  printTitle,
}: {
  items: TickItem[];
  storageKey: string;
  /** e.g. "{n} of {total} ready." */
  progress: string;
  done: string;
  printLabel?: string;
  printTitle?: string;
}) {
  const uid = useId();
  const [ticked, setTicked] = useState<string[]>([]);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = (readStorage("session", storageKey) ?? "").split(",").filter(Boolean);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- restore this tab's ticks once
    if (saved.length) setTicked(saved);
  }, [storageKey]);

  const toggle = (id: string, on: boolean) => {
    const next = on ? [...ticked, id] : ticked.filter((t) => t !== id);
    setTicked(next);
    writeStorage("session", storageKey, next.length ? next.join(",") : null);
  };

  const print = () => {
    const el = root.current;
    if (!el) return;
    el.setAttribute("data-print-target", "");
    document.documentElement.dataset.printing = "";
    const done = () => {
      el.removeAttribute("data-print-target");
      delete document.documentElement.dataset.printing;
      window.removeEventListener("afterprint", done);
    };
    window.addEventListener("afterprint", done);
    window.print();
  };

  const n = ticked.length;
  return (
    <div ref={root} className="flex flex-col gap-5">
      {printTitle && <h2 className="print-only h3">{printTitle}</h2>}
      <ul className="grid gap-3 md:grid-cols-2">
        {items.map((it) => (
          <li key={it.id} className="rounded-2xl border border-line bg-white p-4 md:p-5">
            <label className="flex cursor-pointer items-start gap-3.5">
              <input
                type="checkbox"
                className="peer sr-only"
                checked={ticked.includes(it.id)}
                onChange={(e) => toggle(it.id, e.target.checked)}
                aria-describedby={it.note ? `${uid}-${it.id}` : undefined}
              />
              <span
                aria-hidden="true"
                className="tick-box mt-0.5 flex size-7 flex-none items-center justify-center rounded-lg border-2 border-muted bg-white text-transparent transition-colors peer-checked:border-plum-800 peer-checked:bg-plum-800 peer-checked:text-leaf-500 peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-leaf-500"
              >
                <Check size={18} strokeWidth={3} />
              </span>
              <span className="font-semibold text-plum-800">{it.label}</span>
            </label>
            {it.note && (
              <p id={`${uid}-${it.id}`} className="sm muted mt-2 pl-[42px]">
                {it.note}
              </p>
            )}
          </li>
        ))}
      </ul>
      <p aria-live="polite" className="font-semibold text-plum-800 empty:hidden">
        {n === items.length
          ? done
          : n > 0
            ? progress.replace("{n}", String(n)).replace("{total}", String(items.length))
            : ""}
      </p>
      {printLabel && (
        <button type="button" className="btn btn-ghost self-start max-sm:w-full" onClick={print}>
          <Printer aria-hidden size={20} strokeWidth={1.75} />
          {printLabel}
        </button>
      )}
      <p className="print-only sm">From dawsonhomecare.com · {contact.phone.value.display}</p>
    </div>
  );
}
