# Lookup-First Architecture

**Stand:** 26. März 2026
**Scope:** Phase 0 — Lookup App (MVP)

---

## Leitprinzip

Die App ist ein **Nachschlagewerk**, kein Content-Management-System.

Jede Architekturentscheidung folgt dieser Frage:
> Kann eine Einsatzkraft die Information in unter 3 Sekunden finden — ohne Netz?

---

## Module

### `medication`

**Verantwortung:** Medikamenten-Entitäten und deren Darstellungsstruktur.

Enthält:
- `Medication` — Name, Wirkstoff, Handelsnamen, Dosierungsregeln, Kontraindikationen, Hinweise
- `DosageRule` — Gewicht, Alter, Patientengruppe → Dosis
- `MedicationIndex` — flache, suchfähige Darstellung für das Search-Modul

Abhängigkeiten: keine (reines Datenmodul)

---

### `algorithm`

**Verantwortung:** Algorithmen-Entitäten und deren Schritt-Struktur.

Enthält:
- `Algorithm` — Name, Kategorie, Geltungsbereich
- `AlgorithmStep` — Schritt-Nummer, Anweisung, Bedingungen, Verzweigungen
- `AlgorithmIndex` — flache, suchfähige Darstellung für das Search-Modul

Abhängigkeiten: keine (reines Datenmodul)

---

### `search`

**Verantwortung:** Einheitliche, schnelle Suche über alle Lookup-Inhalte.

Enthält:
- `SearchIndex` — kombinierter Index aus `MedicationIndex` und `AlgorithmIndex`
- `SearchQuery` — Eingabe-Typ mit Normalisierung (Kleinschreibung, Tippfehlertoleranz)
- `SearchResult` — Treffer mit Typ (`medication` | `algorithm`), Titel, Relevanz

Regeln:
- Index wird lokal gehalten und beim Start aus dem Cache geladen
- Keine Server-Anfrage für Suchanfragen
- Suchanfrage darf keine UI-Abhängigkeit enthalten

Abhängigkeiten: `medication` (Index), `algorithm` (Index)

---

### `offline`

**Verantwortung:** Lokale Datenhaltung und Synchronisation.

Enthält:
- `OfflineStore` — lokaler Datenspeicher (Medikamente, Algorithmen, Suchindex)
- `SyncState` — letzter Sync-Zeitpunkt, ausstehende Updates
- `SyncStrategy` — wann und wie wird synchronisiert (Hintergrund, nur bei WLAN, manuell)

Regeln:
- App startet ausschließlich aus dem lokalen Store — nie aus dem Netz
- Netz ist optional, nie Voraussetzung
- Sync überschreibt nur, wenn neue Version verfügbar

Abhängigkeiten: `content` (Datenquelle für Sync)

---

### `content`

**Verantwortung:** Rohdaten-Laden und Seed-Daten-Bereitstellung.

Enthält:
- `ContentLoader` — lädt Medikamente und Algorithmen aus Seed-Dateien oder Remote-Quelle
- `ContentBundle` — strukturiertes Paket: Medikamente + Algorithmen einer Konfiguration
- `ContentVersion` — Versions-ID des aktuell geladenen Bundles

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
- `getSteps` gibt immer vollständige, sortierte Schrittreihenfolge zurück
- Kein Netz-Fallback

---

### `SearchService`

```
search(query: SearchQuery): SearchResult[]
buildIndex(): void
```

- `buildIndex` wird beim App-Start aus dem lokalen Store aufgebaut
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
- `sync` läuft im Hintergrund, blockiert nie die UI
- Bei fehlgeschlagenem Sync: bestehender Cache bleibt gültig

---

## Datenfluss

```
OrganizationConfig
    → ContentLoader (lädt Bundle)
        → OfflineCacheService (schreibt in Store)
            → MedicationLookupService  (liest)
            → AlgorithmLookupService   (liest)
            → SearchService.buildIndex (liest, baut Index)
                → SearchService.search (In-Memory)
```

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
