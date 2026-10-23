import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const PAGES = ["/", "/styleguide", "/this-page-does-not-exist"];

// The Home intro video is covered in home.spec.ts; here every test starts as a returning visitor.
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem("dd:home-intro", "1"));
});

for (const path of PAGES) {
  test(`axe: no WCAG 2.2 AA violations on ${path}`, async ({ page }) => {
    await page.goto(path);
    await page.waitForTimeout(1600); // let the logo intro finish
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(results.violations.map((v) => `${v.id}: ${v.nodes.length} × ${v.help}`)).toEqual([]);
  });
}

test("unknown pages return the designed 404", async ({ page }) => {
  const res = await page.goto("/nope-nope");
  expect(res?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(/This page wandered off\./);
});

test("skip link moves to main content", async ({ page, isMobile }) => {
  test.skip(isMobile, "keyboard test");
  await page.goto("/");
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "Skip to main content" });
  await expect(skip).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#main$/);
});

test("office status chip resolves after hydration", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("main [data-office]").first()).toBeVisible();
});

test("native cursor is never hidden", async ({ page }) => {
  await page.goto("/styleguide");
  const hidden = await page.evaluate(() =>
    Array.from(document.querySelectorAll("*")).some((el) => getComputedStyle(el).cursor === "none"),
  );
  expect(hidden).toBe(false);
});

test.describe("desktop", () => {
  test.skip(({ isMobile }) => isMobile, "desktop only");

  test("Care mega-menu opens, lists 5 services and closes on Escape", async ({ page }) => {
    await page.goto("/");
    const trigger = page.getByRole("button", { name: "Care services" });
    await trigger.click();
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    const panel = page.locator(
      `#${await trigger.getAttribute("aria-controls")}`.replace(/:/g, "\\:"),
    );
    await expect(panel.getByRole("link")).toHaveCount(7);
    await page.keyboard.press("Escape");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await expect(trigger).toBeFocused();
  });

  test("cursor ring follows a fine pointer and labels phone links", async ({ page }, info) => {
    test.skip(info.project.name === "desktop-reduced", "ring is off with reduced motion");
    await page.goto("/styleguide");
    const call = page.locator('header a[data-cursor-label="Call"]');
    const box = (await call.boundingBox())!;
    await page.mouse.move(box.x + 10, box.y + 10);
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    const ring = page.locator(".cursor-ring");
    await expect(ring).toHaveAttribute("data-state", "label");
    await expect(ring.locator(".cursor-ring__label")).toHaveText("Call");
  });

  test("no cursor ring with reduced motion", async ({ page }, info) => {
    test.skip(info.project.name !== "desktop-reduced", "reduced project only");
    await page.goto("/styleguide");
    await expect(page.locator(".cursor-ring")).toHaveCount(0);
  });
});

test.describe("mobile", () => {
  test.skip(({ isMobile }) => !isMobile, "mobile only");

  test("sticky action bar shows Call, Text and Free Assessment", async ({ page }) => {
    await page.goto("/");
    const bar = page.getByRole("navigation", { name: "Quick contact" });
    await expect(bar.getByRole("link")).toHaveCount(3);
    await expect(bar.getByRole("link").first()).toHaveAttribute("href", "tel:+18433793321");
  });

  test("phone menu opens and closes", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Open menu" }).click();
    await expect(page.getByRole("link", { name: "Paying for care" })).toBeVisible();
    await page.getByRole("button", { name: "Close menu" }).click();
    await expect(page.getByRole("link", { name: "Paying for care" })).toBeHidden();
  });
});

test("comfort controls apply text size, contrast and motion and survive reload", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Comfort settings" }).click();
  await page.getByText("Largest", { exact: true }).click();
  await expect(page.getByLabel("Largest")).toBeChecked();
  await page.getByRole("switch", { name: "High contrast" }).click();
  await page.getByRole("switch", { name: "Reduce motion" }).click();
  const html = page.locator("html");
  await expect(html).toHaveAttribute("data-contrast", "high");
  await expect(html).toHaveAttribute("data-motion", "reduce");
  await page.reload();
  await expect(html).toHaveAttribute("data-contrast", "high");
  expect(
    await page.evaluate(() => document.documentElement.style.getPropertyValue("--text-scale")),
  ).toBe("1.25");
});

test("page transition: curtain covers, then focus lands on the new H1", async ({ page }, info) => {
  await page.goto("/styleguide");
  await page.waitForTimeout(1500);
  const curtain = page.locator(".dd-curtain");
  await page
    .getByRole("banner")
    .getByRole("link", { name: "Dawson & Dawson Home Care — home" })
    .click();
  if (info.project.name === "desktop-reduced") {
    await expect(curtain).toHaveAttribute("data-phase", "idle");
  } else {
    await expect(curtain).not.toHaveAttribute("data-phase", "idle");
  }
  await expect(page).toHaveURL(/\/$/);
  await expect(curtain).toHaveAttribute("data-phase", "idle", { timeout: 3000 });
  await expect(page.getByRole("heading", { level: 1 })).toBeFocused();
});
