/** 04 — Safe and dignified (design 03 dark numbered band with the heartbeat line). */
import { flags } from "@/content/site.config";
import type { ServicePage } from "@/content/services";
import { Tbc } from "@/components/ui/Tbc";

export function SafeBand({ page }: { page: ServicePage }) {
  return (
    <section
      aria-labelledby="safe-title"
      data-surface="dark"
      data-cursor-theme="dark"
      className="relative overflow-hidden bg-plum-950 pt-[88px] pb-[72px] lg:pt-section lg:pb-section-sm"
    >
      <svg
        aria-hidden="true"
        focusable="false"
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        className="absolute top-10 left-0 h-20 w-full"
      >
        <path
          d="M0 40 H1000 L1014 30 L1026 40 H1038 L1058 6 L1080 74 L1098 24 L1110 40 H1440"
          fill="none"
          className="stroke-orchid-500"
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <div className="relative wrap">
        <div className="flex max-w-[760px] flex-col gap-4">
          <p className="eyebrow">04 — Safe and dignified</p>
          <h2 id="safe-title" className="h2 !text-white">
            {page.safe.title}
          </h2>
        </div>
        <ol className="mt-10 grid gap-8 md:grid-cols-3 lg:mt-12">
          {page.safe.points.map((p, i) => (
            <li key={p.title} className="flex flex-col gap-3.5 border-t-2 border-plum-600 pt-7">
              <span
                aria-hidden="true"
                className="ff text-[3rem] leading-none text-orchid-500 lg:text-[3.25rem]"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="h3 !text-white">{p.title}</h3>
              <p className="text-plum-100">{p.text}</p>
            </li>
          ))}
        </ol>
        {page.safe.tbc && flags.showPlaceholders && (
          <p className="sm mt-8 text-plum-100">
            <Tbc tbc={page.safe.tbc} />
          </p>
        )}
      </div>
    </section>
  );
}
