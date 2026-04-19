import { routes } from "@/lib/routes";
import { updatesInterestFormHref } from "@/lib/site/updates-form";

export const updatesPageContent = {
  hero: {
    title: "Updates",
    subtitle: "Mitwirken und auf dem Laufenden bleiben",
  },
  description:
    "Interessierte können sich für Tests, Pilotprojekte, Updates oder Early Access direkt beim Projekt melden.",
  cta: {
    title: "Eintragen",
    text: "Die Anmeldung läuft über ein externes Formular (Microsoft Forms). Dort kannst du Interesse und Kontext angeben; Benachrichtigungen laufen über die Formular-Einstellungen, nicht über die Website.",
    formHref: updatesInterestFormHref,
    primaryLabel: "Eintragen",
    secondaryLabel: "Mehr zur Mitwirkung",
    secondaryHref: routes.mitwirkung,
  },
  info: [
    "Möglich für Tests",
    "Möglich für Pilotprojekte",
    "Möglich für Updates",
    "Möglich für Early Access",
  ],
  note: "Auf der Website gibt es keine eigene Registrierungslogik oder ein Newsletter-Backend; die Datenhaltung erfolgt im verlinkten Formular.",
} as const;
