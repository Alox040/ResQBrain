# Repository-Struktur (Export)

**Stand:** 12. April 2026 — manuell kuratiert (ohne `node_modules`, `.git`, Build-Artefakte). Vollständiger Deep-Tree wäre sehr groß; hier die **funktionalen** Bereiche.

```
ResQBrain/
├── app/                      # Zusätzliches App-Router-Layout am Root (nicht das Vercel-rootDirectory-Projekt)
├── apps/
│   ├── api/                  # TS-Quellen (lookup routes/handlers) — kein package.json im Ordner
│   ├── api-local/            # Workspace: lokaler API-Dienst (@resqbrain/api-local)
│   ├── mobile-app/           # Workspace: Expo-App (@resqbrain/mobile-app)
│   ├── mobile-app-lab/       # Labor/Prototyp — nicht in pnpm-workspace.yaml
│   ├── website/              # Workspace: Next.js-Website (@resqbrain/website) — Vercel-Ziel
│   └── website-lab/          # Labor — nicht in pnpm-workspace.yaml
├── components/               # Root: geteilte UI-Komponenten (Pfad @/* im Root-tsconfig)
├── content/                  # Root: Content-/Marketing-bezogene Ablage (Bestand je nach Branch)
├── data/
│   ├── dbrd-source/          # Rohquellen (z. B. PDF, normalisierte Beispiele)
│   ├── lookup-seed/          # Seed-JSON (u. a. Manifest/Medikamente/Algorithmen); Mobile-App importiert aus apps/mobile-app/data/lookup-seed/
│   └── schemas/              # dbrd-normalized Schema + Beispiele
├── docs/
│   ├── architecture/         # Kanonische Architektur-Dokumentation
│   ├── context/              # Kanonischer Produkt-/Plattform-Kontext
│   ├── context-export/       # Dieser Export (externe Analyse)
│   ├── legacy/               # Nur-Lese-Legacy
│   ├── planning/             # Planungs- und Validierungsnotizen
│   ├── roadmap/              # u. a. PROJECT_ROADMAP.md
│   └── status/               # Status-Dokumente
├── lib/                      # Root: Hilfsbibliotheken unter @/*
├── packages/
│   ├── api/                  # @resqbrain/api — Lookup-Adapter + Tests
│   ├── application/        # @resqbrain/application — Lookup- & Release-Services
│   └── domain/             # @resqbrain/domain — Domänenmodell, Engines, Policies
├── prompts/                  # Prompt-/Agent-Hilfsdateien
├── scripts/                  # DBRD-Pipeline, verify, Vercel-ignore, Status-Renderer, Validierung
├── src/                      # Root: u. a. domain/* — ältere/parallele Domain-Fassade
├── tmp/                      # Temporäre Ablage
├── package.json              # Root-Workspace-Scripts
├── pnpm-workspace.yaml       # Workspaces: api-local, mobile-app, website, packages/*
├── vercel.json               # Website-Deploy (rootDirectory apps/website)
├── tsconfig.json             # Root-TS (paths @/domain/*, @/*)
├── CLAUDE.md, README.md, …   # Projekthinweise
└── …
```

## Kurzbeschreibung je Top-Level-Ordner

| Ordner | Beschreibung |
|--------|----------------|
| **apps/** | Laufende Anwendungen: Website, Mobile, API-local; plus Lab- und api-Quellordner. |
| **packages/** | Wiederverwendbare Bibliotheken: Domain, Application, API-Schicht. |
| **docs/** | Verbindliche und exportierte Dokumentation, Roadmap, Architektur. |
| **data/** | Schemas, Quellen und Seeds für Inhalte/Pipelines. |
| **scripts/** | Automatisierung: Validierung, DBRD, Deploy-Helfer, Status-Rendering. |
| **app/, components/, lib/, src/** (Root) | Parallelstruktur zu Next unter `apps/website`; über Root-`tsconfig` verdrahtet — bei Änderungen Abgleich mit dem **tatsächlichen** Next-Projekt nötig. |
