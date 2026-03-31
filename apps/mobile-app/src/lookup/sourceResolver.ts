import { loadBundle as loadUpdatedBundle } from './bundleStorage';
import { loadLookupBundle } from './loadLookupBundle';
import { loadBundle as loadCachedBundle, type LookupBundleSnapshot } from './lookupCache';
import type { LookupManifest } from './lookupSchema';
import { validateLookupBundle } from './validateLookupBundle';

export enum LookupSource {
  EMBEDDED = 'embedded',
  CACHED = 'cached',
  UPDATED = 'updated',
}

export type ResolvedLookupBundle = {
  bundle: LookupBundleSnapshot;
  source: LookupSource;
  version: string;
};

const SAFE_FALLBACK_MANIFEST: LookupManifest = {
  schemaVersion: '1',
  bundleId: 'safe-fallback',
  version: '0',
};

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

function buildResolvedBundle(
  bundle: LookupBundleSnapshot,
  source: LookupSource,
): ResolvedLookupBundle {
  return {
    bundle,
    source,
    version: bundle.manifest.version ?? bundle.manifest.bundleId ?? '0',
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
    const embeddedStore = loadLookupBundle();
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
    return buildResolvedBundle(updatedBundle, LookupSource.UPDATED);
  }

  const cachedBundle = await tryLoadCachedBundle();
  if (cachedBundle) {
    return buildResolvedBundle(cachedBundle, LookupSource.CACHED);
  }

  const embeddedBundle = tryLoadEmbeddedBundle();
  if (embeddedBundle) {
    return buildResolvedBundle(embeddedBundle, LookupSource.EMBEDDED);
  }

  return buildResolvedBundle(buildSafeFallbackBundle(), LookupSource.EMBEDDED);
}
