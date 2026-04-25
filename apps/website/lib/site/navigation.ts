import { routes } from "@/lib/routes";

export const mainNavigation = [
  { label: "Start", href: routes.home },
  { label: "Mitmachen", href: routes.mitwirkung },
  { label: "Updates", href: routes.updates },
  { label: "Community", href: routes.links },
  { label: "Kontakt", href: routes.kontakt },
] as const;
