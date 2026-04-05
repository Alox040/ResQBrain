import type { AlgorithmStep, ContentCategory, ContentTag } from '@/types/content';

/**
 * UI-facing medication shape — decoupled from bundle/entity types for future migration.
 * Source today: validated lookup bundle (`Medication`).
 */
export type MedicationViewModel = {
  id: string;
  kind: 'medication';
  label: string;
  indication: string;
  /** Line under title in lists (Phase 0: mirrors indication). */
  listSubtitle: string;
  tags: ContentTag[];
  category?: ContentCategory;
  searchTerms: string[];
  notes?: string;
  dosage: string;
  relatedAlgorithmIds: string[];
};

/**
 * UI-facing algorithm shape — decoupled from bundle/entity types for future migration.
 * Source today: validated lookup bundle (`Algorithm`).
 */
export type AlgorithmViewModel = {
  id: string;
  kind: 'algorithm';
  label: string;
  indication: string;
  listSubtitle: string;
  tags: ContentTag[];
  category?: ContentCategory;
  searchTerms: string[];
  notes?: string;
  warnings?: string;
  steps: AlgorithmStep[];
  relatedMedicationIds: string[];
};

export type ContentViewModel = MedicationViewModel | AlgorithmViewModel;
