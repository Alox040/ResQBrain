import { surveys } from "@/lib/site/survey";

/**
 * Externes Interessen-/Updates-Formular (z. B. Microsoft Forms).
 * Optional: NEXT_PUBLIC_UPDATES_FORM_URL in .env.local / Deployment setzen, wenn ein eigenes Formular existiert.
 */
const envUrl = process.env.NEXT_PUBLIC_UPDATES_FORM_URL?.trim();

export const updatesInterestFormHref: string =
  envUrl && envUrl.startsWith("http") ? envUrl : surveys.active.href;
