import { routes } from "@/lib/routes";

export const homeContent = {
  hero: {
    title: "ResQBrain",
    subtitle:
      "Lernen und strukturierte Nachbereitung fuer den Rettungsdienst - klar, ruhig und praxisnah.",
    ctaPrimary: {
      label: "Mitwirkung anfragen",
      href: routes.mitwirkung,
    },
    ctaSecondary: {
      label: "Kontakt",
      href: routes.kontakt,
    },
  },
  problem: {
    title: "Warum ResQBrain",
    text: "Wissen aus Einsaetzen bleibt oft in einzelnen Teams oder Schichten. Ohne strukturierte Nachbereitung geht wertvolle Erfahrung verloren und muss im Alltag wieder neu aufgebaut werden.",
  },
  benefits: {
    title: "Nutzen im Alltag",
    text: "ResQBrain hilft, Einsatzwissen verstaendlich zu sichern und wiederholbar nutzbar zu machen.",
    items: [
      {
        title: "Sicherer handeln",
        text: "Erfahrungen aus Einsaetzen werden nachvollziehbar dokumentiert und bleiben im Team verfuegbar.",
      },
      {
        title: "Routine aufbauen",
        text: "Regelmaessige Nachbereitung unterstuetzt ruhige Entscheidungen in komplexen Situationen.",
      },
      {
        title: "Wissen verankern",
        text: "Relevante Inhalte werden strukturiert wiederholt statt zwischen Schichten verloren zu gehen.",
      },
    ],
  },
  zielgruppen: {
    title: "Zielgruppen",
    items: [
      {
        title: "Notfallsanitaeter:innen",
        text: "Fuer schnellen Wissenszugriff und strukturierte Nachbereitung nach dem Einsatz.",
      },
      {
        title: "Rettungsdienste",
        text: "Fuer eine einheitliche, gut lesbare Wissensbasis im operativen Alltag.",
      },
      {
        title: "Ausbildung",
        text: "Fuer Wiederholung, Orientierung und praxisnahe Vorbereitung auf reale Lagen.",
      },
    ],
  },
  projectStatus: {
    title: "Projektstatus",
    text: "ResQBrain befindet sich in der MVP-Phase. Aktuell stehen Struktur, Lesbarkeit und fachlich klare Inhalte im Fokus.",
  },
  mitwirkung: {
    title: "Mitwirkung",
    text: "Wir suchen Rueckmeldungen aus Praxis und Ausbildung, um Inhalte fruehzeitig an realen Bedarfen auszurichten.",
    cta: {
      label: "Jetzt Mitwirkung anfragen",
      href: routes.mitwirkung,
    },
  },
  faq: {
    title: "Haeufige Fragen",
    items: [
      {
        question: "Was ist ResQBrain?",
        answer:
          "ResQBrain ist eine Plattform fuer Lernen und strukturierte Nachbereitung im Rettungsdienst.",
      },
      {
        question: "Wer kann mitwirken?",
        answer:
          "Fachkraefte aus Rettungsdienst und Ausbildung koennen Feedback und Praxiswissen einbringen.",
      },
      {
        question: "Wie bleibt das Projekt MVP-ehrlich?",
        answer:
          "Wir priorisieren nur Funktionen mit unmittelbarem Nutzen fuer den Einsatzalltag und validieren sie mit realem Feedback.",
      },
    ],
  },
  kontaktCta: {
    title: "Kontakt",
    text: "Sie haben Fragen oder moechten ResQBrain in Ihrem Umfeld einordnen? Wir freuen uns auf den Austausch.",
    cta: {
      label: "Kontakt aufnehmen",
      href: routes.kontakt,
    },
  },
} as const
