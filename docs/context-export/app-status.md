# Mobile-App-Status (Export)

**App-Pfad:** `apps/mobile-app/`  
**Framework:** Expo (`expo ~54.0.33`).  
**Letzte Verifikation (Export):** `pnpm build` (Root) OK; `npx tsc --noEmit` in `apps/mobile-app` Exit 2 (siehe unten / `known-issues.md`).

## Screens vorhanden (`src/screens/` und Features)

| Datei / Ort | Rolle |
|-------------|--------|
| `HomeScreen.tsx` | Startscreen mit Schnellzugriff und Navigation |
| `SearchScreen.tsx` | Suche mit lokalem Ranking und Typ-Filter |
| `FavoritesScreen.tsx` | Favoritenliste |
| `SettingsScreen.tsx` | Settings-Tab |
| `MedicationListScreen.tsx` / `MedicationDetailScreen.tsx` | Medikamentenliste und -detail |
| `AlgorithmListScreen.tsx` / `AlgorithmDetailScreen.tsx` | Algorithmenliste und -detail |
| `DoseCalculatorScreen.tsx` | Dosisrechner |
| `features/references/VitalReferenceScreen.tsx` | Vitalwerte-Referenz |
| `HistoryScreen.tsx` | Verlauf-UI (Komponente vorhanden) |

## Navigation Flow

- Tabs (`AppNavigator.tsx`): `Home`, `Search`, `Favorites`, `Settings`, `MedicationTab`, `AlgorithmTab`.
- Home-Stack (`homeStackParamList.ts`): `HomeMain` → `VitalReference`.
- Medikament-Stack: `MedicationListScreen` → `MedicationDetail` → `DoseCalculator`.
- Algorithmus-Stack: `AlgorithmListScreen` → `AlgorithmDetail`.

**Abgleich:** `HistoryScreen` ist **nicht** in `AppNavigator` oder `HomeStackParamList` registriert (nur Datei im Repo).

## Expo-Status

- Paket-Skripte: `start`, `android`, `ios`, `typecheck`, `verify:local` (Typecheck + Nav-Checks + `expo export` Android), `verify:expo-doctor`, `verify:expo-bundle`.
- Root: `pnpm mobile:verify` → `resqbrain-mobile` `verify:local` — **scheitert aktuell am ersten Schritt `tsc --noEmit`** (frischer Lauf: Exit 2).

## Offline-Status

- Bundle wird über `resolveLookupBundle()` gewählt (Priorität: updated → cached → embedded → fallback); In-Memory-Index via `initializeContent` / `contentIndex`.
- Eingebettete Quelle: `data/lookup-seed` (über Metro `watchFolders` bis Monorepo-Root).
- AsyncStorage: Favoriten, Verlauf, Recent (Hydration in `App.tsx`).
- Optional: `EXPO_PUBLIC_LOOKUP_BUNDLE_URL` löst Hintergrund-Check/Download in `bundleUpdateService` aus — ohne garantierte produktive End-to-End-Kette im Export nachgewiesen.

## Mock → echte Daten

- Kein produktiver API-Datenpfad für Org/Auth; Lookup-Inhalte aus validiertem JSON-Bundle (embedded oder persistierte Schichten, sofern befüllt).

## Kurzfazit

- Navigation und Kern-Flows wie oben im Code verdrahtet.
- **Typecheck der Mobile-App ist derzeit rot** (siehe `known-issues.md`); `pnpm mobile:verify` damit nicht grün.
