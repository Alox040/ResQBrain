# Current Phase

**Last Updated:** 2026-03-31

## Aktuelle Phase: Phase 0 (Lookup-first MVP) mit umgesetzten Einsatzfeatures

## Begruendung (repo-verifiziert)

Der aktuell sichtbare Implementierungsstand entspricht weiterhin Phase 0, weil:

- Mobile UI hat Lookup-Kernflows (Suche, Listen, Detail) fuer Medikamente/Algorithmen.
- Datenquellen in der App sind lokal eingebettet (`data/lookup-seed/*`, Import in `src/lookup/loadLookupBundle.ts`).
- keine produktive API-, Auth- oder Multi-Tenant-Runtime im App- oder Backend-Betrieb nachweisbar.
- keine aktive Lernlogik oder KI-Assistenz integriert.

Zusaetzlich sind einsatznahe Features bereits im Code vorhanden:

- Favoriten (persistiert via AsyncStorage)
- Verlauf (persistiert via AsyncStorage)
- Dosisrechner (teilweise, parser-/textabhaengig)
- Vitalwerte-Referenzscreen

Parallel existiert ein fortgeschrittenes Domain-Zielbild in `packages/domain` (Governance, Versioning, Release, Lifecycle, Survey).  
Diese Teile sind als Plattform-Fundament vorhanden, aber nicht als vollstaendiger End-to-End-Produktbetrieb in App + Backend umgesetzt.

## Last synchronized

- 2026-03-31

## Verification basis

- `apps/mobile-app/src/**`
- `apps/mobile-app/package.json`
- `data/lookup-seed/**`
- `packages/domain/src/**`
