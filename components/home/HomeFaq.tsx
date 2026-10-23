/** 12 — Questions (design 01/02-home "13. QUESTIONS", COPY_HOME §13; IDs match /faq). */
import Link from "next/link";
import { Accordion, type AccordionItem } from "@/components/ui/Accordion";

const ITEMS: AccordionItem[] = [
  {
    id: "home-care-vs-home-health",
    q: "What's the difference between home care and home health?",
    a: "Home care is non-medical help at home: bathing, dressing, meals, housekeeping, company and medication reminders. That's what we do. Home health is medical care from nurses or therapists, usually ordered by a doctor. Many families use both, and we're happy to work alongside your home health team.",
  },
  {
    id: "cost",
    q: "How much does home care cost?",
    a: "It depends on how many hours of help you need. Use our cost estimator for a rough range. Your exact rate is set at your free assessment.",
  },
  {
    id: "medicare",
    q: "Does Medicare pay for home care?",
    a: "Usually not. Medicare generally doesn't cover non-medical home care. Some families use long-term care insurance, VA benefits or Medicaid waiver programs. Ask us which might apply to you.",
  },
  {
    id: "nights-weekends",
    q: "Can you help at night or on weekends?",
    a: "Yes. Care is available 24 hours a day, 7 days a week — a few hours or around the clock. Our office is open Monday to Friday, 8 AM to 5 PM.",
  },
  {
    id: "caregivers",
    q: "Who will come to my loved one's home?",
    a: "An experienced Dawson caregiver chosen for your loved one's needs and schedule. Our team includes Certified Nursing Assistants, and our owner stays involved in every client's care.",
  },
  {
    id: "free-assessment",
    q: "What happens at the free assessment?",
    a: "Our owner visits your loved one at home, at no cost. We talk about daily routines, the help they need and what matters most to them. Then we build a care plan together. There's no obligation.",
  },
];

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
