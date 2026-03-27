# Audit System Blueprint — MVP (Basis)

**Stand:** 27. März 2026
**Authority:** docs/planning/MVP_SCOPE_LOCK.md §7, docs/context/GLOBAL_PROJECT_SNAPSHOT.md
**Status:** BLUEPRINT — bereit für Codex-Implementierung

---

## 1. Architektur-Übersicht

Das Audit System ist ein passiver Domain-Observer.
Es empfängt Domain-Events, schreibt sie als unveränderliche Einträge, und stellt sie zum Lesen bereit.

```
Domain Layer
  │
  ├─ Lifecycle Transitions  ──► LifecycleAuditEvent
  ├─ Policy Decisions        ──► PolicyDecisionAuditEvent
  ├─ Version Creation        ──► VersionCreationAuditEvent
  └─ Release Actions         ──► ReleaseAuditEvent
                                       │
                                       ▼
                              IAuditWriter (Port)
                                       │
                              [Append-Only Store]
                                       │
                              IAuditReader (Port)
                                       │
                              Read Model (AuditLogEntry[])
```

### Positionierung im Domain-Modell

- Audit ist ein eigenständiges Modul unter `packages/domain/src/audit/`.
- Audit hat keine Abhängigkeit zu Lifecycle-, Governance- oder Release-Modulen.
- Alle anderen Module können AuditEvent-Typen aus `shared/audit` importieren.
- Audit importiert niemals aus `lifecycle`, `governance`, `release` oder `content`.
- Audit ist das einzige Modul, das `IAuditWriter` und `IAuditReader` definiert.

---

## 2. Audit Event Modell

### 2.1 Basisstruktur — AuditEvent (bestehend, erweiterbar)

Aktuell implementiert in `packages/domain/src/shared/audit/AuditEvent.ts`.

```typescript
interface AuditEvent {
  readonly id: string;                    // Eindeutige Event-ID (UUID)
  readonly organizationId: OrgId;         // Tenant-Kontext — verpflichtend
  readonly timestamp: string;             // ISO 8601, UTC
  readonly actorUserId: UserId;           // Handelnder User
  readonly actorRoleId: UserRoleId;       // Rolle des Akteurs im Org-Kontext
  readonly operation: AuditOperation;    // Operationstyp (enum)
}
```

**Offene Lücke:** Das MVP-Scope-Lock verlangt zusätzlich auf Event-Ebene:

| Feld | Typ | Pflicht | Anmerkung |
|------|-----|---------|-----------|
| `eventType` | string (discriminant) | ja | Unterscheidet Event-Subtypen beim Lesen |
| `targetEntityType` | string | ja | Typ der betroffenen Entität |
| `targetEntityId` | string | ja | ID der betroffenen Entität |
| `beforeState` | unknown \| null | nein | Zustand vor der Operation |
| `afterState` | unknown \| null | nein | Zustand nach der Operation |
| `rationale` | string \| null | nein | Begründung (optional für nicht-Approval-Events) |
| `metadata` | Record<string, unknown> | nein | Erweiterungspunkte ohne Schemaänderung |

Diese Felder sind in den bestehenden Subtypen bereits teilweise vorhanden:
- `LifecycleAuditEvent`: `fromState` / `toState` (entspricht beforeState/afterState für Lifecycle)
- `PolicyDecisionAuditEvent`: `targetEntityId` / `targetEntityType`
- Fehlend: `eventType` als diskriminierendes Feld auf Basis-Level

**Empfehlung:** `eventType` als Pflichtfeld in `AuditEvent` aufnehmen. Alle bestehenden Subtypen setzen `eventType` als Literal-Typ.

---

### 2.2 Subtypen (bestehend + vollständig)

#### LifecycleAuditEvent
Datei: `packages/domain/src/shared/audit/LifecycleAuditEvent.ts`

```typescript
interface LifecycleAuditEvent extends AuditEvent {
  readonly eventType: 'lifecycle';
  readonly entityId: string;             // = targetEntityId
  readonly entityType: string;           // = targetEntityType (Algorithm|Medication|Protocol|Guideline|ContentPackage)
  readonly versionId: VersionId;
  readonly fromState: string;            // = beforeState (ApprovalStatus)
  readonly toState: string;              // = afterState (ApprovalStatus)
  readonly capability: string;           // welche Capability den Übergang autorisiert hat
  readonly rationale: string;            // Pflicht bei Lifecycle-Übergängen
  readonly metadata?: Readonly<Record<string, unknown>>;
}
```

**Abdeckung:** Submit, Approve, Reject, Recall, Deprecate

---

#### PolicyDecisionAuditEvent
Datei: `packages/domain/src/shared/audit/PolicyDecisionAuditEvent.ts`

```typescript
interface PolicyDecisionAuditEvent extends AuditEvent {
  readonly eventType: 'policy_decision';
  readonly policyType: string;
  readonly targetEntityId: string;
  readonly targetEntityType: string;
  readonly capability: string;
  readonly decision: boolean;            // allowed: true | false
  readonly denyReason?: DenyReason;
  readonly warnings: readonly PolicyWarning[];
  readonly evaluationInputs: Readonly<Record<string, unknown>>;
}
```

**Abdeckung:** Jede Policy-Auswertung (Approve-Check, Release-Check, Deprecation-Check)

---

#### VersionCreationAuditEvent
Datei: `packages/domain/src/shared/audit/VersionCreationAuditEvent.ts`

```typescript
interface VersionCreationAuditEvent extends AuditEvent {
  readonly eventType: 'version_creation';
  readonly versionId: VersionId;
  readonly entityId: string;
  readonly entityType: string;
  readonly versionNumber: number;
  readonly predecessorVersionId?: VersionId;
  readonly changeReason?: string;
  readonly snapshot: Readonly<Record<string, unknown>>;
}
```

**Abdeckung:** Jede neue Version eines Content-Entitäts oder ContentPackage

---

#### ReleaseAuditEvent
Datei: `packages/domain/src/shared/audit/ReleaseAuditEvent.ts`

```typescript
interface ReleaseAuditEvent extends AuditEvent {
  readonly eventType: 'release';
  readonly releaseVersionId: VersionId;
  readonly packageVersionId: VersionId;
  readonly packageId: ContentPackageId;
  readonly releasedBy: UserRoleId;
  readonly releasedAt: string;
  readonly targetScope: Readonly<Record<string, unknown>>;
  readonly applicabilityScopes?: readonly Readonly<Record<string, unknown>>[];
  readonly excludedScopes?: readonly Readonly<Record<string, unknown>>[];
  readonly releaseType: string;
  readonly compositionSnapshot: readonly Readonly<Record<string, unknown>>[];
  readonly dependencyWarnings?: readonly PolicyWarning[];
  readonly supersededReleaseId?: VersionId;
  readonly rollbackSourceVersionId?: VersionId;
}
```

**Abdeckung:** Release, Rollback

---

### 2.3 Fehlender Subtyp — ContentDraftCreatedAuditEvent

Der initiale Draft-Zustand hat keinen Lifecycle-Übergang (kein `fromState`), wird aber dennoch auditiert.

```typescript
interface ContentDraftCreatedAuditEvent extends AuditEvent {
  readonly eventType: 'content_draft_created';
  readonly entityId: string;
  readonly entityType: string;            // Algorithm | Medication | Protocol | Guideline
  readonly versionId: VersionId;
  readonly organizationId: OrgId;
  readonly initialSnapshot: Readonly<Record<string, unknown>>;
  readonly rationale?: string;
}
```

**Hinweis:** Dieser Subtyp ist neu — fehlt im bestehenden Code und muss ergänzt werden.

---

## 3. Append-Only und Read-Model Regeln

### 3.1 Append-Only Invarianten

```
REGEL A1: AuditEvents werden niemals mutiert.
REGEL A2: AuditEvents werden niemals gelöscht.
REGEL A3: Es gibt keine Update-Operation auf AuditEvents.
REGEL A4: Jeder AuditEvent erhält bei Erstellung eine eindeutige ID.
REGEL A5: Timestamp wird beim Schreiben gesetzt — nie vom Aufrufer übergeben.
REGEL A6: AuditWriteFailure ist ein kritischer Domain-Error (nicht ignorierbar).
```

`AuditWriteFailure` ist bereits definiert in:
`packages/domain/src/shared/errors/AuditWriteFailure.ts`

---

### 3.2 Port-Interfaces (noch nicht implementiert)

```typescript
// Schreib-Port — wird von Domain-Operationen aufgerufen
interface IAuditWriter {
  record(event: AuditEvent): Promise<void>;
}

// Lese-Port — wird von Queries aufgerufen
interface IAuditReader {
  findByOrganization(
    organizationId: OrgId,
    options?: AuditQueryOptions
  ): Promise<readonly AuditLogEntry[]>;

  findByEntity(
    organizationId: OrgId,
    entityType: string,
    entityId: string
  ): Promise<readonly AuditLogEntry[]>;

  findByActor(
    organizationId: OrgId,
    actorUserId: UserId
  ): Promise<readonly AuditLogEntry[]>;
}

interface AuditQueryOptions {
  readonly from?: string;      // ISO 8601
  readonly to?: string;        // ISO 8601
  readonly eventType?: string;
  readonly operation?: AuditOperation;
  readonly limit?: number;
  readonly offset?: number;
}
```

---

### 3.3 Read-Model — AuditLogEntry

```typescript
interface AuditLogEntry {
  readonly id: string;
  readonly organizationId: OrgId;
  readonly eventType: string;
  readonly operation: AuditOperation;
  readonly actorUserId: UserId;
  readonly actorRoleId: UserRoleId;
  readonly targetEntityType: string | null;
  readonly targetEntityId: string | null;
  readonly beforeState: unknown;
  readonly afterState: unknown;
  readonly timestamp: string;             // ISO 8601, UTC
  readonly rationale: string | null;
  readonly metadata: Readonly<Record<string, unknown>>;
}
```

Das Read-Model ist eine Projektion — kein direkter Zugriff auf interne Event-Subtypen.

---

### 3.4 Tenant-Isolation im Audit

```
REGEL T1: Jede Audit-Query enthält zwingend organizationId.
REGEL T2: IAuditReader gibt ausschließlich Einträge zurück, deren organizationId mit der Query übereinstimmt.
REGEL T3: Cross-Tenant-Audit-Zugriff ist verboten. TenantIsolationViolation wird geworfen.
REGEL T4: organizationId wird beim Schreiben aus dem Domain-Kontext gesetzt — nicht vom Aufrufer überschreibbar.
```

`TenantIsolationViolation` ist bereits definiert in:
`packages/domain/src/shared/errors/TenantIsolationViolation.ts`

---

## 4. Relevante Domain-Events im MVP

| # | EventType | AuditEvent-Subtyp | Operation | Trigger |
|---|-----------|-------------------|-----------|---------|
| 1 | `content_draft_created` | ContentDraftCreatedAuditEvent | CreateVersion | Neues Draft-Dokument angelegt |
| 2 | `lifecycle` | LifecycleAuditEvent | Submit | Draft → InReview |
| 3 | `lifecycle` | LifecycleAuditEvent | Approve | InReview → Approved |
| 4 | `lifecycle` | LifecycleAuditEvent | Reject | InReview → Rejected |
| 5 | `lifecycle` | LifecycleAuditEvent | Recall | InReview → Draft |
| 6 | `lifecycle` | LifecycleAuditEvent | Deprecate | Released → Deprecated |
| 7 | `version_creation` | VersionCreationAuditEvent | CreateVersion | Neue Version eines Content-Entitäts |
| 8 | `version_creation` | VersionCreationAuditEvent | CreateVersion | Neue Version eines ContentPackage |
| 9 | `policy_decision` | PolicyDecisionAuditEvent | Approve | Approval-Policy ausgewertet (Allow/Deny) |
| 10 | `policy_decision` | PolicyDecisionAuditEvent | Release | Release-Autorisierung ausgewertet |
| 11 | `policy_decision` | PolicyDecisionAuditEvent | Deprecate | Deprecation-Autorisierung ausgewertet |
| 12 | `release` | ReleaseAuditEvent | Release | ContentPackage als Release publiziert |
| 13 | `release` | ReleaseAuditEvent | Rollback | Neuer Release auf älterem Version-Set |
| 14 | `lifecycle` | LifecycleAuditEvent | Assign | UserRole zugewiesen |
| 15 | `lifecycle` | LifecycleAuditEvent | Revoke | UserRole entzogen |

### Nicht im MVP auditiert (explizit ausgeschlossen)

| System | Begründung |
|--------|------------|
| SurveyInsight-Speicherung | Kein Governance-Event; kein Lifecycle-Einfluss |
| Organization-Onboarding | Manuell im MVP; kein automatisierbares Event |
| Auth / Login / Session | Auth-System ist Post-MVP |
| Content-Lese-Zugriffe | Kein Schreibvorgang; Audit-Log ist kein Access-Log |

---

## 5. Hard Constraints für die Implementierung

### HC-1: Audit darf keine Lifecycle-Übergänge auslösen
Audit ist passiver Empfänger. Es führt keine State-Mutations durch.
Kein Code in `audit/` darf `ApprovalStatus` ändern oder Lifecycle-Methoden aufrufen.

### HC-2: Audit darf keine Governance-Entscheidungen ersetzen
Audit protokolliert Entscheidungen — trifft sie nicht.
Kein Audit-Eintrag ist Voraussetzung für Approval oder Release.
Audit ist Protokoll, nicht Gate.

### HC-3: Append-only ist eine Domain-Invariante
Das Interface `IAuditWriter` darf keine `update()` oder `delete()` Methoden definieren.
Jede Infrastruktur-Implementierung muss append-only erzwingen.

### HC-4: Tenant-Isolation ist nicht optional
`organizationId` ist Pflichtfeld auf jedem Event.
Kein `IAuditReader`-Aufruf ohne `organizationId`.
Ein fehlender Tenant-Kontext wirft `TenantIsolationViolation` — kein Fallback.

### HC-5: Keine UI-Logik im Audit-Modul
`audit/` enthält ausschließlich Interfaces, Typen und Port-Definitionen.
Keine Formatierungslogik, keine Präsentation, keine HTTP-spezifischen Typen.

### HC-6: Keine Backend-Stack-Annahmen
`IAuditWriter` und `IAuditReader` sind Ports.
Implementierungen (SQL, Event-Store, In-Memory für Tests) liegen außerhalb von `packages/domain/`.

### HC-7: Timestamp wird vom System gesetzt
Der aufrufende Code übergibt keinen Timestamp.
`IAuditWriter` setzt `timestamp` beim Schreiben (UTC, ISO 8601).

### HC-8: AuditWriteFailure ist nicht ignorierbar
Wenn `IAuditWriter.record()` fehlschlägt, ist die Domain-Operation als fehlgeschlagen zu behandeln.
Kein silent catch. Kein retry ohne explizite Implementierungsregel.

### HC-9: Audit-Modul hat keine ausgehenden Domain-Abhängigkeiten
`packages/domain/src/audit/` importiert ausschließlich aus `shared/`.
Keine Imports aus `lifecycle/`, `governance/`, `release/`, `content/`, `versioning/`, `tenant/`, `lookup/`.

### HC-10: Read-Model ist eine Projektion — kein direkter Event-Zugriff
Abfragen liefern `AuditLogEntry[]`, nicht rohe `AuditEvent`-Subtypen.
Die Projektion normalisiert alle Felder auf das gemeinsame Read-Model.

---

## 6. Modulverzeichnis und Implementierungs-Zielstruktur

```
packages/domain/src/
├── shared/
│   └── audit/
│       ├── AuditEvent.ts                   ← bestehend (eventType fehlt noch)
│       ├── AuditOperation.ts               ← bestehend (vollständig)
│       ├── LifecycleAuditEvent.ts          ← bestehend
│       ├── PolicyDecisionAuditEvent.ts     ← bestehend
│       ├── ReleaseAuditEvent.ts            ← bestehend
│       ├── VersionCreationAuditEvent.ts    ← bestehend
│       ├── ContentDraftCreatedAuditEvent.ts ← NEU
│       └── index.ts                        ← erweiterbar
│
└── audit/                                  ← NEU (Modul)
    ├── ports/
    │   ├── IAuditWriter.ts                 ← NEU
    │   ├── IAuditReader.ts                 ← NEU
    │   └── index.ts
    ├── model/
    │   ├── AuditLogEntry.ts               ← NEU (Read-Model)
    │   ├── AuditQueryOptions.ts           ← NEU
    │   └── index.ts
    └── index.ts
```

---

## 7. Beziehung zu bestehenden Fehlern

Bereits implementiert in `packages/domain/src/shared/errors/`:

| Fehlertyp | Relevanz für Audit |
|-----------|-------------------|
| `AuditWriteFailure` | Wird geworfen wenn `IAuditWriter.record()` scheitert |
| `TenantIsolationViolation` | Wird geworfen bei Cross-Tenant-Audit-Zugriff |
| `DomainError` | Basisklasse für alle Fehler |

---

## 8. MVP Exit-Kriterium (aus MVP_SCOPE_LOCK.md §7)

> Nach einem Lifecycle-Übergang ist der Audit-Log-Eintrag vorhanden und lesbar.

Verifizierbar durch:

```
1. Content-Entität wird von Draft nach InReview submitted.
2. IAuditWriter.record() wird mit LifecycleAuditEvent aufgerufen.
3. IAuditReader.findByEntity(orgId, entityType, entityId) gibt den Eintrag zurück.
4. Eintrag enthält: organizationId, actorUserId, fromState='Draft', toState='InReview', timestamp.
```

Ein Test gegen eine In-Memory-Implementierung von `IAuditWriter`/`IAuditReader` ist ausreichend für den MVP.

---

## Referenzen

| Quelle | Inhalt |
|--------|--------|
| `docs/planning/MVP_SCOPE_LOCK.md §7` | Pflichtbestandteil Audit System |
| `docs/context/GLOBAL_PROJECT_SNAPSHOT.md` | Domain-Modell, Tenant-Regeln |
| `packages/domain/src/shared/audit/` | Bestehende Event-Typen |
| `packages/domain/src/shared/errors/` | AuditWriteFailure, TenantIsolationViolation |
| `docs/architecture/governance-model-final.md` | Governance-Entitäten (keine Audit-Abhängigkeit) |
| `docs/architecture/content-lifecycle-final.md` | Lifecycle-Zustände (Quelle für fromState/toState) |
