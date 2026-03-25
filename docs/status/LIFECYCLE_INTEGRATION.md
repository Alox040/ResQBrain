# Lifecycle foundation integration (2026-03-25)

The Codex-generated lifecycle foundation is wired under `packages/domain/src/lifecycle/` following `implementation-guardrails.md` (Teil 1): `entities/` (value types and lifecycle state shapes) and `policies/` (structural transition preconditions, `PolicyDecision` via `shared/types`). Public exports are re-exported from `lifecycle/index.ts` for consumers such as `governance/TransitionAuthorizationPolicy.ts`.

Phase E of `implementation-order-blueprint.md` also defines `lifecycle/validators/` and `lifecycle/services/`; those folders are intentionally not added until GATE 3/GATE 4 so no empty modules are introduced.

`evaluateTransitionPolicy` does not inject satisfied structural inputs; callers must pass `lifecycleInput` when they need a full allow path. `TransitionPolicyEvaluation` carries only structural lifecycle + same-organization scope — not role or capability outcomes (caller / governance).

`packages/domain/src/index.ts` re-exports lifecycle as `export * as Lifecycle from './lifecycle'` so it does not collide with legacy `common` exports (`CONTENT_ENTITY_TYPES`, overlapping names outside `ApprovalStatus`).

## Phase C.2 — ApprovalStatus and transition evaluation (cleanup)

- **Canonical module:** `lifecycle/entities/ApprovalStatus.ts` (const object, transition map, terminal/immutable helpers).
- **`common/ApprovalStatus.ts`:** Re-exports the canonical module and adds only release-oriented helpers (`RELEASE_SOURCE_APPROVAL_STATUSES`, `isReleaseSourceApprovalStatus`) plus `APPROVAL_STATUSES` (ordered tuple) for existing call sites that iterate a list.
- **Semantic fix:** Terminal states now match the lifecycle graph everywhere (`Rejected` and `Deprecated`), replacing the old `common`-only definition that treated only `Deprecated` as terminal.

Isolated compile: `npx tsc -p packages/domain/tsconfig.lifecycle.json`.

Lifecycle tests are plain Node test runners; execute them with a TypeScript loader (for example `tsx --test packages/domain/src/lifecycle/lifecycle.*.test.ts` from the repo root when `tsx` is installed).
