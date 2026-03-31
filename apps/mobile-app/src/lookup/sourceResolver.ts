import { loadBundle as loadUpdatedBundle } from './bundleStorage';
import { loadEmbeddedLookupBundle } from './loadLookupBundle';
import { loadBundle as loadCachedBundle, type LookupBundleSnapshot } from './lookupCache';
import type { BundleMeta, LookupSource } from './lookupSource';
import { validateLookupBundle } from './validateLookupBundle';

export type { LookupSource } from './lookupSource';

export type ResolvedLookupBundle = {
  source: LookupSource;
  bundle: LookupBundleSnapshot;
  meta: BundleMeta;
};

const SAFE_FALLBACK_MANIFEST = {
  schemaVersion: '1',
  bundleId: 'safe-fallback',
  version: '0',
} as const;

function toSnapshot(bundle: LookupBundleSnapshot): LookupBundleSnapshot {
  return {
    manifest: bundle.manifest,
    medications: bundle.medications,
    algorithms: bundle.algorithms,
  };
}

function validateSnapshot(
  snapshot: LookupBundleSnapshot | null,
): LookupBundleSnapshot | null {
  if (!snapshot) return null;

  const result = validateLookupBundle({
    manifest: snapshot.manifest as unknown,
    medications: snapshot.medications as unknown,
    algorithms: snapshot.algorithms as unknown,
  });

  if (!result.ok) {
    return null;
  }

  return {
    manifest: result.data.manifest,
    medications: result.data.medications,
    algorithms: result.data.algorithms,
  };
}

function extractMeta(manifest: LookupBundleSnapshot['manifest']): BundleMeta {
  return {
    bundleId: manifest.bundleId,
    generatedAt: manifest.generatedAt ?? manifest.createdAt ?? null,
    schemaVersion: manifest.schemaVersion,
  };
}

function buildResolvedBundle(
  bundle: LookupBundleSnapshot,
  source: LookupSource,
): ResolvedLookupBundle {
  return {
    source,
    bundle,
    meta: extractMeta(bundle.manifest),
  };
}

function buildSafeFallbackBundle(): LookupBundleSnapshot {
  return {
    manifest: SAFE_FALLBACK_MANIFEST,
    medications: [],
    algorithms: [],
  };
}

async function tryLoadUpdatedBundle(): Promise<LookupBundleSnapshot | null> {
  try {
    return validateSnapshot(await loadUpdatedBundle());
  } catch {
    return null;
  }
}

async function tryLoadCachedBundle(): Promise<LookupBundleSnapshot | null> {
  try {
    return validateSnapshot(await loadCachedBundle());
  } catch {
    return null;
  }
}

function tryLoadEmbeddedBundle(): LookupBundleSnapshot | null {
  try {
    const embeddedStore = loadEmbeddedLookupBundle();
    return toSnapshot({
      manifest: embeddedStore.manifest,
      medications: embeddedStore.medications,
      algorithms: embeddedStore.algorithms,
    });
  } catch {
    return null;
  }
}

export async function resolveLookupBundle(): Promise<ResolvedLookupBundle> {
  const updatedBundle = await tryLoadUpdatedBundle();
  if (updatedBundle) {
    return buildResolvedBundle(updatedBundle, 'updated');
  }

  const cachedBundle = await tryLoadCachedBundle();
  if (cachedBundle) {
    return buildResolvedBundle(cachedBundle, 'cached');
  }

  const embeddedBundle = tryLoadEmbeddedBundle();
  if (embeddedBundle) {
    return buildResolvedBundle(embeddedBundle, 'embedded');
  }

  return buildResolvedBundle(buildSafeFallbackBundle(), 'fallback');
}
