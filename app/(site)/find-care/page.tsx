import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import { contact } from "@/content/site.config";
import { PageCrumbs } from "@/components/seo/PageCrumbs";
import { CareQuiz } from "@/components/features/CareQuiz";
import { Clock } from "lucide-react";

export const metadata: Metadata = pageMetadata("/find-care");

const phone = contact.phone.value;

/** Care Quiz page (COPY_CONVERSION §9, styled as the design's Home quiz card). */
export default function FindCarePage() {
  return (
    <div className="bg-orchid-100 pb-20 lg:pb-28">
      <div className="wrap">
        <PageCrumbs path="/find-care" />
        <div className="mx-auto flex max-w-[760px] flex-col gap-8 pt-6 lg:gap-10 lg:pt-10">
          <section
            aria-labelledby="fc-title"
            className="flex flex-col items-start gap-3.5 lg:gap-4"
          >
            <p className="eyebrow">Find the right care</p>
            <h1
              id="fc-title"
              className="ff text-[2.875rem] leading-[1.03] text-plum-800 lg:text-[5.25rem] lg:leading-none"
            >
              Find the right <span className="accent">care.</span>
            </h1>
            <p className="lead">
              Most families aren&apos;t sure what they need. Answer five quick questions and
              we&apos;ll suggest a plan.
            </p>
            <p className="sm muted flex items-center gap-2">
              <Clock
                aria-hidden
                size={20}
                strokeWidth={1.75}
                className="flex-none text-orchid-700"
              />
              About 1 minute · No email needed
            </p>
          </section>
          <div className="rounded-[20px] bg-white px-[18px] py-[22px] md:p-10">
            <CareQuiz variant="page" />
            <noscript>
              <p>
                The quiz needs JavaScript to run. You can still get help: call{" "}
                <a href={`tel:${phone.tel}`}>{phone.display}</a>, or see our care services.
              </p>
              <p className="mt-4 flex flex-wrap gap-4">
                <Link className="btn btn-ghost" href="/care">
                  See our care services
                </Link>
                <Link className="btn btn-primary" href="/free-assessment">
                  Get a Free Care Assessment
                </Link>
              </p>
            </noscript>
          </div>
        </div>
      </div>
    </div>
  );
}
