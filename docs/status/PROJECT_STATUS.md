# ResQBrain Projektstatus

Stand: 25. April 2026

## Aktueller Gesamtstatus

ResQBrain steht weiterhin stabil als Lookup-first MVP. Der Build-Pfad der Website ist gruen, die Domain-Versionierung ist isoliert kompilierbar, und die rechtlichen Kernrouten sind im App-Router vorhanden.

## Domain Status

- **PASS:** `pnpm --filter domain run compile:versioning` erfolgreich.
- **PASS:** Exporte in `packages/domain/src/index.ts` sind konsistent (`shared`, `tenant`, `content`, `governance`, `lifecycle`, `versioning`, `release`).
- **PASS:** Keine belegten Cross-Layer-Imports aus UI/Framework in `packages/domain/src`.
- **PASS:** Tenant-Safety bleibt strukturell erhalten (Tenant-Policies und Org-Scopes unveraendert).
- **WARN:** Globales `pnpm exec tsc --noEmit` faellt, primaer durch `tmp/figma/*.tsx` (JSX/fehlende Module), nicht durch Domain-Core.

## Website Status

- **PASS:** `pnpm build` erfolgreich (`next build`, TypeScript-Phase im Build gruen).
- **PASS:** Route-Dateien fuer `/`, `/impressum`, `/datenschutz` vorhanden.
- **PASS:** Footer-Links auf `/impressum`, `/datenschutz`, `/kontakt` sind vorhanden und valide.
- **PASS:** Hero- und Mitwirkung-CTAs zeigen auf bestehende interne Routen bzw. externe Survey-URL.
- **WARN:** Keine dedizierte `SurveysSection`-Komponente vorhanden; Umfragefunktion liegt in `HeroSection` und `MitwirkungSection`.

## Routing Status

- **PASS:** Build-Routenliste enthaelt `/`, `/impressum`, `/datenschutz` (kein 404-Hinweis im Build).
- **PASS:** Keine fehlenden Imports in den geprueften Route-Dateien.
- **PASS:** Keine kaputten internen Anchor-Links festgestellt (keine aktiven `#...`-Spruenge im geprueften Landing-Pfad).

## Build Status

- **PASS:** `pnpm build` erfolgreich.
- **WARN:** `pnpm exec tsc --noEmit` global nicht gruen wegen Artefakten unter `tmp/figma/`.

## Risiken

1. Globale TypeScript-Validierung ist aktuell nicht als Clean-Gate nutzbar, solange `tmp/figma` in den Scope faellt.
2. Mobile-App wurde heute nicht mit `pnpm mobile:verify` gegengeprueft; Navigationaenderungen liegen aber als geaenderte Dateien vor.
3. Zwei parallele Aufgabenfelder (Mobile UI-Anpassungen und Website Header-Anpassung) sind im Working Tree offen und ungepusht.
