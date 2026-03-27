# UI Model — Lookup App

**Stand:** 26. März 2026
**Scope:** Phase 0 — Lookup App (MVP)

---

## Leitprinzip

Jede Information in maximal **2 Taps** erreichbar.
Kein Dashboard. Kein Lernmodus. Keine Statistiken.

---

## Screens

```
HomeScreen
├── → SearchResultsScreen        (Suche)
├── → MedicationListScreen       (Medikamente)
│       └── → MedicationDetailScreen
└── → AlgorithmListScreen        (Algorithmen)
        └── → AlgorithmDetailScreen
                └── → MedicationDetailScreen  (aus Schritt heraus)
```

---

## Tap-Budget

| Ziel | Taps ab HomeScreen |
|------|-------------------|
| Medikament über Suche öffnen | 2 (Suchfeld → Ergebnis) |
| Medikament aus Liste öffnen | 2 (Medikamente → Eintrag) |
| Algorithmus aus Liste öffnen | 2 (Algorithmen → Eintrag) |
| Medikament aus Algorithmus-Schritt | 3 (Algorithmen → Algorithmus → Schritt-Link) |

Drei Taps sind nur zulässig wenn der Kontext es erfordert (Medikament aus Algorithmus heraus).

---

## HomeScreen

**Zweck:** Einstieg — Suche oder direkte Kategorie-Auswahl.

```
┌────────────────────────────────────┐
│                                    │
│   [ 🔍  Suchen... ]                │
│                                    │
│   ┌──────────────┐  ┌───────────┐  │
│   │  Medikamente │  │Algorithmen│  │
│   └──────────────┘  └───────────┘  │
│                                    │
│   Offline  ·  v1.4.2               │
└────────────────────────────────────┘
```

Elemente:
- **Suchfeld** — prominent, großer Touch-Target, bei App-Start fokussiert
- **Medikamente** — großer Button, führt zu MedicationListScreen
- **Algorithmen** — großer Button, führt zu AlgorithmListScreen
- **Statuszeile** — Offline-Indikator + aktive Bundle-Version (klein, unten)

Nicht vorhanden: Drawer-Navigation, Kontext-Menü, Avatar, Benachrichtigungen.

---

## SearchResultsScreen

**Zweck:** Einheitliche Ergebnisseite für Medikamente und Algorithmen.

```
┌────────────────────────────────────┐
│  ← [ 🔍  Adrenalin         ] ✕    │
│                                    │
│  Medikamente (2)                   │
│  ┌──────────────────────────────┐  │
│  │ Adrenalin                    │  │
│  │ Epinephrin · iv, im, io      │  │
│  └──────────────────────────────┘  │
│  ┌──────────────────────────────┐  │
│  │ Adrenalin-ratiopharm         │  │
│  │ Epinephrin · iv              │  │
│  └──────────────────────────────┘  │
│                                    │
│  Algorithmen (1)                   │
│  ┌──────────────────────────────┐  │
│  │ Anaphylaxie                  │  │
│  │ Kardiovaskulär               │  │
│  └──────────────────────────────┘  │
└────────────────────────────────────┘
```

Elemente:
- **Suchfeld** — oben, bereits gefüllt, editierbar
- **Ergebnisse** — nach Typ gruppiert (Medikamente zuerst, dann Algorithmen)
- Jeder Eintrag: Name + Untertitel (Wirkstoff + Routen / Kategorie)
- Tap → Detail des jeweiligen Typs

Kein Filter-Toggle. Kein Sortier-Menü. Keine zusaetzlichen Inhaltstabs innerhalb des Screens.

---

## MedicationListScreen

**Zweck:** Alle Medikamente, alphabetisch durchsuchbar.

```
┌────────────────────────────────────┐
│  ←  Medikamente                    │
│  [ 🔍  Suchen... ]                 │
│                                    │
│  A                                 │
│  Adrenalin                  iv ›   │
│  Amiodarone                 iv ›   │
│  Atropin                    iv ›   │
│                                    │
│  D                                 │
│  Diazepam              iv · rectal ›│
│                                    │
└────────────────────────────────────┘
```

Elemente:
- **Zurück-Pfeil** → HomeScreen
- **Suchfeld** — filtert die Liste live
- **Alphabetische Liste** mit Abschnitts-Headern
- Jeder Eintrag: Name + verfügbare Routen als Chips
- Tap → MedicationDetailScreen

---

## MedicationDetailScreen

**Zweck:** Vollständige Medikamenten-Information für den Einsatz.

```
┌────────────────────────────────────┐
│  ←  Adrenalin                      │
│  Epinephrin                        │
│  Suprarenin · EpiPen               │
│────────────────────────────────────│
│  Dosierung                         │
│                                    │
│  IV / IO                           │
│  0,01 mg/kg  (max. 1 mg)           │
│  gewichtsbasiert                   │
│                                    │
│  Intranasal                        │
│  0,5–1 mg  Erwachsene              │
│────────────────────────────────────│
│  Indikationen                      │
│  · Anaphylaxie Grad III–IV         │
│  · Reanimation (Asystolie, PEA)    │
│────────────────────────────────────│
│  Kontraindikationen                │
│  ⛔ Absolut                        │
│  · keine absoluten KI bekannt      │
│  ⚠ Relativ                         │
│  · hypertensive Krise              │
│────────────────────────────────────│
│  Hinweise                          │
│  Kühl lagern, Lichtschutz          │
└────────────────────────────────────┘
```

Elemente:
- **Header:** Name + Wirkstoff + Handelsnamen
- **Dosierung:** nach Applikationsweg gruppiert, gewichtsbasiert gekennzeichnet
- **Indikationen:** kurze Bulletliste
- **Kontraindikationen:** getrennt nach absolut / relativ, visuell unterschieden
- **Hinweise:** Freitext

Kein Edit-Button. Keine Versions-History. Keine Kommentar-Funktion.

---

## AlgorithmListScreen

**Zweck:** Alle Algorithmen, nach Kategorie gruppiert.

```
┌────────────────────────────────────┐
│  ←  Algorithmen                    │
│  [ 🔍  Suchen... ]                 │
│                                    │
│  Kardiovaskulär                    │
│  Reanimation Erwachsene       ›    │
│  Anaphylaxie                  ›    │
│  ACS                          ›    │
│                                    │
│  Trauma                            │
│  Polytrauma                   ›    │
│  SHT schwer                   ›    │
│                                    │
│  Neurologie                        │
│  Krampfanfall                 ›    │
└────────────────────────────────────┘
```

Elemente:
- **Zurück-Pfeil** → HomeScreen
- **Suchfeld** — filtert live über Name und Kategorie
- **Kategorie-Gruppen** als Abschnitts-Header
- Tap → AlgorithmDetailScreen

---

## AlgorithmDetailScreen

**Zweck:** Schritt-für-Schritt-Ansicht eines Algorithmus im Einsatz.

```
┌────────────────────────────────────┐
│  ←  Reanimation Erwachsene         │
│  Kardiovaskulär                    │
│────────────────────────────────────│
│  Schritt 1                         │
│  Sicherheit prüfen —               │
│  Eigenschutz sicherstellen         │
│                                    │
│  Schritt 2                         │
│  Bewusstsein prüfen                │
│  Ansprechen + Schulter anfassen    │
│                                    │
│  Schritt 3                 ⚠ Wenn  │
│  Keine Reaktion →          keine   │
│  Notruf absetzen           Atmung  │
│                                    │
│  Schritt 4                         │
│  CPR beginnen                      │
│  30 Kompressionen : 2 Beatmungen   │
│                                    │
│  Schritt 6                         │
│  Adrenalin →  [ Adrenalin ↗ ]      │
│  1 mg iv alle 3–5 min              │
└────────────────────────────────────┘
```

Elemente:
- **Header:** Name + Kategorie
- **Schritte in Reihenfolge** — jeder Schritt klar abgesetzt
- **Bedingung** — wenn vorhanden, vor der Anweisung als Kontext-Label
- **Medikament-Link** — Tap öffnet MedicationDetailScreen (overlay oder push)
- Kein Progress-Tracker. Kein "Schritt abhaken". Kein Timer.

---

## Navigation

**Modell (Phase 0 Ist):** Root Bottom Tabs mit nested Stacks.

```
BottomTabs
  ├── HomeTab
  │     └── HomeScreen
  ├── SearchTab
  │     └── SearchResultsScreen
  ├── MedicationTab
  │     └── MedicationStack
  │           ├── MedicationListScreen
  │           └── MedicationDetailScreen
  └── AlgorithmTab
        └── AlgorithmStack
              ├── AlgorithmListScreen
              └── AlgorithmDetailScreen
```

Search-Detailnavigation nutzt die nested Stacks:

- `SearchResultsScreen` -> `MedicationStack` -> `MedicationDetailScreen`
- `SearchResultsScreen` -> `AlgorithmStack` -> `AlgorithmDetailScreen`

Damit bleibt die Back-Navigation innerhalb der fachlichen Domäne stabil.

### Begruendung fuer Phase 0

- klare Root-Orientierung fuer Kernbereiche (Home, Search, Medication, Algorithm)
- minimale Navigationskomplexitaet fuer einen Lookup-first MVP
- robuste Detailflows ohne separate globale Detailrouter

### Abgrenzung zum langfristigen Zielbild

Diese Struktur dokumentiert den akzeptierten MVP-Ist-Zustand.  
Sie ersetzt nicht spaetere Zielnavigationsschichten fuer Tenant-, Governance-, Release- und Admin-Flows.

---

## Design-Constraints

| Constraint | Begründung |
|-----------|-----------|
| Minimale Touch-Targets (≥ 48 px) | Handschuhe, Stress, schlechte Lichtverhältnisse |
| Hoher Kontrast (WCAG AA minimum) | Direktes Sonnenlicht, Fahrzeug-Innenraum |
| Keine Animationen über 150 ms | Kein visuelles Rauschen im Einsatz |
| Schriftgröße ≥ 16 px für Kerninhalte | Lesbarkeit auf Abstand |
| Keine modalen Dialoge für Hauptpfade | Kein Block im Einsatz |
| Offline-Indikator immer sichtbar | Einsatzkraft muss wissen ob Daten aktuell sind |

---

## Explizit nicht vorhanden (Phase 0)

- Dashboard / Übersichtsseite
- Lernmodus, Quiz, Fortschritt
- Statistiken, Verlauf, Nutzungsanalyse
- Einstellungen (außer Offline-Sync-Status)
- Profil / Login
- Benachrichtigungen
- Favoriten (Phase 1)
