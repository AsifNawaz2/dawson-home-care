import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { careItemList } from "@/lib/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import Image from "next/image";
import Link from "next/link";
import { flags } from "@/content/site.config";
import { services } from "@/content/navigation";
import { careHub, hubCollage } from "@/content/careHub";
import { PageCrumbs } from "@/components/seo/PageCrumbs";
import { AssessmentButton } from "@/components/ui/AssessmentButton";
import { AutoCollage } from "@/components/ui/Collage";
import { DuskCta } from "@/components/ui/DuskCta";
import { CareVenn } from "@/components/services/CareVenn";
import "@/components/services/services.css";

export const metadata: Metadata = pageMetadata("/care");

const nameOf = (slug: string) => services.find((s) => s.slug === slug)?.name ?? slug;

/** Care hub (COPY_SERVICES "CARE HUB", built from the service template's sections). */
export default function CareHubPage() {
  const { hero, cards, plan, quiz, dont } = careHub;
  return (
    <>
      <section aria-labelledby="hub-title" className="relative overflow-hidden">
        <div className="wrap">
          <PageCrumbs path="/care" />
          <div className="grid gap-10 pt-4 pb-[72px] lg:grid-cols-[minmax(0,1fr)_minmax(0,620px)] lg:items-center lg:gap-12 lg:pt-6 lg:pb-20">
            <div className="flex flex-col items-start gap-5">
              <p className="eyebrow">{hero.eyebrow}</p>
              <h1 id="hub-title" tabIndex={-1} className="h1-display text-plum-800">
                {hero.title[0]} <span className="accent">{hero.title[1]}</span>
                {hero.title[2]}
              </h1>
              <p className="lead max-w-[560px]">{hero.lead}</p>
              <div className="mt-3 flex w-full flex-col gap-3 md:w-auto md:flex-row md:flex-wrap md:gap-4">
                <AssessmentButton className="max-md:w-full" />
                <Link className="btn btn-ghost max-md:w-full" href={hero.secondary.href}>
                  {hero.secondary.label}
                </Link>
              </div>
              <p className="sm muted">{hero.microcopy}</p>
            </div>
            <figure>
              <div aria-hidden="true" className="@container [--cw:min(658px,100cqw)]">
                <AutoCollage data={hubCollage} />
              </div>
              <figcaption className="sr-only">{hero.collageCaption}</figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section aria-labelledby="cards-title" className="bg-white py-[72px] lg:py-24">
        <div className="wrap">
          <div className="flex flex-col gap-4">
            <p className="eyebrow">{cards.eyebrow}</p>
            <h2 id="cards-title" className="h2">
              {cards.title}
            </h2>
          </div>
          <ul className="mt-10 grid gap-5 lg:mt-12 lg:grid-cols-2">
            {services.map((s) => (
              <li key={s.slug} className="flex">
                <div className="pair relative">
                  <span aria-hidden="true" className="block overflow-hidden">
                    <Image
                      src={`/images/poster-${s.slug}-1.jpg`}
                      alt=""
                      width={540}
                      height={960}
                      sizes="(min-width: 48rem) 180px, 112px"
                    />
                  </span>
                  <span className="flex flex-col gap-2 p-5 md:p-7">
                    <h3 className="h3">{s.name}</h3>
                    <span className="sm muted">{s.smallLabel}</span>
                    <span>{s.promise}</span>
                    <ul className="sm flex list-disc flex-col gap-1 pl-5 marker:text-orchid-500">
                      {cards.bullets[s.slug].map((b) => (
                        <li key={b}>{b}</li>
                      ))}
                    </ul>
                    <Link
                      href={s.href}
                      className="link after:absolute after:inset-0 after:rounded-3xl"
                      data-cursor-label="Open"
                    >
                      See {s.name}
                      <span aria-hidden="true"> →</span>
                    </Link>
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="plan-title" className="py-[72px] lg:py-24">
        <div className="wrap grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
          <div className="flex flex-col gap-4">
            <p className="eyebrow">{plan.eyebrow}</p>
            <h2 id="plan-title" className="h2">
              {plan.title}
            </h2>
            <p className="lead">{plan.subline}</p>
            <CareVenn />
            <p>
              {plan.caption.before}{" "}
              <em className="font-semibold text-plum-800 not-italic">{plan.caption.when}</em>{" "}
              {plan.caption.and}{" "}
              <em className="font-semibold text-plum-800 not-italic">{plan.caption.how}</em>
              {plan.caption.after}
            </p>
          </div>
          <div className="flex flex-col gap-5 rounded-[28px] border border-line bg-white p-6 md:p-10">
            <h3 className="h3">{plan.examplesTitle}</h3>
            <ul className="flex flex-col gap-4">
              {plan.examples.map((ex) => (
                <li key={ex.label} className="border-b border-line pb-4 last:border-0 last:pb-0">
                  <strong className="text-plum-800">{ex.label}:</strong>{" "}
                  <Link className="link !inline !min-h-0" href={`/care/${ex.services[0]}`}>
                    {nameOf(ex.services[0])}
                  </Link>{" "}
                  +{" "}
                  <Link className="link !inline !min-h-0" href={`/care/${ex.services[1]}`}>
                    {nameOf(ex.services[1])}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="sm muted">{plan.small}</p>
          </div>
        </div>
      </section>

      <section aria-labelledby="hub-quiz-title" className="bg-orchid-100 py-[72px] lg:py-24">
        <div className="wrap flex flex-col items-start gap-4 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <div className="flex max-w-[720px] flex-col gap-4">
            <p className="eyebrow">{quiz.eyebrow}</p>
            <h2 id="hub-quiz-title" className="h2">
              {quiz.title}
            </h2>
            <p className="lead">{quiz.subline}</p>
            <p className="sm muted">{quiz.microcopy}</p>
          </div>
          <Link
            className="btn btn-primary max-md:w-full"
            href={quiz.button.href}
            data-cursor-label="Open"
          >
            {quiz.button.label}
          </Link>
        </div>
      </section>

      <section aria-labelledby="dont-title" className="bg-white py-[72px] lg:py-24">
        <div className="wrap grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-20">
          <div className="flex flex-col gap-4">
            <p className="eyebrow">{dont.eyebrow}</p>
            <h2 id="dont-title" className="h2">
              {dont.title}
            </h2>
            {dont.body.map((p) => (
              <p key={p}>{p}</p>
            ))}
            {flags.showPlaceholders && (
              <p className="sm muted">
                {dont.hospice}{" "}
                <span className="tbc">[Hospice/palliative support — to confirm]</span>
              </p>
            )}
            <Link className="link self-start" href={dont.link.href}>
              {dont.link.label}
            </Link>
          </div>
          <div
            className="overflow-x-auto rounded-3xl border border-line"
            role="region"
            aria-label={dont.table.caption}
            tabIndex={0}
          >
            <table className="w-full min-w-[520px] border-collapse text-left">
              <caption className="sr-only">{dont.table.caption}</caption>
              <thead>
                <tr className="bg-plum-100 text-plum-800">
                  <td className="p-4 lg:p-5" />
                  {dont.table.cols.map((c) => (
                    <th key={c} scope="col" className="p-4 font-semibold lg:p-5">
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dont.table.rows.map(([label, a, b]) => (
                  <tr key={label} className="border-t border-line align-top">
                    <th scope="row" className="p-4 font-semibold text-plum-800 lg:p-5">
                      {label}
                    </th>
                    <td className="p-4 lg:p-5">{a}</td>
                    <td className="p-4 lg:p-5">{b}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <DuskCta title={careHub.cta.title} />
      <JsonLd data={[careItemList()]} />
    </>
  );
}
