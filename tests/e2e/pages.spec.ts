import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

/** Phase 5 pages: axe, one H1, metadata (canonical, OG image, robots) and JSON-LD. */
const AXE_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];
const PAGES = [
  "/how-it-works",
  "/areas-we-serve",
  "/areas-we-serve/beaufort",
  "/areas-we-serve/hilton-head-island",
  "/about",
  "/reviews",
  "/careers",
  "/resources",
  "/for-professionals",
  "/contact",
  "/privacy-policy",
  "/sms-terms",
  "/accessibility",
  "/sitemap",
];

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    sessionStorage.setItem("dd:home-intro", "1");
    sessionStorage.setItem("dd:logo-intro", "1");
  });
});

const axe = async (page: Page) => {
  const results = await new AxeBuilder({ page }).withTags(AXE_TAGS).analyze();
  return results.violations.map((v) => `${v.id}: ${v.nodes.length} × ${v.help}`);
};

const jsonLdTypes = async (page: Page) => {
  const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
  return blocks.flatMap((b) => {
    const data = JSON.parse(b) as { "@type"?: string } | { "@type"?: string }[];
    return (Array.isArray(data) ? data : [data]).map((n) => n["@type"]);
  });
};

for (const path of PAGES) {
  test(`page ${path}: axe clean, one H1, metadata and JSON-LD`, async ({ page }) => {
    const res = await page.goto(path);
    expect(res?.status()).toBe(200);
    await page.waitForLoadState("networkidle");
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      new RegExp(`${path}$`),
    );
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", /\/og\//);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    const types = await jsonLdTypes(page);
    expect(types).toContain("LocalBusiness");
    expect(types).toContain("BreadcrumbList");
    expect(await axe(page)).toEqual([]);
  });
}

test("town pages carry Service + FAQPage JSON-LD", async ({ page }) => {
  await page.goto("/areas-we-serve/beaufort");
  const types = await jsonLdTypes(page);
  expect(types).toEqual(expect.arrayContaining(["Service", "FAQPage"]));
});

test("unknown town is a 404", async ({ page }) => {
  const res = await page.goto("/areas-we-serve/atlantis");
  expect(res?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("wandered");
});

test("open graph image renders as a PNG", async ({ request }) => {
  const res = await request.get("/og/for-professionals");
  expect(res.status()).toBe(200);
  expect(res.headers()["content-type"]).toContain("image/png");
});

/**
 * Choose an option card by its visible label. The input is visually hidden and the page may still
 * be smooth-scrolling to the error summary, so activate the input itself (same as a label click).
 */
const pick = (page: Page, name: string | RegExp) =>
  page
    .locator("label.opt")
    .filter({ hasText: typeof name === "string" ? new RegExp(`^${name}$`) : name })
    .locator("input")
    .evaluate((el: HTMLInputElement) => el.click());

/** A distinct valid phone per project, so the 10-minute duplicate guard doesn't trip. */
const phoneFor = (project: string) =>
  ({ "desktop-full": "(843) 555-0141", "desktop-reduced": "(843) 555-0142" })[project] ??
  "(843) 555-0143";

test("referral form: errors are summarised, then it sends to the thank-you page", async ({
  page,
}, info) => {
  await page.goto("/for-professionals#refer");
  await page.waitForLoadState("networkidle");
  await page.getByRole("button", { name: "Send referral" }).click();
  const summary = page.locator(".esum");
  await expect(summary).toBeFocused();
  await expect(summary).toContainText("Please enter your first name.");
  await expect(summary).toContainText(
    "Please confirm you have permission to share this information.",
  );

  await page.getByLabel("Your first name (required)").fill("Dana");
  await page.getByLabel("Your last name (required)").fill("Reed");
  await page.getByLabel("Organization (required)").fill("Beaufort Memorial");
  await pick(page, "Case manager");
  await page.getByLabel("Your phone (required)").fill(phoneFor(info.project.name));
  await page.getByLabel("Your email (required)").fill("dana@example.com");
  await pick(page, "Phone");
  await page.getByLabel("Client's first name (required)").fill("Ruth");
  await page.getByLabel("First letter of client's last name (required)").fill("M");
  await page.getByLabel("Client's town (required)").selectOption("beaufort");
  await pick(page, /Personal Care/);
  await pick(page, "Within 2 weeks");
  await pick(page, "A few hours most days");
  await pick(page, /permission to share/);
  await page.getByRole("button", { name: "Send referral" }).click();

  await expect(page).toHaveURL(/\/thank-you\?form=referral/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Thank you, Dana. Referral received.",
  );
});

test("referral form: a start date in the past is refused", async ({ page }) => {
  await page.goto("/for-professionals#refer");
  await page.waitForLoadState("networkidle");
  await pick(page, "On a specific date");
  await page.getByLabel("Start or discharge date (required)").fill("2020-01-02");
  await page.getByLabel("Start or discharge date (required)").blur();
  await expect(page.getByText("Please choose today or a later date.")).toBeVisible();
});

test("contact form: phone or email is required; topic hint points to the referral form", async ({
  page,
}) => {
  await page.goto("/contact#message");
  await page.waitForLoadState("networkidle");
  await page.getByLabel("What's this about? (required)").selectOption("professional");
  await expect(
    page
      .locator("#topic-hint")
      .getByRole("link", { name: /Our referral form takes about 2 minutes/ }),
  ).toBeVisible();
  await page.getByLabel("Your first name (required)").fill("Sam");
  await pick(page, "Email");
  await page.getByLabel("Your message (required)").fill("Do you cover Okatie?");
  await page.getByRole("button", { name: "Send message" }).click();
  await expect(page.locator(".esum")).toContainText(
    "Please enter a phone number or an email address so we can reply.",
  );
});

test("api: referral and contact reject invalid bodies with field messages", async ({ request }) => {
  const ref = await request.post("/api/referral", { data: { values: {}, meta: {} } });
  expect(ref.status()).toBe(422);
  const contact = await request.post("/api/lead", {
    data: { values: {}, meta: { form_type: "contact" } },
  });
  expect(contact.status()).toBe(422);
  expect((await contact.json()).code).toBe("invalid");
});

test("legal pages: contents list links to every section", async ({ page }, info) => {
  await page.goto("/sms-terms");
  const nav =
    info.project.name === "mobile"
      ? page.locator("details nav")
      : page.locator('nav[aria-label="On this page"]').first();
  if (info.project.name === "mobile")
    await page.locator("summary", { hasText: "On this page" }).click();
  const links = nav.getByRole("link");
  await expect(links).toHaveCount(14);
  for (const href of await links.evaluateAll((as) => as.map((a) => a.getAttribute("href"))))
    await expect(page.locator(href!)).toHaveCount(1);
});
