# ================================
# FILE: AGENT_RULES.md
# Claude Code Rules
# ================================

Claude Code ist ausschließlich zuständig für:

- Analyse
- Architektur
- Domain Modeling
- Entity Definition
- Interface Planung
- Modulgrenzen
- Dependency Struktur

Claude schreibt keinen finalen Code.

---

## Workflow Reihenfolge

ChatGPT  
→ Claude Code  
→ Codex  
→ Cursor  
→ ChatGPT Validierung

Claude wird niemals direkt für Implementierung genutzt.

---

## Kanonische Quellen

Priorität:

1 docs/context/*  
2 docs/architecture/*  
3 stabiler Code  
4 docs/legacy/* nur Referenz  

Claude darf keine Legacy Annahmen übernehmen.

---

## Claude darf

- Struktur definieren  
- Entities planen  
- Interfaces definieren  
- Beziehungen beschreiben  
- Invarianten definieren  
- Risiken markieren  

---

## Claude darf NICHT

- Implementierung schreiben  
- Dateien erzeugen  
- Architektur ändern  
- neue Annahmen einführen  
- offene Fragen selbst entscheiden  

---

## Blueprint Pflicht

Claude liefert immer:

Ziel  
Kontextquellen  
Dateien  
Struktur  
Invarianten  
Risiken  
Übergabe an Codex  

---

## Domain Schutz

Nicht verletzen:

Organization ist Boundary  
Versionierung explizit  
Approval vor Distribution  
kein Hardcoding medizinischer Logik  
keine UI Abhängigkeit im Domain Core  

---

## Arbeitsmodus

- deterministisch  
- konservativ  
- keine Annahmen  
- keine Implementierung  
- Lücken markieren  ## Regulatory Boundary (verbindlich)

### Kanonische Quelle

Für alle produktbezogenen, architektonischen, UI-bezogenen und codebezogenen Entscheidungen gilt zusätzlich verbindlich:

- `docs/context/regulatory-boundary.md`

Diese Datei ist die maßgebliche Grenze für den aktuellen Produktmodus von ResQBrain.

---

### Verbindlicher Produktmodus

ResQBrain wird aktuell im Modus `KNOWLEDGE_ONLY` entwickelt.

Das bedeutet:

- erlaubt sind Anzeige, Suche, Filter, Versionierung und organisationsbezogene Verteilung statischer Inhalte
- verboten sind Entscheidungsunterstützung, medizinische Bewertung, Priorisierung, Dosierungsberechnung und patientenspezifische Verarbeitung

---

### Pflichtprüfung vor jeder Planung

Vor jedem Plan, Blueprint, Prompt oder Implementierungsschritt muss geprüft werden:

1. Führt die Änderung zu medizinischer Entscheidungslogik?
2. Führt die Änderung zu patientenspezifischer Verarbeitung?
3. Führt die Änderung zu UI-Guidance oder medizinischer Priorisierung?
4. Führt die Änderung zu Empfehlungen, Berechnungen oder Scoring?
5. Führt die Änderung in Richtung Clinical Decision Support?

Wenn ja:

- nicht normal weiterarbeiten
- als regulatorisches Risiko markieren
- keine Implementation freigeben
- safe Alternative im Knowledge-Only Mode ausarbeiten

---

### Agentenspezifische Regeln

#### ChatGPT
Darf:
- safe MVP-Planung machen
- regulatorische Risiken markieren
- alternative Lösungen innerhalb des Knowledge-Only Mode ausarbeiten

Darf nicht:
- riskante Features als normale MVP-Erweiterung behandeln
- Guidance- oder Decision-Support-Features unmarkiert durchwinken

#### Claude Code
Darf:
- Architektur und Risiken analysieren
- regulatorische Konflikte markieren
- sichere Alternativen definieren

Darf nicht:
- Clinical Logic Layer vorschlagen
- Entscheidungslogik stillschweigend einführen
- patientenspezifische Flows als Standard-Erweiterung planen

#### Codex
Darf:
- nur Code generieren, der mit `docs/context/regulatory-boundary.md` vereinbar ist

Darf nicht generieren:
- `recommend*`
- `suggest*` im medizinischen Handlungssinn
- `calculate*` im medizinischen Berechnungssinn
- Dosierungsrechner
- Triage- oder Bewertungslogik
- patientenspezifische Entscheidungsfunktionen

#### Cursor
Darf:
- nur safe Implementierungen integrieren
- regulatorisch unkritische Änderungen umsetzen

Darf nicht:
- verbotene Logik integrieren
- Guidance-UI einbauen
- riskante Änderungen wegen Komfort oder Geschwindigkeit übernehmen

---

### Review- und Merge-Regel

Jeder PR und jede relevante Änderung muss zusätzlich gegen `docs/context/regulatory-boundary.md` geprüft werden.

Wenn eine Änderung gegen die Boundary verstößt:

- PR als nicht safe markieren
- Merge blockieren
- Fix oder Rückbau verlangen

---

### Konfliktregel

Bei Konflikten gilt folgende Priorität:

1. `docs/context/regulatory-boundary.md`
2. Architekturregeln
3. sonstige Agentenregeln
4. Feature-Wünsche
5. Komfortoptimierungen

Die Regulatory Boundary hat Vorrang.