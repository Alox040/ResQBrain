import { mitwirkungPageContent } from "@/lib/site/mitwirkung-content";
import { siteContent } from "@/lib/site/site-content";

export const kontaktContent = {
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
  cooperation: {
    title: "Kooperation",
    items: mitwirkungPageContent.additional.items,
  },
  mitwirkenCta: {
    title: mitwirkungPageContent.hero.title,
    text: mitwirkungPageContent.note.text,
    buttonLabel: mitwirkungPageContent.mitwirkenCta.label,
    href: mitwirkungPageContent.mitwirkenCta.href,
  },
} as const;

export const contactDetails = {
  projectName: "ResQBrain",
  responsibleName: "ResQBrain Projekt",
  email: siteContent.contactEmail,
} as const;

export const contactInfo = {
  email: {
    label: contactDetails.email,
    href: `mailto:${contactDetails.email}`,
  },
} as const;

/** @deprecated Nutze `kontaktContent`. */
export const contactPageContent = kontaktContent;
