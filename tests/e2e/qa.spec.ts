import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { pages } from "../../content/seo";
import { colorTokens } from "../../content/tokens";

/**
 * Phase 6 QA sweep over EVERY page (content/seo.ts + the preview-only pages + 404):
 *  - axe WCAG 2.2 AA (every project: desktop, desktop reduced motion, phone)
 *  - Comfort Controls at their strongest (A++ text, high contrast, reduce motion): axe again
 *  - Reflow: no horizontal scroll at 320px wide, nor at 200% zoom (1280px window → 640 CSS px)
 *  - Keyboard: Tab walks the page without getting stuck, every stop shows a focus ring
 *  - Color pairs: every visible text color on its surface is an approved BRAND_FINAL §1 pair
 */
const AXE_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];
const PATHS = [...pages.map((p) => p.path), "/reveal-notes", "/this-page-does-not-exist"];

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    sessionStorage.setItem("dd:home-intro", "1");
    sessionStorage.setItem("dd:logo-intro", "1");
  });
});

async function open(page: Page, path: string) {
  await page.goto(path);
  await page.waitForLoadState("networkidle");
  // Home's later chapters render only near the screen (content-visibility); these checks need
  // every node laid out, so render them all.
  await page.addStyleTag({ content: ".cv-later{content-visibility:visible!important}" });
}

const axe = async (page: Page) =>
  (await new AxeBuilder({ page }).withTags(AXE_TAGS).analyze()).violations.map(
    (v) => `${v.id}: ${v.nodes.length} × ${v.help} (${v.nodes[0]?.target.join(" ")})`,
  );

/** Scroll through the page so lazy and in-view content renders, then back to the top. */
async function scrollThrough(page: Page) {
  await page.evaluate(async () => {
    for (let y = 0; y < document.documentElement.scrollHeight; y += 600) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 40));
    }
    window.scrollTo(0, 0);
  });
}

for (const path of PATHS) {
  test.describe(`QA ${path}`, () => {
    test("axe: WCAG 2.2 AA", async ({ page }) => {
      await open(page, path);
      expect(await axe(page)).toEqual([]);
    });

    test("comfort controls (A++, high contrast, reduce motion): axe", async ({ page }, info) => {
      test.skip(info.project.name !== "desktop-full", "one project is enough");
      await page.addInitScript(() =>
        localStorage.setItem(
          "dawson.comfort.v1",
          JSON.stringify({ textScale: 1.25, contrast: "high", motion: "reduce" }),
        ),
      );
      await open(page, path);
      await expect(page.locator("html")).toHaveAttribute("data-contrast", "high");
      expect(await axe(page)).toEqual([]);
    });

    test("reflow: no sideways scroll at 320px and at 200% zoom", async ({ page }, info) => {
      test.skip(info.project.name !== "desktop-reduced", "one project is enough");
      for (const width of [320, 640]) {
        await page.setViewportSize({ width, height: 800 });
        await open(page, path);
        await scrollThrough(page);
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
        );
        expect(overflow, `${width}px`).toBeLessThanOrEqual(0);
      }
    });

    test("keyboard: Tab never gets stuck and every stop shows a focus ring", async ({
      page,
    }, info) => {
      test.skip(info.project.name !== "desktop-reduced", "keyboard, one project");
      await open(page, path);
      const seen = new Set<string>();
      let repeats = 0;
      for (let i = 0; i < 45; i++) {
        await page.keyboard.press("Tab");
        const stop = await page.evaluate(() => {
          const el = document.activeElement as HTMLElement | null;
          if (!el || el === document.body) return null;
          const cs = getComputedStyle(el);
          const ring =
            (cs.outlineStyle !== "none" && parseFloat(cs.outlineWidth) >= 2) ||
            cs.boxShadow !== "none";
          const r = el.getBoundingClientRect();
          return {
            key: `${el.tagName}#${el.id}.${el.className}|${el.textContent?.slice(0, 30)}|${Math.round(r.top + window.scrollY)}`,
            ring,
            label: `${el.tagName.toLowerCase()} "${(el.getAttribute("aria-label") ?? el.textContent ?? "").trim().slice(0, 40)}"`,
            visible: r.width > 0 && r.height > 0,
          };
        });
        if (!stop) continue;
        expect(stop.ring, `no focus ring on ${stop.label}`).toBe(true);
        expect(stop.visible, `focus on an invisible element: ${stop.label}`).toBe(true);
        if (seen.has(stop.key)) repeats++;
        seen.add(stop.key);
      }
      // A trap would show the same few stops over and over.
      expect(seen.size).toBeGreaterThan(Math.min(10, 45 - repeats) - 1);
      expect(repeats).toBeLessThan(20);
    });
  });
}

/* ---------------------------------------------------------------------------------------- */
/* Color pairs (BRAND_FINAL §1.1–1.4)                                                        */
/* ---------------------------------------------------------------------------------------- */

const hexOf = Object.fromEntries(colorTokens.map((t) => [t.token, t.hex.toLowerCase()]));
const LIGHT = ["cream", "white", "plum-100", "orchid-100", "leaf-100"];
const DARK = ["plum-950", "plum-800", "plum-600"];
const LIGHT_TEXT = ["ink", "plum-950", "plum-800", "plum-600", "muted", "orchid-700", "leaf-700"];
const DARK_TEXT = ["white", "cream", "plum-100", "orchid-100", "leaf-100", "leaf-500"];
/** surface → text tokens always allowed on it. */
const ALLOWED: Record<string, string[]> = {
  ...Object.fromEntries(
    LIGHT.map((s) => [s, [...LIGHT_TEXT, ...(s === "leaf-100" ? [] : ["alert-700"])]]),
  ),
  ...Object.fromEntries(DARK.map((s) => [s, DARK_TEXT])),
  "leaf-500": ["plum-950", "ink", "plum-800", "plum-600"],
  "orchid-500": ["plum-950", "ink"],
  "orchid-700": ["white", "cream"],
  "leaf-700": ["white", "cream"],
  line: ["muted", "ink", "plum-950", "plum-800"],
  dusk: ["white", "cream", "plum-100", "orchid-100", "leaf-100"],
};
/** Large-text-only pairs (≥ 40px per rule 4, or ≥ 24px for the "large only" cells). */
const LARGE: { text: string; surfaces: string[]; min: number }[] = [
  { text: "orchid-500", surfaces: [...LIGHT, "plum-950"], min: 40 },
  { text: "orchid-500", surfaces: ["plum-800"], min: 24 },
  { text: "leaf-500", surfaces: ["dusk"], min: 24 },
  { text: "white", surfaces: ["orchid-500"], min: 24 },
];

test.describe("color pairs", () => {
  for (const path of PATHS) {
    test(`${path}: every text/surface pair is approved`, async ({ page }, info) => {
      test.skip(info.project.name !== "desktop-reduced", "static layout, one project");
      await open(page, path);
      await scrollThrough(page);
      const pairs = await page.evaluate(() => {
        const rgb = (s: string) => {
          const m = s.match(/rgba?\(([^)]+)\)/);
          if (!m) return null;
          const [r, g, b, a = "1"] = m[1]!.split(/[\s,/]+/).filter(Boolean);
          return { r: +r!, g: +g!, b: +b!, a: +a };
        };
        const hex = ({ r, g, b }: { r: number; g: number; b: number }) =>
          "#" + [r, g, b].map((n) => Math.round(n).toString(16).padStart(2, "0")).join("");
        const surfaceOf = (el: Element): string => {
          for (let n: Element | null = el; n; n = n.parentElement) {
            const cs = getComputedStyle(n);
            if (cs.backgroundImage.includes("gradient")) return "dusk";
            if (cs.backgroundImage.includes("url(") || ["IMG", "VIDEO"].includes(n.tagName))
              return "media";
            const c = rgb(cs.backgroundColor);
            if (c && c.a >= 0.99) return hex(c);
            if (c && c.a > 0.01) return `alpha:${hex(c)}/${c.a}`;
          }
          return "#ffffff";
        };
        const out: { text: string; surface: string; size: number; what: string }[] = [];
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        const done = new Set<Element>();
        for (let t = walker.nextNode(); t; t = walker.nextNode()) {
          const el = t.parentElement;
          if (!el || done.has(el) || !t.textContent?.trim()) continue;
          done.add(el);
          if (el.closest("script,style,noscript,.sr-only,[hidden],svg,title,option")) continue;
          // Decorative glyphs (a "·" separator, an arrow) hidden from assistive tech: §1.5 lets
          // decoration use any token. Words are always checked, hidden or not.
          if (el.closest('[aria-hidden="true"]') && !/[\p{L}\p{N}]/u.test(t.textContent)) continue;
          const r = el.getBoundingClientRect();
          const cs = getComputedStyle(el);
          if (!r.width || !r.height || cs.visibility === "hidden" || +cs.opacity === 0) continue;
          let hiddenAncestor = false;
          for (let n: Element | null = el; n; n = n.parentElement)
            if (+getComputedStyle(n).opacity === 0) hiddenAncestor = true;
          if (hiddenAncestor) continue;
          const c = rgb(cs.color);
          if (!c) continue;
          out.push({
            text: c.a < 0.99 ? `alpha:${hex(c)}/${c.a}` : hex(c),
            surface: surfaceOf(el),
            size: parseFloat(cs.fontSize),
            what: `<${el.tagName.toLowerCase()}${el.className ? ` class="${String(el.className).slice(0, 40)}"` : ""}> ${t.textContent.trim().slice(0, 40)}`,
          });
        }
        return out;
      });

      const nameOf = (h: string) =>
        Object.entries(hexOf).find(([, v]) => v === h)?.[0] ?? (h === "#a1ce3d" ? "leaf-500" : h);
      const bad = new Set<string>();
      for (const p of pairs) {
        if (p.surface === "media") continue; // captions never sit on media (rule 9); video cards use their own fills
        const text = nameOf(p.text);
        const surface = p.surface === "dusk" ? "dusk" : nameOf(p.surface);
        const ok =
          ALLOWED[surface]?.includes(text) ||
          LARGE.some((l) => l.text === text && l.surfaces.includes(surface) && p.size >= l.min);
        if (!ok) bad.add(`${text} on ${surface} (${p.size}px) — ${p.what}`);
      }
      expect([...bad]).toEqual([]);
    });
  }
});
