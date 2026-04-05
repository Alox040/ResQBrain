# Deployment & Build (Export)

**Letzte Verifikation (Export):** 5. April 2026 — `pnpm build` (Root) Exit 0 (Next.js 16.2.1); `pnpm exec tsx scripts/validate-content-isolation.ts` Exit 0; `pnpm exec tsx scripts/validate-routing.ts` Exit 1; `npx tsc --noEmit` in `apps/mobile-app` Exit 2.

## Vercel (aktive Website)

- **Repository-Root:** `vercel.json` — `framework: "nextjs"`, `rootDirectory: "apps/website"`, `installCommand: "pnpm install"`, `buildCommand: "pnpm --filter @resqbrain/website build"`, `outputDirectory: "apps/website/.next"`.
- **App-Ordner:** `apps/website/vercel.json` — `framework`, `installCommand`, `buildCommand` (kein `rootDirectory`, kein `ignoreCommand` in dieser Datei).
- **`apps/website-v2/`:** im aktuellen Repository **nicht** vorhanden (kein separates `vercel.json` dafür).

## Vercel (Legacy-Kopie)

- **`apps/website-old/vercel.json`:** `ignoreCommand` → `node ../../scripts/vercel-ignore.js`.
- **`scripts/vercel-ignore.js`:** Exit **0** = Build ignorieren, wenn `VERCEL_GIT_COMMIT_REF` nicht in `{main, master}`; Exit **1** = Build nicht ignorieren. Kommentar: Ignore Step vor Dependency-Install.

## Expo (Mobile)

- **Projekt:** `apps/mobile-app/`.
- **`app.json`:** Expo-Metadaten (Name, Slug, Icons, Splash).
- **`metro.config.js`:** `watchFolders` enthält Monorepo-Root, damit Imports aus `data/lookup-seed/` aufgelöst werden können.

## Build-Befehle (aus `package.json`)

| Ort | Befehl | Wirkung |
|-----|--------|---------|
| Repo-Root | `pnpm build` | `pnpm --filter @resqbrain/website build` → `next build` |
| Repo-Root | `pnpm build:website` | identisch zu `build` |
| Repo-Root | `pnpm render:website-status` | `tsx scripts/status/render-website-status.ts` |
| Repo-Root | `pnpm mobile:verify` | `pnpm --filter resqbrain-mobile run verify:local` — bricht aktuell an `tsc --noEmit` ab (Exit 2) |
| Repo-Root | `pnpm mobile:verify:doctor` | `pnpm --filter resqbrain-mobile run verify:expo-doctor` |
| Repo-Root | `pnpm dbrd:normalize` / `dbrd:normalize:medications` / `dbrd:normalize:algorithms` | `tsx scripts/dbrd/index.ts` (Teilmengen) |
| Repo-Root | `pnpm dbrd:validate-normalized` | DBRD-Normalisierung validieren |
| Repo-Root | `pnpm dbrd:build-lookup-seed` | Lookup-Seed aus Pipeline erzeugen |
| Repo-Root | `pnpm dbrd:build` | `validate-normalized` + `build-lookup-seed` |
| `apps/website` | `pnpm dev` / `build` / `start` / `typecheck` | Next.js / tsc |
| `apps/website-old` | `pnpm run phase11:website` | laut `apps/website-old/package.json` (Validierung + Build dieser Kopie) |
| `apps/mobile-app` | `pnpm start` | `expo start` |
| `apps/mobile-app` | `pnpm run export:android` / `export:ios` | `expo export` → `dist-validation` / `dist-validation-ios` |
| `packages/domain` | `compile:*`, `test:*` | Mehrere `tsc`-Projekte und `tsx --test` |

## Scripts (Auswahl, `scripts/`)

- `dbrd/` — Normalisierung, Seed-Build, Validierung (siehe `scripts/dbrd/README.md`).
- `vercel-ignore.js` — primär relevant für `website-old` (siehe oben).
- `validate-routing.ts`, `validate-content-isolation.ts` — **nicht** in `apps/website/package.json` verdrahtet; Aufruf per `pnpm exec tsx` vom Repo-Root.
- Zusätzliche Hilfsskripte (ohne Root-`package.json`-Eintrag): u. a. `validate-algorithms.ts`, `import-dbrd.ts`, `transform-algorithms.ts`, `cleanup-algorithms.ts`.
- `status/` — Render- und Sammelskripte für Statusdokumente.
- `check-german-umlauts.ts`.

## CI / Pipeline (Repo)

- Keine Workflow-Dateien unter `.github/workflows/` und keine `.gitlab-ci*.yml` (Suche Stand Export).

## Ignore Steps (Zusammenfassung)

- **Vercel:** Branch-Whitelist nur wenn `ignoreCommand` gesetzt — für **`apps/website`** in-repo **nicht** gesetzt; für **`apps/website-old`** gesetzt.

## Verifizierte lokale Läufe (5. April 2026)

- **`pnpm build` (Root):** Exit 0, Next.js 16.2.1 (Turbopack), statische Routen wie in CLI-Ausgabe.
- **`npx tsc --noEmit` (`apps/mobile-app`):** Exit **2** — u. a. `ResolvedLookupBundle` ohne Property `version` in `App.tsx`; `AppPalette` ohne `onPrimary` in `HomeScreen.tsx`; `TYPOGRAPHY` ohne `caption` in `SettingsScreen.tsx`.
- **`pnpm exec tsx scripts/validate-routing.ts`:** Exit **1** — Skript erwartet u. a. Dateien `home-hero.tsx`, `survey-invite-section.tsx`, … unter `apps/website/components/sections/`; aktuelle Startseite nutzt andere Komponentennamen und `app/page.tsx`.
- **`pnpm exec tsx scripts/validate-content-isolation.ts`:** Exit **0** — „Content isolation: PASS“.

## Bekannte Deploy-/Struktur-Themen (faktenbasiert)

- **Root `pnpm build` baut nicht die Mobile-App** — nur `@resqbrain/website`.
- Kanonisches Website-Ziel: **`apps/website`**; zusätzlich **`apps/website-old`**, **`apps/website-pre-v2-backup`** (nicht im `pnpm-workspace.yaml`) sowie Root-`app/` / `components/`.
