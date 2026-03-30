export const siteConfig = {
  publicProfile: {
    name: "ResQBrain",
    title: "ResQBrain | Einsatzwissen ohne Suchen",
    description:
      "Plattform fuer Rettungsdienst Algorithmen, Medikamente und Nachbereitung.",
    url: "https://resqbrain.de",
    tagline: "Einsatzwissen ohne Suchen",
    stageLabel: "Early Development",
  },
  navigation: [
    { href: "/#problem", label: "Problem" },
    { href: "/#solution", label: "Loesung" },
    { href: "/#features", label: "Funktionen" },
    { href: "/#preview", label: "Vorschau" },
    { href: "/#use-cases", label: "Einsatz" },
    { href: "/#trust", label: "Verantwortung" },
    { href: "/#cta", label: "Kontakt" },
  ],
  contact: {
    email: "triggerhub@outlook.com",
    repositoryUrl: "https://github.com/Alox040/ResQBrain",
    feedbackLabel: "Feedback",
  },
  legal: {
    links: [
      { href: "/impressum", label: "Impressum" },
      { href: "/datenschutz", label: "Datenschutz" },
    ],
  },
  footer: {
    copyrightSuffix: "Alle Rechte vorbehalten.",
  },
} as const;

export type SiteConfig = typeof siteConfig;
