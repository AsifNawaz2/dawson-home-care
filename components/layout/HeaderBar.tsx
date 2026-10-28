"use client";

/**
 * Site header (design 01-home-desktop / 02-home-mobile): logo · 5 links · Free Assessment ·
 * Call on desktop; logo · call circle · menu button on phones. "Care services" opens the Care
 * mega-menu (5 services + quiz). The bar uses the wider `wrap-wide` so both buttons fit; below
 * 1440px the Call button shows "Call" only (the number stays in its accessible name), and with
 * Comfort Controls larger text (html[data-text-scale]) the Free Assessment button steps aside.
 *
 * Home (desktop): the bar starts without buttons and the links spread out; the hero's buttons
 * travel up into the dock as the page scrolls (components/home/CtaTravel.tsx, data-cta-* hooks).
 */
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { ChevronDown, Menu, Phone, X } from "lucide-react";
import { contact, hours } from "@/content/site.config";
import { mainNav, megaMenu, services } from "@/content/navigation";
import { OfficeStatusChip } from "./OfficeStatus";
import { HeaderCtas } from "./HeaderCtas";
import { cn } from "@/lib/cn";

const phone = contact.phone.value;

export function HeaderBar({ logo }: { logo: React.ReactNode }) {
  const pathname = usePathname();
  const [megaOpen, setMegaOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const megaId = useId();
  const menuId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const hoverTimer = useRef(0);
  const hoverOpenedAt = useRef(0);

  const closeAll = useCallback(() => {
    setMegaOpen(false);
    setMenuOpen(false);
  }, []);

  // Close menus on navigation.
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setMegaOpen(false);
    setMenuOpen(false);
  }

  // Escape / click outside / focus leaving closes the mega-menu.
  useEffect(() => {
    if (!megaOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        window.clearTimeout(hoverTimer.current);
        setMegaOpen(false);
        triggerRef.current?.focus();
      }
    };
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (!panelRef.current?.contains(t) && !triggerRef.current?.contains(t)) setMegaOpen(false);
    };
    const onFocus = (e: FocusEvent) => {
      const t = e.target as Node;
      if (!panelRef.current?.contains(t) && !triggerRef.current?.contains(t)) setMegaOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("focusin", onFocus);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("focusin", onFocus);
    };
  }, [megaOpen]);

  // Mobile menu: lock scroll, make the page behind it inert, Escape closes.
  useEffect(() => {
    if (!menuOpen) return;
    const html = document.documentElement;
    const behind = document.querySelectorAll<HTMLElement>("[data-inert-when-menu]");
    html.style.overflow = "hidden";
    behind.forEach((el) => (el.inert = true));
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    document.addEventListener("keydown", onKey);
    return () => {
      html.style.overflow = "";
      behind.forEach((el) => (el.inert = false));
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  // Close the phone menu if the window grows to desktop width.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 80rem)");
    const onChange = () => mq.matches && setMenuOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const hoverOpen = (open: boolean) => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    window.clearTimeout(hoverTimer.current);
    hoverTimer.current = window.setTimeout(
      () => {
        if (open) hoverOpenedAt.current = Date.now();
        setMegaOpen(open);
      },
      open ? 90 : 220,
    );
  };

  const isCurrent = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
  const isHome = pathname === "/";

  return (
    <header
      className="sticky top-0 z-[100] border-b border-line bg-cream"
      data-site-header=""
      data-home-cta={isHome ? "" : undefined}
      onPointerLeave={() => hoverOpen(false)}
    >
      <div
        data-cta-bar=""
        className="wrap-wide flex min-h-[72px] items-center justify-between gap-5 max-xl:pr-4 max-xl:pl-5 xl:min-h-[var(--header-h)] min-[90rem]:gap-6"
      >
        <Link
          href="/"
          aria-label="Dawson & Dawson Home Care — home"
          className="logo-link inline-flex min-h-12 items-center no-underline"
          onClick={closeAll}
        >
          {logo}
        </Link>

        {/* Desktop navigation */}
        <nav
          aria-label="Main"
          data-cta-nav=""
          className="hidden items-center gap-4 xl:flex min-[90rem]:gap-5"
        >
          {mainNav.map((item) =>
            "mega" in item ? (
              <button
                key={item.href}
                ref={triggerRef}
                type="button"
                className="navlink"
                aria-expanded={megaOpen}
                aria-controls={megaId}
                aria-current={isCurrent(item.href) ? "page" : undefined}
                onClick={() => {
                  window.clearTimeout(hoverTimer.current); // a pending hover-open mustn't undo this
                  // A click just after hover opened the menu means "open", not "close".
                  if (megaOpen && Date.now() - hoverOpenedAt.current < 700) return;
                  setMegaOpen((o) => !o);
                }}
                onPointerEnter={() => hoverOpen(true)}
              >
                {item.label}
                <ChevronDown
                  aria-hidden
                  size={16}
                  strokeWidth={1.75}
                  className={cn(
                    "flex-none transition-transform duration-300",
                    megaOpen && "rotate-180",
                  )}
                />
              </button>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className="navlink"
                aria-current={isCurrent(item.href) ? "page" : undefined}
                onPointerEnter={() => hoverOpen(false)}
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="hidden items-center xl:flex" data-cta-dock="">
          <HeaderCtas where="header" />
        </div>

        {/* Phone header controls */}
        <div className="flex items-center gap-2 xl:hidden">
          <a
            href={`tel:${phone.tel}`}
            aria-label={`Call ${phone.display}`}
            className="inline-flex size-12 items-center justify-center rounded-full bg-plum-800 text-white hover:bg-plum-600 hover:text-white"
          >
            <Phone aria-hidden size={20} strokeWidth={1.75} />
          </a>
          <button
            type="button"
            className="iconbtn"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls={menuId}
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? (
              <X aria-hidden size={22} strokeWidth={2} />
            ) : (
              <Menu aria-hidden size={22} strokeWidth={2} />
            )}
          </button>
        </div>
      </div>

      {/* Care mega-menu (desktop) */}
      <div
        id={megaId}
        ref={panelRef}
        hidden={!megaOpen}
        className="absolute inset-x-0 top-full hidden border-b border-line bg-cream shadow-[0_24px_64px_rgb(42_24_86/0.08)] xl:block"
        onPointerEnter={() => hoverOpen(true)}
      >
        <div className="wrap grid grid-cols-[300px_minmax(0,1fr)] gap-16 py-12">
          <div className="flex flex-col items-start gap-4">
            <p className="eyebrow">{megaMenu.eyebrow}</p>
            <p className="h3 !text-[1.875rem] !leading-[1.08]">{megaMenu.heading}</p>
            <Link href={megaMenu.all.href} className="link" data-cursor-label="View">
              {megaMenu.all.label}
            </Link>
          </div>
          <ul className="grid grid-cols-3 gap-4" role="list">
            {services.map((s) => (
              <li key={s.slug} className="flex">
                <Link
                  href={s.href}
                  data-cursor-label="Open"
                  className="group flex flex-1 flex-col gap-2 rounded-[20px] border border-line bg-white p-6 text-ink no-underline transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-orchid-500 hover:text-ink hover:shadow-[0_0_0_4px_rgb(194_91_217/0.18),0_24px_48px_rgb(42_24_86/0.14)] reduce-motion:hover:translate-y-0"
                >
                  <span className="h3 !text-h4">{s.name}</span>
                  <span>{s.promise}</span>
                  <span className="sm muted mt-auto">{s.smallLabel}</span>
                </Link>
              </li>
            ))}
            <li className="flex">
              <Link
                href={megaMenu.quiz.href}
                data-cursor-label="Open"
                className="flex flex-1 flex-col justify-center gap-2 rounded-[20px] bg-orchid-100 p-6 text-plum-800 no-underline hover:text-plum-800"
              >
                <span className="h3 !text-h4">{megaMenu.quiz.label}</span>
                <span className="sm muted">{megaMenu.quiz.line}</span>
                <span className="link min-h-0">Find the right care →</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Phone menu (design 02-home-mobile) */}
      <nav
        id={menuId}
        aria-label="Main"
        hidden={!menuOpen}
        className="fixed inset-x-0 top-[72px] bottom-[calc(var(--mbar-h)+env(safe-area-inset-bottom))] z-[55] overflow-y-auto bg-cream px-5 py-7 xl:hidden"
      >
        <ul role="list" className="flex flex-col gap-1.5">
          {mainNav.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={() => setMenuOpen(false)}
                aria-current={isCurrent(item.href) ? "page" : undefined}
                className="ff flex min-h-14 items-center border-b border-line text-[2rem] text-plum-800 no-underline hover:text-plum-600"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-6 flex flex-col gap-3">
          <OfficeStatusChip className="self-start" />
          <p className="sm muted">
            <strong className="text-plum-800">Care:</strong> {hours.careLabel}
          </p>
        </div>
      </nav>
    </header>
  );
}
