# Haupt-PC Implementierungsreihenfolge (Phase 0)

**Stand:** 28. März 2026  
**Quellen:** `lookup-data-shape.md`, `content-seed-plan.md`, `mobile-phase0-screens.md`, `offline-phase0-decision.md`, `next-steps-laptop-to-pc.md`, `mvp-scope.md`, `lookup-first-architecture.md`, `content.ts`, README, Status/Roadmap.

**Abgrenzung:** nur Phase 0 — keine Sync-Engine, keine Governance-UI, kein Multi-Tenant-Runtime, keine KI, keine Dosierungslogik, keine Verzweigungslogik in der App.

**Prinzip:** nach jedem Block App startfähig; Single Source of Truth zuerst; keine parallelen Großrefactors.

---

## Block 1 — Datenbasis (Seed + Loader)

1. Verzeichnis `data/lookup-seed/` anlegen.
2. `manifest.json` mit `schemaVersion`, `bundleId` (und optional `locale`, `contentCutoffDate`) befüllen (`content-seed-plan.md`).
3. Inhalt aus `apps/mobile-app/src/data/medications.ts` und `algorithms.ts` 1:1 nach **`medications.json`** und **`algorithms.json`** übernehmen (Felder exakt wie `content.ts`).
4. Zod-Schemas (oder gleichwertig) für `Medication` und `Algorithm` definieren — strikt an `apps/mobile-app/src/types/content.ts`.
5. **`loadLookupBundle.ts`** (o. Ä.): JSON importieren oder per `require`/Asset laden, parsen, mit Zod validieren, `{ medications, algorithms }` zurückgeben.
6. Metro/Expo so konfigurieren, dass JSON aus `data/lookup-seed/` im Bundle landet (oder JSON vorübergehend unter `apps/mobile-app/assets/` ablegen, bis Monorepo-Pfad geklärt ist — Hauptsache ein zuverlässiger Import).
7. Kurz manuell: App bauen/starten, Loader liefert Arrays ohne Crash.

---

## Block 2 — contentIndex + Suche

1. **`contentIndex.ts`:** Import von `medications.ts`/`algorithms.ts` entfernen; stattdessen Loader nutzen und daraus `contentItems`, `contentLookup`, `searchItems`, `searchIndexItems` ableiten (Logik unverändert lassen).
2. App starten: Detail-Screens über `getMedicationById` / `getAlgorithmById` weiterhin ok.
3. **`SearchScreen.tsx`:** Import von `@/search/mockData` entfernen; `searchIndexItems` aus `@/data/contentIndex` (oder dünner Re-Export) nutzen.
4. Such-Matching minimal erweitern gemäß `lookup-data-shape.md`: mindestens weiter `label`, `indication`, `searchTerms`; optional `dosage` / Schritttexte / `warnings`/`notes` in dieselbe Filterfunktion aufnehmen — ohne neue UI-Komplexität.
5. **`src/search/mockData.ts`** löschen oder auf leeren Stub reduzieren, wenn unreferenziert.

---

## Block 3 — Screens anbinden

1. **`MedicationListScreen.tsx`:** Datenquelle auf exportierte Liste aus `contentIndex` oder Helper `listMedications()` aus demselben Modul wie Loader — kein direkter Import von `medications.ts`.
2. **`AlgorithmListScreen.tsx`:** analog für Algorithmen.
3. **`MedicationDetailScreen.tsx`:** `notes` nur rendern, wenn vorhanden; Platzhalter entfernen, der `undefined` als Text zeigt.
4. **`AlgorithmDetailScreen.tsx`:** Reihenfolge an Spec anpassen: **`warnings`** (falls gesetzt) vor Block **Schritte**; `notes` nach Spec platzieren.
5. Smoke-Test: alle vier Screens durchtippen.

---

## Block 4 — Querverweise + Polish

1. **`MedicationDetailScreen`:** Sektion „Verknüpfte Algorithmen“ aus `relatedAlgorithmIds` — navigieren zu `AlgorithmDetail` mit `algorithmId`; ungültige IDs überspringen oder kurz ignorieren.
2. **`AlgorithmDetailScreen`:** Sektion „Verknüpfte Medikamente“ aus `relatedMedicationIds` — navigieren zu `MedicationDetail`.
3. Navigation: Nested-Stacks prüfen (wie bisher `SearchScreen` → Detail); ggf. gleiches Muster für Links aus Detail.
4. **`ALGORITHM_SOURCES`:** hardcodierte Map entfernen oder durch statischen Hinweis aus `manifest`/`notes` ersetzen, bis Seed-Feld für Quellen existiert (`mobile-phase0-screens.md`).
5. Typografie/Kontrast nur wo nötig für Lesbarkeit (kein Redesign).

---

## Block 5 — Cleanup

1. **`medications.ts` / `algorithms.ts`:** löschen **oder** nur noch Re-Export aus JSON für Notfälle — Ziel: keine zweite editierbare Quelle; bevorzugt löschen, wenn Loader allein genügt.
2. Repo nach verwaisten Imports durchsuchen (`grep medications`, `algorithms`, `mockData`).
3. **`docs/roadmap/PROJECT_ROADMAP.md`:** Phase-0-Zeilen Seed/Offline/Suche nachziehen, wenn erfüllt.
4. Optional: `PROJECT_STATUS.md` / `WORK_SESSION.md` um einen Satz Mobile-Datenpipeline ergänzen (kein Pflichtteil dieses Blocks).

---

## Erster Block (konkret ausführen)

### Exakte Schritte

1. Ordner `data/lookup-seed/` erstellen.
2. `manifest.json` anlegen (`schemaVersion: "1"`, `bundleId: "pilot-wache-001"` o. Ä.).
3. Arrays aus `medications.ts` und `algorithms.ts` als JSON exportieren (manuell oder kleines einmaliges Skript) → `medications.json`, `algorithms.json`.
4. Datei `apps/mobile-app/src/data/lookupSchema.ts` (Name frei) mit Zod-Schemas für `ContentTag`, `Medication`, `Algorithm`.
5. Datei `apps/mobile-app/src/data/loadLookupBundle.ts`: JSON einlesen, `manifest` optional validieren, Arrays mit Zod parsen, exportiertes Objekt `{ medications, algorithms }`.
6. JSON-Pfad wählen, der mit Metro bundelt (ggf. JSON nach `apps/mobile-app/assets/lookup-seed/` kopieren und dort importieren — pragmatisch).
7. Noch **nicht** `contentIndex` ändern — erst wenn Schritt 6 grün ist; dann Block 2 starten.

### Dateien die erstellt werden

- `data/lookup-seed/manifest.json`
- `data/lookup-seed/medications.json`
- `data/lookup-seed/algorithms.json`
- `apps/mobile-app/src/data/lookupSchema.ts` (oder `lookupBundle.zod.ts`)
- `apps/mobile-app/src/data/loadLookupBundle.ts`
- ggf. `apps/mobile-app/assets/lookup-seed/*.json` (Kopie, falls Bundler-Pfad)

### Dateien die geändert werden

- Block 1 idealerweise **keine** bestehende Screen-Datei — nur ggf. `package.json` / Metro-Konfiguration / `app.json` falls Asset-Pfad nötig.

---

## Definition of Done Block 1

- [ ] `data/lookup-seed/` liegt mit Manifest + zwei JSON-Arrays (oder einem kombinierten) im Repo.
- [ ] Zod-Validierung wirft bei manipuliertem JSON einen klaren Fehler (einmal verifiziert).
- [ ] `loadLookupBundle()` liefert typisierte `Medication[]` und `Algorithm[]` beim App-Start (temporärer Aufruf aus `App.tsx` oder Log in Loader ausreichend zum Nachweis).
- [ ] Keine Änderung an `contentIndex`/Screens nötig, um Block 1 als „fertig“ zu werten — App-Verhalten darf noch identisch zur Ausgangslage sein.

---

## Risiken

| Punkt | Mitigation |
|-------|------------|
| **Doppelte Datenquellen** | Block 2 sofort anschließen; bis dahin klar dokumentieren, dass TS-Dateien noch Kanon für UI sind. |
| **Typ-Mismatch JSON ↔ `content.ts`** | Zod an `content.ts` spiegeln; fehlende optionale Felder explizit `.optional()` / Defaults. |
| **Metro importiert `data/lookup-seed` nicht** | JSON unter `apps/mobile-app/...` duplizieren oder `metro.config.js` anpassen — kleiner pragmatischer Schritt, kein Refactor. |
| **Große JSON-Dateien** | Pilot klein halten; Performance erst messen, wenn Problem auftritt. |

---

## Nächster Block nach Abschluss

**Block 2:** `contentIndex.ts` auf Loader umstellen, `SearchScreen` von `mockData` auf dieselben `searchIndexItems` hängen — danach ist die **eine** inhaltliche Wahrheit für Lookup + Suche geschlossen, bevor Listen-Screens umgestellt werden.
