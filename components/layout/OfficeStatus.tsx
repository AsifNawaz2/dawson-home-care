"use client";

/**
 * Office-status chip + after-hours mode (07 §11, SPEC §15, COPY_CONVERSION §1).
 * Server / no-JS / pre-hydration: neutral "Office hours: Mon–Fri, 8 AM–5 PM" (no wrong flash).
 * Re-checks every 60 s and when the tab becomes visible. Never a live region.
 */
import { createContext, useContext, useEffect, useState } from "react";
import { Clock, Moon } from "lucide-react";
import { contact, hours } from "@/content/site.config";
import { etSuffix, getOfficeStatus, type OfficeStatus } from "@/lib/officeHours";
import { cn } from "@/lib/cn";

type Ctx = { status: OfficeStatus | null; et: string };
const OfficeCtx = createContext<Ctx>({ status: null, et: "" });

export function OfficeStatusProvider({ children }: { children: React.ReactNode }) {
  const [value, setValue] = useState<Ctx>({ status: null, et: "" });
  useEffect(() => {
    const holidays = hours.holidays.confirmed ? hours.holidays.value : [];
    const tick = () => setValue({ status: getOfficeStatus(new Date(), holidays), et: etSuffix() });
    tick();
    const id = window.setInterval(tick, 60_000);
    const onVis = () => document.visibilityState === "visible" && tick();
    document.addEventListener("visibilitychange", onVis);
    return () => {
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);
  return <OfficeCtx.Provider value={value}>{children}</OfficeCtx.Provider>;
}

export function useOfficeStatus() {
  const { status, et } = useContext(OfficeCtx);
  const isClosed = status?.state === "closed" || status?.state === "holiday";
  return { status, et, isClosed, known: status !== null };
}

/** "Monday at 8 AM" (+ " ET" for visitors outside Eastern time). */
export function NextOpen() {
  const { status, et } = useOfficeStatus();
  return <>{status ? `${status.nextOpenLabel}${et}` : "Monday at 8 AM"}</>;
}

const phone = contact.phone.value;

type ChipProps = {
  size?: "compact" | "expanded";
  surface?: "light" | "dark";
  className?: string;
};

/**
 * Light surfaces use the designed pill (leaf-100 / plum-100). Dark surfaces (footer) use the
 * designed plain line with a leaf dot or a moon icon.
 */
export function OfficeStatusChip({ size = "compact", surface = "light", className }: ChipProps) {
  const { status, et } = useOfficeStatus();
  const dark = surface === "dark";

  if (!status) {
    return (
      <p
        className={cn(
          dark
            ? "sm inline-flex items-center gap-2.5 font-semibold text-cream"
            : "chip chip-neutral",
          className,
        )}
      >
        <Clock
          aria-hidden
          size={18}
          strokeWidth={1.75}
          className={dark ? "text-plum-100" : "text-orchid-700"}
        />
        Office hours: {hours.officeLabelShort}
      </p>
    );
  }

  const open = status.state === "open" || status.state === "closing-soon";
  let text: string;
  if (status.state === "open") {
    text = size === "expanded" ? `Office open now · Call ${phone.display}` : "Office open now";
  } else if (status.state === "closing-soon") {
    text =
      size === "expanded"
        ? `Office open until 5 PM${et} · Call ${phone.display} now, or request a callback.`
        : `Office open until 5 PM${et}`;
  } else if (status.state === "holiday") {
    text =
      size === "expanded"
        ? `Office closed today for ${status.holidayName} · Opens ${status.nextOpenLabel}${et}. Request a callback and we'll reach you first thing.`
        : `Office closed for ${status.holidayName} · Opens ${status.nextOpenLabel}${et}`;
  } else {
    text =
      size === "expanded"
        ? `Office closed · Opens ${status.nextOpenLabel}${et}. Request a callback and we'll reach you first thing.`
        : `Office closed · Opens ${status.nextOpenLabel}${et}`;
  }

  if (dark) {
    return (
      <p
        className={cn(
          "sm inline-flex gap-2.5 font-semibold text-cream",
          open ? "items-center" : "items-start",
          className,
        )}
        data-office={status.state}
      >
        {open ? (
          <span aria-hidden className="dot-open" />
        ) : (
          <Moon
            aria-hidden
            size={18}
            strokeWidth={1.75}
            className="mt-[3px] flex-none text-plum-100"
          />
        )}
        {text}
      </p>
    );
  }

  return (
    <p
      className={cn("chip", open ? "chip-open" : "chip-closed", className)}
      data-office={status.state}
    >
      {open ? (
        <span aria-hidden className="dot-open" />
      ) : (
        <Moon aria-hidden size={18} strokeWidth={1.75} className="flex-none text-plum-800" />
      )}
      {text}
    </p>
  );
}

/**
 * Zero-shift CTA label (SPEC §15.4): both labels share one grid cell, so the button is always as
 * wide as the longer one and never shifts when the clock or hydration flips the state.
 */
export function CtaLabel({
  open = "Get a Free Care Assessment",
  closed = "Request a Callback",
}: {
  open?: string;
  closed?: string;
}) {
  const { isClosed } = useOfficeStatus();
  return (
    <span className="grid">
      <span
        className={cn("[grid-area:1/1]", isClosed && "invisible")}
        aria-hidden={isClosed || undefined}
      >
        {open}
      </span>
      <span
        className={cn("[grid-area:1/1]", !isClosed && "invisible")}
        aria-hidden={!isClosed || undefined}
      >
        {closed}
      </span>
    </span>
  );
}

/** Renders children only while the office is closed (after-hours lines). */
export function WhenClosed({ children }: { children: React.ReactNode }) {
  const { isClosed } = useOfficeStatus();
  return isClosed ? <>{children}</> : null;
}
