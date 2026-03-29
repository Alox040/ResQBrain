# DBRD-Datenfluss (Kontext)

**Stand:** Platzhalter-Dokument — beschreibt die beabsichtigte Datenpipeline im Monorepo, ohne App- oder Domain-Code zu ersetzen.

## Zielbild

Die **Mobile-App** liest strukturierte Lookup-Daten aus **`data/lookup-seed/`** (JSON + Manifest). Dieses Verzeichnis bleibt das **kanonische Ziel** für gebündelte App-Inhalte im aktuellen Produktstand.

DBRD-bezogene Inhalte werden **nicht** ad hoc in diesen Seed-Dateien editiert, sondern über eine nachvollziehbare Kette aus Rohdaten, Normalisierung und Mapping.

## Stufen

```mermaid
flowchart LR
  raw["raw — unveränderte Quelldaten"]
  norm["normalized — bereinigte interne Struktur"]
  map["mappings — Transform-Regeln"]
  seed["lookup-seed — App-Ziel"]
  raw --> norm --> map --> seed
```

| Stufe | Ort im Repo | Bedeutung |
|-------|-------------|-----------|
| Rohdaten | `data/dbrd-source/raw/` | Unveränderte Quelle (`raw/medications/`, `raw/algorithms/`, Metadaten `raw/meta/sources.json`). Details: `docs/context/dbrd-import-rules.md`. |
| Normalisiert | `data/dbrd-source/normalized/` | Interne, validierbare Repräsentation. Harte Prüfung: `pnpm dbrd:validate-normalized` (`scripts/dbrd/validate-normalized.ts`). |
| Mappings | `data/dbrd-source/mappings/` | Transformation von der normalisierten Struktur in das **Schema der Lookup-Seeds** — empfohlen: `pnpm dbrd:build` (= Vorprüfung + `build-lookup-seed`), Doku `mappings/normalized-to-lookup.md`. |
| Lookup-Seed | `data/lookup-seed/` | **Ziel für die App** — nur hier liegen die JSONs, die gebündelt oder zur Laufzeit geladen werden. |

## Skripte und Schemata

- **Skripte:** `scripts/dbrd/` — u. a. `pnpm dbrd:normalize` (Roh → `normalized/`), `pnpm dbrd:validate-normalized` (hartes Prüfen der normalisierten Dateien), `pnpm dbrd:build` (Validierung + Seed-Build inkl. `validateLookupBundle` wie die App). Details: `scripts/dbrd/README.md`.
- **Schemata:** `data/schemas/` — u. a. `dbrd-normalized.schema.ts` und Beispiele (`dbrd-normalized.examples.json`); siehe `docs/context/dbrd-normalized-model.md`.

## Governance-Regel

**Keine direkte Bearbeitung produktiver App-JSONs** unter `data/lookup-seed/` ohne einen definierten Transform-Schritt. So bleiben Quelle, Normalisierung und App-Ziel **rückverfolgbar** und wiederholbar.

## Abgrenzung

- Dieses Dokument beschreibt **Datenfluss und Repo-Orte**, nicht Domain-Entities oder App-Architektur.
- Änderungen an Fachmodellen oder Mobile-Code sind **nicht** Teil dieser Pipeline-Dokumentation; sie erfolgen in den jeweiligen Modulen nach den Projektregeln.

## Siehe auch

- `docs/context/dbrd-import-rules.md` — Rohimport, Trennung Quelle / Transformation / App-Ziel
- `docs/context/dbrd-normalized-model.md` — Felder und Mapping-Hinweise zum internen Normalisierungsmodell
- `data/dbrd-source/README.md`
- `data/dbrd-source/mappings/README.md`
- `scripts/dbrd/README.md`
