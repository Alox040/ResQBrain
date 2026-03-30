# Mobile Home — Content-Tuning (Lookup-first MVP)

**Datum:** 2026-03-31  
**Datei:** `apps/mobile-app/src/screens/HomeScreen.tsx`  
**Ziel:** Startscreen transportiert die **tatsächliche** Rolle von ResQBrain Mobile klarer: **Lookup-first**, **Medikamente / Algorithmen / Suche**, **Einsatz und Nachbereitung**, **lokal mitgeliefertes Bundle** — ohne neue Features zu behaupten und ohne Website-Texte.

---

## Leitlinien (eingehalten)

- **Lookup-first:** eigener Hinweisblock („Lookup-first“) mit Empfehlung, unter Druck oft mit der **Suche** zu starten; Listen als Alternative, wenn der Bereich bekannt ist.
- **Drei Aktionen:** unveränderte Navigationsziele — **Suche**, **Medikamente**, **Algorithmen** — als „Drei Kurzwege“ mit Bezug zur Tab-Navigation.
- **Einsatz / Nachbereitung:** Hero und Karte „Nachbereitung“ beschreiben **dieselben Inhalte** zum Nachlesen und Querverweise prüfen — **ohne** zusätzliche Produktmodule oder Workflow-Software.
- **Lokales Bundle:** Karte mit **faktischen** Zählungen aus `medications.length` / `algorithms.length` (`contentIndex`); Fallback-Text, wenn beide Listen leer sind.
- **Keine neuen Bereiche:** expliziter Satz im Hero, dass **keine weiteren Produktbereiche** abgebildet werden (ehrliche MVP-Grenze).
- **Visuell:** Suche leicht **betont** (Rahmen, Pill „Zuerst“), damit die wichtigste Aktion schneller ins Auge fällt — rein UI, keine Logikänderung.

---

## Textliche Anpassungen (Kurzüberblick)

| Bereich | Vorher (Kern) | Nachher (Kern) |
|---------|---------------|----------------|
| Eyebrow | „ResQBrain“ | „ResQBrain · Lookup“ |
| Hero-Titel | Schneller Zugriff auf Notfallwissen | Notfallwissen der Organisation — griffbereit |
| Hero-Text | Allgemeine App-Beschreibung | Bundle auf dem Gerät, Einsatz vs. Nachbereitung, klare MVP-Grenze |
| Kurzwege-Überschrift | Schnellzugriff | Drei Kurzwege + Satz zur Tab-Parität |
| Kachel Suche | Protokolle/Begriffe | Stichwortsuche im **mitgelieferten** Bundle, konkrete Suchfelder |
| Kachel Medikamente | Standardpräparate | Dosierung, Hinweise, **Querverweise zu Algorithmen** (existiert) |
| Kachel Algorithmen | Häufige Notfälle | Schritte, Warnhinweise, **nach Organisation** |
| Info-Karten | Generisch UI/Touch | **Lokales Bundle** (Zahlen), **Nachbereitung** (Lesen, Querverweise) |

---

## Technik

- Import von `medications` und `algorithms` aus `@/data/contentIndex` **nur** für Anzeige der Stückzahlen — keine Änderung an Lookup, Seed oder Navigation.
- Navigation: unverändert `Search`, `MedicationList`, `AlgorithmList`.

---

## Verifikation

- `npx tsc --noEmit` in `apps/mobile-app`: **PASS**
