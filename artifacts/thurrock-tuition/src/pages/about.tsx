import { Link } from "wouter";
import PublicNav from "@/components/layout/public-nav";
import PublicFooter from "@/components/layout/public-footer";

const VALUES = [
  {
    icon: "❤️",
    title: "Genuine Care",
    body: "Every student is treated as an individual. We take the time to understand their learning style, their fears, and their goals — then build a programme around them.",
  },
  {
    icon: "🏆",
    title: "High Standards",
    body: "We never settle for 'good enough'. Our students are always pushed — encouragingly — to reach beyond what they think they're capable of.",
  },
  {
    icon: "🤝",
    title: "Partnership with Parents",
    body: "Parents aren't kept in the dark. We communicate openly, share progress regularly, and invite parents to be active participants in their child's education.",
  },
  {
    icon: "🌟",
    title: "Confidence First",
    body: "Grades improve when confidence grows. We build students up as people before we push them academically — because a confident student is a successful student.",
  },
  {
    icon: "📚",
    title: "Expertise & Preparation",
    body: "Our tutors are qualified teachers who know the exam boards inside out. We don't guess — we teach exactly what's needed, in exactly the right way.",
  },
  {
    icon: "🌱",
    title: "Long-Term Growth",
    body: "We don't just prepare students for their next exam. We build study habits, critical thinking skills, and self-belief that will serve them for life.",
  },
];

const TEAM = [
  {
    name: "Khadija",
    role: "Founder & Lead Tutor",
    bio: "Khadija founded Thurrock Tuition Academy with a simple belief: every child deserves access to excellent teaching. With years of classroom and tutoring experience across Maths, English and Science, she brings warmth, expertise and a relentless commitment to her students. She is fully DBS checked and holds Qualified Teacher Status.",
    subjects: ["Maths", "English", "11+", "GCSE", "A-Level"],
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80",
  },
];

const TIMELINE = [
  { year: "2018", event: "Khadija begins private tutoring from home, working with local families in Grays." },
  { year: "2020", event: "Despite the pandemic, online sessions allow TTA to grow. Students across Essex benefit from structured remote tuition." },
  { year: "2022", event: "TTA moves into professional premises at Queensgate Centre, Orsett Road, offering in-person group sessions." },
  { year: "2023", event: "The parent portal launches, giving families real-time visibility into their child's progress, tasks and sessions." },
  { year: "2025", event: "TTA continues to grow, with 200+ students supported and an expanding team of qualified tutors." },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <PublicNav />

      {/* Hero */}
      <section className="pt-32 pb-20 bg-[#1B2B6B] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1B2B6B] to-[#0f1a3e]" />
        <div
          className="absolute inset-0 opacity-10 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1600&auto=format&fit=crop&q=80')" }}
        />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-[#C9973A] font-semibold uppercase tracking-widest text-sm mb-4">Our Story</p>
          <h1 className="text-5xl md:text-6xl font-bold font-serif text-white mb-6 text-balance">
            About Thurrock Tuition Academy
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto leading-relaxed">
            Founded by a qualified teacher with a passion for seeing every student succeed — whatever their starting point.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section id="mission" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <img
                src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&auto=format&fit=crop&q=80"
                alt="Tuition session"
                className="w-full h-[450px] object-cover rounded-3xl shadow-2xl"
              />
            </div>
            <div className="space-y-10">
              <div>
                <div className="inline-flex items-center gap-2 bg-[#1B2B6B]/10 rounded-full px-4 py-1.5 mb-4">
                  <span className="text-[#1B2B6B] text-sm font-semibold">🎯 Our Mission</span>
                </div>
                <h2 className="text-3xl font-bold font-serif text-[#1B2B6B] mb-4">To Unlock Every Child's Potential</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Our mission is to provide expert, personalised tuition that helps every student in Thurrock — regardless of their background or starting point — to achieve grades they're proud of. We believe no child should be left behind for lack of access to great teaching.
                </p>
                <p className="text-muted-foreground leading-relaxed mt-3">
                  We combine rigorous academic support with genuine emotional encouragement. When a student walks into TTA, they feel seen, heard, and supported — not judged. That's what makes the difference.
                </p>
              </div>

              <div id="vision">
                <div className="inline-flex items-center gap-2 bg-[#C9973A]/10 rounded-full px-4 py-1.5 mb-4">
                  <span className="text-[#C9973A] text-sm font-semibold">🌟 Our Vision</span>
                </div>
                <h2 className="text-3xl font-bold font-serif text-[#1B2B6B] mb-4">A Community Built on Success</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We envision Thurrock Tuition Academy becoming the most trusted educational support centre in Essex — a place where families return year after year, where students recommend TTA to their friends, and where the community sees measurable improvements in local educational outcomes.
                </p>
                <p className="text-muted-foreground leading-relaxed mt-3">
                  Our vision extends beyond grades. We want our students to leave TTA equipped with the resilience, critical thinking and self-belief to thrive in whatever path they choose.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why We Started */}
      <section className="py-24 bg-[#f3f4f8]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-[#C9973A] font-semibold uppercase tracking-widest text-sm mb-4">The Story Behind TTA</p>
          <h2 className="text-4xl font-bold font-serif text-[#1B2B6B] mb-8">Why We Started</h2>
          <div className="space-y-5 text-muted-foreground text-lg leading-relaxed text-left">
            <p>
              Thurrock Tuition Academy was founded by Khadija after years of teaching in schools and witnessing a clear pattern: many students who struggled weren't lacking ability — they were lacking support. In a classroom of thirty, it's impossible for a teacher to give each child what they truly need.
            </p>
            <p>
              Khadija started tutoring because she wanted to close that gap. To give students the individual attention, the patient explanation, the second and third attempt that school couldn't always offer. What began as a few sessions from home grew — through word of mouth and a stream of success stories — into what TTA is today.
            </p>
            <p>
              Every student who walks through our door is treated as an individual with unique strengths and unique challenges. That's not a marketing line — it's how we've always worked, and it's what drives the results our families tell us about every year.
            </p>
          </div>
        </div>
      </section>

      {/* Meet the Team */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <p className="text-[#C9973A] font-semibold uppercase tracking-widest text-sm mb-3">The People Behind TTA</p>
            <h2 className="text-4xl font-bold font-serif text-[#1B2B6B]">Meet Our Team</h2>
          </div>

          {TEAM.map(({ name, role, bio, subjects, image }) => (
            <div key={name} className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 items-center">
              <div className="relative">
                <img src={image} alt={name} className="w-full h-[450px] object-cover object-top rounded-3xl shadow-xl" />
                <div className="absolute -bottom-4 -right-4 bg-[#C9973A] rounded-2xl px-5 py-3 shadow-lg">
                  <p className="text-white text-xs font-semibold">QTS Qualified</p>
                  <p className="text-white/80 text-xs">Enhanced DBS Checked</p>
                </div>
              </div>
              <div>
                <h3 className="text-3xl font-bold font-serif text-[#1B2B6B] mb-1">{name}</h3>
                <p className="text-[#C9973A] font-semibold mb-5">{role}</p>
                <p className="text-muted-foreground leading-relaxed mb-6">{bio}</p>
                <div className="flex flex-wrap gap-2">
                  {subjects.map((s) => (
                    <span key={s} className="bg-[#1B2B6B]/8 text-[#1B2B6B] text-sm font-medium px-3 py-1.5 rounded-full">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-[#f3f4f8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <p className="text-[#C9973A] font-semibold uppercase tracking-widest text-sm mb-3">What We Stand For</p>
            <h2 className="text-4xl font-bold font-serif text-[#1B2B6B]">Our Core Values</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {VALUES.map(({ icon, title, body }) => (
              <div key={title} className="bg-white p-7 rounded-2xl border border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="text-3xl mb-4">{icon}</div>
                <h3 className="text-xl font-bold font-serif text-[#1B2B6B] mb-2">{title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <p className="text-[#C9973A] font-semibold uppercase tracking-widest text-sm mb-3">Our Journey</p>
            <h2 className="text-4xl font-bold font-serif text-[#1B2B6B]">TTA Through the Years</h2>
          </div>
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border" />
            <div className="space-y-10">
              {TIMELINE.map(({ year, event }) => (
                <div key={year} className="flex gap-8 items-start">
                  <div className="flex flex-col items-center shrink-0">
                    <div className="w-16 h-16 rounded-2xl bg-[#1B2B6B] text-white font-bold font-serif text-sm flex items-center justify-center shadow-md z-10">
                      {year}
                    </div>
                  </div>
                  <div className="flex-1 pt-4">
                    <p className="text-muted-foreground leading-relaxed">{event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#1B2B6B]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-4xl font-bold font-serif text-white mb-4">Join the TTA Family</h2>
          <p className="text-white/70 mb-8 text-lg">Book a free assessment and see what personalised tuition can do for your child.</p>
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
