import {
  loadEmbeddedLookupBundle,
  toLookupContentKey,
  type LookupBundleVersionInfo,
  type LookupContentKey,
  type LookupRamStore,
} from '@/lookup/loadLookupBundle';
import {
  isLookupContentError,
  LookupContentError,
} from '@/lookup/lookupErrors';
import type {
  Algorithm,
  ContentItem,
  ContentKind,
  ContentListItem,
  Medication,
} from '@/types/content';

let store: LookupRamStore | null = null;
let initializationPromise: Promise<LookupRamStore> | null = null;

export type ContentKey = LookupContentKey;

export function toContentKey(kind: ContentKind, id: string): ContentKey {
  return toLookupContentKey(kind, id);
}

function requireStore(): LookupRamStore {
  if (!store) {
    throw new LookupContentError({
      code: 'LOOKUP_CONTENT_STORE_NOT_READY',
      message:
        'Lookup content store was accessed before initialization. Call ensureContentStoreReady() first.',
    });
  }
  return store;
}

function applyStore(nextStore: LookupRamStore): LookupRamStore {
  if (nextStore.contentItems.length === 0) {
    throw new LookupContentError({
      code: 'LOOKUP_CONTENT_STORE_EMPTY',
      message: 'Lookup content store is empty after initialization.',
    });
  }

  store = nextStore;
  return nextStore;
}

/**
 * The only productive initialization entry point for the mobile lookup content.
 * Idempotent: repeated calls simply replace the active in-memory snapshot.
 */
export function initializeContentFromLookupBundle(
  bundle: LookupRamStore,
): LookupRamStore {
  initializationPromise = Promise.resolve(bundle);
  return applyStore(bundle);
}

/**
 * Canonical readiness guard for feature data access.
 * Loads the embedded lookup bundle on first use and reuses the same promise for
 * concurrent callers.
 */
export async function ensureContentStoreReady(): Promise<LookupRamStore> {
  if (store) {
    return store;
  }

  if (!initializationPromise) {
    initializationPromise = Promise.resolve()
      .then(() => loadEmbeddedLookupBundle())
      .then((bundle) => initializeContentFromLookupBundle(bundle))
      .catch((error) => {
        initializationPromise = null;
        if (isLookupContentError(error)) {
          throw error;
        }

        throw new LookupContentError({
          code: 'LOOKUP_CONTENT_INITIALIZATION_FAILED',
          message: 'Lookup content initialization failed.',
          cause: error,
        });
      });
  }

  return initializationPromise;
}

/**
 * Throws when callers access content selectors before the store is ready.
 */
export function assertContentInitialized(): void {
  requireStore();
}

export type SearchIndexItem = ContentListItem & {
  searchTerms: string[];
};

export function getContentStoreSnapshot(): LookupRamStore {
  return requireStore();
}

export function getMedicationItems(): Medication[] {
  return requireStore().medications;
}

export function getAlgorithmItems(): Algorithm[] {
  return requireStore().algorithms;
}

export function getContentItems(): ContentItem[] {
  return requireStore().contentItems;
}

export function getContentLookup(): Record<ContentKey, ContentItem> {
  return requireStore().contentLookup;
}

export function getSearchItems(): ContentListItem[] {
  return requireStore().searchItems;
}

export function getSearchIndexItems(): SearchIndexItem[] {
  return requireStore().searchIndexItems;
}

export function getContentVersionInfo(): LookupBundleVersionInfo {
  return requireStore().versionInfo;
}

export function getMedicationById(medicationId: string): Medication | undefined {
  return requireStore().getMedicationById(medicationId);
}

export function getAlgorithmById(algorithmId: string): Algorithm | undefined {
  return requireStore().getAlgorithmById(algorithmId);
}
