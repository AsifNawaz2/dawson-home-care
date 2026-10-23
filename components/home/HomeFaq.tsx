/** 12 — Questions (design 01/02-home "13. QUESTIONS", COPY_HOME §13; IDs match /faq). */
import Link from "next/link";
import { featuredFaqs } from "@/content/faq";
import { Accordion, type AccordionItem } from "@/components/ui/Accordion";

/** Single source: content/faq.ts — Home shows the six featured items, first paragraph only. */
const ITEMS: AccordionItem[] = featuredFaqs.map((f) => ({
  id: f.id,
  q: f.question,
  a: typeof f.answer[0] === "string" ? f.answer[0] : "",
}));

export function HomeFaq() {
  return (
    <section aria-labelledby="faq-title" className="py-[88px] lg:py-32">
      <div className="wrap grid items-start lg:grid-cols-[400px_minmax(0,1fr)] lg:gap-24">
        <div className="flex flex-col items-start gap-3 lg:sticky lg:top-[calc(var(--header-h)+24px)] lg:gap-6">
          <p className="eyebrow">12 — Questions</p>
          <h2 id="faq-title" className="h2">
            Questions families ask us.
          </h2>
          <Link className="btn btn-ghost mt-4 hidden lg:inline-flex" href="/faq">
            See all questions
          </Link>
        </div>
        <Accordion items={ITEMS} className="mt-6 lg:mt-0" />
        <Link className="btn btn-ghost mt-6 w-full lg:hidden" href="/faq">
          See all questions
        </Link>
      </div>
    </section>
  );
}
