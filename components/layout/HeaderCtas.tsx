"use client";

/**
 * The desktop button pair: green "Get a Free Assessment" (after hours "Request a Callback") ·
 * Call. Below 1440px Call reads "Call" (the number stays in its accessible name).
 *
 * Home renders it twice — in the header and under the hero image — but only one copy is ever
 * visible or focusable: components/home/CtaTravel.tsx hands the pair over at the same spot and
 * flies the header copy up into the bar while the page scrolls (BUILD_DECISIONS §I.4).
 */
import { Phone } from "lucide-react";
import { contact } from "@/content/site.config";
import { AssessmentButton } from "@/components/ui/AssessmentButton";
import { cn } from "@/lib/cn";

const phone = contact.phone.value;

export function HeaderCtas({ where, className }: { where: "header" | "hero"; className?: string }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)} data-cta-pair={where}>
      <span className="contents" data-cta-assess="">
        <AssessmentButton className="px-5" open="Get a Free Assessment" />
      </span>
      <a className="btn btn-secondary px-5" href={`tel:${phone.tel}`} data-cursor-label="Call">
        <Phone aria-hidden size={18} strokeWidth={1.75} className="ring-icon" />
        <span>
          Call<span className="max-[89.99rem]:sr-only"> {phone.display}</span>
        </span>
      </a>
    </div>
  );
}
