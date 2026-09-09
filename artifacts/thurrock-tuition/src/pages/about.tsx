// Ported verbatim from the approved design handover
// (Thurrock-Tuition-Claude-Code-Handover/reference/dist/about).
// Structure, class names, copy and inline SVG are the reference's; only
// links are routed through wouter. Styling lives in src/styles/tta-public.css.
import { Link } from "wouter";
import PublicShell from "@/components/public/public-shell";

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

export default function AboutPage() {
  return (
    <PublicShell active="/about">

      <section className="page-hero">
      <div className="wrap">
      <div className="breadcrumb">
      <Link href="/">Home</Link>
      <span>/</span>
      <span>About the academy</span>
      </div>
      <div className="eyebrow">About the academy</div>
      <h1>A local academy.<br />A personal approach.</h1>
      <p className="lead">Rooted in Thurrock. Founded on the belief that the right teaching, a little patience and genuine encouragement can change how a child feels about learning.</p>
      </div>
      </section>
      <section className="section wrap">
      <div className="story">
      <picture>
        <source srcSet={`${basePath}/img/academy.webp`} type="image/webp" />
        <img src={`${basePath}/img/academy.jpg`} alt="A student browsing the shelves of a library" width="1600" height="1067" loading="lazy" decoding="async" />
      </picture>
      <div>
      <div className="eyebrow">Our story</div>
      <h2>Sometimes, all it takes<br />is someone who has time.</h2>
      <p>After years of teaching in schools, Khadija saw that students who struggled often needed more support, rather than more pressure. In a busy classroom, individual attention can be hard to find.</p>
      <p>She started tutoring to make space for patient explanations, questions and another attempt. A few sessions from home grew through word of mouth into Thurrock Tuition Academy.</p>
      <p>Today, that same personal approach is at the heart of our small-group teaching at Queensgate Centre in Grays.</p>
      </div>
      </div>
      </section>
      <section className="wrap mission-grid">
      <div className="mission" id="mission">
      <div className="eyebrow">Our mission</div>
      <h2>Help every child see<br />what they can do.</h2>
      <p>Give students across Thurrock access to expert, personalised tuition, whatever their starting point. Combine serious academic support with the encouragement to feel seen, heard and capable.</p>
      </div>
      <div className="mission" id="vision">
      <div className="eyebrow">Our vision</div>
      <h2>A stronger future<br />for our community.</h2>
      <p>Be a trusted place for families across Essex. Help students leave with more than better grades: the resilience, critical thinking and self-belief to take their next step.</p>
      </div>
      </section>
      <section className="section wrap">
      <div className="founder">
      <div className="founder-name">
      <span className="initial" aria-hidden="true">K.</span>
      <h3>Khadija</h3>
      <p>Founder & Lead Tutor</p>
      </div>
      <div className="founder-copy">
      <div className="eyebrow">Meet the founder</div>
      <h2>Great teaching.<br />With a human touch.</h2>
      <p>Khadija founded the academy with a simple belief: every child deserves excellent teaching. Her classroom and tutoring experience across Maths, English and Science informs a warm, structured approach to learning.</p>
      <p>A qualified teacher with enhanced DBS clearance, she works with families to make every student’s next step clear.</p>
      <div className="tags">
      <span className="tag">Qualified Teacher Status</span>
      <span className="tag">Enhanced DBS checked</span>
      </div>
      </div>
      </div>
      </section>
      <section className="section pricing">
      <div className="wrap">
      <div className="section-head">
      <div>
      <div className="eyebrow">What matters to us</div>
      <h2>Our values, in every lesson.</h2>
      </div>
      </div>
      <div className="journey">
      <div>
      <span className="num">01 /</span>
      <h3>Genuine care</h3>
      <p>We get to know the child, not just the grade. Their strengths, concerns and goals shape the way we teach.</p>
      </div>
      <div>
      <span className="num">02 /</span>
      <h3>High standards</h3>
      <p>The right challenge, with the encouragement and support to help students reach it.</p>
      </div>
      <div>
      <span className="num">03 /</span>
      <h3>A partnership with parents</h3>
      <p>Open communication, regular progress updates and room for your questions.</p>
      </div>
      <div>
      <span className="num">04 /</span>
      <h3>Confidence first</h3>
      <p>Students need to feel safe asking questions, making mistakes and trying again.</p>
      </div>
      <div>
      <span className="num">05 /</span>
      <h3>Expertise & preparation</h3>
      <p>Qualified teachers, careful planning and teaching aligned to the exam board.</p>
      </div>
      <div>
      <span className="num">06 /</span>
      <h3>Long-term growth</h3>
      <p>Study habits, critical thinking and self-belief that last beyond the next exam.</p>
      </div>
      </div>
      </div>
      </section>
      <section className="section wrap">
      <div className="section-head">
      <div>
      <div className="eyebrow">Growing with our community</div>
      <h2>The academy so far.</h2>
      </div>
      </div>
      <div className="timeline">
      <div>
      <b>2018</b>
      <p>Khadija begins tutoring local families from home in Grays.</p>
      </div>
      <div>
      <b>2020</b>
      <p>Online sessions extend support to students across Essex.</p>
      </div>
      <div>
      <b>2022</b>
      <p>The academy moves to Queensgate Centre for in-person group tuition.</p>
      </div>
      <div>
      <b>2023</b>
      <p>The parent portal brings progress, tasks and sessions together.</p>
      </div>
      <div>
      <b>2025</b>
      <p>The academy continues to grow, supporting more local families.</p>
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

    </PublicShell>
  );
}
