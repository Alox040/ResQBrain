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
- Priorisierte nächste Schritte: [`docs/context/12-next-steps.md`](docs/context/12-next-steps.md)  

## Current Development State

Kurzstatus (abgeglichen mit dem Repo, **31. März 2026**):

- **Aktuelle Phase:** Phase 0 (Lookup-first MVP) plus einsatznahe Erweiterungen in der Mobile-App.  
- **Implementiert im Repository:** **Mobile App** (Expo) mit lokal eingebettetem Lookup-Bundle; **Website** (Next.js App Router) unter `apps/website`.  
- **Mobile — implementiert:** Listen/Details Medikamente & Algorithmen; **Suche** mit Ranking und Inhalts-Filter; **Start/Home**; **Favoriten** und **Verlauf** (persistiert über **AsyncStorage**); **Dosisrechner** (nur bei erkanntem mg/µg-pro-kg im Dosistext); **Vitalwerte-Referenz** (statischer Screen); UI-**Adapter/View Models** für Bundle vs. Darstellung.  
- **Mobile — vorbereitet, nicht aktiv:** `lookupSource` für künftige Bundle-Schichten (cached/updated/fallback) — **ohne** Sync/Backend.  
- **Mobile — offen:** Lookup-Bundle separat auf dem Gerät aus Download/Sync; Netzwerk-Updates.  
- **Nicht im aktuellen App-Umfang:** KI, Lernlogik, Organisations-/Governance-UI, `@resqbrain/domain` in der Mobile-App.  

### Mobile — Übersicht (Ist, aus Code verifiziert)

| Bereich | Status |
|---------|--------|
| Lookup-Bundle-Loader + `contentIndex` | erledigt |
| Start / Home | erledigt |
| Medikamentenliste & -detail | erledigt |
| Algorithmenliste & -detail | erledigt |
| Suche (Ranking, Filter) | erledigt |
| Favoriten (inkl. Persistenz) | erledigt |
| Verlauf (inkl. Persistenz) | erledigt |
| Dosisrechner | teilweise (siehe Roadmap / Status) |
| Vitalwerte-Referenz | erledigt |
| Offline: eingebettetes Bundle (ohne Netz) | erledigt |
| Offline: Bundle ersetzen / aus Sync laden | offen |
| View-Model-Adapter | erledigt |
| `lookupSource` (nur embedded aktiv) | Vorbereitung erledigt / erweitern offen |

**Lokale Mobile-Prüfung:** `pnpm mobile:verify` — Details: [`docs/context/mobile-validation-checklist.md`](docs/context/mobile-validation-checklist.md).

Weitere Kontextquellen:

- [`docs/context/project-overview.md`](docs/context/project-overview.md)  
- [`docs/context/architecture.md`](docs/context/architecture.md)  
- [`docs/context/navigation.md`](docs/context/navigation.md)  
- [`docs/context/mvp-scope.md`](docs/context/mvp-scope.md)  
- [`docs/context/roadmap-status.md`](docs/context/roadmap-status.md)  
- [`docs/context/current-phase.md`](docs/context/current-phase.md)  

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
- Offline-Fität: Bundle derzeit eingebettet; Architektur für erweiterbare Quellen (`lookupSource`) angelegt  
- Rollen- und Rechtemodell an Content-Lifecycle gekoppelt  

## Repository-Struktur (Kurz)

| Pfad | Inhalt |
|------|--------|
| `docs/context/` | Produkt- und Plattformkontext (kanonisch) |
| `docs/architecture/` | Technische Architektur (kanonisch) |
| `packages/domain/` | Gemeinsames Domain-Paket (TypeScript) |
| `apps/website/` | Öffentliche Next.js-Website |
| `apps/mobile-app/` | Expo-Mobile-App (Lookup MVP + Einsatzfeatures) |
| `data/lookup-seed/` | Eingebettetes Lookup-Bundle (JSON) |

## Technische Module (Architekturüberblick)

- **Domain** — Entitäten, Lebenszyklusregeln, Invarianten  
- **Governance** — Rollen, Berechtigungen, Freigaben  
- **Versioning** — Versionen, unveränderliche Releases  
- **Tenant-Scope** — Organisation, Region, County  

Details: [`docs/architecture/system-overview.md`](docs/architecture/system-overview.md)

---

## Aktueller Stand

- Domain-Paket `packages/domain` mit mehreren TS-Teilprojekten (`compile:*`, `test:*` in `packages/domain/package.json`).  
- Website als Next.js-App mit Routen `/`, `/kontakt`, `/links`, `/mitwirkung`, `/impressum`, `/datenschutz` unter `apps/website/app`.  
- Mobile-App als Expo-Projekt mit lokalem Lookup-Bundle und AsyncStorage für Favoriten/Verlauf unter `apps/mobile-app`.  
- Root-Buildskript `pnpm build` baut laut Root-`package.json` nur `@resqbrain/website`.

## Nächste Schritte (kurz)

Siehe [**`docs/context/12-next-steps.md`**](docs/context/12-next-steps.md) und die Roadmap. Inhaltlich vorn: Bundle-Lieferung/-Persistenz über `lookupSource`, Sync-Konzept, Seed/Pilot ausbauen.

## Bekannte Risiken

- Externe Umfrage-URLs sind im Website-Code konfigurierbar (`apps/website/lib/public-config.ts`), produktiver Betriebsstatus ist **UNVERIFIED**.  
- Mandantentrennung ist im Modell angelegt, End-to-End erst mit API und Auth wirksam.  
- Deployment-Pipeline für Website und Mobile separat zu planen.  
- Dosisrechner: nur orientierend; abhängig von Dosistext-Heuristik.

## Build Status

| Befehl | Zweck |
|--------|--------|
| `pnpm --filter @resqbrain/domain run compile:versioning` | Versioning-TS isoliert prüfen |
| `pnpm --filter @resqbrain/domain run compile:content` | Content-TS isoliert prüfen |
| `pnpm build` | Website-Build (`@resqbrain/website`) |
| `pnpm mobile:verify` | Mobile: lokale Verifikations-Skripte (Typecheck/Nav/Export) |

Letzter vollständiger Website-Build: **UNVERIFIED** (in dieser Synchronisierung nicht ausgeführt).

## Website Status (Datei-/Routen-Präsenz)

| Route | Status |
|-------|--------|
| `/` | Datei vorhanden |
| `/kontakt` | Datei vorhanden |
| `/links` | Datei vorhanden |
| `/mitwirkung` | Datei vorhanden |
| `/impressum` | Datei vorhanden |
| `/datenschutz` | Datei vorhanden |

Navigation und Anker: `apps/website/lib/routes.ts`.

## Last synchronized

- 2026-03-31

## Verification basis

- `package.json` (Root), `pnpm-workspace.yaml`, `vercel.json` (Root)
- `apps/website/package.json`, `apps/website/vercel.json`, `apps/website/app/**`
- `apps/website-old/package.json`, `apps/website-old/vercel.json`
- `apps/mobile-app/package.json`, `apps/mobile-app/src/**`
- `packages/domain/package.json`, `packages/domain/src/**`
- `data/lookup-seed/**`
- `docs/context/**`, `docs/context-export/**`

## Mitmachen

Feedback, Ideen und Anforderungen sind ausdrücklich erwünscht. Das Projekt wird gemeinsam mit Anwendern aus dem Rettungsdienst weiterentwickelt.
