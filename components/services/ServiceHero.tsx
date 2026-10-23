/**
 * Service hero (design 03-personal-care "BREADCRUMB + HERO"): breadcrumb, eyebrow + industry
 * label, H1 with accent, lead, Assessment + Call, trust row, and the service's video collage.
 */
import { Phone } from "lucide-react";
import { contact, hours } from "@/content/site.config";
import { collages } from "@/content/copy/home";
import { assessmentHref, type ServicePage } from "@/content/services";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { AssessmentButton } from "@/components/ui/AssessmentButton";
import { AutoCollage } from "@/components/ui/Collage";

const phone = contact.phone.value;

export function ServiceHero({ page }: { page: ServicePage }) {
  const { hero } = page;
  return (
    <section aria-labelledby="svc-title" className="relative overflow-hidden">
      <div className="wrap">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Care", href: "/care" },
            { label: page.name },
          ]}
        />
        <div className="grid gap-10 pt-4 pb-[72px] lg:grid-cols-[minmax(0,1fr)_minmax(0,620px)] lg:items-center lg:gap-12 lg:pt-6 lg:pb-20">
          <div className="flex flex-col items-start gap-5">
            <div className="flex flex-col gap-1.5">
              <p className="eyebrow">Care services</p>
              <p className="sm muted">{hero.smallLabel}</p>
            </div>
            <h1 id="svc-title" tabIndex={-1} className="h1-display text-plum-800">
              {hero.title[0]} <span className="accent">{hero.title[1]}</span>
              {hero.title[2].startsWith(".") ? "" : " "}
              {hero.title[2]}
            </h1>
            <p className="lead max-w-[560px]">{hero.lead}</p>
            <div className="mt-3 flex w-full flex-col gap-3 md:w-auto md:flex-row md:flex-wrap md:gap-4">
              <AssessmentButton href={assessmentHref(page.slug)} className="max-md:w-full" />
              <a
                className="btn btn-ghost max-md:w-full"
                href={`tel:${phone.tel}`}
                data-cursor-label="Call"
              >
                <Phone aria-hidden size={20} strokeWidth={1.75} className="ring-icon" />
                Call {phone.display}
              </a>
            </div>
            <p className="sm muted">Free visit at home. No obligation.</p>
            {hero.hoursClarifier && (
              <p className="sm text-plum-800">
                <strong>Care:</strong> {hours.careLabel} · <strong>Office:</strong>{" "}
                {hours.officeLabel}
              </p>
            )}
            <p className="mt-3 flex w-full flex-wrap items-center gap-x-3.5 gap-y-1 border-t border-line pt-5 text-[1.0625rem] font-semibold text-plum-800">
              <span>Since 2002</span>
              <span aria-hidden="true" className="text-orchid-500">
                ·
              </span>
              <span>Owner-run</span>
              <span aria-hidden="true" className="text-orchid-500">
                ·
              </span>
              <span>Care 24/7</span>
            </p>
          </div>
          <figure className="relative">
            <div aria-hidden="true" className="@container [--cw:min(658px,100cqw)]">
              <AutoCollage data={collages[page.slug]} />
            </div>
            <figcaption className="sr-only">{hero.collageCaption}</figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
