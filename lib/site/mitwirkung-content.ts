import { routes } from "@/lib/routes";
import { publicLinks } from "@/lib/site/public-links";
import { surveys } from "@/lib/site/survey";

export const mitwirkungPageContent = {
  hero: {
    title: "Mitwirkung",
    subtitle: "Gemeinsam praxisnah entwickeln",
    text: "Rückmeldungen aus dem Rettungsdienst helfen, ResQBrain sinnvoll und alltagstauglich weiterzuentwickeln.",
  },
  why: {
    title: "Warum Mitwirkung wichtig ist",
    text: "Praktische Perspektiven aus Ausbildung und Einsatzalltag unterstützen eine realistische Priorisierung der nächsten Schritte.",
  },
  survey: {
    title: "Umfrage",
    text: "Die aktuelle Umfrage sammelt strukturierte Hinweise zu Bedarf, Herausforderungen und relevanten Anwendungsfällen.",
    cta: "Zur aktuellen Umfrage",
    href: surveys.active.href,
    badge: surveys.active.label,
    description: surveys.active.description,
    date: surveys.active.date,
  },
  previousSurveys: {
    title: "Vorherige Umfragen",
    items: surveys.previous,
  },
  additional: {
    title: "Weitere Möglichkeiten",
    items: [
      "Konkrete Rückmeldungen zu Arbeitsabläufen im Alltag geben",
      "Hinweise zu fachlichen Inhalten und Prioritäten teilen",
      "Anforderungen aus Ausbildung und Fortbildung einbringen",
    ],
  },
  note: {
    text: "Alle Rückmeldungen werden als Beitrag zur weiteren Projektentwicklung betrachtet.",
  },
  communityChannels: [
    {
      platform: "Discord",
      description: "Community und Austausch zum Projekt.",
      href: publicLinks.discord,
      external: true,
    },
    {
      platform: "Reddit",
      href: publicLinks.reddit,
      external: true,
    },
    {
      platform: "TikTok",
      href: publicLinks.tiktok,
      external: true,
    },
  ],
  mitwirkenCta: {
    label: "Projekt Mitmachen",
    href: routes.mitwirken,
  },
} as const;
