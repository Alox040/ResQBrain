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

Kurzstatus (abgeglichen mit dem Repo, **7. April 2026**):

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

- Domain-Paket (`@resqbrain/domain`): gesamtes `src` per `tsc -p tsconfig.json --noEmit` sowie `compile:content` / `compile:versioning` / `compile:governance` — siehe `packages/domain/package.json`. Release-Audit-Testfixture in `audit.foundation.test.ts` enthält `regionId` (Stand 7. Apr. 2026).  
- Website (Next.js 16): statische Routen `/`, `/kontakt`, `/links`, `/mitwirkung`, `/impressum`, `/datenschutz`. Umfrage-Link zentral in `apps/website/lib/site/survey.ts` (aktuell `forms.office.com`).  
- Mobile-App: Expo, Lookup-Bundle eingebettet, AsyncStorage für Favoriten/Verlauf — Details `docs/status/PROJECT_STATUS.md`.  
- Root-Build: `pnpm build` → nur `@resqbrain/website`.

## Current Status (EN)

Domain `tsc --noEmit` clean; website static routes and typecheck OK; mobile Phase-0+ per status doc. After `next build`, `next-env.d.ts` references `./.next/types/routes.d.ts` (production typed routes).

## Nächste Schritte (kurz)

Siehe [**`docs/context/12-next-steps.md`**](docs/context/12-next-steps.md) und **`docs/roadmap/PROJECT_ROADMAP.md`**. Schwerpunkt: Bundle-Persistenz / `lookupSource`, Sync-Konzept, Pilot/Seed; nach Mobile-Änderungen `pnpm mobile:verify`.

## Next Steps (EN)

Bundle persistence and `lookupSource` non-embedded layers; sync concept; API/auth boundary for tenant enforcement; align `/datenschutz` with live Office Forms survey; run `pnpm mobile:verify` when mobile code changes.

## Bekannte Risiken

- Umfrage verlinkt auf Microsoft Office Forms (`forms.office.com` in `survey.ts`) — Datenschutzhinweise und Auftragsverarbeitung bei produktivem Betrieb prüfen.  
- Mandantentrennung im Domain-Modell; Laufzeitenforcement erst mit API und Auth.  
- Deployment Website vs. Mobile separat planen.  
- Dosisrechner: nur orientierend; Dosistext-Heuristik.  
- `next-env.d.ts` kann Next-generierte Referenzen unter `.next/` enthalten — nach frischem Clone Build oder Dev einmal ausführen.

## Risks (EN)

Survey third-party (Office Forms URL in repo) DPA/privacy alignment; tenant isolation not runtime-enforced yet; dose calculator heuristic; `next-env.d.ts` path flips between dev and production Next outputs.

## Build Status

| Befehl | Zweck |
|--------|--------|
| `pnpm --filter @resqbrain/domain exec tsc -p tsconfig.json --noEmit` | Gesamtes Domain-`src` (noEmit) |
| `pnpm --filter @resqbrain/domain run compile:versioning` | Versioning-TS isoliert |
| `pnpm --filter @resqbrain/domain run compile:content` | Content-TS isoliert |
| `pnpm build` | Produktionsbuild Website |
| `pnpm --filter @resqbrain/website run typecheck` | Website `tsc --noEmit` |
| `pnpm mobile:verify` | Mobile: Typecheck, Nav, Android-Export |

**Zuletzt verifiziert:** 7. April 2026 — Domain-`tsc --noEmit`, `compile:content`, `compile:versioning`, `compile:governance`, `pnpm build`, Website-`typecheck`, Audit-Foundation-Tests erfolgreich.

## Website Status

| Route | Status |
|-------|--------|
| `/` | OK (Landing) |
| `/kontakt` | OK |
| `/links` | OK |
| `/mitwirkung` | OK (Umfrage-CTA) |
| `/impressum` | OK |
| `/datenschutz` | OK |

Routen: `apps/website/lib/routes.ts`. Footer: `apps/website/lib/site/navigation.ts` → `FooterNav`. Umfrage-URLs: `apps/website/lib/site/survey.ts`. Homepage-Sektionen ohne feste `id`-Anker (keine internen `#`-Ziele auf `/`).

## Website Status (EN)

All listed routes static; footer and CTAs wired via `navigation.ts`, `content.ts`, and `survey.ts`. No section fragment IDs on the home page.

## Mitmachen

Feedback, Ideen und Anforderungen sind ausdrücklich erwünscht. Das Projekt wird gemeinsam mit Anwendern aus dem Rettungsdienst weiterentwickelt.
