"use client";

/**
 * Short contact form on /contact (COPY_CONVERSION §7 "04", §8). Posts to /api/lead with
 * form_type=contact; the topic goes to GHL as a field. SMS consents exactly as the assessment
 * form (COPY_LEGAL §1): separate, unchecked, optional, links outside the labels.
 */
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { useForm, useWatch, type FieldPath } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { links, sms } from "@/content/site.config";
import { THANKYOU_KEY, contactOptions } from "@/content/assessment";
import { CURRENT_SMS_CONSENT, smsConsent } from "@/content/legal/consent";
import {
  CONTACT_FIELDS,
  contactSchema,
  emptyContact,
  type ContactValues,
} from "@/lib/schemas/contact";
import { emailSuggestion, sendMsg, summaryTitle } from "@/lib/formMessages";
import { formatPhone } from "@/lib/phone";
import { writeStorage } from "@/lib/storage";
import { isReducedMotion } from "@/lib/motionMode";
import { cn } from "@/lib/cn";
import { NextOpen, useOfficeStatus } from "@/components/layout/OfficeStatus";
import { CheckIcon, ErrorSummary, FieldError, type SummaryItem } from "./FormBits";

type Name = FieldPath<ContactValues>;

const consent = smsConsent[CURRENT_SMS_CONSENT];

const topicOptions = [
  { value: "care-someone", label: "I'm looking for care for someone" },
  { value: "care-self", label: "I'm looking for care for myself" },
  { value: "question", label: "I have a question" },
  { value: "client", label: "I'm a current client or family member" },
  { value: "professional", label: "I'm a healthcare professional" },
  { value: "job", label: "I'm looking for a job" },
] as const;

const targetId = (name: Name) =>
  name === "preferred_contact" ? "preferred_contact-call" : (name as string);

export function ContactForm() {
  const router = useRouter();
  const { isClosed } = useOfficeStatus();
  const uid = useId();
  const [summary, setSummary] = useState<SummaryItem[] | null>(null);
  const [sendState, setSendState] = useState<"idle" | "sending" | "sent">("idle");
  const [sendError, setSendError] = useState<{ text: string; urgent: boolean } | null>(null);
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const summaryRef = useRef<HTMLDivElement>(null);

  const {
    register,
    control,
    trigger,
    getValues,
    setValue,
    setError,
    getFieldState,
    formState: { errors },
  } = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: emptyContact,
    mode: "onTouched",
    reValidateMode: "onChange",
  });
  const v = useWatch({ control });

  useEffect(() => {
    if (summary) summaryRef.current?.focus();
  }, [summary]);

  const err = (n: Name) => (errors as Record<string, { message?: string } | undefined>)[n]?.message;
  const desc = (n: Name, ...ids: string[]) =>
    [...ids, err(n) ? `${n}-err` : ""].filter(Boolean).join(" ") || undefined;

  const send = async () => {
    setSendError(null);
    const ok = await trigger(undefined, { shouldFocus: false });
    if (!ok) {
      setSummary(
        CONTACT_FIELDS.flatMap((n) => {
          const m = getFieldState(n).error?.message;
          return m ? [{ target: targetId(n), message: m }] : [];
        }),
      );
      return;
    }
    setSummary(null);
    if (typeof navigator !== "undefined" && navigator.onLine === false) {
      setSendError({ text: sendMsg.offline, urgent: false });
      return;
    }
    setSendState("sending");
    try {
      const values = getValues();
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          values,
          meta: {
            form_type: "contact",
            after_hours: isClosed,
            page_url: window.location.href.split("?")[0],
            utm: Object.fromEntries(
              [...new URLSearchParams(window.location.search)]
                .filter(([k]) => k.startsWith("utm_"))
                .map(([k, val]) => [k.slice(4), val]),
            ),
          },
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        code?: string;
        fields?: Record<string, string>;
      };
      if (data.ok) {
        setSendState("sent");
        const reachVerb =
          values.preferred_contact === "email"
            ? "email"
            : values.preferred_contact === "text" && values.sms_transactional_consent
              ? "text"
              : "call";
        writeStorage(
          "session",
          THANKYOU_KEY,
          JSON.stringify({
            firstName: values.first_name.trim(),
            form: "contact",
            reachVerb,
            closed: isClosed,
          }),
        );
        window.setTimeout(
          () => router.push("/thank-you?form=contact"),
          isReducedMotion() ? 0 : 400,
        );
        return;
      }
      setSendState("idle");
      if (data.code === "duplicate") setSendError({ text: sendMsg.duplicate, urgent: false });
      else if (data.code === "invalid" && data.fields) {
        Object.entries(data.fields).forEach(([k, m]) => setError(k as Name, { message: m }));
        setSummary(
          Object.entries(data.fields).map(([k, m]) => ({
            target: targetId(k as Name),
            message: m,
          })),
        );
      } else
        setSendError({ text: isClosed ? sendMsg.failedClosed : sendMsg.failedOpen, urgent: true });
    } catch {
      setSendState("idle");
      setSendError({ text: isClosed ? sendMsg.failedClosed : sendMsg.failedOpen, urgent: true });
    }
  };

  const sending = sendState === "sending";
  const left = 1000 - (v.message?.length ?? 0);
  const topic = v.topic as string;

  return (
    <form
      className="fcard flex flex-col gap-7"
      aria-labelledby="message-title"
      noValidate
      data-hides-mobile-bar=""
      onSubmit={(e) => {
        e.preventDefault();
        if (!sending) void send();
      }}
    >
      {summary && summary.length > 0 && (
        <ErrorSummary ref={summaryRef} title={summaryTitle(summary.length, true)} items={summary} />
      )}

      {/* Honeypot */}
      <div className="sr-only" aria-hidden="true">
        <label htmlFor={`${uid}-website`}>Leave this field empty</label>
        <input
          id={`${uid}-website`}
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register("website")}
        />
      </div>

      <div className="fld">
        <label className="lbl" htmlFor="topic">
          What&apos;s this about? (required)
        </label>
        <select
          id="topic"
          className="field"
          aria-invalid={!!err("topic") || undefined}
          aria-describedby={desc("topic", "topic-hint")}
          {...register("topic")}
        >
          <option value="">Choose one</option>
          {topicOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <FieldError id="topic-err" message={err("topic")} />
        <div id="topic-hint" aria-live="polite">
          {(topic === "care-someone" || topic === "care-self") && (
            <p className="notice">
              <strong>
                The quickest way to start is our{" "}
                <Link href="/free-assessment">free assessment form</Link>.
              </strong>{" "}
              — or send this message and we&apos;ll call you.
            </p>
          )}
          {topic === "professional" && (
            <p className="notice">
              <strong>
                Referring a client?{" "}
                <Link href="/for-professionals#refer">
                  Our referral form takes about 2 minutes.
                </Link>
              </strong>
            </p>
          )}
          {topic === "job" && (
            <p className="notice">
              <strong>
                <a href={links.hireology.value}>You can apply on Hireology, our hiring site.</a>
              </strong>{" "}
              — or ask your question here.
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-7 sm:grid-cols-2 sm:gap-5">
        <div className="fld">
          <label className="lbl" htmlFor="first_name">
            Your first name (required)
          </label>
          <input
            id="first_name"
            className="field"
            type="text"
            autoComplete="given-name"
            maxLength={40}
            aria-invalid={!!err("first_name") || undefined}
            aria-describedby={desc("first_name")}
            {...register("first_name")}
          />
          <FieldError id="first_name-err" message={err("first_name")} />
        </div>
        <div className="fld">
          <label className="lbl" htmlFor="last_name">
            Your last name
          </label>
          <input
            id="last_name"
            className="field"
            type="text"
            autoComplete="family-name"
            maxLength={40}
            aria-invalid={!!err("last_name") || undefined}
            aria-describedby={desc("last_name")}
            {...register("last_name")}
          />
          <FieldError id="last_name-err" message={err("last_name")} />
        </div>
      </div>

      <div className="fld">
        <label className="lbl" htmlFor="phone">
          Phone
        </label>
        <p id="phone-help" className="help">
          A phone number or an email is required.
        </p>
        <input
          id="phone"
          className="field"
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          aria-invalid={!!err("phone") || undefined}
          aria-describedby={desc("phone", "phone-help")}
          {...register("phone", {
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
              const f = formatPhone(e.target.value);
              if (f !== e.target.value) setValue("phone", f);
              if (err("email")) void trigger("email");
            },
          })}
        />
        <FieldError id="phone-err" message={err("phone")} />
      </div>
      <div className="fld">
        <label className="lbl" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          className="field"
          type="email"
          inputMode="email"
          autoComplete="email"
          aria-invalid={!!err("email") || undefined}
          aria-describedby={desc("email", "phone-help")}
          {...register("email", {
            onChange: () => {
              if (err("phone")) void trigger("phone");
            },
            onBlur: (e: React.FocusEvent<HTMLInputElement>) =>
              setSuggestion(emailSuggestion(e.target.value)),
          })}
        />
        <FieldError id="email-err" message={err("email")} />
        <div aria-live="polite">
          {suggestion && (
            <p className="help !text-plum-800">
              Did you mean <strong>{suggestion}</strong>?{" "}
              <button
                type="button"
                className="link sm !min-h-11"
                onClick={() => {
                  setValue("email", suggestion, { shouldValidate: true });
                  setSuggestion(null);
                }}
              >
                Use this
              </button>
            </p>
          )}
        </div>
      </div>

      <fieldset className="fs" aria-describedby={desc("preferred_contact")}>
        <legend className="lbl mb-3">Best way to reach you (required)</legend>
        <div className="grid gap-3 sm:grid-cols-3">
          {contactOptions.map((o) => (
            <label key={o.value} className="opt opt-sm" data-err={!!err("preferred_contact")}>
              <input
                type="radio"
                id={`preferred_contact-${o.value}`}
                value={o.value}
                {...register("preferred_contact")}
              />
              <span className="rdot" aria-hidden="true" />
              <span className="otl">{o.label}</span>
            </label>
          ))}
        </div>
        <FieldError id="preferred_contact-err" message={err("preferred_contact")} />
      </fieldset>

      <div className="fld">
        <label className="lbl" htmlFor="message">
          Your message (required)
        </label>
        <p id="message-help" className="help">
          Please don&apos;t include medical details.
        </p>
        <textarea
          id="message"
          className="field !min-h-[160px] resize-y !py-3.5 leading-normal"
          rows={5}
          maxLength={1000}
          aria-invalid={!!err("message") || undefined}
          aria-describedby={desc("message", "message-help")}
          {...register("message")}
        />
        <FieldError id="message-err" message={err("message")} />
        <p className="help" aria-live="polite">
          {left <= 200 ? `${left} characters left` : ""}
        </p>
      </div>

      <fieldset className="fs" aria-describedby={`${uid}-sms-help`}>
        <legend className="h3 !text-[1.375rem]">{consent.legend}</legend>
        <p id={`${uid}-sms-help`} className="help -mt-1">
          {consent.helper}
        </p>
        {[consent.transactional, ...(sms.marketingEnabled ? [consent.marketing] : [])].map(
          (box) => (
            <div key={box.field} className="flex flex-col gap-1.5">
              <label className="opt opt-sm !items-start">
                <input
                  type="checkbox"
                  id={box.field}
                  aria-describedby={`${box.field}-links`}
                  {...register(box.field)}
                />
                <span className="sbox" aria-hidden="true">
                  <CheckIcon size={18} className="text-plum-950" />
                </span>
                <span className="sm font-normal text-ink">{box.label}</span>
              </label>
              <p id={`${box.field}-links`} className="sm pl-[62px]">
                {box.linksLead}
                <a href={box.links[0].href}>{box.links[0].label}</a> and{" "}
                <a href={box.links[1].href}>{box.links[1].label}</a>
                {box.linksTail}
              </p>
            </div>
          ),
        )}
        <div aria-live="polite">
          {v.preferred_contact === "text" && !v.sms_transactional_consent && (
            <p className="notice sm">
              You chose text as the best way to reach you. To get texts, tick the first box.
              Otherwise, we&apos;ll call.
            </p>
          )}
        </div>
      </fieldset>

      <div className="flex flex-col gap-4 border-t border-line pt-6">
        {isClosed && (
          <p className="notice">
            Our office is closed right now. We&apos;ll reply after we open <NextOpen />.
          </p>
        )}
        {sendError && (
          <div
            role={sendError.urgent ? "alert" : "status"}
            className={cn("notice", sendError.urgent && "border-l-4 border-alert-700")}
          >
            <p>
              <strong>{sendError.text.split(". ")[0]}.</strong>{" "}
              {sendError.text.split(". ").slice(1).join(". ")}
            </p>
          </div>
        )}
        <button
          type="submit"
          className="btn btn-primary self-start max-sm:w-full"
          aria-disabled={sending || undefined}
        >
          {sending && <span className="spin" aria-hidden="true" />}
          {sending ? "Sending…" : "Send message"}
        </button>
        <p className="sr-only" aria-live="polite">
          {sending ? "Sending your message." : ""}
        </p>
      </div>
    </form>
  );
}
