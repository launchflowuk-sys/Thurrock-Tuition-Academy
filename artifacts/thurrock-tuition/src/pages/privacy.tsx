import { Link } from "wouter";
import PublicShell from "@/components/public/public-shell";
import { CookieSettingsLink } from "@/components/public/cookie-banner";

/**
 * Privacy & cookie notice.
 *
 * Exists because the consent banner has to link somewhere: under the UK GDPR
 * transparency duty (Art. 13) a banner that asks for consent without saying
 * what is collected, why, and for how long is not informed consent.
 *
 * This academy teaches children, so the notice is written to be read by a
 * parent rather than a lawyer, and says plainly where children's data is
 * involved. It states what the code actually does — the field list matches
 * the application form, and the cookie table matches what the app really sets.
 * If either changes, this page changes with it.
 *
 * It is not legal advice; Shoji should have the retention periods and the ICO
 * registration line checked before relying on them.
 */

const UPDATED = "9 September 2026";

export default function PrivacyPage() {
  return (
    <PublicShell active="/privacy">
      <section className="page-hero">
        <div className="wrap">
          <div className="breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <span>Privacy &amp; cookies</span>
          </div>
          <div className="eyebrow">Your privacy</div>
          <h1>Privacy &amp; cookie notice</h1>
          <p className="lead">
            What we collect when you apply for tuition, why we need it, how long we keep it, and
            the choices you have. Written to be read, not skimmed past.
          </p>
        </div>
      </section>

      <section className="section wrap">
        <div className="legal">
          <span className="updated">Last updated {UPDATED}</span>

          <h2>Who we are</h2>
          <p>
            Thurrock Tuition Academy provides in-person tuition from Suite 1, Queensgate Centre,
            Orsett Road, Grays, Thurrock RM17 5DF. We are the data controller for the information
            described here. To ask anything about your data, email{" "}
            <a href="mailto:bookings@thurrocktuitionacademy.co.uk">
              bookings@thurrocktuitionacademy.co.uk
            </a>{" "}
            or call 07480 413679.
          </p>

          <h2>What we collect, and why</h2>
          <p>
            Almost everything we hold comes from you, when you complete the assessment application
            form or when your child becomes a student. We do not buy data and we do not track you
            across other websites.
          </p>

          <h3>About the child</h3>
          <p>
            Their name, age, year group, current school, the subject and level they need, their
            current attainment, and any SEN or additional needs you choose to tell us about. We use
            this to place the child with the right tutor and to plan their first assessment. Because
            this is a child&rsquo;s data we hold only what teaching them actually requires, and SEN
            details are optional.
          </p>

          <h3>About you, the parent or guardian</h3>
          <p>
            Your name, your relationship to the child, your email address, your phone numbers, and
            how you would prefer to be contacted. We use these to reach you about your
            child&rsquo;s tuition — arranging the assessment, confirming sessions, sending progress
            notes, and taking payment.
          </p>

          <h3>Tuition records</h3>
          <p>
            Once a child is a student we also hold attendance, progress notes, tasks set, and
            payment records. Card details are never stored by us: payments are processed by Square,
            and we keep only a payment reference and the amount.
          </p>

          <h2>Our legal basis</h2>
          <ul>
            <li>
              <strong>Contract</strong> — arranging and delivering the tuition you asked for,
              including the free assessment, session bookings and invoicing.
            </li>
            <li>
              <strong>Consent</strong> — optional marketing emails, and optional analytics cookies.
              You can withdraw either at any time, and withdrawing changes nothing about the tuition
              your child receives.
            </li>
            <li>
              <strong>Legal obligation</strong> — keeping financial records, and our safeguarding
              duties as a provider working with children.
            </li>
          </ul>

          <h2>Who we share it with</h2>
          <p>
            We do not sell your data or your child&rsquo;s, ever. We share it only with the
            suppliers that make the service work: our email provider, so we can write to you; Square,
            to take card payments; and our hosting provider, which stores the database on servers in
            Europe. Each acts on our instructions and cannot use your data for anything else.
          </p>

          <h2>How long we keep it</h2>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th scope="col">What</th>
                  <th scope="col">How long</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>An application that does not become tuition</td>
                  <td>12 months, then deleted</td>
                </tr>
                <tr>
                  <td>Student and parent records, progress notes</td>
                  <td>While the child is a student, then 3 years</td>
                </tr>
                <tr>
                  <td>Payment and invoice records</td>
                  <td>7 years, as tax law requires</td>
                </tr>
                <tr>
                  <td>Marketing consent</td>
                  <td>Until you unsubscribe</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2>Cookies</h2>
          <p>
            A cookie is a small file a site stores in your browser. We use as few as we can, and we
            set nothing optional until you have said yes. Refusing the optional ones changes nothing
            about how the site works.
          </p>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th scope="col">Cookie</th>
                  <th scope="col">Purpose</th>
                  <th scope="col">Needs consent?</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Session cookie</td>
                  <td>
                    Keeps you signed in to the parent portal. Only set once you sign in, and it
                    expires when you sign out.
                  </td>
                  <td>No — strictly necessary</td>
                </tr>
                <tr>
                  <td>Your cookie choice</td>
                  <td>
                    Remembers the answer you gave the banner, so we do not ask on every page. Stored
                    in your browser only, and never sent to us.
                  </td>
                  <td>No — strictly necessary</td>
                </tr>
                <tr>
                  <td>Analytics</td>
                  <td>
                    Anonymous counts of which pages families read, so we know what to improve. Off
                    unless you accept.
                  </td>
                  <td>Yes</td>
                </tr>
                <tr>
                  <td>Marketing</td>
                  <td>
                    Measuring whether an advert brought you here. Off unless you accept.
                  </td>
                  <td>Yes</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            You can change your mind whenever you like: <CookieSettingsLink /> reopens the banner
            with your current choices. Clearing your browser&rsquo;s site data also resets it, and
            we will ask again.
          </p>

          <h2>Your rights</h2>
          <p>
            You can ask us for a copy of the information we hold about you or your child, ask us to
            correct it, ask us to delete it, or object to a particular use. Email{" "}
            <a href="mailto:bookings@thurrocktuitionacademy.co.uk">
              bookings@thurrocktuitionacademy.co.uk
            </a>{" "}
            and we will reply within one month. If you are a parent asking on behalf of your child,
            just say so and we will confirm your relationship before we release anything.
          </p>
          <p>
            If you are unhappy with how we have handled your data you can complain to the
            Information Commissioner&rsquo;s Office at{" "}
            <a href="https://ico.org.uk/make-a-complaint/" rel="noopener noreferrer">
              ico.org.uk/make-a-complaint
            </a>{" "}
            or on 0303 123 1113. We would rather you told us first, so we can put it right.
          </p>

          <h2>Changes to this notice</h2>
          <p>
            If we change what we collect or why, we will update this page and, where the change
            matters, ask for your consent again. The date at the top always reflects the current
            version.
          </p>
        </div>
      </section>
    </PublicShell>
  );
}
