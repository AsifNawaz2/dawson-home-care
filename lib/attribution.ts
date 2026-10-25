/**
 * Lead attribution (08 §2 `utm_*`, `page_url`). The first utm_* set seen in this tab is kept in
 * sessionStorage (`dawson.utm.v1`), so a family who lands from an ad on Home and sends the form
 * three pages later still carries the campaign. Never personal data, never put back in a URL.
 */
import { readStorage, writeStorage } from "./storage";

export const UTM_KEY = "dawson.utm.v1";

function fromUrl(search: string): Record<string, string> {
  return Object.fromEntries(
    [...new URLSearchParams(search)]
      .filter(([k, v]) => /^utm_[a-z_]{1,16}$/.test(k) && v)
      .map(([k, v]) => [k.slice(4), v.slice(0, 200)]),
  );
}

/** Store the landing page's utm_* once per tab (first touch wins). */
export function captureUtm() {
  if (readStorage("session", UTM_KEY)) return;
  const utm = fromUrl(window.location.search);
  if (Object.keys(utm).length) writeStorage("session", UTM_KEY, JSON.stringify(utm));
}

/** utm_* to send with a lead: first touch in this tab, else the current URL's. */
export function leadUtm(): Record<string, string> {
  try {
    const stored = JSON.parse(readStorage("session", UTM_KEY) ?? "null") as Record<
      string,
      string
    > | null;
    if (stored && typeof stored === "object") return stored;
  } catch {
    /* ignore a damaged entry */
  }
  return fromUrl(window.location.search);
}

/** The page the form was sent from: no query string, no hash (nothing personal ever rides along). */
export const leadPageUrl = () => window.location.origin + window.location.pathname;
