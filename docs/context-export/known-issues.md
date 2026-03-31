# Bekannte Themen / Abweichungen (Export, nachweisbar)

Nur Einträge mit **konkretem Repo-Beleg**; keine Vermutungen über externe Systeme.

## Dokumentation vs. Code

- **Roadmap/Status/README:** Stand 31. März 2026 sind `PROJECT_ROADMAP.md`, `PROJECT_STATUS.md` und README weitgehend an den Mobile-/Website-Code angepasst (Lookup-Funktionen, Einsatzfeatures, Routen). Restabweichungen können bei künftigen Änderungen entstehen und erfordern erneuten Export/Abgleich.
-- **Umfrage-Doku vs. Code:** README/Risiken erwähnen weiterhin, dass Umfrage-URLs Platzhalter sein können; im Code (`apps/website/lib/public-config.ts`) sind konkrete Microsoft-Forms-Links sowie eine Environment-Override-Strategie hinterlegt.

## Repository-Struktur / Website

- **Zwei aktive Website-Pfade:** Kanonisch für Root-Build ist **`apps/website/`**. Zusätzlich **`apps/website-old/`** vollständige ältere App + Root-`app/`/`components/` — nicht an Root-`pnpm build` gekoppelt.
- **Root `tsconfig.json`:** `extends: "expo/tsconfig.base"` — weiterhin atypisch für reines Monorepo-Root ohne Expo-Target im Root-`package.json`.

## Build / CI / Validierung

- **Keine CI-Konfiguration** unter `.github/` oder `.gitlab-ci*.yml` (Suche 31. März 2026).
- **`scripts/validate-routing.ts`:** Exit **1** — erwartet u. a. `HeroSection`, `CTASection`, Footer-Muster; aktive `apps/website` nutzt `HomePageSections` / andere Section-Namen.
- **`scripts/validate-content-isolation.ts`:** Exit **1** — meldet u. a. „unerwartete“ Routen `/kontakt`, `/links`, `/mitwirkung` und Check „Root = apps/website“ als **fail** bei vorhandener **`vercel.json` am Repository-Root** (laut Skriptausgabe: „Repo-Root vercel.json vorhanden“).
- **Mobile-App:** nicht Teil von Root-`pnpm build`.

## Navigation / App

- Keine automatisierten UI-Testläufe für React Navigation in diesem Export; **Typecheck** (`tsc --noEmit`) in `apps/mobile-app` war **ohne Fehler** (Lauf 31. März 2026).

## Expo / SDK

- **Abhängigkeiten** laut `apps/mobile-app/package.json`: Expo 54, RN 0.81.5, React 19.1.0 — Laufzeit auf Geräten hier nicht verifiziert.

## Encoding / Website

- **`TemporaryEncodingTest`:** nur unter **`apps/website-old/components/debug/`**, nicht unter **`apps/website`**.

## Deployment

- **`apps/website/vercel.json`:** kein `ignoreCommand` — Branch-Builds werden durch diese Datei **nicht** unterdrückt (im Gegensatz zu `apps/website-old/vercel.json`).
- **`docs/status/PROJECT_STATUS.md`:** Hinweis, dass produktives Deployment nicht aus dem täglichen Build allein folgt.

## Datenmodell-Drift

- **Phase-0 JSON + App-Typen**, **Plattform-`content/entities`**, **Domain-`lookup/entities`**, **`DbrdNormalized*`** — mehrere Modelle; Mobile hängt **nicht** an `@resqbrain/domain` (`package.json` ohne Dependency).
