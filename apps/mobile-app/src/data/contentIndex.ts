import {
  toLookupContentKey,
  type LookupBundleVersionInfo,
  type LookupContentKey,
} from '@/lookup/loadLookupBundle';
import type { LookupRamStore } from '@/lookup/loadLookupBundle';
import type { Algorithm, ContentItem, ContentKind, ContentListItem, Medication } from '@/types/content';

let store: LookupRamStore | null = null;

export type ContentKey = LookupContentKey;

export function toContentKey(kind: ContentKind, id: string): ContentKey {
  return toLookupContentKey(kind, id);
}

function requireStore(): LookupRamStore {
  if (!store) {
    throw new Error(
      'contentIndex not initialized. Call initializeContent(bundle) before using content selectors.',
    );
  }
  return store;
}

/**
 * Inject the active lookup bundle (cached or embedded) into the app-level content index.
 * Must be called before screens render.
 */
export function initializeContent(bundle: LookupRamStore): void {
  store = bundle;
  medications = bundle.medications;
  algorithms = bundle.algorithms;
  contentItems = bundle.contentItems;
  contentLookup = bundle.contentLookup;
  searchItems = bundle.searchItems;
  searchIndexItems = bundle.searchIndexItems;
}

/**
 * Throws when callers access content selectors before `App.tsx` has injected the
 * canonical lookup bundle via `initializeContent(bundle)`.
 */
export function assertContentInitialized(): void {
  requireStore();
}

/** Live bindings updated by {@link initializeContent}. */
export let medications: Medication[] = [];
export let algorithms: Algorithm[] = [];
export let contentItems: ContentItem[] = [];
export let contentLookup: Record<ContentKey, ContentItem> = {};
export let searchItems: ContentListItem[] = [];

export type SearchIndexItem = ContentListItem & {
  searchTerms: string[];
};

export let searchIndexItems: SearchIndexItem[] = [];

export function getContentVersionInfo(): LookupBundleVersionInfo {
  return requireStore().versionInfo;
}

export function getMedicationById(medicationId: string): Medication | undefined {
  return requireStore().getMedicationById(medicationId);
}

export function getAlgorithmById(algorithmId: string): Algorithm | undefined {
  return requireStore().getAlgorithmById(algorithmId);
}
