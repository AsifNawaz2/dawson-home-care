/**
 * Referral form schema (COPY_CONVERSION §5 "03", §8). Shared by the form and POST /api/referral.
 * No SMS consent here: referrers choose phone or email only.
 */
import { z } from "zod";
import { msg } from "@/lib/formMessages";
import { always, choice, longText, name, phone, todayEt } from "./fields";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export const referralSchema = z
  .object({
    // About you
    referrer_first_name: name(msg.firstNameRequired),
    referrer_last_name: name(msg.lastNameRequired),
    organization: z.string().trim().min(1, msg.organizationRequired).max(100, msg.tooLong(100)),
    role: choice(
      [
        "discharge-planner",
        "case-manager",
        "social-worker",
        "hospice-team",
        "physician-office",
        "other",
      ],
      msg.roleRequired,
    ),
    role_other: z.string().trim().max(60, msg.tooLong(60)),
    referrer_phone: phone(),
    referrer_email: z.string().trim().min(1, msg.emailRequired).pipe(z.email(msg.emailInvalid)),
    reach_by: choice(["phone", "email"], msg.contactRequired),
    // About the client
    client_first_name: name(msg.clientFirstNameRequired),
    client_last_initial: z
      .string()
      .trim()
      .min(1, msg.lastInitialRequired)
      .regex(/^[A-Za-z]$/, msg.lastInitialOneLetter),
    town: z.string().min(1, msg.townRequired),
    town_other: z.string().trim().max(60),
    // Care needed
    services: z
      .array(
        z.enum([
          "personal-care",
          "home-help",
          "companionship",
          "respite-care",
          "24-hour-care",
          "hospice-support",
          "not-sure",
        ]),
      )
      .min(1, msg.servicesRequiredReferral),
    start_timing: choice(["asap", "date", "two-weeks", "not-sure"], msg.startRequired),
    start_date: z.string().trim(),
    hours_preset: choice(
      ["few-hours-week", "few-hours-most-days", "full-days", "around-the-clock", "not-sure"],
      msg.hoursRequired,
    ),
    schedule_details: longText(200),
    notes: longText(1000),
    permission_confirmed: z.literal(true, { error: () => msg.permissionRequired }),
    // Honeypot: "Leave this field empty"
    website: z.string(),
  })
  .superRefine((v, ctx) => {
    if (v.role === "other" && !v.role_other)
      ctx.addIssue({ code: "custom", path: ["role_other"], message: msg.roleOtherRequired });
    if (v.town === "other" && !v.town_other)
      ctx.addIssue({ code: "custom", path: ["town_other"], message: msg.townOtherRequired });
    if (v.start_timing === "date") {
      const d = v.start_date;
      const issue = (message: string) =>
        ctx.addIssue({ code: "custom", path: ["start_date"], message });
      if (!d) return issue(msg.dateRequired);
      if (!DATE_RE.test(d) || Number.isNaN(Date.parse(`${d}T12:00:00Z`)))
        return issue(msg.dateInvalid);
      const today = todayEt();
      const [y, m, day] = today.split("-").map(Number) as [number, number, number];
      const limit = `${y + 1}-${String(m).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      if (d < today) issue(msg.datePast);
      else if (d > limit) issue(msg.dateTooFar);
    }
  }, always);

export type ReferralValues = z.input<typeof referralSchema>;

export const emptyReferral: ReferralValues = {
  referrer_first_name: "",
  referrer_last_name: "",
  organization: "",
  role: "" as ReferralValues["role"],
  role_other: "",
  referrer_phone: "",
  referrer_email: "",
  reach_by: "" as ReferralValues["reach_by"],
  client_first_name: "",
  client_last_initial: "",
  town: "",
  town_other: "",
  services: [],
  start_timing: "" as ReferralValues["start_timing"],
  start_date: "",
  hours_preset: "" as ReferralValues["hours_preset"],
  schedule_details: "",
  notes: "",
  permission_confirmed: false as unknown as true,
  website: "",
};

/** Field order for the error summary. */
export const REFERRAL_FIELDS = Object.keys(emptyReferral).filter(
  (k) => k !== "website",
) as (keyof ReferralValues)[];

export const referralMetaSchema = z.object({
  form_type: z.literal("referral"),
  after_hours: z.boolean().default(false),
  page_url: z.string().max(500).default(""),
  utm: z.record(z.string(), z.string()).default({}),
});
