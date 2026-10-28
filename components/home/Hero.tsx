/**
 * Hero (design 01/02-home "1. HERO", COPY_HOME §1). Desktop: two columns + centred buttons and
 * trust row. Phone: one column, full-width buttons, trust row as a list.
 *
 * From 1280px the buttons are the header's pair, a little larger; on scroll they travel into the
 * header (CtaTravel, BUILD_DECISIONS §I.4). Their space here stays reserved, so nothing shifts.
 */
import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, Phone, UserRound } from "lucide-react";
import { business, contact } from "@/content/site.config";
import { hero } from "@/content/copy/home";
import { CtaLabel, OfficeStatusChip } from "@/components/layout/OfficeStatus";
import { HeaderCtas } from "@/components/layout/HeaderCtas";
import { CtaTravel } from "./CtaTravel";

const phone = contact.phone.value;
const TRUST_ICONS = [Calendar, UserRound, Clock];

export function Hero() {
  const familyRun = business.familyRun.confirmed && business.familyRun.value === true;
  return (
    <section
      aria-labelledby="hero-title"
      className="home-hero pt-8 pb-[72px] lg:pt-8 lg:pb-section"
    >
      <div className="wrap">
        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] lg:items-stretch lg:gap-12">
          <div className="flex flex-col items-start gap-5 lg:justify-center lg:gap-4">
            <OfficeStatusChip />
            <div className="flex flex-col gap-3">
              <p className="eyebrow">{hero.eyebrow}</p>
              <h1
                id="hero-title"
                tabIndex={-1}
                className="h1-hero !leading-[1.03] lg:!leading-[1.04]"
              >
                {hero.headline.before} <span className="accent">{hero.headline.accent}</span>{" "}
                {familyRun ? hero.headline.familyRun : hero.headline.owner}
              </h1>
            </div>
            <p className="lead max-lg:-mt-1">{hero.lead}</p>
          </div>
          <figure className="relative mt-7 h-[280px] lg:mt-0 lg:h-auto lg:max-h-[var(--fit-h)] lg:min-h-[340px]">
            <Image
              src={hero.image.src}
              alt={hero.image.alt}
              fill
              priority
              sizes="(min-width: 80rem) 640px, (min-width: 64rem) 55vw, 100vw"
              className="rounded-[20px] object-cover object-[50%_30%] lg:rounded-3xl"
            />
          </figure>
        </div>

        <div className="mt-7 flex flex-col gap-3 lg:mt-6 lg:items-center lg:gap-3 lg:text-center">
          <div className="flex flex-col gap-3 md:flex-row md:flex-wrap md:gap-4 lg:justify-center xl:hidden">
            <Link href={hero.primary.href} className="btn btn-primary max-md:w-full">
              <CtaLabel open={hero.primary.open} closed={hero.primary.closed} />
            </Link>
            <a
              href={`tel:${phone.tel}`}
              className="btn btn-secondary max-md:w-full"
              data-cursor-label="Call"
            >
              <Phone aria-hidden size={20} strokeWidth={1.75} className="ring-icon" />
              Call {phone.display}
            </a>
          </div>
          <div className="hidden justify-center xl:flex" data-cta-slot="">
            <HeaderCtas where="hero" />
          </div>
          <CtaTravel />
          <p className="sm muted text-center md:text-left lg:text-center">{hero.microcopy}</p>
          <p className="sr-only">{hero.trustSr}</p>
          <ul
            aria-hidden="true"
            className="mt-2 flex flex-col gap-2.5 border-t border-line pt-5 text-sm font-medium text-plum-800 lg:mt-0 lg:flex-row lg:flex-wrap lg:justify-center lg:gap-x-6 lg:gap-y-2"
          >
            {hero.trust.map((label, i) => {
              const Icon = TRUST_ICONS[i];
              return (
                <li key={label} className="flex items-center gap-2.5 lg:gap-2">
                  <Icon size={20} strokeWidth={1.75} className="text-orchid-700" />
                  {label}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
