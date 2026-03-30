# Mobile-App: Zielstruktur für ZIP-UI-Übernahme

Geltungsbereich: **`apps/mobile-app/src/`** nur. Bestehende Screen-Dateinamen und Navigationsrouten bleiben unverändert. Keine Anpassungen an Website, `data/lookup-seed`, oder `packages/domain`.

---

## Neue Zielstruktur (Ist im Repo angelegt)

```text
apps/mobile-app/src/
├── assets-adopted/          # optional übernommene Bilder/Illustrationen (ZIP + Lizenz)
├── components/
│   ├── common/              # primitive Bausteine
│   ├── cards/               # kartenförmige Content-Zellen
│   └── layout/              # Screen-Rahmen, modale Hüllen
├── theme/
│   └── index.ts             # Design-Tokens (COLORS, SPACING, TYPOGRAPHY, CARD)
├── ui/
│   └── theme.ts             # Re-Export → `@/theme` (bestehende Imports @/ui/theme unverändert)
├── navigation/
├── screens/                 # unbenannt; Komposition nutzt components + theme
├── lookup/
├── data/
├── types/
└── utils/
```

---

## Zweck je Ordner

| Pfad | Zweck |
|------|--------|
| `src/theme/` | **Single source of truth** für Farben, Abstände, Typo, Karten-Basisstyles. Erweiterungen (z. B. ZIP-Referenzfarben, Dark Mode) nur hier konsolidieren. |
| `src/components/common/` | Kleine, domänen-neutrale UI-Teile: Buttons, Badge/Tag, Label, Avatar, Eingaben, Akkordeon, leere Zustände, ggf. modale Basis — umgesetzt mit `StyleSheet` + `@/theme`, **nicht** mit NativeWind aus der ZIP. |
| `src/components/cards/` | Wiederkehrende **Karten-Layouts** für Listen und Kurzinfos (z. B. Medikamentenzeile, Algorithmus-Kachel). Keine DoctorGo-Fachkarten (Arzt, Termin, Warenkorb) 1:1. |
| `src/components/layout/` | `SafeAreaView`-Hülle, konsistente Screen-Padding, optional **interner** Screen-Header mit `navigation.goBack()` (kein `expo-router`). Bottom-Sheet-/Modal-Wrapper nur wenn productiv benötigt. |
| `src/assets-adopted/` | Abgelegte Assets aus der UI8-ZIP **nach Lizenzcheck** (z. B. generische `empty`-Illustration). App-Icon/Splash bleiben unter `apps/mobile-app/assets/` (Expo-Config). Import in Code z. B. via `require('@/assets-adopted/…')` sobald Dateien liegen (Metro/Alias wie bisher `@/*` → `src/*`). |

---

## Mapping: DoctorGo (ZIP) → Zielordner

Angelehnt an `docs/planning/mobile-app-zip-integration-audit.md`. Namen links = Original unter `hk-doctorgo-main/components/`.

### `src/components/common/`

| ZIP-Komponente | Anmerkung zur Portierung |
|----------------|---------------------------|
| `button-primary.tsx`, `button-secondary.tsx`, `button-outline.tsx` | API vereinfachen; Styles aus Tailwind-Klassen in `StyleSheet` + Tokens übersetzen. |
| `badge.tsx`, `tag.tsx`, `label.tsx` | Übernehmbar als reine Darstellung. |
| `avatar.tsx` | Optional; ohne angebundene Profil-/Auth-Logik aus DoctorGo. |
| `rating.tsx` | Nur falls im Produkt benötigt. |
| `input-text.tsx`, `checkbox.tsx`, `radio-group.tsx`, `dropdown.tsx` | Nur bei echten Formular-Anforderungen; ohne `react-hook-form`-Pflicht aus der ZIP. |
| `accordion.tsx` | Für lange Texte/FAQ-artige Blöcke geeignet. |
| `modal.tsx`, `modal-coming-soon.tsx` | Generische Modal-Hülle sinngemäß; Texte/Flows ResQBrain. |
| `modal-upload.tsx`, `modal-dependant.tsx` | **Normalerweise nicht** — zu nah an DoctorGo-Domäne. |
| `no-data.tsx` | Leerer Zustand — Inhalt und Bild aus `assets-adopted` / bestehendem Branding. |
| `step-item.tsx` | Nur für explizite Wizard-UX. |
| `tab-item.tsx` | Nur wenn eigenes segmentiertes Layout **innerhalb** eines Screens (nicht Tab-Navigator ersetzen). |
| `setting-item.tsx` | Falls später Einstellungen-Screens; sonst weglassen. |
| `notification-indicator.tsx`, `show-password.tsx` | Bedarfsgesteuert. |
| `quick-favorite.tsx` | Typisch DoctorGo — nur übernehmen, wenn Produkt „Favoriten“ definiert. |

### `src/components/cards/`

| ZIP-Komponente | Anmerkung |
|----------------|-----------|
| `card-doctor.tsx`, `card-consultant.tsx`, `card-appointment.tsx`, `card-book.tsx` | **Nicht** für MVP-Content-Lookup; höchstens als Layout-Idee für „Expertenkarte“ (meist **C**). |
| `card-health-record.tsx`, `card-healthplan.tsx`, `card-dependant.tsx`, `card-membership.tsx` | **Nicht übernehmen** (falsche Domäne). |
| `card-marketplace.tsx` | **Nicht übernehmen**. |
| *Neu zu modellieren* | `MedicationRowCard`, `AlgorithmRowCard` o. ä. für `MedicationListScreen` / `AlgorithmListScreen` — inspiriert von ZIP-Spacing, ohne Fachinhalt aus DoctorGo. |

### `src/components/layout/`

| ZIP-Komponente | Anmerkung |
|----------------|-----------|
| `container.tsx` | Vorbild für `ScreenContainer`: `SafeAreaView`, horizontales Padding, Hintergrund aus `@/theme`. |
| `header.tsx` | Vorbild für `ScreenHeader`: **kein** `useRouter` von expo-router; `navigation` Props oder Hooks von `@react-navigation/native`. |
| `bottom-sheet.tsx` | Nur bei Bedarf; neue Dependency (`react-native-modal` o. ä.) bewusst entscheiden. |
| `tab-container.tsx` | Segment-Control innerhalb Screen, nicht mit `AppNavigator`-Tabs verwechseln. |
| `carousel.tsx`, `carousel-onboarding.tsx` | Schwerer gewichtet; nur wenn Marketing/Onboarding es verlangt — sonst weglassen. |

### `src/theme/`

| ZIP-Quelle | Anmerkung |
|------------|-----------|
| `tailwind.config.js` (`primary`, `secondary`, Font-Namen) | Werte **manuell** nach `COLORS` / künftigen `FONTS`-Konstanten übernehmen, kein Tailwind-Stack. |
| `global.css` | Nicht importieren; nur als Token-Referenz. |

### `src/assets-adopted/`

| ZIP-Quelle | Anmerkung |
|------------|-----------|
| `assets/images/empty.png`, `not-found.png` | Kandidaten für Listen ohne Treffer (Lizenz). |
| Kategorie-Illustrationen (Zahnarzt, Marketplace, …) | **Nicht** übernehmen — falsche Semantik für ResQBrain. |
| `assets/fonts/*` | Optional separates Thema; Rubik etc. nur mit Lizenz und `expo-font`-Integration. |

---

## Bewusst **nicht** übernommen (keine Zielordner, kein Mischen)

- Gesamte **`app/`**-Navigation (Expo Router) und alle Screen-Routen der ZIP.
- **`store/*`** (Zustand), **`utils/auth-context.tsx`**, **`data/common.ts`**, **`types/common.ts`** (DoctorGo-Domäne).
- Marketplace, Booking, Wallet, Membership, Warenkorb, Gesundheitsakten-spezifische UI.
- NativeWind / Tailwind / `className`-basierte Komponenten **unverändert** einkopieren.
- Ersetzen oder Umbenennen bestehender ResQBrain-Screens (`HomeScreen`, `SearchScreen`, Listen/Details) — sie **konsumieren** künftig Bausteine aus `components/*` und `@/theme`.

---

## Import-Konventionen (kurz)

- Design-Tokens: `import { COLORS, SPACING } from '@/theme'` (neu) oder weiter `from '@/ui/theme'` (gleicher Export).
- UI-Bausteine: `import { … } from '@/components/common'` (wenn Barrel-Exporte ergänzt werden) oder direkte Pfade pro Datei.
- Adoptierte Medien: unter `src/assets-adopted/` ablegen; keine Vermischung mit Expo-Root-`assets/` für App-Icons.

---

## Verifiziert im Repo

- Ordner und Platzhalter: `src/components/{common,cards,layout}/index.ts`, `src/theme/index.ts`, `src/assets-adopted/.gitkeep`.
- `src/ui/theme.ts` re-exportiert `@/theme`; bestehende Screen-Imports `@/ui/theme` bleiben gültig.
- `tsconfig.json` schliesst `ui8` (ZIP-Referenz-Extrakt) aus, damit `tsc` nur die ResQBrain-Mobile-Sources prüft.
