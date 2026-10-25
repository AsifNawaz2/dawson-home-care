/**
 * Page metadata from content/seo.ts (SEO_PLAN §2): absolute titles, canonical without query or
 * slash, Open Graph + Twitter with the route's generated image, and robots from the page's index
 * rule. Outside production (`NEXT_PUBLIC_INDEXABLE` unset) every page is noindex, nofollow.
 */
import type { Metadata } from "next";
import { flags, siteUrl } from "@/content/site.config";
import { getPageSeo, type IndexRule, type PageSeo } from "@/content/seo";
import { getArea } from "@/content/areas";
import { realReviews } from "@/content/reviews";
import { publishedPosts } from "@/content/resources";

export const SITE_NAME = "Dawson & Dawson Home Care";
export const ORIGIN = siteUrl.replace(/\/$/, "");
export const absolute = (path: string) => (path === "/" ? `${ORIGIN}/` : `${ORIGIN}${path}`);

/** /care/personal-care → "care--personal-care"; / → "home" (OG image route key). */
export const ogKey = (path: string) =>
  path === "/" ? "home" : path.slice(1).replaceAll("/", "--");
export const ogPath = (key: string) => (key === "home" ? "/" : `/${key.replaceAll("--", "/")}`);

/** Does this page's index rule pass right now (SEO_PLAN §1.1 index rules)? */
export function rulePasses(page: PageSeo): boolean {
  const rule: IndexRule = page.index;
  switch (rule) {
    case "index":
      return true;
    case "noindex":
      return false;
    case "town-confirmed":
      return getArea(page.path.split("/").pop() ?? "")?.confirmed === true;
    case "reviews-3-real":
      return realReviews().length >= 3;
    case "resources-3-posts":
      return publishedPosts.length >= 3;
  }
}

/** Indexed in production (and listed in sitemap.xml). */
export const isIndexable = (page: PageSeo) => flags.indexable && rulePasses(page);

export function pageMetadata(path: string): Metadata {
  const page = getPageSeo(path);
  if (!page) throw new Error(`content/seo.ts has no entry for ${path}`);
  const url = absolute(path);
  const image = { url: `/og/${ogKey(path)}`, width: 1200, height: 630, alt: page.ogTitle };
  const robots = !flags.indexable
    ? { index: false, follow: false }
    : path === "/thank-you"
      ? { index: false, follow: false }
      : { index: rulePasses(page), follow: true };
  return {
    title: { absolute: page.title },
    description: page.description || undefined,
    alternates: { canonical: url },
    robots,
    openGraph: page.ogTitle
      ? {
          type: "website",
          siteName: SITE_NAME,
          locale: "en_US",
          url,
          title: page.ogTitle,
          description: page.description,
          images: [image],
        }
      : undefined,
    twitter: page.ogTitle
      ? {
          card: "summary_large_image",
          title: page.ogTitle,
          description: page.description,
          images: [image.url],
        }
      : undefined,
  };
}
