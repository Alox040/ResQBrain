# Mobile-App-Status (Export)

**App-Pfad:** `apps/mobile-app/`  
**Framework:** Expo (`app.json`, `package.json`: `expo ~54.0.33`).

## Screens vorhanden (`src/screens/`)

| Datei | Rolle |
|-------|--------|
| `HomeScreen.tsx` | Tab „Start“ |
| `SearchScreen.tsx` | Tab „Suche“ |
| `MedicationListScreen.tsx` | Medikamentenliste (im Medikamenten-Stack) |
| `MedicationDetailScreen.tsx` | Medikamentendetail |
| `AlgorithmListScreen.tsx` | Algorithmenliste |
| `AlgorithmDetailScreen.tsx` | Algorithmusdetail (lineare Schritte) |

## Navigation Flow

- **Tabs:** Home, Search, MedicationList (Stack), AlgorithmList (Stack) — siehe `AppNavigator.tsx`.
- **Detail-Navigation:** Von Listen zu Detail per IDs; Suche nutzt `navigation.navigate` in den jeweiligen Tab/Stack (Logik in `SearchScreen.tsx`).

## Medication Flow

- **Liste + Detail:** implementiert (Stack `MedicationList` → `MedicationDetail`).
- **Daten:** `contentIndex.ts` bezieht Daten aus `loadLookupBundle()` (`src/lookup/loadLookupBundle.ts`) — validiertes `medications.json`.

## Algorithm Flow

- **Liste + Detail:** implementiert; Algorithmus als **lineare** `steps[]` (Phase 0), nicht als Domain-`decisionLogic`-Graph.

## Search Flow

- **Implementiert:** `SearchScreen` filtert über Bundle-Index — case-insensitive `includes()` auf `label`, `indication`, `searchTerms`, bei Medikation zusätzlich `dosage`/`notes`, bei Algorithmus `notes`/`warnings`/Schritt-Texte (kein Fuzzy, keine KI laut Codekommentar).
- **Zusätzlicher Filter:** `kindFilter` all | medication | algorithm.

## Detail Screens

- Medikation und Algorithmus: vorhanden (siehe oben).

## Mock-Daten vs. echte Daten

- **Keine Netzwerk-API** im Datenpfad: JSON wird zur Bundling-Zeit importiert in `loadLookupBundle.ts` (`import … from '../../../../data/lookup-seed/…'`).
- Inhalt ist **Seed-JSON**; `manifest.json` enthält u. a. `bundleId: "pilot-wache-001"` — keine separate „Mock“-Kennzeichnung im Code.

## Offline Support

- **Kommentar in `loadLookupBundle.ts` (Typ `LookupRamStore`):** „No persistence, no network, no sync — bundle only.“
- **RAM-Store** nach Validierung — **keine** AsyncStorage/SQLite in den für diesen Export gelesenen Dateien nachgewiesen.

## Expo-Status

- **`app.json`:** Name ResQBrain, Slug `resqbrain`, Version 0.1.0, Portrait, Icons/Splash konfiguriert (Details in Datei).
- **Scripts:** `expo start`, `expo export` für Android/iOS nach `dist-validation` / `dist-validation-ios`.

## Build / Typecheck-Status

- **`tsc --noEmit`** in `apps/mobile-app`: erfolgreich (Lauf 31. März 2026).
- **Root `pnpm build`:** baut nur die Website (`@resqbrain/website`), nicht die Mobile-App.

## Sonstiges im App-Ordner

- **`design/Extract UX and UI Requirements/`** — separates Vite/Design-Unterprojekt; in `tsconfig.json` der Mobile-App typischerweise excluded.
- **`ui8/_extracted/...`** — extrahierte Drittanbieter-Struktur mit eigenem `package.json`; nicht Teil des Mobile-Build-Pfads dieses Exports.
