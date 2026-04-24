/**
 * Lookup source labels kept only for diagnostics and legacy type compatibility.
 *
 * Productive mobile content initialization is centralized in:
 * `initializeContentFromLookupBundle()` -> `contentIndex.ts`
 */
export type LookupSource =
  | 'resolved'
  | 'embedded'
  | 'cached'
  | 'updated'
  | 'fallback';

export type LookupProvisionSource = LookupSource;

export type BundleMeta = {
  bundleId: string;
  version: string | null;
  generatedAt: string | null;
  schemaVersion: string;
};

export type LookupSourceDescriptor = {
  provisionSource: LookupSource;
  manifest: {
    bundleId: string;
    version?: string | null;
    generatedAt?: string | null;
    createdAt?: string | null;
    schemaVersion: string;
  };
};
