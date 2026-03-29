# Aktuelles App-Zielschema (Mobile Lookup, Phase 0)

**Stand:** März 2026 — beschreibt das **für die Mobile-App gültige Lookup-Bundle** (JSON-Shape, Semantik, Validierungsregeln), abgeleitet aus:

- `apps/mobile-app/src/types/content.ts`
- `apps/mobile-app/src/lookup/lookupSchema.ts`
- `apps/mobile-app/src/lookup/validateLookupBundle.ts` (hartes Laufzeit-Validierungsverhalten)
- Beispieldaten: `data/lookup-seed/manifest.json`, `medications.json`, `algorithms.json`

## Bezugsrahmen: Phase 0, nicht Domain-Modell

Die Vorbereitung und Validierung der Lookup-Daten **orientiert sich am Phase-0-App-Schema** (lineare Algorithmus-Schritte, keine Governance-/Release-Pipeline-Felder, keine `DosageRule`-Strukturen). Sie **ist nicht** das kanonische Domain-Modell aus `docs/architecture/`. Inhalte werden bewusst flach gehalten, damit die App Bundles strikt prüfen und anzeigen kann, ohne die spätere Plattform-Schicht zu duplizieren.

---

## 1. Manifest-Schema (`manifest.json`)

Top-Level-Objekt; **Root von `medications.json` / `algorithms.json` ist jeweils ein Array**, nicht das Manifest.

| Feld | Pflicht | Typ / Inhalt | Anmerkung |
|------|---------|----------------|-----------|
| `schemaVersion` | ja | Nicht-leerer String (nach Trim) | Versionskennzeichnung des Bundle-Formats. |
| `bundleId` | ja | Nicht-leerer String (nach Trim) | Stabile Bundle-Identität. |
| `displayName` | nein | `string` | Ohne weiteren Typ-Check auf Inhalt. |
| `locale` | nein | `string` | z. B. `"de"`. |
| `contentCutoffDate` | nein | `string` | i. d. R. ISO-Datum `YYYY-MM-DD` (Konvention laut Pipeline-Doku). |
| `generatedAt` | nein | `string` | z. B. ISO-860-Zeitstempel. |

**Strikte Schlüsselregel:** Nur die obigen Schlüssel sind erlaubt (`LOOKUP_MANIFEST_KEYS`). Zusätzliche Properties führen zu Validierungsfehlern („unknown keys“).

### Beispiel aus Seed

```json
{
  "schemaVersion": "1",
  "bundleId": "pilot-wache-001",
  "generatedAt": "2026-03-29T13:56:00.878Z",
  "displayName": "Pilot-Wache Lookup Seed",
  "locale": "de",
  "contentCutoffDate": "2026-03-28"
}
```

---

## 2. Medication-Schema (`medications.json` — Array-Element)

Jedes Element entspricht `Medication` in `types/content.ts`. Erlaubte Keys: `MEDICATION_ITEM_KEYS`.

| Feld | Pflicht | Typ / Inhalt | Anmerkung |
|------|---------|----------------|-----------|
| `id` | ja | Nicht-leerer String | App-weit stabil; Navigation, Lookup, Eindeutigkeit innerhalb der Medikamentenliste. |
| `kind` | ja | Literal `"medication"` | Diskriminante. |
| `label` | ja | Nicht-leerer String | Primärdarstellung (Liste, Detail, Suche). |
| `indication` | ja | Nicht-leerer String | Untertitel in Listen; Suchtreffer. |
| `tags` | ja | `string[]` | Jeder Eintrag muss gültiger `ContentTag` sein (siehe Abschnitt Tags). Leeres Array ist zulässig, sofern die Validierung jedes Elements besteht. |
| `searchTerms` | ja | `string[]` | Jeder Eintrag `string` (Leerstrings werden nicht extra versteigert). Nicht in der UI angezeigt; Suche. |
| `notes` | nein | `string` | Optional; Detailansicht; nicht Liste/Suche. |
| `dosage` | ja | Nicht-leerer String | Verabreichungstext; nur Detail. |
| `relatedAlgorithmIds` | ja | `string[]` | Jede ID nicht-leerer String; **jede ID muss einen Algorithmus im Bundle referenzieren** (Cross-Ref-Prüfung). Leeres Array erlaubt. |

**Strikte Schlüsselregel:** Keine zusätzlichen Top-Level-Keys pro Eintrag.

**Bundle-Regeln:** Medikamenten-IDs müssen innerhalb `medications.json` eindeutig sein. Eine ID darf nicht gleichzeitig ein Algorithmus sein (keine Kollision zwischen Medikamenten- und Algorithmus-IDs im Bundle).

---

## 3. Algorithm-Schema (`algorithms.json` — Array-Element)

Jedes Element entspricht `Algorithm` in `types/content.ts`. Erlaubte Keys: `ALGORITHM_ITEM_KEYS`. Schritte: nur `ALGORITHM_STEP_KEYS` (`text`).

| Feld | Pflicht | Typ / Inhalt | Anmerkung |
|------|---------|----------------|-----------|
| `id` | ja | Nicht-leerer String | Wie bei Medikamenten: stabil, Navigation; eindeutig unter Algorithmen. |
| `kind` | ja | Literal `"algorithm"` | |
| `label` | ja | Nicht-leerer String | |
| `indication` | ja | Nicht-leerer String | |
| `tags` | ja | `string[]` | Wie Medikation. |
| `searchTerms` | ja | `string[]` | Wie Medikation. |
| `notes` | nein | `string` | Optional; Detail; nicht Liste/Suche. |
| `warnings` | nein | `string` | Optional; sicherheitsrelevant; UI: visuell von Notes unterscheidbar (z. B. Amber). |
| `steps` | ja | `AlgorithmStep[]` | **Mindestens ein Eintrag.** Jeder Schritt: Objekt nur mit `text` (nicht-leerer String); **keine** Verzweigungsstruktur, keine Schritt-IDs. |
| `relatedMedicationIds` | ja | `string[]` | Jede ID nicht-leerer String; **jede ID muss ein Medikament im Bundle referenzieren.** Leeres Array erlaubt. |

**Strikte Schlüsselregel:** Keine zusätzlichen Keys auf Algorithmus- oder Schritt-Objekten.

**Schritt-Semantik (aus Typkommentar):** Ein Schritt = eine imperative Aktion, idealerweise max. ein Satz; Reihenfolge = lineare Prozedur, kein Branching in Phase 0.

---

## 4. Pflichtfelder vs. optionale Felder (Kurzüberblick)

| Bereich | Immer erforderlich | Optional |
|---------|--------------------|----------|
| **Manifest** | `schemaVersion`, `bundleId` | `displayName`, `locale`, `contentCutoffDate`, `generatedAt` |
| **Medication (gemeinsame Basis)** | `id`, `kind`, `label`, `indication`, `tags`, `searchTerms`, `dosage`, `relatedAlgorithmIds` | `notes` |
| **Algorithm (gemeinsame Basis)** | `id`, `kind`, `label`, `indication`, `tags`, `searchTerms`, `steps` (≥1), `relatedMedicationIds` | `notes`, `warnings` |
| **AlgorithmStep** | `text` | — |

---

## 5. Feldbeispiele aus dem bestehenden Seed

### Medikation — `med-adrenalin-i-m` (Auszug)

- `label`: „Adrenalin (Epinephrin) Injektionslösung“
- `indication`: Kreislaufstillstand, schwere anaphylaktische Reaktion, … — nach lokalem Leitfaden
- `tags`: `["kreislauf", "atemwege"]`
- `searchTerms`: `["Epinephrin", "Suprarenin", "1 mg/ml Ampulle", "Adrenalin"]`
- `dosage`: mehrzeiliger Orientierungstext (Erwachsene/Kinder, Verweis auf Organisation)
- `relatedAlgorithmIds`: `["alg-reanimation-erwachsene", "alg-anaphylaxie-basics"]`
- `notes`: Hinweise zu Kontraindikationen und Haftungsausschluss

### Medikation — `med-ass-iv`

- `relatedAlgorithmIds`: `[]` (leeres Array zulässig)
- `notes`: kurzer klinischer Lesetext-Hinweis

### Algorithmus — `alg-reanimation-erwachsene`

- `steps`: sechs Einträge mit je einem `text` (Sicherung → CPR → AED → Medikation …)
- `relatedMedicationIds`: `["med-adrenalin-i-m"]`
- `warnings` und `notes` gesetzt (Warnung vs. Schulungs-/Ersatztext)

### Algorithmus — `alg-anaphylaxie-basics`

- `steps`: drei lineare Schritte
- `relatedMedicationIds`: `["med-adrenalin-i-m"]`
- Kein `warnings`-Feld (optional entfallen)

---

## 6. Regeln für `steps`, `warnings`, `notes`, `searchTerms`, `tags`

### `steps` (nur Algorithm)

- Array **erforderlich**; Länge **≥ 1**.
- Jedes Element: ein Plain-Object mit **ausschließlich** `text`.
- `text`: nicht-leerer String (Trim).
- Keine IDs auf Schritten in Phase 0; Reihenfolge entspricht der Darstellung (Listen-Index reicht als React-Key laut Typkommentar).
- Keine Verzweigungen, kein eingebettetes Graph-Modell — nur lineare Sequenz.

### `warnings` (nur Algorithm, optional)

- Wenn gesetzt: `string` (kann leer sein — der Validator prüft nur `typeof`).
- Semantik: sicherheitskritische Vorsicht; UI behandelt sie visuell anders als `notes`.

### `notes` (Medication & Algorithm, optional)

- Wenn gesetzt: `string`.
- Anzeige nur in der **Detailansicht**; **nicht** in Liste oder als Suchtreffer-Feld ausgewiesen (Produktintent laut `content.ts`).

### `searchTerms` (Medication & Algorithm, Pflichtfeld)

- Array von Strings; für Matching in der Suche gedacht; nicht zur Anzeige in Listen als Primary Field vorgesehen.
- Synonyme, Handelsnamen, Abkürzungen — laut Kommentar in `content.ts`.

### `tags` (Medication & Algorithm, Pflichtfeld)

- Array; jeder Wert muss in der **Whitelist** `CONTENT_TAG_VALUES` / `ContentTag` liegen:

  - `kreislauf` — kardiovaskulär / Kreislauf  
  - `atemwege` — Atemweg / respiratorisch  
  - `neurologie` — neurologisch / ZNS  
  - `analgesie` — Analgesie / Sedierung  
  - `intoxikation` — Toxikologie / Überdosierung  
  - `stoffwechsel` — Stoffwechsel / endokrin  

- Zweck Phase 0: Filterung und thematische Gruppierung.
- Ungültige Tag-Strings führen zu Validierungsfehlern.

---

## Verweise

- Erlaubte Keys und Tag-Liste: `lookupSchema.ts`.
- Semantik der Felder und UI-Zuordnung: `types/content.ts`.
- Strikte Validierung inkl. Querverweise und ID-Kollisionen: `validateLookupBundle.ts`.
- Build/Mapping aus normalisierten Quellen: `normalized-to-lookup.md`.
