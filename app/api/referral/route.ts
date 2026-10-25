/**
 * POST /api/referral — the /for-professionals referral form (COPY_CONVERSION §5 "03").
 * Same zod schema as the browser; honeypot → silent success; same referrer phone within
 * 10 minutes → "duplicate". form_type=referral, GHL tag `referral` (07 §13).
 * LEAD_MODE=mock (default): ./.leads/*.json. LEAD_MODE=live: GoHighLevel webhook.
 */
import { townLabel } from "@/content/assessment";
import { REFERRAL_PERMISSION, referralHoursOptions } from "@/content/referral";
import { deliver, fieldErrors, forget, isDuplicate, json, utmFields } from "@/lib/leads";
import { nationalDigits, toE164 } from "@/lib/phone";
import { referralMetaSchema, referralSchema } from "@/lib/schemas/referral";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, code: "bad-request" }, 400);
  }
  const { values, meta } = (body ?? {}) as { values?: unknown; meta?: unknown };
  const parsed = referralSchema.safeParse(values);
  const parsedMeta = referralMetaSchema.safeParse(meta ?? { form_type: "referral" });
  if (!parsed.success || !parsedMeta.success)
    return json({ ok: false, code: "invalid", fields: fieldErrors(parsed.error) }, 422);
  const v = parsed.data;
  const m = parsedMeta.data;
  if (v.website) return json({ ok: true });

  const key = `referral:${nationalDigits(v.referrer_phone)}`;
  if (isDuplicate(key)) return json({ ok: false, code: "duplicate" }, 409);

  const received = new Date().toISOString();
  const lead = {
    form_type: "referral",
    tags: ["referral"],
    referrer_first_name: v.referrer_first_name,
    referrer_last_name: v.referrer_last_name,
    organization: v.organization,
    role: v.role,
    role_other: v.role === "other" ? v.role_other : "",
    referrer_phone: toE164(v.referrer_phone),
    referrer_email: v.referrer_email,
    reach_by: v.reach_by,
    client_first_name: v.client_first_name,
    client_last_initial: v.client_last_initial.toUpperCase(),
    town: v.town,
    town_name: townLabel(v.town, v.town_other),
    town_other: v.town === "other" ? v.town_other : "",
    services: v.services.join(","),
    start_timing: v.start_timing,
    start_date: v.start_timing === "date" ? v.start_date : "",
    hours_preset: v.hours_preset,
    hours_label: referralHoursOptions.find((h) => h.value === v.hours_preset)?.label ?? "",
    schedule_details: v.schedule_details,
    notes: v.notes,
    permission_confirmed: true,
    permission_text: REFERRAL_PERMISSION,
    permission_timestamp: received,
    after_hours: m.after_hours,
    page_url: m.page_url,
    ...utmFields(m.utm),
    received_at: received,
  };
  if (!(await deliver(lead))) {
    forget(key);
    return json({ ok: false, code: "failed" }, 502);
  }
  return json({ ok: true });
}
