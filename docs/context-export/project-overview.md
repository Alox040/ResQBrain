# Projekt-Überblick (Export)

**Quelle:** Analyse des Repositories `ResQBrain` (Stand Export: 5. April 2026, aktueller Workspace-Zustand).  
**Hinweis:** Nur Code-/Datei-basierte Fakten; keine Live-Deployment-Verifikation.

**Verifikation (frischer Lauf, lokal):** Root `pnpm build` → Exit **0** (Next.js **16.2.1**); `apps/mobile-app` `npx tsc --noEmit` → Exit **2** (vier TypeScript-Fehler, siehe `known-issues.md`); `pnpm exec tsx scripts/validate-content-isolation.ts` → Exit **0**; `pnpm exec tsx scripts/validate-routing.ts` → Exit **1** (erwartet veraltete Section-Dateinamen).

## Projektname

**ResQBrain** (`package.json` Root: `resqbrain`; Workspace-Apps: `@resqbrain/website`, `resqbrain-mobile`). Zusätzlich im Dateibaum, **ohne** Eintrag in `pnpm-workspace.yaml`: `apps/website-old`, `apps/website-pre-v2-backup`.

## Ziel des Projekts

- Mehrmandantenfähige EMS-Plattform mit versionierten/freigegebenen Inhalten (Dokumentationsbasis unter `docs/context` und `docs/architecture`).
- Im Code sichtbar: Mobile Lookup-App (`apps/mobile-app`), aktive Website (`apps/website`), Legacy/Backup-Website-Ordner (`apps/website-old`, `apps/website-pre-v2-backup`).

## Aktuelle Phase

- `docs/context/current-phase.md` (letzte Aktualisierung 2026-03-27): **Phase 0 (Lookup App)** — statische/mock-basierte Datenquellen in der App, keine produktive API-/Auth-/Multi-Tenant-Runtime.
- Codebasiert: Lookup-Bundle weiterhin aus eingebettetem Seed (`data/lookup-seed`); zusätzlich **`resolveLookupBundle()`** mit Priorität updated → cached → embedded → fallback sowie Hintergrund-Check über `EXPO_PUBLIC_LOOKUP_BUNDLE_URL` (`App.tsx`, `bundleUpdateService.ts`, `sourceResolver.ts`).

## Kurzer Status

| Bereich | Beleg |
|--------|--------|
| **Website (Root-Buildziel)** | Root-`build` nutzt `pnpm --filter @resqbrain/website build`; Root-`vercel.json` setzt `rootDirectory: "apps/website"`. |
| **Website (App)** | Next.js 16.2.1; Startseite komponiert Sections direkt in `app/page.tsx` (`HeroSection`, `ProblemSection`, `IdeaSection`, `StatusSection`, `AudienceSection`, `MitwirkungSection`, `FaqSection`, `ContactCtaSection`). |
| **Mobile** | Expo ~54.0.33; `App.tsx` lädt Bundle über `resolveLookupBundle`, optional Hintergrund-Update; Verify-Skripte im Paket; **`pnpm mobile:verify` bricht aktuell an `tsc --noEmit` ab** (siehe `known-issues.md`). |
| **Domain + Datenpipeline** | `packages/domain` im Workspace; DBRD-/Seed-Skripte `dbrd:*` im Root; weitere Root-Hilfsskripte in `scripts/` (u. a. `validate-algorithms.ts`, `import-dbrd.ts`, `transform-algorithms.ts`, `cleanup-algorithms.ts` — ohne Root-`package.json`-Scripts). |

## Architekturüberblick (kurz)

- Monorepo: `pnpm-workspace.yaml` listet nur `apps/mobile-app`, `apps/website`, `packages/*`.
- Website: `apps/website` (Root-Buildziel); `apps/website-old` und `apps/website-pre-v2-backup` sind parallele Ordner, nicht Workspace-Mitglieder.
- Mobile: Expo + React Navigation; Bundle-Auflösung in `sourceResolver.ts`, In-Memory-Store über `buildLookupRamStore` / `contentIndex`.
- Domain: `packages/domain` mit Content/Governance/Versioning/Release/Lifecycle/Survey/Lookup-Modulen.

## Verwendete Technologien

| Bereich | Technologien |
|--------|--------------|
| Paketmanager | pnpm 10.8.1 |
| Node | `>=18` |
| Website | Next.js ^16.2.1, React ^19.2.4, Tailwind CSS ^4.2.2 |
| Mobile | Expo ~54.0.33, React Native 0.81.5, React Navigation 6.x, Zustand ^5.0.12, `expo-file-system` |
| Scripts/Tooling | TypeScript, tsx, Expo CLI |

## Apps + Packages (Übersicht)

| Pfad | Rolle |
|------|--------|
| `apps/website/` | Aktives Next.js-Ziel von Root-`pnpm build` und Root-`vercel.json` |
| `apps/mobile-app/` | Expo-Lookup-App |
| `apps/website-old/` | Ältere Next.js-Site; `vercel.json` mit `ignoreCommand` |
| `apps/website-pre-v2-backup/` | Backup-Kopie (eigenes `package.json`, Name `@resqbrain/website` — nicht im Workspace) |
| `packages/domain/` | Domain-Paket |

## Wichtigste Features (im Code vorhanden)

- Website (`apps/website`): statische Routen inkl. Rechtstexte; Copy in `lib/site/content.ts`; Umfrage-Links aus `lib/site/survey.ts`.
- Mobile: Suche, Favoriten, Verlauf (Stores + Hydration in `App.tsx`), Medikamente/Algorithmen (Liste + Detail), Dosisrechner, Vitalwerte, Settings; Bundle-Resolver und optionaler Remote-Update-Pfad.
- Seed-Daten: `data/lookup-seed` mit manifest + medication/algorithm JSON.

## Geplante bzw. offene Themen (Doku)

- Vollständige Bundle-Persistenz/Sync und produktive Liefer-URL (Hintergrund-Update vorbereitet, End-to-End offen).
- API/Auth/Org-Governance außerhalb des aktuellen Mobile-Lookup-Alltags.

## Bekannte Inkonsistenzen (faktenbasiert)

- Zwei Website-Ordner mit `@resqbrain/website` im `package.json`, aber nur `apps/website` ist Workspace-Mitglied.
- `scripts/validate-routing.ts` erwartet noch die frühere Section-Dateistruktur der Website (Lauf 5. April 2026: Exit 1).
- `HistoryScreen.tsx` ist im Repo vorhanden, aber **nicht** in `AppNavigator` / `HomeStackParamList` registriert.
