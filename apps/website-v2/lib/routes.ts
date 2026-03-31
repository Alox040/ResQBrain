export const routes = {
  home: "/",
  mitwirkung: "/mitwirkung",
  kontakt: "/kontakt",
  impressum: "/impressum",
  datenschutz: "/datenschutz",
  links: "/links",
} as const;

export const sectionAnchors = {
  hero: "hero",
  problem: "problem",
  nutzen: "nutzen",
  zielgruppen: "zielgruppen",
  projektstatus: "projektstatus",
  mitwirkung: "mitwirkung",
  faq: "faq",
  kontakt: "kontakt",
} as const;

export type RouteKey = keyof typeof routes;
export type RouteHref = (typeof routes)[RouteKey];

export type SectionAnchorKey = keyof typeof sectionAnchors;
export type SectionAnchor = (typeof sectionAnchors)[SectionAnchorKey];
export type HomeSectionHref = `/#${SectionAnchor}`;

export const mainNav = [
  "home",
  "mitwirkung",
  "kontakt",
] as const satisfies readonly RouteKey[];

export const footerNav = [
  "impressum",
  "datenschutz",
  "links",
] as const satisfies readonly RouteKey[];

export function getRouteHref(route: RouteKey): RouteHref {
  return routes[route];
}

export function getHomeSectionHref(section: SectionAnchorKey): HomeSectionHref {
  return `/#${sectionAnchors[section]}`;
}
