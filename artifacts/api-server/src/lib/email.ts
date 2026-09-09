import nodemailer from "nodemailer";
import { db, settingsTable } from "@workspace/db";
import { readSecret } from "./paymentSettings";
import { logger } from "./logger";
import {
  BRAND, appUrl, callout, detailTable, esc, escMultiline, para, section, shell, subjectLine,
} from "./emailShell";

/* ---------------------------------------------------------------------------
 * The seven outbound emails. Every one is built from ./emailShell, so the
 * brand, the footer and the parent/child labelling are defined once.
 *
 * Two rules that were previously broken template by template:
 *  - subjects are built by subjectLine(), which requires the CHILD's name, so
 *    the parent's name can no longer appear where the student's belongs;
 *  - every interpolated value goes through esc(), because POST /intake is
 *    public and unauthenticated.
 * ------------------------------------------------------------------------- */

// smtpPass is encrypted at rest (see routes/settings.ts), so it has to be
// decrypted before nodemailer sees it. readSecret passes through values that
// predate encryption, so this is safe on a not-yet-migrated database.
async function getSmtpSettings() {
  const rows = await db.select().from(settingsTable).limit(1);
  const settings = rows[0];
  if (!settings) return null;
  return { ...settings, smtpPass: readSecret(settings.smtpPass) };
}

// Every outbound email is fire-and-forget — a failed send must never break the
// request that triggered it. It must also never vanish silently, which is what
// the previous bare `.catch(() => {})` calls did: a broken SMTP config looked
// identical to a working one.
function onSendFailure(kind: string, to?: string | null) {
  return (err: unknown) => {
    logger.error({ err, email: kind, to }, "Failed to send email");
  };
}

function createTransport(s: { smtpHost: string | null; smtpPort: number | null; smtpUser: string | null; smtpPass: string | null }) {
  return nodemailer.createTransport({
    host: s.smtpHost ?? "",
    port: s.smtpPort ?? 587,
    secure: (s.smtpPort ?? 587) === 465,
    auth: { user: s.smtpUser ?? "", pass: s.smtpPass ?? "" },
  });
}

const gbp = (n: number) => `£${n.toFixed(2)}`;

const longDate = (d: string) =>
  new Date(d).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

/* ============================ 1. Admin: new enquiry ====================== */

export interface IntakeDetails {
  parentName: string;
  relationshipToChild?: string | null;
  childName: string;
  childAge: number;
  childYearGroup?: string | null;
  subject: string;
  level: string;
  email: string;
  contactNumber: string;
  altContactNumber?: string | null;
  preferredContactMethod?: string | null;
  currentSchool?: string | null;
  currentAttainment?: string | null;
  senNotes?: string | null;
  goals?: string | null;
  previousTutoring?: string | null;
  howDidYouHear?: string | null;
  preferredSlot?: string | null;
  additionalInfo?: string | null;
}

/**
 * What the academy sees when an application lands. Two clearly titled blocks —
 * the student, then the parent — so nobody has to work out which name is
 * which before picking up the phone.
 */
export function enquiryAdminNotificationHtml(data: IntakeDetails): string {
  const body = [
    para(`A new application has come in from the website. <strong>${esc(data.parentName)}</strong> has applied on behalf of <strong>${esc(data.childName)}</strong>.`),
    section("The student", [
      ["Student name", data.childName],
      ["Age", String(data.childAge)],
      ["Year group", data.childYearGroup],
      ["Current school", data.currentSchool],
      ["Subject", data.subject],
      ["Level / exam", data.level],
      ["Current attainment", data.currentAttainment],
      ["SEN / additional needs", data.senNotes],
    ]),
    section("Parent or guardian", [
      ["Parent name", data.parentName],
      ["Relationship to child", data.relationshipToChild],
      ["Email", data.email],
      ["Contact number", data.contactNumber],
      ["Alternative number", data.altContactNumber],
      ["Prefers contact by", data.preferredContactMethod],
    ]),
    section("Goals and background", [
      ["Goals", data.goals],
      ["Struggling with", data.previousTutoring],
      ["Preferred slot", data.preferredSlot],
      ["How they heard", data.howDidYouHear],
      ["Anything else", data.additionalInfo],
    ]),
  ].join("\n      ");

  return shell({
    audience: "admin",
    eyebrow: "New application",
    heading: `${data.childName} — ${data.subject}`,
    preheader: `${data.parentName} applied for ${data.childName}: ${data.subject} (${data.level}).`,
    body,
    cta: { label: "Open in the dashboard", href: `${appUrl()}/intake` },
  });
}

/* ================ 2 + 3. Applicant acknowledgement + admin ============== */

export async function sendIntakeEmails(data: IntakeDetails) {
  const settings = await getSmtpSettings();
  if (!settings?.smtpEnabled || !settings.smtpHost || !settings.smtpUser || !settings.smtpPass) return;

  const transporter = createTransport(settings);
  const from = settings.smtpFrom ? `"Thurrock Tuition Academy" <${settings.smtpFrom}>` : settings.smtpUser;

  const ackHtml = shell({
    eyebrow: "Application received",
    heading: `Thank you, ${data.parentName.split(" ")[0]}`,
    preheader: `We have ${data.childName}'s application for ${data.subject} (${data.level}) and will be in touch within 24 hours.`,
    body: [
      para(`We have received your application for <strong>${esc(data.childName)}</strong> and a tutor will review it personally.`),
      callout(`<strong style="font-weight:700;">What happens next</strong><br/>We will call or email you within <strong>24 hours</strong> to arrange ${esc(data.childName)}&rsquo;s <strong>free assessment</strong> &mdash; a relaxed 45-minute session that shows us exactly where to start.`),
      section("What you told us", [
        ["Student", `${data.childName} (age ${data.childAge})`],
        ["Subject", data.subject],
        ["Level / exam", data.level],
        ["Preferred slot", data.preferredSlot ?? "No preference given"],
        ["Applied by", `${data.parentName}${data.relationshipToChild ? ` (${data.relationshipToChild})` : ""}`],
      ]),
      para(`If anything above is wrong, just reply to this email and we will correct it before the assessment.`),
    ].join("\n      "),
    cta: { label: "Message us on WhatsApp", href: "https://wa.me/447480413679" },
  });

  const sendPromises: Promise<unknown>[] = [
    transporter.sendMail({
      from,
      to: data.email,
      subject: subjectLine("Application received", data.childName),
      html: ackHtml,
    }).catch(onSendFailure("intake-acknowledgement", data.email)),
  ];

  if (settings.smtpFrom) {
    sendPromises.push(
      transporter.sendMail({
        from,
        to: settings.smtpFrom,
        subject: subjectLine("New application", data.childName, `${data.subject}, applied by ${data.parentName}`),
        html: enquiryAdminNotificationHtml(data),
      }).catch(onSendFailure("intake-admin-notification", settings.smtpFrom))
    );
  }

  await Promise.allSettled(sendPromises);
}

/* ============================= 4. Payment link ========================== */

export async function sendPaymentLinkEmail(opts: {
  to: string;
  parentName: string;
  studentName: string;
  amount: number;
  description: string;
  paymentUrl: string;
}) {
  const settings = await getSmtpSettings();
  if (!settings?.smtpEnabled || !settings.smtpHost || !settings.smtpUser || !settings.smtpPass) return;

  const transporter = createTransport(settings);
  const from = settings.smtpFrom ? `"Thurrock Tuition Academy" <${settings.smtpFrom}>` : settings.smtpUser;
  const amount = gbp(opts.amount);

  const html = shell({
    eyebrow: "Payment request",
    heading: `${amount} for ${opts.studentName}`,
    preheader: `${opts.description} — ${amount} for ${opts.studentName}. Pay securely by card.`,
    body: [
      para(`Dear ${esc(opts.parentName)},`),
      para(`A payment request is ready for <strong>${esc(opts.studentName)}</strong>&rsquo;s tuition. You can pay securely by card using the button below &mdash; no account needed.`),
      detailTable([
        ["Student", opts.studentName],
        ["For", opts.description],
        ["Amount due", amount],
      ]),
      para(`<span style="color:${BRAND.muted};font-size:14px;">Payment is processed securely by Square. We never see or store your card details.</span>`),
    ].join("\n      "),
    cta: { label: `Pay ${amount} now`, href: opts.paymentUrl },
  });

  await transporter.sendMail({
    from,
    to: opts.to,
    subject: subjectLine("Payment request", opts.studentName, amount),
    html,
  }).catch(onSendFailure("payment-link", opts.to));
}

/* ============================= 5. Task assigned ========================= */

export async function sendTaskAssignedEmail(opts: {
  to: string;
  parentName: string;
  studentName: string;
  title: string;
  subject: string;
  dueDate: string;
}) {
  const settings = await getSmtpSettings();
  if (!settings?.smtpEnabled || !settings.smtpHost || !settings.smtpUser || !settings.smtpPass) return;

  const transporter = createTransport(settings);
  const from = settings.smtpFrom ? `"Thurrock Tuition Academy" <${settings.smtpFrom}>` : settings.smtpUser;
  const due = new Date(opts.dueDate).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });

  const html = shell({
    eyebrow: "Homework set",
    heading: `New task for ${opts.studentName}`,
    preheader: `${opts.title} — ${opts.subject}, due ${due}.`,
    body: [
      para(`Dear ${esc(opts.parentName)},`),
      para(`${esc(opts.studentName)}&rsquo;s tutor has set a new task.`),
      callout(`<strong style="font-family:Manrope,Arial,sans-serif;font-size:17px;font-weight:700;">${esc(opts.title)}</strong><br/><span style="color:${BRAND.muted};font-size:14px;">${esc(opts.subject)} &middot; due ${esc(due)}</span>`),
      para(`Full instructions are in the parent portal, along with everything else set this term.`),
    ].join("\n      "),
    cta: { label: "Open the parent portal", href: `${appUrl()}/parent` },
  });

  await transporter.sendMail({
    from,
    to: opts.to,
    subject: subjectLine("New task", opts.studentName, opts.title),
    html,
  }).catch(onSendFailure("task-assigned", opts.to));
}

/* ========================= 6. Session confirmation ====================== */

export async function sendSessionConfirmationEmail(opts: {
  to: string;
  parentName: string;
  studentName: string;
  date: string;
  slotLabel: string;
  startTime: string;
  endTime: string;
}) {
  const settings = await getSmtpSettings();
  if (!settings?.smtpEnabled || !settings.smtpHost || !settings.smtpUser || !settings.smtpPass) return;

  const transporter = createTransport(settings);
  const from = settings.smtpFrom ? `"Thurrock Tuition Academy" <${settings.smtpFrom}>` : settings.smtpUser;
  const when = longDate(opts.date);

  const html = shell({
    eyebrow: "Session confirmed",
    heading: `${opts.studentName} — ${when}`,
    preheader: `${opts.studentName} is booked in for ${when}, ${opts.startTime}–${opts.endTime}.`,
    body: [
      para(`Dear ${esc(opts.parentName)},`),
      para(`<strong>${esc(opts.studentName)}</strong> is booked in. Please arrive five minutes early so we can start on time.`),
      detailTable([
        ["Student", opts.studentName],
        ["Date", when],
        ["Time", `${opts.startTime} – ${opts.endTime}`],
        ["Slot", opts.slotLabel],
        ["Where", "Suite 1, Queensgate Centre, Orsett Road, Grays RM17 5DF"],
      ]),
      para(`Need to move this session? Reply to this email or WhatsApp us and we will find another slot.`),
    ].join("\n      "),
    cta: { label: "See all sessions", href: `${appUrl()}/parent` },
  });

  await transporter.sendMail({
    from,
    to: opts.to,
    subject: subjectLine("Session confirmed", opts.studentName, when),
    html,
  }).catch(onSendFailure("session-confirmation", opts.to));
}

/* ============================ 7. Progress note ========================== */

export async function sendProgressNoteEmail(opts: {
  to: string;
  parentName: string;
  studentName: string;
  subject: string;
  notePreview: string;
}) {
  const settings = await getSmtpSettings();
  if (!settings?.smtpEnabled || !settings.smtpHost || !settings.smtpUser || !settings.smtpPass) return;

  const transporter = createTransport(settings);
  const from = settings.smtpFrom ? `"Thurrock Tuition Academy" <${settings.smtpFrom}>` : settings.smtpUser;

  const html = shell({
    eyebrow: "Progress update",
    heading: `How ${opts.studentName} is getting on`,
    preheader: `A new ${opts.subject} progress note for ${opts.studentName} from their tutor.`,
    body: [
      para(`Dear ${esc(opts.parentName)},`),
      para(`${esc(opts.studentName)}&rsquo;s tutor has written a new <strong>${esc(opts.subject)}</strong> progress note.`),
      callout(`<em style="font-style:italic;">&ldquo;${esc(opts.notePreview)}&rdquo;</em>`),
      para(`The full note, along with every previous one, is in the parent portal.`),
    ].join("\n      "),
    cta: { label: "Read the full note", href: `${appUrl()}/parent` },
  });

  await transporter.sendMail({
    from,
    to: opts.to,
    subject: subjectLine("Progress note", opts.studentName, opts.subject),
    html,
  }).catch(onSendFailure("progress-note", opts.to));
}

/* =========================== 8. Payment receipt ========================= */

export async function sendPaymentReceiptEmail(opts: {
  to: string;
  parentName: string;
  studentName: string;
  amount: number;
  description: string;
  squarePaymentId: string;
}) {
  const settings = await getSmtpSettings();
  if (!settings?.smtpEnabled || !settings.smtpHost || !settings.smtpUser || !settings.smtpPass) return;

  const transporter = createTransport(settings);
  const from = settings.smtpFrom ? `"Thurrock Tuition Academy" <${settings.smtpFrom}>` : settings.smtpUser;
  const amount = gbp(opts.amount);

  const html = shell({
    eyebrow: "Receipt",
    heading: `${amount} received — thank you`,
    preheader: `Receipt for ${amount} towards ${opts.studentName}'s tuition. Keep this for your records.`,
    body: [
      para(`Dear ${esc(opts.parentName)},`),
      para(`Thank you &mdash; your payment towards <strong>${esc(opts.studentName)}</strong>&rsquo;s tuition has cleared. This email is your receipt.`),
      detailTable([
        ["Student", opts.studentName],
        ["Paid by", opts.parentName],
        ["For", opts.description],
        ["Amount paid", amount],
        ["Date", new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })],
        ["Payment reference", opts.squarePaymentId],
      ]),
      para(`<span style="color:${BRAND.muted};font-size:14px;">Processed securely by Square. Please keep this receipt for your records.</span>`),
    ].join("\n      "),
  });

  await transporter.sendMail({
    from,
    to: opts.to,
    subject: subjectLine("Payment receipt", opts.studentName, amount),
    html,
  }).catch(onSendFailure("payment-receipt", opts.to));
}

/* ======================== 9. Admin reply to applicant =================== */

/**
 * A hand-written reply from the academy to an applicant.
 *
 * `replySubject` is authored in the dashboard, so the child's name reaching
 * the subject is the dashboard's job (it pre-fills "Re: <child>'s application
 * …"). What this template guarantees is that the *body* never leaves it
 * ambiguous: the header names the student, and the greeting names the parent.
 */
export async function sendIntakeReplyEmail(opts: {
  toEmail: string;
  toName: string;
  childName: string;
  subjectTaught?: string | null;
  level?: string | null;
  replySubject: string;
  replyBody: string;
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPass: string;
  smtpFrom: string;
}): Promise<void> {
  const transporter = nodemailer.createTransport({
    host: opts.smtpHost,
    port: opts.smtpPort,
    secure: opts.smtpPort === 465,
    auth: { user: opts.smtpUser, pass: opts.smtpPass },
  });

  const about = [opts.subjectTaught, opts.level].filter(Boolean).join(" · ");

  const html = shell({
    eyebrow: `Regarding ${opts.childName}${about ? ` — ${about}` : ""}`,
    heading: opts.replySubject,
    preheader: `A message from Thurrock Tuition Academy about ${opts.childName}'s application.`,
    body: [
      para(`Dear ${esc(opts.toName)},`),
      `<div style="font-family:'DM Sans',Helvetica,Arial,sans-serif;font-size:15px;line-height:1.75;color:${BRAND.ink};">${escMultiline(opts.replyBody)}</div>`,
    ].join("\n      "),
  });

  await transporter.sendMail({
    from: `"Thurrock Tuition Academy" <${opts.smtpFrom}>`,
    to: opts.toEmail,
    subject: opts.replySubject,
    html,
  });
}
