# Mobile-App-Status (Export)

**App-Pfad:** `apps/mobile-app/`  
**Framework:** Expo (`expo ~54.0.33`).

## Screens vorhanden (`src/screens/` und Features)

| Datei | Rolle |
|-------|--------|
| `HomeScreen.tsx` | Startscreen mit Schnellzugriff und Navigation-Kacheln |
| `SearchScreen.tsx` | Suche mit lokalem Ranking und Typ-Filter |
| `FavoritesScreen.tsx` | Favoritenliste |
| `SettingsScreen.tsx` | Settings-Tab |
| `MedicationListScreen.tsx` | Medikamentenliste |
| `MedicationDetailScreen.tsx` | Medikamentendetail |
| `AlgorithmListScreen.tsx` | Algorithmenliste |
| `AlgorithmDetailScreen.tsx` | Algorithmusdetail |
| `DoseCalculatorScreen.tsx` | Dosisrechner |
| `features/references/VitalReferenceScreen.tsx` | Vitalwerte-Referenz |
| `HistoryScreen.tsx` | Verlauf (Feature-Screen vorhanden) |

## Navigation Flow

- Tabs: `Home`, `Search`, `Favorites`, `Settings`, `MedicationTab`, `AlgorithmTab`.
- Home-Stack: `HomeMain` -> `VitalReference`.
- Medikament-Stack: `MedicationListScreen` -> `MedicationDetail` -> `DoseCalculator`.
- Algorithmus-Stack: `AlgorithmListScreen` -> `AlgorithmDetail`.

## Expo-Status

- Paket-Skripte enthalten `start`, `android`, `ios`, `typecheck`, `verify:local`, `verify:expo-doctor`, `verify:expo-bundle`.
- Root-Skripte `mobile:verify` und `mobile:verify:doctor` sind weiterhin auf `resqbrain-mobile` verdrahtet.

## Offline-Status

- Inhalte werden aus `data/lookup-seed` geladen und in der App validiert.
- Kein separater Bundle-Download/Bundle-Replace als Standarddatenpfad dokumentiert.
- AsyncStorage wird fuer Favoriten/Verlauf/Recent genutzt, nicht als persistenter medizinischer Inhaltsstore.

## Mock -> echte Daten

- Laufzeitdaten kommen aus dem eingebetteten Seed-Bundle (`manifest.json`, `medications.json`, `algorithms.json`).
- Kein produktiver API-Datenpfad im Mobile-Lookup-Flow nachweisbar.

## Kurzfazit

- Navigation und Kernscreens wurden gegenueber frueheren Exporten erweitert (insb. `Settings` im Root-Tab).
- Lookup-first Architektur bleibt bestehen; Offline/Sync fuer medizinische Inhalte ist weiter offen.
