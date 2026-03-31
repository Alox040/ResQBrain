import { routes } from "@/lib/routes";
import { survey } from "@/lib/site/survey";

export const content = {
  hero: {
    badge: "MVP-Phase | in Entwicklung",
    headline: "ResQBrain ordnet Einsatzwissen fuer den Rettungsdienst.",
    subline:
      "Ein ruhiges Projekt fuer Lernen und strukturierte Nachbereitung - nachvollziehbar, praxisnah und schrittweise aufgebaut.",
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
      "Im Einsatz zaehlen wenige Klicks und verlaessliche Inhalte. Gleichzeitig bleibt Wissen oft in Teams und Schichten verteilt.",
    cards: [
      {
        headline: "Wissen bleibt lokal",
        text: "Erfahrungen sind haeufig an einzelne Personen oder Gruppen gebunden.",
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
        headline: "Praxisnaehe",
        text: "Rueckmeldungen aus Einsatz und Ausbildung steuern die Prioritaeten.",
      },
    ],
  },
  status: {
    title: "Aktueller Stand",
    intro: "ResQBrain ist in der MVP-Phase und entwickelt sich schrittweise.",
    cards: ["MVP Phase", "Feedback aktiv", "Schrittweise Entwicklung"],
  },
  audience: {
    title: "Fuer wen",
    intro: "ResQBrain richtet sich an Praxis, Organisation und Ausbildung im Rettungsdienst.",
    cards: [
      {
        title: "Notfallsanitaeter",
        text: "Klarere Orientierung fuer Lernen und Nachbereitung im Einsatzalltag.",
      },
      {
        title: "Rettungsdienste",
        text: "Gemeinsame Struktur fuer verlaessliche Inhalte im Team.",
      },
      {
        title: "Ausbildung",
        text: "Praxisnahe Basis fuer Wiederholung und strukturierte Vermittlung.",
      },
    ],
  },
  mitwirkung: {
    title: "Mitwirkung",
    text: "Perspektiven aus Praxis und Ausbildung helfen, das Projekt fruehzeitig an reale Bedarfe anzupassen.",
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
        answer: "Ein Projekt fuer Lernen und strukturierte Nachbereitung im Rettungsdienst.",
      },
      {
        question: "Ist das Projekt schon fertig?",
        answer: "Nein, ResQBrain befindet sich bewusst in der MVP-Phase.",
      },
      {
        question: "Wer kann mitwirken?",
        answer: "Praxis, Organisation und Ausbildung koennen Feedback einbringen.",
      },
      {
        question: "Wie kann ich starten?",
        answer: "Am besten ueber die Mitwirkungsseite und die aktuelle Umfrage.",
      },
    ],
  },
  cta: {
    title: "Naechster Schritt",
    text: "Bei Fragen oder Kooperationsinteresse freuen wir uns auf eine direkte Nachricht.",
    button: {
      label: "Kontakt aufnehmen",
      href: routes.kontakt,
    },
  },
} as const;
