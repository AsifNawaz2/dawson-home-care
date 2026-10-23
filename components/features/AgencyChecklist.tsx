"use client";

/**
 * "Questions to ask any home care agency" (COPY_COST_FAQ §03; data: content/payments.ts).
 * Native checkboxes in the service-page tick style; ticks saved to sessionStorage
 * (`agency_questions_ticked`), never sent. "Show Dawson's answers" reveals our answer under each
 * question. "Print as a comparison sheet" prints a neutral sheet (no Dawson answers) with three
 * blank agency columns.
 */
import { useEffect, useId, useState } from "react";
import { Check, Printer } from "lucide-react";
import {
  agencyQuestionGroups,
  agencyQuestions,
  ourAnswerFallback,
  type AgencyQuestionGroup,
} from "@/content/payments";
import { visibleBlocks } from "@/content/blocks";
import { contact } from "@/content/site.config";
import { readStorage, writeStorage } from "@/lib/storage";
import { Blocks } from "@/components/ui/Blocks";

const KEY = "agency_questions_ticked";
const groups = Object.keys(agencyQuestionGroups) as AgencyQuestionGroup[];
const total = agencyQuestions.length;

export function AgencyChecklist() {
  const uid = useId();
  const [ticked, setTicked] = useState<string[]>([]);
  const [answers, setAnswers] = useState(false);

  useEffect(() => {
    const saved = (readStorage("session", KEY) ?? "").split(",").filter(Boolean);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- restore this tab's ticks once
    if (saved.length) setTicked(saved);
  }, []);

  const toggle = (id: string, on: boolean) => {
    const next = on ? [...ticked, id] : ticked.filter((t) => t !== id);
    setTicked(next);
    writeStorage("session", KEY, next.length ? next.join(",") : null);
  };

  const print = () => {
    document.documentElement.dataset.print = "agency";
    const done = () => {
      delete document.documentElement.dataset.print;
      window.removeEventListener("afterprint", done);
    };
    window.addEventListener("afterprint", done);
    window.print();
  };

  const n = ticked.length;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-8">
        <div className="flex items-center gap-4">
          <button
            type="button"
            role="switch"
            id={`${uid}-sw`}
            className="switch"
            aria-checked={answers}
            onClick={() => setAnswers((a) => !a)}
          />
          <label htmlFor={`${uid}-sw`} className="cursor-pointer font-semibold text-plum-800">
            Show Dawson&apos;s answers
          </label>
        </div>
        <button type="button" className="btn btn-ghost max-sm:w-full" onClick={print}>
          <Printer aria-hidden size={20} strokeWidth={1.75} />
          Print as a comparison sheet
        </button>
      </div>
      <p aria-live="polite" className="font-semibold text-plum-800 empty:hidden">
        {n === total
          ? "All asked. You'll know exactly who you're dealing with."
          : n > 0
            ? `${n} of ${total} asked.`
            : ""}
      </p>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-x-12">
        {groups.map((g) => (
          <div key={g} className="flex flex-col gap-3">
            <h3 className="h3">{agencyQuestionGroups[g]}</h3>
            <ul className="flex flex-col gap-3">
              {agencyQuestions
                .filter((q) => q.group === g)
                .map((q) => {
                  const our = visibleBlocks(q.ourAnswer);
                  return (
                    <li key={q.id} className="rounded-2xl border border-line bg-white p-4 md:p-5">
                      <label className="flex cursor-pointer items-start gap-3.5">
                        <input
                          type="checkbox"
                          className="peer sr-only"
                          checked={ticked.includes(q.id)}
                          onChange={(e) => toggle(q.id, e.target.checked)}
                          aria-describedby={`${uid}-${q.id}-why`}
                        />
                        <span
                          aria-hidden="true"
                          className="mt-0.5 flex size-7 flex-none items-center justify-center rounded-lg border-2 border-muted bg-white text-transparent transition-colors peer-checked:border-plum-800 peer-checked:bg-plum-800 peer-checked:text-leaf-500 peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-leaf-500"
                        >
                          <Check size={18} strokeWidth={3} />
                        </span>
                        <span className="font-semibold text-plum-800">{q.question}</span>
                      </label>
                      <p id={`${uid}-${q.id}-why`} className="sm muted mt-2 pl-[42px]">
                        <strong className="font-semibold">Why it matters:</strong> {q.why}
                      </p>
                      {answers && (
                        <div className="mt-3 ml-[42px] rounded-xl bg-orchid-100 p-4">
                          <p className="eyebrow mb-1.5">Our answer</p>
                          {our.length ? (
                            <Blocks blocks={q.ourAnswer} />
                          ) : (
                            <p>{ourAnswerFallback}</p>
                          )}
                        </div>
                      )}
                    </li>
                  );
                })}
            </ul>
          </div>
        ))}
      </div>

      {/* Print-only comparison sheet */}
      <div className="agency-print" aria-hidden="true">
        <h2>Questions to ask any home care agency</h2>
        <table>
          <thead>
            <tr>
              <th>Question</th>
              <th>Agency 1</th>
              <th>Agency 2</th>
              <th>Agency 3</th>
            </tr>
          </thead>
          {groups.map((g) => (
            <tbody key={g}>
              <tr>
                <th colSpan={4} className="grp">
                  {agencyQuestionGroups[g]}
                </th>
              </tr>
              {agencyQuestions
                .filter((q) => q.group === g)
                .map((q) => (
                  <tr key={q.id}>
                    <td>
                      <strong>{q.question}</strong>
                      <small>{q.why}</small>
                    </td>
                    <td />
                    <td />
                    <td />
                  </tr>
                ))}
            </tbody>
          ))}
        </table>
        <p>From dawsonhomecare.com · {contact.phone.value.display}</p>
      </div>
    </div>
  );
}
