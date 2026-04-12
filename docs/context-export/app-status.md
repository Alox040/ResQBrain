# App-Status — Mobile (`apps/mobile-app`)

**Stand:** 12. April 2026 — aus Navigationscode, `package.json` und Projektdokumentation.

---

## Screens vorhanden

Komponenten registriert in `AppNavigator.tsx` / Home-Stack:

| Screen | Komponente |
|--------|------------|
| Start / Home | `HomeScreen` (`HomeMain`) |
| Verlauf | `HistoryScreen` |
| Vitalwerte (Referenz) | `VitalReferenceScreen` |
| Suche | `SearchScreen` (Tab) |
| Favoriten | `FavoritesScreen` (Tab) |
| Einstellungen | `SettingsScreen` (Tab) |
| Medikamentenliste | `MedicationListScreen` |
| Medikamentendetail | `MedicationDetailScreen` |
| Dosisrechner | `DoseCalculatorScreen` |
| Algorithmenliste | `AlgorithmListScreen` |
| Algorithmusdetail | `AlgorithmDetailScreen` |

---

## Navigation Flow

- **Bottom Tabs:** Start, Suche, Favoriten, Settings, Medikamente (Stack), Algorithmen (Stack).
- **Home-Stack:** Von Home aus erreichbar: Verlauf, Vitalreferenz (keine Medikamenten-/Algorithmus-Detailrouten im Home-Stack selbst — diese liegen in den jeweiligen Tabs).

---

## Medication Flow Status

- **Liste → Detail → Dosisrechner:** im `MedicationStackNavigator` definiert (`MedicationListScreen` → `MedicationDetail` → `DoseCalculator`).
- **Inhalt:** aus Lookup-Bundle (siehe nächster Abschnitt).

---

## Algorithm Flow Status

- **Liste → Detail:** `AlgorithmStackNavigator`; Liste akzeptiert optional `category`.
- **Schritte:** Phase-0-Schema erlaubt lineare Schritte mit Key `text` (`lookupSchema.ts`).

---

## Search Flow Status

- **Eigenes Tab** `Search` mit `SearchScreen`.
- **Funktionalität (Doku):** lokale Suche, Ranking, Filter „Alle / Medikamente / Algorithmen“ — `docs/context/12-next-steps.md`.

---

## Detail Screens Status

- Medikamenten- und Algorithmus-Detail sind implementiert und in den Stacks registriert (siehe Tabelle oben).

---

## Mock Data vs. echte Daten

- **Datenquelle:** eingebettetes JSON unter `apps/mobile-app/data/lookup-seed/` (`manifest.json`, `medications.json`, `algorithms.json`), geladen in `loadLookupBundle.ts` via `import` der JSON-Dateien.
- **Kein** produktives Backend in der App für Lookup laut Phase-0-Beschreibung in `lookupSchema.ts` und `docs/context/12-next-steps.md` (lokale Suche ohne Server).

---

## Offline Support Status

- **Bundle:** offline nutzbar; Validierung beim Laden (`validateLookupBundle` referenziert in `loadLookupBundle.ts`).
- **`lookupSource.ts`:** beschreibt Schichten `embedded` / `cached` / `updated` / `fallback`; Kommentar und Roadmap: **aktiv weiterhin embedded**; Sync/Netzwerk **nicht** umgesetzt.

---

## Expo Status

- **Expo SDK:** `expo ~54.0.33` in `apps/mobile-app/package.json`.
- **Verify:** `pnpm verify:expo-doctor` (`pnpm dlx expo-doctor`), `verify:local` inkl. `expo export` für Android.

---

## Build Status

- **Typecheck:** `tsc --noEmit`.
- **Lint:** Script gibt explizit aus, dass **keine ESLint-Konfiguration** in `mobile-app` vorliegt.
- **Bundle-Export-Check:** `expo export --platform android` als Teil von `verify:local`.
