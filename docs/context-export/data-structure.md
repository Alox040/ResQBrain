# Datenstrukturen (Export)

**Stand:** Abgleich mit `data/lookup-seed/*`, `apps/mobile-app/src/lookup/lookupSchema.ts`, `apps/mobile-app/src/types/content.ts` und Domain-Paket (Export 8. April 2026).

Es existieren **mehrere parallele Modelle** im Repo (absichtlich getrennt: Phase-0-App vs. Plattform-Domain vs. Domain-„Lookup“-Submodule vs. DBRD-Normalisierung).

---

## 1) Phase-0 Lookup-Bundle (Mobile + `data/lookup-seed/`)

**Manifest** (`manifest.json`) — erlaubte Keys laut `LOOKUP_MANIFEST_KEYS` in `lookupSchema.ts`:

- `schemaVersion`, `bundleId`, `version`, `createdAt`, `checksum`, `displayName`, `locale`, `contentCutoffDate`, `generatedAt`

**Aktueller Inhalt (`manifest.json`, Export):** u. a. `schemaVersion: "1"`, `bundleId: "pilot-wache-001"`, `version: "2026.03.29.1"`, `createdAt`, `checksum`, `generatedAt`.

### Medication (JSON + App-Typ `Medication`)

- **Keys im JSON** (Whitelist `MEDICATION_ITEM_KEYS`):  
  `id`, `kind` (`"medication"`), `label`, `indication`, `tags`, **`category`**, `searchTerms`, `notes`, `dosage`, `relatedAlgorithmIds`
- **TypeScript-Shape:** `apps/mobile-app/src/types/content.ts` — `Medication` erweitert gemeinsame Basis (`ContentBase`) um `dosage`, `relatedAlgorithmIds`; optional `category?: ContentCategory`.

### Algorithm (JSON + App-Typ `Algorithm`)

- **Keys** (`ALGORITHM_ITEM_KEYS`):  
  `id`, `kind` (`"algorithm"`), `label`, `indication`, `tags`, **`category`**, `searchTerms`, `notes`, `steps`, `warnings`, `relatedMedicationIds`
- **Schritt:** nur `text` (`ALGORITHM_STEP_KEYS`)
- **TypeScript:** `Algorithm` mit `steps: AlgorithmStep[]`, `warnings?`, `relatedMedicationIds`; optional `category?`.

### Umfang der Seed-Dateien (gezählt, Export)

- `medications.json`: **10** Einträge (Array-Länge per Node `require`).
- `algorithms.json`: **9** Einträge (Array-Länge per Node `require`).

### Pipeline (Repo)

- **`data/schemas/dbrd-normalized.schema.ts`** — internes Normalisierungsmodell (Provenance, `NormalizedAlgorithmStep` mit `order`/`text`, Freigabestatus-Werte parallel zur Domain, ohne Org-/Audit-Objekte).
- **`data/schemas/dbrd-normalized.examples.json`** — Beispielinstanzen.
- **`scripts/dbrd/`** — Extraktion/Normalisierung/Validierung und `build-lookup-seed` (Mapping → `data/lookup-seed/`); Root-Scripts `pnpm dbrd:*`.
- **Dosisrechner-Hinweis:** Einige Medikationseinträge enthalten mg/µg-pro-kg-Hinweise im Freitext (`dosage`), die von `DoseCalculatorScreen` via `parseDosageCalculatorSpec` interpretiert werden; das Lookup-Schema selbst erzwingt weiterhin nur Freitextfelder, keine strukturierte Dosierungslogik.

### Mobile: Auflösung und Metadaten

- **`resolveLookupBundle()`** (`sourceResolver.ts`) liefert `ResolvedLookupBundle` mit `source`, `bundle`, `meta` (`BundleMeta`: `bundleId`, **`version`** (aus Manifest, nullable), `generatedAt`, `schemaVersion`). `App.tsx` nutzt u. a. `resolved.meta.version` für Debug-Info.

### Versioning-relevante Statuswerte

- **Normalized Schema:** `approvalStatus` erlaubt `Draft`, `InReview`, `Approved`, `Rejected`, `Released`, `Deprecated`.
- **Domain:** eigenes Approval-/Versioning-Modell in `packages/domain/src/content/entities` und `packages/domain/src/versioning/entities`.

---

## 2) Content Package (Plattform-Domain)

**Datei:** `packages/domain/src/content/entities/ContentPackage.ts`

- Interface `ContentPackage`: u. a. `kind: 'ContentPackage'`, `id`, `organizationId`, `title`, `label`, `description`, `targetAudience`, `targetScope`, `applicabilityScopes`, `excludedScopes`, `approvalStatus`, `currentVersionId`, `createdAt`, `createdBy`, Deprecation-Felder, `auditTrail`.

---

## 3) Version (Plattform — ContentPackageVersion)

**Datei:** `packages/domain/src/versioning/entities/ContentPackageVersion.ts`

- `ContentPackageVersion`: u. a. `kind: 'ContentPackageVersion'`, `id` (VersionId), `organizationId`, `packageId`, `versionNumber`, `predecessorVersionId`, `lineageState`, `createdAt`, `createdBy`, `changeReason`, `composition`, `targetScope`, Scopes, `releaseNotes`, `compatibilityNotes`, `dependencyNotes`.

Weitere Versioning-Exporte: `ReleaseVersion`, `CompositionEntry`, … (`versioning/entities/index.ts`).

---

## 4) Release (Plattform)

- **`ReleaseEngine`:** `packages/domain/src/release/ReleaseEngine.ts` — Eingaben u. a. `ReleaseContentPackageInput` mit Actor, `contentPackage`, `versionId`, Audit-Metadaten (genaue Felder im Quelltext).
- **`ReleaseVersion`-Entity** unter `versioning/entities/ReleaseVersion.ts`.

---

## 5) Medication / Algorithm / Guideline (Plattform-Content-Entities)

| Entity | Datei | Kurzcharakteristik |
|--------|--------|---------------------|
| **Medication** | `content/entities/Medication.ts` | Org, `title`/`genericName`/`brandNames`, `dosageGuidelines[]`, Approval, `currentVersionId`, Audit, … |
| **Algorithm** | `content/entities/Algorithm.ts` | `decisionLogic` (Knoten mit `nextNodeIds`, `terminal`), `prerequisites`, Version/Approval, … |
| **Guideline** | `content/entities/Guideline.ts` | `guidelineCategory`, `evidenceBasis`, `advisory`, References auf Protocol, Version/Approval, … |
| **Protocol** | `content/entities/Protocol.ts` | (im Export nicht Zeile für Zeile ausgewiesen; Datei existiert) |

**Wichtig:** Diese Shapes sind **nicht identisch** mit Phase-0-JSON der Mobile-App oder mit `DbrdNormalized*`-Typen; Mapping erfolgt über die DBRD-/Seed-Pipeline, nicht automatisch zur Laufzeit in der App.

---

## 6) Domain-Submodule `packages/domain/src/lookup/entities/`

Eigenes **Lookup-Medikament** (`Medication.ts`): `kind: 'Medication'`, `name`, `genericName`, `tradeNames`, eingebettete `doses`, `indications`, `contraindications`, `version: Version`, `searchTokens`, …

**`Version.ts` (Lookup):** `id`, `releasedAt` (ISO-String), `checksum` — beschrieben als Cache-/Bundle-Stempel, nicht gleich `ContentPackageVersion`.

---

## Ordner `data/schemas/`

- Enthält **`dbrd-normalized.schema.ts`** und **`dbrd-normalized.examples.json`** (nicht leer).
- Kanonische ausgelieferte Phase-0-JSON-Dateien für die Mobile-App liegen unter **`data/lookup-seed/`** (3 JSON-Dateien: manifest, medications, algorithms).
