import { routes } from "@/lib/routes";

export const mainNavigation = [
  { label: "Mitwirkung", href: routes.mitwirkung },
  { label: "Kontakt", href: routes.kontakt },
] as const;

export const footerNavigation = [
  { label: "Mitwirkung", href: routes.mitwirkung },
  { label: "Kontakt", href: routes.kontakt },
  { label: "Impressum", href: "/impressum" },
  { label: "Datenschutz", href: "/datenschutz" },
  { label: "Links", href: routes.links },
] as const;

export type PublicNavigationItem = (typeof mainNavigation)[number];
