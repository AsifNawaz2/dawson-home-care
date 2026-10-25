import type { Metadata } from "next";
import { Mail, Phone } from "lucide-react";
import { contact, flags, links, owner, reputation } from "@/content/site.config";
import { realReviews } from "@/content/reviews";
import { pageMetadata } from "@/lib/seo";
import { PageHero, SectionHead } from "@/components/ui/PageHero";
import { AssessmentButton } from "@/components/ui/AssessmentButton";
import { DuskCta } from "@/components/ui/DuskCta";
import { Stars } from "@/components/services/ServiceReview";
import { ReviewsGrid } from "@/components/trust/ReviewsGrid";

export const metadata: Metadata = pageMetadata("/reviews");

const phone = contact.phone.value;
const email = contact.email.value;
const ph = flags.showPlaceholders;
const enough = realReviews().length >= 3;
const rating = reputation.google;
/** The reviews URL once confirmed; until then the owner's confirmed Google Maps link. */
const readOnGoogle = links.googleReviews.value ?? links.googleMaps.value;

/**
 * Reviews (COPY_TRUST "REVIEWS"; Home review cards in a grid with quiz-chip filters —
 * BUILD_DECISIONS §E). No Review/AggregateRating schema on our own business (SEO_PLAN §3.1).
 */
export default function ReviewsPage() {
  return (
    <>
      <PageHero
        path="/reviews"
        eyebrow="Reviews"
        title={["In their", "words", "."]}
        lead="What Lowcountry families say about the care we give the people they love."
      >
        <AssessmentButton href="/free-assessment" className="max-sm:w-full" />
        <a className="btn btn-ghost max-sm:w-full" href="#leave-a-review">
          Leave a review
        </a>
      </PageHero>

      {!enough && (
        <div className="wrap pb-12">
          <div className="flex flex-col gap-2 rounded-[20px] bg-plum-100 p-6 lg:p-8">
            <p className="h3">We&apos;re gathering reviews.</p>
            <p>
              Families have trusted us since 2002 — and we&apos;re now collecting their stories
              here. Is Dawson caring for your family? We&apos;d love to hear from you.
            </p>
          </div>
        </div>
      )}

      {enough && rating.confirmed && (
        <section id="rating" aria-labelledby="rating-title" className="bg-white py-[72px] lg:py-20">
          <div className="wrap flex flex-col gap-4">
            <p className="eyebrow">01 — On Google</p>
            <h2
              id="rating-title"
              className="flex flex-wrap items-baseline gap-x-4 gap-y-2 text-plum-800"
            >
              <span className="sr-only">
                Rated {rating.value.rating} out of 5 on Google, from {rating.value.count} reviews.
              </span>
              <span aria-hidden="true" className="ff text-[5rem] leading-none lg:text-[6.5rem]">
                {rating.value.rating}
              </span>
              <span aria-hidden="true" className="flex flex-col gap-1">
                <Stars rating={5} size={28} />
                <span className="text-[1.25rem] font-semibold">out of 5 on Google</span>
              </span>
            </h2>
            <p aria-hidden="true" className="lead">
              Based on {rating.value.count} Google reviews
            </p>
            <p>
              <a href={readOnGoogle} className="font-semibold">
                Read them on Google
              </a>
              <span className="sm muted"> · goes to Google</span>
            </p>
          </div>
        </section>
      )}

      {enough && (
        <section id="reviews" aria-labelledby="grid-title" className="py-[72px] lg:py-28">
          <div className="wrap flex flex-col gap-8 lg:gap-10">
            <SectionHead
              id="grid-title"
              eyebrow="02 — Reviews from families"
              title="Reviews from families."
            />
            <ReviewsGrid />
            <div className="flex flex-col gap-1">
              <p className="sm muted">
                To protect privacy, we show first names and last initials only.
              </p>
              <p className="sm muted">
                Every review on this page comes from a real Dawson client or family member.
                {ph && (
                  <>
                    {" "}
                    <span className="tbc">
                      [draft: &quot;We share the good and the not-so-good — we never hide a review
                      because we didn&apos;t like it.&quot;]
                    </span>
                  </>
                )}
              </p>
            </div>
          </div>
        </section>
      )}

      <section
        id="leave-a-review"
        aria-labelledby="leave-title"
        className="scroll-mt-[calc(var(--header-h)+24px)] bg-white py-[72px] lg:py-28"
      >
        <div className="wrap grid items-start gap-6 lg:grid-cols-2 lg:gap-12">
          <div className="flex flex-col gap-4 rounded-[20px] bg-orchid-100 p-6 lg:p-10">
            <p className="eyebrow">04 — Share your experience</p>
            <h2 id="leave-title" className="h2">
              Is Dawson caring for your family?
            </h2>
            <p>
              We&apos;d be grateful if you&apos;d share your experience. Your words help other
              Lowcountry families decide with confidence.
            </p>
            {links.googleWriteReview.confirmed && links.googleWriteReview.value ? (
              <>
                <a
                  className="btn btn-primary self-start max-sm:w-full"
                  href={links.googleWriteReview.value}
                >
                  Leave a review on Google
                </a>
                <p className="sm muted">Goes to Google. You&apos;ll need a Google account.</p>
              </>
            ) : (
              ph && (
                <p>
                  <span className="tbc">
                    [Google review link — the &quot;Leave a review on Google&quot; button appears
                    once it&apos;s confirmed]
                  </span>
                </p>
              )
            )}
          </div>
          <div className="flex flex-col gap-4 rounded-[20px] border border-line p-6 lg:p-10">
            <h3 className="h3">Something we could do better?</h3>
            <p>
              Tell us directly. Call {phone.display} or email {email}.
              {ph && (
                <>
                  {" "}
                  <span className="tbc">
                    [draft: &quot;{owner.firstName.value} reads every message.&quot;]
                  </span>
                </>
              )}
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                className="btn btn-ghost max-sm:w-full"
                href={`tel:${phone.tel}`}
                data-cursor-label="Call"
              >
                <Phone aria-hidden size={20} strokeWidth={1.75} />
                Call {phone.display}
              </a>
              <a className="btn btn-ghost max-sm:w-full" href={`mailto:${email}`}>
                <Mail aria-hidden size={20} strokeWidth={1.75} />
                Email us
              </a>
            </div>
          </div>
        </div>
      </section>

      <DuskCta title={["Let's talk about your", "family", "."]} />
    </>
  );
}
