# Datenstrukturen (Export)

**Stand:** 12. April 2026 — Abgleich mit `apps/mobile-app/data/lookup-seed/*`, `apps/mobile-app/src/lookup/lookupSchema.ts`, `apps/mobile-app/src/types/content.ts`, `data/schemas/dbrd-normalized.schema.ts`, `packages/domain/src/content/entities/*`, `packages/domain/src/versioning/entities/*`, `packages/domain/src/release/*`.

Es gibt **mehrere parallele Modelle** (Phase-0-Mobile vs. Plattform-Domain vs. DBRD-Normalisierung vs. Domain-Lookup-Submodule).

---

## 1) Phase-0 Lookup-Bundle (Mobile + Seed)

**Pfade:** `apps/mobile-app/data/lookup-seed/` (kanonische App-Quelle laut `loadLookupBundle.ts`).

### Manifest (`manifest.json`)

Erlaubte Keys laut `LOOKUP_MANIFEST_KEYS` in `lookupSchema.ts`:

`schemaVersion`, `bundleId`, `version`, `createdAt`, `checksum`, `displayName`, `locale`, `contentCutoffDate`, `generatedAt`

### Medication

- **JSON-Keys** (`MEDICATION_ITEM_KEYS`): `id`, `kind`, `label`, `indication`, `tags`, `category`, `searchTerms`, `notes`, `dosage`, `relatedAlgorithmIds`
- **TS-Typ:** `apps/mobile-app/src/types/content.ts` — `Medication` erweitert gemeinsame Basis um `dosage`, `relatedAlgorithmIds`; optional `category`

### Algorithm

- **JSON-Keys** (`ALGORITHM_ITEM_KEYS`): `id`, `kind`, `label`, `indication`, `tags`, `category`, `searchTerms`, `notes`, `steps`, `warnings`, `relatedMedicationIds`
- **Schritt:** nur `text` (`ALGORITHM_STEP_KEYS`)

### Umfang (gezählt, 12. Apr. 2026)

- `medications.json`: **10** Einträge  
- `algorithms.json`: **9** Einträge  

### Pipeline

- **`data/schemas/dbrd-normalized.schema.ts`** — `NormalizedMedication`, `NormalizedAlgorithm`, Provenance, `NormalizedAlgorithmStep` mit `order`/`text`
- **`scripts/dbrd/`** + Root-Scripts `pnpm dbrd:*` — Mapping Richtung Lookup-Seed

---

## 2) Medication / Algorithm / Guideline (Plattform-Domain)

| Entity | Datei (Auszug) |
|--------|----------------|
| **Medication** | `packages/domain/src/content/entities/Medication.ts` |
| **Algorithm** | `packages/domain/src/content/entities/Algorithm.ts` (u. a. `decisionLogic` mit Knoten) |
| **Guideline** | `packages/domain/src/content/entities/Guideline.ts` — `kind: 'Guideline'`, `guidelineCategory`, `evidenceBasis`, `advisory`, `references`, `currentVersionId`, `approvalStatus`, `auditTrail`, … |
| **Protocol** | `packages/domain/src/content/entities/Protocol.ts` |

**Hinweis:** Diese Shapes sind **nicht** identisch mit Phase-0-Mobile-JSON.

---

## 3) Content Package (Plattform)

**Datei:** `packages/domain/src/content/entities/ContentPackage.ts`

- u. a. `kind: 'ContentPackage'`, `id`, `organizationId`, `title`, `approvalStatus`, `currentVersionId`, Scope-/Applicability-Felder, Audit-Trail (Details im Quelltext).

---

## 4) Version (Plattform)

**Datei:** `packages/domain/src/versioning/entities/ContentPackageVersion.ts`

- u. a. `kind: 'ContentPackageVersion'`, `id` (`VersionId`), `organizationId`, `packageId`, `versionNumber`, `lineageState`, `composition`, …

Weitere Versioning-Entities: `ReleaseVersion`, Kompositions-Einträge — siehe `packages/domain/src/versioning/entities/index.ts`.

---

## 5) Release (Plattform)

- **`ReleaseEngine`:** `packages/domain/src/release/services/ReleaseEngine.ts` — u. a. `createPackage` (ReleaseBundle), `createRelease` (ReleaseVersion), Tenant-Invarianten.
- **`ReleaseBundle`:** `packages/domain/src/release/entities/ReleaseBundle.ts` — u. a. Arrays von Content-IDs inkl. `guidelines`.
- **Application:** `packages/application/src/release/ReleaseApplicationService.ts`.

---

## 6) Domain-Lookup-Submodule (`packages/domain/src/lookup/entities/`)

Eigenes Lookup-Medikament mit eingebetteter **`Version`** (Felder u. a. `releasedAt`, `checksum` in `lookup/entities/Version.ts` laut Architektur-Export) — **semantisch anders** als `ContentPackageVersion`.

---

## Ordner `data/schemas/` und `data/lookup-seed/`

- **`data/schemas/`:** `dbrd-normalized.schema.ts`, `dbrd-normalized.examples.json`
- **`data/lookup-seed/`:** enthält u. a. `manifest.json`, `medications.json`, `algorithms.json` sowie extrahierte DBRD-JSON-Dateien (vollständige Liste im Dateisystem).
- **Zur Laufzeit in der Mobile-App importiert:** **`apps/mobile-app/data/lookup-seed/`** (`loadLookupBundle.ts` importiert diese Pfade) — zweite Kopie der Seed-Dateien im Repo.
