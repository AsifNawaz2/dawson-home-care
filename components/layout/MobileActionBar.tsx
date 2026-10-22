"use client";

/**
 * Sticky phone action bar (design 02-home-mobile, 07 §10, COPY_CONVERSION §2):
 * Call · Text · Free Assessment (after hours: Callback). Hides while the on-screen keyboard is
 * open or any [data-hides-mobile-bar] element (forms, quiz) is on screen.
 */
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { House, MessageSquare, Moon, Phone } from "lucide-react";
import { contact } from "@/content/site.config";
import { useOfficeStatus } from "./OfficeStatus";
import { cn } from "@/lib/cn";

const phone = contact.phone.value;
const text = contact.tollFree.value;

export function MobileActionBar() {
  const pathname = usePathname();
  const { isClosed } = useOfficeStatus();
  const [hidden, setHidden] = useState(false);
  const twoUp = pathname === "/free-assessment" || pathname === "/thank-you";

  useEffect(() => {
    let typing = false;
    let formInView = false;
    const update = () => setHidden(typing || formInView);

    const isText = (el: EventTarget | null) =>
      el instanceof HTMLElement &&
      el.matches(
        'input:not([type="range"]):not([type="checkbox"]):not([type="radio"]),select,textarea',
      );
    const onIn = (e: FocusEvent) => {
      if (isText(e.target)) {
        typing = true;
        update();
      }
    };
    const onOut = () => {
      typing = false;
      update();
    };
    const vv = window.visualViewport;
    const onVV = () => {
      if (!vv) return;
      typing = vv.height < window.innerHeight - 150 || isText(document.activeElement);
      update();
    };

    const seen = new Set<Element>();
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => (e.isIntersecting ? seen.add(e.target) : seen.delete(e.target)));
      formInView = seen.size > 0;
      update();
    });
    const observeAll = () =>
      document.querySelectorAll("[data-hides-mobile-bar]").forEach((el) => io.observe(el));
    observeAll();
    const mo = new MutationObserver(observeAll);
    mo.observe(document.body, { childList: true, subtree: true });

    document.addEventListener("focusin", onIn);
    document.addEventListener("focusout", onOut);
    vv?.addEventListener("resize", onVV);
    return () => {
      io.disconnect();
      mo.disconnect();
      document.removeEventListener("focusin", onIn);
      document.removeEventListener("focusout", onOut);
      vv?.removeEventListener("resize", onVV);
    };
  }, [pathname]);

  return (
    <nav
      aria-label="Quick contact"
      inert={hidden || undefined}
      className={cn(
        "fixed inset-x-0 bottom-0 z-[200] grid gap-2 border-t border-line bg-white px-2.5 pt-2 pb-[calc(8px+env(safe-area-inset-bottom))] transition-[transform,visibility] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] md:hidden print:hidden reduce-motion:transition-none",
        twoUp ? "grid-cols-2" : "grid-cols-[minmax(0,0.9fr)_minmax(0,0.9fr)_minmax(0,1.5fr)]",
        hidden && "invisible translate-y-[110%]",
      )}
    >
      <a
        className="mbtn bg-plum-800 text-white hover:text-white"
        href={`tel:${phone.tel}`}
        aria-label={`Call Dawson at ${phone.display}`}
      >
        <Phone aria-hidden size={20} strokeWidth={1.75} />
        Call
      </a>
      <a
        className="mbtn border-plum-800 bg-white text-plum-800 hover:text-plum-800"
        href={`sms:${text.tel}`}
        aria-label={`Text Dawson at ${text.display}`}
      >
        <MessageSquare aria-hidden size={20} strokeWidth={1.75} />
        Text
      </a>
      {!twoUp && (
        <Link
          className="mbtn bg-leaf-500 text-plum-950 hover:text-plum-950"
          href="/free-assessment"
          // Accessible name keeps the visible words first (WCAG 2.5.3); COPY_CONVERSION §2 wording after.
          aria-label={
            isClosed
              ? "Callback: request a callback"
              : "Free Assessment: get a free care assessment"
          }
        >
          {isClosed ? (
            <Moon aria-hidden size={20} strokeWidth={1.75} />
          ) : (
            <House aria-hidden size={20} strokeWidth={1.75} />
          )}
          {isClosed ? "Callback" : "Free Assessment"}
        </Link>
      )}
    </nav>
  );
}
