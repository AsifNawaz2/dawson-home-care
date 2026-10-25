/**
 * The logo's traced shapes, once per page (root layout). Every <Logo> on the page `<use>`s
 * them by id (`#ddl-<key>`) and sets its own fill and stroke, so tones and motion still work
 * per instance. Not display:none — some browsers won't render <use> of hidden content.
 */
import { LOGO_FILLS, type LogoFillKey } from "./logo-paths";

export function LogoSprite() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width="0"
      height="0"
      style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}
    >
      <defs>
        {(Object.keys(LOGO_FILLS) as LogoFillKey[]).map((k) => (
          <path key={k} id={`ddl-${k}`} d={LOGO_FILLS[k]} />
        ))}
      </defs>
    </svg>
  );
}
