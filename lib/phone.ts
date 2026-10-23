/**
 * US phone numbers (COPY_CONVERSION §3 Step 4): formats as typed — (843) 379-3321 — and accepts
 * +1, spaces, dots and dashes.
 */
export const phoneDigits = (s: string) => s.replace(/\D/g, "");

/** 10 national digits, dropping a leading US country code. */
export function nationalDigits(s: string): string {
  const d = phoneDigits(s);
  return d.length === 11 && d.startsWith("1") ? d.slice(1) : d;
}

export function formatPhone(s: string): string {
  if (/[a-z]/i.test(s)) return s;
  const d = nationalDigits(s).slice(0, 10);
  if (d.length < 4) return d;
  if (d.length < 7) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}

export type PhoneCheck = "ok" | "empty" | "invalid" | "nonUs";

export function checkPhone(s: string): PhoneCheck {
  const t = s.trim();
  if (!t) return "empty";
  if (/^\+(?!1)/.test(t.replace(/\s/g, ""))) return "nonUs";
  if (/[a-z]/i.test(t)) return "invalid";
  const d = nationalDigits(t);
  if (d.length !== 10) return "invalid";
  // NANP: area code and exchange can't start with 0 or 1.
  if (!/^[2-9]\d{2}[2-9]\d{6}$/.test(d)) return "invalid";
  return "ok";
}

/** E.164 for the lead payload. */
export const toE164 = (s: string) => `+1${nationalDigits(s)}`;
