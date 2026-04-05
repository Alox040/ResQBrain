import { routes } from "@/lib/routes";
import { survey } from "@/lib/site/survey";

export const content = {
  hero: {
    badge: "MVP-Phase | in Entwicklung",
    headline: "ResQBrain ordnet Einsatzwissen für den Rettungsdienst.",
    subline:
      "Ein ruhiges Projekt für Lernen und strukturierte Nachbereitung - nachvollziehbar, praxisnah und schrittweise aufgebaut.",
    ctaPrimary: {
      label: "Mitwirken",
      href: routes.mitwirkung,
    },
    ctaSecondary: {
      label: "Projekt ansehen",
      href: routes.home,
    },
  },
  problem: {
    title: "Warum das Projekt existiert",
    intro:
      "Im Einsatz zählen wenige Klicks und verlässliche Inhalte. Gleichzeitig bleibt Wissen oft in Teams und Schichten verteilt.",
    cards: [
      {
        headline: "Wissen bleibt lokal",
        text: "Erfahrungen sind häufig an einzelne Personen oder Gruppen gebunden.",
      },
      {
        headline: "Nachbereitung ist uneinheitlich",
        text: "Reflexion findet statt, aber selten in einer stabilen, gemeinsamen Struktur.",
      },
      {
        headline: "Zeitdruck bleibt hoch",
        text: "Ohne klare Ordnung wird relevantes Wissen im Alltag immer wieder neu gesucht.",
      },
    ],
  },
  idea: {
    title: "Projektidee",
    cards: [
      {
        headline: "Struktur statt Zufall",
        text: "Inhalte werden klar geordnet, damit sie schnell auffindbar bleiben.",
      },
      {
        headline: "Nachvollziehbarkeit",
        text: "Inhalte sollen von Quelle bis Anwendung fachlich nachvollziehbar sein.",
      },
      {
        headline: "Praxisnähe",
        text: "Rückmeldungen aus Einsatz und Ausbildung steuern die Prioritäten.",
      },
    ],
  },
  status: {
    title: "Aktueller Stand",
    intro: "ResQBrain ist in der MVP-Phase und entwickelt sich schrittweise.",
    cards: ["MVP Phase", "Feedback aktiv", "Schrittweise Entwicklung"],
  },
  audience: {
    title: "Für wen",
    intro: "ResQBrain richtet sich an Praxis, Organisation und Ausbildung im Rettungsdienst.",
    cards: [
      {
        title: "Notfallsanitäter",
        text: "Klarere Orientierung für Lernen und Nachbereitung im Einsatzalltag.",
      },
      {
        title: "Rettungsdienste",
        text: "Gemeinsame Struktur für verlässliche Inhalte im Team.",
      },
      {
        title: "Ausbildung",
        text: "Praxisnahe Basis für Wiederholung und strukturierte Vermittlung.",
      },
    ],
  },
  mitwirkung: {
    title: "Mitwirkung",
    text: "Perspektiven aus Praxis und Ausbildung helfen, das Projekt frühzeitig an reale Bedarfe anzupassen.",
    cta: {
      label: "Zur Umfrage",
      href: survey.href,
    },
  },
  faq: {
    title: "FAQ",
    items: [
      {
        question: "Was ist ResQBrain?",
        answer: "Ein Projekt für Lernen und strukturierte Nachbereitung im Rettungsdienst.",
      },
      {
        question: "Ist das Projekt schon fertig?",
        answer: "Nein, ResQBrain befindet sich bewusst in der MVP-Phase.",
      },
      {
        question: "Wer kann mitwirken?",
        answer: "Praxis, Organisation und Ausbildung können Feedback einbringen.",
      },
      {
        question: "Wie kann ich starten?",
        answer: "Am besten über die Mitwirkungsseite und die aktuelle Umfrage.",
      },
    ],
  },
  cta: {
    title: "Nächster Schritt",
    text: "Bei Fragen oder Kooperationsinteresse freuen wir uns auf eine direkte Nachricht.",
    button: {
      label: "Kontakt aufnehmen",
      href: routes.kontakt,
    },
  },
} as const;
