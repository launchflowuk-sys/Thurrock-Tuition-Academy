import { useRef, useState } from "react";
import { useCreateIntakeSubmission } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { ArrowIcon } from "./icons";

/**
 * The live free-assessment application.
 *
 * Lifted out of pages/contact.tsx unchanged in behaviour: same fields, same
 * labels and placeholders, same required-field rules, same three steps, same
 * `useCreateIntakeSubmission` endpoint and payload, same success and error
 * handling. Only the markup and classes changed, to match the design handover.
 *
 * The handover's Contact reference shows a CTA button here because it was
 * hosted separately and handed off to production. Rendering the real form in
 * that panel is what stops that button becoming a self-link.
 */

const SUBJECTS = [
  "Maths",
  "English",
  "Science",
  "11+ (Verbal & Non-Verbal Reasoning)",
  "Combined (Maths + English)",
  "Other",
];

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

type Step = 1 | 2 | 3;

const STEP_NAMES: Record<Step, string> = {
  1: "About your child",
  2: "Your details",
  3: "Goals & background",
};

export default function AssessmentForm() {
  const { toast } = useToast();
  const createSubmission = useCreateIntakeSubmission();
  const [submitted, setSubmitted] = useState(false);
  const [step, setStep] = useState<Step>(1);
  const formTop = useRef<HTMLDivElement>(null);

  // Bring the form itself back into view when the step changes — NOT the top
  // of the page.
  //
  // This used to be window.scrollTo({top: 0}). On desktop the form sits near
  // the top so it looked harmless, but on a phone the form is a long way down
  // the Contact page: tapping "Next" threw the visitor back up to the hero,
  // and they had to scroll all the way down again to find the fields they were
  // just filling in. Every step. Anchoring to the form keeps their place.
  const revealForm = () => {
    const el = formTop.current;
    if (!el) return;
    // Offset by the sticky header, or the first field hides underneath it.
    const HEADER = 112;
    const y = el.getBoundingClientRect().top + window.scrollY - HEADER;
    window.scrollTo({
      top: Math.max(0, y),
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
  };
  const [form, setForm] = useState(emptyForm);

  const set =
    (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

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
    setStep((s) => (s + 1) as Step);
    revealForm();
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
      revealForm();
    } catch {
      toast({ title: "Something went wrong. Please try WhatsApp instead.", variant: "destructive" });
    }
  };

  if (submitted) {
    return (
      <div className="form-done">
        <div className="tick-big" aria-hidden="true">
          ✓
        </div>
        <h3>Application received.</h3>
        <p>
          Thank you. The academy will review {form.childName || "your child"}&rsquo;s details and be
          in touch within 24 hours to arrange their free assessment.
        </p>
        <div className="actions">
          <a className="btn outline" href="https://wa.me/447480413679">
            Message us on WhatsApp
            <ArrowIcon />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div ref={formTop}>
    <form onSubmit={handleSubmit} noValidate>
      <div className="form-steps" aria-label={`Step ${step} of 3`}>
        {([1, 2, 3] as Step[]).map((s) => (
          <div key={s}>
            <span
              className={`step-dot ${step === s ? "current" : ""} ${step > s ? "done" : ""}`}
              aria-hidden="true"
            >
              {step > s ? "✓" : s}
            </span>
            <span className={`step-name ${step === s ? "current" : ""}`}>{STEP_NAMES[s]}</span>
            {s < 3 && <span className="step-rule" aria-hidden="true" />}
          </div>
        ))}
      </div>

      {step === 1 && (
        <>
          <div className="field">
            <label htmlFor="childName">
              Child&rsquo;s full name <span className="req">*</span>
            </label>
            <input id="childName" type="text" value={form.childName} onChange={set("childName")} placeholder="e.g. Amina Khan" />
          </div>
          <div className="field-row">
            <div className="field">
              <label htmlFor="childAge">
                Child&rsquo;s age <span className="req">*</span>
              </label>
              <input id="childAge" type="number" min="4" max="19" value={form.childAge} onChange={set("childAge")} placeholder="e.g. 14" />
            </div>
            <div className="field">
              <label htmlFor="currentSchool">Current school (optional)</label>
              <input id="currentSchool" type="text" value={form.currentSchool} onChange={set("currentSchool")} placeholder="e.g. Grays Convent High School" />
            </div>
          </div>
          <div className="field-row">
            <div className="field">
              <label htmlFor="subject">
                Subject <span className="req">*</span>
              </label>
              <select id="subject" value={form.subject} onChange={set("subject")}>
                <option value="">Select a subject</option>
                {SUBJECTS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="level">
                Level / exam <span className="req">*</span>
              </label>
              <select id="level" value={form.level} onChange={set("level")}>
                <option value="">Select a level</option>
                {LEVELS.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="field">
            <label htmlFor="currentAttainment">Current attainment (optional)</label>
            <input id="currentAttainment" type="text" value={form.currentAttainment} onChange={set("currentAttainment")} placeholder="e.g. Grade 4, working at expected standard" />
          </div>
          <p className="field-hint">
            This helps us plan the right starting point for your child&rsquo;s assessment.
          </p>
          <div className="form-actions">
            <button type="button" className="btn" onClick={nextStep}>
              Next: your details
              <ArrowIcon />
            </button>
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <div className="field">
            <label htmlFor="parentName">
              Your full name <span className="req">*</span>
            </label>
            <input id="parentName" type="text" value={form.parentName} onChange={set("parentName")} placeholder="e.g. Sarah Johnson" />
          </div>
          <div className="field-row">
            <div className="field">
              <label htmlFor="email">
                Email address <span className="req">*</span>
              </label>
              <input id="email" type="email" value={form.email} onChange={set("email")} placeholder="e.g. sarah@email.com" />
            </div>
            <div className="field">
              <label htmlFor="contactNumber">
                Mobile number <span className="req">*</span>
              </label>
              <input id="contactNumber" type="tel" value={form.contactNumber} onChange={set("contactNumber")} placeholder="e.g. 07700 900123" />
            </div>
          </div>
          <div className="field">
            <label htmlFor="preferredSlot">Preferred session time</label>
            <select id="preferredSlot" value={form.preferredSlot} onChange={set("preferredSlot")}>
              <option value="">No preference</option>
              {SLOTS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div className="form-actions">
            <button type="button" className="btn outline" onClick={() => { setStep(1); revealForm(); }}>
              Back
            </button>
            <button type="button" className="btn" onClick={nextStep}>
              Next: goals
              <ArrowIcon />
            </button>
          </div>
        </>
      )}

      {step === 3 && (
        <>
          <div className="field">
            <label htmlFor="goals">
              What are you hoping to achieve? <span className="req">*</span>
            </label>
            <textarea id="goals" value={form.goals} onChange={set("goals")} rows={3} placeholder="e.g. Pass GCSE Maths with at least a grade 5, get into grammar school, build confidence in algebra, catch up after moving schools..." />
          </div>
          <div className="field">
            <label htmlFor="previousTutoring">What is your child currently struggling with?</label>
            <textarea id="previousTutoring" value={form.previousTutoring} onChange={set("previousTutoring")} rows={3} placeholder="e.g. Struggles with exam technique and running out of time, finds fractions difficult, loses focus during long sessions, anxious about exams..." />
          </div>
          <div className="field">
            <label htmlFor="howDidYouHear">How did you hear about us?</label>
            <select id="howDidYouHear" value={form.howDidYouHear} onChange={set("howDidYouHear")}>
              <option value="">Select an option</option>
              {HOW_HEARD.map((h) => (
                <option key={h} value={h}>
                  {h}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="additionalInfo">Anything else we should know?</label>
            <textarea id="additionalInfo" value={form.additionalInfo} onChange={set("additionalInfo")} rows={3} placeholder="e.g. exam board, target school, specific dates to know, SEN requirements, anything else..." />
          </div>
          <div className="form-actions">
            <button type="button" className="btn outline" onClick={() => { setStep(2); revealForm(); }}>
              Back
            </button>
            <button type="submit" className="btn" disabled={createSubmission.isPending}>
              {createSubmission.isPending ? "Sending…" : "Submit application"}
              <ArrowIcon />
            </button>
          </div>
        </>
      )}
    </form>
    </div>
  );
}
