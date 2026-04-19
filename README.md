# ResQBrain

ResQBrain ist ein **Lookup-first Tool für den Rettungsdienst**, das schnellen Zugriff auf Medikamente und Algorithmen ermöglicht — offlinefähig und auf den Einsatz ausgerichtet.

---

## Ziel

Im Einsatz zählt Zeit.

Aktuell sind wichtige Informationen oft:
- verteilt auf mehrere Quellen
- schwer durchsuchbar
- nicht offline verfügbar

**ResQBrain bündelt diese Inhalte in einer schnellen, klaren und mobilen Oberfläche.**

---

## Aktueller Stand (MVP)

ResQBrain befindet sich in **Phase 0 (Lookup-first MVP)**.

Der Fokus liegt bewusst auf:
> **schneller Zugriff statt komplexer Plattform**

---

## Was aktuell funktioniert

### Mobile App (Expo)

- 📋 Medikamentenliste + Detailansicht  
- 🧠 Algorithmenliste + Detailansicht  
- 🔍 Lokale Suche (inkl. Ranking & Filter)  
- ⭐ Favoriten (persistiert)  
- 🕓 Verlauf (letzte Einträge, persistiert)  
- 🧮 Dosisrechner (basierend auf Freitext, nur Orientierung)  
- ❤️ Vitalwerte-Referenz (statisch)  
- 🏠 Start/Home mit Schnellzugriff  

### Daten

- 📦 Eingebettetes JSON-Bundle (offline verfügbar)  
- 💾 Optionaler Cache über AsyncStorage  
- 🌐 Optionaler Hintergrund-Check für Updates (eine Bundle-URL)

---

## Was bewusst NICHT enthalten ist

Diese Dinge sind **nicht Teil des aktuellen MVP**:

- ❌ Kein Backend / kein Sync-System  
- ❌ Keine Benutzerkonten / Auth  
- ❌ Keine Multi-Tenant-Funktion im Produkt  
- ❌ Keine KI / Entscheidungsunterstützung  
- ❌ Keine klinische Validierung des Dosisrechners  

Der Fokus bleibt aktuell:
> **verlässliches Nachschlagen statt komplexer Features**

---

## Projektstruktur (Kurzüberblick)

```
apps/
  mobile-app/     → Expo App (MVP)
  website/        → Next.js Website (produktiv; App-Router unter app/; Landing-Inhalt lib/site/home-content.ts am Repo-Root)
packages/
  domain/         → Domain-Logik (Versioning, Governance, Release)
docs/
  context/        → Produktkontext
  architecture/   → technische Architektur
  status/         → aktueller Projektstatus
```

---

## Lokales Setup

### Voraussetzungen
- Node.js
- pnpm

### Installation

```bash
pnpm install
```

**Website (Build / Typen):**

```bash
pnpm build
pnpm --filter @resqbrain/website run typecheck
```

**Mobile App:**

```bash
pnpm --filter @resqbrain/mobile-app start
pnpm mobile:verify
```

### Projektstatus

- **Phase:** Phase 0 – Lookup-first MVP  
- **Stand:** April 2026  
- **Details:** [docs/status/PROJECT_STATUS.md](docs/status/PROJECT_STATUS.md), [docs/context/12-next-steps.md](docs/context/12-next-steps.md)

**Aktueller Fokus:** Stabilisierung der Domain-Tests, Vereinheitlichung der Bundle-Ladepfade, Verbesserung der Bundle-Verteilung (lokal → später Remote), Ausbau der Seed-Daten — Konsolidierung und Stabilität, keine neuen Feature-Sprünge außerhalb der Roadmap.

### Mitmachen / Feedback

Das Projekt wird mit Feedback aus dem Rettungsdienst weiterentwickelt. Ideen, Probleme und Content-Hinweise sind erwünscht.

**Hinweis:** ResQBrain ist ein Unterstützungs- und Nachschlage-Tool — keine medizinische Entscheidungssoftware, keine Therapieempfehlung; Dosisrechner nur als Orientierung.

---
