# Mobile-App: Dependency-Diff ZIP (DoctorGo) vs. ResQBrain

**Quelle ZIP:** `doctorgo` v1.2.0 — Expo **53.0.9**, React Native **0.79.2**, React **19.0.0**, Entry `expo-router/entry`.  
**ResQBrain:** `apps/mobile-app` — Expo **~54.0.33**, RN **0.81.5**, React **19.1.0**, Entry klassisch (`main: index.js`), Navigation **nur** `@react-navigation/*` v6.

**Prämisse:** Keine 1:1-Übernahme des DoctorGo-Stacks. Bewertung für **selektive** Ergänzung unter Beibehaltung von `AppNavigator.tsx` und `StyleSheet` + `@/theme`.

---

## Kurzfazit

- **Grösster Lock:** `expo-router` + zweite Navigationsschicht — **nicht** mit bestehender React-Navigation kombinieren.  
- **Grösster Styling-Graben:** `nativewind` + `tailwindcss` — widerspricht der geplanten Token/`StyleSheet`-Linie (siehe `mobile-app-zip-target-structure.md`).  
- **Versionslücke:** DoctorGo pinned Expo **53** / RN **0.79**; ResQBrain ist **SDK 54** / RN **0.81**. ZIP-Paketversionen **nicht** blind übernehmen — bei Bedarf immer **`npx expo install <pkg>`** unter SDK 54 erneut auflösen.  
- **Sinnvolle Minimal-Ergänzung** für UI aus der ZIP ohne Architekturbruch: vor allem **Expo-first**-Hilfen (`@expo/vector-icons`, `expo-haptics`); alles andere **bedarfsgesteuert**.

---

## 1. Übernehmen (sinnvoll, geringe Kollisionsgefahr)

Pakete, die zum aktuellen ResQBrain-Stack passen und häufig für DoctorGo-ähnliches UI nützlich sind, **ohne** Router/NativeWind/ globalen State zu erzwingen.

| Paket | Rolle | Hinweis |
|-------|--------|---------|
| `@expo/vector-icons` | Icons (Material, Ionicons, …) | Expo-Standard; Version durch `npx expo install` an SDK 54 binden. |
| `expo-haptics` | Leichtes haptisches Feedback | Kleines natives Modul, gut für Buttons/Listenzellen. |

*Hinweis:* `expo-font` ist **übernehmbar**, sobald Custom Fonts (z. B. Rubik aus der ZIP) produktiv werden — bis dahin optional weglassen.

---

## 2. Optional prüfen (bedarfsgesteuert, vor Install abstimmen)

| Paket | Rolle | Prüfkriterium |
|-------|--------|----------------|
| `expo-font` | Custom Fonts | Nur bei finaler Typografie/Brand-Entscheidung. |
| `expo-splash-screen` | Splash-Steuerung | ResQBrain nutzt statische `app.json`-Splash; Library nur bei programmatischem Ablauf. |
| `expo-linking` | Deep Links / URL-Öffnung | Wenn Kanäle aus Website/Docs verlinkt werden (ohne expo-router). |
| `expo-constants` | Build-/Umgebungskonstanten | Wenn Feature-Flags oder `extra` aus `app.config` gelesen werden. |
| `expo-web-browser` | In-App-Browser (z. B. Rechtstexte) | Wenn externe URLs sicher eingebettet werden sollen. |
| `expo-blur` | Blur-Hintergründe | Reines UX-Upgrade; natives Modul. |
| `expo-image-picker` | Bildauswahl | Nur wenn Medien-Upload zum Produkt gehört. |
| `expo-localization` | Locale / Kalender | Vorstufe zu i18n ohne gleich `react-i18next` zu ziehen. |
| `expo-system-ui` | Status-Bar / Navigation-Bar-Farben | Feinjustierung neben `expo-status-bar`. |
| `expo-status-bar` | Bereits anders versioniert in ResQBrain | Bei Feature-Parität nur über `expo install` auf SDK-53-kompatible Zeile bringen — **kein** Mix aus DoctorGo- und ResQBrain-Pins ohne Abgleich. |
| `dayjs` | Datum/Zeit formatieren | Klein; nur wenn wirklich Datums-UI kommt (DoctorGo: Slots). |
| `zod` | Schema-Validierung | Sinnvoll mit Formularen oder API-Payloads; ohne Forms oft entbehrlich. |
| `zustand` | Globaler Client-State | Nur wenn Props/Context nicht reichen; nicht für Lookup-Index (bleibt fachlich separat). |
| `react-native-reanimated` | Animation | DoctorGo nutzt es stark; in ResQBrain nur bei gezielter Motion — **SDK-54-kompatible** Version per `expo install`. |
| `react-native-gesture-handler` | Gesten | Häufig Pflichtbegleiter zu Reanimated; ebenfalls `expo install`. |
| `react-native-svg` | SVG-Grafiken | Wenn Icons/Grafiken als SVG statt PNG. |
| `clsx` | String-Zusammenfügung | Kaum nötig ohne `className`; eher **nicht** priorisieren. |
| `@react-native-async-storage/async-storage` | Persistenz lokal | Für Settings/Flags; mit `zustand/persist` kombinierbar — Datenmenge und Tenancy beachten. |
| `@react-native-community/netinfo` | Online/Offline | Nur bei Offline-UX geplant. |
| `react-native-modal` | Modals (DoctorGo: RC `14.0.0-rc.1`) | **Version** und RN-0.81-Kompatibilität prüfen; ggf. alternatives Pattern (`Modal` aus RN). |
| `@tabler/icons-react-native` | Icon-Set wie in ZIP | Zusatz-Dependency; **Alternative:** `@expo/vector-icons` bereits unter „Übernehmen“. |
| `react-hook-form` + `@hookform/resolvers` | Formulare | Erst bei echten Eingabe-Flows (Login später, Profil, …). |
| `react-i18next` (+ `i18n-js` in DoctorGo) | Mehrsprachigkeit | DoctorGo mischt Pakete; für ResQBrain eigene i18n-Strategie definieren, nicht 1:1 übernehmen. |

---

## 3. Nicht übernehmen (Zweck oder Architektur passt nicht)

| Paket | Grund |
|-------|--------|
| `expo-router` | Zweiter Navigations-Entry; Konflikt mit führendem `AppNavigator` / Stack-ParamLists. |
| `nativewind` | Tailwind auf RN; parallel zu `@/theme` + `StyleSheet` — doppeltes System. |
| `tailwindcss` | Build-Kette für NativeWind; nicht nötig bei Token-Strategie. |
| `pinar` | Karussell-Library; Scope nur wenn Produkt Karussell braucht. |
| `react-native-web` / `react-dom` | Web-Target für DoctorGo; nur bei explizitem ResQBrain-Web/Mobile geteiltem Code. |
| `react-native-calendar-picker` + `@types/react-native-calendar-picker` | DoctorGo Booking; kein Kern des aktuellen Lookup-MVP. |
| `react-native-bouncy-checkbox` | Styling-Detail; durch einfache `Pressable`/`Switch` ersetzbar. |
| `react-native-country-flag` | DoctorGo-spezifisch. |
| `react-native-element-dropdown` | Kann später durch einfaches RN-Pattern ersetzt werden; keine vorschnelle Abhängigkeit. |
| `expo-symbols` | SF-Symbols-Fokus; optional und iOS-lastig — erst bei Designvorgabe. |
| `eslint`, `eslint-config-expo`, `prettier`, `eslint-plugin-prettier`, `eslint-config-prettier` in **dependencies** (DoctorGo) | Gehören nach **devDependencies**; getrennt von Runtime-Übernahme. |

**Hinweis:** `@react-navigation/bottom-tabs` / `native` in DoctorGo sind **v7**; ResQBrain bleibt bewusst auf **v6**, bis eine Migration geplant ist — DoctorGo-Versionen **nicht** einmischen.

---

## 4. Konfliktverdächtig (hoher Integrations- oder Versionsrisiko)

| Thema | Risiko |
|--------|--------|
| **expo-router + React Navigation** | Zwei Welten: Routen, Deep-Linking, Types — führt zu doppelter Wahrheit. |
| **NativeWind + bestehendes Theme** | Styling-Split, grössere Bundle-/Metro-Konfiguration. |
| **React Navigation 6 (Ist) vs. 7 (ZIP)** | Major-Sprung; peer dependencies und Breaking Changes prüfen, nicht teilweise mischen. |
| **RN 0.81 (ResQBrain) vs. 0.79 (ZIP)** | Native Module aus der ZIP müssen gegen **0.81** und **Expo-SDK-54-Matrix** validiert werden. |
| **`react-native-modal` RC** | Release-Candidate in DoctorGo; für Produkt riskant ohne Pin-Review. |
| **Reanimated + Gesture Handler** | Korrekte Babel-/Plugin-Reihenfolge und `expo install`-Versionen nötig; sonst Runtime-Crashes. |
| **`react-native-screens` / `react-native-safe-area-context`** | Bereits in ResQBrain; zweite Versionierung über ZIP-Imports kann Peer-Warnungen erzeugen. |

---

## Schnellvergleich (nur markant)

| Bereich | ResQBrain (`apps/mobile-app`) | DoctorGo (ZIP) |
|---------|------------------------|----------------|
| Navigation | `@react-navigation/*` **6.x** | **7.x** + `expo-router` |
| Styling | `StyleSheet`, `@/theme` | NativeWind + Tailwind |
| State | (kein globales Lib) | `zustand` + AsyncStorage |
| Forms | — | `react-hook-form`, `zod`, resolvers |
| i18n | — | `react-i18next`, `i18n-js`, `expo-localization` |
| Icons | — (implizit evtl. Expo) | `@expo/vector-icons`, `@tabler/icons-react-native` |
| Animation | — | `reanimated`, `gesture-handler` |
| Native Extras | minimal | Blur, ImagePicker, WebView, Haptics, … |

---

## Konkreter Install-Vorschlag (nicht ausgeführt)

Nur **zusätzliche** Pakete mit klarem Nutzen für DoctorGo-ähnliches UI **ohne** Router/NativeWind/State-Stack. Versionen durch Expo auflösen:

```bash
cd apps/mobile-app
npx expo install @expo/vector-icons expo-haptics
```

Optional **danach** (eigenes Ticket), wenn Fonts verbindlich:

```bash
npx expo install expo-font
```

**Nicht** Teil dieses Blocks: `nativewind`, `tailwindcss`, `expo-router`, `zustand`, `react-hook-form`, `@tabler/icons-react-native`, `react-native-reanimated` (erst nach Architekturentscheid Animation).

---

## Verifiziert / Annahmen

- **Dateibasiert:** Inhalte der beiden `package.json` (ResQBrain `apps/mobile-app`, DoctorGo Root in ZIP) Stand der Analyse.  
- **Annahme:** Expo SDK **54** bleibt Leitplank für alle neuen Installationen; konkrete aufgelöste Semvers kommen aus `npx expo install`.  
- **Keine Installation** im Rahmen dieser Aufgabe ausgeführt.
