import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { servicePages, getServicePage, assessmentHref } from "@/content/services";
import { ServiceHero } from "@/components/services/ServiceHero";
import { FitChecklist } from "@/components/services/FitChecklist";
import { IncludedGrid } from "@/components/services/IncludedGrid";
import { DayTimeline } from "@/components/services/DayTimeline";
import { SafeBand } from "@/components/services/SafeBand";
import { PairsCost } from "@/components/services/PairsCost";
import { ServiceFaq } from "@/components/services/ServiceFaq";
import { ServiceReview } from "@/components/services/ServiceReview";
import { DuskCta } from "@/components/ui/DuskCta";
import "@/components/services/services.css";

export function generateStaticParams() {
  return servicePages.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/care/[slug]">): Promise<Metadata> {
  const page = getServicePage((await params).slug);
  return page ? { title: page.meta.title, description: page.meta.description } : {};
}

/** Service page template (design 03-personal-care-desktop, COPY_SERVICES). */
export default async function ServicePageRoute({ params }: PageProps<"/care/[slug]">) {
  const page = getServicePage((await params).slug);
  if (!page) notFound();
  return (
    <>
      <ServiceHero page={page} />
      <FitChecklist page={page} />
      <IncludedGrid page={page} />
      <DayTimeline page={page} />
      <SafeBand page={page} />
      <PairsCost page={page} />
      <ServiceFaq page={page} />
      <ServiceReview slug={page.slug} />
      <DuskCta title={page.cta.title} href={assessmentHref(page.slug)} />
    </>
  );
}
