# Roadmap (Export)

**Stand:** 12. April 2026 — extrahiert aus `docs/roadmap/PROJECT_ROADMAP.md`, `docs/context/12-next-steps.md`, `docs/context/04-mvp-scope.md`.

---

## Aktuelle Phase

- **Phase 0 — Lookup App:** Kernfunktionen (Architektur-Basis, Seed, Loader, Mobile-Screens, lokale Suche, eingebettetes Offline-Bundle, Favoriten/Verlauf) überwiegend **[x]**; offen **[ ]** u. a. Bundle separat auf Gerät / Sync.
- **Phase 1 — Einsatz Features:** Dosisrechner **[~]**; Vitalreferenz, Favoriten, Verlauf, View-Model-Adapter **[x]**; Push-Updates **[ ]**.

---

## Nächste Schritte (priorisiert laut `PROJECT_ROADMAP.md`)

1. Bundle-Persistenz / Ersetzung — Anbindung an `lookupSource` (`cached` / `updated` / `fallback`) ohne Embedded-Quelle zu brechen.  
2. Sync-Konzept (nach Bundle-Lieferung).  
3. Seed & Pilot — Daten und Bundle-Metadaten.  
4. Einsatz-UI iterativ; optional `expo-doctor`-Abweichungen.

**Zusätzlich `12-next-steps.md`:** Lookup-Bundle auf Gerät (über embedded hinaus), Sync/Push-Updates, Seed ausbauen, ESLint optional, expo-doctor-Hinweise.

---

## Offene TODOs / Lücken (explizit in Doku)

- **`PROJECT_ROADMAP.md`:** Domain-`test:content` / Graph-`createAlgorithm` an Entity-Modell angleichen — **offen**.
- **MVP `04-mvp-scope.md` — Post-MVP / zurückgestellt:** u. a. Content Lifecycle UI, Approval/Release-Pipelines für Produktivbetrieb, Multi-Tenant-Runtime, Auth, Survey-Produktivbetrieb, Editor-UI.

---

## Priorisierte Tasks (kurz, aus Kontextdateien)

1. Bundle-Layering + Persistenz (`lookupSource`).  
2. Sync-/Update-Konzept.  
3. Seed-Qualität und Pilot-Konfiguration.  
4. Domain-Testabgleich (`test:content` / Algorithm-Graph).

---

## MVP-Definition (Kern aus `04-mvp-scope.md`)

**In Scope:** Medikamentensuche mit Dosierung/Kontraindikationen; Notfallalgorithmen Schritt-für-Schritt; **Offline** mit lokaler Datenhaltung und Hintergrund-Sync (als Ziel beschrieben); schnelle Suche ohne Anmeldung im Einsatz.

**Exit-Kriterien (Auszug):** Dosierung in unter 3 Klicks; Algorithmus vollständig offline; geprüfte Seed-Quelle; ohne Einweisung nutzbar.

---

## Phase-1-Planung (aus Roadmap + Next Steps)

- Gewichtsbasierter Dosisrechner (Parser aus Freitext) — **teilweise**.  
- Vitalwerte-Referenz — **umgesetzt**.  
- Favoriten & Verlauf — **umgesetzt**.  
- Push-Updates bei Netz — **ausstehend**.
