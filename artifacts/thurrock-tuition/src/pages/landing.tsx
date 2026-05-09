import { useEffect, useRef } from "react";
import { Link } from "wouter";
import { useGetWidgetSettings } from "@workspace/api-client-react";
import PublicNav from "@/components/layout/public-nav";
import PublicFooter from "@/components/layout/public-footer";

function BookingWidget() {
  const { data: w } = useGetWidgetSettings();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!w?.bookingWidgetEnabled || !w.bookingWidgetCode) return;
    const placement = w.bookingWidgetPlacement ?? "contact";
    if (placement !== "homepage" && placement !== "both") return;
    const el = containerRef.current;
    if (!el) return;
    el.innerHTML = w.bookingWidgetCode;
    el.querySelectorAll("script").forEach(old => {
      const s = document.createElement("script");
      Array.from(old.attributes).forEach(a => s.setAttribute(a.name, a.value));
      s.textContent = old.textContent;
      old.replaceWith(s);
    });
  }, [w]);

  if (!w?.bookingWidgetEnabled || !w.bookingWidgetCode) return null;
  const placement = w.bookingWidgetPlacement ?? "contact";
  if (placement !== "homepage" && placement !== "both") return null;

  return (
    <section className="py-16 bg-[#f3f4f8]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <p className="text-[#C9973A] font-semibold uppercase tracking-widest text-sm mb-3 text-center">Book a Meeting</p>
        <h2 className="text-3xl font-bold font-serif text-[#1B2B6B] mb-8 text-center">Schedule Directly</h2>
        <div ref={containerRef} className="rounded-2xl overflow-hidden shadow-lg bg-white min-h-[400px]" />
      </div>
    </section>
  );
}

const TOWNS = [
  "Grays", "Tilbury", "Chafford Hundred", "Stanford-le-Hope",
  "Corringham", "South Ockendon", "Aveley", "West Thurrock",
  "Chadwell St Mary", "Purfleet", "North Stifford", "Orsett",
  "East Tilbury", "Badgers Dene",
];

const STATS = [
  { value: "200+", label: "Students Tutored" },
  { value: "95%", label: "Grade Improvement" },
  { value: "8", label: "Max Group Size" },
  { value: "5★", label: "Parent Reviews" },
];

const WHY_US = [
  {
    icon: "🎓",
    title: "Qualified & DBS Checked",
    body: "All our tutors are fully qualified teachers with enhanced DBS clearance. Your child's safety and education are our top priorities.",
  },
  {
    icon: "👥",
    title: "Small Group Sessions",
    body: "A maximum of 6–8 students per session means every child gets individual attention and targeted support where they need it most.",
  },
  {
    icon: "📊",
    title: "Progress Tracking",
    body: "Parents receive regular updates through our portal. You can see exactly what your child is working on and how they're improving.",
  },
  {
    icon: "📝",
    title: "Structured Study Plans",
    body: "After a free assessment, we create a personalised study plan aligned to your child's exam board, goals, and learning style.",
  },
  {
    icon: "✅",
    title: "Exam Technique Focus",
    body: "We don't just teach content — we teach students how to answer exam questions, manage time, and approach papers with confidence.",
  },
  {
    icon: "💬",
    title: "Parent Communication",
    body: "We keep parents fully informed with session notes, homework tracking, and direct WhatsApp access to Khadija when needed.",
  },
];

const SUBJECTS = [
  { name: "Mathematics", levels: ["SATs", "11+", "KS3", "GCSE", "A-Level"], color: "bg-blue-50 border-blue-100" },
  { name: "English", levels: ["SATs", "11+", "KS3", "GCSE"], color: "bg-amber-50 border-amber-100" },
  { name: "Science", levels: ["KS3", "GCSE"], color: "bg-green-50 border-green-100" },
];

const TESTIMONIALS = [
  {
    name: "Priya S.",
    role: "Parent of GCSE student",
    text: "Khadija has been incredible. My daughter went from a predicted Grade 4 to achieving a Grade 7 in her maths GCSE. The personal attention and structured approach made all the difference.",
    avatar: "PS",
  },
  {
    name: "James T.",
    role: "Parent of 11+ student",
    text: "We were nervous about the 11+ process but TTA made it manageable. My son passed and got into his first choice grammar school. We couldn't be happier.",
    avatar: "JT",
  },
  {
    name: "Fatima A.",
    role: "Parent of SATs student",
    text: "The sessions are focused and productive. My daughter actually looks forward to tuition now — that says everything. Her confidence in maths has completely transformed.",
    avatar: "FA",
  },
];

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <PublicNav />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center pt-16 overflow-hidden bg-[#1B2B6B]">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1600&auto=format&fit=crop&q=80')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#1B2B6B]/95 via-[#1B2B6B]/85 to-[#0f1a3e]/90" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-24 lg:py-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-[#C9973A]/20 border border-[#C9973A]/40 rounded-full px-4 py-1.5 mb-8 animate-fade-in">
              <span className="w-2 h-2 rounded-full bg-[#C9973A] animate-pulse" />
              <span className="text-[#C9973A] text-sm font-medium">Now enrolling for Summer 2026</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold font-serif text-white leading-[1.1] mb-6 animate-fade-up text-balance">
              Thurrock's Expert Tuition —
              <span className="text-[#C9973A]"> Building Confidence</span>{" "}
              &amp; Higher Grades
            </h1>

            <p className="text-lg md:text-xl text-white/75 mb-10 leading-relaxed max-w-2xl animate-fade-up delay-100">
              Professional group tuition based in Grays, serving families across Thurrock — Tilbury, Chafford Hundred, Stanford-le-Hope, Corringham, South Ockendon and beyond. Specialist Maths, English and Science for SATs, 11+, KS3, GCSE and A-Level.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 animate-fade-up delay-200">
              <Link
                href="/contact"
                className="bg-[#C9973A] hover:bg-[#b8872e] text-white font-bold px-8 py-4 rounded-xl text-lg shadow-xl hover:shadow-2xl transition-all duration-200 hover:-translate-y-0.5 text-center"
              >
                Book Free Assessment →
              </Link>
              <Link
                href="/services"
                className="bg-white/10 hover:bg-white/20 border border-white/25 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-all duration-200 text-center"
              >
                View Our Services
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-16 pt-8 border-t border-white/15 animate-fade-up delay-300">
              {STATS.map(({ value, label }) => (
                <div key={label} className="text-center">
                  <div className="text-3xl font-bold font-serif text-[#C9973A]">{value}</div>
                  <div className="text-xs text-white/60 mt-1">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <p className="text-[#C9973A] font-semibold uppercase tracking-widest text-sm mb-3">Why Thurrock Parents Choose Us</p>
            <h2 className="text-4xl md:text-5xl font-bold font-serif text-[#1B2B6B] mb-4">
              Education Done Right
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              We combine qualified teaching expertise with genuine care for every student. Here's what sets Thurrock Tuition Academy apart from every other tuition centre in Grays and Essex.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {WHY_US.map(({ icon, title, body }, i) => (
              <div
                key={title}
                className={`group p-7 rounded-2xl border border-border bg-background hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-up`}
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="text-3xl mb-4">{icon}</div>
                <h3 className="text-xl font-bold font-serif text-[#1B2B6B] mb-2">{title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Subjects Split Section */}
      <section className="py-24 bg-[#f3f4f8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-[#C9973A] font-semibold uppercase tracking-widest text-sm mb-3">What We Teach</p>
              <h2 className="text-4xl md:text-5xl font-bold font-serif text-[#1B2B6B] mb-6">
                Subjects & Levels
              </h2>
              <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                From primary SATs through to A-Level, our tutors are specialists in their subjects and understand exactly what each exam board requires.
              </p>

              <div className="space-y-4">
                {SUBJECTS.map(({ name, levels, color }) => (
                  <div key={name} className={`p-5 rounded-2xl border ${color}`}>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-[#1B2B6B] font-serif text-lg">{name}</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {levels.map((level) => (
                        <span key={level} className="bg-[#1B2B6B]/10 text-[#1B2B6B] text-xs font-semibold px-3 py-1 rounded-full">
                          {level}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <Link
                href="/services"
                className="inline-flex items-center gap-2 mt-8 bg-[#1B2B6B] hover:bg-[#243580] text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 shadow hover:shadow-lg"
              >
                See Full Services →
              </Link>
            </div>

            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&auto=format&fit=crop&q=80"
                alt="Student studying"
                className="w-full h-[500px] object-cover rounded-3xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-5 max-w-[200px]">
                <p className="text-[#1B2B6B] font-bold font-serif text-2xl">Free</p>
                <p className="text-muted-foreground text-sm">Initial assessment for every new student</p>
              </div>
              <div className="absolute -top-4 -right-4 bg-[#C9973A] rounded-2xl shadow-xl p-4 text-center">
                <p className="text-white font-bold text-3xl font-serif">8</p>
                <p className="text-white/80 text-xs">max students<br />per session</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <p className="text-[#C9973A] font-semibold uppercase tracking-widest text-sm mb-3">Testimonials</p>
            <h2 className="text-4xl md:text-5xl font-bold font-serif text-[#1B2B6B]">
              What Parents Say
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {TESTIMONIALS.map(({ name, role, text, avatar }) => (
              <div key={name} className="bg-[#f8f9fc] border border-border rounded-2xl p-7 hover:shadow-lg transition-all duration-300">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-[#C9973A] fill-current" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  ))}
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6 italic">"{text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#1B2B6B] text-white flex items-center justify-center font-bold text-sm">
                    {avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">{name}</p>
                    <p className="text-xs text-muted-foreground">{role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Free Assessment Feature Section */}
      <section className="py-24 bg-[#1B2B6B] relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=1600&auto=format&fit=crop&q=80')" }}
        />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            {/* Left: Text */}
            <div>
              <div className="inline-flex items-center gap-2 bg-[#C9973A]/20 border border-[#C9973A]/40 rounded-full px-4 py-1.5 mb-6">
                <span className="w-2 h-2 rounded-full bg-[#C9973A]" />
                <span className="text-[#C9973A] text-sm font-semibold">Completely Free · No Obligation</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold font-serif text-white mb-5 text-balance">
                Free Initial Assessment Session
              </h2>
              <p className="text-white/70 text-lg mb-8 leading-relaxed">
                Every new student starts with a complimentary session — before any commitment is made. We get to know your child, understand where they are, and build a clear plan forward.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/contact"
                  className="bg-[#C9973A] hover:bg-[#b8872e] text-white font-bold px-8 py-4 rounded-xl text-lg shadow-xl hover:shadow-2xl transition-all duration-200 hover:-translate-y-0.5 text-center"
                >
                  Claim Your Free Session →
                </Link>
                <a
                  href="https://wa.me/447480413679"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#25D366] hover:bg-[#1ab553] text-white font-bold px-8 py-4 rounded-xl text-lg shadow-xl transition-all duration-200 hover:-translate-y-0.5 text-center"
                >
                  WhatsApp Us
                </a>
              </div>
            </div>

            {/* Right: Inclusion cards */}
            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  icon: "📋",
                  title: "Baseline Test",
                  body: "A structured assessment identifies exactly where your child is right now — their strengths and the gaps holding them back.",
                },
                {
                  icon: "🤝",
                  title: "Parent Consultation",
                  body: "We sit down with you to understand your child's goals, challenges, exam dates, and any concerns you have.",
                },
                {
                  icon: "📚",
                  title: "Learning Plan",
                  body: "A personalised study plan tailored to your child's level, exam board, and the weeks available before their assessment or exam.",
                },
                {
                  icon: "🎯",
                  title: "Targets Report",
                  body: "A written report outlining your child's current level, target grade, and the milestones we'll work through together.",
                },
              ].map(({ icon, title, body }) => (
                <div key={title} className="bg-white/10 border border-white/15 rounded-2xl p-5 hover:bg-white/15 transition-colors duration-200">
                  <div className="text-2xl mb-3">{icon}</div>
                  <h3 className="text-white font-bold font-serif mb-1.5">{title}</h3>
                  <p className="text-white/60 text-xs leading-relaxed">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Areas We Serve */}
      <section className="py-16 bg-[#1B2B6B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <p className="text-[#C9973A] font-semibold uppercase tracking-widest text-sm mb-3">Serving All of Thurrock</p>
            <h2 className="text-3xl md:text-4xl font-bold font-serif text-white mb-4">
              Tuition for Families Across the Borough
            </h2>
            <p className="text-white/65 text-base max-w-2xl mx-auto leading-relaxed">
              Our tuition centre is based at Queensgate Centre, Orsett Road, Grays — easily accessible from every corner of Thurrock and the surrounding Essex area. Free parking on site.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {TOWNS.map((town) => (
              <span
                key={town}
                className="bg-white/10 border border-white/20 text-white text-sm font-medium px-4 py-2 rounded-full hover:bg-[#C9973A]/20 hover:border-[#C9973A]/40 transition-colors duration-200"
              >
                {town}
              </span>
            ))}
          </div>
          <p className="text-center text-white/50 text-xs">
            Also welcoming students from Basildon, Brentwood, Dartford and surrounding areas — <a href="/contact" className="text-[#C9973A] hover:underline">enquire today</a>.
          </p>
        </div>
      </section>

      <BookingWidget />

      <PublicFooter />
    </div>
  );
}
