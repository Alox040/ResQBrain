"use client";

import { getFeedbackMailto } from "./feedback-link";
import { buttonPrimaryClass } from "./patterns";

export function FeedbackButton() {
  return (
    <a
      href={getFeedbackMailto()}
      className={buttonPrimaryClass}
    >
      Feedback senden
    </a>
  );
}
