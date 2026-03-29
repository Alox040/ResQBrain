# DBRD-Quelldaten (Monorepo)

Dieser Bereich hält **Inhalte und Zwischenschritte** für die Aufbereitung von DBRD-bezogenen Daten. Die **Mobile-App** bezieht ihre produktiven Lookup-Daten weiterhin aus `data/lookup-seed/` — nicht aus diesen Ordnern.

## Ordner

| Ordner | Zweck |
|--------|--------|
| `raw/` | **Unveränderte Quelldaten** — Exporte, Dumps oder Lieferungen wie geliefert. Keine inhaltliche Bereinigung hier. |
| `normalized/` | **Bereinigte interne Struktur** — validierbare, konsistente Zwischenrepräsentation (z. B. nach Parsing, Duplikat-Handling, Normalisierung von Feldern). |
| `mappings/` | **Transformation ins Lookup-Seed** — Regeln, Tabellen und Hilfsdateien, die die normalisierte Struktur in das **Zielschema** der App-Seeds überführen. Details: `mappings/README.md`. |

## Regeln

1. **`data/lookup-seed/`** ist das **Ziel** für die Mobile-App (Runtime/Bundle). Nur hier liegen die JSONs, die die App direkt einliest — nach einem definierten **Transform-Schritt** aus dieser Pipeline.
2. **Keine direkte Bearbeitung** der produktiven App-JSONs unter `data/lookup-seed/` ohne dokumentierten Transform (Skript, Mapping, Review). Änderungen an Quellen oder Normalisierung laufen über `raw/` → `normalized/` → Generierung/Update des Seeds.
3. **Domain-Code und App-Logik** werden durch diese Struktur nicht ersetzt; es geht um Datenpflege und reproduzierbare Builds.

## Verwandte Dokumentation

- Datenfluss End-to-End: `docs/context/dbrd-data-flow.md`
- Skripte (wenn vorhanden): `scripts/dbrd/README.md`
- Allgemeine Schemata: `data/schemas/` (sobald definiert)
