/** 11 — For professionals (design 01/02-home "12. FOR PROFESSIONALS", COPY_HOME §12). */
import Link from "next/link";
import { contact, service } from "@/content/site.config";
import { Tbc } from "@/components/ui/Tbc";

const phone = contact.phone.value;
const fax = contact.fax.value;
const response = service.referralResponseTime;

export function ForProfessionals() {
  return (
    <section
      aria-labelledby="pros-title"
      data-surface="dark"
      data-cursor-theme="dark"
      className="relative overflow-hidden bg-plum-950 py-20 lg:py-section"
    >
      <svg
        aria-hidden="true"
        focusable="false"
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        className="absolute top-5 left-0 h-[60px] w-full lg:top-10 lg:h-20"
      >
        <path
          d="M0 40 H880 L896 28 L910 40 H924 L944 4 L966 76 L984 22 L996 40 H1440"
          fill="none"
          stroke="var(--color-orchid-500)"
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <div className="relative wrap grid items-end gap-3.5 pt-6 lg:grid-cols-2 lg:gap-18 lg:pt-12">
        <div className="flex flex-col gap-3.5 lg:gap-4">
          <p className="eyebrow">11 — For professionals</p>
          <h2 id="pros-title" className="h2 text-white">
            Referring someone? It takes about 2 minutes.
          </h2>
          <p className="lead text-plum-100">
            For discharge planners, case managers, social workers and care teams.
          </p>
        </div>
        <div className="flex flex-col gap-3.5 lg:gap-6">
          <p className="text-cream">
            Send a referral online or fax it to {fax.display}.
            {response.confirmed ? (
              <> We&apos;ll respond within {response.value}.</>
            ) : (
              <Tbc tbc={{ lead: " We'll respond within", chip: "[Response time]", after: "." }} />
            )}
          </p>
          <div className="mt-2 flex flex-col gap-3.5 lg:mt-0 lg:flex-row lg:flex-wrap lg:gap-4">
            <Link className="btn btn-primary max-lg:w-full" href="/for-professionals#refer">
              Make a referral
            </Link>
            <a
              className="btn btn-cream max-lg:w-full"
              href={`tel:${phone.tel}`}
              data-cursor-label="Call"
            >
              Call {phone.display}
            </a>
          </div>
          <p className="sm text-plum-100 max-lg:text-center">Fax: {fax.display}</p>
        </div>
      </div>
    </section>
  );
}
