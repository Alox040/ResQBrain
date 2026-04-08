import { routes } from "@/lib/routes";
import { publicLinks } from "@/lib/site/public-links";
import { surveys } from "@/lib/site/survey";

type LinksPageItem = {
  title: string;
  text: string;
  href: string;
  label: string;
  external: boolean;
  date?: string;
};

export const linksPageContent = {
  hero: {
    title: "Links",
    subtitle: "Funktionale Verweise rund um ResQBrain",
  },
  description: "Hier finden sich die wichtigsten Zugänge zum Projekt, zur Umfrage und zu den Kontaktwegen.",
  links: [
    {
      title: "Discord",
      text: "Community und Austausch zum Projekt.",
      href: publicLinks.discord,
      label: "Discord öffnen",
      external: true,
    },
    {
      title: "GitHub",
      text: "Repository und Projektstand auf GitHub.",
      href: publicLinks.github,
      label: "GitHub öffnen",
      external: true,
    },
    {
      title: "Umfrage",
      text: surveys.active.description,
      href: surveys.active.href,
      label: surveys.active.label,
      external: true,
      date: surveys.active.date,
    },
    {
      title: "Website",
      text: "Zur öffentlichen Website von ResQBrain.",
      href: publicLinks.website,
      label: "Website öffnen",
      external: true,
    },
    {
      title: "Kontakt",
      text: "Direkter Kontakt zum Projekt.",
      href: routes.kontakt,
      label: "Kontaktseite öffnen",
      external: false,
    },
    {
      title: "Mitwirkung",
      text: "Mitwirken, Feedback geben und Umfrage finden.",
      href: routes.mitwirkung,
      label: "Mitwirkung öffnen",
      external: false,
    },
  ] as readonly LinksPageItem[],
  cta: {
    title: "Updates erhalten",
    text: "Für Tests, Pilotprojekte oder Projektupdates steht die Updates-Seite bereit.",
    href: routes.updates,
    label: "Zu Updates",
  },
} as const;
