# Arbeitssession — Schnappschuss

Ephemere Notiz zum aktuellen Repository-Stand. Bei Sessionwechsel oder größeren Umbauten aktualisieren.

**Ermittelt:** 2026-03-24 (lokal)

## Git

| | |
|---|---|
| Branch | `master` |
| Letzter Commit | `c71462b` — *ResQBrain foundation baseline* (2026-03-24 01:11 +0100) |
| Untracked (nicht committed) | `.cursor/`, `AGENT_RULES.md`, `prompts/`, `src/` |

## Aktueller Projektbaum

Auszug per `tree /F /A` (ohne `.git`):

```
E:\PROGRAMMIERUNG\RESQBRAIN
|   AGENT_RULES.md
|   CLAUDE.md
|   README.md
|
+---.cursor
|   \---rules
|           multi-agent.md
|
+---apps
|   \---mobile-app
+---backend
+---configs
+---data
|   \---schemas
|       \---seed
|           \---examples
+---docs
|   +---architecture
|   |       content-model.md
|   |       domain-model.md
|   |       module-boundaries.md
|   |       multi-tenant-model.md
|   |       system-overview.md
|   |       terminology-mapping.md
|   |       versioning-model.md
|   +---context
|   |       01-product-vision.md
|   |       … (01–12, siehe Verzeichnis)
|   |       WORK_SESSION.md
|   +---legacy
|   +---product
|   \---surveys
|       +---decision-inputs
|       +---exports
|       +---raw
|       \---summaries
+---packages
|   +---domain
|   |   |   index.ts
|   |   |   index.ts.txt
|   |   +---content-model
|   |   |   \---ui
|   |   |       \---shared
|   |   \---models
|   |           algorithm.ts, approval-status.ts, content-entity-base.ts,
|   |           content-package.ts, guideline.ts, index.ts, medication.ts,
|   |           organization.ts, protocol.ts, region.ts, station.ts,
|   |           user-role.ts, version.ts
|   +---shared
|   \---ui
+---prompts
|   \---system
|           codex-rules.md
+---scripts
\---src
    \---domain
        |   index.ts
        +---common       (audit.ts, enums.ts, ids.ts, scope.ts)
        +---content      (Algorithm, ApprovalStatus, ContentPackage, …)
        +---governance   (Permission.ts, UserRole.ts)
        +---insights     (SurveyInsight.ts)
        \---tenant       (County, Organization, Region, Station)
```

## Zuletzt geänderte Dateien (mtime, Arbeitsverzeichnis)

Neueste zuerst (ohne `.git`):

| Zeit (lokal) | Pfad |
|--------------|------|
| 2026-03-24 01:49 | `prompts/system/codex-rules.md` |
| 2026-03-24 01:49 | `AGENT_RULES.md` |
| 2026-03-24 01:49 | `.cursor/rules/multi-agent.md` |
| 2026-03-24 01:30 | `src/domain/common/ids.ts` |
| 2026-03-24 01:21 | `src/domain/index.ts`, `src/domain/insights/SurveyInsight.ts` |
| 2026-03-24 01:20 | `src/domain/governance/*`, `src/domain/content/*` (u. a. ApprovalStatus, Version, ContentPackage) |
| 2026-03-24 01:19 | `src/domain/content/Protocol.ts`, `Medication.ts`, `Algorithm.ts` |
| 2026-03-24 01:17 | `src/domain/tenant/*`, `src/domain/common/*` (außer später bearbeitete) |

Hinweis: Unter `src/domain/` sind die meisten `.ts`-Dateien derzeit leer oder Platzhalter; Inhalt liegt faktisch in `packages/domain/models/` (committed).

## Aktueller Fokus

- **Zwei Domain-Spuren:** committedes Paket `packages/domain/models/` vs. neues, noch untrackedes Gerüst unter `src/domain/` (Spiegelung der Architektur-Ordner: content, governance, tenant, insights, common).
- **Konkret in Bearbeitung:** Agenten-/Cursor-Regeln (`AGENT_RULES.md`, `.cursor/rules/`, `prompts/system/codex-rules.md`) und Start der ausführbaren Domain-Baseline unter `src/` — zuletzt sichtbar an `src/domain/common/ids.ts`.

## Offene TODOs (Projekt, aus Roadmap)

Aus `docs/context/12-next-steps.md` — *Immediate Priorities* (gekürzt):

1. Domain-Baseline festziehen (Typen/Verträge gemäß `docs/architecture/domain-model.md`).
2. Content-Sourcing-Architektur entscheiden (Seed, Authoring, Import).
3. Content-Lifecycle als Domain-Services (Draft → InReview → Approved → Released; ApprovalStatus + Rollen/Rechte).
4. Organization / Mandantenscope durchgängig erzwingen.
5. Profil/Rollen über Default-Profil hinaus.
6. API- und Auth-Grenzen definieren.
7. ContentPackage-Release-Mechanismus definieren.
8. Seed-Datenqualität (Deduplizierung, Textbereinigung).

Im Code: keine `TODO`/`FIXME`-Treffer in `.ts`/`.md` unter dem Repo-Root (Stand dieser Erfassung).

## Nächster Schritt

**Domain-Baseline in einem Ort konsolidieren und ausführbar machen:** `src/domain/` (oder bewusst `packages/domain/`) mit Typen und Exporten an `docs/architecture/domain-model.md` und `terminology-mapping.md` ausrichten; leere Stub-Dateien unter `src/domain/` befüllen oder mit dem bestehenden `packages/domain/models/`-Stand zusammenführen, damit Priorität 1 aus `12-next-steps.md` erfüllbar ist.
