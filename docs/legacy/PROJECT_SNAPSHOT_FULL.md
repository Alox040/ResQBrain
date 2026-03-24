# Project Snapshot (Reconstructed)

## Project Overview
`Vigor` is an EMS platform foundation in a TypeScript repository. The current implementation provides a working client entry chain, local validated medical content, search, and persisted user interaction state. The repository also contains architecture/context documentation and a large imported agent/governance layer under `.godai/agents`.

The active runtime path is defined in code:
- `package.json` (`main: index.ts`, start/test/lint/type-check scripts)
- `index.ts` (`registerRootComponent`)
- `App.tsx` (`NavigationContainer` + `RootNavigator`)
- `app/mobile/navigation/RootNavigator.tsx`

## Architecture Summary
### Runtime composition
- **UI module:** `app/mobile/` (navigation + screens).
- **Shared/domain module:** `src/` for data, schemas, search, protocols, hooks, store, and types.
- **Seed content:** `src/data/seed/*.json` (diseases, medications, symptoms, algorithms).
- **State/persistence:** Zustand stores with AsyncStorage-based persistence.
- **Validation:** Zod schemas for domain and protocol models.

### Domain and protocol model present in code
- Medical content entities:
  - Disease
  - Medication
  - Symptom
  - Algorithm
- Protocol/profile entities:
  - ContentBundle (used as Content Package in platform terminology)
  - ProtocolProfile
  - PermissionRule
  - UserContext
  - ResolvedProfile
- Permission and bundle merging logic:
  - `src/protocols/PermissionEvaluator.ts`
  - `src/protocols/BundleManager.ts`
  - `src/protocols/ProfileResolver.ts`

### Notable implementation shape
- Local seed content is validated and loaded before use.
- Search index is built locally from loaded content and queried client-side.
- Organization-aware permission filtering is integrated in UI hooks but currently constrained by default-seed profile support.
- Platform direction is visible in code through Organization (`orgId`) and Content Package (`ContentBundle`) modeling, but operational multi-organization workflows are not fully implemented.

## Folder Structure Explanation
- `app/mobile/`: client UI (screens and navigation).
- `src/data/`: seed loaders, migration/validation, quality helpers.
- `src/schemas/`: Zod schemas for content and protocol models.
- `src/store/`: application and active-profile state stores.
- `src/protocols/`: bundle/profile/permission services.
- `src/search/`: local index and aliasing.
- `tests/`: unit tests across data, schemas, store, search, and protocols.
- `docs/`: architecture/context/reports/operations documentation.
- `.godai/agents/`: agent manifests, prompts, workflows, and role files (including legacy import status).

## Implemented vs Planned Features
### Implemented
- Multi-screen navigation with category/list/detail/search/favorites/settings flows.
- Local medical content loading and schema validation.
- Search across all core content types.
- Favorites and recently viewed persistence.
- Basic permission evaluation and profile status handling in client-side logic.
- Automated tests for core data and protocol behavior.

### Planned or incomplete (repository-derived)
- Dynamic multi-profile and multi-Organization runtime behavior beyond `profile:default`.
- Full content governance lifecycle (author/review/approve/release) not implemented.
- Offline sync architecture not implemented.
- Backend/API and authentication systems not implemented in this repository.
- Deployment and release-distribution model for Content Packages not implemented.

## Known Risks
- **Documentation drift:** some documents still contain stale statements that conflict with current code reality.
- **Legacy governance surface:** `.godai/agents` remains active but includes significant legacy import content.
- **Profile support gap:** `useActiveProfileStore` currently throws for unsupported profile IDs.
- **Foundation mismatch risk:** advanced architecture docs exist while runtime remains local-seed driven.
- **Content quality risk:** existing tasks and reports indicate unresolved text/duplication cleanup in seed data.
- **Terminology drift risk:** code-level names (`bundle`, `profile`) and platform terms (Content Package, Organization model) can diverge without a documented mapping.

## Technical Debt
- Inconsistent legacy documentation quality across `docs/`.
- Default bundle is empty in seed and hydrated dynamically, which can obscure content provenance.
- Mixed architectural maturity: robust type/schema groundwork with limited production systems (auth/backend/release).
- UI quality debt tracked in docs (icon consistency, data labeling/wording cleanup).
- Legacy agent-role inventory requires continued curation to avoid process confusion.

## Missing Systems (Explicitly Not Found in Repository)
- Authentication and identity service.
- Backend data service or API contract implementation.
- Organization onboarding and tenant lifecycle operations.
- Editorial workflow tooling for content creation and approvals.
- Release orchestration pipeline for versioned Content Packages.
- Offline sync/conflict resolution engine.

## Next Logical Steps
1. Lock one canonical documentation baseline that matches current file-level truth.
2. Decide target runtime architecture for profile and organization sourcing (local-only vs remote-backed).
3. Define content package lifecycle (draft/review/approve/release) as executable domain services.
4. Implement tenant and profile expansion beyond `profile:default`.
5. Introduce explicit API/auth boundaries if remote content and multi-organization rollout are required.
6. Establish release/distribution mechanism for versioned content packages.
7. Continue seed quality cleanup and enforce migration/validation gates in CI.
