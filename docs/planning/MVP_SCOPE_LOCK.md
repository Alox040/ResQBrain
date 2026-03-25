# MVP SCOPE LOCK — RESQBRAIN

Authority Sources:
- docs/context/GLOBAL_PROJECT_SNAPSHOT.md
- docs/roadmap/MASTER_ROADMAP.md

Status: LOCKED
Änderungen an diesem Dokument erfordern explizite Freigabe durch den Orchestrator (ChatGPT).

---

## Zweck

Dieses Dokument definiert verbindlich den Umfang des MVP.
Es legt fest, was gebaut werden muss, was nicht gebaut wird, und welche Systeme verpflichtend sind.

Kein System darf ohne Eintrag in diesem Dokument als MVP-Bestandteil behandelt werden.

---

## MVP DEFINITION

Das MVP ist die erste lauffähige Version der Plattform, die folgende Kernaussage erfüllt:

Eine Organisation kann Inhalte erstellen, reviewen, approven, in einem ContentPackage bündeln und als versionierten Release verteilen.

Das MVP beweist die Plattform-Kernarchitektur unter echten Multi-Tenant-Bedingungen.

---

## MVP — PFLICHTBESTANDTEILE

Alle folgenden Systeme müssen im MVP vollständig implementiert und funktionsfähig sein.

---

### 1. Multi Tenant System

Pflicht.

Organization als primäre Tenant-Grenze.
Datenisolierung per Organization für alle Content- und Governance-Entitäten.
Cross-Tenant-Zugriff standardmäßig verweigert.
Jede Query und jedes Command trägt Organization-Kontext.

Scope-Hierarchie implementiert:
- Organization
- Region
- County
- Station

Exit-Kriterium:
Zwei Organizations existieren im System. Ihre Daten sind vollständig isoliert. Kein gegenseitiger Zugriff möglich.

---

### 2. Versioning System

Pflicht.

Jede Content-Entität trägt eine unveränderliche Version.
Released Versions sind immutable.
Neue Änderungen erzeugen neue Versions, keine Rewrites.
Versionslineage erfasst: wer, was, wann, warum.

Version-Einheiten:
- Entity Version (Algorithm, Medication, Protocol, Guideline)
- ContentPackage Version
- Release Version

Exit-Kriterium:
Ein Inhalt kann mehrfach versioniert werden. Frühere Versionen bleiben abrufbar. Ein Rollback publiziert eine neue Release-Version auf Basis eines älteren Version-Sets.

---

### 3. Content Lifecycle System

Pflicht.

Alle Content-Entitäten durchlaufen den definierten Lifecycle.

Zustände:
Draft → InReview → Approved → Released → Deprecated
Rejected als Übergangszustand.

Lifecycle-Regeln:
- Kein Package-Release mit non-approved Content.
- Übergänge sind policy-kontrolliert.
- Jeder Übergang ist auditierbar.

Content-Typen im Lifecycle:
- Algorithm
- Medication
- Protocol
- Guideline

Exit-Kriterium:
Ein Inhalt kann alle Lifecycle-Zustände durchlaufen. Ungültige Übergänge werden abgelehnt.

---

### 4. Governance System

Pflicht.

UserRole scoped zu Organization.
Permission als atomare Fähigkeit pro UserRole und Organization.
ApprovalPolicy steuert Lifecycle-Übergänge.
TransitionPolicy definiert erlaubte Zustandswechsel.

Regeln:
- Nur autorisierte UserRoles können approven oder releasen.
- Keine Umgehung der Approval-Chain.
- Governance-Entitäten sind Organization-scoped.

Exit-Kriterium:
Ein User ohne Approve-Permission kann keinen Approval-Übergang auslösen. Ein User mit Approve-Permission kann ihn auslösen. Beide Fälle sind testbar.

---

### 5. Release System

Pflicht.

ContentPackage als Release-Einheit.
Release referenziert immer explizite Content-Versions.
Package ist nach Release immutable.
Rollback über neuen Release auf älterem Version-Set.

ContentPackage enthält:
- Package-Metadaten (Organization, Scope, Zielgruppe)
- Algorithms (mit expliziter Version)
- Medications (mit expliziter Version)
- Protocols (mit expliziter Version)
- Guidelines (mit expliziter Version)
- Kompatibilitäts- und Abhängigkeitsnotizen
- Release Notes

Exit-Kriterium:
Ein ContentPackage kann erstellt, validiert und als Release publiziert werden. Ein Release auf non-approved Content schlägt fehl.

---

### 6. Survey Prioritization Vorbereitung

Pflicht im MVP als Vorbereitung. Keine vollständige Survey-Verarbeitung im MVP.

Folgendes muss im MVP vorhanden sein:

SurveyInsight-Entität definiert und speicherbar.
Felder:
- Organization-Referenz (verpflichtend)
- Region/County-Scope (optional)
- Ziel-Domain-Entität
- Insight-Typ: demand | gap | issue | vote
- Confidence-Wert

Governance-Grenze enforced:
- SurveyInsight kann keine Approvals auslösen.
- SurveyInsight kann keine Releases auslösen.
- SurveyInsight kann keine Lifecycle-Übergänge auslösen.

Exit-Kriterium:
SurveyInsight-Datensätze können gespeichert und abgefragt werden. Sie haben keinen automatisierten Einfluss auf Governance oder Lifecycle.

---

### 7. Audit System (Basis)

Pflicht.

Jeder relevante Domain-Event wird protokolliert:
- Wer hat gehandelt
- Welche Entität
- Welcher Zustand vorher / nachher
- Zeitstempel
- Organization-Kontext

Exit-Kriterium:
Nach einem Lifecycle-Übergang ist der Audit-Log-Eintrag vorhanden und lesbar.

---

## MVP — NICHT ENTHALTEN

Die folgenden Systeme sind explizit aus dem MVP ausgeschlossen.
Sie dürfen nicht als MVP-Anforderung behandelt werden.

---

### Offline Sync

Gesperrt.
Keine Offline-Fähigkeit der Clients im MVP.
Begründung: Erhöht Komplexität massiv. Kein Kernbeweis der Plattformarchitektur.
Geplant: Post-MVP (Phase 8).

---

### Marketplace

Gesperrt.
Keine Content-Sharing-Plattform über Organization-Grenzen hinaus.
Begründung: Erfordert Cross-Tenant-Policy, die die Tenant-Isolation-Grundlagen voraussetzt. MVP beweist Isolation zuerst.
Geplant: Scale Phase (Phase 9).

---

### Public Content Sharing

Gesperrt.
Kein öffentlicher Zugriff auf Content.
Kein öffentliches API.
Begründung: Auth und Tenant-Isolation müssen zuerst vollständig bewiesen sein.
Geplant: Scale Phase (Phase 9).

---

### Analytics System

Gesperrt.
Keine aggregierten Nutzungs- oder Compliance-Analysen im MVP.
Begründung: Audit-Log im MVP ist ausreichend für Nachvollziehbarkeit. Vollständige Analytics sind Post-MVP.
Geplant: Scale Phase (Phase 9).

---

### Vollständiges Editor UI

Gesperrt.
Kein vollständiger Content-Editor im MVP.
MVP beweist Domänenlogik, nicht UI.
Grundlegende Dateneingabe für Tests ist zulässig.
Geplant: Phase 3 und Post-MVP.

---

### Auth System (vollständig)

Gesperrt als Vollimplementierung.
MVP benötigt ausreichend Auth-Unterstützung, um Governance-Regeln zu testen.
Vollständiges Identity Management, SSO, OAuth sind Post-MVP.
Geplant: Phase 8.

---

### Organization Onboarding

Gesperrt als automatisierter Prozess.
Im MVP werden Organizations manuell angelegt.
Self-Service-Onboarding ist Post-MVP.
Geplant: Phase 8.

---

### Cross-Organization Sharing

Gesperrt.
Kein Content-Sharing über Organization-Grenzen ohne explizite Policy.
Begründung: Tenant-Isolation muss zuerst vollständig bewiesen sein.
Geplant: Scale Phase (Phase 9).

---

### Survey Aggregation und Prioritization Engine

Gesperrt im MVP als vollständiges System.
Im MVP wird nur die SurveyInsight-Entität vorbereitet (siehe Pflichtbestandteil 6).
Aggregation, Feature-Ranking, Gap-Analyse sind Phase 5 und 6.
Geplant: Phase 5 (nach Survey-Dateneingang in ~1 Woche).

---

## SCOPE LOCK REGELN

Diese Regeln sind verpflichtend und können nicht durch einzelne Agenten überschrieben werden.

Survey beeinflusst im MVP ausschließlich Priorisierung künftiger Arbeit.
Survey löst keine Approvals, Releases oder Lifecycle-Übergänge aus.

Approval bleibt verpflichtend für jeden Release.
Kein Mechanismus darf diesen Schritt umgehen.

Release bleibt versioniert.
Kein Release ohne explizite Version-Referenz.

Tenant-Boundary bleibt immer enforced.
Kein Domain-Record ohne Organization-Kontext.

Domain-Layer bleibt UI-unabhängig.
Keine UI-Logik in Domain-Entitäten oder Domain-Services.

Kein System wird als MVP-Bestandteil behandelt, das nicht in diesem Dokument unter "Pflichtbestandteile" aufgeführt ist.

---

## MVP EXIT KRITERIUM

Das MVP gilt als erreicht, wenn folgende Aussage vollständig verifizierbar ist:

Eine Organization kann einen Inhalt von Draft bis zum Released ContentPackage führen.
Der Prozess ist governance-gated, versioniert, tenant-isoliert und auditierbar.
SurveyInsight-Daten können erfasst werden, ohne Governance zu beeinflussen.

---

## REFERENZEN

docs/context/GLOBAL_PROJECT_SNAPSHOT.md — Projektstatus und Plattformarchitektur
docs/roadmap/MASTER_ROADMAP.md — Phase 7 MVP Definition
docs/architecture/domain-model.md — Entitäten und Modellierungsregeln
docs/architecture/versioning-model.md — Versioning-Regeln
docs/architecture/multi-tenant-model.md — Tenant-Isolation-Regeln
docs/architecture/content-model.md — Content-Lifecycle-Regeln
docs/context/09-survey-integration-plan.md — Survey-Governance-Regeln
