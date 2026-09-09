import { useRef, useState } from "react";
import { Link } from "wouter";
import { useCreateIntakeSubmission } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { ArrowIcon } from "./icons";

/**
 * The live free-assessment application.
 *
 * Four steps, and the split between them is the point: the child is asked
 * about on its own, the tuition on its own, and the parent on its own. The
 * earlier three-step version collected the same names but nothing on screen
 * said whose details a step wanted, so "Child's full name" and "Your full
 * name" read as the same question twice and got the same answer. Each step
 * now opens with a banner naming the person it is about, inside a fieldset
 * whose legend says the same thing for screen readers.
 *
 * Every field maps to a column on `intake_submissions` and is surfaced in the
 * dashboard's application panel and in both intake emails — nothing collected
 * here is dropped on the floor.
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

const YEAR_GROUPS = [
  "Reception", "Year 1", "Year 2", "Year 3", "Year 4", "Year 5", "Year 6",
  "Year 7", "Year 8", "Year 9", "Year 10", "Year 11", "Year 12", "Year 13",
];

const RELATIONSHIPS = ["Mother", "Father", "Guardian", "Grandparent", "Other"];

const CONTACT_METHODS = ["Phone call", "WhatsApp", "Text message", "Email"];

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
  // Step 1 — the child
  childName: "",
  childAge: "",
  childYearGroup: "",
  currentSchool: "",
  // Step 2 — the tuition the child needs
  subject: "",
  level: "",
  currentAttainment: "",
  senNotes: "",
  // Step 3 — the parent or guardian
  parentName: "",
  relationshipToChild: "",
  email: "",
  contactNumber: "",
  altContactNumber: "",
  preferredContactMethod: "",
  preferredSlot: "",
  // Step 4 — goals and background
  goals: "",
  previousTutoring: "",
  howDidYouHear: "",
  additionalInfo: "",
  marketingOptIn: false,
};

type Step = 1 | 2 | 3 | 4;

const STEP_NAMES: Record<Step, string> = {
  1: "Your child",
  2: "Tuition needed",
  3: "Your details",
  4: "Goals",
};

const STEPS: Step[] = [1, 2, 3, 4];

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

  const setChecked =
    (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.checked }));

  const incomplete = (title: string) =>
    toast({ title, variant: "destructive" });

  const nextStep = () => {
    if (step === 1 && (!form.childName || !form.childAge)) {
      incomplete("Please tell us your child's name and age");
      return;
    }
    if (step === 2 && (!form.subject || !form.level)) {
      incomplete("Please choose a subject and a level");
      return;
    }
    if (step === 3) {
      if (!form.parentName || !form.email || !form.contactNumber) {
        incomplete("Please complete your name, email and mobile number");
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
        incomplete("Please enter a valid email address");
        return;
      }
    }
    setStep((s) => (s + 1) as Step);
    revealForm();
  };

  const back = (to: Step) => {
    setStep(to);
    revealForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.goals) {
      incomplete("Please tell us what you're hoping to achieve");
      return;
    }
    try {
      await createSubmission.mutateAsync({
        data: {
          // The child
          childName: form.childName,
          childAge: Number(form.childAge),
          childYearGroup: form.childYearGroup || undefined,
          currentSchool: form.currentSchool || undefined,
          subject: form.subject,
          level: form.level,
          currentAttainment: form.currentAttainment || undefined,
          senNotes: form.senNotes || undefined,
          // The parent or guardian
          parentName: form.parentName,
          relationshipToChild: form.relationshipToChild || undefined,
          email: form.email,
          contactNumber: form.contactNumber,
          altContactNumber: form.altContactNumber || undefined,
          preferredContactMethod: form.preferredContactMethod || undefined,
          preferredSlot: form.preferredSlot || undefined,
          // Goals and background
          goals: form.goals || undefined,
          previousTutoring: form.previousTutoring || undefined,
          howDidYouHear: form.howDidYouHear || undefined,
          additionalInfo: form.additionalInfo || undefined,
          marketingOptIn: form.marketingOptIn,
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

  /** The banner that names whose details a step is asking for. */
  const Who = ({ who, title, note }: { who: "child" | "parent"; title: string; note: string }) => (
    <div className={who === "parent" ? "who parent" : "who"}>
      <span className="who-badge" aria-hidden="true">
        {who === "parent" ? "You" : "1"}
      </span>
      <div>
        <strong>{title}</strong>
        <p>{note}</p>
      </div>
    </div>
  );

  return (
    <div ref={formTop}>
    <form onSubmit={handleSubmit} noValidate>
      <div className="form-steps" aria-label={`Step ${step} of 4`}>
        {STEPS.map((s) => (
          <div key={s}>
            <span
              className={`step-dot ${step === s ? "current" : ""} ${step > s ? "done" : ""}`}
              aria-hidden="true"
            >
              {step > s ? "✓" : s}
            </span>
            <span className={`step-name ${step === s ? "current" : ""}`}>{STEP_NAMES[s]}</span>
            {s < 4 && <span className="step-rule" aria-hidden="true" />}
          </div>
        ))}
      </div>

      {step === 1 && (
        <fieldset className="form-group">
          <legend>About the child who needs tuition</legend>
          <Who
            who="child"
            title="About your child"
            note="These are the child's details — we'll ask for yours in a moment."
          />
          <div className="field">
            <label htmlFor="childName">
              Child&rsquo;s full name <span className="req">*</span>
            </label>
            <input id="childName" type="text" autoComplete="off" value={form.childName} onChange={set("childName")} placeholder="e.g. Amina Khan" />
          </div>
          <div className="field-row">
            <div className="field">
              <label htmlFor="childAge">
                Child&rsquo;s age <span className="req">*</span>
              </label>
              <input id="childAge" type="number" min="4" max="19" value={form.childAge} onChange={set("childAge")} placeholder="e.g. 14" />
            </div>
            <div className="field">
              <label htmlFor="childYearGroup">Year group</label>
              <select id="childYearGroup" value={form.childYearGroup} onChange={set("childYearGroup")}>
                <option value="">Select year group</option>
                {YEAR_GROUPS.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="field">
            <label htmlFor="currentSchool">Current school</label>
            <input id="currentSchool" type="text" value={form.currentSchool} onChange={set("currentSchool")} placeholder="e.g. Grays Convent High School" />
          </div>
          <div className="form-actions">
            <button type="button" className="btn" onClick={nextStep}>
              Next: tuition needed
              <ArrowIcon />
            </button>
          </div>
        </fieldset>
      )}

      {step === 2 && (
        <fieldset className="form-group">
          <legend>What tuition the child needs</legend>
          <Who
            who="child"
            title={`What ${form.childName ? `${form.childName.split(" ")[0]} needs` : "your child needs"}`}
            note="This tells us which tutor to put them with and where to start."
          />
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
            <label htmlFor="currentAttainment">Current attainment</label>
            <input id="currentAttainment" type="text" value={form.currentAttainment} onChange={set("currentAttainment")} placeholder="e.g. Grade 4, working at expected standard" />
          </div>
          <p className="field-hint">
            This helps us plan the right starting point for the free assessment.
          </p>
          <div className="field">
            <label htmlFor="senNotes">SEN or additional needs</label>
            <textarea id="senNotes" value={form.senNotes} onChange={set("senNotes")} rows={2} placeholder="e.g. dyslexia, ADHD, an EHC plan, extra time in exams, anything that helps us teach them well" />
          </div>
          <div className="form-actions">
            <button type="button" className="btn outline" onClick={() => back(1)}>
              Back
            </button>
            <button type="button" className="btn" onClick={nextStep}>
              Next: your details
              <ArrowIcon />
            </button>
          </div>
        </fieldset>
      )}

      {step === 3 && (
        <fieldset className="form-group">
          <legend>About you, the parent or guardian</legend>
          <Who
            who="parent"
            title="Now about you"
            note={
              form.childName
                ? `These are your own details, not ${form.childName.split(" ")[0]}'s — they're how we reach you.`
                : "These are your own details, not your child's — they're how we reach you."
            }
          />
          <div className="field-row">
            <div className="field">
              <label htmlFor="parentName">
                Your full name <span className="req">*</span>
              </label>
              <input id="parentName" type="text" autoComplete="name" value={form.parentName} onChange={set("parentName")} placeholder="e.g. Sarah Johnson" />
            </div>
            <div className="field">
              <label htmlFor="relationshipToChild">You are the child&rsquo;s&hellip;</label>
              <select id="relationshipToChild" value={form.relationshipToChild} onChange={set("relationshipToChild")}>
                <option value="">Select</option>
                {RELATIONSHIPS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="field-row">
            <div className="field">
              <label htmlFor="email">
                Your email address <span className="req">*</span>
              </label>
              <input id="email" type="email" autoComplete="email" value={form.email} onChange={set("email")} placeholder="e.g. sarah@email.com" />
            </div>
            <div className="field">
              <label htmlFor="contactNumber">
                Your mobile number <span className="req">*</span>
              </label>
              <input id="contactNumber" type="tel" autoComplete="tel" value={form.contactNumber} onChange={set("contactNumber")} placeholder="e.g. 07700 900123" />
            </div>
          </div>
          <div className="field-row">
            <div className="field">
              <label htmlFor="altContactNumber">Alternative number</label>
              <input id="altContactNumber" type="tel" value={form.altContactNumber} onChange={set("altContactNumber")} placeholder="Optional second contact" />
            </div>
            <div className="field">
              <label htmlFor="preferredContactMethod">Best way to reach you</label>
              <select id="preferredContactMethod" value={form.preferredContactMethod} onChange={set("preferredContactMethod")}>
                <option value="">No preference</option>
                {CONTACT_METHODS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
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
            <button type="button" className="btn outline" onClick={() => back(2)}>
              Back
            </button>
            <button type="button" className="btn" onClick={nextStep}>
              Next: goals
              <ArrowIcon />
            </button>
          </div>
        </fieldset>
      )}

      {step === 4 && (
        <fieldset className="form-group">
          <legend>Goals, background and consent</legend>
          <Who
            who="child"
            title="What you want them to get out of it"
            note="The more you tell us here, the better the first session goes."
          />
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
            <textarea id="additionalInfo" value={form.additionalInfo} onChange={set("additionalInfo")} rows={3} placeholder="e.g. exam board, target school, specific dates to know, anything else..." />
          </div>

          <p className="privacy-note">
            We use these details only to arrange your child&rsquo;s assessment and tuition. We never
            sell them. See our <Link href="/privacy">privacy notice</Link> for how long we keep
            them.
          </p>
          <label className="field-check" htmlFor="marketingOptIn">
            <input
              id="marketingOptIn"
              type="checkbox"
              checked={form.marketingOptIn}
              onChange={setChecked("marketingOptIn")}
            />
            <span>
              Email me occasional exam tips, revision guides and academy news. You can unsubscribe
              at any time &mdash; this is optional and does not affect your application.
            </span>
          </label>

          <div className="form-actions">
            <button type="button" className="btn outline" onClick={() => back(3)}>
              Back
            </button>
            <button type="submit" className="btn" disabled={createSubmission.isPending}>
              {createSubmission.isPending ? "Sending…" : "Submit application"}
              <ArrowIcon />
            </button>
          </div>
        </fieldset>
      )}
    </form>
    </div>
  );
}
