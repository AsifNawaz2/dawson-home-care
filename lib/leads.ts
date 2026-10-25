/**
 * Shared lead plumbing for the API routes (CLAUDE.md "Leads: LEAD_MODE"):
 * duplicate guard, request IP, spam checks and delivery (mock file or GoHighLevel, lib/ghl.ts).
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import type { z } from "zod";
import { sendToGhl, withTags, type Lead } from "./ghl";

const recent = new Map<string, number>();
const TEN_MIN = 10 * 60 * 1000;

export const json = (body: unknown, status = 200) => Response.json(body, { status });

/** Same key (form + phone/email) within 10 minutes → true. Records the key otherwise. */
export function isDuplicate(key: string): boolean {
  const now = Date.now();
  for (const [k, t] of recent) if (now - t > TEN_MIN) recent.delete(k);
  if (recent.has(key)) return true;
  recent.set(key, now);
  return false;
}
/** Forget a key after a failed delivery, so the visitor can try again. */
export const forget = (key: string) => recent.delete(key);

export const requestIp = (request: Request) =>
  (request.headers.get("x-forwarded-for") ?? "").split(",")[0]?.trim() ?? "";

/** zod issues → { field: first message } for the form's error summary. */
export function fieldErrors(error: z.ZodError | undefined): Record<string, string> {
  const fields: Record<string, string> = {};
  for (const issue of error?.issues ?? [])
    fields[String(issue.path[0] ?? "form")] ??= issue.message;
  return fields;
}

/** "utm_source" etc. from the meta object the browser sends. */
export const utmFields = (utm: Record<string, string>) =>
  Object.fromEntries(Object.entries(cleanUtm(utm)).map(([k, val]) => [`utm_${k}`, val]));

/** utm_* from the browser (first touch, lib/attribution.ts), keys and values trimmed. */
export const cleanUtm = (utm: Record<string, string>) =>
  Object.fromEntries(
    Object.entries(utm)
      .filter(([k]) => /^[a-z_]{1,20}$/.test(k))
      .slice(0, 10)
      .map(([k, val]) => [k, String(val).slice(0, 200)]),
  );

/**
 * Cloudflare Turnstile (invisible). Off until TURNSTILE_SECRET_KEY is set: then every lead needs
 * a token that Cloudflare accepts. Network trouble on our side lets the lead through (the
 * honeypot and duplicate guard still apply) — losing a family's request is worse than spam.
 */
export async function passesTurnstile(token: unknown, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (typeof token !== "string" || !token) return false;
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: new URLSearchParams({ secret, response: token, ...(ip ? { remoteip: ip } : {}) }),
      signal: AbortSignal.timeout(8000),
    });
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch (err) {
    console.error("[lead] Turnstile check unreachable, letting the lead through", err);
    return true;
  }
}

/**
 * Mock (default): write ./.leads/<time>-<form>.json — exactly the body a GHL webhook would get.
 * Live: GoHighLevel webhook or API v2 (lib/ghl.ts).
 */
export async function deliver(raw: Lead): Promise<boolean> {
  const lead = withTags(raw);
  try {
    if (process.env.LEAD_MODE === "live") {
      await sendToGhl(lead);
      console.info(`[lead:live] ${lead.form_type} sent to GoHighLevel`);
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
