import { footerNav, mainNav } from "@/lib/routes";

export const mainNavigation = [...mainNav];
export const footerNavigation = [...footerNav];

export type PublicNavigationItem = (typeof mainNavigation)[number];
