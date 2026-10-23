/**
 * "What we help with" icons, in the design's 3D-icon style (03-personal-care .ic3d): 48 × 48,
 * plum-800 2px outline, orchid-100 body, orchid-500 accent. Personal Care's six are the design's
 * own drawings; the rest follow the icon briefs in COPY_SERVICES. Always aria-hidden.
 */
import type { ServiceIcon as IconId } from "@/content/services";

const L = "fill-orchid-100"; // light body
const A = "fill-orchid-500"; // accent
const W = "fill-white";

const icons: Record<IconId, React.ReactNode> = {
  towel: (
    <>
      <rect x="7" y="27" width="34" height="13" rx="3" className={L} />
      <rect x="10" y="15" width="28" height="12" rx="3" className={A} />
      <path d="M10 21h28M13 33h22" />
      <rect x="13" y="7" width="22" height="8" rx="3" className={L} />
    </>
  ),
  comb: (
    <>
      <rect x="7" y="8" width="11" height="32" rx="3" className={L} />
      <path d="M18 13h5M18 18h5M18 23h5M18 28h5M18 33h5M33 40V24" />
      <rect x="27" y="8" width="14" height="10" rx="2.5" className={A} />
      <path d="M29 18v4h8v-4" />
    </>
  ),
  cardigan: (
    <>
      <path
        d="M17 7 8 12l-3 16 6 2 2-8v19h22V22l2 8 6-2-3-16-9-5c-1 3-3.5 5-7 5s-6-2-7-5Z"
        className={L}
      />
      <path d="M17 7 24 22 31 7M24 22v19" />
      <circle cx="27.5" cy="27" r="1.6" className={A} stroke="none" />
      <circle cx="27.5" cy="33" r="1.6" className={A} stroke="none" />
      <circle cx="27.5" cy="39" r="1.6" className={A} stroke="none" />
    </>
  ),
  door: (
    <>
      <rect x="11" y="5" width="26" height="38" rx="2" className={L} />
      <path d="M6 43h36" />
      <circle cx="31" cy="25" r="1.8" className="fill-plum-800" />
      <circle cx="24" cy="14" r="4.5" className={A} />
    </>
  ),
  plate: (
    <>
      <circle cx="21" cy="26" r="15" className={L} />
      <circle cx="21" cy="26" r="9" className={W} />
      <path d="M41 10v32" />
      <path d="M41 10c-3 0-4.5 3-4.5 7s1.5 6 4.5 6" className={A} />
    </>
  ),
  walker: (
    <>
      <path d="M14 10h20M14 10 10 40M34 10l4 30M12 24h24" />
      <rect x="11" y="7" width="7" height="6" rx="2" className={A} />
      <rect x="30" y="7" width="7" height="6" rx="2" className={A} />
      <circle cx="10" cy="41" r="3" className={L} />
      <circle cx="38" cy="41" r="3" className={L} />
    </>
  ),
  pot: (
    <>
      <path d="M8 22h32v12a6 6 0 0 1-6 6H14a6 6 0 0 1-6-6Z" className={L} />
      <path d="M4 22h4M40 22h4" />
      <rect x="18" y="16" width="12" height="6" rx="2" className={A} />
      <path d="M17 9c0 2 2 2 2 4M24 7c0 2 2 2 2 4M31 9c0 2 2 2 2 4" />
    </>
  ),
  laundry: (
    <>
      <path d="M7 18h34l-4 22H11Z" className={L} />
      <path d="M12 26h24M13 33h22" />
      <path d="M15 18c0-6 4-10 9-10s9 4 9 10" className={A} />
    </>
  ),
  broom: (
    <>
      <path d="M33 5 22 26" />
      <path d="M18 24l10 5-4 13H8Z" className={L} />
      <path d="M12 42l3-9M17 42l2-8M22 42l1-7" />
      <rect x="31" y="34" width="11" height="8" rx="2" className={A} />
    </>
  ),
  grocery: (
    <>
      <path d="M9 16h30l-3 26H12Z" className={L} />
      <path d="M17 16v-3a7 7 0 0 1 14 0v3" />
      <path d="M18 24c0-3 3-5 6-5s6 2 6 5" />
      <circle cx="24" cy="31" r="5" className={A} />
    </>
  ),
  pills: (
    <>
      <rect x="5" y="14" width="38" height="22" rx="4" className={L} />
      <path d="M14.5 14v22M24 14v22M33.5 14v22" />
      <circle cx="9.8" cy="25" r="2.6" className={A} />
      <circle cx="19.2" cy="25" r="2.6" className={A} />
      <circle cx="28.8" cy="25" r="2.6" className={W} />
      <circle cx="38.2" cy="25" r="2.6" className={W} />
    </>
  ),
  calendar: (
    <>
      <rect x="6" y="10" width="36" height="31" rx="4" className={L} />
      <path d="M6 19h36M15 6v8M33 6v8" />
      <path d="m17 30 5 5 9-9" className="stroke-orchid-700" strokeWidth="3" />
    </>
  ),
  cups: (
    <>
      <path d="M5 20h16v12a6 6 0 0 1-6 6h-4a6 6 0 0 1-6-6Z" className={L} />
      <path d="M21 24h2a3 3 0 0 1 0 6h-2" />
      <path d="M25 16h16v12a6 6 0 0 1-6 6h-4a6 6 0 0 1-6-6Z" className={A} />
      <path d="M41 20h2a3 3 0 0 1 0 6h-2M12 10c0 2 2 3 2 5M32 6c0 2 2 3 2 5" />
    </>
  ),
  cards: (
    <>
      <rect
        x="6"
        y="10"
        width="20"
        height="28"
        rx="3"
        transform="rotate(-10 16 24)"
        className={L}
      />
      <rect x="20" y="9" width="20" height="28" rx="3" transform="rotate(8 30 23)" className={W} />
      <path d="M30 18c-2.5-3-6-.5-4 2.5l4 4.5 4-4.5c2-3-1.5-5.5-4-2.5Z" className={A} />
    </>
  ),
  path: (
    <>
      <path d="M16 42c0-8 16-10 16-18s-12-8-12-14" strokeWidth="9" className="stroke-orchid-100" />
      <path d="M11 42c0-8 16-10 16-18s-12-8-12-14M21 42c0-8 16-10 16-18s-12-8-12-14" />
      <circle cx="36" cy="10" r="5" className={A} />
    </>
  ),
  bench: (
    <>
      <circle cx="33" cy="14" r="9" className={L} />
      <path d="M33 23v10" />
      <rect x="5" y="27" width="22" height="5" rx="1.5" className={A} />
      <path d="M7 32v9M25 32v9M5 37h22M4 42h40" />
    </>
  ),
  record: (
    <>
      <rect x="5" y="9" width="38" height="30" rx="4" className={L} />
      <circle cx="21" cy="24" r="11" className={W} />
      <circle cx="21" cy="24" r="3.5" className={A} />
      <path d="M38 13v14l-6 4" />
    </>
  ),
  rocker: (
    <>
      <path d="M13 6h8v24h-8Z" className={L} />
      <path d="M13 30h22v-6" />
      <rect x="15" y="22" width="20" height="8" rx="2" className={A} />
      <path d="M6 40c10 4 26 4 36 0M16 30l-2 12M32 30l2 12" />
    </>
  ),
  clock: (
    <>
      <circle cx="24" cy="25" r="17" className={L} />
      <path d="M24 14v11l7 5" />
      <circle cx="24" cy="25" r="2.5" className={A} />
      <path d="M17 5h14" />
    </>
  ),
  weekend: (
    <>
      <rect x="6" y="10" width="36" height="31" rx="4" className={L} />
      <path d="M6 19h36M15 6v8M33 6v8" />
      <rect x="26" y="24" width="12" height="12" rx="2" className={A} />
      <path d="M12 27h8M12 33h8" />
    </>
  ),
  repeat: (
    <>
      <circle cx="24" cy="24" r="17" className={L} />
      <path d="M14 22a10 10 0 0 1 17-6l3 3M34 26a10 10 0 0 1-17 6l-3-3" />
      <path d="M34 12v7h-7M14 36v-7h7" className="stroke-orchid-700" strokeWidth="2.5" />
    </>
  ),
  planner: (
    <>
      <rect x="9" y="5" width="30" height="38" rx="4" className={L} />
      <path d="M15 15h18M15 22h18M15 29h10" />
      <circle cx="33" cy="33" r="7" className={A} />
      <path d="M33 30v3l2 2" />
    </>
  ),
  shoulder: (
    <>
      <circle cx="18" cy="13" r="7" className={L} />
      <path d="M5 42c0-10 6-17 13-17s13 7 13 17" className={L} />
      <path d="M26 30c4-4 9-6 14-5l2 6-9 3" className={A} />
    </>
  ),
  moon: (
    <>
      <rect x="6" y="6" width="36" height="36" rx="4" className={L} />
      <path d="M24 6v36M6 24h36" />
      <path d="M33 11a6 6 0 0 0 4 10 7 7 0 1 1-4-10Z" className={A} />
    </>
  ),
  nightlight: (
    <>
      <rect x="22" y="5" width="20" height="38" rx="2" className={L} />
      <circle cx="37" cy="25" r="1.6" className="fill-plum-800" />
      <rect x="6" y="28" width="10" height="13" rx="3" className={A} />
      <path d="M11 22v-3M4 26l-2-2M18 26l2-2" />
    </>
  ),
  pajamas: (
    <>
      <path d="M24 5v5M13 12h22" />
      <path d="M15 12 8 19l4 4 3-3v22h18V20l3 3 4-4-7-7" className={L} />
      <path d="M24 12v30" />
      <path d="M30 8a4 4 0 0 0 3 6 5 5 0 1 1-3-6Z" className={A} />
    </>
  ),
  househeart: (
    <>
      <path d="M6 22 24 7l18 15v19H6Z" className={L} />
      <path
        d="M24 34c-6-4-9-7-9-10a4.5 4.5 0 0 1 9-1 4.5 4.5 0 0 1 9 1c0 3-3 6-9 10Z"
        className={A}
      />
    </>
  ),
  shifts: (
    <>
      <circle cx="24" cy="24" r="17" className={L} />
      <path d="M24 7a17 17 0 0 1 0 34Z" className={A} />
      <path d="M24 14v10l6 4" />
    </>
  ),
  house: (
    <>
      <path d="M6 22 24 7l18 15v19H6Z" className={L} />
      <rect x="19" y="26" width="10" height="15" rx="1.5" className={A} />
      <path d="M12 26h4M32 26h4" />
    </>
  ),
};

export function ServiceIcon({ id }: { id: IconId }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 48 48"
      fill="none"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="stroke-plum-800"
    >
      {icons[id]}
    </svg>
  );
}
