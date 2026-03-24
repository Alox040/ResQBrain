# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ResQBrain is a multi-tenant EMS (Emergency Medical Services) platform for managing and distributing trusted medical and operational content by Organization. It is in the architecture and early implementation phase.

## Documentation Structure

`docs/context/` and `docs/architecture/` are the **canonical sources of truth** for all platform intent, terminology, and design decisions. Always read these before making implementation choices.

### docs/context/ — Product and Platform Context
| File | Purpose |
|------|---------|
| `01-product-vision.md` | Mission, strategic direction, platform outcomes |
| `02-problem-space.md` | Problem statement and success criteria |
| `03-target-users.md` | User groups and access model expectations |
| `04-mvp-scope.md` | MVP boundaries and exit criteria |
| `05-non-goals.md` | Explicit exclusions and removed legacy assumptions |
| `06-open-questions.md` | Unresolved product, governance, and platform questions |
| `07-decision-log.md` | Key architectural and product decisions with rationale |
| `08-risk-log.md` | Active risks and mitigations |
| `09-survey-integration-plan.md` | SurveyInsight integration phasing |
| `10-platform-principles.md` | Non-negotiable platform design rules |
| `11-implementation-baseline.md` | What the prototype validated; what still needs to be built |
| `12-next-steps.md` | Prioritized implementation roadmap |

### docs/architecture/ — Technical Architecture
| File | Purpose |
|------|---------|
| `system-overview.md` | Platform scope, core flows, boundary statements |
| `domain-model.md` | All domain entities, relationships, and modeling rules |
| `content-model.md` | Content types, ContentPackage structure, lifecycle stages |
| `versioning-model.md` | Version units, lifecycle states, governance integration |
| `multi-tenant-model.md` | Tenant boundary, scope hierarchy, isolation requirements |
| `module-boundaries.md` | Module separation, prohibited couplings |
| `terminology-mapping.md` | Canonical platform terms vs prototype code names |

### docs/legacy/ — Read-Only Source Material
Raw snapshots from the prototype phase. Do not modify. Use only as input for deriving cleaned context or architecture artifacts.

## Key Platform Rules

- Every domain operation is scoped to an **Organization** (tenant boundary).
- All content (Algorithm, Medication, Protocol, Guideline) is managed through explicit **ApprovalStatus** and **Version** lifecycle — never hardcoded.
- **ContentPackage** is the release unit; once released, it is immutable.
- Architecture documents are technology-agnostic — no UI framework or backend stack assumptions.
- Use only the canonical terms from `docs/architecture/terminology-mapping.md` in new artifacts.

## Project Folder Structure

```
apps/mobile-app/          — mobile application (not yet implemented)
packages/domain/          — shared domain packages (not yet implemented)
data/schemas/             — data schemas and seed examples
docs/context/             — platform and product context (canonical)
docs/architecture/        — technical architecture (canonical)
docs/legacy/              — prototype snapshots (read-only)
scripts/                  — automation scripts (not yet implemented)
```

No build, test, or lint commands are configured yet — to be added once implementation begins.
