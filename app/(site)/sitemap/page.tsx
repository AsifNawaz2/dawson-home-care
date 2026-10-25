import type { Metadata } from "next";
import Link from "next/link";
import { getPageSeo, type PageSeo } from "@/content/seo";
import { flags } from "@/content/site.config";
import { pageMetadata, rulePasses } from "@/lib/seo";
import { PageHero } from "@/components/ui/PageHero";

export const metadata: Metadata = pageMetadata("/sitemap");

const ph = flags.showPlaceholders;

/** Groups follow SEO_PLAN §4.1 and the meta description's order. */
const GROUPS: { title: string; paths: string[] }[] = [
  {
    title: "Care services",
    paths: [
      "/",
      "/care",
      "/care/personal-care",
      "/care/home-help",
      "/care/companionship",
      "/care/respite-care",
      "/care/24-hour-care",
      "/find-care",
    ],
  },
  {
    title: "Areas we serve",
    paths: [
      "/areas-we-serve",
      "/areas-we-serve/beaufort",
      "/areas-we-serve/port-royal",
      "/areas-we-serve/ladys-island",
      "/areas-we-serve/st-helena-island",
      "/areas-we-serve/burton",
      "/areas-we-serve/bluffton",
      "/areas-we-serve/hilton-head-island",
      "/areas-we-serve/okatie",
    ],
  },
  { title: "Paying for care", paths: ["/paying-for-care"] },
  {
    title: "Help for families",
    paths: ["/how-it-works", "/faq", "/reviews", "/resources"],
  },
  { title: "About us", paths: ["/about", "/careers", "/for-professionals"] },
  { title: "How to reach us", paths: ["/free-assessment", "/contact"] },
  {
    title: "Our policies",
    paths: ["/privacy-policy", "/sms-terms", "/accessibility", "/sitemap"],
  },
];

/** Link text: the page's own breadcrumb name ("Home" for /). */
const nameOf = (p: PageSeo) => p.breadcrumb.at(-1)?.name ?? "Home";

/**
 * HTML site map (SEO_PLAN §4 A6, new — no COPY file): every indexable page, grouped, built from
 * content/seo.ts. With placeholders on, pages still waiting on their index rule are listed too,
 * marked, so the owner can reach them. JSON-LD: breadcrumbs only.
 */
export default function SitemapPage() {
  return (
    <>
      <PageHero
        path="/sitemap"
        eyebrow="Site map"
        title={["", "Every page", "in one list."]}
        lead="Care services, areas we serve, paying for care, help for families, and how to reach us."
      />
      <section aria-label="All pages" className="bg-white py-[72px] lg:py-24">
        <div className="wrap grid gap-x-12 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
          {GROUPS.map((g) => {
            const items = g.paths
              .map((path) => getPageSeo(path))
              .filter((p): p is PageSeo => !!p && (ph || rulePasses(p)));
            if (!items.length) return null;
            const id = `map-${g.title.toLowerCase().replace(/\W+/g, "-")}`;
            return (
              <div key={g.title} className="flex flex-col gap-4">
                <h2 id={id} className="h3 border-b-2 border-plum-800 pb-3">
                  {g.title}
                </h2>
                <ul aria-labelledby={id} className="flex flex-col">
                  {items.map((p) => (
                    <li key={p.path}>
                      <Link
                        href={p.path}
                        className="inline-flex min-h-12 items-center gap-2 py-1.5 font-semibold"
                      >
                        {nameOf(p)}
                      </Link>
                      {!rulePasses(p) && (
                        <span className="tbc ml-2">[listed once its index rule passes]</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
