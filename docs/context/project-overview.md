# Project Overview

**Last Updated:** 2026-04-15

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
- eingebettetes JSON-Bundle in der App (`apps/mobile-app/data/lookup-seed/`) mit optional persistiertem Cache und optionaler Bundle-URL (siehe `docs/status/PROJECT_STATUS.md`)

Kein Fokus auf Governance-Workflows in der UI.

## Lookup-First Ansatz

Die aktuelle App-Struktur priorisiert:

1. Finden statt Editieren
2. Lesen statt Administrieren
3. lokale Daten als Basis (eingebettetes Bundle; optional Cache / optional HTTP-Update)
4. minimalen Navigationsaufwand fuer Zeitdruck-Situationen

## Phase-0 Scope (Ist-Sicht)

- Mobile App mit Home, Search, Medication- und Algorithmus-Navigation; Root-Tabs inkl. Einstellungen; Verlauf im Home-Stack
- Medikamenten- und Algorithmuslisten mit Detailansicht aus validiertem Lookup-Bundle
- **Dosisrechner** (heuristisch aus Freitext-Dosierung) und **Vitalwerte-Referenz** (statisch) — siehe Roadmap/Status
- Website als Projekt-/Informationsflaeche (u. a. `/`, Legal, Mitwirkung, `/lab/lookup` intern)
- Domain-Paket mit Modellierung und Tests fuer tenant/governance/versioning/release (Tests teilweise nicht mit Root-`tsc` verknuepft — siehe Status)

## Bewusst NICHT enthalten (aktuell)

- keine KI-Assistenz
- kein produktiver Organisationsbetrieb (Login/Auth/API fuer Tenant-Runtime fehlt)
- keine Versionierungsoberflaeche in der App
- keine Lernlogik im mobilen UI
- keine produktive mandantenfaehige Offline-Sync-Engine (optionaler HTTP-Bundle-Fetch ist kein Sync-Produkt)
