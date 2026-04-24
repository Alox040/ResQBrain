# data-structure

## Zweck

- Definiert die stabilen Datenmodelle und ihre Grenzen.
- Verhindert, dass unterschiedliche fachliche Ebenen vermischt werden.
- Dient als Basis fuer Mapping, Transformation und neue Features.

## Inhalt

- Modell 1: Phase-0 Lookup-Bundle
  - mobile Seed-Daten fuer Medikamente und Algorithmen
  - Manifest, Eintraege und Suchfelder
  - fuer Offline-Lookup optimiert
- Modell 2: Plattform-Domain
  - Content, Tenant, Governance, Versioning, Lifecycle, Release, Audit, Survey
  - domanenorientiert und framework-agnostisch
  - hat andere Regeln als das Mobile-Lookup-Bundle
- Modell 3: Application / API Contracts
  - Ports, DTOs und Adapter zwischen Domain und Laufzeit
  - nur explizite Uebersetzungen, keine impliziten Shape-Annahmen
- Modell 4: Website-Content
  - Navigations-, CTA- und Informationsdaten fuer die Website
  - getrennt von fachlichen Content-Entitaeten
- Regeln:
  - ein Modell pro Zweck
  - jede Konvertierung braucht eine klare Richtung und einen Owner
  - Beispielwerte gehoeren nicht in die Kanon-Definition

## Was NICHT rein darf

- Vollstaendige Seed-Exporte, Beispiel-JSON oder Rohdatenkopien.
- Temporare Migrationsskripte oder Einmal-Konverter.
- UI-Zustand, Cache-Inhalte oder Abfrageergebnisse aus der Laufzeit.
- Vermischte Felder, die mehrere Modelle gleichzeitig bedienen sollen.
