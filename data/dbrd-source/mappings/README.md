# Mappings: Von normalisiert zu Lookup-Seed

## Zweck

Hier liegen Artefakte, die die **bereinigte interne Struktur** (`../normalized/`) in die **Struktur der Mobile-App-Seeds** überführen:

- Mapping-Tabellen (z. B. CSV/JSON: Quellfeld → Zielfeld)
- Konfiguration für Transform-Skripte unter `scripts/dbrd/`
- optional: Referenzlisten, Konstanten, die nur der Generierung dienen

## Grenzen

- **Nicht** die Rolle von `../raw/` (unveränderte Quelle) oder `../normalized/` (fachlich/technisch bereinigtes Modell).
- **Nicht** der Ersatz für `data/lookup-seed/` — das Seed bleibt das **einzige** konsumierte Ziel für die App; Mappings erzeugen oder aktualisieren es nur über einen **expliziten Schritt** (Skript, CI, manueller Lauf mit Review).

## Hinweis

Produktive JSONs unter `data/lookup-seed/` nicht „von Hand“ patchen, wenn die Änderung aus DBRD-Daten kommt: erst Pipeline anpassen oder erweitern, dann Seed neu erzeugen.
