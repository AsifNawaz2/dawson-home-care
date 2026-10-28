"use client";

/**
 * 02 — How we help (design 01/02-home "3. HOW WE HELP", COPY_HOME §3; the illustrated house is
 * replaced by video collages — BUILD_DECISIONS rows 17–18, answer 4).
 *
 * Full motion: a pinned scene 5.5 screens tall. Each service's video collage slides in from the
 * right (and drifts off left as the next arrives) while its card fades in, with ticks and
 * "1 of 5". Only the collage on screen plays. Tabbing to a card's link scrolls to that card.
 * Reduced motion: five rows of card + still collage (posters), nothing moves or plays.
 */
import Link from "next/link";
import { useRef } from "react";
import { useMotionMode } from "@/lib/motionMode";
import { services } from "@/content/navigation";
import { collages, howWeHelp } from "@/content/copy/home";
import { Collage } from "@/components/ui/Collage";
import { flags, service } from "@/content/site.config";
import { clamp, ease, useScrollScene } from "./scroll";

const N = services.length;

export function HowWeHelp() {
  const live = useMotionMode() === "full";
  const track = useRef<HTMLDivElement>(null);
  const pin = useRef<HTMLDivElement>(null);

  /** Same maths as the design: the scene runs from half a screen before the pin. */
  const measure = () => {
    const t = track.current!;
    const vh = pin.current!.offsetHeight;
    const r = t.getBoundingClientRect();
    const range = Math.max(1, r.height - vh + vh * 0.5);
    return { r, vh, range, u: clamp((-r.top + vh * 0.5) / range) * N };
  };

  useScrollScene(
    () => {
      const t = track.current;
      if (!t || !pin.current) return;
      const { r, u } = measure();
      const act = Math.min(N - 1, Math.floor(u));
      const near = r.top < window.innerHeight && r.bottom > 0;
      t.querySelectorAll<HTMLElement>("[data-batch]").forEach((b, i) => {
        const en = clamp((u - i) / 0.4);
        const ex = i < N - 1 ? clamp((u - i - 1) / 0.4) : 0;
        const tx = (1 - ease(en)) * 110 - ease(ex) * 35;
        const op = en > 0 ? 1 - ex : 0;
        b.style.transform = `translate3d(${tx}%,0,0)`;
        b.style.opacity = String(op);
        b.querySelectorAll("video").forEach((v) => {
          if (near && i === act && op > 0.05) {
            if (v.paused) v.play().catch(() => {});
          } else if (!v.paused) v.pause();
        });
      });
      t.querySelectorAll<HTMLElement>("[data-card]").forEach((c, i) => {
        c.dataset.active = String(i === act);
      });
      t.querySelectorAll<HTMLElement>("[data-tick]").forEach((el, i) => {
        el.dataset.on = String(i <= act);
      });
      const count = t.querySelector<HTMLElement>("[data-count]");
      if (count) count.textContent = `${act + 1} of ${N}`;
    },
    live,
    () => track.current?.querySelectorAll("video").forEach((v) => v.pause()),
  );

  /** Keyboard: focusing a hidden card's link scrolls the scene to that card. */
  const showCard = (i: number) => {
    if (!live || !track.current || !pin.current) return;
    const { r, vh, range, u } = measure();
    if (Math.min(N - 1, Math.floor(u)) === i) return;
    const top = window.scrollY + r.top + ((i + 0.5) / N) * range - vh * 0.5;
    window.scrollTo({ top, behavior: "instant" });
  };

  const hospiceConfirmed = service.hospiceSupport.confirmed && service.hospiceSupport.value;

  return (
    <section id="how-we-help" aria-labelledby="house-title">
      {/* Heading above the scene — phones (live) and every size in reduced motion */}
      <div className="wrap pt-[88px] lg:pt-section-lg lg:live:hidden">
        <div className="flex max-w-[720px] flex-col gap-3 lg:gap-4">
          <a className="skip" href="#find-care">
            {howWeHelp.skip}
          </a>
          <p className="eyebrow">{howWeHelp.eyebrow}</p>
          <h2 id="house-title" className="h2">
            {howWeHelp.title}
          </h2>
          <p className="lead">{howWeHelp.subline}</p>
        </div>
      </div>

      {/* Live scene */}
      <div ref={track} className="relative hidden h-[550svh] live:block">
        <div
          ref={pin}
          className="sticky top-0 flex h-svh flex-col justify-center overflow-hidden pt-[84px] pb-[92px] lg:flex-row lg:items-center lg:p-0"
        >
          <div className="wrap grid gap-[18px] lg:grid-cols-[360px_minmax(0,1fr)] lg:items-center lg:gap-12 lg:pt-[var(--header-h)]">
            <div className="flex flex-col gap-[18px] lg:gap-4">
              {/* Same heading, inside the pinned scene on desktop (design) */}
              <div className="hidden flex-col gap-4 lg:flex">
                <a className="skip" href="#find-care">
                  {howWeHelp.skip}
                </a>
                <p className="eyebrow">{howWeHelp.eyebrow}</p>
                <h2 className="h2">{howWeHelp.title}</h2>
                <p className="lead">{howWeHelp.subline}</p>
              </div>
              <div className="grid min-h-[232px] lg:mt-2 lg:min-h-[248px]">
                {services.map((s, i) => (
                  <div
                    key={s.slug}
                    className="hcard"
                    data-card=""
                    data-active={i === 0 ? "true" : "false"}
                    onFocus={() => showCard(i)}
                  >
                    <ServiceCard service={s} />
                  </div>
                ))}
              </div>
              <div aria-hidden="true" className="flex items-center gap-2 lg:gap-2.5">
                {services.map((s, i) => (
                  <span
                    key={s.slug}
                    className="tick"
                    data-tick=""
                    data-on={i === 0 ? "true" : "false"}
                  />
                ))}
                <span data-count="" className="sm ml-1.5 font-semibold text-muted lg:ml-2">
                  1 of {N}
                </span>
              </div>
            </div>
            <div aria-hidden="true" className="@container max-lg:order-first">
              <div className="hw-stage relative" data-poster-scope="">
                {services.map((s, i) => (
                  <div
                    key={s.slug}
                    className="batch"
                    data-batch=""
                    style={{
                      transform: `translate3d(${i === 0 ? 0 : 110}%,0,0)`,
                      opacity: i === 0 ? 1 : 0,
                    }}
                  >
                    <Collage data={collages[s.slug]} playable lazyPoster />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reduced motion: every service with its still collage */}
      <div className="wrap mt-14 flex flex-col gap-12 live:hidden">
        {services.map((s, i) => (
          <div
            key={s.slug}
            className="grid items-center gap-6 lg:grid-cols-[360px_minmax(0,1fr)] lg:gap-12"
          >
            <ServiceCard service={s} position={`${i + 1} of ${N}`} />
            <div aria-hidden="true" className="hw-static @container">
              <Collage data={collages[s.slug]} />
            </div>
          </div>
        ))}
      </div>

      <div className="wrap pt-6 pb-[88px] lg:pt-16 lg:pb-section-lg">
        <div className="flex flex-col items-start gap-3 lg:grid lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-12">
          <div className="flex max-w-[760px] flex-col gap-3">
            <p className="lead text-plum-800">{howWeHelp.after}</p>
            <p className="sm muted">{howWeHelp.nonMedical}</p>
            {(hospiceConfirmed || flags.showPlaceholders) && (
              <p className="sm muted">
                {howWeHelp.hospice}{" "}
                {!hospiceConfirmed && <span className="tbc">{howWeHelp.hospicePlaceholder}</span>}
              </p>
            )}
          </div>
          <Link
            href={howWeHelp.allServices.href}
            className="btn btn-ghost max-lg:mt-2 max-md:w-full"
            data-cursor-label="View"
          >
            {howWeHelp.allServices.label}
          </Link>
        </div>
      </div>
    </section>
  );
}

function ServiceCard({
  service: s,
  position,
}: {
  service: (typeof services)[number];
  position?: string;
}) {
  return (
    <div className="flex flex-col gap-2 rounded-[20px] border border-line bg-white p-[22px] lg:gap-2.5 lg:p-7">
      {position && (
        <p className="eyebrow" aria-hidden="true">
          {position}
        </p>
      )}
      <h3 className="h3">{s.name}</h3>
      <p>{s.promise}</p>
      <p className="sm muted">{s.smallLabel}</p>
      <Link className="link self-start" href={s.href} data-cursor-label="Open">
        <span>
          {howWeHelp.cardLink}
          <span className="sr-only"> with {s.name}</span>
          <span aria-hidden="true"> →</span>
        </span>
      </Link>
    </div>
  );
}
