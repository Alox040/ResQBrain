# ResQBrain

ResQBrain ist ein **Lookup-first Tool fuer den Rettungsdienst**, das schnellen Zugriff auf Medikamente und Algorithmen ermoeglicht - offlinefaehig und auf den Einsatz ausgerichtet.

---

## Ziel

Im Einsatz zaehlt Zeit.

Aktuell sind wichtige Informationen oft:
- verteilt auf mehrere Quellen
- schwer durchsuchbar
- nicht offline verfuegbar

**ResQBrain buendelt diese Inhalte in einer schnellen, klaren und mobilen Oberflaeche.**

---

## Aktueller Stand (MVP)

ResQBrain befindet sich in **Phase 0 (Lookup-first MVP)**.

Der Fokus liegt bewusst auf:
> **schneller Zugriff statt komplexer Plattform**

---

## Was aktuell funktioniert

### Mobile App (Expo)

- Medikamentenliste + Detailansicht
- Algorithmenliste + Detailansicht
- Lokale Suche (mit Filter, ohne Ranking-System)
- Favoriten (persistiert; im Home/Detail integriert)
- Verlauf (letzte Eintraege, persistiert; eigener Screen im Home-Stack)
- Vitalwerte-Referenz (statisch)
- Start/Home mit Schnellzugriff
- Einstellungen / Bundle-Debug-Infos

### Daten

- Eingebettetes JSON-Bundle (offline verfuegbar)
- Optionaler Cache ueber AsyncStorage
- Optionaler Hintergrund-Check fuer Updates (eine Bundle-URL)

---

## Was bewusst NICHT enthalten ist

Diese Dinge sind **nicht Teil des aktuellen MVP**:

- Kein Backend / kein Sync-System
- Keine Benutzerkonten / Auth
- Keine Multi-Tenant-Funktion im Produkt
- Keine KI / Entscheidungsunterstuetzung
- Keine klinische Validierung des Dosisrechners

Der Fokus bleibt aktuell:
> **verlaessliches Nachschlagen statt komplexer Features**

---

## Projektstruktur (Kurzueberblick)

```text
apps/
  mobile-app/     -> Expo App (MVP)
  website/        -> Next.js Website (produktiv; App-Router unter app/; Landing-Inhalt lib/site/home-content.ts am Repo-Root)
  api-local/      -> lokaler Lookup-Server / Smoke-Pfad
packages/
  domain/         -> Domain-Logik (Versioning, Governance, Release)
  application/    -> Application-Services / Ports
  api/            -> API-Adapter und Contracts
docs/
  context/        -> Produktkontext
  architecture/   -> technische Architektur
  status/         -> aktueller Projektstatus
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

- **Phase:** Phase 0 - Lookup-first MVP
- **Stand:** April 2026
- **Details:** [docs/status/PROJECT_STATUS.md](docs/status/PROJECT_STATUS.md), [docs/context/12-next-steps.md](docs/context/12-next-steps.md)

**Aktueller Fokus:** Stabilisierung der Domain-Tests, Vereinheitlichung der Bundle-Ladepfade, Verbesserung der Bundle-Verteilung (lokal -> spaeter Remote), Ausbau der Seed-Daten - Konsolidierung und Stabilitaet, keine neuen Feature-Spruenge ausserhalb der Roadmap.

### Mitmachen / Feedback

Das Projekt wird mit Feedback aus dem Rettungsdienst weiterentwickelt. Ideen, Probleme und Content-Hinweise sind erwuenscht.

**Hinweis:** ResQBrain ist ein Unterstuetzungs- und Nachschlage-Tool - keine medizinische Entscheidungssoftware, keine Therapieempfehlung; Dosisrechner nur als Orientierung.

---
