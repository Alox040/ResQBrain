# Feature Status

## Implemented
- Root entry chain and application bootstrap (`package.json` -> `index.ts` -> `App.tsx` -> `app/mobile/navigation/RootNavigator.tsx`).
- Bottom tab plus stack navigation with working screens:
  - Home
  - Search
  - Algorithms
  - Favorites
  - Settings
  - List (typed by content type)
  - Detail (typed by content type)
- Local domain content loading for diseases, medications, symptoms, and algorithms from `src/data/seed/*.json`.
- Seed validation with Zod schemas for all four domain collections (`src/schemas/domain.ts`, `src/data/seedValidation.ts`).
- Local search index using FlexSearch with alias support and fuzzy fallback (`src/search/searchIndex.ts`, `src/search/searchAliases.ts`).
- User preferences and interaction state persistence:
  - dark mode
  - favorites
  - recently viewed
- Basic content relations in UI:
  - symptom-to-disease reference resolution in detail view.
- Test suites for:
  - loaders
  - schemas
  - seed migrations/validation
  - search index
  - app store behavior
  - profile/bundle/permission protocol logic

## Partially Implemented
- Organization/profile-based Permission model:
  - Domain and evaluator exist (`PermissionRule`, `PermissionEvaluator`, `usePermissions`).
  - UI already filters visibility when active profile context is present.
  - Current runtime profile loading supports only `profile:default` seed; no dynamic profile source.
- Content Package/profile system:
  - Types and merge logic exist (`ContentBundle`, `ProtocolProfile`, `BundleManager`, `ProfileResolver`).
  - `ContentBundle` is the code-level construct corresponding to platform term Content Package.
  - Default package file is structurally present but ships with empty collections and is hydrated from base seeds at runtime.
- Content versioning:
  - `contentVersion` fields and seed schema version/migration logic exist.
  - No end-to-end release management workflow found in runtime code.
- Data quality tooling:
  - duplicate detection and reports exist.
  - repository still contains cleanup tasks for seed text consistency and duplicate handling decisions.

## UI Mockups / Placeholder-Level UI
- No explicit mockup-only screen set found; current screens are functional.
- Placeholder behavior exists where data is missing (loading states, empty states, "entry not found", no-profile restrictions).

## Planned (Derived From Code + Docs)
- Broader profile support beyond `profile:default`.
- Extended multi-Organization content governance and packaging workflows.
- Offline synchronization model (not implemented; appears in architecture/docs as open topic).
- API integration and authentication model (listed as not yet established in documentation).
- Survey/analytics-driven prioritization architecture (documented planning context, not implemented runtime feature).

## Missing Core Systems
- Authentication and identity management.
- Backend service/API layer (no server implementation found in this repository).
- True multi-tenant runtime data isolation and tenant lifecycle operations.
- Content authoring/editorial workflow (create/review/approve/release tooling).
- Deployment topology and release channel architecture for Content Packages.
- End-to-end offline sync engine and conflict resolution workflow.
