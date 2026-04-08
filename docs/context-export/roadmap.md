# Roadmap & nächste Schritte (Export)

Quellen: `docs/context/04-mvp-scope.md`, `docs/context/12-next-steps.md`, `docs/roadmap/PROJECT_ROADMAP.md`, `README.md`, `docs/status/PROJECT_STATUS.md`.  
**Abgleich Code/Doku (Export 8. April 2026):** Ergänzt um Verifikationsläufe (Build, Mobile-Verify, Validierungsskripte).

## Aktuelle Phase (Doku)

- **README / `current-phase.md`:** Phase 0 — Lookup-first MVP; Website + Mobile-Lookup; keine produktive API-/Multi-Tenant-Runtime in App.
- **`docs/context/04-mvp-scope.md`:** MVP in Scope: Medikamente, Algorithmen, Offline-Nutzung (Bundle), schnelle Suche; Post-MVP u. a. Release Engine, Multi-Tenant, SurveyInsight, API/Auth.
- **Code:** `resolveLookupBundle()` (updated → cached → embedded → fallback), optional `EXPO_PUBLIC_LOOKUP_BUNDLE_URL` + Hintergrund-Update in `App.tsx` — **ohne** vollständig nachgewiesenes produktives Sync-/Governance-Ende-zu-Ende.

## Nächste Schritte (`docs/context/12-next-steps.md`, README)

1. Seed-Daten / Sourcing — DBRD-Pipeline (`pnpm dbrd:*`, `scripts/dbrd/`).
2. Offline-Datenhaltung / Architektur — Produktziel vs. RAM + optionale persistierte Schichten.
3. Einsatz-UI-Optimierung (Roadmap-Checkboxen).
4. Organisationskontext / API / Auth.

## `docs/roadmap/PROJECT_ROADMAP.md` — Checkboxen (Auszug, Tabelle dort vollständig)

**Phase 0 — Lookup App:**

- Kernpfade (Website statisch, Mobile Lookup, Suche, Listen/Details, Favoriten/Verlauf-Stores) **[x]** laut Roadmap-Tabelle.
- Bundle separat speichern / aus Sync laden, Netzwerk-Refresh **[ ]** bzw. **[~]** für Teilaspekte.
- **`lookupSource` / Resolver:** Code-Pfad für mehrere Schichten vorhanden; produktive Befüllung von updated/cached und Betrieb **offen** (Roadmap: Offline-Update **[~]**).

**Phase 1 — Einsatz Features:**

- Dosisrechner **[~]** (Heuristik mg/µg-pro-kg).
- Vitalwerte, Favoriten, Verlauf, View-Model-Adapter **[x]** laut Roadmap — **Code:** `HistoryScreen` im Home-Stack registriert, Navigation von `HomeScreen` aus.

## MVP-Definition (kanonische Doku)

- **`docs/context/04-mvp-scope.md`:** Medikamentensuche, Notfallalgorithmen, Offline-Nutzung (Bundle), schnelle Suche; Exit-Kriterien u. a. „unter 3 Klicks“, offline Algorithmus, Seed-Quelle.

## Offene TODOs (aus Doku + Verifikation 8. April 2026)

- **`scripts/validate-routing.ts`:** Exit 1 — erwartet noch `*Section`-Imports in `app/page.tsx`; Ist: inline `SectionFrame`-Komposition.
- **`scripts/validate-content-isolation.ts`:** Exit 1 — `allowedRoutes` enthält `/mitwirken` und `/updates` nicht.
- **`pnpm verify`:** scheitert damit nach Build an `validate-routing`.
- **Offline/Sync:** weiterhin laut Roadmap/Produktziel; Code-Vorbereitung ohne abgeschlossene Betriebsstory.

## Website — zuletzt im Code sichtbar

- Routen `/mitwirken`, `/updates`; Copy/Formular-Konfiguration unter `lib/site/updates-page.ts`, `lib/site/updates-form.ts`.
- Startseite ohne direkte `*Section.tsx`-Imports; Figma-orientierte UI-Primitives.
- Umfrage-Link in `lib/site/survey.ts` auf Microsoft Forms (kein generischer Platzhalter-Domain-String mehr).

## Priorisierte Tasks — Doku + Code-Fakten (Stand 8. Apr. 2026)

1. **Validierungsskripte synchronisieren:** `validate-content-isolation.ts` (`allowedRoutes`) und `validate-routing.ts` (Section-Checks oder neue Heuristik) — Ziel: `pnpm verify` grün.
2. **Bundle-Persistenz — Konzept:** `lookupSource`-Erweiterung (Roadmap Phase 0) als Dokument ausarbeiten.
3. **Root-Level-Struktur klären:** `app/`, `components/`, `lib/` am Repo-Root bereinigen oder als v2 formalisieren.
4. **Sync-Konzept:** Inhaltliches Konzept für Bundle-Lieferung, Integrität, Fehlerpfade.
5. **`docs/roadmap/PROJECT_ROADMAP.md`:** Stand-Datum und ggf. Verlauf-Zeile mit Navigator-Registrierung abstimmen (Doku- housekeeping).

## Erledigt / verifiziert (seit früherem Export, 8. Apr. 2026)

- **Mobile `tsc --noEmit`:** Exit 0.
- **`pnpm mobile:verify`:** Exit 0 (inkl. `expo export` Android).
