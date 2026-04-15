/**
 * Phase-2 draft only.
 *
 * Multi-scope resolution for organization/region bundles is intentionally not
 * used in the current app runtime. The active startup path is
 * `loadLookupBundleWithSource()` in `loadLookupBundle.ts`.
 */
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

export type ResolveLookupBundleOptions = {
  organizationId?: string | null;
  regionId?: string | null;
  baseUrl?: string;
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
    version: manifest.version ?? null,
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

function normalizeScopeSegment(value: string | null | undefined): string | null {
  if (typeof value !== 'string') return null;
  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
}

function buildBundleLookupRoots(
  options: ResolveLookupBundleOptions,
): string[] {
  const organizationId = normalizeScopeSegment(options.organizationId);
  const regionId = normalizeScopeSegment(options.regionId);
  const roots: string[] = [];

  if (organizationId && regionId) {
    roots.push(`/bundles/${organizationId}/${regionId}`);
  }

  if (organizationId) {
    roots.push(`/bundles/${organizationId}`);
  }

  roots.push('/bundles/global');
  return roots;
}

function buildScopedBundleFileUrl(
  root: string,
  fileName: 'manifest.json' | 'medications.json' | 'algorithms.json',
  baseUrl?: string,
): string {
  const relativePath = `${root}/${fileName}`.replace(/\/{2,}/g, '/');
  if (!baseUrl) {
    return relativePath;
  }

  return new URL(relativePath.replace(/^\//, ''), baseUrl).toString();
}

async function fetchJson(url: string): Promise<unknown> {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return (await response.json()) as unknown;
}

async function tryLoadScopedBundle(
  options: ResolveLookupBundleOptions,
): Promise<LookupBundleSnapshot | null> {
  const roots = buildBundleLookupRoots(options);

  for (const root of roots) {
    try {
      const [manifest, medications, algorithms] = await Promise.all([
        fetchJson(buildScopedBundleFileUrl(root, 'manifest.json', options.baseUrl)),
        fetchJson(buildScopedBundleFileUrl(root, 'medications.json', options.baseUrl)),
        fetchJson(buildScopedBundleFileUrl(root, 'algorithms.json', options.baseUrl)),
      ]);

      const snapshot = validateSnapshot({
        manifest: manifest as LookupBundleSnapshot['manifest'],
        medications: medications as LookupBundleSnapshot['medications'],
        algorithms: algorithms as LookupBundleSnapshot['algorithms'],
      });

      if (snapshot) {
        return snapshot;
      }
    } catch {
      // Try next root in the lookup chain.
    }
  }

  return null;
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

export async function resolveLookupBundle(
  options: ResolveLookupBundleOptions = {},
): Promise<ResolvedLookupBundle> {
  const resolvedBundle = await tryLoadScopedBundle(options);
  if (resolvedBundle) {
    return buildResolvedBundle(resolvedBundle, 'resolved');
  }

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
