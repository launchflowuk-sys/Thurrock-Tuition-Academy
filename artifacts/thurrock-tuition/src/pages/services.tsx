// Ported verbatim from the approved design handover
// (Thurrock-Tuition-Claude-Code-Handover/reference/dist/services).
// Structure, class names, copy and inline SVG are the reference's; only
// links are routed through wouter. Styling lives in src/styles/tta-public.css.
import { Link } from "wouter";
import PublicShell from "@/components/public/public-shell";

export default function ServicesPage() {
  return (
    <PublicShell active="C:/Program Files/Git/services">

      <section className="page-hero">
      <div className="wrap">
      <div className="breadcrumb">
      <Link href="/">Home</Link>
      <span>/</span>
      <span>Our tuition</span>
      </div>
      <div className="eyebrow">Our tuition</div>
      <h1>Every stage.<br />A clearer way forward.</h1>
      <p className="lead">Specialist Maths, English and Science support, from primary school to A-Level. Small groups, individual attention and a plan that makes sense for your child.</p>
      <nav className="subnav" aria-label="Tuition sections">
      <a href="#maths">Mathematics</a>
      <a href="#english">English</a>
      <a href="#science">Science</a>
      <a href="#pricing">Session pricing</a>
      </nav>
      </div>
      </section>
      <section className="section wrap" id="journey">
      <div className="section-head">
      <div>
      <div className="eyebrow">Your child’s time at TTA</div>
      <h2>From the first hello<br />to the next milestone.</h2>
      </div>
      <p>Consistent support in the session, between lessons and as exams approach.</p>
      </div>
      <div className="journey">
      <div>
      <span className="num">01 /</span>
      <h3>A free assessment</h3>
      <p>We listen, assess your child’s starting point and recommend the right support.</p>
      </div>
      <div>
      <span className="num">02 /</span>
      <h3>A personal plan</h3>
      <p>The teaching follows their needs, target grades and exam board.</p>
      </div>
      <div>
      <span className="num">03 /</span>
      <h3>Weekly sessions</h3>
      <p>Focused two-hour sessions with no more than eight students.</p>
      </div>
      <div>
      <span className="num">04 /</span>
      <h3>Homework & tasks</h3>
      <p>Targeted practice between sessions keeps learning moving.</p>
      </div>
      <div>
      <span className="num">05 /</span>
      <h3>Progress updates</h3>
      <p>Follow session notes, homework and progress in the parent portal.</p>
      </div>
      <div>
      <span className="num">06 /</span>
      <h3>Exam preparation</h3>
      <p>Past papers, timing and question technique help students feel ready.</p>
      </div>
      </div>
      </section>
      <div className="wrap" id="subjects">
      <section className="programme-guide" id="maths">
      <div>
      <div className="eyebrow">Programme guide</div>
      <h2>Mathematics</h2>
      <p>From number bonds to calculus.</p>
      <div className="actions">
      <Link className="btn outline" href="/contact">Ask about mathematics<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <path d="M4 12h15m-6-6 6 6-6 6" />
      </svg>
      </Link>
      </div>
      </div>
      <div className="course">
      <details open>
      <summary>SATs · Years 5–6</summary>
      <p>Build fluency in number, fractions, geometry, measurement and statistics, with focused preparation for KS2 assessments.</p>
      <ul>
      <li>Arithmetic and reasoning papers</li>
      <li>Times tables and problem-solving</li>
      <li>Targeted work on gaps</li>
      <li>Timed practice with past SATs papers</li>
      </ul>
      </details>
      <details>
      <summary>11+ preparation</summary>
      <p>Prepare for the Maths and reasoning demands of grammar and independent school entrance tests. We tailor preparation to the target school.</p>
      <ul>
      <li>Core Maths skills</li>
      <li>Speed and accuracy</li>
      <li>Verbal and non-verbal reasoning where required</li>
      <li>Mock exam practice</li>
      </ul>
      </details>
      <details>
      <summary>KS3 · Years 7–9</summary>
      <p>Consolidate the ideas that make GCSE Maths easier to understand, and develop good habits early.</p>
      <ul>
      <li>Algebra, equations and graphs</li>
      <li>Geometry and trigonometry foundations</li>
      <li>Data handling and statistics</li>
      <li>Building GCSE readiness</li>
      </ul>
      </details>
      <details>
      <summary>GCSE · Foundation & Higher</summary>
      <p>Cover the AQA, Edexcel and OCR specifications with structured topic teaching and regular exam practice.</p>
      <ul>
      <li>Foundation and Higher tiers</li>
      <li>Full specification coverage</li>
      <li>Past papers and question technique</li>
      <li>Working towards your target grade</li>
      </ul>
      </details>
      <details>
      <summary>A-Level Mathematics</summary>
      <p>Specialist support for AS and A2 students, from consolidating core ideas to tackling extended problems.</p>
      <ul>
      <li>Pure Mathematics</li>
      <li>Statistics and Mechanics</li>
      <li>AQA, Edexcel and OCR</li>
      <li>Extended problem solving and university preparation</li>
      </ul>
      </details>
      </div>
      </section>
      <section className="programme-guide" id="english">
      <div>
      <div className="eyebrow">Programme guide</div>
      <h2>English</h2>
      <p>Reading, writing and a confident voice.</p>
      <div className="actions">
      <Link className="btn outline" href="/contact">Ask about english<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <path d="M4 12h15m-6-6 6 6-6 6" />
      </svg>
      </Link>
      </div>
      </div>
      <div className="course">
      <details open>
      <summary>SATs · Years 5–6</summary>
      <p>Build confidence with comprehension, spelling, punctuation and grammar for KS2 assessments.</p>
      <ul>
      <li>Reading comprehension strategies</li>
      <li>Spelling, punctuation and grammar</li>
      <li>Inference and deduction</li>
      <li>Clear, structured writing</li>
      </ul>
      </details>
      <details>
      <summary>11+ English</summary>
      <p>Develop the comprehension, vocabulary and writing skills needed for school entrance exams.</p>
      <ul>
      <li>Comprehension and inference</li>
      <li>Creative and descriptive writing</li>
      <li>Vocabulary development</li>
      <li>Verbal reasoning techniques</li>
      </ul>
      </details>
      <details>
      <summary>KS3 & GCSE</summary>
      <p>Understand texts, form an argument and communicate ideas clearly across English Language and Literature.</p>
      <ul>
      <li>Language and Literature papers</li>
      <li>Essay structure and analysis</li>
      <li>Spoken language preparation</li>
      <li>AQA and Edexcel coverage</li>
      </ul>
      </details>
      </div>
      </section>
      <section className="programme-guide" id="science">
      <div>
      <div className="eyebrow">Programme guide</div>
      <h2>Science</h2>
      <p>Biology, Chemistry and Physics.</p>
      <div className="actions">
      <Link className="btn outline" href="/contact">Ask about science<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <path d="M4 12h15m-6-6 6 6-6 6" />
      </svg>
      </Link>
      </div>
      </div>
      <div className="course">
      <details open>
      <summary>KS3 Science</summary>
      <p>Create a solid foundation across all three sciences before the step up to GCSE.</p>
      <ul>
      <li>Biology, Chemistry and Physics</li>
      <li>Scientific method and investigation</li>
      <li>Core topics and key ideas</li>
      <li>Practical skills</li>
      </ul>
      </details>
      <details>
      <summary>GCSE · Combined & Triple</summary>
      <p>Study the specification in depth, then apply that understanding to calculations, practicals and exam questions.</p>
      <ul>
      <li>All three science disciplines</li>
      <li>Required practicals</li>
      <li>Calculation skills and exam technique</li>
      <li>AQA, Edexcel and OCR</li>
      </ul>
      </details>
      </div>
      </section>
      </div>
      <section className="section pricing" id="pricing">
      <div className="wrap">
      <div className="section-head">
      <div>
      <div className="eyebrow">Clear fees. Flexible commitment.</div>
      <h2>Good teaching.<br />Straightforward pricing.</h2>
      </div>
      <p>Two hours of focused tuition. Pay per session, on the day.</p>
      </div>
      <div className="price-grid">
      <div className="price">
      <h3>SATs</h3>
      <strong>£35–40</strong>
      <p>per 2-hour session</p>
      <p>Years 5–6</p>
      </div>
      <div className="price">
      <h3>11+</h3>
      <strong>£40–45</strong>
      <p>per 2-hour session</p>
      <p>Entrance exams</p>
      </div>
      <div className="price">
      <h3>KS3</h3>
      <strong>£45–50</strong>
      <p>per 2-hour session</p>
      <p>Years 7–9</p>
      </div>
      <div className="price">
      <h3>GCSE</h3>
      <strong>£50–60</strong>
      <p>per 2-hour session</p>
      <p>Years 10–11</p>
      </div>
      <div className="price">
      <h3>A-Level</h3>
      <strong>£70–80</strong>
      <p>per 2-hour session</p>
      <p>Sixth form</p>
      </div>
      </div>
      <div className="price-note">
      <p>
      <b>Your first assessment is free.</b> Includes a baseline test, parent consultation, personal learning plan and written targets.</p>
      <p>
      <b>Pay as you go.</b> Cash or bank transfer. No contracts, direct debits or minimum term. Confirm your programme’s fee with the academy.</p>
      </div>
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
