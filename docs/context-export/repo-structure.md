# Repository-Struktur (Export)

**Methode:** Verzeichnisbaum bis Tiefe 2 (Auszug), ausgeblendet: `node_modules`, `.git`, größere `dist-*`, `.expo`. Vollständige Tiefe nur dort sinnvoll, wo explizit genannt.

```
ResQBrain/
├── apps/                    # Workspace-Apps (pnpm workspaces)
│   ├── mobile-app/          # Expo + React Native (Lookup MVP)
│   └── website/             # Next.js 16 Marketing-Site (@resqbrain/website)
├── packages/                # Workspace-Glob `packages/*`
│   ├── domain/              # @resqbrain/domain — einziges Paket mit package.json unter packages/
│   ├── shared/              # Ordner ohne package.json (leer / Platzhalter)
│   └── ui/                  # Ordner ohne package.json (leer / Platzhalter)
├── docs/                    # Kanonische und ergänzende Dokumentation
│   ├── architecture/        # Technische Architektur
│   ├── context/             # Produkt- & Plattformkontext
│   ├── context-export/      # Dieser Export (externe Analyse)
│   ├── legacy/              # Nur-Lese-Legacy-Snapshots
│   ├── planning/            # Planungsartefakte
│   ├── product/             # Produktdokus
│   ├── roadmap/             # Roadmaps
│   ├── sources/             # Referenzmaterial (Screenshots u. a.)
│   ├── status/              # Projektstatus, Sessions
│   └── surveys/             # Umfrage-Rohdaten/Exporte (Struktur)
├── data/
│   ├── lookup-seed/         # Phase-0 JSON (manifest, medications, algorithms)
│   └── schemas/             # Leer im Export-Scan (keine Dateien gefunden)
├── scripts/                 # Automatisierung: Validierung, Vercel-Ignore, Status-Renderer
├── prompts/                 # Agent-/LLM-Prompt-Vorlagen
├── configs/                 # Konfigurationsartefakte (Inhalt nicht im flachen Scan)
├── content/                 # z. B. reddit/.gitkeep
├── tmp/                     # Temporäre/abgelegte Dateien
├── app/                     # Root: alternative Next-Seiten (nicht Root-build)
├── components/              # Root: alternative UI-Sections (nicht Root-build)
├── src/                     # Root: weiteres Quellverzeichnis (leer/unbenutzt im Export nicht verifiziert)
├── backend/                 # Leer im Export-Scan
├── .cursor/                 # Editor-Regeln
├── package.json             # Root-Workspace (build → nur Website)
├── pnpm-workspace.yaml
├── pnpm-lock.yaml
├── tsconfig.json            # extends expo/tsconfig.base
├── README.md
├── CLAUDE.md
└── AGENT_RULES.md
```

## Kurzbeschreibung je Hauptordner

| Ordner | Zweck (nachweisbar) |
|--------|----------------------|
| **apps/mobile-app** | Produktive Expo-App: Navigation, Screens, Lookup-Loader, Theme |
| **apps/website** | Produktive Next.js-Website inkl. `vercel.json`, `app/` Routes |
| **packages/domain** | Domänenlogik: Content, Governance, Versioning, Release, Lifecycle, Audit, Survey, Lookup-Entities |
| **data/lookup-seed** | Eingebettete JSON-Daten für die Mobile-Phase-0 |
| **scripts** | `validate-routing`, `validate-content-isolation`, `vercel-ignore`, Status-Rendering, Git/FS-Helfer |
| **docs** | Architektur-, Kontext-, Status- und Roadmap-Dokumente |
| **docs/context-export** | Dieser Export für externe Analyse |
| **prompts** | Textvorlagen für verschiedene Tools/Agenten |
| **app/** + **components/** (Root) | Parallele Website-Struktur; nicht an `pnpm build` gekoppelt |

## Workspace-Definition

`pnpm-workspace.yaml`:

```yaml
packages:
  - "apps/*"
  - "packages/*"
```

Unter `packages/` existiert nur **`packages/domain/package.json`** als definiertes Paket; `shared/` und `ui/` sind Ordner **ohne** `package.json` (Platzhalter / leer).
</think>


<｜tool▁calls▁begin｜><｜tool▁call▁begin｜>
Shell