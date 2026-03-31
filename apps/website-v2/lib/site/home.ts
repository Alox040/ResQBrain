import { getHomeSectionHref, getRouteHref } from "@/lib/routes";
import type { HomeSectionHref, RouteHref } from "@/lib/routes";
import type { FaqItem } from "@/types/site-content";

type HomeCta = {
  label: string;
  href: RouteHref | HomeSectionHref;
};

type HomeInfoSection = {
  title: string;
  text: string;
};

type HomeListItem = {
  title: string;
  text: string;
};

type HomeSectionBlock = {
  title: string;
  items: HomeListItem[];
};

export const homeContent = {
  hero: {
    title: "ResQBrain",
    subtitle: "Verlaessliche Inhalte fuer Einsatzorganisationen.",
    ctaPrimary: {
      label: "Mitwirken",
      href: getRouteHref("mitwirkung"),
    } satisfies HomeCta,
    ctaSecondary: {
      label: "Kontakt",
      href: getRouteHref("kontakt"),
    } satisfies HomeCta,
  },
  problem: {
    title: "Problem",
    text: "Einsatzrelevante Informationen liegen oft verteilt vor.",
  } satisfies HomeInfoSection,
  nutzen: {
    title: "Nutzen",
    items: [{ title: "Zentral", text: "Inhalte werden an einem Ort gebuendelt." }],
  } satisfies HomeSectionBlock,
  zielgruppen: {
    title: "Zielgruppen",
    items: [{ title: "Organisationen", text: "Teams mit standardisierten Prozessen." }],
  } satisfies HomeSectionBlock,
  projektstatus: {
    title: "Projektstatus",
    text: "Die Plattform befindet sich im Aufbau.",
  } satisfies HomeInfoSection,
  mitwirkung: {
    title: "Mitwirkung",
    text: "Fachliche Rueckmeldungen helfen bei der Priorisierung.",
    cta: {
      label: "Zur Mitwirkungsseite",
      href: getRouteHref("mitwirkung"),
    } satisfies HomeCta,
  },
  faq: {
    title: "FAQ",
    items: [
      {
        question: "Ist die Website bereits final?",
        answer: "Nein, sie ist als oeffentliche Projektbasis angelegt.",
      },
    ] as FaqItem[],
  },
  kontaktCta: {
    title: "Kontakt",
    text: "Fragen koennen direkt ueber die Kontaktseite gestellt werden.",
    cta: {
      label: "Kontakt aufnehmen",
      href: getRouteHref("kontakt"),
    } satisfies HomeCta,
    anchorHref: getHomeSectionHref("kontakt"),
  },
} as const;

export type HomeContent = typeof homeContent;
