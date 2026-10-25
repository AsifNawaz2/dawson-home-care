/** Field rules shared by every form schema, so the wording stays identical (COPY_CONVERSION §8). */
import { z } from "zod";
import { looksLikeMbi, looksLikeSsn, looksLikeUrl, msg } from "@/lib/formMessages";
import { checkPhone } from "@/lib/phone";

/** Name, max 40, never a web address. `required` = the empty message, or null if optional. */
export const name = (required: string | null) =>
  z
    .string()
    .trim()
    .max(40, msg.nameTooLong)
    .refine((s) => !looksLikeUrl(s), msg.nameIsUrl)
    .refine((s) => required === null || s.length > 0, required ?? "");

export const choice = <T extends string>(values: readonly [T, ...T[]], message: string) =>
  z.enum(values, { error: () => message });

/** US phone. Optional phones only check the format when something was typed. */
export const phone = (required = true) =>
  z.string().superRefine((s, ctx) => {
    const c = checkPhone(s);
    if (c === "empty" && required) ctx.addIssue({ code: "custom", message: msg.phoneRequired });
    else if (c === "nonUs") ctx.addIssue({ code: "custom", message: msg.phoneNonUs });
    else if (c === "invalid") ctx.addIssue({ code: "custom", message: msg.phoneInvalid });
  });

/** Free text: length limit + blocking SSN / Medicare-number checks. */
export const longText = (max: number) =>
  z
    .string()
    .max(max, msg.tooLong(max))
    .refine((s) => !looksLikeSsn(s), msg.ssnFound)
    .refine((s) => !looksLikeMbi(s), msg.mbiFound);

/** Today's date in Beaufort (America/New_York) as YYYY-MM-DD. Call at validation time only. */
export const todayEt = () =>
  new Intl.DateTimeFormat("en-CA", { timeZone: "America/New_York" }).format(new Date());

/**
 * Object-level (cross-field) checks run even while other fields still have errors, so every
 * message shows in the first error summary. Zod 4 skips them by default once a field fails.
 */
export const always = {
  when: (payload: { value: unknown }) =>
    typeof payload.value === "object" && payload.value !== null,
};
