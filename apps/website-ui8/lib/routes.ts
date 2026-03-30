/** Statische Routen und Navigationsdaten — keine Backend-Anbindung. */

export const routes = {
  home: "/",
  kontakt: "/kontakt",
  impressum: "/impressum",
  datenschutz: "/datenschutz",
} as const;

export const mainNav = [
  { href: routes.home, label: "Start" },
  { href: `${routes.home}#leistungen`, label: "Leistungen" },
  { href: `${routes.home}#ablauf`, label: "Ablauf" },
  { href: routes.kontakt, label: "Kontakt" },
] as const;

export const footerNav = [
  { href: routes.kontakt, label: "Kontakt" },
  { href: routes.impressum, label: "Impressum" },
  { href: routes.datenschutz, label: "Datenschutz" },
] as const;

export const siteTitle = "ResQBrain";
