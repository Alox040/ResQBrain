# Projektstatus

**Stand:** 28. März 2026

## Gesamtstatus

ResQBrain befindet sich in der **frühen Implementierungsphase**: Architektur und Domain sind dokumentiert und teilweise als TypeScript-Paket umgesetzt; die **öffentliche Marketing-Website** (Next.js) ist lauffähig und statisch vorrenderbar. **Phase 0 (Lookup-first Mobile):** Architektur- und Kontextstand ist **final dokumentiert** und **Re-validiert (PASS)**; Umsetzung **Block 1** (Seed, Loader, `contentIndex`) ist vorbereitet, im Code noch offen.

## Mobile / Phase 0 (Lookup MVP)

| Aspekt | Status |
|--------|--------|
| **Datenquelle Phase 0** | **JSON-Bundle** unter `data/lookup-seed/` inkl. `manifest.json` (`schemaVersion`, `bundleId`) — kanonisch. TS-Module unter `apps/mobile-app/src/data/` nur Übergang bis Loader. Datenform: `lookup-data-shape.md`; Ablauf: `content-seed-plan.md`. |
| **Offline-Strategie** | **Lokales/eingebettetes Bundle**, kein Remote-Zwang; Start → laden/validieren → RAM-Store + In-Memory-Suchindex; **keine Sync-Engine**. Spec: `docs/context/offline-phase0-decision.md`. |
| **Screen-Spezifikation** | **Definiert** — vier Lookup-Screens (Medikament/Algorithmus Liste + Detail): `docs/context/mobile-phase0-screens.md`. |
| **Architektur** | **Konsolidiert** — `docs/architecture/lookup-first-architecture.md` mit klarem Phase-0-Subset vs. Zielarchitektur; deckungsgleich mit Phase-0-Kontextdateien. |
| **Re-Validierung** | **Bestanden (PASS)** — Abgleich Scope, kein Sync, keine Dosierungs-/Verzweigungslogik in Phase 0, JSON als Quelle, keine Governance-UI in der App. |
| **Implementierung** | **Block 1 vorbereitet** (Anforderungen/DoD in `docs/context/next-steps-laptop-to-pc.md`): Seed + Validierung + Loader; `contentIndex` nur über Bundle (**eine** inhaltliche Quelle für Details, danach Listen/Suche/Querverweise). Code-Umsetzung ausstehend. |

## Domain

| Aspekt | Status |
|--------|--------|
| Paket `@resqbrain/domain` | Aktiv |
| `compile:versioning` (tsc) | Erfolgreich |
| `compile:content` (tsc) | Erfolgreich |
| Barrel-Export `src/index.ts` | Konsistent mit Content-, Tenant-, Versioning- und Survey-Modulen |
| Layering | Keine Website-/App-Imports im Domain-Paket (reine Domain-Logik) |
| Mandantentrennung (Organization) | Modellierung im Domain-Code unverändert zentral; Runtime-Enforcement folgt mit API/Auth |

## Website

| Aspekt | Status |
|--------|--------|
| Framework | Next.js 16 (App Router) |
| Startseite `/` | Vorhanden |
| Rechtstexte | `/impressum`, `/datenschutz` mit dedizierten `page.tsx` |
| Sektionen | Hero, Features, Umfragen, CTA, Footer u. a. |

## Routing

| Route | Datei | Hinweis |
|-------|-------|---------|
| `/` | `apps/website/app/page.tsx` | Static |
| `/impressum` | `apps/website/app/impressum/page.tsx` | Static |
| `/datenschutz` | `apps/website/app/datenschutz/page.tsx` | Static |

Interne Anker wurden auf existierende Section-IDs abgestimmt (z. B. `#feedback`, `#cta`, `#features`, `#top`). Validierung: `pnpm --filter @resqbrain/website run validate:routing`.

## Build

| Befehl | Erwartung |
|--------|-----------|
| `pnpm build` | Root baut `@resqbrain/website` (Next.js Produktionsbuild) |
| Letzter Lauf (lokal) | Erfolgreich, keine fehlenden Module |

## Risiken

1. **README-Konfliktmarken** waren im Repository vorhanden und mussten bereinigt werden — bei künftigen Merges auf einheitliche deutsche README-Pflege achten.
2. **Externe Umfrage-URLs** sind Platzhalter (z. B. `mailto` bzw. generische Hinweise); echte Survey-Links und Datenschutz-Folgen müssen vor Go-Live gesetzt werden.
3. **Produktions-Deployment** der Website ist nicht Teil des täglichen Builds; Pipeline und Hosting separat absichern.
4. **Mandantentrennung** ist im Domain-Modell angelegt, aber noch nicht durch eine produktive API mit Auth durchgängig erzwungen.

## Verweise

- Architektur: `docs/architecture/`
- Produktkontext: `docs/context/`
- Arbeitssession-Log: `docs/status/WORK_SESSION.md`
- Roadmap: `docs/roadmap/PROJECT_ROADMAP.md`
