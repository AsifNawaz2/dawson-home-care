"use client";

/**
 * Comfort Controls (07 §17, SPEC §19): text size, high contrast, reduce motion.
 * Saved to localStorage (try/catch) and applied pre-paint by the <head> script.
 * Strings are SPEC Appendix B (proposed — approve before launch).
 * Placement: bottom-left with its label from 768px (SPEC §19); on phones the icon-only button sits
 * bottom-right, above the action bar, so it doesn't cover the Home scenes' progress ticks.
 */
import { useEffect, useId, useRef, useState } from "react";
import { Accessibility, X } from "lucide-react";
import { COMFORT_KEY } from "@/lib/headScript";
import { readStorage, writeStorage } from "@/lib/storage";
import { cn } from "@/lib/cn";

type Prefs = {
  textScale: 1 | 1.12 | 1.25;
  contrast: "normal" | "high";
  motion: "system" | "reduce";
};
const DEFAULTS: Prefs = { textScale: 1, contrast: "normal", motion: "system" };

const SIZES: { value: Prefs["textScale"]; label: string; sample: string }[] = [
  { value: 1, label: "Standard", sample: "A" },
  { value: 1.12, label: "Larger", sample: "A+" },
  { value: 1.25, label: "Largest", sample: "A++" },
];

function apply(p: Prefs) {
  const d = document.documentElement;
  d.style.setProperty("--text-scale", String(p.textScale));
  // Larger text: the desktop header drops its Free Assessment button so the bar still fits.
  if (p.textScale !== 1) d.dataset.textScale = String(p.textScale);
  else delete d.dataset.textScale;
  if (p.contrast === "high") d.dataset.contrast = "high";
  else delete d.dataset.contrast;
  if (p.motion === "reduce") d.dataset.motion = "reduce";
  else delete d.dataset.motion;
  window.dispatchEvent(new Event("dd:comfort-change"));
}

function load(): Prefs {
  try {
    const raw = readStorage("local", COMFORT_KEY);
    const p = raw ? (JSON.parse(raw) as Partial<Prefs>) : {};
    return {
      textScale: p.textScale === 1.12 || p.textScale === 1.25 ? p.textScale : 1,
      contrast: p.contrast === "high" ? "high" : "normal",
      motion: p.motion === "reduce" ? "reduce" : "system",
    };
  } catch {
    return DEFAULTS;
  }
}

export function ComfortControls() {
  const [open, setOpen] = useState(false);
  const [prefs, setPrefs] = useState<Prefs>(DEFAULTS);
  const panelId = useId();
  const headingId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Sync React state with what the head script already applied.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPrefs(load());
  }, []);

  const update = (next: Partial<Prefs>) => {
    const p = { ...prefs, ...next };
    setPrefs(p);
    apply(p);
    writeStorage("local", COMFORT_KEY, JSON.stringify(p));
  };

  useEffect(() => {
    if (!open) return;
    panelRef.current?.querySelector<HTMLElement>("input,button")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (!panelRef.current?.contains(t) && !triggerRef.current?.contains(t)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  const close = () => {
    setOpen(false);
    triggerRef.current?.focus();
  };

  return (
    <div
      data-comfort=""
      className="fixed right-4 bottom-[calc(var(--mbar-h)+16px+env(safe-area-inset-bottom))] z-[210] md:right-auto md:left-4 print:hidden"
    >
      <div
        id={panelId}
        ref={panelRef}
        role="dialog"
        aria-modal="false"
        aria-labelledby={headingId}
        hidden={!open}
        className="absolute right-0 bottom-[calc(100%+12px)] w-[min(360px,calc(100vw-32px))] rounded-[20px] border border-line bg-white p-6 text-ink shadow-[0_24px_64px_rgb(42_24_86/0.16)] md:right-auto md:left-0"
      >
        <div className="flex items-start justify-between gap-4">
          <h2 id={headingId} className="h3">
            Comfort settings
          </h2>
          <button type="button" className="iconbtn -mt-1 -mr-1" aria-label="Close" onClick={close}>
            <X aria-hidden size={20} strokeWidth={2} />
          </button>
        </div>

        <fieldset className="mt-4 flex flex-col gap-2 border-0 p-0">
          <legend className="lbl mb-2">Text size</legend>
          {SIZES.map((s) => (
            <label key={s.value} className="opt opt-sm !min-h-14 !py-2">
              <input
                type="radio"
                name="comfort-text-size"
                checked={prefs.textScale === s.value}
                onChange={() => update({ textScale: s.value })}
              />
              <span className="rdot" aria-hidden />
              <span className="otl">{s.label}</span>
              <span
                aria-hidden
                className="ff ml-auto text-plum-800"
                style={{ fontSize: `${s.value * 1.25}rem` }}
              >
                {s.sample}
              </span>
            </label>
          ))}
        </fieldset>

        <SwitchRow
          label="High contrast"
          help="Darker borders and underlined links."
          checked={prefs.contrast === "high"}
          onChange={(v) => update({ contrast: v ? "high" : "normal" })}
        />
        <SwitchRow
          label="Reduce motion"
          help="Turns off animation and moving content."
          checked={prefs.motion === "reduce"}
          onChange={(v) => update({ motion: v ? "reduce" : "system" })}
        />

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
          <button
            type="button"
            className="link sm"
            onClick={() => {
              setPrefs(DEFAULTS);
              apply(DEFAULTS);
              writeStorage("local", COMFORT_KEY, null);
            }}
          >
            Reset to default
          </button>
          <button type="button" className="btn btn-ghost !min-h-12 !px-5" onClick={close}>
            Close
          </button>
        </div>
      </div>

      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label="Comfort settings"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex h-14 min-w-14 items-center justify-center gap-2.5 rounded-full bg-plum-800 px-4 font-semibold text-white shadow-[0_12px_32px_rgb(28_15_61/0.28)] transition-colors hover:bg-plum-600 md:pr-6",
        )}
      >
        <Accessibility aria-hidden size={24} strokeWidth={1.75} />
        <span className="sm hidden font-semibold md:inline" aria-hidden>
          Comfort settings
        </span>
      </button>
    </div>
  );
}

function SwitchRow({
  label,
  help,
  checked,
  onChange,
}: {
  label: string;
  help: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  const id = useId();
  return (
    <div className="mt-4 flex items-start justify-between gap-4">
      <div className="flex flex-col">
        <span id={`${id}-l`} className="lbl">
          {label}
        </span>
        <span id={`${id}-h`} className="help">
          {help}
        </span>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-labelledby={`${id}-l`}
        aria-describedby={`${id}-h`}
        className="switch mt-1"
        onClick={() => onChange(!checked)}
      />
    </div>
  );
}
