# Projektstatus

**Stand:** 15. April 2026 (Abgleich mit Repo + lokale Builds)

## Gesamtstatus

ResQBrain befindet sich in der **frühen Implementierungsphase**: Architektur und Domain sind dokumentiert und teilweise als TypeScript-Paket umgesetzt; die **öffentliche Marketing-Website** (Next.js) ist lauffähig. **Mobile (`apps/mobile-app`):** Phase-0-Lookup ist **umgesetzt** und um **Einsatz-nahe Features** erweitert (Favoriten, Verlauf, Suche mit Ranking, Dosisrechner, Vitalreferenz, Start/Home, Einstellungen mit Bundle-Debug). **Lookup-Daten:** eingebettetes JSON unter `apps/mobile-app/data/lookup-seed/`; **optional** persistiertes Bundle in **AsyncStorage** (`lookupCache.ts`) — wird beim Start genutzt, wenn **neuer** als Embedded; nach erfolgreichem Download aus **optionaler** Bundle-URL (`bundleUpdateService` + `saveBundle`). **Optional:** Hintergrund-Update-Check bei gesetztem `EXPO_PUBLIC_LOOKUP_BUNDLE_URL` in `App.tsx`. **Nicht umgesetzt:** mandantenfähige Backend-Sync-/Release-Pipeline, Push ohne Poll, Organisationsspezifischer Content-Betrieb.

## Mobile / Phase 0 und Phase-1-nahe Features

| Aspekt | Status |
|--------|--------|
| **Datenquelle** | **JSON-Bundle** in der App: `apps/mobile-app/data/lookup-seed/` (Repo-Root `data/lookup-seed/` dient u. a. der Build-/Import-Pipeline). Laufzeitpfad: `loadLookupBundle.ts` → `loadLookupBundleWithSource()` → `contentIndex`. Zusätzlich existiert `lookupSource.ts` mit erweiterter Schichtlogik — **nicht** identisch mit dem in `App.tsx` verwendeten Startpfad. |
| **Offline (Lookup)** | Eingebettetes Bundle + Validierung; **RAM-Store** nach Auflösung. Optional: zuvor gespeichertes Bundle aus **AsyncStorage** wenn **neuer** als Embedded (`loadLookupBundleWithSource`). |
| **Persistenz / Update** | `lookupCache.ts` (`saveBundle` / `loadAndValidateBundle`); optional Remote: `bundleUpdateService.ts` + `EXPO_PUBLIC_LOOKUP_BUNDLE_URL` — **kein** vollständiges Sync-Produkt. |
| **Persistenz** | **Favoriten** und **Verlauf** über **AsyncStorage** (`src/storage/localStorage.ts` + Features) — unabhängig vom medizinischen Bundle-Inhalt. |
| **Suche** | Lokales Ranking über Label, `searchTerms`, Indikation, sekundäre Felder; Filter nach Inhaltsart. |
| **UI-Schicht** | Adapter `src/data/adapters/*` (View Models); **ohne** Kopplung an `@resqbrain/domain`. |
| **Screens (Ist)** | Start/Home, Suche, Favoriten, Verlauf, Medikamente (Liste, Detail, **Dosisrechner**), Algorithmen (Liste, Detail), **Vitalwerte-Referenz** (eigenes Stack-Screen, statische Daten). |
| **Re-Validierung Phase 0** | Weiterhin: kein produktives Multi-Tenant in der App, keine Governance-UI; Fokus Lookup + Einsatzhilfen. |

### Ist vs. bewusst offen

| Punkt | Status |
|-------|--------|
| Lookup-Bundle-Loader + `contentIndex` + Validierung | **erledigt** |
| Listen/Detail Medikament & Algorithmus | **erledigt** |
| Suchscreen + Ranking + Filter | **erledigt** |
| Start/Home mit Schnellzugriff | **erledigt** |
| Favoriten (Detail + Tab + Persistenz) | **erledigt** |
| Verlauf (Detail + Tab + Persistenz, max. 30) | **erledigt** |
| Dosisrechner (Parser-basiert, Orientierung) | **teilweise** — nur bei erkanntem mg/µg-pro-kg im Dosistext |
| Vitalwerte-Referenz (Altersgruppen) | **erledigt** (statischer Content) |
| Offline: eingebettetes Bundle + RAM | **erledigt** |
| Persistiertes Bundle (AsyncStorage), bevorzugt wenn neuer | **erledigt** (technisch; Produktions-Release-Pipeline offen) |
| HTTP-Download neuerer Bundle-JSON (eine URL, Env) | **teilweise** (`EXPO_PUBLIC_LOOKUP_BUNDLE_URL`, Hintergrund nach Start) |
| Org-spezifische / signierte Release-Verteilung, Push-Sync | **offen** |
| Navigations-Doku vs. Ist (Root-Tabs) | **Hinweis:** Root-Tabs siehe `AppNavigator.tsx` — nicht „Favoriten/Verlauf“ als eigene Tabs |

**Lokale Checks:** `pnpm mobile:verify` — siehe `docs/context/mobile-validation-checklist.md`.

## Domain

| Aspekt | Status |
|--------|--------|
| Paket `@resqbrain/domain` | Aktiv |
| `tsc -p tsconfig.json` (noEmit, ohne `*.test.ts`) | Erfolgreich (15. Apr. 2026, lokal) |
| `compile:versioning` (tsc) | Erfolgreich |
| `compile:content` (tsc) | Erfolgreich |
| `compile:governance` (tsc) | Erfolgreich |
| `compile:release` (tsc) | Erfolgreich — `src/release/**` inkl. Engine, Bundle, semantische Version, Fehler |
| Barrel-Export `src/index.ts` | Content-, Tenant-, Versioning-, Survey-, **Release**-Slices |
| Lifecycle vs. Governance | `LifecyclePermissionKey` (Lifecycle-Service) vs. `Permission` (Governance-Entity) — keine Root-Barrel-Kollision |
| `ContentEntityType` (Lifecycle) | Bezogen aus `versioning/entities/EntityType` (kein zweites `CONTENT_ENTITY_TYPES` am Lifecycle-Export) |
| Layering | Keine Website-/App-Imports im Domain-Paket (reine Domain-Logik) |
| Mandantentrennung (Organization) | Modellierung im Domain-Code zentral; Runtime-Enforcement folgt mit API/Auth |
| **Offen** | `pnpm run test:content` **scheitert** (Stand 15. Apr. 2026): Import `createAlgorithm` aus Content-Barrel fehlt / Tests veraltet — mit vereinfachtem `Algorithm` nicht lauffähig; Tests oder Exporte angleichen |

## Website

| Aspekt | Status |
|--------|--------|
| Framework | Next.js 16 (App Router) |
| Design | Figma-Migration Phase 1 abgeschlossen (8. Apr. 2026) |
| Startseite `/` | Vorhanden — 9 Sections (Figma-basiert) |
| Rechtstexte | `/impressum`, `/datenschutz` mit dedizierten `page.tsx` |
| Sektionen | HeroSection, ProblemSection, IdeaSection, StatusSection, AudienceSection, MitwirkungSection, FaqSection, ContactCtaSection, ProjectGoalSection |
| Komponentenstruktur | `apps/website/components/layout/`, `sections/`, `ui/` — neu durch Figma-Migration |
| Deployment | Vercel (`rootDirectory: "apps/website"`) — Stand 8. Apr. 2026 deployed |
| Internes Lab | `/lab/lookup` — dynamisch; für lokale Lookup-Runtime, ohne Marketing-Verlinkung |
| API (nicht Marketing) | `/api/mitwirken` — dynamisch |

## Routing

| Route | Datei | Hinweis |
|-------|-------|---------|
| `/` | `apps/website/app/page.tsx` | Static |
| `/kontakt` | `apps/website/app/kontakt/page.tsx` | Static |
| `/links` | `apps/website/app/links/page.tsx` | Static |
| `/mitwirkung` | `apps/website/app/mitwirkung/page.tsx` | Static |
| `/mitwirken` | `apps/website/app/mitwirken/page.tsx` | Static — neu (8. Apr.) |
| `/updates` | `apps/website/app/updates/page.tsx` | Static — neu (8. Apr.) |
| `/impressum` | `apps/website/app/impressum/page.tsx` | Static |
| `/datenschutz` | `apps/website/app/datenschutz/page.tsx` | Static |
| `/lab/lookup` | `apps/website/app/lab/lookup/page.tsx` | Dynamic (ƒ) — intern, lokale Lookup-API-Tests; nicht in `routes` / Footer |

**Pfade:** `apps/website/lib/routes.ts` — öffentliche Seitenrouten (keine Fragment-IDs); Lab unter `/lab/*` bewusst außerhalb.

**Footer / CTAs:** `apps/website/components/layout/footer-nav.tsx`, `lib/site/navigation.ts`, `lib/site/survey.ts`, `lib/site/content.ts`.

**Homepage-Anker:** Keine `id` auf Sektions-Wrappern; keine internen `#…`-Ziele auf `/`.

**Letzte Build-Validierung (15. Apr. 2026):** `pnpm --filter @resqbrain/domain exec tsc -p tsconfig.json --noEmit`, `compile:versioning`, `compile:release`, `pnpm build`, `pnpm --filter @resqbrain/website run typecheck`, `pnpm mobile:verify` — erfolgreich (lokal).  
**Website / Vercel:** Figma Phase 1 historisch deployed; aktuellen Deploy-Stand separat in Vercel prüfen — Lookup-Lab und API-Routen nur nach passendem Deploy sichtbar.

## Build

| Befehl | Erwartung |
|--------|-----------|
| `pnpm build` | Root baut `@resqbrain/website` (Next.js Produktionsbuild) |
| `pnpm mobile:verify` | Mobile: Typecheck, Nav-Skripte, Android-`expo export` |
| Letzter Website-Lauf (lokal, 9. Apr. 2026, EOD) | Erfolgreich (Next 16.2.1); u. a. `/`, `/impressum`, `/datenschutz`, `/lab/lookup`, `/api/mitwirken` |
| Website-Deployment (8. Apr. 2026) | ✓ Deployed auf Vercel — Figma-Migration Phase 1 (`b9a4093`) |

## Risiken

1. **Dosisrechner** basiert auf Heuristiken im Freitext — kein Ersatz für verbindliche Arzneimitteldokumentation; nutzerseitig klar gekennzeichnet in der App.  
2. **Externe Umfrage (Microsoft Forms / Office Forms)** ist im Code verlinkt; datenschutzrechtliche Einordnung und Texte auf `/datenschutz` bei produktiver Nutzung final abstimmen.  
3. **Produktions-Deployment** der Website und der Mobile-Pipeline separat planen.  
4. **Mandantentrennung** im Domain-Modell, aber ohne produktive API/Auth noch nicht end-to-end erzwungen.  
5. **expo-doctor** kann Abweichungen melden (z. B. Icon-Paket-Versionen im Monorepo) — siehe Mobile-Checkliste.

## Verweise

- Architektur: `docs/architecture/`
- Produktkontext: `docs/context/` (priorisierte Next Steps: `docs/context/12-next-steps.md`)
- Arbeitssession-Log: `docs/status/WORK_SESSION.md`
- Roadmap: `docs/roadmap/PROJECT_ROADMAP.md`
- Mobile-Validierung: `docs/context/mobile-validation-checklist.md`
