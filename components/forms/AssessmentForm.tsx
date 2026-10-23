"use client";

/**
 * Free assessment — 5-step form (design 04-free-assessment, COPY_CONVERSION §3, §8).
 *
 *  - react-hook-form + the shared zod schema (lib/schemas/assessment.ts, also used by /api/lead).
 *  - Errors on blur or Continue/Send, never mid-typing; 2px alert-700 + icon + words
 *    (BRAND_FINAL §1.6); an error summary with links on Continue; focus to the step heading on
 *    every step change and a polite "Step n of 5" announcement.
 *  - Progress saved to sessionStorage (this tab only); a "Welcome back" banner offers Start over.
 *  - Prefill from the quiz (sessionStorage), service pages (?service, ?needs), the estimator
 *    (?hours&days) and town pages (?town). Nothing sensitive ever goes in a URL.
 *  - SMS consents exactly as COPY_LEGAL §1: separate, unchecked, optional, links outside labels.
 */
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { useForm, useWatch, type FieldPath } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Bath,
  CircleHelp,
  Clock,
  Coffee,
  CookingPot,
  Heart,
  HeartHandshake,
  MessagesSquare,
  Moon,
  UserPlus,
  UserRound,
  Users,
} from "lucide-react";
import { contact, flags, sms } from "@/content/site.config";
import {
  ASSESSMENT_STORAGE_KEY,
  STEP_NAMES,
  THANKYOU_KEY,
  bestTimeOptions,
  careForOptions,
  contactOptions,
  hoursOptions,
  isExtendedTown,
  serviceOptions,
  startOptions,
  townGroups,
  townLabel,
  type ServiceValue,
} from "@/content/assessment";
import { CURRENT_SMS_CONSENT, smsConsent } from "@/content/legal/consent";
import { ASSESSMENT_PREFILL_KEY, type AssessmentPrefill } from "@/content/quiz";
import { services as serviceNav } from "@/content/navigation";
import {
  STEP_FIELDS,
  assessmentSchema,
  emptyAssessment,
  type AssessmentValues,
} from "@/lib/schemas/assessment";
import { emailSuggestion, looksLikeDob, sendMsg, summaryTitle } from "@/lib/formMessages";
import { formatPhone } from "@/lib/phone";
import { readStorage, writeStorage } from "@/lib/storage";
import { isReducedMotion } from "@/lib/motionMode";
import { cn } from "@/lib/cn";
import { NextOpen, useOfficeStatus } from "@/components/layout/OfficeStatus";
import { readNeeds } from "@/components/services/FitChecklist";
import {
  CheckIcon,
  ErrorSummary,
  FieldError,
  HeartbeatProgress,
  joinAnd,
  type SummaryItem,
} from "./FormBits";

type Name = FieldPath<AssessmentValues>;
type Banner =
  | { kind: "quiz" }
  | { kind: "service"; name: string }
  | { kind: "needs"; name: string }
  | { kind: "estimate"; weekly: number }
  | { kind: "town"; name: string }
  | { kind: "resume" }
  | null;

const phone = contact.phone.value;
const consent = smsConsent[CURRENT_SMS_CONSENT];

const CARE_ICONS = { parent: Users, spouse: Heart, self: UserRound, "someone-else": UserPlus };
const SERVICE_ICONS: Record<ServiceValue, typeof Bath> = {
  "personal-care": Bath,
  "home-help": CookingPot,
  companionship: MessagesSquare,
  "respite-care": Coffee,
  "24-hour-care": Moon,
  "hospice-support": HeartHandshake,
  "not-sure": CircleHelp,
};

/** The element to focus for a field (radio/checkbox groups → their first option). */
const targetId = (name: Name) =>
  ({
    care_for: "care_for-parent",
    services: "services-personal-care",
    start_timing: "start_timing-asap",
    hours_preset: "hours_preset-few-hours-week",
    preferred_contact: "preferred_contact-call",
  })[name as string] ?? name;

type Stored = { values: AssessmentValues; step: number; weekly?: number | null };

export function AssessmentForm() {
  const router = useRouter();
  const { isClosed } = useOfficeStatus();
  const [step, setStep] = useState(0);
  const [banner, setBanner] = useState<Banner>(null);
  const [summary, setSummary] = useState<SummaryItem[] | null>(null);
  const [announce, setAnnounce] = useState("");
  const [sendState, setSendState] = useState<"idle" | "sending" | "sent">("idle");
  const [sendError, setSendError] = useState<{ text: string; urgent: boolean } | null>(null);
  const [estimateWeekly, setEstimateWeekly] = useState<number | null>(null);
  const [dobNote, setDobNote] = useState(false);
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const meta = useRef({
    prefill_source: "",
    service_page_needs: "",
    payment_interest: "",
    after_hours: false,
    estimator: {} as Record<string, string>,
    quiz: {} as Record<string, string>,
  });
  const headingRef = useRef<HTMLHeadingElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const moved = useRef(false);
  const uid = useId();

  const {
    register,
    control,
    trigger,
    getValues,
    setValue,
    setError,
    reset,
    getFieldState,
    formState: { errors },
  } = useForm<AssessmentValues>({
    resolver: zodResolver(assessmentSchema),
    defaultValues: emptyAssessment,
    mode: "onTouched",
    reValidateMode: "onChange",
  });
  const v = useWatch({ control });
  const self = v.care_for === "self";
  const lovedOne = v.client_first_name?.trim() || "your loved one";

  // ---------- Restore + prefill (once) ----------
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- one-time restore on mount */
    let stored: Stored | null = null;
    try {
      stored = JSON.parse(
        readStorage("session", ASSESSMENT_STORAGE_KEY) ?? "null",
      ) as Stored | null;
    } catch {}
    const values: AssessmentValues = { ...emptyAssessment, ...(stored?.values ?? {}) };
    const q = new URLSearchParams(window.location.search);
    let next: Banner = null;
    if (stored?.weekly) setEstimateWeekly(stored.weekly);

    if (q.get("from") === "quiz") {
      try {
        const p = JSON.parse(readStorage("session", ASSESSMENT_PREFILL_KEY) ?? "null") as
          (AssessmentPrefill & { ghl?: Record<string, string> }) | null;
        if (p) {
          if (p.care_for) values.care_for = p.care_for;
          values.services = p.services.filter((s) =>
            serviceOptions.some((o) => o.value === s),
          ) as AssessmentValues["services"];
          if (p.hours) values.hours_preset = p.hours;
          if (p.start_timing) values.start_timing = p.start_timing;
          if (p.town) values.town = p.town;
          values.town_other = p.town_other;
          values.coming_from_hospital = p.coming_from_hospital;
          meta.current.quiz = p.ghl ?? {};
          meta.current.prefill_source = "quiz";
          next = { kind: "quiz" };
        }
      } catch {}
    }
    const slug = q.get("service");
    const svc = serviceNav.find((s) => s.slug === slug);
    if (svc) {
      if (!values.services.includes(svc.slug)) {
        values.services = [...values.services.filter((s) => s !== "not-sure"), svc.slug];
      }
      const needs = q.get("needs") || readNeeds()[svc.slug]?.join(",") || "";
      meta.current.service_page_needs = needs;
      meta.current.prefill_source ||= "service-page";
      next ??= q.get("needs")
        ? { kind: "needs", name: svc.name }
        : { kind: "service", name: svc.name };
    }
    const hours = Number(q.get("hours"));
    const days = Number(q.get("days"));
    if (hours > 0 && days > 0) {
      const weekly = Math.round(hours * days);
      setEstimateWeekly(weekly);
      values.hours_preset = "estimate";
      meta.current.estimator = {
        hours: String(hours),
        days: String(days),
        overnight: q.get("overnight") ?? "0",
      };
      meta.current.prefill_source ||= "estimator";
      next ??= { kind: "estimate", weekly };
    }
    const town = q.get("town");
    if (town && townGroups.some((g) => g.options.some((o) => o.value === town))) {
      values.town = town;
      meta.current.prefill_source ||= "town-page";
      next ??= { kind: "town", name: townLabel(town) };
    }
    const pay = q.get("pay");
    if (pay) meta.current.payment_interest = pay.slice(0, 60);
    meta.current.after_hours = q.get("after_hours") === "true";

    const hadProgress =
      !!stored &&
      (stored.step > 0 || JSON.stringify(stored.values) !== JSON.stringify(emptyAssessment));
    reset(values);
    if (hadProgress && !next) {
      setStep(Math.min(4, Math.max(0, stored!.step)));
      next = { kind: "resume" };
    }
    setBanner(next);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [reset]);

  // ---------- Save progress (this tab only) ----------
  useEffect(() => {
    if (sendState === "sent") return;
    const { website: _hp, ...rest } = getValues();
    void _hp;
    writeStorage(
      "session",
      ASSESSMENT_STORAGE_KEY,
      JSON.stringify({ values: rest, step, weekly: estimateWeekly }),
    );
  }, [v, step, getValues, sendState, estimateWeekly]);

  // ---------- Focus the step heading after a step change ----------
  useEffect(() => {
    if (!moved.current) return;
    headingRef.current?.focus();
    headingRef.current?.scrollIntoView({
      block: "start",
      behavior: isReducedMotion() ? "auto" : "smooth",
    });
    setAnnounce(`Step ${step + 1} of 5: ${headingRef.current?.textContent ?? ""}.`);
  }, [step]);

  useEffect(() => {
    if (summary) summaryRef.current?.focus();
  }, [summary]);

  const goTo = useCallback((s: number, focusField?: string) => {
    moved.current = true;
    setSummary(null);
    setStep(s);
    if (focusField) {
      requestAnimationFrame(() =>
        requestAnimationFrame(() => document.getElementById(focusField)?.focus()),
      );
    }
  }, []);

  const next = async () => {
    const fields = STEP_FIELDS[step]! as Name[];
    const ok = await trigger(fields, { shouldFocus: false });
    if (ok) goTo(step + 1);
    else setSummary(collectFresh(fields));
  };

  const collectFresh = (names: Name[]): SummaryItem[] =>
    names.flatMap((n) => {
      const m = getFieldState(n).error?.message;
      return m ? [{ target: targetId(n), message: m }] : [];
    });

  const send = async () => {
    setSendError(null);
    const ok = await trigger(undefined, { shouldFocus: false });
    if (!ok) {
      const all = STEP_FIELDS.flat() as Name[];
      const items = collectFresh(all);
      const firstBad = STEP_FIELDS.findIndex((f) => collectFresh(f as Name[]).length > 0);
      if (firstBad >= 0 && firstBad < 4) {
        goTo(firstBad);
        setSummary(collectFresh(STEP_FIELDS[firstBad]! as Name[]));
      } else setSummary(items);
      return;
    }
    if (typeof navigator !== "undefined" && navigator.onLine === false) {
      setSendError({ text: sendMsg.offline, urgent: false });
      return;
    }
    const afterHours = isClosed || meta.current.after_hours;
    setSendState("sending");
    try {
      const values = getValues();
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          values,
          meta: {
            form_type: "assessment",
            prefill_source: meta.current.prefill_source,
            service_page_needs: meta.current.service_page_needs,
            payment_interest: meta.current.payment_interest,
            after_hours: afterHours,
            hours_per_week: values.hours_preset === "estimate" ? estimateWeekly : null,
            estimator: meta.current.estimator,
            quiz: meta.current.quiz,
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
            form: afterHours ? "callback" : "assessment",
            reachVerb,
          }),
        );
        writeStorage("session", ASSESSMENT_STORAGE_KEY, null);
        writeStorage("session", ASSESSMENT_PREFILL_KEY, null);
        window.setTimeout(
          () => router.push(`/thank-you?form=${afterHours ? "callback" : "assessment"}`),
          isReducedMotion() ? 0 : 650,
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
        setSendError({
          text: afterHours ? sendMsg.failedClosed : sendMsg.failedOpen,
          urgent: true,
        });
    } catch {
      setSendState("idle");
      setSendError({ text: isClosed ? sendMsg.failedClosed : sendMsg.failedOpen, urgent: true });
    }
  };

  const startOver = () => {
    writeStorage("session", ASSESSMENT_STORAGE_KEY, null);
    reset(emptyAssessment);
    setBanner(null);
    goTo(0);
  };

  const err = (n: Name) => (errors as Record<string, { message?: string } | undefined>)[n]?.message;
  const desc = (n: Name, ...ids: string[]) =>
    [...ids, err(n) ? `${n}-err` : ""].filter(Boolean).join(" ") || undefined;

  const toggleService = (val: ServiceValue) => {
    const cur = (getValues("services") ?? []) as ServiceValue[];
    let nextVals: ServiceValue[];
    if (cur.includes(val)) nextVals = cur.filter((s) => s !== val);
    else if (val === "not-sure") nextVals = ["not-sure"];
    else nextVals = [...cur.filter((s) => s !== "not-sure"), val];
    setValue("services", nextVals as AssessmentValues["services"], {
      shouldValidate: !!err("services"),
      shouldDirty: true,
    });
  };

  // ---------- Summary rows (Step 5) ----------
  const careLabel = careForOptions.find((o) => o.value === v.care_for)?.label ?? "";
  const hoursLabel =
    v.hours_preset === "estimate"
      ? `About ${estimateWeekly ?? "—"} hours a week`
      : (hoursOptions.find((o) => o.value === v.hours_preset)?.label ?? "");
  const contactLabel = contactOptions.find((o) => o.value === v.preferred_contact)?.label ?? "";
  const rows: { label: string; value: string; aria: string; step: number; field: string }[] = [
    {
      label: "Care is for",
      value:
        careLabel + (!self && v.client_first_name?.trim() ? `, ${v.client_first_name.trim()}` : ""),
      aria: "Change who the care is for",
      step: 0,
      field: targetId("care_for"),
    },
    {
      label: "Town",
      value: townLabel(v.town ?? "", v.town_other),
      aria: "Change town",
      step: 0,
      field: "town",
    },
    {
      label: "Help with",
      value: joinAnd(
        (v.services ?? []).map((s) => serviceOptions.find((o) => o.value === s)?.title ?? s),
      ),
      aria: "Change help",
      step: 1,
      field: targetId("services"),
    },
    {
      label: "Start",
      value: startOptions.find((o) => o.value === v.start_timing)?.label ?? "",
      aria: "Change start",
      step: 2,
      field: targetId("start_timing"),
    },
    {
      label: "Hours",
      value: hoursLabel,
      aria: "Change hours",
      step: 2,
      field: v.hours_preset === "estimate" ? "hours_preset-estimate" : targetId("hours_preset"),
    },
    {
      label: "Your name",
      value: `${v.first_name ?? ""} ${v.last_name ?? ""}`.trim(),
      aria: "Change your name",
      step: 3,
      field: "first_name",
    },
    {
      label: "Reach you by",
      value: `${contactLabel} at ${v.preferred_contact === "email" ? v.email : v.phone}`,
      aria: "Change how we reach you",
      step: 3,
      field: targetId("preferred_contact"),
    },
    ...(v.best_time
      ? [
          {
            label: "Best time",
            value: bestTimeOptions.find((o) => o.value === v.best_time)?.label ?? "",
            aria: "Change best time",
            step: 3,
            field: `best_time-${v.best_time}`,
          },
        ]
      : []),
    ...(v.notes?.trim()
      ? [
          {
            label: "Notes",
            value:
              v.notes.trim().length > 120 ? `${v.notes.trim().slice(0, 120)}…` : v.notes.trim(),
            aria: "Change notes",
            step: 3,
            field: "notes",
          },
        ]
      : []),
  ];

  const notesLeft = 1000 - (v.notes?.length ?? 0);
  const final = step === 4;
  const sending = sendState === "sending";

  return (
    <>
      {banner && (
        <div className="banner mb-6 flex-wrap" aria-live="polite">
          {banner.kind === "resume" ? (
            <>
              <p className="font-semibold text-plum-800">Welcome back. We kept your answers.</p>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  className="btn btn-secondary !min-h-12 !px-5"
                  onClick={() => {
                    setBanner(null);
                    goTo(step);
                  }}
                >
                  Pick up where I left off
                </button>
                <button type="button" className="btn btn-ghost !min-h-12 !px-5" onClick={startOver}>
                  Start over
                </button>
              </div>
            </>
          ) : (
            <>
              <p>
                <span aria-hidden="true" className="bdot">
                  <CheckIcon size={14} />
                </span>
                <span>
                  {banner.kind === "quiz" &&
                    "We've filled in your quiz answers. Check them as you go."}
                  {banner.kind === "service" && (
                    <>
                      We&apos;ve ticked <strong>{banner.name}</strong> for you. Add anything else
                      that might help.
                    </>
                  )}
                  {banner.kind === "needs" && (
                    <>We&apos;ve noted what you ticked on the {banner.name} page.</>
                  )}
                  {banner.kind === "estimate" && (
                    <>We&apos;ve added your estimate: about {banner.weekly} hours a week.</>
                  )}
                  {banner.kind === "town" && <>We&apos;ve filled in {banner.name}.</>}
                </span>
              </p>
              <button
                type="button"
                className="link sm !min-h-11 flex-none px-1"
                onClick={() => setBanner(null)}
              >
                Dismiss
              </button>
            </>
          )}
        </div>
      )}

      <section aria-labelledby="step-h" className="scroll-mt-[calc(var(--header-h)+24px)]">
        <form
          id="form"
          className="fcard"
          aria-labelledby="step-h"
          noValidate
          data-hides-mobile-bar=""
          onSubmit={(e) => {
            e.preventDefault();
            if (final) void send();
            else void next();
          }}
        >
          {sendState === "sent" ? (
            <div className="flex flex-col items-start gap-4">
              <span aria-hidden="true">
                <svg width="88" height="88" viewBox="0 0 88 88" fill="none">
                  <circle
                    cx="44"
                    cy="44"
                    r="40"
                    strokeWidth="3"
                    className="fill-leaf-100 stroke-leaf-500"
                  />
                  <path
                    className="okpath stroke-leaf-700"
                    d="M8 46 H26 L32 38 L38 52 L44 46 L58 60 L76 30"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <h2 id="step-h" ref={headingRef} tabIndex={-1} className="sh">
                Sent. Thank you.
              </h2>
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-2.5">
                <p className="sm font-semibold text-plum-800">
                  Step {step + 1} of 5 · {STEP_NAMES[step]}
                </p>
                <HeartbeatProgress fraction={(step + 1) / 5} labels={STEP_NAMES} current={step} />
              </div>
              <p className="sr-only" aria-live="polite">
                {announce}
              </p>

              {summary && summary.length > 0 && (
                <div className="mt-7">
                  <ErrorSummary
                    ref={summaryRef}
                    title={summaryTitle(summary.length, final)}
                    items={summary}
                  />
                </div>
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

              {/* ===== STEP 1 ===== */}
              {step === 0 && (
                <div className="fstep mt-7">
                  <h2 id="step-h" ref={headingRef} tabIndex={-1} className="sh">
                    Who needs care?
                  </h2>
                  <fieldset className="fs" aria-describedby={desc("care_for")}>
                    <legend className="lbl mb-3">Who is the care for? (required)</legend>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {careForOptions.map((o) => {
                        const Icon = CARE_ICONS[o.value];
                        return (
                          <label key={o.value} className="opt" data-err={!!err("care_for")}>
                            <input
                              type="radio"
                              id={`care_for-${o.value}`}
                              value={o.value}
                              {...register("care_for")}
                            />
                            <span className="oic" aria-hidden="true">
                              <Icon size={26} strokeWidth={1.75} />
                            </span>
                            <span className="otl">{o.label}</span>
                            <span className="ock" aria-hidden="true">
                              <CheckIcon />
                            </span>
                          </label>
                        );
                      })}
                    </div>
                    <FieldError id="care_for-err" message={err("care_for")} />
                  </fieldset>
                  {!self && (
                    <div className="fld">
                      <label className="lbl" htmlFor="client_first_name">
                        Their first name
                      </label>
                      <p id="client_first_name-help" className="help">
                        So we know who we&apos;re talking about. First name is plenty.
                      </p>
                      <input
                        id="client_first_name"
                        className="field"
                        type="text"
                        autoComplete="off"
                        maxLength={40}
                        aria-invalid={!!err("client_first_name") || undefined}
                        aria-describedby={desc("client_first_name", "client_first_name-help")}
                        {...register("client_first_name")}
                      />
                      <FieldError id="client_first_name-err" message={err("client_first_name")} />
                    </div>
                  )}
                  <div className="fld">
                    <label className="lbl" htmlFor="town">
                      {self ? "Where do you live? (required)" : "Where do they live? (required)"}
                    </label>
                    <p id="town-help" className="help">
                      So we can check we reach {self ? "your" : "their"} town.
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
                          {townLabel(v.town)} is in our extended service area. We&apos;ll check
                          scheduling for your hours when we call.
                        </p>
                      )}
                    </div>
                  </div>
                  {v.town === "other" && (
                    <div className="fld">
                      <label className="lbl" htmlFor="town_other">
                        Which town?
                      </label>
                      <p id="town_other-help" className="help">
                        Type the town name. We&apos;ll check when we talk.
                      </p>
                      <input
                        id="town_other"
                        className="field"
                        type="text"
                        autoComplete="address-level2"
                        maxLength={60}
                        aria-describedby="town_other-help"
                        {...register("town_other")}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* ===== STEP 2 ===== */}
              {step === 1 && (
                <div className="fstep mt-7">
                  <h2 id="step-h" ref={headingRef} tabIndex={-1} className="sh">
                    {self
                      ? "What kind of help might you need?"
                      : `What kind of help might ${lovedOne} need?`}
                  </h2>
                  <fieldset className="fs" aria-describedby={desc("services", "services-help")}>
                    <legend className="lbl">Choose all that might help. (required)</legend>
                    <p id="services-help" className="help -mt-1">
                      You can change your mind later. Most families combine two or three.
                    </p>
                    <div className="mt-1.5 grid gap-3 sm:grid-cols-2">
                      {serviceOptions
                        .filter((o) => !("tbc" in o) || flags.showPlaceholders)
                        .map((o) => {
                          const Icon = SERVICE_ICONS[o.value];
                          return (
                            <label
                              key={o.value}
                              className="opt opt-tall"
                              data-err={!!err("services")}
                            >
                              <input
                                type="checkbox"
                                id={`services-${o.value}`}
                                value={o.value}
                                checked={(v.services ?? []).includes(o.value)}
                                onChange={() => toggleService(o.value)}
                              />
                              <span className="oic" aria-hidden="true">
                                <Icon size={26} strokeWidth={1.75} />
                              </span>
                              <span className="flex flex-1 flex-col gap-0.5">
                                <span className="otl">{o.title}</span>
                                <span className="osub">
                                  {"tbc" in o && (
                                    <>
                                      <span className="tbc">{o.tbc}</span>{" "}
                                    </>
                                  )}
                                  {o.line}
                                </span>
                              </span>
                              <span className="ock" aria-hidden="true">
                                <CheckIcon />
                              </span>
                            </label>
                          );
                        })}
                    </div>
                    <FieldError id="services-err" message={err("services")} />
                  </fieldset>
                  <p className="mt-1">
                    <a className="link !min-h-10" href="/find-care" data-cursor-label="Open">
                      Not sure? Take the 1-minute quiz
                    </a>{" "}
                    <span className="sm muted">Your answers here are saved.</span>
                  </p>
                  <p className="sm muted">
                    All our care is non-medical. We work alongside home health and hospice teams.
                  </p>
                </div>
              )}

              {/* ===== STEP 3 ===== */}
              {step === 2 && (
                <div className="fstep mt-7">
                  <h2 id="step-h" ref={headingRef} tabIndex={-1} className="sh">
                    When, and how much help?
                  </h2>
                  <fieldset className="fs" aria-describedby={desc("start_timing")}>
                    <legend className="lbl mb-3">
                      When would you like care to start? (required)
                    </legend>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {startOptions.map((o) => (
                        <label
                          key={o.value}
                          className="opt opt-sm"
                          data-err={!!err("start_timing")}
                        >
                          <input
                            type="radio"
                            id={`start_timing-${o.value}`}
                            value={o.value}
                            {...register("start_timing")}
                          />
                          <span className="rdot" aria-hidden="true" />
                          <span className="otl">{o.label}</span>
                        </label>
                      ))}
                    </div>
                    <FieldError id="start_timing-err" message={err("start_timing")} />
                  </fieldset>
                  <div aria-live="polite">
                    {v.start_timing === "asap" && (
                      <div className="notice flex flex-col gap-1 !text-ink">
                        {isClosed ? (
                          <p>
                            <strong className="text-plum-800">
                              Our office is closed right now.
                            </strong>{" "}
                            Keep going and we&apos;ll call you first thing <NextOpen />.
                          </p>
                        ) : (
                          <p>
                            <strong className="text-plum-800">
                              The quickest way to start is a phone call:{" "}
                              <a href={`tel:${phone.tel}`}>{phone.display}</a>.
                            </strong>{" "}
                            Or keep going — we&apos;ll call you.
                          </p>
                        )}
                        <p className="sm muted">If someone is hurt or in danger, call 911.</p>
                      </div>
                    )}
                  </div>
                  <fieldset className="fs" aria-describedby={desc("hours_preset")}>
                    <legend className="lbl mb-3">
                      How much help do you think is needed? (required)
                    </legend>
                    <div className="flex flex-col gap-2.5">
                      {[
                        ...(estimateWeekly !== null
                          ? [
                              {
                                value: "estimate",
                                label: "My estimate",
                                help: `About ${estimateWeekly} hours a week`,
                              },
                            ]
                          : []),
                        ...hoursOptions,
                      ].map((o) => (
                        <label
                          key={o.value}
                          className="opt opt-sm"
                          data-err={!!err("hours_preset")}
                        >
                          <input
                            type="radio"
                            id={`hours_preset-${o.value}`}
                            value={o.value}
                            {...register("hours_preset")}
                          />
                          <span className="rdot" aria-hidden="true" />
                          <span className="flex flex-1 flex-col">
                            <span className="otl">{o.label}</span>
                            <span className="osub">{o.help}</span>
                          </span>
                        </label>
                      ))}
                    </div>
                    <FieldError id="hours_preset-err" message={err("hours_preset")} />
                  </fieldset>
                  <div className="fld">
                    <label className="opt opt-sm !items-start">
                      <input
                        type="checkbox"
                        id="coming_from_hospital"
                        {...register("coming_from_hospital")}
                      />
                      <span className="sbox" aria-hidden="true">
                        <CheckIcon size={18} className="text-plum-950" />
                      </span>
                      <span className="font-medium">
                        {self
                          ? "I'm in the hospital or rehab now, or just came home."
                          : "They're in the hospital or rehab now, or just came home."}
                      </span>
                    </label>
                    <div aria-live="polite">
                      {v.coming_from_hospital && (
                        <p className="help">
                          Thank you. If you can, call us before discharge:{" "}
                          <a href={`tel:${phone.tel}`} className="font-semibold">
                            {phone.display}
                          </a>
                          .
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* ===== STEP 4 ===== */}
              {step === 3 && (
                <div className="fstep mt-7">
                  <div className="flex flex-col gap-1.5">
                    <h2 id="step-h" ref={headingRef} tabIndex={-1} className="sh">
                      How can we reach you?
                    </h2>
                    <p className="sm muted">
                      We&apos;ll call to talk things through and set up the visit.
                    </p>
                  </div>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="fld">
                      <label className="lbl" htmlFor="first_name">
                        Your first name (required)
                      </label>
                      <input
                        id="first_name"
                        className="field"
                        type="text"
                        autoComplete="given-name"
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
                        aria-invalid={!!err("last_name") || undefined}
                        aria-describedby={desc("last_name")}
                        {...register("last_name")}
                      />
                      <FieldError id="last_name-err" message={err("last_name")} />
                    </div>
                  </div>
                  <div className="fld">
                    <label className="lbl" htmlFor="phone">
                      Phone (required)
                    </label>
                    <p id="phone-help" className="help">
                      We&apos;ll call you on this number.
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
                        },
                      })}
                    />
                    <FieldError id="phone-err" message={err("phone")} />
                  </div>
                  <div className="fld">
                    <label className="lbl" htmlFor="email">
                      {v.preferred_contact === "email" ? "Email (required)" : "Email"}
                    </label>
                    <p id="email-help" className="help">
                      Only if you&apos;d like us to email you.
                    </p>
                    <input
                      id="email"
                      className="field"
                      type="email"
                      autoComplete="email"
                      aria-invalid={!!err("email") || undefined}
                      aria-describedby={desc("email", "email-help")}
                      {...register("email", {
                        onBlur: (e: React.FocusEvent<HTMLInputElement>) =>
                          setSuggestion(emailSuggestion(e.target.value)),
                      })}
                    />
                    <FieldError id="email-err" message={err("email")} />
                    {suggestion && (
                      <p className="help !text-plum-800">
                        Did you mean <strong>{suggestion}</strong>?{" "}
                        <button
                          type="button"
                          className="link !inline !min-h-0 font-bold"
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
                  <fieldset className="fs" aria-describedby={desc("preferred_contact")}>
                    <legend className="lbl mb-3">Best way to reach you (required)</legend>
                    <div className="grid gap-2.5 sm:grid-cols-3">
                      {contactOptions.map((o) => (
                        <label
                          key={o.value}
                          className="opt opt-sm"
                          data-err={!!err("preferred_contact")}
                        >
                          <input
                            type="radio"
                            id={`preferred_contact-${o.value}`}
                            value={o.value}
                            {...register("preferred_contact", {
                              onChange: () => {
                                if (getFieldState("email").error) void trigger("email");
                              },
                            })}
                          />
                          <span className="rdot" aria-hidden="true" />
                          <span className="otl">{o.label}</span>
                        </label>
                      ))}
                    </div>
                    <FieldError id="preferred_contact-err" message={err("preferred_contact")} />
                    <div aria-live="polite">
                      {v.preferred_contact === "text" && (
                        <p className="help">
                          We&apos;ll text you only if you tick the first box on the next step.
                          Otherwise we&apos;ll call.
                        </p>
                      )}
                    </div>
                  </fieldset>
                  <fieldset className="fs" aria-describedby="best-help">
                    <legend className="lbl">Best time to call</legend>
                    <p id="best-help" className="help -mt-1">
                      Eastern time. Our office is open Monday–Friday, 8 AM–5 PM.
                    </p>
                    <div className="mt-1.5 grid gap-2.5 sm:grid-cols-2">
                      {bestTimeOptions.map((o) => (
                        <label key={o.value} className="opt opt-sm">
                          <input
                            type="radio"
                            id={`best_time-${o.value}`}
                            value={o.value}
                            {...register("best_time")}
                          />
                          <span className="rdot" aria-hidden="true" />
                          <span className="otl">{o.label}</span>
                        </label>
                      ))}
                    </div>
                  </fieldset>
                  <div className="fld">
                    <label className="lbl" htmlFor="notes">
                      Anything else we should know?
                    </label>
                    <p id="notes-help" className="help">
                      Please don&apos;t include medical details — we&apos;ll talk about care needs
                      by phone.
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
                        It looks like this might include a date of birth. You don&apos;t need to
                        share it here — we&apos;ll ask for anything we need by phone.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* ===== STEP 5 ===== */}
              {step === 4 && (
                <div className="fstep mt-7">
                  <h2 id="step-h" ref={headingRef} tabIndex={-1} className="sh">
                    Check and send.
                  </h2>
                  <dl className="sumlist">
                    {rows.map((r) => (
                      <div key={r.label} className="sumrow">
                        <dt>{r.label}</dt>
                        <dd>{r.value}</dd>
                        <dd>
                          <button
                            type="button"
                            className="link sm !min-h-11"
                            aria-label={r.aria}
                            onClick={() => goTo(r.step, r.field)}
                          >
                            Change
                          </button>
                        </dd>
                      </div>
                    ))}
                  </dl>
                  <fieldset className="fs" aria-describedby={`${uid}-sms-help`}>
                    <legend className="h3 !text-[1.375rem]">{consent.legend}</legend>
                    <p id={`${uid}-sms-help`} className="help -mt-1">
                      {consent.helper}
                    </p>
                    {[
                      consent.transactional,
                      ...(sms.marketingEnabled ? [consent.marketing] : []),
                    ].map((box) => (
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
                    ))}
                    <div aria-live="polite">
                      {v.preferred_contact === "text" && !v.sms_transactional_consent && (
                        <p className="notice sm">
                          You chose text as the best way to reach you. To get texts, tick the first
                          box. Otherwise, we&apos;ll call.
                        </p>
                      )}
                    </div>
                  </fieldset>
                </div>
              )}

              {sendError && (
                <div
                  role={sendError.urgent ? "alert" : "status"}
                  className={cn("notice mt-6", sendError.urgent && "border-l-4 border-alert-700")}
                >
                  <p>
                    <strong>{sendError.text.split(". ")[0]}.</strong>{" "}
                    {sendError.text.split(". ").slice(1).join(". ")}
                  </p>
                </div>
              )}

              <div className="mt-8 flex flex-col-reverse items-stretch gap-3 border-t border-line pt-6 sm:flex-row sm:items-center sm:gap-4">
                {step > 0 && (
                  <button
                    type="button"
                    className="link justify-center px-2"
                    onClick={() => goTo(step - 1)}
                    disabled={sending}
                  >
                    ← Back
                  </button>
                )}
                <button
                  type="submit"
                  className="btn btn-primary sm:order-first"
                  aria-disabled={sending || undefined}
                  onClick={(e) => {
                    if (sending) e.preventDefault();
                  }}
                >
                  {sending && <span className="spin" aria-hidden="true" />}
                  {final
                    ? sending
                      ? "Sending…"
                      : isClosed
                        ? "Request my callback"
                        : "Send my request"
                    : "Continue"}
                </button>
              </div>
              <p className="sr-only" aria-live="polite">
                {sending ? "Sending your request." : ""}
              </p>
              {final ? (
                <p className="help mt-3">
                  Free, with no obligation. We never sell or share your phone number for marketing.
                </p>
              ) : (
                <p className="help mt-3">
                  Your answers are saved in this browser tab, so you can go back or take a break.
                </p>
              )}
            </>
          )}
        </form>
      </section>
    </>
  );
}

/** Small "About 2 minutes" line icon used by the hero. */
export function ClockLine({ children }: { children: React.ReactNode }) {
  return (
    <p className="sm inline-flex items-center gap-2 font-semibold text-plum-800">
      <Clock aria-hidden size={18} strokeWidth={1.75} className="text-orchid-700" />
      {children}
    </p>
  );
}
