export type LookupBundleUpdate = {
  bundleUrl: string;
  bundleId: string;
  generatedAt: string;
};

/**
 * Optional update hook placeholder for Phase 3.
 * No API call yet; return `null` until a backend endpoint is connected.
 */
export async function checkForBundleUpdate(): Promise<LookupBundleUpdate | null> {
  return null;
}
