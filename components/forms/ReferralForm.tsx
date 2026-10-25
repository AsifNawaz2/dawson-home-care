"use client";

/**
 * Fast referral form on /for-professionals (COPY_CONVERSION §5 "03", §8).
 *
 *  - Single page, three fieldsets; react-hook-form + the shared zod schema (also /api/referral).
 *  - Errors on blur or Send, never mid-typing; an error summary with links on Send.
 *  - No SMS consents (referrers choose phone or email). Permission checkbox is required.
 *  - Nothing is stored in the browser — client details stay in the form until it's sent.
 */
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { useForm, useWatch, type FieldPath } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contact, flags, service } from "@/content/site.config";
import { THANKYOU_KEY, isExtendedTown, townGroups, townLabel } from "@/content/assessment";
import {
  REFERRAL_PERMISSION,
  reachByOptions,
  referralHoursOptions,
  referralServiceOptions,
  referralStartOptions,
  roleOptions,
  type ReferralService,
} from "@/content/referral";
import {
  REFERRAL_FIELDS,
  emptyReferral,
  referralSchema,
  type ReferralValues,
} from "@/lib/schemas/referral";
import { emailSuggestion, looksLikeDob, sendMsg, summaryTitle } from "@/lib/formMessages";
import { formatPhone } from "@/lib/phone";
import { writeStorage } from "@/lib/storage";
import { isReducedMotion } from "@/lib/motionMode";
import { useHydrated } from "@/lib/useHydrated";
import { cn } from "@/lib/cn";
import { NextOpen, useOfficeStatus } from "@/components/layout/OfficeStatus";
import { CheckIcon, ErrorSummary, FieldError, type SummaryItem } from "./FormBits";

type Name = FieldPath<ReferralValues>;

const fax = contact.fax.value;
const hospice = service.hospiceSupport.confirmed && service.hospiceSupport.value;
const services = referralServiceOptions.filter(
  (o) => o.value !== "hospice-support" || hospice || flags.showPlaceholders,
);

/** The element to focus for a field (radio/checkbox groups → their first option). */
const targetId = (name: Name) =>
  ({
    role: "role-discharge-planner",
    reach_by: "reach_by-phone",
    services: "services-personal-care",
    start_timing: "start_timing-asap",
    hours_preset: "hours_preset-few-hours-week",
  })[name as string] ?? name;

export function ReferralForm() {
  const router = useRouter();
  const { isClosed } = useOfficeStatus();
  const uid = useId();
  const hydrated = useHydrated();
  const [summary, setSummary] = useState<SummaryItem[] | null>(null);
  const [sendState, setSendState] = useState<"idle" | "sending" | "sent">("idle");
  const [sendError, setSendError] = useState<{ text: string; urgent: boolean } | null>(null);
  const [dobNote, setDobNote] = useState(false);
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
  } = useForm<ReferralValues>({
    resolver: zodResolver(referralSchema),
    defaultValues: emptyReferral,
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
  const collect = (): SummaryItem[] =>
    REFERRAL_FIELDS.flatMap((n) => {
      const m = getFieldState(n as Name).error?.message;
      return m ? [{ target: targetId(n as Name), message: m }] : [];
    });

  const toggleService = (val: ReferralService) => {
    const cur = (getValues("services") ?? []) as ReferralService[];
    let next: ReferralService[];
    if (cur.includes(val)) next = cur.filter((s) => s !== val);
    else if (val === "not-sure") next = ["not-sure"];
    else next = [...cur.filter((s) => s !== "not-sure"), val];
    setValue("services", next, { shouldValidate: !!err("services"), shouldDirty: true });
  };

  const send = async () => {
    setSendError(null);
    const ok = await trigger(undefined, { shouldFocus: false });
    if (!ok) {
      setSummary(collect());
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
      const res = await fetch("/api/referral", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          values,
          meta: {
            form_type: "referral",
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
        writeStorage(
          "session",
          THANKYOU_KEY,
          JSON.stringify({
            firstName: values.referrer_first_name.trim(),
            form: "referral",
            closed: isClosed,
          }),
        );
        window.setTimeout(
          () => router.push("/thank-you?form=referral"),
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
  const notesLeft = 1000 - (v.notes?.length ?? 0);

  const text = (
    n: Name,
    label: string,
    opts: {
      help?: string;
      type?: string;
      autoComplete?: string;
      inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
      maxLength?: number;
      className?: string;
      onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
      onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
    } = {},
  ) => (
    <div className={cn("fld", opts.className)}>
      <label className="lbl" htmlFor={n}>
        {label}
      </label>
      {opts.help && (
        <p id={`${n}-help`} className="help">
          {opts.help}
        </p>
      )}
      <input
        id={n}
        className="field"
        type={opts.type ?? "text"}
        autoComplete={opts.autoComplete ?? "off"}
        inputMode={opts.inputMode}
        maxLength={opts.maxLength}
        aria-invalid={!!err(n) || undefined}
        aria-describedby={desc(n, ...(opts.help ? [`${n}-help`] : []))}
        {...register(n, { onChange: opts.onChange, onBlur: opts.onBlur })}
      />
      <FieldError id={`${n}-err`} message={err(n)} />
    </div>
  );

  const radios = (
    n: Name,
    legend: string,
    options: readonly { value: string; label: string }[],
    cols = "sm:grid-cols-2",
  ) => (
    <fieldset className="fs" aria-describedby={desc(n)}>
      <legend className="lbl mb-3">{legend}</legend>
      <div className={cn("grid gap-3", cols)}>
        {options.map((o) => (
          <label key={o.value} className="opt opt-sm" data-err={!!err(n)}>
            <input type="radio" id={`${n}-${o.value}`} value={o.value} {...register(n)} />
            <span className="rdot" aria-hidden="true" />
            <span className="otl">{o.label}</span>
          </label>
        ))}
      </div>
      <FieldError id={`${n}-err`} message={err(n)} />
    </fieldset>
  );

  return (
    <form
      className="fcard flex flex-col gap-10"
      aria-labelledby="refer-title"
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

      {/* ===== About you ===== */}
      <fieldset className="fs !gap-7">
        <legend className="sh float-left w-full">About you</legend>
        <div className="grid gap-7 sm:grid-cols-2 sm:gap-5">
          {text("referrer_first_name", "Your first name (required)", {
            autoComplete: "given-name",
            maxLength: 40,
          })}
          {text("referrer_last_name", "Your last name (required)", {
            autoComplete: "family-name",
            maxLength: 40,
          })}
        </div>
        {text("organization", "Organization (required)", {
          help: "Hospital, agency or practice.",
          autoComplete: "organization",
          maxLength: 100,
        })}
        {radios("role", "Your role (required)", roleOptions)}
        {v.role === "other" &&
          text("role_other", "Your role", { autoComplete: "organization-title", maxLength: 60 })}
        {text("referrer_phone", "Your phone (required)", {
          help: "Direct line or extension, if you have one.",
          type: "tel",
          inputMode: "tel",
          autoComplete: "tel-national",
          onChange: (e) => {
            const f = formatPhone(e.target.value);
            if (f !== e.target.value) setValue("referrer_phone", f);
          },
        })}
        <div className="flex flex-col gap-2">
          {text("referrer_email", "Your email (required)", {
            type: "email",
            inputMode: "email",
            autoComplete: "email",
            onBlur: (e) => setSuggestion(emailSuggestion(e.target.value)),
          })}
          <div aria-live="polite">
            {suggestion && (
              <p className="help !text-plum-800">
                Did you mean <strong>{suggestion}</strong>?{" "}
                <button
                  type="button"
                  className="link sm !min-h-11"
                  onClick={() => {
                    setValue("referrer_email", suggestion, { shouldValidate: true });
                    setSuggestion(null);
                  }}
                >
                  Use this
                </button>
              </p>
            )}
          </div>
        </div>
        {radios("reach_by", "Best way to reach you (required)", reachByOptions)}
      </fieldset>

      {/* ===== About the client ===== */}
      <fieldset className="fs !gap-7 border-t border-line pt-10">
        <legend className="sh float-left w-full">About the client</legend>
        <div className="grid gap-7 sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-5">
          {text("client_first_name", "Client's first name (required)", { maxLength: 40 })}
          {text("client_last_initial", "First letter of client's last name (required)", {
            help: "Just one letter.",
            maxLength: 1,
            className: "[&_.field]:!w-[calc(4ch+40px)] sm:max-w-[16rem]",
          })}
        </div>
        <div className="fld">
          <label className="lbl" htmlFor="town">
            Client&apos;s town (required)
          </label>
          <p id="town-help" className="help">
            Where care will happen.
          </p>
          <select
            id="town"
            className="field"
            aria-invalid={!!err("town") || undefined}
            aria-describedby={desc("town", "town-help")}
            {...register("town")}
          >
            <option value="">Choose a town</option>
            {townGroups.map((g) => (
              <optgroup key={g.label} label={g.label}>
                {g.options.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </optgroup>
            ))}
            <option value="other">Somewhere else</option>
            <option value="not-sure">Not sure</option>
          </select>
          <FieldError id="town-err" message={err("town")} />
          <div aria-live="polite">
            {v.town && isExtendedTown(v.town) && (
              <p className="help">
                {townLabel(v.town)} is in our extended service area. We&apos;ll check scheduling for
                the hours needed when we call.
              </p>
            )}
          </div>
        </div>
        {v.town === "other" && text("town_other", "Which town?", { maxLength: 60 })}
      </fieldset>

      {/* ===== Care needed ===== */}
      <fieldset className="fs !gap-7 border-t border-line pt-10">
        <legend className="sh float-left w-full">Care needed</legend>
        <fieldset className="fs" aria-describedby={desc("services")}>
          <legend className="lbl mb-3">Services needed (required)</legend>
          <div className="grid gap-3 md:grid-cols-2">
            {services.map((o) => {
              const checked = (v.services ?? []).includes(o.value);
              return (
                <label
                  key={o.value}
                  className="opt opt-sm !items-start"
                  data-err={!!err("services")}
                >
                  <input
                    type="checkbox"
                    id={`services-${o.value}`}
                    checked={checked}
                    onChange={() => toggleService(o.value)}
                    onBlur={() => void trigger("services")}
                  />
                  <span className="sbox" aria-hidden="true">
                    <CheckIcon size={18} className="text-plum-950" />
                  </span>
                  <span className="otl">
                    {o.label}
                    {"tbc" in o && !hospice && (
                      <>
                        {" "}
                        <span className="tbc">{o.tbc}</span>
                      </>
                    )}
                  </span>
                </label>
              );
            })}
          </div>
          <FieldError id="services-err" message={err("services")} />
        </fieldset>

        {radios("start_timing", "When should care start? (required)", referralStartOptions)}
        {v.start_timing === "date" &&
          text("start_date", "Start or discharge date (required)", {
            help: "Today or later.",
            type: "date",
            className: "sm:max-w-[20rem]",
          })}

        {radios(
          "hours_preset",
          "Hours or schedule (required)",
          referralHoursOptions,
          "sm:grid-cols-2 lg:grid-cols-3",
        )}

        {text("schedule_details", "Schedule details", {
          help: 'For example, "Mornings, Mon–Fri" or "Nights for the first two weeks."',
          maxLength: 200,
        })}

        <div className="fld">
          <label className="lbl" htmlFor="notes">
            Anything else we should know?
          </label>
          <p id="notes-help" className="help">
            Please don&apos;t include diagnoses or other medical details. We&apos;ll talk through
            care needs by phone.
          </p>
          <textarea
            id="notes"
            className="field !min-h-[132px] resize-y !py-3.5 leading-normal"
            rows={4}
            maxLength={1000}
            aria-invalid={!!err("notes") || undefined}
            aria-describedby={desc("notes", "notes-help")}
            {...register("notes", {
              onBlur: (e: React.FocusEvent<HTMLTextAreaElement>) =>
                setDobNote(looksLikeDob(e.target.value)),
            })}
          />
          <FieldError id="notes-err" message={err("notes")} />
          <p className="help" aria-live="polite">
            {notesLeft <= 200 ? `${notesLeft} characters left` : ""}
          </p>
          {dobNote && (
            <p className="notice sm">
              It looks like this might include a date of birth. You don&apos;t need to share it here
              — we&apos;ll ask for anything we need by phone.
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="opt opt-sm !items-start" data-err={!!err("permission_confirmed")}>
            <input
              type="checkbox"
              id="permission_confirmed"
              aria-invalid={!!err("permission_confirmed") || undefined}
              aria-describedby={desc("permission_confirmed")}
              {...register("permission_confirmed")}
            />
            <span className="sbox" aria-hidden="true">
              <CheckIcon size={18} className="text-plum-950" />
            </span>
            <span className="otl">{REFERRAL_PERMISSION} (required)</span>
          </label>
          <FieldError id="permission_confirmed-err" message={err("permission_confirmed")} />
        </div>
      </fieldset>

      <div className="flex flex-col gap-4 border-t border-line pt-6">
        {isClosed && (
          <p className="notice">
            Our office is closed right now. Send this and we&apos;ll pick it up first thing{" "}
            <NextOpen />.
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
          type={hydrated ? "submit" : "button"}
          className="btn btn-primary self-start max-sm:w-full"
          aria-disabled={sending || undefined}
        >
          {sending && <span className="spin" aria-hidden="true" />}
          {sending ? "Sending…" : "Send referral"}
        </button>
        <p className="sr-only" aria-live="polite">
          {sending ? "Sending your referral." : ""}
        </p>
        <p className="help">Prefer fax? Send it to {fax.display}.</p>
        <p className="help">
          How we handle this information: <Link href="/privacy-policy">Privacy Policy</Link>
        </p>
      </div>
    </form>
  );
}
