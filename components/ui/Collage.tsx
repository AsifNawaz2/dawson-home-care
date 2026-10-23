"use client";

/**
 * The design's video collage: a lavender panel on a 700 × 620 canvas with 2–3 portrait clips.
 * Decorative (always aria-hidden by the caller); the page text carries the meaning.
 *
 *  - <Collage data playable />   videos, played/paused by the parent scene (Home "How we help").
 *  - <Collage data />            still posters (reduced motion).
 *  - <AutoCollage data />        service heroes: plays while on screen, posters in reduced motion.
 */
import Image from "next/image";
import { useEffect, useRef } from "react";
import type { Collage as CollageData } from "@/content/copy/home";
import { useMotionMode } from "@/lib/motionMode";

const cq = (v: number) => `${(v / 7).toFixed(4)}cqw`;

export function Collage({ data, playable = false }: { data: CollageData; playable?: boolean }) {
  return (
    <div className="collage">
      <span
        className="c-panel"
        style={{
          left: cq(data.panel.left),
          top: cq(data.panel.top),
          width: cq(data.panel.width),
          height: cq(data.panel.height),
        }}
      />
      {data.clips.map((c, i) => (
        <div
          key={c.name}
          className="cv"
          data-playing="false"
          style={{ left: cq(c.left), top: cq(c.top), zIndex: i + 1 }}
        >
          {playable ? (
            <video
              src={`/videos/${c.name}.mp4`}
              poster={`/images/poster-${c.name}.jpg`}
              muted
              loop
              playsInline
              preload="none"
              tabIndex={-1}
              onPlaying={(e) => e.currentTarget.parentElement?.setAttribute("data-playing", "true")}
              onPause={(e) => e.currentTarget.parentElement?.setAttribute("data-playing", "false")}
            />
          ) : (
            <Image
              src={`/images/poster-${c.name}.jpg`}
              alt=""
              width={540}
              height={960}
              sizes="240px"
            />
          )}
          <span className="cv-play">
            <svg viewBox="0 0 24 24" fill="currentColor" className="text-white">
              <polygon points="7 4 20 12 7 20 7 4" />
            </svg>
          </span>
        </div>
      ))}
    </div>
  );
}

/** Plays its clips only while at least a quarter of it is on screen; still posters when reduced. */
export function AutoCollage({ data }: { data: CollageData }) {
  const live = useMotionMode() === "full";
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!live || !root) return;
    const videos = Array.from(root.querySelectorAll("video"));
    const io = new IntersectionObserver(
      ([entry]) => {
        videos.forEach((v) => {
          if (entry?.isIntersecting && !document.hidden) v.play().catch(() => {});
          else v.pause();
        });
      },
      { threshold: 0.25 },
    );
    io.observe(root);
    return () => {
      io.disconnect();
      videos.forEach((v) => v.pause());
    };
  }, [live]);

  return (
    <div ref={ref}>
      <Collage data={data} playable={live} />
    </div>
  );
}
