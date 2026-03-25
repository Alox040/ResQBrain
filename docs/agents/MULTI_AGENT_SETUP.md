# Multi Agent Setup — ResQBrain

Diese Datei definiert die verbindliche Arbeitsweise für alle Agenten.

Diese Regeln gelten für:

ChatGPT  
Claude Code  
Codex  
Cursor  

---

# Rollen

## ChatGPT — Orchestrator

Verantwortlich für:

Planung  
Roadmap  
Schrittdefinition  
Agent Auswahl  
Prompt Erstellung  
Workflow Steuerung  
Validierung  

ChatGPT erzeugt:

Plan  
Prompt Vorlagen  
Workflow Schritte  
Agent Zuweisung  

ChatGPT erzeugt keinen Produktionscode.

---

## Claude Code — Architektur & Analyse

Claude ist verantwortlich für:

Domain Modell  
Architektur Planung  
Entities  
System Design  
Lifecycle Regeln  
Governance Regeln  
Tenant Modell  

Claude erzeugt:

Blueprints  
Struktur  
Dateipläne  
Interfaces  
Abhängigkeiten  

Claude erzeugt keinen finalen Code.

---

## Codex — Code Generierung

Codex generiert:

Entities  
Interfaces  
Services  
DTOs  
Types  
Validation  

Codex erhält:

Claude Blueprint  
Zieldatei  
Regeln  

Codex erzeugt:

vollständige Datei  
deterministisch  
ohne Architekturänderung  

---

## Cursor — Integration

Cursor ist verantwortlich für:

Dateien anlegen  
Code einfügen  
Imports korrigieren  
Refactoring nach Plan  
Integration  

Cursor darf nicht:

Architektur ändern  
Logik ändern  
Struktur erfinden  

---

# Reihenfolge

IMMER:

ChatGPT  
→ Claude  
→ Codex  
→ Cursor  
→ ChatGPT Validierung

NIEMALS:

Codex ohne Claude  
Cursor ohne Codex  
Claude ohne Planung  

---

# Dokument Hierarchie

Single Source of Truth:

docs/context/*
docs/roadmap/*
docs/planning/*
docs/agents/*

Legacy Dateien sind nicht bindend.

---

# Architektur Regeln

Domain First  
Multi Tenant  
Versioned Content  
Approval vor Release  
Survey beeinflusst nur Priorisierung  
Keine UI Abhängigkeiten  

---

# Workflow Beispiel

Schritt 1  
ChatGPT erstellt Plan

Schritt 2  
Claude erstellt Architektur

Schritt 3  
Codex generiert Datei

Schritt 4  
Cursor integriert

Schritt 5  
ChatGPT validiert

---

# Ziel

Deterministische Entwicklung  
Keine Architektur Drift  
Saubere Verantwortlichkeiten  
Reproduzierbare Builds