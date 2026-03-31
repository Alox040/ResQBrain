import { routes } from "@/lib/routes";

export const homeContent = {
  hero: {
    title: "ResQBrain",
    subtitle: "Lernen und Nachbereitung im Rettungsdienst",
    ctaPrimary: {
      label: "Mitwirken",
      href: routes.mitwirkung,
    },
    ctaSecondary: {
      label: "Kontakt",
      href: routes.kontakt,
    },
  },
  problem: {
    title: "Problem",
    text: "Wissen aus Einsätzen geht häufig verloren oder wird nicht strukturiert nachbereitet.",
  },
  benefits: {
    title: "Nutzen",
    text: "Strukturierte Nachbereitung verbessert Sicherheit und Routine im Alltag.",
    items: [
      { title: "Sicherer handeln", text: "Wichtige Erfahrungen werden dokumentiert und bleiben im Team verfügbar." },
      { title: "Routine aufbauen", text: "Regelmaessige Nachbereitung unterstuetzt verlässliche Entscheidungen im Einsatz." },
      { title: "Wissen verankern", text: "Inhalte werden strukturiert wiederholt statt im Alltag verloren zu gehen." },
    ],
  },
  zielgruppen: {
    title: "Zielgruppen",
    items: [
      { title: "Notfallsanitäter", text: "Für Lernen, Nachbereitung und schnellen Wissenszugriff." },
      { title: "Rettungsdienst", text: "Für praxisnahe, strukturierte Unterstützung im Alltag." },
      { title: "Ausbildung", text: "Für Wiederholung, Orientierung und strukturierte Vorbereitung." },
    ],
  },
  projectStatus: {
    title: "Projektstatus",
    text: "Aktive Entwicklung mit Fokus auf MVP und praxisnahe Weiterentwicklung.",
  },
  mitwirkung: {
    title: "Mitwirkung",
    text: "Wir suchen Personen aus Praxis und Ausbildung fuer Feedback und inhaltliche Rueckmeldungen.",
    cta: {
      label: "Zur Mitwirkung",
      href: routes.mitwirkung,
    },
  },
  faq: {
    title: "Haeufige Fragen",
    items: [
      {
        question: "Was ist ResQBrain?",
        answer: "ResQBrain ist eine Plattform fuer Lernen und strukturierte Nachbereitung im Rettungsdienst.",
      },
      {
        question: "Wer kann mitwirken?",
        answer: "Fachkraefte aus Rettungsdienst und Ausbildung koennen Feedback und Praxiswissen einbringen.",
      },
      {
        question: "Wie bleibt das Projekt praxisnah?",
        answer: "Durch kontinuierliche Rueckmeldungen aus dem Einsatzalltag und eine fokussierte MVP-Entwicklung.",
      },
    ],
  },
  kontaktCta: {
    title: "Kontakt",
    text: "Du hast Fragen oder willst dich einbringen? Wir freuen uns auf deine Nachricht.",
    cta: {
      label: "Kontakt aufnehmen",
      href: routes.kontakt,
    },
  },
} as const
