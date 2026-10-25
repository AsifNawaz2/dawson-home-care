import type { MetadataRoute } from "next";
import { pages } from "@/content/seo";
import { absolute, isIndexable } from "@/lib/seo";

/**
 * SEO_PLAN §2.4: only pages whose index rule passes (unconfirmed towns, /reviews and /resources
 * stay out until their rules pass; nothing is listed outside production). lastModified is the
 * page's own `updated` date — never the build time. No priority/changefreq.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return pages
    .filter(isIndexable)
    .map((p) => ({ url: absolute(p.path), ...(p.updated ? { lastModified: p.updated } : {}) }));
}
