# Project Overview

**Last Updated:** 2026-03-27

## Projektziel

ResQBrain ist eine EMS-Plattform mit langfristigem Zielbild einer multi-tenant-faehigen, governance-gesteuerten Content-Verteilung (Algorithmen, Medikamente, Protokolle, Leitlinien).  
Der aktuell implementierte Produktfokus liegt auf einer schnellen Lookup-App fuer Einsatzkraefte.

## Zielgruppe

- Primaer: Rettungsdienstpersonal im Einsatz (schneller Zugriff auf Informationen)
- Sekundaer: medizinische Reviewer, Ausbildende, Organisationsverantwortliche
- Strategisch: mehrere Organisationen mit tenant-getrennter Content-Governance

## MVP Definition (aktueller Arbeitsstand)

Der MVP ist aktuell als **Lookup-first Einsatz-App** definiert:

- Medikamentensuche
- Algorithmus-Lookup
- schnelle lokale Suche
- Listen- und Detailansichten
- statische Seed-/Mock-Daten

Kein Fokus auf Governance-Workflows in der UI.

## Lookup-First Ansatz

Die aktuelle App-Struktur priorisiert:

1. Finden statt Editieren
2. Lesen statt Administrieren
3. lokale/statische Daten als Basis
4. minimalen Navigationsaufwand fuer Zeitdruck-Situationen

## Phase-0 Scope (Ist-Sicht)

- Mobile App mit Home, Search, Medication- und Algorithmus-Navigation
- Medikamentenliste mit Detailansicht aus Mock-Daten
- Algorithmusliste und einfache Detailansicht
- Website als statische Projekt-/Informationsflaeche (`/`, `/impressum`, `/datenschutz`)
- Domain-Paket mit umfangreicher Modellierung und Tests fuer tenant/governance/versioning/release

## Bewusst NICHT enthalten (aktuell)

- keine Dosierungsberechnung im UI
- keine KI-Assistenz
- kein produktiver Organisationsbetrieb (Login/Auth/API fehlt)
- keine Versionierungsoberflaeche in der App
- keine Lernlogik im mobilen UI
- keine produktive Offline-Sync-Engine (nur Zielbild dokumentiert)
