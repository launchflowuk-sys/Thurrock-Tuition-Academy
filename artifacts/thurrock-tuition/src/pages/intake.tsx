import { useMemo, useState } from "react";
import { Link } from "wouter";
import {
  useListIntakeSubmissions, getListIntakeSubmissionsQueryKey,
  useUpdateIntakeSubmission, useDeleteIntakeSubmission,
  useReplyToIntakeSubmission, useConvertIntakeSubmission,
  getListStudentsQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import {
  AlertTriangle, ArrowLeft, CheckCircle2, ClipboardList, Info, Mail, Send, Trash2, UserPlus,
} from "lucide-react";
import { Kpi, Pill, type Ground } from "@/components/dashboard/primitives";

/**
 * Applications.
 *
 * Master/detail, not cards-plus-modal. The list on the left is an index; the
 * panel on the right is the record. The panel leads with the *student's* name
 * and names the *parent* on the line beneath it, because those two were the
 * fields most often confused for one another — in the UI and, until this
 * change, in the emails the UI sends.
 *
 * The reply composer and the enrol form are inline in the panel rather than in
 * dialogs, so the application being answered stays readable while it is being
 * answered.
 */

const STATUSES = ["new", "reviewing", "enrolled", "declined"] as const;
type Status = (typeof STATUSES)[number];

const STATUS_LABELS: Record<string, string> = {
  new: "New",
  reviewing: "Reviewing",
  enrolled: "Enrolled",
  declined: "Declined",
};

const STATUS_GROUND: Record<string, Ground | "grey"> = {
  new: "cobalt",
  reviewing: "amber",
  enrolled: "teal",
  declined: "coral",
};

const SLOTS = [
  "Morning 9am–11am",
  "Late Morning 11am–1pm",
  "Afternoon 1pm–3pm",
  "Late Afternoon 3pm–5pm",
  "Flexible / Any",
];

type Submission = {
  id: number;
  parentName: string;
  relationshipToChild?: string | null;
  childName: string;
  childAge: number;
  childYearGroup?: string | null;
  email: string;
  contactNumber: string;
  altContactNumber?: string | null;
  preferredContactMethod?: string | null;
  subject: string;
  level: string;
  currentSchool?: string | null;
  currentAttainment?: string | null;
  senNotes?: string | null;
  goals?: string | null;
  previousTutoring?: string | null;
  howDidYouHear?: string | null;
  preferredSlot?: string | null;
  additionalInfo?: string | null;
  marketingOptIn?: boolean;
  status: string;
  convertedStudentId?: number | null;
  createdAt: string;
};

const shortDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" });

const fullDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });

/** One field in the panel. Renders even when empty, so gaps are visible. */
function Field({ label, value, href }: { label: string; value?: string | null; href?: string }) {
  const has = value !== null && value !== undefined && String(value).trim() !== "";
  return (
    <div className="app-field">
      <dt>{label}</dt>
      <dd className={has ? undefined : "empty"}>
        {!has ? "Not given" : href ? <a href={href}>{value}</a> : value}
      </dd>
    </div>
  );
}

function Group({ title, children, single }: { title: string; children: React.ReactNode; single?: boolean }) {
  return (
    <div className="app-group">
      <h3 className="app-group-title">{title}</h3>
      <dl className={single ? "app-fields one" : "app-fields"}>{children}</dl>
    </div>
  );
}

export default function ApplicationsPage() {
  const { data: submissions, isLoading } = useListIntakeSubmissions({ query: { queryKey: getListIntakeSubmissionsQueryKey() } });
  const updateSubmission = useUpdateIntakeSubmission();
  const deleteSubmission = useDeleteIntakeSubmission();
  const replyToSubmission = useReplyToIntakeSubmission();
  const convertSubmission = useConvertIntakeSubmission();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState<"all" | Status>("all");
  const [composing, setComposing] = useState(false);
  const [replyForm, setReplyForm] = useState({ subject: "", body: "" });
  const [enrolling, setEnrolling] = useState(false);
  const [enrolForm, setEnrolForm] = useState({ sessionSlot: "", notes: "" });

  const list = useMemo(
    () => [...((submissions ?? []) as Submission[])].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ),
    [submissions]
  );

  const filtered = statusFilter === "all" ? list : list.filter((s) => s.status === statusFilter);

  // The selection follows the filtered list: whatever is on screen is what can
  // be selected, and the newest application is open by default so the screen
  // is never a blank panel next to a full list.
  const selected = filtered.find((s) => s.id === selectedId) ?? filtered[0] ?? null;

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: getListIntakeSubmissionsQueryKey() });
  };

  const open = (sub: Submission) => {
    setSelectedId(sub.id);
    setComposing(false);
    setEnrolling(false);
  };

  const handleStatusChange = async (id: number, status: string) => {
    try {
      await updateSubmission.mutateAsync({ id, data: { status } });
      refresh();
      toast({ title: `Marked as ${STATUS_LABELS[status] ?? status}` });
    } catch {
      toast({ title: "Could not update the status", variant: "destructive" });
    }
  };

  const handleDelete = async (sub: Submission) => {
    if (!window.confirm(`Delete ${sub.childName}'s application? This cannot be undone.`)) return;
    try {
      await deleteSubmission.mutateAsync({ id: sub.id });
      setSelectedId(null);
      refresh();
      toast({ title: "Application deleted" });
    } catch {
      toast({ title: "Could not delete the application", variant: "destructive" });
    }
  };

  const startReply = (sub: Submission) => {
    setEnrolling(false);
    setComposing(true);
    // The subject names the CHILD. The greeting names the PARENT. Getting
    // these the wrong way round is the bug this pre-fill exists to prevent.
    setReplyForm({
      subject: `${sub.childName}'s application – Thurrock Tuition Academy`,
      body:
        `Dear ${sub.parentName},\n\n` +
        `Thank you for applying to Thurrock Tuition Academy for ${sub.childName} ` +
        `(${sub.subject}, ${sub.level}).\n\n`,
    });
  };

  const sendReply = async (sub: Submission) => {
    if (!replyForm.subject.trim() || !replyForm.body.trim()) {
      toast({ title: "Please complete both the subject and the message", variant: "destructive" });
      return;
    }
    try {
      await replyToSubmission.mutateAsync({ id: sub.id, data: { subject: replyForm.subject, body: replyForm.body } });
      toast({ title: "Email sent", description: `Reply sent to ${sub.parentName} at ${sub.email}` });
      setComposing(false);
      if (sub.status === "new") await handleStatusChange(sub.id, "reviewing");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;
      toast({
        title: "Could not send the email",
        description: msg ?? "Check your SMTP settings in Settings → Email.",
        variant: "destructive",
      });
    }
  };

  const startEnrol = (sub: Submission) => {
    setComposing(false);
    setEnrolling(true);
    setEnrolForm({ sessionSlot: sub.preferredSlot ?? "", notes: "" });
  };

  const enrol = async (sub: Submission) => {
    try {
      const student = await convertSubmission.mutateAsync({
        id: sub.id,
        data: {
          sessionSlot: enrolForm.sessionSlot || undefined,
          notes: enrolForm.notes || undefined,
        },
      });
      setEnrolling(false);
      refresh();
      queryClient.invalidateQueries({ queryKey: getListStudentsQueryKey() });
      toast({
        title: `${student.name} is now a student`,
        description: "Everything from the application was carried over to their record.",
      });
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;
      toast({
        title: "Could not enrol this applicant",
        description: msg ?? "Please try again.",
        variant: "destructive",
      });
      refresh();
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h1 className="dash-page-title">Applications</h1>
        <div className="kpi-strip">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-[148px] w-full rounded-[22px]" />)}
        </div>
        <Skeleton className="h-96 w-full rounded-[20px]" />
      </div>
    );
  }

  const count = (s: Status) => list.filter((x) => x.status === s).length;
  const newCount = count("new");

  return (
    <div>
      <h1 className="dash-page-title">Applications</h1>
      <p className="dash-page-sub">
        {newCount > 0
          ? `${newCount} new application${newCount === 1 ? "" : "s"} awaiting review.`
          : "Every application has been picked up."}
      </p>

      <div className="kpi-strip">
        <Kpi ground="navy" label="Applications" value={String(list.length)} note="All time" />
        <Kpi ground={newCount > 0 ? "cobalt" : "teal"} label="New" value={String(newCount)} note={newCount > 0 ? "Not yet answered" : "All answered"} />
        <Kpi ground={count("reviewing") > 0 ? "amber" : "teal"} label="Reviewing" value={String(count("reviewing"))} note="Contacted, no decision" />
        <Kpi ground="teal" label="Enrolled" value={String(count("enrolled"))} note="Now students" />
      </div>

      {/* Status filter — a row of buttons, so the counts are readable without
          opening a dropdown. */}
      <div className="app-panel-actions" style={{ borderRadius: "var(--r-surface)", border: "1px solid var(--rule)", marginBottom: 16 }}>
        {(["all", ...STATUSES] as const).map((s) => {
          const n = s === "all" ? list.length : count(s);
          const active = statusFilter === s;
          return (
            <button
              key={s}
              type="button"
              className={active ? "btn-d sm" : "btn-d ghost sm"}
              onClick={() => { setStatusFilter(s); setSelectedId(null); }}
              aria-pressed={active}
            >
              {s === "all" ? "All" : STATUS_LABELS[s]} ({n})
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="panel">
          <div className="empty">
            <ClipboardList size={38} style={{ margin: "0 auto 14px", opacity: 0.3 }} />
            <p style={{ margin: 0 }}>
              {list.length === 0
                ? "No applications yet. They appear here the moment a parent completes the form on the website."
                : `No ${STATUS_LABELS[statusFilter]?.toLowerCase()} applications.`}
            </p>
          </div>
        </div>
      ) : (
        <div className={selectedId !== null ? "app-split detail-open" : "app-split"}>
          {/* ── The index ─────────────────────────────────────────────── */}
          <div className="app-index">
            {filtered.map((sub) => (
              <button
                key={sub.id}
                type="button"
                onClick={() => open(sub)}
                className={[
                  "app-row",
                  selected?.id === sub.id ? "current" : "",
                  sub.status === "new" ? "unread" : "",
                ].filter(Boolean).join(" ")}
                data-testid={`app-row-${sub.id}`}
              >
                <span className="app-row-student">{sub.childName}</span>
                <span className="app-row-parent">Parent: {sub.parentName}</span>
                <span className="app-row-meta">
                  <Pill ground={STATUS_GROUND[sub.status] ?? "grey"}>{STATUS_LABELS[sub.status] ?? sub.status}</Pill>
                  <span>{sub.subject}</span>
                  <span>·</span>
                  <span>{shortDate(sub.createdAt)}</span>
                </span>
              </button>
            ))}
          </div>

          {/* ── The record ────────────────────────────────────────────── */}
          {selected && (
            <div className="app-panel">
              <div className="app-panel-head">
                <button type="button" className="btn-d ghost sm app-back" style={{ marginBottom: 12 }} onClick={() => setSelectedId(null)}>
                  <ArrowLeft size={15} /> All applications
                </button>
                <p style={{ margin: 0, fontSize: "var(--text-label)", textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: 700, color: "var(--ink-3)" }}>
                  Student
                </p>
                <h2 className="app-panel-student">{selected.childName}</h2>
                <p className="app-panel-parent">
                  Applied by <strong>{selected.parentName}</strong>
                  {selected.relationshipToChild ? ` — ${selected.relationshipToChild.toLowerCase()}` : ""}
                  {" · "}
                  <a href={`tel:${selected.contactNumber}`} style={{ color: "var(--accent)" }}>{selected.contactNumber}</a>
                  {" · "}
                  <a href={`mailto:${selected.email}`} style={{ color: "var(--accent)" }}>{selected.email}</a>
                </p>
                <div className="app-panel-tags">
                  <Pill ground={STATUS_GROUND[selected.status] ?? "grey"}>{STATUS_LABELS[selected.status] ?? selected.status}</Pill>
                  <Pill>Age {selected.childAge}</Pill>
                  {selected.childYearGroup && <Pill>{selected.childYearGroup}</Pill>}
                  <Pill>{selected.subject}</Pill>
                  <Pill>{selected.level}</Pill>
                </div>
              </div>

              <div className="app-panel-actions">
                <button type="button" className="btn-d sm" onClick={() => startReply(selected)}>
                  <Mail size={15} /> Reply by email
                </button>
                {selected.convertedStudentId ? (
                  <Link className="btn-d ghost sm" href={`/students/${selected.convertedStudentId}`}>
                    <CheckCircle2 size={15} /> Open student record
                  </Link>
                ) : (
                  <button type="button" className="btn-d ghost sm" onClick={() => startEnrol(selected)}>
                    <UserPlus size={15} /> Enrol as a student
                  </button>
                )}
                <select
                  className="btn-d ghost sm"
                  style={{ height: 36, paddingRight: 10 }}
                  value={selected.status}
                  onChange={(e) => handleStatusChange(selected.id, e.target.value)}
                  aria-label="Application status"
                >
                  {STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                </select>
                <button
                  type="button"
                  className="btn-d ghost sm"
                  style={{ color: "var(--coral)", marginLeft: "auto" }}
                  onClick={() => handleDelete(selected)}
                >
                  <Trash2 size={15} /> Delete
                </button>
              </div>

              <div className="app-panel-body">
                {/* Reply composer — inline, so the application stays readable
                    while it is being answered. */}
                {composing && (
                  <div className="app-form">
                    <p className="app-form-title">Reply to {selected.parentName}</p>
                    <p className="app-form-sub">
                      Sending to {selected.email}. The subject names {selected.childName}; the message opens to {selected.parentName}.
                    </p>
                    <div className="row">
                      <label htmlFor="replySubject">Subject</label>
                      <input
                        id="replySubject"
                        value={replyForm.subject}
                        onChange={(e) => setReplyForm((f) => ({ ...f, subject: e.target.value }))}
                      />
                    </div>
                    <div className="row">
                      <label htmlFor="replyBody">Message</label>
                      <textarea
                        id="replyBody"
                        rows={12}
                        value={replyForm.body}
                        onChange={(e) => setReplyForm((f) => ({ ...f, body: e.target.value }))}
                      />
                    </div>
                    <div className="app-note warn">
                      <Info size={14} />
                      <span>
                        Sent from the address configured in <strong>Settings → Email</strong>, on the
                        academy&rsquo;s branded template. Replying moves this application to
                        &ldquo;Reviewing&rdquo;.
                      </span>
                    </div>
                    <div className="app-form-actions">
                      <button type="button" className="btn-d sm" disabled={replyToSubmission.isPending} onClick={() => sendReply(selected)}>
                        <Send size={15} /> {replyToSubmission.isPending ? "Sending…" : "Send email"}
                      </button>
                      <button type="button" className="btn-d ghost sm" onClick={() => setComposing(false)}>Cancel</button>
                    </div>
                  </div>
                )}

                {/* Enrol — the one-click promote, with the single decision the
                    students table needs that the form does not require. */}
                {enrolling && (
                  <div className="app-form">
                    <p className="app-form-title">Enrol {selected.childName} as a student</p>
                    <p className="app-form-sub">
                      Creates a student record from this application. Name, age, subject, level,
                      and {selected.parentName}&rsquo;s contact details are carried across, and
                      everything else the form captured becomes the opening note.
                    </p>
                    <div className="row">
                      <label htmlFor="enrolSlot">Session slot</label>
                      <select
                        id="enrolSlot"
                        value={enrolForm.sessionSlot}
                        onChange={(e) => setEnrolForm((f) => ({ ...f, sessionSlot: e.target.value }))}
                      >
                        <option value="">
                          {selected.preferredSlot ? `Preferred: ${selected.preferredSlot}` : "To be confirmed"}
                        </option>
                        {SLOTS.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div className="row">
                      <label htmlFor="enrolNotes">Anything to add to their record</label>
                      <textarea
                        id="enrolNotes"
                        rows={3}
                        style={{ minHeight: 84 }}
                        placeholder="Optional — added above the details carried over from the application."
                        value={enrolForm.notes}
                        onChange={(e) => setEnrolForm((f) => ({ ...f, notes: e.target.value }))}
                      />
                    </div>
                    <div className="app-form-actions">
                      <button type="button" className="btn-d sm" disabled={convertSubmission.isPending} onClick={() => enrol(selected)}>
                        <UserPlus size={15} /> {convertSubmission.isPending ? "Enrolling…" : `Enrol ${selected.childName}`}
                      </button>
                      <button type="button" className="btn-d ghost sm" onClick={() => setEnrolling(false)}>Cancel</button>
                    </div>
                  </div>
                )}

                {selected.convertedStudentId && (
                  <div className="app-note good" style={{ marginTop: 0, marginBottom: 20 }}>
                    <CheckCircle2 size={15} />
                    <span>
                      {selected.childName} has been enrolled from this application.{" "}
                      <Link href={`/students/${selected.convertedStudentId}`} style={{ textDecoration: "underline" }}>
                        Open their student record
                      </Link>.
                    </span>
                  </div>
                )}

                {/* Every field, grouped by who it is about. */}
                <Group title="The student">
                  <Field label="Student name" value={selected.childName} />
                  <Field label="Age" value={String(selected.childAge)} />
                  <Field label="Year group" value={selected.childYearGroup} />
                  <Field label="Current school" value={selected.currentSchool} />
                  <Field label="Subject" value={selected.subject} />
                  <Field label="Level / exam" value={selected.level} />
                  <Field label="Current attainment" value={selected.currentAttainment} />
                  <Field label="SEN / additional needs" value={selected.senNotes} />
                </Group>

                <Group title="Parent or guardian">
                  <Field label="Parent name" value={selected.parentName} />
                  <Field label="Relationship to child" value={selected.relationshipToChild} />
                  <Field label="Email" value={selected.email} href={`mailto:${selected.email}`} />
                  <Field label="Contact number" value={selected.contactNumber} href={`tel:${selected.contactNumber}`} />
                  <Field label="Alternative number" value={selected.altContactNumber} href={selected.altContactNumber ? `tel:${selected.altContactNumber}` : undefined} />
                  <Field label="Prefers contact by" value={selected.preferredContactMethod} />
                  <Field label="Marketing emails" value={selected.marketingOptIn ? "Opted in" : "Not opted in"} />
                </Group>

                <Group title="Goals and background" single>
                  <Field label="What they want to achieve" value={selected.goals} />
                  <Field label="What the child is struggling with" value={selected.previousTutoring} />
                  <Field label="Anything else we should know" value={selected.additionalInfo} />
                </Group>

                <Group title="Application">
                  <Field label="Preferred slot" value={selected.preferredSlot} />
                  <Field label="How they heard about us" value={selected.howDidYouHear} />
                  <Field label="Submitted" value={fullDate(selected.createdAt)} />
                  <Field label="Reference" value={`#${selected.id}`} />
                </Group>

                {!selected.email && (
                  <div className="app-note warn">
                    <AlertTriangle size={15} />
                    <span>No email address on this application — you will have to phone {selected.parentName}.</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
