# Lifecycle and Approval Model — ResQBrain Phase 0

**Version:** 1.0
**Date:** 2026-03-25
**Status:** Canonical Architecture Reference — supersedes `content-lifecycle-model.md` and `approval-model.md`
**Applies to:** Algorithm, Medication, Protocol, Guideline, ContentPackage

---

## Architectural Rule: Lifecycle ≠ Approval

This is a hard architectural separation, not a stylistic choice.

| Dimension         | Lifecycle Model                                      | Approval Model                                                    |
|-------------------|------------------------------------------------------|-------------------------------------------------------------------|
| **Answers**       | Which states exist and which transitions are valid   | How a transition is earned and who authorizes it                  |
| **Owns**          | `ApprovalStatus` value on each entity                | `ApprovalDecision`, `ApprovalPolicy`, quorum logic                |
| **Changes state** | Yes — writes the new `ApprovalStatus`                | No — produces input that the lifecycle consumes                   |
| **Actor**         | Domain rule engine                                   | Human reviewers acting under policy                               |
| **Observable output** | The current state of an entity               | A set of recorded decisions leading to a computed outcome         |

The lifecycle is the **state machine**. The approval model is the **gate** in front of two specific transitions: `InReview → Approved` and `InReview → Rejected`.

All other transitions (`Draft → InReview`, `Approved → Released`, `Released → Deprecated`, `Approved → InReview`) are governed by the lifecycle model alone via Permission checks. They do not involve ApprovalDecision records.

No part of the approval model may directly write `ApprovalStatus`. It may only produce a resolved outcome that the lifecycle model uses to execute a transition.

---

## Part A — Lifecycle State Machine

---

### A.1 States

```
                          ┌──────────────────────────────────────┐
                          │                                      │
   ┌───────┐  submit   ┌──┴───────┐  [quorum:approve]  ┌────────┴──┐
   │ DRAFT ├──────────►│ INREVIEW ├───────────────────►│ APPROVED  │
   └───┬───┘           └──┬───────┘                    └─────┬─────┘
       │                  │ [quorum:reject]                   │ recall
       │                  ▼                                   │
       │            ┌──────────┐                              │
       │            │ REJECTED │◄─────────────────────────────┘
       │            │(terminal)│
       │            └──────────┘
       │
       │    ┌──────────┐  package.release  ┌──────────┐  deprecate  ┌────────────┐
       └────┤ APPROVED ├──────────────────►│ RELEASED ├────────────►│ DEPRECATED │
            └──────────┘                  │(immutable)│             │ (terminal) │
                                          └──────────┘             └────────────┘
```

### A.2 State Definitions

| State        | Mutable | Description                                                                  |
|--------------|---------|------------------------------------------------------------------------------|
| `Draft`      | Yes     | Authoring in progress. No review initiated. Not distributable.               |
| `InReview`   | No      | Submitted. Locked. Awaiting ApprovalDecision quorum resolution.              |
| `Approved`   | No      | Quorum resolved to Approved. Eligible for ContentPackage inclusion.          |
| `Rejected`   | No      | Quorum resolved to Rejected. Terminal for this Version. New Version required.|
| `Released`   | No      | Published via Released ContentPackage. Permanently immutable.                |
| `Deprecated` | No      | Retired. All records preserved. No new distributions. Terminal.              |

---

### A.3 Transition Matrix — Content Entities

#### Allowed Transitions

| From       | To           | Trigger                          | Capability required   | Separation of duty rule                   |
|------------|--------------|----------------------------------|-----------------------|-------------------------------------------|
| Draft      | InReview     | Author submits                   | `content.submit`      | —                                         |
| InReview   | Approved     | Approval quorum resolved         | `content.approve`     | Reviewer ≠ submitter                      |
| InReview   | Rejected     | Rejection quorum resolved        | `content.reject`      | Reviewer ≠ submitter                      |
| Approved   | Released     | Released via ContentPackage      | `package.release`     | Releaser holds separate `package.release` |
| Approved   | InReview     | Recall before release            | `content.recall`      | OrgAdmin or designated Approver role only |
| Released   | Deprecated   | Retirement                       | `content.deprecate`   | —                                         |

#### Prohibited Transitions

| From       | To           | Reason and invariant enforced                                              |
|------------|--------------|----------------------------------------------------------------------------|
| Draft      | Approved     | Review is mandatory. Direct approval bypasses governance.                  |
| Draft      | Released     | Unreviewed content cannot be distributed.                                  |
| Draft      | Deprecated   | Deprecation applies only to Released artifacts.                            |
| InReview   | Released     | Active review must resolve before release.                                 |
| InReview   | Draft        | InReview is locked. Recall path is Approved → InReview only.               |
| InReview   | Deprecated   | Cannot deprecate content under active review.                              |
| Rejected   | InReview     | Rejected is terminal for this Version.                                     |
| Rejected   | Approved     | Rejected is terminal for this Version.                                     |
| Rejected   | Released     | Rejected is terminal for this Version.                                     |
| Rejected   | Deprecated   | Rejected is terminal for this Version.                                     |
| Released   | Draft        | Released content is immutable. New Version is the only forward path.       |
| Released   | InReview     | Released content is immutable.                                             |
| Released   | Approved     | State regression is prohibited.                                            |
| Released   | Rejected     | Released content is immutable.                                             |
| Deprecated | Any          | Deprecated is terminal. No transition in any direction is permitted.       |

---

### A.4 Transition Matrix — ContentPackage

ContentPackage follows the same state machine. The transitions are distinct from content entity transitions in capability names and in the release trigger mechanism.

#### Allowed Transitions

| From       | To           | Trigger                          | Capability required   | Separation of duty rule                    |
|------------|--------------|----------------------------------|-----------------------|--------------------------------------------|
| Draft      | InReview     | Package submitted                | `package.submit`      | —                                          |
| InReview   | Approved     | Approval quorum resolved         | `package.approve`     | Reviewer ≠ submitter                       |
| InReview   | Rejected     | Rejection quorum resolved        | `package.reject`      | Reviewer ≠ submitter                       |
| Approved   | Released     | Release executed                 | `package.release`     | Releaser holds `package.release`; ≠ approver |
| Approved   | InReview     | Package recalled                 | `package.recall`      | OrgAdmin only                              |
| Released   | Deprecated   | Package retired                  | `package.deprecate`   | —                                          |

#### ContentPackage — Additional Release Preconditions

A ContentPackage cannot transition `Approved → Released` unless all of the following hold at the moment of release execution:

1. Every `{ entityId, versionId }` in the package composition resolves to a content entity with `approvalStatus == Approved`.
2. All resolved entities carry the same `organizationId` as the package.
3. The `targetScope` entity (Region, County, Station) — if set — exists and is `Active` within the same Organization.
4. A complete audit record can be written for the release event. If audit write fails, the release is aborted.
5. The Organization is in `Active` status. A Suspended Organization may not release.

**Composition drift rule:** If any included content entity was recalled (`Approved → InReview`) or deprecated after the ContentPackage was approved, the package must be revalidated. The release must not proceed until all composition entries are again in `Approved` state.

---

### A.5 Deprecation Rules

#### Content Entity Deprecation (`Released → Deprecated`)

1. Requires `content.deprecate` capability on an active UserRole within the same Organization.
2. `deprecationDate` and `deprecationReason` are mandatory fields. The transition is rejected without them.
3. If other non-Deprecated content references this entity, the domain raises a warning. Deprecation proceeds, but those referencing entities must be updated before their next Release.
4. Existing Released ContentPackages that reference the now-Deprecated version remain valid and immutable. Deprecation does not retroactively invalidate historical releases.
5. `successorContentId` should be recorded if a replacement entity exists.

#### ContentPackage Deprecation (`Released → Deprecated`)

1. Requires `package.deprecate` capability.
2. `deprecationDate` and `deprecationReason` are mandatory.
3. Does not cascade — deprecating a package does not automatically deprecate the content entities within it.
4. Distribution targets for this package receive a retirement signal, but active users are not forcibly cut off. Distribution policy is an operational concern, not a domain concern.

#### Rejected State — Not a Deprecation

`Rejected` is terminal for a Version. It is not a deprecation. No `deprecationDate` or `deprecationReason` is set. A new Version at `Draft` is the only continuation path.

---

### A.6 Version and New-Version Rules

| Scenario                                         | New Version required |
|--------------------------------------------------|----------------------|
| Re-authoring after Rejected                      | Yes — new Draft      |
| Correction after Released                        | Yes — new Draft      |
| Package recalled and reassembled                 | Yes — new package Version |
| Rollback release (re-use prior approved version) | No new content Version; new Release record only |
| Draft → InReview                                 | No                   |
| InReview → Approved                              | No                   |
| InReview → Rejected                              | No                   |
| Approved → Released                              | No (package Version snapshotted) |
| Released → Deprecated                            | No                   |

---

### A.7 Audit Requirements — Lifecycle Events

Every state transition produces an immutable audit event. A transition that cannot produce a complete audit event **must not proceed**.

| Field            | Required | Description                                                  |
|------------------|----------|--------------------------------------------------------------|
| `entityId`       | Yes      | Entity affected                                              |
| `entityType`     | Yes      | `Algorithm \| Medication \| Protocol \| Guideline \| ContentPackage` |
| `versionId`      | Yes      | Version at time of transition                                |
| `organizationId` | Yes      | Tenant scope                                                 |
| `fromState`      | Yes      | Prior `ApprovalStatus` value                                 |
| `toState`        | Yes      | New `ApprovalStatus` value                                   |
| `actorUserId`    | Yes      | Identity of the user executing the transition                |
| `actorRoleId`    | Yes      | UserRole under which the capability was exercised            |
| `capability`     | Yes      | Specific capability invoked (e.g., `content.approve`)        |
| `timestamp`      | Yes      | UTC timestamp                                                |
| `rationale`      | Yes      | Free-text justification — never empty                        |

Audit records are append-only, Organization-scoped, and never cross-queryable between tenants.

---

## Part B — Approval Model

---

### B.1 Three Core Constructs

```
ApprovalPolicy          ApprovalDecision         ApprovalStatus
(org-defined rules)  →  (reviewer judgment)  →  (computed outcome)
      │                        │                        │
      │  governs               │  contributes to        │  drives
      ▼                        ▼                        ▼
  who reviews             quorum evaluation        lifecycle transition
  how many                  per policy               InReview →
  what quorum                                      Approved / Rejected
```

---

### B.2 ApprovalStatus

ApprovalStatus is a **value type embedded on the governed entity**, not a standalone record.

It is never set directly by a user action. It is the computed output of the approval process, written by the domain when quorum is resolved.

In the context of the Approval Model, `ApprovalStatus` has two relevant states:
- `InReview` — the entity is under active review; ApprovalDecisions are being collected.
- `Approved` / `Rejected` — the quorum outcome has been applied by the lifecycle model.

All other states (`Draft`, `Released`, `Deprecated`) are lifecycle states that the approval model has no involvement in producing.

---

### B.3 ApprovalDecision

A single reviewer's recorded judgment. Immutable after submission.

**Identity:**
- `id` — stable, globally unique
- `organizationId` — tenant reference (immutable)
- `entityId` + `entityType` — the entity under review
- `versionId` — the specific Version being reviewed (immutable once set)

**Decision:**
- `outcome` — `Approved | Rejected | Abstained`
- `reviewerId` — UserRole identity of the reviewer
- `reviewedAt` — UTC timestamp
- `rationale` — mandatory; minimum meaningful text; never empty string
- `conditions` — optional: structured list of concerns for final approval
- `supersededBy` — reference to a later decision by the same reviewer (pre-quorum only)

**Status:**
- `Pending` — assigned but not yet submitted
- `Submitted` — recorded and immutable
- `Superseded` — replaced by a revised decision from the same reviewer before quorum

**Invariants:**
- A `Submitted` decision is immutable in all fields.
- One active (non-Superseded) decision per reviewer per `{ entityId, versionId }`.
- A reviewer may revise (Supersede) their decision only while: review is still `InReview` AND quorum has not yet been reached.
- After quorum is reached, no further decisions can be submitted or superseded.
- A decision whose `versionId` no longer matches the entity's `currentVersionId` is invalid and excluded from quorum.
- `Abstained` counts toward participation but not toward approval or rejection quorum.

---

### B.4 ApprovalPolicy

Organization-defined rules that govern how the approval process resolves.

**Identity:**
- `id` — stable
- `organizationId` — tenant reference (immutable)

**Scope:**
- `appliesTo` — `Algorithm | Medication | Protocol | Guideline | ContentPackage | All`
- `scopeLevel` — `Organization | Region | Station`
- `scopeTargetId` — optional Region or Station id for narrower policies
- `priority` — integer; higher value wins when multiple policies match

**Reviewer Configuration:**
- `eligibleRoles` — list of `roleType` values permitted to submit a decision
- `minimumReviewers` — minimum distinct reviewers before quorum can be evaluated; floor is 1, never 0
- `quorumType` — see B.5 below
- `requireSeparationOfDuty` — always `true` for ContentPackage; `true` for all clinical content in Phase 0

**Non-negotiable fields (Phase 0):**
- `allowSelfReview` — fixed `false`; cannot be overridden
- `requireRationale` — fixed `true`; decisions without rationale are rejected at submission

**Timeout:**
- `reviewWindowDays` — advisory overdue signal; does not auto-resolve the review
- `escalationPolicy` — `None | NotifyOrgAdmin`; timeout triggers notification only, never a state change

**Policy resolution when multiple policies match:**
The policy with the highest `priority` applies. Ties broken by specificity: `Station > Region > Organization`.

**Policy freezing:**
The policy governing a review is resolved and frozen at the moment the entity enters `InReview`. Policy changes after submission do not affect in-progress reviews.

---

### B.5 Quorum Types

| Type           | Resolves Approved when                                          | Resolves Rejected when                               | Notes                                         |
|----------------|-----------------------------------------------------------------|------------------------------------------------------|-----------------------------------------------|
| `Unanimous`    | All submitted decisions are `Approved` AND min reviewers met   | Any `Rejected` decision submitted                    | Default for clinical content (Alg, Med, Proto) |
| `Majority`     | `Approved` count > `Rejected` count AND min reviewers met      | `Rejected` ≥ `Approved` AND min reviewers met (ties → Rejected) | Default for Guideline         |
| `SingleApprove`| Any one `Approved` from eligible reviewer                      | Only when all eligible reviewers submit `Rejected`   | Low-risk advisory Guideline variants only      |
| `SingleReject` | Only when all eligible reviewers submit `Approved`             | Any one `Rejected` from eligible reviewer immediately | Safety-critical content; veto model          |

**Universal quorum rules:**
- Quorum is evaluated after every `Submitted` decision.
- Only `Submitted` decisions count. `Pending` and `Superseded` are excluded.
- `Abstained` decisions count toward minimum reviewer participation but not toward approve/reject thresholds.
- Quorum resolution is atomic — concurrent decision submissions that simultaneously complete quorum produce exactly one outcome.
- Once quorum is reached, the lifecycle model executes the transition and writes the audit record. No further decisions are accepted.

---

### B.6 Roles and Permission Dependencies

#### Who may do what in the approval process

| Action                                      | Required Capability       | Additional constraint                                         |
|---------------------------------------------|---------------------------|---------------------------------------------------------------|
| Submit entity for review (Draft → InReview) | `content.submit`          | Author or designated delegate within same Organization        |
| Submit ApprovalDecision: Approved           | `content.approve`         | In `eligibleRoles` per policy; ≠ submitter if SoD required    |
| Submit ApprovalDecision: Rejected           | `content.reject`          | In `eligibleRoles` per policy; ≠ submitter if SoD required    |
| Submit ApprovalDecision: Abstained          | `content.review`          | In `eligibleRoles` per policy                                 |
| Revise own decision (pre-quorum)            | `content.approve`         | Own decisions only; before quorum; review still InReview      |
| Recall Approved content                     | `content.recall`          | OrgAdmin or Approver role; creates full audit record          |
| Define or update ApprovalPolicy             | `policy.manage`           | OrgAdmin only; scoped to own Organization                     |
| Release ContentPackage                      | `package.release`         | Separate from approval; Releaser ≠ Package Approver (P-05)    |

**No capability grants self-approval.** The domain rejects any ApprovalDecision where `reviewerId` matches the entity's submission actor when `requireSeparationOfDuty: true`.

**No capability grants automatic approval.** `minimumReviewers` cannot be set to 0. Any policy with `minimumReviewers < 1` is rejected at policy creation.

---

### B.7 No Auto-Approval — Absolute Rule

The following patterns are all prohibited without exception in Phase 0:

| Prohibited pattern                                              | Reason                                                          |
|-----------------------------------------------------------------|-----------------------------------------------------------------|
| Review window expiry → auto-Approved                            | Safety governance cannot lapse due to inactivity               |
| OrgAdmin submits and approves same entity                       | OrgAdmin authority does not replace review governance           |
| `minimumReviewers: 0` in ApprovalPolicy                         | Policy validation rejects this at write time                    |
| System actor submits ApprovalDecision without UserRole identity | No anonymous or programmatic decision is valid                  |
| Bulk approval (one action approves N entities)                  | Each entity review is a discrete governed act                   |
| Package approval implies content approval                       | Content and ContentPackage approvals are fully independent      |
| SurveyInsight influences ApprovalDecision outcome               | SurveyInsight is advisory; it has no path into governance       |

---

### B.8 No Survey-Driven Approval Influence

SurveyInsight records carry `priority` signals (`Low | Medium | High | Critical`) and `insightType` classifications (`ContentDemand | FeatureVote | RegionalDifference | SafetyConcern`).

None of these fields may be read, referenced, or weighted in any approval logic:

- An ApprovalPolicy may not reference SurveyInsight records.
- An ApprovalDecision may not include a SurveyInsight record as justification input.
- A SurveyInsight with `insightType: SafetyConcern` does not automatically trigger review or override quorum.
- Quorum resolution logic is blind to SurveyInsight data.

SurveyInsight informs the authoring backlog and content prioritization. It operates in a completely separate module with no write path into the Governance Module.

---

### B.9 Approval Audit Requirements

Three distinct audit records are produced in the approval process.

#### ApprovalDecision Submission Record

| Field            | Required | Description                                          |
|------------------|----------|------------------------------------------------------|
| `decisionId`     | Yes      | The ApprovalDecision.id                              |
| `entityId`       | Yes      | Entity under review                                  |
| `entityType`     | Yes      | Content type or ContentPackage                       |
| `versionId`      | Yes      | Version being reviewed                               |
| `organizationId` | Yes      | Tenant scope                                         |
| `reviewerId`     | Yes      | UserRole identity                                    |
| `outcome`        | Yes      | `Approved \| Rejected \| Abstained`                  |
| `rationale`      | Yes      | Free-text; never empty                               |
| `submittedAt`    | Yes      | UTC timestamp                                        |
| `policyId`       | Yes      | Governing ApprovalPolicy.id                          |
| `supersedes`     | No       | Prior decision id if this is a revision              |

#### Quorum Resolution Record

Written when the lifecycle model executes the transition driven by quorum outcome.

| Field             | Required | Description                                          |
|-------------------|----------|------------------------------------------------------|
| `entityId`        | Yes      | Resolved entity                                      |
| `versionId`       | Yes      | Version resolved                                     |
| `organizationId`  | Yes      | Tenant scope                                         |
| `resolvedOutcome` | Yes      | `Approved \| Rejected`                               |
| `policyId`        | Yes      | Governing policy                                     |
| `quorumType`      | Yes      | Quorum type applied                                  |
| `decisionIds`     | Yes      | All contributing ApprovalDecision ids                |
| `resolvedAt`      | Yes      | UTC timestamp                                        |

#### ApprovalPolicy Change Record

| Field           | Required | Description                                           |
|-----------------|----------|-------------------------------------------------------|
| `policyId`      | Yes      | Policy affected                                       |
| `organizationId`| Yes      | Tenant scope                                          |
| `actorUserId`   | Yes      | OrgAdmin identity                                     |
| `changeType`    | Yes      | `Created \| Updated \| Deactivated`                   |
| `previousState` | Yes      | Full snapshot before change (null for Created)        |
| `newState`      | Yes      | Full snapshot after change                            |
| `rationale`     | Yes      | Justification for the policy change                   |
| `effectiveAt`   | Yes      | UTC timestamp                                         |

---

### B.10 Phase 0 Default Policies

These are baseline defaults applied when no Organization-level policy has been explicitly declared. Organizations may raise but never lower these baselines.

| Entity type    | `quorumType`   | `minimumReviewers` | `requireSeparationOfDuty` | Notes                              |
|----------------|----------------|--------------------|---------------------------|------------------------------------|
| Algorithm      | `Unanimous`    | 2                  | `true`                    | Clinical safety baseline           |
| Medication     | `Unanimous`    | 2                  | `true`                    | Clinical safety baseline           |
| Protocol       | `Unanimous`    | 2                  | `true`                    | Procedural safety baseline         |
| Guideline      | `Majority`     | 1                  | `true`                    | Lower quorum floor for advisory    |
| ContentPackage | `Unanimous`    | 1                  | `true`                    | Release gate; dedicated authority  |

---

## Part C — Risky Edge Cases

The following edge cases are explicitly named because they are likely to be implemented incorrectly, tested insufficiently, or bypassed under operational pressure.

---

### EC-01 — Content Recalled After Package Approval

**Scenario:** A content entity is recalled (`Approved → InReview`) after the ContentPackage containing it has been approved but before Release.

**Risk:** The package is released with a content item that is no longer in `Approved` state, violating the release precondition.

**Required behavior:** Release precondition check must re-validate all composition entries at the moment of `package.release` execution, not at the time of package approval. Any composition entry not currently `Approved` blocks the release.

---

### EC-02 — Deprecated Content Referenced by In-Progress Package

**Scenario:** A content entity transitions `Released → Deprecated` while a ContentPackage currently in `Draft` or `InReview` includes that entity's version.

**Risk:** A package is assembled with a deprecated content version and proceeds to release.

**Required behavior:** The deprecation event must raise a composition integrity warning against all packages in `Draft` or `InReview` that reference the deprecated entity. Packages are not automatically recalled but must be reviewed before release. Release precondition check at execution time will catch this if the content is no longer `Approved`.

---

### EC-03 — Quorum Race Condition

**Scenario:** Two reviewers submit `Approved` decisions simultaneously. Both submissions independently satisfy quorum. The system processes both and attempts to execute `InReview → Approved` twice.

**Risk:** Duplicate audit records, duplicate version writes, or inconsistent state.

**Required behavior:** Quorum resolution must be atomic. The first submission to complete quorum transitions the state. The second submission, processed concurrently, must either be rejected as arriving after quorum was reached, or must be recorded as a `Submitted` decision with a note that quorum was already resolved before processing it.

---

### EC-04 — Policy Changed Mid-Review

**Scenario:** An OrgAdmin updates an ApprovalPolicy while a content entity is `InReview` under the prior policy version.

**Risk:** The new policy changes quorum type or eligibility. The review is resolved under inconsistent rules.

**Required behavior:** The policy is frozen at the moment the entity enters `InReview`. The `policyId` is recorded in each ApprovalDecision. Policy changes after submission do not affect in-progress reviews. The existing review resolves under the captured policy snapshot.

---

### EC-05 — Reviewer Role Expires Mid-Review

**Scenario:** A reviewer holds `content.approve` and submits an `Approved` decision. Their UserRole expires before quorum is reached.

**Risk:** The decision was submitted legitimately but the reviewer is no longer active.

**Required behavior:** An ApprovalDecision that was `Submitted` while the reviewer held a valid role remains valid. Role expiry does not retroactively invalidate submitted decisions. Role validity is checked at submission time, not at quorum resolution time.

---

### EC-06 — Self-Approval Disguised via Delegation

**Scenario:** User A submits content. User A assigns a delegate role to User B who is a secondary identity or controlled account. User B approves. Effective self-approval.

**Risk:** Separation of duty is technically satisfied but practically violated.

**Required behavior:** The domain cannot fully detect this at the technical level. The `requireSeparationOfDuty` rule checks actor identity, not organizational relationships. This is a governance policy risk, not a domain model failure. It is documented as an operational risk. OrgAdmin role assignment itself requires audit (via `role.assign` capability) to create an accountability trail.

---

### EC-07 — Version Mismatch at Quorum Resolution

**Scenario:** Content is submitted for review at v2. While review is in progress, v2 is recalled and a new v3 is created. Some reviewers submitted decisions against v2; others are now reviewing v3.

**Risk:** Decisions from different versions are mixed into a single quorum evaluation.

**Required behavior:** Each ApprovalDecision records the specific `versionId`. Quorum evaluation only includes decisions where `versionId` matches the entity's current `currentVersionId`. Decisions against a prior version are marked invalid and excluded. If minimum reviewer count cannot be re-met with valid decisions, the review remains open for new decisions against the current version.

---

### EC-08 — Package Release Attempted from Suspended Organization

**Scenario:** An Organization is suspended between package approval and release execution.

**Risk:** A ContentPackage from a suspended tenant is distributed.

**Required behavior:** Release precondition includes Organization status check. If `Organization.status == Suspended`, the `Approved → Released` transition is rejected with a domain error. The ContentPackage remains in `Approved` state and can be released when the Organization is restored to `Active`.

---

### EC-09 — Rollback to an Outdated Approved Version

**Scenario:** ContentPackage v1 was released. v2 replaced it. v1 is still in `Approved` state and is used as a rollback target. However, content items in v1 now include Deprecated content versions.

**Risk:** A rollback restores a package that references deprecated content, violating composition integrity.

**Required behavior:** Rollback release execution must run the same composition validation as a new release. If any content version in the rollback target package is now `Deprecated` or `Rejected`, the rollback is blocked. A remediated package version must be assembled.

---

### EC-10 — Abstain Causes Review to Hang Indefinitely

**Scenario:** Policy requires `minimumReviewers: 2`. One reviewer approves; one reviewer abstains. No second eligible reviewer submits a non-abstain decision. Review stays open.

**Risk:** Content is permanently blocked in `InReview` with no auto-resolution path.

**Required behavior:** This is an operational outcome, not a domain error. The review window triggers a notification via `escalationPolicy: NotifyOrgAdmin`. The OrgAdmin may assign additional eligible reviewers or, with `content.recall`, withdraw the submission for revision. No automatic resolution occurs. The domain does not break; operational process resolves the deadlock.

---

### EC-11 — SurveyInsight with SafetyConcern Treated as Governance Signal

**Scenario:** A SurveyInsight record with `insightType: SafetyConcern` and `priority: Critical` is submitted against an Algorithm currently in `Draft`. An implementer interprets this as a trigger for mandatory review escalation.

**Risk:** A SurveyInsight drives a governance transition, violating the advisory-only constraint.

**Required behavior:** SurveyInsight has no path into the Governance or Content Lifecycle modules. The Survey Insight module has no write access to ApprovalPolicy or ApprovalDecision records. The signal is visible to OrgAdmins for backlog prioritization. Acting on it is a human decision, not a system-triggered transition. Any implementation that reads SurveyInsight records to modify ApprovalStatus or trigger reviews is incorrect.

---

### EC-12 — Released Package Targeted at Decommissioned Station

**Scenario:** A ContentPackage is released targeting Station X. Station X is subsequently decommissioned. The release record still exists pointing to a now-decommissioned Station.

**Risk:** Confusion about active distribution scope; distribution to decommissioned unit.

**Required behavior:** Decommissioning a Station does not invalidate existing Released packages that reference it. The Release record is preserved for audit purposes. Distribution policy (operational concern, not domain concern) determines whether active distribution to that Station continues. In the domain model, the Released record remains immutable. Future releases targeting a Decommissioned Station are blocked by the release precondition (target scope must be `Active`).

---

## Part D — Consolidated Separation Rule

The following statement is the single enforceable boundary between the Lifecycle Module and the Governance/Approval Module.

**The Lifecycle Module owns `ApprovalStatus` and executes transitions. The Approval Module owns the process that produces an outcome. The Approval Module never writes `ApprovalStatus` directly. The Lifecycle Module never evaluates quorum logic directly.**

Concretely:

| Owned by Lifecycle Module            | Owned by Approval Module                  |
|--------------------------------------|-------------------------------------------|
| `ApprovalStatus` field on entity     | `ApprovalDecision` records                |
| Allowed/prohibited transition rules  | `ApprovalPolicy` definitions              |
| Audit record for each transition     | Quorum evaluation logic                   |
| Release precondition checks          | Reviewer eligibility checks               |
| Deprecation rules                    | Separation-of-duty enforcement            |
| Version creation rules               | Decision revision and supersession logic  |

The handoff point is the quorum resolution event: the Approval Module resolves quorum and communicates `outcome: Approved | Rejected`. The Lifecycle Module receives this outcome, validates the transition is permitted, executes it, and writes the lifecycle audit record.

These two modules may communicate through a defined interface only. Neither may directly read the other's internal state.
