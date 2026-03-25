# Projekt-Roadmap

**Stand:** 25. März 2026  
Orientierung an `docs/context/12-next-steps.md` und Architektur-Dokumenten.

## Legende

- [x] Erreicht / für aktuelle Baseline erledigt
- [~] Teilweise / läuft
- [ ] Ausstehend

## Phase 0 — Fundament

| Punkt | Status |
|-------|--------|
| Architektur- und Terminologie-Basis (`docs/architecture`, `docs/context`) | [x] |
| Domain-Paket mit Typen, Invarianten, Versioning- und Content-Teilmengen | [~] |
| Öffentliche Website (Landing, Legal, statischer Build) | [x] |
| Routing- und Link-Validierung (Skripte + Build) | [x] |

## Phase 1 — Core Platform (MVP-Richtung)

| Punkt | Status |
|-------|--------|
| Domain-Baseline final an `domain-model.md` binden | [ ] |
| Content-Lifecycle (ApprovalStatus, Übergänge) als Domain-Services | [ ] |
| Rollen/Rechte-Modell an Lifecycle koppeln | [ ] |
| ContentPackage-Release-Mechanismus definieren | [ ] |
| API- und Auth-Grenzen spezifizieren | [ ] |

## Phase 2 — Multi-Tenant-Betrieb

| Punkt | Status |
|-------|--------|
| Organization als Laufzeit-Grenze in allen Operationen | [ ] |
| Region/County-Scoping über Metadaten hinaus ausbauen | [ ] |

## Phase 3 — Content-Management & Editor

| Punkt | Status |
|-------|--------|
| Authoring- bzw. Import-Pfade für Algorithm, Medication, Protocol, Guideline | [ ] |
| Editor-Flows (nicht MVP-kritisch in früher Fassung) | [ ] |

## Nächste Phase (hervorgehoben)

**Phase 1 Einleitung:** Content-Lifecycle und Freigabe-Übergänge als explizite, testbare Domain-Services modellieren — ohne UI-Logik in den Entitäten, mit klarer Anbindung an `ApprovalStatus` und Versionierung.

## Später / explizit zurückgestellt

- Vollständige Offline-Synchronisation
- Survey-Engine und SurveyInsight-Dashboards
- Finale UI-Struktur der Fachanwendung (Mobile App noch nicht implementiert)
