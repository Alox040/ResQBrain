# Next Steps

**Stand:** 15. April 2026 — abgestimmt mit dem **Ist-Stand** der Mobile-App (`apps/mobile-app`) und `docs/status/PROJECT_STATUS.md`.

Kanontische Produktkontexte: `docs/context/04-mvp-scope.md`, `docs/context/11-implementation-baseline.md`.

---

## Erreicht (Code, kein Backlog)

Diese Punkte sind **implementiert** und laufen gegen das eingebettete Lookup-Bundle:

- **Lookup:** Loader + Validierung (`loadLookupBundle`), `contentIndex`, Listen/Detail Medikamente & Algorithmen, Querverweise zwischen Einträgen (wo im Bundle referenziert).
- **Suche:** Lokale Suche ohne Server; Relevanz-Ranking (Label, `searchTerms`, Indikation, sekundäre Texte wie Dosistext/Notizen/Schritte); Filter „Alle / Medikamente / Algorithmen“.
- **Start/Home:** Tab mit Statistiken, Schnellzugriff (Suche, Vitalwerte, Listen, Dosisrechner-Kachel), Karussell für Favoriten und Verlauf.
- **Favoriten:** Stern in Detailansichten; Tab „Favoriten“; Persistenz über **AsyncStorage** (nicht im Lookup-Bundle).
- **Verlauf:** „Zuletzt geöffnet“ (max. 30 Einträge); Tab „Verlauf“; Persistenz über **AsyncStorage**; Eintrag beim Öffnen eines Details.
- **Dosisrechner:** Gewichtsbasierte Schätzung aus **Freitext-Dosistext** (Muster `mg|µg/mcg pro kg`, optional Min/Max); Medikamentenauswahl; ohne klinische Validierung — nur Parser + Hinweis „Orientierung“.
- **Vitalwerte-Referenz:** Eigener Screen (Altersgruppen, HF/AF/RR/SpO₂/Temp.) — **statischer Referenzinhalt** in der App, unabhängig vom Lookup-Bundle.
- **UI-Schicht:** View-Model-Adapter (`src/data/adapters/`) zwischen Bundle-Typen und Listen/Detail/Suche — vorbereitend für spätere Domain-/Bundle-Migration; **keine** Anbindung an `@resqbrain/domain` in der App.
- **Bundle auf dem Gerät:** validiertes Lookup-Bundle kann in **AsyncStorage** liegen und wird beim Start bevorzugt, wenn **neuer** als Embedded (`loadLookupBundleWithSource` in `loadLookupBundle.ts`). Nach erstem Embedded-Laden kann der Cache befüllt sein (u. a. nach erfolgreichem Remote-Download).  
- **Optional HTTP-Update:** bei gesetztem `EXPO_PUBLIC_LOOKUP_BUNDLE_URL` läuft nach Start ein **Hintergrund-Check** (`bundleUpdateService` / `App.tsx`) — **kein** mandantenfähiges Backend, **kein** Push-Sync. Zusätzlich existiert `lookupSource.ts` mit weiterer Schichtlogik; **App-Start** nutzt den Pfad über `loadLookupBundle.ts`.

**Validierung lokal:** `pnpm mobile:verify` (siehe `docs/context/mobile-validation-checklist.md`).

---

## Kurzfristig (Offen / nächste Iterationen)

### 1. Produktionsreife Bundle-Verteilung

- Technisch vorhanden: persistierter Cache + optional eine **Bundle-URL** (siehe Status).  
- Offen: organisationsspezifische/signierte Releases, Betrieb (Hosting, Rotation), Fehler- und Rollback-Strategie jenseits des aktuellen Minimal-Fetch.

### 2. Sync / Backend

- **Kein** End-to-End-Sync-Produkt; optionaler HTTP-Download ist **kein** Ersatz für Tenant-API/Auth.

### 3. Seed-Daten & Pilot-Konfiguration

- Datenmenge und Textqualität in `data/lookup-seed/` ausbauen; eine Organisation / Pilot-Wache weiterhin **fachlich** fokussieren (technisch: festes Bundle).

### 4. Einsatz-UI

- Lesbarkeit, Kontrast, große Treffer — iterativ; keine gesonderte „Hands-free“-Pflicht im Code abgebildet.

### 5. Werkzeuge

- ESLint für `apps/mobile-app` optional ergänzen (derzeit nur Typecheck + Nav-Skripte + Export-Check).
- `expo-doctor`-Hinweise (z. B. `@expo/vector-icons`-Version) bereinigen, wenn relevant.

---

## Zurückgestellt (weiter wie in `04-mvp-scope` / Architektur)

- Content Lifecycle, Governance-UI, Multi-Tenant-Runtime
- API, Auth, Release-Pipeline für Live-Bundles
- Editor, Survey-Produktivbetrieb
- KI-/Lernfeatures (Phasen 2+ in der Roadmap)

---

## Hinweis zu Doppeldatei `next-steps.md`

Die Datei `docs/context/next-steps.md` kann ältere Formulierungen enthalten. Für **priorisierte nächste Schritte** und Abgleich mit dem Repo gilt dieser Eintrag **`12-next-steps.md`** sowie `docs/roadmap/PROJECT_ROADMAP.md`.
