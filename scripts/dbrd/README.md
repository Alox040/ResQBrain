# Skripte: DBRD → Lookup-Seed

## Zweck

Reproduzierbare Kette:

1. Rohdaten unter `data/dbrd-source/raw/` (JSON, Version 1)
2. **Normalisierung** → `data/dbrd-source/normalized/` (dieser Ordner)
3. Später: Mappings → `data/lookup-seed/`

## Normalisierte Daten hart prüfen (implementiert)

Vor dem Seed-Build: **`validate-normalized.ts`** lädt `medications.normalized.v1.json` und `algorithms.normalized.v1.json`, prüft u. a. Pflichtfelder, Typen, leere Strings, **`steps`** (`order` 1…n, ganzzahlig, `text` nicht leer), **eindeutige IDs** je Liste, **keine ID** in Medikamenten und Algorithmen zugleich, **Querverweise** (`relatedAlgorithmIds` / `relatedMedicationIds`), **ContentTags** wie in der App. Fehler: gruppierte Konsolenausgabe, Exit-Code 1.

```bash
pnpm dbrd:validate-normalized
pnpm exec tsx scripts/dbrd/index.ts validate-normalized
```

## Lookup-Seed bauen (implementiert)

Aus `data/dbrd-source/normalized/*.normalized.v1.json` werden **`data/lookup-seed/medications.json`**, **`algorithms.json`** und **`manifest.json`** erzeugt.

- **Nach** dem Schreiben: **`validateLookupBundle`** (identisch zur Mobile-App).
- **Empfohlen:** `pnpm dbrd:build` — führt zuerst **`dbrd:validate-normalized`**, dann **`dbrd:build-lookup-seed`** aus.

| Datei | Rolle |
|-------|--------|
| `validate-normalized.ts` | Harte Vorprüfung der normalisierten Bundles |
| `build-lookup-seed.ts` | Mapping normalisiert → Seed, Manifest (`generatedAt` neu, vorherige Manifest-Felder übernommen) |

```bash
pnpm dbrd:build
pnpm dbrd:build-lookup-seed
pnpm exec tsx scripts/dbrd/build-lookup-seed.ts --content-cutoff-date=2026-03-29
pnpm exec tsx scripts/dbrd/index.ts seed
```

Doku: `data/dbrd-source/mappings/normalized-to-lookup.md`, `field-map.*.json`.

## Normalisierung (implementiert)

| Datei | Rolle |
|-------|--------|
| `index.ts` | CLI: `all` \| `medications` \| `algorithms` \| `seed` \| `validate-normalized` |
| `normalize-medications.ts` | Roh-JSON Medikamente → normalisiertes Bundle |
| `normalize-algorithms.ts` | Roh-JSON Algorithmen → normalisiertes Bundle |
| `common.ts` | Pfade, JSON lesen/schreiben, Pflichtfeld- und Provenance-Checks |

### Eingaben (feste Pfade)

- `data/dbrd-source/raw/medications/medications.raw.v1.json` — `schemaId: "dbrd-raw-medications/v1"`
- `data/dbrd-source/raw/algorithms/algorithms.raw.v1.json` — `schemaId: "dbrd-raw-algorithms/v1"`

Struktur der Rohdateien ist in den Dateikopfkommentaren der jeweiligen `normalize-*.ts` beschrieben.

### Ausgaben

- `data/dbrd-source/normalized/medications.normalized.v1.json` — `bundleSchemaId: "dbrd-normalized.pipeline/medications/v1"`
- `data/dbrd-source/normalized/algorithms.normalized.v1.json` — `bundleSchemaId: "dbrd-normalized.pipeline/algorithms/v1"`

Zielobjekte entsprechen `data/schemas/dbrd-normalized.schema.ts` (`NormalizedMedication` / `NormalizedAlgorithm`).

### Aufruf

```bash
# Im Repo-Root (benötigt installiertes `tsx` im Root, siehe package.json)
pnpm dbrd:normalize

pnpm dbrd:normalize:medications
pnpm dbrd:normalize:algorithms
```

Alternativ direkt:

```bash
pnpm exec tsx scripts/dbrd/index.ts
pnpm exec tsx scripts/dbrd/index.ts medications
```

Falls `pnpm install` am Root wegen Sperren fehlschlägt, steht `tsx` auch unter `apps/website` zur Verfügung:

```bash
cd apps/website && pnpm exec tsx ../../scripts/dbrd/index.ts
```

### Fehlerverhalten

- Ungültiges JSON, falsches `schemaId`, fehlende Pflichtfelder, ungültiger `approvalStatus`, ungültiges Datum, doppelte `id`, leere `steps` oder Lücken in `order` bei Algorithmen → **Konsolenfehler** und **Exit-Code 1**.

## Nicht Teil dieser Pipeline

PDF, OCR, KI-Parsing, Domain-Module, Mobile-UI — bewusst ausgeklammert.

## Regeln

- Keine direkte Bearbeitung produktiver App-JSONs unter `data/lookup-seed/` ohne dokumentierten Transform.
- Schema-Änderungen: `data/schemas/dbrd-normalized.schema.ts` und diese Skripte gemeinsam anpassen.
