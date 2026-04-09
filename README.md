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

Kurzstatus (abgeglichen mit dem Repo, **9. April 2026**):

- **Aktuelle Phase:** Phase 0 (Lookup-first MVP) **plus** umgesetzte einsatznahe Erweiterungen; Details und Legende **`[~]` teilweise** in der Roadmap.  
- **Produktiv sichtbar:** **Mobile App** (Expo): Lookup offline aus eingebettetem Bundle; **Website** (Next.js) — Figma-Migration Phase 1 deployed (8. Apr. 2026).  
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

- Domain-Paket (`@resqbrain/domain`): `tsc -p tsconfig.json --noEmit` prüft Produktionscode (`*.test.ts` ausgeschlossen). Zusätzlich `compile:content`, `compile:versioning`, `compile:governance`, **`compile:release`** — siehe `packages/domain/package.json`. Neues Release-Subsystem unter `src/release/` (`ReleaseBundle`, `ReleaseEngine`, Fehlerklassen). Lifecycle: `ContentEntityType` aus Versioning; `LifecyclePermissionKey` statt Namenskollision mit Governance-`Permission`.  
- Website (Next.js 16): Routen u. a. `/`, `/kontakt`, `/links`, `/mitwirkung`, `/mitwirken`, `/updates`, `/impressum`, `/datenschutz`. Umfrage-URLs zentral in `apps/website/lib/site/survey.ts` (`forms.office.com`).  
- Mobile-App: Expo, Lookup-Bundle eingebettet, AsyncStorage für Favoriten/Verlauf — Details `docs/status/PROJECT_STATUS.md`.  
- Root-Build: `pnpm build` → `@resqbrain/website`.

## Current Status (EN)

Domain root `tsc --noEmit` green for non-test sources; `compile:release` added. Website production build and typed routes OK (9 Apr. 2026). **Open:** align content entity tests (`createAlgorithm` / graph fields) with current `Algorithm` model or extend the model. After `next build`, `next-env.d.ts` may reference `./.next/types/routes.d.ts`.

## Nächste Schritte (kurz)

Siehe [**`docs/context/12-next-steps.md`**](docs/context/12-next-steps.md) und **`docs/roadmap/PROJECT_ROADMAP.md`**. Schwerpunkt: Content-Tests/Algorithm-Modell konsolidieren, Release-Modul vertiefen, Bundle-Persistenz / `lookupSource`, Root-Level-Struktur; nach Mobile-Änderungen `pnpm mobile:verify`.

## Next Steps (EN)

Reconcile `createAlgorithm` / invariant tests with `Algorithm` entity; exercise `test:release` / integration for new release slice; bundle persistence (`lookupSource`); clarify root-level duplicate `app/` tree; mobile `tsc` / `mobile:verify`; API–auth tenant enforcement.

## Bekannte Risiken

- Umfrage verlinkt auf Microsoft Office Forms (`forms.office.com` in `survey.ts`) — Datenschutzhinweise und Auftragsverarbeitung bei produktivem Betrieb prüfen.  
- Mandantentrennung im Domain-Modell; Laufzeitenforcement erst mit API und Auth.  
- Deployment Website vs. Mobile separat planen.  
- Dosisrechner: nur orientierend; Dosistext-Heuristik.  
- Domain-Unit-Tests für Content: Teilweise veraltet gegenüber schlankem `Algorithm`-Interface — gezielt beheben.  
- `next-env.d.ts` kann Next-generierte Referenzen unter `.next/` enthalten — nach frischem Clone Build oder Dev einmal ausführen.

## Risks (EN)

Survey third-party (Office Forms URL in repo) DPA/privacy alignment; tenant isolation not runtime-enforced yet; dose calculator heuristic; content tests vs. simplified Algorithm model; `next-env.d.ts` path flips between dev and production Next outputs.

## Build Status

| Befehl | Zweck |
|--------|--------|
| `pnpm --filter @resqbrain/domain exec tsc -p tsconfig.json --noEmit` | Domain-Produktions-`src` (ohne `*.test.ts`) |
| `pnpm --filter @resqbrain/domain run compile:versioning` | Versioning-TS isoliert |
| `pnpm --filter @resqbrain/domain run compile:release` | Release-Slice isoliert |
| `pnpm --filter @resqbrain/domain run compile:content` | Content-TS isoliert |
| `pnpm build` | Produktionsbuild Website |
| `pnpm --filter @resqbrain/website run typecheck` | Website `tsc --noEmit` |
| `pnpm mobile:verify` | Mobile: Typecheck, Nav, Android-Export |

**Zuletzt verifiziert:** 9. April 2026 — Domain-`tsc --noEmit`, `compile:versioning`, `compile:release`, `pnpm build` erfolgreich.  
**Website deployed:** 8. April 2026 — Figma-Migration Phase 1 (`b9a4093`).

## Website Status

**Design:** Figma-Migration Phase 1 deployed (8. Apr. 2026). Neue Komponentenstruktur: `apps/website/components/layout/`, `sections/`, `ui/`.

| Route | Status |
|-------|--------|
| `/` | OK (Landing — 9 Sections, Figma-Design; Umfrage-CTA über `content.mitwirkung.cta` → `survey.ts`) |
| `/kontakt` | OK |
| `/links` | OK (TikTok-optimiert) |
| `/mitwirkung` | OK (Umfrage-CTA) |
| `/mitwirken` | OK — neu (8. Apr. 2026) |
| `/updates` | OK — neu (8. Apr. 2026) |
| `/impressum` | OK |
| `/datenschutz` | OK |

Routen: `apps/website/lib/routes.ts`. Footer: `apps/website/components/layout/footer-nav.tsx`. Umfrage-URLs: `apps/website/lib/site/survey.ts`. Homepage-Sektionen ohne feste `id`-Anker.

## Website Status (EN)

All listed routes static; footer and CTAs wired via `navigation.ts`, `content.ts`, and `survey.ts`. No section fragment IDs on the home page.

## Mitmachen

Feedback, Ideen und Anforderungen sind ausdrücklich erwünscht. Das Projekt wird gemeinsam mit Anwendern aus dem Rettungsdienst weiterentwickelt.
