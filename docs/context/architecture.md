# Architecture

**Last Updated:** 2026-04-15

## App Struktur

Monorepo mit PNPM Workspaces (siehe Root-`package.json`):

- `apps/mobile-app`: Expo/React-Native App (Lookup-UI)
- `apps/website`: Next.js Website (Landing + Legal + interne Lab-Routen)
- `packages/domain`: Domain-Module und Regeln als TypeScript-Paket
- `docs/architecture`: kanonische Zielarchitektur

Weitere Verzeichnisse (`apps/api-local`, `apps/website-lab`, `packages/api`, `packages/application`, Root-`app/`/`components/`/`lib/`) sind **nicht** der alleinige produktive Pfad der Website — Vercel nutzt `apps/website` als Root.

## Domain Layer

`packages/domain/src` enthaelt u. a.:

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

- **Mobile UI:** Lookup-first Screens; Daten aus validiertem Lookup-Bundle (eingebettet; optional AsyncStorage-Cache; optional HTTP-Update bei Env) — siehe `docs/status/PROJECT_STATUS.md`
- **Website UI:** Informationsseiten fuer Projektkommunikation; dynamische Routen u. a. `/lab/lookup`, `/api/mitwirken`

Keine produktive Admin-/Authoring-UI fuer Governance oder Versioning vorhanden.

## Navigation Layer

In `apps/mobile-app/src/navigation/AppNavigator.tsx`:

- Root `BottomTabNavigator` mit **Start (Home-Stack)**, **Suche**, **Einstellungen**, **Medikamente** (Stack), **Algorithmen** (Stack)
- Home-Stack: `HomeMain`, `History` (Verlauf), `VitalReference`
- nested Stacks fuer Medikamente und Algorithmen (Liste -> Detail)
- Search-zu-Detail-Flows ueber die jeweiligen nested Stacks
- typed Param-Listen fuer Detailnavigation (`medicationId`, `algorithmId`)

## Phase-0-Begruendung (Ist-Zustand)

Die akzeptierte MVP-Struktur mit Root Tabs und nested Stacks ist fuer Phase 0 geeignet, weil sie:

- schnelle, klare Hauptbereiche fuer Einsatzsituationen bereitstellt
- mit lokalem Lookup-Bundle ohne Server-Zwang fuer die Basisfunktion funktioniert
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

- Mobile: Lookup-Bundle aus Embedded JSON; optional neueres persistiertes Bundle; optional Fetch einer Bundle-URL — siehe `loadLookupBundle.ts`, `lookupCache.ts`, `bundleUpdateService.ts`, `App.tsx`
- keine produktive mandantenfaehige API-Anbindung fuer Content in der App

Zielbild laut Architektur-Dokumenten:

- tenant-scope-basierte Domain-Operationen
- approval-/release-gesteuerte Content-Flows
- versionierte Releases als verteilte Artefakte

## Versionierung (vorhanden / nicht vorhanden)

- **Vorhanden (Domain):** Versioning-Entitaeten, Invarianten, Tests im Paket `@resqbrain/domain`
- **Nicht vorhanden (App-UI):** keine Versioning-Oberflaeche im mobilen Frontend

## Release Engine (vorhanden / nicht vorhanden)

- **Vorhanden (Domain):** Release-Modelle und Tests (`ReleaseEngine.ts` u. a.)
- **Nicht vorhanden (Runtime):** keine produktive Backend-Release-Pipeline und keine operative Distribution fuer die Mobile-App
