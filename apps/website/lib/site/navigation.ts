import { routes } from "@/lib/routes";

export const mainNavigation = [
  { label: "Start", href: routes.home },
  { label: "Mitwirkung", href: routes.mitwirkung },
  { label: "Mitwirken", href: routes.mitwirken },
  { label: "Updates", href: routes.updates },
  { label: "Links", href: routes.links },
  { label: "Kontakt", href: routes.kontakt },
] as const;
