# app-status

Stand: April 2026

## Mobile App (`apps/mobile-app`)

### Betrieb
- Technologie: Expo / React Native, TypeScript
- Startet: Ja — `App.tsx` ruft `ensureContentStoreReady()`, bei Fehler erscheint Retry-Screen
- Offline-Grundfunktion: vollständig — kein Netzwerk für Kernfunktion erforderlich
- Expo-Export: zuletzt erfolgreich verifiziert

### Navigation (stabil)

Bottom-Tab-Navigator mit 5 Tabs:

| Tab | Stack-Screens |
|---|---|
| Start (Home) | HomeMain → History, VitalReference |
| Suche | SearchScreen |
| Einstellungen | SettingsScreen |
| Medikamente | MedicationList → MedicationDetail |
| Algorithmen | AlgorithmList → AlgorithmDetail |

### Datenpfad

1. `App.tsx` → `ensureContentStoreReady()` → `loadEmbeddedLookupBundle()` (compile-time embedded)
2. Parallel: `hydrateFavorites()`, `hydrateHistory()`, `hydrateRecent()`
3. Erst nach Abschluss: `AppNavigator` wird gerendert
4. Bei Fehler: `AppError`-Screen mit Retry-Button

Kein Netzwerkzugriff im Startpfad. Remote-Update-Pfad: Infrastruktur vorhanden, für Phase-0 vollständig deaktiviert.

### Features (existiert und funktioniert)

- Medikamente: Listenansicht mit Kategorie-Filter, Detailansicht
- Algorithmen: Listenansicht mit Kategorie-Filter, Detailansicht
- Suche: Volltext über alle ContentItems
- Favoriten: persistent (AsyncStorage)
- Verlauf: persistent (AsyncStorage)
- Zuletzt gesehen: persistent (AsyncStorage)
- Vitalwerte-Referenz: statische Referenztabelle
- Einstellungen: Theme-Umschalter (Hell/Dunkel)

### Offene Bugs / Risiken

- Jeder Datenzugriff ohne vorheriges `ensureContentStoreReady()` wirft eine Laufzeit-Exception (`requireStore()`).
- HTTP-Client (`src/lib/lookup-api/client.ts`) ist im Code vorhanden aber deaktiviert — jeder versehentliche Aufruf schlägt sofort fehl.
- `bundleUpdateService.ts`: Version-Comparison-Logik ist funktional, aber `downloadBundle()` schlägt immer fehl — dormante Infrastruktur.
- API-Tests konnten zuletzt nicht ausgeführt werden (EPERM bei `tsx --test`, Umgebungsproblem Windows).
