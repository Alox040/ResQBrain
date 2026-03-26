# MVP Scope

**Stand:** 26. März 2026 — überarbeitet auf Basis Umfrageergebnisse

## Scope-Entscheidung

Der MVP-Fokus wurde auf Basis der Umfrage auf die vier meistgenannten Nutzerbedürfnisse reduziert.

**Leitfrage:** Was braucht eine Einsatzkraft im Einsatz, sofort, ohne Schulung?

---

## MVP — In Scope

### 1. Medikamentensuche
- Suche nach Medikament (Name, Wirkstoff, Handelsname)
- Anzeige: Dosierung, Kontraindikationen, Besonderheiten
- Gepruefte Inhalte aus einer Pilot-Wache (Seed-Daten)

### 2. Notfallalgorithmen
- Abruf von Einsatzalgorithmen (z. B. Polytrauma, Reanimation, Schlaganfall)
- Schritt-für-Schritt-Ansicht, geeignet für Zeitdruck
- Eine Pilot-Wache als feste Konfiguration (kein Organisationsmodell im MVP)

### 3. Offline-Nutzung
- Voller Zugriff auf Medikamente und Algorithmen ohne Mobilfunk oder WLAN
- Lokale Datenhaltung auf dem Gerät
- Synchronisation im Hintergrund, wenn Verbindung verfügbar

### 4. Schnelle Suche
- Suchergebnis in unter 3 Sekunden
- Keine Anmeldung im Einsatz erforderlich
- Klare, lesbare Darstellung unter Zeitdruck

## MVP Exit-Kriterien

- Eine Einsatzkraft findet die gesuchte Medikamentendosierung in unter 3 Klicks
- Ein Algorithmus ist vollständig offline abrufbar
- Die Inhalte stammen aus einer geprueften Seed-Quelle (Pilot-Wache)
- Die App ist ohne Einweisung nutzbar

---

## Post MVP — Explizit zurückgestellt

| Bereich | Begründung |
|---------|-----------|
| Content Lifecycle (Draft → Approved → Released) | Governance-Infra, nicht Einsatz-Nutzen |
| Approval Engine / Freigabeprozesse | Admin-Workflow, kein MVP-Blocker |
| Release Engine / Versioning | Infrastruktur, wird nach MVP ergänzt |
| Multi-Tenant / Organization Model | Komplexität, eine Wache reicht für MVP |
| Rollen- und Rechtemodell | Erst relevant bei Mehrbenutzerbetrieb |
| Audit Logging | Compliance, Post-MVP |
| Survey Engine / SurveyInsight | Datenauswertung, Post-MVP |
| Editor UI (Algorithm, Medication) | Content wird initial als Seed-Daten importiert |
| API / Auth / Deployment-Infra | Folgt nach validiertem MVP |
| Region / County Scoping | Org-Modell folgt Post-MVP |
| ContentPackage / Release-Bundles | Distribution erst nach Content-Basis |
| Cross-Organization Sharing | Scale-Phase |
