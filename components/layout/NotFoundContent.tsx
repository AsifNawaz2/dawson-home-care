import Link from "next/link";
import { Phone } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { contact, flags, hours } from "@/content/site.config";

const phone = contact.phone.value;

/** 404 — copy verbatim from COPY_CONVERSION §10; the house illustration is dropped (answer 4). */
export function NotFoundContent() {
  return (
    <section aria-labelledby="nf-title" className="wrap py-20 xl:py-28">
      <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)] lg:gap-12">
        <div className="flex flex-col items-start gap-6">
          <p className="eyebrow">404</p>
          <h1 id="nf-title" className="h1-hero">
            This page <span className="accent">wandered</span> off.
          </h1>
          <p className="lead max-w-[36rem]">
            Our website is new, and some pages have moved. Let&apos;s get you where you need to go.
          </p>
          <div className="mt-2 grid w-full gap-4 sm:max-w-[36rem] sm:grid-cols-2">
            <Link href="/" className="btn btn-primary">
              Go to the home page
            </Link>
            <Link href="/care" className="btn btn-ghost" data-cursor-label="View">
              See care services
            </Link>
            <Link href="/contact" className="btn btn-ghost">
              Contact us
            </Link>
            <a href={`tel:${phone.tel}`} className="btn btn-ghost" data-cursor-label="Call">
              <Phone aria-hidden size={20} strokeWidth={1.75} className="ring-icon" />
              Call {phone.display}
            </a>
          </div>
          <p className="sm muted">
            Looking for something specific? Try{" "}
            <Link href="/faq" className="underline underline-offset-3">
              questions families ask
            </Link>{" "}
            or the{" "}
            <Link href="/sitemap" className="underline underline-offset-3">
              site map
            </Link>
            .
          </p>
          <p className="sm text-ink">
            <strong className="text-plum-800">Care:</strong> {hours.careLabel} ·{" "}
            <strong className="text-plum-800">Office:</strong> {hours.officeLabel}
          </p>
        </div>
        <div
          aria-hidden="true"
          className="flex aspect-[4/5] items-center justify-center rounded-[20px] bg-plum-100 p-10 max-lg:hidden"
        >
          <Logo variant="mark" figure={flags.logoFigure} uid="nf-mark" className="w-3/4" />
        </div>
      </div>
    </section>
  );
}
