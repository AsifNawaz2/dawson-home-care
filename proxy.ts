/**
 * Real 404 status for unknown slugs on the two dynamic routes. With Cache Components the static
 * shell streams before the page's notFound() runs, and `dynamicParams` isn't allowed, so an
 * unknown /care/<x> or /areas-we-serve/<x> would answer 200 (SEO_PLAN: "noindex (status 404)").
 * Rewriting to a path no route matches renders app/not-found.tsx with status 404.
 */
import { NextResponse, type NextRequest } from "next/server";
import { areas } from "@/content/areas";
import { services } from "@/content/navigation";

const KNOWN = new Set([
  ...services.map((s) => `/care/${s.slug}`),
  ...areas.filter((a) => a.hasPage).map((a) => `/areas-we-serve/${a.slug}`),
]);

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname.replace(/\/$/, "");
  if (KNOWN.has(path)) return NextResponse.next();
  return NextResponse.rewrite(new URL("/404-not-found", request.url));
}

export const config = {
  matcher: ["/care/:slug", "/areas-we-serve/:town"],
};
