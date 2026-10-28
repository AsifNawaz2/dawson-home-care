/**
 * Inner-page hero in the design's language (04-free-assessment hero frame): breadcrumb, eyebrow,
 * Anton H1 with one coloured accent word, lead, buttons and microcopy. Used by every page that has
 * no designed screen of its own (BUILD_DECISIONS §E).
 */
import { PageCrumbs } from "@/components/seo/PageCrumbs";
import { cn } from "@/lib/cn";

export function PageHero({
  path,
  eyebrow,
  title,
  lead,
  children,
  micro,
  aside,
  id = "page-title",
  className,
}: {
  path: string;
  eyebrow: string;
  /** [before, accent, after] — the accent word is coloured (Anton has no italic). */
  title: [string, string, string];
  lead?: React.ReactNode;
  children?: React.ReactNode;
  micro?: React.ReactNode;
  /** Optional right-hand column on desktop (photo, card…). */
  aside?: React.ReactNode;
  id?: string;
  className?: string;
}) {
  const [a, accent, b] = title;
  return (
    <div className={cn("wrap", className)}>
      <PageCrumbs path={path} />
      <div
        className={cn(
          "grid gap-10 pt-6 pb-12 lg:pt-10 lg:pb-20",
          aside && "lg:grid-cols-[minmax(0,1fr)_minmax(0,460px)] lg:items-center lg:gap-12",
        )}
      >
        <section
          aria-labelledby={id}
          className="flex max-w-[900px] flex-col items-start gap-3.5 lg:gap-4"
        >
          <p className="eyebrow">{eyebrow}</p>
          <h1 id={id} tabIndex={-1} className="h1-page outline-none">
            {a}
            {a && accent ? " " : ""}
            {accent && <span className="accent">{accent}</span>}
            {b && !/^[.,!?]/.test(b) ? " " : ""}
            {b}
          </h1>
          {lead && <p className="lead max-w-[720px]">{lead}</p>}
          {children && (
            <div className="mt-2 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:gap-4">
              {children}
            </div>
          )}
          {micro && <p className="sm muted">{micro}</p>}
        </section>
        {aside}
      </div>
    </div>
  );
}

/** Section heading block: eyebrow, H2, optional lead. */
export function SectionHead({
  eyebrow,
  title,
  lead,
  id,
  className,
  dark,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  id: string;
  className?: string;
  dark?: boolean;
}) {
  return (
    <div className={cn("flex max-w-[760px] flex-col gap-3 lg:gap-4", className)}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 id={id} className={cn("h2", dark && "text-white")}>
        {title}
      </h2>
      {lead && <p className={cn("lead", dark && "text-plum-100")}>{lead}</p>}
    </div>
  );
}
