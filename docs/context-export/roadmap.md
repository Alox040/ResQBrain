# Roadmap & nächste Schritte (Export)

Quellen: `docs/context/04-mvp-scope.md`, `docs/context/12-next-steps.md`, `docs/roadmap/PROJECT_ROADMAP.md`, `README.md`, `docs/status/PROJECT_STATUS.md`.  
**Abgleich Code/Doku (Export 8. April 2026):** Roadmap-Datei im Repo trägt Stand 7. April 2026; unten ergänzt um Fakten aus Figma-Migration (8. Apr.) und Verifikationsdaten.

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
- Vitalwerte, Favoriten, Verlauf, View-Model-Adapter **[x]** laut Roadmap — **Hinweis Code:** dedizierter `HistoryScreen` nicht im Navigator registriert (siehe `known-issues.md`).

## MVP-Definition (kanonische Doku)

- **`docs/context/04-mvp-scope.md`:** Medikamentensuche, Notfallalgorithmen, Offline-Nutzung (Bundle), schnelle Suche; Exit-Kriterien u. a. „unter 3 Klicks“, offline Algorithmus, Seed-Quelle.

## Offene TODOs (aus Doku + Verifikation 5. April 2026)

- **Mobile TypeScript:** `tsc --noEmit` Exit 2 (`App.tsx` / `HomeScreen` / `SettingsScreen`) — `pnpm mobile:verify` blockiert.
- **`scripts/validate-routing.ts`:** Exit 1 — Erwartungen an alte Section-Dateinamen; aktuelle UI in `app/page.tsx` + `HeroSection` & Co.
- **`scripts/validate-content-isolation.ts`:** Exit 0 im letzten Lauf — **kein** offenes TODO mehr aus diesem Skript.
- **Offline/Sync:** weiterhin laut Roadmap/Produktziel; Code-Vorbereitung ohne abgeschlossene Betriebsstory.

## Website — Abgeschlossen (8. April 2026)

- **Figma-Migration Phase 1** vollständig: neues CSS-System, 9 Sections, neue Komponentenstruktur (`components/layout/`, `sections/`, `ui/`), neue Routen `/mitwirken` und `/updates`
- **Deployed auf Vercel** (`b9a4093 final figma website deploy`)
- **`apps/website-lab/`** als isolierter Figma-Playground hinzugefügt
- **`apps/mobile-app-lab/figma-export/`** als Mobile-Figma-Referenz hinzugefügt

## Priorisierte Tasks — Doku + Code-Fakten (Stand 8. Apr. 2026)

1. **Bundle-Persistenz — Konzept:** `lookupSource`-Erweiterung (Roadmap Phase 0) als Dokument ausarbeiten.
2. **Root-Level-Struktur klären:** `app/`, `components/`, `lib/` am Repo-Root bereinigen oder als v2 formalisieren.
3. **Mobile-Buildqualität:** Typefehler beheben (`App.tsx`, `HomeScreen`, `SettingsScreen`), damit `pnpm mobile:verify` grün wird.
4. **`validate-routing.ts`** an aktuelle `apps/website`-Struktur anpassen oder als Legacy dokumentieren.
5. **Sync-Konzept:** Inhaltliches Konzept für Bundle-Lieferung, Integrität, Fehlerpfade.
6. **`/mitwirken` vs. `/mitwirkung`:** Inhaltliche Abgrenzung dokumentieren.
