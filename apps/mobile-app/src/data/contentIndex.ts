import {
  loadEmbeddedLookupBundle,
  toLookupContentKey,
  type LookupBundleVersionInfo,
  type LookupContentKey,
  type LookupRamStore,
} from '@/lookup/loadLookupBundle';
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
    throw new Error(
      'contentIndex not initialized. Call ensureContentStoreReady() before using content selectors.',
    );
  }
  return store;
}

function applyStore(nextStore: LookupRamStore): LookupRamStore {
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
        throw error instanceof Error
          ? error
          : new Error('Inhalte konnten nicht geladen werden.');
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
