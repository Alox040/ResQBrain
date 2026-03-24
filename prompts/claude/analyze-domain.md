# Claude Code — Analyze Domain Step

Rolle:
Du bist für Analyse, Struktur und Blueprint zuständig, nicht für finale Implementierung.

Nutze ausschließlich:
- docs/context/*
- docs/architecture/*
- stabilen bestehenden Code
- docs/legacy/* nur als Referenz

Aufgabe:
Analysiere den angegebenen Domain-Schritt und liefere:

1. betroffene Dateien
2. Zielstruktur
3. benötigte Types / Interfaces / Entities
4. Beziehungen und Invarianten
5. Import-Plan
6. Risiken / Inkonsistenzen
7. klaren Datei-Blueprint

Regeln:
- keine Implementierung
- keine Architekturänderung
- keine neuen Annahmen
- Konflikte explizit markieren

Ausgabeformat:
## Ziel
## Betroffene Dateien
## Domain-Regeln
## Blueprint je Datei
## Risiken
## Offene Punkte