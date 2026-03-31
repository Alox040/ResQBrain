# Bekannte Themen / Abweichungen (Export, nachweisbar)

Nur Einträge mit **konkretem Repo-Beleg**; keine Vermutungen über externe Systeme.

## Dokumentation vs. Code

- **`docs/status/PROJECT_STATUS.md` (28. März 2026):** Block 1 (Seed, Loader, `contentIndex`) als Code noch offen — **im Repo vorhanden:** `loadLookupBundle.ts`, `contentIndex.ts`, Screens.
- **`docs/roadmap/PROJECT_ROADMAP.md`:** Phase-0-Punkte Suche/Details/Seed teils `[ ]`, obwoil die zugehörigen Implementierungen in `apps/mobile-app/` existieren.
- **`README.md`:** Website-Routen-Tabelle und „fehlende MVP-Screens“ passen nicht zum Build-Output (8 statische Routen inkl. `/kontakt`, `/links`, `/mitwirkung`) und zur Mobile-App.
- **`README.md` (Risiken):** Erwähnung Platzhalter-Umfrage — **`apps/website/lib/public-config.ts`** enthält konkrete Microsoft-Forms-URLs.

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
