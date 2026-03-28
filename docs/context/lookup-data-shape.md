# Lookup-Datenform — Phase 0 (Lookup-first MVP)

**Stand:** 28. März 2026  
**Zweck:** Minimale, lesbare Datenbasis für Medikamente und Algorithmen — ohne Phase-1-Rechnerlogik, ohne Phase-3-Governance in den Nutzdaten.

## Einordnung

Phase 0 ist in den Kontextdateien als **Lookup-first MVP** definiert: finden und lesen unter Zeitdruck, bevorzugt offline, ohne Berechnungs-Engines, ohne Freigabe-/Rollen-UI, ohne Versionierungs-Oberfläche in der App (`docs/context/mvp-scope.md`, `docs/context/project-overview.md`).

Die **Lookup-Architektur** beschreibt Module für Medikament, Algorithmus, Suche und lokale Haltung; ausdrücklich ausgeschlossen sind u. a. dynamische Dosierungslogik, KI und Approval-Flows in der App (`docs/architecture/lookup-first-architecture.md`).

**Implementierungsanker (Ist):** Die mobile App modelliert Phase-0-Inhalte bereits als discriminated union in `apps/mobile-app/src/types/content.ts` (`ContentItem` = `Medication | Algorithm`). Die hier beschriebene Seed-Form soll damit kompatibel sein oder als Obermenge mit klarer Abbildung dokumentiert werden.

**Abgrenzung zum Domain-Paket:** `@resqbrain/domain` enthält vollständige Plattform-Entitäten (u. a. `ApprovalStatus`, Versionierung, Audit). Das sind **keine** Pflichtfelder für Phase-0-Seed-Dateien; sie gehören zu späteren Phasen oder zur späteren Abbildung „Seed → Domain“, nicht zum Lookup-Bundle auf dem Gerät.

---

## Gemeinsame Basisfelder (alle Lookup-Inhalte)

Gelten für Medikament und Algorithmus gleichermaßen.

| Feld | Phase 0 | Typ (logisch) | Zweck |
|------|---------|---------------|--------|
| `id` | **Pflicht** | string, stabil, URL-/Navigationstauglich | Eindeutiger Schlüssel innerhalb des Bundles |
| `kind` | **Pflicht** | `'medication' \| 'algorithm'` | Diskriminator für Suche und Navigation |
| `label` | **Pflicht** | string | Primäre Anzeige (Liste, Kopfzeile, Suchkontext) |
| `indication` | **Pflicht** | string | Kurztext: wann/wofür; Untertitel in Listen, durchsuchbar |
| `tags` | **Pflicht** | Array aus kontrolliertem Vokabular | Filter/Gruppierung; in der App: `ContentTag` |
| `searchTerms` | **Pflicht** | string[] (darf leer sein) | Synonyme, Handelsnamen, Abkürzungen — nur für Suche |
| `notes` | optional | string | Zusatzinfos nur in der Detailansicht; nicht für Listentext vorgesehen |

**Hinweis:** `searchTerms` kann eine leere Liste sein, ist aber als Feld vorhanden, damit Redaktion und Validator einheitlich arbeiten.

---

## Medication (Medikament)

### Pflichtfelder (MVP / Phase 0)

| Feld | Typ | Zweck |
|------|-----|--------|
| Alle Basisfelder mit `kind: 'medication'` | — | siehe oben |
| `dosage` | string (Freitext, ggf. mehrzeilig im JSON) | **Statische** Darstellung von Dosierung und Applikation — reiner Lesetext, keine maschinell ausgewertete Regel (kein Gewichts-/Altersrechner) |
| `relatedAlgorithmIds` | string[] | Verweise auf Algorithmen-`id`s für Querverweise in der Detailansicht; darf leer sein |

### Sinnvolle optionale Felder (Phase 0, redaktionell)

Diese Felder verbessern Lesbarkeit und Trefferqualität, ohne Plattform-Governance zu erfordern. Sie können in einem ersten Seed fehlen, sofern die App sie noch nicht rendert — dann sind sie dokumentierte Erweiterung der Seed-Datei oder werden in `notes`/`dosage` zusammengeführt, bis die UI sie nutzt.

| Feld | Typ | Zweck |
|------|-----|--------|
| `genericName` | string | Wirkstoff / INN — eigene Zeile in der Detailansicht und zusätzliches Suchziel (kann alternativ in `searchTerms` gespiegelt werden) |
| `tradeNames` | string[] | Handelsnamen explizit (Redundanz zu `searchTerms` vermeiden: entweder hier oder in `searchTerms` führen) |
| `contraindications` | string | Kontraindikationen und wichtige Warnhinweise als Lesetext |
| `specialConsiderations` | string | Besonderheiten (z. B. Anwendung im Rettungsdienst, Mischbarkeit) |

### Bewusst nicht Teil von Phase-0-Lookup-Daten

| Thema | Begründung |
|-------|------------|
| Strukturierte `DosageRule` (Gewicht/Alter → Dosis) | Dynamische Dosierungslogik ist Phase 1 laut Lookup-Architektur; Phase 0 bleibt bei Freitext |
| `ApprovalStatus`, Reviewer, Freigabedatum als fachlicher Workflow | Governance / Phase 3; nicht für Einsatz-Lookup nötig |
| Versionsketten, Draft/InReview, ContentPackage-Zusammensetzung | Release-Engine und Plattform-Modell; nicht im statischen Lookup-Bundle |
| `organizationId` als Laufzeit-Mandant | Phase 0: eine feste Pilot-Konfiguration; optional nur als Metadaten auf **Bundle-Ebene** (siehe Seed-Plan), nicht pro Eintrag zwingend |
| Audit-Trail, Autor-Listen wie im Domain-`Algorithm` | Plattform-Nachvollziehbarkeit, nicht MVP-Lookup |

---

## Algorithm (Algorithmus)

### Pflichtfelder (MVP / Phase 0)

| Feld | Typ | Zweck |
|------|-----|--------|
| Alle Basisfelder mit `kind: 'algorithm'` | — | siehe oben |
| `steps` | Array von `{ text: string }` | Geordnete Schrittfolge; in Phase 0 **linear**, ohne verzweigungsauswertende Logik in der App |
| `relatedMedicationIds` | string[] | Verweise auf Medikamenten-`id`s; darf leer sein |

### Sinnvolle optionale Felder (Phase 0, redaktionell)

| Feld | Typ | Zweck |
|------|-----|--------|
| `warnings` | string | Hervorgehobener Sicherheitshinweis (in der App bereits als optionales Feld vorgesehen) |
| `category` | string | Feinere Gruppierung als `tags` allein (z. B. „Reanimation“); kann auch über `tags` + `label` abgedeckt werden |

### Bewusst nicht Teil von Phase-0-Lookup-Daten

| Thema | Begründung |
|-------|------------|
| Verzweigungen mit auswertbaren Bedingungen (Entscheidungsbäume) | Würde Logik/State in der UI erzwingen; Phase 0: lineare Schrittliste, Verzweigung nur als Freitext im Schritt |
| Verweise auf externe Medien, interaktive Rechner | Nicht Ziel von Phase 0 |
| SOP-/Protokoll-Entität getrennt vom Algorithmus | Langfristig `Protocol` im Domain-Modell; Phase 0 nur Algorithmus-Lookup |
| Gleich wie bei Medikamenten: vollständiges Lifecycle-/Tenant-Feldmodell aus `@resqbrain/domain` | Spätere Abbildung, nicht Pflicht im Seed |

---

## Such- und Index-Hinweise (Phase 0)

- **Indexierbare Texte:** mindestens `label`, `indication`, `searchTerms` (alle Einträge), optional `notes`, bei Medikament `dosage`, bei Algorithmus alle `steps[].text` und `warnings`.
- **Keine** serverseitige Suche; der Index entsteht lokal aus dem Bundle (`docs/architecture/lookup-first-architecture.md`).

---

## Konsistenzregeln (minimal)

1. Jedes `id` ist innerhalb des Bundles eindeutig.  
2. `relatedAlgorithmIds` und `relatedMedicationIds` verweisen nur auf existierende `id`s oder sind leer.  
3. `tags` nutzen das in der App definierte Vokabular (`ContentTag`), damit Filter nicht fragmentieren.  
4. Kein Feld darf implizit Berechnungen auslösen — alles, was der Nutzer sieht, ist statischer Text aus dem Seed.

---

## Verwandte Dokumente

- `docs/context/mvp-scope.md` — Phase-0-Grenzen  
- `docs/context/content-seed-plan.md` — Ablage, Format, Bundle-Metadaten  
- `docs/architecture/lookup-first-architecture.md` — Module und Verbote (z. B. keine Dosierungslogik)  
- `docs/architecture/terminology-mapping.md` — kanonische Begriffe (Medication, Algorithm)
