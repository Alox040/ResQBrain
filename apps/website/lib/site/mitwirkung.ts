import { survey } from "@/lib/site/survey";

export const mitwirkungPageContent = {
  hero: {
    title: "Mitwirkung",
    subtitle: "Gemeinsam praxisnah entwickeln",
    text: "Rückmeldungen aus dem Rettungsdienst helfen, ResQBrain sinnvoll und alltagstauglich weiterzuentwickeln.",
  },
  why: {
    title: "Warum Mitwirkung wichtig ist",
    text: "Praktische Perspektiven aus Ausbildung und Einsatzalltag unterstützen eine realistische Priorisierung der nächsten Schritte.",
  },
  survey: {
    title: "Umfrage",
    text: "Die aktuelle Umfrage sammelt strukturierte Hinweise zu Bedarf, Herausforderungen und relevanten Anwendungsfällen.",
    cta: survey.label,
    href: survey.href,
  },
  additional: {
    title: "Weitere Möglichkeiten",
    items: [
      "Konkrete Rückmeldungen zu Arbeitsabläufen im Einsatz geben",
      "Hinweise zu fachlichen Inhalten und Prioritäten teilen",
      "Anforderungen aus Ausbildung und Fortbildung einbringen",
    ],
  },
  note: {
    text: "Alle Rückmeldungen werden als Beitrag zur weiteren Projektentwicklung betrachtet.",
  },
} as const;
