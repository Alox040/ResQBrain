# Approval Model — ResQBrain Phase 0

**Version:** 1.0
**Date:** 2026-03-25
**Status:** Canonical Architecture Reference
**Scope:** Approval structure separate from lifecycle state transitions

---

## Separation of Concerns

The **Lifecycle Model** (`content-lifecycle-model.md`) defines *which states exist* and *which transitions are valid*.

This document defines *how approval decisions are made*, *who makes them*, and *what constitutes a valid approval outcome*.

The lifecycle's `InReview → Approved` and `InReview → Rejected` transitions are the surface. This model defines everything beneath that surface.

---

## Core Entities

### 1. ApprovalStatus

**Role:** Current approval state of a content entity or ContentPackage. Value type embedded on the governed entity.

This entity is defined in the Lifecycle Model. Within the Approval Model, it serves as the observable output — the result of one or more resolved `ApprovalDecision` records evaluated against an `ApprovalPolicy`.

**Key constraint:** `ApprovalStatus` is never set directly by a user action. It is the computed outcome of a completed approval process as defined by the governing `ApprovalPolicy`.

---

### 2. ApprovalDecision

**Role:** A single reviewer's recorded judgment on a content entity or ContentPackage that is in `InReview` state.

**Identity Fields:**
- `id` — stable, globally unique
- `organizationId` — tenant reference (immutable)
- `entityId` — the content or package entity under review
- `entityType` — `Algorithm | Medication | Protocol | Guideline | ContentPackage`
- `versionId` — the specific Version being reviewed (immutable once set)

**Decision Fields:**
- `outcome` — `Approved | Rejected | Abstained`
- `reviewerId` — the UserRole identity of the reviewer
- `reviewedAt` — UTC timestamp of decision submission
- `rationale` — mandatory free-text justification (see Audit Requirements)
- `conditions` — optional structured list of concerns that must be resolved before final approval
- `supersededBy` — reference to a later `ApprovalDecision` by the same reviewer, if revised

**State Fields:**
- `status` — `Pending | Submitted | Superseded`
  - `Pending`: reviewer has been assigned but not yet submitted
  - `Submitted`: decision recorded and immutable
  - `Superseded`: replaced by a revised decision from the same reviewer (only before policy quorum is reached)

**Relationships:**
- Belongs to one `Organization`
- References one `Version` of one content or package entity
- Governed by one `ApprovalPolicy` (resolved at review initiation)
- Produces input toward `ApprovalStatus` resolution

**Invariants:**
- A `Submitted` ApprovalDecision is immutable. The `outcome`, `rationale`, and `reviewedAt` fields cannot be changed.
- A reviewer may submit at most one active (non-Superseded) decision per `{ entityId, versionId }`.
- A reviewer may revise their decision (creating a new record with `supersededBy` pointing to the old one) only while the review is still `InReview` and before the policy quorum has been reached.
- A reviewer cannot submit a decision on content they authored (the submission actor for `Draft → InReview`).
- `Abstained` counts toward reviewer participation but not toward approval or rejection quorum.
- An `ApprovalDecision` referencing a `versionId` that is no longer the entity's `currentVersionId` is invalid and must not contribute to quorum.

---

### 3. ApprovalPolicy

**Role:** Organization-defined rules that determine how many reviewers are required, what quorum constitutes a valid outcome, and which UserRoles are eligible to review.

**Identity Fields:**
- `id` — stable identifier
- `organizationId` — tenant reference (immutable)

**Scope Fields:**
- `appliesTo` — `Algorithm | Medication | Protocol | Guideline | ContentPackage | All`
- `scopeLevel` — `Organization | Region | Station` (policy can be scoped narrower than Organization)
- `scopeTargetId` — optional Region or Station `id` for scoped policies
- `priority` — integer; higher value wins when multiple policies match a given entity

**Reviewer Configuration:**
- `eligibleRoles` — list of `roleType` values permitted to submit an `ApprovalDecision`
- `minimumReviewers` — minimum number of distinct reviewers required before outcome can be resolved
- `quorumType` — `Unanimous | Majority | SingleApprove | SingleReject`
  - `Unanimous`: all submitted decisions must be `Approved` (no `Rejected` allowed)
  - `Majority`: more `Approved` than `Rejected` among submitted decisions (minimum reviewer count must be met)
  - `SingleApprove`: one `Approved` decision from an eligible reviewer is sufficient
  - `SingleReject`: one `Rejected` decision from an eligible reviewer immediately rejects
- `requireSeparationOfDuty` — boolean; if `true`, the submitter of the entity cannot be an eligible approver
- `allowSelfReview` — always `false` in Phase 0; reserved field for future policy variants
- `requireRationale` — always `true` in Phase 0; rationale is mandatory on every decision

**Timeout Configuration:**
- `reviewWindowDays` — number of days before a review is considered overdue (advisory, not auto-resolving)
- `escalationPolicy` — `None | NotifyOrgAdmin` — what happens when `reviewWindowDays` is exceeded

**Invariants:**
- `minimumReviewers` must be ≥ 1. Zero is prohibited — no auto-approval.
- `allowSelfReview` is fixed `false` in Phase 0. Any attempt to set it `true` is rejected.
- `requireRationale` is fixed `true` in Phase 0. Decisions without rationale are rejected.
- A `ContentPackage` ApprovalPolicy must have `requireSeparationOfDuty: true`.
- When multiple policies match an entity, the one with the highest `priority` value applies. Ties are resolved by `scopeLevel` specificity (Station > Region > Organization).
- Timeout expiry never triggers an automatic approval or rejection. It is an escalation signal only.

---

## Approval Process Flow

```
Content entity reaches InReview
          │
          ▼
  ApprovalPolicy resolved
  (by entityType + organizationId + scopeLevel)
          │
          ▼
  Eligible reviewers identified
  (by eligibleRoles from policy)
          │
          ▼
  Reviewers submit ApprovalDecision records
  (Approved | Rejected | Abstained)
          │
          ▼
  Policy quorum evaluation
  ┌────────────────────────────────────────────┐
  │  minimumReviewers met?          NO → wait  │
  │  Yes                                       │
  │  quorumType resolution:                    │
  │    Unanimous  → all Approved?              │
  │    Majority   → Approved > Rejected?       │
  │    SingleApprove → any Approved?           │
  │    SingleReject  → any Rejected?           │
  └────────────────────────────────────────────┘
          │
    ┌─────┴──────┐
    ▼            ▼
Approved      Rejected
(lifecycle    (lifecycle
transition)   transition)
```

**No step in this flow may be skipped or automated.** Each `ApprovalDecision` is a deliberate human act.

---

## Quorum Evaluation Rules

### Quorum Type: `Unanimous`

- Outcome is `Approved` when: all submitted decisions are `Approved` AND `minimumReviewers` is met.
- Outcome is `Rejected` when: any submitted decision is `Rejected`.
- `Abstained` votes do not block but do not contribute to the approval count.
- If all reviewers abstain and `minimumReviewers` is never met, the review remains open.

### Quorum Type: `Majority`

- Outcome is `Approved` when: `Approved` count > `Rejected` count AND `minimumReviewers` is met.
- Outcome is `Rejected` when: `Rejected` count ≥ `Approved` count AND `minimumReviewers` is met.
- Ties resolve to `Rejected`.

### Quorum Type: `SingleApprove`

- Outcome is `Approved` when: at least one eligible reviewer submits `Approved`.
- `Rejected` decisions from other reviewers do not block the outcome.
- Intended for low-risk advisory Guideline variants only. Requires explicit policy declaration.

### Quorum Type: `SingleReject`

- Outcome is `Rejected` immediately upon the first `Rejected` decision from an eligible reviewer.
- Useful for safety-critical content where a single veto is sufficient to halt release.
- Does not wait for `minimumReviewers` to be met before rejecting.

### General Quorum Rules

- Quorum is evaluated after each `ApprovalDecision` submission.
- Quorum is never evaluated on `Pending` decisions — only `Submitted`.
- `Superseded` decisions are excluded from quorum calculation.
- Once quorum is reached, no further decisions can be submitted or revised.
- The policy governing the review is fixed at the moment the entity enters `InReview`. Policy changes after submission do not affect in-progress reviews.

---

## Permission Gates

Every actor in the approval process must hold an active UserRole with the required capability, scoped to the same Organization as the entity under review.

| Action                                  | Required Capability     | Constraint                               |
|-----------------------------------------|-------------------------|------------------------------------------|
| Submit entity for review                | `content.submit`        | Must be author or delegate               |
| Submit ApprovalDecision (Approved)      | `content.approve`       | Must be in `eligibleRoles` per policy    |
| Submit ApprovalDecision (Rejected)      | `content.reject`        | Must be in `eligibleRoles` per policy    |
| Submit ApprovalDecision (Abstained)     | `content.review`        | Must be in `eligibleRoles` per policy    |
| Revise own ApprovalDecision             | `content.approve`       | Before quorum only; own decisions only   |
| Resolve quorum and write ApprovalStatus | System (policy-driven)  | Not a user action — computed outcome     |
| Override rejection (re-open as Draft)   | `content.recall`        | OrgAdmin only; creates audit record      |
| Define or update ApprovalPolicy         | `policy.manage`         | OrgAdmin only; scoped to Organization    |

**No capability grants self-approval.** The system rejects any decision where `reviewerId` matches the entity's `submittedBy` when `requireSeparationOfDuty: true`.

**No capability grants automatic approval.** The `minimumReviewers` floor cannot be bypassed regardless of role.

---

## Separation of Duty Matrix

| Role Combination                          | Permitted | Rule                                              |
|-------------------------------------------|-----------|---------------------------------------------------|
| Author submits AND approves own content   | No        | `requireSeparationOfDuty` enforced on all content |
| Author submits AND rejects own content    | No        | Same rule                                         |
| Author abstains on own content            | No        | Participation in review of own content is blocked |
| Reviewer approves AND releases package    | Yes       | Approval and Release are separate capabilities    |
| OrgAdmin approves AND assigns own role    | No        | Role self-assignment is prohibited                |
| Two reviewers each approve independently  | Yes       | Multi-reviewer is the intended model              |

---

## Multi-Reviewer Model

Multi-reviewer is the default. `minimumReviewers: 1` is the floor for low-risk content; clinical content (Algorithm, Medication, Protocol) should use `minimumReviewers: 2` or higher as the Organization's policy baseline.

**Reviewer assignment:**
- Reviewers are not individually assigned per review instance in Phase 0.
- Any user holding an eligible role may submit a decision.
- The policy's `eligibleRoles` list controls who qualifies.
- First-come decisions are valid as long as quorum rules are satisfied.

**Concurrent decisions:**
- Multiple reviewers may submit decisions simultaneously.
- Quorum is re-evaluated after each submission.
- Race conditions on quorum resolution must be handled atomically — two simultaneous submissions that both complete quorum must result in exactly one final outcome.

**Decision revision window:**
- A reviewer may revise their decision (Supersede) while: the review is still `InReview` AND quorum has not been reached.
- After quorum is reached, no revision is possible.

---

## No Auto-Approval Rule

Auto-approval is categorically prohibited. This rule has no exceptions in Phase 0.

The following are all prohibited:

| Prohibited Pattern                                               | Reason                                            |
|------------------------------------------------------------------|---------------------------------------------------|
| Time-based approval (review window expires → auto-Approved)      | Safety governance cannot lapse due to inactivity  |
| Single-actor bypass (OrgAdmin approves without reviewer)         | OrgAdmin authority does not replace review        |
| Threshold-bypass (minimumReviewers set to 0)                     | Policy validation rejects `minimumReviewers < 1`  |
| Programmatic decision injection without UserRole identity        | No system actor may submit ApprovalDecision       |
| Bulk approval across multiple entities in one action             | Each entity's review is a distinct governed act   |
| Inherited approval (parent package approval covers child items)  | Content and package approvals are independent     |

Review window timeout produces only an escalation notification (`NotifyOrgAdmin`). It does not change `ApprovalStatus` or quorum state.

---

## Audit Requirements

### ApprovalDecision Audit Record

Every `ApprovalDecision` submission creates an immutable audit event:

| Field              | Required | Description                                                    |
|--------------------|----------|----------------------------------------------------------------|
| `decisionId`       | Yes      | The `ApprovalDecision.id`                                      |
| `entityId`         | Yes      | The content or package entity under review                     |
| `entityType`       | Yes      | Content type or `ContentPackage`                               |
| `versionId`        | Yes      | The Version being reviewed                                     |
| `organizationId`   | Yes      | Tenant scope                                                   |
| `reviewerId`       | Yes      | UserRole identity of the reviewer                              |
| `outcome`          | Yes      | `Approved \| Rejected \| Abstained`                            |
| `rationale`        | Yes      | Free-text justification — never empty                          |
| `submittedAt`      | Yes      | UTC timestamp                                                  |
| `policyId`         | Yes      | The `ApprovalPolicy.id` governing this review                  |
| `supersedes`       | No       | Prior `ApprovalDecision.id` if this is a revision              |

### ApprovalPolicy Change Audit Record

Every create, update, or deactivation of an `ApprovalPolicy` creates an immutable audit event:

| Field              | Required | Description                                                    |
|--------------------|----------|----------------------------------------------------------------|
| `policyId`         | Yes      | The `ApprovalPolicy.id`                                        |
| `organizationId`   | Yes      | Tenant scope                                                   |
| `actorUserId`      | Yes      | OrgAdmin identity                                              |
| `changeType`       | Yes      | `Created \| Updated \| Deactivated`                            |
| `previousState`    | Yes      | Snapshot of policy fields before change (null for Created)     |
| `newState`         | Yes      | Snapshot of policy fields after change                         |
| `rationale`        | Yes      | Justification for the policy change                            |
| `effectiveAt`      | Yes      | UTC timestamp of change                                        |

### Quorum Resolution Audit Record

When policy quorum is reached and `ApprovalStatus` is updated:

| Field              | Required | Description                                                    |
|--------------------|----------|----------------------------------------------------------------|
| `entityId`         | Yes      | The resolved entity                                            |
| `versionId`        | Yes      | The Version resolved                                           |
| `organizationId`   | Yes      | Tenant scope                                                   |
| `resolvedOutcome`  | Yes      | `Approved \| Rejected`                                         |
| `policyId`         | Yes      | The governing policy                                           |
| `quorumType`       | Yes      | The quorum type applied                                        |
| `decisionIds`      | Yes      | All `ApprovalDecision.id` values that contributed              |
| `resolvedAt`       | Yes      | UTC timestamp of resolution                                    |

**Audit Invariants:**
- No audit record may be modified or deleted after creation.
- A quorum resolution that cannot produce a complete audit record must not update `ApprovalStatus`.
- Audit records are scoped to Organization and are not accessible cross-tenant.

---

## Entity Relationship Summary

```
Organization
  └── defines:  ApprovalPolicy (1..*)
        └── governs: ApprovalDecision (0..*)
              └── references: Version of (Algorithm | Medication |
                              Protocol | Guideline | ContentPackage)
                  └── resolves to: ApprovalStatus on parent entity
```

---

## Reference: ApprovalPolicy Configuration Defaults (Phase 0)

| Entity Type    | quorumType   | minimumReviewers | requireSeparationOfDuty | Notes                                |
|----------------|--------------|------------------|-------------------------|--------------------------------------|
| Algorithm      | `Unanimous`  | 2                | `true`                  | Clinical safety — no single reviewer |
| Medication     | `Unanimous`  | 2                | `true`                  | Clinical safety — no single reviewer |
| Protocol       | `Unanimous`  | 2                | `true`                  | Procedural safety — no single reviewer|
| Guideline      | `Majority`   | 1                | `true`                  | Advisory content — lower quorum floor|
| ContentPackage | `Unanimous`  | 1                | `true`                  | Release gate — separate authority    |

These are **baseline defaults**. Each Organization must explicitly declare an `ApprovalPolicy` per entity type. The defaults above apply only when no organization-level policy has been defined. Organizations may raise but not lower the `minimumReviewers` floor below the baseline.
