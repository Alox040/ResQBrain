# Projektstatus

**Stand:** 25. März 2026

## Gesamtstatus

ResQBrain befindet sich in der **frühen Implementierungsphase**: Architektur und Domain sind dokumentiert und teilweise als TypeScript-Paket umgesetzt; die **öffentliche Marketing-Website** (Next.js) ist lauffähig und statisch vorrenderbar.

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

Interne Anker wurden auf existierende Section-IDs abgestimmt (z. B. `#surveys`, `#cta`, `#features`, `#top`). Validierung: `pnpm --filter @resqbrain/website run validate:routing`.

## Build

| Befehl | Erwartung |
|--------|-----------|
| `pnpm build` | Root baut `@resqbrain/website` (Next.js Produktionsbuild) |
| Letzter Lauf (lokal) | Erfolgreich, keine fehlenden Module |

## Risiken

1. **README-Konfliktmarken** waren im Repository vorhanden und mussten bereinigt werden — bei künftigen Merges auf einheitliche deutsche README-Pflege achten.
2. **Externe Umfrage-URLs** sind Platzhalter (`#surveys` bzw. generische Hinweise); echte Survey-Links und Datenschutz-Folgen müssen vor Go-Live gesetzt werden.
3. **Produktions-Deployment** der Website ist nicht Teil des täglichen Builds; Pipeline und Hosting separat absichern.
4. **Mandantentrennung** ist im Domain-Modell angelegt, aber noch nicht durch eine produktive API mit Auth durchgängig erzwungen.

## Verweise

- Architektur: `docs/architecture/`
- Produktkontext: `docs/context/`
- Arbeitssession-Log: `docs/status/WORK_SESSION.md`
- Roadmap: `docs/roadmap/PROJECT_ROADMAP.md`
