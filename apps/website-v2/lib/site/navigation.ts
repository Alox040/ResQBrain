import { footerNav, getRouteHref, mainNav } from "@/lib/routes";
import type { NavigationItem, NavigationKey } from "@/types/navigation";

const labels: Record<NavigationKey, string> = {
  home: "Start",
  mitwirkung: "Mitwirkung",
  kontakt: "Kontakt",
  impressum: "Impressum",
  datenschutz: "Datenschutz",
  links: "Links",
};

function toNavigationItem(key: NavigationKey): NavigationItem {
  return {
    key,
    label: labels[key],
    href: getRouteHref(key),
  };
}

export const mainNavigation: NavigationItem[] = mainNav.map(toNavigationItem);
export const footerNavigation: NavigationItem[] = footerNav.map(toNavigationItem);

export type PublicNavigationItem = NavigationItem;
