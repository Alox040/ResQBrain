# Tenant Model — ResQBrain Phase 0

**Version:** 1.0
**Date:** 2026-03-25
**Status:** Canonical Architecture Reference
**Source:** `domain-entity-blueprint.md`, `multi-tenant-model.md`, `content-lifecycle-model.md`, `approval-model.md`

---

## Purpose

This document defines the complete multi-tenancy architecture for ResQBrain Phase 0.

It is separated from the Domain Entity Blueprint because tenancy is a cross-cutting concern that must be verified independently of entity structure. Every entity definition, every query, every command, and every permission evaluation must be consistent with the rules defined here.

---

## Part I — Tenant Model Blueprint

---

### 1.1 Primary Tenant Boundary

**Organization is the sole primary tenant boundary.**

This means:

- Organization is the unit of data ownership.
- Organization is the unit of permission scope.
- Organization is the unit of release scope.
- Organization is the unit of audit partitioning.
- Organization is the unit of content governance.

There is no higher-level shared tenant. There is no concept of a platform-level tenant that owns content across Organizations. Platform infrastructure is separate from platform tenancy.

```
Platform (infrastructure)
  └── Organization A  (tenant)
        ├── Region, County, Station  (sub-scopes, no tenant authority)
        ├── Content  (owned, governed, released)
        └── Users / Roles / Permissions  (scoped governance)
  └── Organization B  (tenant, fully isolated)
  └── Organization C  (tenant, fully isolated)
```

---

### 1.2 Sub-Scope Hierarchy

Region, County, and Station are **not tenants**. They are operational sub-scopes within an Organization.

```
Organization  (tenant boundary — owns everything below)
  └── Region  (sub-scope — applicability, targeting)
        └── County  (sub-scope — geographic refinement)
              └── Station  (sub-scope — operational unit, release target)
  └── County  (can exist without Region parent)
  └── Station  (can exist without Region or County parent)
```

**Sub-scope authority rules:**

| Sub-Scope | Can own content?    | Can grant permissions? | Is a tenant? | Has data isolation? |
|-----------|---------------------|------------------------|--------------|---------------------|
| Region    | No                  | No                     | No           | No                  |
| County    | No                  | No                     | No           | No                  |
| Station   | No (release target) | No (scopes UserRole)   | No           | No                  |

Sub-scopes exist to narrow **applicability** and **release targeting** within an Organization. They carry no independent authority and cannot be used to circumvent Organization-level governance.

---

### 1.3 Organization Status and Tenant Capabilities

| Org Status        | Can author content | Can release | Can grant roles | Data accessibility    |
|-------------------|--------------------|-------------|-----------------|----------------------|
| `Active`          | Yes                | Yes         | Yes             | Full read/write       |
| `Suspended`       | No                 | No          | No              | Read-only             |
| `Decommissioned`  | No                 | No          | No              | Read-only (audit)     |

A Suspended or Decommissioned Organization's data is preserved. It is never deleted. No new writes — including version creation, package assembly, or role assignments — are permitted.

---

### 1.4 Scope Hierarchy for All 13 Entities

#### Tier 1 — Tenant Boundary Entity

| Entity       | organizationId | Sub-scope fields      | Scope role                          |
|--------------|----------------|-----------------------|-------------------------------------|
| Organization | Self (is root) | —                     | Defines the tenant. Never a child.  |

#### Tier 2 — Sub-Scope Entities (within Organization)

| Entity  | organizationId | Sub-scope fields           | Scope role                               |
|---------|----------------|----------------------------|------------------------------------------|
| Region  | Required       | —                          | Applicability and release targeting      |
| County  | Required       | `regionId` (optional)      | Geographic refinement within Region/Org  |
| Station | Required       | `regionId`, `countyId` (optional) | Release target; UserRole scope anchor |

#### Tier 3 — Content Entities (owned by Organization)

| Entity          | organizationId | Sub-scope fields              | Scope role                                    |
|-----------------|----------------|-------------------------------|-----------------------------------------------|
| Algorithm       | Required       | `applicabilityScope` (optional) | Authored and owned by Org; released via Pkg |
| Medication      | Required       | `formularyScope` (optional)   | Same                                          |
| Protocol        | Required       | `applicabilityScope` (optional) | Same                                        |
| Guideline       | Required       | `applicabilityScope` (optional) | Same                                        |
| ContentPackage  | Required       | `targetScope` (Org/Region/County/Station) | Release unit; scoped to one target |

#### Tier 4 — Versioning and Governance Entities

| Entity        | organizationId | Sub-scope fields               | Scope role                                      |
|---------------|----------------|--------------------------------|-------------------------------------------------|
| Version       | Required       | `entityId` (parent entity)     | Snapshot tied to parent's Org scope             |
| UserRole      | Required       | `scopeLevel` + `scopeTargetId` | Permission carrier; optionally narrowed to Region/Station |
| Permission    | Required       | `entityScope` (entity type)    | Atomic capability within Org context            |

#### Tier 5 — Advisory Entity

| Entity        | organizationId | Sub-scope fields                             | Scope role                           |
|---------------|----------------|----------------------------------------------|--------------------------------------|
| SurveyInsight | Required       | `targetRegionId`, `targetStationId` (optional) | Advisory signal within Org boundary |

---

## Part II — Scope Matrix per Entity

The matrix defines for each entity: what scope anchors it carries, what it may reference, and what it may never reference.

---

### Organization

| Property                     | Value                                                     |
|------------------------------|-----------------------------------------------------------|
| Scope anchor                 | Self — `id` is the tenant root                            |
| May reference                | Nothing outside itself                                    |
| May be referenced by         | All other entities via `organizationId`                   |
| Cross-tenant reference       | Never references another Organization                     |
| Query requirement            | No `organizationId` filter needed — IS the root           |
| Command requirement          | Admin-level operations only; no Org-owned data without context |

---

### Region

| Property                     | Value                                                     |
|------------------------------|-----------------------------------------------------------|
| Scope anchor                 | `organizationId` (required, immutable)                    |
| May reference                | Its own `Organization` only                               |
| May be referenced by         | County, Station, ContentPackage, SurveyInsight            |
| All references must match    | `organizationId` of the referencing entity                |
| Cross-tenant reference       | May not reference Regions from another Organization       |
| Query requirement            | Always filtered by `organizationId`                       |

---

### County

| Property                     | Value                                                     |
|------------------------------|-----------------------------------------------------------|
| Scope anchor                 | `organizationId` (required, immutable)                    |
| May reference                | Its own `Organization`; optionally its own `Region`       |
| `regionId` constraint        | If set, must belong to the same `organizationId`          |
| May be referenced by         | Station, ContentPackage, SurveyInsight                    |
| Cross-tenant reference       | May not reference County or Region from another Organization |
| Query requirement            | Always filtered by `organizationId`                       |

---

### Station

| Property                     | Value                                                     |
|------------------------------|-----------------------------------------------------------|
| Scope anchor                 | `organizationId` (required, immutable)                    |
| May reference                | Its own `Organization`; optionally its own `Region` and `County` |
| `regionId` constraint        | If set, must belong to the same `organizationId`          |
| `countyId` constraint        | If set, must belong to the same `organizationId`          |
| May be referenced by         | UserRole, ContentPackage, SurveyInsight                   |
| Content ownership            | None — Station is a release target only                   |
| Cross-tenant reference       | May not reference Region, County from another Organization |
| Query requirement            | Always filtered by `organizationId`                       |

---

### Algorithm

| Property                     | Value                                                          |
|------------------------------|----------------------------------------------------------------|
| Scope anchor                 | `organizationId` (required, immutable)                        |
| May reference internally     | `Medication` entities within the same `organizationId`        |
| `prerequisites` constraint   | All referenced content must share the same `organizationId`   |
| May be referenced by         | ContentPackage (same Org), Protocol (same Org), SurveyInsight |
| Cross-tenant reference       | May not reference Algorithm or Medication from another Org    |
| Query requirement            | Always filtered by `organizationId`                           |
| Command requirement          | `organizationId` validated on write; all ref targets validated |

---

### Medication

| Property                     | Value                                                          |
|------------------------------|----------------------------------------------------------------|
| Scope anchor                 | `organizationId` (required, immutable)                        |
| May reference internally     | None (leaf content entity)                                    |
| May be referenced by         | Algorithm (same Org), ContentPackage (same Org), SurveyInsight |
| Cross-tenant reference       | May not be referenced from another Org's Algorithm or Package |
| Query requirement            | Always filtered by `organizationId`                           |

---

### Protocol

| Property                     | Value                                                          |
|------------------------------|----------------------------------------------------------------|
| Scope anchor                 | `organizationId` (required, immutable)                        |
| May reference internally     | `Algorithm` and `Medication` within the same `organizationId` |
| `applicabilityScope` constraint | Any Region or Station reference must be in the same Org   |
| May be referenced by         | ContentPackage (same Org), Guideline (same Org), SurveyInsight |
| Cross-tenant reference       | May not reference Algorithms, Medications from another Org    |
| Query requirement            | Always filtered by `organizationId`                           |

---

### Guideline

| Property                     | Value                                                          |
|------------------------------|----------------------------------------------------------------|
| Scope anchor                 | `organizationId` (required, immutable)                        |
| May reference internally     | `Protocol` within the same `organizationId`                   |
| `applicabilityScope` constraint | Any Region or Station reference must be in the same Org   |
| May be referenced by         | ContentPackage (same Org), SurveyInsight                      |
| Cross-tenant reference       | May not reference Protocol from another Org                   |
| Query requirement            | Always filtered by `organizationId`                           |

---

### ContentPackage

| Property                     | Value                                                          |
|------------------------------|----------------------------------------------------------------|
| Scope anchor                 | `organizationId` (required, immutable)                        |
| Composition constraint       | All `{ entityId, versionId }` entries must share the same `organizationId` |
| `targetScope` constraint     | If Region/County/Station target, must belong to the same `organizationId` |
| May reference                | Version records of content entities within the same Org       |
| May be referenced by         | Release records (same Org)                                    |
| Cross-tenant reference       | May not include content from another Org (Phase 0: no exceptions) |
| Query requirement            | Always filtered by `organizationId`                           |
| Release scope                | The `targetScope` defines distribution boundary — never crosses Org boundary |

---

### Version

| Property                     | Value                                                          |
|------------------------------|----------------------------------------------------------------|
| Scope anchor                 | `organizationId` (required, immutable) — inherited from parent entity |
| `entityId` constraint        | Must reference an entity with the same `organizationId`       |
| `createdBy` constraint       | Must be a UserRole from the same `organizationId`             |
| `predecessorVersionId` constraint | Must reference a Version with the same `organizationId` and `entityId` |
| May be referenced by         | ContentPackage composition entries (same Org only)            |
| Cross-tenant reference       | A Version may not be referenced by an entity in another Org   |
| Immutability                 | Once written, no field is mutable — regardless of scope       |

---

### UserRole

| Property                     | Value                                                          |
|------------------------------|----------------------------------------------------------------|
| Scope anchor                 | `organizationId` (required, immutable)                        |
| `scopeTargetId` constraint   | If set, must reference a Region or Station within the same `organizationId` |
| Permission evaluation        | Always: `userId` + `organizationId` + `capability`            |
| Cross-org inheritance        | Explicitly prohibited — no role grants bleed across Orgs      |
| Expiry behavior              | Expired roles produce no capability grants — treated as absent |
| Query requirement            | Always filtered by `organizationId` when evaluating access    |

---

### Permission

| Property                     | Value                                                          |
|------------------------------|----------------------------------------------------------------|
| Scope anchor                 | `organizationId` (required, immutable)                        |
| Evaluation context           | `userId` + `organizationId` + `capability` + `entityScope`    |
| Cross-tenant grant           | A Permission cannot grant capability on another Org's entities |
| Anonymous capability         | No Permission exists without a UserRole — no anonymous grants  |
| Capability on Released artifacts | No capability permits modification of Released entities   |

---

### SurveyInsight

| Property                     | Value                                                          |
|------------------------------|----------------------------------------------------------------|
| Scope anchor                 | `organizationId` (required, immutable)                        |
| `targetEntityId` constraint  | If set, must reference an entity within the same `organizationId` |
| `targetRegionId` constraint  | If set, must reference a Region within the same `organizationId` |
| `targetStationId` constraint | If set, must reference a Station within the same `organizationId` |
| `submittedBy` constraint     | Must be a UserRole from the same `organizationId`             |
| Governance effect            | None — advisory only; cannot trigger or block any lifecycle transition |
| Cross-tenant reference       | May not reference entities from another Org                   |
| Query requirement            | Always filtered by `organizationId`                           |

---

## Part III — List of Potential Tenant Leaks

A tenant leak is any condition where data, permissions, or behavior from one Organization becomes visible to or executable within another Organization without explicit, policy-declared authorization.

The following are the concrete leak vectors defined for Phase 0, listed by severity.

---

### L-01 — Missing organizationId Filter on Query
**Severity:** Critical
**Description:** A query that retrieves content, roles, or packages without filtering by `organizationId` returns records across all Organizations.
**Trigger:** Any list or search operation that omits the `organizationId` predicate.
**Required control:** Every read operation must carry `organizationId` as a mandatory predicate. No default or "all organizations" query mode exists in Phase 0.

---

### L-02 — Cross-Org Content Reference in ContentPackage
**Severity:** Critical
**Description:** A ContentPackage includes a `{ entityId, versionId }` where the content entity belongs to a different Organization.
**Trigger:** Package assembly that resolves entity IDs without validating `organizationId` match.
**Required control:** Package assembly must validate that every included entity's `organizationId` matches the package's `organizationId` before the record is written.

---

### L-03 — Cross-Org Algorithm → Medication Reference
**Severity:** High
**Description:** An Algorithm's `decisionLogic` or `prerequisites` references a `Medication.id` from another Organization.
**Trigger:** Content authoring that accepts Medication IDs without org-scope validation.
**Required control:** All intra-content references (Algorithm → Medication, Protocol → Algorithm, Protocol → Medication) must be validated against `organizationId` at write time.

---

### L-04 — Cross-Org scopeTargetId in UserRole
**Severity:** High
**Description:** A UserRole's `scopeTargetId` references a Region or Station from a different Organization, expanding or misdirecting permission scope.
**Trigger:** Role assignment that resolves scope targets without org-scope validation.
**Required control:** `scopeTargetId` resolution must verify that the referenced entity's `organizationId` matches the UserRole's `organizationId`.

---

### L-05 — Cross-Org targetScope in ContentPackage
**Severity:** High
**Description:** A ContentPackage's `targetScope` references a Region, County, or Station from a different Organization, causing the release to be distributed to the wrong tenant's operational units.
**Trigger:** Package assembly or release execution that resolves target scope without org-scope validation.
**Required control:** `targetScope` entity resolution must validate `organizationId` match before Release execution.

---

### L-06 — Cross-Org UserRole as Version createdBy
**Severity:** Medium
**Description:** A Version record's `createdBy` references a UserRole from a different Organization.
**Trigger:** Version creation where the acting UserRole is not validated against the entity's `organizationId`.
**Required control:** Version creation must validate that the `createdBy` UserRole belongs to the same `organizationId` as the parent entity.

---

### L-07 — Cross-Org ApprovalDecision Reviewer
**Severity:** Medium
**Description:** A reviewer from Organization B submits an ApprovalDecision on content owned by Organization A.
**Trigger:** Review submission that does not validate reviewer's `organizationId` against the entity under review.
**Required control:** ApprovalDecision submission must verify that the reviewer's UserRole carries the same `organizationId` as the reviewed entity.

---

### L-08 — Cross-Org SurveyInsight Target
**Severity:** Medium
**Description:** A SurveyInsight references a content entity, Region, or Station from another Organization.
**Trigger:** Insight submission that accepts target IDs without org-scope validation.
**Required control:** All optional target fields (`targetEntityId`, `targetRegionId`, `targetStationId`) must be validated against the SurveyInsight's `organizationId`.

---

### L-09 — Version predecessorVersionId Cross-Org
**Severity:** Medium
**Description:** A Version's `predecessorVersionId` references a Version from a different `entityId` or `organizationId`, corrupting lineage.
**Trigger:** Version creation where predecessor resolution does not validate org and entity match.
**Required control:** `predecessorVersionId` must be validated to reference a Version with identical `organizationId` and `entityId`.

---

### L-10 — Permission Evaluation Without organizationId
**Severity:** Critical
**Description:** A permission check evaluates only `userId` + `capability` without including `organizationId`, granting cross-org capabilities.
**Trigger:** Any permission evaluation that omits the tenant context parameter.
**Required control:** Permission evaluation function signature must require `organizationId` as a non-optional parameter. No capability evaluation is valid without it.

---

### L-11 — Audit Record Without organizationId
**Severity:** Low (integrity risk, not a data exposure risk)
**Description:** An audit event is written without `organizationId`, making it unattributable to a tenant and potentially queryable across tenant boundaries.
**Trigger:** Audit log writers that do not enforce `organizationId` as a required field.
**Required control:** Audit event schema must declare `organizationId` as required. Write operations must reject audit events missing it.

---

### L-12 — Shared Content Extension Activated Without Policy Gate
**Severity:** High
**Description:** Cross-org content sharing (future feature) is activated without an explicit, audited policy declaration, silently exposing one Organization's content to another.
**Trigger:** Implementation of content sharing without a policy gate check.
**Required control:** Shared content extension is disabled at domain level in Phase 0. Any code path that would allow cross-org content inclusion must check for an explicit, active `ContentSharingPolicy` record. In Phase 0, no such records exist and the check always fails.

---

## Part IV — Hard Constraints for Implementation

These constraints are non-negotiable. They must be enforced at the domain boundary, not by convention.

---

### HC-01 — organizationId is Mandatory on Every Read

Every query that returns entity records must include `organizationId` as a mandatory filter predicate.

```
// Valid
query(entityType, { organizationId: "org-A", ...otherFilters })

// Invalid — never permitted
query(entityType, { ...otherFilters })   // missing organizationId
query(entityType, {})                    // empty filter
query(entityType)                        // no filter at all
```

No "get all organizations" query pattern exists in Phase 0 for content, roles, versions, or packages. Platform-level administrative reads are a separate, privileged operation class and are not part of the domain layer.

---

### HC-02 — organizationId is Mandatory on Every Write

Every command that creates or modifies an entity must:
1. Receive `organizationId` as an explicit input parameter.
2. Validate that the acting UserRole's `organizationId` matches the target entity's `organizationId`.
3. Write `organizationId` to the record at creation — never derive it from context or session state alone.

```
// Valid
createAlgorithm({ organizationId: "org-A", title: "...", actorRoleId: "role-X" })
// where role-X.organizationId == "org-A"

// Invalid
createAlgorithm({ title: "..." })           // no organizationId
createAlgorithm({ organizationId: null })   // null is rejected
```

---

### HC-03 — All Intra-Entity References Must Be Same-Org

Before any reference between entities is persisted, the domain must validate that both entities share the same `organizationId`.

This applies to:

| Reference                                    | Validation required                                      |
|----------------------------------------------|----------------------------------------------------------|
| Algorithm → Medication (prerequisites)       | `medication.organizationId == algorithm.organizationId`  |
| Protocol → Algorithm, Protocol → Medication  | Same org as Protocol                                     |
| Guideline → Protocol                         | Same org as Guideline                                    |
| ContentPackage → content `{ entityId }`      | Same org as ContentPackage                               |
| ContentPackage → `targetScope` entity        | Same org as ContentPackage                               |
| UserRole → `scopeTargetId` entity            | Same org as UserRole                                     |
| Version → `createdBy` UserRole               | Same org as Version's parent entity                      |
| Version → `predecessorVersionId`             | Same org and same `entityId`                             |
| SurveyInsight → all optional target fields   | Same org as SurveyInsight                                |
| ApprovalDecision → reviewer UserRole         | Same org as the reviewed entity                          |
| Station → `regionId`, `countyId`             | Same org as Station                                      |
| County → `regionId`                          | Same org as County                                       |

---

### HC-04 — Permission Evaluation Requires organizationId

The permission evaluation function must have `organizationId` as a required, non-optional parameter. Any invocation missing `organizationId` must throw a domain error, not return false or default to deny silently.

```
// Required signature (technology-agnostic)
evaluatePermission(userId, organizationId, capability, entityScope) → boolean

// Invalid invocations
evaluatePermission(userId, capability)                  // missing organizationId
evaluatePermission(userId, null, capability)            // null organizationId
evaluatePermission(userId, "*", capability)             // wildcard organizationId
```

---

### HC-05 — Released Artifacts Are Immutable Regardless of Org Context

No operation — even one originating from within the correct Organization — may modify a Released Version, Released ContentPackage, or the composition of a Released Package.

This constraint is enforced independent of tenancy. It cannot be bypassed by OrgAdmin role, by any Permission capability, or by any future shared-content policy.

---

### HC-06 — Sub-Scope Entities Carry No Independent Authority

Region, County, and Station may not be used as authorization boundaries. A UserRole scoped to a Station grants narrowed access within the Organization — it does not create a sub-tenant.

```
// Valid: UserRole scoped to Station narrows access within Org-A
UserRole { organizationId: "org-A", scopeLevel: "Station", scopeTargetId: "station-1" }
// This user can only act on content targeted at station-1, within org-A

// Invalid: treating Station as a tenant boundary
query(entityType, { stationId: "station-1" })  // no organizationId — prohibited
```

---

### HC-07 — Shared Content Extension is Disabled in Phase 0

Any code path that would result in a cross-organization content reference must be guarded by an explicit policy gate check.

```
// Required guard before any cross-org content inclusion
if (!contentSharingPolicyExists(sourceOrgId, targetOrgId, contentId)) {
  throw TenantIsolationViolation("Cross-org content sharing not permitted")
}

// In Phase 0: contentSharingPolicyExists() always returns false.
// This function is a named extension point, not a placeholder to remove.
```

The guard must exist in the codebase in Phase 0 — it just always returns false. This ensures the extension path is explicit, auditable, and not accidentally activated.

---

### HC-08 — Audit Events Must Carry organizationId

Every audit event written by the system must carry `organizationId` as a required field. Audit events without `organizationId` must be rejected at write time, not silently stored.

Audit records are never queryable across Organization boundaries in the normal read path.

---

### HC-09 — No Implicit Tenant Derivation

`organizationId` may never be derived from:
- Session state alone
- User identity lookup alone
- Default value fallback
- Inheritance from parent record without explicit validation

It must always be provided explicitly in the command or query, then validated against the acting UserRole and the target entity.

---

### HC-10 — Rollback Does Not Relax Tenant Constraints

A Release rollback — publishing a new Release pointing to a prior approved ContentPackage version — must pass all of the same tenant validation rules as a new Release. The fact that a Version was previously released does not pre-authorize a rollback without current validation.

---

## Part V — Shared Content Extension (Future, Phase 0 Disabled)

This section defines the rules that will govern cross-organization content sharing when it is enabled in a future phase. These rules are recorded now to prevent incompatible design decisions.

### Current State

- Cross-org content sharing is **disabled** in Phase 0.
- `contentSharingPolicyExists()` always returns `false`.
- No `ContentSharingPolicy` entity exists in Phase 0.

### Future Extension Rules (non-binding in Phase 0)

When enabled, cross-org content sharing must satisfy all of the following:

1. **Explicit policy required.** A `ContentSharingPolicy` record must exist, signed by OrgAdmin of both the source and target Organization.
2. **Read-only at target.** The receiving Organization may include shared content in its ContentPackages but may not edit, approve, or reject it. The source Organization retains authorship and governance.
3. **Version-pinned.** Sharing references a specific `versionId`, not "latest". The target Org must explicitly adopt a new shared version — no automatic updates.
4. **Revocable.** The source Organization may revoke sharing. Revocation does not invalidate already-Released packages that included the shared version.
5. **Audit on both sides.** Sharing, adoption, and revocation events are recorded in the audit log of both Organizations.
6. **No cascading scope.** A target Organization receiving shared content may not share it onward to a third Organization.
7. **organizationId remains source.** The content entity's `organizationId` is never changed. The target Org references it via a composition entry, not by claiming ownership.

### Phase 0 Guard Implementation Note

The `contentSharingPolicyExists()` guard (HC-07) must be implemented as a named function in Phase 0, returning false unconditionally, so that:
- The extension point is explicit in the codebase.
- Future activation requires changing one function, not adding new code paths.
- Accidental activation via missing checks is impossible.
