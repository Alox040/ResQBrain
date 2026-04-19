# Domain Baseline Blueprint — ResQBrain

**Status:** Canonical — Implementierungsgrundlage
**Datum:** 2026-03-24
**Quellen:** domain-model.md, content-model.md, versioning-model.md, multi-tenant-model.md, module-boundaries.md, terminology-mapping.md, content-lifecycle-baseline-v2.md, 04-mvp-scope.md, 09-survey-integration-plan.md, 10-platform-principles.md
**Zweck:** Vollständiger Architektur-Blueprint für deterministische Code-Erstellung der Domain-Baseline

---

## 1. Ziel der Domain-Baseline

Die Domain-Baseline definiert alle Entitäten, Invarianten und Modulgrenzen, die notwendig sind, damit ein Content-Item den vollständigen Lifecycle (Draft → InReview → Approved → Released → Deprecated) durchlaufen kann — scoped zu einer Organization, kontrolliert durch UserRole und Permission, reproduzierbar durch Version und Release.

**Exit-Kriterien der Baseline:**

- Jede Entität trägt Organization-Scope (INV-04)
- Ein Content-Item kann von Draft bis Released unter Role/Permission-Kontrolle geführt werden
- Releases sind reproduzierbar und immutable (INV-01, INV-05)
- SurveyInsight ist strukturell vorhanden und strikt von Governance getrennt
- Keine Cross-Tenant-Referenzen möglich
- Keine UI-, Framework- oder Infrastruktur-Logik im Domain-Layer

---

## 2. Modulstruktur

```
packages/domain/
├── models/
│   ├── organization.ts         — Tenant-Boundary-Entität
│   ├── region.ts               — Sub-Scope innerhalb Organization
│   ├── county.ts               — Sub-Scope unterhalb Region
│   ├── station.ts              — Operationale Einheit
│   ├── content-entity.ts       — ContentEntityLine + ContentEntityVersion
│   ├── content-package.ts      — ContentPackageLine + ContentPackageVersion + ContentPackageMemberRef
│   ├── release-record.ts       — Immutabler Publikationsakt
│   ├── approval-status.ts      — Enums: ApprovalStatus, ContentEntityVersionStatus
│   ├── user-role.ts            — UserRole + Permission
│   ├── survey-insight.ts       — SurveyInsight (advisory only)
│   └── value-objects.ts        — ContentKind, InsightType, shared VOs
├── lifecycle/
│   ├── content-entity-transitions.ts     — CE-1 bis CE-6
│   ├── content-package-transitions.ts    — CP-1 bis CP-6
│   └── release-service.ts               — ReleaseRecord-Erstellung und Rollback
├── governance/
│   ├── permission-checker.ts   — Atomic Permission-Evaluation pro Role+Organization
│   └── role-resolver.ts        — UserRole-Auflösung im Organization-Scope
├── tenant/
│   ├── organization-scope.ts   — Scope-Enforcement, Cross-Tenant-Guard
│   └── scope-hierarchy.ts      — Organization → Region → County → Station
└── ports/
    ├── content-repository.port.ts
    ├── package-repository.port.ts
    ├── release-repository.port.ts
    └── survey-insight-repository.port.ts
```

**Regeln zur Verzeichnisstruktur:**

- `models/` enthält ausschließlich Entitätsdefinitionen und Value Objects — keine Logik
- `lifecycle/` enthält Domain Services für Statusübergänge — keine Infrastruktur
- `governance/` enthält Permission-Evaluation — kein UI-Zustand
- `tenant/` enthält Scope-Enforcement — kein HTTP-Context
- `ports/` enthält ausschließlich Interfaces (keine Implementierungen)

---

## 3. Entitäten

---

### 3.1 Organization

**Zweck:** Primäre Tenant-Boundary. Jede Governance-, Content- und Release-Operation ist an eine Organization gebunden.

**Pflichtfelder:**
```
id           : string       — stabiler, eindeutiger Bezeichner
name         : string       — Anzeigename
slug         : string       — URL-sicherer Kurzname; eindeutig plattformweit
createdAt    : string       — ISO-8601
```

**Optionale Felder:**
```
description  : string | null
logoUrl      : string | null
contactEmail : string | null
isActive     : boolean      — Default: true; inaktive Orgs erlauben keine neuen Releases
```

**Beziehungen:**
- Hat viele `Region` (1:n)
- Hat viele `Station` (1:n)
- Besitzt alle `ContentEntityLine`, `ContentPackageLine`, `ReleaseRecord`
- Hat viele `UserRole`-Zuweisungen

**Invarianten:**
- `slug` ist plattformweit eindeutig und unveränderlich nach Erstellung
- Keine zwei Organizations teilen denselben `id`
- Alle anderen Entitäten referenzieren `organizationId`; dieser Wert muss mit dem `OperationContext.organizationId` übereinstimmen

**Tenant-/Scope-Regeln:**
- Organization ist selbst das Scope-Anker — sie trägt keine `organizationId`
- Globale Templates tragen `organizationId = null`; sie sind nicht direkt releasebar

---

### 3.2 Region

**Zweck:** Sub-Scope innerhalb einer Organization für regionale Policy- und Content-Applicability-Differenzierung. Keine eigene Governance — Governance liegt immer auf Organization-Ebene.

**Pflichtfelder:**
```
id             : string
organizationId : string     — Pflicht; non-null
name           : string
createdAt      : string
```

**Optionale Felder:**
```
description    : string | null
parentRegionId : string | null   — für hierarchische Regionsstrukturen
```

**Beziehungen:**
- Gehört zu einer `Organization` (n:1)
- Hat viele `County` (1:n)
- Hat viele `Station` (n:m über Zuweisung)
- Kann als Scope auf `ContentPackageLine.assignedRegionIds` referenziert werden
- Kann als Scope auf `SurveyInsight.regionId` referenziert werden

**Invarianten:**
- `organizationId` ist unveränderlich nach Erstellung
- `parentRegionId` muss, sofern gesetzt, auf eine Region derselben Organization zeigen

**Tenant-/Scope-Regeln:**
- Regions sind nicht organisationsübergreifend referenzierbar
- Eine Region ohne `parentRegionId` ist Top-Level-Region der Organization

---

### 3.3 County

**Zweck:** Sub-Scope unterhalb Region für lokale Applicability-Einschränkungen (z.B. Landkreis-spezifische Protokollvarianten). Modelliert als Konfiguration, nicht als eigenständige Governance-Einheit.

**Pflichtfelder:**
```
id             : string
organizationId : string     — Pflicht; non-null
regionId       : string     — Pflicht; zugehörige Region
name           : string
createdAt      : string
```

**Optionale Felder:**
```
externalId     : string | null   — Referenz auf externe Registerdaten (z.B. AGS-Code)
description    : string | null
```

**Beziehungen:**
- Gehört zu einer `Region` (n:1)
- Gehört zu einer `Organization` (n:1, über Region)
- Kann als Scope auf `SurveyInsight.countyId` referenziert werden

**Invarianten:**
- `regionId` muss auf eine Region mit identischer `organizationId` zeigen
- County ist kein eigener Governance-Scope — es erbt Organization-Governance

**Tenant-/Scope-Regeln:**
- County ist ausschließlich innerhalb der zugehörigen Organization sichtbar

---

### 3.4 Station

**Zweck:** Operationale Einheit innerhalb einer Organization. Kann optional Region/County zugeordnet sein, um regionale Applicability zu signalisieren.

**Pflichtfelder:**
```
id             : string
organizationId : string     — Pflicht; non-null
name           : string
createdAt      : string
```

**Optionale Felder:**
```
regionId       : string | null
countyId       : string | null
address        : string | null
contactEmail   : string | null
isActive       : boolean         — Default: true
```

**Beziehungen:**
- Gehört zu einer `Organization` (n:1)
- Optional: gehört zu einer `Region` (n:1)
- Optional: gehört zu einem `County` (n:1)
- Kann als Filterkriterium in Analytics und SurveyInsight-Aggregation dienen

**Invarianten:**
- `regionId` muss, sofern gesetzt, auf eine Region derselben Organization zeigen
- `countyId` muss, sofern gesetzt, auf einen County des zugewiesenen `regionId` zeigen
- Station hat keine eigene Governance — kein Approval-Flow auf Station-Ebene

**Tenant-/Scope-Regeln:**
- Station ist nicht organisationsübergreifend sichtbar

---

### 3.5 Algorithm

**Zweck:** Strukturierter medizinischer Entscheidungspfad. Managed als `ContentEntityLine` mit `kind = 'Algorithm'`. Trägt keine eigene Lifecycle-Logik — Lifecycle liegt auf `ContentEntityLine`.

> **Modellierungsregel:** Algorithm, Medication, Protocol, Guideline sind keine separaten Top-Level-Entitäten im Domain-Model. Sie werden durch `ContentEntityLine.kind` diskriminiert. Die Typisierung ist ein `ContentKind`-Value-Object.

**Inhaltliche Pflichtfelder (auf ContentEntityVersion):**
```
title          : string
summary        : string
```

**Inhaltliche optionale Felder:**
```
steps          : AlgorithmStep[]    — strukturierte Entscheidungsschritte
decisionPoints : DecisionPoint[]
clinicalNotes  : string | null
```

**Lifecycle-Träger:** `ContentEntityLine` + `ContentEntityVersion` (→ Abschnitt 3.7 / 3.8)

---

### 3.6 Medication

**Zweck:** Medikamenten-Referenzentität mit operativer Verwendungsinformation. Managed als `ContentEntityLine` mit `kind = 'Medication'`.

**Inhaltliche Pflichtfelder:**
```
name           : string
genericName    : string
```

**Inhaltliche optionale Felder:**
```
dosageGuidelines : DosageGuideline[]
contraindications: string | null
sideEffects      : string | null
routeOfAdmin     : string[]
```

**Lifecycle-Träger:** `ContentEntityLine` + `ContentEntityVersion`

---

### 3.7 Protocol

**Zweck:** Formaler Verfahrensstandard einer Organization. Managed als `ContentEntityLine` mit `kind = 'Protocol'`.

**Inhaltliche Pflichtfelder:**
```
title          : string
scope          : string    — Anwendungsbereich des Protokolls
```

**Inhaltliche optionale Felder:**
```
steps          : ProtocolStep[]
complianceNotes: string | null
references     : string[]
```

**Lifecycle-Träger:** `ContentEntityLine` + `ContentEntityVersion`

---

### 3.8 Guideline

**Zweck:** Operative oder medizinische Inhaltsdarstellung, die Protocols ergänzt. Managed als `ContentEntityLine` mit `kind = 'Guideline'`.

**Inhaltliche Pflichtfelder:**
```
title   : string
summary : string
```

**Inhaltliche optionale Felder:**
```
rationale      : string | null
relatedProtocolIds : string[]
evidenceLevel  : string | null
```

**Lifecycle-Träger:** `ContentEntityLine` + `ContentEntityVersion`

---

### 3.9 ContentEntityLine

**Zweck:** Stabiler Bezeichner einer medizinischen oder operativen Inhaltseinheit über alle Revisionen hinweg. Trägt den Governance-Status des gesamten Content-Items.

**Pflichtfelder:**
```
id               : string
organizationId   : string | null   — null = globales Template (nicht releasebar)
kind             : ContentKind     — 'Algorithm' | 'Medication' | 'Protocol' | 'Guideline'
currentVersionId : string          — ID der aktuellen HEAD-ContentEntityVersion
approvalStatus   : ApprovalStatus
createdAt        : string
```

**Optionale Felder:**
```
assignedRegionIds : string[]       — regionale Applicability-Einschränkung
tags              : string[]
```

**Beziehungen:**
- Gehört zu einer `Organization` (n:1, sofern nicht globales Template)
- Hat viele `ContentEntityVersion` (1:n, append-only)
- HEAD-Version referenziert über `currentVersionId`
- Kann Mitglied in `ContentPackageLine` sein (via `ContentPackageMemberRef`)

**Invarianten:**
- `approvalStatus`-Übergänge folgen ausschließlich den definierten CE-Transitionen (CE-1 bis CE-6)
- `currentVersionId` zeigt immer auf die HEAD-Version (aktuelle Revision)
- Kein Übergang aus `Deprecated` heraus (INV-06)
- `Released` → nur `Deprecated` erlaubt (INV-01)
- CE-5 (Approved → Released) ist ausschließlich als Postcondition von CP-5 aufrufbar (INV-07)

**Tenant-/Scope-Regeln:**
- `organizationId` ist unveränderlich nach Erstellung
- Cross-Tenant-Referenz auf `ContentEntityLine` ist verboten (INV-04)

---

### 3.10 ContentEntityVersion

**Zweck:** Eine unveränderliche Revision eines `ContentEntityLine`. Trägt alle inhaltlichen Felder eines Revisionsstands.

**Pflichtfelder:**
```
id               : string
organizationId   : string | null   — muss mit zugehörigem ContentEntityLine übereinstimmen
targetId         : string          — ID des ContentEntityLine
targetKind       : ContentKind
versionNumber    : number          — monoton steigend innerhalb des LINE; startet bei 1
status           : ContentEntityVersionStatus  — draft | approved | archived
createdByUserId  : string
createdAt        : string
```

**Optionale Felder:**
```
changeRationale  : string | null   — Begründung für diese Revision
reviewedByUserId : string | null
approvedByUserId : string | null
effectiveFrom    : string | null   — ISO-8601
effectiveUntil   : string | null   — ISO-8601
```

**Inhaltsdaten:** Typ-spezifische Felder (Algorithm-Steps, Medication-Dosages etc.) als strukturierter Payload innerhalb der Version.

**Invarianten:**
- Einzig erlaubte Mutationen nach Erstellung: `status`-Wechsel
  - `draft` → `approved` (bei CE-2)
  - `draft` oder `approved` → `archived` (bei CE-4 / CE-6)
- Alle anderen Felder sind nach Erstellung immutable
- `versionNumber` ist eindeutig innerhalb des übergeordneten `targetId`
- `organizationId` muss mit `ContentEntityLine.organizationId` übereinstimmen

**Tenant-/Scope-Regeln:**
- Versionsdaten sind nicht organizationsübergreifend lesbar

---

### 3.11 ContentPackageMemberRef

**Zweck:** Value Object. Referenz auf eine konkrete Revision eines Content-Items innerhalb eines ContentPackage.

**Felder:**
```
contentId  : string   — ID des ContentEntityLine
versionId  : string   — ID der ContentEntityVersion (muss status = 'approved' haben)
```

**Invarianten:**
- `versionId` muss auf eine `ContentEntityVersion` mit `status = 'approved'` zeigen (INV-02)
- `contentId` und `versionId` müssen zur selben Organization gehören wie das ContentPackage (INV-04)

---

### 3.12 ContentPackageLine

**Zweck:** Versionsübergreifender Bezeichner eines ContentPackage. Trägt den Governance-Status des gesamten Pakets.

**Pflichtfelder:**
```
id                  : string
organizationId      : string | null   — null = globales Template (nicht releasebar, INV-09)
packageVersionId    : string          — ID der aktuellen HEAD-ContentPackageVersion
approvalStatus      : ApprovalStatus
includedAlgorithms  : ContentPackageMemberRef[]
includedMedications : ContentPackageMemberRef[]
includedProtocols   : ContentPackageMemberRef[]
includedGuidelines  : ContentPackageMemberRef[]
createdAt           : string
```

**Optionale Felder:**
```
name                : string | null
description         : string | null
targetAudience      : string | null
assignedRegionIds   : string[]
releaseNotes        : string | null
```

**Beziehungen:**
- Gehört zu einer `Organization` (n:1)
- Hat viele `ContentPackageVersion` (1:n, append-only)
- Referenziert `ContentEntityLine`-Mitglieder via `ContentPackageMemberRef`

**Invarianten:**
- Member-Arrays (`includedAlgorithms` etc.) sind ab `approvalStatus = InReview` eingefroren (INV-10)
- Package darf ≥1 Member haben (CP-1-Precondition)
- Alle referenzierten `ContentEntityVersion` müssen `status = 'approved'` haben (INV-02)
- Alle Member müssen zur selben Organization gehören (INV-04)
- `approvalStatus`-Übergänge folgen CP-Transitionen (CP-1 bis CP-6)
- `organizationId` ist unveränderlich nach Erstellung

**Tenant-/Scope-Regeln:**
- Cross-Tenant-Member-Referenzen sind verboten
- Globale Templates (`organizationId = null`) sind nicht direkt releasebar

---

### 3.13 ContentPackageVersion

**Zweck:** Eine unveränderliche Revision eines `ContentPackageLine`.

**Pflichtfelder:**
```
id              : string
organizationId  : string | null   — muss mit ContentPackageLine übereinstimmen
targetId        : string          — ID des ContentPackageLine
versionNumber   : number          — monoton steigend innerhalb des LINE; startet bei 1
approvalStatus  : ApprovalStatus
createdByUserId : string
createdAt       : string
```

**Optionale Felder:**
```
changeRationale : string | null
```

**Invarianten:**
- Nach CP-5 (Released) ist kein Feld dieser Entität mehr mutierbar (INV-01)
- `versionNumber` ist eindeutig innerhalb des `targetId`
- `organizationId` muss mit `ContentPackageLine.organizationId` übereinstimmen

---

### 3.14 ReleaseRecord

**Zweck:** Unveränderlicher Publikationsakt. Entsteht ausschließlich als Postcondition von CP-5. Kein direkter Einstiegspunkt.

**Pflichtfelder:**
```
id                : string
organizationId    : string          — Pflicht; non-null (INV-09)
contentPackageId  : string          — ID des ContentPackageLine
packageVersionId  : string          — ID der ContentPackageVersion (approvalStatus = 'Approved' zum Zeitpunkt der Erstellung)
releasedAt        : string          — ISO-8601; unveränderlich nach Erstellung
releasedByUserId  : string
```

**Optionale Felder:**
```
previousReleaseId : string | null   — null = erstes Release; non-null = Folge-Release oder Rollback
notes             : string | null
```

**Invarianten:**
- Jede `packageVersionId` existiert maximal in einem ReleaseRecord (INV-08)
- Alle Felder sind nach Erstellung immutable
- `organizationId` muss non-null sein
- Rollback: neuer ReleaseRecord mit `previousReleaseId` → kein Mutieren des abgelösten Records (INV-11)
- Die referenzierte `packageVersionId` muss bei Rollback `approvalStatus = 'Approved'` haben

**Tenant-/Scope-Regeln:**
- ReleaseRecord ist ausschließlich innerhalb der zugehörigen Organization sichtbar

---

### 3.15 Version (als konzeptionelle Klammer)

> **Hinweis:** `Version` ist im Domain-Model keine eigenständige Entität, sondern eine konzeptionelle Klammer über `ContentEntityVersion` und `ContentPackageVersion`. Beide tragen das Muster: `id`, `organizationId`, `targetId`, `versionNumber`, `status/approvalStatus`, `createdByUserId`, `createdAt`.

**Versioning-Regeln (gelten für beide):**
- Append-Only — keine Version wird gelöscht (INV-05)
- `versionNumber` monoton steigend innerhalb des LINE
- Neue Version wird erzeugt bei: initialer Erstellung, nach CE-4/CP-4 (Rejected → Draft)
- Keine neue Version bei: StatusÄnderung ohne Inhalt (InReview, Approved, Released)

---

### 3.16 ApprovalStatus

> ApprovalStatus ist ein Enum, kein Entitätstyp. Siehe Abschnitt 4.

---

### 3.17 UserRole

**Zweck:** Rollenzuweisung für einen Benutzer im Scope einer Organization. Kontrolliert, welche Domain-Operationen erlaubt sind.

**Pflichtfelder:**
```
id              : string
organizationId  : string       — Pflicht; non-null; Rolle gilt nur in dieser Organization
userId          : string       — Referenz auf Benutzer-Identität (extern; kein Domain-Typ)
role            : RoleType     — 'admin' | 'approver' | 'author' | 'releaser' | 'viewer'
assignedAt      : string
assignedByUserId: string
```

**Optionale Felder:**
```
expiresAt       : string | null   — optionale Befristung
```

**Beziehungen:**
- Gebunden an `Organization` (n:1)
- Trägt Permissions via `RoleType` → `Permission`-Mapping
- Eine Benutzer-ID kann mehrere UserRoles in derselben Organization haben (unterschiedliche Rollen)
- Eine Benutzer-ID kann UserRoles in verschiedenen Organizations haben (kein Cross-Tenant-Effekt)

**Invarianten:**
- `organizationId` ist unveränderlich nach Erstellung
- Ein `UserRole`-Record ist org-scoped — keine plattformweiten Rollen ohne explizite Modellierung
- Eine abgelaufene UserRole (`expiresAt < now`) gilt als inaktiv

**Tenant-/Scope-Regeln:**
- UserRole-Auflösung erfolgt immer mit `organizationId` aus dem OperationContext
- Eine UserRole in Organization A verleiht keine Rechte in Organization B

---

### 3.18 Permission

**Zweck:** Atomare Capability, die durch `RoleType` impliziert wird und vor jeder Governance-Operation geprüft wird.

**Modellierungsregel:** Permissions sind keine Entitäten mit eigenen IDs, sondern ein statisches Mapping `RoleType → Permission[]`. Sie werden nicht persistiert, sondern aus dem UserRole-RoleType-Mapping ausgewertet.

**Permission-Typen:**
```
content:create          — Neues ContentEntityLine anlegen
content:edit            — Bestehende Draft-Version bearbeiten
content:submit          — CE-1: Draft → InReview auslösen
content:approve         — CE-2: InReview → Approved auslösen
content:reject          — CE-3: InReview → Rejected auslösen
content:deprecate       — CE-6: Released → Deprecated auslösen
package:create          — Neues ContentPackageLine anlegen
package:submit          — CP-1: Draft → InReview auslösen
package:approve         — CP-2: InReview → Approved auslösen
package:reject          — CP-3: InReview → Rejected auslösen
package:release         — CP-5: Approved → Released auslösen
package:deprecate       — CP-6: Released → Deprecated auslösen
organization:manage     — Organization-Metadaten bearbeiten
role:assign             — UserRole zuweisen oder entziehen
survey:read             — SurveyInsight lesen
```

**RoleType → Permission-Mapping (kanonisch):**

| Permission             | admin | approver | author | releaser | viewer |
|------------------------|-------|----------|--------|----------|--------|
| content:create         | ✓     |          | ✓      |          |        |
| content:edit           | ✓     |          | ✓      |          |        |
| content:submit         | ✓     |          | ✓      |          |        |
| content:approve        | ✓     | ✓        |        |          |        |
| content:reject         | ✓     | ✓        |        |          |        |
| content:deprecate      | ✓     |          |        | ✓        |        |
| package:create         | ✓     |          |        | ✓        |        |
| package:submit         | ✓     |          |        | ✓        |        |
| package:approve        | ✓     | ✓        |        |          |        |
| package:reject         | ✓     | ✓        |        |          |        |
| package:release        | ✓     |          |        | ✓        |        |
| package:deprecate      | ✓     |          |        | ✓        |        |
| organization:manage    | ✓     |          |        |          |        |
| role:assign            | ✓     |          |        |          |        |
| survey:read            | ✓     | ✓        | ✓      | ✓        | ✓      |

**Invarianten:**
- Permission-Check erfolgt mit: `userId` + `organizationId` + `requiredPermission`
- Permission-Check liefert boolean; keine Partial-Grants
- SurveyInsight-Daten dürfen keine Governance-Permissions beeinflussen

---

### 3.19 SurveyInsight

**Zweck:** Strukturiertes Advisory-Signal aus Umfragen oder Feature-Voting. Liefert Priorisierungs-Input für Content-Planung und Roadmap. Beeinflusst **niemals** ApprovalStatus, ContentPackage-Composition oder ReleaseRecord-Erstellung.

**Pflichtfelder:**
```
id              : string
organizationId  : string              — Pflicht; non-null; Tenant-Scope
insightType     : InsightType         — 'demand' | 'gap' | 'issue' | 'vote'
subject         : InsightSubject      — { kind: ContentKind; contentId?: string }
confidence      : ConfidenceLevel     — 'low' | 'medium' | 'high'
source          : string              — Bezeichner der Umfrage / des Voting-Events
collectedAt     : string              — ISO-8601
createdAt       : string
```

**Optionale Felder:**
```
regionId        : string | null       — optionaler regionaler Scope
countyId        : string | null       — optionaler County-Scope
stationId       : string | null       — optionaler Station-Scope
targetVersionId : string | null       — Referenz auf bestimmte ContentEntityVersion (für Trend-Analyse)
responseCount   : number | null       — Anzahl Rückmeldungen (für Aggregation)
notes           : string | null
rawPayload      : unknown | null      — opaker Rohdaten-Payload; für Phase-A-Import
```

**Beziehungen:**
- Scoped zu einer `Organization` (n:1)
- Optional referenziert `Region`, `County`, `Station`
- Optional referenziert `ContentEntityLine` via `subject.contentId`
- Keine Beziehung zu `ApprovalStatus`, `ContentPackageLine`, `ReleaseRecord`

**Invarianten:**
- `organizationId` ist unveränderlich nach Erstellung
- `countyId` muss, sofern gesetzt, zur selben Organization gehören wie `regionId`
- SurveyInsight kann keine Transition auslösen
- SurveyInsight kann keine `ApprovalStatus`-Änderung bewirken
- SurveyInsight ist read-only aus Sicht aller Governance-Module

**Tenant-/Scope-Regeln:**
- SurveyInsight-Daten einer Organization sind für andere Organizations nicht sichtbar
- Vergleiche über Organizations hinweg erfolgen nur aggregiert und ohne Offenlegung einzelner Tenant-Daten
- `rawPayload` gilt als sensitiv; Zugriff nur über explizite Permission (`survey:read`)

**Survey-Import-Readiness (Phase A):**
- `rawPayload`-Feld ermöglicht Import von Rohdaten vor vollständiger Normalisierung
- `source`-Feld identifiziert die Importquelle für Deduplizierung
- Kein Normalisierungszwang für Phase-A-Import — Normalisierung erfolgt in Phase B

---

## 4. Enums und Value Objects

### ApprovalStatus (LINE-Governance)
```
Draft      — in Bearbeitung; noch nicht zur Prüfung eingereicht
InReview   — zur Prüfung eingereicht; wartet auf Entscheidung
Approved   — genehmigt; bereit zur Aufnahme in ContentPackage
Rejected   — abgelehnt; muss überarbeitet werden
Released   — veröffentlicht; operativ aktiv; unveränderlich
Deprecated — abgelöst; nicht mehr operativ; unveränderlich (Endstatus)
```

### ContentEntityVersionStatus (Revisions-Status)
```
draft    — aktive Bearbeitung oder in Review
approved — genehmigt; referenzierbar durch ContentPackage
archived — überholt; durch neuere Version ersetzt oder LINE deprecated
```

### ContentKind
```
Algorithm
Medication
Protocol
Guideline
```

### RoleType
```
admin     — volle Governance-Kontrolle innerhalb der Organization
approver  — Content- und Package-Approval-Rechte
author    — Content-Erstellung und Einreichung
releaser  — Package-Erstellung, Submission und Release
viewer    — Read-only
```

### InsightType
```
demand   — Nachfrage-Signal (Content wird häufig gesucht / fehlt)
gap      — Lücken-Signal (Content ist unvollständig oder veraltet)
issue    — Problem-Meldung (Content ist fehlerhaft oder unklar)
vote     — Feature-Voting (Priorisierungsabstimmung)
```

### ConfidenceLevel
```
low
medium
high
```

### ContentPackageMemberRef (Value Object)
```
{ contentId: string; versionId: string }
```

### InsightSubject (Value Object)
```
{ kind: ContentKind; contentId?: string }
```

### OperationContext (Value Object — für jeden Domain-Service-Aufruf)
```
{ organizationId: string; userId: string }
```

---

## 5. Verbotene Modellierungsfehler

| # | Fehler | Begründung |
|---|--------|-----------|
| F-01 | `SurveyInsight` beeinflusst `ApprovalStatus` | Verstößt gegen P-07, INV-02, governance/survey-Grenze |
| F-02 | Content direkt auf `Released` setzen ohne CP-5 | Verstößt gegen INV-07 — CE-5 ist kein direkter Einstiegspunkt |
| F-03 | Released oder Deprecated ContentEntityVersion mutieren | Verstößt gegen INV-01, INV-05 |
| F-04 | Cross-Tenant-Referenz (z.B. ContentEntityLine aus Org A in Package von Org B) | Verstößt gegen INV-04, P-02 |
| F-05 | Package mit non-approved ContentEntityVersion releasen | Verstößt gegen INV-02 |
| F-06 | Globales Template (organizationId = null) direkt releasen | Verstößt gegen INV-09 |
| F-07 | Package-Composition nach InReview ändern | Verstößt gegen INV-10 |
| F-08 | Zwei ReleaseRecords für dieselbe packageVersionId | Verstößt gegen INV-08 |
| F-09 | Rollback durch Mutation des bestehenden ReleaseRecord | Verstößt gegen INV-11 — Rollback ist ein neuer ReleaseRecord |
| F-10 | UserRole ohne organizationId (plattformweite Rolle ohne explizite Modellierung) | Verstößt gegen P-02, multi-tenant-model |
| F-11 | Permission-Evaluation ohne OperationContext.organizationId | Verstößt gegen P-02; kein Org-Context = kein Grant |
| F-12 | UI-Logik oder HTTP-Context in Domain-Lifecycle-Services | Verstößt gegen P-01, P-06, module-boundaries |
| F-13 | Infrastruktur-Implementierung in `models/` oder `lifecycle/` | Verstößt gegen module-boundaries — `ports/` für Interfaces |
| F-14 | ContentPackageLine.approvalStatus und ContentPackageVersion.approvalStatus divergieren | Beide müssen synchron gehalten werden (CP-Transition setzt beide) |
| F-15 | Version-Nummer rücksetzen oder wiederverwenden | Verstößt gegen INV-05 — Append-Only |

---

## 6. Reihenfolge der Implementierung

### Schritt 1 — Value Objects und Enums
Keine Abhängigkeiten. Blockiert alles andere.

```
ApprovalStatus
ContentEntityVersionStatus
ContentKind
RoleType
InsightType
ConfidenceLevel
ContentPackageMemberRef
InsightSubject
OperationContext
```

### Schritt 2 — Tenant-Scope-Entitäten
Abhängigkeit: Schritt 1.
Blockiert: alle Content-Entitäten.

```
Organization
Region
County
Station
```

### Schritt 3 — Governance-Entitäten
Abhängigkeit: Schritt 1, Schritt 2.
Blockiert: alle Lifecycle-Services.

```
UserRole
Permission-Mapping (statisch)
PermissionChecker (Domain Service)
```

### Schritt 4 — Content-Entitäten
Abhängigkeit: Schritt 1, Schritt 2.
Blockiert: ContentPackage, Lifecycle.

```
ContentEntityLine
ContentEntityVersion
```

### Schritt 5 — ContentPackage-Entitäten
Abhängigkeit: Schritt 4.
Blockiert: ReleaseRecord, Lifecycle-Services.

```
ContentPackageLine
ContentPackageVersion
ContentPackageMemberRef (als konkreter Type)
```

### Schritt 6 — ReleaseRecord
Abhängigkeit: Schritt 5.
Blockiert: Release-Service.

```
ReleaseRecord
```

### Schritt 7 — Lifecycle-Services (ContentEntity)
Abhängigkeit: Schritt 3, Schritt 4.

```
CE-1: Draft → InReview
CE-2: InReview → Approved
CE-3: InReview → Rejected
CE-4: Rejected → Draft (neue Version)
CE-6: Released → Deprecated
```

### Schritt 8 — Lifecycle-Services (ContentPackage)
Abhängigkeit: Schritt 3, Schritt 5, Schritt 7.

```
CP-1: Draft → InReview
CP-2: InReview → Approved
CP-3: InReview → Rejected
CP-4: Rejected → Draft (neue Version)
CP-5: Approved → Released (löst CE-5 aus, erzeugt ReleaseRecord)
CP-6: Released → Deprecated
```

### Schritt 9 — SurveyInsight
Abhängigkeit: Schritt 2.
Keine Blockade auf Governance-Services.

```
SurveyInsight
SurveyInsightRepository-Port
Phase-A-Import-Contract (rawPayload-fähig)
```

### Schritt 10 — Repository-Ports
Abhängigkeit: alle Entitäten.
Implementierungen liegen außerhalb des Domain-Moduls.

```
ContentRepositoryPort
PackageRepositoryPort
ReleaseRepositoryPort
SurveyInsightRepositoryPort
```

---

## 7. Offene Risiken und Prüfpunkte

| ID | Thema | Status | Priorität |
|----|-------|--------|-----------|
| OQ-01 | Vier-Augen-Prinzip bei Content-Approval (approver ≠ author) | Offen | Hoch — vor erster Approval-Implementierung entscheiden |
| OQ-02 | Vier-Augen-Prinzip bei Package-Approval | Offen | Hoch |
| OQ-03 | ContentEntityLine-Status nach Package-Deprecation (Released → Approved?) | Offen | Mittel |
| OQ-04 | Draft-Editing-Semantik: mutiert oder neue Version bei Draft-Änderung? | Offen | Hoch — bestimmt CE-Versionsmodell |
| OQ-05 | Activation-Modell: Verhältnis Released ↔ active/inactive | Offen | Mittel |
| OQ-06 | Region-Scoping im ReleaseRecord (eigenes Scope-Feld?) | Offen | Niedrig — Phase 2 |
| OQ-07 | Release-Scheduling (effectiveFrom auf Package-Ebene?) | Offen | Niedrig — Phase 2 |
| OQ-08 | Globaler Template-Release-Pfad (org-übergreifende Nutzung) | Offen | Niedrig — Phase 2 |
| OQ-09 | ContentEntityLine-Status nach Rollback-Release | Offen | Mittel |
| R-01 | Survey-Import in ~1 Woche: rawPayload-Feld muss vorhanden sein | **Deadline-kritisch** | Hoch — Schritt 9 muss vor Import-Termin abgeschlossen sein |
| R-02 | Permission-Mapping noch nicht durch Product bestätigt | Offen | Hoch — vor Governance-Implementation absichern |
| R-03 | County-Entity: keine eigene Governance — falls County-Approval gewünscht, Modell erweitern | Offen | Niedrig |

---

## 8. Übergabe an Codex — Deterministische Code-Erstellung

### Kontext für Codex

```
Projekt: ResQBrain — Multi-Tenant EMS Content Platform
Modul: packages/domain
Sprache: TypeScript (strict mode)
Framework: keines — pure domain types
Abhängigkeiten: keine externen; nur native TypeScript-Typen
```

### Codex-Aufgabe: Schrittweise Implementierung nach Reihenfolge

**Jede Codex-Anweisung enthält:**
1. Zieldatei (exakter Pfad aus Modulstruktur)
2. Welche Entitäten/Enums aus Abschnitt 3/4 umzusetzen sind
3. Welche Invarianten aus Abschnitt 3 und dem `content-lifecycle-baseline-v2.md` gelten
4. Was NICHT implementiert werden darf (keine Klassen, keine ORM-Dekoratoren, keine HTTP-Typen)

---

**Codex-Prompt-Template (Schritt 1):**

```
Implementiere `packages/domain/models/approval-status.ts`.

Inhalt:
- Enum `ApprovalStatus` mit Werten: Draft, InReview, Approved, Rejected, Released, Deprecated
- Enum `ContentEntityVersionStatus` mit Werten: draft, approved, archived
- Enum `ContentKind` mit Werten: Algorithm, Medication, Protocol, Guideline
- Enum `RoleType` mit Werten: admin, approver, author, releaser, viewer
- Enum `InsightType` mit Werten: demand, gap, issue, vote
- Enum `ConfidenceLevel` mit Werten: low, medium, high

Regeln:
- Nur TypeScript const enums oder string literal union types
- Kein export default
- Keine Klassen
- Kein Import aus externen Paketen
```

**Codex-Prompt-Template (Schritt 2, Tenant-Scope):**

```
Implementiere `packages/domain/models/organization.ts`.

Entität: Organization
Pflichtfelder: id (string), name (string), slug (string), createdAt (string)
Optionale Felder: description, logoUrl, contactEmail, isActive (boolean, default true)

Typ als `interface Organization`. Kein class. Kein Decorator.
Invariante im JSDoc: slug ist plattformweit eindeutig und nach Erstellung unveränderlich.

Implementiere analog: region.ts, county.ts, station.ts
(Felder wie in Blueprint-Abschnitt 3.2 bis 3.4)
```

**Codex-Prompt-Template (Schritt 4+5, Content-Entitäten):**

```
Implementiere `packages/domain/models/content-entity.ts`.

Entitäten:
- interface ContentEntityLine (Felder aus Blueprint 3.9)
- interface ContentEntityVersion (Felder aus Blueprint 3.10)
- interface ContentPackageMemberRef (Value Object aus Blueprint 3.11)

Alle interfaces. Kein class. Kein import aus Infrastruktur.
Invarianten als JSDoc-Kommentare auf den betroffenen Feldern.
```

**Codex-Prompt-Template (Schritt 7, Lifecycle CE):**

```
Implementiere `packages/domain/lifecycle/content-entity-transitions.ts`.

Funktion je Transition:
- submitForReview(line: ContentEntityLine, ctx: OperationContext): ContentEntityLine  // CE-1
- approveContent(line: ContentEntityLine, version: ContentEntityVersion, ctx: OperationContext): { line: ContentEntityLine; version: ContentEntityVersion }  // CE-2
- rejectContent(line: ContentEntityLine, ctx: OperationContext): ContentEntityLine  // CE-3
- reviseAfterRejection(line: ContentEntityLine, ctx: OperationContext): { line: ContentEntityLine; newVersion: ContentEntityVersion }  // CE-4
- deprecateContent(line: ContentEntityLine, version: ContentEntityVersion, ctx: OperationContext): { line: ContentEntityLine; version: ContentEntityVersion }  // CE-6

CE-5 (Approved → Released) ist NICHT in dieser Datei. CE-5 ist ausschließlich Postcondition von CP-5 in content-package-transitions.ts.

Jede Funktion:
- Prüft Preconditions aus content-lifecycle-baseline-v2.md (Abschnitt 3)
- Wirft Error mit beschreibender Nachricht bei Verletzung
- Gibt neue Objekte zurück (kein Mutieren der Input-Parameter)
- Keine Infrastruktur-Imports
- Keine Persistence-Aufrufe
```

**Codex-Prompt-Template (Schritt 8, CP-5 mit Kaskade):**

```
Implementiere in `packages/domain/lifecycle/content-package-transitions.ts`
die Funktion releasePackage (CP-5).

Signatur:
releasePackage(
  packageLine: ContentPackageLine,
  packageVersion: ContentPackageVersion,
  contentLines: ContentEntityLine[],
  contentVersions: ContentEntityVersion[],
  ctx: OperationContext,
  previousReleaseId: string | null
): {
  packageLine: ContentPackageLine;
  packageVersion: ContentPackageVersion;
  updatedContentLines: ContentEntityLine[];
  releaseRecord: ReleaseRecord;
}

Preconditions (aus content-lifecycle-baseline-v2.md CP-5):
- packageLine.approvalStatus = 'Approved'
- packageLine.organizationId non-null
- packageVersion.approvalStatus = 'Approved'
- alle Member-ContentEntityVersions haben status = 'approved'
- alle Member-ContentEntityLines haben organizationId = packageLine.organizationId

Postconditions:
- packageLine.approvalStatus = 'Released'
- packageVersion.approvalStatus = 'Released' (vollständig immutable danach)
- neuer ReleaseRecord wird erzeugt
- CE-5 wird für alle referenzierten ContentEntityLines ausgelöst (approvalStatus → Released)

Invariante INV-07: CE-5 darf nur von dieser Funktion ausgelöst werden — kein Export einer separaten releaseContent-Funktion.
Invariante INV-08: Kein zweiter ReleaseRecord für dieselbe packageVersionId — Caller ist verantwortlich; Funktion wirft Error wenn Duplikat detektierbar.
```

---

### Vollständigkeit-Checkliste für Codex

Vor Übergabe sicherstellen:

- [ ] Alle Enums aus Abschnitt 4 implementiert
- [ ] Alle 14 Entitäten/Value-Objects aus Abschnitt 3 als TypeScript-Interfaces
- [ ] Alle 15 Invarianten (INV-01 bis INV-11 + spezifische aus 3.x) als Precondition-Checks oder JSDoc
- [ ] CE-5 ist ausschließlich Postcondition von CP-5 (INV-07)
- [ ] SurveyInsight hat keine Import-Abhängigkeit zu Lifecycle- oder Governance-Modulen
- [ ] `ports/`-Interfaces vorhanden für alle Repositories
- [ ] Kein UI-Typ, kein HTTP-Typ, kein ORM-Typ im `packages/domain`-Verzeichnis
- [ ] `rawPayload`-Feld auf SurveyInsight vorhanden (Phase-A-Import-Readiness)
