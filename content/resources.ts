/**
 * /resources — guides for families (06: "structure now, posts later"; SEO_PLAN §1.1 rule
 * resources-3-posts). No posts are written yet, so the page shows its empty state, stays
 * noindex and out of sitemap.xml until three are published.
 */
export type Post = {
  slug: string;
  title: string;
  description: string;
  /** YYYY-MM-DD */
  published: string;
  updated: string | null;
  topic: "getting-started" | "paying-for-care" | "caregiver-support";
};

export const publishedPosts: Post[] = [];
