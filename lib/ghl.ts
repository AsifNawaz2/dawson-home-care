/**
 * GoHighLevel delivery for LEAD_MODE=live (08 §2, option B). Two ways in, no code change:
 *
 *  - GHL_WEBHOOK_URL set → the flat lead is POSTed to a GHL Inbound Webhook (workflow trigger).
 *    Every key arrives as-is, so the workflow maps them to fields once (08 §2 field list).
 *  - else GHL_API_TOKEN + GHL_LOCATION_ID → API v2: upsert the contact (matched on phone/email by
 *    GHL's duplicate rules), standard fields + tags + custom fields, then one readable note with
 *    the whole lead so staff never miss an answer that isn't mapped to a field yet.
 *
 * The same flat lead (with its tags) is what LEAD_MODE=mock writes to ./.leads/*.json.
 * Plain relative imports only: Playwright imports this file to check the mapping.
 */

export type Lead = Record<string, unknown> & { form_type: string; received_at: string };

export const GHL_API = "https://services.leadconnectorhq.com";
export const GHL_API_VERSION = "2021-07-28";
const TIMEOUT_MS = 10_000;

/** Fields that become GHL standard contact fields, not custom fields. */
const STANDARD = new Set([
  "first_name",
  "last_name",
  "email",
  "phone",
  "tags",
  "referrer_first_name",
  "referrer_last_name",
  "referrer_email",
  "referrer_phone",
  "organization",
]);

/**
 * GHL tags for a lead: `website-lead` on all, `referral` on referrals (07 §13), `quiz-completed`
 * on every lead that carries quiz answers (COPY_CONVERSION §9.7), `after-hours` when sent while
 * the office was closed (05 Fix 2), plus any tags the route already set.
 */
export function leadTags(lead: Lead): string[] {
  const tags = new Set<string>(["website-lead", `form-${lead.form_type.replaceAll("_", "-")}`]);
  for (const t of Array.isArray(lead.tags) ? lead.tags : []) tags.add(String(t));
  if (lead.form_type === "referral") tags.add("referral");
  if (lead.form_type === "quiz_plan" || Object.keys(lead).some((k) => k.startsWith("quiz_")))
    tags.add("quiz-completed");
  if (lead.after_hours === true) tags.add("after-hours");
  return [...tags];
}

export const withTags = <T extends Lead>(lead: T): T & { tags: string[] } => ({
  ...lead,
  tags: leadTags(lead),
});

const fieldValue = (v: unknown): string =>
  v === null || v === undefined
    ? ""
    : Array.isArray(v)
      ? v.join(",")
      : typeof v === "object"
        ? JSON.stringify(v)
        : String(v);

/** API v2 body for POST /contacts/upsert. Referrals: the contact is the referring professional. */
export function toGhlContact(lead: Lead, locationId: string) {
  const s = (k: string) => fieldValue(lead[k]);
  const referral = lead.form_type === "referral";
  const contact: Record<string, unknown> = {
    locationId,
    firstName: referral ? s("referrer_first_name") : s("first_name"),
    lastName: referral ? s("referrer_last_name") : s("last_name"),
    email: (referral ? s("referrer_email") : s("email")) || undefined,
    phone: (referral ? s("referrer_phone") : s("phone")) || undefined,
    companyName: referral ? s("organization") || undefined : undefined,
    source: `Website · ${lead.form_type}`,
    tags: leadTags(lead),
    customFields: Object.entries(lead)
      .filter(([k, v]) => !STANDARD.has(k) && v !== "" && v !== null && v !== undefined)
      .map(([key, v]) => ({ key, field_value: fieldValue(v) })),
  };
  return Object.fromEntries(Object.entries(contact).filter(([, v]) => v !== undefined));
}

/** Human-readable note for the contact's timeline. */
export function leadNote(lead: Lead): string {
  const lines = Object.entries(lead)
    .filter(([k, v]) => k !== "tags" && v !== "" && v !== null && v !== undefined)
    .map(([k, v]) => `${k}: ${fieldValue(v)}`);
  return `Website form: ${lead.form_type}\n\n${lines.join("\n")}`;
}

async function post(url: string, body: unknown, headers: Record<string, string> = {}) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json", ...headers },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`GoHighLevel answered ${res.status} for ${new URL(url).pathname}`);
  return res;
}

/** Send one lead to GoHighLevel. Throws when nothing is configured or GHL refuses it. */
export async function sendToGhl(lead: Lead, env: NodeJS.ProcessEnv = process.env): Promise<void> {
  const tagged = withTags(lead);
  if (env.GHL_WEBHOOK_URL) {
    await post(env.GHL_WEBHOOK_URL, tagged);
    return;
  }
  const token = env.GHL_API_TOKEN;
  const locationId = env.GHL_LOCATION_ID;
  if (!token || !locationId)
    throw new Error("LEAD_MODE=live needs GHL_WEBHOOK_URL, or GHL_API_TOKEN + GHL_LOCATION_ID");

  const auth = { authorization: `Bearer ${token}`, version: GHL_API_VERSION };
  const res = await post(`${GHL_API}/contacts/upsert`, toGhlContact(tagged, locationId), auth);
  const data = (await res.json().catch(() => ({}))) as { contact?: { id?: string } };
  const id = data.contact?.id;
  if (!id) return;
  // The contact (with its fields and tags) is saved; a failed note must not fail the lead.
  await post(`${GHL_API}/contacts/${id}/notes`, { body: leadNote(tagged) }, auth).catch((err) =>
    console.error("[lead] GoHighLevel note failed", err),
  );
}
