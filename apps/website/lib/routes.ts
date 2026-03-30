/** Statische Routen und Navigationsdaten — keine Backend-Anbindung. */

import { getSurveyPublishedUrl } from "@/lib/public-config";

export const routes = {
  home: "/",
  kontakt: "/kontakt",
  mitwirkung: "/mitwirkung",
  impressum: "/impressum",
  datenschutz: "/datenschutz",
} as const;

/**
 * Ziel für alle „Umfrage“-CTAs: öffentliche HTTPS-URL, sonst statische Hinweiseite mit Anker.
 */
export function resolveSurveyLink(): { href: string; external: boolean } {
  const url = getSurveyPublishedUrl().trim();
  if (url.length > 0 && /^https?:\/\//i.test(url)) {
    return { href: url, external: true };
  }
  return { href: `${routes.mitwirkung}#umfrage`, external: false };
}

export const mainNav = [
  { href: routes.home, label: "Start" },
  { href: `${routes.home}#mitmachen`, label: "Mitmachen" },
  { href: `${routes.home}#funktionen`, label: "Funktionen" },
  { href: `${routes.home}#zielgruppen`, label: "Zielgruppen" },
  { href: `${routes.home}#faq`, label: "FAQ" },
  { href: routes.kontakt, label: "Kontakt" },
] as const;

export const footerNav = [
  { href: routes.kontakt, label: "Kontakt" },
  { href: routes.mitwirkung, label: "Mitwirkung" },
  { href: routes.impressum, label: "Impressum" },
  { href: routes.datenschutz, label: "Datenschutz" },
] as const;

export const siteTitle = "ResQBrain";
