# RESQBRAIN MASTER ROADMAP

---

# PHASE 0 — FOUNDATION (JETZT)

Ziel:
Architektur stabilisieren

Aufgaben:

Domain Entities finalisieren
Tenant Modell stabilisieren
Lifecycle definieren
Approval Status definieren
Version Modell definieren
Content Package Modell definieren
Governance Modell definieren

Output:

stabile Domain
keine Architekturänderungen mehr

---

# PHASE 1 — CORE PLATFORM

Ziel:
Content Plattform funktionsfähig

Aufgaben:

Content Entities implementieren
Content Lifecycle Engine
Approval Engine
Permission Engine
Release Engine
Audit Logging

Output:

Content kann:

erstellt werden
reviewed werden
approved werden
released werden

---

# PHASE 2 — ORGANIZATION MODEL

Ziel:
Multi Tenant Betrieb

Aufgaben:

Organization entity
Region entity
County entity
Station entity

Tenant Isolation

Permissions scoped

Output:

mehrere Organisationen möglich

---

# PHASE 3 — CONTENT MANAGEMENT

Ziel:
Content Verwaltung

Aufgaben:

Algorithm Editor
Medication Editor
Protocol Editor
Guideline Editor

Version Erstellung

Release Erstellung

---

# PHASE 4 — RELEASE SYSTEM

Ziel:
Versionierte Distribution

Aufgaben:

Content Package Builder
Release Versioning
Rollback System
Compatibility Checks

Output:

deterministische Releases

---

# PHASE 5 — SURVEY IMPORT (IN ~1 WOCHE)

Diese Phase startet nach Eingang der Umfrage Daten.

Input:

Survey Ergebnisse
Feature Votes
Region Unterschiede
Content Wünsche

Aufgaben:

Survey Parser
Survey Insight Modell
Aggregation Engine
Prioritization Engine

Output:

Survey Insights

---

# PHASE 6 — SURVEY BASED ROADMAP

Ziel:
Roadmap datengetrieben

Aufgaben:

Feature Ranking
Content Ranking
Organization Unterschiede
Gap Analyse

Output:

priorisierte Entwicklung

---

# PHASE 7 — MVP

MVP enthält:

Multi Tenant
Content Lifecycle
Release System
Survey Prioritization
Versioning
Governance

Nicht im MVP:

Editor UI vollständig
Offline Sync
Public API

---

# PHASE 8 — POST MVP

Offline Sync
API
Auth
Deployment
Organization onboarding

---

# PHASE 9 — SCALE

Cross Organization Sharing
Marketplace
Public Content
Analytics
Audit Compliance

---

# ROADMAP REGELN

Survey beeinflusst Priorisierung
nicht Governance

Approval bleibt verpflichtend

Release bleibt versioniert

Tenant bleibt isoliert

---

# NÄCHSTE 7 TAGE

Tag 1–2

Domain stabilisieren

Tag 3–4

Lifecycle implementieren

Tag 5–6

Release Engine

Tag 7

Survey Import
