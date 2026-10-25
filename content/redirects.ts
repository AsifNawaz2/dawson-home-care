// content/redirects.ts — imported by next.config.ts → redirects(), and by proxy.ts for the 410s.
// SEO_PLAN.md §5 (08 §4 + additions). Each source is emitted with and without a trailing slash,
// as a 301 (the old WordPress URLs end in "/"; Next.js strips the slash first, so "/x/" can take
// two hops — SEO_PLAN §5.4 accepts that). Verify after launch with §5.6.

export interface LegacyRedirect {
  source: string;
  destination: string;
}

export const legacy: LegacyRedirect[] = [
  { source: "/adl-care", destination: "/care/personal-care" },
  { source: "/personal-care", destination: "/care/personal-care" }, // Decision D5
  { source: "/respite-care", destination: "/care/respite-care" },
  { source: "/companionship-care", destination: "/care/companionship" },
  { source: "/medical-referrals", destination: "/for-professionals" },
  { source: "/about-us", destination: "/about" },
  { source: "/contact-us", destination: "/contact" },
  { source: "/feed", destination: "/" },
  { source: "/comments/feed", destination: "/" },
  { source: "/home", destination: "/" },
  { source: "/wp-sitemap.xml", destination: "/sitemap.xml" },
  { source: "/sitemap_index.xml", destination: "/sitemap.xml" },
  { source: "/page-sitemap.xml", destination: "/sitemap.xml" },
  { source: "/post-sitemap.xml", destination: "/sitemap.xml" },
  // Add rows from the pre-switch crawl (§5.5) here. Never blanket-redirect unknown URLs to "/".
];

export const redirects = legacy.flatMap(({ source, destination }) => [
  { source, destination, statusCode: 301 as const },
  { source: `${source}/`, destination, statusCode: 301 as const },
]);

/** 410 Gone — answered by proxy.ts (Decision D3). */
export const gonePrefixes = [
  "/wp-admin",
  "/wp-login.php",
  "/xmlrpc.php",
  "/wp-json",
  "/wp-includes",
  "/wp-content",
] as const;

/**
 * /wp-content files still referenced elsewhere (§5.5 step 4, Decision D4). Copied to
 * /public/legacy/ and redirected, not 410. proxy.ts checks these before gonePrefixes.
 */
export const legacyAssets: LegacyRedirect[] = [
  // { source: "/wp-content/uploads/2023/05/logo.png", destination: "/legacy/logo.png" },
];

export const isGone = (path: string) =>
  gonePrefixes.some((p) => path === p || path.startsWith(`${p}/`));
