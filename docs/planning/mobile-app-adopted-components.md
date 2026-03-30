# Mobile-App: Übernommene UI-Komponenten (DoctorGo / UI8 → ResQBrain)

**Quelle:** `apps/mobile-app/ui8/…zip` → `hk-doctorgo-main/components/*` (DoctorGo, NativeWind + expo-router).  
**Ziel:** Prop-basierte, generische Bausteine ohne Auth/Marketplace/Stores/Router — umgesetzt mit **`StyleSheet` + `@/theme`** und **`@expo/vector-icons`**.

**Dependency:** `@expo/vector-icons` (pnpm: `pnpm add @expo/vector-icons --filter resqbrain-mobile`; Version an Expo 54 angepasst).

---

## Übersicht

| Original (ZIP) | Neuer Pfad | Status | Anpassungen (kurz) |
|----------------|------------|--------|---------------------|
| `button-primary.tsx` | `src/components/common/ButtonPrimary.tsx` | **übernommen / angepasst** | `text` → `label`; keine `className`; Tokens aus `@/theme` |
| `button-secondary.tsx` | `src/components/common/ButtonSecondary.tsx` | **übernommen / angepasst** | `label`; fixer Typ (kein fehlendes `className`); Styles portiert |
| `button-outline.tsx` | `src/components/common/ButtonOutline.tsx` | **übernommen / angepasst** | Kein `clsx`; `variant` typisiert; `onPress` explizit |
| `badge.tsx` | `src/components/common/Badge.tsx` | **übernommen / angepasst** | Varianten `primary` \| `muted` (kein dark:sky-Mapping 1:1); View/Touchable je nach `onPress` |
| `tag.tsx` | `src/components/common/Tag.tsx` | **übernommen / angepasst** | `selected` statt `isSelected`; ohne `onPress` nur Anzeige-`View` |
| `label.tsx` | `src/components/common/Label.tsx` | **übernommen / angepasst** | `TextProps` durchreichbar; nur `@/theme` |
| `avatar.tsx` | `src/components/common/Avatar.tsx` | **übernommen / angepasst** | Grössen in px; `imageSource` für lokale Bilder; Ton `neutral` statt generischem `secondary` |
| `accordion.tsx` | `src/components/common/Accordion.tsx` | **übernommen / angepasst** | `AccordionPanel` + `children`; Chevron via **Ionicons**; kein globales `id`-State pro Liste nötig; `AccordionTextPanel` für reinen Text |
| `rating.tsx` | `src/components/common/Rating.tsx` | **übernommen / angepasst** | Ionicons Sterne; im Readonly-Modus keine `TouchableOpacity` |
| `checkbox.tsx` | `src/components/common/CheckboxField.tsx` | **übernommen / angepasst** | Kein `react-native-bouncy-checkbox`; eigenes Kästchen + `Ionicons` checkmark |
| `input-text.tsx` | `src/components/common/InputText.tsx` | **übernommen / angepasst** | Kein `nativewind`; helles Theme konsistent zu Rest-App |
| `no-data.tsx` | `src/components/common/EmptyState.tsx` | **übernommen / angepasst** | Kein Reanimated; kein Import aus `@/data/images`; `imageSource` optional |
| `modal.tsx` | `src/components/common/AlertModal.tsx` | **übernommen / angepasst** | **`Modal` aus `react-native`** statt `react-native-modal`; keine i18n-Zwangstexte; sekundäre Aktion optional |
| `container.tsx` | `src/components/layout/ScreenContainer.tsx` | **übernommen / angepasst** | `insetBottom` statt `bottom`; Default-Hintergrund `COLORS.bg`; horizontales Padding über `SPACING.screenPadding` |
| `header.tsx` | `src/components/layout/ScreenHeader.tsx` | **übernommen / angepasst** | Kein `expo-router`; **`onBackPress` + `showBackButton`**; Ionicons zurück; optionales `rightAccessory` |
| — | `src/components/common/index.ts` | **neu** | Barrel-Exporte |
| — | `src/components/layout/index.ts` | **neu** | Barrel-Exporte |

---

## Nicht portiert (bewusst verworfen oder später)

| Original | Grund |
|----------|--------|
| `bottom-sheet.tsx` | `react-native-modal` + i18n-Kopplung; schwerer als MVP nötig |
| `modal-upload.tsx`, `modal-dependant.tsx`, `modal-coming-soon.tsx` | Domänen-spezifisch |
| Alle `card-*.tsx` | DoctorGo-Fachlogik; stattdessen später **eigene** Karten unter `src/components/cards/` für Medikament/Algorithmus |
| `carousel*.tsx`, `pinar` | Kein Karussell-MVP |
| `dropdown.tsx`, `radio-group.tsx`, `tab-container.tsx`, `tab-item.tsx` | Nicht extrahiert; bei Bedarf separat und schlank nachbauen |
| `setting-item.tsx`, `step-item.tsx`, `notification-indicator.tsx`, `show-password.tsx`, `quick-favorite.tsx` | Zu spezifisch oder klein — bei Bedarf neu bauen |
| `banner.tsx`, `calendar.tsx`, `marketplace-bestsellers.tsx`, `tab-bar-icon.tsx` | Nicht generisch / Tab-Bar bleibt in `AppNavigator` |

---

## Abhängigkeiten je Komponente

| Komponente(n) | Runtime-Pakete |
|---------------|----------------|
| Buttons, Badge, Tag, Label, Avatar, InputText, EmptyState, ScreenContainer | Nur `react-native`, `react-native-safe-area-context` (Layout), `@/theme` |
| Accordion, Rating, CheckboxField, ScreenHeader, AlertModal | Zusätzlich `@expo/vector-icons` |
| AlertModal | `ButtonPrimary` / `ButtonSecondary` (lokal) |

**Nicht verwendet:** `nativewind`, `clsx`, `expo-router`, `react-native-modal`, `react-native-reanimated`, `@tabler/icons-react-native`, `react-native-bouncy-checkbox`, `react-i18next`, alle Stores.

---

## Einbindung in Screens (ohne Screen-Namen zu ändern)

- Bestehende Screens können schrittweise **`ScreenContainer`** / **`ScreenHeader`** (in Stacks mit `navigation.goBack`) oder einzelne **Common**-Bausteine importieren, z. B. `import { ButtonPrimary } from '@/components/common'`.
- **`EmptyState`:** sinnvoll in `SearchScreen` / Leerlisten, mit deutschem `message` und optionalem Bild unter `src/assets-adopted/` (nach Freigabe).

---

## Typische Importe

```tsx
import { ButtonPrimary, EmptyState, InputText } from '@/components/common';
import { ScreenContainer, ScreenHeader } from '@/components/layout';
import { COLORS } from '@/theme';
```

---

## Verifiziert

- `npx tsc --noEmit` in `apps/mobile-app` läuft nach Installation von `@expo/vector-icons` (Workspace: `pnpm add … --filter resqbrain-mobile`).
- Keine Änderungen an `apps/website`, `data/lookup-seed`, `packages/domain`.
