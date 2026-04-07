import { routes } from "@/lib/routes";
import { surveys } from "@/lib/site/survey";

export const content = {
  hero: {
    badge: "MVP-Phase | in Entwicklung",
    headline: "ResQBrain strukturiert Einsatzwissen für den Rettungsdienst.",
    subline:
      "Das Projekt unterstützt einheitliche Nachbereitung mit nachvollziehbaren Inhalten. Der Funktionsumfang wächst schrittweise in der MVP-Phase.",
    ctaPrimary: {
      label: "Mitwirken",
      href: routes.mitwirkung,
    },
    ctaSecondary: {
      label: "Projekt ansehen",
      href: routes.home,
    },
    hints: [
      "Kurzumfrage (2 Minuten)",
      "Community entwickelt die App mit",
    ],
  },
  problem: {
    title: "Warum das Projekt existiert",
    intro:
      "Einsatz und Nachbereitung brauchen belastbare Informationen. Wissen verteilt sich dennoch häufig auf Teams und Schichten.",
    cards: [
      {
        headline: "Wissen bleibt lokal",
        text: "Erfahrung und Routinen hängen stark an einzelnen Personen und Gruppen.",
      },
      {
        headline: "Nachbereitung ist uneinheitlich",
        text: "Reflexion findet ohne gemeinsame, feste Struktur statt.",
      },
      {
        headline: "Zeitdruck bleibt hoch",
        text: "Ohne klare Ablage wird Wissen im Alltag wiederholt gesucht.",
      },
    ],
  },
  idea: {
    title: "Projektidee",
    cards: [
      {
        headline: "Geordnete Inhalte",
        text: "Inhalte liegen übersichtlich ab. Der Zugriff wird dadurch schneller.",
      },
      {
        headline: "Nachvollziehbarkeit",
        text: "Herkunft und fachliche Einordnung bleiben für Inhalte erkennbar.",
      },
      {
        headline: "Praxisnähe",
        text: "Prioritäten richten sich nach Rückmeldungen aus Einsatz und Ausbildung.",
      },
    ],
  },
  status: {
    title: "Aktueller Stand",
    intro: "Das Projekt befindet sich in der MVP-Phase. Der Umfang wächst schrittweise.",
    cards: ["MVP-Phase", "Aktives Feedback", "Schrittweise Erweiterung"],
  },
  audience: {
    title: "Zielgruppen",
    intro:
      "Das Projekt richtet sich an Einsatzkräfte, Organisationen und Ausbildung im Rettungsdienst.",
    cards: [
      {
        title: "Notfallsanitäter",
        text: "Die Orientierung bei Lernen und Nachbereitung im Einsatzalltag verbessert sich.",
      },
      {
        title: "Rettungsdienste",
        text: "Teams erhalten eine gemeinsame Struktur für Inhalte.",
      },
      {
        title: "Ausbildung",
        text: "Strukturierte Vermittlung und Wiederholung erhalten eine praxisnahe Grundlage.",
      },
    ],
  },
  mitwirkung: {
    title: "Mitwirkung",
    text: "Rückmeldungen aus Praxis und Ausbildung fließen in die Priorisierung des Projekts ein.",
    cta: {
      label: "UI & UX mitgestalten",
      href: surveys.active.href,
      badge: surveys.active.label,
      description: surveys.active.description,
      date: surveys.active.date,
    },
  },
  faq: {
    title: "FAQ",
    items: [
      {
        question: "Was ist ResQBrain?",
        answer:
          "ResQBrain ist ein Projekt zur strukturierten Nachbereitung im Rettungsdienst. Nachvollziehbare Inhalte stehen im Vordergrund.",
      },
      {
        question: "In welcher Phase befindet sich das Projekt?",
        answer:
          "Das Projekt liegt in der MVP-Phase. Der Funktionsumfang wächst schrittweise.",
      },
      {
        question: "Wer kann mitwirken?",
        answer:
          "Mitwirkende kommen aus Praxis, Organisation und Ausbildung. Feedback ist über die Mitwirkungsseite möglich.",
      },
      {
        question: "Wie erfolgt der Einstieg?",
        answer:
          "Der Einstieg führt über die Mitwirkungsseite. Die aktuelle Umfrage ist dort verlinkt.",
      },
    ],
  },
  cta: {
    title: "Kontakt",
    text: "Rückfragen und Anregungen zum Projekt sind über die Kontaktaufnahme möglich.",
    button: {
      label: "Kontakt",
      href: routes.kontakt,
    },
  },
} as const;
