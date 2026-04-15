/**
 * Phase-2 draft only.
 *
 * This singleton provisioning layer is intentionally not used by `App.tsx`.
 * Runtime startup is canonicalized via `loadLookupBundleWithSource()` in
 * `loadLookupBundle.ts` plus `initializeContent()` in `contentIndex.ts`.
 *
 * Keep this file as a reference for future multi-layer provisioning work, but
 * do not wire new runtime callers to it in Phase 0/1.
 */
import {
  buildLookupRamStore,
  loadEmbeddedLookupBundle,
  type LookupRamStore,
} from './loadLookupBundle';
import { isNewerBundle } from './lookupBundleVersion';
import { loadAndValidateBundle, saveBundle } from './lookupCache';
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
  | 'resolved'
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
  version: string | null;
  generatedAt: string | null;
  schemaVersion: string;
};

export type LookupSourceDescriptor = {
  provisionSource: LookupSource;
  manifest: LookupManifest;
};

export type LookupSourceResult = {
  source: LookupSource;
  store: LookupRamStore;
  fromCache: boolean;
};

let activeStore: LookupRamStore | null = null;

/** Set alongside `activeStore` whenever resolution logic picks the winning layer. */
let activeProvisionSource: LookupSource = 'embedded';

type LookupLayerOutcome =
  | { ok: true; store: LookupRamStore; source: LookupSource }
  | { ok: false; reason: string };

let loadPromise: Promise<LookupSourceResult> | null = null;

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

async function tryLoadCachedLayer(): Promise<LookupLayerOutcome> {
  try {
    const result = await loadAndValidateBundle();
    if (!result.found) {
      return { ok: false, reason: 'cache-miss' };
    }

    let embedded: LookupRamStore;
    try {
      embedded = loadEmbeddedLookupBundle();
    } catch {
      return {
        ok: true,
        source: 'cached',
        store: buildLookupRamStore(result.snapshot),
      };
    }

    if (!isNewerBundle(result.snapshot, embedded)) {
      return { ok: false, reason: 'cache-stale' };
    }

    return {
      ok: true,
      source: 'cached',
      store: buildLookupRamStore(result.snapshot),
    };
  } catch (error) {
    logLookupLoadError('cached', error);
    return { ok: false, reason: 'cache-error' };
  }
}

function tryLoadEmbeddedLayer(): LookupLayerOutcome {
  try {
    return {
      ok: true,
      source: 'embedded',
      store: loadEmbeddedLookupBundle(),
    };
  } catch (error) {
    logLookupLoadError('embedded', error);
    return { ok: false, reason: 'embedded-error' };
  }
}

function buildSafeFallbackStore(): LookupRamStore {
  return buildLookupRamStore({
    manifest: SAFE_EMBEDDED_FALLBACK_MANIFEST,
    medications: [],
    algorithms: [],
  });
}

/**
 * Phase-2 provisioning: cached -> embedded -> fallback.
 *
 * Call once at app start; safe to call multiple times (dedupes via `loadPromise`).
 */
export async function loadLookupSource(): Promise<LookupSourceResult> {
  if (activeStore) {
    return {
      source: activeProvisionSource,
      store: activeStore,
      fromCache: activeProvisionSource === 'cached',
    };
  }
  if (!loadPromise) {
    loadPromise = (async () => {
      try {
        const cached = await tryLoadCachedLayer();
        if (cached.ok) {
          activeProvisionSource = cached.source;
          activeStore = cached.store;
          return {
            source: cached.source,
            store: cached.store,
            fromCache: true,
          };
        }

        const embedded = tryLoadEmbeddedLayer();
        if (embedded.ok) {
          activeProvisionSource = embedded.source;
          activeStore = embedded.store;
          void saveBundle({
            manifest: embedded.store.manifest,
            medications: embedded.store.medications,
            algorithms: embedded.store.algorithms,
          });
          return {
            source: embedded.source,
            store: embedded.store,
            fromCache: false,
          };
        }

        activeProvisionSource = 'fallback';
        activeStore = buildSafeFallbackStore();
        return {
          source: 'fallback',
          store: activeStore,
          fromCache: false,
        };
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
 * `const result = await loadLookupSource(); initializeLookupStore(result);`
 */
export function initializeLookupStore(_bundle: LookupSourceResult): void {
  // `loadLookupSource` already sets `activeStore`; this ensures late callers
  // (or future refactors) still get a RAM store deterministically.
  resolveActiveLookupStore();
}

/**
 * Resolves the singleton RAM store for the app process.
 *
 * If startup provisioning was skipped, this falls back to the embedded seed and, if needed,
 * to a minimal safe bundle to keep the app bootable.
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
