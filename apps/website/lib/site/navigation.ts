import { routes } from "@/lib/routes";

export const mainNavigation = [
  { label: "Start", href: routes.home },
  { label: "Mitwirkung", href: routes.mitwirkung },
  { label: "Kontakt", href: routes.kontakt },
] as const;

export const footerNavigation = [
  { label: "Mitwirkung", href: routes.mitwirkung },
  { label: "Kontakt", href: routes.kontakt },
  { label: "Impressum", href: routes.impressum },
  { label: "Datenschutz", href: routes.datenschutz },
  { label: "Links", href: routes.links },
] as const;

export type PublicNavigationItem = (typeof mainNavigation)[number];
