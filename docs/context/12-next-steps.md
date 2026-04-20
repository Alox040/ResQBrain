# Next Steps

**Stand:** 20. April 2026 - abgestimmt mit dem **Ist-Stand** der Mobile-App (`apps/mobile-app`) und `docs/status/PROJECT_STATUS.md`.

Kanonische Produktkontexte: `docs/context/04-mvp-scope.md`, `docs/context/11-implementation-baseline.md`.

---

## Erreicht (Code, kein Backlog)

Diese Punkte sind **implementiert** und laufen gegen das eingebettete Lookup-Bundle:

- **Lookup:** Loader + Validierung (`loadLookupBundle`), `contentIndex`, Listen/Detail Medikamente & Algorithmen, Querverweise zwischen Eintraegen (wo im Bundle referenziert).
- **Suche:** Lokale Suche ohne Server; einfache Textsuche auf Label und Indikation; Filter "Alle / Medikamente / Algorithmen". Kein Relevanz-Ranking im aktuellen Codepfad.
- **Start/Home:** Start-Tab mit Sucheinstieg, Schnellzugriff, Feedback-Entry, Update-Badge sowie Bereichen fuer Favoriten und zuletzt verwendete Inhalte.
- **Favoriten:** Stern in Detailansichten; Persistenz ueber **AsyncStorage/Zustand** (nicht im Lookup-Bundle). Ein eigener `FavoritesScreen` existiert im Repo, ist aktuell aber **nicht** im `AppNavigator` registriert.
- **Verlauf:** "Zuletzt geoeffnet" (max. 30 Eintraege); Persistenz ueber lokalen Storage; eigener Screen `History` im **Home-Stack**, kein Root-Tab.
- **Vitalwerte:** `VitalReferenceScreen` als statische Referenzansicht im **Home-Stack**.
- **Dosisrechner:** `DoseCalculatorScreen` und Parser fuer Freitext-Dosierungen existieren im Repo, sind aktuell aber **nicht** im `AppNavigator` verdrahtet und damit kein aktiver MVP-Hauptflow.
- **UI-Schicht:** View-Model-Adapter (`src/data/adapters/`) zwischen Bundle-Typen und Listen/Detail/Suche - vorbereitend fuer spaetere Domain-/Bundle-Migration; **keine** Anbindung an `@resqbrain/domain` in der App.
- **Bundle auf dem Geraet:** validiertes Lookup-Bundle kann in **AsyncStorage** liegen und wird beim Start bevorzugt, wenn **neuer** als Embedded (`loadLookupBundleWithSource` in `loadLookupBundle.ts`). Nach erstem Embedded-Laden kann der Cache befuellt sein (u. a. nach erfolgreichem Remote-Download).
- **Optional HTTP-Update:** bei gesetztem `EXPO_PUBLIC_LOOKUP_BUNDLE_URL` laeuft nach Start ein **Hintergrund-Check** (`bundleUpdateService` / `App.tsx`) - **kein** mandantenfaehiges Backend, **kein** Push-Sync. Zusaetzlich existiert `lookupSource.ts` mit weiterer Schichtlogik; **App-Start** nutzt den Pfad ueber `loadLookupBundle.ts`.

**Validierung lokal:** Website-Typecheck ist aktuell gruen (`pnpm.cmd --filter @resqbrain/website run typecheck`). Der dokumentierte Mobile-Verify-Pfad ist aktuell **nicht** gruen: `pnpm.cmd --filter @resqbrain/mobile-app run verify:static` scheitert derzeit an mitgeprueften `figma/`-Referenzquellen mit fehlenden Web-Abhaengigkeiten.

---

## Kurzfristig (Offen / naechste Iterationen)

### 1. Produktionsreife Bundle-Verteilung

- Technisch vorhanden: persistierter Cache + optional eine **Bundle-URL** (siehe Status).
- Offen: organisationsspezifische/signierte Releases, Betrieb (Hosting, Rotation), Fehler- und Rollback-Strategie jenseits des aktuellen Minimal-Fetch.

### 2. Sync / Backend

- **Kein** End-to-End-Sync-Produkt; optionaler HTTP-Download ist **kein** Ersatz fuer Tenant-API/Auth.

### 3. Seed-Daten & Pilot-Konfiguration

- Datenmenge und Textqualitaet in `data/lookup-seed/` ausbauen; eine Organisation / Pilot-Wache weiterhin **fachlich** fokussieren (technisch: festes Bundle).

### 4. Einsatz-UI

- Lesbarkeit, Kontrast, grosse Treffer - iterativ; keine gesonderte "Hands-free"-Pflicht im Code abgebildet.

### 5. Werkzeuge

- `apps/mobile-app/tsconfig.json` so bereinigen, dass `figma/` nicht den produktiven Mobile-Typecheck blockiert, oder die Referenzquellen separat behandeln.
- ESLint fuer `apps/mobile-app` optional ergaenzen (derzeit nur Typecheck + Nav-Skripte + Export-Check).
- `expo-doctor`-Hinweise (z. B. `@expo/vector-icons`-Version) bereinigen, wenn relevant.

---

## Zurueckgestellt (weiter wie in `04-mvp-scope` / Architektur)

- Content Lifecycle, Governance-UI, Multi-Tenant-Runtime
- API, Auth, Release-Pipeline fuer Live-Bundles
- Editor, Survey-Produktivbetrieb
- KI-/Lernfeatures (Phasen 2+ in der Roadmap)

---

## Hinweis zu Doppeldatei `next-steps.md`

Die Datei `docs/context/next-steps.md` kann aeltere Formulierungen enthalten. Fuer **priorisierte naechste Schritte** und Abgleich mit dem Repo gilt dieser Eintrag **`12-next-steps.md`** sowie `docs/roadmap/PROJECT_ROADMAP.md`.
