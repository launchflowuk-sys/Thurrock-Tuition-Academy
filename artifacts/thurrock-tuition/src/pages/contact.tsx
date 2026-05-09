import { useState, useEffect, useRef } from "react";
import { useCreateIntakeSubmission, useGetWidgetSettings } from "@workspace/api-client-react";
import PublicNav from "@/components/layout/public-nav";
import PublicFooter from "@/components/layout/public-footer";
import { useToast } from "@/hooks/use-toast";

function BookingWidget() {
  const { data: w } = useGetWidgetSettings();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!w?.bookingWidgetEnabled || !w.bookingWidgetCode) return;
    const placement = w.bookingWidgetPlacement ?? "contact";
    if (placement !== "contact" && placement !== "both") return;
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
  if (placement !== "contact" && placement !== "both") return null;

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

const SUBJECTS = ["Maths", "English", "Science", "11+ (Verbal & Non-Verbal Reasoning)", "Combined (Maths + English)", "Other"];
const LEVELS = ["SATs (KS2)", "11+ Preparation", "KS3", "GCSE", "A-Level"];
const SLOTS = [
  "Morning 9am–11am",
  "Late Morning 11am–1pm",
  "Afternoon 1pm–3pm",
  "Late Afternoon 3pm–5pm",
  "Flexible / Any",
];
const HOW_HEARD = [
  "Google / Search engine",
  "Facebook or Instagram",
  "Word of mouth / friend",
  "School recommendation",
  "Flyer or poster",
  "Local community group",
  "Other",
];

const FAQS = [
  {
    q: "How does the free assessment work?",
    a: "We invite your child for a 2-hour session at no charge. During this time we assess their current level, identify key gaps, provide written feedback, and recommend a programme. There is absolutely no obligation to continue.",
  },
  {
    q: "How many students are in each session?",
    a: "We cap every session at 8 students. This ensures every child gets meaningful individual attention and the tutor can address specific questions from each student.",
  },
  {
    q: "What exam boards do you cover?",
    a: "We cover AQA, Edexcel, OCR and Eduqas for GCSE and A-Level subjects. For 11+ we prepare for both GL Assessment and CEM formats. Please mention your child's school so we can tailor the content.",
  },
  {
    q: "When do sessions take place?",
    a: "Sessions run Monday to Saturday across four 2-hour slots: 9–11am, 11am–1pm, 1–3pm, and 3–5pm. Specific days vary by subject — please enquire for the current timetable.",
  },
  {
    q: "How are payments made?",
    a: "Payment is made on the day of each session. We accept bank transfer and cash. There are no long-term contracts — you pay as you go.",
  },
  {
    q: "Can my child join mid-year?",
    a: "Yes. Students join at any point in the academic year. After the free assessment, we'll create a plan that fits exactly where your child is and what they need before their exams.",
  },
  {
    q: "Do you offer one-to-one tuition?",
    a: "Our sessions are group-based (max 8 students). This model keeps costs accessible while maintaining meaningful individual attention. Please contact us to discuss your specific requirements.",
  },
  {
    q: "Where are you based, and which areas do you cover?",
    a: "We are based at Suite 1, Queensgate Centre, Orsett Road, Grays, Thurrock — with free parking on site. We welcome students from across the Thurrock borough, including Tilbury, Chafford Hundred, Stanford-le-Hope, Corringham, South Ockendon, Aveley, West Thurrock, Chadwell St Mary, Purfleet, North Stifford, Orsett, East Tilbury and Badgers Dene. Families from Basildon, Brentwood and Dartford also attend.",
  },
];

const emptyForm = {
  // Child details
  childName: "",
  childAge: "",
  currentSchool: "",
  subject: "",
  level: "",
  currentAttainment: "",
  // Parent details
  parentName: "",
  email: "",
  contactNumber: "",
  // Goals & background
  goals: "",
  previousTutoring: "",
  preferredSlot: "",
  howDidYouHear: "",
  additionalInfo: "",
};

const inputClass = "w-full border border-[#e2e5f0] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B2B6B]/25 focus:border-[#1B2B6B] transition-all bg-white placeholder:text-gray-400";
const labelClass = "block text-sm font-semibold text-[#1a1a2e] mb-1.5";
const sectionClass = "rounded-2xl border border-[#e2e5f0] bg-[#fafbff] p-6 space-y-4";
const sectionTitle = "text-base font-bold font-serif text-[#1B2B6B] mb-4 flex items-center gap-2";

type Step = 1 | 2 | 3;

export default function ContactPage() {
  const { toast } = useToast();
  const createSubmission = useCreateIntakeSubmission();
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState(emptyForm);

  const set = (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm(f => ({ ...f, [key]: e.target.value }));

  const nextStep = () => {
    if (step === 1) {
      if (!form.childName || !form.childAge || !form.subject || !form.level) {
        toast({ title: "Please complete all required fields in this section", variant: "destructive" });
        return;
      }
    }
    if (step === 2) {
      if (!form.parentName || !form.email || !form.contactNumber) {
        toast({ title: "Please complete all required fields in this section", variant: "destructive" });
        return;
      }
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
      if (!emailOk) {
        toast({ title: "Please enter a valid email address", variant: "destructive" });
        return;
      }
    }
    setStep(s => (s + 1) as Step);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.goals) {
      toast({ title: "Please tell us what you're hoping to achieve", variant: "destructive" });
      return;
    }
    try {
      await createSubmission.mutateAsync({
        data: {
          childName: form.childName,
          childAge: Number(form.childAge),
          parentName: form.parentName,
          email: form.email,
          contactNumber: form.contactNumber,
          subject: form.subject,
          level: form.level,
          currentSchool: form.currentSchool || undefined,
          currentAttainment: form.currentAttainment || undefined,
          goals: form.goals || undefined,
          previousTutoring: form.previousTutoring || undefined,
          preferredSlot: form.preferredSlot || undefined,
          howDidYouHear: form.howDidYouHear || undefined,
          additionalInfo: form.additionalInfo || undefined,
        },
      });
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      toast({ title: "Something went wrong. Please try WhatsApp instead.", variant: "destructive" });
    }
  };

  const StepIndicator = () => (
    <div className="flex items-center gap-2 mb-8">
      {([1, 2, 3] as Step[]).map((s) => (
        <div key={s} className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
            step === s ? "bg-[#1B2B6B] text-white" :
            step > s ? "bg-[#C9973A] text-white" :
            "bg-[#e2e5f0] text-[#6b7280]"
          }`}>{step > s ? "✓" : s}</div>
          <span className={`text-xs font-medium hidden sm:block ${step === s ? "text-[#1B2B6B]" : "text-gray-400"}`}>
            {s === 1 ? "About Your Child" : s === 2 ? "Your Details" : "Goals & Background"}
          </span>
          {s < 3 && <div className="w-6 h-px bg-[#e2e5f0] mx-1" />}
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <PublicNav />

      {/* Hero */}
      <section className="pt-32 pb-20 bg-[#1B2B6B] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1B2B6B] to-[#0f1a3e]" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-[#C9973A] font-semibold uppercase tracking-widest text-sm mb-4">Apply Today</p>
          <h1 className="text-5xl md:text-6xl font-bold font-serif text-white mb-6">
            Book Your Free Assessment
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto leading-relaxed">
            Complete the short application form below — it takes about 3 minutes. We'll review your child's profile and be in touch within 24 hours to arrange their free assessment session.
          </p>
        </div>
      </section>

      {submitted ? (
        <section className="py-24 bg-white">
          <div className="max-w-xl mx-auto px-4 sm:px-6 text-center">
            <div className="text-6xl mb-6">🎉</div>
            <h2 className="text-3xl font-bold font-serif text-[#1B2B6B] mb-4">Application Received!</h2>
            <p className="text-muted-foreground text-lg mb-4">
              Thank you — we have received your application for <strong>{form.childName}</strong>. We'll be in touch within 24 hours to arrange your free assessment session.
            </p>
            <p className="text-muted-foreground mb-8">
              Check your inbox at <strong>{form.email}</strong> for a confirmation. In the meantime, feel free to message us on WhatsApp.
            </p>
            <a
              href="https://wa.me/447480413679"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1ab553] text-white font-bold px-8 py-4 rounded-xl text-lg shadow-xl transition-all duration-200 hover:-translate-y-0.5"
            >
              Continue on WhatsApp
            </a>
          </div>
        </section>
      ) : (
        <section className="py-20 bg-[#f8f9fd]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid lg:grid-cols-5 gap-14">

              {/* Form */}
              <div className="lg:col-span-3">
                <h2 className="text-2xl font-bold font-serif text-[#1B2B6B] mb-2">Application Form</h2>
                <p className="text-muted-foreground text-sm mb-6">All fields marked <span className="text-red-500 font-bold">*</span> are required.</p>

                <StepIndicator />

                <form onSubmit={handleSubmit} className="space-y-6">

                  {/* Step 1: About Your Child */}
                  {step === 1 && (
                    <div className="space-y-5">
                      <div className={sectionClass}>
                        <p className={sectionTitle}><span className="bg-[#1B2B6B] text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shrink-0">1</span>About Your Child</p>

                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <label className={labelClass}>Child's Full Name <span className="text-red-500">*</span></label>
                            <input type="text" value={form.childName} onChange={set("childName")} placeholder="e.g. Emma Johnson" className={inputClass} />
                          </div>
                          <div>
                            <label className={labelClass}>Child's Age <span className="text-red-500">*</span></label>
                            <input type="number" value={form.childAge} onChange={set("childAge")} placeholder="e.g. 14" min="5" max="19" className={inputClass} />
                          </div>
                        </div>

                        <div>
                          <label className={labelClass}>Current School (optional)</label>
                          <input type="text" value={form.currentSchool} onChange={set("currentSchool")} placeholder="e.g. Grays Convent High School" className={inputClass} />
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <label className={labelClass}>Subject <span className="text-red-500">*</span></label>
                            <select value={form.subject} onChange={set("subject")} className={inputClass}>
                              <option value="">Select a subject</option>
                              {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                          </div>
                          <div>
                            <label className={labelClass}>Level / Exam <span className="text-red-500">*</span></label>
                            <select value={form.level} onChange={set("level")} className={inputClass}>
                              <option value="">Select a level</option>
                              {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className={labelClass}>Current Attainment (optional)</label>
                          <input type="text" value={form.currentAttainment} onChange={set("currentAttainment")} placeholder="e.g. Grade 4, working at Level 3, struggling with algebra..." className={inputClass} />
                          <p className="text-xs text-muted-foreground mt-1">This helps us plan the right starting point for your child's assessment.</p>
                        </div>
                      </div>

                      <button type="button" onClick={nextStep} className="w-full bg-[#1B2B6B] hover:bg-[#243580] text-white font-bold px-8 py-4 rounded-xl text-base shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5">
                        Next: Your Details →
                      </button>
                    </div>
                  )}

                  {/* Step 2: Parent / Guardian Details */}
                  {step === 2 && (
                    <div className="space-y-5">
                      <div className={sectionClass}>
                        <p className={sectionTitle}><span className="bg-[#1B2B6B] text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shrink-0">2</span>Parent / Guardian Details</p>

                        <div>
                          <label className={labelClass}>Your Full Name <span className="text-red-500">*</span></label>
                          <input type="text" value={form.parentName} onChange={set("parentName")} placeholder="e.g. Sarah Johnson" className={inputClass} />
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <label className={labelClass}>Email Address <span className="text-red-500">*</span></label>
                            <input type="email" value={form.email} onChange={set("email")} placeholder="e.g. sarah@email.com" className={inputClass} />
                            <p className="text-xs text-muted-foreground mt-1">We'll send your confirmation and updates here.</p>
                          </div>
                          <div>
                            <label className={labelClass}>Mobile Number <span className="text-red-500">*</span></label>
                            <input type="tel" value={form.contactNumber} onChange={set("contactNumber")} placeholder="e.g. 07700 900123" className={inputClass} />
                          </div>
                        </div>

                        <div>
                          <label className={labelClass}>Preferred Session Time</label>
                          <select value={form.preferredSlot} onChange={set("preferredSlot")} className={inputClass}>
                            <option value="">Select preferred slot (optional)</option>
                            {SLOTS.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button type="button" onClick={() => setStep(1)} className="flex-1 border-2 border-[#1B2B6B]/20 hover:border-[#1B2B6B]/50 text-[#1B2B6B] font-semibold px-6 py-4 rounded-xl transition-all">
                          ← Back
                        </button>
                        <button type="button" onClick={nextStep} className="flex-[2] bg-[#1B2B6B] hover:bg-[#243580] text-white font-bold px-8 py-4 rounded-xl text-base shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5">
                          Next: Goals & Background →
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Goals & Background */}
                  {step === 3 && (
                    <div className="space-y-5">
                      <div className={sectionClass}>
                        <p className={sectionTitle}><span className="bg-[#1B2B6B] text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shrink-0">3</span>Goals &amp; Background</p>
                        <p className="text-xs text-muted-foreground -mt-2 mb-2">This helps us understand where your child is now and build the right plan from day one.</p>

                        <div>
                          <label className={labelClass}>What are you hoping to achieve? <span className="text-red-500">*</span></label>
                          <textarea value={form.goals} onChange={set("goals")} rows={3} placeholder="e.g. Pass GCSE Maths with at least a grade 5, get into grammar school, build confidence in algebra, catch up after moving schools..." className={`${inputClass} resize-none`} />
                        </div>

                        <div>
                          <label className={labelClass}>What is your child currently struggling with?</label>
                          <textarea value={form.previousTutoring} onChange={set("previousTutoring")} rows={3} placeholder="e.g. Struggles with exam technique and running out of time, finds fractions difficult, loses focus during long sessions, anxious about exams..." className={`${inputClass} resize-none`} />
                          <p className="text-xs text-muted-foreground mt-1">Include anything that has held your child back — learning style, previous tutoring experience, or specific topics.</p>
                        </div>

                        <div>
                          <label className={labelClass}>How did you hear about us?</label>
                          <select value={form.howDidYouHear} onChange={set("howDidYouHear")} className={inputClass}>
                            <option value="">Select an option (optional)</option>
                            {HOW_HEARD.map(h => <option key={h} value={h}>{h}</option>)}
                          </select>
                        </div>

                        <div>
                          <label className={labelClass}>Anything else we should know?</label>
                          <textarea value={form.additionalInfo} onChange={set("additionalInfo")} rows={3} placeholder="e.g. exam board, target school, specific dates to know, SEN requirements, anything else..." className={`${inputClass} resize-none`} />
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button type="button" onClick={() => setStep(2)} className="flex-1 border-2 border-[#1B2B6B]/20 hover:border-[#1B2B6B]/50 text-[#1B2B6B] font-semibold px-6 py-4 rounded-xl transition-all">
                          ← Back
                        </button>
                        <button type="submit" disabled={createSubmission.isPending} className="flex-[2] bg-[#C9973A] hover:bg-[#b8852f] disabled:opacity-60 text-white font-bold px-8 py-4 rounded-xl text-base shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5">
                          {createSubmission.isPending ? "Submitting..." : "Submit Application →"}
                        </button>
                      </div>

                      <p className="text-xs text-muted-foreground text-center">
                        Or contact us directly: <a href="https://wa.me/447480413679" className="text-[#1B2B6B] font-medium hover:text-[#C9973A]">WhatsApp 07480 413679</a>
                      </p>
                    </div>
                  )}
                </form>
              </div>

              {/* Sidebar Info */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-[#1B2B6B] rounded-2xl p-7 text-white">
                  <h3 className="text-xl font-bold font-serif mb-5">Contact Details</h3>
                  <ul className="space-y-4 text-sm">
                    <li className="flex gap-3">
                      <svg className="w-5 h-5 shrink-0 text-[#C9973A] mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                      <span className="text-white/80">Suite 1, Queensgate Centre<br />Orsett Road, Grays<br />Thurrock, Essex</span>
                    </li>
                    <li className="flex gap-3">
                      <svg className="w-5 h-5 shrink-0 text-[#C9973A]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                      <a href="tel:07480413679" className="text-white/80 hover:text-[#C9973A] transition-colors">07480 413679</a>
                    </li>
                    <li className="flex gap-3">
                      <svg className="w-5 h-5 shrink-0 text-[#C9973A]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                      <a href="mailto:bookings@thurrocktuitionacademy.co.uk" className="text-white/80 hover:text-[#C9973A] transition-colors break-all">bookings@thurrocktuitionacademy.co.uk</a>
                    </li>
                    <li className="flex gap-3">
                      <svg className="w-5 h-5 shrink-0 text-[#C9973A]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                      <span className="text-white/80">Mon–Sat: 9am – 6pm</span>
                    </li>
                  </ul>
                  <a href="https://wa.me/447480413679" target="_blank" rel="noopener noreferrer"
                    className="mt-6 flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ab553] text-white font-semibold px-5 py-3 rounded-xl transition-all duration-200">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.852L.057 23.571a.5.5 0 00.611.611l5.72-1.47A11.944 11.944 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.878 0-3.638-.49-5.163-1.348l-.37-.213-3.398.873.89-3.328-.23-.38A9.944 9.944 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
                    Message on WhatsApp
                  </a>
                </div>

                <div className="bg-[#C9973A]/10 border border-[#C9973A]/25 rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xl">🎁</span>
                    <h3 className="font-bold font-serif text-[#1B2B6B] text-lg">Free Assessment Includes</h3>
                  </div>
                  <ul className="space-y-4">
                    {[
                      { icon: "📋", title: "Baseline Test", body: "A structured test to pinpoint exactly where your child is now." },
                      { icon: "🤝", title: "Parent Consultation", body: "We discuss your child's goals, challenges and exam timeline with you." },
                      { icon: "📚", title: "Learning Plan", body: "A personalised plan mapped to their exam board and target grade." },
                      { icon: "🎯", title: "Targets Report", body: "A written summary of current level and the milestones ahead." },
                    ].map(({ icon, title, body }) => (
                      <li key={title} className="flex gap-3">
                        <span className="text-lg shrink-0">{icon}</span>
                        <div>
                          <p className="font-semibold text-[#1B2B6B] text-sm">{title}</p>
                          <p className="text-muted-foreground text-xs leading-relaxed">{body}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 pt-4 border-t border-[#C9973A]/20 text-xs text-muted-foreground text-center font-medium">
                    Completely free · No obligation to continue
                  </p>
                </div>

                {/* Progress indicator for mobile */}
                <div className="bg-white border border-[#e2e5f0] rounded-2xl p-5 text-sm text-muted-foreground leading-relaxed">
                  <p className="font-semibold text-[#1B2B6B] mb-2">Why we ask these questions</p>
                  <p className="text-xs">Every child is different. The more we know before your child's first visit, the better we can prepare a focused assessment and personalised plan from day one — saving your child time and giving them a head start.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section id="faq" className="py-24 bg-[#f3f4f8]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-[#C9973A] font-semibold uppercase tracking-widest text-sm mb-3">Questions & Answers</p>
            <h2 className="text-4xl font-bold font-serif text-[#1B2B6B]">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-3">
            {FAQS.map(({ q, a }, i) => (
              <div key={i} className="bg-white rounded-2xl border border-border overflow-hidden">
                <button className="w-full flex items-center justify-between px-6 py-5 text-left font-semibold text-[#1B2B6B] hover:bg-[#1B2B6B]/3 transition-colors" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span>{q}</span>
                  <span className="shrink-0 ml-4 text-[#C9973A] text-xl leading-none">{openFaq === i ? "−" : "+"}</span>
                </button>
                {openFaq === i && <div className="px-6 pb-5 text-sm text-muted-foreground leading-relaxed border-t border-border pt-4">{a}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Areas We Serve */}
      <section className="py-14 bg-[#1B2B6B]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-[#C9973A] font-semibold uppercase tracking-widest text-sm mb-3">Coverage Area</p>
          <h2 className="text-2xl md:text-3xl font-bold font-serif text-white mb-4">Serving Families Across Thurrock &amp; Essex</h2>
          <p className="text-white/60 text-sm mb-7 max-w-xl mx-auto">Based in Grays — easily reachable from every part of the borough. Free parking at Queensgate Centre.</p>
          <div className="flex flex-wrap justify-center gap-2">
            {["Grays","Tilbury","Chafford Hundred","Stanford-le-Hope","Corringham","South Ockendon","Aveley","West Thurrock","Chadwell St Mary","Purfleet","North Stifford","Orsett","East Tilbury","Badgers Dene","Basildon","Brentwood","Dartford"].map(town => (
              <span key={town} className="bg-white/10 border border-white/20 text-white/85 text-xs font-medium px-3 py-1.5 rounded-full">{town}</span>
            ))}
          </div>
        </div>
      </section>

      <BookingWidget />
      <PublicFooter />
    </div>
  );
}
