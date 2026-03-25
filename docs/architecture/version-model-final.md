# Version Model — Final Reference
## ResQBrain Phase 0

**Version:** 1.0
**Date:** 2026-03-25
**Status:** Canonical — standalone versioning reference
**Applies to:** Algorithm, Medication, Protocol, Guideline, ContentPackage, Release
**Sources:** `domain-entity-blueprint.md`, `tenant-model.md`

---

## Foundational Rules

1. **Immutability after write.** A Version record is immutable from the moment it is written. No field may be changed.
2. **No rewrite of history.** Corrections do not modify existing Versions. They create new ones.
3. **No implicit latest references.** Every reference to a versioned entity must name an explicit `versionId`. No floating "use latest" references exist in the domain model.
4. **Approval is version-bound.** An `ApprovalDecision` names a specific `versionId`. A new Version invalidates all ApprovalDecisions referencing a prior `versionId`.
5. **Released Versions are permanently frozen.** A Version referenced by a Released ContentPackage may never be mutated, recalled, or removed from history.
6. **Lineage is append-only.** Version history grows forward only. No retroactive insertion into the lineage chain.
7. **All Versions are Organization-scoped.** `organizationId` is required, immutable, and validated at write time.

---

## Part 1 — Version Structure

### Three Versioning Units

The platform defines three distinct versioning units, each with a separate identity and purpose:

```
Content Entity Version          ContentPackage Version          Release Version
───────────────────────         ──────────────────────          ────────────────
Snapshots the state of          Snapshots the composition       Records that a specific
a single Algorithm,             of a ContentPackage at          ContentPackage Version
Medication, Protocol,           a point in time (which          was published to a
or Guideline.                   content Versions it             specific target scope
                                includes).                      at a specific time.
```

These units reference each other in one direction only:

```
Release Version
  └── references one ContentPackage Version
        └── references one or more Content Entity Versions
              └── each is a snapshot of one content entity
```

No upward reference exists. A Content Entity Version does not know which packages or releases reference it.

---

### 1.1 Content Entity Version

Applicable to: Algorithm, Medication, Protocol, Guideline.

| Field                  | Type    | Required | Mutable | Description                                                    |
|------------------------|---------|----------|---------|----------------------------------------------------------------|
| `id`                   | string  | Yes      | Never   | Stable, globally unique version identifier                     |
| `organizationId`       | string  | Yes      | Never   | Tenant reference — must match parent entity                    |
| `entityId`             | string  | Yes      | Never   | The content entity this Version belongs to                     |
| `entityType`           | enum    | Yes      | Never   | `Algorithm \| Medication \| Protocol \| Guideline`             |
| `versionNumber`        | int     | Yes      | Never   | Monotonically increasing within entity lineage; starts at 1   |
| `predecessorVersionId` | string  | No       | Never   | Prior Version id; null for v1                                  |
| `lineageState`         | enum    | Yes      | System  | `Active \| Superseded \| Released \| Deprecated` — see §1.4  |
| `createdAt`            | UTC     | Yes      | Never   | Write timestamp                                                |
| `createdBy`            | string  | Yes      | Never   | UserRole id of the author                                      |
| `changeReason`         | string  | Cond.    | Never   | Required for all versions after v1; describes what changed and why |
| `snapshot`             | object  | Yes      | Never   | Complete field-level copy of the entity at this point in time  |

**Snapshot content:** The `snapshot` field contains a full copy of all entity fields at the time of version creation. It does not contain `ApprovalStatus` — that is a lifecycle state on the entity, not part of the versioned content definition.

---

### 1.2 ContentPackage Version

Applicable to: ContentPackage.

| Field                  | Type    | Required | Mutable | Description                                                    |
|------------------------|---------|----------|---------|----------------------------------------------------------------|
| `id`                   | string  | Yes      | Never   | Stable, globally unique version identifier                     |
| `organizationId`       | string  | Yes      | Never   | Tenant reference — must match parent ContentPackage            |
| `packageId`            | string  | Yes      | Never   | The ContentPackage this Version belongs to                     |
| `versionNumber`        | int     | Yes      | Never   | Monotonically increasing within package lineage; starts at 1  |
| `predecessorVersionId` | string  | No       | Never   | Prior package Version id; null for v1                         |
| `lineageState`         | enum    | Yes      | System  | `Active \| Superseded \| Released \| Deprecated`              |
| `createdAt`            | UTC     | Yes      | Never   | Write timestamp                                                |
| `createdBy`            | string  | Yes      | Never   | UserRole id of the package assembler                           |
| `changeReason`         | string  | Cond.    | Never   | Required for all versions after v1                             |
| `composition`          | list    | Yes      | Never   | List of `{ entityId, versionId, entityType }` — the exact content Versions included |
| `targetScope`          | object  | Yes      | Never   | `{ scopeLevel, scopeTargetId }` — distribution target at time of assembly |
| `releaseNotes`         | string  | No       | Never   | Human-readable description of what this package version contains |
| `compatibilityNotes`   | string  | No       | Never   | Inter-version or inter-package dependency declarations         |

**Composition is frozen at Version write.** Once the ContentPackage Version record is written, its `composition` list cannot change. Reassembly creates a new Version.

---

### 1.3 Release Version

Applicable to: the act of publishing a ContentPackage Version.

The Release Version is a distinct record from the ContentPackage Version. It records the publication event: when a specific ContentPackage Version was made available to a target scope.

| Field                   | Type    | Required | Mutable | Description                                                    |
|-------------------------|---------|----------|---------|----------------------------------------------------------------|
| `id`                    | string  | Yes      | Never   | Stable, globally unique release record identifier              |
| `organizationId`        | string  | Yes      | Never   | Tenant reference                                               |
| `packageVersionId`      | string  | Yes      | Never   | The ContentPackage Version this Release publishes              |
| `packageId`             | string  | Yes      | Never   | Parent ContentPackage id (denormalized for query efficiency)   |
| `releasedAt`            | UTC     | Yes      | Never   | Timestamp of release execution                                 |
| `releasedBy`            | string  | Yes      | Never   | UserRole id of the actor who executed the release              |
| `targetScope`           | object  | Yes      | Never   | `{ scopeLevel, scopeTargetId }` — resolved at release time     |
| `releaseType`           | enum    | Yes      | Never   | `Initial \| Update \| Rollback`                                |
| `supersededReleaseId`   | string  | No       | Never   | Release id this record supersedes (for Update and Rollback)    |
| `rollbackSourceVersionId`| string | No       | Never   | The package Version id used as rollback source (Rollback type only) |
| `status`                | enum    | Yes      | System  | `Active \| Superseded`                                         |

**One active Release per target scope:** For any given `{ organizationId, targetScope }`, at most one Release record has `status == Active` at any point in time.

**Release Version is always immutable.** The `status` field transitions from `Active → Superseded` when a newer Release supersedes it. This is the only mutable field — and it is system-managed, not user-editable.

---

### 1.4 Version Lineage States

Version lineage state is a system-managed field on Version records. It is distinct from `ApprovalStatus` on the parent entity.

| Lineage State | Description                                                                       |
|---------------|-----------------------------------------------------------------------------------|
| `Active`      | This Version is the `currentVersionId` of its parent entity. One per entity.     |
| `Superseded`  | A newer Version has become `Active`. This Version is historical.                  |
| `Released`    | This Version has been included in at least one Released ContentPackage.           |
| `Deprecated`  | The parent entity has been deprecated. All Versions of that entity are Deprecated.|

**Multiple states can apply:** A Version can be both `Released` and `Superseded` (it was released, then a newer version replaced it as active). A Version can be `Released` and `Active` simultaneously (it is current and released).

---

## Part 2 — Versioning Rules

### When a New Version Is Created

| Scenario                                                | New Version | Type    |
|---------------------------------------------------------|-------------|---------|
| Author edits content in `Draft` and submits (`Draft → InReview`) | Yes | Content Entity Version |
| Content recalled (`Approved → InReview`) — edits follow | Yes | Content Entity Version |
| Content `Rejected` — author begins new Draft            | Yes         | Content Entity Version |
| Content `Released` — correction needed                  | Yes         | Content Entity Version |
| ContentPackage reassembled (any composition change)     | Yes         | ContentPackage Version |
| ContentPackage recalled and resubmitted                 | Yes         | ContentPackage Version |
| ContentPackage `Released` — correction needed           | Yes         | ContentPackage Version |
| Release executed (first release)                        | Yes         | Release Version (`Initial`) |
| Release update (supersedes prior release)               | Yes         | Release Version (`Update`) |
| Rollback executed                                       | Yes         | Release Version (`Rollback`) |
| `Draft → InReview` with no content change (re-submit only) | No      | — |
| `InReview → Approved`                                   | No          | — |
| `InReview → Rejected` (no new authoring)               | No          | — |
| `Released → Deprecated`                                 | No          | — |

### Core Immutability Rules

1. A Version record, once written, is immutable in all fields.
2. No update operation exists for Version records. Only append (create new Version) and read.
3. A Version referenced by a Released ContentPackage may never be deleted, regardless of entity state.
4. A Version's `snapshot` field captures entity content at write time. If field definitions change in the platform schema, snapshots of prior Versions retain their original structure.

### One Active Version Per Entity

At any point in time, a content entity has exactly one `currentVersionId`. This is the `Active` Version. All prior Versions have lineage state `Superseded` (or `Released + Superseded` if they were released).

**In Phase 0: no parallel Draft forks.** An entity may have at most one Version in `Draft` or `InReview` state at a time. See EC-01 for the edge case definition.

### Approval Is Version-Bound

An `ApprovalDecision` names a specific `versionId`. It is valid only while that `versionId == entity.currentVersionId`.

If a new Version is created (e.g., content is recalled and edited, producing a new Version), all ApprovalDecisions referencing the prior `versionId` become stale. They are not deleted — they are retained in audit history — but they do not contribute to quorum evaluation for the new Version. The new Version begins a fresh review cycle.

---

## Part 3 — Lineage Model

### Parent/Child Relation

Each Version record points to its immediate predecessor via `predecessorVersionId`. This forms a singly-linked list (lineage chain) per entity.

```
Algorithm entity-A
  Version 1 (v1)  predecessorVersionId: null          ← initial
      │
      ▼
  Version 2 (v2)  predecessorVersionId: v1.id         ← correction after rejection
      │
      ▼
  Version 3 (v3)  predecessorVersionId: v2.id         ← released
      │
      ▼
  Version 4 (v4)  predecessorVersionId: v3.id         ← post-release correction
```

### Lineage Traversal

Full history of any entity is reconstructable by following `predecessorVersionId` back to the root (v1, where `predecessorVersionId == null`).

No Version may claim a `predecessorVersionId` that:
- Belongs to a different `entityId`
- Belongs to a different `organizationId`
- Does not exist
- Is itself a Version that already has a successor (branching is prohibited in Phase 0)

### Version Roles in Lineage

| Role              | Definition                                                                   |
|-------------------|------------------------------------------------------------------------------|
| `Active`          | The entity's `currentVersionId` points to this Version                       |
| `Superseded`      | A later Version exists in the same lineage chain; no longer `currentVersionId`|
| `Released`        | Referenced by at least one Released ContentPackage composition entry         |
| `Rejected-terminal`| The Version whose entity was `InReview` and resolved to `Rejected`; no successors exist yet |
| `Deprecated`      | Parent entity `ApprovalStatus == Deprecated`; all Versions share this classification |

### Lineage State Transitions

```
Written ──► Active  ──► Superseded (when next Version is written)
              │
              └──► Released (when included in Released ContentPackage)
                        │
                        └──► Released + Superseded (when a newer Version also gets Released)
                        │
                        └──► Released + Deprecated (when parent entity is Deprecated)
```

No state transition removes a Version from the lineage. `Superseded`, `Deprecated`, and `Released` are additive classifications, not replacements.

---

## Part 4 — Content vs Package vs Release Version Matrix

| Dimension                      | Content Entity Version                           | ContentPackage Version                              | Release Version                                  |
|--------------------------------|--------------------------------------------------|-----------------------------------------------------|--------------------------------------------------|
| **Snapshots what**             | Fields of one Algorithm/Medication/Protocol/Guideline | Composition list (set of `{ entityId, versionId }`) + package metadata | Publication event: which package version, to which scope, when |
| **Created when**               | Content changes requiring new authoring cycle    | Package reassembly or correction                    | `package.release` operation executes             |
| **Triggered by**               | Author action (Draft edit → submit)              | Package assembler action                            | Releaser action (`package.release`)              |
| **References**                 | Nothing (leaf record)                            | Set of Content Entity Versions                      | One ContentPackage Version                       |
| **Referenced by**              | ContentPackage composition entries               | Release Version records                             | Nothing (root of the reference chain)            |
| **Approval applies to**        | Yes — ApprovalDecision names this versionId      | Yes — ApprovalDecision names this versionId         | No — Release follows from Approved package version|
| **Immutable after write**      | Yes — all fields                                 | Yes — all fields including `composition`            | Yes — all fields except `status` (Active → Superseded) |
| **Lineage chain**              | Yes — `predecessorVersionId` chain per entity    | Yes — `predecessorVersionId` chain per package      | No chain — Release records are independent events|
| **Can be rolled back from**    | No — rollback operates at package level          | Yes — a prior Approved ContentPackage Version can be re-released | Yes — a Rollback Release references a prior Release target |
| **Can be Deprecated**          | Implicitly (when parent entity is Deprecated)    | Implicitly (when parent package is Deprecated)      | Superseded (never Deprecated directly)           |
| **Deletion permitted**         | No — if referenced by Released ContentPackage    | No — if referenced by a Release Version             | No — Release records are permanent audit events  |
| **`organizationId` required**  | Yes                                              | Yes                                                 | Yes                                              |
| **versionNumber format**       | Integer, monotonic within entity                 | Integer, monotonic within package                   | No sequential numbering — identified by `id`     |

---

## Part 5 — Rollback Rules

### Definition

A rollback is the act of making an older ContentPackage Version the active release for a target scope. It is always a **forward operation**: a new Release Version record is created. No existing record is modified.

### Rollback Mechanics

```
Release A (Active)  →  ContentPackage Version 3  (current release for scope X)
      │
      │  defect found
      ▼
Release B (Rollback type) created
  └── packageVersionId: ContentPackage Version 1 (prior approved)
  └── supersededReleaseId: Release A.id
  └── rollbackSourceVersionId: ContentPackage Version 1.id
  └── releaseType: Rollback

Release A.status ──► Superseded
Release B.status ──► Active  (new active release for scope X)
```

### Rollback Preconditions

Before a rollback Release Version can be created, the following must all be true:

| # | Precondition |
|---|-------------|
| 1 | The rollback target ContentPackage Version exists and its `lineageState` includes `Released` or it is in `Approved` state |
| 2 | All content Entity Versions in the rollback target's `composition` are not `Deprecated` |
| 3 | Actor holds `package.release` capability within the same `organizationId` |
| 4 | `Organization.status == Active` |
| 5 | The rollback target's `organizationId` matches the current Release's `organizationId` |
| 6 | A full audit record for the rollback can be written |

**Critical:** Precondition 2 — deprecated content in the rollback composition blocks the rollback. A new ContentPackage Version must be assembled.

### What Rollback Does Not Do

- Does not reopen or modify any existing Release Version record.
- Does not change `ApprovalStatus` on any entity.
- Does not restore entities to a prior ApprovalStatus state.
- Does not remove Version records from the lineage chain.
- Does not invalidate ApprovalDecisions that were submitted for the Version being rolled back from.

### Rollback vs Update

| Dimension                | Rollback                                          | Update                                             |
|--------------------------|---------------------------------------------------|----------------------------------------------------|
| `releaseType`            | `Rollback`                                        | `Update`                                           |
| Package Version used     | A prior Approved or Released ContentPackage Version | A new ContentPackage Version (current)           |
| `rollbackSourceVersionId`| Required (identifies the version being re-used)  | Null                                               |
| New Package Version needed| No — re-uses existing approved composition        | Yes — new package version assembled and approved  |
| Full release checklist   | Yes — same preconditions as initial release       | Yes                                                |

---

## Part 6 — Approval and Lifecycle Integration

### ApprovalDecision Is Always Version-Bound

An `ApprovalDecision` record carries `versionId`. This is the Version the reviewer evaluated. The decision is only valid when:

```
approvalDecision.versionId == entity.currentVersionId
```

If a new Version is created for the entity (e.g., content recalled and reauthored), all prior decisions become **stale**. Stale decisions:
- Are retained permanently in audit history.
- Do not contribute to quorum for the new Version.
- Are marked as stale in the quorum evaluation log.

### Version and Released State

The only path to `Released` state for a content entity is inclusion in a Released ContentPackage. When a ContentPackage is released:

1. The ContentPackage Version record's `lineageState` is updated to include `Released`.
2. Each content Entity Version listed in the composition has its `lineageState` updated to include `Released`.
3. A Release Version record is created as a permanent publication event.

None of these operations modify any field of any Version record. `lineageState` is the one system-managed field that can be updated — and only in the additive direction (never removing a state).

### Deprecation Without History Rewrite

When a content entity is deprecated:

1. The entity's `ApprovalStatus` transitions to `Deprecated`.
2. All Version records for that entity have `lineageState` updated to include `Deprecated`.
3. No Version record field is modified. No snapshot is altered.
4. Existing Released ContentPackage Versions that reference these Versions remain valid and immutable.
5. New ContentPackages may not include Deprecated Versions in their composition.

---

## Part 7 — Audit Requirements

### Version Creation Audit Record

Written when any new Version record is created.

| Field                    | Required | Description                                                    |
|--------------------------|----------|----------------------------------------------------------------|
| `id`                     | Yes      | Unique audit event id                                          |
| `versionId`              | Yes      | The newly created Version id                                   |
| `entityId`               | Yes      | The parent entity id                                           |
| `entityType`             | Yes      | Content type or ContentPackage                                 |
| `organizationId`         | Yes      | Tenant scope — never null                                      |
| `versionNumber`          | Yes      | The version number assigned                                    |
| `predecessorVersionId`   | Yes      | Prior version id (or null for v1)                              |
| `createdBy`              | Yes      | UserRole id of author                                          |
| `createdAt`              | Yes      | UTC timestamp                                                  |
| `changeReason`           | Cond.    | Required for v2+; must describe what changed and why           |
| `predecessorApprovalStatus` | Yes  | The `ApprovalStatus` of the entity at the time the new version was created |

### Release Version Audit Record

Written when a Release Version record is created (every release and rollback).

| Field                    | Required | Description                                                    |
|--------------------------|----------|----------------------------------------------------------------|
| `releaseVersionId`       | Yes      | The Release Version id                                         |
| `packageVersionId`       | Yes      | The ContentPackage Version being released                      |
| `organizationId`         | Yes      | Tenant scope                                                   |
| `releasedBy`             | Yes      | UserRole id of the releasing actor                             |
| `releasedAt`             | Yes      | UTC timestamp                                                  |
| `targetScope`            | Yes      | `{ scopeLevel, scopeTargetId }` as resolved at release time    |
| `releaseType`            | Yes      | `Initial \| Update \| Rollback`                                |
| `supersededReleaseId`    | Cond.    | Required for `Update` and `Rollback` types                     |
| `rollbackSourceVersionId`| Cond.    | Required for `Rollback` type                                   |
| `compositionSnapshot`    | Yes      | Full copy of `composition` from the ContentPackage Version     |

### Version Lineage State Change Audit Record

Written when `lineageState` is updated on any Version record.

| Field            | Required | Description                                         |
|------------------|----------|-----------------------------------------------------|
| `versionId`      | Yes      | Version whose state changed                         |
| `organizationId` | Yes      | Tenant scope                                        |
| `fromState`      | Yes      | Prior `lineageState` value(s)                       |
| `toState`        | Yes      | New `lineageState` value(s)                         |
| `reason`         | Yes      | What triggered the state change (release, deprecation, supersession) |
| `triggeredBy`    | Yes      | The operation id (release id, deprecation event id) |
| `timestamp`      | Yes      | UTC                                                 |

---

## Part 8 — Edge Cases

---

### EC-01 — Parallel Draft Forks

**Scenario:** While content entity v2 is `InReview`, a second author creates v3 as a new Draft (e.g., to address anticipated changes), resulting in two Versions both wanting to be the active authoring line.

**Risk:** Two competing Versions; ambiguous lineage; conflicting review processes.

**Phase 0 rule:** Parallel Draft forks are **prohibited** in Phase 0. An entity may have at most one Version in `Draft` or `InReview` at a time. If the entity is `InReview`, no new Version can be created until the review concludes (either `Approved` or `Rejected`). If the review concludes `Rejected`, a new Draft may be created.

**Enforcement:** Version creation for a content entity is blocked if the entity's current `ApprovalStatus` is `InReview`. The only allowed version-creation path from `InReview` is via recall → edit (which requires the entity to first reach `Approved` → recall → new Draft).

---

### EC-02 — Version Gaps in Lineage

**Scenario:** Version records exist for v1, v2, v4. v3 is missing. The `predecessorVersionId` chain is broken.

**Risk:** Lineage cannot be fully reconstructed. Audit trail is incomplete.

**Required behavior:** Version writes must validate that `predecessorVersionId` references an existing, valid Version record within the same `{ entityId, organizationId }`. A Version write that would create a gap (claiming a predecessor that does not exist) is rejected. Gaps cannot occur during normal operation. If a gap is discovered in existing data, it is flagged as a data integrity violation requiring OrgAdmin investigation.

---

### EC-03 — Orphan Versions

**Scenario:** A Version record exists for an `entityId` that no longer has an active entity record (e.g., entity was soft-deleted at infrastructure level).

**Risk:** Orphaned Version records have no resolvable parent entity; they cannot participate in lineage traversal.

**Required behavior:** Content entities cannot be deleted in Phase 0. They can only be `Deprecated`. A `Deprecated` entity still exists as a record — its Versions are not orphaned. If an orphan is detected (via data integrity scan), it is flagged as an anomaly. Orphan Versions are never processed by domain logic. They are retained for audit purposes and investigated separately.

---

### EC-04 — Package References Deprecated Content

**Scenario:** A ContentPackage in `Approved` state references a content Entity Version whose parent entity has since been deprecated.

**Risk:** A package with deprecated content proceeds to release.

**Required behavior:** Release precondition step 5 validates all composition entries at execution time. A composition entry pointing to a Version whose parent entity's `ApprovalStatus == Deprecated` fails the check: the entity is not `Approved`, it is `Deprecated`. Release is blocked. The package must be recalled and reassembled with a non-deprecated content Version.

---

### EC-05 — Rollback to Incompatible Version Set

**Scenario:** Rollback target is ContentPackage Version 1. Since v1 was released, two of its referenced content Versions have been deprecated.

**Risk:** Rollback restores a composition containing deprecated content.

**Required behavior:** Rollback precondition 2 checks every composition entry of the rollback target for Deprecated parent entities. Any Deprecated entry blocks the rollback. A new ContentPackage Version must be assembled that replaces the deprecated entries with current Approved Versions of those content items.

---

### EC-06 — Re-Release of Identical Package Composition

**Scenario:** ContentPackage Version 3 was released, then deprecated. Someone assembles a new ContentPackage Version 4 with an identical composition. Can v4 be released?

**Risk:** Unintentional duplicate distributions; confusion about versioning intent.

**Required behavior:** This is a valid operation. ContentPackage Version 4 is a distinct record with a new `versionId`, even if its `composition` is identical to v3. The release proceeds normally under the standard preconditions. The identity of the release is the `versionId`, not the composition hash. The audit record documents the `changeReason` for creating a new package version with the same composition.

**Recommendation (not enforced):** When `changeReason` describes no substantive difference, OrgAdmin should document the operational justification (e.g., re-release after erroneous deprecation).

---

### EC-07 — Partial Supersession (Some Composition Entries Updated, Others Not)

**Scenario:** A ContentPackage contains Versions of Algorithm (v2), Medication (v3), Protocol (v1). Algorithm is updated to v3, but Medication and Protocol remain the same. A new ContentPackage Version is assembled.

**Risk:** Confusion about which Versions are "current" vs which are historical within the package.

**Required behavior:** ContentPackage versioning is at the package level, not per composition entry. The new ContentPackage Version is a distinct record with a new `versionId`. Its composition includes `{ Algorithm-v3, Medication-v3, Protocol-v1 }`. This is correct. There is no concept of "partial supersession" — each ContentPackage Version is a complete, atomic composition snapshot. The prior ContentPackage Version (containing Algorithm-v2) is superseded as a whole package version, not entry by entry.

---

### EC-08 — Stale Approval Decision After New Version

**Scenario:** ContentPackage Version 2 is `InReview`. Reviewer A submits `Approved`. Package is recalled, reassembled, producing ContentPackage Version 3. Does Reviewer A's approval carry over?

**Risk:** Prior approval is erroneously applied to a new composition.

**Required behavior:** Reviewer A's `ApprovalDecision` carries `versionId: v2`. Once ContentPackage Version 3 is created, its `versionId` is `v3`. All quorum evaluation for v3 starts fresh — no prior decisions are carried over. Reviewer A must submit a new decision for v3. The v2 decision is retained in audit history but is stale for v3 purposes. Package v3 begins a new `InReview` cycle.

---

### EC-09 — Two Releases for Same Scope (Concurrent)

**Scenario:** Two ContentPackage Versions (v3 and v4) are both in `Approved` state targeting the same `{ organizationId, targetScope }`. A release is attempted for both simultaneously.

**Risk:** Two active Release Versions for the same scope.

**Required behavior:** Release execution validates that no conflicting `Active` Release Version exists for the same `{ organizationId, targetScope }` before writing. This check is atomic. The first release completes and sets its Release Version to `Active`. The second release attempt encounters an `Active` release and must either: (a) be structured as an `Update` release with `supersededReleaseId` pointing to the first, or (b) be blocked pending OrgAdmin decision. Two simultaneous `Initial` releases to the same scope are rejected.

---

### EC-10 — Version lineageState Released + Deprecated Simultaneously

**Scenario:** Algorithm v3 was released (part of a Released ContentPackage). The Algorithm entity is later deprecated. Algorithm v3 has lineageState `Released`. After deprecation, it should also reflect `Deprecated`.

**Risk:** Inconsistent lineageState; queries for Released content may return Deprecated items.

**Required behavior:** `lineageState` is a set of additive states, not a single enum. Algorithm v3's lineageState becomes `{ Released, Deprecated }`. It remains in the Released ContentPackage's composition (immutable). It is not eligible for inclusion in any new ContentPackage. Queries for "active released content" must filter on `entity.approvalStatus != Deprecated` in addition to `lineageState includes Released`.

---

## Part 9 — Hard Constraints for Implementation

### HC-V-01 — Version Records Are Write-Once

No update operation is permitted on Version records after write. The only system-managed field that changes is `lineageState` — and only in the additive direction (adding states, never removing them).

### HC-V-02 — organizationId Is Immutable and Validated at Write

`organizationId` on a Version must match the `organizationId` of the parent entity. Mismatches are rejected at write time. Cross-tenant Version records must not exist.

### HC-V-03 — predecessorVersionId Must Resolve Within Same Entity

Before a new Version is written, `predecessorVersionId` must be validated to reference a Version with matching `{ entityId, organizationId }`. Cross-entity lineage links are prohibited.

### HC-V-04 — versionNumber Is Monotonically Increasing Per Entity

`versionNumber` is assigned by the system, not the author. It is always `max(existing versionNumbers for entityId) + 1`. Gaps, non-sequential writes, and manual overrides are rejected.

### HC-V-05 — No Implicit Latest References

No domain operation may reference a versioned entity without specifying `versionId`. Queries like "get the current version" must resolve to an explicit `versionId` before any governance or release operation is performed. The resolved `versionId` is recorded in all audit events.

### HC-V-06 — changeReason Is Required From v2 Onward

A Version write with `versionNumber >= 2` and an empty or null `changeReason` is rejected. The reason must be substantive — a placeholder value ("update", "fix") is flagged at review time.

### HC-V-07 — Parallel Draft Forks Are Blocked

If an entity's `ApprovalStatus == InReview`, new Version creation is blocked. If `ApprovalStatus == Draft`, a new Version may be created (the current Draft is superseded). At no time may an entity have two Versions simultaneously in `Draft` or `InReview` state.

### HC-V-08 — Released Version Deletion Is Prohibited

Deleting any Version record that is referenced by a Released ContentPackage composition is prohibited. This check must be enforced at the domain layer before any deletion operation, regardless of the caller's role.

### HC-V-09 — Rollback Is a New Release Record

No rollback operation may modify an existing Release Version record's `packageVersionId`. Rollback always produces a new Release Version record. The prior Release Version transitions to `status: Superseded`.

### HC-V-10 — compositionSnapshot Is Written at Release Time

When a Release Version record is created, `compositionSnapshot` must contain a full copy of the ContentPackage Version's `composition` list as it exists at the moment of release execution. This snapshot is independent of the ContentPackage Version record — it ensures the Release audit record is self-contained even if package metadata is later amended (which it shouldn't be, but is defended against regardless).
