# Domain Entity Blueprint — ResQBrain Phase 0

**Version:** 1.0
**Date:** 2026-03-25
**Status:** Canonical Architecture Reference
**Scope:** All Phase 0 domain entities — no implementation, no persistence, no UI

---

## Guiding Constraints

1. Every entity carries an explicit `organizationId` — the tenant boundary is never implicit.
2. No entity encodes UI logic, persistence mechanics, or transport format.
3. Released artifacts are immutable. Change requires a new Version.
4. ApprovalStatus transitions are exclusively policy-controlled by UserRole and Permission.
5. SurveyInsight is advisory only — it cannot alter governance outcomes.

---

## Module Assignment

| Entity          | Module                  |
|-----------------|-------------------------|
| Organization    | Tenant Scope            |
| Region          | Tenant Scope            |
| County          | Tenant Scope            |
| Station         | Tenant Scope            |
| Algorithm       | Content Lifecycle       |
| Medication      | Content Lifecycle       |
| Protocol        | Content Lifecycle       |
| Guideline       | Content Lifecycle       |
| ContentPackage  | Content Lifecycle       |
| Version         | Versioning              |
| ApprovalStatus  | Governance + Versioning |
| UserRole        | Governance              |
| Permission      | Governance              |
| SurveyInsight   | Survey Insight          |

---

## Part I — Tenant Scope Entities

---

### Organization

**Role:** Primary tenant boundary. All data ownership, access control, and release scope is anchored here.

**Identity Fields:**
- `id` — stable, globally unique identifier
- `name` — display name of the organization
- `slug` — normalized short identifier for scoping

**Structural Fields:**
- `status` — `Active | Suspended | Decommissioned`
- `createdAt` — establishment timestamp
- `auditTrail` — record of material changes to the organization entity itself

**Relationships:**
- Has zero or more `Region` entities
- Has zero or more `County` entities (optionally nested under a Region)
- Has zero or more `Station` entities
- Owns all `Algorithm`, `Medication`, `Protocol`, `Guideline`, `ContentPackage` records
- Has one or more `UserRole` assignments

**Invariants:**
- `id` is immutable once established.
- An Organization cannot access or mutate content owned by another Organization unless an explicit cross-tenant sharing policy exists.
- All child entities (Region, County, Station, content) must reference this Organization's `id`.
- A Suspended Organization may not create new Releases.
- A Decommissioned Organization's content records become read-only.

**Lifecycle Reference:**
- The Organization itself does not carry ApprovalStatus.
- Its lifecycle states (`Active`, `Suspended`, `Decommissioned`) are administrative, not governed by the content approval workflow.

**Versioning Reference:**
- Organization metadata changes are captured in `auditTrail`, not via the content Version model.

---

### Region

**Role:** Sub-scope for policy applicability and content targeting within an Organization.

**Identity Fields:**
- `id` — stable identifier, unique within Organization
- `organizationId` — required tenant reference
- `name` — human-readable region label
- `code` — short identifier for operational reference

**Structural Fields:**
- `applicabilityScope` — describes which content types or policies this Region qualifies
- `status` — `Active | Inactive`

**Relationships:**
- Belongs to exactly one `Organization`
- Contains zero or more `County` entities
- Contains zero or more `Station` entities
- Referenced by `ContentPackage` for scoped release targeting
- Referenced by `SurveyInsight` for regional demand signals

**Invariants:**
- `organizationId` is immutable.
- A Region cannot exist without a parent Organization.
- Region boundaries are configuration, not product forks (Principle P-04).
- Deactivating a Region does not invalidate existing Released content that references it.

**Lifecycle Reference:**
- Regions do not participate in the content approval lifecycle.
- Activation/deactivation is an administrative operation.

**Versioning Reference:**
- Region configuration changes are audit-logged but not Version-controlled via the content versioning model.

---

### County

**Role:** Geographic or administrative sub-division of a Region, used for content applicability refinement.

**Identity Fields:**
- `id` — stable identifier, unique within Organization
- `organizationId` — required tenant reference
- `regionId` — optional parent Region reference

**Structural Fields:**
- `name` — county or district name
- `code` — short operational code
- `status` — `Active | Inactive`

**Relationships:**
- Belongs to exactly one `Organization`
- Optionally belongs to one `Region`
- Contains zero or more `Station` entities
- Referenced by `SurveyInsight` for geographic demand signals

**Invariants:**
- `organizationId` is immutable.
- A County without a `regionId` is a direct Organization-level subdivision.
- County does not override Region-level content policy independently — overrides require explicit policy declaration.

**Lifecycle Reference:**
- Administrative status only, no content ApprovalStatus involvement.

**Versioning Reference:**
- Changes are audit-logged, not version-tracked via content versioning model.

---

### Station

**Role:** Operational unit within an Organization, representing a physical or functional EMS post.

**Identity Fields:**
- `id` — stable identifier, unique within Organization
- `organizationId` — required tenant reference

**Structural Fields:**
- `name` — station name
- `code` — short operational identifier
- `regionId` — optional Region reference
- `countyId` — optional County reference
- `status` — `Active | Inactive | Decommissioned`

**Relationships:**
- Belongs to exactly one `Organization`
- Optionally linked to one `Region` and/or one `County`
- `UserRole` assignments may be scoped to Station level
- Referenced by `ContentPackage` release targeting for Station-level distribution

**Invariants:**
- `organizationId` is immutable.
- A Station may reference a Region or County, but those must belong to the same Organization.
- A Decommissioned Station retains historical release associations for audit purposes.
- Station cannot own content — it is a release target, not an authoring scope.

**Lifecycle Reference:**
- Administrative lifecycle only (`Active`, `Inactive`, `Decommissioned`).

**Versioning Reference:**
- Changes are audit-logged; not tracked via content Version model.

---

## Part II — Content Entities

All content entities share the following common structure:

**Common Content Fields (applies to Algorithm, Medication, Protocol, Guideline):**
- `id` — stable, globally unique content identifier (immutable)
- `organizationId` — tenant boundary reference (immutable)
- `title` — human-readable name
- `currentVersionId` — reference to the active `Version` record
- `approvalStatus` — current `ApprovalStatus` state
- `effectiveDate` — date from which this content is operationally valid
- `deprecationDate` — if set, marks content as scheduled for retirement
- `deprecationReason` — required when `deprecationDate` is set
- `auditTrail` — append-only log of: author, reviewer, approver, change rationale, timestamps

**Common Content Invariants:**
- `id` and `organizationId` are immutable once created.
- A content entity may only transition to `Released` via an associated `ContentPackage`.
- Content entities in `Released` state are immutable — corrections require a new `Version`.
- Content may only be included in a `ContentPackage` when its `approvalStatus` is `Approved`.
- Cross-organization content inclusion requires an explicit sharing policy.

---

### Algorithm

**Role:** Structured medical decision pathway, typically step-based or branching.

**Additional Fields:**
- `category` — clinical domain classification (e.g., cardiac, trauma, airway)
- `targetAudience` — intended user role or certification level
- `decisionLogic` — structured representation of steps and decision branches (domain-level, not UI-bound)
- `prerequisites` — references to other content items required before applying this algorithm

**Relationships:**
- Owned by one `Organization`
- Has one or more `Version` records (append-only lineage)
- May be referenced by one or more `ContentPackage` entries
- May reference `Medication` entities as part of its decision logic
- May be a subject of `SurveyInsight` demand signals

**Additional Invariants:**
- `decisionLogic` must be structurally complete — no dangling branches without terminal states.
- An Algorithm referencing a `Medication` that is `Deprecated` must be updated before Release.

**Lifecycle Reference:**
- Follows the content ApprovalStatus lifecycle: `Draft → InReview → Approved → Released → Deprecated`
- `Rejected` is a terminal state from `InReview`; requires a new Version to re-enter review.

**Versioning Reference:**
- Each authoring change that advances from `Draft` creates a new `Version`.
- Released versions are immutable; corrections create a successor `Version`.

---

### Medication

**Role:** Medication reference entity with operational usage context for EMS application.

**Additional Fields:**
- `genericName` — canonical pharmaceutical name
- `brandNames` — known commercial identifiers (non-authoritative list)
- `dosageGuidelines` — structured dosage parameters (route, range, weight-based rules)
- `contraindicationsRef` — reference to contraindication content or rules
- `storageRequirements` — operational storage parameters
- `formularyScope` — indication of applicable formulary categories

**Relationships:**
- Owned by one `Organization`
- Has one or more `Version` records
- May be included in one or more `ContentPackage` entries
- May be referenced by `Algorithm` entities within the same Organization
- May be a subject of `SurveyInsight` demand signals

**Additional Invariants:**
- Dosage guidelines must specify at minimum one route and one dose range.
- A Medication in `Deprecated` state must not be referenced by any non-Deprecated content before Release.
- `formularyScope` must align with the Organization's declared formulary configuration.

**Lifecycle Reference:**
- Follows the content ApprovalStatus lifecycle.
- Deprecation requires an explicit `deprecationReason`; existing Releases referencing the deprecated version remain valid and immutable.

**Versioning Reference:**
- Dosage or contraindication changes require a new `Version`.
- Released versions are immutable.

---

### Protocol

**Role:** Formal procedural standard governing clinical or operational procedure within an Organization.

**Additional Fields:**
- `procedureCategory` — type classification (e.g., assessment, intervention, transport)
- `regulatoryBasis` — reference to the authoritative source or standard this protocol implements
- `applicabilityScope` — target Role, Region, or Station scope (within the Organization)
- `requiredEquipment` — operational prerequisites for protocol execution

**Relationships:**
- Owned by one `Organization`
- Has one or more `Version` records
- May be included in one or more `ContentPackage` entries
- May reference `Algorithm` and `Medication` entities within the same Organization
- May be a subject of `SurveyInsight` demand signals

**Additional Invariants:**
- `regulatoryBasis` is required for all Protocols before entering `InReview`.
- An `applicabilityScope` that references a Region or Station must resolve to entities within the same Organization.
- A Protocol may not enter `Approved` state while any referenced Algorithm or Medication is in `Draft` or `InReview`.

**Lifecycle Reference:**
- Follows the content ApprovalStatus lifecycle.
- Regional variants of a Protocol are separate content records with distinct `id` values, scoped by `applicabilityScope`.

**Versioning Reference:**
- Any change to regulatory basis or required equipment creates a new `Version`.
- Released versions are immutable.

---

### Guideline

**Role:** Operational or medical recommendation content that supplements Protocols but is not a binding procedural mandate.

**Additional Fields:**
- `guidelineCategory` — classification (e.g., clinical recommendation, operational best-practice, safety notice)
- `evidenceBasis` — source reference or evidence quality indicator
- `advisory` — boolean indicating if this guideline is informational-only vs. operationally required
- `applicabilityScope` — target Role, Region, or Station scope

**Relationships:**
- Owned by one `Organization`
- Has one or more `Version` records
- May be included in one or more `ContentPackage` entries
- May reference `Protocol` entities for supplementary context
- May be a subject of `SurveyInsight` demand signals

**Additional Invariants:**
- A Guideline with `advisory: false` follows the same release requirements as a Protocol.
- A Guideline with `advisory: true` may be released without a full review cycle — but still requires a UserRole with explicit Permission to publish.
- `evidenceBasis` must be declared before transitioning out of `Draft`.

**Lifecycle Reference:**
- Follows the content ApprovalStatus lifecycle.
- Advisory guidelines may follow a lighter review path — policy-defined per Organization, not hardcoded.

**Versioning Reference:**
- Any change to `evidenceBasis` or `advisory` classification requires a new `Version`.

---

## Part III — Release Management Entities

---

### ContentPackage

**Role:** Versioned release unit — the atomic bundle of content distributed to Stations or Regions.

**Identity Fields:**
- `id` — stable, globally unique identifier
- `organizationId` — tenant reference (immutable)

**Structural Fields:**
- `title` — descriptive name of this package
- `description` — summary of scope and purpose
- `targetScope` — release target: Organization-wide, Region, County, or Station
- `approvalStatus` — current `ApprovalStatus` of the package itself
- `currentVersionId` — reference to the active package `Version`
- `releaseNotes` — human-readable summary of changes in this release
- `compatibilityNotes` — inter-package or inter-content compatibility declarations
- `auditTrail` — append-only log of assembly decisions and approvals

**Content Composition:**
- `algorithms` — set of `{ algorithmId, versionId }` references
- `medications` — set of `{ medicationId, versionId }` references
- `protocols` — set of `{ protocolId, versionId }` references
- `guidelines` — set of `{ guidelineId, versionId }` references

**Relationships:**
- Belongs to exactly one `Organization`
- References explicit `Version` snapshots of content entities — not floating "latest"
- Targets one `Organization`, `Region`, `County`, or `Station` as release scope
- Has one or more `Version` records of the package itself
- Subject to governance via `ApprovalStatus` and `UserRole`/`Permission`

**Invariants:**
- A ContentPackage may only include content where `approvalStatus == Approved`.
- All included content must belong to the same Organization, unless an explicit cross-org sharing policy exists.
- A Released ContentPackage is fully immutable — composition, target scope, and version references cannot change.
- A ContentPackage must include at least one content item.
- `targetScope` must resolve to entities within the same Organization.
- Two ContentPackages within the same Organization targeting the same scope may not have conflicting Released versions for the same content item — conflict detection is required before Release.

**Lifecycle Reference:**
- Follows the content ApprovalStatus lifecycle: `Draft → InReview → Approved → Released → Deprecated`
- Package approval is independent of individual content approval — both must be satisfied before Release.

**Versioning Reference:**
- Each reassembly or revision creates a new package `Version`.
- A Release record references a specific package `Version`.
- Rollback is implemented by creating a new Release referencing a prior `Approved` package version.

---

### Version

**Role:** Immutable snapshot identifier for a content entity state or ContentPackage state.

**Identity Fields:**
- `id` — stable, unique version identifier
- `entityId` — the `id` of the entity this version belongs to
- `entityType` — `Algorithm | Medication | Protocol | Guideline | ContentPackage`
- `organizationId` — tenant reference (immutable)

**Structural Fields:**
- `versionNumber` — monotonically increasing within an entity's lineage (e.g., `1`, `2`, `3`)
- `createdAt` — timestamp of version creation
- `createdBy` — UserRole reference of the author
- `changeRationale` — required description of what changed and why
- `predecessorVersionId` — reference to the immediately prior version (null for v1)
- `snapshot` — complete state of the entity at this version (structure mirrors the entity)

**Relationships:**
- Belongs to one entity (Algorithm, Medication, Protocol, Guideline, or ContentPackage)
- Belongs to one `Organization`
- Referenced by `ContentPackage` composition entries
- Referenced by Release records

**Invariants:**
- A `Version` record is immutable once created. No field may be modified after write.
- `versionNumber` is append-only within an entity's lineage.
- `changeRationale` is required for all versions after v1.
- A Version may only be marked as part of a Release when the associated entity has `approvalStatus == Approved`.
- Deleting a Version is prohibited if it is referenced by any Released ContentPackage.

**Lifecycle Reference:**
- Versions do not carry ApprovalStatus themselves — the parent entity does.
- A Version becomes "active" when the parent entity's `currentVersionId` is updated to reference it.

**Versioning Reference:**
- Version is the versioning model's primary unit.
- Lineage is fully traceable via `predecessorVersionId` chain.

---

### ApprovalStatus

**Role:** Lifecycle state machine governing content and package promotion. Not an entity — a value type embedded in content and package entities.

**States:**

| State       | Description                                                       |
|-------------|-------------------------------------------------------------------|
| `Draft`     | Initial authoring state. Editable. Not yet submitted for review.  |
| `InReview`  | Submitted. Locked for editing. Awaiting approval decision.        |
| `Approved`  | Cleared for inclusion in a ContentPackage. Not yet distributed.   |
| `Rejected`  | Review outcome: cannot be released. New Version required.         |
| `Released`  | Included in a Released ContentPackage. Fully immutable.           |
| `Deprecated`| Replaced or retired. Historical record retained. Read-only.       |

**Valid Transitions:**

```
Draft       → InReview   (submit for review)
InReview    → Approved   (approval decision)
InReview    → Rejected   (rejection decision)
Rejected    → [terminal; new Version required to re-enter Draft]
Approved    → Released   (via ContentPackage release)
Approved    → Draft      (recall before release — requires Permission)
Released    → Deprecated (retirement — requires Permission)
```

**Invariants:**
- Transitions require a UserRole with a Permission explicitly authorizing the transition type.
- No transition may be performed without recording: who, when, and why.
- `Released → Deprecated` does not affect the immutability of the Released Version snapshot.
- `Rejected` is terminal for that Version — the lineage continues via a new Version at `Draft`.
- Reverse transitions (e.g., `InReview → Draft`) are only permitted via explicit `recall` permission, and only before `Released`.

**Lifecycle Reference:**
- ApprovalStatus is the lifecycle state machine for both content entities and ContentPackage.
- Governed by the Governance Module.

**Versioning Reference:**
- ApprovalStatus state is captured in the `Version` snapshot at each version creation point.

---

## Part IV — Governance Entities

---

### UserRole

**Role:** Role assignment model scoped to Organization (and optionally Region or Station) that grants Permissions to a user.

**Identity Fields:**
- `id` — stable identifier
- `organizationId` — tenant boundary reference (immutable)

**Structural Fields:**
- `userId` — reference to the platform user identity
- `roleType` — `ContentAuthor | Reviewer | Approver | Releaser | OrgAdmin | ReadOnly`
- `scopeLevel` — `Organization | Region | Station`
- `scopeTargetId` — the `id` of the Region or Station if `scopeLevel` is not Organization-wide
- `assignedAt` — timestamp
- `assignedBy` — UserRole reference of the assigning user
- `expiresAt` — optional expiration timestamp

**Relationships:**
- Belongs to one `Organization`
- May be scoped to one `Region` or `Station` within that Organization
- Grants zero or more `Permission` capabilities
- Referenced by `ApprovalStatus` transition records and `Version` authorship

**Invariants:**
- A UserRole is always scoped to an Organization — unscoped roles do not exist.
- `scopeTargetId` must reference an entity within the same Organization.
- A user may hold multiple UserRoles within the same Organization, but each must have a distinct scope combination.
- OrgAdmin may assign or revoke roles within their own Organization only.
- A UserRole does not inherit permissions from another Organization's assignments.
- Expired UserRoles (`expiresAt` past) are treated as inactive — no permission grants.

**Lifecycle Reference:**
- UserRole does not carry ApprovalStatus.
- Active/inactive state is derived from `expiresAt` and explicit revocation.

**Versioning Reference:**
- Role assignments are audit-logged but not tracked via the content Version model.

---

### Permission

**Role:** Atomic capability declaration evaluated per UserRole and Organization context.

**Identity Fields:**
- `id` — stable capability identifier
- `organizationId` — tenant reference (immutable)

**Structural Fields:**
- `capability` — the specific authorized action (see Capability Registry below)
- `entityScope` — the entity type this permission applies to (or `All`)
- `applicabilityConditions` — optional policy conditions (e.g., "only for own-authored content")

**Capability Registry (Phase 0):**

| Capability                    | Description                                          |
|-------------------------------|------------------------------------------------------|
| `content.create`              | Create a new content entity in Draft state           |
| `content.edit`                | Edit a content entity in Draft state                 |
| `content.submit`              | Submit content from Draft to InReview                |
| `content.review`              | Perform review actions on InReview content           |
| `content.approve`             | Approve content from InReview                        |
| `content.reject`              | Reject content from InReview                         |
| `content.recall`              | Recall Approved content back to Draft                |
| `content.deprecate`           | Deprecate Released content                           |
| `package.assemble`            | Create or modify a ContentPackage in Draft state     |
| `package.submit`              | Submit a ContentPackage from Draft to InReview       |
| `package.approve`             | Approve a ContentPackage from InReview               |
| `package.release`             | Release an Approved ContentPackage                   |
| `package.deprecate`           | Deprecate a Released ContentPackage                  |
| `role.assign`                 | Assign or revoke UserRoles within Organization scope |
| `surveyinsight.submit`        | Submit a SurveyInsight signal                        |
| `surveyinsight.prioritize`    | Act on SurveyInsight prioritization outputs          |

**Relationships:**
- Belongs to one `Organization`
- Associated with one or more `UserRole` records

**Invariants:**
- A Permission must be granted via a UserRole — there are no anonymous capabilities.
- Permission evaluation always includes: `userId` + `organizationId` + `capability` + `entityScope`.
- Permission grants do not apply across Organization boundaries.
- No Capability allows modification of a Released artifact.

**Lifecycle Reference:**
- Permission does not carry ApprovalStatus.

**Versioning Reference:**
- Permission grants are audit-logged but not version-tracked via content versioning model.

---

## Part V — Advisory Entity

---

### SurveyInsight

**Role:** Structured prioritization input representing demand signals from users, regions, or stations about content needs and feature priorities.

**Identity Fields:**
- `id` — stable identifier
- `organizationId` — tenant reference (immutable)

**Structural Fields:**
- `submittedBy` — UserRole reference of the submitter
- `submittedAt` — timestamp
- `insightType` — `ContentDemand | FeatureVote | RegionalDifference | SafetyConcern`
- `targetEntityType` — optional: content type this signal relates to (`Algorithm | Medication | Protocol | Guideline`)
- `targetEntityId` — optional: specific content entity `id` this signal relates to
- `targetRegionId` — optional: Region or County this signal originates from
- `targetStationId` — optional: Station this signal originates from
- `priority` — `Low | Medium | High | Critical`
- `description` — human-readable rationale
- `status` — `Pending | Acknowledged | Actioned | Dismissed`
- `resolution` — required when `status == Actioned | Dismissed`

**Relationships:**
- Belongs to one `Organization`
- Optionally references one content entity (Algorithm, Medication, Protocol, or Guideline)
- Optionally references one `Region`, `County`, or `Station` within the same Organization
- Does not directly modify any governed entity

**Invariants:**
- `organizationId` is immutable.
- A SurveyInsight cannot modify, approve, reject, or release any content entity.
- A SurveyInsight with `targetEntityId` set must reference an entity within the same Organization.
- `targetRegionId` and `targetStationId` must resolve to entities within the same Organization.
- Status transitions: `Pending → Acknowledged → Actioned | Dismissed`. Cannot revert to `Pending`.
- Resolution description is mandatory when transitioning to `Actioned` or `Dismissed`.

**Lifecycle Reference:**
- SurveyInsight carries its own lightweight status model (`Pending → Acknowledged → Actioned | Dismissed`).
- It does not participate in the content ApprovalStatus lifecycle.
- It is an advisory input to the content authoring process — influence only, no governance bypass.

**Versioning Reference:**
- SurveyInsight records are append-only. Changes create new records, not mutations of existing ones.
- Not tracked via the content Version model.

---

## Entity Relationship Summary

```
Organization
  ├── has many:  Region
  │     └── has many:  County
  │           └── has many:  Station
  ├── has many:  Station (also directly)
  ├── owns:      Algorithm (1..*)
  ├── owns:      Medication (1..*)
  ├── owns:      Protocol (1..*)
  ├── owns:      Guideline (1..*)
  ├── owns:      ContentPackage (1..*)
  │     ├── composes: { algorithmId, versionId } references
  │     ├── composes: { medicationId, versionId } references
  │     ├── composes: { protocolId, versionId } references
  │     └── composes: { guidelineId, versionId } references
  ├── owns:      UserRole (1..*)
  │     └── grants: Permission (0..*)
  └── owns:      SurveyInsight (0..*)

Algorithm / Medication / Protocol / Guideline
  ├── carries:   ApprovalStatus (embedded state machine)
  └── has many:  Version (append-only lineage)

ContentPackage
  ├── carries:   ApprovalStatus (embedded state machine)
  └── has many:  Version (append-only lineage)

Version
  └── is immutable snapshot of parent entity at a point in time
```

---

## ApprovalStatus Transition Authorization Matrix

| Transition              | Required Capability          | Notes                                 |
|-------------------------|------------------------------|---------------------------------------|
| Draft → InReview        | `content.submit`             | Submitter must be author or delegate  |
| InReview → Approved     | `content.approve`            | Must not be same user as submitter    |
| InReview → Rejected     | `content.reject`             | Must not be same user as submitter    |
| Approved → Released     | `package.release`            | Via ContentPackage release only       |
| Approved → Draft        | `content.recall`             | Only before Release                   |
| Released → Deprecated   | `content.deprecate`          | Does not affect Released snapshots    |
| Package Draft → InReview| `package.submit`             |                                       |
| Package InReview → Approved | `package.approve`        | Requires all content to be Approved   |
| Package Approved → Released | `package.release`        | Creates immutable Release record      |
| Package Released → Deprecated | `package.deprecate`   |                                       |

---

## Cross-Cutting Invariants

1. **Organization Scope:** Every entity record carries `organizationId`. It is set at creation and immutable.
2. **Immutability of Released State:** No Released Version or ContentPackage may be mutated. Any correction requires a new Version record.
3. **Append-Only Version Lineage:** Version records are never deleted or overwritten. Rollback is a forward operation (new Release referencing prior Approved Version).
4. **Audit Completeness:** Every ApprovalStatus transition must record: actor (UserRole), timestamp, and rationale.
5. **No Cross-Tenant Leakage:** Queries, commands, and reads are always filtered by `organizationId`. Cross-Organization access requires explicit, policy-declared sharing.
6. **Advisory Non-Bypass:** SurveyInsight provides demand signals only. It cannot trigger, accelerate, or block any ApprovalStatus transition.
7. **No Dangling References:** ContentPackage composition references must point to existing, resolvable Version records within the same Organization at time of Release.
