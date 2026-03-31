# Projekt-Überblick (Export)

**Quelle:** Analyse des Repositories `ResQBrain` (Stand Export: 31. März 2026 — Code und Konfiguration im Workspace, inkl. aktualisierter Roadmap-/Status-Dokumente).  
**Hinweis:** Keine Live-Deployment-Verifikation; keine Annahmen über Hosting-Zustand jenseits konfigurierter Werte.

## Projektname

**ResQBrain** (`package.json` Root: `name: "resqbrain"`; Website-Paket: `@resqbrain/website`; Mobile: `resqbrain-mobile`).

## Ziel des Projekts

- **README / Produktvision (Doku):** Mehrmandantenfähige Plattform für den Rettungsdienst: Organisationen verwalten und verteilen medizinische und operative Inhalte (Algorithmen, Medikamente, Protokolle, Leitlinien) mit Versionierung und Freigabe — domain-getrieben.
- **Aktuell im Code sichtbar:** Marketing-Website (Next.js) unter `apps/website/`; mobile **Phase-0-Lookup-App** (Expo) unter `apps/mobile-app/` mit eingebettetem JSON-Bundle aus `data/lookup-seed/` (Medikamente + Algorithmen, keine API). Zusätzlich **`apps/website-old/`** als ältere Website-Kopie mit eigenem `package.json` (nicht Ziel des Root-`pnpm build`).

## Aktuelle Phase

- **`docs/context/current-phase.md`:** Phase 0 — Lookup App; Begründung: statische/embedded Datenquellen, kein produktives Backend/API/Auth, Fokus auf Suche/Listen/Details.
- **README (`Current Development State`):** Phase 0 (Lookup-first MVP) **plus** einsatznahe Erweiterungen in der Mobile-App (Favoriten, Verlauf, Vitalreferenz, Dosisrechner).
- **Roadmap (`docs/roadmap/PROJECT_ROADMAP.md`):** Phase 0 und Phase 1 mit aktualisierten Checkboxen ([x]/[~]/[ ]), abgeglichen mit dem Code-Stand vom 31. März 2026.

## Kurzer Status

| Bereich | Beleg |
|--------|--------|
| **Website** | `pnpm build` am Root baut `@resqbrain/website` erfolgreich (lokal verifiziert 31. März 2026): Next.js 16.2.1, statische Routes `/`, `/kontakt`, `/links`, `/mitwirkung`, `/impressum`, `/datenschutz`. |
| **Mobile** | `pnpm mobile:verify` (Root-Script, ruft `verify:local` im Paket `resqbrain-mobile` auf) sowie `tsc --noEmit` in `apps/mobile-app` ohne Fehler (lokal verifiziert 31. März 2026). |
| **Domain-Paket** | `@resqbrain/domain` mit `compile:*`- und `test:*`-Scripts in `packages/domain/package.json`; keine Root-Integration in `pnpm build`. |
| **Seed-Pipeline** | Root-Scripts `dbrd:*` in Root-`package.json` — Normalisierung/Validierung/Lookup-Seed-Build über `scripts/dbrd/`. |

## Architekturüberblick (kurz)

- **Monorepo** mit `pnpm` Workspaces (`pnpm-workspace.yaml`: `apps/*`, `packages/*`).
- **Website:** Next.js App Router unter `apps/website/app/`; Startseite komponiert `HomePageSections` aus `components/home/home-page-sections.tsx`.
- **Mobile:** React Native + Expo + React Navigation (Tabs + Native Stacks) unter `apps/mobile-app/src/`; Bundle-Load in `src/lookup/loadLookupBundle.ts`, Konsum über `src/data/contentIndex.ts`, ergänzende Einsatz-Features (Favoriten, Verlauf, Vitalreferenz, Dosisrechner).
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
| `apps/mobile-app/` | Expo-Mobile-App (Lookup MVP / Phase 0 + Einsatzfeatures) |
| `packages/domain/` | Gemeinsames Domain-Paket (`@resqbrain/domain`) |

## Wichtigste Features (im Code vorhanden)

- **Website:** Landing über `HomeHero`, `SurveyInviteSection`, `ProblemBenefitsSection`, `FeaturesOverviewSection`, `AudiencesSection`, `PilotFeedbackSection`, `CollaborationSection`, `FaqSection` (Reihenfolge laut `home-page-sections.tsx`); Rechtstexte und statische Seiten unter den genannten Routen; Umfrage-CTAs konfigurierbar über `lib/public-config.ts` / `resolveSurveyLink()`.
- **Mobile:** Tabs Start, Suche, **Favoriten**, Medikamente (Liste + Detail + **Dosisrechner**), Algorithmen (Liste + Detail); Zusatz-Screen für **Vitalwerte-Referenz** im Home-Stack; Suche mit Ranking und Inhalts-Filter (`SearchScreen`, `searchRanking.ts`); Daten aus `loadLookupBundle()` / `contentIndex.ts`; Favoriten, Verlauf und Schnellzugriff über AsyncStorage-gestützte Stores (`storage/localStorage.ts`, `favoritesStore`, `recentStore`, `historyStore`).
- **Seed-Daten (Lookup-Bundle):** `data/lookup-seed/manifest.json`, `medications.json` (**9** Einträge mit `"id"` im Stand dieses Exports), `algorithms.json` (**9** Einträge); `lookupSchema.ts` erzwingt erlaubte Keys und Schrittformate.
- **DBRD-Normalisierung:** TypeScript-Schema + Beispiele unter `data/schemas/`; Build-Zusammenführung über `scripts/dbrd/` (Root-Scripts `dbrd:*` erzeugen das Lookup-Bundle aus der Normalisierung).

## Geplante Features (Dokumentation, nicht als vollständige Code-Umsetzung im MVP-UI)

- **`docs/context/04-mvp-scope.md`:** Offline mit Synchronisation, Ziel „unter 3 Sekunden“, Pilot-Wache — im Code aktuell als eingebettetes Bundle ohne Sync umgesetzt.
- **`docs/context/12-next-steps.md` / README:** Seed-Ausbau, Offline-Strategie, API/Auth-Grenzen, Bundle-Persistenz/Synchronisation.
- **`docs/roadmap/PROJECT_ROADMAP.md`:** Phase 2–4 überwiegend `[–]` zurückgestellt (Lernfunktionen, Organisations-/Governance-UI, KI-Features); Phase-0/1-Punkte für Lookup/Favoriten/Verlauf/Vitalreferenz/Dosisrechner größtenteils auf `[x]`/`[~]` gesetzt.

## Bekannte Probleme / Inkonsistenzen (faktenbasiert)

- **Validierungsskripte:** `scripts/validate-routing.ts` und `scripts/validate-content-isolation.ts` schlagen aktuell gegen die aktive `apps/website`-Struktur fehl (erwarten ältere Komponenten-/Routennamen bzw. andere Root-Konfiguration); sie spiegeln `apps/website-old` und frühere Annahmen, nicht den aktuellen Build-Pfad mit Root-`vercel.json`.
- **Mehrere Website-Bäume:** Kanonische Site für Build/Deployment ist `apps/website`; zusätzlich existieren `apps/website-old` und Root-`app/`/`components/`, die nicht an `pnpm build` gekoppelt sind.
- **Datenmodell-Drift:** Phase-0 JSON + App-Typen, Domain-Content-Entities (`packages/domain/src/content/entities/`), Domain-`lookup/entities/` und `DbrdNormalized*`-Typen bilden parallele Modelle; Mobile hängt bewusst nicht an `@resqbrain/domain`.
