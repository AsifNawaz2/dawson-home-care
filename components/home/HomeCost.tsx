/**
 * 09 — Cost (design 01/02-home "10. COST", COPY_HOME §10, BUILD_DECISIONS row 29: the docs'
 * numbers and logic — 4 h × 3 days, hours-only until real rates — in the design's two panels).
 */
import { rates } from "@/content/site.config";
import { Badge, CostEstimator } from "@/components/features/CostEstimator";

export function HomeCost() {
  return (
    <section aria-labelledby="cost-title" className="bg-white py-[88px] lg:py-section-lg">
      <div className="wrap">
        <div className="grid items-end gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-12">
          <div className="flex flex-col items-start gap-3 lg:gap-4">
            <p className="eyebrow">09 — Cost</p>
            <h2 id="cost-title" className="h2">
              What will care cost?
            </h2>
            <p className="lead">
              Move the sliders for a rough weekly and monthly range. No email, no sign-up.
            </p>
          </div>
          {!rates.rateConfirmed && (
            <div>
              <Badge />
            </div>
          )}
        </div>
        <div className="mt-7 lg:mt-14">
          <CostEstimator
            variant="home"
            source="home"
            links={[
              { label: "Estimate your cost in detail", href: "/paying-for-care" },
              { label: "See ways families pay for care", href: "/paying-for-care#ways-to-pay" },
            ]}
          />
        </div>
      </div>
    </section>
  );
}
