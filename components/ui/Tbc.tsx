/**
 * Unconfirmed facts (CLAUDE.md "Placeholders"). Renders the .tbc chip only when
 * NEXT_PUBLIC_SHOW_PLACEHOLDERS is on; otherwise nothing, and the surrounding text still reads.
 */
import { flags } from "@/content/site.config";
import type { Para, Tbc as TbcData } from "@/content/services";

export function Tbc({ tbc }: { tbc: TbcData }) {
  if (!flags.showPlaceholders) return null;
  return (
    <>
      {tbc.lead ? `${tbc.lead} ` : ""}
      <span className="tbc">{tbc.chip}</span>
      {tbc.after ?? ""}
    </>
  );
}

/** A paragraph's text plus its optional unconfirmed sentence. */
export function ParaText({ para }: { para: Para }) {
  return (
    <>
      {para.text}
      {para.tbc && flags.showPlaceholders && (
        <>
          {para.text ? " " : ""}
          <Tbc tbc={para.tbc} />
        </>
      )}
    </>
  );
}
