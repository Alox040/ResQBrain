# Content Lifecycle Baseline v2

**Status:** Canonical
**Datum:** 2026-03-24
**Quellen:** domain-model.md, content-model.md, versioning-model.md, multi-tenant-model.md, module-boundaries.md, system-overview.md, terminology-mapping.md
**Ablöst:** keinen Vorgänger — erste kanonische Version
**Zweck:** Implementierungsgrundlage für Domain Services, Permission-Modell, Code-Generierung

---

## 1. Statusmodelle

### 1.1 ApprovalStatus (LINE-Governance)

Gilt für: `ContentEntityLine.approvalStatus`, `ContentPackageLine.approvalStatus`, `ContentPackageVersion.approvalStatus`

```
Draft       — in Bearbeitung; noch nicht zur Prüfung eingereicht
InReview    — zur Prüfung eingereicht; wartet auf Entscheidung
Approved    — genehmigt; bereit zur Aufnahme in ContentPackage
Rejected    — Prüfung abgelehnt; muss überarbeitet werden
Released    — veröffentlicht; operativ aktiv; unveränderlich
Deprecated  — abgelöst oder entwerted; nicht mehr operativ; unveränderlich
```

Quelle: domain-model.md, versioning-model.md

---

### 1.2 ContentEntityVersionStatus (REVISIONS-Status)

Gilt für: `ContentEntityVersion.status`

```
draft     — diese Revision ist aktiv in Bearbeitung oder in Prüfung
approved  — diese Revision wurde genehmigt; referenzierbar durch ContentPackage
archived  — diese Revision ist überholt; durch neuere ersetzt oder LINE deprecated
```

Quelle: packages/domain/models/version.ts (ContentEntityVersionStatus)

**Mapping LINE → HEAD-Revision:**

| LINE `ApprovalStatus` | HEAD `ContentEntityVersion.status` |
|---|---|
| `Draft`      | `draft` |
| `InReview`   | `draft` — Revision ändert sich während Review nicht |
| `Approved`   | `approved` |
| `Rejected`   | `draft` — Revision wurde abgelehnt, noch nicht archiviert |
| `Released`   | `approved` — Revision bleibt unverändert |
| `Deprecated` | `archived` |

---

### 1.3 ContentPackageVersion Status

`ContentPackageVersion.approvalStatus` verwendet denselben `ApprovalStatus`-Typ (6 Werte) wie die LINE.

Kein separater Revisionsstatus für Package-Versionen notwendig — der `ApprovalStatus` auf der VERSION entspricht dem LINE-Status zum Zeitpunkt der Erstellung.

---

## 2. Entitäten (Domain-Level, minimal)

Nur Felder, die für korrekte Lifecycle-Ausführung zwingend erforderlich sind.

---

### ContentEntityLine

Stabiler Bezeichner einer medizinischen oder operativen Inhaltseinheit über alle Revisionen hinweg.

```
id               : string          — stabiler Bezeichner des LINE über alle Versionen
organizationId   : string | null   — Tenant-Scope; null = globales Template
kind             : 'Algorithm' | 'Medication' | 'Protocol' | 'Guideline'
currentVersionId : string          — ID der aktuellen HEAD-ContentEntityVersion
approvalStatus   : ApprovalStatus  — aktueller Governance-Status des LINE
```

---

### ContentEntityVersion

Eine unveränderliche Revision eines ContentEntityLine.

```
id             : string
organizationId : string | null    — muss mit dem zugehörigen LINE übereinstimmen
targetId       : string           — ID des übergeordneten ContentEntityLine
targetKind     : 'Algorithm' | 'Medication' | 'Protocol' | 'Guideline'
versionNumber  : number           — monoton steigend innerhalb des LINE
status         : ContentEntityVersionStatus  — draft | approved | archived
createdByUserId: string           — Pflicht für Approval-Prüfungen
```

---

### ContentPackageMemberRef

Referenz auf eine konkrete Revision eines Inhalts innerhalb eines ContentPackage.

```
contentId  : string   — ID des ContentEntityLine
versionId  : string   — ID der ContentEntityVersion (muss status = 'approved' haben)
```

---

### ContentPackageLine

Versionsübergreifender Bezeichner eines ContentPackage.

```
id               : string
organizationId   : string | null   — null = globales Template; nicht direkt releasebar
packageVersionId : string          — ID der aktuellen HEAD-ContentPackageVersion
approvalStatus   : ApprovalStatus
includedAlgorithms : ContentPackageMemberRef[]
includedMedications: ContentPackageMemberRef[]
includedProtocols  : ContentPackageMemberRef[]
includedGuidelines : ContentPackageMemberRef[]
```

---

### ContentPackageVersion

Eine unveränderliche Revision eines ContentPackageLine.

```
id              : string
organizationId  : string | null    — muss mit dem übergeordneten LINE übereinstimmen
targetId        : string           — ID des übergeordneten ContentPackageLine
versionNumber   : number           — monoton steigend innerhalb des LINE
approvalStatus  : ApprovalStatus
createdByUserId : string
```

---

### ReleaseRecord

Der unveränderliche Publikationsakt eines genehmigten ContentPackage für einen Org-Scope.

Nicht im Prototype vorhanden. Quelle: versioning-model.md — "Release record referencing one ContentPackage Version for a target Organization scope."

```
id               : string
organizationId   : string          — Pflicht; non-null; globale Templates nicht direkt releasebar
contentPackageId : string          — ID des ContentPackageLine
packageVersionId : string          — ID der ContentPackageVersion (muss approvalStatus = 'Approved' haben)
releasedAt       : string          — ISO-8601; unveränderlich nach Erstellung
releasedByUserId : string
previousReleaseId: string | null   — null = erstes Release; non-null = Folge-Release oder Rollback
```

---

## 3. Lifecycle-Transitions — ContentEntity

### Erlaubte Übergänge

---

#### CE-1 · Draft → InReview

| | |
|---|---|
| **Auslöser** | author |
| **Preconditions** | LINE.approvalStatus = `Draft`; LINE.organizationId non-null; HEAD-Version.status = `draft` |
| **Postconditions** | LINE.approvalStatus = `InReview` |
| **Neue Version** | Nein |

---

#### CE-2 · InReview → Approved

| | |
|---|---|
| **Auslöser** | approver |
| **Preconditions** | LINE.approvalStatus = `InReview`; HEAD-Version.status = `draft` |
| **Postconditions** | LINE.approvalStatus = `Approved`; HEAD-Version.status = `approved` |
| **Neue Version** | Nein — HEAD-Version.status wird von `draft` auf `approved` gesetzt |

> **OPEN QUESTION OQ-01** — Gilt ein Vier-Augen-Prinzip (approver ≠ createdByUserId der HEAD-Version)? ContentAuditFields trennt authorUserId und approverUserId, aber eine explizite Regel ist in den Quellen nicht formuliert.

---

#### CE-3 · InReview → Rejected

| | |
|---|---|
| **Auslöser** | approver |
| **Preconditions** | LINE.approvalStatus = `InReview` |
| **Postconditions** | LINE.approvalStatus = `Rejected`; HEAD-Version.status bleibt `draft` |
| **Neue Version** | Nein |

---

#### CE-4 · Rejected → Draft (Überarbeitung)

| | |
|---|---|
| **Auslöser** | author |
| **Preconditions** | LINE.approvalStatus = `Rejected` |
| **Postconditions** | Bisherige HEAD-Version.status = `archived`; neue ContentEntityVersion (status=`draft`, versionNumber = vorherige + 1) erstellt; LINE.currentVersionId = neue Version; LINE.approvalStatus = `Draft` |
| **Neue Version** | **Ja** — neue ContentEntityVersion wird angelegt |

---

#### CE-5 · Approved → Released (indirekt)

| | |
|---|---|
| **Auslöser** | **Nur** durch CP-5 (ContentPackage Released) ausgelöst — kein direkter Aufruf möglich |
| **Preconditions** | LINE.approvalStatus = `Approved`; HEAD-Version.status = `approved`; die referenzierte ContentEntityVersion ist in einem ContentPackage enthalten, das Released wird |
| **Postconditions** | LINE.approvalStatus = `Released`; HEAD-Version.status bleibt `approved` |
| **Neue Version** | Nein |

---

#### CE-6 · Released → Deprecated

| | |
|---|---|
| **Auslöser** | releaser oder admin |
| **Preconditions** | LINE.approvalStatus = `Released` |
| **Postconditions** | LINE.approvalStatus = `Deprecated`; HEAD-Version.status = `archived` |
| **Neue Version** | Nein |

---

### Nicht erlaubte Übergänge — ContentEntity

| Von | Nach | Grund |
|---|---|---|
| `Draft` | `Approved` | Kein Review-Bypass |
| `Draft` | `Released` | Kein direkter Release ohne Package |
| `Approved` | `InReview` | Kein Rückschritt ohne neue Revision |
| `Approved` | `Draft` | Kein Rückschritt ohne neue Revision |
| `Released` | `Draft` / `InReview` / `Approved` / `Rejected` | Released ist unveränderlich |
| `Deprecated` | beliebig | Endstatus |
| — | `Released` (direkt) | Nur via CP-5 erlaubt |

---

## 4. Lifecycle-Transitions — ContentPackage

### Erlaubte Übergänge

---

#### CP-1 · Draft → InReview

| | |
|---|---|
| **Auslöser** | releaser |
| **Preconditions** | LINE.approvalStatus = `Draft`; LINE.organizationId non-null; ≥1 Member vorhanden; alle referenzierten ContentEntityVersions haben status = `approved` |
| **Postconditions** | LINE.approvalStatus = `InReview` |
| **Neue Version** | Nein |

---

#### CP-2 · InReview → Approved

| | |
|---|---|
| **Auslöser** | approver |
| **Preconditions** | LINE.approvalStatus = `InReview`; HEAD-PackageVersion.approvalStatus = `InReview` |
| **Postconditions** | LINE.approvalStatus = `Approved`; HEAD-PackageVersion.approvalStatus = `Approved` |
| **Neue Version** | Nein |

> **OPEN QUESTION OQ-02** — Gilt ein Vier-Augen-Prinzip für Package-Approval (approver ≠ createdByUserId der HEAD-PackageVersion)?

---

#### CP-3 · InReview → Rejected

| | |
|---|---|
| **Auslöser** | approver |
| **Preconditions** | LINE.approvalStatus = `InReview` |
| **Postconditions** | LINE.approvalStatus = `Rejected` |
| **Neue Version** | Nein |

---

#### CP-4 · Rejected → Draft (Überarbeitung)

| | |
|---|---|
| **Auslöser** | releaser |
| **Preconditions** | LINE.approvalStatus = `Rejected` |
| **Postconditions** | Bisherige HEAD-PackageVersion wird archiviert (approvalStatus = `Rejected`, keine Mutation der Daten); neue ContentPackageVersion (approvalStatus=`Draft`, versionNumber = vorherige + 1) erstellt; LINE.packageVersionId = neue Version; LINE.approvalStatus = `Draft` |
| **Neue Version** | **Ja** — neue ContentPackageVersion wird angelegt |

---

#### CP-5 · Approved → Released

| | |
|---|---|
| **Auslöser** | releaser |
| **Preconditions** | LINE.approvalStatus = `Approved`; LINE.organizationId non-null; HEAD-PackageVersion.approvalStatus = `Approved`; alle Member-ContentEntityVersions haben status = `approved`; alle Member-ContentEntityLines haben organizationId = LINE.organizationId; kein ReleaseRecord mit identischer packageVersionId existiert bereits |
| **Postconditions** | LINE.approvalStatus = `Released`; HEAD-PackageVersion.approvalStatus = `Released`; HEAD-PackageVersion ist ab diesem Moment vollständig immutable; neuer ReleaseRecord wird erstellt; CE-5 wird für alle referenzierten ContentEntityLines ausgelöst |
| **Neue Version** | Nein |

---

#### CP-6 · Released → Deprecated

| | |
|---|---|
| **Auslöser** | releaser oder admin |
| **Preconditions** | LINE.approvalStatus = `Released` |
| **Postconditions** | LINE.approvalStatus = `Deprecated` |
| **Neue Version** | Nein |

> **OPEN QUESTION OQ-03** — Wenn ein Released ContentPackage Deprecated wird: wechselt der Status der referenzierten ContentEntityLines zurück von `Released` auf `Approved`? Oder bleiben sie `Released`? Nicht in Quellen definiert.

---

### Nicht erlaubte Übergänge — ContentPackage

| Von | Nach | Grund |
|---|---|---|
| `Draft` | `Approved` / `Released` | Kein Review-Bypass |
| `Approved` | `Draft` / `InReview` | Kein Rückschritt ohne neue Version |
| `Released` | `Draft` / `InReview` / `Approved` / `Rejected` | Released ist unveränderlich |
| `Deprecated` | beliebig | Endstatus |

---

## 5. Release-Modell

### Was ein ReleaseRecord ist

Ein ReleaseRecord ist der unveränderliche Nachweis, dass eine bestimmte ContentPackageVersion für den Scope einer Organization veröffentlicht wurde. Er entsteht als Ergebnis von CP-5. Er ist keine Mutation — er ist ein neuer, eigenständiger Record.

Quelle: versioning-model.md — "Release record referencing one ContentPackage Version for a target Organization scope"

---

### Wann er erzeugt wird

Genau dann, wenn CP-5 (ContentPackage: Approved → Released) vollständig durchläuft. Es existiert nach CP-5 exakt ein ReleaseRecord pro packageVersionId.

---

### Was immutable ist

Nach Erstellung des ReleaseRecord sind unveränderlich:

- Der ReleaseRecord selbst (alle Felder)
- Die referenzierte ContentPackageVersion (alle Felder)
- Alle ContentEntityVersions, die in der ContentPackageVersion referenziert sind (status bleibt `approved`)

Quelle: versioning-model.md — "Released Versions are immutable."

---

### Wie Rollback funktioniert

Ein Rollback ist ein **neuer ReleaseRecord**, der auf eine frühere ContentPackageVersion zeigt, deren approvalStatus `Approved` ist.

```
ReleaseRecord (Rollback):
  previousReleaseId = ID des abzulösenden Release
  packageVersionId  = ID einer früheren, noch approved ContentPackageVersion
```

Die frühere ContentPackageVersion muss `approvalStatus = 'Approved'` haben. Alle CP-5-Preconditions gelten identisch. Das abgelöste Release wird **nicht mutiert**.

Quelle: versioning-model.md — "Rollback publishes a new Release that references an earlier approved Version set."

---

### Ob Content indirekt Released wird

Ja. CP-5 löst CE-5 für alle ContentEntityLines aus, deren ContentEntityVersion in der Package-Composition enthalten ist. ContentEntityLines wechseln ihren `approvalStatus` von `Approved` auf `Released`.

Dieser Übergang ist nicht direkt aufrufbar — er ist ausschließlich eine Postcondition von CP-5.

---

## 6. Versionierungsregeln

**Append-Only:** Versionen werden ausschließlich hinzugefügt. Keine existierende Version wird gelöscht.

**Einzige erlaubte Mutation an Versionen:** `ContentEntityVersion.status` darf von `draft` auf `approved` oder von `draft`/`approved` auf `archived` wechseln. Keine anderen Felder einer Version werden nach Erstellung geändert.

**Vollständige Immutabilität ab Released:** `ContentPackageVersion` und alle referenzierten `ContentEntityVersion` sind nach CP-5 in keinem Feld mutierbar.

**Neue ContentEntityVersion wird erzeugt bei:**

1. Initialer Erstellung eines ContentEntityLine
2. CE-4: Rejected → Draft (Überarbeitung nach Ablehnung)

**Neue ContentPackageVersion wird erzeugt bei:**

1. Initialer Erstellung eines ContentPackageLine
2. CP-4: Rejected → Draft (Überarbeitung nach Ablehnung)

**Neue ContentPackageVersion wird NICHT erzeugt bei:**

- Statusübergängen InReview → Approved / Rejected (gleiche Version, Statusänderung)
- CP-5: Approved → Released (gleiche Version, Status wird gesetzt, Version eingefroren)

**versionNumber** ist monoton steigend innerhalb des LINE, unabhängig je Tenant-Scope.

Quelle: versioning-model.md — "New changes create new Versions; they do not rewrite release history."

> **OPEN QUESTION OQ-04** — Semantik von "Draft-Editing": Wenn ein Inhalt im Status `Draft` ist und Felder geändert werden, mutiert das die bestehende draft-ContentEntityVersion oder erzeugt es eine neue? Die Quellen definieren nur, dass CE-4 (nach Rejection) eine neue Version erzeugt. Ob wiederholtes Bearbeiten im Draft-Zustand neue Versionen erzeugt, ist nicht festgelegt.

---

## 7. Invarianten

```
INV-01  Released ist unveränderlich.
        ContentEntityLine und ContentPackageLine mit approvalStatus = 'Released'
        dürfen nur noch zu 'Deprecated' wechseln.

INV-02  Release nur mit approved content.
        CP-1 und CP-5 sind nur zulässig, wenn alle referenzierten
        ContentEntityVersions den status = 'approved' haben.

INV-03  Package Release kaskadiert Content Release.
        CP-5 löst CE-5 für alle referenzierten ContentEntityLines aus.
        Diese Kaskade ist atomar — kein Package darf Released sein,
        während ein referenzierter ContentEntityLine noch 'Approved' ist.

INV-04  Organization Boundary ist hart.
        Jedes Artefakt (ContentEntityLine, ContentPackageLine, ContentEntityVersion,
        ContentPackageVersion, ReleaseRecord) trägt eine organizationId, die mit dem
        OperationContext.organizationId übereinstimmen muss.
        Cross-Tenant-Referenzen sind verboten.

INV-05  Version Append-Only.
        Keine Version wird gelöscht.
        Einzig erlaubte Mutation: status-Wechsel auf 'archived'.

INV-06  Deprecated ist Endstatus.
        Kein Übergang aus 'Deprecated' heraus ist erlaubt.

INV-07  CE-5 ist kein direkter Transition-Einstiegspunkt.
        Der Übergang ContentEntityLine Approved → Released darf
        ausschließlich als Postcondition von CP-5 eintreten.

INV-08  Jede packageVersionId in einem ReleaseRecord ist einmalig.
        Es existiert maximal ein ReleaseRecord pro packageVersionId.

INV-09  Globale Templates (organizationId = null) sind nicht direkt releasebar.
        CP-5 erfordert non-null organizationId auf dem ContentPackageLine.

INV-10  Package-Composition ist ab InReview eingefroren.
        Die Member-Arrays (includedAlgorithms etc.) dürfen nach dem Übergang
        zu InReview nicht mehr geändert werden.

INV-11  Rollback erzeugt neuen ReleaseRecord.
        Das abgelöste Release wird nicht mutiert.
        Die referenzierte frühere packageVersionId muss approvalStatus = 'Approved' haben.
```

---

## 8. Offene Punkte — nicht entscheiden

Diese Punkte sind im vorliegenden Kontext nicht ableitbar oder nicht eindeutig. Sie werden nicht gelöst.

---

**OQ-01 — Vier-Augen-Prinzip bei Content-Approval (CE-2)**
Gilt approver ≠ createdByUserId der HEAD-ContentEntityVersion? `ContentAuditFields` trennt `authorUserId` und `approverUserId`, aber eine explizite Pflicht-Separation ist in den Quellen nicht formuliert.

**OQ-02 — Vier-Augen-Prinzip bei Package-Approval (CP-2)**
Gilt approver ≠ createdByUserId der HEAD-ContentPackageVersion?

**OQ-03 — ContentEntityLine-Status nach Package-Deprecation**
Wenn ein Released ContentPackage Deprecated wird (CP-6): wechseln die referenzierten ContentEntityLines von `Released` zurück auf `Approved`? Oder bleiben sie `Released`?

**OQ-04 — Draft-Editing-Semantik**
Erzeugt jede inhaltliche Änderung an einem ContentEntityLine im `Draft`-Status eine neue ContentEntityVersion, oder wird die bestehende Draft-Version mutiert?

**OQ-05 — Activation-Modell**
`ContentPackage.activation` (active/inactive) existiert im Modell. Das Verhältnis zwischen `activation` und `approvalStatus = 'Released'` ist nicht definiert. Ist ein Released-Package automatisch active? Kann ein Released-Package inactive sein? Wer steuert das?

**OQ-06 — Region-Scoping bei Release**
`ContentPackage.assignedRegionIds` ist vorhanden. Der ReleaseRecord referenziert die packageVersionId, welche die Region-Einschränkung indirekt über die ContentPackageVersion mitführt. Ob der ReleaseRecord selbst ein eigenes Scope-Feld benötigt, ist nicht entschieden.

**OQ-07 — Release-Scheduling**
`ContentEffectiveMetadata` (effectiveFrom / effectiveUntil) existiert auf ContentEntityBase. Ob ein Release zeitlich geplant werden kann (scheduled release) oder ob effectiveFrom ausschließlich auf Content-Ebene gilt, ist nicht definiert.

**OQ-08 — Globaler Template-Release-Pfad**
Wie ein globales Template (organizationId = null) über Orgs hinweg verfügbar gemacht wird, ist nicht definiert. Phase-2-Default: Deny.

**OQ-09 — ContentEntity-Status nach Rollback-Release**
Wenn ein Rollback-Release auf eine frühere packageVersionId zeigt: wechseln ContentEntityLines, die im aktuellen Release `Released` sind, aber im Rollback-Target nicht enthalten sind, zurück auf `Approved`?
