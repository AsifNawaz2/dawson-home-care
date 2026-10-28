import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Clock,
  HeartHandshake,
  MapPin,
  ShieldCheck,
  Stethoscope,
  UserCheck,
  Users,
  BadgeCheck,
  FileCheck,
} from "lucide-react";
import { business, credentials, flags, links } from "@/content/site.config";
import { owner, ownerLetter } from "@/content/owner";
import { visibleCaregivers } from "@/content/caregivers";
import { pageMetadata } from "@/lib/seo";
import { PageHero, SectionHead } from "@/components/ui/PageHero";
import { AssessmentButton } from "@/components/ui/AssessmentButton";
import { DuskCta } from "@/components/ui/DuskCta";
import { PhotoSlot } from "@/components/ui/PhotoSlot";
import { Segs } from "@/components/ui/Segs";
import { Tbc } from "@/components/ui/Tbc";
import { ThisYear, YearsSince } from "@/components/ui/Years";
import { HashFocus } from "@/components/ui/HashFocus";
import { StillCard } from "@/components/trust/CaregiverCard";

export const metadata: Metadata = pageMetadata("/about");

const ph = flags.showPlaceholders;
const cards = visibleCaregivers(ph);

const VALUES = [
  {
    Icon: UserCheck,
    title: "The owner stays involved",
    text: "Our owner meets every family and keeps working with each client to make sure care is done right.",
    means: "You always know who's responsible.",
  },
  {
    Icon: Clock,
    title: "Care when you need it",
    text: "Care is available 24 hours a day, 7 days a week — a few hours or around the clock.",
    means:
      "Nights, weekends and holidays are covered. Our office is open Monday–Friday, 8 AM–5 PM.",
  },
  {
    Icon: HeartHandshake,
    title: "Caregivers who love this work",
    text: "Our caregivers have years of experience and a genuine love for caregiving. Our team includes Certified Nursing Assistants.",
    means: "Your loved one is cared for by people who chose this work.",
  },
  {
    Icon: Users,
    title: "Family, not a file number",
    text: "We follow up, check in and treat every client like part of our family.",
    means: "When something changes, we notice — and we change the plan with you.",
  },
];

/** About (COPY_TRUST; Home "Meet the owner", "Since 2002", caregivers — BUILD_DECISIONS §E). */
export default function AboutPage() {
  return (
    <>
      <PageHero
        path="/about"
        eyebrow="About us"
        title={["Here since 2002. Still", "personal", "."]}
        lead={
          <>
            Dawson and Dawson Home Care is owner-run, licensed and insured, with an office right
            here in Beaufort. For <YearsSince /> years, we&apos;ve helped Lowcountry families stay
            at home.
          </>
        }
        micro="Since 2002 · Owner-run · Licensed & insured · Care 24/7"
        aside={<PhotoSlot label="Our team · 16:9" />}
      >
        <AssessmentButton href="/free-assessment" className="max-sm:w-full" />
        <a className="btn btn-ghost max-sm:w-full" href="#owner">
          Meet our owner
        </a>
      </PageHero>

      {/* 01 — Story */}
      <section
        id="story"
        aria-labelledby="story-title"
        className="bg-plum-100 py-[72px] lg:py-section"
      >
        <div className="wrap grid items-start gap-10 lg:grid-cols-2 lg:gap-18">
          <div className="flex flex-col gap-3 lg:gap-4">
            <p className="eyebrow">01 — Our story</p>
            <h2 id="story-title" className="flex flex-col gap-2 text-plum-800">
              <span className="ff text-numeral">
                <YearsSince />
              </span>
              <span className="ff text-[2.25rem] leading-[1.08] lg:text-[2.625rem]">
                years of caring for Lowcountry families.
              </span>
            </h2>
          </div>
          <div className="flex flex-col gap-4">
            <p>
              Dawson and Dawson Home Care began in 2002.
              {ph && (
                <>
                  {" "}
                  <Tbc
                    tbc={{
                      chip: '[draft: "It started with a simple idea: older people deserve to stay in the homes they love, with help from people who treat them like family."]',
                    }}
                  />
                </>
              )}
            </p>
            {ph && (
              <p>
                <Tbc
                  tbc={{
                    chip: '[why the name "Dawson and Dawson" — e.g. who the two Dawsons are]',
                  }}
                />
              </p>
            )}
            <p>
              A lot has changed in home care since then. Some things haven&apos;t. Our owner still
              meets every family personally and keeps working with each client to make sure care is
              done right. Our caregivers bring years of experience and a real love for this work.
              And care is there when families need it — 24 hours a day, 7 days a week.
            </p>
            <p>
              Our office is on Robert Smalls Parkway in Beaufort. The families we care for are our
              neighbors.
            </p>
            {business.independent.confirmed ? (
              <p>We&apos;re independent and locally owned — not a franchise.</p>
            ) : (
              ph && (
                <p>
                  <Tbc
                    tbc={{
                      lead: "We're independent and locally owned — not a franchise.",
                      chip: "[independent, not part of a franchise]",
                    }}
                  />
                </p>
              )
            )}
            <ol className="mt-4 grid list-none grid-cols-2 gap-4 border-t border-muted p-0 pt-5">
              <li className="flex flex-col gap-1.5">
                <span className="ff text-[2.5rem] leading-none text-plum-800">2002</span>
                <span>— We begin caring for Lowcountry families.</span>
              </li>
              <li className="flex flex-col items-end gap-1.5 text-right">
                <span className="ff text-[2.5rem] leading-none text-plum-800">
                  <ThisYear />
                </span>
                <span>
                  — <YearsSince /> years later, still here.
                </span>
              </li>
            </ol>
          </div>
        </div>
      </section>

      {/* 02 — Meet the owner */}
      <section
        id="owner"
        aria-labelledby="owner-title"
        className="scroll-mt-[calc(var(--header-h)+24px)] py-[72px] lg:py-section"
      >
        <div className="wrap grid items-start gap-10 lg:grid-cols-[400px_minmax(0,1fr)] lg:gap-18">
          <div className="flex flex-col gap-6 lg:sticky lg:top-[calc(var(--header-h)+24px)]">
            <figure>
              <div
                role="img"
                aria-label={`${owner.firstName}, owner of Dawson and Dawson Home Care, at the Beaufort office.`}
                className="flex aspect-[4/5] w-full items-center justify-center overflow-hidden rounded-[20px] bg-plum-100"
              >
                <Image
                  src="/images/logo.png"
                  alt=""
                  width={600}
                  height={600}
                  className="block h-auto w-[60%]"
                />
              </div>
              {ph && <figcaption className="sm muted mt-2.5">Owner portrait · 4:5</figcaption>}
            </figure>
            <div className="flex flex-col gap-3 rounded-[20px] border border-line bg-white p-6">
              <h3 className="h3 !text-h4">At a glance</h3>
              <dl className="flex flex-col gap-2">
                <div>
                  <dt className="font-bold text-plum-800">Role</dt>
                  <dd>Owner, Dawson and Dawson Home Care</dd>
                </div>
                {ph && (
                  <>
                    <div>
                      <dt className="font-bold text-plum-800">In home care since</dt>
                      <dd>
                        <Tbc tbc={{ chip: "[year]" }} />
                      </dd>
                    </div>
                    <div>
                      <dt className="font-bold text-plum-800">Credentials</dt>
                      <dd>
                        <Tbc tbc={{ chip: "[real credentials only — e.g. CNA]" }} />
                      </dd>
                    </div>
                    <div>
                      <dt className="font-bold text-plum-800">Lowcountry roots</dt>
                      <dd>
                        <Tbc tbc={{ chip: "[hometown or years in Beaufort]" }} />
                      </dd>
                    </div>
                  </>
                )}
              </dl>
            </div>
            <div className="flex items-center gap-5 rounded-[20px] bg-orchid-100 p-6">
              <span
                aria-hidden="true"
                className="grid size-16 flex-none place-items-center rounded-full bg-white text-orchid-700"
              >
                <Clock size={28} strokeWidth={1.75} />
              </span>
              <div>
                <p className="font-bold text-plum-800">Video coming soon</p>
                <p className="sm">A short hello from our owner is on its way.</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <SectionHead
              id="owner-title"
              eyebrow="02 — Meet the owner"
              title={`Meet ${owner.firstName}.`}
              lead="The person who runs Dawson is the person who comes to your home."
            />
            <div className="flex max-w-[62ch] flex-col gap-4 border-t border-line pt-6">
              {ownerLetter.map((p, i) => {
                const onlyPending = p.every((s) => typeof s === "object" && "pending" in s);
                if (onlyPending && !ph) return null;
                return (
                  <div key={i} className="flex flex-col gap-6">
                    <p
                      className={
                        i === 0 ? "q text-[1.375rem] text-plum-800 lg:text-[1.5rem]" : undefined
                      }
                    >
                      <Segs segs={p} />
                    </p>
                    {i === 3 && ph && (
                      <blockquote className="border-l-4 border-orchid-500 pl-5">
                        <p className="q text-[1.375rem] leading-[1.4] text-plum-800">
                          &ldquo;
                          <Tbc
                            tbc={{
                              chip: "[owner quote — one sentence about why they do this work]",
                            }}
                          />
                          &rdquo;
                        </p>
                      </blockquote>
                    )}
                  </div>
                );
              })}
              <p className="ff mt-2 text-[2rem] text-plum-800">{owner.firstName}</p>
              <div
                aria-hidden="true"
                className="flex h-16 w-[220px] items-end rounded-xl bg-orchid-100 px-[18px] pb-4"
              >
                <span className="block h-0.5 w-full bg-plum-800" />
              </div>
              {ph && <p className="sm muted">Owner signature · SVG</p>}
              <p className="font-semibold text-plum-800">
                {owner.firstName}
                {ph && (
                  <>
                    {" "}
                    <span className="tbc">[last name]</span>
                  </>
                )}
                , Owner
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 03 — Values */}
      <section
        id="values"
        aria-labelledby="values-title"
        className="bg-white py-[72px] lg:py-section"
      >
        <div className="wrap flex flex-col gap-8 lg:gap-12">
          <SectionHead
            id="values-title"
            eyebrow="03 — What we stand for"
            title="What we stand for."
            lead="Four things you can count on — and what each one means for your family."
          />
          <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {VALUES.map(({ Icon, title, text, means }) => (
              <li
                key={title}
                className="flex flex-col gap-3 rounded-[20px] border border-line bg-cream p-6"
              >
                <span
                  aria-hidden="true"
                  className="flex size-12 items-center justify-center rounded-2xl bg-plum-100 text-plum-800"
                >
                  <Icon size={24} strokeWidth={1.75} />
                </span>
                <h3 className="h3 !text-h4">{title}</h3>
                <p>{text}</p>
                <p className="mt-auto">
                  <strong className="text-plum-800">What it means for you:</strong> {means}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 04 — Caregivers */}
      <section
        id="caregivers"
        aria-labelledby="cg-title"
        className="scroll-mt-[calc(var(--header-h)+24px)] py-[72px] lg:py-section"
      >
        <div className="wrap flex flex-col gap-8 lg:gap-12">
          <SectionHead
            id="cg-title"
            eyebrow="04 — Our caregivers"
            title="Meet the people who do the caring."
            lead="Experienced caregivers — including Certified Nursing Assistants — with a real love for this work."
          />
          {cards.length > 0 && (
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {cards.map((c) => (
                <li key={c.id}>
                  <StillCard c={c} className="h-full" />
                </li>
              ))}
            </ul>
          )}
          {ph && (
            <p>
              <Tbc
                tbc={{
                  chip: '[draft: "Every Dawson caregiver goes through [background check / screening steps] before they meet a client."]',
                }}
              />
            </p>
          )}
          <Link className="btn btn-ghost self-start max-sm:w-full" href="/careers">
            Want to join them? See caregiver jobs
          </Link>
        </div>
      </section>

      {/* 05 — Licensed & insured */}
      <section
        id="licensed"
        aria-labelledby="lic-title"
        className="scroll-mt-[calc(var(--header-h)+24px)] bg-white py-[72px] lg:py-section"
      >
        <HashFocus id="licensed" />
        <div className="wrap grid items-start gap-8 lg:grid-cols-[380px_minmax(0,1fr)] lg:gap-16">
          <SectionHead
            id="lic-title"
            eyebrow="05 — Licensed & insured"
            title="Licensed & insured. Here's what that means."
            lead="You're letting someone into your family's home. You should know exactly who we are."
          />
          <ul className="flex flex-col divide-y divide-line rounded-[20px] border border-line">
            <li className="flex gap-4 p-5 lg:p-6">
              <BadgeCheck
                aria-hidden
                size={28}
                strokeWidth={1.75}
                className="flex-none text-orchid-700"
              />
              <div className="flex flex-col gap-1">
                <h3 className="h3 !text-h4">State license</h3>
                <p>Dawson and Dawson Home Care LLC is licensed in South Carolina.</p>
                {credentials.scLicenseNumber.confirmed ? (
                  <p>License number: {credentials.scLicenseNumber.value}</p>
                ) : (
                  ph && (
                    <>
                      <p>
                        License number: <span className="tbc">[SC license number]</span>
                      </p>
                      <p>
                        Issued by:{" "}
                        <span className="tbc">
                          [issuing agency — likely the SC Department of Public Health]
                        </span>
                      </p>
                    </>
                  )
                )}
              </div>
            </li>
            <li className="flex gap-4 p-5 lg:p-6">
              <ShieldCheck
                aria-hidden
                size={28}
                strokeWidth={1.75}
                className="flex-none text-orchid-700"
              />
              <div className="flex flex-col gap-1">
                <h3 className="h3 !text-h4">Insured</h3>
                <p>
                  We carry insurance.
                  {ph && (
                    <>
                      {" "}
                      <span className="tbc">[coverage types — list only what&apos;s real]</span>
                    </>
                  )}
                </p>
              </div>
            </li>
            <li className="flex gap-4 p-5 lg:p-6">
              <Users
                aria-hidden
                size={28}
                strokeWidth={1.75}
                className="flex-none text-orchid-700"
              />
              <div className="flex flex-col gap-1">
                <h3 className="h3 !text-h4">Our caregivers</h3>
                <p>Our team includes Certified Nursing Assistants.</p>
                {ph && (
                  <p>
                    <span className="tbc">
                      [screening every caregiver goes through — background checks, references,
                      training]
                    </span>
                  </p>
                )}
              </div>
            </li>
            <li className="flex gap-4 p-5 lg:p-6">
              <Stethoscope
                aria-hidden
                size={28}
                strokeWidth={1.75}
                className="flex-none text-orchid-700"
              />
              <div className="flex flex-col gap-1">
                <h3 className="h3 !text-h4">Non-medical care</h3>
                <p>
                  All our care is non-medical. We don&apos;t give injections, change wound dressings
                  or provide nursing. We&apos;re happy to work alongside your home health or hospice
                  team.
                </p>
              </div>
            </li>
            {ph && (
              <li className="flex gap-4 p-5 lg:p-6">
                <FileCheck
                  aria-hidden
                  size={28}
                  strokeWidth={1.75}
                  className="flex-none text-orchid-700"
                />
                <div className="flex flex-col gap-1">
                  <h3 className="h3 !text-h4">Check it yourself</h3>
                  <p>
                    Look up our license on the state&apos;s website →{" "}
                    <span className="tbc">[public license lookup URL]</span>
                  </p>
                  <p>
                    <span className="tbc">
                      [draft: &quot;Ask to see our license and insurance certificate at your free
                      visit.&quot;]
                    </span>
                  </p>
                </div>
              </li>
            )}
          </ul>
        </div>
      </section>

      {/* 06 — Community */}
      <section id="community" aria-labelledby="comm-title" className="py-[72px] lg:py-section">
        <div className="wrap flex flex-col gap-8 lg:gap-12">
          <SectionHead
            id="comm-title"
            eyebrow="06 — Our community"
            title="Part of the Lowcountry."
            lead="Our office is on Robert Smalls Parkway in Beaufort. We've cared for families here since 2002 — in Beaufort and across the Lowcountry."
          />
          {ph && (
            <p>
              <span className="tbc">
                [community involvement — churches, organizations, local events. Show only if real.]
              </span>
            </p>
          )}
          <div className="grid gap-4 md:grid-cols-3">
            <PhotoSlot label="Our office · 3:2" ratio="3/2" />
            <PhotoSlot label="Lowcountry scene · 3:2" ratio="3/2" />
            <PhotoSlot label="Beaufort scene · 3:2" ratio="3/2" />
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:gap-8">
            <a className="link inline-flex items-center gap-2" href={links.googleMaps.value}>
              <MapPin aria-hidden size={20} strokeWidth={1.75} />
              Get directions to our office
            </a>
            <a className="link" href={links.instagram.value}>
              Follow us on Instagram
            </a>
          </div>
        </div>
      </section>

      <DuskCta title={["Let's talk about your", "family", "."]} />
    </>
  );
}
