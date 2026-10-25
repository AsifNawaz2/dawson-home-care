// Pre-launch gate (11 "Pre-launch gate", 09 §3): lists every unconfirmed fact, placeholder,
// [[TO CONFIRM]] string and stand-in photo/video. Exits 1 while anything is left, so it can
// block a deploy. The same list is "What we need from you" on /reveal-notes (lib/prelaunch.ts).
// Usage: npm run prelaunch            (grouped list + every occurrence)
//        npm run prelaunch -- --short (grouped list only)
import { PRELAUNCH_GROUPS, collectPrelaunch, type PrelaunchGroup } from "../lib/prelaunch";

const { items, occurrences } = collectPrelaunch();
if (!items.length) {
  console.log("Pre-launch check: nothing left to confirm.");
  process.exit(0);
}

console.log(`Pre-launch check: ${items.length} thing(s) still to confirm or replace.\n`);
let n = 0;
for (const [group, { title }] of Object.entries(PRELAUNCH_GROUPS)) {
  const list = items.filter((i) => i.group === (group as PrelaunchGroup));
  if (!list.length) continue;
  console.log(`== ${title} (${list.length})`);
  for (const i of list) {
    n += 1;
    console.log(`${String(n).padStart(3)}. ${i.text}`);
    if (i.where.length)
      console.log(
        `      ${i.where.slice(0, 4).join(" · ")}${i.where.length > 4 ? ` · +${i.where.length - 4} more` : ""}`,
      );
  }
  console.log("");
}
if (!process.argv.includes("--short")) {
  console.log(`== Every occurrence in the code (${occurrences.length})`);
  console.log(occurrences.join("\n"));
}
process.exit(1);
