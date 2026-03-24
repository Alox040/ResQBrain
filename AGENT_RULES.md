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
- Lücken markieren  