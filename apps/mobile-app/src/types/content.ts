// ─── Discriminant ────────────────────────────────────────────────────────────

/**
 * Identifies the content type app-wide.
 * Used as discriminant in ContentItem union and as navigation/search kind tag.
 */
export type ContentKind = 'medication' | 'algorithm';

// ─── Tag taxonomy ────────────────────────────────────────────────────────────

/**
 * Controlled vocabulary for thematic grouping.
 * Used for filtering and visual categorisation in Phase 0.
 *
 * kreislauf    — cardiovascular/circulatory
 * atemwege     — airway/respiratory
 * neurologie   — neurological/CNS
 * analgesie    — pain management and sedation
 * intoxikation — toxicology and overdose
 * stoffwechsel — metabolic and endocrine
 */
export type ContentTag =
  | 'kreislauf'
  | 'atemwege'
  | 'neurologie'
  | 'analgesie'
  | 'intoxikation'
  | 'stoffwechsel';

// ─── Shared base ─────────────────────────────────────────────────────────────

/**
 * id           — app-wide stable slug, used as navigation param and lookup key
 * kind         — discriminant; enables narrowing without instanceof checks
 * label        — single primary display text across all views (list, detail header, search)
 * indication   — when/why this item is used; shown as list subtitle and matched in search
 * tags         — one or more thematic tags from ContentTag; used for grouping and filtering
 * searchTerms  — synonyms, trade names, abbreviations; matched in search but not displayed
 * notes        — optional clinical clarification; detail view only, never in list or search
 */
type ContentBase = {
  id: string;
  kind: ContentKind;
  label: string;
  indication: string;
  tags: ContentTag[];
  searchTerms: string[];
  notes?: string;
};

// ─── Medication ──────────────────────────────────────────────────────────────

/**
 * dosage              — dose amounts and intervals; required; shown in detail only
 * administration      — routes of administration, e.g. 'i.v., i.o., i.m.'; optional
 * contraindications   — absolute or critical relative CIs relevant for EMS; optional
 * relatedAlgorithmIds — IDs of algorithms that reference this medication
 */
export type Medication = ContentBase & {
  kind: 'medication';
  dosage: string;
  administration?: string;
  contraindications?: string;
  relatedAlgorithmIds: string[];
};

// ─── Algorithm ───────────────────────────────────────────────────────────────

/**
 * No id on AlgorithmStep: steps are not individually navigated or referenced.
 * Array index is sufficient as React key in Phase 0.
 *
 * text — one action in the procedure sequence; imperative, max one sentence
 */
export type AlgorithmStep = {
  text: string;
};

/**
 * steps               — ordered procedure steps; rendered in sequence, no branching
 * redFlags            — specific clinical danger signs requiring immediate action;
 *                       visually distinct from notes (amber card)
 * relatedMedicationIds — IDs of medications used in this algorithm
 */
export type Algorithm = ContentBase & {
  kind: 'algorithm';
  steps: AlgorithmStep[];
  redFlags?: string;
  relatedMedicationIds: string[];
};

// ─── Union ───────────────────────────────────────────────────────────────────

/** Discriminated union over all content types. Narrow with item.kind. */
export type ContentItem = Medication | Algorithm;

// ─── UI projection ───────────────────────────────────────────────────────────

/**
 * Minimal shape for list rows and search results.
 * Derived from ContentItem — do not store fields that don't come from the data.
 *
 * label    — = item.label
 * subtitle — = item.indication; always present, always shown below label
 * kind     — preserved so the UI can route to the correct detail screen
 */
export type ContentListItem = {
  id: string;
  kind: ContentKind;
  label: string;
  subtitle: string;
};
