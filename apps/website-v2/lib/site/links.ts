import type { LinkItem } from "@/types/site-content";

export const linksContent = {
  title: "Links",
  intro: "Sammlung externer Verweise.",
  groups: [
    {
      title: "Projekt",
      links: [{ label: "Repository", href: "https://github.com", description: "Platzhalter." }],
    },
  ] as Array<{
    title: string;
    links: Array<LinkItem & { description?: string }>;
  }>,
} as const;

export type LinksContent = typeof linksContent;
