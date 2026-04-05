import { publicLinks } from "@/lib/site/public-links";
import { survey } from "@/lib/site/survey";

export const linksPageContent = {
  hero: {
    title: "Links",
    subtitle: "Relevante Verweise rund um ResQBrain",
  },
  description: "Hier finden sich zentrale Projekt- und Community-Verweise als strukturierte Einstiegspunkte.",
  projectLinks: {
    title: "Projektlinks",
    items: [
      {
        label: "Aktuelle Umfrage",
        buttonLabel: "Umfrage",
        href: survey.url,
        external: true,
        description: "Rückmeldungen aus der Praxis in strukturierter Form teilen.",
      },
      {
        label: "Projektbeschreibung",
        buttonLabel: "Projekt ansehen",
        href: publicLinks.projectDoc,
        external: true,
        description: "Überblick über Zielbild, Kontext und aktuellen Projektstand.",
      },
    ],
  },
  communityLinks: {
    title: "Community",
    items: [
      {
        label: "Discord",
        buttonLabel: "Discord",
        href: publicLinks.discord,
        external: true,
        description: "Austausch zur Weiterentwicklung im Community-Kanal.",
      },
    ],
  },
} as const;
