/**
 * The pre-launch list (11 "Pre-launch gate", 09 §3) — one source for `npm run prelaunch` and the
 * "What we need from you" list on /reveal-notes.
 *
 * Two passes, merged and de-duplicated into plain questions for the owner:
 *  1. Data: every `confirmed: false` fact in content/site.config.ts (its note), unconfirmed towns
 *     and drive times, rates, owner media, caregiver cards, legal dates, the schematic map.
 *  2. Code scan of app/ components/ content/ lib/: every `[[TO CONFIRM …]]` / `[TO CONFIRM …]`
 *     string, `confirmed: false` and `placeholder: true`, so nothing written into copy is missed.
 * Plus the design's stand-in photos/videos (same filenames get replaced) and launch-day settings.
 *
 * Runs at build time only (the script, and /reveal-notes which is prerendered and 404s in
 * production). Never call it from a request path.
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import * as config from "../content/site.config";
import { areas, formatDrive } from "../content/areas";
import { caregivers } from "../content/caregivers";
import { owner } from "../content/owner";
import { lowcountry } from "../content/map/lowcountry";

export type PrelaunchGroup = "business" | "answers" | "towns" | "media" | "legal" | "launch";

export const PRELAUNCH_GROUPS: Record<PrelaunchGroup, { title: string; intro: string }> = {
  business: {
    title: "About the business",
    intro: "Facts we show only once you've confirmed them.",
  },
  answers: {
    title: "Answers for families and professionals",
    intro: "Questions in the FAQ, payment guide, service pages and referral page.",
  },
  towns: {
    title: "Towns and drive times",
    intro: "Each town page goes into Google only once its town is confirmed.",
  },
  media: {
    title: "Photos and videos",
    intro: "Drop real files in with the same names and they replace the stand-ins. No code change.",
  },
  legal: {
    title: "Legal pages",
    intro: "Wording to check with your advisor, and the dates set on the day they go live.",
  },
  launch: {
    title: "For launch day",
    intro: "Accounts and settings we need when the site goes live.",
  },
};

export interface PrelaunchItem {
  group: PrelaunchGroup;
  text: string;
  /** file:line (or file) where it lives. */
  where: string[];
}

const ROOTS = ["app", "components", "content", "lib"];
const SKIP = /logo-paths|lib[\\/]prelaunch\.ts$/;

/** The design's stand-in media (BUILD_DECISIONS §C): replace with real files, same names. */
export const STANDIN_MEDIA: { file: string; use: string }[] = [
  { file: "public/images/hero-caregivers.jpg", use: "Home hero photo" },
  { file: "public/images/moment-1.jpg", use: 'Home "The moment", line 1' },
  { file: "public/images/moment-2.jpg", use: 'Home "The moment", line 2' },
  { file: "public/images/moment-3.jpg", use: 'Home "The moment", line 3' },
  { file: "public/images/moment-4.jpg", use: 'Home "The moment", line 4' },
  { file: "public/images/owner-visit.jpg", use: 'Home "How it works", step 2 (the owner visit)' },
  ...["personal-care-1", "personal-care-2", "personal-care-3"].map((n) => ({
    file: `public/videos/${n}.mp4`,
    use: "Personal Care videos (Home collage + service page)",
  })),
  ...["home-help-1", "home-help-2", "home-help-3"].map((n) => ({
    file: `public/videos/${n}.mp4`,
    use: "Home Help videos",
  })),
  ...["companionship-1", "companionship-2", "companionship-3"].map((n) => ({
    file: `public/videos/${n}.mp4`,
    use: "Companionship videos",
  })),
  ...["respite-care-1", "respite-care-2"].map((n) => ({
    file: `public/videos/${n}.mp4`,
    use: "Respite Care videos",
  })),
  ...["24-hour-care-1", "24-hour-care-2"].map((n) => ({
    file: `public/videos/${n}.mp4`,
    use: "24-Hour Care videos",
  })),
];

/** Collapse whitespace, decode the few entities the JSX copy uses, trim trailing punctuation. */
const tidy = (s: string) =>
  s
    .replace(/&ldquo;|&rdquo;/g, '"')
    .replace(/&apos;|&rsquo;/g, "'")
    .replace(/\\(["'])/g, "$1")
    .replace(/\{[a-zA-Z.]+\}/g, "…")
    .replace(/\s+/g, " ")
    .trim();

/** "[[TO CONFIRM — draft: "x"]]" → approve wording; "[[TO CONFIRM: q? If yes: …]]" → "q?". */
function question(raw: string): string {
  const s = tidy(raw);
  const draft = s.match(/^—?\s*draft:\s*["“]?(.+?)["”]?$/);
  if (draft) return `Approve this wording: "${draft[1]!.replace(/["”]$/, "")}"`;
  const q = s
    .replace(/^[:—\s]+/, "")
    .split(/\s(?:If yes[,:]|If employees|Replace th|If none|— do not|— list)/)[0]!
    .trim();
  return q.charAt(0).toUpperCase() + q.slice(1);
}

const keyOf = (text: string) =>
  text
    .toLowerCase()
    .replace(/^(approve this wording: )/, "draft:")
    .replace(/\b(e\.g\.|the|a|an|for|of|to|dawson|our|we)\b/g, "")
    .replace(/[^a-z0-9]+/g, "");

function walk(dir: string): string[] {
  if (!existsSync(/*turbopackIgnore: true*/ dir)) return [];
  return readdirSync(/*turbopackIgnore: true*/ dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(/*turbopackIgnore: true*/ dir, e.name);
    if (e.isDirectory()) return walk(p);
    return /\.(tsx?|json)$/.test(e.name) && !SKIP.test(p) ? [p] : [];
  });
}

function groupForFile(file: string): PrelaunchGroup {
  if (/privacy-policy|sms-terms|accessibility[\\/]|legal/.test(file)) return "legal";
  if (/areas|towns|DriveMap|HubMap/.test(file)) return "towns";
  if (/site\.config|owner|about|careers|contact/.test(file)) return "business";
  return "answers";
}

/** Notes of every `confirmed: false` fact in site.config (walks the exported groups). */
function configFacts(): { note: string; group: PrelaunchGroup }[] {
  const out: { note: string; group: PrelaunchGroup }[] = [];
  const visit = (v: unknown) => {
    if (!v || typeof v !== "object") return;
    const o = v as Record<string, unknown>;
    if (o.confirmed === false && typeof o.note === "string") {
      out.push({ note: o.note, group: "business" });
      return;
    }
    if (!Array.isArray(v)) Object.values(o).forEach(visit);
  };
  for (const [name, value] of Object.entries(config)) {
    if (["flags", "legal", "rates", "integrations", "sms"].includes(name)) continue;
    visit(value);
  }
  return out;
}

export interface Prelaunch {
  /** Merged plain-language list, grouped (what the owner sees). */
  items: PrelaunchItem[];
  /** Every raw hit, one per line: `file:line  kind  text` (what a developer greps). */
  occurrences: string[];
}

export function collectPrelaunch(root: string = process.cwd()): Prelaunch {
  const items = new Map<string, PrelaunchItem>();
  const occurrences: string[] = [];
  const add = (group: PrelaunchGroup, text: string, where?: string) => {
    const k = keyOf(text);
    const hit = items.get(k);
    if (hit) {
      if (where && !hit.where.includes(where)) hit.where.push(where);
      return;
    }
    items.set(k, { group, text, where: where ? [where] : [] });
  };

  // 1. Data
  for (const f of configFacts()) add(f.group, question(f.note), "content/site.config.ts");
  const { rates, legal } = config;
  if (!rates.rateConfirmed)
    add(
      "business",
      "Hourly rates (day and overnight) and the minimum visit length. Until then the cost estimator shows hours only, never a price.",
      "content/site.config.ts (rates)",
    );
  for (const a of areas) {
    if (a.confirmed && a.driveConfirmed) continue;
    const drive = `about ${formatDrive(a.driveMinutes)} min`;
    add(
      "towns",
      !a.confirmed
        ? `Do we care for families in ${a.name}? And is the drive from the office ${drive}?`
        : `Is the drive from the office to ${a.name} ${drive}?`,
      "content/areas.ts",
    );
  }
  if (!lowcountry.detailed)
    add(
      "launch",
      "Service-area map: we add the real coastline from US Census map files (no input needed from you — a build step).",
      "content/map/lowcountry.ts",
    );
  if (caregivers.some((c) => c.placeholder))
    add(
      "media",
      "Caregiver spotlights: a photo, first name, start year and a short quote for each caregiver — with their written OK.",
      "content/caregivers.ts",
    );
  if (!owner.confirmed) {
    add("media", "Owner portrait photo (4:5, owner-portrait.jpg)", "content/owner.ts");
    add(
      "media",
      "Owner hello video (about 60 seconds) — we add captions and a transcript",
      "content/owner.ts",
    );
    add(
      "media",
      "Owner signature (owner-signature.svg — a photo of it on paper is fine)",
      "content/owner.ts",
    );
    add(
      "business",
      "Owner's story, quote and full name for Meet the owner and /about",
      "content/owner.ts",
    );
  }
  for (const [page, date] of Object.entries(legal.updated))
    if (!date)
      add(
        "legal",
        `"Last updated" date on the ${page === "sms" ? "SMS Terms" : page === "privacy" ? "Privacy Policy" : "Accessibility"} page (set on the day it goes live)`,
        "content/site.config.ts (legal.updated)",
      );
  if (!legal.a11yAuditDate)
    add(
      "legal",
      'Date of the final accessibility review (turns on "How we test" on /accessibility)',
      "content/site.config.ts (legal.a11yAuditDate)",
    );

  // 2. Code scan
  const TOKEN = /\[\[?([^[\]]*?)TO CONFIRM\s*((?:—\s*draft)?:?[^\]]*)\]\]?/g;
  for (const r of ROOTS) {
    for (const file of walk(path.join(/*turbopackIgnore: true*/ root, r))) {
      const rel = path.relative(root, file);
      // Comment lines describe the rules, not data: blank them but keep line numbers.
      const text = readFileSync(/*turbopackIgnore: true*/ file, "utf8")
        .split("\n")
        .map((l) =>
          /^\s*(\/\/|\*|\/\*)/.test(l) || /const toConfirm|export type/.test(l) ? "" : l,
        )
        .join("\n");
      const lineAt = (i: number) => text.slice(0, i).split("\n").length;
      for (const m of text.matchAll(TOKEN)) {
        const body = `${m[1] ?? ""} ${m[2] ?? ""}`.replace(/^\s*Within\s*/, "");
        if (!/[a-z]/i.test(body) || /[{}<>=]/.test(body.replace(/\{[a-zA-Z.]+\}/g, ""))) continue; // code that handles tokens
        add(groupForFile(rel), question(body), `${rel}:${lineAt(m.index ?? 0)}`);
        occurrences.push(
          `${rel}:${lineAt(m.index ?? 0)}  [[TO CONFIRM]]  ${tidy(m[0]).slice(0, 100)}`,
        );
      }
      for (const m of text.matchAll(/(confirmed|rateConfirmed|driveConfirmed|detailed):\s*false/g))
        occurrences.push(`${rel}:${lineAt(m.index ?? 0)}  ${m[1]}: false`);
      for (const m of text.matchAll(/toConfirm\(\s*[^,]+,\s*"([^"]+)"/g))
        occurrences.push(`${rel}:${lineAt(m.index ?? 0)}  unconfirmed fact  ${m[1]}`);
      for (const m of text.matchAll(/placeholder:\s*true/g)) {
        const where = `${rel}:${lineAt(m.index ?? 0)}`;
        occurrences.push(`${where}  placeholder: true`);
        const k = keyOf(`placeholder ${rel}`);
        if (!items.has(k) && !/caregivers/.test(rel))
          items.set(k, { group: "media", text: `Sample content still in ${rel}`, where: [where] });
      }
    }
  }

  // 3. Stand-in media from the design
  const byUse = new Map<string, string[]>();
  for (const m of STANDIN_MEDIA) {
    occurrences.push(
      `${m.file}  stand-in ${m.file.endsWith(".mp4") ? "video" : "photo"}  ${m.use}`,
    );
    const missing = existsSync(path.join(/*turbopackIgnore: true*/ root, m.file))
      ? ""
      : " (missing)";
    byUse.set(m.use, [...(byUse.get(m.use) ?? []), `${path.basename(m.file)}${missing}`]);
  }
  for (const [use, files] of byUse)
    add(
      "media",
      `${use}: ${files.join(", ")}`,
      path.dirname(STANDIN_MEDIA.find((m) => m.use === use)!.file),
    );

  // 4. Launch day (environment, not code)
  const env = process.env;
  if (!env.GHL_WEBHOOK_URL && !(env.GHL_API_TOKEN && env.GHL_LOCATION_ID))
    add(
      "launch",
      "GoHighLevel access: an Inbound Webhook URL, or an API token + location ID, so form leads arrive in your CRM (about an hour of setup together)",
      ".env (LEAD_MODE=live)",
    );
  if (!env.TURNSTILE_SITE_KEY)
    add(
      "launch",
      "Cloudflare Turnstile keys for invisible spam protection (optional, free)",
      ".env (TURNSTILE_*)",
    );
  if (config.legal.analytics === "none")
    add(
      "launch",
      "Analytics and ad tracking IDs you use today (Google Analytics, Google Ads, Meta), if any",
      "content/site.config.ts (legal.analytics)",
    );
  add(
    "launch",
    "Does your current site use www.dawsonhomecare.com or dawsonhomecare.com? We keep the one Google knows.",
    "docs/SEO_PLAN.md §2.2",
  );
  add(
    "launch",
    "Access to your domain's DNS and Google Search Console (we change only the website records — never email)",
    "docs/08 §3, SEO_PLAN §5.5",
  );

  const order = Object.keys(PRELAUNCH_GROUPS) as PrelaunchGroup[];
  return {
    items: [...items.values()].sort((a, b) => order.indexOf(a.group) - order.indexOf(b.group)),
    occurrences,
  };
}
