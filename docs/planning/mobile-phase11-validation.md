# Mobile App — Abschlussvalidierung (Phase 11, nach UI-Refactor)

**Datum:** 2026-03-31  
**Umfang:** `apps/mobile-app` only. Website, Domain und Seed-Daten **unberührt**.

---

## 1. TypeScript-Check

**Befehl:** `npx tsc --noEmit` (im Verzeichnis `apps/mobile-app`)

**Ergebnis:** **PASS** (Exit Code 0), zuletzt nach den unten dokumentierten Klein-Korrekturen.

---

## 2. Navigation (Smoke — strukturell + Empfehlung Gerät)

**Verifiziert (Code / `AppNavigator.tsx`):**

| Pflichtscreen | Registrierung | Hinweis |
|---------------|---------------|---------|
| Home | `Tab.Screen` → `HomeScreen` | Tab-Titel „Start“ |
| Search | `Tab.Screen` → `SearchScreen` | Tab-Titel „Suche“ |
| MedicationList | `MedicationStack` → `MedicationListScreen` | Tab `MedicationList`, Stack-Header aktiv |
| MedicationDetail | `MedicationStack` → `MedicationDetailScreen` | `medicationId`-Param |
| AlgorithmList | `AlgorithmStack` → `AlgorithmListScreen` | Tab `AlgorithmList` |
| AlgorithmDetail | `AlgorithmStack` → `AlgorithmDetailScreen` | `algorithmId`-Param |

**Cross-Tab aus Suche:** `SearchScreen` navigiert per `navigation.navigate('MedicationList', { screen: 'MedicationDetail', params })` bzw. analog `AlgorithmList` → `AlgorithmDetail` — entspricht verschachtelter Tab+Stack-Struktur.

**Detail → verwandter Inhalt:** `MedicationDetailScreen` / `AlgorithmDetailScreen` nutzen `getParent<BottomTabNavigationProp<RootTabParamList>>()` und Ziel-Stack mit verschachteltem Screen — weiterhin konsistent mit bestehendem Muster.

**Manueller Smoke auf Gerät/Simulator:** Im Agent-Lauf **nicht** durchgeführt (kein ausgewertetes UI-Laufzeitprotokoll). **Empfehlung:** Einmal alle sechs Screens antippen, zurück navigieren, aus der Suche einen Medikamenten- und einen Algorithmus-Treffer öffnen.

---

## 3. Checkliste UX / Technik

### Empty States

| Ort | Verhalten |
|-----|-----------|
| `SearchScreen` | Leere Suche: Hinweis „Tippe mindestens einen Buchstaben…“; keine Treffer: dynamische Meldung mit Suchstring |
| `MedicationListScreen` / `AlgorithmListScreen` | `ListScreenEmptyPlaceholder` → `EmptyState`, leere Liste zentriert (`flexGrow` + `flexGrow` im Wrapper) |
| `MedicationDetailScreen` / `AlgorithmDetailScreen` | Unbekannte ID: `EmptyState` inkl. `hint` |

### Chevron- und Link-Navigation

- `LookupListRow`, `DetailLinkRow`, `ContentListCard`, Home-Kurzwege: `chevron-forward` (22 px), `Pressable`/`TouchableOpacity` mit `accessibilityRole` bzw. Label dort wo vorgesehen.
- Querverweise Detail: `DetailLinkRow` mit Kontext-Label „Algorithmus“ / „Medikament“.

### Scroll-Verhalten

- Home, Suche (ohne Liste), Medikamenten-/Algorithmus-**Detail:** `ScrollView` mit `contentContainerStyle` inkl. unterem Padding (`SPACING.screenPaddingBottom` bzw. + `gapSm` bei Details).
- **Listen:** `FlatList` mit `contentContainerStyle`/`paddingBottom`; leere Liste: `contentEmpty` mit `flexGrow: 1` für vertikale Zentrierung.

### FlatList-Verhalten

- Medikamenten-/Algorithmenliste: `keyExtractor`, `ListHeaderComponent`, `ListEmptyComponent`, `ItemSeparatorComponent`, `removeClippedSubviews`, `initialNumToRender` / `windowSize` gesetzt.
- Suche: `FlatList` mit `contentContainerStyle.gap`; **`keyboardShouldPersistTaps="handled"`** ergänzt (kleine Korrektur, s. unten).

### Touch-Ziele (Mindesanforderung)

- Home-Kacheln: `minHeight` 88.
- `LookupListRow`: Standard-`minHeight` 96.
- `DetailLinkRow`: Default `minHeight` 56.
- Such-Filter-`Tag`: **`minHeight: 44`** + `justifyContent: 'center'` ergänzt (Korrektur).

### Lesbarkeit kritischer Blöcke (Detail)

- Dosierung: eigener Abschnitt mit `WarningCard` (`tone="dosage"`).
- Algorithmus-Warnung: `WarningCard` mit `prominent`.
- Schritte: `DetailStepList`; Querverweise: `DetailCrossRefList`.

---

## 4. Sichtprüfung (statisch / Code)

| Kriterium | Befund |
|-----------|--------|
| Abgeschnittene Texte | `LookupListRow`-Untertitel `numberOfLines={3}`; lange Titel mit `flexShrink: 1` (Korrektur). Vollständige optische Prüfung nur auf Gerät sinnvoll. |
| Überlappende Karten | **Korrektur:** `LookupListRow` legte `leading` (`ContentBadge`) fälschlich **über** Titel/Untertitel in einer Spalte; jetzt **nebeneinander** (`rowBody` horizontal + `textCol`). Reduziert Layout-Fehler mit gestapelten Karten. |
| ZIP-Reste im UI-Wording | `grep` über `src` auf ZIP/DoctorGo/UI8 etc.: **keine Treffer**; sichtbare Strings ResQBrain-/Bundle-orientiert. |

---

## 5. Behobene Kleinigkeiten (im Zuge der Validierung)

1. **`LookupListRow`:** `leading` links von Titel/Untertitel; `textCol` mit `minWidth: 0` für korrektes Schrumpfen; Titel `flexShrink: 1`.
2. **`SearchScreen`:** `FlatList` `keyboardShouldPersistTaps="handled"`; Filter-`Tag`-Styles `minHeight: 44` und vertikale Zentrierung.

---

## 6. Restrisiken / offene manuelle Schritte

- **Tastatur vs. Layout auf Suche:** kein `KeyboardAvoidingView` — auf kleinen Geräten ggf. manuell prüfen, ob Eingabefeld + Liste genug Platz haben.
- **End-to-End-Smoke** auf iOS/Android durch Nutzer/QA wie unter Abschnitt 2 empfohlen.

---

## Kurzfazit

| Prüfung | Status |
|---------|--------|
| `tsc --noEmit` | **PASS** |
| Navigation (strukturell) | **PASS** |
| EmptyStates / Chevrons / Scroll & FlatList (Review) | **PASS**, mit zwei kleinen Korrekturen |
| UI-Wording frei ZIP-Altlasten in `src` | **PASS** |
| Geräte-Smoke | **Ausstehend** (empfohlen) |
