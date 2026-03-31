import { loadLookupBundle } from './loadLookupBundle';
import { loadBundle, loadUpdatedBundle, type LookupBundleSnapshot } from './lookupCache';
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
    version: bundle.manifest.version ?? bundle.manifest.bundleId,
  };
}

export async function resolveLookupBundle(): Promise<ResolvedLookupBundle> {
  const updatedBundle = validateSnapshot(await loadUpdatedBundle());
  if (updatedBundle) {
    return buildResolvedBundle(updatedBundle, LookupSource.UPDATED);
  }

  const cachedBundle = validateSnapshot(await loadBundle());
  if (cachedBundle) {
    return buildResolvedBundle(cachedBundle, LookupSource.CACHED);
  }

  const embeddedStore = loadLookupBundle();
  const embeddedBundle = toSnapshot({
    manifest: embeddedStore.manifest,
    medications: embeddedStore.medications,
    algorithms: embeddedStore.algorithms,
  });

  return buildResolvedBundle(embeddedBundle, LookupSource.EMBEDDED);
}
