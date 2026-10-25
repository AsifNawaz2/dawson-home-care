/**
 * Request-time rules that next.config can't express:
 *
 *  1. Real 404 status for unknown slugs on the two dynamic routes. With Cache Components the
 *     static shell streams before the page's notFound() runs, and `dynamicParams` isn't allowed,
 *     so an unknown /care/<x> or /areas-we-serve/<x> would answer 200 (SEO_PLAN: "noindex
 *     (status 404)"). Rewriting to a path no route matches renders app/not-found.tsx with 404.
 *  2. 410 Gone for the old WordPress endpoints (SEO_PLAN §5.3, Decision D3), after the still-used
 *     /wp-content files in `legacyAssets` (§5.5 step 4) have been redirected.
 *  3. /reveal-notes and /styleguide don't exist in production (SEO_PLAN ground rule 8).
 */
import { NextResponse, type NextRequest } from "next/server";
import { areas } from "@/content/areas";
import { services } from "@/content/navigation";
import { isGone, legacyAssets } from "@/content/redirects";

const KNOWN = new Set([
  ...services.map((s) => `/care/${s.slug}`),
  ...areas.filter((a) => a.hasPage).map((a) => `/areas-we-serve/${a.slug}`),
]);
const PREVIEW_ONLY = new Set(["/reveal-notes", "/styleguide"]);
const notFound = (request: NextRequest) =>
  NextResponse.rewrite(new URL("/404-not-found", request.url));

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname.replace(/(.)\/$/, "$1");

  const asset = legacyAssets.find((a) => a.source === path);
  if (asset) return NextResponse.redirect(new URL(asset.destination, request.url), 301);
  if (isGone(path))
    return new NextResponse("410 Gone — this address belonged to the old website.", {
      status: 410,
      headers: { "content-type": "text/plain; charset=utf-8", "x-robots-tag": "noindex" },
    });

  if (PREVIEW_ONLY.has(path))
    return process.env.NEXT_PUBLIC_INDEXABLE === "true" ? notFound(request) : NextResponse.next();

  if (KNOWN.has(path)) return NextResponse.next();
  return notFound(request);
}

export const config = {
  matcher: [
    "/care/:slug",
    "/areas-we-serve/:town",
    "/reveal-notes",
    "/styleguide",
    "/wp-admin/:path*",
    "/wp-login.php",
    "/xmlrpc.php",
    "/wp-json/:path*",
    "/wp-includes/:path*",
    "/wp-content/:path*",
  ],
};
