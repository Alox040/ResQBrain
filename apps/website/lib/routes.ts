const home = "/";
const contact = "/kontakt";
const links = "/links";
const survey = "/mitwirkung";

export const routes = {
  home,
  contact,
  links,
  survey,
  kontakt: contact,
  mitwirkung: survey,
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
