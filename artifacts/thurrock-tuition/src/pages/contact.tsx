// Ported verbatim from the approved design handover
// (Thurrock-Tuition-Claude-Code-Handover/reference/dist/contact).
// Structure, class names, copy and inline SVG are the reference's; only
// links are routed through wouter. Styling lives in src/styles/tta-public.css.
import { Link } from "wouter";
import PublicShell from "@/components/public/public-shell";
import AssessmentForm from "@/components/public/assessment-form";

export default function ContactPage() {
  return (
    <PublicShell active="/contact">

      <section className="page-hero">
      <div className="wrap">
      <div className="breadcrumb">
      <Link href="/">Home</Link>
      <span>/</span>
      <span>Contact & assessment</span>
      </div>
      <div className="eyebrow">Contact & assessment</div>
      <h1>Their next chapter<br />starts with a conversation.</h1>
      <p className="lead">Tell us a little about your child. We’ll help you find the right starting point, with a free assessment and no pressure to commit.</p>
      </div>
      </section>
      <section className="section wrap">
      <div className="contact-grid">
      <div className="book-panel">
      <div className="eyebrow">Free initial assessment</div>
      <h2>Let’s make a plan<br />for your child.</h2>
      <p>The application takes around three minutes. The academy will review your child’s details and get in touch to arrange their free two-hour assessment.</p>
      <ul className="included">
      <li>
      <span className="tick" aria-hidden="true">✓</span>
      <div>
      <strong>Baseline assessment</strong>
      <p>Find out what your child understands and where they need a little more help.</p>
      </div>
      </li>
      <li>
      <span className="tick" aria-hidden="true">✓</span>
      <div>
      <strong>A conversation with you</strong>
      <p>Talk through their goals, challenges and the exams ahead.</p>
      </div>
      </li>
      <li>
      <span className="tick" aria-hidden="true">✓</span>
      <div>
      <strong>A personal learning plan</strong>
      <p>A clear route shaped around their level, exam board and target.</p>
      </div>
      </li>
      <li>
      <span className="tick" aria-hidden="true">✓</span>
      <div>
      <strong>Written targets report</strong>
      <p>Know their starting point and the milestones we’ll work towards.</p>
      </div>
      </li>
      </ul>
      <AssessmentForm />
      <p className="subtle">Prefer a chat first? <a className="textlink" href="tel:+447480413679">Call 07480 413679</a>
      </p>
      </div>
      <div>
      <aside className="contact-aside">
      <h3>We’re here to help.</h3>
      <div className="contact-item">
      <small>Call the academy</small>
      <a href="tel:+447480413679">07480 413679</a>
      </div>
      <div className="contact-item">
      <small>Email us</small>
      <a href="mailto:bookings@thurrocktuitionacademy.co.uk">bookings@thurrocktuitionacademy.co.uk</a>
      </div>
      <div className="contact-item">
      <small>Visit us</small>
      <p>Suite 1, Queensgate Centre<br />Orsett Road, Grays<br />Thurrock, Essex</p>
      </div>
      <a className="btn " href="https://wa.me/447480413679">Message us on WhatsApp<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <path d="M4 12h15m-6-6 6 6-6 6" />
      </svg>
      </a>
      </aside>
      <div className="opening">
      <h3>Find a time that works.</h3>
      <p>Two-hour sessions, Monday to Saturday. Ask us for the current subject timetable.</p>
      <div className="slots">
      <span>9–11am</span>
      <span>11am–1pm</span>
      <span>1–3pm</span>
      <span>3–5pm</span>
      </div>
      </div>
      </div>
      </div>
      </section>
      <section className="section wrap" id="faq">
      <div className="faq-layout">
      <div className="faq-intro">
      <div className="eyebrow">For parents</div>
      <h2>A few things<br />you might be wondering.</h2>
      <p>Choosing tuition is a big decision. We’re happy to talk it through.</p>
      <a className="textlink" href="tel:+447480413679">Call 07480 413679 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <path d="M4 12h15m-6-6 6 6-6 6" />
      </svg>
      </a>
      </div>
      <div className="faqs">
      <details>
      <summary>How does the free assessment work?</summary>
      <p>Your child is invited for a free two-hour session. We assess their current level, identify the gaps, discuss their goals with you and provide a personalised learning plan and written targets. There is no obligation to continue.</p>
      </details>
      <details>
      <summary>How many children are in a session?</summary>
      <p>Sessions have a maximum of eight students. Small groups give every child time to ask questions and receive individual attention.</p>
      </details>
      <details>
      <summary>Which exam boards do you cover?</summary>
      <p>We support AQA, Edexcel, OCR and Eduqas, depending on the subject and level. Tell us your child’s school and exam board so we can tailor the programme. For 11+, speak to us about the current requirements of your target school.</p>
      </details>
      <details>
      <summary>When do sessions take place?</summary>
      <p>Sessions run Monday to Saturday in two-hour slots: 9–11am, 11am–1pm, 1–3pm and 3–5pm. Days vary by subject. Contact the academy for the current timetable and availability.</p>
      </details>
      <details>
      <summary>How do payments work?</summary>
      <p>Pay on the day by cash or bank transfer. There are no long-term contracts, direct debits or minimum terms. See our session pricing for the published fee ranges.</p>
      </details>
      <details>
      <summary>Can my child join partway through the year?</summary>
      <p>Yes. Students can join at any point in the academic year. The free assessment helps us build a plan around where they are now and the time available before their exams.</p>
      </details>
      <details>
      <summary>Do you offer one-to-one tuition?</summary>
      <p>Our teaching is group-based, with no more than eight students per session. Please contact the academy if you would like to discuss a particular learning need.</p>
      </details>
      <details>
      <summary>Where is the academy based?</summary>
      <p>Find us at Suite 1, Queensgate Centre, Orsett Road, Grays, Thurrock. Free parking is available on site. We welcome families across Thurrock and from surrounding areas including Basildon, Brentwood and Dartford.</p>
      </details>
      </div>
      </div>
      </section>
      <section className="wrap section" id="find-us">
      <div className="contact-map">
      <div>
      <div className="eyebrow">Find the academy</div>
      <h2>Right here in Grays.<br />Here for all of Thurrock.</h2>
      <p>Free parking at Queensgate Centre. We welcome families from across the borough, as well as Basildon, Brentwood and Dartford.</p>
      <div className="area-links">
      <Link href="/contact#find-us">Grays</Link>
      <Link href="/contact#find-us">Tilbury</Link>
      <Link href="/contact#find-us">Chafford Hundred</Link>
      <Link href="/contact#find-us">Stanford-le-Hope</Link>
      <Link href="/contact#find-us">Corringham</Link>
      <Link href="/contact#find-us">South Ockendon</Link>
      <Link href="/contact#find-us">Aveley</Link>
      <Link href="/contact#find-us">West Thurrock</Link>
      <Link href="/contact#find-us">Purfleet</Link>
      <Link href="/contact#find-us">Chadwell St Mary</Link>
      <Link href="/contact#find-us">North Stifford</Link>
      <Link href="/contact#find-us">Orsett</Link>
      <Link href="/contact#find-us">East Tilbury</Link>
      <Link href="/contact#find-us">Badgers Dene</Link>
      </div>
      </div>
      <div className="address-panel">
      <h3>Queensgate Centre</h3>
      <p>Suite 1, Orsett Road<br />Grays, Thurrock, Essex</p>
      <a className="btn dark" href="https://www.google.com/maps/search/?api=1&query=Queensgate+Centre+Orsett+Road+Grays">Get directions<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <path d="M4 12h15m-6-6 6 6-6 6" />
      </svg>
      </a>
      <p style={{ fontSize: ".85rem" }}>Call us if you need help finding your way.</p>
      </div>
      </div>
      </section>

    </PublicShell>
  );
}
