// Ported verbatim from the approved design handover
// (Thurrock-Tuition-Claude-Code-Handover/reference/dist/home).
// Structure, class names, copy and inline SVG are the reference's; only
// links are routed through wouter. Styling lives in src/styles/tta-public.css.
import { Link } from "wouter";
import PublicShell from "@/components/public/public-shell";
import ReviewsSection from "@/components/public/reviews-section";

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

export default function LandingPage() {
  return (
    <PublicShell active="/">

      <section className="wrap hero">
      <div className="hero-copy reveal">
      <div className="eyebrow">Small-group tuition in Grays, Essex</div>
      <h1>Big futures.<br />Start with a little<br />
      <em>confidence.</em>
      </h1>
      <p className="lead">When learning clicks, everything changes. Expert Maths, English and Science tuition that helps your child feel capable — in the classroom and beyond.</p>
      <div className="actions">
      <Link className="btn " href="/contact">Book a free assessment<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <path d="M4 12h15m-6-6 6 6-6 6" />
      </svg>
      </Link>
      <Link className="btn outline" href="/services">Explore our tuition<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <path d="M4 12h15m-6-6 6 6-6 6" />
      </svg>
      </Link>
      </div>
      <div className="hero-foot">
      <span>
      <span className="check">✓</span> No obligation</span>
      <span>
      <span className="check">✓</span> Personal learning plan</span>
      </div>
      </div>
      <div className="hero-media reveal">
      <picture>
        <source srcSet={`${basePath}/img/lesson.webp`} type="image/webp" />
        <img src={`${basePath}/img/lesson.jpg`} alt="Students listening and learning during a classroom lesson" width="1400" height="871" fetchPriority="high" decoding="async" />
      </picture>
      <div className="photo-label">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 10c0 6-8 11-8 11S4 16 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="2.5" />
      </svg> Grays, Thurrock</div>
      <div className="photo-note">
      <span className="eight">8</span>
      <div>
      <strong>Small groups. Bigger possibilities.</strong>
      <p>A maximum of eight students in every session.</p>
      </div>
      <span className="note-icon">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="9" cy="7" r="3" />
      <path d="M3 21v-3a6 6 0 0 1 12 0v3m1-17a3 3 0 0 1 0 6m2 5a5 5 0 0 1 3 4v2" />
      </svg>
      </span>
      </div>
      </div>
      </section>
      <div className="proof-band">
      <div className="wrap proof">
      <div>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6Z" />
      <path d="m8 12 3 3 5-6" />
      </svg>
      <div>
      <strong>Qualified, DBS checked</strong>
      <small>Teaching you can trust</small>
      </div>
      </div>
      <div>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="9" cy="7" r="3" />
      <path d="M3 21v-3a6 6 0 0 1 12 0v3m1-17a3 3 0 0 1 0 6m2 5a5 5 0 0 1 3 4v2" />
      </svg>
      <div>
      <strong>Small groups. Real attention.</strong>
      <small>A maximum of 8 students</small>
      </div>
      </div>
      <div>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 6C9 3 4 3 2 4v15c3-1 7-1 10 2 3-3 7-3 10-2V4c-3-1-7-1-10 2Zm0 0v15" />
      </svg>
      <div>
      <strong>From SATs to A-Level</strong>
      <small>Support at every stage</small>
      </div>
      </div>
      <div>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 3v17h17M8 15l4-5 4 2 5-8" />
      </svg>
      <div>
      <strong>Progress you can follow</strong>
      <small>Regular updates for parents</small>
      </div>
      </div>
      </div>
      </div>
      <section className="section wrap" id="programmes">
      <div className="section-head">
      <div>
      <div className="eyebrow">The right support, at the right stage</div>
      <h2>Where is your child<br />on their learning journey?</h2>
      </div>
      <Link className="textlink" href="/services">View all tuition <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <path d="M4 12h15m-6-6 6 6-6 6" />
      </svg>
      </Link>
      </div>
      <div className="programmes">
      <Link className="programme " href="/services#maths">
      <span className="level">Years 5–6</span>
      <h3>SATs</h3>
      <p>A confident finish to primary school.</p>
      <span className="bottom">Explore tuition <span className="round" aria-hidden="true">↗</span>
      </span>
      </Link>
      <Link className="programme " href="/services#maths">
      <span className="level">Entrance exams</span>
      <h3>11+</h3>
      <p>Make the next school feel within reach.</p>
      <span className="bottom">Explore tuition <span className="round" aria-hidden="true">↗</span>
      </span>
      </Link>
      <Link className="programme " href="/services#subjects">
      <span className="level">Years 7–9</span>
      <h3>KS3</h3>
      <p>Strong foundations for what comes next.</p>
      <span className="bottom">Explore tuition <span className="round" aria-hidden="true">↗</span>
      </span>
      </Link>
      <Link className="programme featured" href="/services#subjects">
      <span className="level">Years 10–11</span>
      <h3>GCSE</h3>
      <p>Clearer understanding. Better exam technique.</p>
      <span className="bottom">Explore tuition <span className="round" aria-hidden="true">↗</span>
      </span>
      </Link>
      <Link className="programme " href="/services#maths">
      <span className="level">Sixth form</span>
      <h3>A-Level</h3>
      <p>Maths support for the next big step.</p>
      <span className="bottom">Explore tuition <span className="round" aria-hidden="true">↗</span>
      </span>
      </Link>
      </div>
      <p className="subject-note">Maths · English · Science &nbsp; / &nbsp; Two-hour sessions · Pay as you go</p>
      </section>
      <section className="wrap">
      <div className="approach">
      <div className="approach-image">
      <picture>
        <source srcSet={`${basePath}/img/study.webp`} type="image/webp" />
        <img src={`${basePath}/img/study.jpg`} alt="Open books and study notes on a desk" width="1000" height="667" loading="lazy" decoding="async" />
      </picture>
      </div>
      <div className="approach-copy">
      <div className="eyebrow">The Thurrock difference</div>
      <h2>More than answers.<br />Real understanding.</h2>
      <p>A quiet question. A second explanation. That moment when it finally makes sense. We make room for the things that help children learn.</p>
      <div className="feature-row">
      <span className="num">01</span>
      <div>
      <h3>Teaching that starts with your child</h3>
      <p>A personal plan shaped around their strengths, gaps and goals.</p>
      </div>
      </div>
      <div className="feature-row">
      <span className="num">02</span>
      <div>
      <h3>Confidence comes with practice</h3>
      <p>Patient explanations, targeted homework and exam preparation.</p>
      </div>
      </div>
      <div className="feature-row">
      <span className="num">03</span>
      <div>
      <h3>You’re part of the progress</h3>
      <p>Session notes, regular updates and a direct line to the team.</p>
      </div>
      </div>
      <Link className="textlink" href="/about">Get to know the academy <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <path d="M4 12h15m-6-6 6 6-6 6" />
      </svg>
      </Link>
      </div>
      </div>
      </section>
      <section className="section wrap">
      <div className="section-head">
      <div>
      <div className="eyebrow">Subjects we teach</div>
      <h2>Make the difficult<br />feel doable.</h2>
      </div>
      <p>Specialist teaching, with the right level of challenge and plenty of encouragement.</p>
      </div>
      <div className="subject-grid">
      <Link className="subject-card" href="/services#maths">
      <div className="subject-symbol" aria-hidden="true">x² + y²</div>
      <h3>Mathematics</h3>
      <p>From number bonds to calculus. Build understanding, accuracy and problem-solving skills.</p>
      <div className="tags">
      <span className="tag">SATs</span>
      <span className="tag">11+</span>
      <span className="tag">KS3</span>
      <span className="tag">GCSE</span>
      <span className="tag">A-Level</span>
      </div>
      </Link>
      <Link className="subject-card" href="/services#english">
      <div className="subject-symbol" aria-hidden="true">Aa.</div>
      <h3>English</h3>
      <p>Read between the lines. Find the right words. Develop a confident voice on the page.</p>
      <div className="tags">
      <span className="tag">SATs</span>
      <span className="tag">11+</span>
      <span className="tag">KS3</span>
      <span className="tag">GCSE</span>
      </div>
      </Link>
      <Link className="subject-card" href="/services#science">
      <div className="subject-symbol" style={{ width: "40px" }} aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 3h6m-5 0v6l-6 10a1 1 0 0 0 1 2h14a1 1 0 0 0 1-2L14 9V3M7 15h10" />
      </svg>
      </div>
      <h3>Science</h3>
      <p>Connect the ideas behind Biology, Chemistry and Physics, then put them into practice.</p>
      <div className="tags">
      <span className="tag">KS3</span>
      <span className="tag">GCSE Combined</span>
      <span className="tag">Triple</span>
      </div>
      </Link>
      </div>
      </section>
      <section className="section assessment">
      <div className="wrap assessment-layout">
      <div>
      <div className="eyebrow">A good place to begin</div>
      <h2>Let’s understand<br />how your child learns.</h2>
      <p>Every new student starts with a free assessment. We take the time to listen, identify the gaps and make a plan together.</p>
      <div className="actions">
      <Link className="btn " href="/contact">Book a free assessment<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <path d="M4 12h15m-6-6 6 6-6 6" />
      </svg>
      </Link>
      </div>
      <p className="smallprint">Completely free. No obligation to continue.</p>
      </div>
      <div className="assessment-steps">
      <div className="assessment-step">
      <b>01</b>
      <h3>Baseline assessment</h3>
      <p>Find out what your child understands and where they need a little more help.</p>
      </div>
      <div className="assessment-step">
      <b>02</b>
      <h3>A conversation with you</h3>
      <p>Talk through their goals, challenges and the exams ahead.</p>
      </div>
      <div className="assessment-step">
      <b>03</b>
      <h3>A personal learning plan</h3>
      <p>A clear route shaped around their level, exam board and target.</p>
      </div>
      <div className="assessment-step">
      <b>04</b>
      <h3>Written targets report</h3>
      <p>Know their starting point and the milestones we’ll work towards.</p>
      </div>
      </div>
      </div>
      </section>
      <ReviewsSection />
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
      <summary>How do payments work?</summary>
      <p>Pay on the day by cash or bank transfer. There are no long-term contracts, direct debits or minimum terms. See our session pricing for the published fee ranges.</p>
      </details>
      <details>
      <summary>Can my child join partway through the year?</summary>
      <p>Yes. Students can join at any point in the academic year. The free assessment helps us build a plan around where they are now and the time available before their exams.</p>
      </details>
      </div>
      </div>
      </section>

    </PublicShell>
  );
}
