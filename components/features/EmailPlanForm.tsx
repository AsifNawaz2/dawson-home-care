"use client";

/**
 * "Want a copy?" — email the quiz plan (COPY_CONVERSION §9.7, consent email-plan-v1-2026-10).
 * Its own chunk, loaded when the result shows (CareQuiz → next/dynamic), so react-hook-form and
 * zod aren't part of Home's first load.
 */
import { useId, useState } from "react";
import { Check } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resultUi, toGhlFields, type QuizAnswers, type QuizResult } from "@/content/quiz";
import { CURRENT_EMAIL_PLAN_CONSENT, emailPlanConsent } from "@/content/legal/consent";
import { useHydrated } from "@/lib/useHydrated";
import { leadPageUrl, leadUtm } from "@/lib/attribution";
import { sendMsg } from "@/lib/formMessages";
import { quizPlanSchema, type QuizPlanValues } from "@/lib/schemas/quizPlan";
import { FieldError } from "@/components/forms/FormBits";
import { useTurnstile } from "@/components/forms/Turnstile";
import { useOfficeStatus } from "@/components/layout/OfficeStatus";

export default function EmailPlan({
  answers,
  result,
  H4,
}: {
  answers: QuizAnswers;
  result: QuizResult;
  H4: "h3" | "h4";
}) {
  const uid = useId();
  const hydrated = useHydrated();
  const t = resultUi.emailPlan;
  const { isClosed } = useOfficeStatus();
  const [state, setState] = useState<"idle" | "sent" | "failed" | "offline">("idle");
  const turnstile = useTurnstile();
  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm<QuizPlanValues>({
    resolver: zodResolver(quizPlanSchema),
    mode: "onTouched",
    reValidateMode: "onChange",
    defaultValues: { email: "", first_name: "", consent: false as unknown as true, website: "" },
  });

  const send = async (values: QuizPlanValues) => {
    if (!navigator.onLine) return setState("offline");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          values,
          turnstile: await turnstile.getToken(),
          meta: {
            form_type: "quiz_plan",
            quiz: toGhlFields(answers, result),
            page_url: leadPageUrl(),
            utm: leadUtm(),
          },
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; code?: string };
      setState(data.ok || data.code === "duplicate" ? "sent" : "failed");
    } catch {
      setState("failed");
    }
  };
  const invalid = (e: typeof errors) => setFocus(e.email ? "email" : "consent");

  if (state === "sent") {
    return (
      <div className="flex flex-col gap-3 rounded-[20px] border border-line p-5 lg:p-6">
        <H4 className="h3 !text-h4">{t.heading}</H4>
        <p role="status" className="flex items-center gap-3 font-semibold text-plum-800">
          <span aria-hidden="true" className="bdot">
            <Check size={16} strokeWidth={3} />
          </span>
          {t.success}
        </p>
      </div>
    );
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit(send, invalid)}
      className="flex flex-col gap-4 rounded-[20px] border border-line p-5 lg:p-6"
      data-hides-mobile-bar=""
      aria-labelledby={`${uid}-h`}
    >
      <H4 id={`${uid}-h`} className="h3 !text-h4">
        {t.heading}
      </H4>
      <p>{t.text}</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="fld">
          <label className="lbl" htmlFor={`${uid}-email`}>
            {t.emailLabel}
          </label>
          <input
            id={`${uid}-email`}
            className="field"
            type="email"
            autoComplete="email"
            aria-invalid={!!errors.email || undefined}
            aria-describedby={errors.email ? `${uid}-email-err` : undefined}
            {...register("email")}
          />
          <FieldError id={`${uid}-email-err`} message={errors.email?.message} />
        </div>
        <div className="fld">
          <label className="lbl" htmlFor={`${uid}-name`}>
            {t.nameLabel}
          </label>
          <input
            id={`${uid}-name`}
            className="field"
            type="text"
            autoComplete="given-name"
            {...register("first_name")}
          />
        </div>
      </div>
      {turnstile.slot}
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        aria-label="Leave this field empty"
        className="sr-only"
        {...register("website")}
      />
      <label className="opt opt-sm !items-start">
        <input
          type="checkbox"
          aria-invalid={!!errors.consent || undefined}
          aria-describedby={errors.consent ? `${uid}-consent-err` : undefined}
          {...register("consent")}
        />
        <span className="sbox" aria-hidden="true">
          <Check size={18} strokeWidth={3} />
        </span>
        <span className="sm font-normal text-ink">
          (required) {emailPlanConsent[CURRENT_EMAIL_PLAN_CONSENT]}
        </span>
      </label>
      <FieldError id={`${uid}-consent-err`} message={errors.consent?.message} />
      {(state === "failed" || state === "offline") && (
        <p role="alert" className="esum">
          {state === "offline"
            ? sendMsg.offline
            : isClosed
              ? sendMsg.failedClosed
              : sendMsg.failedOpen}
        </p>
      )}
      <button
        type={hydrated ? "submit" : "button"}
        className="btn btn-secondary self-start max-sm:w-full"
        aria-disabled={isSubmitting || undefined}
      >
        {isSubmitting ? (
          <>
            <span className="spin" aria-hidden="true" />
            {t.sending}
          </>
        ) : (
          t.button
        )}
      </button>
      <p className="help">{t.privacy}</p>
    </form>
  );
}
