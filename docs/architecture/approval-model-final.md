# Approval Model — Final Reference
## ResQBrain Phase 0

**Version:** 1.0
**Date:** 2026-03-25
**Status:** Canonical — standalone approval reference, separate from lifecycle model
**Applies to:** Algorithm, Medication, Protocol, Guideline, ContentPackage
**Sources:** `domain-entity-blueprint.md`, `tenant-model.md`

---

## Foundational Separation Rule

The Approval Model and the Lifecycle Model are **explicitly separate concerns**.

| Concern                      | Owned by              |
|------------------------------|-----------------------|
| Which states exist           | Lifecycle Model       |
| Which transitions are valid  | Lifecycle Model       |
| Writing `ApprovalStatus`     | Lifecycle Model       |
| How a decision is made       | Approval Model        |
| Who may make a decision      | Approval Model        |
| What constitutes valid quorum| Approval Model        |
| Producing a resolved outcome | Approval Model        |

**Critical rule:** Quorum resolution by the Approval Model does **not** automatically trigger a lifecycle transition. It produces a named outcome (`Approved` or `Rejected`). The Lifecycle Model receives this outcome, evaluates whether the transition is still valid (preconditions, tenant checks, state check), and only then executes the transition and writes the audit record.

These are two sequential, independent operations — not one.

```
Approval Model                    Lifecycle Model
──────────────────────────        ──────────────────────────────────────
Collect ApprovalDecisions         [waits — does not observe decisions directly]
Evaluate quorum per policy
Produce outcome signal ────────►  Receive outcome
                                  Re-validate preconditions
                                  Validate state == InReview
                                  Validate tenant context
                                  Execute transition
                                  Write audit record
```

---

## Part 1 — ApprovalStatus

### Role in the Approval Model

`ApprovalStatus` is a **value type embedded on the governed entity**. It is not a standalone record. It is not set by any user action. It is written by the Lifecycle Model as the result of consuming a quorum outcome signal from the Approval Model.

### States Visible to the Approval Model

| State      | What it means to the Approval Model                                     |
|------------|-------------------------------------------------------------------------|
| `InReview` | Active review window. ApprovalDecisions are being collected.            |
| `Approved` | Quorum resolved to Approved. Lifecycle transition has been executed.    |
| `Rejected` | Quorum resolved to Rejected. Lifecycle transition has been executed.    |

The Approval Model is blind to `Draft`, `Released`, and `Deprecated`. Those are pure lifecycle states. The Approval Model only operates while an entity is in `InReview`.

### Lifecycle States vs Approval Model Involvement

| State        | Approval Model involved? |
|--------------|--------------------------|
| `Draft`      | No                        |
| `InReview`   | Yes — active              |
| `Approved`   | No — outcome is written; model's role ends |
| `Rejected`   | No — outcome is written; model's role ends |
| `Released`   | No                        |
| `Deprecated` | No                        |

### Invariants

- `ApprovalStatus` is never written directly by the Approval Model.
- `ApprovalStatus` on an entity in `InReview` does not change until quorum resolves AND the Lifecycle Model executes the transition.
- If the Lifecycle Model's precondition check fails after quorum resolves, the entity remains in `InReview`. The quorum resolution event is recorded, but the transition is not executed. The review must be re-evaluated.

---

## Part 2 — ApprovalDecision

### Role

A single, explicit, human-authored judgment submitted by an eligible reviewer on an entity in `InReview` state.

### Identity

| Field          | Type   | Mutable | Description                                                  |
|----------------|--------|---------|--------------------------------------------------------------|
| `id`           | string | Never   | Stable, globally unique identifier                           |
| `organizationId`| string| Never   | Tenant reference — must match reviewed entity's Org          |
| `entityId`     | string | Never   | The entity under review                                      |
| `entityType`   | enum   | Never   | `Algorithm \| Medication \| Protocol \| Guideline \| ContentPackage` |
| `versionId`    | string | Never   | Specific Version being reviewed — locked at submission       |

### Decision Fields

| Field           | Type   | Required | Description                                                       |
|-----------------|--------|----------|-------------------------------------------------------------------|
| `outcome`       | enum   | Yes      | `Approved \| Rejected \| RequestChanges \| Abstained`             |
| `reviewerId`    | string | Yes      | UserRole identity of the reviewer                                 |
| `reviewedAt`    | UTC    | Yes      | Timestamp of submission                                           |
| `rationale`     | string | Yes      | Free-text justification — mandatory on all outcomes               |
| `changeRequests`| list   | Cond.    | Required when `outcome == RequestChanges`; structured change items |
| `supersededBy`  | string | No       | ID of a later decision by this reviewer (pre-quorum only)         |

### Decision Status

| Status       | Description                                                           |
|--------------|-----------------------------------------------------------------------|
| `Pending`    | Reviewer is eligible and assigned but has not yet submitted           |
| `Submitted`  | Decision recorded. Immutable in all fields.                           |
| `Superseded` | Replaced by a revised decision by the same reviewer before quorum     |

### Three Decision Outcomes

#### `Approved`

The reviewer confirms the content meets the standard required for release.

- Requires `content.approve` (or `package.approve`) capability.
- `rationale` is mandatory.
- Counts toward approval quorum per the governing `ApprovalPolicy`.
- Requires capability check: `content.approve` within the entity's `organizationId`.

#### `Rejected`

The reviewer determines the content does not meet the standard and should not be released in its current form. This is a normal business outcome, not an error condition.

- Requires `content.reject` (or `package.reject`) capability.
- `rationale` is mandatory and must be substantive — general text is insufficient.
- Counts toward rejection quorum per the governing `ApprovalPolicy`.
- Once quorum resolves to `Rejected`, the Version is terminal. A new Version at `Draft` is required.

#### `RequestChanges`

The reviewer identifies specific issues that must be addressed before they can approve. This outcome does not resolve quorum in either direction. It is a blocking signal within an ongoing review.

- Requires `content.review` capability.
- `rationale` is mandatory.
- `changeRequests` list is required: each item must identify the specific field, section, or issue.
- Does **not** count toward approval or rejection quorum.
- Does **not** advance or terminate the review.
- The entity remains in `InReview`. The author is notified of pending change requests.
- A reviewer who submitted `RequestChanges` may later revise their decision to `Approved` or `Rejected` once changes are addressed (via Supersede, pre-quorum).
- `RequestChanges` does **not** trigger a lifecycle transition. The entity does not return to `Draft`. If the author needs to make substantive edits, the entity must be recalled (`content.recall`) back to `Approved → InReview` path — which requires a new Version.

#### `Abstained`

The reviewer participates in the process but declines to cast a directional vote.

- Requires `content.review` capability.
- `rationale` is mandatory.
- Counts toward minimum reviewer participation count.
- Does not count toward approval or rejection quorum thresholds.
- Does not block quorum resolution if other reviewers meet quorum.

### Decision Invariants

- A `Submitted` decision is immutable. No field changes after write.
- One active (non-`Superseded`) decision per reviewer per `{ entityId, versionId }`.
- A reviewer may revise (Supersede) their own decision only while: entity is still `InReview` AND quorum has not yet been reached.
- Once quorum is reached, no further decisions may be submitted or superseded.
- A decision where `versionId ≠ entity.currentVersionId` is stale and excluded from quorum evaluation.
- `Abstained` and `RequestChanges` do not count toward quorum thresholds.
- No decision is valid without an eligible UserRole within the entity's `organizationId`.

---

## Part 3 — ApprovalPolicy

### Role

The Organization-defined rules that determine who may review, how many reviewers are required, how quorum is calculated, and what constitutes a resolved outcome.

### Identity

| Field           | Type   | Mutable     | Description                                              |
|-----------------|--------|-------------|----------------------------------------------------------|
| `id`            | string | Never       | Stable identifier                                        |
| `organizationId`| string | Never       | Tenant reference — immutable                             |
| `appliesTo`     | enum   | By OrgAdmin | `Algorithm \| Medication \| Protocol \| Guideline \| ContentPackage \| All` |
| `scopeLevel`    | enum   | By OrgAdmin | `Organization \| Region \| Station`                      |
| `scopeTargetId` | string | By OrgAdmin | Optional Region or Station id for narrower policies      |
| `priority`      | int    | By OrgAdmin | Higher value wins when multiple policies match; ties resolved by scope specificity |

### Reviewer Configuration

| Field                      | Type    | Description                                                              |
|----------------------------|---------|--------------------------------------------------------------------------|
| `eligibleRoles`            | list    | `roleType` values permitted to submit `ApprovalDecision` for this policy |
| `minimumReviewers`         | int     | Minimum distinct reviewers before quorum is evaluated; floor is 1        |
| `quorumType`               | enum    | See quorum definitions below                                             |
| `requireSeparationOfDuty`  | bool    | Submitter may not act as reviewer when `true`                            |
| `allowSelfReview`          | bool    | Fixed `false` in Phase 0. Not configurable.                              |
| `requireRationale`         | bool    | Fixed `true` in Phase 0. Not configurable.                               |

### Quorum Types

#### `Unanimous`

| Condition            | Result     |
|----------------------|------------|
| All submitted decisions are `Approved` AND `minimumReviewers` met | Resolves: `Approved` |
| Any `Rejected` decision is submitted | Resolves immediately: `Rejected` |
| Only `Abstained` / `RequestChanges` — `minimumReviewers` not met | Remains open |

Use for: clinical content (Algorithm, Medication, Protocol), ContentPackage.

#### `Majority`

| Condition            | Result     |
|----------------------|------------|
| `Approved` count > `Rejected` count AND `minimumReviewers` met | Resolves: `Approved` |
| `Rejected` count ≥ `Approved` count AND `minimumReviewers` met | Resolves: `Rejected` (ties → Rejected) |

Use for: Guideline.

#### `SingleApprove`

| Condition            | Result     |
|----------------------|------------|
| Any one eligible `Approved` decision | Resolves immediately: `Approved` |
| All eligible reviewers submitted `Rejected` | Resolves: `Rejected` |

Use for: low-risk advisory Guideline variants only. Requires explicit policy declaration. Not the default.

#### `SingleReject`

| Condition            | Result     |
|----------------------|------------|
| Any one eligible `Rejected` decision | Resolves immediately: `Rejected` |
| All eligible reviewers submitted `Approved` AND `minimumReviewers` met | Resolves: `Approved` |

Use for: safety-critical content where a single veto is sufficient. Requires explicit policy declaration.

### Universal Quorum Rules

- Quorum is re-evaluated after every `Submitted` decision.
- Only `Submitted` decisions are counted. `Pending`, `Superseded`, stale (version-mismatched) decisions are excluded.
- `Abstained` and `RequestChanges` count toward `minimumReviewers` participation but not toward approve/reject thresholds.
- Quorum resolution is atomic. If two decisions submitted concurrently both complete quorum, exactly one outcome is produced.
- Once quorum resolves, no further decisions are accepted. Any concurrent submission arriving after quorum lock is rejected.
- The policy governing a review is **frozen at the moment the entity enters `InReview`**. Policy changes after submission do not affect in-progress reviews.

### Timeout

| Field               | Type | Description                                                                |
|---------------------|------|----------------------------------------------------------------------------|
| `reviewWindowDays`  | int  | Advisory overdue threshold in days                                         |
| `escalationPolicy`  | enum | `None \| NotifyOrgAdmin` — what happens when window is exceeded            |

Timeout expiry produces only a notification. It never changes `ApprovalStatus`, never auto-resolves quorum, never rejects the review.

### Policy Resolution When Multiple Policies Match

1. Highest `priority` value wins.
2. Ties broken by scope specificity: `Station > Region > Organization`.
3. Remaining ties are a configuration error — OrgAdmin must resolve.

---

## Part 4 — Permission Integration

### UserRole → Permission → Approval chain

```
Organization
  └── UserRole (scoped to Org, optionally narrowed to Region or Station)
        └── grants Permission (capability + entityScope)
              └── evaluated at: every ApprovalDecision submission
                               every policy eligibility check
                               every lifecycle transition gate
```

### No global permissions

- No Permission exists without a UserRole.
- No UserRole exists without an `organizationId`.
- Permission evaluation always requires: `{ userId, organizationId, capability }`.
- A Permission granted in Organization A has zero effect in Organization B.
- Cross-organization permission inheritance does not exist.

### Capability Mapping for Approval Actions

| Action                                          | Required Capability        | Scope constraint                                          |
|-------------------------------------------------|----------------------------|-----------------------------------------------------------|
| Submit entity for review                        | `content.submit`           | Same `organizationId` as entity                           |
| Submit `Approved` decision                      | `content.approve`          | Same Org; in `eligibleRoles`; ≠ submitter if SoD required |
| Submit `Rejected` decision                      | `content.reject`           | Same Org; in `eligibleRoles`; ≠ submitter if SoD required |
| Submit `RequestChanges` decision                | `content.review`           | Same Org; in `eligibleRoles`                              |
| Submit `Abstained` decision                     | `content.review`           | Same Org; in `eligibleRoles`                              |
| Revise own decision (Supersede)                 | `content.approve`          | Own decision only; pre-quorum only                        |
| Recall Approved content                         | `content.recall`           | OrgAdmin or Approver; same Org                            |
| Define / update ApprovalPolicy                  | `policy.manage`            | OrgAdmin only; same Org                                   |
| Release ContentPackage                          | `package.release`          | Same Org; separate from approval role                     |

### Separation of Duty Enforcement

| Combination                                     | Permitted | Rule                                               |
|-------------------------------------------------|-----------|----------------------------------------------------|
| Author submits AND approves same entity         | No        | `requireSeparationOfDuty: true` enforced           |
| Author submits AND rejects same entity          | No        | Same                                               |
| Author submits AND requests changes on own work | No        | Author cannot review their own submission          |
| Reviewer approves AND releases package          | Yes       | Approval and Release are separate capabilities     |
| OrgAdmin assigns own role                       | No        | `role.assign` cannot be used on self               |
| Two independent reviewers both approve          | Yes       | This is the intended multi-reviewer model          |

### Station-Scoped UserRole

A UserRole scoped to a Station narrows the reviewer's jurisdiction to content targeted at that Station. It does not create a sub-tenant. Approval decisions made under a Station-scoped UserRole are still scoped to the Organization and counted toward the Organization-level quorum for that entity.

---

## Part 5 — Approval Flow

### Textual Flow Diagram

```
ENTITY IN DRAFT
      │
      │  [content.submit]
      │  Preconditions: structural completeness,
      │  no Deprecated refs, org Active, audit writable
      ▼
ENTITY IN INREVIEW
      │
      │  ApprovalPolicy resolved and frozen
      │  Policy captures: eligibleRoles, minimumReviewers, quorumType, SoD
      │
      ├──────────────────────────────────────────────────────────────┐
      │                                                              │
      │  Reviewer A                    Reviewer B                   │
      │  [content.approve/reject/      [content.approve/reject/     │
      │   review/abstain]               review/abstain]             │
      │  Submits ApprovalDecision       Submits ApprovalDecision    │
      │                                                              │
      │  ◄── Quorum re-evaluated after each Submitted decision ────► │
      │                                                              │
      └──────────────────────────────────────────────────────────────┘
                          │
                  Quorum reached?
                    /          \
                  NO            YES
                  │              │
              [wait]         Outcome resolved:
                             Approved / Rejected
                                  │
                          ┌───────┘
                          │
                          │  OUTCOME SIGNAL → Lifecycle Model
                          │
                          ▼
               Lifecycle Model receives outcome
               Re-validates preconditions:
                 □ entity.approvalStatus still == InReview
                 □ entity.organizationId == actor org
                 □ Organization.status == Active
                 □ audit record writable
                          │
                   Preconditions pass?
                    /             \
                  NO               YES
                  │                 │
              entity stays      Lifecycle executes transition
              InReview          Writes new ApprovalStatus
              [error logged]    Writes audit record
                                      │
                              ┌───────┴──────────┐
                              ▼                  ▼
                          APPROVED           REJECTED
                         (awaits             (terminal for
                          Release)            this Version)
```

### Critical Rule: No Auto-Transition

The quorum outcome signal is **not** a command to change state. It is an input that the Lifecycle Model evaluates independently. Reasons the Lifecycle Model may decline to execute even after quorum resolves:

1. Entity was recalled between quorum resolution and transition execution.
2. Organization was suspended between quorum resolution and transition execution.
3. Audit write fails.
4. Precondition state is inconsistent (concurrent modification).

In all cases: entity remains in `InReview`. The quorum resolution event is audit-logged. No state change occurs.

---

## Part 6 — Audit Requirements

### Three Audit Record Types

---

#### A. ApprovalDecision Submission Record

Written when a reviewer submits any `ApprovalDecision`. Immutable after write.

| Field              | Required | Description                                                        |
|--------------------|----------|--------------------------------------------------------------------|
| `id`               | Yes      | Unique audit event id                                              |
| `decisionId`       | Yes      | The `ApprovalDecision.id`                                          |
| `entityId`         | Yes      | Entity under review                                                |
| `entityType`       | Yes      | Content type or ContentPackage                                     |
| `versionId`        | Yes      | Version being reviewed                                             |
| `organizationId`   | Yes      | Tenant scope — never null                                          |
| `reviewerId`       | Yes      | UserRole identity of the reviewer                                  |
| `capability`       | Yes      | Capability invoked (`content.approve`, `content.reject`, etc.)     |
| `outcome`          | Yes      | `Approved \| Rejected \| RequestChanges \| Abstained`              |
| `rationale`        | Yes      | Free-text — never empty                                            |
| `changeRequests`   | Cond.    | Required when `outcome == RequestChanges`                          |
| `submittedAt`      | Yes      | UTC timestamp                                                      |
| `policyId`         | Yes      | Governing `ApprovalPolicy.id`                                      |
| `supersedes`       | No       | Prior decision id if this is a revision                            |

---

#### B. Quorum Resolution Record

Written when quorum resolves. This is the Approval Model's output record. It precedes the Lifecycle Model's transition audit record. They are separate records.

| Field              | Required | Description                                                        |
|--------------------|----------|--------------------------------------------------------------------|
| `id`               | Yes      | Unique audit event id                                              |
| `entityId`         | Yes      | Resolved entity                                                    |
| `versionId`        | Yes      | Version resolved                                                   |
| `organizationId`   | Yes      | Tenant scope                                                       |
| `resolvedOutcome`  | Yes      | `Approved \| Rejected`                                             |
| `policyId`         | Yes      | Governing policy                                                   |
| `quorumType`       | Yes      | Quorum type applied                                                |
| `contributingDecisionIds` | Yes | All `ApprovalDecision.id` values counted toward resolution   |
| `resolvedAt`       | Yes      | UTC timestamp                                                      |
| `lifecycleExecuted`| Yes      | Boolean: did the Lifecycle Model successfully execute the transition|
| `lifecycleFailureReason` | Cond. | Required when `lifecycleExecuted == false`                   |

---

#### C. ApprovalPolicy Change Record

Written on every create, update, or deactivation of an `ApprovalPolicy`.

| Field           | Required | Description                                                         |
|-----------------|----------|---------------------------------------------------------------------|
| `policyId`      | Yes      | Policy affected                                                     |
| `organizationId`| Yes      | Tenant scope                                                        |
| `actorUserId`   | Yes      | OrgAdmin identity                                                   |
| `changeType`    | Yes      | `Created \| Updated \| Deactivated`                                 |
| `previousState` | Yes      | Full policy snapshot before change (null for Created)               |
| `newState`      | Yes      | Full policy snapshot after change                                   |
| `rationale`     | Yes      | Justification for the policy change                                 |
| `effectiveAt`   | Yes      | UTC timestamp                                                       |

### Audit Invariants

- All three record types are append-only.
- `organizationId` is required on all records. Missing `organizationId` → write rejected.
- Records are Organization-scoped. No cross-tenant audit queries in Phase 0.
- A quorum resolution record must be written even if the Lifecycle Model subsequently declines to execute the transition. `lifecycleExecuted: false` with reason.

---

## Part 7 — Hard Rules

### H-01 — No Approval Without Permission

An `ApprovalDecision` may only be submitted by a user holding an active, non-expired UserRole with the required capability (`content.approve`, `content.reject`, or `content.review`) within the entity's `organizationId`. No decision is valid without this check.

### H-02 — No Release Without Approval

A ContentPackage may only reach `Released` when its `approvalStatus == Approved`. Content entities may only be co-released when their `approvalStatus == Approved`. No exception path exists.

### H-03 — No Auto-Approval

Auto-approval is categorically prohibited:

| Prohibited pattern                                               | Hard constraint                              |
|------------------------------------------------------------------|----------------------------------------------|
| Review window expiry → auto-Approved                             | Timeout is advisory only; never triggers transition |
| `minimumReviewers: 0` in policy                                  | Policy write rejected at validation          |
| OrgAdmin submits and approves own submission                     | SoD check blocks                             |
| System actor submits decision without UserRole identity          | No anonymous decision is valid               |
| Bulk approval of multiple entities in one operation              | Each entity review is a discrete operation   |
| Package approval implies content approval                        | Independent approval processes               |
| Quorum resolution automatically triggers lifecycle transition    | Lifecycle Model must execute separately      |

### H-04 — No Survey Influence on Approval

SurveyInsight has no path into the Approval Model:

- `ApprovalPolicy` may not reference SurveyInsight records.
- `ApprovalDecision` may not be submitted based on a SurveyInsight trigger.
- Quorum logic is blind to all SurveyInsight data.
- A `SafetyConcern` insight does not auto-trigger review initiation, recall, or rejection.
- The Survey Insight module has no write access to the Governance or Content Lifecycle modules.

### H-05 — No Cross-Tenant Approval

- An `ApprovalDecision` submitted by a reviewer whose UserRole `organizationId` differs from the entity's `organizationId` is rejected.
- An `ApprovalPolicy` from Organization A cannot govern content in Organization B.
- Quorum resolution for an entity in Organization A cannot count decisions from reviewers in Organization B.

### H-06 — Approval Model Never Writes ApprovalStatus

The Approval Model produces quorum outcomes. The Lifecycle Model writes `ApprovalStatus`. These are never merged. No method in the Approval module may write to `ApprovalStatus` directly.

---

## Part 8 — Edge Cases

---

### EC-01 — Conflicting Approvals (Mixed Outcome)

**Scenario:** Under `Majority` quorum, Reviewer A submits `Approved`, Reviewer B submits `Rejected`. `minimumReviewers: 2` is met. Counts are tied at 1–1.

**Risk:** Ambiguous or incorrect quorum resolution.

**Required behavior:** `Majority` quorum defines ties as `Rejected`. The quorum resolves to `Rejected`. This is not a conflict — it is a defined outcome. `Rejected` rationale from the rejection decision is included in the quorum resolution record. No further decisions are accepted. Lifecycle Model executes `InReview → Rejected`.

---

### EC-02 — Approval Withdrawal

**Scenario:** A reviewer submitted `Approved`. They realize they made an error and want to withdraw their decision.

**Risk:** An incorrect decision contributes to quorum.

**Required behavior (pre-quorum):** The reviewer may Supersede their own decision before quorum is reached. They submit a new `ApprovalDecision` record (with `supersedes` pointing to the prior id). The original is marked `Superseded` and excluded from quorum. The new decision (including a revised outcome) is counted.

**Required behavior (post-quorum):** Withdrawal is not possible. Once quorum is reached, decisions are immutable and the review is closed. The reviewer's concern must be addressed by raising a recall (if the entity is now `Approved`) via a user with `content.recall` capability, with audit rationale.

**Required behavior (after `Rejected`):** No withdrawal mechanism. A `Rejected` Version is terminal. New Version at `Draft`.

---

### EC-03 — Re-Review After Changes (RequestChanges Path)

**Scenario:** Reviewer submits `RequestChanges`. Author wants to address the changes without terminating the current review.

**Risk:** Author edits content while it is in `InReview` — violating the locked state.

**Required behavior:** `InReview` entities are locked. An author **cannot** edit content while it is in `InReview`. The `RequestChanges` outcome is a signal to the author, not a trigger for editing.

**Path 1 — Changes are minor (clarification only):** The reviewer may revise their `RequestChanges` decision to `Approved` via Supersede, pre-quorum, if the content itself is acceptable without edit.

**Path 2 — Substantive changes are required:** A user with `content.recall` capability must recall the entity (`Approved → InReview` path — which requires the entity to have previously been `Approved`). But this entity is still `InReview`, so recall is not available. The entity must be **recalled via a different mechanism**: the current review must be explicitly closed as `Rejected` (by a reviewer submitting `Rejected`), creating a terminal `Rejected` Version. The author then creates a new Version at `Draft` addressing the change requests. This is correct behavior: an InReview entity requiring substantive changes is a rejection, not a pause.

---

### EC-04 — Stale Approvals After New Version

**Scenario:** Content entity is in `InReview` at v2. A new v3 is created (e.g., via an emergency re-submission path). Some reviewers have already submitted decisions against v2.

**Risk:** Decisions from v2 are applied to v3.

**Required behavior:** `ApprovalDecision` records are bound to `versionId`. Quorum evaluation excludes any decision where `versionId ≠ entity.currentVersionId`. If v3 becomes `currentVersionId`, all v2 decisions become stale and are excluded from quorum. The review for v3 starts fresh. The v2 decisions are retained in audit history but do not contribute to v3's quorum. Reviewers must re-submit decisions for v3.

---

### EC-05 — Reviewer Role Expires Mid-Review

**Scenario:** A reviewer submits `Approved` at T=0 while holding a valid UserRole. Their role expires at T=1. Quorum resolves at T=2.

**Risk:** Expired role's decision contributes to a governance outcome.

**Required behavior:** Role validity is checked at decision submission time (T=0). An `ApprovalDecision` that was validly submitted at T=0 remains valid. Role expiry does not retroactively invalidate submitted decisions. The quorum resolution includes the T=0 decision. If the reviewer's role was invalid at T=0, the decision is invalid regardless of when quorum resolves.

---

### EC-06 — Policy Changed After Review Initiated

**Scenario:** An `ApprovalPolicy` is updated (e.g., `minimumReviewers` raised from 1 to 2) while an entity is in `InReview` under the prior policy.

**Risk:** Review resolves under different rules than those in effect when it started.

**Required behavior:** Policy is frozen at `InReview` entry. The `policyId` recorded in each `ApprovalDecision` identifies the governing policy snapshot. The policy change applies only to reviews initiated after the change. The in-progress review resolves under the original policy. The quorum resolution record includes the `policyId` for auditability.

---

### EC-07 — Quorum Resolves but Lifecycle Precondition Fails

**Scenario:** Quorum resolves to `Approved`. Between quorum resolution and lifecycle execution, the Organization is suspended.

**Risk:** Quorum resolution event implies an `Approved` state that the Lifecycle Model cannot execute.

**Required behavior:** Lifecycle Model evaluates preconditions independently. `Organization.status == Active` is required. Suspension causes the precondition to fail. The entity remains in `InReview`. The quorum resolution record is written with `lifecycleExecuted: false` and `lifecycleFailureReason: "Organization suspended"`. When the Organization is restored to `Active`, a manual re-evaluation trigger (by OrgAdmin) re-attempts the lifecycle transition without requiring a new round of approvals — the quorum resolution record is still valid.

---

### EC-08 — Simultaneous Decisions Completing Quorum

**Scenario:** Under `SingleApprove` quorum, two reviewers submit `Approved` at exactly the same time. Both submissions independently satisfy quorum.

**Risk:** Duplicate quorum resolution events. Duplicate lifecycle transitions.

**Required behavior:** Quorum resolution is atomic. The first submission to complete quorum resolution (per system ordering) transitions the state. The second submission, processed concurrently, is recorded as a `Submitted` `ApprovalDecision` but arrives after quorum is locked. It is stored in audit history but does not produce a second quorum resolution event. The `ApprovalDecision` record for the second submission notes that quorum was already resolved at time of processing.

---

### EC-09 — Abstain Deadlock (Quorum Never Reached)

**Scenario:** Policy requires `minimumReviewers: 2`. One reviewer approves, the other abstrains. No other eligible reviewer submits. Review window expires.

**Risk:** Entity is permanently blocked in `InReview` with no auto-resolution.

**Required behavior:** This is an operational outcome, not a domain error. The review window triggers `escalationPolicy: NotifyOrgAdmin`. OrgAdmin may:
- Assign additional eligible reviewers (operational action).
- Execute `content.recall` to withdraw the submission (creates a new `Draft` path).
- Do nothing — entity remains open.

No automatic resolution occurs. The domain model does not break. Quorum never resolves until a human acts.

---

### EC-10 — RequestChanges Submitted After Quorum Has Resolved

**Scenario:** Two reviewers submitted `Approved`, quorum resolves. A third eligible reviewer (who had not yet submitted) submits `RequestChanges`.

**Risk:** Post-quorum decision modifies the resolved outcome.

**Required behavior:** Once quorum is reached, no further decisions are accepted. The third reviewer's `RequestChanges` submission is rejected with a domain error: "Review closed — quorum already resolved." The entity has transitioned to `Approved` (or is in the process of lifecycle execution). If the third reviewer has a legitimate concern, they must raise it via `content.recall` (if entity is now `Approved`) through an actor with the required capability.

---

## Part 9 — Phase 0 Default Policies

Baseline defaults applied when no Organization-level policy has been declared. Organizations may raise but not lower these baselines.

| Entity         | `quorumType`   | `minimumReviewers` | `requireSeparationOfDuty` | Notes                              |
|----------------|----------------|--------------------|---------------------------|------------------------------------|
| Algorithm      | `Unanimous`    | 2                  | `true`                    | Clinical safety — no single reviewer |
| Medication     | `Unanimous`    | 2                  | `true`                    | Clinical safety — no single reviewer |
| Protocol       | `Unanimous`    | 2                  | `true`                    | Procedural safety                  |
| Guideline      | `Majority`     | 1                  | `true`                    | Advisory content; lower floor      |
| ContentPackage | `Unanimous`    | 1                  | `true`                    | Dedicated release authority        |

`RequestChanges` submissions do not satisfy `minimumReviewers`. Only `Approved`, `Rejected`, and `Abstained` outcomes count toward reviewer participation.
