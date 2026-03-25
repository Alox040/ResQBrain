# Domain Implementation Guardrails
## ResQBrain Phase 0 — `packages/domain/src/`

**Version:** 1.0
**Date:** 2026-03-25
**Status:** Canonical — verbindliche Implementierungsregeln für die Domain Foundation
**Authority:** `domain-entity-blueprint.md`, `tenant-model.md`, `content-lifecycle-final.md`,
              `approval-model-final.md`, `version-model-final.md`,
              `content-package-model-final.md`, `governance-model-final.md`

---

## Präambel

Dieses Dokument leitet **verbindliche Implementierungsregeln** für `packages/domain/src/` ab.
Jede Abweichung von diesen Regeln ist ein Architekturverstoß, der vor dem Merge korrigiert werden muss.

Prioritätsreihenfolge bei Konflikten:
1. Tenant-Isolation-Regeln (HC-01–HC-10 aus `tenant-model.md`)
2. Governance-Regeln (HC-G aus `governance-model-final.md`)
3. Versioning-Regeln (HC-V aus `version-model-final.md`)
4. ContentPackage-Regeln (HC-CP aus `content-package-model-final.md`)
5. Lifecycle-Regeln

---

## Teil 1 — Modulgrenzen

### Verzeichnisstruktur

```
packages/domain/src/
  tenant/
    entities/         # Organization, Region, County, Station
    policies/         # TenantScopePolicy, ContentSharingPolicy guard
    index.ts          # Public API des tenant-Moduls
  governance/
    entities/         # UserRole, Permission, ApprovalPolicy, ApprovalDecision
    policies/         # OrganizationScopedAccessPolicy, TransitionAuthorizationPolicy,
                      # ReleaseAuthorizationPolicy, DeprecationAuthorizationPolicy
    index.ts
  lifecycle/
    entities/         # ApprovalStatus (Value Type / Enum), Transition definitions
    policies/         # LifecycleTransitionPolicy (Precondition-Checks)
    services/         # ContentLifecycleService, PackageAssemblyService
    index.ts
  versioning/
    entities/         # ContentEntityVersion, ContentPackageVersion, ReleaseVersion
    policies/         # VersionCreationPolicy, LineageValidationPolicy
    services/         # VersioningService
    index.ts
  content/
    entities/         # Algorithm, Medication, Protocol, Guideline, ContentPackage
    index.ts
  release/
    services/         # ReleaseService, RollbackService
    policies/         # ReleaseAuthorizationPolicy (importiert aus governance/)
    index.ts
  survey/
    entities/         # SurveyInsight
    index.ts
  shared/
    types/            # PolicyDecision, DenyReason, DomainError, AuditEvent
    errors/           # Domain Errors (technisch, nicht Authorization)
    audit/            # AuditEventBuilder, AuditRecord types
```

### Modul-Verantwortlichkeiten

| Modul | Besitzt | Darf lesen | Darf NICHT importieren |
|-------|---------|-----------|------------------------|
| `tenant` | Organization, Region, County, Station; TenantScope-Validierungen | — | governance, lifecycle, versioning, content, survey |
| `governance` | UserRole, Permission, ApprovalPolicy, ApprovalDecision; alle 5 Policy-Typen | tenant (read-only für Org-Status) | lifecycle/services, versioning/services, content/entities, survey |
| `lifecycle` | ApprovalStatus (Value Type), Transition-Preconditions, ContentLifecycleService | governance/policies, tenant, versioning/entities | survey, infrastructure, UI |
| `versioning` | ContentEntityVersion, ContentPackageVersion, ReleaseVersion; Lineage-Logik | tenant | lifecycle/services, governance/services, survey |
| `content` | Algorithm, Medication, Protocol, Guideline, ContentPackage (Entitäten nur) | tenant, versioning/entities | governance/policies, lifecycle/services, survey |
| `release` | ReleaseService, RollbackService | governance/policies, lifecycle, versioning, content, tenant | survey |
| `survey` | SurveyInsight | tenant (für org-scope-Validierung) | governance/policies, lifecycle/services, versioning/services, release, content/lifecycle-state |
| `shared` | PolicyDecision, DenyReason, DomainError, AuditEvent-Types | — | Alle Domänenmodule (Abhängigkeit nur inward) |

---

## Teil 2 — Was in Entities erlaubt ist

### Entity-Regeln (strikt)

Entities sind **Datenträger mit Invarianten**. Sie enthalten keine Autorisierungslogik.

#### ERLAUBT in Entities:

```
✓  Felder / Properties (alle readonly nach Erstellung, außer systemverwalteten)
✓  Strukturelle Invarianten als reine Berechnungen (z.B. isActive(): boolean)
✓  Value-Type-Validierungen (z.B. versionNumber > 0)
✓  Factory-Methoden, die Invarianten beim Erstellen prüfen
✓  Immutability-Enforcement (Felder nach Release nicht änderbar)
✓  Typ-sichere Enumerationen (ApprovalStatus, RoleType, etc.)
✓  Rein berechnete Eigenschaften ohne Seiteneffekte (z.B. isReleased(): boolean)
✓  organizationId als Pflichtfeld bei der Erstellung
```

#### VERBOTEN in Entities:

```
✗  Capability-Checks ("darf dieser User dieses Feld lesen?")
✗  Permission-Evaluierung ("hat der User content.approve?")
✗  Calls auf Services oder Repositories
✗  Async-Operationen oder I/O
✗  Session-State, HTTP-Context, User-Identity
✗  Direkte ApprovalStatus-Mutationen durch User-Aktion
   (ApprovalStatus wird nur vom Lifecycle Service geschrieben)
✗  Imports aus governance/policies, lifecycle/services, survey
✗  Logik, die vom UI-Zustand abhängt
✗  Hardcoded Content (medizinische Inhalte, Dosierungen etc.)
✗  Tenant-Ableitung aus Context/Session (organizationId immer explizit)
```

#### Beispiel — KORREKT:

```typescript
// content/entities/Algorithm.ts
export class Algorithm {
  readonly id: string
  readonly organizationId: string           // immer required, immer immutable
  readonly approvalStatus: ApprovalStatus   // system-only, nicht direkt setzbar
  readonly currentVersionId: string

  // Reine Zustandsberechnung — KEIN Auth-Check
  isEditable(): boolean {
    return this.approvalStatus === ApprovalStatus.Draft
  }

  isImmutable(): boolean {
    return this.approvalStatus === ApprovalStatus.Released
      || this.approvalStatus === ApprovalStatus.Deprecated
  }
}
```

#### Beispiel — FALSCH:

```typescript
// VERBOTEN: Auth-Logik in Entity
class Algorithm {
  canBeApprovedBy(userRole: UserRole): boolean {  // ← VERBOTEN
    return userRole.capability.includes('content.approve')
  }

  approve(actor: UserRole): void {                // ← VERBOTEN: Service-Logik in Entity
    this.approvalStatus = ApprovalStatus.Approved
  }
}
```

---

## Teil 3 — Was in Policies erlaubt ist

### Policy-Regeln (strikt)

Policies sind **stateless Evaluatoren**. Sie lesen Zustand, mutieren nie.

#### ERLAUBT in Policies:

```
✓  Empfangen von Request-Kontext als Input (UserRole, organizationId, entityState, capability)
✓  Lesen von Entity-Feldern (read-only)
✓  Rückgabe von PolicyDecision (allowed, denyReason, warnings, context)
✓  Reine Berechnungen und Vergleiche
✓  Prüfen von SoD-Regeln (Vergleich actor vs. prior actor)
✓  Prüfen von organizationId-Matches
✓  Prüfen von ApprovalStatus, versionId, Org-Status
✓  Aggregieren von ApprovalDecisions für Quorum-Berechnung
✓  Rückgabe von Warnings (non-blocking) zusätzlich zu allowed: true
✓  Logging-Context im `context`-Feld von PolicyDecision erfassen
```

#### VERBOTEN in Policies:

```
✗  State-Mutationen (kein Schreiben auf Entities, keine DB-Calls)
✗  Calls auf andere Services oder Repositories
✗  Async-Operationen (Policies sind synchron)
✗  Exceptions für normale Autorisierungsablehnungen
   (allowed: false + denyReason ist der korrekte Weg)
✗  Implicit allow fallback (fehlender Kontext → POLICY_UNRESOLVABLE, nicht true)
✗  Imports aus survey-Modul
✗  Imports aus Infrastructure-Schicht (DB, HTTP, etc.)
✗  Session-State oder HTTP-Context
✗  SurveyInsight-Daten in ApprovalPolicy oder TransitionPolicy einlesen
✗  organizationId als optional behandeln
   (fehlendes organizationId → MISSING_ORGANIZATION_CONTEXT sofort)
```

#### Beispiel — KORREKT:

```typescript
// governance/policies/TransitionAuthorizationPolicy.ts
export function evaluateSubmitTransition(
  ctx: TransitionContext
): PolicyDecision {
  // 1. Tenant-Check IMMER zuerst
  if (!ctx.organizationId) {
    return deny('MISSING_ORGANIZATION_CONTEXT')
  }
  if (ctx.actor.organizationId !== ctx.entity.organizationId) {
    return deny('CROSS_TENANT_ACCESS_DENIED')
  }

  // 2. Org-Status
  if (ctx.organization.status !== 'Active') {
    return deny('ORGANIZATION_NOT_ACTIVE')
  }

  // 3. State-Check
  if (ctx.entity.approvalStatus !== ApprovalStatus.Draft) {
    return deny('INVALID_SOURCE_STATE')
  }

  // 4. Capability-Check
  if (!hasCapability(ctx.actor, 'content.submit', ctx.entity.organizationId)) {
    return deny('CAPABILITY_NOT_GRANTED')
  }

  return allow({ context: buildAuditContext(ctx) })
}
```

#### Beispiel — FALSCH:

```typescript
// VERBOTEN: Mutation in Policy
function evaluateApproval(ctx): PolicyDecision {
  entity.approvalStatus = 'Approved'  // ← VERBOTEN: Mutation
  await auditRepo.save(event)         // ← VERBOTEN: I/O in Policy
  if (!ctx.organizationId) return allow() // ← VERBOTEN: implicit allow
}
```

---

## Teil 4 — Was in Services erlaubt ist

### Service-Regeln (strikt)

Services sind **Orchestratoren**. Sie konsultieren Policies, führen aus, schreiben Audits.

#### Pflichtsequenz für jeden Service-Aufruf:

```
1.  organizationId validieren (nicht null, nicht leer)
2.  Policy konsultieren → PolicyDecision einholen
3.  Bei allowed == false: Audit-Record schreiben (AUCH bei Denial!), DomainDenial werfen
4.  Bei allowed == true: Operation ausführen
5.  Audit-Record schreiben
6.  Bei Audit-Write-Fehler: gesamte Operation rückgängig machen (kein Partial-State)
```

#### ERLAUBT in Services:

```
✓  Policy-Calls zur Autorisierung (Policy konsultieren, nicht selbst entscheiden)
✓  Entity-Zustandsänderungen NACH positivem PolicyDecision
✓  Repository-Calls (lesen + schreiben)
✓  Audit-Event-Erstellung und -Schreiben
✓  Transaktionale Operationen (alles oder nichts)
✓  Domain-Event-Emission
✓  Orchestrierung mehrerer Policies und Repositories
✓  Fehler-Propagation (DomainError für technische Fehler, DomainDenial für Auth-Denials)
```

#### VERBOTEN in Services:

```
✗  Autorisierungslogik OHNE Policy-Call ("ich weiß, dass das erlaubt ist")
✗  Direkte ApprovalStatus-Mutation ohne vorherige Policy-Evaluation
✗  Partial-State (Operation halb ausführen, dann abbrechen ohne Rollback)
✗  Survey-Modul als Trigger für irgendeine Zustandsänderung
✗  organizationId aus Session/Context ableiten ohne explizite Validierung
✗  Audit-Write überspringen wenn Operation erfolgreich war
✗  Audit-Write überspringen wenn Operation abgelehnt wurde
✗  "Skip review" für identische Kompositionen oder Wiederholungen
✗  Timeout-basiertes Auto-Approve
✗  Bulk-Approval mehrerer Entitäten in einem Service-Call
```

---

## Teil 5 — Verbotene Imports (Import Dependency Matrix)

### Absolute Import-Verbote

| Von Modul | Darf NIEMALS importieren | Begründung |
|-----------|--------------------------|------------|
| `tenant` | `governance`, `lifecycle`, `versioning`, `content`, `survey`, `release` | Tenant ist Basis-Schicht, keine Abhängigkeiten aufwärts |
| `governance/policies` | `lifecycle/services`, `versioning/services`, `release`, `survey` | Policies sind stateless, kennen keine Services |
| `survey` | `governance/policies`, `lifecycle/services`, `release/services`, `versioning/services` | Survey ist advisory-only, kein Write-Pfad in Governance |
| `content/entities` | `governance/policies`, `lifecycle/services`, `survey` | Entities haben keine Auth-Logik |
| `versioning/entities` | `governance/policies`, `lifecycle/services`, `survey` | Version-Records sind reine Daten |
| Irgendein Modul | `infrastructure/*`, `database/*`, `http/*`, `ui/*` | Domain ist infrastructure-agnostisch |
| `governance/policies` | `approval-policy.ts` (direktes Lesen von SurveyInsight-Feldern) | Survey hat zero import in Policy Layer |

### Erlaubte Import-Richtungen

```
shared/types  ◄── alle Module (nur inward)

tenant        ◄── governance (liest Org-Status)
tenant        ◄── lifecycle (liest Org-Status für Transition-Check)
tenant        ◄── content (organizationId validation)
tenant        ◄── versioning (organizationId validation)
tenant        ◄── survey (target entity org validation)
tenant        ◄── release

governance    ◄── lifecycle/services (konsultiert Policies)
governance    ◄── release/services (ReleaseAuthorizationPolicy)

versioning    ◄── lifecycle/services (Version-Erstellung)
versioning    ◄── release/services

content       ◄── lifecycle/services (Entity-Zustand ändern)
content       ◄── release/services (Entity co-release)

governance/policies → content (liest Entity-Felder für Preconditions)
governance/policies → versioning (liest versionId für stale-check)
governance/policies → tenant (liest Org-Status)
```

### Verbotene Import-Matrix (Kurzform)

```
          tenant  govern  lifecy  versio  conten  releas  survey
tenant      —      ✗       ✗       ✗       ✗       ✗       ✗
govern      ✓      —       ✗svc    ✗svc    ✓r      ✗       ✗
lifecy      ✓      ✓pol    —       ✓       ✓       ✗       ✗
versio      ✓      ✗       ✗       —       ✗       ✗       ✗
conten      ✓      ✗       ✗       ✓r      —       ✗       ✗
releas      ✓      ✓pol    ✓       ✓       ✓       —       ✗
survey      ✓      ✗       ✗       ✗       ✗r      ✗       —

✓   = Import erlaubt
✓r  = Nur read (keine Service-Calls)
✓pol= Nur Policy-Layer (kein Service-Import)
✗   = Verboten
✗svc= Service-Layer verboten (Policy-Layer-Read erlaubt)
```

---

## Teil 6 — Verbotene Abhängigkeiten

### VD-01 — Survey → Governance (absolutes Verbot)

```
// VERBOTEN:
import { ApprovalPolicy } from '../governance/policies/ApprovalPolicy'
import { TransitionAuthorizationPolicy } from '../governance/...'

// SurveyInsight darf NIEMALS:
// - Eine ApprovalPolicy lesen oder modifizieren
// - Einen Lifecycle-Transition triggern
// - Eine PolicyDecision beeinflussen
// - Ein ApprovalDecision-Record erstellen
```

**Begründung:** `governance-model-final.md` H-04: "Survey Insight module has no write access to the Governance or Content Lifecycle modules." Absolute Hard Rule.

### VD-02 — Entity → Service (absolutes Verbot)

```
// VERBOTEN:
class Algorithm {
  constructor(private readonly lifecycleService: ContentLifecycleService) {} // ← VERBOTEN
}
```

### VD-03 — Policy → Repository (absolutes Verbot)

```
// VERBOTEN:
function evaluateRelease(ctx): PolicyDecision {
  const existing = await releaseRepo.findActiveRelease(ctx.scopeId) // ← VERBOTEN
  // Policies sind synchron, kein I/O
}
// KORREKT: Repository-Daten werden im Service geholt und als Kontext übergeben
```

### VD-04 — Implicit organizationId-Ableitung (absolutes Verbot)

```
// VERBOTEN:
function createAlgorithm(title: string, actorSession: Session) {
  const orgId = actorSession.currentOrg  // ← VERBOTEN: Ableitung aus Session
  return new Algorithm({ title, organizationId: orgId })
}

// KORREKT:
function createAlgorithm(title: string, organizationId: string, actorRoleId: string) {
  // organizationId ist expliziter Parameter
  // Validierung: actorRole.organizationId === organizationId
}
```

### VD-05 — Implicit "latest" Version Reference (absolutes Verbot)

```
// VERBOTEN:
const pkg = await packageRepo.findLatest(packageId)  // ← VERBOTEN

// VERBOTEN in ContentPackage-Komposition:
{ algorithmId: 'alg-001', versionId: 'latest' }       // ← VERBOTEN
{ algorithmId: 'alg-001' }                             // ← VERBOTEN (versionId fehlt)

// KORREKT:
const pkg = await packageRepo.findByVersionId(explicitVersionId)
{ algorithmId: 'alg-001', versionId: 'ver-042' }      // ← KORREKT
```

### VD-06 — Lifecycle-Transition ohne Policy-Call (absolutes Verbot)

```
// VERBOTEN:
async function submitForReview(entityId: string, actorId: string) {
  const entity = await repo.find(entityId)
  entity.approvalStatus = 'InReview'  // ← VERBOTEN: Policy übersprungen
  await repo.save(entity)
}

// KORREKT: Policy IMMER konsultieren
async function submitForReview(cmd: SubmitCommand): Promise<void> {
  const ctx = await buildTransitionContext(cmd)
  const decision = evaluateSubmitTransition(ctx)       // Policy
  if (!decision.allowed) {
    await auditService.writeDenial(ctx, decision)
    throw new DomainDenial(decision.denyReason, decision.context)
  }
  await applyTransition(entity, 'InReview', cmd.rationale)
  await auditService.writeTransition(ctx, decision)
}
```

### VD-07 — ContentSharingPolicy Guard muss existieren

```typescript
// tenant/policies/ContentSharingPolicy.ts
// MUSS existieren und in Phase 0 immer false zurückgeben:
export function contentSharingPolicyExists(
  sourceOrgId: string,
  targetOrgId: string,
  contentId: string
): boolean {
  // Phase 0: Cross-org content sharing disabled.
  // This function is the named extension point for Phase 9.
  return false
}

// Jeder Code-Pfad, der cross-org Content-Inclusion ermöglichen würde:
if (!contentSharingPolicyExists(sourceOrg, targetOrg, contentId)) {
  throw new TenantIsolationViolation('CROSS_TENANT_COMPOSITION_ENTRY')
}
```

---

## Teil 7 — Verbotene Abkürzungen in der Autorisierung

### AA-01 — Kein "OrgAdmin kann alles"

```typescript
// VERBOTEN:
if (actor.roleType === 'OrgAdmin') {
  return allow()  // ← VERBOTEN: OrgAdmin hat package.release NICHT by default
}

// KORREKT: Capability-Check unabhängig von roleType
if (!hasCapability(actor, capability, organizationId)) {
  return deny('CAPABILITY_NOT_GRANTED')
}
```

**Begründung:** `governance-model-final.md` HC-G-09: "OrgAdmin does not hold `package.release` by default." roleType ist Intent, nicht Permission-Grant.

### AA-02 — Kein Timeout-basiertes Auto-Approve

```typescript
// VERBOTEN:
if (Date.now() > policy.reviewWindowDeadline) {
  return resolveQuorum('Approved')  // ← VERBOTEN
}

// KORREKT: Timeout triggert nur Eskalations-Notification
if (Date.now() > policy.reviewWindowDeadline) {
  await notificationService.notifyOrgAdmin(entityId, 'REVIEW_OVERDUE')
  // Entity bleibt in InReview — keine automatische Auflösung
}
```

**Begründung:** `approval-model-final.md` H-03: "Review window expiry → Timeout is advisory only; never triggers transition."

### AA-03 — Kein Quorum-Bypass durch minimumReviewers < 1

```typescript
// VERBOTEN in ApprovalPolicy-Erstellung:
if (policy.minimumReviewers < 1) {
  // silently use 1
}

// KORREKT: Policy-Validierung lehnt minimumReviewers < 1 ab
function validateApprovalPolicy(policy: ApprovalPolicy): void {
  if (policy.minimumReviewers < 1) {
    throw new DomainError('INVALID_POLICY: minimumReviewers must be >= 1')
  }
}
```

### AA-04 — Kein Package-Approval impliziert Content-Approval

```typescript
// VERBOTEN:
if (contentPackage.approvalStatus === 'Approved') {
  // assume all content is also Approved
  executeRelease(contentPackage)  // ← VERBOTEN
}

// KORREKT: Re-Validierung aller Composition-Entries zur Release-Zeit
for (const entry of composition) {
  const entity = await contentRepo.findById(entry.entityId)
  if (entity.approvalStatus !== 'Approved') {
    return deny('COMPOSITION_ENTRY_NOT_APPROVED')
  }
  if (entry.versionId !== entity.currentVersionId) {
    return deny('COMPOSITION_VERSION_STALE')
  }
}
```

**Begründung:** `content-package-model-final.md` HC-CP-05: Release-Preconditions re-validated at execution time.

### AA-05 — Kein "Gleiche Komposition = Kein Re-Approval"

```typescript
// VERBOTEN:
if (deepEqual(newVersion.composition, priorApprovedVersion.composition)) {
  newVersion.approvalStatus = 'Approved'  // ← VERBOTEN: Approval wird übertragen
}

// KORREKT: Jede ContentPackage Version braucht eigenen Approval-Cycle
// (I-10 aus content-package-model-final.md)
```

### AA-06 — Kein Cross-Tenant-Permission-Grant

```typescript
// VERBOTEN:
function hasCapability(userId: string, capability: string): boolean {
  // keine organizationId → prüft über alle Orgs
  return permissionRepo.findByUserAndCapability(userId, capability) != null
}

// KORREKT: organizationId immer required
function hasCapability(
  userId: string,
  capability: string,
  organizationId: string  // ← PFLICHT
): boolean {
  return permissionRepo.findByUserCapabilityAndOrg(userId, capability, organizationId) != null
}
```

### AA-07 — Kein SurveyInsight als Approval-Trigger

```typescript
// VERBOTEN:
surveyInsightService.on('SafetyConcern', async (insight) => {
  await lifecycleService.triggerRecall(insight.targetEntityId)  // ← VERBOTEN
})

// KORREKT: SurveyInsight ist read-only für OrgAdmin als Advisory Signal
// Ein Mensch mit content.recall muss manuell handeln
```

### AA-08 — Kein Approved → Released ohne ContentPackage

```typescript
// VERBOTEN:
async function approveAndRelease(entityId: string): Promise<void> {
  await approveContent(entityId)
  await releaseContent(entityId)  // ← VERBOTEN: kein direktes Release von Content
}

// KORREKT: Content wird nur über Released ContentPackage zu Released
// Transition Approved → Released ist AUSSCHLIESSLICH durch package.release getriggert
```

---

## Teil 8 — Standardmuster: PolicyDecision

### Typdefinition (shared/types/PolicyDecision.ts)

```typescript
export type DenyReason =
  // Tenant / Context
  | 'MISSING_ORGANIZATION_CONTEXT'
  | 'CROSS_TENANT_ACCESS_DENIED'
  | 'NO_ACTIVE_ROLE'
  | 'ORGANIZATION_NOT_ACTIVE'
  // Permission / Capability
  | 'CAPABILITY_NOT_GRANTED'
  | 'SCOPE_MISMATCH'
  | 'SEPARATION_OF_DUTY_VIOLATION'
  | 'SELF_ASSIGNMENT_PROHIBITED'
  | 'POLICY_UNRESOLVABLE'
  // State / Lifecycle
  | 'INVALID_SOURCE_STATE'
  | 'TRANSITION_NOT_PERMITTED'
  | 'ENTITY_IMMUTABLE'
  | 'VERSION_TERMINAL'
  | 'ENTITY_ALREADY_RELEASED'
  // Composition / Release
  | 'PACKAGE_NOT_APPROVED'
  | 'COMPOSITION_ENTRY_NOT_APPROVED'
  | 'COMPOSITION_VERSION_STALE'
  | 'CROSS_TENANT_COMPOSITION_ENTRY'
  | 'DEPRECATED_REFERENCE_IN_COMPOSITION'
  | 'TARGET_SCOPE_INACTIVE'
  | 'CROSS_TENANT_SCOPE_REFERENCE'
  | 'CONFLICTING_ACTIVE_RELEASE'
  | 'DEPENDENCY_HARD_BLOCK'
  | 'ROLLBACK_SOURCE_NOT_FOUND'
  // Validation
  | 'CONTENT_STRUCTURALLY_INCOMPLETE'
  | 'DEPRECATED_REFERENCE_IN_SUBMISSION'
  | 'RATIONALE_REQUIRED'
  | 'DEPRECATION_DATE_REQUIRED'
  | 'QUORUM_NOT_RESOLVED'
  // Technical / Integrity
  | 'AUDIT_WRITE_FAILURE'
  | 'DATA_INTEGRITY_VIOLATION'

export interface PolicyWarning {
  code: string
  message: string
  entityId?: string
}

export interface PolicyDecision {
  readonly allowed: boolean
  readonly denyReason?: DenyReason      // required wenn allowed === false
  readonly warnings: PolicyWarning[]    // leer wenn keine Warnings
  readonly context: Record<string, unknown>  // Evaluation-Inputs für Audit
}

// Helper-Funktionen (shared/types/PolicyDecision.ts)
export function allow(opts?: { warnings?: PolicyWarning[], context?: Record<string, unknown> }): PolicyDecision {
  return {
    allowed: true,
    warnings: opts?.warnings ?? [],
    context: opts?.context ?? {},
  }
}

export function deny(reason: DenyReason, context?: Record<string, unknown>): PolicyDecision {
  return {
    allowed: false,
    denyReason: reason,
    warnings: [],
    context: context ?? {},
  }
}
```

### Pflicht-Reihenfolge in jeder Policy-Funktion

```typescript
export function evaluateAnyTransition(ctx: PolicyContext): PolicyDecision {
  // SCHRITT 1: organizationId — IMMER ZUERST (HC-04, HC-G-05)
  if (!ctx.organizationId) {
    return deny('MISSING_ORGANIZATION_CONTEXT')
  }

  // SCHRITT 2: Cross-Tenant-Check
  if (ctx.actor.organizationId !== ctx.organizationId) {
    return deny('CROSS_TENANT_ACCESS_DENIED')
  }

  // SCHRITT 3: Aktive Rolle vorhanden?
  if (!ctx.actor.isActive()) {
    return deny('NO_ACTIVE_ROLE')
  }

  // SCHRITT 4: Org-Status
  if (ctx.organization.status !== 'Active') {
    return deny('ORGANIZATION_NOT_ACTIVE')
  }

  // SCHRITT 5: State-Check (vor Capability-Check)
  if (ctx.entity.approvalStatus !== expectedState) {
    return deny('INVALID_SOURCE_STATE')
  }

  // SCHRITT 6: Capability-Check
  if (!hasCapability(ctx.actor, requiredCapability, ctx.organizationId)) {
    return deny('CAPABILITY_NOT_GRANTED')
  }

  // SCHRITT 7: SoD-Check (wenn anwendbar)
  if (ctx.policy.requireSeparationOfDuty && ctx.actor.userId === ctx.entity.submittedBy) {
    return deny('SEPARATION_OF_DUTY_VIOLATION')
  }

  // SCHRITT 8: Domänen-spezifische Checks (strukturelle Vollständigkeit etc.)
  // ...

  // SCHRITT 9: Warnings sammeln (non-blocking)
  const warnings: PolicyWarning[] = []
  // ...

  return allow({ warnings, context: buildAuditContext(ctx) })
}
```

**Invariante:** Kein Schritt darf übersprungen werden. Kein `allowed: true` ohne alle vorherigen Checks.

---

## Teil 9 — Domain Errors vs. Denials

### Trennung der Konzepte

| Typ | Bedeutung | Implementierung | Audit-Pflicht |
|-----|-----------|-----------------|---------------|
| `DomainDenial` | Autorisierung abgelehnt — normaler Geschäftsausgang | PolicyDecision.allowed === false | Ja — Denial wird geloggt |
| `DomainError` | Technischer Fehler — unerwarteter System-Zustand | Exception | Ja — mit error context |
| `DomainViolation` | Invarianten-Verletzung — sollte nie passieren | Exception | Ja — kritisch |

### Implementierung (shared/errors/)

```typescript
// shared/errors/DomainDenial.ts
// Kein Error/Exception — ein first-class Value für Authorization Denials
export class DomainDenial {
  readonly type = 'DOMAIN_DENIAL' as const

  constructor(
    readonly denyReason: DenyReason,
    readonly context: Record<string, unknown>,
    readonly organizationId: string,
  ) {}
}

// shared/errors/DomainError.ts
// Technische Fehler — werden als Exceptions geworfen
export class DomainError extends Error {
  readonly type = 'DOMAIN_ERROR' as const

  constructor(
    readonly code: string,
    message: string,
    readonly context?: Record<string, unknown>,
  ) {
    super(message)
  }
}

// Spezifische technische Fehler:
export class AuditWriteFailure extends DomainError {
  constructor(entityId: string, operation: string) {
    super('AUDIT_WRITE_FAILURE', `Audit write failed for ${operation} on ${entityId}`)
  }
}

export class TenantIsolationViolation extends DomainError {
  constructor(message: string) {
    super('TENANT_ISOLATION_VIOLATION', message)
  }
}

export class DataIntegrityViolation extends DomainError {
  constructor(message: string) {
    super('DATA_INTEGRITY_VIOLATION', message)
  }
}
```

### Service-Pattern mit korrekter Fehlerbehandlung

```typescript
async function executeTransition(cmd: TransitionCommand): Promise<void> {
  // 1. Kontext aufbauen (inkl. alle nötigen Entity-Reads)
  const ctx = await buildTransitionContext(cmd)

  // 2. Policy evaluieren
  const decision = evaluateTransition(ctx)

  // 3. Denial: Audit schreiben, DomainDenial zurückgeben (kein throw)
  if (!decision.allowed) {
    await auditService.writePolicyDecision(ctx, decision)  // Denial wird geloggt
    return Result.fail(new DomainDenial(decision.denyReason!, decision.context, cmd.organizationId))
  }

  // 4. Transaktion: State-Änderung + Audit atomar
  try {
    await withTransaction(async () => {
      await applyTransition(ctx.entity, cmd.targetState, cmd.rationale)
      const auditEvent = buildAuditEvent(ctx, decision, cmd)
      const auditResult = await auditService.write(auditEvent)

      // 5. Audit-Failure → gesamte Transaktion abbrechen (HC aus content-lifecycle-final.md)
      if (!auditResult.success) {
        throw new AuditWriteFailure(ctx.entity.id, cmd.operation)
      }
    })
  } catch (e) {
    if (e instanceof AuditWriteFailure) {
      // Transaktion wurde zurückgerollt — State nicht verändert
      return Result.fail(e)
    }
    throw e  // Unerwartete technische Fehler propagieren
  }

  return Result.ok()
}
```

### Klassifizierungsregeln

```
Als DomainDenial behandeln:
  - Fehlende organizationId → MISSING_ORGANIZATION_CONTEXT
  - Cross-Tenant-Zugriff → CROSS_TENANT_ACCESS_DENIED
  - Fehlende Capability → CAPABILITY_NOT_GRANTED
  - Falscher Zustand für Transition → INVALID_SOURCE_STATE
  - SoD-Verletzung → SEPARATION_OF_DUTY_VIOLATION
  - Composition nicht vollständig Approved → COMPOSITION_ENTRY_NOT_APPROVED
  - Stale versionId → COMPOSITION_VERSION_STALE
  - Quorum nicht erreicht → QUORUM_NOT_RESOLVED
  (= alle erwarteten, dokumentierten Ablehungsgründe)

Als DomainError (Exception) behandeln:
  - Audit-Write schlägt fehl → AuditWriteFailure
  - organizationId-Feld fehlt auf DB-Record (sollte nie passieren) → DataIntegrityViolation
  - Lineage-Lücke entdeckt → DataIntegrityViolation
  - Orphan-Version entdeckt → DataIntegrityViolation
  - contentSharingPolicyExists() gibt unerwartet true zurück in Phase 0 → TenantIsolationViolation
  (= unerwartete, systemfehlerhafte Zustände)
```

---

## Teil 10 — Testpflichten pro Modul

### Allgemeine Testregeln

1. Alle Policy-Funktionen müssen **ohne Mocks** testbar sein (sie sind synchron + stateless).
2. Alle Tenant-Isolation-Checks (L-01 bis L-12) brauchen **dedizierte Tests**.
3. Alle Hard Constraints (HC-01 bis HC-10, HC-V-01 bis HC-V-10, HC-CP-01 bis HC-CP-10) brauchen **mindestens einen negativen Test** (Verletzung wird korrekt abgelehnt).
4. **Audit-Write-Atomizität** muss mit simuliertem Audit-Fehler getestet werden.
5. **Keine echte DB in Unit Tests** — Repository-Interfaces werden als In-Memory-Implementierungen bereitgestellt.

---

### Modul: `tenant`

#### Pflicht-Tests

| Test-ID | Beschreibung | Typ |
|---------|-------------|-----|
| T-TEN-01 | Organization.Active → alle Schreiboperationen erlaubt | Unit |
| T-TEN-02 | Organization.Suspended → neue Versions-Erstellung abgelehnt | Unit |
| T-TEN-03 | Organization.Decommissioned → alle Schreiboperationen abgelehnt | Unit |
| T-TEN-04 | Query ohne organizationId → wird abgelehnt (L-01) | Unit |
| T-TEN-05 | Cross-org Region-Referenz in Station → abgelehnt (L-04) | Unit |
| T-TEN-06 | Cross-org scopeTargetId in UserRole → abgelehnt (L-04) | Unit |
| T-TEN-07 | contentSharingPolicyExists() gibt false zurück (Phase 0) | Unit |
| T-TEN-08 | Sub-scope-Entity ohne Org-Parent → abgelehnt | Unit |
| T-TEN-09 | Region deaktiviert → bestehende Released-Packages bleiben gültig | Unit |
| T-TEN-10 | organizationId aus Session allein abgeleitet → abgelehnt (HC-09) | Unit |

---

### Modul: `governance`

#### Pflicht-Tests — OrganizationScopedAccessPolicy

| Test-ID | Beschreibung | Typ |
|---------|-------------|-----|
| T-GOV-01 | Fehlende organizationId → MISSING_ORGANIZATION_CONTEXT | Unit |
| T-GOV-02 | actor.orgId ≠ entity.orgId → CROSS_TENANT_ACCESS_DENIED | Unit |
| T-GOV-03 | Kein aktives UserRole → NO_ACTIVE_ROLE | Unit |
| T-GOV-04 | Capability fehlt → CAPABILITY_NOT_GRANTED | Unit |
| T-GOV-05 | OrgAdmin versucht eigene Rolle zuzuweisen → SELF_ASSIGNMENT_PROHIBITED | Unit |

#### Pflicht-Tests — TransitionAuthorizationPolicy

| Test-ID | Beschreibung | Typ |
|---------|-------------|-----|
| T-GOV-10 | Author versucht own Content zu approven → SEPARATION_OF_DUTY_VIOLATION | Unit |
| T-GOV-11 | Approver versucht selbst zu releasen → SEPARATION_OF_DUTY_VIOLATION | Unit |
| T-GOV-12 | ContentAuthor ohne content.approve versucht Approval → CAPABILITY_NOT_GRANTED | Unit |
| T-GOV-13 | Reviewer aus anderer Org → CROSS_TENANT_ACCESS_DENIED (L-07) | Unit |
| T-GOV-14 | UserRole ist abgelaufen (expiresAt in Vergangenheit) → NO_ACTIVE_ROLE | Unit |
| T-GOV-15 | Widersprüchliche Policies → höhere Priority gewinnt | Unit |

#### Pflicht-Tests — Permission-Evaluation

| Test-ID | Beschreibung | Typ |
|---------|-------------|-----|
| T-GOV-20 | evaluatePermission ohne organizationId → Exception (nicht false) | Unit |
| T-GOV-21 | OrgAdmin hat package.release NICHT by default (HC-G-09) | Unit |
| T-GOV-22 | User mit mehreren Rollen: Union der Capabilities | Unit |
| T-GOV-23 | Released-Artifact: kein Capability erlaubt Modifikation | Unit |

---

### Modul: `lifecycle`

#### Pflicht-Tests — Transition-Preconditions

| Test-ID | Beschreibung | Typ |
|---------|-------------|-----|
| T-LC-01 | Draft → InReview: structural completeness fehlt → CONTENT_STRUCTURALLY_INCOMPLETE | Unit |
| T-LC-02 | Draft → InReview: Deprecated-Referenz im Content → abgelehnt | Unit |
| T-LC-03 | InReview → Approved: Quorum nicht erreicht → QUORUM_NOT_RESOLVED | Unit |
| T-LC-04 | Approved → Released: direkt ohne ContentPackage → verboten | Unit |
| T-LC-05 | Released → Draft: abgelehnt (ENTITY_IMMUTABLE) | Unit |
| T-LC-06 | Rejected → jede Transition: abgelehnt (VERSION_TERMINAL) | Unit |
| T-LC-07 | Deprecated → jede Transition: abgelehnt (VERSION_TERMINAL) | Unit |
| T-LC-08 | Recall (Approved → InReview): bereits Released → abgelehnt | Unit |
| T-LC-09 | Org.Suspended mid-Workflow: neue Submissions abgelehnt, InReview bleibt offen | Unit |
| T-LC-10 | Audit-Write-Fehler → Transition wird nicht ausgeführt (EC-12) | Unit |
| T-LC-11 | Survey SafetyConcern → triggert KEINE automatische Transition | Unit |
| T-LC-12 | Rejection ist normaler Outcome, kein Error | Unit |

#### Pflicht-Tests — ContentPackage-Lifecycle

| Test-ID | Beschreibung | Typ |
|---------|-------------|-----|
| T-LC-20 | Release-Checklist: alle 10 Punkte werden geprüft (T4-Preconditions) | Integration |
| T-LC-21 | EC-01: Content recalled nach Package-Approval → Release blockiert | Integration |
| T-LC-22 | EC-09: Doppelter Release für gleichen Scope → abgelehnt | Integration |
| T-LC-23 | EC-10: Version-Snapshot-Write schlägt fehl → keine Released-State | Integration |
| T-LC-24 | EC-12: Partial Audit-Failure bei Multi-Entity Co-Release → vollständiger Rollback | Integration |

---

### Modul: `versioning`

#### Pflicht-Tests

| Test-ID | Beschreibung | Typ |
|---------|-------------|-----|
| T-VER-01 | Version nach Write ist vollständig immutable | Unit |
| T-VER-02 | versionNumber ist monoton steigend, keine Lücken | Unit |
| T-VER-03 | predecessorVersionId muss in gleicher Org + gleicher Entity existieren (L-09) | Unit |
| T-VER-04 | changeReason fehlt bei v2+ → abgelehnt (HC-V-06) | Unit |
| T-VER-05 | Parallel Draft Forks: zweites Draft beim Entity in InReview → abgelehnt (HC-V-07) | Unit |
| T-VER-06 | Released-Version Deletion → abgelehnt (HC-V-08) | Unit |
| T-VER-07 | Rollback: neue Release-Record, kein Modify auf existierender (HC-V-09) | Unit |
| T-VER-08 | lineageState: additive States (Released+Superseded gleichzeitig möglich) | Unit |
| T-VER-09 | Stale ApprovalDecision nach neuer Version → nicht in Quorum gezählt | Unit |
| T-VER-10 | compositionSnapshot ist vollständige Kopie, kein Referenz (HC-V-10) | Unit |
| T-VER-11 | cross-org predecessorVersionId → abgelehnt (HC-V-03) | Unit |
| T-VER-12 | Rollback zu Version mit Deprecated Content → abgelehnt | Unit |

---

### Modul: `content`

#### Pflicht-Tests — Entity-Invarianten

| Test-ID | Beschreibung | Typ |
|---------|-------------|-----|
| T-CON-01 | Algorithm: decisionLogic mit dangling branch → submit abgelehnt | Unit |
| T-CON-02 | Medication: kein Route/Dose in dosageGuidelines → submit abgelehnt | Unit |
| T-CON-03 | Protocol: regulatoryBasis fehlt → submit abgelehnt | Unit |
| T-CON-04 | Guideline: evidenceBasis fehlt → submit abgelehnt | Unit |
| T-CON-05 | Algorithm referenziert Medication aus anderer Org (L-03) → abgelehnt | Unit |
| T-CON-06 | Released Entity: kein Feld änderbar | Unit |

#### Pflicht-Tests — ContentPackage-Composition

| Test-ID | Beschreibung | Typ |
|---------|-------------|-----|
| T-CON-10 | Duplicate entityId in Komposition → abgelehnt (HC-CP-03) | Unit |
| T-CON-11 | versionId fehlt in Komposition-Entry → abgelehnt (HC-CP-02) | Unit |
| T-CON-12 | Cross-org Content in Komposition → abgelehnt (HC-CP-04, L-02) | Unit |
| T-CON-13 | Komposition ist auf Version gespeichert, nicht auf Entity (HC-CP-01) | Unit |
| T-CON-14 | Leere Komposition → submit abgelehnt | Unit |
| T-CON-15 | Scope entry aus anderer Org → abgelehnt (I-08) | Unit |
| T-CON-16 | Identische Komposition → kein Approval-Transfer (I-10, HC-CP-10) | Unit |

---

### Modul: `survey`

#### Pflicht-Tests

| Test-ID | Beschreibung | Typ |
|---------|-------------|-----|
| T-SUR-01 | SurveyInsight.submit: keine Transition auf Content | Unit |
| T-SUR-02 | SurveyInsight: targetEntityId aus anderer Org → abgelehnt (L-08) | Unit |
| T-SUR-03 | SurveyInsight: targetRegionId aus anderer Org → abgelehnt (L-08) | Unit |
| T-SUR-04 | SurveyInsight: status Pending → Actioned ohne resolution → abgelehnt | Unit |
| T-SUR-05 | SurveyInsight importiert NICHTS aus governance/policies | Static (import check) |
| T-SUR-06 | SurveyInsight importiert NICHTS aus lifecycle/services | Static (import check) |
| T-SUR-07 | SafetyConcern insight → kein automatisches recall/review auf Content-Entity | Integration |

---

### Cross-Cutting: Audit-Tests

| Test-ID | Beschreibung | Typ |
|---------|-------------|-----|
| T-AUD-01 | Jede Transition schreibt Audit-Record mit allen Pflichtfeldern | Integration |
| T-AUD-02 | Denial-Entscheidungen werden geloggt (nicht nur Approvals) | Integration |
| T-AUD-03 | Audit-Record ohne organizationId → wird abgelehnt (L-11) | Unit |
| T-AUD-04 | Audit-Records sind append-only, nicht modifizierbar | Unit |
| T-AUD-05 | Audit-Write-Fehler → Operation wird nicht persistiert | Integration |
| T-AUD-06 | QuorumResolution-Record: lifecycleExecuted: false wenn Lifecycle-Precondition scheitert | Integration |

---

### Cross-Cutting: Tenant-Isolation-Smoke-Tests

Diese Tests bilden die vollständige L-01 bis L-12-Matrix aus `tenant-model.md` ab.

```typescript
describe('Tenant Isolation — Complete Leak Vector Coverage', () => {
  it('L-01: Query ohne organizationId wird abgelehnt')
  it('L-02: Cross-org Content in ContentPackage wird abgelehnt')
  it('L-03: Cross-org Algorithm→Medication-Referenz wird abgelehnt')
  it('L-04: Cross-org scopeTargetId in UserRole wird abgelehnt')
  it('L-05: Cross-org targetScope in ContentPackage wird abgelehnt')
  it('L-06: Cross-org createdBy in Version wird abgelehnt')
  it('L-07: Cross-org ApprovalDecision-Reviewer wird abgelehnt')
  it('L-08: Cross-org SurveyInsight-Target wird abgelehnt')
  it('L-09: Cross-org predecessorVersionId wird abgelehnt')
  it('L-10: Permission-Evaluation ohne organizationId wirft DomainError')
  it('L-11: Audit-Event ohne organizationId wird abgelehnt')
  it('L-12: contentSharingPolicyExists() gibt in Phase 0 immer false zurück')
})
```

---

## Anhang A — Kurzreferenz: Hard Constraints

Alle folgenden Hard Constraints müssen durch Implementation und Test abgedeckt sein:

| ID | Quelle | Regel (Kurzform) |
|----|--------|-----------------|
| HC-01 | tenant-model | organizationId mandatory on every read |
| HC-02 | tenant-model | organizationId mandatory on every write |
| HC-03 | tenant-model | All intra-entity references must be same-org |
| HC-04 | tenant-model | Permission evaluation requires organizationId |
| HC-05 | tenant-model | Released artifacts immutable regardless of org context |
| HC-06 | tenant-model | Sub-scope entities carry no independent authority |
| HC-07 | tenant-model | Shared content extension disabled (Phase 0 guard must exist) |
| HC-08 | tenant-model | Audit events must carry organizationId |
| HC-09 | tenant-model | No implicit tenant derivation |
| HC-10 | tenant-model | Rollback does not relax tenant constraints |
| HC-G-01 | governance | Entities carry no auth logic |
| HC-G-02 | governance | PolicyDecision is the only return type |
| HC-G-03 | governance | allowed: false is never an exception |
| HC-G-04 | governance | No implicit allow fallback |
| HC-G-05 | governance | organizationId is first check in every policy |
| HC-G-06 | governance | SoD evaluated at operation level, not role level |
| HC-G-07 | governance | Every decision audited (allow AND deny) |
| HC-G-08 | governance | Survey module has no import into Policy layer |
| HC-G-09 | governance | OrgAdmin does not hold package.release by default |
| HC-G-10 | governance | Re-evaluation at execution time (not at approval time) |
| HC-V-01 | versioning | Version records are write-once |
| HC-V-02 | versioning | organizationId immutable, validated at write |
| HC-V-03 | versioning | predecessorVersionId resolves within same entity |
| HC-V-04 | versioning | versionNumber monotonically increasing |
| HC-V-05 | versioning | No implicit latest references |
| HC-V-06 | versioning | changeReason required from v2 onward |
| HC-V-07 | versioning | Parallel Draft forks blocked |
| HC-V-08 | versioning | Released Version deletion prohibited |
| HC-V-09 | versioning | Rollback is a new Release record |
| HC-V-10 | versioning | compositionSnapshot written at Release |
| HC-CP-01 | content-package | Composition stored on Version, not on entity |
| HC-CP-02 | content-package | Every entry requires entityId + versionId |
| HC-CP-03 | content-package | No duplicate entityId within type |
| HC-CP-04 | content-package | All entries cross-checked against Organization at write |
| HC-CP-05 | content-package | Release preconditions re-validated at execution |
| HC-CP-06 | content-package | currentVersionId matching required at release |
| HC-CP-07 | content-package | HardBlock dependencies evaluated at release |
| HC-CP-08 | content-package | Released package fully immutable |
| HC-CP-09 | content-package | compositionSnapshot self-contained on Release record |
| HC-CP-10 | content-package | No implicit re-approval for identical composition |

---

## Anhang B — Merge-Checklist für jeden Domain-PR

Vor jedem Merge in `packages/domain/src/` müssen folgende Punkte erfüllt sein:

```
□ Kein Entity-Code importiert aus governance/policies, lifecycle/services, survey
□ Kein Policy-Code enthält State-Mutationen oder async I/O
□ Kein Service führt Transition aus ohne vorherigen Policy-Call
□ Kein Service schreibt ApprovalStatus direkt (nur über Lifecycle-Service)
□ organizationId ist Pflichtparameter in jedem Service-Aufruf
□ evaluatePermission() hat organizationId als Required Parameter
□ contentSharingPolicyExists() existiert und gibt false zurück (Phase 0)
□ Alle neuen Policies haben Test für MISSING_ORGANIZATION_CONTEXT als ersten Check
□ Alle neuen Services haben Test für Audit-Write-Failure → Operation abgebrochen
□ Kein "versionId: 'latest'" in ContentPackage-Composition-Code
□ Kein Auto-Approve durch Timeout, Bulk-Operation oder OrgAdmin-Shortcut
□ Kein Survey-Import in governance/policies oder lifecycle
□ Approved → Released ausschließlich über package.release-Pfad
□ Alle Lease-Preconditions re-validieren zur Ausführungszeit (nicht zum Approval-Zeitpunkt)
```
