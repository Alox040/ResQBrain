import {
  feedbackEmail,
  feedbackSubject,
  feedbackBody
} from "@/lib/site-content";

export function getFeedbackMailto() {
  const subject = encodeURIComponent(feedbackSubject);
  const body = encodeURIComponent(feedbackBody);

  return `mailto:${feedbackEmail}?subject=${subject}&body=${body}`;
}
