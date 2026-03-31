import { buildLookupRamStore, loadLookupBundle, type LookupRamStore } from './loadLookupBundle';
import type { LookupManifest } from './lookupSchema';
import { loadBundle, saveBundle } from '@/lookup/lookupCache';
import { validateLookupBundle } from '@/lookup/validateLookupBundle';

/**
 * Which physical layer supplied the active in-memory lookup store.
 *
 * - **embedded** — JSON shipped with the app (`data/lookup-seed/`), validated at load. **Only layer used today.**
 * - **updated** — reserved: bundle from a future offline update / sync pipeline (e.g. downloaded artifact applied to disk).
 * - **cached** — reserved: warm or secondary on-device copy (e.g. last-known-good snapshot separate from “updated”).
 * - **fallback** — reserved: minimal emergency bundle when updated/cached data is missing or corrupt.
 */
export type LookupProvisionSource =
  | 'embedded'
  | 'updated'
  | 'cached'
  | 'fallback';

export type LookupSourceDescriptor = {
  provisionSource: LookupProvisionSource;
  manifest: LookupManifest;
};

let activeStore: LookupRamStore | null = null;

/** Set alongside `activeStore` whenever resolution logic picks a layer (today always `embedded`). */
let activeProvisionSource: LookupProvisionSource = 'embedded';

type LookupLoadedSource = 'cached' | 'embedded';

let loadPromise: Promise<LookupLoadedSource> | null = null;

/**
 * Phase-2 provisioning: cached → embedded.
 *
 * Call once at app start; safe to call multiple times (dedupes via `loadPromise`).
 */
export async function loadLookupSource(): Promise<LookupLoadedSource> {
  if (activeStore) return activeProvisionSource === 'cached' ? 'cached' : 'embedded';
  if (!loadPromise) {
    loadPromise = (async () => {
      const cached = await loadBundle().catch(() => null);
      if (cached) {
        const res = validateLookupBundle({
          manifest: cached.manifest as unknown,
          medications: cached.medications as unknown,
          algorithms: cached.algorithms as unknown,
        });
        if (res.ok) {
          activeProvisionSource = 'cached';
          activeStore = buildLookupRamStore(res.data);
          return 'cached' as const;
        }
      }
      activeProvisionSource = 'embedded';
      activeStore = loadLookupBundle();
      // After seed load: persist it, but only when bundleId changed.
      const cachedBundleId =
        cached && typeof cached.manifest?.bundleId === 'string'
          ? cached.manifest.bundleId
          : null;
      const embeddedBundleId = activeStore.manifest.bundleId;
      if (cachedBundleId !== embeddedBundleId) {
        await saveBundle({
          manifest: activeStore.manifest,
          medications: activeStore.medications,
          algorithms: activeStore.algorithms,
        });
      }
      return 'embedded' as const;
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
  activeStore = loadLookupBundle();
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
export function getActiveLookupProvisionSource(): LookupProvisionSource {
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
