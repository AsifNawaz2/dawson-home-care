import type { Metadata } from "next";
import Link from "next/link";
import { contact, integrations, legal, sms } from "@/content/site.config";
import { pageMetadata } from "@/lib/seo";
import { ContactBlock, LegalPage, Pending, type LegalSection } from "@/components/legal/LegalPage";

export const metadata: Metadata = pageMetadata("/privacy-policy");

const phone = contact.phone.value;
const email = contact.email.value;
const analytics = legal.analytics;
const turnstile = integrations.turnstile;

const sections: LegalSection[] = [
  {
    id: "who-we-are",
    title: "Who we are and what this covers",
    body: (
      <>
        <p>
          Dawson and Dawson Home Care LLC (&ldquo;Dawson,&rdquo; &ldquo;we,&rdquo; &ldquo;us&rdquo;)
          is a non-medical home care agency based at 69 Robert Smalls Parkway, Suite 3F, Beaufort,
          SC 29906.
        </p>
        <p>
          This policy covers our website, dawsonhomecare.com, and the texts and emails we send to
          people who contact us through it, call us or text us.
        </p>
        <p>
          It doesn&apos;t cover the records we keep while caring for a client. Those are handled as
          part of providing care. It also doesn&apos;t cover other websites we link to, like our
          hiring site.
        </p>
        <Pending>
          [TO CONFIRM: does Dawson give clients a separate privacy notice or service agreement that
          covers care records? If yes, add: &ldquo;Clients receive a separate notice about care
          records when care starts.&rdquo;]
        </Pending>
      </>
    ),
  },
  {
    id: "what-we-collect",
    title: "What we collect",
    body: (
      <>
        <h3>What you tell us</h3>
        <p>
          <strong>When you ask for a free care assessment:</strong> Your name, phone number and
          email (if you give one), how and when you&apos;d like us to reach you, who the care is for
          and their first name, their town, the kind of help you&apos;re looking for, how many hours
          and when you&apos;d like to start, anything you write in the notes, and your text-message
          choices.
        </p>
        <p>
          <strong>When you send a message from our contact page:</strong> What your message is
          about, your name, your phone number or email, your message, and your text-message choices.
        </p>
        <p>
          <strong>When a healthcare professional refers a client:</strong> The professional&apos;s
          name, organization, role, phone number and email. About the client, we ask only for their
          first name, the first letter of their last name, their town, the help they need and when.
          We also ask the professional to confirm they have permission to share this.
        </p>
        <p>
          <strong>When you ask us to email your quiz plan:</strong> Your email address, your first
          name if you give it, and your quiz answers.
        </p>
        <p>
          <strong>When you call, text or email us:</strong> Your phone number or email address and
          whatever you choose to tell us.
        </p>
        <Pending>
          [TO CONFIRM: are calls recorded? If yes, add: &ldquo;Calls to our office may be recorded
          so we can get details right and train our team.&rdquo;]
        </Pending>

        <h3>Our care quiz and cost estimator</h3>
        <p>
          The care quiz and cost estimator work inside your browser. We don&apos;t receive your
          answers unless you send us a form or ask us to email your plan. When you do, your answers
          come with it, so we don&apos;t have to ask you the same questions twice.
        </p>

        <h3>What we ask you not to send</h3>
        <p>
          Please don&apos;t send diagnoses, medications, dates of birth, Social Security numbers, or
          Medicare, Medicaid or insurance numbers through our website. We don&apos;t need them
          online. Our forms check for some of these and will ask you to take them out. We&apos;ll
          talk about care needs by phone.
        </p>

        <h3>What&apos;s collected automatically</h3>
        <p>
          <strong>Basic technical information.</strong> Like every website, ours receives technical
          information when you visit: your IP address, the type of browser and device you use, the
          pages you visit, and the date and time. Our website host keeps this in its logs. We use it
          to keep the site working and secure.
        </p>
        {turnstile && (
          <p>
            <strong>Spam protection.</strong> To stop spam, our forms use Cloudflare Turnstile. It
            checks, in the background, that a person and not a robot is sending the form. To do
            that, it looks at information about your browser and device. There&apos;s no puzzle to
            solve.
          </p>
        )}
        <p>
          <strong>Proof of your text-message choices.</strong> When you tick a text-message box, we
          record which boxes you ticked, the exact wording you agreed to, the date and time, the
          page you were on, and your IP address and browser type. This is our record that you asked
          to get texts.
        </p>
        <p>
          <strong>Where you came from.</strong> If you reached our site from an ad or a link with
          tracking codes in the web address, we save those codes with your form. It tells us which
          ads and links help families find us.
        </p>
        <p>
          <strong>Analytics.</strong> See{" "}
          <a href="#cookies">&ldquo;Cookies and browser storage&rdquo;</a> below.
        </p>
      </>
    ),
  },
  {
    id: "how-we-use-it",
    title: "How we use it",
    body: (
      <>
        <p>We use your information to:</p>
        <ul>
          <li>Reply to you and set up your free care assessment</li>
          <li>Plan and provide care, if you or your loved one becomes a client</li>
          <li>Send the texts you agreed to, and the emails you asked for</li>
          <li>Respond to referrals from healthcare professionals</li>
          <li>Keep a record of your text-message choices, including when you opt out</li>
          <li>Keep our website working, secure and free of spam</li>
          {analytics !== "none" && (
            <li>Understand, in total, how people use our website, so we can improve it</li>
          )}
          <li>Meet our legal obligations</li>
        </ul>
        <p>
          We won&apos;t use your information for something unrelated to these without asking you
          first.
        </p>
      </>
    ),
  },
  {
    id: "text-messages",
    title: "Text messages",
    body: (
      <>
        <p>
          Texts from us are optional.{" "}
          {sms.marketingEnabled
            ? "There are two kinds, and you choose each one separately:"
            : "There is one kind:"}
        </p>
        <ul>
          <li>
            <strong>Care-related texts</strong> about your inquiry and the services you request,
            such as appointment reminders and scheduling updates.
          </li>
          {sms.marketingEnabled && (
            <li>
              <strong>News and tips</strong> — occasional texts with news from Dawson and tips for
              families.
            </li>
          )}
        </ul>
        <p>
          <strong>
            We do not sell, rent or share mobile phone numbers or text-messaging opt-in data with
            third parties or affiliates for marketing or promotional purposes.
          </strong>
        </p>
        <p>
          Your text-messaging opt-in and consent are never shared with any third party. The only
          companies that handle them are the service providers that send and store our texts for us,
          and they may use them only to do that job.
        </p>
        <p>
          Reply <strong>STOP</strong> to any text to stop getting texts. Reply <strong>HELP</strong>{" "}
          for help. For everything about how our texts work, see our{" "}
          <Link href="/sms-terms">SMS Terms</Link>.
        </p>
      </>
    ),
  },
  {
    id: "sharing",
    title: "Who we share it with",
    body: (
      <>
        {analytics === "ga4-ads" ? (
          <p>
            <strong>We don&apos;t sell your personal information.</strong> If you choose
            &ldquo;Accept&rdquo; in our cookie banner, our advertising tools get limited information
            about your visit (see <a href="#cookies">section 6</a>). If you choose
            &ldquo;Decline,&rdquo; they don&apos;t.
          </p>
        ) : (
          <p>
            <strong>
              We don&apos;t sell your personal information, and we don&apos;t share it for
              advertising.
            </strong>
          </p>
        )}
        <p>We share information only in these cases:</p>
        <p>
          <strong>With companies that work for us.</strong> They help us run our business, and they
          may use your information only to provide their service to us:
        </p>
        <ul>
          <li>
            Our customer system, GoHighLevel (also called LeadConnector). It stores contact details
            and sends our texts and emails.
          </li>
          <li>
            Our website host, which runs the site and keeps the basic technical logs described
            above.
          </li>
          {turnstile && <li>Cloudflare Turnstile, our spam protection.</li>}
          {analytics !== "none" && <li>Google Analytics, which counts visits.</li>}
          {analytics === "ga4-ads" && (
            <li>
              <span className="tbc">
                [TO CONFIRM: advertising tools used at launch, e.g. Meta Pixel, Google Ads]
              </span>
            </li>
          )}
        </ul>
        <p>
          <strong>With our team.</strong> Only the people at Dawson who need it to help you, such as
          our owner and office staff. If care starts, the caregivers who care for your loved one see
          what they need to do that well.
        </p>
        <p>
          <strong>With people you ask us to talk to.</strong> For example, another family member, or
          a hospice or home health team you ask us to work with.
        </p>
        <p>
          <strong>When the law requires it.</strong> For example, to answer a valid legal request,
          or if someone&apos;s safety is at risk.
        </p>
        <p>
          <strong>If our business changes hands.</strong> If Dawson were ever sold or merged, your
          information would move with the business and stay protected by this policy.
        </p>
      </>
    ),
  },
  {
    id: "cookies",
    title: "Cookies and browser storage",
    body: (
      <>
        <h3>What our site saves in your browser (every visitor)</h3>
        <p>
          Our website saves a few small things in your own browser so it works the way you&apos;d
          expect. None of this is sent to us.
        </p>
        <ul>
          <li>
            <strong>Your Comfort Controls choices</strong> — text size, contrast and motion — saved
            on this device so they&apos;re there next time.
          </li>
          <li>
            <strong>Your form progress</strong> — saved only in this browser tab, so you can go back
            a step or take a break. It&apos;s cleared when you close the tab.
          </li>
          <li>
            <strong>Small reminders for this visit</strong> — for example, so our logo animation
            plays only once.
          </li>
        </ul>
        <p>
          Our map is drawn by us and our fonts are stored on our own website, so simply viewing a
          page doesn&apos;t send information to Google. If you click &ldquo;Get directions,&rdquo;
          you go to Google Maps, and Google&apos;s own privacy policy applies there.
        </p>
        <h3>Analytics and advertising</h3>
        {analytics === "none" && <p>We don&apos;t use analytics or advertising cookies.</p>}
        {analytics === "ga4" && (
          <>
            <p>
              We use Google Analytics to understand, in total, how people use our site, such as
              which pages are visited most. It uses cookies. We never send it what you type into our
              forms or your quiz answers. We don&apos;t use it for advertising.
            </p>
            <p>
              To opt out, you can block cookies in your browser settings, or use Google&apos;s{" "}
              <a href="https://tools.google.com/dlpage/gaoptout">opt-out browser add-on</a>{" "}
              <span className="sm muted">goes to Google</span>
            </p>
          </>
        )}
        {analytics === "ga4-ads" && (
          <>
            <p>
              We use Google Analytics to understand, in total, how people use our site. With your
              permission, we also use advertising tools that help us show our ads to families who
              may need care. We never send any of these tools what you type into our forms or your
              quiz answers.
            </p>
            <p>
              These tools load only if you choose <strong>Accept</strong> in our cookie banner. If
              you choose <strong>Decline</strong>, they don&apos;t load, and the site works exactly
              the same. You can change your choice at any time with <strong>Cookie settings</strong>{" "}
              at the bottom of every page.
            </p>
            <p>If your browser sends a Global Privacy Control signal, we treat it as Decline.</p>
          </>
        )}
      </>
    ),
  },
  {
    id: "retention",
    title: "How long we keep it",
    body: (
      <>
        <p>We keep information only as long as we need it:</p>
        <ul>
          <li>
            <strong>Questions and inquiries:</strong> long enough to help you, plus a reasonable
            time afterward so we have a record of our conversations.
          </li>
          <li>
            <strong>If someone becomes a client:</strong> as part of their care records, for as long
            as the law requires.
          </li>
          <li>
            <strong>Your text-message choices and opt-outs:</strong> for as long as we text you, and
            for some time after, so we can show we followed the rules. If you opt out, we keep a
            note of it so we don&apos;t text you again by mistake.
          </li>
        </ul>
        <p>
          When we no longer need information, we delete it or remove the details that identify you.
        </p>
        <Pending>
          [TO CONFIRM: retention periods to publish, e.g. &ldquo;Inquiries that don&apos;t become
          clients: deleted after 3 years.&rdquo;]
        </Pending>
      </>
    ),
  },
  {
    id: "security",
    title: "How we protect it",
    body: (
      <>
        <ul>
          <li>Our website uses a secure connection (HTTPS — the padlock in your browser).</li>
          <li>
            Information you send through our forms goes straight into our customer system. It
            isn&apos;t stored on our website.
          </li>
          <li>Only the people at Dawson who need your information can see it.</li>
          <li>We use well-known service providers with their own security safeguards.</li>
        </ul>
        <p>
          No website or system is perfectly secure. If a security problem ever affects your
          information, we&apos;ll tell you as the law requires.
        </p>
      </>
    ),
  },
  {
    id: "about-others",
    title: "Information about someone else",
    body: (
      <>
        <p>
          Most families contact us about someone they love. Please share only what we need to call
          you back, and check with your loved one if you can.
        </p>
        <p>
          Healthcare professionals who refer a client must confirm they have the client&apos;s or
          family&apos;s permission to share their information.
        </p>
        <p>
          If someone has contacted us about you and you&apos;d like to know what we have, or ask us
          to delete it, contact us. We&apos;re glad to help.
        </p>
      </>
    ),
  },
  {
    id: "children",
    title: "Children",
    body: (
      <p>
        Our website is for adults looking for care for themselves or someone they love. It
        isn&apos;t directed to children under 13, and we don&apos;t knowingly collect information
        from them. If you think a child has sent us information, contact us and we&apos;ll delete
        it.
      </p>
    ),
  },
  {
    id: "your-choices",
    title: "Your choices",
    body: (
      <>
        <p>
          <strong>Stop texts.</strong> Reply STOP to any text from us. You can also call or email us
          and ask.
        </p>
        <p>
          <strong>Stop emails.</strong> Use the unsubscribe link at the bottom of any email from us,
          or ask us.
        </p>
        <p>
          <strong>See, correct or delete your information.</strong> Call or email us. We&apos;ll
          confirm who you are first, to protect your privacy. We may need to keep some records — for
          example, a note that you opted out of texts, or care records the law requires us to keep —
          and we&apos;ll tell you if so.
        </p>
        <p>
          <strong>Cookies.</strong> Your browser settings let you block or delete cookies.
          {analytics === "ga4-ads" && (
            <>
              {" "}
              Use <strong>Cookie settings</strong> at the bottom of any page to change your choice.
            </>
          )}
        </p>
      </>
    ),
  },
  {
    id: "other-websites",
    title: "Links to other websites",
    body: (
      <p>
        Our site links to other websites, such as Hireology (where you apply for jobs with us),
        Google Maps and Instagram. We don&apos;t control those sites. Their own privacy policies
        apply when you use them.
      </p>
    ),
  },
  {
    id: "changes",
    title: "Changes to this policy",
    body: (
      <p>
        If we change this policy, we&apos;ll post the new version here and update the date at the
        top. If we ever change how we use phone numbers or texts in a way that matters, we&apos;ll
        ask for your consent again before texting you under the new terms.
      </p>
    ),
  },
  {
    id: "contact",
    title: "Contact us",
    body: (
      <>
        <p>Questions about your privacy? We&apos;re happy to talk.</p>
        <ContactBlock />
      </>
    ),
  },
];

/** Privacy Policy (COPY_LEGAL §2). JSON-LD: breadcrumbs only. */
export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      path="/privacy-policy"
      title="Privacy Policy"
      lead="This page explains what information Dawson and Dawson Home Care LLC collects through our website and text messages, why we collect it, and the choices you have. We've kept it in plain language."
      updated={legal.updated.privacy}
      short={[
        "We collect only what we need to help your family: usually your name, your phone number and a little about the care you're looking for.",
        "We use it to get back to you and plan care. We don't sell it.",
        "We never sell or share your phone number or text-message consent with anyone for their marketing.",
        "Texts from us are optional. Reply STOP at any time.",
        "Please don't send medical details through our website. We'll talk about care needs by phone.",
        <>
          Questions? Call <a href={`tel:${phone.tel}`}>{phone.display}</a> or email{" "}
          <a href={`mailto:${email}`}>{email}</a>.
        </>,
      ]}
      sections={sections}
    />
  );
}
