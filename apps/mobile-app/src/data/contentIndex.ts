import {
  toLookupContentKey,
  type LookupContentKey,
} from '@/lookup/loadLookupBundle';
import { getActiveLookupStore } from '@/lookup/lookupSource';
import type { Algorithm, ContentItem, ContentKind, ContentListItem, Medication } from '@/types/content';

const store = getActiveLookupStore();

export type ContentKey = LookupContentKey;

export function toContentKey(kind: ContentKind, id: string): ContentKey {
  return toLookupContentKey(kind, id);
}

/** Active RAM store: embedded seed via `@/lookup/lookupSource` (validated at first resolve). */
export const medications: Medication[] = store.medications;

/** Active RAM store: embedded seed via `@/lookup/lookupSource` (validated at first resolve). */
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
