/**
 * Shared lead plumbing for the API routes (CLAUDE.md "Leads: LEAD_MODE"):
 * duplicate guard, request IP and delivery (mock file or GoHighLevel webhook).
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import type { z } from "zod";

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
  Object.fromEntries(Object.entries(utm).map(([k, val]) => [`utm_${k}`, val]));

/** Mock: write ./.leads/<time>-<form>.json. Live: POST to the GoHighLevel webhook. */
export async function deliver(lead: { form_type: string; received_at: string }): Promise<boolean> {
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
