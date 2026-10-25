import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Phone } from "lucide-react";
import { areas, formatDrive, getArea } from "@/content/areas";
import { contact, flags, links } from "@/content/site.config";
import { getTownPage, townPages } from "@/content/towns";
import { services } from "@/content/navigation";
import { pageMetadata } from "@/lib/seo";
import { faqPage, townService } from "@/lib/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageHero, SectionHead } from "@/components/ui/PageHero";
import { AssessmentButton } from "@/components/ui/AssessmentButton";
import { DuskCta } from "@/components/ui/DuskCta";
import { Accordion } from "@/components/ui/Accordion";
import { PhotoSlot } from "@/components/ui/PhotoSlot";
import { Segs, segsText } from "@/components/ui/Segs";
import { DriveMap } from "@/components/areas/DriveMap";

const phone = contact.phone.value;

export function generateStaticParams() {
  return townPages.map((t) => ({ town: t.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/areas-we-serve/[town]">): Promise<Metadata> {
  const { town } = await params;
  return getTownPage(town) ? pageMetadata(`/areas-we-serve/${town}`) : {};
}

/** Town page (COPY_AREAS §3 frame + §4–§11 copy; Home "Where we care" style — BUILD_DECISIONS §E). */
export default async function TownPage({ params }: PageProps<"/areas-we-serve/[town]">) {
  const { town } = await params;
  const t = getTownPage(town);
  const a = getArea(town);
  if (!t || !a) notFound();
  const drive = formatDrive(a.driveMinutes);
  const where = `${a.preposition} ${a.name}`;
  const assess = `/free-assessment?town=${a.slug}`;
  const nearby = t.nearby
    .map((n) => areas.find((x) => x.name === n && x.hasPage))
    .filter((x): x is NonNullable<typeof x> => !!x);
  const careHref = (name: string) => services.find((s) => s.name === name)?.href ?? "/care";

  return (
    <>
      <PageHero
        path={`/areas-we-serve/${a.slug}`}
        eyebrow={t.eyebrow}
        title={[`In-Home Care ${a.preposition}`, a.name, ", SC"]}
        lead={t.lead}
        micro="Free visit at home. No obligation."
        aside={<PhotoSlot label={`${a.name} scenery · 16:9`} />}
      >
        <AssessmentButton href={assess} className="max-sm:w-full" />
        <a
          className="btn btn-secondary max-sm:w-full"
          href={`tel:${phone.tel}`}
          data-cursor-label="Call"
        >
          <Phone aria-hidden size={20} strokeWidth={1.75} />
          Call {phone.display}
        </a>
      </PageHero>

      <section aria-labelledby="intro-title" className="bg-white py-[72px] lg:py-24">
        <div className="wrap grid gap-6 lg:grid-cols-[420px_minmax(0,1fr)] lg:gap-20">
          <SectionHead id="intro-title" title={t.intro.title} />
          <div className="flex max-w-[65ch] flex-col gap-4">
            {t.intro.paras.map((p, i) => (
              <p key={i} className={i === 0 ? "lead" : undefined}>
                <Segs segs={p} />
              </p>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="drive-title" className="py-[72px] lg:py-24">
        <div className="wrap grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,560px)] lg:gap-16">
          <div className="flex flex-col gap-4">
            <SectionHead id="drive-title" title="Getting to you" />
            <div
              className="flex flex-col gap-2 rounded-[20px] bg-plum-950 p-6 text-cream lg:p-8"
              data-surface="dark"
            >
              <p className="ff text-[3.5rem] leading-none text-white lg:text-[4.5rem]">
                About {drive} minutes
              </p>
              {!a.driveConfirmed && flags.showPlaceholders && (
                <p>
                  <span className="tbc">[drive time]</span>
                </p>
              )}
              <p className="text-plum-100">from our office at 69 Robert Smalls Parkway, Beaufort</p>
              <p className="mt-2 font-semibold">{t.route}</p>
              <p className="sm text-plum-100">Map is approximate.</p>
            </div>
          </div>
          <DriveMap area={a} />
        </div>
      </section>

      <section aria-labelledby="who-title" className="bg-white py-[72px] lg:py-24">
        <div className="wrap flex flex-col gap-8 lg:gap-12">
          <SectionHead id="who-title" title={`Who we help ${where}`} />
          <ul className="grid gap-4 md:grid-cols-3">
            {t.who.map((w) => (
              <li
                key={w.title}
                className="flex flex-col gap-3 rounded-[20px] border border-line bg-cream p-6"
              >
                <h3 className="h3 !text-[1.5rem]">{w.title}</h3>
                <p>
                  <Segs segs={w.text} />
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="care-title" className="py-[72px] lg:py-24">
        <div className="wrap grid items-start gap-8 lg:grid-cols-[420px_minmax(0,1fr)] lg:gap-20">
          <SectionHead
            id="care-title"
            title={`Care ${where}`}
            lead="Most families combine two or three. Your plan is built around your loved one."
          />
          <div className="flex flex-col gap-4">
            <ul className="flex flex-col border-t border-line">
              {t.care.map((c) => (
                <li key={c.name} className="flex flex-col gap-1 border-b border-line py-5">
                  <h3 className="h3 !text-[1.5rem]">
                    <Link
                      href={careHref(c.name)}
                      className="inline-flex items-center gap-2 text-plum-800 underline-offset-4 hover:underline"
                    >
                      {c.name}
                      <ArrowRight
                        aria-hidden
                        size={20}
                        strokeWidth={2}
                        className="text-orchid-700"
                      />
                    </Link>
                  </h3>
                  <p>
                    <Segs segs={c.line} />
                  </p>
                </li>
              ))}
            </ul>
            <p className="sm muted">
              All our care is non-medical. We work alongside your home health team.
            </p>
            <Link className="link self-start" href={`/find-care?town=${a.slug}`}>
              Not sure what you need? Find the right care →
            </Link>
          </div>
        </div>
      </section>

      <section aria-labelledby="tfaq-title" className="bg-white py-[72px] lg:py-24">
        <div className="wrap grid items-start gap-8 lg:grid-cols-[420px_minmax(0,1fr)] lg:gap-20">
          <div className="flex flex-col gap-4 lg:sticky lg:top-[calc(var(--header-h)+24px)]">
            <SectionHead id="tfaq-title" title={`Questions from ${a.name} families`} />
            <Link className="link self-start" href="/faq">
              See all questions →
            </Link>
          </div>
          <Accordion
            items={t.faqs.map((f) => ({
              id: f.id,
              q: f.q,
              a: (
                <div className="flex flex-col gap-3">
                  {f.a.map((p, i) => (
                    <p key={i}>
                      <Segs segs={p} />
                    </p>
                  ))}
                  {f.link && (
                    <Link
                      className="link self-start"
                      href={f.link.href === "maps" ? links.googleMaps.value : f.link.href}
                    >
                      {f.link.label}
                    </Link>
                  )}
                </div>
              ),
            }))}
          />
        </div>
      </section>

      <section aria-labelledby="nearby-title" className="py-[72px] lg:py-20">
        <div className="wrap flex flex-col gap-6">
          <SectionHead id="nearby-title" title="Also nearby" />
          <ul className="flex flex-wrap gap-3">
            {nearby.map((n) => (
              <li key={n.slug}>
                <Link
                  href={`/areas-we-serve/${n.slug}`}
                  data-cursor-label="View"
                  className="inline-flex min-h-12 items-center rounded-full border-[1.5px] border-muted bg-white px-5 font-semibold text-plum-800 no-underline transition-colors hover:border-orchid-500 hover:bg-orchid-100"
                >
                  {n.name}
                </Link>
              </li>
            ))}
            <li>
              <Link className="btn btn-ghost" href="/areas-we-serve">
                See all areas →
              </Link>
            </li>
          </ul>
        </div>
      </section>

      <DuskCta title={[t.cta, "", ""]} href={assess} />
      <JsonLd
        data={[
          townService(a),
          faqPage(
            `/areas-we-serve/${a.slug}`,
            t.faqs.map((f) => ({ q: f.q, a: f.a.map(segsText).join(" ") })),
          ),
        ]}
      />
    </>
  );
}
