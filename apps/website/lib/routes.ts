const home = "/";
const kontakt = "/kontakt";
const mitwirkung = "/mitwirkung";
const links = "/links";
const impressum = "/impressum";
const datenschutz = "/datenschutz";

export const routes = {
  home,
  kontakt,
  mitwirkung,
  links,
  impressum,
  datenschutz,
} as const;

export const mainNav = [
  { label: "Start", href: routes.home },
  { label: "Mitwirkung", href: routes.mitwirkung },
  { label: "Kontakt", href: routes.kontakt },
] as const;

export const footerNav = [
  { label: "Links", href: routes.links },
] as const;

export type AppRoute = (typeof routes)[keyof typeof routes];
