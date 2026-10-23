// content/blocks.ts — shared by payments.ts and faq.ts
// A Block is one paragraph (string), one bullet list, or one unverified sentence.
// Strings and lists are verified or approved copy and always render.
// Pending blocks contain a [[TO CONFIRM …]] token: they render only when
// NEXT_PUBLIC_SHOW_PLACEHOLDERS=true (localhost + reveal) and never in production.
// `npm run prelaunch` lists every Pending block that is left.

import { flags } from "./site.config";

export type Pending = { text: string; confirmed: false };
export type List = { list: string[] };
export type Block = string | List | Pending;

export type Link = {
  label: string;
  href: string;
  /** Shown as small text after external links, e.g. "goes to medicare.gov". */
  site?: string;
  /** Date an external link and the facts it backs were last checked. Re-check before launch. */
  checked?: string;
};

export const pending = (text: string): Pending => ({ text, confirmed: false });

// One switch for the whole site (content/site.config.ts flags).
export const SHOW_PLACEHOLDERS = flags.showPlaceholders;

export const isPending = (b: Block): b is Pending => typeof b === "object" && "confirmed" in b;

export const isList = (b: Block): b is List => typeof b === "object" && "list" in b;

/** Blocks to render right now. */
export const visibleBlocks = (blocks: Block[]): Block[] =>
  blocks.filter((b) => !isPending(b) || SHOW_PLACEHOLDERS);

/** Item-level gate used by FAQ items and agency questions. */
export const isVisible = (item: { confirmed: boolean; hideUntilConfirmed: boolean }): boolean =>
  item.confirmed || !item.hideUntilConfirmed || SHOW_PLACEHOLDERS;

/** Plain text for search indexes and FAQPage schema (production-visible blocks only). */
export const blocksToText = (blocks: Block[]): string =>
  visibleBlocks(blocks)
    .map((b) => (typeof b === "string" ? b : isList(b) ? b.list.join(". ") : b.text))
    .join(" ");
