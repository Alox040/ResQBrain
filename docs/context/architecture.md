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

- Root `BottomTabNavigator` mit `Home`, `Search`, `Medication`, `Algorithm`
- nested `MedicationStack` fuer List/Detail (`MedicationList` -> `MedicationDetail`)
- nested `AlgorithmStack` fuer List/Detail (`AlgorithmList` -> `AlgorithmDetail`)
- Search-zu-Detail-Flows ueber die jeweiligen nested Stacks
- typed Param-Listen fuer Detailnavigation (`medicationId`, `algorithmId`)

## Phase-0-Begruendung (Ist-Zustand)

Die akzeptierte MVP-Struktur mit Root Tabs und nested Stacks ist fuer Phase 0 geeignet, weil sie:

- schnelle, klare Hauptbereiche fuer Einsatzsituationen bereitstellt
- mit statischen/mock-basierten Daten ohne zusaetzliche Routing-Komplexitaet funktioniert
- stabile Back-Navigation in Listen-/Detail-Flows sicherstellt
- bewusst keine Governance-/Admin-Navigation vorweg nimmt

## Abgrenzung zum langfristigen Zielbild

Die aktuelle Navigation beschreibt nur den Lookup-Use-Case der Phase 0.  
Nicht Teil des MVP-Ist-Stands sind:

- tenant- und rollengetriebene Navigationspfade
- Versioning-/Approval-/Release-orientierte Produktflaechen
- produktive Deep-Link- und Distribution-Flows

Das langfristige Zielbild bleibt in den kanonischen Architekturartefakten unter `docs/architecture` definiert und wird nicht durch die Phase-0-Navigationsentscheidung ersetzt.

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
