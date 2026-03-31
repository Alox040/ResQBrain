# PROJECT SNAPSHOT — RESQBRAIN

Authority Sources:
- docs/agents/MULTI_AGENT_SETUP.md
- prompts/system/agent-rules.md
- docs/architecture/*

---

## Projektziel

ResQBrain ist eine Multi-Tenant EMS-Wissensplattform für Rettungsdienstorganisationen.

Die Plattform ermöglicht Organisationen:

- Klinische und operative Inhalte verwalten
- Inhalte durch Approval-Governance freigeben
- Versionierte Releases erzeugen und verteilen
- Organisationsspezifische Inhaltsvarianten definieren
- Survey-Signale für Priorisierungsentscheidungen nutzen
- Inhalte offlinefähig bereitstellen (Post-MVP)

Die Plattform ist Domain-first und vollständig UI-agnostisch.
Keine Abhängigkeit von einem bestimmten Backend-Stack oder UI-Framework.

## Last synchronized

- 2026-03-31

## Verification basis

- `README.md`, `package.json`, `pnpm-workspace.yaml`, `vercel.json`
- `apps/website/**`, `apps/website-old/**`
- `apps/mobile-app/**`
- `packages/domain/**`
- `data/lookup-seed/**`
- `docs/context/**`, `docs/context-export/**`

---

## Architekturprinzipien

Domain First
Jede Entität trägt Organization-Scope. Kein Domain-Record ohne Tenant-Kontext.

Multi Tenant First
Organization ist die primäre Tenant-Grenze für Dateneigentümerschaft, Permissions und Release-Sichtbarkeit.

Versioned Content
Releases sind immutable. Änderungen erzeugen neue Versionen, keine Rewrites.

Governance before Release
Kein Release ohne vollständigen Approval-Durchlauf. ApprovalStatus-Übergänge sind policy-kontrolliert.

Survey informed Roadmap
SurveyInsight beeinflusst ausschließlich Priorisierung. Nicht Approval, nicht Governance, nicht Lifecycle.

No Hardcoded Content
Kein medizinischer oder operativer Inhalt ist in der Anwendungslogik fest codiert.

Technology Agnostic Architecture
Architektur-Dokumente sind Stack-unabhängig. Keine Annahmen über Backend, Mobile oder Web.

---

## Domain Modell

### Primäre Entitäten

**Organization**
Tenant-Grenze. Träger aller Daten, Governance-Regeln und Release-Scopes.

**Region**
Sub-Scope innerhalb einer Organization. Steuert regionale Policy- und Inhaltsanwendbarkeit.

**County**
Optionaler weiterer Sub-Scope. Für regionale Unterschiede bei SurveyInsight und Permissions.

**Station**
Operative Einheit einer Organization. Optional Region/County zugeordnet.

**Algorithm**
Strukturierter medizinischer Entscheidungspfad. Verwaltet durch ApprovalStatus-Lifecycle.

**Medication**
Medikamenten-Referenzentität mit versionierten Revisionen und operativem Verwendungskontext.

**Protocol**
Formaler Verfahrensstandard einer Organization.

**Guideline**
Operative oder medizinische Empfehlung. Ergänzt Protocols.

**ContentPackage**
Versionierte Zusammenstellung aus Algorithms, Medications, Protocols und Guidelines. Release-Einheit.

**Version**
Immutabler Bezeichner für einen Content-Zustand oder Package-Zustand. Basis für Audit und Rollout.

**ApprovalStatus**
Lifecycle-Zustandsmaschine für Content und Packages.

**UserRole**
Rollenzuweisung im Organization-Scope.

**Permission**
Atomare Fähigkeit, ausgewertet per UserRole und Organization-Scope.

**SurveyInsight**
Strukturierter Priorisierungsinput. Verknüpft mit Organization, Region, County und Ziel-Entitäten.

### Beziehungsregeln

- Organization besitzt Regions, Stations, Algorithms, Medications, Protocols, Guidelines, ContentPackages.
- ContentPackage enthält explizite Version-Referenzen von Content-Entitäten.
- Content und ContentPackages tragen ApprovalStatus und Versionshistorie.
- UserRole gewährt Permissions im Organization-Scope.
- SurveyInsight kann Organization, Region, County und Ziel-Content referenzieren.
- Jeder Domain-Record enthält Organization-Scope.
- Versionshistorie ist append-only für freigegebene Artefakte.
- ApprovalStatus-Übergänge sind policy-kontrolliert durch Role und Permission.

---

## Tenant Modell

### Scope-Hierarchie

Organization
→ Region
→ County
→ Station

### Isolation

- Datenisolierung per Organization für alle Content- und Governance-Entitäten.
- Permission-Auswertung umfasst immer UserRole plus Organization-Kontext.
- Cross-Tenant-Zugriff standardmäßig verweigert.

### Customization

- Organizations definieren lokale Varianten von Algorithms, Medications, Protocols, Guidelines.
- Region- und County-Constraints verfeinern Anwendbarkeit innerhalb einer Organization.
- Shared Baseline Content nur über explizite Content-Sharing-Policy mit kontrollierter Vererbung.

### Operative Regeln

- Jede Query und jedes Command trägt Organization-Kontext.
- Tenant-Scope ist Teil von Auditing, Releasehistorie und Analyse-Partitionen.
- Regionale Unterschiede werden als scoped Configuration modelliert, nicht als separate Produkte.

---

## Content Lifecycle

### Lifecycle-Zustände

Draft
InReview
Approved
Rejected
Released
Deprecated

### Lifecycle-Ablauf

1. Content wird im Draft-Status erstellt.
2. Klinische und operative Überprüfung.
3. Approval-Entscheidung.
4. Package-Zusammenstellung aus approved Content.
5. Package-Validierung.
6. Release-Publikation.
7. Post-Release-Monitoring und Deprecation-Management.

### Validierungsregeln

- Kein Package-Release mit non-approved Content.
- Alle enthaltenen Items müssen dem gleichen Organization-Scope angehören, außer explizite Cross-Organization-Sharing-Policy existiert.
- Package-Version ist nach Release immutable.

---

## Versioning Modell

### Versioning-Einheiten

Entity Version
Individuelle Version einer Content-Entität (Algorithm, Medication, Protocol, Guideline).

ContentPackage Version
Versionierter Stand eines Release-Bundles.

Release Version
Release-Record, der eine ContentPackage-Version für einen Ziel-Organization-Scope referenziert.

### Versioning-Regeln

- Released Versions sind immutable.
- Neue Änderungen erzeugen neue Versions, keine Rewrites der Releasehistorie.
- Ein Release referenziert immer explizite Content-Versions.
- Rollback publiziert einen neuen Release, der auf ein älteres approved Version-Set verweist.

### Governance-Integration

- Nur autorisierte UserRoles mit erforderlichen Permissions können approven oder releasen.
- Versionslineage muss erfassen: wer was wann und warum geändert hat.
- SurveyInsight kann Priorities für künftige Versions vorschlagen, aber keine released Artefakte verändern.

---

## Content Package Modell

### Struktur

Ein ContentPackage enthält:

- Package-Metadaten (Organization, Scope, Zielgruppe)
- Enthaltene Algorithms (mit expliziter Version)
- Enthaltene Medications (mit expliziter Version)
- Enthaltene Protocols (mit expliziter Version)
- Enthaltene Guidelines (mit expliziter Version)
- Kompatibilitäts- und Abhängigkeitsnotizen
- Release Notes

### Eigenschaften

Versioniert
Immutable nach Release
Organization-scoped
Rollback durch neuen Release auf früherem Version-Set

---

## Survey Integration

### Zweck

SurveyInsight-Signale für Roadmap- und Content-Priorisierungsentscheidungen nutzbar machen, ohne Governance-Regeln zu verändern.

### Geplante Kapazitäten

- Nachfrage- und Feedback-Signale für Algorithms, Medications, Protocols, Guidelines.
- Nachfragevergleich über Organizations hinweg unter Wahrung der Tenant-Grenzen.
- Feature-Voting und Priority-Ranking per Organization-Kontext.
- Content-Demand-Trends über Zeit tracken und mit Releases korrelieren.

### Domain-Extension: SurveyInsight

Felder:
- Organization-Referenz (verpflichtend)
- Region/County-Scope (optional)
- Ziel-Domain-Entität
- Insight-Typ: demand | gap | issue | vote
- Confidence-Wert
- Aggregationsmodell für Trend-Analyse per Version-Fenster

### Governance-Regeln für Survey

SurveyInsight kann Priorisierungskandidaten erzeugen.
SurveyInsight kann niemals:
- Content auto-approven
- Content auto-releasen
- ApprovalStatus-Übergänge auslösen
- Governance-Regeln überschreiben

Medizinische Überprüfung und ApprovalStatus-Workflow bleiben verpflichtend.

### Integrations-Phasen

Phase A — Jetzt vorbereiten (~1 Woche)
Datenverträge und Storage-Grenzen definieren.

Phase B — Nach Survey-Dateneingang
Priorisierungs-Dashboards und Decision-Support-Outputs.

Phase C — Post-MVP
Closed-Loop-Reporting von Release-Ergebnissen zurück in SurveyInsight-Analyse.

---

## Aktueller Projektstatus

Phase: Foundation

### Abgeschlossen

Domain-Struktur dokumentiert
Content-Entitäten definiert
Versioning-Modell definiert
Tenant-Modell definiert
Lifecycle-Modell definiert
Governance-Modell definiert
Multi-Agent-Workflow definiert
Context- und Architektur-Docs als Authority etabliert

### Nicht implementiert

Backend-Services
Auth-System
Release Engine
Survey Import Pipeline
Organization Onboarding
Editor UI
Permission Engine
Approval Engine
Audit System
Offline Sync

---

## Architekturregeln

Keine UI-Logik im Domain Layer
Keine hardcodierten Inhalte
Alle Inhalte versioniert
Alle Änderungen approval-gated
Tenant-Boundary enforced auf jeder Ebene
Keine Stack-Annahmen in Architektur-Dokumenten
SurveyInsight beeinflusst nur Priorisierung

---

## Nächste Systembausteine

Content Lifecycle Services
Approval Engine
Permission Engine
Release Engine
Content Package Builder
Survey Import Pipeline (Phase A vorbereiten)
Organization Model (vollständig implementieren)
Audit System

---

## Multi-Agent Workflow

Gültige Reihenfolge:

ChatGPT (Planung) → Claude Code (Architektur) → Codex (Code-Generierung) → Cursor (Integration) → ChatGPT (Validierung)

Regeln:

- Kein Codex ohne Claude Blueprint
- Kein Cursor ohne Codex Output
- Keine Architekturentscheidungen außerhalb von Claude
- ChatGPT kontrolliert Planung
- Cursor integriert nur

Single Source of Truth:

docs/context/*
docs/roadmap/*
docs/planning/*
docs/agents/*

---

## Entscheidungsregeln

Survey beeinflusst Priorisierung — nicht Governance, nicht Approval, nicht Lifecycle.
Approval bleibt verpflichtend für jeden Release.
Release bleibt versioniert und immutable.
Tenant-Boundary bleibt immer enforced.
Domain-Layer bleibt UI-unabhängig.
