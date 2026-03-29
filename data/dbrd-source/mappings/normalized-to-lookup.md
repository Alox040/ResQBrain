# Normalisiert → Mobile Lookup-Seed

**Stand:** März 2026 — beschreibt den Build von `data/lookup-seed/` aus `data/dbrd-source/normalized/`.

## Ziel

Die **Phase-0-Mobile-App** validiert Bundles strikt (`validateLookupBundle` in `apps/mobile-app/src/lookup/validateLookupBundle.ts`). Ausgaben dieses Mappings müssen:

- **exakt** die erlaubten Schlüssel tragen (`MEDICATION_ITEM_KEYS` / `ALGORITHM_ITEM_KEYS` / `ALGORITHM_STEP_KEYS` / `LOOKUP_MANIFEST_KEYS`);
- **keine** Zusatzfelder enthalten (sonst Validierung: „unknown keys“);
- `tags` nur aus der **ContentTag-Whitelist** verwenden (`CONTENT_TAG_VALUES` in `lookupSchema.ts`);
- Querverweise (`relatedAlgorithmIds` / `relatedMedicationIds`) auflösbar sein und keine ID-Kollision zwischen Medikamenten und Algorithmen erzeugen.

## Ausführung

**Empfohlene Pipeline (Vorprüfung + Build + App-Validierung):**

```bash
pnpm dbrd:build
```

Das führt **`dbrd:validate-normalized`** (hartes Prüfen der normalisierten JSONs, siehe `scripts/dbrd/validate-normalized.ts`) und anschließend **`dbrd:build-lookup-seed`** aus.

Nur Seed erzeugen (ohne Vorprüfung — möglich, aber nicht empfohlen):

```bash
pnpm dbrd:build-lookup-seed
```

Optional: Datum für `manifest.contentCutoffDate` setzen (ISO-Datum `YYYY-MM-DD`):

```bash
pnpm exec tsx scripts/dbrd/build-lookup-seed.ts --content-cutoff-date=2026-03-29
```

Voraussetzung: normalisierte Dateien existieren (z. B. nach `pnpm dbrd:normalize`).

Nur normalisierte Dateien prüfen:

```bash
pnpm dbrd:validate-normalized
```

## Eingaben

| Datei | Erwartetes `bundleSchemaId` |
|-------|------------------------------|
| `data/dbrd-source/normalized/medications.normalized.v1.json` | `dbrd-normalized.pipeline/medications/v1` |
| `data/dbrd-source/normalized/algorithms.normalized.v1.json` | `dbrd-normalized.pipeline/algorithms/v1` |

## Ausgaben

| Datei | Inhalt |
|-------|--------|
| `data/lookup-seed/medications.json` | Array von Medikamenten-Objekten (Root = Array, wie bisher) |
| `data/lookup-seed/algorithms.json` | Array von Algorithmen-Objekten |
| `data/lookup-seed/manifest.json` | Metadaten: bestehende Werte werden beibehalten, **`generatedAt`** wird bei jedem Lauf auf die aktuelle ISO-Zeit gesetzt; **`contentCutoffDate`** optional per CLI überschrieben |

Nach dem Schreiben führt `build-lookup-seed` **dieselbe Validierung** aus wie die App (`validateLookupBundle`). Bei Fehlern: Konsolenausgabe und Exit-Code 1.

**Validierungskette:** (1) normalisierte Bundles — `validate-normalized`, (2) erzeugtes Seed — `validateLookupBundle` im Build-Skript.

## Feldzuordnung (Kurz)

Ausführliche tabellarische Zuordnung: `field-map.medications.json` und `field-map.algorithms.json`.

### Medikamente

- Direkt: `id`, `label`, `indication`, `tags`, `searchTerms`, `relatedAlgorithmIds`
- Konstant: `kind` = `"medication"`
- `dosage`: aus `dosage.summary` und optional `dosage.detail` (siehe JSON-Regel)
- `notes`: optional aus `contraindicationsNote` und `clinicalNotes`
- **Nicht** im Seed: `entityType`, `provenance`, `genericName`, `tradeNames`

### Algorithmen

- Direkt: `id`, `label`, `indication`, `tags`, `searchTerms`, `relatedMedicationIds`
- Konstant: `kind` = `"algorithm"`
- `steps`: nur `{ "text": "…" }`; optionaler `title` aus dem Normalisierten wird in den Text eingebaut (`Title: Text`)
- `clinicalNotes` → `notes` (optional)
- `warnings` → `warnings` (optional)
- **Nicht** im Seed: `entityType`, `provenance`, `order`/`title` der Schritte als eigene Keys

## Trennung der Verantwortlichkeiten

| Schicht | Ort |
|---------|-----|
| Roh | `data/dbrd-source/raw/` |
| Normalisiert | `data/dbrd-source/normalized/` |
| Mapping-Doku / Feldlisten | `data/dbrd-source/mappings/` |
| App-Runtime | `data/lookup-seed/` |

## Siehe auch

- `scripts/dbrd/validate-normalized.ts` — Vorprüfung der normalisierten Bundles
- `scripts/dbrd/build-lookup-seed.ts`
- `docs/context/dbrd-normalized-model.md`
- `docs/context/content-seed-plan.md` (falls vorhanden)
