import { routes } from "@/lib/routes";
import { publicLinks } from "@/lib/site/public-links";
import { surveys } from "@/lib/site/survey";

export const linksPageContent = {
  hero: {
    title: "Links",
    subtitle: "Funktionale Verweise rund um ResQBrain",
  },
  description:
    "Hier finden sich die wichtigsten Zugänge zum Projekt, zur Umfrage und zu den Kontaktwegen.",
  primaryLinkCards: [
    {
      title: "Umfrage",
      description: surveys.active.description,
      href: surveys.active.href,
      actionLabel: surveys.active.label,
      external: true,
      date: surveys.active.date,
    },
    {
      title: "Website",
      description: "Zur öffentlichen Website von ResQBrain.",
      href: publicLinks.website,
      actionLabel: "Website öffnen",
      external: true,
    },
    {
      title: "Discord",
      description: "Community und Austausch zum Projekt.",
      href: publicLinks.discord,
      actionLabel: "Discord öffnen",
      external: true,
    },
  ],
  secondaryLinks: [
    {
      title: "GitHub",
      href: publicLinks.github,
      external: true,
    },
    {
      title: "Projektbeschreibung",
      href: "https://github.com/Alox040/ResQBrain/blob/main/README.md",
      external: true,
    },
    {
      title: "Kontakt",
      href: routes.kontakt,
      external: false,
    },
  ],
} as const;
