import type { MetadataRoute } from "next";
import { flags } from "@/content/site.config";
import { ORIGIN } from "@/lib/seo";

/** SEO_PLAN §2.3: production allows all but /api/; every other build disallows everything. */
export default function robots(): MetadataRoute.Robots {
  if (!flags.indexable) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    sitemap: `${ORIGIN}/sitemap.xml`,
  };
}
