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
- **Detail-Navigation:** Von Listen zu Detail per IDs; Suche nutzt `navigation.navigate` in den jeweiligen Tab/Stack (Logik in `SearchScreen.tsx`, ab Zeile ~42ff. im gelesenen Ausschnitt).

## Medication Flow

- **Liste + Detail:** implementiert (Stack `MedicationList` → `MedicationDetail`).
- **Daten:** `contentIndex.ts` → `loadLookupBundle()` aus `data/lookup-seed/medications.json` (validiert).

## Algorithm Flow

- **Liste + Detail:** implementiert; Algorithmus als **lineare** `steps[]` (Phase 0), nicht als Domain-`decisionLogic`-Graph.

## Search Flow

- **Implementiert:** `SearchScreen` filtert `contentItems` mit `matchesLookupBundleItem` — case-insensitive `includes()` auf `label`, `indication`, `searchTerms`, bei Medikation zusätzlich `dosage`/`notes`, bei Algorithmus `notes`/`warnings`/Schritt-Texte (Kommentar im Code: kein Fuzzy, keine KI).
- **Zusätzlicher Filter:** `kindFilter` all | medication | algorithm.

## Detail Screens

- Medikation und Algorithmus: vorhanden (siehe oben).

## Mock-Daten vs. echte Daten

- **Keine Netzwerk-API** im gelesenen Datenpfad: JSON wird **zur Build-/Bundle-Zeit** importiert in `loadLookupBundle.ts` (`import … from '../../../../data/lookup-seed/…'`).
- Inhalt ist **Seed-Daten** mit `bundleId: "pilot-wache-001"` im Manifest — keine Trennung „Mock“/„Produktion“ im Code ausgedrückt, nur statische Seed-Dateien.

## Offline Support

- **Kommentar in `loadLookupBundle.ts`:** „No persistence, no network, no sync — bundle only.“
- **RAM-Store** nach Validierung — **keine** AsyncStorage/SQLite o. Ä. in den gelesenen Dateien nachgewiesen.

## Expo-Status

- **`app.json`:** Name ResQBrain, Slug `resqbrain`, Version 0.1.0, Portrait, Icons/Splash konfiguriert.
- **Scripts:** `expo start`, `expo export` für Android/iOS nach `dist-validation` / `dist-validation-ios`.

## Build / Typecheck-Status

- **`tsc --noEmit`** in `apps/mobile-app`: erfolgreich (Export-Lauf).
- **Root `pnpm build`:** baut nur die Website, nicht die Mobile-App.

## Sonstiges im App-Ordner

- **`design/Extract UX and UI Requirements/`** — separates Vite/Design-Unterprojekt; in `tsconfig.json` der Mobile-App **excluded**.
