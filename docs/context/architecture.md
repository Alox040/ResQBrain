# architecture

## Zweck

- Kanonisches technisches Modell fuer das Repository.
- Definiert Schichten, Boundaries, Datenwege und Integrationsregeln.
- Dient als gemeinsame Referenz fuer Code, Planung und Review.

## Inhalt

- Repository-Schichten:
  - Presentation: `apps/mobile-app` und `apps/website`
  - Application / Adapters: `packages/application`, `packages/api`, `apps/api-local`
  - Domain: `packages/domain`
  - Daten und Seeds: `data/`, mobile Lookup-Seeds, DBRD-Pipelines
  - Dokumentation und Steuerung: `docs/`, `scripts/`
- Boundaries:
  - Domain-Core bleibt framework-agnostisch und UI-unabhangig.
  - Mobile-Phase-0-Lookup-Modell und Plattform-Domain-Modell sind verwandt, aber nicht identisch.
  - Website-Content ist ein eigener Kanal und kein Laufzeitkern der Mobile-App.
- Integrationsregeln:
  - Ein fachlicher Begriff darf pro Schicht genau eine kanonische Darstellung haben.
  - Konvertierungen zwischen Modellen muessen explizit dokumentiert sein.
  - Offline-first bedeutet: lokale Grundfunktion ohne Serverzwang.
- Qualitatsregeln:
  - Typen, Tests und Validierungen begleiten jede Schicht.
  - Unerwartete Runtime-Kopplungen sind zu vermeiden.

## Was NICHT rein darf

- Statusmeldungen, Build-Ergebnisse oder momentane Fehlerbilder.
- Konkrete Implementierungsanweisungen auf Funktions- oder Zeilenebene.
- Roadmap-Prioritaten oder Feature-Wunschlisten.
- Temporaere Datei- oder Branch-Zustaende.
