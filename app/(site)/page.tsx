import type { Metadata } from "next";
import { HomeIntro } from "@/components/home/HomeIntro";
import { Hero } from "@/components/home/Hero";
import { TheMoment } from "@/components/home/TheMoment";
import { HowWeHelp } from "@/components/home/HowWeHelp";
import "@/components/home/home.css";

export const metadata: Metadata = {
  title: "In-Home Care in Beaufort, SC | Dawson & Dawson Home Care",
  description:
    "Owner-run, non-medical home care in Beaufort, SC since 2002. Personal care, home help, companionship, respite and 24-hour care. Free in-home assessment.",
};

/**
 * Home (design 01-home-desktop + 02-home-mobile, COPY_HOME). One component per chapter in
 * components/home/. Chapters 03–12 and the final CTA follow in the next step of Phase 3.
 */
export default function HomePage() {
  return (
    <>
      <HomeIntro />
      <Hero />
      <TheMoment />
      <HowWeHelp />
      {/* Target of the "Skip to the next section" link until chapter 03 (Find the right care) lands. */}
      <div id="find-care" tabIndex={-1} />
    </>
  );
}
