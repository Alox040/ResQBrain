import type { Algorithm, ContentItem, ContentKind, Medication } from '../types/content';
import type { LookupManifest } from './lookupSchema';
import { validateLookupBundle } from './validateLookupBundle';

/** Kanonische Phase-0-Quelle: `data/lookup-seed/` (Repo-Root). */
import manifestJson from '../../../../data/lookup-seed/manifest.json';
import medicationsJson from '../../../../data/lookup-seed/medications.json';
import algorithmsJson from '../../../../data/lookup-seed/algorithms.json';

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

/**
 * In-memory Phase-0 lookup store: validated bundle + indexes for list/search/detail.
 * No persistence, no network, no sync — bundle only.
 */
export type LookupRamStore = {
  manifest: LookupManifest;
  medications: Medication[];
  algorithms: Algorithm[];
  contentItems: ContentItem[];
  contentLookup: Record<LookupContentKey, ContentItem>;
  searchItems: LookupListItem[];
  searchIndexItems: LookupSearchIndexItem[];
  getMedicationById: (medicationId: string) => Medication | undefined;
  getAlgorithmById: (algorithmId: string) => Algorithm | undefined;
};

function buildRamStore(bundle: {
  manifest: LookupManifest;
  medications: Medication[];
  algorithms: Algorithm[];
}): LookupRamStore {
  const { manifest, medications, algorithms } = bundle;

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
 * Loads the embedded Phase-0 JSON bundle, validates it, and returns a RAM-only store.
 * Throws if the bundle is invalid (fail-fast at startup or test).
 */
export function loadLookupBundle(): LookupRamStore {
  const result = validateLookupBundle({
    manifest: manifestJson as unknown,
    medications: medicationsJson as unknown,
    algorithms: algorithmsJson as unknown,
  });

  if (!result.ok) {
    throw new Error(
      `Invalid lookup bundle:\n${result.errors.map((e) => `- ${e}`).join('\n')}`,
    );
  }

  return buildRamStore(result.data);
}
