# Mobile Screen Refactor — Log (ZIP-Komponenten + UX)

**Datum:** 2026-03-31  
**Scope:** `apps/mobile-app/src/screens/*`  
**Unverändert:** Navigation (`AppNavigator`), Lookup-/Content-Modell (`contentIndex`, Typen, Suchlogik), Website und Domain-Packages.

---

## Ziele

- Informationshierarchie und Lesbarkeit (Notfall-/Einsatzkontext)
- Einheitliche Abstände, Karten, Badges; bessere Such-UX
- Größere Touch-Ziele und klare Aktionszeilen (Chevrons, Press-States)
- Konsistenter Einsatz der übernommenen UI-Bausteine (`ScreenContainer`, `InputText`, `Tag`, `Badge`, `EmptyState`, `Label`) und `@/theme`

---

## Änderungen je Screen

### 1. HomeScreen

- **`ScreenContainer`** für Safe Area + horizontales Layout wie die übrigen Screens.
- **Schnellzugriff:** Drei Kachel-Zeilen (min. ~88 pt Höhe) mit **Ionicons**, Kurzbeschreibung und **Chevron** statt Vollflächen-Farbbuttons — ruhiger, medizinischer, weniger „Marketing-Gradient“.
- Fußbereich: zwei **Info-Karten** mit Icon + Text statt abstrakter „24/7“-Zahlen.
- Texte: korrekte **Umlaute** (Oberfläche, Präparate, Abläufe, häufige).
- **`Label`** für den Abschnittstitel „Schnellzugriff“.

### 2. SearchScreen

- **`ScreenContainer`**; kurzer **Lead-Text** zur Funktion der Suche (lokales Bundle).
- **`InputText`** mit **Such-Icon** als Prefix; abgerundetes Feld, größere Schrift.
- Filter: **`Tag`**-Komponenten (kompakteres Padding via `style`) statt manueller Chips — gleiche Semantik (`all` / `medication` / `algorithm`).
- Leer/-kein-Treffer: **`EmptyState`** mit verständlichen deutschen Texten.
- Trefferliste: Karten mit **`Badge`** (Medikament vs. Algorithmus), Titel, Indikation, **Chevron**; Press-Hintergrund wie in den Listen.

### 3. MedicationListScreen

- **`ScreenContainer`**; **Listenkopf** mit erklärendem Satz (Typo `sectionTitle` + Fließtext).
- Zeilen: **horizontales Layout** (Inhalt + **Chevron**), `minHeight` ~96, mehr Zeilenabstand für Indikation.
- Tag-Badges: etwas **größere Tap-fläche** (Padding), abgerundet 8 px.
- Leer: **`EmptyState`** in Region mit `flexGrow: 1` für vertikale Balance.

### 4. MedicationDetailScreen

- **`ScreenContainer`** + Scroll; **Abschnittshinweise** unter Überschriften wo sinnvoll (Querverweise).
- Dosierung: **Warn-Icon** neben „Anwendung & Dosis“ für schnelle visuelle Priorität.
- Verwandte Algorithmen: Zeilen **min. 52 pt** hoch, **Chevron** statt Text-Chevron; gleiche Press-Farbe wie Listen.
- Nicht gefunden: **`EmptyState`** zentriert in `notFound`-Region.

### 5. AlgorithmListScreen

- Analog **MedicationListScreen**: Header-Text, Chevron-Zeilen, EmptyState, `flexGrow` bei leerer Liste.

### 6. AlgorithmDetailScreen

- Warnkarte: **Icon + Titel** in einer Zeile; etwas größere Fließtexte.
- Schritte: größere **Nummern-Badges** (36 px), mehr Abstand zwischen Schritten; Hinweiszeile zur Reihenfolge.
- Verwandte Medikamente: wie Medikament-Detail — Chevrons, Mindesthöhe, Hinweistext.
- Nicht gefunden: **`EmptyState`**.

---

## Technische Notizen

- Imports nutzen durchgehend **`@/theme`** (entspricht dem früheren `@/ui/theme`-Export).
- Keine neuen Produktbereiche; Navigation und `handlePressResult` / Cross-Ref-Logik unverändert absichtlich.
- Optional später: Tab-/Stack-Header mit `ScreenHeader` innerhalb von Screens, die keinen nativen Stack-Header nutzen — aktuell nicht nötig.

---

## Kurzüberblick

| Screen            | Haupt-UI-Anpassung                                      |
|------------------|---------------------------------------------------------|
| Home             | Kachel-Layout, Icons, ScreenContainer, Label          |
| Search           | InputText, Tag, Badge, EmptyState, Ergebnis-Karten      |
| Medikamente Liste| Header, Chevron-Zeilen, EmptyState, größere Karten      |
| Medikament Detail| Dosierungs-Hinweis-Icon, Querverweise, EmptyState       |
| Algorithmen Liste| wie Medikamente-Liste                                   |
| Algorithmus Detail | Warn-Icon, Schritt-Badges, Querverweise, EmptyState   |
