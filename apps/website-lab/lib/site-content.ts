export const siteMeta = {
  name: "ResQBrain",
  labLabel: "Website Lab",
  tagline: "Validierte Inhalte fuer Einsatz und Ausbildung",
  footerText:
    "Experimenteller Website-Lab Bereich fuer Struktur, Inhalt und Feedback-Loops rund um ResQBrain.",
  contactLine: "Kontakt: kontakt@resqbrain.de",
};

export const navigation = [
  { label: "Start", href: "/" },
  { label: "Mitwirkung", href: "/mitwirkung" },
  { label: "Updates", href: "/updates" },
  { label: "Kontakt", href: "/kontakt" },
  { label: "Links", href: "/links" },
];

export const footerLinks = [
  { label: "Impressum", href: "/impressum" },
  { label: "Datenschutz", href: "/datenschutz" },
  { label: "Kontakt", href: "/kontakt" },
  { label: "Mitwirkung", href: "/mitwirkung" },
];

export const homePage = {
  hero: {
    eyebrow: "Projektkontext",
    title: "ResQBrain als strukturierte Wissensbasis fuer den Rettungsdienst",
    text: "Das Website-Lab bildet den Status des Projekts klar ab und leitet gezielt in Mitwirkung und Updates.",
    metrics: [
      { label: "Scope", value: "MVP" },
      { label: "Fokus", value: "Inhalt & Governance" },
      { label: "Status", value: "Experimentell" },
    ],
    primaryCta: { label: "Mitwirkung ansehen", href: "/mitwirkung" },
    secondaryCta: { label: "Projektupdates", href: "/updates" },
    panelTitle: "Lab Snapshot",
    panelStats: [
      { label: "Stand", value: "Architekturphase" },
      { label: "Ziel", value: "Saubere Validierung" },
    ],
  },
  story: {
    eyebrow: "Warum",
    title: "Vom Prototyp zur belastbaren Plattform",
    text: "Die Seite beschreibt, was bereits geklaert ist und wo bewusst noch offene Entscheidungen bestehen.",
    cards: [
      {
        eyebrow: "Problem",
        title: "Wissensinseln reduzieren",
        text: "Einsatzrelevante Inhalte sollen konsistent und organisationsbezogen verfuegbar sein.",
      },
      {
        eyebrow: "Ansatz",
        title: "Versionierte Inhalte",
        text: "Inhalte werden strukturiert gepflegt und freigegeben statt ad-hoc verteilt.",
      },
      {
        eyebrow: "Nutzen",
        title: "Schnellerer Zugriff",
        text: "Teams finden schneller die passenden Informationen fuer Einsatz und Ausbildung.",
      },
    ],
  },
  system: {
    eyebrow: "Systembild",
    title: "Klare Grenzen statt Mischlogik",
    text: "Domain, Orchestrierung und Darstellung bleiben getrennt, um spaetere Erweiterungen stabil zu halten.",
    foundation: {
      eyebrow: "Fundament",
      title: "Tenant- und Inhaltsgrenzen",
      text: "Organisationen bleiben logisch isoliert; Inhalte folgen einem nachvollziehbaren Lebenszyklus.",
      points: [
        "Organisation als Scope",
        "Freigabestatus explizit",
        "Versionen nachvollziehbar",
      ],
    },
    delivery: {
      eyebrow: "Auslieferung",
      title: "Fokus auf Navigation und Verstaendlichkeit",
      text: "Die Website fuehrt in die relevanten Bereiche, ohne Produktlogik zu vermischen.",
      points: [
        "Klare Seitenstruktur",
        "Gezielte CTAs",
        "Transparenter Projektstand",
      ],
    },
  },
  audience: {
    eyebrow: "Zielgruppen",
    title: "Fuer Einsatz, Lehre und Organisation",
    text: "Die Lab-Seiten adressieren unterschiedliche Rollen mit demselben strukturierten Kern.",
    cards: [
      {
        eyebrow: "Einsatz",
        title: "Rettungsfachpersonal",
        text: "Braucht schnellen Zugriff auf gesicherte Inhalte im Kontext.",
      },
      {
        eyebrow: "Ausbildung",
        title: "Lehr- und Praxisteams",
        text: "Nutzen dieselbe Quelle fuer nachvollziehbare Trainingsinhalte.",
      },
      {
        eyebrow: "Organisation",
        title: "Fachverantwortliche",
        text: "Steuern Inhalte, Freigaben und Rollout ueber klare Governance.",
      },
    ],
  },
  cta: {
    eyebrow: "Naechste Schritte",
    title: "Rueckmeldung direkt in den vorgesehenen Kanaelen",
    text: "Mitwirkung und Kontakt bleiben explizit, damit Feedback in den richtigen Strom fliesst.",
    primary: {
      label: "Mitwirkung starten",
      href: "/mitwirkung",
      title: "Mit Umfrage und Rueckmeldung beitragen",
      text: "Rueckmeldungen helfen, Inhalte, Begriffe und Prioritaeten sauber zu schaerfen.",
    },
    secondary: {
      label: "Kontakt aufnehmen",
      href: "/kontakt",
      title: "Direkter Ansprechpartner",
      text: "Fuer konkrete Rueckfragen oder Abstimmungen steht ein klarer Kontaktweg bereit.",
    },
  },
};

export const mitwirkungPage = {
  hero: {
    eyebrow: "Mitwirkung",
    title: "Rueckmeldung strukturiert einsammeln",
    text: "Der Mitwirkungsbereich sammelt qualifizierte Hinweise ohne den Seitenfluss zu ueberladen.",
    metrics: [
      { label: "Format", value: "Survey + Kontakt" },
      { label: "Rolle", value: "Fachliche Rueckmeldung" },
    ],
    primaryCta: { label: "Zur Umfrage", href: "https://example.org/survey" },
    secondaryCta: { label: "Kontakt", href: "/kontakt" },
    panelTitle: "Mitwirkungsmodus",
    panelStats: [{ label: "Status", value: "Aktiv" }],
  },
  channels: {
    eyebrow: "Kanaele",
    title: "Mehrere Wege, ein klares Ziel",
    text: "Feedback kann ueber Umfrage, Direktkontakt oder Kontextbeispiele eingebracht werden.",
    cards: [
      {
        eyebrow: "Umfrage",
        title: "Strukturiertes Feedback",
        text: "Standardisierte Fragen fuer vergleichbare Auswertung.",
        points: ["Prioritaeten", "Verstaendlichkeit", "Nutzbarkeit"],
      },
      {
        eyebrow: "Direktkontakt",
        title: "Fachlicher Austausch",
        text: "Rueckfragen koennen gezielt geklaert werden.",
        points: ["Schneller Dialog", "Konkrete Abstimmung"],
      },
      {
        eyebrow: "Beispiele",
        title: "Kontext aus dem Alltag",
        text: "Praxisbeobachtungen ergaenzen die Umfrageergebnisse.",
        points: ["Einsatznaehe", "Konkrete Szenarien"],
      },
    ],
  },
  process: {
    eyebrow: "Ablauf",
    title: "Kurz und nachvollziehbar",
    text: "Mitwirkung bleibt einfach: Rueckmeldung geben, konsolidieren, in Updates spiegeln.",
    steps: [
      { eyebrow: "1", title: "Input", text: "Hinweise werden gesammelt." },
      { eyebrow: "2", title: "Sichtung", text: "Rueckmeldungen werden gebuendelt." },
      { eyebrow: "3", title: "Rueckfluss", text: "Ergebnisse fliessen in Prioritaeten und Updates ein." },
    ],
  },
};

export const updatesPage = {
  hero: {
    eyebrow: "Projektupdates",
    title: "Transparenter Verlauf statt Changelog-Rauschen",
    text: "Die Seite zeigt die wesentlichen Fortschritte in kompakten, nachvollziehbaren Eintraegen.",
    metrics: [
      { label: "Rhythmus", value: "Iterativ" },
      { label: "Fokus", value: "Architektur & Inhalte" },
    ],
    panelTitle: "Letzter Stand",
    panelStats: [{ label: "Phase", value: "Fruehe Umsetzung" }],
  },
  timeline: {
    eyebrow: "Timeline",
    title: "Wichtige Schritte",
    text: "Nur relevante Aenderungen mit direktem Bezug auf das MVP.",
    entries: [
      {
        date: "Q2 2026",
        title: "Website-Lab Grundstruktur",
        text: "Seitenstruktur und Inhaltsmodule fuer den Lab-Bereich aufgesetzt.",
        points: ["Routing gesetzt", "UI-Bausteine verbunden"],
      },
      {
        date: "Q1 2026",
        title: "Architekturgrundlagen konsolidiert",
        text: "Kontexte, Begriffe und Modulgrenzen als kanonische Basis festgehalten.",
        points: ["Terminologie bereinigt", "Grenzen dokumentiert"],
      },
    ],
  },
};

export const kontaktPage = {
  hero: {
    eyebrow: "Kontakt",
    title: "Direkter Draht fuer fachliche Rueckfragen",
    text: "Kontaktwege sind klar benannt und auf den Lab-Kontext ausgerichtet.",
    metrics: [
      { label: "Antwortfokus", value: "Projekt & Inhalt" },
      { label: "Kanal", value: "E-Mail zuerst" },
    ],
    primaryCta: { label: "E-Mail senden", href: "mailto:kontakt@resqbrain.de" },
    panelTitle: "Kontaktfenster",
    panelStats: [{ label: "Reaktion", value: "Zeitnah" }],
  },
  touchpoints: {
    eyebrow: "Kontaktpunkte",
    title: "Wahlweise direkt oder strukturiert",
    text: "Je nach Anliegen ist Umfrage, Mail oder Kontextlink der passende Startpunkt.",
    cards: [
      {
        eyebrow: "E-Mail",
        title: "Projektkontakt",
        text: "Fragen zu Inhalten, Scope und Ablauf.",
        href: "mailto:kontakt@resqbrain.de",
        label: "Mail oeffnen",
        external: true,
      },
      {
        eyebrow: "Mitwirkung",
        title: "Umfragekanal",
        text: "Rueckmeldung gesammelt statt verstreut.",
        href: "/mitwirkung",
        label: "Mitwirkung ansehen",
        external: false,
      },
      {
        eyebrow: "Updates",
        title: "Projektstand",
        text: "Aktuellen Fortschritt zuerst pruefen.",
        href: "/updates",
        label: "Zu den Updates",
        external: false,
      },
    ],
  },
};

export const linksPage = {
  hero: {
    eyebrow: "Links",
    title: "Zentrale Verweise fuer Projekt und Kontext",
    text: "Interne und externe Ressourcen sind an einem Ort gebuendelt.",
    metrics: [
      { label: "Typen", value: "Intern + Extern" },
      { label: "Pflege", value: "Kuratierte Auswahl" },
    ],
    panelTitle: "Link-Katalog",
    panelStats: [{ label: "Ziel", value: "Schneller Einstieg" }],
  },
  groups: {
    eyebrow: "Extern",
    title: "Ausgewaehlte Referenzen",
    text: "Externe Quellen fuer Einordnung und vertiefende Kontexte.",
    cards: [
      {
        eyebrow: "Survey",
        title: "Feedback-Umfrage",
        text: "Direkter Zugang zur strukturierten Rueckmeldung.",
        href: "https://example.org/survey",
        label: "Umfrage oeffnen",
        external: true,
      },
      {
        eyebrow: "Repository",
        title: "Projektcode",
        text: "Technischer Einblick in Struktur und Entwicklung.",
        href: "https://example.org/repo",
        label: "Repository ansehen",
        external: true,
      },
    ],
  },
  internal: {
    eyebrow: "Intern",
    title: "Relevante Seiten im Lab",
    text: "Direkter Sprung zu den wichtigsten Bereichen der Website.",
    cards: [
      { eyebrow: "Start", title: "Projektueberblick", text: "Einstieg in den Lab-Kontext.", href: "/", label: "Zur Startseite" },
      {
        eyebrow: "Updates",
        title: "Aktueller Fortschritt",
        text: "Zeitliche Entwicklung und priorisierte Schritte.",
        href: "/updates",
        label: "Zu den Updates",
      },
    ],
  },
};

export const legalContent = {
  impressum: {
    hero: {
      eyebrow: "Rechtliches",
      title: "Impressum",
      text: "Pflichtangaben fuer den experimentellen Website-Lab Bereich.",
      panelTitle: "Kontakt und Verantwortung",
      panelStats: [{ label: "Rechtsgrundlage", value: "TMG" }],
    },
    project: "ResQBrain Website-Lab",
    responsible: "Projektteam ResQBrain",
    email: "kontakt@resqbrain.de",
    note: "Dies ist ein experimenteller Projektbereich ohne produktiven Einsatzbetrieb.",
    editorial: "Inhalte dienen der Projektkommunikation und fruehen fachlichen Abstimmung.",
    stage: "Die Plattform befindet sich in Architektur- und frueher Implementierungsphase.",
  },
  datenschutz: {
    hero: {
      eyebrow: "Rechtliches",
      title: "Datenschutz",
      text: "Transparente Hinweise zur Verarbeitung personenbezogener Daten im Website-Lab.",
      panelTitle: "Datenschutz-Info",
      panelStats: [{ label: "Stand", value: "Entwurf" }],
    },
    sections: [
      {
        title: "Verantwortliche Stelle",
        paragraphs: [
          "Verantwortlich fuer diese Seiten ist das ResQBrain Projektteam.",
          "Bei Rueckfragen kann die angegebene Kontaktadresse genutzt werden.",
        ],
      },
      {
        title: "Verarbeitete Daten",
        paragraphs: [
          "Beim Aufruf der Seiten koennen technisch notwendige Zugriffsdaten anfallen.",
          "Bei Kontaktaufnahme werden bereitgestellte Angaben zur Bearbeitung genutzt.",
        ],
        list: ["Zeitpunkt des Zugriffs", "Aufgerufene URL", "Kontaktinhalt bei direkter Anfrage"],
      },
      {
        title: "Zweck und Speicherdauer",
        paragraphs: [
          "Daten werden nur fuer Betrieb, Sicherheit und projektbezogene Kommunikation verwendet.",
          "Eine weitergehende Nutzung ohne geeignete Grundlage erfolgt nicht.",
        ],
      },
    ],
  },
};
