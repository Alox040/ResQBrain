# MVP Scope

**Last Updated:** 2026-03-27

## Phase 0 Definition

Phase 0 ist als Lookup-first MVP fuer Einsatznutzung definiert:

- Algorithm Lookup
- Medication Lookup
- statische Datenbasis
  - **Kanonische Phase-0 Quelle:** JSON-Bundle unter `data/lookup-seed/`
  - **TypeScript-Mock-Dateien:** nur Übergang, bis der Loader implementiert ist
- Listenansicht
- Detailansicht

## Explizit ausgeschlossen in Phase 0

- keine Berechnung (z. B. keine dynamischen Dosierungsrechner)
- keine KI-Funktionen
- keine Organisationsverwaltung in der App-Oberflaeche
- keine Versionierungs-UI
- keine Lernlogik

## Scope-Hinweis zum Repository

Das Repository enthaelt bereits umfangreiche Domain-Bausteine fuer Governance, Versioning und Release.  
Diese gelten als vorbereitete Plattform-Basis, sind aber nicht Teil des aktuell ausgelieferten Lookup-first UI-Scope.
