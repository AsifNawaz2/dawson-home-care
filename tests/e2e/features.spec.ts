import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const AXE_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];
const PAGES = [
  "/care",
  "/care/personal-care",
  "/care/24-hour-care",
  "/free-assessment",
  "/find-care",
  "/paying-for-care",
  "/faq",
  "/thank-you",
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

for (const path of PAGES) {
  test(`axe: no WCAG 2.2 AA violations on ${path}`, async ({ page }) => {
    await page.goto(path);
    await page.waitForLoadState("networkidle");
    expect(await axe(page)).toEqual([]);
  });
}

test("care quiz: five questions, result, hand-off fills the assessment", async ({ page }) => {
  await page.goto("/find-care");
  await page.getByRole("button", { name: "My parent" }).click();
  await expect(page.getByRole("heading", { name: "What's happening right now?" })).toBeFocused();
  // Continue without a choice shows the error and keeps you on Q2.
  await page.getByRole("button", { name: "Continue" }).click({ force: true });
  await expect(page.getByText(/Please choose at least one/)).toBeVisible();
  await page
    .getByRole("checkbox", { name: "Bathing or dressing is getting hard" })
    .check({ force: true });
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: /A few hours most days/ }).click();
  await page.getByRole("button", { name: "Within 2 weeks" }).click();
  await page.getByRole("combobox").selectOption("beaufort");
  await page.getByRole("button", { name: "See my suggestion" }).click();
  await expect(page.getByRole("heading", { name: /suggest for your parent/ })).toBeFocused();
  await expect(page.getByText("Our suggestion")).toBeVisible();

  await page
    .getByRole("link", { name: /Get a Free Care Assessment|Request a Callback/ })
    .last()
    .click();
  await expect(page).toHaveURL(/\/free-assessment\?from=quiz/);
  await expect(page.locator(".banner").first()).toContainText("quiz answers");
});

test("care quiz on Home: the whole quiz runs inline", async ({ page }) => {
  await page.goto("/");
  const quiz = page.locator("#find-care");
  await quiz.scrollIntoViewIfNeeded();
  await quiz.getByRole("button", { name: "Myself" }).click();
  await expect(quiz.getByText("Question 2 of 5")).toBeVisible();
});

test("free assessment: errors are announced and linked to their fields", async ({ page }) => {
  await page.goto("/free-assessment");
  await page.getByRole("button", { name: "Continue" }).click();
  const summary = page.locator(".esum");
  await expect(summary).toBeFocused();
  await expect(summary.getByRole("link")).not.toHaveCount(0);
});

test("cost estimator: steppers update the weekly hours", async ({ page }) => {
  await page.goto("/paying-for-care");
  const est = page.locator("#estimator");
  await expect(est.getByText("hours a week").first()).toBeVisible();
  await est.getByRole("button", { name: "More days" }).click();
  await expect(est.getByText("4 days")).toBeVisible();
  await est.getByRole("button", { name: "Full days" }).click();
  await expect(est.getByRole("button", { name: "Full days" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await expect(est.getByText("Illustrative estimate")).toBeVisible();
});

test("payment explorer: narrowing down highlights a tab; deep link focuses the panel", async ({
  page,
  isMobile,
}) => {
  await page.goto("/paying-for-care");
  await page.getByRole("checkbox", { name: /served in the military/ }).check({ force: true });
  await expect(page.getByText(/Worth a look: VA benefits/)).toBeVisible();
  if (!isMobile) {
    await expect(page.getByRole("tab", { name: /VA benefits/ })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    await page.getByRole("tab", { name: /VA benefits/ }).press("End");
    await expect(page.getByRole("tab", { name: /Medicare/ })).toBeFocused();
  }
  await page.goto("/paying-for-care#pay-medicare");
  await expect(page.locator("#pay-medicare")).toBeFocused();
});

test("faq: live search marks matches, shows a no-results message", async ({ page }) => {
  await page.goto("/faq");
  const box = page.getByRole("searchbox", { name: "Search questions" });
  await box.fill("medicare");
  await expect(page.getByText('1 question matches "medicare".')).toBeVisible();
  await expect(page.locator("mark").first()).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Does Medicare pay for home care?" }),
  ).toHaveAttribute("aria-expanded", "true");
  await box.fill("zzzz");
  await expect(page.getByText(/No questions match/)).toBeVisible();
  await page.getByRole("button", { name: "Clear search" }).click();
  await expect(box).toHaveValue("");
});

test("town search: ZIP shared by several towns lists them all", async ({ page }) => {
  await page.goto("/");
  const box = page.getByRole("textbox", { name: "Do you serve my town?" });
  await box.scrollIntoViewIfNeeded();
  await box.fill("29906");
  await box.press("Enter");
  await expect(page.getByText("That includes Beaufort, Burton and Shell Point.")).toBeVisible();
  await box.fill("Atlanta");
  await box.press("Enter");
  await expect(page.getByText("We may still be able to help.")).toBeVisible();
});

test("reviews and caregivers: pause button and carousel arrows", async ({ page }, info) => {
  await page.goto("/");
  if (info.project.name !== "desktop-reduced") {
    const pause = page.getByRole("button", { name: "Pause reviews" });
    await pause.scrollIntoViewIfNeeded();
    await pause.click();
    await expect(page.getByRole("button", { name: "Play reviews" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  }
  const next = page.getByRole("button", { name: "Next caregiver" });
  await next.scrollIntoViewIfNeeded();
  await next.click();
  await expect(page.getByText("2 of 6").filter({ visible: true })).toBeVisible();
});
