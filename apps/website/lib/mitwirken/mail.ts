import { INTEREST_LABELS, ROLE_LABELS, type MitwirkenSubmission } from "@/lib/mitwirken/schema";
import { siteContent } from "@/lib/site/site-content";

const resendApiKey = process.env.RESEND_API_KEY?.trim();
const resendFrom = process.env.RESEND_FROM_EMAIL?.trim();
const resendTo = process.env.RESEND_TO_EMAIL?.trim() || siteContent.contactEmail;

export async function sendMitwirkenMail(submission: MitwirkenSubmission): Promise<void> {
  if (!resendApiKey || !resendFrom || !resendTo) {
    throw new Error("mail_not_configured");
  }

  const interestLabels = submission.interests.map((interest) => INTEREST_LABELS[interest]).join(", ");
  const roleLabel = ROLE_LABELS[submission.role];
  const message = submission.message ?? "Keine Nachricht angegeben.";

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: resendFrom,
      to: [resendTo],
      reply_to: submission.email,
      subject: `Neue Mitwirkungsanfrage von ${submission.name}`,
      text: [
        "Neue Mitwirkungsanfrage",
        "",
        `Name: ${submission.name}`,
        `E-Mail: ${submission.email}`,
        `Rolle: ${roleLabel}`,
        `Interessen: ${interestLabels}`,
        `Datenschutz akzeptiert: ${submission.privacyAccepted ? "Ja" : "Nein"}`,
        `Eingegangen am: ${submission.submittedAt}`,
        "",
        "Nachricht:",
        message,
      ].join("\n"),
      html: [
        "<h1>Neue Mitwirkungsanfrage</h1>",
        "<ul>",
        `<li><strong>Name:</strong> ${escapeHtml(submission.name)}</li>`,
        `<li><strong>E-Mail:</strong> ${escapeHtml(submission.email)}</li>`,
        `<li><strong>Rolle:</strong> ${escapeHtml(roleLabel)}</li>`,
        `<li><strong>Interessen:</strong> ${escapeHtml(interestLabels)}</li>`,
        `<li><strong>Datenschutz akzeptiert:</strong> Ja</li>`,
        `<li><strong>Eingegangen am:</strong> ${escapeHtml(submission.submittedAt)}</li>`,
        "</ul>",
        "<h2>Nachricht</h2>",
        `<p>${escapeHtml(message).replace(/\n/g, "<br />")}</p>`,
      ].join(""),
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("mail_failed");
  }
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
