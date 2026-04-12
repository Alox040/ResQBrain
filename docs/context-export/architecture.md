# Architektur (Export)

**Stand:** 12. April 2026 — Struktur und Begriffe aus dem Dateisystem und ausgewählten Modulen; keine Zukunftsannahmen.

---

## Ordnerstruktur (relevant)

- **`apps/website`** — Next.js App Router (`app/`), `components/`, `lib/`, `public/`.
- **`apps/mobile-app`** — Expo-App: `app.json`, `src/` (Screens, Navigation, Lookup, Theme, Storage).
- **`apps/api-local`** — Lokaler Node/TSX-Einstieg (`src/index.ts` laut `package.json`).
- **`apps/api`** — Unterordner `src/lookup` (Handler, Contracts, Mappers); **kein** `package.json` im Ordner gefunden.
- **`packages/domain`** — Domänencode: u. a. `content/`, `versioning/`, `release/`, `governance/`, `lifecycle/`, `tenant/`, `lookup/`, `survey/`, `audit/`, `shared/`, `legacy/`.
- **`packages/application`** — `lookup/` (Services, Queries, DTOs, Ports), `release/`.
- **`packages/api`** — `src/lookup/adapters`, an `@resqbrain/application` gekoppelt.
- **`data/`** — `lookup-seed/` (Mobile-Bundle-Kopie), `schemas/` (DBRD-Normalisierung), `dbrd-source/`.
- **`scripts/`** — Build-/Validierungs-/DBRD-Pipelines, `verify.ts`, `vercel-ignore.js`.
- **Repo-Root** — zusätzlich `app/`, `components/`, `lib/`, `src/domain/` (TS-Pfade `@/*` in Root-`tsconfig.json`); **kein** `next.config.*` am Root (Next liegt unter `apps/website`).

---

## Navigation (Mobile-App)

**Datei:** `apps/mobile-app/src/navigation/AppNavigator.tsx`

- **Tabs (`RootTabParamList`):** `Home`, `Search`, `Favorites`, `Settings`, `MedicationTab`, `AlgorithmTab`.
- **Home-Stack:** `HomeMain` → `HomeScreen`; `History` → `HistoryScreen`; `VitalReference` → `VitalReferenceScreen` (`homeStackParamList.ts`).
- **Medikamente-Stack:** `MedicationListScreen` → `MedicationDetail` → `DoseCalculator`.
- **Algorithmen-Stack:** `AlgorithmListScreen` (optional `category`) → `AlgorithmDetail`.

---

## Domain Layer (`packages/domain`)

**Exporte (Auszug aus `package.json`):** u. a. `compile:content`, `compile:versioning`, `compile:release`, `compile:lifecycle`, `compile:governance`, …

**Inhaltliche Module (Ordner unter `src/`):**

- **`content/entities`:** `Algorithm`, `Medication`, `Protocol`, `Guideline`, `ContentPackage`, `ApprovalStatus`, …
- **`versioning/entities`:** u. a. `ContentPackageVersion`, `ReleaseVersion`, `EntityType`, `LineageState`, …
- **`release/`:** `ReleaseEngine` in `release/services/ReleaseEngine.ts`, `ReleaseBundle` in `release/entities/`.
- **`governance/`:** `ApprovalEngine`, Policies (`ApprovalResolutionPolicy`, `TransitionAuthorizationPolicy`, `DeprecationAuthorizationPolicy`, …), Capability-Checks.
- **`lifecycle/`:** `ContentLifecycleEngine`, `ContentLifecycleService`, `TransitionPolicy`, …
- **`tenant/`:** `Organization`, Region/County, `tenant/policies` (z. B. `ContentSharingPolicyGuard`).
- **`lookup/entities/`:** eigenständiges Lookup-Medikament u. a. mit eingebetteter `Version` (nicht identisch mit Mobile-Phase-0-JSON).

---

## Datenmodelle (Kurz)

| Schicht | Ort | Zweck |
|---------|------|--------|
| Phase-0 Mobile-Bundle | `apps/mobile-app/data/lookup-seed/*.json` + `src/types/content.ts` + `src/lookup/lookupSchema.ts` | `Medication` / `Algorithm` mit linearen Algorithmus-Schritten (`{ text }`) |
| DBRD-Normalisierung | `data/schemas/dbrd-normalized.schema.ts` | `NormalizedMedication`, `NormalizedAlgorithm`, `DbrdNormalizedProvenance`, Bundle-Hülle |
| Plattform-Domain | `packages/domain/src/content/entities/*.ts` | Vollständige Content-Entities mit Org, Version-IDs, Approval, Audit |
| Lookup-Domain-Submodule | `packages/domain/src/lookup/` | Separates Lookup-Medikament-Modell |

---

## Versioning-System

- **Domain:** `packages/domain/src/versioning/entities/` — u. a. `ContentPackageVersion`, `ReleaseVersion`, `ReleaseType`, `LineageState`, Tests in `versioning.*.test.ts`.
- **Mobile Phase 0:** Manifest-Felder `schemaVersion`, `version`, … in `LookupManifest` (`lookupSchema.ts`); **keine** Domain-Versioning-Anbindung in der App (laut `docs/context/12-next-steps.md`: keine `@resqbrain/domain`-Nutzung in der App).

---

## Release Engine

- **Implementiert im Domain-Paket:** `packages/domain/src/release/services/ReleaseEngine.ts` (u. a. `createPackage`, `createRelease`, Validierung von Composition/Approval).
- **Application:** `packages/application/src/release/ReleaseApplicationService.ts`, `ReleaseContentPackageCommand.ts`, Ports für Repositories/Audit.

---

## Content-Struktur (fachlich)

- **Mobile-Bundle:** Medikamente und Algorithmen (keine Guidelines im Phase-0-JSON-Whitelist in `lookupSchema.ts`).
- **Domain:** Algorithm, Medication, Protocol, Guideline als eigene Entities; `ContentPackage` als Container.

---

## Services (Application Layer)

Unter `packages/application/src/lookup/services/` u. a.:

- `GetMedicationListService`, `GetMedicationDetailService`
- `GetAlgorithmListService`, `GetAlgorithmDetailService`
- `SearchLookupContentService`

Release: `ReleaseApplicationService`.

---

## Entities (Domain, Auswahl)

Exportiert über `packages/domain/src/content/entities/index.ts`: u. a. `Algorithm`, `Medication`, `Protocol`, `Guideline`, `ContentPackage`, `ContentPackageFoundation`, `ApprovalStatus`, `ScopeTarget`.

---

## Policies (Domain, Auswahl)

- **`governance/policies/`:** u. a. `ApprovalResolutionPolicy`, `TransitionAuthorizationPolicy`, `DeprecationAuthorizationPolicy`, `hasCapability`, `PolicyContext`.
- **`lifecycle/policies/`:** `TransitionPolicy`.
- **`tenant/policies/`:** u. a. `ContentSharingPolicyGuard` (siehe `packages/domain/src/tenant/policies/index.ts`).
