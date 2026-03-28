# Lookup-First Architecture

**Stand:** 28. März 2026  
**Einordnung:** **Zielarchitektur** (Module und Services über mehrere Phasen) und **Phase-0-Subset** (Lookup-first MVP). Konkretes Phase-0-Datenmodell: `docs/context/lookup-data-shape.md`.

---

## Phase-0 Subset (Lookup-first MVP)

Phase 0 enthält ausschließlich:

- eingebettetes JSON-Bundle
- lokaler RAM-Store
- In-Memory-Suche
- lineare Algorithmus-Schritte
- Freitext-Dosierung
- keine Sync-Engine
- keine `DosageRule`
- keine Verzweigungslogik
- kein Remote-Loading erforderlich

---

## Leitprinzip

Die App ist ein **Nachschlagewerk**, kein Content-Management-System.

Jede Architekturentscheidung folgt dieser Frage:
> Kann eine Einsatzkraft die Information in unter 3 Sekunden finden — ohne Netz?

---

## Module

### `medication`

**Verantwortung:** Medikamenten-Entitäten und deren Darstellungsstruktur.

**Phase 0 nutzt:** Freitext-`dosage` (Lesetext, keine maschinelle Auswertung); konsistent mit `lookup-data-shape.md`. Strukturierte Dosierungsmodelle erst später.

Enthält:

- `Medication` — Name, Wirkstoff, Handelsnamen, Dosierungsregeln, Kontraindikationen, Hinweise *(konzeptionell; Phase 0: Abbildung über Freitextfelder und optionale Zusatztexte, keine `DosageRule` in den Nutzdaten)*
- `DosageRule` — Gewicht, Alter, Patientengruppe → Dosis **(Zielarchitektur, nach Phase 0)**
- `MedicationIndex` — flache, suchfähige Darstellung für das Search-Modul

Abhängigkeiten: keine (reines Datenmodul)

---

### `algorithm`

**Verantwortung:** Algorithmen-Entitäten und deren Schritt-Struktur.

**Phase 0 nutzt:** lineare `steps` (z. B. `{ text }`); keine auswertbaren Verzweigungen in der App. Verzweigungen/Bedingungen in Schritten erst später (Zielarchitektur).

Enthält:

- `Algorithm` — Name, Kategorie, Geltungsbereich
- `AlgorithmStep` — Schritt-Nummer, Anweisung, Bedingungen, Verzweigungen *(Bedingungen/Verzweigungen: **Zielarchitektur, nach Phase 0**; Phase 0: lineare Abfolge)*
- `AlgorithmIndex` — flache, suchfähige Darstellung für das Search-Modul

Abhängigkeiten: keine (reines Datenmodul)

---

### `search`

**Verantwortung:** Einheitliche, schnelle Suche über alle Lookup-Inhalte.

Enthält:

- `SearchIndex` — kombinierter Index aus `MedicationIndex` und `AlgorithmIndex`
- `SearchQuery` — Eingabe-Typ mit Normalisierung (Kleinschreibung, Tippfehlertoleranz)
- `SearchResult` — Treffer mit Typ (`medication` | `algorithm`), Titel, Relevanz

**Phase 0:**

- Index entsteht aus dem lokalen Bestand, der aus dem **eingebetteten Bundle** befüllt wurde (beim Start: Bundle → Store/RAM → `buildIndex`)
- kein Cache-/Sync-Mechanismus für die Suche; kein „Laden des Index aus einem Post-Sync-Cache“

**Zielarchitektur (ergänzend, nach Phase 0):**

- Index kann weiterhin rein lokal gehalten werden; Anbindung an erweiterte Offline-/Update-Pfade möglich, ohne Phase-0-Pflicht

Regeln:

- Keine Server-Anfrage für Suchanfragen
- Suchanfrage darf keine UI-Abhängigkeit enthalten

Abhängigkeiten: `medication` (Index), `algorithm` (Index)

---

### `offline`

**Verantwortung:** Lokale Datenhaltung und Synchronisation *(Synchronisation: **Zielarchitektur, nach Phase 0**)*.

Enthält:

- `OfflineStore` — lokaler Datenspeicher (Medikamente, Algorithmen, Suchindex)
- `SyncState` — letzter Sync-Zeitpunkt, ausstehende Updates **(Zielarchitektur, nach Phase 0)**
- `SyncStrategy` — wann und wie wird synchronisiert (Hintergrund, nur bei WLAN, manuell) **(Zielarchitektur, nach Phase 0)**

**Phase 0:** persistenter Store ist nicht zwingend; Mindestfall RAM-Store aus eingebettetem Bundle — siehe `docs/context/offline-phase0-decision.md`. **Keine Sync-Engine.**

Regeln:

- App startet ausschließlich aus dem lokalen Store — nie aus dem Netz
- Netz ist optional, nie Voraussetzung
- Sync überschreibt nur, wenn neue Version verfügbar **(Zielarchitektur, nach Phase 0; in Phase 0 entfällt der Sync-Pfad)**

Abhängigkeiten: `content` (Datenquelle; in Phase 0 nur Bundle-Laden, kein Sync)

---

### `content`

**Verantwortung:** Rohdaten-Laden und Seed-Daten-Bereitstellung.

Enthält:

- `ContentLoader` — lädt Medikamente und Algorithmen aus Seed-Dateien oder Remote-Quelle *(siehe Phase-0- vs. später unten)*
- `ContentBundle` — strukturiertes Paket: Medikamente + Algorithmen einer Konfiguration
- `ContentVersion` — Versions-ID des aktuell geladenen Bundles

**Phase 0:**

- lädt **nur** aus dem **eingebetteten Bundle** (z. B. JSON im App-Build gemäß `docs/context/content-seed-plan.md`)
- **kein** Remote-Loading als Voraussetzung für Nutzung

**Nach Phase 0:**

- Remote-Quelle **optional** (z. B. Bundle-Download); weiterhin offline-first

Regeln:

- `content` liefert Daten an `offline` — nicht direkt an `medication` oder `algorithm`
- Kein Lifecycle, keine Freigabe-Logik im MVP
- Seed-Daten als statische Dateien im App-Bundle (Phase 0)

Abhängigkeiten: `offline` (schreibt in Store)

---

### `organization`

**Verantwortung:** Konfiguration der aktiven Organisation.

Enthält:

- `OrganizationConfig` — Name, Region, aktive Content-Bundle-ID
- `OrganizationContext` — welche Organisation ist aktuell aktiv

Regeln:

- Phase 0: eine Organisation, fest konfiguriert (keine Auswahl)
- Kein Rollen-Modell, kein Login im MVP
- `organization` steuert, welches `ContentBundle` geladen wird

Abhängigkeiten: `content`

---

## Services

### `MedicationLookupService`

```
find(query: string): Medication[]
list(): Medication[]
getById(id: string): Medication | null
```

- Liest ausschließlich aus dem lokalen `OfflineStore`
- Keine asynchronen Server-Calls
- Gibt leere Liste zurück, wenn kein Treffer — nie null ohne Handling
- Keine Dosierungslogik in Phase 0 (kommt als Phase-1-Erweiterung)

---

### `AlgorithmLookupService`

```
find(query: string): Algorithm[]
getById(id: string): Algorithm | null
getSteps(algorithmId: string): AlgorithmStep[]
```

- Liest ausschließlich aus dem lokalen `OfflineStore`
- `getSteps` gibt immer vollständige, sortierte Schrittreihenfolge zurück *(Phase 0: linear, ohne Verzweigungsauswertung)*
- Kein Netz-Fallback

---

### `SearchService`

```
search(query: SearchQuery): SearchResult[]
buildIndex(): void
```

- `buildIndex` wird beim App-Start aus dem lokalen Store aufgebaut *(Phase 0: Store aus eingebettetem Bundle; kein Sync)*
- `search` arbeitet ausschließlich auf dem In-Memory-Index
- Ergebnis-Reihenfolge: Exakter Treffer → Präfix → Fuzzy

---

### `OfflineCacheService`

```
initialize(): Promise<void>
isReady(): boolean
getLastSyncedAt(): Date | null
sync(): Promise<SyncResult>
```

- `initialize` lädt das ContentBundle in den Store beim ersten Start
- `isReady` gibt `false` zurück solange kein Bundle geladen ist (Ladescreen)
- `getLastSyncedAt` — **Zielarchitektur, nach Phase 0** *(Phase 0: kein Sync; Feld/ API ggf. stub oder nicht genutzt)*
- `sync` läuft im Hintergrund, blockiert nie die UI **(Zielarchitektur, nach Phase 0; in Phase 0 keine Sync-Engine)**
- Bei fehlgeschlagenem Sync: bestehender Cache bleibt gültig **(Zielarchitektur, nach Phase 0)**

---

## Datenfluss

**Phase 0:** ohne `sync()`-Pfad; Bundle ist eingebettet.

```
OrganizationConfig
    → ContentLoader (lädt Bundle)
        → OfflineCacheService (schreibt in Store)
            → MedicationLookupService  (liest)
            → AlgorithmLookupService   (liest)
            → SearchService.buildIndex (liest, baut Index)
                → SearchService.search (In-Memory)
```

**Nach Phase 0:** ergänzend Sync-/Remote-Pfade gemäß `SyncStrategy` möglich (Zielarchitektur).

---

## Modul-Abhängigkeiten

```
organization → content → offline → medication
                                 → algorithm
                                 → search
```

Richtung ist immer top-down. Kein Modul importiert aus einem höheren.

---

## Verbotene Kopplungen

| Verboten | Begründung |
|----------|-----------|
| `search` importiert aus `organization` | Search ist inhaltsagnostisch |
| `medication` oder `algorithm` schreiben in den Store | Nur `offline` schreibt |
| Services machen HTTP-Calls ohne Fallback | App muss offline starten |
| UI-Logik in Services | Services haben keine Komponenten-Abhängigkeit |
| Lernlogik in `algorithm` oder `medication` | Gehört in Phase 2, separates Modul |
| KI-Logik in `search` | Gehört in Phase 4, separates Modul |

---

## Explizit nicht in dieser Architektur

- Lernmodus, Quiz, Fortschritt — Phase 2
- KI-Suche, Symptom-Matching — Phase 4
- Freigabe-Workflow, ApprovalStatus — Phase 3
- Rollen-Modell, Auth — Phase 3
- Multi-Tenant Runtime-Enforcement — Phase 3
- ContentPackage Release-Engine — Phase 3
