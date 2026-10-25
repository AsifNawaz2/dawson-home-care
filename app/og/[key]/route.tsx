/**
 * Open Graph / Twitter images, one per page (SEO_PLAN §2.5): 1200×630, cream, the page's OG title
 * in Anton (plum-950), the stacked logo, a leaf-500 heartbeat line, and the site + phone in
 * Poppins (muted). Built at build time for every page in content/seo.ts. Tokens only.
 * Fonts are .woff copies of the site's OFL fonts (the renderer can't read woff2).
 */
import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { pages } from "@/content/seo";
import { contact } from "@/content/site.config";
import { tokens } from "@/content/tokens";
import { ogKey, ogPath } from "@/lib/seo";

export function generateStaticParams() {
  return pages.filter((p) => p.ogTitle).map((p) => ({ key: ogKey(p.path) }));
}

export async function GET(_req: Request, { params }: RouteContext<"/og/[key]">) {
  const { key } = await params;
  const png = await render(key);
  if (!png) return new Response("Not found", { status: 404 });
  return new Response(png, { headers: { "content-type": "image/png" } });
}

/** Cached per page, so every image is built once at build time. */
async function render(key: string): Promise<ArrayBuffer | null> {
  "use cache";
  const page = pages.find((p) => p.path === ogPath(key) && p.ogTitle);
  if (!page) return null;

  const [anton, poppins, logo] = await Promise.all([
    readFile(path.join(process.cwd(), "app/og/fonts/anton-latin-400-normal.woff")),
    readFile(path.join(process.cwd(), "app/og/fonts/poppins-latin-500-normal.woff")),
    readFile(path.join(process.cwd(), "public/logo/dd-stacked.svg")),
  ]);
  const logoSrc = `data:image/svg+xml;base64,${logo.toString("base64")}`;
  const size = page.ogTitle.length > 48 ? 76 : 88;

  const image = new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: tokens.cream,
        padding: "64px 72px 56px",
        position: "relative",
      }}
    >
      <div
        style={{
          display: "flex",
          fontFamily: "Anton",
          fontSize: size,
          lineHeight: 1.04,
          color: tokens["plum-950"],
          maxWidth: 1000,
        }}
      >
        {page.ogTitle}
      </div>
      <svg
        width="1200"
        height="80"
        viewBox="0 0 1440 80"
        style={{ position: "absolute", left: 0, top: 380 }}
      >
        <path
          d="M0 40 H880 L896 28 L910 40 H924 L944 4 L966 76 L984 22 L996 40 H1440"
          fill="none"
          stroke={tokens["leaf-500"]}
          strokeWidth="4"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
        {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse only takes <img> */}
        <img src={logoSrc} alt="" width={300} height={150} style={{ objectFit: "contain" }} />
        <div style={{ display: "flex", fontFamily: "Poppins", fontSize: 28, color: tokens.muted }}>
          dawsonhomecare.com · {contact.phone.value.display}
        </div>
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: "Anton", data: anton, weight: 400, style: "normal" },
        { name: "Poppins", data: poppins, weight: 500, style: "normal" },
      ],
    },
  );
  return image.arrayBuffer();
}
