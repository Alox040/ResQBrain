# Übergabe Laptop → Haupt-PC

**Stand:** 28. März 2026  
**Phase:** 0 (Lookup-first MVP) — **keine** Scope-Erweiterung  
**Abgrenzung:** keine KI, keine Governance-/Release-UI in der Mobile-App, keine Sync-Engine, keine Multi-Tenant-Laufzeit in der App, keine vorgezogene Plattform-Architektur über das dokumentierte Minimum hinaus.

---

## 1. Heute fachlich entschieden

### Welche Entscheidungen festgezogen wurden

- **Datenform Phase 0:** Pflicht- und optionale Felder für `Medication` und `Algorithm` sind gegen `apps/mobile-app/src/types/content.ts` und MVP-Grenzen abgegrenzt; Plattform-Domain (`@resqbrain/domain`) ist **kein** Vorbild für Seed-Pflichtfelder (`lookup-data-shape.md`).
- **Seed- und Bundle-Plan:** JSON unter `data/lookup-seed/` inkl. `manifest.json` (`schemaVersion`, `bundleId`) als kanonische Quelle; TS-Mocks nur Übergang (`content-seed-plan.md`).
- **Mobile Screens:** Soll-Verhalten für die vier Lookup-Screens inkl. Reihenfolge, Offline-Lesepfade, Querverweise, Ausschlüsse (`mobile-phase0-screens.md`).
- **Offline MVP:** „Immer mitgeliefertes Bundle“ → Start: laden/validieren → **RAM-Store** + **In-Memory-Suchindex**; kein Netz für Lookup; Updates zunächst über App-Release (`offline-phase0-decision.md`).
- **Phase-0-Grenzen (unverändert zentral):** `mvp-scope.md` — kein Rechner, keine KI, keine Org-Verwaltung in der App, keine Versions-UI, keine Lernlogik.
- **Zielarchitektur Lesepfad:** weiterhin `lookup-first-architecture.md` (Content → lokale Nutzung, Suche lokal); Umsetzung darf in Phase 0 minimal interpretiert werden (kein Pflicht-SQLite).

### Welche Dokumente jetzt den kanonischen Stand beschreiben

| Thema | Datei |
|--------|--------|
| Datenfelder Phase 0 | `docs/context/lookup-data-shape.md` |
| Seed-Struktur, Manifest, JSON-Empfehlung | `docs/context/content-seed-plan.md` |
| Screen-Spezifikation Mobile | `docs/context/mobile-phase0-screens.md` |
| Offline-Entscheidung MVP | `docs/context/offline-phase0-decision.md` |
| MVP-Grenzen | `docs/context/mvp-scope.md` |
| Lookup-Module / Verbote | `docs/architecture/lookup-first-architecture.md` |
| App-Typen | `apps/mobile-app/src/types/content.ts` |

**Hinweis:** Aktueller Status siehe `docs/status/`. `docs/roadmap/PROJECT_ROADMAP.md` listet Phase-0-Punkte (Seed, Offline, Suche, Mobile-UI) noch größtenteils als offen — die Kontextdateien vom 28. März **präzisieren**, *wie* diese Punkte umgesetzt werden sollen.

---

## 2. Was dadurch jetzt implementierbar ist

Ohne neue Grundsatzdiskussion:

- Anlegen und Befüllen von **`data/lookup-seed/`** inkl. Validierung gegen `content.ts`.
- **Ein Loader**, der das Bundle zur Laufzeit oder über Build-Import in typisierte Arrays überführt und **eine** zentrale Datenquelle für die App bereitstellt.
- **Umstellung von `contentIndex.ts`** (und damit Detail-Screens), sodass alle Lesepfade aus derselben Quelle speisen.
- **Umstellung der List-Screens**, die derzeit direkt `medications.ts` / `algorithms.ts` importieren — auf dieselbe Quelle wie `contentIndex`.
- **Suchansicht** auf denselben Index wie die Inhalte (`contentIndex.searchIndexItems` o. Ä.); Entfernen der Spaltung zu `@/search/mockData`, sofern noch genutzt.
- **Querverweise** `relatedAlgorithmIds` / `relatedMedicationIds` gemäß `mobile-phase0-screens.md`.
- **Konsolidierung / Entfernen** redundanter TS-Mock-Dateien nach erfolgreicher JSON-Anbindung.

Nicht erforderlich für Start: persistenter DB-Store, Hintergrund-Sync, Organisationsswitch, Release-UI.

---

## 3. Empfohlene Umsetzungsreihenfolge am Haupt-PC

1. `data/lookup-seed/` anlegen (`manifest.json`, `medications.json`, `algorithms.json` oder `content.json` nach `content-seed-plan.md`).
2. **Schema / Validation** anlegen (Zod oder JSON Schema + Check-Skript), abgeglichen mit `content.ts` und `lookup-data-shape.md`.
3. **Loader** bauen (JSON einlesen, validieren, `Medication[]` / `Algorithm[]` zurückgeben oder einmalig initialisieren).
4. **`contentIndex.ts`** anbinden: Import aus Loader statt aus `medications.ts` / `algorithms.ts`; `contentLookup`, `searchIndexItems` daraus ableiten.
5. **`MedicationListScreen`** anbinden: Daten aus zentraler Quelle (nicht direkter Mock-Import).
6. **`MedicationDetailScreen`**: Querverweise zu Algorithmen; optional `notes` nur wenn vorhanden (Spec).
7. **`AlgorithmListScreen`**: wie Medikamentenliste, zentrale Quelle.
8. **`AlgorithmDetailScreen`**: `warnings` vor Schritten; Querverweise zu Medikamenten; **Quellen** nicht als Screen-Hardcode ausbauen — erst wenn im Seed modelliert (`mobile-phase0-screens.md`).
9. **Querverweise** end-to-end testen (Navigation, fehlende IDs graceful).
10. **`SearchScreen`**: gleicher Suchindex wie `contentIndex`; `@/search/mockData` entfernen oder auf eine Quelle reduzieren.
11. **TS-Mocks entfernen / konsolidieren** (`medications.ts`, `algorithms.ts`, ggf. `mock*`), Duplikate vermeiden.

---

## 4. Aufgaben, die bewusst nicht am Laptop umgesetzt werden sollten

- Längere **Metro/Expo-Build-Schleifen**, Geräte-Tests, Simulator-Debugging.
- **Erstkonfiguration** von Asset-Pipelines für JSON (Metro-Resolver, `require` vs. `expo-asset`) ohne stabile Umgebung.
- Breite **Refactors** an Navigation oder Domain-Paket parallel zur Datenmigration.
- Einführung von **SQLite/MMKV/AsyncStorage** „für später“ ohne konkreten Phase-0-Mehrwert (laut `offline-phase0-decision.md` für MVP nicht nötig).
- Arbeit an **Governance, Versioning-Services, API/Auth** — das widerspricht Phase-0-Fokus und `WORK_SESSION.md`-Langfristzielen, gehört aber **nicht** in diesen Block.

---

## 5. Risiken vor Implementierungsstart

| Risiko | Kurz |
|--------|------|
| **Doppelte Datenquellen** | Listen importieren `medications.ts`, Suche nutzt `mockData`, Details `contentIndex` — Zustand muss auf **eine** Quelle zusammenfallen. |
| **Mismatch `content.ts` ↔ Seeds** | JSON-Felder fehlen oder heißen anders → Laufzeit- oder Validierungsfehler; Schema zuerst. |
| **Inkonsistente Feldnamen** | Alte Mocks nutzten teils andere Begriffe als `label`/`indication`; Seeds strikt an `content.ts` halten. |
| **Veraltete TS-Mocks** | Bleiben im Bundle, obwohl JSON aktiv — irreführend für Redaktion und Tests. |
| **Unklare Suchanbindung** | `SearchScreen` aktuell `@/search/mockData` — muss mit echtem `searchIndexItems` und erweiterten Indexfeldern (`dosage`, Schritte …) gemäß Spec vereinheitlicht werden. |
| **AlgorithmDetailScreen: Quellen-Map** | Hardcodierte `ALGORITHM_SOURCES` — widerspricht Spec; bei JSON-Migration nicht perpetuieren. |

---

## 6. Erste Dateien für den Haupt-PC-Start

**Lesen (Kontext):**

- `docs/context/offline-phase0-decision.md` (Abschnitt 8)
- `docs/context/content-seed-plan.md`
- `apps/mobile-app/src/types/content.ts`

**Ist-Stand prüfen:**

- `apps/mobile-app/src/data/contentIndex.ts`
- `apps/mobile-app/src/data/medications.ts`, `algorithms.ts`
- `apps/mobile-app/src/screens/MedicationListScreen.tsx`, `AlgorithmListScreen.tsx`
- `apps/mobile-app/src/screens/SearchScreen.tsx` und `apps/mobile-app/src/search/mockData.ts` (falls vorhanden)

**Neu anlegen:**

- `data/lookup-seed/manifest.json`
- `data/lookup-seed/medications.json` / `algorithms.json` (Inhalt aus bestehenden TS-Daten migrieren)
- z. B. `apps/mobile-app/src/data/loadLookupBundle.ts` (oder gleichwertiger schlanker Loader)
- Validierung: z. B. `apps/mobile-app/src/data/lookupSchema.ts` + npm-Skript oder manueller Aufruf

---

## 7. Empfohlener erster Implementierungsblock

**Ziel einer fokussierten Session:** *Eine validierte JSON-Quelle + Loader + `contentIndex` liest daraus — App startet wie zuvor, ohne UI-Feature-Neuheit.*

Konkret:

1. `data/lookup-seed/` mit Manifest + JSON aus den aktuellen Arrays aus `medications.ts` / `algorithms.ts` befüllen (1:1-Felder).
2. Zod- (oder gleichwertige) Validierung, die fehlschlägt, wenn JSON nicht zu `Medication`/`Algorithm` passt.
3. Loader-Funktion, die beim App-Start (oder modulimport) die Arrays liefert.
4. `contentIndex.ts` auf Loader umstellen; App kurz bauen/starten, Listen/Details stichprobenartig prüfen.

**Noch nicht** in diesem Block: SearchScreen-Umstellung, Querverweis-UI, Löschen der TS-Dateien (erst wenn stabil grün).

---

## 8. Definition of Done für den ersten PC-Block

- [ ] `data/lookup-seed/` liegt im Repo mit konsistentem `manifest.json` (`schemaVersion`, `bundleId`).
- [ ] Validierung schlägt bei absichtlich kaputtem JSON fehl (nachweisbar, z. B. einmaliger Testlauf).
- [ ] `contentIndex.ts` bezieht Medikamente und Algorithmen **nur** noch über den Loader aus dem JSON-Bundle (kein paralleler Import der alten Arrays in `contentIndex`).
- [ ] Mobile-App startet; Medikamenten- und Algorithmus-**Detail** weiterhin aufrufbar wie vorher (über bestehende Navigation).
- [ ] Alte TS-Datenmodule sind entweder **nur noch Dünnschicht** (re-export aus JSON) oder unverändert vorhanden, aber **nicht** mehr von `contentIndex` genutzt — klar erkennbar, welche Datei „Single Source of Truth“ ist.

Wenn diese Punkte erfüllt sind, ist der erste Block abgeschlossen; der nächste Block kann List-Screens, Search und Querverweise ohne Datengrundlagen-Risiko angehen.

---

## Verweise

- `README.md` — Gesamtphase und Kontextpfade  
- `docs/roadmap/PROJECT_ROADMAP.md` — Phase-0-Checkboxen nachziehen, wenn Meilensteine erreicht sind  
- `docs/status/PROJECT_STATUS.md` / `WORK_SESSION.md` — bei nächster Session bei Bedarf mit Mobile-Fortschritt aktualisieren
