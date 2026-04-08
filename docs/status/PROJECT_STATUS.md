# Projektstatus

**Stand:** 8. April 2026 (Arbeitstages-Abschluss)

## Gesamtstatus

ResQBrain befindet sich in der **frühen Implementierungsphase**: Architektur und Domain sind dokumentiert und teilweise als TypeScript-Paket umgesetzt; die **öffentliche Marketing-Website** (Next.js) ist lauffähig. **Mobile (`apps/mobile-app`):** Phase-0-Lookup ist **umgesetzt** und um **Einsatz-nahe Features** erweitert (Favoriten, Verlauf, Suche mit Ranking, Dosisrechner, Vitalreferenz, Start/Home). **Nicht umgesetzt:** synchronisiertes oder auf das Gerät heruntergeladenes Lookup-Bundle, Backend-/Sync-Pipeline.

## Mobile / Phase 0 und Phase-1-nahe Features

| Aspekt | Status |
|--------|--------|
| **Datenquelle** | **JSON-Bundle** `data/lookup-seed/` inkl. `manifest.json` — Einstieg über `lookupSource` → `loadLookupBundle` / `contentIndex`. |
| **Offline (Lookup)** | Eingebettetes Bundle, Validierung beim Laden, **RAM-Store** — **kein** separates persistiertes Bundle-File durch die App. |
| **Offline (Vorbereitung)** | `src/lookup/lookupSource.ts`: Extension Points für spätere Schichten (`cached` / `updated` / `fallback`); aktiv nur **embedded**. |
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
| Offline: Bundle nur eingebettet/RAM | **erledigt** (wie konzipiert für Phase 0) |
| Offline: Bundle auf Gerät aus Download/Sync | **offen** |
| Sync / Push-Update des Bundles | **offen** |
| `lookupSource` nicht-embedded befüllen | **offen** (API vorbereitet) |

**Lokale Checks:** `pnpm mobile:verify` — siehe `docs/context/mobile-validation-checklist.md`.

## Domain

| Aspekt | Status |
|--------|--------|
| Paket `@resqbrain/domain` | Aktiv |
| `tsc -p tsconfig.json` (gesamtes Paket, noEmit) | Erfolgreich (7. Apr. 2026); Release-Audit-Testfixture um `regionId: null` ergänzt (Typangleich an `ReleaseAuditEvent`) |
| `compile:versioning` (tsc) | Erfolgreich |
| `compile:content` (tsc) | Erfolgreich |
| `compile:governance` (tsc) | Erfolgreich |
| Barrel-Export `src/index.ts` | Konsistent mit Content-, Tenant-, Versioning- und Survey-Modulen |
| Layering | Keine Website-/App-Imports im Domain-Paket (reine Domain-Logik) |
| Mandantentrennung (Organization) | Modellierung im Domain-Code zentral; Runtime-Enforcement folgt mit API/Auth |

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

**Pfade:** `apps/website/lib/routes.ts` — nur Seitenrouten (keine Fragment-IDs).

**Footer / CTAs:** `apps/website/components/layout/footer-nav.tsx`, `lib/site/navigation.ts`, `lib/site/survey.ts`, `lib/site/content.ts`.

**Homepage-Anker:** Keine `id` auf Sektions-Wrappern; keine internen `#…`-Ziele auf `/`.

**Letzte Build-Validierung (7. Apr. 2026):** `pnpm --filter @resqbrain/domain exec tsc -p tsconfig.json --noEmit`, `compile:versioning`, `compile:content`, `compile:governance`, `pnpm build`, `pnpm --filter @resqbrain/website run typecheck`, `tsx --test src/audit/audit.foundation.test.ts` — erfolgreich.  
**Website deployed (8. Apr. 2026):** `b9a4093 final figma website deploy` — Vercel.

## Build

| Befehl | Erwartung |
|--------|-----------|
| `pnpm build` | Root baut `@resqbrain/website` (Next.js Produktionsbuild) |
| `pnpm mobile:verify` | Mobile: Typecheck, Nav-Skripte, Android-`expo export` |
| Letzter Website-Lauf (lokal, 7. Apr. 2026) | Erfolgreich (Next 16.2.1), 8/8 statische Seiten |
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
