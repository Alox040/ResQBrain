# DBRD — Rohdaten-Import und Quellentrennung

**Stand:** März 2026 — ergänzt `dbrd-data-flow.md` und die Ordner unter `data/dbrd-source/raw/`.

## Leitprinzipien

### Rohdaten bleiben unverändert

Dateien unter `data/dbrd-source/raw/` werden **als geliefert** abgelegt. Es erfolgt **keine** inhaltliche Korrektur, kein „Nachbessern“ von Feldern und kein Überschreiben der Originaldatei im Namen der App. Alle Bereinigungen passieren **nur** in der Stufe **`normalized`** (siehe `data/dbrd-source/normalized/` und `docs/context/dbrd-normalized-model.md`).

### Keine App konsumiert `raw` direkt

Die **Mobile-App** liest ausschließlich **`data/lookup-seed/`**. Rohdaten sind **kein** Runtime-Pfad, kein Bundle-Bestandteil und kein API-Ziel. So bleiben Reproduzierbarkeit, Lizenzgrenzen und Governance von der Laufzeit getrennt.

### Jeder Import läuft über `normalized`

Ein beliebiger Rohimport (neue Datei in `raw/medications/` oder `raw/algorithms/`) wird erst **verarbeitbar**, wenn er über dokumentierte Schritte in eine **normalisierte** Repräsentation überführt wurde. Von dort aus führen **Mappings** und Skripte (`scripts/dbrd/`) zum **Lookup-Seed**. Es gibt keinen empfohlenen Shortcut „raw → Seed“ ohne diese Zwischenstufe.

### Trennung: Quelle — Transformation — App-Zieldaten

| Schicht | Ort / Artefakt | Rolle |
|---------|------------------|--------|
| **Quelle** | `raw/…` + Eintrag in `raw/meta/sources.json` | Unveränderte Lieferung, nachvollziehbare Herkunft. |
| **Transformation** | `normalized/`, `mappings/`, Pipeline-Skripte | Parsing, Validierung, Feldzuordnung, Aggregation. |
| **App-Zieldaten** | `data/lookup-seed/` | Nur hier liegen die JSONs, die die App einliest. |

### Quellenstatus und Freigabestatus dokumentierbar machen

- **Quellen- und Lizenzlage** werden auf **Lieferungs-/Dataset-Ebene** in `raw/meta/sources.json` festgehalten (z. B. `licenseStatus`, `notes`, `receivedAt`). Das beschreibt die **eingehende** Lieferung, nicht zwingend den Lebenszyklus einzelner Inhaltszeilen.
- **Inhaltliche / governance-Freigabe** einzelner Datensätze gehört ins **normalisierte Modell** (`provenance.approvalStatus`, `provenance.lastReviewedAt` in `data/schemas/dbrd-normalized.schema.ts`).

Beide Ebenen können parallel existieren: „Diese Datei ist rechtlich noch in Prüfung“ (`sources.json`) und „Dieser Datensatz ist inhaltlich freigegeben“ (`normalized`) — sie beantworten unterschiedliche Fragen.

## Ordner unter `raw/`

| Pfad | Verwendung |
|------|------------|
| `raw/medications/` | Rohdateien zu Medikamenten (CSV, JSON, PDF-Abgaben nur wenn bewusst als unveränderte Quelle archiviert). |
| `raw/algorithms/` | Rohdateien zu Algorithmen. |
| `raw/meta/sources.json` | **Katalog der Importe** — ein Eintrag pro Lieferung oder logischem Drop (siehe Felder unten). |

Pfade in `fileNames` sind relativ zu `data/dbrd-source/` (ohne dieses Präfix), damit sie im Repo eindeutig lesbar bleiben.

## Felder in `sources.json` (Beispielmodell)

Jedes Objekt im Array `sources` kann folgende Eigenschaften tragen:

| Feld | Bedeutung |
|------|-----------|
| `provider` | Lieferant oder verantwortliche Organisationseinheit / Systemname. |
| `datasetName` | Menschlich lesbarer Name der Datenlieferung. |
| `version` | Versions- oder Exportkennung der Quelle (nicht identisch mit App- oder Seed-`schemaVersion`). |
| `licenseStatus` | Freitext oder feste Kennung zur Nutzungs-/Lizenzsituation (z. B. `internalUseOnly`, `licenseReviewPending` — Konvention im Team festlegen). |
| `receivedAt` | Eingangszeitpunkt (ISO 8601). |
| `notes` | Freitext: Kontakt, Ticket, Einschränkungen, Review-Pflicht. |
| `fileNames` | Liste der zugehörigen Dateipfade (relativ zu `data/dbrd-source/`). |

Die Datei `raw/meta/sources.json` enthält **Beispieleinträge**; bei echten Importen um weitere Objekte ergänzen oder durch Pipeline anreichern.

## Siehe auch

- `docs/context/dbrd-data-flow.md`
- `docs/context/dbrd-normalized-model.md`
- `data/dbrd-source/README.md`
