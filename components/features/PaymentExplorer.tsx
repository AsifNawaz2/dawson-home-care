"use client";

/**
 * Payment Explorer (SPEC 07 §6, COPY_COST_FAQ "02 — Payment Explorer"; data: content/payments.ts).
 *
 *  - "Not sure where to start?" ticks highlight matching options ("Worth a look") and open the
 *    first match. Ticks stay on the page — never saved or sent.
 *  - ≥ 900px: WAI-ARIA tabs (automatic activation, arrows + Home/End), 200ms crossfade.
 *    Phones: the same panels as an accordion, several open at once.
 *    Server render / no JS: all five panels stacked, each with its H3.
 *  - Deep links #pay-private … open that panel and move focus to its heading.
 *  - Each panel opened is added to sessionStorage `payment_explored` (sent with a lead).
 * Styled from the design's quiz cards and chips (BUILD_DECISIONS §E).
 */
import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { ChevronDown, CircleSlash, MessageCircleQuestion, Phone, Sparkles } from "lucide-react";
import { narrowDown, paymentOptions, type PaymentId, type PaymentOption } from "@/content/payments";
import { contact } from "@/content/site.config";
import { readStorage, writeStorage } from "@/lib/storage";
import { isReducedMotion } from "@/lib/motionMode";
import { cn } from "@/lib/cn";
import { joinAnd } from "@/components/forms/FormBits";
import { AssessmentButton } from "@/components/ui/AssessmentButton";
import { Blocks, ExtLink } from "@/components/ui/Blocks";

const phone = contact.phone.value;
export const PAYMENT_EXPLORED_KEY = "payment_explored";

type Mode = "static" | "tabs" | "accordion";
const WIDE = "(min-width: 900px)";
const subscribe = (cb: () => void) => {
  const m = window.matchMedia(WIDE);
  m.addEventListener("change", cb);
  return () => m.removeEventListener("change", cb);
};
const useMode = () =>
  useSyncExternalStore<Mode>(
    subscribe,
    () => (window.matchMedia(WIDE).matches ? "tabs" : "accordion"),
    () => "static",
  );

function logExplored(id: PaymentId) {
  const cur = (readStorage("session", PAYMENT_EXPLORED_KEY) ?? "").split(",").filter(Boolean);
  if (!cur.includes(id)) writeStorage("session", PAYMENT_EXPLORED_KEY, [...cur, id].join(","));
}

function Chip({ text, kind }: { text: string; kind: "stance" | "match" }) {
  const Icon =
    kind === "match"
      ? Sparkles
      : text === "Usually not covered"
        ? CircleSlash
        : MessageCircleQuestion;
  return (
    <span
      className={cn(
        "inline-flex min-h-7 items-center gap-1.5 rounded-full px-3 text-base font-semibold whitespace-nowrap",
        kind === "match" ? "bg-leaf-100 text-leaf-700" : "bg-orchid-100 text-orchid-700",
      )}
    >
      <Icon aria-hidden size={16} strokeWidth={2} />
      {text}
    </span>
  );
}

function H4({ children }: { children: React.ReactNode }) {
  return <h4 className="mt-2 text-[1.25rem] font-bold text-plum-800">{children}</h4>;
}

function Panel({
  o,
  headingTag,
  showTitle = true,
}: {
  o: PaymentOption;
  headingTag: boolean;
  showTitle?: boolean;
}) {
  return (
    <div className="flex flex-col gap-4">
      {showTitle &&
        (headingTag ? (
          <h3
            id={o.anchor}
            tabIndex={-1}
            className="h3 scroll-mt-[calc(var(--header-h)+24px)] outline-none"
          >
            {o.title}
          </h3>
        ) : (
          <p className="h3">{o.title}</p>
        ))}
      <p className="lead">{o.summary}</p>
      <H4>What it is</H4>
      <Blocks blocks={o.whatItIs} />
      {o.routes && (
        <div className="grid gap-4 md:grid-cols-2">
          {o.routes.map((r) => (
            <div
              key={r.title}
              className="flex flex-col gap-3 rounded-2xl border border-line bg-white p-5"
            >
              <h4 className="text-[1.25rem] font-bold text-plum-800">{r.title}</h4>
              <Blocks blocks={r.body} />
              {r.link && <ExtLink {...r.link} />}
            </div>
          ))}
        </div>
      )}
      <H4>How it usually works</H4>
      <Blocks blocks={o.howItWorks} />
      {o.comparison && (
        <div
          className="overflow-x-auto"
          role="region"
          aria-label={o.comparison.caption}
          tabIndex={0}
        >
          <table className="w-full min-w-[520px] border-collapse text-left">
            <caption className="sm muted mb-2 text-left">{o.comparison.caption}</caption>
            <thead>
              <tr>
                <td />
                {o.comparison.columns.map((c) => (
                  <th
                    key={c}
                    scope="col"
                    className="border-b-2 border-plum-800 px-3 py-2 font-bold text-plum-800"
                  >
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {o.comparison.rows.map((r) => (
                <tr key={r.label} className="border-b border-line">
                  <th scope="row" className="px-3 py-3 align-top font-semibold text-plum-800">
                    {r.label}
                  </th>
                  {r.values.map((v) => (
                    <td key={v} className="px-3 py-3 align-top">
                      {v}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <H4>Good to know</H4>
      <Blocks blocks={o.goodToKnow} />
      <div className="mt-2 flex flex-col gap-3 rounded-2xl bg-plum-100 p-5">
        <div className="flex flex-wrap items-center gap-3">
          <h4 className="text-[1.25rem] font-bold text-plum-800">Does Dawson accept it?</h4>
          <Chip text={o.dawson.chip} kind="stance" />
        </div>
        <Blocks blocks={o.dawson.text} />
      </div>
      {o.learnMore.length > 0 && (
        <>
          <H4>Learn more</H4>
          <ul className="flex flex-col gap-2">
            {o.learnMore.map((l) => (
              <li key={l.href}>
                <ExtLink {...l} />
              </li>
            ))}
          </ul>
        </>
      )}
      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
        <AssessmentButton
          href={o.cta.href}
          open={o.cta.label}
          className="max-sm:w-full max-sm:whitespace-normal"
        />
        <a
          className="btn btn-ghost max-sm:w-full"
          href={`tel:${phone.tel}`}
          data-cursor-label="Call"
        >
          <Phone aria-hidden size={20} strokeWidth={1.75} />
          Call {phone.display}
        </a>
      </div>
    </div>
  );
}

export function PaymentExplorer() {
  const mode = useMode();
  const uid = useId();
  const [ticks, setTicks] = useState<string[]>([]);
  const [active, setActive] = useState<PaymentId>("private-pay");
  const [open, setOpen] = useState<PaymentId[]>(["private-pay"]);
  const [fade, setFade] = useState(false);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const [focusTo, setFocusTo] = useState<string | null>(null);

  // After the opened panel has rendered: bring its heading into view and focus it.
  useEffect(() => {
    if (!focusTo || mode === "static") return;
    const h = document.getElementById(focusTo);
    if (!h) return;
    h.scrollIntoView({ block: "start" });
    h.focus({ preventScroll: true });
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-shot request
    setFocusTo(null);
  }, [focusTo, active, open, mode]);

  const matches: PaymentId[] = narrowDown.options
    .filter((n) => ticks.includes(n.id))
    .map((n) => n.points);
  const matchNames = paymentOptions.filter((o) => matches.includes(o.id)).map((o) => o.tab);

  const show = (id: PaymentId) => {
    logExplored(id);
    if (id !== active && !isReducedMotion()) {
      setFade(true);
      window.setTimeout(() => setFade(false), 200);
    }
    setActive(id);
    setOpen((cur) => (cur.includes(id) ? cur : [...cur, id]));
  };

  // Deep links: #pay-… opens that panel and moves focus to its heading.
  useEffect(() => {
    if (mode === "static") return;
    const go = () => {
      const o = paymentOptions.find((p) => `#${p.anchor}` === window.location.hash);
      if (!o) return;
      show(o.id);
      setFocusTo(o.anchor);
    };
    go();
    window.addEventListener("hashchange", go);
    return () => window.removeEventListener("hashchange", go);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- runs when the layout mode is known
  }, [mode]);

  const tick = (id: string, on: boolean) => {
    const next = on ? [...ticks, id] : ticks.filter((t) => t !== id);
    setTicks(next);
    const first = paymentOptions.find((o) =>
      narrowDown.options.some((n) => next.includes(n.id) && n.points === o.id),
    );
    if (first && on) show(first.id);
  };

  const onKey = (e: React.KeyboardEvent, i: number) => {
    const n = paymentOptions.length;
    const to =
      e.key === "ArrowRight" || e.key === "ArrowDown"
        ? (i + 1) % n
        : e.key === "ArrowLeft" || e.key === "ArrowUp"
          ? (i - 1 + n) % n
          : e.key === "Home"
            ? 0
            : e.key === "End"
              ? n - 1
              : -1;
    if (to < 0) return;
    e.preventDefault();
    show(paymentOptions[to]!.id);
    tabs.current[to]?.focus();
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Not sure where to start? */}
      <fieldset className="flex flex-col gap-4 rounded-[20px] border border-line bg-white p-5 md:p-8">
        <legend className="contents">
          <span className="h3 block">{narrowDown.heading}</span>
        </legend>
        <p>{narrowDown.instruction}</p>
        <div className="grid gap-3 md:grid-cols-2">
          {narrowDown.options.map((n) => (
            <label key={n.id} className="opt opt-sm !items-start">
              <input
                type="checkbox"
                checked={ticks.includes(n.id)}
                onChange={(e) => tick(n.id, e.target.checked)}
              />
              <span className="sbox" aria-hidden="true">
                <svg
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </span>
              <span>{n.label}</span>
            </label>
          ))}
        </div>
        <p aria-live="polite" className="font-semibold text-plum-800">
          {matchNames.length > 0 && narrowDown.result.replace("{options}", joinAnd(matchNames))}
        </p>
        <p className="sm muted">{narrowDown.privacy}</p>
      </fieldset>

      {mode === "static" &&
        paymentOptions.map((o) => (
          <section key={o.id} className="rounded-[20px] border border-line bg-white p-5 md:p-10">
            <Panel o={o} headingTag />
          </section>
        ))}

      {mode === "tabs" && (
        <div className="overflow-hidden rounded-[20px] border border-line bg-white">
          <div
            role="tablist"
            aria-label="Ways to pay"
            className="flex border-b border-line bg-cream"
          >
            {paymentOptions.map((o, i) => {
              const sel = o.id === active;
              return (
                <button
                  key={o.id}
                  ref={(el) => {
                    tabs.current[i] = el;
                  }}
                  type="button"
                  role="tab"
                  id={`${uid}-tab-${o.id}`}
                  aria-selected={sel}
                  aria-controls={`${uid}-panel`}
                  tabIndex={sel ? 0 : -1}
                  onClick={() => show(o.id)}
                  onKeyDown={(e) => onKey(e, i)}
                  className={cn(
                    "relative flex min-h-24 flex-1 flex-col items-start justify-center gap-1.5 px-4 py-3 text-left font-bold text-plum-800 transition-colors",
                    sel
                      ? "bg-white after:absolute after:inset-x-0 after:bottom-0 after:h-1 after:bg-plum-800"
                      : "hover:bg-orchid-100",
                  )}
                >
                  {o.tab}
                  <span className="flex flex-wrap gap-1.5">
                    <Chip text={o.dawson.chip} kind="stance" />
                    {matches.includes(o.id) && <Chip text={narrowDown.matchChip} kind="match" />}
                  </span>
                </button>
              );
            })}
          </div>
          <div
            role="tabpanel"
            id={`${uid}-panel`}
            aria-labelledby={`${uid}-tab-${active}`}
            tabIndex={0}
            className={cn("p-10 transition-opacity duration-200", fade && "opacity-0")}
          >
            <Panel o={paymentOptions.find((o) => o.id === active)!} headingTag />
          </div>
        </div>
      )}

      {mode === "accordion" && (
        <div className="flex flex-col gap-3">
          {paymentOptions.map((o) => {
            const isOpen = open.includes(o.id);
            return (
              <div
                key={o.id}
                className="overflow-hidden rounded-[20px] border border-line bg-white"
              >
                <h3
                  id={o.anchor}
                  tabIndex={-1}
                  className="scroll-mt-[calc(var(--header-h)+24px)] outline-none"
                >
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`${uid}-acc-${o.id}`}
                    onClick={() => (isOpen ? setOpen(open.filter((x) => x !== o.id)) : show(o.id))}
                    className="flex min-h-14 w-full items-center justify-between gap-3 px-5 py-3 text-left"
                  >
                    <span className="flex flex-col items-start gap-1.5">
                      <span className="ff text-[1.5rem] leading-tight text-plum-800">{o.tab}</span>
                      <span className="flex flex-wrap gap-1.5">
                        <Chip text={o.dawson.chip} kind="stance" />
                        {matches.includes(o.id) && (
                          <Chip text={narrowDown.matchChip} kind="match" />
                        )}
                      </span>
                    </span>
                    <ChevronDown
                      aria-hidden
                      size={24}
                      className={cn(
                        "flex-none text-orchid-700 transition-transform reduce-motion:transition-none",
                        isOpen && "rotate-180",
                      )}
                    />
                  </button>
                </h3>
                <div
                  id={`${uid}-acc-${o.id}`}
                  hidden={!isOpen}
                  className="border-t border-line px-5 pt-4 pb-6"
                >
                  <Panel o={o} headingTag={false} showTitle={o.title !== o.tab} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
