import { routes } from "@/lib/routes";
import { homeContent } from "@/lib/site/home-content";
import { mitwirkungPageContent } from "@/lib/site/mitwirkung-content";

/**
 * Mitwirken-Seite: Einleitung aus Mitwirkungs-, Kontakt- und Partner-CTA-Inhalten;
 * Formularlabels und Interessen-Checkboxen.
 */
export const mitwirkenContent = {
  introBlocks: [
    {
      title: mitwirkungPageContent.hero.title,
      text: mitwirkungPageContent.hero.text,
    },
    {
      title: homeContent.prefooterCta.title,
      text: homeContent.prefooterCta.text,
    },
    {
      title: mitwirkungPageContent.mitwirkenCta.label,
      text: mitwirkungPageContent.note.text,
    },
  ],
  form: {
    title: "Projekt mitmachen",
    fields: {
      name: { label: "Name", placeholder: "Vor- und Nachname" },
      email: { label: "E-Mail", placeholder: "name@beispiel.de" },
      role: {
        label: "Rolle",
        placeholder: "Bitte wählen",
        options: [
          { value: "einsatz", label: "Einsatzkraft" },
          { value: "organisation", label: "Organisation / Rettungsdienst" },
          { value: "ausbildung", label: "Ausbildung" },
          { value: "forschung", label: "Forschung" },
          { value: "sonstiges", label: "Sonstiges" },
        ],
      },
      interestsLegend: "Interessen",
    },
    interestCheckboxes: [
      { value: "beta", label: "Beta testen" },
      { value: "pilot", label: "Pilotprojekt" },
      { value: "feedback", label: "Feedback" },
      { value: "updates", label: "Updates" },
      { value: "zusammenarbeit", label: "Zusammenarbeit" },
    ],
    submit: "Absenden",
    privacyNote:
      "Angaben werden nur zur Bearbeitung deiner Anfrage verwendet. Details in der Datenschutzerklärung.",
    privacyHref: routes.datenschutz,
  },
} as const;
