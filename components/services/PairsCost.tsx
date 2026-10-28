/** 05 — Pairs well with + 06 — Cost (design 03): related-service cards and the estimator card. */
import Image from "next/image";
import Link from "next/link";
import { flags } from "@/content/site.config";
import { estimatorHref, type ServicePage } from "@/content/services";

const DAYS = ["M", "T", "W", "T", "F", "S", "S"];

export function PairsCost({ page }: { page: ServicePage }) {
  const e = page.cost.estimator;
  const fill = e.overnight || e.hours >= 24 ? 100 : Math.min(100, 15 + e.hours * 10);
  return (
    <div className="py-[72px] lg:py-section-sm">
      <div className="wrap grid items-stretch gap-10 lg:grid-cols-2">
        <section aria-labelledby="pairs-title" className="flex flex-col">
          <div className="flex flex-col gap-4">
            <p className="eyebrow">05 — Pairs well with</p>
            <h2 id="pairs-title" className="h2 lg:!text-[2.375rem]">
              Pairs well with.
            </h2>
          </div>
          <ul className="mt-8 flex flex-1 flex-col gap-5">
            {page.pairs.map((p) => (
              <li key={p.slug} className="flex flex-1">
                <Link className="pair" href={`/care/${p.slug}`} data-cursor-label="Open">
                  <span className="block overflow-hidden">
                    <Image
                      src={`/images/poster-${p.slug}-1.jpg`}
                      alt=""
                      width={540}
                      height={960}
                      sizes="(min-width: 48rem) 180px, 112px"
                    />
                  </span>
                  <span className="flex flex-col justify-center gap-2 p-5 md:p-7">
                    <h3 className="h3">{p.name}</h3>
                    <span>{p.line}</span>
                    <span className="link">
                      See {p.name}
                      <span aria-hidden="true"> →</span>
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section
          aria-labelledby="cost-title"
          className="flex flex-col items-start gap-4 rounded-[28px] border border-line bg-white p-6 md:p-10 lg:px-12 lg:py-11"
        >
          <p className="eyebrow">06 — Cost</p>
          <h2 id="cost-title" className="h2 lg:!text-[2.375rem]">
            {page.cost.title}
          </h2>
          <p>{page.cost.body}</p>
          <div
            aria-hidden="true"
            className="flex flex-col gap-2.5 self-stretch rounded-[20px] bg-orchid-100 px-6 py-5"
          >
            <div className="flex h-[84px] items-end gap-2.5">
              {DAYS.map((d, i) => (
                <div key={i} className="wk">
                  {i < e.days && <span style={{ height: `${fill}%` }} />}
                </div>
              ))}
            </div>
            <div className="flex gap-2.5 text-center text-sm font-semibold text-plum-800">
              {DAYS.map((d, i) => (
                <span key={i} className="flex-1">
                  {d}
                </span>
              ))}
            </div>
          </div>
          <Link className="btn btn-ghost mt-1 max-md:w-full" href={estimatorHref(page.slug, e)}>
            Estimate your cost
          </Link>
          <div className="flex flex-col gap-0.5">
            <p className="sm muted">Your exact rate is set at your free assessment.</p>
            {page.cost.minimumHoursLine && flags.showPlaceholders && (
              <p className="sm muted">
                Visits start at <span className="tbc">[Minimum hours]</span> hours.
              </p>
            )}
          </div>
          <Link className="link sm -mt-2" href="/paying-for-care#ways-to-pay">
            See ways families pay for care
          </Link>
        </section>
      </div>
    </div>
  );
}
