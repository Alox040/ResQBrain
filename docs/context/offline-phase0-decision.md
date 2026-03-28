# Offline-Strategie Phase 0

**Stand:** 28. März 2026  
**Gültigkeit:** Lookup-first MVP (Phase 0)  
**Bezug:** `docs/context/mvp-scope.md`, `docs/context/lookup-data-shape.md`, `docs/context/content-seed-plan.md`, `docs/context/mobile-phase0-screens.md`, `docs/architecture/lookup-first-architecture.md`, `apps/mobile-app/src/types/content.ts`, `README.md`, `docs/status/PROJECT_STATUS.md`

**Ist-Stand im Repo:** Die Mobile-App lädt Inhalte derzeit aus **TypeScript-Modulen** unter `apps/mobile-app/src/data/` (z. B. `medications.ts`, `algorithms.ts`). Es gibt **keine** implementierte Sync-Engine, keinen persistenten Content-Store und keine OTA-Updates — die Offline-Strategie ist damit faktisch „alles liegt im App-Binary“, aber noch nicht als formales Bundle/Loader-Modell ausgebaut.

---

## 1. Ziel

### Welche Offline-Fähigkeit Phase 0 wirklich braucht

- **Vollständiger Lesezugriff** auf alle Medikamente und Algorithmen des Pilot-Bundles **ohne Mobilfunk/WLAN** — Listen, Details und lokale Suche müssen funktionieren, sobald die App installiert und gestartet ist.
- **Vorhersagbares Verhalten:** keine leeren Screens nur deshalb, weil kein Netz besteht; keine versteckte Abhängigkeit von einem Backend für Lookup-Inhalte.

### Warum Offline im Rettungsdienst hier zentral ist

Einsatzorte haben häufig **schlechte oder keine Verbindung**; die Leitfrage aus der Lookup-Architektur bleibt maßgeblich: Information in wenigen Sekunden finden — **ohne Netz**. Phase 0 ist ein Nachschlagewerk, kein Online-Dienst.

---

## 2. Muss in Phase 0 offline verfügbar sein

- **Sämtliche Lookup-Daten** gemäß `lookup-data-shape.md` / Typen in `content.ts`: komplette Arrays `Medication` und `Algorithm` des **einen** Pilot-Bundles.
- **Suchfähigkeit** über die im Kontext dokumentierten indexierbaren Texte (mindestens `label`, `indication`, `searchTerms`; sinnvoll ergänzt um `dosage`, Schritttexte, `warnings`/`notes` je nach Umsetzung der Suche) — **lokal im Gerätespeicher (RAM)**, ohne Server-Roundtrip (`lookup-first-architecture.md`).
- **Navigation und Screens** wie in `mobile-phase0-screens.md`: reine Lesepfade aus dem lokalen Datenbestand.
- **Manifest-Metadaten** des Bundles (`schemaVersion`, `bundleId` laut `content-seed-plan.md`) mindestens so, dass Build und Support dieselbe Snapshot-Identität erkennen — Anzeige in der UI ist optional.

---

## 3. Muss bewusst noch nicht Teil von Phase 0 sein

- **Synchronisations-Engine** (Hintergrund-Jobs, Konfliktlösung, Delta-Updates, Retry-Logik).
- **Remote-Laden** von Inhalten als Voraussetzung für den ersten sinnvollen App-Start.
- **Governance-/Freigabe-Workflows** und **Versionierungs-UI** in der Mobile-App.
- **Multi-Tenant-Laufzeitlogik** (Organisationswahl, mandantenabhängiges Nachladen).
- **KI**, serverseitige Suche, personalisierte Empfehlungen.
- **Automatische inhaltliche Aktualisierung** ohne neuen App-Build oder ohne später explizit definierten, einfachen Update-Kanal.

---

## 4. Empfohlene Architektur für Phase 0

### Einfachste sinnvolle technische Lösung

**„Immer mitgeliefertes Bundle“ + einmaliges Laden in den Arbeitsspeicher + Suchindex im RAM.**

- Kein separates Datenbankprodukt ist für Phase 0 nötig, solange Datenmenge und Startzeit akzeptabel bleiben.
- Optional kann derselbe Snapshot **zusätzlich** in einem einfachen Key-Value-Store zwischengespeichert werden, um Kaltstarts zu beschleunigen — das ist **kein** Sync, sondern nur Cache desselben Bundles.

### Datenquelle

- **Kanonische Quelle:** JSON unter `data/lookup-seed/` wie in `content-seed-plan.md` (`manifest.json`, `medications.json`, `algorithms.json` oder ein kombiniertes `content.json`).
- Validierung beim Build oder beim App-Start (z. B. Zod) gegen `content.ts` / `lookup-data-shape.md`.

### Ladeweg in der App

1. Beim Start (oder vor dem ersten Screen-Zugriff): Bundle aus **App-Assets** lesen (statisch mitgeliefert) oder aus dem **gebündelten Modul**, falls vorübergehend weiter per TypeScript importiert wird.
2. Parse + Validierung → **eine** in-memory-Struktur („LookupStore“): zwei Arrays + ggf. Map `id → Item`.
3. `SearchService.buildIndex()` baut den **In-Memory-Index** aus diesem Store.
4. Listen-, Detail- und Such-Screens lesen **nur** aus Store/Index — identisch zur Zielrichtung in `lookup-first-architecture.md`, auch wenn die Modulnamen im Code noch vereinfacht sind.

### Verhältnis zwischen Seed-Daten, Bundle und App

| Begriff | Phase-0-Rolle |
|--------|----------------|
| **Seed (Repo)** | Redaktionell gepflegte JSON-Dateien + Manifest; Versionskontrolle über Git und `schemaVersion`/`bundleId`. |
| **Bundle** | Der für die Pilot-Wache gültige Snapshot, der **in die App-Version eingebaut** wird. |
| **App** | Kennt genau **ein** aktiv nutzbares Bundle pro Release; kein dynamischer Wechsel der Organisation. |

### Suchfähigkeit ohne Netz

- Vollständig **clientseitig**: Index aus dem lokal geladenen Store, Suche nur im RAM (`lookup-first-architecture.md`, `lookup-data-shape.md`).

---

## 5. Risiken und Grenzen

| Risiko | Bewertung / Mitigation Phase 0 |
|--------|--------------------------------|
| **Inhaltliche Aktualität** | Inhalte veralten mit dem App-Release; Mitigation: kurze Pilotphasen, schnelle Store-Releases bei inhaltlichen Änderungen, klare Kommunikation „Stand: …“ (z. B. `contentCutoffDate` im Manifest). |
| **Manuelle Updates** | Jede inhaltliche Änderung endet vorerst in **neuem Build** oder später in einem bewusst einfachen Update-Mechanismus — nicht in einer MVP-Sync-Engine. |
| **Datenmenge** | Sehr große JSON-Dateien erhöhen Bundle-Größe und Startzeit; Mitigation: moderierte Seed-Größe, ggf. später Kompression — nicht vor Phase 0 nötig, solange Pilot klein bleibt. |
| **Pflegeaufwand** | Zwei Welten vermeiden: eine kanonische JSON-Quelle im Repo, keine dauerhafte Duplikation neben TS-Mocks ohne Abgleich. |
| **Spätere Migration** | Wenn später OTA oder Multi-Tenant kommt, bleibt das **Datenmodell** (`Medication` / `Algorithm`) kompatibel; es wird ein anderer **Loader** ergänzt, der denselben Store füllt — keine Neuerfindung der Screens. |

---

## 6. Erweiterungspfad nach Phase 0

- **Einfaches Bundle-Update:** ein Endpoint liefert neues JSON + Manifest; App lädt bei WLAN, prüft `schemaVersion`/`bundleId`, ersetzt Snapshot **atomar** lokal — ohne Governance-UI in der App, ohne Multi-Tenant-Auswahl, solange nicht benötigt.
- **Organisation / Tenant:** `OrganizationConfig` aus der Lookup-Architektur wählt künftig die Bundle-Quelle; Phase 0 bleibt „eine feste Konfiguration“.
- **SyncState / SyncStrategy:** erst sinnvoll, wenn es mehr als einen trivialen „komplettes Bundle ersetzen“-Pfad gibt; bis dahin nicht implementieren.

Damit wird Phase 0 nicht durch vorgebaute Komplexität aufgeblasen, behält aber eine klare Richtung für spätere Schichten.

---

## 7. Klare Entscheidung

Für Phase 0 wird **Offline gleich „vollständig im App-Release enthaltenes Lookup-Bundle“** definiert: Medikamente und Algorithmen werden als **statische Dateien** (JSON im Repo, im Build eingebunden) bereitgestellt, beim App-Start **validiert und in den Arbeitsspeicher** geladen, und alle Lookup-Funktionen lesen **ausschließlich** aus diesem lokalen Bestand. **Keine** Sync-Engine, **keine** Abhängigkeit von Netzwerk für Suche oder Listen, **keine** Mandantenumschaltung und **keine** Freigabe- oder Versions-Workflows in der Mobile-App. Die lokale Suche läuft über einen **beim Start aufgebauten In-Memory-Index**. Inhaltliche Änderungen werden für den MVP über **neue App-Versionen** (oder später einen bewusst schlanken Bundle-Download) adressiert, nicht über eine verteilte Content-Pipeline. Diese Entscheidung ist mit `mvp-scope.md`, `mobile-phase0-screens.md` und der Lookup-Architektur vereinbar und minimiert Implementierungs- und Betriebsrisiko für den Piloten.

---

## 8. Nächste technische Schritte für den Haupt-PC

Empfohlene Reihenfolge (alles ohne Sync-Engine):

1. **`data/lookup-seed/`** anlegen: `manifest.json` + `medications.json` + `algorithms.json` (oder `content.json`) nach `content-seed-plan.md`; Inhalte aus den bestehenden TS-Mocks migrieren oder ersetzen.
2. **Validierungsschema** (Zod o. Ä.) ableiten aus `apps/mobile-app/src/types/content.ts` und `lookup-data-shape.md`; im CI oder als Pre-Build-Skript ausführen.
3. **Loader-Modul** in der Mobile-App (z. B. `apps/mobile-app/src/data/loadLookupBundle.ts` oder `services/contentLoader.ts`): JSON einlesen, validieren, typisierte Arrays zurückgeben.
4. **`contentIndex.ts` / Daten-Hooks** umbiegen: nicht mehr direkt aus `medications.ts`/`algorithms.ts` importieren, sondern aus dem geladenen Store (ein Singleton oder React-Kontext nach Team-Konvention — bewusst minimal halten).
5. **Such-Implementierung:** Index aus Store bauen (`lookup-first-architecture.md`); `SearchScreen` bzw. zentrale Suchlogik nur gegen diesen Index.
6. **Metro/Expo-Konfiguration** prüfen, falls JSON als Asset importiert wird (Pfad, Bundling).
7. **Alte Mock-Module** entfernen oder auf reine Test-Fixtures reduzieren, um **eine** Wahrheit zu haben.

Verwandte Artefakte: `docs/context/content-seed-plan.md`, `docs/context/mobile-phase0-screens.md`, `docs/architecture/lookup-first-architecture.md`.
