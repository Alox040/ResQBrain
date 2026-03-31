# Roadmap Status

**Last Updated:** 2026-03-31

## Phase 0 Status

Gesamtbewertung: **in Arbeit**

## Verifiziert umgesetzt (Repository-basiert)

- Architektur- und Terminologie-Basis dokumentiert (`docs/architecture/*`, `docs/context/*`)
- Website unter `apps/website` mit Routen `/`, `/kontakt`, `/links`, `/mitwirkung`, `/impressum`, `/datenschutz`
- Mobile Navigation und Lookup-Flow mit Home, Search, Favoriten, Medikamenten- und Algorithmus-Stacks
- Mobile Features: Favoriten/Verlauf (AsyncStorage), Dosisrechner, Vitalwerte-Referenz
- Domain-Paket `@resqbrain/domain` mit `compile:*` und `test:*` Skripten

## Teilweise umgesetzt

- Offline-Ansatz: eingebettetes Lookup-Bundle vorhanden; persistentes Bundle-Update/Sync fehlt
- `lookupSource`-Schichten vorbereitet, derzeit nur embedded-Quelle aktiv

## Offen / nicht verifiziert als produktiv

- produktive API/Auth-Schicht fuer echten Multi-Tenant-Runtime-Betrieb
- operativer Release-/Distribution-Flow ausserhalb von Domain-Modellen
- Survey-Datenpipeline in produktiver Form
- produktiver Deployment-Status (Website/Mobile) ist **UNVERIFIED**

## Last synchronized

- 2026-03-31

## Verification basis

- `apps/website/app/**`, `apps/website/package.json`, `apps/website/vercel.json`
- `apps/mobile-app/src/**`, `apps/mobile-app/package.json`
- `packages/domain/package.json`, `packages/domain/src/**`
- `data/lookup-seed/**`
