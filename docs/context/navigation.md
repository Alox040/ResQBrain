# Navigation

**Last Updated:** 2026-03-27

## Navigation Tree

Root: `Tab.Navigator`

- `Home`
- `Search`
- `MedicationList` (nested Stack)
- `AlgorithmList` (nested Stack)

## Stacks

### Medication Stack

- `MedicationList`
- `MedicationDetail` (`medicationId`)

### Algorithm Stack

- `AlgorithmList`
- `AlgorithmDetail` (`algorithmId`)

## Screens (aktuell vorhanden)

- `HomeScreen`
- `SearchScreen`
- `MedicationListScreen`
- `MedicationDetailScreen`
- `AlgorithmListScreen`
- `AlgorithmDetailScreen`

## Detail Flows

- Medikament:
  `MedicationList` -> `MedicationDetail`
- Algorithmus:
  `AlgorithmList` -> `AlgorithmDetail`

## Deep Navigation

Aktuell ueber Suchtreffer:

- `Search` -> `MedicationList` Stack -> `MedicationDetail`
- `Search` -> `AlgorithmList` Stack -> `AlgorithmDetail`

Es gibt keine externen Deep-Link-URLs oder universellen Link-Routen fuer die Mobile-App.

## Search Navigation

`SearchScreen` filtert lokale Mock-Daten (`mockSearchResults`) clientseitig:

- Treffer `medication` navigieren zur Medikament-Detailansicht
- Treffer `algorithm` navigieren zur Algorithmus-Detailansicht

Keine serverseitige Suche, kein Ranking-Service, keine persistente Suchhistorie.
