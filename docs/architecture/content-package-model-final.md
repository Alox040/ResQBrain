# ContentPackage Model — Final Reference
## ResQBrain Phase 0

**Version:** 1.0
**Date:** 2026-03-25
**Status:** Canonical — standalone ContentPackage reference
**Sources:** `domain-entity-blueprint.md`, `tenant-model.md`, `version-model-final.md`,
             `content-lifecycle-final.md`, `approval-model-final.md`

---

## Role of the ContentPackage

The ContentPackage is the **atomic release unit** of the platform. It is the only mechanism by which content reaches operational distribution. No content entity is ever released independently.

Three things make a ContentPackage distinct from the content it carries:

1. **It is a deliberate assembly decision.** Someone chose which content versions to include, for which scope, at which point in time.
2. **It has its own governance.** The ContentPackage goes through its own `Draft → InReview → Approved → Released` lifecycle, independent of the content entities it contains.
3. **It is the unit of rollback.** When a defect is found in released content, the rollback target is a prior ContentPackage Version — not individual content versions.

---

## Part 1 — ContentPackage Structure

### 1.1 Identity Fields

| Field            | Type   | Required | Mutable     | Description                                                    |
|------------------|--------|----------|-------------|----------------------------------------------------------------|
| `id`             | string | Yes      | Never       | Stable, globally unique package identifier                     |
| `organizationId` | string | Yes      | Never       | Tenant boundary — immutable after creation                    |
| `slug`           | string | No       | By OrgAdmin | Short human-readable identifier within the Organization        |

### 1.2 Descriptive Fields

| Field              | Type   | Required | Mutable        | Description                                                 |
|--------------------|--------|----------|----------------|-------------------------------------------------------------|
| `title`            | string | Yes      | Until Released | Human-readable name of the package                          |
| `label`            | string | No       | Until Released | Short operational label (e.g., "Q1-2026-Cardiac")          |
| `description`      | string | No       | Until Released | Purpose and scope summary                                   |
| `releaseNotes`     | string | No       | Until Released | What changed in this version vs predecessor                 |
| `targetAudience`   | list   | No       | Until Released | UserRole types this package is intended for (advisory only) |

### 1.3 Scope and Applicability Fields

| Field                    | Type   | Required | Mutable        | Description                                                        |
|--------------------------|--------|----------|----------------|--------------------------------------------------------------------|
| `targetScope`            | object | Yes      | Until Released | `{ scopeLevel, scopeTargetId }` — primary distribution target      |
| `applicabilityScopes`    | list   | No       | Until Released | Additional `{ scopeLevel, scopeTargetId }` for multi-scope rollout |
| `excludedScopes`         | list   | No       | Until Released | Explicit exclusions within the Organization's scope hierarchy      |

**`targetScope`** is the primary release target. `applicabilityScopes` extends distribution to additional Regions, Counties, or Stations within the same Organization. `excludedScopes` narrows a broad target (e.g., target = Organization-wide, excluded = [Station X, Station Y]).

All scope entries must belong to the same `organizationId` as the package. No scope entry creates a new tenant boundary.

### 1.4 Lifecycle and Versioning Fields

| Field               | Type   | Required | Mutable     | Description                                               |
|---------------------|--------|----------|-------------|-----------------------------------------------------------|
| `approvalStatus`    | enum   | Yes      | System only | Current lifecycle state — never set directly              |
| `currentVersionId`  | string | Yes      | System only | Reference to the active ContentPackage Version record     |
| `createdAt`         | UTC    | Yes      | Never       | Package creation timestamp                                |
| `createdBy`         | string | Yes      | Never       | UserRole id of the creator                                |

### 1.5 Composition Fields (on ContentPackage Version, not on the Package entity itself)

Composition is stored on the **ContentPackage Version record**, not on the ContentPackage entity. The entity is the stable identity; the Version is the snapshot of what it contained at a point in time.

| Field                  | Type   | Required | Description                                                            |
|------------------------|--------|----------|------------------------------------------------------------------------|
| `algorithms`           | list   | No       | `[{ algorithmId, versionId }]` — explicit version references           |
| `medications`          | list   | No       | `[{ medicationId, versionId }]`                                        |
| `protocols`            | list   | No       | `[{ protocolId, versionId }]`                                          |
| `guidelines`           | list   | No       | `[{ guidelineId, versionId }]`                                         |
| `compatibilityNotes`   | string | No       | Free-text inter-package compatibility declarations                     |
| `dependencyNotes`      | list   | No       | Structured dependency declarations — see Part 5                        |

**At least one composition entry (across all four types) is required before a ContentPackage Version can be submitted for review.**

### 1.6 Approval Binding

The ContentPackage Version that is submitted for review is the one that carries the approval context. An `ApprovalDecision` references the ContentPackage Version's `id`, not the ContentPackage entity's `id`. If the package is recalled and reassembled, a new ContentPackage Version is created and all prior approvals for the previous version become stale.

---

## Part 2 — Composition Rules

### R-01 — Explicit versionIds Only

Every composition entry must specify an explicit `versionId`. There is no "include latest version" mechanism. The exact Version to include must be named.

```
Valid:   { algorithmId: "alg-001", versionId: "ver-042" }
Invalid: { algorithmId: "alg-001", versionId: "latest" }
Invalid: { algorithmId: "alg-001" }  // versionId omitted
```

### R-02 — No Implicit Content Inclusion

Content is not automatically included in a package because it exists in the Organization. Each composition entry is an explicit authoring decision. No rule, tag, category match, or audience match causes automatic inclusion.

### R-03 — No Cross-Tenant Entries

Every composition entry's `algorithmId` / `medicationId` / `protocolId` / `guidelineId` must resolve to a content entity with `organizationId == package.organizationId`. Cross-organization content references are prohibited in Phase 0.

### R-04 — No Duplicate entityId Per Type

A ContentPackage Version may contain at most one entry per `entityId` within each content type. Including Algorithm-A at version 2 and Algorithm-A at version 3 in the same package is prohibited. Identity is `entityId`, not `versionId`.

```
Invalid: [{ algorithmId: "alg-001", versionId: "ver-2" },
          { algorithmId: "alg-001", versionId: "ver-3" }]
// Same algorithmId appears twice — rejected at assembly
```

### R-05 — Composition Is Atomic at Version Write

Once a ContentPackage Version record is written, its `composition` is frozen. Adding, removing, or changing an entry requires creating a new ContentPackage Version. There is no "edit composition" operation — only "create new version with revised composition."

### R-06 — Referenced Versions Must Exist

Every `versionId` in the composition must reference an existing Version record within the same `organizationId`. Assembly validation checks existence of all referenced versions before the ContentPackage Version is written.

### R-07 — Composition Is Not Typed-Required

A ContentPackage Version is not required to contain all four content types. A package may contain only Algorithms, or only Medications and Protocols. The constraint is: at least one entry total.

### R-08 — Content Types Are Not Ordered

The four composition lists (`algorithms`, `medications`, `protocols`, `guidelines`) have no internal ordering. Two ContentPackage Versions with identical composition entries but in different list order are considered equivalent for conflict detection purposes.

---

## Part 3 — Invariants

### I-01 — All Content Belongs to the Same Organization

Every content entity referenced in the composition must have `organizationId == package.organizationId`. This is validated at assembly time (Version write) and re-validated at release time.

### I-02 — All Referenced Versions Must Exist at Assembly

Version records must exist at the time the ContentPackage Version is written. References to non-existent versions are rejected.

### I-03 — No Duplicate entityId Within a Type

Enforced at assembly. See R-04.

### I-04 — Release Only With Approved Package Version

The ContentPackage entity must be in `approvalStatus == Approved` for a Release to execute. Specifically: the `currentVersionId` (the ContentPackage Version under governance) must be the one that was approved. A stale approval (from a prior ContentPackage Version) does not authorize release of a current Version.

### I-05 — Release Only With Approved Content Versions

At the moment of release execution (not at approval time), every composition entry must resolve to a content entity with `approvalStatus == Approved`. This is a runtime re-validation. If any composition entry fails this check, the release is blocked.

### I-06 — Deprecated Content Blocks Release

A composition entry whose content entity has `approvalStatus == Deprecated` fails the release precondition. Deprecated entities are not `Approved`. They cannot be included in a new release.

### I-07 — Package Is Immutable After Release

Once a ContentPackage transitions to `Released`, no field on the entity or its current ContentPackage Version may be changed. `title`, `label`, `description`, `releaseNotes`, `composition`, `targetScope`, `applicabilityScopes`, `excludedScopes` — all frozen.

### I-08 — targetScope Must Be Within the Same Organization

All entries in `targetScope`, `applicabilityScopes`, and `excludedScopes` must resolve to entities (Region, County, Station, or Organization) with `organizationId == package.organizationId`.

### I-09 — No Conflicting Active Releases for Same Scope + Content

Two Released ContentPackages targeting the same `{ organizationId, targetScope }` may not contain conflicting released versions of the same content entity. Conflict detection runs at release execution time. See Part 4 for partial rollout rules.

### I-10 — No Implicit Re-Approval for Identical Composition

Assembling a new ContentPackage Version with an identical composition to a prior Approved Version does **not** carry that approval forward. Each ContentPackage Version requires its own approval cycle. Structural similarity is not a governance justification.

---

## Part 4 — Scope / Applicability Model

### Primary Scope vs Applicability

```
Organization (always the tenant boundary)
  │
  └── ContentPackage
        ├── targetScope         → Primary distribution target
        │     (Organization-wide | Region | County | Station)
        │
        ├── applicabilityScopes → Additional targets within same Organization
        │     [{ scopeLevel, scopeTargetId }, ...]
        │
        └── excludedScopes      → Explicit carve-outs within targetScope
              [{ scopeLevel, scopeTargetId }, ...]
```

### Scope Hierarchy Resolution

When `targetScope` is Organization-wide, the package applies to all Regions, Counties, and Stations within that Organization unless explicitly excluded via `excludedScopes`.

When `targetScope` is a Region, the package applies to all Counties and Stations within that Region.

When `targetScope` is a County, the package applies to all Stations within that County.

When `targetScope` is a Station, the package applies only to that Station.

### Partial Rollout Within an Organization

A partial rollout is a valid release strategy. It is modeled as:

**Option A — Multiple ContentPackages:** Create separate ContentPackage records per target sub-scope. Each has its own governance, release record, and version history. Rollout coordination is operational.

**Option B — Single Package with applicabilityScopes:** One ContentPackage with `targetScope: Organization` and `applicabilityScopes: [Station-A, Station-B, Station-C]`. The release is a single record. The active release applies only to the named applicability scopes.

**Option C — Organization-wide with excludedScopes:** `targetScope: Organization`, `excludedScopes: [Station-D, Station-E]`. Applies to the entire Organization except the excluded units.

In all cases: the scope entries do not create new tenant boundaries. The Organization remains the single governance and data ownership boundary.

### Scope Narrower Than Content Applicability

A content entity may have its own `applicabilityScope` (Region or Station). A ContentPackage may include that content entity but target a scope that is broader or narrower than the content's own applicability declaration.

**Rule:** The ContentPackage scope governs distribution. The content entity's `applicabilityScope` is metadata — it does not restrict which packages may include the content. The operational interpretation of scope mismatch is a warning (see Part 5), not a hard block.

---

## Part 5 — Compatibility / Dependency Rules

### Dependency Notes Model

`dependencyNotes` is a structured list of declarations about relationships between this ContentPackage and other packages or content items. Each entry has the following fields:

| Field              | Type   | Required | Description                                                         |
|--------------------|--------|----------|---------------------------------------------------------------------|
| `dependencyType`   | enum   | Yes      | `Requires \| Supersedes \| Conflicts \| RecommendsAlongside`        |
| `targetEntityType` | enum   | Yes      | `ContentPackage \| Algorithm \| Medication \| Protocol \| Guideline`|
| `targetEntityId`   | string | Yes      | The entity this dependency refers to                                |
| `targetVersionId`  | string | No       | If version-specific; null means "any version of this entity"        |
| `severity`         | enum   | Yes      | `Warning \| HardBlock`                                              |
| `rationale`        | string | Yes      | Human-readable explanation                                          |

### Dependency Types

| Type                  | Meaning                                                                                  |
|-----------------------|------------------------------------------------------------------------------------------|
| `Requires`            | This package requires the named entity/version to also be active at the distribution target |
| `Supersedes`          | This package supersedes the named entity/version; the named one should be deprecated      |
| `Conflicts`           | This package is incompatible with the named entity/version being active simultaneously    |
| `RecommendsAlongside` | Advisory: the named entity is recommended to be used alongside this package              |

### Warning vs Hard Block

| Severity    | Effect at Release Time                                                                    |
|-------------|-------------------------------------------------------------------------------------------|
| `HardBlock` | Release is blocked until the dependency condition is resolved                             |
| `Warning`   | Release proceeds; warning is recorded in audit and surfaced to the releaser               |

**Hard blocks are checked at release execution time.** A `HardBlock` dependency that cannot be resolved prevents the `Approved → Released` transition.

**Warnings do not block release.** They are recorded in the Release Version audit record with `dependencyWarnings: [...]`. Distribution consumers receive the warning signal.

### Compatibility Notes

`compatibilityNotes` is a free-text field for human-readable compatibility declarations that do not fit the structured `dependencyNotes` model. It is informational only — not evaluated by domain logic. It is preserved in the ContentPackage Version snapshot.

### Medication + Protocol Incompatibility

A specific governance scenario: a Medication Version and a Protocol Version may be clinically incompatible (e.g., the Protocol references a different Medication formulation). This is modeled as a `Conflicts` dependency note with `severity: HardBlock` between the two entities.

The domain does not introspect content fields to detect clinical incompatibilities automatically. Incompatibility declarations are authored by the package assembler and reviewed as part of the package approval process.

---

## Part 6 — Lifecycle and Approval Integration

### Package Has Its Own Lifecycle

ContentPackage follows the same `Draft → InReview → Approved → Released → Deprecated` lifecycle as content entities. This lifecycle is governed by the same Approval Model and the same Lifecycle rules.

**Package approval and content approval are completely independent.** Both must be satisfied before a Release can execute. The package can be approved while some of its content is still in `Draft` — but release will be blocked until all content reaches `Approved`.

### Package Lifecycle Flow

```
Package in Draft
  │  [content can change freely until submit]
  │  [composition built by assembler]
  ▼
Package in InReview  ◄────── composition frozen
  │  [package approval process runs independently]
  │  [content may still move through its own lifecycle in parallel]
  ▼
Package Approved
  │  [content must now be Approved too, evaluated at release time]
  │  [stale content approval → release blocked, not package re-review]
  ▼
Package Released  ◄────── only when composition re-validation passes
  │
  ▼
Package Deprecated
```

### No Implicit Re-Approval

If a ContentPackage Version 1 was `Approved` and is then recalled, reassembled into Version 2 with the same composition, Version 2 does not inherit the approval from Version 1. Version 2 requires its own `InReview → Approved` cycle. Structural identity between versions is not a governance bypass.

**Exception that does not exist:** There is no "fast-track" approval for identical compositions in Phase 0. Organizations may define shorter `reviewWindowDays` in their policy, but the approval cycle cannot be skipped.

### Composition Drift After Package Approval

If content entity status changes after the ContentPackage is approved but before release:

| Content status change         | Effect on package                                              |
|-------------------------------|----------------------------------------------------------------|
| Content recalled to InReview  | Package release blocked — content no longer Approved          |
| Content deprecated            | Package release blocked — Deprecated ≠ Approved               |
| Content re-approved (after recall + re-review) | Package release proceeds (no package re-review needed) |
| New Version created for content | Package release blocked — composition entry now stale (versionId mismatch) |

**Critical:** When a new Version of a content entity is created, the `versionId` in the package composition becomes stale. The composition entry references the old version, which may still be `Approved` — but the entity's `currentVersionId` is now pointing to the new Version. The release precondition must check that `composition.versionId == entity.currentVersionId`, not just that the entity is `Approved`.

---

## Part 7 — Release Integration Rules

### Release References Exactly One ContentPackage Version

A Release Version record references exactly one `packageVersionId`. Multiple ContentPackage Versions cannot be bundled into a single Release.

### compositionSnapshot Is Copied at Release

When a Release Version record is created, the full `composition` list from the ContentPackage Version is copied into the Release record as `compositionSnapshot`. This snapshot is independent of the ContentPackage Version record. The Release audit record is fully self-contained.

### One Active Release Per Scope

For any `{ organizationId, targetScope }` pair, at most one Release Version has `status == Active`. A new release for the same scope must be structured as an `Update` (supersedes prior) or `Rollback`.

### Released Package Versions Are Never Mutated

Once a ContentPackage Version is referenced by a Released record, it is immutable in all fields. No field, including `releaseNotes`, `compatibilityNotes`, or `dependencyNotes`, may be changed retroactively.

### Rollback Targets a Prior ContentPackage Version

A rollback is a new Release Version of type `Rollback` that references a prior ContentPackage Version id. The prior version must:
1. Have `lineageState` including `Released` or `Approved`
2. Have all composition entries resolve to non-Deprecated content entities at rollback execution time

If condition 2 fails, the rollback is blocked. A new ContentPackage Version must be assembled.

### Deprecating a Package Does Not Affect Release Records

When a ContentPackage transitions to `Deprecated`, existing Released records remain active until explicitly superseded by a new Release or Rollback. Deprecation signals intent to retire — it does not automatically withdraw distribution.

---

## Part 8 — Audit Requirements

### Package Version Creation Record

| Field                    | Required | Description                                                        |
|--------------------------|----------|--------------------------------------------------------------------|
| `packageVersionId`       | Yes      | Newly created ContentPackage Version id                            |
| `packageId`              | Yes      | Parent ContentPackage id                                           |
| `organizationId`         | Yes      | Tenant scope                                                       |
| `versionNumber`          | Yes      | Version number assigned                                            |
| `predecessorVersionId`   | Yes      | Prior version id (null for v1)                                     |
| `createdBy`              | Yes      | UserRole id of the assembler                                       |
| `createdAt`              | Yes      | UTC timestamp                                                      |
| `changeReason`           | Cond.    | Required for v2+                                                   |
| `compositionAdded`       | Yes      | List of `{ entityId, versionId, entityType }` added vs predecessor |
| `compositionRemoved`     | Yes      | List of `{ entityId, versionId, entityType }` removed vs predecessor|
| `compositionUnchanged`   | Yes      | Entries carried over from predecessor unchanged                    |
| `scopeChanges`           | Yes      | Changes to `targetScope`, `applicabilityScopes`, `excludedScopes` vs predecessor |

### Package Approval Transition Record

Standard lifecycle audit record (see `content-lifecycle-final.md` §7), with `entityType: ContentPackage`.

### Release Execution Record

| Field                    | Required | Description                                                        |
|--------------------------|----------|--------------------------------------------------------------------|
| `releaseVersionId`       | Yes      | Release Version id                                                 |
| `packageVersionId`       | Yes      | ContentPackage Version released                                    |
| `organizationId`         | Yes      | Tenant scope                                                       |
| `releasedBy`             | Yes      | UserRole id                                                        |
| `releasedAt`             | Yes      | UTC timestamp                                                      |
| `targetScope`            | Yes      | Resolved distribution target                                       |
| `applicabilityScopes`    | Yes      | Full resolved applicability scope list                             |
| `excludedScopes`         | Yes      | Full excluded scope list                                           |
| `compositionSnapshot`    | Yes      | Full copy of composition at release time                           |
| `dependencyWarnings`     | No       | Any `Warning`-severity dependency notes active at release          |
| `releaseType`            | Yes      | `Initial \| Update \| Rollback`                                    |
| `supersededReleaseId`    | Cond.    | Required for Update and Rollback types                             |

---

## Part 9 — Edge Cases

---

### EC-01 — Same Content Entity, Different Version, Same Package

**Scenario:** Assembler attempts to add Algorithm-A at version 2 and Algorithm-A at version 3 to the same ContentPackage Version.

**Risk:** Ambiguous which version governs; runtime confusion.

**Required behavior:** R-04 enforced at assembly: at most one entry per `entityId` within each content type. Second entry for the same `entityId` is rejected at ContentPackage Version write time.

---

### EC-02 — Package With Mixed Approval States at Release

**Scenario:** ContentPackage is `Approved`. At release time: Algorithm-A is `Approved`, Medication-B was recalled back to `InReview`, Protocol-C is `Approved`.

**Risk:** Release executes with a non-Approved composition entry.

**Required behavior:** Release precondition re-validates all composition entries at execution time. Medication-B is `InReview` — not `Approved`. Release is blocked. Package remains in `Approved` state. When Medication-B reaches `Approved` again (completes review), release can be re-attempted without package re-approval.

---

### EC-03 — Package Contains Deprecated Content

**Scenario:** ContentPackage is `Approved`. Between approval and release, Medication-B is deprecated.

**Risk:** A package with deprecated content is distributed.

**Required behavior:** `Deprecated` ≠ `Approved`. Release precondition fails for the deprecated entry. Release blocked. Package must be recalled, Medication-B replaced with an `Approved` (non-deprecated) version, new ContentPackage Version assembled, and re-approved.

---

### EC-04 — Package Scope Narrower Than Content Applicability

**Scenario:** Algorithm-A has `applicabilityScope: Organization-wide`. ContentPackage targets only Station-X. The Algorithm is included.

**Risk:** Content intended for all Stations is only released to one.

**Required behavior:** This is a valid configuration. The ContentPackage scope governs distribution — not the content entity's `applicabilityScope`. The content entity's scope declaration is metadata/advisory. The package assembler consciously chose a narrower distribution target. If this is operationally unintended, a `Warning`-severity dependency note can be added to surface this discrepancy during review. No hard block applies.

---

### EC-05 — Identical Composition, New Release Notes Only

**Scenario:** ContentPackage Version 3 has the same composition as Version 2 but updated `releaseNotes`.

**Risk:** Assembler expects to bypass approval because "nothing content-wise changed."

**Required behavior:** I-10 enforced. A new ContentPackage Version always requires its own approval cycle. `releaseNotes` is part of the package version metadata — changing it requires a new version. The approval process validates the package as a whole, not just its composition. No shortcut approval for editorial-only changes exists in Phase 0.

---

### EC-06 — Package Update Without Content Change

**Scenario:** ContentPackage Version 4 is assembled to update `targetScope` (expanding from Region-A to Organization-wide) but the composition is identical to Version 3.

**Risk:** Scope expansion bypasses approval; assembler assumes scope change is not a governance event.

**Required behavior:** Scope changes are part of the ContentPackage Version record (`targetScope`, `applicabilityScopes`). Any change — including scope-only changes — creates a new ContentPackage Version requiring approval. Scope expansion to Organization-wide is a governance decision, not a configuration change. `compositionAdded: []`, `compositionRemoved: []`, `scopeChanges: [...]` are all recorded in the version creation audit record.

---

### EC-07 — Incompatible Medication and Protocol Combination

**Scenario:** The package contains Medication-A (v2) and Protocol-B (v1). Protocol-B's clinical content references Medication-A (v1, a different formulation). The combination is clinically inconsistent.

**Risk:** Incompatible content is co-released.

**Required behavior:** The domain does not auto-detect clinical incompatibility. The package assembler must declare a `Conflicts` dependency note with `severity: HardBlock` between Medication-A (v2) and Protocol-B (v1). This is part of the assembly decision. During package review, the approvers are responsible for catching undeclared incompatibilities. If a `HardBlock` conflict exists and is not resolved before release execution, the release is blocked. If the conflict is undeclared, it is a governance gap — not a domain model failure.

---

### EC-08 — Content Removed From Successor Package

**Scenario:** ContentPackage Version 3 contained Algorithm-A, Medication-B, Protocol-C. ContentPackage Version 4 (successor) contains only Algorithm-A and Protocol-C — Medication-B was removed.

**Risk:** Distribution targets that relied on Medication-B from the package no longer receive it after the update release.

**Required behavior:** Removal is a valid assembly decision. The version creation audit records `compositionRemoved: [{ medicationId: "med-B", versionId: "ver-3" }]` and `changeReason` must explain the removal. Reviewers validate the removal as part of the package approval process. The release note should document the removal for distribution target operators. No hard constraint prevents removal — but the audit trail is complete.

---

### EC-09 — Partial Rollout Across Stations, One Station Blocked

**Scenario:** A ContentPackage targets 5 Stations via `applicabilityScopes`. Station-3 was decommissioned between package approval and release.

**Risk:** Release fails for Station-3 entry, blocking the entire release.

**Required behavior:** Release precondition checks all scope entries (both `targetScope` and `applicabilityScopes`). A Decommissioned Station fails the `Active` status check. Two paths:

**Option A:** The package is recalled, `applicabilityScopes` updated to remove Station-3, new ContentPackage Version assembled and approved. Then released.

**Option B:** If the Organization has a policy permitting release with decommissioned scope exclusions via `excludedScopes`, Station-3 is added to `excludedScopes` in the new version.

No partial release (releasing to 4 of 5 stations from a single Release record) is supported in Phase 0.

---

### EC-10 — Stale Package Approval After Content Re-Version

**Scenario:** ContentPackage Version 2 was approved with Algorithm-A at v3. Algorithm-A was then recalled, edited, and re-approved as v4 (new Version). ContentPackage Version 2's composition still references Algorithm-A v3.

**Risk:** A release attempt uses a composition entry that references a now-superseded version.

**Required behavior:** Release precondition checks `composition.versionId == entity.currentVersionId`. Algorithm-A's `currentVersionId` is now v4. The ContentPackage Version 2 composition entry references v3 — a stale versionId. Release is blocked.

**Path forward:** ContentPackage is recalled → new ContentPackage Version 3 assembled with Algorithm-A v4 → Version 3 goes through `InReview → Approved` → release proceeds.

**Important distinction:** This does not require package re-approval from scratch if the only change was updating the Algorithm version. The new ContentPackage Version 3 has a diff of `compositionAdded: [alg-A v4]` and `compositionRemoved: [alg-A v3]`. The approval process for Version 3 focuses on validating this specific change.

---

## Part 10 — Hard Constraints for Implementation

### HC-CP-01 — Composition Stored on Version, Not on Entity

The ContentPackage entity record does not contain `composition`. Composition is stored exclusively on the ContentPackage Version record. The entity contains only the stable identity and lifecycle fields.

### HC-CP-02 — Every Composition Entry Requires Both entityId and versionId

No composition entry is valid without both fields populated. Assembly validation rejects incomplete entries before the ContentPackage Version record is written.

### HC-CP-03 — No Duplicate entityId Within Composition Type

Validated at assembly time. Duplicate entityId entries within the same content type (`algorithms`, `medications`, `protocols`, `guidelines`) are rejected. The same entity at two different versions cannot coexist in one package.

### HC-CP-04 — All Composition Entries Cross-Checked Against Organization at Write

At ContentPackage Version write time: every referenced `entityId` must resolve to a content entity with `organizationId == package.organizationId`. Cross-tenant entries are rejected.

### HC-CP-05 — Release Preconditions Re-Validated at Execution Time

Approval state and composition validity are re-validated at release execution, not just at package approval. The approval snapshot is not sufficient. The live state of all composition entries and scope entities is checked.

### HC-CP-06 — currentVersionId Matching Required at Release

`composition.versionId` must equal the content entity's `entity.currentVersionId` at release execution. A composition entry referencing a superseded (but still Approved) version is stale and blocks release.

### HC-CP-07 — HardBlock Dependencies Evaluated at Release

`dependencyNotes` entries with `severity: HardBlock` are evaluated at release execution. An unresolved hard block prevents the `Approved → Released` transition.

### HC-CP-08 — Released Package and Its Version Are Fully Immutable

Once the ContentPackage transitions to `Released`, no field on the entity or the ContentPackage Version (composition, scope, notes, metadata) may be changed. This is enforced at the domain boundary regardless of actor role.

### HC-CP-09 — compositionSnapshot Is Self-Contained on Release Record

The Release Version record's `compositionSnapshot` is a full copy, not a reference. It must contain all information needed to understand what was released without reading the ContentPackage Version record. This ensures Release records remain interpretable even if the Version record schema evolves.

### HC-CP-10 — No Implicit Re-Approval for Identical Composition

No comparison of composition identity may trigger approval bypass. Even if a new ContentPackage Version has an identical `composition` list to an approved predecessor, it requires its own approval cycle. Identity-check shortcuts are not implemented in Phase 0.
