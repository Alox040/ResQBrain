# Roadmap & nächste Schritte (Export)

Quellen: `docs/context/04-mvp-scope.md`, `docs/context/12-next-steps.md`, `docs/roadmap/PROJECT_ROADMAP.md`, `README.md`, `docs/status/PROJECT_STATUS.md`.  
**Abgleich Code/Doku:** Mehrere Doku-Dateien sind **älter oder widersprechen** dem aktuellen Code (siehe `known-issues.md`).

## Aktuelle Phase (Doku)

- **README / Status:** Phase 0 — Lookup-first MVP; öffentlich Website + Mobile-Lookup.
- **`docs/context/04-mvp-scope.md`:** MVP in Scope: Medikamente, Algorithmen, Offline, schnelle Suche; Post-MVP explizit u. a. Release Engine, Multi-Tenant, SurveyInsight, API/Auth.
- **`apps/website/lib/site.ts`:** `stageLabel: "Early Development"`.

## Nächste Schritte (`docs/context/12-next-steps.md`, Stand 26. März 2026)

1. Seed-Daten aufbereiten (`data/schemas/` erwähnt — siehe `data-structure.md` zum aktuellen `data/lookup-seed/`-Bestand).
2. Offline-Datenhaltung definieren / lokal-erste Architektur.
3. Suchfunktion implementieren (lokal, ohne Server).
4. Einsatz-UI (Mobile) für Medikament/Algorithmus.
5. Eine Organisation fest konfiguriert — kein Login im MVP.

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

**Hinweis:** Der **Code** enthält bereits Loader, Validierung, Listen/Details und Suche — die Checkboxen sind damit **teilweise veraltet** (siehe `known-issues.md`).

**Phase 1 — Einsatz Features:** Dosierungsrechner, Vitalreferenzen, Favoriten, Verlauf, Push-Updates — in der Roadmap überwiegend `[–]` zurückgestellt.

## MVP-Definition (kanonische Doku)

- **`docs/context/04-mvp-scope.md`:** Medikamentensuche, Notfallalgorithmen, Offline-Nutzung, schnelle Suche; Exit-Kriterien inkl. „unter 3 Klicks“, offline Algorithmus, Seed-Quelle, ohne Einweisung nutzbar.

## Offene TODOs (aus Doku, nicht aus Code-Scanner)

- `docs/status/PROJECT_STATUS.md`: Risiken u. a. Merge-Konflikte README, externe Umfrage-URLs/Datenschutz, Deployment separat absichern, Mandantentrennung ohne produktive API.

## Priorisierte Tasks — empfohlen aus **Doku-Lücken** + **Code-Fakten**

1. **Dokumentation mit Code synchronisieren** (`PROJECT_STATUS.md`, `PROJECT_ROADMAP.md`).
2. **MVP-Offline laut Produktziel:** persistenter lokaler Store / Sync — im Code aktuell nur Bundle-im-RAM (siehe `app-status.md`).
3. **Seed erweitern** (aktuell 2+2 Einträge).
4. **Phase-1-Features** laut Roadmap nur bei Produktentscheid anfahren.
