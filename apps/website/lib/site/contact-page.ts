export const contactPageContent = {
  hero: {
    title: "Kontakt",
    subtitle: "Direkt mit dem Projektteam in Verbindung treten",
  },
  description:
    "Für Rückfragen, Hinweise oder Zusammenarbeit rund um ResQBrain stehen wir für einen direkten Austausch zur Verfügung.",
  contact: {
    title: "Kontakt aufnehmen",
    text: "Nutze den vorgesehenen Kontaktweg, um dein Anliegen zu teilen.",
    cta: "E-Mail",
  },
  note: "Anfragen werden so zeitnah wie möglich beantwortet.",
} as const;

export const contactDetails = {
  projectName: "ResQBrain",
  responsibleName: "ResQBrain Projekt",
  email: "kontakt@resqbrain.de",
} as const;

export const contactInfo = {
  email: {
    label: contactDetails.email,
    href: `mailto:${contactDetails.email}`,
  },
} as const;
