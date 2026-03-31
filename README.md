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

- **Aktuelle Phase:** Phase 0 (Lookup-first MVP) **plus** umgesetzte einsatznahe Erweiterungen; Details und Legende **`[~]` teilweise** in der Roadmap.  
- **Produktiv sichtbar:** **Mobile App** (Expo): Lookup offline aus eingebettetem Bundle; **Website** (Next.js) statisch.  
- **Mobile — implementiert:** Listen/Details Medikamente & Algorithmen; **Suche** mit Ranking und Inhalts-Filter; **Start/Home**; **Favoriten** und **Verlauf** (persistiert über **AsyncStorage**); **Dosisrechner** (nur bei erkanntem mg/µg-pro-kg im Dosistext); **Vitalwerte-Referenz** (statischer Screen); UI-**Adapter/View Models** für Bundle vs. Darstellung.  
- **Mobile — vorbereitet, nicht aktiv:** `lookupSource` für künftige Bundle-Schichten (cached/updated/fallback) — **ohne** Sync/Backend.  
- **Mobile — offen:** Lookup-Bundle separat auf dem Gerät aus Download/Sync; Netzwerk-Updates.  
- **Nicht im aktuellen App-Umfang:** KI, Lernlogik, Organisations-/Governance-UI, `@resqbrain/domain` in der Mobile-App.  

### Mobile — Übersicht (Ist)

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

- Domain-Paket mit Content- und Versioning-Teilmengen; TypeScript-Kompilat über `compile:content` und `compile:versioning`.  
- Website als Next.js-App mit statischen Routen `/`, `/kontakt`, `/links`, `/mitwirkung`, `/impressum`, `/datenschutz`.  
- Mobile-App: Expo-Projekt mit lokalem Lookup-Bundle, AsyncStorage für Favoriten/Verlauf; siehe `docs/status/PROJECT_STATUS.md`.  
- Monorepo-Build am Root: `pnpm build` (baut die Website).

## Nächste Schritte (kurz)

Siehe [**`docs/context/12-next-steps.md`**](docs/context/12-next-steps.md) und die Roadmap. Inhaltlich vorn: Bundle-Lieferung/-Persistenz über `lookupSource`, Sync-Konzept, Seed/Pilot ausbauen.

## Bekannte Risiken

- Externe Umfrage-URLs sind noch nicht produktiv hinterlegt; Datenschutz-Hinweise beziehen sich auf künftige Anbieter.  
- Mandantentrennung ist im Modell angelegt, End-to-End erst mit API und Auth wirksam.  
- Deployment-Pipeline für Website und Mobile separat zu planen.  
- Dosisrechner: nur orientierend; abhängig von Dosistext-Heuristik.

## Build Status

| Befehl | Zweck |
|--------|--------|
| `pnpm --filter @resqbrain/domain run compile:versioning` | Versioning-TS isoliert prüfen |
| `pnpm --filter @resqbrain/domain run compile:content` | Content-TS isoliert prüfen |
| `pnpm build` | Produktionsbuild Website |
| `pnpm mobile:verify` | Mobile: Typecheck, Nav-Checks, Android-Bundle-Export |

Letzter vollständiger Website-Build: **erfolgreich** (Next.js 16).

## Website Status

| Route | Status |
|-------|--------|
| `/` | OK (Landing) |
| `/kontakt` | OK |
| `/links` | OK |
| `/mitwirkung` | OK |
| `/impressum` | OK |
| `/datenschutz` | OK |

Navigation und Anker: `apps/website/lib/routes.ts`.

## Mitmachen

Feedback, Ideen und Anforderungen sind ausdrücklich erwünscht. Das Projekt wird gemeinsam mit Anwendern aus dem Rettungsdienst weiterentwickelt.
