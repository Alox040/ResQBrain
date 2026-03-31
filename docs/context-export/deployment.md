# Deployment & Build (Export)

## Vercel (aktive Website)

- **Repository-Root:** `vercel.json` — `framework: "nextjs"`, `rootDirectory: "apps/website"`, `installCommand: "pnpm install"`, `buildCommand: "pnpm --filter @resqbrain/website build"`, `outputDirectory: "apps/website/.next"`.
- **App-Ordner:** `apps/website/vercel.json` — `framework`, `installCommand`, `buildCommand` (kein `rootDirectory`, kein `ignoreCommand` in dieser Datei).

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
| Repo-Root | `pnpm dbrd:normalize` / `dbrd:normalize:medications` / `dbrd:normalize:algorithms` | `tsx scripts/dbrd/index.ts` (Teilmengen) |
| Repo-Root | `pnpm dbrd:validate-normalized` | DBRD-Normalisierung validieren |
| Repo-Root | `pnpm dbrd:build-lookup-seed` | Lookup-Seed aus Pipeline erzeugen |
| Repo-Root | `pnpm dbrd:build` | `validate-normalized` + `build-lookup-seed` |
| `apps/website` | `pnpm dev` / `build` / `start` / `typecheck` | Next.js / tsc (Skripte laut `apps/website/package.json`) |
| `apps/website-old` | `pnpm run phase11:website` | `validate:routing` + `validate:isolation` + `build` (laut dieser Package-Datei) |
| `apps/mobile-app` | `pnpm start` | `expo start` |
| `apps/mobile-app` | `pnpm run export:android` / `export:ios` | `expo export` → `dist-validation` / `dist-validation-ios` |
| `packages/domain` | `compile:*`, `test:*` | Mehrere `tsc`-Projekte und `tsx --test` |

## Scripts (Auswahl, `scripts/`)

- `dbrd/` — Normalisierung, Seed-Build, Validierung (siehe `scripts/dbrd/README.md`).
- `vercel-ignore.js` — siehe oben (primär relevant für `website-old` oder manuelle Vercel-Konfiguration).
- `validate-routing.ts`, `validate-content-isolation.ts` — weiterhin im Repo; **aktives** `apps/website/package.json` referenziert sie **nicht** (Bindung über `website-old` oder `pnpm exec`).
- `status/` — Render- und Sammelskripte für Statusdokumente.
- Root `scripts/check-german-umlauts.ts`.

## CI / Pipeline (Repo)

- Keine Workflow-Dateien unter `.github/workflows/` und keine `.gitlab-ci*.yml` im Repository (Suche 31. März 2026: 0 Treffer).

## Ignore Steps (Zusammenfassung)

- **Vercel:** Branch-Whitelist nur wenn `ignoreCommand` gesetzt ist — für **`apps/website`** in-repo **nicht** gesetzt; für **`apps/website-old`** gesetzt.

## Verifizierte lokale Läufe (31. März 2026)

- **`pnpm build` (Root):** Exit 0, Next.js 16.2.1.
- **`npx tsc --noEmit` (`apps/mobile-app`):** Exit 0.
- **`pnpm exec tsx scripts/validate-routing.ts`:** Exit **1** — Ausgabe vermisst u. a. erwartete Footer-/Hero-/CTA-Muster (alte Komponentennamen wie `HeroSection`, `CTASection`).
- **`pnpm exec tsx scripts/validate-content-isolation.ts`:** Exit **1** — u. a. „unerwartete“ Routen `/kontakt`, `/links`, `/mitwirkung`; Check „Root = apps/website“ meldet Abweichung bzgl. `vercel.json`-Erwartung.

## Bekannte Deploy-/Struktur-Themen (faktenbasiert)

- **Root `pnpm build` baut nicht die Mobile-App** — nur `@resqbrain/website`.
- Mehrere Website-Bäume: kanonisch für Root-Build ist **`apps/website`**; **`apps/website-old`** und Root-`app/`/`components/` sind zusätzlich vorhanden.
