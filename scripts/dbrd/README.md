# Skripte: DBRD → Lookup-Seed

## Zweck

Skripte in diesem Ordner unterstützen die **reproduzierbare** Verkettung:

1. Einlesen aus `data/dbrd-source/raw/` (unveränderte Quelle)
2. Normalisierung nach `data/dbrd-source/normalized/`
3. Anwendung der Mappings aus `data/dbrd-source/mappings/`
4. Ausgabe/Aktualisierung von **`data/lookup-seed/`** (Ziel für die Mobile-App)

## Regeln

- **Keine** direkte Bearbeitung produktiver App-JSONs ohne diesen (oder einen gleichwertig dokumentierten) Transform-Schritt.
- Änderungen an der App-Datenstruktur: Schema in `data/schemas/` und Mappings/Skripte hier mitziehen, dann Seed neu erzeugen.

## Platzhalter

Konkrete Kommandos und Dateien werden ergänzt, sobald die Pipeline festgelegt ist. Bis dahin dient dieser Ordner als feste Adresse im Monorepo.
