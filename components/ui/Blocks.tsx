/**
 * Renders content blocks (content/blocks.ts): a paragraph, a bullet list, or a Pending sentence
 * that shows only while placeholders are on (as a .tbc chip).
 */
import { isList, isPending, visibleBlocks, type Block } from "@/content/blocks";
import { cn } from "@/lib/cn";

/** Words of a Pending block, with the [[TO CONFIRM …]] tokens shown as chips. */
function PendingText({ text }: { text: string }) {
  const parts = text.split(/(\[\[TO CONFIRM[^\]]*\]\])/g);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith("[[TO CONFIRM") ? (
          <span key={i} className="tbc">
            [{p.slice(2, -2).replace(/^TO CONFIRM:?\s*—?\s*/, "")}]
          </span>
        ) : (
          p
        ),
      )}
    </>
  );
}

export function Blocks({
  blocks,
  mark = (t) => t,
  className,
}: {
  blocks: Block[];
  /** Optional highlighter (FAQ search) for plain text. */
  mark?: (text: string) => React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {visibleBlocks(blocks).map((b, i) =>
        typeof b === "string" ? (
          <p key={i} className="max-w-[65ch]">
            {mark(b)}
          </p>
        ) : isList(b) ? (
          <ul
            key={i}
            className="flex max-w-[65ch] list-disc flex-col gap-1.5 pl-6 marker:text-orchid-700"
          >
            {b.list.map((li) => (
              <li key={li}>{mark(li)}</li>
            ))}
          </ul>
        ) : isPending(b) ? (
          <p key={i} className="max-w-[65ch]">
            <PendingText text={b.text} />
          </p>
        ) : null,
      )}
    </div>
  );
}

/** External link + "goes to {site}" (COPY_TRUST pattern). */
export function ExtLink({ label, href, site }: { label: string; href: string; site?: string }) {
  return (
    <span>
      <a href={href} className="font-semibold underline underline-offset-[3px]">
        {label}
      </a>
      {site && <span className="sm muted"> · goes to {site}</span>}
    </span>
  );
}
