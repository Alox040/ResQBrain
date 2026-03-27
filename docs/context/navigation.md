# Navigation

**Last Updated:** 2026-03-27

## MVP-Ist-Zustand (Phase 0)

### Root Bottom Tabs

Root ist ein `BottomTabNavigator` mit vier Tabs:

- `Home`
- `Search`
- `Medication`
- `Algorithm`

### Nested Stacks

Die Tabs `Medication` und `Algorithm` kapseln jeweils einen eigenen Stack, damit Listen- und Detailpfade innerhalb des Bereichs bleiben.

#### Medication Stack

- `MedicationList`
- `MedicationDetail` (`medicationId`)

#### Algorithm Stack

- `AlgorithmList`
- `AlgorithmDetail` (`algorithmId`)

### Search -> nested Detail Flows

`Search` bleibt ein eigener Root-Tab, navigiert fuer Detailansichten aber in die jeweiligen nested Stacks:

- `Search` -> `Medication` Stack -> `MedicationDetail`
- `Search` -> `Algorithm` Stack -> `AlgorithmDetail`

Damit bleibt Back-Navigation konsistent zur Herkunftsdomäne (Medication vs. Algorithm) statt ueber einen globalen Detail-Stack zu laufen.

### Screens (aktuell vorhanden)

- `HomeScreen`
- `SearchScreen`
- `MedicationListScreen`
- `MedicationDetailScreen`
- `AlgorithmListScreen`
- `AlgorithmDetailScreen`

## Begründung fuer Phase 0

- **Schnelle Orientierung:** Root Tabs geben im Einsatz eine sofort sichtbare Bereichsstruktur (Home, Search, Medication, Algorithm).
- **MVP-sicher:** Nested Stacks loesen Detailnavigation ohne komplexe Router- oder Linking-Logik.
- **Geringes Risiko:** Struktur ist robust fuer mock-basierte Offline-Daten und minimiert Navigationsfehler.
- **Erweiterbar:** Die gleiche Grundstruktur kann spaeter mit produktiven Datenquellen weitergefuehrt werden.

## Abgrenzung zum langfristigen Zielbild

Der Phase-0-Ist-Stand bildet nur Lookup-Navigation ab. Nicht enthalten sind:

- Tenant-/Rollen-basierte Navigationszweige
- Governance-/Approval-/Versioning-UI-Flows
- Release- oder Admin-orientierte Routing-Ebenen
- Externe Deep-Link-Strategie fuer produktive Content-Releases

Das langfristige Zielbild aus `docs/architecture` bleibt damit unveraendert gueltig; Phase 0 dokumentiert bewusst nur die aktuell akzeptierte MVP-Navigation.
