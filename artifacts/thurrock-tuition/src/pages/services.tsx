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
  { step: "01", title: "Free Assessment", body: "Every new student starts with a free, no-obligation assessment session. We identify strengths, gaps, and the right programme for your child." },
  { step: "02", title: "Personalised Plan", body: "We build a structured study plan tailored to your child's exam board, target grades, and learning style — before their first paid session." },
  { step: "03", title: "Saturday Sessions", body: "All sessions currently run on Saturdays in 2-hour blocks. Each subject group has around 10 students — giving meaningful individual attention at an accessible price." },
  { step: "04", title: "Homework & Tasks", body: "Between sessions, students receive targeted homework through our parent portal. Progress is tracked and visible to parents at any time." },
  { step: "05", title: "Progress Reports", body: "Parents receive regular updates through the portal — session notes, completed tasks, and grade trajectory all in one place." },
  { step: "06", title: "Exam Preparation", body: "As exams approach, we intensify past paper practice, exam technique coaching, and time management training to maximise marks." },
];

const TIMETABLE = [
  { time: "9:00am – 11:00am", group: "SATs & 11+", subjects: "Maths · English", tag: "Primary" },
  { time: "11:00am – 1:00pm", group: "GCSE", subjects: "Maths · English · Science", tag: "GCSE" },
  { time: "1:00pm – 3:00pm", group: "KS3", subjects: "Maths · English · Science", tag: "KS3" },
  { time: "3:00pm – 5:00pm", group: "A-Level", subjects: "Mathematics", tag: "A-Level" },
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

      {/* Saturday Timetable */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-[#C9973A] font-semibold uppercase tracking-widest text-sm mb-3">When We Run</p>
            <h2 className="text-4xl font-bold font-serif text-[#1B2B6B] mb-3">Saturday Session Timetable</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">All sessions currently run on <strong>Saturdays only</strong> at our Queensgate Centre venue in Grays. Wednesday evening sessions are coming soon.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {TIMETABLE.map(({ time, group, subjects, tag }, i) => {
              const colours = [
                "border-blue-200 bg-blue-50",
                "border-purple-200 bg-purple-50",
                "border-green-200 bg-green-50",
                "border-amber-200 bg-amber-50",
              ];
              const tags = [
                "bg-blue-100 text-blue-700",
                "bg-purple-100 text-purple-700",
                "bg-green-100 text-green-700",
                "bg-amber-100 text-amber-700",
              ];
              return (
                <div key={group} className={`rounded-2xl border-2 p-5 ${colours[i]}`}>
                  <span className={`inline-block text-xs font-bold px-2.5 py-1 rounded-full mb-3 ${tags[i]}`}>{tag}</span>
                  <p className="font-bold font-serif text-[#1B2B6B] text-lg leading-tight mb-1">{group}</p>
                  <p className="text-sm font-semibold text-[#C9973A] mb-2">{time}</p>
                  <p className="text-xs text-muted-foreground">{subjects}</p>
                </div>
              );
            })}
          </div>

          {/* Wednesday coming soon banner */}
          <div className="flex items-center gap-4 bg-[#1B2B6B]/5 border border-[#1B2B6B]/15 rounded-2xl px-6 py-4">
            <span className="text-2xl shrink-0">🌙</span>
            <div className="flex-1">
              <p className="font-bold text-[#1B2B6B] text-sm">Wednesday Evening Sessions — Coming Soon</p>
              <p className="text-xs text-muted-foreground mt-0.5">Select "Wednesday Evening (Waiting List)" when booking and we'll contact you as soon as spaces open.</p>
            </div>
            <a href="/contact" className="shrink-0 bg-[#1B2B6B] text-white text-xs font-semibold px-4 py-2 rounded-xl hover:bg-[#243580] transition-colors">
              Join Waitlist →
            </a>
          </div>
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
              { level: "SATs", price: "£40", desc: "KS2 · Maths & English", detail: "~10 students" },
              { level: "11+", price: "£45", desc: "Grammar entry prep", detail: "~10 students" },
              { level: "KS3", price: "£50", desc: "Years 7, 8 & 9", detail: "~10 students" },
              { level: "GCSE", price: "£55", desc: "All subjects", detail: "~10 students" },
              { level: "A-Level", price: "£65", desc: "Maths specialist", detail: "~10 students" },
            ].map(({ level, price, desc, detail }) => (
              <div key={level} className="text-center p-6 rounded-2xl border border-border bg-background hover:border-[#1B2B6B]/30 hover:shadow-md transition-all duration-200">
                <h3 className="font-bold font-serif text-[#1B2B6B] text-xl mb-1">{level}</h3>
                <p className="text-3xl font-bold text-[#C9973A] mb-0.5">{price}</p>
                <p className="text-xs text-muted-foreground">per student · 2hr session</p>
                <div className="mt-2 pt-2 border-t border-border">
                  <p className="text-xs text-muted-foreground">{desc}</p>
                  <p className="text-xs text-[#1B2B6B]/60 font-medium">{detail}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 grid sm:grid-cols-2 gap-4">
            <div className="p-5 bg-[#C9973A]/8 rounded-2xl border border-[#C9973A]/20">
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-[#1B2B6B]">🎁 First session is always free.</span>{" "}
                Includes a baseline test, parent consultation, personalised learning plan, and targets report. No obligation to continue.
              </p>
            </div>
            <div className="p-5 bg-[#1B2B6B]/5 rounded-2xl border border-[#1B2B6B]/15">
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-[#1B2B6B]">💷 Pay as you go.</span>{" "}
                Payment on the day, cash or bank transfer. No contracts, no direct debits, no minimum term. Join or leave at any time.
              </p>
            </div>
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
