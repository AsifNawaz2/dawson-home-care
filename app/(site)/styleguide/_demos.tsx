"use client";

import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { LOGO_INTRO_KEY } from "@/lib/headScript";
import { writeStorage } from "@/lib/storage";

export function SwitchDemo({ label, initial = false }: { label: string; initial?: boolean }) {
  const [on, setOn] = useState(initial);
  return (
    <div className="flex items-center gap-4">
      <button
        type="button"
        role="switch"
        aria-checked={on}
        aria-label={label}
        className="switch"
        onClick={() => setOn(!on)}
      />
      <span className="sm">{on ? "On" : "Off"}</span>
    </div>
  );
}

export function SliderDemo() {
  const [v, setV] = useState(4);
  const pct = Math.round(((v - 2) / 22) * 100);
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between">
        <label htmlFor="sg-slider" className="lbl">
          Hours per visit
        </label>
        <span className="font-bold text-plum-800">{v} hours</span>
      </div>
      <div className="relative">
        <div
          aria-hidden
          className="absolute inset-x-0 top-5 h-2 overflow-hidden rounded-full border-[1.5px] border-muted"
        >
          <div className="h-full bg-plum-800" style={{ width: `${pct}%` }} />
        </div>
        <input
          id="sg-slider"
          className="dd-range"
          type="range"
          min={2}
          max={24}
          step={1}
          value={v}
          aria-valuetext={`${v} hours per visit`}
          onChange={(e) => setV(Number(e.target.value))}
        />
      </div>
    </div>
  );
}

export function AnswerDemo() {
  const [picked, setPicked] = useState<string | null>("parent");
  const opts = [
    ["parent", "My parent"],
    ["spouse", "My spouse or partner"],
  ] as const;
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {opts.map(([v, l]) => (
        <button
          key={v}
          type="button"
          className="ans"
          aria-pressed={picked === v}
          onClick={() => setPicked(v)}
        >
          <span className="flex-1">{l}</span>
        </button>
      ))}
    </div>
  );
}

export function ReplayIntro() {
  return (
    <button
      type="button"
      className="btn btn-ghost"
      onClick={() => {
        writeStorage("session", LOGO_INTRO_KEY, null);
        window.scrollTo(0, 0);
        window.location.reload();
      }}
    >
      <RotateCcw aria-hidden size={18} strokeWidth={1.75} />
      Replay the logo intro
    </button>
  );
}

export function FigureToggle({ a, b }: { a: React.ReactNode; b: React.ReactNode }) {
  const [fig, setFig] = useState<"a" | "b">("a");
  return (
    <div className="flex flex-col gap-4">
      <div role="group" aria-label="Logo figure" className="flex flex-wrap gap-3">
        {(["a", "b"] as const).map((f) => (
          <button
            key={f}
            type="button"
            aria-pressed={fig === f}
            onClick={() => setFig(f)}
            className={fig === f ? "btn btn-secondary" : "btn btn-ghost"}
          >
            Option {f.toUpperCase()} {f === "a" ? "· live" : "· softened figure"}
          </button>
        ))}
      </div>
      <div className="rounded-[20px] border border-line bg-white p-8">{fig === "a" ? a : b}</div>
    </div>
  );
}
