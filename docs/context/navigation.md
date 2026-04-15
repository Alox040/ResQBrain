# Navigation

**Last Updated:** 2026-04-15

## MVP-Ist-Zustand (Phase 0)

### Root Bottom Tabs

Root ist ein `BottomTabNavigator` mit fünf Tabs (Namen siehe `AppNavigator.tsx`):

- **Start** (`Home`) — enthält den Home-Stack
- **Suche** (`Search`)
- **Einstellungen** (`Settings`)
- **Medikamente** (`MedicationTab`) — eigener Stack
- **Algorithmen** (`AlgorithmTab`) — eigener Stack

**Hinweis:** **Favoriten** sind in der Startansicht und in Listen integriert (Stern), **kein** eigener Root-Tab. **Verlauf** ist ein Screen im **Home-Stack** (`History`), kein Root-Tab.

### Home Stack (Start-Tab)

- `HomeMain` — Start/Home
- `History` — Verlauf
- `VitalReference` — Vitalwerte-Referenz

### Nested Stacks (Medikamente / Algorithmen)

Die Tabs `MedicationTab` und `AlgorithmTab` kapseln jeweils einen eigenen Stack.

#### Medication Stack

- `MedicationListScreen`
- `MedicationDetail` (`medicationId`)

#### Algorithm Stack

- `AlgorithmListScreen` (optional `category`)
- `AlgorithmDetail` (`algorithmId`)

### Search -> nested Detail Flows

`Search` bleibt ein eigener Root-Tab, navigiert fuer Detailansichten in die jeweiligen nested Stacks.

### Screens (Kern, nicht vollstaendig)

- `HomeScreen`, `SearchScreen`, `SettingsScreen`
- `MedicationListScreen`, `MedicationDetailScreen`
- `AlgorithmListScreen`, `AlgorithmDetailScreen`
- `HistoryScreen`, `VitalReferenceScreen`

(`FavoritesScreen.tsx` existiert im Repo, ist aber nicht als Route in `AppNavigator` registriert — Stand Abgleich.)

## Begründung fuer Phase 0

- **Schnelle Orientierung:** Root Tabs geben im Einsatz eine sichtbare Bereichsstruktur.
- **MVP-sicher:** Nested Stacks loesen Detailnavigation ohne komplexe Router-Logik.
- **Geringes Risiko:** Struktur ist robust fuer lokale Lookup-Daten.
- **Erweiterbar:** spaeter mit produktiven Datenquellen weiterfuehrbar.

## Abgrenzung zum langfristigen Zielbild

Der Phase-0-Ist-Stand bildet nur Lookup-Navigation ab. Nicht enthalten sind:

- Tenant-/Rollen-basierte Navigationszweige
- Governance-/Approval-/Versioning-UI-Flows
- Release- oder Admin-orientierte Routing-Ebenen
- Externe Deep-Link-Strategie fuer produktive Content-Releases

Das langfristige Zielbild aus `docs/architecture` bleibt damit unveraendert gueltig; Phase 0 dokumentiert bewusst nur die aktuell akzeptierte MVP-Navigation.
