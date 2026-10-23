"use client";

/**
 * "Get a Free Care Assessment" button. After office hours it reads "Request a Callback" and
 * adds after_hours=true to the same destination (COPY_HOME §0 after-hours rule).
 */
import Link from "next/link";
import { CtaLabel, useOfficeStatus } from "@/components/layout/OfficeStatus";
import { cn } from "@/lib/cn";

export function AssessmentButton({
  href = "/free-assessment",
  className,
  open,
  closed,
  onNavigate,
  variant = "primary",
}: {
  href?: string;
  className?: string;
  /** Label while the office is open (default "Get a Free Care Assessment"). */
  open?: string;
  /** Label after hours (default "Request a Callback"). */
  closed?: string;
  /** Runs before navigating (e.g. hand the quiz answers to the form). */
  onNavigate?: () => void;
  variant?: "primary" | "ghost";
}) {
  const { isClosed } = useOfficeStatus();
  const to = isClosed ? `${href}${href.includes("?") ? "&" : "?"}after_hours=true` : href;
  return (
    <Link
      href={to}
      className={cn("btn", variant === "ghost" ? "btn-ghost" : "btn-primary", className)}
      onClick={onNavigate}
    >
      <CtaLabel open={open} closed={closed} />
    </Link>
  );
}
