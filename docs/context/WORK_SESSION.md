# Arbeitssession — Schnappschuss (synchronisiert)

Ephemere Notiz zum aktuellen Repository-Stand.

**Ermittelt:** 2026-03-31

## Aktueller Git-Kontext (verifiziert)

| Feld | Wert |
|---|---|
| Branch | `cursor/project-context-synchronization-ad8c` |
| Letzter Commit | UNVERIFIED |
| Untracked-Dateien | UNVERIFIED |

## Repository-Struktur (Kurz, verifiziert)

- `apps/mobile-app/` (Expo)
- `apps/website/` (Next.js)
- `apps/website-old/` (Legacy-Website)
- `packages/domain/` (`@resqbrain/domain`)
- `data/lookup-seed/` (Lookup-Seed-JSON)
- `docs/context/`, `docs/context-export/`, `docs/architecture/`
- Root-`vercel.json` mit `rootDirectory: "apps/website"`

## Website / Routing (Datei-basiert verifiziert)

Routen-Dateien unter `apps/website/app/`:

- `/`
- `/kontakt`
- `/links`
- `/mitwirkung`
- `/impressum`
- `/datenschutz`

## Mobile (Datei-basiert verifiziert)

- Navigation + Tabs/Stacks in `apps/mobile-app/src/navigation/AppNavigator.tsx`.
- Screens vorhanden, u. a. `HomeScreen`, `SearchScreen`, `FavoritesScreen`, `HistoryScreen`, `Medication*`, `Algorithm*`, `DoseCalculatorScreen`, `VitalReferenceScreen`.
- Lookup-Daten aus eingebettetem Seed-Bundle (`data/lookup-seed/**`).

## Deployment / Laufzeit

- Live-Deployment-URL: **UNVERIFIED**
- Letzter erfolgreicher Produktions-Build: **UNVERIFIED**

## Hinweise

- Diese Datei ersetzt ältere, nicht mehr verifizierbare Session-Daten (z. B. früherer Branch/Commit und externe Deployment-URLs).

## Last synchronized

- 2026-03-31

## Verification basis

- `README.md`
- Root: `package.json`, `pnpm-workspace.yaml`, `vercel.json`
- `apps/website/package.json`, `apps/website/vercel.json`, `apps/website/app/**`
- `apps/website-old/package.json`, `apps/website-old/vercel.json`
- `apps/mobile-app/package.json`, `apps/mobile-app/src/**`
- `packages/domain/package.json`
