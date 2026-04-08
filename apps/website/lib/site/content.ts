import { routes } from "@/lib/routes";
import { surveys } from "@/lib/site/survey";

export const content = {
  hero: {
    badge: "MVP-Phase | in Entwicklung",
    headline: "ResQBrain strukturiert Einsatzwissen für den Rettungsdienst.",
    subline:
      "Das Projekt arbeitet an einer gemeinsamen, nachvollziehbaren Wissensgrundlage für Einsatz, Ausbildung und Nachbereitung. Der Funktionsumfang wächst schrittweise in der MVP-Phase.",
    ctaPrimary: {
      label: "Mitwirken",
      href: routes.mitwirkung,
    },
    ctaSecondary: {
      label: "Projekt auf GitHub",
      href: "https://github.com/Alox040/ResQBrain",
      external: true,
    },
    hints: ["Kurzumfrage (2 Minuten)", "Community entwickelt die App mit"],
  },
  problem: {
    title: "Warum das Projekt existiert",
    intro:
      "Einsatz und Nachbereitung brauchen belastbare Informationen. Wissen verteilt sich dennoch häufig auf Teams, Schichten und einzelne Personen.",
    cards: [
      {
        headline: "Wissen bleibt lokal",
        text: "Erfahrung und Routinen hängen oft an einzelnen Personen, statt für Teams dauerhaft verfügbar zu sein.",
      },
      {
        headline: "Nachbereitung bleibt uneinheitlich",
        text: "Reflexion und Lernen laufen häufig ohne gemeinsame, nachvollziehbare Struktur.",
      },
      {
        headline: "Zeitdruck bleibt hoch",
        text: "Ohne klare Ablage muss relevantes Wissen im Alltag immer wieder neu gesucht werden.",
      },
    ],
  },
  idea: {
    title: "Projektidee",
    cards: [
      {
        headline: "Geordnete Inhalte",
        text: "Inhalte sollen übersichtlich abgelegt und im Alltag schneller auffindbar werden.",
      },
      {
        headline: "Nachvollziehbarkeit",
        text: "Herkunft, Version und fachliche Einordnung bleiben für Inhalte erkennbar.",
      },
      {
        headline: "Praxisnähe",
        text: "Prioritäten orientieren sich an Rückmeldungen aus Einsatz, Organisation und Ausbildung.",
      },
    ],
  },
  projectGoal: {
    title: "Projektziel",
    intro:
      "ResQBrain soll Wissen nicht nur sammeln, sondern in einen belastbaren Arbeitskontext für den Rettungsdienst bringen.",
    items: [
      {
        headline: "Zentrale Wissensplattform",
        text: "Algorithmen, Medikamente und SOP-nahe Inhalte werden an einem Ort zusammengeführt.",
      },
      {
        headline: "Organisationsspezifische Inhalte",
        text: "Organisationen sollen eigene, versionierbare Inhalte nachvollziehbar verwalten können.",
      },
      {
        headline: "Einsatz und Nachbereitung",
        text: "Der Zugriff im Einsatz und das strukturierte Lernen danach sollen sinnvoll verbunden werden.",
      },
    ],
  },
  status: {
    title: "Aktueller Stand",
    intro:
      "ResQBrain ist noch kein fertiges Produkt. Aktuell werden Grundlagen, Feedback und erste Anwendungsfälle zusammengeführt.",
    cards: ["MVP-Phase", "Aktives Feedback", "Schrittweise Erweiterung"],
  },
  audience: {
    title: "Zielgruppen",
    intro:
      "Das Projekt richtet sich an Einsatzkräfte, Organisationen und Ausbildung im Rettungsdienst.",
    cards: [
      {
        title: "Einsatzkräfte",
        text: "Nachbereitung und Orientierung im Einsatzalltag sollen strukturierter und schneller möglich werden.",
      },
      {
        title: "Rettungsdienste",
        text: "Teams erhalten eine gemeinsame Struktur für Inhalte, Rückmeldungen und Weiterentwicklung.",
      },
      {
        title: "Ausbildung",
        text: "Strukturierte Vermittlung und Wiederholung erhalten eine praxisnahe Grundlage.",
      },
    ],
  },
  mitwirkung: {
    title: "Mitwirkung",
    text: "Rückmeldungen aus Praxis und Ausbildung fließen direkt in die Priorisierung des Projekts ein.",
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
          "ResQBrain ist ein Projekt für strukturierte Wissensarbeit und Nachbereitung im Rettungsdienst. Nachvollziehbare Inhalte stehen im Vordergrund.",
      },
      {
        question: "In welcher Phase befindet sich das Projekt?",
        answer: "Das Projekt liegt in der MVP-Phase. Der Funktionsumfang wächst schrittweise.",
      },
      {
        question: "Wer kann mitwirken?",
        answer:
          "Mitwirkende kommen aus Praxis, Organisation und Ausbildung. Feedback ist über die Mitwirkungsseite möglich.",
      },
      {
        question: "Wie erfolgt der Einstieg?",
        answer: "Der Einstieg erfolgt über die Mitwirkungsseite. Die aktuelle Umfrage ist dort verlinkt.",
      },
    ],
  },
  cta: {
    title: "Kontakt",
    text: "Rückfragen und Anregungen zum Projekt sind über die Kontaktseite möglich.",
    button: {
      label: "Kontakt aufnehmen",
      href: routes.kontakt,
    },
  },
} as const;
