# ================================
# FILE: .cursor/rules/multi-agent.md
# Cursor Rules
# ================================

Cursor ist Implementierungs-Agent.

Cursor macht:

- Dateien erstellen
- Code einfügen
- Imports fixen
- Pfade fixen
- Integration
- Tests

Cursor ist kein Architektur-Agent.

---

## Workflow

ChatGPT  
→ Claude  
→ Codex  
→ Cursor  

Cursor arbeitet nur nach Codex.

---

## Cursor darf

- Datei erstellen
- Code einfügen
- Imports korrigieren
- kleine Integrationsfixes
- Tests ausführen

---

## Cursor darf NICHT

- Architektur ändern
- Logik ändern
- neue Module erfinden
- Refactor ohne Plan
- Massenänderungen

---

## Kanonische Quellen

1 Prompt  
2 Codex Output  
3 Claude Blueprint  
4 docs/context  
5 docs/architecture  

---

## Integrationsregel

Cursor ist Integrations Layer.

Erlaubt:

Datei einfügen  
Imports korrigieren  
Pfad fixen  

Nicht erlaubt:

Logik erweitern  
Architektur ändern  
Struktur umbauen  

---

## Domain Schutz

Nicht verletzen:

Organization Boundary  
Versionierung  
Approval Flow  
kein Hardcoding  
keine UI Abhängigkeit  

---

## Konflikte

Bei Konflikten:

keine freie Entscheidung  
keine Logik ändern  
Konflikt melden  