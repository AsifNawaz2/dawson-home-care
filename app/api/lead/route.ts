/**
 * POST /api/lead — every family form posts here (CLAUDE.md "Leads: LEAD_MODE").
 *
 *  - Same zod schema as the browser; field messages come back for the error summary.
 *  - Honeypot filled → success, lead dropped silently.
 *  - Same phone + same form within 10 minutes → "duplicate".
 *  - Consent proof (COPY_LEGAL §1.4) is built here, with server time, IP and user agent.
 *  - form_type=quiz_plan ("Email me this plan" on the quiz result): email + quiz_* fields +
 *    the email consent text and server timestamp (COPY_CONVERSION §9.7).
 *  - LEAD_MODE=mock (default): saved to ./.leads/<time>-<form>.json, nothing leaves the machine.
 *    LEAD_MODE=live: POSTed to GHL_WEBHOOK_URL (GoHighLevel inbound webhook).
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { assessmentSchema, leadMetaSchema } from "@/lib/schemas/assessment";
import { buildConsentProof } from "@/content/legal/consent";
import { nationalDigits, toE164 } from "@/lib/phone";
import { hoursOptions } from "@/content/assessment";
import { quizPlanMetaSchema, quizPlanSchema } from "@/lib/schemas/quizPlan";
import { CURRENT_EMAIL_PLAN_CONSENT, emailPlanConsent } from "@/content/legal/consent";

const recent = new Map<string, number>();
const TEN_MIN = 10 * 60 * 1000;

const json = (body: unknown, status = 200) => Response.json(body, { status });

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, code: "bad-request" }, 400);
  }
  const { values, meta } = (body ?? {}) as { values?: unknown; meta?: { form_type?: unknown } };
  if (meta?.form_type === "quiz_plan") return quizPlan(values, meta);

  const parsed = assessmentSchema.safeParse(values);
  const parsedMeta = leadMetaSchema.safeParse(meta ?? { form_type: "assessment" });
  if (!parsed.success || !parsedMeta.success) {
    const fields: Record<string, string> = {};
    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] ?? "form");
        fields[key] ??= issue.message;
      }
    }
    return json({ ok: false, code: "invalid", fields }, 422);
  }
  const v = parsed.data;
  const m = parsedMeta.data;

  // Honeypot: pretend all is well.
  if (v.website) return json({ ok: true });

  const key = `${m.form_type}:${nationalDigits(v.phone)}`;
  const now = Date.now();
  for (const [k, t] of recent) if (now - t > TEN_MIN) recent.delete(k);
  if (recent.has(key)) return json({ ok: false, code: "duplicate" }, 409);
  recent.set(key, now);

  const ip = (request.headers.get("x-forwarded-for") ?? "").split(",")[0]?.trim() ?? "";
  const proof = buildConsentProof({
    transactional: v.sms_transactional_consent,
    marketing: v.sms_marketing_consent,
    pageUrl: m.page_url,
    ip,
    userAgent: request.headers.get("user-agent") ?? "",
  });
  const preset = hoursOptions.find((h) => h.value === v.hours_preset);

  const lead = {
    form_type: m.form_type,
    first_name: v.first_name,
    last_name: v.last_name,
    phone: toE164(v.phone),
    email: v.email,
    care_for: v.care_for,
    client_first_name: v.care_for === "self" ? "" : v.client_first_name,
    town: v.town,
    town_other: v.town === "other" ? v.town_other : "",
    services: v.services.join(","),
    hours_preset: v.hours_preset,
    hours_per_week: v.hours_preset === "estimate" ? m.hours_per_week : (preset?.weekly ?? null),
    start_timing: v.start_timing,
    coming_from_hospital: v.coming_from_hospital,
    best_time: v.best_time,
    preferred_contact: v.preferred_contact,
    notes: v.notes,
    ...proof,
    prefill_source: m.prefill_source,
    service_page_needs: m.service_page_needs,
    payment_interest: m.payment_interest,
    after_hours: m.after_hours,
    ...Object.fromEntries(Object.entries(m.quiz).map(([k, val]) => [k, val])),
    ...Object.fromEntries(Object.entries(m.estimator).map(([k, val]) => [`estimator_${k}`, val])),
    ...Object.fromEntries(Object.entries(m.utm).map(([k, val]) => [`utm_${k}`, val])),
    received_at: proof.consent_timestamp,
  };

  if (!(await deliver(lead))) {
    recent.delete(key);
    return json({ ok: false, code: "failed" }, 502);
  }
  return json({ ok: true });
}

async function quizPlan(values: unknown, meta: unknown) {
  const parsed = quizPlanSchema.safeParse(values);
  const parsedMeta = quizPlanMetaSchema.safeParse(meta);
  if (!parsed.success || !parsedMeta.success) {
    const fields: Record<string, string> = {};
    if (!parsed.success)
      for (const issue of parsed.error.issues)
        fields[String(issue.path[0] ?? "form")] ??= issue.message;
    return json({ ok: false, code: "invalid", fields }, 422);
  }
  const v = parsed.data;
  const m = parsedMeta.data;
  if (v.website) return json({ ok: true });

  const key = `quiz_plan:${v.email.toLowerCase()}`;
  const now = Date.now();
  if (recent.has(key) && now - recent.get(key)! < TEN_MIN)
    return json({ ok: false, code: "duplicate" }, 409);
  recent.set(key, now);

  const received = new Date().toISOString();
  const lead = {
    form_type: "quiz_plan",
    email: v.email,
    first_name: v.first_name,
    ...m.quiz,
    email_consent: true,
    email_consent_version: CURRENT_EMAIL_PLAN_CONSENT,
    email_consent_text: emailPlanConsent[CURRENT_EMAIL_PLAN_CONSENT],
    consent_timestamp: received,
    page_url: m.page_url,
    tags: ["quiz-completed"],
    ...Object.fromEntries(Object.entries(m.utm).map(([k, val]) => [`utm_${k}`, val])),
    received_at: received,
  };
  if (!(await deliver(lead))) {
    recent.delete(key);
    return json({ ok: false, code: "failed" }, 502);
  }
  return json({ ok: true });
}

/** Mock: write ./.leads/<time>-<form>.json. Live: POST to the GoHighLevel webhook. */
async function deliver(lead: { form_type: string; received_at: string }): Promise<boolean> {
  try {
    if (process.env.LEAD_MODE === "live") {
      const url = process.env.GHL_WEBHOOK_URL;
      if (!url) throw new Error("GHL_WEBHOOK_URL is not set");
      const res = await fetch(url, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(lead),
      });
      if (!res.ok) throw new Error(`GoHighLevel answered ${res.status}`);
    } else {
      const dir = path.join(process.cwd(), ".leads");
      await mkdir(dir, { recursive: true });
      const file = path.join(
        dir,
        `${lead.received_at.replace(/[:.]/g, "-")}-${lead.form_type}.json`,
      );
      await writeFile(file, JSON.stringify(lead, null, 2));
      console.info(`[lead:mock] saved ${path.relative(process.cwd(), file)}`);
    }
    return true;
  } catch (err) {
    console.error("[lead] failed", err);
    return false;
  }
}
