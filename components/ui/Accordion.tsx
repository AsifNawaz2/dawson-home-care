"use client";

/**
 * FAQ accordion (design .faq-q): one open at a time, the first open by default. Questions are H3
 * buttons; IDs are deep links — arriving with #id opens that answer.
 */
import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

export type AccordionItem = { id: string; q: string; a: React.ReactNode };

export function Accordion({
  items,
  defaultOpen = 0,
  className,
}: {
  items: AccordionItem[];
  defaultOpen?: number;
  className?: string;
}) {
  const [open, setOpen] = useState(defaultOpen);

  useEffect(() => {
    const fromHash = () => {
      const i = items.findIndex((it) => `#${it.id}` === window.location.hash);
      if (i >= 0) setOpen(i);
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, [items]);

  return (
    <div className={cn("border-t border-line", className)}>
      {items.map((it, i) => {
        const isOpen = open === i;
        return (
          <div
            key={it.id}
            id={it.id}
            className="scroll-mt-[calc(var(--header-h)+16px)] border-b border-line"
          >
            <h3>
              <button
                type="button"
                className="faq-q"
                aria-expanded={isOpen}
                aria-controls={`${it.id}-a`}
                onClick={() => setOpen(isOpen ? -1 : i)}
              >
                {it.q}
                <ChevronDown
                  aria-hidden
                  size={24}
                  strokeWidth={2}
                  className={cn(
                    "flex-none text-orchid-700 transition-transform duration-300 reduce-motion:transition-none",
                    isOpen && "rotate-180",
                  )}
                />
              </button>
            </h3>
            <div id={`${it.id}-a`} hidden={!isOpen} className="max-w-[760px] pb-7">
              {it.a}
            </div>
          </div>
        );
      })}
    </div>
  );
}
