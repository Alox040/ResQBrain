import { survey } from "@/lib/site/survey";

export const mitwirkungPageContent = {
  hero: {
    title: "Mitwirkung",
    subtitle: "Gemeinsam praxisnah entwickeln",
    text: "Rueckmeldungen aus dem Rettungsdienst helfen, ResQBrain sinnvoll und alltagstauglich weiterzuentwickeln.",
  },
  why: {
    title: "Warum Mitwirkung wichtig ist",
    text: "Praktische Perspektiven aus Ausbildung und Einsatzalltag unterstuetzen eine realistische Priorisierung der naechsten Schritte.",
  },
  survey: {
    title: "Umfrage",
    text: "Die aktuelle Umfrage sammelt strukturierte Hinweise zu Bedarf, Herausforderungen und relevanten Anwendungsfaellen.",
    cta: survey.label,
    href: survey.href,
  },
  additional: {
    title: "Weitere Moeglichkeiten",
    items: [
      "Konkrete Rueckmeldungen zu Arbeitsablaeufen im Einsatz geben",
      "Hinweise zu fachlichen Inhalten und Prioritaeten teilen",
      "Anforderungen aus Ausbildung und Fortbildung einbringen",
    ],
  },
  note: {
    text: "Alle Rueckmeldungen werden als Beitrag zur weiteren Projektentwicklung betrachtet.",
  },
} as const;
