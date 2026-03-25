# Implementation Order Blueprint
## ResQBrain Phase 0 — `packages/domain/src/`

**Version:** 1.0
**Date:** 2026-03-25
**Status:** Canonical — verbindliche Implementierungsreihenfolge
**Authority:** `domain-entity-blueprint.md`, `tenant-model.md`, `content-lifecycle-final.md`,
              `approval-model-final.md`, `version-model-final.md`,
              `content-package-model-final.md`, `governance-model-final.md`,
              `domain-validation-matrix.md`, `implementation-guardrails.md`

---

## Präambel

Dieses Dokument legt fest, **in welcher Reihenfolge** `packages/domain/src/` aufgebaut wird.
Die Reihenfolge ist dependency-driven: jede Datei darf nur Typen importieren, die bereits existieren und getestet sind.

**Kernregel:** Kein Service-Code darf existieren, bevor alle Tests für die von ihm abhängigen Entities und Policies grün sind.

---

## Teil 1 — Implementation Order Blueprint

### Schicht-Modell

```
┌────────────────────────────────────────────────────────────┐
│  Layer 0 — shared/                                         │
│  Primitive Typen, Fehlerklassen, PolicyDecision            │
│  Importiert: nichts aus domain/src                         │
└───────────────────────┬────────────────────────────────────┘
                        │
┌───────────────────────▼────────────────────────────────────┐
│  Layer 1 — tenant/                                         │
│  Organization, Region, County, Station                     │
│  Importiert: nur shared/                                   │
└──────────┬────────────────────────────────────────┬────────┘
           │                                        │
┌──────────▼──────────┐              ┌──────────────▼───────┐
│  Layer 2a           │              │  Layer 2b             │
│  governance/entities│              │  versioning/entities  │
│  Importiert:        │              │  Importiert:          │
│  shared/ + tenant/  │              │  shared/ + tenant/    │
└──────────┬──────────┘              └──────────────┬───────┘
           │                                        │
┌──────────▼────────────────────────────────────────▼───────┐
│  Layer 3 — content/entities                                │
│  Algorithm, Medication, Protocol, Guideline,               │
│  ContentPackage (Entity), ApprovalStatus (Value Type)      │
│  Importiert: shared/ + tenant/ + versioning/entities/      │
└───────────────────────┬────────────────────────────────────┘
                        │
┌───────────────────────▼────────────────────────────────────┐
│  Layer 4 — governance/policies                             │
│  Alle 5 Policies + Context-Typen + Capability-Helper       │
│  Importiert: shared/ + tenant/ + governance/entities/      │
│              + versioning/entities/ + content/entities/    │
└───────────────────────┬────────────────────────────────────┘
                        │
┌───────────────────────▼────────────────────────────────────┐
│  Layer 5 — lifecycle/                                      │
│  ContentLifecycleService, PackageAssemblyService,          │
│  ApprovalService, StructuralCompletenessValidator          │
│  Importiert: alle Layer 0–4                                │
└───────────────────────┬────────────────────────────────────┘
                        │
┌───────────────────────▼────────────────────────────────────┐
│  Layer 6 — release/                                        │
│  ReleaseService, RollbackService, ReleaseChecklist         │
│  Importiert: alle Layer 0–5                                │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│  Layer 7 — survey/  (ISOLIERT — kein Upward-Import)        │
│  SurveyInsight, SurveyInsightService                       │
│  Importiert: NUR shared/ + tenant/                         │
└────────────────────────────────────────────────────────────┘
```

---

### Modulreihenfolge (verbindlich)

| Reihenfolge | Modul | Layer | Freigabe-Bedingung |
|-------------|-------|-------|--------------------|
| 1 | `shared/types` | 0 | — (Startpunkt) |
| 2 | `shared/errors` | 0 | shared/types existiert |
| 3 | `shared/audit` | 0 | shared/types + shared/errors existieren |
| 4 | `tenant/entities` | 1 | shared/ vollständig |
| 5 | `tenant/policies` | 1 | tenant/entities vollständig |
| 6 | `governance/entities` | 2a | shared/ + tenant/ vollständig |
| 7 | `versioning/entities` | 2b | shared/ + tenant/ vollständig |
| 8 | `content/entities` | 3 | shared/ + tenant/ + versioning/entities vollständig |
| 9 | `governance/policies` | 4 | Layer 0–3 vollständig + Tests grün |
| 10 | `lifecycle/validators` | 5 | Layer 0–4 vollständig + Tests grün |
| 11 | `lifecycle/services` | 5 | lifecycle/validators vollständig + Tests grün |
| 12 | `release/services` | 6 | Layer 0–5 vollständig + Tests grün |
| 13 | `survey/entities` | 7 | shared/ + tenant/ vollständig |
| 14 | `survey/services` | 7 | survey/entities vollständig |

> **Layer 6 (governance/entities) und Layer 7 (versioning/entities) dürfen parallel implementiert werden** — sie haben keine gegenseitige Abhängigkeit.
> **survey/ (Layer 7) ist vollständig isoliert** und kann nach tenant/ unabhängig implementiert werden.

---

## Teil 2 — Dateireihenfolge innerhalb der Module

### 2.1 `shared/types/` — Layer 0, Schritt 1

Reihenfolge ist strikt: jede Datei hängt von vorherigen ab.

```
shared/
  types/
    1.  OrgId.ts               # Branded type: type OrgId = string & { _brand: 'OrgId' }
    2.  EntityId.ts            # Branded types: AlgorithmId, MedicationId, etc.
    3.  VersionId.ts           # Branded type für alle Version-IDs
    4.  UserId.ts              # Branded type für User-Identity
    5.  RoleId.ts              # Branded type für UserRole-IDs
    6.  DenyReason.ts          # Enum: alle 30 DenyReason-Werte (kanonische Liste)
    7.  PolicyDecision.ts      # Type + allow() + deny() Helper-Funktionen
    8.  index.ts               # Re-export aller shared/types
```

**Warum zuerst:**
`DenyReason` und `PolicyDecision` sind die Rückgabetypen jeder Policy-Funktion in der gesamten Domain. Ohne sie kann kein Policy-Code kompilieren.

---

### 2.2 `shared/errors/` — Layer 0, Schritt 2

```
shared/
  errors/
    1.  DomainError.ts         # Base-Klasse: code, message, context
    2.  DomainDenial.ts        # Value-Type (kein Error): denyReason, organizationId, context
    3.  TenantIsolationViolation.ts  # extends DomainError
    4.  AuditWriteFailure.ts   # extends DomainError
    5.  DataIntegrityViolation.ts    # extends DomainError
    6.  index.ts
```

---

### 2.3 `shared/audit/` — Layer 0, Schritt 3

```
shared/
  audit/
    1.  AuditOperation.ts      # Enum: submit, approve, reject, release, recall, deprecate, assign...
    2.  AuditEvent.ts          # Base-Type: id, organizationId, timestamp, actorUserId, actorRoleId
    3.  LifecycleAuditEvent.ts # extends AuditEvent: entityId, entityType, fromState, toState, rationale
    4.  PolicyDecisionAuditEvent.ts  # extends AuditEvent: capability, decision, denyReason
    5.  VersionCreationAuditEvent.ts # extends AuditEvent: versionId, versionNumber, changeReason
    6.  ReleaseAuditEvent.ts   # extends AuditEvent: releaseVersionId, compositionSnapshot
    7.  index.ts
```

---

### 2.4 `tenant/entities/` — Layer 1, Schritt 4

```
tenant/
  entities/
    1.  OrganizationStatus.ts  # Enum: Active, Suspended, Decommissioned
    2.  ScopeLevel.ts          # Enum: Organization, Region, County, Station
    3.  SubScopeStatus.ts      # Enum: Active, Inactive (Region/County); Active, Inactive, Decommissioned (Station)
    4.  Organization.ts        # Entity: id, name, slug, status, createdAt, auditTrail
    5.  Region.ts              # Entity: id, organizationId, name, code, status
    6.  County.ts              # Entity: id, organizationId, regionId?, name, code, status
    7.  Station.ts             # Entity: id, organizationId, regionId?, countyId?, name, code, status
    8.  index.ts
```

**Invariante, die direkt in Entities codiert ist:**
- `Organization.id` immutable
- `Region.organizationId` immutable
- `Station` kann keinen Content besitzen (keine content-Felder)

---

### 2.5 `tenant/policies/` — Layer 1, Schritt 5

```
tenant/
  policies/
    1.  TenantScopeValidator.ts       # Pure Functions: assertSameOrg(), assertOrgActive()
                                      # validateOrgIdPresent() → wirft DomainError wenn null
    2.  CrossRefValidator.ts          # Pure Functions: validateIntraOrgRef()
                                      # Prüft org-Gleichheit bei jeder Entity-Referenz
    3.  ContentSharingPolicyGuard.ts  # contentSharingPolicyExists() → immer false (Phase 0)
                                      # Named Extension Point für Phase 9
    4.  index.ts
```

---

### 2.6 `governance/entities/` — Layer 2a, Schritt 6

```
governance/
  entities/
    1.  Capability.ts          # Enum: alle 23 Capabilities (content.*, package.*, role.*, survey.*)
    2.  RoleType.ts            # Enum: ContentAuthor, Reviewer, Approver, Releaser, OrgAdmin, ReadOnly
    3.  ScopeLevel.ts          # Re-export aus tenant/ (kein Duplicate)
    4.  QuorumType.ts          # Enum: Unanimous, Majority, SingleApprove, SingleReject
    5.  ApprovalOutcome.ts     # Enum: Approved, Rejected, RequestChanges, Abstained
    6.  DecisionStatus.ts      # Enum: Pending, Submitted, Superseded
    7.  Permission.ts          # Entity: id, organizationId, userRoleId, capability, entityScope
    8.  UserRole.ts            # Entity: id, organizationId, userId, roleType, scopeLevel,
                               #         scopeTargetId?, assignedAt, assignedBy, expiresAt?, revokedAt?
    9.  ApprovalPolicy.ts      # Entity: id, organizationId, appliesTo, quorumType,
                               #         minimumReviewers, requireSeparationOfDuty, ...
    10. ApprovalDecision.ts    # Entity: id, organizationId, entityId, versionId,
                               #         outcome, reviewerId, rationale, status, supersededBy?
    11. index.ts
```

**Reihenfolge-Begründung:**
`Capability` und `RoleType` sind primitive Enums ohne Dependencies. `Permission` braucht `Capability`. `UserRole` braucht `RoleType` + `ScopeLevel`. `ApprovalPolicy` braucht `QuorumType`. `ApprovalDecision` braucht `ApprovalOutcome` + `DecisionStatus`.

---

### 2.7 `versioning/entities/` — Layer 2b, Schritt 7

```
versioning/
  entities/
    1.  EntityType.ts          # Enum: Algorithm, Medication, Protocol, Guideline, ContentPackage
    2.  LineageState.ts        # Enum: Active, Superseded, Released, Deprecated
                               # Note: ein Version-Record kann MEHRERE States gleichzeitig haben
    3.  ReleaseType.ts         # Enum: Initial, Update, Rollback
    4.  ReleaseStatus.ts       # Enum: Active, Superseded
    5.  CompositionEntry.ts    # Value Type: { entityId, versionId, entityType }
                               # Beide Felder mandatory (kein optional versionId)
    6.  ContentEntityVersion.ts # Record: id, organizationId, entityId, entityType,
                                #  versionNumber, predecessorVersionId?, lineageState,
                                #  createdAt, createdBy, changeReason?, snapshot
    7.  ContentPackageVersion.ts # Record: id, organizationId, packageId, versionNumber,
                                 #  composition: CompositionEntry[], targetScope, ...
                                 # composition ist FROZEN nach Write
    8.  ReleaseVersion.ts      # Record: id, organizationId, packageVersionId, packageId,
                               #  releasedAt, releasedBy, targetScope, releaseType,
                               #  supersededReleaseId?, rollbackSourceVersionId?, status
    9.  index.ts
```

**Kritische Implementierungsdetails:**
- `ContentEntityVersion.snapshot` ist vollständige Feldkopie — Typ muss `Readonly<Record<string, unknown>>` sein
- `ContentPackageVersion.composition` ist `ReadonlyArray<CompositionEntry>` — frozen nach Write
- `lineageState` auf Version-Records ist ein `Set<LineageState>` (additiv), kein einzelner Enum-Wert

---

### 2.8 `content/entities/` — Layer 3, Schritt 8

```
content/
  entities/
    1.  ApprovalStatus.ts      # Enum: Draft, InReview, Approved, Rejected, Released, Deprecated
                               # WICHTIG: Value Type (kein eigenständiges Entity)
                               # Wird embedded in alle Content-Entities und ContentPackage
    2.  ScopeTarget.ts         # Value Type: { scopeLevel: ScopeLevel, scopeTargetId?: string }
    3.  Algorithm.ts           # Entity: id, organizationId, title, approvalStatus,
                               #  currentVersionId, category, targetAudience, decisionLogic,
                               #  prerequisites, effectiveDate?, deprecationDate?, deprecationReason?
    4.  Medication.ts          # Entity: id, organizationId, title, approvalStatus,
                               #  currentVersionId, genericName, dosageGuidelines, ...
    5.  Protocol.ts            # Entity: id, organizationId, title, approvalStatus,
                               #  currentVersionId, regulatoryBasis, applicabilityScope?, ...
    6.  Guideline.ts           # Entity: id, organizationId, title, approvalStatus,
                               #  currentVersionId, evidenceBasis, advisory, ...
    7.  ContentPackage.ts      # Entity: id, organizationId, title, approvalStatus,
                               #  currentVersionId, targetScope, ...
                               # KEIN composition-Feld auf Entity (liegt auf Version-Record)
    8.  index.ts
```

**Kritisch:** `ApprovalStatus` ist die erste Datei in diesem Modul — sie definiert den Value Type, der in alle Entities eingebettet ist. Sie ist **kein eigenständiges Entity** (Klarstellung aus Konsistenzprüfung).

---

### 2.9 `governance/policies/` — Layer 4, Schritt 9

```
governance/
  policies/
    1.  PolicyContext.ts            # Input-Typen für alle Policies:
                                    # TenantContext, ActorContext, EntityContext, TransitionContext,
                                    # ReleaseContext, ApprovalContext
    2.  hasCapability.ts            # Pure Helper: hasCapability(actor, capability, orgId) → bool
                                    # Evaluiert über alle aktiven, nicht-revoked UserRoles des Users
    3.  OrganizationScopedAccessPolicy.ts  # evaluateAccess(ctx) → PolicyDecision
                                           # Checks: orgId present → cross-tenant → active role →
                                           #         org active → capability → scope match → SoD
    4.  TransitionAuthorizationPolicy.ts   # evaluateTransition(ctx) → PolicyDecision
                                           # Per-Transition: submit, approve, reject, recall, deprecate
    5.  ApprovalResolutionPolicy.ts        # evaluateQuorum(decisions, policy) → QuorumOutcome
                                           # Berechnet Quorum: Unanimous, Majority, Single*
    6.  ReleaseAuthorizationPolicy.ts      # evaluateRelease(ctx) → PolicyDecision
                                           # Vollständige 10-Punkt-Checklist
    7.  DeprecationAuthorizationPolicy.ts  # evaluateDeprecation(ctx) → PolicyDecision
    8.  index.ts
```

**Reihenfolge-Begründung:**
`PolicyContext` muss zuerst existieren — alle anderen Policies brauchen ihre Input-Typen.
`hasCapability` wird von allen Policies aufgerufen.
`OrganizationScopedAccessPolicy` ist die Basis-Policy — alle anderen Policies delegieren org-scope-Prüfung an sie oder replizieren deren Tenant-Checks.

---

### 2.10 `lifecycle/` — Layer 5, Schritte 10–11

```
lifecycle/
  validators/
    1.  StructuralCompletenessValidator.ts  # Pure Functions:
                                            # validateAlgorithm(), validateMedication(),
                                            # validateProtocol(), validateGuideline(),
                                            # validateContentPackage()
                                            # Prüft strukturelle Vollständigkeit vor Submit
    2.  DeprecatedReferenceChecker.ts       # Pure Function:
                                            # checkForDeprecatedRefs(entity) → Warning[]
                                            # Prüft alle intra-content-Referenzen
    3.  CompositionDriftChecker.ts          # Pure Function:
                                            # checkCompositionStaleness(pkg, currentEntities)
                                            # Prüft versionId == currentVersionId für alle Entries

  services/
    4.  ContentLifecycleService.ts   # submit(), approve(), reject(), recall(), deprecate()
                                     # für Algorithm, Medication, Protocol, Guideline
    5.  PackageAssemblyService.ts    # assemble(), submitPackage(), approvePackage(),
                                     # rejectPackage(), recallPackage(), deprecatePackage()
    6.  ApprovalService.ts           # submitDecision(), evaluateQuorum()
                                     # Quorum-Resolution → Outcome-Signal → Lifecycle-Model
  index.ts
```

**Implementierungsregel für Schritt 10:**
`validators/` müssen vollständig implementiert und getestet sein, **bevor** `services/` angelegt werden. Die Services sind die Konsumenten der Validators.

---

### 2.11 `release/` — Layer 6, Schritt 12

```
release/
  1.  ReleaseChecklist.ts    # Pure Functions: alle 10 Release-Preconditions als separate Funktionen
                              # check1_PackageApproved(), check2_ActorHasCapability(), ...
                              # check10_AuditWritable()
                              # executeChecklist() → ChEcklistResult (alle oder keiner)
  2.  ReleaseService.ts      # executeRelease(cmd) → atomar: checklist + co-release + snapshot + audit
  3.  RollbackService.ts     # executeRollback(cmd) → neuer Release-Record, prior bleibt
  index.ts
```

**Kritisch:** `ReleaseChecklist.ts` enthält pure Funktionen ohne I/O. Diese sind **einzeln testbar** vor dem eigentlichen Service.

---

### 2.12 `survey/` — Layer 7, Schritte 13–14

```
survey/
  entities/
    1.  InsightType.ts     # Enum: ContentDemand, FeatureVote, RegionalDifference, SafetyConcern
    2.  InsightStatus.ts   # Enum: Pending, Acknowledged, Actioned, Dismissed
    3.  InsightPriority.ts # Enum: Low, Medium, High, Critical
    4.  SurveyInsight.ts   # Entity: id, organizationId, submittedBy, insightType,
                           #  targetEntityType?, targetEntityId?, targetRegionId?,
                           #  targetStationId?, priority, description, status, resolution?
  services/
    5.  SurveyInsightService.ts  # submit(), acknowledge(), action(), dismiss()
                                  # KEINE Imports aus governance/policies, lifecycle, release
  index.ts
```

---

## Teil 3 — Minimale Typen/Basiskonstrukte (Foundation First)

Diese Konstrukte müssen **vor allen anderen** existieren. Nichts kann ohne sie kompilieren.

### Absolute Minimalmenge (Bootstrapping-Reihenfolge)

```
Schritt 1 — Branded ID Types
─────────────────────────────
type OrgId = string & { readonly _brand: 'OrgId' }
type AlgorithmId = string & { readonly _brand: 'AlgorithmId' }
type MedicationId = string & { readonly _brand: 'MedicationId' }
type ProtocolId = string & { readonly _brand: 'ProtocolId' }
type GuidelineId = string & { readonly _brand: 'GuidelineId' }
type ContentPackageId = string & { readonly _brand: 'ContentPackageId' }
type VersionId = string & { readonly _brand: 'VersionId' }
type UserId = string & { readonly _brand: 'UserId' }
type UserRoleId = string & { readonly _brand: 'UserRoleId' }

Schritt 2 — DenyReason (alle 30 Werte)
────────────────────────────────────────
export const DenyReason = { ... } as const
export type DenyReason = typeof DenyReason[keyof typeof DenyReason]

Schritt 3 — PolicyDecision + Helpers
──────────────────────────────────────
export interface PolicyDecision {
  readonly allowed: boolean
  readonly denyReason?: DenyReason
  readonly warnings: readonly PolicyWarning[]
  readonly context: Readonly<Record<string, unknown>>
}
export function allow(opts?): PolicyDecision
export function deny(reason: DenyReason, context?): PolicyDecision

Schritt 4 — DomainError + DomainDenial
────────────────────────────────────────
export class DomainError extends Error { ... }
export class DomainDenial { ... }  // kein Error — first-class Value

Schritt 5 — ApprovalStatus (Value Type)
────────────────────────────────────────
export const ApprovalStatus = {
  Draft: 'Draft',
  InReview: 'InReview',
  Approved: 'Approved',
  Rejected: 'Rejected',
  Released: 'Released',
  Deprecated: 'Deprecated',
} as const
export type ApprovalStatus = typeof ApprovalStatus[keyof typeof ApprovalStatus]
// NICHT: export class ApprovalStatus — Value Type, kein Entity

Schritt 6 — EntityType Enum
─────────────────────────────
export const EntityType = {
  Algorithm: 'Algorithm',
  Medication: 'Medication',
  Protocol: 'Protocol',
  Guideline: 'Guideline',
  ContentPackage: 'ContentPackage',
} as const

Schritt 7 — OrganizationStatus Enum
──────────────────────────────────────
export const OrganizationStatus = {
  Active: 'Active',
  Suspended: 'Suspended',
  Decommissioned: 'Decommissioned',
} as const
```

### Warum diese Reihenfolge unverhandelbar ist

| Konstrukt | Wird gebraucht von |
|-----------|-------------------|
| `OrgId` (branded) | Jedem Entity-Feld `organizationId`; ohne es kein Typ-Safety für Tenant-Isolation |
| `DenyReason` | `PolicyDecision.denyReason`; ohne es gibt es keinen typisierten Denial-Grund |
| `PolicyDecision` | Jeder Policy-Funktion; ohne es gibt es keine statisch typisierten Policy-Rückgaben |
| `DomainDenial` | Jedem Service, der Denials an Caller weitergeben muss |
| `ApprovalStatus` | Allen Content-Entities; zentraler State-Machine-Typ |
| `EntityType` | `ContentEntityVersion`, `ApprovalDecision`, allen Audit-Events |
| `OrganizationStatus` | `TenantScopeValidator.assertOrgActive()` |

---

## Teil 4 — Dependency Order Matrix

Die Matrix zeigt für jedes Modul: was es importieren **darf** (✓) und was **verboten** ist (✗).

```
         shar  tena  gov/e vers/e cont  gov/p lifec rele  surv
shared    —     ✗     ✗     ✗     ✗     ✗     ✗     ✗     ✗
tenant    ✓     —     ✗     ✗     ✗     ✗     ✗     ✗     ✗
gov/ent   ✓     ✓     —     ✗     ✗     ✗     ✗     ✗     ✗
vers/ent  ✓     ✓     ✗     —     ✗     ✗     ✗     ✗     ✗
content   ✓     ✓     ✗     ✓r    —     ✗     ✗     ✗     ✗
gov/pol   ✓     ✓     ✓     ✓r    ✓r    —     ✗     ✗     ✗
lifecycle ✓     ✓     ✓     ✓     ✓     ✓     —     ✗     ✗
release   ✓     ✓     ✓     ✓     ✓     ✓     ✓     —     ✗
survey    ✓     ✓     ✗     ✗     ✗r    ✗     ✗     ✗     —
```

Legende:
- `✓` — Import erlaubt
- `✓r` — Nur lesende Entity-Typen erlaubt (keine Policy- oder Service-Calls)
- `✗` — Verboten (Import führt zu Compile-Error oder CI-Fehler)

### Verbotene Imports — Detailansicht

| Wer | Darf NIE importieren | Verstoß-Risiko |
|-----|---------------------|----------------|
| `survey` | `governance/policies`, `lifecycle/services`, `release` | Survey-Governance-Leak |
| `content/entities` | `governance/policies`, `lifecycle/services` | Auth-Logik in Entities |
| `versioning/entities` | `governance/policies`, `lifecycle/services`, `content/entities` | Zirkuläre Abhängigkeit |
| `governance/entities` | `content/entities`, `lifecycle`, `release`, `survey` | Zirkuläre Abhängigkeit |
| `shared` | irgendein Domain-Modul | shared ist Basis-Schicht |
| irgendein Modul | `infrastructure/`, `database/`, `http/`, `ui/` | Domain ist stack-agnostisch |
| `governance/policies` | `survey` | Survey-Governance-Leak (HC-G-08) |

### Erlaubte Import-Richtungen (gerichtet, einweg)

```
shared ──────────────────────────────────────────────────────► alle
tenant ──────────────────────────────────────────────────────► gov/ent, vers/ent, content, gov/pol, lifecycle, release, survey
gov/entities ────────────────────────────────────────────────► gov/pol, lifecycle, release
vers/entities ───────────────────────────────────────────────► content(r), gov/pol(r), lifecycle, release
content/entities ────────────────────────────────────────────► gov/pol(r), lifecycle, release
gov/policies ────────────────────────────────────────────────► lifecycle, release
lifecycle ───────────────────────────────────────────────────► release
```

---

## Teil 5 — Foundation First Rules

Diese Regeln definieren, was als "Foundation" gilt und welche Garantien sie geben muss.

### FF-01 — Foundation ist compilierbar und ohne Tests deploybar

Alle Layer 0–3 (shared + tenant + governance/entities + versioning/entities + content/entities) müssen **ohne jegliche Service-Abhängigkeit** kompilieren. Die Foundation-Schichten dürfen keine Service-Calls, kein I/O, keine Async-Operationen enthalten.

### FF-02 — Jede Foundation-Datei hat Null externe Seiteneffekte

```typescript
// KORREKT — Foundation-Datei:
export const ApprovalStatus = { Draft: 'Draft', ... } as const

// VERBOTEN in Foundation-Dateien:
import { db } from '../infrastructure/database'  // ← I/O
console.log('Loading entity module')             // ← Seiteneffekt beim Import
```

### FF-03 — Foundation-Exporte sind stable API

Alle Exporte aus Layer 0–3 bilden die stabile API der Domain Foundation. Sie dürfen nach ihrer ersten Testabnahme **nicht breaking-changed** werden ohne explizite Architekturentscheidung. Hinzufügen ist erlaubt, Umbenennen/Entfernen erfordert Migration.

### FF-04 — Foundation-Artefakte, die zuerst exportiert werden müssen

Die folgenden Exporte müssen im `packages/domain/src/index.ts` vor allen Services verfügbar sein:

```typescript
// packages/domain/src/index.ts — Foundation Exports (Phase 0 Minimum)

// Layer 0 — Shared Primitives
export type { OrgId, AlgorithmId, MedicationId, ProtocolId,
              GuidelineId, ContentPackageId, VersionId, UserId, UserRoleId }
export type { PolicyDecision, PolicyWarning }
export { allow, deny }
export type { DenyReason }
export { DomainError, DomainDenial,
         TenantIsolationViolation, AuditWriteFailure, DataIntegrityViolation }
export type { AuditEvent, LifecycleAuditEvent, ReleaseAuditEvent }

// Layer 1 — Tenant
export { OrganizationStatus, ScopeLevel, SubScopeStatus }
export type { Organization, Region, County, Station }
export { assertSameOrg, assertOrgActive, validateOrgIdPresent }
export { contentSharingPolicyExists }  // Phase 0: immer false

// Layer 2a — Governance Entities
export { Capability, RoleType, QuorumType, ApprovalOutcome, DecisionStatus }
export type { Permission, UserRole, ApprovalPolicy, ApprovalDecision }

// Layer 2b — Versioning Entities
export { EntityType, LineageState, ReleaseType, ReleaseStatus }
export type { CompositionEntry, ContentEntityVersion,
              ContentPackageVersion, ReleaseVersion }

// Layer 3 — Content Entities
export { ApprovalStatus }  // Value Type (embedded enum)
export type { ScopeTarget, Algorithm, Medication, Protocol, Guideline, ContentPackage }
```

### FF-05 — Policy-Layer-Exports (Layer 4)

```typescript
// Werden erst exportiert nachdem Layer 0–3 Tests grün sind

export type { PolicyContext, TransitionContext, ReleaseContext, ApprovalContext }
export { hasCapability }
export { evaluateAccess }           // OrganizationScopedAccessPolicy
export { evaluateTransition }       // TransitionAuthorizationPolicy
export { evaluateQuorum }           // ApprovalResolutionPolicy
export { evaluateRelease }          // ReleaseAuthorizationPolicy
export { evaluateDeprecation }      // DeprecationAuthorizationPolicy
```

---

## Teil 6 — Test-before-Service Regeln

### Übersicht: Gate-System

Jedes "Gate" ist eine **harte Bedingung** für den nächsten Implementierungsschritt.
Kein Service darf angelegt werden, bevor sein Gate geöffnet ist.

```
GATE 0 ─── shared/ + tenant/ Tests grün
  │
  ▼
GATE 1 ─── governance/entities + versioning/entities + content/entities Tests grün
  │
  ▼
GATE 2 ─── governance/policies Tests grün
  │         (Policy-Funktionen ohne Services testbar)
  ▼
GATE 3 ─── lifecycle/validators Tests grün
  │
  ▼
GATE 4 ─── lifecycle/services Tests grün
  │
  ▼
GATE 5 ─── release/ReleaseChecklist Tests grün
  │
  ▼
GATE 6 ─── release/services Tests grün
```

---

### GATE 0 — Pflicht-Tests vor governance/entities

Alle folgenden Tests müssen grün sein, bevor `governance/entities/` angelegt wird.

| Test-ID | Beschreibung | Datei |
|---------|-------------|-------|
| G0-01 | `allow()` gibt PolicyDecision mit `allowed: true` zurück | shared/types.test.ts |
| G0-02 | `deny(reason)` gibt PolicyDecision mit `allowed: false` + Reason zurück | shared/types.test.ts |
| G0-03 | `deny()` ohne DenyReason ist Compile-Error | shared/types.test.ts |
| G0-04 | `DomainDenial` ist kein Error (kein `instanceof Error`) | shared/errors.test.ts |
| G0-05 | `DomainError` ist ein Error (`instanceof Error`) | shared/errors.test.ts |
| G0-06 | `Organization.organizationId` ist immutable nach Erstellung | tenant/entities.test.ts |
| G0-07 | `Org.Suspended` → Status ist korrekt | tenant/entities.test.ts |
| G0-08 | `Station` hat kein content-Feld (Station = release target only) | tenant/entities.test.ts |
| G0-09 | `contentSharingPolicyExists()` gibt immer false zurück | tenant/policies.test.ts |
| G0-10 | `validateOrgIdPresent(null)` wirft DomainError (nicht DomainDenial) | tenant/policies.test.ts |
| **TI-P01** | Tenant-Isolation: L-01 bis L-12 vollständige Matrix | tenant.isolaton.test.ts |

---

### GATE 1 — Pflicht-Tests vor governance/policies

Alle folgenden Tests müssen grün sein, bevor `governance/policies/` angelegt wird.

| Test-ID | Beschreibung | Datei |
|---------|-------------|-------|
| G1-01 | `ApprovalStatus` ist Value Type (Enum), nicht Entity | content/entities.test.ts |
| G1-02 | `ContentPackage` Entity hat kein composition-Feld (liegt auf Version) | content/entities.test.ts |
| G1-03 | `Algorithm.organizationId` immutable | content/entities.test.ts |
| G1-04 | `UserRole.organizationId` immutable | governance/entities.test.ts |
| G1-05 | `UserRole` ohne orgId erstellen → Compile-Error oder Runtime-Error | governance/entities.test.ts |
| G1-06 | `ApprovalDecision` ohne `versionId` → abgelehnt | governance/entities.test.ts |
| G1-07 | `ContentEntityVersion` write-once: alle Felder außer lineageState | versioning/entities.test.ts |
| G1-08 | `lineageState` additiv erweitern möglich, reduzieren verboten | versioning/entities.test.ts |
| G1-09 | `CompositionEntry` ohne versionId → Compile-Error | versioning/entities.test.ts |
| G1-10 | `ContentPackageVersion.composition` ist frozen (readonly array) | versioning/entities.test.ts |
| **INV-A-01–12** | Alle Entity-Invarianten (Gruppe A) | entities.invariants.test.ts |
| **INV-C-01–12** | Alle Version-Invarianten (Gruppe C) | versioning.invariants.test.ts |

---

### GATE 2 — Pflicht-Tests vor lifecycle/validators

Alle folgenden Tests müssen grün sein, bevor `lifecycle/validators/` angelegt wird.

| Test-ID | Beschreibung | Datei |
|---------|-------------|-------|
| G2-01 | `evaluateAccess()`: fehlende orgId → MISSING_ORGANIZATION_CONTEXT | gov/policies.test.ts |
| G2-02 | `evaluateAccess()`: cross-tenant → CROSS_TENANT_ACCESS_DENIED | gov/policies.test.ts |
| G2-03 | `evaluateAccess()`: Org.Suspended → ORGANIZATION_NOT_ACTIVE | gov/policies.test.ts |
| G2-04 | `evaluateAccess()`: Capability fehlt → CAPABILITY_NOT_GRANTED | gov/policies.test.ts |
| G2-05 | `evaluateTransition()`: Author approves own → SoD-Violation | gov/policies.test.ts |
| G2-06 | `evaluateTransition()`: OrgAdmin hat package.release nicht by default | gov/policies.test.ts |
| G2-07 | `evaluateRelease()`: alle 10 Preconditions testbar einzeln | gov/policies.test.ts |
| G2-08 | `evaluateQuorum()`: Unanimous: 1 Rejected → sofort Rejected | gov/policies.test.ts |
| G2-09 | `evaluateQuorum()`: Majority: Tie → Rejected | gov/policies.test.ts |
| G2-10 | `evaluateQuorum()`: Timeout → KEIN Quorum-Resolve (nur Notification) | gov/policies.test.ts |
| G2-11 | Policy ist deterministisch: gleicher Input → gleicher Output | gov/policies.test.ts |
| G2-12 | Policy mit fehlender Konfiguration → POLICY_UNRESOLVABLE (nicht allow) | gov/policies.test.ts |
| **INV-D-01–12** | Alle Governance-Invarianten (Gruppe D) | governance.invariants.test.ts |
| **P-02** | PolicyDecision-Grundstruktur | gov/policy-decision.test.ts |
| **P-03** | SoD: Author ≠ Approver | gov/sod.test.ts |
| **P-04** | SoD: Approver ≠ Releaser | gov/sod.test.ts |
| **P-14** | OrgAdmin hat package.release nicht by default | gov/capabilities.test.ts |

---

### GATE 3 — Pflicht-Tests vor lifecycle/services

Alle folgenden Tests müssen grün sein, bevor `lifecycle/services/` angelegt werden.

| Test-ID | Beschreibung | Datei |
|---------|-------------|-------|
| G3-01 | `validateAlgorithm()`: leer decisionLogic → incomplete | validators.test.ts |
| G3-02 | `validateMedication()`: kein Route/Dose → incomplete | validators.test.ts |
| G3-03 | `validateProtocol()`: kein regulatoryBasis → incomplete | validators.test.ts |
| G3-04 | `validateGuideline()`: kein evidenceBasis → incomplete | validators.test.ts |
| G3-05 | `validateContentPackage()`: leere Composition → incomplete | validators.test.ts |
| G3-06 | `checkForDeprecatedRefs()`: Algorithm mit deprecated Medication → Warning[] | validators.test.ts |
| G3-07 | `checkCompositionStaleness()`: versionId ≠ currentVersionId → stale entries | validators.test.ts |
| **INV-B-01–12** | Alle ApprovalStatus-Invarianten (Gruppe B) | lifecycle.invariants.test.ts |
| **P-05** | Released ist vollständig immutable | lifecycle.immutability.test.ts |
| **P-06** | Approved → Released nur via ContentPackage | lifecycle.transitions.test.ts |
| **P-07** | Kein Auto-Approve | lifecycle.autoapprove.test.ts |
| **P-13** | Parallel Draft Forks blockiert | versioning.drafts.test.ts |
| **LC-01–12** | Vollständige Lifecycle-Transition-Tests | lifecycle.transitions.test.ts |
| **AP-01–11** | Vollständige Approval-Tests | approval.rules.test.ts |
| **VR-01–09** | Vollständige Versioning-Tests | versioning.rules.test.ts |

---

### GATE 4 — Pflicht-Tests vor release/ReleaseChecklist

Alle folgenden Tests müssen grün sein, bevor `release/` angelegt wird.

| Test-ID | Beschreibung | Datei |
|---------|-------------|-------|
| G4-01 | `ContentLifecycleService.submit()`: vollständige Precondition-Prüfung | lifecycle.service.test.ts |
| G4-02 | `ContentLifecycleService.approve()`: Audit-Write-Failure bricht ab | lifecycle.audit.test.ts |
| G4-03 | `PackageAssemblyService.assemble()`: Duplicate-entityId abgelehnt | package.assembly.test.ts |
| G4-04 | `PackageAssemblyService.assemble()`: cross-org entry abgelehnt | package.assembly.test.ts |
| G4-05 | `ApprovalService.submitDecision()`: post-quorum Submission abgelehnt | approval.service.test.ts |
| G4-06 | `ApprovalService.evaluateQuorum()`: Signal an Lifecycle, keine direkte Transition | approval.service.test.ts |
| **CP-01–09** | Vollständige ContentPackage-Composition-Tests | package.composition.test.ts |
| **P-08** | Version Write-Once | versioning.immutability.test.ts |
| **P-09** | Composition-Version-Staleness | package.staleness.test.ts |
| **P-11** | Survey hat null Impact auf Lifecycle | survey.boundary.test.ts |
| **P-15** | Identische Composition trägt kein Approval weiter | package.reapproval.test.ts |

---

### GATE 5 — Pflicht-Tests vor release/services

Alle folgenden Tests müssen grün sein, bevor `ReleaseService` und `RollbackService` implementiert werden.

| Test-ID | Beschreibung | Datei |
|---------|-------------|-------|
| G5-01 | `check1_PackageApproved()` → false wenn Package InReview | release.checklist.test.ts |
| G5-02 | `check5_CompositionApproved()` → false wenn Entry nicht Approved | release.checklist.test.ts |
| G5-03 | `check5_CompositionVersionCurrent()` → false wenn versionId ≠ currentVersionId | release.checklist.test.ts |
| G5-04 | `check7_TargetScopeActive()` → false wenn Station Decommissioned | release.checklist.test.ts |
| G5-05 | `check8_NoConflictingActiveRelease()` → false bei Conflict | release.checklist.test.ts |
| G5-06 | `executeChecklist()` → alle 10 oder keiner → kein Partial-Result | release.checklist.test.ts |
| **RP-01–07** | Vollständige Release-Precondition-Tests | release.preconditions.test.ts |
| **P-10** | Atomic Release: Rollback bei Audit-Failure | release.atomic.test.ts |
| **INV-G-01–10** | Alle Release-Invarianten | release.invariants.test.ts |

---

### Test-Reihenfolge — Gesamtübersicht

```
GATE 0 Tests (11)  ─────────────────────────────────────── MUSS grün sein vor: governance/entities
GATE 1 Tests (16)  ─────────────────────────────────────── MUSS grün sein vor: governance/policies
GATE 2 Tests (18)  ─────────────────────────────────────── MUSS grün sein vor: lifecycle/validators
GATE 3 Tests (25)  ─────────────────────────────────────── MUSS grün sein vor: lifecycle/services
GATE 4 Tests (20)  ─────────────────────────────────────── MUSS grün sein vor: release/
GATE 5 Tests (17)  ─────────────────────────────────────── MUSS grün sein vor: release/services
──────────────────────────────────────────────────────────────────────────────────────────────
Gesamt Gate-Tests: ~107 (inkl. Überschneidungen mit P-01..P-15 und INV-Gruppen)

Alle 112 Tests aus domain-validation-matrix.md müssen vor release/services grün sein.
```

---

## Teil 7 — Datei-für-Datei-Implementierungsplan

Vollständige chronologische Reihenfolge aller zu erstellenden Dateien.

```
PHASE A — Foundation Primitives (Kein Test-Gate nötig — diese SIND die Basis der Tests)
─────────────────────────────────────────────────────────────────────────────────────────
 A-01  packages/domain/src/shared/types/OrgId.ts
 A-02  packages/domain/src/shared/types/EntityId.ts
 A-03  packages/domain/src/shared/types/VersionId.ts
 A-04  packages/domain/src/shared/types/UserId.ts
 A-05  packages/domain/src/shared/types/RoleId.ts
 A-06  packages/domain/src/shared/types/DenyReason.ts
 A-07  packages/domain/src/shared/types/PolicyDecision.ts
 A-08  packages/domain/src/shared/types/index.ts
 A-09  packages/domain/src/shared/errors/DomainError.ts
 A-10  packages/domain/src/shared/errors/DomainDenial.ts
 A-11  packages/domain/src/shared/errors/TenantIsolationViolation.ts
 A-12  packages/domain/src/shared/errors/AuditWriteFailure.ts
 A-13  packages/domain/src/shared/errors/DataIntegrityViolation.ts
 A-14  packages/domain/src/shared/errors/index.ts
 A-15  packages/domain/src/shared/audit/AuditOperation.ts
 A-16  packages/domain/src/shared/audit/AuditEvent.ts
 A-17  packages/domain/src/shared/audit/LifecycleAuditEvent.ts
 A-18  packages/domain/src/shared/audit/PolicyDecisionAuditEvent.ts
 A-19  packages/domain/src/shared/audit/VersionCreationAuditEvent.ts
 A-20  packages/domain/src/shared/audit/ReleaseAuditEvent.ts
 A-21  packages/domain/src/shared/audit/index.ts
 A-22  packages/domain/src/shared/index.ts

 ← TEST-DATEIEN: shared.types.test.ts, shared.errors.test.ts

PHASE B — Tenant (nach GATE 0)
─────────────────────────────────────────────────────────────────────────────────────────
 B-01  packages/domain/src/tenant/entities/OrganizationStatus.ts
 B-02  packages/domain/src/tenant/entities/ScopeLevel.ts
 B-03  packages/domain/src/tenant/entities/SubScopeStatus.ts
 B-04  packages/domain/src/tenant/entities/Organization.ts
 B-05  packages/domain/src/tenant/entities/Region.ts
 B-06  packages/domain/src/tenant/entities/County.ts
 B-07  packages/domain/src/tenant/entities/Station.ts
 B-08  packages/domain/src/tenant/entities/index.ts
 B-09  packages/domain/src/tenant/policies/TenantScopeValidator.ts
 B-10  packages/domain/src/tenant/policies/CrossRefValidator.ts
 B-11  packages/domain/src/tenant/policies/ContentSharingPolicyGuard.ts
 B-12  packages/domain/src/tenant/policies/index.ts
 B-13  packages/domain/src/tenant/index.ts

 ← TEST-DATEIEN: tenant.entities.test.ts, tenant.policies.test.ts, tenant.isolation.test.ts

PHASE C — Core Domain Entities (nach GATE 1 — parallel implementierbar)
─────────────────────────────────────────────────────────────────────────────────────────
 C-01  packages/domain/src/governance/entities/Capability.ts
 C-02  packages/domain/src/governance/entities/RoleType.ts
 C-03  packages/domain/src/governance/entities/QuorumType.ts
 C-04  packages/domain/src/governance/entities/ApprovalOutcome.ts
 C-05  packages/domain/src/governance/entities/DecisionStatus.ts
 C-06  packages/domain/src/governance/entities/Permission.ts
 C-07  packages/domain/src/governance/entities/UserRole.ts
 C-08  packages/domain/src/governance/entities/ApprovalPolicy.ts
 C-09  packages/domain/src/governance/entities/ApprovalDecision.ts
 C-10  packages/domain/src/governance/entities/index.ts

 [PARALLEL:]
 C-11  packages/domain/src/versioning/entities/EntityType.ts
 C-12  packages/domain/src/versioning/entities/LineageState.ts
 C-13  packages/domain/src/versioning/entities/ReleaseType.ts
 C-14  packages/domain/src/versioning/entities/ReleaseStatus.ts
 C-15  packages/domain/src/versioning/entities/CompositionEntry.ts
 C-16  packages/domain/src/versioning/entities/ContentEntityVersion.ts
 C-17  packages/domain/src/versioning/entities/ContentPackageVersion.ts
 C-18  packages/domain/src/versioning/entities/ReleaseVersion.ts
 C-19  packages/domain/src/versioning/entities/index.ts

 ← TEST-DATEIEN: governance.entities.test.ts, versioning.entities.test.ts

 C-20  packages/domain/src/content/entities/ApprovalStatus.ts    ← ERSTE Datei in content/
 C-21  packages/domain/src/content/entities/ScopeTarget.ts
 C-22  packages/domain/src/content/entities/Algorithm.ts
 C-23  packages/domain/src/content/entities/Medication.ts
 C-24  packages/domain/src/content/entities/Protocol.ts
 C-25  packages/domain/src/content/entities/Guideline.ts
 C-26  packages/domain/src/content/entities/ContentPackage.ts
 C-27  packages/domain/src/content/entities/index.ts
 C-28  packages/domain/src/content/index.ts

 ← TEST-DATEIEN: content.entities.test.ts, entities.invariants.test.ts

PHASE D — Governance Policies (nach GATE 2)
─────────────────────────────────────────────────────────────────────────────────────────
 D-01  packages/domain/src/governance/policies/PolicyContext.ts
 D-02  packages/domain/src/governance/policies/hasCapability.ts
 D-03  packages/domain/src/governance/policies/OrganizationScopedAccessPolicy.ts
 D-04  packages/domain/src/governance/policies/TransitionAuthorizationPolicy.ts
 D-05  packages/domain/src/governance/policies/ApprovalResolutionPolicy.ts
 D-06  packages/domain/src/governance/policies/ReleaseAuthorizationPolicy.ts
 D-07  packages/domain/src/governance/policies/DeprecationAuthorizationPolicy.ts
 D-08  packages/domain/src/governance/policies/index.ts
 D-09  packages/domain/src/governance/index.ts

 ← TEST-DATEIEN: gov.policies.test.ts, governance.invariants.test.ts,
                 gov.sod.test.ts, gov.capabilities.test.ts

PHASE E — Lifecycle (nach GATE 3)
─────────────────────────────────────────────────────────────────────────────────────────
 E-01  packages/domain/src/lifecycle/validators/StructuralCompletenessValidator.ts
 E-02  packages/domain/src/lifecycle/validators/DeprecatedReferenceChecker.ts
 E-03  packages/domain/src/lifecycle/validators/CompositionDriftChecker.ts
 E-04  packages/domain/src/lifecycle/validators/index.ts

 ← TEST-DATEIEN: validators.test.ts — MUSS vor E-05 grün sein

 E-05  packages/domain/src/lifecycle/services/ContentLifecycleService.ts
 E-06  packages/domain/src/lifecycle/services/PackageAssemblyService.ts
 E-07  packages/domain/src/lifecycle/services/ApprovalService.ts
 E-08  packages/domain/src/lifecycle/services/index.ts
 E-09  packages/domain/src/lifecycle/index.ts

 ← TEST-DATEIEN: lifecycle.service.test.ts, approval.service.test.ts,
                 lifecycle.invariants.test.ts, package.assembly.test.ts

PHASE F — Release (nach GATE 5)
─────────────────────────────────────────────────────────────────────────────────────────
 F-01  packages/domain/src/release/ReleaseChecklist.ts

 ← TEST-DATEIEN: release.checklist.test.ts — MUSS vor F-02 grün sein

 F-02  packages/domain/src/release/ReleaseService.ts
 F-03  packages/domain/src/release/RollbackService.ts
 F-04  packages/domain/src/release/index.ts

 ← TEST-DATEIEN: release.service.test.ts, release.atomic.test.ts,
                 release.invariants.test.ts, release.preconditions.test.ts

PHASE G — Survey (nach PHASE B — unabhängig von C–F)
─────────────────────────────────────────────────────────────────────────────────────────
 G-01  packages/domain/src/survey/entities/InsightType.ts
 G-02  packages/domain/src/survey/entities/InsightStatus.ts
 G-03  packages/domain/src/survey/entities/InsightPriority.ts
 G-04  packages/domain/src/survey/entities/SurveyInsight.ts
 G-05  packages/domain/src/survey/entities/index.ts

 ← TEST-DATEIEN: survey.entities.test.ts — MUSS vor G-06 grün sein

 G-06  packages/domain/src/survey/services/SurveyInsightService.ts
 G-07  packages/domain/src/survey/services/index.ts
 G-08  packages/domain/src/survey/index.ts

 ← TEST-DATEIEN: survey.boundary.test.ts (inkl. P-11, SG-01–05, INV-H-01–07)

ABSCHLUSS
─────────────────────────────────────────────────────────────────────────────────────────
 Z-01  packages/domain/src/index.ts    ← Domain Public API (Foundation Exports + Services)
```

---

## Zusammenfassung

| Phase | Dateien | Gate | Tests vorher |
|-------|---------|------|-------------|
| A — Shared Primitives | 22 | — | (sind selbst Testbasis) |
| B — Tenant | 13 | GATE 0 (11 Tests) | tenant + isolation |
| C — Core Entities | 28 | GATE 1 (16 Tests) | entities + versioning |
| D — Policies | 9 | GATE 2 (18 Tests) | governance + policies |
| E — Lifecycle | 9 | GATE 3 (25 Tests) | lifecycle + approval |
| F — Release | 4 | GATE 5 (17 Tests) | release checklist |
| G — Survey | 8 | nach B (isoliert) | survey boundary |
| **Total** | **93 Dateien** | **6 Gates** | **112 Tests** |
