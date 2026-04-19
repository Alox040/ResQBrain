import { routes } from "@/lib/routes";
import { surveys } from "@/lib/site/survey";

/**
 * Startseiten-Inhalt. `content` (unten) spiegelt die bisherige Form für vorhandene Komponenten.
 */
export const homeContent = {
  hero: {
    title: "ResQBrain strukturiert Einsatzwissen für den Rettungsdienst.",
    subtitle: "MVP-Phase | in Entwicklung",
    description:
      "Das Projekt arbeitet an einer gemeinsamen, nachvollziehbaren Wissensgrundlage für Einsatz, Ausbildung und Nachbereitung. Der Funktionsumfang wächst schrittweise in der MVP-Phase.",
    hints: ["Kurzumfrage (2 Minuten)", "Community entwickelt die App mit"],
    status: {
      title: "Aktueller Stand",
      intro:
        "ResQBrain ist noch kein fertiges Produkt. Aktuell werden Grundlagen, Feedback und erste Anwendungsfälle zusammengeführt.",
      cards: ["MVP-Phase", "Aktives Feedback", "Schrittweise Erweiterung"],
    },
    primaryCta: {
      label: "Mitwirken",
      href: routes.mitwirken,
    },
    secondaryCta: {
      label: "Projekt auf GitHub",
      href: "https://github.com/Alox040/ResQBrain",
      external: true as const,
    },
  },
  problem: [
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
  problemSection: {
    title: "Warum das Projekt existiert",
    intro:
      "Einsatz und Nachbereitung brauchen belastbare Informationen. Wissen verteilt sich dennoch häufig auf Teams, Schichten und einzelne Personen.",
  },
  features: {
    idea: {
      title: "Projektidee",
      items: [
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
  },
  audience: [
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
  audienceSection: {
    title: "Zielgruppen",
    intro:
      "Das Projekt richtet sich an Einsatzkräfte, Organisationen und Ausbildung im Rettungsdienst.",
  },
  contribution: {
    sectionTitle: "Mitwirkung",
    cards: [
      {
        title: surveys.active.label,
        description: `${surveys.active.description} · Stand: ${surveys.active.date}`,
        href: surveys.active.href,
        linkLabel: "UI & UX mitgestalten",
        external: true as const,
      },
      {
        title: "Mitwirkung",
        description:
          "Rückmeldungen aus Praxis und Ausbildung fließen direkt in die Priorisierung des Projekts ein.",
        href: routes.mitwirken,
        linkLabel: "Mitwirken",
        external: false as const,
      },
    ],
  },
  faq: [
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
  faqSection: {
    title: "FAQ",
  },
  prefooterCta: {
    title: "Kontakt",
    text: "Rückfragen und Anregungen zum Projekt sind über die Kontaktseite möglich.",
    button: {
      label: "Kontakt aufnehmen",
      href: routes.kontakt,
    },
  },
} as const;

/** @deprecated Nutze `homeContent`; bleibt für vorhandene Imports von `content`. */
export const content = {
  hero: {
    badge: homeContent.hero.subtitle,
    headline: homeContent.hero.title,
    subline: homeContent.hero.description,
    ctaPrimary: homeContent.hero.primaryCta,
    ctaSecondary: homeContent.hero.secondaryCta,
    hints: homeContent.hero.hints,
  },
  problem: {
    title: homeContent.problemSection.title,
    intro: homeContent.problemSection.intro,
    cards: homeContent.problem,
  },
  idea: {
    title: homeContent.features.idea.title,
    cards: homeContent.features.idea.items,
  },
  projectGoal: {
    title: homeContent.features.projectGoal.title,
    intro: homeContent.features.projectGoal.intro,
    items: homeContent.features.projectGoal.items,
  },
  status: homeContent.hero.status,
  audience: {
    title: homeContent.audienceSection.title,
    intro: homeContent.audienceSection.intro,
    cards: homeContent.audience,
  },
  mitwirkung: {
    title: homeContent.contribution.sectionTitle,
    text: homeContent.contribution.cards[1].description,
    cta: {
      label: "UI & UX mitgestalten",
      href: homeContent.contribution.cards[0].href,
      badge: surveys.active.label,
      description: surveys.active.description,
      date: surveys.active.date,
    },
  },
  faq: {
    title: homeContent.faqSection.title,
    items: homeContent.faq,
  },
  cta: homeContent.prefooterCta,
} as const;
