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
  supportingCopy: string;
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
    headline: "ResQBrain strukturiert medizinische Inhalte fuer Rettungsdienstorganisationen.",
    subheadline:
      "Algorithmen, Medikamente und Protokolle organisationsspezifisch, versioniert, offline verfuegbar.",
    supportingCopy:
      "Das Projekt befindet sich in der MVP-Phase. Die mobile App ist als Prototyp verfuegbar. Wir suchen Rettungsdienstorganisationen und Fachpersonal, die die Entwicklung aktiv mitgestalten.",
    statusIndicator: "MVP-Phase April 2026",
    current: ["MVP-Prototyp", "Mobile App (Prototyp)", "Offline-Lookup", "Oeffentliches Repository"],
    cta: {
      primary: {
        label: "An Umfrage teilnehmen",
        href: landingPageLinks.survey,
        external: true,
        emphasis: "primary",
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
    headline: "So sieht die aktuelle Realitaet aus.",
    scenarios: [
      {
        title: "Szenario 1",
        text: "Die aktualisierte Medikamenteninformation liegt als PDF im Intranet. Der Link funktioniert auf Mobilgeraeten nicht.",
      },
      {
        title: "Szenario 2",
        text: "Die neue SOP wurde freigegeben. Ob alle Wachen die aktuelle Version haben, ist unklar.",
      },
      {
        title: "Szenario 3",
        text: "Unterwegs wird nachgeschlagen. Das Heft liegt im Fahrzeug. Der Zugriff bleibt umstaendlich.",
      },
    ],
    conclusion: "Das sind keine Ausnahmen. Das ist der Alltag in vielen Rettungsdienstbereichen.",
  },
  idea: {
    headline: "Was ResQBrain bereitstellt.",
    subheadline:
      "Keine Entscheidungshilfe. Kein medizinischer Ratgeber. Eine Struktur fuer freigegebene Inhalte.",
    blocks: [
      {
        title: "Offline-first",
        text: "Inhalte liegen auf dem Geraet. Der Zugriff funktioniert ohne Mobilfunknetz, auch in Kellern, auf der Autobahn oder im Aufzugsschacht.",
        status: {
          label: "AKTUELL",
          tone: "current",
        },
      },
      {
        title: "Organisationsspezifisch",
        text: "Das Ziel: Jede Organisation verwaltet eigene Inhalte.",
        status: {
          label: "GEPLANT",
          tone: "planned",
        },
      },
      {
        title: "Versioniert und freigegeben",
        text: "Inhalte haben einen definierten Status: Entwurf, Freigegeben, Archiviert. Sichtbar ist immer der aktuell freigegebene Stand der eigenen Organisation.",
        status: {
          label: "AKTUELL",
          tone: "current",
        },
      },
    ],
    disclaimer:
      "ResQBrain trifft keine klinischen Entscheidungen. Die fachliche Verantwortung fuer Inhalte liegt bei der jeweiligen Organisation und ihrer aerztlichen Leitung.",
  },
  trust: {
    headline: "Einordnung und Grundlagen.",
    items: [
      {
        title: "Inhaltliche Basis",
        text: "Die aktuellen Seed-Daten orientieren sich an den DBRD-Algorithmen 2026 als technische Ausgangsbasis. Eigene Inhalte koennen Organisationen selbst einpflegen und freigeben.",
      },
      {
        title: "Offene Entwicklung",
        text: "Der Quellcode ist oeffentlich auf GitHub einsehbar. Keine Blackbox, keine versteckte Logik.",
      },
      {
        title: "Kein kommerzielles Produkt",
        text: "ResQBrain ist ein unabhaengiges Entwicklungsprojekt. Kein Abo-Modell, kein Vendor Lock-in, keine kommerzielle Verwertungsabsicht in der aktuellen Phase.",
      },
      {
        title: "Datenschutz",
        text: "Die App verarbeitet keine Patientendaten. Keine Nutzerprofile ohne explizite Einwilligung. Keine Tracking-Mechanismen im Prototyp.",
      },
      {
        title: "Medizinische Verantwortung",
        text: "Die Plattform verteilt Inhalte. Die fachliche Verantwortung fuer freigegebene Inhalte liegt bei der jeweiligen aerztlichen Leitung der Organisation.",
      },
    ],
  },
  status: {
    headline: "Aktueller Entwicklungsstand.",
    subheadline: "Stand: April 2026 - kein Produktionsrelease.",
    groups: [
      {
        title: "Aktuell",
        items: [
          { label: "Datenmodell - Medikamente, Algorithmen, Protokolle", tone: "current" },
          { label: "Offline-faehige Mobile App (Prototyp, iOS/Android)", tone: "current" },
          { label: "Bundle-System mit Versionsvergleich", tone: "current" },
          { label: "Seed-Daten: DBRD-Algorithmen 2026", tone: "current" },
        ],
      },
      {
        title: "Geplant",
        items: [
          { label: "Freigabe-Workflow (Entwurf - Freigabe - Archiv)", tone: "planned" },
          { label: "Organisationsverwaltung (Tenant-Isolation)", tone: "planned" },
          { label: "Produktionsreifer Content-Editor", tone: "planned" },
          { label: "Multi-Organisationsbetrieb", tone: "planned" },
          { label: "Offizielle medizinische Validierung", tone: "planned" },
        ],
      },
    ],
    disclaimer: "Alles, was hier als aktuell markiert ist, existiert. Der Rest ist geplant, aber nicht garantiert.",
    cta: {
      label: "Entwicklung verfolgen auf GitHub",
      href: landingPageLinks.github,
      external: true,
      emphasis: "tertiary",
    },
  },
  audiences: {
    headline: "Fuer wen und wie.",
    useCases: [
      {
        audience: "Aerztliche Leitung / Organisation",
        headline: "Inhalte verwalten und freigeben.",
        paragraphs: [
          "Die aerztliche Leitung erstellt eine neue Version eines freigegebenen Inhalts. Der Inhalt durchlaeuft einen Freigabeprozess. Nach Freigabe steht fuer alle Geraete der Organisation beim naechsten Sync-Fenster der neue Stand bereit.",
          "Kein manuelles Verteilen. Kein PDF-Versand. Kein Zweifel, ob alle die aktuelle Version haben.",
        ],
        status: {
          label: "GEPLANT - Freigabe-Workflow in Entwicklung",
          tone: "planned",
        },
        cta: {
          label: "Kontakt aufnehmen",
          href: landingPageLinks.contact,
          emphasis: "inline",
        },
      },
      {
        audience: "Rettungsfachpersonal / Nachschlagen",
        headline: "Offline nachschlagen.",
        paragraphs: [
          "Oeffnet die App. Sucht nach einem Thema. Findet den freigegebenen Inhalt der eigenen Organisation - nicht eine generische Leitlinie, sondern den dokumentierten Stand des eigenen Rettungsdienstbereichs. Kein Netz erforderlich.",
        ],
        status: {
          label: "PROTOTYP - im MVP verfuegbar",
          tone: "current",
        },
      },
      {
        audience: "Ausbildung",
        headline: "Dieselben Inhalte wie im Alltag.",
        paragraphs: [
          "Auszubildende lernen mit denselben freigegebenen Algorithmen und Protokollen, die spaeter im Organisationsalltag genutzt werden. Kein Bruch zwischen Ausbildungsstand und Praxis.",
        ],
        status: {
          label: "GEPLANT - abhaengig von Organisationsverwaltung",
          tone: "planned",
        },
      },
    ],
    closingText: "Eines davon betrifft dich? Melde dich.",
    cta: {
      label: "Kontakt aufnehmen",
      href: landingPageLinks.contact,
      emphasis: "tertiary",
    },
  },
  mitwirkung: {
    headline: "Mach die App besser.",
    subheadline: "Praxisrueckmeldungen aus dem Rettungsdienst entscheiden ueber die naechsten Schritte.",
    supportingCopy:
      "Das Projekt waechst mit dem Feedback von Rettungsfachpersonal, aerztlichen Leitungen und Ausbildern. Kein Softwareentwickler kann entscheiden, wie eine Inhaltsansicht im Arbeitsalltag aufgebaut sein soll. Das kannst du.",
    activeSurvey: {
      title: "UI & UX Feedback April 2026",
      meta: ["2 Minuten", "anonym moeglich", "keine Registrierung"],
      href: landingPageLinks.survey,
    },
    paths: [
      {
        label: "Lieber direkt schreiben?",
        description: "Kontakt aufnehmen",
        href: landingPageLinks.contact,
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
        label: "Kontakt aufnehmen",
        href: landingPageLinks.contact,
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
          label: "Kontakt aufnehmen",
          href: landingPageLinks.contact,
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
    eyebrow: "Diese Szenarien stehen noch am Anfang.",
    title: "Wenn du aus dem Rettungsdienst kommst und erkennst, was hier beschrieben wird - melde dich.",
  },
};

export const content = homeContent;
