# Mobile-App-Status (Export)

**App-Pfad:** `apps/mobile-app/`  
**Framework:** Expo (`app.json`, `package.json`: `expo ~54.0.33`).

## Screens vorhanden (`src/screens/` und angrenzende Features)

| Datei | Rolle |
|-------|--------|
| `HomeScreen.tsx` | Tab „Start“ mit Quick Access (Favoriten/zuletzt), Einsatzmodus-Karten und Navigation-Kacheln |
| `SearchScreen.tsx` | Tab „Suche“ (Ranking, Filter nach Inhaltstyp) |
| `FavoritesScreen.tsx` | Tab „Favoriten“ (Medikamente + Algorithmen, gruppiert, persistent) |
| `HistoryScreen.tsx` | Verlaufsliste der zuletzt geöffneten Inhalte (max. 30, persistent) |
| `MedicationListScreen.tsx` | Medikamentenliste (im Medikamenten-Stack) |
| `MedicationDetailScreen.tsx` | Medikamentendetail (inkl. Favoriten-Stern, Cross-Refs) |
| `AlgorithmListScreen.tsx` | Algorithmenliste |
| `AlgorithmDetailScreen.tsx` | Algorithmusdetail (lineare Schritte, Cross-Refs) |
| `DoseCalculatorScreen.tsx` | Dosisrechner (gewichtsbasiert, aus Dosistext abgeleitet) |
| `features/references/VitalReferenceScreen.tsx` | Vitalwerte-Referenz (nach Altersgruppen, im Home-Stack) |

## Navigation Flow

- **Tabs (`RootTabParamList`):** `Home`, `Search`, `Favorites`, `MedicationTab`, `AlgorithmTab` — siehe `AppNavigator.tsx`.
- **Home-Stack:** `HomeMain` → `VitalReference`; von Home aus Navigation in alle weiteren Tabs/Stacks.
- **Medikament-Stack:** `MedicationListScreen` → `MedicationDetail` → `DoseCalculator` (Header-Icon).
- **Algorithmus-Stack:** `AlgorithmListScreen` → `AlgorithmDetail`.
- **Detail-Navigation:** Von Listen und Suche zu Detail per IDs; Suche nutzt `navigation.navigate` in die jeweiligen Tab/Stacks (Logik in `SearchScreen.tsx`).

## Medication Flow

- **Liste + Detail:** implementiert (Stack `MedicationList` → `MedicationDetail`).
- **Daten:** `contentIndex.ts` bezieht Daten aus `loadLookupBundle()` (`src/lookup/loadLookupBundle.ts`) — validiertes `medications.json`.

## Algorithm Flow

- **Liste + Detail:** implementiert; Algorithmus als **lineare** `steps[]` (Phase 0), nicht als Domain-`decisionLogic`-Graph.

## Search Flow

- **Implementiert:** `SearchScreen` nutzt `rankContentItemsForSearch` (`utils/searchRanking.ts`) auf Basis des Bundle-Index (`contentIndex`): berücksichtigt `label`, `indication`, `searchTerms` und weitere Felder; Ranking erfolgt lokal, ohne KI / Fuzzy-Matching.
- **Zusätzlicher Filter:** `kindFilter` `all` | `medication` | `algorithm` inkl. UI-Tags und Klartextstatus („Alle Inhalte“ / „Nur Medikamente“ / „Nur Algorithmen“).

## Detail Screens

- Medikation und Algorithmus: vorhanden (siehe oben), jeweils mit:
  - Cross-Referenzen (Algorithmus ↔ Medikamente) inkl. defensiver Behandlung ungültiger IDs.
  - Favoriten-Toggle (Stern in der Kopfzeile, speichert in AsyncStorage).
  - Verlaufseintrag beim Öffnen (History-Store).

## Mock-Daten vs. echte Daten

- **Keine Netzwerk-API** im Datenpfad: JSON wird zur Bundling-Zeit importiert in `loadLookupBundle.ts` (`import … from '../../../../data/lookup-seed/…'`).
- Inhalt ist **Seed-JSON**; `manifest.json` enthält u. a. `bundleId: "pilot-wache-001"` — keine separate „Mock“-Kennzeichnung im Code.
- Umfang des Bundles im Export: `medications.json` und `algorithms.json` enthalten jeweils **9** Objekte mit `"id"`.

## Offline Support

- **Lookup-Bundle:** `loadLookupBundle.ts` lädt Manifest + Inhalte aus `data/lookup-seed/` und validiert sie gegen `lookupSchema.ts`; danach Nutzung als **RAM-Store**. Keine Netzwerkanbindung, keine Sync-Pipeline im App-Code.
- **Bundle-Persistenz:** Es gibt **keinen** separaten, von der App verwalteten Bundle-Speicher (Download/Ersetzung); Quelle bleibt das eingebettete JSON-Bundle.
- **App-Lokalspeicher:** AsyncStorage wird genutzt für Favoriten, Verlauf und „zuletzt“ (`storage/localStorage.ts` und zugehörige Stores), nicht für medizinische Inhalte selbst.

## Expo-Status

- **`app.json`:** Name ResQBrain, Slug `resqbrain`, Version 0.1.0, Portrait, Icons/Splash konfiguriert (Details in Datei).
- **Scripts im App-Paket:** `expo start`, `expo export` für Android/iOS nach `dist-validation` / `dist-validation-ios`.
- **Root-Scripts:** `pnpm mobile:verify` und `pnpm mobile:verify:doctor` referenzieren das Paket `resqbrain-mobile` und prüfen TypeScript/Nav-Struktur bzw. `expo-doctor`.

## Build / Typecheck-Status

- **`tsc --noEmit`** in `apps/mobile-app`: erfolgreich (Lauf 31. März 2026).
- **Root `pnpm build`:** baut nur die Website (`@resqbrain/website`), nicht die Mobile-App.

## Sonstiges im App-Ordner

- **`design/Extract UX and UI Requirements/`** — separates Vite/Design-Unterprojekt; in `tsconfig.json` der Mobile-App typischerweise excluded.
- **`ui8/_extracted/...`** — extrahierte Drittanbieter-Struktur mit eigenem `package.json`; nicht Teil des Mobile-Build-Pfads dieses Exports.
