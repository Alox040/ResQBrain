import {
  buildLookupRamStore,
  loadEmbeddedLookupBundle,
  loadLookupBundleWithSource,
  type LookupRamStore,
} from './loadLookupBundle';
import type { LookupManifest } from './lookupSchema';

/**
 * Which physical layer supplied the active in-memory lookup store.
 *
 * - **embedded** — JSON shipped with the app (`data/lookup-seed/`), validated at load.
 * - **cached** — warm on-device copy previously persisted from embedded or an update.
 * - **updated** — bundle applied from a remote sync pipeline.
 * - **fallback** — minimal emergency bundle when all other layers are missing or corrupt.
 */
export type LookupSource =
  | 'embedded'
  | 'cached'
  | 'updated'
  | 'fallback';

/** @deprecated Use `LookupSource` */
export type LookupProvisionSource = LookupSource;

/**
 * Extracted manifest fields used for diagnostics and update checks.
 * Maps directly to `LookupManifest` fields.
 */
export type BundleMeta = {
  bundleId: string;
  generatedAt: string | null;
  schemaVersion: string;
};

export type LookupSourceDescriptor = {
  provisionSource: LookupSource;
  manifest: LookupManifest;
};

let activeStore: LookupRamStore | null = null;

/** Set alongside `activeStore` whenever resolution logic picks a layer (today always `embedded`). */
let activeProvisionSource: LookupSource = 'embedded';

type LookupLoadedSource = 'cached' | 'embedded';

let loadPromise: Promise<LookupLoadedSource> | null = null;

const SAFE_EMBEDDED_FALLBACK_MANIFEST: LookupManifest = {
  schemaVersion: '1',
  bundleId: 'embedded-fallback',
  version: '0',
};

function logLookupLoadError(layer: string, error: unknown): void {
  console.error(`[lookup] failed to load ${layer} bundle`, error);
}

function loadEmbeddedStoreSafely(): LookupRamStore {
  try {
    return loadEmbeddedLookupBundle();
  } catch (error) {
    logLookupLoadError('embedded', error);
    return buildLookupRamStore({
      manifest: SAFE_EMBEDDED_FALLBACK_MANIFEST,
      medications: [],
      algorithms: [],
    });
  }
}

/**
 * Phase-2 provisioning: cached → embedded.
 *
 * Call once at app start; safe to call multiple times (dedupes via `loadPromise`).
 */
export async function loadLookupSource(): Promise<LookupLoadedSource> {
  if (activeStore) return activeProvisionSource === 'cached' ? 'cached' : 'embedded';
  if (!loadPromise) {
    loadPromise = (async () => {
      try {
        const result = await loadLookupBundleWithSource();
        activeProvisionSource = result.source;
        activeStore = result.store;
        return result.source;
      } catch (error) {
        logLookupLoadError('cached', error);
        activeProvisionSource = 'embedded';
        activeStore = loadEmbeddedStoreSafely();
        return 'embedded' as const;
      } finally {
        loadPromise = null;
      }
    })();
  }
  return loadPromise;
}

/**
 * Initializes the in-memory lookup store after {@link loadLookupSource}.
 *
 * Today this is a small explicit step so App startup can:
 * `const bundle = await loadLookupSource(); initializeLookupStore(bundle);`
 */
export function initializeLookupStore(_bundle: LookupLoadedSource): void {
  // `loadLookupSource` already sets `activeStore`; this ensures late callers
  // (or future refactors) still get a RAM store deterministically.
  resolveActiveLookupStore();
}

/**
 * Resolves the singleton RAM store for the app process.
 *
 * **Current behavior:** loads and validates the embedded seed bundle once (see `loadLookupBundle`).
 *
 * **Future (not implemented):** try, in order, updated → cached → fallback → embedded, assign
 * `activeProvisionSource` when a layer wins, then cache `activeStore`.
 */
function resolveActiveLookupStore(): LookupRamStore {
  if (activeStore) {
    return activeStore;
  }

  // Future: const updated = tryLoadUpdatedBundleStore();
  // if (updated) { activeProvisionSource = 'updated'; activeStore = updated; return activeStore; }
  // Future: const cached = tryLoadCachedBundleStore();
  // …
  // Future: const fallback = tryLoadFallbackBundleStore();
  // …

  // If the app forgot to call `loadLookupSource()` at startup, fall back to the embedded seed.
  activeProvisionSource = 'embedded';
  activeStore = loadEmbeddedStoreSafely();
  return activeStore;
}

/** In-memory lookup indexes + entities — same shape as today’s `contentIndex` backing store. */
export function getActiveLookupStore(): LookupRamStore {
  return resolveActiveLookupStore();
}

/**
 * Provisioning label for the active bundle.
 * Today always `'embedded'`; will differ once optional layers exist.
 */
export function getActiveLookupProvisionSource(): LookupSource {
  resolveActiveLookupStore();
  return activeProvisionSource;
}

/** Manifest metadata for the bundle currently backing the active store (from validated seed JSON today). */
export function getLookupManifest(): LookupManifest {
  return resolveActiveLookupStore().manifest;
}

/** Snapshot for settings/diagnostics — no network; safe to call anytime after first bundle resolution. */
export function describeLookupSource(): LookupSourceDescriptor {
  return {
    provisionSource: getActiveLookupProvisionSource(),
    manifest: getLookupManifest(),
  };
}
