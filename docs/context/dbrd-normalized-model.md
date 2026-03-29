# DBRD — internes Normalisierungsmodell (Phase 1)

**Stand:** März 2026 — beschreibt das Zwischenformat zwischen Roh-/normalisierten DBRD-Quellen und `data/lookup-seed/`.

## Zweck

Das Normalisierungsmodell ist **bewusst mittig** positioniert:

| Ebene | Rolle |
|-------|--------|
| `data/lookup-seed/` | Schlanke JSON-Struktur für die **Mobile-App Phase 1** (Lesen, Suche, lineare Schritte). |
| **Dieses Modell** | Klar getrennte fachliche Felder, **Provenance**, bessere Wartbarkeit als im Seed — ohne Org-, Versions- und Audit-Modell der Domain. |
| `@resqbrain/domain` | Vollständige Plattform-Entitäten (Governance, Mehrmandanten, Entscheidungsgraphen, …). |

Es wird **nicht** von der App zur Laufzeit geladen; die App bleibt auf `lookup-seed`. Das Modell dient Pipeline, Reviews und dokumentiertem Mapping.

## Artefakte im Repo

| Datei | Inhalt |
|-------|--------|
| `data/schemas/dbrd-normalized.schema.ts` | TypeScript-Typen (`NormalizedMedication`, `NormalizedAlgorithm`, gemeinsame Hilfstypen). |
| `data/schemas/dbrd-normalized.examples.json` | Zwei Beispiel-Medikamente und zwei Beispiel-Algorithmen (inkl. `provenance`). |
| `docs/context/dbrd-data-flow.md` | Übergeordneter Datenfluss `raw` → `normalized` → Mappings → Seed. |

## Kernelemente

### Provenance (Pflicht)

Jede Entität trägt `provenance` mit:

- **`source`** — woher der Datensatz stammt (System, Handbuch, Exportkontext).
- **`sourceReference`** — konkreter Nachweis (Datei, Versions-ID, Seite, Exportdatum).
- **`approvalStatus`** — gleiche **Wertmenge** wie in der Domain (`Draft`, `InReview`, `Approved`, `Rejected`, `Released`, `Deprecated`); beschreibt den **Inhalt**, nicht automatisch den App-Bundle-Status.
- **`lastReviewedAt`** — ISO-8601-Zeitstempel der letzten inhaltlichen oder governance-relevanten Prüfung.

### NormalizedMedication

- Strukturiert **Dosierung** in `dosage.summary` und optional `dosage.detail` (für ein späteres Zusammenführen zu einem Seed-Feld `dosage`).
- Optional **Wirkstoff** (`genericName`) und **Handelsnamen** (`tradeNames`) — erweitern Suchbarkeit und Mapping zu `searchTerms`.
- **`contraindicationsNote`** und **`clinicalNotes`** trennen fachliche Warnungen von allgemeinen Hinweisen; beim Mapping können sie in Seed-`notes` zusammengeführt oder selektiv übernommen werden.
- **`relatedAlgorithmIds`** — dieselben stabilen IDs wie im Ziel-Seed, damit Verknüpfungen ohne Umbenennung übernommen werden können.

### NormalizedAlgorithm

- **`steps`** bleibt eine **lineare Liste**; jedes Element hat mindestens **`order`** (ab 1) und **`text`**. Optional **`title`** für UI oder interne Gliederung — das Seed-Format kennt aktuell nur `{ "text" }`, daher mappt der Transform-Schritt typischerweise `text` (und ignoriert oder präfixiert `title`).
- **`warnings`** entspricht fachlich dem Seed-Feld `warnings`.
- **`relatedMedicationIds`** spiegelt die Seed-Verknüpfung.

### Bundle-Container

`dbrd-normalized.examples.json` nutzt `bundleSchemaId: "dbrd-normalized.examples/v1"` und die Arrays `medications` / `algorithms`. Echte Pipelines können dasselbe Layout oder eine aufgeteilnte Ablage unter `data/dbrd-source/normalized/` verwenden — die Typen in `dbrd-normalized.schema.ts` sind davon unabhängig wiederverwendbar.

## Mapping-Richtung lookup-seed (Orientierung)

| Normalisiert | Seed (`medications.json` / `algorithms.json`) |
|--------------|-----------------------------------------------|
| `id` | `id` |
| `label` | `label` |
| `indication` | `indication` |
| `tags` | `tags` |
| `searchTerms` | `searchTerms` (ggf. um generierte Einträge aus `tradeNames` ergänzt) |
| `dosage.summary` + optional `detail` | `dosage` (z. B. zusammengefügter Freitext) |
| `clinicalNotes` / `contraindicationsNote` | `notes` (Konvention im Transform festlegen) |
| `relatedAlgorithmIds` | `relatedAlgorithmIds` |
| — | `kind`: fest `"medication"` |
| `steps` (sortiert nach `order`, nur `text` oder zusammengesetzter Text) | `steps` |
| `warnings` | `warnings` |
| `relatedMedicationIds` | `relatedMedicationIds` |
| — | `kind`: fest `"algorithm"` |
| `provenance` | typischerweise **nicht** 1:1 im Seed; kann ins Manifest, Metadaten-JSON oder nur in der Pipeline verbleiben |

**Hinweis:** Produktive Seed-Dateien nicht manuell „auseinanderziehen“, wenn die Quelle DBRD/normalisiert ist — immer über dokumentierten Transform aktualisieren (siehe `data/dbrd-source/README.md`).

## Typen und Validierung

Die Schemadatei ist **reines TypeScript** (keine zusätzliche Runtime-Bibliothek). Für automatische JSON-Validierung kann später optional ein Zod- oder JSON-Schema-Spiegel ergänzt werden; die Feldnamen und Semantik bleiben maßgeblich in `dbrd-normalized.schema.ts`.

## Siehe auch

- `docs/context/dbrd-import-rules.md` — Rohdatenablage, `sources.json`, Weg über `normalized`

## Abgrenzung

- **Keine** Änderung an App-Navigation, UI oder Domain-Entities.
- **Kein** Ersatz für `lookup-seed` in der laufenden App — nur Vorbereitung und Klarheit für Datenpflege und künftige Skripte unter `scripts/dbrd/`.
