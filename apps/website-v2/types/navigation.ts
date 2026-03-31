export type NavigationKey =
  | "home"
  | "mitwirkung"
  | "kontakt"
  | "impressum"
  | "datenschutz"
  | "links";

export type NavigationItem = {
  key: NavigationKey;
  label: string;
  href: string;
};
