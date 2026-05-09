import { Link } from "wouter";
import PublicNav from "@/components/layout/public-nav";
import PublicFooter from "@/components/layout/public-footer";

const SERVICES = [
  {
    emoji: "🔢",
    subject: "Mathematics",
    tagline: "From Number Bonds to Calculus",
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop&q=80",
    levels: [
      {
        name: "SATs (KS2)",
        price: "£35–40",
        description: "We prepare Year 5 and Year 6 students for their KS2 SATs assessments, covering number, fractions, geometry, measurement and statistics. Our sessions combine past paper practice with targeted gap-filling.",
        includes: ["Arithmetic & reasoning paper prep", "Times tables consolidation", "Problem-solving strategies", "Past SATs papers under timed conditions"],
      },
      {
        name: "11+ Preparation",
        price: "£40–45",
        description: "Our 11+ maths programme covers all the topics tested in grammar school and independent school entrance exams, including verbal reasoning and non-verbal reasoning where required.",
        includes: ["GL Assessment & CEM format preparation", "Speed and accuracy training", "Verbal & non-verbal reasoning", "Mock exam practice"],
      },
      {
        name: "KS3 (Years 7–9)",
        price: "£45–50",
        description: "A strong KS3 foundation sets students up for GCSE success. We consolidate core concepts and introduce GCSE-level thinking early, giving students a real head start.",
        includes: ["Algebra, equations and graphs", "Geometry and trigonometry foundations", "Data handling and statistics", "Building GCSE readiness"],
      },
      {
        name: "GCSE",
        price: "£50–60",
        description: "Our GCSE Maths programme covers the full AQA, Edexcel and OCR specifications. We focus on the topics that carry the most marks and build strong exam technique throughout.",
        includes: ["Full specification coverage", "Foundation & Higher tier", "Past paper practice", "Grade boundary strategy"],
      },
      {
        name: "A-Level",
        price: "£70–80",
        description: "For AS and A2 students, we offer specialist tuition in Pure Maths, Statistics and Mechanics. Perfect for students targeting top universities or simply needing extra support.",
        includes: ["Pure, Statistics & Mechanics", "AQA, Edexcel & OCR coverage", "University preparation", "Extended problem-solving sessions"],
      },
    ],
  },
  {
    emoji: "📖",
    subject: "English",
    tagline: "Reading, Writing & Communication Skills",
    image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop&q=80",
    levels: [
      {
        name: "SATs (KS2)",
        price: "£35–40",
        description: "We help Year 5 and 6 students master reading comprehension, SPaG (Spelling, Punctuation & Grammar), and extended writing for their SATs assessments.",
        includes: ["Reading comprehension strategies", "SPaG rules and application", "Inference and deduction skills", "Extended writing structure"],
      },
      {
        name: "11+ English",
        price: "£40–45",
        description: "Our 11+ English programme targets the comprehension, creative writing and verbal reasoning components required for grammar and independent school entry.",
        includes: ["Comprehension & inference", "Creative and descriptive writing", "Vocabulary expansion", "Verbal reasoning techniques"],
      },
      {
        name: "KS3 & GCSE",
        price: "£45–60",
        description: "From Language to Literature, we help students analyse texts with confidence, write persuasively and structure essays to the highest exam standards.",
        includes: ["Language & Literature papers", "Essay structure and technique", "Spoken language preparation", "AQA & Edexcel coverage"],
      },
    ],
  },
  {
    emoji: "🔬",
    subject: "Science",
    tagline: "Biology, Chemistry & Physics",
    image: "https://images.unsplash.com/photo-1532094349884-543559c6f69d?w=800&auto=format&fit=crop&q=80",
    levels: [
      {
        name: "KS3",
        price: "£45–50",
        description: "We give KS3 students a solid grounding in all three science disciplines, making the transition to GCSE-level study smooth and manageable.",
        includes: ["Biology, Chemistry & Physics", "Scientific method and investigation", "Core topic consolidation", "Practical skills overview"],
      },
      {
        name: "GCSE Combined & Triple",
        price: "£50–60",
        description: "For both Combined Science and Triple Award, we cover the full specification in depth, with particular focus on required practicals, calculations and exam technique.",
        includes: ["All three science disciplines", "Required practicals", "Calculation skills", "AQA, Edexcel & OCR boards"],
      },
    ],
  },
];

const WHAT_TO_EXPECT = [
  { step: "01", title: "Free Assessment", body: "Every new student starts with a free, no-obligation assessment session. We identify strengths, gaps, and the right programme." },
  { step: "02", title: "Personalised Plan", body: "We build a structured study plan tailored to your child's exam board, target grades, and learning style." },
  { step: "03", title: "Weekly Sessions", body: "Group sessions of up to 8 students run regularly. Your child will receive focused teaching and individual attention throughout." },
  { step: "04", title: "Homework & Tasks", body: "Between sessions, students receive targeted homework through our parent portal. Progress is tracked every step of the way." },
  { step: "05", title: "Progress Reports", body: "Parents receive regular progress updates through the portal, including session notes, completed tasks, and grade trajectory." },
  { step: "06", title: "Exam Preparation", body: "As exams approach, we intensify past paper practice, exam technique coaching, and time management training." },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-background">
      <PublicNav />

      {/* Hero */}
      <section className="pt-32 pb-20 bg-[#1B2B6B] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1B2B6B] to-[#0f1a3e]" />
        <div
          className="absolute inset-0 opacity-10 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1600&auto=format&fit=crop&q=80')" }}
        />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-[#C9973A] font-semibold uppercase tracking-widest text-sm mb-4">What We Offer</p>
          <h1 className="text-5xl md:text-6xl font-bold font-serif text-white mb-6 text-balance">
            Our Tuition Services
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto leading-relaxed">
            Specialist tuition for every stage — from primary SATs through to A-Level. All sessions in Grays, Thurrock with qualified, DBS-checked tutors.
          </p>
        </div>
      </section>

      {/* What to Expect */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <p className="text-[#C9973A] font-semibold uppercase tracking-widest text-sm mb-3">The TTA Journey</p>
            <h2 className="text-4xl font-bold font-serif text-[#1B2B6B]">What to Expect</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {WHAT_TO_EXPECT.map(({ step, title, body }) => (
              <div key={step} className="p-6 rounded-2xl border border-border bg-background hover:shadow-md transition-all duration-200">
                <span className="text-5xl font-bold font-serif text-[#C9973A]/30">{step}</span>
                <h3 className="text-lg font-bold font-serif text-[#1B2B6B] mt-2 mb-2">{title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="subjects" className="py-20 bg-[#f3f4f8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <p className="text-[#C9973A] font-semibold uppercase tracking-widest text-sm mb-3">Subjects</p>
            <h2 className="text-4xl font-bold font-serif text-[#1B2B6B]">Detailed Programme Guide</h2>
          </div>

          <div className="space-y-20">
            {SERVICES.map(({ emoji, subject, tagline, image, levels }) => (
              <div key={subject} id={subject.toLowerCase()}>
                <div className="flex items-center gap-4 mb-8">
                  <span className="text-5xl">{emoji}</span>
                  <div>
                    <h2 className="text-3xl font-bold font-serif text-[#1B2B6B]">{subject}</h2>
                    <p className="text-muted-foreground">{tagline}</p>
                  </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-6 mb-4">
                  <div className="lg:col-span-1">
                    <img src={image} alt={subject} className="w-full h-56 object-cover rounded-2xl shadow-md" />
                  </div>
                  <div className="lg:col-span-2 grid sm:grid-cols-2 gap-4">
                    {levels.map(({ name, price, description, includes }) => (
                      <div key={name} className="bg-white p-5 rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-bold font-serif text-[#1B2B6B]">{name}</h3>
                          <span className="text-[#C9973A] font-bold text-sm shrink-0 ml-2">{price}<span className="text-xs text-muted-foreground font-normal">/session</span></span>
                        </div>
                        <p className="text-muted-foreground text-xs leading-relaxed mb-3">{description}</p>
                        <ul className="space-y-1">
                          {includes.map((inc) => (
                            <li key={inc} className="flex items-start gap-2 text-xs text-muted-foreground">
                              <span className="text-[#C9973A] mt-0.5 shrink-0">✓</span>
                              {inc}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Summary */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-[#C9973A] font-semibold uppercase tracking-widest text-sm mb-3">Transparent Pricing</p>
            <h2 className="text-4xl font-bold font-serif text-[#1B2B6B] mb-4">Session Fees</h2>
            <p className="text-muted-foreground">All sessions are 2 hours. Prices are per session, payable on the day.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { level: "SATs", price: "£35–40", desc: "KS2 · Maths & English" },
              { level: "11+", price: "£40–45", desc: "Entry exam prep" },
              { level: "KS3", price: "£45–50", desc: "Years 7, 8 & 9" },
              { level: "GCSE", price: "£50–60", desc: "All subjects" },
              { level: "A-Level", price: "£70–80", desc: "Maths specialist" },
            ].map(({ level, price, desc }) => (
              <div key={level} className="text-center p-6 rounded-2xl border border-border bg-background hover:border-[#1B2B6B]/30 hover:shadow-md transition-all duration-200">
                <h3 className="font-bold font-serif text-[#1B2B6B] text-xl mb-1">{level}</h3>
                <p className="text-3xl font-bold text-[#C9973A] mb-1">{price}</p>
                <p className="text-xs text-muted-foreground">{desc}</p>
                <p className="text-xs text-muted-foreground mt-1">per 2hr session</p>
              </div>
            ))}
          </div>

          <div className="mt-8 p-5 bg-[#1B2B6B]/5 rounded-2xl border border-[#1B2B6B]/15 text-center">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-[#1B2B6B]">First session is always free.</span>{" "}
              This includes an assessment, personalised feedback, and a recommended study plan — with no obligation to continue.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#1B2B6B]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-4xl font-bold font-serif text-white mb-4">Ready to Get Started?</h2>
          <p className="text-white/70 mb-8 text-lg">Book your free assessment session and find out exactly how we can help your child.</p>
          <Link
            href="/contact"
            className="inline-block bg-[#C9973A] hover:bg-[#b8872e] text-white font-bold px-10 py-4 rounded-xl text-lg shadow-xl hover:shadow-2xl transition-all duration-200 hover:-translate-y-0.5"
          >
            Book Free Assessment →
          </Link>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
