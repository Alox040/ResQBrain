# Deployment & Build (Export)

**Letzte Verifikation (Export):** 8. April 2026.  
- **`pnpm build` (Root):** Exit 0, Next.js 16.2.1, **10** statische Seiten.  
- **`pnpm --filter @resqbrain/domain exec tsc -p tsconfig.json --noEmit`:** Exit 0.  
- **`pnpm mobile:verify`:** Exit 0 (Typecheck, Nav-Skripte, `expo export` Android).  
- **`pnpm exec tsx scripts/validate-routing.ts`:** Exit 1 (Erwartung alter Section-Imports).  
- **`pnpm exec tsx scripts/validate-content-isolation.ts`:** Exit 1 (`/mitwirken`, `/updates` nicht in `allowedRoutes`).  
- **`pnpm verify`:** bricht nach erfolgreichem Build an `validate-routing` ab (Orchestrierung in `scripts/verify.ts`).

## Aktueller Deploy-Status (lokal verifizierbar, 8. April 2026)

| Komponente | Status |
|-----------|--------|
| Website (Next Production Build) | ✓ `pnpm build` grün, 10 statische Routen |
| Mobile App | Build/Verify lokal grün (`pnpm mobile:verify`); kein App-Store-Deploy in diesem Export nachgewiesen |
| Domain-Paket | Library; `tsc --noEmit` grün |
| Validierungsskripte `validate-routing` / `validate-content-isolation` | Rot — Anpassung an aktuelle Routen/Startseite ausstehend |

## Vercel (aktive Website)

- **Repository-Root:** `vercel.json` — `framework: "nextjs"`, `rootDirectory: "apps/website"`, `installCommand: "pnpm install"`, `buildCommand: "pnpm --filter @resqbrain/website build"`, `outputDirectory: "apps/website/.next"`.
- **App-Ordner:** `apps/website/vercel.json` — `framework`, `installCommand`, `buildCommand` (kein `rootDirectory`, kein `ignoreCommand`).
- **`apps/website-v2/`:** im aktuellen Repository **nicht** vorhanden; Root-Level `app/`/`components/`/`lib/` ist kein eigenständiges Vercel-Projekt.

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
| Repo-Root | `pnpm verify` | `tsx scripts/verify.ts` → `build`, dann `validate-routing`, `validate-content-isolation`, `mobile:verify` (sequentiell, Abbruch bei erstem Fehler) |
| Repo-Root | `pnpm seed:update` | `node scripts/seed-update.mjs` |
| Repo-Root | `pnpm render:website-status` | `tsx scripts/status/render-website-status.ts` |
| Repo-Root | `pnpm mobile:verify` | `pnpm --filter resqbrain-mobile run verify:local` |
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
- `verify.ts` — Gesamt-Orchestrierung (s. oben).
- `vercel-ignore.js` — primär relevant für `website-old` (siehe oben).
- `validate-routing.ts`, `validate-content-isolation.ts` — **nicht** allein grün gegen aktuellen Stand; Aufruf auch über `pnpm verify`.
- Zusätzliche Hilfsskripte (ohne alle in Root-`package.json`): u. a. `validate-algorithms.ts`, `import-dbrd.ts`, `transform-algorithms.ts`, `cleanup-algorithms.ts`.
- `status/` — Render- und Sammelskripte für Statusdokumente.
- `check-german-umlauts.ts`.

## CI / Pipeline (Repo)

- Keine Workflow-Dateien unter `.github/workflows/` und keine `.gitlab-ci*.yml` (Suche Stand Export 8. April 2026).

## Ignore Steps (Zusammenfassung)

- **Vercel:** Branch-Whitelist nur wenn `ignoreCommand` gesetzt — für **`apps/website`** in-repo **nicht** gesetzt; für **`apps/website-old`** gesetzt.

## Verifizierte lokale Läufe (8. April 2026)

- **`pnpm build` (Root):** Exit 0, Next.js 16.2.1 (Turbopack), 10 statische Seiten.
- **`npx tsc --noEmit` (`apps/mobile-app`):** Exit **0**.
- **`pnpm mobile:verify`:** Exit **0**.
- **`pnpm --filter @resqbrain/domain exec tsc -p tsconfig.json --noEmit`:** Exit **0**.
- **`pnpm exec tsx scripts/validate-routing.ts`:** Exit **1** — erwartet Importe von `HeroSection`, … in `app/page.tsx`.
- **`pnpm exec tsx scripts/validate-content-isolation.ts`:** Exit **1** — `allowedRoutes` ohne `/mitwirken`, `/updates`.

## Bekannte Deploy-/Struktur-Risiken (faktenbasiert)

| # | Thema | Status |
|---|-------|--------|
| D1 | **Root `pnpm build` baut nicht die Mobile-App** — nur `@resqbrain/website` | bekannt, kein Handlungsbedarf |
| D2 | **`pnpm verify` / Isolation / Routing-Skripte** — nicht konsistent mit neuen Routen und Startseiten-Aufbau | offen |
| D3 | **`validate-routing.ts`:** Exit 1 — Erwartungen an `*Section`-Imports in `app/page.tsx` | offen |
| D4 | **`validate-content-isolation.ts`:** Exit 1 — `allowedRoutes` muss `/mitwirken`, `/updates` enthalten oder Prüflogik ändern | offen |
| D5 | **Root-Level `app/`/`components/`/`lib/`:** Parallele Next.js-Struktur am Repo-Root; kein Vercel-Ziel | offen |
| D6 | **`next-env.d.ts`** verweist nach Build auf `.next/types/routes.d.ts` — nach Clone ohne Build ggf. fehlerhafte TS-Pfade | bekannt |
| D7 | **Externe Formular-URLs** (Umfrage, Updates): DPA/Privacy vor produktivem Betrieb prüfen | bekannt |

## Nächste Deployment-Schritte

1. **Validierungsskripte** — `allowedRoutes` und Section-Checks an aktuellen Stand anpassen, damit `pnpm verify` wieder durchläuft.
2. **Bundle-Persistenz-Konzept** abschließen — Voraussetzung für Mobile-Updates im Feld.
3. **Root-Level-Struktur bereinigen** — entweder löschen oder als formales Experiment auslagern.
4. **Expo-Produktionsbuild** — nach Wunsch Release-Kanal wählen (lokal bereits `expo export` in `mobile:verify`).
