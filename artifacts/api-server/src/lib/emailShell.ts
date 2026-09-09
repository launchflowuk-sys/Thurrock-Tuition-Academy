/* ---------------------------------------------------------------------------
 * The one email design. Every outbound message is built from this file.
 *
 * The brand here is the live public site's, not the old dashboard palette:
 * navy #142a46, gold #ffce32, ink #182c45 (see styles/tta-public.css). The
 * templates used to run on #1B2B6B/#C9973A, which is why they read as a
 * different company from the website.
 *
 * Three rules this layout exists to enforce:
 *
 * 1. **It must read with images blocked.** Gmail, Outlook and most corporate
 *    clients block remote images by default, so the logo cannot be the only
 *    thing carrying the brand. The header pairs the badge with a real text
 *    wordmark, and the badge has alt text — with images off you still get
 *    "Thurrock Tuition Academy / TUITION THAT FITS" in navy and gold.
 *
 * 2. **Absolute image URLs only.** A relative path resolves against the mail
 *    client, not the site, and shows a broken image in every inbox.
 *
 * 3. **Parent and child are never interchangeable.** Every template that
 *    mentions both labels them — "Student" and "Parent / guardian" — and the
 *    subject line always names the *child*, because that is the person the
 *    academy teaches and the parent's own name in that slot reads as an
 *    error. `subjectLine()` is the only way subjects are built, so the
 *    distinction cannot drift template by template again.
 *
 * Layout is tables with inline styles throughout: no flexbox, no grid, no
 * <style> block, nothing that Outlook's Word rendering engine drops.
 * ------------------------------------------------------------------------- */

export const BRAND = {
  navy: "#142a46",
  navySoft: "#203d5d",
  navyDeep: "#101f34",
  gold: "#ffce32",
  blue: "#1857ac",
  ink: "#182c45",
  muted: "#596574",
  grey: "#f3f5f7",
  line: "#dce2e8",
  white: "#ffffff",
} as const;

const NAME = "Thurrock Tuition Academy";
const TAGLINE = "Tuition that fits";
const PHONE = "07480 413679";
const WHATSAPP = "https://wa.me/447480413679";
const ADDRESS = "Suite 1, Queensgate Centre, Orsett Road, Grays, Thurrock RM17 5DF";
const EMAIL = "bookings@thurrocktuitionacademy.co.uk";

/** Web fonts do not load in most mail clients — this is the fallback chain. */
const FONT = "'DM Sans',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";
const HEAD_FONT = "Manrope,'Segoe UI',Helvetica,Arial,sans-serif";

/** Origin for links and images. Overridable so staging never links to live. */
export function appUrl(): string {
  return (process.env.APP_URL || "https://thurrocktuitionacademy.co.uk").replace(/\/+$/, "");
}

/**
 * Escape anything a parent typed before it goes into HTML.
 *
 * `POST /intake` is public and unauthenticated, so every field on it is
 * attacker-controlled. These values were previously interpolated raw into the
 * admin notification, which meant a submitted name could inject markup into
 * the academy's own inbox.
 */
export function esc(value: unknown): string {
  if (value === null || value === undefined) return "";
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Escape, then turn newlines into breaks. For admin-authored message bodies. */
export function escMultiline(value: string): string {
  return esc(value).replace(/\r?\n/g, "<br/>");
}

/**
 * The only way an email subject is built.
 *
 * `childName` is required and always lands in the subject, so no template can
 * quietly put the parent's name where the student's belongs.
 */
export function subjectLine(what: string, childName: string, extra?: string): string {
  const tail = extra ? ` (${extra})` : "";
  return `${what}: ${childName}${tail} | ${NAME}`;
}

export interface ShellOptions {
  /** Small gold line above the heading, e.g. "Application received". */
  eyebrow: string;
  /** The heading inside the navy band. */
  heading: string;
  /**
   * The one-line summary shown in the inbox preview, before the body is
   * opened. Without it clients pull the first words of the header markup.
   */
  preheader: string;
  /** Body markup — build it with the helpers below. */
  body: string;
  /** Optional call-to-action rendered as a gold button under the body. */
  cta?: { label: string; href: string };
  /** Admin-facing mail drops the parent-facing footer contact block. */
  audience?: "parent" | "admin";
}

/** A labelled detail table — the workhorse for "here are the facts" blocks. */
export function detailTable(rows: Array<[string, string | null | undefined]>): string {
  const visible = rows.filter(([, v]) => v !== null && v !== undefined && String(v).trim() !== "");
  if (visible.length === 0) return "";
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;border:1px solid ${BRAND.line};border-radius:12px;border-collapse:separate;overflow:hidden;">
${visible.map(([label, value], i) => `      <tr>
        <td style="padding:11px 16px;background:${i % 2 === 0 ? BRAND.grey : BRAND.white};border-top:${i === 0 ? "0" : `1px solid ${BRAND.line}`};color:${BRAND.muted};font-family:${FONT};font-size:13px;font-weight:600;width:42%;vertical-align:top;">${esc(label)}</td>
        <td style="padding:11px 16px;background:${i % 2 === 0 ? BRAND.grey : BRAND.white};border-top:${i === 0 ? "0" : `1px solid ${BRAND.line}`};color:${BRAND.ink};font-family:${FONT};font-size:14px;vertical-align:top;">${esc(value)}</td>
      </tr>`).join("\n")}
    </table>`;
}

/**
 * A titled group of details — this is what makes parent and child visibly
 * separate rather than one undifferentiated list of fields.
 */
export function section(title: string, rows: Array<[string, string | null | undefined]>): string {
  const table = detailTable(rows);
  if (!table) return "";
  return `<p style="margin:26px 0 10px;font-family:${HEAD_FONT};font-size:12px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:${BRAND.blue};">${esc(title)}</p>
    ${table}`;
}

/** A paragraph of body copy. */
export function para(html: string): string {
  return `<p style="margin:0 0 16px;font-family:${FONT};font-size:15px;line-height:1.7;color:${BRAND.ink};">${html}</p>`;
}

/** A quiet, boxed callout — a note, a quote, a single highlighted fact. */
export function callout(html: string): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;margin:0 0 18px;">
      <tr><td style="padding:18px 20px;background:${BRAND.grey};border-left:4px solid ${BRAND.gold};border-radius:10px;font-family:${FONT};font-size:15px;line-height:1.65;color:${BRAND.ink};">${html}</td></tr>
    </table>`;
}

/** The header wordmark. Text, not an image, so it survives blocked images. */
function header(eyebrow: string, heading: string): string {
  return `  <tr>
    <td style="background:${BRAND.navy};padding:28px 32px 0;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="padding-right:12px;vertical-align:middle;">
            <img src="${appUrl()}/logo-badge-128.png" width="48" height="48" alt="${NAME}"
                 style="display:block;width:48px;height:48px;border:0;outline:none;text-decoration:none;" />
          </td>
          <td style="vertical-align:middle;">
            <div style="font-family:${HEAD_FONT};font-size:17px;font-weight:800;letter-spacing:-0.02em;color:${BRAND.white};line-height:1.2;">Thurrock Tuition</div>
            <div style="font-family:${FONT};font-size:10px;font-weight:600;letter-spacing:0.14em;color:${BRAND.gold};text-transform:uppercase;">Academy &middot; ${TAGLINE}</div>
          </td>
        </tr>
      </table>
    </td>
  </tr>
  <tr>
    <td style="background:${BRAND.navy};padding:26px 32px 30px;">
      <p style="margin:0 0 10px;font-family:${FONT};font-size:11px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:${BRAND.gold};">${esc(eyebrow)}</p>
      <h1 style="margin:0;font-family:${HEAD_FONT};font-size:27px;line-height:1.2;font-weight:800;letter-spacing:-0.03em;color:${BRAND.white};">${esc(heading)}</h1>
    </td>
  </tr>
  <tr><td style="background:${BRAND.gold};height:4px;line-height:4px;font-size:0;">&nbsp;</td></tr>`;
}

function ctaButton(cta: { label: string; href: string }): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:26px 0 4px;">
      <tr>
        <td style="background:${BRAND.gold};border-radius:10px;">
          <a href="${cta.href}" style="display:inline-block;padding:15px 26px;font-family:${HEAD_FONT};font-size:15px;font-weight:700;color:${BRAND.navy};text-decoration:none;">${esc(cta.label)} &rarr;</a>
        </td>
      </tr>
    </table>`;
}

function footer(audience: "parent" | "admin"): string {
  const contact = audience === "parent"
    ? `<p style="margin:0 0 14px;font-family:${FONT};font-size:13px;line-height:1.7;color:#b8c4d3;">
          Questions about your child&rsquo;s tuition? Call or WhatsApp
          <a href="${WHATSAPP}" style="color:${BRAND.gold};text-decoration:none;font-weight:700;">${PHONE}</a>,
          or reply to this email.
        </p>`
    : `<p style="margin:0 0 14px;font-family:${FONT};font-size:13px;line-height:1.7;color:#b8c4d3;">
          Internal notification from the academy dashboard.
        </p>`;

  return `  <tr>
    <td style="background:${BRAND.navyDeep};padding:26px 32px;border-radius:0 0 14px 14px;">
      ${contact}
      <p style="margin:0;font-family:${FONT};font-size:12px;line-height:1.7;color:#9bacc1;">
        <strong style="color:${BRAND.white};font-weight:700;">${NAME}</strong><br/>
        ${ADDRESS}<br/>
        ${PHONE} &middot; <a href="mailto:${EMAIL}" style="color:#e7ca80;text-decoration:none;">${EMAIL}</a>
      </p>
      <p style="margin:14px 0 0;font-family:${FONT};font-size:11px;color:#78889c;">
        &copy; ${new Date().getFullYear()} ${NAME}. You are receiving this because you contacted the academy or hold an account with us.
      </p>
    </td>
  </tr>`;
}

/** Wrap body markup in the branded shell. */
export function shell(o: ShellOptions): string {
  const audience = o.audience ?? "parent";
  return `<!DOCTYPE html>
<html lang="en" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<meta name="x-apple-disable-message-reformatting"/>
<meta name="color-scheme" content="light"/>
<meta name="supported-color-schemes" content="light"/>
<title>${esc(o.heading)}</title>
<!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml><![endif]-->
</head>
<body style="margin:0;padding:0;background:${BRAND.grey};-webkit-font-smoothing:antialiased;">
<div style="display:none;font-size:1px;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all;">${esc(o.preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${BRAND.grey};">
<tr><td align="center" style="padding:32px 14px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;background:${BRAND.white};border-radius:14px;overflow:hidden;">
${header(o.eyebrow, o.heading)}
  <tr>
    <td style="background:${BRAND.white};padding:32px;">
      ${o.body}
      ${o.cta ? ctaButton(o.cta) : ""}
    </td>
  </tr>
${footer(audience)}
</table>
</td></tr>
</table>
</body>
</html>`;
}
