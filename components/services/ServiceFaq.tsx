/** 07 — Questions (design 03 "QUESTIONS"): sticky heading + accordion with deep-link IDs. */
import { flags } from "@/content/site.config";
import type { ServicePage } from "@/content/services";
import { Accordion } from "@/components/ui/Accordion";
import { ParaText } from "@/components/ui/Tbc";

export function ServiceFaq({ page }: { page: ServicePage }) {
  const items = page.faq.items
    .filter((f) => !f.hidden || flags.showPlaceholders)
    .map((f) => ({
      id: f.id,
      q: f.q,
      a: (
        <p>
          <ParaText para={f.a} />
        </p>
      ),
    }));
  return (
    <section aria-labelledby="faq-title" className="bg-white py-[72px] lg:py-24">
      <div className="wrap grid items-start gap-8 lg:grid-cols-[420px_minmax(0,1fr)] lg:gap-20">
        <div className="flex flex-col gap-4 lg:sticky lg:top-[152px]">
          <p className="eyebrow">07 — Questions</p>
          <h2 id="faq-title" className="h2">
            {page.faq.title}
          </h2>
        </div>
        <Accordion items={items} />
      </div>
    </section>
  );
}
