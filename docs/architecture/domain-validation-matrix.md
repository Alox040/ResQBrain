# Domain Validation Matrix
## ResQBrain Phase 0 — Foundation

**Version:** 1.0
**Date:** 2026-03-25
**Status:** Canonical — testbare Regeln für die Domain Foundation
**Authority:** `domain-entity-blueprint.md`, `tenant-model.md`, `content-lifecycle-final.md`,
              `approval-model-final.md`, `version-model-final.md`,
              `content-package-model-final.md`, `governance-model-final.md`,
              `implementation-guardrails.md`

---

## Legende

| Feld | Bedeutung |
|------|-----------|
| **ID** | Eindeutige Regel-ID (Kategorie-Präfix + Nummer) |
| **Regelname** | Kurzbeschreibung der Invariante |
| **Module** | Betroffene Domain-Module |
| **Positiver Testfall** | Szenario, das die Regel erfüllt — muss durchlaufen |
| **Negativer Testfall** | Szenario, das die Regel verletzt — muss abgelehnt werden |
| **Kritischer Edge Case** | Grenzfall mit spezifischem Risiko |
| **Quelle** | Herkunft aus Architekturdokumenten |
| **Priorität** | `high` / `medium` / `low` |

---

## Kategorie 1 — Tenant Isolation (TI)

### TI-01
| Feld | Inhalt |
|------|--------|
| **Regelname** | organizationId auf jeder Query mandatory |
| **Module** | tenant, alle Content-Module |
| **Positiver Testfall** | `findAlgorithms({ organizationId: "org-A" })` → gibt nur Org-A-Records zurück |
| **Negativer Testfall** | `findAlgorithms({})` → wird abgelehnt, bevor DB-Query ausgeführt wird |
| **Kritischer Edge Case** | `findAlgorithms({ title: "Cardiac" })` ohne orgId → muss abgelehnt werden, obwohl ein Filter vorhanden ist |
| **Quelle** | tenant-model HC-01, L-01 |
| **Priorität** | high |

---

### TI-02
| Feld | Inhalt |
|------|--------|
| **Regelname** | organizationId auf jeder Write-Operation mandatory |
| **Module** | tenant, content, governance, versioning |
| **Positiver Testfall** | `createAlgorithm({ organizationId: "org-A", title: "...", actorRoleId: "role-X" })` → wird angelegt |
| **Negativer Testfall** | `createAlgorithm({ title: "..." })` ohne organizationId → wird abgelehnt |
| **Kritischer Edge Case** | `createAlgorithm({ organizationId: null })` → explizit null wird abgelehnt (nicht als leerer String akzeptiert) |
| **Quelle** | tenant-model HC-02 |
| **Priorität** | high |

---

### TI-03
| Feld | Inhalt |
|------|--------|
| **Regelname** | Actor-orgId muss Entity-orgId matchen bei jedem Write |
| **Module** | tenant, governance, lifecycle |
| **Positiver Testfall** | Actor mit orgId "org-A" schreibt auf Entity mit orgId "org-A" → erlaubt |
| **Negativer Testfall** | Actor mit orgId "org-B" schreibt auf Entity mit orgId "org-A" → CROSS_TENANT_ACCESS_DENIED |
| **Kritischer Edge Case** | Actor hat gültige Permission, aber in anderer Org → Permission-Grant gilt nicht cross-org |
| **Quelle** | tenant-model HC-02, governance HC-G-05 |
| **Priorität** | high |

---

### TI-04
| Feld | Inhalt |
|------|--------|
| **Regelname** | Alle intra-Entity-Referenzen müssen same-org sein |
| **Module** | content, tenant |
| **Positiver Testfall** | Algorithm (org-A) referenziert Medication (org-A) → erlaubt |
| **Negativer Testfall** | Algorithm (org-A) referenziert Medication (org-B) → abgelehnt (L-03) |
| **Kritischer Edge Case** | Protocol referenziert Algorithm aus org-A und Medication aus org-B in einem einzigen Submit → beide werden geprüft, Ablehnung wegen Medication |
| **Quelle** | tenant-model HC-03, L-03 |
| **Priorität** | high |

---

### TI-05
| Feld | Inhalt |
|------|--------|
| **Regelname** | ContentPackage darf nur same-org Content enthalten |
| **Module** | content, tenant |
| **Positiver Testfall** | ContentPackage (org-A) enthält Algorithm (org-A), Medication (org-A) → Assembly erfolgreich |
| **Negativer Testfall** | ContentPackage (org-A) enthält Algorithm (org-B) → abgelehnt bei Assembly (L-02) |
| **Kritischer Edge Case** | entityId existiert in org-A UND org-B (gleiche ID, verschiedene Tenants) → Query ohne orgId würde falschen Record liefern; mit orgId wird korrekt isoliert |
| **Quelle** | tenant-model L-02, content-package HC-CP-04 |
| **Priorität** | high |

---

### TI-06
| Feld | Inhalt |
|------|--------|
| **Regelname** | Permission-Evaluation erfordert organizationId als Pflichtparameter |
| **Module** | governance |
| **Positiver Testfall** | `evaluatePermission("user-1", "org-A", "content.approve", "algorithm")` → liefert PolicyDecision |
| **Negativer Testfall** | `evaluatePermission("user-1", null, "content.approve", "algorithm")` → wirft DomainError (nicht false) |
| **Kritischer Edge Case** | `evaluatePermission("user-1", "*", "content.approve", "algorithm")` mit Wildcard-orgId → abgelehnt, kein Wildcard-Tenant |
| **Quelle** | tenant-model HC-04, L-10 |
| **Priorität** | high |

---

### TI-07
| Feld | Inhalt |
|------|--------|
| **Regelname** | organizationId ist nach Erstellung immutable |
| **Module** | content, tenant, versioning, governance |
| **Positiver Testfall** | Algorithm.organizationId lesen → gibt "org-A" zurück |
| **Negativer Testfall** | Versuch, Algorithm.organizationId auf "org-B" zu setzen → abgelehnt (throws, nicht silent ignore) |
| **Kritischer Edge Case** | Update-Command enthält neuen organizationId-Wert → wird ignoriert oder abgelehnt, nicht stillschweigend übernommen |
| **Quelle** | domain-entity-blueprint, tenant-model HC-02 |
| **Priorität** | high |

---

### TI-08
| Feld | Inhalt |
|------|--------|
| **Regelname** | scopeTargetId in UserRole muss same-org sein |
| **Module** | governance, tenant |
| **Positiver Testfall** | UserRole(org-A, scopeLevel: Station, scopeTargetId: station-1(org-A)) → gültig |
| **Negativer Testfall** | UserRole(org-A, scopeLevel: Station, scopeTargetId: station-1(org-B)) → abgelehnt (L-04) |
| **Kritischer Edge Case** | scopeTargetId referenziert gelöschte Station → DataIntegrityViolation (Station kann nicht gelöscht werden, Decommissioned bleibt) |
| **Quelle** | tenant-model L-04, HC-03 |
| **Priorität** | high |

---

### TI-09
| Feld | Inhalt |
|------|--------|
| **Regelname** | organizationId darf nie aus Session/Context allein abgeleitet werden |
| **Module** | alle Services |
| **Positiver Testfall** | Service erhält organizationId als expliziten Parameter + validiert gegen actorRole.organizationId → erlaubt |
| **Negativer Testfall** | Service liest organizationId aus `requestContext.currentOrg` ohne Parameter-Übergabe → Architektur-Verstoß (statischer Test) |
| **Kritischer Edge Case** | User ist in zwei Orgs aktiv → ohne explizite orgId im Command ist unklar, in welcher Org operiert wird; muss immer explizit sein |
| **Quelle** | tenant-model HC-09 |
| **Priorität** | high |

---

### TI-10
| Feld | Inhalt |
|------|--------|
| **Regelname** | contentSharingPolicyExists() gibt in Phase 0 immer false zurück |
| **Module** | tenant |
| **Positiver Testfall** | `contentSharingPolicyExists("org-A", "org-B", "alg-1")` → false |
| **Negativer Testfall** | Code-Pfad, der cross-org Content-Inclusion erlaubt ohne diesen Guard → statischer Import-Test schlägt an |
| **Kritischer Edge Case** | Guard-Funktion nicht aufgerufen bei Package-Assembly → cross-org Content wird nicht erkannt; Test: Assembly mit cross-org entityId triggert Guard-Check |
| **Quelle** | tenant-model HC-07 |
| **Priorität** | high |

---

### TI-11
| Feld | Inhalt |
|------|--------|
| **Regelname** | Audit-Events müssen organizationId tragen |
| **Module** | shared/audit, alle Services |
| **Positiver Testfall** | Lifecycle-Transition → Audit-Record mit organizationId geschrieben |
| **Negativer Testfall** | Audit-Event ohne organizationId → Write wird abgelehnt (L-11) |
| **Kritischer Edge Case** | Audit-Record einer abgelehnten Operation (Denial) → auch dieser muss organizationId tragen |
| **Quelle** | tenant-model HC-08, L-11 |
| **Priorität** | medium |

---

### TI-12
| Feld | Inhalt |
|------|--------|
| **Regelname** | Sub-scopes (Region/County/Station) sind keine Tenant-Grenzen |
| **Module** | tenant, governance |
| **Positiver Testfall** | UserRole(org-A, Station-scoped) kann Content für Station-1 in org-A reviewen |
| **Negativer Testfall** | Query `findAlgorithms({ stationId: "stn-1" })` ohne organizationId → abgelehnt |
| **Kritischer Edge Case** | Station-scoped Reviewer versucht Content zu approven, der Organization-wide gilt (nicht nur Station-1) → je nach Policy: ScopeMismatch oder erlaubt |
| **Quelle** | tenant-model HC-06 |
| **Priorität** | medium |

---

### TI-13
| Feld | Inhalt |
|------|--------|
| **Regelname** | Version.predecessorVersionId muss same-org + same-entity sein |
| **Module** | versioning, tenant |
| **Positiver Testfall** | Version v2 (org-A, entity-X) → predecessorVersionId = v1 (org-A, entity-X) → gültig |
| **Negativer Testfall** | Version v2 (org-A, entity-X) → predecessorVersionId = v1 (org-B, entity-X) → abgelehnt (L-09) |
| **Kritischer Edge Case** | predecessorVersionId referenziert Version einer anderen Entity (gleiche Org, andere Entity-ID) → abgelehnt: Lineage-Kette bleibt sauber |
| **Quelle** | tenant-model L-09, version-model HC-V-03 |
| **Priorität** | medium |

---

### TI-14
| Feld | Inhalt |
|------|--------|
| **Regelname** | Rollback unterliegt denselben Tenant-Constraints wie initiales Release |
| **Module** | release, tenant |
| **Positiver Testfall** | Rollback mit korrektem organizationId-Match → erlaubt |
| **Negativer Testfall** | Rollback-Befehl mit organizationId "org-B" auf Package von org-A → CROSS_TENANT_ACCESS_DENIED |
| **Kritischer Edge Case** | Prior Release wurde von anderer Person ausgeführt → Rollback braucht eigene Policy-Evaluation, nicht Übernahme der Autorisierung des Prior Release |
| **Quelle** | tenant-model HC-10 |
| **Priorität** | medium |

---

## Kategorie 2 — Lifecycle Transition Rules (LC)

### LC-01
| Feld | Inhalt |
|------|--------|
| **Regelname** | Draft → InReview erfordert strukturelle Vollständigkeit |
| **Module** | lifecycle, content |
| **Positiver Testfall** | Algorithm mit vollständigem decisionLogic (keine dangling branches) → submit erfolgreich |
| **Negativer Testfall** | Algorithm mit leerem decisionLogic → submit abgelehnt: CONTENT_STRUCTURALLY_INCOMPLETE |
| **Kritischer Edge Case** | Protocol ohne regulatoryBasis → submit abgelehnt, auch wenn alle anderen Felder vollständig sind |
| **Quelle** | content-lifecycle-final T1-Preconditions |
| **Priorität** | high |

---

### LC-02
| Feld | Inhalt |
|------|--------|
| **Regelname** | Draft → InReview: keine Deprecated-Referenzen im Content |
| **Module** | lifecycle, content |
| **Positiver Testfall** | Algorithm referenziert Medication (Approved) → submit erlaubt |
| **Negativer Testfall** | Algorithm referenziert Medication (Deprecated) → submit abgelehnt: DEPRECATED_REFERENCE_IN_SUBMISSION |
| **Kritischer Edge Case** | Medication wird zwischen Draft-Erstellung und Submit deprecated → Deprecation-Zeitpunkt ist relevant; Check erfolgt zum Submit-Zeitpunkt |
| **Quelle** | content-lifecycle-final T1-Precondition #6 |
| **Priorität** | high |

---

### LC-03
| Feld | Inhalt |
|------|--------|
| **Regelname** | InReview-Entity ist gesperrt — keine Edits |
| **Module** | lifecycle, content |
| **Positiver Testfall** | Algorithm in Draft → Felder können bearbeitet werden |
| **Negativer Testfall** | Algorithm in InReview → Edit-Versuch → abgelehnt: ENTITY_IMMUTABLE (für diesen Zustand) |
| **Kritischer Edge Case** | RequestChanges-Outcome → Autor versucht direkt zu editieren → abgelehnt; korrekte Lösung: Recall nach Rejection eines anderen Reviewers |
| **Quelle** | content-lifecycle-final, approval-model EC-03 |
| **Priorität** | high |

---

### LC-04
| Feld | Inhalt |
|------|--------|
| **Regelname** | Approved → Released ausschließlich via ContentPackage.release |
| **Module** | lifecycle, release |
| **Positiver Testfall** | ContentPackage.release → alle referenzierten Content-Entities wechseln zu Released |
| **Negativer Testfall** | Direkter Aufruf `releaseContent(algorithmId)` ohne ContentPackage → abgelehnt: kein direkter Release-Pfad |
| **Kritischer Edge Case** | ContentPackage enthält 10 Entities → 9 werden released, 1 Audit-Write schlägt fehl → vollständiger Rollback, keine Entity im Released-Zustand |
| **Quelle** | content-lifecycle-final Foundational Rule #5, EC-12 |
| **Priorität** | high |

---

### LC-05
| Feld | Inhalt |
|------|--------|
| **Regelname** | Released → kein Zustandsrückschritt möglich |
| **Module** | lifecycle |
| **Positiver Testfall** | Released Algorithm → Deprecation → Deprecated (einziger erlaubter Übergang) |
| **Negativer Testfall** | Released Algorithm → recall → abgelehnt: ENTITY_IMMUTABLE |
| **Kritischer Edge Case** | Released Algorithm → directe Approved-Transition → abgelehnt: ENTITY_ALREADY_RELEASED |
| **Quelle** | content-lifecycle-final Prohibited Transitions |
| **Priorität** | high |

---

### LC-06
| Feld | Inhalt |
|------|--------|
| **Regelname** | Rejected ist terminal für diese Version |
| **Module** | lifecycle, versioning |
| **Positiver Testfall** | Rejected Algorithm → neue Version bei Draft erstellen → erlaubt; predecessor: die rejizierte Version |
| **Negativer Testfall** | Rejected Algorithm → direkter Übergang zu Draft oder InReview (selbe Version) → abgelehnt: VERSION_TERMINAL |
| **Kritischer Edge Case** | Rejected Version taucht in ContentPackage-Komposition auf → Assembly-Precondition-Check: `approvalStatus == Rejected ≠ Approved` → Assembly abgelehnt |
| **Quelle** | content-lifecycle-final, version-model |
| **Priorität** | high |

---

### LC-07
| Feld | Inhalt |
|------|--------|
| **Regelname** | Recall (Approved → InReview) erfordert recallRationale |
| **Module** | lifecycle, governance |
| **Positiver Testfall** | `recall({ entityId, actorRoleId, recallRationale: "Clinical correction needed" })` → erlaubt |
| **Negativer Testfall** | `recall({ entityId, actorRoleId, recallRationale: "" })` → abgelehnt: RATIONALE_REQUIRED |
| **Kritischer Edge Case** | Recall auf Entity, die bereits in Released ContentPackage ist → abgelehnt: ENTITY_ALREADY_RELEASED (T5-Precondition #4) |
| **Quelle** | content-lifecycle-final T5 |
| **Priorität** | medium |

---

### LC-08
| Feld | Inhalt |
|------|--------|
| **Regelname** | Org.Suspended blockiert neue Submissions und Releases, nicht laufende Reviews |
| **Module** | lifecycle, tenant |
| **Positiver Testfall** | Entity in InReview, Org wird Suspended → Reviewer kann noch ApprovalDecision einreichen; Quorum kann resolven → entity wird Approved |
| **Negativer Testfall** | Org.Suspended → neues Submit (Draft → InReview) → abgelehnt: ORGANIZATION_NOT_ACTIVE |
| **Kritischer Edge Case** | Quorum resolvert zu Approved, aber Lifecycle-Transition-Check: `Org.status == Active` schlägt fehl → Entity bleibt InReview; lifecycleExecuted: false in Quorum-Record |
| **Quelle** | content-lifecycle-final EC-05, approval-model EC-07 |
| **Priorität** | medium |

---

### LC-09
| Feld | Inhalt |
|------|--------|
| **Regelname** | Deprecation erfordert deprecationDate und deprecationReason |
| **Module** | lifecycle |
| **Positiver Testfall** | `deprecate({ entityId, deprecationDate: "2026-06-01", deprecationReason: "Replaced by v2 protocol" })` → erlaubt |
| **Negativer Testfall** | `deprecate({ entityId })` ohne beide Felder → abgelehnt: DEPRECATION_DATE_REQUIRED |
| **Kritischer Edge Case** | Deprecation auf Entity in `Approved` (noch nicht Released) → abgelehnt: INVALID_SOURCE_STATE (nur Released kann deprecated werden) |
| **Quelle** | content-lifecycle-final T6 |
| **Priorität** | medium |

---

### LC-10
| Feld | Inhalt |
|------|--------|
| **Regelname** | Keine impliziten Transitions — jede Zustandsänderung ist explizit und benannt |
| **Module** | lifecycle |
| **Positiver Testfall** | Alle Zustandsänderungen erfolgen über benannte Operationen (submit, approve, reject, release, recall, deprecate) |
| **Negativer Testfall** | Background-Job setzt `approvalStatus = 'Approved'` direkt auf Entity → Architektur-Verletzung (statischer Test) |
| **Kritischer Edge Case** | Survey SafetyConcern-Event → kein automatisches Recall-Trigger; Lifecycle-Service hat keinen Event-Handler für Survey-Events |
| **Quelle** | content-lifecycle-final Foundational Rule #1 |
| **Priorität** | high |

---

### LC-11
| Feld | Inhalt |
|------|--------|
| **Regelname** | Audit-Write ist Teil der atomaren Transition — Failure bricht ab |
| **Module** | lifecycle, shared/audit |
| **Positiver Testfall** | Transition + Audit-Write beide erfolgreich → Entity-Status persistiert |
| **Negativer Testfall** | Audit-Write schlägt fehl → Entity-Status nicht persistiert; Entity bleibt im Ausgangszustand |
| **Kritischer Edge Case** | Audit-Write-Fehler bei EC-12 (12 Entities, 2 Audits schlagen fehl) → vollständiger Rollback; kein Entity ist Released |
| **Quelle** | content-lifecycle-final T4 #10, EC-10, EC-12 |
| **Priorität** | high |

---

### LC-12
| Feld | Inhalt |
|------|--------|
| **Regelname** | Deprecation ohne Kaskade — Package und Content unabhängig |
| **Module** | lifecycle |
| **Positiver Testfall** | Content deprecated → ContentPackages, die diese Version enthalten, bleiben Released und immutable |
| **Negativer Testfall** | Package deprecated → Content-Entities im Package ändern ihren Status nicht |
| **Kritischer Edge Case** | Alle Content-Entities eines Released-Package werden deprecated → Package selbst bleibt Released; kein automatisches Package-Deprecated |
| **Quelle** | content-lifecycle-final Part 5 |
| **Priorität** | medium |

---

## Kategorie 3 — Approval Rules (AP)

### AP-01
| Feld | Inhalt |
|------|--------|
| **Regelname** | Kein Auto-Approve durch Timeout |
| **Module** | governance, lifecycle |
| **Positiver Testfall** | reviewWindowDays überschritten → OrgAdmin-Notification wird gesendet; Entity bleibt InReview |
| **Negativer Testfall** | Timer-basierter Mechanismus, der `approvalStatus = 'Approved'` setzt → abgelehnt (statischer Test) |
| **Kritischer Edge Case** | reviewWindowDays = 0 (kein Fenster konfiguriert) → kein Timeout-Event; Entity bleibt bis zum manuellen Eingriff in InReview |
| **Quelle** | approval-model H-03, ApprovalPolicy.reviewWindowDays |
| **Priorität** | high |

---

### AP-02
| Feld | Inhalt |
|------|--------|
| **Regelname** | minimumReviewers darf nicht < 1 sein |
| **Module** | governance |
| **Positiver Testfall** | ApprovalPolicy mit minimumReviewers: 2 → valide |
| **Negativer Testfall** | ApprovalPolicy mit minimumReviewers: 0 → Policy-Validierung lehnt ab |
| **Kritischer Edge Case** | minimumReviewers: 1 mit Unanimous-Quorum → ein Reviewer reicht → gültig; kein Bypass |
| **Quelle** | approval-model H-03 |
| **Priorität** | high |

---

### AP-03
| Feld | Inhalt |
|------|--------|
| **Regelname** | Submitter ≠ Approver (SoD: AUTHOR_CANNOT_APPROVE_OWN) |
| **Module** | governance |
| **Positiver Testfall** | UserA submitted → UserB approved → erlaubt |
| **Negativer Testfall** | UserA submitted → UserA approved → SEPARATION_OF_DUTY_VIOLATION |
| **Kritischer Edge Case** | UserA hat sowohl ContentAuthor- als auch Approver-Rolle → SoD wird auf Operation-Ebene geprüft, nicht Rollen-Ebene; Approval durch UserA auf eigenes Submission abgelehnt |
| **Quelle** | governance-model §2.5, approval-model H-03 |
| **Priorität** | high |

---

### AP-04
| Feld | Inhalt |
|------|--------|
| **Regelname** | Approver ≠ Releaser (SoD: APPROVER_CANNOT_RELEASE) |
| **Module** | governance, release |
| **Positiver Testfall** | UserA approved Package → UserB released Package → erlaubt |
| **Negativer Testfall** | UserA approved Package → UserA released Package → SEPARATION_OF_DUTY_VIOLATION |
| **Kritischer Edge Case** | UserA hat Approver + Releaser-Rolle → SoD auf Operation-Ebene: UserA darf ein Package releasen, das von UserB approved wurde — aber nicht das, das UserA selbst approved hat |
| **Quelle** | governance-model §2.5, content-lifecycle-final T4 |
| **Priorität** | high |

---

### AP-05
| Feld | Inhalt |
|------|--------|
| **Regelname** | ApprovalDecision ist versionId-gebunden und wird stale bei neuer Version |
| **Module** | governance, versioning |
| **Positiver Testfall** | Decision gegen v2 → v2 ist currentVersionId → Decision zählt zum Quorum |
| **Negativer Testfall** | Decision gegen v2 → neue Version v3 erstellt (v2 superseded) → Decision zählt nicht für v3-Quorum |
| **Kritischer Edge Case** | v2 approved (2 Decisions), dann recalled → neue Version v3 → v2-Decisions sind stale → v3 braucht frische Decisions |
| **Quelle** | version-model Foundational Rule #4, approval-model EC-04 |
| **Priorität** | high |

---

### AP-06
| Feld | Inhalt |
|------|--------|
| **Regelname** | Quorum-Auflösung triggert NICHT automatisch Lifecycle-Transition |
| **Module** | governance, lifecycle |
| **Positiver Testfall** | Quorum resolvert → Outcome-Signal an Lifecycle-Service → Service prüft Preconditions → bei Erfolg: Transition |
| **Negativer Testfall** | Quorum resolvert → Entity wird zwischen Quorum und Lifecycle-Check suspended → Entity bleibt InReview; lifecycleExecuted: false |
| **Kritischer Edge Case** | Zwei Decisions kommen gleichzeitig an → exakt eine Quorum-Resolution → exakt eine Lifecycle-Transition; zweite Submission nach Quorum-Lock abgelehnt |
| **Quelle** | approval-model Foundational Rule, EC-07, EC-08 |
| **Priorität** | high |

---

### AP-07
| Feld | Inhalt |
|------|--------|
| **Regelname** | Policy ist eingefroren zum InReview-Zeitpunkt |
| **Module** | governance |
| **Positiver Testfall** | Policy vor Submit: minimumReviewers=1 → Review startet → Policy geändert auf minimumReviewers=2 → laufender Review verwendet minimumReviewers=1 |
| **Negativer Testfall** | (kein Negativfall — Regel schützt vor unbeabsichtigter Änderung; Policy-Change hat immer nur prospektive Wirkung) |
| **Kritischer Edge Case** | OrgAdmin ändert Policy während 5 Reviews laufen → alle laufenden Reviews nutzen alte Policy; neue Reviews ab sofort neue Policy |
| **Quelle** | approval-model EC-06 |
| **Priorität** | medium |

---

### AP-08
| Feld | Inhalt |
|------|--------|
| **Regelname** | rationale ist mandatory auf allen ApprovalDecisions (alle Outcomes) |
| **Module** | governance |
| **Positiver Testfall** | Decision `{ outcome: "Approved", rationale: "Medically sound, compliant with protocol X" }` → valide |
| **Negativer Testfall** | Decision `{ outcome: "Approved", rationale: "" }` → abgelehnt: RATIONALE_REQUIRED |
| **Kritischer Edge Case** | Decision `{ outcome: "Abstained", rationale: "No objections" }` → Abstain braucht ebenfalls rationale |
| **Quelle** | approval-model §2, requireRationale: fixed true |
| **Priorität** | medium |

---

### AP-09
| Feld | Inhalt |
|------|--------|
| **Regelname** | RequestChanges triggert keine Lifecycle-Transition und kein Edit-Lock-Aufheben |
| **Module** | governance, lifecycle |
| **Positiver Testfall** | Reviewer sendet RequestChanges → Entity bleibt InReview; Autor wird notifiziert |
| **Negativer Testfall** | RequestChanges-Outcome → Entity wechselt zurück zu Draft → abgelehnt: kein automatischer Draft-Wechsel |
| **Kritischer Edge Case** | Author versucht nach RequestChanges direkt zu editieren → InReview ist gesperrt; korrekte Lösung: Review muss als Rejected abgeschlossen werden, dann neue Version |
| **Quelle** | approval-model §2 (RequestChanges), EC-03 |
| **Priorität** | medium |

---

### AP-10
| Feld | Inhalt |
|------|--------|
| **Regelname** | Majority-Quorum: Tie geht an Rejected |
| **Module** | governance |
| **Positiver Testfall** | 2 Approved vs 1 Rejected (minimumReviewers: 2) → Majority → Approved |
| **Negativer Testfall** | 1 Approved vs 1 Rejected (minimumReviewers: 2) → Tie → Rejected |
| **Kritischer Edge Case** | 2 Approved, 2 Rejected, 1 Abstained → Tie → Rejected (Abstained zählt nicht für Richtung) |
| **Quelle** | approval-model Majority-Quorum |
| **Priorität** | medium |

---

### AP-11
| Feld | Inhalt |
|------|--------|
| **Regelname** | Abgelaufene UserRole-Decisions sind zum Submit-Zeitpunkt valide, nicht zum Quorum-Zeitpunkt |
| **Module** | governance |
| **Positiver Testfall** | Reviewer submits Decision bei T=0 (Rolle aktiv) → Rolle läuft bei T=1 ab → Quorum bei T=2 → Decision von T=0 zählt |
| **Negativer Testfall** | Reviewer versucht Decision bei T=2 einzureichen (Rolle abgelaufen seit T=1) → abgelehnt: NO_ACTIVE_ROLE |
| **Kritischer Edge Case** | Rolle war zum Submit-Zeitpunkt abgelaufen (T=0 nach Expiry) → Decision war nie valide; wird aus Quorum-Berechnung ausgeschlossen |
| **Quelle** | approval-model EC-05 |
| **Priorität** | medium |

---

## Kategorie 4 — Versioning (VR)

### VR-01
| Feld | Inhalt |
|------|--------|
| **Regelname** | Version-Records sind Write-Once — keine Updates |
| **Module** | versioning |
| **Positiver Testfall** | Version wird geschrieben → alle Felder (außer lineageState) bleiben permanent unveränderlich |
| **Negativer Testfall** | Update-Versuch auf versionNumber → abgelehnt: ENTITY_IMMUTABLE |
| **Kritischer Edge Case** | lineageState ist die einzige Ausnahme → darf nur additiv erweitert werden (Active → Active+Superseded), nie reduziert |
| **Quelle** | version-model HC-V-01, Foundational Rule #1 |
| **Priorität** | high |

---

### VR-02
| Feld | Inhalt |
|------|--------|
| **Regelname** | changeReason ist ab Version 2 mandatory |
| **Module** | versioning |
| **Positiver Testfall** | Version v1: changeReason kann null sein → erlaubt |
| **Negativer Testfall** | Version v2 ohne changeReason → abgelehnt: HC-V-06 |
| **Kritischer Edge Case** | changeReason = "update" (Placeholder) → sollte beim Review flagged werden; domain-level: Mindestnicht-leer-String-Validierung |
| **Quelle** | version-model HC-V-06 |
| **Priorität** | medium |

---

### VR-03
| Feld | Inhalt |
|------|--------|
| **Regelname** | versionNumber ist monoton steigend, keine Lücken, kein manual Override |
| **Module** | versioning |
| **Positiver Testfall** | Entity hat v1, v2 → neue Version bekommt v3 → korrekt |
| **Negativer Testfall** | Versuch, versionNumber: 5 bei einer Entity mit max v2 zu setzen → abgelehnt: HC-V-04 |
| **Kritischer Edge Case** | Concurrent Version-Creation für dieselbe Entity → nur eine gewinnt; zweite wird abgelehnt (Phase 0: keine parallelen Drafts) |
| **Quelle** | version-model HC-V-04 |
| **Priorität** | medium |

---

### VR-04
| Feld | Inhalt |
|------|--------|
| **Regelname** | Keine parallelen Draft-Forks in Phase 0 |
| **Module** | versioning, lifecycle |
| **Positiver Testfall** | Entity in Draft → Edit → Submit → InReview → (Rejected) → neue Version in Draft erstellen → erlaubt |
| **Negativer Testfall** | Entity in InReview → Versuch, neue Version in Draft zu erstellen → abgelehnt: HC-V-07 |
| **Kritischer Edge Case** | Entity in Draft → zweiter Author versucht ebenfalls Draft-Version zu erstellen → zweite Draft-Erstellung abgelehnt |
| **Quelle** | version-model HC-V-07, EC-01 |
| **Priorität** | high |

---

### VR-05
| Feld | Inhalt |
|------|--------|
| **Regelname** | Released-Version-Deletion ist verboten |
| **Module** | versioning |
| **Positiver Testfall** | Version lesen, die in Released ContentPackage referenziert wird → erlaubt |
| **Negativer Testfall** | Delete-Versuch auf Version, die in Released ContentPackage ist → abgelehnt: HC-V-08 |
| **Kritischer Edge Case** | ContentPackage wird deprecated → die referenzierten Versions-Records bleiben trotzdem unveränderlich und nicht löschbar |
| **Quelle** | version-model HC-V-08 |
| **Priorität** | high |

---

### VR-06
| Feld | Inhalt |
|------|--------|
| **Regelname** | Keine impliziten "latest"-Referenzen |
| **Module** | versioning, content, release |
| **Positiver Testfall** | ContentPackage-Assembly: `{ algorithmId: "alg-1", versionId: "ver-42" }` → explizite versionId → erlaubt |
| **Negativer Testfall** | ContentPackage-Assembly: `{ algorithmId: "alg-1", versionId: "latest" }` → abgelehnt: HC-V-05 |
| **Kritischer Edge Case** | Service intern "resolves latest" und speichert dann explizite versionId → das ist der korrekte Weg; der gespeicherte Wert muss immer eine konkrete ID sein |
| **Quelle** | version-model HC-V-05 |
| **Priorität** | high |

---

### VR-07
| Feld | Inhalt |
|------|--------|
| **Regelname** | Rollback erstellt neuen Release-Record, modifiziert keinen bestehenden |
| **Module** | versioning, release |
| **Positiver Testfall** | Rollback → Release-Record B (Rollback-Type, packageVersionId = prior v1) wird erstellt; Release-Record A bleibt unveränderlich (status: Superseded) |
| **Negativer Testfall** | Rollback-Mechanismus, der Release-Record A's packageVersionId überschreibt → abgelehnt: HC-V-09 |
| **Kritischer Edge Case** | Rollback-Ziel hat Deprecated Content → Rollback abgelehnt; neues Package muss assemblt werden |
| **Quelle** | version-model HC-V-09, Part 5 |
| **Priorität** | high |

---

### VR-08
| Feld | Inhalt |
|------|--------|
| **Regelname** | snapshot-Feld enthält vollständige Kopie, ist selbst immutable |
| **Module** | versioning |
| **Positiver Testfall** | Version v2 snapshot enthält alle Felder wie sie zum v2-Erstellungszeitpunkt waren |
| **Negativer Testfall** | snapshot-Feld nach Write verändern → abgelehnt (Write-Once) |
| **Kritischer Edge Case** | Schema-Änderung im Domain-Model → alte Snapshots behalten ihre Originalstruktur; kein Auto-Migration auf Versions-Snapshots |
| **Quelle** | version-model §1.1, Core Immutability Rules |
| **Priorität** | medium |

---

### VR-09
| Feld | Inhalt |
|------|--------|
| **Regelname** | lineageState ist additiv — States werden nie entfernt |
| **Module** | versioning |
| **Positiver Testfall** | Version: Active → Active+Superseded → Active+Superseded+Released → korrekte additive Kette |
| **Negativer Testfall** | Versuch, lineageState von `Released+Superseded` auf `Superseded` zu reduzieren → abgelehnt |
| **Kritischer Edge Case** | Entity deprecated → alle ihre Versions bekommen zusätzlich `Deprecated` in lineageState; bestehende `Released`-States bleiben erhalten |
| **Quelle** | version-model §1.4, §6 |
| **Priorität** | medium |

---

## Kategorie 5 — ContentPackage Composition (CP)

### CP-01
| Feld | Inhalt |
|------|--------|
| **Regelname** | Composition ist auf Version-Record gespeichert, nicht auf Entity |
| **Module** | content, versioning |
| **Positiver Testfall** | ContentPackage.currentVersionId → Version-Record enthält composition-Liste → korrekt |
| **Negativer Testfall** | ContentPackage-Entity selbst hat composition-Felder → Architektur-Verletzung (statischer Test) |
| **Kritischer Edge Case** | Nach Reassembly: alte Version hat frozen composition; neue Version hat neue composition; beide abrufbar |
| **Quelle** | content-package-model HC-CP-01, §1.5 |
| **Priorität** | high |

---

### CP-02
| Feld | Inhalt |
|------|--------|
| **Regelname** | Kein Duplicate entityId innerhalb einer Kompositions-Typliste |
| **Module** | content |
| **Positiver Testfall** | Komposition: [{ algorithmId: "alg-1", versionId: "v2" }, { algorithmId: "alg-2", versionId: "v1" }] → valide |
| **Negativer Testfall** | Komposition: [{ algorithmId: "alg-1", versionId: "v2" }, { algorithmId: "alg-1", versionId: "v3" }] → abgelehnt: HC-CP-03 |
| **Kritischer Edge Case** | Selber Algorithm-entityId in algorithms-Liste UND in einem anderen Typ-Eintrag → Validation prüft per Typ; cross-type duplicates sind andere Entity-Typen und daher kein Konflikt |
| **Quelle** | content-package-model R-04, HC-CP-03, I-03 |
| **Priorität** | high |

---

### CP-03
| Feld | Inhalt |
|------|--------|
| **Regelname** | Jeder Kompositions-Entry braucht entityId UND versionId |
| **Module** | content |
| **Positiver Testfall** | `{ algorithmId: "alg-1", versionId: "ver-42" }` → valide |
| **Negativer Testfall** | `{ algorithmId: "alg-1" }` (versionId fehlt) → abgelehnt: HC-CP-02 |
| **Kritischer Edge Case** | `{ algorithmId: "alg-1", versionId: "" }` (leerer String) → abgelehnt wie null |
| **Quelle** | content-package-model R-01, HC-CP-02 |
| **Priorität** | high |

---

### CP-04
| Feld | Inhalt |
|------|--------|
| **Regelname** | Composition-versionId muss entity.currentVersionId matchen zur Release-Zeit |
| **Module** | content, release |
| **Positiver Testfall** | Package-composition referenziert Algorithm v3; Algorithm.currentVersionId = v3 → Release-Check bestanden |
| **Negativer Testfall** | Package-composition referenziert Algorithm v3; Algorithm wurde recalled und v4 ist jetzt currentVersionId → Release abgelehnt: COMPOSITION_VERSION_STALE |
| **Kritischer Edge Case** | Algorithm wird recalled nach Package-Approval → Package bleibt Approved; release-attempt schlägt fehl; Package muss recalled und reassembled werden |
| **Quelle** | content-package-model HC-CP-06, EC-10, I-05 |
| **Priorität** | high |

---

### CP-05
| Feld | Inhalt |
|------|--------|
| **Regelname** | Identische Komposition trägt Approval nicht weiter |
| **Module** | content, governance |
| **Positiver Testfall** | Package v1 (approved) → recalled → reassembly v2 (identische Komposition) → v2 braucht eigenen Approval-Cycle |
| **Negativer Testfall** | Code prüft ob Komposition identisch ist und überträgt Approval → Architektur-Verletzung: HC-CP-10 |
| **Kritischer Edge Case** | Nur releaseNotes geändert, Komposition gleich → trotzdem neuer Approval-Cycle; I-10 gilt für alle Felder-Änderungen auf Package-Version |
| **Quelle** | content-package-model I-10, HC-CP-10, EC-05 |
| **Priorität** | high |

---

### CP-06
| Feld | Inhalt |
|------|--------|
| **Regelname** | Alle composition-Entries müssen zum Assembly-Zeitpunkt existieren |
| **Module** | content, versioning |
| **Positiver Testfall** | Assembly mit existierender versionId → ContentPackage Version wird geschrieben |
| **Negativer Testfall** | Assembly mit nicht-existierender versionId → abgelehnt: I-02, R-06 |
| **Kritischer Edge Case** | Version existiert, ist aber von anderer Org → abgelehnt: CROSS_TENANT_COMPOSITION_ENTRY (L-02) |
| **Quelle** | content-package-model R-06, I-02 |
| **Priorität** | high |

---

### CP-07
| Feld | Inhalt |
|------|--------|
| **Regelname** | Released ContentPackage ist vollständig immutable |
| **Module** | content, release |
| **Positiver Testfall** | Released ContentPackage lesen → alle Felder abrufbar |
| **Negativer Testfall** | Update auf title oder releaseNotes eines Released Package → abgelehnt: HC-CP-08, I-07 |
| **Kritischer Edge Case** | slug-Feld: ist per Architektur "mutable by OrgAdmin", aber nach Release sollte es eingefroren sein → HC-CP-08 schlägt alle Felder nach Release |
| **Quelle** | content-package-model HC-CP-08, I-07 |
| **Priorität** | high |

---

### CP-08
| Feld | Inhalt |
|------|--------|
| **Regelname** | HardBlock-Dependencies blockieren Release |
| **Module** | content, release |
| **Positiver Testfall** | Package mit Warning-severity Dependency → Release proceeded; Warning in Audit-Record |
| **Negativer Testfall** | Package mit unresolved HardBlock-Dependency → Release abgelehnt: DEPENDENCY_HARD_BLOCK |
| **Kritischer Edge Case** | Dependency auf andere ContentPackage Version (Requires-type, HardBlock) → Release prüft, ob genannte Package-Version aktiv distributed ist |
| **Quelle** | content-package-model HC-CP-07, §5 |
| **Priorität** | medium |

---

### CP-09
| Feld | Inhalt |
|------|--------|
| **Regelname** | compositionSnapshot auf Release-Record ist vollständige selbstständige Kopie |
| **Module** | versioning, release |
| **Positiver Testfall** | Release-Record.compositionSnapshot enthält alle `{ entityId, versionId, entityType }` Entries |
| **Negativer Testfall** | compositionSnapshot ist ein Verweis/Reference auf ContentPackage-Version → Architektur-Verletzung: HC-CP-09 |
| **Kritischer Edge Case** | ContentPackage-Version-Record wird später irgendwie verändert → compositionSnapshot auf Release-Record bleibt unverändert (eigenständige Kopie) |
| **Quelle** | content-package-model HC-CP-09, version-model HC-V-10 |
| **Priorität** | high |

---

## Kategorie 6 — Governance Policies (GP)

### GP-01
| Feld | Inhalt |
|------|--------|
| **Regelname** | Entities tragen keine Autorisierungslogik |
| **Module** | alle Entity-Klassen |
| **Positiver Testfall** | Entity-Klasse enthält nur Felder und strukturelle Invarianten; keine capability-Checks |
| **Negativer Testfall** | Entity-Methode `canBeApprovedBy(userRole)` → Architektur-Verletzung: HC-G-01 (statischer Test) |
| **Kritischer Edge Case** | Entity hat `isEditable()` → erlaubt (reine State-Berechnung); Entity hat `checkApprovalPermission()` → verboten |
| **Quelle** | governance-model HC-G-01, §1.1 |
| **Priorität** | high |

---

### GP-02
| Feld | Inhalt |
|------|--------|
| **Regelname** | PolicyDecision ist einziger Rückgabetyp von Policies; allowed: false ist kein Exception |
| **Module** | governance/policies |
| **Positiver Testfall** | Policy-Funktion → gibt immer PolicyDecision zurück (allowed: true oder false) |
| **Negativer Testfall** | Policy wirft Exception für normales Authorization-Deny → Architektur-Verletzung: HC-G-02, HC-G-03 |
| **Kritischer Edge Case** | Policy kann Kontext nicht resolven (fehlende Policy-Konfiguration) → gibt `{ allowed: false, denyReason: "POLICY_UNRESOLVABLE" }` zurück (kein Default-Allow) |
| **Quelle** | governance-model HC-G-02, HC-G-03, HC-G-04 |
| **Priorität** | high |

---

### GP-03
| Feld | Inhalt |
|------|--------|
| **Regelname** | organizationId ist der erste Check in jeder Policy |
| **Module** | governance/policies |
| **Positiver Testfall** | Policy mit vollständigem Context → evaluiert alle Checks in Reihenfolge |
| **Negativer Testfall** | Policy prüft Capability bevor organizationId → Implementierung falsch (statischer Reihenfolge-Test) |
| **Kritischer Edge Case** | organizationId vorhanden aber Org nicht in DB → Policy prüft Organisation.status; unbekannte Org → ORGANIZATION_NOT_ACTIVE oder DATA_INTEGRITY_VIOLATION |
| **Quelle** | governance-model HC-G-05 |
| **Priorität** | high |

---

### GP-04
| Feld | Inhalt |
|------|--------|
| **Regelname** | OrgAdmin hat package.release nicht by default |
| **Module** | governance |
| **Positiver Testfall** | User mit OrgAdmin-Rolle und explizit zugewiesener package.release-Permission → Release erlaubt |
| **Negativer Testfall** | User mit OrgAdmin-Rolle ohne package.release-Permission versucht Release → CAPABILITY_NOT_GRANTED |
| **Kritischer Edge Case** | OrgAdmin versucht durch Admin-Shortcuts Release zu erzwingen ("ich bin Admin, ich darf alles") → Policy prüft konkretes Capability, nicht roleType |
| **Quelle** | governance-model HC-G-09 |
| **Priorität** | high |

---

### GP-05
| Feld | Inhalt |
|------|--------|
| **Regelname** | Policies sind stateless — kein I/O, keine Mutations |
| **Module** | governance/policies |
| **Positiver Testfall** | Policy-Funktion mit gleichen Inputs → immer gleicher Output (deterministisch) |
| **Negativer Testfall** | Policy ruft Repository-Methode intern auf → Architektur-Verletzung |
| **Kritischer Edge Case** | Policy erhält Repository-Daten als Context-Objekt (kein Repository-Call intern) → erlaubt; alle nötigen Daten werden vom Service vorher gesammelt und als Policy-Input übergeben |
| **Quelle** | governance-model §1.3, HC-G-01 |
| **Priorität** | high |

---

### GP-06
| Feld | Inhalt |
|------|--------|
| **Regelname** | Jede Policy-Entscheidung wird geloggt (Allow UND Deny) |
| **Module** | governance, shared/audit |
| **Positiver Testfall** | Policy erlaubt Operation → Audit-Record mit decision: true |
| **Negativer Testfall** | Policy lehnt ab → Audit-Record mit decision: false + denyReason (kein Silent-Drop) |
| **Kritischer Edge Case** | Audit-Write schlägt bei Deny fehl → ist nicht kritisch wie bei Erfolgsoperationen, aber sollte geloggt werden; kein Exception-Propagation der Audit-Failure für Denials |
| **Quelle** | governance-model HC-G-07 |
| **Priorität** | medium |

---

### GP-07
| Feld | Inhalt |
|------|--------|
| **Regelname** | ADMIN_CANNOT_SELF_ASSIGN — OrgAdmin darf sich nicht selbst Rollen zuweisen |
| **Module** | governance |
| **Positiver Testfall** | OrgAdmin UserA weist UserB eine Rolle zu → erlaubt |
| **Negativer Testfall** | OrgAdmin UserA weist sich selbst eine Rolle zu → SELF_ASSIGNMENT_PROHIBITED |
| **Kritischer Edge Case** | Wie bekommt der erste OrgAdmin einer neuen Organisation seine Rolle? → Platform-bootstrapping ist ein privilegierter Operation außerhalb des Domain-Modells; kein Self-Assign durch regulären Role-Assignment-Pfad |
| **Quelle** | governance-model §2.5, SoD-Tabelle |
| **Priorität** | medium |

---

### GP-08
| Feld | Inhalt |
|------|--------|
| **Regelname** | Re-Evaluation zur Ausführungszeit, nicht zum Approval-Zeitpunkt |
| **Module** | governance, release |
| **Positiver Testfall** | Package approved bei T=0 → Release bei T=5 → alle Preconditions zum T=5-Zeitpunkt geprüft → erlaubt |
| **Negativer Testfall** | Service cached Policy-Entscheidung vom Approval-Zeitpunkt und nutzt sie für Release → Architektur-Verletzung: HC-G-10 |
| **Kritischer Edge Case** | Actor-Rolle läuft zwischen Package-Approval und Release-Execution ab → Release: NO_ACTIVE_ROLE (aktuelle Evaluation); Approval-Entscheidung bleibt gültig (EC-05 aus approval-model) |
| **Quelle** | governance-model HC-G-10 |
| **Priorität** | high |

---

## Kategorie 7 — Release Preconditions (RP)

### RP-01
| Feld | Inhalt |
|------|--------|
| **Regelname** | Release-Checklist: alle 10 Bedingungen müssen gleichzeitig erfüllt sein |
| **Module** | release, governance, content, versioning |
| **Positiver Testfall** | Alle 10 Release-Preconditions erfüllt → Release erfolgreicher |
| **Negativer Testfall** | Nur 9 von 10 erfüllt (z.B. ein composition-Entry in InReview) → Release abgelehnt; kein partial release |
| **Kritischer Edge Case** | Bedingung 5 (composition re-validation) schlägt nach Bedingungen 1-4 fehl → gesamte Operation abgebrochen; kein Partial-State |
| **Quelle** | content-lifecycle-final Release-Checklist |
| **Priorität** | high |

---

### RP-02
| Feld | Inhalt |
|------|--------|
| **Regelname** | Composition re-validation zur Release-Ausführungszeit (nicht Approval-Zeitpunkt) |
| **Module** | release |
| **Positiver Testfall** | Package approved T=0, alle Content approved T=0 → Release T=5, Content noch approved → Release erlaubt |
| **Negativer Testfall** | Package approved T=0 → Content recalled zwischen T=0 und T=5 → Release T=5 → COMPOSITION_ENTRY_NOT_APPROVED |
| **Kritischer Edge Case** | Content re-approved nach Recall → Release-Attempt → passes; Package braucht kein Re-Approval; nur Composition-Re-Validation |
| **Quelle** | content-package-model §6, EC-02, HC-CP-05 |
| **Priorität** | high |

---

### RP-03
| Feld | Inhalt |
|------|--------|
| **Regelname** | Kein conflicting Active Release für gleichen Scope+Content |
| **Module** | release |
| **Positiver Testfall** | Erste Release für Scope X → erlaubt |
| **Negativer Testfall** | Zweite initiale Release für denselben Scope X → CONFLICTING_ACTIVE_RELEASE |
| **Kritischer Edge Case** | Zwei Package-Versions concurrently im Approved-Status für gleichen Scope → erste gewinnt; zweite muss als Update-Release mit supersededReleaseId strukturiert werden |
| **Quelle** | content-lifecycle-final EC-09, version-model EC-09 |
| **Priorität** | high |

---

### RP-04
| Feld | Inhalt |
|------|--------|
| **Regelname** | targetScope muss zur Release-Zeit aktiv und same-org sein |
| **Module** | release, tenant |
| **Positiver Testfall** | Package targets Station-1 (Active, org-A) → Release erlaubt |
| **Negativer Testfall** | Package targets Station-1 (Decommissioned zwischen Approval und Release) → TARGET_SCOPE_INACTIVE |
| **Kritischer Edge Case** | Package targets Region-X (org-A); zwischen Approval und Release wird Region-X zu org-B transferiert (unmöglich, aber als Invariante: orgId-Check läuft) → CROSS_TENANT_SCOPE_REFERENCE |
| **Quelle** | content-lifecycle-final T4-Precondition #7, EC-04 |
| **Priorität** | high |

---

### RP-05
| Feld | Inhalt |
|------|--------|
| **Regelname** | Rollback-Ziel: keine Deprecated-Content in composition |
| **Module** | release, versioning |
| **Positiver Testfall** | Rollback zu Package v1 → alle composition-Entries non-deprecated → Rollback erlaubt |
| **Negativer Testfall** | Rollback zu Package v1 → zwei composition-Entries referenzieren deprecated Content → DEPRECATED_REFERENCE_IN_COMPOSITION |
| **Kritischer Edge Case** | Rollback-Ziel ist `Approved` (noch nie released) → zulässig; aber composition-Entries müssen trotzdem non-deprecated sein |
| **Quelle** | version-model §5, EC-05, content-lifecycle-final EC-06 |
| **Priorität** | high |

---

### RP-06
| Feld | Inhalt |
|------|--------|
| **Regelname** | Version-Snapshot wird zum Release-Zeitpunkt geschrieben |
| **Module** | versioning, release |
| **Positiver Testfall** | Release → compositionSnapshot = vollständige Kopie der Composition zum Release-Zeitpunkt |
| **Negativer Testfall** | Release-Snapshot-Write schlägt fehl → gesamte Release-Operation wird abgebrochen: EC-10 |
| **Kritischer Edge Case** | Snapshot nach Release noch veränderbar → nein: Write-Once; Snapshot ist Bestandteil des immutablen Release-Records |
| **Quelle** | version-model HC-V-10, content-lifecycle-final EC-10 |
| **Priorität** | high |

---

### RP-07
| Feld | Inhalt |
|------|--------|
| **Regelname** | Package muss Approved-State haben, damit Release.currentVersionId-Package released werden kann |
| **Module** | release, governance |
| **Positiver Testfall** | Package approvalStatus == Approved → Release erlaubt |
| **Negativer Testfall** | Package approvalStatus == InReview → Release abgelehnt: PACKAGE_NOT_APPROVED |
| **Kritischer Edge Case** | Package-Version v2 Approved, aber Entity-currentVersionId zeigt auf v3 (neuere Version) → stale Approval; I-04: "stale approval does not authorize release of current Version" → Release abgelehnt |
| **Quelle** | content-package-model I-04, content-lifecycle-final T4-Precondition #1 |
| **Priorität** | high |

---

## Kategorie 8 — Survey Governance Boundary (SG)

### SG-01
| Feld | Inhalt |
|------|--------|
| **Regelname** | SurveyInsight hat keinen Write-Pfad in Governance oder Lifecycle |
| **Module** | survey |
| **Positiver Testfall** | SurveyInsight wird erstellt und gespeichert → keine Seiteneffekte auf Content-Entities |
| **Negativer Testfall** | SurveyInsight-Event triggert automatisch `content.recall` → abgelehnt: H-04 |
| **Kritischer Edge Case** | SafetyConcern-Insight mit priority: Critical → sichtbar für OrgAdmin als Advisory Signal; aber kein automatischer Trigger; Mensch mit content.recall muss manuell handeln |
| **Quelle** | approval-model H-04, content-lifecycle-final EC-08 |
| **Priorität** | high |

---

### SG-02
| Feld | Inhalt |
|------|--------|
| **Regelname** | ApprovalPolicy referenziert keine SurveyInsight-Records |
| **Module** | governance, survey |
| **Positiver Testfall** | ApprovalPolicy-Evaluation: liest nur UserRole, minimumReviewers, quorumType → keine Survey-Felder |
| **Negativer Testfall** | ApprovalPolicy enthält Feld `adjustQuorumFromSurveyPriority` → Architektur-Verletzung: H-04 |
| **Kritischer Edge Case** | Survey-Priority-Score in ApprovalPolicy als Kommentar dokumentiert (ohne Logik) → erlaubt als Dokumentation; verboten als ausgeführte Logik |
| **Quelle** | approval-model H-04, governance-model HC-G-08 |
| **Priorität** | high |

---

### SG-03
| Feld | Inhalt |
|------|--------|
| **Regelname** | Survey-Modul darf keine Imports aus governance/policies oder lifecycle/services haben |
| **Module** | survey |
| **Positiver Testfall** | SurveyInsight-Service: importiert nur aus tenant und shared/types |
| **Negativer Testfall** | SurveyInsight-Service importiert `TransitionAuthorizationPolicy` → abgelehnt: HC-G-08 (statischer Import-Test) |
| **Kritischer Edge Case** | Survey liest Content-Entity-Status (read-only, für Advisory-Darstellung) → erlaubt; Survey schreibt auf Content-Entity oder Policy → verboten |
| **Quelle** | governance-model HC-G-08, content-lifecycle-final Foundational Rule #2 |
| **Priorität** | high |

---

### SG-04
| Feld | Inhalt |
|------|--------|
| **Regelname** | SurveyInsight-targetEntityId muss same-org sein |
| **Module** | survey, tenant |
| **Positiver Testfall** | SurveyInsight (org-A) mit targetEntityId → Entity gehört org-A → erlaubt |
| **Negativer Testfall** | SurveyInsight (org-A) mit targetEntityId → Entity gehört org-B → abgelehnt: L-08 |
| **Kritischer Edge Case** | SurveyInsight ohne targetEntityId (generisches Feedback ohne Entity-Bezug) → erlaubt; targetEntityId ist optional |
| **Quelle** | tenant-model L-08, domain-entity-blueprint Invariants |
| **Priorität** | medium |

---

### SG-05
| Feld | Inhalt |
|------|--------|
| **Regelname** | SurveyInsight status-Übergänge: Pending → Acknowledged → Actioned/Dismissed (keine Regression) |
| **Module** | survey |
| **Positiver Testfall** | Pending → Acknowledged → Actioned (mit resolution) → korrekte Kette |
| **Negativer Testfall** | Actioned → Pending → abgelehnt (kein Rückschritt) |
| **Kritischer Edge Case** | Actioned ohne resolution-Text → abgelehnt: resolution is mandatory für Actioned und Dismissed |
| **Quelle** | domain-entity-blueprint SurveyInsight Invariants |
| **Priorität** | low |

---

## Teil 2 — Top 15 Pflichttests vor Core Implementation

Diese Tests müssen bestehen, bevor irgendein Service-Code implementiert wird. Sie sichern die architekturellen Invarianten, die alle weiteren Implementierungen tragen.

---

### P-01 — Tenant-Isolation-Baseline *(Priorität: KRITISCH)*

```
Testziel: organizationId ist mandatory auf Read und Write
Testkategorie: Unit
Module: tenant

Setup:
  - Organization "org-A" und "org-B" existieren
  - Algorithm in org-A

Testfälle:
  ✓ findAlgorithms({ organizationId: "org-A" }) → gibt nur org-A-Records zurück
  ✗ findAlgorithms({}) → abgelehnt, bevor DB-Query
  ✗ createAlgorithm({ title: "X" }) ohne orgId → DomainError
  ✗ actor(org-B) modifies entity(org-A) → CROSS_TENANT_ACCESS_DENIED
```

---

### P-02 — PolicyDecision-Grundstruktur *(Priorität: KRITISCH)*

```
Testziel: Policies geben immer PolicyDecision zurück; kein implicit allow
Testkategorie: Unit
Module: governance/policies

Setup:
  - Policy-Funktionen mit verschiedenen Inputs

Testfälle:
  ✓ vollständiger Context → PolicyDecision mit allowed: true oder false
  ✗ fehlende organizationId → allowed: false + MISSING_ORGANIZATION_CONTEXT
  ✗ unbekannte Policy-Konfiguration → allowed: false + POLICY_UNRESOLVABLE (nicht allowed: true)
  ✗ Policy wirft Exception für normales Deny → Test schlägt fehl (Architektur-Verletzung)
```

---

### P-03 — Separation of Duty: Author ≠ Approver *(Priorität: KRITISCH)*

```
Testziel: Submitter kann eigenen Content nicht approven
Testkategorie: Unit
Module: governance/policies (TransitionAuthorizationPolicy)

Setup:
  - UserA submitted Algorithm-X (InReview)
  - UserA hält content.approve Capability

Testfälle:
  ✓ UserB mit content.approve → PolicyDecision.allowed: true
  ✗ UserA mit content.approve → allowed: false + SEPARATION_OF_DUTY_VIOLATION
  ✗ UserA mit OrgAdmin-Rolle ZUSÄTZLICH → SoD gilt trotzdem; OrgAdmin-Rolle ändert nichts
```

---

### P-04 — Separation of Duty: Approver ≠ Releaser *(Priorität: KRITISCH)*

```
Testziel: Package-Approver kann selbst geprüftes Package nicht releasen
Testkategorie: Unit
Module: governance/policies (ReleaseAuthorizationPolicy)

Setup:
  - UserA approved ContentPackage-Y
  - UserA hält package.release Capability

Testfälle:
  ✓ UserB mit package.release approved packages (von UserA approved) → allowed: true
  ✗ UserA mit package.release eigenes approved Package → allowed: false + SEPARATION_OF_DUTY_VIOLATION
```

---

### P-05 — Released-Entity ist immutable *(Priorität: KRITISCH)*

```
Testziel: Kein Feld einer Released Entity kann geändert werden
Testkategorie: Unit
Module: lifecycle, content

Setup:
  - Algorithm in Released-Zustand

Testfälle:
  ✓ Read-Operationen auf Released Algorithm → erfolgreich
  ✗ Edit (title, decisionLogic) auf Released Algorithm → ENTITY_IMMUTABLE
  ✗ Recall auf Released Algorithm → ENTITY_ALREADY_RELEASED
  ✗ ApprovalStatus-Änderung auf Released Algorithm → TRANSITION_NOT_PERMITTED
```

---

### P-06 — Approved → Released nur via ContentPackage *(Priorität: KRITISCH)*

```
Testziel: Content-Entities werden nie direkt released
Testkategorie: Unit + Integration
Module: lifecycle, release

Testfälle:
  ✓ ContentPackage.release → alle referenzierten Content-Entities wechseln zu Released
  ✗ Direkter releaseContent(algorithmId)-Call → kein direkter Release-Pfad existiert
  ✗ ContentPackage.release wenn ein Content-Entry in InReview → COMPOSITION_ENTRY_NOT_APPROVED
```

---

### P-07 — Kein Auto-Approve *(Priorität: KRITISCH)*

```
Testziel: Kein automatischer Approval-Mechanismus
Testkategorie: Unit
Module: governance, lifecycle

Testfälle:
  ✗ Timer/Timeout setzt ApprovalStatus auf Approved → kein solcher Mechanismus existiert
  ✗ minimumReviewers: 0 in Policy → Policy-Validierung lehnt ab
  ✗ OrgAdmin kann sich selbst approven (auf eigene Submission) → SoD-Violation
  ✗ Survey-Event triggert Approval → kein Event-Handler
  ✓ Timeout → nur Notification an OrgAdmin; Entity bleibt InReview
```

---

### P-08 — Version Write-Once *(Priorität: KRITISCH)*

```
Testziel: Versions-Records sind immutable nach dem Schreiben
Testkategorie: Unit
Module: versioning

Testfälle:
  ✓ Version lesen → alle Felder vorhanden
  ✗ Update auf versionNumber → abgelehnt
  ✗ Update auf snapshot → abgelehnt
  ✗ Delete auf Released-Version → abgelehnt (HC-V-08)
  ✓ lineageState additiv erweitern → erlaubt (Active → Active+Released)
  ✗ lineageState reduzieren → abgelehnt
```

---

### P-09 — Composition-Version-Staleness *(Priorität: KRITISCH)*

```
Testziel: Release schlägt fehl wenn composition.versionId ≠ entity.currentVersionId
Testkategorie: Integration
Module: release, content, versioning

Setup:
  - ContentPackage approved mit Algorithm v2 in composition
  - Algorithm v2 recalled → v3 erstellt → v3 ist currentVersionId

Testfälle:
  ✗ Release-Attempt → COMPOSITION_VERSION_STALE (composition referenziert v2, entity auf v3)
  ✓ Recall package → reassemble mit Algorithm v3 → re-approve → Release → erfolgreich
```

---

### P-10 — Atomic Release mit Rollback bei Audit-Failure *(Priorität: KRITISCH)*

```
Testziel: Audit-Write-Failure bricht gesamte Release-Operation ab
Testkategorie: Integration
Module: release, shared/audit

Setup:
  - ContentPackage mit 3 Content-Entities
  - Audit-Service simuliert Fehler bei 3. Audit-Write

Testfälle:
  ✗ Release-Attempt → 3. Audit schlägt fehl → vollständiger Rollback
  ✓ Alle 3 Entities bleiben in Approved-Zustand
  ✓ ContentPackage bleibt in Approved-Zustand
  ✓ Kein Release-Record ist in der DB
```

---

### P-11 — Survey hat null Impact auf Lifecycle *(Priorität: KRITISCH)*

```
Testziel: Kein Survey-Event verändert ContentApprovalStatus
Testkategorie: Unit + Integration
Module: survey, lifecycle

Testfälle:
  ✓ SurveyInsight(SafetyConcern, Critical) erstellt → Entity-ApprovalStatus unverändert
  ✓ SurveyInsight verweist auf Released Algorithm → Algorithm bleibt Released
  ✗ Survey-Import-Statement in lifecycle/services → statischer Import-Test schlägt fehl
  ✗ Survey-Import-Statement in governance/policies → statischer Import-Test schlägt fehl
```

---

### P-12 — Tenant-Isolation: Vollständige Leak-Vector-Matrix (L-01 bis L-12) *(Priorität: KRITISCH)*

```
Testziel: Alle 12 Tenant-Leak-Vektoren sind abgesichert
Testkategorie: Unit
Module: tenant, alle

Testfälle (je ein dedizierter Test pro Leak-Vector):
  L-01: Query ohne organizationId → abgelehnt
  L-02: Cross-org Content in ContentPackage → abgelehnt
  L-03: Cross-org Algorithm→Medication-Ref → abgelehnt
  L-04: Cross-org scopeTargetId in UserRole → abgelehnt
  L-05: Cross-org targetScope in ContentPackage → abgelehnt
  L-06: Cross-org createdBy in Version → abgelehnt
  L-07: Cross-org Reviewer → abgelehnt
  L-08: Cross-org SurveyInsight-Target → abgelehnt
  L-09: Cross-org predecessorVersionId → abgelehnt
  L-10: Permission-Eval ohne orgId → DomainError (nicht false)
  L-11: Audit ohne orgId → abgelehnt
  L-12: contentSharingPolicyExists() → false
```

---

### P-13 — Parallel Draft Forks blockiert *(Priorität: HIGH)*

```
Testziel: Kein zweiter Draft/InReview gleichzeitig für dieselbe Entity
Testkategorie: Unit
Module: versioning, lifecycle

Setup:
  - Algorithm in InReview-Zustand

Testfälle:
  ✗ Neue Version erstellen während InReview → abgelehnt: HC-V-07
  ✓ Algorithm wird Rejected → neue Version in Draft erstellen → erlaubt
  ✓ Algorithm wird Approved → Recall → neue Version erstellen → erlaubt
```

---

### P-14 — OrgAdmin hat package.release nicht by default *(Priorität: HIGH)*

```
Testziel: roleType "OrgAdmin" allein reicht nicht für Release
Testkategorie: Unit
Module: governance

Setup:
  - UserA hat OrgAdmin-Rolle ohne explizite package.release-Permission
  - ContentPackage ist Approved

Testfälle:
  ✗ UserA (OrgAdmin, kein package.release) → Release → CAPABILITY_NOT_GRANTED
  ✓ UserA bekommt explizit package.release-Permission → Release erlaubt
  ✗ Code prüft `roleType === "OrgAdmin"` als Shortcut für Release → statischer Test schlägt fehl
```

---

### P-15 — Identische Composition trägt kein Approval weiter *(Priorität: HIGH)*

```
Testziel: Jede ContentPackage-Version braucht eigenen Approval-Cycle
Testkategorie: Unit
Module: content, governance

Setup:
  - ContentPackage v1 war Approved, wurde recalled
  - ContentPackage v2 hat exakt gleiche composition wie v1

Testfälle:
  ✓ v2 hat approvalStatus: Draft → braucht eigenen InReview-Approved-Cycle
  ✗ Composition-Vergleich gibt v2 den Approved-Status von v1 → abgelehnt: HC-CP-10
  ✓ v2 geht durch normalen Approval-Cycle → danach Released → korrekt
```

---

## Teil 3 — Invariants für Unit-Tests

Jede der folgenden Invarianten muss durch mindestens einen Unit-Test abgesichert sein.
Tests für Invarianten sind **non-negotiable** — sie sind kein Nice-to-have.

### Gruppe A — Entity-Invarianten

```
INV-A-01  Algorithm.organizationId ist nach Erstellung immutable
INV-A-02  Algorithm.id ist nach Erstellung immutable
INV-A-03  Medication.dosageGuidelines muss mindestens eine Route und eine Dosis enthalten
INV-A-04  Protocol.regulatoryBasis muss vor Submit vorhanden sein
INV-A-05  Guideline.evidenceBasis muss vor Submit deklariert sein
INV-A-06  ContentPackage.approvalStatus wird ausschließlich durch System-Operationen gesetzt
INV-A-07  ContentPackage-Composition ist auf Version-Record, nicht auf Entity
INV-A-08  ContentPackage.currentVersionId ist system-only
INV-A-09  Station kann keinen Content besitzen (Station = release target only)
INV-A-10  Region/County/Station sind keine Tenant-Grenzen
INV-A-11  SurveyInsight kann keine Content-Entity direkt modifizieren
INV-A-12  Decommissioned Station bleibt als Record erhalten (kein Delete)
```

### Gruppe B — ApprovalStatus-Invarianten

```
INV-B-01  Draft ist editierbar; alle anderen States sind gesperrt
INV-B-02  InReview ist locked — kein Edit möglich
INV-B-03  Approved → Released ausschließlich via ContentPackage.release
INV-B-04  Released ist vollständig immutable
INV-B-05  Rejected ist terminal für diese Version (kein weiterer Übergang)
INV-B-06  Deprecated ist terminal (absolut)
INV-B-07  Draft → Approved ohne Review → verboten
INV-B-08  Draft → Released ohne Review und Package → verboten
INV-B-09  InReview → Draft → verboten (nur Recall nach Approved möglich)
INV-B-10  InReview → Released → verboten
INV-B-11  Released → Draft/InReview/Approved/Rejected → verboten
INV-B-12  ApprovalStatus-Änderung ohne Audit-Record → verboten
```

### Gruppe C — Version-Invarianten

```
INV-C-01  Version-Record ist write-once (alle Felder außer lineageState)
INV-C-02  lineageState ist nur additiv erweiterbar, nie reduzierbar
INV-C-03  versionNumber ist monoton steigend per Entity, beginnt bei 1
INV-C-04  predecessorVersionId muss same-org + same-entityId sein
INV-C-05  changeReason ist mandatory ab versionNumber 2
INV-C-06  snapshot enthält vollständige Feldkopie zum Erstellungszeitpunkt
INV-C-07  Released-Version darf nicht gelöscht werden
INV-C-08  Keine zwei Versionen derselben Entity in Draft oder InReview gleichzeitig
INV-C-09  ApprovalDecision ist an versionId gebunden; stale bei neuer Version
INV-C-10  Rollback erstellt neuen Release-Record; modifiziert keinen bestehenden
INV-C-11  compositionSnapshot auf Release-Record ist selbstständige Kopie, kein Verweis
INV-C-12  Lineage-Kette ist vollständig rekonstruierbar via predecessorVersionId bis v1
```

### Gruppe D — Governance-Invarianten

```
INV-D-01  PolicyDecision ist einziger Rückgabetyp von Policies
INV-D-02  allowed: false ist kein Exception — normaler Rückgabewert
INV-D-03  Fehlender Kontext → POLICY_UNRESOLVABLE (kein Default-Allow)
INV-D-04  organizationId ist erster Check in jeder Policy
INV-D-05  Policies sind stateless und deterministisch
INV-D-06  Jede Entscheidung (allow + deny) wird geloggt
INV-D-07  UserRole.organizationId ist immutable nach Erstellung
INV-D-08  OrgAdmin hat package.release nicht by default
INV-D-09  Abgelaufene UserRole liefert keine Capabilities (treated as absent)
INV-D-10  Permission-Grant gilt nie cross-organization
INV-D-11  Kein Permission-Grant ohne UserRole (keine anonymen Capabilities)
INV-D-12  Released-Artifact: keine Capability erlaubt Modifikation
```

### Gruppe E — Tenant-Invarianten

```
INV-E-01  organizationId fehlt → Query/Write abgelehnt (kein default)
INV-E-02  Cross-org Zugriff immer abgelehnt (außer contentSharingPolicy, Phase 0 disabled)
INV-E-03  contentSharingPolicyExists() gibt in Phase 0 immer false zurück
INV-E-04  Sub-scope entities (Region/County/Station) tragen keine Independent Authority
INV-E-05  Audit-Events ohne organizationId werden abgelehnt
INV-E-06  SurveyInsight-Targets müssen same-org sein
INV-E-07  Version.createdBy muss UserRole aus same-org sein
INV-E-08  ContentPackage.targetScope muss same-org sein
INV-E-09  Rollback unterliegt denselben Tenant-Constraints wie initiales Release
INV-E-10  organizationId darf nie aus Session/Context allein abgeleitet werden
```

### Gruppe F — ContentPackage-Invarianten

```
INV-F-01  Jeder Composition-Entry braucht entityId + versionId (beide mandatory)
INV-F-02  Kein Duplicate entityId innerhalb einer Typliste
INV-F-03  Alle Composition-Entries müssen same-org wie Package sein
INV-F-04  Alle Composition-Entries müssen zum Assembly-Zeitpunkt existieren
INV-F-05  Composition-versionId muss entity.currentVersionId sein zur Release-Zeit
INV-F-06  Identische Composition trägt kein Approval weiter
INV-F-07  Released ContentPackage ist vollständig immutable (alle Felder)
INV-F-08  Mindestens ein Composition-Entry vor Submit
INV-F-09  HardBlock-Dependencies werden zur Release-Zeit geprüft
INV-F-10  Deprecated Content blockiert Release
```

### Gruppe G — Release-Invarianten

```
INV-G-01  Release-Precondition-Check ist vollständig (alle 10 Bedingungen)
INV-G-02  Partial-Release existiert nicht — alles oder nichts
INV-G-03  Audit-Write-Failure bricht gesamte Release-Operation ab
INV-G-04  Kein conflicting Active Release für gleichen Scope
INV-G-05  targetScope ist Active zur Release-Ausführungszeit
INV-G-06  One Active Release per { organizationId, targetScope }
INV-G-07  Release-Rollback ist neuer Release-Record (Forward-only)
INV-G-08  compositionSnapshot wird zur Release-Zeit geschrieben (keine spätere Anpassung)
INV-G-09  Co-Release aller Package-Content-Entities ist atomar
INV-G-10  Rollback mit Deprecated-Content-Entries → abgelehnt
```

### Gruppe H — Survey Boundary Invarianten

```
INV-H-01  Survey-Modul importiert nichts aus governance/policies
INV-H-02  Survey-Modul importiert nichts aus lifecycle/services
INV-H-03  ApprovalPolicy referenziert keine Survey-Daten
INV-H-04  SurveyInsight-Event triggert keine Lifecycle-Transition
INV-H-05  SafetyConcern-Priority triggert kein Auto-Recall
INV-H-06  SurveyInsight-Status-Kette ist einweg (kein Rückschritt zu Pending)
INV-H-07  Actioned/Dismissed ohne resolution → abgelehnt
```

---

## Anhang — Invariant-Testabdeckungs-Checkliste

Vor dem ersten Core-Implementation-Commit muss folgende Abdeckung bestehen:

```
Gruppe A (Entity):       12 Invarianten → 12 Tests      □
Gruppe B (ApprovalStatus): 12 Invarianten → 12 Tests    □
Gruppe C (Version):      12 Invarianten → 12 Tests      □
Gruppe D (Governance):   12 Invarianten → 12 Tests      □
Gruppe E (Tenant):       10 Invarianten → 10 Tests      □
Gruppe F (ContentPackage): 10 Invarianten → 10 Tests    □
Gruppe G (Release):      10 Invarianten → 10 Tests      □
Gruppe H (Survey):        7 Invarianten →  7 Tests      □
─────────────────────────────────────────────────────────
Total:                   85 Invarianten → 85 Unit-Tests  □

Top-15-Pflichttests (P-01 bis P-15):                    □
Tenant-Leak-Matrix (L-01 bis L-12):                     □
─────────────────────────────────────────────────────────
Gesamt-Mindestabdeckung vor Core-Implementation:       112 Tests
```
