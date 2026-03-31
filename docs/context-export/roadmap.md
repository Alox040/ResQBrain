# Roadmap & nächste Schritte (Export)

Quellen: `docs/context/04-mvp-scope.md`, `docs/context/12-next-steps.md`, `docs/roadmap/PROJECT_ROADMAP.md` (Stand 31. März 2026), `README.md`, `docs/status/PROJECT_STATUS.md`.  
**Abgleich Code/Doku:** Roadmap und Status wurden gegenüber früheren Ständen aktualisiert und spiegeln den Lookup-/Einsatz-Funktionsumfang der Mobile-App weitgehend korrekt wider (Details unten).

## Aktuelle Phase (Doku)

- **README:** Phase 0 — Lookup-first MVP; Website + Mobile-Lookup.
- **`docs/context/04-mvp-scope.md`:** MVP in Scope: Medikamente, Algorithmen, Offline-Nutzung (Bundle), schnelle Suche; Post-MVP u. a. Release Engine, Multi-Tenant, SurveyInsight, API/Auth.
- **Code (Export):** Mobile-Lookup mit Bundle + Suche + Listen/Details sowie einsatznahen Erweiterungen (Favoriten, Verlauf, Vitalreferenz, Dosisrechner); persistenter Offline-Store / Sync für das Bundle weiterhin **nicht** umgesetzt (RAM-Bundle).

## Nächste Schritte (`docs/context/12-next-steps.md`, README)

1. Seed-Daten / Sourcing — im Repo zusätzlich **DBRD-Pipeline** (`pnpm dbrd:*`, `scripts/dbrd/`).
2. Offline-Datenhaltung / Architektur — Produktziel vs. aktueller RAM-only-Pfad.
3. Einsatz-UI-Optimierung (Roadmap-Checkboxen).
4. Organisationskontext / API / Auth — README und Architekturdoks.

## `docs/roadmap/PROJECT_ROADMAP.md` (Stand 31. März 2026) — Checkboxen (Auszug)

**Phase 0 — Lookup App (Auszug, Tabelle dort vollständig):**

- Architektur-/Terminologie-Basis, Domain-Grundlagen, öffentliche Website, Website-Messaging sowie Seed-Daten, Lookup-Bundle-Loader, Start/Home, Medikamenten- und Algorithmenlisten/-details, Suchscreen inkl. Ranking/Filter und Favoriten/Verlauf sind als **[x] Implementiert** markiert.
- Offline-Ziele jenseits des eingebetteten Bundles (Bundle separat speichern/ersetzen, Sync/Netzwerk-Refresh) sowie weitergehende Einsatz-UI-/Pilot-Konfigurationen sind als **[ ] Ausstehend** oder **[~] Teilweise** markiert.

**Phase 1 — Einsatz Features (Beispiele):**

- Dosierungsrechner (gewichtsbasiert, Parser aus Dosistext) ist **[~] Teilweise** (nur bei erkannten mg/µg-pro-kg-Angaben).
- Vitalwert-Referenzen, Favoriten, Verlauf und UI-View-Model-Adapter sind **[x] Implementiert**.
- Push-Updates und Netz-Sync bleiben **[ ] Ausstehend**.

## MVP-Definition (kanonische Doku)

- **`docs/context/04-mvp-scope.md`:** Medikamentensuche, Notfallalgorithmen, Offline-Nutzung (Bundle), schnelle Suche; Exit-Kriterien u. a. „unter 3 Klicks“, offline Algorithmus, Seed-Quelle.

## Offene TODOs (aus Doku + Validierungsskripten)

- **Offline-Bundle laut Produktziel:** persistenter Store / Sync (statt nur eingebettetem JSON) — in Roadmap/Next Steps als eigenständiger Arbeitsschritt geführt.
- **`lookupSource`-Schichten:** in der App vorbereitet (embedded/cached/updated/fallback), derzeit nur „embedded“ aktiv; Konzept und Implementation für „cached“/„updated“ fehlen noch.
- **Validierungsskripte `scripts/validate-routing.ts` / `validate-content-isolation.ts`:** schlagen mit Exit 1 fehl gegen die **aktuelle** `apps/website`-Struktur (siehe `deployment.md`); Aktualisierung oder explizite Bindung an `apps/website-old` steht aus.

## Priorisierte Tasks — aus **Doku** + **Code-Fakten**

1. **Offline-Zielbild und Bundle-Persistenz** konkretisieren (MVP vs. spätere Phasen) und mit `lookupSource`-Schichten verzahnen.
2. **Sync-/Update-Konzept** für Lookup-Bundles (inkl. Governance/Versioning-Anbindung) definieren, sobald Lieferpfad geklärt ist.
3. **Seed & Pilot-Konfiguration** (Datenumfang, Bundle-Metadaten, Pilot-Wache) festziehen und mit DBRD-Pipeline koppeln.
4. **Validierungsskripte** (`validate-routing.ts`, `validate-content-isolation.ts`) entweder auf `apps/website` aktualisieren oder explizit als Checks für `apps/website-old` kennzeichnen.
