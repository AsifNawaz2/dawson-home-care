import { createServer } from "node:http";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { expect, test, type Page } from "@playwright/test";
import { leadNote, leadTags, sendToGhl, toGhlContact, type Lead } from "../../lib/ghl";

/**
 * Phase 6 — every form end to end in LEAD_MODE=mock (the default): the browser form → our API →
 * ./.leads/*.json with the 08 §2 field mapping, consent proof, UTM, quiz/estimator, timestamp
 * and page URL. Plus honeypot, duplicate guard, the GoHighLevel mapping (webhook + API v2) and
 * the legacy redirects / 410s.
 */

const LEADS = path.join(process.cwd(), ".leads");
/** Unique per test run and project, so parallel projects never read each other's leads. */
const tag = (info: { project: { name: string } }) =>
  `${info.project.name.replace(/\W/g, "")}${Date.now().toString(36)}`;
/**
 * A fresh valid phone per call (the server's duplicate guard remembers numbers for 10 minutes,
 * across projects and re-runs against the same server).
 */
const phone = (info: { project: { name: string } }, form: number) => {
  const p = { "desktop-full": 1, "desktop-reduced": 2 }[info.project.name] ?? 3;
  const tail = String((Date.now() + Math.floor(Math.random() * 10_000)) % 10_000).padStart(4, "0");
  return `(843) 5${form}${p}-${tail}`;
};

/** Newest lead file whose JSON contains `marker` (polls: the API writes after responding). */
async function findLead(marker: string): Promise<Record<string, unknown>> {
  for (let i = 0; i < 40; i++) {
    const files = (await readdir(LEADS).catch(() => [] as string[])).sort().reverse();
    for (const f of files.slice(0, 60)) {
      const text = await readFile(path.join(LEADS, f), "utf8").catch(() => "");
      if (text.includes(marker)) return JSON.parse(text) as Record<string, unknown>;
    }
    await new Promise((r) => setTimeout(r, 250));
  }
  throw new Error(`no lead file contains ${marker}`);
}

const pick = (page: Page, name: string | RegExp) =>
  page
    .locator("label.opt")
    .filter({ hasText: typeof name === "string" ? new RegExp(`^${name}$`) : name })
    .locator("input")
    .first()
    .evaluate((el: HTMLInputElement) => el.click());

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    sessionStorage.setItem("dd:home-intro", "1");
    sessionStorage.setItem("dd:logo-intro", "1");
  });
});

test("free assessment: all five steps send a complete lead (first-touch UTM kept)", async ({
  page,
}, info) => {
  const id = tag(info);
  // Land from a campaign on another page; the utm_* must survive the move to the form.
  await page.goto(`/care/personal-care?utm_source=newsletter&utm_medium=email&utm_campaign=${id}`);
  await page.waitForLoadState("networkidle");
  await page.goto("/free-assessment");
  await page.waitForLoadState("networkidle");

  await pick(page, "My parent");
  await page.locator("#client_first_name").fill("Ruth");
  await page.locator("#town").selectOption("beaufort");
  await page.getByRole("button", { name: "Continue" }).click();
  await pick(page, /^Personal Care/);
  await page.getByRole("button", { name: "Continue" }).click();
  await pick(page, "Within 2 weeks");
  await pick(page, /^A few hours most days/);
  await page.getByRole("button", { name: "Continue" }).click();
  await page.locator("#first_name").fill("Alex");
  await page.locator("#last_name").fill("Morgan");
  await page.locator("#phone").fill(phone(info, 1));
  await page.locator("#email").fill(`alex.${id}@example.com`);
  await pick(page, "Phone call");
  await page.getByRole("button", { name: "Continue" }).click();
  const consent = page.locator("#sms_transactional_consent");
  await consent.evaluate((el: HTMLInputElement) => el.click());
  await expect(consent).toBeChecked();
  await page.getByRole("button", { name: /^(Send my request|Request my callback)$/ }).click();

  await expect(page).toHaveURL(/\/thank-you\?form=(assessment|callback)/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Thank you, Alex.");

  const lead = await findLead(`alex.${id}@example.com`);
  expect(lead).toMatchObject({
    form_type: "assessment",
    first_name: "Alex",
    last_name: "Morgan",
    phone: expect.stringMatching(/^\+18435\d{6}$/),
    care_for: "parent",
    client_first_name: "Ruth",
    town: "beaufort",
    services: "personal-care",
    hours_preset: "few-hours-most-days",
    hours_per_week: 20,
    start_timing: "two-weeks",
    preferred_contact: "call",
    sms_transactional_consent: true,
    sms_marketing_consent: false,
    consent_text_version: "sms-v1-2026-10",
    consent_text_transactional: expect.stringContaining("Reply HELP for help, STOP to opt out"),
    consent_text_marketing: "",
    consent_timestamp: expect.stringMatching(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d/),
    page_url: expect.stringMatching(/\/free-assessment$/),
    utm_source: "newsletter",
    utm_medium: "email",
    utm_campaign: id,
    after_hours: expect.any(Boolean),
    tags: expect.arrayContaining(["website-lead", "form-assessment"]),
  });
  expect(lead.consent_ip).toBeDefined();
  expect(lead.website).toBeUndefined();
});

test("quiz → assessment hand-off carries quiz_* fields and the quiz-completed tag", async ({
  page,
}, info) => {
  const id = tag(info);
  await page.goto("/find-care");
  await page.waitForLoadState("networkidle");
  await page.getByRole("button", { name: "My parent" }).click();
  await page
    .getByRole("checkbox", { name: "Bathing or dressing is getting hard" })
    .check({ force: true });
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: /A few hours most days/ }).click();
  await page.getByRole("button", { name: "Within 2 weeks" }).click();
  await page.getByRole("combobox").selectOption("beaufort");
  await page.getByRole("button", { name: "See my suggestion" }).click();

  // "Email me this plan" — form_type=quiz_plan.
  const plan = page.locator("form").filter({ hasText: "Want a copy?" });
  await plan.getByRole("textbox").first().fill(`plan.${id}@example.com`);
  await plan.locator('input[type="checkbox"]').check({ force: true });
  await plan.getByRole("button", { name: "Email me this plan" }).click();
  await expect(
    page.getByRole("status").filter({ hasText: "Sent. Check your inbox" }),
  ).toBeVisible();
  const planLead = await findLead(`plan.${id}@example.com`);
  expect(planLead).toMatchObject({
    form_type: "quiz_plan",
    email: `plan.${id}@example.com`,
    quiz_for: "parent",
    quiz_town: "beaufort",
    email_consent: true,
    email_consent_version: "email-plan-v1-2026-10",
    consent_timestamp: expect.any(String),
    page_url: expect.stringMatching(/\/find-care$/),
    tags: expect.arrayContaining(["quiz-completed", "form-quiz-plan"]),
  });

  // Hand-off: the result CTA opens the form with the quiz answers already in it.
  await page
    .getByRole("link", { name: /Get a Free Care Assessment|Request a Callback/ })
    .last()
    .click();
  await expect(page).toHaveURL(/\/free-assessment\?from=quiz/);
  await page.waitForLoadState("networkidle");
  for (let step = 0; step < 3; step++) await page.getByRole("button", { name: "Continue" }).click();
  await page.locator("#first_name").fill("Quinn");
  await page.locator("#phone").fill(phone(info, 2));
  await page.locator("#email").fill(`quinn.${id}@example.com`);
  await pick(page, "Phone call");
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: /^(Send my request|Request my callback)$/ }).click();
  await expect(page).toHaveURL(/\/thank-you/);

  const lead = await findLead(`quinn.${id}@example.com`);
  expect(lead).toMatchObject({
    form_type: "assessment",
    prefill_source: "quiz",
    quiz_for: "parent",
    quiz_hours: expect.any(String),
    quiz_urgency: "two-weeks",
    sms_transactional_consent: false,
    consent_text_transactional: "",
    consent_ip: "",
    tags: expect.arrayContaining(["quiz-completed"]),
  });
});

test("contact form sends a lead with its topic", async ({ page }, info) => {
  const id = tag(info);
  await page.goto("/contact#message");
  await page.waitForLoadState("networkidle");
  await page.locator("#topic").selectOption("question");
  await page.locator("#first_name").fill("Sam");
  await page.locator("#email").fill(`sam.${id}@example.com`);
  await pick(page, "Email");
  await page.locator("#contact-message").fill(`Do you cover Okatie? ${id}`);
  await page.getByRole("button", { name: "Send message" }).click();
  await expect(page).toHaveURL(/\/thank-you\?form=contact/);

  const lead = await findLead(`sam.${id}@example.com`);
  expect(lead).toMatchObject({
    form_type: "contact",
    topic: "question",
    first_name: "Sam",
    preferred_contact: "email",
    message: `Do you cover Okatie? ${id}`,
    consent_text_version: "sms-v1-2026-10",
    page_url: expect.stringMatching(/\/contact$/),
    tags: expect.arrayContaining(["website-lead", "form-contact"]),
  });
});

test("referral form sends a lead tagged referral", async ({ page }, info) => {
  const id = tag(info);
  await page.goto("/for-professionals#refer");
  await page.waitForLoadState("networkidle");
  await page.getByLabel("Your first name (required)").fill("Dana");
  await page.getByLabel("Your last name (required)").fill("Reed");
  await page.getByLabel("Organization (required)").fill(`Beaufort Memorial ${id}`);
  await pick(page, "Discharge planner");
  await page.getByLabel("Your phone (required)").fill(phone(info, 3));
  await page.getByLabel("Your email (required)").fill(`dana.${id}@example.com`);
  await pick(page, "Email");
  await page.getByLabel("Client's first name (required)").fill("Ruth");
  await page.getByLabel("First letter of client's last name (required)").fill("m");
  await page.getByLabel("Client's town (required)").selectOption("port-royal");
  await pick(page, /Companionship/);
  await pick(page, "As soon as possible");
  await pick(page, "A few hours a week");
  await pick(page, /permission to share/);
  await page.getByRole("button", { name: "Send referral" }).click();
  await expect(page).toHaveURL(/\/thank-you\?form=referral/);

  const lead = await findLead(`dana.${id}@example.com`);
  expect(lead).toMatchObject({
    form_type: "referral",
    referrer_first_name: "Dana",
    organization: `Beaufort Memorial ${id}`,
    role: "discharge-planner",
    reach_by: "email",
    client_first_name: "Ruth",
    client_last_initial: "M",
    town: "port-royal",
    town_name: "Port Royal",
    services: "companionship",
    permission_confirmed: true,
    permission_timestamp: expect.any(String),
    page_url: expect.stringMatching(/\/for-professionals$/),
    tags: expect.arrayContaining(["referral", "website-lead", "form-referral"]),
  });
});

test.describe("API guards", () => {
  const assessment = (overrides: Record<string, unknown>) => ({
    values: {
      care_for: "self",
      client_first_name: "",
      town: "beaufort",
      town_other: "",
      services: ["home-help"],
      start_timing: "month",
      hours_preset: "few-hours-week",
      coming_from_hospital: false,
      first_name: "Pat",
      last_name: "",
      phone: "",
      email: "",
      preferred_contact: "call",
      best_time: "",
      notes: "",
      sms_transactional_consent: false,
      sms_marketing_consent: false,
      website: "",
      ...overrides,
    },
    meta: { form_type: "assessment", page_url: "http://localhost/free-assessment" },
  });

  test("honeypot: a filled 'website' field looks like success but saves nothing", async ({
    request,
  }, info) => {
    const id = tag(info);
    const res = await request.post("/api/lead", {
      data: assessment({
        phone: phone(info, 4),
        notes: `bot ${id}`,
        website: "http://spam.example",
      }),
    });
    expect(res.status()).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    await expect(findLead(`bot ${id}`)).rejects.toThrow();
  });

  test("duplicate guard: the same phone twice within 10 minutes is refused", async ({
    request,
  }, info) => {
    const id = tag(info);
    const body = assessment({ phone: phone(info, 5), notes: `dup ${id}` });
    expect((await request.post("/api/lead", { data: body })).status()).toBe(200);
    const again = await request.post("/api/lead", { data: body });
    expect(again.status()).toBe(409);
    expect((await again.json()).code).toBe("duplicate");
  });

  test("bad JSON is a 400, a bad body a 422 with field messages", async ({ request }) => {
    const bad = await request.post("/api/lead", {
      headers: { "content-type": "application/json" },
      data: Buffer.from("{not json"),
    });
    expect(bad.status()).toBe(400);
    const invalid = await request.post("/api/lead", { data: assessment({ first_name: "" }) });
    expect(invalid.status()).toBe(422);
    expect((await invalid.json()).fields).toHaveProperty("first_name");
  });
});

test.describe("GoHighLevel mapping (lib/ghl.ts)", () => {
  test.beforeEach(({}, info) =>
    test.skip(info.project.name !== "desktop-full", "node-only, run once"),
  );

  const lead: Lead = {
    form_type: "assessment",
    received_at: "2026-10-25T14:00:00.000Z",
    first_name: "Alex",
    last_name: "Morgan",
    phone: "+18435550101",
    email: "alex@example.com",
    services: "personal-care,home-help",
    hours_per_week: 20,
    sms_transactional_consent: true,
    consent_text_version: "sms-v1-2026-10",
    after_hours: true,
    quiz_for: "parent",
    utm_source: "newsletter",
    notes: "",
  };

  test("tags and API v2 contact body", () => {
    expect(leadTags(lead)).toEqual(
      expect.arrayContaining(["website-lead", "form-assessment", "quiz-completed", "after-hours"]),
    );
    const body = toGhlContact(lead, "loc_123");
    expect(body).toMatchObject({
      locationId: "loc_123",
      firstName: "Alex",
      lastName: "Morgan",
      phone: "+18435550101",
      email: "alex@example.com",
      source: "Website · assessment",
    });
    const fields = Object.fromEntries(
      (body.customFields as { key: string; field_value: string }[]).map((f) => [
        f.key,
        f.field_value,
      ]),
    );
    expect(fields).toMatchObject({
      form_type: "assessment",
      services: "personal-care,home-help",
      hours_per_week: "20",
      sms_transactional_consent: "true",
      consent_text_version: "sms-v1-2026-10",
      quiz_for: "parent",
      utm_source: "newsletter",
    });
    expect(fields).not.toHaveProperty("notes"); // empty values are left out
    expect(fields).not.toHaveProperty("first_name"); // standard fields aren't duplicated
    expect(leadNote(lead)).toContain("hours_per_week: 20");

    const ref = toGhlContact(
      {
        form_type: "referral",
        received_at: "x",
        referrer_first_name: "Dana",
        referrer_last_name: "Reed",
        referrer_email: "dana@example.com",
        organization: "Beaufort Memorial",
      },
      "loc",
    );
    expect(ref).toMatchObject({ firstName: "Dana", companyName: "Beaufort Memorial" });
    expect(ref.tags).toContain("referral");
  });

  test("webhook mode POSTs the flat lead with its tags", async () => {
    let received: Record<string, unknown> | null = null;
    const server = createServer((req, res) => {
      let data = "";
      req.on("data", (c) => (data += c));
      req.on("end", () => {
        received = JSON.parse(data);
        res.end("ok");
      });
    });
    await new Promise<void>((r) => server.listen(0, r));
    const { port } = server.address() as { port: number };
    try {
      await sendToGhl(lead, { GHL_WEBHOOK_URL: `http://127.0.0.1:${port}/hook` } as never);
      expect(received).toMatchObject({ form_type: "assessment", first_name: "Alex" });
      expect((received as unknown as { tags: string[] }).tags).toContain("quiz-completed");
    } finally {
      server.close();
    }
  });

  test("API v2 mode: upsert, then a note on the contact", async () => {
    const calls: { url: string; init: RequestInit }[] = [];
    const realFetch = globalThis.fetch;
    globalThis.fetch = (async (url: string, init: RequestInit) => {
      calls.push({ url: String(url), init });
      const body = String(url).endsWith("/contacts/upsert") ? { contact: { id: "c_1" } } : {};
      return new Response(JSON.stringify(body), { status: 200 });
    }) as typeof fetch;
    try {
      await sendToGhl(lead, { GHL_API_TOKEN: "tok", GHL_LOCATION_ID: "loc_9" } as never);
    } finally {
      globalThis.fetch = realFetch;
    }
    expect(calls.map((c) => c.url)).toEqual([
      "https://services.leadconnectorhq.com/contacts/upsert",
      "https://services.leadconnectorhq.com/contacts/c_1/notes",
    ]);
    const headers = calls[0]!.init.headers as Record<string, string>;
    expect(headers.authorization).toBe("Bearer tok");
    expect(headers.version).toBe("2021-07-28");
    expect(JSON.parse(String(calls[0]!.init.body))).toMatchObject({ locationId: "loc_9" });
  });

  test("live mode without keys fails loudly (the route then answers 502)", async () => {
    await expect(sendToGhl(lead, {} as never)).rejects.toThrow(/GHL_WEBHOOK_URL/);
  });
});

test.describe("legacy URLs (SEO_PLAN §5)", () => {
  test.beforeEach(({}, info) =>
    test.skip(info.project.name !== "desktop-full", "HTTP only, run once"),
  );

  const MAP: [string, string][] = [
    ["/adl-care", "/care/personal-care"],
    ["/personal-care", "/care/personal-care"],
    ["/respite-care", "/care/respite-care"],
    ["/companionship-care", "/care/companionship"],
    ["/medical-referrals", "/for-professionals"],
    ["/about-us", "/about"],
    ["/contact-us", "/contact"],
    ["/feed", "/"],
    ["/comments/feed", "/"],
    ["/home", "/"],
    ["/wp-sitemap.xml", "/sitemap.xml"],
    ["/sitemap_index.xml", "/sitemap.xml"],
    ["/page-sitemap.xml", "/sitemap.xml"],
    ["/post-sitemap.xml", "/sitemap.xml"],
  ];

  for (const [from, to] of MAP) {
    test(`${from} and ${from}/ → ${to} (301, ≤ 2 hops, ends 200)`, async ({ request }) => {
      const first = await request.get(from, { maxRedirects: 0 });
      expect(first.status()).toBe(301);
      expect(new URL(first.headers().location!, "http://x").pathname).toBe(to);
      // With the slash: Next strips it first, then the 301 — at most two hops.
      let url = `${from}/`;
      let hops = 0;
      for (; hops < 3; hops++) {
        const res = await request.get(url, { maxRedirects: 0 });
        if (res.status() < 300 || res.status() >= 400) {
          expect(res.status()).toBe(200);
          break;
        }
        url = new URL(res.headers().location!, "http://localhost").pathname;
      }
      expect(url).toBe(to);
      expect(hops).toBeLessThanOrEqual(2);
    });
  }

  test("WordPress endpoints answer 410 Gone", async ({ request }) => {
    for (const p of [
      "/wp-admin",
      "/wp-admin/post.php",
      "/wp-login.php",
      "/xmlrpc.php",
      "/wp-json/wp/v2/posts",
      "/wp-includes/js/jquery.js",
      "/wp-content/uploads/2023/05/logo.png",
    ]) {
      const res = await request.get(p, { maxRedirects: 0 });
      expect(res.status(), p).toBe(410);
    }
  });

  test("query strings survive the redirect", async ({ request }) => {
    const res = await request.get("/contact-us/?utm_source=gbp", { maxRedirects: 5 });
    expect(res.url()).toMatch(/\/contact\?utm_source=gbp$/);
  });
});

test("/reveal-notes: preview only, noindex, logo toggle swaps the header logo", async ({
  page,
}) => {
  const res = await page.goto("/reveal-notes");
  expect(res?.status()).toBe(200);
  await page.waitForLoadState("networkidle");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  await expect(page.locator("#need-h")).toContainText("then we launch");
  const header = page.locator("header .dd-logo").first();
  await expect(header.locator('[data-fig="a"]')).toBeVisible();
  await page.getByRole("button", { name: "Show Option B in the header" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-logo-figure", "b");
  await expect(header.locator('[data-fig="b"]')).toBeVisible();
  await expect(header.locator('[data-fig="a"]')).toBeHidden();
  // Kept for this tab across pages.
  await page.goto("/about");
  await expect(page.locator("html")).toHaveAttribute("data-logo-figure", "b");
});
