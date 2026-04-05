# Bekannte Themen / Abweichungen (Export, nachweisbar)

Nur Einträge mit **konkretem Repo-Beleg**; keine Vermutungen über externe Systeme. **Verifikation:** 5. April 2026 (siehe `deployment.md`).

## Dokumentation vs. Code

- **Roadmap/Status/README:** können hinter schnellen Codeänderungen zurückbleiben; erneuter Export empfohlen nach größeren Änderungen.
- **Umfrage:** aktive Website nutzt **`apps/website/lib/site/survey.ts`** (Platzhalter `https://example.com/survey`). **`public-config.ts`** / **`resolveSurveyLink()`** unter `apps/website` **nicht** vorhanden (Repo-Suche).

## Repository-Struktur / Website

- **Workspace:** `pnpm-workspace.yaml` listet nur `apps/mobile-app`, `apps/website`, `packages/*` — **`apps/website-old`** und **`apps/website-pre-v2-backup`** sind **keine** Workspace-Mitglieder, besitzen aber jeweils eigenes `package.json` (beide mit Name `@resqbrain/website` in der Backup-/Alt-Kopie).
- **Root `tsconfig.json`:** `extends: "expo/tsconfig.base"` — atypisch für Root ohne Expo-App im Root-`package.json`.

## Build / CI / Validierung

- **Keine CI-Konfiguration** unter `.github/` oder `.gitlab-ci*.yml` (Stand Export).
- **`scripts/validate-routing.ts`:** Exit **1** — erwartet u. a. `components/sections/home-hero.tsx`, `survey-invite-section.tsx`, …; **Ist-Zustand:** `FaqSection.tsx` u. a. existieren unter anderem Namen; Startseite in `app/page.tsx`.
- **`scripts/validate-content-isolation.ts`:** Exit **0** im letzten Lauf — „Content isolation: PASS“.
- **`npx tsc --noEmit` (`apps/mobile-app`):** Exit **2** — `App.tsx`: `resolved.version` existiert nicht auf `ResolvedLookupBundle`; `HomeScreen.tsx`: `colors.onPrimary` fehlt auf `AppPalette`; `SettingsScreen.tsx`: `TYPOGRAPHY.caption` fehlt.
- **Mobile-App:** nicht Teil von Root-`pnpm build`.

## Navigation / App

- **`HistoryScreen.tsx`:** vorhanden, aber **nicht** in `AppNavigator` / `HomeStackParamList` eingetragen.
- Keine automatisierten UI-E2E-Tests für React Navigation in diesem Export nachgewiesen.

## Expo / SDK

- **Abhängigkeiten** laut `apps/mobile-app/package.json`: Expo ~54.0.33, RN 0.81.5, React 19.1.0 — Gerätelaufzeit hier nicht verifiziert.

## Encoding / Website

- **`TemporaryEncodingTest`:** unter `apps/website` nicht gefunden; Legacy ggf. unter `apps/website-old`.
- **`app/layout.tsx`:** Kommentar zu UTF-8 / einmaligem Charset-Meta durch Next.js.

## Deployment

- **`apps/website/vercel.json`:** kein `ignoreCommand` — im Gegensatz zu `apps/website-old/vercel.json`.
- **`docs/status/PROJECT_STATUS.md`:** produktives Deployment nicht aus lokalem Build allein ableitbar.

## Datenmodell-Drift

- **Phase-0 JSON + App-Typen**, **Plattform-`content/entities`**, **Domain-`lookup/entities`**, **`DbrdNormalized*`** — mehrere Modelle; Mobile hängt **nicht** an `@resqbrain/domain` (`package.json` ohne Dependency).
