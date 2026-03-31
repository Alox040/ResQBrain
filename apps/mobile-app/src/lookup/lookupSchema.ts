import type { ContentTag, Medication, Algorithm } from '../types/content';

/**
 * Controlled vocabulary — must match `ContentTag` in `types/content.ts`.
 */
export const CONTENT_TAG_VALUES = [
  'kreislauf',
  'atemwege',
  'neurologie',
  'analgesie',
  'intoxikation',
  'stoffwechsel',
] as const satisfies readonly ContentTag[];

const contentTagSet = new Set<string>(CONTENT_TAG_VALUES);

export function isContentTag(value: unknown): value is ContentTag {
  return typeof value === 'string' && contentTagSet.has(value);
}

/**
 * Bundle manifest — Phase 0 only (`docs/context/content-seed-plan.md`).
 * No governance or release-pipeline fields.
 */
export type LookupManifest = {
  schemaVersion: string;
  bundleId: string;
  version?: string;
  createdAt?: string;
  checksum?: string;
  displayName?: string;
  locale?: string;
  contentCutoffDate?: string;
  generatedAt?: string;
};

/** Allowed top-level keys on `manifest.json` (extras rejected). */
export const LOOKUP_MANIFEST_KEYS = new Set([
  'schemaVersion',
  'bundleId',
  'version',
  'createdAt',
  'checksum',
  'displayName',
  'locale',
  'contentCutoffDate',
  'generatedAt',
]);

/**
 * Phase-0 medication record — aligns with `Medication` in `types/content.ts`.
 * No DosageRule, no governance fields.
 */
export const MEDICATION_ITEM_KEYS = new Set([
  'id',
  'kind',
  'label',
  'indication',
  'tags',
  'searchTerms',
  'notes',
  'dosage',
  'relatedAlgorithmIds',
]);

/**
 * Phase-0 algorithm record — aligns with `Algorithm` in `types/content.ts`.
 * Steps are linear `{ text }` only (no branching structure).
 */
export const ALGORITHM_ITEM_KEYS = new Set([
  'id',
  'kind',
  'label',
  'indication',
  'tags',
  'searchTerms',
  'notes',
  'steps',
  'warnings',
  'relatedMedicationIds',
]);

export const ALGORITHM_STEP_KEYS = new Set(['text']);

export type ValidatedLookupBundle = {
  manifest: LookupManifest;
  medications: Medication[];
  algorithms: Algorithm[];
};
