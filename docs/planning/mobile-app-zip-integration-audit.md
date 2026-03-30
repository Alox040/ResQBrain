# Mobile-App: ZIP-Referenz (UI8 / DoctorGo) — Integrationsaudit

**Referenzquelle (lokal):** `apps/mobile-app/ui8/doctorgo-1-2-0_*.zip` → entpackt: `hk-doctorgo-main` (DoctorGo v1.2.0, Expo-Template mit `expo-router`).  
**Ziel-App:** `apps/mobile-app` (ResQBrain Mobile, Expo ~54, `@react-navigation/*`, keine Expo Router / kein NativeWind im Ist-Zustand).

**Rahmen:** Die ZIP dient ausschließlich als UI-/UX- und Komponenteninspiration. **Nicht** als zweite App einbinden. **`AppNavigator.tsx`, Lookup (`src/lookup/*`), `contentIndex` und bestehende Screen-Logik bleiben führend** — keine Navigation oder Datenflows aus der ZIP übernehmen.

---

## Kurzfazit

DoctorGo ist ein **anderer Produktkontext** (Telemedizin, Marketplace, Booking, Auth-Onboarding) auf **Expo 53 + expo-router + NativeWind v4 + Zustand + Tabler Icons + i18n**. ResQBrain Mobile ist **minimaler Stack** (React Navigation, `StyleSheet`, zentrales `theme.ts`). Es gibt **keine nennenswerten „Copy-Paste“-Komponenten** ohne Stack- oder Import-Anpassung.

**Sinnvoller Nutzen für ResQBrain:** visuelle Patterns (Primärfarbe, Karten/Listenrhythmus, Tab-Bar-Höhe, leere Zustände), **vereinzelte primitive Bausteine** nach Portierung auf `theme.ts` + React Navigation, und **generische Assets** (z. B. `empty.png`, ggf. Illustrationen), sofern **Lizenz/Kaufnachweis** der UI8-Datei geklärt ist.

**Größtes Risiko:** NativeWind/Tailwind und `expo-router` in die bestehende App zu ziehen, nur um DoctorGo-Komponenten zu nutzen — **Überengineerung** gegenüber dem aktuellen Phasenmodell; besser **manuelle Übersetzung** der Layoutregeln in `StyleSheet` / `theme.ts`.

---

## Klassifikation (alle relevanten Bereiche)

Legende:

1. **Gruppe A — Direkt übernehmbar:** ohne fachlichen Bruch nutzbar (evtl. nur physischer Dateipfad / keine Abhängigkeit vom DoctorGo-Stack).
2. **Gruppe B — Nur nach Anpassung übernehmbar:** Logik oder UI portieren (andere Navigation, kein `className`, andere Icons, Theme).
3. **Gruppe C — Nicht übernehmen:** fremdes Domänenmodell, paralleler Navigationsstack oder MVP-fremde Features.

### Komponenten (`DoctorGo/components/*`, 43 Dateien)

| Komponente(n) | Gruppe | Kurzbegründung |
|---------------|--------|----------------|
| Primitive: `container`, `badge`, `tag`, `label`, `rating`, `avatar` (nur Darstellung) | **B** | Nutzen `className`/NativeWind, teils `expo-router` (z. B. `header`), Tabler-Icons — nach `theme.ts` + `Pressable`/`View` nachbauen |
| Buttons: `button-primary`, `button-secondary`, `button-outline` | **B** | Kernidee übernehmbar; heute `clsx` + Tailwind-Klassen, ResQBrain nutzt `StyleSheet` |
| Form: `input-text`, `checkbox`, `radio-group`, `dropdown` | **B** | Stark an DoctorGo-Styling und ggf. `react-hook-form`/Drittanbieter gekoppelt; für ResQBrain nur bei Bedarf selektiv portieren |
| Layout/Listen: `accordion`, `tab-container`, `tab-item`, `step-item`, `setting-item`, `notification-indicator` | **B** | Patterns nützlich; technisches Binding an NativeWind |
| Feedback: `modal`, `modal-*`, `bottom-sheet` | **B** | `react-native-modal` + i18n-Texte; neue Dependency nur bei echtem Bedarf |
| `carousel`, `carousel-onboarding`, `pinar` | **B** | Carousel-Library + Animation; optional, nicht MVP-kritisch |
| `calendar` + `react-native-calendar-picker` | **B** | Nur relevant, wenn ResQBrain Kalender-UI braucht (aktuell nicht Lookup-kern) |
| `card-*` (appointment, doctor, marketplace, health-*, …) | **C** für Domäne / **B** für „generische Karte“ | Inhalte sind DoctorGo-spezifisch; abstrahierte „Card mit Bild + Titel + Meta“ evtl. **B** |
| `marketplace-bestsellers`, `quick-favorite` | **C** | Produktlogik DoctorGo |
| `header` | **B** | Nutzt `useRouter` von `expo-router`; in ResQBrain: `navigation.goBack()` aus `@react-navigation/native` |
| `tab-bar-icon` | **B** | Nur sinngemäß: aktive/filled Icons — **ResQBrain behält** `BottomTabNavigator`-Konfiguration in `AppNavigator.tsx` |
| `no-data` | **B** | Leerer Zustand sinnvoll; Texte/Bild an ResQBrain anpassen |

### Styles

| Bereich | Gruppe | Kurzbegründung |
|---------|--------|----------------|
| `global.css` + `tailwind.config.js` + NativeWind-Preset | **C** als Stack / **B** als Referenz | Gesamtkit nicht übernehmen; **Farb- und Abstandswerte** (z. B. Primary `#514DDF`, Secondary `#2AEEC8`, `px-6` ≈ 24px) manuell in `src/ui/theme.ts` ableiten |
| `dark:`-Varianten | **B** | DoctorGo: class-basiertes Dark Mode; ResQBrain: derzeit feste Palette — Theme-Erweiterung nötig, falls gewünscht |

### Assets (`DoctorGo/assets/fonts`, `images`, …)

| Bereich | Gruppe | Kurzbegründung |
|---------|--------|----------------|
| Schriftarten Rubik/Roboto/Poppins (.ttf) | **B** | Technisch über `expo-font` nutzbar; **Lizenz prüfen**; aktuell nutzt ResQBrain System-Fonts über `StyleSheet` |
| App-Icon / Splash / Adaptive Icon | **C** | ResQBrain-Branding bleibt massgeblich; nicht tauschen ohne Produktentscheid |
| Illustrationen (Kategorien, `empty.png`, `not-found.png`, Onboarding `one/two/three.png`) | **A** (unter Lizenz) / sonst **C** | Generisch nutzbar für Empty States; Fach-Illustrationen (Zahnarzt, Marketplace-Produkte) **C** für ResQBrain-Kontext |
| `data/images.ts` als zentraler Importbaum | **C** | Eng an DoctorGo-Demo gebunden |

### Navigation (`DoctorGo/app/**`, Expo Router)

| Bereich | Gruppe | Kurzbegründung |
|---------|--------|----------------|
| Gesamte `app/` File-Based-Routing-Struktur | **C** | Widerspricht **führender** `AppNavigator.tsx` + typisierten ParamLists |
| Tab-Namen (Home, Discover, Activity, More) | **C** | Andere IA als ResQBrain (Home, Suche, Medikamente, Algorithmen) |
| Auth-, Onboarding-, `protected`-Gruppen | **C** | Nicht Teil des aktuellen ResQBrain-Mobile-MVP laut bestehendem Code |

### State Stores (`DoctorGo/store/*`: auth, user, settings, cart, product, booking, appointment, health)

| Store | Gruppe | Kurzbegründung |
|-------|--------|----------------|
| `auth`, `user` | **C** | Demo-Login / Profil-Mock — nicht ohne Produkt-Auth-Konzept |
| `cart`, `product`, `booking`, `appointment`, `health` | **C** | Fremdes Domänenmodell |
| `settings` (z. B. Theme) | **B** | Könnte später für Appearance relevant sein; heute kein Store in ResQBrain-Mobile nötig |

### Utilities

| Datei / Inhalt | Gruppe | Kurzbegründung |
|----------------|--------|----------------|
| `utils/common.ts` — `getGreetingTime(t)` | **B** | Logik trivial; `t` aus i18n durch feste deutsche Strings oder eigenes i18n ersetzen |
| `utils/common.ts` — `generateTimeSlots` | **C** | Nur für DoctorGo-Booking |
| `utils/auth-context.tsx` | **C** | Parallel zu künftigem Auth; nicht übernehmen |
| `clsx` + className-Komposition | **B** → eher **theme** | In ResQBrain optional kleine `cn`-Helfer nur sinnvoll mit NativeWind; ohne NativeWind: `StyleSheet` / Arrays |

### Screen-Struktur

| Bereich | Gruppe | Kurzbegründung |
|---------|--------|----------------|
| Alle DoctorGo-Screens unter `app/` | **C** als Ganzes | Falsche Flows und Routen |
| UX-Ideen (Hero, Quick Actions horizontal, Sektionen mit Abstand 24) | **B** | Auf bestehende `HomeScreen`, `SearchScreen`, List/Detail-Screens **übertragen**, ohne Dateien zu kopieren |

### Abhängigkeiten (`DoctorGo/package.json` Auszug vs. ResQBrain)

**ResQBrain heute:** `expo`, `react-navigation` (tabs + native-stack), `react-native-safe-area-context`, `react-native-screens`.

**DoctorGo zusätzlich u. a.:** `expo-router`, `nativewind`, `tailwindcss`, `zustand`, `@tabler/icons-react-native`, `react-i18next` + `i18n-js`, `react-native-reanimated`, `react-native-gesture-handler`, `react-native-modal`, `react-native-svg`, `pinar`, `dayjs`, `zod`, `react-hook-form`, diverse Expo-Module (blur, image-picker, webview, …).

| Dependency-Cluster | Gruppe | Kurzbegründung |
|-------------------|--------|----------------|
| `expo-router` | **C** | Navigation bereits gelöst |
| `nativewind` + `tailwindcss` | **C** (empfohlen) | Hoher Integrations- und Wartungsaufwand vs. aktuelles `theme.ts` |
| `zustand` | **B** | Nur bei nachgewiesenem globalen UI-State (z. B. Settings); sonst vermeiden |
| `@tabler/icons-react-native` | **B** | Alternative zu `@expo/vector-icons`; neue Dependency nur bei Design-Vorgabe |
| `react-native-reanimated` | **B** | Für Micro-Animationen; Expo-Kompatibilität mit RN 0.81 prüfen vor Hinzufügung |
| `react-i18next` | **B/C** | Erst wenn ResQBrain Mobile mehrsprachig wird — nicht aus DoctorGo-`locales` übernehmen |

---

## Empfohlene Übernahmen (priorisiert)

1. **Visuelle Tokens:** Primär-/Sekundärfarben und Kartenränder aus DoctorGo als **Referenz** in `src/ui/theme.ts` mappen (kein 1:1-Zwang; Abstimmung mit ResQBrain Branding).
2. **Layout-Rhythmus:** horizontale Quick-Actions, Sektionsabstände (~24), Tab-Bar-Höhe (~80) — in bestehenden Screens per `StyleSheet` nachstellen.
3. **Empty / Not-found States:** Konzept von `no-data` + generische Bilder (`empty.png` / `not-found.png`) unter **lizenzierter** Nutzung; Texte deutsch und inhaltsbezogen (Lookup/Listen).
4. **Primitive UI (neu implementiert):** „Button-Varianten“, kompakte „Tag/Badge“, optional „Section Header“ — als **eigene** kleine Komponenten unter `src/ui/`, an `theme.ts` gebunden, **ohne** NativeWind.
5. **Icons:** Statt voll Tabler optional `@expo/vector-icons` nutzen (bereits Expo-Ökosystem) und DoctorGo nur als **Silhouette/Weight**-Referenz.

---

## Riskante Übernahmen

- **NativeWind + Tailwind in ResQBrain-Mobile nachziehen**, nur um DoctorGo-Komponenten zu recyclen → Bruch mit schlankem Stack, Duplikat-Designsystem neben `theme.ts`.
- **expo-router einführen** → Migration aller Screens/Routen; kollidiert mit der Vorgabe „bestehende Navigation bleibt führend“.
- **Zustand-Stores und `data/common.ts`** übernehmen → schleicht DoctorGo-Fachmodell und Mock-Daten ein.
- **Karussell / Marketplace / Booking / Wallet / Membership-Screens** → Scope-Creep für EMS-Content-Lookup-MVP.
- **Fonts en masse** ohne Lizenzprüfung und ohne Performance-/Bundle-Abwägung.

---

## Ausschlussliste (nicht integrieren)

- Gesamter Ordner `DoctorGo/app/` (File-Based Routing, Auth, Onboarding, Protected Areas).
- `DoctorGo/store/*` (komplett), `DoctorGo/utils/auth-context.tsx`.
- `DoctorGo/data/common.ts` (großer Demo-Katalog), `DoctorGo/types/common.ts` (DoctorGo-Domaintypen).
- Marketplace-/Booking-/Cart-/Wallet-/Membership-spezifische Komponenten und Bilder.
- Ersetzen von ResQBrains `AppNavigator` oder Lookup-Pipeline durch DoctorGo-Strukturen.
- Produkt-App-Icons und Splash aus DoctorGo ohne explizite Brand-Entscheidung.

---

## Konkrete Zielpfade in `apps/mobile-app/src/` (bei schrittweiser Umsetzung)

| Zielpfad | Zweck |
|----------|--------|
| `src/ui/theme.ts` | Farben, Abstände, Radii, ggf. Dark-Mode-Erweiterung (aus DoctorGo nur als Referenz) |
| `src/ui/components/` *(neu, optional, flach halten)* | `PrimaryButton`, `OutlineButton`, `Badge`, `Tag`, `SectionHeader`, `EmptyState` — alles ohne `expo-router` |
| `src/ui/fonts/` *(optional)* | Nur wenn Rubik o. ä. festgelegt: `useFonts`-Hook in bestehenden Entry-Layer, nicht in Domain |
| `assets/reference-ui8/` *(optional)* | Kopien freigegebener Bilder (z. B. Empty State), **nicht** den gesamten DoctorGo-`assets`-Baum |
| Bestehende Screens: `src/screens/HomeScreen.tsx`, `SearchScreen.tsx`, `*ListScreen.tsx`, `*DetailScreen.tsx` | Layout/UX-Anpassungen; **Navigation und Datenfluss unverändert führend** |
| `src/index.js` / Root (falls vorhanden) | Nur für globale Provider (z. B. Fonts, Theme) — **kein** expo-router Root Layout |

**Hinweis zum Arbeitsbaum:** Zur Analyse kann die ZIP nach `apps/mobile-app/ui8/_extracted/` entpackt worden sein. Das ist **kein Lieferumfang** der ResQBrain-App; Release/CI sollte nur das ZIP oder eine kurze `README` in `ui8/` versionieren, nicht den gesamten DoctorGo-Quellbaum, solange es reine Referenz bleibt.

---

## Verifizierte Fakten vs. Annahmen

**Strukturell / dateibasiert verifiziert:**

- DoctorGo: `package.json` mit `expo-router`, `nativewind`, `zustand`, ~43 Komponenten, ~44 `app/*.tsx` Screens, Stores unter `store/`, Assets unter `assets/`.
- ResQBrain Mobile: `AppNavigator` mit Tabs + Native Stacks; `src/ui/theme.ts` mit `COLORS` / `SPACING` / `TYPOGRAPHY`; Screens nutzen `StyleSheet`.

**Annahmen (bitte bei Lizenz und Roadmap verifizieren):**

- UI8/Kaufdeckung erlaubt Übernahme einzelner Assets und Code-Snippets in ResQBrain.
- MVP bleibt auf organisationsspezifischem Content-Lookup fokussiert — keine Parität mit DoctorGo-Featureumfang.
