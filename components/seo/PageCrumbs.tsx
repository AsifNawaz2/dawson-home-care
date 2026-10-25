/**
 * Visible breadcrumb + its BreadcrumbList JSON-LD, both from content/seo.ts, so the labels
 * always match (SEO_PLAN §3.8).
 */
import { getPageSeo } from "@/content/seo";
import { breadcrumbList } from "@/lib/schema";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "./JsonLd";

export function PageCrumbs({ path }: { path: string }) {
  const trail = getPageSeo(path)?.breadcrumb ?? [];
  if (!trail.length) return null;
  const items = [
    { label: "Home", href: "/" },
    ...trail.map((c, i) =>
      i === trail.length - 1 ? { label: c.name } : { label: c.name, href: c.path },
    ),
  ];
  return (
    <>
      <Breadcrumbs items={items} />
      <JsonLd data={[breadcrumbList(path)]} />
    </>
  );
}
