import { contactInfo } from "@/lib/site/contact-page";

export const updatesPageContent = {
  hero: {
    title: "Updates",
    subtitle: "Mitwirken und auf dem Laufenden bleiben",
  },
  description:
    "Interessierte können sich für Tests, Pilotprojekte, Updates oder Early Access direkt beim Projekt melden.",
  cta: {
    title: "Eintrag anfragen",
    text: "Die Eintragung erfolgt aktuell direkt per E-Mail. Bitte kurz Interesse und Kontext angeben.",
    href: `${contactInfo.email.href}?subject=ResQBrain%20Updates%20%26%20Mitwirkung`,
    label: "Per E-Mail eintragen",
  },
  info: [
    "Möglich für Tests",
    "Möglich für Pilotprojekte",
    "Möglich für Updates",
    "Möglich für Early Access",
  ],
  note: "Es gibt aktuell kein Newsletter-System und keine automatische Registrierung über die Website.",
} as const;
