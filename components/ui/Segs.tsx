/**
 * Renders text segments (content/towns.ts): plain text always; { chip } as a .tbc chip and
 * { pending } sentences only while placeholders are on — the text reads correctly without them.
 */
import { flags } from "@/content/site.config";
import type { Segs as SegsData } from "@/content/towns";

const Chip = ({ chip }: { chip: string }) => (
  <>
    {" "}
    <span className="tbc">{chip}</span>
  </>
);

export function Segs({ segs }: { segs: SegsData }) {
  return (
    <>
      {segs.map((s, i) =>
        typeof s === "string" ? (
          <span key={i}>{s}</span>
        ) : "chip" in s ? (
          flags.showPlaceholders && <Chip key={i} chip={s.chip} />
        ) : (
          flags.showPlaceholders && (
            <span key={i}>
              {" "}
              {s.pending.map((p, j) =>
                typeof p === "string" ? <span key={j}>{p}</span> : <Chip key={j} chip={p.chip} />,
              )}
            </span>
          )
        ),
      )}
    </>
  );
}

/** Production text of segments (JSON-LD FAQ answers): no chips, no pending sentences. */
export const segsText = (segs: SegsData) =>
  segs
    .filter((s): s is string => typeof s === "string")
    .join("")
    .replace(/\s+/g, " ")
    .trim();
