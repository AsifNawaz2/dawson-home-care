"use client";

/**
 * Cloudflare Turnstile, invisible (COPY_CONVERSION "Turnstile is invisible. No CAPTCHA puzzles").
 * Off — renders nothing, sends no token, loads no script — until TURNSTILE_SITE_KEY is set
 * (exposed to the browser by next.config.ts). The server checks the token only when
 * TURNSTILE_SECRET_KEY is set (lib/leads.ts passesTurnstile).
 */
import { useCallback, useEffect, useRef } from "react";

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";
const SCRIPT = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

interface TurnstileApi {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string;
  execute: (id: string) => void;
  reset: (id: string) => void;
  remove: (id: string) => void;
}
declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

let loading: Promise<void> | null = null;
function loadScript(): Promise<void> {
  if (window.turnstile) return Promise.resolve();
  loading ??= new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = SCRIPT;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => {
      loading = null;
      reject(new Error("Turnstile failed to load"));
    };
    document.head.appendChild(s);
  });
  return loading;
}

/**
 * `slot` goes inside the form (an empty div unless Cloudflare needs an interaction).
 * `getToken()` resolves with a fresh token, or "" when Turnstile is off or unreachable
 * (the server then decides).
 */
export function useTurnstile() {
  const el = useRef<HTMLDivElement>(null);
  const id = useRef<string | null>(null);
  const waiter = useRef<((token: string) => void) | null>(null);
  const token = useRef("");

  useEffect(() => {
    if (!SITE_KEY) return;
    let gone = false;
    loadScript()
      .then(() => {
        if (gone || !el.current || !window.turnstile) return;
        id.current = window.turnstile.render(el.current, {
          sitekey: SITE_KEY,
          execution: "execute",
          appearance: "interaction-only",
          callback: (t: string) => {
            token.current = t;
            waiter.current?.(t);
            waiter.current = null;
          },
          "expired-callback": () => (token.current = ""),
          "error-callback": () => {
            waiter.current?.("");
            waiter.current = null;
          },
        });
      })
      .catch(() => {});
    return () => {
      gone = true;
      if (id.current) window.turnstile?.remove(id.current);
      id.current = null;
    };
  }, []);

  const getToken = useCallback(async (): Promise<string> => {
    if (!SITE_KEY || !id.current || !window.turnstile) return "";
    const ts = window.turnstile;
    const widget = id.current;
    // One token per send: use it, then reset the widget for the next try.
    const t =
      token.current ||
      (await new Promise<string>((resolve) => {
        waiter.current = resolve;
        ts.execute(widget);
        window.setTimeout(() => resolve(""), 10_000);
      }));
    token.current = "";
    ts.reset(widget);
    return t;
  }, []);

  const slot = SITE_KEY ? <div ref={el} className="empty:hidden" /> : null;
  return { slot, getToken };
}
