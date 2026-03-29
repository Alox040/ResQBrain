# Deployment & Build (Export)

## Vercel (Website)

- **Konfiguration:** `apps/website/vercel.json` mit `ignoreCommand` → `node ../../scripts/vercel-ignore.js`.
- **Ignore-Logik:** `scripts/vercel-ignore.js` — nur Branches `main` und `master` lösen einen Build aus (Prozess-Exit 1 = nicht ignorieren; Exit 0 = ignorieren). Kommentar im Script: Ignore Step läuft vor Dependency-Install und darf keine lokalen CLIs wie `tsx` voraussetzen.

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
| `apps/website` | `pnpm dev` / `build` / `start` / `lint` | Next.js Standard |
| `apps/website` | `pnpm run phase11:website` | `validate:routing` + `validate:isolation` + `build` |
| `apps/mobile-app` | `pnpm start` | `expo start` |
| `apps/mobile-app` | `pnpm run export:android` / `export:ios` | `expo export` → `dist-validation` / `dist-validation-ios` |
| `packages/domain` | `compile:*`, `test:*` | Mehrere `tsc`-Projekte und `tsx --test` |

## Scripts (Auswahl, `scripts/`)

- `vercel-ignore.js` — siehe oben.
- `validate-routing.ts`, `validate-content-isolation.ts` — von Website `package.json` referenziert.
- Root `scripts/check-german-umlauts.ts` — TypeScript-Variante im Monorepo.
- **`apps/website/scripts/check-german-umlauts.js`** — von `pnpm run check:umlauts` in `@resqbrain/website` aufgerufen.

## CI / Pipeline (Repo)

- Keine Workflow-Dateien unter `.github/workflows/` und keine `.gitlab-ci*.yml` im Repository (Suche im Export-Lauf: 0 Treffer).

## Ignore Steps (Zusammenfassung)

- **Vercel:** Branch-Whitelist über `vercel-ignore.js` (siehe oben).

## Bekannte Deploy-/Struktur-Themen (faktenbasiert)

- **Root `pnpm build` baut nicht die Mobile-App** — nur `@resqbrain/website`.
- **Doppelte Website-Spur am Repo-Root** (`app/`, `components/`) ist nicht an den Root-Build angebunden; Risiko von Verwechslung bei manuellen Deployments, wenn nicht `apps/website` als Root Directory gesetzt ist.
- **Produktions-Deployment:** `docs/status/PROJECT_STATUS.md` weist darauf hin, dass produktives Hosting nicht aus dem täglichen Build allein folgt — im Export nicht weiter verifiziert.
</think>


<｜tool▁calls▁begin｜><｜tool▁call▁begin｜>
Glob