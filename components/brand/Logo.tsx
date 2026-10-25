/**
 * Dawson & Dawson logo — faithful SVG rebuild of the client's logo (BUILD_DECISIONS §H answer 8),
 * recolored to the locked tokens (BRAND_FINAL §3). Server-renderable (no hooks): motion lives in
 * LogoMotion.tsx and targets the `data-part` groups below.
 *
 * Variants (BRAND_FINAL §3.2):
 *   stacked     — the full lockup as the client knows it (mark over name). Header + footer.
 *   horizontal  — mark left, name right. Email signatures, PDFs.
 *   mark        — house, window, figure and hands. Compact uses.
 *   mark-small  — simplified, thicker cut for ≤32px (favicon, app icons). No hands.
 * Tones: default · reversed (plum-950 only) · mono-plum · mono-cream.
 * Figure: "a" (wheelchair, live) · "b" (two people, behind NEXT_PUBLIC_LOGO_FIGURE).
 *
 * The big traced shapes (hands, wordmark, figure…) are drawn once per page by <LogoSprite />
 * (root layout) and each logo `<use>`s them — a page carries several logos (header, footer,
 * curtain, photo slots), and inlining ~33 KB of path data in each made the HTML heavy.
 * Standalone files (npm run logos) pass `paths` to inline them instead.
 */
import { LOGO_GLASS, LOGO_LINES, type LogoFillKey } from "./logo-paths";

export type LogoVariant = "stacked" | "horizontal" | "mark" | "mark-small";
export type LogoTone = "default" | "reversed" | "mono-plum" | "mono-cream";
export type LogoFigure = "a" | "b";
type Paths = Record<LogoFillKey, string>;

/** One traced shape: a <use> of the page's sprite, or the path itself in standalone files. */
function Shape({
  k,
  paths,
  ...rest
}: { k: LogoFillKey; paths?: Paths } & React.SVGProps<SVGPathElement>) {
  if (paths) return <path d={paths[k]} {...rest} />;
  return <use href={`#ddl-${k}`} {...(rest as React.SVGProps<SVGUseElement>)} />;
}

const T = {
  plum950: "#1C0F3D",
  plum800: "#2A1856",
  plum600: "#4B2E91",
  plum100: "#EEE9F8",
  orchid500: "#C25BD9",
  orchid700: "#8E3BA8",
  orchid100: "#F6EAFB",
  leaf500: "#94C723",
  cream: "#FBF8F3",
  white: "#FFFFFF",
} as const;

export type LogoColors = {
  roof: string;
  inner: string;
  window: string;
  glass: string | null;
  figure: string;
  figureOutline: string | null;
  hands: string;
  name: string;
  and: string;
  desc: string;
  line: string;
  pulse: string;
};

export function logoColors(tone: LogoTone): LogoColors {
  switch (tone) {
    case "reversed":
      return {
        roof: T.cream,
        inner: T.plum100,
        window: T.cream,
        glass: T.orchid100,
        figure: T.leaf500,
        figureOutline: null,
        hands: T.orchid100,
        name: T.cream,
        and: T.orchid500,
        desc: T.orchid500,
        line: T.orchid500,
        pulse: T.leaf500,
      };
    case "mono-plum":
    case "mono-cream": {
      const c = tone === "mono-plum" ? T.plum800 : T.cream;
      return {
        roof: c,
        inner: c,
        window: c,
        glass: null,
        figure: c,
        figureOutline: null,
        hands: c,
        name: c,
        and: c,
        desc: c,
        line: c,
        pulse: c,
      };
    }
    default:
      return {
        roof: T.plum800,
        inner: T.plum600,
        window: T.plum800,
        glass: T.white,
        figure: T.leaf500,
        figureOutline: T.plum800,
        hands: T.orchid700,
        name: T.plum800,
        and: T.orchid700,
        desc: T.orchid700,
        line: T.orchid500,
        pulse: T.leaf500,
      };
  }
}

/* Option B — two people under the roof; the arm and bodies leave a heart-shaped space. */
const FIGURE_B = {
  caregiverHead: { cx: 590, cy: 232, r: 50 },
  caregiverBody:
    "M532 318C552 300 628 300 648 318C676 430 682 590 678 745L518 745C514 590 512 430 532 318Z",
  lovedHead: { cx: 792, cy: 398, r: 44 },
  lovedBody:
    "M744 476C762 460 822 460 840 476C864 562 868 662 864 745L720 745C716 662 722 562 744 476Z",
  arm: "M640 332C702 342 782 402 834 472C848 490 844 508 828 514C814 520 802 508 792 496C750 442 692 394 632 374Z",
  heart:
    "M699 668C660 638 646 620 646 600C646 582 659 570 675 570C687 570 695 577 699 586C703 577 711 570 723 570C739 570 752 582 752 600C752 620 738 638 699 668Z",
};

/* Small-size mark: same parts, thicker (BRAND_FINAL: ≤32px cut, strokes ≈ H/12). */
const SMALL_STROKE = 26;

const VIEWBOX: Record<LogoVariant, string> = {
  stacked: "40 28 1920 1046",
  horizontal: "0 0 2400 330",
  mark: "480 24 1060 790",
  "mark-small": "476 -83 960 960",
};

export const LOGO_ASPECT: Record<LogoVariant, number> = {
  stacked: 1920 / 1046,
  horizontal: 2400 / 330,
  mark: 1060 / 790,
  "mark-small": 1,
};

type LogoProps = {
  variant?: LogoVariant;
  tone?: LogoTone;
  figure?: LogoFigure;
  /** Unique per instance on a page (masks need ids). */
  uid: string;
  /**
   * Render both figures; html[data-logo-figure] picks the visible one (default from
   * NEXT_PUBLIC_LOGO_FIGURE, overridden for this tab by the /reveal-notes A/B toggle).
   */
  switchable?: boolean;
  /** Header instance that runs the first-visit intro: adds the draw-in reveal masks. */
  intro?: boolean;
  /** Standalone use (no wrapping link): gives the SVG role="img" + <title>. */
  title?: string;
  /** Inline the traced shapes (static files, no <LogoSprite /> on the page). */
  paths?: Paths;
  className?: string;
  style?: React.CSSProperties;
};

export function Logo({
  variant = "stacked",
  tone = "default",
  figure = "a",
  uid,
  switchable = false,
  intro = false,
  title,
  paths,
  className,
  style,
}: LogoProps) {
  const c = logoColors(tone);
  const id = (s: string) => `${uid}-${s}`;
  const a11y = title
    ? ({ role: "img", "aria-labelledby": id("title") } as const)
    : ({ "aria-hidden": true, focusable: "false" } as const);

  const mark = (
    <Mark
      c={c}
      figure={switchable ? "both" : figure}
      id={id}
      intro={intro}
      small={variant === "mark-small"}
      paths={paths}
    />
  );
  const word = <Wordmark c={c} intro={intro} paths={paths} />;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={VIEWBOX[variant]}
      className={["dd-logo", intro ? "logo--intro" : "", className].filter(Boolean).join(" ")}
      data-variant={variant}
      data-tone={tone}
      style={style}
      {...a11y}
    >
      {title ? <title id={id("title")}>{title}</title> : null}
      {variant === "stacked" && (
        <>
          {mark}
          {word}
        </>
      )}
      {variant === "horizontal" && (
        <>
          <g transform="scale(0.4325) translate(-495 -37)">{mark}</g>
          <g transform="translate(437 -759)">{word}</g>
        </>
      )}
      {(variant === "mark" || variant === "mark-small") && mark}
    </svg>
  );
}

function RevealMask({ id, d, width }: { id: string; d: string; width: number }) {
  return (
    <mask id={id} maskUnits="userSpaceOnUse" x="0" y="-200" width="2400" height="1400">
      <path
        d={d}
        data-reveal=""
        pathLength={1}
        fill="none"
        stroke="#fff"
        strokeWidth={width}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="1 1"
        strokeDashoffset="0"
      />
    </mask>
  );
}

function Mark({
  c,
  figure,
  id,
  intro,
  small,
  paths,
}: {
  c: LogoColors;
  figure: LogoFigure | "both";
  id: (s: string) => string;
  intro: boolean;
  small: boolean;
  paths?: Paths;
}) {
  const thick = small
    ? { stroke: "currentColor", strokeWidth: SMALL_STROKE, strokeLinejoin: "round" as const }
    : {};
  const outline = c.figureOutline && !small ? c.figureOutline : null;
  const figureStroke = outline
    ? {
        stroke: outline,
        strokeWidth: 28,
        strokeLinejoin: "round" as const,
        paintOrder: "stroke" as const,
      }
    : small
      ? { stroke: c.figure, strokeWidth: SMALL_STROKE, strokeLinejoin: "round" as const }
      : {};
  return (
    <g data-part="mark">
      <defs>
        {intro && (
          <>
            <RevealMask id={id("rv-roof")} d={LOGO_LINES.roofReveal} width={90} />
            <RevealMask id={id("rv-inner")} d={LOGO_LINES.innerRoofReveal} width={90} />
            <RevealMask id={id("rv-window")} d={LOGO_LINES.windowReveal} width={44} />
          </>
        )}
        {figure !== "a" && (
          <mask
            id={id("heart")}
            maskUnits="userSpaceOnUse"
            x="400"
            y="100"
            width="600"
            height="700"
          >
            <rect x="400" y="100" width="600" height="700" fill="#fff" />
            <path d={FIGURE_B.heart} fill="#000" />
          </mask>
        )}
      </defs>
      <g data-part="house">
        <g data-part="house-roof">
          <Shape
            k="roof"
            paths={paths}
            fill={c.roof}
            style={{ color: c.roof }}
            {...thick}
            mask={intro ? `url(#${id("rv-roof")})` : undefined}
          />
          <Shape
            k="innerRoof"
            paths={paths}
            fill={c.inner}
            style={{ color: c.inner }}
            {...thick}
            mask={intro ? `url(#${id("rv-inner")})` : undefined}
          />
        </g>
        {c.glass && (
          <rect
            data-part="window-light"
            x={LOGO_GLASS.x}
            y={LOGO_GLASS.y}
            width={LOGO_GLASS.width}
            height={LOGO_GLASS.height}
            rx={LOGO_GLASS.rx}
            fill={c.glass}
          />
        )}
        {intro && (
          <circle
            data-part="window-glow"
            cx={1044}
            cy={314}
            r={150}
            fill={T.orchid500}
            fillOpacity={0.15}
            style={{ filter: "blur(40px)" }}
          />
        )}
        <Shape
          k="window"
          paths={paths}
          data-part="window"
          fill={c.window}
          style={{ color: c.window }}
          {...(small ? { stroke: "currentColor", strokeWidth: 14 } : {})}
          mask={intro ? `url(#${id("rv-window")})` : undefined}
        />
      </g>
      {!small && (
        <g data-part="hands">
          <Shape k="hands" paths={paths} fill={c.hands} />
        </g>
      )}
      <g data-part="figure" style={{ transformOrigin: "50% 100%", transformBox: "fill-box" }}>
        {figure !== "b" && (
          <Shape
            k="figureA"
            paths={paths}
            fill={c.figure}
            {...figureStroke}
            data-fig={figure === "both" ? "a" : undefined}
          />
        )}
        {figure !== "a" && (
          <g mask={`url(#${id("heart")})`} data-fig={figure === "both" ? "b" : undefined}>
            <g data-part="figure-caregiver">
              <circle {...FIGURE_B.caregiverHead} fill={c.figure} {...figureStroke} />
              <path d={FIGURE_B.caregiverBody} fill={c.figure} {...figureStroke} />
              <path d={FIGURE_B.arm} fill={c.figure} {...figureStroke} />
            </g>
            <g data-part="figure-loved-one">
              <circle {...FIGURE_B.lovedHead} fill={c.figure} {...figureStroke} />
              <path d={FIGURE_B.lovedBody} fill={c.figure} {...figureStroke} />
            </g>
          </g>
        )}
      </g>
    </g>
  );
}

function Wordmark({ c, intro, paths }: { c: LogoColors; intro: boolean; paths?: Paths }) {
  const line = {
    fill: "none",
    stroke: c.line,
    strokeWidth: 6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    pathLength: 1,
    strokeDasharray: intro ? "1 1" : undefined,
  };
  return (
    <g data-part="wordmark">
      <g data-part="heartbeat">
        <path d={LOGO_LINES.heartbeatLeft} {...line} />
        <path d={LOGO_LINES.heartbeatRight} {...line} />
      </g>
      <g data-part="heartbeat-pulse" aria-hidden="true">
        <path
          d={LOGO_LINES.heartbeatLeft}
          {...line}
          stroke={c.pulse}
          strokeWidth={8}
          strokeDasharray={undefined}
        />
        <path
          d={LOGO_LINES.heartbeatRight}
          {...line}
          stroke={c.pulse}
          strokeWidth={8}
          strokeDasharray={undefined}
        />
      </g>
      <g data-part="wordmark-name">
        <Shape k="nameDark" paths={paths} fill={c.name} />
        <Shape k="nameAnd" paths={paths} fill={c.and} />
      </g>
      <g data-part="wordmark-descriptor">
        <path d={LOGO_LINES.bar} fill="none" stroke={c.desc} strokeWidth={10} />
        <Shape k="homeCare" paths={paths} fill={c.desc} />
        <Shape k="llc" paths={paths} fill={c.desc} />
      </g>
    </g>
  );
}
