# Mobile App — Cleanup nach UI-Refactor

**Datum:** 2026-03-31  
**Umfang:** `apps/mobile-app/src` (gebündelte App), ohne `apps/website`, ohne Domain/Seed-Daten. Ziel: **Stabilisierung und Bereinigung** ohne neue Features oder Verhaltensänderungen an Lookup/Navigation.

---

## Bereinigt

| Bereich | Maßnahme |
|---------|----------|
| **Theme / Spacing** | `SPACING.gapXs` (4) und `SPACING.detailBlockGap` (22) in `src/theme/index.ts` ergänzt; dokumentiert als kleinstes Raster bzw. vertikaler Rhythmus in Detail-Screens. |
| **Detail-Screens** | Doppelte lokale Konstante `DETAIL_BLOCK_GAP` in `MedicationDetailScreen` und `AlgorithmDetailScreen` entfernt; `content`-`gap` nutzt `SPACING.detailBlockGap`. Scroll-`paddingBottom`: `+ 8` durch `+ SPACING.gapSm` ersetzt (gleicher Zahlenwert 8). |
| **Chevron-Konsistenz** | `ContentListCard`: `chevron-forward` von 20 auf **22** px — aligned mit `LookupListRow` und `DetailLinkRow`. |
| **Komponenten / Tokens** | `DetailLinkRow`: `gap` über `SPACING.gapSm` / `SPACING.gapXs` statt Magiezahlen. `DetailUnavailableRow`: `gap` → `SPACING.gapXs`. `EmptyState` (`hint`): `marginTop` → `SPACING.gapXs`. `WarningCard` (`titleRow`): `gap` → `SPACING.gapSm`. `SectionHeader` (`wrapScreen`): `gap` → `SPACING.gapXs`. `SearchScreen`: ein `marginTop: 4` → `SPACING.gapXs`. |
| **Leere Struktur** | `src/components/cards/index.ts` (nur `export {}`, keine Imports im Projekt) **gelöscht**. |
| **Ungenutzte Imports** | `DetailUnavailableRow`: fälschlich entferntes `COLORS` beim Zwischenstand **korrigiert** (`borderBottomColor` benötigt `COLORS`). |

**Verifikation:** `npx tsc --noEmit` in `apps/mobile-app`: **PASS**.

---

## Bewusst beibehalten

| Thema | Begründung |
|-------|------------|
| **„Tote“ Barrel-Komponenten** | `Accordion*`, `AlertModal`, `Avatar`, `CheckboxField`, `Rating`, `ButtonOutline` werden **nirgends in Screens** importiert, bleiben aber als **wiederverwendbares UI-Kit** unter `src/components/common/` und im Barrel-Export — Entfernen wäre scope- und risikoreicher als dieser Cleanup. |
| **`design/` und `ui8/`** | Stehen in `tsconfig.json` unter `exclude`; **kein Teil** der gebündelten App-Sources. Enthalten ggf. historische/Referenz-Bezeichner (z. B. extrahierte Fremd-App) — **nicht** im produktiven `src`-Tree bereinigt, um kein Archiv-Verhalten zu ändern. |
| **`DetailCrossRefList` Akzentbreite** | `width: 4` bleibt **literal** (dekorativer Balken), nicht an `gapXs` gekoppelt, damit Layout-Raster und ornamentale Breite semantisch getrennt bleiben. |
| **`src/ui/theme.ts`** | Dünner Re-Export auf `@/theme` — bewusst als Alias/Entry erhalten. |
| **Sichtbare Texte / Umlaute** | Stichprobe in `src/screens/*.tsx`: konsistent deutsche Begriffe („Bundle“, „Medikament“, „Algorithmus“, „Nachbereitung“, „Querverweis“); typografische Anführungszeichen in Such-Hinweisen („…“) beibehalten. Keine inhaltliche Copy-Überarbeitung vorgenommen. |
| **HomeScreen-Rohtoken** | Vereinzelt weiterhin **Magic Numbers** (z. B. `gap: 6`, `top: 8`) — breites Refactor nur bei eigenem Design-Token-Pass sinnvoll; nicht Teil dieses minimalen Cleanups. |
| **Expo-Assets** | `app.json` verweist auf `./assets/icon.png`, `splash.png`, `adaptive-icon.png`. Im Workspace können diese Dateien fehlen oder **nicht indexiert** sein — kein Löschen ohne Klärung, ob Dateien nur lokal/ignoriert fehlen. |

---

## Offene Restpunkte

1. **ESLint / unused imports:** Projekt hat **kein** konfiguriertes ESLint in `package.json`; für systematische Import-Tod-Analyse ESLint (`no-unused-vars`, ggf. `eslint-plugin-unused-imports`) ergänzen.
2. **Asset-Präsenz:** Beim nächsten Release-Build prüfen, ob `apps/mobile-app/assets/*` vollständig zum Repo gehört oder nur lokal existiert.
3. **Weitere Token-Harmonisierung:** `HomeScreen`, `Badge`, `ContentBadge`, `Accordion` u. a. nutzen noch **verstreute** `4`/`8`/`6` — optional in einem dedizierten „spacing-only“-Pass.
4. **Doku-Drift:** `docs/planning/mobile-detail-ux-tuning.md` erwähnt noch die **lokale Konstante** `DETAIL_BLOCK_GAP`; fachlich entspricht dem jetzt **`SPACING.detailBlockGap`** im Theme (bei Bedarf Text dort anpassen).
5. **Querverweis-Listen:** letzte `DetailLinkRow` kann weiterhin eine **untere Trennlinie** zeigen — rein kosmetisch; siehe bereits `mobile-detail-ux-tuning.md`.

---

## Kurz: Prüfpunkte aus der Aufgabe

| Prüfpunkt | Ergebnis |
|-----------|----------|
| Ungenutzte Imports | Teilweise adressiert (sicherer Fix an `DetailUnavailableRow`); flächendeckend ohne ESLint nicht garantiert. |
| Tote Komponenten | Keine Dateien gelöscht; 6 Komponenten nur über Barrel, **keine** Screen-Nutzung — unter „bewusst beibehalten“ dokumentiert. |
| Redundante Styles | Detail-`DETAIL_BLOCK_GAP`-Duplikat entfernt; Scroll-Padding-„+8“ über Token ausgedrückt. |
| Spacing / Tokens | `gapXs`, `detailBlockGap` eingeführt; ausgewählte Stellen umgestellt. |
| Nicht verwendete Assets | Nur Konfigurationshinweis; keine Löschung. |
| ZIP-/Altbezeichner in `src` | **Keine** Treffer auf ZIP/DoctorGo/UI8 im `src`-Tree; Altbestand nur außerhalb/build-excluded. |
| Chevron / Icons | `chevron-forward` in Karten/Zeilen auf **22** vereinheitlicht; übrige Ionicons unverändert sachgerecht (Suche, Back, Accordion, Rating, …). |
| Umlaute / Textkonsistenz | Keine Änderung nötig; keine neuen Inkonsistenzen eingeführt. |
