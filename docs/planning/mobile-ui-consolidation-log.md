# Mobile UI — Konsolidierung wiederkehrender Muster

**Datum:** 2026-03-31  
**Scope:** `apps/mobile-app/src/components/common/*` (neu/erweitert), `apps/mobile-app/src/screens/*` (Refactor auf gemeinsame Bausteine)

**Unverändert (explizit):** Navigation, Routen, Lookup-/Suchlogik, `contentIndex` / Typen, `apps/website`, `data/lookup-seed`, `packages/domain`.

---

## Ziel

Wiederkehrende **reine UI-Muster** aus den überarbeiteten Screens in **prop-basierte, typisierte Komponenten** ziehen — ohne fachliche Logik in den Präsentationskomponenten und ohne verhaltensrelevante Änderungen an Datenflüssen.

---

## Neue / zentrale Komponenten

| Komponente | Datei | Rolle |
|------------|-------|--------|
| **SectionHeader** | `SectionHeader.tsx` | Abschnitts-/Listen-Eyebrow (`section`, Größen `default` \| `compact` \| `comfortable`) oder **Screen-Titel** (`variant="screen"`) + Lead-Text |
| **ContentBadge** | `ContentBadge.tsx` | Farbiges Pill-Label; **Farben nur von außen** (z. B. aus `TAG_CONFIG` im Screen) |
| **LookupListRow** | `LookupListRow.tsx` | Standard-Zeile Medikament/Algorithmus-Liste: optional `leading`, Titel, Untertitel, Chevron, Press-Stil |
| **ContentListCard** | `ContentListCard.tsx` | Suchtreffer-Karte: Meta-Zeile (`metaStart`, z. B. `Badge`) + Titel + Untertitel + Chevron |
| **DetailLinkRow** | `DetailLinkRow.tsx` | Querverweis-Zeile im Detail (label, `onPress`, A11y) |
| **DetailUnavailableRow** | `DetailUnavailableRow.tsx` | Platzhalterzeile bei fehlenden/ungültigen IDs (`message`, optional `detailLine`) |
| **WarningCard** | `WarningCard.tsx` | Amber Kasten mit Icon + Titel + Body; `tone="dosage"` für Dosierkasten (Radius/Typo wie zuvor) |
| **DetailSectionCard** | `DetailSectionCard.tsx` | `CARD`-Chrome + SectionHeader + optional `hint` + `children` |
| **ListScreenEmptyPlaceholder** | `ListScreenEmptyPlaceholder.tsx` | `FlatList` **ListEmptyComponent**: zentriert bestehendes **EmptyState** |
| **FlatListSeparator** | `FlatListSeparator.tsx` | Einheitlicher vertikaler Abstand zwischen Listeneinträgen (Höhe konfigurierbar) |

**EmptyState** und **Badge** blieben bestehen; keine fachliche Erweiterung.

---

## Screen-Mapping (vorher → nachher)

| Screen | Anpassung |
|--------|-----------|
| **HomeScreen** | `Label` → **SectionHeader** (`size="comfortable"`) für „Schnellzugriff“ |
| **SearchScreen** | Screen-Titel/Lead → **SectionHeader** `variant="screen"`; Filter-Label → **SectionHeader** `compact`; Treffer → **ContentListCard**; `EmptyState` mit explizitem `when={true}` |
| **MedicationListScreen** | Kopf → **SectionHeader**; Zeilen → **LookupListRow** + **ContentBadge**; Trenner → **FlatListSeparator**; leer → **ListScreenEmptyPlaceholder** |
| **AlgorithmListScreen** | wie Medikamentenliste |
| **MedicationDetailScreen** | Abschnitte → **DetailSectionCard**; Dosierung → **WarningCard** `tone="dosage"`; Links → **DetailLinkRow**; defekte Refs → **DetailUnavailableRow**; Not-Found → **EmptyState** |
| **AlgorithmDetailScreen** | Warnung oben → **WarningCard**; Rest wie Medikament-Detail; Schritte bleiben im Screen (nur Layout/Styles), da strukturierte Schritt-Map weiterhin fachlich im Screen liegt |

---

## Barrel-Export

`src/components/common/index.ts` exportiert alle neuen Symbole; Screens importieren weiterhin bevorzugt aus `@/components/common`.

---

## Bewusst nicht extrahiert

- **Schritt-Rendering** im Algorithmus-Detail: bleibt im Screen (Mapping über `algorithm.steps` + lokale Styles) — vermeidet vorgezogene Domänen-API in einer generischen Komponente.
- **TAG_CONFIG**-Lookup: bleibt in den List-Screens; **ContentBadge** erhält nur primitive Props.

---

## Verifikation

- `npx tsc --noEmit` in `apps/mobile-app`: **PASS**

---

## Kurzfazit

Die sechs Haupt-Screens nutzen jetzt **gemeinsame Präsentationskomponenten** für Kopfzeilen, Listenzeilen, Suchkarten, Detailkarten, Warn- und Leerzustände. **Navigation, Lookup-Filter und Datenquellen** sind unverändert; Refactor beschränkt sich auf **mobile UI-Struktur und Wiederverwendbarkeit**.
