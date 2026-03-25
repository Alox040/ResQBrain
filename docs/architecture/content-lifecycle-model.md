# Content Lifecycle Model — ResQBrain Phase 0

**Version:** 1.0
**Date:** 2026-03-25
**Status:** Canonical Architecture Reference
**Scope:** All content entities (Algorithm, Medication, Protocol, Guideline) and ContentPackage

---

## Applies To

This lifecycle model governs the `approvalStatus` field on:

| Entity         | Lifecycle Scope       |
|----------------|-----------------------|
| Algorithm      | Individual content    |
| Medication     | Individual content    |
| Protocol       | Individual content    |
| Guideline      | Individual content    |
| ContentPackage | Release unit          |

Content entity lifecycle and ContentPackage lifecycle are **parallel but independent** — both must reach `Approved` before a Release can occur.

---

## States

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   DRAFT ──────────────► IN REVIEW ──────────► APPROVED         │
│     ▲                       │                    │             │
│     │                       │ (reject)           │ (recall)    │
│     │                       ▼                    │             │
│     │                  REJECTED ◄────────────────┘             │
│     │                  (terminal for this Version)             │
│     │                                             │             │
│     └─────────────────────────────────────────────┘            │
│                                                                 │
│                         APPROVED ──────────► RELEASED          │
│                                                  │             │
│                                                  ▼             │
│                                            DEPRECATED          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### State Definitions

| State        | Mutability         | Operational Meaning                                                   |
|--------------|--------------------|-----------------------------------------------------------------------|
| `Draft`      | Editable           | Authoring in progress. Not submitted for review. Not distributable.   |
| `InReview`   | Locked             | Submitted for approval. Content is frozen during review.              |
| `Approved`   | Read-only          | Cleared for inclusion in a ContentPackage. Not yet distributed.       |
| `Rejected`   | Read-only (terminal)| Review outcome: unsuitable for release. Version is closed.           |
| `Released`   | Immutable          | Published via a Released ContentPackage. Frozen permanently.          |
| `Deprecated` | Immutable          | Retired. Historical record preserved. No new distributions permitted. |

---

## Transition Matrix

### Allowed Transitions

| From         | To           | Trigger                     | Required Capability        | Separation of Duty         |
|--------------|--------------|-----------------------------|----------------------------|----------------------------|
| `Draft`      | `InReview`   | Author submits for review   | `content.submit`           | —                          |
| `InReview`   | `Approved`   | Reviewer approves           | `content.approve`          | Must not be the submitter  |
| `InReview`   | `Rejected`   | Reviewer rejects            | `content.reject`           | Must not be the submitter  |
| `Approved`   | `Released`   | ContentPackage released     | `package.release`          | Separate release authority |
| `Approved`   | `InReview`   | Recall for revision         | `content.recall`           | OrgAdmin or Approver role  |
| `Released`   | `Deprecated` | Retirement decision         | `content.deprecate`        | —                          |

For **ContentPackage**:

| From         | To           | Trigger                     | Required Capability        | Separation of Duty         |
|--------------|--------------|-----------------------------|----------------------------|----------------------------|
| `Draft`      | `InReview`   | Package submitted           | `package.submit`           | —                          |
| `InReview`   | `Approved`   | Package approved            | `package.approve`          | Must not be the submitter  |
| `InReview`   | `Rejected`   | Package rejected            | `package.reject`           | Must not be the submitter  |
| `Approved`   | `Released`   | Release executed            | `package.release`          | Separate release authority |
| `Approved`   | `InReview`   | Package recalled            | `package.recall`           | OrgAdmin role              |
| `Released`   | `Deprecated` | Package retired             | `package.deprecate`        | —                          |

### Prohibited Transitions

| From         | To           | Reason                                                                 |
|--------------|--------------|------------------------------------------------------------------------|
| `Draft`      | `Approved`   | Review step is mandatory — no direct approval from Draft.              |
| `Draft`      | `Released`   | Cannot release unreviewed content.                                     |
| `Draft`      | `Deprecated` | Cannot deprecate content that was never released.                      |
| `InReview`   | `Released`   | Cannot release content that bypasses the approval decision.            |
| `InReview`   | `Draft`      | Recall from InReview is not permitted — only from Approved.            |
| `Rejected`   | `InReview`   | Rejected is terminal for this Version. New Version required.           |
| `Rejected`   | `Approved`   | Rejected is terminal for this Version. New Version required.           |
| `Rejected`   | `Released`   | Rejected is terminal for this Version. New Version required.           |
| `Rejected`   | `Deprecated` | Rejected is terminal for this Version. New Version required.           |
| `Released`   | `Draft`      | Released content is immutable. New Version required for changes.       |
| `Released`   | `InReview`   | Released content is immutable. New Version required for changes.       |
| `Released`   | `Approved`   | Released content is immutable. No regression in state.                 |
| `Released`   | `Rejected`   | Released content is immutable.                                         |
| `Deprecated` | `*`          | Deprecated is a terminal state. No forward or backward transitions.    |

---

## Approval Requirements

### Content Entity Approval (`InReview → Approved`)

All of the following must be satisfied before an `Approved` transition is recorded:

1. **Role check:** The approving user holds a UserRole with `content.approve` capability within the same Organization.
2. **Separation of duty:** The approving user is not the same user who submitted the content (`content.submit` transition actor).
3. **Structural completeness:**
   - Algorithm: `decisionLogic` has no dangling branches.
   - Medication: at least one route and dose range defined in `dosageGuidelines`.
   - Protocol: `regulatoryBasis` is populated.
   - Guideline: `evidenceBasis` is declared.
4. **No unresolved Deprecated references:** Content must not reference any Deprecated entity within its composition.
5. **Audit record present:** The approval event captures approver identity, timestamp, and decision rationale.

### ContentPackage Approval (`InReview → Approved`)

All of the following must be satisfied:

1. **Role check:** The approving user holds a UserRole with `package.approve` capability.
2. **Separation of duty:** The approving user is not the submitter.
3. **Composition integrity:** Every content item in the package has `approvalStatus == Approved` at time of package approval.
4. **Organization scope:** All included content belongs to the same Organization, or an explicit cross-org sharing policy has been declared and validated.
5. **No empty composition:** Package contains at least one content item per type declared in scope.
6. **Audit record present:** Captures approver identity, timestamp, and rationale.

---

## Release Requirements

### ContentPackage Release (`Approved → Released`)

Release is the only path to `Released` state for any content entity. Content entities do not transition to `Released` individually — they become `Released` as part of a Released ContentPackage.

All of the following must be satisfied before `package.release` is executed:

1. **Package state:** ContentPackage is in `Approved` state.
2. **Content state at release time:** All referenced content `{ entityId, versionId }` pairs resolve to entities with `approvalStatus == Approved`. If any content was recalled or deprecated after package approval, the package must be revalidated.
3. **Role check:** The releasing user holds a UserRole with `package.release` capability.
4. **Version snapshot:** A new `Version` record is written for the ContentPackage capturing the complete composition at release time. This record is immutable after write.
5. **Target scope resolution:** `targetScope` (Organization, Region, County, or Station) resolves to an active entity within the same Organization.
6. **No conflicting active release:** The same `{ organizationId, targetScope, contentEntityId }` combination must not have a conflicting Released version without an explicit supersession record.
7. **Audit record present:** Captures releasing user identity, timestamp, package version id, and scope.

**Effect of Release:**
- ContentPackage transitions to `Released`.
- All referenced content entities transition to `Released` (co-released with the package).
- All `Released` records are permanently immutable.

---

## Deprecation Rules

### Content Entity Deprecation (`Released → Deprecated`)

1. **Role check:** The acting user holds `content.deprecate` capability within the Organization.
2. **Deprecation fields required:**
   - `deprecationDate` must be set.
   - `deprecationReason` must be populated with a substantive rationale.
3. **Successor declaration (recommended):** If a replacement content entity exists, a `successorContentId` reference should be recorded in the deprecation audit entry.
4. **Referencing content check:** If other non-Deprecated content references this entity, a warning is raised. Deprecation proceeds, but referencing content must be updated before any new Release that includes those items.
5. **Effect on Released Packages:** Existing Released ContentPackages that reference a now-Deprecated content version **remain valid and immutable**. Deprecation does not retroactively invalidate historical releases.
6. **Audit record present:** Captures actor, timestamp, reason, and optional successor reference.

### ContentPackage Deprecation (`Released → Deprecated`)

1. **Role check:** The acting user holds `package.deprecate` capability.
2. **Deprecation fields required:**
   - `deprecationDate` must be set.
   - `deprecationReason` must be populated.
3. **Effect:** Package is flagged as deprecated. Active distribution targets for this package should be notified that the package is no longer current.
4. **Does not cascade:** Deprecating a ContentPackage does not automatically deprecate individual content entities within it.
5. **Audit record present.**

### Rejected Version Closure

`Rejected` is a terminal state for a Version — not a deprecation. It carries no `deprecationDate`. The Version record is retained for audit. A new Version must be created at `Draft` to continue the authoring lifecycle.

---

## Audit Requirements

Every state transition must produce an immutable audit event containing:

| Field             | Required | Description                                              |
|-------------------|----------|----------------------------------------------------------|
| `entityId`        | Yes      | The content or package entity affected                   |
| `entityType`      | Yes      | `Algorithm \| Medication \| Protocol \| Guideline \| ContentPackage` |
| `versionId`       | Yes      | The Version record at the time of the transition         |
| `organizationId`  | Yes      | Tenant scope of the transition                           |
| `fromState`       | Yes      | The prior `approvalStatus` value                         |
| `toState`         | Yes      | The new `approvalStatus` value                           |
| `actorUserId`     | Yes      | Identity of the user executing the transition            |
| `actorRoleId`     | Yes      | The UserRole under which the capability was exercised    |
| `capability`      | Yes      | The specific capability invoked (e.g., `content.approve`)|
| `timestamp`       | Yes      | Exact time of the transition (UTC)                       |
| `rationale`       | Yes      | Free-text justification (required on all transitions)    |
| `metadata`        | No       | Additional context (e.g., review notes, linked survey)   |

**Audit Invariants:**
- Audit events are append-only. No audit record may be modified or deleted.
- A transition that cannot produce a complete audit event must not proceed.
- Audit records are scoped to Organization and are never shared cross-tenant.
- Audit history must be fully reconstructable from the audit log alone, independent of current entity state.

---

## Version Creation Rules

State transitions that require a new Version:

| Scenario                                           | New Version Required |
|----------------------------------------------------|----------------------|
| Any edit to a `Draft` entity before submission     | Yes (on submit)      |
| Re-authoring after `Rejected`                      | Yes (new Draft)      |
| Correction after `Released`                        | Yes (new Draft)      |
| Re-assembly of a `ContentPackage` after recall     | Yes                  |
| Rollback release (re-publish prior version set)    | New Release record; prior Version reused |

State transitions that do **not** create a new Version:

| Scenario                                           | New Version Required |
|----------------------------------------------------|----------------------|
| `Draft → InReview`                                 | No                   |
| `InReview → Approved`                              | No                   |
| `InReview → Rejected`                              | No                   |
| `Approved → Released`                              | No (package Version is snapshotted at this point) |
| `Released → Deprecated`                            | No                   |

---

## Lifecycle Interaction: Content Entity vs. ContentPackage

```
Content Entity Lifecycle          ContentPackage Lifecycle
─────────────────────────         ──────────────────────────────
Draft                             (package being assembled)
  │
  ▼
InReview
  │
  ▼
Approved ──────────────────────► included in ContentPackage
                                          │
                                          ▼
                                      InReview (package)
                                          │
                                          ▼
                                      Approved (package)
                                          │
                                          ▼
Released ◄──────────────────────── Released (package) ──► immutable
  │
  ▼
Deprecated (independent of package state)
```

Key rules governing the interaction:

1. A content entity enters `Released` only via a Released ContentPackage — never independently.
2. A ContentPackage may only be released when all included content is `Approved`.
3. If a content entity is recalled (`Approved → InReview`) after package assembly, the package must be revalidated before release.
4. Deprecating a content entity does not deprecate its containing packages.
5. Deprecating a ContentPackage does not deprecate the content entities it contained.

---

## Rollback Model

Rollback is a **forward operation** — it does not reverse state.

```
Release v3 (current, Released)
      │
      │  defect discovered
      ▼
New Release created → references ContentPackage v1 (prior Approved snapshot)
      │
      ▼
Release v4 (Released) pointing to v1 content composition
```

Rules:
- The prior ContentPackage Version must be in `Approved` or `Released` state to be re-used as a rollback target.
- A rollback Release creates a new `Version` record for the release event.
- The intermediate Released version (v3 in the example) is not invalidated — it is retained for audit.
- A rollback does not change any `approvalStatus` values — it only changes which Version is the active release.

---

## Summary: State Properties Table

| Property                    | Draft | InReview | Approved | Rejected | Released | Deprecated |
|-----------------------------|-------|----------|----------|----------|----------|------------|
| Editable                    | Yes   | No       | No       | No       | No       | No         |
| Can be submitted for review | Yes   | —        | —        | —        | —        | —          |
| Can be recalled             | —     | —        | Yes      | —        | —        | —          |
| Includable in package       | No    | No       | Yes      | No       | —        | No         |
| Can be released             | No    | No       | Via pkg  | No       | —        | No         |
| Is terminal for this Version| No    | No       | No       | Yes      | No       | Yes        |
| Immutable record            | No    | No       | No       | Yes      | Yes      | Yes        |
| Distributions active        | No    | No       | No       | No       | Yes      | No         |
| Audit required on entry     | Yes   | Yes      | Yes      | Yes      | Yes      | Yes        |
