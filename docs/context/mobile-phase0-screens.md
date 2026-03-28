# Phase-0 Mobile Screens

**Stand:** 28. März 2026  
**Gültigkeit:** Lookup-first MVP (Phase 0)  
**Datengrundlage:** `apps/mobile-app/src/types/content.ts`, `docs/context/lookup-data-shape.md`, `docs/context/content-seed-plan.md`  
**Architektur:** `docs/architecture/lookup-first-architecture.md` (lokale Lesepfade, keine Server-Suche auf diesen Screens)

Dieses Dokument beschreibt die **fachliche Screen-Spezifikation** für Medikamenten- und Algorithmus-Listen und -Details. Es ist bewusst schmaler als das Plattform-Domain-Modell (`@resqbrain/domain`).

**Für alle vier Screens:** Daten nur aus lokalem Bundle / Store (Zielbild: kein Netz für die Anzeige); sichtbare Felder aus `Medication` bzw. `Algorithm`; `searchTerms` und `id` nicht als Fließtext; keine Dosierungsberechnung, keine Verzweigungslogik, keine Lernfunktionen, keine Rollen/Freigaben/Versionierung in der UI, keine KI; hoher Kontrast, große Lesetexte, wenig visuelle Komplexität.

---

## 1. MedicationListScreen

### Ziel

Schnell das richtige Medikament finden und zur Detailansicht springen — unter Zeitdruck, ggf. mit eingeschränkter Aufmerksamkeit.

### Sichtbare Informationen

Pro Zeile mindestens:

- **Primärtag** aus `tags` (für Farbe/Gruppierung; kontrolliertes Vokabular `ContentTag`)
- **`label`** (Hauptzeile)
- **`indication`** (Unterzeile, gekürzt mit Ellipse wenn nötig)

Nicht sichtbar in der Liste: `dosage`, `notes`, `searchTerms`, `relatedAlgorithmIds`, `id` (außer intern für Navigation).

### Such- / Listenverhalten

- **Standard:** vollständige Liste aller Medikamente aus dem lokalen Store, stabil sortiert (z. B. alphabetisch nach `label`; Sortierung fest in der App, nicht nutzerkonfigurierbar in Phase 0).
- **Filter (optional Phase 0):** nach `tags` einschränken — nur wenn Umsetzung trivial bleibt; sonst nur globale Suche über den separaten Search-Tab gemäß Architektur.
- **Leere Liste:** klare, ruhige Leer-Meldung (kein Fehler-Ton).

*Hinweis:* Volltextsuche über Medikamente erfolgt im **SearchService** / Such-Screen, nicht zwingend inline in dieser Liste (`lookup-data-shape.md`: Index-Felder inkl. `label`, `indication`, `searchTerms`, optional `dosage`).

### Priorität der Inhalte

1. `label` — größte Typografie, höchster Kontrast  
2. `indication` — Kontext „wofür“  
3. Tag-Badge — Orientierung, nicht dominant über `label`

### Bewusst ausgeschlossene Inhalte

- Dosierung, Kontraindikationen, Freitext-Notizen (nur Detail)
- Freigabestatus, Versionsnummer, Bearbeiter, Organisationswahl
- Favoriten, Historie, Quiz, Rechner
- `searchTerms` als sichtbare Liste (nur Suchhilfe)

### Navigation

- **Eingehend:** Tab „Medikamente“ / Stack-Root des Medikamenten-Stacks.
- **Ausgehend:** Tap auf Zeile → `MedicationDetailScreen` mit Parameter `medicationId` (= `id`).
- **Zurück:** Standard-Stack-Back.

### UX-Hinweise für Einsatznutzung

- Zeilen groß genug für Treffer mit Handschuhen; klares Press-Feedback.
- Keine verschachtelten Menüs; eine Aktion pro Zeile.
- Wenn nur ein Tag in der Zeile gezeigt wird und mehrere existieren: konsistent **ersten** Tag nutzen oder kompakte Multi-Badge-Variante — wichtig ist Vorhersagbarkeit.

---

## 2. MedicationDetailScreen

### Ziel

Alle **für die Einsatzentscheidung relevanten statischen Medikamenteninformationen** in klarer Reihenfolge lesen — ohne Rechner, ohne externe Pflicht.

### Sichtbare Informationen

Aus `Medication` / Basisfeldern:

- **`label`** (Kopfzeile / Navigationstitel)
- **`indication`**
- **`dosage`** (vollständiger Freitext, mehrzeilig)
- **`notes`** — nur wenn vorhanden; sonst Abschnitt auslassen oder eindeutigen Kurzhinweis „Keine Zusatznotizen“
- **Verknüpfte Algorithmen:** für jedes `relatedAlgorithmIds[]` ein tappbarer Eintrag (Ziel: `AlgorithmDetailScreen` mit `algorithmId`), nur wenn ID im Bundle existiert; fehlende IDs nicht als leere Buttons zeigen

Optional später aus erweitertem Seed (`lookup-data-shape.md`, noch nicht in `content.ts`):

- `genericName`, `contraindications`, `specialConsiderations` — eigene Abschnitte, sobald Typ und Loader sie liefern; bis dahin in `dosage`/`notes` bündeln.

### Reihenfolge der Felder

1. **Kopf:** `label` (wiederholt im Body nur wenn nötig für Konsistenz; Navigationstitel = `label`)
2. **Indikation** (`indication`)
3. **Dosierung** (`dosage`) — zentraler klinischer Block
4. **Verknüpfte Algorithmen** (Querverweise)
5. **Notizen** (`notes`) — abschließender Klarstellungsblock

### Visuelle Priorität

- **Dosierung:** größte Lesetext-Stufe unterhalb des Titels oder gleichwertig mit Indikation, auf jeden Fall ohne „Kleingedrucktes“.
- **Indikation:** klar vom Fließtext der Dosierung getrennt (Überschrift oder Karte).
- **Querverweise:** als sekundäre, aber erkennbare Interaktion (Liste oder Chips).
- **Notizen:** dezenter als Dosierung, aber lesbar.

### Bewusst ausgeschlossene Inhalte

- Eingabefelder für Gewicht/Alter/Dosis, Tabellen mit automatischer Berechnung
- Bearbeiten, Kommentieren, Freigabe-Historie
- Anzeige von `searchTerms`, Roh-`id` (außer Debug-Builds)
- Download externer PDFs als Pflichtflow

### Navigation

- **Eingehend:** `MedicationListScreen` oder Querverweis aus `AlgorithmDetailScreen`.
- **Ausgehend:** zu Algorithmus-Detail bei Tap auf verknüpften Algorithmus.
- **Zurück:** zum vorherigen Screen.

### UX-Hinweise für Einsatznutzung

- Langer `dosage`-Text: scrollbarer Bereich, keine versteckten „Weiter“-Seiten innerhalb derselben Ansicht.
- Fehlender Datensatz: eindeutige Meldung „Medikament nicht gefunden“ ohne technischen Stacktrace.

---

## 3. AlgorithmListScreen

### Ziel

Schnell den passenden Algorithmus finden und die **lineare Schrittfolge** in der Detailansicht öffnen.

### Sichtbare Informationen

Analog zur Medikamentenliste:

- Tag-Badge aus `tags` (mindestens der primäre Tag)
- **`label`**
- **`indication`** (max. zwei Zeilen sinnvoll kürzen)

Nicht in der Liste: `steps`, `warnings`, `notes`, `relatedMedicationIds`, `searchTerms`, `id` (außer Navigation).

### Such- / Listenverhalten

- Vollständige sortierte Liste aus lokalem Store.
- Optional Tag-Filter wie bei Medikamenten — gleiche Sparsamkeitsregel.
- Leere Liste: sachliche Leer-Meldung.

Suche über alle Inhalte: separater Such-Entry gemäß Architektur, nicht Voraussetzung für diese Liste.

### Priorität der Inhalte

1. `label`  
2. `indication`  
3. Tag-Badge

### Bewusst ausgeschlossene Inhalte

- Interaktive Entscheidungsbäume, „Wenn ja/nein“-Buttons mit Zustand
- Schritt-Vorschau in der Liste
- Versionierung, Freigabe, „Zuletzt geändert“

### Navigation

- **Eingehend:** Tab „Algorithmen“ / Stack-Root Algorithmus-Stack.
- **Ausgehend:** Tap → `AlgorithmDetailScreen` mit `algorithmId`.

### UX-Hinweise für Einsatznutzung

- Gleiche Interaktionsmuster wie Medikamentenliste (Lernkurve: einmal verstanden, überall gleich).
- Algorithmusnamen nicht kürzen, wenn dadurch Verwechslungsgefahr entsteht — Kürzung nur für `indication`-Unterzeile.

---

## 4. AlgorithmDetailScreen

### Ziel

Den Ablauf **in fester Reihenfolge** abarbeiten können — reine Leseführung, keine Verzweigungslogik in der App.

### Sichtbare Informationen

- **`label`** (Navigationstitel)
- **`indication`**
- **`warnings`** — wenn gesetzt: **prominent** vor oder unmittelbar über der Schrittliste (Sicherheit vor Chronologie)
- **`steps[]`:** jeder Eintrag als nummerierter Schritt (`1.`, `2.`, …), nur `step.text` anzeigen
- **`notes`** — wenn gesetzt; unterhalb der Schritte oder nach Warnblock, konsistent zur Medikamenten-Detaillogik
- **Verknüpfte Medikamente:** `relatedMedicationIds[]` als tappbare Liste → `MedicationDetailScreen`

**Quellen / Literatur:** nicht in `content.ts` definiert. Phase 0: **optional**; wenn gezeigt, dann aus **Bundle-Metadaten oder Seed-Erweiterung**, nicht aus fest im Screen verdrahteten Maps — sonst lieber weglassen bis Datenmodell nachzieht (Scope-Leak vermeiden).

### Reihenfolge der Felder

1. `label` (Titel)  
2. `indication`  
3. `warnings` (falls vorhanden)  
4. **Schritte** (`steps` linear)  
5. `notes` (falls vorhanden)  
6. Verknüpfte Medikamente  
7. Quellen nur wenn redaktionell/modelliert vorhanden

### Visuelle Priorität

1. **Warnungen** — höchste Aufmerksamkeit (z. B. eigener Kontrast, kein Kleingedrucktes)  
2. **Schritte** — nummeriert, viel Weißraum, ein Schritt pro Karte empfohlen  
3. Indikation und Notizen — klar, aber nachrangig zu Warnung + Schritten

### Bewusst ausgeschlossene Inhalte

- Klickbare Verzweigungen, bedingte Ein-/Ausblendung von Schritten abhängig von Nutzereingaben
- Timer, Checklisten mit Pflicht-Abhaken, Fortschrittspersistenz (Lern-/Workflow-Features)
- eingebettete Rechner oder Medienplayer als Pflicht
- Freigabe-Workflow-UI, Versionsvergleich

### Navigation

- **Eingehend:** Liste oder Suche oder Querverweis vom Medikament.
- **Ausgehend:** zu Medikament-Detail über `relatedMedicationIds`.
- **Zurück:** vorheriger Screen.

### UX-Hinweise für Einsatznutzung

- Schritttexte kurz halten (redaktionelle Vorgabe: eine imperative Aussage pro Schritt, vgl. Kommentar in `content.ts`).
- Lange Algorithmen: Scroll erlaubt; keine Pagination, die Reihenfolge zerstört.
- Fehlender Datensatz: „Algorithmus nicht gefunden“.

---

## MVP-Checkliste (Phase 0)

- [ ] Vier Screens verhalten sich konsistent (Liste → Detail, gleiche Zeilenlogik).
- [ ] Alle Pflichtfelder aus `content.ts` werden sachgerecht dargestellt (`dosage`, `steps`, `related*Ids` als Navigationsziele).
- [ ] Keine UI für Berechnung, Verzweigung, Lernen, Rollen, Freigabe, Versionierung, KI.
- [ ] Listen nutzen `label` + `indication`; keine Anzeige von `searchTerms`.
- [ ] Algorithmus-Schritte strikt linear; Warnungen optisch hervorgehoben.
- [ ] Offline-tauglich: keine Abhängigkeit von Netzwerk für Anzeige der Inhalte (sobald Store gefüllt ist).
- [ ] Leer- und Fehlerzustände verständlich ohne Entwicklerjargon.

---

## Empfohlene Implementierungsreihenfolge

1. **Daten-Pipeline vereinheitlichen** — eine Quelle (Mock/JSON) befüllt `Medication` / `Algorithm` konsistent mit `lookup-data-shape.md`.
2. **MedicationListScreen / AlgorithmListScreen** — Zeilenlayout, Sortierung, Leerzustand.
3. **MedicationDetailScreen** — Dosierung → Querverweise → Notizen; optionale Felder nur wenn im Typ/Seed angekommen.
4. **AlgorithmDetailScreen** — Warnungen → Schritte → Notizen → Medikamenten-Querverweise; Quellen nur mit sauberem Datenmodell.
5. **Querverweise testen** — fehlende oder tote IDs graceful behandeln.
6. **Polish** — Typografie, Abstände, Barrierefreiheit (Schriftgröße, Kontrast), Einsatz-Szenario „schlechtes Licht“.

---

## Später sinnvoll am Haupt-PC (nicht Phase-0-Mobile-Fokus)

- **Redaktion und Pflege** der Seeds (JSON-Bundle, Validierung, Duplikat- und Referenzchecks).
- **Governance- und Versionierungs-UI** angebunden an `@resqbrain/domain` (Freigaben, Rollen, Audit).
- **Strukturierte Dosierungsregeln** und ggf. Rechner (Phase 1+), getrennt von statischem Freitext.
- **Verzweigte Algorithmen** mit explizitem Zustandsmodell (wenn fachlich gewünscht und nicht nur Fließtext).
- **ContentPackage / Release-Verteilung** und Multi-Tenant-Laufzeit.

---

## Verweise

- `docs/context/mvp-scope.md`  
- `docs/context/lookup-data-shape.md`  
- `docs/context/content-seed-plan.md`  
- `docs/architecture/lookup-first-architecture.md`  
- `apps/mobile-app/src/types/content.ts`  
- `README.md` — Phase-0-Gesamtkontext  
- `docs/status/PROJECT_STATUS.md` — Implementierungsreife Website/Domain vs. Mobile
