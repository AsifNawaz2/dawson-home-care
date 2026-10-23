import type { Metadata } from "next";
import { HomeIntro } from "@/components/home/HomeIntro";
import { Hero } from "@/components/home/Hero";
import { TheMoment } from "@/components/home/TheMoment";
import { HowWeHelp } from "@/components/home/HowWeHelp";
import { FindCare } from "@/components/home/FindCare";
import { HowItWorks } from "@/components/home/HowItWorks";
import { Since2002 } from "@/components/home/Since2002";
import { MeetOwner } from "@/components/home/MeetOwner";
import { Caregivers } from "@/components/home/Caregivers";
import { Reviews } from "@/components/home/Reviews";
import { HomeCost } from "@/components/home/HomeCost";
import { WhereWeCare } from "@/components/home/WhereWeCare";
import { ForProfessionals } from "@/components/home/ForProfessionals";
import { HomeFaq } from "@/components/home/HomeFaq";
import { FinalCta } from "@/components/home/FinalCta";
import "@/components/home/home.css";

export const metadata: Metadata = {
  title: "In-Home Care in Beaufort, SC | Dawson & Dawson Home Care",
  description:
    "Owner-run, non-medical home care in Beaufort, SC since 2002. Personal care, home help, companionship, respite and 24-hour care. Free in-home assessment.",
};

/**
 * Home (design 01-home-desktop + 02-home-mobile, COPY_HOME). One component per chapter in
 * components/home/.
 */
export default function HomePage() {
  return (
    <>
      <HomeIntro />
      <Hero />
      <TheMoment />
      <HowWeHelp />
      <FindCare />
      <HowItWorks />
      <Since2002 />
      <MeetOwner />
      <Caregivers />
      <Reviews />
      <HomeCost />
      <WhereWeCare />
      <ForProfessionals />
      <HomeFaq />
      <FinalCta />
    </>
  );
}
