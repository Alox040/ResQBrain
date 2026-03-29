import {
  loadLookupBundle,
  toLookupContentKey,
  type LookupContentKey,
} from '@/lookup/loadLookupBundle';
import type { Algorithm, ContentItem, ContentKind, ContentListItem, Medication } from '@/types/content';

const store = loadLookupBundle();

export type ContentKey = LookupContentKey;

export function toContentKey(kind: ContentKind, id: string): ContentKey {
  return toLookupContentKey(kind, id);
}

/** Single source: `data/lookup-seed/` → `loadLookupBundle()` → validiert. */
export const medications: Medication[] = store.medications;

/** Single source: `data/lookup-seed/` → `loadLookupBundle()` → validiert. */
export const algorithms: Algorithm[] = store.algorithms;

export const contentItems: ContentItem[] = store.contentItems;

export const contentLookup: Record<ContentKey, ContentItem> = store.contentLookup;

export const searchItems: ContentListItem[] = store.searchItems;

export type SearchIndexItem = ContentListItem & {
  searchTerms: string[];
};

export const searchIndexItems: SearchIndexItem[] = store.searchIndexItems;

export function getMedicationById(medicationId: string): Medication | undefined {
  return store.getMedicationById(medicationId);
}

export function getAlgorithmById(algorithmId: string): Algorithm | undefined {
  return store.getAlgorithmById(algorithmId);
}
