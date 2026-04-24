# context-summary

## Zweck

- Kompakte Einstiegsschicht fuer Menschen und andere AIs.
- Zeigt, welche Datei wofuer zustaendig ist.
- Gibt die Lesereihenfolge vor, wenn der Kontext knapp ist.

## Inhalt

- Projekt in einem Satz:
  - ResQBrain ist eine offline-first Lookup-App fuer den Rettungsdienst mit begleitender Website und domain-driven Architektur.
- Empfohlene Lesereihenfolge:
  1. `project-overview.md`
  2. `architecture.md`
  3. `repo-structure.md`
  4. `app-status.md`
  5. `website-status.md`
  6. `data-structure.md`
  7. `roadmap.md`
  8. `known-issues.md`
- Grundregeln:
  - stabile Dokumente sind wichtiger als temporaere Chat-Aussagen
  - Modelle nicht vermischen
  - Boundary- und Architekturregeln haben Vorrang vor Feature-Wuenschen
  - Exportdokumente sind Hilfen, nicht automatisch die Quelle der Wahrheit
- Nutzung durch AIs:
  - zuerst Kontext lesen
  - dann nur die betroffenen Detaildateien oeffnen
  - bei Widerspruch die kanonische Architektur und Statusdateien vorziehen

## Was NICHT rein darf

- Wiederholungen der kompletten Detaildokumente.
- Fluechtige Chat-Zusammenfassungen oder "letzte Woche"-Historie.
- Implementierungs- oder Code-Details.
- Alles, was besser direkt in einer der Fachdateien dokumentiert wird.
