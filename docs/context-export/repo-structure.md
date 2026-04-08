# Repository-Struktur (Export)

**Methode:** Verzeichnisscan und `pnpm-workspace.yaml` (Stand Export: 8. April 2026). Ausgelassen in der Darstellung: `node_modules`, `.next`, größere Build-Artefakte.

```
ResQBrain/
├── apps/
│   ├── mobile-app/              # Expo (resqbrain-mobile) — Workspace
│   │   ├── src/
│   │   │   ├── data/adapters/   # View-Model-Adapter (Bundle → UI)
│   │   │   ├── features/        # references/VitalReferenceScreen, history/ …
│   │   │   ├── lookup/          # lookupSource, lookupBundle, contentIndex
│   │   │   ├── navigation/      # AppNavigator, Stack-Paramtypen
│   │   │   ├── screens/         # Home, Search, Favorites, History, Medication*, Algorithm*, DoseCalculator, Settings
│   │   │   ├── storage/         # AsyncStorage: Favoriten, Verlauf
│   │   │   └── theme/
│   │   ├── data/                # lookup-seed (Metro watchFolders)
│   │   ├── App.tsx              # Hydration, Bundle-Init, optional Update-Hook
│   │   └── app.json             # Expo-Metadaten
│   │
│   ├── mobile-app-lab/          # Design-Experiments — NICHT im Workspace
│   │   ├── experiments/
│   │   ├── figma-export/        # Figma-Export Mobile UI als Referenz
│   │   ├── mapping/
│   │   └── src/
│   │
│   ├── website/                 # Next.js (@resqbrain/website) — Workspace
│   │   ├── app/                 # Next.js App Router
│   │   │   ├── layout.tsx       # SiteShell, Instrument_Sans, lang="de"
│   │   │   ├── globals.css
│   │   │   ├── page.tsx         # Startseite — SectionFrame-Komposition + content.ts
│   │   │   ├── kontakt/
│   │   │   ├── links/           # TikTok-optimiert; links-bio.module.css
│   │   │   ├── mitwirkung/      # Umfrage-CTA
│   │   │   ├── mitwirken/
│   │   │   ├── updates/         # Updates-Seite + Interessen-Formular-CTA
│   │   │   ├── impressum/
│   │   │   ├── datenschutz/
│   │   │   └── not-found.tsx
│   │   │
│   │   ├── components/          # layout/, sections/, pages/, ui/
│   │   │   ├── layout/          # site-shell, site-header, site-footer, footer-nav,
│   │   │   │                    # main-nav, Section, Container, Stack
│   │   │   ├── sections/        # HeroSection, ProblemSection, … (nicht von page.tsx importiert)
│   │   │   ├── pages/           # datenschutz-page etc.
│   │   │   ├── ui/              # badge, button-link, section-frame, …
│   │   │   ├── LinkButton.tsx
│   │   │   └── site-shell.tsx
│   │   │
│   │   ├── lib/
│   │   │   ├── routes.ts        # Routen-Konstanten inkl. updates, mitwirken
│   │   │   ├── design/
│   │   │   └── site/
│   │   │       ├── content.ts   # Startseiten-Copy (primär)
│   │   │       ├── navigation.ts
│   │   │       ├── survey.ts    # surveys.active (Microsoft Forms)
│   │   │       ├── links-page.ts
│   │   │       ├── mitwirkung.ts
│   │   │       ├── updates-page.ts
│   │   │       ├── updates-form.ts
│   │   │       ├── metadata.ts
│   │   │       ├── contact-page.ts
│   │   │       ├── public-links.ts
│   │   │       ├── site-content.ts
│   │   │       └── legal/
│   │   │
│   │   ├── figma/               # Figma-Export als Referenz (nicht produktiv)
│   │   │   └── UI_UX Survey Prototype1/
│   │   ├── ui8/                 # Design-Templates (ZIPs ignoriert per .gitignore)
│   │   ├── vercel.json
│   │   └── package.json
│   │
│   ├── website-lab/             # Isolierter Figma-Architektur-Playground — NICHT im Workspace
│   │   ├── app/
│   │   ├── components/
│   │   ├── lib/
│   │   ├── figma/
│   │   └── docs/
│   │
│   ├── website-old/             # Ältere Site — NICHT im Workspace
│   │   └── vercel.json          # ignoreCommand → scripts/vercel-ignore.js
│   │
│   └── website-pre-v2-backup/   # Backup-Kopie — NICHT im Workspace
│
├── packages/
│   ├── domain/                  # @resqbrain/domain — Workspace
│   │   └── src/
│   │       ├── shared/
│   │       ├── content/
│   │       ├── governance/
│   │       ├── versioning/
│   │       ├── lifecycle/
│   │       ├── release/
│   │       ├── audit/
│   │       ├── tenant/
│   │       ├── survey/
│   │       ├── lookup/
│   │       └── index.ts         # Barrel-Export
│   ├── shared/                  # ohne package.json
│   └── ui/                      # ohne package.json
│
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
│
├── data/
│   ├── lookup-seed/             # Eingebettetes Bundle (10 Medikamente, 9 Algorithmen)
│   └── schemas/
│
├── scripts/
│   ├── dbrd/
│   ├── status/
│   ├── utils/
│   ├── verify.ts                # Orchestrierung: build → validate-routing → …
│   ├── validate-routing.ts
│   ├── validate-content-isolation.ts
│   ├── validate-algorithms.ts
│   ├── import-dbrd.ts
│   ├── transform-algorithms.ts
│   ├── cleanup-algorithms.ts
│   ├── check-german-umlauts.ts
│   ├── seed-update.mjs
│   └── vercel-ignore.js
│
├── app/                         # ⚠ Root-Level Next.js-Struktur (Zweck unklar, s. u.)
│   ├── layout.tsx
│   ├── page.tsx
│   ├── theme.css
│   ├── datenschutz/
│   ├── impressum/
│   ├── kontakt/
│   ├── links/
│   ├── mitwirken/
│   └── mitwirkung/
│
├── components/                  # ⚠ Root-Level UI-Struktur (Zweck unklar, s. u.)
│   ├── cards/
│   ├── layout/
│   ├── sections/
│   └── ui/
│
├── lib/                         # ⚠ Root-Level Content (Zweck unklar, s. u.)
│   ├── routes.ts
│   └── site/
│
├── prompts/
├── configs/
├── content/
├── tmp/
├── backend/
├── src/
├── .claude/
├── .gitignore
├── package.json
├── pnpm-workspace.yaml
├── pnpm-lock.yaml
├── tsconfig.json
├── vercel.json                  # Root → rootDirectory: "apps/website"
├── README.md
├── CLAUDE.md
├── AGENT_RULES.md
└── ResQBrain_Project_Status.pdf
```

## Kurzbeschreibung je Hauptordner

| Ordner | Zweck (nachweisbar) |
|--------|----------------------|
| **apps/mobile-app** | Expo-App: Navigation, Screens, Lookup (`src/lookup`, Resolver, optional Bundle-Update), AsyncStorage |
| **apps/mobile-app-lab** | Mobile-Design-Experiments; `figma-export/` als Figma-Referenz |
| **apps/website** | Next.js (App Router): `app/`, `components/`, `lib/`; Produktionsbuild per `pnpm build` |
| **apps/website-lab** | Isolierter Next.js-Figma-Playground (kein Workspace-Mitglied) |
| **apps/website-old** | Frühere Site; `vercel.json` mit `ignoreCommand` |
| **apps/website-pre-v2-backup** | Backup mit eigenem `package.json`, nicht im Workspace |
| **packages/domain** | Domänenlogik: Content, Governance, Versioning, Release, Audit, Lookup, Survey |
| **data/lookup-seed** | Eingebettetes Phase-0-JSON-Bundle (Medikamente, Algorithmen) |
| **data/schemas** | DBRD-Normalisierung |
| **scripts** | DBRD-Pipeline, Validierung, `verify.ts`, Vercel-Ignore, Statusskripte, `seed-update.mjs` |
| **docs** | Architektur, Kontext, Status, Roadmap, Agents |
| **docs/context-export** | Dieser Export |
| **app/ + components/ + lib/** (Root) | ⚠ Parallele Next.js-Struktur am Repo-Root — Zweck zu klären (s. u.) |

## Workspace-Definition

`pnpm-workspace.yaml`:

```yaml
packages:
  - "apps/mobile-app"
  - "apps/website"
  - "packages/*"
```

Unter `packages/` ist nur **`packages/domain/package.json`** als Paket definiert; `shared/` und `ui/` ohne `package.json`.  
**Nicht im Workspace:** `apps/website-lab`, `apps/mobile-app-lab`, `apps/website-old`, `apps/website-pre-v2-backup`.

## ⚠ Root-Level-Struktur — Offene Frage

Am Repo-Root existiert eine parallele Next.js-ähnliche Struktur (`app/`, `components/`, `lib/`), die **nicht** Teil von `apps/website/` ist und **nicht** im `pnpm-workspace.yaml` definiert ist.

| Merkmal | Root-Level | `apps/website/` |
|---------|-----------|-----------------|
| Routen | `/`, datenschutz, impressum, kontakt, links, mitwirken, mitwirkung | dieselben **plus** `/updates` |
| Startseite | eigene `page.tsx` | `SectionFrame` + `content.ts` |
| Deployment | **Nein** — Vercel zeigt auf `apps/website` | **Ja** |
| tsconfig.json | Root `tsconfig.json` mit `@/*` → Root | `apps/website/tsconfig.json` |
| Zustand | Unklar: v2-Vorbereitung oder Artefakt | Produktiv |

**Handlungsbedarf:** Klären, bereinigen oder als formales v2-Experiment separieren.

## Routing-Übersicht `apps/website/`

| Route | Datei | Status |
|-------|-------|--------|
| `/` | `app/page.tsx` | Static, SectionFrame-Komposition |
| `/kontakt` | `app/kontakt/page.tsx` | Static |
| `/links` | `app/links/page.tsx` | Static, TikTok-optimiert |
| `/mitwirkung` | `app/mitwirkung/page.tsx` | Static, Umfrage-CTA |
| `/mitwirken` | `app/mitwirken/page.tsx` | Static |
| `/updates` | `app/updates/page.tsx` | Static |
| `/impressum` | `app/impressum/page.tsx` | Static |
| `/datenschutz` | `app/datenschutz/page.tsx` | Static |

## Vercel-Konfiguration

- **`vercel.json` am Repository-Root:** `rootDirectory: "apps/website"`, `buildCommand: "pnpm --filter @resqbrain/website build"`, `outputDirectory: "apps/website/.next"`.
- **`apps/website/vercel.json`:** framework/install/build ohne `rootDirectory` und ohne `ignoreCommand`.
- **`apps/website-old/vercel.json`:** `ignoreCommand` → `node ../../scripts/vercel-ignore.js`.
