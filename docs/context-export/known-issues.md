# Bekannte Themen / Abweichungen (Export, nachweisbar)

Nur Einträge mit **konkretem Repo-Beleg**; keine Vermutungen über externe Systeme. **Letzte Aktualisierung:** 8. April 2026.

## Dokumentation vs. Code

- **Roadmap/Status/README:** können hinter schnellen Codeänderungen zurückbleiben; erneuter Export empfohlen nach größeren Änderungen.
- **`docs/roadmap/PROJECT_ROADMAP.md`:** Trägt Stand 7. April 2026 — Mobile-Verifikation ist seitdem lokal grün (`pnpm mobile:verify`); Doku-Zeile ggf. veraltet.

## Repository-Struktur / Website

- **Workspace:** `pnpm-workspace.yaml` listet nur `apps/mobile-app`, `apps/website`, `packages/*` — **`apps/website-old`** und **`apps/website-pre-v2-backup`** sind **keine** Workspace-Mitglieder, besitzen aber jeweils eigenes `package.json` (beide mit Name `@resqbrain/website` in der Backup-/Alt-Kopie).
- **Root `tsconfig.json`:** `extends: "expo/tsconfig.base"` — atypisch für Root ohne Expo-App im Root-`package.json`.

## Build / CI / Validierung

- **Keine CI-Konfiguration** unter `.github/` oder `.gitlab-ci*.yml` (Stand Export 8. April 2026).
- **`scripts/validate-routing.ts`:** Exit **1** — erwartet Importe von `HeroSection`, `ProblemSection`, … in `apps/website/app/page.tsx`; **Ist:** Seite importiert nur UI-Primitives und `content`, keine `*Section`-Komponenten.
- **`scripts/validate-content-isolation.ts`:** Exit **1** — `allowedRoutes` (Zeile ~16) listet nur `/`, `/kontakt`, `/links`, `/mitwirkung`, `/impressum`, `/datenschutz`; tatsächlich existieren zusätzlich **`/mitwirken`** und **`/updates`** unter `apps/website/app/`.
- **`pnpm verify`:** ruft nach erfolgreichem `pnpm build` `validate-routing` auf — bricht dort mit Exit 1 ab (`scripts/verify.ts`).
- **Mobile-App:** nicht Teil von Root-`pnpm build`; **`pnpm mobile:verify`** im Export-Lauf Exit **0**.

## Navigation / App

- **`HistoryScreen`:** in `AppNavigator` als Stack-Screen `History` registriert; `HomeStackParamList` enthält `History` (Quelltext `AppNavigator.tsx`, `homeStackParamList.ts`).
- Keine automatisierten UI-E2E-Tests für React Navigation in diesem Export nachgewiesen.

## Expo / SDK

- **Abhängigkeiten** laut `apps/mobile-app/package.json`: Expo ~54.0.33, RN 0.81.5, React 19.1.0 — Gerätelaufzeit hier nicht verifiziert.

## Encoding / Website

- **`TemporaryEncodingTest`:** unter `apps/website` nicht gefunden; Legacy ggf. unter `apps/website-old`.
- **`app/layout.tsx`:** Kommentar zu UTF-8 / einmaligem Charset-Meta durch Next.js.

## Deployment

- **`apps/website/vercel.json`:** kein `ignoreCommand` — im Gegensatz zu `apps/website-old/vercel.json`.
- **`docs/status/PROJECT_STATUS.md`:** produktives Deployment nicht aus lokalem Build allein ableitbar.

## Website-Struktur

- **Root-Level `app/`, `components/`, `lib/`:** Am Repo-Root existiert eine parallele Next.js-ähnliche Struktur. **Kein Einfluss auf Produktion** (`vercel.json` zeigt auf `apps/website`), aber Klärung sinnvoll.
- **`apps/website/figma/`:** Figma-Export als Referenz im Repo — keine produktive Nutzung im Build, erhöht Repo-Größe.

## Datenmodell-Drift

- **Phase-0 JSON + App-Typen**, **Plattform-`content/entities`**, **Domain-`lookup/entities`**, **`DbrdNormalized*`** — mehrere Modelle; Mobile hängt **nicht** an `@resqbrain/domain` (`package.json` ohne Dependency).

## Behoben (frühere Exporte, nicht mehr zutreffend)

- ~~**`npx tsc --noEmit` (`apps/mobile-app`):** Exit 2~~ — aktueller Lauf: Exit **0**.
- ~~**`HistoryScreen` nicht im Navigator**~~ — jetzt registriert (`History` im Home-Stack).
- ~~**Umfrage-URL nur `example.com`** in `survey.ts`~~ — `lib/site/survey.ts` nutzt `https://forms.office.com/r/vzHuUdFBRy` für `surveys.active.href`.
- ~~**`validate-content-isolation.ts`:** letzter Lauf PASS~~ — aktueller Lauf: **FAIL** wegen neuer Routen (siehe oben).
