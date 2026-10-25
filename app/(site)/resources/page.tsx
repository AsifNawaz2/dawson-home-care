import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, HandCoins, MessagesSquare } from "lucide-react";
import { publishedPosts } from "@/content/resources";
import { pageMetadata } from "@/lib/seo";
import { PageHero, SectionHead } from "@/components/ui/PageHero";
import { DuskCta } from "@/components/ui/DuskCta";

export const metadata: Metadata = pageMetadata("/resources");

/** Help that already exists on the site, shown while no guides are published. */
const START_HERE = [
  { Icon: BookOpen, label: "See how it works", href: "/how-it-works" },
  {
    Icon: HandCoins,
    label: "See ways families pay for care",
    href: "/paying-for-care#ways-to-pay",
  },
  { Icon: MessagesSquare, label: "See all questions", href: "/faq" },
];

/**
 * Resources (06: structure now, posts later; SEO_PLAN: H1 + description proposed, noindex and
 * out of sitemap.xml until 3 posts are published). With no posts: an honest empty state that
 * points to the help already on the site.
 */
export default function ResourcesPage() {
  return (
    <>
      <PageHero
        path="/resources"
        eyebrow="Resources"
        title={["Guides for", "families", "."]}
        lead="Plain-language guides for families caring for an older parent in Beaufort and the Lowcountry: getting started, paying for care and caregiver support."
      />
      <section aria-labelledby="res-title" className="bg-white py-[72px] lg:py-24">
        <div className="wrap flex flex-col gap-8">
          {publishedPosts.length === 0 ? (
            <>
              <SectionHead
                id="res-title"
                title="Our first guides are on the way."
                lead="Until then, these pages answer the questions families ask us most."
              />
              <ul className="grid gap-4 md:grid-cols-3">
                {START_HERE.map(({ Icon, label, href }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="group flex h-full items-center gap-4 rounded-[20px] border border-line bg-cream p-6 font-semibold text-plum-800 no-underline transition-colors hover:border-orchid-500 hover:bg-orchid-100"
                    >
                      <span
                        aria-hidden="true"
                        className="flex size-12 flex-none items-center justify-center rounded-2xl bg-plum-100"
                      >
                        <Icon size={24} strokeWidth={1.75} />
                      </span>
                      <span className="flex-1">{label}</span>
                      <ArrowRight
                        aria-hidden
                        size={20}
                        strokeWidth={2}
                        className="text-orchid-700"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <>
              <SectionHead id="res-title" title="Guides" />
              <ul className="grid gap-4 md:grid-cols-3">
                {publishedPosts.map((p) => (
                  <li
                    key={p.slug}
                    className="flex flex-col gap-2 rounded-[20px] border border-line p-6"
                  >
                    <h3 className="h3 !text-[1.5rem]">{p.title}</h3>
                    <p>{p.description}</p>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </section>
      <DuskCta title={["Let's talk about your", "family", "."]} />
    </>
  );
}
