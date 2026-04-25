import type { Algorithm, ContentItem, ContentKind, Medication } from '../types/content';
import type { LookupManifest } from './lookupSchema';
import { isNewerBundle } from './lookupBundleVersion';
import { loadAndValidateBundle } from './lookupCache';
import { LookupContentError } from './lookupErrors';
import { validateLookupBundle } from './validateLookupBundle';

/** Kanonische Phase-0-Quelle: `apps/mobile-app/data/lookup-seed/`. */
import manifestJson from '../../data/lookup-seed/manifest.json';
import medicationsJson from '../../data/lookup-seed/medications.json';
import algorithmsJson from '../../data/lookup-seed/algorithms.json';

/** Stable key for map lookup — matches `contentIndex` convention. */
export type LookupContentKey = `${ContentKind}:${string}`;

export function toLookupContentKey(kind: ContentKind, id: string): LookupContentKey {
  return `${kind}:${id}` as LookupContentKey;
}

export type LookupListItem = {
  id: string;
  kind: ContentKind;
  label: string;
  subtitle: string;
};

export type LookupSearchIndexItem = LookupListItem & {
  searchTerms: string[];
};

export type LookupBundleVersionInfo = {
  version: string | null;
  createdAt: string | null;
  checksum: string | null;
};

/**
 * In-memory Phase-0 lookup store: validated bundle + indexes for list/search/detail.
 * No persistence, no network, no sync — bundle only.
 */
export type LookupRamStore = {
  manifest: LookupManifest;
  versionInfo: LookupBundleVersionInfo;
  medications: Medication[];
  algorithms: Algorithm[];
  contentItems: ContentItem[];
  contentLookup: Record<LookupContentKey, ContentItem>;
  searchItems: LookupListItem[];
  searchIndexItems: LookupSearchIndexItem[];
  getMedicationById: (medicationId: string) => Medication | undefined;
  getAlgorithmById: (algorithmId: string) => Algorithm | undefined;
};

export type LookupLoadedBundleSource = 'embedded' | 'cached';

export type LoadedLookupBundle = {
  source: LookupLoadedBundleSource;
  store: LookupRamStore;
};

let embeddedStoreCache: LookupRamStore | null = null;

export function buildLookupRamStore(bundle: {
  manifest: LookupManifest;
  medications: Medication[];
  algorithms: Algorithm[];
}): LookupRamStore {
  const { manifest, medications, algorithms } = bundle;
  const versionInfo: LookupBundleVersionInfo = {
    version: manifest.version ?? null,
    createdAt: manifest.createdAt ?? manifest.generatedAt ?? null,
    checksum: manifest.checksum ?? null,
  };

  const contentItems: ContentItem[] = [...medications, ...algorithms];

  const contentLookup = Object.fromEntries(
    contentItems.map((item) => [toLookupContentKey(item.kind, item.id), item]),
  ) as Record<LookupContentKey, ContentItem>;

  const searchItems: LookupListItem[] = contentItems.map((item) => ({
    id: item.id,
    kind: item.kind,
    label: item.label,
    subtitle: item.indication,
  }));

  const searchIndexItems: LookupSearchIndexItem[] = contentItems.map((item) => ({
    id: item.id,
    kind: item.kind,
    label: item.label,
    subtitle: item.indication,
    searchTerms: item.searchTerms,
  }));

  function getMedicationById(medicationId: string): Medication | undefined {
    const item = contentLookup[toLookupContentKey('medication', medicationId)];
    return item?.kind === 'medication' ? item : undefined;
  }

  function getAlgorithmById(algorithmId: string): Algorithm | undefined {
    const item = contentLookup[toLookupContentKey('algorithm', algorithmId)];
    return item?.kind === 'algorithm' ? item : undefined;
  }

  return {
    manifest,
    versionInfo,
    medications,
    algorithms,
    contentItems,
    contentLookup,
    searchItems,
    searchIndexItems,
    getMedicationById,
    getAlgorithmById,
  };
}

/**
 * Loads and validates the embedded Phase-0 JSON bundle.
 * Throws if the bundle is invalid (fail-fast at startup or test).
 */
export function loadEmbeddedLookupBundle(): LookupRamStore {
  if (embeddedStoreCache) {
    return embeddedStoreCache;
  }

  if (manifestJson == null || medicationsJson == null || algorithmsJson == null) {
    throw new LookupContentError({
      code: 'LOOKUP_EMBEDDED_BUNDLE_MISSING',
      message: 'Embedded lookup bundle is missing required JSON assets.',
    });
  }

  const result = validateLookupBundle({
    manifest: manifestJson as unknown,
    medications: medicationsJson as unknown,
    algorithms: algorithmsJson as unknown,
  });

  if (!result.ok) {
    throw new LookupContentError({
      code: 'LOOKUP_BUNDLE_INVALID',
      message: `Invalid lookup bundle:\n${result.errors.map((e) => `- ${e}`).join('\n')}`,
      details: result.errors,
    });
  }

  embeddedStoreCache = buildLookupRamStore(result.data);
  return embeddedStoreCache;
}

export async function loadLookupBundleWithSource(): Promise<LoadedLookupBundle> {
  const embeddedStore = loadEmbeddedLookupBundle();
  const cachedBundle = await loadAndValidateBundle();

  if (cachedBundle.found && isNewerBundle(cachedBundle.snapshot, embeddedStore)) {
    return {
      source: 'cached',
      store: buildLookupRamStore(cachedBundle.snapshot),
    };
  }

  return {
    source: 'embedded',
    store: embeddedStore,
  };
}

/**
 * Loads embedded data first, then prefers a stored bundle only when it is newer.
 */
export async function loadLookupBundle(): Promise<LookupRamStore> {
  const result = await loadLookupBundleWithSource();
  return result.store;
}
