# Repository-Struktur (Export)

**Methode:** Verzeichnisscan und `pnpm-workspace.yaml` (Stand Export: 5. April 2026). Ausgelassen in der Darstellung: `node_modules`, `.next`, größere Build-Artefakte.

```
ResQBrain/
├── apps/
│   ├── mobile-app/              # Expo (resqbrain-mobile) — Workspace
│   ├── website/                 # Next.js (@resqbrain/website) — Workspace
│   ├── website-old/             # Ältere Site, nicht im Workspace
│   ├── website-pre-v2-backup/   # Backup-Kopie, nicht im Workspace
│   └── Neuer Ordner/            # Leerer Ordner (Stand Scan)
├── packages/
│   ├── domain/                  # @resqbrain/domain
│   ├── shared/                  # ohne package.json
│   └── ui/                      # ohne package.json
├── docs/
│   ├── agents/
│   ├── architecture/
│   ├── context/
│   ├── context-export/          # Dieser Export
│   ├── legacy/
│   ├── planning/
│   ├── product/
│   ├── roadmap/
│   ├── sources/
│   ├── status/
│   └── surveys/
├── data/
│   ├── lookup-seed/
│   └── schemas/
├── scripts/
│   ├── dbrd/
│   ├── status/
│   ├── utils/
│   ├── check-german-umlauts.ts
│   ├── cleanup-algorithms.ts
│   ├── import-dbrd.ts
│   ├── transform-algorithms.ts
│   ├── validate-algorithms.ts
│   ├── validate-content-isolation.ts
│   ├── validate-routing.ts
│   └── vercel-ignore.js
├── prompts/
├── configs/
├── content/
├── tmp/
├── app/                         # Root: alternative Next-Struktur
├── components/                  # Root: alternative UI
├── src/                         # Root
├── backend/
├── .claude/
├── .cursor/
├── .expo/
├── .gitignore                   # u. a. *.zip, apps/mobile-app/ui8/_extracted/
├── package.json
├── pnpm-workspace.yaml
├── pnpm-lock.yaml
├── tsconfig.json                # extends expo/tsconfig.base
├── vercel.json                  # Root → apps/website
├── README.md
├── CLAUDE.md
├── AGENT_RULES.md
└── ResQBrain_Project_Status.pdf
```

## Kurzbeschreibung je Hauptordner

| Ordner | Zweck (nachweisbar) |
|--------|----------------------|
| **apps/mobile-app** | Expo-App: Navigation, Screens, Lookup (`src/lookup`, Resolver, optional Bundle-Update) |
| **apps/website** | Next.js: `app/`, `components/`, `lib/site/*`; Root-`pnpm build`; optional `ui8/` für Templates |
| **apps/website-old** | Frühere Site; `vercel.json` mit `ignoreCommand` |
| **apps/website-pre-v2-backup** | Backup mit eigenem `package.json` |
| **packages/domain** | Domänenlogik: Content, Governance, Versioning, Release, … |
| **data/lookup-seed** | Phase-0-JSON |
| **data/schemas** | DBRD-Normalisierung |
| **scripts** | DBRD, Validierung, Vercel-Ignore, Status, weitere Hilfsskripte |
| **docs** | Architektur, Kontext, Status, Roadmap, **agents/** |
| **docs/context-export** | Dieser Export |

## Workspace-Definition

`pnpm-workspace.yaml`:

```yaml
packages:
  - "apps/mobile-app"
  - "apps/website"
  - "packages/*"
```

Unter `packages/` ist nur **`packages/domain/package.json`** als Paket definiert; `shared/` und `ui/` ohne `package.json`.

## Hinweis Vercel

- **`vercel.json` am Repository-Root:** `rootDirectory: "apps/website"`.
- **`apps/website/vercel.json`:** framework/install/build ohne `rootDirectory`.
