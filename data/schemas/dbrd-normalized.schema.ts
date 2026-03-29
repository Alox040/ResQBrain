/**
 * Internes Normalisierungsmodell für DBRD-bezogene Inhalte (Phase-1-Mobile-App).
 *
 * Zweck:
 * - strukturierter als `data/lookup-seed/*.json` (klare Teilbereiche, Provenance)
 * - bewusst schlanker als `@resqbrain/domain` (keine Org-/Versions-/Audit-Objekte)
 *
 * Mapping: `normalized` → Transform/Mappings → `data/lookup-seed/`
 */

// -----------------------------------------------------------------------------
// Freigabestatus — Werte bewusst parallel zur Domain (`ApprovalStatus`), ohne Import
// -----------------------------------------------------------------------------

/** Entspricht den Domain-Strings `Draft` … `Deprecated` (siehe packages/domain). */
export type DbrdNormalizedApprovalStatus =
  | 'Draft'
  | 'InReview'
  | 'Approved'
  | 'Rejected'
  | 'Released'
  | 'Deprecated';

// -----------------------------------------------------------------------------
// Provenance / Governance (Traceability)
// -----------------------------------------------------------------------------

/**
 * Herkunft und Prüfstatus — Pflichtfelder für jede normalisierte Entität.
 * Ermöglicht Rückverfolgung bis zur Quelle und sauberes Mapping ins Seed-Manifest.
 */
export interface DbrdNormalizedProvenance {
  /** Quellsystem oder Lieferkontext, z. B. `DBRD-Export`, `Pilot-Wache-Dokument`. */
  source: string;
  /**
   * Maschinenlesbarer Verweis auf die konkrete Quelle (Dateiname, Export-ID,
   * Versionsdatum, Seitenangabe o. Ä.).
   */
  sourceReference: string;
  /** Lifecycle-Status der Inhaltszeile (nicht identisch mit App-Bundle-Freigabe). */
  approvalStatus: DbrdNormalizedApprovalStatus;
  /** Zeitpunkt der letzten inhaltlichen oder governance-relevanten Prüfung (ISO 8601). */
  lastReviewedAt: string;
}

// -----------------------------------------------------------------------------
// Gemeinsame Bausteine
// -----------------------------------------------------------------------------

/** Ein Schritt in einem linearen Algorithmus (Reihenfolge explizit, keine Verzweigungsgraphik). */
export interface NormalizedAlgorithmStep {
  /** Laufende Nummer ab 1 — lineare Liste, für Mapping sortierbar. */
  order: number;
  /** Anzeigetext für die App (Phase 1: ein Block pro Schritt). */
  text: string;
  /** Optionaler Kurztitel oder UI-Hinweis, falls später im Seed nicht genutzt, weglassen. */
  title?: string;
}

/**
 * Dosierung als getrennte Freitextebenen — später zusammenführbar zu einem Seed-Feld `dosage`.
 */
export interface NormalizedMedicationDosage {
  /** Kurzfassung / Standardzeile für die Übersicht. */
  summary: string;
  /** Ausführlicher Lesetext (Altergruppen, Wege, Verweise auf Leitfaden). */
  detail?: string;
}

// -----------------------------------------------------------------------------
// NormalizedMedication
// -----------------------------------------------------------------------------

export interface NormalizedMedication {
  /** Diskriminator für Bundles und Validierung. */
  entityType: 'NormalizedMedication';
  /**
   * Stabile ID — soll 1:1 oder per Mapping in `data/lookup-seed/medications.json` → `id` werden.
   */
  id: string;
  /** Anzeigename (Handels-/Fertigarzneimittel oder gängige Bezeichnung). */
  label: string;
  /** Wirkstoff oder INN, falls von `label` abweichend. */
  genericName?: string;
  /** Zusätzliche Handelsnamen / Synonyme für Suche und Mapping zu `searchTerms`. */
  tradeNames?: readonly string[];
  /** Kurze klinische Einordnung (Indikationssummary), entspricht grob Seed `indication`. */
  indication: string;
  /** Kategorien / Schlagwörter für Filter und spätere `tags` im Seed. */
  tags: readonly string[];
  /** Explizite Suchbegriffe inkl. Abkürzungen; Teilmenge kann aus Handelsnamen generiert werden. */
  searchTerms: readonly string[];
  dosage: NormalizedMedicationDosage;
  /**
   * Kontraindikationen / Vorsicht — optional strukturiert; Seed nutzt aktuell vor allem `notes`.
   */
  contraindicationsNote?: string;
  /** Allgemeine Hinweise, Haftungsausschluss, Verweis auf Organisationsprotokoll. */
  clinicalNotes?: string;
  /** Verknüpfungen zu Algorithmus-IDs im gleichen normalisierten Bundle / Ziel-Seed. */
  relatedAlgorithmIds: readonly string[];
  provenance: DbrdNormalizedProvenance;
}

// -----------------------------------------------------------------------------
// NormalizedAlgorithm
// -----------------------------------------------------------------------------

export interface NormalizedAlgorithm {
  entityType: 'NormalizedAlgorithm';
  /** Stabile ID — Ziel: `data/lookup-seed/algorithms.json` → `id`. */
  id: string;
  label: string;
  indication: string;
  tags: readonly string[];
  searchTerms: readonly string[];
  /**
   * Lineare Schrittliste — Reihenfolge über `order`; Mapping zu Seed `{ "text": "..." }`.
   */
  steps: readonly NormalizedAlgorithmStep[];
  /** Langtext zu Risiken / Einschränkungen — Ziel-Feld `warnings` im Seed. */
  warnings?: string;
  clinicalNotes?: string;
  relatedMedicationIds: readonly string[];
  provenance: DbrdNormalizedProvenance;
}

// -----------------------------------------------------------------------------
// Bundle-Hülle (optional, z. B. für JSON-Beispiele und Pipeline)
// -----------------------------------------------------------------------------

/** Container für validierte Einträge vor Aufteilung oder Export. */
export interface DbrdNormalizedContentBundle {
  /** Schema-/Formatkennung für Tools (nicht identisch mit lookup-seed `schemaVersion`). */
  bundleSchemaId: 'dbrd-normalized.examples/v1';
  medications: readonly NormalizedMedication[];
  algorithms: readonly NormalizedAlgorithm[];
}
