# Projekt-Überblick (Export)

**Quelle:** Analyse des Repositories `ResQBrain` (Stand Export: 31. März 2026 — Code und Konfiguration im Workspace).  
**Hinweis:** Keine Live-Deployment-Verifikation; keine Annahmen über Hosting-Zustand jenseits konfigurierter Werte.

## Projektname

**ResQBrain** (`package.json` Root: `name: "resqbrain"`; Website-Paket: `@resqbrain/website`; Mobile: `resqbrain-mobile`).

## Ziel des Projekts

- **README / Produktvision (Doku):** Mehrmandantenfähige Plattform für den Rettungsdienst: Organisationen verwalten und verteilen medizinische und operative Inhalte (Algorithmen, Medikamente, Protokolle, Leitlinien) mit Versionierung und Freigabe — domain-getrieben.
- **Aktuell im Code sichtbar:** Marketing-Website (Next.js) unter `apps/website/`; mobile **Phase-0-Lookup-App** (Expo) unter `apps/mobile-app/` mit eingebettetem JSON-Bundle aus `data/lookup-seed/` (Medikamente + Algorithmen, keine API). Zusätzlich **`apps/website-old/`** als ältere Website-Kopie mit eigenem `package.json` (nicht Ziel des Root-`pnpm build`).

## Aktuelle Phase

- **README (`Current Development State`):** „Phase 0 (Lookup-first MVP)“.
- **`docs/context/`-Pfade im README** verweisen u. a. auf `docs/context/04-mvp-scope.md` (MVP-Grenzen; Datum im Repo je nach Datei).
- **Zentrale `stageLabel` in `apps/website`** (früher `lib/site.ts`): in der aktiven Website **nicht** mehr unter diesem Pfad; öffentliche Konstanten u. a. in `apps/website/lib/site-content.ts`, Routen in `lib/routes.ts`.

## Kurzer Status

| Bereich | Beleg |
|--------|--------|
| **Website** | `pnpm build` am Root baut `@resqbrain/website` erfolgreich (lokal verifiziert 31. März 2026): Next.js 16.2.1, statische Routes u. a. `/`, `/kontakt`, `/links`, `/mitwirkung`, `/impressum`, `/datenschutz`. |
| **Mobile** | `npx tsc --noEmit` in `apps/mobile-app` ohne Fehler (lokal verifiziert 31. März 2026). |
| **Domain-Paket** | `@resqbrain/domain` mit `compile:*`- und `test:*`-Scripts in `packages/domain/package.json`; keine Root-Integration in `pnpm build`. |
| **Seed-Pipeline** | Root-Scripts `dbrd:*` in Root-`package.json` — Normalisierung/Validierung/Lookup-Seed-Build über `scripts/dbrd/`. |

## Architekturüberblick (kurz)

- **Monorepo** mit `pnpm` Workspaces (`pnpm-workspace.yaml`: `apps/*`, `packages/*`).
- **Website:** Next.js App Router unter `apps/website/app/`; Startseite komponiert `HomePageSections` aus `components/home/home-page-sections.tsx`.
- **Mobile:** React Native + Expo + React Navigation (Tabs + Native Stacks) unter `apps/mobile-app/src/`; Bundle-Load in `src/lookup/loadLookupBundle.ts`, Konsum über `src/data/contentIndex.ts`.
- **Domain:** Framework-agnostisches TypeScript-Paket `packages/domain/` (Content-, Governance-, Versioning-, Lifecycle-, Release-, Audit-, Survey-, Lookup-Submodule).
- **Phase-0-Daten:** JSON unter `data/lookup-seed/`; Mobile importiert per Pfad zum Repo-Root (`loadLookupBundle.ts`).

## Verwendete Technologien (aus `package.json` / Konfiguration)

| Bereich | Technologien (Versionen aus jeweiligen `package.json`) |
|--------|--------------------------------------------------------|
| Paketmanager | pnpm 10.8.1 |
| Node | `>=18` (Root + Website) |
| Website | Next.js ^16.2.1, React ^19.2.4, Tailwind CSS ^4.2.2 (aktives Paket ohne `lucide-react`) |
| Mobile | Expo ~54.0.33, React 19.1.0, React Native 0.81.5, React Navigation 6.x |
| Domain | TypeScript ^6.0.2 (devDependency), tsx (Tests/Skripte) |

## Monorepo-Struktur

Siehe `repo-structure.md` und `pnpm-workspace.yaml`.

## Apps + Packages (Übersicht)

| Pfad | Rolle |
|------|--------|
| `apps/website/` | Öffentliche Next.js-Website (Build-Ziel) |
| `apps/website-old/` | Ältere Website-Variante im Workspace (eigenes `package.json`, u. a. `phase11:website`, `vercel.json` mit `ignoreCommand`) |
| `apps/mobile-app/` | Expo-Mobile-App (Lookup MVP / Phase 0) |
| `packages/domain/` | Gemeinsames Domain-Paket (`@resqbrain/domain`) |

## Wichtigste Features (im Code vorhanden)

- **Website:** Landing über `HomeHero`, `SurveyInviteSection`, `ProblemBenefitsSection`, `FeaturesOverviewSection`, `AudiencesSection`, `PilotFeedbackSection`, `CollaborationSection`, `FaqSection` (Reihenfolge laut `home-page-sections.tsx`); Rechtstexte und statische Seiten unter den genannten Routen.
- **Mobile:** Tabs Start, Suche, Medikamente (Liste + Detail), Algorithmen (Liste + Detail); Suche per `includes()` über Bundle-Texte; Daten aus `loadLookupBundle()` / `contentIndex.ts`.
- **Seed-Daten:** `data/lookup-seed/manifest.json`, `medications.json` (**2** Einträge mit `"id"`), `algorithms.json` (**2** Einträge) — Stand Export.
- **DBRD-Normalisierung:** TypeScript-Schema + Beispiele unter `data/schemas/`; Build-Zusammenführung über `scripts/dbrd/` (siehe Root-Scripts).

## Geplante Features (Dokumentation, nicht als vollständige Code-Umsetzung im MVP-UI)

- **`docs/context/04-mvp-scope.md`:** Offline mit Synchronisation, Ziel „unter 3 Sekunden“, Pilot-Wache — teils als Produktziel formuliert (Abgleich mit RAM-Bundle im Code).
- **`docs/context/12-next-steps.md` / README:** Seed-Ausbau, Offline-Strategie, API/Auth-Grenzen — je nach Dokumentationsstand.
- **`docs/roadmap/PROJECT_ROADMAP.md`:** Phase 1–4 teils `[–]` zurückgestellt.

## Bekannte Probleme / Inkonsistenzen (faktenbasiert)

- **`docs/status/PROJECT_STATUS.md` (28. März 2026):** Block 1 weiterhin als „Code-Umsetzung ausstehend“ — im Repo existieren `loadLookupBundle`, `contentIndex` und die genannten Screens.
- **`docs/roadmap/PROJECT_ROADMAP.md`:** Phase-0-Mobile-Checkboxen teils `[ ]`, obwohl Listen/Details/Suche und Bundle im Code vorhanden sind.
- **`README.md`:** Tabellen nennen teils nur drei Website-Routen und „fehlende MVP-Screens“; Build-Output und Mobile-Code weichen davon ab.
- **Root:** Zusätzlich `app/page.tsx`, `components/` am Repository-Root — nicht Teil von Root-`pnpm build`.
