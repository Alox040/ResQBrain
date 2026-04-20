1. Zweck

Diese Policy definiert verbindliche Regeln für Entwicklung, Design und Inhalt von ResQBrain.

Ziel ist es:

keine Einstufung als Medizinprodukt (MDR/MPG) zu riskieren
klare Grenzen für Features zu setzen
konsistente Produktentscheidungen sicherzustellen
2. Grundprinzipien
2.1 Keine klinische Entscheidungsunterstützung

ResQBrain darf keine Funktion enthalten, die:

Diagnosen unterstützt
Therapieentscheidungen beeinflusst
Maßnahmen priorisiert oder empfiehlt
2.2 Nutzungskontext

Die App ist ausschließlich:

Gedächtnisstütze
Wissensdatenbank
Lern- und Reflexionssystem (nach Einsätzen)

Nicht erlaubt:

Nutzung als Entscheidungswerkzeug im Einsatz
2.3 Verantwortung
Entscheidungen liegen immer beim Nutzer
Die App liefert keine Handlungsempfehlungen
3. Erlaubte Features
3.1 Lookup (Referenzsystem)

Erlaubt:

Medikamenteninformationen
Leitlinien (statisch)
Algorithmen (statisch, z. B. als Darstellung oder PDF)

Voraussetzungen:

Quellenangabe verpflichtend
keine Hervorhebung „beste Option“
3.2 Lernsystem

Erlaubt:

Quiz
Flashcards
Spaced Repetition
Fallbeispiele (anonymisiert)
3.3 Nachbereitung (After-Action Review)

Erlaubt:

Freitext-Dokumentation
strukturierte Reflexion:
„Was lief gut?“
„Was war schwierig?“

Wichtig:

keine automatische Auswertung
keine Verbesserungsvorschläge
3.4 Content von Drittanbietern

Erlaubt:

Veröffentlichung von Inhalten durch:
Organisationen
Fachgesellschaften
verifizierte Anbieter

Voraussetzungen:

Inhalte sind statisch
klare Kennzeichnung:
Autor
Quelle
Version
keine algorithmische Verarbeitung durch die App
4. Verbotene Features
4.1 Entscheidungslogik

Nicht erlaubt:

„Wenn X → dann Y“-Systeme
Entscheidungsbäume mit Empfehlung
Priorisierung von Maßnahmen
4.2 Kontextbasierte Auswertung

Nicht erlaubt:

Eingabe von Patientendaten + Auswertung
Interpretation von Vitalparametern
automatische Vorschläge basierend auf Eingaben
4.3 Automatische Analyse

Nicht erlaubt:

Bewertung von Einsätzen durch die App
Fehleranalyse
„Optimale Maßnahme wäre gewesen…“
4.4 Simulation mit Entscheidungscharakter

Nicht erlaubt:

realitätsnahe Simulationen mit „richtigen Antworten“
Szenarien, die klinische Entscheidungen trainieren mit Bewertung
5. UX-/UI-Regeln
5.1 Wording

Verboten:

„empfohlen“
„beste Option“
„richtige Maßnahme“

Erlaubt:

„Leitlinie anzeigen“
„Information“
„Referenz“
5.2 Darstellung
keine Hervorhebung einzelner Maßnahmen als überlegen
neutrale Darstellung aller Inhalte
5.3 Trennung der Module

Strikte Trennung:

Lookup (Wissen)
Learning (Training)
Reflection (Nachbereitung)

Keine automatische Verknüpfung mit Bewertung

6. Rechtliche Hinweise (Pflicht)

Müssen in App und Website vorhanden sein:

„Diese Anwendung dient ausschließlich als Lern- und Informationshilfe.“
„Sie ersetzt keine medizinische Ausbildung oder Entscheidung.“
„Nicht zur Anwendung in akuten Behandlungssituationen bestimmt.“
7. Architektur-Regeln
7.1 Keine intelligente Verarbeitung

Verboten:

Algorithmen, die Inhalte bewerten
Logik, die Entscheidungen beeinflusst
7.2 Datenverarbeitung
keine patientenbezogenen Daten
keine Echtzeitverarbeitung von Einsatzdaten
8. Review-Prozess (verpflichtend)

Jedes neue Feature muss vor Umsetzung geprüft werden:

Checkliste:
Enthält es Entscheidungslogik? → ❌ Ablehnen
Nutzt es Patientendaten? → ❌ Ablehnen
Gibt es Empfehlungen? → ❌ Ablehnen
Ist es rein informativ oder edukativ? → ✅ Erlaubt
9. Verantwortlichkeit
Diese Policy ist verbindlich für alle Entwickler
Verstöße führen zur Ablehnung von Features
✅ Optional (empfohlen im Repo ergänzen)
Ergänzende Dateien:
docs/policies/content-guidelines.md
docs/policies/ux-writing-rules.md
docs/policies/feature-review-checklist.md