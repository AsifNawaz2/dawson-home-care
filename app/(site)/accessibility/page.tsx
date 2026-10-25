import type { Metadata } from "next";
import Link from "next/link";
import { address, contact, flags, hours, legal } from "@/content/site.config";
import { pageMetadata } from "@/lib/seo";
import { LegalPage, Pending, longDate, type LegalSection } from "@/components/legal/LegalPage";

export const metadata: Metadata = pageMetadata("/accessibility");

const phone = contact.phone.value;
const toll = contact.tollFree.value;
const email = contact.email.value;
const ph = flags.showPlaceholders;
const audit = legal.a11yAuditDate;

const sections: LegalSection[] = [
  {
    id: "commitment",
    title: "Our commitment",
    body: (
      <>
        <p>
          The families who visit this site include older adults and their grown children — often
          reading on a phone, late at night, at a stressful time. We built it to be easy for
          everyone: large text, strong contrast, big buttons and plain words.
        </p>
        <p>Accessibility isn&apos;t finished at launch. We keep checking and improving the site.</p>
      </>
    ),
  },
  {
    id: "standard",
    title: "The standard we aim for",
    body: (
      <>
        <p>
          We aim to meet the{" "}
          <strong>Web Content Accessibility Guidelines (WCAG) 2.2, Level AA</strong>, published by
          the World Wide Web Consortium (W3C).
        </p>
        <p>
          In some places we go further than the standard, because many of our visitors are older
          adults:
        </p>
        <ul>
          <li>Body text is at least 18 pixels.</li>
          <li>
            Buttons and other tap targets are at least 48 by 48 pixels — twice the standard&apos;s
            minimum of 24.
          </li>
          <li>We use only color combinations that pass the standard&apos;s contrast checks.</li>
        </ul>
        <p>
          We don&apos;t claim the site is perfect. <a href="#limitations">Section 6</a> lists what
          we know still needs work.
        </p>
      </>
    ),
  },
  {
    id: "comfort-controls",
    title: "Comfort Controls",
    body: (
      <>
        <p>
          Every page has a <strong>Comfort Controls</strong> button at the bottom left (bottom right
          on phones). It lets you:
        </p>
        <ul>
          <li>
            <strong>Change text size:</strong> A, A+ or A++ (normal, about 12% bigger, or 25%
            bigger).
          </li>
          <li>
            <strong>Turn on high contrast:</strong> darker borders, underlined links and no soft
            glows.
          </li>
          <li>
            <strong>Reduce motion:</strong> stops animations and moving effects.
          </li>
        </ul>
        <p>Your choices are saved on this device, so they&apos;re there next time you visit.</p>
        <p>
          The site also follows your device&apos;s own settings. If your phone or computer is set to
          reduce motion, or to high contrast, the site does the same. You can zoom in to 200%
          without losing anything, and pages fit a narrow screen without sideways scrolling.
        </p>
      </>
    ),
  },
  {
    id: "features",
    title: "Other ways the site helps",
    body: (
      <>
        <h3>Keyboard</h3>
        <p>
          Everything works with a keyboard. Press Tab to move, and you&apos;ll always see a clear
          outline around where you are. A &ldquo;Skip to content&rdquo; link lets you jump past the
          menu. Pop-up windows close with the Esc key.
        </p>
        <h3>Screen readers</h3>
        <p>
          Pages use clear headings, labeled regions and descriptions for meaningful images. Our
          interactive features have text versions: the area map is also a list of towns.
        </p>
        <h3>Moving content</h3>
        <p>
          Nothing on the site flashes. Scrolling is never locked. The moving row of reviews stops
          when you point at it or reach it with the keyboard, and it has a Pause button. With Reduce
          motion on, nothing moves at all.
        </p>
        {ph && (
          <>
            <h3>Video</h3>
            <p>
              Our videos have captions and a written transcript. Nothing plays sound on its own.{" "}
              <span className="tbc">
                [shows once the owner video ships with captions and a transcript]
              </span>
            </p>
          </>
        )}
        <h3>Forms</h3>
        <p>
          Every field has a visible label, and required fields say &ldquo;(required)&rdquo; in
          words. If something needs fixing, we tell you what and how — in words, not just color.
          There&apos;s no time limit, and longer forms show which step you&apos;re on and keep your
          answers if you go back.
        </p>
        <h3>Color is never the only signal</h3>
        <p>
          Where color carries meaning, words or an icon do too. For example, our office-status sign
          says &ldquo;Office open now&rdquo; or &ldquo;Office closed&rdquo; next to its icon.
        </p>
        <h3>The pointer</h3>
        <p>
          On computers, a soft ring follows your mouse to show what a click will do. It&apos;s
          decoration only: your normal pointer always stays visible, and the ring turns off with
          Reduce motion or high contrast.
        </p>
      </>
    ),
  },
  ...(audit || ph
    ? [
        {
          id: "testing",
          title: "How we test",
          body: (
            <>
              <p>
                We check every page with automated accessibility tests, test by keyboard alone, and
                test with screen readers: VoiceOver on iPhone and Mac, and NVDA on Windows. We also
                check pages at 200% zoom and on small screens.
              </p>
              <p>
                Our most recent full review was on{" "}
                {audit ? (
                  <time dateTime={audit}>{longDate(audit)}</time>
                ) : (
                  <span className="tbc">[date of the pre-launch accessibility audit]</span>
                )}
                .
              </p>
            </>
          ),
        },
      ]
    : []),
  {
    id: "limitations",
    title: "Known limitations",
    body: (
      <>
        <p>
          Here&apos;s what we know isn&apos;t as good as it should be yet, and what to do in the
          meantime.
        </p>
        <Pending>[TO CONFIRM: final list after the pre-launch audit]</Pending>
        <ul>
          <li>
            <strong>Other websites we link to.</strong> Job applications happen on Hireology, and
            directions on Google Maps. We don&apos;t control those sites. If you have trouble with
            them, call us at <a href={`tel:${phone.tel}`}>{phone.display}</a>.
          </li>
          <li>
            <strong>Our area map is a drawing.</strong> It shows roughly where we care, not exact
            boundaries. The list of towns under the map has the same information.
          </li>
          <li>
            <strong>Our referral sheet for healthcare professionals is coming soon.</strong>{" "}
            Everything on it is already on our{" "}
            <Link href="/for-professionals">For Professionals</Link> page. When we add the PDF, it
            will be an accessible one.
          </li>
          <li>
            <strong>Very old browsers.</strong> The site works best in a current version of Chrome,
            Safari, Edge or Firefox. In very old browsers some effects may not appear, but all the
            information is still there.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "other-ways",
    title: "Other ways to get information",
    body: (
      <>
        <p>
          If any part of this website doesn&apos;t work for you, call us at{" "}
          <a href={`tel:${phone.tel}`}>{phone.display}</a>, {hours.officeLabel} (Eastern). We can
          talk you through anything on the site and take your details by phone.
        </p>
        <p>
          If you&apos;re deaf or hard of hearing, or have difficulty speaking, you can reach us
          through your relay service by dialing <strong>711</strong>.
        </p>
        <p>
          You can also visit our office at {address.street.value}, {address.suite.value}, in{" "}
          {address.city.value}. Please call ahead so the right person is there to meet you.
        </p>
        <Pending>
          [TO CONFIRM: step-free access to Suite 3F — add one line on entrance, elevator or ramp
          only if true]
        </Pending>
      </>
    ),
  },
  {
    id: "feedback",
    title: "Tell us about a problem",
    body: (
      <>
        <p>
          If something on this site is hard to use, we want to know — and we&apos;ll help you get
          what you need in the meantime.
        </p>
        <p>
          <strong>Call:</strong> <a href={`tel:${phone.tel}`}>{phone.display}</a>
          <br />
          <strong>Email:</strong>{" "}
          <a href={`mailto:${email}?subject=Website%20accessibility`}>{email}</a>, with
          &ldquo;Website accessibility&rdquo; in the subject line
          <br />
          <strong>Text:</strong> <a href={`sms:${toll.tel}`}>{toll.display}</a>
          <br />
          <strong>Mail:</strong> {address.oneLine}
        </p>
        <p>It helps if you tell us:</p>
        <ul>
          <li>Which page you were on</li>
          <li>What you were trying to do</li>
          <li>
            Your device and browser, and any assistive technology you use, such as a screen reader
            or magnifier
          </li>
        </ul>
        <p>We&apos;ll get back to you during office hours, as soon as we can.</p>
        <Pending>
          [TO CONFIRM: a reply-time promise, e.g. &ldquo;within 2 business days&rdquo;]
        </Pending>
        <p>
          <strong>Office:</strong> {hours.officeLabel} (Eastern) · <strong>Care:</strong>{" "}
          {hours.careLabel}
        </p>
      </>
    ),
  },
];

/** Accessibility statement (COPY_LEGAL §4). §8 is the contact block. JSON-LD: breadcrumbs only. */
export default function AccessibilityPage() {
  return (
    <LegalPage
      path="/accessibility"
      title="Accessibility"
      lead="Dawson and Dawson Home Care LLC wants everyone to be able to use this website — including people who use a screen reader, a keyboard, bigger text or a magnifier. If anything gets in your way, please tell us."
      updated={legal.updated.accessibility}
      short={[
        "We aim to meet WCAG 2.2 Level AA, the widely used standard for accessible websites.",
        <>
          Make text bigger, raise contrast or turn off motion with the{" "}
          <strong>Comfort Controls</strong> button at the bottom of every page.
        </>,
        "Everything on this site works with a keyboard.",
        <>
          Something not working for you? Call <a href={`tel:${phone.tel}`}>{phone.display}</a> or
          email <a href={`mailto:${email}`}>{email}</a>.
        </>,
      ]}
      sections={sections}
    />
  );
}
