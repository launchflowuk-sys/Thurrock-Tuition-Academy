import nodemailer from "nodemailer";
import { db, settingsTable } from "@workspace/db";

async function getSmtpSettings() {
  const rows = await db.select().from(settingsTable).limit(1);
  return rows[0] ?? null;
}

function createTransport(s: { smtpHost: string | null; smtpPort: number | null; smtpUser: string | null; smtpPass: string | null }) {
  return nodemailer.createTransport({
    host: s.smtpHost ?? "",
    port: s.smtpPort ?? 587,
    secure: (s.smtpPort ?? 587) === 465,
    auth: { user: s.smtpUser ?? "", pass: s.smtpPass ?? "" },
  });
}

export function enquiryAcknowledgementHtml(data: {
  parentName: string;
  childName: string;
  subject: string;
  level: string;
  preferredSlot?: string | null;
}): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>Enquiry Received – Thurrock Tuition Academy</title>
</head>
<body style="margin:0;padding:0;background:#f4f5f9;font-family:'Segoe UI',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f5f9;padding:40px 16px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

  <!-- Header -->
  <tr><td style="background:#1B2B6B;border-radius:16px 16px 0 0;padding:36px 40px;text-align:center;">
    <p style="margin:0 0 8px;color:#C9973A;font-size:12px;font-weight:700;letter-spacing:3px;text-transform:uppercase;">Thurrock Tuition Academy</p>
    <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:700;line-height:1.2;">Enquiry Received</h1>
    <p style="margin:12px 0 0;color:rgba(255,255,255,0.7);font-size:15px;">We'll be in touch within 24 hours</p>
  </td></tr>

  <!-- Body -->
  <tr><td style="background:#ffffff;padding:40px;">
    <p style="margin:0 0 20px;color:#1a1a2e;font-size:16px;line-height:1.6;">Dear ${data.parentName},</p>
    <p style="margin:0 0 20px;color:#4b5563;font-size:15px;line-height:1.7;">
      Thank you for getting in touch with <strong style="color:#1B2B6B;">Thurrock Tuition Academy</strong>. We have received your enquiry for <strong>${data.childName}</strong> and are excited to help them reach their full potential.
    </p>

    <!-- Enquiry Summary -->
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f9fe;border:1px solid #e5e8f4;border-radius:12px;margin:24px 0;overflow:hidden;">
      <tr><td style="background:#1B2B6B;padding:14px 20px;">
        <p style="margin:0;color:#C9973A;font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">Your Enquiry Summary</p>
      </td></tr>
      <tr><td style="padding:20px;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding:8px 0;border-bottom:1px solid #e5e8f4;color:#6b7280;font-size:13px;font-weight:600;width:40%;">Child's Name</td>
            <td style="padding:8px 0;border-bottom:1px solid #e5e8f4;color:#1a1a2e;font-size:14px;font-weight:600;">${data.childName}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;border-bottom:1px solid #e5e8f4;color:#6b7280;font-size:13px;font-weight:600;">Subject</td>
            <td style="padding:8px 0;border-bottom:1px solid #e5e8f4;color:#1a1a2e;font-size:14px;">${data.subject}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;border-bottom:1px solid #e5e8f4;color:#6b7280;font-size:13px;font-weight:600;">Level / Exam</td>
            <td style="padding:8px 0;border-bottom:1px solid #e5e8f4;color:#1a1a2e;font-size:14px;">${data.level}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#6b7280;font-size:13px;font-weight:600;">Preferred Slot</td>
            <td style="padding:8px 0;color:#1a1a2e;font-size:14px;">${data.preferredSlot}</td>
          </tr>
        </table>
      </td></tr>
    </table>

    <!-- Next Steps -->
    <p style="margin:24px 0 12px;color:#1B2B6B;font-size:15px;font-weight:700;">What happens next?</p>
    <table width="100%" cellpadding="0" cellspacing="0">
      ${["We will review your enquiry and contact you within 24 hours to arrange a suitable time.",
         "Your child will be invited for a <strong>free 2-hour assessment session</strong> — no obligation.",
         "After the assessment, we will provide written feedback and a personalised study plan."]
        .map((step, i) => `<tr>
        <td style="vertical-align:top;padding:8px 12px 8px 0;width:32px;">
          <span style="display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;background:#1B2B6B;color:#C9973A;border-radius:50%;font-size:13px;font-weight:700;">${i + 1}</span>
        </td>
        <td style="padding:8px 0;color:#4b5563;font-size:14px;line-height:1.6;">${step}</td>
      </tr>`).join("")}
    </table>

    <!-- WhatsApp CTA -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin:28px 0;">
      <tr><td align="center">
        <a href="https://wa.me/447480413679" style="display:inline-block;background:#25D366;color:#ffffff;text-decoration:none;font-weight:700;font-size:15px;padding:14px 32px;border-radius:12px;">
          💬 Message us on WhatsApp
        </a>
      </td></tr>
    </table>

    <p style="margin:0;color:#9ca3af;font-size:13px;line-height:1.6;text-align:center;">
      Or call us on <strong style="color:#1B2B6B;">07480 413679</strong> · We're based at Suite 1, Queensgate Centre, Orsett Road, Grays, Thurrock
    </p>
  </td></tr>

  <!-- Footer -->
  <tr><td style="background:#1B2B6B;border-radius:0 0 16px 16px;padding:24px 40px;text-align:center;">
    <p style="margin:0;color:rgba(255,255,255,0.5);font-size:12px;">© ${new Date().getFullYear()} Thurrock Tuition Academy · Suite 1, Queensgate Centre, Grays, Thurrock</p>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}

export function enquiryAdminNotificationHtml(data: {
  parentName: string;
  childName: string;
  childAge: number;
  subject: string;
  level: string;
  preferredSlot?: string | null;
  contactNumber: string;
  email?: string | null;
  notes?: string | null;
}): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><title>New Enquiry – TTA Admin</title></head>
<body style="margin:0;padding:0;background:#f4f5f9;font-family:'Segoe UI',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f5f9;padding:40px 16px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
  <tr><td style="background:#C9973A;border-radius:16px 16px 0 0;padding:28px 40px;">
    <p style="margin:0;color:#1B2B6B;font-size:12px;font-weight:700;letter-spacing:3px;text-transform:uppercase;">TTA Admin Alert</p>
    <h1 style="margin:8px 0 0;color:#1B2B6B;font-size:24px;font-weight:700;">🔔 New Enquiry Submitted</h1>
  </td></tr>
  <tr><td style="background:#ffffff;padding:32px 40px;border-radius:0 0 16px 16px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e8f4;border-radius:10px;overflow:hidden;">
      ${[
        ["Parent Name", data.parentName],
        ["Child Name", data.childName],
        ["Child Age", String(data.childAge)],
        ["Subject", data.subject],
        ["Level", data.level],
        ["Preferred Slot", data.preferredSlot ?? "Not specified"],
        ["Contact Number", data.contactNumber],
        ["Email", data.email ?? "Not provided"],
        ["Notes", data.notes ?? "None"],
      ].map(([label, value], i) => `<tr style="background:${i % 2 === 0 ? "#f8f9fe" : "#ffffff"};">
        <td style="padding:10px 16px;color:#6b7280;font-size:13px;font-weight:600;width:40%;">${label}</td>
        <td style="padding:10px 16px;color:#1a1a2e;font-size:14px;">${value}</td>
      </tr>`).join("")}
    </table>
    <p style="margin:24px 0 0;text-align:center;">
      <a href="https://thurrocktuitionacademy.co.uk/enquiries" style="display:inline-block;background:#1B2B6B;color:#ffffff;text-decoration:none;font-weight:700;font-size:14px;padding:12px 28px;border-radius:10px;">View in Dashboard →</a>
    </p>
  </td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}

export async function sendEnquiryEmails(data: {
  parentName: string;
  childName: string;
  childAge: number;
  subject: string;
  level: string;
  preferredSlot?: string | null;
  contactNumber: string;
  email?: string | null;
  notes?: string | null;
}) {
  const settings = await getSmtpSettings();
  if (!settings?.smtpEnabled || !settings.smtpHost || !settings.smtpUser || !settings.smtpPass) return;

  const transporter = createTransport(settings);
  const from = settings.smtpFrom ? `"Thurrock Tuition Academy" <${settings.smtpFrom}>` : settings.smtpUser;

  const sendPromises: Promise<unknown>[] = [];

  // Acknowledgement to customer
  if (data.email) {
    sendPromises.push(
      transporter.sendMail({
        from,
        to: data.email,
        subject: `Enquiry Received – ${data.childName}'s Free Assessment | Thurrock Tuition Academy`,
        html: enquiryAcknowledgementHtml(data),
      }).catch(() => {})
    );
  }

  // Notification to admin
  if (settings.smtpFrom) {
    sendPromises.push(
      transporter.sendMail({
        from,
        to: settings.smtpFrom,
        subject: `🔔 New Enquiry: ${data.parentName} – ${data.childName} (${data.subject})`,
        html: enquiryAdminNotificationHtml(data),
      }).catch(() => {})
    );
  }

  await Promise.allSettled(sendPromises);
}

export async function sendIntakeEmails(data: {
  parentName: string;
  childName: string;
  childAge: number;
  subject: string;
  level: string;
  email: string;
  contactNumber: string;
  currentSchool?: string | null;
  goals?: string | null;
  currentAttainment?: string | null;
  previousTutoring?: string | null;
  howDidYouHear?: string | null;
  preferredSlot?: string | null;
}) {
  const settings = await getSmtpSettings();
  if (!settings?.smtpEnabled || !settings.smtpHost || !settings.smtpUser || !settings.smtpPass) return;

  const transporter = createTransport(settings);
  const from = settings.smtpFrom ? `"Thurrock Tuition Academy" <${settings.smtpFrom}>` : settings.smtpUser;

  const ackHtml = `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#f4f5f9;font-family:'Segoe UI',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f5f9;padding:40px 16px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
  <tr><td style="background:#1B2B6B;border-radius:16px 16px 0 0;padding:36px 40px;text-align:center;">
    <p style="margin:0 0 8px;color:#C9973A;font-size:12px;font-weight:700;letter-spacing:3px;text-transform:uppercase;">Thurrock Tuition Academy</p>
    <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:700;">Application Received! 🎉</h1>
  </td></tr>
  <tr><td style="background:#ffffff;padding:40px;border-radius:0 0 16px 16px;">
    <p style="margin:0 0 16px;color:#1a1a2e;font-size:16px;">Dear ${data.parentName},</p>
    <p style="margin:0 0 20px;color:#4b5563;font-size:15px;line-height:1.7;">
      We have received ${data.childName}'s application for <strong>${data.subject} (${data.level})</strong>. Our team will review the details and contact you shortly to arrange the next steps.
    </p>
    <p style="margin:0;color:#9ca3af;font-size:13px;text-align:center;">Questions? WhatsApp us: <strong style="color:#1B2B6B;">07480 413679</strong></p>
  </td></tr>
</table>
</td></tr>
</table>
</body></html>`;

  const sendPromises: Promise<unknown>[] = [
    transporter.sendMail({
      from,
      to: data.email,
      subject: `Application Received – ${data.childName} | Thurrock Tuition Academy`,
      html: ackHtml,
    }).catch(() => {}),
  ];

  if (settings.smtpFrom) {
    sendPromises.push(
      transporter.sendMail({
        from,
        to: settings.smtpFrom,
        subject: `📋 New Intake Application: ${data.parentName} – ${data.childName}`,
        html: enquiryAdminNotificationHtml({ ...data, notes: data.currentSchool ? `School: ${data.currentSchool}` : null }),
      }).catch(() => {})
    );
  }

  await Promise.allSettled(sendPromises);
}

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
  const formattedAmount = `£${opts.amount.toFixed(2)}`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#f4f5f9;font-family:'Segoe UI',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f5f9;padding:40px 16px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
  <tr><td style="background:#1B2B6B;border-radius:16px 16px 0 0;padding:36px 40px;text-align:center;">
    <p style="margin:0 0 8px;color:#C9973A;font-size:12px;font-weight:700;letter-spacing:3px;text-transform:uppercase;">Thurrock Tuition Academy</p>
    <h1 style="margin:0;color:#ffffff;font-size:26px;font-weight:700;">Payment Request</h1>
  </td></tr>
  <tr><td style="background:#ffffff;padding:40px;">
    <p style="margin:0 0 20px;color:#1a1a2e;font-size:16px;line-height:1.6;">Dear ${opts.parentName},</p>
    <p style="margin:0 0 24px;color:#4b5563;font-size:15px;line-height:1.7;">
      A payment request for <strong>${opts.studentName}</strong> is ready: <strong>${opts.description}</strong> — <strong style="color:#1B2B6B;">${formattedAmount}</strong>.
    </p>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin:28px 0;">
      <tr><td align="center">
        <a href="${opts.paymentUrl}" style="display:inline-block;background:#1B2B6B;color:#ffffff;text-decoration:none;font-weight:700;font-size:15px;padding:14px 32px;border-radius:12px;">
          Pay ${formattedAmount} Now
        </a>
      </td></tr>
    </table>
    <p style="margin:0;color:#9ca3af;font-size:13px;line-height:1.6;text-align:center;">
      Payment is processed securely by Square. Questions? WhatsApp us: <strong style="color:#1B2B6B;">07480 413679</strong>
    </p>
  </td></tr>
  <tr><td style="background:#1B2B6B;border-radius:0 0 16px 16px;padding:24px 40px;text-align:center;">
    <p style="margin:0;color:rgba(255,255,255,0.5);font-size:12px;">© ${new Date().getFullYear()} Thurrock Tuition Academy · Suite 1, Queensgate Centre, Grays, Thurrock</p>
  </td></tr>
</table>
</td></tr>
</table>
</body></html>`;

  await transporter.sendMail({
    from,
    to: opts.to,
    subject: `Payment Request – ${opts.studentName} (${formattedAmount}) | Thurrock Tuition Academy`,
    html,
  }).catch(() => {});
}

export async function sendIntakeReplyEmail(opts: {
  toEmail: string;
  toName: string;
  childName: string;
  replySubject: string;
  replyBody: string;
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPass: string;
  smtpFrom: string;
}): Promise<void> {
  const { createTransport } = await import("nodemailer");
  const transporter = createTransport({
    host: opts.smtpHost,
    port: opts.smtpPort,
    secure: opts.smtpPort === 465,
    auth: { user: opts.smtpUser, pass: opts.smtpPass },
  });

  const safeBody = opts.replyBody
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/\n/g, "<br/>");

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#f4f5f9;font-family:'Segoe UI',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f5f9;padding:40px 16px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
  <tr><td style="background:#1B2B6B;border-radius:16px 16px 0 0;padding:28px 40px;">
    <p style="margin:0;color:#C9973A;font-size:12px;font-weight:700;letter-spacing:3px;text-transform:uppercase;">Thurrock Tuition Academy</p>
    <h1 style="margin:8px 0 0;color:#ffffff;font-size:22px;font-weight:700;">${opts.replySubject}</h1>
  </td></tr>
  <tr><td style="background:#ffffff;padding:36px 40px;border-radius:0 0 16px 16px;">
    <p style="margin:0 0 16px;color:#1a1a2e;font-size:15px;">Dear ${opts.toName},</p>
    <div style="color:#374151;font-size:15px;line-height:1.75;">${safeBody}</div>
    <div style="margin-top:32px;padding-top:24px;border-top:1px solid #e5e7eb;text-align:center;">
      <p style="color:#6b7280;font-size:13px;margin:0 0 8px;">Thurrock Tuition Academy</p>
      <p style="color:#6b7280;font-size:12px;margin:0;">Suite 1, Queensgate Centre, Orsett Road, Grays, Thurrock</p>
      <p style="color:#6b7280;font-size:12px;margin:4px 0 0;">07480 413679 · bookings@thurrocktuitionacademy.co.uk</p>
    </div>
  </td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;

  await transporter.sendMail({
    from: `"Thurrock Tuition Academy" <${opts.smtpFrom}>`,
    to: opts.toEmail,
    subject: opts.replySubject,
    html,
  });
}
