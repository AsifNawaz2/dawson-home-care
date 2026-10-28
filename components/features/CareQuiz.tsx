"use client";

/**
 * Care Quiz (SPEC_FEATURES §4, COPY_CONVERSION §9, design 01-home ch. 03 card). The whole quiz
 * runs inline on Home (BUILD_DECISIONS answer 2) and on /find-care. Copy, scoring and hand-offs
 * all come from content/quiz.ts — edit the data there, not this component.
 *
 *  - Single-select (Q1, Q3, Q4): buttons with aria-pressed; choosing advances after 300 ms.
 *    No arrow-key selection (auto-advance would skip questions).
 *  - Multi-select (Q2): native checkboxes styled as cards (BUILD_DECISIONS row 20).
 *  - Q5: native <select> + optional "Which town?".
 *  - Focus moves to each new question heading; "{answer} selected. Next question." is announced.
 *  - Answers live in sessionStorage (this tab); the result CTA hands them to /free-assessment
 *    through sessionStorage — never in a URL.
 */
import Link from "next/link";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useId, useReducer, useRef, useState } from "react";
import { Check, CircleAlert, Heart, UserPlus, UserRound, Users } from "lucide-react";
import { contact, flags } from "@/content/site.config";
import {
  ASSESSMENT_PREFILL_KEY,
  QUIZ_STORAGE_KEY,
  TOWN_OTHER_MAX,
  buildResult,
  canContinue,
  emptyAnswers,
  estimatorHref,
  fill,
  questions,
  quizUi,
  recommendations,
  resultUi,
  subjectFor,
  toAssessmentPrefill,
  toGhlFields,
  type NeedId,
  type QuizAnswers,
  type QuizResult,
} from "@/content/quiz";
import { services as siteServices } from "@/content/navigation";
import { hoursPresets } from "@/content/quiz";
import { readStorage, writeStorage } from "@/lib/storage";
import { isReducedMotion } from "@/lib/motionMode";
import { cn } from "@/lib/cn";
import { NextOpen, useOfficeStatus } from "@/components/layout/OfficeStatus";
import { AssessmentButton } from "@/components/ui/AssessmentButton";
import { CostEstimator } from "@/components/features/CostEstimator";
import "@/components/forms/forms.css";

/** "Email me this plan" loads with the result (keeps the form libraries off Home's first load). */
const EmailPlan = dynamic(() => import("./EmailPlanForm"));

type Saved = { v: 1; answers: QuizAnswers; step: number; phase: "question" | "result" };
type State = {
  answers: QuizAnswers;
  step: number; // 0..4
  phase: "boot" | "resume" | "question" | "result";
};
type Action =
  | { type: "LOAD"; saved: Saved | null; town?: string | null }
  | { type: "SET"; patch: Partial<QuizAnswers> }
  | { type: "GO"; step: number }
  | { type: "RESULT" }
  | { type: "RESUME" }
  | { type: "RESTART" };

function reducer(s: State, a: Action): State {
  switch (a.type) {
    case "LOAD": {
      const saved = a.saved;
      const answers = { ...emptyAnswers, ...(saved?.answers ?? {}) };
      if (a.town) answers.town = a.town;
      if (!saved) return { answers, step: 0, phase: "question" };
      if (saved.phase === "result") return { answers, step: 4, phase: "result" };
      const hasAny =
        answers.careFor || answers.needs.length || answers.hours || answers.urgency || answers.town;
      return {
        answers,
        step: Math.min(4, Math.max(0, saved.step)),
        phase: hasAny ? "resume" : "question",
      };
    }
    case "SET":
      return { ...s, answers: { ...s.answers, ...a.patch } };
    case "GO":
      return { ...s, step: a.step, phase: "question" };
    case "RESULT":
      return { ...s, phase: "result" };
    case "RESUME":
      return { ...s, phase: "question" };
    case "RESTART":
      return { answers: emptyAnswers, step: 0, phase: "question" };
  }
}

const Q1_ICONS = [
  { Icon: Users, bg: "bg-plum-100" },
  { Icon: Heart, bg: "bg-orchid-100" },
  { Icon: UserRound, bg: "bg-leaf-100" },
  { Icon: UserPlus, bg: "bg-plum-100" },
];

const phone = contact.phone.value;

export function CareQuiz({ variant }: { variant: "home" | "page" }) {
  const [s, dispatch] = useReducer(reducer, { answers: emptyAnswers, step: 0, phase: "boot" });
  const [error, setError] = useState("");
  const [announce, setAnnounce] = useState("");
  const [pending, setPending] = useState(false);
  const headRef = useRef<HTMLHeadingElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const moved = useRef(false);
  const uid = useId();
  const H = variant === "home" ? "h3" : "h2";
  const subject = subjectFor(s.answers.careFor);

  // Boot: read this tab's saved quiz (+ ?town= preset on /find-care).
  useEffect(() => {
    let saved: Saved | null = null;
    try {
      saved = JSON.parse(readStorage("session", QUIZ_STORAGE_KEY) ?? "null") as Saved | null;
    } catch {}
    const town =
      variant === "page" ? new URLSearchParams(window.location.search).get("town") : null;
    const valid =
      town &&
      questions[4]?.kind === "select" &&
      questions[4].groups.some((g) => g.options.some((o) => o.value === town));
    dispatch({ type: "LOAD", saved, town: valid ? town : null });
  }, [variant]);

  // Save on every change (this tab only).
  useEffect(() => {
    if (s.phase === "boot") return;
    if (s.phase === "resume") return;
    const saved: Saved = {
      v: 1,
      answers: s.answers,
      step: s.step,
      phase: s.phase === "result" ? "result" : "question",
    };
    writeStorage("session", QUIZ_STORAGE_KEY, JSON.stringify(saved));
  }, [s]);

  // Focus the new heading after a change the person made.
  useEffect(() => {
    if (!moved.current || s.phase === "boot") return;
    const h = headRef.current;
    if (!h) return;
    h.focus({ preventScroll: true });
    const top = rootRef.current?.getBoundingClientRect().top ?? 0;
    if (top < 0)
      rootRef.current?.scrollIntoView({
        block: "start",
        behavior: isReducedMotion() ? "auto" : "smooth",
      });
  }, [s.step, s.phase]);

  const go = useCallback((step: number) => {
    moved.current = true;
    setError("");
    dispatch({ type: "GO", step });
  }, []);

  const q = questions[s.step]!;
  const pickSingle = (patch: Partial<QuizAnswers>, label: string) => {
    if (pending) return;
    dispatch({ type: "SET", patch });
    setAnnounce(fill(quizUi.selectedAnnouncement, subject, { answer: label }));
    setPending(true);
    window.setTimeout(
      () => {
        setPending(false);
        go(s.step + 1);
      },
      isReducedMotion() ? 0 : 300,
    );
  };

  const toggleNeed = (n: NeedId) => {
    const cur = s.answers.needs;
    dispatch({
      type: "SET",
      patch: { needs: cur.includes(n) ? cur.filter((x) => x !== n) : [...cur, n] },
    });
    if (error) setError("");
  };

  const cont = () => {
    if (!canContinue(q, s.answers)) {
      setError(q.error);
      document.getElementById(`${uid}-first`)?.focus();
      return;
    }
    if (s.step === 4) {
      moved.current = true;
      dispatch({ type: "RESULT" });
    } else go(s.step + 1);
  };

  const restart = () => {
    writeStorage("session", QUIZ_STORAGE_KEY, null);
    moved.current = true;
    dispatch({ type: "RESTART" });
    setAnnounce(quizUi.restartAnnouncement);
  };

  if (s.phase === "boot") {
    return <div className="min-h-[420px]" aria-hidden="true" />;
  }

  const progress = (
    <div className="flex flex-col gap-3">
      <div className="flex min-h-12 items-center justify-between">
        <p className="sm font-semibold text-plum-800">
          {fill(quizUi.progress, subject, { n: String(s.step + 1) })}
        </p>
        {s.step > 0 && s.phase === "question" && (
          <button type="button" className="link sm" onClick={() => go(s.step - 1)}>
            ← {quizUi.backLabel}
          </button>
        )}
      </div>
      <div
        aria-hidden="true"
        className="h-2 overflow-hidden rounded-full border-[1.5px] border-muted"
      >
        <div
          className="h-full bg-plum-800 transition-[width] duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)] reduce-motion:transition-none"
          style={{ width: `${((s.step + 1) / 5) * 100}%` }}
        />
      </div>
    </div>
  );

  return (
    <div
      ref={rootRef}
      className="flex scroll-mt-[calc(var(--header-h)+24px)] flex-col gap-6"
      data-hides-mobile-bar=""
    >
      <p className="sr-only" aria-live="polite">
        {announce}
      </p>

      {s.phase === "resume" && (
        <div className="banner flex-wrap" aria-live="polite">
          <p className="font-semibold text-plum-800">{quizUi.resume.text}</p>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              className="btn btn-secondary !min-h-12 !px-5"
              onClick={() => {
                moved.current = true;
                dispatch({ type: "RESUME" });
              }}
            >
              {quizUi.resume.continueLabel}
            </button>
            <button type="button" className="btn btn-ghost !min-h-12 !px-5" onClick={restart}>
              {quizUi.resume.restartLabel}
            </button>
          </div>
        </div>
      )}

      {s.phase !== "result" && s.phase !== "resume" && (
        <>
          {progress}
          <div key={s.step} className="quiz-q flex flex-col gap-6">
            {q.kind === "multi" ? (
              <fieldset
                className="m-0 flex flex-col gap-6 border-0 p-0"
                aria-describedby={error ? `${uid}-err` : `${uid}-help`}
              >
                <legend className="mb-6 flex flex-col gap-1.5">
                  <H ref={headRef} tabIndex={-1} className="h3 outline-none">
                    {fill(q.title, subject)}
                  </H>
                  <span id={`${uid}-help`} className="sm muted">
                    {q.helper}
                  </span>
                </legend>
                <div className="grid gap-4 sm:grid-cols-2">
                  {q.options.map((o, i) => (
                    <label key={o.value} className="ans ans-check">
                      <input
                        type="checkbox"
                        id={i === 0 ? `${uid}-first` : undefined}
                        checked={s.answers.needs.includes(o.value)}
                        onChange={() => toggleNeed(o.value)}
                      />
                      <span className="flex flex-1 flex-col">
                        {o.label}
                        {o.helper && <span className="ans-sub">{o.helper}</span>}
                      </span>
                      <span className="ans-tick" aria-hidden="true">
                        <Check size={18} strokeWidth={3} />
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>
            ) : (
              <>
                <div className="flex flex-col gap-1.5">
                  <H ref={headRef} tabIndex={-1} id={`${uid}-h`} className="h3 outline-none">
                    {fill(q.title, subject)}
                  </H>
                  <p id={`${uid}-help`} className="sm muted">
                    {fill(q.helper, subject)}
                  </p>
                </div>
                {q.kind === "single" && (
                  <div
                    role="group"
                    aria-labelledby={`${uid}-h`}
                    className={cn("grid gap-4", q.id !== "hours" && "sm:grid-cols-2")}
                  >
                    {q.options.map((o, i) => {
                      const value = o.value;
                      const pressed =
                        (q.id === "careFor" && s.answers.careFor === value) ||
                        (q.id === "hours" && s.answers.hours === value) ||
                        (q.id === "urgency" && s.answers.urgency === value);
                      const icon = q.id === "careFor" ? Q1_ICONS[i] : null;
                      return (
                        <button
                          key={value}
                          type="button"
                          className="ans"
                          aria-pressed={pressed}
                          onClick={() =>
                            pickSingle(
                              q.id === "careFor"
                                ? { careFor: value as QuizAnswers["careFor"] }
                                : q.id === "hours"
                                  ? { hours: value as QuizAnswers["hours"] }
                                  : { urgency: value as QuizAnswers["urgency"] },
                              o.label,
                            )
                          }
                        >
                          {icon && (
                            <span
                              aria-hidden="true"
                              className={cn(
                                "flex size-14 flex-none items-center justify-center rounded-2xl text-plum-800",
                                icon.bg,
                              )}
                            >
                              <icon.Icon size={28} strokeWidth={1.75} />
                            </span>
                          )}
                          <span className="flex flex-1 flex-col">
                            {o.label}
                            {o.helper && <span className="ans-sub">{o.helper}</span>}
                          </span>
                          {pressed && (
                            <Check
                              aria-hidden
                              size={24}
                              strokeWidth={2.25}
                              className="flex-none text-plum-800"
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
                {q.kind === "select" && (
                  <div className="flex flex-col gap-5">
                    <div className="fld">
                      <label htmlFor={`${uid}-first`} className="lbl">
                        {q.label}
                      </label>
                      <select
                        id={`${uid}-first`}
                        className="field"
                        value={s.answers.town ?? ""}
                        aria-invalid={!!error || undefined}
                        aria-describedby={error ? `${uid}-err` : undefined}
                        onChange={(e) => {
                          dispatch({ type: "SET", patch: { town: e.target.value || null } });
                          setError("");
                        }}
                      >
                        <option value="">{q.emptyOption}</option>
                        {q.groups.map((g) => (
                          <optgroup key={g.label} label={g.label}>
                            {g.options.map((o) => (
                              <option key={o.value} value={o.value}>
                                {o.label}
                              </option>
                            ))}
                          </optgroup>
                        ))}
                        {q.extraOptions.map((o) => (
                          <option key={o.value} value={o.value}>
                            {o.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    {s.answers.town === "other" && (
                      <div className="fld">
                        <label htmlFor={`${uid}-other`} className="lbl">
                          {q.otherLabel}
                        </label>
                        <input
                          id={`${uid}-other`}
                          className="field"
                          type="text"
                          autoComplete="address-level2"
                          maxLength={TOWN_OTHER_MAX}
                          value={s.answers.townOther}
                          aria-describedby={`${uid}-other-help`}
                          onChange={(e) =>
                            dispatch({ type: "SET", patch: { townOther: e.target.value } })
                          }
                        />
                        <p id={`${uid}-other-help`} className="help">
                          {q.otherHelper}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
            {error && (
              <p id={`${uid}-err`} role="alert" className="emsg">
                <CircleAlert aria-hidden size={20} strokeWidth={1.75} className="flex-none" />
                {error}
              </p>
            )}
            {q.kind !== "single" && (
              <button
                type="button"
                className="btn btn-primary self-start max-sm:w-full"
                aria-disabled={!canContinue(q, s.answers) || undefined}
                onClick={cont}
              >
                {q.kind === "select" ? quizUi.finalLabel : quizUi.continueLabel}
              </button>
            )}
          </div>
        </>
      )}

      {s.phase === "result" && (
        <QuizResultView
          answers={s.answers}
          headRef={headRef}
          H={H}
          onChange={() => go(0)}
          onRestart={restart}
        />
      )}
    </div>
  );
}

function QuizResultView({
  answers,
  headRef,
  H,
  onChange,
  onRestart,
}: {
  answers: QuizAnswers;
  headRef: React.RefObject<HTMLHeadingElement | null>;
  H: "h2" | "h3";
  onChange: () => void;
  onRestart: () => void;
}) {
  const r: QuizResult = buildResult(answers);
  const { isClosed } = useOfficeStatus();
  const H4 = H === "h2" ? "h3" : "h4";
  const exploring = answers.urgency === "exploring";
  const handOff = () => {
    writeStorage(
      "session",
      ASSESSMENT_PREFILL_KEY,
      JSON.stringify({ ...toAssessmentPrefill(answers, r), ghl: toGhlFields(answers, r) }),
    );
  };
  const preset = answers.hours && answers.hours !== "not-sure" ? hoursPresets[answers.hours] : null;

  const email = <EmailPlan answers={answers} result={r} H4={H4} />;

  return (
    <div className="quiz-result flex flex-col gap-6">
      <div className="flex items-center gap-3" aria-hidden="true">
        <span className="flex size-9 flex-none items-center justify-center rounded-full bg-plum-800 text-leaf-500">
          <Check size={20} strokeWidth={3} />
        </span>
        <div className="h-2 flex-1 rounded-full bg-plum-800" />
      </div>
      <div className="flex flex-col gap-2.5">
        <H ref={headRef} tabIndex={-1} className="h3 !text-[1.875rem] outline-none">
          {r.headline}
        </H>
        <p>{r.intro}</p>
      </div>

      {r.primary && (
        <div className="flex flex-col gap-2.5 rounded-[20px] border-2 border-plum-800 bg-orchid-100 p-6 lg:p-7">
          <p className="eyebrow">{resultUi.primaryLabel}</p>
          <H4 className="h3">{r.primary.name}</H4>
          <p className="font-semibold text-plum-800">{r.primary.promise}</p>
          <p>{r.primary.intro}</p>
          <ul className="flex flex-col gap-1.5">
            {r.primary.bullets.map((b) => (
              <li key={b} className="flex items-start gap-2.5">
                <Check
                  aria-hidden
                  size={20}
                  strokeWidth={2.25}
                  className="mt-1 flex-none text-leaf-700"
                />
                {b}
              </li>
            ))}
          </ul>
          {!r.primary.confirmed && flags.showPlaceholders && (
            <p className="sm">
              <span className="tbc">[Hospice/palliative support — to confirm]</span>
            </p>
          )}
          <p className="mt-1.5 font-semibold text-plum-800">{resultUi.whyLabel}</p>
          <ul className="flex list-disc flex-col gap-1 pl-5">
            {r.primary.reasons.map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>
          <Link className="link" href={r.primary.href} data-cursor-label="Open">
            {r.primary.linkLabel}
          </Link>
        </div>
      )}
      {r.also.length > 0 && (
        <>
          <H4 className="h3 !text-h4">{resultUi.alsoHeading}</H4>
          <div className="grid gap-4 sm:grid-cols-2">
            {r.also.map((a) => (
              <div
                key={a.id}
                className="flex flex-col gap-1.5 rounded-2xl border border-line bg-white p-5"
              >
                <p className="font-bold text-plum-800">{a.name}</p>
                {a.reasons[0] && <p className="sm">{a.reasons[0]}</p>}
                <Link className="link sm" href={a.href}>
                  {a.linkLabel}
                </Link>
              </div>
            ))}
          </div>
        </>
      )}
      {r.kind === "not-sure" && (
        <>
          <H4 className="h3 !text-h4">{resultUi.notSure.listHeading}</H4>
          <div className="flex flex-col gap-3">
            {siteServices.map((sv) => (
              <div
                key={sv.slug}
                className="flex flex-col gap-1 rounded-2xl border border-line px-5 py-4"
              >
                <p className="font-bold text-plum-800">{sv.name}</p>
                <p className="sm">{sv.promise}</p>
                <Link className="link sm" href={sv.href}>
                  {recommendations[sv.slug].linkLabel}
                </Link>
              </div>
            ))}
          </div>
        </>
      )}
      {r.notes.map((n) => (
        <p key={n} className="sm rounded-xl bg-plum-100 px-[18px] py-3.5">
          {n}
        </p>
      ))}
      <p className="sm muted">{resultUi.nonMedical}</p>

      <div className="flex flex-col gap-1.5">
        <H4 className="h3 !text-h4">{resultUi.hoursHeading}</H4>
        <p>{r.hours.text}</p>
        <p className="sm muted">{resultUi.hoursNote}</p>
      </div>

      {preset && (
        <div className="flex flex-col gap-3">
          <H4 className="h3 !text-h4">{resultUi.costHeading}</H4>
          <CostEstimator
            variant="compact"
            source="quiz"
            initial={{
              hoursPerVisit: preset.hoursPerVisit,
              daysPerWeek: preset.daysPerWeek,
              overnight: preset.overnight,
            }}
            links={[{ label: resultUi.costLink, href: estimatorHref(answers.hours) }]}
          />
        </div>
      )}

      {r.town && (
        <p>
          {r.town.text}{" "}
          {r.town.link && (
            <Link className="link !inline !min-h-0" href={r.town.link.href}>
              {r.town.link.label}
            </Link>
          )}
        </p>
      )}

      {r.urgency && (
        <div className="flex flex-col gap-1.5">
          <H4 className="h3 !text-h4">{r.urgency.heading}</H4>
          {answers.urgency === "asap" && isClosed ? (
            <p>
              Our office is closed right now. Request a callback and we&apos;ll reach you first
              thing <NextOpen />.
            </p>
          ) : answers.urgency === "asap" ? (
            <p>
              The quickest way to start is a phone call. Our office is open now:{" "}
              <a href={`tel:${phone.tel}`}>{phone.display}</a>.
            </p>
          ) : (
            <p>{r.urgency.text}</p>
          )}
          {r.urgency.safety && <p className="sm muted">{r.urgency.safety}</p>}
        </div>
      )}

      {exploring && email}

      <div className="flex flex-col gap-3 border-t border-line pt-5">
        <H4 className="h3 !text-h4">{resultUi.cta.heading}</H4>
        <p>{fill(resultUi.cta.text, r.subject)}</p>
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
          <AssessmentButton
            href="/free-assessment?from=quiz"
            onNavigate={handOff}
            className="max-sm:w-full"
          />
          <a
            className="btn btn-ghost max-sm:w-full"
            href={`tel:${phone.tel}`}
            data-cursor-label="Call"
          >
            {resultUi.cta.secondary}
          </a>
        </div>
        <p className="sm muted">{resultUi.cta.helper}</p>
      </div>

      {!exploring && email}

      <div className="flex flex-wrap gap-6">
        <button type="button" className="link sm" onClick={onChange}>
          {resultUi.changeAnswers}
        </button>
        <button type="button" className="link sm" onClick={onRestart}>
          {resultUi.startOver}
        </button>
      </div>
    </div>
  );
}
