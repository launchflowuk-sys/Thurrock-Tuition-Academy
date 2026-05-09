import { useState } from "react";
import { useCreateEnquiry } from "@workspace/api-client-react";
import PublicNav from "@/components/layout/public-nav";
import PublicFooter from "@/components/layout/public-footer";
import { useToast } from "@/hooks/use-toast";

const SUBJECTS = ["Maths", "English", "Science"];
const LEVELS = ["SATs (KS2)", "11+ Preparation", "KS3", "GCSE", "A-Level"];
const SLOTS = ["Morning Session 1 (9am–11am)", "Morning Session 2 (11am–1pm)", "Afternoon Session 1 (1pm–3pm)", "Afternoon Session 2 (3pm–5pm)"];

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
    q: "Where are you based?",
    a: "We are based at Suite 1, Queensgate Centre, Orsett Road, Grays, Thurrock. There is free parking available on site.",
  },
];

export default function ContactPage() {
  const { toast } = useToast();
  const createEnquiry = useCreateEnquiry();
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const [form, setForm] = useState({
    parentName: "",
    childName: "",
    childAge: "",
    contactNumber: "",
    subject: "",
    level: "",
    preferredSlot: "",
    notes: "",
  });

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { parentName, childName, childAge, contactNumber, subject, level, preferredSlot } = form;
    if (!parentName || !childName || !childAge || !contactNumber || !subject || !level || !preferredSlot) {
      toast({ title: "Please complete all required fields", variant: "destructive" });
      return;
    }
    try {
      await createEnquiry.mutateAsync({
        data: {
          parentName,
          childName,
          childAge: Number(childAge),
          contactNumber,
          subject,
          level,
          preferredSlot,
          notes: form.notes || undefined,
        },
      });
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      toast({ title: "Something went wrong. Please try WhatsApp instead.", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <PublicNav />

      {/* Hero */}
      <section className="pt-32 pb-20 bg-[#1B2B6B] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1B2B6B] to-[#0f1a3e]" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-[#C9973A] font-semibold uppercase tracking-widest text-sm mb-4">Get in Touch</p>
          <h1 className="text-5xl md:text-6xl font-bold font-serif text-white mb-6">
            Book Your Free Assessment
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto leading-relaxed">
            Fill in the form below and we'll be in touch within 24 hours to confirm your child's free assessment session.
          </p>
        </div>
      </section>

      {submitted ? (
        <section className="py-24 bg-white">
          <div className="max-w-xl mx-auto px-4 sm:px-6 text-center">
            <div className="text-6xl mb-6">🎉</div>
            <h2 className="text-3xl font-bold font-serif text-[#1B2B6B] mb-4">Thank You!</h2>
            <p className="text-muted-foreground text-lg mb-4">
              Your enquiry has been received. Khadija will be in touch within 24 hours to arrange your child's free assessment session.
            </p>
            <p className="text-muted-foreground mb-8">
              In the meantime, feel free to send a message on WhatsApp if you have any immediate questions.
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
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid lg:grid-cols-5 gap-16">

              {/* Form */}
              <div className="lg:col-span-3">
                <h2 className="text-2xl font-bold font-serif text-[#1B2B6B] mb-8">Enquiry Form</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-1.5">Your Name *</label>
                      <input
                        type="text"
                        value={form.parentName}
                        onChange={set("parentName")}
                        placeholder="e.g. Sarah Johnson"
                        className="w-full border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B2B6B]/30 focus:border-[#1B2B6B] transition-all bg-background"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-1.5">Child's Name *</label>
                      <input
                        type="text"
                        value={form.childName}
                        onChange={set("childName")}
                        placeholder="e.g. Emma Johnson"
                        className="w-full border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B2B6B]/30 focus:border-[#1B2B6B] transition-all bg-background"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-1.5">Child's Age *</label>
                      <input
                        type="number"
                        value={form.childAge}
                        onChange={set("childAge")}
                        placeholder="e.g. 14"
                        min="5"
                        max="19"
                        className="w-full border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B2B6B]/30 focus:border-[#1B2B6B] transition-all bg-background"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-1.5">Contact Number *</label>
                      <input
                        type="tel"
                        value={form.contactNumber}
                        onChange={set("contactNumber")}
                        placeholder="e.g. 07700 900123"
                        className="w-full border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B2B6B]/30 focus:border-[#1B2B6B] transition-all bg-background"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-1.5">Subject *</label>
                      <select
                        value={form.subject}
                        onChange={set("subject")}
                        className="w-full border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B2B6B]/30 focus:border-[#1B2B6B] transition-all bg-background"
                      >
                        <option value="">Select a subject</option>
                        {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-1.5">Level / Exam *</label>
                      <select
                        value={form.level}
                        onChange={set("level")}
                        className="w-full border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B2B6B]/30 focus:border-[#1B2B6B] transition-all bg-background"
                      >
                        <option value="">Select a level</option>
                        {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-1.5">Preferred Session Slot *</label>
                    <select
                      value={form.preferredSlot}
                      onChange={set("preferredSlot")}
                      className="w-full border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B2B6B]/30 focus:border-[#1B2B6B] transition-all bg-background"
                    >
                      <option value="">Select preferred slot</option>
                      {SLOTS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-1.5">Anything else we should know?</label>
                    <textarea
                      value={form.notes}
                      onChange={set("notes")}
                      rows={4}
                      placeholder="Tell us about your child's current level, specific challenges, target school or exam board if known..."
                      className="w-full border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B2B6B]/30 focus:border-[#1B2B6B] transition-all resize-none bg-background"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={createEnquiry.isPending}
                    className="w-full bg-[#1B2B6B] hover:bg-[#243580] disabled:opacity-60 text-white font-bold px-8 py-4 rounded-xl text-base shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5"
                  >
                    {createEnquiry.isPending ? "Submitting..." : "Submit Enquiry →"}
                  </button>

                  <p className="text-xs text-muted-foreground text-center">
                    Or contact us directly: <a href="https://wa.me/447480413679" className="text-[#1B2B6B] font-medium hover:text-[#C9973A]">WhatsApp 07480 413679</a>
                  </p>
                </form>
              </div>

              {/* Contact Info */}
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
                      <svg className="w-5 h-5 shrink-0 text-[#C9973A]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                      <span className="text-white/80">Mon–Sat: 9am – 6pm</span>
                    </li>
                  </ul>
                  <a
                    href="https://wa.me/447480413679"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ab553] text-white font-semibold px-5 py-3 rounded-xl transition-all duration-200"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.852L.057 23.571a.5.5 0 00.611.611l5.72-1.47A11.944 11.944 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.878 0-3.638-.49-5.163-1.348l-.37-.213-3.398.873.89-3.328-.23-.38A9.944 9.944 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
                    Message on WhatsApp
                  </a>
                </div>

                <div className="bg-[#C9973A]/10 border border-[#C9973A]/20 rounded-2xl p-6">
                  <h3 className="font-bold font-serif text-[#1B2B6B] mb-2">Free Assessment Includes</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {["Initial written assessment", "Strength & weakness analysis", "Personalised feedback report", "Recommended study plan", "No obligation to continue"].map(item => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="text-[#C9973A] font-bold mt-0.5">✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
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
                <button
                  className="w-full flex items-center justify-between px-6 py-5 text-left font-semibold text-[#1B2B6B] hover:bg-[#1B2B6B]/3 transition-colors"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span>{q}</span>
                  <span className="shrink-0 ml-4 text-[#C9973A] text-xl leading-none">
                    {openFaq === i ? "−" : "+"}
                  </span>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 text-sm text-muted-foreground leading-relaxed border-t border-border pt-4">
                    {a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
