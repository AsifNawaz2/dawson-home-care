"use client";

/**
 * FAQ live search + grouped accordion (SPEC 07 §14, COPY_COST_FAQ "FAQ — /faq"; data:
 * content/faq.ts). Design: the Home/service FAQ accordion + a search field in the town-search
 * style (BUILD_DECISIONS §E).
 *
 *  - Search is case- and accent-insensitive across the question, the production-visible answer
 *    and hidden keywords; 150ms debounce; matches are marked; empty groups hide; with 5 or fewer
 *    matches the items open.
 *  - Several answers can be open. Open all / Close all. Each answer has "Copy link".
 *  - /faq#{id} opens that answer and focuses its question; /faq#topic-{group} scrolls to the group.
 *  - Height animates in full motion only.
 */
import Link from "next/link";
import { Fragment, useEffect, useId, useMemo, useRef, useState } from "react";
import { ChevronDown, Link2, Search, X } from "lucide-react";
import { faqGroups, faqItems, type FaqItem } from "@/content/faq";
import { blocksToText, isVisible } from "@/content/blocks";
import { contact } from "@/content/site.config";
import { cn } from "@/lib/cn";
import { Blocks } from "@/components/ui/Blocks";

const phone = contact.phone.value;
const items = faqItems.filter(isVisible);
const SITE = "https://dawsonhomecare.com";

const fold = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[’']/g, "'").toLowerCase();
const index = new Map(
  items.map((f) => [
    f.id,
    fold([f.question, blocksToText(f.answer), f.keywords.join(" ")].join(" ")),
  ]),
);

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Wraps matched words in <mark>, ignoring case and accents. */
function highlighter(terms: string[]) {
  if (!terms.length) return (t: string) => t;
  return (text: string): React.ReactNode => {
    const folded = fold(text);
    const re = new RegExp(terms.map(escapeRe).join("|"), "g");
    const out: React.ReactNode[] = [];
    let last = 0;
    for (const m of folded.matchAll(re)) {
      const i = m.index ?? 0;
      if (i > last) out.push(text.slice(last, i));
      out.push(<mark key={i}>{text.slice(i, i + m[0].length)}</mark>);
      last = i + m[0].length;
    }
    if (last < text.length) out.push(text.slice(last));
    return out.length ? out : text;
  };
}

export function FaqSearch() {
  const uid = useId();
  const [q, setQ] = useState("");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<string[]>([]);
  const [copied, setCopied] = useState<string | null>(null);
  const [announce, setAnnounce] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const [focusTo, setFocusTo] = useState<string | null>(null);

  // After the item has rendered open: scroll it below the header and focus its question.
  useEffect(() => {
    if (!focusTo) return;
    const el = document.getElementById(focusTo);
    if (!el) return;
    el.scrollIntoView({ block: "start" });
    el.querySelector<HTMLButtonElement>("button")?.focus({ preventScroll: true });
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-shot request
    setFocusTo(null);
  }, [focusTo, open, query]);

  // Debounce typing.
  useEffect(() => {
    const t = window.setTimeout(() => setQuery(q.trim()), 150);
    return () => clearTimeout(t);
  }, [q]);

  const terms = useMemo(
    () =>
      fold(query)
        .split(/\s+/)
        .filter((w) => w.length > 1),
    [query],
  );
  const hits = useMemo(
    () =>
      terms.length ? items.filter((f) => terms.every((t) => index.get(f.id)!.includes(t))) : items,
    [terms],
  );
  const mark = useMemo(() => highlighter(terms), [terms]);

  // ≤ 5 matches open automatically; announce the count.
  useEffect(() => {
    if (!terms.length) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- follows the debounced query
    if (hits.length <= 5) setOpen(hits.map((h) => h.id));
    setAnnounce(
      hits.length === 0
        ? ""
        : hits.length === 1
          ? `1 question matches "${query}".`
          : `${hits.length} questions match "${query}".`,
    );
  }, [hits, terms, query]);

  // Deep links.
  useEffect(() => {
    const go = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (!id) return;
      if (items.some((f) => f.id === id)) {
        // A search could be hiding it — clear the search first.
        setQ("");
        setQuery("");
        setOpen((o) => (o.includes(id) ? o : [...o, id]));
        setFocusTo(id);
      }
    };
    go();
    window.addEventListener("hashchange", go);
    return () => window.removeEventListener("hashchange", go);
  }, []);

  const toggle = (id: string) =>
    setOpen((o) => (o.includes(id) ? o.filter((x) => x !== id) : [...o, id]));
  const copy = async (id: string) => {
    try {
      await navigator.clipboard.writeText(`${SITE}/faq#${id}`);
      setCopied(id);
      window.setTimeout(() => setCopied((c) => (c === id ? null : c)), 2000);
    } catch {}
  };

  const shownGroups = faqGroups.filter((g) => hits.some((h) => h.group === g.id));

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-5">
        <form
          role="search"
          onSubmit={(e) => e.preventDefault()}
          className="flex flex-col gap-2.5 rounded-[20px] border border-line bg-white p-[22px] lg:p-8"
        >
          <label htmlFor={`${uid}-q`} className="ff text-[1.5rem] text-plum-800">
            Search questions
          </label>
          <p id={`${uid}-help`} className="sm muted">
            Try &ldquo;cost&rdquo;, &ldquo;nights&rdquo; or &ldquo;Medicare&rdquo;.
          </p>
          <div className="relative flex gap-2.5">
            <Search
              aria-hidden
              size={22}
              strokeWidth={1.75}
              className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-muted"
            />
            <input
              ref={input}
              id={`${uid}-q`}
              type="search"
              className="field min-w-0 flex-1 !pl-12"
              autoComplete="off"
              enterKeyHint="search"
              value={q}
              aria-describedby={`${uid}-help ${uid}-res`}
              onChange={(e) => setQ(e.target.value)}
            />
            {q && (
              <button
                type="button"
                className="btn btn-ghost flex-none !px-4"
                onClick={() => {
                  setQ("");
                  setQuery("");
                  setOpen([]);
                  setAnnounce("");
                  input.current?.focus();
                }}
              >
                <X aria-hidden size={20} strokeWidth={2} />
                Clear search
              </button>
            )}
          </div>
          <div id={`${uid}-res`}>
            <p className="font-semibold text-plum-800 empty:hidden" aria-live="polite">
              {terms.length > 0 && hits.length > 0 ? announce : ""}
            </p>
            {terms.length > 0 && hits.length === 0 && (
              <div role="status" className="mt-1 rounded-xl bg-plum-100 px-4 py-3.5">
                <p>
                  No questions match &ldquo;{query}&rdquo;. Try another word, or call{" "}
                  <a href={`tel:${phone.tel}`} data-cursor-label="Call" className="font-semibold">
                    {phone.display}
                  </a>{" "}
                  — we&apos;ll answer it.
                </p>
              </div>
            )}
          </div>
        </form>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <nav aria-label="Topics">
            <ul className="flex flex-wrap gap-2.5">
              {faqGroups.map((g) => (
                <li key={g.id}>
                  <a
                    href={`#topic-${g.id}`}
                    className="inline-flex min-h-12 items-center rounded-full border-[1.5px] border-muted bg-white px-4 font-semibold text-plum-800 no-underline transition-colors hover:border-orchid-500 hover:bg-orchid-100"
                  >
                    {g.title.replace(" questions", "")}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex gap-6">
            <button type="button" className="link" onClick={() => setOpen(hits.map((h) => h.id))}>
              Open all
            </button>
            <button type="button" className="link" onClick={() => setOpen([])}>
              Close all
            </button>
          </div>
        </div>
      </div>

      {shownGroups.map((g) => (
        <section
          key={g.id}
          id={`topic-${g.id}`}
          aria-labelledby={`${uid}-${g.id}`}
          className="grid scroll-mt-[calc(var(--header-h)+24px)] gap-4 lg:grid-cols-[320px_minmax(0,1fr)] lg:gap-12"
        >
          <div className="flex flex-col gap-2">
            <h2 id={`${uid}-${g.id}`} className="h2 !text-[2.25rem] lg:!text-[2.375rem]">
              {g.title}
            </h2>
            <p className="sm muted">{g.intro}</p>
          </div>
          <div className="border-t border-line">
            {hits
              .filter((f) => f.group === g.id)
              .map((f) => (
                <FaqRow
                  key={f.id}
                  f={f}
                  open={open.includes(f.id)}
                  onToggle={() => toggle(f.id)}
                  mark={mark}
                  copied={copied === f.id}
                  onCopy={() => copy(f.id)}
                />
              ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function FaqRow({
  f,
  open,
  onToggle,
  mark,
  copied,
  onCopy,
}: {
  f: FaqItem;
  open: boolean;
  onToggle: () => void;
  mark: (t: string) => React.ReactNode;
  copied: boolean;
  onCopy: () => void;
}) {
  const pending = !f.confirmed && f.hideUntilConfirmed;
  return (
    <div id={f.id} className="scroll-mt-[calc(var(--header-h)+16px)] border-b border-line">
      <h3>
        <button
          type="button"
          className="faq-q"
          aria-expanded={open}
          aria-controls={`${f.id}-a`}
          onClick={onToggle}
        >
          <span>
            {mark(f.question)}
            {pending && <span className="tbc ml-2">Hidden until confirmed</span>}
          </span>
          <ChevronDown
            aria-hidden
            size={24}
            strokeWidth={2}
            className={cn(
              "flex-none text-orchid-700 transition-transform duration-300 reduce-motion:transition-none",
              open && "rotate-180",
            )}
          />
        </button>
      </h3>
      <div id={`${f.id}-a`} className="faq-a" data-open={open} hidden={!open}>
        <div className="flex flex-col gap-3 pb-7">
          <Blocks blocks={f.answer} mark={(t) => <Fragment>{mark(t)}</Fragment>} />
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {f.link && (
              <Link className="link" href={f.link.href}>
                {f.link.label}
              </Link>
            )}
            <button
              type="button"
              className="link sm inline-flex items-center gap-1.5"
              onClick={onCopy}
            >
              <Link2 aria-hidden size={18} strokeWidth={1.75} />
              <span aria-live="polite">{copied ? "Link copied" : "Copy link"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
