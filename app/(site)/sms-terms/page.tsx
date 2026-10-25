import type { Metadata } from "next";
import Link from "next/link";
import { contact, hours, legal, sms } from "@/content/site.config";
import { pageMetadata } from "@/lib/seo";
import { ContactBlock, LegalPage, Pending, type LegalSection } from "@/components/legal/LegalPage";

export const metadata: Metadata = pageMetadata("/sms-terms");

const phone = contact.phone.value;
const toll = contact.tollFree.value;
const email = contact.email.value;
const news = sms.marketingEnabled;

const sections: LegalSection[] = [
  {
    id: "about",
    title: "About our texts",
    body: (
      <>
        <p>
          <strong>Program:</strong> Dawson and Dawson Home Care Text Messages
          <br />
          <strong>Sent by:</strong> Dawson and Dawson Home Care LLC, 69 Robert Smalls Parkway, Suite
          3F, Beaufort, SC 29906
          <br />
          <strong>Texts come from:</strong> {toll.display}
        </p>
        <Pending>
          [TO CONFIRM: any other number Dawson texts from, e.g. {phone.display} — list every sending
          number]
        </Pending>
        <p>
          We use texts to make it easier for families to reach us and to keep care running smoothly.
        </p>
      </>
    ),
  },
  {
    id: "what-we-send",
    title: "What we send",
    body: (
      <>
        <h3>Care-related texts</h3>
        <p>If you tick the first text box on our forms, or text us first, we may text you about:</p>
        <ul>
          <li>Your question or care inquiry</li>
          <li>Setting up your free care assessment</li>
          <li>Appointment reminders and scheduling updates</li>
          <li>The services you&apos;ve asked us about</li>
        </ul>
        <Pending>
          [TO CONFIRM: other care texts sent to clients&apos; families, e.g. caregiver arrival or
          shift updates — add as a bullet only if real]
        </Pending>
        {news && (
          <>
            <h3>News and tips</h3>
            <p>
              Only if you tick the second text box, we&apos;ll also send occasional texts with news
              from Dawson and tips for families caring for someone at home.
            </p>
            <p>Texting us, or ticking only the first box, never signs you up for news and tips.</p>
          </>
        )}
      </>
    ),
  },
  {
    id: "sign-up",
    title: "How you sign up",
    body: (
      <>
        <p>You can sign up for texts in two ways:</p>
        <ul>
          <li>
            <strong>On our forms.</strong> Tick one or both text boxes on our{" "}
            <Link href="/free-assessment">free care assessment</Link> or{" "}
            <Link href="/contact">contact</Link> form. Both boxes start unticked and are optional.
          </li>
          <li>
            <strong>By texting us first.</strong> When you text {toll.display}, you&apos;re asking
            us to text you back about your message. See <a href="#toll-free">section 8</a>.
          </li>
        </ul>
        <p>
          <strong>Texts are never required.</strong> You don&apos;t have to agree to texts to get
          care or a free assessment. We&apos;re always happy to call or email instead.
        </p>
        <p>
          After you sign up on a form, we&apos;ll send one text to confirm. It tells you how to get
          help or stop.
        </p>
      </>
    ),
  },
  {
    id: "frequency",
    title: "How often we text",
    body: (
      <>
        <p>
          Message frequency varies. Care-related texts depend on your inquiry and your care
          schedule.{news && " News and tips are occasional."}
        </p>
        <Pending>
          [TO CONFIRM: a cap for news and tips, e.g. &ldquo;no more than 4 a month&rdquo;]
        </Pending>
      </>
    ),
  },
  {
    id: "cost",
    title: "What it costs",
    body: (
      <p>
        Msg &amp; data rates may apply, depending on your mobile phone plan. Dawson never charges
        you for texts.
      </p>
    ),
  },
  {
    id: "stop",
    title: "How to stop",
    body: (
      <>
        <p>
          Reply <strong>STOP</strong> to any text from us. These words work too:{" "}
          <strong>QUIT, END, REVOKE, OPT OUT, CANCEL</strong> or <strong>UNSUBSCRIBE</strong>.
        </p>
        <p>We&apos;ll send one text to confirm, and then we&apos;ll stop.</p>
        <p>
          <strong>Replying STOP stops all texts from us</strong> — care-related texts
          {news && " and news and tips"}. We&apos;ll still call or email you about your care if we
          need to.
        </p>
        <p>
          <strong>Prefer another way?</strong> You can also call us at{" "}
          <a href={`tel:${phone.tel}`}>{phone.display}</a>, email{" "}
          <a href={`mailto:${email}`}>{email}</a>, or tell any of our team. We&apos;ll stop as soon
          as we can, and always within 10 business days.
        </p>
        {news && (
          <p>
            <strong>Only want news and tips to stop?</strong> Call or email us, and we&apos;ll keep
            sending care-related texts.
          </p>
        )}
        <p>
          <strong>Changed your mind?</strong> Reply <strong>START</strong> to sign up again, or tick
          the box on one of our forms.
        </p>
      </>
    ),
  },
  {
    id: "help",
    title: "How to get help",
    body: (
      <>
        <p>
          Reply <strong>HELP</strong> to any text from us, and we&apos;ll text back with how to
          reach us. Or:
        </p>
        <ul>
          <li>
            <strong>Call:</strong> <a href={`tel:${phone.tel}`}>{phone.display}</a>
          </li>
          <li>
            <strong>Call or text (toll-free):</strong>{" "}
            <a href={`tel:${toll.tel}`}>{toll.display}</a>
          </li>
          <li>
            <strong>Email:</strong> <a href={`mailto:${email}`}>{email}</a>
          </li>
        </ul>
        <p>
          <strong>Office:</strong> {hours.officeLabel} (Eastern)
          <br />
          <strong>Care:</strong> {hours.careLabel}
        </p>
      </>
    ),
  },
  {
    id: "toll-free",
    title: "Texting our toll-free number",
    body: (
      <>
        <p>Our toll-free number, {toll.display}, takes calls and texts.</p>
        <p>
          When you text it, you&apos;re asking us to text you back about your message, so we&apos;ll
          reply by text. We&apos;ll only text you about what you asked. We won&apos;t send you news
          and tips unless you sign up for them separately.
        </p>
        <p>
          We read and answer texts during office hours, {hours.officeLabel} (Eastern). Reply STOP at
          any time to stop.
        </p>
      </>
    ),
  },
  {
    id: "please-dont",
    title: "Please don't text us",
    body: (
      <ul>
        <li>
          <strong>In an emergency.</strong> If someone is hurt or in danger, call 911.
        </li>
        <li>
          <strong>Medical details.</strong> Please don&apos;t text diagnoses, medications, dates of
          birth, Social Security numbers, or Medicare, Medicaid or insurance numbers. Text messages
          aren&apos;t a secure way to send private information. We&apos;ll talk about care needs by
          phone.
        </li>
      </ul>
    ),
  },
  {
    id: "delivery",
    title: "Delivery",
    body: (
      <p>
        Texts may be delayed or not arrive if your phone is off or out of range, or if your mobile
        carrier doesn&apos;t support them.{" "}
        <strong>Mobile carriers are not liable for delayed or undelivered messages.</strong>
      </p>
    ),
  },
  {
    id: "new-number",
    title: "If you change your phone number",
    body: (
      <p>
        If you change or give up your phone number, please reply STOP from that number first, or let
        us know. That way, the next person who gets that number won&apos;t get your texts.
      </p>
    ),
  },
  {
    id: "privacy",
    title: "Your privacy",
    body: (
      <>
        <p>
          <strong>
            We do not sell, rent or share mobile phone numbers or text-messaging opt-in data with
            third parties or affiliates for marketing or promotional purposes.
          </strong>
        </p>
        <p>
          To learn how we handle your information, read our{" "}
          <Link href="/privacy-policy">Privacy Policy</Link>.
        </p>
      </>
    ),
  },
  {
    id: "changes",
    title: "Changes to these terms",
    body: (
      <p>
        If we change these terms, we&apos;ll post the new version here and update the date at the
        top. If we change the kinds of texts we send in a way that matters, we&apos;ll ask for your
        consent again first.
      </p>
    ),
  },
  {
    id: "contact",
    title: "Contact us",
    body: (
      <>
        <p>Questions about our texts? Reply HELP, or reach us here.</p>
        <ContactBlock />
      </>
    ),
  },
];

/** SMS Terms (COPY_LEGAL §3). JSON-LD: breadcrumbs only. */
export default function SmsTermsPage() {
  return (
    <LegalPage
      path="/sms-terms"
      title="SMS Terms"
      lead="How text messages from Dawson and Dawson Home Care LLC work: what we send, how often, and how to get help or stop."
      updated={legal.updated.sms}
      short={[
        "Texts from us are optional. You choose them separately on our forms.",
        <>
          Reply <strong>STOP</strong> to stop. Reply <strong>HELP</strong> for help.
        </>,
        "Message frequency varies. Msg & data rates may apply.",
        "Our texts aren't for emergencies. If someone is hurt or in danger, call 911.",
      ]}
      sections={sections}
    />
  );
}
