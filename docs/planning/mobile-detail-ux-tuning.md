# Mobile Detail — UX-Tuning (Einsatz & Nachbereitung)

**Datum:** 2026-03-31  
**Screens:** `MedicationDetailScreen.tsx`, `AlgorithmDetailScreen.tsx` (`apps/mobile-app/src/screens/`)  
**Ziel:** Schnellere **mobile Lesbarkeit** beim Scannen unter Druck und beim Nachlesen: klare Gewichtung für **Dosierung**, **Warnungen**, **Schritte**; mehr Luft zwischen kritischen Blöcken; **einheitliche Querverweise**; **robuste Empty States** — ausschließlich Darstellung/UX, ohne Daten- oder Navigationsänderungen.

---

## Leitlinien (eingehalten)

- **Kein Datenmodell:** keine Änderungen an Domain-Typen, Seed oder `contentIndex`.
- **Keine Such- oder Index-Logik:** keine Anpassungen an Lookup/Filter/Navigation-Parametern.
- **Keine Navigation:** Routen, Stack und Ziele unverändert; nur UI in den genannten Screens und gemeinsame Komponenten.

---

## Gemeinsame Hilfskomponenten

| Komponente | Pfad | Zweck |
|------------|------|--------|
| `DetailBodyText` | `src/components/common/DetailBodyText.tsx` | Einheitlicher Fließtext; `variant="relaxed"` für etwas größere Zeilenhöhe (Indikation, Notizen). |
| `DetailStepList` | `src/components/common/DetailStepList.tsx` | Schritte als gestapelte Karten mit starker Nummer, Rand und Abstand — bessere Scanbarkeit als flache Liste. |
| `DetailCrossRefList` | `src/components/common/DetailCrossRefList.tsx` | Querverweise mit **linkem Akzentbalken** + Spalte für Einträge; konsistent Medikament ↔ Algorithmus. |

Ergänzend erweitert (keine neuen Datenabhängigkeiten):

- **`DetailSectionCard`:** `tone?: 'default' | 'soft'` — weichere Karten für sekundäre Notizen.
- **`WarningCard`:** `prominent?: boolean` — stärkerer Rahmen/Abstand für Warnungen oben im Algorithmus-Detail.
- **`DetailLinkRow`:** optionales `contextLabel` (z. B. „Algorithmus“ / „Medikament“), etwas höhere Touch-Ziele und seitliches Padding.
- **`EmptyState`:** optionales `hint` (zweite Zeile) + kombiniertes `accessibilityLabel` für „kein Inhalt“ / nicht gefunden.
- **`DetailUnavailableRow`:** optisch an Link-Zeilen angeglichen (Padding, Hintergrund).

Exporte: `src/components/common/index.ts`.

---

## MedicationDetailScreen

- Konstante **`DETAIL_BLOCK_GAP` (22)** zwischen Hauptblöcken; etwas mehr `paddingBottom` im Scroll — **kritische Blöcke** (Indikation, Dosierung, Querverweise) visuell getrennt.
- **Dosierung:** eigene **`DetailSectionCard`** mit betonter Rand-/Hervorhebungs-Style (`dosageSection`) — höchste visuelle Priorität neben Überschrift.
- **Indikation / Freitext:** `DetailBodyText` mit `relaxed` wo sinnvoll.
- **Notizen:** `DetailSectionCard` mit **`tone="soft"`** und kurzer erklärender Zeile wo vorgesehen.
- **Querverweise zu Algorithmen:** `DetailCrossRefList` mit **`DetailLinkRow`** und `contextLabel="Algorithmus"`; fehlende/fehlerhafte IDs: **`DetailUnavailableRow`** mit klarer Kurzcopy („Eintrag nicht verfügbar“ + Kontextzeile).
- **Nicht gefunden:** `EmptyState` mit **`hint`** (Hinweis auf Tabs/Suche), ohne neue Navigation.

---

## AlgorithmDetailScreen

- Gleiche **Blockabstände** und Scroll-Padding wie Medikament-Detail.
- **Warnung(en) oben:** `WarningCard` mit **`prominent`** für schnelles Erfassen.
- **Schritte:** `DetailStepList` statt flacher Map — Nummer, Karte, Abstand.
- **Indikation / Notizen:** wie Medikament (`DetailBodyText`, **`tone="soft"`** für Notizen).
- **Querverweise zu Medikamenten:** `DetailCrossRefList` + `contextLabel="Medikament"`; ungültige Einträge analog **`DetailUnavailableRow`**.

---

## Barrierefreiheit (Kurz)

- **`EmptyState`:** `message` + optional `hint` werden zu einem **`accessibilityLabel`** zusammengezogen, wo gesetzt.
- **`DetailStepList`:** Schritte mit **`accessibilityLabel`** (Nummer + Text), sinnvoll für VoiceOver/TalkBack beim linearen Lesen.

---

## Verifikation

- `npx tsc --noEmit` in `apps/mobile-app`: **PASS** (Stand dieser Änderungen).

---

## Bewusst nicht umgesetzt

- Letzte Zeile in `DetailCrossRefList`: untere Trennlinie der letzten `DetailLinkRow` kann optisch noch „doppelt“ wirken — nur bei explizitem Design-Wunsch per `showDivider` o. ä. nachziehen.
- Keine weiteren Screens außer den beiden Detail-Screens in diesem Dokument abgedeckt.
