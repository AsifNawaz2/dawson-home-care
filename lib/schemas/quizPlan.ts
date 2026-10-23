/**
 * "Email me this plan" on the Care Quiz result (SPEC_FEATURES §4 EmailPlanForm, COPY_CONVERSION
 * §9.7). Shared by the browser form and POST /api/lead (form_type=quiz_plan).
 */
import { z } from "zod";
import { msg } from "@/lib/formMessages";

export const quizPlanSchema = z.object({
  email: z.string().trim().min(1, msg.emailRequired).pipe(z.email(msg.emailInvalid)),
  first_name: z.string().trim().max(40, msg.tooLong(40)).default(""),
  consent: z.literal(true, { error: () => msg.planConsentRequired }),
  website: z.string().max(200).optional().default(""),
});
export type QuizPlanValues = z.input<typeof quizPlanSchema>;

export const quizPlanMetaSchema = z.object({
  form_type: z.literal("quiz_plan"),
  quiz: z.record(z.string(), z.string()).default({}),
  page_url: z.string().max(500).default(""),
  utm: z.record(z.string(), z.string()).default({}),
});
