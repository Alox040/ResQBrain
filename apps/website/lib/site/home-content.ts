import { routes } from "@/lib/routes";
import { publicLinks } from "@/lib/site/public-links";
import { surveys } from "@/lib/site/survey";

export type LandingPageCta = {
  label: string;
  href: string;
  external?: boolean;
  emphasis?: "primary" | "secondary" | "tertiary" | "inline";
};

export type LandingPageStatusTone = "current" | "planned" | "open";

export type LandingPageStatusTag = {
  label: string;
  tone: LandingPageStatusTone;
};

export type LandingPageHero = {
  headline: string;
  subheadline: string;
  statusIndicator: string;
  current: readonly string[];
  cta: {
    primary: LandingPageCta;
    secondary: LandingPageCta;
  };
};

export type LandingPageProblemScenario = {
  title: string;
  text: string;
};

export type LandingPageProblem = {
  headline: string;
  scenarios: readonly LandingPageProblemScenario[];
  conclusion: string;
};

export type LandingPageIdeaBlock = {
  title: string;
  text: string;
  status?: LandingPageStatusTag;
};

export type LandingPageIdea = {
  headline: string;
  subheadline: string;
  blocks: readonly LandingPageIdeaBlock[];
  disclaimer: string;
};

export type LandingPageStatusItem = {
  label: string;
  tone: LandingPageStatusTone;
};

export type LandingPageStatusGroup = {
  title: string;
  items: readonly LandingPageStatusItem[];
};

export type LandingPageStatus = {
  headline: string;
  subheadline: string;
  groups: readonly LandingPageStatusGroup[];
  disclaimer: string;
  cta?: LandingPageCta;
};

export type LandingPageAudienceUseCase = {
  audience: string;
  headline: string;
  paragraphs: readonly string[];
  status: LandingPageStatusTag;
  cta?: LandingPageCta;
};

export type LandingPageAudiences = {
  headline: string;
  useCases: readonly LandingPageAudienceUseCase[];
  closingText: string;
  cta: LandingPageCta;
};

export type LandingPageMitwirkungPath = {
  label: string;
  description: string;
  href?: string;
};

export type LandingPageMitwirkung = {
  headline: string;
  subheadline: string;
  supportingCopy: string;
  activeSurvey: {
    title: string;
    meta: readonly string[];
    href: string;
  };
  paths: readonly LandingPageMitwirkungPath[];
  cta: {
    primary: LandingPageCta;
    secondary: LandingPageCta;
  };
};

export type LandingPageTrustItem = {
  title: string;
  text: string;
};

export type LandingPageTrust = {
  headline: string;
  items: readonly LandingPageTrustItem[];
};

export type LandingPageFaqItem = {
  question: string;
  answer: string;
  cta?: LandingPageCta;
};

export type LandingPageFaq = {
  headline: string;
  items: readonly LandingPageFaqItem[];
};

export type LandingPageFinalCta = {
  eyebrow: string;
  title: string;
  subtitle?: string;
  primaryAction?: LandingPageCta;
  secondaryAction?: LandingPageCta;
};

export type LandingPageContent = {
  hero: LandingPageHero;
  problem: LandingPageProblem;
  idea: LandingPageIdea;
  trust: LandingPageTrust;
  status: LandingPageStatus;
  audiences: LandingPageAudiences;
  mitwirkung: LandingPageMitwirkung;
  faq: LandingPageFaq;
  finalCta: LandingPageFinalCta;
};

export const landingPageLinks = {
  survey: surveys.active.href,
  github: publicLinks.github,
  contact: routes.kontakt,
} as const;

export const homeContent: LandingPageContent = {
  hero: {
    headline: "ResQBrain macht freigegebene Inhalte im Rettungsdienst schneller auffindbar.",
    subheadline:
      "Algorithmen, Medikamente und Protokolle an einem Ort: nachvollziehbar, versioniert und offline verfuegbar.",
    statusIndicator: "MVP-Einordnung April 2026",
    current: [],
    cta: {
      primary: {
        label: "Mehr zur Mitwirkung",
        href: routes.mitwirkung,
        emphasis: "secondary",
      },
      secondary: {
        label: "Projekt auf GitHub",
        href: landingPageLinks.github,
        external: true,
        emphasis: "secondary",
      },
    },
  },
  problem: {
    headline: "So sieht die Realitaet heute oft aus.",
    scenarios: [
      {
        title: "Aktuelle Infos sind nicht direkt greifbar",
        text: "Die aktualisierte Medikamenteninformation liegt als PDF im Intranet. Der Link funktioniert auf Mobilgeraeten nicht.",
      },
      {
        title: "Freigaben kommen an, aber nicht sauber im Alltag",
        text: "Die neue SOP wurde freigegeben. Ob alle Wachen die aktuelle Version haben, ist unklar.",
      },
      {
        title: "Nachschlagen bleibt umstaendlich",
        text: "Unterwegs wird nachgeschlagen. Das Heft liegt im Fahrzeug. Der Zugriff bleibt umstaendlich.",
      },
    ],
    conclusion:
      "Genau hier setzt ResQBrain an: nicht mit neuen Regeln, sondern mit besserem Zugriff auf bereits freigegebene Inhalte.",
  },
  idea: {
    headline: "Was ResQBrain heute leisten soll.",
    subheadline:
      "Keine Entscheidungshilfe. Kein medizinischer Ratgeber. Sondern eine klare Struktur fuer Inhalte, die ohnehin freigegeben sind.",
    blocks: [
      {
        title: "Schneller nachschlagen",
        text: "Freigegebene Inhalte sind in einer kompakten, mobilen Form auffindbar statt verteilt ueber PDFs, Dateien und Einzellinks.",
        status: {
          label: "AKTUELL",
          tone: "current",
        },
      },
      {
        title: "Offline verfuegbar",
        text: "Inhalte liegen auf dem Geraet und bleiben auch dann zugaenglich, wenn die Verbindung schlecht oder gerade nicht verlasslich ist.",
        status: {
          label: "AKTUELL",
          tone: "current",
        },
      },
      {
        title: "Versioniert und freigegeben",
        text: "Inhalte lassen sich mit einem klaren Status fuehren. Ziel ist ein nachvollziehbarer Stand statt Unsicherheit ueber Versionen und Verteilerwege.",
        status: {
          label: "AKTUELL",
          tone: "current",
        },
      },
    ],
    disclaimer:
      "ResQBrain ersetzt keine lokalen Protokolle und trifft keine klinischen Entscheidungen. Die fachliche Verantwortung fuer Inhalte liegt bei der jeweiligen Organisation und ihrer aerztlichen Leitung.",
  },
  trust: {
    headline: "Einordnung und Grundlage.",
    items: [
      {
        title: "Inhaltliche Basis",
        text: "Die aktuellen Seed-Daten orientieren sich an den DBRD-Algorithmen 2026 als technische Ausgangsbasis. Sie zeigen die Struktur des Systems, nicht den Anspruch auf universelle Gueltigkeit.",
      },
      {
        title: "Offene Entwicklung",
        text: "Der Quellcode ist oeffentlich auf GitHub einsehbar. Architektur, Datenmodell und Entwicklungsstand bleiben nachvollziehbar.",
      },
      {
        title: "Kein kommerzielles Produkt",
        text: "ResQBrain ist ein unabhaengiges Entwicklungsprojekt in der MVP-Phase. Es gibt aktuell kein Preismodell und keine Produktvermarktung.",
      },
      {
        title: "Datenschutz",
        text: "Der Website- und App-Prototyp verarbeitet keine Patientendaten. Es gibt keine Nutzerprofile ohne explizite Einwilligung und kein verstecktes Tracking.",
      },
      {
        title: "Medizinische Verantwortung",
        text: "Die Plattform verteilt Inhalte. Die fachliche Verantwortung fuer freigegebene Inhalte liegt bei der aerztlichen Leitung der Organisation.",
      },
    ],
  },
  status: {
    headline: "Was heute existiert und was noch nicht.",
    subheadline: "Stand: April 2026. Kein Produktionsrelease, sondern ein klar abgegrenzter MVP.",
    groups: [
      {
        title: "Aktuell",
        items: [
          { label: "Datenmodell fuer Medikamente, Algorithmen und Protokolle", tone: "current" },
          { label: "Mobile App als Prototyp fuer Offline-Nachschlagen", tone: "current" },
          { label: "Bundle-System mit Versionsvergleich", tone: "current" },
          { label: "Technische Seed-Daten auf Basis DBRD-Algorithmen 2026", tone: "current" },
        ],
      },
      {
        title: "Geplant",
        items: [
          { label: "Freigabe-Workflow fuer Entwurf, Freigabe und Archiv", tone: "planned" },
          { label: "Organisationsverwaltung mit sauberer Trennung von Inhalten", tone: "planned" },
          { label: "Produktionsreifer Editor fuer Inhalte", tone: "planned" },
          { label: "Multi-Organisationsbetrieb", tone: "planned" },
          { label: "Weiterer fachlicher Abgleich mit der Praxis", tone: "planned" },
        ],
      },
    ],
    disclaimer:
      "Alles unter Aktuell existiert bereits im MVP-Kontext. Alles unter Geplant beschreibt die naechsten Entwicklungsziele, nicht den heutigen Stand.",
    cta: {
      label: "Roadmap auf GitHub",
      href: landingPageLinks.github,
      external: true,
      emphasis: "tertiary",
    },
  },
  audiences: {
    headline: "Wie ResQBrain heute genutzt werden kann.",
    useCases: [
      {
        audience: "Rettungsfachpersonal / Nachschlagen",
        headline: "Offline nachschlagen.",
        paragraphs: [
          "ResQBrain fokussiert heute auf einen klaren Use Case: Inhalte auf dem Geraet nachschlagen, ohne erst in Dateien, Ordnern oder Links suchen zu muessen.",
          "Im Mittelpunkt steht nicht eine neue Fachlogik, sondern ein direkterer Zugriff auf den dokumentierten Stand, der fuer die eigene Organisation relevant ist.",
        ],
        status: {
          label: "PROTOTYP - im MVP verfuegbar",
          tone: "current",
        },
        cta: {
          label: "Dein Bereich betroffen?",
          href: routes.mitwirken,
          emphasis: "inline",
        },
      },
    ],
    closingText:
      "Weitere Rollen und Anforderungen sind in Planung. Welche davon zuerst relevant sind, soll aus der Praxis kommen.",
    cta: {
      label: "Dein Bereich betroffen?",
      href: routes.mitwirken,
      emphasis: "tertiary",
    },
  },
  mitwirkung: {
    headline: "Mitwirkung",
    subheadline:
      "Die naechsten Entwicklungsschritte sollen aus der Praxis abgeleitet werden, nicht aus Annahmen.",
    supportingCopy:
      "Wenn du im Rettungsdienst arbeitest, ausbildest oder Inhalte verantwortest, hilft dein Blick auf Alltag, Zugriff und Verstaendlichkeit. Die Umfrage ist der einfachste Weg, Prioritaeten fuer die Weiterentwicklung sichtbar zu machen.",
    activeSurvey: {
      title: "Kurze Umfrage zur Weiterentwicklung",
      meta: ["2 Minuten", "anonym moeglich", "keine Registrierung"],
      href: landingPageLinks.survey,
    },
    paths: [
      {
        label: "Lieber direkt schreiben?",
        description: "Zum Mitwirken-Formular",
        href: routes.mitwirken,
      },
    ],
    cta: {
      primary: {
        label: "An Umfrage teilnehmen",
        href: landingPageLinks.survey,
        external: true,
        emphasis: "primary",
      },
      secondary: {
        label: "Zum Mitwirken-Formular",
        href: routes.mitwirken,
        emphasis: "inline",
      },
    },
  },
  faq: {
    headline: "Haeufige Fragen.",
    items: [
      {
        question: "Ist ResQBrain ein Medizinprodukt oder eine Handlungsempfehlung?",
        answer:
          "Nein. ResQBrain ist ein reines Informationsangebot und kein Medizinprodukt im Sinne der MDR (EU) 2017/745. Die Inhalte dienen dem Nachschlagen und ersetzen keine verbindlichen Protokolle, Dienstanweisungen oder Weisungen der jeweiligen Organisation.",
      },
      {
        question: "Ersetzt das klinische Entscheidungen?",
        answer:
          "Nein. ResQBrain ist ausschliesslich ein Referenzsystem fuer freigegebene Inhalte. Die fachliche Verantwortung fuer die Inhalte liegt bei der aerztlichen Leitung der Organisation.",
      },
      {
        question: "Funktioniert es ohne Internetverbindung?",
        answer:
          "Ja. Inhalte werden auf dem Geraet gespeichert und sind offline abrufbar. Eine Verbindung wird nur fuer den initialen Download und fuer Updates im Hintergrund benoetigt.",
      },
      {
        question: "Wer ist fuer die Inhalte verantwortlich?",
        answer:
          "Die jeweilige Organisation. ResQBrain stellt die Struktur und die Plattform bereit. Die Inhalte - Algorithmen, Medikamente und Protokolle - werden von der aerztlichen Leitung der Organisation erstellt, freigegeben und verantwortet.",
      },
      {
        question: "Kann unsere Organisation das testen?",
        answer:
          "Aktuell befindet sich die Organisationsverwaltung noch in der Entwicklung. Wenn du Interesse an einem fruehen Piloteinsatz hast, melde dich direkt. Wir arbeiten mit einem kleinen Kreis an fruehen Partnern, um die Anforderungen praxisnah zu definieren.",
        cta: {
          label: "Zum Mitwirken-Formular",
          href: routes.mitwirken,
          emphasis: "inline",
        },
      },
      {
        question: "Ist das kostenlos?",
        answer:
          "In der aktuellen Entwicklungsphase gibt es kein Preismodell. Das Projekt ist nicht kommerziell ausgerichtet. Ob und wie ein zukuenftiges Modell aussieht, ist noch nicht entschieden.",
      },
    ],
  },
  finalCta: {
    eyebrow: "Die Richtung steht. Die Prioritaeten brauchen Praxis.",
    title: "Wenn du erkennst, wo dieser Zugriff im Alltag helfen wuerde, dann bring deine Perspektive ein.",
    subtitle: "Zwei Minuten Rueckmeldung helfen mehr als allgemeine Zustimmung.",
    primaryAction: {
      label: "An Umfrage teilnehmen",
      href: landingPageLinks.survey,
      external: true,
      emphasis: "primary",
    },
    secondaryAction: {
      label: "Zum Mitwirken-Formular",
      href: routes.mitwirken,
      emphasis: "inline",
    },
  },
};

export const content = homeContent;
