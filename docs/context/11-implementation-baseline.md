# Implementation Baseline

## Purpose
This document captures what was validated in the prototype phase and what remains unbuilt, translated into normalized platform language. It provides orientation for implementation without carrying forward prototype-specific technical assumptions.

## Validated in Prototype

### Content Domain
- Domain entities for Algorithm, Medication, Symptom, and a precursor to ContentPackage exist in code and schema form.
- Zod-based schema validation is in place for all four core content types.
- Local seed content is loaded and validated before use; seed versioning and migration patterns are proven.

### Search
- Local full-text search index with alias support and fuzzy fallback is implemented and tested.
- Search operates client-side across all core content types.

### Permissions and Profile Model
- PermissionRule, UserRole-equivalent, and ContentPackage-equivalent types exist in code.
- Permission evaluation logic and profile-based content filtering are implemented in client hooks.
- Bundle priority and merge logic for ContentPackages is implemented and tested.

### Client UI
- Multi-screen mobile navigation with category, list, detail, search, favorites, and settings flows is functional.
- Content relationship references (symptom-to-disease) are resolved in detail views.
- User preferences and interaction state (favorites, recently viewed, dark mode) are persisted.

### Test Coverage
- Unit tests exist for loaders, schema validation, seed migrations, search index, app store behavior, and protocol/permission logic.

## Partially Implemented

### Organization and Permission Model
- Organization scoping fields exist at the type level but full runtime multi-Organization behavior is not operational.
- Permission evaluation is integrated in client hooks but is constrained to a single default profile.
- No dynamic profile source exists; profiles beyond the default throw unsupported errors at runtime.

### Content Versioning
- Version fields exist on content entities and seed schema migration logic is present.
- No end-to-end lifecycle (Draft → InReview → Approved → Released) is implemented as executable domain services.

### ContentPackage Release
- ContentPackage (bundle) type and merge logic exist.
- The default package ships with empty collections and is hydrated from base seeds at runtime.
- No Release record, distribution mechanism, or immutable release artifact system exists.

### Data Quality
- Duplicate detection tooling and reports exist.
- Seed data contains unresolved text inconsistencies and duplicate entries requiring cleanup decisions.

## Not Yet Built

- Authentication and identity management.
- Backend service or API layer.
- True multi-Organization runtime isolation and Organization lifecycle management.
- Content authoring and editorial workflow (create, review, approve, publish tooling).
- Release distribution mechanism for versioned ContentPackages to clients.
- Offline synchronization and conflict resolution.
- Survey data collection and SurveyInsight integration.

## Implications for Platform Build

- Domain entity shape, schema validation patterns, and permission evaluation logic from the prototype provide a starting reference, but must be re-evaluated against the multi-tenant and lifecycle requirements defined in `docs/architecture/`.
- No prototype code should be treated as an architectural constraint; the platform context files in `docs/context/` and `docs/architecture/` are the authoritative design baseline.
- Seed data quality cleanup is a prerequisite before any content migration into a governed content store.
