/**
 * Exports static logo files + favicon/app icons from components/brand/Logo.tsx (one source).
 *   /public/logo/*.svg          — every version × tone (BRAND_FINAL §3.2 file names)
 *   app/icon.svg                — small mark, switches to cream in dark browser UI
 *   app/apple-icon.png          — 180×180 on cream, mark at 70%
 *   app/favicon.ico             — 16/32/48 from the small mark
 *   public/icons/icon-192.png, icon-512.png (maskable, cream)
 * Run: npm run logos
 */
import { mkdir, writeFile } from "node:fs/promises";
import { renderToStaticMarkup } from "react-dom/server";
import sharp from "sharp";
import { Logo, type LogoFigure, type LogoTone, type LogoVariant } from "../components/brand/Logo";

const CREAM = "#FBF8F3";

function svg(variant: LogoVariant, tone: LogoTone, figure: LogoFigure = "a") {
  const markup = renderToStaticMarkup(
    <Logo
      variant={variant}
      tone={tone}
      figure={figure}
      uid={`dd-${variant}-${tone}`}
      title="Dawson & Dawson Home Care"
    />,
  );
  // Static files keep BRAND_FINAL's ids (React uses data-part to avoid duplicate ids on a page).
  return `<?xml version="1.0" encoding="UTF-8"?>\n${markup.replace(/data-part="([^"]+)"/g, 'id="$1"')}`;
}

async function png(markup: string, size: number, bg: string | null, scale = 1) {
  const inner = Math.round(size * scale);
  const icon = await sharp(Buffer.from(markup), { density: 600 })
    .resize(inner, inner, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  return sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: bg ?? { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([{ input: icon, gravity: "center" }])
    .png()
    .toBuffer();
}

/** Minimal ICO writer: PNG-compressed entries (supported by every current browser). */
function ico(images: { size: number; data: Buffer }[]) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);
  const dir = Buffer.alloc(16 * images.length);
  let offset = 6 + dir.length;
  images.forEach((img, i) => {
    const o = i * 16;
    dir.writeUInt8(img.size >= 256 ? 0 : img.size, o);
    dir.writeUInt8(img.size >= 256 ? 0 : img.size, o + 1);
    dir.writeUInt8(0, o + 2);
    dir.writeUInt8(0, o + 3);
    dir.writeUInt16LE(1, o + 4);
    dir.writeUInt16LE(32, o + 6);
    dir.writeUInt32LE(img.data.length, o + 8);
    dir.writeUInt32LE(offset, o + 12);
    offset += img.data.length;
  });
  return Buffer.concat([header, dir, ...images.map((i) => i.data)]);
}

async function main() {
  await mkdir("public/logo", { recursive: true });
  await mkdir("public/icons", { recursive: true });

  const files: [string, LogoVariant, LogoTone, LogoFigure?][] = [
    ["dd-stacked.svg", "stacked", "default"],
    ["dd-horizontal.svg", "horizontal", "default"],
    ["dd-mark.svg", "mark", "default"],
    ["dd-mark-small.svg", "mark-small", "default"],
    ["dd-stacked-reversed.svg", "stacked", "reversed"],
    ["dd-horizontal-reversed.svg", "horizontal", "reversed"],
    ["dd-stacked-mono-plum.svg", "stacked", "mono-plum"],
    ["dd-horizontal-mono-plum.svg", "horizontal", "mono-plum"],
    ["dd-mark-mono-plum.svg", "mark", "mono-plum"],
    ["dd-stacked-mono-cream.svg", "stacked", "mono-cream"],
    ["dd-horizontal-mono-cream.svg", "horizontal", "mono-cream"],
    ["dd-mark-mono-cream.svg", "mark", "mono-cream"],
    ["dd-stacked-option-b.svg", "stacked", "default", "b"],
  ];
  for (const [name, v, t, f] of files) await writeFile(`public/logo/${name}`, svg(v, t, f));

  // app/icon.svg — plum parts switch to cream when the browser UI is dark (BRAND_FINAL §3.2).
  const small = svg("mark-small", "default").replace(
    "<title",
    `<style>@media (prefers-color-scheme: dark){[fill="#2A1856"]{fill:${CREAM}}[fill="#4B2E91"]{fill:#EEE9F8}[style*="2A1856"]{color:${CREAM}}[style*="4B2E91"]{color:#EEE9F8}}</style><title`,
  );
  await writeFile("app/icon.svg", small);

  const smallSvg = svg("mark-small", "default");
  await writeFile("app/apple-icon.png", await png(smallSvg, 180, CREAM, 0.7));
  await writeFile("public/icons/icon-192.png", await png(smallSvg, 192, CREAM, 0.64));
  await writeFile("public/icons/icon-512.png", await png(smallSvg, 512, CREAM, 0.64));
  const icoImgs = await Promise.all(
    [16, 32, 48].map(async (s) => ({ size: s, data: await png(smallSvg, s, null, 1) })),
  );
  await writeFile("app/favicon.ico", ico(icoImgs));
  console.log(`Wrote ${files.length} logo files + icons.`);
}

main();
