# SURVEY IMPORT PLAN — RESQBRAIN

Authority Sources:
- docs/context/GLOBAL_PROJECT_SNAPSHOT.md
- docs/roadmap/MASTER_ROADMAP.md
- docs/context/09-survey-integration-plan.md

Status: AKTIV
Erwarteter Dateneingang: ca. 2026-03-31

---

## Zweck

Dieses Dokument beschreibt den vollständigen Plan für den Import, die Verarbeitung und die Nutzung von Umfragedaten als SurveyInsight-Signale.

SurveyInsight ist ausschließlich ein Priorisierungswerkzeug.
Es verändert keine Governance-Regeln, keinen Lifecycle und keinen Approval-Prozess.

---

## HARD CONSTRAINTS — UNVERÄNDERLICH

Diese Regeln gelten absolut. Sie können durch keinen Agenten, keinen Import-Prozess und keine Pipeline-Komponente überschrieben werden.

Survey darf niemals:

- Approval-Übergänge auslösen
- ApprovalStatus eines Inhalts verändern
- Einen Release erzeugen oder auslösen
- Einen ContentPackage-Build starten
- Content-Entitäten (Algorithm, Medication, Protocol, Guideline) direkt verändern
- Governance-Regeln überschreiben oder umgehen
- UserRole- oder Permission-Entscheidungen beeinflussen

Survey darf ausschließlich:

- Priorisierungskandidaten für die Roadmap erzeugen
- Nachfragesignale für Content-Entitäten speichern
- Regionale Unterschiede sichtbar machen
- Feature-Voting-Ergebnisse aggregieren
- Entscheidungsunterstützung für menschliche Reviewer bereitstellen

---

## PHASE A — VORBEREITUNG (JETZT, VOR DATENEINGANG)

Ziel:
Alle Strukturen sind bereit, bevor Umfragedaten eingehen.

Zeitfenster: Sofort bis Dateneingang (~2026-03-31)

---

### A1. SurveyInsight Entität definieren

SurveyInsight ist eine vollwertige Domain-Entität mit Organization-Scope.

Pflichtfelder:

| Feld | Typ | Beschreibung |
|---|---|---|
| id | UUID | Eindeutiger Bezeichner |
| organizationId | UUID | Pflicht. Tenant-Grenze. |
| regionId | UUID (optional) | Regionaler Scope |
| countyId | UUID (optional) | Landkreis-Scope |
| targetEntityType | Enum | Algorithm / Medication / Protocol / Guideline / Feature |
| targetEntityId | UUID (optional) | Referenz auf konkrete Entität, falls bekannt |
| insightType | Enum | demand / gap / issue / vote |
| value | Number | Quantitativer Wert (z.B. Stimmanzahl, Dringlichkeitswert) |
| confidence | Enum | low / medium / high |
| sourceRef | String | Referenz zur Ursprungsumfrage (z.B. Survey-ID, Batch-Name) |
| importedAt | Timestamp | Zeitpunkt des Imports |
| versionWindow | String (optional) | Version-Zyklus, für den dieser Insight relevant ist |
| rawPayload | JSON (optional) | Originaldaten aus dem Survey-Import für Rückverfolgbarkeit |

Governance-Feld:

| Feld | Typ | Beschreibung |
|---|---|---|
| governanceLocked | Boolean | Immer true. SurveyInsight kann Governance niemals auslösen. |

Modellierungsregeln:
- Jeder SurveyInsight-Datensatz trägt organizationId.
- SurveyInsight-Datensätze sind append-only. Keine nachträgliche Mutation importierter Rohdaten.
- SurveyInsight referenziert Content-Entitäten, verändert sie nicht.

---

### A2. Import-Datenvertrag definieren

Vor dem Dateneingang wird das erwartete Eingabeformat definiert.

Akzeptierte Eingabeformate:

- CSV (primär, aus Umfrage-Tools)
- JSON (für programmatische Lieferung)

Pflichtfelder im Eingabedatensatz:

| Feld | Pflicht | Beschreibung |
|---|---|---|
| organization_ref | Ja | Name oder ID der Organisation |
| region_ref | Nein | Regionale Zuordnung |
| county_ref | Nein | Landkreis-Zuordnung |
| content_type | Ja | Algorithm / Medication / Protocol / Guideline / Feature |
| content_ref | Nein | Name oder ID des Inhalts |
| insight_type | Ja | demand / gap / issue / vote |
| value | Ja | Numerischer Wert |
| confidence | Nein | low / medium / high (Default: medium) |

Fehlende Pflichtfelder führen zur Ablehnung des Datensatzes.
Unbekannte content_ref-Werte werden mit einem Warnflag importiert, nicht abgelehnt.

---

### A3. Import-Pipeline Architektur

Die Import-Pipeline besteht aus drei sequenziellen Schritten.

```
Rohdaten (CSV/JSON)
    ↓
[1] Parser
    ↓
[2] Validator
    ↓
[3] Transformer → SurveyInsight Entitäten
    ↓
[4] Persistence (Organization-scoped)
```

**Parser**
- Liest Rohdaten aus Datei oder Stream.
- Normalisiert Feldnamen und Zeichenkodierung.
- Gibt strukturierte Rohdatensätze aus.
- Schreibt keine Domain-Entitäten.

**Validator**
- Prüft Pflichtfelder.
- Löst organization_ref zu organizationId auf.
- Prüft Enum-Werte (insightType, confidence, targetEntityType).
- Gibt valide und invalide Datensätze getrennt aus.
- Bricht bei kritischen Fehlern (unbekannte Organization) ab.
- Loggt alle invaliden Datensätze mit Begründung.

**Transformer**
- Wandelt valide Rohdatensätze in SurveyInsight-Entitäten um.
- Setzt governanceLocked = true auf allen Datensätzen.
- Setzt importedAt auf aktuellen Zeitstempel.
- Schreibt rawPayload als Originalreferenz.

**Persistence**
- Speichert SurveyInsight-Entitäten Organization-scoped.
- Append-only. Kein Update importierter Rohdaten.
- Gibt Import-Protokoll aus (Anzahl importiert, abgelehnt, Warnungen).

---

### A4. Import-Protokoll

Jeder Import-Lauf erzeugt ein Import-Protokoll mit:

- Zeitstempel Start / Ende
- Anzahl gelesener Datensätze
- Anzahl valider Datensätze
- Anzahl importierter Datensätze
- Anzahl abgelehnter Datensätze (mit Begründung)
- Anzahl Datensätze mit Warnflag
- Organization-Aufschlüsselung

Das Import-Protokoll ist schreibgeschützt und auditierbar.

---

## PHASE B — NACH DATENEINGANG (~2026-03-31)

Ziel:
Importierte Survey-Daten werden aggregiert und als Priorisierungsgrundlage aufbereitet.

---

### B1. Aggregation Engine

Die Aggregation-Engine fasst SurveyInsight-Datensätze zusammen, ohne Governance zu berühren.

Aggregationen:

**Demand Aggregation**
Summiert demand-Insights pro Content-Entität.
Ausgabe: Ranked-Liste von Inhalten nach Nachfragestärke.

**Gap Aggregation**
Listet Inhalte mit gap-Insights.
Ausgabe: Inhaltslücken nach Häufigkeit und Organization-Kontext.

**Vote Aggregation**
Summiert vote-Insights pro Feature oder Content.
Ausgabe: Feature-Ranking per Organization.

**Regional Aggregation**
Vergleicht Insight-Verteilung über Regions und Counties.
Ausgabe: Regionale Unterschiede in Nachfrage und Lücken.

Aggregationsregeln:
- Aggregationen respektieren immer Tenant-Grenzen.
- Übergreifende Aggregationen (Cross-Organization) sind nur anonym und aggregiert, nie auf Einzeldatensätze heruntergebrochen.
- Aggregation verändert keine SurveyInsight-Rohdatensätze.

---

### B2. Prioritization Engine

Die Prioritization-Engine erzeugt Priorisierungskandidaten für die Roadmap.

Eingabe: Aggregations-Ergebnisse aus B1.

Ausgabe: PrioritizationCandidate-Datensätze.

PrioritizationCandidate-Felder:

| Feld | Beschreibung |
|---|---|
| targetEntityType | Algorithm / Medication / Protocol / Guideline / Feature |
| targetEntityId | Referenz auf Entität (optional) |
| organizationContext | Organization oder "cross-org" |
| score | Berechneter Prioritätswert |
| insightBasis | Insight-Typen, die diesen Score erzeugt haben |
| suggestedAction | review / create / update / deprecate |
| generatedAt | Zeitstempel |
| governanceLocked | Immer true |

Prioritization-Regeln:
- PrioritizationCandidate ist eine Empfehlung, keine Anweisung.
- Kein PrioritizationCandidate löst automatisch einen Workflow aus.
- Menschliche Reviewer entscheiden, welche Kandidaten in die Roadmap übernommen werden.
- PrioritizationCandidates werden nicht in ApprovalStatus- oder Lifecycle-Entitäten geschrieben.

---

### B3. Roadmap Einfluss

Survey-Daten beeinflussen die Roadmap auf folgendem Weg:

```
SurveyInsight Daten
    ↓
Aggregation Engine
    ↓
Prioritization Engine
    ↓
PrioritizationCandidates (lesbar)
    ↓
Menschlicher Reviewer / Orchestrator
    ↓
Roadmap-Aktualisierung (MASTER_ROADMAP.md)
    ↓
Planung → Claude Blueprint → Codex → Cursor
```

Survey-Daten berühren niemals:

```
ApprovalStatus
ContentPackage
Release
UserRole
Permission
```

Roadmap-Einfluss-Kategorien:

**Feature-Priorisierung**
Welche Features werden als nächstes gebaut?
Basis: vote-Aggregation.

**Content-Erstellungspriorisierung**
Welche neuen Algorithm/Medication/Protocol/Guideline-Typen werden benötigt?
Basis: demand- und gap-Aggregation.

**Regionale Unterschiede**
Welche Organizations oder Regions haben abweichende Anforderungen?
Basis: Regional-Aggregation.

**Lückenanalyse**
Welche Inhalte fehlen oder sind veraltet?
Basis: gap-Aggregation und issue-Aggregation.

---

## PHASE C — POST-MVP

Ziel:
Closed-Loop zwischen Release-Ergebnissen und Survey-Analyse.

Geplante Kapazitäten:
- Release-Ergebnisse werden mit SurveyInsight-Ursprungsdaten korreliert.
- Demand-Erfüllung nach Release wird gemessen.
- Langfristige Trendanalyse über Version-Fenster.

Phase C startet nach MVP-Abschluss.

---

## TIMELINE

| Zeitpunkt | Aktivität |
|---|---|
| Jetzt (2026-03-24) | Phase A: SurveyInsight-Entität und Datenvertrag definieren |
| 2026-03-25 bis 2026-03-28 | Phase A: Import-Pipeline Architektur und Validator vorbereiten |
| 2026-03-29 bis 2026-03-30 | Phase A: Import-Protokoll-Struktur fertigstellen |
| ~2026-03-31 | Dateneingang. Phase B startet. |
| Nach Dateneingang | Phase B: Import-Lauf, Aggregation, Prioritization |
| Nach Phase B | Roadmap-Aktualisierung auf Basis von PrioritizationCandidates |
| Post-MVP | Phase C: Closed-Loop-Reporting |

---

## GOVERNANCE-GRENZE — ZUSAMMENFASSUNG

Diese Tabelle ist die verbindliche Abgrenzung.

| Aktion | Survey erlaubt? |
|---|---|
| Priorisierungskandidat erzeugen | JA |
| Roadmap-Input liefern | JA |
| Nachfragesignale speichern | JA |
| Regionale Unterschiede anzeigen | JA |
| Feature-Voting aggregieren | JA |
| ApprovalStatus verändern | NEIN |
| Release auslösen | NEIN |
| ContentPackage erzeugen | NEIN |
| Content-Entität verändern | NEIN |
| Governance-Regel überschreiben | NEIN |
| UserRole oder Permission beeinflussen | NEIN |
| Lifecycle-Übergang auslösen | NEIN |

---

## REFERENZEN

docs/context/GLOBAL_PROJECT_SNAPSHOT.md — Survey Integration Abschnitt
docs/roadmap/MASTER_ROADMAP.md — Phase 5 und Phase 6
docs/context/09-survey-integration-plan.md — Survey Governance-Regeln
docs/planning/MVP_SCOPE_LOCK.md — Survey Pflichtbestandteil im MVP (Punkt 6)
docs/architecture/domain-model.md — SurveyInsight Entitätsdefinition
