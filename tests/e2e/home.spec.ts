import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const returning = (page: Page) =>
  page.addInitScript(() => sessionStorage.setItem("dd:home-intro", "1"));

const AXE_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

test.describe("Home intro", () => {
  test("plays once per session: locks scroll, Escape ends it, scrolling flies the logo in", async ({
    page,
  }, info) => {
    test.skip(info.project.name === "desktop-reduced", "full motion only");
    await page.goto("/");
    const html = page.locator("html");
    await expect(html).toHaveAttribute("data-home-intro", "play");
    await expect(page.locator(".home-intro")).toBeVisible();
    // Header is there for assistive tech but invisible until the logo lands.
    await expect(page.locator("[data-site-header]")).toHaveCSS("opacity", "0");

    await page.keyboard.press("Escape");
    await expect.poll(() => page.evaluate(() => document.documentElement.style.overflow)).toBe("");
    await expect(page.locator(".intro-hint")).toHaveCSS("opacity", "1");

    const vh = page.viewportSize()!.height;
    await page.evaluate((y) => window.scrollTo(0, y), vh);
    await expect(page.locator("[data-site-header]")).toHaveCSS("opacity", "1");
    await expect(html).toHaveAttribute("data-hi-chrome", "on");

    // Same tab, second visit: straight to the hero.
    await page.reload();
    await expect(html).not.toHaveAttribute("data-home-intro", /.+/);
    await expect(page.locator(".home-intro")).toBeHidden();
  });

  test("keyboard: Tab into the hidden header reveals it; Skip intro lands on the H1", async ({
    page,
    isMobile,
  }, info) => {
    test.skip(isMobile || info.project.name === "desktop-reduced", "desktop keyboard");
    await page.goto("/");
    await page.keyboard.press("Tab"); // skip link
    await page.keyboard.press("Tab"); // logo link in the header
    await expect(page.locator("html")).toHaveAttribute("data-hi-chrome", "on");
    await expect(page.locator("[data-site-header]")).toHaveCSS("opacity", "1");

    await page.getByRole("button", { name: "Skip intro" }).focus();
    await page.keyboard.press("Enter");
    await expect(page.locator("#hero-title")).toBeFocused();
    await expect.poll(() => page.evaluate(() => document.documentElement.style.overflow)).toBe("");
  });

  test("reduced motion: still end frame, no scroll lock", async ({ page }, info) => {
    test.skip(info.project.name !== "desktop-reduced", "reduced project only");
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("data-home-intro", "still");
    await expect(page.locator(".intro-still")).toBeVisible();
    await expect(page.locator("#home-intro-video")).toBeHidden();
    expect(await page.evaluate(() => document.documentElement.style.overflow)).toBe("");
  });
});

test.describe("Home chapters", () => {
  test.beforeEach(({ page }) => returning(page));

  test("axe: no WCAG 2.2 AA violations, scrolled through every chapter", async ({ page }) => {
    await page.goto("/");
    for (const id of ["#the-moment", "#how-we-help"]) {
      await page.locator(id).scrollIntoViewIfNeeded();
      await page.waitForTimeout(300);
    }
    const results = await new AxeBuilder({ page }).withTags(AXE_TAGS).analyze();
    expect(results.violations.map((v) => `${v.id}: ${v.nodes.length} × ${v.help}`)).toEqual([]);
  });

  test("one H1, chapter H2s, and the moment lines in the accessibility tree", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    await expect(
      page.getByRole("heading", { name: "It usually starts with a moment." }),
    ).toHaveCount(1);
    await expect(
      page.getByRole("heading", { name: "Every kind of help, under one roof." }),
    ).toHaveCount(1);
    await expect(page.locator("#the-moment ol.sr-only li")).toHaveCount(4);
    for (const name of [
      "Personal Care",
      "Home Help",
      "Companionship",
      "24-Hour & Overnight Care",
      "Respite Care",
    ]) {
      await expect(page.getByRole("link", { name: `See how we help with ${name}` })).toHaveCount(1);
    }
  });

  test("the moment: lines type out as the scene scrolls", async ({ page }, info) => {
    test.skip(info.project.name === "desktop-reduced", "full motion only");
    await page.goto("/");
    const track = page.locator("#the-moment > [aria-hidden='true'].relative");
    const top = await track.evaluate((el) => el.getBoundingClientRect().top + window.scrollY);
    const vh = page.viewportSize()!.height;
    await page.evaluate((y) => window.scrollTo(0, y), top + vh * 1.2);
    await expect(track.locator("[data-count]")).toHaveText("2 of 4");
    await expect(track.locator("[data-line][data-state='past']")).toHaveText(
      "Mom missed her pills again.",
    );
    await page.evaluate((y) => window.scrollTo(0, y), top + vh * 3.6);
    await expect(track.locator("[data-line][data-state='current'] span").first()).toHaveText(
      "You live three hours away.",
    );
  });

  test("how we help: collages advance with scroll; focusing a link shows its card", async ({
    page,
  }, info) => {
    test.skip(info.project.name === "desktop-reduced", "full motion only");
    await page.goto("/");
    const track = page.locator("#how-we-help .h-\\[550svh\\]");
    const top = await track.evaluate((el) => el.getBoundingClientRect().top + window.scrollY);
    const vh = page.viewportSize()!.height;
    await page.evaluate((y) => window.scrollTo(0, y), top + vh * 1.2); // middle of card 2
    await expect(track.locator("[data-count]")).toHaveText("2 of 5");
    await expect(track.locator("[data-card][data-active='true'] h3")).toHaveText("Home Help");

    await track.getByRole("link", { name: "See how we help with Respite Care" }).focus();
    await expect(track.locator("[data-card][data-active='true'] h3")).toHaveText("Respite Care");
    await expect(track.locator("[data-count]")).toHaveText("5 of 5");
  });

  test("reduced motion: no pinned scenes, every card and collage shown still", async ({
    page,
  }, info) => {
    test.skip(info.project.name !== "desktop-reduced", "reduced project only");
    await page.goto("/");
    await expect(page.locator("#how-we-help .h-\\[550svh\\]")).toBeHidden();
    await expect(page.locator("#the-moment > [aria-hidden='true'].relative")).toBeHidden();
    await expect(page.locator("#how-we-help video")).toHaveCount(13); // in the hidden live scene
    expect(
      await page
        .locator("#how-we-help video")
        .evaluateAll((vs) => vs.filter((v) => !(v as HTMLVideoElement).paused).length),
    ).toBe(0);
    await expect(page.locator("#how-we-help .hw-static .collage")).toHaveCount(5);
    for (const el of await page.locator("#how-we-help .hw-static .collage").all()) {
      await expect(el).toBeVisible();
    }
  });
});
