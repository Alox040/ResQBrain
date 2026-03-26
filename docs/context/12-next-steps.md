# Next Steps

**Stand:** 26. März 2026 — neu priorisiert nach Umfrage

## MVP-Fokus

Umfrage-Ergebnis: Einsatzkräfte brauchen Medikamentensuche, Algorithmen, Offline-Zugriff und schnelle Suche — keine Governance-Plattform.

Der MVP ist damit ein **Einsatz-Tool**, nicht eine Content-Management-Plattform.

---

## Sofortige Prioritäten (MVP)

### 1. Seed-Daten aufbereiten
Medikamentenliste und Algorithmen als statische, versionierte Seed-Daten bereitstellen.
- Bestehende Seed-Daten aus `data/schemas/` prüfen und bereinigen
- Deduplizierung und Textqualität sicherstellen
- Format definieren: was braucht die App zur Laufzeit?

### 2. Offline-Datenhaltung definieren
Entscheiden wie Inhalte auf dem Gerät gespeichert und geladen werden.
- Lokal-erste Architektur (offline by default)
- Synchronisationsstrategie bei Verbindung

### 3. Suchfunktion implementieren
Schnelle, lokale Suche über Medikamente und Algorithmen.
- Keine Server-Abhängigkeit im Einsatz
- Treffsicherheit und Ladezeit < 3 Sekunden

### 4. Einsatz-UI bauen (Mobile App)
Erste Ansichten für Medikamentendetail und Algorithmus-Schritt-Ansicht.
- Optimiert für Zeitdruck, Handschuhe, schlechte Lichtverhältnisse
- Minimalnavigation

### 5. Eine Organisation, ein Stand
Für den MVP reicht eine fest konfigurierte Organisation (Seed-Daten einer Wache).
- Kein Login, kein Rollen-Modell im MVP
- Inhalte für die Pilot-Wache fest eingebaut

---

## Zurückgestellt (Post MVP)

- Content Lifecycle, Approval, Release Engine
- Multi-Tenant / Organization Model
- Rollen- und Rechtemodell
- Audit Logging
- Survey Engine und SurveyInsight
- Editor UI für Algorithmen und Medikamente
- API, Auth, produktive Deployment-Infra
- Region/County Scoping
- ContentPackage und Release-Bundles
- Cross-Organization Features
