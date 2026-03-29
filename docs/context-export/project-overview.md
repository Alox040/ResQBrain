# Projekt-Überblick (Export)

**Quelle:** Analyse des Repositories `ResQBrain` (Stand Export: Code und Konfiguration im Workspace).  
**Hinweis:** Keine Live-Deployment-Verifikation; keine Annahmen über Hosting-Zustand jenseits konfigurierter Werte.

## Projektname

**ResQBrain** (`package.json` Root: `name: "resqbrain"`; Website-Paket: `@resqbrain/website`; Mobile: `resqbrain-mobile`).

## Ziel des Projekts

- **README / Produktvision (Doku):** Mehrmandantenfähige Plattform für den Rettungsdienst: Organisationen verwalten und verteilen medizinische und operative Inhalte (Algorithmen, Medikamente, Protokolle, Leitlinien) mit Versionierung und Freigabe — domain-getrieben.
- **Aktuell im Code sichtbar:** Marketing-Website (Next.js) unter `apps/website/`; mobile **Phase-0-Lookup-App** (Expo) unter `apps/mobile-app/` mit eingebettetem JSON-Bundle aus `data/lookup-seed/` (Medikamente + Algorithmen, keine API).

## Aktuelle Phase

- **README:** „Phase 0 (Lookup-first MVP)“.
- **`apps/website/lib/site.ts`:** `stageLabel: "Early Development"`.
- **`docs/context/04-mvp-scope.md`:** MVP-Umfang inhaltlich definiert (Medikamente, Algorithmen, Offline, schnelle Suche); Datum im Dokument: 26. März 2026.

## Kurzer Status

| Bereich | Beleg |
|--------|--------|
| **Website** | `pnpm build` am Root baut `@resqbrain/website` erfolgreich (lokal verifiziert im Export-Lauf): Next.js 16.2.1, statische Routes `/`, `/impressum`, `/datenschutz`. |
| **Mobile** | `npx tsc --noEmit` in `apps/mobile-app` ohne Fehler (lokal verifiziert). Laufzeit/Store-Deployment hier nicht geprüft. |
| **Domain-Paket** | `@resqbrain/domain` mit eigenen `compile:*`- und `test:*`-Scripts in `packages/domain/package.json`; keine Root-Integration in `pnpm build`. |

## Architekturüberblick (kurz)

- **Monorepo** mit `pnpm` Workspaces (`pnpm-workspace.yaml`: `apps/*`, `packages/*`).
- **Website:** Next.js App Router unter `apps/website/app/`.
- **Mobile:** React Native + Expo + React Navigation (Tabs + Native Stacks) unter `apps/mobile-app/src/`.
- **Domain:** Framework-agnostisches TypeScript-Paket `packages/domain/` (Content-, Governance-, Versioning-, Lifecycle-, Release-, Audit-, Survey-, Lookup-Submodule).
- **Phase-0-Daten:** JSON unter `data/lookup-seed/`; Mobile lädt per Metro-Monorepo-Watch auf Repo-Root (`apps/mobile-app/metro.config.js`).

## Verwendete Technologien (aus `package.json` / Konfiguration)

| Bereich | Technologien (Versionen aus jeweiligen `package.json`) |
|--------|--------------------------------------------------------|
| Paketmanager | pnpm 10.8.1 |
| Node | `>=18` (Root + Website) |
| Website | Next.js ^16.2.1, React ^19.2.4, Tailwind CSS ^4.2.2, lucide-react |
| Mobile | Expo ~54.0.33, React 19.1.0, React Native 0.81.5, React Navigation 6.x |
| Domain | TypeScript ^6.0.2, tsx (Tests/Skripte) |

## Monorepo-Struktur

Siehe `repo-structure.md` und `pnpm-workspace.yaml`.

## Apps + Packages (Übersicht)

| Pfad | Rolle |
|------|--------|
| `apps/website/` | Öffentliche Next.js-Website |
| `apps/mobile-app/` | Expo-Mobile-App (Lookup MVP / Phase 0) |
| `packages/domain/` | Gemeinsames Domain-Paket (`@resqbrain/domain`) |

## Wichtigste Features (im Code vorhanden)

- **Website:** Landing mit Sektionen (u. a. Hero, Umfragen, Roadmap, Problem, Lösung, Features, Use Cases, Trust, CTA, Footer) laut `apps/website/app/page.tsx`; Rechtstexte unter `/impressum`, `/datenschutz`.
- **Mobile:** Tabs Start, Suche, Medikamente (Liste + Detail), Algorithmen (Liste + Detail); Suche per `includes()` über Bundle-Texte; Daten aus `loadLookupBundle()` → `contentIndex.ts`.
- **Seed-Daten:** `data/lookup-seed/manifest.json`, `medications.json` (**2** Einträge), `algorithms.json` (**2** Einträge) — per `rg '"id":'` gezählt.

## Geplante Features (Dokumentation, nicht als vollständige Code-Umsetzung im MVP-UI)

- **`docs/context/04-mvp-scope.md`:** Offline mit Synchronisation, Ziel „unter 3 Sekunden“, Pilot-Wache als Seed — teils als Produktziel formuliert.
- **`docs/context/12-next-steps.md`:** Seed-Ausbau, Offline-Strategie, Suche, Einsatz-UI, eine Organisation fest konfiguriert.
- **`docs/roadmap/PROJECT_ROADMAP.md`:** Phase 1–4 (Rechner, Favoriten, Organisation, KI, …) überwiegend als zurückgestellt/ausstehend markiert.

## Bekannte Probleme / Inkonsistenzen (faktenbasiert)

- **`docs/status/PROJECT_STATUS.md` (28. März 2026):** Beschreibt Block 1 (Loader, `contentIndex`) noch als „Code-Umsetzung ausstehend“ — im aktuellen Code existieren `loadLookupBundle`, `contentIndex.ts` und Screens.
- **`docs/roadmap/PROJECT_ROADMAP.md`:** Checkboxen für Mobile-Detail/Suche/Seed teils `[ ]`, obwohl entsprechende Bausteine im Repository vorhanden sind.
- **Root-Verzeichnis:** Zusätzlich zu `apps/website` existieren `app/page.tsx`, `components/` — nicht Teil von `pnpm build` (siehe `deployment.md`).
