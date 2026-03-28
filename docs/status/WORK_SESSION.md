# Arbeitssession

**Datum:** 28. März 2026  
**Art:** Architektur- und Phase-0-Vorbereitung (Kontextdokumente, Mobile-Datenpipeline, Offline-Festlegung)

## Architekturentscheidungen (heute dokumentiert)

- **Lookup-Datenform Phase 0:** Pflicht-/optional-Felder für Medikament und Algorithmus; Abgrenzung zu `@resqbrain/domain` (keine Lifecycle-/Governance-Pflichtfelder im Seed).
- **Seed & Bundle:** Kanonische Quelle **JSON** unter `data/lookup-seed/` inkl. `manifest.json` (`schemaVersion`, `bundleId`); TS-Mocks nur Übergang.
- **Mobile Screens:** Fachliche Spec für vier Lookup-Screens (Listen/Details), lokale Lesepfade, Querverweise, bewusste UI-Ausschlüsse (kein Rechner, keine Verzweigungslogik, keine Freigabe-/Versions-UI).
- **Offline Phase 0:** Mitgeliefertes Bundle → Start: laden/validieren → **RAM-Store** + **In-Memory-Suchindex**; kein Netz für Lookup; keine Sync-Engine; Updates zunächst über App-Release (oder später schlanker Bundle-Download).
- **Lesepfad:** Unverändert Ausrichtung auf `lookup-first-architecture.md`; Phase 0 ohne Pflicht-SQLite/persistente DB.

## Neue Kontextdateien

- `docs/context/lookup-data-shape.md` — Datenform, Konsistenzregeln, Verwandtes.
- `docs/context/content-seed-plan.md` — Ablage, Manifest, JSON vs. TS, Arbeitsablauf.
- `docs/context/mobile-phase0-screens.md` — Screen-Spezifikation und MVP-Checkliste.
- `docs/context/offline-phase0-decision.md` — Offline-Strategie, Risiken, technische Schritte.
- `docs/context/next-steps-laptop-to-pc.md` — Übergabe Haupt-PC, Reihenfolge, DoD erster Block.

## Phase-0 Scope-Festlegung

- **In:** Lookup-first MVP — finden und lesen unter Zeitdruck, offlinefähig, statischer Text (Dosierung Freitext), lineare Algorithmus-Schritte, lokale Suche, ein Pilot-Bundle.
- **Aus:** Dosierungsrechner, KI, Governance-/Freigabe-Workflows in der App, Versionierungs-UI, Multi-Tenant-Laufzeit, Sync-Engine, serverseitige Suche für diese Inhalte.

## Nächste PC-Implementierung

1. `data/lookup-seed/` anlegen (Manifest + `medications.json` / `algorithms.json` oder `content.json`).  
2. Validierung (Zod o. Ä.) abgleichen mit `apps/mobile-app/src/types/content.ts` und `lookup-data-shape.md`.  
3. Loader; `contentIndex.ts` nur noch über Bundle — **eine** Wahrheit.  
4. Danach: List-Screens, `SearchScreen` / Suchindex vereinheitlichen, Querverweise laut `mobile-phase0-screens.md`; TS-Mocks entfernen oder auf Fixtures reduzieren.  
5. Kein paralleler Aufbau von SQLite/Sync „für später“ ohne Phase-0-Mehrwert.

Details und Reihenfolge: `docs/context/next-steps-laptop-to-pc.md`, Abschnitte 3 und 7–8.

## Risiken

- Mehrere Datenquellen (Mocks vs. JSON vs. `contentIndex` / Suche) — Zusammenführung zwingend.  
- Abweichung JSON ↔ `content.ts` / Spec — Schema zuerst.  
- `SearchScreen` und ggf. hardcodierte Quellen — nicht mit Alt-Pattern perpetuieren (vgl. Übergabedokument).  
- Inhaltliche Aktualität nur über Release, solange kein Bundle-Update-Kanal — Pilot kurz halten, `contentCutoffDate` nutzen.

## Definition of Done — Vorbereitung (erster PC-Block)

- `data/lookup-seed/` im Repo inkl. konsistentem `manifest.json`.  
- Validierung schlägt bei ungültigem JSON fehl (nachweisbar).  
- `contentIndex` bezieht Daten **nur** über den Loader aus dem JSON-Bundle.  
- App startet; Medikamenten- und Algorithmus-**Detail** wie bisher erreichbar.  
- Alte TS-Module nicht mehr von `contentIndex` genutzt oder eindeutig nur Dünnschicht — SSoT klar.

Nächster inhaltlicher Block danach: Listen, Suche, Querverweise ohne neue Datengrundlagen-Risiken.

## Phase-0 Re-Validierung

- Phase-0-Kontextdateien konsolidiert (untereinander und mit Architektur abgestimmt).
- `docs/architecture/lookup-first-architecture.md` angepasst: Phase-0-Subset vs. Zielarchitektur klar getrennt.
- **JSON-Bundle** unter `data/lookup-seed/` als kanonische Quelle bestätigt; TypeScript-Daten nur Übergang bis Loader.
- Phase 0 dokumentarisch abgesichert: **keine Sync-Engine**, **keine Dosierungslogik**, **keine Verzweigungslogik** in der App.
- **Ergebnis:** Re-Validierung **PASS** (Kriterien: Scope, Sync, Dosierung, Branching, JSON-Quelle, keine Governance-UI).

## Nächster Schritt

**Implementierung Block 1:** `data/lookup-seed/` (Manifest + JSON) + Validierung + Loader + `contentIndex.ts` nur über das Bundle — siehe `docs/context/next-steps-laptop-to-pc.md` (Abschnitte 7–8, DoD Abschnitt 8).

---

## Frühere Session (25. März 2026, Kurz)

Website: Routing/Anker in `SurveysSection` und `FeatureVotingSection`; `scripts/validate-routing.ts`; README-Konfliktmarken bereinigt. Prüfungen damals: Domain-Compile, `validate:routing`, `pnpm build` — erfolgreich.

## Offene Langfristpunkte (Plattform, außerhalb Phase-0-Mobile-Block)

- Domain-Lifecycle-Services, Organization-Kontext in APIs, Content-Sourcing über MVP hinaus — siehe Architektur-Docs; nicht Gegenstand der aktuellen Phase-0-Dokumentationsschwerpunkte.

## Nächster dokumentierter Schritt

Nach Abschluss von Block 1: `PROJECT_STATUS.md` / `PROJECT_ROADMAP.md` bei Meilensteinen nachziehen; diese Datei in der folgenden Session aktualisieren.
