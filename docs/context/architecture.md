# Architecture

**Last Updated:** 2026-03-27

## App Struktur

Monorepo mit PNPM Workspaces:

- `apps/mobile-app`: Expo/React-Native App (Lookup-UI)
- `apps/website`: Next.js Website (Landing + Legal)
- `packages/domain`: Domain-Module und Regeln als TypeScript-Paket
- `docs/architecture`: kanonische Zielarchitektur

Zusatzverzeichnisse wie `app/`, `components/`, `src/`, `backend/`, `data/`, `content/` sind aktuell nicht die primaeren produktiven Implementierungspfade.

## Domain Layer

`packages/domain/src` enthaelt:

- `content`
- `tenant`
- `governance`
- `versioning`
- `release`
- `lifecycle`
- `survey`
- `audit`
- `lookup`

Der Domain-Layer ist framework-agnostisch aufgebaut und exportiert Entitaeten, Policies, Invarianten und Tests ueber `packages/domain/src/index.ts`.

## UI Layer

- **Mobile UI:** Lookup-first Screens fuer Home, Suche, Medikamentenliste/-detail, Algorithmusliste/-detail
- **Website UI:** Informationsseiten fuer Projektkommunikation

Keine produktive Admin-/Authoring-UI fuer Governance oder Versioning vorhanden.

## Navigation Layer

In `apps/mobile-app/src/navigation/AppNavigator.tsx`:

- Bottom Tabs als Root-Navigation
- nested Stacks fuer Medikamente und Algorithmen
- typed Param-Listen fuer Detailnavigation

## Datenfluss

Aktuell:

- Screens beziehen Daten aus lokalen Mock-Dateien
- keine API-Anbindung
- kein Backend-Read/Write-Flow
- keine persistente Produktionsdatenquelle

Zielbild laut Architektur-Dokumenten:

- tenant-scope-basierte Domain-Operationen
- approval-/release-gesteuerte Content-Flows
- versionierte Releases als verteilte Artefakte

## Versionierung (vorhanden / nicht vorhanden)

- **Vorhanden (Domain):** Versioning-Entitaeten, Invarianten, Tests im Paket `@resqbrain/domain`
- **Nicht vorhanden (App-UI):** keine Versioning-Oberflaeche im mobilen Frontend

## Release Engine (vorhanden / nicht vorhanden)

- **Vorhanden (Domain):** Release-Modelle und Tests (`release.engine.test.ts`, `ReleaseEngine.ts`)
- **Nicht vorhanden (Runtime):** keine produktive Backend-Release-Pipeline und keine operative Distribution
