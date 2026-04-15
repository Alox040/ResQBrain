# MVP Scope

**Last Updated:** 2026-04-15

## Phase 0 Definition

Phase 0 ist als Lookup-first MVP fuer Einsatznutzung definiert:

- Algorithm Lookup
- Medication Lookup
- statische Datenbasis
  - **In der App gebündelt:** `apps/mobile-app/data/lookup-seed/` (validiert beim Laden)
  - **Repo-Build-Pipeline:** u. a. `data/lookup-seed/` (siehe Skripte/DBRD-Doku)
- Listenansicht
- Detailansicht

## Explizit ausgeschlossen in Phase 0

- keine klinisch validierte Dosierung (der Dosisrechner ist **heuristisch** aus Freitext — siehe Roadmap/Status)
- keine KI-Funktionen
- keine Organisationsverwaltung in der App-Oberflaeche
- keine Versionierungs-UI
- keine Lernlogik

## Scope-Hinweis zum Repository

Das Repository enthaelt bereits umfangreiche Domain-Bausteine fuer Governance, Versioning und Release.  
Diese gelten als vorbereitete Plattform-Basis, sind aber nicht Teil des aktuell ausgelieferten Lookup-first UI-Scope.
