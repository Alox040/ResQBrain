# Projekt-Überblick (Export)

**Quelle:** Analyse des Repositories `ResQBrain` (Stand Export: 31. März 2026, aktueller Workspace-Zustand).  
**Hinweis:** Nur Code-/Datei-basierte Fakten; keine Live-Deployment-Verifikation.

## Projektname

**ResQBrain** (`package.json` Root: `resqbrain`; Apps: `@resqbrain/website`, `@resqbrain/website-v2`, `resqbrain-mobile`).

## Ziel des Projekts

- Mehrmandantenfähige EMS-Plattform mit versionierten/freigegebenen Inhalten (Dokumentationsbasis unter `docs/context` und `docs/architecture`).
- Im Code aktuell sichtbar: Mobile Lookup-App (`apps/mobile-app`) plus zwei Website-Apps (`apps/website`, `apps/website-v2`) sowie Legacy-Kopie (`apps/website-old`).

## Aktuelle Phase

- `docs/context/current-phase.md` und `README.md` führen weiterhin **Phase 0 (Lookup-first MVP)** mit umgesetzten Einsatzfeatures.
- Codebasiert bestätigt: Lookup-Bundle lokal eingebettet (`data/lookup-seed`), kein produktiver API/Auth-Datenpfad in der Mobile-App.

## Kurzer Status

| Bereich | Beleg |
|--------|--------|
| **Website (Root-Buildziel)** | Root-`build` nutzt `pnpm --filter @resqbrain/website build`; Root-`vercel.json` setzt `rootDirectory: "apps/website"`. |
| **Website-v2** | Eigenes Paket `@resqbrain/website-v2` mit separatem `vercel.json` und Home-Sections (`Hero`, `Trust`, `Services`, `Process`, `Region`, `ContactCta`, `Footer`). |
| **Mobile** | Expo-App mit Tabs/Stacks inkl. `Settings`, `DoseCalculator`, `VitalReference`; Verify-Skripte im Paket vorhanden. |
| **Domain + Datenpipeline** | `packages/domain` vorhanden; DBRD-/Seed-Skripte `dbrd:*` im Root (`scripts/dbrd/*`). |

## Architekturüberblick (kurz)

- Monorepo mit Workspaces `apps/*`, `packages/*`.
- Website-Landschaft: `apps/website` (Root-Buildziel), `apps/website-v2` (zweiter Next.js-Stand), `apps/website-old` (Legacy).
- Mobile: Expo + React Navigation, Daten aus `loadLookupBundle` und `contentIndex`.
- Domain: `packages/domain` mit Content/Governance/Versioning/Release/Lifecycle/Survey/Lookup-Modulen.

## Verwendete Technologien

| Bereich | Technologien |
|--------|--------------|
| Paketmanager | pnpm 10.8.1 |
| Node | `>=18` |
| Website / Website-v2 | Next.js ^16.2.1, React ^19.2.4, Tailwind CSS ^4.2.2 |
| Mobile | Expo ~54.0.33, React Native 0.81.5, React Navigation 6.x |
| Scripts/Tooling | TypeScript, tsx, Expo CLI |

## Apps + Packages (Übersicht)

| Pfad | Rolle |
|------|--------|
| `apps/website/` | Aktuelles Root-Build-/Root-Vercel-Ziel |
| `apps/website-v2/` | Zweite Next.js-Website mit eigener Section-Struktur |
| `apps/website-old/` | Legacy-Website mit eigener Vercel-Ignore-Logik |
| `apps/mobile-app/` | Expo-Lookup-App |
| `packages/domain/` | Domain-Paket |

## Wichtigste Features (im Code vorhanden)

- Website (`apps/website`): statische Routen inkl. Rechtstexte, Survey-Link-Auflösung über `resolveSurveyLink`.
- Website-v2: neue Startseiten-Komposition (`Hero`, `Trust`, `Services`, `Process`, `Region`, `Contact CTA`, `Footer`).
- Mobile: Suche, Favoriten, Verlauf, Medikamente/Algorithmen (Liste + Detail), Dosisrechner, Vitalwerte, Settings.
- Seed-Daten: `data/lookup-seed` mit manifest + medication/algorithm JSON.

## Geplante bzw. offene Themen (Doku)

- Offline-Persistenz/Sync für Inhalte weiterhin als offener Schritt in Roadmap/Status.
- API/Auth/Org-Governance bleibt außerhalb des aktuell implementierten Mobile-Lookup-Pfads.

## Bekannte Inkonsistenzen (faktenbasiert)

- Root-Build/Vercel zeigen auf `apps/website`, parallel existieren `apps/website-v2` und `apps/website-old`.
- `scripts/validate-routing.ts` und `scripts/validate-content-isolation.ts` sind nicht auf die aktive `apps/website`-Struktur abgestimmt.
- Mehrere parallele Datenmodelle (Mobile-JSON, Domain-Entities, DBRD-normalized, Domain-Lookup).
