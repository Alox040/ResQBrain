import { routes } from "@/lib/routes";
import { contactInfo } from "@/lib/site/contact-page";
import { publicLinks } from "@/lib/site/public-links";

export const mainNavigation = [
  { label: "Start", href: routes.home },
  { label: "Mitwirkung", href: routes.mitwirkung },
  { label: "Mitwirken", href: routes.mitwirken },
  { label: "Updates", href: routes.updates },
  { label: "Links", href: routes.links },
  { label: "Kontakt", href: routes.kontakt },
] as const;

export const footerNavigation = [
  { label: "Impressum", href: routes.impressum, external: false },
  { label: "Datenschutz", href: routes.datenschutz, external: false },
  { label: "Kontakt", href: routes.kontakt, external: false },
  { label: "E-Mail", href: contactInfo.email.href, external: true },
  { label: "GitHub", href: publicLinks.github, external: true },
  { label: "Discord", href: publicLinks.discord, external: true },
] as const;

export type PublicNavigationItem = (typeof mainNavigation)[number];
