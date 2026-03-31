# Repository-Struktur (Export)

**Methode:** Verzeichnisscan Repository-Root 31. März 2026; in der Darstellung ausgelassen: `node_modules`, größere Build-Artefakte.

```
ResQBrain/
├── apps/
│   ├── mobile-app/          # Expo + React Native (Lookup MVP)
│   ├── website/             # Next.js Marketing-Site (@resqbrain/website)
│   └── website-old/         # Ältere Next.js-Site (eigenes package.json)
├── packages/
│   ├── domain/              # @resqbrain/domain — einziges Paket mit package.json unter packages/
│   ├── shared/              # Ordner ohne package.json
│   └── ui/                  # Ordner ohne package.json
├── docs/
│   ├── architecture/
│   ├── context/
│   ├── context-export/      # Dieser Export
│   ├── legacy/
│   ├── planning/
│   ├── product/
│   ├── roadmap/
│   ├── sources/
│   ├── status/
│   └── surveys/
├── data/
│   ├── lookup-seed/         # Phase-0 JSON (manifest, medications, algorithms)
│   └── schemas/             # dbrd-normalized.schema.ts, dbrd-normalized.examples.json
├── scripts/
│   ├── dbrd/                # Normalisierung, Lookup-Seed, Validierung
│   ├── status/
│   ├── utils/
│   ├── vercel-ignore.js
│   ├── validate-routing.ts
│   ├── validate-content-isolation.ts
│   └── check-german-umlauts.ts
├── prompts/
├── configs/
├── content/
├── tmp/
├── app/                     # Root: alternative Next-Seiten (nicht an Root-build gekoppelt)
├── components/              # Root: alternative UI
├── src/                     # Root: ohne Dateien im flachen Scan
├── backend/                 # Ohne Dateien im flachen Scan
├── .claude/
├── .cursor/
├── .expo/                   # Expo-Artefakte (Workspace)
├── .gitignore
├── package.json             # Root-Workspace; build → nur Website
├── pnpm-workspace.yaml
├── pnpm-lock.yaml
├── tsconfig.json            # extends expo/tsconfig.base
├── vercel.json              # Root: rootDirectory apps/website, build/install (siehe deployment.md)
├── README.md
├── CLAUDE.md
├── AGENT_RULES.md
└── ResQBrain_Project_Status.pdf
```

## Kurzbeschreibung je Hauptordner

| Ordner | Zweck (nachweisbar) |
|--------|----------------------|
| **apps/mobile-app** | Expo-App: Navigation, Screens, Lookup in `src/lookup`, `src/data`, einsatznahe Features (Favoriten, Verlauf, Dosisrechner, Vitalwerte) |
| **apps/website** | Next.js-Website: `app/`, `components/`, `lib/`; Ziel von Root-`pnpm build` |
| **apps/website-old** | Frühere Website-Variante u. a. mit `phase11:website`, `vercel.json` + `ignoreCommand` |
| **packages/domain** | Domänenlogik: Content, Governance, Versioning, Release, Lifecycle, Audit, Survey, Lookup-Entities |
| **data/lookup-seed** | Phase-0-JSON für die Mobile-App |
| **data/schemas** | DBRD-Normalisierungsschema + Beispiele |
| **scripts** | DBRD-Pipeline, Validierung, Vercel-Ignore, Status-Rendering, Helfer |
| **docs** | Architektur-, Kontext-, Status- und Roadmap-Dokumente |
| **docs/context-export** | Dieser Export |
| **app/** + **components/** (Root) | Parallele/alte Next-Struktur; nicht Root-`pnpm build` |
| **src/** (Root) | Leer im Scan |

## Workspace-Definition

`pnpm-workspace.yaml`:

```yaml
packages:
  - "apps/*"
  - "packages/*"
```

Unter `packages/` existiert nur **`packages/domain/package.json`** als definiertes Paket; `shared/` und `ui/` sind Ordner **ohne** `package.json`.

## Hinweis Vercel

- **`vercel.json` am Repository-Root** setzt u. a. `rootDirectory: "apps/website"`.
- **`apps/website/vercel.json`** existiert zusätzlich mit framework/install/build (ohne `rootDirectory` in dieser Datei im Export-Scan).
