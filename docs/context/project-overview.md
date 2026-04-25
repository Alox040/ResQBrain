# project-overview

Stand: April 2026

## Ziel des Projekts

ResQBrain ist eine offline-first Lookup-App für den Rettungsdienst. Kernziel ist der schnelle, netzunabhängige Zugriff auf Medikamenten- und Algorithmen-Informationen im Einsatz. Begleitend gibt es eine öffentliche Website als Kommunikations- und Informationsfläche.

## Kernfunktionen (was existiert)

### Mobile App (`apps/mobile-app`)
- Offline-Lookup für Medikamente und Algorithmen aus eingebettetem Bundle
- Listenansichten und Detailansichten für beide Content-Typen
- Lokale Volltextsuche über alle Inhalte
- Favoriten, Verlauf (History), Zuletzt-gesehen (Recent) — persistent
- Vitalwerte-Referenz (statische Tabelle)
- Theme-Unterstützung (Hell/Dunkel)
- Expo/React Native, TypeScript

### Website (`apps/website`)
- Öffentliche Next.js-Website mit Startseite (7 Sections)
- Seiten: Mitwirkung, Mitwirken, Kontakt, Updates, Links, Impressum, Datenschutz
- Aktive Survey-Integration (forms.cloud.microsoft)
- Vercel-Deployment aus `apps/website`, Branch main

## Was NICHT gebaut ist

- `packages/domain` — Domain-Modell, Governance, Versionierung: Ordner vorhanden, kein Code
- `packages/application` — Application Services, Ports: Ordner vorhanden, kein Code
- `packages/api` — API-Adapter: Ordner vorhanden, kein Code
- Authentifizierung / Nutzerverwaltung
- Multi-Tenant-Logik / Organisationsverwaltung
- ContentPackage-Freigabe-Workflow
- Remote-Bundle-Updates (Infrastruktur vorhanden, bewusst deaktiviert für Phase-0)
- Backend-Server / produktive API
- Lern- oder Trainingsfunktionen
