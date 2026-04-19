# ResQBrain — Regulatory Boundary (MDR-Safe Mode)

## 1. Ziel dieser Datei

Diese Datei definiert die **verbindlichen regulatorischen Grenzen** für die Entwicklung von ResQBrain im MVP.

Ziel ist es:

* **keine Einstufung als Medizinprodukt** (nach MDR / ehemals MPG) zu erreichen
* eine klare Abgrenzung zu **Clinical Decision Support Systems** sicherzustellen
* alle Architektur-, Feature- und UI-Entscheidungen daran auszurichten

Diese Regeln sind **verbindlich** für:

* Architektur
* Features
* UI/UX
* Code-Generierung (Codex)
* Implementierung (Cursor)

---

## 2. Produktdefinition (verbindlich)

ResQBrain ist im MVP:

> Eine **digitale Wissens- und Nachschlageplattform** für den Rettungsdienst.

ResQBrain ist **NICHT**:

* kein Entscheidungsunterstützungssystem
* kein Diagnosetool
* kein Therapieempfehlungssystem
* kein Dosierungsrechner
* kein KI-Assistenzsystem für medizinische Entscheidungen

---

## 3. Grundprinzipien (Hard Rules)

### 3.1 Read-Only Knowledge System

Das System darf:

* Inhalte anzeigen
* Inhalte durchsuchen
* Inhalte filtern

Das System darf NICHT:

* Inhalte interpretieren
* Inhalte bewerten
* Inhalte priorisieren
* Inhalte kombinieren, um Entscheidungen abzuleiten

---

### 3.2 Keine Entscheidungslogik

Verboten sind Funktionen wie:

* suggestNextStep()
* recommendMedication()
* calculateDosage()
* evaluatePatientState()
* rankBestOption()

Jede Funktion, die eine **Handlungsempfehlung ableitet**, ist untersagt.

---

### 3.3 Keine patientenspezifische Verarbeitung

Das System darf:

* KEINE Patientendaten verarbeiten
* KEINE Eingaben zu Vitalwerten verwenden
* KEINE kontextabhängigen Berechnungen durchführen

---

## 4. Erlaubte Features (MVP)

### 4.1 Content

* Algorithmen (statisch)
* Medikamente (statisch)
* SOPs / Guidelines
* Organisationsspezifische Inhalte
* Versionierte Inhalte

---

### 4.2 Suche

Erlaubt:

* Volltextsuche
* Filter (Kategorie, Organisation, Tags)

Nicht erlaubt:

* medizinisch interpretierende Suche
* KI-basierte Entscheidungsfindung
* Ranking mit klinischer Bedeutung

---

### 4.3 Anzeige

* Detailseiten
* strukturierte Darstellung
* Tabs / Sections

---

### 4.4 Versionierung

* Version sichtbar
* Änderungsverlauf sichtbar
* Freigabestatus sichtbar

---

### 4.5 Offline

* Inhalte offline verfügbar
* KEINE zusätzliche Logik im Offline-Modus

---

## 5. Eingeschränkt erlaubte Features (Strict Mode)

Diese sind nur erlaubt unter strikten Bedingungen:

### 5.1 Algorithmen

Erlaubt:

* statische Darstellung

Verboten:

* Schritt-für-Schritt Navigation
* „Weiter“-Buttons
* geführte Entscheidungsbäume

---

### 5.2 Medikamente

Erlaubt:

* Referenzdosierungen (aus Quelle)

Verboten:

* patientenspezifische Dosierung
* automatische Berechnung

---

## 6. Verbotene Features (Blocker)

Die folgenden Features sind im MVP strikt untersagt:

* „Nächster Schritt“
* Entscheidungsbäume mit Navigation
* KI-Empfehlungen
* automatische Priorisierung
* Dosierungsrechner
* Risikoabschätzung
* Kombination mehrerer Daten zur Ableitung
* klinische Entscheidungsunterstützung jeglicher Art

Ein Verstoß gegen diese Regeln blockiert den Merge.

---

## 7. UI/UX Regeln

### 7.1 Neutralität

UI darf:

* keine Handlung suggerieren
* keine Priorisierung darstellen
* keine Empfehlungen visualisieren

---

### 7.2 Verbotene UI-Patterns

* Hervorhebung einzelner Maßnahmen als „wichtig“
* Farb-Codierung mit medizinischer Bedeutung
* Call-to-Actions wie:

  * „Jetzt durchführen“
  * „Empfohlen“
  * „Nächster Schritt“

---

### 7.3 Erlaubte Darstellung

* gleichwertige Anzeige aller Inhalte
* klare Struktur ohne Gewichtung
* Fokus auf Lesbarkeit

---

## 8. Content-Verantwortung

### 8.1 Verantwortlichkeit

* Inhalte stammen von Organisationen
* Organisationen sind verantwortlich für Inhalte
* ResQBrain ist Plattform, nicht Autor

---

### 8.2 Pflicht-Metadaten

Jeder Inhalt muss enthalten:

* Organisation
* Version
* Freigabestatus
* Datum
* Quelle

---

## 9. Technische Guardrails

### 9.1 Code Restrictions

Nicht erlaubt:

```ts
function suggestNextStep() {}
function calculateDosage() {}
function recommendTreatment() {}
```

Erlaubt:

```ts
function getMedicationById(id: string) {}
function searchContent(query: string) {}
```

---

### 9.2 Architektur-Regel

Der folgende Layer darf NICHT existieren im MVP:

* Decision Layer
* Clinical Logic Layer
* AI Recommendation Layer

---

### 9.3 Feature-Gating (für Zukunft)

Zukünftige Features müssen hinter einem expliziten Gate liegen:

```ts
enum SystemMode {
  KNOWLEDGE_ONLY,
  DECISION_SUPPORT // nicht aktiv im MVP
}
```

---

## 10. Rechtliche Hinweise (Pflicht)

Die App muss enthalten:

* „Nur zur Information“
* „Keine Entscheidungsunterstützung“
* „Verantwortung liegt beim Anwender“

---

## 11. Review-Regel (verbindlich)

Jeder neue Feature-PR muss geprüft werden auf:

* enthält es Entscheidungslogik?
* enthält es Interpretation?
* enthält es Priorisierung?

Wenn JA → PR ablehnen

---

## 12. Zielzustand

Solange diese Regeln eingehalten werden:

* keine MDR/MPG Einstufung erforderlich
* schnelle MVP-Iteration möglich
* saubere Grundlage für spätere Erweiterung

---

## 13. Zukünftiger Entscheidungspunkt

Wenn folgende Features geplant werden:

* KI-Unterstützung
* Entscheidungslogik
* patientenspezifische Verarbeitung

→ neue Datei erforderlich:

`docs/regulatory/mrd-transition.md`

→ inklusive:

* Risikoklassifizierung
* CE-Strategie
* Qualitätsmanagement

---

## 14. Verbindlichkeit

Diese Datei ist:

* Teil der Architektur
* bindend für alle Agenten
* bindend für alle Entwickler
* bindend für alle zukünftigen Features

Verstöße führen zu:

* Architekturbruch
* regulatorischem Risiko
* Blockierung der Umsetzung
