/** Contact form schema (COPY_CONVERSION §7 "04", §8). Shared by the form and POST /api/lead. */
import { z } from "zod";
import { msg } from "@/lib/formMessages";
import { checkPhone } from "@/lib/phone";
import { always, choice, longText, name, phone } from "./fields";

export const contactSchema = z
  .object({
    topic: choice(
      ["care-someone", "care-self", "question", "client", "professional", "job"],
      msg.topicRequired,
    ),
    first_name: name(msg.firstNameRequired),
    last_name: name(null),
    phone: phone(false),
    email: z.string().trim(),
    preferred_contact: choice(["call", "text", "email"], msg.contactRequired),
    message: longText(1000).refine((s) => s.trim().length > 0, msg.messageRequired),
    sms_transactional_consent: z.boolean(),
    sms_marketing_consent: z.boolean(),
    // Honeypot: "Leave this field empty"
    website: z.string(),
  })
  .superRefine((v, ctx) => {
    const noPhone = checkPhone(v.phone ?? "") === "empty";
    if (noPhone && !v.email) {
      for (const path of ["phone", "email"])
        ctx.addIssue({ code: "custom", path: [path], message: msg.phoneOrEmail });
      return;
    }
    if (v.email && !z.email().safeParse(v.email).success)
      ctx.addIssue({ code: "custom", path: ["email"], message: msg.emailInvalid });
    else if (v.preferred_contact === "email" && !v.email)
      ctx.addIssue({ code: "custom", path: ["email"], message: msg.emailRequired });
    if ((v.preferred_contact === "call" || v.preferred_contact === "text") && noPhone)
      ctx.addIssue({ code: "custom", path: ["phone"], message: msg.phoneRequired });
  }, always);

export type ContactValues = z.input<typeof contactSchema>;

export const emptyContact: ContactValues = {
  topic: "" as ContactValues["topic"],
  first_name: "",
  last_name: "",
  phone: "",
  email: "",
  preferred_contact: "" as ContactValues["preferred_contact"],
  message: "",
  sms_transactional_consent: false,
  sms_marketing_consent: false,
  website: "",
};

export const CONTACT_FIELDS = [
  "topic",
  "first_name",
  "last_name",
  "phone",
  "email",
  "preferred_contact",
  "message",
] as const;

export const contactMetaSchema = z.object({
  form_type: z.literal("contact"),
  after_hours: z.boolean().default(false),
  page_url: z.string().max(500).default(""),
  utm: z.record(z.string(), z.string()).default({}),
});
