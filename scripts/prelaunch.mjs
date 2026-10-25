// Pre-launch gate (11 "Pre-launch gate", 09 §3): lists every unconfirmed fact, placeholder and
// [[TO CONFIRM]] string in the app. Exits 1 while anything is left, so it can block a deploy.
// Usage: npm run prelaunch
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const ROOTS = ["app", "components", "content", "lib"];
const PATTERNS = [
  [/\[\[TO CONFIRM[^\]]*\]\]/g, "[[TO CONFIRM]] text"],
  [/toConfirm\(\s*[^,]+,\s*"([^"]+)"/g, "unconfirmed fact"],
  [/confirmed:\s*false/g, "confirmed: false"],
  [/placeholder:\s*true/g, "placeholder: true"],
  [/rateConfirmed:\s*false/g, "rates not confirmed (estimator shows hours only)"],
  [/toConfirm\(\s*$/g, "unconfirmed fact (multi-line, see next lines)"],
  [
    /(privacy|sms|accessibility): null as string \| null/g,
    "legal page 'Last updated' date not set",
  ],
  [/a11yAuditDate: null/g, "accessibility audit date not set (Accessibility §5 hidden)"],
  [
    /detailed:\s*false/g,
    "service-area map is schematic — run `npm run map -- <1:500k Census TopoJSON>`",
  ],
];

async function walk(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else if (/\.(tsx?|json|md)$/.test(e.name) && !e.name.includes("logo-paths")) out.push(p);
  }
  return out;
}

const hits = [];
for (const root of ROOTS) {
  for (const file of await walk(root).catch(() => [])) {
    const lines = (await readFile(file, "utf8")).split("\n");
    lines.forEach((line, i) => {
      if (/^\s*(\/\/|\*|\/\*)/.test(line) || /export type|const toConfirm/.test(line)) return; // comments describe the rules, not data
      for (const [re, kind] of PATTERNS) {
        for (const m of line.matchAll(re))
          hits.push(`${file}:${i + 1}  ${kind}  ${(m[1] ?? m[0]).slice(0, 90)}`);
      }
    });
  }
}

// Placeholder photos/videos from the design (replace with real files, same names).
const PLACEHOLDER_MEDIA = [
  "hero-caregivers.jpg",
  "moment-1.jpg",
  "moment-2.jpg",
  "moment-3.jpg",
  "moment-4.jpg",
  "owner-visit.jpg",
];
for (const f of PLACEHOLDER_MEDIA)
  hits.push(`public/images/${f}  placeholder photo (design stand-in)`);
// Media the owner still has to send (slots built, placeholders showing).
for (const f of [
  "owner-portrait.jpg (Home ch. 06 shows the logo)",
  'owner-intro.mp4 + captions + transcript (Home ch. 06 shows "Video coming soon")',
  "owner-signature.svg (Home ch. 06)",
  "caregiver portraits + quotes (content/caregivers.ts)",
])
  hits.push(`media  missing: ${f}`);

if (hits.length) {
  console.log(`Pre-launch check: ${hits.length} item(s) still to confirm or replace:\n`);
  console.log(hits.join("\n"));
  process.exit(1);
}
console.log("Pre-launch check: nothing left to confirm.");
