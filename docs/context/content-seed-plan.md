# Content-Seed-Plan — Phase 0 (Lookup-first MVP)

**Stand:** 28. März 2026  
**Ziel:** Redaktionell gepflegte, **statische** Medikamenten- und Algorithmus-Daten für schnelles lokales Laden, einfache Offline-Nutzung und einheitliche Validierung — ohne Phase-1-Rechner, ohne Phase-3-Freigabe- oder Rollenfeatures in den Inhalten.

## Ausgangslage im Repository

- **Phase 0** ist in `docs/context/mvp-scope.md`, `docs/context/roadmap-status.md` und `docs/context/project-overview.md` beschrieben; offene Punkte u. a. Finalisierung der Seed-Daten und Festlegung der lokalen Datenhaltung.
- **Datenform:** `docs/context/lookup-data-shape.md` (Pflicht/optional/exkludiert).
- **App-Typen:** `apps/mobile-app/src/types/content.ts` — Ziel ist, Seeds in diese Struktur zu überführen oder daraus abzuleiten.
- **Aktueller Ist-Stand:** Mock-/Beispieldaten unter `apps/mobile-app/src/data/` (z. B. `mockMedications.ts`, `mockAlgorithms.ts`); es gibt **kein** zentrales `data/schemas/`-Verzeichnis im Repo — der Plan schlägt einen klaren, neuen Ablageort vor.

---

## Empfohlene Ablagestruktur

Vorschlag für ein klares, versionierbares Bundle:

```text
data/lookup-seed/
  manifest.json          # Bundle-Metadaten (siehe unten)
  medications.json       # Array von Medikamenten-Objekten
  algorithms.json        # Array von Algorithmus-Objekten
```

Alternative (monolithisch für maximale Einfachheit):

```text
data/lookup-seed/
  manifest.json
  content.json           # { "medications": [...], "algorithms": [...] }
```

**Manifest (`manifest.json`) — empfohlene Pflichtfelder auf Bundle-Ebene**

| Feld | Phase 0 | Beschreibung |
|------|---------|--------------|
| `schemaVersion` | Pflicht | Version des **JSON-Schemas** der Dateien (nicht medizinische Version) |
| `bundleId` | Pflicht | Stabile ID dieser Pilot-Konfiguration (z. B. `pilot-wache-001`) |
| `displayName` | optional | Lesbarer Name für Logs/Debug |
| `generatedAt` oder `contentCutoffDate` | optional | Redaktions-/Exportdatum (informativ) |
| `locale` | optional | z. B. `de` — einheitliche Sprache im Bundle |

**Bewusst nicht im Manifest erzwingen (Phase 0):** produktive Release-Pipeline, Signatur-Chain, Multi-Tenant-Switch — das bleibt außerhalb des minimalen Lookup-Bundles.

---

## Dateiformat: JSON oder TypeScript?

### Empfehlung: **JSON** als kanonische Quelle

| Kriterium | JSON | TypeScript-Seed |
|-----------|------|------------------|
| Lesbarkeit für Redaktion/Review | gut (kein Build nötig zum Lesen) | schlechter für Nicht-Entwickler |
| Validierung | mit JSON Schema oder Zod beim App-Start/Build | natürlich typsicher |
| Offline-Bundle | trivial ins App-Asset zu packen | Build-Schritt erzeugt JSON oder eingebettetes Modul |
| Diff in Git | gut | etwas lauter |

**Konkrete Empfehlung:**  
1. **JSON** als autoritative Seed-Datei unter `data/lookup-seed/`.  
2. Optional: kleiner **TypeScript-Loader** in der App, der JSON importiert oder zur Laufzeit lädt und gegen die Typen aus `content.ts` validiert (Zod o. Ä.) — das ist Implementierungsdetail und gehört nicht zu Phase-0-Dokumentationspflicht.

### Wann TypeScript sinnvoll ist

- Sehr kleine Demo-Sets und schnelle UI-Iteration **ohne** redaktionellen CSV/JSON-Workflow.  
- Sobald echte Pilotinhalte gepflegt werden, sollte JSON (oder CSV → Build → JSON) die Quelle sein, um Inhalt und Code zu trennen.

---

## Arbeitsablauf (redaktionell, ohne Plattform-Workflow)

1. **Inhalte** nach `lookup-data-shape.md` erfassen (Medikamente und Algorithmen getrennt oder im gemeinsamen Dokument).  
2. **IDs** fest vergeben (kebab-case oder konsistentes Schema); Querverweise (`related*Ids`) prüfen.  
3. **Validierung:** Schema-Check + Eindeutigkeit der `id`s + Referenzintegrität.  
4. **Bundle bauen:** `manifest.json` setzen, Dateien unter `data/lookup-seed/` ablegen.  
5. **App:** Bundle ins Asset-Verzeichnis kopieren oder per Build einbinden; lokaler Store gemäß `lookup-first-architecture.md` (ohne Netzpflicht beim Lesen).

Kein Approval-Status in den JSON-Pflichtfeldern — die „Freigabe“ ist in Phase 0 **organisatorisch** (Pilot-Wache), nicht als Software-Workflow modelliert.

---

## Abgrenzung: Was der Seed-Plan bewusst nicht leistet

- Keine Abbildung des vollständigen `@resqbrain/domain`-Lebenszyklus in den Seed-Dateien.  
- Keine Rollen, keine Berechtigungen pro Datensatz.  
- Keine KI-Erzeugung oder automatische Dosierung.  
- Keine Versionierungs-UI; höchstens ein `bundleId` + `schemaVersion` für technische Erkennbarkeit von Updates.

---

## Nächste Schritte (repo-orientiert)

1. Verzeichnis `data/lookup-seed/` anlegen, sobald erste echte Inhalte vorliegen.  
2. JSON Schema (oder Zod-Schema) aus den Feldern in `lookup-data-shape.md` + `content.ts` ableiten.  
3. Bestehende Mocks schrittweise durch validierte JSON-Quelle ersetzen (Implementierung außerhalb dieses Dokuments).

---

## Beispiele

Vollständige Minimalbeispiele (kompatibel zur App-Basisfelder-Logik; optionale Zusatzfelder aus `lookup-data-shape.md` weggelassen):

### Ein Medikament (`medications.json` — ein Element)

```json
{
  "id": "med-adrenalin-i-m",
  "kind": "medication",
  "label": "Adrenalin (Epinephrin) Injektionslösung",
  "indication": "Kreislaufstillstand, schwere anaphylaktische Reaktion, schwere Asthmaexazerbation — nach lokalem Leitfaden",
  "tags": ["kreislauf", "atemwege"],
  "searchTerms": ["Epinephrin", "Suprarenin", "1 mg/ml Ampulle"],
  "notes": "Applikationsweg und Verdünnung strikt nach organisationsspezifischem Protokoll; keine automatische Dosisberechnung in der App.",
  "dosage": "Erwachsene (Orientierung, Freitext): i.v./i.o. z. B. 1 mg bei KRE; weitere Gaben im Rhythmus des Algorithmus. Kinder: nach pädiatrischem Schema der Pilot-Wache (hier als Freitext hinterlegt, nicht rechnerisch).",
  "relatedAlgorithmIds": ["alg-reanimation-erwachsene"]
}
```

### Ein Algorithmus (`algorithms.json` — ein Element)

```json
{
  "id": "alg-reanimation-erwachsene",
  "kind": "algorithm",
  "label": "Reanimation Erwachsene (Überblick)",
  "indication": "Kreislaufstillstand bei Erwachsenen — strukturierte Einsatzreihenfolge",
  "tags": ["kreislauf"],
  "searchTerms": ["CPR", "KRE", "Basic Life Support"],
  "notes": "Dies ist ein vereinfachtes Schulungsbeispiel; produktive Inhalte ersetzen durch freigegebenen Stand der Pilot-Wache.",
  "steps": [
    { "text": "Eigensicherung und Szeneabsicherung." },
    { "text": "Bewusstsein und Atmung prüfen; Hilfe anfordern." },
    { "text": "Thoraxkompressionen beginnen, Frequenz und Tiefe nach Leitfaden." },
    { "text": "Beatmung bzw. Beatmungsunterstützung integrieren." },
    { "text": "AED einsetzen sobald verfügbar; Schockempfehlung befolgen." },
    { "text": "Medikamente nur nach lokalem Algorithmus und Indikation — siehe verknüpfte Medikamente." }
  ],
  "warnings": "Keine Dosierung ohne Bindung an den freigegebenen Medikamenten-Text der Organisation; App führt keine Berechnung aus.",
  "relatedMedicationIds": ["med-adrenalin-i-m"]
}
```

### Beispiel `manifest.json`

```json
{
  "schemaVersion": "1",
  "bundleId": "pilot-wache-001",
  "displayName": "Pilot-Wache Lookup Seed",
  "locale": "de",
  "contentCutoffDate": "2026-03-28"
}
```

---

## Verwandte Dokumente

- `docs/context/lookup-data-shape.md`  
- `docs/architecture/lookup-first-architecture.md`  
- `docs/context/roadmap-status.md`
