# Roadmap & nächste Schritte (Export)

Quellen: `docs/context/04-mvp-scope.md`, `docs/context/12-next-steps.md`, `docs/roadmap/PROJECT_ROADMAP.md`, `README.md`, `docs/status/PROJECT_STATUS.md`.  
**Abgleich Code/Doku:** Mehrere Doku-Dateien sind **älter oder widersprechen** dem Git-Stand (siehe `known-issues.md`).

## Aktuelle Phase (Doku)

- **README:** Phase 0 — Lookup-first MVP; öffentlich Website + Mobile-Lookup.
- **`docs/context/04-mvp-scope.md`:** MVP in Scope: Medikamente, Algorithmen, Offline, schnelle Suche; Post-MVP u. a. Release Engine, Multi-Tenant, SurveyInsight, API/Auth.
- **Code (Export):** Mobile-Lookup mit Bundle + Suche + Listen/Details implementiert; persistenter Offline-Store / Sync **nicht** (RAM-Bundle).

## Nächste Schritte (`docs/context/12-next-steps.md`, README)

1. Seed-Daten / Sourcing — im Repo zusätzlich **DBRD-Pipeline** (`pnpm dbrd:*`, `scripts/dbrd/`).
2. Offline-Datenhaltung / Architektur — Produktziel vs. aktueller RAM-only-Pfad.
3. Einsatz-UI-Optimierung (Roadmap-Checkboxen).
4. Organisationskontext / API / Auth — README und Architekturdoks.

## `docs/roadmap/PROJECT_ROADMAP.md` (Stand 26. März 2026) — Checkboxen

**Phase 0 — Lookup App (Auszug):**

| Punkt | Status laut Tabelle |
|-------|---------------------|
| Architektur-/Terminologie-Basis | [x] |
| Domain-Paket | [~] |
| Öffentliche Website | [x] |
| Seed-Daten aufbereiten | [ ] |
| Offline-Datenhaltung | [ ] |
| Schnelle lokale Suche | [ ] |
| Mobile Medikament-Detail | [ ] |
| Mobile Algorithmus-Schritt-Ansicht | [ ] |
| Einsatz-optimierte UI | [ ] |
| Pilot-Wache fest | [ ] |

**Code-Realität (faktenbasiert):** Loader, Validierung, Listen, Detailscreens und lokale Suche sind unter `apps/mobile-app/` vorhanden; Roadmap-Checkboxen dazu sind **noch nicht** im Markdown angepasst.

**Phase 1 — Einsatz Features:** Dosierungsrechner, Vitalreferenzen, Favoriten, Verlauf, Push-Updates — in der Roadmap überwiegend `[–]` zurückgestellt.

## MVP-Definition (kanonische Doku)

- **`docs/context/04-mvp-scope.md`:** Medikamentensuche, Notfallalgorithmen, Offline-Nutzung, schnelle Suche; Exit-Kriterien u. a. „unter 3 Klicks“, offline Algorithmus, Seed-Quelle.

## Offene TODOs (aus Doku + Validierungsskripten)

- **`docs/status/PROJECT_STATUS.md`:** Block 1 Implementierung weiterhin als ausstehend beschrieben — widerspricht dem Repo-Code.
- **`scripts/validate-routing.ts` / `validate-content-isolation.ts`:** schlagen mit Exit 1 fehl gegen die **aktuelle** `apps/website`-Struktur (siehe `deployment.md`).

## Priorisierte Tasks — aus **Doku-Lücken** + **Code-Fakten**

1. **Dokumentation mit Code synchronisieren** (`PROJECT_STATUS.md`, `PROJECT_ROADMAP.md`, README-Routentabelle / MVP-Screens).
2. **Validierungsskripte** an Routen und Komponentenstruktur von `apps/website` anbinden oder Referenz auf `website-old` klären.
3. **MVP-Offline laut Produktziel:** persistenter Store / Sync — vs. aktuellem RAM-Bundle (`loadLookupBundle.ts`).
4. **Seed erweitern** (aktuell 2+2 Einträge) und DBRD-Pipeline produktiv im Workflow verankern, falls gewünscht.
5. **Phase-1-Features** nur bei Produktentscheid.
