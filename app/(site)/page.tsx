import type { Metadata } from "next";
import Link from "next/link";
import { CtaLabel, OfficeStatusChip } from "@/components/layout/OfficeStatus";

export const metadata: Metadata = {
  title: "In-Home Care in Beaufort, SC | Dawson & Dawson Home Care",
};

/**
 * TEMPORARY — preview landing for Phase 2 (site shell). The designed Home page
 * (intro video, hero, 12 chapters) replaces this file in Phase 3.
 */
export default function PreviewHome() {
  return (
    <section aria-labelledby="preview-title" className="wrap py-20 xl:py-28">
      <div className="flex max-w-[52rem] flex-col items-start gap-6">
        <OfficeStatusChip />
        <p className="eyebrow">Preview build · Phase 2 of the rebuild</p>
        <h1 id="preview-title" className="h1-hero">
          The site <span className="accent">shell</span> is ready.
        </h1>
        <p className="lead">
          Header, Care menu, footer, phone action bar, office hours, comfort settings, cursor ring
          and page transitions are in place. The designed Home page arrives in the next phase.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link href="/styleguide" className="btn btn-primary" data-cursor-label="View">
            Open the styleguide
          </Link>
          <Link href="/free-assessment" className="btn btn-ghost">
            <CtaLabel />
          </Link>
        </div>
        <p className="sm muted">
          Links to pages that aren&apos;t built yet show the site&apos;s 404 page. Nothing here is
          public — every page is set to &ldquo;noindex&rdquo;.
        </p>
      </div>
    </section>
  );
}
