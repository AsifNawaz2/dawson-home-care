/**
 * Shared legal-page layout (COPY_LEGAL §0): breadcrumb · H1 · lead · Last updated · The short
 * version · On this page (sticky list on desktop, closed <details> on phones) · sections ·
 * Back to top. No hero image, no CTA band, no scroll reveals, no client JS — pages for reading.
 * Print: chrome hidden, the contents list shown, link URLs printed after the link text.
 */
import { address, contact, flags, hours } from "@/content/site.config";
import { PageCrumbs } from "@/components/seo/PageCrumbs";

export type LegalSection = { id: string; title: string; body: React.ReactNode };

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
/** "2026-10-27" → "October 27, 2026" (a fixed date set by hand, never the clock). */
export const longDate = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number) as [number, number, number];
  return `${MONTHS[m - 1]} ${d}, ${y}`;
};

/** A line that renders only while placeholders are on (COPY_LEGAL "hidden until confirmed"). */
export function Pending({ children }: { children: React.ReactNode }) {
  if (!flags.showPlaceholders) return null;
  return <p className="tbc !inline-block">{children}</p>;
}

/** The shared contact block (COPY_LEGAL §0). */
export function ContactBlock() {
  const phone = contact.phone.value;
  const toll = contact.tollFree.value;
  const email = contact.email.value;
  return (
    <div className="flex flex-col gap-4 rounded-[20px] border border-line bg-white p-6">
      <address className="not-italic">
        <strong className="text-plum-800">Dawson and Dawson Home Care LLC</strong>
        <br />
        {address.street.value}, {address.suite.value}
        <br />
        {address.city.value}, {address.region.value} {address.postalCode.value}
      </address>
      <ul className="flex flex-col gap-1">
        <li>
          <strong>Phone:</strong>{" "}
          <a href={`tel:${phone.tel}`} data-cursor-label="Call">
            {phone.display}
          </a>
        </li>
        <li>
          <strong>Call or text (toll-free):</strong>{" "}
          <a href={`tel:${toll.tel}`} data-cursor-label="Call">
            {toll.display}
          </a>{" "}
          · <a href={`sms:${toll.tel}`}>Text</a>
        </li>
        <li>
          <strong>Email:</strong> <a href={`mailto:${email}`}>{email}</a>
        </li>
      </ul>
      <div className="flex flex-col gap-1">
        <p>
          <strong>Office:</strong> {hours.officeLabel} (Eastern)
        </p>
        <p>
          <strong>Care:</strong> {hours.careLabel}
        </p>
      </div>
    </div>
  );
}

export function LegalPage({
  path,
  title,
  lead,
  updated,
  short,
  sections,
}: {
  path: string;
  title: string;
  lead: React.ReactNode;
  /** legal.updated.* — null until the page goes live (prelaunch flags it). */
  updated: string | null;
  short: React.ReactNode[];
  sections: LegalSection[];
}) {
  const toc = (
    <ol className="flex list-decimal flex-col gap-1.5 pl-6 marker:font-semibold marker:text-plum-800">
      {sections.map((s) => (
        <li key={s.id} className="pl-1">
          <a href={`#${s.id}`} className="inline-flex min-h-11 items-center py-1 leading-snug">
            {s.title}
          </a>
        </li>
      ))}
    </ol>
  );

  return (
    <div className="legal wrap pb-20 lg:pb-section">
      <PageCrumbs path={path} />
      <div className="flex max-w-[65ch] flex-col gap-4 pt-6 pb-10 lg:pt-10 lg:pb-14">
        <h1 id="page-title" tabIndex={-1} className="h1-page outline-none">
          {title}
        </h1>
        <p className="lead">{lead}</p>
        {updated ? (
          <p className="sm muted">
            Last updated: <time dateTime={updated}>{longDate(updated)}</time>
          </p>
        ) : (
          flags.showPlaceholders && (
            <p className="sm muted">
              Last updated:{" "}
              <span className="tbc">[set by hand on the day this page goes live]</span>
            </p>
          )
        )}
      </div>

      <div className="grid items-start gap-10 lg:grid-cols-[280px_minmax(0,65ch)] lg:gap-12">
        <nav
          aria-label="On this page"
          className="hidden lg:sticky lg:top-[calc(var(--header-h)+24px)] lg:block print:block"
        >
          <p className="eyebrow mb-3">On this page</p>
          {toc}
        </nav>

        <div className="flex min-w-0 flex-col gap-12">
          <section
            aria-labelledby="short-version"
            className="rounded-[20px] bg-plum-100 p-6 lg:p-8"
          >
            <h2 id="short-version" className="h3">
              The short version
            </h2>
            <ul className="mt-4 flex list-disc flex-col gap-2 pl-6 text-ink marker:text-plum-800">
              {short.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </section>

          <details className="group rounded-[20px] border border-line bg-white lg:hidden print:hidden">
            <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-3 px-5 font-semibold text-plum-800 [&::-webkit-details-marker]:hidden">
              On this page
              <span aria-hidden="true" className="transition-transform group-open:rotate-180">
                ▾
              </span>
            </summary>
            <nav aria-label="On this page" className="px-5 pb-5">
              {toc}
            </nav>
          </details>

          {sections.map((s) => (
            <section
              key={s.id}
              id={s.id}
              aria-labelledby={`${s.id}-title`}
              className="legal-section flex scroll-mt-[calc(var(--header-h)+24px)] flex-col gap-4"
            >
              <h2 id={`${s.id}-title`} className="h2 !text-[2rem] lg:!text-[2.125rem]">
                {s.title}
              </h2>
              {s.body}
            </section>
          ))}

          <p>
            <a href="#page-title">Back to top</a>
          </p>
        </div>
      </div>
    </div>
  );
}
