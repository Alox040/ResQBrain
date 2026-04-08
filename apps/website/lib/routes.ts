const home = "/";
const kontakt = "/kontakt";
const mitwirkung = "/mitwirkung";
const mitwirken = "/mitwirken";
const links = "/links";
const impressum = "/impressum";
const datenschutz = "/datenschutz";
const updates = "/updates";

export const routes = {
  home,
  kontakt,
  mitwirkung,
  mitwirken,
  links,
  impressum,
  datenschutz,
  updates,
} as const;

export const mainNav = [
  { label: "Start", href: routes.home },
  { label: "Mitwirkung", href: routes.mitwirkung },
  { label: "Mitwirken", href: routes.mitwirken },
  { label: "Updates", href: routes.updates },
  { label: "Links", href: routes.links },
  { label: "Kontakt", href: routes.kontakt },
] as const;

export const footerNav = [
  { label: "Impressum", href: routes.impressum },
  { label: "Datenschutz", href: routes.datenschutz },
] as const;

export type AppRoute = (typeof routes)[keyof typeof routes];
