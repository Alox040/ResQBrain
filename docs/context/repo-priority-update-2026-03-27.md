# Repo Priority Update

**Last Updated:** 2026-03-27

## Anlass

Abgleich von aktuellem Repository-Stand mit der bestehenden Roadmap und den neueren Kontextdateien.

## Ergebnis des Abgleichs

Die offizielle Roadmap in `docs/roadmap/PROJECT_ROADMAP.md` bleibt als grobe Phasenstruktur gueltig, ist aber fuer die operative Arbeit weniger praezise als die neueren Dateien unter `docs/context/`.

Insbesondere `docs/context/roadmap-status.md` und `docs/context/next-steps.md` spiegeln den tatsaechlichen Stand fuer Phase 0 aktueller wider.

## Kanonische Priorisierung fuer die naechsten Arbeiten

### 1. Navigation und Screen-Luecken schliessen

Direkt naechster Fokus fuer Phase 0:

- Tab-/Stack-Flows vereinheitlichen
- Header, Titel und Rueckwege konsistent machen
- Search -> MedicationDetail robust halten
- Search -> AlgorithmDetail robust halten
- Home-Schnellzugriffe mit echter Navigation verbinden
- Algorithmus-Detailansicht von Platzhalter auf echte Schrittansicht bringen

### 2. MVP-Datenformat stabilisieren

Vor weiterem Ausbau der UI soll das Datenmodell fuer Lookup-Pfade konsistent sein:

- gemeinsames stabiles Datenformat fuer Medikamente und Algorithmen
- IDs und Referenzen app-weit vereinheitlichen
- Feldnamen und Mindeststruktur bereinigen

### 3. Mock-/Seed-Daten auf MVP-Mindestumfang bringen

- Medikamenten- und Algorithmusdatensaetze vervollstaendigen
- Textqualitaet und Konsistenz bereinigen
- Datenluecken fuer Listen, Suche und Detailansichten schliessen

### 4. Lookup-MVP funktional absichern

- Suchverhalten fuer echte MVP-Nutzung pruefbar machen
- Kerninhalte bewusst begrenzen und vervollstaendigen
- schnelle lokale Nutzung praktisch absichern

### 5. UI vereinheitlichen

- visuelle Sprache fuer Home, Listen, Detail und Search vereinheitlichen
- Typografie, Spacing und Farbsystem konsistent anwenden
- Fokus auf schnelle Bedienbarkeit im Einsatz

### 6. Offline-Read-Pfad pragmatisch festlegen

- lokale Datenhaltung fuer den Read-only-Lookup festlegen
- keine vorgezogene komplexe Sync-Architektur
- nur das absichern, was Phase 0 wirklich braucht

## Wichtige Einordnung

Die naechsten Arbeiten sind **nicht** mehr auf dem Niveau "erste Mobile-App-Ansicht aufsetzen".  
Die vorhandenen Kontextdateien gehen bereits davon aus, dass eine mobile Lookup-Basis existiert.  
Der operative Schwerpunkt liegt daher jetzt auf Vervollstaendigung, Vereinheitlichung und Absicherung des Phase-0-Lookup-MVP.

## Praktische Reihenfolge

### Haupt-PC

1. Navigation und Screen-Luecken schliessen
2. Datenformat stabilisieren
3. Suchverhalten technisch absichern
4. UI vereinheitlichen
5. Offline-Read-Pfad festlegen

### Laptop

1. Mock-/Seed-Daten vervollstaendigen
2. Textqualitaet und Konsistenz verbessern
3. UI-/UX-Probleme dokumentieren
4. Testfaelle und Validierungschecklisten vorbereiten

## Kurzfazit

Der aktuelle Repo-Stand passt weiterhin zu **Phase 0 (Lookup-first MVP)**.  
Die unmittelbar naechsten Schritte sind:

1. Navigation fertigziehen
2. echte Detailansichten vervollstaendigen
3. Datenbasis stabilisieren
4. Suche und UI fuer reale Nutzung absichern
