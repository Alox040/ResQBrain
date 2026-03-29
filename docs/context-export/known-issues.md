# Bekannte Themen / Abweichungen (Export, nachweisbar)

Nur Einträge mit **konkretem Repo-Beleg**; keine Vermutungen über externe Systeme.

## Dokumentation vs. Code

- **`docs/status/PROJECT_STATUS.md`:** Beschreibt Implementierung von Loader/`contentIndex` als ausstehend — **im Code vorhanden** (`loadLookupBundle.ts`, `contentIndex.ts`, Screens).
- **`docs/roadmap/PROJECT_ROADMAP.md`:** Mehrere Phase-0-Mobile-Punkte als `[ ]`, obwohl zugehörige Funktionen im Repository implementiert sind (Listen, Details, Suche, Bundle-Load).

## Repository-Struktur / Routing

- **Zwei Website-Spuren:** Kanonisch für Build ist `apps/website/`. Zusätzlich existieren **`/app/page.tsx`** und **`/components/`** am Repo-Root mit anderen Imports — **nicht** von Root-`pnpm build` gebaut. Risiko: falsches Root-Verzeichnis bei Hosting.
- **Root `tsconfig.json`:** `extends: "expo/tsconfig.base"` — ungewöhnlich für reines Monorepo-Root ohne eigenes Expo-App-Target im Root-`package.json`.

## Build / CI

- **Keine CI-Konfiguration** gefunden (keine `.github/workflows/*`, keine `.gitlab-ci*.yml`).
- **Mobile-App:** nicht Teil von `pnpm build` am Root — separater Expo-Workflow nötig.

## Navigation / App

- Keine automatisierten Testläufe für React Navigation in diesem Export ausgeführt; **Typecheck** (`tsc --noEmit`) in `apps/mobile-app` war **ohne Fehler** (einmaliger Lauf).

## Expo / SDK

- Keine Konfliktfälle im Export gemessen; **Abhängigkeiten** laut `apps/mobile-app/package.json`: Expo 54, RN 0.81.5, React 19.1.0 — Kombination ist fest verdrahtt; Kompatibilitätsprobleme hier nicht runtime-getestet.

## Encoding / Website

- **`lib/site.ts`:** Navigation/Metadaten nutzen ASCII-Ersatzschreibweisen (`Loesung`, `fuer` in anderen Dateien).
- **`TemporaryEncodingTest.tsx`:** Debug-Komponente mit Unicode-Escapes; **nicht** in produktiven Pages importiert (Repo-Suche nur Selbstreferenz).

## Deployment

- **Vercel `ignoreCommand`:** Builds auf Nicht-`main`/`master`-Branches werden unterdrückt — beabsichtigt laut Script-Kommentar und Logik.
- **`docs/status/PROJECT_STATUS.md`:** Hinweis, dass produktives Deployment nicht aus dem täglichen Build allein folgt.

## Datenmodell-Drift

- **Drei parallele Medikations-/Algorithmus-Modelle:** Phase-0 JSON + App-Typen, Plattform-`content/entities`, Domain-`lookup/entities` — Abgleich/Mapping ist **nicht** in der Mobile-App auf `@resqbrain/domain` umgesetzt (`package.json` ohne diese Dependency).

## README / Historie

- **`docs/status/PROJECT_STATUS.md`:** Erwähnung früherer README-Konfliktmarker — aktueller README-Zustand im Export nicht erneut auf Konfliktmarker geprüft.
