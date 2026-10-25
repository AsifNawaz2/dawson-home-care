/**
 * Free-assessment schema (COPY_CONVERSION §3 + §8). Shared by the form (react-hook-form via
 * zodResolver) and /api/lead, so the browser and the server say exactly the same thing.
 */
import { z } from "zod";
import { msg } from "@/lib/formMessages";
import { choice, longText, name, phone } from "./fields";

export const assessmentSchema = z
  .object({
    // Step 1
    care_for: choice(["parent", "spouse", "self", "someone-else"], msg.careForRequired),
    client_first_name: name(null),
    town: z.string().min(1, msg.townRequired),
    town_other: z.string().trim().max(60),
    // Step 2
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
      .min(1, msg.servicesRequired),
    // Step 3
    start_timing: choice(["asap", "two-weeks", "month", "exploring"], msg.startRequired),
    hours_preset: choice(
      [
        "estimate",
        "few-hours-week",
        "few-hours-most-days",
        "full-days",
        "around-the-clock",
        "not-sure",
      ],
      msg.hoursRequired,
    ),
    coming_from_hospital: z.boolean(),
    // Step 4
    first_name: name(msg.firstNameRequired),
    last_name: name(null),
    phone: phone(),
    email: z.string().trim(),
    preferred_contact: choice(["call", "text", "email"], msg.contactRequired),
    best_time: z.enum(["morning", "midday", "afternoon", "any"]).or(z.literal("")),
    notes: longText(1000),
    // Step 5
    sms_transactional_consent: z.boolean(),
    sms_marketing_consent: z.boolean(),
    // Honeypot: "Leave this field empty"
    website: z.string(),
  })
  .superRefine((v, ctx) => {
    const email = v.email;
    if (v.preferred_contact === "email" && !email) {
      ctx.addIssue({ code: "custom", path: ["email"], message: msg.emailRequired });
    } else if (email && !z.email().safeParse(email).success) {
      ctx.addIssue({ code: "custom", path: ["email"], message: msg.emailInvalid });
    }
  });

export type AssessmentValues = z.input<typeof assessmentSchema>;

export const STEP_FIELDS: (keyof AssessmentValues)[][] = [
  ["care_for", "client_first_name", "town", "town_other"],
  ["services"],
  ["start_timing", "hours_preset", "coming_from_hospital"],
  ["first_name", "last_name", "phone", "email", "preferred_contact", "best_time", "notes"],
  ["sms_transactional_consent", "sms_marketing_consent"],
];

export const emptyAssessment: AssessmentValues = {
  care_for: "" as AssessmentValues["care_for"],
  client_first_name: "",
  town: "",
  town_other: "",
  services: [],
  start_timing: "" as AssessmentValues["start_timing"],
  hours_preset: "" as AssessmentValues["hours_preset"],
  coming_from_hospital: false,
  first_name: "",
  last_name: "",
  phone: "",
  email: "",
  preferred_contact: "" as AssessmentValues["preferred_contact"],
  best_time: "",
  notes: "",
  sms_transactional_consent: false,
  sms_marketing_consent: false,
  website: "",
};

/** Context that travels with the lead (prefill sources, after-hours, quiz/estimator fields). */
export const leadMetaSchema = z.object({
  form_type: z.literal("assessment"),
  prefill_source: z.string().max(40).default(""),
  service_page_needs: z.string().max(400).default(""),
  hours_per_week: z.number().nullable().default(null),
  estimator: z.record(z.string(), z.string()).default({}),
  quiz: z.record(z.string(), z.string()).default({}),
  payment_interest: z.string().max(60).default(""),
  /** Payment Explorer panels opened (comma-separated ids, sessionStorage `payment_explored`). */
  payment_explored: z.string().max(200).default(""),
  after_hours: z.boolean().default(false),
  page_url: z.string().max(500).default(""),
  utm: z.record(z.string(), z.string()).default({}),
});
export type LeadMeta = z.input<typeof leadMetaSchema>;
