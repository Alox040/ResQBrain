# Mobile-App-Status (Export)

**App-Pfad:** `apps/mobile-app/`  
**Framework:** Expo (`expo ~54.0.33`).  
**Letzte Verifikation (Export):** `npx tsc --noEmit` Exit **0**; `pnpm mobile:verify` Exit **0** (inkl. `expo export` Android).

## Screens vorhanden (`src/screens/` und Features)

| Datei / Ort | Rolle |
|-------------|--------|
| `HomeScreen.tsx` | Startscreen mit Schnellzugriff und Navigation (u. a. Navigation zu `History`) |
| `SearchScreen.tsx` | Suche mit lokalem Ranking und Typ-Filter |
| `FavoritesScreen.tsx` | Favoritenliste |
| `SettingsScreen.tsx` | Settings-Tab |
| `MedicationListScreen.tsx` / `MedicationDetailScreen.tsx` | Medikamentenliste und -detail |
| `AlgorithmListScreen.tsx` / `AlgorithmDetailScreen.tsx` | Algorithmenliste und -detail |
| `DoseCalculatorScreen.tsx` | Dosisrechner |
| `features/references/VitalReferenceScreen.tsx` | Vitalwerte-Referenz |
| `HistoryScreen.tsx` | Verlauf-UI |

## Navigation Flow

- Tabs (`AppNavigator.tsx`): `Home`, `Search`, `Favorites`, `Settings`, `MedicationTab`, `AlgorithmTab`.
- Home-Stack (`homeStackParamList.ts`): `HomeMain` → `History` (`HistoryScreen`) → `VitalReference`.
- Medikament-Stack: `MedicationListScreen` → `MedicationDetail` → `DoseCalculator`.
- Algorithmus-Stack: `AlgorithmListScreen` → `AlgorithmDetail`.

**Abgleich:** `History` ist in `AppNavigator` / `HomeStackParamList` registriert; `HomeScreen` navigiert per `navigation.navigate('History')` (Quelltext).

## Expo-Status

- Paket-Skripte: `start`, `android`, `ios`, `typecheck`, `verify:local` (Typecheck + Nav-Checks + `expo export` Android), `verify:expo-doctor`, `verify:expo-bundle`.
- Root: `pnpm mobile:verify` → `resqbrain-mobile` `verify:local` — im Export-Lauf **Exit 0**.

## Offline-Status

- Bundle wird über `resolveLookupBundle()` gewählt (Priorität: updated → cached → embedded → fallback); In-Memory-Index via `initializeContent` / `contentIndex`.
- Eingebettete Quelle: `data/lookup-seed` (über Metro `watchFolders` bis Monorepo-Root).
- AsyncStorage: Favoriten, Verlauf, Recent (Hydration in `App.tsx`).
- Optional: `EXPO_PUBLIC_LOOKUP_BUNDLE_URL` löst Hintergrund-Check/Download in `bundleUpdateService` aus — ohne in diesem Export nachgewiesene produktive End-to-End-Kette.

## Mock → echte Daten

- Kein produktiver API-Datenpfad für Org/Auth; Lookup-Inhalte aus validiertem JSON-Bundle (embedded oder persistierte Schichten, sofern befüllt).

## Kurzfazit

- Navigation und Kern-Flows wie oben im Code verdrahtet.
- **Typecheck und `pnpm mobile:verify` sind im aktuellen Stand grün** (Stand Export 8. April 2026).
