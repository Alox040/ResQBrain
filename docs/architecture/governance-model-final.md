# Governance Model — Final Reference
## ResQBrain Phase 0

**Version:** 1.0
**Date:** 2026-03-25
**Status:** Canonical — standalone governance and authorization reference
**Sources:** `domain-entity-blueprint.md`, `tenant-model.md`, `approval-model-final.md`,
             `content-lifecycle-final.md`, `version-model-final.md`, `content-package-model-final.md`

---

## Part 1 — Governance Architecture

### 1.1 Core Principle: Policies Decide, Services Orchestrate, Entities Carry No Auth Logic

The governance architecture follows a strict separation of concerns:

```
┌─────────────────────────────────────────────────────────────────────┐
│ ENTITY LAYER                                                        │
│  Algorithm, Medication, Protocol, Guideline,                        │
│  ContentPackage, Version, UserRole, Permission                      │
│  → Carries state. Contains NO authorization logic.                  │
│  → Has NO knowledge of who is allowed to act on it.                 │
└─────────────────────────┬───────────────────────────────────────────┘
                          │ read by
┌─────────────────────────▼───────────────────────────────────────────┐
│ POLICY LAYER                                                        │
│  TransitionAuthorizationPolicy                                      │
│  ReleaseAuthorizationPolicy                                         │
│  DeprecationAuthorizationPolicy                                     │
│  OrganizationScopedAccessPolicy                                     │
│  ApprovalPolicy                                                     │
│  → Receives request context. Returns PolicyDecision.                │
│  → Never mutates state. Never calls services.                       │
│  → Returns: { allowed: bool, denyReason?: DenyReason }             │
└─────────────────────────┬───────────────────────────────────────────┘
                          │ consulted by
┌─────────────────────────▼───────────────────────────────────────────┐
│ SERVICE / ORCHESTRATION LAYER                                       │
│  ContentLifecycleService                                            │
│  PackageAssemblyService                                             │
│  ReleaseService                                                     │
│  ApprovalService                                                    │
│  → Calls Policy layer before executing any operation.               │
│  → Executes only when PolicyDecision.allowed == true.               │
│  → Writes audit record for every decision (allow and deny).         │
└─────────────────────────────────────────────────────────────────────┘
```

### 1.2 PolicyDecision Type

Every policy evaluation returns a `PolicyDecision`. This is the only return type policies produce.

```
PolicyDecision {
  allowed:    bool          // true = proceed; false = deny
  denyReason: DenyReason?   // required when allowed == false
  warnings:   Warning[]     // present when allowed == true but conditions noted
  context:    object        // evaluation inputs captured for audit
}
```

**`allowed: false` is a normal outcome, not an error.** Normal authorization denials are not exceptions. They are first-class values returned through the standard evaluation path. Exceptions are reserved for technical failures (unreachable service, inconsistent data state, audit write failure).

**No implicit allow fallbacks.** If a policy cannot resolve (missing context, unknown roleType, no matching policy), it returns `allowed: false` with `denyReason: POLICY_UNRESOLVABLE`. It never defaults to `allowed: true`.

### 1.3 Policy Evaluation Is Stateless

Policies are stateless evaluators. They read entity state as input but do not mutate it. They do not call other services. They do not write audit records. A policy that produces a result must be deterministic given the same inputs.

### 1.4 No UI or Infrastructure Dependencies

Policies contain no references to HTTP context, session state, UI routes, or database drivers. They operate on domain types only: `UserRole`, `Permission`, `organizationId`, entity state, operation type.

---

## Part 2 — UserRole Model

### 2.1 Structure

| Field           | Type   | Required | Mutable     | Description                                                      |
|-----------------|--------|----------|-------------|------------------------------------------------------------------|
| `id`            | string | Yes      | Never       | Stable identifier                                                |
| `organizationId`| string | Yes      | Never       | Tenant boundary — immutable after assignment                    |
| `userId`        | string | Yes      | Never       | Platform user identity reference                                 |
| `roleType`      | enum   | Yes      | By OrgAdmin | `ContentAuthor \| Reviewer \| Approver \| Releaser \| OrgAdmin \| ReadOnly` |
| `scopeLevel`    | enum   | Yes      | By OrgAdmin | `Organization \| Region \| Station`                              |
| `scopeTargetId` | string | No       | By OrgAdmin | Region or Station id when `scopeLevel != Organization`           |
| `assignedAt`    | UTC    | Yes      | Never       | Assignment timestamp                                             |
| `assignedBy`    | string | Yes      | Never       | UserRole id of the assigning actor                               |
| `expiresAt`     | UTC    | No       | By OrgAdmin | Optional expiry — when past, role is inactive                    |
| `revokedAt`     | UTC    | No       | System      | Set on explicit revocation; takes precedence over `expiresAt`    |

### 2.2 Role Types and Base Capabilities

| roleType        | Base intent                                                                         |
|-----------------|-------------------------------------------------------------------------------------|
| `ContentAuthor` | Creates and edits content in Draft state; submits for review                        |
| `Reviewer`      | Submits ApprovalDecisions (approve, reject, request_changes, abstain)              |
| `Approver`      | Approves content and packages; may also recall Approved entities                    |
| `Releaser`      | Executes package release; cannot approve content or packages                        |
| `OrgAdmin`      | Assigns/revokes roles; manages policies; may recall; does not replace clinical roles|
| `ReadOnly`      | Reads content and packages within Organization scope; no write capabilities         |

**roleType is intent, not a permission grant.** The capability to perform any specific action is granted by `Permission` records associated with the UserRole. Two UserRoles with the same `roleType` may have different Permission sets if an OrgAdmin has customized them. The `roleType` is used as the base for default Permission sets and for `eligibleRoles` matching in `ApprovalPolicy`.

### 2.3 Scope Rules

A UserRole scoped to a Region or Station narrows the user's operational scope within the Organization. It does **not** create a sub-tenant, does not grant cross-organization access, and does not give the Region or Station any governance authority.

```
UserRole { organizationId: "org-A", roleType: "Reviewer", scopeLevel: "Station", scopeTargetId: "stn-3" }
→ This user may review content targeted at Station-3 within Org-A.
→ This user may NOT review content targeted at other Stations or Organization-wide.
→ This user may NOT act in Org-B in any capacity.
```

### 2.4 Multiple Roles Per User

A user may hold multiple UserRoles within the same Organization, provided each has a distinct `{ organizationId, roleType, scopeLevel, scopeTargetId }` combination.

When evaluating permissions for a user with multiple roles, the system takes the **union of capabilities** across all active (non-expired, non-revoked) UserRoles within the relevant `organizationId`. A capability granted by any active role is available to the user.

**Separation of Duty constraints are evaluated at the operation level, not the role level.** See §2.5.

### 2.5 Separation of Duty Definitions

| SoD Rule | Description | Enforced by |
|----------|-------------|-------------|
| `AUTHOR_CANNOT_APPROVE_OWN` | The user who submitted an entity (`content.submit`) may not approve it (`content.approve`) | TransitionAuthorizationPolicy |
| `AUTHOR_CANNOT_REJECT_OWN` | The user who submitted an entity may not reject it (`content.reject`) | TransitionAuthorizationPolicy |
| `AUTHOR_CANNOT_REVIEW_OWN` | The user who submitted an entity may not submit any ApprovalDecision for it | ApprovalPolicy |
| `APPROVER_CANNOT_RELEASE` | The user who approved a ContentPackage may not release it (`package.release`) | ReleaseAuthorizationPolicy |
| `ADMIN_CANNOT_SELF_ASSIGN` | OrgAdmin may not assign a role to themselves (`role.assign` on own userId) | OrganizationScopedAccessPolicy |

These SoD rules are evaluated against the operation's full context — not against the user's roles in isolation. A user with both `Approver` and `Releaser` roles is still blocked from releasing a package they personally approved.

---

## Part 3 — Permission Model

### 3.1 Permission Structure

| Field                   | Type   | Required | Description                                                       |
|-------------------------|--------|----------|-------------------------------------------------------------------|
| `id`                    | string | Yes      | Stable identifier                                                 |
| `organizationId`        | string | Yes      | Tenant scope — immutable                                          |
| `userRoleId`            | string | Yes      | The UserRole this Permission is associated with                   |
| `capability`            | enum   | Yes      | The specific authorized action                                    |
| `entityScope`           | enum   | Yes      | Entity type this capability applies to, or `All`                  |
| `applicabilityConditions`| list  | No       | Conditions that further restrict when capability applies          |

### 3.2 Full Capability Registry (Phase 0)

| Capability                 | Description                                                                |
|----------------------------|----------------------------------------------------------------------------|
| `content.create`           | Create a new content entity in Draft state                                 |
| `content.edit`             | Edit a content entity in Draft state                                       |
| `content.submit`           | Submit content from Draft to InReview                                      |
| `content.review`           | Submit ApprovalDecision (Abstained or RequestChanges)                      |
| `content.approve`          | Submit ApprovalDecision (Approved); approve content from InReview          |
| `content.reject`           | Submit ApprovalDecision (Rejected); reject content from InReview           |
| `content.recall`           | Recall Approved content back to InReview                                   |
| `content.deprecate`        | Deprecate Released content                                                 |
| `package.assemble`         | Create or modify a ContentPackage in Draft state                           |
| `package.submit`           | Submit a ContentPackage from Draft to InReview                             |
| `package.approve`          | Approve a ContentPackage from InReview                                     |
| `package.reject`           | Reject a ContentPackage from InReview                                      |
| `package.recall`           | Recall an Approved ContentPackage to InReview                              |
| `package.release`          | Release an Approved ContentPackage                                         |
| `package.deprecate`        | Deprecate a Released ContentPackage                                        |
| `role.assign`              | Assign or revoke UserRoles within own Organization scope                   |
| `policy.manage`            | Create or update ApprovalPolicy records within own Organization            |
| `surveyinsight.submit`     | Submit a SurveyInsight record                                              |
| `surveyinsight.prioritize` | Act on SurveyInsight prioritization outputs (read and respond)             |

### 3.3 Permission Evaluation Function

Every authorization check calls:

```
evaluatePermission(
  userId:         string,       // required — never null
  organizationId: string,       // required — never null
  capability:     Capability,   // required
  entityId:       string,       // required — the target entity
  entityType:     EntityType    // required
) → PolicyDecision
```

If any parameter is null or missing, the function returns `{ allowed: false, denyReason: MISSING_ORGANIZATION_CONTEXT }` without evaluating further.

### 3.4 Permission Matrix — Default Capability Grants by roleType

`✓` = granted by default | `—` = not granted | `*` = conditional (see notes)

| Capability                 | ContentAuthor | Reviewer | Approver | Releaser | OrgAdmin | ReadOnly |
|----------------------------|:---:|:---:|:---:|:---:|:---:|:---:|
| `content.create`           | ✓   | —   | —   | —   | ✓   | —   |
| `content.edit`             | ✓   | —   | —   | —   | —   | —   |
| `content.submit`           | ✓   | —   | —   | —   | —   | —   |
| `content.review`           | —   | ✓   | ✓   | —   | —   | —   |
| `content.approve`          | —   | —   | ✓   | —   | —   | —   |
| `content.reject`           | —   | —   | ✓   | —   | —   | —   |
| `content.recall`           | —   | —   | ✓   | —   | ✓   | —   |
| `content.deprecate`        | —   | —   | —   | —   | ✓   | —   |
| `package.assemble`         | —   | —   | —   | ✓   | ✓   | —   |
| `package.submit`           | —   | —   | —   | ✓   | ✓   | —   |
| `package.approve`          | —   | —   | ✓   | —   | —   | —   |
| `package.reject`           | —   | —   | ✓   | —   | —   | —   |
| `package.recall`           | —   | —   | —   | —   | ✓   | —   |
| `package.release`          | —   | —   | —   | ✓   | —   | —   |
| `package.deprecate`        | —   | —   | —   | —   | ✓   | —   |
| `role.assign`              | —   | —   | —   | —   | ✓   | —   |
| `policy.manage`            | —   | —   | —   | —   | ✓   | —   |
| `surveyinsight.submit`     | ✓   | ✓   | ✓   | ✓   | ✓   | ✓   |
| `surveyinsight.prioritize` | —   | —   | —   | —   | ✓   | —   |

**Notes:**
- `OrgAdmin` does not hold `package.release` by default. Release requires the `Releaser` role. OrgAdmin governs the organization — they do not replace clinical or operational role authority.
- `content.deprecate` and `package.deprecate` are OrgAdmin capabilities only in Phase 0. Clinical roles do not hold them.
- All capabilities apply only within the actor's `organizationId`.

---

## Part 4 — Policy Catalog

### 4.1 OrganizationScopedAccessPolicy

**Governs:** All read and write access to any entity within the Organization boundary.

**Inputs:**
```
{
  userId:         string
  organizationId: string    // of the target entity
  actorOrgId:     string    // from actor's UserRole
  capability:     Capability
  entityId:       string
  entityType:     EntityType
}
```

**Evaluation logic (in order):**

1. If `organizationId == null` → `{ allowed: false, denyReason: MISSING_ORGANIZATION_CONTEXT }`
2. If `actorOrgId != organizationId` → `{ allowed: false, denyReason: CROSS_TENANT_ACCESS_DENIED }`
3. If no active UserRole exists for `{ userId, actorOrgId }` → `{ allowed: false, denyReason: NO_ACTIVE_ROLE }`
4. If actor holds no Permission with matching `capability` and `entityScope` → `{ allowed: false, denyReason: CAPABILITY_NOT_GRANTED }`
5. If `scopeLevel == Station` and entity's `targetScope` does not include actor's `scopeTargetId` → `{ allowed: false, denyReason: SCOPE_MISMATCH }`
6. → `{ allowed: true }`

**Self-assignment check (for `role.assign`):**
If `capability == role.assign` and `targetUserId == actorUserId` → `{ allowed: false, denyReason: SELF_ASSIGNMENT_PROHIBITED }`

---

### 4.2 TransitionAuthorizationPolicy

**Governs:** Whether a specific lifecycle transition may be executed by a specific actor on a specific entity.

**Inputs:**
```
{
  actorUserId:    string
  actorRoleId:    string
  organizationId: string
  entityId:       string
  entityType:     EntityType
  currentState:   ApprovalStatus
  targetState:    ApprovalStatus
  submittedBy:    string?   // actor who submitted entity to InReview (for SoD check)
}
```

**Evaluation rules per transition:**

#### Draft → InReview (`content.submit`)

| Check | DenyReason if fail |
|-------|--------------------|
| `currentState == Draft` | `INVALID_SOURCE_STATE` |
| Actor has `content.submit` | `CAPABILITY_NOT_GRANTED` |
| `actor.organizationId == entity.organizationId` | `CROSS_TENANT_ACCESS_DENIED` |
| Organization is `Active` | `ORGANIZATION_NOT_ACTIVE` |
| Structural completeness passes for entityType | `CONTENT_STRUCTURALLY_INCOMPLETE` |
| No Deprecated entity in composition | `DEPRECATED_REFERENCE_IN_COMPOSITION` |

#### InReview → Approved (`content.approve`, via quorum)

| Check | DenyReason if fail |
|-------|--------------------|
| `currentState == InReview` | `INVALID_SOURCE_STATE` |
| Actor has `content.approve` | `CAPABILITY_NOT_GRANTED` |
| `actor.organizationId == entity.organizationId` | `CROSS_TENANT_ACCESS_DENIED` |
| `actorUserId != submittedBy` (if SoD required) | `SEPARATION_OF_DUTY_VIOLATION` |
| Quorum resolved to Approved per ApprovalPolicy | `QUORUM_NOT_RESOLVED` |
| Audit record writable | `AUDIT_WRITE_FAILURE` |

#### InReview → Rejected (`content.reject`, via quorum)

| Check | DenyReason if fail |
|-------|--------------------|
| `currentState == InReview` | `INVALID_SOURCE_STATE` |
| Actor has `content.reject` | `CAPABILITY_NOT_GRANTED` |
| `actor.organizationId == entity.organizationId` | `CROSS_TENANT_ACCESS_DENIED` |
| `actorUserId != submittedBy` (if SoD required) | `SEPARATION_OF_DUTY_VIOLATION` |
| Quorum resolved to Rejected per ApprovalPolicy | `QUORUM_NOT_RESOLVED` |
| `rejectionRationale` present | `RATIONALE_REQUIRED` |
| Audit record writable | `AUDIT_WRITE_FAILURE` |

#### Approved → InReview (`content.recall`)

| Check | DenyReason if fail |
|-------|--------------------|
| `currentState == Approved` | `INVALID_SOURCE_STATE` |
| Actor has `content.recall` | `CAPABILITY_NOT_GRANTED` |
| `actor.organizationId == entity.organizationId` | `CROSS_TENANT_ACCESS_DENIED` |
| No Released ContentPackage references `entity.currentVersionId` | `ENTITY_ALREADY_RELEASED` |
| `recallRationale` present | `RATIONALE_REQUIRED` |
| Audit record writable | `AUDIT_WRITE_FAILURE` |

#### Any prohibited transition

| Transition | DenyReason |
|------------|------------|
| Draft → Approved | `TRANSITION_NOT_PERMITTED` |
| Draft → Released | `TRANSITION_NOT_PERMITTED` |
| Draft → Deprecated | `TRANSITION_NOT_PERMITTED` |
| InReview → Draft | `TRANSITION_NOT_PERMITTED` |
| InReview → Released | `TRANSITION_NOT_PERMITTED` |
| Rejected → Any | `TRANSITION_NOT_PERMITTED` (+ `VERSION_TERMINAL`) |
| Released → Draft/InReview/Approved/Rejected | `ENTITY_IMMUTABLE` |
| Deprecated → Any | `TRANSITION_NOT_PERMITTED` (+ `VERSION_TERMINAL`) |

---

### 4.3 ReleaseAuthorizationPolicy

**Governs:** Whether a ContentPackage may be released.

**Inputs:**
```
{
  actorUserId:       string
  actorRoleId:       string
  organizationId:    string
  packageId:         string
  packageVersionId:  string
  approvedBy:        string    // UserRole id that approved this package version
  composition:       list      // [{ entityId, versionId, entityType }]
  targetScope:       object
  applicabilityScopes: list
  dependencyNotes:   list
}
```

**Evaluation rules (all must pass):**

| # | Check | DenyReason if fail |
|---|-------|--------------------|
| 1 | Actor has `package.release` | `CAPABILITY_NOT_GRANTED` |
| 2 | `actor.organizationId == package.organizationId` | `CROSS_TENANT_ACCESS_DENIED` |
| 3 | `actorUserId != approvedBy` (SoD: Approver ≠ Releaser) | `SEPARATION_OF_DUTY_VIOLATION` |
| 4 | Organization is `Active` | `ORGANIZATION_NOT_ACTIVE` |
| 5 | Package `approvalStatus == Approved` | `PACKAGE_NOT_APPROVED` |
| 6 | For each composition entry: `entity.approvalStatus == Approved` | `COMPOSITION_ENTRY_NOT_APPROVED` |
| 7 | For each composition entry: `versionId == entity.currentVersionId` | `COMPOSITION_VERSION_STALE` |
| 8 | For each composition entry: `entity.organizationId == package.organizationId` | `CROSS_TENANT_COMPOSITION_ENTRY` |
| 9 | All scope entries (`targetScope`, `applicabilityScopes`) exist and are `Active` | `TARGET_SCOPE_INACTIVE` |
| 10 | All scope entries belong to same `organizationId` | `CROSS_TENANT_SCOPE_REFERENCE` |
| 11 | No active conflicting Release for same `{ organizationId, targetScope }` | `CONFLICTING_ACTIVE_RELEASE` |
| 12 | No unresolved `HardBlock` dependency | `DEPENDENCY_HARD_BLOCK` |
| 13 | Audit record writable | `AUDIT_WRITE_FAILURE` |

**`Warning`-severity dependencies** do not block release. They are included in `PolicyDecision.warnings` and recorded in the Release audit record.

**Rollback Authorization:** Rollback is authorized by the same `ReleaseAuthorizationPolicy`. Additional checks:

| # | Check | DenyReason if fail |
|---|-------|--------------------|
| 14 | `rollbackSourceVersionId` exists | `ROLLBACK_SOURCE_NOT_FOUND` |
| 15 | All composition entries in rollback source are non-Deprecated | `DEPRECATED_REFERENCE_IN_COMPOSITION` |

---

### 4.4 DeprecationAuthorizationPolicy

**Governs:** Whether a content entity or ContentPackage may be deprecated.

**Inputs:**
```
{
  actorUserId:       string
  organizationId:    string
  entityId:          string
  entityType:        EntityType
  currentState:      ApprovalStatus
  deprecationDate:   date
  deprecationReason: string
}
```

**Evaluation rules:**

| # | Check | DenyReason if fail |
|---|-------|--------------------|
| 1 | `currentState == Released` | `INVALID_SOURCE_STATE` |
| 2 | Actor has `content.deprecate` (or `package.deprecate`) | `CAPABILITY_NOT_GRANTED` |
| 3 | `actor.organizationId == entity.organizationId` | `CROSS_TENANT_ACCESS_DENIED` |
| 4 | `deprecationDate` is present | `DEPRECATION_DATE_REQUIRED` |
| 5 | `deprecationReason` is substantive (not empty, not placeholder) | `RATIONALE_REQUIRED` |
| 6 | Audit record writable | `AUDIT_WRITE_FAILURE` |

**Non-cascading:** Approving deprecation of a content entity does not cascade to packages. Approving deprecation of a package does not cascade to content. Each deprecation is a separate, explicit governance act.

**Warning generated** (does not block deprecation):
- If other non-Deprecated content entities reference this entity → `Warning: REFERENCED_BY_ACTIVE_CONTENT`
- If an active (non-Deprecated) ContentPackage includes this entity's version → `Warning: REFERENCED_BY_ACTIVE_PACKAGE`

These warnings are included in `PolicyDecision.warnings` and the deprecation audit record.

---

### 4.5 ApprovalPolicy

Defined in full in `approval-model-final.md`. Role in the governance architecture:

- Governs the `InReview → Approved` and `InReview → Rejected` transition gates specifically.
- Is consulted by `TransitionAuthorizationPolicy` for those two transitions.
- `TransitionAuthorizationPolicy` defers quorum evaluation to `ApprovalPolicy`.
- `ApprovalPolicy` never directly writes `ApprovalStatus`.
- `ApprovalPolicy` is Organization-defined and frozen at the moment an entity enters `InReview`.

---

## Part 5 — Access Model

### 5.1 Read Access

Read access to any entity always requires:

```
OrganizationScopedAccessPolicy.evaluate({
  userId, organizationId: entity.organizationId, actorOrgId: actor.organizationId,
  capability: content.read (implied), entityId, entityType
})
```

- `ReadOnly` roleType grants read access to all content and package records within the Organization.
- All other roles implicitly have read access to entities within their Organization and scope.
- **Cross-organization read is denied by default.** No read capability grants access to another Organization's records.

### 5.2 Write Access

Every write operation (create, edit, submit, approve, release, deprecate) goes through both:
1. `OrganizationScopedAccessPolicy` — tenant and capability check
2. The specific policy for the operation type — pre-conditions and SoD

Both must return `allowed: true` before the operation executes.

### 5.3 Content Access vs Package Access vs Approval Access vs Release Access

| Domain area       | Controlled by                         | Primary capability |
|-------------------|---------------------------------------|--------------------|
| Content authoring | OrganizationScopedAccessPolicy        | `content.create`, `content.edit` |
| Content lifecycle | TransitionAuthorizationPolicy         | `content.submit`, `content.approve`, etc. |
| Package assembly  | OrganizationScopedAccessPolicy        | `package.assemble`, `package.submit` |
| Package lifecycle | TransitionAuthorizationPolicy         | `package.approve`, `package.reject`, etc. |
| Approval decisions| ApprovalPolicy (via TransitionAuthorizationPolicy) | `content.approve`, `content.reject` |
| Release execution | ReleaseAuthorizationPolicy            | `package.release` |
| Deprecation       | DeprecationAuthorizationPolicy        | `content.deprecate`, `package.deprecate` |
| Role management   | OrganizationScopedAccessPolicy        | `role.assign` |
| Policy management | OrganizationScopedAccessPolicy        | `policy.manage` |

---

## Part 6 — Standardized DenyReasons

Every denied `PolicyDecision` must include one of the following standardized `denyReason` values. Free-text explanations are not permitted as `denyReason`. Free text belongs in an optional `denyDetail` field.

### Tenant and Context Errors

| DenyReason | Description |
|------------|-------------|
| `MISSING_ORGANIZATION_CONTEXT` | `organizationId` is null or absent in the request |
| `CROSS_TENANT_ACCESS_DENIED` | Actor's `organizationId` does not match target entity's `organizationId` |
| `NO_ACTIVE_ROLE` | No active, non-expired, non-revoked UserRole found for `{ userId, organizationId }` |
| `ORGANIZATION_NOT_ACTIVE` | Organization status is `Suspended` or `Decommissioned` |

### Permission and Capability Errors

| DenyReason | Description |
|------------|-------------|
| `CAPABILITY_NOT_GRANTED` | No active Permission grants the required capability to this actor |
| `SCOPE_MISMATCH` | Actor's `scopeTargetId` does not cover the target entity's scope |
| `SEPARATION_OF_DUTY_VIOLATION` | Actor is the same user as a prior actor in the same governance chain |
| `SELF_ASSIGNMENT_PROHIBITED` | Actor attempted to assign a role to themselves |
| `POLICY_UNRESOLVABLE` | No matching policy found for the operation; defaults to deny |

### State and Lifecycle Errors

| DenyReason | Description |
|------------|-------------|
| `INVALID_SOURCE_STATE` | Entity is not in the expected state for this transition |
| `TRANSITION_NOT_PERMITTED` | The `fromState → toState` combination is explicitly prohibited |
| `ENTITY_IMMUTABLE` | Entity is in `Released` state; no modifications permitted |
| `VERSION_TERMINAL` | Entity is in `Rejected` or `Deprecated` state; this Version cannot be continued |
| `ENTITY_ALREADY_RELEASED` | Entity is referenced by a Released ContentPackage; recall is blocked |

### Composition and Release Errors

| DenyReason | Description |
|------------|-------------|
| `PACKAGE_NOT_APPROVED` | ContentPackage `approvalStatus != Approved` at release time |
| `COMPOSITION_ENTRY_NOT_APPROVED` | One or more composition entries have `approvalStatus != Approved` |
| `COMPOSITION_VERSION_STALE` | Composition entry `versionId != entity.currentVersionId` |
| `CROSS_TENANT_COMPOSITION_ENTRY` | Composition entry references entity from a different Organization |
| `DEPRECATED_REFERENCE_IN_COMPOSITION` | Composition entry references a Deprecated content entity |
| `TARGET_SCOPE_INACTIVE` | Release target scope entity is not in `Active` status |
| `CROSS_TENANT_SCOPE_REFERENCE` | Scope entity does not belong to the same Organization |
| `CONFLICTING_ACTIVE_RELEASE` | An active Release already exists for the same `{ organizationId, targetScope }` |
| `DEPENDENCY_HARD_BLOCK` | An unresolved `HardBlock` dependency note exists on the package |
| `ROLLBACK_SOURCE_NOT_FOUND` | Rollback target `packageVersionId` does not exist or is inaccessible |

### Validation Errors

| DenyReason | Description |
|------------|-------------|
| `CONTENT_STRUCTURALLY_INCOMPLETE` | Entity fails structural completeness check for its type |
| `DEPRECATED_REFERENCE_IN_SUBMISSION` | Content references a Deprecated entity at submission time |
| `RATIONALE_REQUIRED` | A mandatory rationale or reason field is absent or empty |
| `DEPRECATION_DATE_REQUIRED` | `deprecationDate` is missing on a deprecation request |
| `QUORUM_NOT_RESOLVED` | Policy quorum has not yet resolved to an outcome |

### Technical / Integrity Errors (Exceptions, not normal flow)

| DenyReason | Description |
|------------|-------------|
| `AUDIT_WRITE_FAILURE` | Audit record could not be written; operation aborted |
| `DATA_INTEGRITY_VIOLATION` | Inconsistent internal state detected; operation cannot safely proceed |

---

## Part 7 — Transition Authorization Summary

### Content Entity Transitions

| Transition | Authorized by | Required Capability | SoD Rule |
|------------|---------------|---------------------|-----------|
| Draft → InReview | TransitionAuthorizationPolicy | `content.submit` | — |
| InReview → Approved | TransitionAuthorizationPolicy + ApprovalPolicy | `content.approve` | `AUTHOR_CANNOT_APPROVE_OWN` |
| InReview → Rejected | TransitionAuthorizationPolicy + ApprovalPolicy | `content.reject` | `AUTHOR_CANNOT_REJECT_OWN` |
| Approved → InReview | TransitionAuthorizationPolicy | `content.recall` | — |
| Approved → Released | ReleaseAuthorizationPolicy (via package) | `package.release` | `APPROVER_CANNOT_RELEASE` |
| Released → Deprecated | DeprecationAuthorizationPolicy | `content.deprecate` | — |

### ContentPackage Transitions

| Transition | Authorized by | Required Capability | SoD Rule |
|------------|---------------|---------------------|-----------|
| Draft → InReview | TransitionAuthorizationPolicy | `package.submit` | — |
| InReview → Approved | TransitionAuthorizationPolicy + ApprovalPolicy | `package.approve` | `AUTHOR_CANNOT_APPROVE_OWN` |
| InReview → Rejected | TransitionAuthorizationPolicy + ApprovalPolicy | `package.reject` | `AUTHOR_CANNOT_REJECT_OWN` |
| Approved → InReview | TransitionAuthorizationPolicy | `package.recall` | — |
| Approved → Released | ReleaseAuthorizationPolicy | `package.release` | `APPROVER_CANNOT_RELEASE` |
| Released → Deprecated | DeprecationAuthorizationPolicy | `package.deprecate` | — |

**Lifecycle and Approval remain separated:** `TransitionAuthorizationPolicy` determines if the transition is structurally valid and the actor is authorized. `ApprovalPolicy` determines if the required human quorum has been achieved. Both must resolve before the lifecycle transition executes.

---

## Part 8 — Survey Governance Boundary

SurveyInsight is **advisory-only**. It has no path into any policy evaluation.

The following are hard prohibitions:

| Prohibited action | Explanation |
|-------------------|-------------|
| `ApprovalPolicy` reads SurveyInsight records | Policies are blind to survey data |
| SurveyInsight triggers a lifecycle transition | No event from Survey module may invoke any Policy |
| SurveyInsight with `SafetyConcern` auto-blocks content | Safety governance requires human actor with capability |
| SurveyInsight `priority: Critical` raises approval quorum | Policy fields are configured by OrgAdmin, not by survey signals |
| SurveyInsight overrides `denyReason` | Survey data does not appear in PolicyDecision outputs |
| Any Policy references `surveyinsight.*` data fields | Module isolation: Policy layer has no import from Survey module |

**The Survey Insight module may read governance state** (e.g., to show which content is under review). It may not write to it.

---

## Part 9 — Audit Requirements

### 9.1 Policy Decision Audit Record

Every policy evaluation produces an audit record, regardless of outcome (`allowed: true` or `false`).

| Field             | Required | Description                                                       |
|-------------------|----------|-------------------------------------------------------------------|
| `id`              | Yes      | Unique audit event id                                             |
| `policyType`      | Yes      | Which policy was evaluated (`TransitionAuthorization`, etc.)       |
| `actorUserId`     | Yes      | User identity                                                     |
| `actorRoleId`     | Yes      | Active UserRole used for evaluation                               |
| `organizationId`  | Yes      | Tenant scope — never null                                         |
| `targetEntityId`  | Yes      | Entity the operation targeted                                     |
| `targetEntityType`| Yes      | Entity type                                                       |
| `capability`      | Yes      | Capability evaluated                                              |
| `operation`       | Yes      | Named operation attempted                                         |
| `decision`        | Yes      | `allowed: true` or `allowed: false`                               |
| `denyReason`      | Cond.    | Required when `decision == false`                                 |
| `warnings`        | No       | Any warnings produced by the policy (even when allowed)           |
| `timestamp`       | Yes      | UTC                                                               |
| `evaluationInputs`| Yes      | Snapshot of all inputs provided to the policy                     |

### 9.2 Role Assignment Audit Record

| Field             | Required | Description                                                       |
|-------------------|----------|-------------------------------------------------------------------|
| `actorUserId`     | Yes      | The OrgAdmin executing the assignment                             |
| `actorRoleId`     | Yes      | The OrgAdmin's UserRole id                                        |
| `organizationId`  | Yes      | Tenant scope                                                      |
| `targetUserId`    | Yes      | User receiving or losing the role                                 |
| `operation`       | Yes      | `Assign \| Revoke`                                                |
| `roleType`        | Yes      | The roleType assigned or revoked                                  |
| `scopeLevel`      | Yes      | Scope level of the role                                           |
| `scopeTargetId`   | No       | Scope target if narrowed below Organization                       |
| `rationale`       | Yes      | Reason for the assignment or revocation                           |
| `timestamp`       | Yes      | UTC                                                               |

### 9.3 Audit Invariants

- All audit records are append-only and immutable after write.
- `organizationId` is required on all records. Missing `organizationId` → audit write rejected.
- A policy evaluation that cannot produce a complete audit record must not proceed (`AUDIT_WRITE_FAILURE`).
- Audit records are Organization-scoped and never cross-queryable between tenants.
- Denied operations are audited with the same completeness as approved operations.

---

## Part 10 — Edge Cases

---

### EC-01 — Role Changed During Active Review

**Scenario:** Reviewer-A submits an `Approved` decision. Before quorum resolves, their `Reviewer` role is revoked by OrgAdmin.

**Risk:** A decision from a now-unauthorized user contributes to governance.

**Required behavior:** `ApprovalDecision` validity is assessed at submission time. An `ApprovalDecision` that was `Submitted` while the reviewer held a valid role is permanently valid. Role revocation does not retroactively invalidate submitted decisions. The quorum includes the decision. If the role was invalid at submission time (already revoked or expired), the decision is invalid regardless of when quorum resolves.

---

### EC-02 — User Holds Multiple Roles

**Scenario:** User-A holds both `Reviewer` and `Releaser` roles within Org-A. They submit an `Approved` ApprovalDecision on Package-B, which resolves quorum. They then attempt to release Package-B.

**Risk:** SoD rule `APPROVER_CANNOT_RELEASE` — the approver cannot be the releaser.

**Required behavior:** `ReleaseAuthorizationPolicy` checks `actorUserId != approvedBy`. `approvedBy` in the quorum resolution record is User-A. The release attempt by User-A is denied with `SEPARATION_OF_DUTY_VIOLATION`. Holding both roles simultaneously does not bypass SoD — SoD is evaluated at the operation level, not the role level. A different user with `Releaser` capability must execute the release.

---

### EC-03 — Organization Suspended Mid-Operation

**Scenario:** A `package.release` operation is in progress (policy evaluation passed). Between evaluation and execution, the Organization is suspended.

**Risk:** Release executes for a suspended tenant.

**Required behavior:** Organization status is re-validated at execution time, not just at policy evaluation time. The `ReleaseAuthorizationPolicy` check on Organization status happens as part of the execution preconditions. If Organization was suspended between evaluation and execution, the execution fails with `ORGANIZATION_NOT_ACTIVE`. The package remains `Approved`. The audit record captures the failed execution with this reason.

---

### EC-04 — Permission Conflict (Same User, Two Roles, Contradictory Scope)

**Scenario:** User-A holds `Reviewer` scoped to Station-3 and `OrgAdmin` scoped to Organization-wide. They attempt to approve a ContentPackage targeted at all Stations.

**Risk:** Scope conflict — `Reviewer` is narrow, `OrgAdmin` is broad; which applies?

**Required behavior:** Permission evaluation takes the union of capabilities from all active roles. `OrgAdmin` does not grant `content.approve` or `package.approve` by default. `Reviewer` grants `content.review` but not `content.approve`. The approval attempt requires `package.approve` — neither role grants this. The decision is `{ allowed: false, denyReason: CAPABILITY_NOT_GRANTED }`. Scope breadth from one role does not compensate for a missing capability from another.

---

### EC-05 — Release Attempted by OrgAdmin Without Releaser Role

**Scenario:** OrgAdmin-A attempts to execute `package.release` because the usual Releaser is unavailable.

**Risk:** Admin bypasses the operational role boundary for clinical release.

**Required behavior:** `ReleaseAuthorizationPolicy` requires `package.release` capability. OrgAdmin does not hold `package.release` by default (see Permission Matrix §3.4). The release attempt is denied with `CAPABILITY_NOT_GRANTED`. OrgAdmin resolving this situation must assign a `Releaser` role to an appropriate user — not execute the release themselves. This is an intentional design: OrgAdmin governs the Organization, but clinical release authority requires an explicit operational role.

---

### EC-06 — Recall Attempted After Release

**Scenario:** Algorithm-A was co-released as part of ContentPackage v2. A reviewer attempts to recall Algorithm-A (`Approved → InReview`).

**Risk:** Released content recalled, violating immutability.

**Required behavior:** `TransitionAuthorizationPolicy` for `Approved → InReview` checks: no Released ContentPackage references `entity.currentVersionId`. A Released ContentPackage does. The recall is denied with `ENTITY_ALREADY_RELEASED`. Algorithm-A is immutable as part of the release. Correction requires a new Version at Draft.

---

### EC-07 — Deprecation Attempted on Approved (Not Yet Released) Entity

**Scenario:** Algorithm-A is `Approved` but not yet released. An OrgAdmin attempts to deprecate it.

**Risk:** Deprecating content that has never been distributed — semantically ambiguous.

**Required behavior:** `DeprecationAuthorizationPolicy` requires `currentState == Released`. An `Approved` entity is not `Released`. The deprecation is denied with `INVALID_SOURCE_STATE`. To retire an `Approved` entity, the appropriate path is recall (`Approved → InReview`) with rationale, followed by rejection, not deprecation. Deprecation applies only to entities that have been distributed.

---

### EC-08 — Stale Access Context (UserRole Expires Between Request and Evaluation)

**Scenario:** A request arrives with a UserRole that was active at time of request initiation but expired during processing (e.g., `expiresAt` passed during a slow evaluation chain).

**Risk:** Authorization granted on expired credential.

**Required behavior:** `OrganizationScopedAccessPolicy` checks active role status at evaluation time, using current system time against `expiresAt`. If `expiresAt < now` at evaluation time, the role is inactive regardless of when the request was initiated. Denied with `NO_ACTIVE_ROLE`. There is no grace period. Expiration is a hard boundary.

---

### EC-09 — Missing Organization Context on Evaluation

**Scenario:** A service calls a policy without including `organizationId` in the input — e.g., due to a programming error in the orchestration layer.

**Risk:** Policy evaluates without tenant context, potentially granting or denying on incomplete information.

**Required behavior:** Every policy's first check is `organizationId != null`. If `organizationId` is absent, the policy immediately returns `{ allowed: false, denyReason: MISSING_ORGANIZATION_CONTEXT }` without any further evaluation. This is treated as a technical error in the orchestration layer, not a normal authorization denial. The audit record for this event includes the evaluation inputs showing `organizationId: null`, which triggers an integrity alert.

---

### EC-10 — Policy Drift Between Package Version and Current Policy

**Scenario:** ContentPackage was approved under ApprovalPolicy-v1 (e.g., `minimumReviewers: 1`). Before release, the Organization updated ApprovalPolicy to v2 (`minimumReviewers: 2`). The existing approval was obtained under the old policy.

**Risk:** Package is released with an approval that no longer meets current policy standards.

**Required behavior:** The `ApprovalPolicy` governing a review is **frozen at InReview entry** (see `approval-model-final.md` §3). The package's approval was legitimately obtained under the policy active at submission time. Policy changes after submission do not retroactively invalidate that approval. `ReleaseAuthorizationPolicy` checks the package's `approvalStatus == Approved` — not whether the approval conforms to the current policy version. The audit record for the release captures the `policyId` that governed the approval, enabling post-hoc review.

---

## Part 11 — Hard Constraints for Implementation

### HC-G-01 — Entities Carry No Authorization Logic

No domain entity class or record contains methods, fields, or logic that evaluate authorization. The entity is a data carrier. Authorization is always external, always in the Policy layer.

### HC-G-02 — PolicyDecision Is the Only Authorization Return Type

No authorization function may return a boolean directly. All authorization functions return `PolicyDecision { allowed, denyReason?, warnings?, context }`. Callers must read `.allowed` before proceeding.

### HC-G-03 — `allowed: false` Is Never an Exception

Normal authorization denials are `PolicyDecision { allowed: false, denyReason: ... }`. Exceptions (`throw`) are reserved for: audit write failure, unreachable dependencies, data integrity violations. A missing capability is `CAPABILITY_NOT_GRANTED`, not a thrown exception.

### HC-G-04 — No Implicit Allow Fallback

If a policy cannot resolve (no matching policy record, unknown roleType, missing context), it returns `{ allowed: false, denyReason: POLICY_UNRESOLVABLE }`. There is no default-allow path.

### HC-G-05 — organizationId Is the First Check in Every Policy

Before any capability or state check, every policy validates `organizationId != null` and `actor.organizationId == entity.organizationId`. If either fails, evaluation stops immediately with the appropriate `denyReason`.

### HC-G-06 — SoD Is Evaluated at Operation Level, Not Role Level

Separation of Duty constraints compare actor identity against prior actors in the same governance chain. Holding both roles that would individually satisfy both sides of the SoD constraint does not bypass it.

### HC-G-07 — Every Policy Decision Is Audited

Both `allowed: true` and `allowed: false` outcomes are written to the audit log with full evaluation context. A policy evaluation that cannot produce a complete audit record must abort with `AUDIT_WRITE_FAILURE`.

### HC-G-08 — Survey Insight Module Has No Import Into Policy Layer

The Policy layer has zero imports, dependencies, or method calls into the Survey Insight module. The Survey Insight module may read from the Policy layer (read-only access to governance state). The reverse is prohibited.

### HC-G-09 — OrgAdmin Does Not Hold package.release

OrgAdmin's default Permission set does not include `package.release`. This is intentional and must not be changed without an explicit Organization policy record granting it. Even if granted, the `APPROVER_CANNOT_RELEASE` SoD rule still applies.

### HC-G-10 — Re-evaluation at Execution Time

Policy evaluation at request intake and policy evaluation at execution time are two separate calls. A positive evaluation at intake does not authorize execution if state has changed in between. Both evaluations must pass for any write operation to complete.
