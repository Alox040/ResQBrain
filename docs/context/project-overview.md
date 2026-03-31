# Project Overview

**Last synchronized:** 2026-03-31

## Projektziel

ResQBrain ist eine EMS-Plattform mit Zielbild einer multi-tenant-faehigen, governance-gesteuerten Content-Verteilung.  
Im aktuell verifizierbaren Repository-Stand liegt der implementierte Fokus auf einer Lookup-first Mobile-App plus statischer Website.

## Zielgruppe

- Primaer: Rettungsdienstpersonal im Einsatz
- Sekundaer: medizinische Reviewer, Ausbildende, Organisationsverantwortliche
- Strategisch: mehrere Organisationen mit tenant-getrennter Content-Governance

## Verifizierter Implementierungsstand

- Mobile-App (`apps/mobile-app`) mit Home, Search, Favoriten, Verlauf, Medikamenten- und Algorithmus-Listen/Details.
- Dosisrechner-Screen vorhanden (`src/screens/DoseCalculatorScreen.tsx`), laut Code nur bei erkannten mg/ug-pro-kg-Hinweisen sinnvoll nutzbar.
- Vitalwerte-Referenz-Screen vorhanden (`src/features/references/VitalReferenceScreen.tsx`).
- Datenquelle in der Mobile-App: eingebettete Seed-JSON unter `data/lookup-seed/`; keine verifizierte Netzwerk-/Sync-Quelle.
- Website (`apps/website`) mit Routen `/`, `/kontakt`, `/links`, `/mitwirkung`, `/impressum`, `/datenschutz`.
- Domain-Paket (`packages/domain`) mit mehreren Compile- und Test-Skripten.

## Bewusst NICHT verifiziert als implementiert

- Produktive API/Auth-Laufzeit fuer Multi-Tenant-Betrieb.
- Produktionsreife Offline-Sync-Engine fuer medizinische Inhalte.
- Governance-/Versioning-UI in der Mobile-App.
- KI-Assistenz im App-Datenpfad.

## UNVERIFIED

- Live-Deployment-Status der Website und Mobile-Releases.
- Operativer Einsatzstatus ausserhalb des Repository-Inhalts.

## Verification basis

- `/workspace/apps/mobile-app/src/**`
- `/workspace/apps/website/app/**`
- `/workspace/data/lookup-seed/**`
- `/workspace/packages/domain/package.json`
- `/workspace/package.json`, `/workspace/vercel.json`
