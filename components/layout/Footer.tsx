import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { LogoMotion } from "@/components/brand/LogoMotion";
import { business, contact, flags, hours, links, address } from "@/content/site.config";
import {
  footerLegal,
  footerMore,
  footerServices,
  footerTowns,
  services,
} from "@/content/navigation";
import { OfficeStatusChip } from "./OfficeStatus";
import { CurrentYear } from "./CurrentYear";

const phone = contact.phone.value;
const text = contact.tollFree.value;

/** Footer — design layout (01-home-desktop), plus the links the docs require (BUILD_DECISIONS D-14). */
export function Footer() {
  return (
    <footer
      className="foot bg-plum-950 pt-16 pb-12 text-cream xl:pt-24"
      data-surface="dark"
      data-cursor-theme="dark"
      data-inert-when-menu=""
    >
      <div className="wrap">
        <div className="grid gap-12 md:grid-cols-2 xl:grid-cols-[320px_repeat(3,minmax(0,1fr))] xl:gap-12">
          <div className="flex flex-col items-start gap-6">
            <Link
              href="/"
              aria-label="Dawson & Dawson Home Care — home"
              className="logo-link inline-flex no-underline"
            >
              <LogoMotion kind="footer" className="block w-[200px] xl:w-[240px]">
                <Logo
                  variant="stacked"
                  tone="reversed"
                  figure={flags.logoFigure}
                  uid="ftr"
                  switchable
                  className="h-auto w-full"
                />
              </LogoMotion>
            </Link>
            <OfficeStatusChip size="expanded" surface="dark" />
            <p className="sm text-plum-100">
              <strong className="text-cream">Care:</strong> {hours.careLabel}
            </p>
          </div>

          <nav aria-labelledby="foot-contact" className="flex flex-col gap-3">
            <p id="foot-contact" className="eyebrow">
              Contact us
            </p>
            <a href={`tel:${phone.tel}`} data-cursor-label="Call" className="font-semibold">
              Call {phone.display}
            </a>
            <a href={`sms:${text.tel}`} className="font-semibold">
              Text us {text.display}
            </a>
            <p className="text-plum-100">Fax: {contact.fax.value.display}</p>
            <a href={`mailto:${contact.email.value}`} className="break-words">
              {contact.email.value}
            </a>
            <p className="sm mt-2 text-plum-100">{address.oneLine}</p>
            <a href={links.googleMaps.value} className="sm">
              Get directions <span className="sr-only">(goes to Google Maps)</span>
            </a>
            <p className="sm text-plum-100">
              <strong className="text-cream">Office:</strong> {hours.officeLabel}
            </p>
          </nav>

          <nav aria-labelledby="foot-care" className="flex flex-col gap-3">
            <p id="foot-care" className="eyebrow">
              Care services
            </p>
            {footerServices.map((slug) => {
              const s = services.find((x) => x.slug === slug)!;
              return (
                <Link key={slug} href={s.href}>
                  {s.name}
                </Link>
              );
            })}
            <Link href="/care" className="mt-2 font-semibold">
              See all care services
            </Link>
          </nav>

          <nav aria-labelledby="foot-more" className="flex flex-col gap-3">
            <p id="foot-more" className="eyebrow">
              Find the right care
            </p>
            {footerMore.map((l) => (
              <Link key={l.href} href={l.href}>
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        <nav
          aria-labelledby="foot-areas"
          className="mt-14 flex flex-col gap-3 border-t border-plum-600 pt-8 xl:mt-20"
        >
          <p id="foot-areas" className="eyebrow">
            Areas we serve
          </p>
          <ul role="list" className="flex flex-wrap gap-x-8 gap-y-2">
            {footerTowns.map((t) => (
              <li key={t.href}>
                <Link href={t.href}>{t.name}</Link>
              </li>
            ))}
            <li>
              <Link href="/areas-we-serve" className="font-semibold">
                See all areas we serve
              </Link>
            </li>
          </ul>
        </nav>

        <div className="sm mt-10 flex flex-wrap justify-between gap-x-8 gap-y-4 border-t border-plum-600 pt-8">
          <p className="text-plum-100">
            © <CurrentYear /> {business.legalName.value}
          </p>
          <div className="flex flex-wrap gap-x-8 gap-y-3">
            {footerLegal.map((l) => (
              <Link key={l.href} href={l.href}>
                {l.label}
              </Link>
            ))}
            <a href={links.instagram.value}>
              Follow us on Instagram <span className="sr-only">(goes to Instagram)</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
