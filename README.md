# ResQBrain

ResQBrain ist eine **mehrmandantenfähige Plattform für den Rettungsdienst**: Jede Organisation verwaltet und verteilt vertrauenswürdige medizinische und operative Inhalte (Algorithmen, Medikamente, Protokolle, Leitlinien) mit **Versionierung** und **Freigabe-Status** — technisch domain-getrieben und dokumentiert in `docs/architecture/`.

## Ziel der Plattform

- organisationsspezifische Algorithmen und SOPs  
- Zugriff im Kontext der jeweiligen Organisation (Mandantentrennung)  
- optional öffentlich oder geteiltes Wissen einbindbar  
- nachvollziehbare Änderungen und Releases  
- mehrere Organisationen auf gemeinsamer technischer Basis  

## Öffentlicher Projektstatus

Aktuelle Statusdateien:

- [`docs/status/PROJECT_STATUS.md`](docs/status/PROJECT_STATUS.md)  
- [`docs/status/WORK_SESSION.md`](docs/status/WORK_SESSION.md)  
- [`docs/roadmap/PROJECT_ROADMAP.md`](docs/roadmap/PROJECT_ROADMAP.md)  

## Current Development State

Kurzstatus (automatisch aus den aktuellen Kontextdateien ableitbar):

- **Aktuelle Phase:** Phase 0 (Lookup-first MVP)
- **Produktiv sichtbar:** Mobile Lookup-Navigation + statische Website
- **MVP-Fokus:** Algorithm-/Medication-Lookup, Listen/Details, statische Daten
- **Noch offen:** Offline-Strategie, Datenvollstaendigkeit, fehlende MVP-Screens
- **Nicht im aktuellen MVP-UI:** KI, Lernlogik, Organisations-/Versionierungsoberflaeche

Kontextquellen:

- [`docs/context/project-overview.md`](docs/context/project-overview.md)
- [`docs/context/architecture.md`](docs/context/architecture.md)
- [`docs/context/navigation.md`](docs/context/navigation.md)
- [`docs/context/mvp-scope.md`](docs/context/mvp-scope.md)
- [`docs/context/roadmap-status.md`](docs/context/roadmap-status.md)
- [`docs/context/current-phase.md`](docs/context/current-phase.md)
- [`docs/context/next-steps.md`](docs/context/next-steps.md)

Repository: [https://github.com/Alox040/ResQBrain](https://github.com/Alox040/ResQBrain)

## Zielgruppe

- Rettungsdienstpersonal und Notfallsanitäter  
- Praxisanleiter und Ausbildungsstätten  
- Ärztliche Leitung Rettungsdienst  
- Organisationen und Träger  
- Pilotpartner und Feedback-Geber  

## Geplante Kernfunktionen (Auszug)

- Algorithmen- und Protokollverwaltung je Organisation  
- Medikamentenreferenzen und Leitlinien  
- strukturierte Lern- und Nachbereitungsunterstützung (langfristig)  
- Offline-Fähigkeit (Architektur vorbereitet, Engine später)  
- Rollen- und Rechtemodell an Content-Lifecycle gekoppelt  

## Repository-Struktur (Kurz)

| Pfad | Inhalt |
|------|--------|
| `docs/context/` | Produkt- und Plattformkontext (kanonisch) |
| `docs/architecture/` | Technische Architektur (kanonisch) |
| `packages/domain/` | Gemeinsames Domain-Paket (TypeScript) |
| `apps/website/` | Öffentliche Next.js-Website |

## Technische Module (Architekturüberblick)

- **Domain** — Entitäten, Lebenszyklusregeln, Invarianten  
- **Governance** — Rollen, Berechtigungen, Freigaben  
- **Versioning** — Versionen, unveränderliche Releases  
- **Tenant-Scope** — Organisation, Region, County  

Details: [`docs/architecture/system-overview.md`](docs/architecture/system-overview.md)

---

## Aktueller Stand

- Domain-Paket mit Content- und Versioning-Teilmengen; TypeScript-Kompilat über `compile:content` und `compile:versioning`.  
- Website als Next.js-App mit statischen Routen `/`, `/impressum`, `/datenschutz`.  
- Monorepo-Build am Root: `pnpm build` (baut die Website).

## Heute erledigt

- Anker-Links in Umfrage- und Feature-Bereichen auf vorhandene Section-IDs abgestimmt (`#surveys`, `#cta`).  
- Routing-Validierungsskript an die neuen Ziele angepasst.  
- Projektstatus, Arbeitssession-Log und Roadmap-Dateien aktualisiert bzw. angelegt.  
- README von Merge-Konfliktmarken bereinigt und auf Deutsch konsolidiert.

## Nächste Schritte

1. Content-Lifecycle als Domain-Services (Übergänge von `ApprovalStatus`) ausarbeiten.  
2. Content-Sourcing (Import vs. Authoring) entscheiden.  
3. API- und Authentifizierungsgrenzen spezifizieren.  
4. Organization-Kontext für alle künftigen Lese-/Schreibpfade erzwingen.

## Bekannte Risiken

- Externe Umfrage-URLs sind noch nicht produktiv hinterlegt; Datenschutz-Hinweise beziehen sich auf künftige Anbieter.  
- Mandantentrennung ist im Modell angelegt, End-to-End erst mit API und Auth wirksam.  
- Deployment-Pipeline für die Website ist separat zu planen.

## Build Status

| Befehl | Zweck |
|--------|--------|
| `pnpm --filter @resqbrain/domain run compile:versioning` | Versioning-TS isoliert prüfen |
| `pnpm --filter @resqbrain/domain run compile:content` | Content-TS isoliert prüfen |
| `pnpm build` | Produktionsbuild Website |

Letzter vollständiger Website-Build in der Abschlusssession: **erfolgreich** (Next.js 16).

## Website Status

| Route | Status |
|-------|--------|
| `/` | OK (Landing) |
| `/impressum` | OK |
| `/datenschutz` | OK |

Footer- und CTA-Links zeigen auf die obigen Routen bzw. interne Anker (`#cta`, `#features`, `#top`, `#surveys`). Validierung: `pnpm --filter @resqbrain/website run validate:routing`.

## Mitmachen

Feedback, Ideen und Anforderungen sind ausdrücklich erwünscht. Das Projekt wird gemeinsam mit Anwendern aus dem Rettungsdienst weiterentwickelt.
