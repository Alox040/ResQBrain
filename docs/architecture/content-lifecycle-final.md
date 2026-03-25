# Content Lifecycle Model — Final Reference
## ResQBrain Phase 0

**Version:** 1.0
**Date:** 2026-03-25
**Status:** Canonical — standalone lifecycle reference, separate from approval model
**Applies to:** Algorithm, Medication, Protocol, Guideline, ContentPackage
**Sources:** `domain-entity-blueprint.md`, `tenant-model.md`

---

## Foundational Rules

These rules apply uniformly before any lifecycle logic is evaluated.

1. **No implicit transitions.** Every state change is an explicit, named domain operation. No background process, timer, or import event may change `ApprovalStatus` without executing a named transition with a full audit record.
2. **No Survey influence.** SurveyInsight data has no read path into lifecycle logic. `insightType: SafetyConcern` does not trigger review. `priority: Critical` does not accelerate approval. The Survey Insight module is write-isolated from the Content Lifecycle module.
3. **Released artifacts are immutable.** No field of a Released entity or its Version snapshot may be changed. Correction always creates a new Version at Draft.
4. **Rejection is a normal business outcome.** `Rejected` is not an error state. It is the documented, expected result when a reviewer determines content is not ready for release. It requires no exception handling — it requires a new Version.
5. **Release only via ContentPackage.** No content entity reaches `Released` independently. The only promotion path to `Released` is inclusion in a Released ContentPackage.
6. **Tenant context is mandatory on every transition.** No lifecycle operation is valid without an explicit, verified `organizationId`.

---

## Part 1 — Lifecycle State Machine

### State Diagram

```
                            ┌─────────────────────────────────────────┐
                            │                                         │
  ┌───────┐   [submit]   ┌──┴──────┐  [approve]   ┌──────────┐       │
  │ DRAFT ├─────────────►│INREVIEW ├─────────────►│ APPROVED │       │
  └───────┘              └────┬────┘              └────┬─────┘       │
      ▲                       │                        │  [recall]   │
      │                       │ [reject]               │             │
      │                       ▼                        ▼             │
      │                  ┌──────────┐            ┌──────────┐        │
      │                  │ REJECTED │            │ REJECTED │        │
      │                  │(terminal)│            │(terminal)│        │
      │                  └──────────┘            └──────────┘        │
      │                                                               │
      └───────────────────────────────────────────────────────────────┘
                                   ↑
                          APPROVED → RELEASED (via ContentPackage only)
                                   │
                          ┌────────┴────────┐
                          │    RELEASED     │  [deprecate]   ┌────────────┐
                          │  (immutable)    ├───────────────►│ DEPRECATED │
                          └─────────────────┘                │ (terminal) │
                                                             └────────────┘
```

### State Definitions

| State        | Mutable | Terminal | Description                                                                 |
|--------------|---------|----------|-----------------------------------------------------------------------------|
| `Draft`      | Yes     | No       | Authoring in progress. Not submitted. Not distributable.                    |
| `InReview`   | No      | No       | Submitted. Locked. Awaiting approval decision outcome.                      |
| `Approved`   | No      | No       | Approved by reviewers. Eligible for ContentPackage inclusion. Not yet released.|
| `Rejected`   | No      | Yes      | Normal business outcome: content not approved. Version closed.              |
| `Released`   | No      | No       | Published via Released ContentPackage. Permanently immutable.               |
| `Deprecated` | No      | Yes      | Retired. Preserved for audit. No new distributions.                         |

**Terminal** means no further transition is possible for this Version. A new Version at `Draft` is required to continue.

---

## Part 2 — Transition Matrix

### 2.1 Content Entities (Algorithm, Medication, Protocol, Guideline)

#### Allowed Transitions

| # | From       | To           | Named Operation       | Required Capability    | Separation of Duty                     |
|---|------------|--------------|-----------------------|------------------------|----------------------------------------|
| 1 | Draft      | InReview     | `submit`              | `content.submit`       | —                                      |
| 2 | InReview   | Approved     | `approve`             | `content.approve`      | Reviewer ≠ submitter (SoD enforced)    |
| 3 | InReview   | Rejected     | `reject`              | `content.reject`       | Reviewer ≠ submitter (SoD enforced)    |
| 4 | Approved   | Released     | `release` (via pkg)   | `package.release`      | Releaser ≠ approver                    |
| 5 | Approved   | InReview     | `recall`              | `content.recall`       | OrgAdmin or designated Approver only   |
| 6 | Released   | Deprecated   | `deprecate`           | `content.deprecate`    | —                                      |

#### Prohibited Transitions

| From       | To           | Reason                                                                  |
|------------|--------------|-------------------------------------------------------------------------|
| Draft      | Approved     | Review is mandatory — no bypass.                                        |
| Draft      | Released     | Unreviewed content cannot be distributed.                               |
| Draft      | Rejected     | Rejection is a review outcome — only from InReview.                     |
| Draft      | Deprecated   | Only Released entities can be deprecated.                               |
| InReview   | Draft        | InReview is locked. Recall path requires reaching Approved first.       |
| InReview   | Released     | Review must complete before release.                                    |
| InReview   | Deprecated   | Cannot deprecate content under active review.                           |
| Rejected   | Any          | Terminal for this Version. New Version required.                        |
| Released   | Draft        | Immutable. New Version is the only correction path.                     |
| Released   | InReview     | Immutable.                                                              |
| Released   | Approved     | State regression prohibited.                                            |
| Released   | Rejected     | Immutable.                                                              |
| Deprecated | Any          | Terminal. Absolute.                                                     |

---

### 2.2 ContentPackage

ContentPackage follows the same state machine. Its transitions differ in capability names and in the additional composition constraints at release.

#### Allowed Transitions

| # | From       | To           | Named Operation    | Required Capability   | Separation of Duty                       |
|---|------------|--------------|--------------------|-----------------------|------------------------------------------|
| 1 | Draft      | InReview     | `submit`           | `package.submit`      | —                                        |
| 2 | InReview   | Approved     | `approve`          | `package.approve`     | Reviewer ≠ submitter (SoD enforced)      |
| 3 | InReview   | Rejected     | `reject`           | `package.reject`      | Reviewer ≠ submitter (SoD enforced)      |
| 4 | Approved   | Released     | `release`          | `package.release`     | Releaser ≠ package approver              |
| 5 | Approved   | InReview     | `recall`           | `package.recall`      | OrgAdmin only                            |
| 6 | Released   | Deprecated   | `deprecate`        | `package.deprecate`   | —                                        |

Prohibited transitions are identical to content entities.

---

## Part 3 — Transition Preconditions

Every precondition must be satisfied before the transition is executed. Failure of any single precondition aborts the entire operation. No partial transitions.

---

### T1 — Draft → InReview (`submit`)

**Content entities:**

| # | Precondition | Failure behavior |
|---|--------------|-----------------|
| 1 | `approvalStatus == Draft` | Reject: wrong current state |
| 2 | Actor holds `content.submit` capability within the same `organizationId` | Reject: insufficient permission |
| 3 | `organizationId` on the entity matches the actor's UserRole `organizationId` | Reject: tenant mismatch |
| 4 | `Organization.status == Active` | Reject: suspended/decommissioned org cannot initiate review |
| 5 | Structural completeness check passes for entity type (see below) | Reject: incomplete content |
| 6 | No Deprecated entity is referenced in content composition | Reject: stale reference |
| 7 | Audit record can be written | Abort: audit failure blocks transition |

**Structural completeness per type:**
- Algorithm: `decisionLogic` is present; no dangling branches
- Medication: `dosageGuidelines` contains at least one route and dose range
- Protocol: `regulatoryBasis` is populated
- Guideline: `evidenceBasis` is declared
- ContentPackage: at least one content item in composition; all referenced entities exist

**ContentPackage additional preconditions:**

| # | Precondition |
|---|--------------|
| 8 | All `{ entityId, versionId }` composition entries resolve to existing entities |
| 9 | All resolved entities carry the same `organizationId` as the package |
| 10 | `targetScope` entity — if set — exists and belongs to the same `organizationId` |

---

### T2 — InReview → Approved (`approve`)

| # | Precondition | Failure behavior |
|---|--------------|-----------------|
| 1 | `approvalStatus == InReview` | Reject |
| 2 | Approval quorum is reached per governing `ApprovalPolicy` | Wait: transition only executes when quorum resolves |
| 3 | Actor's `organizationId` matches entity's `organizationId` | Reject: tenant mismatch |
| 4 | Reviewer ≠ submitter (when `requireSeparationOfDuty: true`) | Reject: SoD violation |
| 5 | Actor holds `content.approve` (or `package.approve`) within the same Org | Reject |
| 6 | No composition entry has transitioned away from `Approved` since review started (ContentPackage) | Reject: composition drift |
| 7 | Audit record can be written | Abort |

---

### T3 — InReview → Rejected (`reject`)

| # | Precondition | Failure behavior |
|---|--------------|-----------------|
| 1 | `approvalStatus == InReview` | Reject |
| 2 | Rejection quorum is reached per governing `ApprovalPolicy` | Wait |
| 3 | Actor's `organizationId` matches entity's `organizationId` | Reject: tenant mismatch |
| 4 | Reviewer ≠ submitter (when `requireSeparationOfDuty: true`) | Reject: SoD violation |
| 5 | Actor holds `content.reject` (or `package.reject`) within the same Org | Reject |
| 6 | `rejectionRationale` is present in the quorum resolution record | Reject: rationale is mandatory |
| 7 | Audit record can be written | Abort |

**Note on Rejection:** Rejection is a normal, expected fachliche outcome. It is not an error condition, not an exception flow, and not a rollback. It is the documented result of a review process concluding that content is not ready. The `Rejected` state is terminal for this Version. The content author is expected to create a new Version at `Draft` and address the rejection rationale.

---

### T4 — Approved → Released (`release`)

This transition is exclusively triggered by the `ContentPackage.release` operation. Content entities do not transition independently.

**ContentPackage preconditions:**

| # | Precondition | Failure behavior |
|---|--------------|-----------------|
| 1 | Package `approvalStatus == Approved` | Reject |
| 2 | Actor holds `package.release` within the same `organizationId` | Reject |
| 3 | `Organization.status == Active` | Reject: suspended org cannot release |
| 4 | Actor's `organizationId` matches package's `organizationId` | Reject: tenant mismatch |
| 5 | All `{ entityId, versionId }` entries currently resolve to `approvalStatus == Approved` | Reject: composition not fully approved (drift check) |
| 6 | All resolved entities carry the same `organizationId` as the package | Reject: cross-tenant composition |
| 7 | `targetScope` entity — if set — is `Active` and within the same `organizationId` | Reject: invalid or deactivated target |
| 8 | No conflicting Released package version exists for the same `{ organizationId, targetScope, contentEntityId }` without explicit supersession declaration | Reject: conflict |
| 9 | Version snapshot for the package can be written as immutable record | Abort |
| 10 | Audit record can be written | Abort |

**Content entity co-release:** When the package transitions to `Released`, all referenced content entities simultaneously transition to `Released`. Each co-release writes its own audit record. If any co-release audit write fails, the entire release operation is aborted and rolled back.

---

### T5 — Approved → InReview (`recall`)

| # | Precondition | Failure behavior |
|---|--------------|-----------------|
| 1 | `approvalStatus == Approved` | Reject |
| 2 | Actor holds `content.recall` (or `package.recall`) | Reject |
| 3 | Actor's `organizationId` matches entity's `organizationId` | Reject: tenant mismatch |
| 4 | No Released ContentPackage currently includes this entity's `currentVersionId` (content entity recall) | Reject: cannot recall content that is already released |
| 5 | `recallRationale` provided | Reject: mandatory |
| 6 | Audit record can be written | Abort |

---

### T6 — Released → Deprecated (`deprecate`)

| # | Precondition | Failure behavior |
|---|--------------|-----------------|
| 1 | `approvalStatus == Released` | Reject |
| 2 | Actor holds `content.deprecate` (or `package.deprecate`) | Reject |
| 3 | Actor's `organizationId` matches entity's `organizationId` | Reject: tenant mismatch |
| 4 | `deprecationDate` is set | Reject |
| 5 | `deprecationReason` is populated with substantive text | Reject |
| 6 | Audit record can be written | Abort |

---

## Part 4 — Release Preconditions (Full Detail)

Release is the highest-risk transition. It is repeated here as a complete, self-contained checklist.

Before `package.release` executes, the following must all be true **at the moment of execution** — not at the moment of package approval:

```
Release Execution Checklist
─────────────────────────────────────────────────────────────
□  Package.approvalStatus == Approved
□  Actor has package.release capability
□  Actor.organizationId == Package.organizationId
□  Organization.status == Active
□  For each { entityId, versionId } in package composition:
     □  entity.approvalStatus == Approved
     □  entity.organizationId == package.organizationId
     □  versionId == entity.currentVersionId (no stale version)
□  targetScope entity is Active (if scope is Region/County/Station)
□  targetScope entity.organizationId == package.organizationId
□  No composition entry references a Deprecated entity
□  No active conflict with another Released package for same scope+content
□  Package Version snapshot write succeeds
□  All co-release audit records write succeeds
□  Package audit record write succeeds
─────────────────────────────────────────────────────────────
If ANY check fails → abort entire operation, no partial release
```

**Rollback model:** Rollback is always a forward operation. It creates a new Release record pointing to a prior approved ContentPackage Version. The prior Version must pass this same checklist at rollback execution time.

---

## Part 5 — Deprecation Rules

### Content Entity Deprecation

1. `deprecationDate` and `deprecationReason` are mandatory. The domain rejects the operation without them.
2. Existing Released packages referencing the now-deprecated Version remain valid and immutable. Deprecation does not retroactively invalidate historical releases.
3. If other non-Deprecated content entities reference this entity, the domain raises a blocking warning. Deprecation proceeds, but referencing entities must be updated before their next Release cycle reaches approval.
4. `successorContentId` should be recorded when a replacement entity exists.
5. Deprecation produces a full audit record.

### ContentPackage Deprecation

1. Mandatory fields: `deprecationDate`, `deprecationReason`.
2. Does not cascade: deprecating a package does not deprecate its constituent content entities.
3. Does not cascade inversely: deprecating all content within a package does not automatically deprecate the package.
4. Active distribution targets receive a retirement signal — distribution policy (operational concern) determines how this is actioned.

### What Deprecation Is Not

- Deprecation is not deletion. All records are preserved permanently.
- Deprecation is not equivalent to Rejection. Rejected = never shipped. Deprecated = was shipped, now retired.
- Deprecation is not a correction mechanism. Corrections produce new Versions.

---

## Part 6 — Rejection Rules

Rejection is a **normal, expected business outcome** in the content lifecycle. It is the documented result of a review process concluding that content does not meet the standards required for release.

### Rejection as a First-Class Outcome

| Property            | Value                                                                 |
|---------------------|-----------------------------------------------------------------------|
| Initiator           | Reviewer via `reject` operation (quorum-resolved per ApprovalPolicy) |
| Required input      | `rejectionRationale` — mandatory, specific, actionable                |
| Effect on entity    | `approvalStatus` transitions to `Rejected`                            |
| Effect on Version   | Version is terminal — no further transitions permitted                |
| Effect on author    | Author creates a new Version at `Draft` addressing the rationale      |
| Audit requirement   | Full audit record with actor, timestamp, rationale                    |
| Error classification | Not an error. Not an exception. A normal flow branch.               |

### What Rejection Does Not Do

- Does not delete the entity or its Version.
- Does not prevent a new Version from being created.
- Does not penalize the author in any system-enforced way.
- Does not cascade to other content entities that reference this one.
- Does not affect any Released ContentPackage that previously included earlier Versions of this entity.

### Rejection Path Forward

```
Rejected (terminal for this Version)
      │
      ▼
Author reads rejectionRationale
      │
      ▼
New Version created at Draft
(predecessor chain: new.predecessorVersionId = rejected.versionId)
      │
      ▼
Normal Draft → InReview → ... cycle
```

The Version lineage is preserved. The rejected Version is traceable in the audit history. A new Version begins the lifecycle fresh.

---

## Part 7 — Audit Requirements

### Audit Event: Required on Every Transition

A transition that cannot produce a complete, valid audit event **must not execute**. The audit write is part of the atomic transition operation.

| Field            | Type    | Required | Description                                              |
|------------------|---------|----------|----------------------------------------------------------|
| `id`             | string  | Yes      | Unique audit event identifier                            |
| `entityId`       | string  | Yes      | Entity affected                                          |
| `entityType`     | enum    | Yes      | `Algorithm \| Medication \| Protocol \| Guideline \| ContentPackage` |
| `versionId`      | string  | Yes      | Version at time of transition                            |
| `organizationId` | string  | Yes      | Tenant scope — always present, never null                |
| `fromState`      | enum    | Yes      | Prior `ApprovalStatus` value                             |
| `toState`        | enum    | Yes      | New `ApprovalStatus` value                               |
| `operation`      | enum    | Yes      | Named operation: `submit \| approve \| reject \| release \| recall \| deprecate` |
| `actorUserId`    | string  | Yes      | User identity executing the transition                   |
| `actorRoleId`    | string  | Yes      | UserRole under which capability was exercised            |
| `capability`     | string  | Yes      | Specific capability invoked                              |
| `timestamp`      | UTC     | Yes      | Exact time of transition                                 |
| `rationale`      | string  | Yes      | Free-text justification — never empty, never null        |
| `metadata`       | object  | No       | Optional: rejection rationale ref, deprecation successor |

### Audit Invariants

- Audit records are append-only. No modification or deletion after write.
- `organizationId` is a required field. Audit events without it are rejected at write time.
- Audit records are Organization-scoped and never cross-queryable between tenants.
- The audit log must be sufficient to reconstruct the full state history of any entity without reading the entity itself.

---

## Part 8 — Tenant Constraints per Transition Check

Every transition check includes a mandatory tenant validation step. This is not optional and cannot be omitted even when the actor is OrgAdmin.

| Transition | Tenant checks required |
|------------|------------------------|
| Draft → InReview | (1) `entity.organizationId` == `actor.userRole.organizationId`; (2) `Organization.status == Active`; (3) all referenced entities share `organizationId` |
| InReview → Approved | (1) `entity.organizationId` == `reviewer.userRole.organizationId`; (2) reviewer's UserRole is active and non-expired |
| InReview → Rejected | Same as Approved |
| Approved → Released | (1) `package.organizationId` == `actor.userRole.organizationId`; (2) `Organization.status == Active`; (3) every composition entry: `entity.organizationId == package.organizationId`; (4) `targetScope.organizationId == package.organizationId` |
| Approved → InReview (recall) | (1) `entity.organizationId` == `actor.userRole.organizationId` |
| Released → Deprecated | (1) `entity.organizationId` == `actor.userRole.organizationId` |

**No transition may proceed if `organizationId` is absent, null, or mismatched.** The check is the first validation step, before capability and state checks.

**Sub-scope references in transition checks:**
- `targetScope` (Region / County / Station) must resolve to an entity with `organizationId == package.organizationId`.
- UserRole `scopeTargetId` (if scoped to Region or Station) must belong to the same `organizationId` as the entity being governed.
- No cross-tenant `scopeTargetId` reference is valid at any transition point.

---

## Part 9 — Content Entities vs ContentPackage: Explicit Differences

| Dimension                  | Content Entity (Alg, Med, Proto, Guide)              | ContentPackage                                        |
|----------------------------|------------------------------------------------------|-------------------------------------------------------|
| **Reaches Released how**   | Co-released as part of a Released ContentPackage     | Directly via `package.release` operation              |
| **Release trigger**        | Implicit — triggered by package release              | Explicit — `package.release` is a named user operation|
| **Composition**            | None — atomic content units                          | References `{ entityId, versionId }` of content entities |
| **Precondition for T1 (submit)** | Structural completeness per content type       | Composition integrity: all referenced entities exist and are org-scoped |
| **Precondition for T4 (release)** | n/a (transition is driven by package)        | 10-point checklist including composition re-validation |
| **Recall path**            | `Approved → InReview` (if not yet Released)          | `Approved → InReview` (OrgAdmin only)                 |
| **Deprecation cascades**   | No — does not cascade to packages                    | No — does not cascade to content entities             |
| **Composition drift risk** | n/a                                                  | Yes — content recalled or deprecated after pkg approval invalidates release |
| **Default quorum type**    | `Unanimous` (clinical), `Majority` (Guideline)       | `Unanimous` with separate release authority           |
| **Correction path**        | New Version at Draft                                 | Recall + reassembly = new package Version at Draft    |
| **Immutability scope**     | Version snapshot of the entity fields                | Package Version snapshot includes entire composition list |
| **SoD requirement**        | Submitter ≠ approver                                 | Submitter ≠ approver; approver ≠ releaser             |

---

## Part 10 — Edge Case List

Each edge case includes: the scenario, the risk, and the required behavior.

---

### EC-01 — Content Recalled After Package Approval, Before Release

**Scenario:** Content entity is recalled (`Approved → InReview`) after the ContentPackage was approved but before `package.release` is executed.

**Risk:** Release proceeds with content no longer in `Approved` state.

**Required behavior:** Release precondition re-validates composition at execution time (not at approval time). Any entry not currently `Approved` blocks the release. The package remains in `Approved` state pending content re-approval.

---

### EC-02 — Rejected Version Reused in New Package

**Scenario:** Content entity v2 is `Rejected`. Author creates v3 at `Draft`. Before v3 is approved, a ContentPackage incorrectly attempts to include the v2 `versionId`.

**Risk:** Rejected content enters a package composition.

**Required behavior:** Package assembly (T1 precondition) validates that every composition entry resolves to `approvalStatus == Approved`. A `Rejected` version fails this check. The package submit is blocked.

---

### EC-03 — Deprecation of Content Referenced by Approved (Unreleased) Package

**Scenario:** Content entity is deprecated. A ContentPackage in `Approved` state (not yet released) includes this content's version.

**Risk:** A package is released with deprecated content.

**Required behavior:** Deprecation raises a warning against all packages in `Draft`, `InReview`, or `Approved` that reference the deprecated entity. The release precondition composition check catches this at release time: deprecated content's `approvalStatus` transitions to `Deprecated`, which is not `Approved`, blocking release.

---

### EC-04 — Package Targets Decommissioned Station

**Scenario:** ContentPackage is assembled targeting Station X. Between package approval and release, Station X is decommissioned.

**Risk:** Release is executed against a decommissioned distribution target.

**Required behavior:** Release precondition check (step 7) verifies `targetScope.status == Active` at execution time. Decommissioned Station fails this check. Release is blocked. The package may be reassembled with an updated `targetScope`.

---

### EC-05 — Organization Suspended Mid-Workflow

**Scenario:** A content entity is in `InReview` when its Organization is suspended.

**Risk:** Approval process continues under a suspended tenant.

**Required behavior:** Suspension blocks T1 (new submissions) and T4 (releases). It does not force-terminate in-progress reviews (`InReview` state). Reviewers may still submit `ApprovalDecision` records. The quorum may resolve. However, the resulting `Approved` entity cannot proceed to Release until the Organization is restored to `Active`. A suspended Organization's approval process is frozen at the release gate only.

---

### EC-06 — Rollback to Version with Deprecated Content

**Scenario:** ContentPackage v3 is the current release. A defect is found and v1 is identified as the rollback target. Since v1 was released, some of the content it references has been deprecated.

**Risk:** Rollback restores a package with deprecated content versions.

**Required behavior:** Rollback is a new `package.release` operation referencing a prior `Approved` Version. It executes the full release precondition checklist. Deprecated content references fail the composition check. The rollback is blocked. A new package Version must be assembled with non-deprecated content.

---

### EC-07 — Recall Attempted on Co-Released Content

**Scenario:** Content entity v2 was co-released as part of ContentPackage v1. A reviewer attempts to recall content entity v2 (`Approved → InReview`).

**Risk:** Released content is recalled, violating immutability.

**Required behavior:** T5 precondition (step 4) explicitly checks: no Released ContentPackage references this `currentVersionId`. If any Released package includes this version, recall is rejected. The entity is immutable as part of that release. Correction requires a new Version.

---

### EC-08 — SurveyInsight Triggers Forced Re-Review

**Scenario:** A SurveyInsight with `insightType: SafetyConcern` and `priority: Critical` is submitted against a Released Algorithm. An implementer routes this as an automatic recall trigger.

**Risk:** SurveyInsight bypasses lifecycle governance and forces a state transition.

**Required behavior:** SurveyInsight has zero write path into the lifecycle module. It cannot trigger `recall`, cannot change `approvalStatus`, cannot force `InReview`. The safety concern is visible to OrgAdmins as an advisory signal. If they determine action is required, a human actor with `content.recall` capability executes a manual recall. The SurveyInsight record is referenced in the recall audit rationale — it is not the trigger.

---

### EC-09 — Duplicate Release for Same Scope

**Scenario:** Two ContentPackages for the same `{ organizationId, targetScope }` are both in `Approved` state. Both proceed to release.

**Risk:** Two conflicting active releases for the same distribution scope.

**Required behavior:** Release precondition (step 8) checks for conflicting active releases. If a Released package already exists for the same `{ organizationId, targetScope, contentEntityId }`, the second release is blocked unless an explicit supersession record is declared. Supersession is a named operation, not an implicit override.

---

### EC-10 — Version Snapshot Missing at Release

**Scenario:** The `package.release` operation executes successfully for the approval state change, but the Version snapshot write fails at the infrastructure level.

**Risk:** A Released package has no immutable Version snapshot, violating audit and rollback requirements.

**Required behavior:** Version snapshot write is part of the atomic release operation (T4 precondition step 9). If the snapshot write fails, the entire release operation is aborted. `approvalStatus` is not updated. The package remains in `Approved` state. No partial release state is permitted.

---

### EC-11 — Two Versions of Same Entity in One Package

**Scenario:** A ContentPackage composition inadvertently contains two entries for the same `entityId` but different `versionId` values.

**Risk:** Ambiguous content version within a single package; undefined which version governs.

**Required behavior:** Package composition must be validated as a set keyed by `entityId`. Duplicate `entityId` entries are rejected at assembly time (T1 precondition). A ContentPackage may reference at most one Version per content entity.

---

### EC-12 — Audit Write Failure During Multi-Entity Co-Release

**Scenario:** A ContentPackage contains 12 content entities. During co-release, 10 audit records write successfully, but 2 fail.

**Risk:** Partial audit trail with some entities appearing released and others not.

**Required behavior:** Co-release is a single atomic operation. All audit records for all co-released entities must succeed. If any single audit write fails, the entire release operation is rolled back. All entities remain in `Approved` state. No Released state is persisted.
