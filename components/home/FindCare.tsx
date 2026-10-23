/**
 * Home ch. 03 — "Not sure what you need?" (design 01-home §4 / 02-home-mobile, COPY_HOME §4).
 * The whole quiz runs inline here (BUILD_DECISIONS answer 2); /find-care is the fallback link.
 */
import Link from "next/link";
import { CareQuiz } from "@/components/features/CareQuiz";
import { Clock } from "lucide-react";

export function FindCare() {
  return (
    <section
      id="find-care"
      tabIndex={-1}
      aria-labelledby="quiz-title"
      className="scroll-mt-[var(--header-h)] bg-orchid-100 py-20 outline-none lg:py-28"
    >
      <div className="wrap grid items-center gap-6 lg:grid-cols-[minmax(0,1fr)_640px] lg:gap-24">
        <div className="flex flex-col items-start gap-3 lg:gap-4">
          <p className="eyebrow">03 — Find the right care</p>
          <h2 id="quiz-title" className="h2">
            Not sure what you need?
          </h2>
          <p className="lead">
            Most families aren&apos;t. Answer five quick questions and we&apos;ll suggest a plan.
          </p>
          <p className="sm muted mt-2 flex items-center gap-2">
            <Clock aria-hidden size={20} strokeWidth={1.75} className="flex-none text-orchid-700" />
            About 1 minute · No email needed
          </p>
          <Link className="link max-lg:hidden" href="/find-care">
            Find the right care →
          </Link>
        </div>
        <div className="min-w-0 rounded-[20px] bg-white px-[18px] py-[22px] lg:p-10">
          <CareQuiz variant="home" />
          <noscript>
            <Link className="link" href="/find-care">
              Find the right care →
            </Link>
          </noscript>
        </div>
      </div>
    </section>
  );
}
