"use client";

/**
 * /thank-you (COPY_CONVERSION §4) using the design's success visual (04-free-assessment "sent").
 * The variant and first name come from this tab's sessionStorage (written at send time — the
 * open/closed wording is decided then, never by when the page is viewed), then are cleared.
 */
import Link from "next/link";
import { useEffect, useState } from "react";
import { contact, flags, hours, service } from "@/content/site.config";
import { THANKYOU_KEY } from "@/content/assessment";
import { readStorage, writeStorage } from "@/lib/storage";
import { NextOpen, useOfficeStatus } from "@/components/layout/OfficeStatus";
import { CheckIcon } from "./FormBits";

type Form = "assessment" | "callback" | "referral" | "contact";
/** `closed` = the office state when the referral/contact form was sent (never the view time). */
type Saved = {
  firstName?: string;
  form?: Form;
  reachVerb?: "call" | "text" | "email";
  closed?: boolean;
};
const ph = flags.showPlaceholders;
const officeResponse = service.responseTimeOffice;
const referralResponse = service.referralResponseTime;
const saveNumber = contact.callbackNumberIsMain;

const FAMILY_CARDS = [
  {
    title: "What happens at the free visit",
    line: "A friendly conversation at home, not an interview.",
    href: "/how-it-works#free-assessment",
  },
  {
    title: "What to have ready",
    line: "A short list to make the visit easier. Nothing is required.",
    href: "/how-it-works#have-ready",
  },
  {
    title: "Questions families ask",
    line: "Plain answers about care, cost and caregivers.",
    href: "/faq",
  },
  {
    title: "Paying for care",
    line: "Estimate costs and see how families pay.",
    href: "/paying-for-care",
  },
];

export function ThankYou() {
  const [saved, setSaved] = useState<Saved>({});
  const [param, setParam] = useState<Form>("assessment");
  const office = useOfficeStatus();

  useEffect(() => {
    const f = new URLSearchParams(window.location.search).get("form");
    let s: Saved = {};
    try {
      s = JSON.parse(readStorage("session", THANKYOU_KEY) ?? "{}") as Saved;
    } catch {}
    // eslint-disable-next-line react-hooks/set-state-in-effect -- read once, then clear
    setSaved(s);
    if (f === "callback" || f === "referral" || f === "contact" || f === "assessment") setParam(f);
    writeStorage("session", THANKYOU_KEY, null);
  }, []);

  const form: Form = saved.form ?? param;
  const closed = form === "callback";
  /** Referral / contact: closed at send time (falls back to now if the tab lost it). */
  const isClosed = saved.closed ?? office.isClosed;
  const verb = saved.reachVerb ?? "call";
  const name = saved.firstName ? `, ${saved.firstName}` : "";
  const title =
    form === "referral"
      ? `Thank you${name}. Referral received.`
      : form === "contact"
        ? `Thanks${name}. Message received.`
        : `Thank you${name}.`;

  return (
    <div className="wrap pt-10 pb-16 lg:pt-16 lg:pb-section-sm">
      <div className="fcard flex max-w-[880px] flex-col items-start gap-[18px]">
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
        <h1
          id="ty-title"
          tabIndex={-1}
          className="ff text-[2.5rem] leading-[1.05] text-plum-800 lg:text-[2.75rem]"
        >
          {title}
        </h1>
        <p className="lead">
          {form === "referral" ? (
            isClosed ? (
              <>
                Our office is closed right now. We&apos;ll call you first thing <NextOpen />.
              </>
            ) : (
              "We'll call you as soon as we can to talk through the details."
            )
          ) : form === "contact" ? (
            isClosed ? (
              <>
                Our office is closed right now. We&apos;ll {verb} you after we open <NextOpen />.
              </>
            ) : (
              `We'll ${verb} you as soon as we can.`
            )
          ) : closed ? (
            <>
              We&apos;ve got your request. Our office is closed right now, so we&apos;ll {verb} you
              first thing <NextOpen />.
            </>
          ) : (
            `We've got your request. Our office is open now, so we'll ${verb} you as soon as we can.`
          )}
        </p>
        {form === "assessment" &&
          (officeResponse.confirmed && officeResponse.value ? (
            <p className="sm muted">Most families hear from us within {officeResponse.value}.</p>
          ) : (
            ph && (
              <p className="sm muted">
                Most families hear from us within{" "}
                <span className="tbc">[Response time during office hours]</span>.
              </p>
            )
          ))}
        {form === "referral" && (
          <>
            {referralResponse.confirmed && referralResponse.value ? (
              <p className="sm muted">We respond to referrals within {referralResponse.value}.</p>
            ) : (
              ph && (
                <p className="sm muted">
                  We respond to referrals within{" "}
                  <span className="tbc">[Referral response time]</span>.
                </p>
              )
            )}
            <p className="sm muted">
              Have paperwork to send? Fax it to {contact.fax.value.display}.
            </p>
          </>
        )}
        {closed && (
          <>
            <p className="sm muted">If someone is hurt or in danger, call 911.</p>
            {contact.afterHoursClientLine.confirmed && contact.afterHoursClientLine.value ? (
              <p className="sm muted">
                Already a client? Reach us after hours at {contact.afterHoursClientLine.value}.
              </p>
            ) : (
              ph && (
                <p className="sm muted">
                  Already a client? Reach us after hours at{" "}
                  <span className="tbc">[After-hours line for existing clients]</span>.
                </p>
              )
            )}
          </>
        )}
        {form !== "referral" && (ph || (saveNumber.confirmed && saveNumber.value)) && (
          <div className="mt-2 self-stretch rounded-[20px] bg-plum-100 p-5">
            <h2 className="h3 !text-[1.375rem]">Save our number</h2>
            <p>
              Add {contact.phone.value.display} to your phone as &ldquo;Dawson Home Care&rdquo; — so
              you know it&apos;s us when we call.
              {!saveNumber.confirmed && (
                <>
                  {" "}
                  <span className="tbc">
                    [Does the office call families back from this number?]
                  </span>
                </>
              )}
            </p>
          </div>
        )}

        <section aria-labelledby="next-steps" className="mt-6 self-stretch">
          <h2 id="next-steps" className="h2">
            What happens next
          </h2>
          <ol className="relative mt-6 flex flex-col gap-6">
            <span
              aria-hidden="true"
              className="absolute top-5 bottom-6 left-[17px] w-0.5 bg-orchid-500/45"
            />
            {(form === "referral"
              ? [
                  { t: "Referral sent", l: "", done: true },
                  {
                    t: "We call you",
                    l: "To talk through the client's needs, timing and who to contact.",
                    done: false,
                  },
                  {
                    t: "We reach the family",
                    l: "And our owner sets up a free visit at home.",
                    done: false,
                  },
                  {
                    t: "Care starts",
                    l: "And we keep you and the family in the loop.",
                    done: false,
                    chip: "[How Dawson updates referral sources after care starts]",
                  },
                ]
              : [
                  { t: "Request sent", l: "We have everything we need for now.", done: true },
                  { t: `We ${verb} you`, l: "", done: false, when: true },
                  {
                    t: "Our owner visits — free",
                    l: "At your loved one's home. We talk about their days and the help they need.",
                    done: false,
                  },
                  {
                    t: "We build the plan together",
                    l: "No obligation. You decide if and when to start.",
                    done: false,
                  },
                ]
            ).map((s, i) => (
              <li key={s.t} className="nx">
                <span
                  className={s.done ? "nxn !bg-leaf-500 !text-plum-950" : "nxn"}
                  aria-hidden="true"
                >
                  {s.done ? <CheckIcon size={18} /> : i + 1}
                </span>
                <div>
                  <p className="font-bold text-plum-800">
                    {s.t}
                    {s.done && <span className="font-semibold text-leaf-700"> · Done</span>}
                  </p>
                  {"when" in s && s.when ? (
                    <p>
                      {closed || (form === "contact" && isClosed) ? (
                        <>
                          First thing <NextOpen />.
                        </>
                      ) : (
                        "As soon as we can."
                      )}{" "}
                      We&apos;ll answer your questions and set up the visit.
                    </p>
                  ) : (
                    s.l && (
                      <p>
                        {s.l}
                        {"chip" in s && s.chip && ph && (
                          <>
                            {" "}
                            <span className="tbc">{s.chip}</span>
                          </>
                        )}
                      </p>
                    )
                  )}
                </div>
              </li>
            ))}
          </ol>
        </section>
      </div>

      <section aria-labelledby="wait-title" className="mt-14 lg:mt-16">
        <h2 id="wait-title" className="h2">
          While you wait
        </h2>
        <ul className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {(form === "referral"
            ? [
                { title: "What we do and don't do", line: "", href: "/for-professionals#scope" },
                {
                  title: "Home care and home health, side by side",
                  line: "",
                  href: "/paying-for-care#pay-medicare",
                },
              ]
            : FAMILY_CARDS
          ).map((c) => (
            <li key={c.title} className="flex">
              <Link
                href={c.href}
                data-cursor-label="Open"
                className="flex flex-1 flex-col gap-2 rounded-[20px] border border-line bg-white p-6 text-ink no-underline transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-orchid-500 hover:text-ink reduce-motion:hover:translate-y-0"
              >
                <span className="h3 !text-[1.375rem]">{c.title}</span>
                {c.line && <span>{c.line}</span>}
                <span className="link mt-auto">
                  Read more<span className="sr-only">: {c.title}</span>
                  <span aria-hidden="true"> →</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-10 flex flex-col gap-1">
          <p>
            <strong className="text-plum-800">Care:</strong> {hours.careLabel}
          </p>
          <p>
            <strong className="text-plum-800">Office:</strong> {hours.officeLabel}
          </p>
        </div>
        <Link className="link mt-4" href="/">
          Back to the home page
        </Link>
      </section>
    </div>
  );
}
