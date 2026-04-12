# Projekt-Überblick (Export)

**Stand:** 12. April 2026 — nur aus Repo-Artefakten (`package.json`, `README.md`, `docs/context/*`, `docs/roadmap/*`, Codepfade) abgeleitet.

---

## Projektname

**ResQBrain**

## Ziel des Projekts

- **Produkt (Kanonisch):** Mehrmandantenfähige Plattform für den Rettungsdienst: Organisationen verwalten und verteilen medizinische/operative Inhalte (Algorithmen, Medikamente, Protokolle, Leitlinien) mit Versionierung und Freigabe — beschrieben in `README.md` und `docs/architecture/`.
- **Aktueller Umsetzungsschwerpunkt im Code:** **Phase-0-Lookup-App** (Mobile): offline Medikamente und Algorithmen aus eingebettetem Bundle; Website für Projekt-/Community-Kommunikation.

## Aktuelle Phase

- **`docs/roadmap/PROJECT_ROADMAP.md`:** **Phase 0 — Lookup App** (Lookup-Bundle, Listen, Details, Suche, eingebettetes Offline-Bundle) mit mehreren Punkten als **[~] teilweise**; **Phase 1 — Einsatz Features** teils umgesetzt (z. B. Favoriten, Verlauf, Vitalreferenz [x], Dosisrechner [~]).
- **`apps/website/lib/site/content.ts`:** Hero-Badge-Text **„MVP-Phase | in Entwicklung“**.

## Kurzer Status

- **In Entwicklung:** Mobile-App (Expo), Domain-/Application-Pakete, Daten-Pipelines (`scripts/dbrd/*`).
- **Lokal testbar / verifizierbar:** `pnpm mobile:verify` (siehe `apps/mobile-app/package.json`), `pnpm build` (Website), `pnpm verify` (Orchestrierung mehrerer Schritte in `scripts/verify.ts`).
- **Deployed (laut Doku):** `README.md` nennt Website-Deployment-Stand **8. April 2026**; konkrete Produktions-URL ist im Export **nicht** aus dem Code belegt.

## Architekturüberblick

- **Mobile:** React Native / Expo; Navigation React Navigation; Inhalte aus validiertem JSON-Bundle unter `apps/mobile-app/data/lookup-seed/`; View-Model-Schicht unter `apps/mobile-app/src/data/adapters/`.
- **Website:** Next.js App Router unter `apps/website/app/`.
- **Domain (Plattform):** `packages/domain` — Content-Entities, Versioning, Release, Governance, Tenant, Lifecycle (Typsicher, tests vorhanden laut `package.json`-Scripts).
- **Application Layer:** `packages/application` — Lookup-Services, Release-Application-Service, Ports/DTOs.
- **API (Paket):** `packages/api` — Tests gegen Lookup-Repositories/Services (`pnpm test` am Root filtert hierauf).
- **Zusätzlich im Dateisystem:** `apps/api-local` (Workspace), `apps/api/` (TypeScript-Quellen **ohne** `package.json`, **nicht** in `pnpm-workspace.yaml`); Root-Verzeichnis `app/`, `components/`, `src/domain/` (ohne `next.config` am Root — **nicht** das deployte Next-Projekt).

## Verwendete Technologien (nach `package.json`)

| Bereich | Technologien |
|--------|----------------|
| Monorepo | `pnpm` Workspaces (`pnpm-workspace.yaml`) |
| Website | Next.js ^16, React 19, Tailwind CSS 4, TypeScript |
| Mobile | Expo ~54, React 19, React Native 0.81, React Navigation 6, Zustand, AsyncStorage |
| Tooling | `tsx`, TypeScript 5.7+ / 6.x (je Paket) |

## Monorepo-Struktur

**Ja.** Workspaces laut `pnpm-workspace.yaml`:

- `apps/api-local`
- `apps/mobile-app`
- `apps/website`
- `packages/*`

## Apps + Packages (Übersicht)

| Pfad | Rolle |
|------|--------|
| `apps/website` | Öffentliche Next.js-Website (`@resqbrain/website`) |
| `apps/mobile-app` | Expo-Mobile-App (`@resqbrain/mobile-app`) |
| `apps/api-local` | Lokaler API-Dienst (`@resqbrain/api-local`) |
| `packages/domain` | Domänenmodell, ReleaseEngine, Policies, Entities |
| `packages/application` | Anwendungsdienste (Lookup, Release) |
| `packages/api` | API-Schicht / Adapter-Tests (`@resqbrain/api`) |
| `apps/mobile-app-lab`, `apps/website-lab` | Labor-/Prototyp-Ordner (nicht in `pnpm-workspace.yaml`) |
| `apps/api` | Zusätzliche API-Routen-Struktur im Tree, **ohne** eigenes `package.json` |

## Wichtigste Features (im Code sichtbar)

- Mobile: eingebettetes Lookup-Bundle, Listen/Details Medikamente & Algorithmen, Suche mit Filter, Home, Favoriten, Verlauf, Dosisrechner, Vitalwerte-Referenz, Einstellungen — siehe `apps/mobile-app/src/navigation/AppNavigator.tsx` und `docs/context/12-next-steps.md`.
- Website: Marketing-/Info-Seiten, Mitwirken-Formular + API-Route `POST` unter `apps/website/app/api/mitwirken/route.ts`.
- Domain: `ReleaseEngine`, Content-Entities inkl. `ContentPackage`, Versioning-Entities — siehe `packages/domain/src/`.

## Geplante / offene Features (Doku)

- Bundle-Persistenz / Sync / Push-Updates (`docs/context/12-next-steps.md`, `docs/roadmap/PROJECT_ROADMAP.md`).
- Post-MVP laut `docs/context/04-mvp-scope.md`: u. a. voller Content-Lifecycle, Multi-Tenant-Runtime, Release-Pipeline für Live-Bundles, Auth.

## Bekannte Probleme / Lücken (aus Doku, nicht neu verifiziert)

- `docs/roadmap/PROJECT_ROADMAP.md`: **Offen** — Domain-`test:content` / Graph-`createAlgorithm` an Entity-Modell angleichen.
- Mobile: ESLint in `apps/mobile-app` laut Script nur Platzhalter-Meldung (`package.json`).
